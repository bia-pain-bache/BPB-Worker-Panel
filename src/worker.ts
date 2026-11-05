import { handleDoH } from '@handlers/doh';
import { renderError } from '@handlers/error';
import { handleLogin } from '@handlers/login';
import { handlePanel } from '@handlers/panel';
import { handleProxyIPs } from '@handlers/proxy-ip';
import { generateQRCode } from '@handlers/qrcode';
import { handleSubscriptions } from '@handlers/subscription';
import { handleTelegram } from '@handlers/telegram';
import { fallback } from '@handlers/utils';
import { handleWebsocket } from '@handlers/websocket';
import { init, getGlobals } from '@settings';
import { handleTelegramWebProxy, WebProxySession } from './protocols/telegram-web-proxy/index';

export { WebProxySession };

export default {
	async fetch(request: Request, env: Env) {
		try {
			const url = new URL(request.url);
			if (url.pathname === '/__health') {
				return new Response(JSON.stringify({
					ok: true,
					hasSessions: !!(env && env.SESSIONS),
					hasSecret: !!(env && env.PROXY_SECRET),
					hasKv: !!(env && env.kv),
					hasEmbed: typeof (globalThis as any).EMBEDED_SETTINGS !== 'undefined',
				}), { headers: { 'content-type': 'application/json' } });
			}

			const twpResponse = await handleTelegramWebProxy(request, env);
			if (twpResponse !== null) {
				return twpResponse;
			}
			init(request, env);
			if (request.headers.get('Upgrade') === 'websocket') {
				return handleWebsocket(request);
			}
			const { securePath, pathname } = getGlobals();
			const path = pathname.split('/').splice(0, 3).join('/');
			switch (path) {
				case `/${securePath}/panel`:
					return handlePanel(request, env);
				case `/${securePath}/login`:
					return handleLogin(request, env);
				case `/${securePath}/sub`:
					return handleSubscriptions(request, env);
				case `/${securePath}/telegram`:
					return handleTelegram(request, env);
				case `/${securePath}/dns-query`:
					return handleDoH(request);
				case `/${securePath}/proxy-ip`:
					return handleProxyIPs(request, env);
				case `/${securePath}/qrcode`:
					return generateQRCode(request);
				default:
					return fallback(request);
			}
		} catch (error) {
			const msg = error instanceof Error ? (error.stack || error.message) : String(error);
			return new Response('WORKER_ERROR:\n' + msg, {
				status: 500,
				headers: { 'content-type': 'text/plain; charset=utf-8' }
			});
		}
	}
};
