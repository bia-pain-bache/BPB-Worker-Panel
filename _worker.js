// @ts-nocheck
// <!--GAMFC-->version base on commit 43fad05dcdae3b723c53c226f8181fc5bd47223e, time is 2023-06-22 15:20:02 UTC<!--GAMFC-END-->.
// @ts-ignore
// https://github.com/bia-pain-bache/BPB-Worker-Panel

import { connect } from 'cloudflare:sockets';

// How to generate your own UUID:
// https://www.uuidgenerator.net/
let userID = '89b3cbba-e6ac-485a-9481-976a0415eab9';

// https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
const proxyIPs= ['bpb.yousef.isegaro.com'];
const defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
let dohURL = 'https://cloudflare-dns.com/dns-query';
let trojanPassword = `bpb-trojan`;
// https://emn178.github.io/online-tools/sha224.html
// https://www.atatus.com/tools/sha224-to-hash
let hashPassword = 'b5d0a5f7ff7aac227bc68b55ae713131ffdf605ca0da52cce182d513';
let panelVersion = '2.6';

if (!isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`);
if (!isValidSHA224(hashPassword)) throw new Error(`Invalid Hash password: ${hashPassword}`);

export default {
    /**
     * @param {import("@cloudflare/workers-types").Request} request
     * @param {{UUID: string, PROXYIP: string, DNS_RESOLVER_URL: string}} env
     * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
     * @returns {Promise<Response>}
     */
    async fetch(request, env, ctx) {
        try {          
            userID = env.UUID || userID;
            proxyIP = env.PROXYIP || proxyIP;
            dohURL = env.DNS_RESOLVER_URL || dohURL;
            trojanPassword = env.TROJAN_PASS || trojanPassword;
            hashPassword = env.HASH_PASS || hashPassword;
            const upgradeHeader = request.headers.get('Upgrade');
            const url = new URL(request.url);
            
            if (!upgradeHeader || upgradeHeader !== 'websocket') {
                
                const searchParams = new URLSearchParams(url.search);
                const host = request.headers.get('Host');
                const client = searchParams.get('app');

                switch (url.pathname) {

                    case '/cf':
                        return new Response(JSON.stringify(request.cf, null, 4), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                        });
                        
                    case '/warp-keys':

                        const Auth = await Authenticate(request, env); 
                        if (!Auth) return new Response('Unauthorized', { status: 401 });

                        if (request.method === 'POST' && request.headers.get('content-type') === 'application/json') {
                            try {
                                const warpKeys = await request.json();
                                const warpPlusError = await fetchWgConfig(env, warpKeys);
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
                            const BestPingSFA = await getSingboxConfig(env, host, client, false);
                            return new Response(JSON.stringify(BestPingSFA, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'clash') {
                            const BestPingClash = await getClashConfig(env, host, false);
                            return new Response(JSON.stringify(BestPingClash, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }

                        const normalConfigs = await getNormalConfigs(env, host, client);
                        return new Response(normalConfigs, { 
                            status: 200,
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });                        

                    case `/fragsub/${userID}`:
  
                        let fragConfigs = client === 'hiddify'
                            ? await getSingboxConfig(env, host, client, false, true)
                            : (await getFragmentConfigs(env, host));

                        return new Response(JSON.stringify(fragConfigs, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });

                    case `/warpsub/${userID}`:

                        if (client === 'clash') {
                            const clashWarpConfigs = await getClashConfig(env, host, true);
                            return new Response(JSON.stringify(clashWarpConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'singbox' || client === 'hiddify') {
                            const singboxWarpConfigs = await getSingboxConfig(env, host, client, true);
                            return new Response(JSON.stringify(singboxWarpConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }

                        const warpConfig = await getXrayWarpConfigs(env, client);
                        return new Response(JSON.stringify(warpConfig, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });

                    case '/panel':

                        if (typeof env.bpb !== 'object') {
                            const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                        }

                        const pwd = await env.bpb.get('pwd');
                        const isAuth = await Authenticate(request, env); 
                        
                        if (request.method === 'POST') {     
                            if (!isAuth) return new Response('Unauthorized', { status: 401 });
                            const formData = await request.formData();
                            const isReset = formData.get('resetSettings') === 'true';             
                            isReset 
                                ? await updateDataset(env, null, true) 
                                : await updateDataset(env, formData);

                            return new Response('Success', { status: 200 });
                        }
                        
                        if (pwd && !isAuth) return Response.redirect(`${url.origin}/login`, 302);
                        const proxySettings = await env.bpb.get('proxySettings', {type: 'json'});
                        const isUpdated = panelVersion === proxySettings?.panelVersion;
                        if (!proxySettings || !isUpdated) await updateDataset(env);
                        const homePage = await renderHomePage(env, host);

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
                                const jwtToken = generateJWTToken(password, secretKey);
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
                        
                        const loginPage = await renderLoginPage();

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
                        // return new Response('Not found', { status: 404 });
                        url.hostname = 'www.speedtest.net';
                        url.protocol = 'https:';
                        request = new Request(url, request);
                        return await fetch(request);
                }
            } else {
                return url.pathname.startsWith('/tr') ? await trojanOverWSHandler(request) : await vlessOverWSHandler(request);
            }
        } catch (err) {
            /** @type {Error} */ let e = err;
            const errorPage = renderErrorPage('Something went wrong!', e.message.toString(), false);
            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
        }
    },
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

function isValidSHA224(hash) {
    const sha224Regex = /^[0-9a-f]{56}$/i;
    return sha224Regex.test(hash);
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

function extractChainProxyParams(chainProxy) {
    let configParams = {};

    if (chainProxy.startsWith('vless')) {
        const url = new URL(chainProxy.replace('vless', 'http'));
        const params = new URLSearchParams(url.search);
        configParams = {
            uuid : url.username,
            hostName : url.hostname,
            port : url.port
        };
    
        params.forEach( (value, key) => {
            configParams[key] = value;
        });
    } else {
        const regex = /^(http|socks):\/\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\d+)$/;
        const matches = chainProxy.match(regex);
        const protocol = matches[1];
        const user = matches[2] || '';
        const pass = matches[3] || '';
        const host = matches[4];
        const port = matches[5];

        configParams = {
            protocol: protocol, 
            user : user,
            pass : pass,
            host : host,
            port : port
        };
    }

    return JSON.stringify(configParams);
}

function base64ToDecimal (base64) {
    const binaryString = atob(base64);
    const hexString = Array.from(binaryString).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const decimalArray = hexString.match(/.{2}/g).map(hex => parseInt(hex, 16));
    return decimalArray;
}

async function updateDataset (env, Settings, resetSettings) {
    let currentProxySettings;

    if (!resetSettings) {
        try {
            currentProxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        } catch (error) {
            console.log(error);
            throw new Error(`An error occurred while getting current values - ${error}`);
        }
    } else {
        await env.bpb.delete('warpConfigs');
    }

    const chainProxy = Settings?.get('outProxy');
    const proxySettings = {
        remoteDNS: (Settings ? Settings.get('remoteDNS') : currentProxySettings?.remoteDNS) || 'https://dns.google/dns-query',
        localDNS: (Settings ? Settings.get('localDNS') : currentProxySettings?.localDNS) || '8.8.8.8',
        lengthMin: (Settings ? Settings.get('fragmentLengthMin') : currentProxySettings?.lengthMin) || '100',
        lengthMax: (Settings ? Settings.get('fragmentLengthMax') : currentProxySettings?.lengthMax) || '200',
        intervalMin: (Settings ? Settings.get('fragmentIntervalMin') : currentProxySettings?.intervalMin) || '1',
        intervalMax: (Settings ? Settings.get('fragmentIntervalMax') : currentProxySettings?.intervalMax) || '1',
        fragmentPackets: (Settings ? Settings.get('fragmentPackets') : currentProxySettings?.fragmentPackets) || 'tlshello',
        blockAds: (Settings ? Settings.get('block-ads') : currentProxySettings?.blockAds) || false,
        bypassIran: (Settings ? Settings.get('bypass-iran') : currentProxySettings?.bypassIran) || false,
        blockPorn: (Settings ? Settings.get('block-porn') : currentProxySettings?.blockPorn) || false,
        bypassLAN: (Settings ? Settings.get('bypass-lan') : currentProxySettings?.bypassLAN) || false,
        bypassChina: (Settings ? Settings.get('bypass-china') : currentProxySettings?.bypassChina) || false,
        blockUDP443: (Settings ? Settings.get('block-udp-443') : currentProxySettings?.blockUDP443) || false,
        cleanIPs: (Settings ? Settings.get('cleanIPs')?.replaceAll(' ', '') : currentProxySettings?.cleanIPs) || '',
        proxyIP: (Settings ? Settings.get('proxyIP')?.trim() : currentProxySettings?.proxyIP) || '',
        ports: (Settings ? Settings.getAll('ports[]') : currentProxySettings?.ports) || ['443'],
        vlessConfigs: (Settings ? Settings.get('vlessConfigs') : currentProxySettings?.vlessConfigs) || true,
        trojanConfigs: (Settings ? Settings.get('trojanConfigs') : currentProxySettings?.trojanConfigs) || false,
        outProxy: (Settings ? chainProxy : currentProxySettings?.outProxy) || '',
        outProxyParams: (chainProxy ? extractChainProxyParams(chainProxy) : currentProxySettings?.outProxyParams) || '',
        wowEndpoint: (Settings ? Settings.get('wowEndpoint')?.replaceAll(' ', '') : currentProxySettings?.wowEndpoint) || 'engage.cloudflareclient.com:2408',
        warpEndpoints: (Settings ? Settings.get('warpEndpoints')?.replaceAll(' ', '') : currentProxySettings?.warpEndpoints) || 'engage.cloudflareclient.com:2408',
        hiddifyNoiseMode: (Settings ? Settings.get('hiddifyNoiseMode') : currentProxySettings?.hiddifyNoiseMode) || 'm4',
        nikaNGNoiseMode: (Settings ? Settings.get('nikaNGNoiseMode') : currentProxySettings?.nikaNGNoiseMode) || 'quic',
        noiseCountMin: (Settings ? Settings.get('noiseCountMin') : currentProxySettings?.noiseCountMin) || '10',
        noiseCountMax: (Settings ? Settings.get('noiseCountMax') : currentProxySettings?.noiseCountMax) || '15',
        noiseSizeMin: (Settings ? Settings.get('noiseSizeMin') : currentProxySettings?.noiseSizeMin) || '5',
        noiseSizeMax: (Settings ? Settings.get('noiseSizeMax') : currentProxySettings?.noiseSizeMax) || '10',
        noiseDelayMin: (Settings ? Settings.get('noiseDelayMin') : currentProxySettings?.noiseDelayMin) || '1',
        noiseDelayMax: (Settings ? Settings.get('noiseDelayMax') : currentProxySettings?.noiseDelayMax) || '1',
        warpPlusLicense: (Settings ? Settings.get('warpPlusLicense') : currentProxySettings?.warpPlusLicense) || '',
        customCdnAddrs: (Settings ? Settings.get('customCdnAddrs')?.replaceAll(' ', '') : currentProxySettings?.customCdnAddrs) || '',
        customCdnHost: (Settings ? Settings.get('customCdnHost')?.trim() : currentProxySettings?.customCdnHost) || '',
        customCdnSni: (Settings ? Settings.get('customCdnSni')?.trim() : currentProxySettings?.customCdnSni) || '',
        bestVLESSTrojanInterval: (Settings ? Settings.get('bestVLESSTrojanInterval') : currentProxySettings?.bestVLESSTrojanInterval) || '30',
        bestWarpInterval: (Settings ? Settings.get('bestWarpInterval') : currentProxySettings?.bestWarpInterval) || '30',
        panelVersion: panelVersion
    };

    try {    
        await env.bpb.put("proxySettings", JSON.stringify(proxySettings));          
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while updating KV - ${error}`);
    }
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
    const dohURLv4 = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`;
    const dohURLv6 = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=AAAA`;

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

