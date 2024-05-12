# linux初体验

## 了解linux命令格式

linux命令的格式: command [-options] [parameter]

- command：命令,表示要执行的操作，可以是系统命令、自定义命令或别名等
- options：选项,用于指定命令的具体行为或修改其默认行为，通常以单个破折号 - 开头，可以有多个选项，也可以合并在一起
- parameter：参数,用于提供命令操作所需要的具体内容或数据，可以有多个参数，多个参数之间通常以空格分隔

其中[-options] , [parameter]是可选的

举例来说，ls -l /home 命令表示要列出 /home 目录下的文件和子目录，并以长格式显示其详细信息，其中ls是命令, -l 是选项，/home 是参数

## linux基础命令

```bash
# 后面逐个学习
ls   cd   pwd   mkdir   mv  rm  cat  which
find   grep   wc   echo  tail   vi/vim    
```

ls

| 方式        | 解释                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| ls          | 列出当前工作目录中的所有文件和子目录                                                |
| ls -a       | 列出当前工作目录中的所有文件和子目录，包括以.开头隐藏文件                           |
| ls -l       | 以长格式显示当前工作目录中的所有文件和子目录,命令格式也可以缩写为ll                 |
| ls -a -l -h | 以长格式并且人类可读的方式显示当前工作目录中的所有文件和子目录，包括以.开头隐藏文件 |

cd

pwd

mkdir

- -p：parents,递归创建目录，若父目录不存在则一同创建
- -m：mode,设置创建目录的权限模式

touch

cp

- -r ：recursive,递归复制整个目录树，用于复制目录
- -f：force,表示如果目标文件已经存在的话,则强制覆盖目标文件,不会提示用户是否覆盖目标文件

mv

- -r：recursive,递归移动，用于移动目录及其下的所有文件和子目录
- -f：force,强制覆盖目标文件或目录,不会提示用户是否覆盖目标文件

rm

- -r：recursive,递归删除，用于删除目录及其下的所有文件和子目录
- -f：force,强制删除文件或者目录，不进行任何提示

通配符有三种常见类型：

- 星号（*）：匹配零个或多个的任意字符。
- 问号（?）：匹配任意一个字符，不包括空字符。
- 中括号（[]）：匹配指定范围内的任意一个字符，也可以用于表示排除范围。

cat

- -n：number, 显示每行的行号；
- -E：show-ends, 在每行末尾显示 $ 符号；
- -b：number-nonblank, 仅对非空行显示行号；
- -s：squeeze-blank, 将多个空白行压缩成一个空白行。

扩展

1. more
2. less


which

用于查找并显示指定命令的绝对路径

## linux系统显示

**uname**

uname命令可以用来查看系统内核的信息

```bash
uname -a
Linux localhost.localdomain 3.10.0-1160.76.1.el7.x86_64 #1 SMP Wed Aug 10 16:21:17 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
# 该命令将显示系统的内核版本、主机名、操作系统类型等信息
```

hostnamectl

```bash
hostnamectl
   Static hostname: localhost.localdomain
         Icon name: computer-vm
           Chassis: vm
        Machine ID: c0f46089e2834f09801336a1bd501535
           Boot ID: da0850fcbf234c7d961bfa06e3d2988b
    Virtualization: kvm
  Operating System: CentOS Linux 7 (Core)
       CPE OS Name: cpe:/o:centos:centos:7
            Kernel: Linux 3.10.0-1160.76.1.el7.x86_64
      Architecture: x86-64
```

**date**

显示计算机当前时间

格式：date [参数] [+日期格式]

```bash
# 以年月日时分秒的格式输出
date "+%Y-%m-%d %H:%M:%S"
```

uptime

显示计算机已经启动了多长时间

```bash
uptime
 17:13:51 up 13 days, 20:38,  4 users,  load average: 0.03, 0.08, 0.13
  时间      运行了多长时间     当前登录用户数   过去1、5、15分钟内可用的系统负载的平均值
  
uptime -p   # 以人类可识别的方式输出系统从开机到到当前的运行时长
up 1 week, 6 days, 20 hours, 41 minutes

uptime -s  # 以yyyy-mm-dd HH:MM:SS格式输出系统的启动时间
2023-11-23 20:34:55
```

磁盘空间

df 以磁盘分区为单位查看文件系统，可以获取硬盘被占用了多少空间，目前还剩下多少空间等信息

```bash
df -h
文件系统                分区大小 已使用 剩余  使用率  挂载点
Filesystem               Size  Used Avail Use% Mounted on
devtmpfs                 9.6G     0  9.6G   0% /dev
tmpfs                    9.7G     0  9.7G   0% /dev/shm
tmpfs                    9.7G   18M  9.6G   1% /run
tmpfs                    9.7G     0  9.7G   0% /sys/fs/cgroup
/dev/mapper/centos-root   50G   34G   17G  67% /
/dev/vda2               1014M  149M  866M  15% /boot
/dev/mapper/centos-home  2.0T  122G  1.9T   7% /home
```

du 的英文原义为 disk usage，含义为显示磁盘空间的使用情况，用于查看当前目录的总大小

```bash
du -sh  # 查看当前目录的大小
274M    .
du -sh *  # 查看当前目录下每个文件的大小
136K    api
4.0K    cache
32K     config
```

一些参数解释

