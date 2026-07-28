# Monitor dei Tick

Il Monitor dei Tick è un leggero thread in background che sorveglia costantemente lo stato di salute del **thread principale** del tuo server. Se il server si blocca, entra in deadlock o subisce un grave picco di lag, Fyrx lo rileverà automaticamente, catturerà lo stato del thread e genererà un report diagnostico.

## Come Funziona

Il Monitor dei Tick opera usando due componenti:

**1. Heartbeat Task (Thread Principale)**
Un task Bukkit sincrono viene eseguito una volta per tick (20 volte al secondo) sul thread principale del server. Ogni volta che viene eseguito, aggiorna un timestamp `lastTickTime`.

**2. Thread Watchdog (Background)**
Un thread Java separato controlla `lastTickTime` ogni secondo. Se il timestamp non viene aggiornato per più di **15 secondi**, conclude che il thread principale è bloccato.

## Rilevamento dei Blocchi

Quando viene rilevato un blocco:

1. Il monitor cattura lo **StackTrace completo** del thread principale (fino a 30 frame)
2. Cattura lo **stato del thread** (BLOCKED, WAITING, ecc.)
3. Questi dati vengono inviati a Fyrx in modo asincrono
4. Fyrx identifica quale plugin, gestore di eventi o codice sta bloccando il thread principale

**Esempio di output di Fyrx su un deadlock:**

```
╔══════════════════════════════════════════════════════════╗
║       FREEZE DIAGNOSTIC — FYRX                          ║
╚══════════════════════════════════════════════════════════╝

### Root Cause
The main thread is TIMED_WAITING inside CommandManager.onCommand()
at net.example.myplugin.CommandManager.java:52

### Analysis
The plugin is calling Thread.sleep(20000) directly on the main server
thread. This is a critical programming error — Thread.sleep() blocks
the entire server for the specified duration.

### Recommended Action
Contact the plugin author. The sleep() call must be moved to an
asynchronous thread using Bukkit.getScheduler().runTaskAsynchronously()
════════════════════════════════════════════════════════════
```

## Compatibilità con Folia

::: warning Folia
Il Monitor dei Tick viene **disabilitato automaticamente** sui server Folia. Folia usa un'architettura regionale multithread dove non esiste un singolo "thread principale", rendendo impossibile il monitoraggio dei TPS con questo metodo. Folia ha il proprio Watchdog regionale integrato che gestisce il rilevamento dei blocchi.

Quando AbsoluteSolver rileva Folia, vedrai questo messaggio:
```
[AbsoluteSolver] Servidor Folia detectado: TickMonitor deshabilitado.
```
:::

## Soglia di Blocco

La soglia di blocco predefinita è **15 secondi**. È intenzionalmente più alta del Watchdog predefinito di Paper (10 secondi) per evitare falsi positivi durante salvataggi del mondo pesanti o burst di generazione dei chunk.

## Test

Puoi testare il Monitor dei Tick in sicurezza usando il comando di test crash integrato (solo OP):

```
/absolutesolver crashme deadlock
```

Questo comando chiama `Thread.sleep(20000)` sul thread principale, simulando un blocco di 20 secondi. Fyrx lo rileverà dopo 15 secondi e genererà un report diagnostico.

::: danger Attenzione
Il test crash `deadlock` renderà il tuo server non responsivo per 20 secondi. Anche il Watchdog di Paper/Purpur si attiverà e stamperà un thread dump. Questo è un comportamento previsto.
:::
