# :material-new-box:{ .md .middle } Workers 和 Pages 安装 -向导

为了简化设置过程并防止用户在创建过程中出错，我们推出了 [BPB 向导](https://github.com/bia-pain-bache/BPB-Wizard) 项目。它支持 Workers 和 Pages 两种方法，强烈建议使用。

![Pages Application](../images/wizard.jpg)

## 1. Cloudflare 账户

要使用此方法，您只需要一个 Cloudflare 账户。您可以在[此处注册](https://dash.cloudflare.com/sign-up/)，之后别忘了检查您的电子邮件以验证您的账户。

## 2. 安装 BPB 控制面板

!!! warning
    如果您已连接到 VPN，请断开它。

### Windows - Linux - macOS

根据您的操作系统，[下载 ZIP 文件](https://github.com/bia-pain-bache/BPB-Wizard/releases/latest)，解压缩并运行程序。

### Android

在手机上安装了 Termux 的 Android 用户只需将此代码复制到 Termux 中即可安装 BPB 控制面板：

```bash title="Termux - Linux"
bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/BPB-Wizard/main/install.sh)
```

!!! warning
    请务必仅从其[官方来源](https://github.com/termux/termux-app/releases/latest)下载和安装 Termux。通过 Google Play 安装可能会导致问题。

第一个问题是询问您是要创建一个新面板还是修改帐户中现有的面板。

然后它会登录您的 Cloudflare 帐户，请求您的许可，返回到终端并询问您一系列问题。

如果您选择选项 1，它将询问一系列配置问题。您可以使用默认值或输入自己的值。最后，它会在您的浏览器中为您打开面板——就是这样。

!!! note
    对于它询问的每个设置，它都已经为您生成了一个安全的、个性化的值。您可以直接按 Enter 键接受它并转到下一个问题，也可以输入您自己的值。

如果您选择选项 2，它会列出已部署的 Workers 和 Pages 项目，您可以选择要修改的项目。

## 更新面板

只需运行向导并在第一个问题中选择选项 2。它将显示您帐户中的项目名称列表——您可以选择任何一个进行更新或删除。