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

function buildSubUrl(origin: string, subPath: string, type: string, app: string): string {
    return `${origin}/sub/${type}/${subPath}?app=${app}`;
}

function mainKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '📥 Get Config', callback_data: 'sub' }],
            [{ text: '📱 QR Codes', callback_data: 'qr' }],
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
        const subPath = env.SUB_PATH || env.UUID || '';

        const data = cq.data || '';

        if (data === 'main') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        } else if (data === 'sub') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '📥 <b>Get Config</b>\n\nChoose a configuration type:',
                parse_mode: 'HTML',
                reply_markup: typeKeyboard('type')
            });
        } else if (data === 'qr') {
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '📱 <b>QR Codes</b>\n\nChoose a type:',
                parse_mode: 'HTML',
                reply_markup: typeKeyboard('type')
            });
        } else if (data === 'info') {
            const text = buildSettingsInfo(proxySettings);
            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[{ text: '🔙 Back', callback_data: 'main' }]]
                }
            });
        } else if (data.startsWith('type_')) {
            const typeKey = data.slice(5);
            const typeInfo = SUB_TYPES[typeKey];
            if (!typeInfo) return new Response(null, { status: 200 });

            for (const appInfo of typeInfo.apps) {
                const url = buildSubUrl(origin, subPath, typeKey, appInfo.app);
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=400x400`;
                const supportedList = appInfo.supportedApps.map(a => `✅ ${a}`).join('\n');
                const caption = `${typeInfo.emoji} <b>BPB ${typeInfo.label}</b>\n\n<code>${url}</code>\n\n<b>Supported apps:</b>\n${supportedList}`;

                await tgFetch(botToken, 'sendPhoto', {
                    chat_id: chatId,
                    photo: qrUrl,
                    caption: caption,
                    parse_mode: 'HTML'
                });
            }

            await tgFetch(botToken, 'sendMessage', {
                chat_id: chatId,
                text: '🔙 Choose another type or go back:',
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[{ text: '🔙 Back', callback_data: 'sub' }]]
                }
            });
        }

        return new Response(null, { status: 200 });
    }

    if (update.message) {
        if (update.message.from.id.toString() !== adminId) return new Response(null, { status: 200 });

        const chatId = update.message.chat.id;
        const text = update.message.text || '';

        if (text === '/config') {
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
                text: '🤖 <b>BPB Panel Bot</b>\n\nWelcome! Choose an option:',
                parse_mode: 'HTML',
                reply_markup: mainKeyboard()
            });
        }

        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}
