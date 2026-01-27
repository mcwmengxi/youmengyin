import { getSidebarsItems } from '../utils'

function sidebarResource() {
  return [
    {
      text: '软件推荐与配置',
      collapsed: false,
      items: getSidebarsItems('resource/software'),
    },
    {
      text: '学习推荐',
      collapsed: false,
      items: getSidebarsItems('resource/study'),
    },
  ]
}

export { sidebarResource }
