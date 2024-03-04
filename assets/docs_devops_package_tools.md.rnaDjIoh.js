import{_ as s,c as a,o as n,V as i}from"./chunks/framework.YX7VVfbY.js";const g=JSON.parse('{"title":"包管理器","description":"","frontmatter":{},"headers":[],"relativePath":"docs/devops/package_tools.md","filePath":"docs/devops/package_tools.md","lastUpdated":1709546498000}'),e={name:"docs/devops/package_tools.md"},t=i(`<h1 id="包管理器" tabindex="-1">包管理器 <a class="header-anchor" href="#包管理器" aria-label="Permalink to &quot;包管理器&quot;">​</a></h1><h2 id="npm" tabindex="-1">npm <a class="header-anchor" href="#npm" aria-label="Permalink to &quot;npm&quot;">​</a></h2><blockquote><p>.npmrc</p></blockquote><p>npm running cnfiguration, 即npm运行时配置文件 npm按照如下顺序读取这些配置文件：</p><ol><li>项目配置文件：项目根目录下.npmrc文件，只用于管理这个项目的npm安装。</li><li>用户配置文件：在你使用一个账号登陆的电脑的时候，可以为当前用户创建一个.npmrc文件，之后用该用户登录电脑，就可以使用该配置文件。可以通过 <code>npm config get userconfig</code> 来获取该文件的位置。 像<code>config set registry https://registry.npm.taobao.org</code></li><li>全局配置文件： 多用户可以设置一个公共的.npmrc文件，供所有用户使用。该文件的路径为：$PREFIX/etc/npmrc，使用 <code>npm config get prefix</code> 获取<code>$PREFIX</code>。如果你不曾配置过全局文件，该文件不存在。 像<code>npm config set registry https://registry.npm.taobao.org -g</code></li><li>npm内嵌配置文件</li></ol><h2 id="yarn" tabindex="-1">yarn <a class="header-anchor" href="#yarn" aria-label="Permalink to &quot;yarn&quot;">​</a></h2><blockquote><p>.yarnrc配置文件</p></blockquote><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">registry</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://registry.npm.taobao.org&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sass_binary_site</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://npm.taobao.org/mirrors/node-sass/&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">phantomjs_cdnurl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;http://cnpmjs.org/downloads&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">electron_mirror</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://npm.taobao.org/mirrors/electron/&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sqlite3_binary_host_mirror</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://foxgis.oss-cn-shanghai.aliyuncs.com/&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">profiler_binary_host_mirror</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://npm.taobao.org/mirrors/node-inspector/&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">chromedriver_cdnurl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://cdn.npm.taobao.org/dist/chromedriver&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div>`,8),r=[t];function o(p,l,c,h,d,m){return n(),a("div",null,r)}const u=s(e,[["render",o]]);export{g as __pageData,u as default};