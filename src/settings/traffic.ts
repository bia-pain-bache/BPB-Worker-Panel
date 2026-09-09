import { getTrafficUsage, recordTraffic } from '@kv';

const CHECK_INTERVAL_MS = 5000;
const FLUSH_INTERVAL_MS = 3000;

export interface TrafficTracker {
    userId: string;
    addUpload(bytes: number): void;
    addDownload(bytes: number): void;
    flush(force?: boolean): Promise<void>;
    exceeded(): Promise<boolean>;
}

export function createTrafficTracker(env: Env, userId: string, dataLimitGB: number): TrafficTracker {
    const sessionId = `${Date.now().toString(36)}-${crypto.randomUUID()}`;
    let upload = 0;
    let download = 0;
    let lastUpload = 0;
    let lastDownload = 0;
    let lastFlush = 0;
    let lastCheck = 0;
    let cachedExceeded = false;

    const flush = async (force = false) => {
        const now = Date.now();
        if (!force && now - lastFlush < FLUSH_INTERVAL_MS) return;
        const du = upload - lastUpload;
        const dd = download - lastDownload;
        if (du <= 0 && dd <= 0 && !force) return;
        lastUpload = upload;
        lastDownload = download;
        lastFlush = now;
        await recordTraffic(env, userId, sessionId, upload, download);
    };

    const exceeded = async () => {
        if (!dataLimitGB || dataLimitGB <= 0) return false;
        const now = Date.now();
        if (now - lastCheck < CHECK_INTERVAL_MS) return cachedExceeded;
        lastCheck = now;
        await flush();
        const usage = await getTrafficUsage(env, userId);
        cachedExceeded = usage.total >= dataLimitGB * 1024 * 1024 * 1024;
        return cachedExceeded;
    };

    return {
        userId,
        addUpload(bytes) { upload += Math.max(0, bytes || 0); },
        addDownload(bytes) { download += Math.max(0, bytes || 0); },
        flush,
        exceeded
    };
}
