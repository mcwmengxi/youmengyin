import{_ as s,c as a,o as e,a4 as i}from"./chunks/framework.C2K-FukO.js";const u=JSON.parse('{"title":"第二章 框架设计的核心要素","description":"","frontmatter":{},"headers":[],"relativePath":"docs/front-end/vue-series/vue-design/page-2.md","filePath":"docs/front-end/vue-series/vue-design/page-2.md","lastUpdated":1715534646000}'),n={name:"docs/front-end/vue-series/vue-design/page-2.md"},t=i(`<h1 id="第二章-框架设计的核心要素" tabindex="-1">第二章 框架设计的核心要素 <a class="header-anchor" href="#第二章-框架设计的核心要素" aria-label="Permalink to &quot;第二章 框架设计的核心要素&quot;">​</a></h1><h2 id="_2-1-提升用户的开发体验" tabindex="-1">2.1 提升用户的开发体验 <a class="header-anchor" href="#_2-1-提升用户的开发体验" aria-label="Permalink to &quot;2.1 提升用户的开发体验&quot;">​</a></h2><p>对于框架而言，在用户使用的过程中需要向用户提供友好的反馈信息至关重要。如果这一点做不好，就很可能会导致用户的抱怨。始终提供着友好的报错和警告信息可以帮助用户快速解决问题。</p><p>比如调用下面 <code>warn</code> 函数</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> warn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">warn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(text)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">warn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;警告信息&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="_2-2-控制框架代码的体积" tabindex="-1">2.2 控制框架代码的体积 <a class="header-anchor" href="#_2-2-控制框架代码的体积" aria-label="Permalink to &quot;2.2 控制框架代码的体积&quot;">​</a></h2><p>当然，在同样功能的情况下，肯定是代码写的越少，浏览器加载的资源也就是越少，性能也就会更好，那么，存在很多的打印警告和错误的信息，难道不会影响框架的性能吗？</p><p>在 vue3 的源码中，经常看看一个 warn 函数配合 <code>__DEV__</code> 的检查，下面代码取自<a href="https://github.com/vuejs/core/blob/main/packages/reactivity/src/baseHandlers.ts" target="_blank" rel="noreferrer">这里</a></p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (__DEV__) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">warn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    \`Set operation on key &quot;\${</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">(</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">key</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot; failed: target is readonly.\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    target</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>那么在上面例子中，只有在 <code>__DEV__</code> 等于 <code>true</code> 的时候，才会执行下面代码，而达到目的的关键就在于这个 <code>__DEV__</code> 变量。</p><p>vue3 使用 <a href="https://github.com/rollup/rollup" target="_blank" rel="noreferrer">rollup.js</a>。Rollup 是一个用于 JavaScript 的模块打包器，它将小段代码编译成更大更复杂的东西，例如库或应用程序。</p><p>有了这一点，通过改变 <code>__DEV__</code> 变量的值，来进行判断，如果是在开发环境下，<code>__DEV__</code> 的值为 <code>true</code>，就可以执行下面的警告函数，也可以将其进行打包到文件中</p><p>那么如果到了生产环境中，<code>__DEV__</code>，就会变为 <code>false</code>，也就不会执行警告函数，也不会将其进打包到最终的文件中。</p><blockquote><p>所以就做到了在开发环境中提供友好的警告信息的同时，不会增加生产环境代码中的体积。</p></blockquote><h2 id="_2-3-框架要做到良好的-tree-shaking" tabindex="-1">2.3 框架要做到良好的 Tree-Shaking <a class="header-anchor" href="#_2-3-框架要做到良好的-tree-shaking" aria-label="Permalink to &quot;2.3 框架要做到良好的 Tree-Shaking&quot;">​</a></h2><p>但是除了上面的变量 <code>__DEV__</code> 可以移除或者展示报错信息外，在 vue 中，还会有很多的内置组件，比如 <a href="https://staging-cn.vuejs.org/api/built-in-components.html#transition" target="_blank" rel="noreferrer">transition</a>，那么如果用户没用在项目中使用，据不需要打包到最终的资源中，那么需要怎么做到这一点呢？这就不得不提到的是 <a href="https://vitejs.dev/guide/ssr.html#source-structure" target="_blank" rel="noreferrer">Tree-Shaking(vite 文档)</a> / <a href="https://webpack.js.org/guides/tree-shaking/" target="_blank" rel="noreferrer">Tree-Shaking(webpack 文档)</a>。</p><p>Tree-Shaking 的作用就是可以消除哪些永远不会执行的代码，从而减少包的体积。</p><h2 id="_2-4-良好的-typescript-类型支持" tabindex="-1">2.4 良好的 TypeScript 类型支持 <a class="header-anchor" href="#_2-4-良好的-typescript-类型支持" aria-label="Permalink to &quot;2.4 良好的 TypeScript 类型支持&quot;">​</a></h2><p>框架内部做了很多对于 TypeScript 的类型支持，并不是用 TypeScript 编写的框架，就一定对 TypeScript 由良好的支持，比如在 <a href="https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiDefineComponent.ts" target="_blank" rel="noreferrer">runtime-core</a> 文件中，整个在浏览器可以运行的文件只要 3 行，但是全部的代码将近 200 行，其实这些代码都是在为类型支持所服务。由此可见，框架要做到完善的类型支持，还需要付出很大的努力。</p>`,19),r=[t];function p(l,h,o,c,d,k){return e(),a("div",null,r)}const E=s(n,[["render",p]]);export{u as __pageData,E as default};
