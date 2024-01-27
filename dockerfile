# 基于哪个镜像的基础上进行构建
FROM node:18.18.1-alpine
# 工作目录
WORKDIR /youmengyin

# 拷贝当前目录下的文件 到 /youmengyin 中 .dockerignore 文件中可以声明忽略拷贝的文件
COPY  . /youmengyin
COPY package.json ./
# 构建镜像时, 一般用于做一些系统配置, 安装必备的软件, 可有多个 RUN
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
RUN npm set registry  https://registry.npmmirror.com
RUN npm install  -g pnpm && \
    pnpm install --frozen-lockfile
COPY ..

RUN echo '开始build'
RUN pnpm run docs:build
RUN echo '---build 完成---'

FROM nginx:latest

RUN echo '拷贝dist到 nginx目录'
COPY --from=0 /youmengyin/dist /usr/share/nginx/html
COPY --from=0 /youmengyin/nginx.conf /etc/nginx/conf.d/default.conf
_# 暴露端口_
EXPOSE 5173

# 启动容器时, 只能有一个 CMD
# npx pm2 log  cmd 最后的命令是一个阻塞控制台的程序
# CMD echo $SERVER_NAME && echo $SERVER_NAME && npm run dev && npx pm2 log
# CMD [ "npm", "run", "dev" ]

# 环境变量
ENV SERVER_NAME='youmengyin-server'
ENV AUTHOR_NAME='mcwmengxi'
