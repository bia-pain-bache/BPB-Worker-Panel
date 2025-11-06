import { fetchWarpAccounts } from '@warp';
import { getDomain, resolveDNS } from '@utils';
import { base64DecodeUtf8 } from '@common';

export async function getDataset(
    request: Request,
    env: Env
): Promise<{ settings: Settings, warpAccounts: WarpAccount[] }> {
    const { httpConfig: { panelVersion }, settings } = globalThis;
    let proxySettings: Settings | null, warpAccounts: WarpAccount[] | null;

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

        return {
            settings: proxySettings,
            warpAccounts
        };
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`An error occurred while getting KV: ${message}`);
    }
}

export async function updateDataset(request: Request, env: Env): Promise<Settings> {
    const { settings, httpConfig: { panelVersion } } = globalThis;
    const newSettings: Settings | null = request.method === 'PUT' ? await request.json() : null;
    let currentSettings: Settings | null;

    try {
        currentSettings = await env.kv.get("proxySettings", { type: 'json' });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        throw new Error(`An error occurred while getting current KV settings: ${message}`);
    }

    const getParam = async <T extends keyof Settings>(
        field: keyof Settings,
        callback?: (value: Settings[T]) => any | Promise<any>
    ) => {
        const value = newSettings?.[field] ?? currentSettings?.[field] ?? settings[field];
        return callback ? await callback(value) : value;
    };

    const fields: Array<
        [keyof Settings] |
        [keyof Settings, keyof Settings, (key: keyof Settings) => any | Promise<any>]
    > = [
            ["remoteDNS"],
            ["remoteDnsHost", "remoteDNS", getDnsParams],
            ["localDNS"],
            ["antiSanctionDNS"],
            ["enableIPv6"],
            ["fakeDNS"],
            ["logLevel"],
            ["allowLANConnection"],
            ["proxyIPMode"],
            ["proxyIPs"],
            ["prefixes"],
            ["outProxy"],
            ["outProxyParams", "outProxy", extractProxyParams],
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
            ["amneziaNoiseSizeMax"]
        ];

    const entries = await Promise.all(
        fields.map(async ([key, callbackKey, callbackFunc]) => {
            return [key, await getParam(callbackKey ?? key, callbackFunc)];
        })
    );

    const updatedSettings: Settings = {
        ...Object.fromEntries(entries),
        panelVersion: panelVersion
    };

    try {
        await env.kv.put("proxySettings", JSON.stringify(updatedSettings));
        return updatedSettings;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(error);
        throw new Error(`An error occurred while updating KV: ${message}`);
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

function extractProxyParams(chainProxy: string) {
    if (!chainProxy) return {};
    
    const { _SS_, _TR_, _VL_, _VM_ } = globalThis.dict;
    let url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    const stdProtocol = protocol === "ss" ? _SS_ : protocol.replace("socks5", "socks");

    if (stdProtocol === _VM_) {
        const config = JSON.parse(base64DecodeUtf8(url.host));
        return {
            protocol: stdProtocol,
            uuid: config.id,
            server: config.add,
            port: +config.port,
            aid: +config.aid,
            type: config.net,
            headerType: config.type,
            serviceName: config.path,
            authority: config.authority,
            path: config.path || undefined,
            host: config.host || undefined,
            security: config.tls,
            sni: config.sni,
            fp: config.fp,
            alpn: config.alpn || undefined
        };
    }

    const configParams: Record<string, string | number | undefined> = {
        protocol: stdProtocol,
        server: url.hostname,
        port: +url.port
    };

    const parseParams = (queryParams: boolean, customParams: Record<string, string | undefined>) => {
        if (queryParams) {
            for (const [key, value] of url.searchParams) {
                configParams[key] = value || undefined;
            }
        }

        return {
            ...configParams,
            ...customParams
        };
    }

    switch (stdProtocol) {
        case _VL_:
            return parseParams(true, {
                uuid: url.username
            });

        case _TR_:
            return parseParams(true, {
                password: url.username
            });

        case _SS_:
            const auth = base64DecodeUtf8(url.username);
            const [first, ...rest] = auth.split(':');
            return parseParams(true, {
                method: first,
                password: rest.join(':')
            });

        case 'socks':
        case 'http':
            let user, pass;
            try {
                const userInfo = base64DecodeUtf8(url.username);
                if (userInfo.includes(":")) [user, pass] = userInfo.split(":");
            } catch (error) {
                user = url.username;
                pass = url.password;
            }

            return parseParams(false, {
                user: user || undefined,
                pass: pass || undefined
            });

        default:
            return {};
    }
}