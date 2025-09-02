import { init } from './helpers/init';
import { VlOverWSHandler } from './protocols/vless';
import { TrOverWSHandler } from './protocols/trojan';
import { fallback, serveIcon, renderSecrets, handlePanel, handleSubscriptions, handleLogin, handleError } from './helpers/helpers';
import { logout } from './authentication/auth';

export default {
	async fetch(request, env) {
		try {
			init(request, env);
			const upgradeHeader = request.headers.get('Upgrade');
			const path = globalThis.pathName;
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				if (path.startsWith('/panel')) return await handlePanel(request, env);
				if (path.startsWith('/sub')) return await handleSubscriptions(request, env);
				if (path.startsWith('/login')) return await handleLogin(request, env);
				if (path.startsWith('/logout')) return await logout(request, env);
				if (path.startsWith('/secrets')) return await renderSecrets();
				if (path.startsWith('/favicon.ico')) return await serveIcon();
				return await fallback(request);
			} else {
				return path.startsWith('/tr')
					? await TrOverWSHandler(request)
					: await VlOverWSHandler(request);
			}
		} catch (error) {
			return await handleError(error);
		}
	}
}