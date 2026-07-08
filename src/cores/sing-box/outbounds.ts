import { WarpAccount } from '#types/settings';
import { getSettings } from '@settings';
import {
    isHttps,
    base64ToDecimal,
    generateWsPath,
    parseHostPort,
    selectSniHost,
    isDomain
} from '@utils';

import {
    BaseOutbound,
    HttpOutbound,
    SocksOutbound,
    ShadowsocksOutbound,
    VlessOutbound,
    TrojanOutbound,
    WireguardEndpoint,
    VmessOutbound,
    HttpTransport,
    WsTransport,
    GrpcTransport,
    TLS,
    Transport,
    HttpupgradeTransport,
    TransportType,
    Fingerprint,
    URLTest,
    ChainOutbound
} from '#types/sing-box';

function buildOutbound<T>(
    tag: string,
    type: string,
    server: string,
    server_port: number,
    tcp_fast_open: boolean,
    fields: Omit<T, keyof BaseOutbound>,
    tls?: TLS,
    transport?: Transport,
    isChain?: boolean
): T {
    return {
        tag,
        type,
        server,
        server_port,
        tcp_fast_open,
        ...fields,
        tls,
        transport,
        domain_resolver: isDomain(server) ? (isChain ? 'dns-remote' : 'dns-direct') : undefined
    } as T;
}

export function buildWebsocketOutbound(
    protocol: string,
    remark: string,
    address: string,
    port: number,
    domain: string,
    isFragment: boolean
): VlessOutbound | TrojanOutbound {
    const {
        vlUUID,
        trPass,
        fingerprint,
        enableTFO,
        enableECH,
        echServerName,
        upstreamParams: { upstreamServer }
    } = getSettings();

    const { host, sni, allowInsecure } = selectSniHost(address, domain);
    const transport = buildTransport('ws', 'none', generateWsPath(protocol), host, undefined, 2560);
    const tls = isHttps(port) || address === upstreamServer
        ? buildTLS(
            'tls',
            isFragment,
            allowInsecure,
            sni,
            enableECH && !isFragment,
            echServerName || undefined,
            'http/1.1',
            fingerprint
        ) : undefined;

    if (protocol === _VL_) return buildOutbound<VlessOutbound>(remark, protocol, address, port, enableTFO, {
        uuid: vlUUID,
        packet_encoding: '',
        network: 'tcp'
    }, tls, transport);

    return buildOutbound<TrojanOutbound>(remark, protocol, address, port, enableTFO, {
        password: trPass,
        network: 'tcp'
    }, tls, transport);
}

export function buildWarpOutbound(
    warpAccount: WarpAccount,
    remark: string,
    endpoint: string,
    chain?: string
): WireguardEndpoint {
    const { host, port } = parseHostPort(endpoint, false);
    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = warpAccount;

    const address = chain ? '162.159.192.1' : host;
    return {
        tag: remark,
        detour: chain || undefined,
        type: 'wireguard',
        address: [
            '172.16.0.2/32',
            warpIPv6
        ],
        mtu: 1280,
        peers: [
            {
                address,
                port: chain ? 2408 : port,
                public_key: publicKey,
                reserved: base64ToDecimal(reserved),
                allowed_ips: [
                    '0.0.0.0/0',
                    '::/0'
                ],
                persistent_keepalive_interval: 5
            }
        ],
        private_key: privateKey,
        domain_resolver: isDomain(address) ? 'dns-direct' : undefined
    } satisfies WireguardEndpoint;
}

