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

interface BotState {
    step: 'awaiting_username' | 'awaiting_days' | 'awaiting_note' | 'awaiting_custom_days';
    data: { username?: string; days?: number };
    timestamp: number;
}

interface UserData {
    username: string;
    subPath: string;
    createdAt: string;
    expiresAt: string;
    note: string;
    active: boolean;
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

function buildSubUrl(origin: string, subPath: string, type: string, app: string): string {
    return `${origin}/sub/${type}/${subPath}?app=${app}`;
}

function mainKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '📥 Get Config', callback_data: 'sub' }],
            [{ text: '👥 Users', callback_data: 'users_menu' }],
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

function usersKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '➕ Add User', callback_data: 'users_add' }],
            [{ text: '📋 List Users', callback_data: 'users_list_0' }],
            [{ text: '📊 Stats', callback_data: 'users_stats' }],
            [{ text: '🔙 Back', callback_data: 'main' }]
        ]
    };
}

function buildUserStatus(user: UserData): string {
    const now = new Date();
    const expires = new Date(user.expiresAt);
    const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / 86400000);

    let statusEmoji: string;
    if (!user.active) statusEmoji = '⏸';
    else if (expires < now) statusEmoji = '❌';
    else statusEmoji = '✅';

    const expiryStr = daysLeft >= 0 ? `(${daysLeft}d left)` : '(expired)';

    return `${statusEmoji} <b>${user.username}</b>\n` +
        `📅 Expires: ${expires.toLocaleDateString()} ${expiryStr}`;
}

function editUserKeyboard(username: string) {
    return {
        inline_keyboard: [
            [
                { text: '+7 days', callback_data: `u_ext_days_${username}_7` },
                { text: '+30 days', callback_data: `u_ext_days_${username}_30` },
                { text: '+90 days', callback_data: `u_ext_days_${username}_90` },
            ],
            [
                { text: '✏️ Custom days', callback_data: `u_custom_days_${username}` },
            ],
            [
                { text: '🗑️ Delete', callback_data: `u_del_${username}` },
                { text: '🔙 Back', callback_data: 'users_list_0' },
            ]
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

function buildStatsText(users: UserData[]): string {
    const now = new Date();
    const total = users.length;
    const active = users.filter(u => u.active && new Date(u.expiresAt) > now).length;
    const expired = users.filter(u => new Date(u.expiresAt) <= now).length;
    const disabled = users.filter(u => !u.active).length;

    return `📊 <b>Panel Stats</b>\n\n` +
        `👥 Total users: ${total}\n` +
        `🟢 Active: ${active}\n` +
        `🔴 Expired: ${expired}\n` +
        `⏸ Disabled: ${disabled}`;
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

async function sendUserList(token: string, chatId: number, page: number, env: Env, origin: string) {
    const rawIndex: any = await env.kv.get('users:index', { type: 'json' });
    const index: string[] = Array.isArray(rawIndex) ? rawIndex : [];
    let users: UserData[] = [];
    if (index.length > 0) {
        const results = await Promise.all(
            index.map(u => env.kv.get(`user:${u}`, { type: 'json' }))
        );
        users = results.filter((u): u is UserData => u !== null);
    }

    if (users.length === 0) {
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '📋 <b>Users</b>\n\nNo users found.',
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '🔙 Back', callback_data: 'users_menu' }]]
            }
        });
        return;
    }

    const perPage = 5;
    const totalPages = Math.ceil(users.length / perPage);
    const start = page * perPage;
    const pageUsers = users.slice(start, start + perPage);

    let text = '📋 <b>Users</b>\n\n';
    for (const user of pageUsers) {
        text += buildUserStatus(user) + '\n';
        const subUrl = `${origin}/sub/user/${user.subPath}`;
        text += `🔗 <code>${subUrl}</code>\n\n`;
    }

    const navRow: { text: string; callback_data: string }[] = [];
    if (page > 0) navRow.push({ text: '◀️ Prev', callback_data: `users_list_${page - 1}` });
    if (page < totalPages - 1) navRow.push({ text: 'Next ▶️', callback_data: `users_list_${page + 1}` });

    const keyboard = {
        inline_keyboard: [
            ...pageUsers.map(u => [{ text: `✏️ ${u.username}`, callback_data: `u_view_${u.username}` }]),
            navRow.length ? navRow : [],
            [{ text: '🔙 Back', callback_data: 'users_menu' }]
        ].filter(row => row.length > 0)
    };

    await tgFetch(token, 'sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: keyboard
    });
}

