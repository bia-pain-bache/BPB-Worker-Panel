import { sha224 } from '@trojan';

const USERS_INDEX_KEY = 'users:index';
const userKey = (id: string) => `user:${id}`;
const vlessLookupKey = (uuid: string) => `lookup:vless:${uuid}`;
const trojanLookupKey = (hash: string) => `lookup:trojan:${hash}`;
const subLookupKey = (token: string) => `lookup:sub:${token}`;

export const LEGACY_USER_ID = '__legacy__';

function randomHex(bytes: number): string {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

function randomToken(bytes: number = 18): string {
    return randomHex(bytes);
}

async function getIndex(env: Env): Promise<string[]> {
    const idx = await env.kv.get<string[]>(USERS_INDEX_KEY, { type: 'json' });
    return idx ?? [];
}

async function putIndex(env: Env, ids: string[]): Promise<void> {
    await env.kv.put(USERS_INDEX_KEY, JSON.stringify(ids));
}

export async function hasAnyUser(env: Env): Promise<boolean> {
    const ids = await getIndex(env);
    return ids.length > 0;
}

export async function listUsers(env: Env): Promise<User[]> {
    const ids = await getIndex(env);
    const users = await Promise.all(ids.map(id => getUser(env, id)));
    return users.filter((u): u is User => u !== null);
}

export async function getUser(env: Env, id: string): Promise<User | null> {
    return await env.kv.get<User>(userKey(id), { type: 'json' });
}

export interface CreateUserInput {
    name: string;
    expiresAt?: number | null;
    deviceLimit?: number;
    enabled?: boolean;
}

export async function createUser(env: Env, input: CreateUserInput): Promise<User> {
    const id = randomHex(4);
    const uuid = crypto.randomUUID();
    const trojanPassword = randomToken(24);
    const subToken = randomToken(18);

    const user: User = {
        id,
        name: input.name,
        uuid,
        trojanPassword,
        subToken,
        createdAt: Date.now(),
        expiresAt: input.expiresAt ?? null,
        deviceLimit: input.deviceLimit ?? 0,
        enabled: input.enabled ?? true,
    };

    await env.kv.put(userKey(id), JSON.stringify(user));
    await Promise.all([
        env.kv.put(vlessLookupKey(uuid), id),
        env.kv.put(trojanLookupKey(sha224(trojanPassword)), id),
        env.kv.put(subLookupKey(subToken), id),
    ]);

    const ids = await getIndex(env);
    if (!ids.includes(id)) {
        ids.push(id);
        await putIndex(env, ids);
    }

    return user;
}

export type UserPatch = Partial<Omit<User, 'id' | 'createdAt'>>;

export async function updateUser(env: Env, id: string, patch: UserPatch): Promise<User | null> {
    const existing = await getUser(env, id);
    if (!existing) return null;

    const updated: User = {
        ...existing,
        ...patch,
        id: existing.id,
        createdAt: existing.createdAt,
    };

    if (patch.uuid && patch.uuid !== existing.uuid) {
        await env.kv.delete(vlessLookupKey(existing.uuid));
        await env.kv.put(vlessLookupKey(updated.uuid), id);
    }

    if (patch.trojanPassword && patch.trojanPassword !== existing.trojanPassword) {
        await env.kv.delete(trojanLookupKey(sha224(existing.trojanPassword)));
        await env.kv.put(trojanLookupKey(sha224(updated.trojanPassword)), id);
    }

    if (patch.subToken && patch.subToken !== existing.subToken) {
        await env.kv.delete(subLookupKey(existing.subToken));
        await env.kv.put(subLookupKey(updated.subToken), id);
    }

    await env.kv.put(userKey(id), JSON.stringify(updated));
    return updated;
}

export async function deleteUser(env: Env, id: string): Promise<boolean> {
    const user = await getUser(env, id);
    if (!user) return false;

    await Promise.all([
        env.kv.delete(userKey(id)),
        env.kv.delete(vlessLookupKey(user.uuid)),
        env.kv.delete(trojanLookupKey(sha224(user.trojanPassword))),
        env.kv.delete(subLookupKey(user.subToken)),
    ]);

    const ids = (await getIndex(env)).filter(x => x !== id);
    await putIndex(env, ids);
    return true;
}

export async function findUserIdByUuid(env: Env, uuid: string): Promise<string | null> {
    return await env.kv.get(vlessLookupKey(uuid));
}

export async function findUserIdByTrojanHash(env: Env, hash: string): Promise<string | null> {
    return await env.kv.get(trojanLookupKey(hash));
}

export async function findUserIdBySubToken(env: Env, token: string): Promise<string | null> {
    return await env.kv.get(subLookupKey(token));
}

export function resolveLegacyUser(env: Env): User | null {
    if (!env.UUID || !env.TR_PASS) return null;
    return {
        id: LEGACY_USER_ID,
        name: 'Legacy',
        uuid: env.UUID,
        trojanPassword: env.TR_PASS,
        subToken: env.SUB_PATH || env.UUID,
        createdAt: 0,
        expiresAt: null,
        deviceLimit: 0,
        enabled: true,
    };
}
