

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



### 查阅命令帮助信息

man 、--help等

```bash
ls --help

man ls
```
>使用 man 时的操作键

| 操作键 | 功能           |
| ------ | -------------- |
| 空格   | 显示下一屏     |
| Enter  | 一次滚动一行   |
| b      | 回滚一屏       |
| f      | 前滚一屏       |
| q      | 退出           |
| /word  | 搜索word字符串 |

### 常用Linux命令的基本使用

|序号 | 命令 |	对应英文 |作用 |
| :----: | :------------: | :----: | :------------: |
|01 | ls |	list |	查看当前文件夹下的内容|
|02 | pwd |	print work directory |	查看当前所在文件夹|
|03 | cd[目录名] |	changge directory| 切换文件夹|
|04 | touch[文件名] |	touch |	如果文件不存在，新建文件|
|05 | mkdir[目录名] |	make | directory |
|06 | rm[文件名]	| remove | 删除指定文件|
|07 | clear |	clear| 清屏 |

### 查找文件find

`find [路径] -name “*.py”`
省略路径，表示在当前文件夹下查找, 可以使用通配符
```bash
find -name '/*.exe'
```

### 软链接

`ln -s 被链接的源文件 链接文件`
1. 建立文件的软链接，类似于 Windows 的快捷方式
2. 没有 -s 选项建立的是一个硬链接文件
3. 源文件要使用绝对路径，不能使用相对路径，这样可以方便移动链接文件后，仍然能够正常使用

### 打包 / 解包 压缩／解压缩

| 选项| 含义 |
| :-:|:---:|
| c|	生成档案文件，创建打包文件|
| x|	解开档案文件|
| v|	列出归档解档的详细过程，显示进度|
| f|	指定档案文件名称，f 后面一定是 .tar 文件，所以必须放选项最后|

**打包文件**

tar -cvf 打包文件.tar 被打包的文件／路径...

**解包文件**

tar -xvf 打包文件.tar

**gzip**

tar 与 gzip 命令结合可以使用实现文件 打包和压缩
tar 只负责打包文件，但不压缩
用 gzip 压缩 tar 打包后的文件，其扩展名一般用 xxx.tar.gz
在 tar 命令中有一个选项 -z 可以调用 gzip ，从而可以方便的实现压缩和解压缩

```bash
# 压缩文件
tar -zcvf 打包文件.tar.gz 被压缩的文件／路径...
# 解压缩文件
tar -zxvf 打包文件.tar.gz
# 解压缩到指定路径
tar -zxvf 打包文件.tar.gz -C 目标路径(要解压缩的目录必须存在)

```
**bzip2**

在 tar 命令中有一个选项 -j 可以调用 bzip2 ，从而可以方便的实现压缩和解压缩

```bash
# 压缩文件
tar -jcvf 打包文件.tar.bz2 被压缩的文件／路径...
# 解压缩文件
tar -jxvf 打包文件.tar.bz2

```

### apt 包管理工具

```bash
# 1. 安装软件
$ sudo apt install 软件包
# 2. 卸载软件
$ sudo apt remove 软件名
# 3. 更新已安装的包
$ sudo apt upgrade

```
## 文件和目录常用命令

### 查看目录内容 ls

**ls 常用选项**

| 参数 |                     含义                     |
| :--: | :------------------------------------------: |
|  -a  | 显示指定目录下所有子目录与文件，包括隐藏文件 |
|  -l  |         以列表方式显示文件的详细信息         |
|  -h  |      配合 -l 以人性化的方式显示文件大小      |

**ls通配符的使用**

| 通配符 |                 含义                 |
| :----: | :----------------------------------: |
|   *    |          代表任意个数个字符          |
|   ?    |     代表任意一个字符，至少 1 个      |
|   []   |    表示可以匹配字符组中的任一一个    |
| [abc]  |      匹配 a、b、c 中的任意一个       |
| [a-f]  | 匹配从 a 到 f 范围内的的任意一个字符 |

ps: 以 . 开头的文件为隐藏文件，需要用 -a 参数才能显示


### 切换目录 cd



| 命令 | 含义                                   |
| ---- | -------------------------------------- |
| cd   | 切换到当前用户的主目录(/home/用户目录) |
| cd ~ | 切换到当前用户的主目录(/home/用户目录) |
| cd . | 保持在当前目录不变                     |
| cd … | 切换到上级目录                         |
| cd - | 可以在最近两次工作目录之间来回切换     |

**相对路径和绝对路径**

- 相对路径 在输入路径时，最前面不是 / 或者 ~，表示相对 当前目录 所在的目录位置。
- 绝对路径 在输入路径时，最前面是 / 或者 ~，表示从 **根目录/home目录** 开始的具体目录位置



### 创建和删除操作

