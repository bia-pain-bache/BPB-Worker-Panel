import { HttpStatus, respond, safeError } from '@common';
import { getGlobals } from '@settings';

interface UserRecord {
    id: string;
    name: string;
    uuid: string;
    uri: string;
    createdAt: string;
    status: number;
}

async function ensureUsersTable(env: Env): Promise<void> {
    if (!env.DB) {
        throw new Error('D1 database is not configured for this worker.');
    }

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            uuid TEXT NOT NULL,
            uri TEXT NOT NULL,
            created_at TEXT NOT NULL,
            status INTEGER NOT NULL DEFAULT 1
        )
    `).run();
}

function normalizeUserName(value: unknown): string {
    const name = typeof value === 'string' ? value.trim() : '';
    return name.replace(/\s+/g, ' ');
}

function buildVlessUri(name: string, uuid: string): string {
    const { mainDomain, securePath, origin } = getGlobals();
    const host = mainDomain || new URL(origin).hostname;
    const path = encodeURIComponent(`/${securePath}/sub/normal?app=xray`);
    return `vless://${uuid}@${host}:443?type=ws&host=${encodeURIComponent(host)}&path=${path}&security=tls&sni=${encodeURIComponent(host)}&encryption=none#${encodeURIComponent(name)}`;
}

async function readUsers(env: Env): Promise<UserRecord[]> {
    if (!env.DB) {
        throw new Error('D1 database is not configured for this worker.');
    }

    const result = await env.DB.prepare(`
        SELECT id, name, uuid, uri, created_at AS createdAt, status
        FROM users
        ORDER BY created_at DESC
        LIMIT 100
    `).all<UserRecord>();

    return result.results as UserRecord[];
}

export async function createUser(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        await ensureUsersTable(env);

        const payload = await request.json().catch(() => ({})) as { name?: string };
        const name = normalizeUserName(payload.name);
        if (!name) {
            return respond(false, HttpStatus.BAD_REQUEST, 'User name is required.');
        }

        const { vlUUID } = getGlobals();
        const id = crypto.randomUUID();
        const uuid = vlUUID || crypto.randomUUID();
        const createdAt = new Date().toISOString();
        const uri = buildVlessUri(name, uuid);

        await env.DB!.prepare(`
            INSERT INTO users (id, name, uuid, uri, created_at, status)
            VALUES (?, ?, ?, ?, ?, 1)
        `).bind(id, name, uuid, uri, createdAt).run();

        return respond(true, HttpStatus.OK, 'User created successfully.', {
            user: {
                id,
                name,
                uuid,
                uri,
                createdAt,
                status: 1
            }
        });
    } catch (error) {
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to create user: ${safeError(error)}`
        );
    }
}

export async function listUsers(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    try {
        const users = await readUsers(env);
        return respond(true, HttpStatus.OK, 'Users fetched successfully.', { users });
    } catch (error) {
        return respond(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            `Failed to read users: ${safeError(error)}`
        );
    }
}
