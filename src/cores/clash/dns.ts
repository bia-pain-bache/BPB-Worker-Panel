import { getGeoAssets } from './geo-assets';
import { Dns, DnsHosts } from 'types/clash';
import { isDomain, getDomain, accDnsRules } from '@utils';

export async function buildDNS(isChain: boolean, isWarp: boolean, isPro: boolean): Promise<Dns> {
    const {
        localDNS,
        remoteDNS,
        warpRemoteDNS,
        antiSanctionDNS,
        outProxyParams,
        dohHost,
        warpEnableIPv6,
        VLTRenableIPv6,
        fakeDNS
    } = globalThis.settings;

    const finalLocalDNS = localDNS === 'localhost' ? 'system' : `${localDNS}#DIRECT`;
    const isIPv6 = isWarp ? warpEnableIPv6 : VLTRenableIPv6;
    const remoteDnsDetour = isWarp
        ? `💦 Warp ${isPro ? 'Pro ' : ''}- Best Ping 🚀`
        : isChain ? '💦 Best Ping 🚀' : '✅ Selector';

    const finalRemoteDNS = `${isWarp ? warpRemoteDNS : remoteDNS}#${remoteDnsDetour}`;
    const hosts: DnsHosts = {};
    let nameserverPolicy: Record<string, string> = {};



    if (isChain && !isWarp) {
        const { server } = outProxyParams;
        if (isDomain(server)) nameserverPolicy[server] = finalRemoteDNS;
    }

    if (dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        hosts[host] = [
            ...ipv4,
            ...(isIPv6 ? ipv6 : [])
        ];
    }

    const geoAssets = getGeoAssets();
    const dnsRules = accDnsRules(geoAssets);

    const blockDomains = [
        ...dnsRules.block.geosites.map(geosite => `rule-set:${geosite}`),
        ...dnsRules.block.domains.map(domain => `+.${domain}`)
    ];

    blockDomains.forEach(value => hosts[value] = "rcode://refused");

    const sanctionDomains = [
        ...dnsRules.bypass.antiSanctionDNS.geosites.map(geosite => `rule-set:${geosite}`),
        ...dnsRules.bypass.antiSanctionDNS.domains.map(domain => `+.${domain}`)
    ];

    sanctionDomains.forEach(value => nameserverPolicy[value] = `${antiSanctionDNS}#DIRECT`);

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geositeGeoips.map(({ geosite }) => `rule-set:${geosite}`),
        ...dnsRules.bypass.localDNS.geosites.map(geosite => `rule-set:${geosite}`),
        ...dnsRules.bypass.localDNS.domains.map(domain => `+.${domain}`)
    ];

    if (sanctionDomains.length) {
        const { host, isHostDomain } = getDomain(antiSanctionDNS);
        if (isHostDomain) bypassDomains.push(host);
    }

    bypassDomains.forEach(value => nameserverPolicy[value] = finalLocalDNS);
    let fakeDnsSettings = {};

    if (fakeDNS) fakeDnsSettings = {
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": ["*", "+.lan", "+.local"]
    };

    const dns: Dns = {
        "enable": true,
        "respect-rules": true,
        "use-system-hosts": false,
        "listen": "0.0.0.0:1053",
        "ipv6": isIPv6,
        ...fakeDnsSettings,
        "hosts": Object.keys(hosts).length ? hosts : undefined,
        "nameserver": [finalRemoteDNS],
        "proxy-server-nameserver": [finalLocalDNS],
        "nameserver-policy": {
            "raw.githubusercontent.com": finalLocalDNS,
            "time.cloudflare.com": finalLocalDNS,
            ...nameserverPolicy
        }
    };

    return dns;
}