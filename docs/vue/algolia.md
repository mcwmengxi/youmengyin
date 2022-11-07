## algolia配置站内搜索：vitepress配置

- 官网![](https://www.algolia.com/users/sign_up)使用github账号注册algolia 
- 创建index

![](https://img-blog.csdnimg.cn/bdf54af6007046b39a2b6df799140a74.png)

- 到setting中查看api keys

![](https://img-blog.csdnimg.cn/006cd3c2129b4212875acfe1f262a0a6.png)

- 配置vitepress algolia

```js
themeConfig: {
  // 配置页脚
  footer,
  algolia: {
    appId: 'QM8Y7EPOUO',
    apiKey: 'dca4c36e01076d19747ee4b7a678ecef',
    indexName: 'youmengyin',
    searchParameters: {
      facetFilters: ['language:cn']
    }
  },
}
```