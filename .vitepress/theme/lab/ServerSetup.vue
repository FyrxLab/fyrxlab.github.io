<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
import { useServerProfile, PLATFORMS, GOALS } from './profile.js'
import { PRODUCTS } from '../productPalette.js'
import { fetchProjects, fetchBestVersion, resolveDependencies } from '../modrinth.js'

const { t, locale, link } = useLab()
const { profile, reset } = useServerProfile()
const projects = ref({}), results = ref([]), state = ref('idle')
const versions = computed(() => [...new Set([profile.minecraft, ...Object.values(projects.value).flatMap(p => p.game_versions || [])])].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })))
const modLoader = computed(() => ['fabric', 'forge', 'neoforge'].includes(profile.platform))
const proxy = computed(() => ['velocity', 'bungeecord', 'waterfall'].includes(profile.platform))
const candidates = computed(() => profile.goal === 'mods' ? ['furnace', 'phos', 'noteblock', 'lazymod'] : profile.goal === 'motd' ? ['solvermotd'] : ['solver'])
const mismatch = computed(() => (profile.goal === 'mods') !== modLoader.value)
let revision = 0
watch(profile, () => { revision++; state.value = 'idle'; results.value = [] })
onMounted(async () => { try { projects.value = await fetchProjects() } catch { /* Manual versions remain usable. */ } })
async function find() {
  const requestId = ++revision
  const selection = { ...profile }
  state.value = 'loading'; results.value = []
  const resolved = await Promise.all(candidates.value.map(async key => {
    try {
      const release = await fetchBestVersion(key, selection.minecraft, selection.platform)
      let dependencies = [], dependencyError = false
      if (release?.dependencies.length) {
        try { dependencies = await resolveDependencies(release.dependencies) } catch { dependencyError = true }
      }
      return { key, product: PRODUCTS[key], release, dependencies, dependencyError }
    } catch { return { key, product: PRODUCTS[key], error: true } }
  }))
  if (requestId !== revision) return
  results.value = resolved; state.value = 'done'
}
</script>
<template>
  <LabShell tool="setup">
    <header class="lab-heading"><p class="lab-kicker">01 / {{ t.environment }}</p><h1>{{ t.prepare }}</h1><p>{{ t.prepareDesc }}</p></header>
    <div class="lab-workspace">
      <section class="lab-panel lab-controls">
        <h2>{{ t.environment }}</h2>
        <label>{{ t.minecraft }}<input v-model.trim="profile.minecraft" list="mc-versions" maxlength="40" placeholder="1.21.1" /><datalist id="mc-versions"><option v-for="version in versions" :key="version" :value="version" /></datalist></label>
        <label>{{ t.platform }}<select v-model="profile.platform"><option v-for="platform in PLATFORMS" :key="platform" :value="platform">{{ platform }}</option></select></label>
        <label>{{ t.goal }}<select v-model="profile.goal"><option v-for="goal in GOALS" :key="goal" :value="goal">{{ t[goal === 'motd' ? 'customize' : goal] }}</option></select></label>
        <p v-if="mismatch" class="lab-notice">{{ t.noPlatform }}</p>
        <button class="lab-button" :disabled="state === 'loading' || mismatch || !/^[\d.\w-]{1,40}$/.test(profile.minecraft)" @click="find">{{ state === 'loading' ? t.checking : t.find }} →</button>
        <p class="lab-small">{{ t.remembered }}</p><button class="lab-text-button" @click="reset">{{ t.reset }}</button>
      </section>
      <div class="lab-results" aria-live="polite">
        <div v-if="state === 'idle'" class="lab-setup-empty"><div class="lab-setup-visual" aria-hidden="true"><span>MC</span><i>+</i><span>{{ profile.platform }}</span><i>→</i><span class="lab-glow-orb">✓</span></div><h2>{{ t.find }}</h2><p>{{ t.prepareDesc }}</p><small>Modrinth · {{ profile.minecraft }} · {{ profile.platform }}</small></div>
        <div v-if="state === 'loading'" class="lab-panel lab-loading">{{ t.checking }}</div>
        <article v-for="item in results" :key="item.key" class="lab-panel lab-result" :style="{ '--tool-color': item.product.color }">
          <div class="lab-result-head"><span class="lab-orb"><i :class="['fa-solid', item.product.icon]" aria-hidden="true" /></span><div><p class="lab-kicker">{{ item.release ? t.verified : item.error ? t.offline : t.unavailable }}</p><h2>{{ item.product.name }} <small v-if="item.release">{{ item.release.number }}</small></h2></div></div>
          <p>{{ item.product.tagline[locale] }}</p>
          <template v-if="item.release">
            <p><code>{{ item.release.file }}</code></p><p>{{ modLoader ? t.installMod : t.installPlugin }}</p>
            <p v-if="proxy && item.key === 'solver'" class="lab-notice">{{ t.proxyNote }}</p>
            <div v-if="item.dependencies.length"><h3>{{ t.dependencies }}</h3><ul><li v-for="dep in item.dependencies" :key="dep.name"><a v-if="dep.url" :href="dep.url" target="_blank" rel="noopener">{{ dep.name }} ↗</a><span v-else>{{ dep.name }}</span></li></ul><p class="lab-small">{{ t.dependencyHint }}</p></div>
            <p v-if="item.dependencyError" class="lab-notice">{{ t.dependencies }}: {{ t.offline }}</p>
          </template>
          <div class="lab-actions"><a v-if="item.release" class="lab-button" :href="item.release.url">{{ t.download }} ↓</a><a v-else class="lab-button lab-secondary" :href="item.product.install.url" target="_blank" rel="noopener">Modrinth ↗</a><a class="lab-text-button" :href="`/${locale}${item.product.home}`">{{ t.docs }} →</a><a v-if="item.key === 'solver' && item.release && !proxy && item.release.number.replace(/^v/, '') === PRODUCTS.solver.version" class="lab-text-button" :href="link('config')">{{ t.studio }} →</a><a v-if="item.key === 'solvermotd' && item.release" class="lab-text-button" :href="link('motd')">{{ t.motd }} →</a></div>
        </article>
      </div>
    </div>
  </LabShell>
</template>