async function getConfigAddresses(hostName, cleanIPs) {
    const resolved = await resolveDNS(hostName);
    return [
        hostName,
        'www.speedtest.net',
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...(cleanIPs ? cleanIPs.split(',') : [])
    ];
}

function generateJWTToken (password, secretKey) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const payload = {
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        data: { password }
    };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${encodedHeader}.${encodedPayload}.${secretKey}`)));

    return `Bearer ${encodedHeader}.${encodedPayload}.${signature}`;
}

function generateSecretKey () {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
  
async function Authenticate (request, env) {
    
    try {
        const secretKey = await env.bpb.get('secretKey');
        const cookie = request.headers.get('Cookie');
        const cookieMatch = cookie ? cookie.match(/(^|;\s*)jwtToken=([^;]*)/) : null;
        const token = cookieMatch ? cookieMatch.pop() : null;

        if (!token) {
            console.log('token');
            return false;
        }

        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        const [encodedHeader, encodedPayload, signature] = tokenWithoutBearer.split('.');
        const payload = JSON.parse(atob(encodedPayload));

        const expectedSignature = btoa(crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(`${encodedHeader}.${encodedPayload}.${secretKey}`)
        ));

        if (signature !== expectedSignature) return false;

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) return false;

        return true;
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while authentication - ${error}`);
    }
}

