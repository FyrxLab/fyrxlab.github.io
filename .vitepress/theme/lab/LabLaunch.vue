<script setup>
import { useLab } from './useLab.js'
import './lab.css'
const { t, link } = useLab()
</script>
<template>
  <section class="lab-launch" aria-labelledby="lab-launch-title">
    <div><p class="lab-kicker">{{ t.eyebrow }}</p><h2 id="lab-launch-title">{{ t.title }}</h2><p>{{ t.intro }}</p><a class="lab-button" :href="link('setup')">{{ t.prepare }} →</a></div>
    <div class="lab-launch-tools"><a :href="link('config')"><span>01 / CONFIG</span><b>{{ t.studio }} ↗</b><p>{{ t.studioDesc }}</p></a><a :href="link('solver')"><span>02 / SOLVER</span><b>{{ t.demo }} ↗</b><p>{{ t.demoDesc }}</p></a><a :href="link('motd')"><span>03 / MOTD</span><b>{{ t.motd }} ↗</b><p>{{ t.motdDesc }}</p></a></div>
  </section>
</template>
