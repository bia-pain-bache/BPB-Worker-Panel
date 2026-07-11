import { base64DecodeUtf8, base64EncodeUtf8 } from '@common';
import { getSettings } from '@settings';
import {
    generateRemark,
    generateWsPath,
    getConfigAddresses,
    getProtocols,
    isBase64,
    isHttps,
    selectSniHost
} from '@utils';

export async function getURLConfigs() {
    const {
        fingerprint,
        ports,
        chainProxy,
        remoteDNS,
        customConfigs,
        customSubs,
        customDomain,
        vlUUID,
        trPass,
        httpsPorts,
        client,
        mainDomain,
        upstreamParams: { upstreamServer, upstreamPort }
    } = getSettings();

    const buildConfig = (protocol: string, addr: string, port: number, host: string, sni: string, remark: string) => {
        const isTLS = httpsPorts.includes(port) || addr === upstreamServer;
        const security = isTLS ? 'tls' : 'none';
        const config = new URL(`${protocol}://config`);

        if (protocol === _VL_) {
            config.username = vlUUID;
            config.searchParams.append('encryption', 'none');
        } else {
            config.username = trPass;
        }

        const path = generateWsPath(protocol);
        config.hostname = addr;
        config.port = port.toString();
        config.searchParams.append('host', host);
        config.searchParams.append('type', 'ws');
        config.searchParams.append('security', security);
        config.hash = remark;

        if (client === 'sing-box') {
            config.searchParams.append('eh', 'Sec-WebSocket-Protocol');
            config.searchParams.append('ed', '2560');
            config.searchParams.append('path', path);
        } else {
            config.searchParams.append('path', `${path}?ed=2560`);
        }

        if (isTLS) {
            config.searchParams.append('sni', sni);
            config.searchParams.append('fp', fingerprint);
            config.searchParams.append('alpn', 'http/1.1');
        }

        return config.href;
    }

    let VLConfs = '', TRConfs = '', chainConfig = '';
    let proxyIndex = 1;
    const domains = [mainDomain].concatIf(!!customDomain, customDomain);
    const protocols = getProtocols();

    for (const domain of domains) {
        const totalPorts = ports.filter(port => domain.endsWith('workers.dev') || isHttps(port));
        const addrs = await getConfigAddresses(domain, false);
        if (upstreamServer && upstreamPort) {
            totalPorts.unshift(upstreamPort);
            addrs.unshift(upstreamServer);
        }

        for (const port of totalPorts) {
            for (const addr of addrs) {
                const { sni, host } = selectSniHost(addr, domain);
                if ((port === upstreamPort) !== (addr === upstreamServer)) continue;

                if (protocols.includes(_VL_)) {
                    const remark = generateRemark(proxyIndex, port, addr, _VL_, domain, false, false);
                    const vlConfig = buildConfig(_VL_, addr, port, host, sni, remark);
                    VLConfs += `${vlConfig}\n`;
                }

                if (protocols.includes(_TR_)) {
                    const remark = generateRemark(proxyIndex, port, addr, _TR_, domain, false, false);
                    const trConfig = buildConfig(_TR_, addr, port, host, sni, remark);
                    TRConfs += `${trConfig}\n`;
                }

                proxyIndex++;
            }
        }
    }

    if (chainProxy) {
        let chainRemark = `#${encodeURIComponent('💦 Chain proxy 🔗')}`;
        if (chainProxy.startsWith('socks') || chainProxy.startsWith('http')) {
            const regex = /^(?:socks|http):\/\/([^@]+)@/;
            const isUserPass = chainProxy.match(regex);
            const userPass = isUserPass ? isUserPass[1] : false;
            chainConfig = userPass
                ? chainProxy.replace(userPass, btoa(userPass)) + chainRemark
                : chainProxy + chainRemark;
        } else {
            chainConfig = chainProxy.split('#')[0] + chainRemark;
        }
    }

    const customConfs = customConfigs.join('\n') + await fetchCustomSubs(customSubs);
    const configs = base64EncodeUtf8(VLConfs + TRConfs + chainConfig + customConfs);

    return new Response(configs, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename=${_project_}-Raw.txt`,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Profile-Title': `base64:${base64EncodeUtf8(`💦 ${_project_} Raw`)}`,
            'DNS': remoteDNS
        }
    });
}

async function fetchCustomSubs(subs: string[]): Promise<string> {
    const results = await Promise.all(
        subs.map(async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return '';

                const text = (await res.text()).trim();
                if (!text) return '';

                if (isBase64(text)) {
                    try {
                        return base64DecodeUtf8(text);
                    } catch {
                        return text;
                    }
                }

                return text;
            } catch {
                return '';
            }
        })
    );

    return results
        .filter(Boolean)
        .join('\n');
}
