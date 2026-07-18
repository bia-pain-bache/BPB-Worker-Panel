import { getDataset } from '@kv';
import {
    KvSettings,
    ReqSettings,
    EmbededSettings,
    MainSettings,
    WarpAccount,
    SharedSettings,
    Client,
    Subscription
} from '#types/settings';

Object.assign(globalThis, {
    _VL_: atob('dmxlc3M='),
    _VL_CAP_: atob('VkxFU1M='),
    _VM_: atob('dm1lc3M='),
    _VM_CAP_: atob('Vk1lc3M='),
    _TR_: atob('dHJvamFu'),
    _TR_CAP_: atob('VHJvamFu'),
    _SS_: atob('c2hhZG93c29ja3M='),
    _V2_: atob('djJyYXk='),
    _project_: atob('QlBC'),
    _project_SM_: atob('YnBi'),
    _repo_: atob('aHR0cHM6Ly9naXRodWIuY29tL2JpYS1wYWluLWJhY2hlL0JQQi1Xb3JrZXItUGFuZWw='),
    _website_: atob('aHR0cHM6Ly9iaWEtcGFpbi1iYWNoZS5naXRodWIuaW8vQlBCLVdvcmtlci1QYW5lbC8='),
    _public_proxy_ip_: atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ==')
});

export function init(request: Request, env: Env) {
    const { pathname, origin, searchParams, hostname } = new URL(request.url);
    globalSettings = {
        accID: EMBEDED_SETTINGS.accID,
        accEmail: EMBEDED_SETTINGS.accEmail.toLowerCase(),
        apiToken: EMBEDED_SETTINGS.apiToken,
        vlUUID: EMBEDED_SETTINGS.vlUUID,
        trPass: EMBEDED_SETTINGS.trPass,
        securePath: EMBEDED_SETTINGS.securePath,
        proxyIpMode: EMBEDED_SETTINGS.proxyIpMode,
        proxyIPs: EMBEDED_SETTINGS.proxyIPs.length ? EMBEDED_SETTINGS.proxyIPs : [_public_proxy_ip_],
        prefixes: EMBEDED_SETTINGS.prefixes.length ? EMBEDED_SETTINGS.prefixes : [
            '[2a02:898:146:64::]',
            '[2602:fc59:b0:64::]',
            '[2602:fc59:11:64::]'
        ],
        mainDomain: EMBEDED_SETTINGS.mainDomain,
        fallback: EMBEDED_SETTINGS.fallback,
        dohUrl: EMBEDED_SETTINGS.dohUrl || 'https://cloudflare-dns.com/dns-query',
        deployType: env.CF_PAGES === '1' ? 'pages' : 'workers',
        httpPorts: [80, 8080, 2052, 2082, 2086, 2095, 8880],
        httpsPorts: [443, 8443, 2053, 2083, 2087, 2096],
        client: decodeURIComponent(searchParams.get('app') ?? ''),
        origin: origin,
        searchParams,
        pathname: decodeURIComponent(pathname),
        hostname: hostname
    };
}

export async function setSettings(env: Env) {
    const dataset = await getDataset(env);
    kvSettings = dataset.settings;
    warpAccounts = dataset.warpAccounts;
}

export const getGlobals = (): EmbededSettings & ReqSettings => globalSettings;
export const getWarpAccounts = (): WarpAccount[] => warpAccounts;
export const getKvSettings = (): KvSettings => kvSettings;
export function getMainSettings(): MainSettings {
    const { accID, accEmail, apiToken, mainDomain, ...mainSettings } = EMBEDED_SETTINGS;
    return mainSettings;
}

export function getSharedSettings(): SharedSettings {
    const {
        remoteSettings,
        customDomain,
        panelVersion,
        ...proxySettings
    } = kvSettings;

    const {
        proxyIpMode,
        proxyIPs,
        prefixes,
        fallback,
        dohUrl
    } = EMBEDED_SETTINGS;

    return {
        ...proxySettings,
        proxyIpMode,
        proxyIPs,
        prefixes,
        fallback,
        dohUrl
    };
}

