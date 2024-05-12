# 通过 `Node` 实现 `wt_cli`

## 引言
命令行工具是一种在命令行界面（CLI）中运行的软件工具，可以通过在命令行中输入特定的命令和参数来执行各种任务。与图形界面（GUI）不同，命令行工具通常不提供可视化的界面，而是依赖于用户熟悉和输入正确的命令和参数来进行操作。命令行工具通常用于自动化系统管理、批量处理、编程开发、网络管理等各种任务，也经常在操作系统的维护和修复中使用。常见的命令行工具包括 Windows 中的 PowerShell 和 Linux/UNIX 中的bash、grep、awk、sed 等等。

## 实现

### 1. 初始化项目
```bash
# 1. 创建 wt_cli 文件夹
mkdir wt_cli
# 2. 进入 wt_cli 文件夹
cd wt_cli

# 3. 初始化项目
npm init -y
```
> 此时会看到`wt_cli`文件夹下多了一个 `package.json` 文件
```
{
  "name": "wt_cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
> 修改 `package.json` 文件，添加 `type` 字段
```
{
  "name": "wt_cli",
  "version": "1.0.0",
  "type": "module",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
### 2. 在 `wt_cli` 文件夹下创建 `bin/index.js` 文件
> 该文件是 `wt_cli` 命令的入口文件
```bash
# 此时的目录结构
wt_cli
|__bin
    |__index.js
|__package.json
```

### 3. 安装 `commander` 模块
> 该模块用于解析命令行参数
```bash
# 安装
npm install commander
```

### 4. 修改 `bin/index.js` 文件内容
```js
#! /usr/bin/env node
/**
 * #! 符号的名称叫 Shebang，用于指定脚本的解释程序
 * node cli 应用入口文件必须要有这样的文件头
 */

import { program } from 'commander';

const version = '1.0.0'

// 设置版本
program
  .version(`v${version}`)
  .usage('<command> [option]')

// 解析用户执行命令传入参数
program.parse(process.argv)
```
> 在`package.json`文件添加`bin`字段，
```json
{
  "name": "wt_cli",
  "version": "1.0.0",
  "type": "module",
  "description": "",
  "bin": {
    "wt": "./bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "commander": "^11.1.0"
  }
}
```

### 5. 使用 `npm link` 链接到全局
1. 在 wt_cli 文件夹下执行 npm link 命令
```bash
npm link
```

2. 随便在一个文件夹下执行 wt 命令
```bash
wt --help

# 如果出现以下内容，说明 wt 命令已经链接到全局了
Usage: index <command> [option]

Options:
  -V, --version  output the version number
  -h, --help     display help for command

```

### 6. 自定义`wt text`命令，输入什么，就在命令行输出什么
> 修改 `bin/index.js` 文件内容
```js
...

// 监听 text 命令
program
  .command('text <content>')
  .description('打印内容')
  .option('-f, ', '配置项')
  .action((content, options) => {
    console.log(content, options)
  })

...
```

### 7. 测试
> 执行 `wt text` 命令
```bash
wt text 123afdfdf
# 输出内容
123afdfdf {}


wt text 123afdfdf -f
# 输出内容
123afdfdf { f: true }
```

### 8. 总结
> 至此为止，已成功通过`Node`实现一个最简单的`Cli`工具。后续只需丰富不同的命令即可。

## 命令行常用插件
1. chalk: 用于修改终端输出字符样式
2. request: 用于发起网络请求
3. download: 下载远程仓库
4. commander: 命令行处理工具
5. user-home: 用户根目录
6. tildify: 波浪符路径转换
7. inquirer: 一组常见的交互式命令行用户界面
8. ora: 用于node的控制台进度美化