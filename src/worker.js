// https://github.com/bia-pain-bache/BPB-Worker-Panel
import { connect } from 'cloudflare:sockets';
import nacl from 'tweetnacl';
import sha256 from 'js-sha256';
import { SignJWT, jwtVerify } from 'jose';

// How to generate your own UUID:
// https://www.uuidgenerator.net/
let userID = '89b3cbba-e6ac-485a-9481-976a0415eab9';
let trojanPassword = `bpb-trojan`;

// https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
const proxyIPs= ['bpb.yousef.isegaro.com'];
const defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
let dohURL = 'https://cloudflare-dns.com/dns-query';
let hashPassword;
let panelVersion = '2.7';

export default {
    /**
     * @param {import("@cloudflare/workers-types").Request} request
     * @param {{UUID: string, PROXYIP: string, DNS_RESOLVER_URL: string}} env
     * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
     * @returns {Promise<Response>}
     */
    async fetch(request, env) {
        try {          
            userID = env.UUID || userID;
            proxyIP = env.PROXYIP || proxyIP;
            dohURL = env.DNS_RESOLVER_URL || dohURL;
            trojanPassword = env.TROJAN_PASS || trojanPassword;
            hashPassword = sha256.sha224(trojanPassword);
            if (!isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`);
            const upgradeHeader = request.headers.get('Upgrade');
            const url = new URL(request.url);
            
            if (!upgradeHeader || upgradeHeader !== 'websocket') {
                
                const searchParams = new URLSearchParams(url.search);
                const host = request.headers.get('Host');
                const client = searchParams.get('app');
                const { kvNotFound, proxySettings: settings, warpConfigs } = await getDataset(env);
                if (kvNotFound) {
                    const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                    return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                } 

                switch (url.pathname) {

                    case '/cf':
                        return new Response(JSON.stringify(request.cf, null, 4), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                        });
                        
                    case '/update-warp':
                        const Auth = await Authenticate(request, env); 
                        if (!Auth) return new Response('Unauthorized', { status: 401 });
                        if (request.method === 'POST') {
                            try {
                                const { error: warpPlusError } = await fetchWgConfig(env, settings);
                                if (warpPlusError) {
                                    return new Response(warpPlusError, { status: 400 });
                                } else {
                                    return new Response('Warp configs updated successfully', { status: 200 });
                                }
                            } catch (error) {
                                console.log(error);
                                return new Response(`An error occurred while updating Warp configs! - ${error}`, { status: 500 });
                            }

                        } else {
                            return new Response('Unsupported request', { status: 405 });
                        }

                    case `/sub/${userID}`:
                        if (client === 'sfa') {
                            const BestPingSFA = await getSingBoxCustomConfig(env, settings, host, client, false);
                            return new Response(JSON.stringify(BestPingSFA, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'clash') {
                            const BestPingClash = await getClashNormalConfig(env, settings, host);
                            return new Response(JSON.stringify(BestPingClash, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        if (client === 'xray') {
                            const xrayFullConfigs = await getXrayCustomConfigs(env, settings, host, false);
                            return new Response(JSON.stringify(xrayFullConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        const normalConfigs = await getNormalConfigs(settings, host, client);
                        return new Response(normalConfigs, { 
                            status: 200,
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });                        

                    case `/fragsub/${userID}`:
                        let fragConfigs = client === 'hiddify'
                            ? await getSingBoxCustomConfig(env, settings, host, client, true)
                            : await getXrayCustomConfigs(env, settings, host, true);

                        return new Response(JSON.stringify(fragConfigs, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });

                    case `/warpsub/${userID}`:
                        if (client === 'clash') {
                            const clashWarpConfig = await getClashWarpConfig(settings, warpConfigs);
                            return new Response(JSON.stringify(clashWarpConfig, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'singbox' || client === 'hiddify') {
                            const singboxWarpConfig = await getSingBoxWarpConfig(settings, warpConfigs, client);
                            return new Response(JSON.stringify(singboxWarpConfig, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'CDN-Cache-Control': 'no-store'
                                }
                            });                            
                        }

                        const warpConfig = await getXrayWarpConfigs(settings, warpConfigs, client);
                        return new Response(JSON.stringify(warpConfig, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'CDN-Cache-Control': 'no-store'
                            }
                        });

                    case '/panel':
                        const pwd = await env.bpb.get('pwd');
                        const isAuth = await Authenticate(request, env); 
                        if (request.method === 'POST') {     
                            if (!isAuth) return new Response('Unauthorized or expired session!', { status: 401 });
                            const formData = await request.formData();
                            const isReset = formData.get('resetSettings') === 'true';             
                            isReset 
                                ? await updateDataset(env, null, true) 
                                : await updateDataset(env, formData);

                            return new Response('Success', { status: 200 });
                        }
                        
                        if (pwd && !isAuth) return Response.redirect(`${url.origin}/login`, 302);
                        const isPassSet = pwd?.length >= 8;
                        const homePage = renderHomePage(settings, host, isPassSet);
                        return new Response(homePage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin'
                            }
                        });
                                                      
                    case '/login':
                        if (typeof env.bpb !== 'object') {
                            const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                        }

                        const loginAuth = await Authenticate(request, env);
                        if (loginAuth) return Response.redirect(`${url.origin}/panel`, 302);
                        let secretKey = await env.bpb.get('secretKey');
                        if (!secretKey) {
                            secretKey = generateSecretKey();
                            await env.bpb.put('secretKey', secretKey);
                        }

                        if (request.method === 'POST') {
                            const password = await request.text();
                            const savedPass = await env.bpb.get('pwd');

                            if (password === savedPass) {
                                const jwtToken = await generateJWTToken(secretKey);
                                const cookieHeader = `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;                 
                                return new Response('Success', {
                                    status: 200,
                                    headers: {
                                      'Set-Cookie': cookieHeader,
                                      'Content-Type': 'text/plain',
                                    }
                                });        
                            } else {
                                return new Response('Method Not Allowed', { status: 405 });
                            }
                        }
                        
                        const loginPage = renderLoginPage();
                        return new Response(loginPage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin'
                            }
                        });
                    
                    case '/logout':                        
                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain'
                            }
                        });        

                    case '/panel/password':
                        const oldPwd = await env.bpb.get('pwd');
                        let passAuth = await Authenticate(request, env);
                        if (oldPwd && !passAuth) return new Response('Unauthorized!', { status: 401 });           
                        const newPwd = await request.text();
                        if (newPwd === oldPwd) return new Response('Please enter a new Password!', { status: 400 });
                        await env.bpb.put('pwd', newPwd);
                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain',
                            }
                        });

                    default:
                        return new Response('Not found', { status: 404 });
                        url.hostname = 'www.speedtest.net';
                        url.protocol = 'https:';
                        request = new Request(url, request);
                        return await fetch(request);
                }
            } else {
                return url.pathname.startsWith('/tr') 
                    ? await trojanOverWSHandler(request) 
                    : await vlessOverWSHandler(request);
            }
        } catch (err) {
            const errorPage = renderErrorPage('Something went wrong!', err, false);
            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
        }
    }
};

/**
 * Handles VLESS over WebSocket requests by creating a WebSocket pair, accepting the WebSocket connection, and processing the VLESS header.
 * @param {import("@cloudflare/workers-types").Request} request The incoming request object.
 * @returns {Promise<Response>} A Promise that resolves to a WebSocket response object.
 */
