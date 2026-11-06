// cloudflare:sockets is loaded dynamically inside RelaySession to keep the Worker module valid
// after Object.assign(globalThis, ...) preamble (static import after statements breaks ESM).
import { RelaySession } from './session.js';
import { FRAME, encodeFrame, parseFrames, clampInt } from './protocol';
import { bridgePage } from './bridge';
import type { BootstrapPayload, TwpEnv } from './types';
import { DEFAULT_SESSION_TTL_SECONDS } from './types';

export async function handleTelegramWebProxy(request: Request, env: TwpEnv): Promise<Response | null> {
	if (!env || !env.SESSIONS || typeof env.SESSIONS.get !== 'function') {
		return null;
	}
	try {
		return await route(request, env);
	} catch (error) {
		console.error('unhandled TWP request error', error);
		return camouflage();
	}
}

export class WebProxySession extends RelaySession {
	constructor(ctx: DurableObjectState, env: TwpEnv) {
		super(ctx, env, null);
	}
}

async function route(request: Request, env: TwpEnv): Promise<Response | null> {
	const url = new URL(request.url);
	const expectedHost = canonicalHost(env.PUBLIC_HOSTNAME || url.hostname);
	if (canonicalHost(url.hostname) !== expectedHost) return camouflage();

	if (url.pathname === '/' && request.method === 'GET') {
		const capability = exactBridgeQuery(url);
		const telegram = exactTelegramQuery(url, expectedHost, env.PROXY_SECRET);
		if (!capability && !telegram) {
			return null;
		}
		if (capability && !(await capabilityMatches(capability, expectedHost, env.PROXY_SECRET))) {
			return camouflage();
		}
		if (!env.SESSION_SIGNING_SECRET) {
			return new Response('Telegram Web Proxy signing secret is not configured', {
				status: 503,
				headers: { 'Content-Type': 'text/plain; charset=utf-8', ...noStore() }
			});
		}
		const bootstrap = await createBootstrap(env);
		return bridgePage(expectedHost, bootstrap);
	}

	if (url.pathname === '/api/v1/session') {
		if (request.headers.has('Cookie')) return camouflage();
		if (request.method === 'DELETE') {
			const token = bearer(request);
			if (!(await verifySessionToken(env, expectedHost, token))) return camouflage();
			const stub = env.SESSIONS!.get(env.SESSIONS!.idFromName(token!));
			await stub.fetch('https://session/internal/close', { method: 'POST' });
			return new Response(null, { status: 204, headers: noStore() });
		}
		if (request.method !== 'POST' || !isBinary(request.headers.get('Content-Type'))) return camouflage();
		const bootstrap = bearer(request);
		if (!bootstrap) return camouflage();
		const jti = await verifyBootstrap(env, bootstrap);
		if (!jti) return camouflage();

		// Validate Hello BEFORE consuming the one-time bootstrap token so a
		// malformed request cannot burn a valid jti.
		const hello = await readHello(request);
		if (!isHello(hello)) return camouflage();

		// Atomic one-time consumption via Durable Object concurrency block.
		const consumed = await consumeBootstrapOnce(env, jti);
		if (!consumed) return camouflage();

		const sessionToken = await createSessionToken(env, expectedHost);
		const stub = env.SESSIONS!.get(env.SESSIONS!.idFromName(sessionToken));
		const initRes = await stub.fetch('https://session/internal/init', { method: 'POST' });
		if (!initRes.ok) return camouflage();
		return new Response(Uint8Array.from(encodeFrame(FRAME.HELLO, 0, new Uint8Array([1]))), {
			status: 200,
			headers: {
				...noStore(),
				'Content-Type': 'application/octet-stream',
				Authorization: `Bearer ${sessionToken}`
			}
		});
	}

	if (url.pathname === '/api/v1/ws' && request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
		const protocols = (request.headers.get('Sec-WebSocket-Protocol') || '').split(',').map((v) => v.trim());
		const protocol = protocols.find((v) => v.startsWith('tproxy-v1.'));
		const token = protocol?.slice('tproxy-v1.'.length);
		if (!(await verifySessionToken(env, expectedHost, token))) return camouflage();
		const stub = env.SESSIONS!.get(env.SESSIONS!.idFromName(token!));
		return stub.fetch('https://session/internal/ws', {
			headers: { Upgrade: 'websocket', 'X-TProxy-Protocol': protocol || '' }
		});
	}

	return null;
}

