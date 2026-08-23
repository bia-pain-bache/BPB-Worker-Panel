import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { globSync } from 'glob';
import { minify as jsMinify } from 'terser';
import { minify as htmlMinify } from 'html-minifier';
import pkg from '../package.json' with { type: 'json' };
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets');
const DIST_PATH = join(__dirname, '../dist/');

const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const success = `${green}✔${reset}`;
const failure = `${red}✗${reset}`;

async function processHtmlPages() {
    const indexFiles = globSync('**/index.html', { cwd: ASSET_PATH });
    const result = {};

    for (const relativeIndexPath of indexFiles) {
        const dir = pathDirname(relativeIndexPath);
        const base = (file) => join(ASSET_PATH, dir, file);

        const indexHtml = readFileSync(base('index.html'), 'utf8');
        let html = indexHtml.replaceAll('__VERSION__', pkg.version);

        if (dir !== 'error') {
            const css = readFileSync(base('style.css'), 'utf8');

            const script = readFileSync(base('script.js'), 'utf8');
            const { code } = await jsMinify(script);

            html = html
                .replace('/* CSS_PLACEHOLDER */', css)
                .replace('/* JS_PLACEHOLDER */', code);
        }

        const minifiedHtml = htmlMinify(html, {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS: true
        });

        const compressed = gzipSync(minifiedHtml, { level: 9 });
        result[dir] = compressed.toString('base64');
    }

    console.log(`${success} Assets bundled successfuly!`);
    return result;
}

async function buildWorker() {
    const htmls = await processHtmlPages();
    const faviconBase64 = readFileSync('./src/assets/favicon.ico').toString('base64');

    const code = await build({
        entryPoints: [join(__dirname, '../src/worker.ts')],
        bundle: true,
        format: 'esm',
        write: false,
        external: [
            'cloudflare:sockets',
            'node:crypto'
        ],
        platform: 'browser',
        target: 'esnext',
        loader: { '.ts': 'ts' },
        define: { VERSION: `"${pkg.version}"` }
    });

    console.log(`${success} Worker built successfuly!`);

    const { code: script } = await jsMinify(code.outputFiles[0].text, {
        module: true,
        output: {
            comments: false
        },
        compress: {
            dead_code: false,
            unused: false
        }
    });

    console.log(`${success} Worker minified successfuly!`);

    const base64Gzip = gzipSync(script, { level: 9 }).toString("base64");

    const embededContents = {
        SOURCE_CONTENT: base64Gzip,
        PANEL_HTML_CONTENT: htmls['panel'],
        LOGIN_HTML_CONTENT: htmls['login'],
        ERROR_HTML_CONTENT: htmls['error'],
        PROXY_IP_HTML_CONTENT: htmls['proxy-ip'],
        ICON_CONTENT: faviconBase64
    };

    const worker = `Object.assign(globalThis, ${JSON.stringify(embededContents)});${script}`;

    mkdirSync(DIST_PATH, { recursive: true });
    writeFileSync('./dist/worker.js', worker, 'utf8');

    console.log(`${success} Done!`);
}

buildWorker().catch(err => {
    console.error(`${failure} Build failed:`, err);
    process.exit(1);
});

