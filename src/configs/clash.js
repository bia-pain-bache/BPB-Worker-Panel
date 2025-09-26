import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, isIPv6, isIPv4, isDomain, getDomain, generateWsPath, parseHostPort } from '#configs/utils';
import { getDataset } from '#kv';
import { globalConfig, httpConfig } from '#common/init';
import { settings } from '#common/handlers'

async function buildClashDNS(isChain, isWarp) {
    const finalLocalDNS = settings.localDNS === 'localhost' ? 'system' : `${settings.localDNS}#DIRECT`;
    const isIPv6 = (settings.VLTRenableIPv6 && !isWarp) || (settings.warpEnableIPv6 && isWarp);
    const dnsObject = {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": isIPv6,
        "respect-rules": true,
        "use-system-hosts": false,
        "nameserver": [`${isWarp ? '1.1.1.1' : settings.remoteDNS}#✅ Selector`],
        "proxy-server-nameserver": [finalLocalDNS],
        "nameserver-policy": {
            "raw.githubusercontent.com": finalLocalDNS,
            "time.cloudflare.com": finalLocalDNS
        }
    };

    if (settings.dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = settings.dohHost;
        dnsObject["hosts"] = {
            [host]: settings.VLTRenableIPv6 ? [...ipv4, ...ipv6] : ipv4
        }
    }

    const dnsHost = getDomain(settings.antiSanctionDNS);

    if (dnsHost.isHostDomain) {
        dnsObject["nameserver-policy"][dnsHost.host] = finalLocalDNS;
    }

    if (isChain && !isWarp) {
        const chainOutboundServer = settings.outProxyParams.server;
        
        if (isDomain(chainOutboundServer)) {
            dnsObject["nameserver-policy"][chainOutboundServer] = `${settings.remoteDNS}#proxy-1`;
        }
    }

    const routingRules = getRoutingRules();

    settings.customBlockRules.forEach(value => {
        if (isDomain(value)) {
            if (!dnsObject["hosts"]) dnsObject["hosts"] = {};
            dnsObject["hosts"][`+.${value}`] = "rcode://refused";
        }
    });

    settings.customBypassRules.forEach(value => {
        if (isDomain(value)) {
            dnsObject["nameserver-policy"][`+.${value}`] = `${settings.localDNS}#DIRECT`;
        }
    });

    settings.customBypassSanctionRules.forEach(value => {
        if (isDomain(value)) {
            dnsObject["nameserver-policy"][`+.${value}`] = `${settings.antiSanctionDNS}#DIRECT`;
        }
    });

    for (const { rule, ruleProvider, type, dns } of routingRules) {
        if (!rule || !ruleProvider?.geosite) continue;
        const { geosite } = ruleProvider;

        if (type === 'DIRECT') {
            dnsObject["nameserver-policy"][`rule-set:${geosite}`] = dns;
        } else {
            if (!dnsObject["hosts"]) {
                dnsObject["hosts"] = {};
            }

            dnsObject["hosts"][`rule-set:${geosite}`] = "rcode://refused";
        }
    }

    const isFakeDNS = (settings.VLTRFakeDNS && !isWarp) || (settings.warpFakeDNS && isWarp);

    if (isFakeDNS) Object.assign(dnsObject, {
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": ["*", "+.lan", "+.local"]
    });

    return dnsObject;
}