function camouflage(): Response {
	return new Response('<!doctype html><meta charset=utf-8><title>Not found</title><h1>Not found</h1>', {
		status: 404,
		headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
	});
}

function exactTelegramQuery(url: URL, host: string, secret: string | undefined): boolean {
	if (url.searchParams.size !== 2 || !url.searchParams.has('server') || !url.searchParams.has('secret')) return false;
	return (
		canonicalHost(url.searchParams.get('server')) === canonicalHost(host) &&
		url.searchParams.get('secret') === String(secret || '')
	);
}

function exactBridgeQuery(url: URL): string | null {
	if (url.searchParams.size !== 1 || !url.searchParams.has('bridge')) return null;
	const value = url.searchParams.get('bridge');
	return /^[A-Za-z0-9_-]{43}$/.test(value || '') && url.search === `?bridge=${value}` ? value : null;
}

async function capabilityMatches(candidate: string, host: string, hexSecret: string | undefined): Promise<boolean> {
	if (!/^(?:[0-9a-f]{32}|dd[0-9a-f]{32})$/.test(String(hexSecret || ''))) return false;
	const secret = hexToBytes(String(hexSecret));
	const context = new TextEncoder().encode(`tdesktop-web-proxy-bridge-v1\n${host}`);
	const expected = base64url(await hmac(secret, context));
	return constantTimeEqual(candidate, expected);
}

async function createBootstrap(env: TwpEnv): Promise<string> {
	const ttl = clampInt(env.SESSION_TTL_SECONDS, 30, 600, DEFAULT_SESSION_TTL_SECONDS);
	const payloadObj: BootstrapPayload = {
		pur: 'bootstrap',
		jti: randomToken(16),
		exp: Math.floor(Date.now() / 1000) + ttl
	};
	const payload = base64url(new TextEncoder().encode(JSON.stringify(payloadObj)));
	const signature = base64url(await hmac(signingKey(env), new TextEncoder().encode(payload)));
	return `${payload}.${signature}`;
}

/** Returns jti when valid; otherwise null. Does not consume. */
async function verifyBootstrap(env: TwpEnv, token: string): Promise<string | null> {
	const [payload, signature, extra] = token.split('.');
	if (!payload || !signature || extra) return null;
	const expected = base64url(await hmac(signingKey(env), new TextEncoder().encode(payload)));
	if (!constantTimeEqual(signature, expected)) return null;
	try {
		const data = JSON.parse(new TextDecoder().decode(base64urlDecode(payload))) as BootstrapPayload;
		if (data.pur !== 'bootstrap' || typeof data.jti !== 'string' || typeof data.exp !== 'number') {
			return null;
		}
		if (!Number.isFinite(data.exp) || !Number.isInteger(data.exp)) return null;
		if (!/^[A-Za-z0-9_-]{8,128}$/.test(data.jti)) return null;
		if (data.exp < Math.floor(Date.now() / 1000)) return null;
		return data.jti;
	} catch {
		return null;
	}
}

/**
 * Consume bootstrap jti exactly once using a dedicated Durable Object instance
 * and blockConcurrencyWhile for atomicity under concurrent requests.
 */
async function consumeBootstrapOnce(env: TwpEnv, jti: string): Promise<boolean> {
	const stub = env.SESSIONS!.get(env.SESSIONS!.idFromName('__twp_bootstrap_ledger__'));
	const res = await stub.fetch('https://session/internal/bootstrap-consume', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ jti })
	});
	return res.status === 204;
}

