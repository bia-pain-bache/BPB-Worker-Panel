import { Authenticate, generateJWTToken, resetPassword } from "#auth";
import { getClNormalConfig, getClWarpConfig } from "#configs/clash";
import { getSbCustomConfig, getSbWarpConfig } from "#configs/sing-box";
import { getXrCustomConfigs, getXrWarpConfigs } from "#configs/xray";
import { extractWireguardParams } from "#configs/utils";
import { getDataset, updateDataset } from "#kv";
import { fetchWarpConfigs } from "#protocols/warp";
import { globalConfig, httpConfig, wsConfig } from "#common/init";
import { VlOverWSHandler } from "#protocols/websocket/vless";
import { TrOverWSHandler } from "#protocols/websocket/trojan";
import JSZip from "jszip";
export let settings = {}

export async function handleWebsocket(request) {
    const encodedPathConfig = globalConfig.pathName.replace("/", "") || '';

    try {
        const { protocol, mode, panelIPs } = JSON.parse(atob(encodedPathConfig));

        Object.assign(wsConfig, {
            wsProtocol: protocol,
            proxyMode: mode,
            panelIPs: panelIPs
        });

        switch (protocol) {
            case 'vl':
                return await VlOverWSHandler(request);
            case 'tr':
                return await TrOverWSHandler(request);
            default:
                return await fallback(request);
        }

    } catch (error) {
        return new Response('Failed to parse WebSocket path config', { status: 400 });
    }
}

export async function handlePanel(request, env) {

    switch (globalConfig.pathName) {
        case '/panel':
            return await renderPanel(request, env);
        case '/panel/settings':
            return await getSettings(request, env);
        case '/panel/update-settings':
            return await updateSettings(request, env);
        case '/panel/reset-settings':
            return await resetSettings(request, env);
        case '/panel/reset-password':
            return await resetPassword(request, env);
        case '/panel/my-ip':
            return await getMyIP(request);
        case '/panel/update-warp':
            return await updateWarpConfigs(request, env);
        case '/panel/get-warp-configs':
            return await getWarpConfigs(request, env);
        default:
            return await fallback(request);
    }
}

export async function handleError(error) {
    const html = hexToString(__ERROR_HTML_CONTENT__).replace('__ERROR_MESSAGE__', error.message);

    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
    });
}

export async function handleLogin(request, env) {
    if (globalConfig.pathName === '/login') {
        return await renderLogin(request, env);
    }

    if (globalConfig.pathName === '/login/authenticate') {
        return await generateJWTToken(request, env);
    }

    return await fallback(request);
}

export async function handleSubscriptions(request, env) {
    const dataset = await getDataset(request, env);
    settings = dataset.settings;
    const { client, subPath } = httpConfig;
    const path = decodeURIComponent(globalConfig.pathName);

    switch (path) {
        case `/sub/normal/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(env, false);
                case 'sing-box':
                    return await getSbCustomConfig(env, false);
                case 'clash':
                    return await getClNormalConfig(env);
                default:
                    break;
            }

        case `/sub/fragment/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(env, true);
                case 'sing-box':
                    return await getSbCustomConfig(env, true);
                default:
                    break;
            }

        case `/sub/warp/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrWarpConfigs(request, env, false, false);
                case 'sing-box':
                    return await getSbWarpConfig(request, env);
                case 'clash':
                    return await getClWarpConfig(request, env, false);
                default:
                    break;
            }

        case `/sub/warp-pro/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrWarpConfigs(request, env, true, false);
                case 'xray-knocker':
                    return await getXrWarpConfigs(request, env, true, true);
                case 'clash':
                    return await getClWarpConfig(request, env, true);
                default:
                    break;
            }

        default:
            return await fallback(request);
    }
}

async function updateSettings(request, env) {
    if (request.method === 'POST') {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return await respond(false, 401, 'Unauthorized or expired session.');
        }

        const proxySettings = await updateDataset(request, env);
        return await respond(true, 200, null, proxySettings);
    }

    return await respond(false, 405, 'Method not allowed.');
}

async function resetSettings(request, env) {
    if (request.method === 'POST') {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return await respond(false, 401, 'Unauthorized or expired session.');
        }

        const proxySettings = await updateDataset(request, env);
        return await respond(true, 200, null, proxySettings);
    }

    return await respond(false, 405, 'Method not allowed!');
}

