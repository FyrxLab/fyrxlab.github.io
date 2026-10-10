// Per-page share previews (Open Graph / Discord embeds), built with the site.
//
// transformHead() calls pageMeta() for every page: it returns the og:/twitter:
// tags (real title, description, URL and the product's color as the embed
// accent) and queues a 1200x630 image job. buildEnd() calls renderQueued(),
// which draws each job as an SVG (same sky, sun, orb and gloss as the site)
// and rasterizes it with resvg into <outDir>/og/p/<page>.png.
//
// Fonts are bundled in scripts/fonts so CI renders identically: Istok Web
// (OFL) for text and Font Awesome 6 Free Solid (OFL) for product icons.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { PRODUCTS } from './theme/productPalette.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://fyrx.net'
const LOCALES = ['en', 'es', 'it', 'pt']
const FONT_FILES = ['IstokWeb-Regular.ttf', 'IstokWeb-Bold.ttf', 'fa-solid-900.ttf'].map((f) => path.join(ROOT, 'scripts', 'fonts', f))

// Product logos inside the orb (same choice as scripts/og-card.html); the rest
// use their Font Awesome icon from productPalette.js.
const LOGOS = { solver: 'solver.svg', solvermotd: 'smotd.png', phos: 'phosphophyllite.png', furnace: 'absoluteenergy.png' }
const PIXEL_ART = new Set(['phos', 'furnace'])
const FA = { 'fa-server': 0xf233, 'fa-image': 0xf03e, 'fa-gem': 0xf3a5, 'fa-fire-burner': 0xe4f1, 'fa-music': 0xf001, 'fa-dragon': 0xf6d5, 'fa-robot': 0xf544, 'fa-table-cells': 0xf00a }
const AQUA = '#1aa3dd'

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const decode = (t) => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

function mix(hex, target, t) {
  const a = hex.match(/\w\w/g).map((h) => parseInt(h, 16))
  const b = target.match(/\w\w/g).map((h) => parseInt(h, 16))
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

// Rough Istok Web Bold advance widths (em), good enough to wrap a title.
function textWidth(str, size) {
  let em = 0
  for (const ch of str) {
    if (' ilj.,:;\'!|'.includes(ch)) em += 0.27
    else if ('ftrI()[]'.includes(ch)) em += 0.38
    else if ('mwMW'.includes(ch)) em += 0.86
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) em += 0.66
    else em += 0.56
  }
  return em * size
}
function wrap(text, size, max, lines) {
  const words = text.split(/\s+/)
  const out = ['']
  for (const w of words) {
    const next = out[out.length - 1] ? `${out[out.length - 1]} ${w}` : w
    if (textWidth(next, size) <= max || !out[out.length - 1]) out[out.length - 1] = next
    else out.push(w)
  }
  if (out.length > lines) {
    out.length = lines
    out[lines - 1] = out[lines - 1].replace(/\s*\S*$/, '') + '…'
  }
  return out
}

// SVG logos are rasterized first: resvg doesn't draw an SVG nested in <image>.
const logoCache = {}
function dataUri(file) {
  if (!logoCache[file]) {
    let buf = fs.readFileSync(path.join(ROOT, 'public', file))
    if (file.endsWith('.svg')) buf = new Resvg(buf, { fitTo: { mode: 'width', value: 264 } }).render().asPng()
    logoCache[file] = `data:image/png;base64,${buf.toString('base64')}`
  }
  return logoCache[file]
}

