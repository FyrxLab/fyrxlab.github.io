<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vitepress'

const COPY = {
  en: { title: 'Lost in the sky', body: 'This page drifted away like a bubble. It may have moved when the docs were reorganized, or the link has a typo.', home: 'Back to FyrxLab', hint: 'While you’re here, pop a few bubbles.', popped: (n) => `Bubbles popped: ${n}` },
  es: { title: 'Te perdiste en el cielo', body: 'Esta página se fue flotando como una burbuja. Puede que se haya movido al reorganizar la documentación o que el enlace tenga un error.', home: 'Volver a FyrxLab', hint: 'Ya que estás aquí, revienta unas burbujas.', popped: (n) => `Burbujas reventadas: ${n}` },
  it: { title: 'Ti sei perso nel cielo', body: 'Questa pagina è volata via come una bolla. Potrebbe essere stata spostata durante la riorganizzazione della documentazione, oppure il link contiene un errore.', home: 'Torna a FyrxLab', hint: 'Già che ci sei, fai scoppiare qualche bolla.', popped: (n) => `Bolle scoppiate: ${n}` },
  pt: { title: 'Você se perdeu no céu', body: 'Esta página saiu flutuando como uma bolha. Ela pode ter sido movida quando a documentação foi reorganizada, ou o link tem um erro.', home: 'Voltar para a FyrxLab', hint: 'Já que está aqui, estoure algumas bolhas.', popped: (n) => `Bolhas estouradas: ${n}` }
}

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])

// Fixed layout so SSR and client agree; a popped bubble floats back in later.
const bubbles = reactive([
  { x: 8, y: 18, s: 54 }, { x: 22, y: 64, s: 30 }, { x: 36, y: 12, s: 22 }, { x: 62, y: 70, s: 44 },
  { x: 76, y: 16, s: 36 }, { x: 88, y: 56, s: 26 }, { x: 50, y: 40, s: 18 }, { x: 14, y: 84, s: 20 }
].map((b, i) => ({ ...b, d: 7 + (i % 4) * 1.5, popped: false })))
const count = ref(0)

function pop(b) {
  if (b.popped) return
  b.popped = true
  count.value++
  setTimeout(() => (b.popped = false), 4000)
}
</script>

<template>
  <div class="nf">
    <div class="nf-sky" aria-hidden="true" />
    <button
      v-for="(b, i) in bubbles"
      :key="i"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      class="nf-bubble"
      :class="{ popped: b.popped }"
      :style="{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}px`, height: `${b.s}px`, animationDuration: `${b.d}s` }"
      @click="pop(b)"
    />
    <div class="nf-body">
      <p class="nf-code">404</p>
      <h1 class="nf-title">{{ t.title }}</h1>
      <p class="nf-text">{{ t.body }}</p>
      <a class="nf-home" :href="`/${locale}/`">{{ t.home }}</a>
      <p class="nf-hint">{{ count ? t.popped(count) : t.hint }}</p>
    </div>
  </div>
</template>

<style scoped>
.nf {
  position: relative; overflow: hidden;
  min-height: calc(100vh - var(--vp-nav-height) - 40px);
  display: grid; place-items: center;
  padding: 64px 24px;
}
.nf-sky {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(70% 60% at 50% 40%, color-mix(in srgb, var(--vp-c-brand-2) 16%, transparent), transparent 70%);
}
.nf-bubble {
  position: absolute; z-index: 1; padding: 0; border: 0; cursor: pointer; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0 8%, rgba(255, 255, 255, 0.25) 22%, rgba(120, 200, 240, 0.14) 55%, rgba(255, 255, 255, 0.5) 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 4px 16px -6px rgba(26, 163, 221, 0.45);
  animation: nf-float ease-in-out infinite alternate;
  transition: transform 0.18s ease, opacity 0.18s ease;
}
html.dark .nf-bubble { box-shadow: inset 0 0 0 1px rgba(170, 225, 255, 0.4), 0 4px 16px -6px rgba(47, 180, 238, 0.5); opacity: 0.75; }
.nf-bubble:hover { transform: scale(1.08); }
.nf-bubble.popped { transform: scale(1.6); opacity: 0; pointer-events: none; transition: transform 0.22s ease-out, opacity 0.22s ease-out; }
@keyframes nf-float { to { translate: 0 -22px; } }

.nf-body { position: relative; z-index: 2; max-width: 520px; text-align: center; display: grid; justify-items: center; gap: 14px; pointer-events: none; }
.nf-body a { pointer-events: auto; }
.nf-code {
  margin: 0; font-size: clamp(72px, 14vw, 120px); font-weight: 700; line-height: 1; letter-spacing: -0.03em;
  background: linear-gradient(180deg, #0d6fb0 0%, #1aa3dd 55%, #0b5e98 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.6)) drop-shadow(0 6px 14px rgba(6, 60, 110, 0.25));
  -webkit-box-reflect: below -14px linear-gradient(transparent 60%, rgba(255, 255, 255, 0.25));
}
html.dark .nf-code { background-image: linear-gradient(180deg, #ffffff 0%, #bfe9ff 55%, #7fd0f5 100%); }
.nf-title { margin: 12px 0 0; font-size: 28px; font-weight: 700; color: var(--vp-c-text-1); text-wrap: balance; }
.nf-text { margin: 0; color: var(--vp-c-text-2); line-height: 1.7; }
.nf-home {
  position: relative; isolation: isolate; margin-top: 8px;
  font-size: 14px; font-weight: 700; color: #fff; text-decoration: none;
  padding: 12px 22px; border-radius: 999px; border: 1px solid #065f96;
  background: linear-gradient(180deg, #7fd6fb, #1a9bd6 50%, #0877bd 50%, #1a9bd6);
  text-shadow: 0 1px 2px rgba(0, 40, 80, 0.65);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 8px 18px -8px #0877bd;
}
.nf-home::before {
  content: ''; position: absolute; z-index: -1; left: 3px; right: 3px; top: 1px; height: 46%;
  border-radius: 999px 999px 14px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.08));
}
.nf-home:hover { filter: brightness(1.08); }
.nf-home:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.nf-hint { margin: 6px 0 0; font-size: 13px; color: var(--vp-c-text-3); font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) { .nf-bubble { animation: none; } }
</style>
