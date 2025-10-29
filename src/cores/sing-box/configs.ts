import { getDataset } from 'kv';
import { buildDNS } from './dns';
import { buildRoutingRules } from './routing';
import {
    buildChainOutbound,
    buildWarpOutbound,
    buildWebsocketOutbound
} from './outbounds.js';

import {
    AnyOutbound,
    WireguardEndpoint,
    Config,
    URLTest
} from 'types/sing-box';

import {
    getConfigAddresses,
    generateRemark,
    randomUpperCase,
    isHttps,
    getProtocols
} from '@utils';

async function buildConfig(
    outbounds: AnyOutbound[],
    endpoints: WireguardEndpoint[],
    selectorTags: string[],
    urlTestTags: string[],
    secondUrlTestTags: string[],
    isWarp: boolean,
    isIPv6: boolean,
    isChain: boolean
): Promise<Config> {
    const { 
        bestWarpInterval, 
        bestVLTRInterval,
        logLevel,
        allowLANConnection 
    } = globalThis.settings;

    const config: Config = {
        log: {
            disabled: logLevel === "none",
            level: logLevel === "none" ? undefined : logLevel.replace("warning", "warn"),
            timestamp: true
        },
        dns: await buildDNS(isWarp, isChain),
        inbounds: [
            {
                type: "tun",
                tag: "tun-in",
                address: [
                    "172.18.0.1/30",
                    ...(isIPv6 ? ["fdfe:dcba:9876::1/126"] : [])
                ],
                mtu: 9000,
                auto_route: true,
                strict_route: true,
                stack: "mixed"
            },
            {
                type: "mixed",
                tag: "mixed-in",
                listen: allowLANConnection ? "0.0.0.0" : "127.0.0.1",
                listen_port: 2080
            }
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
        endpoints: endpoints.length ? endpoints : undefined,
        route: buildRoutingRules(isWarp, isChain),
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
                external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
                external_ui_download_detour: "direct",
                default_mode: "Rule"
            }
        }
    };

    const addUrlTest = (tag: string, outbounds: string[]) => config.outbounds.push({
        type: "urltest",
        tag,
        outbounds,
        url: "https://www.gstatic.com/generate_204",
        interrupt_exist_connections: false,
        interval: isWarp ? `${bestWarpInterval}s` : `${bestVLTRInterval}s`
    } satisfies URLTest);

    addUrlTest(isWarp ? `💦 Warp - Best Ping 🚀` : '💦 Best Ping 🚀', urlTestTags);
    if (isWarp) addUrlTest('💦 WoW - Best Ping 🚀', secondUrlTestTags);
    if (isChain) addUrlTest('💦 🔗 Best Ping 🚀', secondUrlTestTags);

    return config;
}

export async function getSbCustomConfig(isFragment: boolean): Promise<Response> {
    const {
        httpConfig: { hostName },
        settings: {
            outProxy,
            ports,
            customCdnAddrs,
            customCdnHost,
            customCdnSni,
            VLTRenableIPv6
        }
    } = globalThis;

    const chainProxy = outProxy ? buildChainOutbound() : undefined;
    const isChain = !!chainProxy;

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: AnyOutbound[] = [];

    const protocols = getProtocols();
    const Addresses = await getConfigAddresses(isFragment);
    const finalPorts = isFragment
        ? ports.filter(port => isHttps(port))
        : ports;

    const selectorTags = [
        '💦 Best Ping 🚀',
        ...(isChain ? ['💦 🔗 Best Ping 🚀'] : [])
    ];

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        finalPorts.forEach(port => {
            Addresses.forEach(addr => {
                const isCustomAddr = customCdnAddrs.includes(addr);
                const configType = isFragment ? 'F' : isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const tag = generateRemark(protocolIndex, port, addr, protocol, configType, false);

                const outbound = buildWebsocketOutbound(protocol, tag, addr, port, host, sni, isCustomAddr, isFragment);
                outbounds.push(outbound);
                proxyTags.push(tag);
                selectorTags.push(tag);

                if (isChain) {
                    const chainTag = generateRemark(protocolIndex, port, addr, protocol, configType, true);
                    const chain = structuredClone(chainProxy);
                    chain.tag = chainTag;
                    chain.detour = tag;
                    outbounds.push(chain);

                    chainTags.push(chainTag);
                    selectorTags.push(chainTag);
                }

                protocolIndex++;
            });
        });
    });

    const config = await buildConfig(outbounds, [], selectorTags, proxyTags, chainTags, false, VLTRenableIPv6, isChain);

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
    const { warpEndpoints, warpEnableIPv6 } = globalThis.settings;
    const { warpAccounts } = await getDataset(request, env);

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: WireguardEndpoint[] = [];
    const selectorTags = [
        '💦 Warp - Best Ping 🚀',
        '💦 WoW - Best Ping 🚀'
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

    const config = await buildConfig([], outbounds, selectorTags, proxyTags, chainTags, true, warpEnableIPv6, false);

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}