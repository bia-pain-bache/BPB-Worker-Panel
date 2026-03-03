import { Authenticate, generateJWTToken, resetPassword } from "auth";
import { getDataset, updateDataset } from "kv";
import { setSettings } from "@init";
import { getClNormalConfig, getClWarpConfig } from "@clash/configs";
import { getSbCustomConfig, getSbWarpConfig } from "@sing-box/configs";
import { getXrCustomConfigs, getXrWarpConfigs } from "@xray/configs";
import { fetchWarpAccounts } from "@warp";
import { VlOverWSHandler } from "@vless";
import { TrOverWSHandler } from "@trojan";
import JSZip from "jszip";
import { base64EncodeUtf8, HttpStatus, respond } from "@common";
import { generateRemark, generateWsPath, getConfigAddresses, randomUpperCase, resolveDNS } from "@utils";

export async function handleWebsocket(request: Request): Promise<Response> {
    const { pathName } = globalThis.globalConfig;
    const encodedPathConfig = pathName.replace("/", "");

    try {
        const { protocol, mode, panelIPs } = JSON.parse(atob(encodedPathConfig));
        globalThis.wsConfig = {
            ...globalThis.wsConfig,
            wsProtocol: protocol,
            proxyMode: mode,
            panelIPs: panelIPs
        };

        switch (protocol) {
            case 'vl':
                return await VlOverWSHandler(request);

            case 'tr':
                return await TrOverWSHandler(request);

            default:
                return await fallback(request);
        }

    } catch (error) {
        return new Response('Failed to parse WebSocket path config', { status: HttpStatus.BAD_REQUEST });
    }
}

export async function handlePanel(request: Request, env: Env): Promise<Response> {
    const { pathName } = globalThis.globalConfig;

    switch (pathName) {
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

export async function handleProxyIPs(request: Request, env: Env): Promise<Response> {
    const auth = await Authenticate(request, env);

    if (!auth) {
        const { urlOrigin } = globalThis.httpConfig;
        return Response.redirect(`${urlOrigin}/login`, 302);
    }

    const { pathName } = globalThis.globalConfig;

    switch (pathName) {
        case '/proxy-ip':
            return await renderProxyIPs();

        case '/proxy-ip/get':
            return await getProxyIPsInfo();

        default:
            return await fallback(request);
    }
}

export async function renderError(error: any): Promise<Response> {
    const message = error instanceof Error ? error.message : String(error);
    const html = await decompressHtml(__ERROR_HTML_CONTENT__, true) as string;
    const errorPage = html.replace('__ERROR_MESSAGE__', message);

    return new Response(errorPage, {
        status: HttpStatus.OK,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function renderProxyIPs() {
    const html = await decompressHtml(__PROXY_IP_HTML_CONTENT__, false);
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const { pathName } = globalThis.globalConfig;

    if (pathName === '/login') {
        return await renderLogin(request, env);
    }

    if (pathName === '/login/authenticate') {
        return await generateJWTToken(request, env);
    }

    return await fallback(request);
}

export function logout(): Response {
    return respond(true, HttpStatus.OK, 'Successfully logged out!', null, {
        'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain'
    });
}

export async function handleSubscriptions(request: Request, env: Env): Promise<Response> {
    await setSettings(request, env);
    const {
        globalConfig: { pathName },
        httpConfig: { client, subPath }
    } = globalThis;

    switch (pathName) {
        case `/sub/normal/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(false);

                case 'sing-box':
                    return await getSbCustomConfig(false);

                case 'clash':
                    return await getClNormalConfig();

                default:
                    break;
            }

        case `/sub/raw/${subPath}`:
            switch (client) {
                case 'xray':
                case 'sing-box':
                    return await getURLConfigs();

                default:
                    break;
            }

        case `/sub/fragment/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(true);

                case 'sing-box':
                    return await getSbCustomConfig(true);

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

async function updateSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    }

    const proxySettings = await updateDataset(request, env);
    return respond(true, HttpStatus.OK, '', proxySettings);
}

async function resetSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed!');
    }

    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    }

    try {
        const { settings } = globalThis;
        await env.kv.put("proxySettings", JSON.stringify(settings));
        return respond(true, HttpStatus.OK, '', settings);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(error);
        throw new Error(`An error occurred while updating KV: ${message}`);
    }
}

async function getSettings(request: Request, env: Env): Promise<Response> {
    const isPassSet = Boolean(await env.kv.get('pwd'));
    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', { isPassSet });
    }

    const dataset = await getDataset(request, env);
    const { subPath } = globalThis.httpConfig;

    const data = {
        proxySettings: dataset.settings,
        isPassSet,
        subPath: subPath
    };

    return respond(true, HttpStatus.OK, undefined, data);
}

export async function fallback(request: Request): Promise<Response> {
    const { fallbackDomain } = globalThis.globalConfig;
    const { url, method, headers, body } = request;

    const newURL = new URL(url);
    newURL.hostname = fallbackDomain;
    newURL.protocol = 'https:';
    const newRequest = new Request(newURL.toString(), {
        method,
        headers,
        body,
        redirect: 'manual'
    });

    return await fetch(newRequest);
}

async function getMyIP(request: Request): Promise<Response> {
    const ip = await request.text();

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
        const geoLocation = await response.json();

        return respond(true, HttpStatus.OK, '', geoLocation);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error fetching IP address:', error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error fetching IP address: ${message}`)
    }
}

