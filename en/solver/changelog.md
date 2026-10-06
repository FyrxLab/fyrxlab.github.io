# Changelog

## v0.10.1 — Doing Exactly What It Promises

> Released: October 2026

### New Features

- **`/solver ban` and `/solver mute` accept an optional duration** — `/solver ban <player> 7d <reason>` is now a 7-day ban (recorded as `TEMPBAN`), and `/solver mute <player> 10m <reason>` a 10-minute mute. Without a duration they stay permanent, as before. Previously the duration was silently kept as part of the reason of a permanent sanction.
- **Local AI models without an API key** — the `other` provider no longer requires `other-key`. Point `other-url` at Ollama, LM Studio, or any OpenAI-compatible endpoint (e.g. `http://localhost:11434/v1/chat/completions`) and leave the key empty; Solver then sends no `Authorization` header.
- **AntiVPN recognizes more VPN providers** — the `bad-asn-list` check now also includes networks run by VPN companies whose network name doesn't say "VPN": Proton AG, Surfshark, CyberGhost, Windscribe, Private Internet Access, TorGuard, Hide.me, and NordVPN's own networks (PacketHub, Tefincom). 21 → 34 known VPN networks. Generic hosting that VPNs also rent (e.g. Datacamp/CDN77, M247) is deliberately left out to avoid flagging legitimate players.

### Fixed

- In-game alerts for errors caught by the [Console Monitor](/en/solver/console-monitor) now show the actual root cause (e.g. `NullPointerException: Cannot invoke ...`) instead of "check the console for the full detail".

## v0.10.0 — AntiVPN, One Jar for Proxies, and Command Aliases

> Released: October 2026

0.9.2 was never published on its own — everything it contained ships here, together with AntiVPN.

### New Features

