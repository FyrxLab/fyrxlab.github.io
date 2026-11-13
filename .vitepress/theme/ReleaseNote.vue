<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS } from './productPalette.js'

// "<Product> vX is out" as a slim line at the top of a product's doc pages,
// once per release. Inline, so it pushes the page down instead of covering it.
const COPY = {
  en: { out: 'is out', more: 'What’s new →', close: 'Dismiss' },
  es: { out: 'ya disponible', more: 'Ver novedades →', close: 'Cerrar' },
  it: { out: 'è disponibile', more: 'Novità →', close: 'Chiudi' },
  pt: { out: 'já disponível', more: 'Ver novidades →', close: 'Fechar' }
}
const store = {
  get: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch { /* private mode: show again next time */ } }
}

const route = useRoute()
const mounted = ref(false)
const tick = ref(0)
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')

const release = computed(() => {
  tick.value
  if (!mounted.value) return null
  const key = route.path.match(/^\/(?:en|es|it|pt)\/([^/]+)/)?.[1]
  const p = PRODUCTS[key]
  if (!p?.version || !p.changelog || route.path.endsWith('/changelog')) return null
  if (store.get(`fyrx-seen-${key}`) === p.version) return null
  return { key, name: p.name, version: p.version, color: p.color, link: `/${locale.value}${p.changelog}`, t: COPY[locale.value] }
})

function seen() { store.set(`fyrx-seen-${release.value.key}`, release.value.version); tick.value++ }

onMounted(() => (mounted.value = true))
watch(() => route.path, () => tick.value++)
</script>

<template>
  <div v-if="release" class="release-note" role="status" :style="{ '--c': release.color }">
    <span class="rn-orb" aria-hidden="true" />
    <p><b>{{ release.name }} v{{ release.version }}</b> {{ release.t.out }}</p>
    <a :href="release.link" @click="seen">{{ release.t.more }}</a>
    <button type="button" :aria-label="release.t.close" @click="seen">×</button>
  </div>
</template>

<style scoped>
.release-note {
  --c: #1aa3dd;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  margin: 0 0 20px; padding: 8px 8px 8px 12px; border-radius: 12px;
  background: color-mix(in srgb, var(--c) 9%, var(--vp-c-bg));
  border: 1px solid color-mix(in srgb, var(--c) 35%, var(--glass-border));
  box-shadow: inset 0 1px 0 var(--glass-hl);
}
.rn-orb {
  width: 16px; height: 16px; flex: none; border-radius: 50%;
  background:
    radial-gradient(ellipse 62% 42% at 50% 24%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
}
.release-note p { margin: 0; font-size: 14px; line-height: 1.4; color: var(--vp-c-text-1); }
.release-note a { font-size: 13.5px; font-weight: 600; color: var(--vp-c-brand-1); text-decoration: none; }
.release-note a:hover { text-decoration: underline; text-underline-offset: 3px; }
.release-note button {
  margin-left: auto; width: 28px; height: 28px; border-radius: 50%;
  font-size: 18px; line-height: 1; color: var(--vp-c-text-2); background: transparent;
}
.release-note button:hover { background: color-mix(in srgb, var(--vp-c-text-1) 8%, transparent); color: var(--vp-c-text-1); }
.release-note a:focus-visible, .release-note button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
</style>
