# Configurazione

FyrxAI non ha file di configurazione né variabili d'ambiente — tutto si imposta da Discord con lo slash command `/fyrxai`. Discord lo nasconde di default a chiunque non abbia il permesso **Gestisci Server**.

## 1. Impostazioni nel Discord Developer Portal

Prima di installare, il tuo bot ha bisogno di:

- L'intent privilegiato **Message Content** abilitato (Bot → Privileged Gateway Intents), e `GatewayIntentBits.MessageContent` + `GatewayIntentBits.GuildMessages` nel costruttore del tuo `Client`.
- Lo scope OAuth2 `applications.commands` nel link di invito (insieme a `bot`), così Discord gli permette di registrare `/fyrxai`.

## 2. Scegli un canale di supporto

```
/fyrxai channel add #supporto
```

FyrxAI risponde automaticamente in questo canale — senza bisogno di menzionarlo. Usa `channel remove` o `channel list` per gestire l'insieme.

## 3. Aggiungi documentazione

```
/fyrxai wiki add name:conditionalevents url:https://tuo-sito-docs.example.com description:"plugin per condizioni e azioni personalizzate"
```

Questo esegue la scansione dell'intero sito partendo da quell'URL (provando `llms.txt`, poi `sitemap.xml`, poi link dello stesso dominio), ed estrae automaticamente fino a 100 parole chiave — senza bisogno di un provider IA per questo passaggio. Rilancialo con `wiki refresh` dopo che la documentazione sorgente cambia.

## 4. Scegli un provider IA

```
/fyrxai provider set provider:claude model:claude-3-5-haiku-20241022 apikey:sk-ant-...
```

Consulta [Provider IA](/it/fyrxai/providers) per l'elenco completo e le note per provider. La risposta è effimera — solo tu vedi la conferma, e la chiave non viene mai pubblicata come testo in chiaro.

## Altri comandi

| Comando | Cosa fa |
|---|---|
| `/fyrxai persona set <testo>` | Istruzioni extra per il system prompt, es. "Sei il bot di supporto di Acme Corp." |
| `/fyrxai exempt adduser <utente>` | Esenta un utente specifico dal cooldown per utente |
| `/fyrxai exempt addrole <ruolo>` | Esenta un ruolo (es. moderatori) dal cooldown |
| `/fyrxai status` | Mostra la configurazione attuale di questo server |
| `/fyrxai help` | Elenco completo dei comandi, dentro Discord |

## Ottenere una risposta direttamente

Due modi per saltare completamente il monitoraggio passivo del canale:

- **Menziona (@) il bot** ovunque — non solo nei canali di supporto configurati — per una risposta garantita (ancora soggetta al limite d'uso).
- **Menzionalo mentre rispondi** (reply) a un altro messaggio, e risponderà su *quel* messaggio invece che sul tuo testo. Utile per "ehi @FyrxAI, puoi spiegare questo?" su un messaggio confuso di qualcun altro.

## Dove vivono i dati

La configurazione del server e la chiave di cifratura AES-256-GCM per le API key salvate vivono in una cartella `fyrxai-data/` creata nella directory di lavoro del tuo bot — non dentro `node_modules`, quindi sopravvive a `npm ci`/redeploy. Aggiungi `fyrxai-data/` al tuo `.gitignore`.
