# :material-cog-outline:{ .md .middle } VLESS 和 Trojan 设置

这些设置仅适用于 **Fragment** 和 **Full Normal** 订阅。

![VLESS and Trojan settings](../images/vless-trojan-settings.jpg)

## 远程 DNS

默认情况下，远程 DNS 是 Google DNS over HTTPS (DoH)。

```title="默认远程 DNS"
https://8.8.8.8/dns-query
```

!!! warning
    避免使用 `https://1.1.1.1/dns-query`、`https://cloudflare-dns.com/dns-query` 或任何与 Cloudflare 相关的 DNS 作为远程 DNS，因为它们会显著增加 ping 值并使与 workers 的连接不稳定。

!!! tip
    从 2.5.5 版本开始，您可以使用一些知名的 DoH 或 DoT 服务器：
    ```
    https://dns.google/dns-query
    ```
    ```
    https://dns.adguard-dns.com/dns-query
    ```
    ```
    https://dns.quad9.net/dns-query
    ```
    ```
    tls://dns.google
    ```

## 本地 DNS

默认情况下，本地 DNS 服务器是 Google DNS。

```title="默认本地 DNS"
8.8.8.8
```

许多 DNS 服务器可以以 IP 的形式用作本地 DNS，但是您可以使用 **localhost**，它会使用您 ISP 的 DNS 服务器，这对于路由目的来说是没问题的。

## 伪 DNS (Fake DNS)

您可以启用伪 DNS 来减少 DNS 查询延迟，但请谨慎使用——它可能与某些应用程序不兼容或干扰系统 DNS。如果您不确定其功能，请避免启用它。

## 链式代理

如前所述，代理 IP 为 Cloudflare 目标地址固定了 IP，但对于其他目标，节点 IP 可能不同。**链式代理** 确保所有目标都有一个一致的 IP。您可以在此处使用一个免费的 VLESS、Socks 或 HTTP 配置，即使它被您的 ISP 封锁，也可以将您的 IP 永久固定为链式代理的 IP。

!!! note
    链式代理配置本身不能是 worker，否则最终 IP 仍会改变。

