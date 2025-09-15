import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, isIPv6, isDomain, base64ToDecimal, getDomain, generateWsPath, parseHostPort } from '#configs/utils';
import { getDataset } from '#kv';
import { globalConfig, httpConfig } from '#common/init';
import { settings } from '#common/handlers'

async function buildSingBoxDNS(isWarp) {
    const url = new URL(settings.remoteDNS);
    const dnsProtocol = url.protocol.replace(':', '');

    const servers = [
        {
            type: isWarp ? "udp" : dnsProtocol,
            server: isWarp ? "1.1.1.1" : settings.dohHost.host,
            detour: "✅ Selector",
            tag: "dns-remote"
        },
    ];

    function addDnsServer(type, server, server_port, detour, tag, domain_resolver) {
        servers.push({
            type,
            ...(server && { server }),
            ...(server_port && { server_port }),
            ...(detour && { detour }),
            ...(domain_resolver && {
                domain_resolver: {
                    server: domain_resolver,
                    strategy: "ipv4_only"
                }
            }),
            tag
        });
    }

    if (settings.localDNS === 'localhost') {
        addDnsServer("local", null, null, null, "dns-direct");
    } else {
        addDnsServer("udp", settings.localDNS, 53, null, "dns-direct");
    }

    const rules = [
        {
            domain: ["raw.githubusercontent.com"],
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

    if (settings.outProxy) {
        const { server } = settings.outProxyParams;
        if (isDomain(server)) {
            rules.unshift({
                domain: server,
                server: "dns-remote"
            });
        }
    }

    if (settings.dohHost.isDomain && !isWarp) {
        const { ipv4, ipv6, host } = settings.dohHost;

        servers.push({
            type: "hosts",
            tag: "hosts",
            predefined: {
                [host]: [
                    ...ipv4,
                    ...(settings.VLTRenableIPv6 ? ipv6 : [])
                ]
            }
        });

        rules.unshift({
            ip_accept_any: true,
            server: "hosts"
        });
    }

    function addDnsRule(geosite, geoip, domain, dns) {
        let type, mode;
        const ruleSets = [];
        if (geoip) {
            mode = 'and';
            type = 'logical';
            ruleSets.push({ rule_set: geosite }, { rule_set: geoip });
        }
        const action = dns === 'reject' ? 'reject' : 'route';
        const server = dns === 'reject' ? null : dns;

        rules.push({
            ...(type && { type }),
            ...(mode && { mode }),
            ...(ruleSets.length && { rules: ruleSets }),
            ...(geosite && !geoip && { rule_set: geosite }),
            ...(domain && { domain_suffix: domain }),
            action,
            ...(server && { server })
        });
    }

    const routingRules = getRoutingRules();

    settings.customBlockRules.filter(isDomain).forEach(domain => {
        routingRules.unshift({ rule: true, domain: domain, type: 'reject' });
    });

    settings.customBypassRules.filter(isDomain).forEach(domain => {
        routingRules.push({ rule: true, domain: domain, type: 'direct', dns: "dns-direct" });
    });

    settings.customBypassSanctionRules.filter(isDomain).forEach(domain => {
        routingRules.push({ rule: true, domain: domain, type: 'direct', dns: "dns-anti-sanction" });
    });

    const groupedRules = new Map();
    routingRules.filter(({ rule }) => rule).forEach(({ geosite, geoip, domain, type, dns }) => {
        if (geosite && geoip && type === 'direct') {
            addDnsRule(geosite, geoip, null, dns);
        } else {
            const dnsType = dns || type;
            if (!groupedRules.has(dnsType)) groupedRules.set(dnsType, { geosite: [], domain: [] });
            if (geosite) groupedRules.get(dnsType).geosite.push(geosite);
            if (domain) groupedRules.get(dnsType).domain.push(domain);
        }
    });

    for (const [dnsType, rule] of groupedRules) {
        const { geosite, domain } = rule;
        if (domain.length) addDnsRule(null, null, domain, dnsType);
        if (geosite.length) addDnsRule(geosite, null, null, dnsType);
    }

    const isSanctionRule = groupedRules.has("dns-anti-sanction");
    if (isSanctionRule) {
        const dnsHost = getDomain(settings.antiSanctionDNS);
        if (dnsHost.isHostDomain) {
            addDnsServer("https", dnsHost.host, 443, null, "dns-anti-sanction", "dns-direct");
        } else {
            addDnsServer("udp", settings.antiSanctionDNS, 53, null, "dns-anti-sanction", null);
        }
    }

    const isFakeDNS = (settings.VLTRFakeDNS && !isWarp) || (settings.warpFakeDNS && isWarp);
    if (isFakeDNS) {
        const fakeip = {
            type: "fakeip",
            tag: "dns-fake",
            inet4_range: "198.18.0.0/15"
        };

        const isIPv6 = (settings.VLTRenableIPv6 && !isWarp) || (settings.warpEnableIPv6 && isWarp);
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
        strategy: "ipv4_only",
        independent_cache: true
    }
}

function buildSingBoxRoutingRules(isWarp) {
    const rules = [
        {
            ip_cidr: "172.18.0.2",
            action: "hijack-dns"
        },
        {
            clash_mode: "Direct",
            outbound: "direct"
        },
        {
            clash_mode: "Global",
            outbound: "✅ Selector"
        },
        {
            action: "sniff"
        },
        {
            protocol: "dns",
            action: "hijack-dns"
        }
    ];

    if (settings.bypassLAN) rules.push({
        ip_is_private: true,
        outbound: "direct"
    });

    function addRoutingRule(domain, ip, geosite, geoip, network, protocol, port, type) {
        const action = type === 'reject' ? 'reject' : 'route';
        const outbound = type === 'direct' ? 'direct' : null;
        rules.push({
            ...(geosite && { rule_set: geosite }),
            ...(geoip && { rule_set: geoip }),
            ...(domain && { domain_suffix: domain }),
            ...(ip && { ip_cidr: ip }),
            ...(network && { network }),
            ...(protocol && { protocol }),
            ...(port && { port }),
            action,
            ...(outbound && { outbound })
        });
    }

    if (isWarp && settings.blockUDP443) addRoutingRule(null, null, null, null, "udp", "quic", 443, 'reject');
    if (!isWarp) addRoutingRule(null, null, null, null, "udp", null, null, 'reject');

    const routingRules = getRoutingRules();
    settings.customBlockRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'reject',
            domain: isDomainValue ? value : null,
            ip: isDomainValue ? null : isIPv6(value) ? value.replace(/\[|\]/g, '') : value
        });
    });

    const bypassRules = [...settings.customBypassRules, ...settings.customBypassSanctionRules];
    bypassRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'direct',
            domain: isDomainValue ? value : null,
            ip: isDomainValue ? null : isIPv6(value) ? value.replace(/\[|\]/g, '') : value
        });
    });

    const ruleSets = [];
    const addRuleSet = (geoRule) => {
        const { geosite, geositeURL, geoip, geoipURL } = geoRule;
        if (geosite) ruleSets.push({
            type: "remote",
            tag: geosite,
            format: "binary",
            url: geositeURL,
            download_detour: "direct"
        });

        if (geoip) ruleSets.push({
            type: "remote",
            tag: geoip,
            format: "binary",
            url: geoipURL,
            download_detour: "direct"
        });
    }

    const groupedRules = new Map();
    routingRules.filter(({ rule }) => rule).forEach(routingRule => {
        const { type, domain, ip, geosite, geoip } = routingRule;
        if (!groupedRules.has(type)) groupedRules.set(type, { domain: [], ip: [], geosite: [], geoip: [] });
        if (domain) groupedRules.get(type).domain.push(domain);
        if (ip) groupedRules.get(type).ip.push(ip);
        if (geosite) groupedRules.get(type).geosite.push(geosite);
        if (geoip) groupedRules.get(type).geoip.push(geoip);
        if (geosite || geoip) addRuleSet(routingRule);
    });

    for (const [type, rule] of groupedRules) {
        const { domain, ip, geosite, geoip } = rule;

        if (domain.length) addRoutingRule(domain, null, null, null, null, null, null, type);
        if (geosite.length) addRoutingRule(null, null, geosite, null, null, null, null, type);
        if (ip.length) addRoutingRule(null, ip, null, null, null, null, null, type);
        if (geoip.length) addRoutingRule(null, null, null, geoip, null, null, null, type);
    }

    return {
        rules,
        rule_set: ruleSets,
        auto_detect_interface: true,
        default_domain_resolver: {
            server: "dns-direct",
            strategy: settings.VLTRenableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        },
        // override_android_vpn: true,
        final: "✅ Selector"
    }
}

