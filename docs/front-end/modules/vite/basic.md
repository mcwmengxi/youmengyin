# vite

## 前言

### 什么是构建工具？

浏览器只认识html、css、js，如果要使用其他文件，比如图片、框架等，就需要使用构建工具进行处理。

企业项目具有复杂的构建需求，比如：

1. typescript 如果遇到ts文件需要使用tsc将ts编译成js，
2. React/Vue 安装react complier/ vue compiler, 将jsx/vue文件转化成render函数
3. less/scss/postcss 安装sass-loader/less-loader等编译工具
4. 语法降级 babel swc 将es新语法转化旧版浏览器可以接受的语法
5. 体积优化 uglifyjs 压缩代码
6. ...

vite webpack 就集成了以上所有功能，并且提供了开箱即用的开发环境，可以快速上手。

构建工具承担了那些工作？

1. 模块化开发支持 支持从node_modules导入代码 + 多种模块化支持
2. 处理代码兼容 比如babel降级 less ts语法转换(集成语法处理工具来自动化处理)
3. 提高项目性能 代码压缩合并 tree-shaking
4. 优化开发体验 热更新 开发服务器(跨域等问题) 代码错误提示 代码格式化
5. 自动化测试 支持jest/mocha/ava/cypress等测试框架

## vite相较于webpack的优势

构建大型应用时 JavaScript启动开发服务器时间过长，即使使用HMR(热更新)， 文件修改效果也需要几秒钟才能反映过来

## vite的预构建

开发环境每次预购建的相对路径都是正确的
生产环境直接全权交给rollup进行打包

**依赖预购建**

vite会找到对应依赖，然后调用esbuild(对js语法处理的一个库),将其他规范的代码转成esmodule规范，然后放到当前目录的node_modules/.vite/deps中，同时对esmodule规范的各个模板进行统一集成。

1. 不同的第三方包有不同的导出格式 (vite无法约束)
2. 对路径的处理可以使用.vite/deps，方便路径重写
3. 网络多包传输的性能问题(原生es不能直接支持node_modules的原因) 有了依赖预购建后就可以尽可能把它集成到一个或几个文件中进行import/export，减少网络请求。

