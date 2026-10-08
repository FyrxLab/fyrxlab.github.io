<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import raw from './data/solver-config.yml?raw'
import { PRODUCTS } from './productPalette.js'

// data/solver-config.yml is the config.yml shipped in the released Solver
// jar. Refresh it on each release from the Solver repo's release commit:
//   git -C ../Solver show <release-commit>:src/main/resources/config.yml > .vitepress/theme/data/solver-config.yml
// The comment lines right above a key are that key's explanation.

const COPY = {
  en: { search: 'Search options (e.g. api key, antivpn, discord)', hint: 'Click any option to see what it does.', path: 'Path', def: 'Default', copy: 'Copy path', copied: 'Copied', nodoc: 'The file has no comment for this option; see the reference below.', matches: (n) => (n === 1 ? '1 option' : `${n} options`), none: 'No option matches.', note: (v) => `The config.yml shipped with Solver ${v}. Its comments are in English, like the file itself.` },
  es: { search: 'Buscar opciones (p. ej. api key, antivpn, discord)', hint: 'Pulsa cualquier opción para ver qué hace.', path: 'Ruta', def: 'Por defecto', copy: 'Copiar ruta', copied: 'Copiado', nodoc: 'El archivo no trae comentario para esta opción; mira la referencia de abajo.', matches: (n) => (n === 1 ? '1 opción' : `${n} opciones`), none: 'Ninguna opción coincide.', note: (v) => `El config.yml que trae Solver ${v}. Los comentarios están en inglés, como en el propio archivo.` },
  it: { search: 'Cerca opzioni (es. api key, antivpn, discord)', hint: 'Clicca un’opzione per vedere cosa fa.', path: 'Percorso', def: 'Predefinito', copy: 'Copia percorso', copied: 'Copiato', nodoc: 'Il file non ha un commento per questa opzione; vedi il riferimento qui sotto.', matches: (n) => (n === 1 ? '1 opzione' : `${n} opzioni`), none: 'Nessuna opzione corrisponde.', note: (v) => `Il config.yml incluso in Solver ${v}. I commenti sono in inglese, come nel file.` },
  pt: { search: 'Buscar opções (ex.: api key, antivpn, discord)', hint: 'Clique em qualquer opção para ver o que ela faz.', path: 'Caminho', def: 'Padrão', copy: 'Copiar caminho', copied: 'Copiado', nodoc: 'O arquivo não tem comentário para esta opção; veja a referência abaixo.', matches: (n) => (n === 1 ? '1 opção' : `${n} opções`), none: 'Nenhuma opção corresponde.', note: (v) => `O config.yml que vem no Solver ${v}. Os comentários estão em inglês, como no próprio arquivo.` }
}

