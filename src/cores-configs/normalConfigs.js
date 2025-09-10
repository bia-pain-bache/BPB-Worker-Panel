import { globalConfig, httpConfig } from '../helpers/init';
import { getConfigAddresses, generateRemark, randomUpperCase, base64EncodeUnicode, generateWsPath } from './helpers';

export async function getNormalConfigs(isFragment) {
    const settings = globalThis.settings;
    let VLConfs = '', TRConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const Addresses = await getConfigAddresses(isFragment);

    const buildConfig = (protocol, addr, port, host, sni, remark) => {
        const isTLS = httpConfig.defaultHttpsPorts.includes(port);
        const security = isTLS ? 'tls' : 'none';
        
        const config = new URL(`${protocol}://config`);
        let pathProtocol = 'vl';

        if (protocol === atob('dmxlc3M=')) {
            config.username = globalConfig.userID;
            config.searchParams.append('encryption', 'none');
        } else {
            config.username = globalConfig.TrPass;
            pathProtocol = 'tr';
        }

        const path = generateWsPath(pathProtocol);
        config.hostname = addr;
        config.port = port;
        config.searchParams.append('host', host);
        config.searchParams.append('type', 'ws');
        config.searchParams.append('security', security);
        config.hash = remark;

        if (httpConfig.client === 'singbox') {
            config.searchParams.append('eh', 'Sec-WebSocket-Protocol');
            config.searchParams.append('ed', '2560');
            config.searchParams.append('path', path);
        } else {
            config.searchParams.append('path', `${path}?ed=2560`);
        }

        if (isTLS) {
            config.searchParams.append('sni', sni);
            config.searchParams.append('fp', settings.fingerprint);
            config.searchParams.append('alpn', 'http/1.1');

            if (httpConfig.client === 'hiddify-frag') {
                config.searchParams.append('fragment', `${settings.fragmentLengthMin}-${settings.fragmentLengthMax},${settings.fragmentIntervalMin}-${settings.fragmentIntervalMax},hellotls`);
            }
        }

        return config.href;
    }

    settings.ports.forEach(port => {
        Addresses.forEach(addr => {
            const isCustomAddr = settings.customCdnAddrs.includes(addr) && !isFragment;
            const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
            const sni = isCustomAddr ? settings.customCdnSni : randomUpperCase(httpConfig.hostName);
            const host = isCustomAddr ? settings.customCdnHost : httpConfig.hostName;

            const VLRemark = generateRemark(proxyIndex, port, addr, settings.cleanIPs, atob('VkxFU1M='), configType);
            const TRRemark = generateRemark(proxyIndex, port, addr, settings.cleanIPs, atob('VHJvamFu'), configType);

            if (settings.VLConfigs) {
                const vlConfig = buildConfig(atob('dmxlc3M='), addr, port, host, sni, VLRemark);
                VLConfs += `${vlConfig}\n`;
            }

            if (settings.TRConfigs) {
                const trConfig = buildConfig(atob('dHJvamFu'), addr, port, host, sni, TRRemark);
                TRConfs += `${trConfig}\n`;
            }

            proxyIndex++;
        });
    });

    if (settings.outProxy) {
        let chainRemark = `#${encodeURIComponent('💦 Chain proxy 🔗')}`;
        if (settings.outProxy.startsWith('socks') || settings.outProxy.startsWith('http')) {
            const regex = /^(?:socks|http):\/\/([^@]+)@/;
            const isUserPass = settings.outProxy.match(regex);
            const userPass = isUserPass ? isUserPass[1] : false;
            chainProxy = userPass
                ? settings.outProxy.replace(userPass, btoa(userPass)) + chainRemark
                : settings.outProxy + chainRemark;
        } else {
            chainProxy = settings.outProxy.split('#')[0] + chainRemark;
        }
    }

    const configs = btoa(VLConfs + TRConfs + chainProxy);
    const hiddifyHash = base64EncodeUnicode(isFragment ? `💦 ${atob('QlBC')} Fragment` : `💦 ${atob('QlBC')} Normal`);

    return new Response(configs, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store',
            'Profile-Title': `base64:${hiddifyHash}`,
            'DNS': settings.remoteDNS
        }
    });
}

export async function getHiddifyWarpConfigs(isPro) {
    const settings = globalThis.settings;
    let configs = '';
    settings.warpEndpoints.forEach((endpoint, index) => {
        const config = new URL('warp://config');
        config.host = endpoint;
        config.hash = `💦 ${index + 1} - Warp 🇮🇷`;

        if (isPro) {
            config.searchParams.append('ifpm', settings.hiddifyNoiseMode);
            config.searchParams.append('ifp', `${settings.noiseCountMin}-${settings.noiseCountMax}`);
            config.searchParams.append('ifps', `${settings.noiseSizeMin}-${settings.noiseSizeMax}`);
            config.searchParams.append('ifpd', `${settings.noiseDelayMin}-${settings.noiseDelayMax}`);
        }

        const detour = new URL('warp://config');
        detour.host = '162.159.192.1:2408';
        detour.hash = `💦 ${index + 1} - WoW 🌍`;

        configs += `${config.href}&&detour=${detour.href}\n`;
    });

    const hiddifyHash = base64EncodeUnicode(`💦 ${atob('QlBC')} Warp${isPro ? ' Pro' : ''}`);
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