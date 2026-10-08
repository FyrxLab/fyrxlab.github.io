<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS } from './productPalette.js'

// Two small glass notices, bottom-right, each shown until dismissed once:
// - "<Product> vX is out" on a product's pages, once per release
// - on /en/ pages, an offer to switch to the reader's own language
const RELEASE = {
  en: { out: 'is out', more: 'What’s new →', close: 'Dismiss' },
  es: { out: 'ya disponible', more: 'Ver novedades →', close: 'Cerrar' },
  it: { out: 'è disponibile', more: 'Novità →', close: 'Chiudi' },
  pt: { out: 'já disponível', more: 'Ver novidades →', close: 'Fechar' }
}
const LANG = {
  es: { ask: '¿Prefieres leer esto en español?', go: 'Cambiar a español', close: 'Cerrar' },
  it: { ask: 'Preferisci leggere in italiano?', go: 'Passa all’italiano', close: 'Chiudi' },
  pt: { ask: 'Prefere ler em português?', go: 'Mudar para português', close: 'Fechar' }
}

const store = {
  get: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch { /* private mode: show again next time */ } }
}

const route = useRoute()
const mounted = ref(false)
const tick = ref(0) // bumped on dismiss so the computeds re-read storage
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')

const release = computed(() => {
  tick.value
  if (!mounted.value) return null
  const key = route.path.match(/^\/(?:en|es|it|pt)\/([^/]+)/)?.[1]
  const p = PRODUCTS[key]
  if (!p?.version || !p.changelog || route.path.endsWith('/changelog')) return null
  if (store.get(`fyrx-seen-${key}`) === p.version) return null
  return { key, name: p.name, version: p.version, color: p.color, link: `/${locale.value}${p.changelog}`, t: RELEASE[locale.value] }
})

const lang = computed(() => {
  tick.value
  if (!mounted.value || locale.value !== 'en' || store.get('fyrx-lang-offer') === 'no') return null
  // first of the reader's languages that we have; English first means no offer
  const want = (navigator.languages || [navigator.language]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => l === 'en' || LANG[l])
  if (!want || want === 'en') return null
  return { link: route.path.replace(/^\/en\//, `/${want}/`), t: LANG[want], code: want }
})

function seeRelease() { store.set(`fyrx-seen-${release.value.key}`, release.value.version); tick.value++ }
function noLang() { store.set('fyrx-lang-offer', 'no'); tick.value++ }

onMounted(() => (mounted.value = true))
watch(() => route.path, () => tick.value++)
</script>

<template>
  <div v-if="release || lang" class="toasts">
    <div v-if="lang" class="toast" :lang="lang.code">
      <span class="t-orb aqua" aria-hidden="true" />
      <p>{{ lang.t.ask }}</p>
      <a class="t-act" :href="lang.link" @click="noLang">{{ lang.t.go }}</a>
      <button type="button" class="t-x" :aria-label="lang.t.close" @click="noLang">×</button>
    </div>
    <div v-if="release" class="toast" :style="{ '--c': release.color }">
      <span class="t-orb" aria-hidden="true" />
      <p><b>{{ release.name }} v{{ release.version }}</b> {{ release.t.out }}</p>
      <a class="t-act" :href="release.link" @click="seeRelease">{{ release.t.more }}</a>
      <button type="button" class="t-x" :aria-label="release.t.close" @click="seeRelease">×</button>
    </div>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed; z-index: 40; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  display: grid; gap: 10px; max-width: min(380px, calc(100vw - 32px));
}
.toast {
  --c: #1aa3dd;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: 'orb text x' 'orb act x';
  gap: 4px 12px; align-items: center; padding: 12px 12px 12px 14px; border-radius: 16px;
  background: var(--glass-bg), var(--vp-c-bg-elv);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), 0 20px 40px -18px rgba(6, 48, 79, 0.55);
  backdrop-filter: blur(18px) saturate(170%); -webkit-backdrop-filter: blur(18px) saturate(170%);
  animation: toast-in 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
@keyframes toast-in { from { opacity: 0; transform: translateY(16px) scale(0.97); } }
.t-orb {
  grid-area: orb; width: 26px; height: 26px; border-radius: 50%;
  background:
    radial-gradient(ellipse 62% 42% at 50% 24%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
  box-shadow: 0 3px 8px -2px color-mix(in srgb, var(--c) 70%, transparent);
}
.t-orb.aqua { --c: #1aa3dd; }
.toast p { grid-area: text; margin: 0; font-size: 14px; line-height: 1.4; color: var(--vp-c-text-1); }
.t-act { grid-area: act; justify-self: start; font-size: 13.5px; font-weight: 600; color: var(--vp-c-brand-1); }
.t-x {
  grid-area: x; align-self: start; width: 26px; height: 26px; border-radius: 50%;
  font-size: 18px; line-height: 1; color: var(--vp-c-text-2); background: transparent;
}
.t-x:hover { background: color-mix(in srgb, var(--vp-c-text-1) 8%, transparent); color: var(--vp-c-text-1); }
.t-x:focus-visible, .t-act:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
</style>
