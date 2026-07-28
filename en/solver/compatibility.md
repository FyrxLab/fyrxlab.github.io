# Compatibility

## Server Software

| Loader | Supported | Notes |
|--------|-----------|-------|
| **Paper** | ✅ Recommended | Fully supported. Best Log4j integration. |
| **Purpur** | ✅ Recommended | Fully supported and tested. |
| **Spigot** | ⚠️ Diagnostics only | Crash analysis, console monitor, and Tick Monitor all work. [AI Chat Moderation](/en/solver/fyrx-ai) requires Paper's `AsyncChatEvent` and is **not available on plain Spigot** — support for it is on the roadmap. |
| **Bukkit** | ⚠️ Partial | Basic functionality only; not officially supported. |
| **Folia** | ✅ Supported | TickMonitor is automatically disabled (Folia handles its own watchdog). All other features work. |
| **Velocity** | ❌ Not supported | Proxy software; uses a completely different API. |
| **BungeeCord** | ❌ Not supported | Proxy software; uses a completely different API. |
| **Waterfall** | ❌ Not supported | Proxy software; uses a completely different API. |
| **Forge / Fabric** | ❌ Not supported | Mod loaders; do not use the Bukkit API. |
| **Sponge** | ❌ Not supported | Uses the SpongeAPI, not Bukkit. |

::: tip Folia Support
AbsoluteSolver is **Folia-Aware**. When running on a Folia server, the plugin automatically detects the multithreaded environment and disables the TickMonitor to prevent conflicts — since Folia has its own regional Watchdog system. All other diagnostics (console monitoring, crash analysis, post-mortem) remain fully functional.
:::

## Minecraft Versions

| Version | Status | Notes |
|---------|--------|-------|
| 1.21.x | ✅ Supported | Runs on Java 21, fully compatible. |
| 1.20.x | ✅ Supported | Primary development target. Fully tested. |
| 1.19.x | ✅ Supported | |
| 1.18.x | ✅ Supported | Minimum supported version (first version requiring Java 17). |
| 1.17.x and below | ❌ Not supported | These versions run on Java 8/11; AbsoluteSolver requires Java 17+. |

## Java Version

AbsoluteSolver is compiled targeting **Java 17**. It will run on any JVM version 17 or higher (including Java 21+).

::: danger Java 17 Required
If your server is running on Java 8 or Java 11, attempting to load AbsoluteSolver will result in an `UnsupportedClassVersionError`. You must upgrade your Java runtime first.
:::