!!! tip
    可以从 [racevpn.com](https://racevpn.com) 等来源获取免费配置。他们的免费套餐配置三天后到期，但稳定且有区域性。

!!! note
    支持的 VLESS 配置类型包括：

    - WS
    - Reality WS
    - WS TLS
    - GRPC
    - Reality GRPC
    - GRPC TLS
    - TCP
    - Reality TCP
    - TCP Header
    - Reality TCP Header
    - TCP TLS

!!! note
    Socks 配置可以是以下格式：

    - socks://`地址`:`端口`
    - socks://`用户`:`密码`@`地址`:`端口`

!!! note
    HTTP 配置可以是以下格式：

    - http://`地址`:`端口`
    - http://`用户`:`密码`@`地址`:`端口`

此设置适用于除 **Normal** 和 **Warp** 之外的所有订阅。应用后，请更新订阅。

然而，**Normal** 订阅会单独导入链式代理。在像 Nekobox 或 Husi 这样的客户端中，编辑组部分中的订阅，并将链式代理设置为 **落地代理** 以进行链接。从 1.9.1 版本开始，v2rayNG 支持此功能：复制配置名称，在订阅组设置中编辑订阅，并将其粘贴到 `下一个代理备注` 字段中。

!!! warning
    - 用于链接的 VLESS TLS 配置必须使用 443 端口。
    - 由于缺乏指纹支持，具有随机 ALPN 值的 VLESS 配置与 Clash 不兼容。
    - 由于一个 bug，VLESS WS 配置不适合在 Sing-box 上进行链接。

## 纯净 IP/域名

对于非 **Fragment** 订阅，您可能希望使用纯净 IP。面板包含一个扫描器，可以作为您操作系统的 zip 文件下载。运行 CloudflareScanner，结果将保存在 `result.csv` 中，让您可以根据延迟和下载速度选择 IP。建议在 Windows 上进行此过程，并确保在测试期间断开 VPN。有关高级扫描，请参阅[本指南](https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/blob/master/README.md)。

!!! tip "给伊朗用户的提示"
    在支持 IPv6 的 ISP（例如 Rightel、Irancell、Asiatech）上，请在您的 SIM 卡上启用 IPv6，在客户端设置中激活 **首选 IPv6** 选项，并使用最后两个或第一个默认配置。IPv6 IP 通常性能更好。

!!! tip
    使用 **Fragment** 时，纯净 IP 不起重要作用，但某些 ISP（如 Rightel）可能仍需要它们。

要将自定义配置与默认配置一起添加，请如该部分图片所示输入纯净 IP 或域名，然后单击 **应用**。更新后的订阅将导入这些新配置，这些配置也会被添加到 **最佳 Ping** 和 **最佳 Fragment** 配置中。

## 启用 IPv6

面板默认提供 IPv6 配置。如果您的 ISP 不支持 IPv6，请禁用它以减少配置数量并优化 DNS 和路由设置。

## 协议选择

启用 **VLESS** 和/或 **Trojan** 协议。

## 端口选择

选择所需的端口。TLS 端口提供更安全的配置，但在 TLS 中断或 **Fragment** 性能不佳时，非 TLS 配置可以作为可行的替代方案。

!!! note
    非 TLS 配置要求面板使用 Workers 方法部署。如果使用 Pages 方法或设置自定义域，HTTP 端口将不会出现在面板中。

!!! info
    非 TLS 配置仅添加到 **Normal** 和 **Full Normal** 订阅中。

## 指纹

您可以在此处选择 TLS 指纹，默认为随机。

## 最佳间隔

默认情况下，**最佳** 配置每 30 秒测试一次，以确定最佳配置或 Fragment 值。对于在视频流或游戏等活动期间的低速网络，这可能会导致延迟。根据需要将间隔调整在 10 到 90 秒之间。

## 代理 IP

### 模式

从 3.4.2 版本开始，您可以选择使用代理 IP 或 NAT64 前缀连接到 Cloudflare CDN 地址。

### 代理 IP/域名

您可以通过面板更改代理 IP，方法是应用更改并更新订阅。但是，建议通过 Cloudflare 仪表板或使用向导设置代理 IP，因为：

!!! note
    通过面板更改代理 IP 需要在 IP 停止工作时更新订阅。这可能会中断捐赠的配置，因为没有活动订阅的用户无法更新它们。此方法仅供个人使用。其他方法不需要更新订阅。

从以下链接中选择一个代理 IP，该链接按地区和 ISP 列出了 IP：

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

!!! info
    要使用多个代理 IP，请将它们一个接一个地填写。

### NAT64 前缀

您可以通过面板更改代理 IP 模式并填写 NAT64 前缀，方法是应用更改并更新订阅。但是，建议通过 Cloudflare 仪表板或使用向导设置 NAT64 前缀，因为：

!!! note
    通过面板更改 NAT64 前缀需要在 IP 停止工作时更新订阅。这可能会中断捐赠的配置，因为没有活动订阅的用户无法更新它们。此方法仅供个人使用。其他方法不需要更新订阅。

从以下链接中选择一个 NAT64 前缀，该链接按地区和 ISP 列出了 IP：

```text
https://github.com/Starry-Sky-World/BPB-i18n/blob/main/NAT64Prefixes.md
```

!!! info
    要使用多个前缀，请将它们一个接一个地填写。

## 自定义 CDN

使用自定义 CDN（例如 Fastly、Gcore）来掩盖您的 Worker 域名。配置以下三个部分：

### 地址

这些是特定于 CDN 的 IP 或纯净 IP。您必须使用 CDN 自己的 IP，而不是 Cloudflare 的。如图所示输入域名、IPv4 或 IPv6 地址，IPv6 地址用括号括起来，例如 `[2a04:4e42:200::731]`。

### 主机

在 CDN 中定义并指向您的 Worker 的主机，例如 Fastly 中的一个假域名。

### SNI

一个假域名或同一 CDN 上的站点，例如 Fastly 的 `speedtest.net`（不带 `www`）。

配置这些字段后，相关配置将添加到 **Normal** 和 **Full Normal** 订阅中，并标记 `C` 标志以区分它们。

!!! info
    这些配置仅支持 443 和 80 端口。

!!! warning
    对于 **Normal** 订阅，请在配置设置中手动启用 **允许不安全**。**Full Normal** 订阅会自动应用此设置。