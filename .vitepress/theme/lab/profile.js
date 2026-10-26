import { reactive, onMounted, watch } from 'vue'
import { PRODUCTS } from '../productPalette.js'
import { drafts, environmentKey } from './session.js'

export const PLATFORMS = ['paper', 'purpur', 'spigot', 'bukkit', 'folia', 'velocity', 'bungeecord', 'waterfall', 'fabric', 'forge', 'neoforge']
export const GOALS = ['diagnostics', 'moderation', 'motd', 'mods']
const initial = () => ({ minecraft: '1.21.1', platform: 'paper', goal: 'diagnostics', product: '' })
const profile = reactive(initial())
let hydrated = false
watch(() => environmentKey(profile), () => { drafts.release = null; drafts.checklist = [] }, { flush: 'sync' })
if (typeof window !== 'undefined') watch(profile, () => {
  if (!hydrated) return
  try { localStorage.setItem('fyrx-server-profile', JSON.stringify(profile)) } catch { /* Private browsing. */ }
}, { flush: 'sync' })

export function useServerProfile() {
  onMounted(() => {
    if (!hydrated) try {
      const saved = JSON.parse(localStorage.getItem('fyrx-server-profile') || 'null')
      if (saved && /^[\d.\w-]{1,40}$/.test(saved.minecraft)) profile.minecraft = saved.minecraft
      if (PLATFORMS.includes(saved?.platform)) profile.platform = saved.platform
      if (GOALS.includes(saved?.goal)) profile.goal = saved.goal
      if (PRODUCTS[saved?.product]?.kind !== 'library' && PRODUCTS[saved?.product]) profile.product = saved.product
    } catch { /* Storage is optional. */ }
    // Links from product pages carry public context only, never configuration data.
    const params = new URLSearchParams(window.location.search)
    const product = params.get('product')
    if (PRODUCTS[product] && PRODUCTS[product].kind !== 'library') {
      profile.product = product
      profile.goal = product === 'solvermotd' ? 'motd' : PRODUCTS[product].kind === 'mod' ? 'mods' : 'diagnostics'
    }
    const platform = params.get('platform'), minecraft = params.get('minecraft')
    if (PLATFORMS.includes(platform)) profile.platform = platform
    if (minecraft && /^[\d.\w-]{1,40}$/.test(minecraft)) profile.minecraft = minecraft
    hydrated = true
    try { localStorage.setItem('fyrx-server-profile', JSON.stringify(profile)) } catch { /* Storage is optional. */ }
  })
  return { profile, reset: () => Object.assign(profile, initial()) }
}