export const getSettings = () => ({
    ...kvSettings,
    ...globalSettings
});

let globalSettings: EmbededSettings & ReqSettings;
let warpAccounts: WarpAccount[] = [
    {
        privateKey: '4NyxMUme2zGv5r3QWI0hJBlNglm1J/thoCE55PK29G8=',
        publicKey: 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
        warpIPv6: '2606:4700:110:8fd2:11f3:8e67:11d4:3704/128',
        reserved: 'N16D'
    },
    {
        privateKey: 'aPQwXZBOndL0km0Swo0ArDOoy3bjeZzTu+/d4YHxW04=',
        publicKey: 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
        warpIPv6: '2606:4700:110:859d:1029:4dfa:bf63:ff08/128',
        reserved: 'SmWi'
    }
];

export const subscriptions: Subscription = {
    'normal': {
        label: 'Normal',
        categories: [
            { core: 'xray', clients: [`${_V2_}N(G)`, 'MahsaNG', 'Streisand'] },
            { core: 'sing-box', clients: ['sing-box', 'husi'] },
            { core: 'clash', clients: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash'] },
        ]
    },
    'fragment': {
        label: 'Fragment',
        categories: [
            { core: 'xray', clients: [`${_V2_}N(G)`, 'MahsaNG', 'Streisand'] },
            { core: 'sing-box', clients: ['sing-box', 'husi'] },
        ]
    },
    'raw': {
        label: 'Raw',
        categories: [
            { core: 'xray', clients: [`${_V2_}N(G)`, 'MahsaNG', 'Shadowrocket', 'Streisand', 'PassWall'] },
            { core: 'sing-box', clients: ['husi', 'NekoBox', 'Hiddify', 'Karing'] },
        ]
    },
    'warp': {
        label: 'Warp',
        categories: [
            { core: 'xray', clients: [`${_V2_}N(G)`, 'Streisand'] },
            { core: 'sing-box', clients: ['sing-box', 'husi'] },
            { core: 'clash', clients: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash'] },
            { core: 'wireguard', clients: ['Wireguard'] },
        ]
    },
    'warp-pro': {
        label: 'Warp Pro',
        categories: [
            { core: 'xray', clients: [`${_V2_}N(G)`, 'Streisand'] },
            { core: 'xray-knocker', clients: ['MahsaNG', 'v2rayN-PRO'] },
            { core: 'clash', clients: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash'] },
            { core: 'amnezia', clients: ['Amnezia', 'WG Tunnel'] },
        ]
    }
};

export const clients: Client[] = [
    { name: `${_V2_}NG`, minVer: '2.2.3', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tLzJkdXN0L3YycmF5TkcvcmVsZWFzZXMvbGF0ZXN0' },
    { name: `${_V2_}N`, minVer: '7.22.5', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tLzJkdXN0L3YycmF5Ti9yZWxlYXNlcy9sYXRlc3Q=' },
    { name: 'MahsaNG', minVer: '17', source: 'Google Play', b64Url: 'aHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5NYWhzYU5ldC5NYWhzYU5HJmhsPWVu' },
    { name: 'Streisand', minVer: '1.6.71', source: 'App Store', b64Url: 'aHR0cHM6Ly9hcHBzLmFwcGxlLmNvbS91cy9hcHAvc3RyZWlzYW5kL2lkNjQ1MDUzNDA2NA==' },
    { name: 'sing-box', minVer: '1.12.0', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL1NhZ2VyTmV0L3NpbmctYm94L3JlbGVhc2VzL2xhdGVzdA==' },
    { name: 'husi', minVer: '1.3.2', source: 'Codeberg', b64Url: 'aHR0cHM6Ly9jb2RlYmVyZy5vcmcveGNoYWNoYTIwLXBvbHkxMzA1L2h1c2kvcmVsZWFzZXMvbGF0ZXN0' },
    { name: 'NekoBox', minVer: '1.3.2', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL01hdHN1cmlkYXlvL05la29Cb3hGb3JBbmRyb2lkL3JlbGVhc2VzL2xhdGVzdA==' },
    { name: 'Clash Meta', minVer: '2.11.31', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL01ldGFDdWJlWC9DbGFzaE1ldGFGb3JBbmRyb2lkL3JlbGVhc2VzL2xhdGVzdA==' },
    { name: 'Clash verge rev', minVer: '2.5.1', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL2NsYXNoLXZlcmdlLXJldi9jbGFzaC12ZXJnZS1yZXYvcmVsZWFzZXMvbGF0ZXN0' },
    { name: 'FlClash', minVer: '0.8.94', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL2NoZW4wODIwOS9GbENsYXNoL3JlbGVhc2VzL2xhdGVzdA==' },
    { name: 'Stash', minVer: '3.4.1', source: 'App Store', b64Url: 'aHR0cHM6Ly9hcHBzLmFwcGxlLmNvbS91cy9hcHAvc3Rhc2gtcnVsZS1iYXNlZC1wcm94eS9pZDE1OTYwNjMzNDk=' },
    { name: 'Amnezia', minVer: '4.8.21.0', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL2FtbmV6aWEtdnBuL2FtbmV6aWEtY2xpZW50L3JlbGVhc2VzL2xhdGVzdA==' },
    { name: 'Wireguard', minVer: 'Stable', source: 'Official Website', b64Url: 'aHR0cHM6Ly93d3cud2lyZWd1YXJkLmNvbS9pbnN0YWxsLw==' },
    { name: 'WG Tunnel', minVer: '5.1.0', source: 'Github', b64Url: 'aHR0cHM6Ly9naXRodWIuY29tL3dndHVubmVsL2FuZHJvaWQvcmVsZWFzZXMvbGF0ZXN0' },
];

let kvSettings: KvSettings = {
    localDNS: '8.8.8.8',
    antiSanctionDNS: '178.22.122.100',
    fakeDNS: false,
    enableIPv6: false,
    allowLANConnection: false,
    logLevel: 'warning',
    customDomain: '',
    protocols: `${_VL_},${_TR_}`,
    remoteDNS: 'https://8.8.8.8/dns-query',
    remoteDnsHost: {
        isDomain: false,
        host: '8.8.8.8',
        ipv4: [],
        ipv6: []
    },
    upstreamProxy: '',
    upstreamParams: {
        upstreamServer: '',
        upstreamPort: 0
    },
    chainProxy: '',
    chainProxyParams: {},
    cleanIPs: ['www.speedtest.net'],
    ports: [443],
    fingerprint: 'chrome',
    bestPingInterval: 30,
    enableTFO: false,
    enableECH: false,
    echServerName: '',
    customCdnAddrs: [],
    customCdnHost: '',
    customCdnSni: '',
    fragmentMode: 'custom',
    fragmentPackets: 'tlshello',
    fragmentLengthMin: 100,
    fragmentLengthMax: 200,
    fragmentDelayMin: 1,
    fragmentDelayMax: 1,
    fragmentMaxSplitMin: 0,
    fragmentMaxSplitMax: 0,
    customSubs: [],
    customConfigs: [],
    warpRemoteDNS: '1.1.1.1',
    warpEndpoints: ['engage.cloudflareclient.com:2408'],
    warpBestPingInterval: 30,
    warpReservedBytes: true,
    xrayUdpNoises: [{
        type: 'rand',
        packet: '50-100',
        delay: '1-5',
        count: 5
    }],
    knockerNoiseMode: 'quic',
    knockerNoiseCountMin: 10,
    knockerNoiseCountMax: 15,
    knockerNoiseSizeMin: 5,
    knockerNoiseSizeMax: 10,
    knockerNoiseDelayMin: 1,
    knockerNoiseDelayMax: 1,
    amneziaNoiseCount: 5,
    amneziaNoiseSizeMin: 50,
    amneziaNoiseSizeMax: 100,
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
    remoteSettings: '',
    panelVersion: VERSION
};