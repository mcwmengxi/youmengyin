在我们日常的开发过程中，我们会经常使用 get 和 post 请求来发送网络请求来获取远程服务器的数据，那么你有没有想过他们到底有什么样的区别呢，那么接下来的这篇文章中我们将来学习一下 get 和 post 的区别。

## 浏览器的 GET 和 POST 请求

这里特指浏览器中非 Ajax 的 HTTP 请求，即从 HTML 和浏览器诞生就一直使用的 HTTP 协议中的 GET/POST。浏览器用 GET 请求来获取一个 html 页面/图片/css/js 等资源；用 POST 来提交一个 `<form>` 表单，并得到一个结果的网页。

##### GET 请求[](#get-请求)

读取一个资源。比如 Get 到一个 html 文件。反复读取不应该对访问的数据有副作用。比如 GET 一下，用户就下单了，返回订单已受理，这是不可接受的。没有副作用被称为幂等（Idempotent）。因为 GET 因为是读取，就可以对 GET 请求的数据做缓存。这个缓存可以做到浏览器本身上（彻底避免浏览器发请求），也可以做到代理上（如 nginx），或者做到 server 端（用 Etag，至少可以减少带宽消耗）

##### POST 请求[](#post-请求)

在页面里 `<form>` 标签会定义一个表单。点击其中的 submit 元素会发出一个 POST 请求让服务器做一件事。这件事往往是有副作用的，不幂等的。不幂等也就意味着不能随意多次执行。因此也就不能缓存。比如通过 POST 下一个单，服务器创建了新的订单，然后返回订单成功的界面。这个页面不能被缓存。试想一下，如果 POST 请求被浏览器缓存了，那么下单请求就可以不向服务器发请求，而直接返回本地缓存的“下单成功界面”，却又没有真的在服务器下单。那是一件多么滑稽的事情。因为 POST 可能有副作用，所以浏览器实现为不能把 POST 请求保存为书签。想想，如果点一下书签就下一个单，是不是很恐怖？。

此外如果尝试重新执行 POST 请求，浏览器也会弹一个框提示下这个刷新可能会有副作用，询问要不要继续。

