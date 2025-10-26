import { logout } from '#auth';
import { init, initHttp, initWs } from '#common/init';
import {
	fallback,
	serveIcon,
	renderSecrets,
	handlePanel,
	handleSubscriptions,
	handleLogin,
	handleError,
	handleWebsocket
} from '#common/handlers';

export default {
	async fetch(request: Request, env: Env) {
		try {
			const upgradeHeader = request.headers.get('Upgrade');
			init(request, env);

			if (upgradeHeader === 'websocket') {
				initWs(env);
				return await handleWebsocket(request);
			} else {
				initHttp(request, env);
				const { pathName } = globalThis.globalConfig;
				const path = pathName.split('/')[1];

				switch (path) {
					case 'panel':
						return await handlePanel(request, env);

					case 'sub':
						return await handleSubscriptions(request, env);

					case 'login':
						return await handleLogin(request, env);

					case 'logout':
						return await logout();

					case 'secrets':
						return await renderSecrets();

					case 'favicon.ico':
						return await serveIcon();

					default:
						return await fallback(request);
				}
			}
		} catch (error) {
			return await handleError(error);
		}
	}
}