async function vlessOverWSHandler(request) {
    /** @type {import("@cloudflare/workers-types").WebSocket[]} */
    // @ts-ignore
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);

    webSocket.accept();

    let address = "";
    let portWithRandomLog = "";
    const log = (/** @type {string} */ info, /** @type {string | undefined} */ event) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
    };
    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";

    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

    /** @type {{ value: import("@cloudflare/workers-types").Socket | null}}*/
    let remoteSocketWapper = {
        value: null,
    };
    let udpStreamWrite = null;
    let isDns = false;

    // ws --> remote
    readableWebSocketStream
    .pipeTo(
        new WritableStream({
            async write(chunk, controller) {
                if (isDns && udpStreamWrite) {
                    return udpStreamWrite(chunk);
                }
                if (remoteSocketWapper.value) {
                    const writer = remoteSocketWapper.value.writable.getWriter();
                    await writer.write(chunk);
                    writer.releaseLock();
                    return;
                }

                const {
                    hasError,
                    message,
                    portRemote = 443,
                    addressRemote = "",
                    rawDataIndex,
                    vlessVersion = new Uint8Array([0, 0]),
                    isUDP,
                } = await processVlessHeader(chunk, userID);
                address = addressRemote;
                portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? "udp " : "tcp "} `;
                if (hasError) {
                    // controller.error(message);
                    throw new Error(message); // cf seems has bug, controller.error will not end stream
                    // webSocket.close(1000, message);
                    return;
                }
                // if UDP but port not DNS port, close it
                if (isUDP) {
                    if (portRemote === 53) {
                        isDns = true;
                    } else {
                        // controller.error('UDP proxy only enable for DNS which is port 53');
                        throw new Error("UDP proxy only enable for DNS which is port 53"); // cf seems has bug, controller.error will not end stream
                        return;
                    }
                }
                // ["version", "附加信息长度 N"]
                const vlessResponseHeader = new Uint8Array([vlessVersion[0], 0]);
                const rawClientData = chunk.slice(rawDataIndex);

                // TODO: support udp here when cf runtime has udp support
                if (isDns) {
                    const { write } = await handleUDPOutBound(webSocket, vlessResponseHeader, log);
                    udpStreamWrite = write;
                    udpStreamWrite(rawClientData);
                    return;
                }

                handleTCPOutBound(
                    request,
                    remoteSocketWapper,
                    addressRemote,
                    portRemote,
                    rawClientData,
                    webSocket,
                    vlessResponseHeader,
                    log
                );
            },
            close() {
                log(`readableWebSocketStream is close`);
            },
            abort(reason) {
                log(`readableWebSocketStream is abort`, JSON.stringify(reason));
            },
        })
    )
    .catch((err) => {
        log("readableWebSocketStream pipeTo error", err);
    });

    return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client,
    });
}

/**
 * Checks if a given UUID is present in the API response.
 * @param {string} targetUuid The UUID to search for.
 * @returns {Promise<boolean>} A Promise that resolves to true if the UUID is present in the API response, false otherwise.
 */
async function checkUuidInApiResponse(targetUuid) {
    // Check if any of the environment variables are empty
  
    try {
        const apiResponse = await getApiResponse();
        if (!apiResponse) {
            return false;
        }
        const isUuidInResponse = apiResponse.users.some((user) => user.uuid === targetUuid);
        return isUuidInResponse;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

async function trojanOverWSHandler(request) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();
    let address = "";
    let portWithRandomLog = "";
    const log = (info, event) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
    };
    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
    let remoteSocketWapper = {
      value: null,
    };
    let udpStreamWrite = null;

    readableWebSocketStream
        .pipeTo(
            new WritableStream({
                async write(chunk, controller) {
                    if (udpStreamWrite) {
                        return udpStreamWrite(chunk);
                    }

                    if (remoteSocketWapper.value) {
                        const writer = remoteSocketWapper.value.writable.getWriter();
                        await writer.write(chunk);
                        writer.releaseLock();
                        return;
                    }

                    const {
                        hasError,
                        message,
                        portRemote = 443,
                        addressRemote = "",
                        rawClientData,
                    } = await parseTrojanHeader(chunk);

                    address = addressRemote;
                    portWithRandomLog = `${portRemote}--${Math.random()} tcp`;

                    if (hasError) {
                        throw new Error(message);
                        return;
                    }

                    handleTCPOutBound(request, remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, false, log);
                },
                close() {
                    log(`readableWebSocketStream is closed`);
                },
                abort(reason) {
                    log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
                },
            })
        )
        .catch((err) => {
            log("readableWebSocketStream pipeTo error", err);
        });

        return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client,
    });
}

async function parseTrojanHeader(buffer) {
    if (buffer.byteLength < 56) {
        return {
            hasError: true,
            message: "invalid data",
        };
    }

    let crLfIndex = 56;
    if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
        return {
            hasError: true,
            message: "invalid header format (missing CR LF)",
        };
    }

    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    if (password !== hashPassword) {
        return {
            hasError: true,
            message: "invalid password",
        };
    }

    const socks5DataBuffer = buffer.slice(crLfIndex + 2);
    if (socks5DataBuffer.byteLength < 6) {
        return {
            hasError: true,
            message: "invalid SOCKS5 request data",
        };
    }

    const view = new DataView(socks5DataBuffer);
    const cmd = view.getUint8(0);
    if (cmd !== 1) {
        return {
            hasError: true,
            message: "unsupported command, only TCP (CONNECT) is allowed",
        };
    }

    const atype = view.getUint8(1);
    // 0x01: IPv4 address
    // 0x03: Domain name
    // 0x04: IPv6 address
    let addressLength = 0;
    let addressIndex = 2;
    let address = "";
    switch (atype) {
        case 1:
            addressLength = 4;
            address = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)).join(".");
            break;
        case 3:
            addressLength = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + 1))[0];
            addressIndex += 1;
            address = new TextDecoder().decode(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            break;
        case 4:
            addressLength = 16;
            const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            address = ipv6.join(":");
            break;
        default:
            return {
                hasError: true,
                message: `invalid addressType is ${atype}`,
            };
    }

    if (!address) {
        return {
            hasError: true,
            message: `address is empty, addressType is ${atype}`,
        };
    }

    const portIndex = addressIndex + addressLength;
    const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
    const portRemote = new DataView(portBuffer).getUint16(0);
    return {
        hasError: false,
        addressRemote: address,
        portRemote,
        rawClientData: socks5DataBuffer.slice(portIndex + 4),
    };
}

/**
 * Handles outbound TCP connections.
 *
 * @param {any} remoteSocket
 * @param {string} addressRemote The remote address to connect to.
 * @param {number} portRemote The remote port to connect to.
 * @param {Uint8Array} rawClientData The raw client data to write.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket to pass the remote socket to.
 * @param {Uint8Array} vlessResponseHeader The VLESS response header.
 * @param {function} log The logging function.
 * @returns {Promise<void>} The remote socket.
 */
async function handleTCPOutBound(
    request,
    remoteSocket,
    addressRemote,
    portRemote,
    rawClientData,
    webSocket,
    vlessResponseHeader,
    log
) {
    async function connectAndWrite(address, port) {
        if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) address = `${atob('d3d3Lg==')}${address}${atob('LnNzbGlwLmlv')}`;
        /** @type {import("@cloudflare/workers-types").Socket} */
        const tcpSocket = connect({
            hostname: address,
            port: port,
        });
        remoteSocket.value = tcpSocket;
        log(`connected to ${address}:${port}`);
        const writer = tcpSocket.writable.getWriter();
        await writer.write(rawClientData); // first write, nomal is tls client hello
        writer.releaseLock();
        return tcpSocket;
    }
  
    // if the cf connect tcp socket have no incoming data, we retry to redirect ip
    async function retry() {
        const { pathname } = new URL(request.url);
        let panelProxyIP = pathname.split('/')[2];
        panelProxyIP = panelProxyIP ? atob(panelProxyIP) : undefined;
		const tcpSocket = await connectAndWrite(panelProxyIP || proxyIP || addressRemote, portRemote);
        // no matter retry success or not, close websocket
        tcpSocket.closed
            .catch((error) => {
                console.log("retry tcpSocket closed error", error);
            })
            .finally(() => {
                safeCloseWebSocket(webSocket);
            });
            
        vlessResponseHeader 
            ? vlessRemoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, null, log) 
            : trojanRemoteSocketToWS(tcpSocket, webSocket, null, log);
    }
  
    const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  
    // when remoteSocket is ready, pass to websocket
    // remote--> ws
    vlessResponseHeader
        ? vlessRemoteSocketToWS(tcpSocket, webSocket, vlessResponseHeader, retry, log) 
        : trojanRemoteSocketToWS(tcpSocket, webSocket, retry, log);
}

/**
 * Creates a readable stream from a WebSocket server, allowing for data to be read from the WebSocket.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocketServer The WebSocket server to create the readable stream from.
 * @param {string} earlyDataHeader The header containing early data for WebSocket 0-RTT.
 * @param {(info: string)=> void} log The logging function.
 * @returns {ReadableStream} A readable stream that can be used to read data from the WebSocket.
 */
function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
    let readableStreamCancel = false;
    const stream = new ReadableStream({
        start(controller) {
            webSocketServer.addEventListener("message", (event) => {
                if (readableStreamCancel) {
                    return;
                }
                const message = event.data;
                controller.enqueue(message);
            });
    
            // The event means that the client closed the client -> server stream.
            // However, the server -> client stream is still open until you call close() on the server side.
            // The WebSocket protocol says that a separate close message must be sent in each direction to fully close the socket.
            webSocketServer.addEventListener("close", () => {
                // client send close, need close server
                // if stream is cancel, skip controller.close
                safeCloseWebSocket(webSocketServer);
                if (readableStreamCancel) {
                    return;
                }
                controller.close();
            });
            webSocketServer.addEventListener("error", (err) => {
                log("webSocketServer has error");
                controller.error(err);
            });
            // for ws 0rtt
            const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },
        pull(controller) {
            // if ws can stop read if stream is full, we can implement backpressure
            // https://streams.spec.whatwg.org/#example-rs-push-backpressure
        },
        cancel(reason) {
            // 1. pipe WritableStream has error, this cancel will called, so ws handle server close into here
            // 2. if readableStream is cancel, all controller.close/enqueue need skip,
            // 3. but from testing controller.error still work even if readableStream is cancel
            if (readableStreamCancel) {
                return;
            }
            log(`ReadableStream was canceled, due to ${reason}`);
            readableStreamCancel = true;
            safeCloseWebSocket(webSocketServer);
        },
    });
  
    return stream;
}

// https://xtls.github.io/development/protocols/vless.html
// https://github.com/zizifn/excalidraw-backup/blob/main/v2ray-protocol.excalidraw

/**
 * Processes the VLESS header buffer and returns an object with the relevant information.
 * @param {ArrayBuffer} vlessBuffer The VLESS header buffer to process.
 * @param {string} userID The user ID to validate against the UUID in the VLESS header.
 * @returns {{
 *  hasError: boolean,
 *  message?: string,
 *  addressRemote?: string,
 *  addressType?: number,
 *  portRemote?: number,
 *  rawDataIndex?: number,
 *  vlessVersion?: Uint8Array,
 *  isUDP?: boolean
 * }} An object with the relevant information extracted from the VLESS header buffer.
 */
async function processVlessHeader(vlessBuffer, userID) {
    if (vlessBuffer.byteLength < 24) {
        return {
            hasError: true,
            message: "invalid data",
        };
    }
    const version = new Uint8Array(vlessBuffer.slice(0, 1));
    let isValidUser = false;
    let isUDP = false;
    const slicedBuffer = new Uint8Array(vlessBuffer.slice(1, 17));
    const slicedBufferString = stringify(slicedBuffer);

    const uuids = userID.includes(",") ? userID.split(",") : [userID];

    const checkUuidInApi = await checkUuidInApiResponse(slicedBufferString);
    isValidUser = uuids.some((userUuid) => checkUuidInApi || slicedBufferString === userUuid.trim());

    console.log(`checkUuidInApi: ${await checkUuidInApiResponse(slicedBufferString)}, userID: ${slicedBufferString}`);

    if (!isValidUser) {
        return {
            hasError: true,
            message: "invalid user",
        };
    }

    const optLength = new Uint8Array(vlessBuffer.slice(17, 18))[0];
    //skip opt for now

    const command = new Uint8Array(vlessBuffer.slice(18 + optLength, 18 + optLength + 1))[0];

    // 0x01 TCP
    // 0x02 UDP
    // 0x03 MUX
    if (command === 1) {
    } else if (command === 2) {
        isUDP = true;
    } else {
        return {
            hasError: true,
            message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
        };
    }
    const portIndex = 18 + optLength + 1;
    const portBuffer = vlessBuffer.slice(portIndex, portIndex + 2);
    // port is big-Endian in raw data etc 80 == 0x005d
    const portRemote = new DataView(portBuffer).getUint16(0);

    let addressIndex = portIndex + 2;
    const addressBuffer = new Uint8Array(vlessBuffer.slice(addressIndex, addressIndex + 1));

    // 1--> ipv4  addressLength =4
    // 2--> domain name addressLength=addressBuffer[1]
    // 3--> ipv6  addressLength =16
    const addressType = addressBuffer[0];
    let addressLength = 0;
    let addressValueIndex = addressIndex + 1;
    let addressValue = "";
    switch (addressType) {
        case 1:
            addressLength = 4;
            addressValue = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
            break;
        case 2:
            addressLength = new Uint8Array(vlessBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
            addressValueIndex += 1;
            addressValue = new TextDecoder().decode(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
            break;
        case 3:
            addressLength = 16;
            const dataView = new DataView(vlessBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
            // 2001:0db8:85a3:0000:0000:8a2e:0370:7334
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
            ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            addressValue = ipv6.join(":");
            // seems no need add [] for ipv6
            break;
        default:
            return {
            hasError: true,
            message: `invild  addressType is ${addressType}`,
            };
    }
    if (!addressValue) {
        return {
            hasError: true,
            message: `addressValue is empty, addressType is ${addressType}`,
        };
    }

    return {
        hasError: false,
        addressRemote: addressValue,
        addressType,
        portRemote,
        rawDataIndex: addressValueIndex + addressLength,
        vlessVersion: version,
        isUDP,
    };
}

/**
 * Converts a remote socket to a WebSocket connection.
 * @param {import("@cloudflare/workers-types").Socket} remoteSocket The remote socket to convert.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket to connect to.
 * @param {ArrayBuffer | null} vlessResponseHeader The VLESS response header.
 * @param {(() => Promise<void>) | null} retry The function to retry the connection if it fails.
 * @param {(info: string) => void} log The logging function.
 * @returns {Promise<void>} A Promise that resolves when the conversion is complete.
 */
async function vlessRemoteSocketToWS(remoteSocket, webSocket, vlessResponseHeader, retry, log) {
    // remote--> ws
    let remoteChunkCount = 0;
    let chunks = [];
    /** @type {ArrayBuffer | null} */
    let vlessHeader = vlessResponseHeader;
    let hasIncomingData = false; // check if remoteSocket has incoming data
    await remoteSocket.readable
        .pipeTo(
            new WritableStream({
                start() {},
                /**
                 *
                 * @param {Uint8Array} chunk
                 * @param {*} controller
                 */
                async write(chunk, controller) {
                    hasIncomingData = true;
                    // remoteChunkCount++;
                    if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                        controller.error("webSocket.readyState is not open, maybe close");
                    }
                    if (vlessHeader) {
                        webSocket.send(await new Blob([vlessHeader, chunk]).arrayBuffer());
                        vlessHeader = null;
                    } else {
                        // seems no need rate limit this, CF seems fix this??..
                        // if (remoteChunkCount > 20000) {
                        // 	// cf one package is 4096 byte(4kb),  4096 * 20000 = 80M
                        // 	await delay(1);
                        // }
                        webSocket.send(chunk);
                    }
                },
                close() {
                    log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
                    // safeCloseWebSocket(webSocket); // no need server close websocket frist for some case will casue HTTP ERR_CONTENT_LENGTH_MISMATCH issue, client will send close event anyway.
                },
                abort(reason) {
                    console.error(`remoteConnection!.readable abort`, reason);
                },
            })
        )
        .catch((error) => {
            console.error(`vlessRemoteSocketToWS has exception `, error.stack || error);
            safeCloseWebSocket(webSocket);
        });
  
    // seems is cf connect socket have error,
    // 1. Socket.closed will have error
    // 2. Socket.readable will be close without any data coming
    if (hasIncomingData === false && retry) {
        log(`retry`);
        retry();
    }
}

async function trojanRemoteSocketToWS(remoteSocket, webSocket, retry, log) {
    let hasIncomingData = false;
    await remoteSocket.readable
        .pipeTo(
            new WritableStream({
                start() {},
                /**
                 *
                 * @param {Uint8Array} chunk
                 * @param {*} controller
                 */
                async write(chunk, controller) {
                    hasIncomingData = true;
                    if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                        controller.error("webSocket connection is not open");
                    }
                    webSocket.send(chunk);
                },
                close() {
                    log(`remoteSocket.readable is closed, hasIncomingData: ${hasIncomingData}`);
                },
                abort(reason) {
                    console.error("remoteSocket.readable abort", reason);
                },
            })
        )
        .catch((error) => {
            console.error(`trojanRemoteSocketToWS error:`, error.stack || error);
            safeCloseWebSocket(webSocket);
        });
    
    if (hasIncomingData === false && retry) {
        log(`retry`);
        retry();
    }
}

/**
 * Decodes a base64 string into an ArrayBuffer.
 * @param {string} base64Str The base64 string to decode.
 * @returns {{earlyData: ArrayBuffer|null, error: Error|null}} An object containing the decoded ArrayBuffer or null if there was an error, and any error that occurred during decoding or null if there was no error.
 */
function base64ToArrayBuffer(base64Str) {
	if (!base64Str) {
		return { earlyData: null, error: null };
	}
	try {
		// go use modified Base64 for URL rfc4648 which js atob not support
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
		const decode = atob(base64Str);
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		return { earlyData: null, error };
	}
}

/**
 * Checks if a given string is a valid UUID.
 * Note: This is not a real UUID validation.
 * @param {string} uuid The string to validate as a UUID.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 */
function isValidUUID(uuid) {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
/**
 * Closes a WebSocket connection safely without throwing exceptions.
 * @param {import("@cloudflare/workers-types").WebSocket} socket The WebSocket connection to close.
 */
function safeCloseWebSocket(socket) {
	try {
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		console.error('safeCloseWebSocket error', error);
	}
}

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
	byteToHex.push((i + 256).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
    return (
        byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        "-" +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        "-" +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        "-" +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        "-" +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]
    ).toLowerCase();
}

function stringify(arr, offset = 0) {
	const uuid = unsafeStringify(arr, offset);
	if (!isValidUUID(uuid)) {
		throw TypeError("Stringified UUID is invalid");
	}
	return uuid;
}

/**
 * Handles outbound UDP traffic by transforming the data into DNS queries and sending them over a WebSocket connection.
 * @param {import("@cloudflare/workers-types").WebSocket} webSocket The WebSocket connection to send the DNS queries over.
 * @param {ArrayBuffer} vlessResponseHeader The VLESS response header.
 * @param {(string) => void} log The logging function.
 * @returns {{write: (chunk: Uint8Array) => void}} An object with a write method that accepts a Uint8Array chunk to write to the transform stream.
 */
async function handleUDPOutBound(webSocket, vlessResponseHeader, log) {
    let isVlessHeaderSent = false;
    const transformStream = new TransformStream({
        start(controller) {},
        transform(chunk, controller) {
            // udp message 2 byte is the the length of udp data
            // TODO: this should have bug, beacsue maybe udp chunk can be in two websocket message
            for (let index = 0; index < chunk.byteLength; ) {
                const lengthBuffer = chunk.slice(index, index + 2);
                const udpPakcetLength = new DataView(lengthBuffer).getUint16(0);
                const udpData = new Uint8Array(chunk.slice(index + 2, index + 2 + udpPakcetLength));
                index = index + 2 + udpPakcetLength;
                controller.enqueue(udpData);
            }
        },
        flush(controller) {},
    });
    
    // only handle dns udp for now
    transformStream.readable
    .pipeTo(
        new WritableStream({
            async write(chunk) {
                const resp = await fetch(
                    dohURL, // dns server url
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/dns-message",
                        },
                        body: chunk,
                    }
                );
                const dnsQueryResult = await resp.arrayBuffer();
                const udpSize = dnsQueryResult.byteLength;
                // console.log([...new Uint8Array(dnsQueryResult)].map((x) => x.toString(16)));
                const udpSizeBuffer = new Uint8Array([(udpSize >> 8) & 0xff, udpSize & 0xff]);
                if (webSocket.readyState === WS_READY_STATE_OPEN) {
                    log(`doh success and dns message length is ${udpSize}`);
                    if (isVlessHeaderSent) {
                        webSocket.send(await new Blob([udpSizeBuffer, dnsQueryResult]).arrayBuffer());
                    } else {
                        webSocket.send(await new Blob([vlessResponseHeader, udpSizeBuffer, dnsQueryResult]).arrayBuffer());
                        isVlessHeaderSent = true;
                    }
                }
            },
        })
    )
    .catch((error) => {
        log("dns udp has error" + error);
    });
  
    const writer = transformStream.writable.getWriter();
  
    return {
        /**
         *
         * @param {Uint8Array} chunk
        */
        write(chunk) {
            writer.write(chunk);
        },
    };
}

/**
 *
 * @param {string} userID
 * @param {string | null} hostName
 * @returns {string}
 */

const generateKeyPair = () => {
    const base64Encode = (array) => btoa(String.fromCharCode.apply(null, array));
	let privateKey = nacl.randomBytes(32);
	privateKey[0] &= 248;
	privateKey[31] &= 127;
	privateKey[31] |= 64;
	let publicKey = nacl.scalarMult.base(privateKey);
	const publicKeyBase64 = base64Encode(publicKey);
	const privateKeyBase64 = base64Encode(privateKey);
  
	return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
};

function generateRemark(index, port, address, cleanIPs, protocol, configType) {
    let remark = '';
    let addressType;
    const type = configType ? ` ${configType}` : '';

    cleanIPs.includes(address)
        ? addressType = 'Clean IP'
        : addressType = isDomain(address) ? 'Domain': isIPv4(address) ? 'IPv4' : isIPv6(address) ? 'IPv6' : '';

    return `💦 ${index} - ${protocol}${type} - ${addressType} : ${port}`;
}

function isDomain(address) {
    const domainPattern = /^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.?)+[A-Za-z]{2,}$/;
    return domainPattern.test(address);
}

function isIPv4(address) {
    const ipv4Pattern = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Pattern.test(address);
}

function isIPv6(address) {
    const ipv6Pattern = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|::(?:[a-fA-F0-9]{1,4}:){0,7}|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6})\]$/;
    return ipv6Pattern.test(address);
}

function base64ToDecimal (base64) {
    const binaryString = atob(base64);
    const hexString = Array.from(binaryString).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const decimalArray = hexString.match(/.{2}/g).map(hex => parseInt(hex, 16));
    return decimalArray;
}

async function getDataset(env) {
    let proxySettings, warpConfigs;
    if (typeof env.bpb !== 'object') {
        return {kvNotFound: true, proxySettings: null, warpConfigs: null}
    }

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting KV - ${error}`);
    }

    if (!proxySettings) {
        proxySettings = await updateDataset(env);
        const { error, configs } = await fetchWgConfig(env, proxySettings);
        if (error) throw new Error(`An error occurred while getting Warp configs - ${error}`);
        warpConfigs = configs;
    }
    
    if (panelVersion !== proxySettings.panelVersion) proxySettings = await updateDataset(env);
    return {kvNotFound: false, proxySettings, warpConfigs}
}

