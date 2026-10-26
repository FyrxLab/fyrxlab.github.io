<script setup>
import { computed, reactive, ref, watch } from 'vue'
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
import { inspectConfig, completeConfig, updateConfig, MAX_CONFIG_SIZE } from './config-core.js'
import { downloadText } from './files.js'
import defaults from '../data/solver-config.yml?raw'
import { PRODUCTS } from '../productPalette.js'

const { t, locale } = useLab()
const source = ref(defaults), previous = ref(null), message = ref('')
const result = computed(() => inspectConfig(source.value, defaults))
const form = reactive({ provider: 'anthropic', model: 'Sonnet', language: 'en_US', monitor: true, crashes: true, chat: false })
watch(() => result.value.data, data => {
  if (!data) return
  const string = (value, fallback) => typeof value === 'string' ? value : fallback
  const boolean = (value, fallback) => typeof value === 'boolean' ? value : fallback
  Object.assign(form, { provider: string(data['ai-provider']?.provider, 'anthropic'), model: string(data['ai-provider']?.model, 'Sonnet'), language: string(data.localization, 'en_US'), monitor: boolean(data['monitor-console'], true), crashes: boolean(data['check-crash-on-startup'], true), chat: boolean(data['chat-moderation']?.enabled, false) })
}, { immediate: true })
const languages = ['en_US', 'es_ES', 'pt_BR', 'ru_RU', 'de_DE', 'fr_FR', 'ja_JP', 'ko_KR', 'eo_EO']
const updates = computed(() => ({ 'ai-provider.provider': form.provider, 'ai-provider.model': form.model, localization: form.language, 'monitor-console': form.monitor, 'check-crash-on-startup': form.crashes, 'chat-moderation.enabled': form.chat }))
const dirty = computed(() => !!result.value.data && Object.entries(updates.value).some(([path, value]) => path.split('.').reduce((obj, key) => obj?.[key], result.value.data) !== value))
const canExport = computed(() => !result.value.errors.length && !result.value.missing.length && !dirty.value)
function replace(value) { previous.value = source.value; source.value = value; message.value = '' }
function changeProvider() { form.model = ({ anthropic: 'Sonnet', google: 'Flash', other: '' })[form.provider] }
function apply() {
  replace(updateConfig(source.value, updates.value))
}
async function importFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    if (file.size > MAX_CONFIG_SIZE) { message.value = t.value.size; return }
    replace(await file.text())
  } catch { message.value = t.value.fileError }
  finally { event.target.value = '' }
}
function undo() { const current = source.value; source.value = previous.value; previous.value = current }
</script>
<template>
  <LabShell tool="config">
    <header class="lab-heading"><p class="lab-kicker">ABSOLUTESOLVER / v{{ PRODUCTS.solver.version }}</p><h1>{{ t.studio }}</h1><p>{{ t.studioDesc }}</p></header>
    <div class="lab-actions"><label class="lab-button lab-secondary lab-file">{{ t.import }}<input type="file" accept=".yml,.yaml,text/yaml" @change="importFile" /></label><button class="lab-button lab-secondary" @click="replace(defaults)">{{ t.start }}</button><button v-if="previous !== null" class="lab-text-button" @click="undo">↶ {{ t.undo }}</button></div>
    <p v-if="message" class="lab-notice lab-error" role="alert">{{ message }}</p>
    <div class="lab-workspace">
      <aside class="lab-panel lab-controls">
        <h2>{{ t.environment }}</h2>
        <label>{{ t.provider }}<select v-model="form.provider" @change="changeProvider"><option value="anthropic">Anthropic</option><option value="google">Google Gemini</option><option value="other">OpenAI-compatible / local</option></select></label>
        <label>{{ t.model }}<input v-model="form.model" type="text" maxlength="120" placeholder="Model ID" /></label>
        <label>{{ t.language }}<select v-model="form.language"><option v-for="lang in [...new Set([...languages, form.language])]" :key="lang">{{ lang }}</option></select></label>
        <label class="lab-check"><input v-model="form.monitor" type="checkbox" />{{ t.monitor }}</label>
        <label class="lab-check"><input v-model="form.crashes" type="checkbox" />{{ t.crashes }}</label>
        <label class="lab-check"><input v-model="form.chat" type="checkbox" />{{ t.chat }}</label><p class="lab-small">{{ t.chatHint }}</p>
        <button class="lab-button" :disabled="!!result.errors.length || !form.model.trim()" @click="apply">{{ t.apply }}</button>
        <a class="lab-text-button" :href="`/${locale}/solver/configuration`">{{ t.docs }} →</a>
      </aside>
      <div class="lab-editor-stack">
        <section class="lab-terminal"><div class="lab-terminal-bar"><label for="studio-yaml">config.yml <span> / {{ t.source }}</span></label><span class="lab-traffic" aria-hidden="true">● ● ●</span></div><textarea id="studio-yaml" v-model="source" spellcheck="false" :maxlength="MAX_CONFIG_SIZE" class="lab-code-input" /></section>
        <section class="lab-panel lab-validation" aria-live="polite">
          <h2 :class="result.errors.length ? 'lab-danger-text' : ''">{{ result.errors.length ? t.errors : t.ready }} <span>{{ result.errors.length || '✓' }}</span></h2>
          <ul v-if="result.errors.length"><li v-for="(error, i) in result.errors" :key="i"><code v-if="error.path">{{ error.path }}: </code>{{ t[error.kind] }}<span v-if="error.line"> · {{ error.line }}</span><span v-if="error.expected"> ({{ error.expected }})</span></li></ul>
          <div class="lab-stats"><span><b>{{ result.missing.length }}</b>{{ t.missing }}</span><span><b>{{ result.changed.length }}</b>{{ t.changed }}</span><span><b>{{ result.unknown.length }}</b>{{ t.unknown }}</span></div>
          <details v-if="result.missing.length"><summary>{{ t.missing }}</summary><ul><li v-for="item in result.missing" :key="item.path"><code>{{ item.path }}</code></li></ul></details>
          <details v-if="result.changed.length"><summary>{{ t.changed }}</summary><ul><li v-for="item in result.changed" :key="item.path"><code>{{ item.path }}</code></li></ul></details>
          <details v-if="result.unknown.length"><summary>{{ t.unknown }}</summary><ul><li v-for="item in result.unknown" :key="item.path"><code>{{ item.path }}</code></li></ul></details>
          <p class="lab-small">{{ t.validationNote }}</p>
          <button v-if="result.missing.length" class="lab-button lab-secondary" :disabled="!!result.errors.length" @click="replace(completeConfig(source, defaults))">{{ t.merge }}</button>
          <p class="lab-small">{{ t.migration }}</p>
        </section>
        <div class="lab-export"><div><b>Solver {{ PRODUCTS.solver.version }} / config.yml</b><p>{{ dirty ? t.apply : t.credentials }}</p></div><button class="lab-button" :disabled="!canExport" @click="downloadText('config.yml', source)">{{ t.download }} ↓</button></div>
      </div>
    </div>
    <p class="lab-privacy"><i class="fa-solid fa-lock" aria-hidden="true" /> {{ t.configPrivacy }}</p>
  </LabShell>
</template>