async function getWarpConfigs(request: Request, env: Env): Promise<Response> {
    const {
        httpConfig: { client },
        dict: { _project_ }
    } = globalThis;

    const isPro = client === 'amnezia';
    const auth = await Authenticate(request, env);

    if (!auth) {
        return new Response('Unauthorized or expired session.', { status: HttpStatus.UNAUTHORIZED });
    }

    const { warpAccounts, settings } = await getDataset(request, env);
    const { warpIPv6, publicKey, privateKey } = warpAccounts[0];
    const {
        warpEndpoints,
        warpRemoteDNS,
        amneziaNoiseCount,
        amneziaNoiseSizeMin,
        amneziaNoiseSizeMax
    } = settings;

    const zip = new JSZip();
    const trimLines = (str: string) => str.split("\n").map(line => line.trim()).join("\n");

    try {
        warpEndpoints?.forEach((endpoint, index) => {
            const config =
                `[Interface]
                PrivateKey = ${privateKey}
                Address = 172.16.0.2/32, ${warpIPv6}
                DNS = ${warpRemoteDNS}
                MTU = 1280
                ${isPro ?
                    `Jc = ${amneziaNoiseCount}
                    Jmin = ${amneziaNoiseSizeMin}
                    Jmax = ${amneziaNoiseSizeMax}
                    S1 = 0
                    S2 = 0
                    H1 = 0
                    H2 = 0
                    H3 = 0
                    H4 = 0`
                    : ''
                }
                [Peer]
                PublicKey = ${publicKey}
                AllowedIPs = 0.0.0.0/0, ::/0
                Endpoint = ${endpoint}
                PersistentKeepalive = 25`;

            zip.file(`${_project_}-Warp-${index + 1}.conf`, trimLines(config));
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const arrayBuffer = await zipBlob.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${_project_}-Warp-${isPro ? "Pro-" : ""}configs.zip"`,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return new Response(`Error generating ZIP file: ${message}`, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

async function getProxyIPsInfo(): Promise<Response> {
    const ips = await resolveDNS(globalThis.dict._public_proxy_ip_, true);
    const geoLocInfo = await geoLookupBatch(ips.ipv4);
    return respond(true, HttpStatus.OK, undefined, geoLocInfo);
}

export async function serveIcon(): Promise<Response> {
    const faviconBase64 = __ICON__;
    const body = Uint8Array.from(atob(faviconBase64), c => c.charCodeAt(0));

    return new Response(body, {
        headers: {
            'Content-Type': 'image/x-icon',
            'Cache-Control': 'public, max-age=86400',
        }
    });
}

async function renderPanel(request: Request, env: Env): Promise<Response> {
    const pwd = await env.kv.get('pwd');

    if (pwd) {
        const auth = await Authenticate(request, env);
        if (!auth) {
            const { urlOrigin } = globalThis.httpConfig;
            return Response.redirect(`${urlOrigin}/login`, 302);
        }
    }

    const html = await decompressHtml(__PANEL_HTML_CONTENT__, false);
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

async function renderLogin(request: Request, env: Env): Promise<Response> {
    const auth = await Authenticate(request, env);
    if (auth) {
        const { urlOrigin } = globalThis.httpConfig;
        return Response.redirect(`${urlOrigin}/panel`, 302);
    }

    const html = await decompressHtml(__LOGIN_HTML_CONTENT__, false);
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}

export async function renderSecrets(): Promise<Response> {
    const html = await decompressHtml(__SECRETS_HTML_CONTENT__, false);
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}

async function updateWarpConfigs(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
        }

        try {
            await fetchWarpAccounts(env);
            return respond(true, HttpStatus.OK, 'Warp configs updated successfully!');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(error);
            return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `An error occurred while updating Warp configs: ${message}`);
        }
    }

    return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
}

async function decompressHtml(content: string, asString: boolean): Promise<string | ReadableStream<Uint8Array>> {
    const bytes = Uint8Array.from(atob(content), c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));

    if (asString) {
        const decompressedArrayBuffer = await new Response(stream).arrayBuffer();
        const decodedString = new TextDecoder().decode(decompressedArrayBuffer);
        return decodedString;
    }

    return stream;
}

export async function handleDoH(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const { subPath } = globalThis.httpConfig;
    const { dohURL } = globalThis.globalConfig;

    if (url.pathname !== `/dns-query/${subPath}`) {
        return fallback(request);
    }

    const targetURL = new URL(dohURL);
    url.searchParams.forEach((value, key) => {
        targetURL.searchParams.set(key, value);
    });

    const proxyRequest = new Request(targetURL.toString(), request);
    return fetch(proxyRequest);
}

interface IpApiBatchResponse {
    query: string;
    city?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
    status: "success" | "fail";
    message?: string;
}

interface GeoResult {
    ip: string;
    city?: string;
    country?: string;
    countryCode?: string;
    isp?: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}

async function geoLookupBatch(ipList: string[]): Promise<GeoResult[]> {
    const batches = chunkArray(ipList, 100);
    const results: GeoResult[] = [];

    for (const batch of batches) {
        const res = await fetch(
            "http://ip-api.com/batch?fields=query,city,country,countryCode,isp,status",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(batch),
            }
        );

        if (!res.ok) {
            throw new Error(`ip-api request failed: ${res.status}`);
        }

        const data: IpApiBatchResponse[] = await res.json();

        for (const item of data) {
            if (item.status === "success") {
                results.push({
                    ip: item.query,
                    city: item.city,
                    country: item.country,
                    countryCode: item.countryCode,
                    isp: item.isp,
                });
            }
        }
    }

    return results;
}

