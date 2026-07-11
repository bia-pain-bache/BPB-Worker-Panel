import { Outbound, WireguardEndpoint, Config } from '#types/sing-box';
import { getConfigAddresses, generateRemark, isHttps, getProtocols } from '@utils';
import { buildChainOutbound, buildUrlTest, buildWarpOutbound, buildWebsocketOutbound } from './outbounds.js';
import { getSettings, getWarpAccounts } from '@settings';
import { buildRoutingRules } from './routing';
import { buildMixedInbound, tun } from './inbounds';
import { buildDNS } from './dns';

type TagGroup = Record<string, string[]>;

async function buildConfig(
    outbounds: Outbound[],
    endpoints: WireguardEndpoint[],
    TagGroups: TagGroup,
    isWarp: boolean,
    isChain: boolean
): Promise<Config> {
    const { logLevel } = getSettings();

    const keys = Object.keys(TagGroups);
    const selectorTags: string[] = [
        ...keys,
        ...keys.flatMap(key => TagGroups[key])
    ];

    const config: Config = {
        log: {
            disabled: logLevel === 'none',
            level: logLevel === 'none' ? undefined : logLevel === 'warning' ? 'warn' : logLevel,
            timestamp: true
        },
        dns: await buildDNS(isWarp, isChain),
        inbounds: [
            tun,
            buildMixedInbound()
        ],
        outbounds: [
            ...outbounds,
            {
                type: 'selector',
                tag: '✅ Selector',
                outbounds: selectorTags,
                interrupt_exist_connections: false
            },
            {
                type: 'direct',
                tag: 'direct',
                domain_resolver: 'dns-direct'
            }
        ],
        endpoints: endpoints.omitEmpty(),
        route: buildRoutingRules(isWarp),
        ntp: {
            enabled: true,
            server: 'time.cloudflare.com',
            server_port: 123,
            domain_resolver: 'dns-direct',
            interval: '30m',
            write_to_system: false
        },
        experimental: {
            cache_file: {
                enabled: true,
                store_fakeip: true
            },
            clash_api: {
                external_controller: '127.0.0.1:9090',
                external_ui: 'ui',
                default_mode: 'Rule',
                external_ui_download_url: 'https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip',
                external_ui_download_detour: 'direct'
            }
        }
    };

    for (const key of keys) {
        if (TagGroups[key].length) {
            const urlTest = buildUrlTest(key, TagGroups[key], isWarp);
            config.outbounds.push(urlTest);
        }
    }

    return config;
}

export async function getSbCustomConfig(isFragment: boolean): Promise<Response> {
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
        const totalPorts = ports.filter(port => !isFragment && domain.endsWith('workers.dev') || isHttps(port));
        const hosts = await getConfigAddresses(domain, isFragment);
        if (upstreamServer && upstreamPort) {
            totalPorts.unshift(upstreamPort);
            hosts.unshift(upstreamServer);
        }

        for (const protocol of protocols) {
            let protocolIndex = 1;
            for (const port of totalPorts) {
                for (const host of hosts) {
                    if ((port === upstreamPort) !== (host === upstreamServer)) continue;

                    const tag = generateRemark(protocolIndex, port, host, protocol, domain, isFragment, false);
                    const outbound = buildWebsocketOutbound(protocol, tag, host, port, domain, isFragment);
                    outbounds.push(outbound);
                    
                    if (domain === customDomain) {
                        tagGroup['💦 Best Ping D 🚀'].push(tag);
                    } else {
                        tagGroup['💦 Best Ping 🚀'].push(tag);
                    }

                    if (isChain) {
                        const chainTag = generateRemark(protocolIndex, port, host, protocol, domain, isFragment, true);
                        const chain = structuredClone(chainOutbound);
                        chain.tag = chainTag;
                        chain.detour = tag;
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

    const config = await buildConfig(
        outbounds,
        [],
        tagGroup,
        false,
        isChain
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

export async function getSbWarpConfig(): Promise<Response> {
    const { warpEndpoints } = getSettings();
    const warpAccounts = getWarpAccounts();
    const outbounds: WireguardEndpoint[] = [];

    const tagGroup: TagGroup = {
        '💦 Warp - Best Ping 🚀': [],
        '💦 WoW - Best Ping 🚀': []
    };

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1}. Warp 🇮🇷`;
        tagGroup['💦 Warp - Best Ping 🚀'].push(warpTag);

        const wowTag = `💦 ${index + 1}. WoW 🌍`;
        tagGroup['💦 WoW - Best Ping 🚀'].push(wowTag);

        const warpOutbound = buildWarpOutbound(warpAccounts[0], warpTag, endpoint);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], wowTag, endpoint, warpTag);
        outbounds.push(warpOutbound, wowOutbound);
    });

    const config = await buildConfig(
        [],
        outbounds,
        tagGroup,
        true,
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