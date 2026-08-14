# AI Providers

FyrxAI doesn't run its own model — you bring an API key from one of four supported providers, set per server with `/fyrxai provider set`.

| Provider | `provider` value | Notes |
|---|---|---|
| WaveSpeed | `wavespeed` | OpenAI-compatible endpoint with model routing, e.g. `anthropic/claude-3-haiku` |
| OpenRouter | `openrouter` | OpenAI-compatible, any model slug OpenRouter supports |
| Google AI Studio | `googleai` | Official SDK, e.g. `gemini-2.0-flash` |
| Claude Platform | `claude` | Anthropic Messages API directly, e.g. `claude-3-5-haiku-20241022` |

```
/fyrxai provider set provider:<name> model:<model> apikey:<key>
```

The key is stored AES-256-GCM-encrypted on disk, with a key generated automatically on first run in your bot's `fyrxai-data/` folder. If that file is ever lost (e.g. the folder gets wiped), the stored key becomes unreadable and you'll need to run `provider set` again.

## Switching providers

Running `provider set` again with a different `provider` value replaces the active one immediately — no need to `provider remove` first.

## Removing a provider

```
/fyrxai provider remove
```

With no provider configured, FyrxAI still crawls documentation and extracts keywords with `/fyrxai wiki add` (that part needs no AI), but it won't answer questions until a provider is set.
