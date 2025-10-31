import { getDataset } from 'kv';
import { buildDNS } from './dns';
import { buildRoutingRules, buildRuleProviders } from './routing';
import { buildChainOutbound, buildWarpOutbound, buildWebsocketOutbound } from './outbounds';
import type { AnyOutbound, WireguardOutbound, Config, UrlTest } from 'types/clash';
import { getConfigAddresses, generateRemark, getProtocols, customReplacer } from '@utils';
import { sniffer, tun } from './inbounds';

async function buildConfig(
    outbounds: AnyOutbound[],
    selectorTags: string[],
    proxyTags: string[],
    chainTags: string[],
    isChain: boolean,
    isWarp: boolean,
    isPro: boolean
): Promise<Config> {
    const {
        bestWarpInterval,
        bestVLTRInterval,
        logLevel,
        allowLANConnection
    } = globalThis.settings;

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
        "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
        "external-ui": "ui",
        "external-controller-cors": {
            "allow-origins": ["*"],
            "allow-private-network": true
        },
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

    const addUrlTest = (name: string, proxies: string[]) => config['proxy-groups'].push({
        "name": name,
        "type": "url-test",
        "proxies": proxies,
        "url": "https://www.gstatic.com/generate_204",
        "interval": isWarp ? bestWarpInterval : bestVLTRInterval,
        "tolerance": 50
    } satisfies UrlTest);

    addUrlTest(isWarp ? `💦 Warp ${isPro ? 'Pro ' : ''}- Best Ping 🚀` : '💦 Best Ping 🚀', proxyTags);
    if (isWarp) addUrlTest(`💦 WoW ${isPro ? 'Pro ' : ''}- Best Ping 🚀`, chainTags);
    if (isChain) addUrlTest('💦 🔗 Best Ping 🚀', chainTags);

    return config;
}

export async function getClNormalConfig(): Promise<Response> {
    const { outProxy, ports } = globalThis.settings;
    const chainProxy = outProxy ? buildChainOutbound() : undefined;
    const isChain = !!chainProxy;

    const proxyTags: string[] = [];
    const chainTags: string[] = [];
    const outbounds: AnyOutbound[] = [];

    const Addresses = await getConfigAddresses(false);
    const protocols = getProtocols();
    const selectorTags = ["💦 Best Ping 🚀"].concatIf(isChain, "💦 🔗 Best Ping 🚀");

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        ports.forEach(port => {
            Addresses.forEach(addr => {
                const tag = generateRemark(protocolIndex, port, addr, protocol, false, false);
                const outbound = buildWebsocketOutbound(protocol, tag, addr, port);

                if (outbound) {
                    proxyTags.push(tag);
                    selectorTags.push(tag);
                    outbounds.push(outbound);

                    if (isChain) {
                        const chainTag = generateRemark(protocolIndex, port, addr, protocol, false, true);
                        let chain = structuredClone(chainProxy);
                        chain['name'] = chainTag;
                        chain['dialer-proxy'] = tag;
                        outbounds.push(chain);

                        chainTags.push(chainTag);
                        selectorTags.push(chainTag);
                    }

                    protocolIndex++;
                }
            });
        });
    });

    const config = await buildConfig(
        outbounds,
        selectorTags,
        proxyTags,
        chainTags,
        isChain,
        false,
        false
    );

    return new Response(JSON.stringify(config, customReplacer, 4), {
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

    return new Response(JSON.stringify(config, customReplacer, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}