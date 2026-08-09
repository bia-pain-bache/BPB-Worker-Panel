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
    _wizard_repo_: atob('aHR0cHM6Ly9naXRodWIuY29tL2JpYS1wYWluLWJhY2hlL0JQQi1XaXphcmQ='),
    _website_: atob('aHR0cHM6Ly9iaWEtcGFpbi1iYWNoZS5naXRodWIuaW8vQlBCLVdvcmtlci1QYW5lbC8='),
    _public_proxy_ip_: atob('YnBiLnlvdXNlZi5pc2VnYXJvLmNvbQ=='),
});

export function init(request: Request, env: Env) {
    if(env.UUID || env.TR_PASS || typeof EMBEDED_SETTINGS === 'undefined') {
        throw new Error(`BPB Panel v5 can only be installed using <a href="${_wizard_repo_}/secrets" target="_blank">BPB Wizard v3</a> or later.`);
    }
    
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

/**
 * One-click import strategy per client app, per device OS.
 *
 * Central source of truth shared by the panel and (in future) the Telegram
 * bot. Two independent facts are recorded per client:
 *
 * 1. platforms - the OSes the app actually ships on. If the visitor's
 *    device is not in this list the app cannot be installed here at all, so
 *    the panel only copies the link (and says why) instead of firing a dead
 *    scheme.
 * 2. How to import on the OSes it does run on:
 *    - schemes[os] - a URL scheme that OS build registers with the system.
 *      An empty string means "this build has no working deep link" and falls
 *      back to copy. {url} is the plain subscription URL, {enc} its
 *      percent-encoded form, {b64} its base64, and {name} the encoded name.
 *    - scheme - shorthand for "same scheme on every listed platform".
 *    - fileImport - the app has no scheme; instead download the config
 *      archive and let the user open a config file from it.
 *
 * A client with a platform but no scheme and no fileImport falls back to
 * copy, which is correct for apps that only accept a pasted URL (v2rayN).
 *
 * What may be handed to a scheme depends on the row body:
 * - uriList marks importers that can parse a plain base64 URI list (the
 *   body of the raw rows).
 * - profile marks importers that consume the structured profile served by
 *   the normal/fragment/warp/warp-pro rows (xray JSON, sing-box JSON or
 *   Clash YAML for their own core).
 * A scheme is only fired when the app is known to parse the body the row
 * will serve. husi, for example, is a sing-box client whose feed parser
 * only reads URI lists; it therefore receives the raw endpoint even when
 * listed on a JSON row, and never a JSON body.
 *
 * Scheme collisions: several apps register the same scheme (Hiddify claims
 * v2rayng/clashmeta/sing-box everywhere it runs; FlClash registers
 * clashmeta too; MahsaNG shares v2rayng with its upstream). The OS may pick
 * a co-installed app, which can still import the same link - the browser
 * copies the plain link first, so nothing is lost. A scheme alias is only
 * used where it is actually exclusive (husi, karing, stash, flclash,
 * clash-verge, sn, sub, streisand).
 *
 * Every entry below was verified against the app's own source (Android
 * manifests, Info.plist / tauri.conf.json / runtime protocol registration)
 * or its store listing.
 */
type ClientOSType = 'android' | 'ios' | 'windows' | 'linux' | 'macos';

interface ClientLinkStrategy {
    platforms: ClientOSType[];
    schemes?: Partial<Record<ClientOSType, string>>;
    scheme?: string;
    fileImport?: boolean;
    uriList?: boolean;
    profile?: boolean;
}

const ANDROID_ONLY: ClientOSType[] = ['android'];
const DESKTOP: ClientOSType[] = ['windows', 'linux', 'macos'];
const APPLE: ClientOSType[] = ['ios', 'macos'];
const EVERY_OS: ClientOSType[] = ['android', 'ios', 'windows', 'linux', 'macos'];

export const clientLinks: Record<string, ClientLinkStrategy> = {
    // Xray-core Android client. AndroidManifest registers scheme v2rayng
    // with host install-sub, so the subscription imports in one tap. Its
    // importer base64-decodes the body and parses it line by line, so it
    // handles the raw URI-list rows as well as the Xray profile rows.
    // Note: Hiddify's manifest also claims v2rayng (Android/Windows/Linux),
    // so a co-installed Hiddify may grab the tap - the scheme is not
    // exclusive, but either app importing the same link is acceptable.
    'v2rayNG': {
        platforms: ANDROID_ONLY,
        scheme: 'v2rayng://install-sub?url={enc}',
        uriList: true,
        profile: true
    },
    // A v2rayNG fork - same package-level intent filter, same scheme, and
    // subject to the same Hiddify interception note as v2rayNG.
    'MahsaNG': {
        platforms: ANDROID_ONLY,
        scheme: 'v2rayng://install-sub?url={enc}',
        uriList: true,
        profile: true
    },
    // Desktop Xray GUI (Windows/Linux/macOS). Its v2rayn:// constant is an
    // internal export format only - the app never registers an OS protocol
    // handler, so there is nothing to fire. Copy the URL for pasting.
    'v2rayN': { platforms: DESKTOP },
    // Desktop Xray-knocker (Warp Pro) build of the same app.
    'v2rayN-PRO': { platforms: DESKTOP },

    // iOS/iPadOS only (no Mac build on its App Store listing). Its URL
    // scheme handler imports a remote subscription via
    // streisand://import/<url>.
    'Streisand': {
        platforms: ['ios'],
        scheme: 'streisand://import/{url}',
        profile: true
    },
    // iOS/iPadOS + Apple silicon Macs. sub:// takes the base64 of the
    // subscription URL itself, and its importer reads a base64 URI list.
    'Shadowrocket': {
        platforms: APPLE,
        scheme: 'sub://{b64}',
        uriList: true
    },
    // OpenWrt router package - configured from the router's web UI, not
    // from a phone or desktop app, so there is never a scheme to fire.
    'PassWall': { platforms: [] },

    // Multi-platform sing-box GUI. Registers hiddify/v2ray/v2rayn/v2rayng/
    // clash/clashmeta/sing-box on Android and macOS, and writes the same
    // handlers into the Windows registry and Linux desktop mime types at
    // first run. Its hiddify://install-config handler honors a name param
    // (falls back to the link fragment).
    'Hiddify': {
        platforms: EVERY_OS,
        scheme: 'hiddify://install-config?url={enc}&name={name}',
        uriList: true,
        profile: true
    },

    // sing-box official clients: SFA (Android), SFI (iOS), SFM (macOS) all
    // register sing-box://import-remote-profile. The scheme is also claimed
    // by Hiddify (and Karing on desktop), so a co-installed app may take
    // the tap and import the same link.
    'sing-box': {
        platforms: ['android', 'ios', 'macos'],
        scheme: 'sing-box://import-remote-profile?url={url}',
        profile: true
    },
    // Android sing-box client. Use its husi://subscription scheme and pass
    // name explicitly: its parser prefers the name query param and would
    // otherwise fall back to "Subscription #<epoch millis>" (it never reads
    // the URL fragment). Its feed parser only splits per-line proxy URIs,
    // so it is served the raw endpoint even on JSON rows; profile is
    // intentionally left unset so it never receives a JSON body.
    'husi': {
        platforms: ANDROID_ONLY,
        scheme: 'husi://subscription?url={enc}&name={name}',
        uriList: true
    },
    // Android sing-box client. Its sibling NekoRay shares the sn:// scheme,
    // and it also registers clash://install-config (contested by Clash
    // Meta, Hiddify and FlClash), so sn://subscription is the narrowest
    // link it has. importSubscription() reads url and name from it; pass
    // name explicitly because, like husi, it never reads the fragment.
    'NekoBox': {
        platforms: ANDROID_ONLY,
        scheme: 'sn://subscription?url={enc}&name={name}',
        uriList: true
    },
    // Flutter sing-box GUI. On Android/iOS/macOS it registers its own
    // karing scheme and its handler accepts install-config plus a name
    // param. Windows and Linux builds ship without any protocol
    // registration (verified: empty Inno [Registry] section, no
    // x-scheme-handler in the deb packaging), so those OSes fall back.
    'Karing': {
        platforms: ['android', 'ios', 'windows', 'linux', 'macos'],
        schemes: { windows: '', linux: '' },
        scheme: 'karing://install-config?url={enc}&name={name}',
        uriList: true,
        profile: true
    },

    // Clash Meta for Android - manifest registers clash/clashmeta with host
    // install-config. clashmeta is NOT exclusive: FlClash registers it on
    // Android/macOS/Windows and Hiddify on every OS, so a co-installed app
    // may take the tap (and can import the same link).
    'Clash Meta': {
        platforms: ANDROID_ONLY,
        scheme: 'clashmeta://install-config?url={enc}',
        profile: true
    },
    // Tauri desktop app; tauri.conf.json declares desktop schemes
    // ["clash", "clash-verge"]; scheme.rs accepts url and name params
    // (Linux also registers via xdg-mime at first run).
    'Clash Verge': {
        platforms: DESKTOP,
        scheme: 'clash-verge://install-config?url={enc}&name={name}',
        profile: true
    },
    'Clash verge rev': {
        platforms: DESKTOP,
        scheme: 'clash-verge://install-config?url={enc}&name={name}',
        profile: true
    },
    // Flutter ClashMeta GUI on Android + desktop (no iOS build). Registers
    // clash/clashmeta/flclash in its manifest, macOS Info.plist and Windows
    // registry at runtime; use the exclusive flclash alias so a
    // co-installed Clash app cannot intercept the tap (it also claims
    // clashmeta, see above). Linux builds ship no scheme registration.
    'FlClash': {
        platforms: ['android', 'windows', 'linux', 'macos'],
        schemes: { linux: '' },
        scheme: 'flclash://install-config?url={enc}',
        profile: true
    },
    // iOS/iPadOS/tvOS/macOS Clash client. Its FAQ lists both
    // stash://install-config?url= and the shared clash:// form; use the
    // exclusive one so a co-installed Clash client cannot intercept it.
    'Stash': {
        platforms: APPLE,
        scheme: 'stash://install-config?url={enc}',
        profile: true
    },

    // WireGuard-family: no remote-subscription scheme on any OS. The sub
    // endpoint serves a ZIP archive of .conf files (one per warp endpoint),
    // so the one-click downloads the archive and the user opens a .conf in
    // the app - not a literal single-file import.
    'Wireguard': { platforms: EVERY_OS, fileImport: true },
    'WG Tunnel': { platforms: ANDROID_ONLY, fileImport: true },
    'Amnezia': { platforms: EVERY_OS, fileImport: true },
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