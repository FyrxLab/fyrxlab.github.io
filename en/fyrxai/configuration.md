# Configuration

FyrxAI has no config file and no environment variables — everything is set from Discord with the `/fyrxai` slash command. Discord hides it from anyone without the **Manage Server** permission by default.

## 1. Discord Developer Portal setup

Before installing, your bot needs:

- The **Message Content** privileged intent enabled (Bot → Privileged Gateway Intents), and `GatewayIntentBits.MessageContent` + `GatewayIntentBits.GuildMessages` in your `Client` constructor.
- The `applications.commands` OAuth2 scope on your invite link (alongside `bot`), so Discord lets it register `/fyrxai`.

## 2. Pick a support channel

```
/fyrxai channel add #support
```

FyrxAI answers automatically in this channel — no mention needed. Run `channel remove` or `channel list` to manage the set.

## 3. Add documentation

```
/fyrxai wiki add name:conditionalevents url:https://your-docs-site.example.com description:"plugin for custom conditions and actions"
```

This crawls the whole site starting from that URL (trying `llms.txt`, then `sitemap.xml`, then same-origin links), and extracts up to 100 keywords automatically — no AI provider required for this step. Re-run with `wiki refresh` after the source docs change.

## 4. Pick an AI provider

```
/fyrxai provider set provider:claude model:claude-3-5-haiku-20241022 apikey:sk-ant-...
```

See [AI Providers](/en/fyrxai/providers) for the full list and per-provider notes. The reply is ephemeral — only you see the confirmation, and the key is never posted as plain text.

## Other commands

| Command | What it does |
|---|---|
| `/fyrxai persona set <text>` | Extra system-prompt instructions, e.g. "You are the support bot for Acme Corp." |
| `/fyrxai exempt adduser <user>` | Exempt a specific user from the per-user cooldown |
| `/fyrxai exempt addrole <role>` | Exempt a role (e.g. moderators) from the cooldown |
| `/fyrxai status` | Show the current configuration for this server |
| `/fyrxai help` | Full command list, in-Discord |

## Getting an answer directly

Two ways to bypass the passive channel-watching entirely:

- **@mention the bot** anywhere — not just configured support channels — for a guaranteed answer (still subject to the rate limit).
- **@mention it while replying** to someone else's message, and it answers about *that* message instead of your own text. Useful for "hey @FyrxAI, can you explain this?" on a confusing message from someone else.

## Where data lives

Guild configuration and the AES-256-GCM encryption key for stored API keys live in a `fyrxai-data/` folder created in your bot's own working directory — not inside `node_modules`, so it survives `npm ci`/redeploys. Add `fyrxai-data/` to your `.gitignore`.
