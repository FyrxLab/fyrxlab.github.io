# Configuration

AbsoluteSolver is configured through `plugins/Solver/config.yml`. New options added by an update are picked up automatically — anything you've already customized is left untouched. On 1.18.1+ they're added to your `config.yml` with their explanation; on 1.8–1.17 your file isn't rewritten (saving it there would erase every comment): the new options run with their default values, the console lists them, and a fully documented `config-reference.yml` is written next to your config.

## Diagnostics Reference

```yaml
# Language (en_US, es_ES, pt_BR, ru_RU, de_DE, fr_FR, ja_JP, ko_KR, eo_EO)
localization: en_US

# Automatically analyze whether there was a crash when the server starts up
check-crash-on-startup: true

# Monitor the entire console for errors (red text)
monitor-console: true
# Avoid analyzing the same error multiple times (minutes to wait)
error-cooldown-minutes: 10

# Show the giant ASCII art banner in the console on startup?
show-banner: true

# AI Provider Configuration
ai-provider:
  # Provider: 'anthropic', 'google' or 'other'
  provider: "anthropic"

  # Model to use
  # Anthropic: Sonnet, Haiku, Opus
  # Google: Pro, Flash
  # Other: Model name (e.g: gpt-4o, mistral-large)
  model: "Sonnet"

  # API Keys
  anthropic-key: ""
  google-key: ""

  # Configuration for the 'other' provider (OpenAI-compatible)
  other-key: ""
  other-url: "https://api.openai.com/v1/chat/completions"

# Analysis configuration
analysis:
  auto-analyze: true
  timeout: 60
  save-to-file: true
  reports-directory: "crash-reports"
  # How many days to keep analyses saved before deleting them. 0 = keep forever.
  reports-retention-days: 0

# Notifications
notifications:
  notify-admins: true
  send-to-chat: false
```

::: tip Default provider changed to Anthropic
As of this release, the shipped default is **Anthropic Claude** (`provider: "anthropic"`, model `Sonnet`), not Google Gemini. Gemini and any OpenAI-compatible endpoint remain fully supported — see [Fyrx — Your AI Assistant](/en/solver/fyrx-ai) to switch.
:::

### Option Reference — Diagnostics

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `localization` | String | `en_US` | Language for Fyrx's AI responses and in-game messages. |
| `check-crash-on-startup` | Boolean | `true` | Scan `crash-reports/` on boot. |
| `monitor-console` | Boolean | `true` | Intercept console errors via Log4j. |
| `error-cooldown-minutes` | Integer | `10` | Minutes between consecutive analyses. |
| `show-banner` | Boolean | `true` | Show ASCII banner on startup. |
| `ai-provider.provider` | String | `anthropic` | Which AI backend to use: `anthropic`, `google`, or `other`. |
| `ai-provider.model` | String | `Sonnet` | The specific model name for the selected provider. |
| `analysis.reports-retention-days` | Integer | `0` | Days to keep files in `reports-directory` before auto-deleting. `0` = forever. |

## Chat Moderation

Fyrx can read chat and evaluate the *context* of a conversation instead of matching a word blacklist. Enabling this sends chat content to the AI provider configured above. **Disabled by default for privacy.**

```yaml
chat-moderation:
  enabled: false
  exempt-ops: true
  buffer-size: 50
  context-window-minutes: 5
  analysis-interval-seconds: 45
  scan-mode: "bulk"          # "bulk" or "individual"
  llm-analysis-level: 2      # 0-3, see below

  pre-filter:
    trigger-on-repeated-target: true
    trigger-on-caps-ratio: 0.6
    min-messages-before-trigger: 3
    urgent-score-threshold: 0.65

  action:
    mode: "alert-only"       # "alert-only", "warn-player", or "auto-action"
    severity-threshold-mute: 4
    severity-threshold-kick: 5
    mute-duration-minutes: 10
    min-confidence-to-act-alone: 85
    min-severity-to-act-alone: 4

  log-incidents-to-file: true
  log-test-results-to-console: true
  reports-retention-days: 0
```

