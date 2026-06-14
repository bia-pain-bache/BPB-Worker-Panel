interface TgUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
}

interface TgMessage {
    message_id: number;
    from: TgUser;
    chat: { id: number; type: string };
    text?: string;
}

interface TgCallbackQuery {
    id: string;
    from: TgUser;
    message?: { message_id: number; chat: { id: number } };
    data?: string;
}

interface TgUpdate {
    update_id: number;
    message?: TgMessage;
    callback_query?: TgCallbackQuery;
}

interface SubAppInfo {
    app: string;
    supportedApps: string[];
}

interface SubTypeInfo {
    label: string;
    emoji: string;
    apps: SubAppInfo[];
}



const SUB_TYPES: Record<string, SubTypeInfo> = {
    normal: {
        label: 'Normal', emoji: '💠',
        apps: [
            { app: 'xray', supportedApps: ['v2rayNG', 'MahsaNG', 'v2rayN', 'v2rayN-PRO', 'Streisand'] },
            { app: 'sing-box', supportedApps: ['sing-box', 'v2rayN (sing-box)'] },
            { app: 'clash', supportedApps: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash', 'v2rayN (mihomo)'] },
        ]
    },
    fragment: {
        label: 'Fragment', emoji: '🧩',
        apps: [
            { app: 'xray', supportedApps: ['v2rayNG', 'MahsaNG', 'v2rayN', 'v2rayN-PRO', 'Streisand'] },
            { app: 'sing-box', supportedApps: ['sing-box', 'v2rayN (sing-box)'] },
        ]
    },
    raw: {
        label: 'Raw', emoji: '📄',
        apps: [
            { app: 'xray', supportedApps: ['v2rayNG', 'MahsaNG', 'v2rayN', 'v2rayN-PRO', 'Shadowrocket', 'Streisand', 'PassWall'] },
            { app: 'sing-box', supportedApps: ['husi', 'Nekobox', 'Nekoray', 'Hiddify', 'Karing'] },
        ]
    },
    warp: {
        label: 'Warp', emoji: '🌀',
        apps: [
            { app: 'xray', supportedApps: ['v2rayNG', 'v2rayN', 'Streisand'] },
            { app: 'sing-box', supportedApps: ['sing-box', 'v2rayN (sing-box)'] },
            { app: 'clash', supportedApps: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash', 'v2rayN (mihomo)'] },
        ]
    },
    'warp-pro': {
        label: 'Warp Pro', emoji: '🌀',
        apps: [
            { app: 'xray', supportedApps: ['v2rayNG', 'v2rayN', 'Streisand'] },
            { app: 'clash', supportedApps: ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash', 'v2rayN (mihomo)'] },
        ]
    }
};

async function tgFetch(token: string, method: string, body: any): Promise<any> {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

function buildSubUrl(origin: string, subPath: string, type: string, app: string, label?: string): string {
    const base = `${origin}/sub/${type}/${encodeURIComponent(subPath)}?app=${app}`;
    return label ? `${base}#${encodeURIComponent(`💦 BPB ${label}`)}` : base;
}

function mainKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '📥 Get Config', callback_data: 'sub' }],
            [{ text: '📊 Usage', callback_data: 'usage' }],
            [{ text: '⚙️ Settings Info', callback_data: 'info' }]
        ]
    };
}

function typeKeyboard(prefix: string) {
    return {
        inline_keyboard: [
            [{ text: '💠 Normal', callback_data: `${prefix}_normal` }],
            [{ text: '🧩 Fragment', callback_data: `${prefix}_fragment` }],
            [{ text: '📄 Raw', callback_data: `${prefix}_raw` }],
            [{ text: '🌀 Warp', callback_data: `${prefix}_warp` }],
            [{ text: '🌀 Warp Pro', callback_data: `${prefix}_warp-pro` }],
            [{ text: '🔙 Back', callback_data: 'main' }]
        ]
    };
}

