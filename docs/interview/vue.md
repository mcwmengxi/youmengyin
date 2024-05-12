# Vue面试题

## 一、基础
#### 1.1 指令/API
##### 1. v-text 与花括号(插值表达式)与 v-html 区别
- `插值表达式`将数据解析为纯文本，不能显示输出 `html`
- v-html 可以染输出 html
- v-text 将数据解析为纯文本，不能输出真正的 html，与花括号的区别是在页面加载时不显示双花括号
- v-text 指令:
作用: 操作网页元素中的纯文本内容。是他的另外一种写法
- v-text 与`插值表达式`区别:
- v-text 叫指令。有一点区别就是，在渲染的数据比较多的时候，可能会把大括号显示出来，俗称屏幕闪动


##### 2. v-if与v-show的区别
- 共同点：都能控制元素的显示和隐藏；

- 不同点：实现本质方法不同，
1. `v-show`本质就是通过控制`css`中的`display`设置为`none`，控制隐藏，只会编译一次；
2. `v-if`是动态的向`DOM`树内添加或者删除`DOM`元素，若初始值为`false`，就不会编译了。而且`v-if`不停的销毁和创建比较消耗性能。 

> 总结：如果要频繁切换某节点，使用`v-show`(切换开销比较小，初始开销较大)。如果不需要频繁切换某节点使用`v-if`（初始渲染开销较小，切换开销比较大）。
##### 3. v-for 循环的 key 作用
`Key`值的存在保证了唯一性，`Vue`在执行时，会对节点进行检查，如果没有`key`值，那么`vue`检查到这里有`dom`节点，就会对内容清空并赋新值，如果有`key`值存在，那么会对新老节点进行对比，比较两者`key`是否相同，进行调换位置或删除操作

##### 4. ref与reactive的区别？
ref与reactive 是 Vue3 新推出的主要 API 之一，它们主要用于响应式数据的创建。

- template 模板中使用的数据和方法，都需要通过 setup 函数 return 出去才可以被使用。
- ref 函数创建的响应式数据，在模板中可以直接被使用，在 JS 中需要通过 .value 的形式才能使用。
- ref 函数可以接收原始数据类型与引用数据类型。
- reactive 函数只能接收引用数据类型。
- ref 底层还是使用 reactive 来做，ref 是在 reactive 上在进行了封装，增强了其能力，使它支持了对原始数据类型的处理。
- 在 Vue3 中 reactive 能做的，ref 也能做，reactive 不能做的，ref 也能做。
##### 5. Vue 组件中的 data 为什么是函数
- `Data`是一个函数时，每个组件实例都有自己的作用域，每个实例相互独立，不会相互影响。
- `Data`是引用类型(对象)，当多个组件共用一个数据源时，一处数据改变所有的组件数据都会改变，所以要利用函数通过 return 返回对象的拷贝(返回一个新数据)，让每个实例都有自己的作用域，相互不影响。

##### 6. 对 vue 中 keep-alive 的理解
- 概念: keep-alive 是vue 的内置组件，当它动态包裹组件时，会缓存不活动的组件实例，它自身不会渲染成一个 DOM 元素也不会出现在父组件链中
- 作用: 在组件切换过程中将状态保留在内存中，防止重复渲染 DOM，减少加载时间以及性能消耗，提高用户体验
- 生命周期函数: Activated 在 keep-alive 组件激活时调用，deactivated在 keep-alive 组件停用时调用
- 原理
在 Vue 中，当路由切换时，Vue 会自动销毁当前页面组件，并加载一个新的页面组件，而被 `<keep-alive>` 缓存的组件则会保留在内存中不会被销毁，因为其内部维护了一个 cache 对象，并将组件的虚拟 DOM 和实例添加到 cache 对象中。当被缓存的组件（通过路由导航或其他方式）被再次访问时，Vue 会从缓存中取出之前的组件实例，重新激活它们，而不是重新创建新的实例。所以一般情况下，被缓存的组件不会触发 onBeforeUnmount 和 onUnmounted 钩子，取而代之的是 onActivated 和 onDeactivated。
- 可以指定组件被缓存或不被缓存吗
可以，`<keep-alive>`默认会缓存所有经过的组件，但可以通过 include 和 exclude 来指定和排除一些组件
```vue
<!-- 指定 -->
<keep-alive include="a, b">
  <router-view :is="view" />
</keep-alive>

<!-- 排除 -->
<keep-alive exclude="a, b">
  <router-view :is="view" />
</keep-alive>
<!-- 其中，include 和 exclude 接收的参数为组件的 name 属性（支持字符串、数组和正则），所以组件想要被识别，必须声明 name 属性。 -->
```