function buildClashRoutingRules(isWarp) {
    const routingRules = getRoutingRules();

    settings.customBlockRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'REJECT',
            domain: isDomainValue ? value : null,
            ip: isDomainValue ? null : value
        });
    });

    const bypassRules = [
        ...settings.customBypassRules,
        ...settings.customBypassSanctionRules
    ];

    bypassRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'DIRECT',
            domain: isDomainValue ? value : null,
            ip: isDomainValue ? null : value
        });
    });

    const ruleProviders = {};

    function addRuleProvider(ruleProvider) {
        const { geosite, geoip, geositeURL, geoipURL, format } = ruleProvider;
        const fileExtension = format === 'text' ? 'txt' : format;

        const defineProvider = (type, behavior, url) => {
            if (!type) return;
            ruleProviders[type] = {
                type: "http",
                format,
                behavior,
                url,
                path: `./ruleset/${type}.${fileExtension}`,
                interval: 86400
            };
        };

        defineProvider(geosite, 'domain', geositeURL);
        defineProvider(geoip, 'ipcidr', geoipURL);
    }

    const groupedRules = new Map();

    routingRules.forEach(routingRule => {
        if (!routingRule.rule) return;
        const { type, domain, ip, ruleProvider } = routingRule;
        const { geosite, geoip } = ruleProvider || {};

        if (!groupedRules.has(type)) groupedRules.set(type, {
            domain: [],
            ip: [],
            geosite: [],
            geoip: []
        });

        if (domain) groupedRules.get(type).domain.push(domain);
        if (ip) groupedRules.get(type).ip.push(ip);
        if (geosite) groupedRules.get(type).geosite.push(geosite);
        if (geoip) groupedRules.get(type).geoip.push(geoip);
        if (geosite || geoip) addRuleProvider(ruleProvider);
    });

    let rules = [];

    if (settings.bypassLAN) {
        rules.push(`GEOIP,lan,DIRECT,no-resolve`);
    }

    function addRoutingRule(geosites, geoips, domains, ips, type) {
        if (domains) domains.forEach(domain => rules.push(`DOMAIN-SUFFIX,${domain},${type}`));
        if (geosites) geosites.forEach(geosite => rules.push(`RULE-SET,${geosite},${type}`));

        if (ips) ips.forEach(value => {
            const ipType = isIPv4(value) ? 'IP-CIDR' : 'IP-CIDR6';
            const ip = isIPv6(value) ? value.replace(/\[|\]/g, '') : value;
            const cidr = value.includes('/') ? '' : isIPv4(value) ? '/32' : '/128';
            rules.push(`${ipType},${ip}${cidr},${type}`);
        });

        if (geoips) geoips.forEach(geoip => rules.push(`RULE-SET,${geoip},${type}`));
    }

    if (isWarp && settings.blockUDP443) {
        rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
    }

    if (!isWarp) {
        rules.push("NETWORK,udp,REJECT");
    }

    for (const [type, rule] of groupedRules) {
        const { domain, ip, geosite, geoip } = rule;

        if (domain.length) addRoutingRule(null, null, domain, null, type);
        if (geosite.length) addRoutingRule(geosite, null, null, null, type);
        if (ip.length) addRoutingRule(null, null, null, ip, type);
        if (geoip.length) addRoutingRule(null, geoip, null, null, type);
    }

    rules.push("MATCH,✅ Selector");

    return { rules, ruleProviders };
}

