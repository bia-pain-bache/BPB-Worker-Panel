import { getGeoAssets } from './geo-assets';
import { DNS, DnsRule, DnsServer } from '#types/sing-box';
import { getDomain, accDnsRules, concatIf, omitEmpty } from '@utils';

export async function buildDNS(isWarp: boolean, isChain: boolean): Promise<DNS> {
    const {
        localDNS,
        remoteDNS,
        warpRemoteDNS,
        antiSanctionDNS,
        remoteDnsHost,
        enableIPv6,
        fakeDNS,
        enableECH,
        echServerName
    } = globalThis.settings;

    const url = new URL(remoteDNS);
    const protocol = url.protocol.replace(':', '');
    const servers: DnsServer[] = [
        {
            type: isWarp ? "udp" : protocol,
            server: isWarp ? warpRemoteDNS : remoteDnsHost.host,
            detour: isWarp
                ? "💦 Warp - Best Ping 🚀"
                : isChain ? "💦 Best Ping 🚀" : "✅ Selector",
            tag: "dns-remote"
        }
    ];

    if (localDNS === 'localhost') {
        addDnsServer(servers, "local", "dns-direct");
    } else {
        addDnsServer(servers, "udp", "dns-direct", localDNS);
    }

    const rules: DnsRule[] = [
        { clash_mode: "Direct", server: "dns-direct" },
        { clash_mode: "Global", server: "dns-remote" }
    ];

    if (enableECH) {
        const { hostName } = globalThis.httpConfig;
        addDnsRule(rules, 'dns-direct', {
            domain: [echServerName || hostName],
            query_type: ["HTTPS"]
        });
    }

    if (remoteDnsHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = remoteDnsHost;
        const predefined = [...ipv4, ...(enableIPv6 ? ipv6 : [])];
        addDnsServer(servers, "hosts", "hosts", undefined, undefined, undefined, host, predefined);
        rules.unshift({ ip_accept_any: true, server: "hosts" });
    }

    const assets = getGeoAssets();
    const dnsRules = accDnsRules(assets);

    const blockDomains = [
        ...dnsRules.block.geosites,
        ...dnsRules.block.domains
    ];

    if (blockDomains.length) {
        addDnsRule(rules, 'reject', {
            geosite: dnsRules.block.geosites,
            domain: dnsRules.block.domains
        });
    }

    dnsRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
        addDnsRule(rules, 'dns-direct', { geosite: [geosite], geoip });
    });

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geosites,
        ...dnsRules.bypass.localDNS.domains
    ];

    if (bypassDomains.length) {
        addDnsRule(rules, 'dns-direct', {
            geosite: dnsRules.bypass.localDNS.geosites,
            domain: dnsRules.bypass.localDNS.domains
        });
    }

    const sanctionDomains = [
        ...dnsRules.bypass.antiSanctionDNS.geosites,
        ...dnsRules.bypass.antiSanctionDNS.domains
    ];

    if (sanctionDomains.length) {
        const dnsHost = getDomain(antiSanctionDNS);
        addDnsRule(rules, 'dns-anti-sanction', {
            geosite: dnsRules.bypass.antiSanctionDNS.geosites,
            domain: dnsRules.bypass.antiSanctionDNS.domains
        });

        if (dnsHost.isHostDomain) {
            addDnsServer(servers, "https", "dns-anti-sanction", dnsHost.host, undefined, "dns-direct");
        } else {
            addDnsServer(servers, "udp", "dns-anti-sanction", antiSanctionDNS);
        }
    }

    if (fakeDNS) {
        addDnsServer(
            servers, "fakeip", "dns-fake",
            undefined, undefined, undefined, undefined, undefined,
            "198.18.0.0/15",
            enableIPv6 ? "fc00::/18" : undefined
        );

        addDnsRule(rules, "dns-fake", {
            inbound: "tun-in",
            query_type: ["A", "AAAA"]
        });
    }

    return {
        servers,
        rules,
        strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
        independent_cache: true
    };
}

function addDnsServer(
    servers: DnsServer[],
    type: string,
    tag: string,
    server?: string,
    detour?: string,
    domain_resolver?: string,
    host?: string,
    predefined?: string[],
    inet4_range?: string,
    inet6_range?: string
) {
    servers.push({
        type,
        server,
        detour,
        domain_resolver: domain_resolver
            ? { server: domain_resolver, strategy: "ipv4_only" }
            : undefined,
        predefined: host ? { [host]: predefined } : undefined,
        inet4_range,
        inet6_range,
        tag
    });
}

interface DnsRuleOptions {
    inbound?: string;
    geosite?: string[];
    geoip?: string;
    domain?: string[];
    query_type?: Array<"A" | "AAAA" | "HTTPS">;
}

function addDnsRule(
    rules: DnsRule[],
    dns: string,
    options: DnsRuleOptions = {}
) {
    const { inbound, geosite, geoip, domain, query_type } = options;
    const isPair = geosite?.length && geoip;

    rules.push({
        inbound,
        type: isPair ? 'logical' : undefined,
        mode: isPair ? 'and' : undefined,
        rules: isPair ? [
            { rule_set: geosite },
            { rule_set: geoip }
        ] : undefined,
        rule_set: geosite?.length && !geoip ? geosite : undefined,
        domain_suffix: omitEmpty(domain ?? []) ? domain : undefined,
        query_type,
        action: dns === 'reject' ? 'reject' : 'route',
        server: dns === 'reject' ? undefined : dns
    });
}