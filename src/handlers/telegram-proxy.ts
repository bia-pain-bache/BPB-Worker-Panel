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

/** Stable panel error codes for docs mapping later. */
export const TWP_ERROR = {
    UNAUTHORIZED: 2101,
    UNAVAILABLE: 2110,
    SECRET_INVALID: 2120,
    DO_HEALTH: 2121,
    TCP_TELEGRAM: 2122,
    RESET_FAILED: 2198,
    NETWORK: 2199
} as const;

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

async function probeTcp(hostname: string, port: number, timeoutMs: number): Promise<boolean> {
    try {
        const { connect } = await import('cloudflare:sockets');
        const socket = connect({ hostname, port });
        const result = await Promise.race([
            socket.opened.then(() => true),
            new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs))
        ]);
        try { socket.close(); } catch { /* ignore */ }
        return result;
    } catch {
        return false;
    }
}

export async function getTelegramProxyLink(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.', null, NO_STORE);
    }
    if (!(await authenticate(request, env))) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', null, NO_STORE);
    }

    const { deployType, hostname, mainDomain } = getGlobals();
    if (deployType === 'pages' || !env.SESSIONS) {
        return respond(true, HttpStatus.OK, 'Telegram Web Proxy is only available on Workers.', {
            unavailable: true,
            code: TWP_ERROR.UNAVAILABLE
        }, NO_STORE);
    }

    const secret = env.PROXY_SECRET;
    if (!secret || !SECRET_HEX_RE.test(String(secret))) {
        return respond(true, HttpStatus.OK, 'Secret not configured — use Reset Secret', {
            connectionUrl: null,
            code: TWP_ERROR.SECRET_INVALID
        }, NO_STORE);
    }

    const host = hostname || mainDomain;
    return respond(true, HttpStatus.OK, undefined, {
        connectionUrl: buildConnectionUrl(host, String(secret))
    }, NO_STORE);
}

export async function testTelegramProxy(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.', null, NO_STORE);
    }
    if (!(await authenticate(request, env))) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', {
            overall: 'fail',
            code: TWP_ERROR.UNAUTHORIZED
        }, NO_STORE);
    }

    const { deployType } = getGlobals();
    if (deployType === 'pages' || !env.SESSIONS) {
        return respond(true, HttpStatus.OK, 'خطا', { overall: 'fail', code: TWP_ERROR.UNAVAILABLE }, NO_STORE);
    }

    const secret = env.PROXY_SECRET;
    if (!secret || !SECRET_HEX_RE.test(String(secret))) {
        return respond(true, HttpStatus.OK, 'خطا', { overall: 'fail', code: TWP_ERROR.SECRET_INVALID }, NO_STORE);
    }

    try {
        const id = env.SESSIONS.idFromName('__bpb_twp_health__');
        const stub = env.SESSIONS.get(id);
        const res = await stub.fetch('https://session/internal/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        });
        if (!(res.ok || res.status === 204)) {
            return respond(true, HttpStatus.OK, 'خطا', { overall: 'fail', code: TWP_ERROR.DO_HEALTH }, NO_STORE);
        }
    } catch {
        return respond(true, HttpStatus.OK, 'خطا', { overall: 'fail', code: TWP_ERROR.DO_HEALTH }, NO_STORE);
    }

    const tcpOk = await probeTcp(TELEGRAM_DC, 443, TCP_TIMEOUT_MS);
    if (!tcpOk) {
        return respond(true, HttpStatus.OK, 'خطا', { overall: 'fail', code: TWP_ERROR.TCP_TELEGRAM }, NO_STORE);
    }

    return respond(true, HttpStatus.OK, 'موفق', { overall: 'ok' }, NO_STORE);
}

export async function resetTelegramProxySecret(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.', null, NO_STORE);
    }
    if (!(await authenticate(request, env))) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', {
            code: TWP_ERROR.UNAUTHORIZED
        }, NO_STORE);
    }
    const { deployType, accID, apiToken, mainDomain, hostname } = getGlobals();
    if (deployType === 'pages') {
        return respond(false, HttpStatus.BAD_REQUEST, 'Only available on Workers.', {
            code: TWP_ERROR.UNAVAILABLE
        }, NO_STORE);
    }
    if (!accID || !apiToken || !mainDomain) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, 'Missing server-side account configuration.', {
            code: TWP_ERROR.RESET_FAILED
        }, NO_STORE);
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
            return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, sanitizeCloudflareError(msg), {
                code: TWP_ERROR.RESET_FAILED
            }, NO_STORE);
        }
        return respond(true, HttpStatus.OK, 'موفق', {
            connectionUrl: buildConnectionUrl(workerHost, newSecret)
        }, NO_STORE);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, sanitizeCloudflareError(error), {
            code: TWP_ERROR.NETWORK
        }, NO_STORE);
    }
}
