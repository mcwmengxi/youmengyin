# linux常用命令速查表

## Linux常用命令清单

### **一、文件与目录操作 (File & Directory Management)**

日常使用中最频繁的一类命令

| 命令    | 功能描述                                           | 常用示例                                                     |
| ------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `ls`    | 列出目录内容 (list)。                              | `ls` (列出当前目录), `ls -l` (长格式), `ls -a` (显示隐藏文件) |
| `cd`    | 切换目录 (change directory)。                      | `cd /home/user`, `cd ..` (返回上一级), `cd ~` (返回家目录)   |
| `pwd`   | 显示当前工作目录的路径 (print working directory)。 | `pwd`                                                        |
| `mkdir` | 创建新目录 (make directory)。                      | `mkdir my_project`, `mkdir -p a/b/c` (递归创建)              |
| `rmdir` | 删除空目录 (remove directory)。                    | `rmdir empty_folder`                                         |
| `touch` | 创建空文件或更新文件时间戳。                       | `touch new_file.txt`                                         |
| `cp`    | 复制文件或目录 (copy)。                            | `cp source.txt dest.txt`, `cp -r source_dir/ dest_dir/`      |
| `mv`    | 移动或重命名文件/目录 (move)。                     | `mv old.txt new.txt` (重命名), `mv file.txt /tmp/` (移动)    |
| `rm`    | 删除文件或目录 (remove)。                          | `rm file.txt`, `rm -r directory/` (递归删除), `rm -rf dir/` (**慎用！**强制删除) |
| `find`  | 在文件系统中查找文件。                             | `find . -name "*.py"` (查找当前目录下的py文件)               |

### **二、文本文件查看与处理 (Viewing & Processing Text Files)**

在Linux中，一切皆文件。

| 命令   | 功能描述                                                 | 常用示例                                                     |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| `cat`  | 查看整个文件内容 (concatenate)。                         | `cat file.txt`                                               |
| `less` | 分页查看文件内容，功能比`more`强大。                     | `less large_file.log` (可用方向键滚动, `q`退出)              |
| `head` | 查看文件的前几行。                                       | `head -n 20 file.txt` (查看前20行)                           |
| `tail` | 查看文件的后几行。                                       | `tail -n 20 file.txt` (查看后20行), `tail -f app.log` (实时监控) |
| `grep` | 在文本中搜索匹配的行 (global regular expression print)。 | `grep "error" log.txt`, `cat file.txt \| grep "keyword"`      |
| `wc`   | 统计文件的行数、单词数、字符数 (word count)。            | `wc -l file.txt` (只统计行数)                                |
| `diff` | 比较两个文件的差异。                                     | `diff file1.txt file2.txt`                                   |

### **三、系统信息与监控 (System Information & Monitoring)**

故障排查和性能优化须知。

| 命令                | 功能描述                                    | 常用示例                                                     |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| `top` / `htop`      | 实时显示系统进程和资源占用情况。            | `top` (`htop`是`top`的彩色增强版，需安装)                    |
| `ps`                | 显示当前进程的快照 (process status)。       | `ps aux` (显示所有进程), `ps -ef \| grep "nginx"`             |
| `kill`              | 终止进程。                                  | `kill 12345` (终止PID为12345的进程), `kill -9 12345` (强制终止) |
| `df`                | 查看磁盘空间使用情况 (disk free)。          | `df -h` (以人类可读格式显示)                                 |
| `du`                | 查看文件或目录的磁盘占用大小 (disk usage)。 | `du -sh /path/to/dir` (查看目录总大小)                       |
| `free`              | 查看内存使用情况。                          | `free -h`                                                    |
| `uname`             | 显示系统内核信息。                          | `uname -a` (显示所有信息)                                    |
| `ifconfig` / `ip a` | 查看和配置网络接口。                        | `ip a` (新系统推荐)                                          |
| `ping`              | 测试网络连通性。                            | `ping google.com`                                            |

### **四、用户与权限管理 (User & Permission Management)**

多用户系统的权限管理须知。

| 命令     | 功能描述                                | 常用示例                                              |
| -------- | --------------------------------------- | ----------------------------------------------------- |
| `sudo`   | 以超级用户（root）权限执行命令。        | `sudo apt-get update`                                 |
| `su`     | 切换用户。                              | `su - username`                                       |
| `chmod`  | 修改文件或目录的权限 (change mode)。    | `chmod +x script.sh` (增加执行权限), `chmod 755 file` |
| `chown`  | 修改文件或目录的所有者 (change owner)。 | `sudo chown user:group file`                          |
| `whoami` | 显示当前登录的用户名。                  | `whoami`                                              |
| `passwd` | 修改用户密码。                          | `passwd`                                              |

### **五、软件安装与管理 (Software Installation & Management)**

不同的Linux发行版使用不同的包管理器。

| 命令 (Debian/Ubuntu)    | 命令 (CentOS/RHEL/Fedora) | 功能描述           |
| ----------------------- | ------------------------- | ------------------ |
| `apt-get update`        | `yum check-update`        | 更新软件包列表     |
| `apt-get upgrade`       | `yum upgrade`             | 升级所有已安装的包 |
| `apt-get install <pkg>` | `yum install <pkg>`       | 安装一个新软件包   |
| `apt-get remove <pkg>`  | `yum remove <pkg>`        | 卸载一个软件包     |
| `apt-cache search <kw>` | `yum search <kw>`         | 搜索软件包         |

### **六、压缩与解压 (Archiving & Compression)**

传输和备份文件须知。

| 命令              | 功能描述                        | 常用示例                                                     |
| ----------------- | ------------------------------- | ------------------------------------------------------------ |
| `tar`             | 打包和解包文件 (tape archive)。 | `tar -czvf archive.tar.gz dir/` (打包压缩), `tar -xzvf archive.tar.gz` (解压) |
| `zip` / `unzip`   | 创建和解压.zip文件。            | `zip -r archive.zip dir/`, `unzip archive.zip`               |
| `gzip` / `gunzip` | 压缩和解压.gz文件。             | `gzip file.txt` (生成file.txt.gz), `gunzip file.txt.gz`      |
