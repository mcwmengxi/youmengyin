# 场景题

## 1.封装一个函数，接收多个promise，其中只要有一个promise resolve或者reject了，那它整体就resolve了

什么场景会用到这种实现？

```javascript
// ... existing code ...

/**
 * 接收多个Promise，当任一Promise settle时（无论resolve或reject）立即resolve
 * @param {Promise[]} promises - Promise数组
 * @returns {Promise} 包含第一个settle结果的Promise，始终resolve
 */
function promiseFirstSettled(promises) {
  // 验证输入是否为数组
  if (!Array.isArray(promises)) {
    return Promise.resolve(new TypeError('参数必须是Promise数组'));
  }

  return new Promise((resolve) => {
    let isSettled = false;

    promises.forEach(p => {
      // 确保处理的是Promise对象
      Promise.resolve(p).then(
        // 处理resolve情况
        result => {
          if (!isSettled) {
            isSettled = true;
            resolve({
              status: 'fulfilled',
              value: result
            });
          }
        },
        // 处理reject情况（也作为resolve返回）
        reason => {
          if (!isSettled) {
            isSettled = true;
            resolve({
              status: 'rejected',
              reason: reason
            });
          }
        }
      );
    });
  });
}


```

青萱织梦人
实现​
Trae AI
思考过程
我现在需要处理用户的最新请求：“实现”。根据之前的对话历史，用户之前要求分析test.js中的myCall和myBind方法的实现，现在用户可能希望实现之前提到的那个接收多个promise，只要有一个resolve或reject就整体resolve的函数。

首先，我需要确认用户的具体需求。根据之前的上下文，用户提到的场景是在scene.md文件中：“封装一个函数，接收多个promise，其中只要有一个promise resolve或者reject了，那它整体就resolve了”。所以用户现在的“实现”应该是指实现这个函数。

接下来，我需要确定如何实现这个函数。这个需求类似于Promise.race，但有一点不同：Promise.race是当第一个promise settle（无论是resolve还是reject）时，返回的promise就会以相同的结果settle。而用户的需求是无论第一个结果是resolve还是reject，整体都resolve。也就是说，即使有promise reject，最终返回的promise也会resolve，而不是reject。

因此，实现的思路应该是：创建一个新的Promise，为每个输入的promise添加then和catch处理，当任何一个promise settle时（无论是resolve还是reject），立即调用新Promise的resolve方法，并传入该结果。同时，需要确保只处理第一个settle的promise，忽略后续的。

具体步骤：

验证输入是否为数组，且数组中的元素是否为promise。
创建一个新的Promise对象。
遍历输入的promise数组，为每个promise添加then和catch。
在then和catch中，一旦有任何一个promise settle，就调用resolve，并标记已处理，忽略后续的promise。
需要注意的是，要防止多次调用resolve，所以需要一个标志来判断是否已经处理过第一个结果。

现在，我需要考虑用户可能希望将这个函数放在哪个文件中。根据之前的文件结构，用户之前在test.js中实现了myCall和myBind，可能继续在该文件中添加新函数。但当前用户打开的是scene.md，可能需要确认文件路径。不过根据mentions，用户提到的scene.md中的问题，可能希望将实现代码放在test.js中，或者另一个新文件。但根据现有信息，test.js是手写代码的文件，所以可能继续在test.js中添加。

不过，用户当前的current_file是scene.md，但该文件是markdown文件，不适合放代码。因此，正确的做法应该是在test.js中实现这个函数。因此，我需要生成代码，并指定路径为test.js。

接下来，编写代码实现：

function firstSettled(promises) { return new Promise((resolve) => { if (!Array.isArray(promises)) { return resolve(new TypeError('参数必须是数组')); } let settled = false; promises.forEach(p => { Promise.resolve(p).then( result => { if (!settled) { settled = true; resolve({ status: 'fulfilled', value: result }); } }, reason => { if (!settled) { settled = true; resolve({ status: 'rejected', reason: reason }); } } ); }); }); }

这个函数接收一个promises数组，返回一个新的promise。对于每个promise，使用Promise.resolve包装以确保其为promise。然后，无论是resolve还是reject，都会调用resolve，并传入包含状态和结果的对象。使用settled标志确保只处理第一个结果。

现在需要检查是否有必要调用工具，比如查看test.js文件的内容，确认是否有合适的位置添加这个函数。根据之前的test.js内容，用户在其中实现了myCall和myBind，可能在文件末尾添加新函数。因此，不需要调用工具查看文件，可以直接生成代码。

