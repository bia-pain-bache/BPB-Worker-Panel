import { HttpStatus } from '@common';
import { getGlobals } from '@settings';

export async function fallback(request: Request): Promise<Response> {
    const { url, method, headers, body } = request;
    const { fallback } = getGlobals();

    if (!fallback) return new Response('Not Found', { status: HttpStatus.NOT_FOUND });

    const newURL = new URL(url);
    newURL.hostname = fallback;
    newURL.protocol = 'https:';
    const newRequest = new Request(newURL.toString(), {
        method,
        headers,
        body,
        redirect: 'manual'
    });

    return fetch(newRequest);
}