import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ProductHighlights from './ProductHighlights.vue'
import './custom.css'
import './dynamic-colors.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ProductHighlights', ProductHighlights)
  }
}
