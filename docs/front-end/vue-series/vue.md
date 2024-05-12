# Vue

## 1. 组件通信
### 1.1 Vue2.x
#### 1. 子组件通过 props 接收父组件传递的数据
```vue
<!-- 父组件 -->
<template>
  <div>
    <Child
      :msg="message"
    />
  </div>
</template>

<script>
import Child from '../components/Child.vue'

export default {
  name: 'Home',
  data () {
    return {
      message: '你好！',
    }
  },
  methods: {
  },
  components: {
    Child
  }
}
</script>

```

```vue
<!-- 子组件 -->
<template>
  <div>
    <!-- 父组件传进来的数据 -->
    {{ msg }}
    <!-- 当前组件自己定义的数据 -->
    {{ name }}
    {{ age }}
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      name: '李四',
      age: 20
    }
  }
}
</script>
```
#### 2. 子组件通过 `$parent` 获取父组件实例上的数据
<template>
  <div>
    <!-- 子组件通过 $parent 获取到的父组件数据 -->
    {{ sex }}
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      name: '李四',
      age: 20,
      sex: ''
    }
  },
  mounted () {
    this.sex = this.$parent.sex
  }
}
</script>

#### 1. 2. 子组件向父组件传递数据
> 子组件通过 `$emit` 方法向父组件触发事件，并将数据传递给父组件。
```vue
<!-- 父组件 -->
<template>
  <div>
    <Child
      :msg="message"
      @handleBtn="handleBtn"
    />
  </div>
</template>

<script>
import Child from '../components/Child.vue'

export default {
  name: 'Home',
  data () {
    return {
      message: '你好！',
      sex: '男'
    }
  },
  methods: {
    handleBtn (data) {
      console.log('子组件向父组件传递的数据', data)
    }
  },
  components: {
    Child
  }
}
</script>

```
```vue
<!-- 子组件 -->
<template>
  <div>
    <!-- 父组件传进来的数据 -->
    {{ msg }}
    <!-- 当前组件自己定义的数据 -->
    {{ name }}
    {{ age }}
    <!-- 子组件通过 $parent 获取到的父组件数据 -->
    {{ sex }}

    <button @click="handleBtn">按钮</button>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      name: '李四',
      age: 20,
      sex: ''
    }
  },
  methods: {
    handleBtn () {
      this.$emit('handleBtn', {
        name: this.name.split('').reverse().join(''),
        age: this.age,
        sex: this.sex
      })
    }
  },
  mounted () {
    this.sex = this.$parent.sex
  }
}
</script>

```
### 1.2 Vue3.x

## 2. 插槽
> 允许在父组件中预留位置，动态地插入子组件的内容。这在创建可复用的组件时非常有用。
### 2.1 默认插槽(Default Slot)
> 默认插槽是最基本的插槽类型，在父组件中使用 `<slot>` 标签定义，如果子组件没有提供内容插入到这个插槽中，那么将显示默认的内容。
1. 定义子组件
```vue
<!-- 子组件内容 -->
<template>
  <div>
    <h1>DefaultSlot</h1>

    <!-- 使用 slot 预留位置 -->
    <slot>李四</slot>
  </div>
</template>

<script>
export default {
  name: 'DefaultSlot'
}
</script>

```
2. 在父组件中使用子组件，并插入内容
```vue
<template>
  <div>
    <!-- 使用插槽的默认值 -->
    <DefaultSlot />
    <!-- 自定义插槽内容 -->
    <DefaultSlot>
      <p>默认插槽内容 -- {{ name }}</p>
    </DefaultSlot>
  </div>
</template>

<script>
import DefaultSlot from '../components/DefaultSlot.vue'

export default {
  name: 'Home',
  data () {
    return {
      name: '张三'
    }
  },
  components: {
    DefaultSlot
  }
}
</script>
```

