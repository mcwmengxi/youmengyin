# 里程碑 2023

## 2023-03-04

1. [公众号数组方法](https://mp.weixin.qq.com/s/sYeL4qUSxqGE9VJMVz7uPw)
2. [路由丝滑切换](https://github.com/zeroojs/zeroojs-todolist)
3. [意派](https://www.epub360.com) 这个网站可以看一下
4. [码市](https://codemart.com) 这个网站可以看一下
5. [axios 工具函数的源码](https://github.com/axios/axios/blob/master/lib/utils.js)

面试题
1. [如何中断已发出去的请求？](https://mp.weixin.qq.com/s/HO_CYsH5DGKLcJWVEhEfxA)
2. window.localStorage 怎么设置过期时间？
3. 反转二叉树是什么？
4. 最长递增子序列是什么？
5. 动态规划是什么？
6. 设计模式是什么？

**两篇不错的 monorepo 文章，记录一下**

- [基于 pnpm 的 monorepo 包管理实践](https://forum.juejin.cn/youthcamp/post/7053268185532858376?from=4)
- [monorepo 发包实践](https://forum.juejin.cn/youthcamp/post/7057431469622296583?from=4)

**还有一些需要研究的**

- [fiber](https://github.com/gofiber/fiber) 了解一下。是用 Go 编写的受 Express 启发的 web 框架
- 重绘和回流是什么？
- 位运算
- vue 自定义指令
- mvc mvvm
- 序列化和反序列化

**需要学习的**

- TypeScript
- 算法，有一本书叫 `《学习JavaScript 数据结构与算法 第三版》` 可以先看一下

## 2023-03-08

>小程序长列表优化实践
https://cloud.tencent.com/developer/article/1842225?from=article.detail.1782749&areaSource=106000.11&traceId=Y8p3eHg8h-IUMSs8Nrbvz


https://cloud.tencent.com/developer/article/2091421?from=article.detail.1842225&areaSource=106000.1&traceId=mdkXjZiu6L6xcnnzGhpbP

https://cloud.tencent.com/developer/article/1586645?from=article.detail.2091421&areaSource=106000.14&traceId=9JgEVeZkoWiROI62LsCOB

## 2023-03-19

查询本次安装的版本
rpm -qa|grep redis
查询安装位置
rpm -ql redis-5.0.3-5.module_el8.4.0+955+7126e393.x86_64开启Redis Server
cd /usr/bin
redis-server

①通过指令找到redis进程，查看所有关于它的进程详情。
ps -ef | grep redis

root      3086     1  0 Apr24 ?        00:00:07 ./bin/redis-server *:6379        
root      3531  3467  0 01:00 pts/0    00:00:00 grep -i redis 
如上图：进程号为 3086 即为redis服务器

②使用kill杀死该进程
kill -9 3086 

③输入重启指令即可
./redis-server

a、打开Redis配置文件Redis.conf
cd /etc
vim redis.conf
按下键盘i进入编辑模式

找到如下参数，并修改：

针对问题①的修改：
bind 127.0.0.1  	 //行数：69   =》修改为#bind 127.0.0.1 
protected-mode yes      //行数：89  =》修改为protected-mode no
daemonize yes 	        //行数：137  =》修改为daemonize no //设置为no则不作为后台运行，否则后台运行
针对问题②的修改：
b、保存配置文件并退出
按下键盘esc退出编辑模式，然后按shift + : 键，再录入wq,回车即可。

c、重新启动Redis Server
redis-server /etc/redis.conf
此处进行Redis服务器启动并指定配置文件，以应用我们改的配置。

注：如果上面设置daemonize参数
为no时，回车后，效果如下：（为空白，实则已经非后台执行，当前控制台已被占用）
为yes时：回车后，效果如下：（后台执行，可继续操作）

2、连接
以Windows 10 为例，连接方式如下：
D:\WorkSpace\Redis\redis-cli -h x.x.x.x -p 6379 -a code6076..
3、设置开机自启
启动服务

systemctl start redis
如果开启服务出现任何输出，则需要根据提示，根据日志进行配置，我就遇到了redis日志权限不足。有类似情况使用如下命令： chown redis:redis /var/log/redis/redis.log
报错如下图：

设置自启
systemctl enable redis
然后重启服务器
reboot
重启完成后，查看状态：
systemctl stutas redis
## 2023-04-18
docker-desktop换源
```
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  }
}
```

```
{
  "registry-mirrors": [
    "https://20jyns64.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com"
  ],
  "insecure-registries": [],
  "debug": true,
  "experimental": false
}
```
## 2023-08-07

`vue-router 4.1.4+` 不再支持params隐式传参, 该传参方式之前一直是不推荐的，因为一旦刷新页面参数就获取不到了。

**官方根据不同场景推荐了四种解决方案**

1. 用pinia替代
2. 与已有的params和query合并
3. 使用state
4. 使用meta
[详情查看：官方更新日志](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22)

## 2023-08-09

Go 中 main 包默认不会加载其他文件， 而其他包都是默认加载的。 `go run number.go byte.go`

`go run *.go`

## 2023-08-10

ref 数组并不保证与源数组相同的顺序
```bash
// template
<ComposeOrderItem
  v-for="(item, idx) in purOrderList"
  :key="item.uuid + '__' + idx"
  :ref="(el) => composeOrderItem(el, item.uuid)"
  v-model="purOrderList[idx]"
  :index="idx"
  @select-supplier="(val) => selectSupplier(val, idx)"
  @del="delComposeOrderItem"
></ComposeOrderItem>

// const composeOrderItemRefs = ref<Recordable>([]);
// const composeOrderItem = (el: any, id: number) => {
//   if (el) {
//     composeOrderItemRefs.value.push({
//       id,
//       el,
//     });
//   }
// };
```
## 2023-11-29

npm run build / start 报错 Error:error:0308010C:digital enveloperoutines::unsupported

**原因**
node17以上会存在这个问题： github.com/nodejs/node…
node17及以后版本中支持 OpenSSL3.0, 而OpenSSL3.0对允许算法和秘钥大小增加了严格的限制，可能会对生态系统造成一些影响。

**解决方法**

配置环境变量 NODE_OPTIONS="--openssl-legacy-provider" ，让 Nodejs 使用旧版本兼容的 OpenSSL[!https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported]

```bash
 "dev": "SET NODE_OPTIONS=--openssl-legacy-provider && cross-env SERVER_ENV=dev vue-cli-service serve"
```

arco 依赖预构建优化
```typescript
import fs from 'fs';
import path from 'path';

const rootPath = path.resolve(__dirname, '../../');
export function optimizeDeps() {
  return {
    name: 'optimizeDeps',
    configResolved: (config: any) => {
      const arr = config.optimizeDeps.include.concat(optimizeArco());
      config.optimizeDeps.include = Array.from(new Set(arr));
    },
  };
}

function optimizeArco(): string[] {
  const includes: string[] = ['@arco-design/web-vue/es'];
  const folders = fs.readdirSync(
    path.resolve(rootPath, './node_modules/@arco-design/web-vue/es')
  );
  // eslint-disable-next-line array-callback-return
  folders.map((name) => {
    const folderName = path.resolve(
      rootPath,
      './node_modules/@arco-design/web-vue/es',
      name
    );
    const stat = fs.lstatSync(folderName);
    if (stat.isDirectory()) {
      const styleFolder = path.resolve(folderName, 'style');
      if (fs.existsSync(styleFolder)) {
        const stat = fs.lstatSync(styleFolder);
        if (stat.isDirectory()) {
          includes.push(`@arco-design/web-vue/es/${name}/style`);
        }
      }
    }
  });

  return includes;
}
export default {};
```

**路由根据网络空闲时间加载**

```typescript
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

// import { useDebounceFn } from '@vueuse/core';
import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration
if (import.meta.env.MODE === 'development') {
  const componentsToLoad = appRoutes.map((item) => item.component);
  const loadComponentsWhenNetworkIdle = useDebounceFn(() => {
    if (componentsToLoad.length > 0) {
      const component = componentsToLoad.pop();
      component?.();
      console.log(
        `剩余${componentsToLoad.length}个路由未加载`,
        componentsToLoad
      );
    }
  });
  const observer: PerformanceObserver = new PerformanceObserver(
    (list: PerformanceObserverEntryList) => {
      const entries: PerformanceEntryList = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === `resource`) {
          // 网络请求结束
          loadComponentsWhenNetworkIdle();
        }
      });
    }
  );
  observer.observe({ entryTypes: ['resource'] });
}
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'goods/index',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
```

**git-cz使用**

```bash 
npm install -g cz-git commitizen
```

```json
// .czrc
{
  "path": "cz-git",
  "$schema": "https://cdn.jsdelivr.net/gh/Zhengqbbb/cz-git@1.7.1/docs/public/schema/cz-git.json",
  "useEmoji": true,
  "types": [
    {
      "value": "feat",
      "name": "feat:     ✨  A new feature",
      "emoji": ":sparkles:"
    },
    {
      "value": "fix",
      "name": "fix:      🐛  A bug fix",
      "emoji": ":bug:"
    },
    {
      "value": "docs",
      "name": "docs:     📝  Documentation only changes",
      "emoji": ":memo:"
    },
    {
      "value": "style",
      "name": "style:    💄  Changes that do not affect the meaning of the code",
      "emoji": ":lipstick:"
    },
    {
      "value": "refactor",
      "name": "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
      "emoji": ":recycle:"
    },
    {
      "value": "perf",
      "name": "perf:     ⚡️  A code change that improves performance",
      "emoji": ":zap:"
    },
    {
      "value": "test",
      "name": "test:     ✅  Adding missing tests or correcting existing tests",
      "emoji": ":white_check_mark:"
    },
    {
      "value": "build",
      "name": "build:    📦️   Changes that affect the build system or external dependencies",
      "emoji": ":package:"
    },
    {
      "value": "ci",
      "name": "ci:       🎡  Changes to our CI configuration files and scripts",
      "emoji": ":ferris_wheel:"
    },
    {
      "value": "chore",
      "name": "chore:    🔨  Other changes that don't modify src or test files",
      "emoji": ":hammer:"
    },
    {
      "value": "revert",
      "name": "revert:   ⏪️  Reverts a previous commit",
      "emoji": ":rewind:"
    }
  ]
}

```
