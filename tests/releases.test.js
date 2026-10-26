import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchBestVersion } from '../.vitepress/theme/modrinth.js'

test('release selection filters prereleases, selects newest stable and retains dependencies', async () => {
  const original = globalThis.fetch
  let requested
  globalThis.fetch = async url => {
    requested = new URL(url)
    return { ok: true, json: async () => [
      { id: 'beta', version_type: 'beta', date_published: '2026-10-25' },
      { id: 'old', version_type: 'release', date_published: '2026-01-01', files: [{ filename: 'old.jar' }], dependencies: [] },
      { id: 'new', version_type: 'release', version_number: '1.3.0', date_published: '2026-10-01', files: [{ filename: 'sources.jar' }, { primary: true, filename: 'noteblock.jar', url: 'https://cdn.modrinth.com/example.jar' }], dependencies: [{ project_id: 'fabric-api', dependency_type: 'required' }, { project_id: 'optional', dependency_type: 'optional' }] }
    ] }
  }
  try {
    const result = await fetchBestVersion('noteblock', '1.21.1', 'fabric')
    assert.equal(result.file, 'noteblock.jar')
    assert.equal(result.number, '1.3.0')
    assert.equal(result.dependencies.length, 1)
    assert.deepEqual(JSON.parse(requested.searchParams.get('loaders')), ['fabric'])
    assert.deepEqual(JSON.parse(requested.searchParams.get('game_versions')), ['1.21.1'])
  } finally { globalThis.fetch = original }
})

test('no stable match and API failures remain distinct', async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () => ({ ok: true, json: async () => [{ version_type: 'beta' }] })
    assert.equal(await fetchBestVersion('solver', '1.21.1', 'paper'), null)
    globalThis.fetch = async () => ({ ok: false, status: 503 })
    await assert.rejects(fetchBestVersion('solver', '1.21.1', 'paper'), /503/)
  } finally { globalThis.fetch = original }
})

test('documented Fabric API dependency survives incomplete release metadata', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () => ({ ok: true, json: async () => [{ id: 'universal', version_type: 'release', version_number: '1.3.0', date_published: '2026-10-01', files: [{ filename: 'noteblock.jar', url: 'https://cdn.modrinth.com/example.jar' }], dependencies: [] }] })
  try {
    const result = await fetchBestVersion('noteblock', '1.21.1', 'fabric')
    assert.equal(result.dependencies[0].project_id, 'fabric-api')
    assert.equal((await fetchBestVersion('noteblock', '1.21.1', 'forge')).dependencies.length, 0)
  } finally { globalThis.fetch = original }
})
