import { getSidebarsItems } from "../sidebar"

const Go = [
  { text: '介绍', link: '/docs/backend/go/index' },
  { text: '安装', link: '/docs/backend/go/install' },
  { text: '变量声明', link: '/docs/backend/go/variable' },
  { text: '数组使用', link: '/docs/backend/go/array' },
  { text: '切片', link: '/docs/backend/go/slice' },
  { text: '结构体', link: '/docs/backend/go/struct' },
  { text: '位运算', link: '/docs/backend/go/bitwise' },
  { text: '集合', link: '/docs/backend/go/map' },
  { text: '循环', link: '/docs/backend/go/cycle' },
  { text: '函数', link: '/docs/backend/go/function' },
  { text: '通道', link: '/docs/backend/go/chan' },
  { text: 'orm', link: '/docs/backend/go/xorm' },
  { text: 'rpc', link: '/docs/backend/go/rpc' },
  { text: '断言和反射', link: '/docs/backend/go/assertionOrReflect' },
  { text: 'sync包', link: '/docs/backend/go/sync' },
  { text: '学习资料', link: 'docs/backend/go/bytedance'}
]

const Kratos = getSidebarsItems('/backend/micro-service/kratos')

function sidebarGo(){
  return [
    { text: 'Go', items: Go, collapsible: true, collapsed: true },
    { text: '微服务框架Kratos', items: Kratos, collapsible: true, collapsed: true },
  ]
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
    {
      text: '构建工具',
      items: [
        {
          text: 'Gradle',
          items: [
            {
              text: 'Gradle基础',
              link: '/views/after-end/build-tools/gradle-basic'
            }
          ]
        },
      ]
    },
  ]
}

export { sidebarGo, sidebarOtherBe, sidebarSql, sidebarReg }