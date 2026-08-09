// Verifies the one-click import matrix: for every client shown in a
// subscription row, on every OS, the panel must either hand the subscription
// to the app (scheme / file import) or copy it — and must never open the raw
// sub endpoint in a browser, which only downloads the config as a file.
import { readFileSync } from 'fs';

const script = readFileSync('src/assets/panel/script.js', 'utf8');
const settings = readFileSync('src/settings/settings.ts', 'utf8');

function grab(src, name) {
    const i = src.indexOf('function ' + name);
    if (i < 0) throw new Error('function ' + name + ' not found');
    let depth = 0, j = i;
    for (; j < src.length; j++) {
        const c = src[j];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    return src.slice(i, j);
}

// Evaluate the real clientLinks map out of settings.ts so the test can never
// drift from the shipped strategy table.
function loadClientLinks() {
    const start = settings.indexOf('export const clientLinks');
    if (start < 0) throw new Error('clientLinks not found');
    const open = settings.indexOf('{', start);
    let depth = 0, j = open;
    for (; j < settings.length; j++) {
        const c = settings[j];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    const literal = settings.slice(open, j)
        .split('\n')
        .filter(l => !l.trim().startsWith('//'))
        .join('\n');

    const consts = ['ANDROID_ONLY', 'DESKTOP', 'APPLE', 'EVERY_OS']
        .map(n => {
            const m = settings.match(new RegExp('const ' + n + '[^=]*= (\\[[^\\]]*\\])'));
            if (!m) throw new Error('const ' + n + ' not found');
            return 'const ' + n + ' = ' + m[1] + ';';
        })
        .join('\n');

    return new Function(consts + '\nreturn (' + literal + ');')();
}

const clientLinks = loadClientLinks();

const calls = {};
const win = { location: { href: 'https://example.com/hatbm7Q6mrjUCJu/panel' } };
win.open = (u) => { calls.windowOpen = u; };

Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: { writeText: async (t) => { calls.clipboard = t; } } },
    configurable: true
});
globalThis.window = win;
globalThis.dlUrl = (u) => { calls.dlUrl = u; };
globalThis.notify = (_l, _t, body) => { calls.notify = body; };
globalThis.document = {
    createElement: () => ({
        href: '', style: {}, click() { calls.schemeFired = this.href; }, remove() {}
    }),
    body: { appendChild() {}, removeChild() {} }
};

const body = `
globalThis.clientLinkMap = ${JSON.stringify(clientLinks)};
globalThis.window = window;
${grab(script, 'resolveClientLink')}
${grab(script, 'resolveClientName')}
${grab(script, 'toBase64')}
${grab(script, 'buildClientLink')}
${grab(script, 'fallbackCopy')}
${grab(script, 'copyToClipboard')}
${grab(script, 'oneClickAdd')}
${script.match(/const OS_LABELS = \{[\s\S]*?\};/)[0]}
return { oneClickAdd, buildClientLink, resolveClientName, setOS: (o) => { currentOS = o; } };
`;
const api = new Function('window', 'let currentOS;\n' + body)(win);

