import { decompressGzipBase64 } from '@common';
import { getGlobals } from '@settings';
import { fallback } from './utils';

export async function handleEasy(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const parts = pathname.split('/');
    const path = parts.slice(2).join('/');

    switch (path) {
        case 'easy':
        case 'quick':
        case 'connect':
            return renderEasy(request, env);

        default:
            return fallback(request);
    }
}

async function renderEasy(request: Request, env: Env): Promise<Response> {
    const str = await decompressGzipBase64(EASY_HTML_CONTENT);
    const html = str.replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}
