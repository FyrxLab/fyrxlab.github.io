# Analisi dei Crash

AbsoluteSolver offre tre sistemi distinti di analisi dei crash che lavorano insieme per garantire che, qualunque sia il modo in cui il tuo server è morto, Fyrx sarà lì a spiegarlo.

## Analisi Post-Mortem (Scansione all'Avvio)

Quando il tuo server si avvia, AbsoluteSolver cerca nuovi crash report che non erano presenti nella sessione precedente.

**Come funziona:**
1. Su `onEnable`, il plugin scansiona la cartella `crash-reports/`
2. Confronta l'elenco dei file con un registro `data.yml` dei report già analizzati
3. Se viene trovato un **nuovo** report, lo legge e lo invia a Fyrx insieme alle ultime 100 righe di `latest.log`
4. L'analisi di Fyrx viene stampata in console prima che il server finisca di avviarsi

**Tipi di crash report supportati:**

| Tipo | Sorgente | Descrizione |
|------|--------|-------------|
| Crash Report Minecraft | `crash-reports/*.txt` | Dump di crash standard di Minecraft/Paper |
| Crash Nativo JVM | `hs_err_pid*.log` | Errori fatali della JVM (SIGSEGV, fallimenti JNI, corruzione della memoria) |

::: info Crash Nativi della JVM
Un file `hs_err_pid` viene generato quando è Java stesso a crashare — non solo Minecraft. Questi crash sono tipicamente causati da una libreria nativa danneggiata (come un driver GPU), corruzione della memoria, o una chiamata JNI errata da parte di una mod. Fyrx analizza le prime 200 righe, che contengono le informazioni più critiche.
:::

## Rilevamento Errori di Avvio Precoce

Questo sistema cattura gli errori che si verificano *dopo* l'avvio della JVM ma *prima* che venga eseguito l'`onEnable` di AbsoluteSolver. Questi errori sono comunemente causati da:

- Incompatibilità di versione dei plugin
- Dipendenze mancanti
- Conflitti di caricamento delle classi (due plugin che usano versioni diverse della stessa libreria)

**Come funziona:**
1. AbsoluteSolver legge `logs/latest.log` in modo asincrono all'avvio
2. Scansiona le righe contenenti `ERROR]:` o `WARN]:` fino alla riga `[AbsoluteSolver] Enabling`
3. Se vengono trovati errori, vengono inviati a Fyrx per l'analisi
4. L'analisi completa viene stampata immediatamente in console

**Esempio di cosa viene catturato:**

```
[ServerMain/ERROR]: Could not load 'plugins/MyPlugin.jar' in folder 'plugins'
org.bukkit.plugin.InvalidPluginException: Unsupported API version 1.21
```

## Analisi Manuale

Puoi attivare in qualsiasi momento un'analisi manuale del crash report più recente:

```
/absolutesolver analyze-last
```

Utile se AbsoluteSolver non ha catturato automaticamente il crash (ad esempio, il plugin non era caricato durante la sessione del crash).

## Configurazione

```yaml
check-crash-on-startup: true    # Enable post-mortem scanning on boot
monitor-console: true           # Enable early startup error detection
```
