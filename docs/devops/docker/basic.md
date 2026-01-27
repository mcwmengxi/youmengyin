# 213

主要功能：

镜像管理：创建、下载和管理 Docker 镜像。
容器管理：启动、停止、删除容器，以及查看容器状态。
资源隔离：通过 cgroups 和 namespaces 实现资源隔离。
文件系统层叠：基于 Union FS 的文件系统层叠机制。

## 🥃Docker 常用命令

### 1.Docker 镜像操作

- docker pull <镜像名>:<标签>: 从 Docker Hub 下载指定的镜像。
- docker images: 列出本地所有的 Docker 镜像。
- docker rmi <镜像ID>: 删除本地的 Docker 镜像。

### 2.Docker 容器操作

- docker run <镜像名>:<标签> [命令]: 运行一个 Docker 容器，可以指定运行的命令。
- docker ps: 查看正在运行的容器。
- docker ps -a: 查看所有容器，包括已停止的。
- docker stop <容器ID>: 停止一个运行中的容器。
- docker rm <容器ID>: 删除一个容器。
- docker exec -it <容器ID> /bin/bash: 进入一个正在运行的容器内部。

### 3.Docker 网络操作

- docker network ls: 列出所有 Docker 网络。
- docker network create <网络名>: 创建一个新的 Docker 网络。
- docker network connect <网络名> <容器ID>: 将容器连接到指定网络。
- docker network disconnect <网络名> <容器ID>: 断开容器与网络的连接。

### 4.Docker 其他常用命令

- docker build -t <镜像名>:<标签> .: 构建 Docker 镜像。
- docker save <镜像名>:<标签> > <文件名>.tar: 将 Docker 镜像保存为 tar 文件。
- docker load < <文件名>.tar: 从 tar 文件恢复 Docker 镜像。

## 🥂Docker Compose

>Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。它使用 YAML 文件来配置应用程序的服务，然后使用一个命令即可创建和启动所有服务。

**主要功能：**

多容器编排：在单个 YAML 文件中定义多个容器，以及它们之间的依赖关系。
服务定义：可以定义每个服务的环境变量、卷、网络、端口映射等。
一键启动/停止：可以使用一个命令来启动或停止整个应用程序的所有服务。
扩展性：易于扩展和修改应用程序，无需重新配置每个服务。

### Docker Compose 常用命令

1. 初始化与创建

  docker-compose up [-d]: 启动或重建服务，-d表示以后台方式运行容器。

2. 查看状态

docker-compose ps: 显示所有服务容器的状态。
docker-compose logs [服务名]: 显示服务容器的日志输出，可以指定具体的服务名称。

3. 停止与删除

docker-compose down: 停止并移除容器、网络、卷和镜像。
docker-compose stop: 停止容器但不移除它们，这样下次启动会更快。
docker-compose kill: 立即停止服务容器，不等待优雅关闭。

4. 更新与重启

docker-compose restart [服务名]: 重启服务容器，可以指定具体的服务名称。
docker-compose up --force-recreate: 强制重新创建容器，即使容器已经在运行也会先停止再重新创建。

5. 执行命令

docker-compose exec [服务名] [命令]: 在服务容器内运行一个命令，例如：docker-compose exec web sh 可以进入web服务容器的shell。

6. 其他命令

docker-compose config: 检查和验证 docker-compose.yml 文件的语法是否正确。
docker-compose scale [服务名]=数量: 调整服务容器的数量。

7. 构建与拉取

docker-compose build: 根据 Dockerfile 构建服务的镜像。
docker-compose pull: 拉取服务的镜像。

## .dockerignore 文件

.dockerignore 文件是 Docker 用来排除不需要打包进镜像中的文件或目录的一个配置文件。它的工作方式类似于 Git 的 .gitignore 文件，但有一些细微的区别。当你构建 Docker 镜像时，Docker 会读取 .dockerignore 文件，然后根据其中的规则来决定哪些文件或目录应该被排除在外。
.dockerignore 文件中的每一行代表一个排除规则。规则可以是文件名、目录名或者通配符模式。以下是 .dockerignore 文件的一些常见用法：

------

```markdown
<!-- 排除单个文件 -->
.env

<!-- 排除整个目录 -->
node_modules/

<!-- 使用通配符： -->
*.log

<!-- 排除子目录下的文件 -->
*/*.min.js

<!-- 排除特定文件类 -->
*.swp

<!-- 排除隐藏文件和目录 -->
.*~

<!-- 排除特定文件夹下的所有文件 -->
/src/*.js.map

<!-- 排除所有文件，但不包括某些特定文件 -->
*
!important.txt

<!-- 排除所有文件，但不包括某些特定目录 -->
*
!/docs/
```