### `llm-analysis-level` — how often the AI is actually called

`scan-mode` decides *how* the AI is called (one call for the whole conversation, or one per active player); `llm-analysis-level` decides *when*:

| Level | Behavior |
|-------|----------|
| `0` | Never calls the AI — the local pre-filter decides entirely on its own. Works with no AI provider configured at all. |
| `1` | Only calls the AI once the pre-filter already flagged something suspicious. |
| `2` (default) | The AI reviews all new chat every cycle, regardless of the pre-filter. |
| `3` | Real-time: every message is sent to the AI immediately, instead of waiting for `analysis-interval-seconds`. |

### Multi-signal corroboration

A moderation verdict from the AI alone can only trigger an automatic sanction (`action.mode: "auto-action"`) when it's **both** at least `min-confidence-to-act-alone` confident **and** at least `min-severity-to-act-alone` severe. Below that threshold, an automatic sanction also requires at least one corroborating local pre-filter signal (shouting, an insult keyword, hammering the same target, a burst of messages) — otherwise the verdict stays a staff-only alert for manual review via `/solver moderation status` or `/solver check`.

### Option Reference — Chat Moderation

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `chat-moderation.enabled` | Boolean | `false` | Master switch. Sends chat to your configured AI provider when on. |
| `chat-moderation.exempt-ops` | Boolean | `true` | OPs are automatically exempt. `solver.moderation.bypass` exempts a specific player regardless of this setting. |
| `chat-moderation.buffer-size` | Integer | `50` | Maximum recent messages remembered per player/globally. |
| `chat-moderation.context-window-minutes` | Integer | `5` | Time window of context sent to the AI. |
| `chat-moderation.analysis-interval-seconds` | Integer | `45` | How often the unconditional sweep checks for new chat to analyze. |
| `chat-moderation.scan-mode` | String | `bulk` | `bulk` = one AI call for the whole conversation (cheaper, can confuse who said what). `individual` = one call per active player (no confusion, costs scale with active players). |
| `chat-moderation.action.mode` | String | `alert-only` | `alert-only` notifies staff only. `warn-player` also privately notifies the flagged player. `auto-action` additionally mutes/kicks automatically based on severity. |
| `chat-moderation.action.severity-threshold-mute` | Integer | `4` | Severity (1-5) at which `auto-action` automatically mutes. |
| `chat-moderation.action.severity-threshold-kick` | Integer | `5` | Severity at which `auto-action` automatically kicks instead of muting. |
| `chat-moderation.action.min-confidence-to-act-alone` | Integer | `85` | Confidence (0-100) required for the AI verdict alone to sanction, without pre-filter corroboration. |
| `chat-moderation.action.min-severity-to-act-alone` | Integer | `4` | Severity (1-5) required for the AI verdict alone to sanction, without pre-filter corroboration. |

### Tag Overrides — mapping a "situation" to a specific sanction

`severity-threshold-mute`/`severity-threshold-kick` only reach as far as a kick — `auto-action` never bans on its own. `chat-moderation.action.tag-overrides` lets you force a specific sanction type for a specific AI tag instead, regardless of severity. This is the only way to reach an automatic ban/tempban from chat moderation:

```yaml
chat-moderation:
  action:
    tag-overrides:
      THREAT:
        type: tempban
        duration: 7d
      HATE_SPEECH:
        type: tempban
        duration: 3d
      SCAM:
        type: ban
```

- Valid `type`s: `warn`, `mute`, `tempmute`, `kick`, `ban`, `tempban` (`duration` required for the temp- variants).
- Only used when `action.mode` is `auto-action`.
- If a verdict matches more than one configured tag, the harshest configured type wins.

### `tags.yml` — define your own moderation categories

