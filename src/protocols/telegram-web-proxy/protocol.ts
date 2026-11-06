export const FRAME = Object.freeze({
  OPEN: 0x01,
  DATA: 0x02,
  CLOSE: 0x03,
  WINDOW: 0x04,
  PING: 0x05,
  PONG: 0x06,
  HELLO: 0x10,
  WELCOME: 0x11,
  BYE: 0x1f,
});

export const HEADER_SIZE = 8;
export const MAX_PAYLOAD = 1024 * 1024;
export const MAX_BATCH_FRAMES = 4096;
export const INITIAL_WINDOW = 4 * 1024 * 1024;
export const DATA_CHUNK = 64 * 1024;
export const MAX_WS_MESSAGE = 2 * 1024 * 1024;

export interface ParsedFrame {
  type: number;
  streamId: number;
  payload: Uint8Array;
}

export function encodeFrame(type: number, streamId: number, payload: Uint8Array = new Uint8Array()): Uint8Array {
  if (streamId < 0 || streamId > 0xffffff || payload.length > MAX_PAYLOAD) throw new Error("invalid frame");
  const out = new Uint8Array(HEADER_SIZE + payload.length);
  out[0] = type; out[1] = streamId >>> 16; out[2] = streamId >>> 8; out[3] = streamId;
  new DataView(out.buffer).setUint32(4, payload.length);
  out.set(payload, HEADER_SIZE);
  return out;
}

export function parseFrames(input: Uint8Array): ParsedFrame[] {
  const frames: ParsedFrame[] = []; let offset = 0;
  while (offset < input.length) {
    if (frames.length >= MAX_BATCH_FRAMES || input.length - offset < HEADER_SIZE) throw new Error("bad batch");
    const view = new DataView(input.buffer, input.byteOffset + offset, HEADER_SIZE);
    const length = view.getUint32(4);
    if (length > MAX_PAYLOAD || offset + HEADER_SIZE + length > input.length) throw new Error("bad payload");
    frames.push({
      type: input[offset]!,
      streamId: (input[offset + 1]! << 16) | (input[offset + 2]! << 8) | input[offset + 3]!,
      payload: input.subarray(offset + HEADER_SIZE, offset + HEADER_SIZE + length),
    });
    offset += HEADER_SIZE + length;
  }
  if (!frames.length) throw new Error("empty batch");
  return frames;
}

export function u32(value: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value);
  return out;
}

export function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}
