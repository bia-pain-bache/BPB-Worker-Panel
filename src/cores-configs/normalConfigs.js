import { getConfigAddresses, generateRemark, randomUpperCase, getRandomPath, extractWireguardParams, base64ToDecimal } from './helpers';
import { getDataset } from '../kv/handlers';

export async function getNormalConfigs(request, env) {
    const { hostName, defaultHttpsPorts, client, userID, TRPassword } = globalThis;
    const { proxySettings } = await getDataset(request, env);
    const {
        remoteDNS,
        cleanIPs, 
        proxyIP, 
        ports, 
        VLConfigs, 
        TRConfigs ,
        lengthMin,
        lengthMax,
        intervalMin,
        intervalMax, 
        outProxy, 
        customCdnAddrs, 
        customCdnHost, 
        customCdnSni, 
        enableIPv6
    } = proxySettings;
    
    let VLConfs = '', TRConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const Addresses = await getConfigAddresses(cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    const alpn = client === 'singbox' ? 'http/1.1' : 'h2,http/1.1';
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
            const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ''}${earlyData}`;
            const VLRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob('VkxFU1M='), configType));
            const TRRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, atob('VHJvamFu'), configType));
            const tlsFields = defaultHttpsPorts.includes(port) 
                ? `&security=tls&sni=${sni}&fp=randomized&alpn=${alpn}`
                : '&security=none';
            const hiddifyFragment = client === 'hiddify-frag' && defaultHttpsPorts.includes(port) ? `&fragment=${lengthMin}-${lengthMax},${intervalMin}-${intervalMax},hellotls` : '';

            if (VLConfigs) VLConfs += `${atob('dmxlc3M6Ly8=')}${userID}@${addr}:${port}?path=/${path}&encryption=none&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${VLRemark}\n`; 
            if (TRConfigs) TRConfs += `${atob('dHJvamFuOi8v')}${TRPass}@${addr}:${port}?path=/tr${path}&host=${host}&type=ws${tlsFields}${hiddifyFragment}#${TRRemark}\n`;
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
    const { proxySettings, warpConfigs } = await getDataset(request, env);
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

    // const warp = extractWireguardParams(warpConfigs, false);
    // const wow = extractWireguardParams(warpConfigs, true);

    let configs = '';
    warpEndpoints.split(',').forEach( (endpoint, index) => {
        // const warpConfig = `wg://${endpoint}/${ isPro ? `?ifp=${noiseCountMin}-${noiseCountMax}&ifps=${noiseSizeMin}-${noiseSizeMax}&ifpd=${noiseDelayMin}-${noiseDelayMax}&ifpm=${hiddifyNoiseMode}` : ''}&pk=${wow.privateKey}&local_address=${encodeURIComponent('172.16.0.2/32')}&peer_pk=${wow.publicKey}&mtu=1280&reserved=${base64ToDecimal(wow.reserved).join(',')}#${encodeURIComponent(`💦 ${index + 1} - Warp 🇮🇷`)}`;
        // const wowConfig = `wg://162.159.192.1:2408/?pk=${wow.privateKey}&local_address=${encodeURIComponent('172.16.0.2/32')}&peer_pk=${wow.publicKey}&mtu=1280&reserved=${base64ToDecimal(wow.reserved).join(',')}#${encodeURIComponent(`💦 ${index + 1} - WoW 🌍`)}`;
        // configs += `${warpConfig}&&detour=${wowConfig}\n`;
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