# 网页的各种距离

>需要计算距离、宽高等的场景有很多


## 获取网页的滚动距离
页面一般都是超过一屏的，右边会出现滚动条，代表当前可视区域的位置：这里窗口的部分是可视区域，也叫做视口`viewport`。

![网页的各种距离](/front-end/offset.png)

事件对象可以拿到 pageY、clientY、offsetY，分别代表到点击的位置到文档顶部，到可视区域顶部，到触发事件的元素顶部的距离。还有个 screenY，是拿到到屏幕顶部的距离。


元素的`getBoundingClientRect`方法是返回元素距离可以可视区域的距离和宽高的：

![getBoundingClientRect](/front-end/client-rect.png)

react 事件是合成事件缺少offsetY属性，可以用它来解决这个问题。用 e.pageY 减去 getBoundingClientRect().top 减去 window.pageYOffset 算出来。而 window.pageYOffset 也叫 window.scrollY，顾名思义就是窗口滚动的距离。


```js

  const top = (window.document.getElementById('box') as HTMLDivElement).getBoundingClientRect().top
  console.log('box pageY', e.pageY)
  console.log('box clientY', e.clientY)
  console.log('box offsetY', e.offsetY)
  console.log('box rect', e.pageY - top - window.pageYOffset, e.pageY - top - window.scrollY)
  console.log('box screenY', e.screenY)

```


## 获取元素的滚动距离

>窗口的滚动距离用 window.scrollY 获取，那元素也有滚动条呢？

可以通过element.scrollTop获取元素的滚动距离，但是这个距离是相对于元素的，而不是窗口的。

元素还有 offsetTop 和 clientTop 属性

clientTop 也就是上边框的高度 1px

offsetTop 是距离最近的有 position 属性（relative 或 absolute 或 fixed）的元素的距离。



```js

  console.log('el scrollTop', boxRef.value.scrollTop)
  console.log('el offsetTop', boxRef.value.offsetTop)
  console.log('el clientTop', boxRef.value.clientTop)

```

offsetTop 相对于哪个元素，那个元素就是 offsetParent。
还可以递归累加到 offsetParent 的 offsetTop，直到 offsetParent 为 null，也就是到了根元素，这时候算出来的就是元素到根元素的 offsetTop：

因为 offsetTop 元素顶部到 offsetParent 内容部分的距离，不包括 border。

这时候加上 clientTop 就可以了，它就是上边框的高度。

```js
function getTotalOffsetTop(element: HTMLElement) {
  let totalOffsetTop = 0
  while (element) {
    if (totalOffsetTop > 0) {
      // 元素上边框高度
      totalOffsetTop += element.clientTop
    }
    totalOffsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return totalOffsetTop
}
```

这里有两个 `clientTop`，当前元素的` clientTop` 不用加：

![totalOffsetTop](/front-end/total-offset-top.png)

window.innerHeight、window.innerWidth 是窗口的宽高，也就是可视区域的宽高
scrollHeight是元素的包含滚动区域的高度，不包括 border。
clientHeight 是内容区域的高度，不包括 border。
offsetHeight 包括 border。
getBoundingClientRect 拿到的包围盒的高度，而 offsetHeight 是元素本来的高度。

```js
  // 元素的内容高度，不包括边框
  console.log('el scrollHeight', boxRef.value.scrollHeight)
  console.log('el clientHeight', boxRef.value.clientHeight)
  // 元素的内容高度 + border
  console.log('el offsetHeight', boxRef.value.offsetHeight)
  // 元素旋转后就会和offsetHeight不相等， getBoundingClientRect拿到的包围盒的高度
  console.log('el reat', boxRef.value.getBoundingClientRect().height)
```

对于滚动到页面底部的判断，就可以用 window.scrollY + window.innerHeight 和 document.documentElement.scrollHeight 对比

如果要获取元素的滚动距离，可以用element.scrollHeight - element.clientHeight - element.scrollTop。


## 总结

浏览器里计算位置、宽高、判断一些交互，都需要用到距离、宽高的属性。
这类属性比较多，我们整体过了一遍：

- e.pageY：鼠标距离文档顶部的距离
- e.clientY：鼠标距离可视区域顶部的距离
- e.offsetY：鼠标距离触发事件元素顶部的距离
- e.screenY：鼠标距离屏幕顶部的距离
- winwodw.scrollY：页面滚动的距离，也叫 window.pageYOffset，等同于 document.documentElement.scrollTop
- element.scrollTop：元素滚动的距离
- element.clientTop：上边框高度
- element.offsetTop：相对有 position 的父元素的内容顶部的距离，可以递归累加，加上 clientTop，算出到文档顶部的距离
- clientHeight：内容高度，不包括边框
- offsetHeight：包含边框的高度
- scrollHeight：滚动区域的高度，不包括边框
- window.innerHeight：窗口的高度
- element.getBoundingClientRect：拿到 width、height、top、left 属性，其中 top、left 是元素距离可视区域的距离，width、height 绝大多数情况下等同 offsetHeight、offsetWidth，但旋转之后就不一样了，拿到的是包围盒的宽高

其中，还要注意 react 的合成事件没有 offsetY 属性，可以自己算，react-use 的 useMouse 的 hook 就是自己算的，也可以用 e.nativeEvent.offsetY 来拿到。
