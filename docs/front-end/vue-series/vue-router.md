# vue-router

## 路由参数

## 编程式导航

## 路由懒加载

## 导航守卫
1. 全局前置守卫
```js
/**
 * 全局前置守卫
 * to: Route: 即将要进入的目标 路由信息对象
 * from: Route: 当前导航正要离开的路由
 * next: Function: 一定要调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
  console.log('router beforeEach', to, from)

  next() // 必须调用 next()
})
```
2. 全局解析守卫
```js
router.beforeResolve(async to => {
  // 
})

// router.beforeResolve 是获取数据或执行任何其他操作
//（如果用户无法进入页面时你希望避免执行的操作）的理想位置。
```
3. 全局后置钩子
```js
// 全局后置守卫
router.afterEach((to, from) => {
  console.log('router afterEach', to, from)
})
```
4. 路由独享守卫
```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
/**
 * beforeEnter 守卫 只在进入路由时触发，
 * 不会在 params、query 或 hash 改变时触发。
 * 例如，从 /users/2 进入到 /users/3 或者
 * 从 /users/2#info 进入到 /users/2#projects。
 * 它们只有在 从一个不同的 路由导航时，才会被触发。
 */
```
5. 组件内守卫
```js
const UserDetails = {
  template: `...`,
  // 默认是只有 to, from 两个参数的
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！

    /**
     * 不过，你可以通过传一个回调给 next 来访问组件实例。
     * 在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数
     */
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  /**
   * 这个 离开守卫 通常用来预防用户在还未保存修改前突然离开。
   * 该导航可以通过返回 false 来取消。
   */
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
```

## vue-router的两种模式
> `Vue` 路由有两种模式：`hash` 模式和 `history` 模式。
1. `hash` 模式：`URL` 中以 # 开头，如 http://www.example.com/#/home
原理是利用浏览器的 `hash（锚点）`来实现前端路由，当 `URL` 中的 `hash` 发生变化时，页面不会重新加载，而是通过监听 `hashchange` 事件来进行页面更新
- 优点：兼容性好，在不支持 `HTML5 History API` 的浏览器中也可以使用
- 缺点：URL 中有 `#` 可能影响 `SEO`，不够美观
2. history 模式：URL 中不包含 `#`，如 http://www.example.com/home
原理是利用 `HTML5 History API` 中的 `pushState` 和 `replaceState` 方法来改变 URL，并配合监听 `popstate` 事件来实现前端路由
- 优点：`URL` 美观，不会有 #，对 `SEO` 更友好
- 缺点：需要服务器端配置，防止用户直接访问 history 模式下的 URL 时出现 404 错误

> 总体来说，`hash` 模式兼容性好，使用简单，但 `URL` 不够美观；`history` 模式 `URL` 美观，对 `SEO` 更友好，但需要服务器端配置，且在一些老版本浏览器上可能存在兼容性问题。根据项目需求和实际情况选择合适的路由模式。

## 路由完整的解析流程
1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。