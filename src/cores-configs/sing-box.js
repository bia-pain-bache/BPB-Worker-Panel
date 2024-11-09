import { getConfigAddresses, extractWireguardParams, generateRemark, randomUpperCase, getRandomPath } from './helpers';
import { initializeParams, userID, trojanPassword, hostName, defaultHttpsPorts } from "../helpers/init";
import { renderErrorPage } from '../pages/error';
import { getDataset } from '../kv/handlers';
import { isDomain } from '../helpers/helpers';

function buildSingBoxDNS (proxySettings, outboundAddrs, isChain, isWarp) {
    const { 
        remoteDNS, 
        localDNS, 
        vlessTrojanFakeDNS, 
        enableIPv6,
        warpFakeDNS,
        warpEnableIPv6,
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn 
    } = proxySettings;

    let fakeip;
    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const isIPv6 = (enableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
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
    const servers = [
        {
            address: isWarp ? "1.1.1.1" : remoteDNS,
            address_resolver: "dns-direct",
            strategy: isIPv6 ? "prefer_ipv4" : "ipv4_only",
            detour: isWarp ? "💦 Warp - Best Ping 🚀" : isChain ? 'proxy-1' : "proxy",
            tag: "dns-remote"
        },
        {
            address: localDNS,
            strategy: isIPv6 ? "prefer_ipv4" : "ipv4_only",
            detour: "direct",
            tag: "dns-direct"
        },
        {
            address: "rcode://success",
            tag: "dns-block"
        }
    ];

    let outboundRule;
    if (isWarp) {
        outboundRule = { 
            outbound: "any", 
            server: "dns-direct" 
        };
    } else {
        const outboundDomains = outboundAddrs.filter(address => isDomain(address));
        const uniqueDomains = [...new Set(outboundDomains)];
        outboundRule = { 
            domain: uniqueDomains, 
            server: "dns-direct" 
        };
    }

    const rules = [
        outboundRule,
        {
            clash_mode: "Direct",
            server: "dns-direct"
        },
        {
            clash_mode: "Global",
            server: "dns-remote"
        }
    ];
    
    let blockRule = {
        disable_cache: true,
        rule_set: [],
        server: "dns-block"
    };

    geoRules.forEach(({ rule, type, geosite, geoip }) => {
        rule && type === 'direct' && rules.push({
            type: "logical",
            mode: "and",
            rules: [
                { rule_set: geosite },
                { rule_set: geoip }
            ],
            "server": "dns-direct"
        });

        rule && type === 'block' && blockRule.rule_set.push(geosite);
    });

    rules.push(blockRule);
    if (isFakeDNS) {
        servers.push({
            address: "fakeip",
            tag: "dns-fake"
        });

        rules.push({
            disable_cache: true,
            inbound: "tun-in",
            query_type: [
              "A",
              "AAAA"
            ],
            server: "dns-fake"
        });

        fakeip = {
            enabled: true,
            inet4_range: "198.18.0.0/15"
        };

        if (isIPv6) fakeip.inet6_range = "fc00::/18";
    }

    return {servers, rules, fakeip};
}

function buildSingBoxRoutingRules (proxySettings) {
    const { 
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn, 
        blockUDP443 
    } = proxySettings;

    const isBypass = bypassIran || bypassChina || bypassRussia;
    const rules = [
        {
            type: "logical",
            mode: "or",
            rules: [
                {
                    inbound: "dns-in",
                },
                {
                    network: "udp",
                    port: 53
                }
            ],
            outbound: "dns-out"
        },
        {
            clash_mode: "Direct",
            outbound: "direct"
        },
        {
            clash_mode: "Global",
            outbound: "proxy"
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
                geositeURL: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs", 
                geoipURL: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs"
            }
        },
        { 
            rule: bypassRussia,
            type: 'direct', 
            ruleSet: { 
                geosite: "geosite-category-ru",
                geoip: "geoip-ru", 
                geositeURL: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ru.srs", 
                geoipURL: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs"
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

    bypassLAN && rules.push({
        ip_is_private: true,
        outbound: "direct"
    });

    const createRule = (outbound) => ({
        rule_set: [],
        outbound
    });

    const routingRuleSet = {
        type: "remote",
        tag: "",
        format: "binary",
        url: "",
        download_detour: "direct"
    };

    const directRule = createRule('direct');;
    const blockRule = createRule('block');
    const ruleSets = [];

    geoRules.forEach(({ rule, type, ruleSet }) => {
        const { geosite, geoip, geositeURL, geoipURL } = ruleSet;
        if (rule) {
            if (type === 'direct') {
                directRule.rule_set.unshift(geosite);
                directRule.rule_set.push(geoip);
            } else {
                blockRule.rule_set.unshift(geosite);  
                geoip && blockRule.rule_set.push(geoip); 
            }
            ruleSets.push({...routingRuleSet, tag: geosite, url: geositeURL});
            geoip && ruleSets.push({...routingRuleSet, tag: geoip, url: geoipURL});
        }
    });

    isBypass && rules.push(directRule);
    rules.push(blockRule);

    blockUDP443 && rules.push({
        network: "udp",
        port: 443,
        protocol: "quic",
        outbound: "block"
    });

    return {rules: rules, rule_set: ruleSets};
}

function buildSingBoxVLESSOutbound (proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
    const { enableIPv6, lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
    const path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    const outbound =  {
        type: "vless",
        server: address,
        server_port: +port,
        domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
        uuid: userID,
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: allowInsecure,
            server_name: sni,
            utls: {
                enabled: true,
                fingerprint: "randomized"
            }
        },
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        tag: remark
    };

    if (!tls) delete outbound.tls;
    if (isFragment) outbound.tls_fragment = {
        enabled: true,
        size: `${lengthMin}-${lengthMax}`,
        sleep: `${intervalMin}-${intervalMax}`
    };

    return outbound;
}

function buildSingBoxTrojanOutbound (proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
    const { enableIPv6, lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
    const path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    const outbound = {
        type: "trojan",
        password: trojanPassword,
        server: address,
        server_port: +port,
        domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: allowInsecure,
            server_name: sni,
            utls: {
                enabled: true,
                fingerprint: "randomized"
            }
        },
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        tag: remark
    }

    if (!tls) delete outbound.tls;
    if (isFragment) outbound.tls_fragment = {
        enabled: true,
        size: `${lengthMin}-${lengthMax}`,
        sleep: `${intervalMin}-${intervalMax}`
    };

    return outbound;    
}

function buildSingBoxWarpOutbound (proxySettings, warpConfigs, remark, endpoint, chain, client) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const { 
        warpEnableIPv6,
		hiddifyNoiseMode, 
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax 
	} = proxySettings;

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    const outbound = {
        local_address: [
            "172.16.0.2/32",
            warpIPv6
        ],
        mtu: 1280,
        peer_public_key: publicKey,
        private_key: privateKey,
        reserved: reserved,
        server: endpointServer,
        server_port: endpointPort,
        domain_strategy: warpEnableIPv6 ? "prefer_ipv4" : "ipv4_only",
        type: "wireguard",
        detour: chain,
        tag: remark
    };

    client === 'hiddify' && Object.assign(outbound, {
        fake_packets_mode: hiddifyNoiseMode,
        fake_packets: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
        fake_packets_size: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
        fake_packets_delay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
    });

    return outbound;
}

function buildSingBoxChainOutbound (chainProxyParams, enableIPv6) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, server, port, user, pass } = chainProxyParams;
    
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

    const { server, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    const chainOutbound = {
        type: "vless",
        tag: "",
        server: server,
        server_port: +port,
        domain_strategy: enableIPv6 ? "prefer_ipv4" : "ipv4_only",
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

export async function getSingBoxWarpConfig (request, env, client) {
    const { kvNotFound, proxySettings, warpConfigs } = await getDataset(request, env);
    if (kvNotFound) return await renderErrorPage(request, env, 'KV Dataset is not properly set!', null, true);
    const { warpEndpoints } = proxySettings;
    const config = structuredClone(singboxConfigTemp);
    const dnsObject = buildSingBoxDNS(proxySettings, undefined, false, true);
    const {rules, rule_set} = buildSingBoxRoutingRules(proxySettings);
    config.dns.servers = dnsObject.servers;
    config.dns.rules = dnsObject.rules;
    if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
    config.route.rules = rules;
    config.route.rule_set = rule_set;
    const selector = config.outbounds[0];
    const warpUrlTest = config.outbounds[1];
    const proIndicator = client === 'hiddify' ? ' Pro ' : ' ';
    selector.outbounds = [`💦 Warp${proIndicator}- Best Ping 🚀`, `💦 WoW${proIndicator}- Best Ping 🚀`];
    config.outbounds.splice(2, 0, structuredClone(warpUrlTest));
    const WoWUrlTest = config.outbounds[2];
    warpUrlTest.tag = `💦 Warp${proIndicator}- Best Ping 🚀`;
    warpUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
    WoWUrlTest.tag = `💦 WoW${proIndicator}- Best Ping 🚀`;
    WoWUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
    const warpRemarks = [], WoWRemarks = [];

    warpEndpoints.split(',').forEach( (endpoint, index) => {
        const warpRemark = `💦 ${index + 1} - Warp 🇮🇷`;
        const WoWRemark = `💦 ${index + 1} - WoW 🌍`;
        const warpOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, warpRemark, endpoint, '', client);
        const WoWOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, WoWRemark, endpoint, warpRemark, client);
        config.outbounds.push(WoWOutbound, warpOutbound);
        warpRemarks.push(warpRemark);
        WoWRemarks.push(WoWRemark);
        warpUrlTest.outbounds.push(warpRemark);
        WoWUrlTest.outbounds.push(WoWRemark);
    });
    
    selector.outbounds.push(...warpRemarks, ...WoWRemarks);
    return new Response(JSON.stringify(config, null, 4), { 
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getSingBoxCustomConfig(request, env, isFragment) {
    await initializeParams(request, env);
    const { kvNotFound, proxySettings } = await getDataset(request, env);
    if (kvNotFound) return await renderErrorPage(request, env, 'KV Dataset is not properly set!', null, true);
    let chainProxyOutbound;
    const { 
        cleanIPs,  
        ports, 
        vlessConfigs, 
        trojanConfigs, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        enableIPv6
    } = proxySettings;
 
    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);      
        try {
            chainProxyOutbound = buildSingBoxChainOutbound(proxyParams, enableIPv6);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxyOutbound = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: {}
            }));
        }
    }
    
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    const config = structuredClone(singboxConfigTemp);
    const dnsObject = buildSingBoxDNS(proxySettings, totalAddresses, chainProxyOutbound, false);
    const {rules, rule_set} = buildSingBoxRoutingRules(proxySettings);
    config.dns.servers = dnsObject.servers;
    config.dns.rules = dnsObject.rules;
    if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
    config.route.rules = rules;
    config.route.rule_set = rule_set;
    const selector = config.outbounds[0];
    const urlTest = config.outbounds[1];
    selector.outbounds = ['💦 Best Ping 💥'];
    urlTest.interval = `${bestVLESSTrojanInterval}s`;
    urlTest.tag = '💦 Best Ping 💥';
    const totalPorts = ports.filter(port => isFragment ? defaultHttpsPorts.includes(port) : true);
    let proxyIndex = 1;
    const protocols = [
        ...(vlessConfigs ? ['VLESS'] : []),
        ...(trojanConfigs ? ['Trojan'] : [])
    ];

    protocols.forEach ( protocol => {
        let protocolIndex = 1;
        totalPorts.forEach ( port => {
            totalAddresses.forEach ( addr => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = customCdnAddresses.includes(addr);
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
         
                if (protocol === 'VLESS') {
                    VLESSOutbound = buildSingBoxVLESSOutbound (
                        proxySettings,
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        host,
                        sni,
                        isCustomAddr, 
                        isFragment
                    );
                    config.outbounds.push(VLESSOutbound);
                }
                
                if (protocol === 'Trojan') {
                    TrojanOutbound = buildSingBoxTrojanOutbound (
                        proxySettings,
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        host,
                        sni,
                        isCustomAddr,
                        isFragment
                    );
                    config.outbounds.push(TrojanOutbound);
                }
                
                if (chainProxyOutbound) {
                    const chain = structuredClone(chainProxyOutbound);
                    chain.tag = remark;
                    chain.detour = `proxy-${proxyIndex}`;
                    config.outbounds.push(chain);
                }
                
                selector.outbounds.push(remark);
                urlTest.outbounds.push(remark);
                proxyIndex++;
                protocolIndex++;
            });
        });
    });

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
    dns: {
        servers: [],
        rules: [],
        independent_cache: true
    },
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
                "172.18.0.1/28",
                "fdfe:dcba:9876::1/126"
            ],
            mtu: 9000,
            auto_route: true,
            strict_route: true,
            stack: "mixed",
            endpoint_independent_nat: true,
            sniff: true,
            sniff_override_destination: true
        },
        {
            type: "mixed",
            tag: "mixed-in",
            listen: "0.0.0.0",
            listen_port: 2080,
            sniff: true,
            sniff_override_destination: false
        }
    ],
    outbounds: [
        {
            type: "selector",
            tag: "proxy",
            outbounds: []
        },
        {
            type: "urltest",
            tag: "",
            outbounds: [],
            url: "https://www.gstatic.com/generate_204",
            interval: ""
        },
        {
            type: "direct",
            tag: "direct"
        },
        {
            type: "block",
            tag: "block"
        },
        {
            type: "dns",
            tag: "dns-out"
        }
    ],
    route: {
        rules: [],
        rule_set: [],
        auto_detect_interface: true,
        override_android_vpn: true,
        final: "proxy"
    },
    ntp: {
        enabled: true,
        server: "time.apple.com",
        server_port: 123,
        detour: "direct",
        interval: "30m",
    },
    experimental: {
        cache_file: {
            enabled: true,
            store_fakeip: true
        },
        clash_api: {
            external_controller: "127.0.0.1:9090",
            external_ui: "yacd",
            external_ui_download_url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
            external_ui_download_detour: "direct",
            default_mode: "Rule"
        }
    }
};