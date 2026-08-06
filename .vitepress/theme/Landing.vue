<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { PRODUCTS, PRODUCT_ORDER } from './productPalette.js'
import { LANDING_COPY, SCENARIO_TEXT } from './landingCopy.js'

const route = useRoute()
const locale = computed(() => ['es', 'it', 'pt'].find((l) => route.path.startsWith(`/${l}/`)) || 'en')
const t = computed(() => LANDING_COPY[locale.value])

const solver = PRODUCTS.solver

const products = reactive(
  PRODUCT_ORDER.map((key) => {
    const p = PRODUCTS[key]
    return { key, ...p, link: `/${locale.value}${p.home}`, displayVersion: p.version ? '0.0.0' : null, counted: false }
  })
)

const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function typeInto(target, text, speed = 16) {
  if (reducedMotion) { target.value = text; return }
  let out = ''
  for (const ch of text) {
    out += ch
    target.value = out
    await sleep(speed)
  }
}

/* ---------- hero: aero glass specular highlight, follows the cursor ---------- */
const heroGlowX = ref('50%')
const heroGlowY = ref('40%')
function onHeroMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  heroGlowX.value = `${((e.clientX - rect.left) / rect.width) * 100}%`
  heroGlowY.value = `${((e.clientY - rect.top) / rect.height) * 100}%`
}

/* ---------- hero: boot sequence ---------- */
const heroSearching = ref(true)
const heroTyping = ref('')
const heroLines = ref([])

async function runHeroBoot() {
  const bootStatusLines = t.value.bootLines
  const finalLine = t.value.heroFinal(products.length)
  if (reducedMotion) {
    heroSearching.value = false
    heroLines.value = bootStatusLines
    heroTyping.value = finalLine
    return
  }
  await sleep(300)
  await typeInto(heroTyping, t.value.heroSearching, 22)
  await sleep(650)
  heroSearching.value = false
  heroTyping.value = ''
  for (const line of bootStatusLines) {
    await typeInto(heroTyping, line, 10)
    heroLines.value.push(line)
    heroTyping.value = ''
    await sleep(120)
  }
  await typeInto(heroTyping, finalLine, 12)
}

/* ---------- portfolio: version odometer on scroll ---------- */
function spinVersion(product) {
  if (product.counted || !product.version) return
  product.counted = true
  if (reducedMotion) { product.displayVersion = product.version; return }
  const steps = 16
  let i = 0
  const id = setInterval(() => {
    i++
    if (i >= steps) {
      product.displayVersion = product.version
      clearInterval(id)
      return
    }
    product.displayVersion = `0.${Math.min(9, Math.floor((i * 11) / steps))}.${(i * 7) % 10}`
  }, 45)
}

let portfolioObserver

/* ---------- flagship: Solver terminal theatre ---------- */
const flagshipLines = ref([])
const flagshipTyping = ref('')
const flagshipTypingClass = ref('info')
const flagshipSpinning = ref(false)
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const spinnerFrame = ref(spinnerFrames[0])
let spinnerTimer = null
let flagshipObserver
let flagshipStarted = false
let flagshipAlive = true

const DWELL_MS = 7000

/* Each scenario demonstrates one of the four Solver capabilities listed in the
   copy beside it (crash analysis x2, TickMonitor, chat moderation, sanctions) —
   picked at random per cycle, not just cosmetic variety. The raw console
   `lines` stay in English always (see landingCopy.js) — only the diagnosis
   and meta line, looked up by index from SCENARIO_TEXT, are localized. */