### 2.2 具名插槽(Named Slot)
> 具名插槽允许你在父组件中定义多个具有名称的插槽，子组件可以根据名称将内容插入到对应的插槽中。在父组件中使用 `<slot>` 标签时，通过 name 属性指定插槽的名称。
1. 定义子组件内容
```vue
<template>
  <div>
    <h1>具名插槽</h1>

    <!-- 1. 预留具名插槽位置 header -->
    <slot name="header"></slot>
    <span>组件内容</span>

    <!-- 2. 预留默认插槽位置 -->
    <slot>主体</slot>

    <!-- 3. 预留具名插槽位置 footer -->
    <slot name="footer" />
  </div>
</template>

<script>
export default {
  name: 'NamedSlot'
}
</script>
```
2. 在父组件中使用子组件，并插入内容
```vue
<template>
  <div>
    <!-- 1. 任何插槽都不写 -->
    <NamedSlot />
    <hr>

    <!-- 2. 自定义插槽内容 -->
    <NamedSlot>
      <!-- 具名插槽 -->
      <template v-slot:header>
        <h1>我是头部内容 -- {{ name }}</h1>
      </template>
      
      <template #footer>
        <h1>我是尾部内容 -- {{ name }}</h1>
      </template>
      <!-- 默认插槽 -->
      <p>我是主体内容 -- {{ name }}</p>
    </NamedSlot>
    <hr>

    <!-- 3. 只定义默认插槽内容 -->
    <NamedSlot>
      <!-- 默认插槽 -->
      <div>
        {{ name }}
      </div>
    </NamedSlot>
  </div>
</template>

<script>
import NamedSlot from '../components/NamedSlot.vue'

export default {
  name: 'Home',
  data () {
    return {
      name: '张三'
    }
  },
  components: {
    NamedSlot
  }
}
</script>

```

### 2.3 作用域插槽(Scoped Slot)
> 作用域插槽是一种特殊类型的插槽，它允许子组件向父组件传递数据。通过在子组件中使用 `<slot>` 标签的 v-slot 指令来定义作用域插槽，并在父组件中使用子组件时，可以通过 `slot-scope` 属性获取子组件传递的数据。
1. 子组件中使用 `<slot>` 标签，并使用 `v-slot` 指令来定义作用域插槽。
```vue
<template>
  <div>
    <h1>作用域插槽</h1>
    <slot :data="obj"></slot>

    <slot :data="footer" name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'ScopedSlot',
  data () {
    return {
      obj: {
        name: '张三',
        age: 18
      },
      footer: {
        text: '底部内容'
      }
    }
  }
}
</script>

```
2. 父组件中使用子组件时，通过 `slot-scope` 属性获取子组件传递的数据。
```vue
<template>
  <div>
    <!-- 1. 不使用插槽内容 -->
    <ScopedSlot />
    <hr>

    <!-- 2. 使用插槽内容 -->
    <ScopedSlot>
      <!-- 默认的具名插槽 -->
      <template v-slot:default="slotProps">
        <div>
          姓名：{{ slotProps.data.name }}
        </div>
        <div>
          性别：{{ slotProps.data.age }}
        </div>
      </template>

      <!-- 2. 具名的默认插槽 -->
      <template v-slot:footer="slotProps">
        <div>
          {{ slotProps.data.text }}
        </div>
      </template>
    </ScopedSlot>
  </div>
</template>

<script>
// import DefaultSlot from '../components/DefaultSlot.vue'
// import NamedSlot from '../components/NamedSlot.vue'
import ScopedSlot from '../components/ScopedSlot.vue'

export default {
  name: 'Home',
  data () {
    return {
      name: '张三'
    }
  },
  components: {
    // DefaultSlot,
    // NamedSlot,
    ScopedSlot
  }
}
</script>

</script>

```

