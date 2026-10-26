<script setup>
import { computed, ref, nextTick, onMounted } from 'vue'
import LabShell from './LabShell.vue'
import MotdPreview from './MotdPreview.vue'
import { useLab } from './useLab.js'
import { previewTokens, motdConfig } from './motd-core.js'
import { motdTemplates } from './motd-templates.js'
import { formatSelection, motdProject, parseMotdProject } from './project-core.js'
import { useDrafts, motdFingerprint } from './session.js'
import { downloadText } from './files.js'

const { t, locale, link } = useLab(), state = useDrafts().motd
if (!state.initialized) {
  ;[state.line1, state.line2] = motdTemplates(locale.value).survival
  state.initialized = true; state.touched = false
}
const error = ref(''), active = ref(0), selection = ref([0,0]), inputs = ref([]), color = ref('#55ffff'), endColor = ref('#a78bfa')
const config = computed(() => motdConfig(state.line1, state.line2, !!state.image))
onMounted(() => {
  const style = new URLSearchParams(window.location.search).get('style')
  if (!state.touched && Object.hasOwn(motdTemplates(locale.value), style)) styleTemplate(style)
})
const unsupported = computed(() => [state.line1,state.line2].some(line => previewTokens(line).some(token => /<[^>]*>|%[^%]+%/.test(token.text))))
function styleTemplate(key) { state.template = key; [state.line1, state.line2] = motdTemplates(locale.value)[key] }
function remember(event, i) { active.value = i; selection.value = [event.target.selectionStart, event.target.selectionEnd] }
async function format(tag, close = tag) {
  const field = active.value === 0 ? 'line1' : 'line2', text = state[field]
  const [start, end] = selection.value
  const opening = `<${tag}>`, closing = `</${close}>`
  state[field] = formatSelection(text, start, end, opening, closing)
  await nextTick(); inputs.value[active.value]?.focus()
  const from = (start === end ? 0 : start) + opening.length, to = (start === end ? text.length : end) + opening.length
  inputs.value[active.value]?.setSelectionRange(from, to); selection.value = [from,to]
}
function plain() { const field = active.value === 0 ? 'line1' : 'line2'; state[field] = previewTokens(state[field]).map(token => token.text).join(''); selection.value = [0,0] }
function clearImage() { state.uploadRevision = (state.uploadRevision || 0) + 1; if (state.image) URL.revokeObjectURL(state.image); state.image = '' }
async function loadImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  clearImage(); error.value = ''; const revision = state.uploadRevision
  let url = ''
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error()
    const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer())
    if ([137, 80, 78, 71, 13, 10, 26, 10].some((b, i) => signature[i] !== b)) throw new Error()
    url = URL.createObjectURL(file)
    const img = new Image()
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url })
    if (img.naturalWidth !== 264 || img.naturalHeight !== 16) throw new Error()
    if (revision !== state.uploadRevision) { URL.revokeObjectURL(url); return }
    state.image = url
  } catch { if (url) URL.revokeObjectURL(url); if (revision === state.uploadRevision) error.value = t.value.badBanner }
  finally { event.target.value = '' }
}
async function importProject(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    if (file.size > 64000) throw new Error()
    Object.assign(state, parseMotdProject(await file.text())); error.value = ''; selection.value = [0,0]
  } catch { error.value = t.value.invalidProject }
  finally { event.target.value = '' }
}
function keep() { state.comparison = { line1: state.line1, line2: state.line2, name: state.serverName } }
function restore() { state.line1 = state.comparison.line1; state.line2 = state.comparison.line2; state.serverName = state.comparison.name }
function exportMotd() { downloadText('solvermotd-snippet.yml', config.value); state.exported = motdFingerprint(state) }
</script>
<template>
  <LabShell tool="motd">
    <header class="lab-heading"><p class="lab-kicker">SOLVERMOTD / DESIGN STUDIO</p><h1>{{ t.motd }}</h1><p>{{ t.motdDesc }}</p></header>
    <p class="lab-session-note">◉ {{ t.sessionNote }}</p>
    <div class="lab-actions"><label class="lab-button lab-secondary lab-file">{{ t.import }}<input type="file" accept=".json,.yml,.yaml" @change="importProject" /></label><button class="lab-button lab-secondary" @click="downloadText('fyrx-motd-project.json', motdProject(state))">{{ t.saveProject }} ↓</button><button class="lab-text-button" @click="keep">{{ t.keepVariant }} +</button><a class="lab-text-button" :href="link('')">{{ t.myServer }} ↗</a></div>
    <p v-if="error" class="lab-notice lab-error" role="alert">{{ error }}</p>
    <div class="motd-template-gallery" :aria-label="t.template"><button v-for="(lines,key) in motdTemplates(locale)" :key="key" :aria-pressed="state.template === key" @click="styleTemplate(key)"><span class="motd-template-swatch" :class="key" aria-hidden="true" /><b>{{ t[key] }}</b><span>↗</span></button></div>
    <div class="lab-workspace">
      <section class="lab-panel lab-controls">
        <label>{{ t.serverName }}<input v-model="state.serverName" maxlength="60" /></label><p class="lab-small">{{ t.serverNameHint }}</p>
        <label v-for="(field,i) in ['line1','line2']" :key="field">{{ t[field] }}<textarea :ref="el => inputs[i] = el" v-model="state[field]" maxlength="4000" rows="3" spellcheck="false" @focus="remember($event,i)" @select="remember($event,i)" @keyup="remember($event,i)" @mouseup="remember($event,i)" /></label>
        <div class="motd-toolbar"><h2>{{ t.format }} · {{ active + 1 }}</h2><div class="motd-format-buttons"><button @mousedown.prevent @click="format('bold')"><b>B</b><span class="lab-sr-only">{{ t.bold }}</span></button><button @mousedown.prevent @click="format('italic')"><i>I</i><span class="lab-sr-only">{{ t.italic }}</span></button><button @mousedown.prevent @click="plain">{{ t.clearFormat }}</button></div><div class="motd-colors"><input v-model="color" type="color" :aria-label="t.color" /><button @mousedown.prevent @click="format(color)">{{ t.color }}</button><input v-model="endColor" type="color" :aria-label="`${t.gradient} 2`" /><button @mousedown.prevent @click="format(`gradient:${color}:${endColor}`, 'gradient')">{{ t.gradient }}</button></div><p class="lab-small">{{ t.formatHint }}</p></div>
        <h2>{{ t.banner }}</h2><label class="lab-button lab-secondary lab-file">{{ t.upload }}<input type="file" accept="image/png" @change="loadImage" /></label><p class="lab-small">{{ t.bannerHint }}</p><button v-if="state.image" class="lab-text-button" @click="clearImage">{{ t.remove }}</button>
      </section>
      <div class="lab-editor-stack">
        <section class="lab-panel lab-motd-preview"><h2>{{ t.livePreview }}</h2><MotdPreview :line1="state.line1" :line2="state.line2" :name="state.serverName" :banner="state.image" :label="t.modern" /><MotdPreview :line1="state.line1" :line2="state.line2" :name="state.serverName" :label="t.legacy" /><p v-if="unsupported" class="lab-notice">{{ t.unsupported }}</p><p class="lab-small">{{ t.motdNote }}</p></section>
        <section v-if="state.comparison" class="lab-panel"><h2>{{ t.compare }}</h2><MotdPreview v-bind="state.comparison" /><button class="lab-text-button" @click="restore">{{ t.restoreVariant }} ↶</button></section>
        <section class="lab-terminal"><div class="lab-terminal-bar"><span>{{ t.snippet }} / YAML</span></div><pre class="lab-log">{{ config }}</pre></section>
        <div class="lab-panel"><p>{{ t.motdSteps }}</p><div class="lab-actions"><button class="lab-button" @click="exportMotd">{{ t.exportMotd }} ↓</button><a v-if="state.image" :href="state.image" download="banner.png" class="lab-button lab-secondary">banner.png ↓</a><a class="lab-text-button" :href="`/${locale}/solvermotd/features/banner`">{{ t.docs }} ↗</a></div><p class="lab-small">{{ t.imageProjectHint }}</p></div>
      </div>
    </div>
  </LabShell>
</template>
