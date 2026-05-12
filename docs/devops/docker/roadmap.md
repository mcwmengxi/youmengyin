# Docker 学习路线

> 从零基础到生产实践，系统化掌握 Docker 容器技术

---

## 📌 学习路线总览

```
阶段一：基础入门 ──→ 阶段二：核心进阶 ──→ 阶段三：编排与部署 ──→ 阶段四：生产实践
  概念/安装/命令       镜像/网络/存储       Compose/Swarm        安全/优化/CI/CD
```

---

## 阶段一：基础入门

### 1.1 理解容器化思想

- 为什么需要容器？虚拟机 vs 容器的区别
- 容器化核心价值：环境一致性、快速部署、资源隔离
- Docker 的三大核心概念：镜像（Image）、容器（Container）、仓库（Repository）

> 📖 参考笔记：[docker.md - Docker 概述](docker.md)

### 1.2 Docker 安装与配置

- Linux（CentOS/Ubuntu）安装 Docker Engine
- macOS / Windows 安装 Docker Desktop
- 配置镜像加速器（阿里云、中科大等）
- 建立 Docker 用户组，避免每次使用 sudo
- 验证安装：`docker version`、`docker run hello-world`

> 📖 参考笔记：[docker.md - 安装 docker](docker.md)

### 1.3 Docker 常用命令

| 分类 | 命令                           | 说明                 |
| ---- | ------------------------------ | -------------------- |
| 镜像 | `docker pull`                  | 拉取镜像             |
| 镜像 | `docker images`                | 列出本地镜像         |
| 镜像 | `docker rmi`                   | 删除镜像             |
| 容器 | `docker run`                   | 创建并运行容器       |
| 容器 | `docker ps` / `docker ps -a`   | 查看运行中/所有容器  |
| 容器 | `docker stop` / `docker start` | 停止/启动容器        |
| 容器 | `docker rm`                    | 删除容器             |
| 容器 | `docker exec -it`              | 进入容器内部         |
| 系统 | `docker info`                  | 查看 Docker 系统信息 |
| 系统 | `docker system prune`          | 清理无用资源         |

> 📖 参考笔记：[basic.md - Docker 常用命令](basic.md)

---

## 阶段二：核心进阶

### 2.1 Docker 镜像深入

- 镜像分层原理（Union File System / OverlayFS）
- 镜像的获取方式：仓库拉取、Dockerfile 构建、导入导出
- `docker save` / `docker load` 镜像迁移
- `docker tag` 镜像标签管理
- `docker push` 推送镜像到仓库
- Docker Hub 与私有仓库（Registry）的使用

### 2.2 Dockerfile 编写

Dockerfile 是构建镜像的核心，必须掌握以下指令：

| 指令           | 说明               |
| -------------- | ------------------ |
| `FROM`         | 基础镜像           |
| `RUN`          | 执行命令（构建时） |
| `COPY` / `ADD` | 复制文件到镜像     |
| `WORKDIR`      | 设置工作目录       |
| `ENV`          | 设置环境变量       |
| `EXPOSE`       | 声明暴露端口       |
| `CMD`          | 容器启动默认命令   |
| `ENTRYPOINT`   | 容器入口点         |
| `VOLUME`       | 声明数据卷         |
| `ARG`          | 构建参数           |
| `LABEL`        | 镜像元数据         |

**Dockerfile 最佳实践：**

- 使用多阶段构建（multi-stage build）减小镜像体积
- 合并 `RUN` 指令减少镜像层数
- 合理利用构建缓存，将变化少的指令放前面
- 使用 `.dockerignore` 排除不需要的文件
- 选择精简基础镜像（如 `alpine`、`slim`）

> 📖 参考笔记：[basic.md - .dockerignore 文件](basic.md)

### 2.3 Docker 网络

- 网络模式：bridge（默认）、host、none、overlay、macvlan
- 自定义网络创建与容器互联
- 端口映射：`-p` 参数的使用
- 容器间通信：`--link`（已弃用）与自定义网络
- DNS 解析与容器名访问

```bash
docker network create my-net
docker run --network my-net --name app1 ...
docker run --network my-net --name app2 ...
# app2 可通过容器名 app1 直接访问
```

### 2.4 Docker 数据管理

- **Volume（数据卷）**：Docker 管理的持久化存储
- **Bind Mount（绑定挂载）**：挂载宿主机指定目录
- **tmpfs Mount**：内存存储，容器停止即消失

