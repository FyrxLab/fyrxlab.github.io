<script setup>
import { ref, computed } from 'vue'
import { useLab } from './useLab.js'
import MotdPreview from './MotdPreview.vue'
import { motdTemplates } from './motd-templates.js'
import './lab.css'
const { t, locale, link } = useLab()
const style = ref('survival')
const preview = computed(() => motdTemplates(locale.value)[style.value])
</script>
<template>
  <section class="lab-launch" aria-labelledby="lab-launch-title">
    <div><p class="lab-kicker">{{ t.eyebrow }}</p><h2 id="lab-launch-title">{{ t.title }}</h2><p>{{ t.intro }}</p><a class="lab-button" :href="link('')">{{ t.myServer }} →</a><div class="lab-launch-preview"><a :href="`${link('motd')}?style=${style}`" :aria-label="t.motd"><MotdPreview :line1="preview[0]" :line2="preview[1]" /></a><div class="motd-template-gallery" :aria-label="t.template"><button v-for="key in ['survival','creative','network']" :key="key" :aria-pressed="style === key" @click="style = key"><b>{{ t[key] }}</b></button></div></div></div>
    <div class="lab-launch-tools"><a :href="link('config')"><span>01 / CONFIG</span><b>{{ t.studio }} →</b><p>{{ t.studioDesc }}</p></a><a :href="link('solver')"><span>02 / SOLVER</span><b>{{ t.demo }} →</b><p>{{ t.demoDesc }}</p></a><a :href="link('motd')"><span>03 / MOTD</span><b>{{ t.motd }} →</b><p>{{ t.motdDesc }}</p></a></div>
  </section>
</template>
