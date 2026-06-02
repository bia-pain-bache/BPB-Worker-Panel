import { getDataset } from '@kv';
import { buildDNS } from './dns';
import { buildRoutingRules } from './routing';
import { buildChainOutbound, buildUrlTest, buildWarpOutbound, buildWebsocketOutbound } from './outbounds.js';
import { Outbound, WireguardEndpoint, Config } from '#types/sing-box';
import { getConfigAddresses, generateRemark, isHttps, getProtocols } from '@utils';
import { buildMixedInbound, tun } from './inbounds';

async function buildConfig(
    outbounds: Outbound[],
    endpoints: WireguardEndpoint[],
    selectorTags: string[],
    urlTestTags: string[],
    secondUrlTestTags: string[],
    isWarp: boolean,
    isChain: boolean
): Promise<Config> {
    const { logLevel } = globalThis.settings;

    const config: Config = {
        log: {
            disabled: logLevel === "none",
            level: logLevel === "none" ? undefined : logLevel === "warning" ? "warn" : logLevel,
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
                type: "selector",
                tag: "✅ Selector",
                outbounds: selectorTags,
                interrupt_exist_connections: false
            },
            {
                type: "direct",
                tag: "direct"
            }
        ],
        endpoints: endpoints.omitEmpty(),
        route: buildRoutingRules(isWarp),
        ntp: {
            enabled: true,
            server: "time.cloudflare.com",
            server_port: 123,
            domain_resolver: "dns-direct",
            interval: "30m",
            write_to_system: false
        },
        experimental: {
            cache_file: {
                enabled: true,
                store_fakeip: true
            },
            clash_api: {
                external_controller: "127.0.0.1:9090",
                external_ui: "ui",
                default_mode: "Rule",
                external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
                external_ui_download_detour: "direct"
            }
        }
    };

    const tag = isWarp ? `💦 Warp - Best Ping 🚀` : "💦 Best Ping 🚀";
    const mainUrlTest = buildUrlTest(tag, urlTestTags, isWarp);
    config.outbounds.push(mainUrlTest);
    if (isWarp) config.outbounds.push(buildUrlTest("💦 WoW - Best Ping 🚀", secondUrlTestTags, isWarp));
    if (isChain) config.outbounds.push(buildUrlTest("💦 🔗 Best Ping 🚀", secondUrlTestTags, isWarp));

    return config;
}

export async function getSbCustomConfig(isFragment: boolean): Promise<Response> {
    const { outProxy, ports, upstreamParams: { upstreamServer, upstreamPort } } = globalThis.settings;
    const chainProxy = outProxy ? buildChainOutbound() : undefined;
    const isChain = !!chainProxy;
    const protocols = getProtocols();
    const hosts = await getConfigAddresses(isFragment);
    const totalPorts = ports.filter(port => !isFragment || isHttps(port));

    if (upstreamServer && upstreamPort && !isFragment) {
        totalPorts.unshift(upstreamPort);
        hosts.unshift(upstreamServer);
    }

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: Outbound[] = [];

    const selectorTags = ["💦 Best Ping 🚀"].concatIf(isChain, "💦 🔗 Best Ping 🚀");

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const host of hosts) {
                if ((port === upstreamPort) !== (host === upstreamServer)) continue;

                const tag = generateRemark(protocolIndex, port, host, protocol, isFragment, false);
                const outbound = buildWebsocketOutbound(protocol, tag, host, port, isFragment);

                outbounds.push(outbound);
                proxyTags.push(tag);
                selectorTags.push(tag);

                if (isChain) {
                    const chainTag = generateRemark(protocolIndex, port, host, protocol, isFragment, true);
                    const chain = structuredClone(chainProxy);
                    chain.tag = chainTag;
                    chain.detour = tag;
                    outbounds.push(chain);

                    chainTags.push(chainTag);
                    selectorTags.push(chainTag);
                }

                protocolIndex++;
            }
        }
    }

    const config = await buildConfig(
        outbounds,
        [],
        selectorTags,
        proxyTags,
        chainTags,
        false,
        isChain
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getSbWarpConfig(request: Request, env: Env): Promise<Response> {
    const { warpEndpoints } = globalThis.settings;
    const { warpAccounts } = await getDataset(request, env);

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: WireguardEndpoint[] = [];
    const selectorTags = [
        "💦 Warp - Best Ping 🚀",
        "💦 WoW - Best Ping 🚀"
    ];

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1} - Warp 🇮🇷`;
        proxyTags.push(warpTag);

        const wowTag = `💦 ${index + 1} - WoW 🌍`;
        chainTags.push(wowTag);

        selectorTags.push(warpTag, wowTag);
        const warpOutbound = buildWarpOutbound(warpAccounts[0], warpTag, endpoint);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], wowTag, endpoint, warpTag);
        outbounds.push(warpOutbound, wowOutbound);
    });

    const config = await buildConfig(
        [],
        outbounds,
        selectorTags,
        proxyTags,
        chainTags,
        true,
        false
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}