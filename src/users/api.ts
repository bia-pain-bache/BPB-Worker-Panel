import { Authenticate } from '@auth';
import { HttpStatus, respond, safeErrorMessage } from '@common';
import {
    createUser,
    deleteUser,
    listUsers,
    updateUser,
    type UserPatch,
} from '@users/store';

const MAX_NAME_LENGTH = 64;

export async function handleUsersApi(request: Request, env: Env, action: string): Promise<Response> {
    const auth = await Authenticate(request, env);
    if (!auth) return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');

    try {
        switch (action) {
            case 'list':
                return await handleList(request, env);
            case 'create':
                return await handleCreate(request, env);
            case 'update':
                return await handleUpdate(request, env);
            case 'delete':
                return await handleDelete(request, env);
            default:
                return respond(false, HttpStatus.NOT_FOUND, 'Unknown action.');
        }
    } catch (error) {
        console.log(error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, safeErrorMessage(error));
    }
}

async function handleList(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }
    const users = await listUsers(env);
    return respond(true, HttpStatus.OK, '', users);
}

async function handleCreate(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const input = await readJson(request);
    const name = parseName(input?.name);
    if (!name) return respond(false, HttpStatus.BAD_REQUEST, 'Name is required.');

    const user = await createUser(env, {
        name,
        expiresAt: parseExpiresAt(input?.expiresAt),
        deviceLimit: parseDeviceLimit(input?.deviceLimit),
    });

    return respond(true, HttpStatus.OK, '', user);
}

async function handleUpdate(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const input = await readJson(request);
    const id = typeof input?.id === 'string' ? input.id : null;
    if (!id) return respond(false, HttpStatus.BAD_REQUEST, 'id is required.');

    const patch: UserPatch = {};
    if (typeof input.name === 'string') {
        const name = parseName(input.name);
        if (!name) return respond(false, HttpStatus.BAD_REQUEST, 'Invalid name.');
        patch.name = name;
    }
    if ('expiresAt' in input) {
        patch.expiresAt = parseExpiresAt(input.expiresAt);
    }
    if ('deviceLimit' in input) {
        patch.deviceLimit = parseDeviceLimit(input.deviceLimit);
    }
    if (typeof input.enabled === 'boolean') {
        patch.enabled = input.enabled;
    }

    const updated = await updateUser(env, id, patch);
    if (!updated) return respond(false, HttpStatus.NOT_FOUND, 'User not found.');
    return respond(true, HttpStatus.OK, '', updated);
}

async function handleDelete(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'DELETE') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const input = await readJson(request);
    const id = typeof input?.id === 'string' ? input.id : null;
    if (!id) return respond(false, HttpStatus.BAD_REQUEST, 'id is required.');

    const ok = await deleteUser(env, id);
    if (!ok) return respond(false, HttpStatus.NOT_FOUND, 'User not found.');
    return respond(true, HttpStatus.OK, 'Deleted.');
}

async function readJson(request: Request): Promise<any> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

function parseName(v: unknown): string | null {
    if (typeof v !== 'string') return null;
    const trimmed = v.trim();
    if (!trimmed || trimmed.length > MAX_NAME_LENGTH) return null;
    return trimmed;
}

function parseExpiresAt(v: unknown): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.floor(n);
}

function parseDeviceLimit(v: unknown): number {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
}
