import { PanelSettings, TelegramBot } from '#types/settings';
import { deployPages, deletePagesProject } from '@api/pages';
import { getUsage } from '@api/usage';
import { fetchWarpAccounts } from '@api/warp';
import { deployWorkers, deleteWorker } from '@api/workers';
import { resetPassword, logout, authenticate } from '@auth';
import { decompressGzipBase64, respond, HttpStatus, safeError } from '@common';
import { getDataset, updateDataset, getUsers, saveUsers, getAllTrafficUsage } from '@kv';
import { ZavaliUser } from '#types/settings';
import { buildScript, updateMainSettings } from '@main';
import { getGlobals, getMainSettings, subscriptions, clients } from '@settings';
import { validateSettings } from '@validators';
import { fallback } from './utils';
import { setTelegramBot } from '@api/telegram';

export async function handlePanel(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'panel':
            return renderPanel(request, env);

        case 'panel/settings':
            return getPanelSettings(request, env);

        case 'panel/update-settings':
            return updatePanelSettings(request, env);

        case 'panel/reset-settings':
            return resetPanelSettings(request, env);

        case 'panel/reset-password':
            return resetPassword(request, env);

        case 'panel/my-ip':
            return getMyIP(request);

        case 'panel/update-warp':
            return updateWarpConfigs(request, env);

        case 'panel/update-panel':
            return updatePanel(request, env);

        case 'panel/delete-panel':
            return deletePanel(request, env);

        case 'panel/usage':
            return getUsage(request, env);

        case 'panel/users':
            return manageUsers(request, env);

        case 'panel/traffic':
            return getTraffic(request, env);

        case 'panel/logout':
            return logout();

        default:
            return fallback(request);
    }
}

async function renderPanel(request: Request, env: Env): Promise<Response> {
    const pwd = await env.kv.get('pwd');
    if (pwd) {
        const auth = await authenticate(request, env);
        if (!auth) {
            const url = new URL('./login', request.url);
            return Response.redirect(url, 302);
        }
    }

    const str = await decompressGzipBase64(PANEL_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function updatePanel(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { deployType } = getGlobals();
        const script = await buildScript(true);
        if (deployType === 'pages') {
            await deployPages(script);
        } else {
            await deployWorkers(script);
        }

        return respond(true, HttpStatus.OK);
    } catch (error) {
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while upgrading panel: ${safeError(error)}`
        );
    }
}

async function deletePanel(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const { deployType } = getGlobals();
        if (deployType === 'pages') {
            await deletePagesProject();
        } else {
            await deleteWorker();
        }

        return respond(true, HttpStatus.OK);
    } catch (error) {
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while deleting panel: ${safeError(error)}`
        );
    }
}

async function getPanelSettings(request: Request, env: Env): Promise<Response> {
    const isPassSet = Boolean(await env.kv.get('pwd'));

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', { isPassSet });
        }

        const { settings: kvSettings, telegramBot } = await getDataset(env);
        const mainSettings = getMainSettings();
        const data = {
            proxySettings: { ...kvSettings, ...mainSettings },
            telegramSettings: telegramBot,
            subscriptions,
            clients,
            users: await getUsers(env),
            isPassSet
        };

        return respond(true, HttpStatus.OK, undefined, data, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while fetching settings: ${safeError(error)}`
        );
    }
}

async function updatePanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const newSettings: PanelSettings = await request.json();
        const errors = validateSettings(newSettings);
        if (errors) return respond(false, HttpStatus.BAD_REQUEST, 'Validation Error', errors);

        await Promise.all([
            updateDataset(env, newSettings),
            updateMainSettings(newSettings)
        ]);

        const { securePath } = getGlobals();
        if (newSettings.securePath !== securePath) {
            const bot: TelegramBot | null = await env.kv.get('telegramBot', { type: 'json' });
            if (bot) {
                await setTelegramBot(newSettings.securePath, bot.telegramBotToken);
            }
        }

        return respond(true, HttpStatus.OK, '');
    } catch (error) {
        console.log(error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}

async function resetPanelSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed!');
    }

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        const [kvSettings, mainSettings] = await Promise.all([
            updateDataset(env),
            updateMainSettings(null)
        ]);

        return respond(true, HttpStatus.OK, '', { ...kvSettings, ...mainSettings });
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error occurred while resetting settings: ${safeError(error)}`
        );
    }
}

async function getMyIP(request: Request): Promise<Response> {
    const ip = await request.text();

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
        const geoLocation = await response.json();
        return respond(true, HttpStatus.OK, '', geoLocation);
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Error fetching IP address: ${safeError(error)}`
        )
    }
}

async function updateWarpConfigs(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');

    try {
        const auth = await authenticate(request, env);
        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
        }

        await fetchWarpAccounts(env);
        return respond(true, HttpStatus.OK, 'Warp configs updated successfully!');
    } catch (error) {
        console.log(error);
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `An error occurred while updating Warp configs: ${safeError(error)}`
        );
    }
}

async function getTraffic(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    try {
        const users = await getUsers(env);
        const usage = await getAllTrafficUsage(env, users);
        return respond(true, HttpStatus.OK, '', usage);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}

async function manageUsers(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    try {
        const users = await getUsers(env);
        if (request.method === 'GET') return respond(true, HttpStatus.OK, '', users);
        const data = await request.json() as Partial<ZavaliUser> & { action?: string };
        if (data.action === 'delete') {
            const next = users.filter(u => u.id !== data.id);
            await saveUsers(env, next);
            return respond(true, HttpStatus.OK, 'User deleted.', next);
        }
        if (data.action === 'toggle') {
            const user = users.find(u => u.id === data.id);
            if (!user) return respond(false, HttpStatus.NOT_FOUND, 'User not found.');
            user.enabled = !user.enabled;
            await saveUsers(env, users);
            return respond(true, HttpStatus.OK, 'User status updated.', users);
        }
        const now = new Date().toISOString();
        if (!data.name) return respond(false, HttpStatus.BAD_REQUEST, 'Name is required.');
        const user: ZavaliUser = {
            id: data.id || crypto.randomUUID(),
            name: String(data.name),
            uuid: data.uuid || crypto.randomUUID(),
            password: data.password || crypto.randomUUID().replaceAll('-', ''),
            enabled: data.enabled !== false,
            expiresAt: data.expiresAt || '',
            dataLimit: Number(data.dataLimit || 0),
            createdAt: data.createdAt || now
        };
        const index = users.findIndex(u => u.id === user.id);
        if (index >= 0) users[index] = user; else users.push(user);
        await saveUsers(env, users);
        return respond(true, HttpStatus.OK, 'User saved.', users);
    } catch (error) {
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeError(error));
    }
}
