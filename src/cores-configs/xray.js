import { getConfigAddresses, extractWireguardParams, base64ToDecimal, generateRemark, randomUpperCase, getRandomPath, resolveDNS, isDomain, getDomain } from './helpers';
import { getDataset } from '../kv/handlers';

async function buildXrayDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp) {
    const buildDnsServer = (address, domains, expectIPs, skipFallback, tag) => ({
        address,
        ...(domains && { domains }),
        ...(expectIPs && { expectIPs }),
        ...(skipFallback && { skipFallback }),
        ...(tag && { tag })
    });

    const dnsHost = {};
    if (dohHost.isDomain && !isWorkerLess && !isWarp) {
        const { ipv4, ipv6, host } = dohHost;
        dnsHost[host] = VLTRenableIPv6 ? [...ipv4, ...ipv6] : ipv4;
    }

    const blockRules = [
        { rule: blockAds, host: "geosite:category-ads-all" },
        { rule: blockAds, host: "geosite:category-ads-ir" },
        { rule: blockPorn, host: "geosite:category-porn" }
    ];

    customBlockRules.filter(isDomain).forEach(domain => {
        blockRules.push({ rule: true, host: domain });
    });

    blockRules.filter(({ rule }) => rule).forEach(({ host }) => {
        dnsHost[host] = ["127.0.0.1"];
    });

    const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs) : undefined;
    if (staticIPs) dnsHost[domainToStaticIPs] = VLTRenableIPv6
        ? [...staticIPs.ipv4, ...staticIPs.ipv6]
        : staticIPs.ipv4;

    if (isWorkerLess) dnsHost["cloudflare-dns.com"] = ["cloudflare.com"];

    const hosts = Object.keys(dnsHost).length ? { hosts: dnsHost } : {};
    const isIPv6 = (VLTRenableIPv6 && !isWarp) || (warpEnableIPv6 && isWarp);
    const dnsObject = {
        ...hosts,
        servers: [],
        queryStrategy: isIPv6 ? "UseIP" : "UseIPv4",
        tag: "dns",
    };

    const finalRemoteDNS = isWorkerLess
        ? "https://cloudflare-dns.com/dns-query"
        : isWarp
            ? "1.1.1.1"
            : remoteDNS;

    const remoteDnsServer = buildDnsServer(finalRemoteDNS, null, null, null, "remote-dns");
    dnsObject.servers.push(remoteDnsServer);

    const bypassRules = [
        { rule: bypassIran, domain: "geosite:category-ir", ip: "geoip:ir", dns: localDNS },
        { rule: bypassChina, domain: "geosite:cn", ip: "geoip:cn", dns: localDNS },
        { rule: bypassRussia, domain: "geosite:category-ru", ip: "geoip:ru", dns: localDNS },
        { rule: bypassOpenAi, domain: "geosite:openai", dns: antiSanctionDNS },
        { rule: bypassGoogle, domain: "geosite:google", dns: antiSanctionDNS },
        { rule: bypassMicrosoft, domain: "geosite:microsoft", dns: antiSanctionDNS },
        { rule: bypassOracle, domain: "geosite:oracle", dns: antiSanctionDNS },
        { rule: bypassDocker, domain: "geosite:docker", dns: antiSanctionDNS },
        { rule: bypassIntel, domain: "geosite:intel", dns: antiSanctionDNS },
        { rule: bypassAsus, domain: "geosite:asus", dns: antiSanctionDNS },
        { rule: bypassHp, domain: "geosite:hp", dns: antiSanctionDNS },
    ];

    [...outboundAddrs, ...customBypassRules].filter(isDomain).forEach(domain => {
        const type = outboundAddrs.includes(domain) ? 'full' : 'domain';
        bypassRules.push({ rule: true, domain: `${type}:${domain}`, dns: localDNS });
    });

    const { host, isHostDomain } = getDomain(antiSanctionDNS);
    if (isHostDomain) {
        bypassRules.push({ rule: true, domain: `full:${host}`, dns: localDNS });
    }

    customBypassSanctionRules.filter(isDomain).forEach(domain => {
        bypassRules.push({ rule: true, domain: `domain:${domain}`, dns: antiSanctionDNS });
    });

    isWorkerLess && bypassRules.push({ rule: true, domain: "full:cloudflare.com", dns: localDNS });

    const totalDomainRules = [];
    const groupedDomainRules = new Map();
    bypassRules.filter(({ rule }) => rule).forEach(({ domain, ip, dns }) => {
        if (ip) {
            const server = buildDnsServer(dns, [domain], ip ? [ip] : null, true);
            dnsObject.servers.push(server);
        } else {
            !groupedDomainRules.has(dns) && groupedDomainRules.set(dns, []);
            groupedDomainRules.get(dns).push(domain)
            totalDomainRules.push(domain);
        }
    });

    for (const [dns, domain] of groupedDomainRules) {
        if (domain.length) {
            const server = buildDnsServer(dns, domain, null, true);
            dnsObject.servers.push(server);
        }
    }

    const isFakeDNS = (VLTRFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    if (isFakeDNS) {
        const fakeDNSServer = totalDomainRules.length
            ? buildDnsServer("fakedns", totalDomainRules, null, false)
            : "fakedns";
        dnsObject.servers.unshift(fakeDNSServer);
    }

    return dnsObject;
}

