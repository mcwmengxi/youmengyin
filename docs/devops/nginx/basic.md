# nginx 部署

## 什么是nginx

Nginx (engine x) 是一个高性能的HTTP和反向代理web服务器

Nginx是一款轻量级的Web 服务器/反向代理服务器，处理高并发能力是十分强大的，并且支持热部署，启动简单，可以做到7*24不间断运行

## 正代和反代

## 安装nginx

```bash
# 1
yum install -y nginx

# 2
docker pull nginx:latest

docker run -itd --name nginx -p 80:80 nginx:latest

```

## 常用命令

```bash
# 开启服务
nginx

# 快速停止
nginx -s stop

# 有序停止
nginx -s quit

# 重启服务：
nginx -s reload

# 检查配置文件是否有语法操作
nginx -t

# 查看错误日志
tail -100f /var/log/nginx/error.log
```

## nginx.conf 配置

nginx默认配置文件

一般在/usr/local/nginx/conf/nginx.conf

nginx.conf由多个块组成，最外面的块是main，main包含Events和HTTP，HTTP包含upstream和多个Server，Server又包含多个location

```bash
user  nginx;  # 指定nginx进程的运行用户
worker_processes  auto; # 指定Nginx要开启的进程数，每个Nginx进程平均耗费10M~12M内存。建议指定和CPU的数量一致即可。

error_log  /var/log/nginx/error.log notice; # 用来定义全局错误日志文件。日志输出级别有debug、info、notice、warn、error、crit可供选择，其中，debug输出日志最为最详细，而crit输出日志最少。
pid        /var/run/nginx.pid; # 用来指定进程pid的存储文件位置


events {
    worker_connections  1024;  # 用于定义Nginx每个进程的最大连接数，默认是1024
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;   # 这里设定默认类型为二进制流，也就是当文件类型未定义时使用这种方式，例如在没有配置PHP环境时，Nginx是不予解析的，此时，用浏览器访问PHP文件就会出现下载窗口。

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on; # 用于开启高效文件传输模式。将tcp_nopush和tcp_nodelay两个指令设置为on用于防止网络阻塞；

    keepalive_timeout  65;  # 设置客户端连接保持活动的超时时间。在超过这个时间之后，服务器会关闭该连接；


    include /etc/nginx/conf.d/*.conf;  # 导入其他的配置文件，注意include所在的位置
}
```

main（全局设置）、server（主机设置）、upstream（负载均衡服务器设置）和 location（URL匹配特定位置的设置）。

- main块设置的指令将影响其他所有设置；
- server块的指令主要用于指定主机和端口；
- upstream指令主要用于负载均衡，设置一系列的后端服务器；
- location块用于匹配网页位置。

### localtion

>URL地址匹配是进行Nginx配置中最灵活的部分。 location支持正则表达式匹配，也支持条件判断匹配，用户可以通过location指令实现Nginx对动、静态网页进行过滤处理

### alias

Nginx中配置文件路径有两种方式，一种是root一种是alias

例如一个项目里面，有两个html文件要配置路由去访问

目录如下

```bash
/opt/nginx-study/html/
├── html1
├────── index.html
├── html2
└────── index.html

```

我想实现 访问127.0.0.1:80就是 访问html1下的index.html

访问127.0.0.1:80/xxx就是 访问html2下的index.html

如果按照root写法，会发现/xxx/怎么也到不了/html2那里

```nginx

server {
    listen 80;

    location / {
        root /opt/nginx_study/html/html1;
        index index.html;
    }
     location /xxx/ {
        alias /opt/nginx_study/html/html2/;  # 只会把/xxx/后面的路径拼接过来，需要以/结尾
        index index.html;
    }
}

```

### 域名配置

因为演示是在内网环境，没有真正的域名可以用

所以我们只能修改访问者的hosts文件，将上面三个域名执行到 目标服务器上

例如我现在的hosts文件

```bash
192.168.1.100 doc.inangong.top
192.168.1.100 news.inangong.top
192.168.1.100 video.inangong.top

```

然后配置nginx配置文件