##### 7. 如何让组件中的css在当前组件生效
在style中加上scoped属性，这样样式只会应用到当前组件中
1. 为组件实例生成一个唯一标识，给组件中的每个标签对应的DOM元素添加一个标签属性(data-v-xxx)
2. 给`<style scoped>`中的每个选择器的最后一个选择器添加一个属性选择器，如：原选择器为
.container #id div, 则更改后选择器为.container #id div[data-v-xxx]

#### 1.2 计算属性和监听器
##### 1. 什么是计算属性
计算属性是用来声明式的描述一个值依赖了其他的值，当它依赖的这个值发生改变时，就更新`DOM`。当在模板中把数据绑定到一个计算属性上时,vue 会在它依赖的任何值导致该计算属性改变时更新`DOM`。每个计算属性都包括一个`getter`和`setter`，读取时触发`getter`，修改时触发`setter`
##### 2. Vue 组件中的 computed 和 watch 的区别
`Computed`、`watch`区别就是`computed`的缓存功能，当无关数据数据改变时，不会重新计算，直接使用缓存中的值。计算属性是用来声明式的描述一个值依赖了其他的值，当所依赖的值后者变量发生变化时计算属性也跟着改变`Watch`监听的是在`data`中定义的变量，当该变量变化时，会触发`watch`中的方法

`Computed`本质是一个具备缓存的`watcher`，依赖的属性发生变化就会更新视图。
适用于计算比较消耗性能的计算场景。当表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。
`Watch`没有缓存性，更多的是观察的作用，可以监听某些数据执行回调。
当我们需要深度监听对象中的属性时，可以打开`deep：true`选项，这样便会对对象中的每一项进行监听。
这样会带来性能问题，优化的话可以使用字符串形式监听，如果没有写到组件中，不要忘记使用unWatch手动注销哦。
##### 3. watch 和 watchEffect 的区别？
watch 和 watchEffect 都是监听器，watchEffect 是一个副作用函数。它们之间的区别有：
- watch ：既要指明监视的数据源，也要指明监视的回调。
- 而 watchEffect 可以自动监听数据源作为依赖。不用指明监视哪个数据，监视的回调中用到哪个数据，那就监视哪个数据。
- watch 可以访问改变之前和之后的值，watchEffect 只能获取改变后的值。
- watch 运行的时候不会立即执行，值改变后才会执行，而 watchEffect 运行后可立即执行。这一点可以通过 watch 的配置项 immediate 改变。
- watchEffect有点像 computed ：
1. 但 computed 注重的计算出来的值（回调函数的返回值）， 所以必须要写返回值。
2. 而 watcheffect注重的是过程（回调函数的函数体），所以不用写返回值。

- watch与 vue2.x中 watch 配置功能一致，但也有两个小坑

1. 监视 reactive 定义的响应式数据时，oldValue 无法正确获取，强制开启了深度监视（deep配置失效）
2. 监视 reactive 定义的响应式数据中某个属性时，deep配置有效。
#### 1.3 生命周期
##### 1. Vue 的生命周期请简述
> vue 的生命周期就是 vue 实例创建到实例销毁的过程。期间会有 8个钩子函数的调用

