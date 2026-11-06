/**
 * Tests the actual production migration helpers from src/api/worker-migration.ts.
 * Uses Node's experimental TypeScript stripping so no esbuild/alias bundling is required.
 */
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const migrationUrl = pathToFileURL(join(root, 'src/api/worker-migration.ts')).href;

// Load production module with TypeScript stripping (Node 22+).
const {
	decideTwMigration,
	buildWorkerUploadMetadata,
	TWP_MIGRATION_TAG,
	TWP_CLASS_NAME
} = await import(migrationUrl);

describe('decideTwMigration (production)', () => {
	it('new Worker: first_intro with new_sqlite_classes', () => {
		const d = decideTwMigration({ cfMigrationTag: null, twpMigrationRecord: null });
		assert.equal(d.kind, 'first_intro');
		assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
		assert.equal(d.migrations.new_tag, TWP_MIGRATION_TAG);
	});

	it('empty string CF tag treated as new Worker', () => {
		const d = decideTwMigration({ cfMigrationTag: '  ', twpMigrationRecord: null });
		assert.equal(d.kind, 'first_intro');
		assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
	});

	it('existing arbitrary tag without TWP record: add_twp_to_existing', () => {
		const d = decideTwMigration({ cfMigrationTag: 'legacy-v0', twpMigrationRecord: null });
		assert.equal(d.kind, 'add_twp_to_existing');
		assert.equal(d.migrations.old_tag, 'legacy-v0');
		assert.ok(d.migrations.new_tag.includes(TWP_MIGRATION_TAG));
		assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
	});

	it('existing Worker with multiple prior tags: still adds TWP once', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'v1+v2+custom',
			twpMigrationRecord: null
		});
		assert.equal(d.kind, 'add_twp_to_existing');
		assert.equal(d.migrations.old_tag, 'v1+v2+custom');
		assert.equal(d.migrations.new_tag, `v1+v2+custom+${TWP_MIGRATION_TAG}`);
		assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
	});

	it('TWP already recorded: preserve without new_sqlite_classes', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'legacy-v0+v1-twp',
			twpMigrationRecord: {
				className: TWP_CLASS_NAME,
				tag: 'legacy-v0+v1-twp',
				appliedAt: '2026-01-01'
			}
		});
		assert.equal(d.kind, 'preserve');
		assert.equal(d.migrations.old_tag, 'legacy-v0+v1-twp');
		assert.equal(d.migrations.new_tag, 'legacy-v0+v1-twp');
		assert.equal(d.migrations.new_sqlite_classes, undefined);
	});

	it('retry after successful migration uses KV record even if CF tag lags', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'legacy-v0',
			twpMigrationRecord: {
				className: TWP_CLASS_NAME,
				tag: 'legacy-v0+v1-twp',
				appliedAt: '2026-01-01'
			}
		});
		assert.equal(d.kind, 'preserve');
		assert.ok(!('new_sqlite_classes' in d.migrations));
	});

	it('KV record with wrong className is ignored (treat as not migrated)', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'legacy-v0',
			twpMigrationRecord: {
				className: 'OtherClass',
				tag: 'legacy-v0+v1-twp',
				appliedAt: '2026-01-01'
			}
		});
		assert.equal(d.kind, 'add_twp_to_existing');
		assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
	});

	it('preserve prefers CF tag when present and recorded', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'current-cf-tag',
			twpMigrationRecord: {
				className: TWP_CLASS_NAME,
				tag: 'older-recorded',
				appliedAt: '2026-01-01'
			}
		});
		assert.equal(d.kind, 'preserve');
		assert.equal(d.migrations.old_tag, 'current-cf-tag');
		assert.equal(d.migrations.new_tag, 'current-cf-tag');
	});

	it('buildWorkerUploadMetadata embeds decision migrations for new Worker', () => {
		const meta = buildWorkerUploadMetadata({ cfMigrationTag: null, twpMigrationRecord: null });
		assert.equal(meta.main_module, 'worker.js');
		assert.deepEqual(meta.migrations.new_sqlite_classes, ['WebProxySession']);
		assert.equal(meta.migrations.new_tag, TWP_MIGRATION_TAG);
		assert.ok(Array.isArray(meta.bindings));
		assert.equal(meta.bindings[0].name, 'SESSIONS');
		assert.equal(meta.bindings[0].class_name, TWP_CLASS_NAME);
	});

	it('buildWorkerUploadMetadata preserve path has no new_sqlite_classes', () => {
		const meta = buildWorkerUploadMetadata({
			cfMigrationTag: 'x',
			twpMigrationRecord: {
				className: TWP_CLASS_NAME,
				tag: 'x',
				appliedAt: '2026-01-01'
			}
		});
		assert.equal(meta.migrations.old_tag, 'x');
		assert.equal(meta.migrations.new_tag, 'x');
		assert.equal(meta.migrations.new_sqlite_classes, undefined);
	});

	it('idempotent: two sequential decisions after KV record stay preserve', () => {
		const record = {
			className: TWP_CLASS_NAME,
			tag: `old+${TWP_MIGRATION_TAG}`,
			appliedAt: '2026-01-01'
		};
		const first = decideTwMigration({ cfMigrationTag: `old+${TWP_MIGRATION_TAG}`, twpMigrationRecord: record });
		const second = decideTwMigration({ cfMigrationTag: `old+${TWP_MIGRATION_TAG}`, twpMigrationRecord: record });
		assert.equal(first.kind, 'preserve');
		assert.equal(second.kind, 'preserve');
		assert.deepEqual(first.migrations, second.migrations);
	});

	it('legacy CF tag containing v1-twp without KV: preserve (do not re-apply)', () => {
		const d = decideTwMigration({
			cfMigrationTag: 'legacy-v0+v1-twp',
			twpMigrationRecord: null,
		});
		assert.equal(d.kind, 'preserve');
		assert.equal(d.migrations.old_tag, 'legacy-v0+v1-twp');
		assert.equal(d.migrations.new_sqlite_classes, undefined);
	});

	it('exact historical TWP_MIGRATION_TAG without KV: preserve', () => {
		const d = decideTwMigration({
			cfMigrationTag: TWP_MIGRATION_TAG,
			twpMigrationRecord: null,
		});
		assert.equal(d.kind, 'preserve');
		assert.equal(d.migrations.old_tag, TWP_MIGRATION_TAG);
	});
});
