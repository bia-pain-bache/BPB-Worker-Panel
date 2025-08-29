import { connect } from 'cloudflare:sockets';
import { isIPv4, resolveDNS } from '../cores-configs/helpers';

export const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;

export async function handleTCPOutBound(
    remoteSocket,
    addressRemote,
    portRemote,
    rawClientData,
    webSocket,
    VLResponseHeader,
    log
) {
    async function connectAndWrite(address, port) {
        // if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(address)) address = `${atob('d3d3Lg==')}${address}${atob('LnNzbGlwLmlv')}`;
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

    async function retry() {
        let tcpSocket;
        const mode = globalThis.proxyMode;
        const parseIPs = value => value ? value.split(',').map(val => val.trim()).filter(Boolean) : null;

        if (mode === 'proxyip') {
            log(`direct connection failed, trying to use Proxy IP for ${addressRemote}`);
            try {
                const { panelIPs, proxyIPs } = globalThis;
                const finalProxyIPs = panelIPs.length ? panelIPs : parseIPs(proxyIPs);
                const selectedProxyIP = finalProxyIPs[Math.floor(Math.random() * finalProxyIPs.length)];
                let proxyIP, proxyIpPort;

                if (selectedProxyIP.includes(']:')) {
                    const match = selectedProxyIP.match(/^(\[.*?\]):(\d+)$/);
                    proxyIP = match[1];
                    proxyIpPort = match[2];
                } else {
                    [proxyIP, proxyIpPort] = selectedProxyIP.split(':');
                }

                tcpSocket = await connectAndWrite(proxyIP || addressRemote, +proxyIpPort || portRemote);
            } catch (error) {
                console.error('Proxy IP connection failed:', error);
                webSocket.close(1011, 'Proxy IP connection failed: ' + error.message);
            }

        } else if (mode === 'nat64') {
            log(`direct connection failed, trying to generate dynamic NAT64 IP for ${addressRemote}`);
            try {
                const { panelIPs, nat64Prefixes } = globalThis;
                const prefixes = panelIPs.length ? panelIPs : parseIPs(nat64Prefixes);
                const selectedPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const dynamicProxyIP = await getDynamicProxyIP(addressRemote, selectedPrefix);
                tcpSocket = await connectAndWrite(dynamicProxyIP, portRemote);
            } catch (error) {
                console.error('NAT64 connection failed:', error);
                webSocket.close(1011, 'NAT64 connection failed: ' + error.message);
            }
        }

        tcpSocket.closed.catch(error => {
            console.log('retry tcpSocket closed error', error);
        }).finally(() => {
            safeCloseWebSocket(webSocket);
        });

        remoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, null, log);
    }

    try {
        const tcpSocket = await connectAndWrite(addressRemote, portRemote);
        remoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, retry, log);
    } catch (error) {
        console.error('Connection failed:', err);
        webSocket.close(1011, 'Connection failed');
    }
}

async function remoteSocketToWS(remoteSocket, webSocket, VLResponseHeader, retry, log) {
    // remote--> ws
    let VLHeader = VLResponseHeader;
    let hasIncomingData = false; // check if remoteSocket has incoming data
    await remoteSocket.readable
        .pipeTo(
            new WritableStream({
                start() { },
                async write(chunk, controller) {
                    hasIncomingData = true;
                    // remoteChunkCount++;
                    if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                        controller.error("webSocket.readyState is not open, maybe close");
                    }
                    if (VLHeader) {
                        webSocket.send(await new Blob([VLHeader, chunk]).arrayBuffer());
                        VLHeader = null;
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
            console.error(`VLRemoteSocketToWS has exception `, error.stack || error);
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

export function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
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

export function safeCloseWebSocket(socket) {
    try {
        if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
            socket.close();
        }
    } catch (error) {
        console.error('safeCloseWebSocket error', error);
    }
}

async function getDynamicProxyIP(address, nat64Prefix) {
    let finalAddress = address;
    if (!isIPv4(address)) {
        const { ipv4 } = await resolveDNS(address, true);
        if (ipv4.length) {
            finalAddress = ipv4[0];
        } else {
            throw new Error('Unable to find IPv4 in DNS records');
        }
    }

    return convertToNAT64IPv6(finalAddress, nat64Prefix);
}

function convertToNAT64IPv6(ipv4Address, nat64Prefix) {
    const parts = ipv4Address.split('.');
    if (parts.length !== 4) {
        throw new Error('Invalid IPv4 address');
    }

    const hex = parts.map(part => {
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
            throw new Error('Invalid IPv4 address');
        }
        return num.toString(16).padStart(2, '0');
    });

    const match = nat64Prefix.match(/^\[([0-9A-Fa-f:]+)\]$/);
    if (match) {
        return `[${match[1]}${hex[0]}${hex[1]}:${hex[2]}${hex[3]}]`;
    }
}

