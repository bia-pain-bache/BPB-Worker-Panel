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

export default {
	async fetch(request: Request, env: Env) {
		try {
			init(request, env);
			if (request.headers.get('Upgrade') === 'websocket') return handleWebsocket(request);
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
			return renderError(error);
		}
	}
}