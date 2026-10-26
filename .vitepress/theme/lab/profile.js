import { reactive, onMounted, watch } from 'vue'

export const PLATFORMS = ['paper', 'purpur', 'spigot', 'bukkit', 'folia', 'velocity', 'bungeecord', 'waterfall', 'fabric', 'forge', 'neoforge']
export const GOALS = ['diagnostics', 'moderation', 'motd', 'mods']
const initial = () => ({ minecraft: '1.21.1', platform: 'paper', goal: 'diagnostics' })
const profile = reactive(initial())
let hydrated = false
if (typeof window !== 'undefined') watch(profile, () => {
  if (!hydrated) return
  try { localStorage.setItem('fyrx-server-profile', JSON.stringify(profile)) } catch { /* Private browsing. */ }
}, { flush: 'sync' })

export function useServerProfile() {
  onMounted(() => {
    if (hydrated) return
    try {
      const saved = JSON.parse(localStorage.getItem('fyrx-server-profile') || 'null')
      if (saved && /^[\d.\w-]{1,40}$/.test(saved.minecraft)) profile.minecraft = saved.minecraft
      if (PLATFORMS.includes(saved?.platform)) profile.platform = saved.platform
      if (GOALS.includes(saved?.goal)) profile.goal = saved.goal
    } catch { /* Storage is optional. */ }
    hydrated = true
  })
  return { profile, reset: () => Object.assign(profile, initial()) }
}
