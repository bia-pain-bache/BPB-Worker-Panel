type OptionalIntersection<T, U> = T | (T & U);
export type DnsHosts = Record<string, string[] | string>;
export type Network = "tcp" | "http" | "ws" | "httpupgrade" | "grpc";
export type Protocol =
    | "http"
    | "socks5"
    | "ss"
    | "vless"
    | "trojan"
    | "vmess"
    | "wireguard";

export type Fingerprint =
    | "chrome"
    | "firefox"
    | "safari"
    | "ios"
    | "android"
    | "edge"
    | "360"
    | "qq"
    | "random"
    | "randomized";

export interface FakeDNS {
    "fake-ip-range": string;
    "fake-ip-filter-mode": "blacklist" | "whitelist";
    "fake-ip-filter": string[];
}

type BaseDNS = {
    "enable": true;
    "listen": string;
    "ipv6": boolean;
    "respect-rules": true;
    "use-system-hosts": false;
    "enhanced-mode": "redir-host" | "fake-ip";
    "nameserver": string[];
    "proxy-server-nameserver": string[];
    "direct-nameserver": string[];
    "direct-nameserver-follow-policy": boolean;
    "nameserver-policy"?: Record<string, string>;
    "hosts"?: DnsHosts;
};

export type DNS = OptionalIntersection<BaseDNS, FakeDNS>;

export interface Tun {
    "enable": boolean;
    "stack": "mixed" | "gvisor" | "system";
    "auto-route": boolean;
    "strict-route": boolean;
    "auto-detect-interface": boolean;
    "dns-hijack": string[];
    "mtu": number;
}

export interface Sniffer {
    "enable": boolean;
    "force-dns-mapping": boolean;
    "parse-pure-ip": boolean;
    "override-destination": boolean;
    "sniff": {
        "HTTP": {
            "ports": number[];
        };
        "TLS": {
            "ports": number[];
        };
    };
}

export interface WsOpts {
    "path": string;
    "headers": {
        "Host"?: string;
    };
    "max-early-data"?: number;
    "early-data-header-name"?: "Sec-WebSocket-Protocol";
    "v2ray-http-upgrade"?: boolean;
    "v2ray-http-upgrade-fast-open"?: boolean;
    [key: string]: unknown;
}

export interface GrpcOpts {
    "grpc-service-name"?: string;
}

export interface HttpOpts {
    "method": "GET";
    "path": string[];
    "headers": {
        "Host"?: string[];
        "Connection": string[];
        "Content-Type": string[];
    };
}

export interface BaseOutbound {
    "name": string;
    "type": Protocol;
    "server": string;
    "port": number;
    "udp": boolean;
    "ip-version": "ipv4" | "ipv4-prefer";
    "tfo"?: boolean;
    "dialer-proxy"?: string;
}

export interface RealityOpts {
    "public-key": string;
    "short-id": string;
}

export type TLS = {
    "tls": boolean;
    "sni"?: string;
    "servername"?: string;
    "alpn"?: string[];
    "client-fingerprint"?: Fingerprint | "random";
    "skip-cert-verify": boolean;
    "reality-opts"?: RealityOpts;
    "ech-opts"?: {
        "enable": boolean;
        "query-server-name"?: string;
    };
};

export type Transport = {
    "network"?: Network;
    "ws-opts"?: WsOpts;
    "http-opts"?: HttpOpts;
    "grpc-opts"?: GrpcOpts;
};

export interface HttpOutbound extends BaseOutbound {
    "username"?: string;
    "password"?: string;
}

export interface SocksOutbound extends BaseOutbound {
    "username"?: string;
    "password"?: string;
}

export interface ShadowsocksOutbound extends BaseOutbound {
    "password"?: string;
    "cipher"?: string;
}

export type VlessOutbound = BaseOutbound & OptionalIntersection<{
    "uuid": string;
    "flow"?: "xtls-rprx-vision";
    "servername"?: string;
    "packet-encoding"?: "";
}, TLS> & Transport;

export type VmessOutbound = BaseOutbound & OptionalIntersection<{
    "uuid": string;
    "cipher": "auto";
    "alterId": number;
    "packet-encoding"?: "";
}, TLS> & Transport;

export type TrojanOutbound = BaseOutbound & {
    "password": string;
} & TLS & Transport;

export interface AmneziaOpts {
    "jc": number;
    "jmin": number;
    "jmax": number;
}

export interface WireguardOutbound extends BaseOutbound {
    "ip": string;
    "ipv6": string;
    "private-key": string;
    "public-key": string;
    "allowed-ips": string[];
    "reserved": string;
    "udp": true;
    "mtu": number;
    "amnezia-wg-option"?: AmneziaOpts;
}

export interface Selector {
    "name": string;
    "type": "select";
    "proxies": string[];
}

export interface URLTest {
    "name": string;
    "type": "url-test";
    "proxies": string[];
    "url"?: string;
    "interval"?: number;
    "tolerance"?: number;
}

export type Outbound =
    | HttpOutbound
    | SocksOutbound
    | ShadowsocksOutbound
    | VlessOutbound
    | VmessOutbound
    | TrojanOutbound
    | WireguardOutbound;

export type ChainOutbound = Exclude<Outbound, WireguardOutbound>;

export interface RuleProvider {
    "type": "http";
    "format": string;
    "behavior": "domain" | "ipcidr";
    "url": string;
    "path": string;
    "interval": number;
}

interface ExternalControllerCors {
    "allow-origins": string[];
    "allow-private-network": boolean;
}

interface Profile {
    "store-selected": boolean;
    "store-fake-ip": boolean;
}

interface NTP {
    "enable": boolean;
    "server": string;
    "port": number;
    "interval": number;
}

export interface Config {
    "mixed-port": number;
    "ipv6": boolean;
    "allow-lan": boolean;
    "mode": "rule";
    "log-level": string;
    "disable-keep-alive"?: boolean;
    "keep-alive-idle"?: number;
    "keep-alive-interval"?: number;
    "tcp-concurrent"?: boolean;
    "unified-delay": boolean;
    "geo-auto-update": boolean;
    "geo-update-interval": number;
    "external-controller": string;
    "external-controller-cors": ExternalControllerCors;
    "external-ui": string;
    "external-ui-url": string;
    "profile": Profile;
    "dns": DNS;
    "tun": Tun;
    "sniffer": Sniffer;
    "proxies": Outbound[];
    "proxy-groups": Array<Selector | URLTest>;
    "rule-providers"?: Record<string, RuleProvider>;
    "rules": string[];
    "ntp": NTP;
}