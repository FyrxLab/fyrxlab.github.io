<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import { parse, OFFICIAL_KEYS } from './solverConfig.js'
import { PRODUCTS } from './productPalette.js'

// Paste your config.yml, compare it with the one shipped in the current
// Solver release. Runs entirely in the browser; nothing is sent anywhere.
const COPY = {
  en: { label: 'Your config.yml', placeholder: 'Paste the contents of plugins/Solver/config.yml here…', privacy: 'Your config never leaves your browser.', missing: 'Missing options', missingHint: 'New in this version. Solver uses the default shown here until you add them.', unknown: 'Options Solver doesn’t recognize', unknownHint: 'Usually left over from an older version and safe to delete. If you added them yourself (an alias, a custom rule), keep them.', changed: 'Changed from the default', changedHint: 'Just for reference: these are your own settings.', ok: (v) => `Your config has every option of Solver ${v}.`, empty: 'That doesn’t look like a config.yml: no options found.', hidden: 'hidden', def: 'default' },
  es: { label: 'Tu config.yml', placeholder: 'Pega aquí el contenido de plugins/Solver/config.yml…', privacy: 'Tu config no sale de tu navegador.', missing: 'Opciones que te faltan', missingHint: 'Son nuevas en esta versión. Solver usa el valor por defecto que ves aquí hasta que las agregues.', unknown: 'Opciones que Solver no reconoce', unknownHint: 'Suelen quedar de una versión anterior y puedes borrarlas. Si las agregaste tú (un alias, una regla propia), déjalas.', changed: 'Cambiadas respecto al original', changedHint: 'Solo como referencia: son tus propios ajustes.', ok: (v) => `Tu config tiene todas las opciones de Solver ${v}.`, empty: 'Eso no parece un config.yml: no encontré ninguna opción.', hidden: 'oculto', def: 'por defecto' },
  it: { label: 'Il tuo config.yml', placeholder: 'Incolla qui il contenuto di plugins/Solver/config.yml…', privacy: 'Il tuo config non lascia mai il browser.', missing: 'Opzioni mancanti', missingHint: 'Nuove in questa versione. Solver usa il valore predefinito mostrato qui finché non le aggiungi.', unknown: 'Opzioni che Solver non riconosce', unknownHint: 'Di solito sono rimaste da una versione precedente e puoi eliminarle. Se le hai aggiunte tu (un alias, una regola personalizzata), lasciale.', changed: 'Modificate rispetto all’originale', changedHint: 'Solo come riferimento: sono le tue impostazioni.', ok: (v) => `Il tuo config ha tutte le opzioni di Solver ${v}.`, empty: 'Non sembra un config.yml: nessuna opzione trovata.', hidden: 'nascosto', def: 'predefinito' },
  pt: { label: 'Seu config.yml', placeholder: 'Cole aqui o conteúdo de plugins/Solver/config.yml…', privacy: 'Seu config nunca sai do seu navegador.', missing: 'Opções que faltam', missingHint: 'São novas nesta versão. O Solver usa o valor padrão mostrado aqui até você adicioná-las.', unknown: 'Opções que o Solver não reconhece', unknownHint: 'Geralmente sobraram de uma versão anterior e podem ser apagadas. Se foi você que adicionou (um alias, uma regra própria), mantenha.', changed: 'Alteradas em relação ao original', changedHint: 'Só como referência: são as suas configurações.', ok: (v) => `Seu config tem todas as opções do Solver ${v}.`, empty: 'Isso não parece um config.yml: nenhuma opção encontrada.', hidden: 'oculto', def: 'padrão' }
}
const SECRET = /key|password|token|secret|webhook/i

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])
const version = PRODUCTS.solver.version