async function handleUserCallback(cq: TgCallbackQuery, token: string, chatId: number, env: Env, origin: string): Promise<void> {
    const data = cq.data || '';

    if (data === 'users_menu') {
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '👥 <b>User Management</b>\n\nManage your panel users:',
            parse_mode: 'HTML',
            reply_markup: usersKeyboard()
        });
        return;
    }

    if (data === 'users_add') {
        const now = Math.floor(Date.now() / 1000);
        await env.kv.put(`botState:${chatId}`, JSON.stringify({
            step: 'awaiting_username',
            data: {},
            timestamp: now
        }));
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '➕ <b>Add User</b>\n\nStep 1/3: Enter username (3-20 chars, alphanumeric and underscore):\n\n<i>Send /cancel to abort.</i>',
            parse_mode: 'HTML'
        });
        return;
    }

    if (data === 'users_stats') {
        const rawIdx: any = await env.kv.get('users:index', { type: 'json' });
        const idx: string[] = Array.isArray(rawIdx) ? rawIdx : [];
        let users: UserData[] = [];
        if (idx.length > 0) {
            const results = await Promise.all(
                idx.map(u => env.kv.get(`user:${u}`, { type: 'json' }))
            );
            users = results.filter((u): u is UserData => u !== null);
        }
        const stats = buildStatsText(users);
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: stats,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '🔙 Back', callback_data: 'users_menu' }]]
            }
        });
        return;
    }

    if (data.startsWith('users_list_')) {
        const page = parseInt(data.slice(11)) || 0;
        await sendUserList(token, chatId, page, env, origin);
        return;
    }

    if (data.startsWith('u_view_')) {
        const username = data.slice(7);
        const user: UserData | null = await env.kv.get(`user:${username}`, { type: 'json' });
        if (!user) {
            await tgFetch(token, 'answerCallbackQuery', {
                callback_query_id: cq.id,
                text: 'User not found.',
                show_alert: true
            });
            return;
        }
        const subUrl = `${origin}/sub/user/${user.subPath}`;
        const text = `${buildUserStatus(user)}\n🔗 <code>${subUrl}</code>`;
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: editUserKeyboard(username)
        });
        return;
    }

    if (data.startsWith('u_ext_days_')) {
        const parts = data.split('_');
        const username = parts.slice(3, -1).join('_');
        const days = parseInt(parts[parts.length - 1]);
        const user: UserData | null = await env.kv.get(`user:${username}`, { type: 'json' });
        if (user) {
            user.expiresAt = new Date(new Date(user.expiresAt).getTime() + days * 86400000).toISOString();
            await env.kv.put(`user:${username}`, JSON.stringify(user));
            const subUrl = `${origin}/sub/user/${user.subPath}`;
            const text = `${buildUserStatus(user)}\n🔗 <code>${subUrl}</code>`;
            await tgFetch(token, 'editMessageText', {
                chat_id: chatId,
                message_id: cq.message?.message_id,
                text: text,
                parse_mode: 'HTML',
                reply_markup: editUserKeyboard(username)
            });
            await tgFetch(token, 'answerCallbackQuery', {
                callback_query_id: cq.id,
                text: `✅ Added ${days} days`
            });
        }
        return;
    }

    if (data.startsWith('u_custom_days_')) {
        const username = data.slice(14);
        const now = Math.floor(Date.now() / 1000);
        await env.kv.put(`botState:${chatId}`, JSON.stringify({
            step: 'awaiting_custom_days',
            data: { username },
            timestamp: now
        }));
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: `✏️ Enter number of days to extend (or negative to reduce):\n\n<i>Send /cancel to abort.</i>`,
            parse_mode: 'HTML'
        });
        return;
    }

    if (data.startsWith('u_del_')) {
        const username = data.slice(6);
        const confirmKeyboard = {
            inline_keyboard: [
                [
                    { text: '✅ Yes, delete', callback_data: `confirm_delete:${username}` },
                    { text: '❌ Cancel', callback_data: 'cancel_delete' },
                ]
            ]
        };
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: `⚠️ Delete user <b>${username}</b>? This cannot be undone.`,
            parse_mode: 'HTML',
            reply_markup: confirmKeyboard
        });
        return;
    }

    if (data.startsWith('confirm_delete:')) {
        const username = data.slice(15);
        const user: UserData | null = await env.kv.get(`user:${username}`, { type: 'json' });
        if (user) {
            await env.kv.delete(`user:${username}`);
            const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
            await env.kv.put('users:index', JSON.stringify(index.filter(u => u !== username)));
            await tgFetch(token, 'answerCallbackQuery', {
                callback_query_id: cq.id,
                text: `🗑️ Deleted ${username}`
            });
            await tgFetch(token, 'editMessageText', {
                chat_id: chatId,
                message_id: cq.message?.message_id,
                text: `✅ User ${username} deleted.`,
                parse_mode: 'HTML'
            });
        } else {
            await tgFetch(token, 'answerCallbackQuery', {
                callback_query_id: cq.id,
                text: 'User not found.',
                show_alert: true
            });
        }
        return;
    }

    if (data === 'cancel_delete') {
        await tgFetch(token, 'answerCallbackQuery', {
            callback_query_id: cq.id,
            text: '❌ Cancelled'
        });
        await tgFetch(token, 'editMessageText', {
            chat_id: chatId,
            message_id: cq.message?.message_id,
            text: '❌ Deletion cancelled.',
            parse_mode: 'HTML'
        });
        return;
    }

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
            const url = buildSubUrl(origin, subPath, typeKey, appInfo.app);
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

