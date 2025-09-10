<h1 align="center">BPB 面板 💦</h1>

## 🌏 阅读其他语言版本 [波斯语](README_fa.md) | [English](README.md)</h3>
## 🌍 View Document in [CN](https://bpb.amethyst.ltd) or [Edgeone](https://org-bpb.amethyst.ltd)</h3>

<p align="center">
  <img src="docs/assets/images/panel-overview.jpg">
  <img width="2560" height="1506" alt="zh-cn" src="https://github.com/user-attachments/assets/ea9a9e70-517f-4602-9ea4-3621348f98ab" />
</p>
<br>

## 简介

该项目旨在提供一个用户面板，以访问免费、安全和私密的 **VLESS**、**Trojan** 和 **Warp** 配置。即使在域名或 Warp 服务被 ISP 封锁的情况下，它也能确保连接性，并提供两种部署选项：

- **Workers** 部署
- **Pages** 部署

## 功能

1.  **免费和私密**：不涉及任何费用，服务器是私有的。
2.  **直观的面板**：流线型设计，便于轻松导航、配置和使用。
3.  **多种协议**：提供 VLESS、Trojan 和 Wireguard (Warp) 协议。
4.  **Warp Pro 配置**：在关键情况下优化的 Warp。
5.  **分片支持**：在关键网络情况下支持分片功能。
6.  **全面的路由规则**：绕过伊朗/中国/俄罗斯和局域网，拦截 QUIC、色情、广告、恶意软件、网络钓鱼，并绕过制裁。
7.  **链式代理**：能够添加链式代理以固定 IP。
8.  **广泛的客户端兼容性**：为 Xray、Sing-box 和 Clash-Mihomo 核心客户端提供订阅链接。
9.  **密码保护面板**：通过密码保护提供安全和私密的面板。
10. **完全可定制**：支持设置纯净 IP 域名、代理 IP、DNS 服务器、选择端口和协议、Warp 端点等。

## 限制

1.  **UDP 传输**：Workers 上的 VLESS 和 Trojan 协议无法正常处理 **UDP**，因此默认禁用（影响 Telegram 视频通话等功能），也不支持 UDP DNS。默认启用 DoH 以增强安全性。
2.  **请求限制**：每个 worker 每天支持 10 万次 VLESS 和 Trojan 请求，适合 2-3 个用户。您可以使用自定义个人域名绕过 VLESS/Trojan（Workers 部署）的限制，或选择无限量的 Warp 配置。

## 入门指南

- [安装方法](https://bia-pain-bache.github.io/BPB-Worker-Panel/installation/wizard/)
- [配置](https://bia-pain-bache.github.io/BPB-Worker-Panel/configuration/)
- [如何使用](https://bia-pain-bache.github.io/BPB-Worker-Panel/usage/)
- [常见问题解答](https://bia-pain-bache.github.io/BPB-Worker-Panel/faq/)

## 支持的客户端

|       客户端        |     版本      |      分片      |      Warp Pro      |
| :-----------------: | :--------------: | :----------------: | :----------------: |
|     **v2rayNG**     | 1.10.2 或更高 | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      | 7.12.5 或更高 | :heavy_check_mark: | :heavy_check_mark: |
|   **v2rayN-PRO**    |  1.9 或更高   | :heavy_check_mark: | :heavy_check_mark: |
|      **Husi**       |                  | :heavy_check_mark: |        :x:         |
|    **Sing-box**     | 1.12.0 或更高 | :heavy_check_mark: |        :x:         |
|    **Streisand**    | 1.6.48 或更高 | :heavy_check_mark: | :heavy_check_mark: |
|      **V2Box**      |                  |        :x:         |        :x:         |
|  **Shadowrocket**   |                  |        :x:         |        :x:         |
|     **Nekoray**     |                  | :heavy_check_mark: |        :x:         |
|     **Hiddify**     | 2.5.7 或更高  | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |   13 或更高   | :heavy_check_mark: | :heavy_check_mark: |
|   **Clash Meta**    |                  |        :x:         |        :x:         |
| **Clash Verge Rev** |                  |        :x:         |        :x:         |
|     **FLClash**     |                  |        :x:         |        :x:         |
|   **AmneziaVPN**    |                  |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                  |        :x:         | :heavy_check_mark: |

## 环境变量

|   变量   |               用途                |
| :----------: | :--------------------------------: |
|   **UUID**   |             VLESS UUID             |
| **TR_PASS**  |          Trojan 密码           |
| **PROXY_IP** | 代理 IP 或域名 (VLESS, Trojan) |
|  **PREFIX**  |   NAT64 前缀 (VLESS, Trojan)   |
| **SUB_PATH** |         订阅 URI         |
| **FALLBACK** |  回退域名 (VLESS, Trojan)   |
| **DOH_URL**  |              核心 DOH              |

---

## Star 数量变化趋势

[![Stargazers Over Time](https://starchart.cc/Starry-Sky-World/BPB-i18n.svg?variant=adaptive)](https://starchart.cc/Starry-Sky-World/BPB-i18n)

---

### 特别鸣谢

- VLESS, Trojan [Cloudflare-workers/pages 代理脚本](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) 由 [yonggekkk](https://github.com/yonggekkk) 创建
- CF-vless 代码作者 [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF 首选 IP 程序作者 [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
- BPB-Panel-Worker 代码作者 [bia-pain-bache](https://github.com/bia-pain-bache/BPB-Worker-Panel)，本仓库基于他的工作。
