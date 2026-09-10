# استقرار مستقیم ZAVALI روی Cloudflare Workers

## 1) نصب Wrangler
```bash
npm install
```

## 2) ورود به Cloudflare
```bash
npx wrangler login
```

## 3) ساخت KV
اگر هنوز KV ندارید:
```bash
npx wrangler kv namespace create ZAVALI_KV
```

شناسه `id` برگشتی را در `wrangler.jsonc` به جای `REPLACE_WITH_KV_NAMESPACE_ID` قرار دهید.

## 4) بررسی تنظیمات
```bash
npx wrangler deploy --dry-run
```

## 5) Deploy
```bash
npm run deploy
```

## 6) دریافت لینک Worker
پس از Deploy، Wrangler آدرس `workers.dev` را نمایش می‌دهد.

### نکته امنیتی
هیچ API Token، رمز پنل، UUID یا Secret را داخل `worker.js` یا GitHub قرار ندهید. Secrets را با Wrangler تنظیم کنید.
