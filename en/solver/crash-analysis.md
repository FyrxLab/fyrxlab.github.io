# Crash Analysis

AbsoluteSolver provides three distinct crash analysis systems that work together to ensure that no matter *how* your server died, Fyrx will be there to explain it.

## Post-Mortem Analysis (Startup Scan)

When your server starts, AbsoluteSolver scans for new crash reports that weren't present in the previous session.

**How it works:**
1. On `onEnable`, the plugin scans the `crash-reports/` folder
2. It compares the file list against a `data.yml` record of previously analyzed reports
3. If a **new** report is found, it reads the file and sends it to Fyrx along with the last 100 lines of `latest.log`
4. Fyrx's analysis is printed to the console before the server finishes booting

**Supported crash report types:**

| Type | Source | Description |
|------|--------|-------------|
| Minecraft Crash Report | `crash-reports/*.txt` | Standard Minecraft/Paper crash dumps |
| Native JVM Crash | `hs_err_pid*.log` | Fatal JVM errors (SIGSEGV, JNI failures, memory corruption) |

::: info Native JVM Crashes
An `hs_err_pid` file is generated when Java itself crashes — not just Minecraft. These crashes are typically caused by a broken native library (like a GPU driver), memory corruption, or a bad JNI call from a mod. Fyrx analyzes the first 200 lines which contain the most critical information.
:::

## Early Startup Detection

This system captures errors that occur *after* the JVM starts but *before* AbsoluteSolver's `onEnable` runs. These errors are commonly caused by:

- Plugin version incompatibilities
- Missing dependencies
- Class loading conflicts (two plugins using different versions of the same library)

**How it works:**
1. AbsoluteSolver reads `logs/latest.log` asynchronously on startup
2. It scans lines containing `ERROR]:` or `WARN]:` up until the line `[AbsoluteSolver] Enabling`
3. If any errors are found, they are sent to Fyrx for analysis
4. The full analysis is printed immediately in the console

**Example of what this catches:**

```
[ServerMain/ERROR]: Could not load 'plugins/MyPlugin.jar' in folder 'plugins'
org.bukkit.plugin.InvalidPluginException: Unsupported API version 1.21
```

## Manual Analysis

You can trigger a manual analysis of the most recent crash report at any time:

```
/absolutesolver analyze-last
```

This is useful if AbsoluteSolver didn't catch the crash automatically (e.g., the plugin wasn't loaded during the crash session).

## Configuration

```yaml
check-crash-on-startup: true    # Enable post-mortem scanning on boot
monitor-console: true           # Enable early startup error detection
```