async function updateDataset (env, newSettings, resetSettings) {
    let currentSettings;
    if (!resetSettings) {
        try {
            currentSettings = await env.bpb.get("proxySettings", {type: 'json'});
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while getting current KV settings - ${error}`);
        }
    } else {
        await env.bpb.delete('warpConfigs');
    }

    const validateField = (field) => {
        const fieldValue = newSettings?.get(field);
        if (fieldValue === undefined) return null;
        if (fieldValue === 'true') return true;
        if (fieldValue === 'false') return false;
        return fieldValue;
    }

    const remoteDNS = validateField('remoteDNS') ?? currentSettings?.remoteDNS ?? 'https://8.8.8.8/dns-query';
    const url = new URL(remoteDNS);
    const remoteDNSServer = url.hostname;
    const isServerDomain = isDomain(remoteDNSServer);
    let resolvedRemoteDNS;
    if (isServerDomain) {
        try {
            const resolvedDomain = await resolveDNS(remoteDNSServer);
            resolvedRemoteDNS = {
                server: remoteDNSServer,
                staticIPs: [...resolvedDomain.ipv4, ...resolvedDomain.ipv6]
            };
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while resolving remote DNS server, please try agian! - ${error}`);
        }
    } 

    const proxySettings = {
        remoteDNS: remoteDNS,
        resolvedRemoteDNS: resolvedRemoteDNS ?? {},
        localDNS: validateField('localDNS') ?? currentSettings?.localDNS ?? '8.8.8.8',
        vlessTrojanFakeDNS: validateField('vlessTrojanFakeDNS') ?? currentSettings?.vlessTrojanFakeDNS ?? false,
        proxyIP: validateField('proxyIP')?.trim() ?? currentSettings?.proxyIP ?? '',
        outProxy: validateField('outProxy') ?? currentSettings?.outProxy ?? '',
        outProxyParams: extractChainProxyParams(validateField('outProxy')) ?? currentSettings?.outProxyParams ?? '',
        cleanIPs: validateField('cleanIPs')?.replaceAll(' ', '') ?? currentSettings?.cleanIPs ?? '',
        enableIPv6: validateField('enableIPv6') ?? currentSettings?.enableIPv6 ?? true,
        customCdnAddrs: validateField('customCdnAddrs')?.replaceAll(' ', '') ?? currentSettings?.customCdnAddrs ?? '',
        customCdnHost: validateField('customCdnHost')?.trim() ?? currentSettings?.customCdnHost ?? '',
        customCdnSni: validateField('customCdnSni')?.trim() ?? currentSettings?.customCdnSni ?? '',
        bestVLESSTrojanInterval: validateField('bestVLESSTrojanInterval') ?? currentSettings?.bestVLESSTrojanInterval ?? '30',
        vlessConfigs: validateField('vlessConfigs') ?? currentSettings?.vlessConfigs ?? true,
        trojanConfigs: validateField('trojanConfigs') ?? currentSettings?.trojanConfigs ?? false,
        ports: validateField('ports')?.split(',') ?? currentSettings?.ports ?? ['443'],
        lengthMin: validateField('fragmentLengthMin') ?? currentSettings?.lengthMin ?? '100',
        lengthMax: validateField('fragmentLengthMax') ?? currentSettings?.lengthMax ?? '200',
        intervalMin: validateField('fragmentIntervalMin') ?? currentSettings?.intervalMin ?? '1',
        intervalMax: validateField('fragmentIntervalMax') ?? currentSettings?.intervalMax ?? '1',
        fragmentPackets: validateField('fragmentPackets') ?? currentSettings?.fragmentPackets ?? 'tlshello',
        bypassLAN: validateField('bypass-lan') ?? currentSettings?.bypassLAN ?? false,
        bypassIran: validateField('bypass-iran') ?? currentSettings?.bypassIran ?? false,
        bypassChina: validateField('bypass-china') ?? currentSettings?.bypassChina ?? false,
        bypassRussia: validateField('bypass-russia') ?? currentSettings?.bypassRussia ?? false,
        blockAds: validateField('block-ads') ?? currentSettings?.blockAds ?? false,
        blockPorn: validateField('block-porn') ?? currentSettings?.blockPorn ?? false,
        blockUDP443: validateField('block-udp-443') ?? currentSettings?.blockUDP443 ?? false,
        warpEndpoints: validateField('warpEndpoints')?.replaceAll(' ', '') ?? currentSettings?.warpEndpoints ?? 'engage.cloudflareclient.com:2408',
        warpFakeDNS: validateField('warpFakeDNS') ?? currentSettings?.warpFakeDNS ?? false,
        warpPlusLicense: validateField('warpPlusLicense') ?? currentSettings?.warpPlusLicense ?? '',
        bestWarpInterval: validateField('bestWarpInterval') ?? currentSettings?.bestWarpInterval ?? '30',
        hiddifyNoiseMode: validateField('hiddifyNoiseMode') ?? currentSettings?.hiddifyNoiseMode ?? 'm4',
        nikaNGNoiseMode: validateField('nikaNGNoiseMode') ?? currentSettings?.nikaNGNoiseMode ?? 'quic',
        noiseCountMin: validateField('noiseCountMin') ?? currentSettings?.noiseCountMin ?? '10',
        noiseCountMax: validateField('noiseCountMax') ?? currentSettings?.noiseCountMax ?? '15',
        noiseSizeMin: validateField('noiseSizeMin') ?? currentSettings?.noiseSizeMin ?? '5',
        noiseSizeMax: validateField('noiseSizeMax') ?? currentSettings?.noiseSizeMax ?? '10',
        noiseDelayMin: validateField('noiseDelayMin') ?? currentSettings?.noiseDelayMin ?? '1',
        noiseDelayMax: validateField('noiseDelayMax') ?? currentSettings?.noiseDelayMax ?? '1',
        panelVersion: panelVersion
    };

    try {    
        await env.bpb.put("proxySettings", JSON.stringify(proxySettings));          
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV - ${error}`);
    }

    return proxySettings;
}

function randomUpperCase (str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += Math.random() < 0.5 ? str[i].toUpperCase() : str[i];
    }
    return result;
}

function getRandomPath (length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function resolveDNS (domain) {
    const dohURLv4 = `${dohURL}?name=${encodeURIComponent(domain)}&type=A`;
    const dohURLv6 = `${dohURL}?name=${encodeURIComponent(domain)}&type=AAAA`;

    try {
        const [ipv4Response, ipv6Response] = await Promise.all([
            fetch(dohURLv4, { headers: { accept: 'application/dns-json' } }),
            fetch(dohURLv6, { headers: { accept: 'application/dns-json' } })
        ]);

        const ipv4Addresses = await ipv4Response.json();
        const ipv6Addresses = await ipv6Response.json();

        const ipv4 = ipv4Addresses.Answer
            ? ipv4Addresses.Answer.map((record) => record.data)
            : [];
        const ipv6 = ipv6Addresses.Answer
            ? ipv6Addresses.Answer.map((record) => record.data)
            : [];

        return { ipv4, ipv6 };
    } catch (error) {
        console.error('Error resolving DNS:', error);
        throw new Error(`An error occurred while resolving DNS - ${error}`);
    }
}

async function getConfigAddresses(hostName, cleanIPs, enableIPv6) {
    const resolved = await resolveDNS(hostName);
    const defaultIPv6 = enableIPv6 ? resolved.ipv6.map((ip) => `[${ip}]`) : []
    return [
        hostName,
        'www.speedtest.net',
        ...resolved.ipv4,
        ...defaultIPv6,
        ...(cleanIPs ? cleanIPs.split(',') : [])
    ];
}

async function generateJWTToken (secretKey) {
    const secret = new TextEncoder().encode(secretKey);
    return await new SignJWT({ userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

function generateSecretKey () {
    const key = nacl.randomBytes(32);
    return Array.from(key, byte => byte.toString(16).padStart(2, '0')).join('');
}
  
async function Authenticate (request, env) {
    try {
        const secretKey = await env.bpb.get('secretKey');
        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)jwtToken=([^;]*)/);
        const token = cookie ? cookie[2] : null;

        if (!token) {
            console.log('Unauthorized: Token not available!');
            return false;
        }

        const { payload } = await jwtVerify(token, secret);
        console.log(`Successfully logined, User ID: ${payload.userID}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function renderHomePage (proxySettings, hostName, isPassSet) {
    const {
        remoteDNS, 
        localDNS,
        vlessTrojanFakeDNS, 
        proxyIP, 
        outProxy,
        cleanIPs, 
        enableIPv6,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        vlessConfigs,
        trojanConfigs,
        ports,
        lengthMin, 
        lengthMax, 
        intervalMin, 
        intervalMax,
        fragmentPackets, 
        warpEndpoints,
        warpFakeDNS,
        warpPlusLicense,
        bestWarpInterval,
        hiddifyNoiseMode,
        nikaNGNoiseMode,
        noiseCountMin,
        noiseCountMax,
        noiseSizeMin,
        noiseSizeMax,
        noiseDelayMin,
        noiseDelayMax,
        bypassLAN,
        bypassIran,
        bypassChina,
        bypassRussia,
        blockAds, 
        blockPorn,
        blockUDP443
    } = proxySettings;

    const isWarpPlus = warpPlusLicense ? true : false;
    let activeProtocols = (vlessConfigs ? 1 : 0) + (trojanConfigs ? 1 : 0);
    let httpPortsBlock = '', httpsPortsBlock = '';
    const allPorts = [...(hostName.includes('workers.dev') ? defaultHttpPorts : []), ...defaultHttpsPorts];

    allPorts.forEach(port => {
        let id = `port-${port}`;
        const isChecked = ports.includes(port) ? 'checked' : '';
        let portBlock = `
            <div class="routing" style="grid-template-columns: 1fr 2fr; margin-right: 10px;">
                <input type="checkbox" id=${id} name=${port} onchange="handlePortChange(event)" value="true" ${isChecked}>
                <label style="margin-bottom: 3px;" for=${id}>${port}</label>
            </div>`;
        defaultHttpsPorts.includes(port) ? httpsPortsBlock += portBlock : httpPortsBlock += portBlock;
    });

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BPB Panel ${panelVersion}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <title>Collapsible Sections</title>
        <style>
            :root {
                --color: black;
                --primary-color: #09639f;
                --secondary-color: #3498db;
                --header-color: #09639f; 
                --background-color: #fff;
                --form-background-color: #f9f9f9;
                --table-active-color: #f2f2f2;
                --hr-text-color: #3b3b3b;
                --lable-text-color: #333;
                --border-color: #ddd;
                --button-color: #09639f;
                --input-background-color: white;
                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            }
            body { font-family: system-ui; background-color: var(--background-color); color: var(--color) }
            body.dark-mode {
                --color: white;
                --primary-color: #09639F;
                --secondary-color: #3498DB;
                --header-color: #3498DB; 
                --background-color: #121212;
                --form-background-color: #121212;
                --table-active-color: #252525;
                --hr-text-color: #D5D5D5;
                --lable-text-color: #DFDFDF;
                --border-color: #353535;
                --button-color: #3498DB;
                --input-background-color: #252525;
                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
            }
            .material-symbols-outlined {
                margin-left: 5px;
                font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24
            }
            details { border-bottom: 1px solid var(--border-color); }
            summary {
                font-weight: bold;
                cursor: pointer;
                text-align: center;
                text-wrap: nowrap;
            }
            summary::marker { font-size: 1.5rem; color: var(--secondary-color); }
            summary h2 { display: inline-flex; }
            h1 { font-size: 2.5em; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }
            h2 { margin: 30px 0; text-align: center; color: var(--hr-text-color); }
            hr { border: 1px solid var(--border-color); margin: 20px 0; }
            .footer {
                display: flex;
                font-weight: 600;
                margin: 10px auto 0 auto;
                justify-content: center;
                align-items: center;
            }
            .footer button {margin: 0 20px; background: #212121; max-width: fit-content;}
            .footer button:hover, .footer button:focus { background: #3b3b3b;}
            .form-control a, a.link { text-decoration: none; }
            .form-control {
                margin-bottom: 20px;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
            }
            .form-control button {
                background-color: var(--form-background-color);
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--button-color);
                border-color: var(--primary-color);
                border: 1px solid;
            }
            #apply {display: block; margin-top: 20px;}
            input.button {font-weight: 600; padding: 15px 0; font-size: 1.1rem;}
            label {
                display: block;
                margin-bottom: 5px;
                font-size: 110%;
                font-weight: 600;
                color: var(--lable-text-color);
            }
            input[type="text"],
            input[type="number"],
            input[type="url"],
            textarea,
            select {
                width: 100%;
                text-align: center;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 16px;
                color: var(--lable-text-color);
                background-color: var(--input-background-color);
                box-sizing: border-box;
                transition: border-color 0.3s ease;
            }	
            input[type="text"]:focus,
            input[type="number"]:focus,
            input[type="url"]:focus,
            textarea:focus,
            select:focus { border-color: var(--secondary-color); outline: none; }
            .button,
            table button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                white-space: nowrap;
                padding: 10px 15px;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 1px;
                border: none;
                border-radius: 5px;
                color: white;
                background-color: var(--primary-color);
                cursor: pointer;
                outline: none;
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            input[type="checkbox"] { 
                background-color: var(--input-background-color);
                style="margin: 0; 
                grid-column: 2;"
            }
            table button { margin: auto; width: auto; }
            .button.disabled {
                background-color: #ccc;
                cursor: not-allowed;
                box-shadow: none;
                pointer-events: none;
            }
            .button:hover,
            table button:hover,
            table button:focus {
                background-color: #2980b9;
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
                transform: translateY(-2px);
            }
            button.button:hover { color: white; }
            .button:active,
            table button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
            .form-container {
                max-width: 90%;
                margin: 0 auto;
                padding: 20px;
                background: var(--form-background-color);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin-bottom: 100px;
            }
            .table-container { margin-top: 20px; overflow-x: auto; }
            table { 
                width: 100%;
                border: 1px solid var(--border-color);
                border-collapse: separate;
                border-spacing: 0; 
                border-radius: 10px;
                margin-bottom: 20px;
                overflow: hidden;
            }
            th, td { padding: 10px; border-bottom: 1px solid var(--border-color); }
            td div { display: flex; align-items: center; }
            th { background-color: var(--secondary-color); color: white; font-weight: bold; font-size: 1.1rem; width: 50%;}
            td:last-child { background-color: var(--table-active-color); }               
            tr:hover { background-color: var(--table-active-color); }
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
            }
            .modal-content {
                background-color: var(--form-background-color);
                margin: auto;
                padding: 10px 20px 20px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                width: 80%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .close { color: var(--color); float: right; font-size: 28px; font-weight: bold; }
            .close:hover,
            .close:focus { color: black; text-decoration: none; cursor: pointer; }
            .form-control label {
                display: block;
                margin-bottom: 8px;
                font-size: 110%;
                font-weight: 600;
                color: var(--lable-text-color);
                line-height: 1.3em;
            }
            .form-control input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                font-size: 16px;
                color: var(--lable-text-color);
                background-color: var(--input-background-color);
                box-sizing: border-box;
                margin-bottom: 15px;
                transition: border-color 0.3s ease;
            }
            .routing { 
                display: grid;
                justify-content: flex-start;
                grid-template-columns: 1fr 1fr 10fr 1fr;
                margin-bottom: 15px;
            }
            .form-control .routing input { grid-column: 2 / 3; }
            #routing-rules.form-control { display: grid; grid-template-columns: 1fr 1fr; }
            .routing label {
                text-align: left;
                margin: 0 0 0 10px;
                font-weight: 400;
                font-size: 100%;
                text-wrap: nowrap;
            }
            .form-control input[type="password"]:focus { border-color: var(--secondary-color); outline: none; }
            #passwordError { color: red; margin-bottom: 10px; }
            .symbol { margin-right: 8px; }
            .modalQR {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.4);
            }
            .floating-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background-color: var(--color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s, transform 0.3s;
            }
            .floating-button:hover { transform: scale(1.1); }
            .min-max { display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline; width: 100%; }
            .min-max span { text-align: center; white-space: pre; }
            .input-with-select { width: 100%; }
            body.dark-mode .floating-button { background-color: var(--color); }
            body.dark-mode .floating-button:hover { transform: scale(1.1); }
            @media only screen and (min-width: 768px) {
                .form-container { max-width: 70%; }
                .form-control { 
                    margin-bottom: 15px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: baseline;
                    justify-content: flex-end;
                    font-family: Arial, sans-serif;
                }
                #apply { display: block; margin: 20px auto 0 auto; max-width: 50%; }
                .modal-content { width: 30% }
                .routing { display: grid; grid-template-columns: 4fr 1fr 3fr 4fr; }
            }
        </style>
    </head>
    <body>
        <h1>BPB Panel <span style="font-size: smaller;">${panelVersion}</span> 💦</h1>
        <div class="form-container">
            <form id="configForm">
                <details open>
                    <summary><h2>VLESS / TROJAN ⚙️</h2></summary>
                    <div class="form-control">
                        <label for="remoteDNS">🌏 Remote DNS</label>
                        <input type="url" id="remoteDNS" name="remoteDNS" value="${remoteDNS}" required>
                    </div>
                    <div class="form-control">
                        <label for="localDNS">🏚️ Local DNS</label>
                        <input type="text" id="localDNS" name="localDNS" value="${localDNS}"
                            pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|localhost$"
                            title="Please enter a valid DNS IP Address or localhost!"  required>
                    </div>
                    <div class="form-control">
                        <label for="vlessTrojanFakeDNS">🧢 Fake DNS</label>
                        <div class="input-with-select">
                            <select id="vlessTrojanFakeDNS" name="vlessTrojanFakeDNS">
                                <option value="true" ${vlessTrojanFakeDNS ? 'selected' : ''}>Enabled</option>
                                <option value="false" ${!vlessTrojanFakeDNS ? 'selected' : ''}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="proxyIP">📍 Proxy IP</label>
                        <input type="text" id="proxyIP" name="proxyIP" value="${proxyIP}">
                    </div>
                    <div class="form-control">
                        <label for="outProxy">✈️ Chain Proxy</label>
                        <input type="text" id="outProxy" name="outProxy" value="${outProxy}">
                    </div>
                    <div class="form-control">
                        <label for="cleanIPs">✨ Clean IPs</label>
                        <input type="text" id="cleanIPs" name="cleanIPs" value="${cleanIPs.replaceAll(",", " , ")}">
                    </div>
                    <div class="form-control">
                        <label>🔎 IP Scanner</label>
                        <a href="https://scanner.github1.cloud/" id="scanner" name="scanner" target="_blank" style="width: 100%;">
                            <button type="button" class="button">
                                Scan now
                                <span class="material-symbols-outlined">open_in_new</span>
                            </button>
                        </a>
                    </div>
                    <div class="form-control">
                        <label for="enableIPv6">🔛 IPv6 Configs</label>
                        <div class="input-with-select">
                            <select id="enableIPv6" name="enableIPv6">
                                <option value="true" ${enableIPv6 ? 'selected' : ''}>Enabled</option>
                                <option value="false" ${!enableIPv6 ? 'selected' : ''}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="customCdnAddrs">💀 Custom CDN Addrs</label>
                        <input type="text" id="customCdnAddrs" name="customCdnAddrs" value="${customCdnAddrs.replaceAll(",", " , ")}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnHost">💀 Custom CDN Host</label> 
                        <input type="text" id="customCdnHost" name="customCdnHost" value="${customCdnHost}">
                    </div>
                    <div class="form-control">
                        <label for="customCdnSni">💀 Custom CDN SNI</label>
                        <input type="text" id="customCdnSni" name="customCdnSni" value="${customCdnSni}">
                    </div>
                    <div class="form-control">
                        <label for="bestVLESSTrojanInterval">🔄 Best Interval</label>
                        <input type="number" id="bestVLESSTrojanInterval" name="bestVLESSTrojanInterval" min="10" max="90" value="${bestVLESSTrojanInterval}">
                    </div>
                    <div class="form-control" style="padding-top: 10px;">
                        <label>⚙️ Protocols</label>
                        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; margin-top: 10px;">
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="vlessConfigs" name="vlessConfigs" onchange="handleProtocolChange(event)" value="true" ${vlessConfigs ? 'checked' : ''}>
                                <label for="vlessConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">VLESS</label>
                            </div>
                            <div style = "display: flex; justify-content: center; align-items: center;">
                                <input type="checkbox" id="trojanConfigs" name="trojanConfigs" onchange="handleProtocolChange(event)" value="true" ${trojanConfigs ? 'checked' : ''}>
                                <label for="trojanConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">Trojan</label>
                            </div>
                        </div>
                    </div>
                    <div class="table-container">
                        <table id="ports-block">
                            <tr>
                                <th style="text-wrap: nowrap; background-color: gray;">Config type</th>
                                <th style="text-wrap: nowrap; background-color: gray;">Ports</th>
                            </tr>
                            <tr>
                                <td style="text-align: center; font-size: larger;"><b>TLS</b></td>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${httpsPortsBlock}</div>
                                </td>    
                            </tr>
                            ${!httpPortsBlock ? '' : `<tr>
                                <td style="text-align: center; font-size: larger;"><b>Non TLS</b></td>
                                <td>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${httpPortsBlock}</div>
                                </td>    
                            </tr>`}        
                        </table>
                    </div>
                </details>
                <details>
                    <summary><h2>FRAGMENT ⚙️</h2></summary>	
                    <div class="form-control">
                        <label for="fragmentLengthMin">📐 Length</label>
                        <div class="min-max">
                            <input type="number" id="fragmentLengthMin" name="fragmentLengthMin" value="${lengthMin}" min="10" required>
                            <span> - </span>
                            <input type="number" id="fragmentLengthMax" name="fragmentLengthMax" value="${lengthMax}" max="500" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentIntervalMin">🕞 Interval</label>
                        <div class="min-max">
                            <input type="number" id="fragmentIntervalMin" name="fragmentIntervalMin"
                                value="${intervalMin}" min="1" max="30" required>
                            <span> - </span>
                            <input type="number" id="fragmentIntervalMax" name="fragmentIntervalMax"
                                value="${intervalMax}" min="1" max="30" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="fragmentPackets">📦 Packets</label>
                        <div class="input-with-select">
                            <select id="fragmentPackets" name="fragmentPackets">
                                <option value="tlshello" ${fragmentPackets === 'tlshello' ? 'selected' : ''}>tlshello</option>
                                <option value="1-1" ${fragmentPackets === '1-1' ? 'selected' : ''}>1-1</option>
                                <option value="1-2" ${fragmentPackets === '1-2' ? 'selected' : ''}>1-2</option>
                                <option value="1-3" ${fragmentPackets === '1-3' ? 'selected' : ''}>1-3</option>
                                <option value="1-5" ${fragmentPackets === '1-5' ? 'selected' : ''}>1-5</option>
                            </select>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>WARP GENERAL ⚙️</h2></summary>
                    <div class="form-control">
                        <label for="warpEndpoints">✨ Endpoints</label>
                        <input type="text" id="warpEndpoints" name="warpEndpoints" value="${warpEndpoints.replaceAll(",", " , ")}" required>
                    </div>
                    <div class="form-control">
                        <label style="line-height: 1.5;">🔎 Scan Endpoint</label>
                        <button type="button" class="button" style="padding: 10px 0;" onclick="copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/Ptechgithub/warp/main/endip/install.sh)', false)">
                            Copy Script<span class="material-symbols-outlined">terminal</span>
                        </button>
                    </div>
                    <div class="form-control">
                        <label for="warpFakeDNS">🧢 Fake DNS</label>
                        <div class="input-with-select">
                            <select id="warpFakeDNS" name="warpFakeDNS">
                                <option value="true" ${warpFakeDNS ? 'selected' : ''}>Enabled</option>
                                <option value="false" ${!warpFakeDNS ? 'selected' : ''}>Disabled</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="warpPlusLicense">➕ Warp+ License</label>
                        <input type="text" id="warpPlusLicense" name="warpPlusLicense" value="${warpPlusLicense}" 
                            pattern="^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{8}-[a-zA-Z0-9]{8}$" 
                            title="Please enter a valid Warp Plus license in xxxxxxxx-xxxxxxxx-xxxxxxxx format">
                    </div>
                    <div class="form-control">
                        <label>♻️ Warp Configs</label>
                        <button id="refreshBtn" type="button" class="button" style="padding: 10px 0;" onclick="getWarpConfigs()">
                            Update<span class="material-symbols-outlined">autorenew</span>
                        </button>
                    </div>
                    <div class="form-control">
                        <label for="bestWarpInterval">🔄 Best Interval</label>
                        <input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${bestWarpInterval}">
                    </div>
                </details>
                <details>
                    <summary><h2>WARP PRO ⚙️</h2></summary>
                    <div class="form-control">
                        <label for="hiddifyNoiseMode">😵‍💫 Hiddify Mode</label>
                        <input type="text" id="hiddifyNoiseMode" name="hiddifyNoiseMode" 
                            pattern="^(m[1-6]|h_[0-9A-Fa-f]{2}|g_([0-9A-Fa-f]{2}_){2}[0-9A-Fa-f]{2})$" 
                            title="Enter 'm1-m6', 'h_HEX', 'g_HEX_HEX_HEX' which HEX can be between 00 to ff"
                            value="${hiddifyNoiseMode}" required>
                    </div>
                    <div class="form-control">
                        <label for="nikaNGNoiseMode">😵‍💫 NikaNG Mode</label>
                        <input type="text" id="nikaNGNoiseMode" name="nikaNGNoiseMode" 
                            pattern="^(none|quic|random|[0-9A-Fa-f]+)$" 
                            title="Enter 'none', 'quic', 'random', or any HEX string like 'ee0000000108aaaa'"
                            value="${nikaNGNoiseMode}" required>
                    </div>
                    <div class="form-control">
                        <label for="noiseCountMin">🎚️ Noise Count</label>
                        <div class="min-max">
                            <input type="number" id="noiseCountMin" name="noiseCountMin"
                                value="${noiseCountMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseCountMax" name="noiseCountMax"
                                value="${noiseCountMax}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseSizeMin">📏 Noise Size</label>
                        <div class="min-max">
                            <input type="number" id="noiseSizeMin" name="noiseSizeMin"
                                value="${noiseSizeMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseSizeMax" name="noiseSizeMax"
                                value="${noiseSizeMax}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="noiseDelayMin">🕞 Noise Delay</label>
                        <div class="min-max">
                            <input type="number" id="noiseDelayMin" name="noiseDelayMin"
                                value="${noiseDelayMin}" min="1" required>
                            <span> - </span>
                            <input type="number" id="noiseDelayMax" name="noiseDelayMax"
                                value="${noiseDelayMax}" min="1" required>
                        </div>
                    </div>
                </details>
                <details>
                    <summary><h2>ROUTING RULES ⚙️</h2></summary>
                    <div id="routing-rules" class="form-control" style="margin-bottom: 20px;">			
                        <div class="routing">
                            <input type="checkbox" id="bypass-lan" name="bypass-lan" value="true" ${bypassLAN ? 'checked' : ''}>
                            <label for="bypass-lan">Bypass LAN</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-ads" name="block-ads" value="true" ${blockAds ? 'checked' : ''}>
                            <label for="block-ads">Block Ads.</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-iran" name="bypass-iran" value="true" ${bypassIran ? 'checked' : ''}>
                            <label for="bypass-iran">Bypass Iran</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-porn" name="block-porn" value="true" ${blockPorn ? 'checked' : ''}>
                            <label for="block-porn">Block Porn</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-china" name="bypass-china" value="true" ${bypassChina ? 'checked' : ''}>
                            <label for="bypass-china">Bypass China</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="block-udp-443" name="block-udp-443" value="true" ${blockUDP443 ? 'checked' : ''}>
                            <label for="block-udp-443">Block QUIC</label>
                        </div>
                        <div class="routing">
                            <input type="checkbox" id="bypass-russia" name="bypass-russia" value="true" ${bypassRussia ? 'checked' : ''}>
                            <label for="bypass-russia">Bypass Russia</label>
                        </div>
                    </div>
                </details>
                <div id="apply" class="form-control">
                    <div style="grid-column: 2; width: 100%; display: inline-flex;">
                        <input type="submit" id="applyButton" style="margin-right: 10px;" class="button disabled" value="APPLY SETTINGS 💥" form="configForm">
                        <button type="button" id="resetSettings" style="background: none; margin: 0; border: none; cursor: pointer;">
                            <i class="fa fa-refresh fa-2x fa-border" style="border-radius: .2em; border-color: var(--border-color);" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </form>
            <hr>            
            <h2>NORMAL SUB 🔗</h2>
            <div class="table-container">
                <table id="normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>NikaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>MahsaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN-PRO</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Shadowrocket</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Streisand</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Hiddify</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Nekoray (Xray)</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/sub/${userID}#BPB-Normal', 'Normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}#BPB-Normal', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Nekobox</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Nekoray (Sing-Box)</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Karing</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=singbox#BPB-Normal', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <h2>FULL NORMAL SUB 🔗</h2>
            <div class="table-container">
                <table id="full-normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>NikaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>MahsaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN-PRO</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Streisand</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/sub/${userID}?app=xray#BPB-Full-Normal', 'Full normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=xray#BPB-Full-Normal', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Sing-box</b></span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('sing-box://import-remote-profile?url=https://${hostName}/sub/${userID}?app=sfa#BPB-Full-Normal', 'Normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=sfa#BPB-Full-Normal', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Clash Meta</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Clash Verge</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>FlClash</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Stash</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/sub/${userID}?app=clash#BPB-Full-Normal', 'Normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=clash#BPB-Full-Normal', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <h2>FRAGMENT SUB ⛓️</h2>
            <div class="table-container">
                <table id="frag-sub-table">
                    <tr>
                        <th style="text-wrap: nowrap;">Application</th>
                        <th style="text-wrap: nowrap;">Subscription</th>
                    </tr>
                    <tr>
                        <td style="text-wrap: nowrap;">
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>NikaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>MahsaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN-PRO</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Streisand</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/fragsub/${userID}#BPB-Fragment', 'Fragment Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/fragsub/${userID}#BPB-Fragment', true)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-wrap: nowrap;">
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Hiddify</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/fragsub/${userID}?app=hiddify#BPB-Fragment', 'Fragment Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/fragsub/${userID}?app=hiddify#BPB-Fragment', true)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <h2>WARP SUB 🔗</h2>
            <div class="table-container">
                <table id="normal-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Streisand</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/warpsub/${userID}?app=xray#BPB-Warp', 'Warp Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=xray#BPB-Warp', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Hiddify</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Singbox</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('sing-box://import-remote-profile?url=https://${hostName}/warpsub/${userID}?app=singbox#BPB-Warp', 'Warp Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=singbox#BPB-Warp', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Clash Meta</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Clash Verge</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>FlClash</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Stash</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/warpsub/${userID}?app=clash#BPB-Warp', 'Warp Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=clash#BPB-Warp', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <h2>WARP PRO SUB 🔗</h2>
            <div class="table-container">
                <table id="warp-pro-configs-table">
                    <tr>
                        <th>Application</th>
                        <th>Subscription</th>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>NikaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>MahsaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN-PRO</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/warpsub/${userID}?app=nikang#BPB-Warp-Pro', 'Warp Pro Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=nikang#BPB-Warp-Pro', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Hiddify</span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('sing-box://import-remote-profile?url=https://${hostName}/warpsub/${userID}?app=hiddify#BPB-Warp-Pro', 'Warp Pro Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=hiddify#BPB-Warp-Pro', false)">
                                Copy Sub<span class="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <form id="passwordChangeForm">
                        <h2>Change Password</h2>
                        <div class="form-control">
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" required>
                            </div>
                        <div class="form-control">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                        <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>
                        <button id="changePasswordBtn" type="submit" class="button">Change Password</button>
                    </form>
                </div>
            </div>
            <div id="myQRModal" class="modalQR">
                <div class="modal-content" style="width: auto; text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
                        <span id="closeQRModal" class="close" style="align-self: flex-end;">&times;</span>
                        <span id="qrcodeTitle" style="align-self: center; font-weight: bold;"></span>
                    </div>
                    <div id="qrcode-container"></div>
                </div>
            </div>
            <hr>
            <div class="footer">
                <i class="fa fa-github" style="font-size:36px; margin-right: 10px;"></i>
                <a class="link" href="https://github.com/bia-pain-bache/BPB-Worker-Panel" style="color: var(--color); text-decoration: underline;" target="_blank">Github</a>
                <button id="openModalBtn" class="button">Change Password</button>
                <button type="button" id="logout" style="background: none; color: var(--color); margin: 0; border: none; cursor: pointer;">
                    <i class="fa fa-power-off fa-2x" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <button id="darkModeToggle" class="floating-button">
            <i id="modeIcon" class="fa fa-2x fa-adjust" style="color: var(--background-color);" aria-hidden="true"></i>
        </button>   
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
        const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
        let activePortsNo = ${ports.length};
        let activeHttpsPortsNo = ${ports.filter(port => defaultHttpsPorts.includes(port)).length};
        let activeProtocols = ${activeProtocols};
        const warpPlusLicense = '${warpPlusLicense}';
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');

        document.addEventListener('DOMContentLoaded', async () => {
            const configForm = document.getElementById('configForm');            
            const modal = document.getElementById('myModal');
            const changePass = document.getElementById('openModalBtn');
            const closeBtn = document.querySelector(".close");
            const passwordChangeForm = document.getElementById('passwordChangeForm');            
            const applyBtn = document.getElementById('applyButton');         
            const initialFormData = new FormData(configForm);
            const closeQR = document.getElementById('closeQRModal');
            const resetSettings = document.getElementById('resetSettings');
            let modalQR = document.getElementById('myQRModal');
            let qrcodeContainer = document.getElementById('qrcode-container');
            let forcedPassChange = false;
            const darkModeToggle = document.getElementById('darkModeToggle');
                    
            const hasFormDataChanged = () => {
                const currentFormData = new FormData(configForm);
                const currentFormDataEntries = [...currentFormData.entries()];

                const nonCheckboxFieldsChanged = currentFormDataEntries.some(
                    ([key, value]) => !initialFormData.has(key) || initialFormData.get(key) !== value
                );

                const checkboxFieldsChanged = Array.from(configForm.elements)
                    .filter((element) => element.type === 'checkbox')
                    .some((checkbox) => {
                    const initialValue = initialFormData.has(checkbox.name)
                        ? initialFormData.get(checkbox.name)
                        : false;
                    const currentValue = currentFormDataEntries.find(([key]) => key === checkbox.name)?.[1] || false;
                    return initialValue !== currentValue;
                });

                return nonCheckboxFieldsChanged || checkboxFieldsChanged;
            };
            
            const enableApplyButton = () => {
                const isChanged = hasFormDataChanged();
                applyButton.disabled = !isChanged;
                applyButton.classList.toggle('disabled', !isChanged);
            };
                        
            passwordChangeForm.addEventListener('submit', event => resetPassword(event));
            document.getElementById('logout').addEventListener('click', event => logout(event));
            configForm.addEventListener('submit', (event) => applySettings(event, configForm));
            configForm.addEventListener('input', enableApplyButton);
            configForm.addEventListener('change', enableApplyButton);
            changePass.addEventListener('click', () => {
                forcedPassChange ? closeBtn.style.display = 'none' : closeBtn.style.display = '';
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
                forcedPassChange = false;
            });        
            closeBtn.addEventListener('click', () => {
                modal.style.display = "none";
                document.body.style.overflow = "";
            });
            closeQR.addEventListener('click', () => {
                modalQR.style.display = "none";
                qrcodeContainer.lastElementChild.remove();
            });
            resetSettings.addEventListener('click', async () => {
                const confirmReset = confirm('⚠️ This will reset all panel settings.\\nAre you sure?');
                if(!confirmReset) return;
                const formData = new FormData();
                formData.append('resetSettings', 'true');
                try {
                    document.body.style.cursor = 'wait';
                    const refreshButtonVal = refreshBtn.innerHTML;
                    refreshBtn.innerHTML = '⌛ Loading...';

                    const response = await fetch('/panel', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });

                    document.body.style.cursor = 'default';
                    refreshBtn.innerHTML = refreshButtonVal;
                    if (response.ok) {
                        alert('✅ Panel settings reset to default successfully! 😎');
                        window.location.reload(true);
                    } else {
                        const errorMessage = await response.text();
                        console.error(errorMessage, response.status);
                        alert('⚠️ An error occured, Please try again!\\n⛔ ' + errorMessage);
                    }         
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            window.onclick = (event) => {
                if (event.target == modalQR) {
                    modalQR.style.display = "none";
                    qrcodeContainer.lastElementChild.remove();
                }
            }
            darkModeToggle.addEventListener('click', () => {
                const isDarkMode = document.body.classList.toggle('dark-mode');
                if (isDarkMode) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', 'disabled');                
                }
            });

            if (${!isPassSet}) {
                forcedPassChange = true;
                changePass.click();
            }
        });

        const getWarpConfigs = async () => {
            const license = document.getElementById('warpPlusLicense').value;
            if (license !== warpPlusLicense) {
                alert('⚠️ First APPLY SETTINGS and then update Warp configs!');
                return false;
            }
            const confirmReset = confirm('⚠️ Are you sure?');
            if(!confirmReset) return;
            const refreshBtn = document.getElementById('refreshBtn');

            try {
                document.body.style.cursor = 'wait';
                const refreshButtonVal = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '⌛ Loading...';

                const response = await fetch('/update-warp', {
                    method: 'POST',
                    credentials: 'include'
                });

                document.body.style.cursor = 'default';
                refreshBtn.innerHTML = refreshButtonVal;
                if (response.ok) {
                    ${isWarpPlus} ? alert('✅ Warp configs upgraded to PLUS successfully! 😎') : alert('✅ Warp configs updated successfully! 😎');
                } else {
                    const errorMessage = await response.text();
                    console.error(errorMessage, response.status);
                    alert('⚠️ An error occured, Please try again!\\n⛔ ' + errorMessage);
                }         
            } catch (error) {
                console.error('Error:', error);
            } 
        }

        const handlePortChange = (event) => {
            
            if(event.target.checked) { 
                activePortsNo++ 
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;
            } else {
                activePortsNo--;
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo--;
            }

            if (activePortsNo === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("⛔ At least one port should be selected! 🫤");
                activePortsNo = 1;
                defaultHttpsPorts.includes(event.target.name) && activeHttpsPortsNo++;
                return false;
            }
                
            if (activeHttpsPortsNo === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("⛔ At least one TLS(https) port should be selected! 🫤");
                activeHttpsPortsNo = 1;
                return false;
            }
        }
        
        const handleProtocolChange = (event) => {
            
            if(event.target.checked) { 
                activeProtocols++ 
            } else {
                activeProtocols--;
            }

            if (activeProtocols === 0) {
                event.preventDefault();
                event.target.checked = !event.target.checked;
                alert("⛔ At least one Protocol should be selected! 🫤");
                activeProtocols = 1;
                return false;
            }
        }

        const openQR = (url, title) => {
            let qrcodeContainer = document.getElementById("qrcode-container");
            let qrcodeTitle = document.getElementById("qrcodeTitle");
            const modalQR = document.getElementById("myQRModal");
            qrcodeTitle.textContent = title;
            modalQR.style.display = "block";
            let qrcodeDiv = document.createElement("div");
            qrcodeDiv.className = "qrcode";
            qrcodeDiv.style.padding = "2px";
            qrcodeDiv.style.backgroundColor = "#ffffff";
            new QRCode(qrcodeDiv, {
                text: url,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            qrcodeContainer.appendChild(qrcodeDiv);
        }

        const copyToClipboard = (text, decode) => {
            const textarea = document.createElement('textarea');
            const value = decode ? decodeURIComponent(text) : text;
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('📋 Copied to clipboard:\\n\\n' +  value);
        }

        const applySettings = async (event, configForm) => {
            event.preventDefault();
            event.stopPropagation();
            const applyButton = document.getElementById('applyButton');
            const getValue = (id) => parseInt(document.getElementById(id).value, 10);              
            const lengthMin = getValue('fragmentLengthMin');
            const lengthMax = getValue('fragmentLengthMax');
            const intervalMin = getValue('fragmentIntervalMin');
            const intervalMax = getValue('fragmentIntervalMax');
            const proxyIP = document.getElementById('proxyIP').value?.trim();
            const cleanIP = document.getElementById('cleanIPs');
            const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split(',').filter(addr => addr !== '');
            const customCdnHost = document.getElementById('customCdnHost').value;
            const customCdnSni = document.getElementById('customCdnSni').value;
            const isCustomCdn = customCdnAddrs.length > 0 || customCdnHost !== '' || customCdnSni !== '';
            const warpEndpoints = document.getElementById('warpEndpoints').value?.replaceAll(' ', '').split(',');
            const noiseCountMin = getValue('noiseCountMin');
            const noiseCountMax = getValue('noiseCountMax');
            const noiseSizeMin = getValue('noiseSizeMin');
            const noiseSizeMax = getValue('noiseSizeMax');
            const noiseDelayMin = getValue('noiseDelayMin');
            const noiseDelayMax = getValue('noiseDelayMax');
            const cleanIPs = cleanIP.value?.split(',');
            const chainProxy = document.getElementById('outProxy').value?.trim();                    
            const formData = new FormData(configForm);
            const isVless = /vless:\\/\\/[^\s@]+@[^\\s:]+:[^\\s]+/.test(chainProxy);
            const isSocksHttp = /^(http|socks):\\/\\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\\d+)$/.test(chainProxy);
            const hasSecurity = /security=/.test(chainProxy);
            const securityRegex = /security=(tls|none|reality)/;
            const validSecurityType = securityRegex.test(chainProxy);
            let match = chainProxy.match(securityRegex);
            const securityType = match ? match[1] : null;
            match = chainProxy.match(/:(\\d+)\\?/);
            const vlessPort = match ? match[1] : null;
            const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);
            const validIPDomain = /^((?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[\\](?:::[a-fA-F0-9]{1,4}){1,7}\\])$/i;
            const checkedPorts = Array.from(document.querySelectorAll('input[id^="port-"]:checked')).map(input => input.id.split('-')[1]);
            const validEndpoint = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[::(?::[a-fA-F0-9]{1,4}){0,7}\\]):(?:[0-9]{1,5})$/;
            formData.append('ports', checkedPorts);
            configForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                !formData.has(checkbox.name) && formData.append(checkbox.name, 'false');    
            });

            const invalidIPs = [...cleanIPs, proxyIP, ...customCdnAddrs, customCdnHost, customCdnSni]?.filter(value => {
                if (value !== "") {
                    const trimmedValue = value.trim();
                    return !validIPDomain.test(trimmedValue);
                }
            });

            const invalidEndpoints = warpEndpoints?.filter(value => {
                if (value !== "") {
                    const trimmedValue = value.trim();
                    return !validEndpoint.test(trimmedValue);
                }
            });

            if (invalidIPs.length) {
                alert('⛔ Invalid IPs or Domains 🫤\\n\\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\\n'));
                return false;
            }
            
            if (invalidEndpoints.length) {
                alert('⛔ Invalid endpoint 🫤\\n\\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\\n'));
                return false;
            }

            if (lengthMin >= lengthMax || intervalMin > intervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {
                alert('⛔ Minimum should be smaller or equal to Maximum! 🫤');               
                return false;
            }

            if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
                alert('⛔ Invalid Config! 🫤 \\n - The chain proxy should be VLESS, Socks or Http!\\n - VLESS transmission should be GRPC,WS or TCP\\n - VLESS security should be TLS,Reality or None\\n - socks or http should be like:\\n + (socks or http)://user:pass@host:port\\n + (socks or http)://host:port');               
                return false;
            }

            if (isVless && securityType === 'tls' && vlessPort !== '443') {
                alert('⛔ VLESS TLS port can be only 443 to be used as a proxy chain! 🫤');               
                return false;
            }

            if (isCustomCdn && !(customCdnAddrs.length > 0 && customCdnHost && customCdnSni)) {
                alert('⛔ All "Custom" fields should be filled or deleted together! 🫤');               
                return false;
            }

            try {
                document.body.style.cursor = 'wait';
                const applyButtonVal = applyButton.value;
                applyButton.value = '⌛ Loading...';

                const response = await fetch('/panel', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                document.body.style.cursor = 'default';
                applyButton.value = applyButtonVal;

                if (response.ok) {
                    alert('✅ Parameters applied successfully 😎');
                    window.location.reload(true);
                } else {
                    const errorMessage = await response.text();
                    console.error(errorMessage, response.status);
                    alert('⚠️ Session expired! Please login again.');
                    window.location.href = '/login';
                }           
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const logout = async (event) => {
            event.preventDefault();

            try {
                const response = await fetch('/logout', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
            
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    console.error('Failed to log out:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const resetPassword = async (event) => {
            event.preventDefault();
            const modal = document.getElementById('myModal');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const passwordError = document.getElementById('passwordError');             
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                passwordError.textContent = "Passwords do not match";
                return false;
            }

            const hasCapitalLetter = /[A-Z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);
            const isLongEnough = newPassword.length >= 8;

            if (!(hasCapitalLetter && hasNumber && isLongEnough)) {
                passwordError.textContent = '⚠️ Password must contain at least one capital letter, one number, and be at least 8 characters long.';
                return false;
            }
                    
            try {
                const response = await fetch('/panel/password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: newPassword,
                    credentials: 'same-origin'
                });
            
                if (response.ok) {
                    modal.style.display = "none";
                    document.body.style.overflow = "";
                    alert("✅ Password changed successfully! 👍");
                    window.location.href = '/login';
                } else if (response.status === 401) {
                    const errorMessage = await response.text();
                    passwordError.textContent = '⚠️ ' + errorMessage;
                    console.error(errorMessage, response.status);
                    alert('⚠️ Session expired! Please login again.');
                    window.location.href = '/login';
                } else {
                    const errorMessage = await response.text();
                    passwordError.textContent = '⚠️ ' + errorMessage;
                    console.error(errorMessage, response.status);
                    return false;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    </script>
    </body>	
    </html>`;

    return html;
}

function renderLoginPage () {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <style>
        :root {
            --color: black;
            --primary-color: #09639f;
            --header-color: #09639f; 
            --background-color: #fff;
            --form-background-color: #f9f9f9;
            --lable-text-color: #333;
            --h2-color: #3b3b3b;
            --border-color: #ddd;
            --input-background-color: white;
            --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            position: relative;
            overflow: hidden;
        }
        body.dark-mode {
            --color: white;
            --primary-color: #09639F;
            --header-color: #3498DB; 
            --background-color: #121212;
            --form-background-color: #121212;
            --lable-text-color: #DFDFDF;
            --h2-color: #D5D5D5;
            --border-color: #353535;
            --input-background-color: #252525;
            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        
        h2 { text-align: center; color: var(--h2-color) }
        .form-container {
            background: var(--form-background-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .form-control { margin-bottom: 15px; display: flex; align-items: center; }
        label {
            display: block;
            margin-bottom: 5px;
            padding-right: 20px;
            font-size: 110%;
            font-weight: 600;
            color: var(--lable-text-color);
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            color: var(--lable-text-color);
            background-color: var(--input-background-color);
        }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: var(--primary-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .button:hover,
        button:focus {
            background-color: #2980b9;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        button.button:hover { color: white; }
        .button:active { transform: translateY(1px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
        @media only screen and (min-width: 768px) {
            .container { width: 30%; }
        }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>BPB Panel <span style="font-size: smaller;">${panelVersion}</span> 💦</h1>
            <div class="form-container">
                <h2>User Login</h2>
                <form id="loginForm">
                    <div class="form-control">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div id="passwordError" style="color: red; margin-bottom: 10px;"></div>
                    <button type="submit" class="button">Login</button>
                </form>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: password
                });
            
                if (response.ok) {
                    window.location.href = '/panel';
                } else {
                    passwordError.textContent = '⚠️ Wrong Password!';
                    const errorMessage = await response.text();
                    console.error('Login failed:', errorMessage);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    </script>
    </body>
    </html>`;
}

function renderErrorPage (message, error, refer) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Page</title>
        <style>
            :root {
                --color: black;
                --header-color: #09639f; 
                --background-color: #fff;
                --border-color: #ddd;
                --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
            }
            body, html {
                height: 100%;
                width: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: system-ui;
                color: var(--color);
                background-color: var(--background-color);
            }
            body.dark-mode {
                --color: white;
                --header-color: #3498DB; 
                --background-color: #121212;
                --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);          
            }
            h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); text-shadow: var(--header-shadow); }
            #error-container { text-align: center; }
        </style>
    </head>
    <body>
        <div id="error-container">
            <h1>BPB Panel <span style="font-size: smaller;">${panelVersion}</span> 💦</h1>
            <div id="error-message">
                <h2>${message} ${refer 
                    ? 'Please try again or refer to <a href="https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/README.md">documents</a>' 
                    : ''}
                </h2>
                <p><b>${error ? `⚠️ ${error.stack.toString()}` : ''}</b></p>
            </div>
        </div>
    <script>
        localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
    </script>
    </body>
    </html>`;
}

function extractChainProxyParams(chainProxy) {
    let configParams = {};
    if (!chainProxy) return null;
    let url = new URL(chainProxy);
    const protocol = url.protocol.slice(0, -1);
    if (protocol === 'vless') {
        const params = new URLSearchParams(url.search);
        configParams = {
            protocol: protocol,
            uuid : url.username,
            hostName : url.hostname,
            port : url.port
        };
    
        params.forEach( (value, key) => {
            configParams[key] = value;
        });
    } else {
        configParams = {
            protocol: protocol, 
            user : url.username,
            pass : url.password,
            host : url.host,
            port : url.port
        };
    }

    return JSON.stringify(configParams);
}

async function fetchWgConfig (env, proxySettings) {
    let warpConfigs = [];
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';

    const { warpPlusLicense } = proxySettings;
    const warpKeys = [generateKeyPair(), generateKeyPair()];

    for(let i = 0; i < 2; i++) {
        const accountResponse = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'insomnia/8.6.1',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: warpKeys[i].publicKey,
                install_id: "",
                fcm_token: "",
                tos: new Date().toISOString(),
                type: "Android",
                model: 'PC',
                locale: 'en_US',
                warp_enabled: true
            })
        });

        const accountData = await accountResponse.json();
        warpConfigs.push ({
            privateKey: warpKeys[i].privateKey,
            account: accountData
        });

        if (warpPlusLicense) {
            const response = await fetch(`${apiBaseUrl}/${accountData.id}/account`, {
                method: 'PUT',
                headers: {
                    'User-Agent': 'insomnia/8.6.1',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accountData.token}`
                },
                body: JSON.stringify({
                    key: warpKeys[i].publicKey,
                    install_id: "",
                    fcm_token: "",
                    tos: new Date().toISOString(),
                    type: "Android",
                    model: 'PC',
                    locale: 'en_US',
                    warp_enabled: true,
                    license: warpPlusLicense
                })
            });

            const responseData = await response.json();
            if(response.status !== 200 && !responseData.success) return { error: responseData.errors[0]?.message, configs: null}
        }
    }
    
    const configs = JSON.stringify(warpConfigs)
    await env.bpb.put('warpConfigs', configs);
    return { error: null, configs };
}

