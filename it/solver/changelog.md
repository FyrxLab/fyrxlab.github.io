# Changelog

## v0.8.0 — L'Alternativa Completa per Moderazione e Staff

> Rilasciato: Luglio 2026

Solver diventa un'alternativa completa per moderazione/staff, non solo moderazione del chat con IA — rilevamento account alternativi, supporto MySQL, ricorsi in gioco, un sistema completo di segnalazioni staff, e uno Staff Mode Toolkit molto più profondo.

### Novità

- **Rilevamento reale degli account alternativi** — `/solver checkuser <giocatore>` incrocia lo storico IP tra tutti gli account; un ban ora espelle immediatamente un alt già online, non blocca solo i futuri login.
- **Ricorsi sulle sanzioni in gioco** — `/solver appeal <id> <motivo>`, senza bisogno di Discord; lo staff viene notificato ed esamina con `/solver appeal list|accept|reject`.
- **GUI `/solver sanctions <giocatore>`** — sfoglia lo storico di un giocatore, clicca su una sanzione attiva per il comando esatto di revoca.
- **Modelli di motivo ed escalation automatica degli avvisi** — scorciatoie tipo `#griefing` e auto-kick/tempban dopo l'N-esimo avviso di un giocatore.
- **Backend di archiviazione MySQL opzionale** per installazioni multi-server, accanto al predefinito SQLite senza configurazione.
- **Un sistema completo di Segnalazioni Staff** — `/solver report`/`reports`, con la propria GUI, interamente separato dalle sanzioni.
- **CommandSpy** — un relay in tempo reale dei comandi di altri giocatori, non solo un log retrospettivo.
- **Profili combinati di Staff Mode** — `/solver staffmode <profilo>` raggruppa vanish/immunità-al-congelamento/volo/modalità-dio/svuotamento-inventario.
- **Vanish a due livelli + invulnerabilità opzionale**, ingresso silenzioso, e un canale di chat privato per parlare con un giocatore congelato durante uno screenshare.
- **`/solver inspect`/`enderchest`** — vedi *e confisca* l'inventario/ender chest di un giocatore senza aprirlo.
- **`/solver fly`/`god`/`rtp`** per volo, invulnerabilità e teletrasporti di supervisione indipendenti.
- **Le categorie di moderazione del chat ora le definisci tu** (`tags.yml`), e `chat-moderation.action.tag-overrides` mappa qualsiasi tag direttamente a un tipo di sanzione — l'unico modo per arrivare a un ban automatico dalla moderazione del chat.

### Correzioni

- Corretto: la moderazione del chat poteva segnalare un messaggio completamente normale come tossico/spam — un messaggio già giudicato innocuo non veniva mai rimosso dal buffer di contesto, quindi riceveva un giudizio nuovo e indipendente ad ogni ciclo. Il testo già esaminato è ora solo contesto di sfondo, mai rigiudicato da zero.
- Corretto: le voci aggiunte manualmente in `reason-templates`/`warn-escalation`/`staff-mode.profiles` potevano essere cancellate silenziosamente da `config.yml` a un reload o riavvio.
- Corretto: `/solver god` non bloccava in modo affidabile il danno PvP.
- Corretto: un motivo di sanzione lungo usciva dallo schermo nella schermata di disconnessione kick/ban e nel tooltip della GUI delle sanzioni — ora va a capo in un paragrafo.
- Corretto: un `KICK` appariva come "attivo" in `/solver history`/`check` — è un'espulsione istantanea, ora mostrato come "eseguito".

## v0.7.2 — Staff Mode Toolkit e Moderazione più Intelligente

> Rilasciato: 2026

La moderazione del chat smette di fidarsi di una singola chiamata IA, i comandi dello staff diventano più veloci da digitare, e un primo pezzo del prossimo traguardo viene rilasciato come sperimentale.

### Novità

