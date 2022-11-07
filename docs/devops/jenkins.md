## jenkins

### github相关配置

生成GitHub的token用于Jenkins

- 确认jenkins安装Github Plugin插件
在系统配置中设置github信息,选择add github server, 填写相关凭据即可
选择Sercet Text设置好GitHub Personal Access Token,测试验证是否连接成功
### 打包jenkins项目配置(configure)
>坑1、Repository URL地址报错，这里我们填入是项目吃 clone 地址，可以尝试Clone with SSH、Clone with HTTPS两个地址都尝试一下。

> 坑2、无法下拉选择配置的权限用户。直接点击 Add 添加一个权限用户以Username with password，直接用 GitHub的登录名称和命名创建。这个时候完成了就应该跳出下拉选项了；

填写github项目地址(项目url路径)
![](https://img-blog.csdnimg.cn/4c1d58a21a014a9a9922d32e0dbb2657.png)

git仓库管理,ssh方式报错了, 采用https方式, Credentials采用用户名+密码方式
![](https://img-blog.csdnimg.cn/25337fe4a0df4c81be3ca282247210f7.png)

指定master分支, 选择githubweb浏览器, url填写仓库地址https形式
![](https://img-blog.csdnimg.cn/e8b6d1e7064041439a6c4d5cd34310c5.png)

指定构建触发器: GitHub hook trigger for GITScm polling

指定构建环境: Use secret text(s) or file(s), 绑定选择secret text, 对应凭据选择用户名+私钥模式

构建shell

- Jenkins build时有时候报Error fetching remote repo ‘origin’
直接清空工作空间, 将缓存清理掉。如果需要每次构建后都删除,可以直接在构建后选择清理工作空间

![](https://img-blog.csdnimg.cn/5095d534e6dd4657b6ee4e2b367480ce.png)
