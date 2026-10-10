<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

// On changelog pages: "I have vX installed" hides that release and every
// older one, so only what changed since then is left on the page. Reads the
// release cards config.js already wraps in <section class="cl-release">.
const COPY = {
  en: { have: 'I have installed', all: 'Show every release', hint: 'Pick your version to see only what changed after it.', since: (n, v) => `${n} ${n === 1 ? 'new release' : 'new releases'} since ${v}`, latest: (v) => `${v} is the latest. You’re up to date.` },
  es: { have: 'Tengo instalada', all: 'Ver todas las versiones', hint: 'Elige tu versión para ver solo lo que cambió después.', since: (n, v) => `${n} ${n === 1 ? 'versión nueva' : 'versiones nuevas'} desde ${v}`, latest: (v) => `${v} es la última. Estás al día.` },
  it: { have: 'Ho installato', all: 'Mostra tutte le versioni', hint: 'Scegli la tua versione per vedere solo cosa è cambiato dopo.', since: (n, v) => `${n} ${n === 1 ? 'nuova versione' : 'nuove versioni'} dalla ${v}`, latest: (v) => `${v} è l’ultima. Sei aggiornato.` },
  pt: { have: 'Tenho instalada', all: 'Ver todas as versões', hint: 'Escolha sua versão para ver só o que mudou depois dela.', since: (n, v) => `${n} ${n === 1 ? 'versão nova' : 'versões novas'} desde a ${v}`, latest: (v) => `${v} é a mais recente. Você está em dia.` }
}

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])

const releases = ref([]) // [{ label, el }] newest first, as on the page
const picked = ref('')

function scan() {
  picked.value = ''
  releases.value = route.path.endsWith('/changelog')
    ? [...document.querySelectorAll('.vp-doc .cl-release')].map((el) => ({
        el,
        label: (el.querySelector('h2')?.textContent || '').replace(/[​#]/g, '').trim()
      }))
    : []
}

// short "v0.8.0" for the sentence, full heading in the dropdown
const short = (label) => label.split(/\s+[—–-]\s+/)[0]

function apply() {
  const i = picked.value === '' ? -1 : Number(picked.value)
  releases.value.forEach((r, j) => (r.el.hidden = i >= 0 && j >= i))
}

onMounted(scan)
watch(() => route.path, () => nextTick(scan))
watch(picked, apply)
</script>

<template>
  <div v-if="releases.length >= 3" class="since">
    <label class="since-pick">
      <span>{{ t.have }}</span>
      <select v-model="picked">
        <option value="">—</option>
        <option v-for="(r, i) in releases" :key="i" :value="String(i)">{{ r.label }}</option>
      </select>
    </label>
    <p class="since-msg" aria-live="polite">
      <template v-if="picked === ''">{{ t.hint }}</template>
      <template v-else-if="picked === '0'">{{ t.latest(short(releases[0].label)) }}</template>
      <template v-else>{{ t.since(Number(picked), short(releases[Number(picked)].label)) }}</template>
    </p>
    <button v-if="picked !== ''" type="button" class="since-all" @click="picked = ''">{{ t.all }}</button>
  </div>
</template>

<style scoped>
.since {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px;
  margin: 0 0 24px; padding: 12px 16px; border-radius: 14px;
  background: var(--glass-bg); border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
}
.since-pick { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; min-width: 0; max-width: 100%; }
.since-pick span { font: 600 11px/1.4 var(--vp-font-family-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-text-3); }
.since-pick select {
  max-width: min(320px, 100%); padding: 6px 10px; border-radius: 10px; font-size: 14px;
  color: var(--vp-c-text-1); border: 1px solid var(--glass-edge); background: var(--vp-c-bg-elv); appearance: auto;
}
.since-msg { flex: 1 1 220px; margin: 0; font-size: 14px; color: var(--vp-c-text-2); }
.since-all {
  font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1);
  padding: 5px 12px; border-radius: 999px; border: 1px solid var(--glass-edge);
  background: linear-gradient(180deg, var(--glass-hl), transparent 60%), var(--glass-solid);
}
.since-pick select:focus-visible, .since-all:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
</style>