- **Staff Mode Toolkit (Sperimentale)** — `/solver vanish`, `/solver freeze <giocatore>`, e `/solver staffchat`, tutti disponibili anche come comandi indipendenti (`/vanish`, `/freeze`, `/staffchat`).
- **Permessi granulari, compatibili con LuckPerms** — ogni sottocomando di `/solver` ha ora il proprio nodo di permesso, raggruppati sotto `solver.diagnostics.*`, `solver.sanctions.*`, e `solver.staffmode.*`. `solver.admin` continua a concedere tutto.
- **Comandi indipendenti** — `/vanish`, `/mute`, `/ban`, `/moderation`, e altri ora funzionano direttamente senza il prefisso `/solver`. Disattiva un'intera categoria in `config.yml` se un altro plugin usa già uno di quei nomi.
- **Corroborazione multi-segnale per la moderazione del chat** — una sanzione automatica ora richiede che il verdetto dell'IA sia sia abbastanza confidente sia abbastanza severo, *oppure* supportato da un segnale locale indipendente. Altrimenti resta un avviso solo per lo staff.
- **4 livelli configurabili di `llm-analysis-level`** — da `0` (mai chiamare l'IA, solo filtro locale) a `3` (tempo reale, ogni messaggio).

### Correzioni

- Corretto: riconnettersi mentre congelati usava un teletrasporto sincrono che il modello di threading regionale di Folia rifiuta — passato all'API di teletrasporto asincrona.
- Corretto: al report dell'incidente di moderazione salvato mancava il valore di confidenza dell'IA.
- Corretto: la moderazione del chat sanzionava di nuovo lo stesso messaggio già giudicato durante una scansione bulk molto attiva.
- Corretto: lo stato di mute viveva solo in memoria — un riavvio non revoca più silenziosamente un mute attivo in anticipo; ora viene ripristinato da `sanctions.db` al login, come già avveniva per i ban.
- Ripuliti i commenti di `config.yml` che avevano lasciato trapelare linguaggio di sviluppo interno.

## v0.7.1 — Patch di Correzione Bug

> Rilasciato: 2026

Nessuna nuova funzionalità — cinque bug reali trovati tramite un audit del codice subito dopo il rilascio della 0.7.0, tutti corretti qui.

- Corretto: `config.yml` perdeva i suoi commenti esplicativi a ogni riavvio, anche quando non c'era nulla da aggiornare.
- Corretto: `/solver tempmute` con una durata inferiore a un minuto (es. `30s`) non faceva nulla silenziosamente.
- Corretto: un bug di rate-limit che poteva far bloccare brevemente a vicenda le funzionalità basate su IA quando condividevano la stessa chiave API.
- Corretto: alcune chiamate interne all'API Bukkit nella moderazione del chat e nei comandi di sanzioni avvenivano fuori dal thread corretto — rafforzato per la sicurezza su Folia, e i comandi di sanzioni non si bloccano più per l'I/O del database.

## v0.7.0 — Sanzioni, Messaggi Personalizzati e Moderazione più Intelligente

> Rilasciato: 2026

Un vero sistema warn/mute/kick/ban, ogni messaggio visibile al giocatore ora personalizzabile, e i verdetti di moderazione di Fyrx arrivano con un punteggio di confidenza invece di un semplice sì/no.

### Novità

- **Nuovo `messages.yml`** — ogni messaggio visibile a giocatori/staff è ora configurabile con pieno supporto MiniMessage, nella tua cartella di lingua (`lang/<lingua>/messages.yml`).
- **Nuovo Sistema di Sanzioni (BETA)** — `/solver warn|mute|tempmute|kick|ban|tempban <giocatore> [durata] <motivo>`, oltre a `unban|unmute|unwarn`, `history <giocatore>`, `check <id>`, e `note <giocatore> <testo>`. Ogni sanzione riceve un ID reale e persiste in `sanctions.db`.
- **I ban ora vengono applicati davvero** — riconnettersi mentre si è bannati viene rifiutato al login, non solo con un'espulsione una tantum.
- **I mute funzionano sempre** — anche con la moderazione del chat IA disattivata, `/solver mute` blocca davvero il chat.
- **Misuratore di Confidenza** — ogni verdetto di moderazione mostra quanto Fyrx è *sicuro* (0-100%), separatamente dalla severità. Visibile negli avvisi allo staff e in `/solver moderation test`/`status`.
- **`/solver moderation status` mostra un conto alla rovescia** per la prossima scansione automatica del chat.
- **Supporto PlaceholderAPI (BETA)** — `%solver_muted%`, `%solver_warns%`, `%solver_active_sanctions%`, e altri.
- **`config.yml`/`messages.yml` non diventano più obsoleti con gli aggiornamenti** — le nuove opzioni vengono unite automaticamente.
- **Moderazione del Chat con IA, fuori dalla beta** — staff/amministratori possono essere esentati, localizzazione completa in tutte le 9 lingue, e verdetti per categoria e per trasgressore invece di una singola parola indovinata.
- **`/solver crashme dry-run`** — esegue l'intera pipeline di diagnosi dei crash con un report sintetico, senza una vera eccezione/blocco/OOM.

### Compatibilità

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

## v0.5.0 — Rilascio Iniziale

> Rilasciato: Luglio 2026

Questa è la prima release pubblica stabile di **AbsoluteSolver**. Introduce **Fyrx**, il tuo amministratore di server basato su IA.

### Nuove Funzionalità

- **Integrazione IA Gemini** — Pienamente integrato con il modello `gemini-3-flash-preview` di Google.
- **Monitor Console in Tempo Reale** — Si inietta direttamente in Log4j per intercettare le eccezioni `ERROR` e `WARN` in tempo reale.
- **Analisi dei Crash Post-Mortem** — Scansiona automaticamente `crash-reports/` all'avvio.
- **Supporto Crash Nativi JVM** — Rileva e analizza i file di crash fatale della JVM `hs_err_pid.log`.
- **Rilevamento Errori di Avvio Precoce** — Legge `logs/latest.log` all'avvio per catturare errori di dipendenza pre-caricamento.
- **Monitor dei Tick** — Thread leggero in background che rileva blocchi e deadlock del server.
- **Supporto Folia** — Il plugin rileva automaticamente Folia e disabilita il TickMonitor con garbo.
- **Interfaccia Console Elegante** — Banner ASCII di avvio e risposte IA formattate usando i codici colore di Minecraft.
- **Supporto Multi-Provider** — Compatibile con Google Gemini, Anthropic Claude e qualsiasi API compatibile con OpenAI.
- **Strumenti Diagnostici** — `/absolutesolver crashme <exception|deadlock|oom>` per test sicuri.
- **100% Asincrono** — Zero impatto sui TPS del server.

### Compatibilità

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

---

*Fatto con ❤️ da FyrxLab*
