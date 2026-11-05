// @ts-nocheck

import { connect } from "cloudflare:sockets";
import { RelaySession } from "./session";
import { FRAME, encodeFrame, parseFrames, clampInt } from "./protocol";
import { bridgePage } from "./bridge";

export async function handleTelegramWebProxy(request, env) {
  if (!env || !env.SESSIONS || typeof env.SESSIONS.get !== "function") {
    return null;
  }
  try {
    return await route(request, env);
  } catch (error) {
    console.error("unhandled TWP request error", error);
    return camouflage();
  }
}

export class WebProxySession extends RelaySession {
  constructor(ctx, env) { super(ctx, env, connect); }
}

async function route(request, env) {
  const url = new URL(request.url);
  const expectedHost = canonicalHost(env.PUBLIC_HOSTNAME || url.hostname);
  if (canonicalHost(url.hostname) !== expectedHost) return camouflage();

  if (url.pathname === "/" && request.method === "GET") {
    const capability = exactBridgeQuery(url);
    const telegram = exactTelegramQuery(url, expectedHost, env.PROXY_SECRET);
    if (!capability && !telegram) {
      return null;
    }
    if (capability && !(await capabilityMatches(capability, expectedHost, env.PROXY_SECRET))) {
      return camouflage();
    }
    const bootstrap = await createBootstrap(env, request.headers.get("CF-Connecting-IP") || "");
    return bridgePage(expectedHost, bootstrap);
  }

  if (url.pathname === "/api/v1/session") {
    if (request.headers.has("Cookie")) return camouflage();
    if (request.method === "DELETE") {
      const token = bearer(request);
      if (!(await verifySessionToken(env, expectedHost, token))) return camouflage();
      const stub = env.SESSIONS.get(env.SESSIONS.idFromName(token));
      await stub.fetch("https://session/internal/close", { method: "POST" });
      return new Response(null, { status: 204, headers: noStore() });
    }
    if (request.method !== "POST" || !isBinary(request.headers.get("Content-Type"))) return camouflage();
    const bootstrap = bearer(request);
    if (!bootstrap || !(await verifyBootstrap(env, bootstrap, request.headers.get("CF-Connecting-IP") || ""))) return camouflage();
    const hello = await readHello(request);
    if (!isHello(hello)) return camouflage();

    const sessionToken = await createSessionToken(env, expectedHost);
    const stub = env.SESSIONS.get(env.SESSIONS.idFromName(sessionToken));
    const init = await stub.fetch("https://session/internal/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!init.ok) return camouflage();

    const welcome = encodeFrame(FRAME.WELCOME, 0);
    return new Response(welcome, {
      status: 200,
      headers: {
        ...noStore(),
        "Content-Type": "application/octet-stream",
        "X-Session-Token": sessionToken,
        "X-Carrier-Mode": "websocket",
        "X-Down-Cursor": "0",
      },
    });
  }

  if (url.pathname === "/api/v1/ws" && request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
    const protocols = (request.headers.get("Sec-WebSocket-Protocol") || "").split(",").map((v) => v.trim());
    const protocol = protocols.find((v) => v.startsWith("tproxy-v1."));
    const token = protocol?.slice("tproxy-v1.".length);
    if (!(await verifySessionToken(env, expectedHost, token))) return camouflage();
    const stub = env.SESSIONS.get(env.SESSIONS.idFromName(token));
    return stub.fetch("https://session/internal/ws", {
      headers: { Upgrade: "websocket", "X-TProxy-Protocol": protocol },
    });
  }

  if (url.pathname === "/healthz" && request.method === "GET") {
    return Response.json({ ok: true, carrier: "websocket", relay: "direct-telegram-dc" }, { headers: noStore() });
  }

  return null;
}

function camouflage() {
  return new Response("<!doctype html><meta charset=utf-8><title>Not found</title><h1>Not found</h1>", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function exactTelegramQuery(url, host, secret) {
  if (url.searchParams.size !== 2 || !url.searchParams.has("server") || !url.searchParams.has("secret")) return false;
  return canonicalHost(url.searchParams.get("server")) === canonicalHost(host) && url.searchParams.get("secret") === String(secret || "");
}

function exactBridgeQuery(url) {
  if (url.searchParams.size !== 1 || !url.searchParams.has("bridge")) return null;
  const value = url.searchParams.get("bridge");
  return /^[A-Za-z0-9_-]{43}$/.test(value || "") && url.search === `?bridge=${value}` ? value : null;
}

async function capabilityMatches(candidate, host, hexSecret) {
  if (!/^(?:[0-9a-f]{32}|dd[0-9a-f]{32})$/.test(String(hexSecret || ""))) return false;
  const secret = hexToBytes(hexSecret);
  const context = new TextEncoder().encode(`tdesktop-web-proxy-bridge-v1\n${host}`);
  const expected = base64url(await hmac(secret, context));
  return constantTimeEqual(candidate, expected);
}

async function createBootstrap(env, _ip) {
  const ttl = clampInt(env.SESSION_TTL_SECONDS, 30, 600, 300);
  const payload = base64url(new TextEncoder().encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + ttl, n: randomToken(16) })));
  const signature = base64url(await hmac(signingKey(env), new TextEncoder().encode(payload)));
  return `${payload}.${signature}`;
}

