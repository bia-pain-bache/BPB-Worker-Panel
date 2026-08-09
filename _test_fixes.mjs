// _test_fixes.mjs - regression checks for the PR-1407 fixes (v2, ASCII-safe)
import { readFileSync } from 'fs';
let pass = 0, fail = 0;
const check = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL: ' + msg); } };

const script = readFileSync('src/assets/panel/script.js', 'utf8');
const settings = readFileSync('src/settings/settings.ts', 'utf8');

function grab(src, name) {
    const i = src.indexOf('function ' + name);
    if (i < 0) throw new Error('fn not found: ' + name);
    let depth = 0, j = i;
    for (; j < src.length; j++) {
        const c = src[j];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    return src.slice(i, j);
}
function loadClientLinks() {
    const start = settings.indexOf('export const clientLinks');
    const open = settings.indexOf('{', start);
    let depth = 0, j = open;
    for (; j < settings.length; j++) {
        const c = settings[j];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    const literal = settings.slice(open, j).split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
    const consts = ['ANDROID_ONLY', 'DESKTOP', 'APPLE', 'EVERY_OS']
        .map(n => { const m = settings.match(new RegExp('const ' + n + '[^=]*= (\\[[^\\]]*\\])')); return 'const ' + n + ' = ' + m[1] + ';'; })
        .join('\n');
    return new Function(consts + '\nreturn (' + literal + ');')();
}
const clientLinks = loadClientLinks();

// --- detectOS ---
function makeDetect(ua, tp) {
    const nav = { userAgent: ua, maxTouchPoints: tp };
    const fn = new Function('navigator', grab(script, 'detectOS') + '\nreturn detectOS;')(nav); return fn();
}
const IPAD_DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
check(makeDetect(IPAD_DESKTOP_UA, 5) === 'ios', 'iPadOS desktop-class UA must be ios (got ' + makeDetect(IPAD_DESKTOP_UA, 5) + ')');
check(makeDetect(IPAD_DESKTOP_UA, 0) === 'macos', 'macOS Safari UA must be macos (got ' + makeDetect(IPAD_DESKTOP_UA, 0) + ')');
check(makeDetect('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 5) === 'ios', 'iPadOS mobile UA -> ios');
check(makeDetect('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36', 20) === 'windows', 'Windows touch device -> windows');

// --- buildClientLink ---
const calls = {};
globalThis.window = { location: { href: 'https://example.com/hatbm7M6mrjUCJu/panel' } };
const body = `
globalThis.clientLinkMap = ${JSON.stringify(clientLinks)};
${grab(script, 'resolveClientLink')}
${grab(script, 'toBase64')}
${grab(script, 'buildClientLink')}
return { buildClientLink, setOS: (o) => { currentOS = o; } };
`;
const api = new Function('window', 'let currentOS;\n' + body)(globalThis.window);
// The subscription fragment emoji is authored once in script.js; derive it
// here so the test cannot silently drift from a renamed emoji.
const fragmentLit = script.match(/subUrl\.hash = `([^`]*?) BPB/)?.[1];
if (!fragmentLit) throw new Error('subscription fragment emoji not found in script.js');
const EMOJI = encodeURIComponent(Function('return "' + fragmentLit + '";')());

let r = api.buildClientLink('android', 'normal', 'sing-box', 'husi', 'Test');
check(r.action === 'scheme' && r.url.startsWith('husi://subscription?url='), 'husi/android/normal -> husi scheme (got ' + r.url + ')');
let inner = decodeURIComponent(r.url.split('husi://subscription?url=')[1].split('&')[0]);
check(inner.includes('/sub/raw'), 'husi normal row -> raw endpoint (got ' + inner + ')');
check(r.url.includes('&name='), 'husi link carries name param');
check(inner.includes('app=sing-box'), 'husi raw url keeps app=sing-box');

r = api.buildClientLink('android', 'normal', 'xray', 'v2rayN(G)', 'Test');
check(r.action === 'scheme' && r.url.startsWith('v2rayng://install-sub?url='), 'v2rayN(G)/android/normal -> v2rayng scheme');
inner = decodeURIComponent(r.url.split('v2rayng://install-sub?url=')[1].split('&')[0]);
check(inner.includes('/sub/normal'), 'v2rayNG normal row keeps /sub/normal (got ' + inner + ')');

r = api.buildClientLink('android', 'raw', 'sing-box', 'NekoBox', 'Test');
check(r.url.includes('sn://subscription?url=') && r.url.includes('&name='), 'NekoBox sn:// carries url+name (got ' + r.url + ')');
const nameParam = new URL(r.url.replace('sn://', 'https://')).searchParams.get('name');
check(nameParam === decodeURIComponent(EMOJI + '%20BPB%20Test'), 'NekoBox name decoded (' + nameParam + ')');

check(api.buildClientLink('linux', 'raw', 'sing-box', 'Karing', 'Test').action === 'copy', 'Karing Linux -> copy');
check(api.buildClientLink('windows', 'raw', 'sing-box', 'Karing', 'Test').action === 'copy', 'Karing Windows -> copy');
check(api.buildClientLink('android', 'raw', 'sing-box', 'Karing', 'Test').action === 'scheme', 'Karing Android -> scheme');
check(api.buildClientLink('linux', 'warp', 'clash', 'FlClash', 'Test').action === 'copy', 'FlClash Linux -> copy');
check(api.buildClientLink('windows', 'warp', 'clash', 'FlClash', 'Test').action === 'scheme', 'FlClash Windows -> scheme');

r = api.buildClientLink('android', 'warp', 'wireguard', 'Wireguard', 'Test');
check(r.action === 'download' && r.archive === true, 'Wireguard -> download+archive (got ' + r.action + ')');
check(api.buildClientLink('ios', 'warp-pro', 'amnezia', 'Amnezia', 'Test').archive === true, 'Amnezia -> archive download');

console.log('\n==== ' + pass + ' passed, ' + fail + ' failed ====');
process.exit(fail ? 1 : 0);
