import { getConfigAddresses, extractWireguardParams, base64ToDecimal, generateRemark, randomUpperCase, getRandomPath, getDomain, resolveDNS, isDomain } from './helpers';
import { getDataset } from '../kv/handlers';

async function buildXrayDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp) {
    const {
        remoteDNS,
        localDNS,
        VLTRFakeDNS,
        VLTRenableIPv6,
        warpFakeDNS,
        warpEnableIPv6,
        blockAds,
        bypassIran,
        bypassChina,
        blockPorn,
        bypassRussia,
        bypassOpenAi,
        customBypassRules,
        customBlockRules
    } = globalThis.proxySettings;

    const bypassRules = [
        { rule: bypassIran, domain: "geosite:category-ir", ip: "geoip:ir" },
        { rule: bypassChina, domain: "geosite:cn", ip: "geoip:cn" },
        { rule: bypassRussia, domain: "geosite:category-ru", ip: "geoip:ru" }
    ];

    const blockRules = [
        { rule: blockAds, host: "geosite:category-ads-all" },
        { rule: blockAds, host: "geosite:category-ads-ir" },
        { rule: blockPorn, host: "geosite:category-porn" }
    ];

    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const isIPv6 = (VLTRenableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
    const outboundDomains = outboundAddrs.filter(address => isDomain(address));
    const customBypassRulesDomains = customBypassRules.filter(address => isDomain(address));
    const customBlockRulesDomains = customBlockRules.filter(address => isDomain(address));
    const uniqueOutboundDomains = [...new Set(outboundDomains)];
    const isDomainRule = [...uniqueOutboundDomains, ...customBypassRulesDomains].length > 0;
    const isBypass = bypassIran || bypassChina || bypassRussia;
    const isBlock = blockAds || blockPorn || customBlockRulesDomains.length > 0;
    const finalRemoteDNS = isWorkerLess
        ? ["https://cloudflare-dns.com/dns-query"]
        : isWarp
            ? ["1.1.1.1"]
            : [remoteDNS];

    const dnsHost = {};
    if (isBlock) {
        blockRules.forEach(({ rule, host }) => {
            if (rule) dnsHost[host] = ["127.0.0.1"];
        });
        customBlockRulesDomains.forEach(domain => {
            dnsHost[`domain:${domain}`] = ["127.0.0.1"];
        });
    }

    const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs) : undefined;
    if (staticIPs) dnsHost[domainToStaticIPs] = VLTRenableIPv6 ? [...staticIPs.ipv4, ...staticIPs.ipv6] : staticIPs.ipv4;

    if (isWorkerLess) dnsHost["cloudflare-dns.com"] = ["cloudflare.com"];

    const hosts = Object.keys(dnsHost).length ? { hosts: dnsHost } : {};
    const dnsObject = {
        ...hosts,
        servers: finalRemoteDNS,
        queryStrategy: isIPv6 ? "UseIP" : "UseIPv4",
        tag: "dns",
    };

    const dohHost = getDomain(remoteDNS);
    if (dohHost.isHostDomain && !isWorkerLess && !isWarp) dnsObject.servers.push({
        address: 'https://8.8.8.8/dns-query',
        domains: [`full:${dohHost.host}`],
        skipFallback: true
    });

    if (bypassOpenAi) dnsObject.servers.push({
        address: "178.22.122.100",
        domains: ["geosite:openai"],
        skipFallback: true
    });

    if (isDomainRule) {
        const outboundDomainRules = uniqueOutboundDomains.map(domain => `full:${domain}`);
        const bypassDomainRules = customBypassRulesDomains.map(domain => `domain:${domain}`);
        dnsObject.servers.push({
            address: localDNS,
            domains: [...outboundDomainRules, ...bypassDomainRules],
            skipFallback: true
        });
    }

    isWorkerLess && dnsObject.servers.push({
        address: "localhost",
        domains: ["full:cloudflare.com"],
        skipFallback: true
    });

    const localDNSServer = {
        address: localDNS,
        domains: [],
        expectIPs: [],
        skipFallback: true
    };

    if (isBypass) {
        bypassRules.forEach(({ rule, domain, ip }) => {
            if (rule) {
                localDNSServer.domains.push(domain);
                localDNSServer.expectIPs.push(ip);
            }
        });

        dnsObject.servers.push(localDNSServer);
    }

    if (isFakeDNS) {
        const workerLessDomain = isWorkerLess ? ["full:cloudflare.com"] : [];
        const fakeDNSServer = isBypass || isWorkerLess
            ? { address: "fakedns", domains: [...localDNSServer.domains, ...workerLessDomain] }
            : "fakedns";
        dnsObject.servers.unshift(fakeDNSServer);
    }

    return dnsObject;
}

