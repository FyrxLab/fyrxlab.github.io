# AntiVPN

::: tip New in 0.10.0
:::

Solver checks every connecting player against known VPN and proxy networks before they join, combines what it finds into an explainable score, and — only once you allow it — refuses the connection.

## How detection works

Sources are tried from cheapest to most expensive, and a later one only runs when the earlier ones found nothing:

| Source | What it is | Network call per login? |
|--------|-----------|-------------------------|
| `x4bnet-vpn` | Static list of known VPN ranges ([X4BNet](https://github.com/X4BNet/lists_vpn), MIT), downloaded once a day and matched in memory. | No |
| `x4bnet-datacenter` | Same project's broader list (VPN + hosting). Off by default — it also flags players on their own VPS. | No |
| `ipquery` | [IPQuery.io](https://ipquery.io) real-time lookup, only for addresses the list didn't cover. | Yes |
| `ipapiis` | [ipapi.is](https://ipapi.is), last resort. Without a key it only returns the network (ASN); with a free key it adds VPN/proxy/Tor flags. | Yes |
| `bad-asn-list` | Known consumer-VPN networks (NordVPN, Mullvad, ExpressVPN...), matched against the ASN the lookups resolved — catches a brand-new range before any list. | No |

Local and LAN addresses are never looked up. A verdict is cached per IP (`cache-ttl-hours`, default 24); if every real-time lookup fails, nothing is cached and the address is retried on the next login.

## The score

Every source that fires becomes a signal with its own confidence. Signals combine into one 0-100 score, and the verdict always shows the breakdown:

```
185.220.101.1 is flagged: VPN (source: x4bnet-vpn)
score 90.0 <- x4bnet-vpn (SOLVER_OWN) +90.0
```

What happens at a given score depends on the profile:

| Profile | Warn | Kick |
|---------|------|------|
| `conservative` (default) | 50 | 80 |
| `balanced` | 40 | 70 |
| `strict` | 30 | 55 |
| `custom` | your numbers under `reasoning.custom` | |

## Calibration window

The first time AntiVPN is enabled, it only alerts — even with `action.mode: auto-action` — until it has seen `reasoning.bootstrap.min-flags` real detections (default 20) or `max-days` have passed (default 7). `/solver vpn status` shows the progress. Manual `/solver vpn check` lookups don't count towards it.

## Actions

```yaml
antivpn:
  action:
    mode: "alert-only"          # alert-only | auto-action
    persist-as-sanction: true   # record blocked logins in /solver history as a KICK
```

With `auto-action`, a connection is refused once its score reaches the profile's kick threshold. Alerts reach everyone with `solver.notify`, and other backends too if the [Proxy Relay](/en/solver/proxy-relay) is on.

## FoxGate

If [FoxGate](https://modrinth.com/plugin/foxgate) is installed, Solver **never** kicks or bans for VPN reasons — that isn't configurable. You only choose how Solver steps aside:

```yaml
antivpn:
  foxgate-mode: "addon"   # addon: keep checking and alerting | off: don't run at all
```

## Whitelist

```
/solver vpn whitelist add 203.0.113.7
/solver vpn whitelist add 198.51.100.0/24
```

Takes effect immediately, no restart needed. Also editable under `antivpn.whitelist` in `config.yml`.

## Privacy

`ipquery` and `ipapiis` send the connecting player's IP address to that third-party service — only for addresses the static lists and the cache didn't already resolve. The static lists never send anything. Turn any source off under `antivpn.own_engine.sources`, or AntiVPN entirely with `antivpn.own_engine.enabled: false`.

## Commands

| Command | Permission |
|---------|------------|
| `/solver vpn status` | `solver.vpn.check` |
| `/solver vpn check <player\|ip>` | `solver.vpn.check` |
| `/solver vpn whitelist add\|remove\|list <ip\|cidr>` | `solver.vpn.whitelist` |
| `/solver vpn clearcache` | `solver.vpn.clearcache` |
