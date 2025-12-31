import { getDataset } from "kv";
import { isValidUUID } from "@common";

globalThis.dict = {
    _VL_: atob('dmxlc3M='),
    _VL_CAP_: atob('VkxFU1M='),
    _VM_: atob('dm1lc3M='),
    _TR_: atob('dHJvamFu'),
    _TR_CAP_: atob('VHJvamFu'),
    _SS_: atob('c2hhZG93c29ja3M='),
    _V2_: atob('djJyYXk='),
    _project_: atob('QlBC'),
    _website_: atob('aHR0cHM6Ly9iaWEtcGFpbi1iYWNoZS5naXRodWIuaW8vQlBCLVdvcmtlci1QYW5lbC8='),
    _public_proxy_ip_: atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==')
};

globalThis.settings = {
    localDNS: "8.8.8.8",
    antiSanctionDNS: "178.22.122.100",
    fakeDNS: false,
    enableIPv6: true,
    allowLANConnection: false,
    logLevel: "warning",
    remoteDNS: "https://8.8.8.8/dns-query",
    remoteDnsHost: {
        host: "8.8.8.8",
        isDomain: false,
        ipv4: [],
        ipv6: []
    },
    proxyIPMode: "proxyip",
    proxyIPs: [],
    prefixes: [],
    outProxy: "",
    outProxyParams: {},
    cleanIPs: [],
    customCdnAddrs: [],
    customCdnHost: "",
    customCdnSni: "",
    bestVLTRInterval: 30,
    VLConfigs: true,
    TRConfigs: true,
    ports: [443],
    fingerprint: "chrome",
    enableTFO: false,
    fragmentMode: "custom",
    fragmentLengthMin: 100,
    fragmentLengthMax: 200,
    fragmentIntervalMin: 1,
    fragmentIntervalMax: 1,
    fragmentMaxSplitMin: undefined,
    fragmentMaxSplitMax: undefined,
    fragmentPackets: "tlshello",
    enableECH: false,
    echConfig: "",
    bypassIran: false,
    bypassChina: false,
    bypassRussia: false,
    bypassOpenAi: false,
    bypassGoogleAi: false,
    bypassMicrosoft: false,
    bypassOracle: false,
    bypassDocker: false,
    bypassAdobe: false,
    bypassEpicGames: false,
    bypassIntel: false,
    bypassAmd: false,
    bypassNvidia: false,
    bypassAsus: false,
    bypassHp: false,
    bypassLenovo: false,
    blockAds: false,
    blockPorn: false,
    blockUDP443: false,
    blockMalware: false,
    blockPhishing: false,
    blockCryptominers: false,
    customBypassRules: [],
    customBlockRules: [],
    customBypassSanctionRules: [],
    warpRemoteDNS: "1.1.1.1",
    warpEndpoints: ["engage.cloudflareclient.com:2408"],
    bestWarpInterval: 30,
    xrayUdpNoises: [
        {
            type: "rand",
            packet: "50-100",
            delay: "1-1",
            applyTo: "ip",
            count: 5
        }
    ],
    knockerNoiseMode: "quic",
    noiseCountMin: 10,
    noiseCountMax: 15,
    noiseSizeMin: 5,
    noiseSizeMax: 10,
    noiseDelayMin: 1,
    noiseDelayMax: 1,
    amneziaNoiseCount: 5,
    amneziaNoiseSizeMin: 50,
    amneziaNoiseSizeMax: 100,
    panelVersion: __VERSION__
};

export async function setSettings(request: Request, env: Env) {
    const dataset = await getDataset(request, env);
    globalThis.settings = dataset.settings;
}

export function init(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    const { UUID, TR_PASS, FALLBACK, DOH_URL } = env;

    globalThis.globalConfig = {
        userID: UUID,
        TrPass: TR_PASS,
        pathName: decodeURIComponent(pathname),
        fallbackDomain: FALLBACK || 'speed.cloudflare.com',
        dohURL: DOH_URL || 'https://cloudflare-dns.com/dns-query'
    };
}

export function initWs(env: any) {
    const { _public_proxy_ip_ } = globalThis.dict;

    globalThis.wsConfig = {
        envProxyIPs: env.PROXY_IP,
        envPrefixes: env.PREFIX,
        defaultProxyIPs: [_public_proxy_ip_],
        defaultPrefixes: [
            '[2a02:898:146:64::]',
            '[2602:fc59:b0:64::]',
            '[2602:fc59:11:64::]'
        ]
    };
}

export function initHttp(request: Request, env: any) {
    const { _VL_CAP_, _TR_CAP_, _website_ } = globalThis.dict;
    const { UUID, TR_PASS, SUB_PATH, kv } = env;
    const { pathname, origin, searchParams, hostname } = new URL(request.url);

    if (!['/secrets', '/favicon.ico'].includes(decodeURIComponent(pathname))) {
        if (!UUID || !TR_PASS) throw new Error(`Please set ${_VL_CAP_} UUID and ${_TR_CAP_} password first. Visit <a href="${origin}/secrets" target="_blank">here</a> to generate them.`, { cause: "init" });
        if (!isValidUUID(UUID)) throw new Error(`Invalid UUID: ${UUID}`, { cause: "init" });
        if (typeof kv !== 'object') throw new Error(`KV Dataset is not properly set! Please refer to <a href="${_website_}" target="_blank">tutorials</a>.`, { cause: "init" });
    }

    globalThis.httpConfig = {
        panelVersion: __VERSION__,
        defaultHttpPorts: [80, 8080, 2052, 2082, 2086, 2095, 8880],
        defaultHttpsPorts: [443, 8443, 2053, 2083, 2087, 2096],
        hostName: hostname,
        client: decodeURIComponent(searchParams.get('app') ?? ''),
        urlOrigin: origin,
        subPath: SUB_PATH || UUID,
    };
}