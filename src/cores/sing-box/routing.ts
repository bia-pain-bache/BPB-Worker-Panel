import { getGeoAssets } from './geo-assets';
import { accRoutingRules } from '@utils';
import { Route, RoutingRule, RuleSet } from 'types/sing-box';

export function buildRoutingRules(isWarp: boolean, isChain: boolean): Route {
    const { blockUDP443, enableIPv6 } = globalThis.settings;

    const rules: RoutingRule[] = [
        {
            ip_cidr: "172.19.0.2",
            action: "hijack-dns"
        },
        {
            clash_mode: "Direct",
            outbound: "direct"
        },
        {
            clash_mode: "Global",
            outbound: "✅ Selector"
        },
        {
            action: "sniff"
        },
        {
            protocol: "dns",
            action: "hijack-dns"
        },
        {
            ip_is_private: true,
            outbound: "direct"
        }
    ];

    if (!isWarp) {
        addRoutingRule(rules, 'reject', undefined, undefined, undefined, undefined, "udp");
    } else if (blockUDP443) {
        addRoutingRule(rules, 'reject', undefined, undefined, undefined, undefined, "udp", "quic", 443);
    }

    const geoAssets = getGeoAssets();
    const routingRules = accRoutingRules(geoAssets);

    const blockDomains = [
        ...routingRules.block.geosites,
        ...routingRules.block.domains
    ];

    if (blockDomains.length) {
        addRoutingRule(rules, 'reject', routingRules.block.domains, undefined, routingRules.block.geosites);
    }

    const blockIPs = [
        ...routingRules.block.geoips,
        ...routingRules.block.ips
    ];

    if (blockIPs.length) {
        addRoutingRule(rules, 'reject', undefined, routingRules.block.ips, undefined, routingRules.block.geoips);
    }

    const bypassDomains = [
        ...routingRules.bypass.geosites,
        ...routingRules.bypass.domains
    ];

    if (bypassDomains.length) {
        addRoutingRule(rules, 'direct', routingRules.bypass.domains, undefined, routingRules.bypass.geosites);
    }

    const bypassIPs = [
        ...routingRules.bypass.geoips,
        ...routingRules.bypass.ips
    ];

    if (bypassIPs.length) {
        addRoutingRule(rules, 'direct', undefined, routingRules.bypass.ips, undefined, routingRules.bypass.geoips);
    }

    const strategy = enableIPv6 ? "prefer_ipv4" : "ipv4_only";
    const ruleSets: RuleSet[] = geoAssets.reduce((sets, asset) => {
        addRuleSets(sets, asset);
        return sets;
    }, []);

    return {
        rules,
        rule_set: ruleSets.omitEmpty(),
        auto_detect_interface: true,
        default_domain_resolver: {
            server: "dns-direct",
            strategy,
            rewrite_ttl: 60
        },
        final: "✅ Selector"
    };
}

function addRoutingRule(
    rules: RoutingRule[],
    type: 'direct' | 'reject' | 'route',
    domain?: string[],
    ip?: string[],
    geosite?: string[],
    geoip?: string[],
    network?: "tcp" | "udp",
    protocol?: "http" | "tls" | "quic" | "dns",
    port?: number
) {
    rules.push({
        rule_set: geosite || geoip,
        domain_suffix: domain?.length ? domain : undefined,
        ip_cidr: ip?.length ? ip : undefined,
        network,
        protocol,
        port,
        action: type === 'reject' ? 'reject' : 'route',
        outbound: type === 'direct' ? 'direct' : undefined
    });
}

function addRuleSets(ruleSets: RuleSet[], geoAsset: GeoAsset) {
    const { geosite, geositeURL, geoip, geoipURL } = geoAsset;

    const addRuleSet = (geo: string, url: string) => ruleSets.push({
        type: "remote",
        tag: geo,
        format: "binary",
        url,
        download_detour: "direct"
    });

    if (geosite && geositeURL) addRuleSet(geosite, geositeURL);
    if (geoip && geoipURL) addRuleSet(geoip, geoipURL);
}