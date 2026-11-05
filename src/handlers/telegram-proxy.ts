import { authenticate } from '@auth';
import { respond, HttpStatus, safeError } from '@common';
import { getGlobals } from '@settings';

const NO_STORE = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0'
};
const SECRET_HEX_RE = /^(?:[0-9a-f]{32}|dd[0-9a-f]{32})$/;
const TELEGRAM_DC = '149.154.167.51';
const TCP_TIMEOUT_MS = 4000;

type CheckStatus = 'ok' | 'fail' | 'unavailable' | 'skip';
interface DiagnosticCheck { id: string; status: CheckStatus; detail: string; }

function sanitizeCloudflareError(error: unknown): string {
    const raw = safeError(error);
    return raw
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [redacted]')
        .replace(/[0-9a-f]{32,}/gi, '[redacted]')
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[redacted]')
        .slice(0, 200);
}

function generateProxySecret(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function buildConnectionUrl(host: string, secret: string): string {
    const url = new URL('https://t.me/webproxy');
    url.searchParams.set('server', host);
    url.searchParams.set('secret', secret);
    return url.toString();
}

async function probeTcp(hostname: string, port: number, timeoutMs: number): Promise<{ ok: boolean; detail: string }> {
    try {
        const { connect } = await import('cloudflare:sockets');
        const socket = connect({ hostname, port });
        const result = await Promise.race([
            socket.opened.then(() => ({ ok: true as const, detail: `TCP ${hostname}:${port} reachable` })),
            new Promise<{ ok: false; detail: string }>((resolve) =>
                setTimeout(() => resolve({ ok: false, detail: `TCP timeout after ${timeoutMs}ms` }), timeoutMs)
            )
        ]);
        try { socket.close(); } catch { /* ignore */ }
        return result;
    } catch (error) {
        return { ok: false, detail: `TCP probe failed: ${sanitizeCloudflareError(error)}` };
    }
}

async function checkDoHealth(env: Env): Promise<DiagnosticCheck> {
    if (!env.SESSIONS || typeof env.SESSIONS.get !== 'function') {
        return { id: 'durable_object', status: 'unavailable', detail: 'SESSIONS binding not present' };
    }
    try {
        const id = env.SESSIONS.idFromName('__bpb_twp_health__');
        const stub = env.SESSIONS.get(id);
        const res = await stub.fetch('https://session/internal/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        });
        if (res.ok || res.status === 204) {
            return { id: 'durable_object', status: 'ok', detail: 'Durable Object responded' };
        }
        return { id: 'durable_object', status: 'fail', detail: `DO health status ${res.status}` };
    } catch (error) {
        return { id: 'durable_object', status: 'fail', detail: sanitizeCloudflareError(error) };
    }
}

function checkSecretFormat(env: Env): DiagnosticCheck {
    const secret = env.PROXY_SECRET;
    if (!secret) return { id: 'proxy_secret', status: 'fail', detail: 'PROXY_SECRET is not set' };
    if (!SECRET_HEX_RE.test(String(secret))) {
        return { id: 'proxy_secret', status: 'fail', detail: 'PROXY_SECRET format invalid' };
    }
    return { id: 'proxy_secret', status: 'ok', detail: 'PROXY_SECRET present and format valid' };
}

export async function testTelegramProxy(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.', null, NO_STORE);
    }
    if (!(await authenticate(request, env))) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', null, NO_STORE);
    }
    const { deployType } = getGlobals();
    const checks: DiagnosticCheck[] = [];
    checks.push({ id: 'runtime', status: 'ok', detail: deployType === 'pages' ? 'Pages (TWP needs Workers)' : 'Worker runtime available' });
    if (deployType === 'pages' || !env.SESSIONS) {
        checks.push({ id: 'durable_object', status: 'unavailable', detail: 'SESSIONS binding missing' });
        checks.push(checkSecretFormat(env));
        checks.push({ id: 'tcp_telegram_dc', status: 'skip', detail: 'Skipped' });
        return respond(true, HttpStatus.OK, 'Diagnostics complete', { checks, overall: 'unavailable' }, NO_STORE);
    }
    checks.push(await checkDoHealth(env));
    checks.push(checkSecretFormat(env));
    const tcp = await probeTcp(TELEGRAM_DC, 443, TCP_TIMEOUT_MS);
    checks.push({ id: 'tcp_telegram_dc', status: tcp.ok ? 'ok' : 'fail', detail: tcp.detail });
    const overall = checks.some(c => c.status === 'fail') ? 'fail' : checks.some(c => c.status === 'unavailable') ? 'unavailable' : 'ok';
    return respond(true, HttpStatus.OK, 'Diagnostics complete', { checks, overall }, NO_STORE);
}

export async function resetTelegramProxySecret(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.', null, NO_STORE);
    }
    if (!(await authenticate(request, env))) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', null, NO_STORE);
    }
    const { deployType, accID, apiToken, mainDomain, hostname } = getGlobals();
    if (deployType === 'pages') {
        return respond(false, HttpStatus.BAD_REQUEST, 'Only available on Workers.', null, NO_STORE);
    }
    if (!accID || !apiToken || !mainDomain) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Missing server-side account configuration.', null, NO_STORE);
    }
    const scriptName = mainDomain.split('.')[0];
    const newSecret = generateProxySecret();
    const workerHost = hostname || mainDomain;
    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${encodeURIComponent(scriptName)}/secrets`,
            {
                method: 'PUT',
                headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'PROXY_SECRET', text: newSecret, type: 'secret_text' })
            }
        );
        let data: any = null;
        try { data = await res.json(); } catch { data = null; }
        if (!res.ok || !data?.success) {
            const msg = data?.errors?.[0]?.message || `Cloudflare API rejected secret update (HTTP ${res.status})`;
            return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, sanitizeCloudflareError(msg), null, NO_STORE);
        }
        return respond(true, HttpStatus.OK,
            'PROXY_SECRET updated. Copy the new connection link now; it will not be shown again.',
            { connectionUrl: buildConnectionUrl(workerHost, newSecret), secretShownOnce: true },
            NO_STORE);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Failed to update secret: ${sanitizeCloudflareError(error)}`, null, NO_STORE);
    }
}
