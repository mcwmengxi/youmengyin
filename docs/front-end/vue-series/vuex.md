# vuex

## vuex 简介
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态只能按照一定的方式进行修改。Vuex 通过一种响应式的方式实现了组件之间共享状态的管理。

Vuex 的核心概念包括：
- State（状态）：即应用程序中需要共享的数据状态。Vuex 使用单一状态树，即一个对象包含了全部的应用层级状态。
- Getters（获取器）：用于从状态树中派生出一些状态，类似于 Vue 中的计算属性。Getter 可以对状态进行一些处理后返回新值。
- Mutations（突变）：用于变更状态，是 Vuex 中唯一允许同步操作状态的地方。每个 mutation 都有一个字符串类型的事件类型和一个回调函数，通过执行 mutation 来改变状态。
- Actions（动作）：用于提交 mutation，可以包含任意异步操作。Action 提交的是 mutation，而不是直接变更状态。在 action 中可以执行异步操作后再提交 mutation。
- Modules（模块）：允许将 store 分割成模块，每个模块拥有自己的 state、mutation、action、getter 等。这样使得代码更加结构化和易维护。

## 辅助函数
1. mapState: 辅助函数mapState可以用来快速将组件的计算属性映射到 Vuex 的 state 中。它接收一个数组或对象作为参数，可以简化从 store 中获取 state 的操作。
```js
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      count: state => state.count
    })
  }
}

```
2. mapGetters: mapGetters可以用于将 getter 映射到组件的计算属性中。它接收一个数组或对象作为参数，可以简化从 store 中获取 getter 的操作。例如：
```js
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter'
    ])
  }
}
```

3. mapMutations: mapMutations可以将 mutations 映射到组件的 methods 中。它接收一个数组或对象作为参数，可以简化提交 mutation 的操作。例如：
```javascript
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ])
  }
}
```
4. mapActions: mapActions可以将 actions 映射到组件的 methods 中。它接收一个数组或对象作为参数，可以简化 dispatch action 的操作。例如：
```javascript
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ])
  }
}
```

## vuex 使用
```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 状态
  state: {
    list: ['吃鸡']
  },
  // 获取状态
  getters: {
    list: state => state.list.join(',')
  },
// 修改状态
  mutations: {
    addItem (state, item) {
      state.list.push(item)
    }
  },
  // 异步修改状态
  actions: {
    addItemAsync ({ commit }, item) {
      setTimeout(() => {
        commit('addItem', item)
      }, 3000)
    }
  },
  // 模块化
  modules: {
  }
})
```
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
```vue
<template>
  <div>
    <!-- 通过 $store属性获取state值 -->
    <h1>
      {{ $store.state.list.join('') }}
    </h1>
    <!-- 通过 mapState 获取list -->
    <h1>
      {{ list }}
    </h1>
    <!-- 通过 matGetters 获取 list -->
    <h1>
      {{ list2 }}
    </h1>
    <input type="text" v-model="item">
    <button @click="handleBtn" >同步添加数据</button>
    <button @click="handleBtnAsync" >异步添加数据</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      item: ''
    }
  },
  computed: {
    ...mapState(['list']),
    ...mapGetters({
      list2: 'list'
    })
  },
  methods: {
    // 同步更改数据
    ...mapMutations(['addItem']),
    // 异步更改数据
    ...mapActions(['addItemAsync']),
    handleBtn () {
      console.log(1111, this.$store)
      if (!this.item) return
      // 通过辅助函数更新数据
      this.addItem(this.item)
      // 通过提交 mapMutations 更新数据
      this.$store.commit('addItem', this.item.split('').reverse().join(''))
      this.item = ''
    },
    handleBtnAsync () {
      console.log(1111, this.$store)
      if (!this.item) return
      // 通过辅助函数 mapActions 更新数据
      this.addItemAsync(this.item)
      // 通过 dispatch 更新数据
      this.$store.dispatch('addItemAsync', this.item.split('').reverse().join(''))
      this.item = ''
    }
  },
  mounted () {
    console.log(this.$store)
  }
}
</script>
```