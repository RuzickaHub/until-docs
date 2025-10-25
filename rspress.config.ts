import fs from 'fs'
import path from 'path'
import { defineConfig } from 'rspress/config'

function prettifyName(name: string) {
  return name
    .replace(/\.mdx?$/, '')
    .replace(/^index$/, 'Úvod')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function generateSidebar(dir: string, base = ''): any[] {
  const fullDir = path.resolve(process.cwd(), dir)
  if (!fs.existsSync(fullDir)) return []
  const entries = fs.readdirSync(fullDir, { withFileTypes: true })

  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })

  return entries
    .filter((e) => !e.name.startsWith('.'))
    .map((entry) => {
      const relativePath = path.join(base, entry.name)

      if (entry.isDirectory()) {
        return {
          text: prettifyName(entry.name),
          items: generateSidebar(path.join(dir, entry.name), relativePath),
        }
      } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        const title = entry.name.replace(/\.mdx?$/, '')
        const linkPath =
          '/' +
          path
            .join(base, title)
            .replace(/\\/g, '/')
            .replace(/index$/, '')
        return {
          text: prettifyName(entry.name),
          link: linkPath,
        }
      }
    })
    .filter(Boolean) as any[]
}

export default defineConfig({
  title: 'Until design fluent',
  description: 'Oficiální dokumentace projektu Until design fluent',
  base: '/until-docs/', // <- uprav na jméno svého repozitáře
  themeConfig: {
    logo: '/logo.png',
    outlineTitle: 'Obsah stránky',
    lastUpdatedText: 'Poslední aktualizace',
    search: true,
    darkModeSwitchLabel: 'Režim',
    // ZDE je důležitá změna: zabalíme do objektu s klíčem '/'
    sidebar: {
      '/': generateSidebar('docs'),
    },
    nav: [
      { text: 'Úvod', link: '/' },
      { text: 'Začínáme', link: '/getting-started' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ruzickajakub/until-docs' }
    ],
  },
})