The categories the AI can use (`TOXIC`, `HARASSMENT`, `THREAT`, `HATE_SPEECH`, `SCAM`, `SPAM` by default) live in `plugins/Solver/tags.yml`, not hardcoded in the plugin. Add, edit, or remove a tag there and the prompt sent to the AI updates automatically — no recompiling, no code changes:

```yaml
tags:
  TOXIC: "Rude, insulting, or demeaning language with real malicious intent (not friendly banter between people who are fine with it)."
  HARASSMENT: "Insistent, repeated targeting of the same player, especially after they show discomfort or ask to stop."
  THREAT: "Threats of violence, real-world harm, or encouraging self-harm directed at someone."
  HATE_SPEECH: "Attacks based on race, religion, gender, sexual orientation, nationality, or similar."
  SCAM: "Attempts to defraud or phish another player (fake giveaways, asking for passwords/account info/real money)."
  SPAM: "Repetitive, advertising, or flooding messages with no other issue."
```

Whatever tag name you define here is also what you reference in `chat-moderation.action.tag-overrides` above. Re-applied automatically on `/solver reload` — no restart needed to add a new category.

## Standalone Commands

Lets each command group (see [Commands](/en/solver/commands#standalone-commands)) also register without the `/solver` prefix — turn a category off if another installed plugin already owns one of those command names:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (unless EssentialsX is installed)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## CommandSpy

Live relay of every command run on the server to whichever staff toggled it on with `/solver commandspy` — unlike retrospective command logging, this shows up as it happens.

```yaml
commandspy:
  enabled: true
  watch-patterns: ["*"]
  exempt-players: []
  exempt-permissions: []
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `commandspy.enabled` | Boolean | `true` | Master switch. |
| `commandspy.watch-patterns` | List | `["*"]` | `"*"` watches every command. Otherwise list specific command names (without the leading `/`) to only relay those, e.g. `["op", "gamemode", "give"]`. |
| `commandspy.exempt-players` | List | `[]` | Player names (case-insensitive) never relayed, no matter who's watching. |
| `commandspy.exempt-permissions` | List | `[]` | Anyone holding one of these permissions is never relayed either. |

## `/solver inspect` and `/solver enderchest`

```yaml
inspect:
  live-refresh: false
  live-refresh-interval-ticks: 10
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `inspect.live-refresh` | Boolean | `false` | Keep re-capturing the opened inventory every few ticks instead of a one-time snapshot. This is polling, not a real push update — Bukkit has no "inventory changed" event to react to. Shared by both `/solver inspect` and `/solver enderchest`. |
| `inspect.live-refresh-interval-ticks` | Integer | `10` | How often to refresh, in ticks, when the option above is on. |

## Staff Mode Toolkit

```yaml
staff-mode:
  profiles: {}
  #  moderator:
  #    vanish: true
  #    freeze-immunity: true
  #    flight: true
  #    god-mode: true
  #    clear-inventory: true
  #  builder:
  #    flight: true
  vanish:
    invulnerable-while-vanished: false
    hide-from-server-list: true
  freeze:
    allowed-commands: ["msg", "tell", "r", "helpop"]
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `staff-mode.profiles.<name>` | Section | *(empty)* | Named combined profile for `/solver staffmode <name>` — toggles a bundle of individual staff tools at once. Every field is optional and defaults to off (`vanish`, `freeze-immunity`, `flight`, `god-mode`, `clear-inventory`). `clear-inventory` always saves your items first and restores them when you leave the profile. |
| `staff-mode.vanish.hide-from-server-list` | Boolean | `true` | Also subtract vanished players from the server-list player count. |
| `staff-mode.vanish.invulnerable-while-vanished` | Boolean | `false` | Makes a vanished player immune to damage while vanished. |
| `staff-mode.freeze.allowed-commands` | List | `["msg", "tell", "r", "helpop"]` | Commands (without the leading `/`) a frozen player can still run. The freeze-toggle command itself always works regardless of this list, so a frozen staff member can never get permanently stuck. |

`/solver vanish strict` and `solver.staffmode.vanish.see-strict` (a separate permission, not inherited from regular vanish) add a second tier that's invisible even to most staff. Staff with `solver.staffmode.silentjoin` connect already vanished, with no join message.

## Sanctions System

### Storage backend

```yaml
punishments:
  storage: sqlite
  mysql:
    host: localhost
    port: 3306
    database: solver
    user: solver
    password: ""
```

`sqlite` (default, zero configuration, `sanctions.db`) or `mysql` for multi-server setups sharing one sanctions database — same commands, same data either way. Sanction history and active mutes/bans are restored automatically on join or server restart regardless of which backend you use.

### Reason templates & warn escalation

```yaml
punishments:
  reason-templates: {}
  #  griefing:
  #    text: "Griefing / destroying other players' builds"
  #    duration: "1d"
  warn-escalation: {}
  #  "3":
  #    action: sanction
  #    type: kick
  #    reason: "Auto: 3 warnings"
  #  "5":
  #    action: sanction
  #    type: tempban
  #    duration: "1d"
  #    reason: "Auto: 5 warnings"
```

- **`reason-templates`** — `/solver ban Player #griefing` expands `#griefing` to the configured `text` (and `duration`, if the sanction type needs one and none was given explicitly). A `#name` with no matching template is left as a literal reason, so this never breaks a reason that legitimately starts with `#`.
- **`warn-escalation`** — after a `WARN` is recorded, if the player's total warn count matches a key here, the configured action fires automatically: `action: sanction` applies another sanction (`type`/`reason`/`duration`, same fields as a manual one), `action: command` runs a console command instead (`{player}` is replaced with the player's name).

### Appeals

```yaml
punishments:
  appeals:
    show-in-sanction-message: true
```

Shows a line pointing to `/solver appeal <id> <reason>` in warn/mute/kick/ban messages, entirely in-game — no Discord webhook needed. Staff are notified immediately when a new appeal comes in, the same way a new report notifies them.

## Usage Statistics

```yaml
metrics:
  enabled: true
```

Anonymous usage statistics via [bStats](https://bstats.org/plugin/bukkit/Solver/33362) — server count, which AI provider is configured, which features are enabled. Nothing player-identifiable. Set `metrics.enabled: false` to opt out, independent of the global bStats toggle in `plugins/bStats/config.yml` (which also always applies).

## Proxy Relay

::: tip Same jar on the proxy
This section only turns the relay on for this backend. The proxy needs the same `Solver.jar` installed too — see [Proxy Networks](/en/solver/proxy-relay), which also covers AntiVPN and integrity checks at the proxy.
:::

```yaml
proxy-relay:
  enabled: false
```

Off by default. When enabled, relays staffchat messages and moderation/integrity alerts to staff connected to any backend server on the same BungeeCord/Waterfall/Velocity network, not just the one where the alert happened.

## Supported Languages

| Code | Language |
|------|----------|
| `en_US` | English (United States) |
| `es_ES` | Spanish (Spain) |
| `pt_BR` | Portuguese (Brazil) |
| `de_DE` | German |
| `fr_FR` | French |
| `ru_RU` | Russian |
| `ja_JP` | Japanese |
| `ko_KR` | Korean |
| `eo_EO` | Esperanto |

Every player/staff-facing message (help, errors, sanctions, moderation alerts) lives in `plugins/Solver/lang/<locale>/messages.yml` with full [MiniMessage](https://docs.papermc.io/adventure/minimessage/format) support, and is safe to edit — your customizations are preserved across updates.

## Using Alternative AI Providers

### Google Gemini

```yaml
ai-provider:
  provider: "google"
  model: "Flash"
  google-key: "AIza..."
```

### OpenAI or any Compatible API

```yaml
ai-provider:
  provider: "other"
  model: "gpt-4o"
  other-key: "sk-..."
  other-url: "https://api.openai.com/v1/chat/completions"
```

This also works with local models via **Ollama** or **LM Studio** by pointing `other-url` to their local endpoint.
