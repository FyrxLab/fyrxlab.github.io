# FyrxDocs

VitePress documentation and browser tools for FyrxLab, in English, Spanish, Italian and Portuguese. Published at https://fyrx.net.

## Develop

```sh
npm ci
npm run docs:local   # http://127.0.0.1:4173, loopback only
npm test
npm run docs:build
node scripts/check-build.mjs
```

## The laboratory (`/<locale>/lab/`)

- **My server** — pick Minecraft version, platform and product; the matching stable release and its required dependencies are looked up on Modrinth, followed by a personal installation checklist. The checklist records the user's own preparation only; the site never inspects a server.
- **Config Studio** — browser-only YAML import/editing for Solver, with syntax/type/rule checks, completion of missing bundled defaults, masked change review, bounded undo/redo and credential-free preference projects.
- **Solver example** — three scripted teaching scenarios. They are written by hand, not produced by Solver.
- **MOTD Studio** — safe text-token previews, local PNG validation (264×16) and a YAML snippet to merge into a SolverMOTD config. The plugin remains the authority for final rendering.

Product homepages list their own pages and sections, subpages have breadcrumbs and related links, and `scripts/check-build.mjs` verifies internal destinations and anchors in all four locales, plus the discovery files (`sitemap.xml`, `llms.txt`, canonical and hreflang links).

## Downloads

The site never links a jar file directly. Every download button opens the product's Modrinth version page, where the download happens. `fetchBestVersion` deliberately does not return the file URL; a test guards this.

## Privacy

Configurations and uploaded images are never sent to a service or written to browser storage; they live only in tab memory. Stored on the device: the non-secret server profile, the selected release (public Modrinth metadata) and the checklist. Release lookups call the Modrinth API.

## Releasing a new Solver version

Update these together, in the same commit:

1. `.vitepress/theme/data/solver-config.yml` — copy it from the real release's `config.yml`.
2. `version` in `.vitepress/theme/productPalette.js`.
3. The `enums`/`bounds` tables in `.vitepress/theme/lab/config-core.js` if options were added or changed.

Config Studio only offers the download when the selected Solver release matches the version in `productPalette.js`.

## Notes

`.vitepress/outline-guard.js` guards VitePress 1.6.4's delayed outline callback after a page unmounts. It throws if the patched code changes, so review it when upgrading VitePress. The dependency audit reports advisories inherited through VitePress 1.x / Vite / esbuild with no compatible automatic fix; handle the toolchain upgrade separately.

Deployment: `.github/workflows/deploy.yml` deploys pushes to `main`. `.github/workflows/check.yml` runs tests and the build on pull requests and other branches, without deploy permission.