## Dockerfile

>Dockerfile 是一个文本文件，其中包含了一系列的指令，用于构建 Docker 镜像。这些指令定义了镜像的构建过程，包括基础镜像的选择、工作目录的设定、环境变量的配置、文件的复制、命令的执行等。Docker 使用 Dockerfile 中的指令来生成一个 Docker 镇江镜像，这个镜像可以被用来运行 Docker 容器。

### Dockerfile 常用命令

FROM

说明：指定基础镜像。在这个例子中，我们将使用 Node.js 版本 14 的 Alpine Linux 镜像作为基础

```shell
FROM node:14-alpine
```

LABEL

说明：为镜像添加元数据标签。这里指定了维护者的电子邮件地址。

```shell
LABEL maintainer="159665552@qq.com"
```

WORKDIR

说明：设置工作目录。在构建镜像过程中，后续的任何操作都将在这个目录下进行。

```shell
WORKDIR /app
```

COPY

说明：将本地文件或目录复制到容器的文件系统中。这里的点（.）表示当前目录下的所有文件和子目录都会被复制到 /app 目录下。

```shell
COPY . /app/
```

RUN

说明：运行任意的合法 shell 命令。在这个例子中，将在容器内运行 npm install 命令来安装 Node.js 项目依赖。

```shell
RUN npm install
```

ENV

说明：设置环境变量。这将把 NODE_ENV 环境变量设置为 production，可以在容器内被其他命令引用。

```shell
ENV NODE_ENV=production
```

EXPOSE

说明：声明容器将监听的端口。虽然这并不意味着容器会实际监听该端口，但它告诉 Docker 客户端和其他容器此容器可能会监听哪个端口。

```shell
EXPOSE 8080
```

CMD

说明：提供默认的容器启动命令。当通过 docker run 启动容器时，如果没有指定任何命令，那么 Docker 将会使用 CMD 指令中定义的命令来启动容器。

```shell
CMD ["npm", "start"]
```

ENTRYPOINT

说明：指定容器启动时执行的不可变的命令。它可以与 CMD 结合使用，形成最终的命令。例如，ENTRYPOINT ["node"] CMD ["app.js"] 将组合成 node app.js。

```shell
ENTRYPOINT ["npm", "run"]
```

## GitHub Actions

>GitHub Actions 是 GitHub 提供的一种持续集成/持续部署（CI/CD）服务，允许你在 GitHub 中直接定义和执行自动化工作流程。这些工作流程可以对仓库中的事件（如 push、pull request 等）做出响应，并执行一系列预定义的任务，如构建、测试、打包、部署等。

### GitHub Actions 基础命令

1.工作流文件： 工作流文件通常存储在仓库的 .github/workflows 目录下，文件格式为 YAML.

2.on 事件： 定义触发工作流的条件，例如：

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

3.jobs： 定义一个或多个作业，每个作业可以运行在不同的环境中

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

```

4.steps： 每个作业由一系列步骤组成，这些步骤可以是 shell 命令、脚本或使用预构建的 Action：

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v2
  - name: Run tests
    run: |
      npm install
      npm test
```

5.环境变量： 可以在工作流中定义和使用环境变量：

```yaml
env:
  NODE_VERSION: '14.x'
```

6.uses： 引用 GitHub Marketplace 上的 Action，例如：

```yaml
- name: Setup Node.js environment
  uses: actions/setup-node@v2
  with:
    node-version: ${{ env.NODE_VERSION }}

```

7.with： 传递参数给 Action：

```yaml
- name: Publish package to NPM
  run: |
    npm publish
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

```

8.needs： 定义作业之间的依赖关系：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
  deploy:
    needs: build
    runs-on: ubuntu-latest

```

9.strategy： 在多个环境中并行运行作业：

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]

```

10.if 条件： 控制步骤是否执行：

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: |
    # deployment logic here


```

## 使用 Docker Compose 部署 nest 项目

### 编写 Dockerfile

Dockerfile 文件内容如下：

```Dockerfile

# 构建阶段
FROM node:20.0 AS build-stage

WORKDIR /app

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 安装 pnpm 并设置 pnpm 镜像源
RUN npm install -g pnpm \
    && pnpm config set registry https://registry.npmmirror.com/

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 使用 pnpm 安装依赖
RUN pnpm install

