import { HttpStatus } from '@common';
import { TrOverWSHandler } from '@protocols/trojan';
import { VlOverWSHandler } from '@protocols/vless';
import { getGlobals } from '@settings';
import { fallback } from './utils';

export async function handleWebsocket(request: Request, env: Env): Promise<Response> {
    const { pathname } = getGlobals();
    const protocol = pathname.split('/')[1];

    try {
        switch (protocol) {
            case 'vl':
                return VlOverWSHandler(request, env);

            case 'tr':
                return TrOverWSHandler(request, env);

            default:
                return fallback(request);
        }
    } catch (error) {
        return new Response('Bad Request', { status: HttpStatus.BAD_REQUEST });
    }
}