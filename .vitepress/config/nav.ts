import { DefaultTheme } from 'vitepress'

// 导航栏配置
export default [
  {
    text: '日常记录',
    items: [
      {
        text: '踩坑记录',
        link: '/article/pit/npm',
        activeMatch: '^/article/pit',
      },
      {
        text: '🏆文章记录',
        activeMatch: '^/article/milepost',
        link: '/article/milepost/milepost-2023',
      },
    ],
  },
  { text: '导航网站', link: '/docs/nav/', activeMatch: '^/docs/nav/' },
  {
    text: '📚 学习笔记',
    items: [
      { text: '📋 开发', link: '/docs/devops/index' },
      { text: '🔧 工具链', link: '/docs/tools-chain/' },
    ],
  },
  {
    text: '📋 前端物语',
    items: [
      {
        text: '📋前端基础',
        link: '/docs/front-end/index',
      },
      {
        text: '📋React',
        link: '/docs/front-end/react/basic/introduce',
      },
      {
        text: '📋Flutter ',
        link: '/docs/flutter/index',
      },
      {
        text: '📋Electron',
        link: '/docs/electron/index',
      },
      {
        text: '📋Android',
        link: '/docs/android/index',
      },
      {
        text: '📋typescript',
        link: '/docs/front-end/typescript/index',
      },
      {
        text: '📋threejs',
        link: '/docs/threejs/index',
      },
      {
        text: '📋Nestjs',
        link: '/docs/nestjs/index',
      },
      {
        text: '📋 AI',
        link: '/docs/ai/index',
      },
    ],
  },
  {
    text: '💻后端',
    items: [
      { text: '⭐ GoLang基础', link: '/docs/backend/go/index' },
      {
        text: '📃 Python基础',
        link: '/views/after-end/python/PandasCodeSnippet',
      },
      { text: '📃 Java基础', link: '/views/after-end/java/basic/extend' },
      { text: '📃SQL常用语句', link: '/views/sql/common-sql' },
      { text: '📃 正则基础', link: '/views/regexp/reg01' },
      {
        text: '📃 构建工具',
        link: '/views/after-end/build-tools/gradle-basic',
      },
    ],
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
  {
    text: '⚡提效工具',
    items: [
      {
        text: '🔧 软件资源与配置',
        items: [
          { text: 'Windows 平台', link: '/docs/resource/software/windows' },
          { text: '浏览器设置与扩展', link: '/docs/resource/software/browser' },
          {
            text: 'Visual Studio Code 配置',
            link: '/docs/resource/software/vscode',
          },
        ],
      },
      { text: '📚 资源导航', link: '/docs/resource/index' },
      { text: '🌐 在线工具', link: '/docs/resource/online-tools' },
      // { text: '🔖 书签脚本', link: '/docs/resource/bookmark-scripts' },
    ],
    activeMatch: '^/docs/resource',
  },
] as DefaultTheme.Config['nav']
