export default function sidebarInterview() {
  return [
    {
      text: '前端面试题',
      items: [
        { text: 'index', link: '/docs/interview/index' },
        { text: 'javascript', link: '/docs/interview/javascript' },
        { text: 'Vue', link: '/docs/interview/vue' },
        {
          text: 'CSS面试题',
          link: '/docs/interview/css'
        },
        {
          text: 'DOM面试题',
          link: '/docs/interview/dom'
        },
        {
          text: 'JS面试题',
          items: [
            {
              text: '基础语法篇',
              link: '/docs/interview/js/js_basic'
            },
            {
              text: '对象',
              link: '/docs/interview/js/js_object'
            },
            {
              text: '函数',
              link: '/docs/interview/js/function'
            },
            {
              text: 'Promise',
              link: '/docs/interview/js/promise'
            },
            {
              text: 'es6+',
              link: '/docs/interview/js/es6'
            },
            {
              text: '其它',
              link: '/docs/interview/js/js'
            },
          ]
        },
        
        {
          text: '框架',
          items: [
            {
              text: 'Vue面试题',
              link: '/docs/interview/vue'
            },
          ]
        },
        {
          text: '打包工具',
          items: [
            {
              text: 'Webpack面试题',
              link: '/docs/interview/webpack'
            },
          ]
        },
        {
          text: '大厂相关题库',
          link: '/docs/interview/LargeCompanyQuestionBank'
        },
        { text: '更新面试题', link: '/docs/interview/ques/ques-new' },
        { text: 'Web 相关', link: '/docs/interview/ques/ques-web' },
        { text: 'Html 相关', link: '/docs/interview/ques/ques-html' },
        { text: 'Css 相关', link: '/docs/interview/ques/ques-css' },
        { text: 'JavaScript 相关', link: '/docs/interview/ques/ques-javascript' },
        { text: 'Vue2 相关', link: '/docs/interview/ques/ques-vue2' },
      ]
    },
    {
      text: '后端面试',
      items: []
    },
    {
      text: '操作系统/网络/浏览器',
      collapsed: false,
      items: [
        { text: '网络-TCP', link: '/docs/interview/net/tcp/' },
        { text: '网络-HTTP', link: '/docs/interview/net/http/' },
        { text: '网络-Websocket', link: '/docs/interview/net/websocket/' },
        { text: '网络-跨域问题', link: '/docs/interview/net/cors/' },
      ]
    },
  ]
}