import { DefaultTheme } from 'vitepress'
import { sync } from 'fast-glob'

function getSidebarsItems(path: string) {
  const links: DefaultTheme.SidebarItem[] = [];
  sync(`docs/${path}/*`, {
    // onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name,path : url }) => {
    url = url.replace('docs/', '')
    // console.log(url);
    
    if (/.md$/g.test(name)) {
      links.push({
        text: name.replace('.md', ''),
        link: `/${url.replace('.md', '')}`,
      });
    }
  });
  return links;
}

const Go = [
  { text: '介绍', link: '/go/index'},
  { text: '安装', link: '/go/install'},
  { text: '变量声明', link: '/go/variable'},
  { text: '数组使用', link: '/go/array', },
  { text: '切片', link: '/go/slice', },
  { text: '结构体', link: '/go/struct', },
  { text: '位运算', link: '/go/bitwise', },
  { text: '集合', link: '/go/map', },
  { text: '循环', link: '/go/cycle', },
  { text: '函数', link: '/go/function', },
  { text: '通道', link: '/go/chan', },
  { text: 'orm', link: '/go/xorm', }
]
const NetWork = [
  { text: 'Charles抓包', link: '/network/charles' }
]
// const ToolsChain = [
//   // { text: '工具链', item: getSidebarsItems('tools-chain') },
//   { text: 'git', link: '/tools-chain/git'},
//   { text: 'prettier', link: '/tools-chain/prettier'},
//   { text: 'github-ci', link: '/tools-chain/github-ci'}
// ]
const ToolsChain = getSidebarsItems('tools-chain')
const Guide = [
  {
    text: '指南',
    link: '/guide/install',
    items: [
      { text: '安装', link: '/guide/install' },
      { text: '快速开始', link: '/guide/import' }
    ]
  }
]
const sidebars = [
  { text: 'go', items: Go, collapsible: true, collapsed :true},
  // { text: 'Guide', items: Guide },
  // { text: '网络相关', item: NetWork },
  // // { text: '工具链', item: ToolsChain }
  // { text: '工具链', item: getSidebarsItems('tools-chain') }
]
export default {
  '/guide/' : Guide,
  '/component/': [
    {
      text: '基础组件',
      link: '/component/',
      items: [
        { text: 'Button 按钮', link: '/component/button' },
        { text: 'Icon 图标', link: '/component/icon' },
        { text: 'Link 链接', link: '/component/link' },
        { text: 'Text 文字', link: '/component/text' },
        { text: 'Container 布局容器', link: '/component/container' }
      ]
    },
    {
      text: 'Form 表单组件',
      link: '/component/',
      items: [
        { text: 'Form 表单组件', link: '/component/form' }
      ]
    }
  ],
  '/go/': sidebars,
  '/tools-chain/': [{
    text: '工具链',
    link: '/tools-chain/',
    items: ToolsChain
  }
  ],
  '/resource/': [
    {
      text: '资源分享',
      link: '/resource/FavoriteFromBrowser',
      items: [
        { text: '浏览器收藏夹公开', link: '/resource/FavoriteFromBrowser' },
        { text: '编程实用工具', link: '/resource/ProgrammingUtilitySharing' },
        { text: '编程实用工具', link: '/resource/Vue3UtilitySharing' }
      ]
    }
  ]
}