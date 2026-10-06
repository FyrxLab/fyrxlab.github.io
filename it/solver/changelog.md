# Changelog

## v0.10.1 — Fa Esattamente Ciò che Promette

> Pubblicato: ottobre 2026

### Novità

- **`/solver ban` e `/solver mute` accettano una durata facoltativa** — `/solver ban <giocatore> 7d <motivo>` ora è un ban di 7 giorni (registrato come `TEMPBAN`), e `/solver mute <giocatore> 10m <motivo>` un mute di 10 minuti. Senza durata restano permanenti, come prima. Finora la durata finiva silenziosamente nel motivo di una sanzione permanente.
- **Modelli di IA locali senza API key** — il provider `other` non richiede più `other-key`. Punta `other-url` a Ollama, LM Studio o qualsiasi endpoint compatibile con OpenAI (per esempio `http://localhost:11434/v1/chat/completions`) e lascia la key vuota; Solver non invia alcun header `Authorization`.
- **AntiVPN riconosce più provider VPN** — il controllo `bad-asn-list` ora include anche le reti delle aziende VPN il cui nome di rete non contiene "VPN": Proton AG, Surfshark, CyberGhost, Windscribe, Private Internet Access, TorGuard, Hide.me e le reti proprie di NordVPN (PacketHub, Tefincom). Da 21 a 34 reti VPN note. L'hosting generico che anche le VPN noleggiano (per esempio Datacamp/CDN77, M247) resta escluso di proposito, per non segnalare giocatori legittimi.

### Correzioni

- Gli avvisi in gioco per gli errori rilevati dal [Monitor Console](/it/solver/console-monitor) ora mostrano la causa reale (per esempio `NullPointerException: Cannot invoke ...`) invece di "check the console for the full detail".

## v0.10.0 — AntiVPN, un Solo Jar per i Proxy, e Alias dei Comandi

> Pubblicato: ottobre 2026

La 0.9.2 non è mai stata pubblicata da sola — tutto ciò che conteneva esce qui, insieme ad AntiVPN.

### Novità

