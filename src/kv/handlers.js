import { fetchWarpConfigs } from '../protocols/warp';
import { isDomain, resolveDNS } from '../helpers/helpers';
import { Authenticate } from '../authentication/auth';

export async function getDataset(request, env) {
    let proxySettings, warpConfigs;

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting KV - ${error}`);
    }

    if (!proxySettings) {
        proxySettings = await updateDataset(request, env);
        const { error, configs } = await fetchWarpConfigs(env, proxySettings);
        if (error) throw new Error(`An error occurred while getting Warp configs - ${error}`);
        warpConfigs = configs;
    }
    
    if (globalThis.panelVersion !== proxySettings.panelVersion) proxySettings = await updateDataset(request, env);
    return { proxySettings, warpConfigs }
}

export async function updateDataset (request, env) {
    let newSettings = request.method === 'POST' ? await request.formData() : null;
    const isReset = newSettings?.get('resetSettings') === 'true';
    let currentSettings;
    if (!isReset) {
        try {
            currentSettings = await env.bpb.get("proxySettings", {type: 'json'});
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while getting current KV settings - ${error}`);
        }
    } else {
        newSettings = null;
    }

    const validateField = (field) => {
        const fieldValue = newSettings?.get(field);
        if (fieldValue === undefined) return null;
        if (fieldValue === 'true') return true;
        if (fieldValue === 'false') return false;
        return fieldValue;
    }

    const remoteDNS = validateField('remoteDNS') ?? currentSettings?.remoteDNS ?? 'https://8.8.8.8/dns-query';
    const enableIPv6 = validateField('enableIPv6') ?? currentSettings?.enableIPv6 ?? true;
    const url = new URL(remoteDNS);
    const remoteDNSServer = url.hostname;
    const isServerDomain = isDomain(remoteDNSServer);
    let resolvedRemoteDNS = {};
    if (isServerDomain) {
        try {
            const resolvedDomain = await resolveDNS(remoteDNSServer);
            resolvedRemoteDNS = {
                server: remoteDNSServer,
                staticIPs: enableIPv6 ? [...resolvedDomain.ipv4, ...resolvedDomain.ipv6] : resolvedDomain.ipv4
            };
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while resolving remote DNS server, please try agian! - ${error}`);
        }
    } 

    const proxySettings = {
        remoteDNS: remoteDNS,
        resolvedRemoteDNS: resolvedRemoteDNS,
        localDNS: validateField('localDNS') ?? currentSettings?.localDNS ?? '8.8.8.8',
        vlessTrojanFakeDNS: validateField('vlessTrojanFakeDNS') ?? currentSettings?.vlessTrojanFakeDNS ?? false,
        proxyIP: validateField('proxyIP')?.replaceAll(' ', '') ?? currentSettings?.proxyIP ?? '',
        outProxy: validateField('outProxy') ?? currentSettings?.outProxy ?? '',
        outProxyParams: extractChainProxyParams(validateField('outProxy')) ?? currentSettings?.outProxyParams ?? {},
        cleanIPs: validateField('cleanIPs')?.replaceAll(' ', '') ?? currentSettings?.cleanIPs ?? '',
        enableIPv6: enableIPv6,
        customCdnAddrs: validateField('customCdnAddrs')?.replaceAll(' ', '') ?? currentSettings?.customCdnAddrs ?? '',
        customCdnHost: validateField('customCdnHost')?.trim() ?? currentSettings?.customCdnHost ?? '',
        customCdnSni: validateField('customCdnSni')?.trim() ?? currentSettings?.customCdnSni ?? '',
        bestVLESSTrojanInterval: validateField('bestVLESSTrojanInterval') ?? currentSettings?.bestVLESSTrojanInterval ?? '30',
        vlessConfigs: validateField('vlessConfigs') ?? currentSettings?.vlessConfigs ?? true,
        trojanConfigs: validateField('trojanConfigs') ?? currentSettings?.trojanConfigs ?? false,
        ports: validateField('ports')?.split(',') ?? currentSettings?.ports ?? ['443'],
        lengthMin: validateField('fragmentLengthMin') ?? currentSettings?.lengthMin ?? '100',
        lengthMax: validateField('fragmentLengthMax') ?? currentSettings?.lengthMax ?? '200',
        intervalMin: validateField('fragmentIntervalMin') ?? currentSettings?.intervalMin ?? '1',
        intervalMax: validateField('fragmentIntervalMax') ?? currentSettings?.intervalMax ?? '1',
        fragmentPackets: validateField('fragmentPackets') ?? currentSettings?.fragmentPackets ?? 'tlshello',
        bypassLAN: validateField('bypass-lan') ?? currentSettings?.bypassLAN ?? false,
        bypassIran: validateField('bypass-iran') ?? currentSettings?.bypassIran ?? false,
        bypassChina: validateField('bypass-china') ?? currentSettings?.bypassChina ?? false,
        bypassRussia: validateField('bypass-russia') ?? currentSettings?.bypassRussia ?? false,
        blockAds: validateField('block-ads') ?? currentSettings?.blockAds ?? false,
        blockPorn: validateField('block-porn') ?? currentSettings?.blockPorn ?? false,
        blockUDP443: validateField('block-udp-443') ?? currentSettings?.blockUDP443 ?? false,
        customBypassRules: validateField('customBypassRules')?.replaceAll(' ', '') ?? currentSettings?.customBypassRules ?? '',
        customBlockRules: validateField('customBlockRules')?.replaceAll(' ', '') ?? currentSettings?.customBlockRules ?? '',
        warpEndpoints: validateField('warpEndpoints')?.replaceAll(' ', '') ?? currentSettings?.warpEndpoints ?? 'engage.cloudflareclient.com:2408',
        warpFakeDNS: validateField('warpFakeDNS') ?? currentSettings?.warpFakeDNS ?? false,
        warpEnableIPv6: validateField('warpEnableIPv6') ?? currentSettings?.warpEnableIPv6 ?? true,
        warpPlusLicense: validateField('warpPlusLicense') ?? currentSettings?.warpPlusLicense ?? '',
        bestWarpInterval: validateField('bestWarpInterval') ?? currentSettings?.bestWarpInterval ?? '30',
        hiddifyNoiseMode: validateField('hiddifyNoiseMode') ?? currentSettings?.hiddifyNoiseMode ?? 'm4',
        nikaNGNoiseMode: validateField('nikaNGNoiseMode') ?? currentSettings?.nikaNGNoiseMode ?? 'quic',
        noiseCountMin: validateField('noiseCountMin') ?? currentSettings?.noiseCountMin ?? '10',
        noiseCountMax: validateField('noiseCountMax') ?? currentSettings?.noiseCountMax ?? '15',
        noiseSizeMin: validateField('noiseSizeMin') ?? currentSettings?.noiseSizeMin ?? '5',
        noiseSizeMax: validateField('noiseSizeMax') ?? currentSettings?.noiseSizeMax ?? '10',
        noiseDelayMin: validateField('noiseDelayMin') ?? currentSettings?.noiseDelayMin ?? '1',
        noiseDelayMax: validateField('noiseDelayMax') ?? currentSettings?.noiseDelayMax ?? '1',
        panelVersion: globalThis.panelVersion
    };

    try {    
        await env.bpb.put("proxySettings", JSON.stringify(proxySettings));
        if (isReset) await updateWarpConfigs(request, env);          
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV - ${error}`);
    }

    return proxySettings;
}

