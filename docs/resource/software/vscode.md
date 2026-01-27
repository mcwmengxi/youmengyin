---
description: 'Visual Studio Code 配置，记录扩展插件、使用小技巧和个人配置'
---
<BackTop />

# Visual Studio Code 配置

## 扩展插件推荐

### 主题相关

- `One Dark Pro`

  - 黑色主题
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)

- `Shades of Purple`

  - 紫色主题（来自彤姐的推荐：没有什么比骚更重要）
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=ahmadawais.shades-of-purple)

- `Dracula Official`

  - 黑色主题
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula)

- `Bluloco Dark`

  - 黑色主题
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=uloco.theme-bluloco-dark)

- `Material Icon Theme`

  - 文件图标美化
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

- `background`
  - 自定义背景
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

### HTML 相关

- `Auto Close Tag`

  - 自动添加 HTML / XML 关闭标签
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

- `Auto Rename Tag`

  - 自动重命名配对的 HTML / XML 标签
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

- `Highlight Matching Tag`

  - Tag 高亮匹配标记
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag)

### React 相关

- `ES7 React/Redux/GraphQL/React-Native snippets`
  - 提供 ES7 中的 JavaScript 和 React / Redux 片段，以及针对 VS Code 的 Babel 插件功能
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

### Vue 相关

- `Vue 2 Snippets`

  - 基于最新的 Vue 2 的 API 添加了 Code Snippets
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets)

- `Vetur`
  - `Vue` 文件语法高亮、片段整理、错误检查、格式化
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

### CSS 相关

- `Easy LESS`

  - 保存时自动将 `less` 自动编译为 `css`
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=mrcrowl.easy-less)

- `language-stylus`

  - 增加对 `stylus` 的支持
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=sysoev.language-stylus)

- `px to rem`
  - `px` 和 `rem` 互相转换
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=sainoba.px-to-rem)

### AI 代码提示和生成

- `GitHub Copilot`

  - [插件地址](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

- `Tabnine`
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)

### Markdown 相关

- `markdownlint`

  - Markdown / CommonMark 标记和样式检查
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

- `Markdown Preview Enhanced`

  - 为 Markdown 增加大纲、导出 PDF PNG JPEG HTML、自定义预览样式
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)
  - [官网](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/)

### Git 相关

- `GitLens — Git supercharged`
  - 增强构建在 VS Code 中的 `Git` 功能
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

### 格式和代码检查相关

- `ESLint`

  - 将 ESLint JavaScript 集成到 VS Code 中
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- `Prettier - Code formatter`

  - 代码格式化
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- `Code Spell Checker`

  - 代码拼写检查
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

- `Error Lens`

  - 突出显示代码错误和警告
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

- `Sort package.json`

  - 对 `package.json` 文件进行排序
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=unional.vscode-sort-package-json)

### 调试相关

- `Live Server`
  - 启动具有实时重新加载功能的本地开发服务，以处理静态和动态页面
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 语法支持

- `EditorConfig for VS Code`

  - 增加对 `.editorconfig` 的支持
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

- `ENV`

  - .env 文件键值字符串高亮和格式化
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=IronGeek.vscode-env)

### 开发体验提升

- `Auto Import`

  - 自动查找，解析并提供所有可用导入的代码操作和代码完成。
    与 `Typescript` 和 `TSX` 一起使用
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)

- `Import Cost`

  - 在编辑器中显示导入/需要包的大小（PS：小内存用户不建议使用，说的就是你这个用 8G 的）
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

- `Image preview`

  - 在行号边上、悬停时显示图像预览
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)

- `Path Intellisense`

  - 自动补全文件名
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

- `npm Intellisense`

  - 可自动完成导入语句中的 npm 模块
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)

- `Chinese (Simplified) Language Pack for Visual Studio Code`

  - 适用于 VS Code 的中文（简体）语言包
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)

- `es6-string-html`

  - ES6 模板字符串高亮
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)

- `Todo Tree`

  - 在树视图中显示 TODO FIXME 等注释标记
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)

- `FnMap - 函数地图`

  - 函数列表、位置标记、快速跳转、符号置顶、关键词搜索
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=chensuiyi.fn-map)

### 微信小程序相关

- `WXML - Language Service`
  - 微信小程序标签、属性的智能补全（同时支持原生小程序、`mpvue` 和 `wepy` 框架，并提供 snippets）
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=qiu8310.minapp-vscode)

### 其他

