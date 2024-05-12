function sidebarArticle() {
  return [
    {
      text: '里程碑',
      items: [
        { text: '里程碑 2023', link: '/article/milepost/milepost-2023' },
        { text: '里程碑 2024', link: '/article/milepost/milepost-2024' }
      ],
    },
    {
      text: '年度总结',
      items: [{ text: '2023 年度总结', link: '/article/annual-summary/2023' }],
    },
    {
      text: '我的文章',
      items: [
        { text: '记事本', link: '/article/article/article-0' },
        { text: '别再写循环套循环了', link: '/article/article/article-1' },
        { text: 'GitHubPages 部署项目', link: '/article/article/article-2' },
        { text: 'highlightjs 使用方法', link: '/article/article/article-3' },
        {
          text: 'Vue3 + pnpm 搭建 monorepo 项目',
          link: '/article/article/article-4',
        },
        { text: '模板', link: '/article/article/template' },
        { text: 'github学习项目', link: '/article/article/awesome-project' },
      ],
    }
  ]
}

export { sidebarArticle }