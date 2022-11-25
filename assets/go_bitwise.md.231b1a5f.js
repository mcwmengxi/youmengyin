import{_ as s,o as n,c as a,a as l}from"./app.dd13f1e2.js";const i=JSON.parse('{"title":"\u4F4D\u8FD0\u7B97","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F4D\u8FD0\u7B97","slug":"\u4F4D\u8FD0\u7B97"}],"relativePath":"go/bitwise.md","lastUpdated":1669369689000}'),p={name:"go/bitwise.md"},o=l(`<h2 id="\u4F4D\u8FD0\u7B97" tabindex="-1">\u4F4D\u8FD0\u7B97 <a class="header-anchor" href="#\u4F4D\u8FD0\u7B97" aria-hidden="true">#</a></h2><p>G0\u8BED\u8A00\u652F\u6301\u7684\u4F4D\u8FD0\u7B97\u7B26\u5982\u4E0B\u8868\u6240\u793A\u3002\u5047\u5B9AA\u4E3A60\uFF0CB\u4E3A13\uFF1A</p><table><thead><tr><th>\u8FD0\u7B97\u7B26</th><th>\u63CF\u8FF0</th><th>\u5B9E\u4F8B</th></tr></thead><tbody><tr><td>&amp;</td><td>\u6309\u4F4D\u4E0E\u8FD0\u7B97\u7B26&quot;&amp;&quot;\u662F\u53CC\u76EE\u8FD0\u7B97\u7B26\u3002\u90FD\u662F1\u7ED3\u679C\u4E3A1\uFF0C\u5426\u5219\u662F0</td><td>(A&amp;B)\u7ED3\u679C\u4E3A12\uFF0C\u4E8C\u8FDB\u5236\u4E3A00001100</td></tr><tr><td>|</td><td>\u6309\u4F4D\u6216\u8FD0\u7B97\u7B26&quot;|&quot;\u662F\u53CC\u76EE\u8FD0\u7B97\u7B26\u3002\u90FD\u662F0\u7ED3\u679C\u4E3A0\uFF0C\u5426\u662F\u662F1</td><td>(A|B)\u7ED3\u679C\u4E3A61\uFF0C\u4E8C\u8FDB\u5236\u4E3A00111101</td></tr><tr><td>^</td><td>\u6309\u4F4D\u5F02\u6216\u8FD0\u7B97\u7B26&quot;\u2227&quot;\u662F\u53CC\u76EE\u8FD0\u7B97\u7B26\u3002\u4E0D\u540C\u5219\u4E3A1\uFF0C\u76F8\u540C\u4E3A0</td><td>(A^B)\u7ED3\u679C\u4E3A49\uFF0C\u4E8C\u8FDB\u5236\u4E3A00110001</td></tr><tr><td>&amp;^</td><td>\u4F4D\u6E05\u7A7A\uFF0Ca&amp;^b,\u5BF9\u4E8Eb\u4E0A\u7684\u6BCF\u4E2A\u6570\u503C\uFF0C\u5982\u679C\u4E3A0\uFF0C\u5219\u53D6a\u5BF9\u5E94\u4F4D\u4E0A\u7684\u6570\u503C\uFF0C\u5982\u679C\u4E3A1\uFF0C\u5219\u53D60.</td><td>(A&amp;^B)\u7ED3\u679C\u4E3A48\uFF0C\u4E8C\u8FDB\u5236\u4E3A00110000</td></tr><tr><td>&lt;&lt;</td><td>\u5DE6\u79FB\u8FD0\u7B97\u7B26&quot;&lt;&lt;&quot;\u662F\u53CC\u76EE\u8FD0\u7B97\u7B26\u3002\u5DE6\u79FBn\u4F4D\u5C31\u662F\u4E58\u4EE52\u7684\u6B21\u65B9\u3002\u5176\u529F\u80FD\u628A&quot;&lt;&lt;&quot;\u5DE6\u8FB9\u7684\u8FD0\u7B97\u6570\u7684\u5404\u4E8C\u8FDB\u4F4D\u5168\u90E8\u5DE6\u79FB\u82E5\u5E72\u4F4D\uFF0C\u7531&quot;&lt;&lt;&quot;\u53F3\u8FB9\u7684\u6570\u6307\u5B9A\u79FB\u52A8\u7684\u4F4D\u6570\uFF0C\u9AD8\u4F4D\u4E22\u5F03\uFF0C\u4F4E\u4F4D\u88650\u3002</td><td>A&lt;&lt;2\u7ED3\u679C\u4E3A240\uFF0C\u4E8C\u8FDB\u5236\u4E3A11110000</td></tr><tr><td>&gt;&gt;</td><td>\u53F3\u79FB\u8FD0\u7B97\u7B26&quot;&gt;&gt;&quot;\u662F\u53CC\u76EE\u8FD0\u7B97\u7B26\u3002\u53F3\u79FBn\u4F4D\u5C31\u662F\u9664\u4EE52\u7684\u6B21\u65B9\u3002\u5176\u529F\u80FD\u662F\u628A&quot;&gt;&gt;&quot;\u5DE6\u8FB9\u7684\u8FD0\u7B97\u6570\u7684\u5404\u4E8C\u8FDB\u4F4D\u5168</td><td>A&gt;&gt;2\u7ED3\u679C\u4E3A15\uFF0C\u4E8C\u8FDB\u5236\u4E3A00001111</td></tr></tbody></table><details class="details custom-block"><summary>\u67E5\u770B\u4EE3\u7801</summary><div class="language-go line-numbers-mode"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">package</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">fmt</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// \u6240\u6709\u7684\u4F4D\u8FD0\u7B97\u90FD\u662F\u5EFA\u7ACB\u5728\u4E8C\u8FDB\u5236\u7684\u57FA\u7840\u4E0A</span></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">main</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">bitwise_1</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">-----</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">bitwise_2</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Println</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">-----</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">bitwise_3</span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">bitwise_1</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// &amp;</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12  0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60  0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&amp;   0000 1100 ==&gt; 12</span></span>
<span class="line"><span style="color:#A6ACCD;">	 a </span><span style="color:#89DDFF;">:=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;">a</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// |</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12  0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60  0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//|   0011 1100 ==&gt; 60</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">bitwise_2</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// \u6309\u4F4D\u5F02\u6216,\u76F8\u540C\u4E3A0,\u4E0D\u540C\u4E3A1</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// ^</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12  0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60  0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//^   0011 0000 ==&gt; 48</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// \u4F4D\u6E05\u7A7A\uFF0Ca&amp;^b,\u5BF9\u4E8Eb\u4E0A\u7684\u6BCF\u4E2A\u6570\u503C\uFF0C\u5982\u679C\u4E3A0\uFF0C\u5219\u53D6a\u5BF9\u5E94\u4F4D\u4E0A\u7684\u6570\u503C\uFF0C\u5982\u679C\u4E3A1\uFF0C\u5219\u53D60.</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// &amp;^</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12  0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60  0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&amp;^  0000 0000 ==&gt; 0</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//\u7F6E\u6362 0011 0000 ==&gt; 48</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">12</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;^</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">12</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">func</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">bitwise_3</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// \u5DE6\u79FB &lt;&lt; 2</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12   0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&lt;&lt;2  0011 0000 ==&gt; 48</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60   0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&lt;&lt;2  1111 0000 ==&gt; 240</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;&lt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;&lt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;&lt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;&lt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">// \u53F3\u79FB &gt;&gt;2</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//12   0000 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&gt;&gt;2  0000 0011 ==&gt; 3</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//60   0011 1100</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#676E95;font-style:italic;">//&gt;&gt;2  0000 1111 ==&gt; 15</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">12</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">	fmt</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">%d, \u4E8C\u8FDB\u5236%b</span><span style="color:#A6ACCD;">\\n</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,(</span><span style="color:#F78C6C;">60</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">))</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers-wrapper"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br></div></div></details>`,4),t=[o];function e(c,r,y,D,F,C){return n(),a("div",null,t)}var b=s(p,[["render",e]]);export{i as __pageData,b as default};
