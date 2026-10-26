import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { COPY } from './copy.js'
import { PHASE2_COPY } from './phase2-copy.js'

export function useLab() {
  const route = useRoute()
  const locale = computed(() => ['es', 'it', 'pt'].find(l => route.path.startsWith(`/${l}/`)) || 'en')
  const t = computed(() => ({ ...COPY[locale.value], ...PHASE2_COPY[locale.value] }))
  const link = slug => `/${locale.value}/lab/${slug ? slug : ''}`
  return { locale, t, link }
}
