import { TELEGRAM_DCS, parseProxySecret, acceptClientHandshake, createTelegramHandshake } from "./mtproxy.ts";
import { FRAME, HEADER_SIZE, INITIAL_WINDOW, DATA_CHUNK, MAX_WS_MESSAGE, encodeFrame, parseFrames, clampInt, u32 } from "./protocol.ts";
import type { TwpEnv, SessionLifecycle } from "./types.ts";

type ConnectFn = (opts: { hostname: string; port: number }) => {
  opened: Promise<void>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => void;
};

type SessionOptions = {
  now?: () => number;
};

type StreamState = {
  id: number;
  receiveWindow: number;
  sendWindow: number;
  uplinkQueue: Uint8Array[];
  uplinkBytes: number;
  uplinkItems: number;
  closed: boolean;
  socket?: {
    opened: Promise<void>;
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<Uint8Array>;
    close: () => void;
  };
  writer?: WritableStreamDefaultWriter<Uint8Array>;
  reader?: ReadableStreamDefaultReader<Uint8Array>;
  abort?: AbortController;
  writeChain?: Promise<unknown>;
};


// Bounds include frame headers and an allowance for each retained queue item.
export const LIMITS = Object.freeze({
  itemCost: 256,
  ingressBytes: 8 * 1024 * 1024,
  ingressItems: 128,
  uplinkBytes: 8 * 1024 * 1024,
  uplinkItems: 8192,
  streamBytes: INITIAL_WINDOW + 1024 * 1024,
  streamItems: 4096,
  downlinkBytes: 8 * 1024 * 1024,
  downlinkItems: 8192,
  handshakeTimeout: 15000,
  connectTimeout: 10000,
  writeTimeout: 30000,
});

// The Workers entrypoint supplies cloudflare:sockets.connect. Keeping the
// transport injectable lets tests exercise real framing/crypto with fake I/O.
export class RelaySession {
  ctx: DurableObjectState;
  env: TwpEnv;
  connect: ConnectFn | null;
  now: () => number;
  initialized: boolean;
  closed: boolean;
  ws: WebSocket | null;
  streams: Map<number, StreamState>;
  closedIds: Set<number>;
  maxStreams: number;
  diagnostics: boolean;
  traceId: string | null;
  messageCount: number;
  messageChain: Promise<unknown>;
  ingressBytes: number;
  ingressItems: number;
  uplinkBytes: number;
  uplinkItems: number;
  downlinkBytes: number;
  downlinkItems: number;
  downlinkWaiters: Set<() => void>;
  secret: Uint8Array | null;
  lifecycle: SessionLifecycle;
  lastActivityAt: number;
  lastAlarmWriteAt: number;
  unconnectedExpiresAt: number;
  idleExpiresAt: number;

  constructor(ctx: DurableObjectState, env: TwpEnv, connect: ConnectFn | null, options: SessionOptions = {}) {
    this.ctx = ctx;
    this.env = env;
    this.connect = connect;
    /** Optional injectable clock for deterministic tests. */
    this.now = typeof options.now === "function" ? options.now : () => Date.now();
    this.initialized = false;
    this.closed = false;
    this.ws = null;
    this.streams = new Map();
    this.closedIds = new Set();
    this.maxStreams = clampInt(env.MAX_STREAMS, 1, 128, 64);
    this.diagnostics = String(env.DIAGNOSTICS || "") === "1";
    this.traceId = this.diagnostics ? crypto.randomUUID().slice(0, 8) : null;
    this.messageCount = 0;
    this.messageChain = Promise.resolve();
    this.ingressBytes = 0;
    this.ingressItems = 0;
    this.uplinkBytes = 0;
    this.uplinkItems = 0;
    this.downlinkBytes = 0;
    this.downlinkItems = 0;
    this.downlinkWaiters = new Set();
    this.secret = null;
    /** @type {'created'|'waiting_connection'|'connected'|'active'|'idle'|'closing'|'closed'|'expired'} */
    this.lifecycle = "created";
    this.lastActivityAt = 0;
    this.lastAlarmWriteAt = 0;
    /** Wall-clock deadline while waiting for the first WebSocket (persisted). */
    this.unconnectedExpiresAt = 0;
    /** Wall-clock idle deadline after connect (persisted). */
    this.idleExpiresAt = 0;
  }

