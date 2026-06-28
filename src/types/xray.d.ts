export type DnsHosts = Record<string, string[] | string>
export type DomainStrategy = "UseIP" | "UseIPv4" | "UseIPv4v6";
export type TransportType = "tcp" | "raw" | "ws" | "httpupgrade" | "grpc";
export type Protocol =
    | "http"
    | "socks"
    | "shadowsocks"
    | "vless"
    | "trojan"
    | "vmess"
    | "wireguard"
    | "dns"
    | "freedom"
    | "blackhole";

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

export type DnsServer = {
    address: string;
    domains?: string[];
    expectIPs?: string[];
    skipFallback?: boolean;
    finalQuery?: boolean;
    tag?: string;
} | "fakedns";

export interface DNS {
    hosts?: DnsHosts;
    servers: Array<"fakedns" | DnsServer>;
    queryStrategy: DomainStrategy;
    tag: "dns";
}

interface Sniffing {
    destOverride: Array<"http" | "tls" | "quic" | "fakedns">;
    enabled: true;
    routeOnly: true;
}

export interface MixedInbound {
    listen: string;
    port: number;
    protocol: "socks" | "mixed";
    settings: {
        auth: "noauth";
        udp: true;
    };
    sniffing: Sniffing;
    tag: "mixed-in";
}

export interface TunInbound {
    protocol: "tun";
    settings: {
        mtu: number;
        name: "xray0";
    };
    sniffing: Sniffing;
    tag: "tun";
}

export interface DokodemoDoorInbound {
    listen: string;
    port: number;
    protocol: "dokodemo-door";
    settings: {
        address: string;
        network: "tcp,udp";
        port: number;
    };
    tag: "dns-in";
}

export interface RoutingRule {
    inboundTag?: string[];
    domain?: string[];
    ip?: string[];
    port?: number | string;
    network?: "tcp" | "udp" | "tcp,udp";
    protocol?: Array<"http" | "tls" | "bittorrent" | "quic">;
    outboundTag?: string;
    balancerTag?: string;
    type: "field";
}

export interface Balancer {
    tag: string;
    selector: string[];
    fallbackTag?: string;
    strategy: {
        type: "leastPing";
    };
}

interface Routing {
    domainStrategy: "IPIfNonMatch";
    rules: RoutingRule[];
    balancers?: Balancer[];
}

export interface Observatory {
    subjectSelector: string[];
    probeUrl: string;
    probeInterval: string;
    enableConcurrency: boolean;
}

interface Mux {
    enabled: boolean;
    concurrency: number;
    xudpConcurrency: number;
    xudpProxyUDP443: "reject";
}

export interface TlsSettings {
    serverName: string;
    fingerprint: Fingerprint;
    alpn?: string[];
    echConfigList?: string;
}

export interface RealitySettings {
    serverName: string;
    publicKey: string;
    shortId: string;
    spiderX: string;
    fingerprint: Fingerprint;
    allowInsecure: boolean;
    show: boolean;
}

export interface TcpHeader {
    type: "http" | "none";
    request?: {
        headers: {
            "Host"?: string[];
            "Accept-Encoding": string[];
            "Connection": string[];
            "Pragma": string;
        };
        method: "GET";
        path: string[];
        version: "1.1";
    };
}

export interface RawSettings {
    header: TcpHeader;
}

export interface WsSettings {
    host?: string;
    path: string;
}

export interface HttpupgradeSettings {
    host?: string;
    path: string;
}

export interface GrpcSettings {
    authority?: string;
    multiMode?: boolean;
    serviceName?: string;
}

export type Transport =
    | RawSettings
    | WsSettings
    | HttpupgradeSettings
    | GrpcSettings;

export interface HappyEyeballs {
    tryDelayMs: number;
    prioritizeIPv6: boolean;
    interleave: number;
    maxConcurrentTry: number;
}

export type FragmentPacket = "tlshello" | "1-1" | "1-2" | "1-3" | "1-5";

type TCPMask = {
    type: "fragment";
    settings: {
        packets: FragmentPacket;
        length: string;
        delay: string;
        maxSplit?: string;
    };
};

type UDPMask = {
    type: string;
    settings: {
        reset: string;
        noise: Noise[];
    };
};

export interface FinalMask {
    tcp?: TCPMask[];
    udp?: UDPMask[];
}

export interface Sockopt {
    dialerProxy?: string;
    domainStrategy?: DomainStrategy;
    tcpFastOpen?: boolean;
    happyEyeballs?: HappyEyeballs;
}

export interface StreamSettings {
    network?: TransportType;
    security?: "none" | "tls" | "reality";
    tlsSettings?: TlsSettings;
    realitySettings?: RealitySettings;
    rawSettings?: RawSettings;
    wsSettings?: WsSettings;
    httpupgradeSettings?: HttpupgradeSettings;
    grpcSettings?: GrpcSettings;
    sockopt?: Sockopt;
    finalmask?: FinalMask;
}

interface BlockholeSettings {
    response: {
        type: "http";
    };
}

interface DnsOutSettings {
    rules: Array<{
        action: "hijack";
    }>;
}

export interface Noise {
    rand?: string;
    randRange?: string;
    type?: "array" | "str" | "base64" | "hex";
    packet?: string | number[];
    delay: string;
}

export interface FreedomSettings {
    domainStrategy?: DomainStrategy;
}

export interface HttpSocksSettings {
    servers: Array<{
        address: string;
        port: number;
        users: Array<{
            user?: string;
            pass?: string;
        }>;
    }>;
}

export interface ShadowsocksSettings {
    servers: Array<{
        address: string;
        port: number;
        method?: string;
        password?: string;
    }>;
}

export interface VlessSettings {
    vnext: Array<{
        address: string;
        port: number;
        users: Array<{
            id: string;
            flow?: "xtls-rprx-vision";
            encryption: "none";
        }>;
    }>;
}

export interface VmessSettings {
    vnext: Array<{
        address: string;
        port: number;
        users: Array<{
            id: string;
            security: "auto";
        }>;
    }>;
}

export interface TrojanSettings {
    servers: Array<{
        address: string;
        port: number;
        password?: string;
    }>;
}

export interface WireguardSettings {
    address: string[];
    mtu: number;
    peers: Array<{
        endpoint: string;
        publicKey: string;
        keepAlive: number;
    }>;
    reserved: number[];
    secretKey: string;
    wnoise?: string;
    wnoisecount?: string;
    wpayloadsize?: string;
    wnoisedelay?: string;
}

type OutboundSettings =
    | DnsOutSettings
    | BlockholeSettings
    | FreedomSettings
    | HttpSocksSettings
    | ShadowsocksSettings
    | VlessSettings
    | VmessSettings
    | TrojanSettings
    | WireguardSettings;

export interface Outbound {
    protocol: Protocol;
    mux?: Mux;
    settings: OutboundSettings;
    streamSettings?: StreamSettings;
    tag: string;
}

interface Log {
    loglevel: "none" | "warning" | "error" | "info" | "debug";
}

interface Policy {
    levels: Record<number, {
        connIdle: number;
        handshake: number;
        uplinkOnly: number;
        downlinkOnly: number;
    }>;
    system: {
        statsOutboundUplink: boolean;
        statsOutboundDownlink: boolean;
    };
}

export interface Config {
    remarks: string;
    version: {
        min: string;
        max?: string;
    };
    log: Log;
    dns: DNS;
    inbounds: Array<MixedInbound | DokodemoDoorInbound | TunInbound>;
    outbounds: Outbound[];
    policy: Policy;
    routing: Routing;
    observatory?: Observatory;
    stats: Record<never, never>;
}