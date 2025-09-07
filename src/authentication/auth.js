import { SignJWT, jwtVerify } from 'jose';
import { respond } from '../helpers/helpers';

export async function generateJWTToken(request, env) {
    if (request.method !== 'POST') return await respond(false, 405, 'Method not allowed.');
    const password = await request.text();
    const savedPass = await env.kv.get('pwd');
    if (password !== savedPass) return await respond(false, 401, 'Wrong password.');
    let secretKey = await env.kv.get('secretKey');
    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.kv.put('secretKey', secretKey);
    }
    const secret = new TextEncoder().encode(secretKey);
    const jwtToken = await new SignJWT({ userID: globalThis.userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

    return await respond(true, 200, 'Successfully generated Auth token', null, {
        'Set-Cookie': `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`,
        'Content-Type': 'text/plain',
    });
}

function generateSecretKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function Authenticate(request, env) {
    try {
        const secretKey = await env.kv.get('secretKey');
        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)jwtToken=([^;]*)/);
        const token = cookie ? cookie[2] : null;

        if (!token) {
            console.log('Unauthorized: Token not available!');
            return false;
        }

        const { payload } = await jwtVerify(token, secret);
        console.log(`Successfully authenticated, User ID: ${payload.userID}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function logout() {
    return await respond(true, 200, 'Successfully logged out!', null, {
        'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain'
    });
}

export async function resetPassword(request, env) {
    let auth = await Authenticate(request, env);
    const oldPwd = await env.kv.get('pwd');
    if (oldPwd && !auth) return await respond(false, 401, 'Unauthorized.');
    const newPwd = await request.text();
    if (newPwd === oldPwd) return await respond(false, 400, 'Please enter a new Password.');
    await env.kv.put('pwd', newPwd);
    return await respond(true, 200, 'Successfully logged in!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain',
    });
}