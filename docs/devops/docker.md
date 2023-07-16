# jenkins

查看jdk版本 `yum search java|grep jdk`



## Docker

### Docker概述

>由客户端、远程仓库、服务器组成

镜像image: 通过镜像可以快速创建容器

容器container: 通过容器独立运行一个组应用

仓库repository: 类似于git，用于存放镜像

## 安装docker


查看系统内核 `uname -r`

查看配置信息 	`cat /etc/os-release`
![](https://img-blog.csdnimg.cn/70190a5c7cf14099938e27f13ab47799.png)

```shell
// 移除docker旧的版本
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
                  
// 2.安装需要的工具包

yum install -y yum-utils

// 3.设置镜像仓库
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo # 默认是国外的
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo # 推荐使用阿里云的
// 4.安装docker包 docker-ce 社区版 ee企业版

 首先更新yum软件索引`yum makecache fast`
 
 `yum install docker-ce docker-ce-cli containerd.io`
 
验证docker安装成功` docker version`

启动`systemctl start docker`
```

 :rocket:运行`hello-world`镜像

![](https://img-blog.csdnimg.cn/2579e49de8944579b1f523da0e96fa6b.png)

查看镜像`docker images`

```shell
[root@luo /]# docker images
REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
redis           5         c5da061a611a   10 months ago   110MB
mysql           5.7       c20987f18b13   10 months ago   448MB
alpine          latest    c059bfaa849c   11 months ago   5.59MB
registry        2         b8604a3fe854   11 months ago   26.2MB
hello-world     latest    feb5d9fea6a5   13 months ago   13.3kB
mongo           4.2.5     fddee5bccba3   2 years ago     388MB
logstash        7.6.2     fa5b3b1e9757   2 years ago     813MB
elasticsearch   7.6.2     f29a1ee41030   2 years ago     791MB
rabbitmq        3.7.15    b3639fca0afd   3 years ago     149MB
nginx           1.10      0346349a1a64   5 years ago     182MB
```

卸载docker`yum remove docker-ce docker-ce-cli containerd.io docker-compose-plugin`

`rm -rf /var/lib/docker` docker默认工作路径

`rm -rf /var/lib/containerd`

### 阿里云镜像加速





![](https://img-blog.csdnimg.cn/9f25c969936a42f48fd6f74e61b1ca74.png)

配置加速

```shell
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://20jyns64.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload

sudo systemctl restart docker
```



安装Jenkins

`docker run -p 8080:8080 -p 50000:50000 -v jenkins_data:/var/jenkins_home jenkinsci/blueocean`

`docker run -d -u root --rm -p 9510:8080 --name jenkins -v jenkins-data:/var/jenkins_home jenkins/jenkins`

开放端口

```shell
firewall-cmd --query-port=9510/tcp
firewall-cmd --zone=public --add-port=9510/tcp --permanent
firewall-cmd --reload

http://101.132.70.183:9510/
de94d06957faad89826e58c8bbe263152a05a21debe60226660b10efdd0cf706
```



```shell
// 进入容器实例
docker exec -it jenkins bash
// 查看初始化密码
cat /var/jenkins_home/secrets/initialAdminPassword

不太熟悉，安装推荐插件
youmengxi *********
http://101.132.70.183:9510/
jenkins_token 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
```

### 常用命令
>后台启用容器

`docker run -d centos`
docker 容器使用后台启动，需要有一个前台应用，如果没有，docker就会自动停止运行

查看日志 
-t 日志加上时间
-f 保留打印窗口，持续打印
--tail 显示最后的几行
docker logs -tf --tail 10 [container_id]

查看容器进程信息
docker top [container_id]

查看镜像元数据
docker inspect [container_id]

### Windows Docker

setting -> Docker Engine -> apply & restart 配置镜像加速
``` json
{
  "debug": true,
  "experimental": false,
  "insecure-registries": [],
  "registry-mirrors": [
    "https://20jyns64.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}
```

#### 镜像image命令

如果 `docker images` 出现 REPOSITORY 是<none>的情况，可以先运行 `docker image prune` 删除
```shell
[root@docker01 ~]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
centos              latest              831691599b88        4 weeks ago         215MB
```
下载镜像： `docker pull <image-name>:<tag>`
查看所有镜像 `docker images`
删除镜像 `docker rmi <image-id>`
上传镜像 `docker push <username>/<repository>:<tag>`，要先注册 hub.docker.com


#### 容器命令：

docker run 【可选参数】 镜像名 启动镜像
#参数说明
–nane="Name”容器名字 tomcat01 tomcat02，用来区分容器
-d 后台方式运行
-it 使用交互方式运行，进入容器查看内容
-p 指定容器的端口，例：-p 8080:8080
-p（大写） ip:主机端口：容器端口
-p 主机端口：容器端口（常用）
-p 容器端口
容器端口
-P（小写） 随机指定端口

查看所有容器 `docker ps`，加 -a 显示隐藏的容器
停止容器 `docker stop <container-id>`
删除容器 `docker rm <container-id>` ，加 -f 是强制删除
查看容器信息，如 IP 地址 `docker inspect <container-id>`
查看容器日志 `docker logs <container-id>`
进入容器控制台 `docker exec -it <container-id> /bin/sh`

##### 启动一个Docker容器

拉取镜像 `docker pull nginx`
查看镜像 `docker images`
```shell
PS C:\Users\QSKJ-00330> docker images
REPOSITORY    TAG            IMAGE ID       CREATED         SIZE
youmengyin    latest         94def47346a5   2 months ago    395MB
node          16.16.0-slim   ee7e3b6dfb88   11 months ago   176MB
nginx         latest         605c77e624dd   18 months ago   141MB
hello-world   latest         feb5d9fea6a5   21 months ago   13.3kB
mysql         8.0.21         8e85dd5c3255   2 years ago     544MB
redis         6.0.6          1319b1eaa0b7   2 years ago     104MB
```

启动容器 `docker run -p 81:80 -d --name nginx-test nginx`, 返回容器id
查看容器列表 `docker ps`
```shell
PS C:\Users\QSKJ-00330> docker run -p 81:80 -d --name nginx-test nginx
0c96d41f0293b969ff41371e870a090979f19039df6c1d2a2fc898d29d385ed9
PS C:\Users\QSKJ-00330> docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                NAMES
0c96d41f0293   nginx     "/docker-entrypoint.…"   54 seconds ago   Up 52 seconds   0.0.0.0:81->80/tcp   nginx-test
```
主机验证nginx `http://localhost:81/`

查看容器信息 `docker inspect 9`

```shell
PS C:\Users\QSKJ-00330> docker inspect 0c96
[
    {
        "Id": "0c96d41f0293b969ff41371e870a090979f19039df6c1d2a2fc898d29d385ed9"
    }
]
```


查看容器日志 `docker logs 0c96`

```shell
PS C:\Users\QSKJ-00330> docker logs 0c96
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
```

进入容器控制台 `docker exec -it 0c96 /bin/sh`
`exit ` 退出控制台

停止容器 `docker stop 0c96`

删除容器
`docker ps -a` 查看所有容器(被停止的容器)
执行 `docker rm 0c96` 删除容器

文件映射 `docker run -p 81:80 -d -v E:/static:/usr/share/nginx/html --name nginx-test nginx`

#### Dockerfile

>.dockerignore忽略文件

```
node_modules
.git
logs
.history
.docker-volumes
```

>编写dockerfile构建文件

```dockerfile
# 基于哪个镜像的基础上进行构建
FROM node:16

# 工作目录
WORKDIR /youmengyin

# 拷贝当前目录下的文件 到 /youmengyin 中 .dockerignore 文件中可以声明忽略拷贝的文件
COPY  . /youmengyin

# 构建镜像时, 一般用于做一些系统配置, 安装必备的软件, 可有多个 RUN
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
RUN npm set registry  https://registry.npmmirror.com
RUN npm install

# 启动容器时, 只能有一个 CMD
# npx pm2 log  cmd 最后的命令是一个阻塞控制台的程序
CMD echo $SERVER_NAME && echo $SERVER_NAME && npm run dev && npx pm2 log

# 环境变量
ENV SERVER_NAME='youmengyin-server'
ENV AUTHOR_NAME='mcwmengxi'
```
- build 构建dockerfile构建镜像
- t test:v1 -t指定镜像名字 版本号
- . 指Dockerfile在当前目录下
`docker build -t <name> . ` . 指Dockerfile在当前目录下
`docker images` 查看结果

```bash
$ docker build -t youmengyin-server .
 => => naming to docker.io/library/youmengyin-server                                                                                                                                                                             
$ docker images
REPOSITORY          TAG            IMAGE ID       CREATED          SIZE
youmengyin-server   latest         5028425a672b   12 seconds ago   1.05GB
youmengyin          latest         94def47346a5   2 months ago     395MB
node                16.16.0-slim   ee7e3b6dfb88   11 months ago    176MB
nginx               latest         605c77e624dd   18 months ago    141MB
hello-world         latest         feb5d9fea6a5   21 months ago    13.3kB
mysql               8.0.21         8e85dd5c3255   2 years ago      544MB
redis               6.0.6          1319b1eaa0b7   2 years ago      104MB
```

启动容器验证
```bash
// 启动容器
docker run -p 8081:3000 -d --name youmengyin1 youmengyin-server
// 查看容器列表
docker ps
// 查看容器日志
docker logs 4b8
```

### 注意点

设置docker 开机自启
```shell
查看已经启动的服务 
systemctl list-units -lype=service

查看是否设置开机启动
systemctl ldit-unit-filed | grep enable

设置开机启动
systemctl enable docker.service

关闭开机启动
systemctl disable docker.service
```

设置docker容器自动启动
```shell
启动时加restart-always
docker run -tid -name 容器id -p 端口号 -restart-always -v 挂载

已经启用的项目 使用update更新
docker update --restart = always 容器id
```

restart可选项
- no 不自动重启容器 默认
- on-failure 容器发生错误而退出（容器退出状态不为0）重启容器
- unless-stopped 在容器已经stop或docker stop/restart的时候重启容器
- always 在容器已经stop或docker stop/restart的时候重启容器

常用命令
```shell
docker ps 查看当前运行中的容器
docker images 查看镜像列表
docker rm container-id 删除指定 id 的容器
docker stop/start container-id 停止/启动指定 id 的容器
docker rmi image-id 删除指定镜像
docker volume ls 查看volume列表
docker network ls 查看网络列表
```