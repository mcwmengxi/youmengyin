
export function sidebarTypescript() {
  return [
    {
      text: '介绍',
      link: '/docs/front-end/typescript/index'
    },
    {
      text: '基础入门',
      link: '/docs/front-end/typescript/base'
    },
    { text: '基础', collapsed: true, items: new Array(10).fill({}).map((item, idx) => ({ text: `基础-${idx+1}`, link: `/docs/front-end/typescript/base/base-${idx+1}` })) },
    { text: 'ts基础', link: '/docs/front-end/typescript/basic' },
    { text: '类型', link: '/docs/front-end/typescript/type' },
    { text: '其它', link: '/docs/front-end/typescript/other' },
    { text: 'TS最佳实践', link: '/docs/front-end/typescript/ts-best-practice' },
    { text: '装饰器', link: '/docs/front-end/typescript/decorator' },

  ]
}