function extractChainProxyParams(chainProxy) {
    let configParams = {};
    if (!chainProxy) return {};
    const url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    if (protocol === 'vless') {
        const params = new URLSearchParams(url.search);
        configParams = {
            protocol: protocol,
            uuid : url.username,
            server : url.hostname,
            port : url.port
        };
    
        params.forEach( (value, key) => {
            configParams[key] = value;
        });
    } else {
        configParams = {
            protocol: protocol, 
            user : url.username,
            pass : url.password,
            server : url.host,
            port : url.port
        };
    }

    return JSON.stringify(configParams);
}

export async function updateWarpConfigs(request, env) {
    const auth = await Authenticate(request, env); 
    if (!auth) return new Response('Unauthorized', { status: 401 });
    if (request.method === 'POST') {
        try {
            const { proxySettings } = await getDataset(request, env);
            const { error: warpPlusError } = await fetchWarpConfigs(env, proxySettings);
            if (warpPlusError) return new Response(warpPlusError, { status: 400 });
            return new Response('Warp configs updated successfully', { status: 200 });
        } catch (error) {
            console.log(error);
            return new Response(`An error occurred while updating Warp configs! - ${error}`, { status: 500 });
        }
    } else {
        return new Response('Unsupported request', { status: 405 });
    }
}