#### **touch**

- 创建文件或修改文件时间
  如果文件 不存在，可以创建一个空白文件
  如果文件 已经存在，可以修改文件的末次修改日期

#### **mkdir**

- 创建一个新的目录

| 选项 | 含义             |
| ---- | ---------------- |
| -p   | 可以递归创建目录 |

ps: 新建目录的名称 不能与当前目录中已有的目录或文件同名

#### **rm**

- 删除文件或目录
  使用 rm 命令要小心，因为文件删除后不能恢复

| 选项 | 含义                                                  |
| ---- | ----------------------------------------------------- |
| -f   | 强制删除，忽略不存在的文件，无需提示                  |
| -r   | 递归地删除目录下的内容，**删除文件夹 时必须加此参数** |

#### **拷贝和移动文件 cp mv**

| 序号 | 命令               | 对应英文 | 作用                                 |
| ---- | ------------------ | -------- | ------------------------------------ |
| 01   | tree [目录名]      | tree     | 以树状图列出文件目录结构             |
| 02   | cp 源文件目标文件  | copy     | 复制文件或者目录                     |
| 03   | mv 源文件 目标文件 | move     | 移动文件或者目录／文件或者目录重命名 |

#### **tree**

- tree 命令可以以树状图列出文件目录结构

| 选项 | 含义       |
| ---- | ---------- |
| -d   | 只显示目录 |

#### **cp**

- cp 命令的功能是将给出的 **文件 或 目录** 复制到另一个 **文件 或 目录** 中，相当DOS 下的 copy命令

| 选 项 | 含义                                                         |
| ----- | ------------------------------------------------------------ |
| -i    | 覆盖文件前提示                                               |
| -r    | 若给出的源文件是目录文件，则 cp 将递归复制该目录下的所有子目录和文件，目标文件必须为一个目录名 |

#### **mv**

- mv 命令可以用来 移动 文件 或 目录，也可以给 文件或目录重命名

| 选项 | 含义           |
| ---- | -------------- |
| -i   | 覆盖文件前提示 |



#### 查看文件内容

| 序 号 | 命令                 | 对应英文    | 作用                                                 |
| ----- | -------------------- | ----------- | ---------------------------------------------------- |
| 01    | cat 文件名           | concatenate | 查看文件内容、创建文件、文件合并、追加文件内容等功能 |
| 02    | more 文件名          | more        | 分屏显示文件内容                                     |
| 03    | grep 搜索文本 文件名 | grep        | 搜索文本文件内容                                     |

#### cat

cat 命令可以用来 查看文件内容、创建文件、文件合并、追加文件内容 等功能
cat 会一次显示所有的内容，适合 查看内容较少 的文本文件

| 选项 | 含义               |
| ---- | ------------------ |
| -b   | 对非空输出行编号   |
| -n   | 对输出的所有行编号 |

ps: Linux 中还有一个 nl 的命令和 cat -b 的效果等价

#### more

- more 命令可以用于分屏显示文件内容，每次只显示一页内容
- 适合于 查看内容较多的文本文件

| 操作键 | 功能                    |
| ------ | ----------------------- |
| 空格键 | 显示手册页的下一屏      |
| Enter  | 键 一次滚动手册页的一行 |
| b      | 回滚一屏                |
| f      | 前滚一屏                |
| q      | 退出                    |
| /word  | 搜索 word 字符串        |

#### grep

Linux 系统中 grep 命令是一种强大的文本搜索工具
grep 允许对文本文件进行 模式查找，所谓模式查找，又被称为正则表达式。

| 选项 | 含义                                     |
| ---- | ---------------------------------------- |
| -n   | 显示匹配行及行号                         |
| -v   | 显示不包含匹配文本的所有行（相当于求反） |
| -i   | 忽略大小写                               |

常用的两种模式查找

| 参数 | 含义                     |
| ---- | ------------------------ |
| ^a   | 行首，搜寻以 a 开头的行  |
| ke$  | 行尾，搜寻以 ke 结束的行 |

#### echo 文字内容

echo 会在终端中显示参数指定的文字，通常会和 重定向 联合使用

#### 重定向 > 和 >>

Linux 允许将命令执行结果 重定向到一个 文件
将本应显示在终端上的内容 输出／追加 到指定文件中
其中
\>表示输出，会覆盖文件原有的内容
\>>表示追加，会将内容追加到已有文件的末尾

#### 管道 |

Linux 允许将 一个命令的输出 可以通过管道做为另一个命令的输入
可以理解现实生活中的管子，管子的一头塞东西进去，另一头取出来，这里 | 的左右分为两端，左端塞东西（写），右端取东西（读）。

常用的管道命令有：

- more ：分屏显示内容
- grep ：在命令执行结果的基础上查询指定的文本
