import { reactive, watch } from 'vue'
import { PRODUCTS } from '../productPalette.js'

// Document contents deliberately live only in this tab's memory, never storage.
export const createSession = () => reactive({
  config: { source: null, baseline: null, history: [], future: [], exported: null, touched: false, form: {}, formSource: null, proposal: null },
  motd: { initialized: false, line1: '', line2: '', serverName: 'FyrxCraft', image: '', template: 'survival', comparison: null, touched: false, exported: '' },
  release: null,
  checklist: []
})
export const drafts = createSession()
export const useDrafts = () => typeof window === 'undefined' ? createSession() : drafts

// The chosen release and checklist hold only public Modrinth metadata, so they may persist on this device.
const JOURNEY_KEY = 'fyrx-server-journey'
let journeyReady = false
const modrinth = value => typeof value === 'string' && value.length < 300 && value.startsWith('https://modrinth.com/')
export function parseJourney(text) {
  const saved = JSON.parse(text), r = saved?.release
  if (!saved || !Array.isArray(saved.checklist)) return null
  const checklist = [...new Set(saved.checklist.filter(i => Number.isInteger(i) && i >= 0 && i < 4))]
  const valid = r && PRODUCTS[r.key] && [r.number, r.file, r.environment].every(v => typeof v === 'string' && v.length < 200) && modrinth(r.page) &&
    Array.isArray(r.dependencies) && r.dependencies.length < 20 && r.dependencies.every(d => typeof d.name === 'string' && d.name.length < 200 && (d.url === null || modrinth(d.url)))
  return { checklist, release: valid ? { key: r.key, number: r.number, file: r.file, page: r.page, environment: r.environment, dependencies: r.dependencies.map(d => ({ name: d.name, url: d.url })), dependencyError: r.dependencyError === true } : null }
}
export function restoreJourney() {
  try {
    const saved = parseJourney(localStorage.getItem(JOURNEY_KEY) || 'null')
    if (saved) { drafts.release = saved.release; drafts.checklist = saved.checklist }
  } catch { /* Storage is optional. */ }
  journeyReady = true
}
export const environmentKey = profile => `${profile.minecraft}|${profile.platform}|${profile.goal}|${profile.product || ''}`
export const motdFingerprint = state => JSON.stringify([state.line1, state.line2, state.image])
export function selectRelease(profile, key, release, dependencies = [], dependencyError = false) {
  drafts.release = { key, ...release, dependencies, dependencyError, environment: environmentKey(profile) }
  drafts.checklist = []
}
export function currentRelease(profile) {
  return drafts.release?.environment === environmentKey(profile) ? drafts.release : null
}
export function commitConfig(source) {
  const state = drafts.config
  if (source === state.source) return
  if (state.source !== null) state.history = [...state.history, state.source].slice(-20)
  state.source = source; state.future = []; state.touched = true; state.proposal = null
}
export function undoConfig() {
  const state = drafts.config
  if (!state.history.length) return
  state.future = [...state.future, state.source].slice(-20)
  state.source = state.history.pop()
}
export function redoConfig() {
  const state = drafts.config
  if (!state.future.length) return
  state.history = [...state.history, state.source].slice(-20)
  state.source = state.future.pop()
}
if (typeof window !== 'undefined') {
  watch(() => [drafts.release, drafts.checklist], () => {
    if (!journeyReady) return
    try { localStorage.setItem(JOURNEY_KEY, JSON.stringify({ release: drafts.release, checklist: drafts.checklist })) } catch { /* Private browsing. */ }
  }, { flush: 'sync', deep: true })
  watch(() => [drafts.motd.line1, drafts.motd.line2, drafts.motd.image], () => { if (drafts.motd.initialized) drafts.motd.touched = true }, { flush: 'sync' })
  window.addEventListener('beforeunload', event => {
    if (drafts.config.formDirty || drafts.config.proposal !== null || (drafts.config.touched && drafts.config.source !== drafts.config.exported) || (drafts.motd.touched && motdFingerprint(drafts.motd) !== drafts.motd.exported)) {
      event.preventDefault(); event.returnValue = ''
    }
  })
}
