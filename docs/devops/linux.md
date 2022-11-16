查看防火墙端口开放

`firewall-cmd --zone=public --list-ports`

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