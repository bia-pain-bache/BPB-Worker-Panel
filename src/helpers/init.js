import { isValidUUID } from "./helpers";

const defaultProxyIP = 'bpb.yousef.isegaro.com';
let userID, dohURL, proxyIP, trojanPassword, defaultHttpPorts, defaultHttpsPorts, panelVersion, hostName, origin, client, pathName;

function initParams(request, env) {
    const proxyIPs = env.PROXYIP?.split(',').map(proxyIP => proxyIP.trim());
    userID = env.UUID;
    trojanPassword = env.TROJAN_PASS;
    const url = new URL(request.url);
    pathName = url.pathname;
    if (pathName !== '/secrets') {
        if (!userID || !trojanPassword) throw new Error("Please set UUID and Trojan password first.");
        if (userID && !isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`);
    }
    dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    proxyIP = proxyIPs ? proxyIPs[Math.floor(Math.random() * proxyIPs.length)] : defaultProxyIP;
    defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
    defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
    panelVersion = '2.7.7';
    hostName = request.headers.get('Host');
    const searchParams = new URLSearchParams(url.search);
    client = searchParams.get('app');
    origin = url.origin;
}

export async function initializeParams(request, env) {
    initParams(request, env);
    return Promise.resolve();
}

export { userID, dohURL, proxyIP, trojanPassword, hostName, origin, client, pathName, defaultHttpPorts, defaultHttpsPorts, panelVersion };
