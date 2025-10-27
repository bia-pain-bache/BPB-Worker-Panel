import { getGeoAssets } from './geo-assets';
import type { Dns, DnsServer, DnsHosts } from 'types/xray';
import { resolveDNS, isDomain, getDomain, accDnsRules } from '@utils';

export async function buildDNS(
    outboundAddrs: string[],
    isWorkerLess: boolean,
    isWarp: boolean,
    domainToStaticIPs?: string,
    customDns?: string,
    customDnsHosts?: string[]
): Promise<Dns> {
    const {
        localDNS, remoteDNS, antiSanctionDNS, dohHost,
        warpEnableIPv6, VLTRenableIPv6, fakeDNS
    } = globalThis.settings;

    const hosts: DnsHosts = {};
    const isIPv6 = isWarp ? warpEnableIPv6 : VLTRenableIPv6;

    const dns: Dns = {
        hosts: undefined,
        servers: [],
        queryStrategy: !isWarp || isIPv6 ? "UseIP" : "UseIPv4",
        disableFallbackIfMatch: undefined,
        tag: "dns",
    };

    if (dohHost.isDomain && !isWorkerLess && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        hosts[host] = [
            ...ipv4,
            ...(isIPv6 ? ipv6 : [])
        ];
    }

    if (domainToStaticIPs) {
        const staticIPs = await resolveDNS(domainToStaticIPs, !VLTRenableIPv6);
        hosts[domainToStaticIPs] = [
            ...staticIPs.ipv4,
            ...staticIPs.ipv6
        ];
    }

    let skipFallback: boolean | undefined = true;
    let finalRemoteDNS = isWarp ? "1.1.1.1" : remoteDNS;

    if (isWorkerLess) {
        finalRemoteDNS = `https://${customDns}/dns-query`;
        if (customDns && customDnsHosts) hosts[customDns] = customDnsHosts;
        skipFallback = undefined;
        dns.disableFallbackIfMatch = true;
    }

    const remoteDnsServer = buildDnsServer(finalRemoteDNS, undefined, undefined, undefined, "remote-dns");
    dns.servers.push(remoteDnsServer);

    const geoAssets = getGeoAssets();
    const dnsRules = accDnsRules(geoAssets);

    const blockDomains = [
        ...dnsRules.block.geosites,
        ...dnsRules.block.domains.map(domain => `domain:${domain}`)
    ];

    blockDomains.forEach(domain => hosts[domain] = ['#3']);

    dnsRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
        const localDnsServer = buildDnsServer(localDNS, [geosite], [geoip!], skipFallback);
        dns.servers.push(localDnsServer);
    });

    const sanctionDomains = [
        ...dnsRules.bypass.antiSanctionDNS.geosites,
        ...dnsRules.bypass.antiSanctionDNS.domains.map(domain => `domain:${domain}`)
    ];

    if (sanctionDomains.length) {
        const sanctionDnsServer = buildDnsServer(antiSanctionDNS, sanctionDomains, undefined, skipFallback);
        dns.servers.push(sanctionDnsServer);
    }

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geosites,
        ...dnsRules.bypass.localDNS.domains.map(domain => `domain:${domain}`),
        ...outboundAddrs.filter(isDomain).map(domain => `full:${domain}`)
    ];

    if (sanctionDomains.length) {
        const { host, isHostDomain } = getDomain(antiSanctionDNS);
        if (isHostDomain) bypassDomains.push(`full:${host}`);
    }

    customDnsHosts?.filter(isDomain).forEach(host => bypassDomains.push(host));

    if (bypassDomains.length) {
        const localDnsServer = buildDnsServer(localDNS, bypassDomains, undefined, skipFallback);
        dns.servers.push(localDnsServer);
    }

    if (fakeDNS) {
        const totalDomainRules = [
            ...dnsRules.bypass.localDNS.geositeGeoips.map(value => value.geosite),
            ...bypassDomains,
            ...sanctionDomains
        ];

        const fakeDNSServer = totalDomainRules.length
            ? buildDnsServer("fakedns", totalDomainRules, undefined, false, undefined)
            : "fakedns";

        dns.servers.unshift(fakeDNSServer);
    }

    if (Object.keys(hosts).length) {
        dns.hosts = hosts;
    }

    return dns;
}

function buildDnsServer(
    address: string,
    domains?: string[],
    expectIPs?: string[],
    skipFallback?: boolean,
    tag?: string
): DnsServer {
    return {
        address,
        domains,
        expectIPs,
        skipFallback,
        tag
    };
}