// The subscription rows, mirroring `subscriptions` in settings.ts.
const ROWS = [
    ['normal', 'xray', ['v2rayN(G)', 'MahsaNG', 'Streisand']],
    ['normal', 'sing-box', ['sing-box', 'husi']],
    ['normal', 'clash', ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash']],
    ['fragment', 'xray', ['v2rayN(G)', 'MahsaNG', 'Streisand']],
    ['fragment', 'sing-box', ['sing-box', 'husi']],
    ['raw', 'xray', ['v2rayN(G)', 'MahsaNG', 'Shadowrocket', 'Streisand', 'PassWall']],
    ['raw', 'sing-box', ['husi', 'NekoBox', 'Hiddify', 'Karing']],
    ['warp', 'xray', ['v2rayN(G)', 'Streisand']],
    ['warp', 'sing-box', ['sing-box', 'husi']],
    ['warp', 'clash', ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash']],
    ['warp', 'wireguard', ['Wireguard']],
    ['warp-pro', 'xray', ['v2rayN(G)', 'Streisand']],
    ['warp-pro', 'xray-knocker', ['MahsaNG', 'v2rayN-PRO']],
    ['warp-pro', 'clash', ['Clash Meta', 'Clash Verge', 'FlClash', 'Stash']],
    ['warp-pro', 'amnezia', ['Amnezia', 'WG Tunnel']]
];

const OSES = ['android', 'ios', 'windows', 'linux', 'macos'];

let pass = 0, fail = 0;
const failures = [];
const matrix = {};

function check(cond, msg) {
    if (cond) { pass++; return true; }
    fail++; failures.push(msg); return false;
}

for (const os of OSES) {
    api.setOS(os);
    for (const [type, core, clients] of ROWS) {
        for (const client of clients) {
            calls.clipboard = calls.windowOpen = calls.dlUrl = undefined;
            calls.schemeFired = calls.notify = undefined;

            const plan = api.buildClientLink(os, type, core, client, 'Test');
            await api.oneClickAdd(client, type, core, 'Test');

            const key = `${client}|${os}`;
            matrix[key] = plan.action;

            // Invariant 1: never open the sub endpoint in a browser tab.
            check(!calls.windowOpen,
                `${client}/${os}/${type}: opened a browser tab (${calls.windowOpen})`);

            // Invariant 2: the user always ends up with the link in hand,
            // unless we handed the config to the app as a file.
            if (plan.action !== 'download') {
                check(typeof calls.clipboard === 'string' && calls.clipboard.startsWith('http'),
                    `${client}/${os}/${type}: no plain sub URL copied (got ${calls.clipboard})`);
            }

            // Invariant 3: a scheme is only fired for an app that runs here.
            if (calls.schemeFired) {
                const strategy = clientLinks[client]
                    ?? (client === 'v2rayN(G)'
                        ? (clientLinks['v2rayNG'].platforms.includes(os)
                            ? clientLinks['v2rayNG'] : clientLinks['v2rayN'])
                        : undefined);
                check(strategy?.platforms?.includes(os),
                    `${client}/${os}/${type}: fired ${calls.schemeFired} but app has no ${os} build`);
                check(!/^https?:/.test(calls.schemeFired),
                    `${client}/${os}/${type}: "scheme" was actually an http URL`);
            }

            // Invariant 4: a raw row (base64 URI list) is only handed to an
            // importer that is known to accept that format.
            if (type === 'raw' && plan.action === 'scheme') {
                check(clientLinks[client]?.uriList === true
                        || (client === 'v2rayN(G)' && clientLinks['v2rayNG'].uriList),
                    `${client}/${os}: raw URI list sent to a profile-only importer`);
            }

            // Invariant 5: an app with no build here must say so, not pretend.
            const s = clientLinks[client];
            if (s && client !== 'v2rayN(G)' && !s.platforms.includes(os)) {
                check(plan.action === 'unavailable',
                    `${client}/${os}: no ${os} build but action=${plan.action}`);
            }
        }
    }
}

// A scheme shared by several installed apps is resolved by the OS, not by us:
// firing `clash://` on a phone with Clash Meta, Hiddify and FlClash installed
// opens whichever app claimed it. Any client whose scheme is also registered
// by another client in this table would import into the wrong app, so every
// scheme must be unique to the client that uses it.
const schemeOwners = {};
for (const [name, s] of Object.entries(clientLinks)) {
    for (const t of [s.scheme, ...Object.values(s.schemes ?? {})].filter(Boolean)) {
        const proto = t.split('://')[0];
        (schemeOwners[proto] ??= new Set()).add(name);
    }
}
// Two labels may legitimately share a scheme when they are not two apps
// competing for it: `Clash Verge` / `Clash verge rev` are one app under two
// names, and MahsaNG is a v2rayNG fork that ships the upstream scheme (only
// one of the two is ever installed in practice, and either importing is the
// user's intent). Anything outside these groups is a real ambiguity.
const SAME_APP = [
    new Set(['Clash Verge', 'Clash verge rev']),
    new Set(['v2rayNG', 'MahsaNG'])
];
for (const [proto, owners] of Object.entries(schemeOwners)) {
    const ok = owners.size === 1
        || SAME_APP.some(g => [...owners].every(o => g.has(o)));
    check(ok, `scheme ${proto}:// claimed by ${[...owners].join(', ')} — ambiguous`);
}

// Targeted regressions for the behaviour the user reported.
api.setOS('windows');
for (const client of ['v2rayN(G)', 'MahsaNG', 'Streisand']) {
    calls.dlUrl = calls.windowOpen = calls.schemeFired = undefined;
    await api.oneClickAdd(client, 'normal', 'xray', 'Test');
    check(!calls.dlUrl && !calls.windowOpen && !calls.schemeFired,
        `regression: ${client} on Windows must only copy`);
}

// And that the same rows do import in one tap where the app exists.
api.setOS('android');
calls.schemeFired = undefined;
await api.oneClickAdd('v2rayN(G)', 'normal', 'xray', 'Test');
check(calls.schemeFired?.startsWith('v2rayng://install-sub?url='),
    `v2rayN(G) on Android must fire v2rayng:// (got ${calls.schemeFired})`);
check(api.resolveClientName('v2rayN(G)', 'android') === 'v2rayNG',
    'v2rayN(G) composite label must resolve to v2rayNG on Android');
check(api.resolveClientName('v2rayN(G)', 'windows') === 'v2rayN',
    'v2rayN(G) composite label must resolve to v2rayN on desktop');

api.setOS('ios');
calls.schemeFired = undefined;
await api.oneClickAdd('Streisand', 'normal', 'xray', 'Test');
check(calls.schemeFired?.startsWith('streisand://import/'),
    `Streisand on iOS must fire streisand:// (got ${calls.schemeFired})`);

// NekoBox must use its own sn:// — `clash://` would open a co-installed
// Clash Meta / Hiddify / FlClash instead.
api.setOS('android');
calls.schemeFired = undefined;
await api.oneClickAdd('NekoBox', 'raw', 'sing-box', 'Test');
check(calls.schemeFired?.startsWith('sn://subscription?url='),
    `NekoBox must fire sn:// (got ${calls.schemeFired})`);

// ...and carry a `name`, because NekoBox is the one importer that never reads
// the URL fragment for a title: without the param it names the group
// "Subscription #<epoch millis>".
{
    const q = new URL(calls.schemeFired.replace('sn://', 'https://')).searchParams;
    check(q.get('name') === '💦 BPB Test',
        `NekoBox subscription name must be set (got ${q.get('name')})`);
    check(q.get('url')?.startsWith('http'),
        `NekoBox url param must survive the name param (got ${q.get('url')})`);
}

// Report the resulting matrix so behaviour changes are visible in review.
const byClient = {};
for (const [k, v] of Object.entries(matrix)) {
    const [c, os] = k.split('|');
    (byClient[c] ??= {})[os] = v;
}
const ICON = { scheme: 'import', download: 'file  ', copy: 'copy  ', unavailable: 'n/a   ' };
console.log('client'.padEnd(14) + OSES.map(o => o.padEnd(8)).join(''));
for (const [c, m] of Object.entries(byClient)) {
    console.log(c.padEnd(14) + OSES.map(o => (ICON[m[o]] ?? '?').trim().padEnd(8)).join(''));
}

console.log(`\n==== ${pass} passed, ${fail} failed ====`);
for (const f of failures.slice(0, 20)) console.log('  ✗ ' + f);
process.exit(fail ? 1 : 0);
