export interface UserData {
    username: string;
    subPath: string;
    createdAt: string;
    expiresAt: string;
    note: string;
    active: boolean;
}

function generateSubPath(): string {
    const hex = '0123456789abcdef';
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return c === 'x' ? hex[r] : hex[(r & 0x3) | 0x8];
    });
}

export async function createUser(username: string, days: number, note: string, env: Env): Promise<{ success: boolean; message: string; user?: UserData }> {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        return { success: false, message: 'Invalid username. Use 3-20 alphanumeric characters or underscores.' };
    }

    const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
    if (index.includes(username)) {
        return { success: false, message: 'Username already exists.' };
    }

    const subPath = generateSubPath();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 86400000).toISOString();

    const user: UserData = {
        username,
        subPath,
        createdAt: now.toISOString(),
        expiresAt,
        note: note || '',
        active: true,
    };

    await env.kv.put(`user:${username}`, JSON.stringify(user));
    index.push(username);
    await env.kv.put('users:index', JSON.stringify(index));

    return { success: true, message: 'User created.', user };
}

export async function getUser(username: string, env: Env): Promise<UserData | null> {
    return await env.kv.get(`user:${username}`, { type: 'json' });
}

export async function listUsers(env: Env): Promise<UserData[]> {
    const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
    if (index.length === 0) return [];
    const users = await Promise.all(index.map(u => getUser(u, env)));
    return users.filter((u): u is UserData => u !== null);
}

export async function updateUser(username: string, updates: Partial<{ days: number; note: string; active: boolean }>, env: Env): Promise<{ success: boolean; message: string; user?: UserData }> {
    const user = await getUser(username, env);
    if (!user) return { success: false, message: 'User not found.' };

    if (updates.days !== undefined && updates.days > 0) {
        const now = Date.now();
        const currentExp = new Date(user.expiresAt).getTime();
        const newExpiry = new Date(Math.max(now, currentExp) + updates.days * 86400000);
        user.expiresAt = newExpiry.toISOString();
    }

    if (updates.note !== undefined) user.note = updates.note;
    if (updates.active !== undefined) user.active = updates.active;

    await env.kv.put(`user:${username}`, JSON.stringify(user));
    return { success: true, message: 'User updated.', user };
}

export async function deleteUser(username: string, env: Env): Promise<{ success: boolean; message: string }> {
    const user = await getUser(username, env);
    if (!user) return { success: false, message: 'User not found.' };

    await env.kv.delete(`user:${username}`);
    const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
    await env.kv.put('users:index', JSON.stringify(index.filter(u => u !== username)));

    return { success: true, message: 'User deleted.' };
}

export async function findUserBySubPath(subPath: string, env: Env): Promise<UserData | null> {
    const index: string[] = await env.kv.get('users:index', { type: 'json' }) || [];
    for (const username of index) {
        const user = await getUser(username, env);
        if (user && user.subPath === subPath) return user;
    }
    return null;
}

export function getStatus(user: UserData): 'active' | 'expired' | 'disabled' {
    if (!user.active) return 'disabled';
    if (new Date(user.expiresAt) < new Date()) return 'expired';
    return 'active';
}
