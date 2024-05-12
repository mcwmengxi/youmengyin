## 搭建环境

docker中安装

```dockerfile
# 指定基础镜像
FROM centos:7
# 配置环境变量和本地软件

# 安装ssh
RUN yum -y install wget
RUN rm -rf /etc/yum.repos.d/*
RUN wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
RUN yum clean all
RUN yum install -y openssh-server sudo
RUN sed -i 's/UsePAM yes/UsePAM no/g' /etc/ssh/sshd_config
RUN echo "root:root" | chpasswd
RUN ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key
RUN ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key
RUN mkdir /var/run/sshd

# 暴露端口
EXPOSE 22
# 入口
CMD ["/usr/sbin/sshd", "-D"]

# 构建
# docker build -t centos7-ssh .
# docker run -itd --name centos -p 2222:22 centos7-ssh
# 连接ssh
# ssh root@127.0.0.1 -p 2222 # 默认密码是root
```