# 复制所有源代码并构建应用
COPY . .
RUN pnpm run build

# 生产阶段
FROM node:20 AS production-stage

WORKDIR /app

# 从构建阶段复制构建结果和依赖
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/config /app/config

# 暴露端口并启动应用
EXPOSE 3000
CMD ["node", "dist/main.js"]

```

**文件解释**
这段Dockerfile描述了一个典型的多阶段构建过程，用于构建和部署Node.js应用程序。下面是对每一部分的详细解释：

**构建阶段 (Build Stage)**
FROM node:20.0 AS build-stage

- 使用Node.js 20.0版本作为构建阶段的基础镜像。

WORKDIR /app

- 设置工作目录为/app。

设置 npm 镜像源

- 更改npm的默认注册表为<https://registry.npmmirror.com/，这有助于加速依赖包的下载。>

安装 pnpm 并设置 pnpm 镜像源

- 全局安装pnpm，并将其注册表也更改为<https://registry.npmmirror.com/。>

复制 package.json 和 pnpm-lock.yaml

- 将package.json和pnpm-lock.yaml文件复制到容器内的/app目录。

使用 pnpm 安装依赖

- 使用pnpm安装项目依赖。

复制所有源代码并构建应用

- 将项目的所有源代码复制到容器内。
运行pnpm run build命令来构建应用。

**生产阶段 (Production Stage)**
FROM node:20 AS production-stage

- 使用Node.js 20版本作为生产阶段的基础镜像。

从构建阶段复制构建结果和依赖

- 从构建阶段复制编译后的文件(dist)、依赖包(node_modules)以及配置文件(config)到生产阶段的容器内。

暴露端口并启动应用

- 暴露3000端口，这是应用监听的端口。
启动应用，使用node dist/main.js命令。

这种多阶段构建方法有以下优点：

>减小最终镜像的大小，因为构建阶段的临时文件不会被包含在最终的生产镜像中。
提高安全性，因为生产镜像只包含必要的文件和依赖，没有构建工具。
加快构建速度，因为构建阶段和生产阶段可以独立优化。

### 编写 docker-compose.yml

```yaml

version: '3'
# 定义服务，即需要运行的容器集合
services:
  nest-app:
    container_name: nest-app
    build:
      context: ./
      dockerfile: ./Dockerfile
    # 定义该服务所依赖的其他服务，它们将按照依赖顺序启动
    depends_on:
      - mysql-container
      - redis-container
    # 定义项目环境变量
    environment:
      - NODE_ENV=prod
    ports:
      - '3000:3000'
    networks:
      - common-network

  # 定义一个名为'mysql-container'的服务，使用mysql镜像
  mysql-container:
    container_name: mysql-container
    image: mysql
    restart: always
    ports:
      - '3306:3306'
    # 数据卷配置，用于持久化存储
    volumes:
      - /home/Unusual-server/mysql/log:/var/log
      - /home/Unusual-server/mysql/data:/var/lib/mysql
      # - /home/Unusual-server/mysql/conf.d:/ect/mysql/conf.d
      # 初始执行的SQL文件，可用于初始化数据库
      # - /home/Unusual-server/mysql/init:/docker-entrypoint-initdb.d/
    environment:
      MYSQL_DATABASE: us
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # 设置容器时区
      TZ: 'Asia/Shanghai'
    command: --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
    networks:
      - common-network

  # 定义一个名为'redis-container'的服务，使用redis镜像
  redis-container:
    container_name: redis-container
    image: redis
    # 初始配置密码
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]
    ports:
      - '6379:6379'
    # 数据卷配置，用于持久化存储
    volumes:
      - /home/Unusual-server/redis:/data
    networks:
      - common-network
# 创建网络桥
networks:
  common-network:
    driver: bridge

