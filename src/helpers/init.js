import { isValidUUID } from "./helpers";

export function init(request, env) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const NAT64Prefixes = ['[2a02:898:146:64::]', '[2602:fc59:b0:64::]', '[2602:fc59:11:64::]'];
    const defaultNAT64Prefix = NAT64Prefixes[Math.floor(Math.random() * NAT64Prefixes.length)];
    globalThis.panelVersion = __VERSION__;
    globalThis.defaultHttpPorts = [80, 8080, 2052, 2082, 2086, 2095, 8880];
    globalThis.defaultHttpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
    globalThis.userID = env.UUID;
    globalThis.TRPassword = env.TR_PASS;
    globalThis.proxyMode = searchParams.get('mode') || 'proxyip';
    globalThis.proxyIPs = env.PROXY_IP || atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==');
    globalThis.nat64 = env.NAT64_PREFIX || defaultNAT64Prefix;
    globalThis.hostName = request.headers.get('Host');
    globalThis.pathName = url.pathname;
    globalThis.client = searchParams.get('app');
    globalThis.urlOrigin = url.origin;
    globalThis.dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    globalThis.fallbackDomain = env.FALLBACK || 'speed.cloudflare.com';
    globalThis.subPath = env.SUB_PATH || globalThis.userID;
    if (!['/secrets', '/favicon.ico'].includes(globalThis.pathName)) {
        if (typeof env.kv !== 'object') throw new Error('KV Dataset is not properly set! Please refer to tutorials.', { cause: "init" });
        if (!globalThis.userID || !globalThis.TRPassword) throw new Error(`Please set UUID and ${atob('VHJvamFu')} password first. Please visit <a href="${globalThis.urlOrigin}/secrets" target="_blank">here</a> to generate them.`, { cause: "init" });
        if (!isValidUUID(globalThis.userID)) throw new Error(`Invalid UUID: ${globalThis.userID}`, { cause: "init" });
    }
}