function extractWireguardParams(warpConfigs, isWoW) {
    const index = isWoW ? 1 : 0;
    const warpConfig = warpConfigs[index].account.config;
    return {
        warpIPv6: `${warpConfig.interface.addresses.v6}/128`,
        reserved: warpConfig.client_id,
        publicKey: warpConfig.peers[0].public_key,
        privateKey: warpConfigs[index].privateKey,
    };
}

async function buildXrayDNS (proxySettings, outboundAddrs, domainToStaticIPs, isWorkerLess, isWarp) {
    const { 
        remoteDNS, 
        resolvedRemoteDNS, 
        localDNS, 
        vlessTrojanFakeDNS, 
        warpFakeDNS, 
        blockAds, 
        bypassIran, 
        bypassChina,
        blockPorn, 
        bypassRussia 
    } = proxySettings;

    const isBypass = bypassIran || bypassChina || bypassRussia;
    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const outboundDomains = outboundAddrs.filter(address => isDomain(address));
    const isOutboundRule = outboundDomains.length > 0;
    const outboundRules = outboundDomains.map(domain => `full:${domain}`);
    const finalRemoteDNS = isWarp 
        ? ['1.1.1.1', '1.0.0.1'] 
        : isWorkerLess 
            ? ['https://cloudflare-dns.com/dns-query']
            : [remoteDNS];
            
    let dnsObject = {
        hosts: {
            "domain:googleapis.cn": ["googleapis.com"]
        },
        servers: finalRemoteDNS,
        tag: "dns",
    };
            
    const staticIPs = domainToStaticIPs ? await resolveDNS(domainToStaticIPs) : undefined;
    if (staticIPs) dnsObject.hosts[domainToStaticIPs] = [...staticIPs.ipv4, ...staticIPs.ipv6];
    if (resolvedRemoteDNS.server && !isWorkerLess && !isWarp) dnsObject.hosts[resolvedRemoteDNS.server] = resolvedRemoteDNS.staticIPs;
    if (isWorkerLess) {
        const resolvedDOH = await resolveDNS('cloudflare-dns.com');
        const resolvedCloudflare = await resolveDNS('cloudflare.com');
        const resolvedCLDomain = await resolveDNS('www.speedtest.net.cdn.cloudflare.net');
        const resolvedCFNS_1 = await resolveDNS('ben.ns.cloudflare.com');
        const resolvedCFNS_2 = await resolveDNS('lara.ns.cloudflare.com');
        dnsObject.hosts['cloudflare-dns.com'] = [
            ...resolvedDOH.ipv4, 
            ...resolvedCloudflare.ipv4, 
            ...resolvedCLDomain.ipv4,
            ...resolvedCFNS_1.ipv4,
            ...resolvedCFNS_2.ipv4
        ];
    }

    if (blockAds) {
        dnsObject.hosts["geosite:category-ads-all"] = ["127.0.0.1"];
        dnsObject.hosts["geosite:category-ads-ir"] = ["127.0.0.1"];
    }

    if (blockPorn) {
        dnsObject.hosts["geosite:category-porn"] = ["127.0.0.1"];
    }

    isOutboundRule && dnsObject.servers.push({
        address: localDNS === 'localhost' ? '8.8.8.8' : localDNS,
        domains: outboundRules
    });

    let localDNSServer = {
        address: localDNS,
        domains: [],
        expectIPs: []
    };

    if (!isWorkerLess && isBypass) {
        bypassIran && localDNSServer.domains.push("geosite:category-ir") && localDNSServer.expectIPs.push("geoip:ir"); 
        bypassChina && localDNSServer.domains.push("geosite:cn") && localDNSServer.expectIPs.push("geoip:cn");
        bypassRussia && localDNSServer.domains.push("geosite:category-ru") && localDNSServer.expectIPs.push("geoip:ru");
        dnsObject.servers.push(localDNSServer);
    }

    if (isFakeDNS) { 
        if ((isBypass || isOutboundRule) && !isWorkerLess) {
            dnsObject.servers.unshift({
                address: "fakedns",
                domains: [
                    ...localDNSServer.domains,
                    ...outboundRules
                ]
            });
        } else {
            dnsObject.servers.unshift("fakedns");
        }
    }

    return dnsObject;
}

