import { getGeoAssets } from './geo-assets';
import { DNS, DnsHosts, FakeDNS } from 'types/clash';
import { isDomain, getDomain, accDnsRules } from '@utils';

export async function buildDNS(isChain: boolean, isWarp: boolean, isPro: boolean): Promise<DNS> {
    const {
        localDNS,
        remoteDNS,
        warpRemoteDNS,
        antiSanctionDNS,
        outProxyParams,
        remoteDnsHost,
        enableIPv6,
        fakeDNS,
        allowLANConnection
    } = globalThis.settings;

    const finalLocalDNS = localDNS === 'localhost' ? 'system' : `${localDNS}#DIRECT`;
    const proSign = isPro ? "Pro " : "";
    const remoteDnsDetour = isWarp
        ? `💦 Warp ${proSign}- Best Ping 🚀`
        : isChain ? "💦 Best Ping 🚀" : "✅ Selector";

    const finalRemoteDNS = `${isWarp ? warpRemoteDNS : remoteDNS}#${remoteDnsDetour}`;
    const hosts: DnsHosts = {};
    const nameserverPolicy: Record<string, string> = {};

    if (isChain && !isWarp) {
        const { server } = outProxyParams;
        if (isDomain(server)) nameserverPolicy[server] = finalRemoteDNS;
    }

    if (remoteDnsHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = remoteDnsHost;
        hosts[host] = ipv4.concatIf(enableIPv6, ipv6);
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

    const bypassDomains = [
        ...dnsRules.bypass.localDNS.geositeGeoips.map(({ geosite }) => `rule-set:${geosite}`),
        ...dnsRules.bypass.localDNS.geosites.map(geosite => `rule-set:${geosite}`),
        ...dnsRules.bypass.localDNS.domains.map(domain => `+.${domain}`)
    ];

    if (sanctionDomains.length) {
        sanctionDomains.forEach(value => nameserverPolicy[value] = `${antiSanctionDNS}#DIRECT`);
        const { host, isHostDomain } = getDomain(antiSanctionDNS);
        if (isHostDomain) bypassDomains.push(host);
    }

    bypassDomains.forEach(value => nameserverPolicy[value] = finalLocalDNS);
    const listen = `${allowLANConnection ? "0.0.0.0" : "127.0.0.1"}:1053`;
    let enhancedMode: "redir-host" | "fake-ip" = "redir-host";
    let fakeDnsSettings: Partial<FakeDNS> = {};
    
    if (fakeDNS) {
        enhancedMode = "fake-ip";
        fakeDnsSettings = {
            "fake-ip-range": "198.18.0.1/16",
            "fake-ip-filter-mode": "blacklist",
            "fake-ip-filter": ["+.lan", "+.local"]
        };
    }

    const dns: DNS = {
        "enable": true,
        "respect-rules": true,
        "use-system-hosts": false,
        "listen": listen,
        "ipv6": enableIPv6,
        "hosts": hosts.omitEmpty(),
        "nameserver": [finalRemoteDNS],
        "proxy-server-nameserver": [finalLocalDNS],
        "direct-nameserver": [finalLocalDNS],
        "direct-nameserver-follow-policy": true,
        "nameserver-policy": nameserverPolicy.omitEmpty(),
        "enhanced-mode": enhancedMode,
        ...fakeDnsSettings
    };

    return dns;
}