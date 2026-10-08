<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { PRODUCTS, PRODUCT_ORDER } from './productPalette.js'

// Replaces VPFooter (hidden in custom.css) on the pages where VPFooter would
// show — the ones without a sidebar — and adds the row of product orbs.
const { theme, frontmatter, page } = useData()
const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const show = computed(() => theme.value.footer && frontmatter.value.footer !== false && (frontmatter.value.layout === 'home' || page.value.isNotFound))
const products = computed(() => PRODUCT_ORDER.map((k) => ({ key: k, ...PRODUCTS[k], link: `/${locale.value}${PRODUCTS[k].home}` })))
</script>

<template>
  <footer v-if="show" class="site-footer">
    <nav class="sf-orbs" aria-label="FyrxLab">
      <a v-for="p in products" :key="p.key" :href="p.link" class="sf-orb" :style="{ '--c': p.color }" :title="p.name">
        <span class="sf-ball" aria-hidden="true"><i :class="['fa-solid', p.icon]" /></span>
        <span class="sf-name">{{ p.name }}</span>
      </a>
    </nav>
    <p v-if="theme.footer.message" class="sf-msg" v-html="theme.footer.message" />
    <p v-if="theme.footer.copyright" class="sf-copy" v-html="theme.footer.copyright" />
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  margin: 72px 16px 16px;
  padding: 28px 24px 24px;
  border-radius: 20px;
  text-align: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
  backdrop-filter: blur(18px) saturate(170%);
  -webkit-backdrop-filter: blur(18px) saturate(170%);
}
@media (min-width: 768px) { .site-footer { margin: 96px 32px 20px; } }

.sf-orbs { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; margin-bottom: 20px; }
.sf-orb { display: grid; justify-items: center; gap: 6px; padding: 6px 8px; text-decoration: none; border-radius: 12px; min-width: 84px; }
.sf-ball {
  width: 38px; height: 38px; border-radius: 50%;
  display: grid; place-items: center; color: #fff; font-size: 15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  background:
    radial-gradient(ellipse 62% 42% at 50% 22%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--c) 55%, white), var(--c) 45%, color-mix(in srgb, var(--c) 55%, black));
  box-shadow: 0 6px 12px -4px color-mix(in srgb, var(--c) 70%, transparent);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sf-orb:hover .sf-ball, .sf-orb:focus-visible .sf-ball { transform: translateY(-6px) scale(1.12); }
.sf-orb:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.sf-name { font-size: 12px; font-weight: 600; color: var(--vp-c-text-2); }
.sf-orb:hover .sf-name { color: var(--vp-c-text-1); }

.sf-msg, .sf-copy { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--vp-c-text-2); }
.sf-copy { color: var(--vp-c-text-3); }
.sf-msg :deep(a), .sf-copy :deep(a) { color: var(--vp-c-brand-1); }

@media (prefers-reduced-motion: reduce) { .sf-ball { transition: none; } }
</style>
