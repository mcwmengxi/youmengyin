## 概述

RPC（Remote Procedure Call）远程过程调用，它可以使一台主机上的进程调用另一台主机的进程，由以访为其他若干个主机提供服务，也就是我们常说的C/S服务，Server与Client之间通过rpc方式进行通信。

## 官方库

net/rpc库使用encoding/gob进行编解码，支持TCP或HTTP数据传输方式, 由于其它语言不支持gob编解码方式,无法实现跨语言的rpc方法调用。

net/rpc/jsonrpc库实现rpc方法，jsonrpc采用的是json格式进行数据编码,支持跨语言rpc调用,但是是基于tcp协议实现的,不支持http协议.

## 实现

Go RPC的函数有特殊要求：
- 函数首字母必须大写
- 必须只有两个参数，第一个参数是接收的参数，第二个参数是返回给客户端的参数，第二个参数必须是指针类型的
- 函数还要有一个返回值error