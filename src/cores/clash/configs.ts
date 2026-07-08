import { buildDNS } from './dns';
import { buildRoutingRules, buildRuleProviders } from './routing';
import { buildChainOutbound, buildUrlTest, buildWarpOutbound, buildWebsocketOutbound } from './outbounds';
import type { WireguardOutbound, Config, Outbound } from '#types/clash';
import { getConfigAddresses, generateRemark, isHttps, getProtocols } from '@utils';
import { sniffer, tun } from './inbounds';
import { getSettings, getWarpAccounts } from '@settings';

async function buildConfig(
    outbounds: Outbound[],
    selectorTags: string[],
    proxyTags: string[],
    chainTags: string[],
    isChain: boolean,
    isWarp: boolean,
    isPro: boolean
): Promise<Config> {
    const { logLevel, allowLANConnection } = getSettings();
    const tcpSettings = isWarp ? {} : {
        'disable-keep-alive': false,
        'keep-alive-idle': 10,
        'keep-alive-interval': 15,
        'tcp-concurrent': true
    };

    const config: Config = {
        'mixed-port': 7890,
        'ipv6': true,
        'allow-lan': allowLANConnection,
        'unified-delay': false,
        'log-level': logLevel.replace('none', 'silent'),
        'mode': 'rule',
        ...tcpSettings,
        'geo-auto-update': true,
        'geo-update-interval': 168,
        'external-controller': '127.0.0.1:9090',
        'external-controller-cors': {
            'allow-origins': ['*'],
            'allow-private-network': true
        },
        'external-ui': 'ui',
        'external-ui-url': 'https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip',
        'profile': {
            'store-selected': true,
            'store-fake-ip': true
        },
        'dns': await buildDNS(isChain, isWarp, isPro),
        'tun': tun,
        'sniffer': sniffer,
        'proxies': outbounds,
        'proxy-groups': [
            {
                'name': '✅ Selector',
                'type': 'select',
                'proxies': selectorTags
            }
        ],
        'rule-providers': buildRuleProviders(),
        'rules': buildRoutingRules(isWarp),
        'ntp': {
            'enable': true,
            'server': 'time.cloudflare.com',
            'port': 123,
            'interval': 30
        }
    };

    const name = isWarp ? `💦 Warp ${isPro ? 'Pro ' : ''}- Best Ping 🚀` : '💦 Best Ping 🚀';
    const mainUrlTest = buildUrlTest(name, proxyTags, isWarp);
    config['proxy-groups'].push(mainUrlTest);
    if (isWarp) config['proxy-groups'].push(buildUrlTest(`💦 WoW ${isPro ? 'Pro ' : ''}- Best Ping 🚀`, chainTags, isWarp));
    if (isChain) config['proxy-groups'].push(buildUrlTest('💦 🔗 Best Ping 🚀', chainTags, isWarp));

    return config;
}

export async function getClNormalConfig(): Promise<Response> {
    const {
        chainProxy,
        ports,
        mainDomain,
        customDomain,
        upstreamParams: { upstreamServer, upstreamPort }
    } = getSettings();

    const chainOutbound = chainProxy ? buildChainOutbound() : undefined;
    const isChain = !!chainOutbound;
    const domains = [mainDomain].concatIf(!!customDomain, customDomain);
    const protocols = getProtocols();

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: Outbound[] = [];
    const selectorTags = ['💦 Best Ping 🚀'].concatIf(isChain, '💦 🔗 Best Ping 🚀');

    for (const domain of domains) {
        const totalPorts = ports.filter(port => domain.endsWith('workers.dev') || isHttps(port));
        const hosts = await getConfigAddresses(domain, false);
        if (upstreamServer && upstreamPort) {
            totalPorts.unshift(upstreamPort);
            hosts.unshift(upstreamServer);
        }

        for (const protocol of protocols) {
            let protocolIndex = 1;
            for (const port of totalPorts) {
                for (const host of hosts) {
                    if ((port === upstreamPort) !== (host === upstreamServer)) continue;

                    const tag = generateRemark(protocolIndex, port, host, protocol, domain, false, false);
                    const outbound = buildWebsocketOutbound(protocol, tag, host, port, domain);

                    if (outbound) {
                        proxyTags.push(tag);
                        selectorTags.push(tag);
                        outbounds.push(outbound);

                        if (isChain) {
                            const chainTag = generateRemark(protocolIndex, port, host, protocol, domain, false, true);
                            const chain = structuredClone(chainOutbound);
                            chain['name'] = chainTag;
                            chain['dialer-proxy'] = tag;
                            outbounds.push(chain);

                            chainTags.push(chainTag);
                            selectorTags.push(chainTag);
                        }

                        protocolIndex++;
                    }
                }
            }
        }
    }

    const config = await buildConfig(
        outbounds,
        selectorTags,
        proxyTags,
        chainTags,
        isChain,
        false,
        false
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}

export async function getClWarpConfig(isPro: boolean): Promise<Response> {
    const { warpEndpoints } = getSettings();
    const warpAccounts = getWarpAccounts();

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: WireguardOutbound[] = [];
    const proSign = isPro ? 'Pro ' : '';
    const selectorTags = [
        `💦 Warp ${proSign}- Best Ping 🚀`,
        `💦 WoW ${proSign}- Best Ping 🚀`
    ];

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1} - Warp ${proSign}🇮🇷`;
        proxyTags.push(warpTag);

        const wowTag = `💦 ${index + 1} - WoW ${proSign}🌍`;
        chainTags.push(wowTag);

        selectorTags.push(warpTag, wowTag);
        const warpOutbound = buildWarpOutbound(warpAccounts[0], warpTag, endpoint, '', isPro);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], wowTag, endpoint, warpTag, false);
        outbounds.push(warpOutbound, wowOutbound);
    });

    const config = await buildConfig(
        outbounds,
        selectorTags,
        proxyTags,
        chainTags,
        false,
        true,
        isPro
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}