const scenarioLines = [
  [
    { cls: 'info', text: '[03:12:44 INFO]: Starting minecraft server version 1.20.1' },
    { cls: 'info', text: '[03:12:44 INFO]: Loading properties' },
    { cls: 'info', text: '[03:12:45 INFO]: Preparing level "world"' },
    { cls: 'info', text: '[03:12:46 INFO]: Preparing spawn area: 100%' },
    { cls: 'error', text: '[03:12:47 ERROR]: Error occurred while enabling PluginA v2.3.0' },
    { cls: 'error', text: '[03:12:47 ERROR]: java.lang.IllegalStateException: Listener already registered' }
  ],
  [
    { cls: 'info', text: '[03:41:02 INFO]: [Solver] TickMonitor: main thread nominal (20.0 TPS)' },
    { cls: 'warn', text: '[03:41:19 WARN]: [Solver] TickMonitor: no tick in 4200ms, thread may be frozen' },
    { cls: 'error', text: '[03:41:24 ERROR]: [Solver] TickMonitor: watchdog threshold exceeded, dumping thread' }
  ],
  [
    { cls: 'info', text: '[02:15:33 INFO]: Heap usage: 3.8GB / 4.0GB' },
    { cls: 'error', text: '[02:15:41 ERROR]: java.lang.OutOfMemoryError: Java heap space' },
    { cls: 'error', text: '[02:15:41 ERROR]:   at ChunkGeneratorX.generate(ChunkGeneratorX.java:112)' }
  ],
  [
    { cls: 'info', text: '[14:02:07] <Player92> uninstall or i find where u live' },
    { cls: 'info', text: '[14:02:07 INFO]: [Solver] Moderation: scanning message context' }
  ],
  [
    { cls: 'info', text: '[19:22:10 INFO]: [Solver] checkuser: xXDestroyerXx' },
    { cls: 'info', text: '[19:22:10 INFO]: [Solver] 2 accounts share IP 203.0.113.44' },
    { cls: 'warn', text: '[19:22:11 WARN]: [Solver] shared-IP account is currently online' }
  ]
]

let lastScenarioIndex = -1
function pickScenarioIndex() {
  if (scenarioLines.length === 1) return 0
  let idx
  do { idx = Math.floor(Math.random() * scenarioLines.length) } while (idx === lastScenarioIndex)
  lastScenarioIndex = idx
  return idx
}

async function playScenario(idx) {
  const scenario = { lines: scenarioLines[idx], ...SCENARIO_TEXT[locale.value][idx] }
  flagshipLines.value = []
  for (const line of scenario.lines) {
    flagshipTypingClass.value = line.cls
    await typeInto(flagshipTyping, line.text, line.cls === 'error' ? 10 : 6)
    if (!flagshipAlive) return
    flagshipLines.value.push(line)
    flagshipTyping.value = ''
    await sleep(line.cls === 'error' ? 260 : 80)
  }
  if (!flagshipAlive) return
  await sleep(300)
  flagshipSpinning.value = true
  spinnerTimer = setInterval(() => {
    spinnerFrame.value = spinnerFrames[(spinnerFrames.indexOf(spinnerFrame.value) + 1) % spinnerFrames.length]
  }, 80)
  await sleep(1400)
  clearInterval(spinnerTimer)
  if (!flagshipAlive) return
  flagshipSpinning.value = false
  flagshipTypingClass.value = 'fyrx'
  await typeInto(flagshipTyping, scenario.diagnosis, 14)
  if (!flagshipAlive) return
  flagshipLines.value.push({ cls: 'fyrx', text: scenario.diagnosis })
  flagshipTyping.value = ''
  flagshipLines.value.push({ cls: 'meta', text: scenario.meta })
}

async function runFlagshipTerminal() {
  if (reducedMotion) {
    const idx = pickScenarioIndex()
    const s = SCENARIO_TEXT[locale.value][idx]
    flagshipLines.value = [...scenarioLines[idx], { cls: 'fyrx', text: s.diagnosis }, { cls: 'meta', text: s.meta }]
    return
  }
  while (flagshipAlive) {
    await playScenario(pickScenarioIndex())
    if (!flagshipAlive) return
    await sleep(DWELL_MS)
  }
}

onMounted(() => {
  runHeroBoot()

  portfolioObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const key = entry.target.getAttribute('data-version-row')
        const product = products.find((p) => p.key === key)
        if (product) spinVersion(product)
        portfolioObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.4 }
  )
  document.querySelectorAll('[data-version-row]').forEach((el) => portfolioObserver.observe(el))

  flagshipObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !flagshipStarted) {
          flagshipStarted = true
          runFlagshipTerminal()
          flagshipObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.35 }
  )
  const flagshipEl = document.querySelector('[data-flagship-terminal]')
  if (flagshipEl) flagshipObserver.observe(flagshipEl)
})

