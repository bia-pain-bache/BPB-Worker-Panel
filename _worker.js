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
let trojanPwd = "bpb-trojan";
let sha224Password;
let panelVersion = '2.5.2';

if (!isValidUUID(userID)) {
    throw new Error('uuid is not valid');
}

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
            trojanPwd = env.TROJAN_PASSWORD || trojanPwd;
            const upgradeHeader = request.headers.get('Upgrade');
            sha224Password = sha256.sha224(trojanPwd);
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
                            const BestPingSFA = await getSingboxConfig(env, host);
                            return new Response(JSON.stringify(BestPingSFA, null, 4), { 
                                status: 200,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8",
                                }
                            });                            
                        }
                        
                        if (client === 'clash') {
                            const BestPingClash = await getClashConfig(env, host);
                            return new Response(BestPingClash, { 
                                status: 200,
                                headers: {
                                    "Content-Type": "text/plain;charset=utf-8",
                                }
                            });                            
                        }

                        const normalConfigs = await getNormalConfigs(env, host, client);
                        return new Response(normalConfigs, { 
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8",
                            }
                        });                        

                    case `/fragsub/${userID}`:

                        let fragConfigs = await getFragmentConfigs(env, host, 'v2ray');
                        fragConfigs = fragConfigs.map(config => config.config);

                        return new Response(JSON.stringify(fragConfigs, null, 4), { 
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8",
                            }
                        });

                    case `/warpsub/${userID}`:

                        const warpConfig = await getWarpConfigs(env, client);
                        return new Response(JSON.stringify(warpConfig, null, 4), { 
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8",
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
                            await updateDataset(env, formData);

                            return new Response('Success', { status: 200 });
                        }
                        
                        if (pwd && !isAuth) return Response.redirect(`${url.origin}/login`, 302);
                        const proxySettings = await env.bpb.get('proxySettings', {type: 'json'});
                        const isUpdated = panelVersion === proxySettings?.panelVersion;
                        if (!proxySettings || !isUpdated) await updateDataset(env);
                        const fragConfs = await getFragmentConfigs(env, host, 'nekoray');
                        const homePage = await renderHomePage(env, host, fragConfs);

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
    if (password !== sha224Password) {
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
            : trojanRemoteSocketToWS(tcpSocket2, webSocket, null, log);
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

async function getNormalConfigs(env, hostName, client) {
    let proxySettings = {};
    let vlessConfs = '';
    let trojanConfs = '';

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting normal configs - ${error}`);
    }

    const { cleanIPs, proxyIP, ports, vlessConfigs, trojanConfigs } = proxySettings;
    const resolved = await resolveDNS(hostName);
    const Addresses = [
        hostName,
        'www.speedtest.net',
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...(cleanIPs ? cleanIPs.split(',') : [])
    ];

    ports.forEach(port => {
        Addresses.forEach((addr, index) => {
            const sni = randomUpperCase(hostName);
            const alpn = client === 'singbox' ? 'http/1.1' : 'h2,http/1.1';
            const earlyData = client === 'singbox' 
                ? '&eh=Sec-WebSocket-Protocol&ed=2560' 
                : encodeURIComponent('?ed=2560');
            const path = `${getRandomPath(16)}${proxyIP ? `/${encodeURIComponent(btoa(proxyIP))}` : ''}${earlyData}`;
            const vlessRemark = encodeURIComponent(generateRemark(index, port, 'VLESS', false));
            const trojanRemark = encodeURIComponent(generateRemark(index, port, 'Trojan', false));
            const tlsFields = defaultHttpsPorts.includes(port) 
                ? `&security=tls&sni=${sni}&fp=randomized&alpn=${alpn}`
                : '&security=none';

            if (vlessConfigs) {
                vlessConfs += `${atob('dmxlc3M')}://${userID}@${addr}:${port}?path=/${path}&encryption=none&host=${hostName}&type=ws${tlsFields}#${vlessRemark}\n`; 
            }

            if (trojanConfigs) {
                trojanConfs += `${atob('dHJvamFu')}://${trojanPwd}@${addr}:${port}?path=/tr${path}&host=${hostName}&type=ws${tlsFields}#${trojanRemark}\n`;
            }
        });
    });

    return btoa(vlessConfs + trojanConfs);
}

function generateRemark(index, port, protocol, fragType) {
    let remark = '';
    const type = fragType ? ' F' : '';
    switch (index) {
        case 0:
        case 1:
            remark = `💦 BPB ${protocol}${type} - Domain ${index + 1} : ${port}`;
            break;
        case 2:
        case 3:
            remark = `💦 BPB ${protocol}${type} - IPv4 ${index - 1} : ${port}`;
            break;
        case 4:
        case 5:
            remark = `💦 BPB ${protocol}${type} - IPv6 ${index - 3} : ${port}`;
            break;
        default:
            remark = `💦 BPB ${protocol}${type} - Clean IP ${index - 5} : ${port}`;
            break;
    }

    return remark;
}

async function extractVlessParams(vlessConfig) {
    const url = new URL(vlessConfig.replace('vless', 'http'));
    const params = new URLSearchParams(url.search);
    let configParams = {
        uuid : url.username,
        hostName : url.hostname,
        port : url.port
    };

    params.forEach( (value, key) => {
        configParams[key] = value;
    })

    return JSON.stringify(configParams);
}

async function buildProxyOutbound(proxyParams) {
    const { hostName, port, uuid, flow, security, type, sni, fp, alpn, pbk, sid, spx, headerType, host, path, authority, serviceName, mode } = proxyParams;
    let proxyOutbound = structuredClone(xrayVLESSOutboundTemp);   
    proxyOutbound.settings.vnext[0].address = hostName;
    proxyOutbound.settings.vnext[0].port = +port;
    proxyOutbound.settings.vnext[0].users[0].id = uuid;
    proxyOutbound.settings.vnext[0].users[0].flow = flow;
    proxyOutbound.streamSettings.security = security;
    proxyOutbound.streamSettings.network = type;
    proxyOutbound.tag = "out";
    proxyOutbound.streamSettings.sockopt.dialerProxy = "proxy";

    switch (security) {

        case 'tls':
            proxyOutbound.streamSettings.tlsSettings.serverName = sni;
            proxyOutbound.streamSettings.tlsSettings.fingerprint = fp;
            proxyOutbound.streamSettings.tlsSettings.alpn = alpn ? alpn?.split(',') : [];
            delete proxyOutbound.streamSettings.realitySettings;         
            break;

        case 'reality':
            proxyOutbound.streamSettings.realitySettings.publicKey = pbk;
            proxyOutbound.streamSettings.realitySettings.shortId = sid;
            proxyOutbound.streamSettings.realitySettings.serverName = sni;
            proxyOutbound.streamSettings.realitySettings.fingerprint = fp;
            proxyOutbound.streamSettings.realitySettings.spiderX = spx;
            delete proxyOutbound.mux;
            delete proxyOutbound.streamSettings.tlsSettings;
            break;

        default:
            delete proxyOutbound.streamSettings.tlsSettings;
            delete proxyOutbound.streamSettings.realitySettings;         
            break;
    }
 
    switch (type) {

        case 'tcp':
            delete proxyOutbound.streamSettings.grpcSettings;
            delete proxyOutbound.streamSettings.wsSettings;
            
            if (security === 'reality' && (!headerType || headerType === 'none')) {
                delete proxyOutbound.streamSettings.tcpSettings;
                break;
            }

            if (headerType === 'http') {
                proxyOutbound.streamSettings.tcpSettings.header.request.headers.Host = host?.split(',');
                proxyOutbound.streamSettings.tcpSettings.header.request.path = path?.split(',');
            } 
            
            if (!headerType) {
                proxyOutbound.streamSettings.tcpSettings.header.type = 'none';
                delete proxyOutbound.streamSettings.tcpSettings.header.request;
                delete proxyOutbound.streamSettings.tcpSettings.header.response;
            }
            
            break;

        case 'ws':
            proxyOutbound.streamSettings.wsSettings.headers.Host = host;
            proxyOutbound.streamSettings.wsSettings.path = path;
            delete proxyOutbound.streamSettings.grpcSettings;
            delete proxyOutbound.streamSettings.tcpSettings;
            break;

        case 'grpc':  
            proxyOutbound.streamSettings.grpcSettings.authority = authority;
            proxyOutbound.streamSettings.grpcSettings.serviceName = serviceName;
            proxyOutbound.streamSettings.grpcSettings.multiMode = mode === 'multi';
            delete proxyOutbound.mux;
            delete proxyOutbound.streamSettings.tcpSettings;
            delete proxyOutbound.streamSettings.wsSettings;
            break;

        default:
            break;
    }
    
    return proxyOutbound;
}

