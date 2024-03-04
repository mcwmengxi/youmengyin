`monnorepo`采用了单仓库多项目的代码管理方式，先比与传统的`multi-repo`模式，更有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。传统模式下多个子包往往是相互依赖的，一个包更新后，其它包也需要按照特定顺序进行更新。
通过`monorepo`模式，任意一个模块发生修改，另一个模块能够立即反馈而不用走繁琐的发布和依赖更新流程；各个模块之间也能够充分复用配置、CI 流程的脚本；各个包的版本和互相之间的依赖关系得到集中管理。

- [Monorepo - 优劣、踩坑、选型]: https://juejin.cn/post/7215886869199896637

- [为什么越来越多的项目选择 Monorepo？]: https://juejin.cn/post/7207743145999368229

## monorepo 适用案例

**A. 核心库与周边适配器**

Vue、 CkEditor 、UnoCSS

**B. UI 组件库**

element-plus、tiny-vue varlet

**C. 常规 Web 应用**

传统 Web 应用，采用 monorepo 模式也有利于代码的复用，促使团队成员以组件化的思想进行开发，不断抽离公共模块，产生技术沉淀。

```bash
├── packages
|   ├── portal    # 门户网站
|   ├── mis       # 管理后台
|   ├── mobile    # 移动端网站
|   ├── docs      # 开发文档
|   ├── shared    # 公共库
|   ├── api       # API 层
|   ├── ...       # 监控埋码、Nodejs 服务、更多公共模块...
├── package.json
```

## 包管理基础 package.json

package.json 中的字段并没有一个绝对统一的标准，除了官方约定的部分标准字段外，很多字段其实是特定的工具约定的，所以我们分析配置的时候，要明确一个关键点，即这个字段到底由谁读取。

- [官方文档：package.json]: https://docs.npmjs.com/cli/v9/configuring-npm/package-json#homepage
- [你真的了解package.json吗？]: https://juejin.cn/post/6987179395714646024

- [关于前端大管家,package.json，你知道多少？]: https://juejin.cn/post/7023539063424548872


**name**

name 是区分npm包的唯一标识。当一个npm仓库中的包被安装到本地，我们能通过名称引用，而不必写复杂的 node_modules/... 引入路径就是得益于此。
对于包名称我们还要了解一个概念叫坐标，具有相同坐标的包会被安装到同一子目录下。例如 @vue/reactivity 和 @vue/runtime-core 会被安装到 node_modules 目录的 @vue 目录下，vue 不属于任何坐标，就会被安装到 node_modules 根目录。
通常情况下，属于同一个体系、项目下的包会被安排在一个坐标下，比如我们创建的示例项目就都会发布到 @openxui 这个坐标下，那么包名就需要设定为 @openxui/xxx

**version**
version 字段表示包的版本号，大致符合 x.x.x 的格式(主版本号.次版本号.修订号)

**基本信息**

```json
{
  "name": "vue",
  // 一句话简介，可以作为关键字搜索的依据
  "description": "The progressive JavaScript framework for building modern web UI.",
  // 关键字、标签，正确设置可以提高在 npm 的搜索权重与曝光度
  "keywords": ["vue"],
  // 包的作者，主要 Owner
  "author": "Evan You",
  // 开源许可证
  "license": "MIT",
  // 项目主页
  "homepage": "https://github.com/vuejs/core/tree/main/packages/vue#readme",
  // 源码仓库
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/core.git"
  },
  // BUG 反馈方式，支持 `bugs.email` 邮箱字段
  "bugs": { 
    "url" : "https://github.com/vuejs/core/issue"
  }
}
```

**入口信息**

入口信息主要被 Node.js、各路构建工具(Vite / Rollup / Webpack / TypeScript)所识别。未正确设置会导致 npm 包无法被加载或者实际加载了预料之外的文件。

[package.json 导入模块入口文件优先级详解]: https://juejin.cn/post/7225072417532739644

