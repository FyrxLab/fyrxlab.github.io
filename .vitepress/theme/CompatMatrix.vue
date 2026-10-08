<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS, PRODUCT_ORDER } from './productPalette.js'
import { fetchProjects, slugOf } from './modrinth.js'

// Product × Minecraft-version grid, read live from each Modrinth listing so
// it never needs a manual update. A cell is filled when any patch release of
// that range is listed.
const RANGES = [
  ['1.8–1.11', /^1\.(8|9|10|11)(\.|$)/],
  ['1.12', /^1\.12(\.|$)/],
  ['1.13–1.17', /^1\.1[3-7](\.|$)/],
  ['1.18', /^1\.18(\.|$)/],
  ['1.19', /^1\.19(\.|$)/],
  ['1.20', /^1\.20(\.|$)/],
  ['1.21', /^1\.21(\.|$)/],
  ['26.x', /^2\d\./]
]
const LOADER_NAMES = { fabric: 'Fabric', forge: 'Forge', neoforge: 'NeoForge', paper: 'Paper', purpur: 'Purpur', spigot: 'Spigot', bukkit: 'Bukkit', folia: 'Folia', velocity: 'Velocity', bungeecord: 'BungeeCord', waterfall: 'Waterfall' }

const COPY = {
  en: { product: 'Product', loading: 'Loading from Modrinth…', error: 'Couldn’t reach Modrinth right now. Each product page lists its versions too.', yes: 'Supported', no: 'Not supported', source: 'Live from Modrinth. FyrxAI is a Node.js library, so it isn’t tied to a Minecraft version.' },
  es: { product: 'Producto', loading: 'Cargando desde Modrinth…', error: 'No se pudo consultar Modrinth ahora mismo. Cada página de producto también lista sus versiones.', yes: 'Compatible', no: 'No compatible', source: 'En vivo desde Modrinth. FyrxAI es una librería de Node.js, así que no depende de una versión de Minecraft.' },
  it: { product: 'Prodotto', loading: 'Caricamento da Modrinth…', error: 'Modrinth non risponde in questo momento. Ogni pagina prodotto elenca anche le sue versioni.', yes: 'Supportato', no: 'Non supportato', source: 'In tempo reale da Modrinth. FyrxAI è una libreria Node.js, quindi non dipende da una versione di Minecraft.' },
  pt: { product: 'Produto', loading: 'Carregando do Modrinth…', error: 'Não foi possível consultar o Modrinth agora. Cada página de produto também lista suas versões.', yes: 'Compatível', no: 'Não compatível', source: 'Ao vivo do Modrinth. FyrxAI é uma biblioteca Node.js, então não depende de uma versão do Minecraft.' }
}

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])

const state = ref('loading')
const rows = ref([])
onMounted(async () => {
  try {
    const projects = await fetchProjects()
    rows.value = PRODUCT_ORDER.filter((k) => slugOf(k) && projects[k]).map((k) => ({
      key: k,
      ...PRODUCTS[k],
      link: `/${locale.value}${PRODUCTS[k].home}`,
      cells: RANGES.map(([, re]) => projects[k].game_versions.some((v) => re.test(v))),
      loaders: projects[k].loaders.map((l) => LOADER_NAMES[l] || l)
    }))
    state.value = 'ok'
  } catch {
    state.value = 'error'
  }
})
</script>

<template>
  <div class="cm">
    <p v-if="state === 'loading'" class="cm-msg">{{ t.loading }}</p>
    <p v-else-if="state === 'error'" class="cm-msg">{{ t.error }}</p>
    <div v-else class="cm-scroll">
      <table class="cm-table">
        <thead>
          <tr>
            <th scope="col">{{ t.product }}</th>
            <th v-for="[label] in RANGES" :key="label" scope="col" class="cm-v">{{ label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.key" :style="{ '--c': r.color }">
            <th scope="row">
              <a :href="r.link" class="cm-name">{{ r.name }}</a>
              <span class="cm-loaders">{{ r.loaders.join(' · ') }}</span>
            </th>
            <td v-for="(ok, i) in r.cells" :key="i" class="cm-v">
              <span v-if="ok" class="cm-orb" role="img" :aria-label="t.yes" />
              <span v-else class="cm-no" role="img" :aria-label="t.no">·</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="cm-source">{{ t.source }}</p>
  </div>
</template>

<style scoped>
.cm { margin: 20px 0; }
.cm-msg { color: var(--vp-c-text-2); }
.cm-scroll { overflow-x: auto; }
.vp-doc .cm-table { display: table; width: 100%; min-width: 600px; margin: 0; }
.vp-doc .cm-table th, .vp-doc .cm-table td { padding: 10px 12px; vertical-align: middle; }
.vp-doc .cm-table tbody th { font-weight: 700; background: none; min-width: 180px; }
.cm-name { text-decoration: none !important; color: var(--vp-c-text-1) !important; }
.cm-name::before {
  content: ''; display: inline-block; width: 12px; height: 12px; margin-right: 8px; border-radius: 50%; vertical-align: -1px;
  background: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 22%, transparent);
}
.cm-v { text-align: center !important; font-variant-numeric: tabular-nums; white-space: nowrap; }
.cm-orb {
  display: inline-block; width: 18px; height: 18px; border-radius: 50%;
  background:
    radial-gradient(ellipse 62% 42% at 50% 24%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
  box-shadow: 0 2px 6px -1px color-mix(in srgb, var(--c) 70%, transparent);
}
.cm-no { color: var(--vp-c-text-3); }
.cm-loaders { display: block; margin: 2px 0 0 20px; font-size: 12px; font-weight: 400; line-height: 1.45; color: var(--vp-c-text-2); }
.cm-source { margin-top: 10px; font-size: 13px; color: var(--vp-c-text-3); }
</style>
