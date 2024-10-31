import { SignJWT, jwtVerify } from 'jose';
import nacl from 'tweetnacl';
import { configs } from '../helpers/config.js';
let userID = configs.userID;

export async function generateJWTToken (env, secretKey) {
    userID = env.UUID || userID;
    const secret = new TextEncoder().encode(secretKey);
    return await new SignJWT({ userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

export function generateSecretKey () {
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