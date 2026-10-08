import DefaultTheme from 'vitepress/theme'
import { nextTick } from 'vue'
import Layout from './Layout.vue'
import ProductHighlights from './ProductHighlights.vue'
import Landing from './Landing.vue'
import './custom.css'
import './dynamic-colors.css'

// Page-to-page glass crossfade with the browser's View Transitions API.
// The router awaits onBeforeRouteChange, so the old page is captured before
// the new one renders; the transition finishes once the new page is in the
// DOM. Same-page hash links and browsers without the API skip it entirely.
function setupPageTransitions(router) {
  if (typeof document === 'undefined' || !document.startViewTransition) return
  let finish = null

  router.onBeforeRouteChange = (href) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (new URL(href, location.href).pathname === location.pathname) return
    return new Promise((captured) => {
      const vt = document.startViewTransition(() => {
        captured()
        return new Promise((done) => {
          finish = done
          setTimeout(done, 1500) // never hold the page if loading fails
        })
      })
      // A skipped transition (hidden tab, another one starting) rejects
      // these; navigation must go ahead regardless.
      vt.ready.catch(() => {})
      vt.finished.catch(() => {})
      setTimeout(captured, 300)
    })
  }

  router.onAfterRouteChange = () => {
    if (!finish) return
    const done = finish
    finish = null
    nextTick(done)
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('ProductHighlights', ProductHighlights)
    app.component('Landing', Landing)
    setupPageTransitions(router)
  }
}
