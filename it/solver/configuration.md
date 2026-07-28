# Configurazione

AbsoluteSolver si configura tramite `plugins/Solver/config.yml`. Le nuove opzioni aggiunte da un aggiornamento vengono unite automaticamente all'avvio — tutto ciò che hai già personalizzato resta intatto.

## Riferimento Diagnostica

```yaml
# Lingua (en_US, es_ES, pt_BR, ru_RU, de_DE, fr_FR, ja_JP, ko_KR, eo_EO)
localization: en_US

# Analizzare automaticamente se c'è stato un crash all'avvio del server
check-crash-on-startup: true

# Monitorare l'intera console per errori (testo rosso)
monitor-console: true
# Evita di analizzare lo stesso errore più volte (minuti di attesa)
error-cooldown-minutes: 10

# Mostrare il gigantesco banner ASCII in console all'avvio?
show-banner: true

# Configurazione del Provider IA
ai-provider:
  # Provider: 'anthropic', 'google' o 'other'
  provider: "anthropic"

  # Modello da usare
  # Anthropic: Sonnet, Haiku, Opus
  # Google: Pro, Flash
  # Other: Nome del modello (es: gpt-4o, mistral-large)
  model: "Sonnet"

  # Chiavi API
  anthropic-key: ""
  google-key: ""

  # Configurazione per il provider 'other' (compatibile con OpenAI)
  other-key: ""
  other-url: "https://api.openai.com/v1/chat/completions"

# Configurazione analisi
analysis:
  auto-analyze: true
  timeout: 60
  save-to-file: true
  reports-directory: "crash-reports"
  # Quanti giorni conservare le analisi salvate prima di eliminarle. 0 = per sempre.
  reports-retention-days: 0

# Notifiche
notifications:
  notify-admins: true
  send-to-chat: false
```

::: tip Il provider predefinito è cambiato in Anthropic
Da questa versione, il predefinito di fabbrica è **Anthropic Claude** (`provider: "anthropic"`, modello `Sonnet`), non Google Gemini. Gemini e qualsiasi endpoint compatibile con OpenAI restano pienamente supportati — vedi [Fyrx — Il Tuo Assistente IA](/it/solver/fyrx-ai) per cambiare.
:::

### Tabella di Riferimento — Diagnostica

| Chiave | Tipo | Predefinito | Descrizione |
|-----|------|---------|-------------|
| `localization` | Stringa | `en_US` | Lingua delle risposte IA di Fyrx e dei messaggi in gioco. |
| `check-crash-on-startup` | Booleano | `true` | Scansiona `crash-reports/` all'avvio. |
| `monitor-console` | Booleano | `true` | Intercetta gli errori della console tramite Log4j. |
| `error-cooldown-minutes` | Intero | `10` | Minuti tra analisi consecutive. |
| `show-banner` | Booleano | `true` | Mostra il banner ASCII all'avvio. |
| `ai-provider.provider` | Stringa | `anthropic` | Quale backend IA usare: `anthropic`, `google`, o `other`. |
| `ai-provider.model` | Stringa | `Sonnet` | Il nome specifico del modello per il provider scelto. |
| `analysis.reports-retention-days` | Intero | `0` | Giorni per cui conservare i file in `reports-directory` prima dell'eliminazione automatica. `0` = per sempre. |

## Moderazione del Chat

Fyrx può leggere il chat e valutare il *contesto* di una conversazione invece di confrontarlo con una lista di parole vietate. Attivare questa opzione invia il contenuto del chat al provider IA configurato sopra. **Disabilitato di default per privacy.**

```yaml
chat-moderation:
  enabled: false
  exempt-ops: true
  buffer-size: 50
  context-window-minutes: 5
  analysis-interval-seconds: 45
  scan-mode: "bulk"          # "bulk" o "individual"
  llm-analysis-level: 2      # 0-3, vedi sotto

  pre-filter:
    trigger-on-repeated-target: true
    trigger-on-caps-ratio: 0.6
    min-messages-before-trigger: 3
    urgent-score-threshold: 0.65

  action:
    mode: "alert-only"       # "alert-only", "warn-player", o "auto-action"
    severity-threshold-mute: 4
    severity-threshold-kick: 5
    mute-duration-minutes: 10
    min-confidence-to-act-alone: 85
    min-severity-to-act-alone: 4

  log-incidents-to-file: true
  log-test-results-to-console: true
  reports-retention-days: 0
```

