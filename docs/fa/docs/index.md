# پنل BPB

![پنل BPB](images/panel-overview.jpg)

## معرفی

این پروژه یه پنل کاربری برای دسترسی به کانفیگ‌های رایگان، امن و خصوصی **VLESS**، **Trojan** و **Warp** ارائه می‌ده. حتی وقتی دامنه‌ها یا سرویس Warp توسط اپراتورها فیلتر شدن، اتصال رو تضمین می‌کنه. این پنل به دو روش راه‌اندازی می‌شه:

- با **Cloudflare Workers**
- با **Cloudflare Pages**

🌟 اگه **پنل BPB** براتون مفید بوده، با حمایتتون بهم دلگرمی می‌دید 🌟

```title="USDT (BEP20)"
0xbdf15d41C56f861f25b2b11C835bd45dfD5b792F
```

## ویژگی‌ها

- **رایگان و شخصی**: بدون هیچ هزینه‌ای، سرور شما شخصی هست.
- **پنل کاربری ساده**: کار باهاش راحته و تنظیمات و استفاده ازش خیلی آسونه.
- **پروتکل‌های متنوع**: ارائه کانفیگ‌های VLESS، Trojan و Wireguard (Warp).
- **DoH شخصی**: یک DoH شخصی با قابلیت تنظیم DNS زیربنایی.
- **کانفیگ‌های Warp Pro**: کانفیگ‌های Warp بهینه‌شده برای شرایط خاص ایران.
- **پشتیبانی از Fragment**: اتصال حتی در صورت فیلتر شدن دامنه.
- **قوانین مسیریابی کامل**: دور زدن سایت‌های ایرانی، چینی و روسی، مسدود کردن QUIC، محتوای پورن، تبلیغات، بدافزارها، فیشینگ و در زدن سایت‌های تحریمی.
- **زنجیره‌ی Proxy**: می‌تونید یه Proxy زنجیره‌ای از نوع VLESS، Trojan، Shadowsocks، Socks یا http اضافه کنید تا IP ثابت بشه.
- **پشتیبانی از برنامه‌های مختلف**: لینک‌های اشتراک برای برنامه‌های با هسته‌های Xray، Sing-box و Clash-Mihomo.
- **پنل امن با رمز عبور**: پنل محافظت شده با رمز عبور.
- **سفارشی‌سازی کامل**: تنظیم IP تمیز، Proxy IP، سرورهای DNS، انتخاب پورت‌ها و پروتکل‌ها، Warp Endpoint و خیلی امکانات دیگه.

## محدودیت‌ها

- **اتصال UDP**: پروتکل‌های VLESS و Trojan روی Workerها نمی‌تونن UDP رو به‌خوبی پشتیبانی کنن، برای همین به‌صورت پیش‌فرض غیرفعاله (این روی امکاناتی مثل تماس تصویری تلگرام تأثیر می‌ذاره). DNSهای UDP هم پشتیبانی نمی‌شن. به جاش DoH فعاله که امن‌تره.
- **محدودیت تعداد درخواست**: هر Worker برای VLESS و Trojan روزانه 100 هزار درخواست پشتیبانی می‌کنه، که برای 2-3 نفر کافیه. برای اتصال نامحدود می‌تونید از کانفیگ‌های Warp استفاده کنید.

## شروع به کار

- [روش‌های راه‌اندازی](installation/wizard.md)
- [راهنمای تنظیمات](configuration/index.md)
- [نحوه‌ی استفاده](usage/index.md)
- [پرسش‌های متداول (FAQ)](faq.md)

## برنامه‌های پشتیبانی‌شده

|       Client        | حداقل نسخه پشتیبانی | پشتیبانی از Fragment | پشتیبانی از Warp Pro |
| :-----------------: | :-----------------: | :------------------: | :------------------: |
|     **v2rayNG**     |        2.2.3        |  :heavy_check_mark:  |  :heavy_check_mark:  |
|     **MahsaNG**     |         16          |  :heavy_check_mark:  |  :heavy_check_mark:  |
|     **v2rayN**      |       7.22.5        |  :heavy_check_mark:  |  :heavy_check_mark:  |
|   **v2rayN-PRO**    |         2.0         |  :heavy_check_mark:  |  :heavy_check_mark:  |
|    **Sing-box**     |       1.12.0        |  :heavy_check_mark:  |         :x:          |
|    **Streisand**    |       1.6.71        |  :heavy_check_mark:  |  :heavy_check_mark:  |
|   **Clash Meta**    |                     |         :x:          |  :heavy_check_mark:  |
| **Clash Verge Rev** |                     |         :x:          |  :heavy_check_mark:  |
|     **FLClash**     |                     |         :x:          |  :heavy_check_mark:  |
|   **AmneziaVPN**    |                     |         :x:          |  :heavy_check_mark:  |
|    **WG Tunnel**    |                     |         :x:          |  :heavy_check_mark:  |

## متغیرهای محیطی (داشبورد کلادفلر)

|  نام متغیر   |           مورد استفاده            |       اجباری       |
| :----------: | :-------------------------------: | :----------------: |
|   **UUID**   |      UUID برای پروتکل VLESS       | :heavy_check_mark: |
| **TR_PASS**  |        پسورد پروتکل Trojan        | :heavy_check_mark: |
| **PROXY_IP** |   Proxy IP برای VLESS و Trojan    |        :x:         |
|  **PREFIX**  | NAT64 Prefix برای VLESS و Trojan  |        :x:         |
| **SUB_PATH** |     مسیر لینک‌های اشتراک شخصی     |        :x:         |
| **FALLBACK** | دامنه‌ی پوششی برای VLESS و Trojan |        :x:         |
| **DOH_URL**  |    DOH برای عملیات داخلی ورکر     |        :x:         |

---

## تعداد ستاره‌ها به مرور زمان

[![تعداد ستاره‌ها به مرور زمان](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)
