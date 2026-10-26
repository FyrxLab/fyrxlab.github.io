<script setup>
import { computed, ref } from 'vue'
import { PRODUCTS } from '../productPalette.js'
import { useServerProfile } from './profile.js'
import { drafts, currentRelease, motdFingerprint } from './session.js'
import { useLab } from './useLab.js'
import { downloadText } from './files.js'
const { t, locale, link } = useLab(), { profile } = useServerProfile()
const selected = computed(() => currentRelease(profile))
const planOpen = ref(false)
const product = computed(() => PRODUCTS[selected.value?.key])
const studio = computed(() => selected.value?.key === 'solver' && selected.value.number.replace(/^v/, '') === PRODUCTS.solver.version && !['velocity','bungeecord','waterfall','fabric','forge','neoforge'].includes(profile.platform) ? 'config' : selected.value?.key === 'solvermotd' ? 'motd' : '')
const guide = computed(() => selected.value ? `/${locale.value}${product.value.home}` : link('setup'))
const exported = computed(() => studio.value === 'config' ? !!drafts.config.exported && drafts.config.exported === drafts.config.source : studio.value === 'motd' ? drafts.motd.exported === motdFingerprint(drafts.motd) : false)
const steps = computed(() => [
  { text: t.value.environment, url: link('setup'), done: !!selected.value },
  { text: t.value.chooseRelease, url: link('setup'), done: !!selected.value },
  { text: t.value.configure, url: studio.value ? link(studio.value) : guide.value, done: studio.value ? exported.value : !!selected.value && drafts.checklist.includes(2) },
  { text: t.value.installation, url: '#installation-plan', done: drafts.checklist.length === 4 }
])
const checks = ['backupStep', 'dependenciesStep', 'filesStep', 'verifyStep']
function plan() {
  const r = selected.value
  const text = `${t.value.installation}\n${product.value.name} ${r.number}\nMinecraft ${profile.minecraft} · ${profile.platform}\n\n${r.file}\n${r.url}\n\n${t.value.dependencies}\n${r.dependencies.map(dep => `${dep.name}: ${dep.url || ''}`).join('\n')}\n\n${checks.map((key, i) => `${i + 1}. ${t.value[key]}`).join('\n')}\n\n${t.value.docs}: https://fyrx.net${guide.value}\n${t.value.checklistNote}\n`
  downloadText('fyrx-installation.txt', text)
}
</script>
<template>
  <section class="journey-panel" :aria-label="t.myServer">
    <div class="journey-header"><div><p class="lab-kicker">{{ t.myServer }} / {{ profile.platform }} · {{ profile.minecraft }}</p><h2>{{ selected ? `${product.name} ${selected.number}` : t.journeyTitle }}</h2><p>{{ selected ? selected.file : t.journeyIntro }}</p></div><a class="lab-button" :href="selected && studio ? link(studio) : link('setup')">{{ selected ? t.continue : t.chooseRelease }} →</a></div>
    <nav class="journey-steps" :aria-label="t.continue"><a v-for="(step, i) in steps" :key="i" :href="step.url" @click="i === 3 && (planOpen = true)"><span class="journey-step-number" :class="{ complete: step.done }">{{ step.done ? '✓' : `0${i + 1}` }}</span><b>{{ step.text }}</b><small>{{ step.done ? t.completed : t.pending }} ↗</small></a></nav>
    <div v-if="selected" class="journey-details"><a :href="selected.url">{{ t.download }} {{ selected.file }} ↓</a><a :href="guide">{{ t.docs }} ↗</a><a v-for="dep in selected.dependencies" :key="dep.name" :href="dep.url || selected.page" target="_blank" rel="noopener">{{ dep.name }} ↗</a><p v-if="selected.dependencyError" class="lab-notice">{{ t.offline }}</p></div>
    <p v-if="selected && !studio" class="lab-small">{{ t.guideVersion }}</p>
    <details id="installation-plan" class="journey-plan" :open="planOpen" @toggle="planOpen = $event.target.open"><summary>{{ t.installation }} <span>↓</span></summary><p class="lab-small">{{ t.checklistNote }}</p><template v-if="selected"><label v-for="(key, i) in checks" :key="key"><input v-model="drafts.checklist" type="checkbox" :value="i" />{{ t[key] }}</label><button class="lab-text-button" @click="plan">{{ t.downloadPlan }} ↓</button></template><a v-else :href="link('setup')">{{ t.selectionHint }} →</a></details>
  </section>
</template>
