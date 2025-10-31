import { getSidebarsItems } from '../utils'

export function autoGenerateSidebarNestjsItems() {
  return [
    { text: 'Nestjs', items: getSidebarsItems('nestjs'), collapsible: true, collapsed: true },
  ]
}
