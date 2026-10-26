<script setup>
import { computed } from 'vue'
import { previewTokens } from './motd-core.js'
const props = defineProps({ line1: String, line2: String, name: { type: String, default: 'FyrxCraft' }, banner: { type: String, default: '' }, label: { type: String, default: '' } })
const lines = computed(() => [previewTokens(props.line1 || ''), previewTokens(props.line2 || '')])
</script>
<template><div class="motd-preview-unit"><p v-if="label" class="lab-preview-label">{{ label }}</p><div class="lab-minecraft-list"><div class="lab-mc-icon" aria-hidden="true">F</div><div class="lab-mc-content"><div class="lab-mc-name">{{ name }}<span>12/100 ▂▄▆█</span></div><img v-if="banner" :src="banner" alt="Banner" class="lab-banner-image" /><template v-else><p v-for="(line, i) in lines" :key="i"><span v-for="(token, j) in line" :key="j" :style="token.style">{{ token.text }}</span></p></template></div></div></div></template>
