const GoLang = [
    { text: '介绍', link: '/go/index', },
    { text: '安装环境', link: '/go/install', },
    { text: '变量声明', link: '/go/variable', },
    { text: '数组使用', link: '/go/array', }
]
const NetWork = [
    { text: 'Charles抓包', link: '/network/charles', }
]
// 导航栏配置
export default [
    { text: '指南', link: '/guide/install', activeMatch: '^/guide/' },
    { text: '组件', link: '/component/button', activeMatch: '^/component/' },
    {
      text: '资源', link: '/resource/', activeMatch: '',
    },
    { 
        text: '组件库',
        items: [
            { text: 'Ant Design-Vue', link: 'https://www.antdv.com/docs/vue/getting-started-cn/' },
            { text: 'Element Plus', link: 'https://element-plus.gitee.io/zh-CN/' }
        ]
    },
    {   
        text: 'Go语言',
        items: GoLang
    },
    {
        text: '网络相关',
        items: NetWork
    }
]