```bash

server {
    listen 80;
    server_name doc.inangong.top;

    location / {
        root /opt/nginx_study/html/doc.inangong.top;
        index index.html;
    }
}
server {
    listen 80;
    server_name news.inangong.top;

    location / {
        root /opt/nginx_study/html/news.inangong.top;
        index index.html;
    }
}
server {
    listen 80;
    server_name video.inangong.top;

    location / {
        root /opt/nginx_study/html/video.inangong.top;
        index index.html;
    }
}


# 支持通配符 "*" 只能出现在首段或尾段
server {
    listen 80;
    server_name *.bolg.inangong.top;

    location / {
        root /opt/nginx_study/html/doc.inangong.top;
        index index.html;
    }
}
# 使用正则表达式
server {
    listen 80;
    server_name ~^(zhangsan)|(lisi)|(wangwu).bolg.inangong.top$;

    location / {
        root /opt/nginx_study/html/doc.inangong.top;
        index index.html;
    }
}
```

### 认证

>使用htpasswd生成特定的密码文件

```bash
yum install httpd-tools -y

htpasswd -c  /opt/nginx-study/auth/htpasswd  test

```

nginx**配置认证**

```nginx

server {
    listen 80;
    
    location / {
      # 开启功能模块，关闭为off
        auth_basic on;
        # 指定密码配置文件
        auth_basic_user_file /opt/nginx_study/auth/htpasswd;
        root /opt/nginx_study/html; # 根目录
        index index.html; # 默认显示的页面
    }

}
```

```bash
# curl访问需要添加auth信息
curl -u test:123456 http://127.0.0.1
```

### proxy_pass 反向代理

>针对特定的路由，代理到后端服务器上

配置proxy_pass

```nginx
server {
    listen 80;

    location /a1/ {  # 匹配/a1/开始，将/a1/之后的加到/之后
        proxy_pass http://127.0.0.1:8080/;
    }
    location /a2/ {   # 匹配/a2/开始，将匹配的路径加到/之后，直观感受就是把被匹配的路径加上了
        proxy_pass http://127.0.0.1:8080;
    }
    location /b1/ {
        proxy_pass http://127.0.0.1:8080/xxx/;
    }
    location /b2/ {
        proxy_pass http://127.0.0.1:8080/xxx;
    }
}
```

这里这个路径会有绝对路径和相对路径的说法

```bash
请求路径                              实际到后端的路径
/a1/                                     /
/a1/123                                  /123

/a2/                                     /a2/
/a2/123                                  /a2/123

/b1/                                     /xxx/
/b1/123                                  /xxx/123

/b2/                                     /xxx
/b2/123                                  /xxx123

```

#### 携带原始ip

这个时候，你会发现，我请求192.168.100.185这个服务器ip

但是在服务内部接收到的ip全是127.0.0.1，这是为什么呢

我们都知道，nginx的proxy就是代理，将源用户的请求代理到目标服务器上，也就是请求者变成了nginx

我们只需要将源请求的标识ip的特征，一起代理过去就行

主要配置一个特殊的请求头就可以了

```nginx
server {
    listen 80;
    # proxy_set_header X-Real-IP $remote_addr; # 加在这里也可以

    location /a1/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:8080/;
    }
}
```

## 负载均衡

>nginx应用场景之一就是负载均衡。在访问量较多的时候，可以通过负载均衡，将多个请求分摊到多台服务器上，相当于把一台服务器需要承担的负载量交给多台服务器处理，进而提高系统的吞吐率；另外如果其中某一台服务器挂掉，其他服务器还可以正常提供服务，以此来提高系统的可伸缩性与可靠性。

后端启动两个服务

```nginx
./main -addr 127.0.0.1:8080 -name s1
./main -addr 127.0.0.1:8081 -name s2
```

```nginx
upstream myapp1 {
  server 127.0.0.1:8080;
  server 127.0.0.1:8081;
}


server {
    listen 80;

    location /api/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://myapp1/;
    }
}
```

访问 服务器ip:80/api/, 会发现分别将请求打到不同的后端服务上了, 此时它们的权重是一样的,

### 权重模式
>
>nginx给我们提供了不同的权重模式

#### 轮询(Nginx自带、默认)

该策略是Nginx默认的负载均衡策略，每一个客户端请求按时间顺序轮流分配到不同的服务器上，如果后端服务不可以用，会自动过滤掉。

#### weight 权重(Nginx自带)

```nginx

upstream myapp1 {
  server 127.0.0.1:8080 weight=1;  # 打中的比例是 1/3
  server 127.0.0.1:8081 weight=2;  # 打中的比例是 2/3
}

```

#### ip_hash(Nginx自带)

>ip_hash是将每个请求按照访问ip的hash结果进行分配，这种方式可以保证同一个用户会固定访问一个后端服务器。优点：可以保证session会话，解决服务器之间session不能共享的问题。

