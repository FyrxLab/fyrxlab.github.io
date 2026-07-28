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

features:
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-brain"></i>'
    title: Gemini AI Integration
    details: Powered by Google's Gemini model. Fyrx translates cryptic Java stack traces into clear, actionable solutions you can actually understand.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-triangle-exclamation"></i>'
    title: Live Console Monitor
    details: Injected directly into the server's Log4j engine. Errors are intercepted the instant they happen — no need to dig through logs manually.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-explosion"></i>'
    title: Crash Analysis
    details: Automatically scans crash-reports and JVM fatal error logs on startup. Fyrx will tell you exactly what killed your server before you even ask.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-stopwatch"></i>'
    title: Tick Monitor
    details: A lightweight background thread watches your server's TPS. If the main thread hangs for more than 5 seconds, Fyrx identifies the culprit plugin.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-clock-rotate-left"></i>'
    title: Early Startup Errors
    details: Reads logs/latest.log on boot to catch dependency conflicts and version errors that occurred before AbsoluteSolver even loaded.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-bolt"></i>'
    title: Zero-Lag Architecture
    details: All AI processing, file I/O, and network calls run on background threads. Your server TPS is never affected while Fyrx is thinking.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-gavel"></i>'
    title: AI Chat Moderation & Sanctions
    details: Fyrx reads chat context (not a word blacklist) and backs every verdict with a confidence score. A full warn/mute/kick/ban system with alt-account detection, in-game appeals, MySQL support, and a GUI.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-user-secret"></i>'
    title: Staff Mode Toolkit
    details: Vanish (two tiers), freeze with a private chat channel, staff-only chat, CommandSpy, named combined profiles, and inspect/enderchest with click-to-confiscate — all available under /solver or as standalone commands.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-flag"></i>'
    title: Staff Reports
    details: Any player can flag something for staff attention with /solver report, managed through its own queue and GUI — entirely separate from sanctions.
---
