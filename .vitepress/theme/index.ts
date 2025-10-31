import DefaultTheme from 'vitepress/theme'
import BlogTheme from '@sugarat/theme'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'
import 'uno.css'

// 自定义 CSS
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
// import './style/index.scss'
// import './style/code.css'
// import './style/overrides.css'
import './style/base.css'
import { h } from 'vue'
import LayoutBottom from './components/LayoutBottom.vue'

export default {
  // ...DefaultTheme,
  extends: BlogTheme,
  // @ts-ignore
  Layout: () => h(BlogTheme.Layout, null, {
    //https://vitepress.dev/zh/guide/extending-default-theme#layout-slots全量插槽文档
    'layout-bottom':() => h(LayoutBottom)
  }),
  async enhanceApp({ app, router }) {
    if (inBrowser) {
      // live2d
      const { loadOml2d } = await import('oh-my-live2d')
      loadOml2d({
        tips: {
          style: { top: '-45px' },
        },
        models: [
          { path: "https://cdn.jsdelivr.net/gh/journey-ad/blog-img/live2d/Diana/Diana.model3.json", scale: 0.25},
          // path: 'https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/Live2D/Senko_Normals/senko.model3.json'
        ]
      })
      //访问量统计
      router.onAfterRouteChange = () => {
        busuanzi.fetch()
      }
    }
  },
} satisfies Theme
