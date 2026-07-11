import { HttpStatus, respond, safeError } from '@common';
import { getGlobals, getSettings, subscriptions } from '@settings';
import { getCfWorkerUsage } from './usage';
import { authenticate } from '@auth';
import { TelegramBot } from '#types/settings';

export async function setupTelegramWebhook(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { telegramBotToken, telegramUserId } = await request.json() as any;
        const botToken = telegramBotToken.trim();
        const userID = telegramUserId.trim();

        if (!botToken || !userID) {
            return respond(false, HttpStatus.BAD_REQUEST, 'Missing but info.');
        }

        const { securePath } = getGlobals();
        await setTelegramBot(securePath, botToken);

        const bot: TelegramBot = {
            telegramBotToken: botToken,
            telegramUserId: userID
        };

        await env.kv.put('telegramBot', JSON.stringify(bot));
        return respond(true, HttpStatus.OK, 'Telegram bot setup completed successfully!', bot);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error occurred while setting Telegram Bot: ${safeError(error)}`);
    }
}

export async function setTelegramBot(path: string, token: string) {
    const { origin } = getGlobals();
    const webhookUrl = new URL(`/${path}/telegram/webhook`, origin);
    const api = new URL(`https://api.telegram.org/bot${token}/setWebhook`);
    api.searchParams.set('url', webhookUrl.href);

    try {
        const res = await fetch(api);
        const data: any = await res.json();
        if (!data.ok) {
            throw new Error(data.description || 'Failed to set webhook.');
        }
    
        const commRes = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                commands: [
                    { command: 'start', description: '🤖 Show welcome menu' },
                    { command: 'config', description: '🔗 Get configs' },
                    { command: 'usage', description: '📊 Monitor usage' },
                ]
            })
        });
    
        const commData: any = await commRes.json();
        if (!commData.ok) {
            throw new Error(commData.description || 'Failed to set bot commands.');
        }
    } catch (error) {
        throw new Error(safeError(error));
    }
}

