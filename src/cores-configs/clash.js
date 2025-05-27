import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, getRandomPath, isIPv6, isIPv4, isDomain, getDomain } from './helpers';
import { getDataset } from '../kv/handlers';

async function buildClashDNS(isChain, isWarp) {
    const finalLocalDNS = localDNS === 'localhost' ? 'system' : `${localDNS}#DIRECT`;
    const isIPv6 = (VLTRenableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
    const dns = {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": isIPv6,
        "respect-rules": true,
        "use-system-hosts": false,
        "nameserver": [`${isWarp ? '1.1.1.1' : remoteDNS}#✅ Selector`],
        "proxy-server-nameserver": [finalLocalDNS],
        "nameserver-policy": {
            "raw.githubusercontent.com": finalLocalDNS,
            "time.apple.com": finalLocalDNS
        }
    };

    if (dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        dns["hosts"] = {
            [host]: VLTRenableIPv6 ? [...ipv4, ...ipv6] : ipv4
        }
    }

    if (isChain && !isWarp) {
        const chainOutboundServer = outProxyParams.server;
        if (isDomain(chainOutboundServer)) dns["nameserver-policy"][chainOutboundServer] = `${remoteDNS}#proxy-1`;
    }

    const isBypass = bypassIran || bypassChina || bypassRussia;
    const bypassRules = [
        { rule: bypassIran, geosite: "ir" },
        { rule: bypassChina, geosite: "cn" },
        { rule: bypassRussia, geosite: "ru" }
    ];

    if (isBypass) {
        const geosites = [];
        bypassRules.forEach(({ rule, geosite }) => {
            rule && geosites.push(geosite)
        });

        dns["nameserver-policy"][`rule-set:${geosites.join(',')}`] = [finalLocalDNS];
    }

    const totalCustomBypassDomains = customBypassRules.filter(address => isDomain(address));
    totalCustomBypassDomains.push(...customBypassSanctionRules);
    totalCustomBypassDomains.forEach(domain => {
        dns["nameserver-policy"][`+.${domain}`] = finalLocalDNS;
    });

    const isAntiSanctionRule = bypassOpenAi || bypassGoogle || customBypassSanctionRules.length > 0;
    const bypassSanctionRules = [
        { rule: bypassOpenAi, rule_set: "openai" },
        { rule: bypassGoogle, rule_set: "google" },
        { rule: bypassMicrosoft, rule_set: "microsoft" },
    ];

    if (isAntiSanctionRule) {
        const dnsHost = getDomain(antiSanctionDNS);
        if (dnsHost.isHostDomain) dns["nameserver-policy"][dnsHost.host] = `${localDNS}#DIRECT`;
        if (bypassOpenAi || bypassGoogle) {
            bypassSanctionRules.forEach(rule => {
                if(rule.rule) dns["nameserver-policy"][`rule-set:${rule.rule_set}`] = `${antiSanctionDNS}#DIRECT`
            });
        }
        
        customBypassSanctionRules.forEach(domain => {
            dns["nameserver-policy"][`+.${domain}`] = `${antiSanctionDNS}#DIRECT`;
        });
    }

    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    if (isFakeDNS) Object.assign(dns, {
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": ["geosite:private"]
    });

    return dns;
}

function buildClashRoutingRules(isWarp) {
    const geoRules = [
        {
            rule: bypassLAN,
            type: 'direct',
            noResolve: true,
            ruleProvider: {
                format: "yaml",
                geosite: "private",
                geoip: "private-cidr",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.yaml",
                geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.yaml"
            }
        },
        {
            rule: bypassIran,
            type: 'direct',
            ruleProvider: {
                format: "text",
                geosite: "ir",
                geoip: "ir-cidr",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ir.txt",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/ircidr.txt"
            }
        },
        {
            rule: bypassChina,
            type: 'direct',
            ruleProvider: {
                format: "yaml",
                geosite: "cn",
                geoip: "cn-cidr",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.yaml",
                geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.yaml"
            }
        },
        {
            rule: bypassRussia,
            type: 'direct',
            ruleProvider: {
                format: "yaml",
                geosite: "ru",
                geoip: "ru-cidr",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ru.yaml",
                geoipURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/ru.yaml"
            }
        },
        {
            rule: bypassOpenAi,
            type: 'direct',
            ruleProvider: {
                format: "yaml",
                geosite: "openai",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml"
            }
        },
        {
            rule: bypassGoogle,
            type: 'direct',
            ruleProvider: {
                format: "yaml",
                geosite: "google",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.yaml"
            }
        },
        {
            rule: bypassMicrosoft,
            type: 'direct',
            ruleProvider: {
                format: "yaml",
                geosite: "microsoft",
                geositeURL: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleProvider: {
                format: "text",
                geosite: "malware",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.txt"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleProvider: {
                format: "text",
                geosite: "phishing",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.txt"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleProvider: {
                format: "text",
                geosite: "cryptominers",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.txt"
            }
        },
        {
            rule: blockAds,
            type: 'block',
            ruleProvider: {
                format: "text",
                geosite: "category-ads-all",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.txt"
            }
        },
        {
            rule: blockPorn,
            type: 'block',
            ruleProvider: {
                format: "text",
                geosite: "nsfw",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/nsfw.txt",
            }
        },
    ];

    function buildRuleProvider(tag, format, behavior, url) {
        const fileExtension = format === 'text' ? 'txt' : format;
        return {
            [tag]: {
                type: "http",
                format,
                behavior,
                url,
                path: `./ruleset/${tag}.${fileExtension}`,
                interval: 86400
            }
        }
    }

    const directDomainRules = [], directIPRules = [], blockDomainRules = [], blockIPRules = [], ruleProviders = {};
    geoRules.forEach(({ rule, type, ruleProvider, noResolve }) => {
        const { geosite, geoip, geositeURL, geoipURL, format } = ruleProvider;
        if (rule) {
            if (geosite) {
                const targetRules = type === 'direct' ? directDomainRules : blockDomainRules;
                targetRules.push(`RULE-SET,${geosite},${type === 'direct' ? 'DIRECT' : 'REJECT'}`);
                const ruleProvider = buildRuleProvider(geosite, format, 'domain', geositeURL);
                Object.assign(ruleProviders, ruleProvider);
            }

            if (geoip) {
                const targetRules = type === 'direct' ? directIPRules : blockIPRules;
                targetRules.push(`RULE-SET,${geoip},${type === 'direct' ? 'DIRECT' : 'REJECT'}${noResolve ? ',no-resolve' : ''}`);
                const ruleProvider = buildRuleProvider(geoip, format, 'ipcidr', geoipURL);
                Object.assign(ruleProviders, ruleProvider);
            }
        }
    });

    const generateRule = (address, action) => {
        if (isDomain(address)) {
            return `DOMAIN-SUFFIX,${address},${action}`;
        } else {
            const type = isIPv4(address) ? 'IP-CIDR' : 'IP-CIDR6';
            const ip = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
            const cidr = address.includes('/') ? '' : isIPv4(address) ? '/32' : '/128';
            return `${type},${ip}${cidr},${action},no-resolve`;
        }
    };

    const totalCustomBypassDomains = [...customBypassRules, ...customBypassSanctionRules];
    totalCustomBypassDomains.forEach( address => {
        const targetRules = isDomain(address) ? directDomainRules : directIPRules
        targetRules.push(generateRule(address, 'DIRECT'));
    });
    
    [...customBlockRules].forEach( address => {
        const targetRules = isDomain(address) ? blockDomainRules : blockIPRules;
        targetRules.push(generateRule(address, 'REJECT'));
    });

    let rules = [];
    isWarp && blockUDP443 && rules.push("AND,((NETWORK,udp),(DST-PORT,443)),REJECT");
    !isWarp && rules.push("NETWORK,udp,REJECT");
    rules = [...rules, ...blockDomainRules, ...blockIPRules, ...directDomainRules, ...directIPRules];
    rules.push("MATCH,✅ Selector");
    return { rules, ruleProviders };
}

function buildClashVLOutbound(remark, address, port, host, sni, proxyIPs, allowInsecure) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    const path = `/${getRandomPath(16)}${proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : ''}`;
    const ipVersion = VLTRenableIPv6 ? "dual" : "ipv4";

    const outbound = {
        "name": remark,
        "type": "vless",
        "server": addr,
        "port": +port,
        "uuid": userID,
        "packet-encoding": "packetaddr",
        "ip-version": ipVersion,
        "tls": tls,
        "network": "ws",
        "tfo": true,
        "mptcp": true,
        "ws-opts": {
            "path": path,
            "headers": { "Host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        }
    };

    if (tls) {
        Object.assign(outbound, {
            "servername": sni,
            "alpn": ["http/1.1"],
            "client-fingerprint": "random",
            "skip-cert-verify": allowInsecure
        });
    }

    return outbound;
}

function buildClashTROutbound(remark, address, port, host, sni, proxyIPs, allowInsecure) {
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    const path = `/tr${getRandomPath(16)}${proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : ''}`;
    const ipVersion = VLTRenableIPv6 ? "dual" : "ipv4";

    return {
        "name": remark,
        "type": "trojan",
        "server": addr,
        "port": +port,
        "password": TRPassword,
        "ip-version": ipVersion,
        "tls": true,
        "network": "ws",
        "tfo": true,
        "mptcp": true,
        "ws-opts": {
            "path": path,
            "headers": { "Host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        },
        "sni": sni,
        "alpn": ["http/1.1"],
        "client-fingerprint": "random",
        "skip-cert-verify": allowInsecure
    };
}

function buildClashWarpOutbound(warpConfigs, remark, endpoint, chain, isPro) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const ipVersion = warpEnableIPv6 ? "dual" : "ipv4";

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
        "server": chain ? "162.159.192.1" : endpointServer,
        "port": chain ? 2408 : endpointPort,
        "public-key": publicKey,
        "allowed-ips": ["0.0.0.0/0", "::/0"],
        "reserved": reserved,
        "udp": true,
        "mtu": 1280
    };

    if (chain) outbound["dialer-proxy"] = chain;
    if (isPro) outbound["amnezia-wg-option"] = {
        "jc": amneziaNoiseCount,
        "jmin": amneziaNoiseSizeMin,
        "jmax": amneziaNoiseSizeMax
    }
    return outbound;
}

function buildClashChainOutbound(chainProxyParams) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, server, port, user, pass } = chainProxyParams;
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

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    const chainOutbound = {
        "name": "💦 Chain Best Ping 💥",
        "type": "vless",
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
        "interval": isWarp ? +bestWarpInterval : +bestVLTRInterval,
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

    warpEndpoints.forEach((endpoint, index) => {
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
    config['proxies'].push(...outbounds.proxies, ...outbounds.chains);

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
    if (outProxy) {
        try {
            chainProxy = buildClashChainOutbound(outProxyParams);
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
    VLConfigs && protocols.push('VLESS');
    TRConfigs && protocols.push('Trojan');
    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6, customCdnAddrs);
    const tags = [];
    const outbounds = {
        proxies: [],
        chains: []
    };

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        ports.forEach(port => {
            Addresses.forEach(addr => {
                let VLOutbound, TROutbound;
                const isCustomAddr = customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const tag = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType).replace(' : ', ' - ');

                if (protocol === 'VLESS') {
                    VLOutbound = buildClashVLOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        proxyIPs,
                        isCustomAddr
                    );

                    outbounds.proxies.push(VLOutbound);
                    tags.push(tag);
                }

                if (protocol === 'Trojan' && defaultHttpsPorts.includes(port)) {
                    TROutbound = buildClashTROutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        proxyIPs,
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
    config['proxies'].push(...outbounds.chains, ...outbounds.proxies);

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
        "override-destination": false,
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
        "server": "time.apple.com",
        "port": 123,
        "interval": 30
    }
};