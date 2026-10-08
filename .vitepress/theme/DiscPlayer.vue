<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vitepress'

// Noteblock's 11 discs, each linked to its video on the JEAMCube NoteBlock
// channel. The YouTube player only loads after a click (youtube-nocookie),
// so the page stays light and nothing is sent to YouTube before that.
const CHANNEL = 'https://www.youtube.com/@jeamcube.noteblock'
const DISCS = [
  { name: 'Howl Moving Castle', length: '3:27', id: '21QwZYsEz4w' },
  { name: 'Lumiose City', length: '3:15', id: '5WmLm-N8sjA' },
  { name: 'Gravity Falls', length: '2:28', id: 'Bp9-I6NIdNw' },
  { name: 'The Painful Way', length: '3:19', id: 'dXLo-CbxZD0' },
  { name: 'No Escape', length: '2:30', id: 'glWyClSCoEw' },
  { name: 'Super Mario Maker', length: '1:47', id: '_jow59n1Fsk' },
  { name: 'Hyrule Castle', length: '4:58', id: 'ew86NHSB5ec' },
  { name: 'Pandora Palace', length: '3:22', id: '4aSqj1TPvKI' },
  { name: 'Attack of the Killer Queen', length: '4:07', id: 'k1itX0O3Sss' },
  { name: 'Studiopolis Zone', length: '4:31', id: 'ebBcnu904cM' },
  { name: 'Storm Eagle', length: '2:41', id: '9vDiM65EHFI' }
]

const COPY = {
  en: { title: 'Noteblock Player', play: 'Play', youtube: 'Watch on YouTube', channel: 'All songs on the JEAMCube NoteBlock channel', list: 'Discs', disc: 'Disc' },
  es: { title: 'Reproductor Noteblock', play: 'Reproducir', youtube: 'Ver en YouTube', channel: 'Todas las canciones en el canal JEAMCube NoteBlock', list: 'Discos', disc: 'Disco' },
  it: { title: 'Lettore Noteblock', play: 'Riproduci', youtube: 'Guarda su YouTube', channel: 'Tutti i brani sul canale JEAMCube NoteBlock', list: 'Dischi', disc: 'Disco' },
  pt: { title: 'Player Noteblock', play: 'Tocar', youtube: 'Ver no YouTube', channel: 'Todas as músicas no canal JEAMCube NoteBlock', list: 'Discos', disc: 'Disco' }
}

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => COPY[locale.value])

const current = ref(0)
const playing = ref(false)
const disc = computed(() => DISCS[current.value])
const watchUrl = computed(() => `https://www.youtube.com/watch?v=${disc.value.id}`)

function select(i) {
  current.value = i
  playing.value = false
}
</script>

<template>
  <section class="dp" :aria-label="t.title">
    <div class="dp-head">
      <span class="dp-title">{{ t.title }}</span>
      <span class="dp-caps" aria-hidden="true"><span /><span /><span class="x" /></span>
    </div>

    <div class="dp-body">
      <div class="dp-stage">
        <div class="dp-screen">
          <iframe
            v-if="playing"
            :key="disc.id"
            :src="`https://www.youtube-nocookie.com/embed/${disc.id}?autoplay=1&rel=0`"
            :title="disc.name"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          />
          <button v-else type="button" class="dp-poster" @click="playing = true" :aria-label="`${t.play}: ${disc.name}`">
            <img :key="disc.id" :src="`https://i.ytimg.com/vi/${disc.id}/hqdefault.jpg`" alt="" loading="lazy" @error="(e) => (e.target.style.visibility = 'hidden')" />
            <span class="dp-play" aria-hidden="true" />
          </button>
        </div>
        <div class="dp-now">
          <div class="dp-now-text">
            <b>{{ disc.name }}</b>
            <span>{{ t.disc }} {{ current + 1 }} / {{ DISCS.length }} · {{ disc.length }}</span>
          </div>
          <a class="dp-yt" :href="watchUrl" target="_blank" rel="noopener">{{ t.youtube }}</a>
        </div>
      </div>

      <ol class="dp-list" :aria-label="t.list">
        <li v-for="(d, i) in DISCS" :key="d.id">
          <button type="button" class="dp-item" :class="{ on: i === current }" :aria-current="i === current ? 'true' : undefined" @click="select(i)">
            <span class="dp-disc" aria-hidden="true" />
            <span class="dp-name">{{ d.name }}</span>
            <span class="dp-len">{{ d.length }}</span>
          </button>
        </li>
      </ol>
    </div>

    <a class="dp-channel" :href="CHANNEL" target="_blank" rel="noopener">{{ t.channel }} →</a>
  </section>
</template>

