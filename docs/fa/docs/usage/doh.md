# :material-playlist-check:{ .md .middle } DNS over HTTPS (DoH)

از اونجایی که بیشتر سرورهای عمومی معروف DoH توسط فایروال‌ها مسدود شدن، می‌تونیم از domain fronting استفاده کنیم تا بتونیم با موفقیت فایروال رو دور بزنیم. BPB DoH فقط از سرورهای استاندارد DoH بر اساس RFC 8484 پشتیبانی می‌کنه که معمولاً در فرمت `https://domain/dns-query` هستن. مثلاً گوگل دو نوع DoH داره: `https://dns.google/dns-query` که RFC 8484 هست و `https://dns.google/resolve` که API JSON هست. BPB فقط از نوع اول پشتیبانی می‌کنه.

برای تغییر DoH اصلی، می‌تونید یک متغیر محیطی به نام `DOH_URL` رو در تنظیمات worker تعریف کنید و DoH دلخواهتون رو اونجا وارد کنید.

!!! warning "هشدار"
    از BPB DoH برای remote DNS استفاده نکنید، وگرنه درخواست‌های worker‌تون رو هدر می‌دید. بهتره در مرورگرها یا کلاینت‌های مبتنی بر DoH مثل Intra و Rethink ازش استفاده کنید.
