import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    buildWorkerMetadata,
    requiresNodejsCompatFlag
} from '../src/api/worker-metadata.ts';

/**
 * Compatibility flags that Cloudflare enables by default from a given compatibility date.
 * Sending one of them together with such a date is rejected by the Workers runtime and
 * prevents the Worker from starting (Cloudflare error 1101).
 */
const FLAGS_ENABLED_BY_DATE = [
    { flag: 'nodejs_compat', since: '2026-08-04' }
];

test('compatibility date with Node.js compatibility enabled by default omits the flag', () => {
    const metadata = buildWorkerMetadata('2026-10-22');

    assert.equal(metadata.compatibility_flags, undefined);
});

test('the default-on boundary date omits the flag', () => {
    const metadata = buildWorkerMetadata('2026-08-04');

    assert.equal(metadata.compatibility_flags, undefined);
});

test('older compatibility dates still request Node.js compatibility', () => {
    const metadata = buildWorkerMetadata('2026-08-03');

    assert.deepEqual(metadata.compatibility_flags, ['nodejs_compat']);
});

test('much older compatibility dates still request Node.js compatibility', () => {
    const metadata = buildWorkerMetadata('2024-09-23');

    assert.deepEqual(metadata.compatibility_flags, ['nodejs_compat']);
});

test('an unparsable compatibility date keeps requesting Node.js compatibility', () => {
    const metadata = buildWorkerMetadata('not-a-date');

    assert.deepEqual(metadata.compatibility_flags, ['nodejs_compat']);
});

test('the upload contract is preserved', () => {
    const metadata = buildWorkerMetadata('2026-10-22');

    assert.equal(metadata.main_module, 'worker.js');
    assert.deepEqual(metadata.keep_bindings, ['kv_namespace']);
    assert.equal(metadata.compatibility_date, '2026-10-22');
});

test('no flag that the compatibility date already enables is ever sent', () => {
    const dates = ['2024-09-23', '2026-08-03', '2026-08-04', '2026-08-05', '2026-10-22', '2027-01-01'];

    for (const date of dates) {
        const metadata = buildWorkerMetadata(date);

        for (const { flag, since } of FLAGS_ENABLED_BY_DATE) {
            if (date >= since) {
                assert.ok(
                    !(metadata.compatibility_flags ?? []).includes(flag),
                    `"${flag}" must not be sent for compatibility date "${date}"`
                );
            }
        }
    }
});

test('requiresNodejsCompatFlag mirrors the metadata builder', () => {
    assert.equal(requiresNodejsCompatFlag('2026-08-03'), true);
    assert.equal(requiresNodejsCompatFlag('2026-08-04'), false);
    assert.equal(requiresNodejsCompatFlag('2026-10-22'), false);
});
