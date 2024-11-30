import { isValidUUID } from "./helpers";

export function initializeParams(request, env) {
    const defaultProxyIP = 'bpb.yousef.isegaro.com';
    const proxyIPs = env.PROXYIP?.split(',').map(proxyIP => proxyIP.trim());
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    globalThis.panelVersion = '2.7.7';
    globalThis.defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
    globalThis.defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
    globalThis.userID = env.UUID;
    globalThis.trojanPassword = env.TROJAN_PASS;
    globalThis.proxyIP = proxyIPs ? proxyIPs[Math.floor(Math.random() * proxyIPs.length)] : defaultProxyIP;
    globalThis.hostName = request.headers.get('Host');
    globalThis.pathName = url.pathname;
    globalThis.client = searchParams.get('app');
    globalThis.urlOrigin = url.origin;
    globalThis.dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    if (typeof env.bpb !== 'object') throw new Error('KV Dataset is not properly set! Please refer to tutorials.', { cause: "init"});
    if (pathName !== '/secrets') {
        if (!userID || !trojanPassword) throw new Error(`Please set UUID and Trojan password first. Please go to 🟢 https://${hostName}/secrets 🟢 to generate them.`, { cause: "init"});
        if (userID && !isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`, { cause: "init"});
    }

}