### `llm-analysis-level` — con quale frequenza viene davvero chiamata l'IA

`scan-mode` decide *come* viene chiamata l'IA (una chiamata per l'intera conversazione, o una per giocatore attivo); `llm-analysis-level` decide *quando*:

| Livello | Comportamento |
|-------|--------|
| `0` | Non chiama mai l'IA — il pre-filtro locale decide interamente da solo. Funziona senza alcun provider IA configurato. |
| `1` | Chiama l'IA solo quando il pre-filtro ha già segnalato qualcosa di sospetto. |
| `2` (predefinito) | L'IA rivede tutto il nuovo chat a ogni ciclo, indipendentemente dal pre-filtro. |
| `3` | Tempo reale: ogni messaggio viene inviato all'IA immediatamente, invece di aspettare `analysis-interval-seconds`. |

### Corroborazione multi-segnale

Un verdetto dell'IA da solo può innescare una sanzione automatica (`action.mode: "auto-action"`) solo quando è **sia** almeno confidente quanto `min-confidence-to-act-alone` **sia** almeno severo quanto `min-severity-to-act-alone`. Sotto quella soglia, una sanzione automatica richiede anche almeno un segnale locale corroborante dal pre-filtro (urla, una parola offensiva, insistenza sullo stesso bersaglio, una raffica di messaggi) — altrimenti il verdetto resta un avviso solo per lo staff, per revisione manuale tramite `/solver moderation status` o `/solver check`.

### Tabella di Riferimento — Moderazione del Chat

| Chiave | Tipo | Predefinito | Descrizione |
|-----|------|---------|-------------|
| `chat-moderation.enabled` | Booleano | `false` | Interruttore principale. Invia il chat al tuo provider IA configurato quando attivo. |
| `chat-moderation.exempt-ops` | Booleano | `true` | Gli OP sono automaticamente esenti. `solver.moderation.bypass` esenta un giocatore specifico indipendentemente da questo valore. |
| `chat-moderation.buffer-size` | Intero | `50` | Massimo di messaggi recenti ricordati per giocatore/globalmente. |
| `chat-moderation.context-window-minutes` | Intero | `5` | Finestra temporale di contesto inviata all'IA. |
| `chat-moderation.analysis-interval-seconds` | Intero | `45` | Ogni quanto la scansione incondizionata controlla se c'è nuovo chat da analizzare. |
| `chat-moderation.scan-mode` | Stringa | `bulk` | `bulk` = una chiamata IA per l'intera conversazione (più economico, può confondere chi ha detto cosa). `individual` = una chiamata per giocatore attivo (nessuna confusione, il costo scala con i giocatori attivi). |
| `chat-moderation.action.mode` | Stringa | `alert-only` | `alert-only` avvisa solo lo staff. `warn-player` avvisa anche in privato il giocatore segnalato. `auto-action` inoltre silenzia/espelle automaticamente in base alla severità. |
| `chat-moderation.action.severity-threshold-mute` | Intero | `4` | Severità (1-5) oltre la quale `auto-action` silenzia automaticamente. |
| `chat-moderation.action.severity-threshold-kick` | Intero | `5` | Severità oltre la quale `auto-action` espelle invece di silenziare. |
| `chat-moderation.action.min-confidence-to-act-alone` | Intero | `85` | Confidenza (0-100) richiesta perché il verdetto dell'IA da solo sanzioni, senza corroborazione del pre-filtro. |
| `chat-moderation.action.min-severity-to-act-alone` | Intero | `4` | Severità (1-5) richiesta perché il verdetto dell'IA da solo sanzioni, senza corroborazione del pre-filtro. |

### Tag Overrides — mappare una "situazione" a una sanzione specifica

`severity-threshold-mute`/`severity-threshold-kick` arrivano solo fino a un kick — `auto-action` non banna mai da sola. `chat-moderation.action.tag-overrides` ti permette di forzare un tipo di sanzione specifico per un tag IA particolare, indipendentemente dalla severità. È l'unico modo per arrivare a un ban/tempban automatico dalla moderazione del chat:

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

- Tipi validi: `warn`, `mute`, `tempmute`, `kick`, `ban`, `tempban` (`duration` obbligatoria per le varianti temp-).
- Usato solo quando `action.mode` è `auto-action`.
- Se un verdetto corrisponde a più di un tag configurato, vince il tipo configurato più severo.

