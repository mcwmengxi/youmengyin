import { useData } from 'vitepress'
import BlogTheme from '@sugarat/theme'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'
import 'uno.css'
import './style/index.scss'

// 自定义 CSS
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
// import './style/index.scss'
// import './style/code.css'
// import './style/overrides.css'
import './style/base.css'
import { h } from 'vue'
import LayoutBottom from './components/LayoutBottom.vue'
// 设置时间线圆点颜色 只需添加以下一行代码，引入时间线样式
//  --vp-c-brand: #b575e3; // 修改vitepress提供的主题颜色变量即可
import 'vitepress-markdown-timeline/dist/theme/index.css'
import Confetti from './components/Confetti.vue'
import BabyPulm from './components/BabyPulm.vue'
import MLayout from './components/MLayout.vue'
import BackTop from './components/BackTop.vue'
import Tag from './components/tag/Tag.vue'
import ArticleMetadata from './components/tag/ArticleMetadata.vue'
import MNavLinks from './components/MNavLinks.vue'

export default {
  // ...DefaultTheme,
  extends: BlogTheme,
  // @ts-ignore
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }
    // BlogTheme.Layout!
    return h(MLayout, props, {
      //https://vitepress.dev/zh/guide/extending-default-theme#layout-slots全量插槽文档
      'layout-bottom': () => h(LayoutBottom),
    })
  },
  async enhanceApp({ app, router }) {
    // app.provide('DEV', process.env.NODE_ENV === 'development')

    app.component('Confetti', Confetti)
    app.component('BabyPulm', BabyPulm)
    app.component('BackTop', BackTop)
    app.component('Tag', Tag)
    app.component('ArticleMetadata', ArticleMetadata)
    app.component('MNavLinks', MNavLinks)
    if (inBrowser) {
      // live2d
      const { loadOml2d } = await import('oh-my-live2d')
      loadOml2d({
        tips: {
          style: { top: '-45px' },
        },
        models: [
          {
            path: 'https://cdn.jsdelivr.net/gh/journey-ad/blog-img/live2d/Diana/Diana.model3.json',
            scale: 0.25,
          },
          // path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json'
        ],
      })
      //访问量统计
      router.onAfterRouteChange = () => {
        busuanzi.fetch()
      }
    }
  },
} satisfies Theme
