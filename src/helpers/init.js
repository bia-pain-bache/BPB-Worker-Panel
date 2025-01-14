import { isValidUUID } from "./helpers";

export function initializeParams(request, env) {
    const proxyIPs = env.PROXYIP?.split(',').map(proxyIP => proxyIP.trim());
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    globalThis.panelVersion = '3.0.1';
    globalThis.defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
    globalThis.defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
    globalThis.userID = env.UUID;
    globalThis.TRPassword = env.TR_PASS;
    globalThis.proxyIP = proxyIPs ? proxyIPs[Math.floor(Math.random() * proxyIPs.length)] : 'bpb.yousef.isegaro.com';
    globalThis.hostName = request.headers.get('Host');
    globalThis.pathName = url.pathname;
    globalThis.client = searchParams.get('app');
    globalThis.urlOrigin = url.origin;
    globalThis.dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    globalThis.fallbackDomain = env.FALLBACK || 'speed.cloudflare.com';
    globalThis.subPath = env.SUB_PATH || userID;
    if (pathName !== '/secrets') {
        if (!userID || !globalThis.TRPassword) throw new Error(`Please set UUID and Trojan password first. Please visit <a href="https://${hostName}/secrets" target="_blank">here</a> to generate them.`, { cause: "init"});
        if (userID && !isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`, { cause: "init"});
        if (typeof env.kv !== 'object') throw new Error('KV Dataset is not properly set! Please refer to tutorials.', { cause: "init"});
    }
}