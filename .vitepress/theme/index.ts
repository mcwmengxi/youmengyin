import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import 'uno.css'

// 自定义 CSS
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
import './style/index.scss'
import './style/code.css'
import './style/overrides.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }: { app: App }) {},
}
