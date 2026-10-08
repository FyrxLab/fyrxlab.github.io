<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS } from './productPalette.js'

const LABELS = {
  en: { modrinth: 'Download on Modrinth', github: 'View on GitHub', mc: 'Minecraft', plugin: 'Platforms', mod: 'Loaders', library: 'Runs on', latest: 'Latest', install: 'Install', copy: 'Copy', copied: 'Copied' },
  es: { modrinth: 'Descargar en Modrinth', github: 'Ver en GitHub', mc: 'Minecraft', plugin: 'Plataformas', mod: 'Loaders', library: 'Funciona con', latest: 'Última versión', install: 'Instalar', copy: 'Copiar', copied: 'Copiado' },
  it: { modrinth: 'Scarica su Modrinth', github: 'Vedi su GitHub', mc: 'Minecraft', plugin: 'Piattaforme', mod: 'Loader', library: 'Funziona con', latest: 'Ultima versione', install: 'Installa', copy: 'Copia', copied: 'Copiato' },
  pt: { modrinth: 'Baixar no Modrinth', github: 'Ver no GitHub', mc: 'Minecraft', plugin: 'Plataformas', mod: 'Loaders', library: 'Funciona com', latest: 'Última versão', install: 'Instalar', copy: 'Copiar', copied: 'Copiado' }
}

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => LABELS[locale.value])

// Only on a product's own home (/<locale>/<product>/), never on its doc pages.
const product = computed(() => {
  const m = route.path.match(/^\/(?:en|es|it|pt)\/([^/]+)\/?$/)
  const p = m && PRODUCTS[m[1]]
  return p && p.install ? p : null
})

const copied = ref(false)
async function copyCommand() {
  try {
    await navigator.clipboard.writeText(product.value.install.command)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    /* clipboard refused: the command stays selectable as text */
  }
}
</script>

<template>
  <div v-if="product" class="install-wrap">
    <section class="install-card" :style="{ '--c': product.color }" :aria-label="t.install">
      <div class="ic-id">
        <span class="ic-orb" aria-hidden="true"><i :class="['fa-solid', product.icon]" /></span>
        <div class="ic-name">
          <b>{{ product.name }}</b>
          <span v-if="product.version">
            {{ t.latest }}
            <a v-if="product.changelog" class="ic-ver" :href="`/${locale}${product.changelog}`">v{{ product.version }}</a>
            <span v-else class="ic-ver">v{{ product.version }}</span>
          </span>
        </div>
      </div>

      <dl class="ic-facts">
        <div v-if="product.install.mc">
          <dt>{{ t.mc }}</dt>
          <dd class="ic-mc">{{ product.install.mc }}</dd>
        </div>
        <div v-if="product.install.command">
          <dt>{{ t.install }}</dt>
          <dd class="ic-cmd">
            <code>{{ product.install.command }}</code>
            <button type="button" class="ic-copy" @click="copyCommand">{{ copied ? t.copied : t.copy }}</button>
          </dd>
        </div>
        <div>
          <dt>{{ t[product.kind] }}</dt>
          <dd class="ic-chips"><span v-for="p in product.install.platforms" :key="p" class="ic-chip">{{ p }}</span></dd>
        </div>
      </dl>

      <a class="ic-get" :href="product.install.url" target="_blank" rel="noopener">
        {{ product.install.url.includes('modrinth') ? t.modrinth : t.github }}
      </a>
    </section>
  </div>
</template>

<style scoped>
.install-wrap { padding: 8px 24px 0; }
@media (min-width: 640px) { .install-wrap { padding: 8px 48px 0; } }
@media (min-width: 960px) { .install-wrap { padding: 8px 64px 0; } }

.install-card {
  max-width: 1152px; margin: 0 auto;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 28px; align-items: center;
  padding: 20px 24px;
  border-radius: 18px;
  background:
    linear-gradient(160deg, color-mix(in srgb, var(--c) 12%, transparent), transparent 60%),
    var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
  backdrop-filter: blur(18px) saturate(170%);
  -webkit-backdrop-filter: blur(18px) saturate(170%);
}
@media (max-width: 860px) {
  .install-card { grid-template-columns: 1fr; gap: 18px; }
}

.ic-id { display: flex; align-items: center; gap: 14px; }
.ic-orb {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: grid; place-items: center; color: #fff; font-size: 19px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  background:
    radial-gradient(ellipse 62% 42% at 50% 22%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--c) 70%, transparent);
}
.ic-name { display: grid; gap: 2px; }
.ic-name b { font-size: 17px; color: var(--vp-c-text-1); }
.ic-name > span { font-size: 13px; color: var(--vp-c-text-2); }
.ic-ver { font-family: var(--vp-font-family-mono); font-weight: 600; color: var(--vp-c-brand-1); }

.ic-facts { margin: 0; display: grid; gap: 10px; min-width: 0; }
.ic-facts > div { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 12px; align-items: center; }
@media (max-width: 520px) { .ic-facts > div { grid-template-columns: 1fr; gap: 4px; } }
.ic-facts dt { font: 600 11px/1.4 var(--vp-font-family-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--vp-c-text-3); }
.ic-facts dd { margin: 0; min-width: 0; }
.ic-mc { font: 600 14px var(--vp-font-family-mono); color: var(--vp-c-text-1); font-variant-numeric: tabular-nums; }
.ic-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ic-chip {
  font-size: 12.5px; font-weight: 600; color: var(--vp-c-text-1);
  padding: 3px 10px; border-radius: 999px;
  border: 1px solid var(--glass-edge);
  background: linear-gradient(180deg, var(--glass-hl), transparent 60%), var(--glass-solid);
}
.ic-cmd { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ic-cmd code {
  font-size: 13px; padding: 5px 10px; border-radius: 8px; overflow-x: auto; max-width: 100%;
  background: var(--vp-code-block-bg); color: #cfe3f5;
}
.ic-copy {
  font-size: 12px; font-weight: 600; color: var(--vp-c-text-2);
  padding: 4px 11px; border-radius: 999px; border: 1px solid var(--glass-edge);
  background: linear-gradient(180deg, var(--glass-hl), transparent 60%), var(--glass-solid);
}
.ic-copy:hover { color: var(--vp-c-brand-1); }

.ic-get {
  position: relative; isolation: isolate; white-space: nowrap; justify-self: start;
  font-size: 14px; font-weight: 700; color: #fff; text-decoration: none;
  padding: 12px 22px; border-radius: 999px; border: 1px solid #065f96;
  background: linear-gradient(180deg, #7fd6fb, #1a9bd6 50%, #0877bd 50%, #1a9bd6);
  text-shadow: 0 1px 2px rgba(0, 40, 80, 0.65);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 8px 18px -8px #0877bd;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.ic-get::before {
  content: ''; position: absolute; z-index: -1; left: 3px; right: 3px; top: 1px; height: 46%;
  border-radius: 999px 999px 14px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.08));
}
.ic-get:hover { filter: brightness(1.08) saturate(1.1); transform: translateY(-1px); }
.ic-get:focus-visible, .ic-copy:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
</style>
