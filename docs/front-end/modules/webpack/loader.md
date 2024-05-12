# Loader

## 1. 简介
Loader 主要用于转换某些类型的模块

## 2. 实现一个简单的Loader
Loader 本质上是一个函数，接受源文件作为参数，返回转换的结果。这里我们创建一个简单的 Markdown Loader，将 Markdown 文件转换为 HTML 字符串。
1. 安装依赖
首先，需要安装 markdown-it，这是一个 Markdown 到 HTML 的转换器。
```bash
npm install --save-dev markdown-it
```

2. 编写Loader
在项目根目录下创建一个名为 simple-markdown-loader.js 的文件。
```js
const markdownIt = require('markdown-it')();

module.exports = function(source) {
  // 使用 markdown-it 转换 Markdown 内容为 HTML
  const html = markdownIt.render(source);
  // 将 HTML 字符串导出
  return `module.exports = ${JSON.stringify(html)}`;
};
```
3. 配置 Webpack
在 webpack.config.js 中配置 Loader，使得 Webpack 知道如何处理 .md 文件。
在 webpack.config.js 文件中，添加如下配置：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: path.resolve('./simple-markdown-loader.js')
          }
        ]
      }
    ]
  }
};

```