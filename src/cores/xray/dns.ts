import { getGeoAssets } from './geo-assets';
import type { DNS, DnsServer, DnsHosts } from 'types/xray';
import { resolveDNS, isDomain, getDomain, accDnsRules } from '@utils';

export async function buildDNS(
    outboundAddrs: string[],
    isWorkerLess: boolean,
    isWarp: boolean,
    domainToStaticIPs?: string,
    customDns?: string,
    customDnsHosts?: string[]
): Promise<DNS> {
    const {
        localDNS,
        remoteDNS,
        warpRemoteDNS,
        antiSanctionDNS,
        remoteDnsHost,
        enableIPv6,
        fakeDNS
    } = globalThis.settings;

    const hosts: DnsHosts = {};
    const servers: DnsServer[] = [];
    const fakeDnsDomains = [];

    if (remoteDnsHost.isDomain && !isWorkerLess && !isWarp) {
        const { ipv4, ipv6, host } = remoteDnsHost;
        hosts[host] = ipv4.concatIf(enableIPv6, ipv6);
    }

    if (domainToStaticIPs) {
        const { ipv4, ipv6 } = await resolveDNS(domainToStaticIPs, enableIPv6);
        hosts[domainToStaticIPs] = [...ipv4, ...ipv6];
    }

    let skipFallback = true;
    let finalRemoteDNS = isWarp ? warpRemoteDNS : remoteDNS;

    if (isWorkerLess) {
        finalRemoteDNS = `https://${customDns}/dns-query`;
        if (customDns && customDnsHosts) hosts[customDns] = customDnsHosts;
        skipFallback = false;
    }

    const remoteDnsServer = buildDnsServer(finalRemoteDNS, undefined, undefined, undefined, undefined, "remote-dns");
    servers.push(remoteDnsServer);

    const geoAssets = getGeoAssets();
    const dnsRules = accDnsRules(geoAssets);

    const blockDomains = [
        ...dnsRules.block.geosites,
        ...dnsRules.block.domains.map(domain => `domain:${domain}`)
    ];

    blockDomains.forEach(domain => hosts[domain] = '#3');

    dnsRules.bypass.localDNS.geositeGeoips.forEach(({ geosite, geoip }) => {
        const localDnsServer = buildDnsServer(localDNS, [geosite], [geoip!], skipFallback);
        servers.push(localDnsServer);
        fakeDnsDomains.push(geosite);
    });

    const sanctionDomains = [
        ...dnsRules.bypass.antiSanctionDNS.geosites,
        ...dnsRules.bypass.antiSanctionDNS.domains.map(domain => `domain:${domain}`)
    ];

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geosites,
        ...dnsRules.bypass.localDNS.domains.map(domain => `domain:${domain}`),
        ...outboundAddrs.filter(isDomain).map(domain => `full:${domain}`)
    ];

    if (sanctionDomains.length) {
        const sanctionDnsServer = buildDnsServer(antiSanctionDNS, sanctionDomains, undefined, skipFallback, true);
        servers.push(sanctionDnsServer);
        
        const { host, isHostDomain } = getDomain(antiSanctionDNS);
        if (isHostDomain) bypassDomains.push(`full:${host}`);
    }

    customDnsHosts?.filter(isDomain).forEach(host => bypassDomains.push(`full:${host}`));

    if (bypassDomains.length) {
        const localDnsServer = buildDnsServer(localDNS, bypassDomains, undefined, skipFallback);
        servers.push(localDnsServer);
        fakeDnsDomains.push(...bypassDomains);
    }

    if (fakeDNS) {
        const fakeDNSServer = fakeDnsDomains.length
            ? buildDnsServer("fakedns", fakeDnsDomains, undefined, false, undefined)
            : "fakedns";

        servers.unshift(fakeDNSServer);
    }

    return {
        hosts: hosts.omitEmpty(),
        servers,
        queryStrategy: isWarp && !enableIPv6 ? "UseIPv4" : "UseIP",
        tag: "dns"
    };
}

function buildDnsServer(
    address: string,
    domains?: string[],
    expectIPs?: string[],
    skipFallback?: boolean,
    finalQuery?: boolean,
    tag?: string
): DnsServer {
    return {
        address,
        domains,
        expectIPs,
        skipFallback,
        finalQuery,
        tag
    };
}