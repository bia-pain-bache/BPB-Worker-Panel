import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, getRandomPath, isIPv6, isDomain, base64ToDecimal, getDomain } from './helpers';
import { getDataset } from '../kv/handlers';

async function buildSingBoxDNS(isWarp) {
    const isIPv6 = (VLTRenableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
    const buildDnsServer = (type, server, server_port, detour, tag, domain_resolver) => ({
        type,
        ...(server && { server }),
        ...(server_port && { server_port }),
        ...(detour && { detour }),
        ...(domain_resolver && {
            domain_resolver: {
                server: domain_resolver,
                strategy: isIPv6 ? "prefer_ipv4" : "ipv4_only"
            }
        }),
        tag
    });

    const servers = [
        {
            type: isWarp ? "udp" : "https",
            server: isWarp ? "1.1.1.1" : dohHost.host,
            server_port: isWarp ? 53 : 443,
            detour: "✅ Selector",
            tag: "dns-remote"
        },
    ];

    let localDnsServer;
    if (localDNS === 'localhost') {
        localDnsServer = buildDnsServer("local", null, null, null, "dns-direct");
    } else {
        localDnsServer = buildDnsServer("udp", localDNS, 53, null, "dns-direct");
    }

    servers.push(localDnsServer);

    const localDnsRuleDomains = [
        "raw.githubusercontent.com",
        "time.apple.com"
    ];

    const isAntiSanctionRule = bypassOpenAi || bypassGoogle || customBypassSanctionRules.length > 0;
    if (isAntiSanctionRule) {
        const dnsHost = getDomain(antiSanctionDNS);
        let server = {};
        if (dnsHost.isHostDomain) {
            localDnsRuleDomains.push(dnsHost.host);
            server = buildDnsServer("https", dnsHost.host, 443, null, "dns-anti-sanction", "dns-direct");
        } else {
            server = buildDnsServer("udp", antiSanctionDNS, 53, null, "dns-anti-sanction", null);
        }

        servers.push(server);
    }

    const rules = [
        {
            domain: localDnsRuleDomains,
            server: "dns-direct"
        },
        {
            clash_mode: "Direct",
            server: "dns-direct"
        },
        {
            clash_mode: "Global",
            server: "dns-remote"
        }
    ];

    if (dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        const answers = [
            ...ipv4.map(ip => `${host}. IN A ${ip}`),
            ...(VLTRenableIPv6 ? ipv6.map(ip => `${host}. IN AAAA ${ip}`) : [])
        ];

        rules.unshift({
            domain: host,
            action: "predefined",
            answer: answers
        });
    }

    let blockRule = {
        disable_cache: true,
        rule_set: [],
        action: "reject"
    };

    const geoRules = [
        { rule: bypassIran, type: 'direct', geosite: "geosite-ir", geoip: "geoip-ir" },
        { rule: bypassChina, type: 'direct', geosite: "geosite-cn", geoip: "geoip-cn" },
        { rule: bypassRussia, type: 'direct', geosite: "geosite-category-ru", geoip: "geoip-ru" },
        { rule: true, type: 'block', geosite: "geosite-malware" },
        { rule: true, type: 'block', geosite: "geosite-phishing" },
        { rule: true, type: 'block', geosite: "geosite-cryptominers" },
        { rule: blockAds, type: 'block', geosite: "geosite-category-ads-all" },
        { rule: blockPorn, type: 'block', geosite: "geosite-nsfw" }
    ];

    geoRules.forEach(({ rule, type, geosite, geoip }) => {
        rule && type === 'direct' && rules.push({
            type: "logical",
            mode: "and",
            rules: [
                { rule_set: geosite },
                { rule_set: geoip }
            ],
            server: "dns-direct"
        });

        rule && type === 'block' && blockRule.rule_set.push(geosite);
    });

    rules.push(blockRule);
    const createRule = (server) => ({
        domain_suffix: [],
        server
    });

    let domainDirectRule, domainBlockRule;
    const customBypassRulesDomains = customBypassRules.filter(address => isDomain(address));
    if (customBypassRulesDomains.length) {
        domainDirectRule = createRule("dns-direct");
        customBypassRulesDomains.forEach(domain => {
            domainDirectRule.domain_suffix.push(domain);
        });

        rules.push(domainDirectRule);
    }

    if (customBlockRules.length) {
        domainBlockRule = createRule("dns-block");
        customBlockRules.forEach(domain => {
            domainBlockRule.domain_suffix.push(domain);
        });

        rules.push(domainBlockRule);
    }

    const bypassSanctionRules = [
        { rule: bypassOpenAi, geosite: "geosite-openai" },
        { rule: bypassGoogle, geosite: "geosite-google" },
        { rule: bypassMicrosoft, geosite: "geosite-microsoft" }
    ];

    if (isAntiSanctionRule) {
        if (bypassOpenAi || bypassGoogle) {
            const rule_set = bypassSanctionRules.reduce((acc, rule) => {
                rule.rule && acc.push(rule.geosite);
                return acc;
            }, []);

            rules.push({
                rule_set,
                server: "dns-anti-sanction"
            });
        }

        customBypassSanctionRules.length && rules.push({
            domain_suffix: customBypassSanctionRules,
            server: "dns-anti-sanction"
        });
    }

    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    if (isFakeDNS) {
        const fakeip = {
            type: "fakeip",
            tag: "dns-fake",
            inet4_range: "198.18.0.0/15"
        };

        if (isIPv6) fakeip.inet6_range = "fc00::/18";
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
        strategy: isIPv6 ? "prefer_ipv4" : "ipv4_only",
        independent_cache: true
    }
}

function buildSingBoxRoutingRules(isWarp) {
    const defaultRules = [
        {
            action: "sniff"
        },
        {
            action: "hijack-dns",
            mode: "or",
            rules: [
                {
                    inbound: "dns-in"
                },
                {
                    protocol: "dns"
                }
            ],
            type: "logical"
        },
        {
            clash_mode: "Direct",
            outbound: "direct"
        },
        {
            clash_mode: "Global",
            outbound: "✅ Selector"
        }
    ];

    const geoRules = [
        {
            rule: bypassIran,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-ir",
                geoip: "geoip-ir",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"
            }
        },
        {
            rule: bypassChina,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-cn",
                geoip: "geoip-cn",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cn.srs",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-cn.srs"
            }
        },
        {
            rule: bypassRussia,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-category-ru",
                geoip: "geoip-ru",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ru.srs",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ru.srs"
            }
        },
        {
            rule: bypassOpenAi,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-openai",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-openai.srs"
            }
        },
        {
            rule: bypassGoogle,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-google",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-google.srs"
            }
        },
        {
            rule: bypassMicrosoft,
            type: 'direct',
            ruleSet: {
                geosite: "geosite-microsoft",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-microsoft.srs"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleSet: {
                geosite: "geosite-malware",
                geoip: "geoip-malware",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleSet: {
                geosite: "geosite-phishing",
                geoip: "geoip-phishing",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",
                geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"
            }
        },
        {
            rule: true,
            type: 'block',
            ruleSet: {
                geosite: "geosite-cryptominers",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs",
            }
        },
        {
            rule: blockAds,
            type: 'block',
            ruleSet: {
                geosite: "geosite-category-ads-all",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs",
            }
        },
        {
            rule: blockPorn,
            type: 'block',
            ruleSet: {
                geosite: "geosite-nsfw",
                geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs",
            }
        },
    ];

    const directDomainRules = [], directIPRules = [], blockDomainRules = [], blockIPRules = [], ruleSets = [];
    bypassLAN && directIPRules.push({
        ip_is_private: true,
        outbound: "direct"
    });

    const createRule = (rule, action) => {
        return action === 'direct' ? {
            [rule]: [],
            outbound: action
        } : {
            [rule]: [],
            action
        }
    };

    const routingRuleSet = {
        type: "remote",
        tag: "",
        format: "binary",
        url: "",
        download_detour: "direct"
    };

    const directDomainRule = createRule('rule_set', 'direct');;
    const directIPRule = createRule('rule_set', 'direct');
    ;
    const blockDomainRule = createRule('rule_set', 'reject');
    const blockIPRule = createRule('rule_set', 'reject');

    geoRules.forEach(({ rule, type, ruleSet }) => {
        if (!rule) return;
        const { geosite, geoip, geositeURL, geoipURL } = ruleSet;
        const isDirect = type === 'direct';
        const domainRule = isDirect ? directDomainRule : blockDomainRule;
        const ipRule = isDirect ? directIPRule : blockIPRule;

        domainRule.rule_set.push(geosite);
        ruleSets.push({ ...routingRuleSet, tag: geosite, url: geositeURL });

        if (geoip) {
            ipRule.rule_set.push(geoip);
            ruleSets.push({ ...routingRuleSet, tag: geoip, url: geoipURL });
        }
    });

    const pushRuleIfNotEmpty = (rule, targetArray) => {
        if (rule.rule_set?.length || rule.domain_suffix?.length || rule.ip_cidr?.length) {
            targetArray.push(rule);
        }
    };

    pushRuleIfNotEmpty(directDomainRule, directDomainRules);
    pushRuleIfNotEmpty(directIPRule, directIPRules);

    pushRuleIfNotEmpty(blockDomainRule, blockDomainRules);
    pushRuleIfNotEmpty(blockIPRule, blockIPRules);

    const processRules = (addresses, action) => {
        const domainRule = createRule('domain_suffix', action);
        const ipRule = createRule('ip_cidr', action);

        addresses.forEach(address => {
            if (isDomain(address)) {
                domainRule.domain_suffix.push(address);
            } else {
                const ip = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
                ipRule.ip_cidr.push(ip);
            }
        });

        pushRuleIfNotEmpty(domainRule, action === 'direct' ? directDomainRules : blockDomainRules);
        pushRuleIfNotEmpty(ipRule, action === 'direct' ? directIPRules : blockIPRules);
    };

    const totalCustomBypassDomains = [...customBypassRules, ...customBypassSanctionRules];
    totalCustomBypassDomains.length && processRules(totalCustomBypassDomains, 'direct');
    customBlockRules.length && processRules(customBlockRules, 'reject');
    let rules = [];

    isWarp && blockUDP443 && rules.push({
        network: "udp",
        port: 443,
        protocol: "quic",
        action: "reject"
    });

    !isWarp && rules.push({
        network: "udp",
        action: "reject"
    });

    rules = [...defaultRules, ...rules, ...blockDomainRules, ...blockIPRules, ...directDomainRules, ...directIPRules];
    return {
        rules,
        rule_set: ruleSets,
        auto_detect_interface: true,
        override_android_vpn: true,
        final: "✅ Selector"
    }
}