- beforeCreate (创建实例)
实例刚在内存中被创建出来，此时对象还没有初始化完成，因此无法访问到组件实例的数据和方法。

- created (创建完成)
实例已经在内存中创建成功，此时对象已经完成了数据的初始化，可以访问到数据和方法，但是这里的 $el 属性并不可见。

- beforeMount (开始创建模板)
此时组件已经完成了 $el 属性的配置，但尚未将其插入到页面中。
- mounted (创建完成)

  DOM渲染在 mounted周期中就已经完成。
  组件已经将 $el 插入到页面中，此时可以访问到组件的 DOM 元素，以及 DOM 元素上的样式等属性。
- beforeUpdate (开始更新)
组件更新之前执行，此时对组件的数据进行修改会触发重新渲染。
- updated (更新完成)
组件更新完毕后执行，此时可以对组件的 DOM 结构进行操作。
- beforeDestroy(开始销毁)
组件销毁之前执行，此时组件还可以正常使用。
- destroyed (销毁完成)
组件销毁之后执行，此时组件已经无法使用。
##### 2. vue 在 created 和 mounted 这两个生命周期中请求数据有什么区别呢?
如看实际情况，一般在 created (或 beforeRouter)里面就可以，如果涉及到需要页面加载完成之后的话就用 mounted。
在 created 的时候，视图中的 html 并没有染出来，所以此时如果直接去操作 html 的dom 节点，一定找不到相关的元素
而在 mounted 中，由于此时 html 已经染出来了，所以可以直接操作 dom 节点，(此时 document.getelementByld 即可生效)

##### 3. vue2.0与vue3.0生命周期的区别
Vue 3.0 相较于 Vue 2.0 在生命周期方面进行了一些重大的变化和优化。下面是 Vue 2.0 与 Vue 3.0 生命周期的主要区别：

1. 新增的生命周期钩子：

- Vue 3.0 新增了 beforeUnmount 钩子，在组件卸载之前调用。
- Vue 3.0 移除了 beforeDestroy 钩子，取而代之的是 beforeUnmount，为了更清晰地表示组件卸载前的操作。
2. 生命周期钩子执行顺序变化：

- 在 Vue 2.0 中，生命周期钩子的执行顺序是 beforeCreate -> created -> beforeMount -> mounted -> beforeUpdate -> updated -> beforeDestroy -> destroyed。
- 而在 Vue 3.0 中，生命周期钩子的执行顺序是 beforeCreate -> created -> beforeMount -> onMounted -> beforeUpdate -> updated -> beforeUnmount -> unmounted。
3. Composition API 的影响：

- Vue 3.0 引入了 Composition API，它允许开发者将相关逻辑组织在一起，并按照功能而非生命周期进行组织，这对生命周期的管理有一定影响。
> 总体来说，Vue 3.0 在生命周期方面做了一些调整，使得生命周期更加清晰和统一，同时也引入了 Composition API 来提供更灵活的组织代码的方式。

### 1.4 原理
#### 1. Vue3.0 是如何变得更快的?(底层，源码)
- diff 方法优化
1. Vue2.x 中的虚拟 dom 是进行全量的对比
2. Vue3.0 中新增了静态标记(PatchFlag): 在与上次虚拟结点进行对比的时候，值对比带有patch flag的节点，并且可以通过flag的信息得知当前节点要对比的具体内容化。静态提升hoistStatic
- Vue2.x: 无论元素是否参与更新，每次都会重新创建
- Vue3.0: 对不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的利用。
- cacheHandlers 事件侦听器缓存
默认情况下 onClick 会被视为动态绑定，所以每次都会去追踪它的变化但是因为是同一个函数，所以没有追踪变化，直接缓存起来复用即可。
- 在 Vue 2 中，每当数据发生变化时，Vue 会创建一个新的虚拟 DOM 树，并对整个虚拟 DOM 树进行递归比较，即使其中大部分内容是静态的，最后再找到不同的节点，然后进行更新。
- Vue 3 引入了静态标记的概念，通过静态标记，Vue 3 可以将模板中的静态内容和动态内容区分开来。这样，在更新过程中，Vue 3 只会关注动态部分的比较，而对于静态内容，它将跳过比较的步骤，从而避免了不必要的比较，提高了性能和效率。
html复制代码
#### 2. nextTick的实现原理是什么?
在下次 DOM 更新循环结束之后执行延迟回调。nextTick主要使用了宏任务和微任务。根据执行环境分别尝试采用
- Promise
- MutationObserver
- setImmediate
- 如果以上都不行则采用setTimeout
定义了一个异步方法，多次调用nextTick会将方法存入队列中，通过这个异步方法清空当前队列。

