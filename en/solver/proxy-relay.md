# Proxy Networks

::: tip Updated in 0.10.2 — AntiVPN and integrity at the proxy
The proxy can now check every connection for VPNs once, for the whole network, and verify its own jar. Same `Solver.jar` as always.
:::

Drop the **same `Solver.jar`** you use on your backends into your BungeeCord, Waterfall, or Velocity proxy. There is no separate proxy plugin: BungeeCord/Waterfall read its `bungee.yml`, Velocity its `velocity-plugin.json`, and neither loads any of the Bukkit code. On the proxy it does three things:

1. **Relays** staffchat and moderation/integrity/VPN alerts so they reach staff on *any* backend.
2. **AntiVPN** — checks every connection before it reaches a server.
3. **Integrity** — verifies its own jar and scans the proxy's other plugins.

Sanctions, vanish, and GUIs stay on the backends: a proxy has no worlds, inventories, or players with in-game state.

## Setup

1. Put `Solver.jar` in the proxy's `plugins/` folder and restart the proxy.
2. On startup it creates its own config: `plugins/SolverProxy/config.yml` (BungeeCord/Waterfall) or `plugins/solverproxy/config.yml` (Velocity). Its keys mean exactly the same as in a backend's `config.yml`.
3. The console confirms it's running:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Relay

Turn it on in **each backend's** `plugins/Solver/config.yml`:

```yaml
proxy-relay:
  enabled: true
```

Off by default — a network-wide relay is a real behavior change, so it's opt-in. What gets relayed:

- `/solver staffchat` messages (and the toggled staffchat mode)
- Chat moderation alerts (Fyrx AI)
- Integrity alerts — jar mismatch, malware match, Java agent detected
- [AntiVPN](/en/solver/antivpn) alerts

Staff on the server where the message started already see it locally, so the relay doesn't send them a second copy. An alert raised while a backend has nobody online (typical for AntiVPN, which fires before the player has joined) is held and delivered as soon as someone joins that backend.

### Who receives relayed messages

Players holding `solver.notify` (alerts) or `solver.staffmode.staffchat` (staffchat) — the same permissions used on each backend. How the proxy checks that:

- **LuckPerms installed on the proxy** — used directly. If your LuckPerms setup shares storage across the network, this already matches what each backend grants.
- **No LuckPerms on the proxy** — each backend tells the proxy which connected players hold `solver.notify`, and the proxy uses everyone reported by any backend. This is the default.

## AntiVPN at the proxy

On by default in the proxy's config. Every connection is checked before it reaches any server, with the same engine as a backend — sources, [profiles](/en/solver/antivpn), calibration window, whitelist — under the same keys (`antivpn.*`, `reasoning.*`).

::: warning Turn it off on the backends
If the proxy runs AntiVPN, set this in each backend's `config.yml`, or every connection is checked and alerted twice:

```yaml
antivpn:
  own_engine:
    enabled: false
```

The proxy reminds you of this in its console on startup. A backend can't safely detect this on its own: a message claiming "the proxy already checks" could be faked by a player.
:::

- **Alerts** go to every staff member connected to the network, tagged `[proxy]`.
- **Blocking**: with `antivpn.action.mode: auto-action` (and the calibration window complete), the player is refused at the proxy and never reaches a server. The message they see is `antivpn.kick-message` in the proxy's config (MiniMessage).
- **FoxGate** on the proxy works exactly as on a backend: Solver never blocks anyone, and `antivpn.foxgate-mode` picks `addon` (keep alerting) or `off`.
- Verdicts are cached in `antivpn.db` next to the proxy's config, so a proxy restart doesn't re-query every player.

There are no `/solver vpn` commands on the proxy: edit the whitelist under `antivpn.whitelist` in the proxy's config and restart it.

## Integrity at the proxy

Same checks as a backend, configured under `integrity.*` in the proxy's config:

- **Build verification** — the proxy's Solver jar is checked against the official release on Modrinth. A development build is only reported, never flagged.
- **Malware scan** — every other `.jar` in the proxy's `plugins/` folder is checked against the signed list of known-malware hashes (Java 15+).
- **Java agent detection** — a warning if an agent was attached to the proxy's JVM at launch.

Alerts go to the proxy console and to staff on the network, tagged `[proxy]`.

## Compatibility

| Proxy | Notes |
|-------|-------|
| Velocity 3.x / 4.x | Requires Java 11+ on the proxy. |
| Waterfall | End of life upstream — PaperMC recommends Velocity. Still works today. |
| BungeeCord | Same as Waterfall. |
