搭建 BPB 面板的详细教程

本教程将指导您使用 GitHub 复制 BPB 项目并使用 Cloudflare Workers 和 Pages 搭建 BPB 面板。

以下是步骤：

第一步：从 GitHub 复制 BPB 项目

克隆项目仓库           
原始项目  https://github.com/bia-pain-bache/BPB-Worker-Panel
本人汉化项目https://github.com/Lu6618/MFJD

配置 Cloudflare Workers

登录 Cloudflare
访问 Cloudflare官网 并登录您的账户。如果没有账户，请先注册一个。
创建 Workers
在 Cloudflare 仪表板中，导航到“Workers”选项卡。
点击“Create a Service”按钮，输入服务名称并创建服务。
选择“Quick Edit”，进入 Workers 编辑界面。
上传代码
将 BPB-Worker-Panel 目录中的 worker.js 文件内容复制粘贴到 Workers 编辑器中。
点击“Save and Deploy”按钮来保存和部署您的 Workers 脚本。
 




Pages方法

创建 Pages 项目
在 Cloudflare 仪表板中，导航到“Pages”选项卡。
点击“Create a Project”按钮。
选择从 GitHub 导入仓库并授权 Cloudflare 访问您的 GitHub 账户。
选择仓库
选择您之前克隆的  仓库。
配置项目名称和生产分支（通常是 main 或 master）。
构建设置
部署项目
点击“Save and Deploy”按钮，Cloudflare Pages 将开始构建和部署您的项目。
部署完成后，您将获得一个项目 URL，访问该 URL 可以查看您的 BPB 面板。