import fs from 'node:fs'
import path from 'node:path'

const locales = ['en', 'es', 'it', 'pt']
const origin = 'https://fyrx.net'
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const route = file => file.replace(/index\.md$/, '').replace(/\.md$/, '')

export function discoveryHead(ctx) {
  const relative = ctx.pageData.relativePath
  if (!locales.some(loc => relative.startsWith(`${loc}/`))) return []
  const tail = relative.slice(3)
  return [
    ['link', { rel: 'canonical', href: `${origin}/${route(relative)}` }],
    ...locales.filter(loc => fs.existsSync(path.join(ctx.siteConfig.srcDir, loc, tail))).map(loc => ['link', { rel: 'alternate', hreflang: loc, href: `${origin}/${route(`${loc}/${tail}`)}` }])
  ]
}

export function writeDiscovery(srcDir, outDir) {
  const pages = []
  for (const loc of locales) {
    for (const item of fs.readdirSync(path.join(srcDir, loc), { recursive: true }).filter(file => file.endsWith('.md'))) {
      const relative = `${loc}/${item.replace(/\\/g, '/')}`
      const text = fs.readFileSync(path.join(srcDir, relative), 'utf8')
      const title = text.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] || text.match(/^# (.+)$/m)?.[1] || text.match(/^  name:\s*"(.+)"/m)?.[1] || 'FyrxLab'
      pages.push({ relative, title, locale: loc, url: `${origin}/${route(relative)}` })
    }
  }
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${escape(p.url)}</loc></url>`).join('\n')}\n</urlset>\n`)
  const index = subset => '# FyrxLab\n\n> Official documentation and browser tools for FyrxLab products.\n\n' + subset.map(p => `- [${p.title} (${p.locale})](${p.url})`).join('\n') + '\n'
  fs.writeFileSync(path.join(outDir, 'llms.txt'), index(pages))
  for (const loc of locales) fs.writeFileSync(path.join(outDir, loc, 'llms.txt'), index(pages.filter(p => p.locale === loc)))
}

export const searchTranslations = Object.fromEntries([
  ['es', 'Buscar', 'Sin resultados', 'Ver detalles', 'Borrar búsqueda', 'Cerrar', 'Seleccionar', 'Navegar'],
  ['it', 'Cerca', 'Nessun risultato', 'Mostra dettagli', 'Cancella ricerca', 'Chiudi', 'Seleziona', 'Naviga'],
  ['pt', 'Buscar', 'Nenhum resultado', 'Mostrar detalhes', 'Limpar busca', 'Fechar', 'Selecionar', 'Navegar']
].map(([loc, search, none, details, reset, close, select, navigate]) => [loc, { translations: { button: { buttonText: search, buttonAriaLabel: search }, modal: { noResultsText: none, displayDetails: details, resetButtonTitle: reset, backButtonTitle: close, footer: { selectText: select, navigateText: navigate, closeText: close } } } }]))
