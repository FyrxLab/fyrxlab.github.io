import { reactive, watch } from 'vue'

// Document contents deliberately live only in this tab's memory, never storage.
export const createSession = () => reactive({
  config: { source: null, baseline: null, history: [], future: [], exported: null, touched: false, form: {}, formSource: null, proposal: null },
  motd: { initialized: false, line1: '', line2: '', serverName: 'FyrxCraft', image: '', template: 'survival', comparison: null, touched: false, exported: '' },
  release: null,
  checklist: []
})
export const drafts = createSession()
export const useDrafts = () => typeof window === 'undefined' ? createSession() : drafts

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
  watch(() => [drafts.motd.line1, drafts.motd.line2, drafts.motd.image], () => { if (drafts.motd.initialized) drafts.motd.touched = true }, { flush: 'sync' })
  window.addEventListener('beforeunload', event => {
    if (drafts.config.formDirty || drafts.config.proposal !== null || (drafts.config.touched && drafts.config.source !== drafts.config.exported) || (drafts.motd.touched && motdFingerprint(drafts.motd) !== drafts.motd.exported)) {
      event.preventDefault(); event.returnValue = ''
    }
  })
}
