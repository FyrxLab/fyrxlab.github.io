<script setup>
import { computed, ref, watch } from 'vue'
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
import { scenariosFor } from './scenarios.js'
const { t, locale, link } = useLab()
const scenarios = computed(() => scenariosFor(locale.value))
const selected = ref(0), step = ref(0)
const scenario = computed(() => scenarios.value[selected.value])
watch(selected, () => step.value = 0)
</script>
<template>
  <LabShell tool="solver">
    <header class="lab-heading"><p class="lab-kicker">ABSOLUTESOLVER / SANDBOX</p><h1>{{ t.demo }}</h1><p>{{ t.demoDesc }}</p></header>
    <div class="lab-scenarios"><button v-for="(item, i) in scenarios" :key="item.id" :aria-pressed="selected === i" @click="selected = i"><i :class="['fa-solid', item.icon]" aria-hidden="true" />{{ item.name }}</button></div>
    <p class="lab-small">{{ t.simulation }}</p>
    <div class="lab-demo-grid">
      <section class="lab-terminal"><div class="lab-terminal-bar"><span>server.log / {{ scenario.id }}</span><span class="lab-traffic" aria-hidden="true">● ● ●</span></div><pre class="lab-log">{{ scenario.log }}</pre><div class="lab-log-footer"><span class="lab-dot" /> {{ t.evidence }}</div></section>
      <section class="lab-panel lab-case" aria-live="polite">
        <ol class="lab-stepper"><li :class="{ active: step === 0 }">01 {{ t.evidence }}</li><li :class="{ active: step === 1 }">02 {{ t.diagnosis }}</li><li :class="{ active: step === 2 }">03 {{ t.next }}</li></ol>
        <template v-if="step === 0"><h2>{{ scenario.name }}</h2><p>{{ t.demoNote }}</p><button class="lab-button" @click="step = 1">{{ t.inspect }} →</button></template>
        <template v-else-if="step === 1"><h2>{{ t.diagnosis }}</h2><p>{{ scenario.explanation }}</p><button class="lab-button" @click="step = 2">{{ t.resolve }} →</button></template>
        <template v-else><h2>{{ t.next }}</h2><ol class="lab-resolution"><li v-for="instruction in scenario.steps" :key="instruction">{{ instruction }}</li></ol><a class="lab-button" :href="`/${locale}/solver/${scenario.page}`">{{ t.docs }} →</a><button class="lab-text-button" @click="step = 0">{{ t.restart }}</button></template>
      </section>
    </div>
    <div class="lab-export"><div><b>{{ t.prepare }}</b><p>{{ t.prepareDesc }}</p></div><a class="lab-button" :href="link('setup')">{{ t.prepare }} →</a></div>
  </LabShell>
</template>
