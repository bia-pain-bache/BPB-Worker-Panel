import { isHttps, generateWsPath, parseHostPort, selectSniHost } from '@utils';
import {
    BaseOutbound,
    HttpOutbound,
    SocksOutbound,
    ShadowsocksOutbound,
    VlessOutbound,
    TrojanOutbound,
    WireguardOutbound,
    WsOpts,
    GrpcOpts,
    HttpOpts,
    VmessOutbound,
    TLS,
    Transport,
    AmneziaOpts,
    Network,
    Fingerprint,
    URLTest,
    ChainOutbound
} from 'types/clash';

function buildOutbound<T>(
    name: string,
    type: string,
    server: string,
    port: number,
    isIPv6: boolean,
    tfo: boolean,
    tls: Partial<TLS>,
    transport: Partial<Transport>,
    fields: Omit<T, keyof BaseOutbound | keyof TLS | keyof Transport>,
): T {
    return {
        "name": name,
        "type": type,
        "server": server.replace(/\[|\]/g, ''),
        "port": port,
        "ip-version": isIPv6 ? "ipv4-prefer" : "ipv4",
        "tfo": tfo,
        "udp": false,
        ...fields,
        ...tls,
        ...transport
    } as T;
}

export function buildWebsocketOutbound(
    protocol: string,
    remark: string,
    address: string,
    port: number,
): VlessOutbound | TrojanOutbound | null {
    const {
        dict: { _VL_, _TR_ },
        globalConfig: { userID, TrPass },
        settings: { fingerprint, enableTFO, enableIPv6 }
    } = globalThis;

    const isTLS = isHttps(port);
    if (protocol === _TR_ && !isTLS) return null;
    const { host, sni, allowInsecure } = selectSniHost(address);

    const tls = isTLS ? buildTLS(protocol, "tls", allowInsecure, sni, "http/1.1", fingerprint) : {};
    const transport = buildTransport("ws", undefined, generateWsPath(protocol), host, undefined, 2560);

    if (protocol === _VL_) return buildOutbound<VlessOutbound>(remark, protocol, address, port, enableIPv6, enableTFO, tls, transport, {
        "uuid": userID,
        "packet-encoding": ""
    });

    return buildOutbound<TrojanOutbound>(remark, protocol, address, port, enableIPv6, enableTFO, tls, transport, {
        "password": TrPass
    });
}

export function buildWarpOutbound(
    warpAccount: WarpAccount,
    remark: string,
    endpoint: string,
    chain: string,
    isPro: boolean
): WireguardOutbound {
    const {
        amneziaNoiseCount,
        amneziaNoiseSizeMin,
        amneziaNoiseSizeMax,
        enableIPv6
    } = globalThis.settings;
    
    const { host, port } = parseHostPort(endpoint, false);
    const ipVersion = enableIPv6 ? "ipv4-prefer" : "ipv4";

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = warpAccount;

    return {
        "name": remark,
        "type": "wireguard",
        "ip": "172.16.0.2/32",
        "ipv6": warpIPv6,
        "ip-version": ipVersion,
        "private-key": privateKey,
        "server": chain ? "162.159.192.1" : host,
        "port": chain ? 2408 : port,
        "public-key": publicKey,
        "allowed-ips": ["0.0.0.0/0", "::/0"],
        "reserved": reserved,
        "udp": true,
        "mtu": 1280,
        "dialer-proxy": chain || undefined,
        "amnezia-wg-option": isPro ? {
            "jc": amneziaNoiseCount,
            "jmin": amneziaNoiseSizeMin,
            "jmax": amneziaNoiseSizeMax
        } satisfies AmneziaOpts : undefined
    };
}

