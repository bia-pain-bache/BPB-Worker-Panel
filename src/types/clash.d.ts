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

export type DNS = OptionalIntersection<{
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
    "nameserver-policy"?: Record<string, string>
    "hosts"?: DnsHosts
}, FakeDNS>;

export interface Tun {
    "enable": true;
    "stack": "mixed" | "gvisor" | "system";
    "auto-route": true;
    "strict-route": true;
    "auto-detect-interface": true;
    "dns-hijack": [
        "any:53",
        "tcp://any:53"
    ];
    "mtu": 9000;
}

export interface Sniffer {
    "enable": true;
    "force-dns-mapping": true;
    "parse-pure-ip": true;
    "override-destination": true;
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
    "v2ray-http-upgrade"?: true;
    "v2ray-http-upgrade-fast-open"?: true;
}

export interface GrpcOpts {
    "grpc-service-name"?: string;
}

export interface HttpOpts {
    "method": "GET";
    "path": string[];
    "headers": {
        "Host"?: string[];
        "Connection": ["keep-alive"],
        "Content-Type": ["application/octet-stream"]
    };
}

export interface BaseOutbound {
    "name": string;
    "type": Protocol;
    "server": string;
    "port": number;
    "udp": boolean;
    "ip-version": "ipv4" | "ipv4-prefer";
    "tfo"?: true;
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
    "client-fingerprint"?: Fingerprint;
    "skip-cert-verify": boolean;
    "reality-opts"?: RealityOpts;
}

export type Transport = {
    "network"?: Network;
    "ws-opts"?: WsOpts;
    "http-opts"?: HttpOpts;
    "grpc-opts"?: GrpcOpts;
}

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
    "allowed-ips": string[]
    "reserved": string;
    "udp": true;
    "mtu": 1280;
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
    "allow-origins": ["*"];
    "allow-private-network": true;
}

interface Profile {
    "store-selected": true;
    "store-fake-ip": true;
}

interface NTP {
    "enable": true;
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
    "unified-delay": false;
    "geo-auto-update": true;
    "geo-update-interval": 168;
    "external-controller": string;
    "external-controller-cors": ExternalControllerCors;
    "external-ui": "ui";
    "external-ui-url": string;
    "profile": Profile;
    "dns": Dns;
    "tun": Tun;
    "sniffer": Sniffer;
    "proxies": Outbound[];
    "proxy-groups": Array<Selector | URLTest>;
    "rule-providers"?: Record<string, RuleProvider>;
    "rules": string[];
    "ntp": NTP;
}