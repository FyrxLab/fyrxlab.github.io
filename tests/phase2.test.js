import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import loader from '../.vitepress/theme/navigation.data.js'
import { navigationContext, cleanPath } from '../.vitepress/theme/navigation-core.js'
import { PHASE2_COPY } from '../.vitepress/theme/lab/phase2-copy.js'
import { configDiff, configOffset, inspectConfig, readConfig, updateConfig } from '../.vitepress/theme/lab/config-core.js'
import { configProject, parseConfigProject, motdProject, parseMotdProject, formatSelection } from '../.vitepress/theme/lab/project-core.js'
import { createSession, drafts, currentRelease, selectRelease, commitConfig, undoConfig, redoConfig, useDrafts, parseJourney } from '../.vitepress/theme/lab/session.js'
import { motdTemplates } from '../.vitepress/theme/lab/motd-templates.js'
import vm from 'node:vm'
import { outlineGuard } from '../.vitepress/outline-guard.js'

test('a queued VitePress outline callback is safe after leaving the documentation', () => {
  const file = path.resolve('node_modules/vitepress/dist/client/theme-default/composables/outline.js')
  const transformed = outlineGuard().transform(fs.readFileSync(file, 'utf8'), file).code
  const callbacks = {}
  const container = { value: { querySelector: () => null } }, marker = { value: { style: {} } }
  const context = {
    onMounted: fn => callbacks.mount = fn, onUpdated: fn => callbacks.update = fn, onUnmounted: () => {},
    useAside: () => ({ isAsideEnabled: { value: true } }), throttleAndDebounce: fn => fn,
    requestAnimationFrame: fn => callbacks.frame = fn, getScrollOffset: () => 0,
    window: { addEventListener() {}, removeEventListener() {}, scrollY: 0, innerHeight: 800 },
    document: { body: { offsetHeight: 1200 } }, location: { hash: '' }, container, marker
  }
  vm.runInNewContext(transformed.replace(/^import .*;$/gm, '').replace(/^export /gm, '') + '\nuseActiveAnchor(container, marker);', context)
  callbacks.mount()
  callbacks.frame()
  assert.equal(marker.value.style.opacity, '0')
  container.value = null; marker.value = null
  assert.doesNotThrow(() => callbacks.frame())
  assert.doesNotThrow(() => callbacks.update())
})

