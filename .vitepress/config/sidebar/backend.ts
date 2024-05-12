const Go = [
  { text: '介绍', link: '/docs/go/index' },
  { text: '安装', link: '/docs/go/install' },
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

function sidebarGo(){
  return[{ text: 'Go', items: Go, collapsible: true, collapsed: true }]
}

function sidebarSql(){
  return [
    {
      text: 'sql简介',
      items: [
        {
          text: '常用SQL',
          link: '/views/sql/common-sql'
        },
        {
          text: 'SQL面试题',
          link: '/views/sql/sql-interview'
        },
        {
          text: '实际遇到的问题',
          link: '/views/sql/work'
        }
      ]
    },
  ]
}

function sidebarReg(){
  return [
    {
      text: '正则',
      items: [
        {
          text: '正则基础入门',
          link: '/views/regexp/reg01'
        },
      ]
    },
  ]
}

function sidebarOtherBe() {
  return [
    {
      text: 'Python',
      items: [
        {
          text: 'Python基础',
          link: '/views/after-end/python/PythonBasic'
        },
        {
          text: 'Pandas代码片段',
          link: '/views/after-end/python/PandasCodeSnippet'
        }
      ]
    },
    {
      text: 'Java',
      items: [
        {
          text: 'Java基础',
          items: [
            {
              text: '继承',
              link: '/views/after-end/java/basic/extend'
            }
          ]
        },
      ]
    },
  ]
}

export { sidebarGo, sidebarOtherBe, sidebarSql, sidebarReg }