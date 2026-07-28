<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS, PRODUCT_ORDER } from './productPalette.js'

const route = useRoute()

const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')

const LABELS = {
  en: { title: 'What are you building?', subtitle: "Every FyrxLab product, at a glance — pick what's relevant to you." },
  es: { title: '¿Qué estás construyendo?', subtitle: 'Todos los productos de FyrxLab, de un vistazo — elige lo que te interesa.' },
  it: { title: 'Cosa stai costruendo?', subtitle: "Tutti i prodotti di FyrxLab, in un colpo d'occhio — scegli ciò che ti interessa." },
  pt: { title: 'O que você está construindo?', subtitle: 'Todos os produtos da FyrxLab, em um relance — escolha o que te interessa.' }
}

const labels = computed(() => LABELS[locale.value])

const products = computed(() =>
  PRODUCT_ORDER.map((key) => {
    const p = PRODUCTS[key]
    return {
      key,
      name: p.name,
      color: p.color,
      icon: p.icon,
      version: p.version,
      kind: p.kind,
      font: p.font,
      tagline: p.tagline[locale.value] || p.tagline.en,
      link: `/${locale.value}${p.home}`
    }
  })
)

// Auto-rotating spotlight - purely cosmetic, respects reduced-motion.
const spotlightIndex = ref(0)
let timer = null

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return
  timer = setInterval(() => {
    spotlightIndex.value = (spotlightIndex.value + 1) % products.value.length
  }, 3200)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section id="highlights" class="highlights">
    <h2 class="highlights-title">{{ labels.title }}</h2>
    <p class="highlights-subtitle">{{ labels.subtitle }}</p>

    <div class="highlights-grid">
      <a
        v-for="(product, i) in products"
        :key="product.key"
        :href="product.link"
        class="highlight-card"
        :class="{ spotlit: i === spotlightIndex }"
        :style="{ '--accent': product.color, '--delay': `${i * 70}ms`, fontFamily: product.font ? `'${product.font}', cursive` : undefined }"
      >
        <div class="highlight-icon"><i class="fa-solid" :class="product.icon"></i></div>
        <div class="highlight-body">
          <div class="highlight-heading">
            <span class="highlight-name">{{ product.name }}</span>
            <span v-if="product.version" class="highlight-version">v{{ product.version }}</span>
          </div>
          <p class="highlight-tagline">{{ product.tagline }}</p>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.highlights {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.highlights-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}

.highlights-subtitle {
  text-align: center;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.highlight-card {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  opacity: 0;
  transform: translateY(8px);
  animation: highlight-in 0.5s ease forwards;
  animation-delay: var(--delay);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.highlight-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: var(--accent);
}

.highlight-card:hover,
.highlight-card.spotlit {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 8px 24px -12px var(--accent);
  transform: translateY(-2px);
}

.highlight-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
  font-size: 18px;
  transition: transform 0.3s ease;
}

.highlight-card.spotlit .highlight-icon {
  transform: scale(1.1) rotate(-4deg);
}

.highlight-heading {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.highlight-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.highlight-version {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  padding: 1px 8px;
  border-radius: 999px;
}

.highlight-tagline {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@keyframes highlight-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .highlight-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
