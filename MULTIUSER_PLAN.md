# MULTIUSER_PLAN — نقشه‌ی افزودن لایه‌ی مدیریت کاربر (مبتنی بر زمان) به BPB-Worker-Panel

> این سند خروجی **فاز ۰** است: کاوش، نقشه‌ی دیتای KV، فهرست فایل‌های هر فاز و ریسک‌ها.
> هیچ کد اجرایی در این فاز نوشته نشده. شروع فازهای بعدی منوط به تأیید صریح است.

---

## ۱) خلاصه‌ی معماری فعلی (پایه‌ای که روی آن کار می‌کنیم)

- **Worker entry:** `src/worker.ts` → `init()` → اگر `Upgrade: websocket` بود `handleWebsocket`، وگرنه `initHttp()` + سوییچ روی اولین سگمنت مسیر.
- **State فقط روی KV** (`env.kv: KVNamespace`). نه D1، نه Durable Object، نه wrangler.
- **کلیدهای فعلی KV:** `proxySettings`, `warpAccounts`, `pwd` (پسورد پنل), `secretKey` (کلید HS256 برای JWT).
- **Auth ادمین:** کوکی `jwtToken` با `jose` (HS256). تابع `Authenticate(request, env)` در `src/auth.ts`.
- **Auth کاربر VLESS:** `parseVlHeader` (sync) در `src/protocols/websocket/vless.ts:106` — ۱۶ بایت هدر را به UUID تبدیل و با `globalConfig.userID` (= `env.UUID`) مقایسه می‌کند.
- **Auth کاربر Trojan:** `parseTrHeader` در `src/protocols/websocket/trojan.ts:85` — هدر را با `sha224(globalConfig.TrPass)` (= `sha224(env.TR_PASS)`) مقایسه می‌کند.
- **Sub path:** `httpConfig.subPath = SUB_PATH || UUID` در `init.ts:163`. در `handleSubscriptions` به‌صورت `/sub/{type}/${subPath}` استفاده می‌شود. همچنین `/dns-query/${subPath}` در `handleDoH`.
- **نقاط تولید کانفیگ که `uuid`/`TrPass` را مصرف می‌کنند:**
  - `src/common/handlers.ts:555,580,583` (`getURLConfigs`)
  - `src/cores/xray/outbounds.ts:99,128,139`
  - `src/cores/sing-box/outbounds.ts:64,89,95`
  - `src/cores/clash/outbounds.ts:56,85,90`
- **پنل ادمین:** `src/assets/panel/{index.html,script.js,style.css}` — HTML/JS خام، **بدون فریم‌ورک، بدون سیستم تب، فقط انگلیسی** (`<html lang="en">`).
- **Build:** `scripts/build.js` (esbuild + terser/obfuscator). HTML/CSS/JS پنل به‌صورت gzip+base64 در زمان build در سورس inline می‌شوند. تست runtime نیست؛ معیار سلامت فقط `npm run check` (`tsc --noEmit`) است.

---

## ۲) مدل داده‌ی کاربر روی KV

### تایپ
```ts
interface User {
    id: string;             // 8 کاراکتر، یکتا
    name: string;           // نام خوانای ادمین‌محور
    uuid: string;           // UUID اختصاصی VLESS کاربر
    trojanPassword: string; // پسورد خام Trojan کاربر (هش‌اش برای lookup)
    subToken: string;       // توکن مسیر ساب (متمایز از UUID)
    createdAt: number;      // epoch ms
    expiresAt: number | null; // null = بدون انقضا
    deviceLimit: number;    // 0 = نامحدود
    enabled: boolean;
}
```

### کلیدهای KV
| کلید | مقدار | کاربرد |
|---|---|---|
| `users:index` | `string[]` (آرایه‌ی idها) | لیست‌کردن سریع در پنل |
| `user:{id}` | JSON `User` | رکورد کامل کاربر |
| `lookup:vless:{uuid}` | `id` (string) | hot-path در `parseVlHeader` |
| `lookup:trojan:{sha224(trojanPassword)}` | `id` (string) | hot-path در `parseTrHeader` (هدر Trojan خودش sha224 است) |
| `lookup:sub:{subToken}` | `id` (string) | hot-path در `handleSubscriptions` |
| `devices:{id}` | JSON map `{ [fingerprint]: lastSeenMs }` | فاز ۳ — سقف دیوایس |

> **چرا lookup جدا؟** در hot-path اتصال نباید کل کاربران اسکن شوند. با یک `kv.get` ایندکس → `kv.get` رکورد کاربر تمام می‌شود (دو RTT KV، که در Workers تقریباً رایگان است).

### سازگاری (legacy mode)
- اگر `users:index` وجود نداشت **یا** خالی بود → پنل و auth باید مثل قبل با `env.UUID`/`env.TR_PASS` کار کنند.
- یک کاربر مجازی legacy با id ثابت `__legacy__` در حافظه ساخته می‌شود (هرگز در KV ذخیره نمی‌شود، فقط در سطح runtime).
- `subPath` قدیمی همچنان زنده می‌ماند (`SUB_PATH || env.UUID`) و در `handleSubscriptions` به‌عنوان fallback پشتیبانی می‌شود.

