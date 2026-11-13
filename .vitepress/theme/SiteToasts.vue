<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

// On /en/ pages, a glass notice (bottom-right) offering the reader's own
// language, shown until dismissed once. Release news lives inline at the top
// of doc pages instead (ReleaseNote.vue), so it never sits over the text.
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

const lang = computed(() => {
  tick.value
  if (!mounted.value || locale.value !== 'en' || store.get('fyrx-lang-offer') === 'no') return null
  // first of the reader's languages that we have; English first means no offer
  const want = (navigator.languages || [navigator.language]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => l === 'en' || LANG[l])
  if (!want || want === 'en') return null
  return { link: route.path.replace(/^\/en\//, `/${want}/`), t: LANG[want], code: want }
})

function noLang() { store.set('fyrx-lang-offer', 'no'); tick.value++ }

onMounted(() => (mounted.value = true))
watch(() => route.path, () => tick.value++)
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <div v-if="lang" class="toast" :lang="lang.code">
      <span class="t-orb aqua" aria-hidden="true" />
      <p>{{ lang.t.ask }}</p>
      <a class="t-act" :href="lang.link" @click="noLang">{{ lang.t.go }}</a>
      <button type="button" class="t-x" :aria-label="lang.t.close" @click="noLang">×</button>
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
.toasts:empty { display: none; }
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
