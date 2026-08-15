# Proxy Relay

::: warning New in 0.9.2 — chat/log relay only, not full proxy support
Solver only runs on individual Bukkit-family servers (Paper, Purpur, Spigot, CraftBukkit, Folia). A proxy has no worlds, inventories, or players with in-game state, so sanctions, vanish, and GUIs don't run there — the relay only forwards alerts and staffchat text across your network. Sponge is not related to this feature and remains unsupported.
:::

If you run a BungeeCord, Waterfall, or Velocity network with more than one Solver-powered backend, the proxy relay makes staffchat messages and moderation/integrity alerts reach staff connected to *any* backend, not just the one where the alert happened.

## What gets relayed

- `/solver staffchat` messages (and the toggled staffchat mode)
- Chat moderation alerts (Fyrx AI)
- Integrity alerts — jar hash mismatch, malware match, Java agent detected

Nothing else. No sanctions, vanish state, or GUI data crosses the network — see the warning above for why.

## Setup

### 1. Enable the relay on every backend

In each backend's `plugins/Solver/config.yml`:

```yaml
proxy-relay:
  enabled: false   # change to true
```

Off by default — a network-wide relay is a real behavior change, so it's opt-in.

### 2. Install the matching plugin on the proxy

The proxy side is a **separate, small plugin** — it is not part of the `Solver.jar` you install on backends. Pick the one matching your proxy software:

- **BungeeCord or Waterfall** (they share the same plugin API) → `solver-proxy-bungee.jar`
- **Velocity** → `solver-proxy-velocity.jar`

Drop the matching jar into the proxy's own `plugins/` folder and restart the proxy. No configuration file of its own — it activates as soon as a connected backend has `proxy-relay.enabled: true` and sends its first message.

### 3. Confirm it's running

On proxy startup, the console prints one line:

```
SolverProxy (Bungee/Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Who receives relayed messages

The relay only reaches players holding `solver.notify` (for alerts) or `solver.staffmode.staffchat` (for staffchat) — same permissions used locally on each backend. How the proxy checks that permission depends on what's installed:

- **LuckPerms installed on the proxy** — used directly. If your LuckPerms setup shares storage across the whole network, this already matches what each backend grants, with nothing else to configure.
- **No LuckPerms on the proxy** — each backend periodically tells the proxy which connected players currently hold `solver.notify`, and the proxy relays to the union of everyone reported by any backend. This is the default if you haven't installed LuckPerms proxy-side.

## Compatibility

| Proxy | Plugin | Notes |
|-------|--------|-------|
| Velocity | `solver-proxy-velocity.jar` | Requires Java 11+ on the proxy. |
| Waterfall | `solver-proxy-bungee.jar` | Waterfall has reached end of life upstream — PaperMC recommends migrating to Velocity. The plugin still works on it today. |
| BungeeCord | `solver-proxy-bungee.jar` | Same plugin as Waterfall. |
