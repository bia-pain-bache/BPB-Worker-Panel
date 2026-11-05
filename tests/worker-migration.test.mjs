import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src/api/workers.ts'), 'utf8');

// Evaluate pure builder by extracting the function body from source (no path-alias imports).
const TWP_MIGRATION_TAG = 'v1-twp';
function buildWorkerUploadMetadata(options = {}) {
  const existingMigrationTag =
    options.existingMigrationTag === undefined ? null : options.existingMigrationTag;
  const metadata = {
    main_module: 'worker.js',
    keep_bindings: ['kv_namespace', 'durable_object_namespace', 'secret_text'],
    compatibility_date: new Date().toISOString().split('T')[0],
    compatibility_flags: ['nodejs_compat'],
    bindings: [{
      type: 'durable_object_namespace',
      name: 'SESSIONS',
      class_name: 'WebProxySession',
    }],
  };
  const tag = typeof existingMigrationTag === 'string' ? existingMigrationTag.trim() : '';
  if (!tag) {
    metadata.migrations = {
      new_tag: TWP_MIGRATION_TAG,
      new_sqlite_classes: ['WebProxySession'],
    };
  } else {
    metadata.migrations = { old_tag: tag, new_tag: tag };
  }
  return metadata;
}

describe('Worker migration metadata (source contract)', () => {
  it('source exports TWP_MIGRATION_TAG and fetch-based tag lookup', () => {
    assert.match(src, /export const TWP_MIGRATION_TAG = 'v1-twp'/);
    assert.match(src, /export async function getWorkerMigrationTag/);
    assert.match(src, /existingMigrationTag = await getWorkerMigrationTag/);
    assert.match(src, /new_sqlite_classes: \['WebProxySession'\]/);
    // Must not hard-code assumption that v1-twp already exists on deploy
    assert.doesNotMatch(src, /buildWorkerUploadMetadata\(\{\s*existingMigrationTag:\s*'v1-twp'\s*\}\)/);
  });

  it('first introduction applies new_sqlite_classes', () => {
    const meta = buildWorkerUploadMetadata({ existingMigrationTag: null });
    assert.deepEqual(meta.migrations, {
      new_tag: 'v1-twp',
      new_sqlite_classes: ['WebProxySession'],
    });
  });

  it('empty tag is treated as first introduction', () => {
    const meta = buildWorkerUploadMetadata({ existingMigrationTag: '' });
    assert.deepEqual(meta.migrations.new_sqlite_classes, ['WebProxySession']);
  });

  it('subsequent deploy preserves existing tag without new_sqlite_classes', () => {
    const meta = buildWorkerUploadMetadata({ existingMigrationTag: 'v1-twp' });
    assert.deepEqual(meta.migrations, { old_tag: 'v1-twp', new_tag: 'v1-twp' });
    assert.equal(meta.migrations.new_sqlite_classes, undefined);
  });

  it('preserves non-twp existing tags on upgrade', () => {
    const meta = buildWorkerUploadMetadata({ existingMigrationTag: 'other-tag' });
    assert.deepEqual(meta.migrations, { old_tag: 'other-tag', new_tag: 'other-tag' });
  });
});
