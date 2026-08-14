---
layout: home

hero:
  name: "FyrxAI"
  text: "Drop-in AI Support Agent for Discord Bots"
  tagline: "Add an AI-powered support agent to your own discord.js bot in minutes — configured entirely from Discord, no code edits, no environment variables."
  actions:
    - theme: brand
      text: Get Started
      link: /en/fyrxai/configuration
    - theme: alt
      text: View on GitHub
      link: https://github.com/FyrxLab/fyrx-ai
    - theme: alt
      text: Español
      link: /es/fyrxai/

---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-robot"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Why FyrxAI</span>
    <h3>Point it at your docs, not your codebase</h3>
    <p>FyrxAI is a small library, not a hosted service — you install it into your own bot. Give it one or more documentation sites with <code>/fyrxai wiki add</code> and it crawls them, extracts keywords, and starts answering questions in your support channels automatically. No dataset to prepare by hand.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">What You Get</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-spider"></i>
    <div><b>Whole-Site Crawling</b><p>Point <code>/fyrxai wiki add</code> at a single page and it discovers the rest via <code>llms.txt</code>, <code>sitemap.xml</code>, or by following same-origin links.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-layer-group"></i>
    <div><b>Three-Layer Topic Detection</b><p>Exact match, then fuzzy (typo-tolerant) match, then a local offline embedding model — no AI call spent figuring out what a question is about.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-plug"></i>
    <div><b>Bring Your Own Provider</b><p>WaveSpeed, OpenRouter, Google AI Studio, or Claude Platform — pick one per server, configured with an ephemeral slash command reply.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-shield-halved"></i>
    <div><b>Nothing Hardcoded</b><p>Every channel, wiki, provider, and permission is set from Discord chat. Install the package and it ships with zero configuration files.</p></div>
  </div>
</div>

</div>

## Install

```bash
npm install github:FyrxLab/fyrx-ai
```

```js
// CommonJS
const setupFyrxAI = require('fyrxai');
setupFyrxAI(client);
```

```js
// ES modules
import setupFyrxAI from 'fyrxai';
setupFyrxAI(client);
```

Continue to [Configuration](/en/fyrxai/configuration) for the Discord-side setup.