- 在 Vue2 当中，nextTick 可以理解为就是收集异步任务到队列当中并且开启异步任务去执行它们。它可以同时收集组件渲染的任务，以及用户手动放入的任务。组件渲染的任务是由 watcher 的 update 触发，并且将回调函数包装为异步任务，最后推到 nextTick 的队列里，等待执行。
- 而在 Vue3 当中，nextTick 则是利用 promise 的链式调用，将用户放入的回调放在更新视图之后的 then 里面调用，用户调用多少次 nextTick，就接着多少个 then。

在 Vue.js 中，$nextTick 方法用于在 DOM 更新之后执行代码。它的原理是利用 JavaScript 的事件循环机制，在当前代码执行完成并让出主线程之后，利用 microtask 在下一个微任务队列中执行回调函数。

具体来说，当我们调用 $nextTick 方法时，Vue 会将传入的回调函数放入一个队列中，然后在当前代码执行结束后，立即执行微任务（microtask）队列中的任务。这确保了在下一个微任务队列中，DOM 已经更新完成，因此可以安全地访问和操作最新的 DOM 元素。

在实际应用中，$nextTick 方法常用于以下场景：

1. 在修改数据之后立即获取更新后的 DOM 状态。
2. 在 Vue 生命周期钩子函数中操作更新后的 DOM 元素。
3. 在组件中使用 $refs 访问更新后的子组件实例或 DOM 元素。
```js
new Vue({
  el: '#app',
  data: {
    message: 'Hello, Vue!'
  },
  mounted() {
    this.message = 'Hello, World!';
    this.$nextTick(() => {
      // 在下一个微任务队列中执行，此时 DOM 已经更新完成
      console.log(this.$refs.myElement.innerText); // 输出：Hello, World!
    });
  },
  template: `
    <div id="app">
      <div ref="myElement">{{ message }}</div>
    </div>
  `
});

```
总之，$nextTick 方法的原理是基于 JavaScript 的事件循环机制和微任务队列实现的，它为开发者提供了一种方便的方式来处理 DOM 更新后的操作，确保操作可以在更新后的 DOM 上进行。

#### 3. Vue 响应式系统的原理
Vue 实现响应式主要是采用数据劫持结合发布者-订阅者模式的方式。具体实现就是整合`Observer`，`Compiler` 和 `Watcher` 三者。


- Observer观察者。Vue 通过 Observer 对数据对象的所有属性进行监听，当把一个普通对象传给 Vue 实例的 data 选项时，Observer 将遍历它的所有属性，并为其添加 getter 和 setter。getter 将收集此属性所有的订阅者，setter 将在属性发生变动的时候，重新为此属性赋值，并通知订阅者调用其对应的更新函数。
在 Vue 2 中是通过 ES5 的 Object.defineProperty() 方法实现。
在 Vue 3 中是通过 ES6 的 new Proxy() 实现的。


- Compiler模板编译器。它的作用是对每个元素节点的指令 v- 和模板语法 {{}} 进行扫描，替换对应的真实数据，或绑定相应的事件函数。