- `韭菜盒子`
  - 看股票、基金实时数据
  - [插件地址](https://marketplace.visualstudio.com/items?itemName=giscafer.leek-fund)

## 使用小技巧

### 删除空行

1. 打开替换 `Alt + ⌘ + F`
2. 输入 `^\s*(?=\r?$)\n`
3. 勾选使用正则表达式 `Alt + ⌘ + R`
4. 全部替换 `⌘ + Enter`

## 安装 code 命令

`code` 命令可以直接打开一个文件或者文件目录

1. 使用 `shift + command + p` 打开命令面板
2. 输入 `shell command` 进行搜索
3. 点击 `Shell 命令：在 PATH 中安装 “code” 命令`

```sh
# 在 vscode 中编辑当前目录下的文件
code .

# 在 vscode 中编辑该文件（当文件不存在时会先创建该文件）
code [文件名]
```

## webpack 项目识别 alias

1. 在项目根目录新建 `jsconfig.json` 或 `tsconfig.json`
2. 添加以下代码，其中 `paths` 字段的值要与你项目配置的 `alias` 一致

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

## 快捷键

```json
  // 对于 行 的操作：
  // 重开一行：光标在行尾的话，回车即可；不在行尾，ctrl + enter 向下重开一行；ctrl+shift + enter 则是在上一行重开一行
  // 删除一行：光标没有选择内容时，ctrl + x 剪切一行；ctrl +shift + k 直接删除一行
  // 移动一行：alt + ↑ 向上移动一行；alt + ↓ 向下移动一行
  // 复制一行：shift + alt + ↓ 向下复制一行；shift + alt + ↑ 向上复制一行
  // ctrl + z 回退
  // 对于 词 的操作：
  // 选中一个词：ctrl + d
  // 搜索或者替换：
  // ctrl + f ：搜索
  // ctrl + alt + f： 替换
  // ctrl + shift + f：在项目内搜索
  // 通过Ctrl + ` 可以打开或关闭终端
  // Ctrl+P 快速打开最近打开的文件
  // Ctrl+Shift+N 打开新的编辑器窗口
  // Ctrl+Shift+W 关闭编辑器
  // Home 光标跳转到行头
  // End 光标跳转到行尾
  // Ctrl + Home 跳转到页头
  // Ctrl + End 跳转到页尾
  // Ctrl + Shift + [ 折叠区域代码
  // Ctrl + Shift + ] 展开区域代码
  // Ctrl + / 添加关闭行注释
  // Shift + Alt +A 块区域注释
```

## 推荐配置

```json
{
  "individualEmoji.specified.enable": true,
  "individualEmoji.specified.typeConfig": [
    [
      "begin",
      [
        "🎉"
      ]
    ], //:tada: Begin a project. 开始一个项目
    [
      "work",
      [
        "🚧"
      ]
    ], //:construction: Work in progress. 工作进行中
    [
      "feat",
      [
        "✨"
      ]
    ], //:sparkles: Introduce new features. 添加新功能
    [
      "docs",
      [
        "📝"
      ]
    ], //:memo: Add or update documentation. 增加或更新文档
    [
      "config",
      [
        "🔧"
      ]
    ], //:wrench: Add or update configuration files.
    [
      "comment",
      [
        "💡"
      ]
    ], //:bulb: Add or update comments in source code. 增加/更新源代码中的注释
    [
      "rename",
      [
        "🚚"
      ]
    ], //:truck: Move or rename resources (e.g.: files, paths, routes). 移动/重命名文件/路径
    [
      "chore",
      [
        "🔥"
      ]
    ], //:fire: Remove code or files.
    [
      "fix",
      [
        "🐛"
      ]
    ], //:bug: Fix a bug. 修复bug
    [
      "revert",
      [
        "⏪️"
      ]
    ], //:rewind: Revert changes. 回退
    [
      "typos",
      [
        "✏️"
      ]
    ], //:pencil2: Fix typos. 修改错别字
    [
      "merge",
      [
        "🔀"
      ]
    ], //:twisted_rightwards_arrows: Merge branches. 合并分支
    [
      "pref",
      [
        "⚡️"
      ]
    ], //:zap: Improve performance. 性能优化
    [
      "style",
      [
        "🎨"
      ]
    ], //:art: Improve structure / format of the code. 改进代码结构或格式
    [
      "test",
      [
        "✅"
      ]
    ], //:white_check_mark: Add, update, or pass tests.         增加/更新测试用例
    [
      "package",
      [
        "📦️"
      ]
    ], //:package: Add or update compiled files or packages.    增加/更新编译后文件/包
    [
      "log",
      [
        "🔊"
      ]
    ], //:loud_sound: Add or update logs. 增加/更新日志
    [
      "contributor",
      [
        "👥"
      ]
    ], //:busts_in_silhouette: Add or update contributor(s). 增加/更新贡献者
    [
      "refactor",
      [
        "♻️"
      ]
    ], //:recycle: Refactor code. 重构代码
    [
      "build",
      [
        "🚀"
      ]
    ], //:rocket: Deploy stuff. 构建和部署功能
    [
      "release",
      [
        "🔖"
      ]
    ] //:bookmark: Release / Version tags. 发行版本标签

    // # ====常用颜文字====
    // # 🐭 🐁 🤡 🐶
    // # 🎉 :tada: Begin a project.                                开始一个项目
    // # 🚧 :construction: Work in progress.                       工作进行中
    // # ✨ :sparkles: Introduce new features.                     添加新功能
    // # 📝 :memo: Add or update documentation.                    增加或更新文档
    // # 🔧 :wrench: Add or update configuration files.            增加/更新配置文件
    // # 💄 :lipstick: Add or update the UI and style files.       增加/更新UI和样式文件
    // # 💡 :bulb: Add or update comments in source code.          增加/更新源代码中的注释
    // # 🚚 :truck: Move or rename resources (e.g.: files, paths, routes). 移动/重命名文件/路径
    // # 🔥 :fire: Remove code or files.                           移除代码/文件
    // # 🐛 🦖 :bug: Fix a bug.                                       修复bug
    // # 🚑️ :ambulance: Critical hotfix.                           紧急修复
    // # ⏪️ :rewind: Revert changes.                               回退
    // # ✏️ :pencil2: Fix typos.                                   修改错别字
    // # 🔀 :twisted_rightwards_arrows: Merge branches.            合并分支
    // # ⚡️ :zap: Improve performance.                             性能优化
    // # 🎨 :art: Improve structure / format of the code.          改进代码结构或格式
    // # ✅ :white_check_mark: Add, update, or pass tests.         增加/更新测试用例
    // # 📦️ :package: Add or update compiled files or packages.    增加/更新编译后文件/包
    // # 🙈 :see_no_evil: Add or update a .gitignore file.         增加/更新.gitignore文件
    // # 📄 :page_facing_up: Add or update license.                增加/更新LICENSE
    // # 🔊 :loud_sound: Add or update logs.                       增加/更新日志
    // # 🔇 :mute: Remove logs.                                    移除日志
    // # 👥 :busts_in_silhouette: Add or update contributor(s).    增加/更新贡献者
    // # ♻️ :recycle: Refactor code.                               重构代码
    // # 📈 :chart_with_upwards_trend: Add or update analytics or track code. 增加/更新分析/跟踪代码
    // # 🚸 :children_crossing: Improve user experience / usability. 增强用户体验/可用性
    // # 🛂 :passport_control: Work on code related to authorization, roles and permissions. 处理与授权、身份和权限相关的代码
    // # ====附加颜文字====
    // # ➕ :heavy_plus_sign: Add a dependency.                            增加一个依赖
    // # ➖ :heavy_minus_sign: Remove a dependency.                        移除一个依赖
    // # ⬇️ :arrow_down: Downgrade dependencies.                           降级依赖
    // # ⬆️ :arrow_up: Upgrade dependencies.                               升级依赖
    // # 📌 :pushpin: Pin dependencies to specific versions.               固定依赖到特定版本
    // # 🚀 :rocket: Deploy stuff.                                         部署功能
    // # 👽️ :alien: Update code due to external API changes.               由于外部API更改而更新代码
    // # 🔖 :bookmark: Release / Version tags.                             发布/版本标签
    // # 🔍️ :mag: Improve SEO.                                             提高SEO
    // # 🥅 :goal_net: Catch errors.                                       捕捉错误
    // # 🔒️ :lock: Fix security issues.                                    修复安全问题
    // # 🗑️ :wastebasket: Deprecate code that needs to be cleaned up.      废弃代码,需要清理
    // # ⚰️ :coffin: Remove dead code.                                     移除无用代码
    // # 🧪 :test_tube: Add a failing test.                                增加一个失败的测试
    // # 🏷️ :label: Add or update types.                                   增加/更新类型
    // # 💫 :dizzy: Add or update animations and transitions.              增加/更新动画和过渡
    // # 🚩 :triangular_flag_on_post: Add, update, or remove feature flags.增加/更新/移除功能标识
    // # 🔨 :hammer: Add or update development scripts.                    增加/更新开发脚本
    // # 👔 :necktie: Add or update business logic                         增加/更新业务逻辑
    // # 🍱 :bento: Add or update assets.                                  增加/更新assets
    // # 🌱 :seedling: Add or update seed files.                           增加/更新种子文件
    // # 📸 :camera_flash: Add or update snapshots.                        增加/更新快照
    // # 👷 :construction_worker: Add or update CI build system.           增加/更新CI构建系统
    // # 💚 :green_heart: Fix CI Build.                                    修复CI构建系统
    // # 💩 :poop: Write bad code that needs to be improved.               代码很烂需要改进
    // # 🚨 :rotating_light: Fix compiler / linter warnings.               修复compiler/linter的警告
    // # ♿️ :wheelchair: Improve accessibility.                            改善可访问性
    // # ⚗️ :alembic: Perform experiments.                                 进行实验
    // # 💥 :boom: Introduce breaking changes.                             引入破坏性改变
    // # 🗃️ :card_file_box: Perform database related changes.              执行数据库相关的改变
    // # 🏗️ :building_construction: Make architectural changes.            执行架构层次的改变
    // # 🩹 :adhesive_bandage: Simple fix for a non-critical issue.        非关键问题的简单修复
    // # 🧐 :monocle_face: Data exploration/inspection.                    数据探查/检查
    // # ====其他颜文字====
    // # 🌐 :globe_with_meridians: Internationalization and localization.  国际化与本地化
    // # 🍻 :beers: Write code drunkenly.                                  醉酒写码
    // # 💬 :speech_balloon: Add or update text and literals.              增加/更新文本和文字
    // # 📱 :iphone: Work on responsive design.                             致力于响应式设计
    // # 🥚 :egg: Add or update an easter egg.                             增加/更新复活节蛋
    // # 🤡 :clown_face: Mock things.
  ],
  "liveServer.settings.port": 63343,
  "liveServer.settings.CustomBrowser": "chrome",
  "liveServer.settings.NoBrowser": false,
  "liveServer.settings.host": "localhost",
  // "liveServer.settings.AdvanceCustomBrowserCmdLine": "C:\\Users\\QSKJ-00330\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure --disable-web-security --allow-file-access-from-files --allow-file-access --user-data-dir='D:\\userData'",
  // #editor
  "editor.tabSize": 2,
  "editor.fontSize": 16,
  // vscode默认启用了根据文件类型自动设置tabsize的选项
  // "editor.wordWrap": "on",
  // "editor.fontFamily": "Input Mono, Fira Code, monospace",
  // "editor.renderControlCharacters": true,
  // "editor.renderWhitespace": "all",
  // "editor.renderWhitespace": "boundary",
  // "editor.fontLigatures": "'ss01', 'ss02', 'ss03', 'ss06', 'zero'",
  // "editor.find.addExtraSpaceOnTop": false,
  // "editor.lineNumbers": "interval",
  // "editor.tabCompletion": "off",
  // "editor.suggestSelection": "first",
  // "editor.unicodeHighlight.invisibleCharacters": false,
  // "editor.unicodeHighlight.allowedLocales": {
  //   "zh-hans": true
  // },
  // "editor.minimap.enabled": false, // 消除链接提示
  // "editor.colorDecorators": true,
  // "editor.unicodeHighlight.ambiguousCharacters": false,
  // "editor.mouseWheelZoom": true,
  // "editor.foldingStrategy": "indentation",
  // 禁用快速修复
  "editor.quickSuggestions": {
    "strings": "on",
    "other": true,
    "comments": true
  },
  "editor.suggestOnTriggerCharacters": true,
  "editor.multiCursorModifier": "ctrlCmd", // 修改多行编辑快捷键
  "editor.wordSeparators": "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?", // 配置单词的分割规则
  // "editor.wordSeparators": "`~#!@$%^&*()-=+[{]}\\|;:'\",<>/?.",
  "editor.lineHeight": 22,
  // "editor.cursorBlinking": "expand",
  // bug控制缩进不关tabSize修改无用
  "editor.detectIndentation": false,
  // "editor.largeFileOptimizations": false,
  // "editor.accessibilitySupport": "off",
  // "editor.cursorSmoothCaretAnimation": "on",
  // "editor.guides.bracketPairs": "active",
  // "editor.guides.bracketPairs": true,
  // "editor.inlineSuggest.enabled": true,
  // "editor.suggestSelection": "recentlyUsedByPrefix",
  // "editor.acceptSuggestionOnEnter": "smart",
  // "editor.suggest.snippetsPreventQuickSuggestions": false,
  // "editor.stickyScroll.enabled": true,
  // "editor.hover.sticky": true,
  // "editor.suggest.insertMode": "replace",
  // "editor.bracketPairColorization.enabled": true,
  // "editor.autoClosingBrackets": "beforeWhitespace",
  // "editor.autoClosingDelete": "always",
  // "editor.autoClosingOvertype": "always",
  // "editor.autoClosingQuotes": "beforeWhitespace",
  // 默认禁用自动格式化(手动格式化快捷键：Shift + Alt + F)
  "editor.formatOnSave": true, // 保存的时候自动格式化
  "editor.formatOnPaste": false,
  // 启用自动代码修复功能，保存时触发 eslint 和 stylelint 的自动修复。
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit",
    "source.fixAll.markdownlint": "explicit",
    // "source.addMissingImports.ts": "explicit",
    //  在保存时，自动调整 import 语句相关顺序
    "source.organizeImports": "never"
  },
  // 设置默认格式化工具为 Prettier
  // 如需要开发微信小程序，需要注释这段代码，不然会和 minapp-vscode 插件冲突
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // "[snippets]": {
  //   "editor.defaultFormatter": "vscode.json-language-features"
  // },
  "[scss]": {
    "editor.formatOnSave": false
  },
  "[html]": {
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // volar 可以处理 vue 文件的格式化
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    // "editor.defaultFormatter": "Vue.volar"
  },
  // json、yaml 等配置文件保存时自动格式化
  "[json]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[jsonc]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[yaml]": {
    "editor.formatOnSave": true
  },
  "[markdown]": {
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint"
  },
  "[wxml]": {
    "editor.defaultFormatter": "qiu8310.minapp-vscode"
  },
  // Extension configs
  "emmet.showSuggestionsAsSnippets": true,
  "emmet.triggerExpansionOnTab": false,
  // "emmet.showAbbreviationSuggestions": true,
  // "emmet.showExpandedAbbreviation": "always",
  // "emmet.includeLanguages": {
  //   "wxml": "html"
  // },
  // "extensions.autoUpdate": "onlyEnabledExtensions",
  "extensions.ignoreRecommendations": true,
  // search
  "search.searchEditor.singleClickBehaviour": "peekDefinition",
  "search.followSymlinks": false,
  // 在使用搜索功能时，将这些文件夹/文件排除在外
  "search.exclude": {
    // 配置文件
    "**/.git": true,
    "**/.github": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.vscode": false,
    "**/.vitepress/cache": true,
    "**/.idea": true,
    "*.xml": true,
    "**/.DS_Store": true,
    // 依赖文件
    "**/node_modules": true,
    "node_modules": true,
    "**/bower_components": true,
    "**/miniprogram_npm": true,
    "**/*.log": true,
    "**/*.log*": true,
    // 打包文件
    "**/dist/**": true,
    "**/elehukouben": true,
    "**/.yarn": true,
    "**/tmp": true,
    "out": true,
    "dist": true,
    "CHANGELOG.md": true,
    "**/.nuxt": true,
    "**/.output": true,
    "**/.pnpm": true,
    "**/logs": true,
    "**/out/**": true,
    // lock 文件
    "**/package-lock.json": true,
    "**/pnpm-lock.yaml": true,
    "**/yarn.lock": true
  },
  // "javascript.validate.enable": false,
  "javascript.updateImportsOnFileMove.enabled": "always", // 设置缩放级别
  // "diffEditor.ignoreTrimWhitespace": false,
  // "diffEditor.hideUnchangedRegions.enabled": true,
  "debug.onTaskErrors": "debugAnyway",
  "debug.allowBreakpointsEverywhere": true,
  "debug.javascript.autoAttachFilter": "disabled",
  "update.mode": "manual",
  // "update.enableWindowsBackgroundUpdates": false,
  // workbench
  "workbench.iconTheme": "vscode-icons",
  "workbench.startupEditor": "welcomePage",
  "workbench.preferredLightColorTheme": "Dracula Theme Soft",
  "workbench.preferredDarkColorTheme": "Vitesse Dark",
  "workbench.colorTheme": "Vitesse Dark Soft",
  // "workbench.editor.closeOnFileDelete": true,
  // "workbench.editor.highlightModifiedTabs": true,
  // "workbench.editor.tabCloseButton": "left",
  // "workbench.editor.limit.enabled": true,
  // "workbench.editor.limit.perEditorGroup": true,
  // "workbench.editor.limit.value": 7,
  // "workbench.list.smoothScrolling": true,
  // "workbench.sideBar.location": "left",
  // "workbench.tree.expandMode": "singleClick",
  // "workbench.tree.indent": 10,
  // "workbench.productIconTheme": "icons-carbon",
  // "workbench.editor.tabActionLocation": "left",
  // https://glitchbone.github.io/vscode-base16-term/#/dracula
  "workbench.colorCustomizations": {
    // "terminal.background": "#282936",
    // "terminal.foreground": "#E9E9F4",
    // "terminalCursor.background": "#E9E9F4",
    // "terminalCursor.foreground": "#E9E9F4",
    // "terminal.ansiBlack": "#282936",
    // "terminal.ansiBlue": "#62D6E8",
    // "terminal.ansiBrightBlack": "#626483",
    // "terminal.ansiBrightBlue": "#62D6E8",
    // "terminal.ansiBrightCyan": "#A1EFE4",
    // "terminal.ansiBrightGreen": "#EBFF87",
    // "terminal.ansiBrightMagenta": "#B45BCF",
    // "terminal.ansiBrightRed": "#EA51B2",
    // "terminal.ansiBrightWhite": "#F7F7FB",
    // "terminal.ansiBrightYellow": "#00F769",
    // "terminal.ansiCyan": "#A1EFE4",
    // "terminal.ansiGreen": "#EBFF87",
    // "terminal.ansiMagenta": "#B45BCF",
    // "terminal.ansiRed": "#EA51B2",
    // "terminal.ansiWhite": "#E9E9F4",
    // "terminal.ansiYellow": "#00F769"
  },
  "window.zoomLevel": 1,
  "window.autoDetectColorScheme": true,
  // "window.dialogStyle": "custom",
  // "window.titleBarStyle": "custom",
  "window.nativeTabs": true, // this is great, macOS only
  // files
  "files.eol": "\n",
  // "files.eol": "auto", // 默认行尾字符LF
  "files.insertFinalNewline": true,
  "files.simpleDialog.enable": true, //  默认使用系统文件对话框
  "files.associations": {
    "*.ejs": "html",
    "*.art": "html",
    "**/tsconfig.json": "jsonc",
    "*.json": "jsonc",
    "package.json": "json",
    "*.cjson": "jsonc",
    "*.wxss": "css",
    "*.wxs": "javascript",
    "*.vue": "vue",
    "*.wxml": "html",
    "*.env.*": "env",
    "*.css": "tailwindcss"
  },
  "files.exclude": {
    "**/.eslintcache": true,
    "**/bower_components": true,
    "**/.turbo": true,
    "**/.idea": true,
    "**/tmp": true,
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.stylelintcache": true,
    "**/.DS_Store": true,
    "**/vite.config.mts.*": true,
    "**/tea.yaml": true,
    "**/node_modules": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/.vscode/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true,
    "**/yarn.lock": true
  },
  // teminal
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.profiles.windows": {
    // "Git-Bash": {
    //   "path": "D:\\Software:\\Git\\bin\\bash.exe",
    //   "args": ["--login", "-i"],
    //   // 编码
    //   "encoding": "utf8",
    //   "icon": "terminal-bash"
    // },
    "PowerShell -NoProfile": {
      "source": "PowerShell",
      "args": [
        "-NoProfile"
      ],
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": [
        "${env:windir}\\Sysnative\\cmd.exe",
        "${env:windir}\\System32\\cmd.exe"
      ],
      "args": [],
      "icon": "terminal-cmd"
    }
  },
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.persistentSessionReviveProcess": "never",
  "terminal.integrated.tabs.enabled": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.stickyScroll.enabled": true,
  // "terminal.integrated.defaultProfile.windows": "PowerShell",
  // "terminal.integrated.cursorStyle": "line",
  // "terminal.integrated.fontWeight": "300",
  // "terminal.integrated.copyOnSelection": true,
  "security.workspace.trust.untrustedFiles": "open",
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.untrackedChanges": "separate",
  "git.ignoreRebaseWarning": true, // 颜色标记警告
  "vscode-live2d.enable": false,
  // "path-intellisense.mappings": {
  //   "@": "${workspaceRoot}/src"
  // },
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  // "explorer": {
  //   "clipboard": true,
  //   "compare": true,
  //   "history": true,
  //   "remote": true
  // },
  // 折叠配置文件
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "tsconfig.json": "tsconfig.*.json, env.d.ts",
    "vite.config.*": "jsconfig*, vitest.config.*, cypress.config.*, playwright.config.*",
    "package.json": "pnpm-lock.yaml,pnpm-workspace.yaml,.gitattributes,.gitignore,.gitpod.yml,.npmrc,.browserslistrc,.node-version,.git*,.tazerc.json,package-lock.json, pnpm*, .yarnrc*, yarn*, .eslint*, eslint*, .prettier*, prettier*, .editorconfig",
    "pubspec.yaml": ".packages, pubspec.lock, .flutter-plugins, .flutter-plugins-dependencies, .metadata, analysis_options.yaml, dartdoc_options.yaml",
    "*.ts": "$(capture).test.ts, $(capture).test.tsx, $(capture).spec.ts, $(capture).spec.tsx, $(capture).d.ts",
    "*.tsx": "$(capture).test.ts, $(capture).test.tsx, $(capture).spec.ts, $(capture).spec.tsx,$(capture).d.ts",
    "*.env": "$(capture).env.*",
    "README.md": "README*,CHANGELOG*,LICENSE,CNAME,Todo*",
    "eslint.config.mjs": ".eslintignore,.prettierignore,.stylelintignore,.commitlintrc.*,.prettierrc.*,prettier.config.*,stylelint.config.*,.lintstagedrc.mjs,cspell.json"
  },
  // extension
  "background.enabled": false,
  "background.panel": {
    "images": [],
    "opacity": 0.6,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  },
  "background.fullscreen": {
    "images": [
      // "file:///D:/Picture/background-image/1.jpg",
      "file:///D:/Picture/background-image/girl_kimono_flowers_1072618_1600x900.jpg"
      // "file:///D:/Picture/background-image/2.png@1052w_!web-dynamic.avif"
    ], // urls of your images
    "opacity": 0.01,
    // "opacity": 0.95, // 0.85 ~ 0.95 recommended
    "size": "cover", // also css, `cover` to self-adaption (recommended)，or `contain`、`200px 200px`
    "position": "center", // alias to `background-position`, default `center`
    "interval": 0 // seconds of interval for carousel, default `0` to disabled.
  },
  // "background.editor": {
  //   "style": {
  //     "background-position": "center center",
  //     "background-size": "cover",
  //     "opacity": 0.15,
  //     "interval": 0
  //   },
  //   "images": ["file:///D:/Picture/background-image/1.jpg"]
  // },
  "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  "javascript.inlayHints.parameterTypes.enabled": true,
  "javascript.inlayHints.variableTypes.enabled": true,
  "prisma.showPrismaDataPlatformNotification": false,
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.inlayHints.enumMemberValues.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.parameterNames.enabled": "literals",
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.preferences.preferTypeOnlyAutoImports": false,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  // "typescript.tsserver.maxTsServerMemory": 2048,
  // #eslint
  // 设置编辑器保存文件时自动执行 eslint --fix 命令进行代码风格修复,并且仍然具有格式和快速修复功能
  // eslint 会在检查出错误时，给出对应的文档链接地址
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  "eslint.enable": true, // 开启eslint检查
  // "eslint.format.enable": true, // 启用 eslint 的格式化能力
  // Silent the stylistic rules in you IDE, but still auto fix them
  // "eslint.rules.customizations": [
  //   { "rule": "style/*", "severity": "off", "fixable": true },
  //   { "rule": "format/*", "severity": "off", "fixable": true },
  //   { "rule": "*-indent", "severity": "off", "fixable": true },
  //   { "rule": "*-spacing", "severity": "off", "fixable": true },
  //   { "rule": "*-spaces", "severity": "off", "fixable": true },
  //   { "rule": "*-order", "severity": "off", "fixable": true },
  //   { "rule": "*-dangle", "severity": "off", "fixable": true },
  //   { "rule": "*-newline", "severity": "off", "fixable": true },
  //   { "rule": "*quotes", "severity": "off", "fixable": true },
  //   { "rule": "*semi", "severity": "off", "fixable": true }
  // ],
  // 红色波浪提示
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    // 允许注释的 JSON 格式
    "jsonc",
    "json5",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ],
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.enable": true,
  "stylelint.packageManager": "pnpm",
  "stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss",
    "html",
    "vue"
  ],
  "stylelint.customSyntax": "postcss-html",
  "stylelint.snippet": [
    "css",
    "less",
    "postcss",
    "scss",
    "vue"
  ],
  "less.compile": {
    "compress": false,
    "sourceMap": false,
    "out": true, //是否开启
    "outExt": ".wxss"
  },
  // prettier
  "prettier.enable": true, // I only use Prettier for manually formatting
  // "prettier.printWidth": 200,
  // "prettier.tabWidth": 2,
  "prettier.semi": false, // 行尾是否需要有分号
  "prettier.singleQuote": true, // 使用单引号
  "prettier.arrowParens": "always", // 箭头函数尽量简写
  "prettier.endOfLine": "auto", // 行位换行符
  // "prettier.useTabs": false, // 不使用缩进符，而使用空格
  "prettier.trailingComma": "none", // 末尾是否需要有逗号
  /** vetur 配置 */
  "vetur.format.defaultFormatter.html": "prettyhtml",
  "vetur.format.defaultFormatter.js": "prettier-eslint",
  "vetur.format.defaultFormatterOptions": {
    "prettyhtml": {
      "printWidth": 80, // No line exceeds 100 characters
      "singleQuote": false // Prefer double quotes over single quotes
    },
    "prettier": {
      // 是否添加分号
      "semi": false,
      // 是否使用单引号
      "singleQuote": true,
      "eslintIntegration": true,
      "parser": "babylon"
    }
  },
  "vue.codeActions.enabled": true,
  "vue.inlayHints.missingProps": true,
  "vue.autoInsert.dotValue": true,
  "vue.server.maxOldSpaceSize": 2048,
  "vue.server.hybridMode": true,
  "nuxt.isNuxtApp": false,
  "remote.SSH.remotePlatform": {
    "0": "l",
    "1": "i",
    "2": "n",
    "3": "u",
    "4": "x",
    "47.119.114.107": "linux"
  },
  // go 插件配置
  "go.goroot": "D:\\Software\\Go",
  "go.gopath": "D:\\Project\\Go",
  "go.toolsGopath": "D:\\Project\\Go",
  "go.lintOnSave": "file",
  // "go.buildOnSave": true,
  // "go.buildFlags": [],
  // "go.buildTags": "",
  // "go.formatOnSave": true,
  // "go.inferGopath": true,
  // "go.autocompleteUnimportedPackages": true,
  // "go.gocodePackageLookupMode": "go",
  // "go.gotoSymbol.includeImports": true,
  // "go.useCodeSnippetsOnFunctionSuggest": true,
  // "go.useCodeSnippetsOnFunctionSuggestWithoutType": true,
  // "go.docsTool": "gogetdoc",
  // "go.formatTool": "goimports",
  "go.lintTool": "golangci-lint",
  "gopls": {
    "formatting.gofumpt": true
  },
  "rust-analyzer.enableCargoWatchOnStartup": "true", // 打开项目时自动开启 cargo watch
  "rust-analyzer.highlightingOn": true, // 覆盖内建语法高亮
  "rust-analyzer.lruCapacity": 1000, // 分析器最大缓存深度
  // "rust-analyzer.inlayHints.typeHints.enable": false,// 消除变量数据类型提示
  // "rust-analyzer.inlayHints.closingBraceHints.enable": false,// 消除右大括号后面的提示
  // "rust-analyzer.inlayHints.parameterHints.enable": false, // 消除括号内提示
  // "rust-analyzer.inlayHints.chainingHints.enable": false,
  "dart.flutterSdkPath": "D:\\Software\\flutter",
  // gitlens 插件配置
  // "gitlens.codeLens.authors.enabled": false,
  // "gitlens.codeLens.recentChange.enabled": false,
  // "gitlens.ai.experimental.provider": "openai",
  // "gitlens.ai.experimental.openai.model": "gpt-4",
  // "gitlens.codeLens.enabled": false,
  // "gitlens.menus": {
  //   "editor": {
  //     "blame": false,
  //     "clipboard": true,
  //     "compare": true,
  //     "history": false,
  //     "remote": false
  //   },
  //   "editorGroup": {
  //     "blame": true,
  //     "compare": true // 查看gitlens文件的历史提交记录
  //   },
  //   "editorTab": {
  //     "clipboard": true,
  //     "compare": true,
  //     "history": true,
  //     "remote": true
  //   },
  // },
  "gitlens.views.repositories.showTags": false,
  "gitlens.views.repositories.showStashes": true,
  "gitlens.views.repositories.showWorktrees": false,
  "gitlens.views.repositories.showContributors": false, // 在滚动中固定类名和方法名
  "gitlens.views.repositories.showBranchComparison": false,
  "gitlens.views.repositories.showUpstreamStatus": false,
  "gitlens.keymap": "alternate",
  // 标签高亮
  "highlight-matching-tag.styles": {
    "opening": {
      "left": {
        "custom": {
          "borderWidth": "0 0 0 4px",
          "borderStyle": "solid",
          "borderColor": "LightSkyBlue",
          "borderRadius": "5px"
        }
      },
      "right": {
        "custom": {
          "borderWidth": "0 4px 0 0",
          "borderStyle": "solid",
          "borderColor": "LightSkyBlue",
          "borderRadius": "5px"
        }
      }
    }
  },
  "markdown-preview-enhanced.codeBlockTheme": "one-dark.css",
  "markdown-preview-enhanced.previewTheme": "one-dark.css",
  "markdownlint.config": {
    "MD001": false,
    "MD004": {
      "style": "dash"
    },
    "MD024": false,
    // 内联 HTML
    "MD033": false
  },
  "errorLens.enabledDiagnosticLevels": [
    "warning",
    "error"
  ],
  "errorLens.excludeBySource": [
    "cSpell",
    "Grammarly",
    "eslint"
  ],
  // "cSpell.allowCompoundWords": true,
  "cSpell.words": [
    "cssr"
  ],
  // "cSpell.language": "en,en-US",
  // Google Translate plugin configuration
  "google-translate.firstLanguage": "zh-cn",
  "google-translate.secondLanguage": "en",
  "googleTranslateExt.replaceText": true,
  "commentTranslate.targetLanguage": "zh-CN",
  "commentTranslate.source": "Google",
  "commentTranslate.googleTranslate.mirror": "https://gtranslate.cdn.haah.net",
  // translation
  "varTranslation.translationEngine": "google",
  // "css.lint.hexColorLength": "ignore",
  "windicss.enableCodeFolding": false,
  "tailwindCSS.includeLanguages": {
    "plaintext": "html",
    "vue-html": "html",
    "razor": "html"
  },
  /** 微信小程序配置 */
  "minapp-vscode.disableAutoConfig": true,
  // "github.copilot.advanced": {
  //   "authProvider": "github-enterprise"
  // },
  // "github-enterprise.uri": "https://daima666.top"
  "hediet.vscode-drawio.resizeImages": null,
  "marscode.codeCompletionPro": {},
  "trae.chatLanguage": "cn",
  "Lingma.LocalStoragePath": "C:\\Users\\mengxi\\.lingma",
  "codeium.enableConfig": {
    "*": true,
    "html": false
  },
  "Codegeex.Privacy": true,
  "github.copilot.enable": {
    "*": false,
    "plaintext": false,
    "markdown": false,
    "scminput": false,
    "typescript": false
  }
  // "Codegeex.Privacy": true
}

