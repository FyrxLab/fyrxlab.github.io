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
/* Glossy pill in the product's own color (water-drop highlight on top half);
   dark ink mixed from the accent stays readable on gold through blurple. */
.version-badge {
  --b: var(--product-accent-1, var(--vp-c-brand-2));
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 4px 11px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: color-mix(in srgb, var(--b) 25%, black);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.15) 50%, transparent 50%),
    linear-gradient(180deg, color-mix(in srgb, var(--b) 60%, white), var(--b) 50%, color-mix(in srgb, var(--b) 80%, black) 50%, var(--b));
  border: 1px solid color-mix(in srgb, var(--b) 65%, black);
  box-shadow: 0 4px 10px -4px var(--b);
  text-decoration: none;
  white-space: nowrap;
}
a.version-badge:hover { filter: brightness(1.08); }
</style>