- Watcher发布者/订阅者。Watcher 作为连接 Observer 和 Compiler 的桥梁，能够订阅并收到每个属性变动的通知，然后执行相应的回调函数。Compiler 在编译时通过 Watcher 绑定对应的数据更新回调函数，Observer 在监听到数据变化时执行此回调。在 Observer 中，Watcher 就是订阅者，在 Compiler 中，Watcher 就是发布者。

#### 4. 什么是MVVM
MVVM，即 Model–View–ViewModel，是一种软件架构模式。

- Model即模型，是指代表真实状态内容的领域模型（面向对象），或指代表内容的数据访问层（以数据为中心）。

- View即视图，是用户在屏幕上看到的结构、布局和外观（UI）。

- ViewModel即视图模型，是暴露公共属性和命令的视图的抽象。用于把 Model 和 View 关联起来。ViewModel 负责把 Model 的数据同步到 View 显示出来，还负责把 View 的修改同步回 Model 。

- 在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的，View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。

> 因此开发者只需关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

#### 5. 当数据改变时，Vue 是如何更新 DOM 的？（Diff 算法和虚拟 DOM）

当我们修改了某个数据时，如果直接重新渲染到真实 DOM，开销是很大的。Vue 为了减少开销和提高性能采用了 Diff 算法。当数据发生改变时，Observer 会通知所有 Watcher，Watcher 就会调用 patch() 方法（Diff 的具体实现），把变化的内容更新到真实的 DOM，俗称打补丁。
Diff 算法会对新旧节点进行同层级比较，当两个新旧节点是相同节点的时候，再去比较他们的子节点（如果是文本则直接更新文本内容），逐层比较然后找到最小差异部分，进行 DOM 更新。如果不是相同节点，则删除之前的内容，重新渲染。

patch() 方法先根据真实 DOM 生成一颗虚拟 DOM，保存到变量 oldVnode，当某个数据改变后会生成一个新的 Vnode，然后 Vnode 和 oldVnode 进行对比，发现有不一样的地方就直接修改在真实 DOM 上，最后再返回新节点作为下次更新的 oldVnode。

#### 6. 什么是虚拟 DOM？有什么用？
虚拟 DOM（Virtual DOM）就是将真实 DOM 的主要数据抽取出来，并以对象的形式表达，用于优化 DOM 操作。虚拟 DOM 的主要目的是提高性能和减少实际 DOM 操作的次数，从而改善用户界面的渲染速度和响应性。

比如真实 DOM 如下：
```vue
<div id="hello">
  <h1>123</h1>
</div>
```
对应的虚拟 DOM 就是（伪代码）：
```vue
const vnode = {
  type: 'div',
  props: {
    id: 'hello',
  },
  children: [
    {
      type: 'h1',
      innerText: '123',
    },
  ],
}

```
#### 7. 为什么 Vue 3.x 采用了 Proxy 抛弃了 Object.defineProperty() ？
> Proxy 可以代理任何对象，包括数组，而 Vue 2 中是通过重写数组的以下七种方法实现的。

- push()
- pop()（移除并返回数组的最后一个元素）
- unshift()（将一个或多个元素添加到数组的开头，并返回该数组的新长度）
- shift()（移除并返回数组的第一个元素）
- splice()（删除数组中的一个或多个元素，并将其返回）
- sort()（对数组进行排序）
- reverse()（对数组进行反转）

> Proxy 可以直接监听整个对象而非属性，而 Object.defineProperty() 只能先遍历对象属性再去进行监听。相比之下 Proxy 更加简洁，更加高效，更加安全。

Proxy 返回的是一个新对象，我们可以只操作新的对象达到目的。

