

容器没有vim环境,通过cat命令追加实现修改效果
我的是debian 11.x (bullseye),具体参见https://developer.aliyun.com/mirror/debian
```shell
cat >/etc/apt/sources.list <<EOF
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main
deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib
EOF
```

apt-get update

apt-get install -y vim

vim /etc/profile

```shell
#nodejs
export PATH=/var/jenkins_home/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/node16/node-v16.16.0-linux-x64/bin:PATH
```

刷新环境变量
source /etc/profile

验证
node -v npm -v


查看nginx目录
ps -ef | grep nginx 

### 防火墙
查看防火墙端口开放
`firewall-cmd --zone=public --list-ports`
`firewall-cmd --list-all`

开放端口

`firewall-cmd --zone=public --add-port=12360/tcp --permanent`
`firewall-cmd --remove-port=12350-12365/tcp --permanent`
`firewall-cmd --reload`

关闭防火墙

`systemctl stop firewalld.servic`
查看防火墙状态
`firewall-cmd --state`

查看监听的端口
`netstat -lnpt`
ps:centos7默认没有 netstat 命令，需要安装 net-tools 工具，`yum install -y net-tools`
检查端口被哪个进程占用
netstat -lnpt |grep 8888
查看进程的详细信息
ps 8888