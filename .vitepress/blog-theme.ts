import { getThemeConfig } from "@sugarat/theme/node"

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 主题色修改
  themeColor: 'el-blue',
  // 文章默认作者
  author: 'mcwmengxi',
  // 右侧精选文章栏目
  hotArticle: {
    title: '🔥 精选文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无精选内容'
  },
  // 页脚
  footer: [
    {
      version: false,
      copyright: {
        message: `Copyrights ©️ 2022-${new Date().getFullYear()} 丨 青萱织梦人`,
        icon: false,
      },
    },
    {
      version: false,
      message: '基于vitepress+@sugarat/theme主题'
    },
  ],
})

export { blogTheme }
