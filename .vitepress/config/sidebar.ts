import {
  sidebarInterview,
  sidebarAlgorithm,
  sidebarPatterns,
  sidebarDesign,
  sidebarFlutter,
  sidebarArticle,
  sidebarTools,
  sidebarGo,
  sidebarSql,
  sidebarReg,
  sidebarOtherBe,
  sidebarFront,
  sidebarDevelops,
  sidebarReact,
  sidebarTypescript,
} from './sidebar/index'
import {
  sidebarAndroid,
  sidebarElectron,
  sidebarThreeJS,
} from './sidebar/frontend'
import { autoGenerateSidebarNestjsItems } from './sidebar/nestjs'

export default {
  '/docs/devops/': sidebarDevelops(),
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
          text: 'book',
          link: '/docs/resource/book',
        },
        {
          text: 'book',
          link: '/docs/resource/book',
        },
        {
          text: 'tools',
          link: '/docs/resource/tools',
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
  '/docs/front-end/react/': sidebarReact(),
  '/docs/front-end/typescript/': sidebarTypescript(),
  // flutter
  '/docs/flutter': sidebarFlutter(),
  '/docs/electron': sidebarElectron(),
  '/docs/android': sidebarAndroid(),
  '/docs/threejs': sidebarThreeJS(),
  // nestjs
  '/docs/nestjs': autoGenerateSidebarNestjsItems(),
  // 面试
  '/docs/interview': sidebarInterview(),

  // 后端
  '/views/after-end': sidebarOtherBe(),
  // GoLang
  '/docs/backend/go': sidebarGo(),
  '/docs/backend/micro-service': sidebarGo(),
  // sql
  '/views/sql/': sidebarSql(),
  // 正则
  'view/regexp': sidebarReg(),

  '/docs/algorithm/': sidebarAlgorithm(),
  '/docs/patterns/': sidebarPatterns(),
  '/article/vue-design/': sidebarDesign(),

  '/article/': sidebarArticle(),
  '/views/tag': [
    {
      text: 'tag',
      link: '/views/tag',
    },
  ],
}