async function renderHomePage (env, hostName, fragConfigs) {
    let proxySettings = {};
    let warpConfigs = [];
    let password = '';
    
    try {
        proxySettings = await env.bpb.get('proxySettings', {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
        password = await env.bpb.get('pwd');
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while rendering home page - ${error}`);
    }

    const {
        remoteDNS, 
        localDNS, 
        lengthMin, 
        lengthMax, 
        intervalMin, 
        intervalMax,
        fragmentPackets, 
        blockAds, 
        bypassIran,
        blockPorn,
        bypassLAN,
        bypassChina,
        blockUDP443,
        cleanIPs, 
        proxyIP, 
        outProxy,
        ports,
        vlessConfigs,
        trojanConfigs,
        wowEndpoint,
        warpEndpoints,
        hiddifyNoiseMode,
        nikaNGNoiseMode,
        noiseCountMin,
        noiseCountMax,
        noiseSizeMin,
        noiseSizeMax,
        noiseDelayMin,
        noiseDelayMax,
        warpPlusLicense,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        bestWarpInterval
    } = proxySettings;

    const isWarpReady = warpConfigs ? true : false;
    const isPassSet = password ? password.length >= 8 : false;
    const isWarpPlus = warpPlusLicense ? true : false;
    let activeProtocols = (vlessConfigs ? 1 : 0) + (trojanConfigs ? 1 : 0);

    const buildPortsBlock = async () => {
        let httpPortsBlock = '';
        let httpsPortsBlock = '';
        [...defaultHttpPorts, ...defaultHttpsPorts].forEach(port => {
            let id = `port-${port}`;
            let portBlock = `
                <div class="routing" style="grid-template-columns: 1fr 2fr; margin-right: 10px;">
                    <input type="checkbox" id=${id} name=${port} onchange="handlePortChange(event)" value="true" ${ports.includes(port) ? 'checked' : ''}>
                    <label style="margin-bottom: 3px;" for=${id}>${port}</label>
                </div>`;
            defaultHttpPorts.includes(port) ? httpPortsBlock += portBlock : httpsPortsBlock += portBlock;
        });

        return {httpPortsBlock, httpsPortsBlock};
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BPB Panel ${panelVersion}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
		<style>
			body { font-family: system-ui; }
            .material-symbols-outlined {
                margin-left: 5px;
                font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24
            }
            h1 { font-size: 2.5em; text-align: center; color: #09639f; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); }
			h2 { margin: 30px 0; text-align: center; color: #3b3b3b; }
			hr { border: 1px solid #ddd; margin: 20px 0; }
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
				margin-bottom: 15px;
				display: grid;
				grid-template-columns: 1fr 1fr;
				align-items: baseline;
				justify-content: flex-end;
				font-family: Arial, sans-serif;
			}
            .form-control button {
                background-color: white;
                font-size: 1.1rem;
                font-weight: 600;
                color: #09639f;
                border-color: #09639f;
                border: 1px solid;
            }
            #apply {display: block; margin-top: 30px;}
            input.button {font-weight: 600; padding: 15px 0; font-size: 1.1rem;}
			label {
				display: block;
				margin-bottom: 5px;
				font-size: 110%;
				font-weight: 600;
				color: #333;
			}
			input[type="text"],
			input[type="number"],
			input[type="url"],
			textarea,
			select {
				width: 100%;
				text-align: center;
				padding: 10px;
				border: 1px solid #ddd;
				border-radius: 5px;
				font-size: 16px;
				color: #333;
				background-color: #fff;
				box-sizing: border-box;
				transition: border-color 0.3s ease;
			}	
			input[type="text"]:focus,
			input[type="number"]:focus,
			input[type="url"]:focus,
			textarea:focus,
			select:focus { border-color: #3498db; outline: none; }
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
				color: #fff;
				background-color: #09639f;
				cursor: pointer;
				outline: none;
				box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
				transition: all 0.3s ease;
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
				background: #f9f9f9;
				border: 1px solid #eaeaea;
				border-radius: 10px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}
			.table-container { margin-top: 20px; overflow-x: auto; }
			table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px;
                border-radius: 7px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
			th, td { padding: 8px 15px; border-bottom: 1px solid #ddd; }
            td div { display: flex; align-items: center; }
			th { background-color: #3498db; color: white; font-weight: bold; font-size: 1.1rem; width: 50%;}
			tr:nth-child(odd) { background-color: #f2f2f2; }
            #custom-configs-table td { text-align: center; text-wrap: nowrap; }
			tr:hover { background-color: #f1f1f1; }
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
                background-color: #f9f9f9;
                margin: auto;
                padding: 10px 20px 20px;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                width: 80%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; }
            .close:hover,
            .close:focus { color: black; text-decoration: none; cursor: pointer; }
            .form-control label {
                display: block;
                margin-bottom: 5px;
                font-size: 110%;
                font-weight: 600;
                color: #333;
                line-height: 1.3em;
            }
            .form-control input[type="password"] {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                color: #333;
                background-color: #fff;
                box-sizing: border-box;
                margin-bottom: 15px;
                transition: border-color 0.3s ease;
            }
            .routing { 
                display: grid;
                grid-template-columns: 1fr 3fr 8fr 1fr;
                justify-content: center;
                margin-bottom: 15px;
            }
            .routing label {
                text-align: left;
                margin: 0;
                font-weight: 400;
                font-size: 100%;
                text-wrap: nowrap;
            }
            .form-control input[type="password"]:focus { border-color: #3498db; outline: none; }
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
            @media only screen and (min-width: 768px) {
                .form-container { max-width: 70%; }
                #apply { display: block; margin: 30px auto 0 auto; max-width: 50%; }
                .modal-content { width: 30% }
                .routing { grid-template-columns: 4fr 2fr 6fr 4fr; }
            }
		</style>
	</head>
	
	<body>
		<h1>BPB Panel <span style="font-size: smaller;">${panelVersion}</span> 💦</h1>
		<div class="form-container">
            <form id="configForm">
                <h2>VLESS/TROJAN SETTINGS ⚙️</h2>
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
                    <a href="https://scanner.github1.cloud/" id="scanner" name="scanner" target="_blank">
                        <button type="button" class="button">
                            Scan now
                            <span class="material-symbols-outlined" style="margin-left: 5px;">open_in_new</span>
                        </button>
                    </a>
                </div>
                <div class="form-control">
					<label for="customCdnAddrs">💀 Custom Addr</label>
					<input type="text" id="customCdnAddrs" name="customCdnAddrs" value="${customCdnAddrs.replaceAll(",", " , ")}">
				</div>
                <div class="form-control">
					<label for="customCdnHost">💀 Custom Host</label> 
					<input type="text" id="customCdnHost" name="customCdnHost" value="${customCdnHost}">
				</div>
                <div class="form-control">
					<label for="customCdnSni">💀 Custom SNI</label>
					<input type="text" id="customCdnSni" name="customCdnSni" value="${customCdnSni}">
				</div>
                <div class="form-control">
					<label for="bestVLESSTrojanInterval">🔄 Best Interval</label>
					<input type="number" id="bestVLESSTrojanInterval" name="bestVLESSTrojanInterval" min="10" max="90" value="${bestVLESSTrojanInterval}">
				</div>
                <div class="form-control" style="padding-top: 10px;">
					<label>⚙️ Protocols</label>
					<div style="display: grid; grid-template-columns: 1fr 1fr; align-items: baseline; margin-top: 10px;">
                        <div style = "display: flex; justify-content: center; align-items: center;">
                            <input type="checkbox" id="vlessConfigs" name="vlessConfigs" onchange="handleProtocolChange(event)" style="margin: 0; grid-column: 2;" value="true" ${vlessConfigs ? 'checked' : ''}>
                            <label for="vlessConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">VLESS</label>
                        </div>
                        <div style = "display: flex; justify-content: center; align-items: center;">
                            <input type="checkbox" id="trojanConfigs" name="trojanConfigs" onchange="handleProtocolChange(event)" style="margin: 0; grid-column: 2;" value="true" ${trojanConfigs ? 'checked' : ''}>
                            <label for="trojanConfigs" style="margin: 0 5px; font-weight: normal; font-size: unset;">Trojan</label>
                        </div>
					</div>
				</div>
                <div class="table-container">
                    <table id="frag-sub-table">
                        <tr>
                            <th style="text-wrap: nowrap; background-color: gray;">Config type</th>
                            <th style="text-wrap: nowrap; background-color: gray;">Ports</th>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-size: larger;"><b>TLS</b></td>
                            <td style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${(await buildPortsBlock()).httpsPortsBlock}</td>    
                        </tr>
                        ${hostName.includes('pages.dev') ? '' : `<tr>
                            <td style="text-align: center; font-size: larger;"><b>Non TLS</b></td>
                            <td style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">${(await buildPortsBlock()).httpPortsBlock}</td>    
                        </tr>`}        
                    </table>
                </div>
                <h2>FRAGMENT SETTINGS ⚙️</h2>	
				<div class="form-control">
					<label for="fragmentLengthMin">📐 Length</label>
					<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;">
						<input type="number" id="fragmentLengthMin" name="fragmentLengthMin" value="${lengthMin}" min="10" required>
						<span style="text-align: center; white-space: pre;"> - </span>
						<input type="number" id="fragmentLengthMax" name="fragmentLengthMax" value="${lengthMax}" max="500" required>
					</div>
				</div>
				<div class="form-control">
					<label for="fragmentIntervalMin">🕞 Interval</label>
					<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;">
						<input type="number" id="fragmentIntervalMin" name="fragmentIntervalMin"
    						value="${intervalMin}" max="30" required>
						<span style="text-align: center; white-space: pre;"> - </span>
						<input type="number" id="fragmentIntervalMax" name="fragmentIntervalMax"
    						value="${intervalMax}" max="30" required>
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
                <h2>ROUTING ⚙️</h2>
				<div class="form-control" style="margin-bottom: 20px;">			
                    <div class="routing">
                        <input type="checkbox" id="block-ads" name="block-ads" style="margin: 0; grid-column: 2;" value="true" ${blockAds ? 'checked' : ''}>
                        <label for="block-ads">Block Ads.</label>
                    </div>
                    <div class="routing">
						<input type="checkbox" id="bypass-iran" name="bypass-iran" style="margin: 0; grid-column: 2;" value="true" ${bypassIran ? 'checked' : ''}>
                        <label for="bypass-iran">Bypass Iran</label>
					</div>
                    <div class="routing">
						<input type="checkbox" id="block-porn" name="block-porn" style="margin: 0; grid-column: 2;" value="true" ${blockPorn ? 'checked' : ''}>
                        <label for="block-porn">Block Porn</label>
					</div>
                    <div class="routing">
						<input type="checkbox" id="bypass-lan" name="bypass-lan" style="margin: 0; grid-column: 2;" value="true" ${bypassLAN ? 'checked' : ''}>
                        <label for="bypass-lan">Bypass LAN</label>
					</div>
                    <div class="routing">
						<input type="checkbox" id="bypass-china" name="bypass-china" style="margin: 0; grid-column: 2;" value="true" ${bypassChina ? 'checked' : ''}>
                        <label for="bypass-china">Bypass China</label>
					</div>
                    <div class="routing">
						<input type="checkbox" id="block-udp-443" name="block-udp-443" style="margin: 0; grid-column: 2;" value="true" ${blockUDP443 ? 'checked' : ''}>
                        <label for="block-udp-443">Block QUIC</label>
					</div>
				</div>
                <h2>WARP SETTINGS ⚙️</h2>
				<div class="form-control">
                    <label for="wowEndpoint">✨ WoW Endpoints</label>
                    <input type="text" id="wowEndpoint" name="wowEndpoint" value="${wowEndpoint.replaceAll(",", " , ")}" required>
				</div>
				<div class="form-control">
                    <label for="warpEndpoints">✨ Warp Endpoints</label>
                    <input type="text" id="warpEndpoints" name="warpEndpoints" value="${warpEndpoints.replaceAll(",", " , ")}" required>
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
                    <label style="line-height: 1.5;">🔎 Scan Endpoint</label>
                    <button type="button" class="button" style="padding: 10px 0;" onclick="copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/Ptechgithub/warp/main/endip/install.sh)', false)">
                        Copy Script<span class="material-symbols-outlined">terminal</span>
                    </button>
                </div>
                <div class="form-control">
					<label for="bestWarpInterval">🔄 Best Interval</label>
					<input type="number" id="bestWarpInterval" name="bestWarpInterval" min="10" max="90" value="${bestWarpInterval}">
				</div>
                <h2>WARP PRO SETTINGS ⚙️</h2>
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
					<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;">
						<input type="number" id="noiseCountMin" name="noiseCountMin"
    						value="${noiseCountMin}" required>
						<span style="text-align: center; white-space: pre;"> - </span>
						<input type="number" id="noiseCountMax" name="noiseCountMax"
    						value="${noiseCountMax}" required>
					</div>
				</div>
                <div class="form-control">
					<label for="noiseSizeMin">📏 Noise Size</label>
					<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;">
						<input type="number" id="noiseSizeMin" name="noiseSizeMin"
    						value="${noiseSizeMin}" required>
						<span style="text-align: center; white-space: pre;"> - </span>
						<input type="number" id="noiseSizeMax" name="noiseSizeMax"
    						value="${noiseSizeMax}" required>
					</div>
				</div>
                <div class="form-control">
					<label for="noiseDelayMin">🕞 Noise Delay</label>
					<div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: baseline;">
						<input type="number" id="noiseDelayMin" name="noiseDelayMin"
    						value="${noiseDelayMin}" required>
						<span style="text-align: center; white-space: pre;"> - </span>
						<input type="number" id="noiseDelayMax" name="noiseDelayMax"
    						value="${noiseDelayMax}" required>
					</div>
				</div>
				<div id="apply" class="form-control">
					<div style="grid-column: 2; width: 100%; display: inline-flex;">
						<input type="submit" id="applyButton" style="margin-right: 10px;" class="button disabled" value="APPLY SETTINGS 💥" form="configForm">
                        <button type="button" id="resetSettings" style="background: none; margin: 0; border: none; cursor: pointer;">
                            <i class="fa fa-refresh fa-2x fa-border" style="border-radius: .2em;" aria-hidden="true"></i>
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
                    <tr>
                        <td>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Sing-box</b></span>
                            </div>
                        </td>
                        <td>
                            <button onclick="openQR('sing-box://import-remote-profile?url=https://${hostName}/sub/${userID}?app=sfa#BPB-Normal', 'Normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=sfa#BPB-Normal', false)">
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
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/sub/${userID}?app=clash#BPB-Normal', 'Normal Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/sub/${userID}?app=clash#BPB-Normal', false)">
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
                        <th style="text-wrap: nowrap;">Fragment Subscription</th>
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
                            <button onclick="openQR('https://${hostName}/fragsub/${userID}#BPB Fragment', 'Fragment Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/fragsub/${userID}#BPB Fragment', true)">
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
                        </td>
                        <td>
                            <button onclick="openQR('https://${hostName}/warpsub/${userID}?app=clash#BPB-WARP', 'Warp Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}?app=clash#BPB-WARP', false)">
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
                <a class="link" href="https://github.com/bia-pain-bache/BPB-Worker-Panel" target="_blank">Github</a>
                <button id="openModalBtn" class="button">Change Password</button>
                <button type="button" id="logout" style="background: none; margin: 0; border: none; cursor: pointer;">
                    <i class="fa fa-power-off fa-2x" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tweetnacl/1.0.3/nacl.min.js"></script>
	<script>
        const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
        let activePortsNo = ${ports.length};
        let activeHttpsPortsNo = ${ports.filter(port => defaultHttpsPorts.includes(port)).length};
        let activeProtocols = ${activeProtocols};
        const warpPlusLicense = '${warpPlusLicense}';

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

            ${isPassSet && !isWarpReady} && await getWarpConfigs();
                  
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
                const confirmReset = confirm('⚠️ Are you sure?');
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

            if (${!isPassSet}) {
                forcedPassChange = true;
                changePass.click();
            }
		});

        const base64Encode = (array) => {
            return btoa(String.fromCharCode.apply(null, array));
        }

        const generateKeyPair = () => {
            let privateKey = new Uint8Array(32);
            window.crypto.getRandomValues(privateKey);
            privateKey[0] &= 248;
            privateKey[31] &= 127;
            privateKey[31] |= 64;
            let publicKey = nacl.scalarMult.base(privateKey);
            const publicKeyBase64 = base64Encode(publicKey);
            const privateKeyBase64 = base64Encode(privateKey);

            return {publicKey: publicKeyBase64, privateKey: privateKeyBase64};
        }

        const getWarpConfigs = async () => {
            const license = document.getElementById('warpPlusLicense').value;
            if (license !== warpPlusLicense) {
                alert('⚠️ First APPLY SETTINGS and then update Warp configs!');
                return false;
            }
            const refreshBtn = document.getElementById('refreshBtn');
            const warpKeys = [
                generateKeyPair(),
                generateKeyPair()
            ];

            try {
                document.body.style.cursor = 'wait';
                const refreshButtonVal = refreshBtn.innerHTML;
                refreshBtn.innerHTML = '⌛ Loading...';

                const response = await fetch('/warp-keys', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(warpKeys),
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
            const wowEndpoint = document.getElementById('wowEndpoint').value?.replaceAll(' ', '').split(',');
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
            checkedPorts.forEach(port => formData.append('ports[]', port));

            const invalidIPs = [...cleanIPs, proxyIP, ...customCdnAddrs, customCdnHost, customCdnSni]?.filter(value => {
                if (value !== "") {
                    const trimmedValue = value.trim();
                    return !validIPDomain.test(trimmedValue);
                }
            });

            const invalidEndpoints = [...wowEndpoint, ...warpEndpoints]?.filter(value => {
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

            if (isCustomCdn && !(customCdnAddrs && customCdnHost && customCdnSni)) {
                alert('⛔ All "Custom" fields should be filled! 🫤');               
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

async function renderLoginPage () {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <style>

        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: #f9f9f9;
            position: relative;
            overflow: hidden;
        }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: #09639f; margin: 0 auto 30px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); }        
        h2 {text-align: center;}
        .form-container {
            background: #f9f9f9;
            border: 1px solid #eaeaea;
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
            color: #333;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            color: #333;
        }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: #fff;
            background-color: #09639f;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {background-color: #2980b9;}
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

    return html;
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
            body,
            html {
                height: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: system-ui;
            }
            h1 { font-size: 2.5rem; text-align: center; color: #09639f; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25); }
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
                <p><b>${error ? `⚠️ ${error}` : ''}</b></p>
            </div>
        </div>
    </body>

    </html>`;
}

async function fetchWgConfig (env, warpKeys) {
    let warpConfigs = [];
    let proxySettings = {};
    const apiBaseUrl = 'https://api.cloudflareclient.com/v0a4005/reg';

    try {
        proxySettings = await env.bpb.get('proxySettings', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting warp configs - ${error}`);
    }

    const { warpPlusLicense } = proxySettings;

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
            if(response.status !== 200 && !responseData.success) return responseData.errors[0]?.message;
        }
    }
    
    await env.bpb.put('warpConfigs', JSON.stringify(warpConfigs));
}

async function buildWarpOutbounds (env, client, proxySettings, warpConfigs) {
    let warpOutbounds = [];
    const { 
		warpEndpoints, 
		nikaNGNoiseMode, 
		hiddifyNoiseMode, 
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax 
	} = proxySettings;

    const warpIPv6 = `${warpConfigs[0].account.config.interface.addresses.v6}/128`;
    const publicKey = warpConfigs[0].account.config.peers[0].public_key;
    const privateKey = warpConfigs[0].privateKey;
    const reserved = warpConfigs[0].account.config.client_id;
    const fakePackets = noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`;
    const wPayloadSize = noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`;
    const wNoiseDelay = noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`;

    warpEndpoints.split(',').forEach( (endpoint, index) => {
        
        if (client === 'xray' || client === 'nikang') {
            let xrayOutbound = buildXrayWarpOutbound(`warp-${index + 1}`, warpIPv6, privateKey, publicKey, endpoint, reserved, '');
            client === 'nikang' && Object.assign(xrayOutbound.settings, {
                wnoise: nikaNGNoiseMode,
                wnoisecount: fakePackets,
                wpayloadsize: wPayloadSize,
                wnoisedelay: wNoiseDelay
            });

            warpOutbounds.push(xrayOutbound);
        }

        if (client === 'singbox' || client === 'hiddify') {
            let singboxOutbound = buildSingboxWarpOutbound(
                client === 'hiddify' ? `💦 Warp Pro ${index + 1} 🇮🇷` : `💦 Warp ${index + 1} 🇮🇷`, 
                warpIPv6, 
                privateKey, 
                publicKey, 
                endpoint,
                reserved, 
                ''
            );
            
            client === 'hiddify' && Object.assign(singboxOutbound, {
                fake_packets_mode: hiddifyNoiseMode,
                fake_packets: fakePackets,
                fake_packets_size: wPayloadSize,
                fake_packets_delay: wNoiseDelay
            });

            warpOutbounds.push(singboxOutbound);
        }

        if (client === 'clash') {
            let clashOutbound = buildClashWarpOutbound(`💦 Warp ${index + 1} 🇮🇷`, warpIPv6, privateKey, publicKey, endpoint, reserved, '');
            warpOutbounds.push(clashOutbound);
        }

    })
    
    return warpOutbounds;
}

async function buildWoWOutbounds (env, client, proxySettings, warpConfigs) {
    let wowOutbounds = [];
    const { 
		wowEndpoint, 
		nikaNGNoiseMode, 
		hiddifyNoiseMode, 
		noiseCountMin, 
		noiseCountMax, 
		noiseSizeMin, 
		noiseSizeMax, 
		noiseDelayMin, 
		noiseDelayMax 
	} = proxySettings;

    wowEndpoint.split(',').forEach( (endpoint, index) => {      
        for (let i = 0; i < 2; i++) {
            const warpIPv6 = `${warpConfigs[i].account.config.interface.addresses.v6}/128`;
            const publicKey = warpConfigs[i].account.config.peers[0].public_key;
            const privateKey = warpConfigs[i].privateKey;
            const reserved = warpConfigs[i].account.config.client_id;
            const fakePackets = noiseCountMin === noiseCountMax ? noiseCountMin : `${noiseCountMin}-${noiseCountMax}`;
            const wPayloadSize = noiseSizeMin === noiseSizeMax ? noiseSizeMin : `${noiseSizeMin}-${noiseSizeMax}`;
            const wNoiseDelay = noiseDelayMin === noiseDelayMax ? noiseDelayMin : `${noiseDelayMin}-${noiseDelayMax}`;

            if (client === 'xray' || client === 'nikang') {
                let xrayOutbound = buildXrayWarpOutbound(
                    i === 1 ? `warp-ir_${index + 1}` : `warp-out_${index + 1}`, 
                    warpIPv6, 
                    privateKey, 
                    publicKey, 
                    endpoint, 
                    reserved, 
                    i === 1 ? '' : `warp-ir_${index + 1}`
                );

                (client === 'nikang' && i === 1) && Object.assign(xrayOutbound.settings, {
                    wnoise: nikaNGNoiseMode,
                    wnoisecount: fakePackets,
                    wpayloadsize: wPayloadSize,
                    wnoisedelay: wNoiseDelay
                });
    
                wowOutbounds.push(xrayOutbound);
            }

            if (client === 'singbox' || client === 'hiddify') {
                let singboxOutbound = buildSingboxWarpOutbound(
                    i === 1
                    ? `warp-ir_${index + 1}` 
                    : client === 'hiddify' 
                        ? `💦 WoW Pro ${index + 1} 🌍` 
                        : `💦 WoW ${index + 1} 🌍` , 
                    warpIPv6, 
                    privateKey, 
                    publicKey, 
                    endpoint, 
                    reserved, 
                    i === 0 ? `warp-ir_${index + 1}` : ''
                );
                
                (client === 'hiddify' && i === 1) && Object.assign(singboxOutbound, {
                    fake_packets_mode: hiddifyNoiseMode,
                    fake_packets: fakePackets,
                    fake_packets_size: wPayloadSize,
                    fake_packets_delay: wNoiseDelay
                });
    
                wowOutbounds.push(singboxOutbound);
            }

            if (client === 'clash') {
                let clashOutbound = buildClashWarpOutbound(
                    i === 1 ? `warp-ir_${index + 1}` : `💦 WoW ${index + 1} 🌍`, 
                    warpIPv6, 
                    privateKey, 
                    publicKey, 
                    endpoint,
                    reserved, 
                    i === 0 ? `warp-ir_${index + 1}` : ''
                );

                wowOutbounds.push(clashOutbound);
            }
        }
    });

    return wowOutbounds;
}

async function buildXrayDNSObject (remoteDNS, localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, isWorkerLess, isChain) {

    const dohPattern = /^(?:[a-zA-Z]+:\/\/)?([^:\/\s?]+)/;
    const dohMatch = remoteDNS.match(dohPattern);
    const dohHost = dohMatch ? dohMatch[1] : null;
    const isDOHDomain = isDomain(dohHost);
    let dnsObject = {
        hosts: {
            "domain:googleapis.cn": ["googleapis.com"]
        },
        servers: [
            remoteDNS
        ],
        tag: "dns",
    };

    let resolvedDOH;
    if (dohHost && isDOHDomain) {
        resolvedDOH = await resolveDNS(dohHost);
        if (!isWorkerLess) dnsObject.hosts[dohHost] = [
            ...resolvedDOH.ipv4, 
            ...resolvedDOH.ipv6 
        ];        
    }

    if (isWorkerLess) {
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

    isChain && dnsObject.servers.push({
        address: localDNS === 'localhost' ? '8.8.8.8' : localDNS,
        domains: []
    });

    if (!isWorkerLess && localDNS !== 'localhost' && (bypassIran || bypassChina || bypassLAN)) {
        let localDNSServer = {
            address: localDNS,
            domains: [],
            expectIPs: []
        };
        bypassLAN && localDNSServer.domains.push("geosite:private") && localDNSServer.expectIPs.push("geoip:private");
        bypassIran && localDNSServer.domains.push("geosite:category-ir") && localDNSServer.expectIPs.push("geoip:ir"); 
        bypassChina && localDNSServer.domains.push("geosite:cn") && localDNSServer.expectIPs.push("geoip:cn");
        dnsObject.servers.push(localDNSServer);
    }

    return dnsObject;
}

function buildXrayRoutingRules (localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, isChain, isBalancer, isWorkerLess, isWarp) {
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
        },
        {
            network: "udp",
            port: "53",
            outboundTag: "direct",
            type: "field"
        }
    ];

    if (bypassIran || bypassLAN || bypassChina) {
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

        if (!isWorkerLess) {
            bypassLAN && domainRule.domain.push("geosite:private") && ipRule.ip.push("geoip:private");
            bypassIran && domainRule.domain.push("geosite:category-ir") && ipRule.ip.push("geoip:ir");
            bypassChina && domainRule.domain.push("geosite:cn") && ipRule.ip.push("geoip:cn");
            rules.push(domainRule, ipRule);
        }
    }

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

    blockUDP443 && isWarp && !isWorkerLess && rules.push({
        network: "udp",
        port: "443",
        outboundTag: "block",
        type: "field",
    });
   
    if (isBalancer) {
        rules.push({
            network: isWarp || isWorkerLess ? "tcp,udp" : "tcp",
            balancerTag: "all",
            type: "field"
        });
    } else  {
        rules.push({
            network: isWarp || isWorkerLess ? "tcp,udp" : "tcp",
            outboundTag: isChain ? "out" : isWorkerLess ? "fragment" : "proxy",
            type: "field"
        });
    }

    return rules;
}

function buildXrayVLESSOutbound (tag, address, port, uuid, host, proxyIP) {
    return {
        protocol: "vless",
        settings: {
            vnext: [
                {
                    address: address,
                    port: port,
                    users: [
                        {
                            encryption: "none",
                            flow: "",
                            id: uuid,
                            level: 8,
                            security: "auto"
                        }
                    ]
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "tls",
            sockopt: {
                dialerProxy: "fragment",
                tcpNoDelay: true
            },
            tlsSettings: {
                allowInsecure: false,
                fingerprint: "randomized",
                alpn: ["h2", "http/1.1"],
                serverName: randomUpperCase(host)
            },
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
}

function buildXrayTrojanOutbound (tag, address, port, password, host, proxyIP) {
    return {
        protocol: "trojan",
        settings: {
            servers: [
                {
                    address: address,
                    port: port,
                    password: password,
                    level: 8
                }
            ]
        },
        streamSettings: {
            network: "ws",
            security: "tls",
            sockopt: {
                dialerProxy: "fragment",
                tcpNoDelay: true
            },
            tlsSettings: {
                allowInsecure: false,
                alpn: [
                    "h2",
                    "http/1.1"
                ],
                fingerprint: "randomized",
                serverName: randomUpperCase(host)
            },
            wsSettings: {
                headers: {
                    Host: host
                },
                path: `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}?ed=2560`
            }
        },
        tag: tag
    };
}

function buildXrayWarpOutbound (remark, ipv6, privateKey, publicKey, endpoint, reserved, chain) {
    let outbound = {
        protocol: "wireguard",
        settings: {
            address: [
                "172.16.0.2/32",
                ipv6
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
                dialerProxy: chain,
                tcpKeepAliveIdle: 100,
                tcpNoDelay: true,
            }
        },
        tag: remark
    };

    !chain && delete outbound.streamSettings;
    return outbound;
}

function buildXrayChainOutbound(chainProxyParams) {
    if (chainProxyParams.protocol) {
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
            tag: "out"
        };
    }

    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, spx, headerType, host, path, authority, serviceName, mode } = chainProxyParams;
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
        tag: "out"
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

async function buildWorkerLessConfig(remoteDNS, localDNS, lengthMin,  lengthMax,  intervalMin,  intervalMax, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443) {
    let fakeOutbound = buildXrayVLESSOutbound('fake-outbound', 'google.com', 443, userID, 'google.com', '');
    delete fakeOutbound.streamSettings.sockopt;
    fakeOutbound.streamSettings.wsSettings.path = '/';
    let fragConfig = structuredClone(xrayConfigTemp);
    fragConfig.remarks  = '💦 BPB F - WorkerLess ⭐'
    fragConfig.dns = await buildXrayDNSObject('https://cloudflare-dns.com/dns-query', localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, true);
    fragConfig.outbounds[0].settings.domainStrategy = 'UseIP';
    fragConfig.outbounds[0].settings.fragment.length = `${lengthMin}-${lengthMax}`;
    fragConfig.outbounds[0].settings.fragment.interval = `${intervalMin}-${intervalMax}`;
    fragConfig.outbounds = [
        {...fragConfig.outbounds[0]}, 
        {...fakeOutbound}, 
        {...fragConfig.outbounds[1]}, 
        {...fragConfig.outbounds[2]}, 
        {...fragConfig.outbounds[3]}
    ];
    fragConfig.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false, true, false);
    delete fragConfig.routing.balancers;
    delete fragConfig.observatory;

    return fragConfig;
}

async function getFragmentConfigs(env, hostName) {
    let Configs = [];
    let outbounds = [];
    let proxySettings = {};
    let chainProxy;
    let proxyIndex = 1;
    const bestFragValues = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', 
                            '70-80', '80-90', '90-100', '10-30', '20-40', '30-50', 
                            '40-60', '50-70', '60-80', '70-90', '80-100', '100-200'];

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting fragment configs - ${error}`);
    }

    const {
        remoteDNS, 
        localDNS, 
        lengthMin, 
        lengthMax, 
        intervalMin, 
        intervalMax,
        fragmentPackets,
        blockAds,
        bypassIran,
        blockPorn,
        bypassLAN,
        bypassChina,
        blockUDP443, 
        cleanIPs,
        proxyIP,
        outProxy,
        outProxyParams,
        ports,
        vlessConfigs,
        trojanConfigs,
        bestVLESSTrojanInterval
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
    
    let config = structuredClone(xrayConfigTemp);
    config.dns = await buildXrayDNSObject(remoteDNS, localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, false, chainProxy);
    config.outbounds[0].settings.fragment.length = `${lengthMin}-${lengthMax}`;
    config.outbounds[0].settings.fragment.interval = `${intervalMin}-${intervalMax}`;
    config.outbounds[0].settings.fragment.packets = fragmentPackets;
    let balancerConfig = structuredClone(config);
    config.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, chainProxy, false, false, false);
    balancerConfig.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, chainProxy, true, false, false);
    balancerConfig.observatory.probeInterval = `${bestVLESSTrojanInterval}s`;
    delete config.observatory;
    delete config.routing.balancers;
    let protocolNo = (vlessConfigs ? 1 : 0) + (trojanConfigs ? 1 : 0);
    const Addresses = await getConfigAddresses(hostName, cleanIPs);
    const domainAddressesRules = Addresses.filter(address => isDomain(address)).map(domain => `full:${domain}`);
    
    for (let i = 0; i < protocolNo; i++) {
        for (let portIndex in ports.filter(port => defaultHttpsPorts.includes(port))) {
            let port = +ports[portIndex];
            for (let index in Addresses) {
                
                let fragConfig = structuredClone(config);
                let outbound;
                let addr = Addresses[index];
                let remark;

                if (vlessConfigs && i === 0) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', 'F');
                    outbound = buildXrayVLESSOutbound('proxy', addr, port, userID, hostName, proxyIP);
                }
                
                if (trojanConfigs && !outbound) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', 'F', addr);
                    outbound = buildXrayTrojanOutbound('proxy', addr, port, trojanPassword, hostName, proxyIP);
                }
                
                fragConfig.remarks = remark;
                if (chainProxy) {
                    fragConfig.outbounds = [{...chainProxy}, { ...outbound}, ...fragConfig.outbounds];
                    isDomain(addr)
                        ? fragConfig.dns.servers[1].domains.push(`full:${addr}`)
                        : fragConfig.dns.servers.splice(1,1);
                } else {
                    fragConfig.outbounds = [{ ...outbound}, ...fragConfig.outbounds];
                }
    
                Configs.push(fragConfig); 
                outbound.tag = `prox_${proxyIndex}`;
                
                if (chainProxy) {
                    let proxyOut = structuredClone(chainProxy);
                    proxyOut.tag = `out_${proxyIndex}`;
                    proxyOut.streamSettings.sockopt.dialerProxy = `prox_${proxyIndex}`;
                    outbounds.push({...proxyOut}, {...outbound});
                } else {
                    outbounds.push({...outbound});
                }
    
                proxyIndex++;
            }
        }
    }
    
    let bestPing = structuredClone(balancerConfig);
    bestPing.remarks = '💦 BPB F - Best Ping 💥';
    bestPing.outbounds = [...outbounds, ...bestPing.outbounds];
    
    if (chainProxy) {
        bestPing.observatory.subjectSelector = ["out"];
        bestPing.routing.balancers[0].selector = ["out"];
        bestPing.dns.servers[1].domains = domainAddressesRules;
    }

    let bestFragment = structuredClone(balancerConfig);
    bestFragment.remarks = '💦 BPB F - Best Fragment 😎';
    bestFragment.outbounds.splice(0,1);
    bestFragValues.forEach( (fragLength, index) => {
        bestFragment.outbounds.push({
            tag: `frag_${index + 1}`,
            protocol: "freedom",
            settings: {
                fragment: {
                    packets: fragmentPackets,
                    length: fragLength,
                    interval: "1-1"
                }
            },
            proxySettings: {
                tag: chainProxy ? "out" : "proxy"
            }
        });
    });

    let bestFragmentOutbounds = structuredClone([{...outbounds[0]}, {...outbounds[1]}]);  
    
    if (chainProxy) {
        bestFragmentOutbounds[0].streamSettings.sockopt.dialerProxy = 'proxy';
        delete bestFragmentOutbounds[1].streamSettings.sockopt.dialerProxy;
        bestFragmentOutbounds[0].tag = 'out';
        bestFragmentOutbounds[1].tag = 'proxy';
        bestFragment.outbounds = [bestFragmentOutbounds[0], bestFragmentOutbounds[1], ...bestFragment.outbounds];
        bestFragment.dns.servers[1].domains = domainAddressesRules;
    } else {
        delete bestFragmentOutbounds[0].streamSettings.sockopt.dialerProxy;
        bestFragmentOutbounds[0].tag = 'proxy';
        bestFragment.outbounds = [bestFragmentOutbounds[0], ...bestFragment.outbounds];
    }

    bestFragment.observatory.subjectSelector = ["frag"];
    bestFragment.routing.balancers[0].selector = ["frag"];
    const workerLessConfig = await buildWorkerLessConfig(remoteDNS, localDNS, lengthMin,  lengthMax,  intervalMin,  intervalMax, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443); 
    Configs.push(bestPing, bestFragment, workerLessConfig);

    return Configs;
}

async function getXrayWarpConfigs (env, client) {
    let proxySettings = {};
    let warpConfigs = [];
    let xrayWarpConfigs = [];
    let xrayWarpConfig = structuredClone(xrayConfigTemp);
    let xrayWarpBestPing = structuredClone(xrayConfigTemp);
    let xrayWoWConfigTemp = structuredClone(xrayConfigTemp);
    
    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting fragment configs - ${error}`);
    }
    
    const { localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, wowEndpoint, warpEndpoints, bestWarpInterval } = proxySettings;
    const xrayWarpOutbounds = await buildWarpOutbounds(env, client, proxySettings, warpConfigs);
    const xrayWoWOutbounds = await buildWoWOutbounds(env, client, proxySettings, warpConfigs); 
    
    xrayWarpConfig.dns = await buildXrayDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, false);
    xrayWarpConfig.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false, false, true);
    xrayWarpConfig.outbounds.splice(0,1);
    xrayWarpConfig.routing.rules[xrayWarpConfig.routing.rules.length - 1].outboundTag = 'warp';
    delete xrayWarpConfig.observatory;
    delete xrayWarpConfig.routing.balancers;
    xrayWarpBestPing.remarks = client === 'nikang' ? '💦 BPB - Warp Pro Best Ping 🚀' : '💦 BPB - Warp Best Ping 🚀';
    xrayWarpBestPing.dns = await buildXrayDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, false);
    xrayWarpBestPing.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, true, false, true);
    xrayWarpBestPing.outbounds.splice(0,1);
    xrayWarpBestPing.routing.balancers[0].selector = ['warp'];
    xrayWarpBestPing.observatory.subjectSelector = ['warp'];
    xrayWarpBestPing.observatory.probeInterval = `${bestWarpInterval}s`;
    xrayWoWConfigTemp.dns = await buildXrayDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, bypassLAN, blockPorn, false);
    xrayWoWConfigTemp.routing.rules = buildXrayRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false, false, true);
    xrayWoWConfigTemp.outbounds.splice(0,1);
    delete xrayWoWConfigTemp.observatory;
    delete xrayWoWConfigTemp.routing.balancers;
  
    xrayWarpOutbounds.forEach((outbound, index) => {
        xrayWarpConfigs.push({
            ...xrayWarpConfig,
            remarks: client === 'nikang' ? `💦 BPB - Warp Pro ${index + 1} 🇮🇷` : `💦 BPB - Warp ${index + 1} 🇮🇷`,
            outbounds: [{...outbound, tag: 'warp'}, ...xrayWarpConfig.outbounds]
        });
    });
    
    xrayWoWOutbounds.forEach((outbound, index) => {
        if (outbound.tag.includes('warp-out')) {
            let xrayWoWConfig = structuredClone(xrayWoWConfigTemp);
            xrayWoWConfig.remarks = client === 'nikang' ? `💦 BPB - WoW Pro ${index/2 + 1} 🌍` : `💦 BPB - WoW ${index/2 + 1} 🌍`;
            xrayWoWConfig.outbounds = [{...xrayWoWOutbounds[index]}, {...xrayWoWOutbounds[index + 1]}, ...xrayWoWConfig.outbounds];
            xrayWoWConfig.routing.rules[xrayWoWConfig.routing.rules.length - 1].outboundTag = outbound.tag;
            xrayWarpConfigs.push(xrayWoWConfig);
        }
    });

    let xrayWoWBestPing = structuredClone(xrayWarpBestPing);
    xrayWoWBestPing.remarks = client === 'nikang' ? '💦 BPB - WoW Pro Best Ping 🚀' : '💦 BPB - WoW Best Ping 🚀';
    xrayWoWBestPing.routing.balancers[0].selector = ['warp-out'];
    xrayWoWBestPing.observatory.subjectSelector = ['warp-out'];
    xrayWarpBestPing.outbounds = [...xrayWarpOutbounds, ...xrayWarpBestPing.outbounds];
    xrayWoWBestPing.outbounds = [...xrayWoWOutbounds, ...xrayWoWBestPing.outbounds];
    xrayWarpConfigs.push(xrayWarpBestPing, xrayWoWBestPing);

    return xrayWarpConfigs;
}