async function handleUserMessage(msg: TgMessage, token: string, chatId: number, env: Env, origin: string): Promise<void> {
    const text = msg.text || '';

    if (text === '/cancel') {
        await env.kv.delete(`botState:${chatId}`);
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '❌ Operation cancelled.',
            parse_mode: 'HTML',
            reply_markup: mainKeyboard()
        });
        return;
    }

    const stateRaw = await env.kv.get(`botState:${chatId}`, { type: 'json' });
    if (!stateRaw) return;

    const state = stateRaw as BotState;
    const now = Math.floor(Date.now() / 1000);
    if (now - state.timestamp > 300) {
        await env.kv.delete(`botState:${chatId}`);
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: '⏰ Session expired. Please start again.',
            parse_mode: 'HTML',
            reply_markup: mainKeyboard()
        });
        return;
    }

    if (state.step === 'awaiting_custom_days') {
        const days = parseInt(text);
        if (isNaN(days) || days < -3650 || days > 3650) {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '⛔ Invalid number. Enter a value between -3650 and 3650.\n\nSend /cancel to abort.',
                parse_mode: 'HTML'
            });
            return;
        }

        const username = state.data.username!;
        const user: UserData | null = await env.kv.get(`user:${username}`, { type: 'json' });
        if (user) {
            user.expiresAt = new Date(new Date(user.expiresAt).getTime() + days * 86400000).toISOString();
            await env.kv.put(`user:${username}`, JSON.stringify(user));
            await env.kv.delete(`botState:${chatId}`);
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: `✅ Extended by ${days} days. New expiry: ${new Date(user.expiresAt).toLocaleDateString()}`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[{ text: '👥 Users', callback_data: 'users_menu' }]]
                }
            });
        } else {
            await env.kv.delete(`botState:${chatId}`);
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '⛔ User not found.',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        }
        return;
    }

    if (state.step === 'awaiting_username') {
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(text)) {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '⛔ Invalid username. Use 3-20 alphanumeric characters or underscores.\n\nTry again or send /cancel:',
                parse_mode: 'HTML'
            });
            return;
        }

        const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
        if (index.includes(text)) {
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '⛔ Username already exists. Choose another or send /cancel:',
                parse_mode: 'HTML'
            });
            return;
        }

        state.data.username = text;
        state.step = 'awaiting_days';
        state.timestamp = now;
        await env.kv.put(`botState:${chatId}`, JSON.stringify(state));
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: `✅ Username: <b>${text}</b>\n\nStep 2/4: Duration in days (default 30):`,
            parse_mode: 'HTML'
        });
        return;
    }

    if (state.step === 'awaiting_days') {
        const days = parseInt(text) || 30;
        state.data.days = Math.max(1, Math.min(days, 3650));
        state.step = 'awaiting_note';
        state.timestamp = now;
        await env.kv.put(`botState:${chatId}`, JSON.stringify(state));
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: `✅ Duration: ${state.data.days} days\n\nStep 3/3: Note (optional, send - to skip):`,
            parse_mode: 'HTML'
        });
        return;
    }

    if (state.step === 'awaiting_note') {
        const note = text === '-' ? '' : text;
        await env.kv.delete(`botState:${chatId}`);

        const username = state.data.username!;
        const hex = '0123456789abcdef';
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return c === 'x' ? hex[r] : hex[(r & 0x3) | 0x8]; });
        const expiresAt = new Date(Date.now() + (state.data.days || 30) * 86400000).toISOString();

        const user = {
            username,
            subPath: uuid,
            createdAt: new Date().toISOString(),
            expiresAt,
            note,
            active: true
        };

        await env.kv.put(`user:${username}`, JSON.stringify(user));
        const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
        index.push(username);
        await env.kv.put('users:index', JSON.stringify(index));

        const subUrl = `${origin}/sub/user/${uuid}`;
        await tgFetch(token, 'sendMessage', {
            chat_id: chatId,
            text: `✅ <b>User created!</b>\n\n👤 ${username}\n📅 Expires: ${new Date(expiresAt).toLocaleDateString()}\n📝 Note: ${note || '(none)'}\n\n🔗 <code>${subUrl}</code>`,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[{ text: '👥 Users', callback_data: 'users_menu' }]]
            }
        });
        return;
    }
}