```

**文件解释**

这段 YAML 配置文件定义了一个 Docker Compose 环境，用于同时运行多个服务，包括一个基于 Nest.js 的应用 (nest-app)、一个 MySQL 数据库服务 (mysql-container) 和一个 Redis 缓存服务 (redis-container)。下面是每个服务的详细配置说明：

**Nest.js 应用 (nest-app)**

container_name: 容器名称为 nest-app。
build: 指定构建容器的上下文目录和 Dockerfile 文件路径。
depends_on: 依赖于 mysql-container 和 redis-container 服务，这意味着这两个服务会在 nest-app 启动前先启动。
environment: 设置环境变量 NODE_ENV 为 prod，表明应用处于生产环境。
ports: 映射宿主机的 3000 端口到容器的 3000 端口。
networks: 加入 common-network 网络，以便与其他服务通信。

**MySQL 数据库服务 (mysql-container)**

container_name: 容器名称为 mysql-container。
image: 使用官方的 MySQL 镜像。
restart: 设置容器重启策略为 always，保证容器在异常退出后自动重启。
ports: 映射宿主机的 3306 端口到容器的 3306 端口。
volumes: 使用数据卷挂载本地目录到容器，用于持久化日志和数据。
environment: 设置环境变量，包括数据库名、根密码和时区。
command: 设置服务器字符集和排序规则，以及默认时间戳行为。
networks: 加入 common-network 网络。

**Redis 缓存服务 (redis-container)**

container_name: 容器名称为 redis-container。
image: 使用官方的 Redis 镜像。
command: 设置 Redis 服务器需要密码认证。
ports: 映射宿主机的 6379 端口到容器的 6379 端口。
volumes: 使用数据卷挂载本地目录到容器，用于持久化数据。
networks: 加入 common-network 网络。

**网络配置 (networks)**

common-network: 定义一个名为 common-network 的网络，使用桥接驱动，允许服务间通信。

**注意事项**

在使用上述 Docker Compose 配置文件时，有几点需要注意：

**环境变量的使用**

1.在 environment 字段中直接定义环境变量：

就像 nest-app 中定义的环境变量。

```yaml
# 定义项目环境变量
environment:
  - NODE_ENV=prod

```

这个环境变量将会被注入到容器中，我们可以在内部代码中通过环境变量访问这些值，在nest 中可以使用下述方法获取。

```ts
const env = process.env.NODE_ENV
```

我这里这个环境变量用来获取不同环境下的配置文件

```ts
// yml.config.ts
// 获取环境变量
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV
export const getYmlConfig = (key?: string) => {
    const ymlInfo = yaml.load(
        readFileSync(join(process.cwd(), `config/${env}.yml`), 'utf-8'),
    ) as Record<string, any>;
    if (key) {
        return ymlInfo[key];
    }
    return ymlInfo;
};


```

2.使用.env文件：

在 docker-compose.yml 文件所在的目录下创建一个 .env 文件，并在其中定义环境变量，例如我们在 mysql-container 和 redis-container 容器中使用的两个环境变量：

```bash
# .env
MYSQL_ROOT_PASSWORD=xxxx
REDIS_PASSWORD=xxxx

```

然后在 docker-compose.yml 文件中引用这些变量：

```yaml
# docker-compose.yml
...mysql-container...
environment:
  MYSQL_DATABASE: us
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  # 设置容器时区
  TZ: 'Asia/Shanghai'
  
...redis-container...
# 初始配置密码
command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]

```

Docker Compose 会自动从 .env 文件中读取 DB_PASS 的值。

3.通过命令行参数传递：

在运行 docker-compose 命令时通过 -e 参数来设置环境变量，例如：

```bash
docker-compose up -d --build -e MYSQL_ROOT_PASSWORD=xxx REDIS_PASSWORD=xxx

```

4.使用环境变量文件：

除了 .env 文件，还可以使用任何其他文件来定义环境变量，只要在运行 docker-compose 命令时使用 -f 参数指定这个文件，例如：

```bash
docker-compose -f docker-compose.yml -f env-vars.yml up -d --build

```

其中 env-vars.yml 文件的内容类似于：

```yaml
version: '3'
x-environment:
 - DB_PASS=mysecretpassword

```

然后在 docker-compose.yml 文件中引用这些变量：

```yaml

services:
 web:
   image: my_web_app
   environment: *environment
```

注意这里的 *environment 是一个引用，它指向 x-environment 定义的变量列表。

**数据卷路径**

确保你指定了正确的数据卷路径，例如 /home/Unusual-server/mysql/log 和 /home/Unusual-server/redis。这些路径必须在宿主机上存在，否则数据卷将无法正常工作。如果这些目录不存在，需要提前创建它们。

**网络配置**

确保所有服务都加入了同一个网络 common-network，这样它们才能相互通信。如果网络配置错误，可能会导致服务间通信失败。

**配置文件修改**

在配置文件中需要把 mysql 和 redis 的 host 改成对应的容器名，已保证能够正确的访问服务。

```yaml
# 项目配置
APP:
  prefix: '/'
  port: 3000
  tokenTime: 3600  # token有效时间(单位秒)