<style scoped>
/* Windows Media Player 11 era: glass frame, dark stage, a big round play orb. */
.dp {
  margin: 20px 0 8px;
  padding: 0 8px 10px;
  border-radius: 14px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
}
.dp-head { display: flex; align-items: center; gap: 10px; height: 36px; padding-left: 8px; }
.dp-title { flex: 1; font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }
.dp-caps { display: flex; align-self: flex-start; overflow: hidden; border: 1px solid rgba(0, 30, 60, 0.35); border-top: 0; border-radius: 0 0 6px 6px; }
.dp-caps span { width: 24px; height: 17px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.2) 50%, rgba(120, 170, 210, 0.25) 50%, rgba(255, 255, 255, 0.35)); border-left: 1px solid rgba(0, 30, 60, 0.25); }
.dp-caps span:first-child { border-left: 0; }
.dp-caps .x { width: 40px; background: linear-gradient(180deg, #f6a99a, #e35b40 50%, #c4321c 50%, #e0603f); }

.dp-body {
  display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 10px;
  padding: 10px; border-radius: 10px;
  background: #06101f; border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 40px rgba(139, 92, 246, 0.14);
}
@media (max-width: 720px) { .dp-body { grid-template-columns: 1fr; } }

.dp-stage { display: grid; gap: 10px; align-content: start; min-width: 0; }
.dp-screen { position: relative; aspect-ratio: 16 / 9; max-width: 100%; border-radius: 8px; overflow: hidden; background: #000; }
.dp-screen iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.dp-poster { position: absolute; inset: 0; padding: 0; border: 0; cursor: pointer; background: #000; }
.dp-poster img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; transition: opacity 0.2s ease; }
.dp-poster:hover img { opacity: 1; }
.dp-play { /* the round WMP play orb */
  position: absolute; left: 50%; top: 50%; width: 68px; height: 68px; transform: translate(-50%, -50%);
  border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.6);
  background:
    radial-gradient(ellipse 62% 42% at 50% 22%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, #c4adff, #8b5cf6 45%, #4c2a9e);
  box-shadow: 0 8px 24px -6px rgba(139, 92, 246, 0.8), inset 0 -3px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dp-play::after { content: ''; position: absolute; left: 53%; top: 50%; transform: translate(-50%, -50%); border-style: solid; border-width: 13px 0 13px 21px; border-color: transparent transparent transparent #fff; filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4)); }
.dp-poster:hover .dp-play, .dp-poster:focus-visible .dp-play { transform: translate(-50%, -50%) scale(1.1); }
.dp-poster:focus-visible { outline: 2px solid #c4adff; outline-offset: -2px; }

.dp-now { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 2px 4px; }
.dp-now-text { display: grid; min-width: 0; }
.dp-now-text b { color: #eef2ff; font-size: 15px; }
.dp-now-text span { color: #8f9cc0; font: 12px var(--vp-font-family-mono); font-variant-numeric: tabular-nums; }
.dp-yt {
  font-size: 12.5px; font-weight: 600; color: #eef2ff !important; text-decoration: none !important; white-space: nowrap;
  padding: 6px 13px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}
.dp-yt:hover { border-color: rgba(255, 255, 255, 0.5); }

.dp-list { list-style: none !important; margin: 0 !important; padding: 0 !important; display: grid; gap: 2px; align-content: start; max-height: 360px; overflow-y: auto; }
.dp-list li { margin: 0 !important; padding: 0 !important; }
.dp-list li::before, .dp-list li::after { display: none !important; }
.dp-item {
  width: 100%; display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; gap: 10px; align-items: center;
  padding: 7px 10px; border-radius: 8px; border: 1px solid transparent; background: transparent; text-align: left; cursor: pointer;
  color: #c8d2ea; font-size: 13.5px;
}
.dp-item:hover { background: rgba(255, 255, 255, 0.05); }
.dp-item.on { color: #fff; border-color: rgba(196, 173, 255, 0.35); background: linear-gradient(180deg, rgba(196, 173, 255, 0.22), rgba(139, 92, 246, 0.08)); }
.dp-item:focus-visible { outline: 2px solid #c4adff; outline-offset: -2px; }
.dp-disc { /* a tiny record: dark vinyl, violet label */
  width: 20px; height: 20px; border-radius: 50%;
  background:
    radial-gradient(circle, #fff 0 1.5px, #8b5cf6 2px 5px, transparent 5.5px),
    repeating-radial-gradient(circle, #1b1b24 0 1px, #2a2a36 1.5px 2.5px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}
.dp-item.on .dp-disc { animation: dp-spin 2.4s linear infinite; }
@keyframes dp-spin { to { transform: rotate(360deg); } }
.dp-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dp-len { font: 12px var(--vp-font-family-mono); color: #8f9cc0; font-variant-numeric: tabular-nums; }

.dp-channel { display: inline-block; margin: 10px 4px 0; font-size: 13.5px; font-weight: 600; }

@media (prefers-reduced-motion: reduce) { .dp-item.on .dp-disc { animation: none; } .dp-play { transition: none; } }
</style>
