import { Sniffer, Tun } from "types/clash";

export const tun: Tun = {
    "enable": true,
    "stack": "mixed",
    "auto-route": true,
    "strict-route": true,
    "auto-detect-interface": true,
    "dns-hijack": [
        "any:53",
        "tcp://any:53"
    ],
    "mtu": 9000
};

export const sniffer: Sniffer = {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": true,
    "sniff": {
        "HTTP": {
            "ports": [80, 8080, 8880, 2052, 2082, 2086, 2095]
        },
        "TLS": {
            "ports": [443, 8443, 2053, 2083, 2087, 2096]
        }
    }
};