同时可能需要有模块化规范的前置知识, 至少应该了解 cjs、esm 两种现代化规范
[阮一峰 - ES6 Module 的加载实现]: https://es6.ruanyifeng.com/#docs/module-loader
[ESM和CJS模块杂谈]: https://juejin.cn/post/7048276970768957477

这里列举几个需要被关注的入口信息字段：`main`、`module`、`types`、`exports`。我们尽量使用贴近实践的描述，以代码中引入方式的不同来分析它们之间的区别：

1. main 和 exports['.'].require 字段用于设置 require() 方式的加载入口(cjs 规范)

```json
// 入口定义
{
  "name": "my-module",
  "main": "index.js",
  "exports": {
    ".": {
      "require": "index.js"
    },
    // ...
  }
}

// 代码中使用
const app = require('my-module') // 实际路径 node_modules/my-module/index.js
```

2. module 和 exports.*.import 字段用于设置 import 的加载入口(esm 规范 import { ref } from 'vue')。
```json
// 入口定义
{
  "name": "my-module",
  "main": "index.js",
  "module": "index.mjs",
  "exports": {
    ".": {
      "require": "index.js",
      "import": "index.mjs"
    },
    // ...
  }
}

// 代码中使用
import app from 'my-module' // 实际路径 node_modules/my-module/index.mjs
```

3. types 和 exports.*.types 字段用于设置 d.ts 类型声明的加载入口(TypeScript 专属)。
```json
// 入口定义
{
  "name": "my-module",
  "main": "index.js",
  "module": "index.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "require": "index.js",
      "import": "index.mjs",
      "types": "index.d.ts"
    },
    // ...
  }
}
```

4. exports 比起 main、module、types，它可以暴露更多的出口，而后者只能定义主出口。
```json
// 入口定义
{
  "name": "my-module",
  "main": "index.js",
  "exports": {
    ".": {
      "require": "index.js",
    },
    "./locale/*": {
      "require": "./locale/*",
    },
    "./plugins/*": {
      "require": "./dist/plugins/*",
    }
    // ...
  }
}
// 使用
const app = require('my-module') // 实际路径 node_modules/my-module/index.js
const zhCn = require('my-module/locale/zh-Cn') // 实际路径 node_modules/my-module/locale/zh-Cn.js
const testPlugin = require('my-module/plugins/test') // 实际路径 node_modules/my-module/dist/plugins/test.js
// import 同理

```

**依赖信息**

版本约束限制了包管理器为项目安装依赖时可选的版本范围：

- ^ 的含义是安装最新的 minor 版本。例如 ^1.2.0 的约束下，会为项目安装最新的 minor 版本 1.X.Y，但不会安装下一个 major 版本 2.0.0。
- ~ 的含义是安装最新的 patch 版本。例如 ~1.2.0 的约束下，会为项目安装最新的 patch 版本 1.2.X，但不会安装下一个 minor 版本 1.3.0。
- 如果版本号前面没有任何标识符，表示固定版本号，无论如何都只安装这个固定版本。

| 依赖类型         | 项目中     | 依赖中                                                       | 用途                                                         |
| ---------------- | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| dependencies     | 会被安装   | 会被安装                                                     | 项目运行时依赖                                               |
| devDependencies  | 会被安装   | 不会被安装                                                   | 项目在开发过程需要的依赖。一般构建工具、测试框架、代码规范工具都会被作为开发依赖 |
| peerDependencies | 不会被安装 | 不会被安装。但是若其中声明的依赖没有被项目安装，或者版本不匹配时，会生成警告信息提示用户 | 定义项目需要的依赖环境。常用于表示插件和主框架的关系，如 `@vitejs/plugin-vue` 的 `peerDependencies` 中就声明了主框架 `vite` 和 `vue` |

[新一代包管理工具 pnpm 使用心得]:https://juejin.cn/post/7124613898115743757
[一文彻底看懂 package.json 中的各种 dependencies]:https://juejin.cn/post/7137228673156907044

