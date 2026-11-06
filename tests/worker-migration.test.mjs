import { strict as assert } from 'node:assert';
import { describe, it, before } from 'node:test';
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let decideTwMigration, buildWorkerUploadMetadata, TWP_MIGRATION_TAG, TWP_CLASS_NAME;

before(async () => {
  const outdir = join(root, 'tests', '.bundle');
  mkdirSync(outdir, { recursive: true });
  const outfile = join(outdir, 'workers.mjs');
  await build({
    entryPoints: [join(root, 'src/api/workers.ts')],
    bundle: true,
    outfile,
    format: 'esm',
    platform: 'neutral',
    alias: {
      '@common': join(root, 'tests/stubs/common.ts'),
      '@settings': join(root, 'tests/stubs/settings.ts'),
    },
  });
  const mod = await import(pathToFileURL(outfile).href + '?t=' + Date.now());
  decideTwMigration = mod.decideTwMigration;
  buildWorkerUploadMetadata = mod.buildWorkerUploadMetadata;
  TWP_MIGRATION_TAG = mod.TWP_MIGRATION_TAG;
  TWP_CLASS_NAME = mod.TWP_CLASS_NAME;
});

describe('decideTwMigration (production)', () => {
  it('new Worker: first_intro with new_sqlite_classes', () => {
    const d = decideTwMigration({ cfMigrationTag: null, twpMigrationRecord: null });
    assert.equal(d.kind, 'first_intro');
    assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
    assert.equal(d.migrations.new_tag, TWP_MIGRATION_TAG);
  });

  it('existing arbitrary tag without TWP record: add_twp_to_existing', () => {
    const d = decideTwMigration({ cfMigrationTag: 'legacy-v0', twpMigrationRecord: null });
    assert.equal(d.kind, 'add_twp_to_existing');
    assert.equal(d.migrations.old_tag, 'legacy-v0');
    assert.ok(d.migrations.new_tag.includes(TWP_MIGRATION_TAG));
    assert.deepEqual(d.migrations.new_sqlite_classes, [TWP_CLASS_NAME]);
  });

  it('TWP already recorded: preserve without new_sqlite_classes', () => {
    const d = decideTwMigration({
      cfMigrationTag: 'legacy-v0+v1-twp',
      twpMigrationRecord: { className: TWP_CLASS_NAME, tag: 'legacy-v0+v1-twp', appliedAt: '2026-01-01' },
    });
    assert.equal(d.kind, 'preserve');
    assert.equal(d.migrations.old_tag, 'legacy-v0+v1-twp');
    assert.equal(d.migrations.new_sqlite_classes, undefined);
  });

  it('buildWorkerUploadMetadata embeds decision migrations', () => {
    const meta = buildWorkerUploadMetadata({ cfMigrationTag: null, twpMigrationRecord: null });
    assert.equal(meta.main_module, 'worker.js');
    assert.deepEqual(meta.migrations.new_sqlite_classes, ['WebProxySession']);
  });
});
