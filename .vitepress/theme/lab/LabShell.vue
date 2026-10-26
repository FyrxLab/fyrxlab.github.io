<script setup>
import { useLab } from './useLab.js'
import { useServerProfile } from './profile.js'
import './lab.css'
defineProps({ tool: { type: String, default: '' } })
const { t, link } = useLab()
const { profile } = useServerProfile()
const tools = [['setup', 'prepare'], ['config', 'studio'], ['solver', 'demo'], ['motd', 'motd']]
</script>

<template>
  <main id="laboratory" class="lab-page">
    <div class="lab-topline"><a :href="link('')">Fyrx<span>Lab</span> / {{ t.lab }}</a><span class="lab-env"><span class="lab-dot" /> {{ profile.platform }} · {{ profile.minecraft }}</span></div>
    <nav class="lab-nav" :aria-label="t.lab"><a :href="link('')" :aria-current="!tool ? 'page' : undefined">{{ t.back }}</a><a v-for="[slug, key] in tools" :key="slug" :href="link(slug)" :aria-current="tool === slug ? 'page' : undefined">{{ t[key] }}</a></nav>
    <slot />
  </main>
</template>