function buildXrayRoutingRules (proxySettings, outboundAddrs, isChain, isBalancer, isWorkerLess) {
    const { 
        localDNS, 
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn, 
        blockUDP443 
    } = proxySettings;

    const isBypass = bypassIran || bypassChina || bypassRussia || bypassLAN;
    const outboundDomains = outboundAddrs.filter(address => isDomain(address));
    const isOutboundRule = outboundDomains.length > 0;
    let rules = [
        {
            inboundTag: [
                "dns-in"
            ],
            outboundTag: "dns-out",
            type: "field"
        },
        {
            inboundTag: [
                "socks-in",
                "http-in"
            ],
            port: "53",
            outboundTag: "dns-out",
            type: "field"
        }
    ];

    if (!isWorkerLess && (isOutboundRule || (localDNS !== 'localhost' && isBypass))) rules.push({
        ip: [localDNS === 'localhost' ? '8.8.8.8' : localDNS],
        port: "53",
        outboundTag: "direct",
        type: "field"
    });

    if (isBypass && !isWorkerLess) {
        let ipRule = {
            ip: [],
            outboundTag: "direct",
            type: "field",
        };

        let domainRule = {
            domain: [],
            outboundTag: "direct",
            type: "field",
        };

        bypassLAN && domainRule.domain.push("geosite:private") && ipRule.ip.push("geoip:private");
        bypassIran && domainRule.domain.push("geosite:category-ir") && ipRule.ip.push("geoip:ir");
        bypassChina && domainRule.domain.push("geosite:cn") && ipRule.ip.push("geoip:cn");
        bypassRussia && domainRule.domain.push("geosite:category-ru") && ipRule.ip.push("geoip:ru");
        rules.push(domainRule, ipRule);
    }

    blockUDP443 && rules.push({
        network: "udp",
        port: "443",
        outboundTag: "block",
        type: "field",
    });

    if (blockAds || blockPorn) {
        let rule = {
            domain: [],
            outboundTag: "block",
            type: "field",
        };

        blockAds && rule.domain.push("geosite:category-ads-all", "geosite:category-ads-ir");
        blockPorn && rule.domain.push("geosite:category-porn");
        rules.push(rule);
    }

    if (isBalancer) {
        rules.push({
            network: "tcp,udp",
            balancerTag: "all",
            type: "field"
        });
    } else  {
        rules.push({
            network: "tcp,udp",
            outboundTag: isChain ? "chain" : isWorkerLess ? "fragment" : "proxy",
            type: "field"
        });
    }

    return rules;
}

