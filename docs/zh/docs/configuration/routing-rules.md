# :material-cog-outline:{ .md .middle } 路由规则

![Routing Rules](../images/routing-rules.jpg)

## 预定义规则

使用预定义的路由规则，您可以将这些设置应用于配置（**普通** 订阅除外）：

*   直接访问局域网。例如，到 127.0.0.1 或 192.168.1.1 的连接将直接处理。
*   无需代理直接连接到伊朗地址（访问某些网站，特别是支付网关时无需断开连接）。
*   直接访问中国网站。
*   直接访问俄罗斯网站。
*   拦截高达 90% 的伊朗和外国广告。
*   拦截色情内容网站。
*   拦截 QUIC 连接（由于网络不稳定）。

通常，此部分是禁用的，因为您必须首先确保客户端的 Geo 资源文件已更新。

!!! warning
    如果您启用路由规则后客户端无法连接，主要原因是 Geo 资源文件未更新。请在 v2rayNG 菜单中进入 Geo 资源文件设置，然后点击云或下载图标进行更新。如果更新过程不成功，您将无法连接。如果您已尝试所有方法仍无法更新，请从以下链接下载这两个文件，然后点击添加按钮导入这两个文件，而不是点击更新按钮：

```title="GeoIP"
https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
```

```title="GeoSite"
https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
```

## 自定义规则

在某些情况下，预定义规则可能无法满足需求。例如，如果您已拦截色情内容，但某个特定网站不在列表中且未被拦截，您将需要使用自定义规则。

!!! info
    您可以在此部分使用三种不同的格式：

    *   域名
    *   IP
    *   IP/cidr

    请注意，如果您输入 `google.com`，其所有子域名（如 `drive.google.com` 或 `mail.google.com`）也将被拦截或直接路由。

    示例：
    ```title="域名"
    google.com
    ```
    ```title="IPv4"
    192.168.1.1
    ```
    ```title="IPv6"
    [2606:4700::6810:85e5]
    ```
    ```title="IPv4 CIDR"
    192.168.1.1/32
    ```
    ```title="IPv6 CIDR"
    [2606:4700::6810:85e5]/128
    ```

## 制裁规则

如果您需要某些网站仅绕过制裁并直接连接（无代理），您可以使用此部分。
您可以设置您想要的 DNS 服务器（也应为透明代理），并选择预设规则或填写自定义地址。您甚至可以使用像 `WorkerLess` 这样不使用任何代理的配置来访问受制裁的网站。默认 DNS 服务器是 [Electro](https://electrotm.org/)（针对伊朗用户）。

!!! info
    DNS 服务器可以是 IP（UDP DNS）的形式，也可以是像 `https://free.shecan.ir/dns-query` 这样的 DoH。

!!! info
    请注意，如果您在自定义规则中输入 `google.com`，其所有子域名（如 `drive.google.com` 或 `mail.google.com`）也将被直接路由。

!!! note
    当这些规则被激活时，您应确保 DNS 支持该域名，例如，如果您激活 `Microsoft` 规则而 DNS 不支持它，您将无法连接到 Microsoft 的域名。请检查 DNS 目录并确保您的目标规则或域名受支持。