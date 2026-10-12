<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vitepress'

// Shown once when a reader arrives from the old docs.jeamcube.com address,
// which redirects to fyrx.net/en/?old_domain=true. Closing it drops the
// parameter from the URL so a reload or a shared link doesn't repeat it.
const T = {
  en: {
    badge: 'We’ve moved',
    title: 'Jeamcube Docs is now Fyrx.net',
    body: 'Same documentation, new home. Everything you were reading is here, and it keeps getting updated.',
    list: ['Your old links keep redirecting here', 'Update your bookmarks to fyrx.net', 'Nothing changes in your plugins or mods'],
    go: 'Got it, take me to the docs',
    close: 'Close'
  },
  es: {
    badge: 'Nos hemos mudado',
    title: 'Jeamcube Docs ahora es Fyrx.net',
    body: 'La misma documentación, una casa nueva. Todo lo que leías está aquí y se sigue actualizando.',
    list: ['Tus enlaces antiguos siguen redirigiendo aquí', 'Actualiza tus marcadores a fyrx.net', 'No cambia nada en tus plugins ni mods'],
    go: 'Entendido, llévame a la documentación',
    close: 'Cerrar'
  },
  it: {
    badge: 'Ci siamo trasferiti',
    title: 'Jeamcube Docs ora è Fyrx.net',
    body: 'La stessa documentazione, una nuova casa. Tutto ciò che leggevi è qui e continua ad aggiornarsi.',
    list: ['I vecchi link continuano a reindirizzare qui', 'Aggiorna i segnalibri a fyrx.net', 'Nei tuoi plugin e mod non cambia nulla'],
    go: 'Ho capito, portami alla documentazione',
    close: 'Chiudi'
  },
  pt: {
    badge: 'Nós nos mudamos',
    title: 'Jeamcube Docs agora é Fyrx.net',
    body: 'A mesma documentação, uma casa nova. Tudo o que você lia está aqui e continua sendo atualizado.',
    list: ['Seus links antigos continuam redirecionando para cá', 'Atualize seus favoritos para fyrx.net', 'Nada muda nos seus plugins ou mods'],
    go: 'Entendi, levar à documentação',
    close: 'Fechar'
  }
}

const route = useRoute()
const open = ref(false)
const btn = ref(null)
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => T[locale.value])

function close() {
  open.value = false
  const url = new URL(location.href)
  url.searchParams.delete('old_domain')
  history.replaceState(history.state, '', url)
}
function onKey(e) { if (e.key === 'Escape') close() }

onMounted(() => {
  if (new URLSearchParams(location.search).get('old_domain') !== 'true') return
  open.value = true
  document.addEventListener('keydown', onKey)
  nextTick(() => btn.value?.focus())
})
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="open" class="moved-backdrop" @click.self="close">
    <div class="moved" role="dialog" aria-modal="true" aria-labelledby="moved-title" :lang="locale">
      <button type="button" class="m-x" :aria-label="t.close" @click="close">×</button>
      <span class="m-orb" aria-hidden="true" />
      <p class="m-badge">{{ t.badge }}</p>
      <h2 id="moved-title">{{ t.title }}</h2>
      <p class="m-body">{{ t.body }}</p>
      <ul>
        <li v-for="item in t.list" :key="item">{{ item }}</li>
      </ul>
      <button ref="btn" type="button" class="m-go" @click="close">{{ t.go }}</button>
    </div>
  </div>
</template>

<style scoped>
.moved-backdrop {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px;
  background: radial-gradient(ellipse at 50% 30%, rgba(120, 200, 255, 0.35), rgba(6, 30, 54, 0.55));
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  animation: m-fade 0.3s ease both;
}
.moved {
  --c: #1aa3dd;
  position: relative; overflow: hidden; width: min(440px, 100%); padding: 30px 28px 24px; border-radius: 22px;
  text-align: center;
  background: var(--glass-bg), var(--vp-c-bg-elv);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), 0 30px 60px -20px rgba(6, 48, 79, 0.65);
  backdrop-filter: blur(22px) saturate(170%); -webkit-backdrop-filter: blur(22px) saturate(170%);
  animation: m-in 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
/* the classic Aero gloss: a pale half-ellipse across the top */
.moved::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 46%; pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.08));
  border-radius: 22px 22px 60% 60% / 22px 22px 28px 28px;
}
.moved > * { position: relative; }
.m-orb {
  display: block; width: 58px; height: 58px; margin: 0 auto 12px; border-radius: 50%;
  background:
    radial-gradient(ellipse 62% 42% at 50% 24%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
  box-shadow: 0 8px 18px -4px color-mix(in srgb, var(--c) 70%, transparent);
}
.m-badge { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-brand-1); }
h2 { margin: 4px 0 8px; border: 0; padding: 0; font-size: 24px; line-height: 1.25; color: var(--vp-c-text-1); }
.m-body { margin: 0 0 14px; font-size: 15px; line-height: 1.5; color: var(--vp-c-text-2); }
ul { margin: 0 0 20px; padding: 0; list-style: none; display: grid; gap: 6px; text-align: left; }
li { padding-left: 24px; font-size: 14px; color: var(--vp-c-text-1); position: relative; }
li::before { content: '✓'; position: absolute; left: 4px; font-weight: 700; color: var(--aero-lime, #4a9a12); }
.m-go {
  width: 100%; padding: 11px 16px; border-radius: 999px; font-size: 15px; font-weight: 600; color: #fff;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0) 51%),
    linear-gradient(180deg, color-mix(in srgb, var(--c) 80%, white), var(--c) 55%, color-mix(in srgb, var(--c) 70%, black));
  border: 1px solid color-mix(in srgb, var(--c) 70%, black);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 6px 14px -5px color-mix(in srgb, var(--c) 80%, transparent);
  cursor: pointer; transition: filter 0.15s;
}
.m-go:hover { filter: brightness(1.08); }
.m-x {
  position: absolute; top: 10px; right: 10px; z-index: 1; width: 30px; height: 30px; border-radius: 50%;
  font-size: 20px; line-height: 1; color: var(--vp-c-text-2); background: transparent; cursor: pointer;
}
.m-x:hover { background: color-mix(in srgb, var(--vp-c-text-1) 8%, transparent); color: var(--vp-c-text-1); }
.m-go:focus-visible, .m-x:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
@keyframes m-fade { from { opacity: 0; } }
@keyframes m-in { from { opacity: 0; transform: translateY(18px) scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .moved, .moved-backdrop { animation: none; } }
</style>
