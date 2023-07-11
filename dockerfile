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
