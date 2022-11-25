import DefaultTheme from 'vitepress/theme';
import { App, h } from 'vue';
import 'uno.css'
import RegisterSW from './components/RegisterSW.vue'
// import * as QxUI from "@ymy/components";
// import "@ymy/theme-chalk";
// 自定义 CSS
// https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/styles/vars.css
import './style/code.css';
import './style/overrides.css'

export default {
	...DefaultTheme,
	enhanceApp({ app } : { app : App}) {
		// for (const comp of [...Object.values(QxUI ?? {})]) {
		// 	app.component(comp.name, comp);
		// }
		// app.use(QxUI as any);
		// register global components
		// app.component('MyGlobalComponent' /* ... */);
	},
	Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(RegisterSW)
    })
  }
};
