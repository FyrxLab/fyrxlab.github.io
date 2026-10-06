# Proxy Relay

::: tip Updated in 0.10.0 — one jar for everything
Solver itself runs on Bukkit-family servers. On a proxy, the same jar only runs a small relay: a proxy has no worlds, inventories, or players with in-game state, so sanctions, vanish, and GUIs stay on the backends.
:::

If you run a BungeeCord, Waterfall, or Velocity network with more than one Solver backend, the relay makes staffchat messages and moderation/integrity/VPN alerts reach staff connected to *any* backend, not just the one where it happened.

## What gets relayed

- `/solver staffchat` messages (and the toggled staffchat mode)
- Chat moderation alerts (Fyrx AI)
- Integrity alerts — jar mismatch, malware match, Java agent detected
- [AntiVPN](/en/solver/antivpn) alerts

Staff on the server where the message started already see it locally, so the relay doesn't send them a second copy. An alert raised while a backend has nobody online (typical for AntiVPN, which fires before the player has joined) is held and delivered as soon as someone joins that backend.

## Setup

### 1. Enable the relay on every backend

In each backend's `plugins/Solver/config.yml`:

```yaml
proxy-relay:
  enabled: true
```

Off by default — a network-wide relay is a real behavior change, so it's opt-in.

### 2. Install the same jar on the proxy

Drop the **same `Solver.jar`** you use on your backends into the proxy's `plugins/` folder and restart the proxy — there is no separate proxy plugin. BungeeCord/Waterfall read its `bungee.yml` and Velocity its `velocity-plugin.json`; neither loads any of the Bukkit code. No configuration file of its own.

### 3. Confirm it's running

On proxy startup, the console prints one line:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Who receives relayed messages

The relay only reaches players holding `solver.notify` (for alerts) or `solver.staffmode.staffchat` (for staffchat) — the same permissions used locally on each backend. How the proxy checks that depends on what's installed:

- **LuckPerms installed on the proxy** — used directly. If your LuckPerms setup shares storage across the whole network, this already matches what each backend grants.
- **No LuckPerms on the proxy** — each backend tells the proxy which connected players currently hold `solver.notify`, and the proxy relays to everyone reported by any backend. This is the default.

## Compatibility

| Proxy | Notes |
|-------|-------|
| Velocity 3.x / 4.x | Requires Java 11+ on the proxy. |
| Waterfall | End of life upstream — PaperMC recommends Velocity. Still works today. |
| BungeeCord | Same as Waterfall. |
