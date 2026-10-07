<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { watch, onMounted } from 'vue'
import VersionBadge from './VersionBadge.vue'

const { Layout } = DefaultTheme
const route = useRoute()

function updateTheme(path) {
  // Re-enabled: dynamic-colors.css now sets --product-accent-* instead of
  // --vp-c-brand-1/2/3, so per-product color only reaches the hero gradient
  // and feature icons (see custom.css) — it can no longer leak into the
  // shared nav/code/callout/table chrome the way the old --vp-c-brand-1
  // override did.
  if (typeof document === 'undefined') return;

  // Remove existing theme classes
  document.documentElement.classList.forEach(className => {
    if (className.startsWith('theme-')) {
      document.documentElement.classList.remove(className);
    }
  });

  // Apply new theme based on path route
  if (path.includes('/furnace/')) {
    document.documentElement.classList.add('theme-furnace');
  } else if (path.includes('/solvermotd/')) {
    document.documentElement.classList.add('theme-solvermotd');
  } else if (path.includes('/phos/')) {
    document.documentElement.classList.add('theme-phos');
  } else if (path.includes('/solver/') || path.includes('/absolutesolver/')) {
    document.documentElement.classList.add('theme-solver');
  } else if (path.includes('/noteblock/')) {
    document.documentElement.classList.add('theme-noteblock');
  } else if (path.includes('/lazymod/')) {
    document.documentElement.classList.add('theme-lazymod');
  } else if (path.includes('/fyrxai/')) {
    document.documentElement.classList.add('theme-fyrxai');
  }
}

// Watch for route changes
watch(() => route.path, updateTheme)

// Apply on initial load
onMounted(() => {
  updateTheme(route.path)
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <VersionBadge />
    </template>
  </Layout>
</template>