```js
const cat = {
  name: 'Tom',
}

const myCat = new Proxy(cat, {
  get(target, property) {
    console.log(`我的 ${property} 被读取了`)
    return property in target ? target[property] : undefined
  },
  set(target, property, value) {
    console.log(`我的 ${property} 被设置成了 ${value}`)
    target[property] = value
    return true
  },
})

myCat.name // expected output: 我被读取了：name
myCat.name = 'Kitty' // expected output: 我的 name 被设置成了 Kitty

```
> Object.defineProperty() 的本质是在一个对象上定义一个新属性，或者修改一个现有属性。

```js
const cat = {
  name: 'Tom',
}

Object.defineProperty(cat, 'name', {
  get() {
    console.log(`我被读取了`)
  },
  set(value) {
    console.log(`我被设置成了 ${value}`)
  },
})

cat.name // expected output: 我被读取了
cat.name = 'Kitty' // expected output: 我被设置成了 Kitty

```

> 而 Proxy 天生用于代理一个对象，它有 13 种基本操作的拦截方法，是 Object.defineProperty() 不具备的。
- apply()（拦截函数的调用）
- construct()（拦截构造函数的调用）
- defineProperty()（拦截属性的定义）
- deleteProperty()（拦截属性的删除）
- get()（拦截对象属性的读取）
- getOwnPropertyDescriptor()（拦截对象属性的描述）
- getPrototypeOf()（拦截对象的原型）
- has()（拦截对象属性的检查）
- isExtensible()（拦截对象是否可扩展的检查）
- ownKeys()（拦截对象的属性列表）
- preventExtensions()（拦截对象是否可扩展的设置）
- set()（拦截对象属性的设置）
- setPrototypeOf()（拦截对象的原型的设置）

#### 8. 说说Vue 3.0中Treeshaking特性？举例说明一下？
1. 是什么？

Tree shaking 是一种通过清除多余代码方式来优化项目打包体积的技术，专业术语叫 Dead code elimination
简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码

- 在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到。
- 而Vue3源码引入tree shaking特性，将全局 API 进行分块。如果您不使用其某些功能，它们将不会包含在您的基础包中
2. 如何做？

Tree shaking是基于ES6模板语法（import与exports），主要是借助ES6模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量。
Tree shaking无非就是做了两件事：

- 编译阶段利用ES6 Module判断哪些模块已经加载
- 判断那些模块和变量未被使用或者引用，进而删除对应代码

3. 作用（好处）?

通过Tree shaking，Vue3给我们带来的好处是：

- 减少程序体积（更小）
- 减少程序执行时间（更快）
- 便于将来对程序架构进行优化（更友好）

#### 9. script setup 是干啥的？
scrtpt setup 是 vue3 的语法糖，简化了组合式 API 的写法，并且运行性能更好。使用 script setup 语法糖的特点：

- 属性和方法无需返回，可以直接使用。
- 引入组件的时候，会自动注册，无需通过 components 手动注册。
- 使用 defineProps 接收父组件传递的值。
- useAttrs 获取属性，useSlots 获取插槽，defineEmits 获取自定义事件。
- 默认不会对外暴露任何属性，如果有需要可使用 defineExpose 。

### 1.5 其他
#### 1. 单页面应用和多页面应用区别及优缺点?
- 单页面应用（SPA）: 通俗一点说就是指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多应用于pc端。

- 多页面（MPA）: 就是指一个应用中有多个页面，页面跳转时是整页刷新

##### 单页面的优点：
1. 用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小
2. 前后端分离
3. 页面效果会比较炫酷（比如切换页面内容时的专场动画）