onUnmounted(() => {
  flagshipAlive = false
  if (portfolioObserver) portfolioObserver.disconnect()
  if (flagshipObserver) flagshipObserver.disconnect()
  if (spinnerTimer) clearInterval(spinnerTimer)
})
</script>

<template>
  <div class="landing">
    <section class="hero" @mousemove="onHeroMouseMove" :style="{ '--gx': heroGlowX, '--gy': heroGlowY }">
      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="hero-word">Fyrx<span class="lab">Lab</span></h1>
          <p class="hero-sub">{{ t.heroSub }}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#flagship">{{ t.ctaPrimary }}</a>
            <a class="btn btn-ghost" href="#portfolio">{{ t.ctaGhost }}</a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="terminal">
            <div class="terminal-head">
              <span class="terminal-dot dot-red" /><span class="terminal-dot dot-yellow" /><span class="terminal-dot dot-green" />
              <span class="terminal-title">fyrxlab@boot — status</span>
            </div>
            <div class="terminal-body">
              <div v-if="heroSearching" class="dim">{{ heroTyping }}<span class="caret" /></div>
              <template v-else>
                <div v-for="(line, i) in heroLines" :key="i"><span class="tag">[</span><span class="ok">OK</span><span class="tag">]</span> {{ line }}</div>
                <div class="dim">{{ heroTyping }}<span class="caret" /></div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <a href="#flagship" class="scroll-cue" :aria-label="t.scrollAria">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </a>
    </section>

    <section class="flagship" id="flagship">
      <div class="flagship-head">
        <h2 class="flagship-title">{{ t.flagshipPrefix }}<span>AbsoluteSolver</span></h2>
        <span class="flagship-ver">v{{ solver.version }}</span>
      </div>

      <div class="flagship-grid">
        <div class="flagship-copy">
          <p>{{ t.flagshipParagraph }}</p>
          <ul class="flagship-list">
            <li v-for="(item, i) in t.flagshipBullets" :key="i"><b>{{ item.b }}</b> &mdash; {{ item.t }}</li>
          </ul>
        </div>

        <div class="term-window" data-flagship-terminal>
          <div class="terminal-head">
            <span class="terminal-dot dot-red" /><span class="terminal-dot dot-yellow" /><span class="terminal-dot dot-green" />
            <span class="terminal-title">console.log &mdash; solver</span>
            <span class="demo-badge">DEMO</span>
          </div>
          <div class="term-body">
            <div v-for="(line, i) in flagshipLines" :key="i" :class="['term-line', line.cls]">
              <span v-if="line.cls === 'fyrx'" class="fyrx-tag">Fyrx</span>{{ line.text }}
            </div>
            <div v-if="flagshipSpinning" class="term-line spinner-line"><span class="spinner">{{ spinnerFrame }}</span> {{ t.spinnerText }}</div>
            <div v-else-if="flagshipTyping" :class="['term-line', flagshipTypingClass]">
              <span v-if="flagshipTypingClass === 'fyrx'" class="fyrx-tag">Fyrx</span>{{ flagshipTyping }}<span class="caret" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="portfolio" id="portfolio">
      <div class="portfolio-head">
        <span class="eyebrow">{{ t.portfolioEyebrow }}</span>
        <h2 class="portfolio-title">{{ t.portfolioTitle }}</h2>
      </div>
      <p class="portfolio-sub">{{ t.portfolioSub }}</p>

      <div class="dirlisting">
        <a
          v-for="p in products"
          :key="p.key"
          class="dir-row"
          :style="{ '--row-accent': p.color }"
          :href="p.link"
          :data-version-row="p.version ? p.key : undefined"
        >
          <span class="dir-dot" />
          <span class="dir-name">{{ p.name }}</span>
          <span class="dir-kind">{{ p.kind }}</span>
          <span class="dir-ver">{{ p.version ? `v${p.displayVersion}` : '—' }}</span>
          <span class="dir-tag">{{ p.tagline[locale] || p.tagline.en }}</span>
        </a>
      </div>
    </section>

    <section class="about" id="about">
      <div class="about-grid">
        <span class="about-label">{{ t.aboutLabel }}</span>
        <div class="about-body">
          <p><strong>{{ t.aboutLead }}</strong>{{ t.aboutRest }}</p>
          <div class="about-facts">
            <span class="fact"><b>1</b> {{ t.factDeveloper }}</span>
            <span class="fact"><b>{{ products.length }}</b> {{ t.factActiveProducts }}</span>
            <span class="fact"><b>4</b> {{ t.factLanguages }}</span>
            <span class="fact">{{ t.factSolver }} <b>{{ t.factSolverLicense }}</b></span>
            <span class="fact">{{ t.factMods }} <b>{{ t.factModsLicense }}</b></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  --l-bg-inset: color-mix(in srgb, var(--vp-c-bg-soft) 92%, black 8%);
  --l-border: var(--vp-c-divider);
  --l-text-3: color-mix(in srgb, var(--vp-c-text-2) 65%, transparent);
  --l-accent-a: #5878ef;
  --l-accent-b: #2fa3f0;
  --l-accent-solid: #4f8ef7;
  --l-gold: #8a6206;
  --l-gold-bg: color-mix(in srgb, var(--l-gold) 10%, transparent);
  --l-gold-border: color-mix(in srgb, var(--l-gold) 32%, var(--l-border));
  --l-red: #c0392b;
  --l-warn: #8f5b00;
  --l-shadow: color-mix(in srgb, var(--l-accent-b) 12%, transparent);
  font-family: var(--vp-font-family-base);
}

