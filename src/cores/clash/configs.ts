import { buildDNS } from './dns';
import { buildRoutingRules, buildRuleProviders } from './routing';
import { buildChainOutbound, buildUrlTest, buildWarpOutbound, buildWebsocketOutbound } from './outbounds';
import type { WireguardOutbound, Config, Outbound } from '#types/clash';
import { getConfigAddresses, generateRemark, isHttps, getProtocols } from '@utils';
import { sniffer, tun } from './inbounds';
import { getSettings, getWarpAccounts } from '@settings';

type TagGroup = Record<string, string[]>;

async function buildConfig(
    outbounds: Outbound[],
    TagGroups: TagGroup,
    isChain: boolean,
    isWarp: boolean,
    isPro: boolean
): Promise<Config> {
    const { logLevel, allowLANConnection } = getSettings();

    const keys = Object.keys(TagGroups);
    const selectorTags: string[] = [
        ...keys,
        ...keys.flatMap(key => TagGroups[key])
    ];

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

    for (const key of keys) {
        if (TagGroups[key].length) {
            const urlTest = buildUrlTest(key, TagGroups[key], isWarp);
            config['proxy-groups'].push(urlTest);
        }
    }

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

    const outbounds: Outbound[] = [];
    const tagGroup: TagGroup = {
        '💦 Best Ping 🚀': [],
        '💦 🔗 Best Ping 🚀': [],
        '💦 Best Ping D 🚀': [],
        '💦 🔗 Best Ping D 🚀': [],
    };

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
                        outbounds.push(outbound);
                        if (domain === customDomain) {
                            tagGroup['💦 Best Ping D 🚀'].push(tag);
                        } else {
                            tagGroup['💦 Best Ping 🚀'].push(tag);
                        }

                        if (isChain) {
                            const chainTag = generateRemark(protocolIndex, port, host, protocol, domain, false, true);
                            const chain = structuredClone(chainOutbound);
                            chain['name'] = chainTag;
                            chain['dialer-proxy'] = tag;
                            outbounds.push(chain);

                            if (domain === customDomain) {
                                tagGroup['💦 🔗 Best Ping D 🚀'].push(chainTag);
                            } else {
                                tagGroup['💦 🔗 Best Ping 🚀'].push(chainTag);
                            }
                        }

                        protocolIndex++;
                    }
                }
            }
        }
    }

    const config = await buildConfig(
        outbounds,
        tagGroup,
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

    const outbounds: WireguardOutbound[] = [];
    const proSign = isPro ? 'Pro ' : '';
    const tagGroup: TagGroup = {
        [`💦 Warp ${proSign}- Best Ping 🚀`]: [],
        [`💦 WoW ${proSign}- Best Ping 🚀`]: []
    };

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1}. Warp ${proSign}🇮🇷`;
        tagGroup[`💦 Warp ${proSign}- Best Ping 🚀`].push(warpTag);

        const wowTag = `💦 ${index + 1}. WoW ${proSign}🌍`;
        tagGroup[`💦 WoW ${proSign}- Best Ping 🚀`].push(wowTag);

        const warpOutbound = buildWarpOutbound(warpAccounts[0], warpTag, endpoint, '', isPro);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], wowTag, endpoint, warpTag, false);
        outbounds.push(warpOutbound, wowOutbound);
    });

    const config = await buildConfig(
        outbounds,
        tagGroup,
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