```

## 代码片段

````json
{
  /********** markdown 相关 **********/
  "markdown code block": {
    "scope": "markdown",
    "prefix": "code",
    "body": ["```${1:js}", "$2", "```"],
    "description": "markdown 块级代码"
  },
  "markdown code inline": {
    "scope": "markdown",
    "prefix": "code",
    "body": ["`$1`"],
    "description": "markdown 行内代码"
  }
}
````

## 其他

- [emmet 语法说明](https://docs.emmet.io/abbreviations/syntax/)

### 扩展插件开发

- [VS Code 插件开发文档-中文版](https://github.com/Liiked/VS-Code-Extension-Doc-ZH)
- [VSCode 插件开发全攻略配套 demo](https://github.com/sxei/vscode-plugin-demo)

### 下载小技巧

1. 打开 [Visual Studio Code](https://code.visualstudio.com/Download) 官网进行下载
2. 打开下载管理，复制下载链接
3. 将链接中的域名 `az764295.vo.msecnd.net` 替换为 `vscode.cdn.azure.cn`

```sh
# 示例
https://az764295.vo.msecnd.net/stable/74b1f979648cc44d385a2286793c226e611f59e7/VSCode-darwin-universal.zip
# 替换如下
https://vscode.cdn.azure.cn/stable/74b1f979648cc44d385a2286793c226e611f59e7/VSCode-darwin-universal.zip
```