- **AntiVPN** — connecting players are checked against known VPN and proxy networks, out of the box with no API key of your own: a static list of known VPN ranges (matched in memory, no network call on a normal login), a real-time lookup only for addresses the list doesn't cover, and a cross-check against known VPN-provider networks that catches a brand-new range before any list does. Optionally add a free ipapi.is key for an extra layer. See [AntiVPN](/en/solver/antivpn).
- **Explainable reasoning engine** — detections combine into a 0-100 score, and every verdict shows which signal contributed how much. Deterministic, no AI involved. Pick a profile (`conservative`, `balanced`, `strict`) instead of tuning raw numbers.
- **Calibration window** — AntiVPN never enforces anything until it has seen enough real detections on your server, whatever the configured action mode.
- **FoxGate always has the final word** — with [FoxGate](https://modrinth.com/plugin/foxgate) installed, Solver never kicks or bans for VPN reasons. `antivpn.foxgate-mode` only picks how Solver steps aside: `addon` (default, keeps alerting) or `off`.
- **One jar for backends and proxies** — install the same `Solver.jar` on BungeeCord, Waterfall, or Velocity to relay staffchat and moderation/integrity/VPN alerts across every backend. See [Proxy Relay](/en/solver/proxy-relay). Off by default (`proxy-relay.enabled`).
- **Command aliases** — `/invsee` (`inspect`), `/v` (`vanish`), `/sc` (`staffchat`), `/cspy` (`commandspy`), `/tm` (`tempmute`), `/tb` (`tempban`), `/cu` (`checkuser`), `/hist` (`history`), working both prefix-less and as `/solver <alias>`.
- **Anonymous usage statistics** via [bStats](https://bstats.org/plugin/bukkit/Solver/33362) — server count and which features are enabled, nothing player-identifiable. Toggle with `metrics.enabled`.
- **Build verification now uses Modrinth** — Solver checks its own jar against the official files published on [Modrinth](https://modrinth.com/plugin/solver). A jar that isn't there (e.g. a development build) is only reported, never flagged.

### Fixed

- **Prefix-less commands (`/vanish`, `/inspect`, etc.) now actually work** — they were listed as enabled at startup but never registered.
- **Java 8–14:** the known-malware scan needs Ed25519 signature checks, which only exist on Java 15+. On older Java it showed a false "invalid signature / possible compromised CDN" error on every startup; it's now skipped with a clear notice.
- On a server in a language other than English, a message added by a recent update showed as `[missing some.key]` — it now falls back to English.
- `/solver integrity` was missing from tab-completion.

### Changed

- Console log output is now in **English by default**, regardless of the player-facing language.

### Privacy

AntiVPN's two real-time lookups send the connecting player's IP address to a third-party service (IPQuery.io and ipapi.is), only for addresses the static lists and local cache didn't already resolve. The static lists never send anything. Every source can be turned off individually, or AntiVPN as a whole with `antivpn.own_engine.enabled`.

### Compatibility

- Paper, Purpur, Spigot, CraftBukkit, Folia; BungeeCord, Waterfall, Velocity (relay only)
- Minecraft 1.8.8 — 1.21.x and 26.1 — 26.3
- Java 8+ (the malware scan needs Java 15+)

## v0.9.1 — Spigot/CraftBukkit Support, Down to 1.8.8

> Released: 2026

Solver now runs on plain Spigot/CraftBukkit, not just Paper/Folia — all the way back to 1.8.8. Every feature works the same everywhere, with a legacy-appropriate fallback wherever a Paper-only API doesn't exist.

### New Features

- **Spigot/CraftBukkit support, 1.8.8 and up** — Solver no longer requires Paper. Chat moderation, sanctions, the Staff Mode Toolkit, and every GUI now work the same way on plain Spigot.
- **Lowered Java requirement: Java 8 or higher** (was Java 17).

### Fixes

- Fixed sanctions storage (SQLite) occasionally failing to initialize on some server setups, due to a driver-registration issue specific to how Bukkit loads plugin jars.

### Compatibility

- Paper, Purpur, Spigot, CraftBukkit, Folia
- Minecraft 1.8.8 — 1.21.x (1.7.10 support is planned but not available yet)
- Java 8+

## v0.9.0 — FyrxLab Backend, Part 1: Build Integrity & Malware Scanning

> Released: July 2026

Solver can now verify its own jar and scan for known-malware plugins. Both static, signed, and cached — no dynamic backend involved yet.

### New Features

- **Build integrity verification** — Solver checks its own jar against a signed hash published by FyrxLab. Check anytime with `/solver integrity`, or force an immediate check with `/solver integrity rescan`.
- **Malware scanning** — every other `.jar` in `plugins/` is checked against a signed list of known-malware hashes.
- **Optional Modrinth cross-check** for unflagged plugins — purely informational, never a red flag on its own.
- **Java agent detection** — warns at startup if a Java agent was attached to the server's JVM, since an agent can patch classes in memory without ever touching the jar file on disk.

### Changed

- Jar builds aren't byte-for-byte reproducible (the same source rebuilt twice gets a different hash, since the zip container embeds a per-entry build timestamp). Every compiled jar is now published under its own `<version>.AAMMDD.HHMM` key in FyrxLab's manifest, and build verification matches against any hash published for the current version instead of a single exact one.

### Fixes

- `/solver rtp` could occasionally teleport the person running the command to themselves instead of another player.
- Build verification could read a blank CDN URL on an upgrading install's first boot after the new `integrity` config section was added, silently disabling the whole feature for that restart. Config merging now runs before any manager reads its own section.
- Build verification was hashing the wrong file on Paper/Folia versions that remap plugins to `plugins/.paper-remapped/` before loading them — that remapped copy never matches FyrxLab's published hash even on a genuine install. It now locates and hashes the original jar in `plugins/` directly.

## v0.8.0 — The Full Moderation/Staff Alternative

> Released: July 2026

Solver becomes a full moderation/staff alternative, not just AI chat moderation — alt-account tracking, MySQL support, in-game appeals, a full staff reports system, and a much deeper Staff Mode Toolkit.

### New Features

- **Real alt-account detection** — `/solver checkuser <player>` cross-references IP history across every account; a ban now instantly kicks an alt that's already online, not just future logins.
- **In-game sanction appeals** — `/solver appeal <id> <reason>`, no Discord needed; staff get notified and review with `/solver appeal list|accept|reject`.
- **`/solver sanctions <player>` GUI** — browse a player's history, click an active sanction for the exact revoke command.
- **Reason templates & automatic warn escalation** — `#griefing`-style shortcuts and auto-kick/tempban after a player's Nth warning.
- **Optional MySQL storage backend** for multi-server setups, alongside the existing zero-config SQLite default.
- **A full Staff Reports system** — `/solver report`/`reports`, with its own GUI, entirely separate from sanctions.
- **CommandSpy** — a live relay of other players' commands, not just retrospective logging.
- **Staff Mode combined profiles** — `/solver staffmode <profile>` bundles vanish/freeze-immunity/flight/god-mode/inventory-clear.
- **Two-tier vanish + optional invulnerability**, silent join, and a private freeze chat channel to talk to a frozen player during a screenshare.
- **`/solver inspect`/`enderchest`** — view *and confiscate* a player's inventory/enderchest without opening it.
- **`/solver fly`/`god`/`rtp`** for independent flight, invulnerability, and supervision teleports.
- **Chat moderation categories are now yours to define** (`tags.yml`), and `chat-moderation.action.tag-overrides` maps any tag straight to a sanction type — the only way to reach an automatic ban from chat moderation.
- **Cancellable events** — `SolverPunishEvent`/`SolverPostPunishEvent`, `SolverVanishToggleEvent`, `SolverFreezeToggleEvent`, `SolverStaffChatToggleEvent` let other plugins veto or react to any Solver action.
- **Silent join** — staff with `solver.staffmode.silentjoin` enter already vanished, with no join message at all.

### Fixes

- Fixed chat moderation flagging a completely normal message as toxic/spam — a message judged harmless was never removed from the rolling context buffer, so it kept getting an independent fresh judgment call every cycle. Already-reviewed text is now only ever background context, never re-judged from scratch.
- Fixed manually-added `reason-templates`/`warn-escalation`/`staff-mode.profiles` entries getting silently wiped from `config.yml` on a reload or restart.
- Fixed `/solver god` not reliably stopping PvP damage.
- Fixed a long sanction reason overflowing the kick/ban disconnect screen and the sanctions GUI tooltip — now wraps into a paragraph.
- Fixed a `KICK` showing as "active" in `/solver history`/`check` — it's an instant ejection, now shown as "executed".

## v0.7.2 — Staff Mode Toolkit & Smarter Moderation

> Released: 2026

Chat moderation stops trusting a single AI call, staff commands get faster to type, and an early piece of the next milestone ships as experimental.

### New Features

- **Staff Mode Toolkit (Experimental)** — `/solver vanish`, `/solver freeze <player>`, and `/solver staffchat`, all also available as standalone commands (`/vanish`, `/freeze`, `/staffchat`).
- **Granular, LuckPerms-friendly permissions** — every `/solver` subcommand now has its own permission node, grouped under `solver.diagnostics.*`, `solver.sanctions.*`, and `solver.staffmode.*`. `solver.admin` still grants everything.
- **Standalone commands** — `/vanish`, `/mute`, `/ban`, `/moderation`, and more now work directly without the `/solver` prefix. Toggle a whole category off in `config.yml` if another plugin already claims one of those names.
- **Multi-signal corroboration for chat moderation** — an automatic sanction now needs the AI verdict to be both confident and severe enough, *or* backed by an independent local signal. Otherwise it stays a staff-only alert.
- **4 configurable levels of `llm-analysis-level`** — from `0` (never call the AI, local filter only) to `3` (real-time, every message).

### Fixes

- Fixed reconnecting while frozen using a synchronous teleport that Folia's region-threading model rejects — switched to the async teleport API.
- Fixed the saved moderation incident report missing the AI's confidence value.
- Fixed chat moderation re-punishing the same already-judged message during a busy bulk scan.
- Fixed mute state living only in memory — a restart no longer silently lifts an active mute early; it's now restored from `sanctions.db` on join, same as bans.
- Cleaned up `config.yml` comments that had leaked internal-development language.

## v0.7.1 — Bug-fix Patch

> Released: 2026

No new features — five real bugs found via code audit right after 0.7.0 shipped, all fixed here.

- Fixed `config.yml` losing its explanatory comments on every restart, even when nothing needed updating.
- Fixed `/solver tempmute` with a duration under a minute (e.g. `30s`) silently doing nothing.
- Fixed a rate-limit bug that could make AI-backed features briefly block each other when sharing the same API key.
- Fixed a couple of internal Bukkit API calls in chat moderation and sanctions commands running off the correct thread — hardened for Folia safety, and sanction commands no longer block on database I/O.

## v0.7.0 — Sanctions, Custom Messages & Smarter Moderation

> Released: 2026

A real warn/mute/kick/ban system, every player-facing message now yours to customize, and Fyrx's moderation calls come with a confidence score instead of a flat yes/no.

### New Features

- **New `messages.yml`** — every player/staff-facing message is now configurable with full MiniMessage support, in your own language folder (`lang/<locale>/messages.yml`).
- **New Sanctions system (BETA)** — `/solver warn|mute|tempmute|kick|ban|tempban <player> [duration] <reason>`, plus `unban|unmute|unwarn`, `history <player>`, `check <id>`, and `note <player> <text>`. Every sanction gets a real ID and persists in `sanctions.db`.
- **Bans are actually enforced** — reconnecting while banned is rejected at login, not just a one-time kick.
- **Mutes always work** — even with AI chat moderation turned off, `/solver mute` really blocks chat.
- **Confidence Meter** — every moderation verdict shows how *sure* Fyrx is (0-100%), separate from severity. Visible in staff alerts and `/solver moderation test`/`status`.
- **`/solver moderation status` shows a countdown** to the next automatic chat scan.
- **PlaceholderAPI support (BETA)** — `%solver_muted%`, `%solver_warns%`, `%solver_active_sanctions%`, and more.
- **`config.yml`/`messages.yml` no longer go stale on update** — new options merge in automatically.
- **AI Chat Moderation, out of beta** — staff/admins can be exempted, full localization in all 9 languages, and per-category per-offender verdicts instead of a single guessed word.
- **`/solver crashme dry-run`** — exercises the full crash-diagnosis pipeline with a synthetic report, no real exception/hang/OOM.

### Fixes

- Fixed early-startup error detection loading the entire server log into memory instead of reading it line by line.
- Fixed kick/mute/message scheduling using the wrong Folia scheduler for per-player actions.
- Fixed Fyrx ignoring the configured language for exception/crash analysis outside of English.
- Fixed background threads (chat moderation, tick monitor, console batching) keeping a crashed server's Java process alive forever — all now run as daemon threads.

### Compatibility

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

## v0.5.0 — Initial Release

> Released: July 2026

This is the first public stable release of **AbsoluteSolver**. It introduces **Fyrx**, your AI-powered server administrator.

### New Features

- **Gemini AI Integration** — Fully integrated with Google's `gemini-3-flash-preview` model.
- **Live Console Monitor** — Injects directly into Log4j to intercept `ERROR` and `WARN` exceptions in real time.
- **Post-Mortem Crash Analysis** — Automatically scans `crash-reports/` on startup.
- **Native JVM Crash Support** — Detects and analyzes `hs_err_pid.log` fatal JVM crash files.
- **Early Startup Error Detection** — Reads `logs/latest.log` on boot to catch pre-load dependency errors.
- **Tick Monitor** — Lightweight background thread that detects server freezes and deadlocks.
- **Folia Support** — Plugin detects Folia automatically and disables TickMonitor gracefully.
- **Beautiful Console UI** — ASCII startup banner and formatted AI responses using Minecraft color codes.
- **Multi-Provider Support** — Compatible with Google Gemini, Anthropic Claude, and any OpenAI-compatible API.
- **Diagnostic Tools** — `/absolutesolver crashme <exception|deadlock|oom>` for safe testing.
- **100% Asynchronous** — Zero impact on server TPS.

### Compatibility

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

---

*Made with ❤️ by FyrxLab*
