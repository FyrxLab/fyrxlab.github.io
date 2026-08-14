# Provider IA

FyrxAI non esegue un proprio modello — porti tu una API key da uno dei quattro provider supportati, impostata per server con `/fyrxai provider set`.

| Provider | Valore di `provider` | Note |
|---|---|---|
| WaveSpeed | `wavespeed` | Endpoint compatibile OpenAI, con instradamento dei modelli, es. `anthropic/claude-3-haiku` |
| OpenRouter | `openrouter` | Compatibile OpenAI, qualsiasi modello supportato da OpenRouter |
| Google AI Studio | `googleai` | SDK ufficiale, es. `gemini-2.0-flash` |
| Claude Platform | `claude` | Anthropic Messages API direttamente, es. `claude-3-5-haiku-20241022` |

```
/fyrxai provider set provider:<nome> model:<modello> apikey:<chiave>
```

La chiave viene salvata cifrata con AES-256-GCM su disco, con una chiave generata automaticamente al primo avvio nella cartella `fyrxai-data/` del tuo bot. Se quel file viene mai perso (es. la cartella viene cancellata), la chiave salvata diventa illeggibile e dovrai rieseguire `provider set`.

## Cambiare provider

Rieseguire `provider set` con un valore di `provider` diverso sostituisce quello attivo immediatamente — non serve fare prima `provider remove`.

## Rimuovere un provider

```
/fyrxai provider remove
```

Senza provider configurato, FyrxAI esegue comunque la scansione della documentazione ed estrae parole chiave con `/fyrxai wiki add` (quella parte non richiede IA), ma non risponderà alle domande finché non ne configuri uno.
