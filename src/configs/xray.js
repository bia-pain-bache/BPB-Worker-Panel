import { getDataset } from '#kv';
import { globalConfig, httpConfig } from '#common/init';
import { settings } from '#common/handlers'
import {
    getConfigAddresses,
    extractWireguardParams,
    base64ToDecimal,
    generateRemark,
    randomUpperCase,
    resolveDNS,
    isDomain,
    isHttps,
    getDomain,
    generateWsPath,
    parseChainProxy
} from '#configs/utils';

async function buildDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp, customDns, customDnsHosts) {
    function buildDnsServer(address, domains, expectIPs, skipFallback, tag) {
        return {
            address,
            ...(domains && { domains }),
            ...(expectIPs && { expectIPs }),
            ...(skipFallback && { skipFallback }),
            ...(tag && { tag })
        };
    }

    const dnsHost = {};
    if (settings.dohHost.isDomain && !isWorkerLess && !isWarp) {
        const { ipv4, ipv6, host } = settings.dohHost;
        dnsHost[host] = settings.VLTRenableIPv6 ? [...ipv4, ...ipv6] : ipv4;
    }

    const routingRules = getGeoRules();
    const blockRules = routingRules.filter(({ type }) => type === 'block');

    settings.customBlockRules.forEach(value => {
        isDomain(value) && blockRules.push({
            rule: true,
            domain: value
        });
    });

    for (const { rule, domain } of blockRules) {
        if (!rule) continue;
        dnsHost[domain] = ["127.0.0.1"];
    }

    const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs, !settings.VLTRenableIPv6) : undefined;

    if (staticIPs) {
        dnsHost[domainToStaticIPs] = [...staticIPs.ipv4, ...staticIPs.ipv6];
    }

    const hosts = Object.keys(dnsHost).length ? { hosts: dnsHost } : {};
    const isIPv6 = (settings.VLTRenableIPv6 && !isWarp) || (settings.warpEnableIPv6 && isWarp);
    const dnsObject = {
        ...hosts,
        servers: [],
        queryStrategy: !isWarp || isIPv6 ? "UseIP" : "UseIPv4",
        tag: "dns",
    };

    let skipFallback = true;
    let finalRemoteDNS = isWarp ? "1.1.1.1" : settings.remoteDNS;

    if (isWorkerLess) {
        if (!dnsObject.hosts) {
            dnsObject.hosts = {};
        }

        finalRemoteDNS = `https://${customDns}/dns-query`;
        dnsObject.hosts[customDns] = customDnsHosts;
        skipFallback = false;
        dnsObject.disableFallbackIfMatch = true;
    }

    const remoteDnsServer = buildDnsServer(finalRemoteDNS, null, null, null, "remote-dns");
    dnsObject.servers.push(remoteDnsServer);

    const bypassRules = routingRules.filter(({ type }) => type === 'direct');

    if (isDomain(customDnsHosts?.[0])) {
        bypassRules.push({
            rule: true,
            domain: `full:${customDnsHosts[0]}`,
            dns: settings.localDNS
        });
    }

    outboundAddrs.forEach(value => {
        isDomain(value) && bypassRules.push({
            rule: true,
            domain: `full:${value}`,
            dns: settings.localDNS
        });
    });

    settings.customBypassRules.forEach(value => {
        isDomain(value) && bypassRules.push({
            rule: true,
            domain: `domain:${value}`,
            dns: settings.localDNS
        });
    });

    settings.customBypassSanctionRules.forEach(value => {
        isDomain(value) && bypassRules.push({
            rule: true,
            domain: `domain:${value}`,
            dns: settings.antiSanctionDNS
        });
    });

    const { host, isHostDomain } = getDomain(settings.antiSanctionDNS);

    if (isHostDomain) {
        bypassRules.push({ rule: true, domain: `full:${host}`, dns: settings.localDNS });
    }

    const totalDomainRules = [];
    const groupedDomainRules = new Map();

    for (const { rule, domain, ip, dns } of bypassRules) {
        if (!rule) continue;

        if (ip) {
            const server = buildDnsServer(dns, [domain], [ip], skipFallback);
            dnsObject.servers.push(server);
        } else {
            if (!groupedDomainRules.has(dns)) groupedDomainRules.set(dns, []);
            groupedDomainRules.get(dns).push(domain);
        }

        if (domain) totalDomainRules.push(domain);
    }

    for (const [dns, domain] of groupedDomainRules) {
        if (domain.length) {
            const server = buildDnsServer(dns, domain, null, skipFallback);
            dnsObject.servers.push(server);
        }
    }

    const isFakeDNS = (settings.VLTRFakeDNS && !isWarp) || (settings.warpFakeDNS && isWarp);

    if (isFakeDNS) {
        const fakeDNSServer = totalDomainRules.length
            ? buildDnsServer("fakedns", totalDomainRules, null, false)
            : "fakedns";
        dnsObject.servers.unshift(fakeDNSServer);
    }

    return dnsObject;
}