##### 单页面缺点：
1. 不利于seo
2. 导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）
3. 初次加载时耗时多
4. 页面复杂度提高很多
#### 2. 如何封装命令式组件
```js
import MessageBox from '../components/MessageBox.vue';
import {createApp} from 'vue';

function showMsg(msg, clickHandler) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  // 渲染一个MessageBox组件
  const app = createAPP(MessageBox, {
    msg,
    onClick() {
      clickHandler & chilckHandler(() => {
        app.unmount(div);
        div.remove();
      })
    }
  })
  app.mount(div)
}

// 或者是使用 JSX 的形式封装一个组件
```
#### 2. Vue性能优化方法
##### 1. 编码阶段
- 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher；
- 如果需要使用v-for给每项元素绑定事件时使用事件代理；
- SPA 页面采用keep-alive缓存组件；
- 在更多的情况下，使用v-if替代v-show；
- key保证唯一；
- 使用路由懒加载、异步组件；
- 防抖、节流；
- 第三方模块按需导入；
- 长列表滚动到可视区域动态加载；
- 图片懒加载；
##### 2. 用户体验：
- 骨架屏；
- PWA；
- 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。
##### 3. SEO优化
- 预渲染；
- 服务端渲染SSR；
##### 4. 打包优化
- 压缩代码；
- Tree Shaking/Scope Hoisting；
- 使用cdn加载第三方模块；
- 多线程打包happypack；
- splitChunks抽离公共文件；
- sourceMap优化；



## 二、Vue-Router

### 1. Vue 路由模式 hash 和 history，简单讲一一下
- Hash 模式地址栏中有#，history 没有，
- History 模式下刷新，会出现 404 情况，需要后台配置使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash值
可以使用 hashchange 事件来监听 hash 值的变化HTML5 提供了 History API 来实现 URL 的变化。其中最主要的 API有以下两个: history.pushState() 和 history.repalceState()。这两个API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录
### 2. 如何获取路由传过来的参数？
#### 1. meta: 路由元信息，写在routers配置文件中
```js
{
    path: '/home',
    name: 'home',
    component: load('home'),
    meta: {
        title: '首页'
    },
},

// 获取方式 this.$route.meta.title 获取
```
#### 2. query
```js
this.$route.push({
    path:'/home',
    query:{
        userId:123
    }
})
// 浏览器地址：http://localhost:8036/home?userId=123 
// 获取方式：this.$route.query.userId
```
#### 3. params
- 首先要在地址上做配置
```js
{
    path: '/home/:userId',
    name: 'home',
    component: load('home'),
    meta: {
        title: '首页'
    },
},
```
- 访问传参
```js
const userId = '123'
this.$router.push({ name: 'home', params: { userId } })
// 注意用params传参，只能用命名的路由（用name访问），如果用path，params不起作用。
// this.$router.push({ path: '/home', params: { userId }})不生效。
// 浏览器地址：http://localhost:8036/home/123
// 获取方式：this.$route.params.userId

```
### 2. Vue 路由传参的两种方式，params 和 query方式与区别
动态路由也可以叫路由传参，就是根据不同的选择在同一个组件渲染不同的内容
用法上: query 用 path 引入，params 用name引入，接收参数都是类似的，分别是 this.$route.query.name和 this.$route.params.nameurl 展示上:params类似于 post，query 类似于 get，也就是安全问题,params 传值相对更安全点,query 通过ur 传参,刷新页面还在,params刷新页面不在了

### 3. Vue 中路由跳转方式(声明式/编程式)
> Vue 中路由跳转有两种，分别是声明式和编程式
- 用js方式进行跳转的叫编程式导航 this.$router.push ()
- 用 router-link 进行跳转的叫声明式
router-view 路由出口，路由模板显示的位置
> 路由中 name 属性有什么作用?
在 router-link中使用 name 导航到对应路由使用 name 导航的同时，给了路由传递参数

