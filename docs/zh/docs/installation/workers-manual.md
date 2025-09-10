# :material-new-box:{ .md .middle } 通过 Cloudflare Workers 安装

## 安装

### 1. 创建 Cloudflare 账户

如果您没有 Cloudflare 账户，请[在此处](https://dash.cloudflare.com/sign-up)创建一个。您只需要一个电子邮件进行注册。由于 Cloudflare 的限制，请使用像 Gmail 这样信誉良好的电子邮件提供商。

### 2. 创建 worker

首先，从[此处](https://github.com/Starry-Sky-World/BPB-i18n/releases/latest/download/worker.js)下载 Worker 代码。

在您的 Cloudflare 帐户中，导航到 `Developer Platform` 选项卡并单击 `Create application`，从 `Workers` 选项卡中找到 `Start with Hello World!` 并 `Get started`。

输入一个所需的名称，它将构成您面板的域名，然后 `Deploy`。

!!! danger
    选择一个不包含单词 `bpb` 的名称，因为这可能会触发 Cloudflare 的检测并导致 `1101` 错误。

然后单击此处的 `Edit code`。在左侧边栏中，删除 `worker.js` 文件并上传新的文件。如果出现错误，也请删除 `package-lock.json` 文件。由于代码量变大，在手机上复制粘贴很困难——请参考下图并正确上传。在手机上，打开侧边菜单，长按资源管理器，然后单击 `Upload...`。

![Mobile upload](../images/worker-mobile-upload.jpg)

最后，`Deploy` Worker。

!!! tip
    请注意，面板更新过程完全相同——您删除旧文件，上传新文件，然后部署。以前的设置保持安全，只有面板会更新。

首先，在仪表板顶部，单击 `Visit`。您会看到一个错误，提示您需要先设置 UUID 和 Trojan 密码。它包含一个链接（Secrets generator）——在浏览器中打开它并为下一步保持打开状态。

![Generate secrets](../images/generate-secrets.jpg)

### 3. 创建 KV

返回到 Worker 仪表板并按照以下步骤操作：

![Workers dashboard](../images/nav-worker-dash.jpg)

从这里，转到 `KV` 页面：

![KV dashboard](../images/nav-dash-kv.jpg)

在 KV 部分，单击 `Create`，给它一个名称（例如，Test），然后单击 `Add`。

再次转到 `Developer Platform` 部分，打开您刚刚创建的 Worker，转到 `Bindings`。单击 `Add binding` 并选择 `KV Namespace`。从下拉菜单中，选择您刚刚创建的 KV（例如，Test）。重要的是第一个字段——它**必须**设置为 `kv`。然后单击 `Deploy`。

![Bind KV](../images/bind-kv.jpg)

### 4. 设置 UUID、Trojan 密码和订阅路径

从先前提供的 `Secrets generator` 页面单击 `Copy all`，在 Cloudflare 仪表板中转到 `Settings` 部分，找到 `Variables and Secrets` 部分。单击 `Add` 并粘贴到 `Variable name` 字段中，然后单击 `Deploy`。这将自动将这 3 个参数添加到面板中。

再次在您的 worker 仪表板中单击 `Visit`，您会在浏览器中看到速度测试，只需在地址末尾添加 `/panel` 即可看到您的面板：

它会要求您设置一个新密码并登录——就是这样。
安装已完成；下面的其余信息可能不是每个人都需要。
有关设置教程和提示，请参阅[主指南](../configuration/index.md)。

## 高级配置（可选）

### 固定代理 IP

默认情况下，代码会随机使用多个代理 IP，为每次连接到 Cloudflare 地址（覆盖了大部分网络）分配一个新的随机 IP。这种 IP 轮换可能会导致问题，特别是对于交易者。从 2.3.5 版本开始，您可以通过面板更改代理 IP 并更新订阅。但是，建议使用以下方法：

!!! note
    通过面板更改代理 IP 需要在 IP 停止工作时更新订阅，这可能会中断捐赠的配置，因为没有活动订阅的用户无法更新它们。此方法仅供个人使用。其他方法不需要更新订阅。

要更改代理 IP，请转到 `Workers & Pages`，打开您的 Worker，然后转到 `Settings` → `Variables and Secrets`：

![Workers env variable](../images/workers-variables.jpg)

单击 `Add`，在 `Variable name` 中写入 `PROXY_IP`（大写）。

您可以从下面的链接获取 IP——它显示了多个 IP 及其地区和 ISP。选择一个或多个：

```text
https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
```

![Proxy IPs](../images/proxy-ips.jpg)

!!! info
    要使用多个代理 IP，请用逗号分隔输入它们。
    ```title="示例"
    151.213.181.145, 5.163.51.41, bpb.yousef.isegaro.com
    ```

在 `Value` 字段中输入 IP，然后单击 `Deploy`。

### 固定 NAT64 前缀

默认情况下，代码会随机使用多个 NAT64 前缀，为每次连接到 Cloudflare 地址（覆盖了大部分网络）分配一个新的随机前缀。这种 IP 轮换可能会导致问题，特别是对于交易者。从 3.4.2 版本开始，您可以通过面板更改前缀并更新订阅。但是，建议使用以下方法：

!!! note
    通过面板更改 NAT64 前缀需要在 IP 停止工作时更新订阅，这可能会中断捐赠的配置，因为没有活动订阅的用户无法更新它们。此方法仅供个人使用。其他方法不需要更新订阅。

在项目的 `Settings` 部分，打开 `Variables and Secrets`，单击 `Add` 并在第一个框中输入 `NAT64_PREFIX`（大写）。从以下链接获取 IP，该链接按地区和 ISP 列出了 IP：

```text
https://github.com/Starry-Sky-World/BPB-i18n/blob/main/NAT64Prefixes.md
```

!!! info
    要使用多个 IP，请用逗号分隔它们。
    ```title="示例"
    [2602:fc59:b0:64::], [2602:fc59:11:64::]
    ```

在 `Value` 字段中输入 IP，然后单击 `Deploy`。

### 设置回退域

默认情况下，访问主 Worker 域会重定向到 Cloudflare 速度测试站点。要更改此设置，请遵循与代理 IP 相同的步骤，但将变量名称设置为 `FALLBACK` 并提供一个域名（不带 `https://` 或 `http://`）作为值，例如 `www.speedtest.net` 或 `npmjs.org`。

### 更改订阅路径

默认订阅链接路径使用与 VLESS 相同的 UUID。为了增加隐私性，您可以更改此设置。遵循与上述相同的步骤，但将变量名称设置为 `SUB_PATH`。`/secrets` 处的秘密生成器提供了一个 `Random Subscription URI path` 值，您可以使用该值或用自定义值替换（使用允许的字符）。

### 添加自定义域

转到您的 Cloudflare 仪表板，从 `Compute (Workers)` > `Workers & Pages` 打开您的 Worker。转到 `Settings`，在顶部您会看到 `Domains & Routes`。单击 `Add +`，然后选择 `Custom domain`。

输入一个域名（您必须拥有并在同一帐户上激活了它）。

假设您的域名是 `bpb.com`。您可以输入主域名或子域名，如 `xyz.bpb.com`，然后单击 `Add domain`。

Cloudflare 会将 Worker 连接到您的域（这可能需要一些时间——他们说最多 24 小时）。

然后再次单击 `Add +`，但这次选择 `Route`。从 `Zone` 部分选择您的域，并在 `Route` 部分像这样输入：

```title="路由"
*bpb.com/*
```

然后，您可以通过 `https://xyz.bpb.com/panel` 访问您的面板并获取新的订阅。

!!! tip
    - 如果您将域连接到 Worker，您的流量可能会变得无限。
    - Worker 面板支持非 TLS 端口，如 80、8080 等。但是一旦添加了自定义域，这些端口将停止工作，并且在面板中将不可用。

## 更新面板

要更新您的面板，请从[此处](https://github.com/Starry-Sky-World/BPB-i18n/releases/latest/download/worker.js)下载新的 worker.js 文件。在您的 Cloudflare 帐户中，转到 `Compute (Workers)` > `Workers & Pages`，选择您的 Worker 项目，编辑它，删除旧的 worker，上传新的并部署。