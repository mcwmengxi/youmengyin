import{_ as e,o as t,c as r,a as o}from"./app.dd13f1e2.js";const h=JSON.parse('{"title":"\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F","slug":"\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F"}],"relativePath":"tools-chain/git.md","lastUpdated":1669369689000}'),a={name:"tools-chain/git.md"},p=o('<h2 id="\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F" tabindex="-1">\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F <a class="header-anchor" href="#\u5408\u5E76\u4E24\u4E2A\u6CA1\u6709\u5171\u540C\u5386\u53F2\u63D0\u4EA4\u8BB0\u5F55\u7684\u5206\u652F" aria-hidden="true">#</a></h2><p>\u67D0\u4E2Agit\u4ED3\u5E93\u539F\u6709master\u5206\u652F\uFF0C\u540E\u9762\u81EA\u5DF1\u672C\u5730\u65B0\u5EFA\u4E86\u4E00\u4E2A\u9879\u76EE\uFF0C\u7136\u540E\u628A\u65B0\u5EFA\u7684\u8FD9\u4E2A\u63A8\u5230\u4E86\u8FD9\u4E2A\u4ED3\u5E93\u7684\u53E6\u5916\u4E00\u4E2A\u5206\u652Ftemp</p><blockquote><p>\u76F4\u63A5\u5408\u5E76\u62A5\u9519<code>fatal: refusing to merge unrelated histories</code></p></blockquote><p><strong>\u89E3\u51B3\u65B9\u6848</strong>\uFF1A\u91C7\u7528git rebase --onto\u53D8\u57FA\u7684\u65B9\u6CD5</p><p>1.\u5148\u4ECEmaster\u4E0A\u62C9\u51FA\u4E00\u4E2A\u65B0\u7684\u5206\u652Fdev\u8FDB\u884C\u64CD\u4F5C,\u5E76\u63A8\u5230\u8FDC\u7A0B</p><p><code>git checkout -b dev</code></p><p><code>git push --set-upstream origin dev</code> //\u63A8\u9001\u5E76\u5173\u8054\u8FDC\u7A0B\u5206\u652F</p><p>2.\u6267\u884C<code>git rebase --onto temp</code>\u8FDB\u884C\u53D8\u57FA\u64CD\u4F5C <img src="https://img-blog.csdnimg.cn/32c39134241b44d9bfa92adcc67dea45.png" alt=""></p><p>3.\u5728\u8BE5\u5206\u652F\u4E0A\u62C9\u53D6\u5141\u8BB8\u4E0D\u76F8\u5173\u5386\u53F2\u7684\u64CD\u4F5C,\u7136\u540E\u624B\u52A8\u89E3\u51B3\u51B2\u7A81</p><p><code>git pull --allow-unrelated-histories</code></p><p><img src="https://img-blog.csdnimg.cn/e8ec89309aaf4844a74889efab64fde6.png" alt=""></p><p>4.\u89E3\u51B3\u51B2\u7A81\uFF0C\u63D0\u4EA4\u63A8\u9001\u5230\u8FDC\u7A0B</p><p>npm config set registry <a href="http://registry.npmmirror.com" target="_blank" rel="noopener noreferrer">http://registry.npmmirror.com</a></p><p><a href="https://registry.npmjs.org" target="_blank" rel="noopener noreferrer">https://registry.npmjs.org</a></p>',14),s=[p];function n(c,i,d,g,l,m){return t(),r("div",null,s)}var f=e(a,[["render",n]]);export{h as __pageData,f as default};
