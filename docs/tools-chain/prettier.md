
# eslint和prettier最佳实践

## eslint
>编译层面对js代码进行检查

默认eslint支持es5,可以通过配置文件覆盖默认配置

`{ "parserOptions": { "ecmaVersion": 6 } }`支持es6语法,但不支持es6全局变量、类型,需要启用`{ "env":{ "es6": true } }. { "env": { "es6": true } }`
```json
  "env": {
    "es6": true // 支持全局变量
  },
  "parserOptions": {
    "ecmaVersion": 6 // 支持语法
  }
```

env选项用来指定脚本的运行环境, 每种环境都有预设的全局变量, 可以混合使用. 
globals选项指定一些特殊的全局变量,像原生小程序的wx、App、Page等,值代表可读还是可写
```js
{
  'globals': {
    'wx': true,
    'App': true,
    'Page': true,
    'getCurrentPages': true,
    'getApp': true,
    'Component': true,
    'Behavior': true,
    'requirePlugin': true,
    'requireMiniProgram': true
  },
}
```
parserOptions选项除了ecmaVersion外还有sourceType、ecmaFeatures、parser等配置字段

- 使用ECMAScript模块export、import需要指定`"sourceType"`为`"module"`
- ecmaFeatures用来启用额外的语言特性, 像jsx

```json
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module", // 默认script
    "ecmaFeatures": {
      "jsx": true
    }
  },
```

如果你有ts需求, eslint默认解析器Espree就不够用了, 将`'parser'`选项设置为`@typescript-eslint/parser` ，以便在ESLint中使用

```js
{
  "parser": '@typescript-eslint/parser', // 解析ts
  "parserOptions": {
    ...
  }
}
```

extends 指定继承的eslint规则,可以是eslint的内置规范`eslint:recommended、eslint:all`
也可以是第三方规范,`eslint-config-standard`,设置extends时，可以省略`eslint-config-`,直接写成`standard`

查看插件"eslint-plugin-vue"依赖的包
`pnpm info "eslint-plugin-vue" peerDependencies`
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37342449ede34bdabc77a4f767f2db9c~tplv-k3u1fbpfcp-watermark.image?)
安装插件和peerDependencies的依赖
`npx install-peerdeps --dev eslint-plugin-vue`

rules选项是指定自定义规则的地方

script脚本进行lint命令
`"lint": "eslint . --ext .js --ignore-pattern miniprogram_npm/* --fix "`
## prettier

>prettier使用指南

prettier的配置项比较少（容易配置），只专注于代码样式，eslint还提供语法检查，现在的eslint好像也集成了formatter功能,但prettier相比eslint支持更多文件的格式化。

创建 .prettierignore忽略你不希望格式化的文件，node_modules是默认会被忽略的目录。类似于.gitignore、.eslintingnore


- 提前查看会格式化哪些文件，不实际执行格式化，`prettier --check .`
- 格式化 `prettier --write .`

实际使用过程中，我一般都习惯直接用vscode插件保存时自动执行格式化。

这里存一份详细的配置信息

::: details 查看代码