async function buildClashDNS (remoteDNS, localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina) {
    const dohPattern = /^(?:[a-zA-Z]+:\/\/)?([^:\/\s?]+)/;
    const DNSNameserver = remoteDNS.match(dohPattern)[1];
    const isDOHDomain = isDomain(DNSNameserver);
    let clashLocalDNS = localDNS === 'localhost' ? 'system' : localDNS;

    let dns = {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": true,
        "respect-rules": true,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "nameserver": [
            remoteDNS
        ],
        "proxy-server-nameserver": [clashLocalDNS]
    };
    
    if (DNSNameserver && isDOHDomain) {
        const resolvedDOH = await resolveDNS(DNSNameserver);
        dns['hosts'] = {
            [`${DNSNameserver}`]: [
                ...resolvedDOH.ipv4, 
                ...resolvedDOH.ipv6 
            ]
        };
    }
    
    let geosites = [];
    bypassIran && geosites.push('category-ir');
    bypassChina && geosites.push('cn');

    if (bypassIran || bypassChina) { 
        dns['nameserver-policy'] = {
            [`geosite:${geosites.join(',')}`]: [clashLocalDNS],
            'www.gstatic.com': [clashLocalDNS]
        };
    }

    return dns;
}

function buildClashRoutingRules (localDNS, blockAds, bypassIran, bypassChina, blockPorn, blockUDP443, bypassLAN, isWarp) {
    let rules = [];

    (localDNS !== 'localhost') && rules.push(`AND,((IP-CIDR,${localDNS}/32),(DST-PORT,53)),DIRECT`);
    bypassLAN && rules.push('GEOSITE,private,DIRECT', 'GEOIP,private,DIRECT,no-resolve');
    bypassIran && rules.push('GEOSITE,category-ir,DIRECT', 'GEOIP,ir,DIRECT,no-resolve');
    bypassChina && rules.push('GEOSITE,cn,DIRECT', 'GEOIP,cn,DIRECT,no-resolve');
    blockUDP443 && isWarp && rules.push('AND,((NETWORK,udp),(DST-PORT,443)),REJECT');
    !isWarp && rules.push('NETWORK,udp,REJECT');
    blockAds && rules.push('GEOSITE,category-ads-all,REJECT', 'GEOSITE,category-ads-ir,REJECT');
    blockPorn && rules.push('GEOSITE,category-porn,REJECT');
    rules.push('MATCH,✅ Selector');

    return rules;
}

