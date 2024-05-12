import { DefaultTheme } from 'vitepress'
import glob from 'fast-glob'
import { sidebarInterview,sidebarAlgorithm, sidebarPatterns, sidebarDesign,sidebarFlutter, sidebarArticle,sidebarTools, sidebarGo, sidebarSql,sidebarReg, sidebarOtherBe, sidebarFront, sidebarDevelops } from './sidebar/index'

export function getSidebarsItems(path: string, rootPath: string = 'docs') {
  const links: DefaultTheme.SidebarItem[] = []
  glob.sync(`${rootPath}/${path}/*`, {
    // onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name, path: url }) => {
    if (/.md$/g.test(name)) {
      links.push({
        text: name.replace('.md', ''),
        link: `/${url.replace('.md', '')}`,
      })
    }
  })
  return links
}



export default {
  '/docs/devops/' : sidebarDevelops(),
  '/docs/tools-chain/': sidebarTools(),
  '/docs/resource/': [
    {
      text: '资源分享',
      items: [
        {
          text: 'index',
          link: '/docs/resource/index',
        },
        {
          text: 'emojy',
          link: '/docs/resource/emojy',
        },
        {
          text: 'program-share',
          link: '/docs/resource/program-share',
        },
        {
          text: '浏览器',
          link: '/docs/resource/program-share',
        },
        {
          text: '编程实用工具',
          link: '/docs/resource/ProgrammingUtilitySharing',
        },
        { text: 'vue3生态', link: '/docs/resource/Vue3UtilitySharing' },
      ],
    },
  ],

  // 前端
  '/docs/front-end': sidebarFront(),
  // flutter
  '/docs/flutter': sidebarFlutter(),
  // 面试
  '/docs/interview': sidebarInterview(),
  
  // 后端
  '/views/after-end': sidebarOtherBe(),
  // GoLang
  '/docs/go': sidebarGo(),
  // sql
  '/views/sql/': sidebarSql(),
  // 正则
  'view/regexp': sidebarReg(),

  '/docs/algorithm/': sidebarAlgorithm(),
  '/docs/patterns/': sidebarPatterns(),
  '/article/vue-design/': sidebarDesign(),

  '/article/': sidebarArticle(),
}