**发布信息**
files, 指定了发布为 npm 包时，哪些文件或目录需要被提交到 npm 服务器中
```json
{
  "files": [
    "LICENSE",
    "README.md",
    "dist"
  ]
}
```

**private**
private 用于指定项目是否为私有包。

**publishConfig**
```json
{
  "publishConfig": {
    "registry": "https://mynpm.com",
  },
}
```

**脚本信息**
脚本信息的读取方只有包管理器。这是包管理器给我们提供的一项福利功能，允许我们给复杂的命令赋予一个简单的别名。
```json 
{
  "script": {
    "show": "echo 'Hello World!'",
    "dev": "vite"
  },
  "dependencies": {
    "vite": "^4.3.0"
  }
}

```
运行 npm run dev 就可以调用 vite 的命令行程序，启动 vite 开发服务器。然而直接在命令行中执行 vite 命令是会报错的，这是因为包管理器会将项目中所有相关的可执行命令二进制文件放入 node_modules/.bin 中，这个目录会在运行时被加入到系统环境变量 PATH。

## pnpm 
它具有以下优势：

速度快：多数场景下，安装速度是 npm/yarn 的 2 - 3 倍。
基于内容寻址：硬链接节约磁盘空间，不会重复安装同一个包，对于同一个包的不同版本采取增量写入新文件的策略。
依赖访问安全性强：优化了 node_modules 的扁平结构，提供了限制依赖的非法访问(幽灵依赖)的手段。
支持 monorepo：自身能力就对 monorepo 工程模式提供了有力的支持。在轻量场景下，无需集成 lerna、Turborepo 等工具。

### workspace 模式

代码仓的根目录下存有 pnpm-workspace.yaml 文件指定哪些目录作为独立的工作空间，这个对立空间可以看做是一个子模块或包，`pnpm`通过目录下的`package.json`文件的`name`来识别一个工作空间。
在`workspace`模式下, 项目根目录不会作为一个子模块或包， 而是作为一个管理中枢，执行一些全局操作，安装公共依赖。

`-w`代表在`monorepo`模式下的根目录操作
```pnpm install -wD vite```

**子包管理操作**

在`workspace`模式下，`pnpm`主要通过`--filter`选项过滤子模块，实现对各个工作空间进行精细化操作的目的。

1.为指定模块安装外部依赖

```bash
# 为 a 包安装 lodash
pnpm --filter a i -S lodash
pnpm --filter a i -D lodash
```

2. 指定内部模块之间的互相依赖

- 指定模块之间的互相依赖。下面的例子演示了为a包安装内部依赖b
```bash
# 指定 a 模块依赖于 b 模块
pnpm --filter a i -S b

```
- 内部模块a依赖的是内部模块b
```bash
{
  "name": "a",
  // ...
  "dependencies": {
    "b": "workspace:^"
  }
}

# 在实际发布 npm 包时，workspace:^ 会被替换成内部模块 b 的对应版本号(对应 package.json 中的 version 字段)。替换规律如下所示

{
  "dependencies": {
    "a": "workspace:*", // 固定版本依赖，被转换成 x.x.x
    "b": "workspace:~", // minor 版本依赖，将被转换成 ~x.x.x
    "c": "workspace:^"  // major 版本依赖，将被转换成 ^x.x.x
  }
}
```

```bash
# 发布所有包名为 @a/ 开头的包
pnpm --filter @a/* publish

# 为 a 以及 a 的所有依赖项执行测试脚本
pnpm --filter a... run test
# 为 b 以及依赖 b 的所有包执行测试脚本
pnpm --filter ...b run test

# 找出自 origin/master 提交以来所有变更涉及的包
# 为这些包以及依赖它们的所有包执行构建脚本
# README.md 的变更不会触发此机制
pnpm --filter="...{packages/**}[origin/master]"
  --changed-files-ignore-pattern="**/README.md" run build

# 找出自上次 commit 以来所有变更涉及的包
pnpm --filter "...[HEAD~1]" run build

```

## 幽灵依赖