const defaults = fs.readFileSync('.vitepress/theme/data/solver-config.yml','utf8')
const preferences = { 'ai-provider.provider': 'anthropic', 'ai-provider.model': 'Sonnet', localization:'es_ES', 'monitor-console':false, 'check-crash-on-startup':true, 'chat-moderation.enabled':false }
test('configuration projects only export allowed preferences and validate version and types', () => {
  const text = configProject({ ...preferences, 'anthropic-key':'PRIVATE_TEST_SECRET', custom:'private' }, '0.10.2')
  assert.ok(!text.includes('PRIVATE_TEST_SECRET'))
  assert.ok(!text.includes('custom'))
  assert.deepEqual(parseConfigProject(text,'0.10.2'),preferences)
  assert.throws(() => parseConfigProject(text,'99.0'))
  assert.throws(() => parseConfigProject(text.replace('false','"false"'),'0.10.2'))
})
test('review exposes changed settings while hiding secret values of any type', () => {
  const a = 'monitor-console: true\npassword: 12345\ncustom: secret-one\nlocalization: en_US\n'
  const b = 'monitor-console: false\npassword: 98765\ncustom: secret-two\nlocalization: es_ES\n'
  const diff = configDiff(a,b), text = JSON.stringify(diff)
  assert.equal(diff.find(x=>x.path==='monitor-console').after,'false')
  assert.equal(diff.find(x=>x.path==='localization').after,'es_ES')
  for (const secret of ['12345','98765','secret-one','secret-two']) assert.ok(!text.includes(secret))
})
test('semantic errors can be repaired using guided updates; syntax errors have line positions', () => {
  const invalid = updateConfig(defaults, { 'ai-provider.model': [], 'monitor-console':'yes' })
  assert.ok(inspectConfig(invalid,defaults).errors.length)
  const fixed = updateConfig(invalid, { 'ai-provider.model':'Sonnet','monitor-console':false })
  assert.equal(inspectConfig(fixed,defaults).errors.length,0)
  assert.ok(configOffset(fixed,'ai-provider.model') > 0)
  assert.equal(readConfig('a: true\nb: [').errors[0].line,2)
})
test('release selection is bound to exact environment, product, and goal', () => {
  const profile = { minecraft:'1.21.1',platform:'paper',goal:'diagnostics',product:'solver' }
  selectRelease(profile,'solver',{ number:'0.10.2',file:'solver.jar',page:'https://modrinth.com/plugin/solver/version/x' })
  assert.equal(currentRelease(profile).number,'0.10.2')
  assert.equal(currentRelease({...profile,minecraft:'1.20.1'}),null)
  assert.equal(currentRelease({...profile,platform:'fabric'}),null)
  assert.equal(currentRelease({...profile,product:'solvermotd'}),null)
  drafts.release = null
})
test('bounded edit history supports undo/redo and SSR sessions stay isolated', () => {
  Object.assign(drafts.config, createSession().config)
  commitConfig('a: 1'); commitConfig('a: 2'); commitConfig('a: 3')
  undoConfig(); assert.equal(drafts.config.source,'a: 2')
  redoConfig(); assert.equal(drafts.config.source,'a: 3')
  for (let i=0;i<30;i++) commitConfig(`a: ${i}`)
  assert.equal(drafts.config.history.length,20)
  assert.notEqual(useDrafts(),useDrafts())
  assert.equal(useDrafts().config.source,null)
})
test('MOTD projects and snippets round trip only text; selection formatting preserves surrounding content', () => {
  const state = {line1:'<red>Hello</red>',line2:'World',serverName:'My server',image:'blob:private-image'}
  assert.deepEqual(parseMotdProject(motdProject(state)),{line1:state.line1,line2:state.line2,serverName:state.serverName})
  assert.ok(!motdProject(state).includes('blob:'))
  assert.equal(parseMotdProject('motd:\n  line1: One\n  line2: Two').line2,'Two')
  assert.throws(()=>parseMotdProject('motd:\n  line1: []\n  line2: Two'))
  assert.equal(formatSelection('Hello world!',6,11,'<bold>','</bold>'),'Hello <bold>world</bold>!')
  assert.equal(formatSelection('Hello',0,0,'<red>','</red>'),'<red>Hello</red>')
  assert.equal(formatSelection('x'.repeat(4000),0,0,'<red>','</red>').length,4000)
})
test('navigation includes every product subpage, localized templates and complete interface copy', () => {
  const files = ['en','es','it','pt'].flatMap(locale=>fs.readdirSync(locale,{recursive:true}).filter(f=>f.endsWith('.md')).map(f=>path.resolve(locale,f)))
  const pages = loader.load(files)
  const context = navigationContext(pages,'/es/solver/configuration.html#moderacion-de-chat')
  assert.equal(context.current.title,'Configuración')
  assert.equal(context.product,'solver')
  assert.equal(context.siblings.length,files.filter(f=>f.includes(`${path.sep}es${path.sep}solver${path.sep}`)&&!f.endsWith(`${path.sep}index.md`)).length)
  assert.equal(cleanPath('/es/solver/'),cleanPath('/es/solver/index.html'))
  for (const locale of ['en','es','it','pt']) {
    assert.deepEqual(Object.keys(PHASE2_COPY[locale]),Object.keys(PHASE2_COPY.en))
    assert.ok(Object.values(PHASE2_COPY[locale]).every(Boolean))
    assert.notEqual(motdTemplates(locale).survival[1],undefined)
  }
  assert.match(motdTemplates('es').survival[1],/aventura/)
})
test('stored journey only accepts Modrinth links and known products', () => {
  const release = { key: 'solver', number: '0.10.2', file: 'solver.jar', page: 'https://modrinth.com/plugin/solver/version/x', environment: 'e', dependencies: [{ name: 'Vault', url: null }] }
  assert.equal(parseJourney(JSON.stringify({ release, checklist: [0, 2, 2, 9] })).release.key, 'solver')
  assert.deepEqual(parseJourney(JSON.stringify({ release, checklist: [0, 2, 2, 9] })).checklist, [0, 2])
  assert.equal(parseJourney(JSON.stringify({ release: { ...release, page: 'https://cdn.example.test/a.jar' }, checklist: [] })).release, null)
  assert.equal(parseJourney(JSON.stringify({ release: { ...release, key: 'nope' }, checklist: [] })).release, null)
  assert.equal(parseJourney(JSON.stringify({ release: { ...release, dependencies: [{ name: 'x', url: 'https://evil.test' }] }, checklist: [] })).release, null)
  assert.equal(parseJourney('null'), null)
})