function buildXrayVLESSOutbound (tag, address, port, host, sni, proxyIP, isFragment, allowInsecure) {
    let outbound = {
        protocol: "vless",
        settings: {
            vnext: [
                {
                    address: address,
                    port: +port,
                    users: [
                        {
                            id: userID,
                            encryption: "none",
                            level: 8
                        }
                    ]
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "none",
            sockopt: {},
            wsSettings: {
                headers: {
                    Host: host,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
                },
                path: `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}?ed=2560`
            }
        },
        tag: tag
    };

    if (defaultHttpsPorts.includes(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: "randomized",
            alpn: ["h2", "http/1.1"],
            serverName: sni
        };
    }

    if (isFragment) {
        outbound.streamSettings.sockopt.dialerProxy = "fragment";
    } else {
        outbound.streamSettings.sockopt.tcpKeepAliveIdle = 100;
        outbound.streamSettings.sockopt.tcpNoDelay = true;
    }
    
    return outbound;
}

function buildXrayTrojanOutbound (tag, address, port, host, sni, proxyIP, isFragment, allowInsecure) {
    let outbound = {
        protocol: "trojan",
        settings: {
            servers: [
                {
                    address: address,
                    port: +port,
                    password: trojanPassword,
                    level: 8
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "none",
            sockopt: {},
            wsSettings: {
                headers: {
                    Host: host
                },
                path: `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}?ed=2560`
            }
        },
        tag: tag
    };

    if (defaultHttpsPorts.includes(port)) {
        outbound.streamSettings.security = "tls";
        outbound.streamSettings.tlsSettings = {
            allowInsecure: allowInsecure,
            fingerprint: "randomized",
            alpn: ["h2", "http/1.1"],
            serverName: sni
        };
    }

    if (isFragment) {
        outbound.streamSettings.sockopt.dialerProxy = "fragment";
    } else {
        outbound.streamSettings.sockopt.tcpKeepAliveIdle = 100;
        outbound.streamSettings.sockopt.tcpNoDelay = true;
    }
    
    return outbound;
}

function buildXrayWarpOutbound (proxySettings, warpConfigs, endpoint, isChain, client) {
    const { 
		nikaNGNoiseMode,  
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax 
	} = proxySettings;

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, isChain);

    let outbound = {
        protocol: "wireguard",
        settings: {
            address: [
                "172.16.0.2/32",
                warpIPv6
            ],
            mtu: 1280,
            peers: [
                {
                    endpoint: endpoint,
                    publicKey: publicKey,
                    keepAlive: 5
                }
            ],
            reserved: base64ToDecimal(reserved),
            secretKey: privateKey
        },
        streamSettings: {
            sockopt: {
                dialerProxy: "proxy",
                tcpKeepAliveIdle: 100,
                tcpNoDelay: true,
            }
        },
        tag: isChain ? "chain" : "proxy"
    };

    !isChain && delete outbound.streamSettings;
    client === 'nikang' && !isChain && Object.assign(outbound.settings, {
        wnoise: nikaNGNoiseMode,
        wnoisecount: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
        wpayloadsize: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
        wnoisedelay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
    });

    return outbound;
}

function buildXrayChainOutbound(chainProxyParams) {
    if (['socks', 'http'].includes(chainProxyParams.protocol)) {
        const { protocol, host, port, user, pass } = chainProxyParams;
        return {
            protocol: protocol,
            settings: {
                servers: [
                    {
                        address: host,
                        port: +port,
                        users: [
                            {
                                user: user,
                                pass: pass,
                                level: 8
                            }
                        ]
                    }
                ]
            },
            streamSettings: {
                network: "tcp",
                sockopt: {
                    dialerProxy: "proxy",
                    tcpNoDelay: true
                }
            },
            mux: {
                enabled: true,
                concurrency: 8,
                xudpConcurrency: 16,
                xudpProxyUDP443: "reject"
            },
            tag: "chain"
        };
    }

    const { 
        hostName, 
        port, 
        uuid, 
        flow, 
        security, 
        type, 
        sni, 
        fp, 
        alpn, 
        pbk, 
        sid, 
        spx, 
        headerType, 
        host, 
        path, 
        authority, 
        serviceName, 
        mode 
    } = chainProxyParams;

    let proxyOutbound = {
        mux: {
            concurrency: 8,
            enabled: true,
            xudpConcurrency: 16,
            xudpProxyUDP443: "reject"
        },
        protocol: "vless",
        settings: {
            vnext: [
                {
                    address: hostName,
                    port: +port,
                    users: [
                        {
                            encryption: "none",
                            flow: flow,
                            id: uuid,
                            level: 8,
                            security: "auto"
                        }
                    ]
                }
            ]
        },
        streamSettings: {
            network: type,
            security: security,
            sockopt: {
                dialerProxy: "proxy",
                tcpNoDelay: true
            }
        },
        tag: "chain"
    };
    
    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        proxyOutbound.streamSettings.tlsSettings = {
            allowInsecure: false,
            fingerprint: fp,
            alpn: tlsAlpns,
            serverName: sni
        };
    }

    if (security === 'reality') { 
        delete proxyOutbound.mux;
        proxyOutbound.streamSettings.realitySettings = {
            fingerprint: fp,
            publicKey: pbk,
            serverName: sni,
            shortId: sid,
            spiderX: spx
        };
    }

    if (headerType === 'http') {
        const httpPaths = path?.split(',');
        const httpHosts = host?.split(',');
        proxyOutbound.streamSettings.tcpSettings = {
            header: {
                request: {
                    headers: { Host: httpHosts },
                    method: "GET",
                    path: httpPaths,
                    version: "1.1"
                },
                response: {
                    headers: { "Content-Type": ["application/octet-stream"] },
                    reason: "OK",
                    status: "200",
                    version: "1.1"
                },
                type: "http"
            }
        };
    }

    if (type === 'tcp' && security !== 'reality' && !headerType) proxyOutbound.streamSettings.tcpSettings = {
        header: {
            type: "none"
        }
    };
    
    if (type === 'ws') proxyOutbound.streamSettings.wsSettings = {
        headers: { Host: host },
        path: path
    };
    
    if (type === 'grpc') {
        delete proxyOutbound.mux;
        proxyOutbound.streamSettings.grpcSettings = {
            authority: authority,
            multiMode: mode === 'multi',
            serviceName: serviceName
        };
    }
    
    return proxyOutbound;
}

function buildXrayConfig (proxySettings, remark, isFragment, isBalancer, isChain, balancerFallback, isWarp) {
    const { 
        vlessTrojanFakeDNS, 
        warpFakeDNS, 
        bestVLESSTrojanInterval, 
        bestWarpInterval, 
        lengthMin, 
        lengthMax, 
        intervalMin, 
        intervalMax, 
        fragmentPackets 
    } = proxySettings;

    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    let config = structuredClone(xrayConfigTemp);
    config.remarks = remark;
    if (isFakeDNS) {
        config.inbounds[0].sniffing.destOverride.push("fakedns");
        config.inbounds[1].sniffing.destOverride.push("fakedns");
    } else {
        delete config.fakedns; 
    }

    if (isFragment) {
        const fragment = config.outbounds[0].settings.fragment;
        fragment.length = `${lengthMin}-${lengthMax}`;
        fragment.interval = `${intervalMin}-${intervalMax}`;
        fragment.packets = fragmentPackets;
    } else {
        config.outbounds.shift();
    }

    if (isBalancer) {
        const interval = isWarp ? bestWarpInterval : bestVLESSTrojanInterval;
        config.observatory.probeInterval = `${interval}s`;
        config.observatory.subjectSelector = [isChain ? 'chain' : 'prox'];
        config.routing.balancers[0].selector = [isChain ? 'chain' : 'prox']; 
        if (balancerFallback) config.routing.balancers[0].fallbackTag = balancerFallback; 
    } else {
        delete config.observatory;
        delete config.routing.balancers;
    }

    return config;
}

async function buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment) {
    const remark = isFragment ? '💦 BPB F - Best Ping 💥' : '💦 BPB - Best Ping 💥';
    let config = buildXrayConfig(proxySettings, remark, isFragment, true, chainProxy, chainProxy ? 'chain-2' : 'prox-2');
    config.dns = await buildXrayDNS(proxySettings, totalAddresses, undefined);
    config.routing.rules = buildXrayRoutingRules(proxySettings, totalAddresses, chainProxy, true, false);
    config.outbounds.unshift(...outbounds);

    return config;
}

async function buildXrayBestFragmentConfig(proxySettings, hostName, chainProxy, outbounds) {
    const bestFragValues = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', 
                            '70-80', '80-90', '90-100', '10-30', '20-40', '30-50', 
                            '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'];

    let config = buildXrayConfig(proxySettings, '💦 BPB F - Best Fragment 😎', true, true, chainProxy, undefined, false);
    config.dns = await buildXrayDNS(proxySettings, [], hostName);
    config.routing.rules = buildXrayRoutingRules(proxySettings, [], chainProxy, true, false);
    const fragment = config.outbounds.shift();
    let bestFragOutbounds = [];
    
    bestFragValues.forEach( (fragLength, index) => { 
        if (chainProxy) {
            let chainOutbound = structuredClone(chainProxy);
            chainOutbound.tag = `chain-${index + 1}`;
            chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
            bestFragOutbounds.push(chainOutbound);
        }
        
        let proxyOutbound = structuredClone(outbounds[chainProxy ? 1 : 0]);
        proxyOutbound.tag = `prox-${index + 1}`;
        proxyOutbound.streamSettings.sockopt.dialerProxy = `frag-${index + 1}`;
        let fragmentOutbound = structuredClone(fragment);
        fragmentOutbound.tag = `frag-${index + 1}`;
        fragmentOutbound.settings.fragment.length = fragLength;
        fragmentOutbound.settings.fragment.interval = '1-1';
        bestFragOutbounds.push(proxyOutbound, fragmentOutbound);
    });
    
    config.outbounds.unshift(...bestFragOutbounds);
    return config;
}

async function buildXrayWorkerLessConfig(proxySettings) {
    let config = buildXrayConfig(proxySettings, '💦 BPB F - WorkerLess ⭐', true, false, false, undefined, false);
    config.dns = await buildXrayDNS(proxySettings, [], undefined, true);
    config.routing.rules = buildXrayRoutingRules(proxySettings, [], false, false, true);
    let fakeOutbound = buildXrayVLESSOutbound('fake-outbound', 'google.com', '443', userID, 'google.com', 'google.com', '', true, false);
    delete fakeOutbound.streamSettings.sockopt;
    fakeOutbound.streamSettings.wsSettings.path = '/';
    config.outbounds.push(fakeOutbound);

    return config;
}