function signingKey(env: TwpEnv): Uint8Array {
	const secret = env.SESSION_SIGNING_SECRET;
	if (!secret) {
		throw new Error('SESSION_SIGNING_SECRET is not configured');
	}
	return new TextEncoder().encode(`twp-cf/session-signing/v1\n${secret}`);
}

async function hmac(keyBytes: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
	const keyBuf = new Uint8Array(keyBytes);
	const dataBuf = new Uint8Array(data);
	const key = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return new Uint8Array(await crypto.subtle.sign('HMAC', key, dataBuf));
}

async function createSessionToken(env: TwpEnv, host: string): Promise<string> {
	const nonce = crypto.getRandomValues(new Uint8Array(16));
	const mac = await sessionMac(env, host, nonce);
	const bytes = new Uint8Array(32);
	bytes.set(nonce);
	bytes.set(mac.subarray(0, 16), 16);
	return base64url(bytes);
}

async function verifySessionToken(env: TwpEnv, host: string, token: string | undefined | null): Promise<boolean> {
	if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
	const bytes = base64urlDecode(token);
	if (base64url(bytes) !== token) return false;
	const nonce = bytes.subarray(0, 16);
	const mac = await sessionMac(env, host, nonce);
	return constantTimeEqual(base64url(bytes.subarray(16)), base64url(mac.subarray(0, 16)));
}

async function sessionMac(env: TwpEnv, host: string, nonce: Uint8Array): Promise<Uint8Array> {
	const context = new TextEncoder().encode('twp-cf/session-token/v1\n' + host + '\n');
	const bytes = new Uint8Array(context.length + nonce.length);
	bytes.set(context);
	bytes.set(nonce, context.length);
	return hmac(signingKey(env), bytes);
}

async function readHello(request: Request): Promise<Uint8Array> {
	if (!request.body) return new Uint8Array();
	const reader = request.body.getReader();
	const bytes = new Uint8Array(9);
	let length = 0;
	try {
		for (;;) {
			const { value, done } = await reader.read();
			if (done) return bytes.subarray(0, length);
			if (!value) continue;
			if (length + value.length > bytes.length) {
				await reader.cancel();
				return new Uint8Array();
			}
			bytes.set(value, length);
			length += value.length;
		}
	} finally {
		reader.releaseLock();
	}
}

function isHello(bytes: Uint8Array): boolean {
	try {
		const frames = parseFrames(bytes);
		return (
			frames.length === 1 &&
			frames[0].type === FRAME.HELLO &&
			frames[0].streamId === 0 &&
			frames[0].payload.length === 1 &&
			frames[0].payload[0] === 1
		);
	} catch {
		return false;
	}
}

function bearer(request: Request): string {
	const value = request.headers.get('Authorization') || '';
	return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function isBinary(value: string | null): boolean {
	return /^application\/octet-stream(?:\s*;.*)?$/i.test(value || '');
}
function noStore(): Record<string, string> {
	return { 'Cache-Control': 'no-store' };
}
function canonicalHost(value: string | null | undefined): string {
	return String(value || '')
		.trim()
		.toLowerCase()
		.replace(/\.$/, '');
}
function randomToken(bytes: number): string {
	const value = new Uint8Array(bytes);
	crypto.getRandomValues(value);
	return base64url(value);
}
function hexToBytes(hex: string): Uint8Array {
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}
function base64url(bytes: Uint8Array): string {
	let s = '';
	for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64urlDecode(value: string): Uint8Array {
	const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
	const raw = atob(padded);
	return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
function constantTimeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

export const _test = {
	FRAME,
	encodeFrame,
	parseFrames,
	isHello,
	exactBridgeQuery,
	createBootstrap,
	verifyBootstrap,
	signingKey,
	constantTimeEqual
};