# Swagger 配置
SWAGGER:
  prefix: '/api-docs'
  title: 'Unusual-Admin接口文档'
  description: '基于vue3+naive+nest的后台管理系统模板'
  version: '1.0.0'

# 数据库
MYSQL:
  type: mysql # 数据库链接类型
  host: "mysql-container" # 数据库地址
  port: 3306
  username: "xxx" # 数据库链接用户名
  password: "xxxx" # 数据库链接密码
  database: "xxx" # 数据库名
  logging: false # 数据库打印日志
  synchronize: false # 是否开启自动迁移，建议禁用，风险不可控
  autoLoadEntities: true # 是否自动加载实体
  keepConnectionAlive: true,

# 日志
LOG:
 level: 'info'
 on: true
 dir: 'logs'
 timestamp: true

# Redis
REDIS:
  host: 'redis-container' # Redis 服务器的主机名
  port: xxxx # Redis 服务器的端口
  password: 'xxxx' # 密码

# JWT
JWT:
  secret: 'Unusual-Admin'
  expiresIn: '7d'

# GITHUB
GITHUB:
  path: 'xxxxx' # github api地址
  Authorization: 'xxxxx' # github token
  timeout: 60000

```

## 编写 Github Actions

示例文件

下述是我自己的 deploy.yml 文件，通过 ssh 私钥连接服务器上传项目源代码和执行脚本文件，可以做一个参考

```yaml
# deploy.yml
name: Sync and Run Script on Server

on:
  push:
    branches:
      - master # 或者你想要触发同步的分支名

jobs:
  sync-and-run-script:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up SSH
      run: |
        mkdir -p ~/.ssh
        echo "${{ secrets.PASSWORD }}" > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts

    - name: Sync to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.PASSWORD }} # 使用 SSH 私钥
        source: "."
        target: "/home/Unusual-server/app"

    - name: Set script permissions
      run: |
        ssh -i ~/.ssh/id_rsa ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'chmod +x /home/Unusual-server/nest-setup.sh'

    - name: Execute script on server
      run: |
        ssh -i ~/.ssh/id_rsa ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'bash /home/Unusual-server/nest-setup.sh'


```

**文件解释**

1.`on:`  定义了触发此工作流程的事件。在这里，当master分支有新的推送时，工作流程将被触发。

2.`jobs:`  列出了工作流程中要执行的任务。在这个例子中，只有一个任务`sync-and-run-script`。

3.`runs-on: ubuntu-latest` 指定此任务将在GitHub Actions的Ubuntu最新版虚拟环境中运行。

4.`steps:`  定义了任务中的具体步骤：

- `Checkout code` 步骤使用`actions/checkout` action来检出当前仓库的代码。
  
- `Set up SSH` 步骤创建SSH密钥对，以便能够通过SSH连接到远程服务器。这里使用了存储在仓库Secrets中的私钥`（SSH_PRIVATE_KEY）`，并将其写入到`.ssh/id_rsa`文件中，然后更新`known_hosts`文件以信任目标主机。

- `Sync to server`· 步骤使用`appleboy/scp-action` action将本地仓库的内容同步到远程服务器上的指定目录。它使用了之前设置的SSH密钥进行身份验证。

- `Set script permissions` 步骤通过SSH连接到远程服务器，更改服务器上`nest-setup.sh`脚本的权限，使其可执行。
  
- `Execute script on server` 步骤同样通过SSH连接到远程服务器，执行`nest-setup.sh`脚本。

**注意事项**

1.使用 `Github` 的 `secrets` 存储用于 `Actions` 的敏感信息，防止泄密造成服务器被攻击。
2.`ssh` 权限和脚本的执行权限。

### 编写服务器脚本

  服务器的脚本文件就比较简单了，先复制配置文件到对应的地方，然后进入项目目录，执行 docker-compose 命令，把容器跑起来就可以了

```bash
#!/usr/bin/env bash

# 复制配置文件
cp /home/Unusual-server/config/prod.yml /home/Unusual-server/app/config;
cp /home/Unusual-server/config/.env /home/Unusual-server/app;
# 进入应用目录
cd /home/Unusual-server/app;

# 关闭容器
docker-compose stop;
# 删除容器
docker-compose down;
# 构建镜像
docker-compose build;
# 启动并后台运行
docker-compose up -d;
# 查看日志
# docker logs nest-app;
# 对空间进行自动清理
docker system prune -a -f