```nginx
upstream myapp1 {
  ip_hash;
  server 127.0.0.1:8080;
  server 127.0.0.1:8081;
}


server {
    listen 80;

    location /api/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://myapp1/;
    }
}
```

#### least_conn(Nginx自带)

>将请求转发给连接数较少的后端服务器。每个后端服务器配置可能不同，处理的请求也有可能不同，对于处理的请求有快有慢，least_conn是根据后端服务器的连接情况，动态的选择连接数量较少的一台服务器来处理当前的请求。

```nginx
upstream myapp1 {
    least_conn;
  server 127.0.0.1:8080;
  server 127.0.0.1:8081;
}


server {
    listen 80;

    location /api/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://myapp1/;
    }
}

```

## nginx限制措施

### 黑名单

>nginx的黑名单功能可以直接在nginx层面拦截恶意ip，让它到不了后端服务

```nginx
server {
    listen 80;
#     deny 192.168.100.113;  # 可以放在 server块

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }

    location /yyy/ {
        deny 192.168.100.113; # 也可以放在location块中
        alias /opt/nginx_study/html/;
        index index.html;
    }
}
```

```bash
# black.conf
deny 192.168.100.113;

# nginx.conf
server {
    listen 80;

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }

    include /opt/nginx_study/black.conf;
}
```

### 白名单
>
>allow，一般和deny 连用

如下，只允许192.168.100.113访问，其他ip访问则被拒绝

```nginx
server {
    listen 80;

    allow 192.168.100.113;
    deny all;

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

### UA黑名单

>注意，这个map只能写在server的外面

```nginx
map $http_user_agent $bad_user_agent {
        default         0;
        ~*curl           1;
        ~*wget           1;
        ~*Unicornscan    1;
        ~*sqlmap         1;
        ~*nessus         1;
        ~*netsparker     1;
    }

server {
    listen 80;

     if ($bad_user_agent) {
        return 404;
    }

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

### Referer黑名单

```nginx
map $http_referer $bad_referer {
        default         0;
        ~*evil\.com     1;
        ~*xxx\.com      1;
        ~*yyy\.com      1;
    }

server {
    listen 80;

     if ($bad_referer) {
        return 404;
    }

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

### 请求频率黑名单

黑客可以通过发送大量请求来模拟各种攻击，在一定时间内发送的请求达到某个阈值后则会被判定为恶意请求。实现请求频率限制也是黑名单的一种应用场景

这是一分钟内请求5次的示例

```nginx
limit_req_zone $binary_remote_addr zone=perip:10m rate=5r/m;


server {
    listen 80;

    limit_req zone=perip burst=5 nodelay;

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

这是一秒钟内请求5次的示例

```nginx
limit_req_zone $binary_remote_addr zone=perip:10m rate=5r/s;


server {
    listen 80;

    limit_req zone=perip burst=10 nodelay;  # 最多可以处理10个并发请求

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

## https配置

### 自签名ssl证书

```bash
openssl genrsa -out private.key 2048
openssl req -new -key private.key  -out cert.csr
openssl x509 -req -in cert.csr -out cacert.pem -signkey private.key
```

配置nginx

```nginx
server {
    listen 443 ssl;
    ssl_certificate /opt/nginx_study/ssl/cacert.pem;  # pem的路径
    ssl_certificate_key /opt/nginx_study/ssl/private.key;  # key的路径

    location / {
        root /opt/nginx_study/html/;
        index index.html;
    }
}
```

浏览器访问 <https://127.0.0.1，因为是自签的，> 所以浏览器会提示不安全，正常的

### 云平台的ssl证书
>
>将key和pem文件放到服务器上

```nginx
server {
    listen 80;  # 将80的请求重定向到443上去
    server_name www.xxx.com;
    return 301 https://$server_name$request_uri; 
}

server {
    listen 443 ssl;
    ssl_certificate /www/server/nginx/www.xxx.com.pem;  # pem的路径
    ssl_certificate_key /www/server/nginx/www.xxx.com.key;  # key的路径
    server_name www.xxx.com;
    
    location / {
        uwsgi_pass   127.0.0.1:8000;  # 这个案例是uwsgi的案例
        include uwsgi_params;
     }
    
    location /static {
        alias  /www/wwwroot/flask_deploy/static;
    }
}
```

### gzip配置

这个配置也是不挑地方的

```nginx
server {
    listen 80;

    location / {
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        root /opt/nginx_study/html/;
        index index.html;
    }

     location /xxx/ {
        alias /opt/nginx_study/html/;
        index index.html;
    }
}
```
