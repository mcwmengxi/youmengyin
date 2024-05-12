import { DefaultTheme } from 'vitepress'

// 导航栏配置
export default [
  {
    text: '🏆文章记录',
    activeMatch: '/article/',
    link: '/article/milepost/milepost-2023',
  },
  {
    text: '📚 学习笔记',
    items: [
      { text: '📋 开发', link: '/docs/devops/index' },
      { text: '🔧 工具链', link: '/docs/tools-chain/' },
      { text: '⭐资源导航', link: '/docs/resource/',},
    ],
  },
  {
    text: '📋 前端',
    items: [
      {
        text: '📋前端基础',
        link: '/docs/front-end/index',
      },
      {
        text: '📋Flutter ',
        link: '/docs/flutter/index',
      }
    ]
  },
  {
    text: '💻后端',
    items: [
      { text: '⭐ GoLang基础', link: '/docs/go/index' },
      {
        text: '📃 Python基础',
        link: '/views/after-end/python/PandasCodeSnippet'
      },
      { text: '📃 Java基础', link: '/views/after-end/java/basic/extend' },
      { text: '📃SQL常用语句', link: '/views/sql/common-sql' },
      { text: '📃 正则基础', link: '/views/regexp/reg01' }
    ]
  },
  {
    text: '🔥 专栏',
    items: [
      { text: '🔥 前端算法', link: '/docs/algorithm/guide/' },
      { text: '🔥 设计模式', link: '/docs/patterns/guide/' },
      { text: '📋 面试大全', link: '/docs/interview/' },
      { text: '🔥 vue源码实现', link: '/article/vue-design/page-1' },
    ],
  },
] as DefaultTheme.NavItem[]
