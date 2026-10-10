<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'

// "Protected by AbsoluteSolver" badge for server websites and forum posts.
// The PNGs (2x, 169x44 at 1x) live in public/badges; see og.js renderBadges.
const COPY = {
  en: { alt: 'Protected by AbsoluteSolver', copy: 'Copy', copied: 'Copied' },
  es: { alt: 'Protegido por AbsoluteSolver', copy: 'Copiar', copied: 'Copiado' },
  it: { alt: 'Protetto da AbsoluteSolver', copy: 'Copia', copied: 'Copiato' },
  pt: { alt: 'Protegido por AbsoluteSolver', copy: 'Copiar', copied: 'Copiado' }
}
const FORMATS = ['HTML', 'Markdown', 'BBCode']

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])
const img = computed(() => `https://fyrx.net/badges/solver-${locale.value}.png`)
const link = computed(() => `https://fyrx.net/${locale.value}/solver/`)

const format = ref('HTML')
const snippet = computed(() => ({
  HTML: `<a href="${link.value}"><img src="${img.value}" alt="${t.value.alt}" width="169" height="44"></a>`,
  Markdown: `[![${t.value.alt}](${img.value})](${link.value})`,
  BBCode: `[url=${link.value}][img]${img.value}[/img][/url]`
})[format.value])

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  } catch { /* the snippet stays selectable */ }
}
</script>

<template>
  <div class="sb">
    <div class="sb-preview">
      <img :src="`/badges/solver-${locale}.png`" :alt="t.alt" width="169" height="44" />
    </div>
    <div class="sb-code">
      <div class="sb-tabs" role="tablist">
        <button
          v-for="f in FORMATS"
          :key="f"
          type="button"
          role="tab"
          :aria-selected="format === f"
          :class="{ on: format === f }"
          @click="format = f"
        >{{ f }}</button>
        <button type="button" class="sb-copy" @click="copy">{{ copied ? t.copied : t.copy }}</button>
      </div>
      <pre class="sb-snippet"><code>{{ snippet }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.sb { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; align-items: center; margin: 16px 0 8px; }
@media (max-width: 640px) { .sb { grid-template-columns: 1fr; } }
.sb-preview {
  display: grid; place-items: center; padding: 22px 26px; border-radius: 14px;
  background: var(--glass-bg); border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
}
.sb-preview img { display: block; }
.sb-code { min-width: 0; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-edge); box-shadow: var(--glass-shadow); }
.sb-tabs { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; padding: 6px 8px; background: linear-gradient(180deg, var(--glass-hl), transparent 70%), var(--glass-solid); border-bottom: 1px solid var(--glass-edge); }
.sb-tabs button { font-size: 12.5px; font-weight: 600; padding: 4px 11px; border-radius: 999px; color: var(--vp-c-text-2); }
.sb-tabs button.on { color: var(--vp-c-brand-1); background: color-mix(in srgb, var(--vp-c-brand-2) 14%, transparent); }
.sb-tabs .sb-copy { margin-left: auto; border: 1px solid var(--glass-edge); }
.sb-tabs button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 1px; }
.vp-doc .sb-snippet { margin: 0; padding: 14px 16px; background: var(--vp-code-block-bg); overflow-x: auto; border-radius: 0; }
.vp-doc .sb-snippet code { font-size: 12.5px; color: #cfe3f5; background: none; border: 0; padding: 0; white-space: pre-wrap; word-break: break-all; }
</style>
