# Tick Monitor

The Tick Monitor is a lightweight background thread that continuously watches your server's **main thread** health. If the server freezes, deadlocks, or enters a severe lag spike, Fyrx will automatically detect it, capture the thread state, and generate a diagnostic report.

## How It Works

The Tick Monitor operates using two components:

**1. Heartbeat Task (Main Thread)**
A synchronous Bukkit task runs once per tick (20 times per second) on the main server thread. Each time it runs, it updates a `lastTickTime` timestamp.

**2. Watchdog Thread (Background)**
A separate Java thread checks the `lastTickTime` every second. If the timestamp hasn't been updated for more than **15 seconds**, it concludes the main thread is frozen.

## Freeze Detection

When a freeze is detected:

1. The monitor captures the **full StackTrace** of the main thread (up to 30 frames)
2. It captures the **thread state** (BLOCKED, WAITING, etc.)
3. This data is sent to Fyrx asynchronously
4. Fyrx identifies which plugin, event handler, or code is blocking the main thread

**Example Fyrx output on a deadlock:**

```
╔══════════════════════════════════════════════════════════╗
║       FREEZE DIAGNOSTIC — FYRX                          ║
╚══════════════════════════════════════════════════════════╝

### Root Cause
The main thread is TIMED_WAITING inside CommandManager.onCommand()
at net.example.myplugin.CommandManager.java:52

### Analysis
The plugin is calling Thread.sleep(20000) directly on the main server
thread. This is a critical programming error — Thread.sleep() blocks
the entire server for the specified duration.

### Recommended Action
Contact the plugin author. The sleep() call must be moved to an
asynchronous thread using Bukkit.getScheduler().runTaskAsynchronously()
════════════════════════════════════════════════════════════
```

## Folia Compatibility

::: warning Folia
The Tick Monitor is **automatically disabled** on Folia servers. Folia uses a multi-threaded regional architecture where there is no single "main thread," making TPS monitoring via this method impossible. Folia has its own built-in regional Watchdog that handles freeze detection.

When AbsoluteSolver detects Folia, you will see this message:
```log
[AbsoluteSolver] Servidor Folia detectado: TickMonitor deshabilitado.
```
:::

## Freeze Threshold

The default freeze threshold is **15 seconds**. This is intentionally higher than Paper's default Watchdog (10 seconds) to avoid false positives during heavy world saves or chunk generation bursts.

## Testing

You can test the Tick Monitor safely using the built-in crash test command (OP only):

```bash
/absolutesolver crashme deadlock
```

This command calls `Thread.sleep(20000)` on the main thread, simulating a 20-second freeze. Fyrx will detect it after 15 seconds and generate a diagnostic report.

::: danger Warning
The `deadlock` crash test will cause your server to be unresponsive for 20 seconds. Paper/Purpur's own Watchdog will also trigger and print a thread dump. This is expected behavior.
:::
