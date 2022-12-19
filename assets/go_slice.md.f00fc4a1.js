import{_ as s,o as n,c as a,a as l}from"./app.87e390a5.js";const i=JSON.parse('{"title":"\u6982\u8FF0","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u6982\u8FF0","slug":"\u6982\u8FF0"},{"level":2,"title":"\u58F0\u660E\u5207\u7247","slug":"\u58F0\u660E\u5207\u7247"},{"level":2,"title":"\u622A\u53D6\u5207\u7247","slug":"\u622A\u53D6\u5207\u7247"},{"level":2,"title":"\u8FFD\u52A0\u5207\u7247","slug":"\u8FFD\u52A0\u5207\u7247"},{"level":2,"title":"\u5220\u9664\u5207\u7247","slug":"\u5220\u9664\u5207\u7247"}],"relativePath":"go/slice.md","lastUpdated":1671468376000}'),p={name:"go/slice.md"},o=l(`<h2 id="\u6982\u8FF0" tabindex="-1">\u6982\u8FF0 <a class="header-anchor" href="#\u6982\u8FF0" aria-hidden="true">#</a></h2><p>\u5207\u7247\u662F\u4E00\u79CD\u52A8\u6001\u6570\u7EC4\uFF0C\u6BD4\u6570\u7EC4\u64CD\u4F5C\u7075\u6D3B\uFF0C\u957F\u5EA6\u4E0D\u662F\u56FA\u5B9A\u7684\uFF0C\u53EF\u4EE5\u8FDB\u884C\u8FFD\u52A0\u548C\u5220\u9664\u3002</p><p><code>len()</code> \u548C <code>cap()</code> \u8FD4\u56DE\u7ED3\u679C\u53EF\u76F8\u540C\u548C\u4E0D\u540C\u3002</p><h2 id="\u58F0\u660E\u5207\u7247" tabindex="-1">\u58F0\u660E\u5207\u7247 <a class="header-anchor" href="#\u58F0\u660E\u5207\u7247" aria-hidden="true">#</a></h2><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">package</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">fmt</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">slice_1</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">------</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">slice_1</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> sli_1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">sli_1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">sli_1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> sli_1</span><span style="color:#89DDFF;">[</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_1</span><span style="color:#89DDFF;">)-</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">],</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_1</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> sli_2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// \u7A7A\u5207\u7247</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d, cap=%d, slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_2</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_2</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;"> sli_2</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> sli_3 [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;">      </span><span style="color:#676E95;font-style:italic;">//nil \u5207\u7247</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_3</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_3</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli_3</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli_4 </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_4</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_4</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli_4</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> sli_5 [] int </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">make</span><span style="color:#89DDFF;">([]</span><span style="color:#C792EA;">int</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_5</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_5</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli_5</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli_6 </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">make</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">[] </span><span style="color:#C792EA;">int</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">9</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_6</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli_6</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli_6</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div></details><p>\u8FD0\u884C\u7ED3\u679C\uFF1A</p><p><img src="https://img-blog.csdnimg.cn/db1b6f6ab0af4acda5c5d1cab766e101.png" alt=""></p><h2 id="\u622A\u53D6\u5207\u7247" tabindex="-1">\u622A\u53D6\u5207\u7247 <a class="header-anchor" href="#\u622A\u53D6\u5207\u7247" aria-hidden="true">#</a></h2><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// \u622A\u53D6\u5207\u7247</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/*</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">	\u652F\u6301\u4E09\u79CD\u683C\u5F0F\uFF1A</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">	\u65E0\u5206\u53F7,\u53D6\u4E0B\u6807</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">	\u6709\u4E00\u4E2A\u5206\u53F7\uFF0C\u622A\u53D6\uFF0C\u5DE6\u95ED\u53F3\u5F00</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">	\u4E24\u4E2A\u5206\u53F7\uFF0C\u524D\u9762\u89C4\u5219\u4E0D\u53D8\uFF0C\u7B2C\u4E8C\u4E2A\u5206\u53F7\u540E\u662Fcap\u622A\u53D6\u7684\u957F\u5EA6</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">*/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">slice_2</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">6</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">slice[1]=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">],</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[:],</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">:],</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[:</span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">])</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">slice[0:3:4]=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">])</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">]),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">]),</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">:</span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">])</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div></details><p>\u8FD0\u884C\u7ED3\u679C\uFF1A</p><p><img src="https://img-blog.csdnimg.cn/efdf58242e78401b8e43a05eb8bdf30f.png" alt=""></p><h2 id="\u8FFD\u52A0\u5207\u7247" tabindex="-1">\u8FFD\u52A0\u5207\u7247 <a class="header-anchor" href="#\u8FFD\u52A0\u5207\u7247" aria-hidden="true">#</a></h2><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">//\u8FFD\u52A0\u5207\u7247</span></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">slice_3</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">append</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">append</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">9</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">11</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></details><p>\u8FD0\u884C\u7ED3\u679C\uFF1A</p><p><img src="https://img-blog.csdnimg.cn/8224917e98b44f8698427626089363d3.png" alt=""></p><p>append \u65F6\uFF0C\u5BB9\u91CF\u4E0D\u591F\u9700\u8981\u6269\u5BB9\u65F6\uFF0Ccap \u4F1A\u7FFB\u500D\u3002</p><h2 id="\u5220\u9664\u5207\u7247" tabindex="-1">\u5220\u9664\u5207\u7247 <a class="header-anchor" href="#\u5220\u9664\u5207\u7247" aria-hidden="true">#</a></h2><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;">// \u5220\u9664\u5207\u7247</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u901A\u8FC7\u622A\u53D6\u548C\u8FFD\u52A0\u65B9\u6CD5\u5B9E\u73B0\u5220\u9664\u6548\u679C</span></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">slice_4</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> [] </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">4</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">6</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//\u5220\u9664\u5C3E\u90E8 2 \u4E2A\u5143\u7D20</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[:</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)-</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">]),</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[:</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)-</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">]),</span><span style="color:#A6ACCD;"> sli</span><span style="color:#89DDFF;">[:</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)-</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//\u5220\u9664\u5F00\u5934 2 \u4E2A\u5143\u7D20</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">:]),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">:]),</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">:])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//\u5220\u9664\u4E2D\u95F4 2 \u4E2A\u5143\u7D20</span></span>
<span class="line"><span style="color:#A6ACCD;">	sli </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">append</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">[:</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">],</span><span style="color:#A6ACCD;"> sli</span><span style="color:#89DDFF;">[</span><span style="color:#F78C6C;">3</span><span style="color:#89DDFF;">+</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">:]...)</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">len=%d cap=%d slice=%v</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#82AAFF;">len</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#82AAFF;">cap</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">),</span><span style="color:#A6ACCD;">sli</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div></details><p>\u8FD0\u884C\u7ED3\u679C\uFF1A</p><p><img src="https://img-blog.csdnimg.cn/f0bd54ed05294085b89389f189f3644b.png" alt=""></p>`,20),e=[o];function c(t,r,D,F,y,C){return n(),a("div",null,e)}var b=s(p,[["render",c]]);export{i as __pageData,b as default};