function buildClashVLESSOutbound (remark, address, port, uuid, host, sni, path) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    let outbound = {
        "name": remark,
        "type": "vless",
        "server": address,
        "port": +port,
        "uuid": uuid,
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
            "servername": randomUpperCase(sni),
            "alpn": ["h2", "http/1.1"],
            "client-fingerprint": "random"
        });
    }

    return outbound;
}

function buildClashTrojanOutbound (remark, address, port, password, host, sni, path) {
    return {
        "name": remark,
        "type": "trojan",
        "server": address,
        "port": +port,
        "password": password,
        "network": "ws",
        "udp": false,
        "ws-opts": {
            "path": path,
            "headers": { "host": host },
            "max-early-data": 2560,
            "early-data-header-name": "Sec-WebSocket-Protocol"
        },
        "sni": randomUpperCase(sni),
        "alpn": ["h2", "http/1.1"],
        "client-fingerprint": "random"
    };
}

function buildClashWarpOutbound (remark, ipv6, privateKey, publicKey, endpoint, reserved, chain) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];

    return {
        "name": remark,
        "type": "wireguard",
        "ip": "172.16.0.2/32",
        "ipv6": ipv6,
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
    if (chainProxyParams.protocol) {
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

    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, spx, headerType, host, path, authority, serviceName, mode } = chainProxyParams;
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

async function getClashConfig (env, hostName, isWarp) {
    let proxySettings = {};
    let warpConfigs = [];
    let remark, path, selectorProxies;
    let outbounds = [];
    let warpOutboundsRemarks = [];
    let wowOutboundRemarks = [];
    let outboundsRemarks = [];
    let chainProxyOutbound;

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting sing-box configs - ${error}`);
    }

    const { 
        remoteDNS,  
        localDNS, 
        cleanIPs, 
        proxyIP, 
        ports, 
        blockAds, 
        bypassIran, 
        blockPorn, 
        bypassLAN, 
        bypassChina, 
        blockUDP443, 
        vlessConfigs, 
        trojanConfigs, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        bestWarpInterval
    } = proxySettings; 

    let config = structuredClone(clashConfigTemp);
    config.dns = await buildClashDNS(isWarp ? '1.1.1.1' : remoteDNS, localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina);
    config.rules = buildClashRoutingRules(localDNS, blockAds, bypassIran, bypassChina, blockPorn, blockUDP443, bypassLAN, isWarp);
    const Addresses = (await getConfigAddresses(hostName, cleanIPs));
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];

    if (outProxy && !isWarp) {
        const proxyParams = JSON.parse(outProxyParams);
        
        try {
            chainProxyOutbound = buildClashChainOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            chainProxyOutbound = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: ''
            }));
        }
    }

    if (isWarp) {
        config['proxy-groups'][1].interval = +bestWarpInterval;
        const clashWarpOutbounds = await buildWarpOutbounds(env, 'clash', proxySettings, warpConfigs);
        const clashWOWpOutbounds = await buildWoWOutbounds(env, 'clash', proxySettings, warpConfigs);
        outbounds.push(...clashWarpOutbounds, ...clashWOWpOutbounds);
        clashWarpOutbounds.forEach(outbound => {
            warpOutboundsRemarks.push(outbound["name"]);
        });
        
        clashWOWpOutbounds.forEach(outbound => {
            outbound["name"].includes('WoW') && wowOutboundRemarks.push(outbound["name"]);
        });
    } else {
        config['proxy-groups'][1].interval = +bestVLESSTrojanInterval;
    }

    let protocolsNo = (vlessConfigs ? 1 : 0) + (trojanConfigs ? 1 : 0);
    let proxyIndex = 1;

    for (let i = 0; i < protocolsNo && !isWarp; i++) {
        ports.forEach(port => {
            totalAddresses.forEach((addr, index) => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = index > Addresses.length - 1;
                const configType = isCustomAddr ? 'C' : '';
                const configIndex = isCustomAddr ? index - Addresses.length + 1 : index;
                const sni = isCustomAddr ? customCdnSni : hostName;
                const host = isCustomAddr ? customCdnHost : hostName;

                if (vlessConfigs && i === 0) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType).replace(' : ', ' - ');
                    path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    addr = isIPv6(addr) ? addr.replace(/\[|\]/g, '') : addr;
                    VLESSOutbound = buildClashVLESSOutbound(
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        userID, 
                        host,
                        sni, 
                        path
                    );
                    outbounds.push(VLESSOutbound);
                    outboundsRemarks.push(remark);
                }
                
                if (trojanConfigs && !VLESSOutbound && defaultHttpsPorts.includes(port)) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', configType).replace(' : ', ' - ');
                    path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    addr = isIPv6(addr) ? addr.replace(/\[|\]/g, '') : addr;
                    TrojanOutbound = buildClashTrojanOutbound(
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        trojanPassword, 
                        host,
                        sni, 
                        path
                    );
                    outbounds.push(TrojanOutbound);
                    outboundsRemarks.push(remark);
                }

                if (chainProxyOutbound && (TrojanOutbound || VLESSOutbound)) {
                    let chain = structuredClone(chainProxyOutbound);
                    chain['name'] = remark;
                    chain['dialer-proxy'] = `proxy-${proxyIndex}`;
                    outbounds.push(chain);
                }

                proxyIndex++;
            });
        });
    }


    config.proxies = outbounds;
    config['proxy-groups'][0].proxies = isWarp
        ? ['💦 Warp Best Ping 🚀', '💦 WoW Best Ping 🚀', ...warpOutboundsRemarks, ...wowOutboundRemarks ]
        : ['💦 Best Ping 💥', ...outboundsRemarks ];

    config['proxy-groups'][1].proxies = isWarp ? warpOutboundsRemarks : outboundsRemarks;
    config['proxy-groups'][1].name = isWarp ? `💦 Warp Best Ping 🚀`: `💦 Best Ping 💥`,

    isWarp && config["proxy-groups"].push({
        "name": "💦 WoW Best Ping 🚀",
        "type": "url-test",
        "url": "https://www.gstatic.com/generate_204",
        "interval": +bestWarpInterval,
        "tolerance": 50,
        "proxies": wowOutboundRemarks
    });

    return config;
}

function buildSingboxDNSRules (blockAds, bypassIran, bypassChina, blockPorn, outboundDomains) {
    let rules = [
        {
            domain: [
                "www.gstatic.com",
                ...outboundDomains
            ],
            server: "dns-direct"
        },
        {
            outbound: "any",
            server: "dns-direct"
        }
    ];

    let bypassRules = {
        rule_set: [],
        server: "dns-direct"
    }
    
    bypassIran && bypassRules.rule_set.push("geosite-ir");
    bypassChina && bypassRules.rule_set.push("geosite-cn");
    (bypassIran || bypassChina) && rules.push(bypassRules);

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

    return rules;
}

function buildSingboxRoutingRules (blockAds, bypassIran, bypassChina, blockPorn, blockUDP443, bypassLAN, isWarp) {
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
    
    bypassLAN && rules.push({
        ip_is_private: true,
        outbound: "direct"
    });
    
    !isWarp && rules.push({
        network: "udp",
        outbound: "block"
    });

    blockUDP443 && isWarp && rules.push({
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

function buildSingboxVLESSOutbound (remark, address, port, uuid, host, sni, path, isFragment, lengthMin, lengthMax, intervalMin, intervalMax) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    let outbound =  {
        type: "vless",
        server: address,
        server_port: +port,
        uuid: uuid,
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: false,
            server_name: randomUpperCase(sni),
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

function buildSingboxTrojanOutbound (remark, address, port, password, host, sni, path, isFragment, lengthMin, lengthMax, intervalMin, intervalMax) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;
    let outbound = {
        type: "trojan",
        password: password,
        server: address,
        server_port: +port,
        tls: {
            alpn: "http/1.1",
            enabled: true,
            insecure: false,
            server_name: randomUpperCase(sni),
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

function buildSingboxWarpOutbound (remark, ipv6, privateKey, publicKey, endpoint, reserved, chain) {
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
    const endpointServer = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
    const endpointPort = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];

    return {
        local_address: [
            "172.16.0.2/32",
            ipv6
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
}

function buildSingboxChainOutbound(chainProxyParams) {
    if (chainProxyParams.protocol) {
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

    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, spx, headerType, host, path, authority, serviceName, mode } = chainProxyParams;
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

async function getSingboxConfig (env, hostName, client, isWarp, isFragment) {
    let warpConfigs = [];
    let proxySettings = {};
    let outboundDomains = [];
    let chainProxyOutbound;
    
    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting sing-box configs - ${error}`);
    }

    const { 
        remoteDNS,  
        localDNS, 
        cleanIPs, 
        proxyIP, 
        ports, 
        vlessConfigs, 
        trojanConfigs, 
        lengthMin, 
        lengthMax, 
        intervalMin, 
        intervalMax, 
        blockAds, 
        bypassIran, 
        bypassChina, 
        blockPorn, 
        blockUDP443, 
        bypassLAN, 
        outProxy, 
        outProxyParams,
        customCdnAddrs,
        customCdnHost,
        customCdnSni,
        bestVLESSTrojanInterval,
        bestWarpInterval
    } = proxySettings;

    let config = structuredClone(singboxConfigTemp);
    
    if (outProxy && !isWarp) {
        const proxyParams = JSON.parse(outProxyParams);      
        try {
            chainProxyOutbound = buildSingboxChainOutbound(proxyParams);
            isDomain(chainProxyOutbound.server) && outboundDomains.push(chainProxyOutbound.server);
            config.dns.servers[0].detour = "proxy-1";
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

    let outbound, remark, path;
    const Addresses = await getConfigAddresses(hostName, cleanIPs);
    const customCdnAddresses = customCdnAddrs ? customCdnAddrs.split(',') : [];
    const totalAddresses = [...Addresses, ...customCdnAddresses];
    config.dns.servers[0].address = remoteDNS;
    config.dns.servers[1].address = localDNS === 'localhost' ? 'local' : localDNS;

    if (isWarp) {
        const warpOutbounds = await buildWarpOutbounds(env, client, proxySettings, warpConfigs);
        const WOWOutbounds = await buildWoWOutbounds(env, client, proxySettings, warpConfigs);
        config.dns.servers[0].address = '1.1.1.1';
        config.outbounds[0].outbounds = client === 'hiddify'
            ? ["💦 Warp Pro Best Ping 🚀", "💦 WoW Pro Best Ping 🚀"]
            : ["💦 Warp Best Ping 🚀", "💦 WoW Best Ping 🚀"];
        config.outbounds.splice(2, 0, structuredClone(config.outbounds[1]));
        config.outbounds[1].tag = client === 'hiddify' 
            ? "💦 Warp Pro Best Ping 🚀"
            : "💦 Warp Best Ping 🚀";
        config.outbounds[2].tag = client === 'hiddify'
            ? "💦 WoW Pro Best Ping 🚀"
            : "💦 WoW Best Ping 🚀";
        config.outbounds.push(...warpOutbounds, ...WOWOutbounds);
        warpOutbounds.forEach(outbound => {
            config.outbounds[0].outbounds.push(outbound.tag);
            config.outbounds[1].outbounds.push(outbound.tag);
            isDomain(outbound.server) && outboundDomains.push(outbound.server);
        });

        WOWOutbounds.forEach(outbound => {
            if (outbound.tag.includes('WoW')) {
                config.outbounds[0].outbounds.push(outbound.tag);
                config.outbounds[2].outbounds.push(outbound.tag);
            }
            isDomain(outbound.server) && outboundDomains.push(outbound.server);
        });

        config.outbounds[1].interval = `${bestWarpInterval}s`;
        config.outbounds[2].interval = `${bestWarpInterval}s`;
    } else {
        config.outbounds[1].interval = `${bestVLESSTrojanInterval}s`;
    }

    let protocolsNo = (vlessConfigs ? 1 : 0) + (trojanConfigs ? 1 : 0);
    let proxyIndex = 1;

    for (let i = 0; i < protocolsNo && !isWarp; i++) {
        ports.filter(port => (defaultHttpsPorts.includes(port) && isFragment) || !isFragment).forEach(port => {
            totalAddresses.forEach((addr, index) => {
                let VLESSOutbound, TrojanOutbound;
                const isCustomAddr = index > Addresses.length - 1;
                const configType = isCustomAddr ? 'C' : isFragment ? 'F' : '';
                const configIndex = isCustomAddr ? index - Addresses.length + 1 : index;
                const sni = isCustomAddr ? customCdnSni : hostName;
                const host = isCustomAddr ? customCdnHost : hostName;
         
                if (vlessConfigs && i === 0) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType);
                    path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    VLESSOutbound = buildSingboxVLESSOutbound(
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        userID, 
                        host,
                        sni, 
                        path, 
                        isFragment, 
                        lengthMin, 
                        lengthMax, 
                        intervalMin, 
                        intervalMax
                    );
                    config.outbounds.push(VLESSOutbound);
                }
                
                if (trojanConfigs && !VLESSOutbound) {
                    remark = generateRemark(proxyIndex, port, addr, cleanIPs, 'Trojan', configType);
                    path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    TrojanOutbound = buildSingboxTrojanOutbound(
                        chainProxyOutbound ? `proxy-${proxyIndex}` : remark, 
                        addr, 
                        port, 
                        trojanPassword, 
                        host,
                        sni, 
                        path,
                        isFragment, 
                        lengthMin, 
                        lengthMax, 
                        intervalMin, 
                        intervalMax
                    );
                    config.outbounds.push(TrojanOutbound);
                }
                
                if (chainProxyOutbound) {
                    let chain = structuredClone(chainProxyOutbound);
                    chain.tag = remark;
                    chain.detour = `proxy-${proxyIndex}`;
                    config.outbounds.push(chain);
                }
                
                config.outbounds[0].outbounds.push(remark);
                config.outbounds[1].outbounds.push(remark);
                isDomain(addr) && outboundDomains.push(addr);
                proxyIndex++;
            });
        });
    }

    config.dns.rules = buildSingboxDNSRules(blockAds, bypassIran, bypassChina, blockPorn, new Set(outboundDomains));
    const {rules, rule_set} = buildSingboxRoutingRules (blockAds, bypassIran, bypassChina, blockPorn, blockUDP443, bypassLAN, isWarp);
    config.route.rules = rules;
    config.route.rule_set = rule_set;

    return config;
}