function svgFor({ title, eyebrow, color, key, icon }) {
  const cx = 205, cy = 300, r = 112
  const orbInner = LOGOS[key]
    ? `<image href="${dataUri(LOGOS[key])}" x="${cx - 66}" y="${cy - 66}" width="132" height="132" preserveAspectRatio="xMidYMid meet"${PIXEL_ART.has(key) ? ' image-rendering="optimizeSpeed"' : ''}/>`
    : `<text x="${cx}" y="${cy + 33}" text-anchor="middle" font-family="Font Awesome 6 Free" font-weight="900" font-size="92" fill="#ffffff">&#x${(FA[icon] || 0xf1b2).toString(16)};</text>`

  // largest size that fits: one line at 84, else two lines, else three at 56
  let size, lines
  for (const [s, max] of [[84, 1], [72, 2], [62, 2], [56, 3]]) {
    size = s
    lines = wrap(title, s, 740, max)
    if (!lines[lines.length - 1].endsWith('…')) break
  }
  const lineH = size * 1.06
  const blockH = 30 + 16 + lines.length * lineH
  const top = 300 - blockH / 2
  const eyebrowY = top + 24
  const firstBase = top + 30 + 16 + size * 0.82
  const titleText = lines.map((l, i) => `<tspan x="370" y="${(firstBase + i * lineH).toFixed(1)}">${esc(l)}</tspan>`).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb8ee"/><stop offset=".4" stop-color="#9fdcfb"/><stop offset=".75" stop-color="#d9f3ff"/><stop offset="1" stop-color="#f3fbff"/></linearGradient>
  <radialGradient id="sun" gradientUnits="userSpaceOnUse" cx="1060" cy="-50" r="560" gradientTransform="translate(1060 -50) scale(1 .62) translate(-1060 50)"><stop offset="0" stop-color="${color}" stop-opacity=".62"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
  <radialGradient id="orb" cx=".5" cy="1.2" r=".95"><stop offset="0" stop-color="${mix(color, '#ffffff', 0.45)}"/><stop offset=".47" stop-color="${color}"/><stop offset="1" stop-color="${mix(color, '#000000', 0.5)}"/></radialGradient>
  <radialGradient id="hl" cx=".5" cy=".24" r=".5" gradientTransform="translate(.5 .24) scale(1 .62) translate(-.5 -.24)"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <radialGradient id="bub" cx=".32" cy=".28" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".12" stop-color="#ffffff" stop-opacity=".35"/><stop offset=".6" stop-color="#a0e1ff" stop-opacity=".12"/><stop offset="1" stop-color="#ffffff" stop-opacity=".5"/></radialGradient>
  <linearGradient id="word" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d6fb0"/><stop offset=".55" stop-color="#1aa3dd"/><stop offset="1" stop-color="#0b5e98"/></linearGradient>
  <linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<rect width="1200" height="630" fill="url(#sky)"/>
<rect width="1200" height="630" fill="url(#sun)"/>
<g filter="url(#soft)" fill="#ffffff">
  <ellipse cx="930" cy="560" rx="200" ry="44" opacity=".9"/><ellipse cx="1090" cy="520" rx="140" ry="34" opacity=".8"/><ellipse cx="110" cy="600" rx="240" ry="50" opacity=".9"/>
</g>
<g stroke="url(#sw)" fill="none">
  <path d="M0 560 C 300 470, 620 600, 1200 480" stroke-width="3" opacity=".9"/>
  <path d="M0 575 C 360 510, 670 610, 1200 515" stroke-width="1.5" opacity=".6"/>
  <path d="M0 548 C 260 455, 720 585, 1200 455" stroke-width="12" opacity=".14"/>
</g>
<g stroke="#ffffff" stroke-opacity=".55" stroke-width="1.5" fill="url(#bub)">
  <circle cx="630" cy="78" r="23"/><circle cx="1110" cy="290" r="15"/><circle cx="62" cy="96" r="19"/><circle cx="540" cy="520" r="11"/>
</g>
<ellipse cx="${cx}" cy="${cy + r + 18}" rx="${r * 0.85}" ry="18" fill="${mix(color, '#06304f', 0.35)}" opacity=".45" filter="url(#shadow)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#orb)"/>
${orbInner}
<ellipse cx="${cx}" cy="${cy - r * 0.5}" rx="${r * 0.68}" ry="${r * 0.42}" fill="url(#hl)"/>
<text x="370" y="${eyebrowY.toFixed(1)}" font-family="Istok Web" font-weight="700" font-size="24" letter-spacing="3.5" fill="#0b5e98">${esc(eyebrow.toUpperCase())}</text>
<text font-family="Istok Web" font-weight="700" font-size="${size}" fill="#ffffff" opacity=".7" transform="translate(0 2)">${titleText}</text>
<text font-family="Istok Web" font-weight="700" font-size="${size}" fill="url(#word)">${titleText}</text>
<text x="80" y="574" font-family="Istok Web" font-weight="700" font-size="26" fill="#06304f">FyrxLab</text>
<rect x="960" y="540" width="160" height="48" rx="24" fill="#ffffff" fill-opacity=".85" stroke="#ffffff"/>
<text x="1040" y="572" text-anchor="middle" font-family="Istok Web" font-weight="700" font-size="24" fill="#06304f">fyrx.net</text>
</svg>`
}

function sidebarGroup(site, locale, link) {
  const tc = locale === 'en' ? site.themeConfig : site.locales?.[locale]?.themeConfig
  const sidebar = tc?.sidebar || site.themeConfig?.sidebar || {}
  const groups = Object.values(sidebar).flat()
  for (const g of groups) {
    if (g.items?.some((i) => i.link === link || i.link === link.replace(/\/$/, ''))) return g.text
  }
  return ''
}

function firstParagraph(html) {
  const m = html?.match(/<p>([\s\S]*?)<\/p>/)
  return m ? decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() : ''
}

const queue = []

export function pageMeta({ pageData, siteConfig, content }) {
  const rel = pageData.relativePath
  const segs = rel.split('/')
  const locale = LOCALES.includes(segs[0]) ? segs[0] : 'en'
  const key = PRODUCTS[segs[1]] ? segs[1] : null
  const product = key ? PRODUCTS[key] : null
  const urlPath = rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  const fm = pageData.frontmatter || {}
  const isLanding = segs.length <= 2 && segs[segs.length - 1] === 'index.md' && !key
  const color = product?.color || AQUA

  let title, eyebrow, ogTitle
  if (fm.hero?.name) {
    title = fm.hero.text || fm.hero.name
    eyebrow = fm.hero.name
    ogTitle = fm.hero.text ? `${fm.hero.name} — ${fm.hero.text}` : fm.hero.name
  } else {
    title = pageData.title || 'FyrxLab'
    const group = key ? sidebarGroup(siteConfig.site, locale, `/${urlPath}`) : ''
    eyebrow = product ? (group && group !== product.name ? `${product.name} · ${group}` : product.name) : 'FyrxLab'
    ogTitle = product ? `${title} · ${product.name}` : title
  }
  let description = fm.description || fm.hero?.tagline || firstParagraph(content) || siteConfig.site.description
  if (description.length > 200) description = `${description.slice(0, 197).replace(/\s+\S*$/, '')}…`

  let image = `${SITE}/og/fyrxlab.png`
  if (!isLanding && !pageData.isNotFound && rel !== '404.md') {
    const out = `og/p/${rel.replace(/\.md$/, '')}.png`
    queue.push({ out, title, eyebrow, color, key, icon: product?.icon || (segs[1] === 'compatibility.md' ? 'fa-table-cells' : null) })
    image = `${SITE}/${out}`
  }

  return [
    ['meta', { name: 'theme-color', content: color }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'FyrxLab' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: `${SITE}/${urlPath}` }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: ogTitle }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }]
  ]
}

export function renderQueued(outDir) {
  const font = { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Istok Web' }
  for (const job of queue) {
    const png = new Resvg(svgFor(job), { font, fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    const file = path.join(outDir, job.out)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, png)
  }
  return queue.length
}

// "Protected by AbsoluteSolver" badges for server websites (SolverBadge.vue).
// Rendered at 2x into public/badges/solver-<lang>.png, committed, and only
// regenerated by hand: node .vitepress/og.js badges
const BADGE_LABEL = { en: 'PROTECTED BY', es: 'PROTEGIDO POR', it: 'PROTETTO DA', pt: 'PROTEGIDO POR' }
export function renderBadges(dir) {
  const font = { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Istok Web' }
  const gold = PRODUCTS.solver.color
  for (const [loc, label] of Object.entries(BADGE_LABEL)) {
    const w = Math.ceil(46 + Math.max(textWidth(label, 9.5) + label.length * 1.2, textWidth('AbsoluteSolver', 15)) + 16)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 2}" height="88" viewBox="0 0 ${w} 44">
<defs>
  <linearGradient id="pill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#dcf1fc"/><stop offset=".5" stop-color="#c2e6f9"/><stop offset="1" stop-color="#e8f7fe"/></linearGradient>
  <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffffff" stop-opacity=".1"/></linearGradient>
  <radialGradient id="orb" cx=".5" cy="1.2" r=".95"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset=".47" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.5)}"/></radialGradient>
  <radialGradient id="hl" cx=".5" cy=".24" r=".5" gradientTransform="translate(.5 .24) scale(1 .62) translate(-.5 -.24)"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
</defs>
<rect x=".5" y=".5" width="${w - 1}" height="43" rx="21.5" fill="url(#pill)" stroke="#7cc4ea"/>
<rect x="3" y="2" width="${w - 6}" height="19" rx="9.5" fill="url(#gloss)"/>
<circle cx="22" cy="22" r="15.5" fill="url(#orb)"/>
<image href="${dataUri(LOGOS.solver)}" x="11.5" y="11.5" width="21" height="21"/>
<ellipse cx="22" cy="14.5" rx="10.5" ry="6.5" fill="url(#hl)"/>
<text x="45" y="18" font-family="Istok Web" font-weight="700" font-size="9.5" letter-spacing="1.2" fill="#0b5e98">${label}</text>
<text x="45" y="34" font-family="Istok Web" font-weight="700" font-size="15" fill="#06304f">AbsoluteSolver</text>
</svg>`
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `solver-${loc}.png`), new Resvg(svg, { font }).render().asPng())
  }
}

// For trying the template outside a full build: node .vitepress/og.js
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv[2] === 'badges') {
  renderBadges(path.join(ROOT, 'public', 'badges'))
  console.log('badges written to public/badges')
} else if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const tmp = path.join(ROOT, '.vitepress', 'cache', 'og-sample')
  queue.push(
    { out: 'tick.png', title: 'Monitor de Ticks', eyebrow: 'AbsoluteSolver · Funcionalidades', color: PRODUCTS.solver.color, key: 'solver', icon: 'fa-server' },
    { out: 'noteblock.png', title: 'A Symphony of Blocks', eyebrow: 'Noteblock', color: PRODUCTS.noteblock.color, key: 'noteblock', icon: 'fa-music' },
    { out: 'long.png', title: 'Proveedores de IA compatibles y cómo configurar cada uno paso a paso en tu bot', eyebrow: 'FyrxAI · Guía', color: PRODUCTS.fyrxai.color, key: 'fyrxai', icon: 'fa-robot' },
    { out: 'phos.png', title: 'Items', eyebrow: 'Phosphophyllite · Features', color: PRODUCTS.phos.color, key: 'phos', icon: 'fa-gem' }
  )
  console.log(renderQueued(tmp), 'samples in', tmp)
}
