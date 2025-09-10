# :material-new-box:{ .md .middle } Pages 设置 - 自动构建

## 提醒

::: warning

该方法正在测试中，可能存在一些问题。

:::

## 准备工作

- 你需要一个 GitHub 账号，并fork [BPB-Chinese](https://github.com/BPB-Chinese/BPB-Chinese.github.io) 仓库。
- 你需要一个 Cloudflare 账号。
- 手和脑子
- 找个ai问问，它会帮你

## 步骤
略

## 原理
cloudflare自动执行[脚本](https://github.com/BPB-Chinese/BPB-Chinese.github.io/blob/master/scripts/cloudflare-autobuild.sh)，然后输出文件到dist/文件夹，然后Cloudflare会自动部署到网站。