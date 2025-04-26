import { getConfigAddresses, generateRemark, randomUpperCase, getRandomPath, base64EncodeUnicode } from './helpers';

export async function getNormalConfigs(isFragment) {
    const { hostName, defaultHttpsPorts, client, userID, TRPassword } = globalThis;
    const {
        remoteDNS,
        cleanIPs,
        proxyIPs,
        ports,
        VLConfigs,
        TRConfigs,
        fragmentLengthMin,
        fragmentLengthMax,
        fragmentIntervalMin,
        fragmentIntervalMax,
        outProxy,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        VLTRenableIPv6
    } = globalThis.proxySettings;

    let VLConfs = '', TRConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6, customCdnAddrs, isFragment);

    const buildConfig = (protocol, addr, port, host, sni, remark) => {

        const isTLS = defaultHttpsPorts.includes(port);
        const security = isTLS ? 'tls' : 'none';
        const path = `${getRandomPath(16)}${proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : ''}`;
        const config = new URL(`${protocol}://config`);
        let pathPrefix = '';

        if (protocol === 'vless') {
            config.username = userID;
            config.searchParams.append('encryption', 'none');
        } else {
            config.username = TRPassword;
            pathPrefix = 'tr';
        }

        config.hostname = addr;
        config.port = port;
        config.searchParams.append('host', host);
        config.searchParams.append('type', 'ws');
        config.searchParams.append('security', security);
        config.hash = remark;

        if (client === 'singbox') {
            config.searchParams.append('eh', 'Sec-WebSocket-Protocol');
            config.searchParams.append('ed', '2560');
            config.searchParams.append('path', `/${pathPrefix}${path}`);
        } else {
            config.searchParams.append('path', `/${pathPrefix}${path}?ed=2560`);
        }

        if (isTLS) {
            config.searchParams.append('sni', sni);
            config.searchParams.append('fp', 'randomized');
            config.searchParams.append('alpn', 'http/1.1');

            if (client === 'hiddify-frag') {
                config.searchParams.append('fragment', `${fragmentLengthMin}-${fragmentLengthMax},${fragmentIntervalMin}-${fragmentIntervalMax},hellotls`);
            }
        }

        return config.href;
    }

    ports.forEach(port => {
        Addresses.forEach((addr, index) => {

            const isCustomAddr = index > Addresses.length - 1;
            const configType = isCustomAddr ? 'C' : '';
            const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
            const host = isCustomAddr ? customCdnHost : hostName;

            const VLRemark = generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType);
            const TRRemark = generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', configType);

            if (VLConfigs) {
                const vlessConfig = buildConfig('vless', addr, port, host, sni, VLRemark);
                VLConfs += `${vlessConfig}\n`;
            }

            if (TRConfigs) {
                const trojanConfig = buildConfig('trojan', addr, port, host, sni, TRRemark);
                TRConfs += `${trojanConfig}\n`;
            }

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
    const hiddifyHash = base64EncodeUnicode('💦 BPB Normal');
    
    return new Response(configs, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store',
            'Profile-Title': `base64:${hiddifyHash}`,
            'DNS': remoteDNS
        }
    });
}

export async function getHiddifyWarpConfigs(isPro) {

    const {
        warpEndpoints,
        hiddifyNoiseMode,
        noiseCountMin,
        noiseCountMax,
        noiseSizeMin,
        noiseSizeMax,
        noiseDelayMin,
        noiseDelayMax
    } = globalThis.proxySettings;

    let configs = '';
    warpEndpoints.forEach((endpoint, index) => {
        const config = new URL('warp://config');
        config.host = endpoint;
        config.hash = `💦 ${index + 1} - Warp 🇮🇷`;

        if (isPro) {
            config.searchParams.append('ifpm', hiddifyNoiseMode);
            config.searchParams.append('ifp', `${noiseCountMin}-${noiseCountMax}`);
            config.searchParams.append('ifps', `${noiseSizeMin}-${noiseSizeMax}`);
            config.searchParams.append('ifpd', `${noiseDelayMin}-${noiseDelayMax}`);
        }

        const detour = new URL('warp://config');
        detour.host = '162.159.192.1:2408';
        detour.hash = `💦 ${index + 1} - WoW 🌍`;

        configs += `${config.href}&&detour=${detour.href}\n`;
    });

    const hiddifyHash = base64EncodeUnicode(`💦 BPB Warp${isPro ? ' Pro' : ''}`);
    return new Response(btoa(configs), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store',
            'Profile-Title': `base64:${hiddifyHash}`,
            'DNS': '1.1.1.1'
        }
    });
}