function buildXrayRoutingRules(outboundAddrs, isChain, isBalancer, isWorkerLess, isWarp) {
    const {
        localDNS,
        bypassLAN,
        bypassIran,
        bypassChina,
        bypassRussia,
        bypassOpenAi,
        blockAds,
        blockPorn,
        blockUDP443,
        customBypassRules,
        customBlockRules
    } = globalThis.proxySettings;

    const geoRules = [
        { rule: bypassLAN, type: 'direct', domain: "geosite:private", ip: "geoip:private" },
        { rule: bypassIran, type: 'direct', domain: "geosite:category-ir", ip: "geoip:ir" },
        { rule: bypassChina, type: 'direct', domain: "geosite:cn", ip: "geoip:cn" },
        { rule: bypassRussia, type: 'direct', domain: "geosite:ru", ip: "geoip:ru" },
        { rule: bypassOpenAi, type: 'direct', domain: "geosite:openai" },
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-all" },
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-ir" },
        { rule: blockPorn, type: 'block', domain: "geosite:category-porn" }
    ];

    const outboundDomains = outboundAddrs.filter(address => isDomain(address));
    const customBypassRulesDomains = customBypassRules.filter(address => isDomain(address));
    const isDomainRule = [...outboundDomains, ...customBypassRulesDomains].length > 0;

    const isBlock = blockAds || blockPorn || customBlockRules.length > 0;
    const isBypass = bypassIran || bypassChina || bypassRussia || bypassOpenAi || customBypassRules.length > 0;

    const rules = [
        {
            inboundTag: [
                "dns-in"
            ],
            outboundTag: "dns-out",
            type: "field"
        },
        {
            inboundTag: [
                "socks-in"
            ],
            port: "53",
            outboundTag: "dns-out",
            type: "field"
        }
    ];

    if ((isDomainRule || isBypass) && localDNS !== 'localhost') rules.push({
        inboundTag: ["dns"],
        ip: [localDNS],
        port: "53",
        outboundTag: "direct",
        type: "field"
    });

    bypassOpenAi && rules.push({
        ip: ["178.22.122.100"],
        outboundTag: "direct",
        type: "field"
    });

    const finallOutboundTag = isChain ? "chain" : isWorkerLess ? "fragment" : "proxy";
    const outType = isBalancer ? "balancerTag" : "outboundTag";
    const outTag = isBalancer ? "all" : finallOutboundTag;
    
    rules.push({
        inboundTag: ["dns"],
        [outType]: outTag,
        type: "field"
    });

    isWarp && blockUDP443 && rules.push({
        network: "udp",
        port: "443",
        outboundTag: "block",
        type: "field",
    });

    if (isBypass || isBlock) {
        const createRule = (type, outbound) => ({
            [type]: [],
            outboundTag: outbound,
            type: "field"
        });

        let domainDirectRule = createRule("domain", "direct");
        let ipDirectRule = createRule("ip", "direct");

        let domainBlockRule = createRule("domain", "block");
        let ipBlockRule = createRule("ip", "block");

        geoRules.forEach(({ rule, type, domain, ip }) => {
            if (rule) {
                if (type === 'direct') {
                    domainDirectRule?.domain.push(domain);
                    ip && ipDirectRule?.ip?.push(ip);
                } else {
                    domainBlockRule.domain.push(domain);
                }
            }
        });

        customBypassRules.forEach(address => {
            if (isDomain(address)) {
                domainDirectRule?.domain.push(`domain:${address}`);
            } else {
                ipDirectRule?.ip.push(address);
            }
        });

        customBlockRules.forEach(address => {
            if (isDomain(address)) {
                domainBlockRule.domain.push(`domain:${address}`);
            } else {
                ipBlockRule.ip.push(address);
            }
        });

        domainBlockRule.domain.length && rules.push(domainBlockRule);
        ipBlockRule.ip.length && rules.push(ipBlockRule);

        domainDirectRule.domain.length && rules.push(domainDirectRule);
        ipDirectRule.ip.length && rules.push(ipDirectRule);
    }

    if (!isWarp && !isWorkerLess) rules.push({
        network: "udp",
        outboundTag: "block",
        type: "field"
    });

    if (isBalancer) {
        rules.push({
            network: isWarp ? "tcp,udp" : "tcp",
            balancerTag: "all",
            type: "field"
        });
    } else {
        rules.push({
            network: isWarp || isWorkerLess ? "tcp,udp" : "tcp",
            outboundTag: finallOutboundTag,
            type: "field"
        });
    }

    return rules;
}

