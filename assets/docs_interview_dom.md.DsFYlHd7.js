import{_ as e,c as o,o as i,a4 as l}from"./chunks/framework.C2K-FukO.js";const f=JSON.parse('{"title":"DOM相关","description":"","frontmatter":{},"headers":[],"relativePath":"docs/interview/dom.md","filePath":"docs/interview/dom.md","lastUpdated":1715534646000}'),t={name:"docs/interview/dom.md"},a=l('<h1 id="dom相关" tabindex="-1">DOM相关 <a class="header-anchor" href="#dom相关" aria-label="Permalink to &quot;DOM相关&quot;">​</a></h1><h2 id="_1-js-的各种位置-比-clientheight-scrollheight-offsetheight-以及scrolltop-offsettop-clienttop-的区别" tabindex="-1">1. JS 的各种位置，比 clientHeight,scrollHeight,offsetHeight ,以及scrollTop, offsetTop,clientTop 的区别? <a class="header-anchor" href="#_1-js-的各种位置-比-clientheight-scrollheight-offsetheight-以及scrolltop-offsettop-clienttop-的区别" aria-label="Permalink to &quot;1. JS 的各种位置，比 clientHeight,scrollHeight,offsetHeight ,以及scrollTop, offsetTop,clientTop 的区别?&quot;">​</a></h2><ul><li><code>clientHeight</code>: 表示的是可视区域的高度，不包含<code>border</code>和滚动条</li><li><code>offsetHeight</code>: 表示可视区域的高度，包合了<code>border</code>和滚动条</li><li><code>scrollHeight</code>: 表示了所有区域的高度，包含了因为滚动被隐藏的部分</li><li><code>clientTop</code>: 表示边框 <code>border</code> 的厚度，在未指定的情况下一般为<code>O</code></li><li><code>scrollTop</code>: 滚动后被隐藏的高度，获取对象相对于由 <code>offsetParent</code> 属性指定的父坐标(<code>css</code> 定位的元素或 <code>body</code> 元素)距离顶端的高度</li></ul><h2 id="_2-预加载和懒加载的区别-预加载在什么时间加载合适" tabindex="-1">2. 预加载和懒加载的区别，预加载在什么时间加载合适 <a class="header-anchor" href="#_2-预加载和懒加载的区别-预加载在什么时间加载合适" aria-label="Permalink to &quot;2. 预加载和懒加载的区别，预加载在什么时间加载合适&quot;">​</a></h2><ul><li>预加载是指在页面加载完成之前，提前将所需资源下载，之后使用的时候从缓存中调用。</li><li>懒加载是延迟加载，按照一定的条件或者需求等到满足条件的时候再加载对应的资源</li></ul><blockquote><p>两者主要区别是一个是提前加载，一个是迟缓其至不加载。懒加载对服务器前端有一定的缓解压力作用，预加载则会增加服务器前端压力。</p></blockquote><h2 id="_3-在浏览器输入一个网址-到显示页面-中间发生了什么" tabindex="-1">3. 在浏览器输入一个网址，到显示页面，中间发生了什么 <a class="header-anchor" href="#_3-在浏览器输入一个网址-到显示页面-中间发生了什么" aria-label="Permalink to &quot;3. 在浏览器输入一个网址，到显示页面，中间发生了什么&quot;">​</a></h2><ol><li><p>DNS解析：浏览器首先会将输入的URL解析成对应的IP地址。如果浏览器缓存中没有对应的IP地址，那么会向本地DNS服务器发送请求，本地DNS服务器会根据自身的缓存情况或者向根域名服务器进行递归查询，最终将域名解析为IP地址。</p></li><li><p>建立TCP连接：浏览器通过解析得到的IP地址和端口号，向Web服务器发送TCP连接请求，与Web服务器建立TCP连接。</p></li><li><p>发送HTTP请求：一旦TCP连接建立成功，浏览器就会向Web服务器发送HTTP请求，请求获取指定URL的资源（如HTML、CSS、JavaScript、图片等）。</p></li><li><p>服务器处理请求：Web服务器接收到来自浏览器的HTTP请求后，会根据请求的内容进行相应的处理，比如读取文件、运行脚本等。</p></li><li><p>返回HTTP响应：服务器处理完请求后，将生成的HTTP响应（包括状态码、内容等）发送回浏览器。</p></li><li><p>浏览器解析内容：浏览器接收到HTTP响应后，会根据响应中的内容类型进行解析，比如渲染HTML、加载CSS和JavaScript等。</p></li><li><p>页面渲染：浏览器根据解析到的内容和执行JavaScript代码，开始渲染页面，并显示给用户。</p></li></ol><p>整个过程涉及到网络通信、协议处理、服务器处理、内容解析和页面渲染等多个环节，最终完成了从输入网址到显示页面的整个过程。</p><h2 id="_4-浏览器是如何渲染页面" tabindex="-1">4. 浏览器是如何渲染页面 <a class="header-anchor" href="#_4-浏览器是如何渲染页面" aria-label="Permalink to &quot;4. 浏览器是如何渲染页面&quot;">​</a></h2><ol><li><p>HTML解析：浏览器从服务器接收到HTML文档后，会进行解析。解析的过程包括词法分析和语法分析。词法分析将HTML文档分割成一个个词法单元（token），语法分析则将这些词法单元转化为DOM节点，并构建DOM树的结构。</p></li><li><p>CSS解析：浏览器接收到CSS样式表后，会进行解析。解析的过程同样包括词法分析和语法分析。通过词法分析，浏览器将CSS样式表分割成一个个词法单元，然后通过语法分析将其转化为样式规则，最终构建成CSSOM树。</p></li><li><p>构建渲染树：浏览器将DOM树和CSSOM树合并成一棵渲染树（Render Tree）。渲染树中只包含需要显示的内容，例如不可见的节点（如head、display: none等）将被排除在外。</p></li><li><p>布局计算：浏览器根据渲染树中每个节点的样式和尺寸信息，计算出它们在页面上的确切位置。这个过程称为布局计算（Layout）或重排（Reflow）。浏览器需要考虑盒模型、定位、浮动等因素进行布局计算。</p></li><li><p>绘制页面：浏览器根据计算得到的位置和样式信息，将渲染树中的每个节点绘制到屏幕上。这个过程称为绘制（Painting）或重绘（Repaint）。浏览器使用图形库将各个元素绘制到屏幕上，包括文字、图像、背景色等。</p></li><li><p>JavaScript执行：如果页面中有JavaScript代码，浏览器会执行这些脚本。JavaScript代码可能会修改DOM结构、样式或触发重新布局和绘制，从而影响页面渲染过程。</p></li><li><p>渲染完成：当所有节点都被布局和绘制之后，页面渲染完成，用户就可以看到最终的页面内容了。</p></li></ol><p>以上就是浏览器渲染页面的更加详细的过程，包括HTML解析、CSS解析、渲染树构建、布局计算、绘制页面和JavaScript执行等多个环节。理解这些环节可以帮助我们更好地优化页面性能，提高用户体验。</p>',12),c=[a];function r(d,p,s,n,h,T){return i(),o("div",null,c)}const S=e(t,[["render",r]]);export{f as __pageData,S as default};
