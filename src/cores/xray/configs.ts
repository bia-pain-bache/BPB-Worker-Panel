import { getDataset } from 'kv';
import { buildDNS } from './dns';
import { buildRoutingRules } from './routing';
import type { Balancer, Config, Observatory, Outbound } from 'types/xray';
import { buildDokodemoInbound, buildMixedInbound } from './inbounds';
import {
    buildChainOutbound,
    buildWebsocketOutbound,
    buildWarpOutbound,
    buildFreedomOutbound
} from './outbounds';

import {
    getConfigAddresses,
    generateRemark,
    isDomain,
    isHttps,
    getProtocols,
    parseHostPort,
    toRange
} from '@utils';

function buildBalancer(tag: string, selector: string, hasFallback: boolean): Balancer {
    return {
        tag,
        selector: [selector],
        strategy: {
            type: "leastPing",
        },
        fallbackTag: hasFallback ? "proxy-2" : undefined
    };
}

async function buildConfig(
    remark: string,
    outbounds: Outbound[],
    isBalancer: boolean,
    isChain: boolean,
    balancerFallback: boolean,
    isWarp: boolean,
    isWorkerLess: boolean,
    outboundAddrs: string[],
    domainToStaticIPs?: string,
    customDns?: string,
    customDnsHosts?: string[]
): Promise<Config> {
    const {
        fakeDNS,
        bestWarpInterval,
        bestVLTRInterval,
        logLevel,
        allowLANConnection
    } = globalThis.settings;
    let balancers, observatory;

    if (isBalancer) {
        balancers = [buildBalancer("all-proxies", "proxy", balancerFallback)]
            .concatIf(isChain, buildBalancer("all-chains", "chain", false));

        observatory = {
            subjectSelector: isChain ? ["chain", "proxy"] : ["proxy"],
            probeUrl: "https://www.gstatic.com/generate_204",
            probeInterval: `${isWarp
                ? bestWarpInterval
                : bestVLTRInterval}s`,
            enableConcurrency: true
        } satisfies Observatory;
    }

    const config: Config = {
        remarks: remark,
        version: {
            min: "25.10.15"
        },
        log: {
            loglevel: logLevel,
        },
        dns: await buildDNS(outboundAddrs, isWorkerLess, isWarp, domainToStaticIPs, customDns, customDnsHosts),
        inbounds: [
            buildMixedInbound(allowLANConnection, isWorkerLess, fakeDNS),
            buildDokodemoInbound(allowLANConnection)
        ],
        outbounds: [
            ...outbounds,
            {
                protocol: "dns",
                settings: {
                    nonIPQuery: "reject"
                },
                tag: "dns-out"
            },
            {
                protocol: "freedom",
                settings: {
                    domainStrategy: "UseIP"
                },
                tag: "direct"
            },
            {
                protocol: "blackhole",
                settings: {
                    response: {
                        type: "http"
                    }
                },
                tag: "block"
            },
        ],
        routing: {
            domainStrategy: "IPIfNonMatch",
            rules: buildRoutingRules(isChain, isBalancer, isWorkerLess, isWarp),
            balancers
        },
        observatory,
        policy: {
            levels: {
                0: {
                    connIdle: 300,
                    handshake: 4,
                    uplinkOnly: 1,
                    downlinkOnly: 1
                }
            },
            system: {
                statsOutboundUplink: true,
                statsOutboundDownlink: true
            }
        },
        stats: {}
    };

    return config;
}

async function addBestPingConfigs(
    configs: Config[],
    totalAddresses: string[],
    proxyOutbounds: Outbound[],
    chainOutbounds: Outbound[],
    isFragment: boolean
) {
    const isChain = !!chainOutbounds.length;
    const chainSign = isChain ? '🔗 ' : '';
    const remark = `💦 ${chainSign}Best Ping F 🚀`;
    const outbounds = [
        ...chainOutbounds,
        ...proxyOutbounds
    ];

    if (isFragment) {
        const fragmentOutbound = buildFreedomOutbound(true, false, 'fragment');
        outbounds.push(fragmentOutbound);
    }

    const config = await buildConfig(remark, outbounds, true, isChain, true, false, false, totalAddresses);

    if (isChain) {
        await addBestPingConfigs(configs, totalAddresses, proxyOutbounds, [], isFragment);
    }

    configs.push(config);
}

async function addBestFragmentConfigs(
    configs: Config[],
    outbound: Outbound,
    chainProxy?: Outbound
) {
    const {
        httpConfig: { hostName },
        settings: { fragmentIntervalMin, fragmentIntervalMax }
    } = globalThis;

    const isChain = !!chainProxy;
    const outbounds: Outbound[] = [];
    const bestFragValues = [
        "1-5", "1-10", "10-20", "20-30",
        "30-40", "40-50", "50-60", "60-70",
        "70-80", "80-90", "90-100", "10-30",
        "20-40", "30-50", "40-60", "50-70",
        "60-80", "70-90", "80-100", "100-200"
    ];

    bestFragValues.forEach((fragLength, index) => {
        if (isChain) {
            const chain = modifyOutbound(chainProxy, `chain-${index + 1}`, `proxy-${index + 1}`);
            outbounds.push(chain);
        }

        const proxy = modifyOutbound(outbound, `proxy-${index + 1}`, `fragment-${index + 1}`);
        const fragInterval = toRange(fragmentIntervalMin, fragmentIntervalMax);
        const fragment = buildFreedomOutbound(true, false, `fragment-${index + 1}`, fragLength, fragInterval);
        outbounds.push(proxy, fragment);
    });

    const chainSign = isChain ? '🔗 ' : '';
    const config = await buildConfig(
        `💦 ${chainSign}Best Fragment 😎`,
        outbounds,
        true,
        isChain,
        false,
        false,
        false,
        [],
        hostName
    );

    if (chainProxy) {
        await addBestFragmentConfigs(configs, outbound);
    }

    configs.push(config);
}