## 3. keep-alive
> Vue 的 keep-alive 是一个抽象组件，用于缓存动态组件，它可以保留组件状态或避免重新渲染。
当 keep-alive 包裹动态组件时，这些动态组件将会被缓存起来，而不是每次切换时都销毁重建。这意味着在切换回已经缓存的组件时，它们的状态将会被保留，而不需要重新渲染和重新挂载。
```vue
<template>
  <div id="app">
    <button @click="toggleComponent">Toggle Component</button>
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    };
  },
  methods: {
    toggleComponent() {
      this.currentComponent = this.currentComponent === 'ComponentA' ? 'ComponentB' : 'ComponentA';
    }
  }
};
</script>
```
> `<keep-alive>` 包裹了一个动态组件，在切换动态组件时，被缓存的组件状态将会被保留，从而提高了页面切换的性能和用户体验。需要注意的是，在使用 keep-alive 时，被缓存的组件需要实现 activated 和 deactivated 生命周期钩子，在组件被激活和停用时执行相应的逻辑
### `keep-alive` 接收三个属性：
- `include`：字符串或正则表达式，只有匹配的组件会被缓存。
- `exclude`：字符串或正则表达式，任何匹配的组件都不会被缓存。
- `max`：数字，最多可以缓存多少组件实例。
```vue
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```
匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称 (父组件 components 选项的键值)。匿名组件不能被匹配。

- max: 最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

### `<keep-alive>` 不会在函数式组件中正常工作，因为它们没有缓存实例。

### `<keep-alive>` 案例
#### 案例1：
- 定义两个组件
```vue
<!-- componentA -->
<template>
  <div>
    组件A
  </div>
</template>

<script>
export default {
  beforeCreate () {
    console.log('组件A beforeCreate')
  },
  created () {
    console.log('组件A created')
  },
  beforeMount () {
    console.log('组件A beforeMount')
  },
  mounted () {
    console.log('组件A mounted')
  },
  activated () {
    console.log('组件A activated')
  },
  deactivated () {
    console.log('组件A deactivated')
  },
  destroyed () {
    console.log('组件A destroyed')
  }
}
</script>
```

```vue
<!-- componentB -->
<template>
  <div>
    组件B
  </div>
</template>

<script>
export default {
  beforeCreate () {
    console.log('组件B beforeCreate')
  },
  created () {
    console.log('组件B created')
  },
  beforeMount () {
    console.log('组件B beforeMount')
  },
  mounted () {
    console.log('组件B mounted')
  },
  activated () {
    console.log('组件B activated')
  },
  deactivated () {
    console.log('组件B deactivated')
  },
  destroyed () {
    console.log('组件B destroyed')
  }
}
</script>
```
- 使用这两个组件
```vue
<template>
  <div>
    <button @click="toggleComponent">Toggle Component</button>
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>

  </div>
</template>

<script>
import ComponentA from '../components/ComponentA.vue'
import ComponentB from '../components/ComponentB.vue'

export default {
  name: 'Home',
  data () {
    return {
      currentComponent: 'ComponentA'
    }
  },
  methods: {
    toggleComponent () {
      this.currentComponent =
        this.currentComponent === 'ComponentA' ? 'ComponentB' : 'ComponentA'
    }
  },
  components: {
    ComponentA, ComponentB
  }
}
</script>
```

- 一开始显示 `ComponentA`, 依次输出`组件A beforeCreate`、`组件A created`、`组件A beforeMount`、`组件A mounted`、`组件A activated`；
- 当第一次点击按钮时，显示`ComponentB`, 依次输出`组件B beforeCreate`、`组件B created`、`组件B beforeMount`, 此时输出`组件A deactivated`，然后再输出 `组件B mounted`、`组件B activated`; 
- 当第二次点击按钮时，显示`ComponentA`, 依次输出`组件B deactivated`、`组件A activated`;
- 当第三次点击按钮时，显示`ComponentB`, 依次输出`组件A deactivated`、`组件B activated`

## 4. 混入
> 它允许我们将一个对象混入到多个 Vue 组件中，从而实现代码复用。
具体来说，当我们创建一个混入对象时，该对象可以包含组件选项、生命周期钩子、数据、方法等内容。然后，我们可以在需要的组件中通过 mixins 选项来引入这个混入对象，从而让混入对象的内容被合并到组件中。

### 4.1 Vue 中混入的缺点主要包括以下几个方面：
1. 命名冲突：如果多个混入对象中定义了相同的数据或方法，那么在组件中使用这些混入对象时就可能会出现命名冲突的问题。为了避免这种情况，我们需要在混入对象的命名上做好规范。

