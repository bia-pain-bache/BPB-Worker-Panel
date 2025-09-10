# 💦 BPB 控制面板

> 我们很高兴的宣布，BPB面板的i18n工作已完成，您可以在中文与英文之间切换，目前只支持中文和英文

![Pages Application](images/panel-overview.jpg)

## 简介

该项目旨在提供一个用户面板，用于访问免费、安全和私密的 **VLESS**、**Trojan** 和 **Warp** 配置。它确保即使在域名或 Warp 服务被 ISP 封锁的情况下也能保持连接，并提供两种部署选项：

- **Workers** 部署
- **Pages** 部署


## 功能

1. **免费和私密**: 无需任何费用，服务器是私有的。
2. **直观的面板**: 精心设计，便于导航、配置和使用。
3. **多种协议**: 提供 VLESS、Trojan 和 Wireguard (Warp) 协议。
4. **Warp Pro 配置**: 在关键情况下优化的 Warp。
5. **支持 Fragment**: 在关键网络情况下支持 Fragment 功能。
6. **全面的路由规则**: 绕过伊朗/中国/俄罗斯和局域网，阻止 QUIC、色情、广告、恶意软件、网络钓鱼，并绕过制裁。
7. **链式代理**: 能够添加链式代理以固定 IP。
8. **广泛的客户端兼容性**: 为 Xray、Sing-box 和 Clash-Mihomo 核心客户端提供订阅链接。
9. **密码保护面板**: 提供带密码保护的安全私密面板。
10. **完全可定制**: 支持设置清洁 IP 域名、代理 IP、DNS 服务器，选择端口和协议，Warp 端点等。

## 限制

1. **UDP 传输**: Workers 上的 VLESS 和 Trojan 协议无法正常处理 **UDP**，因此默认禁用（影响 Telegram 视频通话等功能），也不支持 UDP DNS。默认启用 DoH 以增强安全性。
2. **请求限制**: 每个 worker 每天支持 10 万次 VLESS 和 Trojan 请求，适用于 2-3 个用户。您可以使用自定义个人域名绕过 VLESS/Trojan（Workers 部署）的限制，或选择无限制的 Warp 配置。

## 开始使用

- [安装方法](installation/wizard.md)
- [配置](configuration/index.md)
- [如何使用](usage/index.md)
- [常见问题](faq.md)

## 支持的客户端

| 客户端 | 版本要求 | Fragment 支持 | Warp Pro 支持 |
| :---: | :---: | :---: | :---: |
| **v2rayNG** | 1.10.2 或更高 | :material-check: | :material-check: |
| **v2rayN** | 7.12.5 或更高 | :material-check: | :material-check: |
| **v2rayN-PRO** | 1.9 或更高 | :material-check: | :material-check: |
| **Husi** | | :material-close: | :material-close: |
| **Sing-box** | 1.12.0 或更高 | :material-check: | :material-close: |
| **Streisand** | 1.6.48 或更高 | :material-check: | :material-check: |
| **V2Box** | | :material-close: | :material-close: |
| **Shadowrocket** | | :material-close: | :material-close: |
| **Nekoray** | | :material-check: | :material-close: |
| **Hiddify** | 2.5.7 或更高 | :material-check: | :material-check: |
| **MahsaNG** | | :material-check: | :material-check: |
| **Clash Meta** | | :material-close: | :material-close: |
| **Clash Verge Rev**| | :material-close: | :material-close: |
| **FLClash** | | :material-close: | :material-close: |
| **AmneziaVPN** | | :material-close: | :material-check: |
| **WG Tunnel** | | :material-close: | :material-check: |

---

## Star 数量变化趋势

[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)