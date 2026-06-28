import { connect } from 'cloudflare:sockets';
import { isIPv4, parseHostPort, resolveDNS } from '@utils';
import { safeErrorMessage } from '@common';

export const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;

type Logger = (info: string, event?: string) => void;
type RetryFn = () => Promise<void>;

export async function handleTCPOutBound(
    remoteSocket: { value: Socket | null },
    addressRemote: string,
    portRemote: number,
    rawClientData: ArrayBuffer | undefined,
    webSocket: WebSocket,
    VLResponseHeader: Uint8Array<ArrayBuffer> | null,
    log: Logger
): Promise<void> {
    async function connectAndWrite(address: string, port: number): Promise<Socket> {
        const tcpSocket = connect({ hostname: address, port });
        remoteSocket.value = tcpSocket;
        log(`connected to ${address}:${port}`);
        const writer = tcpSocket.writable.getWriter();
        await writer.write(rawClientData);
        writer.releaseLock();
        return tcpSocket;
    }

    async function retry(retryAddress: string, retryPort: number): Promise<void> {
        try {
            const tcpSocket = await connectAndWrite(retryAddress, retryPort);
            tcpSocket.closed
                .catch(error => console.log('retry TCP socket closed error', error))
                .finally(() => safeCloseWebSocket(webSocket));

            remoteSocketToWS(tcpSocket, webSocket, VLResponseHeader, null, log);
        } catch (error) {
            console.error('Retry connection failed:', error);
            webSocket.close(1011, 'Connection failed');
        }
    }

    async function resolveRetryTarget(): Promise<{ address: string; port: number }> {
        const {
            proxyMode,
            panelIPs,
            envProxyIPs,
            envPrefixes,
            defaultProxyIPs,
            defaultPrefixes
        } = globalThis.wsConfig;

        const getRandomValue = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
        const parseIPs = (value: string): string[] | undefined =>
            value ? value.split(',').map(v => v.trim()).filter(Boolean) : undefined;

        if (proxyMode === 'proxyip') {
            log(`direct connection failed, trying Proxy IP for ${addressRemote}`);
            const proxyIPs = panelIPs?.length
                ? panelIPs
                : parseIPs(envProxyIPs) ?? defaultProxyIPs;
            const proxyIP = getRandomValue(proxyIPs);
            const { host, port } = parseHostPort(proxyIP, true);
            return {
                address: host || addressRemote,
                port: port || portRemote
            };
        }

        if (proxyMode === 'prefix') {
            log(`direct connection failed, trying NAT64 prefix for ${addressRemote}`);
            const prefixes = panelIPs?.length
                ? panelIPs
                : parseIPs(envPrefixes) ?? defaultPrefixes;
            const prefix = getRandomValue(prefixes);
            const dynamicProxyIP = await getDynamicProxyIP(addressRemote, prefix);
            return {
                address: dynamicProxyIP,
                port: portRemote
            };
        }

        return { address: addressRemote, port: portRemote };
    }

    try {
        const tcpSocket = await connectAndWrite(addressRemote, portRemote);
        remoteSocketToWS(
            tcpSocket,
            webSocket,
            VLResponseHeader,
            async () => {
                const { address, port } = await resolveRetryTarget();
                await retry(address, port);
            },
            log
        );
    } catch (error) {
        console.error(`Connection failed: ${error}`);
        webSocket.close(1011, 'Connection failed');
    }
}

