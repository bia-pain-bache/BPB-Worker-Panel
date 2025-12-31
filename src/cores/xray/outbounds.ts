import {
    base64ToDecimal,
    isHttps,
    generateWsPath,
    toRange,
    selectSniHost
} from '@utils';

import {
    Outbound,
    StreamSettings,
    Sockopt,
    VlessSettings,
    TrojanSettings,
    TlsSettings,
    RealitySettings,
    RawSettings,
    WsSettings,
    HttpupgradeSettings,
    GrpcSettings,
    HttpSocksSettings,
    ShadowsocksSettings,
    VmessSettings,
    Noise,
    FreedomSettings,
    WireguardSettings,
    Fingerprint,
    TransportType,
    DomainStrategy,
    Transport
} from 'types/xray';

function buildOutbound<T>(
    protocol: string,
    tag: string,
    enableMux: boolean,
    settings: T,
    streamSettings?: StreamSettings
): Outbound {
    return {
        protocol,
        mux: enableMux ? {
            enabled: true,
            concurrency: 8,
            xudpConcurrency: 16,
            xudpProxyUDP443: "reject"
        } : undefined,
        settings: settings,
        streamSettings,
        tag
    } as Outbound;
}

export function buildFreedomOutbound(
    isFragment: boolean,
    isUdpNoises: boolean,
    tag: string,
    length?: string,
    interval?: string,
    packets?: "tlshello" | "1-1" | "1-2" | "1-3" | "1-5"
): Outbound {
    const {
        fragmentPackets,
        fragmentLengthMin,
        fragmentLengthMax,
        fragmentIntervalMin,
        fragmentIntervalMax,
        fragmentMaxSplitMin,
        fragmentMaxSplitMax,
        enableTFO,
        xrayUdpNoises,
        enableIPv6
    } = globalThis.settings;

    let freedomSettings: FreedomSettings = {};
    let streamSettings: StreamSettings | undefined;

    if (isFragment) {
        freedomSettings = {
            fragment: {
                packets: packets || fragmentPackets,
                length: length || toRange(fragmentLengthMin, fragmentLengthMax) as string,
                interval: interval || toRange(fragmentIntervalMin, fragmentIntervalMax) as string,
                maxSplit: toRange(fragmentMaxSplitMin, fragmentMaxSplitMax)
            }
        };

        streamSettings = {
            sockopt: buildSockopt(true, enableTFO, "UseIP")
        } satisfies StreamSettings;
    }

    if (isUdpNoises) {
        const freedomNoises: Noise[] = [];
        xrayUdpNoises.forEach((noise: XrUdpNoise) => {
            const { count, ...rest } = noise;
            freedomNoises.push(...Array.from({ length: count }, () => rest));
        });

        freedomSettings = {
            ...freedomSettings,
            noises: freedomNoises,
            domainStrategy: isFragment
                ? undefined
                : enableIPv6 ? "UseIPv4v6" : "UseIPv4"
        };
    }

    return {
        protocol: "freedom",
        settings: freedomSettings,
        streamSettings,
        tag
    } satisfies Outbound;
}

export function buildWebsocketOutbound(
    protocol: string,
    address: string,
    port: number,
    isFragment: boolean
): Outbound {
    const {
        settings: {
            fingerprint,
            enableTFO,
            enableECH,
            echConfig
        },
        globalConfig: { userID, TrPass },
        dict: { _VL_ }
    } = globalThis;

    const isTLS = isHttps(port);
    const { host, sni, allowInsecure } = selectSniHost(address);
    const tlsSettings = isTLS ? buildTlsSettings(
            sni,
            fingerprint,
            "http/1.1",
            allowInsecure,
            enableECH && !isFragment ? echConfig : undefined
        ) : undefined;

    const streamSettings: StreamSettings = {
        network: "ws",
        ...buildTransport("ws", "none", `${generateWsPath(protocol)}?ed=2560`, host),
        security: isTLS ? "tls" : "none",
        tlsSettings,
        sockopt: isFragment
            ? buildSockopt(false, false, undefined, "fragment")
            : buildSockopt(true, enableTFO, "UseIP"),
    };

    if (protocol === _VL_) return buildOutbound<VlessSettings>(protocol, "proxy", false, {
        vnext: [{
            address,
            port,
            users: [
                {
                    id: userID,
                    encryption: "none"
                }
            ]
        }]
    }, streamSettings);

    return buildOutbound<TrojanSettings>(protocol, "proxy", false, {
        servers: [{
            address,
            port,
            password: TrPass
        }]
    }, streamSettings);
}

export function buildWarpOutbound(
    warpAccount: WarpAccount,
    endpoint: string,
    isWoW: boolean,
    isPro: boolean
): Outbound {
    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = warpAccount;
    const { client } = globalThis.httpConfig;

    let wgSettings: WireguardSettings = {
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
    };

    const chain = isWoW
        ? "proxy"
        : isPro && client === 'xray' ? "udp-noise" : "";

    const streamSettings = chain ? {
        sockopt: buildSockopt(false, false, undefined, chain)
    } : undefined;

    if (client === 'xray-knocker' && !isWoW) {
        const {
            knockerNoiseMode,
            noiseCountMin,
            noiseCountMax,
            noiseSizeMin,
            noiseSizeMax,
            noiseDelayMin,
            noiseDelayMax
        } = globalThis.settings;

        wgSettings = {
            ...wgSettings,
            wnoise: knockerNoiseMode,
            wnoisecount: toRange(noiseCountMin, noiseCountMax),
            wpayloadsize: toRange(noiseSizeMin, noiseSizeMax),
            wnoisedelay: toRange(noiseDelayMin, noiseDelayMax)
        };
    }

    return {
        protocol: "wireguard",
        settings: wgSettings,
        streamSettings,
        tag: isWoW ? "chain" : "proxy"
    } satisfies Outbound;
}