export async function getURLConfigs() {
    const {
        globalConfig: { userID, TrPass },
        httpConfig: { defaultHttpsPorts, client, hostName },
        dict: { _VL_, _TR_, _project_ },
        settings: {
            fingerprint,
            ports,
            customCdnAddrs,
            customCdnHost,
            customCdnSni,
            VLConfigs,
            TRConfigs,
            outProxy,
            remoteDNS
        }
    } = globalThis;

    const buildConfig = (protocol: string, addr: string, port: number, host: string, sni: string, remark: string) => {
        const isTLS = defaultHttpsPorts.includes(port);
        const security = isTLS ? 'tls' : 'none';
        const config = new URL(`${protocol}://config`);

        if (protocol === _VL_) {
            config.username = userID;
            config.searchParams.append('encryption', 'none');
        } else {
            config.username = TrPass;
        }

        const path = generateWsPath(protocol);
        config.hostname = addr;
        config.port = port.toString();
        config.searchParams.append('host', host);
        config.searchParams.append('type', 'ws');
        config.searchParams.append('security', security);
        config.hash = remark;

        if (client === 'sing-box') {
            config.searchParams.append('eh', 'Sec-WebSocket-Protocol');
            config.searchParams.append('ed', '2560');
            config.searchParams.append('path', path);
        } else {
            config.searchParams.append('path', `${path}?ed=2560`);
        }

        if (isTLS) {
            config.searchParams.append('sni', sni);
            config.searchParams.append('fp', fingerprint);
            config.searchParams.append('alpn', 'http/1.1');
        }

        return config.href;
    }

    let VLConfs = '', TRConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const addrs = await getConfigAddresses(false);

    ports.forEach(port => {
        addrs.forEach(addr => {
            const isCustomAddr = customCdnAddrs.includes(addr);
            const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
            const host = isCustomAddr ? customCdnHost : hostName;

            if (VLConfigs) {
                const remark = generateRemark(proxyIndex, port, addr, _VL_, false, false);
                const vlConfig = buildConfig(atob('dmxlc3M='), addr, port, host, sni, remark);
                VLConfs += `${vlConfig}\n`;
            }

            if (TRConfigs) {
                const remark = generateRemark(proxyIndex, port, addr, _TR_, false, false);
                const trConfig = buildConfig(atob('dHJvamFu'), addr, port, host, sni, remark);
                TRConfs += `${trConfig}\n`;
            }

            proxyIndex++;
        });
    });

    if (outProxy) {
        let chainRemark = `#${encodeURIComponent('💦 Chain proxy 🔗')}`;
        if (outProxy.startsWith('socks') || outProxy.startsWith('http')) {
            const regex = /^(?:socks|http):\/\/([^@]+)@/;
            const isUserPass = outProxy.match(regex);
            const userPass = isUserPass ? isUserPass[1] : false;
            chainProxy = userPass
                ? outProxy.replace(userPass, btoa(userPass)) + chainRemark
                : outProxy + chainRemark;
        } else {
            chainProxy = outProxy.split('#')[0] + chainRemark;
        }
    }

    const configs = btoa(VLConfs + TRConfs + chainProxy);
    return new Response(configs, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'CDN-Cache-Control': 'no-store',
            'Profile-Title': `base64:${base64EncodeUtf8(`💦 ${_project_} Raw`)}`,
            'DNS': remoteDNS
        }
    });
}