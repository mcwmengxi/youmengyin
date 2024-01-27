import { DefaultTheme } from 'vitepress'
import glob from 'fast-glob'

function getSidebarsItems(path: string, rootPath: string = 'docs') {
  const links: DefaultTheme.SidebarItem[] = []
  glob.sync(`${rootPath}/${path}/*`, {
    // onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name, path: url }) => {
    if (/.md$/g.test(name)) {
      links.push({
        text: name.replace('.md', ''),
        link: `/${url.replace('.md', '')}`,
      })
    }
  })
  return links
}

const Go = [
  { text: '介绍', link: '/go/index' },
  { text: '安装', link: '/go/install' },
  { text: '变量声明', link: '/go/variable' },
  { text: '数组使用', link: '/go/array' },
  { text: '切片', link: '/go/slice' },
  { text: '结构体', link: '/go/struct' },
  { text: '位运算', link: '/go/bitwise' },
  { text: '集合', link: '/go/map' },
  { text: '循环', link: '/go/cycle' },
  { text: '函数', link: '/go/function' },
  { text: '通道', link: '/go/chan' },
  { text: 'orm', link: '/go/xorm' },
  { text: 'rpc', link: '/go/rpc' },
  { text: '断言和反射', link: '/go/assertionOrReflect' },
  { text: 'sync包', link: '/go/sync' },
]
const NetWork = [{ text: 'Charles抓包', link: '/docs/network/charles' }]
const ToolsChain = getSidebarsItems('tools-chain')
const VueArti = getSidebarsItems('vue')
console.log(ToolsChain)

const sidebars = [{ text: 'go', items: Go, collapsible: true, collapsed: true }]

const article = [
  {
    text: '里程碑',
    items: [{ text: '里程碑 2023', link: '/article/milepost/milepost-2023' }],
  },
  // {
  //   text: '年度总结',
  //   items: [{ text: '2023 年度总结', link: '/article/annual-summary/2023' }],
  // },
  {
    text: '我的文章',
    items: [
      { text: '记事本', link: '/article/article/article-0' },
      { text: '别再写循环套循环了', link: '/article/article/article-1' },
      { text: 'GitHubPages 部署项目', link: '/article/article/article-2' },
      { text: 'highlightjs 使用方法', link: '/article/article/article-3' },
      {
        text: 'Vue3 + pnpm 搭建 monorepo 项目',
        link: '/article/article/article-4',
      },
    ],
  },
  {
    text: 'JavaScript 设计模式',
    items: [
      { text: '基础知识', link: '/article/design-mode/design-1' },
      { text: '高阶函数', link: '/article/design-mode/design-2' },
      { text: '单例模式', link: '/article/design-mode/design-3' },
      { text: '策略模式', link: '/article/design-mode/design-4' },
      { text: '代理模式', link: '/article/design-mode/design-5' },
      { text: '迭代器模式', link: '/article/design-mode/design-6' },
      { text: '发布订阅模式', link: '/article/design-mode/design-7' },
      { text: '命令模式', link: '/article/design-mode/design-8' },
      { text: '组合模式', link: '/article/design-mode/design-9' },
      { text: '模板方法模式', link: '/article/design-mode/design-10' },
      { text: '享元模式', link: '/article/design-mode/design-11' },
      { text: '职责链模式', link: '/article/design-mode/design-12' },
      { text: '状态模式', link: '/article/design-mode/design-13' },
      { text: '适配器模式', link: '/article/design-mode/design-14' },
    ],
  },
  {
    text: 'Vue.js 设计与实现',
    items: [
      { text: '第一章 权衡的艺术', link: '/article/vue-design/page-1' },
      {
        text: '第二章 框架设计的核心要素',
        link: '/article/vue-design/page-2',
      },
      {
        text: '第三章 Vue.js 3 的设计思路',
        link: '/article/vue-design/page-3',
      },
      {
        text: '第四章 响应系统的作用与实现',
        link: '/article/vue-design/page-4',
      },
    ],
  },
  {
    text: '前端面试题',
    items: [
      { text: '更新面试题', link: '/article/ques/ques-new' },
      { text: 'Web 相关', link: '/article/ques/ques-web' },
      { text: 'Html 相关', link: '/article/ques/ques-html' },
      { text: 'Css 相关', link: '/article/ques/ques-css' },
      { text: 'JavaScript 相关', link: '/article/ques/ques-javascript' },
      { text: 'Vue2 相关', link: '/article/ques/ques-vue2' },
    ],
  },
]
const develops = [
  { text: 'index', link: '/docs/devops/index' },
  { text: 'package_tools', link: '/docs/devops/package_tools' },
  { text: 'docker', link: '/docs/devops/docker' },
  { text: 'jenkins', link: '/docs/devops/jenkins' },
  { text: 'linux', link: '/docs/devops/linux' },
  { text: 'mysql', link: '/docs/devops/mysql' },
  { text: 'redis', link: '/docs/devops/redis' },
]
const docs = [
  {
    text: 'JavaScript',
    items: [
      { text: '基础', link: '/docs/javascript/basic' },
      { text: 'DOM 相关', link: '/docs/javascript/dom' },
      { text: '函数', link: '/docs/javascript/function' },
      { text: '数据类型', link: '/docs/javascript/data-type' },
      { text: '字符串方法', link: '/docs/javascript/methods-string' },
      { text: '数组方法', link: '/docs/javascript/methods-array' },
      { text: '数组迭代', link: '/docs/javascript/array-iteration' },
      { text: '对象方法', link: '/docs/javascript/methods-object' },
      { text: '日期对象', link: '/docs/javascript/date-object' },
      { text: '数学对象', link: '/docs/javascript/math-object' },
      { text: '异步函数', link: '/docs/javascript/fun-async' },
      { text: '面向对象编程', link: '/docs/javascript/fun-prototype' },
      { text: 'Class 类的使用', link: '/docs/javascript/fun-class' },
      { text: 'JavaScript API', link: '/docs/javascript/javascript-api' },
      { text: '生成器', link: '/docs/javascript/generator' },
      { text: 'proxy 代理', link: '/docs/javascript/proxy' },
      { text: '事件循环', link: '/docs/javascript/event-loop' },
    ],
  },
  {
    text: 'Vue',
    items: VueArti,
  },
  {
    text: 'TypeScript',
    items: [
      { text: '基础', link: '/docs/typescript/index' },
      { text: '类型', link: '/docs/typescript/type' },
      { text: '其它', link: '/docs/typescript/other' },
    ],
  },
  { text: '开发',items: develops }
]
export default {
  '/article/': article,
  '/docs/': docs,
  '/go/': sidebars,
  '/tools-chain/': [
    {
      text: '工具链',
      link: '/tools-chain/',
      items: ToolsChain,
    },
  ],
  '/resource/': [
    {
      text: '资源分享',
      link: '/docs/resource/FavoriteFromBrowser',
      items: [
        {
          text: '浏览器收藏夹公开',
          link: '/docs/resource/FavoriteFromBrowser',
        },
        {
          text: '编程实用工具',
          link: '/docs/resource/ProgrammingUtilitySharing',
        },
        { text: '编程实用工具', link: '/docs/resource/Vue3UtilitySharing' },
      ],
    },
  ],
}
