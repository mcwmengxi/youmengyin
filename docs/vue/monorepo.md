# monorepo

>monorepo有别于常规项目结构，一个项目对于一个git仓库，为了更方便进行模块管理、依赖管理


- lerna 
- pnpm workspace
- turborepo

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


## 搭建组件库

```bash
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'examples/*'
  - 'docs'
```


```bash
# -w 代表在根目录操作
pnpm install -wD eslint typescript vite sass @vitejs/plugin-vue
pnpm install -wS vue

# --filter 选项过滤子模块
pnpm install -S lodash --filter utils
```

新增utils包
```bash
# mkdir index.ts
# packages/utils/package.json
{
  "name": "@qx-components/utils",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts"
}

# 根目录下添加新的依赖项
pnpm install -w @qx-ui/utils
```


**组件库文档**
```bash
# 主题插件支持
pnpm i -D vitepress-theme-demoblock --filter docs

# 配置 config.js
import { demoBlockPlugin } from 'vitepress-theme-demoblock'
markdown: {
  config: (md) => {
    md.use(demoBlockPlugin, { cssPreprocessor: 'scss' })
  }
}

# **注入主题和插件**

# register-components.js自动生成
"scripts": {
  "**register:com**ponents": "vitepress-rc"
}
```

## 集成lint代码规范工具

### 引言

- 如何集成 ESLint，控制代码风格？
- ESLint 如何与 Vue、TypeScript 配合使用？
- 如何集成 StyleLint，控制样式风格？
- StyleLint 如何与 Vue、SCSS 配合使用？
- Prettier 应该如何使用？
- 如何集成 commitlint 与 husky，控制提交信息风格？
- 如何实现增量 Lint 检查？更好地应对积重难返的“屎山”项目。

### ESLint

>ESLint 是在JS代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。

**了解配置字段**
```js
// 结合了 typescript-eslint 实现了对 TypeScript 的支持

module.exports = {
  "root": true,
  // 继承已有配置对象
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // ts支持
    "plugin:vue/vue3-recommended",
  ],

  // 如何理解代码
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },

  // 添加哪些规则
  "plugins": [ 
    "@typescript-eslint",
  ],

  // 已添加规则的开启 / 关闭
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": [
      2,
      {
        "allowString" : false,
        "allowNumber" : false
      }
    ]
  },

  
  // 对特殊文件应用特殊配置
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        // 所有 .vue 文件除了应用上面的公共规则配置外，还需应用的独特规则配置。
      },
    },
  ],
}
```

ESLint 如何理解代码？

parser 和 parserOptions 选项与 ESLint 如何理解我们的代码相关。这里分析器 @typescript-eslint/parser 负责解析 TypeScript 语言，将代码转化为 AST 语法树，便于进行分析。而 parserOptions 可以对解析器的能力进行详细设置。

ESLint 如何判断代码是否规范？

ESLint 提供了 自定义规则 的接口，开发者需要遵照接口，根据分析器的 AST 产物，实现规范检查逻辑，再将实现的多条规范聚合为 plugin 插件的形式。plugin 字段指定了 ESLint 应用什么规则集，具有理解哪些规范的能力。

规则的启用与禁用

有了规则集，能够理解规范，不代表 ESLint 就要对不规范的内容做出响应，还需要进一步在 rules 字段中对这些规则进行开启或者关闭的声明，只有开启的规则才会生效。

继承已有配置

面对琳琅满目的规则集，我们完全在项目中配置是不可取的。因此社区逐渐演进出了许多配置预设，让我们可以一键继承，从而减少绝大多数手动配置的工作量。例如例子中的 eslint:recommended、plugin:@typescript-eslint/recommended 就代表继承了 eslint 和 typescript-eslint 的推荐配置。

配置的重写
如果我们希望某些文件应用一些独特的配置，可以使用 overrides 字段实现。overrides 的每个成员对象都需要指定目标文件，除了应用所有父级配置之外，还要应用成员对象中声明的独有配置。ESLint 支持文件级别的重写。


