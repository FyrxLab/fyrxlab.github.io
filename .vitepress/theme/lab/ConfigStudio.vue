<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
import { inspectConfig, readConfig, completeConfig, updateConfig, configDiff, configOffset, MAX_CONFIG_SIZE } from './config-core.js'
import { configProject, parseConfigProject } from './project-core.js'
import { useDrafts, commitConfig, undoConfig, redoConfig, currentRelease } from './session.js'
import { useServerProfile } from './profile.js'
import { downloadText } from './files.js'
import defaults from '../data/solver-config.yml?raw'
import { PRODUCTS } from '../productPalette.js'

const { t, locale, link } = useLab(), { profile } = useServerProfile()
const state = useDrafts().config, form = state.form
if (state.source === null) { state.source = defaults; state.baseline = defaults }
const message = ref(''), mode = ref('guided'), editor = ref(null), rawEditing = ref(false)
const result = computed(() => inspectConfig(state.source, defaults))
function hydrateForm() {
  if (state.formSource === state.source || !result.value.data) return
  const data = result.value.data
  const string = (value, fallback) => typeof value === 'string' ? value : fallback
  const boolean = (value, fallback) => typeof value === 'boolean' ? value : fallback
  Object.assign(form, { provider: string(data['ai-provider']?.provider, 'anthropic'), model: string(data['ai-provider']?.model, 'Sonnet'), language: string(data.localization, 'en_US'), monitor: boolean(data['monitor-console'], true), crashes: boolean(data['check-crash-on-startup'], true), chat: boolean(data['chat-moderation']?.enabled, false) })
  state.formSource = state.source
  state.proposal = null
}
watch(() => state.source, hydrateForm, { immediate: true, flush: 'sync' })
const languages = ['en_US', 'es_ES', 'pt_BR', 'ru_RU', 'de_DE', 'fr_FR', 'ja_JP', 'ko_KR', 'eo_EO']
const updates = computed(() => ({ 'ai-provider.provider': form.provider, 'ai-provider.model': form.model, localization: form.language, 'monitor-console': form.monitor, 'check-crash-on-startup': form.crashes, 'chat-moderation.enabled': form.chat }))
const dirty = computed(() => !!result.value.data && Object.entries(updates.value).some(([path, value]) => path.split('.').reduce((obj, key) => obj?.[key], result.value.data) !== value))
watch(dirty, value => state.formDirty = value, { immediate: true, flush: 'sync' })
const syntaxOK = computed(() => !readConfig(state.source).errors.length)
const proposed = computed(() => state.proposal ?? (dirty.value && syntaxOK.value ? updateConfig(state.source, updates.value) : null))
const changes = computed(() => proposed.value !== null ? configDiff(state.source, proposed.value) : configDiff(state.baseline, state.source))
const selected = computed(() => currentRelease(profile))
const compatible = computed(() => !selected.value || (selected.value.key === 'solver' && selected.value.number.replace(/^v/, '') === PRODUCTS.solver.version && !['velocity', 'bungeecord', 'waterfall'].includes(profile.platform)))
const canExport = computed(() => !result.value.errors.length && !result.value.missing.length && !dirty.value && state.proposal === null && compatible.value)
function changeProvider() { form.model = ({ anthropic: 'Sonnet', google: 'Flash', other: '' })[form.provider]; state.proposal = null }
function propose(value) { state.proposal = value; mode.value = 'review'; message.value = '' }
function preset(kind) {
  propose(updateConfig(state.source, { 'monitor-console': true, 'check-crash-on-startup': true, 'chat-moderation.enabled': kind === 'alerts', 'chat-moderation.action.mode': 'alert-only' }))
}
function apply() { if (proposed.value !== null) commitConfig(proposed.value); mode.value = 'guided' }
function discard() { state.proposal = null; state.formSource = null; hydrateForm() }
function editRaw(event) {
  if (!rawEditing.value) { state.history = [...state.history, state.source].slice(-20); rawEditing.value = true }
  state.source = event.target.value; state.future = []; state.touched = true; state.proposal = null
}
async function importFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    if (file.size > MAX_CONFIG_SIZE) throw new Error()
    const value = await file.text()
    if (file.name.endsWith('.json')) propose(updateConfig(syntaxOK.value ? state.source : defaults, parseConfigProject(value, PRODUCTS.solver.version)))
    else { commitConfig(value); state.baseline = value; mode.value = 'yaml' }
  } catch { message.value = t.value.invalidProject }
  finally { event.target.value = '' }
}
async function goTo(error) {
  mode.value = 'yaml'; await nextTick()
  const offset = error.path ? configOffset(state.source, error.path) : state.source.split('\n').slice(0, Math.max(0, (error.line || 1) - 1)).join('\n').length
  editor.value?.focus(); editor.value?.setSelectionRange(offset, offset + 1)
  if (editor.value) editor.value.scrollTop = state.source.slice(0, offset).split('\n').length * 22 - 100
}
function exportConfig() { downloadText('config.yml', state.source); state.exported = state.source }
function saveProject() { downloadText('fyrx-config-project.json', configProject(updates.value, PRODUCTS.solver.version)) }
</script>
<template>
  <LabShell tool="config">
    <header class="lab-heading"><p class="lab-kicker">ABSOLUTESOLVER / v{{ PRODUCTS.solver.version }}</p><h1>{{ t.studio }}</h1><p>{{ t.studioDesc }}</p></header>
    <p class="lab-session-note">◉ {{ t.sessionNote }}</p>
    <p v-if="!compatible" class="lab-notice"><a :href="link('setup')">{{ t.guideVersion }} →</a></p>
    <div class="lab-actions"><label class="lab-button lab-secondary lab-file">{{ t.import }}<input type="file" accept=".yml,.yaml,.json" @change="importFile" /></label><button class="lab-button lab-secondary" @click="propose(defaults)">{{ t.start }}</button><button class="lab-text-button" :disabled="!state.history.length" @click="undoConfig(); state.proposal = null">↶ {{ t.undo }}</button><button class="lab-text-button" :disabled="!state.future.length" @click="redoConfig(); state.proposal = null">↷ {{ t.redo }}</button><a class="lab-text-button" :href="link('')">{{ t.myServer }} →</a></div>
    <p v-if="message" class="lab-notice lab-error" role="alert">{{ message }}</p>
    <div class="lab-view-tabs" :aria-label="t.studio"><button v-for="tab in ['guided','yaml','review']" :key="tab" :aria-pressed="mode === tab" @click="mode = tab">{{ tab === 'guided' ? t.guided : tab === 'yaml' ? 'YAML' : t.review }}<span v-if="tab === 'review'">{{ changes.length }}</span></button></div>
    <div class="lab-workspace" :class="{ 'lab-single-column': mode !== 'guided' }">
      <aside v-if="mode === 'guided'" class="lab-panel lab-controls">
        <h2>{{ t.preset }}</h2><div class="lab-preset-buttons"><button :disabled="!syntaxOK" @click="preset('basic')">{{ t.basic }}</button><button :disabled="!syntaxOK" @click="preset('alerts')">{{ t.alerts }}</button></div><p class="lab-small">{{ t.presetNote }}</p>
        <label>{{ t.provider }}<select v-model="form.provider" @change="changeProvider"><option value="anthropic">Anthropic</option><option value="google">Google Gemini</option><option value="other">OpenAI-compatible / local</option></select></label>
        <label>{{ t.model }}<input v-model="form.model" type="text" maxlength="120" placeholder="Model ID" @input="state.proposal = null" /></label>
        <label>{{ t.language }}<select v-model="form.language" @change="state.proposal = null"><option v-for="lang in [...new Set([...languages, form.language])]" :key="lang">{{ lang }}</option></select></label>
        <label class="lab-check"><input v-model="form.monitor" type="checkbox" @change="state.proposal = null" />{{ t.monitor }}</label>
        <label class="lab-check"><input v-model="form.crashes" type="checkbox" @change="state.proposal = null" />{{ t.crashes }}</label>
        <label class="lab-check"><input v-model="form.chat" type="checkbox" @change="state.proposal = null" />{{ t.chat }}</label><p class="lab-small">{{ t.chatHint }}</p>
        <button class="lab-button" :disabled="!syntaxOK || !form.model?.trim() || proposed === null" @click="mode = 'review'">{{ t.review }} →</button><a class="lab-text-button" :href="`/${locale}/solver/configuration`">{{ t.docs }} →</a>
      </aside>
      <div class="lab-editor-stack">
        <section v-if="mode !== 'review'" class="lab-terminal"><div class="lab-terminal-bar"><label for="studio-yaml">config.yml <span> / {{ t.source }}</span></label><span class="lab-traffic" aria-hidden="true">● ● ●</span></div><textarea id="studio-yaml" ref="editor" :value="state.source" spellcheck="false" :maxlength="MAX_CONFIG_SIZE" class="lab-code-input" @focus="rawEditing = false" @input="editRaw" /></section>
        <section v-if="mode === 'review'" class="lab-panel lab-review"><h2>{{ t.review }}</h2><p>{{ proposed !== null ? t.reviewHint : t.changed }}</p><p v-if="proposed !== null && !syntaxOK" class="lab-notice">{{ t.replaceInvalid }}</p><p v-else-if="!changes.length">{{ t.noChanges }}</p><div v-else class="lab-diff-table"><table><thead><tr><th>{{ t.source }}</th><th>{{ t.before }}</th><th>{{ t.after }}</th></tr></thead><tbody><tr v-for="change in changes" :key="change.path"><th><code>{{ change.path }}</code><small>{{ t[change.kind] }}</small></th><td>{{ change.before }}</td><td>{{ change.after }}<small v-if="change.hidden">{{ t.masked }}</small></td></tr></tbody></table></div><div v-if="proposed !== null" class="lab-actions"><button class="lab-button" :disabled="!state.proposal && (!syntaxOK || !form.model?.trim())" @click="apply">{{ t.confirmChanges }} ✓</button><button class="lab-text-button" @click="discard">{{ t.discard }}</button></div></section>
        <section class="lab-panel lab-validation"><h2 :class="result.errors.length ? 'lab-danger-text' : ''">{{ result.errors.length ? t.errors : t.ready }} <span role="status">{{ result.errors.length || '✓' }}</span></h2>
          <ul v-if="result.errors.length"><li v-for="(error, i) in result.errors" :key="i"><button class="lab-error-link" :aria-label="`${t.navigateError}: ${error.path || error.line || t.source}`" @click="goTo(error)"><code v-if="error.path">{{ error.path }}: </code>{{ t[error.kind] }}<span v-if="error.line"> · {{ error.line }}</span><span v-if="error.expected"> ({{ error.expected }})</span> →</button></li></ul>
          <div class="lab-stats"><span><b>{{ result.missing.length }}</b>{{ t.missing }}</span><span><b>{{ result.changed.length }}</b>{{ t.changed }}</span><span><b>{{ result.unknown.length }}</b>{{ t.unknown }}</span></div>
          <details v-if="result.missing.length"><summary>{{ t.missing }}</summary><ul><li v-for="item in result.missing" :key="item.path"><code>{{ item.path }}</code></li></ul></details><details v-if="result.unknown.length"><summary>{{ t.unknown }}</summary><ul><li v-for="item in result.unknown" :key="item.path"><code>{{ item.path }}</code></li></ul></details>
          <p class="lab-small">{{ t.validationNote }}</p><button v-if="result.missing.length" class="lab-button lab-secondary" :disabled="!!result.errors.length" @click="propose(completeConfig(state.source, defaults))">{{ t.merge }} →</button><p class="lab-small">{{ t.migration }}</p>
        </section>
      </div>
    </div>
    <div class="lab-export"><div><b>Solver {{ PRODUCTS.solver.version }} / config.yml</b><p>{{ state.exported === state.source ? t.exportReady : proposed !== null ? t.reviewHint : t.credentials }}</p></div><button class="lab-button" :disabled="!canExport" @click="exportConfig">{{ t.download }} ↓</button></div>
    <div class="lab-project-save"><button class="lab-button lab-secondary" :disabled="!form.model?.trim() || !syntaxOK || state.proposal !== null" @click="saveProject">{{ t.saveProject }} ↓</button><p class="lab-small">{{ t.projectNote }}</p></div>
    <p class="lab-privacy"><i class="fa-solid fa-lock" aria-hidden="true" /> {{ t.configPrivacy }}</p>
  </LabShell>
</template>
