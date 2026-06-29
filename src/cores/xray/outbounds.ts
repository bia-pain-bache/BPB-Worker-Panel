import {
    base64ToDecimal,
    isHttps,
    generateWsPath,
    toRange,
    selectSniHost
} from '@utils';
import { getActiveIdentity } from '@users/auth';

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
    Transport,
    FinalMask,
    FragmentPacket
} from '#types/xray';

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
    packets?: FragmentPacket
): Outbound {
    const { enableTFO, enableIPv6 } = globalThis.settings;
    const freedomSettings: FreedomSettings = {
        domainStrategy: isFragment ? undefined : enableIPv6 ? "UseIPv4v6" : "UseIPv4"
    };

    const streamSettings: StreamSettings = {
        sockopt: isFragment ? buildSockopt(true, enableTFO, "UseIP") : undefined,
        finalmask: buildFinalMask(isFragment, isUdpNoises, length, interval, packets)
    };

    return {
        protocol: "freedom",
        settings: freedomSettings,
        streamSettings,
        tag
    } satisfies Outbound;
}

export function buildWebsocketOutbound(
    tag: string,
    protocol: string,
    address: string,
    port: number,
    isFragment: boolean,
    fragLength?: string,
    fragInterval?: string
): Outbound {
    const {
        settings: {
            fingerprint,
            enableTFO,
            enableECH,
            echServerName,
            upstreamParams: { upstreamServer }
        },
        dict: { _VL_ }
    } = globalThis;
    const { uuid: userID, trojanPassword: TrPass } = getActiveIdentity();

    const isTLS = isHttps(port) || address === upstreamServer;
    const { host, sni } = selectSniHost(address);
    const tlsSettings = isTLS ? buildTlsSettings(
        sni,
        fingerprint,
        "http/1.1",
        enableECH && !isFragment,
        echServerName || undefined,
    ) : undefined;

    const streamSettings: StreamSettings = {
        network: "ws",
        ...buildTransport("ws", "none", `${generateWsPath(protocol)}?ed=2560`, host),
        security: isTLS ? "tls" : "none",
        tlsSettings,
        sockopt: buildSockopt(true, enableTFO, "UseIP"),
        finalmask: buildFinalMask(isFragment, false, fragLength, fragInterval)
    };

    if (protocol === _VL_) return buildOutbound<VlessSettings>(protocol, tag, false, {
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

    return buildOutbound<TrojanSettings>(protocol, tag, false, {
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
    isPro: boolean,
    isKnocker: boolean
): Outbound {
    const { warpIPv6, reserved, publicKey, privateKey } = warpAccount;
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

    const streamSettings: StreamSettings = {};
    if (isWoW) {
        streamSettings.sockopt = buildSockopt(false, false, undefined, "proxy");
    } else if (isPro) {
        if (isKnocker) {
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

        } else {
            streamSettings.finalmask = buildFinalMask(false, isPro)
        }
    }

    return {
        protocol: "wireguard",
        settings: wgSettings,
        streamSettings: streamSettings.omitEmpty(),
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
        tlsSettings: security === 'tls' ? buildTlsSettings(sni || address, fp, alpn, false, undefined) : undefined,
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
    enableECH: boolean,
    echServerName?: string
): TlsSettings {
    const { localDNS } = globalThis.settings;
    const echQueryDNS = localDNS === "localhost" ? "8.8.8.8" : localDNS

    return {
        serverName,
        fingerprint: fingerprint,
        alpn: alpn?.split(','),
        echConfigList: enableECH
            ? echServerName
                ? `${echServerName}+udp://${echQueryDNS}`
                : `udp://${echQueryDNS}`
            : undefined
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

function buildUDPNoises(panelNoises: XrUdpNoise[]): Noise[] {
    return panelNoises.flatMap(({ type, packet, delay, count }) => {
        const noise: Noise = type === "rand"
            ? {
                rand: packet,
                randRange: "0-255",
                delay
            }
            : {
                type,
                packet: type === "array" ? packet.split(",").map(Number) : packet,
                delay
            };

        return Array.from({ length: count }, () => noise);
    });
}

function buildFinalMask(
    isFragment: boolean,
    isUdpNoise: boolean,
    fragLength?: string,
    fragDelay?: string,
    fragPacket?: FragmentPacket
): FinalMask | undefined {
    if (!isFragment && !isUdpNoise) return;
    const {
        settings: {
            fragmentPackets,
            fragmentLengthMin,
            fragmentLengthMax,
            fragmentIntervalMin,
            fragmentIntervalMax,
            fragmentMaxSplitMin,
            fragmentMaxSplitMax,
            xrayUdpNoises
        }
    } = globalThis;

    return {
        tcp: isFragment ? [
            {
                type: "fragment",
                settings: {
                    packets: fragPacket || fragmentPackets,
                    length: fragLength || toRange(fragmentLengthMin, fragmentLengthMax) as string,
                    delay: fragDelay || toRange(fragmentIntervalMin, fragmentIntervalMax) as string,
                    maxSplit: toRange(fragmentMaxSplitMin, fragmentMaxSplitMax)
                }
            }
        ] : undefined,
        udp: isUdpNoise ? [
            {
                type: "noise",
                settings: {
                    reset: "30-60",
                    noise: buildUDPNoises(xrayUdpNoises)
                }
            }
        ] : undefined
    }
}