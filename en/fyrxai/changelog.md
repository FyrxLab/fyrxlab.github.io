# Changelog

## v1.2.1
- Formalized ES modules compatibility with an explicit `exports` map in `package.json` — `import setupFyrxAI from 'fyrxai'` now works alongside `require()`.

## v1.2.0
- Added `/fyrxai exempt` — per-guild configurable users and roles (e.g. moderators) that skip the attention cooldown.
- Loosened topic detection for single-wiki servers: a lone configured topic now answers reasonable questions without requiring its name to be mentioned, while still filtering out greetings and small talk.
- Broadened problem-wording detection to catch more everyday phrasing (e.g. regional "doesn't work" expressions, Spanish verb conjugations).
- @mentioning the bot now guarantees an answer in any channel, bypassing every heuristic gate. @mentioning it while replying to another message answers about that message instead of the mention text.

## v1.0.0
- Initial public release: whole-site documentation crawling (`llms.txt`/`sitemap.xml`/link-following), automatic + AI-assisted keyword extraction, three-layer topic detection, `/fyrxai` slash-command configuration, and support for WaveSpeed, OpenRouter, Google AI Studio, and Claude Platform.
