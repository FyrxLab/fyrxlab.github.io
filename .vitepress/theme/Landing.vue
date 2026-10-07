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

/* Decorative aero bubbles in the hero sky — fixed positions, no randomness,
   so SSR and client render the same markup. */
const bubbles = [
  { '--x': '5%', '--y': '14%', '--s': '38px', '--d': '8s' },
  { '--x': '42%', '--y': '9%', '--s': '18px', '--d': '7s' },
  { '--x': '48%', '--y': '72%', '--s': '52px', '--d': '10s' },
  { '--x': '93%', '--y': '12%', '--s': '28px', '--d': '9s' },
  { '--x': '30%', '--y': '86%', '--s': '14px', '--d': '6s' },
  { '--x': '86%', '--y': '80%', '--s': '22px', '--d': '11s' }
]

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
      <div class="sky-deco" aria-hidden="true">
        <span v-for="(b, i) in bubbles" :key="i" class="bubble" :style="b" />
        <svg class="swoosh" viewBox="0 0 1000 140" preserveAspectRatio="none">
          <defs>
            <linearGradient id="aero-sw" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset=".5" stop-color="#fff" stop-opacity="1" /><stop offset="1" stop-color="#fff" stop-opacity="0" /></linearGradient>
            <mask id="aero-swm"><rect width="1000" height="140" fill="url(#aero-sw)" /></mask>
          </defs>
          <g mask="url(#aero-swm)">
            <path d="M0 120 C 250 40, 520 150, 1000 50" stroke-width="2.5" opacity=".9" />
            <path d="M0 132 C 300 70, 560 160, 1000 80" stroke-width="1.2" opacity=".6" />
            <path d="M0 110 C 220 30, 600 130, 1000 30" stroke-width="10" opacity=".12" />
          </g>
        </svg>
      </div>

      <div class="hero-grid">
        <div class="hero-copy">
          <h1 class="hero-word">Fyrx<span class="lab">Lab</span></h1>
          <p class="hero-sub">{{ t.heroSub }}</p>
          <div class="hero-actions">
            <a class="gloss" href="#flagship">{{ t.ctaPrimary }}</a>
            <a class="gloss glass-btn" href="#portfolio">{{ t.ctaGhost }}</a>
          </div>
        </div>

        <div class="win">
          <div class="win-head">
            <span class="win-title">fyrxlab@boot · status</span>
            <span class="caps" aria-hidden="true"><span class="min" /><span class="max" /><span class="x" /></span>
          </div>
          <div class="screen terminal-body">
            <div v-if="heroSearching" class="dim">{{ heroTyping }}<span class="caret" /></div>
            <template v-else>
              <div v-for="(line, i) in heroLines" :key="i"><span class="tag">[</span><span class="ok">OK</span><span class="tag">]</span> {{ line }}</div>
              <div class="dim">{{ heroTyping }}<span class="caret" /></div>
            </template>
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

        <div class="win" data-flagship-terminal>
          <div class="win-head">
            <span class="win-title">console.log · solver</span>
            <span class="demo-badge">DEMO</span>
            <span class="caps" aria-hidden="true"><span class="min" /><span class="max" /><span class="x" /></span>
          </div>
          <div class="screen term-body">
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
          <span class="orb" />
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
/* Aero × Terminal: the frame (sky, glass, gloss, type) is Frutiger Aero;
   anything shown on a screen stays dark and monospaced. Day sky in light
   mode, "night aero" (deep water + aurora) in dark mode. */
.landing {
  --l-ink: #06304f;
  --l-ink-2: #24577c;
  --l-word: linear-gradient(180deg, #0d6fb0 0%, #1aa3dd 55%, #0b5e98 100%);
  --l-sky: linear-gradient(180deg, #4fb8ee 0%, #9fdcfb 38%, #d9f3ff 72%, var(--vp-c-bg) 100%);
  --l-aurora: linear-gradient(transparent, transparent);
  --l-clouds: 1;
  --l-swoosh: #ffffff;
  --l-gold: #8a6206;
  /* screens are always dark, in both themes */
  --s-bg: #06101f;
  --s-text: #cfe3f5;
  --s-dim: #6f8aa6;
  --s-line: #1f3a57;
  --s-ok: #7ee07a;
  --s-red: #ff7b7b;
  --s-warn: #ffcd5a;
  --s-gold: #f1c40f;
  font-family: var(--vp-font-family-base);
}
html.dark .landing {
  --l-ink: #eaf6ff;
  --l-ink-2: #a9cfe8;
  --l-word: linear-gradient(180deg, #ffffff 0%, #bfe9ff 55%, #7fd0f5 100%);
  --l-sky: linear-gradient(180deg, #020b1a 0%, #062a4d 50%, #0a4a6e 85%, var(--vp-c-bg) 100%);
  --l-aurora: radial-gradient(60% 50% at 72% 30%, rgba(80, 230, 170, 0.22), transparent 70%), radial-gradient(50% 40% at 22% 12%, rgba(80, 170, 255, 0.22), transparent 70%);
  --l-clouds: 0.08;
  --l-swoosh: #7fe3ff;
  --l-gold: #f1c40f;
}

.landing section[id] { scroll-margin-top: var(--vp-nav-height); }

.eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  gap: 10px;
}
.eyebrow::before {
  content: '';
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--vp-c-brand-2);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-2) 18%, transparent);
}