function buildSingBoxVLOutbound(remark, address, port, host, sni, allowInsecure, isFragment) {
    const tls = httpConfig.defaultHttpsPorts.includes(port) ? true : false;

    const outbound = {
        tag: remark,
        type: atob('dmxlc3M='),
        server: address,
        server_port: port,
        uuid: globalConfig.userID,
        network: "tcp",
        tcp_fast_open: true,
        packet_encoding: "",
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: generateWsPath("vl"),
            type: "ws"
        }
    };

    if (tls) outbound.tls = {
        alpn: "http/1.1",
        enabled: true,
        insecure: allowInsecure,
        server_name: sni,
        record_fragment: isFragment,
        utls: {
            enabled: true,
            fingerprint: settings.fingerprint
        }
    };

    return outbound;
}

function buildSingBoxTROutbound(remark, address, port, host, sni, allowInsecure, isFragment) {
    const tls = httpConfig.defaultHttpsPorts.includes(port) ? true : false;

    const outbound = {
        tag: remark,
        type: atob('dHJvamFu'),
        password: globalConfig.TrPass,
        server: address,
        server_port: port,
        network: "tcp",
        tcp_fast_open: true,
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: generateWsPath("tr"),
            type: "ws"
        }
    }

    if (tls) outbound.tls = {
        alpn: "http/1.1",
        enabled: true,
        insecure: allowInsecure,
        server_name: sni,
        record_fragment: isFragment,
        utls: {
            enabled: true,
            fingerprint: settings.fingerprint
        }
    };

    return outbound;
}