html.dark .landing {
  --l-bg-inset: #0d1119;
  --l-border: #212a3d;
  --l-text-3: #5b6478;
  --l-gold: #f1c40f;
  --l-gold-bg: color-mix(in srgb, var(--l-gold) 14%, transparent);
  --l-gold-border: color-mix(in srgb, var(--l-gold) 35%, transparent);
  --l-red: #ff6b6b;
  --l-warn: #e0b23a;
  --l-shadow: color-mix(in srgb, var(--l-accent-b) 18%, transparent);
}

.landing section[id] { scroll-margin-top: var(--vp-nav-height); }

.eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--l-accent-solid);
  display: flex;
  align-items: center;
  gap: 10px;
}
.eyebrow::before {
  content: '';
  width: 7px; height: 7px;
  background: var(--l-accent-solid);
  box-shadow: 0 0 8px var(--l-accent-solid);
}

/* ---------- hero ---------- */
.hero-visual {
  position: relative;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.08));
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.45);
}
.hero-visual::after {
  content: '';
  position: absolute; top: 6px; left: 10%; right: 10%; height: 40%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent);
  pointer-events: none; filter: blur(2px);
}
/* The terminal elsewhere on the page follows the site's light/dark toggle
   (that's the original design) — but inside the fixed-vivid hero, a
   light-gray terminal reads as washed out. Re-scope the same tokens the
   theme toggle already uses, forced to their dark values, only here.
   Translucent + backdrop-filter (matching the approved aero preview's
   .aero-term) instead of a solid fill, so it reads as frosted glass over
   the hero gradient, not an opaque card dropped on top of it. */