  trace(event, details = {}) {
    if (this.diagnostics) console.log("webproxy", { traceId: this.traceId, event, ...details });
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/internal/bootstrap-consume" && request.method === "POST") {
      return this.ctx.blockConcurrencyWhile(async () => {
        let jti = "";
        try {
          const body = await request.json();
          jti = typeof body?.jti === "string" ? body.jti : "";
        } catch {
          return new Response("bad request", { status: 400 });
        }
        if (!jti || jti.length > 128 || !/^[A-Za-z0-9_-]{8,128}$/.test(jti)) {
          return new Response("bad request", { status: 400 });
        }
        // Sliding window rate limit for bootstrap consumption / session admission.
        const maxPerWindow = clampInt(this.env.MAX_SESSIONS_PER_WINDOW, 1, 500, 60);
        const windowMs = 60_000;
        const now = this.now();
        const windowStart = now - windowMs;
        const rlKey = "rl:bootstrap";
        let stamps = await this.ctx.storage.get(rlKey);
        if (!Array.isArray(stamps)) stamps = [];
        stamps = stamps.filter((t) => typeof t === "number" && t > windowStart);
        if (stamps.length >= maxPerWindow) {
          return new Response("rate limited", { status: 429 });
        }
        const key = "boot:" + jti;
        if (await this.ctx.storage.get(key)) return new Response("already used", { status: 409 });
        stamps.push(now);
        await this.ctx.storage.put(rlKey, stamps);
        await this.ctx.storage.put(key, now);
        const expires = now + 24 * 60 * 60 * 1000;
        await this.ctx.storage.put("bootexp:" + jti, expires);
        const alarm = await this.ctx.storage.getAlarm();
        if (alarm === null || alarm > expires) await this.ctx.storage.setAlarm(expires);
        return new Response(null, { status: 204 });
      });
    }


    // Atomic concurrent capacity: reserve / release active session slots on the ledger DO.
    if (url.pathname === "/internal/capacity-reserve" && request.method === "POST") {
      return this.ctx.blockConcurrencyWhile(async () => {
        let sessionId = "";
        try {
          const body = await request.json();
          sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
        } catch {
          return new Response("bad request", { status: 400 });
        }
        if (!sessionId || sessionId.length > 128) return new Response("bad request", { status: 400 });
        const maxActive = clampInt(this.env.MAX_ACTIVE_SESSIONS, 1, 2000, 128);
        const activeKey = "active:" + sessionId;
        if (await this.ctx.storage.get(activeKey)) {
          return new Response(null, { status: 204 }); // already reserved
        }
        const all = await this.ctx.storage.list({ prefix: "active:" });
        if (all.size >= maxActive) {
          return new Response("capacity full", { status: 429 });
        }
        // Store reservation timestamp; stale entries cleaned by alarm (max session lifetime).
        const maxSessionMs = 6 * 60 * 60 * 1000; // 6h absolute ceiling
        await this.ctx.storage.put(activeKey, this.now() + maxSessionMs);
        return new Response(null, { status: 204 });
      });
    }
    if (url.pathname === "/internal/capacity-release" && request.method === "POST") {
      return this.ctx.blockConcurrencyWhile(async () => {
        let sessionId = "";
        try {
          const body = await request.json();
          sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
        } catch {
          return new Response("bad request", { status: 400 });
        }
        if (!sessionId) return new Response("bad request", { status: 400 });
        await this.ctx.storage.delete("active:" + sessionId);
        return new Response(null, { status: 204 });
      });
    }