function buildSingBoxWarpOutbound(warpConfigs, remark, endpoint, chain) {
    const { host, port } = parseHostPort(endpoint);
    const server = chain ? "162.159.192.1" : host;
    const finalPort = chain ? 2408 : port;

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
                port: finalPort,
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
            strategy: settings.warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only",
            rewrite_ttl: 60
        }
    };

    if (chain) outbound.detour = chain;
    return outbound;
}

function buildSingBoxChainOutbound() {
    const { outProxyParams } = settings;
    const { protocol } = outProxyParams;
    if (["socks", "http"].includes(protocol)) {
        const { server, port, user, pass } = outProxyParams;

        const chainOutbound = {
            type: protocol,
            tag: "",
            server: server,
            server_port: +port,
            username: user,
            password: pass,
            detour: ""
        };

        if (protocol === 'socks') chainOutbound.version = "5";
        return chainOutbound;
    }

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = outProxyParams;
    const chainOutbound = {
        type: atob('dmxlc3M='),
        tag: "",
        server: server,
        server_port: +port,
        uuid: uuid,
        flow: flow,
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

async function buildSingBoxConfig(selectorTags, urlTestTags, secondUrlTestTags, isWarp, isIPv6) {
    const config = structuredClone(singboxConfigTemp);
    config.dns = await buildSingBoxDNS(isWarp);
    config.route = buildSingBoxRoutingRules(isWarp);

    if (isIPv6) config.inbounds.find(({ type }) => type === 'tun').address.push("fdfe:dcba:9876::1/126");
    config.outbounds.find(({ type }) => type === 'selector').outbounds = selectorTags;

    const urlTest = {
        type: "urltest",
        tag: isWarp ? `💦 Warp - Best Ping 🚀` : '💦 Best Ping 💥',
        outbounds: urlTestTags,
        url: "https://www.gstatic.com/generate_204",
        interrupt_exist_connections: false,
        interval: isWarp ? `${settings.bestWarpInterval}s` : `${settings.bestVLTRInterval}s`
    };

    config.outbounds.push(urlTest);

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

    settings.warpEndpoints.forEach((endpoint, index) => {
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
    const config = await buildSingBoxConfig(selectorTags, warpTags, wowTags, true, settings.warpEnableIPv6);
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

export async function getSingBoxCustomConfig(env, isFragment) {
    let chainProxy;

    if (settings.outProxy) {
        try {
            chainProxy = buildSingBoxChainOutbound(settings.outProxyParams);
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
    const tags = [];
    const Addresses = await getConfigAddresses(false);
    const outbounds = {
        proxies: [],
        chains: []
    }

    const ports = isFragment
        ? settings.ports.filter(port => httpConfig.defaultHttpsPorts.includes(port))
        : settings.ports;

    protocols.forEach(protocol => {
        let protocolIndex = 1;
        ports.forEach(port => {
            Addresses.forEach(addr => {
                let VLOutbound, TROutbound;
                const isCustomAddr = settings.customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? settings.customCdnSni : randomUpperCase(httpConfig.hostName);
                const host = isCustomAddr ? settings.customCdnHost : httpConfig.hostName;
                const tag = generateRemark(protocolIndex, port, addr, settings.cleanIPs, protocol, configType);

                if (protocol === atob('VkxFU1M=')) {
                    VLOutbound = buildSingBoxVLOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr,
                        isFragment
                    );

                    outbounds.proxies.push(VLOutbound);
                }

                if (protocol === atob('VHJvamFu')) {
                    TROutbound = buildSingBoxTROutbound(
                        chainProxy ? `proxy-${proxyIndex}` : tag,
                        addr,
                        port,
                        host,
                        sni,
                        isCustomAddr,
                        isFragment
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
    const config = await buildSingBoxConfig(selectorTags, tags, null, false, settings.VLTRenableIPv6);
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
            type: "tun",
            tag: "tun-in",
            address: [
                "172.18.0.1/30"
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
            type: "selector",
            tag: "✅ Selector",
            outbounds: [],
            interrupt_exist_connections: false
        },
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
        server: "time.cloudflare.com",
        server_port: 123,
        domain_resolver: "dns-direct",
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

function getRoutingRules() {
    return [
        {
            rule: true,
            type: 'reject',
            geosite: "geosite-malware",
            geoip: "geoip-malware",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs"
        },
        {
            rule: true,
            type: 'reject',
            geosite: "geosite-phishing",
            geoip: "geoip-phishing",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs"
        },
        {
            rule: true,
            type: 'reject',
            geosite: "geosite-cryptominers",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs",
        },
        {
            rule: settings.blockAds,
            type: 'reject',
            geosite: "geosite-category-ads-all",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs",
        },
        {
            rule: settings.blockPorn,
            type: 'reject',
            geosite: "geosite-nsfw",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs",
        },
        {
            rule: settings.bypassIran,
            type: 'direct',
            dns: "dns-direct",
            geosite: "geosite-ir",
            geoip: "geoip-ir",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs"
        },
        {
            rule: settings.bypassChina,
            type: 'direct',
            dns: "dns-direct",
            geosite: "geosite-cn",
            geoip: "geoip-cn",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cn.srs",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-cn.srs"
        },
        {
            rule: settings.bypassRussia,
            type: 'direct',
            dns: "dns-direct",
            geosite: "geosite-category-ru",
            geoip: "geoip-ru",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ru.srs",
            geoipURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ru.srs"
        },
        {
            rule: settings.bypassOpenAi,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-openai",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-openai.srs"
        },
        {
            rule: settings.bypassMicrosoft,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-microsoft",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-microsoft.srs"
        },
        {
            rule: settings.bypassOracle,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-oracle",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-oracle.srs"
        },
        {
            rule: settings.bypassDocker,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-docker",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-docker.srs"
        },
        {
            rule: settings.bypassAdobe,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-adobe",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-adobe.srs"
        },
        {
            rule: settings.bypassEpicGames,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-epicgames",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-epicgames.srs"
        },
        {
            rule: settings.bypassIntel,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-intel",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-intel.srs"
        },
        {
            rule: settings.bypassAmd,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-amd",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-amd.srs"
        },
        {
            rule: settings.bypassNvidia,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-nvidia",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nvidia.srs"
        },
        {
            rule: settings.bypassAsus,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-asus",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-asus.srs"
        },
        {
            rule: settings.bypassHp,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-hp",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-hp.srs"
        },
        {
            rule: settings.bypassLenovo,
            type: 'direct',
            dns: "dns-anti-sanction",
            geosite: "geosite-lenovo",
            geositeURL: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-lenovo.srs"
        },
    ];
}