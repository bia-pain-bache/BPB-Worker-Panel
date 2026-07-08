export interface KvSettings {
    localDNS: string;
    antiSanctionDNS: string;
    fakeDNS: boolean;
    enableIPv6: boolean;
    allowLANConnection: boolean;
    logLevel: LogLevel;
    customDomain: string;
    remoteDNS: string;
    remoteDnsHost: DnsHost;
    upstreamProxy: string;
    upstreamParams: UpstreamProxy;
    chainProxy: string;
    chainProxyParams: any;
    cleanIPs: string[];
    customCdnAddrs: string[];
    customCdnHost: string;
    customCdnSni: string;
    bestPingInterval: number;
    protocols: string;
    ports: number[];
    fingerprint: Fingerprint;
    enableTFO: boolean;
    fragmentMode: FragmentMode;
    fragmentLengthMin: number;
    fragmentLengthMax: number;
    fragmentDelayMin: number;
    fragmentDelayMax: number;
    fragmentPackets: FragmentPacket;
    fragmentMaxSplitMin?: number;
    fragmentMaxSplitMax?: number;
    enableECH: boolean;
    echServerName: string;
    bypassIran: boolean;
    bypassChina: boolean;
    bypassRussia: boolean;
    bypassOpenAi: boolean;
    bypassGoogleAi: boolean;
    bypassMicrosoft: boolean;
    bypassOracle: boolean;
    bypassDocker: boolean;
    bypassAdobe: boolean;
    bypassEpicGames: boolean;
    bypassIntel: boolean;
    bypassAmd: boolean;
    bypassNvidia: boolean;
    bypassAsus: boolean;
    bypassHp: boolean;
    bypassLenovo: boolean;
    blockAds: boolean;
    blockPorn: boolean;
    blockUDP443: boolean;
    blockMalware: boolean;
    blockPhishing: boolean;
    blockCryptominers: boolean;
    customBypassRules: string[];
    customBlockRules: string[];
    customBypassSanctionRules: string[];
    warpRemoteDNS: string;
    warpEndpoints: string[];
    warpBestPingInterval: number;
    xrayUdpNoises: XrUdpNoise[];
    knockerNoiseMode: string;
    knockerNoiseCountMin: number;
    knockerNoiseCountMax: number;
    knockerNoiseSizeMin: number;
    knockerNoiseSizeMax: number;
    knockerNoiseDelayMin: number;
    knockerNoiseDelayMax: number;
    amneziaNoiseCount: number;
    amneziaNoiseSizeMin: number;
    amneziaNoiseSizeMax: number;
    customSubs: string[];
    customConfigs: string[];
    panelVersion: string;
}

export interface TelegramBot {
    telegramBotToken: string;
    telegramUserId: string;
}

export interface EmbededSettings {
    accID: string;
    accEmail: string;
    apiToken: string;
    vlUUID: string;
    trPass: string;
    securePath: string;
    proxyIpMode: string;
    proxyIPs: string[];
    prefixes: string[];
    fallback: string;
    dohUrl: string;
    mainDomain: string;
    deployType?: string;
}

export interface ReqSettings {
    httpPorts: number[];
    httpsPorts: number[];
    client: string;
    origin: string;
    pathname: string;
    hostname: string;
}

export interface PanelSettings extends KvSettings, MainSettings { };
export interface MainSettings extends Omit<EmbededSettings, 'accID' | 'apiToken' | 'mainDomain'> { }

export type LogLevel = 'none' | 'warning' | 'error' | 'info' | 'debug';
export type FragmentMode = 'custom' | 'low' | 'medium' | 'high';
export type FragmentPacket = 'tlshello' | '1-1' | '1-2' | '1-3' | '1-5';
export type Fingerprint =
    | 'chrome'
    | 'firefox'
    | 'safari'
    | 'ios'
    | 'android'
    | 'edge'
    | '360'
    | 'qq'
    | 'random'
    | 'randomized';

export interface UpstreamProxy {
    upstreamServer?: string;
    upstreamPort?: number;
}

export interface DnsHost {
    host: string;
    isDomain: boolean;
    ipv4: string[];
    ipv6: string[];
}

export interface XrUdpNoise {
    type: 'rand' | 'str' | 'base64' | 'hex' | 'array';
    packet: string;
    delay: string;
    count: number;
}

export interface WarpAccount {
    privateKey: string;
    publicKey: string;
    warpIPv6: string;
    reserved: string;
}

interface ClientCategory {
    core: 'xray' | 'xray-knocker' | 'sing-box' | 'clash' | 'wireguard' | 'amnezia';
    clients: string[];
}

export interface SubsCategory {
    label: 'Normal' | 'Fragment' | 'Raw' | 'Warp' | 'Warp Pro';
    categories: ClientCategory[]; 
}