function buildSingBoxVLOutbound(remark, address, port, host, sni, allowInsecure) {
    const path = `/${getRandomPath(16)}${proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;

    const outbound = {
        tag: remark,
        type: "vless",
        server: address,
        server_port: +port,
        uuid: userID,
        packet_encoding: "",
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        domain_resolver: {
            server: "dns-direct",
            strategy: VLTRenableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        },
        tcp_fast_open: true,
        tcp_multi_path: true
    };

    if (tls) outbound.tls = {
        alpn: "http/1.1",
        enabled: true,
        insecure: allowInsecure,
        server_name: sni,
        utls: {
            enabled: true,
            fingerprint: "randomized"
        }
    };

    return outbound;
}

function buildSingBoxTROutbound(remark, address, port, host, sni, allowInsecure) {
    const path = `/tr${getRandomPath(16)}${proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;

    const outbound = {
        tag: remark,
        type: "trojan",
        password: TRPassword,
        server: address,
        server_port: +port,
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        domain_resolver: {
            server: "dns-direct",
            strategy: VLTRenableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        },
        tcp_fast_open: true,
        tcp_multi_path: true
    }

    if (tls) outbound.tls = {
        alpn: "http/1.1",
        enabled: true,
        insecure: allowInsecure,
        server_name: sni,
        utls: {
            enabled: true,
            fingerprint: "randomized"
        }
    };

    return outbound;
}

function buildSingBoxWarpOutbound(warpConfigs, remark, endpoint, chain) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const server = chain ? "162.159.192.1" : endpointServer;
    const port = chain ? 2408 : endpointPort;

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    const outbound = {
        tag: remark,
        type: "wireguard",
        address: [
            "172.16.0.2/32",
            warpIPv6
        ],
        mtu: 1280,
        peers: [
            {
                address: server,
                port: port,
                public_key: publicKey,
                reserved: base64ToDecimal(reserved),
                allowed_ips: [
                    "0.0.0.0/0",
                    "::/0"
                ],
                persistent_keepalive_interval: 5
            }
        ],
        private_key: privateKey,
        domain_resolver: {
            server: chain ? "dns-remote" : "dns-direct",
            strategy: warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        }
    };

    if (chain) outbound.detour = chain;
    return outbound;
}

