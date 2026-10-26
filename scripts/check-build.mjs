import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

const root = path.resolve('.vitepress/dist')
const chunks = path.join(root, 'assets', 'chunks')
let count = 0
for (const loc of ['en', 'es', 'it', 'pt']) {
  const searchLocale = loc === 'en' ? 'root' : loc
  const indexFile = fs.readdirSync(chunks).find(file => file.startsWith(`@localSearchIndex${searchLocale}.`) && file.endsWith('.js'))
  assert.ok(indexFile, `${loc}: missing search index`)
  const { default: searchIndex } = await import(pathToFileURL(path.join(chunks, indexFile)).href)
  for (const slug of ['index', 'setup', 'config', 'solver', 'motd']) {
    assert.ok(searchIndex.includes(`/${loc}/lab/${slug === 'index' ? '' : slug}#laboratory`), `${loc}/${slug}: missing from search`)
    const file = path.join(root, loc, 'lab', `${slug}.html`)
    const html = fs.readFileSync(file, 'utf8')
    assert.match(html, /id="laboratory"/, `${loc}/${slug}: laboratory must be server-rendered`)
    assert.match(html, /rel="canonical"/, `${loc}/${slug}: missing canonical`)
    assert.match(html, /hreflang="es"/, `${loc}/${slug}: missing language alternatives`)
    assert.ok(!html.includes('location is not defined'))
    for (const [, link] of html.matchAll(/href="(\/[^"#]*)"/g)) {
      const url = link.split(/[?#]/)[0]
      if (url.startsWith('//')) continue
      const target = path.join(root, decodeURIComponent(url))
      const exists = fs.existsSync(target) || fs.existsSync(`${target}.html`) || fs.existsSync(path.join(target, 'index.html'))
      assert.ok(exists, `${loc}/${slug}: broken link ${url}`)
    }
    count++
  }
}
assert.ok(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').includes('/es/lab/config'))
assert.ok(fs.readFileSync(path.join(root, 'llms.txt'), 'utf8').includes('/es/lab/motd'))
assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('Enter FyrxLab'))
console.log(`Verified ${count} rendered laboratory routes, search entries, internal links, language metadata, discovery files and root fallback.`)
