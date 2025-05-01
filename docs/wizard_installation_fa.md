<h1 align="center">نصب BPB Panel از طریق Wizard</h1>

<p align="center">
  <img src="assets/images/wizard.jpg">
</p>
<br>

## مقدمه

برای تسهیل فرایند ساخت و همچنین پیشگیری از اشتباهات کاربر موقع ساخت، پروژه‌ی BPB Wizard راه‌اندازی شده و هر دو روش Workers و Pages رو پشتیبانی میکنه و حتما توصیه میکنم از این روش استفاده کنید.

## قدم اول

برای استفاده از این روش به هیچ‌چیز جز یه اکانت کلادفلر نیاز ندارید، میتونید [از اینجا](https://dash.cloudflare.com/sign-up/) یه اکانت بسازید و فراموش نکنید که بعدش به ایمیل خودتون برید و اکانت رو تایید کنید.

## قدم دوم

اگر به VPN متصل هستید قطعش کنید، بر اساس سیستم‌عامل خودتون از [اینجا](https://github.com/bia-pain-bache/BPB-Wizard/releases/latest) فایل زیپ رو دانلود کنید، Unzip کنید و اجراش کنید.

اول میره به اکانت Cloudflare شما login میکنه، بعد برمیگردید به ترمینال، یه سری سوال میپرسه مربوط به تنظیمات، میتونید از پیش‌فرض خودش استفاده کنید یا مقادیر مدنظر خودتون رو وارد کنید، در انتها هم پنل رو براتون در مرورگر باز میکنه و تمام.

> [!TIP]
> برای هر تنظیماتی که سوال میپرسه، خودش یه مقدار امن و شخصی براتون تولید کرده از قبل، میتونید در جواب سوالات Enter بزنید تا بره سوال بعدی ولی میتونید مقادیر دلخواد خودتون رو هم وارد کنید.

### سیستم‌عامل Android

کاربران Android در صورت نصب داشتن Termux روی گوشی میتونن فقط با کپی کردن این کد داخل Termux روی گوشی BPB Panel رو نصب کنن.

### ARM v8

```bash
curl -L -# -o BPB-Wizard.zip https://github.com/bia-pain-bache/BPB-Wizard/releases/latest/download/BPB-Wizard-linux-arm64.zip && unzip BPB-Wizard.zip && chmod +x ./BPB-Wizard && ./BPB-Wizard
```

### ARM v7

```bash
curl -L -# -o BPB-Wizard.zip https://github.com/bia-pain-bache/BPB-Wizard/releases/latest/download/BPB-Wizard-linux-arm.zip && unzip BPB-Wizard.zip && chmod +x ./BPB-Wizard && ./BPB-Wizard
```

> [!IMPORTANT]
> حواستون باشه Termux رو فقط از [منبع اصلیش](https://github.com/termux/termux-app/releases/latest) دانلود و نصب کنید، نصب از طریق Google Play ممکنه با شما رو با مشکل مواجه کنه.
