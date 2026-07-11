import { getClNormalConfig, getClWarpConfig } from '@cores/clash/configs';
import { getURLConfigs } from '@cores/common';
import { getSbCustomConfig, getSbWarpConfig } from '@cores/sing-box/configs';
import { getXrCustomConfigs, getXrWarpConfigs } from '@cores/xray/configs';
import { setSettings, getGlobals, getKvSettings, getSharedSettings } from '@settings';
import { fallback } from './utils';
import { getWarpConfigs } from '@cores/wireguard';
import { HttpStatus } from '@common';
import { SharedSettings } from '#types/settings';

export async function handleSubscriptions(request: Request, env: Env): Promise<Response> {
    await setSettings(env);
    const { pathname, client } = getGlobals();
    const path = pathname.split('/')[3];

    switch (path) {
        case 'normal':
            switch (client) {
                case 'xray':
                    return getXrCustomConfigs(false);

                case 'sing-box':
                    return getSbCustomConfig(false);

                case 'clash':
                    return getClNormalConfig();

                default:
                    break;
            }

        case 'raw':
            switch (client) {
                case 'xray':
                case 'sing-box':
                    return getURLConfigs();

                default:
                    break;
            }

        case 'fragment':
            switch (client) {
                case 'xray':
                    return getXrCustomConfigs(true);

                case 'sing-box':
                    return getSbCustomConfig(true);

                default:
                    break;
            }

        case 'warp':
            switch (client) {
                case 'xray':
                    return getXrWarpConfigs(false, false);

                case 'sing-box':
                    return getSbWarpConfig();

                case 'clash':
                    return getClWarpConfig(false);

                case 'wireguard':
                    return getWarpConfigs(false);

                default:
                    break;
            }

        case 'warp-pro':
            switch (client) {
                case 'xray':
                    return getXrWarpConfigs(true, false);

                case 'xray-knocker':
                    return getXrWarpConfigs(true, true);

                case 'clash':
                    return getClWarpConfig(true);

                case 'wireguard':
                    return getWarpConfigs(true);

                default:
                    break;
            }

        case 'share-settings':
            return shareSettings();

        default:
            return fallback(request);
    }
}

async function shareSettings() {
    const sharedSettings: SharedSettings = getSharedSettings();
    const body = btoa(JSON.stringify(sharedSettings));

    return new Response(body, {
        status: HttpStatus.OK,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename=${_project_}-Settings.dat`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}