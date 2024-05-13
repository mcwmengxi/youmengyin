import{_ as s,c as a,o as i,a4 as n}from"./chunks/framework.C2K-FukO.js";const m=JSON.parse('{"title":"pnpm","description":"","frontmatter":{},"headers":[],"relativePath":"docs/tools-chain/pnpm.md","filePath":"docs/tools-chain/pnpm.md","lastUpdated":1715615164000}'),p={name:"docs/tools-chain/pnpm.md"},l=n(`<h1 id="pnpm" tabindex="-1">pnpm <a class="header-anchor" href="#pnpm" aria-label="Permalink to &quot;pnpm&quot;">​</a></h1><blockquote><p>默认创建一个非平铺的node_modules，因此代码也无法访问任意包</p></blockquote><h2 id="幽灵依赖" tabindex="-1">幽灵依赖 <a class="header-anchor" href="#幽灵依赖" aria-label="Permalink to &quot;幽灵依赖&quot;">​</a></h2><p>幽灵依赖（Phantom Dependency）是指那些没有在项目 <code>package.json</code> 文件中明确声明为直接依赖项，但却因为项目的间接依赖关系而在实际运行时被安装并使用的软件包。</p><p>例如，如果项目直接依赖于库 A 和库 B，而库 A 依赖于库 C 的某个版本，库 B 同样也依赖于库 C 的不同版本，那么在安装过程中，npm 或 yarn 可能会安装两个版本的库 C，以满足各个直接依赖项的要求。在这种情况下，项目虽然并未显式声明对库 C 的依赖，但仍然有一个或多个版本的库 C 在 <code>node_modules</code> 目录下被安装，这些未被项目直接声明的库 C 就被称为“幽灵依赖”。</p><h2 id="怎么解决幽灵依赖问题" tabindex="-1">怎么解决幽灵依赖问题 <a class="header-anchor" href="#怎么解决幽灵依赖问题" aria-label="Permalink to &quot;怎么解决幽灵依赖问题&quot;">​</a></h2><ol><li>明确依赖：</li></ol><p>在项目中尽量明确所有直接使用的依赖项，确保package.json文件中的dependencies和devDependencies字段包含了所有必要的库。 使用 npm ls --depth=0 或 yarn list --depth=0 来查看项目的直接依赖，检查是否有遗漏的直接依赖应该升级为直接声明。</p><ol start="2"><li>锁定依赖版本：</li></ol><p>使用 npm shrinkwrap（现在推荐使用 npm ci 和 package-lock.json）或 yarn.lock 文件来锁定所有依赖的具体版本，包括间接依赖。这样在部署时可以确保所有环境都安装了相同版本的包，减少因为间接依赖变动导致的问题。</p><ol start="3"><li>统一依赖版本：</li></ol><p>当发现不同直接依赖之间存在冲突时，可以通过调整依赖版本或与依赖库作者沟通合并需求来尽可能使它们引用同一版本的共享依赖。</p><ol start="4"><li>使用更先进的包管理器：</li></ol><p>考虑使用像 pnpm 或者 yarn 2 (berry) 这样的包管理器，它们通过更好的依赖解析算法和更加智能的磁盘存储方式（如链接和扁平化结构），有效减少了冗余并解决了部分幽灵依赖问题。</p><ol start="5"><li>依赖审计与清理：</li></ol><p>定期进行依赖更新，并使用依赖审计工具（如 npm audit 或 yarn audit）来检查是否存在安全漏洞或其他问题。 清理不必要的、未使用的或过时的依赖，确保项目仅包含真正需要的组件。</p><ol start="6"><li>模块打包优化：</li></ol><p>对于生产环境部署，可以考虑使用 Webpack 或 Rollup 等模块打包工具，对代码进行构建时的依赖分析和tree-shaking，进一步消除未使用的依赖。</p><h2 id="硬链接和软链接-符号链接" tabindex="-1">硬链接和软链接(符号链接) <a class="header-anchor" href="#硬链接和软链接-符号链接" aria-label="Permalink to &quot;硬链接和软链接(符号链接)&quot;">​</a></h2><ul><li>硬链接(Hard Link)：在Linux系统中，硬链接是通过创建一个新的目录项来实现的，该目录项指向被链接的文件。硬链接的特点是，不论你删除了哪个文件，都不会影响硬链接文件。</li><li>软链接(符号链接)：软链接是通过创建一个新的目录项来实现的，该目录项指向被链接文件的路径。软链接的特点是，当被链接文件被删除后，软链接文件仍然存在，且指向被删除文件的路径。(电脑快捷方式)</li></ul><h2 id="如何使用pnpm" tabindex="-1">如何使用pnpm <a class="header-anchor" href="#如何使用pnpm" aria-label="Permalink to &quot;如何使用pnpm&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> store</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> path</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 修剪未被引用的包来释放store空间</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> store</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prune</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Removed</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> all</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cached</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> metadata</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> files</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Removed</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 39099</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> files</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Removed</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1685</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packages</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 发布包的目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> link</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --global</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> link</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --global</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> qx-ui</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 取消挂载</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unlink</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 包目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unlink</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bag-framework</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  //</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 项目目录</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div>`,22),e=[l];function t(h,r,k,d,o,c){return i(),a("div",null,e)}const b=s(p,[["render",t]]);export{m as __pageData,b as default};