### 4. Route  router 区别
1. router 是 VueRouter 的一个对象，通过 Vue.use(VueRouter)和VueRouter构造函数得到一个 router的实例对象，这个对象中是一个全局的对象，他包含了所有的路由包含了许多关键的对象和属性
2.route 是一个跳转的路由对象，每一个路由都会有一个 route 对象，是一个局部的对象，可以获取对应的 name,path,params,query等
## 三、状态存储库
### 1. Vuex
#### 1. Vuex 是什么? 怎么使用? 在那种场景下使用
Vuex是一个专为 vue.js 应用程序开发的状态管理模式，通过创建一个集中的数据存储，方便程序中的所有组件进行访问，简单来说 vuex 就是vue 的状态管理T具
Vuex有五个属性 state getters mutations actions modulesstate 就是数据源存放地，对应一般vue 对象的 data,state 里面存放的数据是响应式的，state 数据发生改变，对应这个数据的组件也会发生改变用this.$store.state.xxx 调用Getters 相当于 store 的计算属性，主要是对 state 中数据的过滤，用this.$store.getters.xxx 调用Mutations 处理数据逻辑的方法全部放在 mutations 中，当触发事件想改变 state 数据的时候使用 mutations，用 this.$store.commit 调用给这个方法添加一个参数，就是 mutation 的载荷 (payload)Actions 异步操作数据，但是是通过 mutation 来操作 用this.$store.dispatch 来触发，actions 也支持载荷

#### 2. Vuex 流程
在vue 组件里面，通过 dispatch 来触发 actions 提交修改数据的操作然后通过 actions的 commit触发 mutations来修改数据，mutations接收到 commit 的请求，就会自动通过 mutate 来修改 state，最后由store 触发每一个调用它的组件的更新

#### 3. .Vuex 怎么请求异步数据
1. 首先在 state 中创建变量
2. 然后在 action 中调用封装好的 axios 请求，异步接收数据commit提交给 mutations
3. Mutations 中改变 state 中的状态，将从 action 中获取到的值赋值给state
#### 4. Vuex 中 action 如何提交给 mutation 的
Action函数接收一个与store实例具有相同方法和属性的context 对象,可以调用 context.commit提交 个 mutation,或者通过 context.state和 context.getters 获取 state 和 getters

#### 5. vuex 的 State 特性是?
State 就是数据源的存放地state 里面的数据是响应式的，state 中的数据改变，对应这个数据的组件也会发生改变
State 通过 mapstate 把全局的 state 和 getters 映射到当前组件的计算属性中

#### 6. vuex 的 Getter 特性是?
Getter 可以对 state 进行计算操作，它就是 store 的计算属性
Getter 可以在多组件之间复用如果一个状态只在一个组件内使用，可以不用 getters

#### 7. vuex 的 Mutation 特性是?
更改vuex store 中修改状态的唯 办法就是提交 mutation，可以在回调函数中修改 store 中的状态
#### 8. vuex 的 actions 特性是?
Action 类似于 mutation，不同的是 action 提交的是 mutation，不是直接变更状态，可以包含任意异步操作

#### 9. vuex 的优势

- 优点: 解决了非父了组件的通信，减少了 ajax 请求次数，有些可以直接从 state 中获取
- 缺点: 刷新浏览器，vuex 中的 state 会重新变为初始状态，解决办法是`vuex-along`插件，得配合计算属性和 sessionstorage 来实现


### 3.2 pinia

#### 1. Pinia介绍
Pinia 是 Vue 官方团队成员专门开发的一个全新状态管理库，并且 Vue 的官方状态管理库已经更改为了 Pinia。在 Vuex 官方仓库中也介绍说可以把 Pinia 当成是不同名称的 Vuex 5，这也意味不会再出 5 版本了。
- 优点

1. 更加轻量级，压缩后提交只有1.6kb。
2. 完整的 TS 的支持，Pinia 源码完全由 TS 编码完成。
3. 移除 mutations，只剩下 state 、 actions 、 getters 。
4. 没有了像 Vuex 那样的模块镶嵌结构，它只有 store 概念，并支持多个 store，且都是互相独立隔离的。当然，你也可以手动从一个模块中导入另一个模块，来实现模块的镶嵌结构。
5. 无需手动添加每个 store，它的模块默认情况下创建就自动注册。
6. 支持服务端渲染（SSR）。


> Pinia 配套有个插件 pinia-plugin-persist进行数据持久化，否则一刷新就会造成数据丢失