async function addWorkerlessConfigs(configs: Config[]) {
    const tlsFragment = buildFreedomOutbound(true, false, 'proxy');
    const udpNoise = buildFreedomOutbound(false, true, 'udp-noise');
    const httpFragment = buildFreedomOutbound(true, false, 'http-fragment', undefined, undefined, '1-1');
    const outbounds = [
        tlsFragment,
        httpFragment,
        udpNoise
    ];

    const cfDnsConfig = await buildConfig(
        `💦 1 - Workerless ⭐`,
        outbounds,
        false,
        false,
        false,
        false,
        true,
        [],
        undefined,
        "cloudflare-dns.com",
        ["cloudflare.com"]
    );

    const googleDnsConfig = await buildConfig(
        `💦 2 - Workerless ⭐`,
        outbounds,
        false,
        false,
        false,
        false,
        true,
        [],
        undefined,
        "dns.google",
        ["8.8.8.8", "8.8.4.4"]
    );

    configs.push(cfDnsConfig, googleDnsConfig);
}

export async function getXrCustomConfigs(isFragment: boolean): Promise<Response> {
    const { outProxy, ports } = globalThis.settings;
    const chainProxy = outProxy ? buildChainOutbound() : undefined;

    const Addresses = await getConfigAddresses(isFragment);
    const totalPorts = ports.filter(port => !isFragment || isHttps(port));
    const protocols = getProtocols();

    const configs: Config[] = [];
    const proxies: Outbound[] = [];
    const chains: Outbound[] = [];
    const fragment = isFragment ? [buildFreedomOutbound(true, false, 'fragment')] : [];
    let index = 1;

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const addr of Addresses) {
                const outbound = buildWebsocketOutbound(protocol, addr, port, isFragment);
                const outbounds = [outbound, ...fragment];

                const proxy = modifyOutbound(outbound, `proxy-${index}`);
                proxies.push(proxy);

                const remark = generateRemark(protocolIndex, port, addr, protocol, isFragment, false);
                const config = await buildConfig(remark, outbounds, false, false, false, false, false, [addr]);
                configs.push(config);

                if (chainProxy) {
                    const remark = generateRemark(protocolIndex, port, addr, protocol, isFragment, true);
                    const chainConfig = await buildConfig(remark, [chainProxy, ...outbounds], false, true, false, false, false, [addr]);
                    configs.push(chainConfig);

                    const chain = modifyOutbound(chainProxy, `chain-${index}`, `proxy-${index}`);
                    chains.push(chain);
                }

                protocolIndex++;
                index++;
            }
        }
    }

    await addBestPingConfigs(configs, Addresses, proxies, chains, isFragment);

    if (isFragment) {
        await addBestFragmentConfigs(configs, proxies[0], chainProxy);
        await addWorkerlessConfigs(configs);
    }

    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getXrWarpConfigs(
    request: Request,
    env: Env,
    isPro: boolean,
    isKnocker: boolean
): Promise<Response> {
    const { warpEndpoints } = globalThis.settings;
    const { warpAccounts } = await getDataset(request, env);

    const proIndicator = isPro ? ' Pro ' : ' ';
    const configs: Config[] = [];
    const proxies: Outbound[] = [];
    const chains: Outbound[] = [];
    const outboundDomains: string[] = [];
    const udpNoise: Outbound[] = isPro && !isKnocker ? [buildFreedomOutbound(false, true, 'udp-noise')] : [];

    for (const [index, endpoint] of warpEndpoints.entries()) {
        const { host } = parseHostPort(endpoint);
        if (isDomain(host)) outboundDomains.push(host);

        const warpOutbound = buildWarpOutbound(warpAccounts[0], endpoint, false, isPro);
        const wowOutbound = buildWarpOutbound(warpAccounts[1], endpoint, true, isPro);

        const warpConfig = await buildConfig(
            `💦 ${index + 1} - Warp${proIndicator}🇮🇷`,
            [warpOutbound, ...udpNoise],
            false,
            false,
            false,
            true,
            false,
            [host]
        );

        const wowConfig = await buildConfig(
            `💦 ${index + 1} - WoW${proIndicator}🌍`,
            [wowOutbound, warpOutbound, ...udpNoise],
            false,
            true,
            false,
            true,
            false,
            [host]
        );

        configs.push(warpConfig, wowConfig);

        const proxy = modifyOutbound(warpOutbound, `proxy-${index + 1}`);
        proxies.push(proxy);

        const chain = modifyOutbound(wowOutbound, `chain-${index + 1}`, `proxy-${index + 1}`);
        chains.push(chain);
    }

    const warpBestPing = await buildConfig(
        `💦 Warp${proIndicator}- Best Ping 🚀`,
        [...proxies, ...udpNoise],
        true,
        false,
        false,
        true,
        false,
        outboundDomains
    );

    const wowBestPing = await buildConfig(
        `💦 WoW${proIndicator}- Best Ping 🚀`,
        [...chains, ...proxies, ...udpNoise],
        true,
        true,
        false,
        true,
        false,
        outboundDomains
    );

    configs.push(warpBestPing, wowBestPing);

    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

function modifyOutbound(outbound: Outbound, tag: string, dialerProxy?: string): Outbound {
    const newOutbound = structuredClone(outbound);
    newOutbound.tag = tag;

    if (dialerProxy && newOutbound.streamSettings) {
        newOutbound.streamSettings.sockopt.dialerProxy = dialerProxy;
    }

    return newOutbound;
}