2. 不可预期的副作用：由于混入对象的内容是被合并到组件中的，因此有可能会出现不必要的副作用，导致组件的行为不可预期。为了避免这种情况，我们需要在混入对象中定义好适用的条件和限制。

3. 复杂度增加：当一个组件引入多个混入对象时，它的代码复杂度会随之增加，特别是当这些混入对象之间存在相互依赖的关系时，代码会变得更加难以理解和维护。

4. 语义不清：混入对象的作用是将代码复用到多个组件中，但是混入对象本身的语义并不清晰，容易让人产生混淆和不必要的错误。因此，在使用混入对象时，我们需要在命名和注释等方面做好充分的说明，使其代码含义更加明确。

> 总的来说，混入是一种非常便捷的方式来实现组件之间的代码复用，但需要注意避免命名冲突、不可预期的副作用以及复杂度增加等问题，以确保代码的可维护性和可读性。

### 4.2 混入对象的使用
1. 创建一个2个混入对象
```js
export const mixin1 = {
  data () {
    return {
      name: '张三',
      age: 18
    }
  },
  methods: {
    addAge () {
      this.age++
    }
  }
}

export const mixin2 = {
  data () {
    return {
      age: 30
    }
  }
}
```

2. 在组件中引入混入对象
```vue
<template>
  <div>
    <!-- mixin1 的 name 数据 和 当前组件的 name 冲突了, 那么使用 组件 中的数据 -->
    {{ name }}
    <!-- mixin1 和 mixin2 都定义了 age 变量，后面的将前面的覆盖掉了 -->
    {{ age }}
    <button @click="addAge">
      增加年龄
    </button>

  </div>
</template>

<script>
import { mixin1, mixin2 } from '../mixins/mixin.js'

export default {
  name: 'Home',
  mixins: [mixin1, mixin2],
  data () {
    return {
      name: '李四'
    }
  }
}
</script>

```


## 6. 生命周期
Vue.js 是一个用于构建用户界面的渐进式框架，其每个实例在创建时都会经历一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。这些过程发生的时刻被称为“生命周期钩子”，允许用户在特定阶段添加自己的代码。
### vue2.0 生命周期钩子
1. beforeCreate

- 这个阶段发生在实例初始化之后，数据观测 (data observer) 和事件/侦听器配置之前。
- 在这一步，data 和 methods 中的内容还不能访问。

2. created

- 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。
- 这时可以进行数据请求或是开始操作内部数据等。

3. beforeMount

- 在挂载开始之前被调用：相关的 render 函数首次被调用。
- 该钩子在服务器端渲染期间不被调用。

4. mounted

- el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
- 如果根实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。
- 注意 mounted 不会保证所有的子组件也都被挂载完成。

5. beforeUpdate

- 数据更新时调用，发生在虚拟 DOM 打补丁之前。
- 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

6. updated

- 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
- 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
- 但是在此期间还是可能存在子组件尚未更新完成。

7. beforeDestroy

- 实例销毁之前调用。在这一步，实例仍然完全可用。
- 这是清理定时器或解绑全局事件监听器的好时机。

8. destroyed

- Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

- 通常用于执行清理工作和资源释放。

### vue3.0 生命周期钩子
Vue 3 对生命周期钩子进行了一些更新和调整，以更好地适应其 Composition API。虽然大部分的生命周期钩子都保留了下来，但是它们的命名有所改变，并且引入了一些新的钩子
#### 与 Vue2 相对应的生命周期钩子
1. beforeCreate 和 created

在 Vue 3 中，这些钩子的概念通过 setup() 函数被替代。setup() 函数在组件实例创建之初就被调用，这时候组件的 props 已经被解析。

2. beforeMount

在挂载（mounting）过程开始之前调用。此时，组件的模板和数据已经编译成了一个渲染函数，但还未执行渲染。

3. mounted

在组件被挂载到 DOM 上之后调用。此时，所有的处理都已完成，组件已经可见。

4. beforeUpdate

