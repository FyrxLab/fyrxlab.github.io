// VitePress 1.6.4 can run a queued scroll callback after the outline unmounts.
// Keep this guard local to the build; do not modify installed dependencies.
export function outlineGuard() {
  return {
    name: 'fyrx-outline-unmount-guard',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replaceAll('\\', '/').split('?')[0].endsWith('/vitepress/dist/client/theme-default/composables/outline.js')) return
      const target = 'function activateLink(hash) {'
      if (!code.includes(target)) throw new Error('Review the VitePress outline guard after updating VitePress')
      return { code: code.replace(target, `${target}\n        if (!container.value || !marker.value) return;`), map: null }
    }
  }
}
