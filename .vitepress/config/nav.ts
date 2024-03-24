import { DefaultTheme } from 'vitepress'

const GoLang = [
  { text: '介绍', link: '/docs/go/index' },
  { text: '安装环境', link: '/docs/go/install' },
  { text: '变量声明', link: '/docs/go/variable' },
  { text: '数组使用', link: '/docs/go/array' },
  { text: '切片', link: '/docs/go/slice' },
  { text: '结构体', link: '/docs/go/struct' },
  { text: '位运算', link: '/docs/go/bitwise' },
  { text: '集合', link: '/docs/go/map' },
  { text: '循环', link: '/docs/go/cycle' },
  { text: '函数', link: '/docs/go/function' },
  { text: '通道', link: '/docs/go/chan' },
  { text: 'orm', link: '/docs/go/xorm' },
  { text: 'rpc', link: '/docs/go/rpc' },
  { text: '断言和反射', link: '/docs/go/assertionOrReflect' },
  { text: 'sync包', link: '/docs/go/sync' },
]
const NetWork = [{ text: 'Charles抓包', link: '/docs/network/charles' }]
const ToolsChain = [
  { text: 'git', link: '/docs/tools-chain/git' },
  { text: 'prettier', link: '/docs/tools-chain/prettier' },
  { text: 'pnpm', link: '/docs/tools-chain/pnpm' },
]
const Develops = [
  { text: 'index', link: '/docs/devops/index' },
  { text: 'package_tools', link: '/docs/devops/package_tools' },
  { text: 'docker', link: '/docs/devops/docker' },
  { text: 'jenkins', link: '/docs/devops/jenkins' },
  { text: 'linux', link: '/docs/devops/linux' },
  { text: 'mysql', link: '/docs/devops/mysql' },
  { text: 'redis', link: '/docs/devops/redis' },
]
const Linux = [
  { text: 'index', link: '/docs/linux/index' },
]
// 导航栏配置
export default [
  {
    text: '文章记录',
    activeMatch: '/article/',
    link: '/article/milepost/milepost-2023',
  },
  {
    text: '文档',
    activeMatch: '/docs/',
    link: '/docs/javascript/basic',
  },
  {
    text: '资源',
    link: '/docs/resource/FavoriteFromBrowser',
    activeMatch: '/resource/',
  },
  {
    text: 'Go语言',
    items: GoLang,
  },
  {
    text: '网络相关',
    items: NetWork,
  },
  {
    text: '工具链',
    items: ToolsChain,
  },
  {
    text: '开发',
    items: Develops,
  },
  {
    text: 'Linux',
    items: Linux,
  }
] as DefaultTheme.NavItem[]