async function checkCfUsageWarning(proxySettings: any, botToken: string, chatId: number, env: Env): Promise<void> {
    if (!proxySettings.cfAccountId || !proxySettings.cfApiToken || !proxySettings.cfWorkerName) return;

    try {
        const now = Date.now();
        const cacheRaw = await env.kv.get('cfUsageCache', { type: 'json' });
        const cache: any = cacheRaw || {};

        let needFetch = true;
        if (cache.data && cache.fetchedAt && (now - cache.fetchedAt < 30 * 60 * 1000)) {
            needFetch = false;
        }

        if (needFetch) {
            const result = await getCfUsageForTelegram(env);
            if (!result || !result.success || !result.data) return;
            await env.kv.put('cfUsageCache', JSON.stringify({ data: result.data, fetchedAt: now }));

            if (result.data.nearLimit) {
                const lastWarningRaw = await env.kv.get('cfLastWarning', { type: 'json' });
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
        } else if (cache.data && cache.data.nearLimit) {
            const lastWarningRaw = await env.kv.get('cfLastWarning', { type: 'json' });
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
            await handleUserCallback(cq, botToken, chatId, env, origin);
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
        } else if (text === '/users') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '👥 <b>User Management</b>\n\nManage your panel users:',
                parse_mode: 'HTML',
                reply_markup: usersKeyboard()
            });
        } else {
            const origin = new URL(request.url).origin;
            const state = await env.kv.get(`botState:${chatId}`, { type: 'json' });
            if (state) {
                await handleUserMessage(update.message, botToken, chatId, env, origin);
            } else {
                await tgFetch(botToken, 'sendMessage', {
                    chat_id: chatId,
                    text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                    parse_mode: 'HTML',
                    reply_markup: mainKeyboard()
                });
            }
        }

        checkCfUsageWarning(proxySettings, botToken, chatId, env);
        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}
