// scripts/build.js
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { globSync } from 'glob';
import { minify as htmlMinify } from 'html-minifier';
import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

// 兼容读取 package.json，不用 import assert
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));


const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets');
const DIST_PATH = join(__dirname, '../dist/');

const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const success = `${green}✔${reset}`;
const failure = `${red}✖${reset}`;

const version = pkg.version || '0.0.0';

async function processHtmlPages() {
    const indexFiles = globSync('**/index.html', { cwd: ASSET_PATH });
    const result = {};

    for (const relativeIndexPath of indexFiles) {
        const dir = relativeIndexPath.includes('/') ? relativeIndexPath.split('/')[0] : '.';
        const base = (file) => join(ASSET_PATH, pathDirname(relativeIndexPath), file);

        const indexHtml = readFileSync(join(ASSET_PATH, relativeIndexPath), 'utf8');
        let finalHtml = indexHtml.replaceAll('__VERSION__', version);

        // Only attempt to inline style/script if those files exist next to index.html
        const containerDir = join(ASSET_PATH, pathDirname(relativeIndexPath));
        try {
            // style.css
            const stylePath = join(containerDir, 'style.css');
            const scriptPath = join(containerDir, 'script.js');

            const styleCode = readFileSync(stylePath, 'utf8');
            const scriptCode = readFileSync(scriptPath, 'utf8');

            finalHtml = finalHtml
                .replaceAll('__STYLE__', `<style>${styleCode}</style>`)
                .replaceAll('__SCRIPT__', scriptCode);
        } catch (e) {
            // if missing style/script, leave placeholders as-is or replace with empty strings
            finalHtml = finalHtml
                .replaceAll('__STYLE__', '')
                .replaceAll('__SCRIPT__', '');
        }

        const minifiedHtml = htmlMinify(finalHtml, {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            // 保守压缩选项，避免破坏 JS 或模板
            keepClosingSlash: true
        });

        // 使用 base64 编码（Worker 端解码还原为 UTF-8）
        const encodedHtml = Buffer.from(minifiedHtml, 'utf8').toString('base64');

        // 将直接注入为字符串（JSON stringify，便于在 esbuild define 中替换）
        result[pathDirname(relativeIndexPath) === '.' ? 'root' : pathDirname(relativeIndexPath)] = JSON.stringify(encodedHtml);
    }

    console.log(`${success} Assets processed successfully.`);
    return result;
}

async function buildWorker() {
    const htmls = await processHtmlPages();

    // favicon (可选)
    let faviconBase64 = '';
    try {
        const faviconBuffer = readFileSync('./src/assets/favicon.ico');
        faviconBase64 = faviconBuffer.toString('base64');
    } catch (e) {
        // 没有 favicon 则不注入
        faviconBase64 = '';
    }

    // esbuild 打包（不进行压缩与混淆）
    const esbuildResult = await build({
        entryPoints: [join(__dirname, '../src/worker.js')],
        bundle: true,
        format: 'esm',
        write: false,
        external: ['cloudflare:sockets'],
        platform: 'browser',
        target: 'es2020',
        // 不启用 minify 或 tree-shaking 之类的破坏性优化
        minify: false,
        define: {
            __PANEL_HTML_CONTENT__: htmls['panel'] ?? '""',
            __LOGIN_HTML_CONTENT__: htmls['login'] ?? '""',
            __ERROR_HTML_CONTENT__: htmls['error'] ?? '""',
            __SECRETS_HTML_CONTENT__: htmls['secrets'] ?? '""',
            __ICON__: JSON.stringify(faviconBase64),
            __VERSION__: JSON.stringify(version)
        }
    });

    console.log(`${success} Worker bundled successfully.`);

    // esbuild 输出（应该只有一个 outputFiles 项）
    const bundledText = esbuildResult.outputFiles && esbuildResult.outputFiles[0] ? esbuildResult.outputFiles[0].text : '';

    // 将构建信息前置
    const buildTimestamp = new Date().toISOString();
    const buildInfo = `// Build: ${buildTimestamp}\n// NOTE: This build has NO minification or obfuscation.\n`;
    const worker = `${buildInfo}// @ts-nocheck\n${bundledText}`;

    mkdirSync(DIST_PATH, { recursive: true });
    writeFileSync(join(DIST_PATH, 'worker.js'), worker, 'utf8');

    // 生成 zip
    const zip = new JSZip();
    zip.file('_worker.js', worker);
    const nodebuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    });
    writeFileSync(join(DIST_PATH, 'worker.zip'), nodebuffer);

    console.log(`${success} Output written to ${DIST_PATH}`);
}

buildWorker().catch(err => {
    console.error(`${failure} Build failed:`, err);
    process.exit(1);
});