export function buildChainOutbound(): ChainOutbound | undefined {
    const {
        dict: { _SS_, _VL_, _TR_, _VM_ },
        settings: {
            outProxy,
            outProxyParams: {
                protocol, server, port, user,
                pass, password, method, uuid,
                flow, security, type, sni, fp,
                host, path, alpn, pbk, sid,
                headerType, serviceName, aid
            }
        }
    } = globalThis;

    const { searchParams } = new URL(outProxy);
    const ed = searchParams.get("ed");
    const earlyData = ed ? +ed : undefined;

    const tls = buildTLS(protocol, security, false, sni || server, alpn, fp, pbk, sid);
    const transport = buildTransport(type, headerType, path, host, serviceName, earlyData);

    switch (protocol) {
        case "http":
            return buildOutbound<HttpOutbound>("", "http", server, port, false, false, {}, {}, {
                "username": user,
                "password": pass
            });

        case "socks":
            return buildOutbound<SocksOutbound>("", "socks5", server, port, false, false, {}, {}, {
                "username": user,
                "password": pass
            });

        case _SS_:
            return buildOutbound<ShadowsocksOutbound>("", "ss", server, port, false, false, {}, {}, {
                "cipher": method,
                "password": password
            });

        case _VL_:
            return buildOutbound<VlessOutbound>("", _VL_, server, port, false, false, tls, transport, {
                "uuid": uuid,
                "flow": flow
            });

        case _VM_:
            return buildOutbound<VmessOutbound>("", _VM_, server, port, false, false, tls, transport, {
                "uuid": uuid,
                "cipher": "auto",
                "alterId": aid
            });

        case _TR_:
            if (security === "none") return undefined;
            return buildOutbound<TrojanOutbound>("", _TR_, server, port, false, false, tls, transport, {
                "password": password
            });

        default:
            return undefined;
    };
}

export function buildUrlTest(
    name: string,
    proxies: string[],
    isWarp: boolean
): URLTest {
    const { bestWarpInterval, bestVLTRInterval } = globalThis.settings;
    return {
        "name": name,
        "type": "url-test",
        "proxies": proxies,
        "url": "https://www.gstatic.com/generate_204",
        "interval": isWarp ? bestWarpInterval : bestVLTRInterval,
        "tolerance": 50
    };
}

function buildTLS(
    protocol: string,
    security: "tls" | "reality" | "none",
    allowInsecure: boolean,
    sni: string,
    alpn?: string,
    fingerprint?: Fingerprint,
    publicKey?: string,
    shortID?: string
): Partial<TLS> {
    if (!["tls", "reality"].includes(security)) return {};
    const { _TR_ } = globalThis.dict;

    const common: TLS = {
        "tls": true,
        [protocol === _TR_ ? "sni" : "servername"]: sni,
        "client-fingerprint": fingerprint === "randomized" ? "random" : fingerprint,
        "skip-cert-verify": allowInsecure
    };

    if (security === "tls") {
        return {
            ...common,
            "alpn": alpn?.split(',')
        };
    } else if (security === "reality" && publicKey && shortID) {
        return {
            ...common,
            "reality-opts": {
                "public-key": publicKey,
                "short-id": shortID
            }
        };
    } else return {};
}

function buildTransport(
    type: Network,
    headerType?: "http" | "none",
    path: string = "/",
    host?: string,
    serviceName?: string,
    earlyData?: number
): Partial<Transport> {
    path = path?.split("?")[0];

    switch (type) {
        case 'tcp':
            return headerType === 'http' ? {
                "network": "http",
                "http-opts": {
                    "method": "GET",
                    "path": path.split(','),
                    "headers": {
                        "Host": host?.split(","),
                        "Connection": ["keep-alive"],
                        "Content-Type": ["application/octet-stream"]
                    }
                } satisfies HttpOpts
            } : {
                "network": "tcp"
            } satisfies Transport;

        case 'ws':
            return {
                "network": "ws",
                "ws-opts": {
                    "path": path,
                    "max-early-data": earlyData,
                    "early-data-header-name": earlyData ? "Sec-WebSocket-Protocol" : undefined,
                    "headers": {
                        "Host": host
                    }
                } satisfies WsOpts
            };

        case 'httpupgrade':
            const { _V2_ } = globalThis.dict;
            return {
                "network": "ws",
                "ws-opts": {
                    [`${_V2_}-http-upgrade`]: true,
                    [`${_V2_}-http-upgrade-fast-open`]: true,
                    "path": path,
                    "headers": {
                        "Host": host
                    }
                } satisfies WsOpts
            };

        case 'grpc':
            return {
                "network": "grpc",
                "grpc-opts": {
                    "grpc-service-name": serviceName
                } satisfies GrpcOpts
            };

        default:
            return {};
    }
}