在组件更新之前调用。此时，组件的数据已经改变，但是 DOM 还没有更新。

5. updated

在组件的数据变化导致的虚拟 DOM 重新渲染和打补丁之后调用。

6. beforeUnmount (Vue 2 中为 beforeDestroy)

在卸载（unmounting）组件实例之前调用。此时，组件实例仍然完全可用。

7. unmounted (Vue 2 中为 destroyed)

在组件实例被卸载之后调用。此时，组件已经被完全销毁。

#### 新增的生命周期钩子
1. onActivated

用于 `keep-alive` 缓存的组件激活时调用。
2. onDeactivated

用于 `<keep-alive>` 缓存的组件停用时调用。

3. onRenderTracked

当虚拟 DOM 渲染函数被跟踪时调用。

4. onRenderTriggered

当虚拟 DOM 渲染函数被触发重新渲染时调用。

#### 用 Composition API 的生命周期钩子
在 Vue 3 的 Composition API 中，生命周期钩子有了对应的函数，可以直接在 setup() 函数中使用。例如，mounted 钩子在 Composition API 中可以通过 onMounted 函数来使用：
```js
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载');
    });
  }
}
```

这些函数包括：

- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted
- onActivated
- onDeactivated
- onRenderTracked
- onRenderTriggered

使用 Composition API 的生命周期钩子提供了更灵活的组织代码的方式，尤其是在使用 setup() 函数定义组件逻辑时。这些生命周期钩子函数使得将逻辑相关的代码组织在一起变得更加简单和直观。

## 7. 自定义指令
Vue 自定义指令提供了一种机制，允许开发者对普通 DOM 元素进行底层操作。这在你需要直接操作DOM时非常有用，比如，当你需要集中处理 DOM 事件监听或是实现特定的动画效果时。Vue.js 允许你注册自己的自定义指令，扩展 Vue 基本功能。
### 注册自定义指令
Vue 自定义指令可以全局或组件内部注册。
#### 全局注册
使用 Vue.directive(id, [definition]) 进行全局注册：
```js
Vue.directive('my-directive', {
  bind(el, binding, vnode, oldVnode) {
    // 在绑定元素的父组件被挂载时调用
  },
  inserted(el, binding, vnode, oldVnode) {
    // 被绑定元素插入父节点时调用
  },
  update(el, binding, vnode, oldVnode) {
    // 所在组件的 VNode 更新时调用
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  },
  unbind(el, binding, vnode, oldVnode) {
    // 只调用一次，指令与元素解绑时调用
  }
});

```
#### 组件内注册
在组件的 directives 选项中注册：
```js
export default {
  directives: {
    'my-directive': {
      bind(el, binding, vnode) {
        // 操作
      }
    }
  }
}
```
### 钩子函数参数
自定义指令提供了几个钩子函数（可选）：

- bind: 只调用一次，指令第一次绑定到元素时调用。
- inserted: 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。
- update: 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
- componentUpdated: 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind: 只调用一次，指令与元素解绑时调用。

> 每个钩子函数都接受以下参数：

- el: 指令所绑定的元素，可以用来直接操作 DOM。
- binding: 一个对象，包含以下属性：
  - name: 指令名，不包括 v- 前缀。
  - value: 指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - oldValue: 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。
  - expression: 字符串形式的指令表达式。
  - arg: 传给指令的参数，例如 v-my-directive:foo 中，参数为 "foo"。
  - modifiers: 一个包含修饰符的对象。
- vnode: Vue 编译生成的虚拟节点。
- oldVnode: 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
### 实际应用示例
```js
// 假设我们想要创建一个自定义指令 v-focus，使得元素在页面加载时自动获得焦点：
// 全局注册 v-focus 指令
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
});

```

```js
// 在组件模板中使用：

<input v-focus>
```
这样，当页面加载并且该 <input> 元素被插入到 DOM 中时，它会自动获得焦点。

自定义指令是 Vue 中一个强大的功能，允许开发者以声明式的方式处理底层 DOM 操作，使得代码更加简洁和可维护。