function buildXrayRoutingRules(isChain, isBalancer, isWorkerLess, isWarp) {
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
            port: 53,
            outboundTag: "dns-out",
            type: "field"
        }
    ];

    const addRoutingRule = (inboundTag, domain, ip, port, network, outboundTag, isBalancer) => rules.push({
        ...(inboundTag && { inboundTag: [inboundTag] }),
        ...(domain && { domain }),
        ...(ip && { ip }),
        ...(port && { port }),
        ...(network && { network }),
        ...(isBalancer
            ? { balancerTag: outboundTag }
            : { outboundTag }),
        type: "field"
    });

    const finallOutboundTag = isChain ? "chain" : isWorkerLess ? "fragment" : "proxy";
    const outTag = isBalancer ? "all" : finallOutboundTag;
    addRoutingRule("remote-dns", null, null, null, null, outTag, isBalancer);
    addRoutingRule("dns", null, null, null, null, "direct");
    if (isWarp && blockUDP443) addRoutingRule(null, null, null, 443, "udp", "direct");

    const routingRules = [
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-all" },
        { rule: blockAds, type: 'block', domain: "geosite:category-ads-ir" },
        { rule: blockPorn, type: 'block', domain: "geosite:category-porn" },
        { rule: bypassLAN, type: 'direct', domain: "geosite:private", ip: "geoip:private" },
        { rule: bypassIran, type: 'direct', domain: "geosite:category-ir", ip: "geoip:ir" },
        { rule: bypassChina, type: 'direct', domain: "geosite:cn", ip: "geoip:cn" },
        { rule: bypassRussia, type: 'direct', domain: "geosite:ru", ip: "geoip:ru" },
        { rule: bypassOpenAi, type: 'direct', domain: "geosite:openai" },
        { rule: bypassGoogle, type: 'direct', domain: "geosite:google" },
        { rule: bypassMicrosoft, type: 'direct', domain: "geosite:microsoft" },
        { rule: bypassOracle, type: 'direct', domain: "geosite:oracle" },
        { rule: bypassDocker, type: 'direct', domain: "geosite:docker" },
        { rule: bypassIntel, type: 'direct', domain: "geosite:intel" },
        { rule: bypassAsus, type: 'direct', domain: "geosite:asus" },
        { rule: bypassHp, type: 'direct', domain: "geosite:hp" }
    ];

    [...customBypassRules, ...customBypassSanctionRules].forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'direct',
            domain: isDomainValue ? `domain:${value}` : null,
            ip: isDomainValue ? null : value
        });
    });

    customBlockRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'block',
            domain: isDomainValue ? `domain:${value}` : null,
            ip: isDomainValue ? null : value
        });
    });

    const groupedRules = new Map();
    routingRules.filter(({ rule }) => rule).forEach(({ type, domain, ip }) => {
        !groupedRules.has(type) && groupedRules.set(type, { domain: [], ip: [] });
        domain && groupedRules.get(type).domain.push(domain);
        ip && groupedRules.get(type).ip.push(ip);
    });

    for (const [type, rule] of groupedRules) {
        const { domain, ip } = rule;
        if (domain.length) addRoutingRule(null, domain, null, null, null, type, null);
        if (ip.length) addRoutingRule(null, null, ip, null, null, type, null);
    }

    if (!isWarp && !isWorkerLess) addRoutingRule(null, null, null, null, "udp", "block", null);

    let network;
    if (isBalancer) {
        network = isWarp ? "tcp,udp" : "tcp";
    } else {
        network = isWarp || isWorkerLess ? "tcp,udp" : "tcp";
    }

    addRoutingRule(null, null, null, null, network, outTag, isBalancer);
    return rules;
}

function buildXrayVLOutbound(tag, address, port, host, sni, proxyIPs, isFragment, allowInsecure) {
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
    if (!isWoW && client === 'xray-pro') chain = "udp-noise";

    if (chain) outbound.streamSettings = {
        sockopt: {
            dialerProxy: chain
        }
    };

    if (client === 'xray-knocker' && !isWoW) {
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

    config.routing.rules = buildXrayRoutingRules(isChain, isBalancer, isWorkerLess, isWarp);

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
    let chainProxy;
    if (outProxy) {
        try {
            chainProxy = buildXrayChainOutbound(outProxyParams, VLTRenableIPv6);
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
                const isCustomAddr = customCdnAddrs.includes(addr) && !isFragment;
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