async function buildWorkerLessConfig(env, client) {
    let proxySettings = {};

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while generating WorkerLess config - ${error}`);
    }

    const { 
		remoteDNS, 
		localDNS, 
		lengthMin,  
		lengthMax,  
		intervalMin,  
		intervalMax, 
		blockAds, 
		bypassIran, 
		blockPorn, 
		bypassLAN, 
		bypassChina, 
		blockUDP443 
	} = proxySettings;  

    let fakeOutbound = structuredClone(xrayVLESSOutboundTemp);
    delete fakeOutbound.mux;
    fakeOutbound.settings.vnext[0].address = 'google.com';
    fakeOutbound.settings.vnext[0].users[0].id = userID;
    delete fakeOutbound.streamSettings.sockopt;
    fakeOutbound.streamSettings.tlsSettings.serverName = 'google.com';
    fakeOutbound.streamSettings.wsSettings.headers.Host = 'google.com';
    fakeOutbound.streamSettings.wsSettings.path = '/';
    delete fakeOutbound.streamSettings.grpcSettings;
    delete fakeOutbound.streamSettings.tcpSettings;
    delete fakeOutbound.streamSettings.realitySettings;
    fakeOutbound.tag = 'fake-outbound';

    let fragConfig = structuredClone(xrayConfigTemp);
    fragConfig.remarks  = '💦 BPB Frag - WorkerLess ⭐'
    fragConfig.dns = await buildDNSObject('https://cloudflare-dns.com/dns-query', localDNS, blockAds, bypassIran, bypassChina, blockPorn, true);
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
    fragConfig.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false, true);
    delete fragConfig.routing.balancers;
    delete fragConfig.observatory;

    if (client === 'nekoray') {
        fragConfig.inbounds[0].port = 2080;
        fragConfig.inbounds[1].port = 2081;
    }

    return fragConfig;
}

async function getFragmentConfigs(env, hostName, client) {
    let Configs = [];
    let outbounds = [];
    let proxySettings = {};
    let proxyOutbound;
    let proxyIndex = 1;
    let outbound;
    const bestFragValues = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', 
                            '70-80', '80-90', '90-100', '10-30', '20-40', '30-50', 
                            '40-60', '50-70', '60-80', '70-90', '80-100', '100-200']

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
        trojanConfigs
    } = proxySettings;

    const resolved = await resolveDNS(hostName);
    const Addresses = [
        hostName,
        "www.speedtest.net",
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...(cleanIPs ? cleanIPs.split(",") : [])
    ];

    if (outProxy) {
        const proxyParams = JSON.parse(outProxyParams);
        try {
            proxyOutbound = await buildProxyOutbound(proxyParams);
        } catch (error) {
            console.log('An error occured while parsing chain proxy: ', error);
            proxyOutbound = undefined;
            await env.bpb.put("proxySettings", JSON.stringify({
                ...proxySettings, 
                outProxy: '',
                outProxyParams: ''}));
        }
    }

    for (let i = 0; i < 2; i++) {
        for (let portIndex in ports.filter(port => defaultHttpsPorts.includes(port))) {
            let port = +ports[portIndex];
            for (let index in Addresses) {
                let fragConfig = structuredClone(xrayConfigTemp);
                let addr = Addresses[index];
                let remark;

                if (i === 0 && vlessConfigs) {
                    outbound = structuredClone(xrayVLESSOutboundTemp);
                    remark = generateRemark(+index, port, 'VLESS', true);
                    delete outbound.streamSettings.grpcSettings;
                    delete outbound.streamSettings.realitySettings;
                    delete outbound.streamSettings.tcpSettings;
                    delete outbound.mux;
                    outbound.settings.vnext[0].address = addr;
                    outbound.settings.vnext[0].port = port;
                    outbound.settings.vnext[0].users[0].id = userID;
                    outbound.streamSettings.wsSettings.path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}?ed=2560`;
                }
                
                if (i === 1 && trojanConfigs) {
                    outbound = structuredClone(xrayTrojanOutboundTemp);
                    remark = generateRemark(+index, port, 'Trojan', true);
                    delete outbound.mux;
                    outbound.settings.servers[0].address = addr;
                    outbound.settings.servers[0].port = port;
                    outbound.settings.servers[0].password = trojanPwd;
                    outbound.streamSettings.wsSettings.path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}?ed=2560`;
                }
                
                outbound.streamSettings.tlsSettings.serverName = randomUpperCase(hostName);
                outbound.streamSettings.wsSettings.headers.Host = randomUpperCase(hostName);
                fragConfig.remarks = remark;
                fragConfig.dns = await buildDNSObject(remoteDNS, localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
                fragConfig.outbounds[0].settings.fragment.length = `${lengthMin}-${lengthMax}`;
                fragConfig.outbounds[0].settings.fragment.interval = `${intervalMin}-${intervalMax}`;
                fragConfig.outbounds[0].settings.fragment.packets = fragmentPackets;
                
                if (proxyOutbound) {
                    fragConfig.outbounds = [{...proxyOutbound}, { ...outbound}, ...fragConfig.outbounds];
                    fragConfig.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, true, false);
                } else {
                    fragConfig.outbounds = [{ ...outbound}, ...fragConfig.outbounds];
                    fragConfig.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false);
                }
                
                delete fragConfig.observatory;
                delete fragConfig.routing.balancers;
    
                if (client === 'nekoray') {
                    fragConfig.inbounds[0].port = 2080;
                    fragConfig.inbounds[1].port = 2081;
                    fragConfig.inbounds[2].port = 6450;
                }
                            
                Configs.push({
                    address: remark,
                    config: fragConfig
                }); 
    
                outbound.tag = `prox_${proxyIndex}`;
            
                if (proxyOutbound) {
                    let proxyOut = structuredClone(proxyOutbound);
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

    let bestPing = structuredClone(xrayConfigTemp);
    bestPing.remarks = '💦 BPB Frag - Best Ping 💥';
    bestPing.dns = await buildDNSObject(remoteDNS, localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
    bestPing.outbounds[0].settings.fragment.length = `${lengthMin}-${lengthMax}`;
    bestPing.outbounds[0].settings.fragment.interval = `${intervalMin}-${intervalMax}`;
    bestPing.outbounds[0].settings.fragment.packets = fragmentPackets;
    bestPing.outbounds = [...outbounds, ...bestPing.outbounds];
    
    if (proxyOutbound) {
        bestPing.observatory.subjectSelector = ["out"];
        bestPing.routing.balancers[0].selector = ["out"];
        bestPing.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, true, true);
    } else {
        bestPing.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, true);
    }

    if (client === 'nekoray') {
        bestPing.inbounds[0].port = 2080;
        bestPing.inbounds[1].port = 2081;
        bestPing.inbounds[2].port = 6450;
    }

    let bestFragment = structuredClone(xrayConfigTemp);
    bestFragment.remarks = '💦 BPB Frag - Best Fragment 😎';
    bestFragment.dns = await buildDNSObject(remoteDNS, localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
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
                tag: proxyOutbound ? "out" : "proxy"
            }
        });
    });

    let bestFragmentOutbounds = structuredClone([{...outbounds[0]}, {...outbounds[1]}]);  
    bestFragmentOutbounds[0].settings.vnext[0].port = 443;
    
    if (proxyOutbound) {
        bestFragmentOutbounds[0].streamSettings.sockopt.dialerProxy = 'proxy';
        delete bestFragmentOutbounds[1].streamSettings.sockopt.dialerProxy;
        bestFragmentOutbounds[0].tag = 'out';
        bestFragmentOutbounds[1].tag = 'proxy';
        bestFragment.outbounds = [bestFragmentOutbounds[0], bestFragmentOutbounds[1], ...bestFragment.outbounds];
        bestFragment.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, true, true);
    } else {
        delete bestFragmentOutbounds[0].streamSettings.sockopt.dialerProxy;
        bestFragmentOutbounds[0].tag = 'proxy';
        bestFragment.outbounds = [bestFragmentOutbounds[0], ...bestFragment.outbounds];
        bestFragment.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, true);
    }

    bestFragment.observatory.subjectSelector = ["frag"];
    bestFragment.observatory.probeInterval = '30s';
    bestFragment.routing.balancers[0].selector = ["frag"];

    if (client === 'nekoray') {
        bestFragment.inbounds[0].port = 2080;
        bestFragment.inbounds[1].port = 2081;
        bestFragment.inbounds[2].port = 6450;
    }

    const workerLessConfig = await buildWorkerLessConfig(env, client); 
    Configs.push(
        { address: 'Best-Ping', config: bestPing}, 
        { address: 'Best-Fragment', config: bestFragment}, 
        { address: 'WorkerLess', config: workerLessConfig}
    );

    return Configs;
}

async function getSingboxConfig (env, hostName) {
    let proxySettings = {};
    let outboundDomains = [];
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9][a-zA-Z0-9-]{0,62}\.[a-zA-Z]{2,11}$/;
    
    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting sing-box configs - ${error}`);
    }

    const { remoteDNS,  localDNS, cleanIPs, proxyIP, ports, vlessConfigs, trojanConfigs } = proxySettings
    let config = structuredClone(singboxConfigTemp);
    let outbound;
    let remark;
    config.dns.servers[0].address = remoteDNS;
    config.dns.servers[1].address = localDNS;
    const resolved = await resolveDNS(hostName);
    const Addresses = [
        hostName,
        "www.speedtest.net",
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...(cleanIPs ? cleanIPs.split(",") : [])
    ];

    for (let i = 0; i < 2; i++) {
        ports.forEach(port => {
            Addresses.forEach((addr, index) => {
    
                if (i === 0 && vlessConfigs) {
                    outbound = structuredClone(singboxVLESSOutboundTemp);
                    remark = generateRemark(index, port, 'VLESS', false);
                    outbound.uuid = userID;
                    outbound.transport.path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    
                }
                
                if (i === 1 && trojanConfigs) {
                    outbound = structuredClone(singboxTrojanOutboundTemp);
                    remark = generateRemark(index, port, 'Trojan', false);
                    outbound.password = trojanPwd;
                    outbound.transport.path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                }

                outbound.server = addr;
                outbound.tag = remark;
                outbound.server_port = +port;
                outbound.transport.headers.Host = randomUpperCase(hostName);
                defaultHttpsPorts.includes(port)
                    ? outbound.tls.server_name = randomUpperCase(hostName)
                    : delete outbound.tls;
                config.outbounds.push(outbound);
                config.outbounds[0].outbounds.push(remark);
                config.outbounds[1].outbounds.push(remark);
                if (domainRegex.test(outbound.server)) outboundDomains.push(outbound.server);
            });
        });
    }

    config.dns.rules[0].domain = [...config.dns.rules[0].domain, ...new Set(outboundDomains)];

    return config;
}

