# 个人博客

## 构建镜像（注意最后的点号）

```sh
docker build -t vitepress-blog:latest .
```

## 运行容器（映射宿主机 8080 端口到容器 80 端口）

```sh
docker run -d -p 8080:80 --name vitepress-app vitepress-blog:latest
```
