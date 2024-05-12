import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.C2K-FukO.js";const g=JSON.parse('{"title":"微前端","description":"","frontmatter":{},"headers":[],"relativePath":"docs/front-end/vue/micro.md","filePath":"docs/front-end/vue/micro.md","lastUpdated":1715534646000}'),p={name:"docs/front-end/vue/micro.md"},l=n(`<h1 id="微前端" tabindex="-1">微前端 <a class="header-anchor" href="#微前端" aria-label="Permalink to &quot;微前端&quot;">​</a></h1><blockquote><p>前言：微前端已经是一个非常成熟的领域了，但开发者不管采用哪个现有方案，在适配成本、样式隔离、运行性能、页面白屏、子应用通信、子应用保活、多应用激活、vite 框架支持、应用共享等用户核心诉求都或存在问题，或无法提供支持。本文提供一种基于 iframe 的全新微前端方案，完善的解决了这些核心诉求。</p></blockquote><h2 id="微前端概念" tabindex="-1">微前端概念 <a class="header-anchor" href="#微前端概念" aria-label="Permalink to &quot;微前端概念&quot;">​</a></h2><p>微前端是借鉴了微服务的理念，将一个庞大的应用拆分成多个独立灵活的小型应用，每个应用都可以独立开发，独立运行，独立部署，还可以随意组合，这样就降低了耦合度，从而更加灵活。</p><h2 id="微前端特性" tabindex="-1">微前端特性 <a class="header-anchor" href="#微前端特性" aria-label="Permalink to &quot;微前端特性&quot;">​</a></h2><p>技术栈无关 主框架不限制接入应用的技术栈，子应用可自主选择技术栈（vue，react，jq，ng等） 独立开发/部署 各个团队之间仓库独立，单独部署，互不依赖 增量升级 当一个应用庞大之后，技术升级或重构相当麻烦，而微应用具备渐进式升级的特性 独立运行时 微应用之间运行时互不依赖，有独立的状态管理</p><h3 id="场景演示" tabindex="-1">场景演示 <a class="header-anchor" href="#场景演示" aria-label="Permalink to &quot;场景演示&quot;">​</a></h3><ul><li>后台管理系统</li></ul><p>最外面一层可以当主应用，里面可以放不同的子应用子应用不受技术的限制。</p><ul><li>web商店（未来趋势）</li></ul><p>例如一些导航网站,可以提供微前端的接入，我们的网站也可以入驻该网站，并且还可以提供一些API增加交互，有点类似于小程序。小程序可以调用微信的一些能力例如支付，扫码等，导航类型的网站也可以提供一些API，我们的网站接入之后提供API调用，可以实现更多有趣的玩法。</p><h2 id="微前端方案" tabindex="-1">微前端方案 <a class="header-anchor" href="#微前端方案" aria-label="Permalink to &quot;微前端方案&quot;">​</a></h2><h3 id="iframe-方案" tabindex="-1">iframe 方案 <a class="header-anchor" href="#iframe-方案" aria-label="Permalink to &quot;iframe 方案&quot;">​</a></h3><p><strong>特点</strong></p><p>1.接入比较简单 2.隔离非常稳完美 <strong>不足</strong></p><p>1.dom割裂感严重，弹框只能在iframe，而且有滚动条 2.通讯非常麻烦，而且刷新iframe url状态丢失 3.前进后退按钮无效</p><h3 id="qiankun-方案" tabindex="-1">qiankun 方案 <a class="header-anchor" href="#qiankun-方案" aria-label="Permalink to &quot;qiankun 方案&quot;">​</a></h3><p>qiankun 方案是基于 single-spa 的微前端方案。 特点</p><p>html entry 的方式引入子应用，相比 js entry 极大的降低了应用改造的成本； 完备的沙箱方案，js 沙箱做了 SnapshotSandbox、LegacySandbox、ProxySandbox 三套渐进增强方案，css 沙箱做了 strictStyleIsolation、experimentalStyleIsolation 两套适用不同场景的方案； 做了静态资源预加载能力；</p><p>不足</p><p>适配成本比较高，工程化、生命周期、静态资源路径、路由等都要做一系列的适配工作； css 沙箱采用严格隔离会有各种问题，js 沙箱在某些场景下执行性能下降严重； 无法同时激活多个子应用，也不支持子应用保活； 无法支持 vite 等 esmodule 脚本运行；</p><p>底层原理 js沙箱使用的是proxy进行快照然后用用 with(window){} 包裹起来 with内的window其实就是proxy.window 我们声明变量 var name = &#39;小满&#39; 实际这个变量挂到了proxy.window 并不是真正的window css沙箱原理 第一个就是shadowDom隔离 第二个类似于Vue的scoped [data-qiankun-426732]</p><p>micro-app 方案 micro-app 是基于 webcomponent + qiankun sandbox 的微前端方案。 特点</p><p>使用 webcomponet 加载子应用相比 single-spa 这种注册监听方案更加优雅； 复用经过大量项目验证过 qiankun 的沙箱机制也使得框架更加可靠； 组件式的 api 更加符合使用习惯，支持子应用保活； 降低子应用改造的成本，提供静态资源预加载能力；</p><p>不足</p><p>接入成本较 qiankun 有所降低，但是路由依然存在依赖； （虚拟路由已解决） 多应用激活后无法保持各子应用的路由状态，刷新后全部丢失； （虚拟路由已解决） css 沙箱依然无法绝对的隔离，js 沙箱做全局变量查找缓存，性能有所优化； 支持 vite 运行，但必须使用 plugin 改造子应用，且 js 代码没办法做沙箱隔离； 对于不支持 webcompnent 的浏览器没有做降级处理；</p><p>底层原理 js隔离跟qiankun类似也是使用proxy + with，css隔离自定义前缀类似于scoped</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> prefix</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`micro-app[name=\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">appName</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}]\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="emp-方案" tabindex="-1">EMP 方案 <a class="header-anchor" href="#emp-方案" aria-label="Permalink to &quot;EMP 方案&quot;">​</a></h3><p>EMP 方案是基于 webpack 5 module federation 的微前端方案。 特点</p><p>webpack 联邦编译可以保证所有子应用依赖解耦； 应用间去中心化的调用、共享模块； 模块远程 ts 支持；</p><p>不足</p><p>对 webpack 强依赖，老旧项目不友好； 没有有效的 css 沙箱和 js 沙箱，需要靠用户自觉； 子应用保活、多应用激活无法实现； 主、子应用的路由可能发生冲突；</p><p>底层原理 这个东西有点类似于拆包，也可以叫模块共享，例如React有个模块可以共享给Vue项目用Vue2的组件可以共享给Vue3用。</p><h3 id="无界微前端方案" tabindex="-1">无界微前端方案 <a class="header-anchor" href="#无界微前端方案" aria-label="Permalink to &quot;无界微前端方案&quot;">​</a></h3><p>预览demo wujie-micro.github.io/demo-main-v…** 特点</p><p>接入简单只需要四五行代码 不需要针对vite额外处理 预加载 应用保活机制</p><p>不足</p><p>隔离js使用一个空的iframe进行隔离 子应用axios需要自行适配 iframe沙箱的src设置了主应用的host，初始化iframe的时候需要等待iframe的location.orign从&#39;about:blank&#39;初始化为主应用的host，这个采用的计时器去等待的不是很悠亚。</p><p>底层原理 使用shadowDom 隔离css，js使用空的iframe隔离，通讯使用的是proxy</p><h2 id="前置知识了解webcomponents" tabindex="-1">前置知识了解webComponents <a class="header-anchor" href="#前置知识了解webcomponents" aria-label="Permalink to &quot;前置知识了解webComponents&quot;">​</a></h2><p>演示vue版本webComponents的 传参 样式隔离 以及写法</p><div class="language-vue vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;test&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">qx-test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">userInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">JSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(params)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { defineCustomElement } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> QxTest </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./qx-test.vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> params</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;nangong&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, age: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">26</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineCustomElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(QxTest)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 注册自定义元素</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">window.customElements.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">define</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;qx-test&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Element)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> scoped</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !important</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- qx-test.vue --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;web components test&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">	userInfo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> any</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(props)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- &lt;script&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">export default defineComponent({</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	name: &#39;qx-test&#39;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">})</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;/script&gt; --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;scss&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">#545456</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !important</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><h2 id="前置知识2-monorepo架构" tabindex="-1">前置知识2 monorepo架构 <a class="header-anchor" href="#前置知识2-monorepo架构" aria-label="Permalink to &quot;前置知识2 monorepo架构&quot;">​</a></h2><p>我们采用的是微前端一个主应用，和多个子应用，我们肯定不会一个一个去install安装依赖，太傻了，我们采用monorepo 架构 一次install 即可安装完成。</p><p>pnpm内置了对单个代码仓库包含多个软件包的支持，是monorepo架构模式的不二速选</p><p>创建硬链接，共享内存地址，修改一个文件另外一个也会改 <code>mklink /H test.js out.js</code></p><p>创建软链接(符号链接) 快捷方式，指向原来的那个文件 <code>mklink test.js out.js</code></p><p>pnpm仓库目录 <code>pnpm store path</code></p><p>pnpm -F vue-demo start 只单独启动某个项目 pnpm -F vue-demo add common 给子模块添加公共依赖</p><h2 id="无界入门" tabindex="-1">无界入门 <a class="header-anchor" href="#无界入门" aria-label="Permalink to &quot;无界入门&quot;">​</a></h2>`,51),e=[l];function t(h,k,r,E,d,o){return a(),i("div",null,e)}const y=s(p,[["render",t]]);export{g as __pageData,y as default};