# 策略模式

## 策略模式定义

策略模式的定义是：`定义一些列的算法，把它们一个个封装起来，并且可以使它们可以相互替换`。

将不变的部分和变化的部分隔开是每个设计模式的主题，策略模式也不例外，策略模式的目的就是将算法的使用与算法的实现分离开来。
一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。 第二个部分是环境类 Context， Context 接受客户的请求，随后把请求委托给某一个策略类。

## 使用策略模式计算奖金

比如年终分发给员工的奖金根据评价等级来定：S 级可以得到 4 倍奖金，A 级可以拿 3 倍奖金，B 级可以拿 2 倍奖金

那么我们定义一个基本的函数来计算

```js
function computed(grade, bonus) {
  if (grade === 'S') {
    return bonus * 4
  }
  if (grade === 'A') {
    return bonus * 3
  }
  if (grade === 'B') {
    return bonus * 2
  }
}

console.log(computed('S', 3000)) // 12000
console.log(computed('A', 2000)) // 6000
```

但是这个函数看起来比较挫，内部包含了很多的 `if else` 语句，而且如果后期新增了一个其它的等级，还需要修改原函数，这个对于编写代码来说是非常不友好的

## 使用策略模式封装

接下来将上面的例子使用策略模式进行封装，会议一下策略模式的定义：

`定义一些列的算法，把它们一个个封装起来，并且可以使它们可以相互替换`

```js
class GradeS {
  computed(bonus) {
    return bonus * 4
  }
}

class GradeA {
  computed(bonus) {
    return bonus * 3
  }
}

class GradeB {
  computed(bonus) {
    return bonus * 2
  }
}

class ComputedBonus {
  constructor(salary, strategy) {
    this.salary = salary
    this.strategy = strategy
  }
  getBonus() {
    return this.strategy.computed(this.salary)
  }
}

const computedBonus1 = new ComputedBonus(3000, new GradeS())
const computedBonus2 = new ComputedBonus(2000, new GradeA())

console.log(computedBonus1.getBonus()) // 12000
console.log(computedBonus2.getBonus()) // 6000
```

```js

```

### 一等函数对象与策略模式

在函数作为一等对象的语言中，策略模式是隐形的

在 `JavaScript` 中，除了使用类来封装算法和行为之外，使用函数当然也是一种选择。这些“算法”可以被封装到函数中并且四处传递，也就是我们常说的高阶函数。实际上在 `JavaScript` 这种将函数作为一等对象的语言里，**策略模式已经融入到了语言本身当中，我们经常用高阶函数来封装不同的行为，并且把它传递到另一个函数中。**当我们对这些函数发出“调用”的消息时，不同的函数会返回不同的执行结果。在JavaScript 中，“函数对象的多态性”来得更加简单。

**优点：**

* 避免多重条件选择语句：策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
* 复用性好：策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展。

**缺点**

* 增加许多策略类或者策略对象: 但实际上这比把它们负责的逻辑堆砌在 Context 中要好。
* 违反最少知道原则： 要使用策略模式，必须了解所有的 strategy，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy。比如，我们要选择一种合适的旅游出行路线，必须先了解选择飞机、火车、自行车等方案的细节。此时 strategy 要向客户暴露它的所有实现


在 JavaScript 语言的策略模式中，策略类往往被函数所代替，这时策略模式就成为一种隐形的模式。