/**
 * Pure Durable Object migration decision helpers for Telegram Web Proxy.
 * No Cloudflare or project imports — safe to unit-test in isolation.
 */

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
 * for this installation. If CF has a tag but KV has no TWP record, we introduce
 * WebProxySession with old_tag = current tag and a new tag.
 *
 * Cases covered:
 * 1. Completely new Worker (no CF tag, no KV record) → first_intro
 * 2. Existing Worker without DO migration history → first_intro
 * 3. Existing Worker with previous DO migrations, TWP not yet applied → add_twp_to_existing
 * 4. Worker where WebProxySession was already introduced (KV record) → preserve
 * 5. Retry after successful migration (KV record present) → preserve (idempotent)
 *
 * Never apply new_sqlite_classes twice when KV confirms prior application.
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

/**
 * Build the Workers Script Upload metadata object, including migration decision.
 */
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
