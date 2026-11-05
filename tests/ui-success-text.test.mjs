import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('panel success text', () => {
  it('uses English Success for TWP status', () => {
    const js = readFileSync(join(root, 'src/assets/panel/script.js'), 'utf8');
    assert.match(js, /<span>Success<\/span>/);
    assert.doesNotMatch(js, /موفق/);
  });
});
