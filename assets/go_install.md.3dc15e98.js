import{_ as s,o as n,c as a,a as l}from"./app.dd13f1e2.js";const b=JSON.parse('{"title":"Go\u8BED\u8A00","description":"","frontmatter":{},"headers":[{"level":2,"title":"Go\u8BED\u8A00","slug":"go\u8BED\u8A00"},{"level":2,"title":"\u73AF\u5883\u5B89\u88C5","slug":"\u73AF\u5883\u5B89\u88C5"},{"level":3,"title":"macOS\u5B89\u88C5","slug":"macos\u5B89\u88C5"},{"level":3,"title":"Windows\u5B89\u88C5","slug":"windows\u5B89\u88C5"},{"level":2,"title":"\u76EE\u5F55\u7ED3\u6784","slug":"\u76EE\u5F55\u7ED3\u6784"},{"level":2,"title":"\u547D\u4EE4","slug":"\u547D\u4EE4"},{"level":2,"title":"\u5F00\u53D1\u5DE5\u5177","slug":"\u5F00\u53D1\u5DE5\u5177"},{"level":2,"title":"\u5B66\u4E60\u7F51\u5740","slug":"\u5B66\u4E60\u7F51\u5740"}],"relativePath":"go/install.md","lastUpdated":1669369689000}'),p={name:"go/install.md"},o=l(`<h2 id="go\u8BED\u8A00" tabindex="-1">Go\u8BED\u8A00 <a class="header-anchor" href="#go\u8BED\u8A00" aria-hidden="true">#</a></h2><blockquote><p>Go \u662F\u4E00\u4E2A\u5F00\u6E90\u7684\u7F16\u7A0B\u8BED\u8A00\uFF0C\u5B83\u80FD\u8BA9\u6784\u9020\u7B80\u5355\u3001\u53EF\u9760\u4E14\u9AD8\u6548\u7684\u8F6F\u4EF6\u53D8\u5F97\u5BB9\u6613\u3002</p></blockquote><p>\u5148\u4ECE\u73AF\u5883\u5B89\u88C5\u5F00\u59CB\uFF0C\u8F93\u51FA\u4E00\u4E2A Hello World\u3002</p><h2 id="\u73AF\u5883\u5B89\u88C5" tabindex="-1">\u73AF\u5883\u5B89\u88C5 <a class="header-anchor" href="#\u73AF\u5883\u5B89\u88C5" aria-hidden="true">#</a></h2><h3 id="macos\u5B89\u88C5" tabindex="-1">macOS\u5B89\u88C5 <a class="header-anchor" href="#macos\u5B89\u88C5" aria-hidden="true">#</a></h3><p><strong>\u65B9\u5F0F\u4E00\uFF1A</strong></p><p>\u901A\u8FC7 brew \u5B89\u88C5</p><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">brew install go</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><p><strong>\u65B9\u5F0F\u4E8C\uFF1A</strong></p><p>\u901A\u8FC7\u5B89\u88C5\u5305\u5B89\u88C5</p><p>\u5730\u5740\uFF1A<a href="https://dl.google.com/go/go1.12.darwin-amd64.pkg" target="_blank" rel="noopener noreferrer">https://dl.google.com/go/go1.12.darwin-amd64.pkg</a></p><p>\u4E0B\u8F7D\u4E4B\u540E\u76F4\u63A5\u70B9\u51FB\u5B89\u88C5\uFF0C\u4E00\u6B65\u6B65\u7EE7\u7EED\u5373\u53EF\u3002</p><p><strong>\u914D\u7F6E\u73AF\u5883\u53D8\u91CF</strong></p><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">vi ~/.bashrc</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//\u65B0\u589E</span></span>
<span class="line"><span style="color:#A6ACCD;">export GOROOT=/usr/local/go</span></span>
<span class="line"><span style="color:#A6ACCD;">export GOPATH=/Users/username/go/code //\u4EE3\u7801\u76EE\u5F55\uFF0C\u81EA\u5B9A\u4E49\u5373\u53EF</span></span>
<span class="line"><span style="color:#A6ACCD;">export PATH=$PATH:$GOPATH/bin</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u53CA\u65F6\u751F\u6548\uFF0C\u8BF7\u6267\u884C\u547D\u4EE4\uFF1Asource ~/.bashrc</p><p><strong>\u5982\u679C\u547D\u4EE4\u884C\u4F7F\u7528\u7684\u662Fzsh\uFF0C\u8BF7\u4FEE\u6539 .zshrc \u6587\u4EF6\u3002</strong></p><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">vi ~/.zshrc</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//\u65B0\u589E</span></span>
<span class="line"><span style="color:#A6ACCD;">export GOROOT=/usr/local/go</span></span>
<span class="line"><span style="color:#A6ACCD;">export GOPATH=/Users/username/go/code //\u81EA\u5B9A\u4E49\u4EE3\u7801\u76EE\u5F55</span></span>
<span class="line"><span style="color:#A6ACCD;">export PATH=$PATH:$GOPATH/bin</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>\u53CA\u65F6\u751F\u6548\uFF0C\u8BF7\u6267\u884C\u547D\u4EE4\uFF1Asource ~/.zshrc</p><p>\u9A8C\u8BC1\u662F\u5426\u5B89\u88C5\u6210\u529F\uFF0C\u547D\u4EE4\u884C\u4E0B\u6267\u884C\uFF1Ago -version</p><h3 id="windows\u5B89\u88C5" tabindex="-1">Windows\u5B89\u88C5 <a class="header-anchor" href="#windows\u5B89\u88C5" aria-hidden="true">#</a></h3><p>Go\u5B98\u7F51\u4E0B\u8F7D\u5730\u5740: <a href="https://golang.org/dl/" target="_blank" rel="noopener noreferrer">https://golang.org/dl/</a></p><p><strong>\u73AF\u5883\u53D8\u91CF\u914D\u7F6E\uFF08 GOROOT\u3001GOPATH\u3001Path \uFF09</strong> \u6DFB\u52A0<code>GOROOT\u3001GOPATH</code>\u53D8\u91CF, \u5BF9\u5E94\u5B89\u88C5\u8DEF\u5F84\u548C\u9879\u76EE\u8DEF\u5F84 <img src="https://img-blog.csdnimg.cn/59672076b7724481a89da752668dd584.png" alt=""> path\u7F16\u8F91\u6DFB\u52A0<code>%GOROOT%\\bin</code><img src="https://img-blog.csdnimg.cn/ef70da7931634a4f87950d3b34374818.png" alt=""> \u5B89\u88C5Go\u8BED\u8A00\u5F00\u53D1\u5DE5\u5177\u5305 ctrl+Shift+P \u8F93\u5165\u6846\u4E2D\u8F93\u5165go:install \u4F1A\u81EA\u52A8\u641C\u7D22\u76F8\u5173\u547D\u4EE4\uFF0C\u9009\u62E9Go:Install/Update Tools</p><h4 id="\u5B89\u88C5\u5931\u8D25\u89E3\u51B3\u529E\u6CD5\uFF1A" tabindex="-1">\u5B89\u88C5\u5931\u8D25\u89E3\u51B3\u529E\u6CD5\uFF1A <a class="header-anchor" href="#\u5B89\u88C5\u5931\u8D25\u89E3\u51B3\u529E\u6CD5\uFF1A" aria-hidden="true">#</a></h4><p><a href="http://xn--GOPATHsrcgolang-9j3xf91cxnve57a6qb566wz5b.org/x%E7%9B%AE%E5%BD%95" target="_blank" rel="noopener noreferrer">\u5728GOPATH\u7684src\u76EE\u5F55\u4E0B\u521B\u5EFAgolang.org/x\u76EE\u5F55</a></p><p>\u5728GOPATH/src/golang.org/x\u76EE\u5F55\u4E0B</p><p>\u6267\u884C <code>git clone https://github.com/golang/tools.git </code> \u547D\u4EE4</p><p>\u6267\u884C<code>git clone https://github.com/golang/lint.git</code>\u547D\u4EE4</p><p>\u63A5\u7740\u6267\u884C<code>go env -w GOPROXY=&quot;https://goproxy.cn&quot; </code></p><p>\u6309\u4E0B<code>Ctrl/Command+Shift+P</code>\u518D\u6B21\u6267\u884C <code>Go:Install/Update Tools</code> \u547D\u4EE4\uFF0C\u5728\u5F39\u51FA\u7684\u7A97\u53E3\u5168\u9009\u5E76\u70B9\u51FB\u786E\u5B9A\uFF0C\u8FD9\u4E00\u6B21\u7684\u5B89\u88C5\u90FD\u4F1ASUCCESSED\u4E86,\u6709\u4E9B\u4F1A\u62A5\u4E00\u4E9B\u547D\u4EE4\u4E0D\u5B58\u5728\uFF0C\u4F46\u597D\u50CF\u4E0D\u5F71\u54CD\u5B89\u88C5\uFF0C\u5C31\u6CA1\u53BB\u6DF1\u7A76\u4E86</p><h4 id="\u6216\u8005-\u4F7F\u7528go-mod-\u4EE3\u7406\u5B89\u88C5" tabindex="-1">\u6216\u8005 \u4F7F\u7528go mod \u4EE3\u7406\u5B89\u88C5 <a class="header-anchor" href="#\u6216\u8005-\u4F7F\u7528go-mod-\u4EE3\u7406\u5B89\u88C5" aria-hidden="true">#</a></h4><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"># Go 1.13 \u53CA\u4EE5\u4E0A\uFF08\u63A8\u8350\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># Windows\u6267\u884C</span></span>
<span class="line"><span style="color:#A6ACCD;">go env -w GO111MODULE=on</span></span>
<span class="line"><span style="color:#A6ACCD;">go env -w GOPROXY=https://goproxy.io,direct</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># Windows PowerShell \u6267\u884C </span></span>
<span class="line"><span style="color:#A6ACCD;">$env:GO111MODULE = &quot;on&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">$env:GOPROXY = &quot;https://goproxy.cn&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># macOS \u6216 Linux \u6267\u884C</span></span>
<span class="line"><span style="color:#A6ACCD;">export GO111MODULE=on</span></span>
<span class="line"><span style="color:#A6ACCD;">export GOPROXY=https://goproxy.cn</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># \u6216\u8005  macOS \u6216 Linux \u6267\u884C</span></span>
<span class="line"><span style="color:#A6ACCD;">echo &quot;export GO111MODULE=on&quot; &gt;&gt; ~/.profile</span></span>
<span class="line"><span style="color:#A6ACCD;">echo &quot;export GOPROXY=https://goproxy.cn&quot; &gt;&gt; ~/.profile</span></span>
<span class="line"><span style="color:#A6ACCD;">source ~/.profile</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">// \u624B\u52A8\u5B89\u88C5</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/mdempsky/gocode</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/uudashr/gopkgs/v2/cmd/gopkgs</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/ramya-rao-a/go-outline</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/acroca/go-symbols</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v golang.org/x/tools/cmd/guru</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v golang.org/x/tools/cmd/gorename</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/cweill/gotests/...</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/fatih/gomodifytags</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/josharian/impl</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/haya14busa/goplay/cmd/goplay</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/godoctor/godoctor</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/go-delve/delve/cmd/dlv</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/stamblerre/gocode</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/rogpeppe/godef</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v github.com/sqs/goreturns</span></span>
<span class="line"><span style="color:#A6ACCD;">go get -u -v golang.org/x/lint/golint</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br></div></div></details><p>\u9879\u76EE\u4E0B\u6267\u884C\uFF1Ago mod init \u9879\u76EE\u540D \u751F\u6210 go.mod</p><p><strong>vscode\u8BBE\u7F6E</strong></p><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-json line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.buildOnSave</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.buildFlags</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[],</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.buildTags</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.lintOnSave</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.formatOnSave</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.gopath</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">D:</span><span style="color:#A6ACCD;">\\\\</span><span style="color:#C3E88D;">project</span><span style="color:#A6ACCD;">\\\\</span><span style="color:#C3E88D;">go</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">go.goroot</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">D:</span><span style="color:#A6ACCD;">\\\\</span><span style="color:#C3E88D;">Software</span><span style="color:#A6ACCD;">\\\\</span><span style="color:#C3E88D;">Go</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></details><p>\u8FD0\u884C\u65B9\u6CD51 <code>go run hello.go</code> \u8FD0\u884C\u65B9\u6CD52 \u5B89\u88C5<code>code runner</code> \u63D2\u4EF6,\u6267\u884C\u6309\u94AE\u6267\u884C \u8FD0\u884C\u65B9\u6CD53 \u8BBE\u7F6EF5 <code>launch.json</code>\u91CC\u6DFB\u52A0Go\u73AF\u5883Debug\u6267\u884C</p><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-json line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">version</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">0.2.0</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">configurations</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">name</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">LaunchGo</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">type</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">go</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">request</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">launch</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">mode</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">auto</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">remotePath</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">port</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5546</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">host</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">127.0.0.1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">program</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\${fileDirname}</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">env</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#F78C6C;">GOPATH</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">D:/project/go</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">&quot;</span><span style="color:#F78C6C;">GOROOT</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">D:/SoftWare/Go</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">args</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[],</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#676E95;font-style:italic;">//&quot;showLog&quot;: true</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div></details><h2 id="\u76EE\u5F55\u7ED3\u6784" tabindex="-1">\u76EE\u5F55\u7ED3\u6784 <a class="header-anchor" href="#\u76EE\u5F55\u7ED3\u6784" aria-hidden="true">#</a></h2><p><strong>bin</strong></p><p>\u5B58\u653E\u7F16\u8BD1\u540E\u53EF\u6267\u884C\u7684\u6587\u4EF6\u3002</p><p><strong>pkg</strong></p><p>\u5B58\u653E\u7F16\u8BD1\u540E\u7684\u5E94\u7528\u5305\u3002</p><p><strong>src</strong></p><p>\u5B58\u653E\u5E94\u7528\u6E90\u4EE3\u7801\u3002</p><p>\u4F8B\u5982\uFF1A</p><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">\u251C\u2500 code  -- \u4EE3\u7801\u6839\u76EE\u5F55</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2502  \u251C\u2500 bin</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2502  \u251C\u2500 pkg</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2502  \u251C\u2500 src</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2502     \u251C\u2500\u2500 hello</span></span>
<span class="line"><span style="color:#A6ACCD;">\u2502         \u251C\u2500\u2500 hello.go</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><strong>Hello World \u4EE3\u7801</strong></p><div class="language- line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">//\u5728 hello \u76EE\u5F55\u4E0B\u521B\u5EFA hello.go</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">package main</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">import (</span></span>
<span class="line"><span style="color:#A6ACCD;">	&quot;fmt&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">func main() {</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt.Println(&quot;Hello World!&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="\u547D\u4EE4" tabindex="-1">\u547D\u4EE4 <a class="header-anchor" href="#\u547D\u4EE4" aria-hidden="true">#</a></h2><p><strong>go build hello</strong></p><p>\u5728src\u76EE\u5F55\u6216hello\u76EE\u5F55\u4E0B\u6267\u884C go build hello\uFF0C\u53EA\u5728\u5BF9\u5E94\u5F53\u524D\u76EE\u5F55\u4E0B\u751F\u6210\u6587\u4EF6\u3002</p><p><strong>go install hello</strong></p><p>\u5728src\u76EE\u5F55\u6216hello\u76EE\u5F55\u4E0B\u6267\u884C go install hello\uFF0C\u4F1A\u628A\u7F16\u8BD1\u597D\u7684\u7ED3\u679C\u79FB\u52A8\u5230 $GOPATH/bin\u3002</p><p><strong>go run hello</strong></p><p>\u5728src\u76EE\u5F55\u6216hello\u76EE\u5F55\u4E0B\u6267\u884C go run hello\uFF0C\u4E0D\u751F\u6210\u4EFB\u4F55\u6587\u4EF6\u53EA\u8FD0\u884C\u7A0B\u5E8F\u3002</p><p><strong>go fmt hello</strong></p><p>\u5728src\u76EE\u5F55\u6216hello\u76EE\u5F55\u4E0B\u6267\u884C go run hello\uFF0C\u683C\u5F0F\u5316\u4EE3\u7801\uFF0C\u5C06\u4EE3\u7801\u4FEE\u6539\u6210\u6807\u51C6\u683C\u5F0F\u3002</p><p>\u5176\u4ED6\u547D\u4EE4\uFF0C\u9700\u8981\u7684\u65F6\u5019\u518D\u8FDB\u884C\u7814\u7A76\u5427\u3002</p><h2 id="\u5F00\u53D1\u5DE5\u5177" tabindex="-1">\u5F00\u53D1\u5DE5\u5177 <a class="header-anchor" href="#\u5F00\u53D1\u5DE5\u5177" aria-hidden="true">#</a></h2><p><strong>GoLand</strong></p><p>GoLand \u662F JetBrains \u516C\u53F8\u63A8\u51FA\u7684 Go \u8BED\u8A00\u96C6\u6210\u5F00\u53D1\u73AF\u5883\uFF0C\u4E0E\u6211\u4EEC\u7528\u7684 WebStorm\u3001PhpStorm\u3001PyCharm \u662F\u4E00\u5BB6\uFF0C\u540C\u6837\u652F\u6301 Windows\u3001Linux\u3001macOS \u7B49\u64CD\u4F5C\u7CFB\u7EDF\u3002</p><p>\u4E0B\u8F7D\u5730\u5740\uFF1A<a href="https://www.jetbrains.com/go/" target="_blank" rel="noopener noreferrer">https://www.jetbrains.com/go/</a></p><p>\u8F6F\u4EF6\u662F\u4ED8\u8D39\u7684\uFF0C\u4E0D\u8FC7\u60F3\u60F3\u529E\u6CD5\uFF0C\u8F6F\u4EF6\u53EF\u4EE5\u6C38\u4E45\u6FC0\u6D3B\u7684\u3002</p><h2 id="\u5B66\u4E60\u7F51\u5740" tabindex="-1">\u5B66\u4E60\u7F51\u5740 <a class="header-anchor" href="#\u5B66\u4E60\u7F51\u5740" aria-hidden="true">#</a></h2><ul><li>Go\u8BED\u8A00\uFF1A<a href="https://golang.org/" target="_blank" rel="noopener noreferrer">https://golang.org/</a></li><li>Go\u8BED\u8A00\u4E2D\u6587\u7F51\uFF1A<a href="https://studygolang.com/" target="_blank" rel="noopener noreferrer">https://studygolang.com/</a></li><li>Go\u8BED\u8A00\u5305\u7BA1\u7406\uFF1A<a href="https://gopm.io/" target="_blank" rel="noopener noreferrer">https://gopm.io/</a></li></ul>`,64),e=[o];function r(c,t,i,D,u,y){return n(),a("div",null,e)}var A=s(p,[["render",r]]);export{b as __pageData,A as default};
