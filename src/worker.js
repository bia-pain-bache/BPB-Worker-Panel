import { globalConfig, init, initHttp, initWs } from './common/init';
import { fallback, serveIcon, renderSecrets, handlePanel, handleSubscriptions, handleLogin, handleError, handleWebsocket } from './common/handlers';
import { logout } from './auth';

export default {
	async fetch(request, env) {
		try {
			const upgradeHeader = request.headers.get('Upgrade');
			init(request, env);

			if (upgradeHeader === 'websocket') {
				initWs(env);
				return await handleWebsocket(request);
			} else {
				initHttp(request, env);
				const path = globalConfig.pathName;
				if (path.startsWith('/panel')) return await handlePanel(request, env);
				if (path.startsWith('/sub')) return await handleSubscriptions(request, env);
				if (path.startsWith('/login')) return await handleLogin(request, env);
				if (path.startsWith('/logout')) return await logout(request, env);
				if (path.startsWith('/secrets')) return await renderSecrets();
				if (path.startsWith('/favicon.ico')) return await serveIcon();
				return await fallback(request);
			}

		} catch (error) {
			return await handleError(error);
		}
	}
}