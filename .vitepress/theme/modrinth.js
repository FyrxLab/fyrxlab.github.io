// Live data from Modrinth's public API (CORS-enabled, no key). Shared by the
// install card's version picker, the compatibility matrix and the landing's
// "updated N days ago". One batched request per page load, cached.
import { PRODUCTS } from './productPalette.js'

const API = 'https://api.modrinth.com/v2'

export const slugOf = (key) => {
  const url = PRODUCTS[key]?.install?.url || ''
  return url.includes('modrinth.com') ? url.split('/').pop() : null
}

let projectsPromise = null
// -> { [productKey]: { game_versions, loaders, updated } }
export function fetchProjects() {
  if (!projectsPromise) {
    const keys = Object.keys(PRODUCTS).filter(slugOf)
    const ids = encodeURIComponent(JSON.stringify(keys.map(slugOf)))
    projectsPromise = fetch(`${API}/projects?ids=${ids}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Modrinth ${r.status}`))))
      .then((list) => {
        const bySlug = Object.fromEntries(list.map((p) => [p.slug, p]))
        return Object.fromEntries(keys.map((k) => [k, bySlug[slugOf(k)]]).filter(([, p]) => p))
      })
      .catch((e) => {
        projectsPromise = null // allow a retry on the next call
        throw e
      })
  }
  return projectsPromise
}

// Newest release of `key` for one Minecraft version + loader, or null.
export async function fetchBestVersion(key, gameVersion, loader) {
  const q = `loaders=${encodeURIComponent(JSON.stringify([loader]))}&game_versions=${encodeURIComponent(JSON.stringify([gameVersion]))}`
  const r = await fetch(`${API}/project/${slugOf(key)}/version?${q}`)
  if (!r.ok) throw new Error(`Modrinth ${r.status}`)
  const [v] = await r.json()
  if (!v) return null
  const file = v.files.find((f) => f.primary) || v.files[0]
  return { number: v.version_number, page: `https://modrinth.com/project/${slugOf(key)}/version/${v.id}`, file: file?.filename, url: file?.url }
}
