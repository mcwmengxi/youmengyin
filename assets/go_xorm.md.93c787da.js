import{_ as s,o as n,c as a,a as l}from"./app.87e390a5.js";const i=JSON.parse('{"title":"xorm","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93","slug":"\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93"}],"relativePath":"go/xorm.md","lastUpdated":1669564276000}'),p={name:"go/xorm.md"},o=l(`<h1 id="xorm" tabindex="-1">xorm <a class="header-anchor" href="#xorm" aria-hidden="true">#</a></h1><p>xorm\u662F\u4E00\u4E2A\u7B80\u5355\u800C\u5F3A\u5927\u7684Go\u8BED\u8A00ORM\u5E93.\u901A\u8FC7\u5B83\u53EF\u4EE5\u4F7F\u6570\u636E\u5E93\u64CD\u4F5C\u975E\u5E38\u7B80\u4FBF\u3002 \u5B98\u7F51\uFF1A <code>https://xorm.io/ </code> \u4E2D\u6587\u6587\u6863\uFF1A<code>https:gitea.com/xorm/xorm/src/branch/master/README_CN.md</code></p><p><strong>\u7279\u6027</strong></p><ul><li>\u652F\u6301Struct\u548C\u6570\u636E\u5E93\u8868\u4E4B\u95F4\u7684\u7075\u6D3B\u6620\u5C04\uFF0C\u5E76\u652F\u6301\u81EA\u52A8\u540C\u6B65</li><li>\u4E8B\u52A1\u652F\u6301</li><li>\u540C\u65F6\u652F\u6301\u539F\u59CBSQL\u8BED\u53E5\u548CORM\u64CD\u4F5C\u7684\u6DF7\u5408\u6267\u884C</li><li>\u4F7F\u7528\u8FDE\u5199\u6765\u7B80\u5316\u8C03\u7528</li><li>\u652F\u6301\u4F7F\u7528lD,ln,Where,,Limit,Join,Having,Table,SQL,Cols\u7B49\u51FD\u6570\u548C\u7ED3\u6784\u4F53\u7B49\u65B9\u5F0F\u4F5C\u4E3A\u6761\u4EF6</li><li></li></ul><p><strong>\u5B89\u88C5</strong></p><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;font-style:italic;">go</span><span style="color:#A6ACCD;"> get xorm</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">io</span><span style="color:#89DDFF;">/</span><span style="color:#A6ACCD;">xorm</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br></div></div><h2 id="\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93" tabindex="-1">\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93 <a class="header-anchor" href="#\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93" aria-hidden="true">#</a></h2><ul><li>\u7B2C\u4E00\u6B65\u521B\u5EFA\u5F15\u64CE\uFF0CdriverName, dataSourceName \u548C database/sql \u63A5\u53E3\u76F8\u540C</li></ul><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">fmt</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">time</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">xorm.io/xorm</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	_ </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">github.com/go-sql-driver/mysql</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">var</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">		userName </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">root</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">		password </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">123456</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">		ipAddress </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">127.0.0.1</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">		port </span><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3306</span></span>
<span class="line"><span style="color:#A6ACCD;">		db_name </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">go_blog</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">		charset </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">utf8mb4</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#676E95;font-style:italic;">// root:123456@tcp(127.0.0.1:3306)/go_blog?charset=utf8mb4</span></span>
<span class="line"><span style="color:#A6ACCD;">    MysqlDataSources </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Sprintf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%s:%s@tcp(%s:%d)/%s?charset=%s</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> userName</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> password</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> ipAddress</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> port</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> db_name</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> charset</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    engine</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> err </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> xorm</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">NewEngine</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">mysql</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> MysqlDataSources</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><ul><li>\u5B9A\u4E49\u4E00\u4E2A\u548C\u8868\u540C\u6B65\u7684\u7ED3\u6784\u4F53\uFF0C\u5E76\u4E14\u81EA\u52A8\u540C\u6B65\u7ED3\u6784\u4F53\u5230\u6570\u636E\u5E93</li></ul><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">User</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    Id </span><span style="color:#C792EA;">int64</span></span>
<span class="line"><span style="color:#A6ACCD;">    Username </span><span style="color:#C792EA;">string</span></span>
<span class="line"><span style="color:#A6ACCD;">    Password </span><span style="color:#C792EA;">string</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">xorm:&quot;varchar(200)&quot;</span><span style="color:#89DDFF;">\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    Created time</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Time </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">xorm:&quot;created&quot;</span><span style="color:#89DDFF;">\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    Updated time</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Time </span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">xorm:&quot;updated&quot;</span><span style="color:#89DDFF;">\`</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	tableStructErr </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> engine</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Sync</span><span style="color:#89DDFF;">(</span><span style="color:#82AAFF;">new</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">User</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> tableStructErr </span><span style="color:#89DDFF;">!=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">nil</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">\u8868\u7ED3\u6784\u540C\u6B65\u5931\u8D25</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#82AAFF;">panic</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">tableStructErr</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div>`,11),e=[o];function r(t,c,D,y,F,C){return n(),a("div",null,e)}var u=s(p,[["render",r]]);export{i as __pageData,u as default};