async function getSettings(request, env) {
    const isPassSet = await env.kv.get('pwd') ? true : false;
    const auth = await Authenticate(request, env);

    if (!auth) {
        return await respond(false, 401, 'Unauthorized or expired session.', { isPassSet });
    }

    const dataset = await getDataset(request, env);
    const data = {
        proxySettings: dataset.settings,
        isPassSet,
        subPath: httpConfig.subPath
    };

    return await respond(true, 200, null, data);
}

export async function fallback(request) {
    const { url, method, headers, body } = request;
    const newURL = new URL(url);
    newURL.hostname = globalConfig.fallbackDomain;
    newURL.protocol = 'https:';
    const newRequest = new Request(newURL.toString(), {
        method,
        headers,
        body,
        redirect: 'manual'
    });

    return await fetch(newRequest);
}

async function getMyIP(request) {
    const ip = await request.text();

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
        const geoLocation = await response.json();

        return await respond(true, 200, null, geoLocation);
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return await respond(false, 500, `Error fetching IP address: ${error}`)
    }
}

async function getWarpConfigs(request, env) {
    const isPro = httpConfig.client === 'amnezia';
    const auth = await Authenticate(request, env);

    if (!auth) {
        return new Response('Unauthorized or expired session.', { status: 401 });
    }

    const { warpConfigs, settings } = await getDataset(request, env);
    const warpConfig = extractWireguardParams(warpConfigs, false);
    const { warpIPv6, publicKey, privateKey } = warpConfig;
    const { warpEndpoints, amneziaNoiseCount, amneziaNoiseSizeMin, amneziaNoiseSizeMax } = settings;
    const zip = new JSZip();
    const trimLines = (string) => string.split("\n").map(line => line.trim()).join("\n");
    const amneziaNoise = isPro
        ?
        `Jc = ${amneziaNoiseCount}
        Jmin = ${amneziaNoiseSizeMin}
        Jmax = ${amneziaNoiseSizeMax}
        S1 = 0
        S2 = 0
        H1 = 0
        H2 = 0
        H3 = 0
        H4 = 0`
        : '';

    try {
        warpEndpoints.forEach((endpoint, index) => {
            zip.file(`${atob('QlBC')}-Warp-${index + 1}.conf`, trimLines(
                `[Interface]
                PrivateKey = ${privateKey}
                Address = 172.16.0.2/32, ${warpIPv6}
                DNS = 1.1.1.1, 1.0.0.1
                MTU = 1280
                ${amneziaNoise}
                [Peer]
                PublicKey = ${publicKey}
                AllowedIPs = 0.0.0.0/0, ::/0
                Endpoint = ${endpoint}
                PersistentKeepalive = 25`
            ));
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const arrayBuffer = await zipBlob.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${atob('QlBC')}-Warp-${isPro ? "Pro-" : ""}configs.zip"`,
            },
        });
    } catch (error) {
        return new Response(`Error generating ZIP file: ${error}`, { status: 500 });
    }
}

export async function serveIcon() {
    const faviconBase64 = __ICON__;
    const body = Uint8Array.from(atob(faviconBase64), c => c.charCodeAt(0));

    return new Response(body, {
        headers: {
            'Content-Type': 'image/x-icon',
            'Cache-Control': 'public, max-age=86400',
        }
    });
}

async function renderPanel(request, env) {
    const pwd = await env.kv.get('pwd');

    if (pwd) {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return Response.redirect(`${httpConfig.urlOrigin}/login`, 302);
        }
    }

    const html = hexToString(__PANEL_HTML_CONTENT__);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}

async function renderLogin(request, env) {
    const auth = await Authenticate(request, env);
    if (auth) {
        return Response.redirect(`${httpConfig.urlOrigin}/panel`, 302);
    }

    const html = hexToString(__LOGIN_HTML_CONTENT__);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}

export async function renderSecrets() {
    const html = hexToString(__SECRETS_HTML_CONTENT__);

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
    });
}

async function updateWarpConfigs(request, env) {
    if (request.method === 'POST') {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return await respond(false, 401, 'Unauthorized.');
        }

        try {
            await fetchWarpConfigs(env);
            return await respond(true, 200, 'Warp configs updated successfully!');
        } catch (error) {
            console.log(error);
            return await respond(false, 500, `An error occurred while updating Warp configs: ${error}`);
        }
    }

    return await respond(false, 405, 'Method not allowd.');
}

export async function respond(success, status, message, body, customHeaders) {
    return new Response(JSON.stringify({
        success,
        status,
        message: message || '',
        body: body || ''
    }), {
        headers: customHeaders || {
            'Content-Type': message ? 'text/plain' : 'application/json'
        }
    });
}

function hexToString(hex) {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
    const decoder = new TextDecoder();

    return decoder.decode(bytes);
}

export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}