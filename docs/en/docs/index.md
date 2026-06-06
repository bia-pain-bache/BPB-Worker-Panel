# BPB Panel

![Pages Application](images/panel-overview.jpg)

## Introduction

This project is aimed to provide a user panel to access FREE, SECURE and PRIVATE **VLESS**, **Trojan** and **Warp** configs, It ensures connectivity even when domains or Warp services are blocked by ISPs, offering two deployment options:

- **Workers** deployment
- **Pages** deployment

🌟 If you found **BPB Panel** valuable, Your donations make all the difference 🌟

```title="USDT (BEP20)"
0xbdf15d41C56f861f25b2b11C835bd45dfD5b792F
```

## Features

1. **Free and Private**: No costs involved and the server is private.
2. **Intuitive Panel:** Streamlined for effortless navigation, configuration and use.
3. **Versatile Protocols:** Provides VLESS, Trojan and Wireguard (Warp) protocols.
4. **Private DoH:** A ready to use DoH server, capable of customizing underlying DNS server.
5. **Warp Pro configs:** Optimized Warp for crucial circumstances.
6. **Fragment support:** Supports Fragment functionality for crucial network situations.
7. **Comprehensive Routing Rules:** Bypassing Iran/China/Russia, Blocking QUIC, Porn, Ads, Malwares, Phishing and also bypassing sanctions.
8. **Chain Proxy:** Capable of adding a chain proxy (VLESS, Trojan, Shadowsocks, socks and http) to fix IP.
9. **Broad client compatibility:** Offers subscription links for Xray, Sing-box and Clash-Mihomo core clients.
10. **Password-protected panel:** Provides secure and private panel with password protection.
11. **Fully customizable:** Supports setting up clean IP-domains, Proxy IPs, DNS servers, choosing ports and protocols, Warp endpoints and more.

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers do not handle **UDP** properly, so it is disabled by default (affecting features like Telegram video calls), UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use limitless Warp configs.

## Getting started

- [Installation methods](installation/wizard.md)
- [Configuration](configuration/index.md)
- [How to use](usage/index.md)
- [FAQ](faq.md)

## Supported Clients

|       Client        | Minimum version |  Fragment support  |  Warp Pro support  |
| :-----------------: | :-------------: | :----------------: | :----------------: |
|     **v2rayNG**     |      2.2.3      | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |       16        | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      |     7.22.5      | :heavy_check_mark: | :heavy_check_mark: |
|   **v2rayN-PRO**    |       1.9       | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     |     1.12.0      | :heavy_check_mark: |        :x:         |
|    **Streisand**    |     1.6.71      | :heavy_check_mark: | :heavy_check_mark: |
|   **Clash Meta**    |                 |        :x:         | :heavy_check_mark: |
| **Clash Verge Rev** |                 |        :x:         | :heavy_check_mark: |
|     **FLClash**     |                 |        :x:         | :heavy_check_mark: |
|   **AmneziaVPN**    |                 |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                 |        :x:         | :heavy_check_mark: |

## Environment variables

|   Variable   |               Usage                |     Mandatory      |
| :----------: | :--------------------------------: | :----------------: |
|   **UUID**   |             VLESS UUID             | :heavy_check_mark: |
| **TR_PASS**  |          Trojan Password           | :heavy_check_mark: |
| **PROXY_IP** | Proxy IP or domain (VLESS, Trojan) |        :x:         |
|  **PREFIX**  |   NAT64 Prefixes (VLESS, Trojan)   |        :x:         |
| **SUB_PATH** |         Subscriptions' URI         |        :x:         |
| **FALLBACK** |  Fallback domain (VLESS, Trojan)   |        :x:         |
| **DOH_URL**  |              Core DOH              |        :x:         |

---

## Stargazers Over Time

[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)