```bash
docker volume create mydata
docker run -v mydata:/app/data ...
docker run -v /host/path:/container/path ...
```

- 数据卷的备份与恢复
- 数据卷容器模式

---

## 阶段三：编排与部署

### 3.1 Docker Compose

Docker Compose 用于定义和运行多容器应用，是单机编排的核心工具。

**核心文件 `docker-compose.yml`：**

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - '8080:80'
    depends_on:
      - db
    networks:
      - app-net

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-net

volumes:
  db-data:

networks:
  app-net:
    driver: bridge
```

**常用命令：**

| 命令                     | 说明                     |
| ------------------------ | ------------------------ |
| `docker-compose up -d`   | 后台启动所有服务         |
| `docker-compose down`    | 停止并移除容器、网络、卷 |
| `docker-compose ps`      | 查看服务状态             |
| `docker-compose logs`    | 查看日志                 |
| `docker-compose exec`    | 在容器内执行命令         |
| `docker-compose build`   | 构建镜像                 |
| `docker-compose restart` | 重启服务                 |
| `docker-compose config`  | 校验配置文件语法         |

> 📖 参考笔记：[docker-compose.md](docker-compose.md)、[basic.md - Docker Compose](basic.md)

### 3.2 Docker Swarm

Docker 原生集群编排工具：

- 初始化 Swarm 集群：`docker swarm init`
- 加入工作节点：`docker swarm join`
- 服务部署：`docker service create`
- 服务扩缩容：`docker service scale`
- 滚动更新：`docker service update`
- Stack 部署：`docker stack deploy`

### 3.3 Kubernetes 入门（扩展）

当应用规模超出单机范围，Kubernetes 是容器编排的行业标准：

- Pod、Service、Deployment 核心概念
- kubectl 命令行工具
- 从 Docker Compose 迁移到 Kubernetes（Kompose 工具）
- Helm 包管理

> 📖 详细学习笔记：[kubernetes.md](kubernetes.md)

---

## 阶段四：生产实践

### 4.1 Docker 安全

- 最小权限原则：非 root 用户运行容器
- 镜像安全扫描：`docker scout`、Trivy
- 限制容器资源：`--cpus`、`--memory`
- 只读文件系统：`--read-only`
- 使用 `--security-opt` 加固容器

### 4.2 镜像优化

- 多阶段构建减小最终镜像体积
- 选择精简基础镜像（`alpine`、`distroless`、`slim`）
- 清理构建缓存：`rm -rf /var/cache/apk/*`
- 镜像瘦身工具：`docker-slim`
- 合理利用 `.dockerignore`

### 4.3 日志与监控

- 日志驱动配置：`json-file`、`syslog`、`fluentd`
- 限制日志大小：`--log-opt max-size`、`--log-opt max-file`
- Prometheus + Grafana 监控容器指标
- cAdvisor 容器监控

### 4.4 CI/CD 集成

- Jenkins + Docker 构建流水线
- GitHub Actions 容器化构建
- 镜像版本管理策略（语义化版本、Git SHA 标签）
- 蓝绿部署与滚动更新

---

## 📚 推荐学习资源

| 资源                                                               | 说明                   |
| ------------------------------------------------------------------ | ---------------------- |
| [Docker 官方文档](https://docs.docker.com/)                        | 最权威的参考手册       |
| [Docker — 从入门到实践](https://yeasy.gitbook.io/docker_practice/) | 中文开源书籍，强烈推荐 |
| [Play with Docker](https://labs.play-with-docker.com/)             | 在线 Docker 实验环境   |
| [Docker Hub](https://hub.docker.com/)                              | 官方镜像仓库           |

---

## ✅ 学习检查清单

- [ ] 理解容器与虚拟机的区别
- [ ] 完成 Docker 安装与镜像加速配置
- [ ] 掌握镜像、容器、仓库的基本操作命令
- [ ] 能独立编写 Dockerfile 构建应用镜像
- [ ] 理解 Docker 网络模型，能配置容器互联
- [ ] 掌握数据卷的使用，理解持久化存储
- [ ] 能使用 Docker Compose 编排多容器应用
- [ ] 了解 Docker Swarm 集群部署
- [ ] 掌握镜像优化与安全最佳实践
- [ ] 能将 Docker 集成到 CI/CD 流水线
