import { decompressGzipBase64, respond, HttpStatus } from '@common';
import { authenticate } from '@auth';
import { resolveDNS } from '@cores/utils';
import { getGlobals } from '@settings';
import { fallback } from './utils';
import { connect } from 'cloudflare:sockets';

export async function handleProxyIPs(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const auth = await authenticate(request, env);
    if (!auth) {
        const url = new URL('./login', request.url)
        return Response.redirect(url, 302);
    }

    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'proxy-ip':
            return renderProxyIPs();

        case 'proxy-ip/get':
            return getProxyIPsInfo();

        case 'proxy-ip/test':
            return testProxyIP(request);

        default:
            return fallback(request);
    }
}

async function renderProxyIPs() {
    const str = await decompressGzipBase64(PROXY_IP_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function getProxyIPsInfo(): Promise<Response> {
    const ips = await resolveDNS(_public_proxy_ip_, true);
    const geoLocInfo = await geoLookupBatch(ips.ipv4);
    return respond(
        true,
        HttpStatus.OK,
        undefined,
        geoLocInfo
    );
}

interface IpApiBatchResponse {
    query: string;
    city?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
    status: 'success' | 'fail';
    message?: string;
}

interface GeoResult {
    ip: string;
    city?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}

async function geoLookupBatch(ipList: string[]): Promise<GeoResult[]> {
    const batches = chunkArray(ipList, 100);
    const results: GeoResult[] = [];

    for (const batch of batches) {
        const res = await fetch(
            'http://ip-api.com/batch?fields=query,city,country,countryCode,isp,status',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch),
            }
        );

        if (!res.ok) {
            throw new Error(`ip-api request failed: ${res.status}`);
        }

        const data: IpApiBatchResponse[] = await res.json();

        for (const item of data) {
            if (item.status === 'success') {
                results.push({
                    ip: item.query,
                    city: item.city,
                    country: item.country,
                    countryCode: item.countryCode,
                    isp: item.isp,
                });
            }
        }
    }

    return results;
}

const DEFAULT_SNI = 'speed.cloudflare.com';
const TIMEOUT_MS = 5000;
const ATTEMPTS = 5;

interface Attempt {
    attempt: number;
    ok: boolean;
    elapsedMs: number;
}

async function checkProxyIP(address: string): Promise<Omit<Attempt, 'attempt'>> {
    const start = Date.now();
    const TEST_PATH = '/__down?bytes=5000';

    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    );

    try {
        const socket = connect({ hostname: address, port: 443 });
        const writer = socket.writable.getWriter();
        const req = `GET ${TEST_PATH} HTTP/1.1\r\nHost: ${DEFAULT_SNI}\r\nConnection: close\r\n\r\n`;

        await writer.write(new TextEncoder().encode(req));
        writer.releaseLock();
        const reader = socket.readable.getReader();

        const { value, done } = await Promise.race([reader.read(), timeout]);
        reader.releaseLock();
        await socket.close().catch(() => { });

        if (done || !value) {
            return { ok: false, elapsedMs: Date.now() - start };
        }

        const response = new TextDecoder().decode(value);
        const isOk = /^HTTP\/1\.[01] 400/.test(response);
        const hasCfRay = /cf-ray:/i.test(response);
        const isHealthy = isOk && hasCfRay;

        return {
            ok: isHealthy,
            elapsedMs: Date.now() - start
        };
    } catch (err) {
        return {
            ok: false,
            elapsedMs: Date.now() - start
        };
    }
}

async function testProxyIP(request: Request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('target') as string;
    const attemptPromises = Array.from({ length: ATTEMPTS }, (_, i) =>
        checkProxyIP(target).then(res => ({ attempt: i + 1, ...res }))
    );

    const attempts = await Promise.all(attemptPromises);
    const successes = attempts.filter((a) => a.ok);
    const avgLatencyMs = successes.length
        ? Math.round(successes.reduce((sum, a) => sum + a.elapsedMs, 0) / successes.length)
        : null;

    return respond(true, HttpStatus.OK, '', {
        successRate: `${successes.length}/${ATTEMPTS}`,
        avgLatencyMs,
        attempts,
    });
}


