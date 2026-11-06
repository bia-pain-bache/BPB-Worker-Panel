import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);

// Load session.js via dynamic import (ESM)
const sessionMod = await import(join(root, 'src/protocols/telegram-web-proxy/session.js'));
const { RelaySession } = sessionMod;

/** Minimal Durable Object storage + alarm fake. */
function createFakeCtx() {
  const map = new Map();
  let alarmAt = null;
  const ctx = {
    storage: {
      async get(keyOrKeys) {
        if (Array.isArray(keyOrKeys)) {
          const out = new Map();
          for (const k of keyOrKeys) out.set(k, map.has(k) ? map.get(k) : undefined);
          return out;
        }
        return map.has(keyOrKeys) ? map.get(keyOrKeys) : undefined;
      },
      async put(keyOrObj, value) {
        if (typeof keyOrObj === 'object' && keyOrObj !== null && value === undefined) {
          for (const [k, v] of Object.entries(keyOrObj)) map.set(k, v);
          return;
        }
        map.set(keyOrObj, value);
      },
      async delete(keyOrKeys) {
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
        let n = 0;
        for (const k of keys) {
          if (map.delete(k)) n++;
        }
        return n;
      },
      async deleteAll() {
        map.clear();
        alarmAt = null;
      },
      async list({ prefix } = {}) {
        const out = new Map();
        for (const [k, v] of map) {
          if (!prefix || k.startsWith(prefix)) out.set(k, v);
        }
        return out;
      },
      async getAlarm() {
        return alarmAt;
      },
      async setAlarm(ts) {
        alarmAt = ts;
      },
      async deleteAlarm() {
        alarmAt = null;
      },
    },
    blockConcurrencyWhile: async (fn) => fn(),
    waitUntil: () => {},
    /** test helper */
    _map: map,
    _getAlarm: () => alarmAt,
  };
  return ctx;
}

function createClock(start = 1_000_000) {
  let t = start;
  return {
    now: () => t,
    advance: (ms) => {
      t += ms;
      return t;
    },
    set: (v) => {
      t = v;
      return t;
    },
  };
}

const env = {
  SESSION_TTL_SECONDS: '300', // 5 min unconnected
  SESSION_IDLE_SECONDS: '900', // 15 min idle
  MAX_STREAMS: '64',
  MAX_SESSIONS_PER_WINDOW: '60',
};