---

## ۳) فهرست فایل‌ها به تفکیک فاز

### فاز ۱ — مدل داده
**ایجاد:**
- `src/users/store.ts` (لایه‌ی KV کاربر؛ تنها نقطه‌ی تماس با KV برای دیتای کاربر)

**ویرایش:**
- `src/types/global.d.ts` — افزودن `interface User`.
- `tsconfig.json` — افزودن alias `@users/*` → `src/users/*` (هماهنگ با سبک فعلی).
- `scripts/build.js` — فقط در صورت نیاز esbuild path alias (esbuild از همان `tsconfig` می‌خواند، احتمالاً نیاز نباشد — بررسی می‌شود).

### فاز ۲ — اعتبارسنجی زمانی + اتصال به پروتکل‌ها + ساب‌لینک
**ایجاد:**
- `src/users/auth.ts` — `validateUserAccess(user, env)` + `resolveUserFromVlessUuid` + `resolveUserFromTrojanHash` + `resolveUserFromSubToken`.

**ویرایش:**
- `src/protocols/websocket/vless.ts` — `parseVlHeader` → **async**، lookup با store، فراخوانی validate. صداگذاری در `VlOverWSHandler` با `await`.
- `src/protocols/websocket/trojan.ts` — همانند بالا برای `parseTrHeader`.
- `src/common/init.ts` — `globalConfig` حالا «defaults» می‌شود؛ مقادیر واقعی per-request برای ساب از کاربر گرفته می‌شود.
- `src/common/handlers.ts` — `handleSubscriptions` پارس مسیر جدید `/sub/{type}/{subToken}`، اعتبارسنجی، تزریق `uuid`/`trojanPassword` کاربر به ابزار تولید کانفیگ (یا با per-request context یا پارامتری کردن). همچنین مسیر legacy حفظ می‌شود.
- `src/common/handlers.ts:553+` — `getURLConfigs` پارامتر کاربر می‌گیرد (یا از یک context per-request می‌خواند).
- `src/cores/{xray,sing-box,clash}/outbounds.ts` — `buildWebsocketOutbound` و مسیرهای مشابه: به‌جای خواندن از `globalConfig`، از یک context کاربر بخوانند (راه ساده‌تر: یک `globalThis.requestUser?: { uuid, trojanPassword }` که در ابتدای `handleSubscriptions` ست و در پایان پاک می‌شود).

> **تصمیم اولیه (می‌توان عوض کرد):** برای حداقل diff در core‌ها، یک slot جدید `globalThis.requestUser` (یا حتی override موقتی `globalConfig.userID/TrPass` به مقادیر کاربر در ابتدای request ساب) اضافه می‌کنیم. این کم‌invasiveترین مسیر است و معماری لایه‌ای را به‌هم نمی‌زند.

### فاز ۳ — سقف دیوایس
**ایجاد:**
- `src/users/devices.ts` — `recordDevice(user, request)`، `countActiveDevices(user)`، throttle و پاک‌سازی lazy.

**ویرایش:**
- `src/users/auth.ts` — قلاب سقف دیوایس در `validateUserAccess`.
- `src/protocols/websocket/{vless,trojan}.ts` — پس از auth موفق، `recordDevice` (با IP+UA → هش).

### فاز ۴ — پنل ادمین: تب «Users»
**ایجاد:**
- `src/users/api.ts` — هندلر اندپوینت‌های `/panel/users/*` پشت `Authenticate`.

**ویرایش:**
- `src/common/handlers.ts` — افزودن مسیرهای `/panel/users`, `/panel/users/create`, `/panel/users/update`, `/panel/users/delete` در `handlePanel`.
- `src/assets/panel/index.html` — افزودن سکشن جدید کاربران (در سبک `.section` فعلی).
- `src/assets/panel/script.js` — منطق فرانت کاربران.
- `src/assets/panel/style.css` — استایل‌های لازم.

---

## ۴) ریسک‌ها و ابهامات (که قبل از فاز بعد باید روشن شوند)

### R1. async کردن `parseVlHeader` در hot path
`parseVlHeader` الان از داخل `WritableStream.write` صدا زده می‌شود (`vless.ts:51`). با async شدن باید مطمئن شویم:
- ترتیب chunkها حفظ می‌شود (write callback خودش پشت سر هم صدا زده می‌شود، پس مشکلی نیست — اما `await kv.get` در اولین chunk تأخیر اضافه می‌کند).
- استثناها همان رفتار `hasError` فعلی را حفظ کنند (پیام مبهم `invalid user`).
- یک بار شدن lookup در lifecycle اتصال (کش در closure) تا برای chunkهای بعدی KV نخوریم.

