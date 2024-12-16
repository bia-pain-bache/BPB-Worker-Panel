<h1 align="center">⁉️ 常见问题</h1>

1- 为什么Fragment配置无法连接？
- 如果您启用了`Routing`但VPN无法连接，唯一的原因是Geo asset没有更新。进入v2rayNG应用程序菜单中的`Geo asset files`部分，点击云或下载图标进行更新。如果更新失败，您将无法连接。如果尝试更新仍然不成功，请从以下两个链接下载文件，然后点击添加按钮而不是更新按钮，将这两个文件导入：
> 
>[geoip.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat)
> 
>[geosite.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat)
<br> 

2- 为什么普通配置无法连接？
- 使用这些配置时，请关闭您使用的每个应用程序的`Mux`设置。
<br>

3- 为什么Nekobox或Hiddify Next应用程序无法打开任何网站？
- 在应用程序设置中，`remote DNS`应设置为：
> `https://8.8.8.8/dns-query`
<br>

4- 为什么Fragment配置在我的运营商上速度慢？
- 每个运营商都有其特定的Fragment设置。大多数情况下，默认面板设置是可以的，但在您的运营商上可能需要更好的设置，您需要进行测试：
> `Length: 10-100`
> 
> `Length: 10-20`
<br>

5- 为什么我的Ping值这么高？
- 请勿使用`https://1.1.1.1/dns-query`作为remote DNS，因为这会增加Ping值。
<br>

6- 我使用了两个Proxy IP教程中的链接，但网站无法打开！
- 这些IP数量众多，可能很多已经失效。您需要测试以找到一个好的。
<br>

7- 当我设置了proxy IP时，它工作正常，但现在失效了！
- 如果您使用单个IP，可能在一段时间后会再次失效，很多网站无法打开。您需要重新执行这些步骤。最好不要设置单个Proxy IP，除非您有特定需求需要固定IP。
<br>

8- 为什么当我访问`panel/`地址时出现错误？
- 请按照教程进行设置，KV未正确配置。
<br>

9- 我已经部署了，但Cloudflare给出1101错误！
- 如果是Worker，请使用Pages方法构建，如果仍然出错，您的Cloudflare账户可能已被识别，请使用一个正式的电子邮件（如Gmail）创建一个新的GitHub和Cloudflare账户，并使用Pages方法。此外，请确保项目名称中不包含“bpb”。
- [推荐使用的新方法](https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/docs/pages_upload_installation_fa.md)是Pages，目前建议使用这种方法。
<br>

10- 我可以用它进行交易吗？
- 如果您的Cloudflare IP是德国的（通常是这样），使用单个德国Proxy IP可能没有问题，但最好使用Chain Proxy方法来固定IP。
<br>

11- 我使用Pages部署了，但在GitHub中同步fork新版本时，面板版本没有改变！
- 每次更新时，Cloudflare会为该版本创建一个新的测试链接，因此当您打开项目时，在Deployment部分会看到几个不同的链接。没有一个是您的面板的主链接，您需要从页面顶部的Production部分点击Visit Site进入面板。
<br>

12- 我启用了non TLS端口，但无法连接！
- 请注意，使用non TLS配置时，必须通过Workers而不是自定义域名或Custom Domain进行部署。
<br>

13- 为什么Best Fragment配置无法连接或Ping不工作？
- 在设置中关闭`Prefer IPv6`。
<br>

14- 为什么Telegram或clubhouse的语音通话无法工作？
- Cloudflare无法正确建立UPD协议，目前没有有效的解决方案。
<br>

15- 为什么普通Trojan配置无法连接？
- 如果您想使用普通订阅连接，您使用的每个程序都需要检查Remote DNS是否与面板相同，udp://1.1.1.1或1.1.1.1格式不适用于Trojan。以下格式是合适的：
- `https://8.8.8.8/dns-query`
- `tcp://8.8.8.8`
- `tls://8.8.8.8`
- 建议使用Full Normal或Fragment订阅，它们包含所有设置。
<br>

16- 为什么ChatGPT无法打开？
- 因为面板的默认Proxy IP是公共的，可能很多对ChatGPT来说是可疑的。您需要从以下链接中查找并测试，选择一个合适的IP：
> https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
<br>

17- 我忘记了面板密码怎么办？
- 进入Cloudflare仪表板，找到您为Worker或Pages创建的KV，点击view，进入KV Pairs部分，在表格中会看到一个pwd，旁边的值就是您的密码。
<br>

18- 如果我不更改Trojan的UUID和密码会怎样？
- 从版本2.7.7开始，设置这两个参数是强制性的，面板在没有它们的情况下无法启动。