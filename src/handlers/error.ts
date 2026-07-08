import { decompressGzipBase64, safeError } from '@common';

export async function renderError(error: any): Promise<Response> {
    const str = await decompressGzipBase64(ERROR_HTML_CONTENT);
    const html = str
        .replace('__ERROR_MESSAGE__', safeError(error))
        .replaceAll('__ICON__', ICON_CONTENT);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}