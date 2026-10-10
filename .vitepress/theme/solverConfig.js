// Line-level reader for Solver's config.yml, shared by the explorer and the
// checker. Not a full YAML parser: it tracks indentation to build dotted
// paths ("ai-provider.model"), keeps each key's value as written, and treats
// the comment lines right above a key as that key's explanation.
import raw from './data/solver-config.yml?raw'

export function parse(text) {
  const out = []
  const stack = []
  let pending = []
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) { out.push({ kind: 'blank' }); pending = []; continue }
    const c = line.match(/^(\s*)#\s?(.*)$/)
    if (c) { out.push({ kind: 'comment', indent: c[1].length, text: c[2] }); pending.push(c[2]); continue }
    const k = line.match(/^(\s*)([\w.\-"']+):\s*(.*)$/)
    if (!k) { out.push({ kind: 'other', indent: line.match(/^\s*/)[0].length, text: line.trim() }); pending = []; continue }
    const indent = k[1].length
    const key = k[2].replace(/["']/g, '')
    while (stack.length && stack.at(-1).indent >= indent) stack.pop()
    // split an inline "# comment" off the value, ignoring '#' inside quotes
    const v = k[3].match(/^((?:"[^"]*"|'[^']*'|[^#])*?)\s*(?:#\s?(.*))?$/)
    const value = (v?.[1] ?? k[3]).trim()
    const doc = [...pending, v?.[2]].filter(Boolean).join(' ')
    out.push({ kind: 'key', indent, key, value, doc, path: [...stack.map((s) => s.key), key].join('.') })
    stack.push({ indent, key })
    pending = []
  }
  return out
}

export const OFFICIAL_LINES = parse(raw)
export const OFFICIAL_KEYS = OFFICIAL_LINES.filter((l) => l.kind === 'key')
