import { resolveDNS, isDomain } from '../helpers/helpers';
import { getConfigAddresses, extractWireguardParams, base64ToDecimal, generateRemark, randomUpperCase, getRandomPath, getDomain } from './helpers';
import { getDataset } from '../kv/handlers';

async function buildXrayDNS(proxySettings, outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp) {
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
        customBypassRules,
        customBlockRules
    } = proxySettings;

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
    if (isWorkerLess) {
        const domains = ["cloudflare-dns.com", "cloudflare.com", "dash.cloudflare.com"];
        const resolved = await Promise.all(domains.map(resolveDNS));
        const hostIPv4 = resolved.flatMap(r => r.ipv4);
        const hostIPv6 = VLTRenableIPv6 ? resolved.flatMap(r => r.ipv6) : [];
        dnsHost["cloudflare-dns.com"] = [
            ...hostIPv4,
            ...hostIPv6
        ];
    }

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

    if (isDomainRule) {
        const outboundDomainRules = uniqueOutboundDomains.map(domain => `full:${domain}`);
        const bypassDomainRules = customBypassRulesDomains.map(domain => `domain:${domain}`);
        dnsObject.servers.push({
            address: localDNS,
            domains: [...outboundDomainRules, ...bypassDomainRules],
            skipFallback: true
        });
    }

    const localDNSServer = {
        address: localDNS,
        domains: [],
        expectIPs: [],
        skipFallback: true
    };

    if (!isWorkerLess && isBypass) {
        bypassRules.forEach(({ rule, domain, ip }) => {
            if (rule) {
                localDNSServer.domains.push(domain);
                localDNSServer.expectIPs.push(ip);
            }
        });

        dnsObject.servers.push(localDNSServer);
    }

    if (isFakeDNS) {
        const fakeDNSServer = isBypass && !isWorkerLess
            ? { address: "fakedns", domains: localDNSServer.domains }
            : "fakedns";
        dnsObject.servers.unshift(fakeDNSServer);
    }

    return dnsObject;
}

