## jenkins

### 全局工具配置
系统配置ssh 
![](https://img-blog.csdnimg.cn/6d39bb3bd74d4308b445263031d638ab.png)

全局工具配置 node.js

![](https://img-blog.csdnimg.cn/da190acdf86a457182ab51e7e8db6271.png)

### github相关配置

生成GitHub的token用于Jenkins

- 确认jenkins安装Github Plugin插件
在系统配置中设置github信息,选择add github server, 填写相关凭据即可
选择Sercet Text设置好GitHub Personal Access Token,测试验证是否连接成功
### 打包jenkins项目配置(configure)
>坑1、Repository URL地址报错，这里我们填入是项目吃 clone 地址，可以尝试Clone with SSH、Clone with HTTPS两个地址都尝试一下。

> 坑2、无法下拉选择配置的权限用户。直接点击 Add 添加一个权限用户以Username with password，直接用 GitHub的登录名称和命名创建。这个时候完成了就应该跳出下拉选项了；

填写github项目地址(项目url路径)
![](https://img-blog.csdnimg.cn/4c1d58a21a014a9a9922d32e0dbb2657.png)

git仓库管理,ssh方式报错了, 采用https方式, Credentials采用用户名+密码方式
![](https://img-blog.csdnimg.cn/25337fe4a0df4c81be3ca282247210f7.png)

指定master分支, 选择githubweb浏览器, url填写仓库地址https形式
![](https://img-blog.csdnimg.cn/e8b6d1e7064041439a6c4d5cd34310c5.png)

指定构建触发器: GitHub hook trigger for GITScm polling

指定构建环境: Use secret text(s) or file(s), 绑定选择secret text, 对应凭据选择用户名+私钥模式; 选择事先在全局工具中配置的node.js
构建shell,将编译产物打tar包，留作构建后操作使用
```shell
node -v &&
npm -v &&
pwd &&
npm install &&
npm run docs:build &&
tar -zcvf dist.tar ./dist
```
任务配置-构建后操作
将tar包放到服务器指定目录
解压tar包，将物料放置在nginx工作目录下
![](https://img-blog.csdnimg.cn/b4666a414e3141ae8ffeb62e51c7840d.png)

tar xvf youmengyin/dist.tar -C /home/webserver/static/youmengyin/dist/

- Jenkins build时有时候报Error fetching remote repo ‘origin’
直接清空工作空间, 将缓存清理掉。如果需要每次构建后都删除,可以直接在构建后选择清理工作空间

![](https://img-blog.csdnimg.cn/5095d534e6dd4657b6ee4e2b367480ce.png)

安装docker-compose
一个完整的应用程序，往往都不是一个容器组成的，而是通过容器组成一个容器群。一个容器群的搭建需要执行太多命令，更重要的是需要考虑太多应用和容器间的依赖关系处理，是一波令人头大的操作。docker-compose正是解决多个容器之间管理的问题。

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
curl 使用不了可以通过pip安装

```shell
yum -y install epel-release

// centos8中的pip 已升级为pip3

yum install python3-pip
pip3 install docker-compose
```

docker-compose -version 命令不存在的情况

```shell
cd /usr/local/bin/

wget https://github.com/docker/compose/releases/download/1.14.0-rc2/docker-compose-Linux-x86_64

rename docker-compose-Linux-x86_64 docker-compose docker-compose-Linux-x86_64

chmod +x /usr/local/bin/docker-compose
```

[root@luo home]# mkdir compose
[root@luo home]# mkdir jenkins
[root@luo home]# mkdir nginx

[root@luo home]# ls
compose  es  hilde  jenkins  lek  nginx

[root@luo home]# cd compose/
[root@luo compose]# touch docker-compose.yml
[root@luo compose]# cd ../nginx
[root@luo nginx]# mkdir conf.d

[root@luo nginx]# cd conf.d/
[root@luo conf.d]# touch nginx.conf
[root@luo conf.d]# vim nginx.conf 

[root@luo compose]# vim docker-compose.yml 

编写docker-compose.yml
```shell
version: '3'
services:                                      # 集合
  docker_jenkins:
    user: root                                 # 为了避免一些权限问题 在这我使用了root
    restart: always                            # 重启方式
    image: jenkins/jenkins:lts                 # 指定服务所使用的镜像 在这里我选择了 LTS (长期支持)
    container_name: jenkins                    # 容器名称
    ports:                                     # 对外暴露的端口定义
      - 8080:8080
      - 50000:50000
    volumes:                                   # 卷挂载路径
      - /home/jenkins/jenkins_home/:/var/jenkins_home  # 这是我们一开始创建的目录挂载到容器内的jenkins_home目录
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker                # 这是为了我们可以在容器内使用docker命令
      - /usr/local/bin/docker-compose:/usr/local/bin/docker-compose
  docker_nginx:
    restart: always
    image: nginx
    container_name: nginx
    ports:
      - 8090:80
      - 80:80
      - 433:433
    volumes:
      - /home/nginx/conf.d/:/etc/nginx/conf.d
      - /home/webserver/static/jenkins/dist/:/usr/share/nginx/html
```

现在新版的Jenkins容器在页面上重启的话 都会把容器停止掉而不重启 每次安装完插件后自己手工重启一下Jenkins容器

5ebde6b51761
docker exec -it jenkins/jenkins bash
```
docker run -d -u root --rm -p 9510:8080 --name jenkins -v jenkins-data:/var/jenkins_home jenkins/jenkins
```
1.首先使用ssh工具上传xz包到Linux的​​/usr/local​​目录：
xz -d node-v16.16.0-linux-x64.tar.xz 变成tar
2.使用docker命令复制到docker容器下指定的目录（注意容器是正在启动的）：
docker cp /usr/local/node-v16.16.0-linux-x64.tar jenkins:/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/node16
3.进入容器，查看:
docker exec -it jenkins bash

tar -xvf node-v16.16.0-linux-x64.tar

#nodejs
export PATH=/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/node16/node-v16.16.0-linux-x64/bin:PATH


npm config set registry https://registry.npmjs.org

![](https://img-blog.csdnimg.cn/a9a8119bc6354e4ea760ebb617a2c097.png)

content里添加`registry=https://registry.npmjs.org`