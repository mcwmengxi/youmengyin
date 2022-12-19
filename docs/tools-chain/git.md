

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
