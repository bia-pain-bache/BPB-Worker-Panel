import { getGeoAssets } from './geo-assets';
import { accRoutingRules, omitEmpty } from '@utils';
import { Route, RoutingRule, RuleSet } from '#types/sing-box';

const DNS_HIJACK_IP = "172.19.0.2";

export function buildRoutingRules(isWarp: boolean): Route {
    const { blockUDP443 } = globalThis.settings;

    const rules: RoutingRule[] = [
        { ip_cidr: DNS_HIJACK_IP, action: "hijack-dns" },
        { clash_mode: "Direct", outbound: "direct" },
        { clash_mode: "Global", outbound: "✅ Selector" },
        { action: "sniff" },
        { protocol: "dns", action: "hijack-dns" },
        { ip_is_private: true, outbound: "direct" }
    ];

    if (!isWarp) {
        addRoutingRule(rules, 'reject', { network: "udp" });
    } else if (blockUDP443) {
        addRoutingRule(rules, 'reject', { network: "udp", protocol: "quic", port: 443 });
    }

    const geoAssets = getGeoAssets();
    const routingRules = accRoutingRules(geoAssets);

    const blockDomains = [
        ...routingRules.block.geosites,
        ...routingRules.block.domains
    ];

    if (blockDomains.length) {
        addRoutingRule(rules, 'reject', {
            domain: routingRules.block.domains,
            geosite: routingRules.block.geosites
        });
    }

    const blockIPs = [
        ...routingRules.block.geoips,
        ...routingRules.block.ips
    ];

    if (blockIPs.length) {
        addRoutingRule(rules, 'reject', {
            ip: routingRules.block.ips,
            geoip: routingRules.block.geoips
        });
    }

    const bypassDomains = [
        ...routingRules.bypass.geosites,
        ...routingRules.bypass.domains
    ];

    if (bypassDomains.length) {
        addRoutingRule(rules, 'direct', {
            domain: routingRules.bypass.domains,
            geosite: routingRules.bypass.geosites
        });
    }

    const bypassIPs = [
        ...routingRules.bypass.geoips,
        ...routingRules.bypass.ips
    ];

    if (bypassIPs.length) {
        addRoutingRule(rules, 'direct', {
            ip: routingRules.bypass.ips,
            geoip: routingRules.bypass.geoips
        });
    }

    const ruleSets: RuleSet[] = geoAssets.reduce<RuleSet[]>((sets, asset) => {
        addRuleSets(sets, asset);
        return sets;
    }, []);

    return {
        rules,
        rule_set: omitEmpty(ruleSets),
        auto_detect_interface: true,
        final: "✅ Selector"
    };
}

interface RoutingRuleOptions {
    domain?: string[];
    ip?: string[];
    geosite?: string[];
    geoip?: string[];
    network?: "tcp" | "udp";
    protocol?: "http" | "tls" | "quic" | "dns";
    port?: number;
}

function addRoutingRule(
    rules: RoutingRule[],
    type: 'direct' | 'reject',
    options: RoutingRuleOptions = {}
) {
    const { domain, ip, geosite, geoip, network, protocol, port } = options;
    const combinedGeosets = [
        ...(geosite ?? []),
        ...(geoip ?? [])
    ];

    rules.push({
        rule_set: combinedGeosets.length ? combinedGeosets : undefined,
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