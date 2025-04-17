<h1 align="center">BPB Panel 💦</h1>

### 🌏 Readme in [Farsi](README_fa.md)

<p align="center">
  <img src="docs/assets/images/Panel.jpg">
</p>
<br>

## Introduction
This project is aimed to provide a user panel to access FREE and SECURE `VLESS`, `Trojan` and `Warp` configs and stay conntected even with a blocked domain or blocked Warp on ISPs, offering two deployment options: 
- **Workers** deployment
- **Pages** deployment
<br>

🌟 If you found **BPB Panel** valuable, Your donations make all the difference 🌟
- **USDT (BEP20):** `0x111EFF917E7cf4b0BfC99Edffd8F1AbC2b23d158`

## Features

1. **Free**: No cost involved.
2. **User-Friendly Panel:** Designed for easy navigation, configuration and usage.
3. **Protocols:** Provides VLESS, Trojan and Wireguard (Warp) protocols.
4. **Warp Pro configs:** Optimized Warp for crucial circumstances.
5. **Support Fragment:** Supports Fragment functionality for crucial network situations.
6. **Full routing rules:** Bypassing Iran/China/Russia and LAN, Blocking QUIC, Porn, Ads, Malwares, Phishing...
7. **Chain Proxy:** Capable of adding a chain proxy to fix IP.
8. **Supports Wide Range of Clients:** Offers subscription links for Xray, Sing-box and Clash core clients.
9. **Password-Protected Panel:** Secure your panel with password protection.
10. **Fully customizable:** Ability to use online scanner and setting up clean IP-domains, Proxy IP, setting DNS servers, choosing ports and protocols, Warp endpoints...
<br>

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers cannot handle UDP properly, so UDP is blocked by default (some connections like Telegram video calls etc. will not work), also UDP DNS do not work on these protocols (so DOH is supported and set by default which is also safer).
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, so it's sufficient for only 2-3 users. You can use custom personal domains for bypassing limitation on VLESS/Trojan or Warp configs which are limitless.

## How to use:
- [Installation (Pages - New recommended method)](docs/pages_upload_installation_fa.md)

- [Installation (Worker)](docs/worker_installation_fa.md)

- [How to use](docs/configuration_fa.md)

- [FAQ](docs/faq.md)
<br>

## Supported Clients
| Client  | Version | Fragment | Warp Pro |
| :-------------: | :-------------: | :-------------: | :-------------: |
| **v2rayNG**  | 1.9.33 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN**  | 7.8.3 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN-PRO**  | 1.8 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **Husi**  |   | :x: | :x: |
| **Sing-box**  | 1.11.2 or higher  | :x: | :x: |
| **Streisand**  | 1.6.48 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **V2Box**  |   | :x: | :x: |
| **Shadowrocket**  |   | :x: | :x: |
| **Nekoray**  |   | :heavy_check_mark: | :x: |
| **Hiddify**  | 2.5.7 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **NikaNG**  |   | :heavy_check_mark: | :heavy_check_mark: |
| **Clash Meta**  |   | :x: | :x: |
| **Clash Verge Rev**  |   | :x: | :x: |
| **FLClash**  |   | :x: | :x: |

## Environment variables
| Variable  | Usage |
| :-------------: | :-------------: |
| **UUID**  | VLESS UUID  |
| **TR_PASS**  | Trojan Password  |
| **PROXY_IP**  | Proxy IP or domain (VLESS, Trojan)  |
| **SUB_PATH**  | Subscriptions' URI  |
| **FALLBACK**  | Fallback domain (VLESS, Trojan) |
| **DOH_URL**  | Core DOH |

---

## Stargazers Over Time
[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)

---

### Special Thanks
- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)