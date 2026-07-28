# Fyrx — Il Tuo Assistente IA

Fyrx è il cervello basato su IA di AbsoluteSolver. Agisce come un amministratore del server sempre attivo che monitora il tuo server Minecraft, intercetta gli errori e fornisce diagnosi chiare e leggibili in automatico.

## Cos'è Fyrx?

Quando il tuo server incontra un problema — che sia un'eccezione di un plugin, un crash o un picco di lag — Fyrx:

1. **Cattura** l'intero contesto dell'errore (stack trace, stato del thread, cronologia dei log)
2. **Invia** tutto a Google Gemini (o al tuo provider IA configurato)
3. **Restituisce** un report diagnostico strutturato e formattato direttamente nella tua console

Ottieni una spiegazione in linguaggio semplice di cosa è successo, quale plugin l'ha causato e cosa dovresti fare dopo — senza dover leggere una sola riga di Java.

## Provider IA Supportati

Fyrx è agnostico rispetto al provider. Puoi usare uno qualsiasi dei seguenti:

| Provider | Modelli | Note |
|----------|--------|-------|
| **Anthropic** | Sonnet, Haiku, Opus | Provider predefinito a partire da questa versione. Ragionamento di alta qualità. |
| **Google Gemini** | Pro, Flash | Piano gratuito disponibile. |
| **OpenAI / Compatibili** | `gpt-4o`, `gpt-4-turbo`, ecc. | Funziona con qualsiasi endpoint compatibile con OpenAI, inclusi modelli locali. |

## Formato della Risposta

Fyrx formatta le sue risposte usando i codici colore nativi di Minecraft direttamente nella console del tuo server:

```
╔══════════════════════════════════════════════════════════╗
║       ANALYSIS REPORT — FYRX                            ║
╚══════════════════════════════════════════════════════════╝

### 1. Root Cause
The error is a NullPointerException thrown in PluginX's
PlayerJoinEvent handler at PlayerListener.java:47.

### 2. Most Likely Cause
PluginX is trying to access player data before it has been
loaded from the database.

### 3. Recommended Action
Update PluginX to version 2.3.1+ which fixes this race condition.
If no update is available, disable PluginX temporarily.
════════════════════════════════════════════════════════════
```

## Prompt di Sistema e Regole

Fyrx opera secondo un rigido prompt di sistema che garantisce che:

- **Non** suggerisca mai di rimuovere AbsoluteSolver stesso
- Fornisca soluzioni **concrete**, non consigli vaghi
- Identifichi sempre la **causa principale** prima di dare raccomandazioni
- Consideri **più plugin** come possibili cause

## Impatto sulle Prestazioni

Fyrx è progettato per avere **zero impatto sui TPS del server**. Tutte le richieste IA vengono eseguite su thread in background usando `CompletableFuture`. Il tuo server non si fermerà, non avrà scatti né rallenterà mai mentre Fyrx sta analizzando un errore.
