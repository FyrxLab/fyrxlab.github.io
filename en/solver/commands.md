# Commands

AbsoluteSolver provides a single root command with subcommands grouped into four areas: diagnostics, the Sanctions system, the Staff Reports system, and the Staff Mode Toolkit.

## `/solver`

**Aliases:** `/as`
**Permission:** `solver.admin` (default: OP) grants everything below; see [Permissions](#permissions) for granular nodes.

Most subcommands are also available as their own standalone command (e.g. `/vanish` instead of `/solver vanish`) — see [Standalone Commands](#standalone-commands).

---

### Diagnostics

| Subcommand | Description | Permission |
|------------|-------------|------------|
| `help` | Shows the in-game command list. | — |
| `reload` | Reloads `config.yml` and restarts the AI without restarting the server. | `solver.diagnostics.reload` |
| `analyze-last` | Manually re-analyzes the most recent crash report in `crash-reports/`. | `solver.diagnostics.analyzelast` |
| `crashme <exception\|deadlock\|oom>` | Triggers a **real** test crash of the given type. | `solver.diagnostics.crashme` |
| `crashme dry-run` | Sends a synthetic crash report to Fyrx for diagnosis without actually affecting the server. | `solver.diagnostics.crashme` |
| `moderation status` | Shows chat moderation status: buffer size, tracked players, last verdict, average confidence, next scan countdown. | `solver.diagnostics.moderation` |
| `moderation test <message>` | Simulates a moderation analysis on an arbitrary message. | `solver.diagnostics.moderation` |
| `integrity [rescan]` | Shows build verification + known-malware scan status; `rescan` forces an immediate check. | `solver.diagnostics.integrity` |

### AntiVPN

See [AntiVPN](/en/solver/antivpn) for how detection works.

| Subcommand | Description | Permission |
|------------|-------------|------------|
| `vpn status` | Active sources, list age, cached verdicts, and calibration progress. | `solver.vpn.check` |
| `vpn check <player\|ip>` | Checks an address and shows the score breakdown. Doesn't count towards calibration. | `solver.vpn.check` |
| `vpn whitelist add\|remove\|list <ip\|cidr>` | Addresses that skip every check. Takes effect immediately. | `solver.vpn.whitelist` |
| `vpn clearcache` | Clears cached verdicts and re-downloads the lists. | `solver.vpn.clearcache` |

### Sanctions System

::: warning Beta
:::

| Subcommand | Description | Permission |
|------------|-------------|------------|
| `warn \| mute \| tempmute \| kick \| ban \| tempban <player> [duration] <reason>` | Applies the corresponding sanction. `duration` is required for the temp- variants (e.g. `30s`, `10m`, `1d`). A reason can also be `#name`, expanding to a [reason template](/en/solver/configuration#reason-templates--warn-escalation) configured in `config.yml`. | `solver.sanctions.<type>` |
| `unban \| unmute \| unwarn <player>` | Reverts an active sanction of that type. | `solver.sanctions.<type>` |
| `history <player>` | Shows a player's full sanction history. | `solver.sanctions.history` |
| `check <id>` | Shows the detail of a single sanction by its ID. | `solver.sanctions.check` |
| `note <player> <text>` | Saves an internal note on a player — never shown to them. | `solver.sanctions.note` |
| `checkuser <player>` | Cross-references IP history: shows every known alt account of a player and any active sanction tied to that whole network, not just the exact account name. | `solver.sanctions.checkuser` |
| `appeal <id> <reason>` | Lets a **sanctioned player** appeal their own sanction directly in-game. Open to everyone by default. | `solver.sanctions.appeal` (default: **true**) |
| `appeal list \| accept \| reject <id>` | Staff review pending appeals; `accept` reverts the sanction, `reject` leaves it standing. | `solver.sanctions.appeal.manage` |
| `sanctions <player>` | Opens a GUI browsing a player's full sanction history; click an active one for the exact command to revoke it. | `solver.sanctions.gui` |

Every sanction gets a real ID, persists in `sanctions.db` (or a MySQL database — see [Configuration](/en/solver/configuration#sanctions-storage)), and is enforced even if the server restarts. Bans reject login directly and instantly kick any other online account that has ever shared an IP with the banned one; mutes and active durations are restored on join.

### Staff Reports

New in 0.8.0. Lets any player flag something for staff attention, completely separate from the Sanctions system — a report isn't a punishment.

| Subcommand | Description | Permission |
|------------|-------------|------------|
| `report <player> <reason>` | Files a report against a player, capturing your current location for context. Open to everyone by default. | `solver.report` (default: **true**) |
| `reports` | Lists every open report. | `solver.reports.manage` |
| `reports claim \| close \| reopen <id> [reason]` | Manages the queue. The original reporter gets a direct in-game message when their report is claimed or closed. | `solver.reports.manage` |
| `reports gui` | Opens a GUI of open reports — left-click claims, right-click closes. | `solver.reports.gui` |

### Staff Mode Toolkit

::: warning Beta
:::

| Subcommand | Description | Permission |
|------------|-------------|------------|
| `vanish [strict]` | Toggles your own vanish mode. `strict` is a second, invisible-to-most-staff tier that needs a separate permission to see through. Hidden from other players, subtracted from the server-list count, mobs stop targeting you, and your name no longer leaks through tab-complete. | `solver.staffmode.vanish` (`.vanish.see-strict` to see through strict) |
| `freeze <player>` | Toggles freezing a player: blocks their movement, most commands, and combat. The freeze toggle itself always works on a frozen player, even without another staff member online to lift it. | `solver.staffmode.freeze` |
| `freeze <player> <message>` | Sends a message in that player's private freeze-chat channel instead of toggling — lets you actually talk to someone during a screenshare instead of just silencing them. | `solver.staffmode.freeze` |
| `staffchat [message]` | With no message, toggles a mode where everything you type only goes to staff. With a message, sends a one-off staff-only message without toggling. | `solver.staffmode.staffchat` |
| `commandspy` | Toggles a **live** relay of every other player's commands into your chat as they run them — not just retrospective logging. | `solver.staffmode.commandspy` |
| `staffmode <profile>` | Toggles a named combined profile you define in `config.yml` (vanish + freeze-immunity + flight + god-mode + inventory-clear). Your inventory is always saved and restored automatically. | `solver.staffmode.profiles` |
| `fly` | Toggles flight, independent of any profile. | `solver.staffmode.fly` |
| `god` | Toggles invulnerability, including PvP damage. | `solver.staffmode.god` |
| `rtp` | Teleports you to a random online non-staff player, for supervision rounds. | `solver.staffmode.rtp` |
| `inspect <player>` | Opens a view of a player's main inventory, armor, and offhand without physically opening it. Click an item to confiscate it directly from their real inventory. | `solver.staffmode.inspect` |
| `enderchest <player>` | Same view/confiscate treatment for a player's enderchest — kept as its own command since a Bukkit inventory window tops out at 54 slots, and `inspect`'s view already uses 41 of them. | `solver.staffmode.enderchest` |

A player with `solver.staffmode.silentjoin` connects already vanished, with no join message at all.

---

## Standalone Commands

The Sanctions, Staff Mode, Reports, and Moderation command groups are also registered directly, without the `/solver` prefix — `/solver <command>` keeps working exactly as before either way:

- **Staff Mode:** `/vanish`, `/freeze`, `/staffchat`, `/commandspy`, `/staffmode`, `/fly`, `/god`, `/inspect`, `/enderchest` (skipped automatically if EssentialsX is installed — its own `/enderchest` means "show my own", a different meaning from ours)
- **Sanctions:** `/warn`, `/mute`, `/tempmute`, `/kick`, `/ban`, `/tempban`, `/unban`, `/unmute`, `/unwarn`, `/history`, `/check`, `/note`, `/checkuser`, `/appeal`, `/sanctions`
- **Moderation:** `/moderation`
- **Reports:** `/report`

`rtp` has no standalone form on purpose — that bare name is already a very common "random teleport within the world border" command in the wider plugin ecosystem, and it means something different from ours.

Each category can be turned off independently in `config.yml` if another installed plugin already claims one of those names:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (unless EssentialsX is installed)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## Usage Examples

**Trigger a manual crash analysis:**
```
/solver analyze-last
```

**Test diagnosis without a real crash:**
```
/solver crashme dry-run
```

**Warn, then temp-mute, a player:**
```
/solver warn Steve Spamming in chat
/solver tempmute Steve 10m Continued spam after warning
```

**Check a player's sanction history:**
```
/solver history Steve
```

**Look for alt accounts before deciding whether to ban:**
```
/solver checkuser Steve
```

**Appeal your own sanction:**
```
/solver appeal 42 I was defending myself
```

**Report a player to staff:**
```
/solver report Steve Griefing my base
```

**Toggle your own vanish (or the standalone form):**
```
/solver vanish
/vanish
```

::: warning Crash Tests Are Dangerous
The `crashme exception|deadlock|oom` subcommands are intended for **testing purposes only** in a development environment. Do **not** run `crashme oom` on a production server — it will cause a real OutOfMemoryError. Use `crashme dry-run` if you just want to see Fyrx's diagnosis output safely.
:::

---

## Permissions

Permissions are grouped so you can grant a whole category at once (e.g. via LuckPerms) without handing out full admin access.

| Permission | Default | Description |
|------------|---------|-------------|
| `solver.admin` | OP | Full access to everything below. |
| `solver.notify` | OP | Receive in-game notifications for errors and chat-moderation alerts. |
| `solver.moderation.bypass` | false | Exempts this specific player from chat moderation, OP or not. |
| `solver.diagnostics.*` | false | All diagnostics commands (`reload`/`analyze-last`/`crashme`/`moderation`). |
| `solver.sanctions.*` | false | All sanctions commands, including `checkuser`, `appeal.manage`, and the `sanctions` GUI. |
| `solver.staffmode.*` | false | All Staff Mode Toolkit commands. |
| `solver.vpn.*` | false | All AntiVPN commands (`vpn status`/`check`/`whitelist`/`clearcache`). |
| `solver.reports.*` | false | All Reports commands. |
| `solver.report` | **true** | Submit a report (`/solver report`). Open to everyone by default. |
| `solver.sanctions.appeal` | **true** | Submit an appeal on your own sanction (`/solver appeal <id> <reason>`). Open to everyone by default. |

Each subcommand also has its own individual leaf permission (e.g. `solver.sanctions.warn`, `solver.staffmode.vanish`, `solver.staffmode.commandspy`, `solver.staffmode.inspect`, `solver.staffmode.enderchest`, `solver.staffmode.vanish.see-strict`, `solver.reports.manage`, `solver.reports.gui`) if you need finer-grained control than the wildcard groups above.

You can grant these permissions using any permission plugin (e.g., LuckPerms):

```
/lp user <player> permission set solver.sanctions.* true
```