function buildSettingsInfo(s: any): string {
    const protocols: string[] = [];
    if (s.VLConfigs) protocols.push('VLESS');
    if (s.TRConfigs) protocols.push('Trojan');
    const ports = Array.isArray(s.ports) ? s.ports.join(', ') : '443';
    const fragActive = s.fragmentMode !== 'custom' || (s.fragmentLengthMin && s.fragmentLengthMax);
    return `⚙️ <b>Settings Info</b>\n\n` +
        `📡 <b>Protocols:</b> ${protocols.join(', ') || 'None'}\n` +
        `🔌 <b>Ports:</b> ${ports}\n` +
        `🌐 <b>Proxy IP Mode:</b> ${s.proxyIPMode || 'proxyip'}\n` +
        `🧩 <b>Fragment:</b> ${fragActive ? '✅ Active' : '❌ Inactive'}`;
}

async function getCfUsageForTelegram(env: Env): Promise<{ success: boolean; text: string; data?: any } | null> {
    const proxySettings: any = await env.kv.get("proxySettings", { type: 'json' });
    if (!proxySettings) return null;

    const { cfAccountId, cfApiToken, cfWorkerName } = proxySettings;
    if (!cfAccountId || !cfApiToken || !cfWorkerName) {
        return { success: false, text: '⚠️ Cloudflare credentials not configured.\nSet them in Panel → Common → Cloudflare Usage Monitor.' };
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        const gqlQuery = {
            query: `{ viewer { accounts(filter: {accountTag: "${cfAccountId}"}) { workersInvocationsAdaptive(limit: 100, filter: { scriptName: "${cfWorkerName}", datetime_geq: "${today}T00:00:00Z", datetime_leq: "${today}T23:59:59Z" }) { sum { requests subrequests errors } } } } }`
        };

        const gqlRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cfApiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gqlQuery)
        });
        const gqlData: any = await gqlRes.json();

        let requestsUsed = 0;
        let subrequestsUsed = 0;
        let errors = 0;

        if (gqlData?.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive) {
            for (const entry of gqlData.data.viewer.accounts[0].workersInvocationsAdaptive) {
                if (entry.sum) {
                    requestsUsed += entry.sum.requests || 0;
                    subrequestsUsed += entry.sum.subrequests || 0;
                    errors += entry.sum.errors || 0;
                }
            }
        }

        const requestsLimit = 100000;
        const observabilityLimit = 200000;
        const reqPct = Math.round((requestsUsed / requestsLimit) * 10000) / 100;
        const obsPct = Math.round(((subrequestsUsed + errors) / observabilityLimit) * 10000) / 100;
        const nearLimit = reqPct > 80 || obsPct > 80;
        const overLimit = reqPct >= 100 || obsPct >= 100;

        const data = {
            requests: { used: requestsUsed, limit: requestsLimit, percent: reqPct },
            observability: { used: subrequestsUsed + errors, limit: observabilityLimit, percent: obsPct },
            nearLimit,
            overLimit
        };

        return { success: true, text: buildUsageText(data), data };
    } catch (error) {
        return { success: false, text: '⚠️ Error fetching usage data. Check your credentials.' };
    }
}

function buildUsageText(data: any): string {
    const fmt = (n: number) => n.toLocaleString();
    const reqPct = data.requests.percent;
    const obsPct = data.observability.percent;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const bar = (pct: number) => {
        const filled = Math.round(pct / 10);
        return '▓'.repeat(Math.min(filled, 10)) + '░'.repeat(Math.max(0, 10 - filled));
    };

    let text = `📊 <b>Cloudflare Workers Usage</b>\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📅 Today: ${today}\n\n`;
    text += `🔵 <b>Requests</b>\n`;
    text += `${fmt(data.requests.used)} / ${fmt(data.requests.limit)} (${reqPct}%)\n`;
    text += `${bar(reqPct)}\n\n`;
    text += `👁 <b>Observability</b>\n`;
    text += `${fmt(data.observability.used)} / ${fmt(data.observability.limit)} (${obsPct}%)\n`;
    text += `${bar(obsPct)}\n\n`;

    if (data.overLimit) {
        text += `🚫 <b>LIMIT EXCEEDED!</b>\n`;
    } else if (data.nearLimit) {
        text += `⚠️ <b>WARNING:</b> Approaching limit!\n`;
        if (reqPct > 80) {
            text += `🔴 Requests: ${fmt(data.requests.used)} / ${fmt(data.requests.limit)} (${reqPct}%)\n`;
        }
        if (obsPct > 80) {
            text += `🔴 Observability: ${fmt(data.observability.used)} / ${fmt(data.observability.limit)} (${obsPct}%)\n`;
        }
    } else {
        text += `✅ All within limits\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━`;
    return text;
}

function usageKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '🔄 Refresh', callback_data: 'usage_refresh' }],
            [{ text: '🔙 Back', callback_data: 'main' }]
        ]
    };
}

