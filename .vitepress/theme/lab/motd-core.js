import { stringify } from 'yaml'

const colors = { black: '#000000', dark_blue: '#0000aa', dark_green: '#00aa00', dark_aqua: '#00aaaa', dark_red: '#aa0000', dark_purple: '#aa00aa', gold: '#ffaa00', gray: '#aaaaaa', dark_gray: '#555555', blue: '#5555ff', green: '#55ff55', aqua: '#55ffff', red: '#ff5555', light_purple: '#ff55ff', yellow: '#ffff55', white: '#ffffff' }
const legacy = Object.values(colors)
const colorOf = name => colors[name] || (/^#[0-9a-f]{6}$/i.test(name) ? name : null)
function blend(a, b, t) {
  const values = [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t))
  return `rgb(${values.join(',')})`
}

// Produces text/style tokens, never HTML. Unknown tags remain visible in the preview.
export function previewTokens(input) {
  const tokens = [], stack = []
  let style = {}
  const parts = String(input).slice(0, 4000).split(/(<[^>]*>|&[0-9a-fklmnor])/gi)
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue
    if (/^&[0-9a-f]$/i.test(part)) { style = { color: legacy[parseInt(part[1], 16)] }; stack.length = 0; continue }
    if (/^&[lmnor]$/i.test(part)) {
      const code = part[1].toLowerCase()
      if (code === 'r') { style = {}; stack.length = 0 }
      else style = { ...style, ...(code === 'l' ? { fontWeight: 'bold' } : code === 'o' ? { fontStyle: 'italic' } : { textDecoration: code === 'm' ? 'line-through' : 'underline' }) }
      continue
    }
    if (part.startsWith('<')) {
      const tag = part.slice(1, -1).toLowerCase()
      if (tag === 'reset') { style = {}; stack.length = 0; continue }
      if (tag.startsWith('/')) {
        const found = stack.map(s => s.tag).lastIndexOf(tag.slice(1))
        if (found >= 0) { style = stack[found].style; stack.length = found; continue }
      }
      const gradient = tag.match(/^gradient:(#[0-9a-f]{6}):(#[0-9a-f]{6})$/)
      if (gradient) {
        const end = parts.indexOf('</gradient>', i + 1)
        if (end >= 0) {
          const inside = previewTokens(parts.slice(i + 1, end).join(''))
          const length = inside.reduce((n, token) => n + [...token.text].length, 0)
          let offset = 0
          for (const token of inside) for (const char of token.text) tokens.push({ text: char, style: { ...style, ...token.style, color: blend(gradient[1], gradient[2], offset++ / Math.max(1, length - 1)) } })
          i = end; continue
        }
      }
      const color = colorOf(tag)
      const change = color ? { color } : ({ bold: { fontWeight: 'bold' }, b: { fontWeight: 'bold' }, italic: { fontStyle: 'italic' }, i: { fontStyle: 'italic' }, underlined: { textDecoration: 'underline' }, strikethrough: { textDecoration: 'line-through' } })[tag]
      if (change) { stack.push({ tag, style: { ...style } }); style = { ...style, ...change }; continue }
    }
    tokens.push({ text: part, style: { ...style } })
  }
  return tokens
}

export function motdConfig(line1, line2, banner) {
  return '# SolverMOTD: merge these sections into your existing config.yml\n' + stringify({ motd: { line1, line2 }, banner: { enabled: banner, file: 'banner.png', 'fallback-line1': line1, 'fallback-line2': line2 } })
}
