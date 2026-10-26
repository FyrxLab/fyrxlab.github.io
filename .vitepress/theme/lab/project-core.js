import { readConfig } from './config-core.js'

export const CONFIG_FIELDS = ['ai-provider.provider', 'ai-provider.model', 'localization', 'monitor-console', 'check-crash-on-startup', 'chat-moderation.enabled']
export function configProject(updates, version) {
  return JSON.stringify({ kind: 'fyrx-config-project', schema: 1, version, preferences: Object.fromEntries(CONFIG_FIELDS.map(key => [key, updates[key]])) }, null, 2)
}
export function parseConfigProject(text, version) {
  if (text.length > 16000) throw new Error('Invalid project')
  const project = JSON.parse(text)
  if (project.kind !== 'fyrx-config-project' || project.schema !== 1 || project.version !== version) throw new Error('Invalid project')
  const p = project.preferences
  if (!p || Array.isArray(p) || typeof p !== 'object' || Object.keys(p).length !== CONFIG_FIELDS.length) throw new Error('Invalid project')
  for (const key of CONFIG_FIELDS) {
    const boolean = ['monitor-console', 'check-crash-on-startup', 'chat-moderation.enabled'].includes(key)
    if (typeof p[key] !== (boolean ? 'boolean' : 'string') || (!boolean && (!p[key].trim() || p[key].length > 120))) throw new Error('Invalid project')
  }
  if (!['anthropic', 'google', 'other'].includes(p['ai-provider.provider'])) throw new Error('Invalid project')
  return Object.fromEntries(CONFIG_FIELDS.map(key => [key, p[key]]))
}
export function motdProject(state) {
  return JSON.stringify({ kind: 'fyrx-motd-project', schema: 1, line1: state.line1, line2: state.line2, serverName: state.serverName }, null, 2)
}
export function parseMotdProject(text) {
  if (text.length > 64000) throw new Error('Invalid project')
  let result
  if (text.trim().startsWith('{')) {
    const p = JSON.parse(text)
    if (p.kind !== 'fyrx-motd-project' || p.schema !== 1) throw new Error('Invalid project')
    result = { line1: p.line1, line2: p.line2, serverName: p.serverName }
  } else {
    const p = readConfig(text)
    if (p.errors.length) throw new Error('Invalid project')
    result = { line1: p.data.motd?.line1, line2: p.data.motd?.line2, serverName: 'FyrxCraft' }
  }
  if (typeof result.line1 !== 'string' || typeof result.line2 !== 'string' || typeof result.serverName !== 'string' || result.line1.length > 4000 || result.line2.length > 4000 || result.serverName.length > 60) throw new Error('Invalid project')
  return result
}

export function formatSelection(text, start, end, opening, closing) {
  const from = start === end ? 0 : Math.max(0, start), to = start === end ? text.length : Math.min(text.length, end)
  const output = text.slice(0, from) + opening + text.slice(from, to) + closing + text.slice(to)
  return output.length <= 4000 ? output : text
}
