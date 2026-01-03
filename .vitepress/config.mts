import { defineConfigWithTheme } from 'vitepress'
import sidebar from './config/sidebar'
import nav from './config/nav'
import Unocss from 'unocss/vite'
/* Markdown 文件预览 */
import MarkdownPreview from 'vite-plugin-markdown-preview'
import timeline from 'vitepress-markdown-timeline'
/* todo */
import taskLists from 'markdown-it-task-checkbox'
/* 插件 pagefind 搜索 */
import {
  chineseSearchOptimize,
  pagefindPlugin,
} from 'vitepress-plugin-pagefind'
// 导入主题的配置
import { blogTheme } from './blog-theme'
import { head } from './config/head'
import type { ThemeConfig } from './theme/types'
// 导入主题的样式
const logo =
  'https://iconfont.alicdn.com/p/illus/file/WgLsw4nYmfzB/d57e706d-2783-4917-911e-c19f03d63b14_origin.svg'
const logoUrl =
  'https://p3-passport.byteimg.com/img/user-avatar/22c8c35573946132067839366a854c6c~100x100.awebp'

export default defineConfigWithTheme<ThemeConfig>({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  title: 'ymy博客',
  lang: 'zh-CN',
  base: '/youmengyin/',
  description:
    '青萱织梦人的个人博客，，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等',
  appearance: true, // 是否启用暗模式
  head,
  srcExclude: ['redirect-tag.md'],
  ignoreDeadLinks: true, // 不会因为死链导致失败
  cleanUrls: true, // 去掉网址中的 .html 后缀
  lastUpdated: true, // 上次更新时间
  // outDir: '../.vitepress/dist',
  outDir: '',
  // srcDir: '', // 存储 markdown 页面的目录（相对于项目根目录）。
  titleTemplate: 'YMY',
  /* markdown 解析器 */
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    config: (md) => {
      md.use(timeline)
      md.use(taskLists, {
        disabled: true,
        divWrap: false,
        divClass: 'checkbox',
        idPrefix: 'cbx_',
        ulClass: 'task-list',
        liClass: 'task-list-item',
      })
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1')
          htmlResult += `<ArticleMetadata :article="{}" />`
        return htmlResult
      }
    },
  },
  themeConfig: {
    siteTitle: '浅月流歌', // 自定义此项以替换导航中的默认网站标题
    outlineTitle: '目录', // 自定义右侧边栏的标题
    outline: {
      level: [2, 6], // 要在大纲中显示的页眉级别
      label: '文章目录',
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    // 编辑链接允许您显示一个链接，用于在 Git 管理服务（如 GitHub 或 GitLab）上编辑页面
    editLink: {
      pattern: 'https://github.com/mcwmengxi/youmengyin/edit/master/docs/:path',
      text: '在GitHub编辑这个页面',
    },
    visitor: {
      badgeId: 'autumns-heartless/blog',
    },
    website: {
      showSnow: true, // 是否开启雪花。开启后仅在暗黑模式下显示
    },
    // 配置logo
    // logo: logoUrl,
    logo: '/logo.png',
    // logo: '/no_profile_s.png',
    // 配置导航栏
    nav,
    // 配置侧边菜单栏
    sidebar,
    // 配置页脚
    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: `Copyright © 2022-${new Date().getFullYear()} Ymy`
    // },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    search: {
      provider: 'local',
    },
    // algolia: {
    //   appId: 'QM8Y7EPOUO',
    //   apiKey: 'dca4c36e01076d19747ee4b7a678ecef',
    //   indexName: 'youmengyin',
    //   searchParameters: {
    //     facetFilters: ['language:cn'],
    //   },
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'twitter', link: '...' },
    ],
    // 广告
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement',
    // },
  },
  vite: {
    esbuild: {
      pure: ['console.log'], // 删除 console.log
      drop: ['debugger'], // 删除 debugger
    },
    server: {
      port: 8082,
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
    plugins: [
      Unocss() as any,
      MarkdownPreview(),
      pagefindPlugin({
        //使用 pagefind搜索插件 https://www.npmjs.com/package/vitepress-plugin-pagefind
        customSearchQuery: chineseSearchOptimize,
        resultOptimization: false,
        btnPlaceholder: '搜索文档',
        placeholder: '搜索文档',
        emptyText: '没有内容',
        heading: '共 {{searchResult}} 条结果',
      }),
    ],
  },
})
