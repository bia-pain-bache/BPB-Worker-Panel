import { isValidUUID } from './helpers.js';
const proxyIPs = ['bpb.yousef.isegaro.com'];
let userID, dohURL, proxyIP, trojanPassword, defaultHttpPorts, defaultHttpsPorts, panelVersion;

function initParams(env) {
    userID = env.UUID || '89b3cbba-e6ac-485a-9481-976a0415eab9';
    if (!isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`);
    dohURL = env.DOH_URL || 'https://cloudflare-dns.com/dns-query';
    proxyIP = env.PROXYIP || proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
    trojanPassword = env.TROJAN_PASS || 'bpb-trojan';
    defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
    defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
    panelVersion = '2.7.2';
}

export function initializeParams(env) {
    initParams(env);
    return Promise.resolve();
}

export { userID, dohURL, proxyIP, trojanPassword, defaultHttpPorts, defaultHttpsPorts, panelVersion };
