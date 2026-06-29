import { getDataset } from '@kv';
import { buildDNS } from './dns';
import { buildRoutingRules, buildRuleProviders } from './routing';
import { buildChainOutbound, buildUrlTest, buildWarpOutbound, buildWebsocketOutbound } from './outbounds';
import type { WireguardOutbound, Config, Outbound } from '#types/clash';
import { getConfigAddresses, generateRemark, getProtocols, concatIf } from '@utils';
import { sniffer, tun } from './inbounds';

async function buildConfig(
    outbounds: Outbound[],
    selectorTags: string[],
    proxyTags: string[],
    chainTags: string[],
    isChain: boolean,
    isWarp: boolean,
    isPro: boolean
): Promise<Config> {
    const { logLevel, allowLANConnection } = globalThis.settings;
    const tcpSettings = isWarp ? {} : {
        "disable-keep-alive": false,
        "keep-alive-idle": 10,
        "keep-alive-interval": 15,
        "tcp-concurrent": true
    };

    const config: Config = {
        "mixed-port": 7890,
        "ipv6": true,
        "allow-lan": allowLANConnection,
        "unified-delay": false,
        "log-level": logLevel.replace("none", "silent"),
        "mode": "rule",
        ...tcpSettings,
        "geo-auto-update": true,
        "geo-update-interval": 168,
        "external-controller": "127.0.0.1:9090",
        "external-controller-cors": {
            "allow-origins": ["*"],
            "allow-private-network": true
        },
        "external-ui": "ui",
        "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
        "profile": {
            "store-selected": true,
            "store-fake-ip": true
        },
        "dns": await buildDNS(isChain, isWarp, isPro),
        "tun": tun,
        "sniffer": sniffer,
        "proxies": outbounds,
        "proxy-groups": [
            {
                "name": "✅ Selector",
                "type": "select",
                "proxies": selectorTags
            }
        ],
        "rule-providers": buildRuleProviders(),
        "rules": buildRoutingRules(isWarp),
        "ntp": {
            "enable": true,
            "server": "time.cloudflare.com",
            "port": 123,
            "interval": 30
        }
    };

    const name = isWarp ? `💦 Warp ${isPro ? "Pro " : ""}- Best Ping 🚀` : "💦 Best Ping 🚀";
    config["proxy-groups"].push(buildUrlTest(name, proxyTags, isWarp));
    if (isWarp) config["proxy-groups"].push(buildUrlTest(`💦 WoW ${isPro ? "Pro " : ""}- Best Ping 🚀`, chainTags, isWarp));
    if (isChain) config["proxy-groups"].push(buildUrlTest("💦 🔗 Best Ping 🚀", chainTags, isWarp));

    return config;
}

export async function getClNormalConfig(): Promise<Response> {
    const { outProxy, ports, upstreamParams: { upstreamServer, upstreamPort } } = globalThis.settings;
    const chainProxy = outProxy ? buildChainOutbound() : undefined;
    const isChain = !!chainProxy;
    const hosts = await getConfigAddresses(false);
    const protocols = getProtocols();

    const effectivePorts = upstreamServer && upstreamPort
        ? [upstreamPort, ...ports]
        : [...ports];

    const effectiveHosts = upstreamServer && upstreamPort
        ? [upstreamServer, ...hosts]
        : hosts;

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: Outbound[] = [];
    const selectorTags = concatIf(["💦 Best Ping 🚀"], isChain, "💦 🔗 Best Ping 🚀");

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of effectivePorts) {
            for (const host of effectiveHosts) {
                const isUpstreamPair = port === upstreamPort && host === upstreamServer;
                const isNormalPair = port !== upstreamPort && host !== upstreamServer;
                if (!isUpstreamPair && !isNormalPair) continue;

                const tag = generateRemark(protocolIndex, port, host, protocol, false, false);
                const outbound = buildWebsocketOutbound(protocol, tag, host, port);

                if (outbound) {
                    proxyTags.push(tag);
                    selectorTags.push(tag);
                    outbounds.push(outbound);

                    if (isChain) {
                        const chainTag = generateRemark(protocolIndex, port, host, protocol, false, true);
                        const chain = structuredClone(chainProxy);
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

    const config = await buildConfig(
        outbounds, selectorTags, proxyTags, chainTags, isChain, false, false
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

export async function getClWarpConfig(request: Request, env: Env, isPro: boolean): Promise<Response> {
    const { warpEndpoints } = globalThis.settings;
    const { warpAccounts } = await getDataset(request, env);

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: WireguardOutbound[] = [];
    const proSign = isPro ? "Pro " : "";
    const selectorTags = [
        `💦 Warp ${proSign}- Best Ping 🚀`,
        `💦 WoW ${proSign}- Best Ping 🚀`
    ];

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1} - Warp ${proSign}🇮🇷`;
        const wowTag = `💦 ${index + 1} - WoW ${proSign}🌍`;

        proxyTags.push(warpTag);
        chainTags.push(wowTag);
        selectorTags.push(warpTag, wowTag);

        outbounds.push(
            buildWarpOutbound(warpAccounts[0], warpTag, endpoint, '', isPro),
            buildWarpOutbound(warpAccounts[1], wowTag, endpoint, warpTag, false)
        );
    });

    const config = await buildConfig(
        outbounds, selectorTags, proxyTags, chainTags, false, true, isPro
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