async function getXrayCustomConfigs(env, proxySettings, hostName, isFragment) {
    let configs = [];
    let outbounds = [];
    let protocols = [];
    let chainProxy;
    const {
        proxyIP,
        outProxy,
        outProxyParams,
        cleanIPs,
        enableIPv6,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        vlessConfigs,
        trojanConfigs,
        ports
    } = proxySettings;

    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);
        try {
            chainProxy = buildXrayChainOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxy = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: ''
            }));
        }
    }
    
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = isFragment ? [...Addresses] : [...Addresses, ...customCdnAddresses];
    const totalPorts = ports.filter(port => isFragment ? defaultHttpsPorts.includes(port): true);
    vlessConfigs && protocols.push('VLESS');
    trojanConfigs && protocols.push('Trojan');
    let proxyIndex = 1;
    
    for (const protocol of protocols) {
        let protocolIndex = 1;
        for (const port of totalPorts)  {
            for (const addr of totalAddresses) {
                const isCustomAddr = customCdnAddresses.includes(addr);
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
                let customConfig = buildXrayConfig(proxySettings, remark, isFragment, false, chainProxy, undefined, false);
                customConfig.dns = await buildXrayDNS(proxySettings, [addr], undefined);
                customConfig.routing.rules = buildXrayRoutingRules(proxySettings, [addr], chainProxy, false, false);
                let outbound = protocol === 'VLESS'
                    ? buildXrayVLESSOutbound('proxy', addr, port, host, sni, proxyIP, isFragment, isCustomAddr)
                    : buildXrayTrojanOutbound('proxy', addr, port, host, sni, proxyIP, isFragment, isCustomAddr);

                customConfig.outbounds.unshift({...outbound});
                outbound.tag = `prox-${proxyIndex}`;

                if (chainProxy) {
                    customConfig.outbounds.unshift(chainProxy);
                    let chainOutbound = structuredClone(chainProxy);
                    chainOutbound.tag = `chain-${proxyIndex}`;
                    chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${proxyIndex}`;
                    outbounds.push(chainOutbound);
                }
                
                outbounds.push(outbound);
                configs.push(customConfig);
                proxyIndex++;
                protocolIndex++;
            }
        }
    }
    
    const bestPing = await buildXrayBestPingConfig(proxySettings, totalAddresses, chainProxy, outbounds, isFragment);
    if (!isFragment) return [...configs, bestPing];
    const bestFragment = await buildXrayBestFragmentConfig(proxySettings, hostName, chainProxy, outbounds);
    const workerLessConfig = await buildXrayWorkerLessConfig(proxySettings); 
    configs.push(bestPing, bestFragment, workerLessConfig);

    return configs;
}

async function getXrayWarpConfigs (proxySettings, warpConfigs, client) {
    let xrayWarpConfigs = [];
    let xrayWoWConfigs = [];
    let xrayWarpOutbounds = [];
    let xrayWoWOutbounds = [];
    const { warpEndpoints } = proxySettings;
    const outboundDomains = warpEndpoints.split(',').map(endpoint => endpoint.split(':')[0]).filter(address => isDomain(address));
    const proIndicator = client === 'nikang' ? ' Pro ' : ' ';
    
    for (const [index, endpoint] of warpEndpoints.split(',').entries()) {
        const endpointHost = endpoint.split(':')[0];
        let warpConfig = buildXrayConfig(proxySettings, `💦 ${index + 1} - Warp${proIndicator}🇮🇷`, false, false, false, undefined, true);
        let WoWConfig = buildXrayConfig(proxySettings, `💦 ${index + 1} - WoW${proIndicator}🌍`, false, false, true, undefined, true);
        warpConfig.dns = WoWConfig.dns = await buildXrayDNS(proxySettings, [endpointHost], undefined, false, true);    
        warpConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], false, false, false);
        WoWConfig.routing.rules = buildXrayRoutingRules(proxySettings, [endpointHost], true, false, false);
        const warpOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, false, client);
        const WoWOutbound = buildXrayWarpOutbound(proxySettings, warpConfigs, endpoint, true, client);
        warpOutbound.settings.peers[0].endpoint = endpoint;
        WoWOutbound.settings.peers[0].endpoint = endpoint;
        warpConfig.outbounds.unshift(warpOutbound);
        WoWConfig.outbounds.unshift(WoWOutbound, warpOutbound);
        xrayWarpConfigs.push(warpConfig);
        xrayWoWConfigs.push(WoWConfig);
        const proxyOutbound = structuredClone(warpOutbound);
        proxyOutbound.tag = `prox-${index + 1}`;
        const chainOutbound = structuredClone(WoWOutbound);
        chainOutbound.tag = `chain-${index + 1}`;
        chainOutbound.streamSettings.sockopt.dialerProxy = `prox-${index + 1}`;
        xrayWarpOutbounds.push(proxyOutbound);
        xrayWoWOutbounds.push(chainOutbound);
    }

    const dnsObject = await buildXrayDNS(proxySettings, outboundDomains, undefined, false, true);
    let xrayWarpBestPing = buildXrayConfig(proxySettings, `💦 Warp${proIndicator}- Best Ping 🚀`, false, true, false, undefined, true);
    xrayWarpBestPing.dns = dnsObject;    
    xrayWarpBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, false, true, false);
    xrayWarpBestPing.outbounds.unshift(...xrayWarpOutbounds);
    let xrayWoWBestPing = buildXrayConfig(proxySettings, `💦 WoW${proIndicator}- Best Ping 🚀`, false, true, true, undefined, true);
    xrayWoWBestPing.dns = dnsObject;
    xrayWoWBestPing.routing.rules = buildXrayRoutingRules(proxySettings, outboundDomains, true, true, false);
    xrayWoWBestPing.outbounds.unshift(...xrayWoWOutbounds, ...xrayWarpOutbounds);
    return [...xrayWarpConfigs, ...xrayWoWConfigs, xrayWarpBestPing, xrayWoWBestPing];
}

async function buildClashDNS (proxySettings, isWarp) {
    const { 
        remoteDNS, 
        resolvedRemoteDNS, 
        localDNS, 
        vlessTrojanFakeDNS, 
        warpFakeDNS, 
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia 
    } = proxySettings;

    const finalRemoteDNS = isWarp 
        ? ['1.1.1.1', '1.0.0.1'] 
        : [remoteDNS];
    let clashLocalDNS = localDNS === 'localhost' ? 'system' : localDNS;
    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);

    let dns = {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": true,
        "respect-rules": true,
        "nameserver": finalRemoteDNS,
        "proxy-server-nameserver": [clashLocalDNS]
    };
    
    if (resolvedRemoteDNS.server && !isWarp) {
        dns['hosts'] = {
            [resolvedRemoteDNS.server]: resolvedRemoteDNS.staticIPs
        };
    }
    
    let geosites = [];
    bypassLAN && geosites.push('private');
    bypassIran && geosites.push('category-ir');
    bypassChina && geosites.push('cn');
    bypassRussia && geosites.push('category-ru');

    if (bypassIran || bypassChina || bypassLAN || bypassRussia) { 
        dns['nameserver-policy'] = {
            [`geosite:${geosites.join(',')}`]: [clashLocalDNS],
            'www.gstatic.com': [clashLocalDNS]
        };
    }

    if (isFakeDNS) {
        dns["enhanced-mode"] = "fake-ip";
        dns["fake-ip-range"] = "198.18.0.1/16";
    } 

    return dns;
}

function buildClashRoutingRules (proxySettings) {
    let rules = [];
    const { 
        localDNS, 
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn, 
        blockUDP443 
    } = proxySettings;

    localDNS !== 'localhost' && rules.push(`AND,((IP-CIDR,${localDNS}/32),(DST-PORT,53)),DIRECT`);
    bypassLAN && rules.push('GEOSITE,private,DIRECT');
    bypassIran && rules.push('GEOSITE,category-ir,DIRECT');
    bypassChina && rules.push('GEOSITE,cn,DIRECT');
    bypassRussia && rules.push('GEOSITE,category-ru,DIRECT');
    bypassLAN && rules.push('GEOIP,private,DIRECT,no-resolve');
    bypassIran && rules.push('GEOIP,ir,DIRECT,no-resolve');
    bypassChina && rules.push('GEOIP,cn,DIRECT,no-resolve');
    bypassRussia && rules.push('GEOIP,ru,DIRECT,no-resolve');
    blockUDP443 && rules.push('AND,((NETWORK,udp),(DST-PORT,443)),REJECT');
    blockAds && rules.push('GEOSITE,category-ads-all,REJECT', 'GEOSITE,category-ads-ir,REJECT');
    blockPorn && rules.push('GEOSITE,category-porn,REJECT');
    rules.push('MATCH,✅ Selector');

    return rules;
}

function buildClashVLESSOutbound (remark, address, port, host, sni, path, allowInsecure) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    let outbound = {
        "name": remark,
        "type": "vless",
        "server": addr,
        "port": +port,
        "uuid": userID,
        "tls": tls,
        "network": "ws",
        "udp": false,
        "ws-opts": {
            "path": path,
            "headers": { "host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        }
    };

    if (tls) {
        Object.assign(outbound, {
            "servername": sni,
            "alpn": ["h2", "http/1.1"],
            "client-fingerprint": "random",
            "skip-cert-verify": allowInsecure
        });
    }

    return outbound;
}

function buildClashTrojanOutbound (remark, address, port, host, sni, path, allowInsecure) {
    const addr = isIPv6(address) ? address.replace(/\[|\]/g, '') : address;
    return {
        "name": remark,
        "type": "trojan",
        "server": addr,
        "port": +port,
        "password": trojanPassword,
        "network": "ws",
        "udp": false,
        "ws-opts": {
            "path": path,
            "headers": { "host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        },
        "sni": sni,
        "alpn": ["h2", "http/1.1"],
        "client-fingerprint": "random",
        "skip-cert-verify": allowInsecure
    };
}

function buildClashWarpOutbound (warpConfigs, remark, endpoint, chain) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    return {
        "name": remark,
        "type": "wireguard",
        "ip": "172.16.0.2/32",
        "ipv6": warpIPv6,
        "private-key": privateKey,
        "server": endpointServer,
        "port": endpointPort,
        "public-key": publicKey,
        "allowed-ips": ["0.0.0.0/0", "::/0"],
        "reserved": reserved,
        "udp": true,
        "mtu": 1280,
        "dialer-proxy": chain,
        "remote-dns-resolve": true,
        "dns": [ "1.1.1.1", "1.0.0.1" ]
    };
}

function buildClashChainOutbound(chainProxyParams) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, host, port, user, pass } = chainProxyParams;
        const proxyType = protocol === 'socks' ? 'socks5' : protocol; 
        return {
            "name": "",
            "type": proxyType,
            "server": host,
            "port": +port,
            "dialer-proxy": "",
            "username": user,
            "password": pass
        };
    }

    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    let chainOutbound = {
        "name": "💦 Chain Best Ping 💥",
        "type": "vless",
        "server": hostName,
        "port": +port,
        "udp": true,
        "uuid": uuid,
        "flow": flow,
        "network": type,
        "dialer-proxy": "💦 Best Ping 💥"
    };

    if (security === 'tls') {
        const tlsAlpns = alpn ? alpn?.split(',') : [];
        Object.assign(chainOutbound, {
            "tls": true,
            "servername": sni,
            "alpn": tlsAlpns,
            "client-fingerprint": fp
        });
    }

    if (security === 'reality') Object.assign(chainOutbound, {
        "tls": true,
        "servername": sni,
        "client-fingerprint": fp,
        "reality-opts": {
            "public-key": pbk,
            "short-id": sid
        }
    });
    
    if (headerType === 'http') {
        const httpPaths = path?.split(',');
        chainOutbound["http-opts"] = {
            "method": "GET",
            "path": httpPaths,
            "headers": {
                "Connection": ["keep-alive"],
                "Content-Type": ["application/octet-stream"]
            }
        };
    }

    if (type === 'ws') {
        const wsPath = path?.split('?ed=')[0];
        const earlyData = +path?.split('?ed=')[1];
        chainOutbound["ws-opts"] = {
            "path": wsPath,
            "headers": {
                "Host": host
            },
            "max-early-data": earlyData,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        };
    }
 
    if (type === 'grpc') chainOutbound["grpc-opts"] = {
        "grpc-service-name": serviceName
    };

    return chainOutbound;
}

async function getClashWarpConfig(proxySettings, warpConfigs) {
    const { warpEndpoints } = proxySettings;
    let config = structuredClone(clashConfigTemp);
    config.dns = await buildClashDNS(proxySettings, true);
    config.rules = buildClashRoutingRules(proxySettings);
    const selector = config['proxy-groups'][0];
    const warpUrlTest = config['proxy-groups'][1];
    selector.proxies = ['💦 Warp - Best Ping 🚀', '💦 WoW - Best Ping 🚀'];
    warpUrlTest.name = '💦 Warp - Best Ping 🚀';
    warpUrlTest.interval = +proxySettings.bestWarpInterval;
    config['proxy-groups'].push(structuredClone(warpUrlTest));
    const WoWUrlTest = config['proxy-groups'][2];
    WoWUrlTest.name = '💦 WoW - Best Ping 🚀';
    let warpRemarks = [], WoWRemarks = [];
    
    warpEndpoints.split(',').forEach( (endpoint, index) => {
        const warpRemark = `💦 ${index + 1} - Warp 🇮🇷`;
        const WoWRemark = `💦 ${index + 1} - WoW 🌍`;
        const warpOutbound = buildClashWarpOutbound(warpConfigs, warpRemark, endpoint, '');
        const WoWOutbound = buildClashWarpOutbound(warpConfigs, WoWRemark, endpoint, warpRemark);
        config.proxies.push(WoWOutbound, warpOutbound);
        warpRemarks.push(warpRemark);
        WoWRemarks.push(WoWRemark);
        warpUrlTest.proxies.push(warpRemark);
        WoWUrlTest.proxies.push(WoWRemark);
    });
    
    selector.proxies.push(...warpRemarks, ...WoWRemarks);
    return config;
}

async function getClashNormalConfig (env, proxySettings, hostName) {
    let chainProxy;
    const { 
        cleanIPs, 
        proxyIP, 
        ports, 
        vlessConfigs, 
        trojanConfigs, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        enableIPv6
    } = proxySettings; 

    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);        
        try {
            chainProxy = buildClashChainOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxy = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: ''
            }));
        }
    }

    let config = structuredClone(clashConfigTemp);
    config.dns = await buildClashDNS(proxySettings, false);
    config.rules = buildClashRoutingRules(proxySettings);
    const selector = config['proxy-groups'][0];
    const urlTest = config['proxy-groups'][1];
    selector.proxies = ['💦 Best Ping 💥'];
    urlTest.name = '💦 Best Ping 💥';
    urlTest.interval = +bestVLESSTrojanInterval;
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    let proxyIndex = 1, path;
    const protocols = [
        ...(vlessConfigs ? ['VLESS'] : []),
        ...(trojanConfigs ? ['Trojan'] : [])
    ];

    protocols.forEach ( protocol => {
        let protocolIndex = 1;
        ports.forEach ( port => {
            totalAddresses.forEach( addr => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = customCdnAddresses.includes(addr);
                const configType = isCustomAddr ? 'C' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType).replace(' : ', ' - ');

                if (protocol === 'VLESS') {
                    path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    VLESSOutbound = buildClashVLESSOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port,  
                        host,
                        sni, 
                        path,
                        isCustomAddr
                    );
                    config.proxies.push(VLESSOutbound);
                    selector.proxies.push(remark);
                    urlTest.proxies.push(remark);
                }
                
                if (protocol === 'Trojan' && defaultHttpsPorts.includes(port)) {
                    path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    TrojanOutbound = buildClashTrojanOutbound(
                        chainProxy ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port,  
                        host,
                        sni, 
                        path,
                        isCustomAddr
                    );
                    config.proxies.push(TrojanOutbound);
                    selector.proxies.push(remark);
                    urlTest.proxies.push(remark);
                }

                if (chainProxy) {
                    let chain = structuredClone(chainProxy);
                    chain['name'] = remark;
                    chain['dialer-proxy'] = `proxy-${proxyIndex}`;
                    config.proxies.push(chain);
                }

                proxyIndex++;
                protocolIndex++;
            });
        });
    });

    return config;
}

function buildSingBoxDNS (proxySettings, isChain, isWarp) {
    const { 
        remoteDNS, 
        localDNS, 
        vlessTrojanFakeDNS, 
        warpFakeDNS, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn 
    } = proxySettings;

    let fakeip;
    const isFakeDNS = (vlessTrojanFakeDNS && !isWarp) || (warpFakeDNS && isWarp);
    const servers = [
        {
            address: isWarp ? '1.1.1.1' : remoteDNS,
            address_resolver: "dns-direct",
            strategy: "prefer_ipv4",
            detour: isChain ? 'proxy-1' : "proxy",
            tag: "dns-remote"
        },
        {
            address: localDNS === 'localhost' ? 'local' : localDNS,
            strategy: "prefer_ipv4",
            detour: "direct",
            tag: "dns-direct"
        },
        {
            address: "rcode://success",
            tag: "dns-block"
        }
    ];

    let rules = [
        {
            outbound: "any",
            server: "dns-direct"
        }
    ];

    if (bypassIran || bypassChina || bypassRussia) {
        let bypassRules = {
            rule_set: [],
            server: "dns-direct"
        };
        bypassIran && bypassRules.rule_set.push("geosite-ir");
        bypassChina && bypassRules.rule_set.push("geosite-cn");
        bypassRussia && bypassRules.rule_set.push("geosite-category-ru");
        rules.push(bypassRules);
    }

    let blockRules = {
        disable_cache: true,
        rule_set: [
            "geosite-malware",
            "geosite-phishing",
            "geosite-cryptominers"
        ],
        server: "dns-block"
    };

    blockAds && blockRules.rule_set.push("geosite-category-ads-all");
    blockPorn && blockRules.rule_set.push("geosite-nsfw");
    rules.push(blockRules);

    if (isFakeDNS) {
        servers.push({
            address: "fakeip",
            tag: "dns-fake"
        });

        rules.push({
            disable_cache: true,
            inbound: "tun-in",
            query_type: [
              "A",
              "AAAA"
            ],
            server: "dns-fake"
        });

        fakeip = {
            enabled: true,
            inet4_range: "198.18.0.0/15",
            inet6_range: "fc00::/18"
        };
    }

    return {servers, rules, fakeip};
}

function buildSingBoxRoutingRules (proxySettings) {
    const { 
        bypassLAN, 
        bypassIran, 
        bypassChina, 
        bypassRussia, 
        blockAds, 
        blockPorn, 
        blockUDP443 
    } = proxySettings;

    let rules = [
        {
            inbound: "dns-in",
            outbound: "dns-out"
        },
        {
            network: "udp",
            port: 53,
            outbound: "dns-out"
        }
    ];

    let ruleSet = [
        {
            type: "remote",
            tag: "geosite-malware",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-malware.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geosite-phishing",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-phishing.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geosite-cryptominers",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-cryptominers.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geoip-malware",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-malware.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geoip-phishing",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-phishing.srs",
            download_detour: "direct"
        }
    ];

    if (bypassIran) {
        rules.push({
            rule_set: ["geosite-ir", "geoip-ir"],
            outbound: "direct"
        });

        ruleSet.push({
            type: "remote",
            tag: "geosite-ir",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geoip-ir",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs",
            download_detour: "direct"
        });
    }

    if (bypassChina) {
        rules.push({
            rule_set: ["geosite-cn", "geoip-cn"],
            outbound: "direct"
        });

        ruleSet.push({
            type: "remote",
            tag: "geosite-cn",
            format: "binary",
            url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geoip-cn",
            format: "binary",
            url: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
            download_detour: "direct"
        });
    }
    
    if (bypassRussia) {
        rules.push({
            rule_set: ["geosite-category-ru", "geoip-ru"],
            outbound: "direct"
        });

        ruleSet.push({
            type: "remote",
            tag: "geosite-category-ru",
            format: "binary",
            url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ru.srs",
            download_detour: "direct"
        },
        {
            type: "remote",
            tag: "geoip-ru",
            format: "binary",
            url: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs",
            download_detour: "direct"
        });
    }
    
    bypassLAN && rules.push({
        ip_is_private: true,
        outbound: "direct"
    });

    blockUDP443 && rules.push({
        network: "udp",
        port: 443,
        protocol: "quic",
        outbound: "block"
    });
    
    let blockRuleSet = {
        rule_set: [
            "geosite-malware",
            "geosite-phishing",
            "geosite-cryptominers",
            "geoip-malware",
            "geoip-phishing"
        ],
        outbound: "block"
    };
    
    if (blockAds) { 
        blockRuleSet.rule_set.push("geosite-category-ads-all");
        ruleSet.push({
            type: "remote",
            tag: "geosite-category-ads-all",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs",
            download_detour: "direct"
        });
    }

    if (blockPorn) { 
        blockRuleSet.rule_set.push("geosite-nsfw");
        ruleSet.push({
            type: "remote",
            tag: "geosite-nsfw",
            format: "binary",
            url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-nsfw.srs",
            download_detour: "direct"
        });
    }

    rules.push(blockRuleSet);
    rules.push({
        ip_cidr: ["224.0.0.0/3", "ff00::/8"],
        source_ip_cidr: ["224.0.0.0/3", "ff00::/8"],
        outbound: "block"
    });

    return {rules: rules, rule_set: ruleSet};
}

function buildSingBoxVLESSOutbound (proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
    const { lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
    const path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    let outbound =  {
        type: "vless",
        server: address,
        server_port: +port,
        uuid: userID,
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: allowInsecure,
            server_name: sni,
            utls: {
                enabled: true,
                fingerprint: "randomized"
            }
        },
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        tag: remark
    };

    if (!tls) delete outbound.tls;
    if (isFragment) outbound.tls_fragment = {
        enabled: true,
        size: `${lengthMin}-${lengthMax}`,
        sleep: `${intervalMin}-${intervalMax}`
    };

    return outbound;
}

function buildSingBoxTrojanOutbound (proxySettings, remark, address, port, host, sni, allowInsecure, isFragment) {
    const { lengthMin, lengthMax, intervalMin, intervalMax, proxyIP } = proxySettings;
    const path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    let outbound = {
        type: "trojan",
        password: trojanPassword,
        server: address,
        server_port: +port,
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: allowInsecure,
            server_name: sni,
            utls: {
                enabled: true,
                fingerprint: "randomized"
            }
        },
        transport: {
            early_data_header_name: "Sec-WebSocket-Protocol",
            max_early_data: 2560,
            headers: {
                Host: host
            },
            path: path,
            type: "ws"
        },
        tag: remark
    }

    if (!tls) delete outbound.tls;
    if (isFragment) outbound.tls_fragment = {
        enabled: true,
        size: `${lengthMin}-${lengthMax}`,
        sleep: `${intervalMin}-${intervalMax}`
    };

    return outbound;    
}

function buildSingBoxWarpOutbound (proxySettings, warpConfigs, remark, endpoint, chain, client) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];
    const { 
		hiddifyNoiseMode, 
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax 
	} = proxySettings;

    const {
        warpIPv6,
        reserved,
        publicKey,
        privateKey
    } = extractWireguardParams(warpConfigs, chain);

    let outbound = {
        local_address: [
            "172.16.0.2/32",
            warpIPv6
        ],
        mtu: 1280,
        peer_public_key: publicKey,
        private_key: privateKey,
        reserved: reserved,
        server: endpointServer,
        server_port: endpointPort,
        type: "wireguard",
        detour: chain,
        tag: remark
    };

    client === 'hiddify' && Object.assign(outbound, {
        fake_packets_mode: hiddifyNoiseMode,
        fake_packets: noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`,
        fake_packets_size: noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`,
        fake_packets_delay: noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`
    });

    return outbound;
}

function buildSingBoxChainOutbound (chainProxyParams) {
    if (["socks", "http"].includes(chainProxyParams.protocol)) {
        const { protocol, host, port, user, pass } = chainProxyParams;
    
        let chainOutbound = {
            type: protocol,
            tag: "",
            server: host,
            server_port: +port,
            username: user,
            password: pass,
            detour: ""
        };
    
        protocol === 'socks' && Object.assign(chainOutbound, {
            version: "5",
            network: "tcp"
        });
    
        return chainOutbound;
    }

    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, headerType, host, path, serviceName } = chainProxyParams;
    let chainOutbound = {
        type: "vless",
        tag: "",
        server: hostName,
        server_port: +port,
        uuid: uuid,
        flow: flow,
        network: "tcp",
        detour: ""
    };

    if (security === 'tls' || security === 'reality') {
        const tlsAlpns = alpn ? alpn?.split(',').filter(value => value !== 'h2') : [];
        chainOutbound.tls = {
            enabled: true,
            server_name: sni,
            insecure: false,
            alpn: tlsAlpns,
            utls: {
                enabled: true,
                fingerprint: fp
            }
        };

        if (security === 'reality') {
            chainOutbound.tls.reality = {
                enabled: true,
                public_key: pbk,
                short_id: sid
            };

            delete chainOutbound.tls.alpn;
        }
    }

    if (headerType === 'http') {
        const httpHosts = host?.split(',');
        chainOutbound.transport = {
            type: "http",
            host: httpHosts,
            path: path,
            method: "GET",
            headers: { 
                "Connection": ["keep-alive"],
                "Content-Type": ["application/octet-stream"]
            },
        };
    }

    if (type === 'ws') {
        const wsPath = path?.split('?ed=')[0];
        const earlyData = +path?.split('?ed=')[1] || 0;
        chainOutbound.transport = {
            type: "ws",
            path: wsPath,
            headers: { Host: host },
            max_early_data: earlyData,
            early_data_header_name: "Sec-WebSocket-Protocol"
        };
    }

    if (type === 'grpc') chainOutbound.transport = {
        type: "grpc",
        service_name: serviceName
    };

    return chainOutbound;
}

