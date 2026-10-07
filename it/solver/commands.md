# Comandi

AbsoluteSolver fornisce un unico comando radice con sottocomandi raggruppati in quattro aree: diagnostica, il Sistema di Sanzioni, il Sistema di Segnalazioni Staff e lo Staff Mode Toolkit.

## `/solver`

**Alias:** `/as`
**Permesso:** `solver.admin` (predefinito: OP) concede tutto quanto sotto; vedi [Permessi](#permessi) per i nodi granulari.

La maggior parte dei sottocomandi è disponibile anche come comando indipendente (es. `/vanish` invece di `/solver vanish`) — vedi [Comandi Indipendenti](#comandi-indipendenti).

---

### Diagnostica

| Sottocomando | Descrizione | Permesso |
|------------|-------------|---------|
| `help` | Mostra l'elenco dei comandi in gioco. | — |
| `reload` | Ricarica `config.yml` e riavvia l'IA senza riavviare il server. | `solver.diagnostics.reload` |
| `analyze-last` | Rianalizza manualmente il crash report più recente in `crash-reports/`. | `solver.diagnostics.analyzelast` |
| `crashme <exception\|deadlock\|oom>` | Attiva un crash di test **reale** del tipo indicato. | `solver.diagnostics.crashme` |
| `crashme dry-run` | Invia un crash report sintetico a Fyrx per la diagnosi senza influire realmente sul server. | `solver.diagnostics.crashme` |
| `moderation status` | Mostra lo stato della moderazione del chat: dimensione del buffer, giocatori tracciati, ultimo verdetto, confidenza media, conto alla rovescia per la prossima scansione. | `solver.diagnostics.moderation` |
| `moderation test <messaggio>` | Simula un'analisi di moderazione su un messaggio arbitrario. | `solver.diagnostics.moderation` |
| `integrity [rescan]` | Mostra lo stato della verifica della build e della scansione malware; `rescan` forza un controllo immediato. | `solver.diagnostics.integrity` |

### AntiVPN

Vedi [AntiVPN](/it/solver/antivpn) per come funziona il rilevamento.

| Sottocomando | Descrizione | Permesso |
|--------------|-------------|----------|
| `vpn status` | Fonti attive, età delle liste, verdetti in cache e avanzamento della calibrazione. | `solver.vpn.check` |
| `vpn check <giocatore\|ip>` | Controlla un indirizzo e mostra il dettaglio del punteggio. Non conta per la calibrazione. | `solver.vpn.check` |
| `vpn whitelist add\|remove\|list <ip\|cidr>` | Indirizzi che saltano ogni controllo. Effetto immediato. | `solver.vpn.whitelist` |
| `vpn clearcache` | Svuota la cache dei verdetti e riscarica le liste. | `solver.vpn.clearcache` |

### Sistema di Sanzioni

| Sottocomando | Descrizione | Permesso |
|------------|-------------|---------|
| `warn \| mute \| tempmute \| kick \| ban \| tempban <giocatore> [durata] <motivo>` | Applica la sanzione corrispondente. `durata` è obbligatoria per le varianti temp- (es. `30s`, `10m`, `1d`) e facoltativa per `ban`/`mute`, che diventano così `tempban`/`tempmute`. Il motivo può anche essere `#nome`, che si espande in un [modello di motivo](/it/solver/configuration#modelli-di-motivo-ed-escalation-degli-avvisi) configurato in `config.yml`. | `solver.sanctions.<tipo>` |
| `unban \| unmute \| unwarn <giocatore>` | Revoca una sanzione attiva di quel tipo. | `solver.sanctions.<tipo>` |
| `history <giocatore>` | Mostra lo storico completo delle sanzioni di un giocatore. | `solver.sanctions.history` |
| `check <id>` | Mostra il dettaglio di una sanzione tramite il suo ID. | `solver.sanctions.check` |
| `note <giocatore> <testo>` | Salva una nota interna su un giocatore — mai mostrata a lui. | `solver.sanctions.note` |
| `checkuser <giocatore>` | Incrocia lo storico IP: mostra ogni account alternativo conosciuto di un giocatore e qualsiasi sanzione attiva legata a tutta quella rete, non solo al nome esatto dell'account. | `solver.sanctions.checkuser` |
| `appeal <id> <motivo>` | Permette a un **giocatore sanzionato** di fare ricorso sulla propria sanzione direttamente in gioco. Aperto a tutti di default. | `solver.sanctions.appeal` (predefinito: **true**) |
| `appeal list \| accept \| reject <id>` | Lo staff esamina i ricorsi in sospeso; `accept` revoca la sanzione, `reject` la lascia invariata. | `solver.sanctions.appeal.manage` |
| `sanctions <giocatore>` | Apre una GUI che sfoglia lo storico completo delle sanzioni di un giocatore; clicca su una attiva per il comando esatto per revocarla. | `solver.sanctions.gui` |

Ogni sanzione riceve un ID reale, persiste in `sanctions.db` (o in un database MySQL — vedi [Configurazione](/it/solver/configuration#archiviazione-delle-sanzioni)), e viene applicata anche se il server si riavvia. I ban rifiutano il login direttamente ed espellono immediatamente qualsiasi altro account online che abbia mai condiviso un IP con quello bannato; i mute e le durate attive vengono ripristinati al login.

### Segnalazioni Staff

Novità della 0.8.0. Permette a qualsiasi giocatore di segnalare qualcosa all'attenzione dello staff, completamente separato dal Sistema di Sanzioni — una segnalazione non è una punizione.

| Sottocomando | Descrizione | Permesso |
|------------|-------------|---------|
| `report <giocatore> <motivo>` | Presenta una segnalazione contro un giocatore, catturando la tua posizione attuale come contesto. Aperto a tutti di default. | `solver.report` (predefinito: **true**) |
| `reports` | Elenca tutte le segnalazioni aperte. | `solver.reports.manage` |
| `reports claim \| close \| reopen <id> [motivo]` | Gestisce la coda. Chi ha segnalato riceve un messaggio diretto in gioco quando la sua segnalazione viene presa in carico o chiusa. | `solver.reports.manage` |
| `reports gui` | Apre una GUI delle segnalazioni aperte — click sinistro prende in carico, click destro chiude. | `solver.reports.gui` |

### Staff Mode Toolkit

| Sottocomando | Descrizione | Permesso |
|------------|-------------|---------|
| `vanish [strict]` | Alterna la tua modalità vanish. `strict` è un secondo livello, invisibile anche alla maggior parte dello staff, che richiede un permesso separato per vederci attraverso. Nascosto agli altri giocatori, sottratto dal conteggio della lista server, i mob smettono di puntarti, e il tuo nome non trapela più tramite l'autocompletamento. | `solver.staffmode.vanish` (`.vanish.see-strict` per vedere attraverso lo strict) |
| `freeze <giocatore>` | Alterna il congelamento di un giocatore: blocca il suo movimento, la maggior parte dei comandi, e il combattimento. Il comando per alternare il congelamento funziona sempre su un giocatore già congelato, anche senza un altro staff online per scongelarlo. | `solver.staffmode.freeze` |
| `freeze <giocatore> <messaggio>` | Invia un messaggio nel canale di chat privato di congelamento di quel giocatore invece di alternare — ti permette di parlare davvero con qualcuno durante uno screenshare invece di limitarti a zittirlo. | `solver.staffmode.freeze` |
| `staffchat [messaggio]` | Senza messaggio, alterna una modalità in cui tutto ciò che scrivi va solo allo staff. Con un messaggio, invia un messaggio una tantum solo per lo staff senza alternare la modalità. | `solver.staffmode.staffchat` |
| `commandspy` | Alterna un relay **in tempo reale** di ogni comando eseguito da altri giocatori direttamente nella tua chat — non solo un registro retrospettivo. | `solver.staffmode.commandspy` |
| `staffmode <profilo>` | Alterna un profilo combinato con nome che definisci in `config.yml` (vanish + immunità al congelamento + volo + modalità dio + svuotamento inventario). Il tuo inventario viene sempre salvato e ripristinato automaticamente. | `solver.staffmode.profiles` |
| `fly` | Alterna il volo, indipendente da qualsiasi profilo. | `solver.staffmode.fly` |
| `god` | Alterna l'invulnerabilità, incluso il danno PvP. | `solver.staffmode.god` |
| `rtp` | Ti teletrasporta a un giocatore non-staff casuale online, per giri di supervisione. | `solver.staffmode.rtp` |
| `inspect <giocatore>` | Apre una vista dell'inventario principale, armatura e mano secondaria di un giocatore senza aprirlo fisicamente. Clicca su un oggetto per confiscarlo direttamente dal suo inventario reale. | `solver.staffmode.inspect` |
| `enderchest <giocatore>` | Lo stesso trattamento di visualizzazione/confisca per l'ender chest di un giocatore — rimane un comando a sé perché una finestra di inventario Bukkit ha un tetto di 54 slot, e la vista di `inspect` ne usa già 41. | `solver.staffmode.enderchest` |

Un giocatore con `solver.staffmode.silentjoin` si connette già in vanish, senza alcun messaggio di ingresso.

---

## Comandi Indipendenti

I gruppi di comandi Sanzioni, Staff Mode, Segnalazioni e Moderazione si registrano anche direttamente, senza il prefisso `/solver` — `/solver <comando>` continua comunque a funzionare esattamente come prima:

- **Staff Mode:** `/vanish`, `/freeze`, `/staffchat`, `/commandspy`, `/staffmode`, `/fly`, `/god`, `/inspect`, `/enderchest` (disattivato automaticamente se EssentialsX è installato — il suo `/enderchest` significa "mostra il mio", un significato diverso dal nostro)
- **Sanzioni:** `/warn`, `/mute`, `/tempmute`, `/kick`, `/ban`, `/tempban`, `/unban`, `/unmute`, `/unwarn`, `/history`, `/check`, `/note`, `/checkuser`, `/appeal`, `/sanctions`
- **Moderazione:** `/moderation`
- **Segnalazioni:** `/report`

`rtp` non ha una forma indipendente di proposito — quel nome nudo è già un comando molto comune di "teletrasporto casuale entro il confine del mondo" nel resto dell'ecosistema dei plugin, e significa qualcosa di diverso dal nostro.

Ogni categoria può essere disattivata indipendentemente in `config.yml` se un altro plugin installato usa già uno di quei nomi:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (a meno che EssentialsX non sia installato)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## Esempi d'Uso

**Attivare un'analisi manuale del crash:**
```
/solver analyze-last
```

**Testare la diagnosi senza un crash reale:**
```
/solver crashme dry-run
```

**Avvisare, poi silenziare temporaneamente, un giocatore:**
```
/solver warn Steve Spam in chat
/solver tempmute Steve 10m Spam continuo dopo l'avviso
```

**Controllare lo storico sanzioni di un giocatore:**
```
/solver history Steve
```

**Cercare account alternativi prima di decidere se bannare:**
```
/solver checkuser Steve
```

**Fare ricorso sulla propria sanzione:**
```
/solver appeal 42 Mi stavo difendendo
```

**Segnalare un giocatore allo staff:**
```
/solver report Steve Sta facendo griefing sulla mia base
```

**Alternare il proprio vanish (o la forma indipendente):**
```
/solver vanish
/vanish
```

::: warning I Test di Crash Sono Pericolosi
I sottocomandi `crashme exception|deadlock|oom` sono pensati **esclusivamente per test** in un ambiente di sviluppo. **Non** eseguire `crashme oom` su un server di produzione — causerà un vero OutOfMemoryError. Usa `crashme dry-run` se vuoi solo vedere l'output diagnostico di Fyrx in sicurezza.
:::

---

## Permessi

I permessi sono raggruppati così puoi concedere un'intera categoria in una volta (es. tramite LuckPerms) senza dare accesso amministrativo completo.

| Permesso | Predefinito | Descrizione |
|------------|---------|-------------|
| `solver.admin` | OP | Accesso completo a tutto quanto sotto. |
| `solver.notify` | OP | Ricevi notifiche in gioco per errori e avvisi di moderazione del chat. |
| `solver.moderation.bypass` | false | Esenta questo specifico giocatore dalla moderazione del chat, OP o no. |
| `solver.diagnostics.*` | false | Tutti i comandi di diagnostica (`reload`/`analyze-last`/`crashme`/`moderation`). |
| `solver.sanctions.*` | false | Tutti i comandi di sanzioni, incluso `checkuser`, `appeal.manage` e la GUI `sanctions`. |
| `solver.staffmode.*` | false | Tutti i comandi dello Staff Mode Toolkit. |
| `solver.vpn.*` | false | Tutti i comandi AntiVPN (`vpn status`/`check`/`whitelist`/`clearcache`). |
| `solver.reports.*` | false | Tutti i comandi di segnalazione. |
| `solver.report` | **true** | Presentare una segnalazione (`/solver report`). Aperto a tutti di default. |
| `solver.sanctions.appeal` | **true** | Fare ricorso sulla propria sanzione (`/solver appeal <id> <motivo>`). Aperto a tutti di default. |

Ogni sottocomando ha anche il proprio permesso individuale (es. `solver.sanctions.warn`, `solver.staffmode.vanish`, `solver.staffmode.commandspy`, `solver.staffmode.inspect`, `solver.staffmode.enderchest`, `solver.staffmode.vanish.see-strict`, `solver.reports.manage`, `solver.reports.gui`) se ti serve un controllo più fine dei gruppi con jolly sopra.

Puoi concedere questi permessi usando qualsiasi plugin di permessi (es. LuckPerms):

```
/lp user <giocatore> permission set solver.sanctions.* true
```
