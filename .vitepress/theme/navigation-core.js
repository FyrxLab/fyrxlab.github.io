export const cleanPath = value => value.split(/[?#]/)[0].replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/'
export const localeFor = value => value.match(/^\/(en|es|it|pt)(?:\/|$)/)?.[1] || 'en'
export function navigationContext(pages, path) {
  const current = pages.find(page => cleanPath(page.url) === cleanPath(path))
  const locale = localeFor(path)
  const product = current?.product || null
  const siblings = product ? pages.filter(page => page.locale === locale && page.product === product && !page.home) : []
  const order = page => /getting-started$/.test(page.url) ? 0 : /configuration$/.test(page.url) ? 1 : /changelog$/.test(page.url) ? 9 : 4
  siblings.sort((a, b) => order(a) - order(b) || a.title.localeCompare(b.title, locale))
  return { current, locale, product, siblings }
}
export const slugHeading = value => value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*_]/g, '').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/[\u0000-\u001f]/g, '').replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').replace(/^(\d)/, '_$1').toLowerCase()