export async function removeTelegramBot(request: Request, env: Env) {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { telegramBotToken } = await env.kv.get('telegramBot', { type: 'json' }) as any;
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/deleteWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                drop_pending_updates: true
            })
        });

        const data = await res.json() as { ok: boolean; description?: string };
        if (!res.ok || !data.ok) {
            throw new Error(data.description || `Failed with status ${res.status}`);
        }

        const bot: TelegramBot = { telegramBotToken: '', telegramUserId: '' };
        await env.kv.put('telegramBot', JSON.stringify(bot));

        return respond(true, HttpStatus.OK, 'Telegram bot webhook deleted successfully!', bot);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error occurred while removing Telegram bot: ${safeError(error)}`);
    }
}

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

interface Url {
    url: string;
    noCacheUrl: string;
}

function mainKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '🔗 Get Config', callback_data: 'sub' }],
            [{ text: '📊 Usage', callback_data: 'usage' }]
        ]
    };
}

function typeKeyboard(prefix: string) {
    return {
        inline_keyboard: [
            [{ text: '🔗 Normal', callback_data: `${prefix}_normal` }],
            [{ text: '🔗 Fragment', callback_data: `${prefix}_fragment` }],
            [{ text: '🔗 Raw (Not recommended)', callback_data: `${prefix}_raw` }],
            [{ text: '🔗 Warp', callback_data: `${prefix}_warp` }],
            [{ text: '🔗 Warp Pro', callback_data: `${prefix}_warp-pro` }],
            [{ text: '◀️ Back', callback_data: 'main' }]
        ]
    };
}

function usageKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '🔄 Refresh', callback_data: 'usage_refresh' }],
            [{ text: '◀️ Back', callback_data: 'main' }]
        ]
    };
}

async function tgFetch(token: string, method: string, body: any): Promise<any> {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

function buildSubUrl(origin: string, path: string, type: string, app: string, label: string): Url {
    const url = new URL(`/${path}/sub/${type}`, origin);
    url.searchParams.set('app', app);
    url.hash = `💦 BPB ${label}`;

    let clientBaseUrl: string = url.href;
    
    if(app === 'sing-box' && type !== 'raw') {
        const singUrl = new URL('sing-box://import-remote-profile');
        singUrl.searchParams.set('url', url.href);
        clientBaseUrl = singUrl.href;
    }

    url.searchParams.set('nocache', Date.now().toString());
    const noCache = url.href;

    return { url: clientBaseUrl, noCacheUrl: noCache };
}

function buildUsageText(totalUsage: number, panelUsage: number): string {
    const panelReqPct = Math.ceil(Number(panelUsage) / 100000 * 100);
    const totalReqPct = Math.ceil(Number(totalUsage) / 100000 * 100);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let text = [
        '📊 <b>Cloudflare Workers Usage</b>',
        `━━━━━━━━━━━━━━━━`,
        `📅 Today: ${today}`,
        '',
        '🔵 <b>BPB requests</b>',
        `${panelUsage} / 100,000 (${panelReqPct}%)`,
        '',
        '🔵 <b>Total requests</b>',
        `${totalUsage} / 100,000 (${totalReqPct}%)`,
        '',
        ''
    ].join('\n');

    if (totalReqPct > 80) {
        text += '🔴 <b>WARNING:</b> Approaching limit!\n';
    } else {
        text += '✅ All within limits';
    }

    return text;
}

async function handleCallback(cq: TgCallbackQuery, token: string, chatId: number, origin: string): Promise<void> {
    const data = cq.data || '';

    switch (data) {
        case 'sub':
            await tgFetch(token, 'sendMessage', {
                chat_id: chatId,
                text: '🔗 <b>Get Config</b>\n\nChoose a config type:',
                parse_mode: 'HTML',
                reply_markup: typeKeyboard('type')
            });
            break;

        case 'usage':
        case 'usage_refresh':
            const result = await getCfWorkerUsage();
            if (!result) {
                await tgFetch(token, 'sendMessage', {
                    chat_id: chatId,
                    text: '⚠️ Could not fetch usage data.',
                    parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: [[{ text: '◀️ Back', callback_data: 'main' }]] }
                });
                break;
            }

            if (!result.success) {
                await tgFetch(token, 'sendMessage', {
                    chat_id: chatId,
                    text: result.error,
                    parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: [[{ text: '◀️ Back', callback_data: 'main' }]] }
                });
                break;
            }

            if (!result.total || !result.worker) break;
            const text = buildUsageText(result.total, result.worker);
            if (data === 'usage_refresh' && cq.message?.message_id) {
                await tgFetch(token, 'editMessageText', {
                    chat_id: chatId,
                    message_id: cq.message.message_id,
                    text: text,
                    parse_mode: 'HTML',
                    reply_markup: usageKeyboard()
                });
            } else {
                await tgFetch(token, 'sendMessage', {
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML',
                    reply_markup: usageKeyboard()
                });
            }
            break;

        default:
            if (!data.startsWith('type_')) break;
            const typeKey = data.slice(5);
            const subscription = subscriptions[typeKey];
            if (!subscription) break;
            const { securePath } = getSettings();

            for (const [index, appInfo] of subscription.categories.entries()) {
                const { url, noCacheUrl } = buildSubUrl(origin, securePath, typeKey, appInfo.core, subscription.label);
                
                const qrUrl = new URL('https://api.qrserver.com/v1/create-qr-code/');
                qrUrl.searchParams.set('data', url);
                qrUrl.searchParams.set('size', '400x400');

                const supportedList = appInfo.clients.map(a => `✅ ${a}`).join('\n');
                const showUrl = appInfo.core === 'wireguard' ? '' : `<code>${url}</code>\n\n`;
                const caption = `💦 <b>BPB ${subscription.label}</b>\n\n${showUrl}<b>Supported apps:</b>\n\n${supportedList}`;

                const isLast = index === subscription.categories.length - 1;
                const backBtn = {
                    reply_markup: {
                        inline_keyboard: [[{ text: '◀️ Back', callback_data: 'sub' }]]
                    }
                };

                if (appInfo.core === 'wireguard') {
                    await tgFetch(token, 'sendDocument', {
                        chat_id: chatId,
                        document: noCacheUrl,
                        caption: caption,
                        parse_mode: 'HTML',
                        ...(isLast && backBtn)
                    });
                } else {
                    const hasDocument = typeKey !== 'raw';

                    await tgFetch(token, 'sendPhoto', {
                        chat_id: chatId,
                        photo: qrUrl.href,
                        caption: caption,
                        parse_mode: 'HTML',
                        ...(isLast && !hasDocument && backBtn)
                    });

                    if (hasDocument) {
                        await tgFetch(token, 'sendDocument', {
                            chat_id: chatId,
                            document: noCacheUrl,
                            ...(isLast && backBtn)
                        });
                    }
                }
            }
            break;
    }
}

export async function handleTelegramWebhook(request: Request, env: Env): Promise<Response> {
    const tgBot: TelegramBot | null = await env.kv.get('telegramBot', { type: 'json' });
    if (!tgBot) return new Response(null, { status: 200 });

    const { telegramBotToken: botToken, telegramUserId: userId } = tgBot;
    if (!botToken || !userId) return new Response(null, { status: 200 });

    const update: TgUpdate = await request.json();

    if (update.callback_query) {
        const cq = update.callback_query;
        if (cq.from.id.toString() !== userId) return new Response(null, { status: 200 });

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
            await handleCallback(cq, botToken, chatId, origin);
        }

        checkCfUsageWarning(botToken, chatId);
        return new Response(null, { status: 200 });
    }

    if (update.message) {
        if (update.message.from.id.toString() !== userId) return new Response(null, { status: 200 });

        const chatId = update.message.chat.id;
        const text = update.message.text || '';

        switch (text) {
            case '/usage':
                const result = await getCfWorkerUsage();
                if (!result.success || !result.worker || !result.total) break;
                await tgFetch(botToken, 'sendMessage', {
                    chat_id: chatId,
                    text: buildUsageText(result.total, result.worker),
                    parse_mode: 'HTML',
                    reply_markup: usageKeyboard()
                });
                break;

            case '/config':
                await tgFetch(botToken, 'sendMessage', {
                    chat_id: chatId,
                    text: '🔗 <b>Get Config</b>\n\nChoose a configuration type:',
                    parse_mode: 'HTML',
                    reply_markup: typeKeyboard('type')
                });
                break;

            default:
                await tgFetch(botToken, 'sendMessage', {
                    chat_id: chatId,
                    text: '🤖 <b>BPB Panel Bot</b>\n\nChoose an option:',
                    parse_mode: 'HTML',
                    reply_markup: mainKeyboard()
                });
                break;
        }

        checkCfUsageWarning(botToken, chatId);
        return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 200 });
}

async function checkCfUsageWarning(botToken: string, chatId: number): Promise<void> {
    const result = await getCfWorkerUsage();
    if (!result.success || !result.worker || !result.total) return;

    const nearLimit = result.total / 100000 * 100 > 80;
    if (nearLimit) {
        await tgFetch(botToken, 'sendMessage', {
            chat_id: chatId,
            text: buildUsageText(result.total, result.worker),
            parse_mode: 'HTML',
            reply_markup: usageKeyboard()
        });
    }
}