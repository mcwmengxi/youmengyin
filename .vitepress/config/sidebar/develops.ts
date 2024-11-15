import { getSidebarsItems } from '../sidebar'

const devlops = [
  { text: 'index', link: '/docs/devops/index' },
  { text: 'package_tools', link: '/docs/devops/package_tools' },
  { text: 'jenkins', link: '/docs/devops/jenkins' },
  { text: 'mysql', link: '/docs/devops/mysql' },
  { text: 'redis', link: '/docs/devops/redis' },
  { text: 'shell', link: '/docs/devops/shell' },
  { text: 'vscode', link: '/docs/devops/vscode' }
]
const linux = [
  { text: 'index', link: '/docs/devops/linux/index' },
  { text: 'linux基础', link: '/docs/devops/linux/basic' },
  { text: 'linux', link: '/docs/devops/linux/linux' },
  { text: 'linux初体验', link: '/docs/devops/linux/linux1'}
]
const docker = [
  { text: 'docker', link: '/docs/devops/docker/docker' },
  { text: 'docker常用命令', link: '/docs/devops/docker/basic' },
  { text: 'docker容器编排', link: '/docs/devops/docker/docker-compose' },
]

function sidebarDevelops() {
  return [
    { text: 'devops', collapsed: false, items: devlops },
    { text: 'Linux', collapsed: false, items: linux },
    { text: 'docker', collapsed: false, items: docker },
  ]
}
function sidebarTools() {
  return [
    { text: '工具链', collapsed: false, items: getSidebarsItems('tools-chain') },
  ]
}


export { sidebarDevelops, sidebarTools }
