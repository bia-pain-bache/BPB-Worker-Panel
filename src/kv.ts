import { fetchWarpAccounts } from '@warp';
import { getDomain, resolveDNS } from '@utils';
import { base64DecodeUtf8 } from '@common';

export async function getDataset(
    request: Request,
    env: Env
): Promise<{ settings: Settings, warpAccounts: WarpAccount[] }> {
    const { httpConfig: { panelVersion }, settings } = globalThis;
    let proxySettings: Settings | null, warpAccounts: WarpAccount[] | null;

    try {
        proxySettings = await env.kv.get("proxySettings", { type: 'json' });
        warpAccounts = await env.kv.get('warpAccounts', { type: 'json' });

        if (!proxySettings) {
            await env.kv.put("proxySettings", JSON.stringify(settings));
            proxySettings = settings;
        }

        if (!warpAccounts) {
            warpAccounts = await fetchWarpAccounts(env);
        }

        if (panelVersion !== proxySettings.panelVersion) {
            proxySettings = await updateDataset(request, env);
        }

        return {
            settings: proxySettings,
            warpAccounts
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
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        throw new Error(`An error occurred while getting current KV settings: ${message}`);
    }

    const getParam = (field: keyof Settings, callback?: Function) => {
        const source = newSettings ?? currentSettings ?? settings;
        const value = source[field];
        return callback ? callback(value) : value;
    }

    const remoteDNS = getParam('remoteDNS');
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
        localDNS: getParam('localDNS'),
        antiSanctionDNS: getParam('antiSanctionDNS'),
        fakeDNS: getParam('fakeDNS'),
        logLevel: getParam('logLevel'),
        allowLANConnection: getParam('allowLANConnection'),
        proxyIPMode: getParam('proxyIPMode'),
        proxyIPs: getParam('proxyIPs'),
        prefixes: getParam('prefixes'),
        outProxy: getParam('outProxy'),
        outProxyParams: getParam('outProxy', (field: string) => extractChainProxyParams(field)),
        cleanIPs: getParam('cleanIPs'),
        VLTRenableIPv6: getParam('VLTRenableIPv6'),
        customCdnAddrs: getParam('customCdnAddrs'),
        customCdnHost: getParam('customCdnHost'),
        customCdnSni: getParam('customCdnSni'),
        bestVLTRInterval: getParam('bestVLTRInterval'),
        VLConfigs: getParam('VLConfigs'),
        TRConfigs: getParam('TRConfigs'),
        ports: getParam('ports'),
        fingerprint: getParam('fingerprint'),
        enableTFO: getParam('enableTFO'),
        fragmentMode: getParam('fragmentMode'),
        fragmentLengthMin: getParam('fragmentLengthMin'),
        fragmentLengthMax: getParam('fragmentLengthMax'),
        fragmentIntervalMin: getParam('fragmentIntervalMin'),
        fragmentIntervalMax: getParam('fragmentIntervalMax'),
        fragmentMaxSplitMin: getParam('fragmentMaxSplitMin'),
        fragmentMaxSplitMax: getParam('fragmentMaxSplitMax'),
        fragmentPackets: getParam('fragmentPackets'),
        bypassIran: getParam('bypassIran'),
        bypassChina: getParam('bypassChina'),
        bypassRussia: getParam('bypassRussia'),
        bypassOpenAi: getParam('bypassOpenAi'),
        bypassGoogleAi: getParam('bypassGoogleAi'),
        bypassMicrosoft: getParam('bypassMicrosoft'),
        bypassOracle: getParam('bypassOracle'),
        bypassDocker: getParam('bypassDocker'),
        bypassAdobe: getParam('bypassAdobe'),
        bypassEpicGames: getParam('bypassEpicGames'),
        bypassIntel: getParam('bypassIntel'),
        bypassAmd: getParam('bypassAmd'),
        bypassNvidia: getParam('bypassNvidia'),
        bypassAsus: getParam('bypassAsus'),
        bypassHp: getParam('bypassHp'),
        bypassLenovo: getParam('bypassLenovo'),
        blockAds: getParam('blockAds'),
        blockPorn: getParam('blockPorn'),
        blockUDP443: getParam('blockUDP443'),
        customBypassRules: getParam('customBypassRules'),
        customBlockRules: getParam('customBlockRules'),
        customBypassSanctionRules: getParam('customBypassSanctionRules'),
        warpRemoteDNS: getParam('warpRemoteDNS'),
        warpEndpoints: getParam('warpEndpoints'),
        warpEnableIPv6: getParam('warpEnableIPv6'),
        bestWarpInterval: getParam('bestWarpInterval'),
        xrayUdpNoises: getParam('xrayUdpNoises'),
        knockerNoiseMode: getParam('knockerNoiseMode'),
        noiseCountMin: getParam('noiseCountMin'),
        noiseCountMax: getParam('noiseCountMax'),
        noiseSizeMin: getParam('noiseSizeMin'),
        noiseSizeMax: getParam('noiseSizeMax'),
        noiseDelayMin: getParam('noiseDelayMin'),
        noiseDelayMax: getParam('noiseDelayMax'),
        amneziaNoiseCount: getParam('amneziaNoiseCount'),
        amneziaNoiseSizeMin: getParam('amneziaNoiseSizeMin'),
        amneziaNoiseSizeMax: getParam('amneziaNoiseSizeMax'),
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

    let url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    const stdProtocol = protocol === "ss" ? _SS_ : protocol;

    if (stdProtocol === _VM_) {
        const config = JSON.parse(base64DecodeUtf8(url.host));
        return {
            protocol: stdProtocol,
            uuid: config.id,
            server: config.add,
            port: config.port,
            type: config.net,
            headerType: config.type,
            serviceName: config.path,
            authority: config.authority,
            path: config.path,
            host: config.host,
            security: config.tls,
            sni: config.sni,
            fp: config.fp,
            alpn: config.alpn
        };
    }

    const configParams: Record<string, string | number> = {
        protocol: stdProtocol,
        server: url.hostname,
        port: +url.port
    };

    const parseParams = (queryParams: boolean, customParams: Record<string, string>) => {
        if (queryParams) {
            for (const [key, value] of url.searchParams) {
                configParams[key] = value;
            }
        }

        return {
            ...configParams,
            ...customParams
        };
    }

    switch (stdProtocol) {
        case _VL_:
            parseParams(true, {
                uuid: url.username
            });

        case _TR_:
            parseParams(true, {
                password: url.username
            });

        case _SS_:
            const auth = base64DecodeUtf8(url.username);
            const [first, ...rest] = auth.split(':');
            parseParams(true, {
                method: first,
                password: rest.join(':')
            });

        case 'socks':
        case 'http':
            parseParams(false, {
                user: url.username,
                pass: url.password
            });

        default:
            return {};
    }
}