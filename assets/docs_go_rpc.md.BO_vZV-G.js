import{_ as e,c as a,o as r,a4 as t}from"./chunks/framework.BqiyKu1v.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"docs/go/rpc.md","filePath":"docs/go/rpc.md","lastUpdated":1711297244000}'),o={name:"docs/go/rpc.md"},c=t('<h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p>RPC（Remote Procedure Call）远程过程调用，它可以使一台主机上的进程调用另一台主机的进程，由以访为其他若干个主机提供服务，也就是我们常说的C/S服务，Server与Client之间通过rpc方式进行通信。</p><h2 id="官方库" tabindex="-1">官方库 <a class="header-anchor" href="#官方库" aria-label="Permalink to &quot;官方库&quot;">​</a></h2><p>net/rpc库使用encoding/gob进行编解码，支持TCP或HTTP数据传输方式, 由于其它语言不支持gob编解码方式,无法实现跨语言的rpc方法调用。</p><p>net/rpc/jsonrpc库实现rpc方法，jsonrpc采用的是json格式进行数据编码,支持跨语言rpc调用,但是是基于tcp协议实现的,不支持http协议.</p><h2 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h2><p>Go RPC的函数有特殊要求：</p><ul><li>函数首字母必须大写</li><li>必须只有两个参数，第一个参数是接收的参数，第二个参数是返回给客户端的参数，第二个参数必须是指针类型的</li><li>函数还要有一个返回值error</li></ul>',8),n=[c];function p(s,i,l,d,_,h){return r(),a("div",null,n)}const P=e(o,[["render",p]]);export{m as __pageData,P as default};
