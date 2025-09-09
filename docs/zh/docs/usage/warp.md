# :material-playlist-check:{ .md .middle } Warp 订阅

![Warp subscriptions](../images/warp-sub.jpg)

此订阅包括：

-   一个 **Warp** 配置，节点 IP 来自您所在地区的 Cloudflare IP。
-   一个 **Warp on Warp (WoW)** 配置，节点 IP 来自国外的 Cloudflare IP（主要是德国）。
-   一个 **Warp 最佳 Ping** 配置，连接到最快的 Warp 配置。
-   一个 **WoW 最佳 Ping** 配置，连接到最快的 WoW 配置。

默认情况下，有一个 Warp 和一个 WoW 配置。在 `Warp 通用` 设置中编辑 `端点` 会根据指定的端点添加额外的 Warp 和 WoW 配置。

您可以将 Warp WireGuard 配置下载为 zip 文件以导入到 WireGuard 客户端。请注意，大多数 ISP 通常会封锁 Warp，因此仅当您的 ISP 允许 WireGuard 协议时才使用此功能。

为获得最佳性能，请使用扫描器识别适合您 ISP 的端点。扫描器脚本可在面板中获取；在 Android 或 Linux 终端的 Termux 中复制并运行它。普通 Warp 订阅可能在某些运营商（如 MTN-Irancell）上表现良好，但对于其他运营商，请使用 **Warp Pro** 订阅。