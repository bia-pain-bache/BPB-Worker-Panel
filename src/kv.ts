import { fetchWarpAccounts } from '@warp';
import { getDomain, parseHostPort, resolveDNS } from '@utils';
import { base64DecodeUtf8, safeErrorMessage } from '@common';

export async function getDataset(
    request: Request,
    env: Env
): Promise<{ settings: Settings; warpAccounts: WarpAccount[] }> {
    const { httpConfig: { panelVersion }, settings } = globalThis;
    let proxySettings: Settings | null;
    let warpAccounts: WarpAccount[] | null;

    try {
        proxySettings = await env.kv.get("proxySettings", { type: 'json' });
        warpAccounts = await env.kv.get('warpAccounts', { type: 'json' });

        if (!proxySettings) {
            await env.kv.put("proxySettings", JSON.stringify(settings));
            proxySettings = settings;
        }

        if (!warpAccounts) {
            warpAccounts = await fetchWarpAccounts(env);
        }

        if (panelVersion !== proxySettings.panelVersion) {
            proxySettings = await updateDataset(request, env);
        }

        return { settings: proxySettings, warpAccounts };
    } catch (error) {
        console.error(error);
        throw new Error(`An error occurred while getting KV: ${safeErrorMessage(error)}`);
    }
}

export async function updateDataset(request: Request, env: Env): Promise<Settings> {
    const { settings, httpConfig: { panelVersion } } = globalThis;
    const newSettings: Settings | null = request.method === 'PUT' ? await request.json() : null;
    let currentSettings: Settings | null;

    try {
        currentSettings = await env.kv.get("proxySettings", { type: 'json' });
    } catch (error) {
        console.error(error);
        throw new Error(`An error occurred while getting current KV settings: ${safeErrorMessage(error)}`);
    }

    const getParam = async <T extends keyof Settings>(
        field: keyof Settings,
        callback?: (value: Settings[T]) => Settings[T] | Promise<Settings[T]>
    ): Promise<Settings[T]> => {
        const value = (newSettings?.[field] ?? currentSettings?.[field] ?? settings[field]) as Settings[T];
        return callback ? await callback(value) : value;
    };

    type FieldSpec =
        | [keyof Settings]
        | [keyof Settings, keyof Settings, (value: never) => unknown];

    const fields: FieldSpec[] = [
        ["remoteDNS"],
        ["remoteDnsHost", "remoteDNS", getDnsParams as never],
        ["localDNS"],
        ["antiSanctionDNS"],
        ["enableIPv6"],
        ["fakeDNS"],
        ["logLevel"],
        ["allowLANConnection"],
        ["proxyIPMode"],
        ["proxyIPs"],
        ["prefixes"],
        ["upstreamProxy"],
        ["upstreamParams", "upstreamProxy", extractUpstreamParams as never],
        ["outProxy"],
        ["outProxyParams", "outProxy", extractProxyParams as never],
        ["cleanIPs"],
        ["customCdnAddrs"],
        ["customCdnHost"],
        ["customCdnSni"],
        ["bestVLTRInterval"],
        ["VLConfigs"],
        ["TRConfigs"],
        ["ports"],
        ["fingerprint"],
        ["enableTFO"],
        ["fragmentMode"],
        ["fragmentLengthMin"],
        ["fragmentLengthMax"],
        ["fragmentIntervalMin"],
        ["fragmentIntervalMax"],
        ["fragmentMaxSplitMin"],
        ["fragmentMaxSplitMax"],
        ["fragmentPackets"],
        ["enableECH"],
        ["echServerName"],
        ["bypassIran"],
        ["bypassChina"],
        ["bypassRussia"],
        ["bypassOpenAi"],
        ["bypassGoogleAi"],
        ["bypassMicrosoft"],
        ["bypassOracle"],
        ["bypassDocker"],
        ["bypassAdobe"],
        ["bypassEpicGames"],
        ["bypassIntel"],
        ["bypassAmd"],
        ["bypassNvidia"],
        ["bypassAsus"],
        ["bypassHp"],
        ["bypassLenovo"],
        ["blockAds"],
        ["blockPorn"],
        ["blockUDP443"],
        ["blockMalware"],
        ["blockPhishing"],
        ["blockCryptominers"],
        ["customBypassRules"],
        ["customBlockRules"],
        ["customBypassSanctionRules"],
        ["warpRemoteDNS"],
        ["warpEndpoints"],
        ["bestWarpInterval"],
        ["xrayUdpNoises"],
        ["knockerNoiseMode"],
        ["noiseCountMin"],
        ["noiseCountMax"],
        ["noiseSizeMin"],
        ["noiseSizeMax"],
        ["noiseDelayMin"],
        ["noiseDelayMax"],
        ["amneziaNoiseCount"],
        ["amneziaNoiseSizeMin"],
        ["amneziaNoiseSizeMax"],
        ["customSubs"],
        ["customConfigs"]
    ];

    const entries = await Promise.all(
        fields.map(async ([key, callbackKey, callbackFunc]) => {
            return [key, await getParam(callbackKey ?? key, callbackFunc as never)];
        })
    );

    const updatedSettings: Settings = {
        ...(Object.fromEntries(entries) as Omit<Settings, 'panelVersion'>),
        panelVersion
    };

    try {
        await env.kv.put("proxySettings", JSON.stringify(updatedSettings));
        return updatedSettings;
    } catch (error) {
        console.error(error);
        throw new Error(`An error occurred while updating KV: ${safeErrorMessage(error)}`);
    }
}

