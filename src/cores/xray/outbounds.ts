import {
    base64ToDecimal,
    isHttps,
    generateWsPath
} from '@utils';

import {
    Outbound,
    StreamSettings,
    Sockopt,
    VlSettings,
    TrSettings,
    TlsSettings,
    RealitySettings,
    RawSettings,
    WsSettings,
    HttpupgradeSettings,
    GrpcSettings,
    HttpSocksSettings,
    SsSettings,
    VmSettings,
    Noise,
    FreedomSettings,
    WgSettings,
    Fingerprint,
    TransportType,
    DomainStrategy,
} from 'types/xray';

function buildOutbound<T>(
    protocol: string,
    tag: string,
    address: string,
    port: number,
    enableMux: boolean,
    settings: Omit<T, "address" | "port" | "level">,
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
        settings: {
            address,
            port,
            level: 8,
            ...settings
        } as T,
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
        warpEnableIPv6
    } = globalThis.settings;

    let freedomSettings: FreedomSettings = {};
    let streamSettings: StreamSettings | undefined;

    if (isFragment) {
        freedomSettings = {
            fragment: {
                packets: packets || fragmentPackets,
                length: length || `${fragmentLengthMin}-${fragmentLengthMax}`,
                interval: interval || `${fragmentIntervalMin}-${fragmentIntervalMax}`,
                maxSplit: fragmentMaxSplitMin ? `${fragmentMaxSplitMin}-${fragmentMaxSplitMax}` : undefined
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
                : warpEnableIPv6 ? "UseIPv4v6" : "UseIPv4"
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
    host: string,
    sni: string,
    isFragment: boolean,
    allowInsecure: boolean
): Outbound {
    const {
        settings: { fingerprint, enableTFO },
        globalConfig: { userID, TrPass },
        dict: { _VL_ }
    } = globalThis;

    const isTLS = isHttps(port);
    const streamSettings: StreamSettings = {
        network: "ws",
        security: isTLS ? "tls" : "none",
        tlsSettings: isTLS ? buildTlsSettings(sni, fingerprint, "http/1.1", allowInsecure) : undefined,
        sockopt: isFragment
            ? buildSockopt(false, false, undefined, "fragment")
            : buildSockopt(true, enableTFO, "UseIP"),
    };

    addTransport(streamSettings, "ws", "none", `${generateWsPath(protocol)}?ed=2560`, host);

    if (protocol === _VL_) return buildOutbound<VlSettings>(protocol, "proxy", address, port, false, {
        id: userID!,
        encryption: "none"
    }, streamSettings);

    return buildOutbound<TrSettings>(protocol, "proxy", address, port, false, {
        password: TrPass!
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

    let wgSettings: WgSettings = {
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
            wnoisecount: noiseCountMin === noiseCountMax
                ? String(noiseCountMin)
                : `${noiseCountMin} -${noiseCountMax} `,
            wpayloadsize: noiseSizeMin === noiseSizeMax
                ? String(noiseSizeMin)
                : `${noiseSizeMin} -${noiseSizeMax} `,
            wnoisedelay: noiseDelayMin === noiseDelayMax
                ? String(noiseDelayMin)
                : `${noiseDelayMin} -${noiseDelayMax} `
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
            VLTRenableIPv6,
            outProxyParams: {
                protocol, server, port, user,
                pass, password, method, uuid,
                flow, security, type, sni, fp,
                host, path, alpn, pbk, sid, spx,
                headerType, serviceName, mode,
                authority
            }
        }
    } = globalThis;

    const streamSettings: StreamSettings = {
        network: type || "raw",
        security,
        tlsSettings: security === 'tls' ? buildTlsSettings(sni || server, fp, alpn, false) : undefined,
        realitySettings: security === "reality" ? buildRealitySettings(sni, fp, pbk, sid, spx) : undefined,
        sockopt: buildSockopt(false, false, VLTRenableIPv6 ? "UseIPv4v6" : "UseIPv4", "proxy")
    };

    addTransport(streamSettings, type, headerType, path, host, serviceName, mode, authority);
    const enableMux = !(security === "reality" || type === "grpc");

    switch (protocol) {
        case 'http':
        case 'socks':
            return buildOutbound<HttpSocksSettings>(protocol, "chain", server, port, enableMux, {
                user: user,
                pass: pass
            }, streamSettings);

        case _SS_:
            return buildOutbound<SsSettings>(protocol, "chain", server, port, enableMux, {
                method,
                password,
                ota: false
            }, streamSettings);

        case _VL_:
            return buildOutbound<VlSettings>(protocol, "chain", server, port, enableMux, {
                id: uuid,
                flow: flow,
                encryption: "none"
            }, streamSettings);

        case _VM_:
            return buildOutbound<VmSettings>(protocol, "chain", server, port, enableMux, {
                id: uuid,
                security: "auto"
            }, streamSettings);

        case _TR_:
            return buildOutbound<TrSettings>(protocol, "chain", server, port, enableMux, {
                password
            }, streamSettings);

        default:
            return undefined;
    }
}

function addTransport(
    streamSettings: StreamSettings,
    type: TransportType,
    headerType?: "http" | "none",
    path?: string,
    host?: string,
    serviceName?: string,
    mode?: string,
    authority?: string
) {
    switch (type) {
        case 'tcp':
        case 'raw':
            streamSettings.rawSettings = {
                header: headerType === 'http'
                    ? {
                        type: "http",
                        request: {
                            headers: {
                                "Host": host?.split(',') || [],
                                "Accept-Encoding": ["gzip, deflate"],
                                "Connection": ["keep-alive"],
                                "Pragma": "no-cache"
                            },
                            path: path?.split(',') || ["/"],
                            method: "GET",
                            version: "1.1"
                        }
                    }
                    : { type: "none" }
            } satisfies RawSettings;

            break;

        case 'ws':
            streamSettings.wsSettings = {
                host: host,
                path: path || "/"
            } satisfies WsSettings;

            break;

        case 'httpupgrade':
            streamSettings.httpupgradeSettings = {
                host: host,
                path: path || "/"
            } satisfies HttpupgradeSettings;

            break;

        case 'grpc':
            streamSettings.grpcSettings = {
                authority: authority,
                multiMode: mode === 'multi',
                serviceName: serviceName
            } satisfies GrpcSettings;

            break;

        default:
            break;
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
    allowInsecure: boolean
): TlsSettings {
    return {
        serverName,
        fingerprint: fingerprint,
        alpn: alpn ? alpn.split(',') : undefined,
        allowInsecure
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