### R2. تزریق هویت کاربر به تولید کانفیگ
سه‌تا core جداگانه (xray/sing-box/clash) + `getURLConfigs` همگی از `globalConfig.userID/TrPass` می‌خوانند. سه گزینه:
- **(a)** override موقتی `globalConfig` در ابتدای request ساب. ساده‌ترین، اما `globalConfig` در تایپ `readonly` است → کلید readonly را باید بشکنیم.
- **(b)** افزودن slot جدید `globalThis.requestUser` و تغییر هر چهار نقطه‌ی مصرف. تمیزتر اما diff بیشتر.
- **(c)** پارامتری‌کردن signature توابع — تمیزترین معماری، بیشترین diff.

پیشنهاد من **(b)** است (یک slot جدید با fallback به `globalConfig` برای legacy). در فاز ۲ بحث می‌کنیم.

### R3. ابهام پنل دوزبانه/RTL
پرامپت می‌گوید «زبان دوگانه EN/FA و RTL را مثل بقیه‌ی پنل رعایت کن.» اما **پنل فعلی فقط انگلیسی است** (`<html lang="en">`، هیچ سیستم i18n یا dirسوییچ ندارد). دو راه:
- **(i)** فقط همان زبان فعلی (انگلیسی) برای تب کاربران، با attribute آماده‌ی i18n برای آینده.
- **(ii)** معرفی یک سیستم i18n سبک به کل پنل — کار به مراتب بزرگ‌تر و خارج از scope multiuser.

**تصمیم لازم از تو (فاز ۴):** کدام؟ پیشنهاد من **(i)** است.

### R4. حفظ سازگاری ساب legacy
مسیر `/sub/.../${SUB_PATH || UUID}` باید زنده بماند. در `handleSubscriptions` ابتدا بررسی می‌کنیم اگر سگمنت آخر = `subPath` قدیمی بود → legacy؛ وگرنه سعی به `lookup:sub:{token}`. این منطق پاکیزه‌سازی باید مراقب باشد تا مسیرهای دیگر (warp و …) را قاطی نکند.

### R5. منقضی‌سازی فعال
اعتبارسنجی صرفاً **هنگام برقراری اتصال** کار می‌کند. اتصال WebSocket‌های در حال اجرا با expiry قطع نمی‌شوند (Workers اصلاً مکانیزم تایمر داخلی برای socket‌ها در سطح ما ندارد). این رفتار **عمداً تقریبی** است و در سند کاربر نهایی باید روشن باشد.

### R6. فاز ۳ — هزینه‌ی نوشتن KV
به‌ازای هر اتصال یک نوشتن `devices:{id}` انجام شود → سقف نوشتن روزانه‌ی KV (۱۰۰۰ در روز در پلن رایگان) ممکن است بترکد. throttle (مثلاً حداکثر هر ۱۰ دقیقه برای هر دیوایس) ضروری است. هزینه‌ی فاز ۳ از همه‌ی فازها بیشتر در ریسک read/write KV است.

### R7. تایپ `globalConfig`
`GlobalConfig` در `types/global.d.ts` تمام فیلدهایش `readonly` هستند. اگر گزینه (a) از R2 را برویم باید readonly برداشته شود (تأثیر کم اما باید آگاهانه باشد).

### R8. مولد UUID
از `crypto.randomUUID()` استفاده می‌کنیم — همان فرمت v4 که `isValidUUID` فعلی می‌پذیرد.

### R9. حذف کاربر و orphan شدن lookupها
هر `updateUser` که `uuid`/`trojanPassword`/`subToken` را عوض کند باید lookup قدیمی را پاک کند. `deleteUser` هم همین‌طور. در `store.ts` این invariant را تست می‌کنیم.

---

## ۵) معیار پایان فاز ۰

- [x] کل فایل‌های لیست‌شده در پرامپت خوانده شدند.
- [x] واقعیت‌های پایه‌ای پرامپت با کد تطبیق داده شدند (همه تأیید شدند جز R3 درباره‌ی i18n).
- [x] نقشه‌ی KV ، فهرست فایل‌های هر فاز، و ریسک‌ها مستند شدند.
- [x] هیچ کد اجرایی نوشته نشد.

## درخواست تأیید برای فاز ۱

اگر این نقشه را تأیید کنی، فاز ۱ را شروع می‌کنم:
- ساخت `src/users/store.ts`
- افزودن `interface User` به `global.d.ts`
- افزودن alias `@users/*` به `tsconfig.json`
- اجرای `npm run check` و گزارش.

سؤال‌های باز که قبل از فاز ۴ باید جواب بگیرند (الان لازم نیست، فقط یادداشت):
- **Q1 (R3):** برای تب کاربران، گزینه (i) فقط انگلیسی، یا (ii) معرفی i18n کامل؟
- **Q2 (R2):** آیا با گزینه (b) (slot `requestUser`) موافقی؟