export function buildChainOutbound(): ChainOutbound | undefined {
    const {
        chainProxy,
        chainProxyParams: {
            protocol, server, port, user,
            pass, password, method, uuid,
            flow, security, type, sni, fp,
            host, path, alpn, pbk, sid,
            headerType, serviceName, aid
        }
    } = getSettings();

    const { searchParams } = new URL(chainProxy);
    const ed = searchParams.get('ed');
    const earlyData = ed ? +ed : undefined;

    const tls = buildTLS(security, false, false, sni || server, false, undefined, alpn, fp, pbk, sid);
    const transport = buildTransport(type, headerType, path, host, serviceName, earlyData);

    switch (protocol) {
        case 'http':
            return buildOutbound<HttpOutbound>('', protocol, server, port, false, {
                username: user,
                password: pass
            }, undefined, undefined, true);

        case 'socks':
            return buildOutbound<SocksOutbound>('', protocol, server, port, false, {
                username: user,
                password: pass,
                version: '5',
                network: 'tcp'
            }, undefined, undefined, true);

        case _SS_:
            return buildOutbound<ShadowsocksOutbound>('', protocol, server, port, false, {
                method,
                password,
                network: 'tcp'
            }, undefined, undefined, true);

        case _VL_:
            return buildOutbound<VlessOutbound>('', protocol, server, port, false, {
                uuid,
                flow,
                network: 'tcp'
            }, tls, transport, true);

        case _VM_:
            return buildOutbound<VmessOutbound>('', protocol, server, port, false, {
                uuid: uuid,
                security: 'auto',
                alter_id: aid,
                network: 'tcp'
            }, tls, transport, true);

        case _TR_:
            return buildOutbound<TrojanOutbound>('', protocol, server, port, false, {
                password: password,
                network: 'tcp'
            }, tls, transport, true);

        default:
            return undefined;
    };
}

export function buildUrlTest(
    tag: string,
    outboundTags: string[],
    isWarp: boolean
): URLTest {
    const { warpBestPingInterval, bestPingInterval } = getSettings();
    return {
        type: 'urltest',
        tag,
        outbounds: outboundTags,
        url: 'https://www.gstatic.com/generate_204',
        interrupt_exist_connections: false,
        interval: isWarp ? `${warpBestPingInterval}s` : `${bestPingInterval}s`
    };
}

function buildTLS(
    security: 'tls' | 'reality' | 'none',
    isFragment: boolean,
    allowInsecure: boolean,
    sni: string,
    enableECH: boolean,
    echServerName?: string,
    alpn?: string,
    fingerprint?: Fingerprint,
    publicKey?: string,
    shortID?: string
): TLS | undefined {
    if (!['tls', 'reality'].includes(security)) return undefined;
    const tlsAlpns = alpn?.split(',').filter(value => value !== 'h2');

    const tls: TLS = {
        enabled: true,
        server_name: sni,
        record_fragment: isFragment,
        insecure: allowInsecure,
        alpn: tlsAlpns,
        utls: {
            enabled: !!fingerprint,
            fingerprint: fingerprint
        },
        ech: enableECH ? {
            enabled: true,
            query_server_name: echServerName
        } : undefined
    };

    if (security === 'tls') return tls;
    if (security === 'reality' && publicKey && shortID) return {
        ...tls,
        reality: {
            enabled: true,
            public_key: publicKey,
            short_id: shortID
        }
    };
}

function buildTransport(
    type: TransportType,
    headerType?: 'http' | 'none',
    path: string = '/',
    host?: string,
    serviceName?: string,
    earlyData?: number
): Transport | undefined {
    path = path?.split('?')[0];

    switch (type) {
        case 'tcp':
            if (headerType === 'http') return {
                type: 'http',
                host: host?.split(','),
                path: path,
                method: 'GET',
                headers: {
                    'Connection': ['keep-alive'],
                    'Content-Type': ['application/octet-stream']
                },
            } satisfies HttpTransport;

            return undefined;

        case 'ws':
            return {
                type: 'ws',
                path: path?.split('?ed=')[0],
                max_early_data: earlyData,
                early_data_header_name: earlyData ? 'Sec-WebSocket-Protocol' : undefined,
                headers: {
                    Host: host
                }
            } satisfies WsTransport;

        case 'httpupgrade':
            return {
                type: 'httpupgrade',
                host: host,
                path: path?.split('?ed=')[0]
            } satisfies HttpupgradeTransport;

        case 'grpc':
            return {
                type: 'grpc',
                service_name: serviceName
            } satisfies GrpcTransport;

        default:
            return undefined;
    }
}