async function verifyBootstrap(env, token, _ip) {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = base64url(await hmac(signingKey(env), new TextEncoder().encode(payload)));
  if (!constantTimeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    return Number.isInteger(data.exp) && data.exp >= Math.floor(Date.now() / 1000);
  } catch { return false; }
}

function signingKey(env) {
  // Domain separation lets one user-supplied proxy secret safely serve both
  // MTProxy authentication and short-lived bootstrap-token signing.
  return new TextEncoder().encode(`twp-cf/session-signing/v1\n${String(env.PROXY_SECRET || "")}`);
}

async function hmac(keyBytes, data) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
}

// Keep the opaque 43-character wire format, but reject fabricated credentials
// before they can allocate or address a Durable Object.
async function createSessionToken(env, host) {
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const mac = await sessionMac(env, host, nonce);
  const bytes = new Uint8Array(32); bytes.set(nonce); bytes.set(mac.subarray(0, 16), 16);
  return base64url(bytes);
}
async function verifySessionToken(env, host, token) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token || "")) return false;
  const bytes = base64urlDecode(token);
  if (base64url(bytes) !== token) return false;
  const mac = await sessionMac(env, host, bytes.subarray(0, 16));
  return constantTimeEqual(base64url(bytes.subarray(16)), base64url(mac.subarray(0, 16)));
}
function sessionMac(env, host, nonce) {
  const context = new TextEncoder().encode("twp-cf/session-token/v1\n" + host + "\n");
  const bytes = new Uint8Array(context.length + nonce.length); bytes.set(context); bytes.set(nonce, context.length);
  return hmac(signingKey(env), bytes);
}
async function readHello(request) {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader(), bytes = new Uint8Array(9);
  let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return bytes.subarray(0, length);
      if (length + value.length > bytes.length) {
        await reader.cancel(); return new Uint8Array();
      }
      bytes.set(value, length); length += value.length;
    }
  } finally { reader.releaseLock(); }
}

function isHello(bytes) {
  try {
    const frames = parseFrames(bytes);
    return frames.length === 1 && frames[0].type === FRAME.HELLO && frames[0].streamId === 0 && frames[0].payload.length === 1 && frames[0].payload[0] === 1;
  } catch { return false; }
}

function bearer(request) {
  const value = request.headers.get("Authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function isBinary(value) {
  return /^application\/octet-stream(?:\s*;.*)?$/i.test(value || "");
}
function noStore() { return { "Cache-Control": "no-store" }; }
function canonicalHost(value) { return String(value || "").trim().toLowerCase().replace(/\.$/, ""); }
function randomToken(bytes) { const value = new Uint8Array(bytes); crypto.getRandomValues(value); return base64url(value); }
function hexToBytes(hex) { const out = new Uint8Array(hex.length / 2); for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16); return out; }
function base64url(bytes) { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function base64urlDecode(value) { const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4); const raw = atob(padded); return Uint8Array.from(raw, (c) => c.charCodeAt(0)); }
function constantTimeEqual(a, b) { if (a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }

export const _test = { FRAME, encodeFrame, parseFrames, isHello, exactBridgeQuery };
