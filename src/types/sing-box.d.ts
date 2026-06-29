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
    rules?: { rule_set: string | string[]; }[];
    rule_set?: string[] | string;
    domain?: string[];
    domain_suffix?: string[];
    ip_accept_any?: boolean;
    inbound?: string;
    query_type?: Array<"A" | "AAAA" | "HTTPS">;
    action?: "route" | "reject";
    server?: string;
}

export interface DNS {
    servers: DnsServer[];
    rules: DnsRule[];
    strategy: ResolveStrategy;
    independent_cache: boolean;
}

export interface TunInbound {
    type: "tun";
    tag: "tun-in";
    address: string[];
    mtu: number;
    auto_route: boolean;
    strict_route: boolean;
    stack: "mixed" | "gvisor" | "system";
}

export interface MixedInbound {
    type: "mixed";
    tag: "mixed-in";
    listen: string;
    listen_port: number;
}

export interface RoutingRule {
    rule_set?: string[];
    domain_suffix?: string[];
    ip_cidr?: string[] | string;
    ip_is_private?: boolean;
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
    auto_detect_interface: boolean;
    final: string;
}

export interface TLS {
    enabled: boolean;
    server_name: string;
    record_fragment?: boolean;
    insecure: boolean;
    alpn?: string[];
    utls: {
        enabled: boolean;
        fingerprint?: Fingerprint;
    };
    reality?: {
        enabled: boolean;
        public_key: string;
        short_id: string;
    };
    ech?: {
        enabled: boolean;
        query_server_name?: string;
    };
}

export interface HttpTransport {
    type: "http";
    host?: string[];
    path: string;
    method: "GET";
    headers: Record<string, string[]>;
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
    domain_resolver?: string;
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
    transport?: Transport;
}

export interface VlessOutbound extends BaseOutbound {
    uuid: string;
    flow?: "xtls-rprx-vision";
    packet_encoding?: "";
    network: "tcp";
    tls?: TLS;
    transport?: Transport;
}

export interface VmessOutbound extends BaseOutbound {
    uuid: string;
    security: "auto";
    alter_id: number;
    packet_encoding?: "";
    network: "tcp";
    tls?: TLS;
    transport?: Transport;
}

export interface Selector {
    type: "selector";
    tag: string;
    outbounds: string[];
    interrupt_exist_connections: boolean;
}

export interface URLTest {
    type: "urltest";
    tag: string;
    outbounds: string[];
    url: string;
    interval: string;
    interrupt_exist_connections: boolean;
}

export type Outbound =
    | BaseOutbound
    | HttpOutbound
    | SocksOutbound
    | ShadowsocksOutbound
    | VlessOutbound
    | VmessOutbound
    | TrojanOutbound
    | Selector
    | URLTest;

export type ChainOutbound = Exclude<Outbound, Selector | URLTest>;

export interface Peer {
    address: string;
    port: number;
    public_key: string;
    reserved: number[];
    allowed_ips: string[];
    persistent_keepalive_interval: number;
}

export interface WireguardEndpoint {
    tag: string;
    type: "wireguard";
    address: string[];
    mtu: number;
    peers: Peer[];
    private_key: string;
    detour?: string;
    domain_resolver?: string;
}

interface Log {
    disabled: boolean;
    level?: "warn" | "error" | "debug" | "info";
    timestamp: boolean;
}

interface NTP {
    enabled: boolean;
    server: string;
    server_port: number;
    domain_resolver: string;
    interval: string;
    write_to_system: boolean;
}

interface Experimental {
    cache_file: {
        enabled: boolean;
        store_fakeip: boolean;
    };
    clash_api: {
        external_controller: string;
        external_ui: string;
        default_mode: "Rule";
        external_ui_download_url: string;
        external_ui_download_detour: "direct";
    };
}

export interface Config {
    log: Log;
    dns: DNS;
    inbounds: Array<TunInbound | MixedInbound>;
    outbounds: Outbound[];
    endpoints?: WireguardEndpoint[];
    route: Route;
    ntp: NTP;
    experimental: Experimental;
}