/* ---------- hero: the sky ---------- */
.hero {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  align-items: center;
  padding: 24px 24px 110px;
  overflow: hidden;
  background:
    radial-gradient(600px 500px at var(--gx, 50%) var(--gy, 40%), rgba(255, 255, 255, 0.22), transparent 60%),
    var(--l-aurora),
    var(--l-sky);
}
.hero::before { /* clouds by day, almost nothing by night */
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  opacity: var(--l-clouds);
  background:
    radial-gradient(260px 70px at 80% 74%, rgba(255, 255, 255, 0.9), transparent 70%),
    radial-gradient(190px 50px at 90% 66%, rgba(255, 255, 255, 0.8), transparent 70%),
    radial-gradient(320px 80px at 10% 92%, rgba(255, 255, 255, 0.85), transparent 70%),
    radial-gradient(120% 60% at 50% -15%, rgba(255, 255, 255, 0.55), transparent 55%);
}
.sky-deco { position: absolute; inset: 0; pointer-events: none; }
.bubble {
  position: absolute; left: var(--x); top: var(--y); width: var(--s); height: var(--s); border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0 8%, rgba(255, 255, 255, 0.25) 22%, rgba(160, 225, 255, 0.12) 55%, rgba(255, 255, 255, 0.45) 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  animation: rise var(--d, 9s) ease-in-out infinite alternate;
}
html.dark .bubble { opacity: 0.55; }
@keyframes rise { to { transform: translateY(-18px); } }
.swoosh { position: absolute; left: 0; right: 0; bottom: 40px; width: 100%; height: 140px; }
.swoosh path { fill: none; stroke: var(--l-swoosh); }

.hero-grid {
  position: relative; z-index: 1;
  max-width: 1040px; margin: 0 auto; width: 100%;
  display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px; align-items: center;
}
@media (max-width: 800px) { .hero-grid { grid-template-columns: 1fr; gap: 36px; } }
.hero-copy { min-width: 0; }

.hero-word {
  margin: 0; padding-bottom: 6px;
  font: 700 clamp(48px, 7vw, 80px)/1 var(--vp-font-family-base);
  letter-spacing: -0.02em;
  background: var(--l-word);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.6)) drop-shadow(0 6px 14px rgba(6, 60, 110, 0.25));
  -webkit-box-reflect: below -10px linear-gradient(transparent 60%, rgba(255, 255, 255, 0.25));
}
.hero-word .lab { font-weight: 400; }
.hero-sub { max-width: 42ch; margin: 22px 0 0; font-size: 17.5px; line-height: 1.6; color: var(--l-ink); }
.hero-actions { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }

/* gloss recipe: base gradient + hard-cut highlight on the top half */
.gloss {
  --g-top: #7fd6fb; --g-mid: #1a9bd6; --g-bot: #0877bd; --g-edge: #065f96;
  position: relative; isolation: isolate;
  display: inline-flex; align-items: center; gap: 8px;
  font: 700 14px/1 var(--vp-font-family-base);
  color: #fff; text-decoration: none;
  padding: 13px 22px; border-radius: 999px; border: 1px solid var(--g-edge);
  background: linear-gradient(180deg, var(--g-top), var(--g-mid) 50%, var(--g-bot) 50%, var(--g-mid));
  text-shadow: 0 1px 2px rgba(0, 40, 80, 0.65);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 8px 18px -8px var(--g-bot);
  transition: transform 0.15s ease, filter 0.15s ease;
}
.gloss::before {
  content: ''; position: absolute; z-index: -1; left: 3px; right: 3px; top: 1px; height: 46%;
  border-radius: 999px 999px 14px 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.08));
}
.gloss:hover { filter: brightness(1.08) saturate(1.1); transform: translateY(-1px); }
.gloss:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.glass-btn {
  --g-top: rgba(255, 255, 255, 0.7); --g-mid: rgba(255, 255, 255, 0.3); --g-bot: rgba(255, 255, 255, 0.12);
  --g-edge: var(--glass-border);
  color: var(--l-ink); text-shadow: none;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}
