import { getConfigAddresses, generateRemark, randomUpperCase, getRandomPath, extractWireguardParams, base64ToDecimal } from './helpers';
import { getDataset } from '../kv/handlers';

export async function getNormalConfigs(request, env) {
    const { hostName, defaultHttpsPorts, client, userID, TRPassword } = globalThis;
    const { proxySettings } = await getDataset(request, env);
    const {
        remoteDNS,
        cleanIPs, 
        proxyIPs, 
        ports, 
        VLConfigs, 
        TRConfigs ,
        fragmentLengthMin,
        fragmentLengthMax,
        fragmentIntervalMin,
        fragmentIntervalMax, 
        outProxy, 
        customCdnAddrs, 
        customCdnHost, 
        customCdnSni, 
        VLTRenableIPv6
    } = proxySettings;
    
    let VLConfs = '', TRConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6);
    const totalAddresses = [...Addresses, ...customCdnAddrs];
    const TRPass = encodeURIComponent(TRPassword);
    const earlyData = client === 'singbox' 
        ? '&eh=Sec-WebSocket-Protocol&ed=2560' 
        : encodeURIComponent('?ed=2560');
    
    ports.forEach(port => {
        totalAddresses.forEach((addr, index) => {
            const isCustomAddr = index > Addresses.length - 1;
            const configType = isCustomAddr ? 'C' : '';
            const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
            const host = isCustomAddr ? customCdnHost : hostName;
            const path = `${getRandomPath(16)}${proxyIPs.length ? `/${encodeURIComponent(btoa(proxyIPs.join(',')))}` : ''}${earlyData}`;
            const VLRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType));
            const TRRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', configType));
            const tlsFields = defaultHttpsPorts.includes(port) 
                ? `&security=tls&sni=${sni}&fp=randomized&alpn=http/1.1`
                : '&security=none';
            const hiddifyFragment = client === 'hiddify-frag' && defaultHttpsPorts.includes(port) ? `&fragment=${fragmentLengthMin}-${fragmentLengthMax},${fragmentIntervalMin}-${fragmentIntervalMax},hellotls` : '';

            if (VLConfigs) VLConfs += `vless://${userID}@${addr}:${port}?path=/${path}&encryption=none&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${VLRemark}\n`; 
            if (TRConfigs) TRConfs += `trojan://${TRPass}@${addr}:${port}?path=/tr${path}&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${TRRemark}\n`;
            proxyIndex++;
        });
    });

    if (outProxy) {
        let chainRemark = `#${encodeURIComponent('💦 Chain proxy 🔗')}`;
        if (outProxy.startsWith('socks') || outProxy.startsWith('http')) {
            const regex = /^(?:socks|http):\/\/([^@]+)@/;
            const isUserPass = outProxy.match(regex);
            const userPass = isUserPass ? isUserPass[1] : false;
            chainProxy = userPass 
                ? outProxy.replace(userPass, btoa(userPass)) + chainRemark 
                : outProxy + chainRemark;
        } else {
            chainProxy = outProxy.split('#')[0] + chainRemark;
        }
    }

    const configs = btoa(VLConfs + TRConfs + chainProxy);
    const headers = {
        'Content-Type': 'text/plain;charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store'
    };

    client === 'hiddify-frag' && Object.assign(headers, {
        'Profile-Title': 'BPB Fragment',
        'DNS': remoteDNS
    });

    return new Response(configs, { 
        status: 200,
        headers
    });
}

export async function getHiddifyWarpConfigs (request, env, isPro) {
    const { proxySettings } = await getDataset(request, env);
    const {
        warpEndpoints,
        hiddifyNoiseMode, 
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax
    } = proxySettings;

    let configs = '';
    warpEndpoints.forEach( (endpoint, index) => {
        configs += `warp://${endpoint}${ isPro ? `?ifp=${noiseCountMin}-${noiseCountMax}&ifps=${noiseSizeMin}-${noiseSizeMax}&ifpd=${noiseDelayMin}-${noiseDelayMax}&ifpm=${hiddifyNoiseMode}` : ''}#${encodeURIComponent(`💦 ${index + 1} - Warp 🇮🇷`)}&&detour=warp://162.159.192.1:2408#${encodeURIComponent(`💦 ${index + 1} - WoW 🌍`)}\n`;
    });

    return new Response(btoa(configs), { 
        status: 200,
        headers: {
            'Profile-Title': `BPB Warp${isPro ? ' Pro' : ''}`,
            'DNS': '1.1.1.1',
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}