.hero-visual {
  --l-bg-inset: rgba(8, 14, 34, 0.72);
  --l-border: rgba(255, 255, 255, 0.16);
  --l-text-3: #a9b8dd;
  --vp-c-bg-soft: rgba(255, 255, 255, 0.05);
  --vp-c-text-1: #e7ecf5;
  --vp-c-text-2: #9aa4b8;
}
.hero-visual .terminal { position: relative; z-index: 1; border-radius: 18px; backdrop-filter: blur(6px); }
.hero-visual .terminal-body .ok { color: #49a37b; }

/* Fixed vivid world, like the terminal — doesn't toggle with the site's
   light/dark switch. This is the one screen that gets to be a "trailer";
   everything below returns to the calm, theme-aware surface. */
.hero {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  align-items: center;
  padding: 24px 24px 96px;
  overflow: hidden;
  background:
    radial-gradient(600px 500px at var(--gx, 50%) var(--gy, 40%), rgba(255, 255, 255, 0.18), transparent 60%),
    linear-gradient(160deg, #081733 0%, #2a4fc9 48%, #1a70b8 100%);
}
.hero::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(120% 60% at 50% -10%, rgba(255, 255, 255, 0.35), transparent 55%);
}
.hero-grid {
  position: relative; z-index: 1;
  max-width: 1040px; margin: 0 auto; width: 100%;
  display: grid; grid-template-columns: 1.05fr 1fr; gap: 48px; align-items: center;
}
@media (max-width: 800px) { .hero-grid { grid-template-columns: 1fr; gap: 36px; } }

.scroll-cue {
  position: absolute; z-index: 1; left: 50%; bottom: 28px; transform: translateX(-50%);
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 50%; color: #eaf2ff;
  background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(4px);
  transition: border-color 0.2s ease, background 0.2s ease;
  animation: cue-bob 2.2s ease-in-out infinite;
}
.scroll-cue:hover { border-color: rgba(255, 255, 255, 0.8); background: rgba(255, 255, 255, 0.14); }
@keyframes cue-bob { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
@media (prefers-reduced-motion: reduce) { .scroll-cue { animation: none; } }

.terminal, .term-window {
  background: var(--l-bg-inset);
  border: 1px solid var(--l-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 40px 80px -40px var(--l-shadow);
}
.terminal-head {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--l-border);
  background: var(--vp-c-bg-soft);
}
.terminal-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--l-border); }
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }
.terminal-title { margin-left: 8px; font-family: var(--vp-font-family-mono); font-size: 11px; color: var(--l-text-3); }
.demo-badge {
  margin-left: auto; font-family: var(--vp-font-family-mono); font-size: 9.5px; letter-spacing: 0.08em;
  color: var(--l-text-3); border: 1px solid var(--l-border); border-radius: 4px; padding: 2px 6px;
}
.terminal-body {
  padding: 20px 20px 24px;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.85;
  color: var(--vp-c-text-1);
  min-height: 158px;
}
.terminal-body .ok { color: #3d9a6b; }
html.dark .terminal-body .ok { color: #49a37b; }
.terminal-body .tag { color: var(--l-text-3); }
.terminal-body .dim { color: var(--vp-c-text-2); }
.caret {
  display: inline-block; width: 8px; height: 15px;
  background: var(--l-accent-solid); margin-left: 6px; vertical-align: -2px;
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }

.hero-word { margin: 0; font-size: clamp(40px, 5.6vw, 64px); line-height: 1; letter-spacing: -0.01em; font-family: var(--vp-font-family-mono); font-weight: 600; color: #eaf2ff; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3); }
.hero-word .lab {
  background: linear-gradient(180deg, #ffffff, #cfe4ff);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}

.hero-sub { max-width: 46ch; margin: 18px 0 0; font-size: 17px; line-height: 1.6; color: #eaf2ff; text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25); }
.hero-actions { display: flex; gap: 12px; margin-top: 32px; flex-wrap: wrap; }
.btn {
  font-family: var(--vp-font-family-mono); font-size: 13px; padding: 12px 20px; border-radius: 999px;
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid transparent;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  background: linear-gradient(180deg, #ffffff, #cfe0ff); color: #0a1f52; font-weight: 700;
  box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.btn-ghost {
  border-color: rgba(255, 255, 255, 0.4); color: #eaf2ff; background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
}
.btn-ghost:hover { border-color: rgba(255, 255, 255, 0.7); background: rgba(255, 255, 255, 0.12); }

/* ---------- flagship ---------- */
.flagship { max-width: 1040px; margin: 0 auto; padding: 96px 24px 0; }
.flagship-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
.flagship-title { font-size: 26px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-weight: 600; margin: 0; }
.flagship-title span { color: var(--l-gold); }
.flagship-ver {
  font-family: var(--vp-font-family-mono); font-size: 12px; color: var(--l-gold);
  background: linear-gradient(160deg, color-mix(in srgb, var(--l-gold) 22%, transparent), var(--l-gold-bg));
  border: 1px solid var(--l-gold-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  padding: 3px 10px; border-radius: 999px;
}
.flagship-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 32px; align-items: start; }
@media (max-width: 800px) { .flagship-grid { grid-template-columns: 1fr; } }

.flagship-copy p { color: var(--vp-c-text-2); line-height: 1.7; font-size: 15px; margin: 0 0 18px; }
.flagship-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.flagship-list li { font-size: 14px; color: var(--vp-c-text-2); padding-left: 20px; position: relative; line-height: 1.55; }
.flagship-list li::before { content: '›'; position: absolute; left: 0; color: var(--l-gold); font-family: var(--vp-font-family-mono); font-weight: 700; }
.flagship-list b { color: var(--vp-c-text-1); font-weight: 600; }

.term-body {
  padding: 16px 18px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.8;
  min-height: 260px;
}
.term-line { white-space: pre-wrap; word-break: break-word; }
.term-line.info { color: var(--l-text-3); }
.term-line.error { color: var(--l-red); }
.term-line.warn { color: var(--l-warn); }
.term-line.fyrx {
  display: block; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--l-border);
  color: var(--vp-c-text-1); font-size: 13px; line-height: 1.65;
}
.term-line.meta { margin-top: 8px; color: var(--l-text-3); font-size: 11.5px; }
.fyrx-tag { color: var(--l-gold); font-weight: 700; margin-right: 6px; }
.spinner-line { color: var(--l-text-3); }
.spinner { color: var(--l-accent-solid); display: inline-block; width: 1ch; }

/* ---------- portfolio ---------- */
.portfolio { max-width: 1040px; margin: 0 auto; padding: 104px 24px 0; }
.portfolio-title { font-size: 22px; margin-top: 10px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-weight: 600; }
.portfolio-sub { color: var(--vp-c-text-2); font-size: 14.5px; margin: 8px 0 28px; max-width: 60ch; line-height: 1.6; }

.dirlisting {
  font-family: var(--vp-font-family-mono); font-size: 13px; border: 1px solid var(--l-border); border-radius: 8px; overflow: hidden;
  box-shadow: 0 24px 48px -32px var(--l-shadow);
}
.dir-row {
  display: grid; grid-template-columns: 22px 1.3fr 90px 78px 2.2fr; gap: 14px; align-items: center;
  padding: 14px 16px; text-decoration: none; color: var(--vp-c-text-1);
  border-top: 1px solid var(--l-border); transition: background 0.15s ease;
}
.dir-row:first-child { border-top: none; }
.dir-row:hover { background: var(--vp-c-bg-soft); }
.dir-row:hover .dir-name { color: var(--row-accent); }
@media (max-width: 640px) {
  .dir-row { grid-template-columns: 18px 1fr 70px; }
  .dir-kind, .dir-tag { display: none; }
}
.dir-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--row-accent); box-shadow: 0 0 6px var(--row-accent); }
.dir-name { font-weight: 600; transition: color 0.15s ease; }
.dir-ver { color: var(--l-text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
.dir-kind { color: var(--l-text-3); font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
.dir-tag { color: var(--vp-c-text-2); font-size: 12.5px; line-height: 1.4; font-family: var(--vp-font-family-base); }

/* ---------- about ---------- */
.about { max-width: 1040px; margin: 0 auto; padding: 96px 24px 0; }
.about-grid { display: grid; grid-template-columns: 200px 1fr; gap: 40px; }
@media (max-width: 640px) { .about-grid { grid-template-columns: 1fr; gap: 20px; } }
.about-label { font-family: var(--vp-font-family-mono); font-size: 12px; color: var(--l-text-3); letter-spacing: 0.06em; text-transform: uppercase; padding-top: 4px; }
.about-body p { font-size: 16px; line-height: 1.75; color: var(--vp-c-text-2); margin: 0 0 16px; max-width: 62ch; }
.about-body strong { color: var(--vp-c-text-1); }
.about-facts { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; font-family: var(--vp-font-family-mono); font-size: 12px; }
.fact {
  border: 1px solid var(--l-border); border-radius: 999px; padding: 6px 13px; color: var(--vp-c-text-2);
  background: linear-gradient(160deg, var(--vp-c-bg-soft), transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.fact:hover { border-color: var(--l-accent-solid); transform: translateY(-1px); }
html.dark .fact { box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06); }
.fact b { color: var(--vp-c-text-1); }
</style>