    if (this.closed) return new Response("session closed", { status: 404 });
    if (url.pathname === "/internal/init" && request.method === "POST") {
      if (!this.initialized) {
        const ttlMs = (Number.parseInt(this.env.SESSION_TTL_SECONDS, 10) || 300) * 1000;
        const unconnectedExpiresAt = this.now() + Math.min(600000, Math.max(30000, ttlMs));
        this.unconnectedExpiresAt = unconnectedExpiresAt;
        this.lifecycle = "waiting_connection";
        await this.ctx.storage.put("lifecycle", this.lifecycle);
        await this.ctx.storage.put("unconnectedExpiresAt", unconnectedExpiresAt);
        await this.ctx.storage.setAlarm(unconnectedExpiresAt);
        this.initialized = true;
      }
      return new Response(null, { status: 204 });
    }
    if (url.pathname === "/internal/ws" && request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      if (!this.initialized) {
        // Stale concurrent-capacity reservations (absolute ceiling).
    const activeAll = await this.ctx.storage.list({ prefix: "active:" });
    for (const [key, exp] of activeAll) {
      if (typeof exp === "number" && exp <= now) {
        await this.ctx.storage.delete(key);
      }
    }

    const stored = await this.ctx.storage.get(["lifecycle", "unconnectedExpiresAt", "idleExpiresAt"]);
        const lifecycle = stored.get("lifecycle");
        const unconnectedExpiresAt = stored.get("unconnectedExpiresAt");
        if (this.closed || lifecycle === "closed" || lifecycle === "expired") {
          return new Response("unknown session", { status: 404 });
        }
        if (typeof unconnectedExpiresAt === "number" && unconnectedExpiresAt < this.now() && lifecycle === "waiting_connection") {
          return new Response("unknown session", { status: 404 });
        }
        this.unconnectedExpiresAt = typeof unconnectedExpiresAt === "number" ? unconnectedExpiresAt : 0;
        this.idleExpiresAt = typeof stored.get("idleExpiresAt") === "number" ? stored.get("idleExpiresAt") : 0;
        this.lifecycle = typeof lifecycle === "string" ? lifecycle : "waiting_connection";
        this.initialized = true;
      }
      if (this.ws) return new Response("already connected", { status: 409 });
      const pair = new WebSocketPair();
      const client = pair[0], server = pair[1];
      server.accept();
      this.ws = server;
      this.lifecycle = "connected";
      this.lastActivityAt = this.now();
      // Unconnected TTL no longer applies once the client has connected.
      await this.ctx.storage.delete("unconnectedExpiresAt");
      this.unconnectedExpiresAt = 0;
      this.trace("websocket_accepted");
      await this.scheduleIdleAlarm(true);
      server.addEventListener("message", (event) => {
        this.touchActivity();
        this.enqueueMessage(event.data);
      });
      server.addEventListener("close", (event) => {
        this.trace("websocket_closed", { code: event.code, clean: event.wasClean });
        this.shutdown("websocket_close");
      });
      server.addEventListener("error", () => this.shutdown("websocket_error"));
      const protocol = request.headers.get("X-TProxy-Protocol") || "";
      return new Response(null, { status: 101, webSocket: client,
        headers: protocol ? { "Sec-WebSocket-Protocol": protocol } : {} });
    }
    if (url.pathname === "/internal/close" && request.method === "POST") {
      this.shutdown("session_delete");
      return new Response(null, { status: 204 });
    }
    return new Response("not found", { status: 404 });
  }


  async alarm() {
    const now = this.now();
    // Bootstrap ledger cleanup (dedicated DO id __twp_bootstrap_ledger__).
    const all = await this.ctx.storage.list({ prefix: "bootexp:" });
    let earliestBoot = null;
    for (const [key, exp] of all) {
      if (typeof exp === "number" && exp <= now) {
        const jti = key.slice("bootexp:".length);
        await this.ctx.storage.delete(key);
        await this.ctx.storage.delete("boot:" + jti);
      } else if (typeof exp === "number") {
        if (earliestBoot === null || exp < earliestBoot) earliestBoot = exp;
      }
    }

    const stored = await this.ctx.storage.get(["lifecycle", "unconnectedExpiresAt", "idleExpiresAt"]);
    const lifecycle = stored.get("lifecycle");
    const unconnectedExpiresAt = stored.get("unconnectedExpiresAt");
    const idleExpiresAt = stored.get("idleExpiresAt");

    if (typeof lifecycle === "string") this.lifecycle = lifecycle;
    if (typeof unconnectedExpiresAt === "number") this.unconnectedExpiresAt = unconnectedExpiresAt;
    if (typeof idleExpiresAt === "number") this.idleExpiresAt = idleExpiresAt;

    // Only an explicitly waiting_connection session is subject to unconnected TTL.
    // Ledger DO instances stay at lifecycle "created" and must not be expired here.
    const waiting = this.lifecycle === "waiting_connection";
    const connected = this.lifecycle === "connected" || this.lifecycle === "active" || this.lifecycle === "idle";

    if (waiting && typeof unconnectedExpiresAt === "number" && unconnectedExpiresAt <= now) {
      this.lifecycle = "expired";
      this.shutdown("unconnected_ttl_expired");
      await this.ctx.storage.deleteAll();
      return;
    }
    if (connected && typeof idleExpiresAt === "number" && idleExpiresAt <= now) {
      this.lifecycle = "expired";
      this.shutdown("idle_ttl_expired");
      await this.ctx.storage.deleteAll();
      return;
    }

    // Re-arm the earliest relevant deadline (session TTL or remaining bootstrap records).
    let next = earliestBoot;
    if (waiting && typeof unconnectedExpiresAt === "number" && unconnectedExpiresAt > now) {
      next = next === null ? unconnectedExpiresAt : Math.min(next, unconnectedExpiresAt);
    }
    if (connected && typeof idleExpiresAt === "number" && idleExpiresAt > now) {
      next = next === null ? idleExpiresAt : Math.min(next, idleExpiresAt);
    }
    if (next !== null) {
      await this.ctx.storage.setAlarm(next);
    } else {
      try { await this.ctx.storage.deleteAlarm(); } catch { /* ignore */ }
    }
  }

  touchActivity() {
    this.lastActivityAt = this.now();
    this.lifecycle = "active";
    if (this.now() - (this.lastAlarmWriteAt || 0) > 30000) {
      this.ctx.waitUntil(this.scheduleIdleAlarm(false));
    }
  }

  async scheduleIdleAlarm(force) {
    const idleSec = Number.parseInt(this.env.SESSION_IDLE_SECONDS, 10);
    const idleMs = (Number.isFinite(idleSec) ? Math.min(7200, Math.max(60, idleSec)) : 900) * 1000;
    if (!force && this.now() - (this.lastAlarmWriteAt || 0) < 30000) return;
    const idleExpiresAt = this.now() + idleMs;
    this.idleExpiresAt = idleExpiresAt;
    this.lifecycle = this.lifecycle === "connected" || this.lifecycle === "active" || this.lifecycle === "idle"
      ? "active"
      : this.lifecycle;
    await this.ctx.storage.put("lifecycle", this.lifecycle);
    await this.ctx.storage.put("idleExpiresAt", idleExpiresAt);
    await this.ctx.storage.setAlarm(idleExpiresAt);
    this.lastAlarmWriteAt = this.now();
  }

  enqueueMessage(data) {
    if (this.closed) return;
    const length = data instanceof Blob ? data.size : data instanceof ArrayBuffer ? data.byteLength : 0;
    if (!length || length > MAX_WS_MESSAGE) return this.protocolError("invalid_websocket_message");
    const cost = length + LIMITS.itemCost;
    if (this.ingressBytes + cost > LIMITS.ingressBytes || this.ingressItems >= LIMITS.ingressItems) {
      return this.protocolError("ingress_queue_limit");
    }
    this.ingressBytes += cost;
    this.ingressItems++;
    // Only decode/dispatch is serialized (including async Blob conversion).
    // TCP dialing, writes and crypto run independently in each stream's FIFO.
    this.messageChain = this.messageChain.then(() => this.onMessage(data))
      .catch(() => this.protocolError("message_handler_failed"))
      .finally(() => { this.ingressBytes -= cost; this.ingressItems--; });
    this.ctx.waitUntil(this.messageChain);
    return this.messageChain;
  }

  async onMessage(data) {
    if (this.closed) return;
    if (data instanceof Blob) data = await data.arrayBuffer();
    if (this.closed) return;
    if (!(data instanceof ArrayBuffer) || !data.byteLength || data.byteLength > MAX_WS_MESSAGE) {
      return this.protocolError("invalid_websocket_message");
    }
    let frames;
    try { frames = parseFrames(new Uint8Array(data)); }
    catch { return this.protocolError("frame_parse_failed"); }
    if (this.diagnostics) {
      this.trace("frames_received", { message: ++this.messageCount, bytes: data.byteLength,
        frames: frames.map(({ type, streamId, payload }) => ({ type, streamId, length: payload.length })) });
    }
    for (const frame of frames) {
      if (frame.streamId === 0) {
        if (frame.type !== FRAME.PONG || frame.payload.length > 64) return this.protocolError("invalid_control_frame");
      } else if (frame.type === FRAME.OPEN) this.openStream(frame);
      else if (frame.type === FRAME.DATA) this.queueWrite(frame);
      else if (frame.type === FRAME.WINDOW) this.addWindow(frame);
      else if (frame.type === FRAME.CLOSE) {
        if (frame.payload.length) return this.protocolError("invalid_close");
        if (!this.streams.has(frame.streamId) && !this.closedIds.has(frame.streamId)) return this.protocolError("unknown_stream");
        this.closeStream(frame.streamId, false);
      } else return this.protocolError("unknown_frame_type");
      if (this.closed) return;
    }
  }

  openStream(frame) {
    const id = frame.streamId;
    if (!id || frame.payload.length || this.streams.has(id) || this.closedIds.has(id)) return this.protocolError("invalid_open");
    if (this.streams.size >= this.maxStreams) { this.rememberClosed(id); return this.sendFrame(FRAME.CLOSE, id); }
    const stream = { id, socket: null, writer: null, handshake: new Uint8Array(), handshakeBytes: 0,
      receiveWindow: INITIAL_WINDOW, sendCredit: INITIAL_WINDOW, closed: false,
      queue: [], queueHead: 0, pendingBytes: 0, pendingItems: 0, draining: false,
      abort: new AbortController(), sent: [], sentHead: 0, downlinkBytes: 0, downlinkItems: 0 };
    stream.handshakeTimer = setTimeout(() => {
      this.trace("handshake_timeout", { streamId: id });
      this.closeStream(id, true);
    }, LIMITS.handshakeTimeout);
    this.streams.set(id, stream);
    this.trace("stream_opened", { streamId: id });
  }

  queueWrite(frame) {
    const stream = this.streams.get(frame.streamId);
    if (!stream) {
      if (this.closedIds.has(frame.streamId) && frame.payload.length) return;
      return this.protocolError("unknown_stream");
    }
    const length = frame.payload.length;
    if (!length || length > stream.receiveWindow) return this.protocolError("invalid_data_window");
    const cost = length + HEADER_SIZE + LIMITS.itemCost;
    if (stream.pendingBytes + cost > LIMITS.streamBytes || stream.pendingItems >= LIMITS.streamItems ||
        this.uplinkBytes + cost > LIMITS.uplinkBytes || this.uplinkItems >= LIMITS.uplinkItems) {
      this.trace("uplink_queue_limit", { streamId: stream.id });
      return this.closeStream(stream.id, true);
    }
    stream.receiveWindow -= length; // Admission, not completion, consumes credit.
    stream.pendingBytes += cost; stream.pendingItems++;
    this.uplinkBytes += cost; this.uplinkItems++;
    // Copy so one tiny queued frame cannot retain a whole 2 MiB carrier batch.
    stream.queue.push({ payload: new Uint8Array(frame.payload), cost });
    if (!stream.draining) {
      stream.draining = true;
      this.ctx.waitUntil(this.drainStream(stream));
    }
  }

  releaseWrite(stream, item) {
    stream.pendingBytes -= item.cost; stream.pendingItems--;
    this.uplinkBytes -= item.cost; this.uplinkItems--;
  }

  async drainStream(stream) {
    try {
      while (!stream.closed && !this.closed && stream.queueHead < stream.queue.length) {
        const item = stream.queue[stream.queueHead];
        stream.queue[stream.queueHead++] = null;
        try { await this.writeStream(stream, item.payload); }
        finally { this.releaseWrite(stream, item); }
        if (stream.queueHead === stream.queue.length) { stream.queue = []; stream.queueHead = 0; }
        else if (stream.queueHead >= 64) { stream.queue = stream.queue.slice(stream.queueHead); stream.queueHead = 0; }
      }
    } catch (error) {
      this.trace("stream_write_failed", { streamId: stream.id, stage: stream.writer ? "relay" : "handshake_or_connect", error: safeError(error) });
      this.closeStream(stream.id, true);
    } finally { stream.draining = false; }
  }

  active(stream) {
    if (stream.closed || this.closed) throw new Error("stream closed");
  }

  async writeStream(stream, payload) {
    this.active(stream);
    let grant = payload.length;
    if (!stream.writer) {
      // Only retain the 64-byte handshake, not all pre-authentication DATA.
      const take = Math.min(64 - stream.handshake.length, payload.length);
      const joined = new Uint8Array(stream.handshake.length + take);
      joined.set(stream.handshake); joined.set(payload.subarray(0, take), stream.handshake.length);
      stream.handshake = joined;
      stream.handshakeBytes += take;
      if (joined.length < 64) return; // Do not acknowledge unvalidated partial handshakes.
      if (!this.secret) this.secret = parseProxySecret(this.env.PROXY_SECRET).inner;
      const client = await acceptClientHandshake(joined, this.secret);
      this.active(stream);
      const tg = await createTelegramHandshake(client.tag, client.dcId);
      this.active(stream);
      clearTimeout(stream.handshakeTimer); stream.handshakeTimer = null;
      const started = this.diagnostics ? Date.now() : 0;
      const connectFn = this.connect || (await import("cloudflare:sockets")).connect;
      this.connect = connectFn;
      const socket = connectFn({ hostname: TELEGRAM_DCS[Math.abs(client.dcId)], port: 443 }, { allowHalfOpen: false });
      stream.socket = socket; // Track before awaiting: CLOSE must cancel in-flight dials.
      Promise.resolve(socket.closed).catch(() => {});
      await waitFor(socket.opened, stream.abort.signal, LIMITS.connectTimeout, "connect timeout");
      this.active(stream);
      this.trace("telegram_dc_connected", { streamId: stream.id, dcId: client.dcId, connectMs: started ? Date.now() - started : undefined });
      stream.writer = socket.writable.getWriter();
      stream.clientDecrypt = client.clientDecrypt; stream.clientEncrypt = client.clientEncrypt;
      stream.tgEncrypt = tg.encrypt; stream.tgDecrypt = tg.decrypt;
      stream.handshake = new Uint8Array();
      await waitFor(stream.writer.write(tg.wire), stream.abort.signal, LIMITS.writeTimeout, "write timeout");
      this.active(stream);
      this.ctx.waitUntil(this.readStream(stream));
      grant = stream.handshakeBytes + payload.length - take;
      stream.handshakeBytes = 0;
      payload = payload.subarray(take);
    }
    // Bound temporary crypto buffers; FIFO preserves the CTR position.
    for (let offset = 0; offset < payload.length; offset += DATA_CHUNK) {
      const plain = await stream.clientDecrypt.crypt(payload.subarray(offset, offset + DATA_CHUNK));
      this.active(stream);
      const encrypted = await stream.tgEncrypt.crypt(plain);
      this.active(stream);
      await waitFor(stream.writer.write(encrypted), stream.abort.signal, LIMITS.writeTimeout, "write timeout");
      this.active(stream);
    }
    this.grantWindow(stream, grant);
  }

  grantWindow(stream, length) {
    if (stream.closed || this.closed || !length) return;
    stream.receiveWindow += length;
    this.sendFrame(FRAME.WINDOW, stream.id, u32(length));
  }

  addWindow(frame) {
    if (frame.payload.length !== 4) return this.protocolError("invalid_window");
    const amount = new DataView(frame.payload.buffer, frame.payload.byteOffset, 4).getUint32(0);
    if (!amount) return this.protocolError("invalid_window");
    const stream = this.streams.get(frame.streamId);
    if (!stream) {
      if (this.closedIds.has(frame.streamId)) return;
      return this.protocolError("unknown_stream");
    }
    // Credit represents bytes drained by the client, not a way to grow memory.
    if (amount > INITIAL_WINDOW - stream.sendCredit) return this.protocolError("window_overflow");
    stream.sendCredit += amount;
    let remaining = amount;
    while (remaining) {
      const item = stream.sent[stream.sentHead];
      const used = Math.min(remaining, item.remaining);
      item.remaining -= used; remaining -= used;
      stream.downlinkBytes -= used; this.downlinkBytes -= used;
      if (!item.remaining) {
        const overhead = HEADER_SIZE + LIMITS.itemCost;
        stream.downlinkBytes -= overhead; this.downlinkBytes -= overhead;
        stream.downlinkItems--; this.downlinkItems--;
        stream.sent[stream.sentHead++] = null;
      }
    }
    if (stream.sentHead === stream.sent.length) { stream.sent = []; stream.sentHead = 0; }
    else if (stream.sentHead >= 64) { stream.sent = stream.sent.slice(stream.sentHead); stream.sentHead = 0; }
    this.wakeDownlink();
  }

  downlinkRoom(stream) {
    if (this.downlinkItems >= LIMITS.downlinkItems) return 0;
    return Math.max(0, Math.min(DATA_CHUNK, stream.sendCredit,
      LIMITS.downlinkBytes - this.downlinkBytes - HEADER_SIZE - LIMITS.itemCost));
  }

  async waitDownlink(stream) {
    while (!stream.closed && !this.closed && !this.downlinkRoom(stream)) {
      await new Promise((resolve) => this.downlinkWaiters.add(resolve));
    }
    return !stream.closed && !this.closed;
  }

  wakeDownlink() {
    const waiters = [...this.downlinkWaiters];
    this.downlinkWaiters.clear();
    for (const resolve of waiters) resolve();
  }

  async readStream(stream) {
    const reader = stream.socket.readable.getReader();
    try {
      while (await this.waitDownlink(stream)) {
        const { value, done } = await reader.read();
        if (done || stream.closed || this.closed) break;
        const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
        let offset = 0;
        while (offset < bytes.length && await this.waitDownlink(stream)) {
          // Recheck after await: another stream may have consumed shared capacity.
          const size = Math.min(bytes.length - offset, this.downlinkRoom(stream));
          if (!size) continue;
          const cost = size + HEADER_SIZE + LIMITS.itemCost;
          stream.sendCredit -= size;
          stream.sent.push({ remaining: size });
          stream.downlinkBytes += cost; stream.downlinkItems++;
          this.downlinkBytes += cost; this.downlinkItems++;
          const plain = await stream.tgDecrypt.crypt(bytes.subarray(offset, offset + size));
          this.active(stream);
          const encrypted = await stream.clientEncrypt.crypt(plain);
          this.active(stream);
          this.sendFrame(FRAME.DATA, stream.id, encrypted);
          offset += size;
        }
      }
    } catch (error) { this.trace("stream_read_failed", { streamId: stream.id, error: safeError(error) }); }
    finally {
      ignoreFailure(() => reader.cancel());
      try { reader.releaseLock(); } catch {}
      this.closeStream(stream.id, true);
    }
  }

  closeStream(id, notify) {
    const stream = this.streams.get(id);
    if (!stream) return;
    this.streams.delete(id); this.rememberClosed(id);
    stream.closed = true;
    clearTimeout(stream.handshakeTimer); stream.handshakeTimer = null;
    stream.abort.abort();
    for (let i = stream.queueHead; i < stream.queue.length; i++) this.releaseWrite(stream, stream.queue[i]);
    stream.queue = []; stream.queueHead = 0; stream.handshake = new Uint8Array();
    this.downlinkBytes -= stream.downlinkBytes; this.downlinkItems -= stream.downlinkItems;
    stream.downlinkBytes = 0; stream.downlinkItems = 0; stream.sent = []; stream.sentHead = 0;
    this.wakeDownlink();
    ignoreFailure(() => stream.writer?.abort());
    ignoreFailure(() => stream.socket?.close());
    this.trace("stream_closed", { streamId: id, notify });
    if (notify && !this.closed) this.sendFrame(FRAME.CLOSE, id);
  }

  rememberClosed(id) {
    this.closedIds.add(id);
    if (this.closedIds.size > 4096) this.closedIds.delete(this.closedIds.values().next().value);
  }

  sendFrame(type, streamId, payload = new Uint8Array()) {
    if (this.closed || !this.ws || this.ws.readyState !== 1) return;
    try { this.ws.send(encodeFrame(type, streamId, payload)); }
    catch { this.shutdown("websocket_send_failed"); }
  }

  protocolError(reason = "protocol_error") {
    this.trace("protocol_error", { reason });
    this.sendFrame(FRAME.BYE, 0);
    this.shutdown(reason);
  }

  shutdown(reason = "shutdown") {
    if (this.closed) return;
    this.trace("session_shutdown", { reason, streams: this.streams.size });
    this.closed = true;
    for (const id of [...this.streams.keys()]) this.closeStream(id, false);
    this.wakeDownlink();
    try { this.ws?.close(1000, "session closed"); } catch {}
    this.ws = null;
    this.lifecycle = this.lifecycle === "expired" ? "expired" : "closed";
    // Do not let a later isolate resurrect a deleted/failed session.
    this.ctx.waitUntil(
      Promise.resolve(
        this.ctx.storage.put("lifecycle", this.lifecycle).then(() =>
          this.ctx.storage.delete(["unconnectedExpiresAt", "idleExpiresAt", "expiresAt"])
        )
      ).catch(() => {})
    );
  }
}

export function waitFor(promise, signal, timeout, reason) {
  return new Promise((resolve, reject) => {
    const aborted = () => finish(reject, new Error("stream closed"));
    let timer, settled = false;
    const finish = (settle, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener("abort", aborted);
      settle(value);
    };
    // Always attach handlers, even if cancellation already happened.
    Promise.resolve(promise).then(value => finish(resolve, value), error => finish(reject, error));
    if (signal.aborted) return aborted();
    signal.addEventListener("abort", aborted, { once: true });
    timer = setTimeout(() => finish(reject, new Error(reason)), timeout);
  });
}

function ignoreFailure(fn) { try { Promise.resolve(fn()).catch(() => {}); } catch {} }
function safeError(error) { return error instanceof Error ? error.name + ": " + error.message.slice(0, 160) : "I/O error"; }
