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
