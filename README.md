# FyrxDocs — local laboratory preview

VitePress documentation and browser tools for FyrxLab, in English, Spanish, Italian and Portuguese.

## Explore locally

```sh
npm ci
npm run docs:local
```

Open http://127.0.0.1:4173/es/lab/ (or `/en/lab/`, `/it/lab/`, `/pt/lab/`).
The homepage is `/es/`. The local server only listens on loopback.

The laboratory includes:

- Server setup: a device-local Minecraft/platform profile, stable release matching via Modrinth and required dependency links.
- Config Studio: browser-only YAML import/editing, syntax/type/rule checks, completion of missing bundled defaults, undo and download. It targets the Solver version in `productPalette.js`; it does not test credentials or rename legacy options.
- Solver demo: three scripted teaching scenarios, without a live server or AI request.
- MOTD Studio: safe text-token previews, local PNG validation (264×16), and a YAML snippet to merge with an existing SolverMOTD configuration. The preview supports a documented subset of MiniMessage; the plugin remains the authority for final rendering.

Phase 2A connects the tools through **My server**: select a release, prepare files, and follow a personal installation checklist. The checklist records user preparation only; it does not connect to or inspect a running server. Changing the environment invalidates the chosen release.

Config Studio now has guided/YAML/review views, masked change comparisons, bounded undo/redo and credential-free guided-preference projects. MOTD Studio adds formatting controls, localized templates, side-by-side client previews, comparison snapshots and text project import/export. Full configuration documents and banner images remain only in tab memory while navigating; download them before closing or reloading. Config projects contain only the six guided preference fields, not a full YAML backup. MOTD projects contain text, not the banner image.

Product homepages include a generated directory of their actual pages and sections. Documentation pages have breadcrumbs, a page index and related destinations. Feature cards, platform chips and compatibility markers link to the relevant guide or exact-setup flow. Navigation checks verify rendered internal destinations and anchors across all four locales.

The local Vite plugin in `.vitepress/outline-guard.js` protects VitePress 1.6.4's delayed outline callback after a documentation page unmounts. Review this narrow workaround when upgrading VitePress; the regression test exercises both active and unmounted callbacks. Visual transitions allow clicks through to the current page.

Configurations and uploaded images are never sent to a service or persisted in browser storage. Only the non-secret server profile is stored locally. Release lookups call Modrinth. Existing fonts, video embeds and product metadata retain their existing external sources.

## Verify

```sh
npm test
npm run docs:build
node scripts/check-build.mjs
npm run docs:preview -- --host 127.0.0.1 --port 4173
```

Stop the development server before starting preview on the same port. Production deployment is unchanged: `.github/workflows/deploy.yml` deploys pushes to `main`. The separate check workflow runs tests/builds on pull requests and other branches and has no deployment permission.

This major is prepared on `codex/fyrxdocs-lab-major`. Previewing or building locally does not publish it. Do not merge/push to `main` until the release has been approved.

The dependency audit still reports three inherited tooling advisories through VitePress 1.x / Vite / esbuild, without a compatible automatic fix. Compatible fixes for Vue and other dependencies have been applied; the new YAML dependency is pinned to 2.9.1. Use the compiled static preview for the review. A future toolchain migration should be tested separately.

When Solver changes, update the bundled `.vitepress/theme/data/solver-config.yml` from its actual release and update `.vitepress/theme/productPalette.js` together. Config Studio, the checker and tests share these defaults.
