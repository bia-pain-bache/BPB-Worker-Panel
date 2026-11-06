import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const {
	FRAME,
	HEADER_SIZE,
	MAX_PAYLOAD,
	encodeFrame,
	parseFrames,
	clampInt,
	u32
} = await import(pathToFileURL(join(root, 'src/protocols/telegram-web-proxy/protocol.ts')).href);

describe('protocol frames', () => {
	it('round-trips a DATA frame', () => {
		const payload = new TextEncoder().encode('hello');
		const encoded = encodeFrame(FRAME.DATA, 7, payload);
		assert.equal(encoded.length, HEADER_SIZE + payload.length);
		const frames = parseFrames(encoded);
		assert.equal(frames.length, 1);
		assert.equal(frames[0].type, FRAME.DATA);
		assert.equal(frames[0].streamId, 7);
		assert.deepEqual(frames[0].payload, payload);
	});

	it('rejects invalid stream id', () => {
		assert.throws(() => encodeFrame(FRAME.OPEN, -1));
		assert.throws(() => encodeFrame(FRAME.OPEN, 0x1000000));
	});

	it('rejects oversized payload on encode', () => {
		assert.throws(() => encodeFrame(FRAME.DATA, 1, new Uint8Array(MAX_PAYLOAD + 1)));
	});

	it('parses multiple frames in one batch', () => {
		const a = encodeFrame(FRAME.OPEN, 1, new Uint8Array([1, 2]));
		const b = encodeFrame(FRAME.DATA, 1, new Uint8Array([3]));
		const batch = new Uint8Array(a.length + b.length);
		batch.set(a, 0);
		batch.set(b, a.length);
		const frames = parseFrames(batch);
		assert.equal(frames.length, 2);
		assert.equal(frames[0].type, FRAME.OPEN);
		assert.equal(frames[1].type, FRAME.DATA);
	});

	it('rejects truncated batch', () => {
		const full = encodeFrame(FRAME.DATA, 1, new Uint8Array([9, 9, 9]));
		assert.throws(() => parseFrames(full.subarray(0, HEADER_SIZE + 1)));
	});

	it('rejects empty batch', () => {
		assert.throws(() => parseFrames(new Uint8Array(0)));
	});

	it('rejects claimed payload longer than remaining bytes', () => {
		const bad = new Uint8Array(HEADER_SIZE + 2);
		bad[0] = FRAME.DATA;
		new DataView(bad.buffer).setUint32(4, 1000);
		assert.throws(() => parseFrames(bad));
	});

	it('u32 and clampInt helpers', () => {
		assert.deepEqual([...u32(0x01020304)], [1, 2, 3, 4]);
		assert.equal(clampInt('50', 1, 100, 10), 50);
		assert.equal(clampInt('999', 1, 100, 10), 100);
		assert.equal(clampInt(undefined, 1, 100, 10), 10);
	});
});
