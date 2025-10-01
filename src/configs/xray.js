import { getConfigAddresses, extractWireguardParams, base64ToDecimal, generateRemark, randomUpperCase, resolveDNS, isDomain, getDomain, generateWsPath } from '#configs/utils';
import { getDataset } from '#kv';
import { globalConfig, httpConfig } from '#common/init';
import { settings } from '#common/handlers'

async function buildXrayDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp, customDns, customDnsHosts) {
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

    const routingRules = getRoutingRules();
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

function buildXrayRoutingRules(isChain, isBalancer, isWorkerLess, isWarp) {
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
    const outTag = isBalancer ? "all" : finallOutboundTag;
    const remoteDnsProxy = isBalancer ? "all" : isChain ? "chain" : "proxy";

    addRoutingRule(["remote-dns"], null, null, null, null, null, remoteDnsProxy, isBalancer);
    addRoutingRule(["dns"], null, null, null, null, null, "direct");

    if (settings.bypassLAN) {
        addRoutingRule(null, ["geosite:private"], null, null, null, null, "direct");
        addRoutingRule(null, null, ["geoip:private"], null, null, null, "direct");
    }

    if (isWarp && settings.blockUDP443) {
        addRoutingRule(null, null, null, 443, "udp", null, "block");
    }

    const routingRules = getRoutingRules();
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

    if (!isWarp && !isWorkerLess) {
        addRoutingRule(null, null, null, null, "udp", null, "block", null);
    }

    const network = isWarp || isWorkerLess ? "tcp,udp" : "tcp";
    addRoutingRule(null, null, null, null, network, null, outTag, isBalancer);

    return rules;
}

function buildXrayVLOutbound(tag, address, port, host, sni, isFragment, allowInsecure) {
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

    if (httpConfig.defaultHttpsPorts.includes(port)) {
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

function buildXrayTROutbound(tag, address, port, host, sni, isFragment, allowInsecure) {
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

    if (httpConfig.defaultHttpsPorts.includes(port)) {
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

function buildXrayWarpOutbound(warpConfigs, endpoint, isWoW, isPro) {
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

function buildXrayChainOutbound() {
    const { outProxyParams, VLTRenableIPv6 } = settings;
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
                dialerProxy: "proxy",
                domainStrategy: VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4"
            }
        },
        tag: "chain"
    };

    if (['socks', 'http'].includes(protocol)) {
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

    if (['tcp', 'raw'].includes(type) && security !== 'reality' && !headerType) outbound.streamSettings.tcpSettings = {
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

async function buildXrayConfig(
    remark,
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
    const config = structuredClone(xrayConfigTemp);
    config.remarks = remark;

    config.dns = await buildXrayDNS(outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp, customDns, customDnsHosts);
    config.routing.rules = buildXrayRoutingRules(isChain, isBalancer, isWorkerLess, isWarp);
    const destOverride = config.inbounds[0].sniffing.destOverride;

    if ((settings.VLTRFakeDNS && !isWarp) || (settings.warpFakeDNS && isWarp)) {
        destOverride.push("fakedns");
    }

    if (isWorkerLess) {
        destOverride.push("quic");
    }

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
            probeInterval: `${isWarp
                ? settings.bestWarpInterval
                : settings.bestVLTRInterval
                }s`,
            enableConcurrency: true
        };
    }

    return config;
}

async function buildXrayBestPingConfig(totalAddresses, chainProxy, outbounds, isFragment) {
    const remark = isFragment ? `💦 ${atob('QlBC')} F - Best Ping 💥` : `💦 ${atob('QlBC')} - Best Ping 💥`;
    const config = await buildXrayConfig(remark, true, chainProxy, true, false, false, totalAddresses, null);
    config.outbounds.unshift(...outbounds);

    if (isFragment) {
        const fragmentOutbound = buildFreedomOutbound(true, false, 'fragment');
        config.outbounds.push(fragmentOutbound);
    }

    return config;
}

async function buildXrayBestFragmentConfig(chainProxy, outbound) {
    const bestFragValues = [
        '10-20', '20-30', '30-40', '40-50', '50-60', '60-70',
        '70-80', '80-90', '90-100', '10-30', '20-40', '30-50',
        '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'
    ];

    const config = await buildXrayConfig(
        `💦 ${atob('QlBC')} F - Best Fragment 😎`,
        true,
        chainProxy,
        false,
        false,
        false,
        [],
        httpConfig.hostName
    );

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
        const fragInterval = `${settings.fragmentIntervalMin}-${settings.fragmentIntervalMax}`;
        const fragmentOutbound = buildFreedomOutbound(true, false, `frag-${index + 1}`, fragLength, fragInterval);
        bestFragOutbounds.push(proxy, fragmentOutbound);
    });

    config.outbounds.unshift(...bestFragOutbounds);

    return config;
}

async function buildXrayWorkerLessConfig() {
    const cfDnsConfig = await buildXrayConfig(`💦 ${atob('QlBC')} F - WorkerLess - 1 ⭐`, false, false, false, false, true, [], false, "cloudflare-dns.com", ["cloudflare.com"]);
    const googleDnsConfig = await buildXrayConfig(`💦 ${atob('QlBC')} F - WorkerLess - 2 ⭐`, false, false, false, false, true, [], false, "dns.google", ["8.8.8.8", "8.8.4.4"]);

    const tlsFragment = buildFreedomOutbound(true, false, 'proxy');
    const udpNoise = buildFreedomOutbound(false, true, 'udp-noise');
    const httpFragment = buildFreedomOutbound(true, false, 'http-fragment');
    httpFragment.settings.fragment.packets = "1-1";
    const outbounds = [
        tlsFragment,
        httpFragment,
        udpNoise
    ];

    cfDnsConfig.outbounds.unshift(...outbounds);
    googleDnsConfig.outbounds.unshift(...outbounds);

    return [cfDnsConfig, googleDnsConfig];
}

export async function getXrayCustomConfigs(env, isFragment) {
    let chainProxy;

    if (settings.outProxy) {
        try {
            chainProxy = buildXrayChainOutbound();
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

    const Addresses = await getConfigAddresses(settings.cleanIPs, settings.VLTRenableIPv6, settings.customCdnAddrs, isFragment);
    const totalPorts = settings.ports.filter(port => isFragment ? httpConfig.defaultHttpsPorts.includes(port) : true);

    let protocols = [];
    if (settings.VLConfigs) protocols.push(atob('VkxFU1M='));
    if (settings.TRConfigs) protocols.push(atob('VHJvamFu'));

    let configs = [];
    let outbounds = {
        proxies: [],
        chains: []
    };

    const fragmentOutbound = isFragment
        ? buildFreedomOutbound(true, false, 'fragment')
        : null;

    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts) {
            for (const addr of Addresses) {
                const isCustomAddr = settings.customCdnAddrs.includes(addr) && !isFragment;
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? settings.customCdnSni : randomUpperCase(httpConfig.hostName);
                const host = isCustomAddr ? settings.customCdnHost : httpConfig.hostName;
                const remark = generateRemark(protocolIndex, port, addr, settings.cleanIPs, protocol, configType);
                const customConfig = await buildXrayConfig(remark, false, chainProxy, false, false, false, [addr], null);

                const outbound = protocol === atob('VkxFU1M=')
                    ? buildXrayVLOutbound('proxy', addr, port, host, sni, isFragment, isCustomAddr)
                    : buildXrayTROutbound('proxy', addr, port, host, sni, isFragment, isCustomAddr);

                if (fragmentOutbound) {
                    customConfig.outbounds.push(fragmentOutbound);
                }

                customConfig.outbounds.unshift({ ...outbound });
                outbounds.proxies.push(outbound);

                if (chainProxy) {
                    customConfig.outbounds.unshift(structuredClone(chainProxy));
                    outbounds.chains.push(structuredClone(chainProxy));
                }

                configs.push(customConfig);
                protocolIndex++;
            }
        }
    }

    outbounds.proxies.forEach((outbound, index) => outbound.tag = `prox-${index + 1}`);

    if (chainProxy) outbounds.chains.forEach((outbound, index) => {
        outbound.tag = `chain-${index + 1}`;
        outbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
    });

    const totalOutbounds = [...outbounds.chains, ...outbounds.proxies];
    const bestPing = await buildXrayBestPingConfig(Addresses, chainProxy, totalOutbounds, isFragment);
    const finalConfigs = [...configs, bestPing];

    if (isFragment) {
        const bestFragment = await buildXrayBestFragmentConfig(chainProxy, outbounds.proxies[0]);
        const workerLessConfigs = await buildXrayWorkerLessConfig();
        finalConfigs.push(bestFragment, ...workerLessConfigs);
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

export async function getXrayWarpConfigs(request, env, isPro, isKnocker) {
    const { warpConfigs } = await getDataset(request, env);
    const proIndicator = isPro ? ' Pro ' : ' ';
    const xrayWarpConfigs = [];
    const xrayWoWConfigs = [];
    let udpNoiseOutbound = {};
    const outbounds = {
        proxies: [],
        chains: []
    };

    if (isPro && !isKnocker) {
        udpNoiseOutbound = buildFreedomOutbound(false, true, 'udp-noise');
    }

    for (const [index, endpoint] of settings.warpEndpoints.entries()) {
        const endpointHost = endpoint.split(':')[0];

        const warpConfig = await buildXrayConfig(`💦 ${index + 1} - Warp${proIndicator}🇮🇷`, false, false, false, true, false, [endpointHost], null);
        const WoWConfig = await buildXrayConfig(`💦 ${index + 1} - WoW${proIndicator}🌍`, false, true, false, true, false, [endpointHost], null);

        if (isPro && !isKnocker) {
            warpConfig.outbounds.push(udpNoiseOutbound);
            WoWConfig.outbounds.push(udpNoiseOutbound);
        }

        const warpOutbound = buildXrayWarpOutbound(warpConfigs, endpoint, false, isPro);
        const WoWOutbound = buildXrayWarpOutbound(warpConfigs, endpoint, true, isPro);

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
    const outboundDomains = settings.warpEndpoints.map(endpoint => endpoint.split(':')[0]).filter(address => isDomain(address));

    const xrayWarpBestPing = await buildXrayConfig(`💦 Warp${proIndicator}- Best Ping 🚀`, true, false, false, true, false, outboundDomains, null);
    const xrayWoWBestPing = await buildXrayConfig(`💦 WoW${proIndicator}- Best Ping 🚀`, true, true, false, true, false, outboundDomains, null);

    if (isPro && !isKnocker) {
        xrayWarpBestPing.outbounds.push(udpNoiseOutbound);
        xrayWoWBestPing.outbounds.push(udpNoiseOutbound);
    }

    xrayWarpBestPing.outbounds.unshift(...outbounds.proxies);
    xrayWoWBestPing.outbounds.unshift(...totalOutbounds);

    const configs = [
        ...xrayWarpConfigs,
        ...xrayWoWConfigs,
        xrayWarpBestPing,
        xrayWoWBestPing
    ];

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
            protocol: "mixed",
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

function getRoutingRules() {
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