function buildClashVLOutbound(remark, address, port, host, sni, allowInsecure) {
    const tls = httpConfig.defaultHttpsPorts.includes(port) ? true : false;
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    const ipVersion = settings.VLTRenableIPv6 ? "dual" : "ipv4";
    const fingerprint = settings.fingerprint === "randomized" ? "random" : settings.fingerprint;

    const outbound = {
        "name": remark,
        "type": atob('dmxlc3M='),
        "server": addr,
        "port": port,
        "uuid": globalConfig.userID,
        "udp": false,
        "packet-encoding": "packetaddr",
        "ip-version": ipVersion,
        "tls": tls,
        "network": "ws",
        "tfo": true,
        "ws-opts": {
            "path": generateWsPath("vl"),
            "headers": { "Host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        }
    };

    if (tls) {
        Object.assign(outbound, {
            "servername": sni,
            "alpn": ["http/1.1"],
            "client-fingerprint": fingerprint,
            "skip-cert-verify": allowInsecure
        });
    }

    return outbound;
}

function buildClashTROutbound(remark, address, port, host, sni, allowInsecure) {
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    const ipVersion = settings.VLTRenableIPv6 ? "dual" : "ipv4";
    const fingerprint = settings.fingerprint === "randomized" ? "random" : settings.fingerprint;

    return {
        "name": remark,
        "type": atob('dHJvamFu'),
        "server": addr,
        "port": port,
        "password": globalConfig.TrPass,
        "udp": false,
        "ip-version": ipVersion,
        "tls": true,
        "network": "ws",
        "tfo": true,
        "ws-opts": {
            "path": generateWsPath("tr"),
            "headers": { "Host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        },
        "sni": sni,
        "alpn": ["http/1.1"],
        "client-fingerprint": fingerprint,
        "skip-cert-verify": allowInsecure
    };
}

function buildClashWarpOutbound(warpConfigs, remark, endpoint, chain, isPro) {
    const { host, port } = parseHostPort(endpoint);
    const ipVersion = settings.warpEnableIPv6 ? "dual" : "ipv4";

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    let outbound = {
        "name": remark,
        "type": "wireguard",
        "ip": "172.16.0.2/32",
        "ipv6": warpIPv6,
        "ip-version": ipVersion,
        "private-key": privateKey,
        "server": chain ? "162.159.192.1" : host,
        "port": chain ? 2408 : port,
        "public-key": publicKey,
        "allowed-ips": ["0.0.0.0/0", "::/0"],
        "reserved": reserved,
        "udp": true,
        "mtu": 1280
    };

    if (chain) {
        outbound["dialer-proxy"] = chain;
    }

    if (isPro) outbound["amnezia-wg-option"] = {
        "jc": String(settings.amneziaNoiseCount),
        "jmin": String(settings.amneziaNoiseSizeMin),
        "jmax": String(settings.amneziaNoiseSizeMax)
    }

    return outbound;
}

function buildClashChainOutbound() {
    const { outProxyParams } = settings;
    const { protocol } = outProxyParams;

    if (["socks", "http"].includes(protocol)) {
        const { protocol, server, port, user, pass } = outProxyParams;
        const proxyType = protocol === 'socks' ? 'socks5' : protocol;

        return {
            "name": "",
            "type": proxyType,
            "server": server,
            "port": +port,
            "dialer-proxy": "",
            "username": user,
            "password": pass
        };
    }

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = outProxyParams;
    const chainOutbound = {
        "name": "💦 Chain Best Ping 💥",
        "type": atob('dmxlc3M='),
        "server": server,
        "port": +port,
        "udp": true,
        "uuid": uuid,
        "flow": flow,
        "network": type,
        "dialer-proxy": "💦 Best Ping 💥"
    };

    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        Object.assign(chainOutbound, {
            "tls": true,
            "servername": sni,
            "alpn": tlsAlpns,
            "client-fingerprint": fp
        });
    }

    if (security === 'reality') Object.assign(chainOutbound, {
        "tls": true,
        "servername": sni,
        "client-fingerprint": fp,
        "reality-opts": {
            "public-key": pbk,
            "short-id": sid
        }
    });

    if (headerType === 'http') {
        const httpPaths = path?.split(',');
        chainOutbound["http-opts"] = {
            "method": "GET",
            "path": httpPaths,
            "headers": {
                "Connection": ["keep-alive"],
                "Content-Type": ["application/octet-stream"]
            }
        };
    }

    if (type === 'ws') {
        const wsPath = path?.split('?ed=')[0];
        const earlyData = +path?.split('?ed=')[1];
        chainOutbound["ws-opts"] = {
            "path": wsPath,
            "headers": {
                "Host": host
            },
            "max-early-data": earlyData,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        };
    }

    if (type === 'grpc') chainOutbound["grpc-opts"] = {
        "grpc-service-name": serviceName
    };

    return chainOutbound;
}

async function buildClashConfig(selectorTags, urlTestTags, secondUrlTestTags, isChain, isWarp, isPro) {
    const config = structuredClone(clashConfigTemp);
    config['dns'] = await buildClashDNS(isChain, isWarp);

    const { rules, ruleProviders } = buildClashRoutingRules(isWarp);
    config['rules'] = rules;
    config['rule-providers'] = ruleProviders;

    const selector = {
        "name": "✅ Selector",
        "type": "select",
        "proxies": selectorTags
    };

    const urlTest = {
        "name": isWarp ? `💦 Warp ${isPro ? 'Pro ' : ''}- Best Ping 🚀` : '💦 Best Ping 💥',
        "type": "url-test",
        "url": "https://www.gstatic.com/generate_204",
        "interval": isWarp ? settings.bestWarpInterval : settings.bestVLTRInterval,
        "tolerance": 50,
        "proxies": urlTestTags
    };

    config['proxy-groups'].push(selector, urlTest);

    if (isWarp) {
        const secondUrlTest = structuredClone(urlTest);
        secondUrlTest["name"] = `💦 WoW ${isPro ? 'Pro ' : ''}- Best Ping 🚀`;
        secondUrlTest["proxies"] = secondUrlTestTags;
        config['proxy-groups'].push(secondUrlTest);
    }

    return config;
}

export async function getClashWarpConfig(request, env, isPro) {
    const { warpConfigs } = await getDataset(request, env);
    const warpTags = [], wowTags = [];
    const outbounds = {
        proxies: [],
        chains: []
    }

    settings.warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1} - Warp ${isPro ? 'Pro ' : ''}🇮🇷`;
        warpTags.push(warpTag);

        const wowTag = `💦 ${index + 1} - WoW ${isPro ? 'Pro ' : ''}🌍`;
        wowTags.push(wowTag);

        const warpOutbound = buildClashWarpOutbound(warpConfigs, warpTag, endpoint, '', isPro);
        outbounds.proxies.push(warpOutbound);

        const WoWOutbound = buildClashWarpOutbound(warpConfigs, wowTag, endpoint, warpTag);
        outbounds.chains.push(WoWOutbound);

    });

    const selectorTags = [
        `💦 Warp ${isPro ? 'Pro ' : ''}- Best Ping 🚀`,
        `💦 WoW ${isPro ? 'Pro ' : ''}- Best Ping 🚀`,
        ...warpTags,
        ...wowTags
    ];

    const config = await buildClashConfig(selectorTags, warpTags, wowTags, true, true, isPro);
    config['proxies'].push(
        ...outbounds.proxies,
        ...outbounds.chains
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getClashNormalConfig(env) {
    let chainProxy;

    if (settings.outProxy) {
        try {
            chainProxy = buildClashChainOutbound();
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxy = undefined;
            
            const proxySettings = await env.kv.get("proxySettings", { type: 'json' });
            await env.kv.put("proxySettings", JSON.stringify({
                ...proxySettings,
                outProxy: '',
                outProxyParams: {}
            }));
        }
    }

    let proxyIndex = 1;
    const protocols = [];
    if (settings.VLConfigs) protocols.push(atob('VkxFU1M='));
    if (settings.TRConfigs) protocols.push(atob('VHJvamFu'));
    const Addresses = await getConfigAddresses(false);
    const tags = [];
    const outbounds = {
        proxies: [],
        chains: []
    };

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        settings.ports.forEach(port => {
            Addresses.forEach(addr => {
                let VLOutbound, TROutbound;
                const isCustomAddr = settings.customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? settings.customCdnSni : randomUpperCase(httpConfig.hostName);
                const host = isCustomAddr ? settings.customCdnHost : httpConfig.hostName;
                const tag = generateRemark(protocolIndex, port, addr, settings.cleanIPs, protocol, configType).replace(' : ', ' - ');

                if (protocol === atob('VkxFU1M=')) {
                    VLOutbound = buildClashVLOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr
                    );

                    outbounds.proxies.push(VLOutbound);
                    tags.push(tag);
                }

                if (protocol === atob('VHJvamFu') && httpConfig.defaultHttpsPorts.includes(port)) {
                    TROutbound = buildClashTROutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr
                    );

                    outbounds.proxies.push(TROutbound);
                    tags.push(tag);
                }


                if (chainProxy) {
                    let chain = structuredClone(chainProxy);
                    chain['name'] = tag;
                    chain['dialer-proxy'] = `proxy-${proxyIndex}`;
                    outbounds.chains.push(chain);
                }

                proxyIndex++;
                protocolIndex++;
            });
        });
    });

    const selectorTags = ['💦 Best Ping 💥', ...tags];
    const config = await buildClashConfig(selectorTags, tags, null, chainProxy, false, false);
    config['proxies'].push(
        ...outbounds.chains,
        ...outbounds.proxies
    );

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

const clashConfigTemp = {
    "mixed-port": 7890,
    "ipv6": true,
    "allow-lan": true,
    "mode": "rule",
    "log-level": "warning",
    "disable-keep-alive": false,
    "keep-alive-idle": 10,
    "keep-alive-interval": 15,
    "unified-delay": false,
    "geo-auto-update": true,
    "geo-update-interval": 168,
    "external-controller": "127.0.0.1:9090",
    "external-ui-url": "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
    "external-ui": "ui",
    "external-controller-cors": {
        "allow-origins": ["*"],
        "allow-private-network": true
    },
    "profile": {
        "store-selected": true,
        "store-fake-ip": true
    },
    "dns": {},
    "tun": {
        "enable": true,
        "stack": "mixed",
        "auto-route": true,
        "strict-route": true,
        "auto-detect-interface": true,
        "dns-hijack": [
            "any:53",
            "tcp://any:53"
        ],
        "mtu": 9000
    },
    "sniffer": {
        "enable": true,
        "force-dns-mapping": true,
        "parse-pure-ip": true,
        "override-destination": true,
        "sniff": {
            "HTTP": {
                "ports": [80, 8080, 8880, 2052, 2082, 2086, 2095]
            },
            "TLS": {
                "ports": [443, 8443, 2053, 2083, 2087, 2096]
            }
        }
    },
    "proxies": [],
    "proxy-groups": [],
    "rule-providers": {},
    "rules": [],
    "ntp": {
        "enable": true,
        "server": "time.cloudflare.com",
        "port": 123,
        "interval": 30
    }
};

function getRoutingRules() {
    const finalLocalDNS = settings.localDNS === 'localhost'
        ? 'system'
        : `${settings.localDNS}#DIRECT`;

    return [
        {
            rule: true,
            type: 'REJECT',
            ruleProvider: {
                format: "text",
                geosite: "malware",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt",
                geoip: "malware-cidr",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware-ip.txt",
            }
        },
        {
            rule: true,
            type: 'REJECT',
            ruleProvider: {
                format: "text",
                geosite: "phishing",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt",
                geoip: "phishing-cidr",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing-ip.txt",
            }
        },
        {
            rule: true,
            type: 'REJECT',
            ruleProvider: {
                format: "text",
                geosite: "cryptominers",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
            }
        },
        {
            rule: settings.blockAds,
            type: 'REJECT',
            ruleProvider: {
                format: "text",
                geosite: "category-ads-all",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.txt"
            }
        },
        {
            rule: settings.blockPorn,
            type: 'REJECT',
            ruleProvider: {
                format: "text",
                geosite: "nsfw",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt",
            }
        },
        {
            rule: settings.bypassIran,
            type: 'DIRECT',
            dns: finalLocalDNS,
            ruleProvider: {
                format: "text",
                geosite: "ir",
                geoip: "ir-cidr",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
            }
        },
        {
            rule: settings.bypassChina,
            type: 'DIRECT',
            dns: finalLocalDNS,
            ruleProvider: {
                format: "yaml",
                geosite: "cn",
                geoip: "cn-cidr",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
                geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
            }
        },
        {
            rule: settings.bypassRussia,
            type: 'DIRECT',
            dns: finalLocalDNS,
            ruleProvider: {
                format: "yaml",
                geosite: "ru",
                geoip: "ru-cidr",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",
                geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
            }
        },
        {
            rule: settings.bypassOpenAi,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "openai",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml"
            }
        },
        {
            rule: settings.bypassMicrosoft,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "microsoft",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml"
            }
        },
        {
            rule: settings.bypassOracle,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "oracle",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/oracle.yaml"
            }
        },
        {
            rule: settings.bypassDocker,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "docker",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/docker.yaml"
            }
        },
        {
            rule: settings.bypassAdobe,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "adobe",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/adobe.yaml"
            }
        },
        {
            rule: settings.bypassEpicGames,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "epicgames",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/epicgames.yaml"
            }
        },
        {
            rule: settings.bypassIntel,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "intel",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/intel.yaml"
            }
        },
        {
            rule: settings.bypassAmd,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "amd",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/amd.yaml"
            }
        },
        {
            rule: settings.bypassNvidia,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "nvidia",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/nvidia.yaml"
            }
        },
        {
            rule: settings.bypassAsus,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "asus",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/asus.yaml"
            }
        },
        {
            rule: settings.bypassHp,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "hp",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/hp.yaml"
            }
        },
        {
            rule: settings.bypassLenovo,
            type: 'DIRECT',
            dns: `${settings.antiSanctionDNS}#DIRECT`,
            ruleProvider: {
                format: "yaml",
                geosite: "lenovo",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/lenovo.yaml"
            }
        },
    ];
}