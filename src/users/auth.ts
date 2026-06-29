import {
    findUserIdByUuid,
    findUserIdByTrojanHash,
    findUserIdBySubToken,
    getUser,
    resolveLegacyUser,
} from '@users/store';
import { sha224 } from '@trojan';

export interface AccessResult {
    ok: boolean;
    reason?: 'no_user' | 'disabled' | 'expired' | 'device_limit';
}

export async function validateUserAccess(user: User | null, _env: Env): Promise<AccessResult> {
    if (!user) return { ok: false, reason: 'no_user' };
    if (!user.enabled) return { ok: false, reason: 'disabled' };

    if (user.expiresAt !== null && Date.now() >= user.expiresAt) {
        return { ok: false, reason: 'expired' };
    }

    // Phase 3 hook: device-limit check goes here.

    return { ok: true };
}

export async function resolveUserByVlessUuid(env: Env, uuid: string): Promise<User | null> {
    const id = await findUserIdByUuid(env, uuid);

    if (id) {
        const user = await getUser(env, id);
        if (user) return user;
    }

    const legacy = resolveLegacyUser(env);
    if (legacy && legacy.uuid === uuid) return legacy;

    return null;
}

export async function resolveUserByTrojanHash(env: Env, hash: string): Promise<User | null> {
    const id = await findUserIdByTrojanHash(env, hash);

    if (id) {
        const user = await getUser(env, id);
        if (user) return user;
    }

    const legacy = resolveLegacyUser(env);
    if (legacy && sha224(legacy.trojanPassword) === hash) return legacy;

    return null;
}

export async function resolveUserBySubToken(env: Env, token: string): Promise<User | null> {
    const id = await findUserIdBySubToken(env, token);

    if (id) {
        const user = await getUser(env, id);
        if (user) return user;
    }

    const legacy = resolveLegacyUser(env);
    if (legacy && legacy.subToken === token) return legacy;

    return null;
}

export function getActiveIdentity(): { uuid: string; trojanPassword: string } {
    const user = globalThis.requestUser;
    if (user) return { uuid: user.uuid, trojanPassword: user.trojanPassword };

    const { userID, TrPass } = globalThis.globalConfig;
    return { uuid: userID, trojanPassword: TrPass };
}
