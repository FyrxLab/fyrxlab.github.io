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
