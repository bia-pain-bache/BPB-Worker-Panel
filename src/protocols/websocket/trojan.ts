import {
    handleTCPOutBound,
    makeReadableWebSocketStream,
    safeCloseTcpSocket
} from './common';

type Logger = (info: string, event?: string) => void;

export async function TrOverWSHandler(request: Request): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();
    webSocket.binaryType = 'arraybuffer';

    let address = "";
    let portWithRandomLog = "";

    const log: Logger = (info: string, event?: string) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
    };

    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

    let remoteSocketWrapper: { value: Socket | null } = { value: null };

    const writableStream = new WritableStream({
        async write(chunk, _controller) {
            if (remoteSocketWrapper.value) {
                const writer = remoteSocketWrapper.value.writable.getWriter();
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
            } = await parseTrHeader(chunk);

            address = addressRemote;
            portWithRandomLog = `${portRemote}--${Math.random()} tcp`;

            if (hasError) {
                throw new Error(message);
            }

            await handleTCPOutBound(
                remoteSocketWrapper,
                addressRemote,
                portRemote,
                rawClientData,
                webSocket,
                null,
                log
            );
        },
        close() {
            safeCloseTcpSocket(remoteSocketWrapper.value);
        },
        abort(reason) {
            log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        }
    });

    readableWebSocketStream
        .pipeTo(writableStream)
        .catch(error => {
            log("readableWebSocketStream pipeTo error", error);
            safeCloseTcpSocket(remoteSocketWrapper.value);
        });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

function timingSafeEqual(a: string, b: string): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const aBytes = new TextEncoder().encode(a);
    const bBytes = new TextEncoder().encode(b);

    if (aBytes.length !== bBytes.length) {
        let diff = 0;
        for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ (bBytes[i % bBytes.length] ?? 0);
        return false;
    }

    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
        diff |= aBytes[i] ^ bBytes[i];
    }

    return diff === 0;
}

async function parseTrHeader(buffer: ArrayBuffer): Promise<{
    hasError: boolean;
    message?: string;
    portRemote?: number;
    addressRemote?: string;
    rawClientData?: ArrayBuffer;
}> {
    if (buffer.byteLength < 56) {
        return { hasError: true, message: "invalid data" };
    }

    const crLfIndex = 56;
    const headerBytes = new Uint8Array(buffer);
    const cr = headerBytes[crLfIndex];
    const lf = headerBytes[crLfIndex + 1];

    if (cr !== 0x0d || lf !== 0x0a) {
        return { hasError: true, message: "invalid header format" };
    }

    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    const { TrPass } = globalThis.globalConfig;

    if (!TrPass) {
        return { hasError: true, message: "server misconfiguration" };
    }

    const expectedHash = sha224(TrPass);

    if (!timingSafeEqual(password, expectedHash)) {
        return { hasError: true, message: "authentication failed" };
    }

    const socks5DataBuffer = buffer.slice(crLfIndex + 2);
    if (socks5DataBuffer.byteLength < 6) {
        return { hasError: true, message: "invalid request data" };
    }

    const view = new DataView(socks5DataBuffer);
    const cmd = view.getUint8(0);

    if (cmd !== 1) {
        return { hasError: true, message: "unsupported command" };
    }

    const atype = view.getUint8(1);
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

        case 4: {
            addressLength = 16;
            const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6: string[] = [];

            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }

            address = ipv6.join(":");
            break;
        }

        default:
            return { hasError: true, message: "invalid address type" };
    }

    if (!address) {
        return { hasError: true, message: "empty address" };
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

const byteToHex: string[] = Array.from(
    { length: 256 },
    (_, i) => (i + 256).toString(16).slice(1)
);

function sha224(string: string): string {
    const rightRotate = (value: number, amount: number) =>
        (value >>> amount) | (value << (32 - amount));

    const h = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
    ];

    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const utf8Encode = (str: string): number[] => {
        const utf8: number[] = [];

        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);

            if (charcode < 0x80) {
                utf8.push(charcode);
            } else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(
                    0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f)
                );
            } else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                utf8.push(
                    0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f)
                );
            }
        }

        return utf8;
    };

    const bytes = utf8Encode(string);
    const bitLength = bytes.length * 8;

    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);

    const lengthHi = Math.floor(bitLength / 0x100000000);
    const lengthLo = bitLength & 0xffffffff;

    for (let i = 3; i >= 0; i--) bytes.push((lengthHi >> (i * 8)) & 0xff);
    for (let i = 3; i >= 0; i--) bytes.push((lengthLo >> (i * 8)) & 0xff);

    for (let offset = 0; offset < bytes.length; offset += 64) {
        const w = new Array(64).fill(0);

        for (let i = 0; i < 16; i++) {
            w[i] =
                (bytes[offset + 4 * i] << 24) |
                (bytes[offset + 4 * i + 1] << 16) |
                (bytes[offset + 4 * i + 2] << 8) |
                bytes[offset + 4 * i + 3];
        }

        for (let i = 16; i < 64; i++) {
            const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        }

        let [a, b, c, d, e, f, g, h8] = h;

        for (let i = 0; i < 64; i++) {
            const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h8 + S1 + ch + k[i] + w[i]) | 0;
            const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) | 0;

            h8 = g; g = f; f = e;
            e = (d + temp1) | 0;
            d = c; c = b; b = a;
            a = (temp1 + temp2) | 0;
        }

        h[0] = (h[0] + a) | 0;
        h[1] = (h[1] + b) | 0;
        h[2] = (h[2] + c) | 0;
        h[3] = (h[3] + d) | 0;
        h[4] = (h[4] + e) | 0;
        h[5] = (h[5] + f) | 0;
        h[6] = (h[6] + g) | 0;
        h[7] = (h[7] + h8) | 0;
    }

    return h
        .slice(0, 7)
        .map(word => byteToHex[(word >>> 24) & 0xff] +
            byteToHex[(word >>> 16) & 0xff] +
            byteToHex[(word >>> 8) & 0xff] +
            byteToHex[word & 0xff])
        .join('');
}