### `tags.yml` — definisci le tue categorie di moderazione

Le categorie che l'IA può usare (`TOXIC`, `HARASSMENT`, `THREAT`, `HATE_SPEECH`, `SCAM`, `SPAM` di default) vivono in `plugins/Solver/tags.yml`, non sono più hardcoded nel plugin. Aggiungi, modifica o rimuovi un tag lì e il prompt inviato all'IA si aggiorna automaticamente — senza ricompilare, senza toccare il codice:

```yaml
tags:
  TOXIC: "Rude, insulting, or demeaning language with real malicious intent (not friendly banter between people who are fine with it)."
  HARASSMENT: "Insistent, repeated targeting of the same player, especially after they show discomfort or ask to stop."
  THREAT: "Threats of violence, real-world harm, or encouraging self-harm directed at someone."
  HATE_SPEECH: "Attacks based on race, religion, gender, sexual orientation, nationality, or similar."
  SCAM: "Attempts to defraud or phish another player (fake giveaways, asking for passwords/account info/real money)."
  SPAM: "Repetitive, advertising, or flooding messages with no other issue."
```

::: tip Le descrizioni sono in inglese
Viaggiano dentro il prompt interno che riceve l'IA, quindi restano in inglese come il resto di quel prompt — solo il testo finale visto dallo staff viene tradotto nella lingua del server.
:::

Il nome di ogni tag che definisci qui è esattamente ciò che poi usi in `chat-moderation.action.tag-overrides` sopra. Viene riapplicato automaticamente a ogni `/solver reload` — nessun riavvio necessario per aggiungere una nuova categoria.

## Comandi Indipendenti

