export type TransportType = "tcp" | "ws" | "httpupgrade" | "grpc";
export type ResolveStrategy = "ipv4_only" | "prefer_ipv4";
export type Protocol =
    | "http"
    | "socks"
    | "shadowsocks"
    | "vless"
    | "trojan"
    | "vmess"
    | "wireguard"
    | "selector"
    | "urltest"
    | "direct";

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

export interface DnsServer {
    type: string;
    server?: string;
    predefined?: Record<string, string[] | undefined>;
    inet4_range?: string;
    inet6_range?: string;
    detour?: string;
    domain_resolver?: {
        server: string;
        strategy: ResolveStrategy;
    };
    tag: string;
}

export interface DnsRule {
    type?: "logical";
    clash_mode?: "Global" | "Direct";
    mode?: "and";
    rules?: unknown[];
    rule_set?: string[] | string;
    domain?: string[];
    domain_suffix?: string[];
    ip_accept_any?: true;
    inbound?: string;
    query_type?: Array<"A" | "AAAA">;
    action?: "route" | "reject";
    server?: string;
}

export interface Dns {
    servers: DnsServer[];
    rules: DnsRule[];
    strategy: ResolveStrategy;
    independent_cache: true;
}

export interface TunInbound {
    type: "tun";
    tag: "tun-in";
    address: string[];
    mtu: 9000;
    auto_route: true;
    strict_route: true;
    stack: "mixed";
}

export interface MixedInbound {
    type: "mixed";
    tag: "mixed-in";
    listen: string;
    listen_port: 2080;
}

export interface RoutingRule {
    rule_set?: string[];
    domain_suffix?: string[];
    ip_cidr?: string[] | string;
    ip_is_private?: true;
    network?: "tcp" | "udp";
    protocol?: "http" | "tls" | "quic" | "dns";
    port?: number;
    clash_mode?: "Global" | "Direct";
    action?: "route" | "reject" | "hijack-dns" | "sniff";
    outbound?: string;
}

export interface RuleSet {
    type: "remote";
    tag: string;
    format: "binary";
    url: string;
    download_detour: string;
}

export interface Route {
    rules: RoutingRule[];
    rule_set?: RuleSet[];
    auto_detect_interface: true;
    default_domain_resolver: {
        server: string;
        strategy: ResolveStrategy;
        rewrite_ttl: number;
    };
    final: string;
}

export interface TLS {
    enabled: true;
    server_name: string;
    record_fragment?: boolean;
    insecure: boolean;
    alpn?: string[];
    utls: {
        enabled: boolean;
        fingerprint?: Fingerprint;
    };
    reality?: {
        enabled: true;
        public_key: string;
        short_id: string;
    };
}

export interface HttpTransport {
    type: "http";
    host: string[];
    path: string;
    method: "GET";
    headers: Record<string, string[]>
}

export interface WsTransport {
    type: "ws";
    path: string;
    headers?: {
        Host?: string;
    };
    max_early_data?: number;
    early_data_header_name?: "Sec-WebSocket-Protocol";
}

export interface HttpupgradeTransport {
    type: "httpupgrade";
    host?: string;
    path: string;
}

export interface GrpcTransport {
    type: "grpc";
    service_name?: string;
}

export type Transport =
    | HttpTransport
    | WsTransport
    | HttpupgradeTransport
    | GrpcTransport;

export interface BaseOutbound {
    tag: string;
    type: Protocol;
    server?: string;
    server_port?: number;
    tcp_fast_open?: boolean;
    detour?: string;
}

export interface SocksOutbound extends BaseOutbound {
    username?: string;
    password?: string;
    version: "5";
    network: "tcp";
}

export interface HttpOutbound extends BaseOutbound {
    username?: string;
    password?: string;
}

export interface ShadowsocksOutbound extends BaseOutbound {
    password: string;
    method: string;
    network: "tcp";
}

export interface TrojanOutbound extends BaseOutbound {
    password: string;
    network: "tcp";
    tls?: TLS;
    transport?: Transport
};

export interface VlessOutbound extends BaseOutbound {
    uuid: string;
    flow?: "xtls-rprx-vision";
    packet_encoding: "";
    network: "tcp";
    tls?: TLS;
    transport?: Transport
};

export interface VmessOutbound extends BaseOutbound {
    uuid: string;
    security: "auto";
    packet_encoding: "";
    network: "tcp";
    tls?: TLS;
    transport?: Transport
};

export type AnyOutbound =
    | HttpOutbound
    | SocksOutbound
    | ShadowsocksOutbound
    | VlessOutbound
    | VmessOutbound
    | TrojanOutbound;

export interface WireguardEndpoint {
    tag: string;
    type: string;
    address: string[];
    mtu: 1280;
    peers: unknown[];
    private_key: string;
    detour?: string;
}

export interface Selector {
    type: "selector";
    tag: string;
    outbounds: string[];
    interrupt_exist_connections: false;
}

export interface URLTest {
    type: "urltest";
    tag: string;
    outbounds: string[];
    url?: string;
    interval?: string;
    interrupt_exist_connections: false;
}

export interface Config {
    log: unknown;
    dns: Dns;
    inbounds: Array<TunInbound | MixedInbound>;
    outbounds: Array<BaseOutbound | AnyOutbound | Selector | URLTest>;
    endpoints?: WireguardEndpoint[];
    route: Route;
    ntp: unknown;
    experimental: unknown;
}