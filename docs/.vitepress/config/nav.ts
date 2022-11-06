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
    }    
]