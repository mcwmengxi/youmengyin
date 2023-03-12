# Git 基础知识

## 常用命令

| 命令                      | 简要说明                      |
| ------------------------- | ----------------------------- |
| git clone 仓库地址        | 克隆版本库                    |
| git status                | 查看状态                      |
| git add .                 | 添加至暂存区                  |
| git commit -m '说明'      | 提交并添加说明                |
| git push -u origin master | 推送至远程仓库 master 分支    |
| git branch -a             | 列出所有分支                  |
| git branch dev            | 创建 dev 分支                 |
| git checkout dev          | 切换到 dev 分支               |
| git merge dev             | 把 dev 分支合并到 master 分支 |
| git branch -d dev         | 删除 dev 分支                 |
| git pull origin master    | 同步分支到本地                |
| git reset --hard 版本号   | 获取历史版本                  |
| git remote add origin xxx | 关联远程仓库                  |

## 分支管理

创建和切换

```shell
# 创建 dev 分支
git branch dev

# 切换到 dev 分支
git checkout dev
```

合并分支

```shell
# 先切换为 master 分支
git checkout master

# 合并分支 把 dev 分支合并到 master 分支
git merge dev

# 将合并的分支提交到仓库
git push
```

## 回溯版本

查看 `commit hash` 值

```shell
git reflog
```

回溯版本

```shell
git reset --hard xxxx
```

回溯命令

```shell
git push -f
```

## 配置 Git SSH Key

命令行输入：

```shell
ssh-keygen -t rsa -b 4096 -C "邮箱"
```

连续敲击 3 次回车，即可 `/c/Users/` 当前用户` /.ssh/` 目录中生成 `id_rsa` 和 `id_rsa.pub` 两个文件

## 关联存储库

```shell
git init

git remote add origin xxxxx
```

## 修改用户名和邮箱

输入命令：

```shell
git config --global user.name 'xxxxx'
git config --global user.email 'xxxxx@qq.com'
```

## 更改分支名

修改本地分支名称：

```shell
git branch -m oldBranchName newBranchName
```

将改名后的本地分支推送到远程，并将本地分支与之关联

```shell
git push --set-upstream origin newBranchName
```


## 合并两个没有共同历史提交记录的分支

某个git仓库原有master分支，后面自己本地新建了一个项目，然后把新建的这个推到了这个仓库的另外一个分支temp

>直接合并报错`fatal: refusing to merge unrelated histories`

**解决方案**：采用git rebase --onto变基的方法

1.先从master上拉出一个新的分支dev进行操作,并推到远程

`git checkout -b dev`

`git push --set-upstream origin dev` //推送并关联远程分支

2.执行`git rebase --onto temp`进行变基操作
![](https://img-blog.csdnimg.cn/32c39134241b44d9bfa92adcc67dea45.png)



3.在该分支上拉取允许不相关历史的操作,然后手动解决冲突

`git pull --allow-unrelated-histories`

![](https://img-blog.csdnimg.cn/e8ec89309aaf4844a74889efab64fde6.png)

4.解决冲突，提交推送到远程



npm config set registry http://registry.npmmirror.com

https://registry.npmjs.org

**ssh**

` ssh-keygen -t ed25519 -C "1395568275@qq.com" -f ~/.ssh/id_ed25519_mcwmengxi`

config
```
# github
Host github.com
HostName ssh.github.com
User mcwmengxi
IdentityFile ~/.ssh/id_ed25519_mcwmengxi
PreferredAuthentications publickey
Port 443


```
sourcetree添加ssh秘钥
`ssh -T git@github.com`


解除ssh验证

git config --global http.sslVerify false


## 用户账号管理
>如果在项目自己的配置文件中已经有了用户名的配置，则优先使用项目自己的配置。如果项目没有单独配置，则再根据当前根路径是否指定了配置文件去获取对应的配置信息


**管理同一目录下的配置**

目录下建立.gitconfig
```bash
[user]
  name = mcwmengxi
  email = 1395568275@qq.com
```

修改git的全局配置文件.gitconfig,把当前目录添加全局配置文件中
```bash
[includeIf "gitdir:D:/project/"]
        path = D:/project/.gitconfig
```

**单独配置项目用户名**

git config user.name mcwmengxi 
git config user.email 1395568275@qq.com 

## git代理

.gitconfig文件开启代理,访问github,git仓库走ssh
```
[http]
  proxy = http://127.0.0.1:26501
  sslverify = false # 禁用 SSL 安全证书检查
```