- **AntiVPN** — i giocatori che si connettono vengono controllati contro reti VPN e proxy note, senza bisogno di una tua API key: una lista statica di range VPN noti (confrontata in memoria, nessuna chiamata di rete in un login normale), una ricerca in tempo reale solo per gli indirizzi non coperti dalla lista, e un confronto con le reti note dei provider VPN che intercetta un range nuovo prima di qualsiasi lista. Facoltativamente, una key gratuita di ipapi.is aggiunge un ulteriore livello. Vedi [AntiVPN](/it/solver/antivpn).
- **Motore di ragionamento spiegabile** — i rilevamenti si combinano in un punteggio da 0 a 100, e ogni verdetto mostra quanto ha contribuito ogni segnale. Deterministico, nessuna IA. Scegli un profilo (`conservative`, `balanced`, `strict`) invece di regolare numeri grezzi.
- **Finestra di calibrazione** — AntiVPN non applica nulla finché non ha visto abbastanza rilevamenti reali sul tuo server, qualunque sia la modalità d'azione configurata.
- **FoxGate ha sempre l'ultima parola** — con [FoxGate](https://modrinth.com/plugin/foxgate) installato, Solver non espelle né banna mai per motivi di VPN. `antivpn.foxgate-mode` sceglie solo come Solver si fa da parte: `addon` (predefinito, continua ad avvisare) o `off`.
- **Un solo jar per backend e proxy** — installa lo stesso `Solver.jar` su BungeeCord, Waterfall o Velocity per inoltrare staffchat e avvisi di moderazione/integrità/VPN su tutti i backend. Vedi [Relay Proxy](/it/solver/proxy-relay). Disattivato di default (`proxy-relay.enabled`).
- **Alias dei comandi** — `/invsee` (`inspect`), `/v` (`vanish`), `/sc` (`staffchat`), `/cspy` (`commandspy`), `/tm` (`tempmute`), `/tb` (`tempban`), `/cu` (`checkuser`), `/hist` (`history`), sia senza prefisso sia come `/solver <alias>`.
- **Statistiche d'uso anonime** tramite [bStats](https://bstats.org/plugin/bukkit/Solver/33362) — numero di server e funzioni attive, nulla di identificabile per giocatore. Si controlla con `metrics.enabled`.
- **La verifica della build ora usa Modrinth** — Solver confronta il proprio jar con i file ufficiali pubblicati su [Modrinth](https://modrinth.com/plugin/solver). Un jar che non è lì (per esempio una build di sviluppo) viene solo segnalato, mai marcato.

### Correzioni

- **I comandi senza prefisso (`/vanish`, `/inspect`, ecc.) ora funzionano davvero** — risultavano attivi all'avvio ma non venivano mai registrati.
- **Java 8–14:** la scansione malware richiede firme Ed25519, disponibili solo da Java 15. Su Java più vecchi mostrava un falso errore di "firma non valida / possibile CDN compromesso" a ogni avvio; ora viene saltata con un avviso chiaro.
- Su un server in una lingua diversa dall'inglese, un messaggio aggiunto da un aggiornamento recente appariva come `[missing some.key]` — ora ricade sul testo inglese.
- `/solver integrity` mancava dal completamento automatico.

### Modifiche

- L'output della console ora è in **inglese di default**, indipendentemente dalla lingua configurata per i giocatori.

### Privacy

Le due ricerche in tempo reale di AntiVPN inviano l'IP del giocatore che si connette a un servizio esterno (IPQuery.io e ipapi.is), solo per indirizzi che le liste statiche e la cache locale non hanno già risolto. Le liste statiche non inviano mai nulla. Ogni fonte si può disattivare singolarmente, o AntiVPN per intero con `antivpn.own_engine.enabled`.

### Compatibilità

- Paper, Purpur, Spigot, CraftBukkit, Folia; BungeeCord, Waterfall, Velocity (solo relay)
- Minecraft 1.8.8 — 1.21.x e 26.1 — 26.3
- Java 8+ (la scansione malware richiede Java 15+)

## v0.9.1 — Supporto Spigot/CraftBukkit, fino a 1.8.8

> Rilasciato: 2026

Solver ora gira su Spigot/CraftBukkit puro, non solo su Paper/Folia — fino alla 1.8.8. Ogni funzionalità si comporta allo stesso modo ovunque, con un fallback appropriato dove un'API esclusiva di Paper non esiste.

### Novità

- **Supporto Spigot/CraftBukkit, dalla 1.8.8 in su** — Solver non richiede più Paper. Moderazione chat, sanzioni, lo Staff Mode Toolkit e ogni GUI funzionano allo stesso modo su Spigot puro.
- **Requisito Java più basso: Java 8 o superiore** (prima Java 17).

### Correzioni

- Corretto: lo storage delle sanzioni (SQLite) poteva occasionalmente non inizializzarsi su alcune configurazioni server, per un problema di registrazione del driver specifico di come Bukkit carica i jar dei plugin.

### Compatibilità

- Paper, Purpur, Spigot, CraftBukkit, Folia
- Minecraft 1.8.8 — 1.21.x (il supporto 1.7.10 è pianificato ma non ancora disponibile)
- Java 8+

## v0.9.0 — Backend FyrxLab, parte 1: Verifica Integrità Build e Scansione Malware

> Rilasciato: Luglio 2026

Solver ora può verificare il proprio jar e scansionare plugin con malware conosciuto. Entrambi statici, firmati e in cache — ancora nessun backend dinamico coinvolto.

### Novità

- **Verifica dell'integrità del build** — Solver controlla il proprio jar contro un hash firmato pubblicato da FyrxLab. Controlla in qualsiasi momento con `/solver integrity`, o forza un controllo immediato con `/solver integrity rescan`.
- **Scansione malware** — ogni altro `.jar` in `plugins/` viene controllato contro una lista firmata di hash di malware conosciuti.
- **Verifica incrociata opzionale con Modrinth** per i plugin non segnalati — puramente informativa, mai un allarme da sola.
- **Rilevamento Java agent** — avvisa all'avvio se un Java agent è stato collegato alla JVM del server, dato che un agent può modificare le classi in memoria senza mai toccare il file jar su disco.

### Correzioni

- `/solver rtp` poteva occasionalmente teletrasportare chi eseguiva il comando su se stesso invece che su un altro giocatore.

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
