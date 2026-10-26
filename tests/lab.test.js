import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { parse } from 'yaml'
import { inspectConfig, completeConfig, updateConfig, readConfig } from '../.vitepress/theme/lab/config-core.js'
import { previewTokens, motdConfig } from '../.vitepress/theme/lab/motd-core.js'
import { COPY } from '../.vitepress/theme/lab/copy.js'

const defaults = fs.readFileSync(new URL('../.vitepress/theme/data/solver-config.yml', import.meta.url), 'utf8')

test('bundled Solver configuration passes the actual checker', () => {
  const result = inspectConfig(defaults, defaults)
  assert.deepEqual(result.errors, [])
  assert.equal(result.missing.length, 0)
  assert.equal(result.changed.length, 0)
})

test('malformed, duplicate, multiple-document and alias YAML cannot appear valid', () => {
  for (const invalid of [defaults.replace('provider: "anthropic"', 'provider: [anthropic'), 'a: 1\na: 2', 'a: 1\n---\nb: 2', 'a: &x { b: 1 }\nc: *x', '- list\n- not-map']) {
    assert.ok(readConfig(invalid).errors.length, invalid.slice(0, 20))
  }
})

test('errors do not echo secrets from invalid YAML', () => {
  const result = readConfig('api-key: [PRIVATE_SECRET_123')
  assert.ok(result.errors.length)
  assert.ok(!JSON.stringify(result.errors).includes('PRIVATE_SECRET_123'))
})

test('types, selected bounds, enums and escalation are validated', () => {
  for (const updates of [
    { 'monitor-console': 'true' }, { 'ai-provider.provider': 'unsupported' },
    { 'chat-moderation.llm-analysis-level': 8 }, { 'analysis.timeout': -1 },
    { 'chat-moderation.buffer-size': 3.5 },
    { 'chat-moderation.action.severity-threshold-kick': 2 }
  ]) assert.ok(inspectConfig(updateConfig(defaults, updates), defaults).errors.length)
})

test('completion preserves custom keys, explicit false, credentials, comments and nested values', () => {
  const mine = '# Keep this note\nlocalization: es_ES\nmonitor-console: false\nai-provider:\n  provider: other\n  model: local-model\n  other-key: "key#with: punctuation"\ncustom-extension:\n  nested: [one, two]\n'
  const completed = completeConfig(mine, defaults)
  const data = parse(completed)
  assert.equal(data['monitor-console'], false)
  assert.equal(data['ai-provider']['other-key'], 'key#with: punctuation')
  assert.deepEqual(data['custom-extension'], { nested: ['one', 'two'] })
  assert.ok(completed.includes('# Keep this note'))
  const result = inspectConfig(completed, defaults)
  assert.equal(result.missing.length, 0)
  assert.deepEqual(result.errors, [])
  assert.ok(result.unknown.some(k => k.path === 'custom-extension'))
})

test('custom map extension points are retained and not marked unknown', () => {
  const source = updateConfig(defaults, { 'chat-moderation.action.tag-overrides': { THREAT: { type: 'tempban', duration: '7d' } } })
  const result = inspectConfig(source, defaults)
  assert.equal(result.errors.length, 0)
  assert.equal(result.unknown.length, 0)
})

test('fractional trust settings are valid and empty model names are rejected', () => {
  assert.equal(inspectConfig(updateConfig(defaults, { 'reasoning.custom.trust.own': 0.8 }), defaults).errors.length, 0)
  assert.ok(inspectConfig(updateConfig(defaults, { 'ai-provider.model': '' }), defaults).errors.length)
})

test('invalid configurations cannot be merged and oversized files are rejected', () => {
  assert.throws(() => completeConfig('monitor-console: nope', defaults))
  assert.equal(readConfig('x'.repeat(256 * 1024 + 1)).errors[0].kind, 'size')
})

test('MOTD export round-trips untrusted text without changing YAML structure', () => {
  const a = '"\nadmin: true\n<script>alert(1)</script>'
  const b = '<green>Welcome & friends: #1'
  const data = parse(motdConfig(a, b, true))
  assert.equal(data.motd.line1, a)
  assert.equal(data.motd.line2, b)
  assert.equal(data.banner.enabled, true)
  assert.equal(data.banner.file, 'banner.png')
  assert.equal(data.admin, undefined)
})

test('MOTD renderer creates safe tokens and restores nested styles', () => {
  const tokens = previewTokens('<red>A<bold>B</bold>C</red>D<script>bad</script>')
  assert.equal(tokens[0].style.color, '#ff5555')
  assert.equal(tokens[1].style.fontWeight, 'bold')
  assert.equal(tokens[2].style.fontWeight, undefined)
  assert.equal(tokens[3].style.color, undefined)
  assert.ok(tokens.some(t => t.text === '<script>'))
  assert.ok(tokens.every(t => !Object.hasOwn(t, 'html')))
  const gradient = previewTokens('<gradient:#000000:#ffffff>AB</gradient>')
  assert.equal(gradient[0].style.color, 'rgb(0,0,0)')
  assert.equal(gradient[1].style.color, 'rgb(255,255,255)')
})

test('all four locales have the same pages and complete laboratory copy', () => {
  const root = new URL('../', import.meta.url)
  const pages = locale => fs.readdirSync(new URL(`${locale}/`, root), { recursive: true }).filter(p => p.endsWith('.md')).sort()
  for (const locale of ['en', 'es', 'it', 'pt']) {
    assert.deepEqual(pages(locale), pages('en'))
    assert.deepEqual(Object.keys(COPY[locale]), Object.keys(COPY.en))
    assert.ok(Object.values(COPY[locale]).every(v => typeof v === 'string' && v.length > 0))
  }
})
