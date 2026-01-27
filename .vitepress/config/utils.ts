import { DefaultTheme } from 'vitepress'
import glob from 'fast-glob'

export function getSidebarsItems(path: string, rootPath: string = 'docs') {
  const links: DefaultTheme.SidebarItem[] = []
  glob.sync(`${rootPath}/${path}/*`, {
    // onlyDirectories: true,
    objectMode: true,
  }).forEach(({ name, path: url }) => {
    if (/.md$/g.test(name)) {
      links.push({
        text: name.replace('.md', ''),
        link: `/${url.replace('.md', '')}`,
      })
    }
  })
  return links
}
