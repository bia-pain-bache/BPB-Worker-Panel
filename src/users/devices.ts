const ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000;
const WRITE_THROTTLE_MS = 10 * 60 * 1000;

const deviceKey = (userId: string) => `devices:${userId}`;

async function sha256HexShort(input: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

export async function fingerprintFromRequest(request: Request): Promise<string> {
    const ip = request.headers.get('CF-Connecting-IP') ?? '';
    const ua = request.headers.get('User-Agent') ?? '';
    return await sha256HexShort(`${ip}|${ua}`);
}

function pruneExpired(map: Record<string, number>, now: number): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [fp, ts] of Object.entries(map)) {
        if (now - ts < ACTIVE_WINDOW_MS) out[fp] = ts;
    }
    return out;
}

export async function checkAndRecordDevice(env: Env, user: User, fingerprint: string): Promise<boolean> {
    const key = deviceKey(user.id);
    const raw = await env.kv.get<Record<string, number>>(key, { type: 'json' });
    const now = Date.now();
    const map = pruneExpired(raw ?? {}, now);

    const seen = map[fingerprint];

    if (seen !== undefined) {
        if (now - seen >= WRITE_THROTTLE_MS) {
            map[fingerprint] = now;
            await env.kv.put(key, JSON.stringify(map));
        }
        return true;
    }

    if (Object.keys(map).length >= user.deviceLimit) {
        if (raw && Object.keys(raw).length !== Object.keys(map).length) {
            await env.kv.put(key, JSON.stringify(map));
        }
        return false;
    }

    map[fingerprint] = now;
    await env.kv.put(key, JSON.stringify(map));
    return true;
}

export async function deleteDevices(env: Env, userId: string): Promise<void> {
    await env.kv.delete(deviceKey(userId));
}