async function getSingBoxWarpConfig (proxySettings, warpConfigs, client) {
    const { warpEndpoints } = proxySettings;
    let config = structuredClone(singboxConfigTemp);
    const dnsObject = buildSingBoxDNS(proxySettings, false, true);
    const {rules, rule_set} = buildSingBoxRoutingRules(proxySettings);
    config.dns.servers = dnsObject.servers;
    config.dns.rules = dnsObject.rules;
    if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
    config.route.rules = rules;
    config.route.rule_set = rule_set;
    const selector = config.outbounds[0];
    const warpUrlTest = config.outbounds[1];
    const proIndicator = client === 'hiddify' ? ' Pro ' : ' ';
    selector.outbounds = [`💦 Warp${proIndicator}- Best Ping 🚀`, `💦 WoW${proIndicator}- Best Ping 🚀`];
    config.outbounds.splice(2, 0, structuredClone(warpUrlTest));
    const WoWUrlTest = config.outbounds[2];
    warpUrlTest.tag = `💦 Warp${proIndicator}- Best Ping 🚀`;
    warpUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
    WoWUrlTest.tag = `💦 WoW${proIndicator}- Best Ping 🚀`;
    WoWUrlTest.interval = `${proxySettings.bestWarpInterval}s`;
    let warpRemarks = [], WoWRemarks = [];

    warpEndpoints.split(',').forEach( (endpoint, index) => {
        const warpRemark = `💦 ${index + 1} - Warp 🇮🇷`;
        const WoWRemark = `💦 ${index + 1} - WoW 🌍`;
        const warpOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, warpRemark, endpoint, '', client);
        const WoWOutbound = buildSingBoxWarpOutbound(proxySettings, warpConfigs, WoWRemark, endpoint, warpRemark, client);
        config.outbounds.push(WoWOutbound, warpOutbound);
        warpRemarks.push(warpRemark);
        WoWRemarks.push(WoWRemark);
        warpUrlTest.outbounds.push(warpRemark);
        WoWUrlTest.outbounds.push(WoWRemark);
    });
    
    selector.outbounds.push(...warpRemarks, ...WoWRemarks);
    return config;
}

async function getSingBoxCustomConfig(env, proxySettings, hostName, client, isFragment) {
    let chainProxyOutbound;
    const { 
        cleanIPs,  
        ports, 
        vlessConfigs, 
        trojanConfigs, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        enableIPv6
    } = proxySettings;
 
    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);      
        try {
            chainProxyOutbound = buildSingBoxChainOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxyOutbound = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: ''
            }));
            throw new Error(error);
        }
    }
    
    let config = structuredClone(singboxConfigTemp);
    const dnsObject = buildSingBoxDNS(proxySettings, chainProxyOutbound, false);
    const {rules, rule_set} = buildSingBoxRoutingRules(proxySettings);
    config.dns.servers = dnsObject.servers;
    config.dns.rules = dnsObject.rules;
    if (dnsObject.fakeip) config.dns.fakeip = dnsObject.fakeip;
    config.route.rules = rules;
    config.route.rule_set = rule_set;
    const selector = config.outbounds[0];
    const urlTest = config.outbounds[1];
    selector.outbounds = ['💦 Best Ping 💥'];
    urlTest.interval = `${bestVLESSTrojanInterval}s`;
    urlTest.tag = '💦 Best Ping 💥';
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    const totalPorts = ports.filter(port => isFragment ? defaultHttpsPorts.includes(port) : true);
    let proxyIndex = 1;
    const protocols = [
        ...(vlessConfigs ? ['VLESS'] : []),
        ...(trojanConfigs ? ['Trojan'] : [])
    ];

    protocols.forEach ( protocol => {
        let protocolIndex = 1;
        totalPorts.forEach ( port => {
            totalAddresses.forEach ( addr => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = customCdnAddresses.includes(addr);
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
                const host = isCustomAddr ? customCdnHost : hostName;
                const remark = generateRemark(protocolIndex, port, addr, cleanIPs, protocol, configType);
         
                if (protocol === 'VLESS') {
                    VLESSOutbound = buildSingBoxVLESSOutbound (
                        proxySettings,
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        host,
                        sni,
                        isCustomAddr, 
                        isFragment
                    );
                    config.outbounds.push(VLESSOutbound);
                }
                
                if (protocol === 'Trojan') {
                    TrojanOutbound = buildSingBoxTrojanOutbound (
                        proxySettings,
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        host,
                        sni,
                        isCustomAddr,
                        isFragment
                    );
                    config.outbounds.push(TrojanOutbound);
                }
                
                if (chainProxyOutbound) {
                    let chain = structuredClone(chainProxyOutbound);
                    chain.tag = remark;
                    chain.detour = `proxy-${proxyIndex}`;
                    config.outbounds.push(chain);
                }
                
                selector.outbounds.push(remark);
                urlTest.outbounds.push(remark);
                proxyIndex++;
                protocolIndex++;
            });
        });
    });

    return config;
}

async function getNormalConfigs(proxySettings, hostName, client) {
    const { 
        cleanIPs, 
        proxyIP, 
        ports, 
        vlessConfigs, 
        trojanConfigs , 
        outProxy, 
        customCdnAddrs, 
        customCdnHost, 
        customCdnSni, 
        enableIPv6
    } = proxySettings;
    
    let vlessConfs = '', trojanConfs = '', chainProxy = '';
    let proxyIndex = 1;
    const Addresses = await getConfigAddresses(hostName, cleanIPs, enableIPv6);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    const alpn = client === 'singbox' ? 'http/1.1' : 'h2,http/1.1';
    const trojanPass = encodeURIComponent(trojanPassword);
    const earlyData = client === 'singbox' 
        ? '&eh=Sec-WebSocket-Protocol&ed=2560' 
        : encodeURIComponent('?ed=2560');
    
    ports.forEach(port => {
        totalAddresses.forEach((addr, index) => {
            const isCustomAddr = index > Addresses.length - 1;
            const configType = isCustomAddr ? 'C' : '';
            const sni = isCustomAddr ? customCdnSni : randomUpperCase(hostName);
            const host = isCustomAddr ? customCdnHost : hostName;
            const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ''}${earlyData}`;
            const vlessRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType));
            const trojanRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', configType));
            const tlsFields = defaultHttpsPorts.includes(port) 
                ? `&security=tls&sni=${sni}&fp=randomized&alpn=${alpn}`
                : '&security=none';

            if (vlessConfigs) {
                vlessConfs += `${atob('dmxlc3M')}://${userID}@${addr}:${port}?path=/${path}&encryption=none&host=${host}&type=ws${tlsFields}#${vlessRemark}\n`; 
            }

            if (trojanConfigs) {
                trojanConfs += `${atob('dHJvamFu')}://${trojanPass}@${addr}:${port}?path=/tr${path}&host=${host}&type=ws${tlsFields}#${trojanRemark}\n`;
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

    return btoa(vlessConfs + trojanConfs + chainProxy);
}

const xrayConfigTemp = {
    remarks: "",
    log: {
        loglevel: "warning",
    },
    dns: {},
    fakedns: [
        {
            ipPool: "198.18.0.0/15",
            poolSize: 32768
        },
        {
            ipPool: "fc00::/18",
            poolSize: 32768
        }
    ],
    inbounds: [
        {
            port: 10808,
            protocol: "socks",
            settings: {
                auth: "noauth",
                udp: true,
                userLevel: 8,
            },
            sniffing: {
                destOverride: ["http", "tls"],
                enabled: true,
                routeOnly: true
            },
            tag: "socks-in",
        },
        {
            port: 10809,
            protocol: "http",
            settings: {
                auth: "noauth",
                udp: true,
                userLevel: 8,
            },
            sniffing: {
                destOverride: ["http", "tls"],
                enabled: true,
                routeOnly: true
            },
            tag: "http-in",
        },
        {
            listen: "127.0.0.1",
            port: 10853,
            protocol: "dokodemo-door",
            settings: {
              address: "1.1.1.1",
              network: "tcp,udp",
              port: 53
            },
            tag: "dns-in"
        }
    ],
    outbounds: [
        {
            tag: "fragment",
            protocol: "freedom",
            settings: {
                fragment: {
                    packets: "tlshello",
                    length: "",
                    interval: "",
                },
                domainStrategy: "UseIP"
            },
            streamSettings: {
                sockopt: {
                    tcpKeepAliveIdle: 100,
                    tcpNoDelay: true
                },
            },
        },
        {
            protocol: "dns",
            tag: "dns-out"
        },
        {
            protocol: "freedom",
            settings: {},
            tag: "direct",
        },
        {
            protocol: "blackhole",
            settings: {
                response: {
                    type: "http",
                },
            },
            tag: "block",
        },
    ],
    policy: {
        levels: {
            8: {
                connIdle: 300,
                downlinkOnly: 1,
                handshake: 4,
                uplinkOnly: 1,
            }
        },
        system: {
            statsOutboundUplink: true,
            statsOutboundDownlink: true,
        }
    },
    routing: {
        domainStrategy: "IPIfNonMatch",
        rules: [],
        balancers: [
            {
                tag: "all",
                selector: ["prox"],
                strategy: {
                    type: "leastPing",
                },
            }
        ]
    },
    observatory: {
        probeInterval: "30s",
        probeURL: "https://www.gstatic.com/generate_204",
        subjectSelector: ["prox"],
        EnableConcurrency: true,
    },
    stats: {}
};

const singboxConfigTemp = {
    log: {
        level: "warn",
        timestamp: true
    },
    dns: {
        servers: [],
        rules: [],
        independent_cache: true
    },
    inbounds: [
        {
            type: "direct",
            tag: "dns-in",
            listen: "0.0.0.0",
            listen_port: 6450,
            override_address: "8.8.8.8",
            override_port: 53
        },
        {
            type: "tun",
            tag: "tun-in",
            inet4_address: "172.19.0.1/28",
            inet6_address: "fdfe:dcba:9876::1/126",
            mtu: 9000,
            auto_route: true,
            strict_route: true,
            stack: "mixed",
            sniff: true,
            sniff_override_destination: true
        },
        {
            type: "mixed",
            tag: "mixed-in",
            listen: "0.0.0.0",
            listen_port: 2080,
            sniff: true,
            sniff_override_destination: false
        }
    ],
    outbounds: [
        {
            type: "selector",
            tag: "proxy",
            outbounds: []
        },
        {
            type: "urltest",
            tag: "",
            outbounds: [],
            url: "https://www.gstatic.com/generate_204",
            interval: ""
        },
        {
            type: "direct",
            tag: "direct"
        },
        {
            type: "block",
            tag: "block"
        },
        {
            type: "dns",
            tag: "dns-out"
        }
    ],
    route: {
        rules: [],
        rule_set: [],
        auto_detect_interface: true,
        override_android_vpn: true,
        final: "proxy"
    },
    ntp: {
        enabled: true,
        server: "time.apple.com",
        server_port: 123,
        detour: "direct",
        interval: "30m",
    },
    experimental: {
        cache_file: {
            enabled: true,
            store_fakeip: true
        },
        clash_api: {
            external_controller: "0.0.0.0:9090",
            external_ui: "yacd",
            external_ui_download_url: "https://github.com/MetaCubeX/Yacd-meta/archive/gh-pages.zip",
            external_ui_download_detour: "direct",
            default_mode: "rule"
        }
    }
};

const clashConfigTemp = {
    "mixed-port": 7890,
    "ipv6": true,
    "allow-lan": true,
    "mode": "rule",
    "log-level": "info",
    "keep-alive-interval": 30,
    "unified-delay": false,
    "dns": {},
    "tun": {
        "enable": true,
        "stack": "system",
        "auto-route": true,
        "auto-redirect": true,
        "auto-detect-interface": true,
        "dns-hijack": [
            "any:53",
            "198.18.0.2:53"
        ],
        "device": "utun0",
        "mtu": 9000,
        "strict-route": true
    },
    "sniffer": {
        "enable": true,
        "force-dns-mapping": true,
        "parse-pure-ip": true,
        "sniff": {
            "HTTP": {
                "ports": [80, 8080, 8880, 2052, 2082, 2086, 2095],
                "override-destination": false
            },
            "TLS": {
                "ports": [443, 8443, 2053, 2083, 2087, 2096],
                "override-destination": false
            }
        }
    },
    "proxies": [],
    "proxy-groups": [
        {
            "name": "✅ Selector",
            "type": "select",
            "proxies": []
        },
        {
            "name": "",
            "type": "url-test",
            "url": "https://www.gstatic.com/generate_204",
            "interval": 30,
            "tolerance": 50,
            "proxies": []
        }
    ],
    "rules": [],
    "ntp": {
        "enable": true,
        "server": "time.apple.com",
        "port": 123,
        "interval": 30
    }
};