function buildXrayVLOutbound(tag, address, port, host, sni, proxyIPs, isFragment, allowInsecure) {
    const { userID, defaultHttpsPorts } = globalThis;
    const { VLTRenableIPv6 } = globalThis.proxySettings;
    const proxyIpPath = proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : '';
    const path = `/${getRandomPath(16)}${proxyIpPath}?ed=2560`;
    const outbound = {
        protocol: 'vless',
        settings: {
            vnext: [
                {
                    address: address,
                    port: +port,
                    users: [
                        {
                            id: userID,
                            encryption: "none",
                            level: 8
                        }
                    ]
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "none",
            sockopt: {},
            wsSettings: {
                host: host,
                path: path
            }
        },
        tag: tag
    };

    if (defaultHttpsPorts.includes(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: "randomized",
            alpn: ["http/1.1"],
            serverName: sni
        };
    }

    const sockopt = outbound.streamSettings.sockopt;
    if (isFragment) {
        sockopt.dialerProxy = "fragment";
    } else {
        sockopt.domainStrategy = VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }

    return outbound;
}

function buildXrayTROutbound(tag, address, port, host, sni, proxyIPs, isFragment, allowInsecure) {
    const { TRPassword, defaultHttpsPorts } = globalThis;
    const { VLTRenableIPv6 } = globalThis.proxySettings;
    const proxyIpPath = proxyIPs.length ? `/${btoa(proxyIPs.join(','))}` : '';
    const path = `/tr${getRandomPath(16)}${proxyIpPath}?ed=2560`;
    const outbound = {
        protocol: "trojan",
        settings: {
            servers: [
                {
                    address: address,
                    port: +port,
                    password: TRPassword,
                    level: 8
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "none",
            sockopt: {},
            wsSettings: {
                host: host,
                path: path
            }
        },
        tag: tag
    };

    if (defaultHttpsPorts.includes(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: "randomized",
            alpn: ["http/1.1"],
            serverName: sni
        };
    }

    const sockopt = outbound.streamSettings.sockopt;
    if (isFragment) {
        sockopt.dialerProxy = "fragment";
    } else {
        sockopt.domainStrategy = VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }

    return outbound;
}

function buildXrayWarpOutbound(warpConfigs, endpoint, isWoW) {
    const {
        knockerNoiseMode,
        noiseCountMin,
        noiseCountMax,
        noiseSizeMin,
        noiseSizeMax,
        noiseDelayMin,
        noiseDelayMax
    } = globalThis.proxySettings;

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, isWoW);

    const outbound = {
        protocol: "wireguard",
        settings: {
            address: [
                "172.16.0.2/32",
                warpIPv6
            ],
            mtu: 1280,
            peers: [
                {
                    endpoint: isWoW ? "162.159.192.1:2408" : endpoint,
                    publicKey: publicKey,
                    keepAlive: 5
                }
            ],
            reserved: base64ToDecimal(reserved),
            secretKey: privateKey
        },
        tag: isWoW ? "chain" : "proxy"
    };

    let chain = '';
    if (isWoW) chain = "proxy";
    if (!isWoW && globalThis.client === 'xray-pro') chain = "udp-noise";

    if (chain) outbound.streamSettings = {
        sockopt: {
            dialerProxy: chain
        }
    };

    if (globalThis.client === 'xray-knocker' && !isWoW) {
        delete outbound.streamSettings;
        Object.assign(outbound.settings, {
            wnoise: knockerNoiseMode,
            wnoisecount: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
            wpayloadsize: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
            wnoisedelay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
        });
    }

    return outbound;
}

function buildXrayChainOutbound(chainProxyParams, VLTRenableIPv6) {
    if (['socks', 'http'].includes(chainProxyParams.protocol)) {
        const { protocol, server, port, user, pass } = chainProxyParams;
        return {
            protocol: protocol,
            settings: {
                servers: [
                    {
                        address: server,
                        port: +port,
                        users: [
                            {
                                user: user,
                                pass: pass,
                                level: 8
                            }
                        ]
                    }
                ]
            },
            streamSettings: {
                network: "tcp",
                sockopt: {
                    dialerProxy: "proxy",
                    domainStrategy: VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4"
                }
            },
            mux: {
                enabled: true,
                concurrency: 8,
                xudpConcurrency: 16,
                xudpProxyUDP443: "reject"
            },
            tag: "chain"
        };
    }

    const {
        server,
        port,
        uuid,
        flow,
        security,
        type,
        sni,
        fp,
        alpn,
        pbk,
        sid,
        spx,
        headerType,
        host,
        path,
        authority,
        serviceName,
        mode
    } = chainProxyParams;

    const proxyOutbound = {
        mux: {
            concurrency: 8,
            enabled: true,
            xudpConcurrency: 16,
            xudpProxyUDP443: "reject"
        },
        protocol: "vless",
        settings: {
            vnext: [
                {
                    address: server,
                    port: +port,
                    users: [
                        {
                            encryption: "none",
                            flow: flow,
                            id: uuid,
                            level: 8,
                            security: "auto"
                        }
                    ]
                }
            ]
        },
        streamSettings: {
            network: type,
            security: security,
            sockopt: {
                dialerProxy: "proxy",
                domainStrategy: VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4"
            }
        },
        tag: "chain"
    };

    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        proxyOutbound.streamSettings.tlsSettings = {
            allowInsecure: false,
            fingerprint: fp,
            alpn: tlsAlpns,
            serverName: sni
        };
    }

    if (security === 'reality') {
        delete proxyOutbound.mux;
        proxyOutbound.streamSettings.realitySettings = {
            fingerprint: fp,
            publicKey: pbk,
            serverName: sni,
            shortId: sid,
            spiderX: spx
        };
    }

    if (headerType === 'http') {
        const httpPaths = path?.split(',');
        const httpHosts = host?.split(',');
        proxyOutbound.streamSettings.tcpSettings = {
            header: {
                request: {
                    headers: { Host: httpHosts },
                    method: "GET",
                    path: httpPaths,
                    version: "1.1"
                },
                response: {
                    headers: { "Content-Type": ["application/octet-stream"] },
                    reason: "OK",
                    status: "200",
                    version: "1.1"
                },
                type: "http"
            }
        };
    }

    if (type === 'tcp' && security !== 'reality' && !headerType) proxyOutbound.streamSettings.tcpSettings = {
        header: {
            type: "none"
        }
    };

    if (type === 'ws') proxyOutbound.streamSettings.wsSettings = {
        host: host,
        path: path
    };

    if (type === 'grpc') {
        delete proxyOutbound.mux;
        proxyOutbound.streamSettings.grpcSettings = {
            authority: authority,
            multiMode: mode === 'multi',
            serviceName: serviceName
        };
    }

    return proxyOutbound;
}

function buildFreedomOutbound(isFragment, isUdpNoises, tag, length, interval) {
    const {
        xrayUdpNoises,
        fragmentPackets,
        fragmentLengthMin,
        fragmentLengthMax,
        fragmentIntervalMin,
        fragmentIntervalMax,
        VLTRenableIPv6,
        warpEnableIPv6
    } = globalThis.proxySettings;

    const outbound = {
        tag: tag,
        protocol: "freedom",
        settings: {},
    };

    if (isFragment) {
        outbound.settings.fragment = {
            packets: fragmentPackets,
            length: length || `${fragmentLengthMin}-${fragmentLengthMax}`,
            interval: interval || `${fragmentIntervalMin}-${fragmentIntervalMax}`,
        };
        outbound.settings.domainStrategy = VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }

    if (isUdpNoises) {
        outbound.settings.noises = [];
        const noises = structuredClone(xrayUdpNoises);
        noises.forEach(noise => {
            const count = noise.count;
            delete noise.count;
            outbound.settings.noises.push(...Array.from({ length: count }, () => noise));
        });

        if (!isFragment) outbound.settings.domainStrategy = warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }

    return outbound;
}

async function buildXrayConfig(
    remark,
    isBalancer,
    isChain,
    balancerFallback,
    isWarp,
    isFragment,
    isWorkerLess,
    outboundAddrs,
    domainToStaticIPs
) {
    const { proxySettings, client } = globalThis;
    const {
        VLTRFakeDNS,
        warpFakeDNS,
        bestVLTRInterval,
        bestWarpInterval,
    } = proxySettings;

    const config = structuredClone(xrayConfigTemp);
    config.remarks = remark;

    config.dns = await buildXrayDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp);
    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    isFakeDNS && config.inbounds[0].sniffing.destOverride.push("fakedns");

    if (isFragment) {
        const fragmentOutbound = buildFreedomOutbound(true, isWorkerLess, 'fragment');
        config.outbounds.unshift(fragmentOutbound);
    }

    if (isWarp && client === 'xray-pro') {
        const udpNoiseOutbound = buildFreedomOutbound(false, true, 'udp-noise');
        config.outbounds.unshift(udpNoiseOutbound);
    }

    config.routing.rules = buildXrayRoutingRules(outboundAddrs, isChain, isBalancer, isWorkerLess, isWarp);

    if (isBalancer) {
        config.routing.balancers = [
            {
                tag: "all",
                selector: [isChain ? "chain" : "prox"],
                strategy: {
                    type: "leastPing",
                },
                ...(balancerFallback && { fallbackTag: "prox-2" })
            }
        ];

        config.observatory = {
            subjectSelector: [
                isChain ? "chain" : "prox"
            ],
            probeUrl: "https://www.gstatic.com/generate_204",
            probeInterval: `${isWarp ? bestWarpInterval : bestVLTRInterval}s`,
            enableConcurrency: true
        };

    }

    return config;
}

async function buildXrayBestPingConfig(totalAddresses, chainProxy, outbounds, isFragment) {
    const remark = isFragment ? `💦 BPB F - Best Ping 💥` : `💦 BPB - Best Ping 💥`;
    const config = await buildXrayConfig(remark, true, chainProxy, true, false, isFragment, false, totalAddresses, null);
    config.outbounds.unshift(...outbounds);
    return config;
}

async function buildXrayBestFragmentConfig(hostName, chainProxy, outbound) {

    const { fragmentIntervalMin, fragmentIntervalMax } = globalThis.proxySettings;
    const bestFragValues = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70',
        '70-80', '80-90', '90-100', '10-30', '20-40', '30-50',
        '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'];

    const config = await buildXrayConfig(`💦 BPB F - Best Fragment 😎`, true, chainProxy, false, false, true, false, [], hostName);
    const bestFragOutbounds = [];

    bestFragValues.forEach((fragLength, index) => {
        if (chainProxy) {
            const chainOutbound = structuredClone(chainProxy);
            chainOutbound.tag = `chain-${index + 1}`;
            chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
            bestFragOutbounds.push(chainOutbound);
        }

        const proxy = structuredClone(outbound);
        proxy.tag = `prox-${index + 1}`;
        proxy.streamSettings.sockopt.dialerProxy = `frag-${index + 1}`;
        const fragmentOutbound = buildFreedomOutbound(true, false, `frag-${index + 1}`, fragLength, `${fragmentIntervalMin}-${fragmentIntervalMax}`);

        bestFragOutbounds.push(proxy, fragmentOutbound);
    });

    config.outbounds.unshift(...bestFragOutbounds);
    return config;
}

