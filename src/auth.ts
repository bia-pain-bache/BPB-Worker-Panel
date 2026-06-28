import { SignJWT, jwtVerify } from 'jose';
import { HttpStatus, respond } from '@common';

const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

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

export async function generateJWTToken(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const password = await request.text();
    const savedPass = await env.kv.get('pwd');

    if (!savedPass || !timingSafeEqual(password, savedPass)) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Wrong password.');
    }

    let secretKey = await env.kv.get('secretKey');

    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.kv.put('secretKey', secretKey);
    }

    const secret = new TextEncoder().encode(secretKey);
    const { userID } = globalThis.globalConfig;

    const jwtToken = await new SignJWT({ userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
        .sign(secret);

    return respond(true, HttpStatus.OK, 'Successfully generated Auth token', null, {
        'Set-Cookie': `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${SESSION_DURATION_SECONDS}; Path=/; SameSite=Strict`,
        'Content-Type': 'text/plain',
    });
}

function generateSecretKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function authenticate(request: Request, env: Env): Promise<boolean> {
    try {
        const secretKey = await env.kv.get('secretKey');

        if (secretKey === null) {
            return false;
        }

        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)jwtToken=([^;]*)/);
        const token = cookie ? cookie[2] : null;

        if (!token) {
            return false;
        }

        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export const Authenticate = authenticate;

export async function resetPassword(request: Request, env: Env): Promise<Response> {
    const auth = await authenticate(request, env);
    const oldPwd = await env.kv.get('pwd');

    if (oldPwd && !auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
    }

    const newPwd = await request.text();

    if (oldPwd && timingSafeEqual(newPwd, oldPwd)) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Please enter a new Password.');
    }

    await env.kv.put('pwd', newPwd);

    return respond(true, HttpStatus.OK, 'Password reset successfully!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain',
    });
}