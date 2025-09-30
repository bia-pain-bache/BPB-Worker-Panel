import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { globSync } from 'glob';
import JSZip from "jszip";
import pkg from '../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets');
const DIST_PATH = join(__dirname, '../dist/');

const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const success = `${green}✔${reset}`;
const failure = `${red}✖${reset}`;

const version = pkg.version;

/**
 * 说明：
 * - 该函数不会压缩、混淆或编码 HTML / CSS / JS。
 * - 它会把最终 HTML 原样作为 JSON 字符串返回，以便在 esbuild define 中注入。
 */
async function processHtmlPages() {
    const indexFiles = globSync('**/index.html', { cwd: ASSET_PATH });
    const result = {};

    for (const relativeIndexPath of indexFiles) {
        const dir = pathDirname(relativeIndexPath);
        const base = (file) => join(ASSET_PATH, dir, file);

        const indexHtml = readFileSync(base('index.html'), 'utf8');
        let finalHtml = indexHtml.replaceAll('__VERSION__', version);

        // 如果不是 error 页面，就将 CSS / JS 原样内联
        if (dir !== 'error') {
            const styleCode = readFileSync(base('style.css'), 'utf8');
            const scriptCode = readFileSync(base('script.js'), 'utf8');

            // 注意：不做任何压缩/混淆/编码
            finalHtml = finalHtml
                .replaceAll('__STYLE__', `<style>\n${styleCode}\n</style>`)
                .replaceAll('__SCRIPT__', `\n${scriptCode}\n`);
        }

        // 原样保留 HTML（不进行任何 minify 或编码）
        // 使用 JSON.stringify 包装，便于注入 esbuild.define（确保转义）
        result[dir] = JSON.stringify(finalHtml);
    }

    console.log(`${success} Assets prepared (no minify/obfuscation).`);
    return result;
}

async function buildWorker() {
    const htmls = await processHtmlPages();
    const faviconBuffer = readFileSync('./src/assets/favicon.ico');
    const faviconBase64 = faviconBuffer.toString('base64');

    const code = await build({
        entryPoints: [join(__dirname, '../src/worker.js')],
        bundle: true,
        format: 'esm',
        write: false,
        external: ['cloudflare:sockets'],
        platform: 'browser',
        target: 'es2020',
        define: {
            // 直接注入原始 HTML 字符串（已经是 JSON.stringify 包装）
            __PANEL_HTML_CONTENT__: htmls['panel'] ?? '""',
            __LOGIN_HTML_CONTENT__: htmls['login'] ?? '""',
            __ERROR_HTML_CONTENT__: htmls['error'] ?? '""',
            __SECRETS_HTML_CONTENT__: htmls['secrets'] ?? '""',
            __ICON__: JSON.stringify(faviconBase64),
            __VERSION__: JSON.stringify(version)
        }
    });

    console.log(`${success} Worker bundle created (unminified).`);

    // 直接使用打包结果的源码，不进行 terser 压缩或 javascript-obfuscator 混淆
    const finalCode = code.outputFiles[0].text;

    const buildTimestamp = new Date().toISOString();
    const buildInfo = `// Build: ${buildTimestamp}\n// NOTE: no minify, no obfuscation — raw source output\n`;
    const worker = `${buildInfo}// @ts-nocheck\n${finalCode}`;

    mkdirSync(DIST_PATH, { recursive: true });
    writeFileSync(join(DIST_PATH, 'worker.js'), worker, 'utf8');

    const zip = new JSZip();
    zip.file('_worker.js', worker);
    const nodebuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });
    writeFileSync(join(DIST_PATH, 'worker.zip'), nodebuffer);

    console.log(`${success} Done — dist/worker.js and dist/worker.zip written.`);
}

buildWorker().catch(err => {
    console.error(`${failure} Build failed:`, err);
    process.exit(1);
});