function buildRoutingRules(isChain, isBalancer, isWorkerLess, isWarp) {
    const rules = [
        {
            inboundTag: [
                "mixed-in"
            ],
            port: 53,
            outboundTag: "dns-out",
            type: "field"
        },
        {
            inboundTag: [
                "dns-in"
            ],
            outboundTag: "dns-out",
            type: "field"
        }
    ];

    const addRoutingRule = (inboundTag, domain, ip, port, network, protocol, outboundTag, isBalancer) => rules.push({
        ...(inboundTag && { inboundTag }),
        ...(domain && { domain }),
        ...(ip && { ip }),
        ...(port && { port }),
        ...(network && { network }),
        ...(protocol && { protocol: [protocol] }),
        ...(isBalancer
            ? { balancerTag: outboundTag }
            : { outboundTag }),
        type: "field"
    });

    const finallOutboundTag = isChain ? "chain" : isWorkerLess ? "direct" : "proxy";
    const outTag = isBalancer ? isChain ? "all-chains" : "all" : finallOutboundTag;
    const remoteDnsProxy = isBalancer ? "all" : "proxy";

    addRoutingRule(["remote-dns"], null, null, null, null, null, remoteDnsProxy, isBalancer);
    addRoutingRule(["dns"], null, null, null, null, null, "direct");

    addRoutingRule(null, ["geosite:private"], null, null, null, null, "direct");
    addRoutingRule(null, null, ["geoip:private"], null, null, null, "direct");

    if (isWarp && settings.blockUDP443) {
        addRoutingRule(null, null, null, 443, "udp", null, "block");
    }

    if (!isWarp && !isWorkerLess) {
        addRoutingRule(null, null, null, null, "udp", null, "block", null);
    }

    const routingRules = getGeoRules();
    const bypassRules = [
        ...settings.customBypassRules,
        ...settings.customBypassSanctionRules
    ];

    bypassRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'direct',
            domain: isDomainValue ? `domain:${value}` : null,
            ip: isDomainValue ? null : value
        });
    });

    settings.customBlockRules.forEach(value => {
        const isDomainValue = isDomain(value);
        routingRules.push({
            rule: true,
            type: 'block',
            domain: isDomainValue ? `domain:${value}` : null,
            ip: isDomainValue ? null : value
        });
    });

    const groupedRules = new Map();

    for (const { rule, type, ip, domain } of routingRules) {
        if (!rule) continue;
        if (!groupedRules.has(type)) groupedRules.set(type, { domain: [], ip: [] });
        if (domain) groupedRules.get(type).domain.push(domain);
        if (ip) groupedRules.get(type).ip.push(ip);
    }

    for (const [type, rule] of groupedRules) {
        const { domain, ip } = rule;
        if (domain.length) addRoutingRule(null, domain, null, null, null, null, type, null);
        if (ip.length) addRoutingRule(null, null, ip, null, null, null, type, null);
    }

    if (isWorkerLess) {
        addRoutingRule(null, null, null, null, "tcp", "tls", "proxy");
        addRoutingRule(null, null, null, null, "tcp", "http", "http-fragment");
        addRoutingRule(null, null, null, null, "udp", "quic", "udp-noise");
        addRoutingRule(null, null, null, "443,2053,2083,2087,2096,8443", "udp", null, "udp-noise");
    }

    const network = isWarp || isWorkerLess ? "tcp,udp" : "tcp";
    addRoutingRule(null, null, null, null, network, null, outTag, isBalancer);

    return rules;
}