```js
module.exports = {
  // 1.一行代码的最大字符数，默认是80(printWidth: <int>)
  printWidth: 80,
  // 2.tab宽度为2空格(tabWidth: <int>)
  tabWidth: 2,
  // 3.是否使用tab来缩进，我们使用空格(useTabs: <bool>)
  useTabs: false,
  // 4.结尾是否添加分号，false的情况下只会在一些导致ASI错误的其工况下在开头加分号，我选择无分号结尾的风格(semi: <bool>)
  semi: false,
  // 5.使用单引号(singleQuote: <bool>)
  singleQuote: true,
  // 6.object对象中key值是否加引号（quoteProps: "<as-needed|consistent|preserve>"）as-needed只有在需求要的情况下加引号，consistent是有一个需要引号就统一加，preserve是保留用户输入的引号
  quoteProps: 'as-needed',
  // 7.在jsx文件中的引号需要单独设置（jsxSingleQuote: <bool>）
  jsxSingleQuote: false,
  // 8.尾部逗号设置，es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况，需要node8和es2017以上的环境。（trailingComma: "<es5|none|all>"）
  trailingComma: 'es5',
  // 9.object对象里面的key和value值和括号间的空格(bracketSpacing: <bool>)
  bracketSpacing: true,
  // 10.jsx标签多行属性写法时，尖括号是否另起一行(jsxBracketSameLine: <bool>)
  jsxBracketSameLine: false,
  // 11.箭头函数单个参数的情况是否省略括号，默认always是总是带括号（arrowParens: "<always|avoid>"）
  arrowParens: 'always',
  // 12.range是format执行的范围，可以选执行一个文件的一部分，默认的设置是整个文件（rangeStart: <int>  rangeEnd: <int>）
  rangeStart: 0,
  rangeEnd: Infinity,
  // 13. 指定parser,因为pretter会自动选择,所以一般不用指定(parser: "<string>")
  parser: "vue"
  // 14. 格式化有特定开头编译指示的文件 比如下面两种
  requirePragma: false,
  /**
   * @prettier
   */
  // or
  /**
   * @format
   */
  // 15. 是否在文件插入标记表明该文件已被格式化处理过了
  insertPragma: false,
  // 16. 文章换行,默认情况下会对你的markdown文件换行进行format会控制在printwidth以内
  proseWrap: "<always|never|preserve>",
  // 17. html中的空格敏感性
  htmlWhitespaceSensitivity: "<css|strict|ignore>",
  // 针对不同文件或目录设置不同配置的方法,json格式例子
  {
    "semi": false,
    "overrides": [
      {
        "files": "*.test.js",
        "options": {
          "semi": true
        }
      },
      {
        "files": ["*.html", "legacy/**/*.js"],
        "options": {
          "tabWidth": 4
        }
      }
    ]
  },
  // 18. .vue 缩进 script和style标签中是否缩进,开启可能会破坏编辑器的代码折叠.
  vueIndentScriptAndStyle: false,
  // 19.    endOfLine: "<lf|crlf|cr|auto>" 行尾换行符,默认是lf,
  endOfLine: 'auto',
  // 20.embeddedLanguageFormatting: "off",默认是auto,控制被引号包裹的代码是否进行格式化
  embeddedLanguageFormatting: 'off',
  // 21.开始标签的右尖括号是否跟随在最后一行属性末尾
  bracketSameLine: false
}
```

:::
## 解决和eslint的冲突

`pnpm add -D eslint-config-prettier`
安装 eslint-config-prettier，这个插件会把eslint中可能导致冲突的规则关掉，这样两者就能兼容使用了。

`pnpm add -D eslint-plugin-prettier`
这个插件是扩展prettier代码风格的eslint规则集, 需要在extends中加上`'plugin:prettier/recommended'`

**附上一份我的配置**
>这个用来规范小程序的,其他的规则集,vue、react cli已经是最佳实践, 可以自己定义需要rules
.eslintrc.js
```javascript
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    Behavior: true,
    requirePlugin: true,
    requireMiniProgram: true
  },
  rules: {
    indent: [2, 2, { SwitchCase: 1 }], // 缩进2个空格, 指定 switch-case 语句(默认0)的缩进级别
    semi: [2, 'never'], // 要求或禁止使用分号代替 ASI,即禁用行尾使用分号
    quotes: [2, 'single'], // 使用单引号
    'no-mixed-spaces-and-tabs': [2], // 禁止空格和 tab 的混合缩进
    'no-extra-semi': [2], // 禁止不必要的分号
    'comma-dangle': [2, 'never'] // 禁止末尾逗号
  }
}

```
.prettierrc.js
```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'none',
  endOfLine: 'auto',
  arrowParens: 'always'
}

```
.prettierignore
```
  miniprogram_npm
  package.json
  package-lock.json
  sitemap.json
  project.config.json
  project.private.config.json
  .vscode
```

## git hooks
>提交前校验,强制执行校验,平时省事一般不怎么用它,只有开源的项目才加上进行代码规范

pnpm add -D lint-staged husky

package.json添加`"prepare" : "husky install"`
执行scripts脚本
`pnpm prepare`
`npx husky add .husky/pre-commit "pnpm exec lint-staged"`


```json
{
  "lint-staged": {
    "*.{vue,js,ts,jsx,tsx,json}": "eslint --fix",
    "*.{html,css,less,scss}": [
      "prettier --write"
    ]
  },
}
```