async function buildXrayWorkerLessConfig() {
    const config = await buildXrayConfig(`💦 BPB F - WorkerLess ⭐`, false, false, false, false, true, true, [], null);
    return config;
}

export async function getXrayCustomConfigs(env, isFragment) {
    const { hostName, defaultHttpsPorts } = globalThis;

    const {
        proxyIPs,
        outProxy,
        outProxyParams,
        cleanIPs,
        VLTRenableIPv6,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        VLConfigs,
        TRConfigs,
        ports
    } = globalThis.proxySettings;

    let chainProxy;
    if (outProxy) {
        try {
            chainProxy = buildXrayChainOutbound(outProxyParams, VLTRenableIPv6);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxy = undefined;
            await env.kv.put("proxySettings", JSON.stringify({
                ...proxySettings,
                outProxy: '',
                outProxyParams: {}
            }));
        }
    }

    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6, customCdnAddrs, isFragment);
    const totalPorts = ports.filter(port => isFragment ? defaultHttpsPorts.includes(port) : true);

    let protocols = [];
    VLConfigs && protocols.push('VLESS');
    TRConfigs && protocols.push('Trojan');

    let proxyIndex = 1;
    let configs = [];
    let outbounds = {
        proxies: [],
        chains: []
    };

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const addr of Addresses) {
                const isCustomAddr = customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
                const customConfig = await buildXrayConfig(remark, false, chainProxy, false, false, isFragment, false, [addr], null);

                const outbound = protocol === 'VLESS'
                    ? buildXrayVLOutbound('proxy', addr, port, host, sni, proxyIPs, isFragment, isCustomAddr)
                    : buildXrayTROutbound('proxy', addr, port, host, sni, proxyIPs, isFragment, isCustomAddr);

                customConfig.outbounds.unshift({ ...outbound });
                outbounds.proxies.push(outbound);

                if (chainProxy) {
                    customConfig.outbounds.unshift(structuredClone(chainProxy));
                    outbounds.chains.push(structuredClone(chainProxy));
                }

                configs.push(customConfig);

                proxyIndex++;
                protocolIndex++;
            }
        }
    }

    outbounds.proxies.forEach((outbound, index) => outbound.tag = `prox-${index + 1}`);
    chainProxy && outbounds.chains.forEach((outbound, index) => {
        outbound.tag = `chain-${index + 1}`;
        outbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
    });

    const totalOutbounds = [...outbounds.chains, ...outbounds.proxies];

    const bestPing = await buildXrayBestPingConfig(Addresses, chainProxy, totalOutbounds, isFragment);
    const finalConfigs = [...configs, bestPing];
    if (isFragment) {
        const bestFragment = await buildXrayBestFragmentConfig(hostName, chainProxy, outbounds.proxies[0]);
        const workerLessConfig = await buildXrayWorkerLessConfig();
        finalConfigs.push(bestFragment, workerLessConfig);
    }

    return new Response(JSON.stringify(finalConfigs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getXrayWarpConfigs(request, env, isPro) {

    const { warpConfigs } = await getDataset(request, env);
    const { warpEndpoints } = globalThis.proxySettings;

    const proIndicator = isPro ? ' Pro ' : ' ';
    const xrayWarpConfigs = [];
    const xrayWoWConfigs = [];
    const outbounds = {
        proxies: [],
        chains: []
    };

    for (const [index, endpoint] of warpEndpoints.entries()) {
        const endpointHost = endpoint.split(':')[0];

        const warpConfig = await buildXrayConfig(`💦 ${index + 1} - Warp${proIndicator}🇮🇷`, false, false, false, true, false, false, [endpointHost], null);
        const WoWConfig = await buildXrayConfig(`💦 ${index + 1} - WoW${proIndicator}🌍`, false, true, false, true, false, false, [endpointHost], null);

        const warpOutbound = buildXrayWarpOutbound(warpConfigs, endpoint, false);
        const WoWOutbound = buildXrayWarpOutbound(warpConfigs, endpoint, true);

        warpConfig.outbounds.unshift(structuredClone(warpOutbound));
        WoWConfig.outbounds.unshift(structuredClone(WoWOutbound), structuredClone(warpOutbound));

        xrayWarpConfigs.push(warpConfig);
        xrayWoWConfigs.push(WoWConfig);

        outbounds.proxies.push(warpOutbound);
        outbounds.chains.push(WoWOutbound);
    }

    outbounds.proxies.forEach((outbound, index) => outbound.tag = `prox-${index + 1}`);
    outbounds.chains.forEach((outbound, index) => {
        outbound.tag = `chain-${index + 1}`;
        outbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
    });

    const totalOutbounds = [...outbounds.chains, ...outbounds.proxies];
    const outboundDomains = warpEndpoints.map(endpoint => endpoint.split(':')[0]).filter(address => isDomain(address));

    const xrayWarpBestPing = await buildXrayConfig(`💦 Warp${proIndicator}- Best Ping 🚀`, true, false, false, true, false, false, outboundDomains, null);
    xrayWarpBestPing.outbounds.unshift(...outbounds.proxies);

    const xrayWoWBestPing = await buildXrayConfig(`💦 WoW${proIndicator}- Best Ping 🚀`, true, true, false, true, false, false, outboundDomains, null);
    xrayWoWBestPing.outbounds.unshift(...totalOutbounds);

    const configs = [...xrayWarpConfigs, ...xrayWoWConfigs, xrayWarpBestPing, xrayWoWBestPing];

    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

const xrayConfigTemp = {
    remarks: "",
    log: {
        loglevel: "warning",
    },
    dns: {},
    inbounds: [
        {
            port: 10808,
            protocol: "socks",
            settings: {
                auth: "noauth",
                udp: true,
                userLevel: 8,
            },
            sniffing: {
                destOverride: ["http", "tls"],
                enabled: true,
                routeOnly: true
            },
            tag: "socks-in",
        },
        {
            port: 10853,
            protocol: "dokodemo-door",
            settings: {
                address: "1.1.1.1",
                network: "tcp,udp",
                port: 53
            },
            tag: "dns-in"
        }
    ],
    outbounds: [
        {
            protocol: "dns",
            tag: "dns-out"
        },
        {
            protocol: "freedom",
            settings: {
                domainStrategy: "UseIP"
            },
            tag: "direct",
        },
        {
            protocol: "blackhole",
            settings: {
                response: {
                    type: "http",
                },
            },
            tag: "block",
        },
    ],
    policy: {
        levels: {
            8: {
                connIdle: 300,
                downlinkOnly: 1,
                handshake: 4,
                uplinkOnly: 1,
            }
        },
        system: {
            statsOutboundUplink: true,
            statsOutboundDownlink: true,
        }
    },
    routing: {
        domainStrategy: "IPIfNonMatch",
        rules: [],
    },
    stats: {}
};