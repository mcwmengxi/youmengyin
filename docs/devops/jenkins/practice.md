### 二 搭建 Jenkins 及工具配置

1. 安装 Jenkins
   ● Docker 安装 Jenkins (版本 2.555.1)

```bash
docker run -itd \
-p 8088:8080 -p 50000:50000 \
--name jenkins \
--privileged=true \
-v D:\docker\jenkins:/var/jenkins_home \
docker.io/jenkins/jenkins:lts


docker run -itd -p 8088:8080 -p 50000:50000 --name jenkins --privileged=true -v D:\docker\jenkins:/var/jenkins_home docker.io/jenkins/jenkins:lts
```

使用 docker exec 命令进入容器内部 定位到初始化密码所在目录

```bash
 docker exec -it fabff3be840a293e bash
cat /var/jenkins_home/secrets/initialAdminPassword

6fad21e16e9b471092878d9346d96aa2
```

2. 构建 GitHub 前端项目（Freestyle 项目模式）

   ● 安装必要的插件

   - 安装 Git plugin、NodeJS plugin、GitHub plugin
   - 进入 Manage Jenkins → Manage Plugins → Available，安装所需插件

   ● 配置 NodeJS 环境

   - Manage Jenkins → Global Tool Configuration → NodeJS
   - 添加 NodeJS 安装，勾选 "Install automatically"

   ● 创建 Freestyle 项目

   - 新建 Item → **Freestyle project**
   - 输入项目名称，点击 OK

   ● 配置源码管理（Source Code Management）

   - 选择 Git
   - Repository URL: 填写 GitHub 仓库地址（如 `https://github.com/username/frontend-project.git`）
   - Credentials: 添加 GitHub 凭据（用户名密码或 SSH Key）
   - Branch: `*/main` 或 `*/master`

   ● 配置构建环境（Build Environment）

   - 勾选 "Provide Node & npm bin/ folder to PATH"
   - 选择已配置的 NodeJS 版本

   ● 配置构建步骤（Build Steps）

   - 点击 "Add build step" → "Execute shell"（Linux）或 "Execute Windows batch command"（Windows）

   ```bash
   # 第一步：安装依赖
   npm install

   # 第二步：构建项目
   npm run build
   ```

   - 如需多步骤构建，可添加多个 build step

   ● 配置构建后操作（Post-build Actions）

   - 可选：Archive the artifacts（归档构建产物）
     - Files to archive: `dist/**/*`
   - 可选：E-mail Notifications（邮件通知）

   ● 配置 GitHub Webhook 自动触发

   - 在 Freestyle 项目配置中勾选 "GitHub hook trigger for GITScm polling"
   - 在 GitHub 仓库 Settings → Webhooks → Add webhook
   - Payload URL: `http://your-jenkins-server:8088/github-webhook/`
   - Content type: `application/json`
   - 选择 Just the push event 触发构建
