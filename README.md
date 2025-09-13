<h1 align="center">BPB Panel 💦</h1>

### 🌏 Readme in [Farsi](README_fa.md)

<p align="center">
  <img src="docs/assets/images/panel-overview.jpg">
</p>
<br>

## Introduction

This project is aimed to provide a user panel to access FREE, SECURE and PRIVATE **VLESS**, **Trojan** and **Warp** configs, It ensures connectivity even when domains or Warp services are blocked by ISPs, offering two deployment options:

- **Workers** deployment
- **Pages** deployment

🌟 If you found **BPB Panel** valuable, Your donations make all the difference 🌟

### USDT (BEP20)

```text
0xbdf15d41C56f861f25b2b11C835bd45dfD5b792F
```

## Features

1. **Free and Private**: No costs involved and the server is private.
2. **Intuitive Panel:** Streamlined for effortless navigation, configuration and use.
3. **Versatile Protocols:** Provides VLESS, Trojan and Wireguard (Warp) protocols.
4. **Warp Pro configs:** Optimized Warp for crucial circumstances.
5. **Fragment support:** Supports Fragment functionality for crucial network situations.
6. **Comprehensive Routing Rules:** Bypassing Iran/China/Russia and LAN, Blocking QUIC, Porn, Ads, Malwares, Phishing and also bypassing sanctions.
7. **Chain Proxy:** Capable of adding a chain proxy to fix IP.
8. **Broad client compatibility:** Offers subscription links for Xray, Sing-box and Clash-Mihomo core clients.
9. **Password-protected panel:** Provides secure and private panel with password protection.
10. **Fully customizable:** Supports setting up clean IP-domains, Proxy IPs, DNS servers, choosing ports and protocols, Warp endpoints and more.

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers do not handle **UDP** properly, so it is disabled by default (affecting features like Telegram video calls), UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use custom personal domains to bypass limitation on VLESS/Trojan (Workers deployment) or opt for limitless Warp configurations.

## Getting started

- [Installation methods](https://bia-pain-bache.github.io/BPB-Worker-Panel/installation/wizard/)
- [Configuration](https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/)
- [How to use](https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/)
- [FAQ](https://bia-pain-bache.github.io/BPB-Worker-Panel/faq/)

## Supported Clients

|       Client        |     Version      |      Fragment      |      Warp Pro      |
| :-----------------: | :--------------: | :----------------: | :----------------: |
|     **v2rayNG**     | 1.10.2 or higher | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |   13 or higher   | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      | 7.12.5 or higher | :heavy_check_mark: | :heavy_check_mark: |
|   **v2rayN-PRO**    |  1.9 or higher   | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     | 1.12.0 or higher | :heavy_check_mark: |        :x:         |
|    **Streisand**    | 1.6.48 or higher | :heavy_check_mark: | :heavy_check_mark: |
|      **Happ**       |                  | :heavy_check_mark: | :heavy_check_mark: |
|   **Clash Meta**    |                  |        :x:         |        :x:         |
| **Clash Verge Rev** |                  |        :x:         |        :x:         |
|     **FLClash**     |                  |        :x:         |        :x:         |
|   **AmneziaVPN**    |                  |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                  |        :x:         | :heavy_check_mark: |

## Environment variables

|   Variable   |               Usage                |
| :----------: | :--------------------------------: |
|   **UUID**   |             VLESS UUID             |
| **TR_PASS**  |          Trojan Password           |
| **PROXY_IP** | Proxy IP or domain (VLESS, Trojan) |
|  **PREFIX**  |   NAT64 Prefixes (VLESS, Trojan)   |
| **SUB_PATH** |         Subscriptions' URI         |
| **FALLBACK** |  Fallback domain (VLESS, Trojan)   |
| **DOH_URL**  |              Core DOH              |

---

## Stargazers Over Time

[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)

---

### Special Thanks

- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
