# 🎉 BPB Next Generation

This version can only be deployed using [ONE-CLICK online BPB Wizard](https://wizard.bpb-panel.workers.dev) and you can UPDATE and DELETE your panel from panel itself!
Please note that the wizard worker gets deployed only from [Wizard Github repository](https://github.com/bia-pain-bache/BPB-Wizard/tree/dev) directly for your safety.
Wizard gives you a PRIVATE LINK after first installation and this link is a ONE-CLICK wizard.
Also manual deployment and BPB Wizard client deployments do not work on this release.

## 💡 Improvements

- An admin dashboard is added to panel in order to monitor your request usage, UPDATE panel to the latest version, permanently DELETE panel, reset password and set Telegram Bot.
- UPDATE panel checks latest releases in background and gets enabled whenever there's a new stable release.
- Telegram Bot is now implemented, you can get subscriptions, single configs and monitor your account request usage. It also warns about usage by passing 80% threshold, PR #1313
- Now you can add Custom Domain to your panel from `Common` settings, dashboard setup is no longer needed. Also Custom Domain configs will be merged into your subscriptions with `D` tag so you don't need to login panel with domain and get another subscription.
- All fixed variables like `VLESS UUID`, `Trojan Password`, `Subscription - Panel path`, `DoH URL`, `Proxy IPs`, `Nat64 Prefixes`, `Fallback` domain... can now be updated from panel. There's no Environment Variables in your Cloudflare dashboard anymore.

> [!TIP]
> BPB is not using Cloudflare D1 for this fixed variables due to D1 delay overhead and another infrastrucure inconsistencies. All of them are hardcoded into script.

- Panel login now requires your `Cloudflare Email` as username. This will address security concerns like #1348
- All Panel, Subscriptions and related URLs are ceiled by a compulsory `SECURE PATH` to maintain more security.

> [!CAUTION]
> You cannot reach your panel by just adding /panel to your worker domain anymore. The new entry is like https://xxxx.workers.dev/SECURE_PATH/panel, which the path is a random generated secure path by wizard. You can change it in panel later if you wish, panel will redirect you to new URL.
> So please don't forget to save your panel URL after online wizard finished the job.

- Underlying DoH is added to common settings which is used as your panel `DNS over HTTPS` underlying server.
- Fallback behaviour is now throwing 404 by default. You can set `Fallback Domain` in Common settings section.
- single Proxy IP test is added to related page.
- Updating panel settings from a Remote BPB Panel and sharing settings is added in addition to existing File import and export. You can share or get all of settings except `VLESS UUID`, `Trojan Pass`, `Panel Path` and `Custom Domain` with some another BPB user.
- Updated Clash, Amnezia Warp Pro settings. This may help connection on some ISPs.
- Made Warp Reserved bytes optional. Some ISPs flagged reserved bytes.
- The Panel UI has been improved a lot and removed dark/light mode.
- Solid Data validations execute in backend from now on.
- Implemented Toasts and message boxes instead of alerts in panel.
- The whole project is restructured for maintainability purposes.
- Updated default Warp accounts.
- Fixed Typos in doc #1349
- Fixed HTML embedings in script #1344
- And lots of another subtle bug fixes and improvements...

## 💡 Changes since 5.0.0

- API Token has been changed and v5.0.0 Private Links and old tokens won't work on this.
- Added Import - Export section to panel with ability to update settings from another BPB panels #1329
- Updated Amnezia H1-H4 params #1353
- Made Warp Reserved bytes optional #1236
- Resetting Telegram webhook after changing panel path.
- Changed panel update check endpoint.
- Encapsulated worker domain and Custom Domain configs into separate URL tests #1359
- Fixed sing-box qrcode and subscriptions.
- Fixed Trojan password validation.
- Fixed Chain Proxy validation #1352
- Fixed missing sing-box Upstream Proxy #1354

First time contributors: @javadSharifi @gbcwror @doublepleat

![GitHub Downloads (specific asset, specific tag)](https://img.shields.io/github/downloads/bia-pain-bache/BPB-Worker-Panel/v5.1.0/worker.js)

> [!CAUTION]
> Please update whatever client you use, specially these ones:

|       Client        | Minimum version |  Fragment support  |  Warp Pro support  |
| :-----------------: | :-------------: | :----------------: | :----------------: |
|     **v2rayNG**     |      2.2.3      | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |       16        | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      |     7.22.5      | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     |     1.12.0      | :heavy_check_mark: |        :x:         |
|    **Streisand**    |     1.6.71      | :heavy_check_mark: | :heavy_check_mark: |

---

## 💡 Other tips

> [!CAUTION]
> You have to enable `Hev TUN feature` in v2rayNG in order to connect properly, Xray native Tun is useless right now.

> [!NOTE]
> These days Fragment on some ISPs stopped working in Iran, you can change `Fragment packet` to `1-1` instead of `tlshello` and test, also you can try to change `Fragment mode` to bypass Iran firewall.
