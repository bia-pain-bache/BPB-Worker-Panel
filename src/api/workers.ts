import { safeError } from '@common';
import { getGlobals } from '@settings';

/** Tag suffix used when first introducing the WebProxySession SQLite class. */
export const TWP_MIGRATION_TAG = 'v1-twp';
export const TWP_CLASS_NAME = 'WebProxySession';
/** KV key recording that WebProxySession SQLite migration was applied for this installation. */
export const TWP_MIGRATION_KV_KEY = 'twp_sqlite_migration';

export type TwpMigrationRecord = {
    className: string;
    tag: string;
    appliedAt: string;
};

export type MigrationDecision =
    | {
            kind: 'first_intro';
            migrations: { new_tag: string; new_sqlite_classes: string[] };
      }
    | {
            kind: 'add_twp_to_existing';
            migrations: { old_tag: string; new_tag: string; new_sqlite_classes: string[] };
      }
    | {
            kind: 'preserve';
            migrations: { old_tag: string; new_tag: string };
      };

/**
 * Decide Durable Object migration metadata for Telegram Web Proxy.
 *
 * Important: an existing Cloudflare migration_tag does NOT imply WebProxySession was migrated.
 * We only skip new_sqlite_classes when a persistent project record (KV) says TWP was applied
 * for this installation, or when the CF tag already ends with / equals TWP_MIGRATION_TAG
 * AND the KV record confirms it (preferred). If CF has a tag but KV has no TWP record,
 * we introduce WebProxySession with old_tag = current tag and a new tag.
 */
export function decideTwMigration(input: {
    cfMigrationTag: string | null | undefined;
    twpMigrationRecord: TwpMigrationRecord | null | undefined;
}): MigrationDecision {
    const cfTag = typeof input.cfMigrationTag === 'string' ? input.cfMigrationTag.trim() : '';
    const record = input.twpMigrationRecord;
    const recorded =
        record &&
        record.className === TWP_CLASS_NAME &&
        typeof record.tag === 'string' &&
        record.tag.trim().length > 0
            ? record.tag.trim()
            : null;

    // TWP already recorded as migrated — never re-apply new_sqlite_classes.
    if (recorded) {
        const preserve = cfTag || recorded;
        return {
            kind: 'preserve',
            migrations: { old_tag: preserve, new_tag: preserve }
        };
    }

    // No CF migration history — brand-new Worker (or never migrated DOs).
    if (!cfTag) {
        return {
            kind: 'first_intro',
            migrations: {
                new_tag: TWP_MIGRATION_TAG,
                new_sqlite_classes: [TWP_CLASS_NAME]
            }
        };
    }

    // Existing DO migration history, but TWP class not yet recorded → add SQLite class.
    const newTag = `${cfTag}+${TWP_MIGRATION_TAG}`;
    return {
        kind: 'add_twp_to_existing',
        migrations: {
            old_tag: cfTag,
            new_tag: newTag,
            new_sqlite_classes: [TWP_CLASS_NAME]
        }
    };
}

export function buildWorkerUploadMetadata(options: {
    cfMigrationTag?: string | null;
    twpMigrationRecord?: TwpMigrationRecord | null;
} = {}): Record<string, unknown> {
    const decision = decideTwMigration({
        cfMigrationTag: options.cfMigrationTag ?? null,
        twpMigrationRecord: options.twpMigrationRecord ?? null
    });

    return {
        main_module: 'worker.js',
        keep_bindings: ['kv_namespace', 'durable_object_namespace', 'secret_text'],
        compatibility_date: new Date().toISOString().split('T')[0],
        compatibility_flags: ['nodejs_compat'],
        bindings: [
            {
                type: 'durable_object_namespace',
                name: 'SESSIONS',
                class_name: TWP_CLASS_NAME
            }
        ],
        migrations: decision.migrations
    };
}

export class WorkerScriptsApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly code?: string
    ) {
        super(message);
        this.name = 'WorkerScriptsApiError';
    }
}

/**
 * List Worker scripts with pagination. Throws on auth/API failures (never silent null).
 */
