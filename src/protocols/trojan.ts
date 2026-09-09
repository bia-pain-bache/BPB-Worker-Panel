import { createHash } from 'node:crypto';
import { getGlobals } from '@settings';
import { getActiveUserByCredential } from '@kv';
import { createTrafficTracker } from '@settings/traffic';
import type { TrafficTracker } from '@settings/traffic';
import { handleTCPOutBound, makeReadableWebSocketStream, safeCloseTcpSocket } from '@protocols/common';

export async function TrOverWSHandler(request: Request, env: Env): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();
    webSocket.binaryType = 'arraybuffer';

    let address = '';
    let portWithRandomLog = '';

    const log = (info: string, event?: string) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
    };

    const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';
    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

    let remoteSocketWapper: { value: any } = { value: null };
    let udpStreamWrite: any = null;
    let traffic: TrafficTracker | null = null;

    const writableStream = new WritableStream({
        async write(chunk, _controller) {
            if (udpStreamWrite) {
                return udpStreamWrite(chunk);
            }

            if (traffic) { traffic.addUpload(chunk.byteLength); if (await traffic.exceeded()) throw new Error('traffic limit exceeded'); await traffic.flush(); }

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
                addressRemote = '',
                rawClientData,
                parsedPassword,
            } = parseTrHeader(chunk);

            address = addressRemote;
            portWithRandomLog = `${portRemote}--${Math.random()} tcp`;

            if (hasError) {
                throw new Error(message);
            }
            const { trPass } = getGlobals();
            const currentHash = createHash('sha224').update(trPass).digest('hex');
            if (parsedPassword && parsedPassword !== currentHash) {
                const user = await getActiveUserByCredential(env, 'password', parsedPassword);
                if (!user) throw new Error('invalid or expired user');
                traffic = createTrafficTracker(env, user.id, user.dataLimit);
                traffic.addUpload(rawClientData.byteLength);
                await traffic.flush();
                if (await traffic.exceeded()) throw new Error('traffic limit exceeded');
            }

            handleTCPOutBound(
                remoteSocketWapper,
                addressRemote,
                portRemote,
                rawClientData,
                webSocket,
                null,
                log,
                traffic
            );
        },
        async close() {
            if (traffic) await traffic.flush(true);
            safeCloseTcpSocket(remoteSocketWapper.value);
        },
        async abort(reason) {
            if (traffic) await traffic.flush(true);
            log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        }
    });

    readableWebSocketStream
        .pipeTo(writableStream)
        .catch(error => {
            log('readableWebSocketStream pipeTo error', error);
            safeCloseTcpSocket(remoteSocketWapper.value);
        });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

function parseTrHeader(buffer: ArrayBuffer) {
    if (buffer.byteLength < 56) {
        return {
            hasError: true,
            message: 'invalid data',
        };
    }

    let crLfIndex = 56;
    const cr = new Uint8Array(buffer.slice(crLfIndex, crLfIndex + 1))[0];
    const lf = new Uint8Array(buffer.slice(crLfIndex + 1, crLfIndex + 2))[0];

    if (cr !== 0x0d || lf !== 0x0a) {
        return {
            hasError: true,
            message: 'invalid header format (missing CR LF)',
        };
    }

    const { trPass } = getGlobals();
    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    const currentHash = createHash('sha224').update(trPass).digest('hex');

    const socks5DataBuffer = buffer.slice(crLfIndex + 2);
    if (socks5DataBuffer.byteLength < 6) {
        return {
            hasError: true,
            message: 'invalid SOCKS5 request data',
        };
    }

    const view = new DataView(socks5DataBuffer);
    const cmd = view.getUint8(0);
    if (cmd !== 1) {
        return {
            hasError: true,
            message: 'unsupported command, only TCP (CONNECT) is allowed',
        };
    }

    const atype = view.getUint8(1);
    let addressLength = 0;
    let addressIndex = 2;
    let address = '';

    switch (atype) {
        case 1:
            addressLength = 4;
            address = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)).join('.');
            break;

        case 3:
            addressLength = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + 1))[0];
            addressIndex += 1;
            address = new TextDecoder().decode(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            break;

        case 4: {
            addressLength = 16;
            const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6 = [];

            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }

            address = ipv6.join(':');
            break;
        }
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
        parsedPassword: password,
        addressRemote: address,
        portRemote,
        rawClientData: socks5DataBuffer.slice(portIndex + 4),
    };
}