function parse(text) {
  const out = []
  const stack = []
  let pending = []
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) { out.push({ kind: 'blank' }); pending = []; continue }
    const c = line.match(/^(\s*)#\s?(.*)$/)
    if (c) { out.push({ kind: 'comment', indent: c[1].length, text: c[2] }); pending.push(c[2]); continue }
    const k = line.match(/^(\s*)([\w.\-"']+):\s*(.*)$/)
    if (!k) { out.push({ kind: 'other', indent: line.match(/^\s*/)[0].length, text: line.trim() }); pending = []; continue }
    const indent = k[1].length
    const key = k[2].replace(/["']/g, '')
    while (stack.length && stack.at(-1).indent >= indent) stack.pop()
    // split an inline "# comment" off the value, ignoring '#' inside quotes
    const v = k[3].match(/^((?:"[^"]*"|'[^']*'|[^#])*?)\s*(?:#\s?(.*))?$/)
    const value = (v?.[1] ?? k[3]).trim()
    const doc = [...pending, v?.[2]].filter(Boolean).join(' ')
    out.push({ kind: 'key', indent, key, value, doc, path: [...stack.map((s) => s.key), key].join('.') })
    stack.push({ indent, key })
    pending = []
  }
  return out
}

const LINES = parse(raw)
const KEYS = LINES.filter((l) => l.kind === 'key')

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])

const query = ref('')
const selected = ref(KEYS[0])
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return null
  const words = q.split(/\s+/)
  return KEYS.filter((k) => words.every((w) => `${k.path} ${k.doc}`.toLowerCase().includes(w)))
})

const copied = ref(false)
async function copyPath() {
  try {
    await navigator.clipboard.writeText(selected.value.path)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  } catch { /* path stays selectable */ }
}
</script>

<template>
  <section class="cx">
    <div class="cx-bar">
      <input v-model="query" type="search" class="cx-search" :placeholder="t.search" :aria-label="t.search" />
      <span class="cx-count" aria-live="polite">{{ matches ? (matches.length ? t.matches(matches.length) : t.none) : t.hint }}</span>
    </div>

    <div class="cx-grid">
      <div class="cx-screen" tabindex="-1">
        <template v-if="!matches">
          <template v-for="(l, i) in LINES" :key="i">
            <div v-if="l.kind === 'blank'" class="cx-blank" />
            <div v-else-if="l.kind === 'comment'" class="cx-line cx-c" :style="{ paddingLeft: `${l.indent + 1}ch` }"># {{ l.text }}</div>
            <div v-else-if="l.kind === 'other'" class="cx-line cx-o" :style="{ paddingLeft: `${l.indent + 1}ch` }">{{ l.text }}</div>
            <button
              v-else
              type="button"
              class="cx-line cx-k"
              :class="{ on: selected === l }"
              :style="{ paddingLeft: `${l.indent + 1}ch` }"
              @click="selected = l"
            ><span class="cx-key">{{ l.key }}</span>:<span v-if="l.value" class="cx-val">&nbsp;{{ l.value }}</span></button>
          </template>
        </template>
        <template v-else>
          <button
            v-for="l in matches"
            :key="l.path"
            type="button"
            class="cx-line cx-k"
            :class="{ on: selected === l }"
            @click="selected = l"
          ><span class="cx-key">{{ l.path }}</span>:<span v-if="l.value" class="cx-val">&nbsp;{{ l.value }}</span></button>
        </template>
      </div>

      <aside class="cx-panel" aria-live="polite">
        <span class="cx-label">{{ t.path }}</span>
        <div class="cx-path">
          <code>{{ selected.path }}</code>
          <button type="button" class="cx-copy" @click="copyPath">{{ copied ? t.copied : t.copy }}</button>
        </div>
        <template v-if="selected.value">
          <span class="cx-label">{{ t.def }}</span>
          <code class="cx-default">{{ selected.value }}</code>
        </template>
        <p class="cx-doc">{{ selected.doc || t.nodoc }}</p>
      </aside>
    </div>
    <p class="cx-note">{{ t.note(PRODUCTS.solver.version) }}</p>
  </section>
</template>

<style scoped>
.cx { margin: 16px 0 28px; }
.cx-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin-bottom: 10px; }
.cx-search {
  flex: 1 1 280px; min-width: 0; padding: 9px 16px; border-radius: 999px; font-size: 14px;
  color: var(--vp-c-text-1); border: 1px solid var(--glass-border);
  background: linear-gradient(180deg, var(--glass-hl), transparent 70%), var(--glass-solid);
  box-shadow: inset 0 1px 2px rgba(6, 48, 79, 0.12);
}
.cx-search:focus { outline: 2px solid var(--vp-c-brand-2); outline-offset: 1px; }
.cx-count { font-size: 13px; color: var(--vp-c-text-2); }

.cx-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 860px) { .cx-grid { grid-template-columns: 1fr; } }

.cx-screen {
  max-height: 520px; overflow: auto; padding: 12px 0;
  border-radius: 12px; background: var(--vp-code-block-bg); border: 1px solid var(--glass-edge);
  box-shadow: var(--glass-shadow), inset 0 0 30px rgba(30, 120, 200, 0.1);
  font: 12.5px/1.7 var(--vp-font-family-mono);
}
@media (max-width: 860px) { .cx-screen { max-height: 360px; } }
.cx-line { display: block; width: 100%; padding-right: 12px; text-align: left; white-space: pre-wrap; word-break: break-word; border: 0; background: none; font: inherit; }
.cx-blank { height: 0.85em; }
.cx-c { color: #6f8aa6; }
.cx-o { color: #cfe3f5; }
.cx-k { color: #cfe3f5; cursor: pointer; border-left: 2px solid transparent; }
.cx-k:hover { background: rgba(127, 211, 255, 0.07); }
.cx-k.on { background: rgba(127, 211, 255, 0.14); border-left-color: #4fc3f7; }
.cx-k:focus-visible { outline: 1px solid #4fc3f7; outline-offset: -1px; }
.cx-key { color: #7fd3ff; }
.cx-val { color: #9ee07a; }

.cx-panel {
  position: sticky; top: calc(var(--vp-nav-height) + 16px);
  display: grid; gap: 6px; padding: 16px 18px; border-radius: 14px;
  background: var(--glass-bg); border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
}
.cx-label { font: 600 11px/1.4 var(--vp-font-family-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-text-3); margin-top: 4px; }
.cx-path { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.cx-path code, .cx-default { font-size: 13px; word-break: break-all; }
.cx-copy {
  font-size: 12px; font-weight: 600; color: var(--vp-c-text-2);
  padding: 3px 10px; border-radius: 999px; border: 1px solid var(--glass-edge);
  background: linear-gradient(180deg, var(--glass-hl), transparent 60%), var(--glass-solid);
}
.cx-copy:hover { color: var(--vp-c-brand-1); }
.cx-doc { margin: 8px 0 0; font-size: 14px; line-height: 1.65; color: var(--vp-c-text-1); }
.cx-note { margin: 8px 0 0; font-size: 12.5px; color: var(--vp-c-text-3); }
</style>
