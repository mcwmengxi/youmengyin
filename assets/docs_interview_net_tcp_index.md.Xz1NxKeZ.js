import{_ as s,c as i,o as a,a4 as e}from"./chunks/framework.C2K-FukO.js";const u=JSON.parse('{"title":"计算机网络-传输层协议专项复习","description":"","frontmatter":{"author":"HearLing"},"headers":[],"relativePath":"docs/interview/net/tcp/index.md","filePath":"docs/interview/net/tcp/index.md","lastUpdated":1715534646000}'),l={name:"docs/interview/net/tcp/index.md"},n=e(`<h1 id="计算机网络-传输层协议专项复习" tabindex="-1">计算机网络-传输层协议专项复习 <a class="header-anchor" href="#计算机网络-传输层协议专项复习" aria-label="Permalink to &quot;计算机网络-传输层协议专项复习&quot;">​</a></h1><p>⭐️⭐️ 这篇文章是一个我计算机网络复习的大汇总，参考了许多文章，也非常感谢大佬对我这篇文章的帮助，由于内容太多了我把它分成了上下两篇来写，这一篇将传输层协议 TCP、UDP</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c7ecd88d5c845779a8ef4c00a788b35~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><blockquote><p>以上是这篇文章的思维导图，个人建议复习的小伙伴都可以搞一个，方便自己复习用~</p></blockquote><h2 id="tcp-和-udp-的区别" tabindex="-1">TCP 和 UDP 的区别 <a class="header-anchor" href="#tcp-和-udp-的区别" aria-label="Permalink to &quot;TCP 和 UDP 的区别&quot;">​</a></h2><p>首先</p><ul><li><strong>TCP 是面向连接的、可靠的、基于字节流</strong>的传输层协议</li><li><strong>UDP 是一个面向无连接</strong>的传输层协议</li></ul><p><strong>详细的区别：</strong></p><p>1、tcp 是基于连接的，可靠性高；udp 是基于无连接的，可靠性较低；</p><p>2、由于 tcp 是连接的通信，需要有三次握手、重新确认等连接过程，会有延时，实时性差；由于协议所致，安全性较高；而 udp 无连接，无建立连接的过程，因而实时性较强，安全略差；</p><p>3、在传输相同大小的数据时，tcp 首部开销 20 字节；udp 首部开销只有 8 个字节，tcp 报头比 udp 复杂，故实际包含的用户数据较少。tcp 无丢包，而 udp 有丢包，故 tcp 开销大，udp 开销较小；</p><p>4、每条 tcp 连接只能是点到点的；udp 支持一对一、一对多、多对一、多对多的交互通信。</p><p><strong>应用场景的区别：</strong></p><ul><li>由于 TCP 和 UDP 的特点，如果对实时性要求高和高速传输的场景下需要使用 UDP；</li><li>如果需要传输大量数据且对数据可靠性要求高的场景使用 TCP；</li><li>在可靠性要求低追求效率的情况使用 UDP；</li></ul><h2 id="tcp-三大核心" tabindex="-1">TCP 三大核心 <a class="header-anchor" href="#tcp-三大核心" aria-label="Permalink to &quot;TCP 三大核心&quot;">​</a></h2><ul><li><strong>面向连接</strong>；所谓面向连接，指的是客户端与服务端的连接，在双方互相通信之前，TCP 需要三次握手建立连接，而 UDP 没有相应的建立连接的过程</li><li><strong>可靠性</strong>；TCP 可靠性主要体现在<strong>1 有状态 2 可控制</strong></li><li><strong>面向字节流</strong>；UDP 数据传输基于数据报，仅仅是继承了 IP 层的特性，而 TCP 为维护状态，将 IP 包变成了字节流</li></ul><blockquote><p><strong>有状态</strong>；TCP 会精准记录哪些数据发送了，被对方接受了，哪些没有，而保证数据按序到达，不允许差错 <strong>可控制</strong>；意识到丢包或者网络环境差，TCP 根据具体情况调整自己的行为，控制自己发送速度或重发</p></blockquote><p><code>而UDP不可靠原因：无状态，不可控</code></p><hr><h2 id="tcp-三次握手" tabindex="-1">TCP 三次握手 <a class="header-anchor" href="#tcp-三次握手" aria-label="Permalink to &quot;TCP 三次握手&quot;">​</a></h2><blockquote><p>一次握手过程及变化、为什么不是两次、为什么不是四次、握手过程中可以携带数据吗、同时发起挥手会怎样</p></blockquote><h2 id="tcp-三次握手的过程" tabindex="-1">TCP 三次握手的过程 <a class="header-anchor" href="#tcp-三次握手的过程" aria-label="Permalink to &quot;TCP 三次握手的过程&quot;">​</a></h2><p>三次握手要确认双方的两样能力：发送能力与接收的能力。 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25e6385d6e244d1184e29e765b91edb6~tplv-k3u1fbpfcp-zoom-1.image" alt=""> 最开始双方都属于 CLOSED 状态。然后服务器开始监听某个端口，进入 LISTEN 状态。</p><ul><li>客户端注重发起连接，发送 SYN，自己变成了 SYN-SENT 状态</li><li>服务端收到，返回 SYN 和 ACK（对应客户端发来的 SYN），自己变成了 SYN-RECD</li><li>客户端再发送 ACK 给服务端，自己变成 ESTABLISHED（established）状态；服务端收到 ACK 之后，也变成这个状态</li></ul><h2 id="为什么不是两次" tabindex="-1">为什么不是两次？ <a class="header-anchor" href="#为什么不是两次" aria-label="Permalink to &quot;为什么不是两次？&quot;">​</a></h2><p>根本原因：无法确认客户端的接收能力。 可能出现的问题是，两次握手，服务端只要接收到然后发送相应的数据包，就 <code>默认连接 </code> 了 ，但是事实上现在客户端可能已经断开连接了，这样也就带来了连接资源的浪费 \`\`</p><h2 id="为什么不是四次" tabindex="-1">为什么不是四次？ <a class="header-anchor" href="#为什么不是四次" aria-label="Permalink to &quot;为什么不是四次？&quot;">​</a></h2><p>因为三次已经足够确认双方的发送和接收的能力了，四次以及四次以上当然就没必要啦</p><h2 id="三次握手过程中可以携带数据吗" tabindex="-1">三次握手过程中可以携带数据吗？ <a class="header-anchor" href="#三次握手过程中可以携带数据吗" aria-label="Permalink to &quot;三次握手过程中可以携带数据吗？&quot;">​</a></h2><p>可以，但是只有第三次，此时的<code>established</code>状态相对安全并且够确认服务器的接收发送能力。</p><p>而不能在第一次握手携带数据是为了防止黑客在<code>syn</code>中放入大量数据造成服务器资源的消耗。</p><hr><h2 id="四次挥手断开连接" tabindex="-1">四次挥手断开连接 <a class="header-anchor" href="#四次挥手断开连接" aria-label="Permalink to &quot;四次挥手断开连接&quot;">​</a></h2><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d7cbfd9ffd47a595c4ece46858c040~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><ul><li>首先客户端主动关闭，向服务器发<code>FIN</code>报文</li><li>服务端接收后通知应用进程并向客户端发送<code>ACK</code>确认</li><li>服务端处理完后被动关闭再次向客户端发送<code>FIN</code>以及<code>ACK</code>，进入<code>LAST-ACK</code>状态，</li><li>客户端收到服务端发来的<code>FIN</code>后，发送 <code>ACK</code> 给服务端。在等待<code>2MSL</code>后进入<code>CLOSED</code>状态</li></ul><blockquote><p>注意了，这个时候，客户端需要等待两个 <code>MSL</code>(Maximum Segment Lifetime，报文最大生存时间),在这段时间内如果客户端没有收到服务端的重发请求，那么表示 <code>ACK </code>成功到达，挥手结束，否则客户端重发 ACK。</p></blockquote><h2 id="为什么要等待-2-msl" tabindex="-1">为什么要等待 2 MSL? <a class="header-anchor" href="#为什么要等待-2-msl" aria-label="Permalink to &quot;为什么要等待 2 MSL?&quot;">​</a></h2><ul><li>1 个 MSL 确保四次挥手中主动关闭方最后的 ACK 报文最终能达到对端</li><li>1 个 MSL 确保对端没有收到 ACK 重传的 FIN 报文可以到达</li></ul><h2 id="为什么是四次挥手而不是三次" tabindex="-1">为什么是四次挥手而不是三次？ <a class="header-anchor" href="#为什么是四次挥手而不是三次" aria-label="Permalink to &quot;为什么是四次挥手而不是三次？&quot;">​</a></h2><ul><li>因为服务端在接收到<code>FIN</code>, 往往不会立即返回<code>FIN</code>, 必须等到服务端所有的报文都发送完毕了，才能发<code>FIN</code>。</li><li>因此先发一个 ACK 表示已经收到客户端的<code>FIN</code>，延迟一段时间才发<code>FIN</code>。这就造成了四次挥手。 <code>如果是三次挥手会有什么问题？</code> 等于说服务端将<code>ACK</code>和<code>FIN</code>的发送合并为一次挥手，长时间的延迟可能会导致客户端误以为<code>FIN</code>没有到达客户端，从而让客户端不断的重发<code>FIN</code>。</li></ul><h2 id="同时发起挥手" tabindex="-1">同时发起挥手 <a class="header-anchor" href="#同时发起挥手" aria-label="Permalink to &quot;同时发起挥手&quot;">​</a></h2><p>在发送方给接收方发 SYN 报文的同时，接收方也给发送方发 SYN 报文 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1abf3cf575147bbaee5f628f93680b9~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>上图就是解释同时打开情况下的状态变迁。</p><ul><li>发完 SYN，两者的状态都变为 SYN-SENT。</li><li>在各自收到对方的 SYN 后，两者状态都变为 SYN-REVD。</li><li>接着会回复对应的 ACK + SYN，这个报文在对方接收之后，两者状态一起变为 ESTABLISHED。</li></ul><h2 id="syn-flood" tabindex="-1">SYN Flood <a class="header-anchor" href="#syn-flood" aria-label="Permalink to &quot;SYN Flood&quot;">​</a></h2><blockquote><p>半连接队列、全连接队列、SYN Flood 攻击过程、如何应对这种攻击</p></blockquote><h2 id="半连接队列" tabindex="-1">半连接队列 <a class="header-anchor" href="#半连接队列" aria-label="Permalink to &quot;半连接队列&quot;">​</a></h2><p>当客户端发送<code>SYN</code>到服务端，服务端收到以后回复<code>ACK</code>和<code>SYN</code>，状态由<code>LISTEN</code>变为<code>SYN_RCVD</code>，此时这个连接就被推入了<strong>SYN 队列</strong>，也就是半连接队列。</p><h2 id="全连接队列" tabindex="-1">全连接队列 <a class="header-anchor" href="#全连接队列" aria-label="Permalink to &quot;全连接队列&quot;">​</a></h2><p>当客户端返回<code>ACK</code>, 服务端接收后，三次握手完成。这个时候连接等待被具体的应用取走，在被取走之前，它会被推入另外一个 TCP 维护的队列，也就是全连接队列(Accept Queue)。</p><h2 id="syn-flood-攻击原理" tabindex="-1">SYN Flood 攻击原理 <a class="header-anchor" href="#syn-flood-攻击原理" aria-label="Permalink to &quot;SYN Flood 攻击原理&quot;">​</a></h2><p>SYN Flood 属于<strong>典型的 DoS/DDoS 攻击</strong>。其攻击的原理很简单，就是用客户端在短时间内伪造大量不存在的 IP 地址，并向服务端疯狂发送 SYN。对于服务端而言，会产生两个危险的后果:</p><ul><li>处理大量的 SYN 包并返回对应 ACK, 势必有大量连接处于 SYN_RCVD 状态，从而占满整个半连接队列，无法处理正常的请求。</li><li>由于是不存在的 IP，服务端长时间收不到客户端的 ACK，会导致服务端不断重发数据，直到耗尽服务端的资源。</li></ul><h2 id="如何应对-syn-flood-攻击" tabindex="-1">如何应对 SYN Flood 攻击？ <a class="header-anchor" href="#如何应对-syn-flood-攻击" aria-label="Permalink to &quot;如何应对 SYN Flood 攻击？&quot;">​</a></h2><ol><li><strong>增加 SYN 连接</strong>，也就是增加半连接队列的容量。</li><li><strong>减少 SYN + ACK 重试次数</strong>，避免大量的超时重发。</li><li><strong>利用 SYN Cookie 技术</strong>，在服务端接收到 SYN 后不立即分配连接资源，而是根据这个 SYN 计算出一个 Cookie，连同第二次握手回复给客户端，在客户端回复 ACK 的时候带上这个 Cookie 值，服务端验证 Cookie 合法之后才分配连接资源。</li></ol><h2 id="半连接队列和-syn-flood-攻击的关系" tabindex="-1">半连接队列和 SYN Flood 攻击的关系 <a class="header-anchor" href="#半连接队列和-syn-flood-攻击的关系" aria-label="Permalink to &quot;半连接队列和 SYN Flood 攻击的关系&quot;">​</a></h2><ul><li>三次握手前，服务端的状态从<code>CLOSED</code>变为<code>LISTEN</code>, 同时在内部创建了两个队列： 半连接队列和全连接队列，即 SYN 队列和 ACCEPT 队列。</li><li>半连接队列是当客户端发送<code>SYN</code>到服务端，服务端收到以后回复<code>ACK</code>和<code>SYN</code>，状态由<code>LISTEN</code>变为<code>SYN_RCVD</code>，此时这个连接就被推入了<strong>SYN 队列</strong></li><li>SYN Flood 在短时间内伪造大量不存在的 IP 地址，并向服务端疯狂发送 SYN。处理大量的 SYN 包并返回对应 ACK, 势必有大量连接处于 SYN_RCVD 状态，从而占满整个半连接队列，无法处理正常的请求。</li></ul><hr><h2 id="剖析-tcp-报文首部字段" tabindex="-1">剖析 TCP 报文首部字段 <a class="header-anchor" href="#剖析-tcp-报文首部字段" aria-label="Permalink to &quot;剖析 TCP 报文首部字段&quot;">​</a></h2><blockquote><p>源端口、目标端口、序列号、ISN：ISN 是如何计算的，为什么、确认号标记位窗口大小校验和可选项</p></blockquote><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36da4a268c894963aa3c3e959d8cc4a5~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><ul><li>源端口、目标端口</li></ul><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">如何标识唯一标识一个连接？答案是</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TCP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 连接的四元组——源</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP、源端口、目标</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 和目标端口。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">那</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TCP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 报文怎么没有源</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 和目标</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 呢？这是因为在</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 层就已经处理了</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 。TCP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 只需要记录两者的端口即可。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul><li>序列号 即 Sequence number, 指的是本报文段第一个字节的序列号。</li></ul><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">序列号在</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TCP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 通信的过程中有两个作用:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">在</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> SYN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 报文中交换彼此的初始序列号。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">保证数据包按正确的顺序组装。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul><li>ISN</li></ul><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">即Initial</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Sequence</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Number（初始序列号）,在三次握手的过程当中，双方会用过SYN报文来交换彼此的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 并不是一个固定的值，而是每</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 4</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 加一，溢出则回到</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">，这个算法使得猜测</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 变得很困难。那为什么要这么做？</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">如果</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 被攻击者预测到，要知道源</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> IP</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 和源端口号都是很容易伪造的，当攻击者猜测</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 之后，直接伪造一个</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> RST</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 后，就可以强制连接关闭的，这是非常危险的。</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">而动态增长的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 大大提高了猜测</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ISN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 的难度。</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul><li><p>确认号 即 ACK(Acknowledgment number)。用来<strong>告知对方下一个期望接收的序列号</strong>，小于 ACK 的所有字节已经全部收到。</p></li><li><p>标记位 常见的标记位有 SYN,ACK,FIN,RST,PSH。</p></li><li><p>SYN 和 ACK 已经在上文说过，后三个解释如下: <strong>FIN</strong>： 即 Finish，表示发送方准备断开连接。 <strong>RST</strong>：即 Reset，用来强制断开连接。 <strong>PSH</strong>： 即 Push, 告知对方这些数据包收到后应该马上交给上层的应用，不能缓存。</p></li><li><p>窗口大小 占用两个字节，实际上是不够用的。因此 TCP 引入了窗口缩放的选项，作为窗口缩放的比例因子，这个比例因子的范围在 0 ~ 14，比例因子可以将窗口的值扩大为原来的 2 ^ n 次方。</p></li><li><p>校验和 占用两个字节，防止传输过程中数据包有损坏，如果遇到校验和有差错的报文，TCP 直接丢弃之，等待重传。</p></li><li><p>可选项 常用的可选项有以下几个: TimeStamp: TCP 时间戳，后面详细介绍。 MSS: 指的是 TCP 允许的从对方接收的最大报文段。 SACK: 选择确认选项。 Window Scale： 窗口缩放选项。</p></li></ul><p><code>不要死记，只要有个印象就行</code></p><hr><h2 id="tcp-快速打开-tfo-原理" tabindex="-1">TCP 快速打开（TFO）原理 <a class="header-anchor" href="#tcp-快速打开-tfo-原理" aria-label="Permalink to &quot;TCP 快速打开（TFO）原理&quot;">​</a></h2><blockquote><p>首轮三次握手、之后的三次握手、TFO 优势</p></blockquote><p>TFO 流程:</p><h2 id="首轮三次握手" tabindex="-1">首轮三次握手 <a class="header-anchor" href="#首轮三次握手" aria-label="Permalink to &quot;首轮三次握手&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">就是第二次握手的时候不是立即返回SYN+ACK了，</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">而是返回计算得到的</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SYN</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cookie\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">放在TCP报文的Fast</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Open（快速打开）选项中，</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">客户端拿到cookie将其缓存</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><ul><li>首先客户端<strong>发送 SYN</strong>给服务端，服务端接收到。</li><li><code>注意哦！现在服务端不是立刻回复 SYN + ACK</code>，而是通过<strong>计算</strong>得到一个<strong>SYN Cookie</strong>, 将这个 Cookie 放到 TCP 报文的 <strong>Fast Open</strong>选项中，然后才给客户端返回。</li><li>客户端拿到这个 <strong>Cookie 的值缓存</strong>下来。后面正常完成三次握手。</li></ul><p>首轮三次握手就是这样的流程。而后面的三次握手就不一样啦！</p><h2 id="后面的三次握手" tabindex="-1">后面的三次握手 <a class="header-anchor" href="#后面的三次握手" aria-label="Permalink to &quot;后面的三次握手&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">客户端发送Cookie+SYN+HTTP请求，</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">服务端验证合法，先确认，返回SYN+ACK，</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">返回HTTP响应</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">客户端传ACK</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul><li><p>在后面的三次握手中，客户端会将之前<strong>缓存的 Cookie、SYN 和 HTTP 请求</strong>(是的，你没看错)发送给服务端，服务端<strong>验证</strong>了 Cookie 的合法性，如果不合法直接丢弃；如果是合法的，那么就正常返回 SYN + ACK。</p></li><li><p><code>重点来了，现在服务端能向客户端发 HTTP 响应了！</code>这是最显著的改变，三次握手还没建立，仅仅验证了 Cookie 的合法性，就可以返回 HTTP 响应了。</p></li><li><p>当然，客户端的 ACK 还得正常传过来，不然怎么叫三次握手嘛。 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a8b21059b324777808046492d1bfdce~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p><code>注意: 客户端最后握手的 ACK 不一定要等到服务端的 HTTP 响应到达才发送，两个过程没有任何关系。</code></p></li></ul><p><strong>TFO 的优势</strong></p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">拿到Cookie验证通过就能返回HTTP请求了，</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">利用了1个往返时延</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RTT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">提前进行数据传输</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>TFO 的优势并不在与首轮三次握手，而<strong>在于后面的握手</strong>，在拿到客户端的 Cookie 并验证通过以后，可以<strong>直接返回 HTTP 响应</strong>，充分利用了 1 个<strong>RTT</strong>(Round-Trip Time，往返时延)的时间<strong>提前进行数据传输</strong>，积累起来还是一个比较大的优势。</p><hr><h2 id="tcp-时间戳作用" tabindex="-1">TCP 时间戳作用 <a class="header-anchor" href="#tcp-时间戳作用" aria-label="Permalink to &quot;TCP 时间戳作用&quot;">​</a></h2><ul><li>计算往返时延 RTT</li><li>防止序列号回绕的问题</li></ul><hr><h2 id="tcp-超时重传算法" tabindex="-1">TCP 超时重传算法 <a class="header-anchor" href="#tcp-超时重传算法" aria-label="Permalink to &quot;TCP 超时重传算法&quot;">​</a></h2><ul><li>经典方法</li><li>Jacobson / Karels 算法</li></ul><hr><h2 id="tcp-流量控制" tabindex="-1">TCP 流量控制 <a class="header-anchor" href="#tcp-流量控制" aria-label="Permalink to &quot;TCP 流量控制&quot;">​</a></h2><blockquote><p>TCP 滑动窗口概念、流量控制过程</p></blockquote><p>流量控制要做的事情，就是在通过接收缓存区的大小，控制发送端的发送。如果对方的接收缓存区满了，就不能再继续发送了。</p><p>具体是如何做的呢？举个例子：</p><ul><li>首先双方三次握手，初始化各自的窗口大小，均为 <strong>200</strong> 个字节。</li><li>假如当前发送端给接收端发送 <strong>100</strong> 个字节，那么此时对于发送端而言，<strong>可用窗口减少了 100</strong> 个字节。</li><li>现在这 100 个到达了接收端，被放到<strong>接收端的缓冲队列</strong>中。不过此时由于大量负载的原因，接收端处理不了这么多字节，<strong>只能处理 40</strong> 个字节，剩下的 <strong>60</strong> 个字节被<strong>留在了缓冲队列</strong>中。</li><li>上述是处理能力不够用啦的情况，意思你发送端给我少发点，所以此时接收端的接收窗口应该缩小，具体来说，<strong>缩小 60</strong> 个字节，由 200 个字节变成了 140 字节，因为<strong>缓冲队列留下 60</strong>个字节没被拿走。</li><li>因此，<strong>接收端会在 ACK 的报文首部</strong>带上缩小后的滑动窗口 <strong>140</strong> 字节，发送端<strong>对应地调整</strong>发送窗口的大小为 <strong>140</strong> 个字节。</li><li>此时发送端情况是，<strong>已经发送且确认的部分增加 40</strong> 字节，<strong>右移 40</strong> 个字节，同时<strong>发送窗口缩小为 140</strong> 个字节。</li><li>下图：<strong>滑动窗口</strong>结构（发送端） <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3cd654efd1648978acd5ac69c0a7212~tplv-k3u1fbpfcp-zoom-1.image" alt="在这里插入图片描述"><code>还是搞不清，那你写一下画一下就想得明白了</code></li></ul><hr><h2 id="tcp-拥塞控制" tabindex="-1">TCP 拥塞控制 <a class="header-anchor" href="#tcp-拥塞控制" aria-label="Permalink to &quot;TCP 拥塞控制&quot;">​</a></h2><blockquote><p>慢启动、 拥塞避免、快速重传和快速恢复、基于丢包的拥塞控制点产生的问题--Google 的 BBR 拥塞控制算法</p></blockquote><ul><li>流量控制发生在发送端跟接收端之间</li><li>而 TCP 的拥塞控制主要处理的问题是，整个网络环境，网络特别差，特别容易丢包的情况。</li></ul><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b60490e22384af8ae44753d9834ae60~tplv-k3u1fbpfcp-zoom-1.image" alt="在这里插入图片描述"></p><p><strong>对于拥塞控制来说，TCP 每条连接都需要维护两个核心状态:</strong></p><ul><li><strong>拥塞窗口</strong>（Congestion Window，cwnd）:</li></ul><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> 是指目前自己还能传输的数据量大小</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">	接收窗口(rwnd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)是接收端给的限制</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">	拥塞窗口(cwnd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)是发送端的限制 发送窗口大小 = min(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">rwnd,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cwnd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ul><li><strong>慢启动阈值</strong>（Slow Start Threshold，ssthresh）</li></ul><p><strong>涉及到的算法有这几个:</strong></p><ul><li><strong>慢启动</strong></li></ul><p>采用一种保守的算法来慢慢地适应整个网路，这种算法叫慢启动;</p><p>过程： 1.首先，三次握手，双方宣告自己的接收窗口大小</p><p>2.双方初始化自己的拥塞窗口(cwnd)大小</p><p>3.在开始传输的一段时间，发送端每收到一个 ACK，拥塞窗口大小加 1，也就是说，每经过一个 RTT，拥塞窗口 翻倍。</p><p>如果说初始窗口为 10，那么第一轮 10 个报文传完且发送端收到 ACK 后，拥塞窗口 变为 20， 第二轮变为 40，第三轮变为 80，依次类推。直到达到慢启动阈值</p><ul><li><strong>拥塞避免</strong></li></ul><p>达阈值后，如何来控制拥塞窗口的大小； 原来每收到一个 ACK，拥塞窗口加 1，现在到达阈值了，拥塞窗口只能加: 1/拥塞窗口 以前一轮 RTT 下来，cwnd 翻倍，现在 cwnd 只是增加 1 而已。</p><p><code>慢启动和拥塞避免是一起作用的，是一体的。</code></p><ul><li><strong>快速重传和快速恢复</strong></li></ul><p><strong>快速重传</strong> 如果发生了丢包，数据不是按序到达，接收端则重复发送之前的 ACK 比如第 5 个包丢了，即使第 6、7 个包到达的接收端，接收端也一律返回第 4 个包的 ACK。 收到 3 个重复的 ACK ，意识到丢包，马上重传； <strong>选择性重传</strong> ACK 报文 SACK 属性，通过 left edge 和 right edge 已经收到区间 <strong>快速恢复</strong> 发送端收到三次重复 ACK 之后，发现丢包觉得现网络已经有些拥塞了，会进入快速恢复阶段 发送端如下改变： 拥塞阈值降低为 cwnd 的一半、cwnd 的大小变为拥塞阈值、cwnd 线性增加</p><h2 id="结合图片理解" tabindex="-1">结合图片理解 <a class="header-anchor" href="#结合图片理解" aria-label="Permalink to &quot;结合图片理解&quot;">​</a></h2><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee7c226270b64ce0906de02128b76e02~tplv-k3u1fbpfcp-zoom-1.image" alt="在这里插入图片描述"></p><blockquote><p>首先慢开始，拥塞窗口买次翻倍直到达到慢启动阈值，进入拥塞避免，拥塞窗口每次加一，遇到超时的情况进入快速重传，拥塞阈值降为拥塞窗口的一半，重新慢启动和拥塞避免，当再收到三个重复的 ack 时会进入块恢复阶段</p></blockquote><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>可能还有一些我参考到的忘记了，我把我记得的都列出来，再次感谢~</p><blockquote><ul><li><strong>一百个 Chocolate</strong> ：<a href="https://github.com/Chocolate1999" target="_blank" rel="noreferrer">https://github.com/Chocolate1999</a></li><li><strong>CavsZhouyou</strong>：<a href="https://github.com/CavsZhouyou" target="_blank" rel="noreferrer">https://github.com/CavsZhouyou</a></li><li><strong>神三元</strong>：(建议收藏)TCP 协议灵魂之问，巩固你的网路底层基础、(建议收藏)TCP 协议灵魂之问，巩固你的网路底层基础</li><li><strong>LinDaiDai_霖呆呆</strong>：Shutdown HTTP 系列文章</li></ul></blockquote>`,122),t=[n];function o(p,r,h,d,c,k){return a(),i("div",null,t)}const F=s(l,[["render",o]]);export{u as __pageData,F as default};
