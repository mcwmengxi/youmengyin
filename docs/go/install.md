## Go语言

> Go 是一个开源的编程语言，它能让构造简单、可靠且高效的软件变得容易。

先从环境安装开始，输出一个 Hello World。

## 环境安装

### macOS安装
**方式一：**

通过 brew 安装

```
brew install go
```



**方式二：**

通过安装包安装

地址：https://dl.google.com/go/go1.12.darwin-amd64.pkg

下载之后直接点击安装，一步步继续即可。


**配置环境变量**

```
vi ~/.bashrc

//新增
export GOROOT=/usr/local/go
export GOPATH=/Users/username/go/code //代码目录，自定义即可
export PATH=$PATH:$GOPATH/bin
```

及时生效，请执行命令：source ~/.bashrc

**如果命令行使用的是zsh，请修改 .zshrc 文件。**

```
vi ~/.zshrc

//新增
export GOROOT=/usr/local/go
export GOPATH=/Users/username/go/code //自定义代码目录
export PATH=$PATH:$GOPATH/bin
```

及时生效，请执行命令：source ~/.zshrc

验证是否安装成功，命令行下执行：go -version

### Windows安装
Go官网下载地址: https://golang.org/dl/

**环境变量配置（ GOROOT、GOPATH、Path ）**
添加`GOROOT、GOPATH`变量, 对应安装路径和项目路径
![](https://img-blog.csdnimg.cn/59672076b7724481a89da752668dd584.png)
path编辑添加`%GOROOT%\bin`
![](https://img-blog.csdnimg.cn/ef70da7931634a4f87950d3b34374818.png)
安装Go语言开发工具包 ctrl+Shift+P
输入框中输入go:install 会自动搜索相关命令，选择Go:Install/Update Tools

#### 安装失败解决办法：

在GOPATH的src目录下创建golang.org/x目录

在GOPATH/src/golang.org/x目录下

执行 `git clone https://github.com/golang/tools.git ` 命令

执行` git clone https://github.com/golang/lint.git `命令

接着执行`go env -w GOPROXY="https://goproxy.cn" `

按下`Ctrl/Command+Shift+P`再次执行 `Go:Install/Update Tools` 命令，在弹出的窗口全选并点击确定，这一次的安装都会SUCCESSED了,有些会报一些命令不存在，但好像不影响安装，就没去深究了


#### 或者 使用go mod 代理安装

::: details 查看代码

```
# Go 1.13 及以上（推荐）

# Windows执行
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct

# Windows PowerShell 执行 
$env:GO111MODULE = "on"
$env:GOPROXY = "https://goproxy.cn"

# macOS 或 Linux 执行
export GO111MODULE=on
export GOPROXY=https://goproxy.cn

# 或者  macOS 或 Linux 执行
echo "export GO111MODULE=on" >> ~/.profile
echo "export GOPROXY=https://goproxy.cn" >> ~/.profile
source ~/.profile


// 手动安装
go get -u -v github.com/mdempsky/gocode
go get -u -v github.com/uudashr/gopkgs/v2/cmd/gopkgs
go get -u -v github.com/ramya-rao-a/go-outline
go get -u -v github.com/acroca/go-symbols
go get -u -v golang.org/x/tools/cmd/guru
go get -u -v golang.org/x/tools/cmd/gorename
go get -u -v github.com/cweill/gotests/...
go get -u -v github.com/fatih/gomodifytags
go get -u -v github.com/josharian/impl
go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct
go get -u -v github.com/haya14busa/goplay/cmd/goplay
go get -u -v github.com/godoctor/godoctor
go get -u -v github.com/go-delve/delve/cmd/dlv
go get -u -v github.com/stamblerre/gocode
go get -u -v github.com/rogpeppe/godef
go get -u -v github.com/sqs/goreturns
go get -u -v golang.org/x/lint/golint
```
:::

项目下执行：go mod init 项目名 生成 go.mod

**vscode设置**
::: details 查看代码
```json
{
 "go.buildOnSave": true,
 "go.buildFlags": [],
 "go.buildTags": "",
 "go.lintOnSave": true,
 "go.formatOnSave": true,
  "go.gopath": "D:\\project\\go",
  "go.goroot": "D:\\Software\\Go",
}
```
:::


运行方法1 `go run hello.go`
运行方法2 安装`code runner` 插件,执行按钮执行
运行方法3 设置F5 `launch.json`里添加Go环境Debug执行

::: details 查看代码
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "LaunchGo",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "remotePath": "",
      "port": 5546,
      "host": "127.0.0.1",
      "program": "${fileDirname}",
      "env": {
        "GOPATH": "D:/project/go",
        "GOROOT": "D:/SoftWare/Go"
      },
      "args": [],
      //"showLog": true
    }
  ]
}
```
:::

## 目录结构

**bin**

存放编译后可执行的文件。

**pkg**

存放编译后的应用包。

**src**

存放应用源代码。

例如：

```
├─ code  -- 代码根目录
│  ├─ bin
│  ├─ pkg
│  ├─ src
│     ├── hello
│         ├── hello.go
```

**Hello World 代码**

```
//在 hello 目录下创建 hello.go

package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello World!")
}
```


## 命令

**go build hello**

在src目录或hello目录下执行 go build hello，只在对应当前目录下生成文件。

**go install hello**

在src目录或hello目录下执行 go install hello，会把编译好的结果移动到 $GOPATH/bin。

**go run hello**

在src目录或hello目录下执行 go run hello，不生成任何文件只运行程序。

**go fmt hello**

在src目录或hello目录下执行 go run hello，格式化代码，将代码修改成标准格式。

其他命令，需要的时候再进行研究吧。

## 开发工具

**GoLand**


GoLand 是 JetBrains 公司推出的 Go 语言集成开发环境，与我们用的 WebStorm、PhpStorm、PyCharm 是一家，同样支持 Windows、Linux、macOS 等操作系统。

下载地址：https://www.jetbrains.com/go/

软件是付费的，不过想想办法，软件可以永久激活的。

## 学习网址

- Go语言：https://golang.org/
- Go语言中文网：https://studygolang.com/
- Go语言包管理：https://gopm.io/