import { initializeParams } from './helpers/init';
import { VLOverWSHandler } from './protocols/vless';
import { TROverWSHandler } from './protocols/trojan';
import { fallback, serveIcon, renderError, renderSecrets, handlePanel, handleSubscriptions, handleLogin, handleError } from './helpers/helpers';
import { logout } from './authentication/auth';

export default {
	async fetch(request, env) {
		try {
			initializeParams(request, env);
			const upgradeHeader = request.headers.get('Upgrade');
			const path = globalThis.pathName;
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				if (path.startsWith('/panel')) return await handlePanel(request, env);
				if (path.startsWith('/sub')) return await handleSubscriptions(request, env);
				if (path.startsWith('/login')) return await handleLogin(request, env);
				if (path.startsWith('/logout')) return await logout(request, env);
				if (path.startsWith('/error')) return await renderError();
				if (path.startsWith('/secrets')) return await renderSecrets();
				if (path.startsWith('/favicon.ico')) return await serveIcon();
				return await fallback(request);
			} else {
				return path.startsWith('/tr')
					? await TROverWSHandler(request)
					: await VLOverWSHandler(request);
			}
		} catch (error) {
			return await handleError(error);
		}
	}
}