export function buildChainOutbound(): Outbound | undefined {
    const {
        dict: { _VL_, _TR_, _SS_, _VM_ },
        settings: {
            outProxyParams: {
                protocol, server: address, port,
                user, pass, password, method, uuid,
                flow, security, type, sni, fp,
                host, path, alpn, pbk, sid, spx,
                headerType, serviceName, mode,
                authority
            }
        }
    } = globalThis;

    const streamSettings: StreamSettings = {
        network: type || "raw",
        ...buildTransport(type, headerType, path, host, serviceName, mode, authority),
        security,
        tlsSettings: security === 'tls' ? buildTlsSettings(sni || address, fp, alpn, false) : undefined,
        realitySettings: security === "reality" ? buildRealitySettings(sni, fp, pbk, sid, spx) : undefined,
        sockopt: buildSockopt(false, false, "UseIPv4", "proxy")
    };

    const enableMux = !(security === "reality" || type === "grpc");

    switch (protocol) {
        case 'http':
        case 'socks':
            return buildOutbound<HttpSocksSettings>(protocol, "chain", enableMux, {
                servers: [{
                    address,
                    port,
                    users: [{
                        user,
                        pass
                    }]
                }]
            }, streamSettings);

        case _SS_:
            return buildOutbound<ShadowsocksSettings>(protocol, "chain", enableMux, {
                servers: [{
                    address,
                    port,
                    method,
                    password
                }]
            }, streamSettings);

        case _VL_:
            return buildOutbound<VlessSettings>(protocol, "chain", enableMux, {
                vnext: [{
                    address,
                    port,
                    users: [{
                        id: uuid,
                        flow: flow,
                        encryption: "none"
                    }]
                }]
            }, streamSettings);

        case _VM_:
            return buildOutbound<VmessSettings>(protocol, "chain", enableMux, {
                vnext: [{
                    address,
                    port,
                    users: [{
                        id: uuid,
                        security: "auto"
                    }]
                }]
            }, streamSettings);

        case _TR_:
            return buildOutbound<TrojanSettings>(protocol, "chain", enableMux, {
                servers: [{
                    address,
                    port,
                    password
                }]
            }, streamSettings);

        default:
            return undefined;
    }
}

function buildTransport(
    type: TransportType,
    headerType?: "http" | "none",
    path: string = "/",
    host?: string,
    serviceName?: string,
    mode?: string,
    authority?: string
): Record<string, Transport> {
    switch (type) {
        case 'tcp':
        case 'raw':
            return {
                rawSettings: {
                    header: headerType === 'http'
                        ? {
                            type: "http",
                            request: {
                                headers: {
                                    "Host": host?.split(','),
                                    "Accept-Encoding": ["gzip, deflate"],
                                    "Connection": ["keep-alive"],
                                    "Pragma": "no-cache"
                                },
                                path: path.split(','),
                                method: "GET",
                                version: "1.1"
                            }
                        }
                        : { type: "none" }
                } satisfies RawSettings
            };

        case 'ws':
            return {
                wsSettings: {
                    host: host,
                    path: path
                } satisfies WsSettings
            };

        case 'httpupgrade':
            return {
                httpupgradeSettings: {
                    host: host,
                    path: path
                } satisfies HttpupgradeSettings
            };

        case 'grpc':
            return {
                grpcSettings: {
                    authority: authority,
                    multiMode: mode === 'multi',
                    serviceName: serviceName
                } satisfies GrpcSettings
            };

        default:
            return {};
    };
}

function buildSockopt(
    enableHappyEyeballs: boolean,
    tcpFastOpen: boolean,
    domainStrategy?: DomainStrategy,
    dialerProxy?: string
): Sockopt {
    return {
        domainStrategy,
        dialerProxy,
        tcpFastOpen: tcpFastOpen || undefined,
        happyEyeballs: enableHappyEyeballs ? {
            tryDelayMs: 250,
            prioritizeIPv6: false,
            interleave: 2,
            maxConcurrentTry: 4
        } : undefined
    };
}

function buildTlsSettings(
    serverName: string,
    fingerprint: Fingerprint,
    alpn: string,
    allowInsecure: boolean,
    echConfigList?: string
): TlsSettings {
    return {
        serverName,
        fingerprint: fingerprint,
        alpn: alpn?.split(','),
        allowInsecure,
        echConfigList
    }
}

function buildRealitySettings(
    serverName: string,
    fingerprint: Fingerprint,
    publicKey: string,
    shortId: string,
    spiderX: string
): RealitySettings {
    return {
        serverName,
        fingerprint: fingerprint,
        publicKey,
        shortId,
        spiderX,
        show: false,
        allowInsecure: false
    }
}