import { SignJWT, jwtVerify } from 'jose';
import nacl from 'tweetnacl';
import { renderLoginPage } from '../pages/login';

async function generateJWTToken (request, env) {
    const password = await request.text();
    const savedPass = await env.bpb.get('pwd');
    if (password !== savedPass) return new Response('Method Not Allowed', { status: 405 });
    let secretKey = await env.bpb.get('secretKey');
    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.bpb.put('secretKey', secretKey);
    }
    const secret = new TextEncoder().encode(secretKey);
    const jwtToken = await new SignJWT({ userID: globalThis.userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

    return new Response('Success', {
        status: 200,
        headers: {
            'Set-Cookie': `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`,
            'Content-Type': 'text/plain',
        }
    });
}

function generateSecretKey () {
    const key = nacl.randomBytes(32);
    return Array.from(key, byte => byte.toString(16).padStart(2, '0')).join('');
}
  
export async function Authenticate (request, env) {
    try {
        const secretKey = await env.bpb.get('secretKey');
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

export function logout() {
    return new Response('Success', {
        status: 200,
        headers: {
            'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Content-Type': 'text/plain'
        }
    });
}

export async function resetPassword(request, env) {
    let auth = await Authenticate(request, env);
    const oldPwd = await env.bpb.get('pwd');
    if (oldPwd && !auth) return new Response('Unauthorized!', { status: 401 });           
    const newPwd = await request.text();
    if (newPwd === oldPwd) return new Response('Please enter a new Password!', { status: 400 });
    await env.bpb.put('pwd', newPwd);
    return new Response('Success', {
        status: 200,
        headers: {
            'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Content-Type': 'text/plain',
        }
    });
}

export async function login(request, env) {
    const auth = await Authenticate(request, env);
    if (auth) return Response.redirect(`${globalThis.urlOrigin}/panel`, 302);
    if (request.method === 'POST') return await generateJWTToken(request, env);
    return await renderLoginPage();
}