# :material-playlist-check:{ .md .middle } 普通订阅

![Normal subscription](../images/normal-sub.jpg)

强烈建议使用 **完整普通** 订阅而不是此订阅，因为它会自动应用所有面板设置，无需手动配置。请注意，路由规则、链式代理和 DNS 设置不适用于此订阅，必须在客户端中手动配置。

!!! warning
    您必须在客户端中将远程 DNS 设置为 DoH、DoT 或 TCP DNS 服务器，否则此订阅的配置将无法工作。示例：
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8
    ```
    ```title="TCP"
    tcp://8.8.8.8
    ```

此订阅通常导入六个 VLESS 和六个 Trojan 配置。您可以通过调整纯净 IP、端口和协议设置来增加配置数量。这六个配置有什么区别？

-   **Websocket 路径**：每个配置使用唯一的路径。
-   **地址**：在这六个配置中，第一个使用您的 Worker 域名，第二个使用 `www.speedtest.net`（在大多数 ISP 上都是纯净的），第三到第六个配置使用您域名的解析 IP（通常是纯净的，包括两个 IPv4 和两个 IPv6）。

请参阅[说明](../configuration/vless-trojan.md)以了解如何添加纯净 IP、端口、协议和自定义 CDN。

!!! warning
    要使用此订阅，请在您使用的任何客户端中禁用 Mux。

!!! warning
    使用此 Worker 会导致您的设备频繁更改 IP，因此不适合对 IP 敏感的活动，例如交易、PayPal 或像 Hetzner 这样的网站，因为存在被封禁的风险。为了解决 IP 更改问题，有两种解决方案可用：

    -   设置代理 IP
    -   使用链式代理

    有关详细信息，请参阅[说明](../configuration/vless-trojan.md)。