function buildVLOutbound(tag, address, port, host, sni, isFragment, allowInsecure) {
    const path = `${generateWsPath("vl")}?ed=2560`;

    const outbound = {
        protocol: atob('dmxlc3M='),
        settings: {
            vnext: [
                {
                    address: address,
                    port: port,
                    users: [
                        {
                            id: globalConfig.userID,
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
                path,
            }
        },
        tag: tag
    };

    if (isHttps(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: settings.fingerprint,
            alpn: ["http/1.1"],
            serverName: sni
        };
    }

    const sockopt = outbound.streamSettings.sockopt;

    if (isFragment) {
        sockopt.dialerProxy = "fragment";
    } else {
        sockopt.domainStrategy = "UseIP";
        sockopt.tcpFastOpen = true;
        sockopt.happyEyeballs = {
            tryDelayMs: 250,
            prioritizeIPv6: false,
            interleave: 2,
            maxConcurrentTry: 4
        };
    }

    return outbound;
}

function buildTROutbound(tag, address, port, host, sni, isFragment, allowInsecure) {
    const path = `${generateWsPath("tr")}?ed=2560`;

    const outbound = {
        protocol: atob('dHJvamFu'),
        settings: {
            servers: [
                {
                    address: address,
                    port: port,
                    password: globalConfig.TrPass,
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
                path
            }
        },
        tag: tag
    };

    if (isHttps(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: settings.fingerprint,
            alpn: ["http/1.1"],
            serverName: sni
        };
    }

    const sockopt = outbound.streamSettings.sockopt;

    if (isFragment) {
        sockopt.dialerProxy = "fragment";
    } else {
        sockopt.domainStrategy = "UseIP";
        sockopt.tcpFastOpen = true;
        sockopt.happyEyeballs = {
            tryDelayMs: 250,
            prioritizeIPv6: false,
            interleave: 2,
            maxConcurrentTry: 4
        };
    }

    return outbound;
}

function buildWarpOutbound(warpConfigs, endpoint, isWoW, isPro) {
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
    if (!isWoW && isPro && httpConfig.client === 'xray') chain = "udp-noise";

    if (chain) outbound.streamSettings = {
        sockopt: {
            dialerProxy: chain
        }
    };

    if (httpConfig.client === 'xray-knocker' && !isWoW) {
        const {
            knockerNoiseMode,
            noiseCountMin,
            noiseCountMax,
            noiseSizeMin,
            noiseSizeMax,
            noiseDelayMin,
            noiseDelayMax
        } = settings;

        Object.assign(outbound.settings, {
            wnoise: knockerNoiseMode,
            wnoisecount: noiseCountMin === noiseCountMax
                ? String(noiseCountMin)
                : `${noiseCountMin}-${noiseCountMax}`,
            wpayloadsize: noiseSizeMin === noiseSizeMax
                ? String(noiseSizeMin)
                : `${noiseSizeMin}-${noiseSizeMax}`,
            wnoisedelay: noiseDelayMin === noiseDelayMax
                ? String(noiseDelayMin)
                : `${noiseDelayMin}-${noiseDelayMax}`
        });
    }

    return outbound;
}

function buildChainOutbound() {
    const { outProxyParams } = settings;
    const { protocol, security, type, server, port } = outProxyParams;

    const outbound = {
        protocol: protocol,
        mux: {
            enabled: true,
            concurrency: 8,
            xudpConcurrency: 16,
            xudpProxyUDP443: "reject"
        },
        settings: {},
        streamSettings: {
            network: type || "raw",
            security,
            sockopt: {
                dialerProxy: "proxy"
            }
        },
        tag: "chain"
    };

    if ([atob('c29ja3M='), 'http'].includes(protocol)) {
        const { user, pass } = outProxyParams;
        outbound.settings.servers = [
            {
                address: server,
                port,
                users: [
                    {
                        user: user,
                        pass: pass,
                        level: 8
                    }
                ]
            }
        ];

        return outbound;
    }

    if (protocol === atob('c2hhZG93c29ja3M=')) {
        const { password, method } = outProxyParams;
        outbound.settings.servers = [
            {
                address: server,
                method,
                ota: false,
                password,
                port,
                level: 8
            }
        ];

        return outbound;
    }

    if (protocol === atob('dmxlc3M=')) {
        const { uuid, flow } = outProxyParams;
        outbound.settings.vnext = [
            {
                address: server,
                port,
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
        ];
    }

    if (protocol === atob('dHJvamFu')) {
        const { password } = outProxyParams;
        outbound.settings.servers = [
            {
                address: server,
                port,
                password,
                level: 8
            }
        ];
    }

    const {
        sni, fp, alpn, pbk, sid, spx, headerType,
        host, path, authority, serviceName, mode
    } = outProxyParams;

    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        outbound.streamSettings.tlsSettings = {
            allowInsecure: false,
            fingerprint: fp,
            alpn: tlsAlpns,
            serverName: sni
        };
    }

    if (security === 'reality') {
        delete outbound.mux;
        outbound.streamSettings.realitySettings = {
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
        outbound.streamSettings.tcpSettings = {
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

    if (['tcp', 'raw'].includes(type) && security !== 'reality' && !headerType) outbound.streamSettings.rawSettings = {
        header: {
            type: "none"
        }
    };

    if (type === 'ws') outbound.streamSettings.wsSettings = {
        host: host,
        path: path
    };

    if (type === 'httpupgrade') outbound.streamSettings.httpupgradeSettings = {
        host: host,
        path: path
    };

    if (type === 'grpc') {
        delete outbound.mux;
        outbound.streamSettings.grpcSettings = {
            authority: authority,
            multiMode: mode === 'multi',
            serviceName: serviceName
        };
    }

    return outbound;
}

function buildFreedomOutbound(isFragment, isUdpNoises, tag, length, interval) {
    const outbound = {
        tag: tag,
        protocol: "freedom",
        settings: {},
    };

    if (isFragment) {
        const {
            fragmentPackets,
            fragmentLengthMin,
            fragmentLengthMax,
            fragmentIntervalMin,
            fragmentIntervalMax
        } = settings;

        outbound.settings.fragment = {
            packets: fragmentPackets,
            length: length || `${fragmentLengthMin}-${fragmentLengthMax}`,
            interval: interval || `${fragmentIntervalMin}-${fragmentIntervalMax}`,
        };

        outbound.streamSettings = {
            sockopt: {
                tcpFastOpen: true,
                domainStrategy: "UseIP",
                happyEyeballs: {
                    tryDelayMs: 250,
                    prioritizeIPv6: false,
                    interleave: 2,
                    maxConcurrentTry: 4
                }
            }
        };
    }

    if (isUdpNoises) {
        outbound.settings.noises = [];
        const noises = structuredClone(settings.xrayUdpNoises);
        noises.forEach(noise => {
            const count = noise.count;
            delete noise.count;
            outbound.settings.noises.push(...Array.from({ length: count }, () => noise));
        });

        if (!isFragment) {
            outbound.settings.domainStrategy = settings.warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4";
        }
    }

    return outbound;
}

async function buildConfig(
    remark,
    outbounds,
    isBalancer,
    isChain,
    balancerFallback,
    isWarp,
    isWorkerLess,
    outboundAddrs,
    domainToStaticIPs,
    customDns,
    customDnsHosts
) {
    const isFakeDNS = (settings.VLTRFakeDNS && !isWarp) || (settings.warpFakeDNS && isWarp);
    const config = {
        remarks: remark,
        log: {
            loglevel: "warning",
        },
        dns: await buildDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp, customDns, customDnsHosts),
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
                    destOverride: [
                        "http",
                        "tls",
                        ...(isWorkerLess ? ["quic"] : []),
                        ...(isFakeDNS ? ["fakedns"] : [])
                    ],
                    enabled: true,
                    routeOnly: true
                },
                tag: "mixed-in",
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
            ...outbounds,
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
            rules: buildRoutingRules(isChain, isBalancer, isWorkerLess, isWarp),
        },
        stats: {}
    };

    if (isBalancer) {
        const createBalancer = (tag, selector, hasFallback) => {
            return {
                tag,
                selector: [selector],
                strategy: {
                    type: "leastPing",
                },
                ...(hasFallback && { fallbackTag: "proxy-2" })
            };
        }

        config.routing.balancers = [createBalancer("all", "proxy", balancerFallback)];

        if (isChain) {
            const chainBalancer = createBalancer("all-chains", "chain", false)
            config.routing.balancers.push(chainBalancer);
        }

        config.observatory = {
            subjectSelector: isChain ? ["chain", "proxy"] : ["proxy"],
            probeUrl: "https://www.gstatic.com/generate_204",
            probeInterval: `${isWarp
                ? settings.bestWarpInterval
                : settings.bestVLTRInterval
                }s`,
            enableConcurrency: true
        };
    }

    return config;
}

async function addBestPingConfigs(configs, totalAddresses, proxyOutbounds, chainOutbounds, isFragment) {
    const isChain = chainOutbounds.length;
    const chainSign = isChain ? '🔗 ' : '';
    const remark = `💦 ${chainSign}Best Ping 🚀`;
    const outbounds = [
        ...chainOutbounds,
        ...proxyOutbounds
    ];

    if (isFragment) {
        const fragmentOutbound = buildFreedomOutbound(true, false, 'fragment');
        outbounds.push(fragmentOutbound);
    }

    const config = await buildConfig(remark, outbounds, true, isChain, true, false, false, totalAddresses, null);

    if (isChain) {
        await addBestPingConfigs(configs, totalAddresses, proxyOutbounds, [], isFragment);
    }

    configs.push(config);
}

async function addBestFragmentConfigs(configs, chainProxy, outbound) {
    const bestFragValues = [
        '10-20', '20-30', '30-40', '40-50', '50-60', '60-70',
        '70-80', '80-90', '90-100', '10-30', '20-40', '30-50',
        '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'
    ];

    const outbounds = [];

    bestFragValues.forEach((fragLength, index) => {
        if (chainProxy) {
            const chain = structuredClone(chainProxy);
            chain.tag = `chain-${index + 1}`;
            chain.streamSettings.sockopt.dialerProxy = `proxy-${index + 1}`;
            outbounds.push(chain);
        }

        const proxy = structuredClone(outbound);
        proxy.tag = `proxy-${index + 1}`;
        proxy.streamSettings.sockopt.dialerProxy = `fragment-${index + 1}`;
        const fragInterval = `${settings.fragmentIntervalMin}-${settings.fragmentIntervalMax}`;
        const fragment = buildFreedomOutbound(true, false, `fragment-${index + 1}`, fragLength, fragInterval);
        outbounds.push(proxy, fragment);
    });

    const chainSign = chainProxy ? '🔗 ' : '';
    const config = await buildConfig(
        `💦 ${chainSign}Best Fragment 😎`,
        outbounds,
        true,
        chainProxy,
        false,
        false,
        false,
        [],
        httpConfig.hostName
    );

    if (chainProxy) {
        await addBestFragmentConfigs(configs, false, outbound);
    }

    configs.push(config);
}

async function addWorkerlessConfigs(configs) {
    const tlsFragment = buildFreedomOutbound(true, false, 'proxy');
    const udpNoise = buildFreedomOutbound(false, true, 'udp-noise');
    const httpFragment = buildFreedomOutbound(true, false, 'http-fragment');
    httpFragment.settings.fragment.packets = "1-1";
    const outbounds = [
        tlsFragment,
        httpFragment,
        udpNoise
    ];

    const cfDnsConfig = await buildConfig(`💦 1 - Workerless ⭐`, outbounds, false, false, false, false, true, [], false, "cloudflare-dns.com", ["cloudflare.com"]);
    const googleDnsConfig = await buildConfig(`💦 2 - Workerless ⭐`, outbounds, false, false, false, false, true, [], false, "dns.google", ["8.8.8.8", "8.8.4.4"]);
    configs.push(cfDnsConfig, googleDnsConfig);
}

export async function getXrCustomConfigs(env, isFragment) {
    let chainProxy;

    if (settings.outProxy) {
        chainProxy = await parseChainProxy(env, buildChainOutbound);
    }


    const Addresses = await getConfigAddresses(isFragment);
    const totalPorts = settings.ports.filter(port => isFragment ? isHttps(port) : true);
    const protocols = [
        ...(settings.VLConfigs ? [atob('VkxFU1M=')] : []),
        ...(settings.TRConfigs ? [atob('VHJvamFu')] : [])
    ];

    const configs = [];
    const proxies = [], chains = [];
    let index = 1;

    const fragment = isFragment
        ? [buildFreedomOutbound(true, false, 'fragment')]
        : [];

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const addr of Addresses) {
                const isCustomAddr = settings.customCdnAddrs.includes(addr) && !isFragment;
                const sni = isCustomAddr ? settings.customCdnSni : randomUpperCase(httpConfig.hostName);
                const host = isCustomAddr ? settings.customCdnHost : httpConfig.hostName;
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';

                const outbound = protocol === atob('VkxFU1M=')
                    ? buildVLOutbound('proxy', addr, port, host, sni, isFragment, isCustomAddr)
                    : buildTROutbound('proxy', addr, port, host, sni, isFragment, isCustomAddr);

                const outbounds = [
                    outbound,
                    ...fragment
                ];

                const proxy = structuredClone(outbound);
                proxy.tag = `proxy-${index}`
                proxies.push(proxy);

                const remark = generateRemark(protocolIndex, port, addr, protocol, configType, false);
                const config = await buildConfig(remark, outbounds, false, false, false, false, false, [addr], null);
                configs.push(config);

                if (chainProxy) {
                    const remark = generateRemark(protocolIndex, port, addr, protocol, configType, true);
                    const chainConfig = await buildConfig(remark, [chainProxy, ...outbounds], false, true, false, false, false, [addr], null);
                    configs.push(chainConfig);

                    const chain = structuredClone(chainProxy);
                    chain.tag = `chain-${index}`;
                    chain.streamSettings.sockopt.dialerProxy = `proxy-${index}`;
                    chains.push(chain);
                }

                protocolIndex++;
                index++;
            }
        }
    }

    await addBestPingConfigs(configs, Addresses, proxies, chains, isFragment);

    if (isFragment) {
        await addBestFragmentConfigs(configs, chainProxy, proxies[0]);
        await addWorkerlessConfigs(configs);
    }

    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

export async function getXrWarpConfigs(request, env, isPro, isKnocker) {
    const { warpConfigs } = await getDataset(request, env);
    const proIndicator = isPro ? ' Pro ' : ' ';
    const configs = [];
    const proxies = [], chains = []
    const udpNoise = isPro && !isKnocker
        ? [buildFreedomOutbound(false, true, 'udp-noise')]
        : [];

    for (const [index, endpoint] of settings.warpEndpoints.entries()) {
        const warpOutbounds = [...udpNoise];
        const wowOutbounds = [...udpNoise];
        const endpointHost = endpoint.split(':')[0];

        const warpOutbound = buildWarpOutbound(warpConfigs, endpoint, false, isPro);
        const wowOutbound = buildWarpOutbound(warpConfigs, endpoint, true, isPro);

        warpOutbounds.unshift(warpOutbound);
        wowOutbounds.unshift(wowOutbound, warpOutbound);

        const warpConfig = await buildConfig(`💦 ${index + 1} - Warp${proIndicator}🇮🇷`, warpOutbounds, false, false, false, true, false, [endpointHost], null);
        configs.push(warpConfig);
        
        const wowConfig = await buildConfig(`💦 ${index + 1} - WoW${proIndicator}🌍`, wowOutbounds, false, true, false, true, false, [endpointHost], null);
        configs.push(wowConfig);

        const proxy = structuredClone(warpOutbound);
        proxy.tag = `proxy-${index + 1}`;
        proxies.push(proxy);

        const chain = structuredClone(wowOutbound);
        chain.tag = `chain-${index + 1}`;
        chain.streamSettings.sockopt.dialerProxy = `proxy-${index + 1}`;
        chains.push(chain);
    }

    const outboundDomains = settings.warpEndpoints.map(endpoint => endpoint.split(':')[0]).filter(address => isDomain(address));
    const warpBestPingOutbounds = [...proxies, ...udpNoise];
    const wowBestPingOutbounds = [...chains, ...proxies, ...udpNoise];

    const warpBestPing = await buildConfig(`💦 Warp${proIndicator}- Best Ping 🚀`, warpBestPingOutbounds, true, false, false, true, false, outboundDomains, null);
    const wowBestPing = await buildConfig(`💦 WoW${proIndicator}- Best Ping 🚀`, wowBestPingOutbounds, true, true, false, true, false, outboundDomains, null);
    configs.push(warpBestPing, wowBestPing);

    return new Response(JSON.stringify(configs, null, 4), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store',
            'CDN-Cache-Control': 'no-store'
        }
    });
}