async function remoteSocketToWS(
    remoteSocket: Socket,
    webSocket: WebSocket,
    VLResponseHeader: Uint8Array<ArrayBuffer> | null,
    retry: RetryFn | null,
    log: Logger
): Promise<void> {
    let vlHeader = VLResponseHeader;
    let hasIncomingData = false;

    const writableStream = new WritableStream({
        async write(chunk, controller) {
            hasIncomingData = true;

            if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                controller.error("webSocket.readyState is not open, maybe close");
                return;
            }

            if (vlHeader) {
                webSocket.send(await new Blob([vlHeader, chunk]).arrayBuffer());
                vlHeader = null;
            } else {
                webSocket.send(chunk);
            }
        },
        close() {
            log(`remoteConnection.readable is close with hasIncomingData is ${hasIncomingData}`);
        },
        abort(reason) {
            console.error(`remoteConnection.readable abort`, reason);
            safeCloseTcpSocket(remoteSocket);
        }
    });

    try {
        await remoteSocket.readable.pipeTo(writableStream);
    } catch (error) {
        console.error('remoteSocketToWS has exception.', error);
        safeCloseTcpSocket(remoteSocket);
        safeCloseWebSocket(webSocket);
    }

    if (!hasIncomingData && retry) {
        log(`retry`);
        await retry();
    }
}

export function makeReadableWebSocketStream(
    webSocketServer: WebSocket,
    earlyDataHeader: string,
    log: Logger
): ReadableStream<ArrayBuffer> {
    let readableStreamCancel = false;

    const stream = new ReadableStream<ArrayBuffer>({
        start(controller) {
            webSocketServer.addEventListener("message", (event) => {
                if (readableStreamCancel) return;
                controller.enqueue(event.data as ArrayBuffer);
            });

            webSocketServer.addEventListener("close", () => {
                safeCloseWebSocket(webSocketServer);
                if (readableStreamCancel) return;
                controller.close();
            });

            webSocketServer.addEventListener("error", (err) => {
                log("webSocketServer has error");
                controller.error(err);
            });

            const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);

            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },
        cancel(reason) {
            if (readableStreamCancel) return;
            log(`ReadableStream was canceled, due to ${reason}`);
            readableStreamCancel = true;
            safeCloseWebSocket(webSocketServer);
        }
    });

    return stream;
}

function base64ToArrayBuffer(base64Str: string): { earlyData: ArrayBuffer | null; error: unknown | null } {
    if (!base64Str) {
        return { earlyData: null, error: null };
    }

    try {
        const normalized = base64Str.replace(/-/g, '+').replace(/_/g, '/');
        const decode = atob(normalized);
        const arryBuffer = Uint8Array.from(decode, c => c.charCodeAt(0));
        return { earlyData: arryBuffer.buffer, error: null };
    } catch (error) {
        return { earlyData: null, error };
    }
}

export function safeCloseTcpSocket(socket: Socket | null): void {
    if (socket) {
        try {
            socket.close();
        } catch (error) {
            console.error("Failed to close TCP socket:", error);
        }
    }
}

export function safeCloseWebSocket(socket: WebSocket): void {
    try {
        if (
            socket.readyState === WS_READY_STATE_OPEN ||
            socket.readyState === WS_READY_STATE_CLOSING
        ) {
            socket.close();
        }
    } catch (error) {
        console.error('safeCloseWebSocket error', error);
    }
}

async function getDynamicProxyIP(address: string, prefix: string): Promise<string> {
    let finalAddress = address;

    if (!isIPv4(address)) {
        const { ipv4 } = await resolveDNS(address, true);

        if (!ipv4.length) {
            throw new Error(`Unable to find IPv4 address for ${address}`);
        }

        finalAddress = ipv4[0];
    }

    return convertToNAT64IPv6(finalAddress, prefix);
}

function convertToNAT64IPv6(ipv4Address: string, prefix: string): string {
    const parts = ipv4Address.split('.');

    if (parts.length !== 4) {
        throw new Error(`Invalid IPv4 address: ${ipv4Address}`);
    }

    const hex = parts.map(part => {
        const num = parseInt(part, 10);

        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`Invalid IPv4 octet: ${part}`);
        }

        return num.toString(16).padStart(2, '0');
    });

    const match = prefix.match(/^\[([0-9A-Fa-f:]+)\]$/);

    if (!match) {
        throw new Error(`Invalid NAT64 prefix format: ${prefix}. Expected format: [prefix::]`);
    }

    return `[${match[1]}${hex[0]}${hex[1]}:${hex[2]}${hex[3]}]`;
}