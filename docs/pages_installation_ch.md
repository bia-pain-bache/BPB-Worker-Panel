<h1 align="center">通过 Cloudflare Pages 和 Github 安装</h1>
介绍
您可能知道有两种方法可以在 Cloudflare 上构建代理：Worker 和 Pages。值得注意的是，较常用的 Worker 方法有一个限制，即每天最多只能发送十万次请求。当然，这个限制对于 2-3 人的使用是足够的。为了绕过 Worker 方法的限制，我们可以将一个域名连接到 Worker，这样就可以无限制使用（这似乎是 Cloudflare 的一个漏洞）。然而，Pages 没有这个限制（最近有些报告称这种方法也会有限制，您可以自行测试）。由于我们在这种方法中使用了名为 Pages functions 的功能，您仍然会收到一封电子邮件，通知您已达到 100k 的使用限制，即使您使用了个人域名，您也会收到这封电子邮件。但最终的经验表明，您的服务不会中断。
另一个重要的优势是更新的简便性。当项目代码更新时，您也可以轻松更新您的面板，而无需重新执行步骤。更多说明请参见更新部分。
此外，使用 Pages 的步骤要简单得多，您可以轻松地在手机上完成这些操作。<br><br>
第一步 - Github
在 Github 网站上创建一个账户（注册只需要一个电子邮件，我们建议不要使用虚假的或临时的电子邮件）。使用您的 Github 用户信息登录。
然后访问 Github 上的 BPB-Worker-Panel 页面，并点击顶部的 Fork 按钮。
<br><br>
<p align="center">
<img src="assets/images/Fork_repo.jpg">
</p>
在下一页中不要更改任何内容，点击 Create Fork。好了，我们在 Github 上的工作完成了。
<br><br>
第二步 - Cloudflare Pages
如果您没有 Cloudflare 账户，请从这里创建一个账户（这里也只需要一个电子邮件来注册）。
现在，在您的 Cloudflare 账户中，从左侧菜单进入 Workers and Pages 部分（就是我们创建 Worker 的地方），然后点击 Create Application。这次选择 Pages：
<p align="center">
<img src="assets/images/Pages_application.jpg">
</p>
点击 Connect to Git 进入下一步：
<p align="center">
<img src="assets/images/Connect_to_git.jpg">
</p>
点击 BPB-Worker-Panel 以激活它，然后点击 Begin Setup。下一步有一个 Project Name，它将成为您的面板域名，请务必更改它，不要包含 bpb 这个词，选择一个您喜欢的名字，否则您的账户可能会被 Cloudflare 识别。
现在您可以点击 Save and Deploy。
需要几秒钟的时间来安装项目，请等待 Continue to Project 按钮出现，然后点击进入项目页面。
您的项目已经创建，但尚不可用。在 Deployment 页面中，Production 部分点击 visit，您会看到一个错误，提示您首先需要设置 UUID 和 Trojan Password，点击链接，在浏览器中打开它，留着以备后用。
<p align="center">
<img src="assets/images/Generate_secrets.jpg">
</p>
第三步 - 创建 Cloudflare KV 并设置 UUID 和 Trojan Password
从左侧菜单进入 KV 部分：
<p align="center">
<img src="assets/images/Nav_dash_kv.jpg">
</p>
点击 Create a namespace，给它一个您喜欢的名字并添加。
返回 Workers and Pages 部分，进入您创建的 Pages 项目，根据下图进入 Settings 部分：
<p align="center">
<img src="assets/images/Settings_functions.jpg">
</p>
在这里，像在 Worker 中一样，找到 Bindings 部分，点击 Add 并选择 KV Namespace，Variable name 必须是 bpb（如我所写），选择您在第二步创建的 KV namespace 并保存。
<p align="center">
<img src="assets/images/Pages_bind_kv.jpg">
</p>
好了，我们在 KV 上的工作完成了。
在同一 Settings 部分，您会看到 Variables and Secrets，点击 Add variable，在第一个框中输入大写的 UUID，您可以从前一步的链接中获取 UUID 并复制到 Value 部分并保存。再一次点击 Add variable，在第一个框中输入大写的 TROJAN_PASS，您可以从前一步的链接中获取 Trojan 密码并复制到 Value 部分并保存。
从顶部导航返回 Deployment 部分，从 Production 部分进入 view details：
<p align="center">
<img src="assets/images/Pages_production_details.jpg">
</p>
现在在 Deployment detail 部分点击 Manage Deployment 并选择 Retry deployment：
<p align="center">
<img src="assets/images/Pages_retry_deployment.jpg">
</p>
等待几秒钟，直到步骤完成，我们的工作就完成了！
点击返回，从 Production 部分点击 visit site，然后在末尾添加 panel/，进入面板。
设置和注意事项的教程在主教程中。
安装完成，接下来的说明可能对大多数人不必要！
<br><br>
<h1 align="center">高级设置（可选）</h1>
2- 固定 Proxy IP：
我们有一个问题，这段代码默认使用大量的 IP Proxy，每次连接到 Cloudflare 后面的站点（包括网络的大部分）时，会随机选择一个新的 IP，因此您的 IP 会不断变化。这种 IP 变化可能会对某些人造成问题（尤其是交易者）。从版本 2.3.5 开始，您可以通过面板更改 Proxy IP，方法是应用更改并更新订阅即可。但我建议使用我接下来解释的方法，因为：
> [!CAUTION]
> 如果您通过面板应用 Proxy IP，并且该 IP 失效，您需要替换一个 IP 并更新订阅。这意味着如果您已经捐赠了配置并更改了 Proxy IP，将没有效果，因为用户没有订阅来更新配置。因此，建议仅将此方法用于个人使用。但我接下来要说的第二种方法的好处是，它通过 Cloudflare 仪表板完成，不需要更新配置。
<br><br>
要更改 Proxy IP，当您进入项目时，从 Settings 部分打开 Environment variables：
<p align="center">
<img src="assets/images/Pages_env_vars.jpg">
</p>
在这里，您需要指定值。每次点击 Add 并输入一个，然后保存：
<p align="center">
<img src="assets/images/Pages_add_variables.jpg">
</p>
现在点击 Add variable，在第一个框中输入大写的 PROXYIP，您可以从下面的链接中获取 IP，打开这些链接会显示一些 IP，您可以检查它们的国家并选择一个或多个：
>Proxy IP
<p align="center">
<img src="assets/images/Proxy_ips.jpg">
</p>
> [!TIP]
> 如果您想要多个 Proxy IP，可以用逗号分隔输入，例如 151.213.181.145,5.163.51.41,bpb.yousef.isegaro.com
从顶部导航返回 Deployment 部分，从 Production 部分进入 view details，在 Deployment detail 部分点击 Manage Deployment 并选择 Retry deployment。
<br><br>
4- 将域名连接到 Pages：
为此，进入 Cloudflare 仪表板，从 Workers and Pages 部分选择您的面板。进入 Custom domains 部分并点击 set up a custom domain。这里要求您输入一个域名（请注意，您之前必须购买一个域名并在此账户上激活，这里不提供教程）。假设您有一个名为 bpb.com 的域名，在 Domain 部分您可以输入域名本身或一个自定义子域名。例如 xyz.bpb.com，然后点击 Continue，在下一页点击 Activate domain。Cloudflare 会自动将 Pages 连接到您的域名（这可能需要一段时间，Cloudflare 自己说可能需要长达 48 小时）。在这段时间之后，您可以从 https://xyz.bpb.com/panel 进入您的面板并获取新的订阅。
<br><br>
<h1 align="center">面板更新</h1>
Pages 相对于 Worker 的一个优势是，当代码有更新时，您不需要下载新的 worker.js 版本并重新开始！实际上，更新时您不需要与 Cloudflare 打交道。只需进入您的 Github，进入 BPB-Worker-Panel 仓库，然后点击 Sync fork：
<p align="center">
<img src="assets/images/Sync_fork.jpg">
</p>
然后点击 Update branch 就完成了。好处是 Cloudflare Pages 会自动检测到，并在大约 1 分钟后自动为您更新。