async function getWarpConfigs (env, client) {
    let proxySettings = {};
    let warpConfigs = [];
    let xrayWarpConfigs = [];
    let xrayWarpConfig = structuredClone(xrayConfigTemp);
    let xrayWarpBestPing = structuredClone(xrayConfigTemp);
    let xrayWoWConfigTemp = structuredClone(xrayConfigTemp);
    let singboxWarpConfig = structuredClone(singboxConfigTemp);
    let outboundDomains = [];
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9][a-zA-Z0-9-]{0,62}\.[a-zA-Z]{2,11}$/;
    
    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
        warpConfigs = await env.bpb.get('warpConfigs', {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting fragment configs - ${error}`);
    }
    
    const { localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, wowEndpoint, warpEndpoints } = proxySettings;
    const {xray: xrayWarpOutbounds, singbox: singboxWarpOutbounds} = await buildWarpOutbounds(env, client, proxySettings, warpConfigs);
    const {xray: xrayWoWOutbounds, singbox: singboxWoWOutbounds} = await buildWoWOutbounds(env, client, proxySettings, warpConfigs); 
    
    singboxWarpConfig.outbounds[0].outbounds = [client === 'hiddify' ? '💦 Warp Pro Best Ping 🚀' : '💦 Warp Best Ping 🚀'];
    singboxWarpConfig.outbounds[1].tag = client === 'hiddify' ? '💦 Warp Pro Best Ping 🚀' : '💦 Warp Best Ping 🚀';
    singboxWarpConfig.dns.servers[0].address = '1.1.1.1';
    xrayWarpConfig.dns = await buildDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
    xrayWarpConfig.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false);
    xrayWarpConfig.outbounds.splice(0,1);
    xrayWarpConfig.routing.rules[xrayWarpConfig.routing.rules.length - 1].outboundTag = 'warp';
    delete xrayWarpConfig.observatory;
    delete xrayWarpConfig.routing.balancers;
    xrayWarpBestPing.remarks = client === 'nikang' ? '💦 BPB - Warp Pro Best Ping 🚀' : '💦 BPB - Warp Best Ping 🚀';
    xrayWarpBestPing.dns = await buildDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
    xrayWarpBestPing.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, true);
    xrayWarpBestPing.outbounds.splice(0,1);
    xrayWarpBestPing.routing.balancers[0].selector = ['warp'];
    xrayWarpBestPing.observatory.subjectSelector = ['warp'];
    xrayWoWConfigTemp.dns = await buildDNSObject('1.1.1.1', localDNS, blockAds, bypassIran, bypassChina, blockPorn, false);
    xrayWoWConfigTemp.routing.rules = buildRoutingRules(localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, false, false);
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

    xrayWarpBestPing.outbounds = [...xrayWarpOutbounds, ...xrayWarpBestPing.outbounds];
    xrayWarpConfigs.push(xrayWarpBestPing);
    
    singboxWarpOutbounds.forEach((outbound, index) => {
        singboxWarpConfig.outbounds.push(outbound);
        singboxWarpConfig.outbounds[0].outbounds.push(outbound.tag);
        singboxWarpConfig.outbounds[1].outbounds.push(outbound.tag);
        if (domainRegex.test(outbound.server)) outboundDomains.push(outbound.server);
    });

    singboxWoWOutbounds.forEach((outbound, index) => {
        if (outbound.tag.includes('WoW')) {
            singboxWarpConfig.outbounds.push(singboxWoWOutbounds[index], singboxWoWOutbounds[index + 1]);
            singboxWarpConfig.outbounds[0].outbounds.push(outbound.tag);
            if (domainRegex.test(outbound.server)) outboundDomains.push(outbound.server);
        }
    });
    
    singboxWarpConfig.dns.rules[0].domain = [...new Set(outboundDomains)]; 

    return client === 'singbox' || client === 'hiddify' 
        ? singboxWarpConfig 
        : xrayWarpConfigs;
}

async function buildWarpOutbounds (env, client, proxySettings, warpConfigs) {
    let xrayOutboundTemp = structuredClone(xrayWgOutboundTemp);
    let singboxOutbound = structuredClone(singboxWgOutboundTemp);
    let xrayOutbounds = [];
    let singboxOutbounds = [];
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;

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

    xrayOutboundTemp.settings.address = [
        `${warpConfigs[0].account.config.interface.addresses.v4}/32`,
        `${warpConfigs[0].account.config.interface.addresses.v6}/128`
    ];

    xrayOutboundTemp.settings.peers[0].publicKey = warpConfigs[0].account.config.peers[0].public_key;
    xrayOutboundTemp.settings.reserved = base64ToDecimal(warpConfigs[0].account.config.client_id);
    xrayOutboundTemp.settings.secretKey = warpConfigs[0].privateKey;
    
    if (client === 'nikang') xrayOutboundTemp.settings = {
        ...xrayOutboundTemp.settings,
        wnoise: nikaNGNoiseMode,
        wnoisecount: `${noiseCountMin}-${noiseCountMax}`,
        wpayloadsize: `${noiseSizeMin}-${noiseSizeMax}`,
        wnoisedelay: `${noiseDelayMin}-${noiseDelayMax}`
    };

    delete xrayOutboundTemp.streamSettings;
    
    singboxOutbound.local_address = [
        `${warpConfigs[0].account.config.interface.addresses.v4}/32`,
        `${warpConfigs[0].account.config.interface.addresses.v6}/128`
    ];

    singboxOutbound.peer_public_key = warpConfigs[0].account.config.peers[0].public_key;
    singboxOutbound.reserved = warpConfigs[0].account.config.client_id;
    singboxOutbound.private_key = warpConfigs[0].privateKey;
    
    if (client === 'hiddify') singboxOutbound = {
        ...singboxOutbound,
        fake_packets_mode: hiddifyNoiseMode,
        fake_packets: `${noiseCountMin}-${noiseCountMax}`,
        fake_packets_size: `${noiseSizeMin}-${noiseSizeMax}`,
        fake_packets_delay: `${noiseDelayMin}-${noiseDelayMax}`
    };

    delete singboxOutbound.detour;
    
    warpEndpoints.split(',').forEach( (endpoint, index) => {
        let xrayOutbound = structuredClone(xrayOutboundTemp);
        xrayOutbound.settings.peers[0].endpoint = endpoint;
        xrayOutbound.tag = `warp-${index + 1}`;        
        xrayOutbounds.push(xrayOutbound);
        
        singboxOutbounds.push({
            ...singboxOutbound,
            server: endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0],
            server_port: endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1],
            tag: client === 'hiddify' ? `💦 Warp Pro ${index + 1} 🇮🇷` : `💦 Warp ${index + 1} 🇮🇷`
        });
    })
    
    return {xray: xrayOutbounds, singbox: singboxOutbounds};
}

async function buildWoWOutbounds (env, client, proxySettings, warpConfigs) {
    let xrayOutbounds = [];
    let singboxOutbounds = [];
    const ipv6Regex = /\[(.*?)\]/;
    const portRegex = /[^:]*$/;
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
            let xrayOutbound = structuredClone(xrayWgOutboundTemp);
            let singboxOutbound = structuredClone(singboxWgOutboundTemp);
            xrayOutbound.settings.address = [
                `${warpConfigs[i].account.config.interface.addresses.v4}/32`,
                `${warpConfigs[i].account.config.interface.addresses.v6}/128`
            ];
    
            xrayOutbound.settings.peers[0].endpoint = endpoint;
            xrayOutbound.settings.peers[0].publicKey = warpConfigs[i].account.config.peers[0].public_key;
            xrayOutbound.settings.reserved = base64ToDecimal(warpConfigs[i].account.config.client_id);
            xrayOutbound.settings.secretKey = warpConfigs[i].privateKey;
            
            if (client === 'nikang' && i === 1) xrayOutbound.settings = {
                ...xrayOutbound.settings,
                wnoise: nikaNGNoiseMode,
                wnoisecount: `${noiseCountMin}-${noiseCountMax}`,
                wpayloadsize: `${noiseSizeMin}-${noiseSizeMax}`,
                wnoisedelay: `${noiseDelayMin}-${noiseDelayMax}`
            };

            xrayOutbound.tag = i === 1 ? `warp-ir_${index + 1}` : `warp-out_${index + 1}`;   
            
            if (i === 1) {
                delete xrayOutbound.streamSettings;
            } else {
                xrayOutbound.streamSettings.sockopt.dialerProxy = `warp-ir_${index + 1}`;
            }
    
            xrayOutbounds.push(xrayOutbound);
    
            singboxOutbound.local_address = [
                `${warpConfigs[i].account.config.interface.addresses.v4}/32`,
                `${warpConfigs[i].account.config.interface.addresses.v6}/128`
            ];
    
            singboxOutbound.server = endpoint.includes('[') ? endpoint.match(ipv6Regex)[1] : endpoint.split(':')[0];
            singboxOutbound.server_port = endpoint.includes('[') ? +endpoint.match(portRegex)[0] : +endpoint.split(':')[1];    
            singboxOutbound.peer_public_key = warpConfigs[i].account.config.peers[0].public_key;
            singboxOutbound.reserved = warpConfigs[i].account.config.client_id;
            singboxOutbound.private_key = warpConfigs[i].privateKey;
            
            if (client === 'hiddify' && i === 1) singboxOutbound = {
                ...singboxOutbound,
                fake_packets_mode: hiddifyNoiseMode,
                fake_packets: `${noiseCountMin}-${noiseCountMax}`,
                fake_packets_size: `${noiseSizeMin}-${noiseSizeMax}`,
                fake_packets_delay: `${noiseDelayMin}-${noiseDelayMax}`
            };

            singboxOutbound.tag = i === 1 
				? `warp-ir_${index + 1}` 
				: client === 'hiddify' 
					? `💦 WoW Pro ${index + 1} 🌍` 
					: `💦 WoW ${index + 1} 🌍`;    
            
            if (i === 0) {
                singboxOutbound.detour = `warp-ir_${index + 1}`;
            } else {
                delete singboxOutbound.detour;
            }
    
            singboxOutbounds.push(singboxOutbound);
        }

    })

    return {xray: xrayOutbounds, singbox: singboxOutbounds};
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

async function buildDNSObject (remoteDNS, localDNS, blockAds, bypassIran, bypassChina, blockPorn, isWorkerLess) {

    const dohPattern = /^(?:[a-zA-Z]+:\/\/)?([^:\/\s?]+)/;
    const domainPattern = /^(?!\-)(?:[A-Za-z0-9\-]{1,63}\.?)+[A-Za-z]{2,}$/;

    const dohHost = remoteDNS.match(dohPattern)[1];
    const isDomain = domainPattern.test(dohHost);
    
    let dnsObject = {
        hosts: {
            "domain:googleapis.cn": ["googleapis.com"]
        },
        servers: [
            remoteDNS,
            "1.1.1.2",
            {
                address: localDNS,
                domains: [],
                port: 53,
            },
        ],
        tag: "dns",
    };

    if (dohHost && isDomain && !isWorkerLess) {
        const resolvedDOH = await resolveDNS(dohHost);
        dnsObject.hosts[dohHost] = [
            ...resolvedDOH.ipv4, 
            ...resolvedDOH.ipv6 
        ];        
    }

    if (isWorkerLess) {
        const resolvedDOH = await resolveDNS(dohHost);
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

    if (!(bypassIran || bypassChina) || localDNS === 'localhost' || isWorkerLess) {
        dnsObject.servers.pop();
    } else {
        bypassIran && dnsObject.servers[2].domains.push("geosite:category-ir", "domain:.ir"); 
        bypassChina && dnsObject.servers[2].domains.push("geosite:cn");         
    }

    return dnsObject;
}

function buildRoutingRules (localDNS, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, isChain, isBalancer, isWorkerLess) {
    let rules = [
        {
            inboundTag: ["dns-in"],
            outboundTag: "dns-out",
            type: "field"
        },
        {
          ip: [localDNS],
          outboundTag: "direct",
          port: "53",
          type: "field",
        }
    ];

    if (localDNS === 'localhost' || isWorkerLess) {
        rules.pop();
    }

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
        
        bypassLAN && ipRule.ip.push("geoip:private");

        if ((bypassIran || bypassChina) && !isWorkerLess) {
            bypassIran && domainRule.domain.push("geosite:category-ir", "domain:.ir");
            bypassIran && ipRule.ip.push("geoip:ir");
            bypassChina && domainRule.domain.push("geosite:cn");
            bypassChina && ipRule.ip.push("geoip:cn");
            rules.push(domainRule);
        }

        rules.push(ipRule);
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

    blockUDP443 && rules.push({
        network: "udp",
        port: "443",
        outboundTag: "block",
        type: "field",
    }) 
   
    if (isBalancer) {
        rules.push({
            balancerTag: "all",
            type: "field",
            ip: [
                "0.0.0.0/0",
                "::/0"
            ]
        });
    } else  {
        rules.push({
            outboundTag: isChain ? "out" : isWorkerLess ? "fragment" : "proxy",
            type: "field",
            ip: [
                "0.0.0.0/0",
                "::/0"
            ]
        });
    }

    return rules;
}

function base64ToDecimal (base64) {
    const binaryString = atob(base64);
    const hexString = Array.from(binaryString).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const decimalArray = hexString.match(/.{2}/g).map(hex => parseInt(hex, 16));
    return decimalArray;
}

async function updateDataset (env, Settings) {
    let currentProxySettings = {};

    try {
        currentProxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting current values - ${error}`);
    }

    const vlessConfig = Settings?.get('outProxy');

    const proxySettings = {
        remoteDNS: Settings ? Settings.get('remoteDNS') : currentProxySettings?.remoteDNS || 'https://94.140.14.14/dns-query',
        localDNS: Settings ? Settings.get('localDNS') : currentProxySettings?.localDNS || '8.8.8.8',
        lengthMin: Settings ? Settings.get('fragmentLengthMin') : currentProxySettings?.lengthMin || '100',
        lengthMax: Settings ? Settings.get('fragmentLengthMax') : currentProxySettings?.lengthMax || '200',
        intervalMin: Settings ? Settings.get('fragmentIntervalMin') : currentProxySettings?.intervalMin || '5',
        intervalMax: Settings ? Settings.get('fragmentIntervalMax') : currentProxySettings?.intervalMax || '10',
        fragmentPackets: Settings ? Settings.get('fragmentPackets') : currentProxySettings?.fragmentPackets || 'tlshello',
        blockAds: Settings ? Settings.get('block-ads') : currentProxySettings?.blockAds || false,
        bypassIran: Settings ? Settings.get('bypass-iran') : currentProxySettings?.bypassIran || false,
        blockPorn: Settings ? Settings.get('block-porn') : currentProxySettings?.blockPorn || false,
        bypassLAN: Settings ? Settings.get('bypass-lan') : currentProxySettings?.bypassLAN || false,
        bypassChina: Settings ? Settings.get('bypass-china') : currentProxySettings?.bypassChina || false,
        blockUDP443: Settings ? Settings.get('block-udp-443') : currentProxySettings?.blockUDP443 || false,
        cleanIPs: Settings ? Settings.get('cleanIPs')?.replaceAll(' ', '') : currentProxySettings?.cleanIPs || '',
        proxyIP: Settings ? Settings.get('proxyIP') : currentProxySettings?.proxyIP || '',
        ports: Settings ? Settings.getAll('ports[]') : currentProxySettings?.ports || ['443'],
        vlessConfigs: Settings ? Settings.get('vlessConfigs') : currentProxySettings?.vlessConfigs || true,
        trojanConfigs: Settings ? Settings.get('trojanConfigs') : currentProxySettings?.trojanConfigs || false,
        outProxy: Settings ? vlessConfig : currentProxySettings?.outProxy || '',
        outProxyParams: vlessConfig ? await extractVlessParams(vlessConfig) : currentProxySettings?.outProxyParams || '',
        wowEndpoint: Settings ? Settings.get('wowEndpoint')?.replaceAll(' ', '') : currentProxySettings?.wowEndpoint || 'engage.cloudflareclient.com:2408',
        warpEndpoints: Settings ? Settings.get('warpEndpoints')?.replaceAll(' ', '') : currentProxySettings?.warpEndpoints || 'engage.cloudflareclient.com:2408',
        hiddifyNoiseMode: Settings ? Settings.get('hiddifyNoiseMode') : currentProxySettings?.hiddifyNoiseMode || 'm4',
        nikaNGNoiseMode: Settings ? Settings.get('nikaNGNoiseMode') : currentProxySettings?.nikaNGNoiseMode || 'quic',
        noiseCountMin: Settings ? Settings.get('noiseCountMin') : currentProxySettings?.noiseCountMin || '10',
        noiseCountMax: Settings ? Settings.get('noiseCountMax') : currentProxySettings?.noiseCountMax || '15',
        noiseSizeMin: Settings ? Settings.get('noiseSizeMin') : currentProxySettings?.noiseSizeMin || '5',
        noiseSizeMax: Settings ? Settings.get('noiseSizeMax') : currentProxySettings?.noiseSizeMax || '10',
        noiseDelayMin: Settings ? Settings.get('noiseDelayMin') : currentProxySettings?.noiseDelayMin || '1',
        noiseDelayMax: Settings ? Settings.get('noiseDelayMax') : currentProxySettings?.noiseDelayMax || '1',
        warpPlusLicense: Settings ? Settings.get('warpPlusLicense') : currentProxySettings?.warpPlusLicense || '',
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
    let activeProtocols = 0;
    
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
        warpPlusLicense
    } = proxySettings;

    const isWarpReady = warpConfigs ? true : false;
    const isPassSet = password ? password.length >= 8 : false;
    const isWarpPlus = warpPlusLicense ? true : false;
    vlessConfigs && activeProtocols++;
    trojanConfigs && activeProtocols++;
    const genCustomConfRow = async (configs) => {
        let tableBlock = "";
        configs.forEach(config => {
            tableBlock += `
            <tr>
                <td>
                    ${config.address === 'Best-Ping' 
                        ? `<div  style="justify-content: center;"><span><b>💦 BPB Frag - Best-Ping 💥</b></span></div>` 
                        : config.address === 'WorkerLess'
                            ? `<div  style="justify-content: center;"><span><b>💦 BPB Frag - WorkerLess ⭐</b></span></div>`
                            : config.address === 'Best-Fragment'
                                ? `<div  style="justify-content: center;"><span><b>💦 BPB Frag - Best-Fragment 😎</b></span></div>`
                                : config.address
                    }
                </td>
                <td>
                    <button onclick="copyToClipboard('${encodeURIComponent(JSON.stringify(config.config, null, 4))}', true)">
                        Copy Config 
                        <span class="material-symbols-outlined">copy_all</span>
                    </button>
                </td>
            </tr>`;
        });

        return tableBlock;
    }

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
                border: 2px solid;
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
				margin-bottom: 15px;
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
            <h2>FRAGMENT SETTINGS ⚙️</h2>
			<form id="configForm">
				<div class="form-control">
					<label for="remoteDNS">🌏 Remote DNS</label>
					<input type="url" id="remoteDNS" name="remoteDNS" value="${remoteDNS}" required>
				</div>
				<div class="form-control">
					<label for="localDNS">🏚️ Local DNS</label>
					<input type="text" id="localDNS" name="localDNS" value="${localDNS}"
						pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|localhost$"
						title="Please enter a valid DNS IP Address or localhost!"  required>
				</div>	
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
				<div class="form-control">
					<label for="outProxy">✈️ Chain Proxy</label>
					<input type="text" id="outProxy" name="outProxy" value="${outProxy}">
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
                <h2>PROXY IP ⚙️</h2>
				<div class="form-control">
					<label for="proxyIP">📍 IP or Domain</label>
					<input type="text" id="proxyIP" name="proxyIP" value="${proxyIP}">
				</div>
                <h2>CLEAN IP ⚙️</h2>
				<div class="form-control">
					<label for="cleanIPs">✨ Clean IPs</label>
					<input type="text" id="cleanIPs" name="cleanIPs" value="${cleanIPs.replaceAll(",", " , ")}">
				</div>
                <div class="form-control">
                    <label>🔎 Online Scanner</label>
                    <a href="https://scanner.github1.cloud/" id="scanner" name="scanner" target="_blank">
                        <button type="button" class="button">
                            Scan now
                            <span class="material-symbols-outlined" style="margin-left: 5px;">open_in_new</span>
                        </button>
                    </a>
                </div>
                <h2>PORTS ⚙️</h2>
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
                <h2>CONFIG TYPES ⚙️</h2>
				<div class="form-control" style="margin-bottom: 20px;">			
                    <div class="routing">
                        <input type="checkbox" id="vlessConfigs" name="vlessConfigs" onchange="handleProtocolChange(event)" style="margin: 0; grid-column: 2;" value="true" ${vlessConfigs ? 'checked' : ''}>
                        <label for="vlessConfigs">VLESS</label>
                    </div>
                    <div class="routing">
						<input type="checkbox" id="trojanConfigs" name="trojanConfigs" onchange="handleProtocolChange(event)" style="margin: 0; grid-column: 2;" value="true" ${trojanConfigs ? 'checked' : ''}>
                        <label for="trojanConfigs">Trojan</label>
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
					<div style="grid-column: 2; width: 100%;">
						<input type="submit" id="applyButton" class="button disabled" value="APPLY SETTINGS 💥" form="configForm">
					</div>
				</div>
			</form>
            <hr>            
			<h2>NORMAL CONFIGS SUB 🔗</h2>
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
                                <span>Sing-box - <b>Best Ping</b></span>
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
                                <span>Clash Meta - <b>Best Ping</b></span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>Clash Verge Rev - <b>Best Ping</b></span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>v2rayN (Mihomo) - <b>Best Ping</b></span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>FlClash - <b>Best Ping</b></span>
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
                                <span>MahsaNG</span>
                            </div>
                            <div>
                                <span class="material-symbols-outlined symbol">verified</span>
                                <span>NikaNG</span>
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
                            <button onclick="openQR('https://${hostName}/warpsub/${userID}#BPB-Warp', 'Warp Subscription')" style="margin-bottom: 8px;">
                                QR Code&nbsp;<span class="material-symbols-outlined">qr_code</span>
                            </button>
                            <button onclick="copyToClipboard('https://${hostName}/warpsub/${userID}#BPB-Warp', false)">
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
            <h2>FRAGMENT - NEKORAY ⛓️</h2>
            <div class="table-container">
				<table id="custom-configs-table">
					<tr style="text-wrap: nowrap;">
						<th>Config Address</th>
						<th>Fragment Config</th>
					</tr>					
					${await genCustomConfRow(fragConfigs)}
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

		document.addEventListener('DOMContentLoaded', async () => {
            const configForm = document.getElementById('configForm');            
            const modal = document.getElementById('myModal');
            const changePass = document.getElementById("openModalBtn");
            const closeBtn = document.querySelector(".close");
            const passwordChangeForm = document.getElementById('passwordChangeForm');            
            const applyBtn = document.getElementById('applyButton');         
            const initialFormData = new FormData(configForm);
            const closeQR = document.getElementById("closeQRModal");
            let modalQR = document.getElementById("myQRModal");
            let qrcodeContainer = document.getElementById("qrcode-container");
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
                    ${isWarpPlus} ? alert('Warp configs upgraded to PLUS successfully! 😎') : alert('Warp configs updated successfully! 😎');
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
            const wowEndpoint = document.getElementById('wowEndpoint').value?.replaceAll(' ', '').split(',');
            const warpEndpoints = document.getElementById('warpEndpoints').value?.replaceAll(' ', '').split(',');
            const cleanIPs = cleanIP.value?.split(',');
            const chainProxy = document.getElementById('outProxy').value?.trim();                    
            const formData = new FormData(configForm);
            const isVless = /vless:\\/\\/[^\s@]+@[^\\s:]+:[^\\s]+/.test(chainProxy);
            const hasSecurity = /security=/.test(chainProxy);
            const validSecurityType = /security=(tls|none|reality)/.test(chainProxy);
            const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);
            const validIPDomain = /^((?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,})|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[\\](?:::[a-fA-F0-9]{1,4}){1,7}\\])$/i;
            const checkedPorts = Array.from(document.querySelectorAll('input[id^="port-"]:checked')).map(input => input.id.split('-')[1]);
            const validEndpoint = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\\[(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,7}:\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}\\]|\\[(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}\\]|\\[[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}\\]|\\[:(?::[a-fA-F0-9]{1,4}){1,7}\\]|\\[::(?::[a-fA-F0-9]{1,4}){0,7}\\]):(?:[0-9]{1,5})$/;
            checkedPorts.forEach(port => formData.append('ports[]', port));

            const invalidIPs = [...cleanIPs, proxyIP]?.filter(value => {
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

            if (lengthMin >= lengthMax || intervalMin > intervalMax) {
                alert('⛔ Minimum should be smaller or equal to Maximum! 🫤');               
                return false;
            }

            if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && chainProxy) {
                alert('⛔ Invalid Config! 🫤 \\n - The chain proxy should be VLESS!\\n - Transmission should be GRPC,WS or TCP\\n - Security should be TLS,Reality or None');               
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
                    alert('Parameters applied successfully 😎');
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
                    alert("Password changed successfully! 👍");
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

function buildClashVLESSOutbound (remark, address, port, uuid, sni, host, path) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;

    let outbound = {
        "name": remark,
        "type": "vless",
        "server": address,
        "port": +port,
        "uuid": uuid,
        "tls": tls,
        "servername": sni,
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
        outbound["servername"] = sni;
        outbound["alpn"] = ["h2", "http/1.1"];
        outbound["client-fingerprint"] = "randomized";
    }

    return `    - ${JSON.stringify(outbound)}\n`;
}

function buildClashTrojanOutbound (remark, address, port, password, sni, host, path) {
    const tls = defaultHttpsPorts.includes(port) ? true : false;

    let outbound = {
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
        }
    }

    if (tls) {
        outbound["sni"] = sni;
        outbound["alpn"] = ["h2", "http/1.1"];
        outbound["client-fingerprint"] = "randomized";
    }

    return `    - ${JSON.stringify(outbound)}\n`;
}