![](https://ik.imagekit.io/moment/md-images/remote/cbbf75a57b38d2543094191ba07c1065_uGl_4KUDG.webp)

当然，服务器的开发者完全可以把 GET 实现为有副作用；把 POST 实现为没有副作用。只不过这和浏览器的预期不符。把 GET 实现为有副作用是个很可怕的事情。

## GET 和 POST 的区别

在接下来的内容中我们将会列举一系列的区别。

#### POST 和 GET 请求都不安全[](#post-和-get-请求都不安全)

我们常常会听到 GET 不如 POST 安全，因为 POST 用 body 传输数据，而 GET 用 url 传输，更加容易看到。但是从攻击的角度，无论是 GET 还是 POST 都不够安全，因为 HTTP 本身是明文协议。每个 HTTP 请求和返回的每个 byte 都会在网络上明文传播，不管是 url，header 还是 body。这完全不是一个 `是否容易在浏览器地址栏上看到` 的问题。

![](https://ik.imagekit.io/moment/md-images/remote/84c2a39fa1a1b6dc3ca370d5aa2608c7_mzDPTYlsq.webp)

为了避免传输中数据被窃取，必须做从客户端到服务器的端端加密。最普遍的做法就是使用 HTTPS，也就是使用 SSL 协议协商出密钥加密明文的 http 数据。这个加密的协议和 HTTP 协议本身相互独立。如果是利用 HTTP 开发公网的站点/App，要保证安全，https 是最最基本的要求。

> 虽然端到端加密不一定要依赖于 HTTPS，但在特殊领域，比如国内金融行业，通常会采用专用网络和定制的加密协议，如中国的国家标准 SM 系列算法。然而，除了军事、金融等高安全需求的领域之外，大多数情况下并不需要自己开发一个类似于 SSL 的加密协议。对于一般应用，现有的标准加密技术，如 HTTPS，已经足够安全且易于实施，同时避免了自行设计加密协议可能带来的复杂性和安全风险。

这个时候我们回到 HTTP 本身，我们应该都知道 GET 请求的参数更倾向于放在 URL 上，因此有更多机会被泄密。

比如携带私密信息的 url 会展示在地址栏上，还可以分享给第三方，就非常不安全了。`https://github.com/search?q=%E9%9D%93%E4%BB%94&type=repositories` 如果我们这个 url 中查询的参数有关于账号或者密码的话，那问题就挺大的了。

从客户端到服务器端，有大量的中间节点，包括网关，代理等。他们的 access log 通常会输出完整的 url，比如 nginx 的默认 access log 就是如此。如果 url 上携带敏感数据，就会被记录下来。但请注意，就算私密数据在 body 里，也是可以被记录下来的，因此如果请求要经过不信任的公网，避免泄密的唯一手段就是 https。

> NGINX 的 access log 是一个日志文件，用于记录所有传入 NGINX 服务器的请求。每当有请求到达服务器时，NGINX 都会在这个日志文件中记录下与该请求相关的详细信息。

如果是用作 API 接口的话，GET 实际上也可以带 body，POST 也可以在 url 上携带数据。所以实际上到底怎么传输私密数据，要看具体场景具体分析。当然，绝大多数场景，用 POST + body 里写私密数据是合理的选择。

下面是一个在 get 方法中使用 body 的方法，如下图所示：

![](https://ik.imagekit.io/moment/md-images/remote/47c45cbe4c4f3e89a476e771f8609c57_vgwh3tBbH.webp)

当我们点击发送的时候，在 nestjs 服务这边是能正常接收到 get 方法中传递的 body 参数的，如下图所示：

![](https://ik.imagekit.io/moment/md-images/remote/d68c4d48563f4cf9a7ba75cf40faf9e9_VLjNg3fwF.webp)

#### GET 请求可以缓存，POST 请求不能缓存[](#get-请求可以缓存post-请求不能缓存)

GET 请求通常用于检索信息，而不是更改服务器上的任何状态。由于 GET 请求具有幂等性（即多次执行相同的请求应该得到相同的结果），因此它们非常适合进行缓存。这意味着：

1. 浏览器可以缓存 GET 请求的响应，以加快未来对相同资源的访问。

2. 代理服务器和内容分发网络（CDN）也可以缓存这些响应，减少对源服务器的直接请求。

相比之下，POST 请求通常用于提交数据到服务器，以便创建或更改资源。这些请求的响应通常是特定于给定提交数据的，因此按照 HTTP 规范，默认情况下不应被缓存。然而：

1. 在某些特殊情况下，如果 POST 请求的响应包含明确的缓存指示（如 Cache-Control 或 Expires 头部），则可以对其进行缓存。但这种情况相对罕见，因为它可能导致存储过时或不正确的信息。

2. 尽管 POST 请求本身通常不被缓存，但它们可以影响后续 GET 请求的缓存。例如，如果你使用 POST 请求更新了数据，随后的 GET 请求可能需要获取最新的数据，而不是依赖缓存。

##### GET 请求和缓存[](#get-请求和缓存)

既然 GET 请求，那么它是可以有三个方法的，它分别可以缓存在浏览器缓存、代理缓存和服务器端缓存。

###### 浏览器缓存[](#浏览器缓存)

接下来我们用一个例子来学习一下浏览器缓存，首先编写后端代码：

```text
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
 
import { AppService } from './app.service';
 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
 
  @Get()
  getHello(@Res() res: Response) {
    console.log(111);
 
    res.set({
      'Cache-Control': 'public, max-age=120',
    });
 
    res.send('你好鸭，我是可以缓存的！！！');
  }
}
```

另外还需要编写前端代码，用来获取后端数据，这里我们使用的是 axios 来发送网络请求：

```text
import React from 'react';
import axios from 'axios';
 
const App = () => {
  const handle = async () => {
    axios
      .get('http://localhost:3000')
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return <div onClick={handle}>获取内容</div>;
};
 
export default App;
```

代码编写完成之后，有一个点药值得我们注意的是，需要在浏览器开发者工具中开启缓存：

![](https://ik.imagekit.io/moment/md-images/remote/faf692dc9af934aa094ff3694df68831_ZheTU7UKx.webp)

这时候，我们只要在浏览器上进行普通的网络请求，只要没有强制刷新浏览器页面，我们都是在这 7 秒之内可以实现缓存的（为了方便演示我把时间调到了七秒）：

![2024-01-19 11.31.36.gif](https://ik.imagekit.io/moment/md-images/remote/output.webp?updatedAt=1741657651203)

通过动图应该你能发现到，在缓存生效期间，网络请求是不会经过服务器的，如果经过的话会在控制台上面输出 `111` 的。

在上面的动图中，你可以清楚地看到，内容是在七秒内一直都是相同的一个信息，而在七秒之后，服务器修改了的数据才会发生变化，这样子我们就通过一个实际代码来了解到了浏览器缓存了。

![](https://ik.imagekit.io/moment/md-images/remote/d49cbadaabc0b67278ff1aeb0b635e33_eBUnMkrRi.webp)

这个是它的具体请求信息。

> 不同于 LocalStorage 的持久性存储，某些类型的浏览器缓存，特别是内存缓存，是临时存储在浏览器的渲染进程内存中的。在多进程架构的浏览器中，如 Chrome、Firefox 和 Safari，每个打开的标签页一般由独立的渲染进程管理。这些渲染进程负责网页内容的加载和渲染，因此也负责管理与这些操作相关的内存缓存。简而言之，这类缓存是存储在浏览器渲染进程的内存中，用于临时加快网页的加载和显示。

浏览器缓存，特别是内存缓存，更多用于临时存储。当您访问网页时，浏览器会将某些资源（如图片、CSS、JavaScript 文件）存储在内存缓存中，以便快速访问。一旦浏览器或标签页关闭，内存缓存中的数据通常会丢失。

对于一些数据，浏览器可能将其存储在硬盘缓存中，这样即使关闭浏览器后，这些数据也可以在下次浏览时快速加载。但与 LocalStorage 不同，硬盘缓存的数据更多是为了提高性能，而不是为了数据的长期存储。

总的来说，LocalStorage 更注重数据的持久性，而浏览器缓存（尤其是内存缓存）更注重提高网页加载的性能。

既然聊到缓存，那么必然少不了强缓存和协商缓存，那么我们分别来看看是如何实现的。

+ [强制缓存这么暴力，为什么不使用协商缓存 😡😡😡](https://juejin.cn/post/7248235392284721209)

###### 协商缓存[](#协商缓存)

首先我们使用 NestJs 编写如下应用程序：

```text
import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
 
@Controller()
export class AppController {
  @Get()
  getHello(@Req() req: Request, @Res() res: Response) {
    const content = '你好鸭，我是可以缓存的';
 
    // 生成 ETag
    const etag = crypto.createHash('sha256').update(content).digest('hex');
 
    // 检查 If-None-Match
    if (req.headers['if-none-match'] === etag) {
      res.status(304).send();
      return;
    }
 
    res.set({
      ETag: etag,
      // 设置 Cache-Control 以禁用强缓存，确保浏览器检查 ETag
      'Cache-Control': 'no-cache',
    });
 
    res.send(content);
  }
}
```

###### 代理服务器缓存[](#代理服务器缓存)

在用户和服务器之间的网络上，可能存在代理服务器（如公司或 ISP 的服务器），它们可以缓存 GET 请求的响应。这样，当相同的请求再次发出时，代理服务器可以直接提供缓存的响应，减少对原始服务器的访问。

假设我们有这样的一个服务，有一个前端项目，它首先会通过 NodeJs 来实现中间层，然后再由 NodeJs 向 java 服务器发送网络请求，最终把结果返回给 NodeJs 服务，再由其返回给前端，在这里，NodeJs 就是作为代理服务器。

当用户通过代理服务器请求数据时，代理服务器首先检查其缓存。如果请求的数据在缓存中存在（缓存命中），代理服务器将直接从缓存中返回数据。如果缓存中没有请求的数据（缓存未命中），代理服务器会将请求转发到目标服务器，然后将从目标服务器得到的响应数据存储到缓存中，同时返回给用户。

###### CDN 缓存[](#cdn-缓存)

内容分发网络（CDN）缓存是一种技术，旨在通过在全球分布的服务器上存储网站内容副本来加速数据的分发和访问。CDN 缓存可以显著提高网站性能，减少原始服务器的负载，并提供更快、更可靠的用户体验。

以下是 CDN 缓存的工作原理：

1. 内容复制：CDN 提供商将网站的内容（如 HTML 页面、图像、视频、CSS 和 JavaScript 文件）复制到其网络中多个地理位置分散的服务器上。

2. 请求重定向：当用户请求网站上的内容时，该请求被重定向到最接近用户的 CDN 节点。这通过 DNS 解析来实现，它会根据用户的地理位置确定最佳的服务器。

3. 内容交付：如果请求的内容在 CDN 节点上可用（即缓存命中），CDN 服务器将直接响应该请求，从而减少了数据传输时间。如果内容不在 CDN 缓存中（即缓存未命中），CDN 服务器会从原始服务器获取内容，响应用户的请求，同时将该内容缓存以备将来使用。

4. 缓存更新和失效：为保证内容的新鲜度和准确性，CDN 通常会定期检查缓存内容的有效性，并根据设定的规则（例如基于时间戳或内容更改）更新或删除旧内容。

#### GET 只能传输字符串，POST 可以传输多种类型数据？[](#get-只能传输字符串post-可以传输多种类型数据)

常见的说法有，比如 GET 的参数只能支持 ASCII，而 POST 能支持任意 binary，包括中文。但其实从上面可以看到，GET 和 POST 实际上都能用 url 和 body。因此所谓编码确切地说应该是 http 中 url 用什么编码，body 用什么编码。

首先我们先来了解一下 URL 只能支持 ASCII 的说法源自于官方文档 [RFC1738](https://www.ietf.org/rfc/rfc1738.txt)

> Thus, only alphanumerics, the special characters `$-_.+!*'(),`, and reserved characters used for their reserved purposes may be used unencoded within a URL.

实际上这里规定的仅仅是一个 ASCII 的子集\[a-zA-Z0-9$-\_.+!\*’(),\]。它们是可以“不经编码”在 url 中使用。比如尽管空格也是 ASCII 字符，但是不能直接用在 url 里。

那这个 `编码` 是什么呢？如果有了特殊符号和中文怎么办呢？一种叫做 percent encoding 的编码方法就是干这个用的。

字符被替换为 % 后跟其 ASCII 码的十六进制表示。例如，空格字符（ASCII 码 32）编码为 %20。 对于非 ASCII 字符（如中文或其他特殊符号），它们首先被转换为相应的字节序列（通常是 UTF-8 编码），然后每个字节都按照上述规则进行编码。

句几个例子：

1. 空格（ ）编码为 %20
2. 斜杠（/）编码为 %2F
3. 中文字符 `靓仔`（UTF-8 编码为 e9 9d 93 e4 bb 94）编码为 %E9%9D%93%E4%BB%94

尽管在浏览器地址栏可以看到中文。但这种 url 在发送请求过程中，浏览器会把中文用字符编码+Percent Encode 翻译为真正的 url，再发给服务器。浏览器地址栏里的中文只是想让用户体验好些而已。

我们再来看一下 Body，在 Body 中因为有个 Content-Type 来比较明确的定义，例如：

![](https://ik.imagekit.io/moment/md-images/remote/c950b49122a68b1a721b6915fc1ed3e7_KFRvaS-up.webp)

![](https://ik.imagekit.io/moment/md-images/remote/05840d392cb73a95769f7d0431c8b03d_jRtqov7ks.webp)

回到 POST，浏览器直接发出的 POST 请求就是表单提交，而表单提交只有 application/x-www-form-urlencoded 针对简单的 key-value 场景；和 multipart/form-data，针对只有文件提交，或者同时有文件和 key-value 的混合提交表单的场景。

在上面的内容中，第一个就是一个 multipart/form-data，而第二个就是 application/x-www-form-urlencoded。

如果是 Ajax 或者其他 HTTP Client 发出去的 POST 请求，其 body 格式就非常自由了，常用的有 json，xml，文本，csv……甚至是你自己发明的格式。只要前后端能约定好即可。

#### URL 的长度问题[](#url-的长度问题)

因为上面提到了不论是 GET 和 POST 都可以使用 URL 传递数据，也就是说我们常说的 GET 数据有长度限制其实是指 URL 的长度限制，是请求 POST 请求也可以使用 URL 传递数据。

HTTP 协议本身对 URL 长度并没有做任何规定。实际的限制是由客户端/浏览器以及服务器端决定的。先说浏览器。不同浏览器不太一样。

## 总结

GET 和 POST 请求本质上兵没有什么区别，你要说有什么区别的话那就是一个是因为单词 GET 和一个是因为单词 POST。

只是看你遵不遵循协议罢了，我可以将 POST 请求弄成幂等的，同样也可以把 GET 请求弄成是对服务器数据进行改变的。
