import{_ as s,c as a,o as i,V as e,m as n}from"./chunks/framework.YX7VVfbY.js";const m=JSON.parse('{"title":"Git 基础知识","description":"","frontmatter":{},"headers":[],"relativePath":"docs/tools-chain/git.md","filePath":"docs/tools-chain/git.md","lastUpdated":1706517028000}'),t={name:"docs/tools-chain/git.md"},l=e(`<h1 id="git-基础知识" tabindex="-1">Git 基础知识 <a class="header-anchor" href="#git-基础知识" aria-label="Permalink to &quot;Git 基础知识&quot;">​</a></h1><h2 id="常用命令" tabindex="-1">常用命令 <a class="header-anchor" href="#常用命令" aria-label="Permalink to &quot;常用命令&quot;">​</a></h2><table><thead><tr><th>命令</th><th>简要说明</th></tr></thead><tbody><tr><td>git clone 仓库地址</td><td>克隆版本库</td></tr><tr><td>git status</td><td>查看状态</td></tr><tr><td>git add .</td><td>添加至暂存区</td></tr><tr><td>git commit -m &#39;说明&#39;</td><td>提交并添加说明</td></tr><tr><td>git push -u origin master</td><td>推送至远程仓库 master 分支</td></tr><tr><td>git branch -a</td><td>列出所有分支</td></tr><tr><td>git branch dev</td><td>创建 dev 分支</td></tr><tr><td>git checkout dev</td><td>切换到 dev 分支</td></tr><tr><td>git merge dev</td><td>把 dev 分支合并到 master 分支</td></tr><tr><td>git branch -d dev</td><td>删除 dev 分支</td></tr><tr><td>git pull origin master</td><td>同步分支到本地</td></tr><tr><td>git reset --hard 版本号</td><td>获取历史版本</td></tr><tr><td>git remote add origin xxx</td><td>关联远程仓库</td></tr></tbody></table><h2 id="分支管理" tabindex="-1">分支管理 <a class="header-anchor" href="#分支管理" aria-label="Permalink to &quot;分支管理&quot;">​</a></h2><p>创建和切换</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 创建 dev 分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> branch dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换到 dev 分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout dev</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>合并分支</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 先切换为 master 分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> checkout master</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 合并分支 把 dev 分支合并到 master 分支</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> merge dev</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 将合并的分支提交到仓库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="回溯版本" tabindex="-1">回溯版本 <a class="header-anchor" href="#回溯版本" aria-label="Permalink to &quot;回溯版本&quot;">​</a></h2><p>查看 <code>commit hash</code> 值</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reflog</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>回溯版本</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reset --hard xxxx</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>回溯命令</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push -f</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="配置-git-ssh-key" tabindex="-1">配置 Git SSH Key <a class="header-anchor" href="#配置-git-ssh-key" aria-label="Permalink to &quot;配置 Git SSH Key&quot;">​</a></h2><p>命令行输入：</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh-keygen</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rsa -b </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4096</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -C &quot;邮箱&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>连续敲击 3 次回车，即可 <code>/c/Users/</code> 当前用户<code> /.ssh/</code> 目录中生成 <code>id_rsa</code> 和 <code>id_rsa.pub</code> 两个文件</p><h2 id="关联存储库" tabindex="-1">关联存储库 <a class="header-anchor" href="#关联存储库" aria-label="Permalink to &quot;关联存储库&quot;">​</a></h2><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remote add origin xxxxx</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="修改用户名和邮箱" tabindex="-1">修改用户名和邮箱 <a class="header-anchor" href="#修改用户名和邮箱" aria-label="Permalink to &quot;修改用户名和邮箱&quot;">​</a></h2><p>输入命令：</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config --global user.name &#39;xxxxx&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config --global user.email &#39;xxxxx@qq.com&#39;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="更改分支名" tabindex="-1">更改分支名 <a class="header-anchor" href="#更改分支名" aria-label="Permalink to &quot;更改分支名&quot;">​</a></h2><p>修改本地分支名称：</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> branch -m oldBranchName newBranchName</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>将改名后的本地分支推送到远程，并将本地分支与之关联</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push --set-upstream origin newBranchName</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="合并两个没有共同历史提交记录的分支" tabindex="-1">合并两个没有共同历史提交记录的分支 <a class="header-anchor" href="#合并两个没有共同历史提交记录的分支" aria-label="Permalink to &quot;合并两个没有共同历史提交记录的分支&quot;">​</a></h2><p>某个git仓库原有master分支，后面自己本地新建了一个项目，然后把新建的这个推到了这个仓库的另外一个分支temp</p><blockquote><p>直接合并报错<code>fatal: refusing to merge unrelated histories</code></p></blockquote><p><strong>解决方案</strong>：采用git rebase --onto变基的方法</p><p>1.先从master上拉出一个新的分支dev进行操作,并推到远程</p><p><code>git checkout -b dev</code></p><p><code>git push --set-upstream origin dev</code> //推送并关联远程分支</p><p>2.执行<code>git rebase --onto temp</code>进行变基操作 <img src="https://img-blog.csdnimg.cn/32c39134241b44d9bfa92adcc67dea45.png" alt=""></p><p>3.在该分支上拉取允许不相关历史的操作,然后手动解决冲突</p><p><code>git pull --allow-unrelated-histories</code></p><p><img src="https://img-blog.csdnimg.cn/e8ec89309aaf4844a74889efab64fde6.png" alt=""></p><p>4.解决冲突，提交推送到远程</p><p>npm config set registry <a href="http://registry.npmmirror.com" target="_blank" rel="noreferrer">http://registry.npmmirror.com</a></p><p><a href="https://registry.npmjs.org" target="_blank" rel="noreferrer">https://registry.npmjs.org</a></p><p><strong>ssh</strong></p><p><code> ssh-keygen -t ed25519 -C &quot;1395568275@qq.com&quot; -f ~/.ssh/id_ed25519_mcwmengxi</code></p><p>config</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># github</span></span>
<span class="line"><span>Host github.com</span></span>
<span class="line"><span>HostName ssh.github.com</span></span>
<span class="line"><span>User mcwmengxi</span></span>
<span class="line"><span>IdentityFile ~/.ssh/id_ed25519_mcwmengxi</span></span>
<span class="line"><span>PreferredAuthentications publickey</span></span>
<span class="line"><span>Port 443</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>sourcetree添加ssh秘钥 <code>ssh -T git@github.com</code></p><p>解除ssh验证</p><p>git config --global http.sslVerify false</p><h2 id="用户账号管理" tabindex="-1">用户账号管理 <a class="header-anchor" href="#用户账号管理" aria-label="Permalink to &quot;用户账号管理&quot;">​</a></h2><blockquote><p>如果在项目自己的配置文件中已经有了用户名的配置，则优先使用项目自己的配置。如果项目没有单独配置，则再根据当前根路径是否指定了配置文件去获取对应的配置信息</p></blockquote><p><strong>管理同一目录下的配置</strong></p><p>目录下建立.gitconfig</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[user]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> = mcwmengxi</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  email</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> = </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1395568275</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@qq.com</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>修改git的全局配置文件.gitconfig,把当前目录添加全局配置文件中</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[includeIf </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;gitdir:D:/project/&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        path</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> = D:/project/.gitconfig</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><strong>单独配置项目用户名</strong></p><p>git config user.name mcwmengxi git config user.email <a href="mailto:1395568275@qq.com" target="_blank" rel="noreferrer">1395568275@qq.com</a></p><h2 id="git代理" tabindex="-1">git代理 <a class="header-anchor" href="#git代理" aria-label="Permalink to &quot;git代理&quot;">​</a></h2><p>.gitconfig文件开启代理,访问github,git仓库走ssh</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>[http]</span></span>
<span class="line"><span>  proxy = http://127.0.0.1:26501</span></span>
<span class="line"><span>  sslverify = false # 禁用 SSL 安全证书检查</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>sourceTree无法使用 <a href="https://zhuanlan.zhihu.com/p/637566727" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/637566727</a></p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ERROR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [2023-07-31 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">23</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">:14:29,681] [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">] [Sourcetree.Composition.VSMef.Net48.VSMefCompositionManager] [Log] - Unable to load MEF components</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>删除该目录下两个.cache文件 Composition.cache Assemblies.cache <code>C:\\Users\\mengxi\\AppData\\Local\\Atlassian\\SourceTree.exe_Url_fop3hzd4ikr21gr5nqmqd4tnru2hl5kn\\3.4.12.0</code></p>`,65),p=n("p",{0:""},"git pull --tags origin master git stash list git stash apply stash@",-1),r=[l,p];function h(d,c,o,g,k,u){return i(),a("div",null,r)}const v=s(t,[["render",h]]);export{m as __pageData,v as default};
