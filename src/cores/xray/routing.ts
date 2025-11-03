import { getGeoAssets } from './geo-assets';
import { RoutingRule } from 'types/xray';
import { accRoutingRules } from '@utils';

export function buildRoutingRules(
    isChain: boolean,
    isBalancer: boolean,
    isWorkerless: boolean,
    isWarp: boolean
): RoutingRule[] {
    const { blockUDP443 } = globalThis.settings;
    const rules: RoutingRule[] = [
        {
            inboundTag: [
                "mixed-in"
            ],
            port: 53,
            outboundTag: "dns-out",
            type: "field"
        },
        {
            inboundTag: [
                "dns-in"
            ],
            outboundTag: "dns-out",
            type: "field"
        }
    ];

    const finallOutboundTag = isChain ? "chain" : isWorkerless ? "direct" : "proxy";
    const outTag = isBalancer ? isChain ? "all-chains" : "all-proxies" : finallOutboundTag;
    const remoteDnsProxy = isBalancer ? "all-proxies" : "proxy";

    addRoutingRule(rules, ["remote-dns"], undefined, undefined, undefined, undefined, undefined, remoteDnsProxy, isBalancer);
    addRoutingRule(rules, ["dns"], undefined, undefined, undefined, undefined, undefined, "direct", false);

    addRoutingRule(rules, undefined, ["geosite:private"], undefined, undefined, undefined, undefined, "direct", false);
    addRoutingRule(rules, undefined, undefined, ["geoip:private"], undefined, undefined, undefined, "direct", false);

    if (!(isWarp || isWorkerless)) {
        addRoutingRule(rules, undefined, undefined, undefined, undefined, "udp", undefined, "block", false);
    } else if (blockUDP443) {
        addRoutingRule(rules, undefined, undefined, undefined, 443, "udp", undefined, "block", false);
    }

    const geoRules: GeoAsset[] = getGeoAssets();
    const routingRules = accRoutingRules(geoRules);

    const blockDomains = [
        ...routingRules.block.geosites,
        ...routingRules.block.domains.map(domain => `domain:${domain}`)
    ];

    if (blockDomains.length) {
        addRoutingRule(rules, undefined, blockDomains, undefined, undefined, undefined, undefined, 'block');
    }

    const blockIPs = [
        ...routingRules.block.geoips as string[],
        ...routingRules.block.ips
    ];

    if (blockIPs.length) {
        addRoutingRule(rules, undefined, undefined, blockIPs, undefined, undefined, undefined, 'block');
    }

    const bypassDomains = [
        ...routingRules.bypass.geosites,
        ...routingRules.bypass.domains.map(domain => `domain:${domain}`)
    ];

    if (bypassDomains.length) {
        addRoutingRule(rules, undefined, bypassDomains, undefined, undefined, undefined, undefined, 'direct');
    }

    const bypassIPs = [
        ...routingRules.bypass.geoips,
        ...routingRules.bypass.ips
    ];

    if (bypassIPs.length) {
        addRoutingRule(rules, undefined, undefined, bypassIPs, undefined, undefined, undefined, 'direct');
    }

    if (isWorkerless) {
        addRoutingRule(rules, undefined, undefined, undefined, undefined, "tcp", ["tls"], "proxy", false);
        addRoutingRule(rules, undefined, undefined, undefined, undefined, "tcp", ["http"], "http-fragment", false);
        addRoutingRule(rules, undefined, undefined, undefined, undefined, "udp", ["quic"], "udp-noise", false);
        addRoutingRule(rules, undefined, undefined, undefined, "443,2053,2083,2087,2096,8443", "udp", undefined, "udp-noise", false);
    }

    const network = isWarp || isWorkerless ? "tcp,udp" : "tcp";
    addRoutingRule(rules, undefined, undefined, undefined, undefined, network, undefined, outTag, isBalancer);

    return rules;
}

const addRoutingRule = (
    rules: RoutingRule[],
    inboundTag?: string[],
    domain?: string[],
    ip?: string[],
    port?: number | string,
    network?: "tcp" | "udp" | "tcp,udp",
    protocol?: ("http" | "tls" | "bittorrent" | "quic")[],
    outboundTag?: string,
    isBalancer?: boolean
) => rules.push({
    inboundTag,
    domain,
    ip,
    port,
    network,
    protocol,
    balancerTag: isBalancer ? outboundTag : undefined,
    outboundTag: isBalancer ? undefined : outboundTag,
    type: "field"
});
