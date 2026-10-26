<script setup>
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
const { t, link } = useLab()
const cards = [
  { slug: 'setup', key: 'prepare', icon: 'fa-server', color: '#30b6ea', number: '01' },
  { slug: 'config', key: 'studio', icon: 'fa-sliders', color: '#d6a51b', number: '02' },
  { slug: 'solver', key: 'demo', icon: 'fa-magnifying-glass-chart', color: '#49a37b', number: '03' },
  { slug: 'motd', key: 'motd', icon: 'fa-palette', color: '#b082ef', number: '04' }
]
</script>
<template>
  <LabShell>
    <header class="lab-heading lab-heading-xl"><p class="lab-kicker">{{ t.eyebrow }}</p><h1>{{ t.title }}</h1><p>{{ t.intro }}</p></header>
    <div class="lab-hub-grid"><a v-for="c in cards" :key="c.slug" :href="link(c.slug)" class="lab-tool-card" :style="{ '--tool-color': c.color }"><div class="lab-card-top"><span class="lab-orb"><i :class="['fa-solid', c.icon]" aria-hidden="true" /></span><span class="lab-number">{{ c.number }}</span></div><h2>{{ t[c.key] }}</h2><p>{{ t[c.key + 'Desc'] }}</p><span class="lab-card-action">{{ t.open }} <span>↗</span></span></a></div>
    <aside class="lab-footnote"><i class="fa-solid fa-laptop-code" aria-hidden="true" /><div><b>{{ t.browser }}</b><p>{{ t.local }}</p></div></aside>
  </LabShell>
</template>
