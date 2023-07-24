# 包管理器

## npm

>.npmrc

npm running cnfiguration, 即npm运行时配置文件
npm按照如下顺序读取这些配置文件：

 1. 项目配置文件：项目根目录下.npmrc文件，只用于管理这个项目的npm安装。
 2. 用户配置文件：在你使用一个账号登陆的电脑的时候，可以为当前用户创建一个.npmrc文件，之后用该用户登录电脑，就可以使用该配置文件。可以通过 `npm config get userconfig` 来获取该文件的位置。
 像`config set registry https://registry.npm.taobao.org`
 3. 全局配置文件： 多用户可以设置一个公共的.npmrc文件，供所有用户使用。该文件的路径为：$PREFIX/etc/npmrc，使用 `npm config get prefix` 获取`$PREFIX`。如果你不曾配置过全局文件，该文件不存在。
 像`npm config set registry https://registry.npm.taobao.org -g`
 4. npm内嵌配置文件

## yarn

>.yarnrc配置文件

```bash
registry "https://registry.npm.taobao.org"

sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver"

```