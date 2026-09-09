import { generateJWTToken, authenticate } from '@auth';
import { decompressGzipBase64 } from '@common';
import { getGlobals } from '@settings';
import { fallback } from './utils';

export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'login':
            return renderLogin(request, env);

        case 'login/authenticate':
            return generateJWTToken(request, env);

        default:
            return fallback(request);
    }
}

async function renderLogin(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    if (auth) {
        const panelURL = new URL('./panel', request.url)
        return Response.redirect(panelURL, 302);
    }

    const str = await decompressGzipBase64(LOGIN_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}