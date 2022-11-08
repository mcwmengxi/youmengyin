import { defineConfig } from 'vitepress';
import sidebar from './config/sidebar';
import nav from './config/nav';
import footer from './config/footer';
const logo = "https://iconfont.alicdn.com/p/illus/file/WgLsw4nYmfzB/d57e706d-2783-4917-911e-c19f03d63b14_origin.svg";
export default defineConfig({
    lang: "zh-CN",
    title: 'ymy-ui',
    base: '/youmengyin/',
    description: 'Just playing around.',
    appearance: true,
    themeConfig: {
        // 配置logo
        logo,
        // 配置导航栏
        nav,
        // 配置侧边菜单栏
        sidebar,
        // 配置页脚
        footer,
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
          ]
    }
})