async function getClashConfig (env, hostName) {
    let proxySettings = {};
    let outboundDomains = [];
    let resolvedNameserver = [];
    let remark, path, nameserverPolicy;
    let outbounds = '';
    let outboundsRemarks = '';
    const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9][a-zA-Z0-9-]{0,62}\.[a-zA-Z]{2,11}$/;
    const dohPattern = /^(?:[a-zA-Z]+:\/\/)?([^:\/\s?]+)/;

    try {
        proxySettings = await env.bpb.get("proxySettings", {type: 'json'});
    } catch (error) {
        console.log(error);
        throw new Error(`An error occurred while getting sing-box configs - ${error}`);
    }

    const { remoteDNS,  localDNS, cleanIPs, proxyIP, ports, blockAds, bypassIran, blockPorn, bypassLAN, bypassChina, blockUDP443, vlessConfigs, trojanConfigs } = proxySettings;
    const DNSNameserver = remoteDNS.match(dohPattern)[1];
    const isDomain = domainPattern.test(DNSNameserver);

    if (DNSNameserver && isDomain) {
        const resolvedDOH = await resolveDNS(DNSNameserver);
        resolvedNameserver = [
            ...resolvedDOH.ipv4, 
            ...resolvedDOH.ipv6 
        ]; 
        
        nameserverPolicy = `    nameserver-policy:\n        '${DNSNameserver}':`;
        resolvedNameserver.forEach(ip => {
            nameserverPolicy += `\n            - '${ip}'`;       
        });
    } else {
        nameserverPolicy = '';
    }
    

    let sni = randomUpperCase(hostName);
    const resolved = await resolveDNS(hostName);
    const Addresses = [
        hostName,
        "www.speedtest.net",
        ...resolved.ipv4,
        ...resolved.ipv6.map((ip) => `[${ip}]`),
        ...(cleanIPs ? cleanIPs.split(",") : [])
    ];

    for (let i = 0; i < 2; i++) {
        ports.forEach(port => {
            Addresses.forEach((addr, index) => {
    
                if (i === 0 && vlessConfigs) {
                    remark = generateRemark(index, port, 'VLESS', false).replace(' : ', ' - ');
                    path = `/${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    outbounds += buildClashVLESSOutbound(remark, addr, port, userID, sni, hostName, path);
                }
                
                if (i === 1 && trojanConfigs) {
                    remark = generateRemark(index, port, 'Trojan', false).replace(' : ', ' - ');
                    path = `/tr${getRandomPath(16)}${proxyIP ? `/${btoa(proxyIP)}` : ''}`;
                    outbounds += buildClashTrojanOutbound(remark, addr, port, trojanPwd, sni, hostName, path);
                }

                outboundsRemarks += `          - ${remark}\n`;
                if (domainPattern.test(addr)) outboundDomains.push(addr);
                outboundDomains = [...new Set(outboundDomains)];
            });
        });
    }

    let fallbackFilter = '        domain:\n';
    outboundDomains.forEach(domain => {
        fallbackFilter += `            - ${domain}\n`;
    });
    if (bypassIran || bypassChina) fallbackFilter += '        geosite:\n';


    let rules = 'rules:';
    if (blockAds) rules += `\n    - GEOSITE,CATEGORY-ADS-ALL,REJECT`;
    if (blockAds) rules += `\n    - GEOSITE,CATEGORY-ADS-IR,REJECT`;
    if (bypassIran) {
        rules += `\n    - GEOSITE,CATEGORY-IR,DIRECT`;
        rules += `\n    - GEOIP,IR,DIRECT`;
        rules += `\n    - DOMAIN-KEYWORD,.ir,DIRECT`;
        fallbackFilter += '            - CATEGORY-IR\n';
    }

    if (bypassChina) {
        rules += `\n    - GEOSITE,CN,DIRECT`;
        rules += `\n    - GEOIP,CN,DIRECT`;
        fallbackFilter += '            - CN\n';
    }

    if (blockPorn) rules += `\n    - GEOSITE,CATEGORY-PORN,REJECT`;
    if (bypassLAN) rules += `\n    - GEOIP,LAN,DIRECT`;
    
    return `
port: 7890
allow-lan: true
mode: rule
log-level: info
unified-delay: true
dns:
    enable: true
    listen: :53
    ipv6: true
    enhanced-mode: fake-ip
    fake-ip-range: 198.18.0.1/16
    default-nameserver: 
        - 8.8.8.8
        - 223.5.5.5
${nameserverPolicy}
    nameserver:
        - ${remoteDNS}
    fallback:
        - ${localDNS}
        - 223.5.5.5
    fallback-filter:
        geoip: false
        ipcidr:
            - 240.0.0.0/4
            - 0.0.0.0/32
${fallbackFilter}
proxies: 
${outbounds}
proxy-groups:
    - name: 💦 Best-Ping 💥
      type: url-test
      url: https://www.gstatic.com/generate_204
      interval: 30
      tolerance: 50
      proxies:
${outboundsRemarks}
    - name: 🌍 Select
      type: select
      proxies:
          - 💦 Best-Ping 💥
          - DIRECT
          - REJECT
${outboundsRemarks}
${rules}
    - MATCH,💦 Best-Ping 💥
`;
}

/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.11.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2024
 * @license MIT
 */
/*jslint bitwise: true */

(function () {
	"use strict";

	var ERROR = "input is invalid type";
	var WINDOW = typeof window === "object";
	var root = WINDOW ? window : {};
	if (root.JS_SHA256_NO_WINDOW) {
		WINDOW = false;
	}
	var WEB_WORKER = !WINDOW && typeof self === "object";
	var NODE_JS =
		!root.JS_SHA256_NO_NODE_JS &&
		typeof process === "object" &&
		process.versions &&
		process.versions.node;
	if (NODE_JS) {
		root = global;
	} else if (WEB_WORKER) {
		root = self;
	}
	var COMMON_JS =
		!root.JS_SHA256_NO_COMMON_JS &&
		typeof module === "object" &&
		module.exports;
	var AMD = typeof define === "function" && define.amd;
	var ARRAY_BUFFER =
		!root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
	var HEX_CHARS = "0123456789abcdef".split("");
	var EXTRA = [-2147483648, 8388608, 32768, 128];
	var SHIFT = [24, 16, 8, 0];
	var K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
		0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
		0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
		0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
		0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
		0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
		0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
		0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
		0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
	];
	var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];

	var blocks = [];

	if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
		Array.isArray = function (obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
	}

	if (
		ARRAY_BUFFER &&
		(root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)
	) {
		ArrayBuffer.isView = function (obj) {
			return (
				typeof obj === "object" &&
				obj.buffer &&
				obj.buffer.constructor === ArrayBuffer
			);
		};
	}

	var createOutputMethod = function (outputType, is224) {
		return function (message) {
			return new Sha256(is224, true).update(message)[outputType]();
		};
	};

	var createMethod = function (is224) {
		var method = createOutputMethod("hex", is224);
		if (NODE_JS) {
			method = nodeWrap(method, is224);
		}
		method.create = function () {
			return new Sha256(is224);
		};
		method.update = function (message) {
			return method.create().update(message);
		};
		for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
			var type = OUTPUT_TYPES[i];
			method[type] = createOutputMethod(type, is224);
		}
		return method;
	};

	var nodeWrap = function (method, is224) {
		var crypto = require("crypto");
		var Buffer = require("buffer").Buffer;
		var algorithm = is224 ? "sha224" : "sha256";
		var bufferFrom;
		if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) {
			bufferFrom = Buffer.from;
		} else {
			bufferFrom = function (message) {
				return new Buffer(message);
			};
		}
		var nodeMethod = function (message) {
			if (typeof message === "string") {
				return crypto
					.createHash(algorithm)
					.update(message, "utf8")
					.digest("hex");
			} else {
				if (message === null || message === undefined) {
					throw new Error(ERROR);
				} else if (message.constructor === ArrayBuffer) {
					message = new Uint8Array(message);
				}
			}
			if (
				Array.isArray(message) ||
				ArrayBuffer.isView(message) ||
				message.constructor === Buffer
			) {
				return crypto
					.createHash(algorithm)
					.update(bufferFrom(message))
					.digest("hex");
			} else {
				return method(message);
			}
		};
		return nodeMethod;
	};

	var createHmacOutputMethod = function (outputType, is224) {
		return function (key, message) {
			return new HmacSha256(key, is224, true).update(message)[outputType]();
		};
	};

	var createHmacMethod = function (is224) {
		var method = createHmacOutputMethod("hex", is224);
		method.create = function (key) {
			return new HmacSha256(key, is224);
		};
		method.update = function (key, message) {
			return method.create(key).update(message);
		};
		for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
			var type = OUTPUT_TYPES[i];
			method[type] = createHmacOutputMethod(type, is224);
		}
		return method;
	};

	function Sha256(is224, sharedMemory) {
		if (sharedMemory) {
			blocks[0] =
				blocks[16] =
				blocks[1] =
				blocks[2] =
				blocks[3] =
				blocks[4] =
				blocks[5] =
				blocks[6] =
				blocks[7] =
				blocks[8] =
				blocks[9] =
				blocks[10] =
				blocks[11] =
				blocks[12] =
				blocks[13] =
				blocks[14] =
				blocks[15] =
				0;
			this.blocks = blocks;
		} else {
			this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		}

		if (is224) {
			this.h0 = 0xc1059ed8;
			this.h1 = 0x367cd507;
			this.h2 = 0x3070dd17;
			this.h3 = 0xf70e5939;
			this.h4 = 0xffc00b31;
			this.h5 = 0x68581511;
			this.h6 = 0x64f98fa7;
			this.h7 = 0xbefa4fa4;
		} else {
			// 256
			this.h0 = 0x6a09e667;
			this.h1 = 0xbb67ae85;
			this.h2 = 0x3c6ef372;
			this.h3 = 0xa54ff53a;
			this.h4 = 0x510e527f;
			this.h5 = 0x9b05688c;
			this.h6 = 0x1f83d9ab;
			this.h7 = 0x5be0cd19;
		}

		this.block = this.start = this.bytes = this.hBytes = 0;
		this.finalized = this.hashed = false;
		this.first = true;
		this.is224 = is224;
	}

	Sha256.prototype.update = function (message) {
		if (this.finalized) {
			return;
		}
		var notString,
			type = typeof message;
		if (type !== "string") {
			if (type === "object") {
				if (message === null) {
					throw new Error(ERROR);
				} else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
					message = new Uint8Array(message);
				} else if (!Array.isArray(message)) {
					if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
						throw new Error(ERROR);
					}
				}
			} else {
				throw new Error(ERROR);
			}
			notString = true;
		}
		var code,
			index = 0,
			i,
			length = message.length,
			blocks = this.blocks;
		while (index < length) {
			if (this.hashed) {
				this.hashed = false;
				blocks[0] = this.block;
				this.block =
					blocks[16] =
					blocks[1] =
					blocks[2] =
					blocks[3] =
					blocks[4] =
					blocks[5] =
					blocks[6] =
					blocks[7] =
					blocks[8] =
					blocks[9] =
					blocks[10] =
					blocks[11] =
					blocks[12] =
					blocks[13] =
					blocks[14] =
					blocks[15] =
					0;
			}

			if (notString) {
				for (i = this.start; index < length && i < 64; ++index) {
					blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
				}
			} else {
				for (i = this.start; index < length && i < 64; ++index) {
					code = message.charCodeAt(index);
					if (code < 0x80) {
						blocks[i >>> 2] |= code << SHIFT[i++ & 3];
					} else if (code < 0x800) {
						blocks[i >>> 2] |= (0xc0 | (code >>> 6)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
					} else if (code < 0xd800 || code >= 0xe000) {
						blocks[i >>> 2] |= (0xe0 | (code >>> 12)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
					} else {
						code =
							0x10000 +
							(((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
						blocks[i >>> 2] |= (0xf0 | (code >>> 18)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |=
							(0x80 | ((code >>> 12) & 0x3f)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (0x80 | ((code >>> 6) & 0x3f)) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
					}
				}
			}

			this.lastByteIndex = i;
			this.bytes += i - this.start;
			if (i >= 64) {
				this.block = blocks[16];
				this.start = i - 64;
				this.hash();
				this.hashed = true;
			} else {
				this.start = i;
			}
		}
		if (this.bytes > 4294967295) {
			this.hBytes += (this.bytes / 4294967296) << 0;
			this.bytes = this.bytes % 4294967296;
		}
		return this;
	};

	Sha256.prototype.finalize = function () {
		if (this.finalized) {
			return;
		}
		this.finalized = true;
		var blocks = this.blocks,
			i = this.lastByteIndex;
		blocks[16] = this.block;
		blocks[i >>> 2] |= EXTRA[i & 3];
		this.block = blocks[16];
		if (i >= 56) {
			if (!this.hashed) {
				this.hash();
			}
			blocks[0] = this.block;
			blocks[16] =
				blocks[1] =
				blocks[2] =
				blocks[3] =
				blocks[4] =
				blocks[5] =
				blocks[6] =
				blocks[7] =
				blocks[8] =
				blocks[9] =
				blocks[10] =
				blocks[11] =
				blocks[12] =
				blocks[13] =
				blocks[14] =
				blocks[15] =
				0;
		}
		blocks[14] = (this.hBytes << 3) | (this.bytes >>> 29);
		blocks[15] = this.bytes << 3;
		this.hash();
	};

	Sha256.prototype.hash = function () {
		var a = this.h0,
			b = this.h1,
			c = this.h2,
			d = this.h3,
			e = this.h4,
			f = this.h5,
			g = this.h6,
			h = this.h7,
			blocks = this.blocks,
			j,
			s0,
			s1,
			maj,
			t1,
			t2,
			ch,
			ab,
			da,
			cd,
			bc;

		for (j = 16; j < 64; ++j) {
			// rightrotate
			t1 = blocks[j - 15];
			s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
			t1 = blocks[j - 2];
			s1 =
				((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
			blocks[j] = (blocks[j - 16] + s0 + blocks[j - 7] + s1) << 0;
		}

		bc = b & c;
		for (j = 0; j < 64; j += 4) {
			if (this.first) {
				if (this.is224) {
					ab = 300032;
					t1 = blocks[0] - 1413257819;
					h = (t1 - 150054599) << 0;
					d = (t1 + 24177077) << 0;
				} else {
					ab = 704751109;
					t1 = blocks[0] - 210244248;
					h = (t1 - 1521486534) << 0;
					d = (t1 + 143694565) << 0;
				}
				this.first = false;
			} else {
				s0 =
					((a >>> 2) | (a << 30)) ^
					((a >>> 13) | (a << 19)) ^
					((a >>> 22) | (a << 10));
				s1 =
					((e >>> 6) | (e << 26)) ^
					((e >>> 11) | (e << 21)) ^
					((e >>> 25) | (e << 7));
				ab = a & b;
				maj = ab ^ (a & c) ^ bc;
				ch = (e & f) ^ (~e & g);
				t1 = h + s1 + ch + K[j] + blocks[j];
				t2 = s0 + maj;
				h = (d + t1) << 0;
				d = (t1 + t2) << 0;
			}
			s0 =
				((d >>> 2) | (d << 30)) ^
				((d >>> 13) | (d << 19)) ^
				((d >>> 22) | (d << 10));
			s1 =
				((h >>> 6) | (h << 26)) ^
				((h >>> 11) | (h << 21)) ^
				((h >>> 25) | (h << 7));
			da = d & a;
			maj = da ^ (d & b) ^ ab;
			ch = (h & e) ^ (~h & f);
			t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
			t2 = s0 + maj;
			g = (c + t1) << 0;
			c = (t1 + t2) << 0;
			s0 =
				((c >>> 2) | (c << 30)) ^
				((c >>> 13) | (c << 19)) ^
				((c >>> 22) | (c << 10));
			s1 =
				((g >>> 6) | (g << 26)) ^
				((g >>> 11) | (g << 21)) ^
				((g >>> 25) | (g << 7));
			cd = c & d;
			maj = cd ^ (c & a) ^ da;
			ch = (g & h) ^ (~g & e);
			t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
			t2 = s0 + maj;
			f = (b + t1) << 0;
			b = (t1 + t2) << 0;
			s0 =
				((b >>> 2) | (b << 30)) ^
				((b >>> 13) | (b << 19)) ^
				((b >>> 22) | (b << 10));
			s1 =
				((f >>> 6) | (f << 26)) ^
				((f >>> 11) | (f << 21)) ^
				((f >>> 25) | (f << 7));
			bc = b & c;
			maj = bc ^ (b & d) ^ cd;
			ch = (f & g) ^ (~f & h);
			t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
			t2 = s0 + maj;
			e = (a + t1) << 0;
			a = (t1 + t2) << 0;
			this.chromeBugWorkAround = true;
		}

		this.h0 = (this.h0 + a) << 0;
		this.h1 = (this.h1 + b) << 0;
		this.h2 = (this.h2 + c) << 0;
		this.h3 = (this.h3 + d) << 0;
		this.h4 = (this.h4 + e) << 0;
		this.h5 = (this.h5 + f) << 0;
		this.h6 = (this.h6 + g) << 0;
		this.h7 = (this.h7 + h) << 0;
	};

	Sha256.prototype.hex = function () {
		this.finalize();

		var h0 = this.h0,
			h1 = this.h1,
			h2 = this.h2,
			h3 = this.h3,
			h4 = this.h4,
			h5 = this.h5,
			h6 = this.h6,
			h7 = this.h7;

		var hex =
			HEX_CHARS[(h0 >>> 28) & 0x0f] +
			HEX_CHARS[(h0 >>> 24) & 0x0f] +
			HEX_CHARS[(h0 >>> 20) & 0x0f] +
			HEX_CHARS[(h0 >>> 16) & 0x0f] +
			HEX_CHARS[(h0 >>> 12) & 0x0f] +
			HEX_CHARS[(h0 >>> 8) & 0x0f] +
			HEX_CHARS[(h0 >>> 4) & 0x0f] +
			HEX_CHARS[h0 & 0x0f] +
			HEX_CHARS[(h1 >>> 28) & 0x0f] +
			HEX_CHARS[(h1 >>> 24) & 0x0f] +
			HEX_CHARS[(h1 >>> 20) & 0x0f] +
			HEX_CHARS[(h1 >>> 16) & 0x0f] +
			HEX_CHARS[(h1 >>> 12) & 0x0f] +
			HEX_CHARS[(h1 >>> 8) & 0x0f] +
			HEX_CHARS[(h1 >>> 4) & 0x0f] +
			HEX_CHARS[h1 & 0x0f] +
			HEX_CHARS[(h2 >>> 28) & 0x0f] +
			HEX_CHARS[(h2 >>> 24) & 0x0f] +
			HEX_CHARS[(h2 >>> 20) & 0x0f] +
			HEX_CHARS[(h2 >>> 16) & 0x0f] +
			HEX_CHARS[(h2 >>> 12) & 0x0f] +
			HEX_CHARS[(h2 >>> 8) & 0x0f] +
			HEX_CHARS[(h2 >>> 4) & 0x0f] +
			HEX_CHARS[h2 & 0x0f] +
			HEX_CHARS[(h3 >>> 28) & 0x0f] +
			HEX_CHARS[(h3 >>> 24) & 0x0f] +
			HEX_CHARS[(h3 >>> 20) & 0x0f] +
			HEX_CHARS[(h3 >>> 16) & 0x0f] +
			HEX_CHARS[(h3 >>> 12) & 0x0f] +
			HEX_CHARS[(h3 >>> 8) & 0x0f] +
			HEX_CHARS[(h3 >>> 4) & 0x0f] +
			HEX_CHARS[h3 & 0x0f] +
			HEX_CHARS[(h4 >>> 28) & 0x0f] +
			HEX_CHARS[(h4 >>> 24) & 0x0f] +
			HEX_CHARS[(h4 >>> 20) & 0x0f] +
			HEX_CHARS[(h4 >>> 16) & 0x0f] +
			HEX_CHARS[(h4 >>> 12) & 0x0f] +
			HEX_CHARS[(h4 >>> 8) & 0x0f] +
			HEX_CHARS[(h4 >>> 4) & 0x0f] +
			HEX_CHARS[h4 & 0x0f] +
			HEX_CHARS[(h5 >>> 28) & 0x0f] +
			HEX_CHARS[(h5 >>> 24) & 0x0f] +
			HEX_CHARS[(h5 >>> 20) & 0x0f] +
			HEX_CHARS[(h5 >>> 16) & 0x0f] +
			HEX_CHARS[(h5 >>> 12) & 0x0f] +
			HEX_CHARS[(h5 >>> 8) & 0x0f] +
			HEX_CHARS[(h5 >>> 4) & 0x0f] +
			HEX_CHARS[h5 & 0x0f] +
			HEX_CHARS[(h6 >>> 28) & 0x0f] +
			HEX_CHARS[(h6 >>> 24) & 0x0f] +
			HEX_CHARS[(h6 >>> 20) & 0x0f] +
			HEX_CHARS[(h6 >>> 16) & 0x0f] +
			HEX_CHARS[(h6 >>> 12) & 0x0f] +
			HEX_CHARS[(h6 >>> 8) & 0x0f] +
			HEX_CHARS[(h6 >>> 4) & 0x0f] +
			HEX_CHARS[h6 & 0x0f];
		if (!this.is224) {
			hex +=
				HEX_CHARS[(h7 >>> 28) & 0x0f] +
				HEX_CHARS[(h7 >>> 24) & 0x0f] +
				HEX_CHARS[(h7 >>> 20) & 0x0f] +
				HEX_CHARS[(h7 >>> 16) & 0x0f] +
				HEX_CHARS[(h7 >>> 12) & 0x0f] +
				HEX_CHARS[(h7 >>> 8) & 0x0f] +
				HEX_CHARS[(h7 >>> 4) & 0x0f] +
				HEX_CHARS[h7 & 0x0f];
		}
		return hex;
	};

	Sha256.prototype.toString = Sha256.prototype.hex;

	Sha256.prototype.digest = function () {
		this.finalize();

		var h0 = this.h0,
			h1 = this.h1,
			h2 = this.h2,
			h3 = this.h3,
			h4 = this.h4,
			h5 = this.h5,
			h6 = this.h6,
			h7 = this.h7;

		var arr = [
			(h0 >>> 24) & 0xff,
			(h0 >>> 16) & 0xff,
			(h0 >>> 8) & 0xff,
			h0 & 0xff,
			(h1 >>> 24) & 0xff,
			(h1 >>> 16) & 0xff,
			(h1 >>> 8) & 0xff,
			h1 & 0xff,
			(h2 >>> 24) & 0xff,
			(h2 >>> 16) & 0xff,
			(h2 >>> 8) & 0xff,
			h2 & 0xff,
			(h3 >>> 24) & 0xff,
			(h3 >>> 16) & 0xff,
			(h3 >>> 8) & 0xff,
			h3 & 0xff,
			(h4 >>> 24) & 0xff,
			(h4 >>> 16) & 0xff,
			(h4 >>> 8) & 0xff,
			h4 & 0xff,
			(h5 >>> 24) & 0xff,
			(h5 >>> 16) & 0xff,
			(h5 >>> 8) & 0xff,
			h5 & 0xff,
			(h6 >>> 24) & 0xff,
			(h6 >>> 16) & 0xff,
			(h6 >>> 8) & 0xff,
			h6 & 0xff,
		];
		if (!this.is224) {
			arr.push(
				(h7 >>> 24) & 0xff,
				(h7 >>> 16) & 0xff,
				(h7 >>> 8) & 0xff,
				h7 & 0xff
			);
		}
		return arr;
	};

	Sha256.prototype.array = Sha256.prototype.digest;

	Sha256.prototype.arrayBuffer = function () {
		this.finalize();

		var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
		var dataView = new DataView(buffer);
		dataView.setUint32(0, this.h0);
		dataView.setUint32(4, this.h1);
		dataView.setUint32(8, this.h2);
		dataView.setUint32(12, this.h3);
		dataView.setUint32(16, this.h4);
		dataView.setUint32(20, this.h5);
		dataView.setUint32(24, this.h6);
		if (!this.is224) {
			dataView.setUint32(28, this.h7);
		}
		return buffer;
	};

	function HmacSha256(key, is224, sharedMemory) {
		var i,
			type = typeof key;
		if (type === "string") {
			var bytes = [],
				length = key.length,
				index = 0,
				code;
			for (i = 0; i < length; ++i) {
				code = key.charCodeAt(i);
				if (code < 0x80) {
					bytes[index++] = code;
				} else if (code < 0x800) {
					bytes[index++] = 0xc0 | (code >>> 6);
					bytes[index++] = 0x80 | (code & 0x3f);
				} else if (code < 0xd800 || code >= 0xe000) {
					bytes[index++] = 0xe0 | (code >>> 12);
					bytes[index++] = 0x80 | ((code >>> 6) & 0x3f);
					bytes[index++] = 0x80 | (code & 0x3f);
				} else {
					code =
						0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
					bytes[index++] = 0xf0 | (code >>> 18);
					bytes[index++] = 0x80 | ((code >>> 12) & 0x3f);
					bytes[index++] = 0x80 | ((code >>> 6) & 0x3f);
					bytes[index++] = 0x80 | (code & 0x3f);
				}
			}
			key = bytes;
		} else {
			if (type === "object") {
				if (key === null) {
					throw new Error(ERROR);
				} else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
					key = new Uint8Array(key);
				} else if (!Array.isArray(key)) {
					if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
						throw new Error(ERROR);
					}
				}
			} else {
				throw new Error(ERROR);
			}
		}

		if (key.length > 64) {
			key = new Sha256(is224, true).update(key).array();
		}

		var oKeyPad = [],
			iKeyPad = [];
		for (i = 0; i < 64; ++i) {
			var b = key[i] || 0;
			oKeyPad[i] = 0x5c ^ b;
			iKeyPad[i] = 0x36 ^ b;
		}

		Sha256.call(this, is224, sharedMemory);

		this.update(iKeyPad);
		this.oKeyPad = oKeyPad;
		this.inner = true;
		this.sharedMemory = sharedMemory;
	}
	HmacSha256.prototype = new Sha256();

	HmacSha256.prototype.finalize = function () {
		Sha256.prototype.finalize.call(this);
		if (this.inner) {
			this.inner = false;
			var innerHash = this.array();
			Sha256.call(this, this.is224, this.sharedMemory);
			this.update(this.oKeyPad);
			this.update(innerHash);
			Sha256.prototype.finalize.call(this);
		}
	};

	var exports = createMethod();
	exports.sha256 = exports;
	exports.sha224 = createMethod(true);
	exports.sha256.hmac = createHmacMethod();
	exports.sha224.hmac = createHmacMethod(true);

	if (COMMON_JS) {
		module.exports = exports;
	} else {
		root.sha256 = exports.sha256;
		root.sha224 = exports.sha224;
		if (AMD) {
			define(function () {
				return exports;
			});
		}
	}
})();

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
        probeURL: "https://api.github.com/_private/browser/stats",
        subjectSelector: ["prox"],
        EnableConcurrency: true,
    },
    stats: {},
};
  
const xrayVLESSOutboundTemp = 
{
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
                address: "",
                port: 443,
                users: [
                    {
                        encryption: "none",
                        flow: "",
                        id: "",
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
            serverName: ""
        },
        wsSettings: {
            headers: {
                Host: "",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
            },
            path: ""
        },
        grpcSettings: {
            authority: "",
            multiMode: false,
            serviceName: ""
        },
        realitySettings: {
            fingerprint: "",
            publicKey: "",
            serverName: "",
            shortId: "",
            spiderX: ""
        },
        tcpSettings: {
            header: {
                request: {
                    headers: {
                        Host: []
                    },
                    method: "GET",
                    path: [],
                    version: "1.1"
                },
                response: {
                    headers: {
                        "Content-Type": ["application/octet-stream"]
                    },
                    reason: "OK",
                    status: "200",
                    version: "1.1"
                },
                type: "http"
            }
        }
    },
    tag: "proxy"
};

let xrayTrojanOutboundTemp = {
    mux: {
        concurrency: 8,
        enabled: true,
        xudpConcurrency: 16,
        xudpProxyUDP443: "reject"
    },
	protocol: "trojan",
	settings: {
		servers: [
			{
				address: "",
				level: 8,
				method: "chacha20-poly1305",
				ota: false,
				password: "",
				port: 443
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
			serverName: ""
		},
		wsSettings: {
			headers: {
				Host: ""
			},
			path: ""
		}
	},
	tag: "proxy"
}

const singboxConfigTemp = {
    log: {
        level: "warn",
        timestamp: true
    },
    dns: {
        servers: [
            {
                address: "https://8.8.8.8/dns-query",
                address_resolver: "dns-direct",
                strategy: "prefer_ipv4",
                tag: "dns-remote"
            },
            {
                address: "8.8.8.8",
                address_resolver: "dns-local",
                strategy: "prefer_ipv4",
                detour: "direct",
                tag: "dns-direct"
            },
            {
                address: "local",
                tag: "dns-local"
            },
            {
                address: "rcode://success",
                tag: "dns-block"
            }
        ],
        rules: [
            {
                domain_suffix: ".ir",
                domain: [
                    "www.gstatic.com"
                ],
                server: "dns-direct"
            },
            {
                disable_cache: true,
                rule_set: [
                    "geosite-category-ads-all",
                    "geosite-malware",
                    "geosite-phishing",
                    "geosite-cryptominers"
                ],
                server: "dns-block"
            }
        ],
        independent_cache: true
    },
    inbounds: [
        {
            type: "direct",
            tag: "dns-in",
            listen: "127.0.0.1",
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
            endpoint_independent_nat: true,
            stack: "mixed",
            sniff: true,
            sniff_override_destination: true
        },
        {
            type: "mixed",
            tag: "mixed-in",
            listen: "127.0.0.1",
            listen_port: 2080,
            sniff: true,
            sniff_override_destination: true
        }
    ],
    outbounds: [
        {
            type: "selector",
            tag: "proxy",
            outbounds: ["💦 Best-Ping 💥"]
        },
        {
            type: "urltest",
            tag: "💦 Best-Ping 💥",
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
        rules: [
            {
                port: 53,
                outbound: "dns-out"
            },
            {
                inbound: "dns-in",
                outbound: "dns-out"
            },
            {
                network: "udp",
                port: 443,
                protocol: "quic",
                outbound: "block"
            },
            {
                ip_is_private: true,
                outbound: "direct"
            },
            {
                rule_set: [
                    "geosite-category-ads-all",
                    "geosite-malware",
                    "geosite-phishing",
                    "geosite-cryptominers",
                    "geoip-malware",
                    "geoip-phishing"
                ],
                outbound: "block"
            },
            {
                rule_set: ["geosite-ir", "geoip-ir"],
                outbound: "direct"
            },
            {
                ip_cidr: ["224.0.0.0/3", "ff00::/8"],
                source_ip_cidr: ["224.0.0.0/3", "ff00::/8"],
                outbound: "block"
            }
        ],
        rule_set: [
            {
                type: "remote",
                tag: "geosite-ir",
                format: "binary",
                url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-ir.srs",
                download_detour: "direct"
            },
            {
                type: "remote",
                tag: "geosite-category-ads-all",
                format: "binary",
                url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geosite-category-ads-all.srs",
                download_detour: "direct"
            },
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
                tag: "geoip-ir",
                format: "binary",
                url: "https://raw.githubusercontent.com/Chocolate4U/Iran-sing-box-rules/rule-set/geoip-ir.srs",
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
        ],
        auto_detect_interface: true,
        override_android_vpn: true,
        final: "proxy"
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
            secret: "",
            default_mode: "rule"
        }
    }
};

const singboxVLESSOutboundTemp = {
    type: "vless",
    server: "",
    server_port: 443,
    uuid: "",
    domain_strategy: "prefer_ipv6",
    packet_encoding: "",
    tls: {
        alpn: [
            "http/1.1"
        ],
        enabled: true,
        insecure: false,
        server_name: "",
        utls: {
            enabled: true,
            fingerprint: "randomized"
        }
    },
    transport: {
        early_data_header_name: "Sec-WebSocket-Protocol",
        max_early_data: 2560,
        headers: {
            Host: ""
        },
        path: "/",
        type: "ws"
    },
    tag: ""
};

const singboxTrojanOutboundTemp = {
	password: "",
	server: "",
	server_port: 443,
	tls: {
		alpn: [
            "http/1.1"
		],
		enabled: true,
		insecure: false,
		server_name: "",
		utls: {
			enabled: true,
			fingerprint: "randomized"
		}
	},
	transport: {
		early_data_header_name: "Sec-WebSocket-Protocol",
		max_early_data: 2560,
		headers: {
			Host: [
				""
			]
		},
		path: "",
		type: "ws"
	},
	type: "trojan",
	tag: "proxy"
}

const xrayWgOutboundTemp = {
    protocol: "wireguard",
    settings: {
        address: [],
        mtu: 1280,
        peers: [
            {
                endpoint: "",
                publicKey: "",
                keepAlive: 5
            }
        ],
        reserved: [],
        secretKey: ""
    },
    streamSettings: {
        sockopt: {
            dialerProxy: "",
            tcpKeepAliveIdle: 100,
            tcpNoDelay: true,
        }
    },
    tag: "proxy"
};

const singboxWgOutboundTemp = {
    local_address: [],
    mtu: 1280,
    peer_public_key: "",
    pre_shared_key: "",
    private_key: "",
    reserved: "",
    server: "",
    server_port: 2408,
    type: "wireguard",
    domain_strategy: "prefer_ipv6",
    detour: "",
    tag: ""
};