#### 规则集的选型

eslint-config-airbnb: Airbnb 规则集
eslint-config-alloy：腾讯 AlloyTeam 的规则集
eslint-config-standard: StandardJS 规则集

#### 依赖安装

```bash
pnpm i -wD eslint

# 解析TypeScript、Vue
pnpm i -wD @typescript-eslint/parser @typescript-eslint/eslint-plugin

pnpm i -wD eslint-plugin-vue (eslint-plugin-import)

# 安装 Airbnb 规则集，便于我们一键继承
pnpm i -wD eslint-config-airbnb-base eslint-config-airbnb-typescript

# 编写配置文件时，提供完善的类型支持
pnpm i -wD eslint-define-config
```

#### 配置

```js
// .eslintrc.js

module.exports = {
  // 指定此配置为根级配置，eslint 不会继续向上层寻找
  "root": true,

  // 将浏览器 API、ES API 和 Node API 看做全局变量，不会被特定的规则(如 no-undef)限制。
  "env": {
    "browser": true,
    "es2022": true,
    "node": true,
  },

  // 继承已有配置对象
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // ts支持
    "plugin:vue/vue3-recommended",
  ],

  // 如何理解代码
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "sourceType": 'module',
    "project": ["./tsconfig.eslint.json"],
    // TypeScript 解析器也要负责 vue 文件的 <script>
    "extraFileExtensions": [".vue"],
    "ecmaVersion": 'ES2022'
  },

  // 添加哪些规则
  "plugins": [ 
    "@typescript-eslint",
  ],

  // 已添加规则的开启 / 关闭
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": [
      2,
      {
        "allowString" : false,
        "allowNumber" : false
      }
    ]
  },

  
  // 对特殊文件应用特殊配置
  "overrides": [
    {
      "files": ["*.vue"],
      "rules": {
        // 所有 .vue 文件除了应用上面的公共规则配置外，还需应用的独特规则配置。
      },
    },
  ],
}
```

>这里我们需要注意一下`parserOptions.project`字段，`TypeScript`解析器需要一个`tsconfig`文件来确认解析范围。

