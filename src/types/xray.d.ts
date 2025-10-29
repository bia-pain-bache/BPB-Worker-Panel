export type DnsHosts = Record<string, string[]>
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

export interface DnsServer {
    address: string;
    domains?: string[];
    expectIPs?: string[];
    skipFallback?: boolean;
    finalQuery?: boolean;
    tag?: string;
}

export interface Dns {
    hosts?: DnsHosts;
    servers: Array<"fakedns" | DnsServer>;
    queryStrategy: DomainStrategy;
    tag: "dns";
}

export interface RoutingRule {
    inboundTag?: string[];
    domain?: string[];
    ip?: string[];
    port?: number | string;
    network?: "tcp" | "udp" | "tcp,udp";
    protocol?: Array<"http" | "tls" | "bittorrent" | "quic">;
    outboundTag?: string;
    balancerTag?: string
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
    enableConcurrency: true;
}

interface Mux {
    enabled: true;
    concurrency: 8;
    xudpConcurrency: 16;
    xudpProxyUDP443: "reject";
}

export interface TlsSettings {
    serverName: string;
    fingerprint: Fingerprint;
    alpn?: string[];
    allowInsecure: boolean;
}

export interface RealitySettings {
    serverName: string;
    publicKey: string;
    shortId: string;
    spiderX: string;
    fingerprint: Fingerprint;
    allowInsecure: false;
    show: false;
}

export interface TcpHeader {
    type: "http" | "none";
    request?: {
        headers: {
            "Host": string[];
            "Accept-Encoding": ["gzip, deflate"];
            "Connection": ["keep-alive"];
            "Pragma": "no-cache";
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
    sockopt: Sockopt;
}

interface BlockholeSettings {
    response: {
        type: "http";
    };
}

interface DnsOutSettings {
    nonIPQuery: "reject";
}

interface Fragment {
    packets: "tlshello" | "1-1" | "1-2" | "1-3" | "1-5";
    length: string;
    interval: string;
    maxSplit?: string;
}

export interface Noise {
    type: 'rand' | 'base64' | 'hex' | 'str';
    packet: string;
    delay: string;
}

export interface FreedomSettings {
    fragment?: Fragment;
    noises?: Noise[];
    domainStrategy?: DomainStrategy;
}

export interface HttpSocksSettings {
    address: string;
    port: number;
    user: string;
    pass: string;
    level: 8
}

export interface SsSettings {
    address: string;
    port: number;
    method: string;
    password: string;
    ota: false,
    level: 8
}

export interface VlSettings {
    address: string;
    port: number;
    id: string;
    flow?: "xtls-rprx-vision";
    encryption: "none",
    level: 8
}

export interface VmSettings {
    address: string;
    port: number;
    id: string;
    security: "auto";
    level: 8
}

export interface TrSettings {
    address: string;
    port: number;
    password: string;
    level: 8
}

export interface WgSettings {
    address: string[];
    mtu: 1280;
    peers: [
        {
            endpoint: string;
            publicKey: string;
            keepAlive: number;
        }
    ];
    reserved: number[];
    secretKey: string;
    wnoise?: string;
    wnoisecount?: string;
    wpayloadsize?: string;
    wnoisedelay?: string;
}

export type AnyOutboundSettings = 
    | DnsOutSettings 
    | BlockholeSettings 
    | FreedomSettings 
    | HttpSocksSettings 
    | SsSettings 
    | VlSettings 
    | VmSettings 
    | TrSettings;

export interface Outbound {
    protocol: Protocol;
    mux?: Mux;
    settings: AnyOutboundSettings | WgSettings;
    streamSettings?: StreamSettings;
    tag: string;
}

export interface Config {
    remarks: string;
    log: unknown;
    dns: Dns;
    inbounds: unknown[];
    outbounds: Outbound[];
    policy: unknown;
    routing: Routing,
    observatory?: Observatory;
    stats: {};
}