<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { watch, onMounted } from 'vue'
import VersionBadge from './VersionBadge.vue'

const { Layout } = DefaultTheme
const route = useRoute()

function updateTheme(path) {
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
