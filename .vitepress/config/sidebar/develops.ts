import { getSidebarsItems } from '../sidebar'

const devlops = [
  { text: 'index', link: '/docs/devops/index' },
  { text: 'package_tools', link: '/docs/devops/package_tools' },
  { text: 'docker', link: '/docs/devops/docker' },
  { text: 'jenkins', link: '/docs/devops/jenkins' },

  { text: 'mysql', link: '/docs/devops/mysql' },
  { text: 'redis', link: '/docs/devops/redis' },
]
const linux = [
  { text: 'index', link: '/docs/devops/linux/index' },
  { text: 'linux', link: '/docs/devops/linux/linux' },
  { text: 'linux初体验', link: '/docs/devops/linux/linux1'}
]

function sidebarDevelops() {
  return [
    { text: 'devops', collapsed: false, items: devlops },
    { text: 'Linux', collapsed: false, items: linux },
  ]
}
function sidebarTools() {
  return [
    { text: '工具链', collapsed: false, items: getSidebarsItems('tools-chain') },
  ]
}


export { sidebarDevelops, sidebarTools }