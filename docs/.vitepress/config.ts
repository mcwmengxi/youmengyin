import { defineConfig } from 'vitepress';
import sidebar from './config/sidebar';
import nav from './config/nav';
import footer from './config/footer';
const logo = "https://iconfont.alicdn.com/p/illus/file/WgLsw4nYmfzB/d57e706d-2783-4917-911e-c19f03d63b14_origin.svg";
export default defineConfig({
    lang: "zh-CN",
    title: 'ymy-ui',
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
        footer
    }
})