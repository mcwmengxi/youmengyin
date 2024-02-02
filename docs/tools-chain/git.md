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

## 基本操作
```bash
git init

## 跟踪文件｜将改动放入暂存区
# 当前目录下的所有，不包括.gitignore中的文件或目录
git add . 
# 指定目录
git add dirPath
# 指定文件
git add filePath
# 指定多个文件
git add file1Path file2Path

# 将改动从暂存区中移除
git restore filename

# 撤销工作区指定文件的修改
# 还原到最近的commit状态
git checkout filename

# 将暂存区的内容提交到本地仓库
git commit -m "you can diy here content"

# 查看工作区当前状态
git status

## 查看commit日志,提交历史
git log
# 带图像的查看
git log --graph

# 查看查看命令历史
git reflog

## 查看指定文件的改动了哪些
git diff filename
# 查看工作区指定的文件与版本库中最新的代码有何区别
git diff HEAD -- filename

## 回退到之前的commit
# tips：
# HEAD表示当前版本
# HEAD^表示前一版本
# HEAD^^表示前两个版本，依次类推
# 当前的修改不会丢弃
git reset HEAD^

# 丢弃当前的更改
git reset HEAD^ --hard

## 删除文件相关

# 从本地仓库中取回被删除的文件
git checkout filename
# 命令本质的作用就是用最新的commit中的文件替换当前的文件

# 从本地仓库中删除指定的文件
git rm filename
# 删除后需要commit过后才生效
git commit -m "del: delete a filename"
# 在commit之前想要恢复的话
# 第一步，先把修改弄到暂存区
git restore --staged filename
# 第二步，撤销暂存区的修改
git restore filename
```
## 分支管理

创建和切换

```shell
# 创建 dev 分支
git branch dev

# 切换到 dev 分支
git checkout dev

# 创建 dev 分支并切换到 dev 分支
git pull remoteName branchName

```

合并分支

```shell
# 先切换为 master 分支
git checkout master

# 合并分支 把 dev 分支合并到 master 分支
git merge dev

# 将合并的分支提交到仓库
git push

# 快速合并
# 将otherBranch分支合并到当前的分支
# 快速合并看不出来做过改动
git merge otherBranch
# 合并其它分支，将变动都放入暂存区，不合并commit
git merge otherBranch --squash
# 禁用快速合并
git merge --no-ff -m "commit msg" otherBranch
# 舍弃合并，尝试恢复到你运行合并前的状态
git merge --abort
```

**更改分支名**
>checkout 既可以切换分支又可以撤销修改，容易造成歧义，所以切换分支可以使用switch

```shell
# 修改本地分支名称：
git branch -m oldBranchName newBranchName

# 将改名后的本地分支推送到远程，并将本地分支与之关联
git push --set-upstream origin newBranchName

# 删除本地分支
git branch -d branchName

## switch
# 切换分支
git switch branchName
# 创建并切换
git switch -c newBranchName
```

**合并其它分支的某个commit到当前分支**
```bash
git cherry-pick commit_id
```

**变基**
>rebase操作可以把本地未push的分叉提交历史整理成直线

```bash
git rebase branchName


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

## 远程仓库

```shell

# 关联远程仓库
git remote add remoteName address
# remoteName 可以自行定义，可以关联多个远程仓库
# 一般主要的remote 使用 origin命名

# 只显示名称
git remote
# 显示远程仓库的地址
git remote -v

# 删除关联的远程仓库
git remote remove remoteName
# 重命名关联的远程仓库
git remote rename oldRemoteName newRemoteName

# 本地分支推到远程仓库
# 全写
git push remoteName localBranchName:remoteBranchName
# 简写(这种情况默认本地与远程分支名称一致)
git push remoteName branchName

```

**设置上游分支**

```shell
git push -u remoteName branchName 
# 设置上游分支后
# 本地在push的时候就可以直接执行
git push
# 等价于
git push remoteName branchName

# 克隆远程仓库到本地
git clone remoteAddress

## 更新本地的分支列表

# 更新所有的远程仓库的
git fetch -all
# 更新指定远程仓库
git fetch remoteName

# 拉取/合并远程的分支到本地
git pull remoteName branchName
```

## stash

>将工作区未提交的内容先存储起来

```bash
# flagName 用于标示每次的stash操作
git stash save flagName

# 查看贮藏的列表
git stash list

# 恢复贮藏的内容
git stash pop stash_id
# or
git stash apply stash_id
# stash_id通过git stash list 获取
# 区别
# pop会在恢复后删除指定的stash
# apply不会删除
```

## 标签

>给指定的commit打上一个标签，便于寻找关键的commit

```bash
# 默认为最新的commit打上tag
git tag v0.0.0
git tag youlikeText

# 为指定的commit 打上tag
git tag youlikeText commit_id
# commit_id通过git log获取

# 创建带有说明的标签
git tag -a tagName -m "description" comment_id
# 查看所有标签
git tag
# 将本地的tag提交到远程仓库
git push --tag
```
## 修改用户名和邮箱

输入命令：

```shell
git config --global user.name 'xxxxx'
git config --global user.email 'xxxxx@qq.com'
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


sourceTree无法使用
https://zhuanlan.zhihu.com/p/637566727

```bash
ERROR [2023-07-31 23:14:29,681] [1] [Sourcetree.Composition.VSMef.Net48.VSMefCompositionManager] [Log] - Unable to load MEF components
```
删除该目录下两个.cache文件 Composition.cache Assemblies.cache
`C:\Users\mengxi\AppData\Local\Atlassian\SourceTree.exe_Url_fop3hzd4ikr21gr5nqmqd4tnru2hl5kn\3.4.12.0`

git pull --tags origin master
git stash list
git stash apply stash@{0}
