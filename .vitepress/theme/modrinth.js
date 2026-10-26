// Live data from Modrinth's public API (CORS-enabled, no key). Shared by the
// install card's version picker, the compatibility matrix and the landing's
// "updated N days ago". One batched request per page load, cached.
import { PRODUCTS } from './productPalette.js'

const API = 'https://api.modrinth.com/v2'

async function request(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)
  try {
    const r = await fetch(`${API}${path}`, { signal: controller.signal })
    if (!r.ok) throw new Error(`Modrinth ${r.status}`)
    return await r.json()
  } finally { clearTimeout(timeout) }
}

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
    projectsPromise = request(`/projects?ids=${ids}`)
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
  const versions = await request(`/project/${slugOf(key)}/version?${q}`)
  const [v] = versions.filter(v => v.version_type === 'release').sort((a, b) => new Date(b.date_published) - new Date(a.date_published))
  if (!v) return null
  const file = v.files.find((f) => f.primary) || v.files[0]
  // Downloads always go through the Modrinth version page; the CDN URL is never exposed.
  if (!file?.filename) throw new Error('Release has no downloadable file')
  // Some universal jars omit loader-specific requirements from API metadata.
  // Keep documented requirements in the product catalog as a supplement.
  const required = [...(PRODUCTS[key].install.requiredByLoader?.[loader] || []).map(id => ({ project_id: id, dependency_type: 'required' })), ...v.dependencies.filter(d => d.dependency_type === 'required')]
  const dependencies = [...new Map(required.map(d => [d.project_id || d.version_id || d.file_name, d])).values()]
  return { number: v.version_number, page: `https://modrinth.com/project/${slugOf(key)}/version/${v.id}`, file: file.filename, dependencies }
}

export async function resolveDependencies(dependencies) {
  const resolved = await Promise.all(dependencies.map(async d => {
    const version = d.version_id ? await request(`/version/${d.version_id}`) : null
    const id = d.project_id || version?.project_id
    if (!id) return { name: d.file_name || 'Dependency', url: null }
    const project = await request(`/project/${id}`)
    return { name: project.title, url: `https://modrinth.com/project/${project.slug}${version ? `/version/${version.id}` : ''}` }
  }))
  return [...new Map(resolved.map(d => [d.name, d])).values()]
}