async function getDnsParams(dns: string): Promise<DnsHost> {
    const { host, isHostDomain } = getDomain(dns);
    const dohHost: DnsHost = { host, isDomain: isHostDomain, ipv4: [], ipv6: [] };

    if (isHostDomain) {
        const { ipv4, ipv6 } = await resolveDNS(host);
        dohHost.ipv4 = ipv4;
        dohHost.ipv6 = ipv6;
    }

    return dohHost;
}

function extractProxyParams(chainProxy: string): OutProxyParams {
    if (!chainProxy) return {};

    const { _SS_, _TR_, _VL_, _VM_ } = globalThis.dict;
    let url: URL;

    try {
        url = new URL(chainProxy);
    } catch {
        console.warn('Invalid chain proxy URL, skipping param extraction.');
        return {};
    }

    const protocol = url.protocol.slice(0, -1);
    const stdProtocol = protocol === "ss" ? _SS_ : protocol.replace("socks5", "socks");

    if (stdProtocol === _VM_) {
        const base64 = chainProxy.replace(/^vmess:\/\//, '');
        let config: Record<string, string>;

        try {
            config = JSON.parse(base64DecodeUtf8(base64));
        } catch {
            console.warn('Failed to parse VMess config base64.');
            return {};
        }

        return {
            protocol: stdProtocol,
            uuid: config.id,
            server: config.add,
            port: +config.port,
            aid: +config.aid,
            type: config.net,
            headerType: config.type as "http" | "none" | undefined,
            serviceName: config.path,
            authority: config.authority,
            path: config.path || undefined,
            host: config.host || undefined,
            security: config.tls as "tls" | "reality" | "none" | undefined,
            sni: config.sni,
            fp: config.fp,
            alpn: config.alpn || undefined
        };
    }

    const configParams: OutProxyParams = {
        protocol: stdProtocol,
        server: url.hostname,
        port: +url.port
    };

    const parseParams = (queryParams: boolean, customParams: Partial<OutProxyParams>): OutProxyParams => {
        if (queryParams) {
            for (const [key, value] of url.searchParams) {
                (configParams as Record<string, unknown>)[key] = value || undefined;
            }
        }
        return { ...configParams, ...customParams };
    };

    switch (stdProtocol) {
        case _VL_:
            return parseParams(true, { uuid: url.username });

        case _TR_:
            return parseParams(true, { password: url.username });

        case _SS_: {
            const auth = base64DecodeUtf8(url.username);
            const [first, ...rest] = auth.split(':');
            return parseParams(true, {
                method: first,
                password: rest.join(':')
            });
        }

        case 'socks':
        case 'http': {
            let user: string | undefined;
            let pass: string | undefined;

            try {
                const userInfo = base64DecodeUtf8(url.username);
                if (userInfo.includes(":")) {
                    [user, pass] = userInfo.split(":");
                }
            } catch {
                user = url.username || undefined;
                pass = url.password || undefined;
            }

            return parseParams(false, {
                user: user || undefined,
                pass: pass || undefined
            });
        }

        default:
            return {};
    }
}

function extractUpstreamParams(upstreamProxy: string): UpstreamProxy {
    if (!upstreamProxy) return { upstreamServer: undefined, upstreamPort: undefined };
    const { host: upstreamServer, port: upstreamPort } = parseHostPort(upstreamProxy, true);
    return {
        upstreamServer: upstreamServer || undefined,
        upstreamPort: upstreamPort || undefined
    };
}