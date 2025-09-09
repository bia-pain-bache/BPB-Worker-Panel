# :material-playlist-check:{ .md .middle } Fragment 订阅

![Fragment subscription](../images/fragment-sub.jpg)

!!! tip "**Fragment 配置的好处**"
    - 即使自定义域名或 Worker 域名被 ISP 封锁，也能保持连接。
    - 在所有 ISP 上都能提高稳定性和速度，尤其是在那些与 Cloudflare 连接不稳定的 ISP 上。

## Xray 的 Fragment

这适用于使用 Xray 核心的客户端，例如 v2rayNG、MansaNG 和 v2rayN PRO。导入的配置在其名称中会标记有 `F` 标志。此订阅提供的配置数量与 **Full Normal** 订阅相同，并通过可在面板中调整的 fragment 设置进行了增强，此外还包括 **最佳 Fragment** 和 **Workerless** 配置。任何面板设置的更改在订阅更新后都会应用于所有配置。

???+ question "什么是 Workerless 配置？"
    Workerless 配置无需使用 Worker 即可解锁许多受限网站和应用程序（例如 YouTube、Twitter、Google Play...）。请注意，此配置不会更改您的本地 IP，因此请避免将其用于需要安全或匿名的活动。Fragment 设置的更改适用于此配置，但链式代理除外。

???+ question "什么是最佳 Fragment 配置？"
    最佳 Fragment 配置会测试 18 种不同的 fragment 设置，根据您 ISP 的性能选择最快的一种。这些模式旨在覆盖所有主要场景，配置每 30 秒测试一次所有模式并连接到最佳模式。高级 fragment 设置详见[此处](../configuration/fragment.md)。

## sing-box 的 Fragment

从 1.12.0 版本开始，sing-box 核心及相关客户端支持 fragment，您可以通过官方的 sing-box 客户端（如 husi）或内嵌 sing-box 核心的 v2rayN 使用此订阅。

## Hiddify 的 Fragment

许多面板设置不适用于此订阅，因为 Hiddify 会覆盖大多数设置。以下内容必须在 Hiddify 中手动配置：

1. 远程 DNS
2. 本地 DNS
3. 路由

!!! warning
    只有当您在 Hiddify 中禁用 fragment 模式时，面板中的 Fragment 设置才会生效。

!!! danger
    确保 Hiddify 中的远程 DNS 设置为 DoH、DoT 或 TCP DNS 服务器。示例：
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8
    ```
    ```title="TCP"
    tcp://8.8.8.8
    ```

或者，您可以将 **Normal** 订阅导入 Hiddify 并手动启用 fragment，如下所示：

![Fragment subscription for Hiddify](../images/hiddify-fragment.jpg)