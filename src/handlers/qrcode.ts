import { HttpStatus } from '@common';
import { getGlobals } from '@settings';
import qrcode from 'qrcode-generator';
import { fallback } from './utils';

function crc32(data: Uint8Array): number {
    let crc = 0xffffffff;

    for (const byte of data) {
        crc ^= byte;

        for (let i = 0; i < 8; i++) {
            crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
    }

    return (crc ^ 0xffffffff) >>> 0;
}

function u32(value: number): Uint8Array {
    return new Uint8Array([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value
    ]);
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
    const typeBytes = new TextEncoder().encode(type);
    const crcInput = new Uint8Array(
        typeBytes.length + data.length
    );

    crcInput.set(typeBytes);
    crcInput.set(data, typeBytes.length);

    const chunk = new Uint8Array(
        12 + data.length
    );

    chunk.set(u32(data.length), 0);
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    chunk.set(u32(crc32(crcInput)), 8 + data.length);

    return chunk;
}

async function compressZlib(data: Uint8Array): Promise<Uint8Array> {
    const copy = new Uint8Array(data);
    const stream = new Blob([copy.buffer])
        .stream()
        .pipeThrough(new CompressionStream('deflate'));

    return new Uint8Array(
        await new Response(stream).arrayBuffer()
    );
}

async function createPNG(
    width: number,
    height: number,
    rgba: Uint8Array
): Promise<ArrayBuffer> {
    const raw = new Uint8Array(
        height * (width * 4 + 1)
    );

    for (let y = 0; y < height; y++) {
        const src = y * width * 4;
        const dst = y * (width * 4 + 1);

        raw[dst] = 0;
        raw.set(
            rgba.subarray(src, src + width * 4),
            dst + 1
        );
    }

    const ihdr = new Uint8Array(13);

    ihdr.set(u32(width), 0);
    ihdr.set(u32(height), 4);

    ihdr[8] = 8;
    ihdr[9] = 6; // RGBA

    const idat = await compressZlib(raw);
    const parts = [
        new Uint8Array([
            137, 80, 78, 71, 13, 10, 26, 10
        ]),
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', idat),
        pngChunk('IEND', new Uint8Array())
    ];

    const total = parts.reduce(
        (a, b) => a + b.length,
        0
    );

    const output = new Uint8Array(total);
    let offset = 0;

    for (const part of parts) {
        output.set(part, offset);
        offset += part.length;
    }

    return output.buffer;
}


export async function generateQRCode(request: Request): Promise<Response> {
    const { searchParams, origin } = getGlobals();
    const data = searchParams.get('data') ?? '';

    const target = new URL(data);
    const proto = target.protocol;

    let url: URL = target;
    if (proto === 'sing-box:') {
        const singUrl = target.searchParams.get('url') ?? '';
        url = new URL(singUrl);
    }

    if (url.origin !== origin) {
        return fallback(request);
    }

    const qr = qrcode(0, 'M');
    qr.addData(data);
    qr.make();

    const modules = qr.getModuleCount();
    const scale = 8;
    const margin = 4;
    const size = (modules + margin * 2) * scale;
    const pixels = new Uint8Array(
        size * size * 4
    );

    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
        pixels[i + 3] = 255;
    }

    for (let y = 0; y < modules; y++) {
        for (let x = 0; x < modules; x++) {
            if (!qr.isDark(y, x)) continue;

            for (let dy = 0; dy < scale; dy++) {
                for (let dx = 0; dx < scale; dx++) {
                    const px = (x + margin) * scale + dx;
                    const py = (y + margin) * scale + dy;
                    const index = (py * size + px) * 4;

                    pixels[index] = 15;
                    pixels[index + 1] = 23;
                    pixels[index + 2] = 42;
                    pixels[index + 3] = 255;
                }
            }
        }
    }

    const png = await createPNG(
        size,
        size,
        pixels
    );

    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store'
        }
    });
}