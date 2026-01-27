import BlogTheme from '@sugarat/theme'
/* 这里存放 ts要求的内容格式 */
import type { DefaultTheme } from 'vitepress'

export interface NavLink {
  /** 站点图标 */
  icon?: string | { svg: string }
  badge?:
    | string
    | {
        text?: string
        type?: 'info' | 'tip' | 'warning' | 'danger'
      }
  /** 站点名称 */
  title: string
  /** 站点名称 */
  desc?: string
  /** 站点链接 */
  link: string
  /* 能够下载 */
  canDownLoad?: boolean
}

export interface ThemeConfig extends DefaultTheme.Config {
  search: any
  nav: any
  socialLinks: any
  outlineTitle?: string
  docFooter?: object
  darkModeSwitchLabel?: string
  sidebarMenuLabel?: string
  returnToTopLabel?: string
  article?: object
  website?: object
  visitor?: object
  logo: any
}