async function handleCallback(cq: TgCallbackQuery, token: string, chatId: number, env: Env, origin: string): Promise<void> {
    const data = cq.data || '';

    if (data === 'sub') {
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '📥 <b>Get Config</b>\n\nChoose a configuration type:',
            parse_mode: 'HTML',
            reply_markup: typeKeyboard('type')
        });
    } else if (data === 'qr') {
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '📱 <b>QR Codes</b>\n\nChoose a type:',
            parse_mode: 'HTML',
            reply_markup: typeKeyboard('type')
        });
    } else if (data === 'info') {
        const proxySettings: any = await env.kv.get("proxySettings", { type: 'json' });
        const text = buildSettingsInfo(proxySettings || {});
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '🔙 Back', callback_data: 'main' }]]
            }
        });
    } else if (data === 'usage' || data === 'usage_refresh') {
        const result = await getCfUsageForTelegram(env);
        if (!result) {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '⚠️ Could not fetch usage data.',
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [[{ text: '🔙 Back', callback_data: 'main' }]] }
            });
            return;
        }
        if (!result.success) {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: result.text,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [[{ text: '🔙 Back', callback_data: 'main' }]] }
            });
            return;
        }
        if (data === 'usage_refresh' && cq.message?.message_id) {
            await tgFetch(token, 'editMessageText', {
                chat_id: chatId,
                message_id: cq.message.message_id,
                text: result.text,
                parse_mode: 'HTML',
                reply_markup: usageKeyboard()
            });
        } else {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: result.text,
                parse_mode: 'HTML',
                reply_markup: usageKeyboard()
            });
        }
    } else if (data.startsWith('type_')) {
        const typeKey = data.slice(5);
        const typeInfo = SUB_TYPES[typeKey];
        if (!typeInfo) return;

        const subPath = env.SUB_PATH || env.UUID || '';
        for (const appInfo of typeInfo.apps) {
            const url = buildSubUrl(origin, subPath, typeKey, appInfo.app, typeInfo.label);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=400x400`;
            const supportedList = appInfo.supportedApps.map(a => `✅ ${a}`).join('\n');
            const caption = `${typeInfo.emoji} <b>BPB ${typeInfo.label}</b>\n\n<code>${url}</code>\n\n<b>Supported apps:</b>\n${supportedList}`;

            await tgFetch(token, 'sendPhoto', {
                chat_id: chatId,
                photo: qrUrl,
                caption: caption,
                parse_mode: 'HTML'
            });
        }

        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '🔙 Choose another type or go back:',
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '🔙 Back', callback_data: 'sub' }]]
            }
        });
    }
}

async function checkCfUsageWarning(proxySettings: any, botToken: string, chatId: number, env: Env): Promise<void> {
    if (!proxySettings.cfAccountId || !proxySettings.cfApiToken || !proxySettings.cfWorkerName) return;

    try {
        const now = Date.now();
        const cacheRaw = await env.kv.get('cfUsageCache', { type: 'json' });
        const cache: any = cacheRaw || {};

        let needFetch = true;
        if ((cache as any).data && (cache as any).fetchedAt && (now - (cache as any).fetchedAt < 30 * 60 * 1000)) {
            needFetch = false;
        }

        if (needFetch) {
            const result = await getCfUsageForTelegram(env);
            if (!result || !result.success || !result.data) return;
            await env.kv.put('cfUsageCache', JSON.stringify({ data: result.data, fetchedAt: now }));

            if (result.data.nearLimit) {
                const lastWarningRaw: any = await env.kv.get('cfLastWarning', { type: 'json' });
                const lastWarning: number = lastWarningRaw?.timestamp || 0;
                if (now - lastWarning > 6 * 60 * 60 * 1000) {
                    const warningText = result.data.overLimit
                        ? `🚫 <b>Cloudflare Workers limit exceeded!</b>\n\n${result.text}`
                        : `⚠️ <b>Cloudflare Workers near limit!</b>\n\n${result.text}`;

                    await tgFetch(botToken, 'sendMessage', {
                        chat_id: chatId,
                        text: warningText,
                        parse_mode: 'HTML',
                        reply_markup: usageKeyboard()
                    });
                    await env.kv.put('cfLastWarning', JSON.stringify({ timestamp: now }));
                }
            }
        } else if ((cache as any).data && (cache as any).data.nearLimit) {
            const lastWarningRaw: any = await env.kv.get('cfLastWarning', { type: 'json' });
            const lastWarning: number = lastWarningRaw?.timestamp || 0;
            if (now - lastWarning > 6 * 60 * 60 * 1000) {
                const warningText = cache.data.overLimit
                    ? `🚫 <b>Cloudflare Workers limit exceeded!</b>\n\n${buildUsageText(cache.data)}`
                    : `⚠️ <b>Cloudflare Workers near limit!</b>\n\n${buildUsageText(cache.data)}`;

                await tgFetch(botToken, 'sendMessage', {
                    chat_id: chatId,
                    text: warningText,
                    parse_mode: 'HTML',
                    reply_markup: usageKeyboard()
                });
                await env.kv.put('cfLastWarning', JSON.stringify({ timestamp: now }));
            }
        }
    } catch {
        // Silently ignore errors in background check
    }
}

export async function handleTelegramWebhook(request: Request, env: Env): Promise<Response> {
    const proxySettings: any = await env.kv.get("proxySettings", { type: 'json' });
    if (!proxySettings) return new Response(null, { status: 200 });

    const botToken: string = proxySettings.telegramBotToken;
    const adminId: string = proxySettings.telegramAdminId;
    if (!botToken || !adminId) return new Response(null, { status: 200 });

    const update: TgUpdate = await request.json();

    if (update.callback_query) {
        const cq = update.callback_query;
        if (cq.from.id.toString() !== adminId) return new Response(null, { status: 200 });

        await tgFetch(botToken, 'answerCallbackQuery', { callback_query_id: cq.id });

        const chatId = cq.message?.chat.id;
        if (!chatId) return new Response(null, { status: 200 });

        const origin = new URL(request.url).origin;

        const data = cq.data || '';

        if (data === 'main') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        } else {
            await handleCallback(cq, botToken, chatId, env, origin);
        }

        checkCfUsageWarning(proxySettings, botToken, chatId, env);
        return new Response(null, { status: 200 });
    }

    if (update.message) {
        if (update.message.from.id.toString() !== adminId) return new Response(null, { status: 200 });

        const chatId = update.message.chat.id;
        const text = update.message.text || '';

        if (text === '/start') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        } else if (text === '/config') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '📥 <b>Get Config</b>\n\nChoose a configuration type:',
                parse_mode: 'HTML',
                reply_markup: typeKeyboard('type')
            });
        } else if (text === '/qr') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '📱 <b>QR Codes</b>\n\nChoose a type:',
                parse_mode: 'HTML',
                reply_markup: typeKeyboard('type')
            });
        } else if (text === '/info') {
            const infoText = buildSettingsInfo(proxySettings);
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: infoText,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[{ text: '🔙 Back', callback_data: 'main' }]]
                }
            });
        } else {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        }

        checkCfUsageWarning(proxySettings, botToken, chatId, env);
        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}
