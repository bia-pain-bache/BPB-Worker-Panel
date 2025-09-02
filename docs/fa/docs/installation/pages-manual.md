# :material-new-box:{ .md .middle } نصب از طریق Cloudflare Pages با آپلود مستقیم

## مراحل ساخت

### ۱. ساخت حساب کاربری Cloudflare

اگه اکانت Cloudflare ندارید، از [اینجا](https://dash.cloudflare.com/sign-up) یه اکانت بسازید. فقط یه ایمیل برای ثبت‌نام لازمه. به خاطر محدودیت‌های Cloudflare، بهتره از یه ارائه‌دهنده ایمیل معتبر مثل Gmail استفاده کنید.

### ۲. ساخت پروژه Pages

فایل زیپ Worker رو از [اینجا](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.zip) دانلود کنید.

توی اکانت Cloudflare به بخش  `Developer Platform` برید، روی `Create application` کلیک کنید، تب `Pages` رو انتخاب کنید و بعد `Use direct upload` > `Get started` رو بزنید.

یه `Project Name` وارد کنید که دامنه پنل شما رو تشکیل می‌ده.

!!! danger "خطر"
    اسمی انتخاب کنید که کلمه `bpb` توش نباشه، چون ممکنه Cloudflare اکانتتون رو شناسایی کنه و خطای `1101` بده.

روی `Create Project` کلیک کنید و بعد فایل زیپ دانلودشده رو با کلیک روی `Select from computer` و انتخاب `Upload zip` آپلود کنید.

حالا روی `Deploy site` و بعد `Continue to project` کلیک کنید.

پروژه‌تون ساخته شده، ولی هنوز کار نمی‌کنه. از صفحه `Deployment`، توی بخش `Production`، روی `Visit` کلیک کنید.

!!! warning "هشدار"
    Cloudflare ممکنه تا 5 دقیقه طول بکشه تا دامنه Pages رو راه‌اندازی کنه. اگه URL فوراً در دسترس نبود، نگران نباشید.

یه ارور می‌بینید که می‌گه باید UUID و Trojan Password رو تنظیم کنید. یه لینک ارائه شده؛ اونو توی مرورگر باز کنید و برای مرحله بعد نگه دارید.

![Pages Application](../images/generate-secrets.jpg)

### ۳. ساخت KV

از منوی سمت چپ، به بخش `Storage and Databases` > `KV` برید:

![Pages Application](../images/nav-dash-kv.jpg)

روی `Create` کلیک کنید، یه اسم دلخواه بذارید و `Add` رو بزنید.

برگردید به بخش `Workers & Pages` و پروژه Pages که ساختید رو باز کنید. به بخش `Settings` برید، همون‌طور که توی تصویر زیر نشون داده شده:

![Pages Application](../images/settings-functions.jpg)

توی بخش `Bindings`، روی `Add` کلیک کنید و `KV Namespace` رو انتخاب کنید. `Variable name` رو حتماً `kv` (دقیقاً به همین شکل) بذارید و برای `KV namespace` اون KV که قبلاً ساختید رو انتخاب کنید. روی `Save` کلیک کنید.

![Pages Application](../images/bind-kv.jpg)

تنظیمات KV تموم شد.

### ۴. تنظیم UUID ، پسورد Trojanو مسیر امن لینک‌های اشتراک

به صفحه `Secrets generator` که از قبل باز کرده بودید برید و `Copy all` رو بزنید. به داشبورد کلادفلر برگردید، توی همون بخش `Settings`، قسمت `Variables and Secrets` رو پیدا کنید. روی `Add` کلیک کنید. توی خونه `Variable name`  کپی کنید و `Save` رو بزنید. این کار بصورت خودکار هر 3 متغیر رو به پنل شما اضافه میکنه.

از بالای صفحه روی `Create deployment` کلیک کنید و همون فایل زیپ رو دوباره مثل قبل آپلود کنید.

برگردید به صفحه `Deployments`، توی بخش `Production` روی `Visit` کلیک کنید، `panel/` رو به آخر URL اضافه کنید و وارد پنل بشید.

تنظیمات و نکات اضافی توی [راهنمای اصلی](../configuration/index.md) هست. نصب تموم شده و تنظیمات پیشرفته زیر اختیاریه.

## تنظیمات پیشرفته (اختیاری)

### ثابت کردن Proxy IP

به‌صورت پیش‌فرض، این کد از تعداد زیادی Proxy IP به‌صورت تصادفی استفاده می‌کنه و برای هر اتصال به آدرس‌های Cloudflare (که بخش زیادی از وب رو شامل می‌شه) یه IP جدید انتخاب می‌کنه. این تغییر IP ممکنه برای بعضی‌ها، مخصوصاً تریدرها، مشکل‌ساز باشه. از نسخه 2.3.5 به بعد، می‌تونید Proxy IP رو از طریق پنل تغییر بدید و اشتراک رو آپدیت کنید. ولی روش زیر توصیه می‌شه:

!!! note "یادداشت"
    اگه Proxy IP رو از طریق پنل تغییر بدید و اون IP از کار بیفته، باید IP دیگه‌ای بذارید و اشتراک رو آپدیت کنید. این یعنی اگه کانفیگ اهدا کرده باشید، کاربرا نمی‌تونن کانفیگ رو آپدیت کنن چون اشتراک ندارن. برای همین، این روش فقط برای استفاده شخصی خوبه. روش‌های دیگه نیازی به آپدیت اشتراک ندارن.

توی بخش `Settings` پروژه، قسمت `Variables and Secrets` رو باز کنید:

![Pages Application](../images/pages-env-vars.jpg)

روی `Add` کلیک کنید و توی خونه اول `PROXY_IP` (با حروف بزرگ) رو وارد کنید. IPها رو می‌تونید از لینک زیر بگیرید که IPهای مناطق و ISPهای مختلف رو نشون می‌ده:

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

![Pages Application](../images/proxy-ips.jpg)

!!! info "راهنمایی"
    برای استفاده از چند Proxy IP، اونا رو با کاما جدا کنید، مثلاً:
    > 151.213.181.145, 5.163.51.41, bpb.yousef.isegaro.com

IPها رو توی قسمت `Value` وارد کنید و `Save` کنید. از بالای صفحه روی `Create deployment` کلیک کنید و فایل زیپ رو دوباره آپلود کنید. تغییرات اعمال می‌شه.

### تنظیم دامنه Fallback

به‌صورت پیش‌فرض، وقتی دامنه اصلی Pages رو باز می‌کنید، به سایت تست سرعت Cloudflare می‌ره. برای تغییرش، همون مراحل Proxy IP رو دنبال کنید، ولی اسم متغیر رو `FALLBACK` بذارید و یه دامنه (بدون `https://` یا `http://`) به‌عنوان مقدار وارد کنید، مثلاً `www.speedtest.net` یا `npmjs.org`.

### تغییر مسیر اشتراک‌ها

مسیر پیش‌فرض لینک‌های اشتراک همون UUID هست که برای VLESS استفاده می‌شه. برای افزایش حریم خصوصی، می‌تونید این مسیر رو تغییر بدید. همون مراحل بالا رو دنبال کنید، ولی اسم متغیر رو `SUB_PATH` بذارید. توی صفحه Secrets generator، یه گزینه `Random Subscription URI path` هست که یه مسیر براتون تولید می‌کنه؛ می‌تونید ازش استفاده کنید یا یه مقدار دلخواه (با کاراکترهای مجاز) بذارید.

### افزودن دامنه اختصاصی

توی داشبورد Cloudflare، به `Compute (Workers)` > `Workers & Pages` برید و پنلتون رو انتخاب کنید. توی تب `Custom domains`، روی `Set up a custom domain` کلیک کنید. یه دامنه وارد کنید (باید قبلاً دامنه رو خریده باشید و توی همین اکانت فعال کرده باشید). مثلاً اگه دامنه `bpb.com` دارید، می‌تونید خود دامنه یا یه زیردامنه مثل `xyz.bpb.com` رو وارد کنید. روی `Continue` و بعد `Activate domain` کلیک کنید.

توی رکوردهای DNS دامنه‌تون، یه CNAME DNS Record برای `xyz.bpb.com` اضافه کنید که به دامنه Pages اشاره کنه. Cloudflare بعد از یه مدت کوتاه Pages رو به دامنه‌تون متصل می‌کنه. بعدش می‌تونید از آدرس `https://xyz.bpb.com/panel` وارد پنلتون بشید و اشتراک‌های جدید بگیرید.

## به‌روزرسانی پنل

برای به‌روزرسانی پنل، فایل زیپ جدید رو از [اینجا](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.zip) دانلود کنید. توی اکانت Cloudflare، به `Compute (Workers)` > `Workers & Pages` برید، پروژه Pages رو انتخاب کنید، روی `Create deployment` کلیک کنید و فایل زیپ جدید رو آپلود کنید.