```

## 使用 Dockerfile 部署 Vue3 项目

>相对于后端来说，前端的自动部署就简单很多了，只需要在容器中集成下 nginx 就行，我这个案例没有域名配置相关的东西，如果需要后面在补充。

### 编写 Dockerfile

```Dockerfile
# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:latest

# 复制自定义的 nginx 配置文件到容器中
COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建的应用文件到 Nginx 的默认静态文件目录
COPY dist /usr/share/nginx/html

# 暴露容器的 8080 端口
EXPOSE 8080

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]

```

**文件解释**

1.`FROM nginx:latest:` 指定基础镜像是最新的Nginx官方镜像。这意味着镜像中已经包含了Nginx服务器。

2.`COPY nginx.conf /etc/nginx/nginx.conf:` 将本地目录下的nginx.conf文件复制到容器内的/etc/nginx/nginx.conf路径下，覆盖默认的Nginx配置文件。这样可以自定义Nginx的行为，例如设置静态文件目录、反向代理规则等。

3.`COPY dist /usr/share/nginx/html:` 将本地dist目录下的所有文件复制到容器内的/usr/share/nginx/html目录下。这通常是前端应用构建后输出的静态文件所在目录，Nginx会从这里读取静态资源。

4.`EXPOSE 8080:` 声明容器将监听8080端口。虽然这不会直接在宿主机上打开端口，但它告诉Docker和用户，该容器打算在8080端口上运行服务。

5.`CMD ["nginx", "-g", "daemon off;"]:` 设置容器启动时执行的命令。这里使用Nginx的命令行选项-g daemon off;来让Nginx在前台运行，而不是作为守护进程在后台运行。

**编写nginx.conf**
这里跟平常大家用的 nginx 配置基本上一样的，配置项目代理和接口代理即可，如果需要配置 https 证书和域名的就问下 AI，我的示例中没有这部分内容。

这里唯一的区别就是接口代理的地址由 <http://服务器ip:端口> 变成了 <http://后端容器名:端口>;

```nginx
user  nginx;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    gzip on;

    # 服务器配置
    server {
        listen       8080;
        server_name  xxxx; // 服务器ip

        # 根目录设置
        root   /usr/share/nginx/html;
        index index.html index.htm;

        # 默认位置设置
        location / {
            try_files $uri $uri/ /index.html =404;
        }
        # 处理 /api 路径的请求，将其代理到后台应用
        location /api {
            rewrite ^/api(.*) $1 break;
            proxy_pass http://nest-app:3000; # 替换为你的后台应用地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

    }
}

```

### 编写 Github Actions

>这里其实跟后端的那个差不多，只是把项目打包放在了 Actions 中执行，脚本执行也改成了直接执行 docker 命令

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 下载代码仓库
      - uses: actions/checkout@v2

      # 使用 action 库，安装 Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.17.0

      # 安装依赖并构建
      - name: Install and Build
        run: |
          npm install -g pnpm && \
          pnpm install --no-frozen-lockfile && \
          pnpm build

      # 使用ssh把文件同步到服务器
      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.5.3
        with:
            ssh-private-key: ${{ secrets.SSHPWD }}
        # 设置 known_hosts
      - name: Set up known hosts
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts

      - name: Sync files to server
        run: |
          # 使用 rsync 同步 dist 目录、Dockerfile 和 nginx.config 文件
          rsync -avz --delete ./dist ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/Unusual-Admin/
          rsync -avz --delete ./Dockerfile ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/Unusual-Admin/
          rsync -avz --delete ./nginx.conf ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/Unusual-Admin/

      - name: 构建 Docker 镜像
        run: |
          ssh ${{ secrets.USERNAME }}@${{ secrets.HOST }} 'docker build -t unusualapp:latest /home/Unusual-Admin/'

      - name: 部署 Docker 容器
        run: |
          ssh ${{ secrets.USERNAME }}@${{ secrets.HOST }} << 'EOF'
            docker stop unusualapp || true
            docker rm unusualapp || true
            docker run -d --name unusualapp -p 8080:8080 --network=app_common-network unusualapp:latest
          EOF


```

**注意事项**

docker 运行命令中的 --network=app_common-network 的 app_common-network 是之前在 nest 容器中使用的网络，需要指定相同的网络，容器之间才能正常通信。

可以使用 docker network ls 来查看容器拥有哪些网络。
