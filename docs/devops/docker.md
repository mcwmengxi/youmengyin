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