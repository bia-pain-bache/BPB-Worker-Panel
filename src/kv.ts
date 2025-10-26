import { fetchWarpConfigs } from '#protocols/warp';
import { getDomain, resolveDNS } from '#configs/utils';

export async function getDataset(request: Request, env: Env): Promise<{ settings: Settings, warpConfigs: WarpAccount[] }> {
    const { httpConfig: { panelVersion }, settings } = globalThis;
    let proxySettings: Settings | null, warpConfigs: WarpAccount[];

    try {
        proxySettings = await env.kv.get("proxySettings", { type: 'json' });
        warpConfigs = await env.kv.get('warpConfigs', { type: 'json' }) || [];

        if (!proxySettings) {
            await env.kv.put("proxySettings", JSON.stringify(settings));
            const configs = await fetchWarpConfigs(env);
            proxySettings = settings;
            warpConfigs = configs;
        }

        if (panelVersion !== proxySettings.panelVersion) {
            proxySettings = await updateDataset(request, env);
        }

        return { 
            settings: proxySettings, 
            warpConfigs 
        };
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting KV: ${error}`);
    }
}

export async function updateDataset(request: Request, env: Env): Promise<Settings> {
    const { settings, httpConfig: { panelVersion } } = globalThis;
    let newSettings: Settings;
    let currentSettings: Settings | null;

    if (request.method === 'PUT') {
        newSettings = await request.json();
    }

    try {
        currentSettings = await env.kv.get("proxySettings", { type: 'json' });
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting current KV settings: ${error}`);
    }

    const populateField = (field: keyof Settings, callback?: Function) => {
        if (!newSettings) {
            return currentSettings?.[field] ?? settings[field];
        }

        const value = newSettings[field];
        return typeof callback === 'function' ? callback(value) : value;
    }

    const remoteDNS = populateField('remoteDNS');
    const initDoh = async (): Promise<DohHost> => {
        const { host, isHostDomain } = getDomain(remoteDNS);
        const dohHost: DohHost = {
            host,
            isDomain: isHostDomain,
            ipv4: [],
            ipv6: []
        }

        if (isHostDomain) {
            const { ipv4, ipv6 } = await resolveDNS(host);
            dohHost.ipv4 = ipv4;
            dohHost.ipv6 = ipv6;
        }

        return dohHost;
    }

    const updatedSettings: Settings = {
        remoteDNS,
        dohHost: await initDoh(),
        localDNS: populateField('localDNS'),
        antiSanctionDNS: populateField('antiSanctionDNS'),
        VLTRFakeDNS: populateField('VLTRFakeDNS'),
        proxyIPMode: populateField('proxyIPMode'),
        proxyIPs: populateField('proxyIPs'),
        prefixes: populateField('prefixes'),
        outProxy: populateField('outProxy'),
        outProxyParams: populateField('outProxy', (field: string) => extractChainProxyParams(field)),
        cleanIPs: populateField('cleanIPs'),
        VLTRenableIPv6: populateField('VLTRenableIPv6'),
        customCdnAddrs: populateField('customCdnAddrs'),
        customCdnHost: populateField('customCdnHost'),
        customCdnSni: populateField('customCdnSni'),
        bestVLTRInterval: populateField('bestVLTRInterval'),
        VLConfigs: populateField('VLConfigs'),
        TRConfigs: populateField('TRConfigs'),
        ports: populateField('ports'),
        fingerprint: populateField('fingerprint'),
        enableTFO: populateField('enableTFO'),
        fragmentMode: populateField('fragmentMode'),
        fragmentLengthMin: populateField('fragmentLengthMin'),
        fragmentLengthMax: populateField('fragmentLengthMax'),
        fragmentIntervalMin: populateField('fragmentIntervalMin'),
        fragmentIntervalMax: populateField('fragmentIntervalMax'),
        fragmentPackets: populateField('fragmentPackets'),
        bypassIran: populateField('bypassIran'),
        bypassChina: populateField('bypassChina'),
        bypassRussia: populateField('bypassRussia'),
        bypassOpenAi: populateField('bypassOpenAi'),
        bypassMicrosoft: populateField('bypassMicrosoft'),
        bypassOracle: populateField('bypassOracle'),
        bypassDocker: populateField('bypassDocker'),
        bypassAdobe: populateField('bypassAdobe'),
        bypassEpicGames: populateField('bypassEpicGames'),
        bypassIntel: populateField('bypassIntel'),
        bypassAmd: populateField('bypassAmd'),
        bypassNvidia: populateField('bypassNvidia'),
        bypassAsus: populateField('bypassAsus'),
        bypassHp: populateField('bypassHp'),
        bypassLenovo: populateField('bypassLenovo'),
        blockAds: populateField('blockAds'),
        blockPorn: populateField('blockPorn'),
        blockUDP443: populateField('blockUDP443'),
        customBypassRules: populateField('customBypassRules'),
        customBlockRules: populateField('customBlockRules'),
        customBypassSanctionRules: populateField('customBypassSanctionRules'),
        warpEndpoints: populateField('warpEndpoints'),
        warpFakeDNS: populateField('warpFakeDNS'),
        warpEnableIPv6: populateField('warpEnableIPv6'),
        bestWarpInterval: populateField('bestWarpInterval'),
        xrayUdpNoises: populateField('xrayUdpNoises'),
        knockerNoiseMode: populateField('knockerNoiseMode'),
        noiseCountMin: populateField('noiseCountMin'),
        noiseCountMax: populateField('noiseCountMax'),
        noiseSizeMin: populateField('noiseSizeMin'),
        noiseSizeMax: populateField('noiseSizeMax'),
        noiseDelayMin: populateField('noiseDelayMin'),
        noiseDelayMax: populateField('noiseDelayMax'),
        amneziaNoiseCount: populateField('amneziaNoiseCount'),
        amneziaNoiseSizeMin: populateField('amneziaNoiseSizeMin'),
        amneziaNoiseSizeMax: populateField('amneziaNoiseSizeMax'),
        panelVersion: panelVersion
    };

    try {
        await env.kv.put("proxySettings", JSON.stringify(updatedSettings));
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV: ${error}`);
    }

    return updatedSettings;
}

function extractChainProxyParams(chainProxy: string) {
    if (!chainProxy) return {};
    const { _SS_, _TR_, _VL_, _VM_ } = globalThis.dict;
    const {
        hostname,
        port,
        username,
        password,
        search,
        protocol
    } = new URL(chainProxy);

    const proto = protocol.slice(0, -1);
    let configParams: any = {
        protocol: proto === 'ss' ? _SS_ : proto,
        server: hostname,
        port: +port
    };

    const parseParams = () => {
        const params = new URLSearchParams(search);
        for (const [key, value] of params) {
            configParams[key] = value;
        }
    }

    switch (proto) {
        case _VL_:
        case _VM_:
            configParams.uuid = username;
            parseParams();
            break;

        case _TR_:
            configParams.password = username;
            parseParams();
            break;

        case 'ss':
            const auth = new TextDecoder().decode(Uint8Array.from(atob(username), c => c.charCodeAt(0)));
            const [first, ...rest] = auth.split(':');
            configParams.method = first;
            configParams.password = rest.join(':');
            parseParams();
            break;

        case 'socks':
        case 'http':
            configParams.user = username;
            configParams.pass = password;
            break;

        default:
            return {};
    }

    return configParams;
}