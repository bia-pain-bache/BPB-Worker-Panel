import { RuleProvider } from 'types/clash';
import { getGeoAssets } from './geo-assets';
import { isIPv6, isIPv4, accRoutingRules } from '@utils';

export function buildRoutingRules(isWarp: boolean) {
    const { blockUDP443 } = globalThis.settings;
    const geoAssets = getGeoAssets();
    const routingRules = accRoutingRules(geoAssets);
    const rules = [`GEOIP,lan,DIRECT,no-resolve`];

    if (!isWarp) {
        rules.push("NETWORK,udp,REJECT");
    } else if (blockUDP443) {
        rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
    }

    return [
        ...rules,
        ...routingRules.block.geosites.map(geosite => `RULE-SET,${geosite},REJECT`),
        ...routingRules.block.domains.map(domain => `DOMAIN-SUFFIX,${domain},REJECT`),
        ...routingRules.block.geoips.map(geoip => `RULE-SET,${geoip},REJECT`),
        ...routingRules.block.ips.map(ip => buildIpCidrRule(ip, 'REJECT')),
        ...routingRules.bypass.geosites.map(geosite => `RULE-SET,${geosite},DIRECT`),
        ...routingRules.bypass.domains.map(domain => `DOMAIN-SUFFIX,${domain},DIRECT`),
        ...routingRules.bypass.geoips.map(geoip => `RULE-SET,${geoip},DIRECT`),
        ...routingRules.bypass.ips.map(ip => buildIpCidrRule(ip, 'DIRECT')),
        "MATCH,✅ Selector"
    ];
}

export function buildRuleProviders(): Record<string, RuleProvider> | undefined {
    const geoAssets = getGeoAssets();
    return geoAssets.reduce((providers, asset) => {
        addRuleProvider(providers, asset);
        return providers;
    }, {}).omitEmpty();
}

function addRuleProvider(
    ruleProviders: Record<string, RuleProvider>,
    ruleProvider: GeoAsset
) {
    const { geosite, geoip, geositeURL, geoipURL, format } = ruleProvider;
    const fileExtension = format === 'text' ? 'txt' : format;

    const defineProvider = (geo: string, behavior: 'domain' | 'ipcidr', url: string) => {
        ruleProviders[geo] = {
            type: "http",
            format: format!,
            behavior,
            path: `./ruleset/${geo}.${fileExtension}`,
            interval: 86400,
            url
        };
    };

    if (geosite && geositeURL) defineProvider(geosite, 'domain', geositeURL);
    if (geoip && geoipURL) defineProvider(geoip, 'ipcidr', geoipURL);
}

function buildIpCidrRule(ip: string, proxy: string) {
    ip = isIPv6(ip) ? ip.replace(/\[|\]/g, '') : ip;
    const cidr = ip.includes('/') ? '' : isIPv4(ip) ? '/32' : '/128';
    return `IP-CIDR,${ip}${cidr},${proxy}`;
}