async function getNormalConfigs(env, hostName, client) {
    let proxySettings = {};
    let vlessConfs = '';
    let trojanConfs = '';
    let chainProxy = '';
    let proxyIndex = 1;

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting normal configs - ${error}`);
    }

    const { cleanIPs, proxyIP, ports, vlessConfigs, trojanConfigs , outProxy, customCdnAddrs, customCdnHost, customCdnSni} = proxySettings;
    const Addresses = await getConfigAddresses(hostName, cleanIPs);
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
            const sni = randomUpperCase(isCustomAddr ? customCdnSni : hostName);
            const host = isCustomAddr ? customCdnHost : hostName;
            const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ''}${earlyData}`;
            const configIndex = isCustomAddr ? index - Addresses.length + 1 : index;
            const vlessRemark = encodeURIComponent(generateRemark(proxyIndex, port, addr, cleanIPs, 'VLESS', configType));
            const trojanRemark = encodeURIComponent(generateRemark(proxyIndex + totalAddresses.length * ports.length, port, addr, cleanIPs, 'Trojan', configType));
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
            settings: {
                domainStrategy: "UseIP"
            },
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
    stats: {},
};

const singboxConfigTemp = {
    log: {
        level: "warn",
        timestamp: true
    },
    dns: {
        servers: [
            {
                address: "",
                address_resolver: "dns-direct",
                strategy: "prefer_ipv4",
                detour: "💦 Best Ping 💥",
                tag: "dns-remote"
            },
            {
                address: "",
                strategy: "prefer_ipv4",
                detour: "direct",
                tag: "dns-direct"
            },
            {
                address: "rcode://success",
                tag: "dns-block"
            }
        ],
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
            outbounds: ["💦 Best Ping 💥"]
        },
        {
            type: "urltest",
            tag: "💦 Best Ping 💥",
            outbounds: [],
            url: "https://www.gstatic.com/generate_204",
            interval: "30s",
            tolerance: 50
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
        enabled: false,
        server: "time.apple.com",
        server_port: 123,
        detour: "direct",
        interval: "30m",
    },
    experimental: {
        cache_file: {
            enabled: true
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