export async function listWorkerScripts(
    accID: string,
    apiToken: string
): Promise<Array<{ id: string; migration_tag?: string }>> {
    const results: Array<{ id: string; migration_tag?: string }> = [];
    let page = 1;
    const perPage = 100;

    for (;;) {
        const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts`);
        url.searchParams.set('page', String(page));
        url.searchParams.set('per_page', String(perPage));

        const res = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${apiToken}` }
        });

        if (res.status === 401 || res.status === 403) {
            throw new WorkerScriptsApiError('Cloudflare API authentication failed while listing Workers.', res.status);
        }
        if (res.status === 429) {
            throw new WorkerScriptsApiError('Cloudflare API rate limited while listing Workers.', res.status);
        }
        if (res.status >= 500) {
            throw new WorkerScriptsApiError(`Cloudflare API server error (${res.status}) while listing Workers.`, res.status);
        }
        if (!res.ok) {
            throw new WorkerScriptsApiError(`Cloudflare API error (${res.status}) while listing Workers.`, res.status);
        }

        const data: any = await res.json();
        if (!data?.success || !Array.isArray(data.result)) {
            throw new WorkerScriptsApiError('Unexpected Cloudflare scripts list response.', res.status, 'invalid_response');
        }

        for (const item of data.result) {
            if (item && typeof item.id === 'string') {
                results.push({
                    id: item.id,
                    migration_tag: typeof item.migration_tag === 'string' ? item.migration_tag : undefined
                });
            }
        }

        const totalPages = Number(data.result_info?.total_pages || page);
        if (page >= totalPages || data.result.length < perPage) break;
        page += 1;
        if (page > 100) break; // safety
    }

    return results;
}

/**
 * Read the Durable Object migration tag for a Worker.
 * - null: Worker not found (does not exist yet) OR exists with no migration_tag.
 * - throws: API/auth/ambiguous failures.
 */
export async function getWorkerMigrationTag(
    accID: string,
    apiToken: string,
    scriptName: string
): Promise<{ exists: boolean; migrationTag: string | null }> {
    const scripts = await listWorkerScripts(accID, apiToken);
    const entry = scripts.find((s) => s.id === scriptName);
    if (!entry) {
        return { exists: false, migrationTag: null };
    }
    const tag = entry.migration_tag && entry.migration_tag.trim() ? entry.migration_tag.trim() : null;
    return { exists: true, migrationTag: tag };
}

export async function readTwpMigrationRecord(env: { kv: KVNamespace }): Promise<TwpMigrationRecord | null> {
    try {
        const value = await env.kv.get(TWP_MIGRATION_KV_KEY, 'json');
        if (!value || typeof value !== 'object') return null;
        const rec = value as TwpMigrationRecord;
        if (rec.className !== TWP_CLASS_NAME || typeof rec.tag !== 'string' || !rec.tag.trim()) return null;
        return rec;
    } catch {
        return null;
    }
}

export async function writeTwpMigrationRecord(
    env: { kv: KVNamespace },
    tag: string
): Promise<void> {
    const record: TwpMigrationRecord = {
        className: TWP_CLASS_NAME,
        tag,
        appliedAt: new Date().toISOString()
    };
    await env.kv.put(TWP_MIGRATION_KV_KEY, JSON.stringify(record));
}

export async function deployWorkers(script: string, env?: { kv: KVNamespace }) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];

    const { migrationTag: cfMigrationTag } = await getWorkerMigrationTag(accID, apiToken, scriptName);
    const twpMigrationRecord = env?.kv ? await readTwpMigrationRecord(env) : null;

    const decision = decideTwMigration({ cfMigrationTag, twpMigrationRecord });
    const metadata = buildWorkerUploadMetadata({ cfMigrationTag, twpMigrationRecord });

    const uploadForm = new FormData();
    uploadForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    uploadForm.append('worker.js', new Blob([script], { type: 'application/javascript+module' }), 'worker.js');

    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${encodeURIComponent(scriptName)}`,
            {
                method: 'PUT',
                headers: { Authorization: `Bearer ${apiToken}` },
                body: uploadForm
            }
        );
        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message || `Upload failed (${res.status})`);

        // Persist TWP migration record after successful introduce/add so retries are idempotent.
        if (env?.kv && (decision.kind === 'first_intro' || decision.kind === 'add_twp_to_existing')) {
            const appliedTag =
                decision.kind === 'first_intro'
                    ? decision.migrations.new_tag
                    : decision.migrations.new_tag;
            await writeTwpMigrationRecord(env, appliedTag);
        }
    } catch (error) {
        throw new Error(`Failed to deploy worker: ${safeError(error)}`);
    }
}

export async function getWorkerDomains(): Promise<string[]> {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];
    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accID}/workers/domains?service=${scriptName}`,
            { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
        return data.result.map((r: any) => r.hostname);
    } catch (error) {
        throw new Error(`Failed to get worker domains: ${safeError(error)}`);
    }
}

export async function setWorkerDomain(domain: string) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];
    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/domains`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hostname: domain, service: scriptName })
        });
        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to set worker domain: ${safeError(error)}`);
    }
}

export async function deleteWorker() {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];
    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${encodeURIComponent(scriptName)}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${apiToken}` }
            }
        );
        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to delete worker: ${safeError(error)}`);
    }
}
