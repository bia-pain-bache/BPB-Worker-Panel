import { getGlobals } from '@settings';

export async function handleDoH(request: Request): Promise<Response> {
    const { dohUrl, searchParams } = getGlobals();
    const targetURL = new URL(dohUrl);
    searchParams.forEach((value, key) => {
        targetURL.searchParams.set(key, value);
    });

    const proxyRequest = new Request(targetURL.toString(), request);
    return fetch(proxyRequest);
}