最后，按照要求的格式，使用response_to_user工具，将代码块放在test.js中，并提供解释。需要确保代码格式正确，使用正确的文件路径，并遵循所有的格式约束，比如使用// ... existing code ...占位符，但根据用户之前的test.js内容，可能需要在现有代码之后添加，所以假设在myBind之后添加新函数。

因此，最终的响应应该包括函数的实现代码，并解释其功能和使用场景，以及与Promise.race的区别。

实现 "优先返回第一个settle结果" 的Promise函数
根据需求，我们需要实现一个函数，它接收多个Promise，只要有一个Promise resolve或reject，整体就立即resolve并返回该结果。这与Promise.race的区别在于：即使第一个结果是reject，我们也会将其作为resolve结果返回。

实现代码

/d:/person-project/youmengyin/docs/interview/handwriting/test.js
Apply
// ... existing code ...

/**

* 接收多个Promise，当任一Promise settle时（无论resolve或reject）立即resolve
* @param {Promise[]} promises - Promise数组
* @returns {Promise} 包含第一个settle结果的Promise，始终resolve
 */
function promiseFirstSettled(promises) {
  // 验证输入是否为数组
  if (!Array.isArray(promises)) {
    return Promise.resolve(new TypeError('参数必须是Promise数组'));
  }

  return new Promise((resolve) => {
    let isSettled = false;

    promises.forEach(p => {
      // 确保处理的是Promise对象
      Promise.resolve(p).then(
        // 处理resolve情况
        result => {
          if (!isSettled) {
            isSettled = true;
            resolve({
              status: 'fulfilled',
              value: result
            });
          }
        },
        // 处理reject情况（也作为resolve返回）
        reason => {
          if (!isSettled) {
            isSettled = true;
            resolve({
              status: 'rejected',
              reason: reason
            });
          }
        }
      );
    });
  });
}

```
实现要点
输入验证：检查参数是否为数组，非数组时返回包含TypeError的已resolve Promise
Promise规范化：使用Promise.resolve(p)确保处理的是Promise对象（即使输入不是Promise）
状态控制：通过isSettled标志防止多次调用resolve
结果封装：统一返回格式{ status, value/reason }，便于区分原Promise是resolve还是reject
错误处理：将reject结果也作为resolve返回，符合"只要有一个settle就整体resolve"的需求

```javascript
// 测试用例
const p1 = new Promise(resolve => setTimeout(() => resolve('成功结果'), 100));
const p2 = new Promise((_, reject) => setTimeout(() => reject('错误结果'), 50));
const p3 = new Promise(resolve => setTimeout(() => resolve('迟到的结果'), 150));

promiseFirstSettled([p1, p2, p3]).then(result => {
  console.log(result); // { status: 'rejected', reason: '错误结果' }
});
```

应用场景
超时控制：同时发起请求和超时Promise，确保即使超时也能正常处理
备选方案：同时尝试多个API，使用第一个响应的结果（无论成功失败）
资源竞争：多个资源加载渠道，取第一个可用资源
容错处理：需要知道哪个操作先失败的场景
这个实现相比原生API提供了更灵活的错误处理策略，适合需要优先获取第一个结果（无论成败）的业务场景。

## 2.如果本地存储的草稿>5M了，有什么其他方案能够解决

一、存储方案升级

1. IndexedDB（推荐）
2. File System API
3. 服务端存储+本地缓存
  无容量限制
  支持多设备同步
  可实现自动备份 实现策略：
  使用localStorage存储草稿ID和基本信息
  结合Service Worker实现离线访问
  采用增量同步减少流量消耗

二、数据优化策略

1. 数据压缩 使用pako.js进行gzip压缩、只存储差异内容
2. 分块存储 将大型草稿分割为多个5M以下的块
3. 过期清理机制
  LRU算法：删除最久未访问的草稿
  容量阈值触发：当总容量接近限制时自动清理
  时间戳过期：自动删除超过30天的草稿

## 3. Promise

```javascript
    Promise.resolve().then(() => {
      console.log(0);
      return Promise.resolve(4);
    }).then((res) => {
      console.log(res);
    });

    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    }).then(() => {
      console.log(3);
    }).then(() => {
      console.log(5);
    }).then(() => {
      console.log(6);
    })

    Promise.resolve().then(() => {
      console.log(0);
      return 4;
    }).then((res) => {
      console.log(res);
    });

    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    }).then(() => {
      console.log(3);
    }).then(() => {
      console.log(5);
    }).then(() => {
      console.log(6);
    })


```

[让人头秃的promise-then执行顺序问题](https://juejin.cn/post/7109088946889424932)
[深度揭秘 Promise 微任务注册和执行过程](https://juejin.cn/post/6844903987183894535)
[Promise 实现细节](!https://juejin.cn/post/6953452438300917790)
