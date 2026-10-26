<script setup>
import { computed, onUnmounted, ref } from 'vue'
import LabShell from './LabShell.vue'
import { useLab } from './useLab.js'
import { previewTokens, motdConfig } from './motd-core.js'
import { downloadText } from './files.js'

const { t, locale } = useLab()
const line1 = ref('<gradient:#55ffff:#a78bfa><bold>FyrxCraft</bold></gradient> <gray>• Survival'), line2 = ref('<green>A new adventure starts here.'), serverName = ref('FyrxCraft')
const image = ref(''), error = ref(''), modern = ref(true), template = ref('survival')
const tokens = computed(() => [previewTokens(line1.value), previewTokens(line2.value)])
const config = computed(() => motdConfig(line1.value, line2.value, !!image.value))
let uploadRevision = 0
function styleTemplate() {
  const styles = { survival: ['<gradient:#55ffff:#a78bfa><bold>FyrxCraft</bold></gradient> <gray>• Survival', '<green>A new adventure starts here.'], creative: ['<light_purple><bold>FyrxCraft</bold></light_purple> <white>Creative', '<aqua>Build something extraordinary.'], network: ['<gold><bold>FYRX NETWORK</bold></gold>', '<yellow>Survival <gray>• <aqua>Creative <gray>• <green>Minigames'] }
  ;[line1.value, line2.value] = styles[template.value]
}
function clearImage() { uploadRevision++; if (image.value) URL.revokeObjectURL(image.value); image.value = '' }
async function loadImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  clearImage(); error.value = ''; const requestId = uploadRevision
  let url = ''
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error()
    const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer())
    if ([137, 80, 78, 71, 13, 10, 26, 10].some((b, i) => signature[i] !== b)) throw new Error()
    url = URL.createObjectURL(file)
    const img = new Image()
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url })
    if (img.naturalWidth !== 264 || img.naturalHeight !== 16) throw new Error()
    if (requestId !== uploadRevision) { URL.revokeObjectURL(url); return }
    image.value = url
  } catch { if (url) URL.revokeObjectURL(url); if (requestId === uploadRevision) error.value = t.value.badBanner }
  finally { event.target.value = '' }
}
onUnmounted(clearImage)
</script>
<template>
  <LabShell tool="motd">
    <header class="lab-heading"><p class="lab-kicker">SOLVERMOTD / DESIGN STUDIO</p><h1>{{ t.motd }}</h1><p>{{ t.motdDesc }}</p></header>
    <div class="lab-workspace">
      <section class="lab-panel lab-controls">
        <label>{{ t.template }}<select v-model="template" @change="styleTemplate"><option v-for="key in ['survival', 'creative', 'network']" :key="key" :value="key">{{ t[key] }}</option></select></label>
        <label>{{ t.serverName }}<input v-model="serverName" maxlength="60" /></label>
        <label>{{ t.line1 }}<textarea v-model="line1" maxlength="4000" rows="3" spellcheck="false" /></label>
        <label>{{ t.line2 }}<textarea v-model="line2" maxlength="4000" rows="3" spellcheck="false" /></label>
        <h2>{{ t.banner }}</h2><label class="lab-button lab-secondary lab-file">{{ t.upload }}<input type="file" accept="image/png" @change="loadImage" /></label><p class="lab-small">{{ t.bannerHint }}</p>
        <p v-if="error" class="lab-notice lab-error" role="alert">{{ error }}</p><button v-if="image" class="lab-text-button" @click="clearImage">{{ t.remove }}</button>
      </section>
      <div class="lab-editor-stack">
        <section class="lab-panel lab-motd-preview"><div class="lab-preview-heading"><h2>{{ t.preview }}</h2><select v-model="modern" :aria-label="t.preview"><option :value="true">{{ t.modern }}</option><option :value="false">{{ t.legacy }}</option></select></div>
          <div class="lab-minecraft-list"><div class="lab-mc-icon" aria-hidden="true">F</div><div class="lab-mc-content"><div class="lab-mc-name">{{ serverName }}<span>12/100 ▂▄▆█</span></div><img v-if="image && modern" :src="image" :alt="t.banner" class="lab-banner-image" /><template v-else><p v-for="(line, i) in tokens" :key="i"><span v-for="(token, j) in line" :key="j" :style="token.style">{{ token.text }}</span></p></template></div></div>
          <p class="lab-small">{{ t.motdNote }}</p>
        </section>
        <section class="lab-terminal"><div class="lab-terminal-bar"><span>{{ t.snippet }} / YAML</span></div><pre class="lab-log">{{ config }}</pre></section>
        <div class="lab-panel"><p>{{ t.motdSteps }}</p><div class="lab-actions"><button class="lab-button" @click="downloadText('solvermotd-snippet.yml', config)">{{ t.exportMotd }} ↓</button><a v-if="image" :href="image" download="banner.png" class="lab-button lab-secondary">banner.png ↓</a><a class="lab-text-button" :href="`/${locale}/solvermotd/features/banner`">{{ t.docs }} →</a></div></div>
      </div>
    </div>
  </LabShell>
</template>