function getGeoRules() {
    return [
        { rule: settings.blockAds, type: 'block', domain: "geosite:category-ads-all" },
        { rule: settings.blockAds, type: 'block', domain: "geosite:category-ads-ir" },
        { rule: settings.blockPorn, type: 'block', domain: "geosite:category-porn" },
        { rule: settings.bypassIran, type: 'direct', domain: "geosite:category-ir", ip: "geoip:ir", dns: settings.localDNS },
        { rule: settings.bypassChina, type: 'direct', domain: "geosite:cn", ip: "geoip:cn", dns: settings.localDNS },
        { rule: settings.bypassRussia, type: 'direct', domain: "geosite:category-ru", ip: "geoip:ru", dns: settings.localDNS },
        { rule: settings.bypassOpenAi, type: 'direct', domain: "geosite:openai", dns: settings.antiSanctionDNS },
        { rule: settings.bypassMicrosoft, type: 'direct', domain: "geosite:microsoft", dns: settings.antiSanctionDNS },
        { rule: settings.bypassOracle, type: 'direct', domain: "geosite:oracle", dns: settings.antiSanctionDNS },
        { rule: settings.bypassDocker, type: 'direct', domain: "geosite:docker", dns: settings.antiSanctionDNS },
        { rule: settings.bypassAdobe, type: 'direct', domain: "geosite:adobe", dns: settings.antiSanctionDNS },
        { rule: settings.bypassEpicGames, type: 'direct', domain: "geosite:epicgames", dns: settings.antiSanctionDNS },
        { rule: settings.bypassIntel, type: 'direct', domain: "geosite:intel", dns: settings.antiSanctionDNS },
        { rule: settings.bypassAmd, type: 'direct', domain: "geosite:amd", dns: settings.antiSanctionDNS },
        { rule: settings.bypassNvidia, type: 'direct', domain: "geosite:nvidia", dns: settings.antiSanctionDNS },
        { rule: settings.bypassAsus, type: 'direct', domain: "geosite:asus", dns: settings.antiSanctionDNS },
        { rule: settings.bypassHp, type: 'direct', domain: "geosite:hp", dns: settings.antiSanctionDNS },
        { rule: settings.bypassLenovo, type: 'direct', domain: "geosite:lenovo", dns: settings.antiSanctionDNS },
    ];
}