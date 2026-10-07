# Compatibility

## Server Software

| Loader | Supported | Notes |
|--------|-----------|-------|
| **Paper** | ✅ Recommended | Fully supported. Best Log4j integration. |
| **Purpur** | ✅ Recommended | Fully supported and tested. |
| **Spigot** | ✅ Supported (1.8.8+) | Fully supported, including [AI Chat Moderation](/en/solver/fyrx-ai) — no Paper required. |
| **CraftBukkit** | ✅ Supported (1.8.8+) | Same support level as Spigot. |
| **Folia** | ✅ Supported | TickMonitor is automatically disabled (Folia handles its own watchdog). All other features work. |
| **Velocity** | ✅ Proxy features | Same `Solver.jar`: relay, network-wide AntiVPN, and integrity checks. See [Proxy Networks](/en/solver/proxy-relay). |
| **BungeeCord** | ✅ Proxy features | Same jar, same proxy features. See [Proxy Networks](/en/solver/proxy-relay). |
| **Waterfall** | ✅ Proxy features | Same jar, same proxy features. See [Proxy Networks](/en/solver/proxy-relay). |
| **Forge / Fabric** | ❌ Not supported | Mod loaders; do not use the Bukkit API. |
| **Sponge** | ❌ Not supported | Uses the SpongeAPI, not Bukkit. |

::: tip Folia Support
AbsoluteSolver is **Folia-Aware**. When running on a Folia server, the plugin automatically detects the multithreaded environment and disables the TickMonitor to prevent conflicts — since Folia has its own regional Watchdog system. All other diagnostics (console monitoring, crash analysis, post-mortem) remain fully functional.
:::

## Minecraft Versions

| Version | Status | Notes |
|---------|--------|-------|
| 26.1 – 26.3 | ✅ Supported | Mojang's new version numbering. Tested on Paper 26.3 (Java 25). |
| 1.21.x | ✅ Supported | Runs on Java 21, fully compatible. |
| 1.20.x | ✅ Supported | Primary development target. Fully tested. |
| 1.13.x – 1.19.x | ✅ Supported | |
| 1.8.8 – 1.12.x | ✅ Supported | Minimum supported version. Some Paper-only conveniences (e.g. hiding a vanished player from the server list) aren't available here — there's no vanilla equivalent — but every other feature works the same. |
| 1.7.10 and below | ❌ Not supported yet | Planned, but not buildable/available yet. |

## Java Version

Solver is compiled targeting **Java 8**. It will run on any JVM version 8 or higher (including Java 17/21).

::: tip Java 8 or Higher
Solver runs on any Java version from 8 upward — you don't need to upgrade your server's Java runtime to use it.
:::
