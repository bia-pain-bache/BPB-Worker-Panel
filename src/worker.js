import { initializeParams } from './helpers/init';
import { VLOverWSHandler } from './protocols/vless';
import { TROverWSHandler } from './protocols/trojan';
import { fallback, serveIcon, renderError, renderSecrets, handlePanel, handleSubscriptions, handleLogin } from './helpers/helpers';
import { logout } from './authentication/auth';

export default {
	async fetch(request, env) {
		try {
			initializeParams(request, env);
			const { pathName } = globalThis;
			const upgradeHeader = request.headers.get('Upgrade');
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				if (pathName.startsWith('/panel')) return await handlePanel(request, env);
				if (pathName.startsWith('/sub')) return await handleSubscriptions(request, env);
				if (pathName.startsWith('/login')) return await handleLogin(request, env);
				if (pathName.startsWith('/logout')) return await logout(request, env);
				if (pathName.startsWith('/error')) return await renderError();
				if (pathName.startsWith('/secrets')) return await renderSecrets();
				if (pathName.startsWith('/favicon.ico')) return await serveIcon();
				return await fallback(request);
			} else {
				return pathName.startsWith('/tr')
					? await TROverWSHandler(request)
					: await VLOverWSHandler(request);
			}
		} catch (error) {
			const message = encodeURIComponent(error.message);
			const stack = encodeURIComponent(error.stack || '');
			return Response.redirect(`${globalThis.urlOrigin}/error?message=${message}&stack=${stack}`, 302);
		}
	}
};