Permette a ogni gruppo di comandi (vedi [Comandi](/it/solver/commands#comandi-indipendenti)) di registrarsi anche senza il prefisso `/solver` — disattiva una categoria se un altro plugin installato usa già uno di quei nomi:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (a meno che EssentialsX non sia installato)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## CommandSpy

Relay in tempo reale di ogni comando eseguito sul server verso qualsiasi staff che lo abbia attivato con `/solver commandspy` — a differenza di un log retrospettivo, questo si vede mentre accade.

```yaml
commandspy:
  enabled: true
  watch-patterns: ["*"]
  exempt-players: []
  exempt-permissions: []
```

| Chiave | Tipo | Predefinito | Descrizione |
|-----|------|---------|-------------|
| `commandspy.enabled` | Booleano | `true` | Interruttore principale. |
| `commandspy.watch-patterns` | Lista | `["*"]` | `"*"` osserva ogni comando. Altrimenti elenca nomi di comandi specifici (senza la `/` iniziale) per rilanciare solo quelli, es. `["op", "gamemode", "give"]`. |
| `commandspy.exempt-players` | Lista | `[]` | Nomi di giocatori (senza distinzione maiuscole/minuscole) mai rilanciati, indipendentemente da chi sta osservando. |
| `commandspy.exempt-permissions` | Lista | `[]` | Chiunque abbia uno di questi permessi non viene mai rilanciato. |

## `/solver inspect` e `/solver enderchest`

```yaml
inspect:
  live-refresh: false
  live-refresh-interval-ticks: 10
```

| Chiave | Tipo | Predefinito | Descrizione |
|-----|------|---------|-------------|
| `inspect.live-refresh` | Booleano | `false` | Continua a ricatturare l'inventario aperto ogni pochi tick invece di uno snapshot una tantum. Questo è polling, non un vero aggiornamento push — Bukkit non ha un evento "inventario cambiato". Condiviso sia da `/solver inspect` che da `/solver enderchest`. |
| `inspect.live-refresh-interval-ticks` | Intero | `10` | Ogni quanti tick aggiornare, quando l'opzione sopra è attiva. |

## Staff Mode Toolkit

::: warning Beta
:::

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

| Chiave | Tipo | Predefinito | Descrizione |
|-----|------|---------|-------------|
| `staff-mode.profiles.<nome>` | Sezione | *(vuoto)* | Profilo combinato con nome per `/solver staffmode <nome>` — alterna un insieme di strumenti staff in una volta. Ogni campo è opzionale e di default disattivato (`vanish`, `freeze-immunity`, `flight`, `god-mode`, `clear-inventory`). `clear-inventory` salva sempre i tuoi oggetti prima e li ripristina quando esci dal profilo. |
| `staff-mode.vanish.hide-from-server-list` | Booleano | `true` | Sottrae anche i giocatori in vanish dal conteggio giocatori della lista server. |
| `staff-mode.vanish.invulnerable-while-vanished` | Booleano | `false` | Rende immune al danno un giocatore mentre è in vanish. |
| `staff-mode.freeze.allowed-commands` | Lista | `["msg", "tell", "r", "helpop"]` | Comandi (senza la `/` iniziale) che un giocatore congelato può comunque usare. Il comando per alternare il congelamento funziona sempre indipendentemente da questa lista, così uno staff congelato non resta mai bloccato per sempre. |

`/solver vanish strict` e `solver.staffmode.vanish.see-strict` (un permesso separato, non ereditato dal vanish normale) aggiungono un secondo livello invisibile anche alla maggior parte dello staff. Uno staff con `solver.staffmode.silentjoin` si connette già in vanish, senza messaggio di ingresso.

## Sistema di Sanzioni

::: warning Beta
:::

### Backend di archiviazione

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

`sqlite` (predefinito, senza configurazione, `sanctions.db`) o `mysql` per installazioni multi-server che condividono lo stesso database di sanzioni — stessi comandi, stessi dati in entrambi i casi. Lo storico delle sanzioni e i mute/ban attivi vengono ripristinati automaticamente al login o al riavvio del server indipendentemente dal backend usato.

### Modelli di motivo ed escalation degli avvisi

```yaml
punishments:
  reason-templates: {}
  #  griefing:
  #    text: "Griefing / distruzione delle costruzioni di altri giocatori"
  #    duration: "1d"
  warn-escalation: {}
  #  "3":
  #    action: sanction
  #    type: kick
  #    reason: "Auto: 3 avvisi"
  #  "5":
  #    action: sanction
  #    type: tempban
  #    duration: "1d"
  #    reason: "Auto: 5 avvisi"
```

- **`reason-templates`** — `/solver ban Giocatore #griefing` espande `#griefing` nel `text` configurato (e nella `duration`, se il tipo di sanzione ne ha bisogno e non ne è stata data una esplicita). Un `#nome` senza un modello corrispondente viene lasciato come motivo letterale, quindi questo non rompe mai un motivo che legittimamente inizia con `#`.
- **`warn-escalation`** — dopo che viene registrato un `WARN`, se il conteggio totale degli avvisi del giocatore corrisponde a una chiave qui, l'azione configurata scatta automaticamente: `action: sanction` applica un'altra sanzione (stessi campi `type`/`reason`/`duration` di una manuale), `action: command` esegue invece un comando da console (`{player}` viene sostituito dal nome del giocatore).

### Ricorsi

```yaml
punishments:
  appeals:
    show-in-sanction-message: true
```

Mostra una riga che punta a `/solver appeal <id> <motivo>` nei messaggi di warn/mute/kick/ban, interamente in gioco — nessun webhook Discord necessario. Lo staff viene notificato immediatamente quando arriva un nuovo ricorso, allo stesso modo di una nuova segnalazione.

## Lingue Supportate

| Codice | Lingua |
|------|----------|
| `en_US` | Inglese (Stati Uniti) |
| `es_ES` | Spagnolo (Spagna) |
| `pt_BR` | Portoghese (Brasile) |
| `de_DE` | Tedesco |
| `fr_FR` | Francese |
| `ru_RU` | Russo |
| `ja_JP` | Giapponese |
| `ko_KR` | Coreano |
| `eo_EO` | Esperanto |

Ogni messaggio visibile a giocatori/staff (aiuto, errori, sanzioni, avvisi di moderazione) vive in `plugins/Solver/lang/<lingua>/messages.yml` con pieno supporto [MiniMessage](https://docs.papermc.io/adventure/minimessage/format), ed è sicuro da modificare — le tue personalizzazioni vengono conservate tra un aggiornamento e l'altro.

## Usare Provider IA Alternativi

### Google Gemini

```yaml
ai-provider:
  provider: "google"
  model: "Flash"
  google-key: "AIza..."
```

### OpenAI o Qualsiasi API Compatibile

```yaml
ai-provider:
  provider: "other"
  model: "gpt-4o"
  other-key: "sk-..."
  other-url: "https://api.openai.com/v1/chat/completions"
```

Funziona anche con modelli locali tramite **Ollama** o **LM Studio**, puntando `other-url` al loro endpoint locale.