```bash
-s：对每个Names参数只给出占用的数据块总数。
-a：递归地显示指定目录中各文件及子目录中各文件占用的数据块数。若既不指定-s，也不指定-a，则只显示Names中的每一个目录及其中的各子目录所占的磁盘块数。
-b：以字节为单位列出磁盘空间使用情况（系统默认以k字节为单位）。
-k：以1024字节为单位列出磁盘空间使用情况。
-c：最后再加上一个总计（系统默认设置）。
-l：计算所有的文件大小，对硬链接文件，则计算多次。
-x：跳过在不同文件系统上的目录不予统计。
-h：以K，M，G为单位，提高信息的可读性
```

内存

free命令是一个用于查看系统内存使用情况的工具

```bash
free -h
            总内存大小      已使用      剩余大小   共享内存     缓存/缓冲区        
              total        used        free      shared  buff/cache   available
Mem:            19G        3.1G        8.9G         17M        7.2G         15G
Swap:          9.7G        2.0M        9.7G
```

## echo

"echo"是一个常用的Linux命令，可以用于向标准输出或文件写入一行或多行文本。通常用来输出一些提示信息或测试脚本的输出，也可以用于输出变量的值或执行命令的结果

echo [参数] [字符串]

-n：不自动换行，输出字符串后不跟随回车符。

-e：允许输出字符串中的转义字符，如“\n”表示换行符、“\t”表示制表符等。

```bash
>echo "Hello\nWorld"
Hello\nWorld
>echo -e "Hello\nWorld"
Hello
World
>name=枫枫
>echo $name
枫枫
```

## 网络状态

配置静态ip这些放到网络相关里面去，这里只学两个命令

ifconfig

如果没有这个，就安装 net-tools这个软件包

会看个ip，网卡就好了

```bash
>ifconfig
eth0: flags=4419<UP,BROADCAST,RUNNING,PROMISC,MULTICAST>  mtu 1500
        inet 192.168.200.11  netmask 255.255.255.0  broadcast 192.168.200.255
        inet6 fe80::a029:541e:d792:a14e  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:26:57:39  txqueuelen 1000  (Ethernet)
        RX packets 221161688  bytes 17046295072 (15.8 GiB)
        RX errors 0  dropped 212468  overruns 0  frame 0
        TX packets 219839840  bytes 20237354066 (18.8 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 1556  bytes 132774 (129.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1556  bytes 132774 (129.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

ip addr

```bash
>ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,PROMISC,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 52:54:00:26:57:39 brd ff:ff:ff:ff:ff:ff
    inet 192.168.200.11/24 brd 192.168.200.255 scope global noprefixroute ens3
       valid_lft forever preferred_lft forever
    inet6 fe80::a029:541e:d792:a14e/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

## 历史命令

history

```bash
history 10  # 显示最新执行的10条命令
history -d 1108  # 删除1108行的命令

!历史命令的行号  # 再次执行对应的命令
```

>history命令只会记录当前用户的命令历史，而不会记录其他用户执行的命令

>另外，历史命令默认只会保存最近执行的1000条命令


## 软件包管理

不同的发行版，这个命令是不一样的，这个需要注意

centos的软件包管理是 yum

Ubuntu的软件包管理是apt-get

```bash
yum install vim -y  # 安装vim软件
yum remove vim  # 卸载软件包 
```

yum源更新命令

```bash
yum clean all
yum makecache
yum update
```

换源

```bash
curl -o /etc/yum.repos.d/CentOS-Base.repo https://**mirrors**.aliyun.com/repo/Centos-7.repo
yum makecache
```

## 文件传输

**scp**

SCP命令是基于SSH协议的命令行工具，用于在不同操作系统之间快速、安全地传输文件。只需打开终端并输入SCP命令即可开始使用它

```bash
# 将当前主机的xx文件传输到目标主机的目标目录上去
scp 文件名称 root@目标主机:目标目录
# 将目标主机的文件下载到当前主机的xx目录
scp root@目标主机:目标目录 文件目录
```

一些常用的参数

```bash
-F：指定ssh配置文件
-i：identity_file 从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh
-o：指定使用的ssh选项
-P：指定远程主机的端口号
-p：保留文件的最后修改时间，最后访问时间和权限模式
-q：不显示复制进度
-r：以递归方式复制
```

## 重启，关机

```bash
# 关机
shutdown -h now
init 0​

# 重启
shutdown -r now
reboot
```

## 参考文档

linux常见基础命令 https://blog.csdn.net/tjfsuxyy/article/details/130609676

linux常用操作命令 https://blog.csdn.net/fuhanghang/article/details/128848825

windows向linux传文件 https://www.linuxprobe.com/wxlcwjkjjbcz.html

date时间 https://blog.csdn.net/weixin_43901998/article/details/126634560

uptime https://blog.csdn.net/z19861216/article/details/130881624

磁盘空间 https://www.linuxprobe.com/learn-how-to-2.html

free命令 https://blog.csdn.net/AnChenliang_1002/article/details/131465963

echo命令 https://baijiahao.baidu.com/s?id=1762535150936455782&wfr=spider&for=pc

ifconfig https://blog.csdn.net/jks212454/article/details/131208875

yum目录 https://blog.51cto.com/u_15867943/6165536

yum源配置 https://www.python100.com/html/61245.html

scp命令 https://www.lxlinux.net/3090.html

du命令 https://blog.csdn.net/AnChenliang_1002/article/details/131466834