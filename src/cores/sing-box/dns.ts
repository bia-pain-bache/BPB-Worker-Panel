import { getGeoAssets } from './geo-assets';
import { Dns, DnsRule, DnsServer } from 'types/sing-box';
import { isDomain, getDomain, accDnsRules } from '@utils';

export async function buildDNS(isWarp: boolean, isChain: boolean): Promise<Dns> {
    const {
        localDNS,
        remoteDNS,
        antiSanctionDNS,
        outProxyParams,
        dohHost,
        warpEnableIPv6,
        VLTRenableIPv6,
        fakeDNS
    } = globalThis.settings;

    const url = new URL(remoteDNS);
    const protocol = url.protocol.replace(':', '');
    const isIPv6 = isWarp ? warpEnableIPv6 : VLTRenableIPv6;

    const servers: DnsServer[] = [
        {
            type: isWarp ? "udp" : protocol,
            server: isWarp ? "1.1.1.1" : dohHost.host,
            detour: isWarp ? "💦 Warp - Best Ping 🚀" : isChain ? "💦 Best Ping 🚀" : "✅ Selector",
            tag: "dns-remote"
        }
    ];

    if (localDNS === 'localhost') {
        addDnsServer(servers, "local", "dns-direct", undefined, undefined, undefined);
    } else {
        addDnsServer(servers, "udp", "dns-direct", localDNS, undefined, undefined);
    }

    const rules: DnsRule[] = [
        {
            clash_mode: "Direct",
            server: "dns-direct"
        },
        {
            clash_mode: "Global",
            server: "dns-remote"
        }
    ];

    if (isChain && !isWarp) {
        const { server } = outProxyParams;

        if (isDomain(server)) rules.push({
            domain: server,
            server: "dns-remote"
        });
    }

    if (dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        const predefined = [
            ...ipv4,
            ...(isIPv6 ? ipv6 : [])
        ];

        addDnsServer(servers, "hosts", "hosts", undefined, undefined, undefined, host, predefined);
        rules.unshift({
            ip_accept_any: true,
            server: "hosts"
        });
    }

    const assets = getGeoAssets();
    const dnsRules = accDnsRules(assets);

    const blockDomains = [
        ...dnsRules.block.geosites,
        ...dnsRules.block.domains
    ];

    if (blockDomains.length) {
        addDnsRule(rules, 'reject', dnsRules.block.geosites, undefined, dnsRules.block.domains);
    }

    dnsRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
        addDnsRule(rules, 'dns-direct', geosite, geoip, undefined);
    });

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geosites,
        ...dnsRules.bypass.localDNS.domains
    ];

    if (bypassDomains.length) {
        addDnsRule(rules, 'dns-direct', dnsRules.bypass.localDNS.geosites, undefined, dnsRules.bypass.localDNS.domains);
    }

    const sanctionDomains = [
        ...dnsRules.bypass.antiSanctionDNS.geosites,
        ...dnsRules.bypass.antiSanctionDNS.domains
    ];

    if (sanctionDomains.length) {
        const dnsHost = getDomain(antiSanctionDNS);
        addDnsRule(rules, 'dns-anti-sanction', dnsRules.bypass.antiSanctionDNS.geosites, undefined, dnsRules.bypass.antiSanctionDNS.domains);

        if (dnsHost.isHostDomain) {
            addDnsServer(servers, "https", "dns-anti-sanction", dnsHost.host, undefined, "dns-direct");
        } else {
            addDnsServer(servers, "udp", "dns-anti-sanction", antiSanctionDNS, undefined, undefined);
        }
    }

    if (fakeDNS) {
        const fakeip: DnsServer = {
            type: "fakeip",
            tag: "dns-fake",
            inet4_range: "198.18.0.0/15"
        };

        if (isIPv6) {
            fakeip.inet6_range = "fc00::/18";
        }

        servers.push(fakeip);
        rules.push({
            disable_cache: true,
            inbound: "tun-in",
            query_type: [
                "A",
                "AAAA"
            ],
            server: "dns-fake"
        });
    }

    return {
        servers,
        rules,
        strategy: "ipv4_only",
        independent_cache: true
    }
}

function addDnsServer(
    servers: DnsServer[],
    type: string,
    tag: string,
    server?: string,
    detour?: string,
    domain_resolver?: string,
    host?: string,
    predefined?: string[]
) {
    servers.push({
        type,
        server,
        detour,
        domain_resolver: domain_resolver ? {
            server: domain_resolver,
            strategy: "ipv4_only"
        } : undefined,
        predefined: host ? { [host]: predefined } : undefined,
        tag
    });
}

function addDnsRule(
    rules: DnsRule[],
    dns: string,
    geosite?: string[] | string,
    geoip?: string[] | string,
    domain?: string[]
) {
    let type: 'logical' | undefined;
    let mode: 'and' | undefined;
    const ruleSets = [];

    if (geosite && geoip) {
        mode = 'and';
        type = 'logical';
        ruleSets.push({ rule_set: geosite }, { rule_set: geoip });
    }

    rules.push({
        type,
        mode,
        rules: ruleSets.length ? ruleSets : undefined,
        rule_set: geosite && !geoip ? geosite : undefined,
        domain_suffix: domain?.length ? domain : undefined,
        action: dns === 'reject' ? 'reject' : 'route',
        server: dns === 'reject' ? undefined : dns
    });
}