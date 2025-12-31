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

export interface MixedInbound {
    listen: string;
    port: 10808;
    protocol: "socks" | "mixed";
    settings: {
        auth: "noauth";
        udp: true;
    };
    sniffing: {
        destOverride: Array<"http" | "tls" | "quic" | "fakedns">;
        enabled: true;
        routeOnly: true;
    };
    tag: "mixed-in";
}

export interface DokodemoDoorInbound {
    listen: string;
    port: 10853;
    protocol: "dokodemo-door";
    settings: {
        address: "1.1.1.1";
        network: "tcp,udp";
        port: 53;
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
    echConfigList?: string;
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
            "Host"?: string[];
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
    servers: [{
        address: string;
        port: number;
        users: [{
            user: string;
            pass: string;
        }];
    }];
}

export interface ShadowsocksSettings {
    servers: [{
        address: string;
        port: number;
        method: string;
        password: string;
    }];
}

export interface VlessSettings {
    vnext: [{
        address: string;
        port: number;
        users: [{
            id: string;
            flow?: "xtls-rprx-vision";
            encryption: "none";
        }];
    }]
}

export interface VmessSettings {
    vnext: [{
        address: string;
        port: number;
        users: [{
            id: string;
            security: "auto";
        }];
    }];
}

export interface TrojanSettings {
    servers: [{
        address: string;
        port: number;
        password: string;
    }];
}

export interface WireguardSettings {
    address: string[];
    mtu: 1280;
    peers: [{
        endpoint: string;
        publicKey: string;
        keepAlive: number;
    }];
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
        statsOutboundUplink: true;
        statsOutboundDownlink: true;
    };
}

export interface Config {
    remarks: string;
    version: {
        min: string;
        max?: string;
    };
    log: Log;
    dns: Dns;
    inbounds: Array<MixedInbound | DokodemoDoorInbound>;
    outbounds: Outbound[];
    policy: Policy;
    routing: Routing,
    observatory?: Observatory;
    stats: {};
}