html.dark .glass-btn {
  --g-top: rgba(170, 225, 255, 0.22); --g-mid: rgba(140, 210, 255, 0.1); --g-bot: rgba(140, 210, 255, 0.04);
}
html.dark .glass-btn::before { background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.03)); }

.scroll-cue {
  position: absolute; z-index: 1; left: 50%; bottom: 28px; transform: translateX(-50%);
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--glass-border); border-radius: 50%; color: var(--l-ink);
  background: linear-gradient(180deg, var(--glass-hl), transparent);
  backdrop-filter: blur(6px);
  animation: cue-bob 2.2s ease-in-out infinite;
}
@keyframes cue-bob { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }

/* ---------- aero window: glass chrome, dark screen inside ---------- */
.win {
  position: relative; min-width: 0;
  padding: 0 7px 7px; border-radius: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), 0 30px 60px -30px rgba(6, 48, 79, 0.55);
  backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%);
}
.win::after { /* diagonal reflection across the frame */
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.4) 38%, transparent 46%);
}
html.dark .win::after { background: linear-gradient(115deg, transparent 30%, rgba(190, 235, 255, 0.12) 38%, transparent 46%); }
.win-head { display: flex; align-items: center; gap: 10px; height: 34px; padding-left: 6px; }
.win-title {
  flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font: 600 12.5px var(--vp-font-family-base); color: var(--l-ink);
}
.demo-badge {
  font: 600 9.5px var(--vp-font-family-mono); letter-spacing: 0.08em; color: var(--l-ink-2);
  border: 1px solid var(--glass-border); border-radius: 999px; padding: 2px 7px;
}
.caps {
  display: flex; align-self: flex-start; overflow: hidden;
  border: 1px solid rgba(0, 30, 60, 0.35); border-top: 0; border-radius: 0 0 6px 6px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}
