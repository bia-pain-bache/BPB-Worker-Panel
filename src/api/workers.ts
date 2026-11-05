import { safeError } from '@common';
import { getGlobals } from '@settings';

export function buildWorkerUploadMetadata(options: {
    applySqliteMigration?: boolean;
    existingMigrationTag?: string | null;
} = {}): Record<string, unknown> {
    const { applySqliteMigration = false, existingMigrationTag = null } = options;
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
    if (applySqliteMigration) {
        metadata.migrations = { new_tag: 'v1-twp', new_sqlite_classes: ['WebProxySession'] };
    } else if (existingMigrationTag) {
        metadata.migrations = { old_tag: existingMigrationTag, new_tag: existingMigrationTag };
    }
    return metadata;
}

export async function deployWorkers(script: string) {
    const { accID, apiToken, mainDomain } = getGlobals();
    const metadata = buildWorkerUploadMetadata({ applySqliteMigration: false });
    const uploadForm = new FormData();
    uploadForm.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    uploadForm.append('worker.js', new Blob([script], { type: 'application/javascript+module' }), 'worker.js');
    const scriptName = mainDomain.split('.')[0];
    try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${scriptName}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${apiToken}` },
            body: uploadForm
        });
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
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/domains?service=${scriptName}`, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });
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
            headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
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
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accID}/workers/scripts/${scriptName}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });
        const data: any = await res.json();
        if (!data.success) throw new Error(data?.errors?.[0]?.message);
    } catch (error) {
        throw new Error(`Failed to delete worker: ${safeError(error)}`);
    }
}
