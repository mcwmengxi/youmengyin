### 一、部署目标

#### 1.1 整体目标

实现前端项目的**自动化构建与部署**，开发者将代码推送到 GitHub 仓库后，无需人工介入，系统自动完成：

```
代码提交 → 自动构建 → 自动部署 → 自动通知
```

#### 1.2 具体目标

| 目标           | 说明                                    |
| -------------- | --------------------------------------- |
| **自动化构建** | 代码提交后自动触发 Jenkins 构建任务     |
| **依赖管理**   | 自动安装 Node.js 依赖并构建生产版本     |
| **自动部署**   | 构建成功后自动将产物部署到 Nginx 服务器 |
| **版本管理**   | 支持版本备份与快速回滚                  |
| **构建通知**   | 构建/部署成功后自动发送通知             |

#### 1.3 技术架构

```
┌─────────────┐     Webhook      ┌─────────────┐
│   GitHub    │ ───────────────→ │   Jenkins   │
│  仓库代码   │                  │   容器 8088 │
└─────────────┘                  └──────┬──────┘
                                       │
                              构建 → 部署
                                       │
                                       ↓
                               ┌─────────────┐
                               │    Nginx    │
                               │  容器 80/8089│
                               └─────────────┘
```

#### 1.4 部署方式对比

| 方式          | 优点                             | 缺点                     | 适用场景           |
| ------------- | -------------------------------- | ------------------------ | ------------------ |
| **Freestyle** | 配置简单，图形化操作             | 配置难以版本化，难以复用 | 简单项目，快速验证 |
| **Pipeline**  | 代码化配置，支持版本控制，可复用 | 学习曲线较陡             | 生产环境，推荐使用 |

#### 1.5 环境要求

| 组件    | 版本   | 端口      |
| ------- | ------ | --------- |
| Docker  | 最新版 | -         |
| Jenkins | LTS    | 8088      |
| Nginx   | Latest | 80 / 8089 |
| Node.js | 16+    | -         |
| Git     | 最新版 | -         |

#### 1.6 前置准备

- [ ] Docker Desktop for Windows 已安装并运行
- [ ] GitHub 账号及前端项目仓库
- [ ] 服务器/本地有足够磁盘空间存储构建产物
- [ ] 基础命令行操作知识

---

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

docker run -d \
  --name nginx \
  -p 80:80 \
  -v /data/deploy/youmengyin:/usr/share/nginx/html/youmengyin \
  -v /path/to/nginx.conf:/etc/nginx/conf.d/default.conf \
  nginx:latest

docker run -itd -p 8088:8080 -p 50000:50000 --name jenkins --privileged=true -v D:\docker\jenkins:/var/jenkins_home  docker.io/jenkins/jenkins:lts

docker run -d --name nginx -p 8089:80 -v D:\docker\deploy\youmengyin:/usr/share/nginx/html/youmengyin  -v D:\docker\deploy\nginx\nginx.conf:/etc/nginx/conf.d/default.conf nginx:latest
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

---

### 三、Nginx 配置详解