.caps span {
  position: relative; width: 26px; height: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.2) 50%, rgba(120, 170, 210, 0.25) 50%, rgba(255, 255, 255, 0.35));
  border-left: 1px solid rgba(0, 30, 60, 0.25);
}
.caps span:first-child { border-left: 0; }
.caps .x { width: 42px; background: linear-gradient(180deg, #f6a99a, #e35b40 50%, #c4321c 50%, #e0603f); }
.caps span::after { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: #fff; box-shadow: 0 0 1px rgba(0, 0, 0, 0.6); }
.caps .min::after { width: 8px; height: 2px; top: 62%; }
.caps .max::after { width: 8px; height: 6px; background: transparent; border: 1.5px solid #fff; border-top-width: 2.5px; }
.caps .x::after { width: 9px; height: 2px; transform: translate(-50%, -50%) rotate(45deg); box-shadow: none; }
.caps .x::before { content: ''; position: absolute; left: 50%; top: 50%; width: 9px; height: 2px; background: #fff; transform: translate(-50%, -50%) rotate(-45deg); }

.screen {
  position: relative; z-index: 1;
  border-radius: 6px; background: var(--s-bg); border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 30px rgba(30, 120, 200, 0.12);
  font-family: var(--vp-font-family-mono); color: var(--s-text);
}
.terminal-body { padding: 18px 20px 22px; font-size: 13.5px; line-height: 1.85; min-height: 158px; }
.terminal-body .ok { color: var(--s-ok); }
.terminal-body .tag, .terminal-body .dim { color: var(--s-dim); }
.caret {
  display: inline-block; width: 8px; height: 15px;
  background: #4fc3f7; margin-left: 6px; vertical-align: -2px;
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* ---------- flagship ---------- */
.flagship { max-width: 1040px; margin: 0 auto; padding: 72px 24px 0; }
.flagship-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
.flagship-title { font: 700 28px/1.2 var(--vp-font-family-base); color: var(--vp-c-text-1); margin: 0; border: 0; padding: 0; letter-spacing: -0.01em; }
.flagship-title span { color: var(--l-gold); }
.flagship-ver {
  font: 600 12px/1 var(--vp-font-family-mono); color: #4d3700;
  padding: 6px 12px; border-radius: 999px; border: 1px solid #c79d12;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.15) 50%, transparent 50%), linear-gradient(180deg, #fff3b8, #f6d443 50%, #e9bd17 50%, #f5d24a);
}
.flagship-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 32px; align-items: start; }
@media (max-width: 800px) { .flagship-grid { grid-template-columns: 1fr; } }
.flagship-copy { min-width: 0; }
.flagship-copy p { color: var(--vp-c-text-2); line-height: 1.75; font-size: 15.5px; margin: 0 0 18px; }
.flagship-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.flagship-list li { font-size: 14.5px; color: var(--vp-c-text-2); padding-left: 22px; position: relative; line-height: 1.6; }
.flagship-list li::before {
  content: ''; position: absolute; left: 0; top: 0.5em; width: 10px; height: 10px; border-radius: 50%;
  background: radial-gradient(ellipse 60% 40% at 50% 25%, rgba(255, 255, 255, 0.9), transparent 70%), radial-gradient(circle at 50% 120%, #fff1a8, #f1c40f 45%, #a07d05);
}
.flagship-list b { color: var(--vp-c-text-1); font-weight: 600; }

.term-body { padding: 16px 18px 20px; font-size: 12.5px; line-height: 1.8; min-height: 260px; }
.term-line { white-space: pre-wrap; word-break: break-word; }
.term-line.info { color: var(--s-dim); }
.term-line.error { color: var(--s-red); }
.term-line.warn { color: var(--s-warn); }
.term-line.fyrx {
  display: block; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--s-line);
  color: #e7f2fc; font-size: 13px; line-height: 1.65;
}
.term-line.meta { margin-top: 8px; color: var(--s-dim); font-size: 11.5px; }
.fyrx-tag { color: var(--s-gold); font-weight: 700; margin-right: 6px; }
.spinner-line { color: var(--s-dim); }
.spinner { color: #4fc3f7; display: inline-block; width: 1ch; }

/* ---------- portfolio: glass panel, one glossy orb per product ---------- */
.portfolio { max-width: 1040px; margin: 0 auto; padding: 96px 24px 0; }
.portfolio-title { font: 700 26px/1.2 var(--vp-font-family-base); margin: 10px 0 0; color: var(--vp-c-text-1); border: 0; padding: 0; letter-spacing: -0.01em; }
.portfolio-sub { color: var(--vp-c-text-2); font-size: 15px; margin: 8px 0 24px; max-width: 60ch; line-height: 1.6; }

.dirlisting {
  padding: 6px; border-radius: 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 var(--glass-hl), var(--glass-shadow);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.dir-row {
  display: grid; grid-template-columns: 26px minmax(0, 1.3fr) 80px 72px minmax(0, 2.2fr); gap: 14px; align-items: center;
  padding: 11px 12px; border-radius: 11px; text-decoration: none; color: var(--vp-c-text-1);
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.dir-row:hover { background: linear-gradient(180deg, var(--glass-hl), transparent); box-shadow: inset 0 0 0 1px var(--glass-border); }
.dir-row:hover .orb { transform: translateY(-2px) scale(1.08); }
@media (max-width: 640px) {
  .dir-row { grid-template-columns: 24px minmax(0, 1fr) 64px; }
  .dir-kind, .dir-tag { display: none; }
}
.orb {
  width: 22px; height: 22px; border-radius: 50%;
  background:
    radial-gradient(ellipse 62% 42% at 50% 24%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0) 72%),
    radial-gradient(circle at 50% 120%, color-mix(in srgb, var(--row-accent) 55%, white), var(--row-accent) 45%, color-mix(in srgb, var(--row-accent) 55%, black));
  box-shadow: 0 2px 6px -1px color-mix(in srgb, var(--row-accent) 70%, transparent);
  transition: transform 0.2s ease;
}
.dir-name { font-weight: 700; transition: color 0.15s ease; }
.dir-ver { color: var(--vp-c-text-3); font: 12px var(--vp-font-family-mono); font-variant-numeric: tabular-nums; }
.dir-kind { color: var(--vp-c-text-3); font: 11px var(--vp-font-family-mono); text-transform: uppercase; letter-spacing: 0.05em; }
.dir-tag { color: var(--vp-c-text-2); font-size: 13px; line-height: 1.45; }

/* ---------- about ---------- */
.about { max-width: 1040px; margin: 0 auto; padding: 96px 24px 0; }
.about-grid { display: grid; grid-template-columns: 200px 1fr; gap: 40px; }
@media (max-width: 640px) { .about-grid { grid-template-columns: 1fr; gap: 20px; } }
.about-label { font-family: var(--vp-font-family-mono); font-size: 12px; color: var(--vp-c-text-3); letter-spacing: 0.08em; text-transform: uppercase; padding-top: 4px; }
.about-body p { font-size: 16.5px; line-height: 1.75; color: var(--vp-c-text-2); margin: 0 0 16px; max-width: 62ch; }
.about-body strong { color: var(--vp-c-text-1); }
.about-facts { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 13px; }
.fact {
  border: 1px solid var(--glass-border); border-radius: 999px; padding: 6px 14px; color: var(--vp-c-text-2);
  background: linear-gradient(180deg, var(--glass-hl), transparent 60%), var(--glass-bg);
  box-shadow: var(--glass-shadow);
  transition: transform 0.15s ease;
}
.fact:hover { transform: translateY(-1px); }
.fact b { color: var(--vp-c-text-1); }

@media (prefers-reduced-motion: reduce) {
  .bubble, .caret, .scroll-cue { animation: none; }
}
</style>
