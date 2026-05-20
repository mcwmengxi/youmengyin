import { getSidebarsItems } from '../utils'

export function sidebarFlutter() {
  return [
    {
      text: '📚 Flutter学习笔记',
      items: [
        {
          text: '🏠 首页',
          link: '/docs/flutter/index',
        },
      ],
    },
    {
      text: '🌱 入门篇',
      collapsed: false,
      items: [
        {
          text: '⚙️ 基础配置',
          link: '/docs/flutter/base',
        },
        {
          text: '🎯 Dart 语法速通',
          link: '/docs/flutter/dart',
        },
        {
          text: '🚀 Advanced Dart 高级特性 ⭐',
          link: '/docs/flutter/advanced-dart',
        },
        {
          text: '🚀 入门指南',
          link: '/docs/flutter/getting-started',
        },
        {
          text: '🧩 Widget 基础',
          link: '/docs/flutter/widget-basics',
        },
        {
          text: '📐 布局组件',
          link: '/docs/flutter/layout-widgets',
        },
        {
          text: '🎨 Material Design',
          link: '/docs/flutter/material-design',
        },
      ],
    },
    {
      text: '🔥 进阶篇',
      collapsed: false,
      items: [
        {
          text: '🏗️ 设计原则与模式 ⭐',
          link: '/docs/flutter/design-principles',
        },
        {
          text: '🔄 状态管理',
          link: '/docs/flutter/state-management',
        },
        {
          text: '🔄 Riverpod 状态管理 ⭐',
          link: '/docs/flutter/riverpod/index',
        },
        {
          text: '🗺️ 路由与导航',
          link: '/docs/flutter/routing-navigation',
        },
        {
          text: '🌐 网络请求',
          link: '/docs/flutter/networking',
        },
        {
          text: '📦 JSON 序列化最佳实践 ⭐',
          link: '/docs/flutter/json-serialization',
        },
        {
          text: '💾 数据存储 ⭐',
          link: '/docs/flutter/storage',
          badge: {
            text: '待更新',
            type: 'tip',
          },
        },
        {
          text: '📝 表单处理',
          link: '/docs/flutter/forms',
        },
      ],
    },
    {
      text: '🎯 实战篇',
      collapsed: false,
      items: [
        {
          text: '🎬 动画效果',
          link: '/docs/flutter/animations',
          badge: {
            text: '待更新',
            type: 'tip',
          },
        },
        {
          text: '📱 平台交互',
          link: '/docs/flutter/platform-channels',
        },
        {
          text: '⚡ 性能优化',
          link: '/docs/flutter/performance',
        },
        {
          text: '🔧 Dev Tools 开发工具 ⭐',
          link: '/docs/flutter/dev-tools',
        },
        {
          text: '🧪 测试',
          link: '/docs/flutter/testing',
        },
        {
          text: '🔍 Flutter 内部原理',
          link: '/docs/flutter/internals',
        },
        {
          text: '📦 打包发布',
          link: '/docs/flutter/deployment',
          badge: {
            text: '待更新',
            type: 'tip',
          },
        },
        {
          text: '🔄 CI/CD 持续集成与部署 ⭐',
          link: '/docs/flutter/ci-cd',
        },
        {
          text: '🛍️ 实战项目 - 电商 APP',
          link: '/docs/flutter/practical-project',
          badge: {
            text: '重点',
            type: 'warning',
          },
        },
        {
          text: '🐛 踩坑记录',
          link: '/docs/flutter/troubleshooting',
        },
      ],
    },
  ]
}