function buildSingBoxChainOutbound(chainProxyParams) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, server, port, user, pass } = chainProxyParams;

        const chainOutbound = {
            type: protocol,
            tag: "",
            server: server,
            server_port: +port,
            username: user,
            password: pass,
            domain_resolver: {
                server: "dns-remote",
                strategy: VLTRenableIPv6 ? "prefer_ipv4" : "ipv4_only",
                rewrite_ttl: 60
            },
            detour: ""
        };

        if (protocol === 'socks') chainOutbound.version = "5";
        return chainOutbound;
    }

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    const chainOutbound = {
        type: "vless",
        tag: "",
        server: server,
        server_port: +port,
        uuid: uuid,
        flow: flow,
        domain_resolver: {
            server: "dns-remote",
            strategy: VLTRenableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        },
        detour: ""
    };

    if (security === 'tls' || security === 'reality') {
        const tlsAlpns = alpn ? alpn?.split(',').filter(value => value !== 'h2') : [];
        chainOutbound.tls = {
            enabled: true,
            server_name: sni,
            insecure: false,
            alpn: tlsAlpns,
            utls: {
                enabled: true,
                fingerprint: fp
            }
        };

        if (security === 'reality') {
            chainOutbound.tls.reality = {
                enabled: true,
                public_key: pbk,
                short_id: sid
            };

            delete chainOutbound.tls.alpn;
        }
    }

    if (headerType === 'http') {
        const httpHosts = host?.split(',');
        chainOutbound.transport = {
            type: "http",
            host: httpHosts,
            path: path,
            method: "GET",
            headers: {
                "Connection": ["keep-alive"],
                "Content-Type": ["application/octet-stream"]
            },
        };
    }

    if (type === 'ws') {
        const wsPath = path?.split('?ed=')[0];
        const earlyData = +path?.split('?ed=')[1] || 0;
        chainOutbound.transport = {
            type: "ws",
            path: wsPath,
            headers: { Host: host },
            max_early_data: earlyData,
            early_data_header_name: "Sec-WebSocket-Protocol"
        };
    }

    if (type === 'grpc') chainOutbound.transport = {
        type: "grpc",
        service_name: serviceName
    };

    return chainOutbound;
}

