import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import 'uno.css'

// 自定义 CSS
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
// import './style/index.scss'
// import './style/code.css'
// import './style/overrides.css'
import './style/base.css'

export default {
  ...DefaultTheme,
  async enhanceApp({ app }: { app: App }) {
    if (!import.meta.env.SSR) {
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
    }
  },
}
