import { defineConfig } from 'vitepress';
import fg from 'fast-glob'

import sidebar from './config/sidebar';
import nav from './config/nav';
import footer from './config/footer';
import Unocss from 'unocss/vite'
const logo = "https://iconfont.alicdn.com/p/illus/file/WgLsw4nYmfzB/d57e706d-2783-4917-911e-c19f03d63b14_origin.svg";
const logoUrl = "https://p3-passport.byteimg.com/img/user-avatar/22c8c35573946132067839366a854c6c~100x100.awebp"


export default defineConfig({
    lang: "zh-CN",
    title: 'ymy-ui',
    base: '/youmengyin/',
    description: 'Just playing around.',
    appearance: true,// 是否启用暗模式
    head: [
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', { rel: 'icon', type: 'image/png', href: '/no_profile_s.png' }],
      // would render: <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ],
    ignoreDeadLinks: true,// 不会因为死链导致失败
    lastUpdated: true,// 上次更新时间
    // markdown解析器
    markdown: {
      theme: 'material-palenight',
      lineNumbers: true
    },
    // outDir: '',
    // srcDir: '', // 存储 markdown 页面的目录（相对于项目根目录）。
    titleTemplate: 'YMY',
    themeConfig: {
        siteTitle: '网站标题', // 自定义此项以替换导航中的默认网站标题
        outlineTitle: '目录', // 自定义右侧边栏的标题
        outline: [2, 6], // 要在大纲中显示的页眉级别
        // 编辑链接允许您显示一个链接，用于在 Git 管理服务（如 GitHub 或 GitLab）上编辑页面
        editLink: {
          pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        // 配置logo
        // logo: logoUrl,
        logo: '/no_profile_s.png',
        // 配置导航栏
        nav,
        // 配置侧边菜单栏
        sidebar,
        // 配置页脚
        footer,
        lastUpdatedText: "最近更新时间",
        algolia: {
            appId: 'QM8Y7EPOUO',
            apiKey: 'dca4c36e01076d19747ee4b7a678ecef',
            indexName: 'youmengyin',
            searchParameters: {
                facetFilters: ['language:cn']
            }
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
          { icon: 'twitter', link: '...' },
          // You can also add custom icons by passing SVG as string:
          {
            icon: {
              svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
            },
            link: '...'
          }
        ],
        // 广告
        carbonAds: {
          code: 'your-carbon-code',
          placement: 'your-carbon-placement'
        },
        // docFooter: {
        //   prev: '上一篇',
        //   next: '下一篇'
        // },
    },
    vite: {
      build: {
        chunkSizeWarningLimit: 2000,
      },
      plugins: [Unocss()]
    },
    vue: {
      reactivityTransform: true,
    },
})