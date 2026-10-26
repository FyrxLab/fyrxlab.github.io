<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as pages } from './navigation.data.js'
import { navigationContext, cleanPath } from './navigation-core.js'
import { PRODUCTS } from './productPalette.js'
import { useLab } from './lab/useLab.js'
import './navigation.css'
const props = defineProps({ mode: { type: String, default: 'trail' } })
const route = useRoute(), { t, link } = useLab()
const context = computed(() => navigationContext(pages, route.path))
const product = computed(() => PRODUCTS[context.value.product])
const productHome = computed(() => `/${context.value.locale}${product.value?.home || '/'}`)
const sections = computed(() => ['guides', 'features', 'reference'].map(key => ({ key, pages: context.value.siblings.filter(page => page.section === key) })).filter(group => group.pages.length))
const related = computed(() => context.value.siblings.filter(page => cleanPath(page.url) !== cleanPath(route.path)).slice(0, 3))
const setup = computed(() => `${link('setup')}?product=${context.value.product}`)
</script>
<template>
  <div v-if="product" class="page-compass" :class="`page-compass-${mode}`" :style="{ '--compass-color': product.color }">
    <template v-if="mode === 'trail'">
      <nav class="page-breadcrumbs" :aria-label="t.home"><a :href="`/${context.locale}/`">FyrxLab</a><span aria-hidden="true">/</span><a :href="productHome">{{ product.name }}</a><template v-if="!context.current?.home"><span aria-hidden="true">/</span><a href="#VPContent" aria-current="page">{{ context.current?.title }}</a></template></nav>
      <details v-if="!context.current?.home" class="page-directory"><summary><span>{{ t.allPages }}</span><span>{{ context.siblings.length }} ↗</span></summary><nav :aria-label="t.exploreDocs"><a :href="productHome">← {{ t.productHome }}</a><a v-for="page in context.siblings" :key="page.url" :href="page.url" :aria-current="cleanPath(page.url) === cleanPath(route.path) ? 'page' : undefined">{{ page.title }}</a><a v-if="product.kind !== 'library'" :href="setup">{{ t.prepareProduct }} →</a></nav></details>
    </template>
    <template v-else-if="mode === 'map'">
      <div class="page-map-heading"><div><p class="page-eyebrow">{{ product.name }} / {{ t.allPages }}</p><h2>{{ t.exploreDocs }}</h2></div><a v-if="product.kind !== 'library'" class="page-action" :href="setup">{{ t.prepareProduct }} →</a></div>
      <div class="page-map-grid"><section v-for="section in sections" :key="section.key"><h3>{{ t[section.key] }}</h3><a v-for="page in section.pages" :key="page.url" :href="page.url"><span>{{ page.title }}</span><span aria-hidden="true">↗</span></a></section><section v-if="context.current?.headings.length"><h3>{{ t.onThisPage }}</h3><a v-for="heading in context.current.headings" :key="heading.id" :href="`#${heading.id}`"><span>{{ heading.title }}</span><span aria-hidden="true">↓</span></a></section><section v-if="['solver','solvermotd'].includes(context.product)"><h3>{{ t.lab }}</h3><a :href="link(context.product === 'solver' ? 'config' : 'motd')"><span>{{ context.product === 'solver' ? t.studio : t.motd }}</span><span aria-hidden="true">↗</span></a><a v-if="context.product === 'solver'" :href="link('solver')"><span>{{ t.demo }}</span><span aria-hidden="true">↗</span></a><a :href="link('')"><span>{{ t.myServer }}</span><span aria-hidden="true">↗</span></a></section></div>
    </template>
    <template v-else-if="mode === 'related'"><h2>{{ t.nextRead }}</h2><nav class="page-related" :aria-label="t.nextRead"><a :href="productHome"><small>{{ product.name }}</small><b>← {{ t.productHome }}</b></a><a v-for="page in related" :key="page.url" :href="page.url"><small>{{ t[page.section] }}</small><b>{{ page.title }} ↗</b></a></nav></template>
  </div>
</template>
