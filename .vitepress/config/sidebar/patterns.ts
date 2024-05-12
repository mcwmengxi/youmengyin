export default function sidebarPartterns() {
  return [
    {
      text: '📔 前端设计模式',
      collapsed: false,
      items: [
        { text: '导读', link: '/docs/patterns/guide/' },
        { text: '单例模式', link: '/docs/patterns/singleton-pattern/' },
        { text: '代理模式', link: '/docs/patterns/proxy-pattern/' },
        { text: '提供者模式', link: '/docs/patterns/provider-pattern/' },
        { text: '原型模式', link: '/docs/patterns/prototype-pattern/' },
        {
          text: '容器/演示模式',
          link: '/docs/patterns/container-presentational-pattern/',
        },
        { text: '观察者模式', link: '/docs/patterns/observer-pattern/' },
        { text: '模块模式', link: '/docs/patterns/module-pattern/' },
        { text: '混合模式', link: '/docs/patterns/mixin-pattern/' },
        { text: '中介/中间件模式', link: '/docs/patterns/middleware-pattern/' },
        { text: '高阶组件模式', link: '/docs/patterns/hoc-pattern/' },
      ],
    },
    {
      text: 'JavaScript 设计模式',
      collapsed: false,
      items: [
        { text: '基础知识', link: '/docs/patterns/design-mode/design-1' },
        { text: '高阶函数', link: '/docs/patterns/design-mode/design-2' },
        { text: '单例模式', link: '/docs/patterns/design-mode/design-3' },
        { text: '策略模式', link: '/docs/patterns/design-mode/design-4' },
        { text: '代理模式', link: '/docs/patterns/design-mode/design-5' },
        { text: '迭代器模式', link: '/docs/patterns/design-mode/design-6' },
        { text: '发布订阅模式', link: '/docs/patterns/design-mode/design-7' },
        { text: '命令模式', link: '/docs/patterns/design-mode/design-8' },
        { text: '组合模式', link: '/docs/patterns/design-mode/design-9' },
        { text: '模板方法模式', link: '/docs/patterns/design-mode/design-10' },
        { text: '享元模式', link: '/docs/patterns/design-mode/design-11' },
        { text: '职责链模式', link: '/docs/patterns/design-mode/design-12' },
        { text: '状态模式', link: '/docs/patterns/design-mode/design-13' },
        { text: '适配器模式', link: '/docs/patterns/design-mode/design-14' },
      ],
    },
  ]
}