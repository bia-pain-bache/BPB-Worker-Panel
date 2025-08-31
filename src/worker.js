import { init } from './helpers/init';
import { VlOverWSHandler } from './protocols/vless';
import { TrOverWSHandler } from './protocols/trojan';
import { fallback, serveIcon, renderSecrets, handlePanel, handleSubscriptions, handleLogin, handleError } from './helpers/helpers';
import { logout } from './authentication/auth';

export default {
	async fetch(request, env) {
		try {
			const upgradeHeader = request.headers.get('Upgrade');
			init(request, env, upgradeHeader);
			const path = globalThis.pathName;

			if (upgradeHeader === 'websocket') {
				if (globalThis.wsProtocol === 'vl') return await VlOverWSHandler(request);
				if (globalThis.wsProtocol === 'tr') return await TrOverWSHandler(request);
			} else {
				if (path.startsWith('/panel')) return await handlePanel(request, env);
				if (path.startsWith('/sub')) return await handleSubscriptions(request, env);
				if (path.startsWith('/login')) return await handleLogin(request, env);
				if (path.startsWith('/logout')) return await logout(request, env);
				if (path.startsWith('/secrets')) return await renderSecrets();
				if (path.startsWith('/favicon.ico')) return await serveIcon();
			}

			return await fallback(request);
		} catch (error) {
			return await handleError(error);
		}
	}
}