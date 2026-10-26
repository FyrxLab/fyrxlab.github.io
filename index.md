---
layout: false
---

<script setup>
import { useRouter } from 'vitepress'
import { onMounted } from 'vue'
const router = useRouter()
onMounted(() => router.go('/en/' + window.location.search + window.location.hash))
</script>

<a href="/en/">Enter FyrxLab →</a>
