# :material-cog-outline:{ .md .middle } Fragment 设置

Fragment 方案通过向中间人攻击（MitM）隐藏 SNI，几乎解决了 Cloudflare CDN 的纯净 IP 问题，但设置应根据 ISP 情况获取。

![Fragment settings](../images/fragment-settings.jpg)

默认设置为：

- **长度（Length）**: 100-200
- **间隔（Interval）**: 1-1
- **数据包（Packets）**: tlshello

您可以根据您 ISP 的情况设置参数。

!!! info

    * 数据包（Packets）有多种模式。然而，`tlshello` 仅适用于 **TLS 配置**；像 80、8080 等端口不受影响。
    * `1-1` 模式适用于 **MahsaNG** 客户端的 **非 TLS** 端口。

!!! tip "给伊朗用户的提示"
    目前，在伊朗，fragment 在使用 **Xray Knocker 核心** 的客户端上性能明显更高效，特别是 **MahsaNG** 和 **v2rayN PRO** 客户端。该核心是为伊朗的条件开发和定制的。

!!! tip
    如果您找不到适合您 ISP 的最佳 fragment 设置，订阅中有一个 **最佳 fragment** 配置。只需连接它并稍等片刻；它会测试几乎所有有效的 fragment 设置，并自动连接到最佳的一个。

!!! note
    Fragment 的值有最大限制。长度（Length）不能超过 500，间隔（Interval）不能超过 30ms。