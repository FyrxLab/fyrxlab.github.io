import { parseDocument, isMap, LineCounter } from 'yaml'

export const MAX_CONFIG_SIZE = 256 * 1024
const type = value => Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const enums = {
  'ai-provider.provider': ['anthropic', 'google', 'other'],
  'chat-moderation.scan-mode': ['bulk', 'individual'],
  'chat-moderation.action.mode': ['alert-only', 'warn-player', 'auto-action']
}
const bounds = {
  'error-cooldown-minutes': [0, Infinity], 'analysis.timeout': [1, Infinity],
  'analysis.reports-retention-days': [0, Infinity],
  'chat-moderation.llm-analysis-level': [0, 3],
  'chat-moderation.buffer-size': [1, Infinity],
  'chat-moderation.analysis-interval-seconds': [1, Infinity],
  'chat-moderation.action.severity-threshold-mute': [1, 5],
  'chat-moderation.action.severity-threshold-kick': [1, 5],
  'chat-moderation.action.min-confidence-to-act-alone': [0, 100],
  'chat-moderation.pre-filter.trigger-on-caps-ratio': [0, 1],
  'chat-moderation.pre-filter.urgent-score-threshold': [0, 1]
}

export function readConfig(source) {
  if (source.length > MAX_CONFIG_SIZE) return { errors: [{ kind: 'size' }] }
  try {
    const lineCounter = new LineCounter()
    const doc = parseDocument(source, { uniqueKeys: true, strict: true, lineCounter })
    // Never echo parser messages: a YAML error can contain an API key.
    const errors = [...doc.errors, ...doc.warnings].map(e => ({ kind: 'syntax', line: e.linePos?.[0]?.line, code: e.code }))
    if (!isMap(doc.contents)) errors.push({ kind: 'root' })
    if (errors.length) return { errors }
    const data = doc.toJS({ maxAliasCount: 0 })
    return { doc, data, errors: [] }
  } catch { return { errors: [{ kind: 'syntax' }] } }
}

export function inspectConfig(source, defaults) {
  const parsed = readConfig(source)
  const result = { ...parsed, missing: [], unknown: [], changed: [] }
  if (parsed.errors.length) return result
  const baseline = readConfig(defaults)
  if (baseline.errors.length) throw new Error('Invalid bundled Solver defaults')
  function compare(expected, actual, path = []) {
    for (const [key, value] of Object.entries(expected)) {
      const parts = [...path, key], name = parts.join('.')
      if (!Object.hasOwn(actual, key)) { result.missing.push({ path: name, parts }); continue }
      const mine = actual[key]
      if (type(value) !== type(mine)) { result.errors.push({ kind: 'type', path: name, expected: type(value) }); continue }
      if (object(value) && Object.keys(value).length) compare(value, mine, parts)
      else if (JSON.stringify(value) !== JSON.stringify(mine)) result.changed.push({ path: name, parts })
      if (enums[name] && !enums[name].includes(mine)) result.errors.push({ kind: 'enum', path: name, expected: enums[name].join(' / ') })
      if (bounds[name] && (!Number.isFinite(mine) || mine < bounds[name][0] || mine > bounds[name][1])) result.errors.push({ kind: 'range', path: name, expected: bounds[name].join(' … ') })
      if (bounds[name] && Number.isInteger(value) && typeof mine === 'number' && !Number.isInteger(mine)) result.errors.push({ kind: 'integer', path: name })
      if (name === 'ai-provider.model' && typeof mine === 'string' && !mine.trim()) result.errors.push({ kind: 'type', path: name, expected: 'non-empty string' })
    }
    // Empty default maps are extension points (e.g. custom moderation tags).
    if (Object.keys(expected).length) for (const key of Object.keys(actual)) {
      if (!Object.hasOwn(expected, key)) result.unknown.push({ path: [...path, key].join('.') })
    }
  }
  compare(baseline.data, parsed.data)
  const action = parsed.data['chat-moderation']?.action
  if (action && action['severity-threshold-kick'] < action['severity-threshold-mute']) result.errors.push({ kind: 'threshold', path: 'chat-moderation.action' })
  return result
}

export function completeConfig(source, defaults) {
  const result = inspectConfig(source, defaults)
  if (result.errors.length) throw new Error('Fix configuration errors before merging')
  const base = readConfig(defaults).doc
  for (const item of result.missing) result.doc.setIn(item.parts, base.getIn(item.parts, true).clone())
  return result.doc.toString()
}

export function updateConfig(source, updates) {
  const result = readConfig(source)
  if (result.errors.length) throw new Error('Invalid YAML')
  for (const [path, value] of Object.entries(updates)) result.doc.setIn(path.split('.'), value)
  return result.doc.toString()
}

export function configOffset(source, path) {
  const parsed = readConfig(source)
  return parsed.doc?.getIn(path.split('.'), true)?.range?.[0] || 0
}

// Values in reviews may include credentials, even in custom keys or URLs.
const sensitive = /key|secret|token|password|credential|webhook|endpoint|url|host|address|user/i
export function configDiff(before, after) {
  const a = readConfig(before), b = readConfig(after)
  if (a.errors.length || b.errors.length) return []
  const rows = []
  function walk(left, right, path = []) {
    if (JSON.stringify(left) === JSON.stringify(right)) return
    if (object(left) && object(right)) {
      for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) walk(left[key], right[key], [...path, key])
      return
    }
    const name = path.join('.')
    // Custom fields are hidden as well; the review must never echo a secret.
    const safeValue = value => value === undefined ? '—' : sensitive.test(name) ? '••••••' : typeof value === 'number' || typeof value === 'boolean' ? String(value) : '••••••'
    const publicStrings = ['localization', 'ai-provider.provider', 'chat-moderation.scan-mode', 'chat-moderation.action.mode']
    const display = value => publicStrings.includes(name) && typeof value === 'string' && !sensitive.test(name) ? value : safeValue(value)
    rows.push({ path: name, before: display(left), after: display(right), kind: left === undefined ? 'added' : right === undefined ? 'removed' : 'modified', hidden: sensitive.test(name) || ([left, right].some(v => typeof v === 'string') && !publicStrings.includes(name)) })
  }
  walk(a.data, b.data)
  return rows
}
