import { readFileSync, writeFileSync, mkdirSync, createReadStream, createWriteStream } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { globSync } from 'glob';
import { minify as jsMinify } from 'terser';
import { minify as htmlMinify } from 'html-minifier';
import JSZip from "jszip";

const env = process.env.NODE_ENV || 'production';
const devMode = env !== 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets');
const DIST_PATH = join(__dirname, '../dist/');

async function processHtmlPages() {
    const indexFiles = globSync('**/index.html', { cwd: ASSET_PATH });
    const result = {};

    for (const relativeIndexPath of indexFiles) {
        const dir = pathDirname(relativeIndexPath);
        const base = (file) => join(ASSET_PATH, dir, file);

        const indexHtml = readFileSync(base('index.html'), 'utf8');
        const styleCode = readFileSync(base('style.css'), 'utf8');
        const scriptCode = readFileSync(base('script.js'), 'utf8');

        const finalScriptCode = await jsMinify(scriptCode);
        const finalHtml = indexHtml
            .replace(/__STYLE__/g, `<style>${styleCode}</style>`)
            .replace(/__SCRIPT__/g, finalScriptCode.code);

        const minifiedHtml = htmlMinify(finalHtml, {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS: true
        });

        result[dir] = JSON.stringify(minifiedHtml);
    }

    console.log('✅ Assets bundled successfuly!');
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
            __PANEL_HTML_CONTENT__: htmls['panel'] ?? '""',
            __LOGIN_HTML_CONTENT__: htmls['login'] ?? '""',
            __ERROR_HTML_CONTENT__: htmls['error'] ?? '""',
            __SECRETS_HTML_CONTENT__: htmls['secrets'] ?? '""',
            __ICON__: JSON.stringify(faviconBase64)
        }
    });

    console.log('✅ Worker built successfuly!');

    let src = code.outputFiles[0].text;
    const zip = new JSZip();
    const workersrc = `// @ts-nocheck\n${src}`;
    
    //生成源文件
    mkdirSync(DIST_PATH, { recursive: true });
    writeFileSync('./dist/worker.src.js', workersrc, 'utf8');
    
    zip.file('_worker.js', workersrc);
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    }).then(nodebuffer => writeFileSync('./dist/worker.src.zip', nodebuffer));

    //替换敏感字符串为 Unicode 序列
    src = src.replace(/BPB Panel/g, '\\u0042\\u0050\\u0042\\u0020\\u0050\\u0061\\u006e\\u0065\\u006c');
    src = src.replace(/BPB Fragment/g, '\\u0042\\u0050\\u0042\\u0020\\u0046\\u0072\\u0061\\u0067\\u006d\\u0065\\u006e\\u0074');
    src = src.replace(/BPB Normal/g, '\\u0042\\u0050\\u0042\\u0020\\u004e\\u006f\\u0072\\u006d\\u0061\\u006c');
    src = src.replace(/BPB Warp/g, '\\u0042\\u0050\\u0042\\u0020\\u0057\\u0061\\u0072\\u0070');
    src = src.replace(/BPB F - Best Ping/g, '\\u0042\\u0050\\u0042\\u0020\\u0046\\u0020\\u002d\\u0020\\u0042\\u0065\\u0073\\u0074\\u0020\\u0050\\u0069\\u006e\\u0067');
    src = src.replace(/BPB - Best Ping/g, '\\u0042\\u0050\\u0042\\u0020\\u002d\\u0020\\u0042\\u0065\\u0073\\u0074\\u0020\\u0050\\u0069\\u006e\\u0067');
    src = src.replace(/BPB F - Best Fragment/g, '\\u0042\\u0050\\u0042\\u0020\\u0046\\u0020\\u002d\\u0020\\u0042\\u0065\\u0073\\u0074\\u0020\\u0046\\u0072\\u0061\\u0067\\u006d\\u0065\\u006e\\u0074');
    src = src.replace(/BPB F - WorkerLess/g, '\\u0042\\u0050\\u0042\\u0020\\u0046\\u0020\\u002d\\u0020\\u0057\\u006f\\u0072\\u006b\\u0065\\u0072\\u004c\\u0065\\u0073\\u0073');
    src = src.replace(/BPB-Warp/g, '\\u0042\\u0050\\u0042\\u002d\\u0057\\u0061\\u0072\\u0070');
    src = src.replace(/BPB Logo/g, '\\u0042\\u0050\\u0042\\u0020\\u004c\\u006f\\u0067\\u006f');
    src = src.replace(/BPB-Warp-Scanner/g, '\\u0042\\u0050\\u0042\\u002d\\u0057\\u0061\\u0072\\u0070\\u002d\\u0053\\u0063\\u0061\\u006e\\u006e\\u0065\\u0072');
    src = src.replace(/BPB-Worker-Panel/g, '\\u0042\\u0050\\u0042\\u002d\\u0057\\u006f\\u0072\\u006b\\u0065\\u0072\\u002d\\u0050\\u0061\\u006e\\u0065\\u006c');
    src = src.replace(/BPB-settings.dat/g, '\\u0042\\u0050\\u0042\\u002d\\u0073\\u0065\\u0074\\u0074\\u0069\\u006e\\u0067\\u0073\\u002e\\u0064\\u0061\\u0074');
    src = src.replace(/bpb-panel/g, '\\u0062\\u0070\\u0062\\u002d\\u0070\\u0061\\u006e\\u0065\\u006c');
    src = src.replace(/bpb.yousef.isegaro.com/g, '129.159.84.71');
    src = src.replace(/env.UUID/g, 'env.UUID || \"' + generateUUID()+'\"');
    src = src.replace(/env.TR_PASS/g, 'env.\\u0054\\u0052\\u005f\\u0050\\u0041\\u0053\\u0053 || \"' + generatePassword() +'\"');   
    src = src.replace(/SingBox/g, '\\u0053\\u0069\\u006e\\u0067\\u0042\\u006f\\u0078');
    src = src.replace(/singbox/g, '\\u0073\\u0069\\u006e\\u0067\\u0062\\u006f\\u0078');
    src = src.replace(/VLESS/g, '\\u0056\\u004c\\u0045\\u0053\\u0053');
    src = src.replace(/vless/g, '\\u0076\\u006c\\u0065\\u0073\\u0073');
    src = src.replace(/Trojan/g, '\\u0054\\u0072\\u006f\\u006a\\u0061\\u006e');
    src = src.replace(/trojan/g, '\\u0074\\u0072\\u006f\\u006a\\u0061\\u006e');
    src = src.replace(/Xray/g, '\\u0058\\u0072\\u0061\\u0079');
    src = src.replace(/xray/g, '\\u0078\\u0072\\u0061\\u0079');
    src = src.replace(/Warp/g, '\\u0057\\u0061\\u0072\\u0070');
    src = src.replace(/warp/g, '\\u0077\\u0061\\u0072\\u0070');
    src = src.replace(/Clash/g, '\\u0043\\u006c\\u0061\\u0073\\u0068');
    src = src.replace(/clash/g, '\\u0063\\u006c\\u0061\\u0073\\u0068');
    src = src.replace(/Iran/g, '\\u0049\\u0072\\u0061\\u006e');
    src = src.replace(/sing-box/g, '\\u0073\\u0069\\u006e\\u0067\\u002d\\u0062\\u006f\\u0078');
    src = src.replace(/Chocolate4U/g, '\\u0043\\u0068\\u006f\\u0063\\u006f\\u006c\\u0061\\u0074\\u0065\\u0034\\u0055');
    src = src.replace(/MetaCubeX/g, '\\u004d\\u0065\\u0074\\u0061\\u0043\\u0075\\u0062\\u0065\\u0058');
    src = src.replace(/BPB/g, '\\u0042\\u0050\\u0042');

    //生成可部署的文件
    const worker = `// @ts-nocheck\n${src}`;
    writeFileSync('./dist/worker.js', worker, 'utf8');

    zip.file('_worker.js', worker);
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    }).then(nodebuffer => writeFileSync('./dist/worker.zip', nodebuffer));

    console.log('✅ Done!');
}

//生成 UUID
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//生成随机密码
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

buildWorker().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