async function buildSingBoxConfig(selectorTags, urlTestTags, secondUrlTestTags, isWarp) {
    const config = structuredClone(singboxConfigTemp);
    config.dns = await buildSingBoxDNS(isWarp);
    config.route = buildSingBoxRoutingRules(isWarp);

    const selector = {
        type: "selector",
        tag: "✅ Selector",
        outbounds: selectorTags
    };

    const urlTest = {
        type: "urltest",
        tag: isWarp ? `💦 Warp - Best Ping 🚀` : '💦 Best Ping 💥',
        outbounds: urlTestTags,
        url: "https://www.gstatic.com/generate_204",
        interval: isWarp ? `${bestWarpInterval}s` : `${bestVLTRInterval}s`
    };

    config.outbounds.unshift(selector, urlTest);

    if (isWarp) {
        const secondUrlTest = structuredClone(urlTest);
        secondUrlTest.tag = `💦 WoW - Best Ping 🚀`;
        secondUrlTest.outbounds = secondUrlTestTags;
        config.outbounds.push(secondUrlTest);
    }

    return config;
}

export async function getSingBoxWarpConfig(request, env) {
    const { warpConfigs } = await getDataset(request, env);
    const warpTags = [], wowTags = [];
    const endpoints = {
        proxies: [],
        chains: []
    }

    warpEndpoints.forEach((endpoint, index) => {
        const warpTag = `💦 ${index + 1} - Warp 🇮🇷`;
        warpTags.push(warpTag);

        const wowTag = `💦 ${index + 1} - WoW 🌍`;
        wowTags.push(wowTag);

        const warpOutbound = buildSingBoxWarpOutbound(warpConfigs, warpTag, endpoint, '');
        endpoints.proxies.push(warpOutbound);

        const wowOutbound = buildSingBoxWarpOutbound(warpConfigs, wowTag, endpoint, warpTag);
        endpoints.chains.push(wowOutbound);
    });

    const selectorTags = [`💦 Warp - Best Ping 🚀`, `💦 WoW - Best Ping 🚀`, ...warpTags, ...wowTags];
    const config = await buildSingBoxConfig(selectorTags, warpTags, wowTags, true);
    config.endpoints = [...endpoints.chains, ...endpoints.proxies];

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getSingBoxCustomConfig(env) {
    let chainProxy;
    if (outProxy) {
        try {
            chainProxy = buildSingBoxChainOutbound(outProxyParams, VLTRenableIPv6);
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
    const tags = [];
    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6, customCdnAddrs);
    const outbounds = {
        proxies: [],
        chains: []
    }

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        ports.forEach(port => {
            Addresses.forEach(addr => {
                let VLOutbound, TROutbound;
                const isCustomAddr = customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const tag = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);

                if (protocol === "VLESS") {
                    VLOutbound = buildSingBoxVLOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr
                    );

                    outbounds.proxies.push(VLOutbound);
                }

                if (protocol === "Trojan") {
                    TROutbound = buildSingBoxTROutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr
                    );

                    outbounds.proxies.push(TROutbound);
                }

                if (chainProxy) {
                    const chain = structuredClone(chainProxy);
                    chain.tag = tag;
                    chain.detour = `proxy-${proxyIndex}`;
                    outbounds.chains.push(chain);
                }

                tags.push(tag);

                proxyIndex++;
                protocolIndex++;
            });
        });
    });

    const selectorTags = ['💦 Best Ping 💥', ...tags];
    const config = await buildSingBoxConfig(selectorTags, tags, null, false);
    config.outbounds.push(...outbounds.chains, ...outbounds.proxies);

    return new Response(JSON.stringify(config, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

const singboxConfigTemp = {
    log: {
        level: "warn",
        timestamp: true
    },
    dns: {},
    inbounds: [
        {
            type: "direct",
            tag: "dns-in",
            listen: "0.0.0.0",
            listen_port: 6450,
            override_address: "1.1.1.1",
            override_port: 53
        },
        {
            type: "tun",
            tag: "tun-in",
            address: [
                "172.18.0.1/30",
                "fdfe:dcba:9876::1/126"
            ],
            mtu: 9000,
            auto_route: true,
            strict_route: true,
            endpoint_independent_nat: true,
            stack: "mixed"
        },
        {
            type: "mixed",
            tag: "mixed-in",
            listen: "0.0.0.0",
            listen_port: 2080
        }
    ],
    outbounds: [
        {
            type: "direct",
            // domain_resolver: {
            //     server: "dns-direct",
            //     strategy: "ipv4_only"
            // },
            tag: "direct"
        }
    ],
    route: {},
    ntp: {
        enabled: true,
        server: "time.apple.com",
        server_port: 123,
        detour: "direct",
        interval: "30m",
        write_to_system: false
    },
    experimental: {
        cache_file: {
            enabled: true,
            store_fakeip: true
        },
        clash_api: {
            external_controller: "127.0.0.1:9090",
            external_ui: "ui",
            external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
            external_ui_download_detour: "direct",
            default_mode: "Rule"
        }
    }
};