`tsconfig.json`已经被占用做其他用途(IDE 语言服务), 另外建立一个`ESLint`专用的文件`tsconfig.eslint.json`, 在其中包含所有希望被规范化的源码文件,这也是`typescript-eslint`官方为`monorepo`型工程推荐的一种解决方案[(Monorepo Configuration)](https://typescript-eslint.io/getting-started/typed-linting/monorepos/)

```json
{
  // eslint 检查专用，不要包含到 tsconfig.json 中
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    // 参考 https://typescript-eslint.io/linting/typed-linting/monorepos
    "noEmit": true
  },
  "include": [
    // 只检查，不构建，因此要包含所有需要检查的文件
    "**/*",
    "**/.*.*"
  ],
  "exclude": ["**/dist", "**/node_modules"]
}
```

## Stylelint


>Stylelint 是一个强大的 CSS 格式化工具，可以帮助使用者避免语法错误并统一编码风格。

```bash
pnpm i -wD stylelint stylelint-config-standard stylelint-config-recommended-vue stylelint-scss stylelint-config-standard-scss stylelint-order (stylelint-config-recess-order)
```

### 解决这个Unknown word (CssSyntaxError)Stylelint(CssSyntaxError)

1.给vscode-stylelint指定stylelint的配置文件
```json
"stylelint.configFile": ".stylelintrc.js"
```
2.stylelint的配置文件中指定语法为postcss-html
```js
module.exports={
  customSyntax: 'postcss-html',
}

// 使用ovrrides字段重写无效,只能换成postcss-html解析
customSyntax: 'postcss-scss',
"ovrrides": [
  {
    "files": [ '*.vue', '**/*.vue' ],
    "customSyntax": 'postcss-html'
  }
],
```

## Prettier

>Prettier 是一个固执己见的代码格式化工具

`ESLint` 和 `Stylelint` 本身就有控制代码风格的规则。只不过它们只针对 `JS / TS / CSS`,`Prettier`可以不进行这些文件格式化，所以`Prettier`显得有点是被边缘化的，但是你也可以使用Prettier来格式化, 如果你想详细了解如何配合使用`ESLint`、`Stylelint`和`Prettier`，使它们之间可以互相兼容，可以阅读这篇文章：[你不能再说你不会配置`ESLint`和`prettier`了](https://juejin.cn/post/7239987776552714300)

```json
// 项目级别配置 .vscode/settings.json
{
  // 已有配置...

  // 关闭 IDE 自带的样式验证
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  // 指定 stylelint 生效的文件类型(尤其是 vue 文件)。
  "stylelint.validate": ["css", "scss", "postcss", "vue"],

  // 启用 eslint 的格式化能力
  "eslint.format.enable": true,
  // eslint 会在检查出错误时，给出对应的文档链接地址
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  // 指定 eslint 生效的文件类型(尤其是 vue 文件)。
  "eslint.probe": ["javascript", "typescript", "vue"],
  // 指定 eslint 的工作区，使每个子模块下的 .eslintignore 文件都能对当前目录生效。
  "eslint.workingDirectories": [{"mode": "auto"}],
}

```
- `editor.codeActionsOnSave` 的相关配置，让 ESLint 和 Stylelint 的自动修复功能在保存文件时触发。 当然，部分复杂的错误无法自动修复，需要人工检视。
- 将默认的格式化工具设为 Prettier，但是禁用自动格式化，避免格式化与自动修复之间的冲突。自动格式化只对非 `ESLint` 和 `Stylelint` 目标的文件开启， 例如 `json`、`yaml`。

```json
// .vscode/settings.json
{
  // 已有配置。。。

  // 设置默认格式化工具为 Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 默认禁用自动格式化(手动格式化快捷键：Shift + Alt + F)
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,

  // 启用自动代码修复功能，保存时触发 eslint 和 stylelint 的自动修复。
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },

  // volar 可以处理 vue 文件的格式化
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },

  // json、yaml 等配置文件保存时自动格式化
  "[json]": {
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.formatOnSave": true
  },
  "[yaml]": {
    "editor.formatOnSave": true
  }
}

```

## commitlint

>commitlint 工具可以检查 Git 提交信息是否符合规范

```bash
pnpm i -wD @commitlint/config-conventional @commitlint/cli
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

## 通过 husky 集成到 Git hooks 中

Git 提供了一个叫做 Git Hooks 的功能，它能让我们在特定的重要动作发生时触发自定义脚本。
`Git Hooks`中的`commit-msg`钩子就正好可以在`commit`动作发生的时候执行`commitlint`脚本
>如果需要详细了解 Git Hooks 可以阅读以下文章：[一文带你彻底学会 Git Hooks 配置](https://juejin.cn/post/6844904194634153992)

```bash
pnpm i -wD husky
npx husky-init
```

## lint-staged 实现增量检查

>`lint-staged`包含一个可以执行任意`shell`任务的脚本，在执行脚本时以 暂存区 的文件列表作为参数，并支持按`glob`模式进行过滤。

`lint-staged`的目标就是这些`git add`后提交到暂存区的文件

如果你想更多地理解暂存区的概念，这里推荐一些博文：

[Git三大特色之Stage(暂存区)](https://juejin.cn/post/6844903634333876237)

[深入学习之前先理解 git 暂存区](https://juejin.cn/post/6844903479035576328)

当然，如果你对 Git 也不太了解，这里也推荐一个交互式的 Git 学习网站：

[Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN)

```bash
pnpm i -wD lint-staged

# pre-commit echo
npm run lint-staged
# package.json
{
  "scripts": {
    ...
    "lint-staged": "npx lint-staged"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix"
    ],
    "*.vue": [
      "stylelint --fix",
      "eslint --fix"
    ],
    "*.{scss,css}": [
      "stylelint --fix"
    ],
    "*.{html,json,md}": [
      "prettier --write"
    ]
  },
}
```