describe('Session lifecycle and Alarm regression', () => {
  it('persists unconnected deadline on init', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    const res = await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    assert.equal(res.status, 204);
    assert.equal(session.lifecycle, 'waiting_connection');
    const stored = await ctx.storage.get('unconnectedExpiresAt');
    assert.equal(stored, clock.now() + 300_000);
    assert.equal(ctx._getAlarm(), clock.now() + 300_000);
  });

  it('expires abandoned session after unconnected TTL', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    clock.advance(300_001);
    await session.alarm();
    assert.equal(session.closed, true);
    assert.equal(session.lifecycle, 'expired');
  });

  it('REGRESSION: connected session survives original unconnected TTL', async () => {
    // 1. Create at T
    const clock = createClock(1_000_000);
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    const unconnectedDeadline = clock.now() + 300_000; // T+5min

    // 2. Connect at T+4min
    clock.advance(240_000);
    // WebSocketPair is not available in Node — stub the path by simulating connect side-effects
    // via direct state transition that mirrors production /internal/ws success path.
    session.initialized = true;
    session.lifecycle = 'connected';
    session.lastActivityAt = clock.now();
    await ctx.storage.delete('unconnectedExpiresAt');
    session.unconnectedExpiresAt = 0;
    await session.scheduleIdleAlarm(true);

    const idleDeadline = await ctx.storage.get('idleExpiresAt');
    assert.ok(typeof idleDeadline === 'number');
    assert.equal(idleDeadline, clock.now() + 900_000); // 15 min idle
    assert.equal(await ctx.storage.get('unconnectedExpiresAt'), undefined);

    // 3. Advance past original unconnected TTL (T+5min) while still within idle window
    clock.set(unconnectedDeadline + 1);
    await session.alarm();

    // 4. Session must remain alive
    assert.equal(session.closed, false);
    assert.notEqual(session.lifecycle, 'expired');
    assert.ok(['connected', 'active', 'idle'].includes(session.lifecycle) || session.lifecycle === 'connected');

    // 5. Advance past idle deadline and expire
    clock.set(idleDeadline + 1);
    // Reconstruct lifecycle from storage as a real DO would
    const session2 = new RelaySession(ctx, env, null, { now: clock.now });
    await session2.alarm();
    assert.equal(session2.closed, true);
    assert.equal(session2.lifecycle, 'expired');
  });

  it('activity extends idle deadline', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    session.initialized = true;
    session.lifecycle = 'connected';
    await ctx.storage.delete('unconnectedExpiresAt');
    await session.scheduleIdleAlarm(true);
    const firstIdle = await ctx.storage.get('idleExpiresAt');

    clock.advance(60_000);
    // force schedule (bypass debounce)
    session.lastAlarmWriteAt = 0;
    await session.scheduleIdleAlarm(true);
    const secondIdle = await ctx.storage.get('idleExpiresAt');
    assert.ok(secondIdle > firstIdle);
  });

  it('alarm before expiry re-arms next deadline', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    const deadline = await ctx.storage.get('unconnectedExpiresAt');
    clock.advance(10_000); // still before expiry
    await session.alarm();
    assert.equal(session.closed, false);
    assert.equal(ctx._getAlarm(), deadline);
  });

  it('reconstructed DO respects persisted lifecycle', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const s1 = new RelaySession(ctx, env, null, { now: clock.now });
    await s1.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    // Evict: new instance, same storage
    const s2 = new RelaySession(ctx, env, null, { now: clock.now });
    assert.equal(s2.lifecycle, 'created'); // in-memory default
    clock.advance(300_001);
    await s2.alarm(); // loads from storage
    assert.equal(s2.closed, true);
    assert.equal(s2.lifecycle, 'expired');
  });

  it('repeated shutdown is idempotent', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const session = new RelaySession(ctx, env, null, { now: clock.now });
    await session.fetch(new Request('https://session/internal/init', { method: 'POST' }));
    session.shutdown('test');
    session.shutdown('test-again');
    assert.equal(session.closed, true);
    assert.equal(session.ingressBytes, 0);
  });

  it('bootstrap ledger cleans expired and reschedules remaining', async () => {
    const clock = createClock(1_000_000);
    const ctx = createFakeCtx();
    const ledger = new RelaySession(ctx, env, null, { now: clock.now });

    // Insert two JTIs with different expiries
    await ctx.storage.put('boot:jti-a', clock.now());
    await ctx.storage.put('bootexp:jti-a', clock.now() + 1_000);
    await ctx.storage.put('boot:jti-b', clock.now());
    await ctx.storage.put('bootexp:jti-b', clock.now() + 10_000);
    await ctx.storage.setAlarm(clock.now() + 1_000);

    clock.advance(1_500); // expire jti-a only
    await ledger.alarm();

    assert.equal(await ctx.storage.get('boot:jti-a'), undefined);
    assert.equal(await ctx.storage.get('bootexp:jti-a'), undefined);
    assert.equal(await ctx.storage.get('boot:jti-b'), clock.now() - 1_500);
    assert.equal(ctx._getAlarm(), 1_000_000 + 10_000);
  });

  it('bootstrap consume is one-time under concurrency block', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const ledger = new RelaySession(ctx, env, null, { now: clock.now });

    const req = (jti) =>
      new Request('https://session/internal/bootstrap-consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jti }),
      });

    const r1 = await ledger.fetch(req('abc12345'));
    const r2 = await ledger.fetch(req('abc12345'));
    assert.equal(r1.status, 204);
    assert.equal(r2.status, 409);
  });

  it('bootstrap rate limit returns 429', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const limitedEnv = { ...env, MAX_SESSIONS_PER_WINDOW: '2' };
    const ledger = new RelaySession(ctx, limitedEnv, null, { now: clock.now });

    const req = (jti) =>
      new Request('https://session/internal/bootstrap-consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jti }),
      });

    assert.equal((await ledger.fetch(req('jtiaaaaa'))).status, 204);
    assert.equal((await ledger.fetch(req('jtibbbbb'))).status, 204);
    assert.equal((await ledger.fetch(req('jticcccc'))).status, 429);
  });
  it('capacity reserve respects MAX_ACTIVE_SESSIONS', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const limited = { ...env, MAX_ACTIVE_SESSIONS: '2' };
    const ledger = new RelaySession(ctx, limited, null, { now: clock.now });

    const reserve = (id) =>
      ledger.fetch(
        new Request('https://session/internal/capacity-reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: id }),
        })
      );

    assert.equal((await reserve('s1')).status, 204);
    assert.equal((await reserve('s2')).status, 204);
    assert.equal((await reserve('s3')).status, 429);
    // release one and retry
    await ledger.fetch(
      new Request('https://session/internal/capacity-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 's1' }),
      })
    );
    assert.equal((await reserve('s3')).status, 204);
  });

  it('capacity release is idempotent', async () => {
    const clock = createClock();
    const ctx = createFakeCtx();
    const ledger = new RelaySession(ctx, env, null, { now: clock.now });
    const body = (id) =>
      new Request('https://session/internal/capacity-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      });
    assert.equal((await ledger.fetch(body('none'))).status, 204);
    assert.equal((await ledger.fetch(body('none'))).status, 204);
  });
});
