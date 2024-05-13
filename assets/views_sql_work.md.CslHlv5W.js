import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.C2K-FukO.js";const y=JSON.parse('{"title":"实际遇到的问题","description":"","frontmatter":{},"headers":[],"relativePath":"views/sql/work.md","filePath":"views/sql/work.md","lastUpdated":1715615164000}'),l={name:"views/sql/work.md"},p=n(`<h1 id="实际遇到的问题" tabindex="-1">实际遇到的问题 <a class="header-anchor" href="#实际遇到的问题" aria-label="Permalink to &quot;实际遇到的问题&quot;">​</a></h1><h2 id="_1-将unicode-转换成字符" tabindex="-1">1. 将<code>unicode</code> 转换成字符 <a class="header-anchor" href="#_1-将unicode-转换成字符" aria-label="Permalink to &quot;1. 将\`unicode\` 转换成字符&quot;">​</a></h2><ol><li>在<code>dbo</code>模式下，创建函数</li></ol><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ALTER</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   FUNCTION</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> dbo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DecodeUnicode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@unicodeStr </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NVARCHAR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(MAX))</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RETURNS</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> NVARCHAR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(MAX)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">BEGIN</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  DECLARE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NVARCHAR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(MAX) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> N&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  DECLARE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">INT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  DECLARE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @len </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">INT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> LEN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@unicodeStr);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  WHILE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @len</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    BEGIN</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      IF</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> SUBSTRING</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@unicodeStr, @pos, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> N&#39;\\u&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        BEGIN</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          SET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> NCHAR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            CONVERT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              INT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">              CONVERT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                VARBINARY</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                , </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;0x&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> SUBSTRING</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@unicodeStr, @pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                , </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">              )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          );</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          SET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 跳过已处理的 Unicode 转义字符</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		END</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      ELSE</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">	    BEGIN</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          SET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> SUBSTRING</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@unicodeStr, @pos, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          SET</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">		END</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    END</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  RETURN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @result;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">END</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><ol start="2"><li>调用函数</li></ol><div class="language-sql vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &#39;\\u5f20\\u4e09&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> unicode_data</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  , </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">dbo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DecodeUnicode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;\\u5f20\\u4e09&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">AS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> deunicode_data</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><table><thead><tr><th>unicode_data</th><th>deunicode_data</th></tr></thead><tbody><tr><td>\\u5f20\\u4e09</td><td>张三</td></tr></tbody></table>`,7),h=[p];function k(e,t,r,E,d,c){return a(),i("div",null,h)}const F=s(l,[["render",k]]);export{y as __pageData,F as default};