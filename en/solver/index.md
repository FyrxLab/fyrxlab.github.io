---
layout: home

hero:
  name: "AbsoluteSolver"
  text: "AI-powered Server Diagnostics"
  tagline: "Meet Fyrx — your built-in AI assistant that automatically analyzes console errors, crash reports, and server lag in plain English."
  image:
    src: /solver.svg
    alt: AbsoluteSolver
  actions:
    - theme: brand
      text: Get Started
      link: /en/solver/getting-started
    - theme: alt
      text: View on Modrinth
      link: https://modrinth.com/plugin/solver
    - theme: alt
      text: Español
      link: /es/solver/getting-started
---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-brain"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Why AbsoluteSolver</span>
    <h3>Fyrx reads your server so you don't have to</h3>
    <p>Ships with Anthropic Claude by default — Google Gemini and any OpenAI-compatible endpoint are fully supported too. Fyrx turns cryptic Java stack traces, console spam, and lag spikes into a plain-language explanation of what actually happened.</p>
    <p class="spotlight-note">Every AI call runs on a background thread — analysis, file I/O, and network requests never touch your main thread. Your TPS doesn't know Fyrx is even there.</p>
  </div>
</div>

<div class="feature-group">

<div class="feature-group-title">Diagnostics</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><b>Live Console Monitor</b><p>Injected directly into the server's Log4j engine. Errors are intercepted the instant they happen — no digging through logs manually.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-explosion"></i>
    <div><b>Crash Analysis</b><p>Automatically scans crash-reports and JVM fatal error logs on startup. Fyrx tells you exactly what killed your server before you even ask.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-stopwatch"></i>
    <div><b>Tick Monitor</b><p>A lightweight background thread watches your TPS. If the main thread hangs for more than 5 seconds, Fyrx identifies the culprit plugin.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-clock-rotate-left"></i>
    <div><b>Early Startup Errors</b><p>Reads logs/latest.log on boot to catch dependency conflicts and version errors that happened before AbsoluteSolver even loaded.</p></div>
  </div>
</div>

</div>

<div class="feature-group">

<div class="feature-group-title">Moderation &amp; Safety</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-gavel"></i>
    <div><b>AI Chat Moderation</b><p>Fyrx reads the actual context of a conversation, not a word blacklist, and backs every verdict with a confidence score before anything happens.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-scale-balanced"></i>
    <div><b>Sanctions System</b><p>Full warn/mute/kick/ban system with alt-account detection by IP, in-game appeals, MySQL support, and a GUI.</p></div>
  </div>
</div>

</div>

<div class="feature-group">

<div class="feature-group-title">Staff Tools</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-user-secret"></i>
    <div><b>Staff Mode Toolkit</b><p>Vanish (two tiers), freeze with a private chat channel, staff-only chat, CommandSpy, and inspect/enderchest with click-to-confiscate.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-flag"></i>
    <div><b>Staff Reports</b><p>Any player can flag something for staff attention with /solver report — its own queue and GUI, entirely separate from sanctions.</p></div>
  </div>
</div>

</div>
