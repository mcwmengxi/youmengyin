# docker部署go项目

使用docker部署go项目有一个通用的范式,那就是分阶段构建

## 分阶段构建

go的部署只需要编译后的可执行文件就可以了，并不需要go的环境

那么我们可以先在有go环境的容器中对项目进行构建，得到构建后的可执行文件

然后再把这个可执行文件放到一个比较小的镜像容器里面
