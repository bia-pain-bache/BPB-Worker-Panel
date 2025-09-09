# :material-cloud-question-outline:{ .lg .middle } 常见问题解答

??? question "为什么 Fragment 配置无法连接？"
    如果您启用了 `路由规则` 并且 VPN 无法连接，唯一的原因是 Geo 资源文件未更新。在 v2rayN(G) 客户端菜单中，进入 `资源文件` 部分，然后点击云或下载图标进行更新。如果更新失败，则无法连接。如果您尝试了所有方法仍然无法更新，请从下面的链接下载这两个文件，然后点击添加按钮导入这两个文件，而不是更新：
    ```title="GeoIP"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
    ```
    ```title="GeoSite"
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
    ```

??? question "为什么普通订阅配置无法连接？"
    要使用这些配置，请在您使用的任何应用的设置中禁用 `Mux`。同时将远程 DNS 设置为 DOH：
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8
    ```
    ```title="TCP"
    tcp://8.8.8.8
    ```

??? question "为什么像 Nekobox、husi 或 Hiddify Next 这样的客户端打不开任何网站？"
    在应用设置中，像这样设置 `远程 DNS`：
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8
    ```
    ```title="TCP"
    tcp://8.8.8.8
    ```

??? question "为什么我的 ISP 上 Fragment 配置速度很慢？"
    每个运营商都有其偏好的 Fragment 设置。大多数情况下，面板的默认值都可以正常工作，但这些值可能在您的运营商上效果更好；您需要进行测试：
    ```title="Length"
    10-100
    ```
    ```title="Interval"
    10-20
    ```

??? question "为什么我的 Ping 测试值这么高？"
    切勿使用 `https://1.1.1.1/dns-query` 或任何与 Cloudflare 相关的 DNS 作为远程 DNS，因为它会增加 ping 值。

??? question "我已经按照教程提取并使用了一个代理 IP，为什么像 X 这样的网站或应用仍然无法工作！"
    有很多公共 IP，其中一些可能不稳定。您需要测试以找到一个好的。

??? question "设置代理 IP 后可以工作，但现在不行了！"
    如果您使用单个 IP，它可能会在一段时间后停止工作，并且许多网站将无法打开。您需要重新执行这些步骤。最好，如果您不进行任何需要静态 IP 的操作，只需使用面板默认值，不要使用单个代理 IP。

??? question "为什么我访问 `panel/` 地址时会出错？"
    请遵循安装指南或使用 **向导**；KV、UUID 或 Trojan 密码未正确配置。

??? question "我部署了它，但 Cloudflare 返回错误 1101！"
    如果是 Worker，请使用 Pages 方法创建它。如果那也出错，您的 Cloudflare 帐户可能已被标记。请使用像 Gmail 这样的官方电子邮件创建一个新的 Cloudflare 帐户，并最好使用 Pages 方法。另外，请确保项目名称不包含“bpb”一词。
    建议使用 **向导**（pages 模式）或 [手动 pages](installation/pages-manual.md) 安装。

??? question "我可以用这个进行交易吗？"
    如果您的 Cloudflare IP 位于德国（通常是这样），使用单个德国代理 IP 应该没问题。但最好使用链式代理方法来稳定 IP。

??? question "为什么我在面板中看不到非 TLS 端口？"
    要使用非 TLS 配置，您必须通过 Workers 方法部署，并且不能使用自定义域。

??? question "为什么最佳 Fragment 配置无法连接或正常工作？"
    在设置中关闭 `Prefer IPv6`（首选 IPv6）。

??? question "为什么 Telegram 通话或 Clubhouse 无法工作？"
    Cloudflare 无法正确处理 UDP 协议。目前没有有效的解决方案。请改用 Warp 配置。

??? question "为什么普通的 Trojan 配置无法连接？"
    如果您想使用普通订阅进行连接，请确保您使用的任何应用中的远程 DNS 与面板匹配。像 `udp://1.1.1.1` 或 `1.1.1.1` 这样的格式不适用于 Trojan。以下格式是可以的：
    ```title="DoH"
    https://8.8.8.8/dns-query
    ```
    ```title="DoT"
    tls://8.8.8.8
    ```
    ```title="TCP"
    tcp://8.8.8.8
    ```
  
    我建议使用“完整普通”或“Fragment”订阅，其中已包含所有正确的设置。

??? question "为什么 ChatGPT 打不开？"
    因为面板的默认代理 IP 是公共的，许多可能对 ChatGPT 来说显得可疑。请使用以下链接搜索并为自己测试一个合适的 IP：
    ```link
    https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
    ```
    或者在面板的路由部分启用 `Bypass ChatGPT` 选项。

??? question "我忘记了面板密码。我该怎么办？"
    进入您的 Cloudflare 仪表板，找到为 Worker 或 Pages 创建的 KV，单击查看，进入 KV Pairs 部分。在表格中，您会看到一个 `pwd` 键——旁边的值就是您的密码。

??? question "如果我不更改 UUID 和 Trojan 密码会发生什么？"
    从 2.7.7 版本开始，设置这两个参数是强制性的，否则面板将无法运行。

??? question "我使用了 Pages 上传方法，但收到了 404 错误。"
    Cloudflare 大约需要 4-5 分钟来注册 Pages 域名。给它一些时间，刷新一下，应该就可以了。

??? question "为什么面板不显示“阻止广告”复选框？"
    像 `uBlock`、`AdGuard` 这样的扩展程序，甚至一些带有内置广告拦截设置的浏览器，都可能隐藏它。请为面板禁用它们。