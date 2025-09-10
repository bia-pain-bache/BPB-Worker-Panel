# :material-new-box:{ .md .middle } Pages 设置 - 自动构建

## 提醒

该方法正在测试中，可能存在一些问题。


## 准备工作

- 你需要一个 GitHub 账号，并fork [BPB-i18n](https://github.com/Starry-Sky-World/BPB-i18n) 仓库。
- 你需要一个 Cloudflare 账号。
- 手和脑子
- 找个ai问问，它会帮你

## 步骤
略

## 原理
cloudflare自动执行[脚本](https://github.com/Starry-Sky-World/BPB-i18n/blob/master/scripts/cloudflare-autobuild.sh)，然后输出文件到dist/文件夹，然后Cloudflare会自动部署到网站。