#### 3.1 Nginx 配置文件示例

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 或使用 IP 地址

    # 前端项目静态文件目录
    root /usr/share/nginx/html/youmengyin;
    index index.html;

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Vue Router history 模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理（可选）
    location /api/ {
        proxy_pass http://backend-server:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3.2 Windows Docker 环境 Nginx 配置

在 Windows 环境下，Nginx 配置文件挂载路径需要注意：

```bash
# 创建本地 Nginx 配置文件
# D:\docker\deploy\nginx\nginx.conf

server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html/youmengyin;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # CORS 跨域配置（如果前端 API 与前端同源）
    location /api/ {
        proxy_pass http://host.docker.internal:3000/;
    }
}
```

#### 3.3 验证 Nginx 配置

```bash
# 进入 Nginx 容器
docker exec -it nginx bash

# 测试配置语法
nginx -t

# 重载配置（无需重启容器）
nginx -s reload
```

---

### 四、构建产物自动部署

#### 4.1 Freestyle 项目部署配置

在 Freestyle 项目中，添加 **构建后操作** 来部署到 Nginx：

**方式一：使用 "Execute shell" 部署（Linux）**

```bash
# 删除旧版本构建产物
rm -rf /data/deploy/youmengyin/*

# 复制新构建产物到 Nginx 目录
cp -r /var/jenkins_home/workspace/your-project/dist/* /data/deploy/youmengyin/

# 设置正确权限
chmod -R 755 /data/deploy/youmengyin/
```

**方式二：使用 "Publish Over SSH" 插件**

1. 安装 Publish Over SSH 插件
2. 配置 SSH Server（Manage Jenkins → Configure System → Publish Over SSH）
   - Host: Nginx 服务器地址
   - Credentials: SSH Key 凭据
3. 在 Post-build Actions 中添加 **Send build artifacts over SSH**
   - Source files: `dist/**/*`
   - Remove prefix: `dist`
   - Remote directory: `/usr/share/nginx/html/youmengyin`

#### 4.2 Windows 环境部署脚本

如果使用 Windows Docker 环境，可在构建步骤中添加批处理命令：

```batch
@echo off
rem 进入构建产物目录
cd /d D:\docker\jenkins\workspace\your-project\dist

rem 复制到 Nginx 目录
xcopy /E /Y * D:\docker\deploy\youmengyin\

echo Deployment completed!
```

#### 4.3 构建产物版本管理（可选）

为支持回滚，可保留历史版本：

```bash
# 在部署前备份当前版本
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mv /data/deploy/youmengyin /data/deploy/youmengyin_backup_$TIMESTAMP

# 部署新版本
cp -r /var/jenkins_home/workspace/your-project/dist /data/deploy/youmengyin
```

---

### 五、Pipeline 项目模式（推荐）

Pipeline 是 Jenkins 2.0 引入的现代化 CI/CD 方式，支持代码化配置、版本控制、并行构建等高级特性。

#### 5.1 创建 Pipeline 项目

1. 新建 Item → **Pipeline**
2. 输入项目名称，点击 OK
3. 在 **Pipeline** 部分选择 **Pipeline script** 或 **Pipeline script from SCM**

#### 5.2 基础 Pipeline 脚本

```groovy
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'  // 需在 Global Tool Configuration 中配置
    }

    environment {
        NGINX_DEPLOY_PATH = '/data/deploy/youmengyin'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sh '''
                    rm -rf ${NGINX_DEPLOY_PATH}/*
                    cp -r dist/* ${NGINX_DEPLOY_PATH}/
                    chmod -R 755 ${NGINX_DEPLOY_PATH}/
                '''
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}
```

#### 5.3 从 SCM 读取 Pipeline 脚本

在项目中选择 **Pipeline script from SCM**，配置：

- Definition: **Pipeline script from SCM**
- Repository URL: `https://github.com/username/your-repo.git`
- Credentials: 添加 GitHub 凭据
- Script Path: `Jenkinsfile`
- Branch: `*/main`

然后在项目根目录创建 `Jenkinsfile`：

```groovy
pipeline {
    agent any

    environment {
        NGINX_DEPLOY_PATH = '/data/deploy/youmengyin'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/username/your-repo.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install && npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    rm -rf ${NGINX_DEPLOY_PATH}/*
                    cp -r dist/* ${NGINX_DEPLOY_PATH}/
                '''
            }
        }
    }
}
```

#### 5.4 完整的自动化部署 Pipeline

```groovy
pipeline {
    agent any

    environment {
        NGINX_PATH = '/data/deploy/youmengyin'
        BACKUP_PATH = '/data/deploy/backup'
        DEPLOY_USER = 'jenkins'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching source code...'
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                echo 'Installing dependencies and building...'
                sh 'npm install --legacy-peer-deps'
                sh 'npm run build'
            }
        }

        stage('Backup Current Version') {
            steps {
                echo 'Backing up current version...'
                sh '''
                    if [ -d "${NGINX_PATH}" ]; then
                        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
                        mkdir -p ${BACKUP_PATH}
                        cp -r ${NGINX_PATH} ${BACKUP_PATH}/version_${TIMESTAMP}
                    fi
                '''
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo 'Deploying to Nginx...'
                sh '''
                    rm -rf ${NGINX_PATH}/*
                    cp -r dist/* ${NGINX_PATH}/
                    chmod -R 755 ${NGINX_PATH}/
                '''
            }
        }

        stage('Clean Old Backups') {
            steps {
                echo 'Cleaning old backups (keeping last 5)...'
                sh '''
                    cd ${BACKUP_PATH}
                    ls -dt version_* | tail -n +6 | xargs rm -rf 2>/dev/null || true
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
            emailext(
                subject: "✅ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} Success",
                body: "Build completed successfully. View console output at: ${env.BUILD_URL}",
                to: 'admin@example.com'
            )
        }
        failure {
            echo '❌ Deployment failed!'
            emailext(
                subject: "❌ Build ${env.JOB_NAME} #${env.BUILD_NUMBER} Failed",
                body: "Build failed. View console output at: ${env.BUILD_URL}",
                to: 'admin@example.com'
            )
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
```

---

### 六、GitHub Webhook 配置

#### 6.1 Freestyle 项目 Webhook 配置

- 在 Freestyle 项目配置中，勾选 **GitHub hook trigger for GITScm polling**
- GitHub 仓库 Settings → Webhooks → Add webhook：
  - Payload URL: `http://your-jenkins-server:8088/github-webhook/`
  - Content type: `application/json`
  - SSL verification: 根据服务器证书情况选择
  - Select events: 勾选 **Just the push event**

#### 6.2 Pipeline 项目 Webhook 配置

Pipeline 项目同样使用 GitHub Webhook 触发，无需在项目内单独配置。确保 Jenkins 系统配置中：

1. 进入 **Manage Jenkins** → **Configure System**
2. 找到 **GitHub** 部分，点击 **GitHub Servers**
3. 添加 GitHub Server，勾选 **Manage hooks**

#### 6.3 验证 Webhook 是否生效

在 GitHub Webhook 设置页面，点击 **Test** → **Push event**，查看是否返回 200 状态码。

Jenkins 日志中应显示类似输出：

```
GitHub webhook trigger for GITScm polling
Started by GitHub push by username
```

---

### 七、凭证管理

#### 7.1 GitHub Personal Access Token

1. 在 GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token，勾选 `repo` 和 `admin:repo_hook` 权限
3. 在 Jenkins 中添加凭据：
   - 类型：Username with password 或 Secret text
   - Username: GitHub 用户名
   - Password/Secret: 生成的 Token

#### 7.2 SSH Key 方式

```bash
# 在 Jenkins 服务器生成 SSH Key
ssh-keygen -t rsa -b 4096 -C "jenkins@your-domain.com"

# 查看公钥
cat ~/.ssh/id_rsa.pub

# 添加公钥到 GitHub 账户
# GitHub → Settings → SSH and GPG keys → New SSH key

# 在 Jenkins 中添加凭据
# 类型：SSH Username with private key
# Username: git
# Private Key: 从文件读取或直接输入
```

#### 7.3 在 Pipeline 中使用凭证

```groovy
pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github-token')
    }

    stages {
        stage('Clone Private Repo') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-ssh-key',
                    url: 'git@github.com:username/private-repo.git'
            }
        }
    }
}
```

---

### 八、完整自动化部署流程

#### 8.1 流程概览

```
开发者提交代码到 GitHub
        ↓
GitHub 发送 Webhook 到 Jenkins
        ↓
Jenkins 触发构建任务
        ↓
拉取代码 → 安装依赖 → 构建项目
        ↓
备份当前 Nginx 部署版本
        ↓
部署新构建产物到 Nginx
        ↓
发送构建/部署通知（邮件/Slack）
        ↓
完成
```

#### 8.2 前置条件

1. Docker 已安装并运行
2. Jenkins 容器已启动（端口 8088）
3. Nginx 容器已启动（端口 80/8089）
4. Jenkins 已安装必要插件（Git、NodeJS、Pipeline 等）
5. GitHub Webhook 已正确配置
6. 部署目录权限已正确设置

#### 8.3 常用维护命令

```bash
# 查看容器状态
docker ps

# 重启 Jenkins
docker restart jenkins

# 重启 Nginx
docker restart nginx

# 查看 Jenkins 日志
docker logs -f jenkins

# 进入 Jenkins 容器
docker exec -it jenkins bash

# 手动触发构建（通过 CLI）
curl -X POST http://jenkins-server:8088/job/your-project/build
```

#### 8.4 故障排查

| 问题           | 可能原因                      | 解决方案                       |
| -------------- | ----------------------------- | ------------------------------ |
| Webhook 未触发 | Jenkins 未安装 GitHub plugin  | 安装 GitHub plugin             |
| 构建失败       | NodeJS 版本不兼容             | 检查 package.json engines 配置 |
| 部署失败       | 目录权限不足                  | chmod -R 755 部署目录          |
| 页面 404       | Vue Router history 模式未配置 | Nginx 添加 try_files 配置      |
| 构建产物空白   | 资源路径问题                  | 检查 base 配置或 publicPath    |
