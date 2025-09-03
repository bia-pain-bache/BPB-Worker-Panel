import { isValidUUID } from "./helpers";

export function init(request, env, upgradeHeader) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    if (upgradeHeader === 'websocket') {
        const encodedPathConfig = url.pathname.replace("/", "") || '';
        const parseIPs = value => value ? value.split(',').map(val => val.trim()).filter(Boolean) : undefined;

        try {
            const { protocol, mode, panelIPs } = JSON.parse(atob(encodedPathConfig));
            globalThis.wsProtocol = protocol;
            globalThis.proxyMode = mode;
            globalThis.panelIPs = panelIPs;
            const proxyIPs = parseIPs(env.PROXY_IP) || [atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==')];
            const nat64Prefixes = parseIPs(env.NAT64_PREFIX) || [
                '[2a02:898:146:64::]',
                '[2602:fc59:b0:64::]',
                '[2602:fc59:11:64::]'
            ];
            
            let ips = [];

            if (mode === 'proxyip') {
                ips = panelIPs.length ? panelIPs : proxyIPs;
            } else if (mode === 'nat64') {
                ips = panelIPs.length ? panelIPs : nat64Prefixes;
            } else {
                return new Response('Not found', { status: 404 });
            }

            globalThis.proxyIP = ips[Math.floor(Math.random() * ips.length)];
        } catch (error) {
            return new Response('Failed to parse WebSocket path config', { status: 400 });
        }
    }

    globalThis.panelVersion = __VERSION__;
    globalThis.defaultHttpPorts = [80, 8080, 2052, 2082, 2086, 2095, 8880];
    globalThis.defaultHttpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
    globalThis.userID = env.UUID;
    globalThis.TRPassword = env.TR_PASS;
    globalThis.hostName = request.headers.get('Host');
    globalThis.pathName = url.pathname;
    globalThis.client = searchParams.get('app');
    globalThis.urlOrigin = url.origin;
    globalThis.dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    globalThis.fallbackDomain = env.FALLBACK || 'speed.cloudflare.com';
    globalThis.subPath = env.SUB_PATH || globalThis.userID;
    if (!['/secrets', '/favicon.ico'].includes(globalThis.pathName)) {
        if (!globalThis.userID || !globalThis.TRPassword) throw new Error(`Please set UUID and ${atob('VHJvamFu')} password first. Please visit <a href="${globalThis.urlOrigin}/secrets" target="_blank">here</a> to generate them.`, { cause: "init" });
        if (!isValidUUID(globalThis.userID)) throw new Error(`Invalid UUID: ${globalThis.userID}`, { cause: "init" });
        if (typeof env.kv !== 'object') throw new Error('KV Dataset is not properly set! Please refer to tutorials.', { cause: "init" });
    }
}