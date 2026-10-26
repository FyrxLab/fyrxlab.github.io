import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { PRODUCTS } from './productPalette.js'
import { slugHeading } from './navigation-core.js'

const root = fileURLToPath(new URL('../../', import.meta.url))
export default {
  watch: ['../../en/**/*.md', '../../es/**/*.md', '../../it/**/*.md', '../../pt/**/*.md'],
  load(files) {
    return files.map(file => {
      const relative = path.relative(root, file).replace(/\\/g, '/')
      const [locale, productKey] = relative.split('/')
      const text = fs.readFileSync(file, 'utf8')
      const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      const meta = front ? parse(front[1]) : {}
      const body = text.slice(front?.[0].length || 0).replace(/```[\s\S]*?```/g, '')
      const url = '/' + relative.replace(/index\.md$/, '').replace(/\.md$/, '')
      return {
        url, locale, product: PRODUCTS[productKey] ? productKey : null, home: relative.endsWith('/index.md'),
        title: meta.title || meta.hero?.name || body.match(/^# (.+)$/m)?.[1]?.replace(/[`*]/g, '') || 'FyrxLab',
        section: /\/guide\//.test(relative) || /(?:getting-started|configuration)\.md$/.test(relative) ? 'guides' : /\/features\/|\/(?:antivpn|tick-monitor|proxy-relay|fyrx-ai|crash-analysis|console-monitor|topic-detection)\.md$/.test(relative) ? 'features' : 'reference',
        headings: [...body.matchAll(/^## (.+)$/gm)].map(([, title]) => ({ title: title.replace(/[`*]/g, '').trim(), id: slugHeading(title.trim()) }))
      }
    })
  }
}
