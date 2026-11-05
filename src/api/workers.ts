import { safeError } from '@common';
import { getGlobals } from '@settings';

/** Tag applied the first time Telegram Web Proxy SQLite DO is enabled. */
export const TWP_MIGRATION_TAG = 'v1-twp';

/**
 * Build Cloudflare Script Upload metadata for BPB Workers.
 *
 * Migration rules:
 * - No existing tag → first introduction: new_tag + new_sqlite_classes.
 * - Existing tag present → preserve it (old_tag = new_tag = existing); never re-apply new_sqlite_classes.
 * - Never assume TWP_MIGRATION_TAG already exists on the Worker.
 */
export function buildWorkerUploadMetadata(options: {
    existingMigrationTag?: string | null;
} = {}): Record<string, unknown> {
    const existingMigrationTag =
        options.existingMigrationTag === undefined ? null : options.existingMigrationTag;

    const metadata: Record<string, unknown> = {
        main_module: 'worker.js',
        keep_bindings: ['kv_namespace', 'durable_object_namespace', 'secret_text'],
        compatibility_date: new Date().toISOString().split('T')[0],
        compatibility_flags: ['nodejs_compat'],
        bindings: [{
            type: 'durable_object_namespace',
            name: 'SESSIONS',
            class_name: 'WebProxySession'
        }]
    };

    const tag = typeof existingMigrationTag === 'string' ? existingMigrationTag.trim() : '';
    if (!tag) {
        // First time this Worker receives the SQLite Durable Object class.
        metadata.migrations = {
            new_tag: TWP_MIGRATION_TAG,
            new_sqlite_classes: ['WebProxySession']
        };
    } else {
        // Subsequent updates: keep the real tag Cloudflare already has.
        metadata.migrations = {
            old_tag: tag,
            new_tag: tag
        };
    }

    return metadata;
}

/**
 * Read the Durable Object migration tag currently applied to a Worker script.
 * Returns null when the script is missing or has no migration_tag yet.
 */
export async function getWorkerMigrationTag(
    accID: string,
    apiToken: string,
    scriptName: string
): Promise<string | null> {
    try {
        const res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${encodeURIComponent(scriptName)}`,
            { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        if (res.status === 404) return null;
        const data: any = await res.json();
        if (!data?.success) return null;
        const tag = data.result?.migration_tag;
        return typeof tag === 'string' && tag.trim() ? tag.trim() : null;
    } catch {
        return null;
    }
}

export async function deployWorkers(script: string) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const scriptName = mainDomain.split('.')[0];

    const existingMigrationTag = await getWorkerMigrationTag(accID, apiToken, scriptName);
    const metadata = buildWorkerUploadMetadata({ existingMigrationTag });

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
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
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
