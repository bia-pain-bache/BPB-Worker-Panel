const proxyIPs = ['bpb.yousef.isegaro.com'];
export const configs = {
    userID: '89b3cbba-e6ac-485a-9481-976a0415eab9',
    dohURL: 'https://cloudflare-dns.com/dns-query',
    proxyIP: proxyIPs[Math.floor(Math.random() * proxyIPs.length)],
    trojanPassword: 'bpb-trojan',
    defaultHttpPorts: ['80', '8080', '2052', '2082', '2086', '2095', '8880'],
    defaultHttpsPorts: ['443', '8443', '2053', '2083', '2087', '2096'],
    panelVersion: '2.7.2'
};
