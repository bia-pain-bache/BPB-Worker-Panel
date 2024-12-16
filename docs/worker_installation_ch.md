<h1 align="center">通过 Cloudflare Workers 安装</h1>
首先从这里下载 Worker 代码，然后编辑你创建的 Worker，删除左侧边栏中的 worker.js 文件，并上传新文件。如果出现错误，也删除 package-lock.json 文件。由于代码量很大，用手机复制粘贴很困难，请根据下图上传。在手机上打开侧边菜单，长按并上传。
<p align="center">
<img src="assets/images/Worker_mobile_upload.jpg">
</p>
最后，保存并部署 Worker。现在返回 Worker 仪表板并按照以下步骤操作：
<p align="center">
<img src="assets/images/Navigate_worker_dash.jpg">
</p>
首先在仪表板顶部点击“访问”，你会看到一个错误，提示你需要先设置 UUID 和 Trojan 密码。点击链接，在浏览器中打开并保留，以备后续步骤使用。
<p align="center">
<img src="assets/images/Generate_secrets.jpg">
</p>
从这里进入“KV”页面：
<p align="center">
<img src="assets/images/Nav_dash_kv.jpg">
</p>
在 KV 部分点击“创建命名空间”，输入一个自定义名称，例如 Test，然后点击“添加”。
再次从左侧菜单进入“Workers & Pages”部分，打开你创建的 Worker，进入“设置”并找到“绑定”。点击“添加”并选择“KV 命名空间”，从下拉菜单中选择你创建的 KV（例如 Test）。重要的是上面的下拉菜单，必须将其设置为“bpb”并部署。
<p align="center">
<img src="assets/images/Bind_kv.jpg">
</p>
在同一“设置”部分，你会看到“变量和秘密”，点击“添加变量”，在第一个框中输入大写的“UUID”，可以从之前打开的链接中复制 UUID 到值部分并部署。再次点击“添加变量”，在第一个框中输入大写的“TROJAN_PASS”，可以从同一链接中获取 Trojan 密码并复制到值部分并部署。
例如，假设你的 Worker 域名是 worker-polished-leaf-d022.workers.dev，添加一个“panel/”到末尾并进入面板。例如：
>https://worker-polished-leaf-d022.workers.dev/panel
系统会要求你设置新密码并登录，完成安装。后续的说明可能对大多数人不必要。设置和提示在主教程中。
<br><br>
<h1 align="center">高级设置（可选）</h1>
1- 固定 Proxy IP：
我们有一个问题，这段代码默认使用大量 Proxy IP，每次连接到 Cloudflare 后面的站点（包括网络的大部分）时，会随机选择一个新的 IP，因此你的 IP 会不断变化。这种 IP 变化可能对某些人（尤其是交易者）造成问题。从版本 2.3.5 开始，你可以通过面板更改 Proxy IP，应用更改并更新订阅即可完成。但我建议使用我在下面解释的方法，因为：
> [!CAUTION]
> 如果通过面板应用 Proxy IP 并且该 IP 失效，你需要替换一个 IP 并更新订阅。这意味着如果你已经分享了配置并更改了 Proxy IP，将没有效果，因为用户没有订阅来更新配置。因此，建议仅将此方法用于个人使用。但我将在下面介绍的第二种方法的好处是，它通过 Cloudflare 仪表板完成，不需要更新配置。
<br><br>
要更改 Proxy IP，请从左侧菜单进入“Workers & Pages”部分，打开你创建的 Worker，进入“设置”并找到“变量和秘密”：
<p align="center">
<img src="assets/images/Workers_variables.jpg">
</p>
在这里你需要指定值。每次点击“添加”并输入一个，然后部署：
<p align="center">
<img src="assets/images/Workers_add_variables.jpg">
</p>
现在点击“添加变量”，在第一个框中输入大写的“PROXYIP”，你可以从下面的链接获取 IP，打开这些链接会显示一些 IP，你可以检查它们的国家并选择一个或多个：
>Proxy IP
<p align="center">
<img src="assets/images/Proxy_ips.jpg">
</p>
> [!TIP]
> 如果你想要多个 Proxy IP，可以用逗号分隔输入，例如 151.213.181.145,5.163.51.41,bpb.yousef.isegaro.com
<br><br>
2- 将域名连接到 Workers：
为此，请进入 Cloudflare 仪表板，从“Workers and Pages”部分选择你的 Worker。进入“设置”，你会在顶部看到“域名和路由”，点击“添加 +”并选择“自定义域名”。这里要求你输入一个域名（请注意，你之前必须购买一个域名并在此账户上激活，这里不提供教程）。假设你有一个名为 bpb.com 的域名，在域名部分你可以输入域名本身或一个自定义子域名。例如 xyz.bpb.com。然后点击“添加域名”。Cloudflare 会自动将 Worker 连接到你的域名（这可能需要一些时间，Cloudflare 自己说可能需要长达 24 小时）。
然后你需要再次点击“添加 +”，这次选择“路由”，在区域部分选择你自己的域名，在路由部分输入新域名：
> *bpb.com/*
完成后，你可以从地址 https://xyz.bpb.com/panel 进入你的面板并获取新的订阅。
> [!TIP]
> 1- 如果将域名连接到 Worker，流量将变得无限。
>
> 2- Worker 本身支持非 TLS 端口，如 80 和 8080，并在面板中显示，但如果连接了域名，这些端口将不再工作，面板也不会显示。
