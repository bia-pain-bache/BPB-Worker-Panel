import { getGlobals } from '@settings';

export async function handleDoH(request: Request): Promise<Response> {
    const { dohUrl } = getGlobals();
    const url = new URL(request.url);
    const targetURL = new URL(dohUrl);
    url.searchParams.forEach((value, key) => {
        targetURL.searchParams.set(key, value);
    });

    const proxyRequest = new Request(targetURL.toString(), request);
    return fetch(proxyRequest);
}