function buildXrayRoutingRules(proxySettings, outboundAddrs, isChain, isBalancer, isWorkerLess, isWarp) {
    const {
        localDNS,
        bypassLAN,
        bypassIran,
        bypassChina,
        bypassRussia,
        blockAds,
        blockPorn,
        blockUDP443,
        customBypassRules,
        customBlockRules
    } = proxySettings;

    const geoRules = [
        { rule: bypassLAN, type: 'direct', domain: "geosite:private", ip: "geoip:private" },
        { rule: bypassIran, type: 'direct', domain: "geosite:category-ir", ip: "geoip:ir" },
        { rule: bypassChina, type: 'direct', domain: "geosite:cn", ip: "geoip:cn" },
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-all" },
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-ir" },
        { rule: blockPorn, type: 'block', domain: "geosite:category-porn" }
    ];
    const outboundDomains = outboundAddrs.filter(address => isDomain(address));
    const customBypassRulesDomains = customBypassRules.filter(address => isDomain(address));
    const isDomainRule = [...outboundDomains, ...customBypassRulesDomains].length > 0;
    const isBlock = blockAds || blockPorn || customBlockRules.length > 0;
    const isBypass = bypassIran || bypassChina || bypassRussia || customBypassRules.length > 0;
    const finallOutboundTag = isChain ? "chain" : isWorkerLess ? "fragment" : "proxy";
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

    if (!isWorkerLess && (isDomainRule || isBypass) && localDNS !== 'localhost') rules.push({
        inboundTag: ["dns"],
        ip: [localDNS],
        port: "53",
        outboundTag: "direct",
        type: "field"
    });

    if (!isWorkerLess) rules.push({
        inboundTag: ["dns"],
        [isBalancer ? "balancerTag" : "outboundTag"]: isBalancer ? "all" : finallOutboundTag,
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

        let domainDirectRule, ipDirectRule;
        if (!isWorkerLess) {
            domainDirectRule = createRule("domain", "direct");
            ipDirectRule = createRule("ip", "direct");
        }

        let domainBlockRule = createRule("domain", "block");
        let ipBlockRule = createRule("ip", "block");
        geoRules.forEach(({ rule, type, domain, ip }) => {
            if (rule) {
                if (type === 'direct') {
                    domainDirectRule?.domain.push(domain);
                    ipDirectRule?.ip?.push(ip);
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
        if (!isWorkerLess) {
            domainDirectRule.domain.length && rules.push(domainDirectRule);
            ipDirectRule.ip.length && rules.push(ipDirectRule);
        }
    }

    if (isBalancer) {
        rules.push({
            network: isWarp ? "tcp,udp" : "tcp",
            balancerTag: "all",
            type: "field"
        });
    } else {
        rules.push({
            network: isWarp ? "tcp,udp" : "tcp",
            outboundTag: finallOutboundTag,
            type: "field"
        });
    }

    return rules;
}

function buildXrayVLOutbound(tag, address, port, host, sni, proxyIPs, isFragment, allowInsecure, VLTRenableIPv6) {
    const { userID, defaultHttpsPorts } = globalThis;
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
                path: `/${getRandomPath(16)}${proxyIPs.length ? `/${proxyIPs.join(',')}` : ''}?ed=2560`
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

function buildXrayTROutbound(tag, address, port, host, sni, proxyIPs, isFragment, allowInsecure, VLTRenableIPv6) {
    const { TRPassword, defaultHttpsPorts } = globalThis;
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
                path: `/tr${getRandomPath(16)}${proxyIPs.length ? `/${proxyIPs.join(',')}` : ''}?ed=2560`
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

function buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, chain, client) {
    const {
        knockerNoiseMode,
        noiseCountMin,
        noiseCountMax,
        noiseSizeMin,
        noiseSizeMax,
        noiseDelayMin,
        noiseDelayMax
    } = proxySettings;

    const isWoW = chain === 'proxy';
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
        streamSettings: {
            sockopt: {
                dialerProxy: chain
            }
        },
        tag: isWoW ? "chain" : "proxy"
    };

    !chain && delete outbound.streamSettings;
    client === 'xray-knocker' && !isWoW && delete outbound.streamSettings && Object.assign(outbound.settings, {
        wnoise: knockerNoiseMode,
        wnoisecount: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
        wpayloadsize: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
        wnoisedelay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
    });

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
        headers: { Host: host },
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

function buildFreedomOutbound(proxySettings, isFragment, isUdpNoises, tag) {
    const {
        xrayUdpNoises,
        fragmentPackets,
        fragmentLengthMin,
        fragmentLengthMax,
        fragmentIntervalMin,
        fragmentIntervalMax,
        VLTRenableIPv6,
        warpEnableIPv6
    } = proxySettings;

    const outbound = {
        tag: tag,
        protocol: "freedom",
        settings: {},
    };

    if (isFragment) {
        outbound.settings.fragment = {
            packets: fragmentPackets,
            length: `${fragmentLengthMin}-${fragmentLengthMax}`,
            interval: `${fragmentIntervalMin}-${fragmentIntervalMax}`,
        };
        outbound.settings.domainStrategy = VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }

    if (isUdpNoises) {
        outbound.settings.noises = [];
        xrayUdpNoises.forEach(noise => {
            const count = noise.count;
            delete noise.count;
            outbound.settings.noises.push(...Array.from({ length: count }, () => noise));
        });

        if (!isFragment) outbound.settings.domainStrategy = warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4";
    }
    return outbound;
}

function buildXrayConfig(proxySettings, remark, isBalancer, isChain, balancerFallback, isWarp) {
    const {
        VLTRFakeDNS,
        warpFakeDNS,
        bestVLTRInterval,
        bestWarpInterval,
    } = proxySettings;

    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const config = structuredClone(xrayConfigTemp);
    config.remarks = remark;
    isFakeDNS && config.inbounds[0].sniffing.destOverride.push("fakedns");

    if (isBalancer) {
        const interval = isWarp ? bestWarpInterval : bestVLTRInterval;
        config.observatory.probeInterval = `${interval}s`;
        if (balancerFallback) config.routing.balancers[0].fallbackTag = "prox-2";
        if (isChain) {
            config.observatory.subjectSelector = ["chain"];
            config.routing.balancers[0].selector = ["chain"];
        }
    } else {
        delete config.observatory;
        delete config.routing.balancers;
    }

    return config;
}

async function buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment) {
    const remark = isFragment ? `💦 BPB F - Best Ping 💥` : `💦 BPB - Best Ping 💥`;
    const config = buildXrayConfig(proxySettings, remark, true, chainProxy, true);
    config.dns = await buildXrayDNS(proxySettings, totalAddresses, undefined, false, false);
    config.routing.rules = buildXrayRoutingRules(proxySettings, totalAddresses, chainProxy, true, false, true);
    config.outbounds.unshift(...outbounds);
    return config;
}

async function buildXrayBestFragmentConfig(proxySettings, hostName, chainProxy, outbounds) {
    const bestFragValues = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70',
        '70-80', '80-90', '90-100', '10-30', '20-40', '30-50',
        '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'];

    const config = buildXrayConfig(proxySettings, `💦 BPB F - Best Fragment 😎`, true, chainProxy, false, false);
    config.dns = await buildXrayDNS(proxySettings, [], hostName, false, false);
    config.routing.rules = buildXrayRoutingRules(proxySettings, [], chainProxy, true, false, false);
    const bestFragOutbounds = [];
    const freedomOutbound = outbounds.pop();

    bestFragValues.forEach((fragLength, index) => {
        if (chainProxy) {
            const chainOutbound = structuredClone(chainProxy);
            chainOutbound.tag = `chain-${index + 1}`;
            chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
            bestFragOutbounds.push(chainOutbound);
        }

        const proxyOutbound = structuredClone(outbounds[chainProxy ? 1 : 0]);
        proxyOutbound.tag = `prox-${index + 1}`;
        proxyOutbound.streamSettings.sockopt.dialerProxy = `frag-${index + 1}`;
        const fragmentOutbound = structuredClone(freedomOutbound);
        fragmentOutbound.tag = `frag-${index + 1}`;
        fragmentOutbound.settings.fragment.length = fragLength;
        fragmentOutbound.settings.fragment.interval = '1-1';
        bestFragOutbounds.push(proxyOutbound, fragmentOutbound);
    });

    config.outbounds.unshift(...bestFragOutbounds);
    return config;
}

async function buildXrayWorkerLessConfig(proxySettings) {
    const config = buildXrayConfig(proxySettings, `💦 BPB F - WorkerLess ⭐`, false, false, false, false);
    const fragmentOutbound = buildFreedomOutbound(proxySettings, true, true, 'fragment');
    config.outbounds.unshift(fragmentOutbound);
    config.dns = await buildXrayDNS(proxySettings, [], undefined, true);
    config.routing.rules = buildXrayRoutingRules(proxySettings, [], false, false, true, false);
    const fakeOutbound = buildXrayVLOutbound('fake-outbound', 'google.com', '443', globalThis.host, 'google.com', [], true, false, proxySettings.VLTRenableIPv6);
    fakeOutbound.streamSettings.wsSettings.path = '/';
    config.outbounds.push(fakeOutbound);
    return config;
}

export async function getXrayCustomConfigs(request, env, isFragment) {
    const { hostName, defaultHttpsPorts } = globalThis;
    const { proxySettings } = await getDataset(request, env);
    let configs = [];
    let outbounds = [];
    let protocols = [];
    let chainProxy;
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
    } = proxySettings;

    if (outProxy) {
        const proxyParams = outProxyParams;
        try {
            chainProxy = buildXrayChainOutbound(proxyParams, VLTRenableIPv6);
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

    const Addresses = await getConfigAddresses(cleanIPs, VLTRenableIPv6);
    const totalAddresses = isFragment ? [...Addresses] : [...Addresses, ...customCdnAddrs];
    const totalPorts = ports.filter(port => isFragment ? defaultHttpsPorts.includes(port) : true);
    VLConfigs && protocols.push('VLESS');
    TRConfigs && protocols.push('Trojan');
    let proxyIndex = 1;
    let freedomOutbound = isFragment ? buildFreedomOutbound(proxySettings, true, false, 'fragment') : null;

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const addr of totalAddresses) {
                const isCustomAddr = customCdnAddrs.includes(addr);
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
                const customConfig = buildXrayConfig(proxySettings, remark, false, chainProxy, false, false);
                isFragment && customConfig.outbounds.unshift(freedomOutbound);
                customConfig.dns = await buildXrayDNS(proxySettings, [addr], undefined, false, false);
                customConfig.routing.rules = buildXrayRoutingRules(proxySettings, [addr], chainProxy, false, false, false);
                const outbound = protocol === 'VLESS'
                    ? buildXrayVLOutbound('proxy', addr, port, host, sni, proxyIPs, isFragment, isCustomAddr, VLTRenableIPv6)
                    : buildXrayTROutbound('proxy', addr, port, host, sni, proxyIPs, isFragment, isCustomAddr, VLTRenableIPv6);

                customConfig.outbounds.unshift({ ...outbound });
                outbound.tag = `prox-${proxyIndex}`;

                if (chainProxy) {
                    customConfig.outbounds.unshift(chainProxy);
                    const chainOutbound = structuredClone(chainProxy);
                    chainOutbound.tag = `chain-${proxyIndex}`;
                    chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${proxyIndex}`;
                    outbounds.push(chainOutbound);
                }

                outbounds.push(outbound);
                configs.push(customConfig);
                proxyIndex++;
                protocolIndex++;
            }
        }
    }

    isFragment && outbounds.push(freedomOutbound);
    const bestPing = await buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment);
    const finalConfigs = [...configs, bestPing];
    if (isFragment) {
        const bestFragment = await buildXrayBestFragmentConfig(proxySettings, hostName, chainProxy, outbounds);
        const workerLessConfig = await buildXrayWorkerLessConfig(proxySettings);
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

export async function getXrayWarpConfigs(request, env) {
    const { proxySettings, warpConfigs } = await getDataset(request, env);
    const { warpEndpoints } = proxySettings;
    const { client } = globalThis;
    const xrayWarpConfigs = [];
    const xrayWoWConfigs = [];
    const xrayWarpOutbounds = [];
    const xrayWoWOutbounds = [];
    const outboundDomains = warpEndpoints.map(endpoint => endpoint.split(':')[0]).filter(address => isDomain(address));
    const proIndicator = client !== 'xray' ? ' Pro ' : ' ';
    const xrayWarpChain = client === 'xray-pro' ? 'udp-noise' : undefined;
    let freedomOutbound;
    if (client === 'xray-pro') {
        freedomOutbound = buildFreedomOutbound(proxySettings, false, true, 'udp-noise');
    }

    for (const [index, endpoint] of warpEndpoints.entries()) {
        const endpointHost = endpoint.split(':')[0];
        const warpConfig = buildXrayConfig(proxySettings, `💦 ${index + 1} - Warp${proIndicator}🇮🇷`, false, false, false, true);
        const WoWConfig = buildXrayConfig(proxySettings, `💦 ${index + 1} - WoW${proIndicator}🌍`, false, true, false, true);
        if (client === 'xray-pro') {
            warpConfig.outbounds.unshift(freedomOutbound);
            WoWConfig.outbounds.unshift(freedomOutbound);
        }
        warpConfig.dns = WoWConfig.dns = await buildXrayDNS(proxySettings, [endpointHost], undefined, false, true);
        warpConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], false, false, false, true);
        WoWConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], true, false, false, true);
        const warpOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, xrayWarpChain, client);
        const WoWOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, 'proxy', client);
        warpConfig.outbounds.unshift(warpOutbound);
        WoWConfig.outbounds.unshift(WoWOutbound, warpOutbound);
        xrayWarpConfigs.push(warpConfig);
        xrayWoWConfigs.push(WoWConfig);
        const proxyOutbound = structuredClone(warpOutbound);
        proxyOutbound.tag = `prox-${index + 1}`;
        const chainOutbound = structuredClone(WoWOutbound);
        chainOutbound.tag = `chain-${index + 1}`;
        chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
        xrayWarpOutbounds.push(proxyOutbound);
        xrayWoWOutbounds.push(chainOutbound);
    }

    const dnsObject = await buildXrayDNS(proxySettings, outboundDomains, undefined, false, true);
    const xrayWarpBestPing = buildXrayConfig(proxySettings, `💦 Warp${proIndicator}- Best Ping 🚀`, true, false, false, true);
    xrayWarpBestPing.dns = dnsObject;
    xrayWarpBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, false, true, false, true);
    client === 'xray-pro' && xrayWarpBestPing.outbounds.unshift(freedomOutbound);
    xrayWarpBestPing.outbounds.unshift(...xrayWarpOutbounds);
    const xrayWoWBestPing = buildXrayConfig(proxySettings, `💦 WoW${proIndicator}- Best Ping 🚀`, true, true, false, true);
    xrayWoWBestPing.dns = dnsObject;
    xrayWoWBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, true, true, false, true);
    client === 'xray-pro' && xrayWoWBestPing.outbounds.unshift(freedomOutbound);
    xrayWoWBestPing.outbounds.unshift(...xrayWoWOutbounds, ...xrayWarpOutbounds);
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
        balancers: [
            {
                tag: "all",
                selector: ["prox"],
                strategy: {
                    type: "leastPing",
                },
            }
        ]
    },
    observatory: {
        subjectSelector: [
            "prox"
        ],
        probeUrl: "https://www.gstatic.com/generate_204",
        probeInterval: "30s",
        enableConcurrency: true
    },
    stats: {}
};