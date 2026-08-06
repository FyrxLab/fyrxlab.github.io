<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS } from './productPalette.js'

const route = useRoute()

const current = computed(() => {
  const path = route.path
  const key = Object.keys(PRODUCTS).find((k) => path.includes(`/${k}/`))
  if (!key) return null

  const product = PRODUCTS[key]
  if (!product.version) return null

  const locale = ['es', 'it', 'pt'].find((l) => path.startsWith(`/${l}/`)) || 'en'
  return {
    version: product.version,
    link: product.changelog ? `/${locale}${product.changelog}` : null,
  }
})
</script>

<template>
  <a v-if="current && current.link" class="version-badge" :href="current.link">v{{ current.version }}</a>
  <span v-else-if="current" class="version-badge">v{{ current.version }}</span>
</template>

<style scoped>
.version-badge {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent), color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  white-space: nowrap;
}
html.dark .version-badge {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
