import { DnsHost, KvSettings, PanelSettings, TelegramBot, WarpAccount } from '#types/settings';
import { extractProxyParams, extractUpstreamParams, getDomain, resolveDNS } from '@utils';
import { fetchWarpAccounts } from '@api/warp';
import { safeError } from '@common';
import { getKvSettings } from '@settings';
import { setCustomDomain } from '@main';

export async function getDataset(env: Env): Promise<{
    settings: KvSettings,
    telegramBot: TelegramBot,
    warpAccounts: WarpAccount[]
}> {
    let settings: KvSettings | null, warpAccounts: WarpAccount[] | null;
    const kvSettings = getKvSettings();

    try {
        settings = await env.kv.get('proxySettings', { type: 'json' });
        warpAccounts = await env.kv.get('warpAccounts', { type: 'json' });
        if (!settings) {
            await env.kv.put('proxySettings', JSON.stringify(kvSettings));
            settings = kvSettings;
        }

        if (!warpAccounts) {
            warpAccounts = await fetchWarpAccounts(env);
        }

        if (VERSION !== settings.panelVersion) {
            settings = await updateDataset(env);
        }

        let telegramBot: TelegramBot | null = await env.kv.get('telegramBot', { type: 'json' });
        if (!telegramBot) {
            telegramBot = { telegramBotToken: '', telegramUserId: '' };
            await env.kv.put('telegramBot', JSON.stringify(telegramBot));
        }

        return {
            settings,
            telegramBot,
            warpAccounts
        };
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting KV: ${safeError(error)}`);
    }
}

export async function updateDataset(env: Env, newSettings?: PanelSettings): Promise<KvSettings> {
    if (!newSettings) {
        const kvSettings = getKvSettings();
        await env.kv.put('proxySettings', JSON.stringify(kvSettings));
        return kvSettings;
    }

    let currentSettings: KvSettings | null;
    const kvSettings = getKvSettings();

    try {
        currentSettings = await env.kv.get('proxySettings', { type: 'json' });
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting current KV settings: ${safeError(error)}`);
    }

    const getParam = async <T extends keyof KvSettings>(
        key: T,
        cbKey?: T,
        callback?: (value: KvSettings[T]) => any | Promise<any>
    ) => {
        const resolve = (k: T) => newSettings?.[k] ?? currentSettings?.[k] ?? kvSettings[k];

        if (callback && cbKey) {
            const cbValue = resolve(cbKey);
            if (cbValue !== currentSettings?.[cbKey]) {
                return callback(cbValue);
            }
        }

        const value = newSettings?.[key] ?? currentSettings?.[key] ?? kvSettings[key];
        return value;
    };

    const fields: Array<
        [keyof KvSettings] |
        [keyof KvSettings, keyof KvSettings, (key: any) => any | Promise<any>]
    > = [
            ['remoteDNS'],
            ['remoteDnsHost', 'remoteDNS', getDnsParams],
            ['localDNS'],
            ['antiSanctionDNS'],
            ['enableIPv6'],
            ['fakeDNS'],
            ['logLevel'],
            ['allowLANConnection'],
            ['customDomain', 'customDomain', setCustomDomain],
            ['upstreamProxy'],
            ['upstreamParams', 'upstreamProxy', extractUpstreamParams],
            ['chainProxy'],
            ['chainProxyParams', 'chainProxy', extractProxyParams],
            ['cleanIPs'],
            ['customCdnAddrs'],
            ['customCdnHost'],
            ['customCdnSni'],
            ['bestPingInterval'],
            ['protocols'],
            ['ports'],
            ['fingerprint'],
            ['enableTFO'],
            ['fragmentMode'],
            ['fragmentLengthMin'],
            ['fragmentLengthMax'],
            ['fragmentDelayMin'],
            ['fragmentDelayMax'],
            ['fragmentMaxSplitMin'],
            ['fragmentMaxSplitMax'],
            ['fragmentPackets'],
            ['enableECH'],
            ['echServerName'],
            ['bypassIran'],
            ['bypassChina'],
            ['bypassRussia'],
            ['bypassOpenAi'],
            ['bypassGoogleAi'],
            ['bypassMicrosoft'],
            ['bypassOracle'],
            ['bypassDocker'],
            ['bypassAdobe'],
            ['bypassEpicGames'],
            ['bypassIntel'],
            ['bypassAmd'],
            ['bypassNvidia'],
            ['bypassAsus'],
            ['bypassHp'],
            ['bypassLenovo'],
            ['blockAds'],
            ['blockPorn'],
            ['blockUDP443'],
            ['blockMalware'],
            ['blockPhishing'],
            ['blockCryptominers'],
            ['customBypassRules'],
            ['customBlockRules'],
            ['customBypassSanctionRules'],
            ['warpRemoteDNS'],
            ['warpEndpoints'],
            ['warpBestPingInterval'],
            ['warpReservedBytes'],
            ['xrayUdpNoises'],
            ['knockerNoiseMode'],
            ['knockerNoiseCountMin'],
            ['knockerNoiseCountMax'],
            ['knockerNoiseSizeMin'],
            ['knockerNoiseSizeMax'],
            ['knockerNoiseDelayMin'],
            ['knockerNoiseDelayMax'],
            ['amneziaNoiseCount'],
            ['amneziaNoiseSizeMin'],
            ['amneziaNoiseSizeMax'],
            ['customSubs'],
            ['remoteSettings'],
            ['customConfigs']
        ];

    try {
        const entries = await Promise.all(
            fields.map(async ([key, callbackKey, callbackFunc]) => {
                return [key, await getParam(key, callbackKey, callbackFunc)];
            })
        );

        const updatedSettings: KvSettings = {
            ...Object.fromEntries(entries),
            panelVersion: VERSION
        };

        await env.kv.put('proxySettings', JSON.stringify(updatedSettings));
        return updatedSettings;
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV: ${safeError(error)}`);
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

import { ZavaliUser } from '#types/settings';
import { createHash } from 'node:crypto';

export async function getUsers(env: Env): Promise<ZavaliUser[]> {
    const users = await env.kv.get('zavaliUsers', { type: 'json' }) as ZavaliUser[] | null;
    return Array.isArray(users) ? users : [];
}

export async function saveUsers(env: Env, users: ZavaliUser[]): Promise<void> {
    await env.kv.put('zavaliUsers', JSON.stringify(users));
}

export async function getActiveUserByCredential(env: Env, kind: 'uuid' | 'password', value: string): Promise<ZavaliUser | null> {
    const users = await getUsers(env);
    const now = Date.now();
    return users.find(u => u.enabled && (!u.expiresAt || new Date(u.expiresAt).getTime() > now) && (kind === 'password' ? (u.password === value || createHash('sha224').update(u.password).digest('hex') === value) : u[kind] === value)) || null;
}

export interface TrafficRecord {
    userId: string;
    sessionId: string;
    upload: number;
    download: number;
    updatedAt: number;
}

const trafficPrefix = (userId: string) => `zavaliTraffic:${userId}:`;

export async function recordTraffic(env: Env, userId: string, sessionId: string, upload: number, download: number): Promise<void> {
    const key = `${trafficPrefix(userId)}${sessionId}`;
    const record: TrafficRecord = { userId, sessionId, upload, download, updatedAt: Date.now() };
    await env.kv.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 365 });
}

export async function getTrafficUsage(env: Env, userId: string): Promise<{ upload: number; download: number; total: number }> {
    let cursor: string | undefined;
    let upload = 0;
    let download = 0;
    do {
        const page = await env.kv.list({ prefix: trafficPrefix(userId), cursor, limit: 1000 });
        const records = await Promise.all(page.keys.map(k => env.kv.get(k.name, { type: 'json' }) as Promise<TrafficRecord | null>));
        for (const r of records) {
            if (r) {
                upload += Number(r.upload) || 0;
                download += Number(r.download) || 0;
            }
        }
        cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    return { upload, download, total: upload + download };
}

export async function getAllTrafficUsage(env: Env, users: ZavaliUser[]): Promise<Record<string, { upload: number; download: number; total: number }>> {
    const result: Record<string, { upload: number; download: number; total: number }> = {};
    await Promise.all(users.map(async u => { result[u.id] = await getTrafficUsage(env, u.id); }));
    return result;
}
