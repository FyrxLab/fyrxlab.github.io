// Small progressive enhancements on rendered doc pages (client only).

const FILTER = {
  en: 'Filter this table…',
  es: 'Filtrar esta tabla…',
  it: 'Filtra questa tabella…',
  pt: 'Filtrar esta tabela…'
}

// Tables with 8+ rows (Solver's command list, etc.) get a filter box above
// them; every word typed must appear somewhere in a row for it to stay.
export function enhanceTables(locale) {
  document.querySelectorAll('.vp-doc table').forEach((table) => {
    if (table.dataset.enhanced) return
    table.dataset.enhanced = '1'
    const rows = [...(table.tBodies[0]?.rows || [])]
    if (rows.length < 8) return

    const bar = document.createElement('div')
    bar.className = 'table-filter'
    const input = document.createElement('input')
    input.type = 'search'
    input.placeholder = FILTER[locale] || FILTER.en
    input.setAttribute('aria-label', input.placeholder)
    const count = document.createElement('span')
    count.className = 'table-filter-count'
    count.setAttribute('aria-live', 'polite')
    bar.append(input, count)
    table.before(bar)

    input.addEventListener('input', () => {
      const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
      let shown = 0
      for (const row of rows) {
        const hit = words.every((w) => row.textContent.toLowerCase().includes(w))
        row.hidden = !hit
        if (hit) shown++
      }
      count.textContent = words.length ? `${shown} / ${rows.length}` : ''
    })
  })
}

// Clicking a command or permission inside a table copies it.
let copyBound = false
export function bindTableCopy() {
  if (copyBound) return
  copyBound = true
  document.addEventListener('click', async (e) => {
    const code = e.target.closest?.('.vp-doc td code')
    if (!code) return
    try {
      await navigator.clipboard.writeText(code.textContent)
      code.classList.add('copied-chip')
      setTimeout(() => code.classList.remove('copied-chip'), 1200)
    } catch {
      /* clipboard refused: text is still selectable */
    }
  })
}

// Clicking a heading's "#" also copies the link to that section, with a
// small "Link copied" bubble (custom.css .header-anchor[data-copied]).
const LINK_COPIED = { en: 'Link copied', es: 'Enlace copiado', it: 'Link copiato', pt: 'Link copiado' }
let anchorBound = false
export function bindAnchorCopy() {
  if (anchorBound) return
  anchorBound = true
  document.addEventListener('click', async (e) => {
    const a = e.target.closest?.('.vp-doc .header-anchor')
    if (!a) return
    const locale = ['es', 'it', 'pt'].find((l) => location.pathname.startsWith(`/${l}/`)) || 'en'
    try {
      await navigator.clipboard.writeText(new URL(a.getAttribute('href'), location.href).href)
      a.dataset.copied = LINK_COPIED[locale]
      setTimeout(() => delete a.dataset.copied, 1500)
    } catch {
      /* clipboard refused: the URL bar still has the link */
    }
  })
}
