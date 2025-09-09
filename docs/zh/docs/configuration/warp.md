# :material-cog-outline:{ .md .middle } Warp 通用设置

这些设置适用于 **Warp** 和 **Warp Pro** 订阅。

![Warp General settings](../images/warp-settings.jpg)

## 端点 - 扫描器

Warp 的端点功能类似于 VLESS 和 Trojan 的纯净 IP。面板提供了一个扫描器，您可以在 Termux (Android)、Windows、macOS 或 Linux 上运行，并将结果输入此处。请注意，结果并非 100% 可靠，因此需要进行测试。请注意，在测试前必须退出任何代理应用，如果您使用 v2rayN，应从任务栏完全退出，仅清除代理是不够的。

!!! info
    - 端点格式为 IP:端口 或 域名:端口，每行必须输入一个。
    - 对于 IPv6 地址，请将其括在方括号中。请参见下面的示例：

    端点示例：
    ```title="IPv4"
    123.45.8.6:1701
    ```
    ```title="IPv6"
    [2a06:98c1:3120::3]:939
    ```
    ```title="域名"
    engage.cloudflareclient:2408
    ```

## 伪 DNS (Fake DNS)

您可以为 Warp 配置启用伪 DNS 以减少 DNS 延迟。但是，请谨慎使用，因为它可能与某些应用程序不兼容或干扰系统 DNS。如果您不确定其功能，请避免启用它。

## 启用 IPv6

如果您的 ISP 不支持 IPv6，请禁用它以优化 DNS 和代理性能。

## 最佳间隔

**Warp** 和 **Warp Pro** 订阅包括 **最佳 Ping** 配置。默认情况下，这些配置每 30 秒测试一次，以确定最佳连接配置或端点。在较慢的网络上，此间隔可能会在视频流或游戏等活动期间导致延迟。您可以将间隔调整在 10 到 90 秒之间。

## Warp 账户

更新账户会从 **Cloudflare** 获取新的 Warp 账户。此过程不影响连接速度或其他设置。