# 项目

## 1.Vue怎么做权限管理？

1. 权限管理一般需求是**页面权限**和**按钮权限**的管理

2. 具体实现的时候分后端和前端两种方案：

   前端方案会**把所有路由信息在前端配置**，通过路由守卫要求用户登录，用户**登录后根据角色过滤出路由表**。比如我会配置一个`asyncRoutes`数组，需要认证的页面在其路由的`meta`中添加一个`roles`字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。此过滤过程结束，剩下的路由就是该用户能访问的页面，**最后通过`router.addRoutes(accessRoutes)`方式动态添加路由**即可。

   后端方案会**把所有页面路由信息存在数据库**中，用户登录的时候根据其角色**查询得到其能访问的所有页面路由信息**返回给前端，前端**再通过`addRoutes`动态添加路由**信息

   按钮权限的控制通常会**实现一个指令**，例如`v-permission`，**将按钮要求角色通过值传给v-permission指令**，在指令的`moutned`钩子中可以**判断当前用户角色和按钮是否存在交集**，有则保留按钮，无则移除按钮。

3. 纯前端方案的优点是实现简单，不需要额外权限管理页面，但是维护起来问题比较大，有新的页面和角色需求就要修改前端代码重新打包部署；服务端方案就不存在这个问题，通过专门的角色和权限管理页面，配置页面和按钮权限信息到数据库，应用每次登陆时获取的都是最新的路由信息，可谓一劳永逸！

## 2.从0到1自己构架一个vue项目

1. 从0创建一个项目我大致会做以下事情：项目构建、引入必要插件、代码规范、提交规范、常用库和组件
2. 目前 vue3 项目我会用 vite 或者 create-vue 创建项目
3. 接下来引入必要插件：路由插件 vue-router、状态管理 vuex/pinia、ui库我比较喜欢 element-plus 和 antd-vue、http工具我会选axios
4. 其他比较常用的库有 vueuse，nprogress，图标可以使用 vite-svg-loader
5. 下面是代码规范：结合 prettier 和 eslint 即可
6. 最后是提交规范，可以使用husky，lint-staged，commitlint

7. 目录结构： api/compontes/asserts/views/router/store/utils

## 3. Vue 大数据量优化

1. 在大型企业级项目中经常需要渲染大量数据，此时很容易出现卡顿的情况。比如大数据量的表格、树。
2. 处理时要根据情况做不通处理：
   - 可以采取分页的方式获取，避免渲染大量数据
   - [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)等虚拟滚动方案，只渲染视口范围内的数据
   - 如果不需要更新，可以使用`v-once`方式只渲染一次
   - 通过[v-memo](https://vuejs.org/api/built-in-directives.html#v-memo)可以缓存结果，结合`v-for`使用，避免数据变化时不必要的VNode创建
   - 可以采用懒加载方式，在用户需要的时候再加载数据，比如tree组件子树的懒加载
3. 总之，还是要看具体需求，首先从设计上避免大数据获取和渲染；实在需要这样做可以采用虚表的方式优化渲染；最后优化更新，如果不需要更新可以 v-once处理，需要更新可以 v-memo 进一步优化大数据更新性能。其他可以采用的是交互方式优化，虚拟滚动、懒加载等方案。
  
## vxe-table 相关

以下是几种常用的刷新表格的方法：

1. 利用 ref 调用 reloadData 方法：在组件中添加 ref 属性，并在需要刷新表格的方法中调用该组件的 reloadData 方法。例如：this.$refs.table.reloadData();
2. 利用 key 更新组件：在组件外层包裹一层 div 并设置唯一的 key 值，每次需要刷新表格时更改该 key 值即可。例如：`<div :key="tableKey"><vxe-table></vxe-table></div>`
3. 利用 clearAll 清空表格数据并重新加载：在需要刷新表格的方法中先调用 this.refs.table.clearAll() 方法清空表格数据，再调用加载数据的方法。例如：this.refs.table.clearAll()方法清空表格数据，再调用加载数据的方法。例如：this.refs.table.clearAll(); fetchData();

```less
// 【固定列】和【合计】一起用，光标在固定列按住shift+滚轮可以左右都出现滚动条问题
.vxe-table--render-default:not(.is--empty).is--footer.is--scroll-x
  .vxe-table--body-wrapper.fixed-left--wrapper {
  overflow-x: hidden;
}
```

## 前端怎么解决高并发问题

前端能做的：

- 静态资源通过 CDN、并对静态资源进行合并和压缩
- 前端缓存（强缓存和浏览器存储），避免重复请求
- 异步加载和懒加载（图片和数据）
- 减少重复请求，防抖节流等；限制某些接口的请求频率
- 接口优化，合并请求和压缩数据

服务端：接口优化、负载均衡、热点数据缓存、数据库查询优化、集群扩容

## b 端项目大数据量性能优化

- 数据分片
- 虚拟滚动

图表数据卡顿

- 使用增量渲染代替全量渲染
- 图表过多懒加载
- 折线图 LTTB 降采样

<https://juejin.cn/post/7280007832701927443>
<https://juejin.cn/post/7145488193314357255>
