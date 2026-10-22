/**
 * Workers Script API upload metadata.
 *
 * Cloudflare enables the `nodejs_compat` (and `nodejs_compat_v2`) compatibility flags
 * by default for compatibility dates on or after 2026-08-04, and explicitly documents
 * that the flags must be omitted for such dates.
 *
 * Workerd builds between 2026-08-04 and workerd PR #6980 ("Warn instead of failing when
 * a compat flag is already on by date", 2026-08-19) treat such a redundant flag as a fatal
 * service configuration error, so the Worker never starts and Cloudflare answers with
 * error 1101. The flag is therefore only sent when the compatibility date really needs it.
 */
const NODEJS_COMPAT_DEFAULT_SINCE = '2026-08-04';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface WorkerMetadata {
    main_module: string;
    keep_bindings: string[];
    compatibility_date: string;
    compatibility_flags?: string[];
}

/**
 * Node.js compatibility is on by default from 2026-08-04 onwards, so the flag is only
 * required for older compatibility dates.
 */
export function requiresNodejsCompatFlag(compatibilityDate: string): boolean {
    if (!ISO_DATE_PATTERN.test(compatibilityDate)) return true;

    return compatibilityDate < NODEJS_COMPAT_DEFAULT_SINCE;
}

export function buildWorkerMetadata(compatibilityDate: string): WorkerMetadata {
    const flags = requiresNodejsCompatFlag(compatibilityDate) ? ['nodejs_compat'] : [];

    return {
        main_module: 'worker.js',
        keep_bindings: ['kv_namespace'],
        compatibility_date: compatibilityDate,
        ...(flags.length ? { compatibility_flags: flags } : {})
    };
}