// Section keys (ones that have children) aren't compared themselves.
const leaves = (keys) => {
  const paths = keys.map((k) => k.path)
  return keys.filter((k) => !paths.some((p) => p.startsWith(`${k.path}.`)))
}
const OFFICIAL = new Map(leaves(OFFICIAL_KEYS).map((k) => [k.path, k]))
const norm = (v) => v.replace(/^["']|["']$/g, '').trim()

const text = ref('')
const result = computed(() => {
  if (!text.value.trim()) return null
  const mine = new Map(leaves(parse(text.value).filter((l) => l.kind === 'key')).map((k) => [k.path, k]))
  if (!mine.size) return { empty: true }
  const missing = [...OFFICIAL.values()].filter((k) => !mine.has(k.path))
  const unknown = [...mine.values()].filter((k) => !OFFICIAL.has(k.path))
  const changed = [...mine.values()]
    .filter((k) => OFFICIAL.has(k.path) && norm(k.value) !== norm(OFFICIAL.get(k.path).value))
    .map((k) => ({ path: k.path, value: SECRET.test(k.path) ? null : k.value, def: OFFICIAL.get(k.path).value }))
  return { missing, unknown, changed }
})
</script>

<template>
  <section class="cc">
    <label class="cc-label" for="cc-input">{{ t.label }}</label>
    <textarea id="cc-input" v-model="text" class="cc-input" spellcheck="false" :placeholder="t.placeholder" rows="8" />
    <p class="cc-privacy">{{ t.privacy }}</p>

    <div v-if="result" class="cc-out" aria-live="polite">
      <p v-if="result.empty" class="cc-msg">{{ t.empty }}</p>
      <template v-else>
        <p v-if="!result.missing.length" class="cc-msg cc-good">{{ t.ok(version) }}</p>

        <div v-if="result.missing.length" class="cc-group cc-missing">
          <h4>{{ t.missing }} <span>{{ result.missing.length }}</span></h4>
          <p>{{ t.missingHint }}</p>
          <ul>
            <li v-for="k in result.missing" :key="k.path">
              <code>{{ k.path }}</code><span v-if="k.value" class="cc-def">{{ t.def }}: <code>{{ k.value }}</code></span>
              <small v-if="k.doc">{{ k.doc }}</small>
            </li>
          </ul>
        </div>

        <div v-if="result.unknown.length" class="cc-group cc-unknown">
          <h4>{{ t.unknown }} <span>{{ result.unknown.length }}</span></h4>
          <p>{{ t.unknownHint }}</p>
          <ul><li v-for="k in result.unknown" :key="k.path"><code>{{ k.path }}</code></li></ul>
        </div>

        <details v-if="result.changed.length" class="cc-group cc-changed">
          <summary><h4>{{ t.changed }} <span>{{ result.changed.length }}</span></h4></summary>
          <p>{{ t.changedHint }}</p>
          <ul>
            <li v-for="k in result.changed" :key="k.path">
              <code>{{ k.path }}</code>: <code>{{ k.value ?? `(${t.hidden})` }}</code>
              <span class="cc-def">{{ t.def }}: <code>{{ k.def || '""' }}</code></span>
            </li>
          </ul>
        </details>
      </template>
    </div>
  </section>
</template>

<style scoped>
.cc { margin: 16px 0 28px; display: grid; gap: 8px; }
.cc-label { font: 600 11px/1.4 var(--vp-font-family-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-text-3); }
.cc-input {
  width: 100%; min-height: 160px; resize: vertical; padding: 14px 16px; border-radius: 12px;
  font: 12.5px/1.6 var(--vp-font-family-mono); color: #cfe3f5; background: var(--vp-code-block-bg);
  border: 1px solid var(--glass-edge); box-shadow: var(--glass-shadow);
}
.cc-input::placeholder { color: #6f8aa6; }
.cc-input:focus { outline: 2px solid var(--vp-c-brand-2); outline-offset: 1px; }
.cc-privacy { margin: 0; font-size: 12.5px; color: var(--vp-c-text-3); }
.cc-out { display: grid; gap: 12px; margin-top: 6px; }
.cc-msg { margin: 0; font-size: 14.5px; color: var(--vp-c-text-2); }
.cc-good { font-weight: 600; color: var(--aero-lime); }
.cc-group {
  --c: var(--vp-c-brand-2);
  padding: 14px 16px; border-radius: 14px; border: 1px solid var(--glass-border);
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 12%, transparent), color-mix(in srgb, var(--c) 3%, transparent)), var(--glass-bg);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
}
.cc-missing { --c: #e0a100; }
.cc-unknown { --c: #8b5cf6; }
.cc-group h4 { display: inline-flex; align-items: center; gap: 8px; margin: 0; font-size: 15px; color: var(--vp-c-text-1); }
.cc-group h4 span { font: 600 12px/1 var(--vp-font-family-mono); padding: 3px 8px; border-radius: 999px; background: color-mix(in srgb, var(--c) 20%, transparent); }
.cc-group > p { margin: 4px 0 8px; font-size: 13.5px; color: var(--vp-c-text-2); }
.cc-group ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; max-height: 420px; overflow-y: auto; }
.cc-group li { margin: 0; padding: 0; font-size: 13.5px; word-break: break-word; }
.cc-group li::before, .cc-group li::after { display: none; }
.cc-group li small { display: block; margin-top: 2px; font-size: 12.5px; color: var(--vp-c-text-2); }
.cc-def { margin-left: 8px; font-size: 12.5px; color: var(--vp-c-text-3); }
.cc-changed summary { cursor: pointer; list-style: none; }
.cc-changed summary::-webkit-details-marker { display: none; }
.cc-changed summary h4::after { content: '▾'; font-size: 12px; color: var(--vp-c-text-3); }
.cc-changed[open] summary h4::after { content: '▴'; }
</style>
