# Monitor Console

Il Monitor Console è un intercettore di errori in tempo reale, iniettato direttamente nel motore di logging **Log4j** del server. Cattura gli errori nell'istante in cui vengono scritti in console — prima ancora che compaiano nel file di log.

## Come Funziona

AbsoluteSolver registra un `Log4j Appender` personalizzato all'avvio. Questo appender ascolta ogni evento di log e filtra:

- Righe a livello `ERROR` o `FATAL`
- Righe a livello `WARN` con un'eccezione Java allegata (`Throwable`)

Quando viene rilevato un errore, viene aggiunto a un buffer interno. Dopo una **finestra di batch** configurabile (predefinita: 10 secondi), gli errori nel buffer vengono inviati insieme a Fyrx per l'analisi. Questo evita di sommergere l'IA con errori singoli durante un fallimento a cascata.

## Configurazione

```yaml
monitor-console: true           # Enable/disable the monitor
error-cooldown-minutes: 10      # Minimum minutes between analyses
```

## Filtraggio

Il monitor ignora intelligentemente:
- Messaggi `INFO` e `DEBUG` (vengono catturati solo gli errori)
- Errori generati da AbsoluteSolver stesso (per evitare loop di feedback)
- Errori durante la finestra di avvio iniziale (gestiti separatamente dal rilevamento errori di avvio precoce)

## Analisi in Batch

Invece di inviare ogni errore singolarmente (il che esaurirebbe rapidamente la tua quota API), il Monitor Console usa un **sistema a batch**:

1. Gli errori si accumulano in una coda (massimo 100 voci)
2. Dopo 10 secondi di inattività, gli ultimi 50 errori vengono raggruppati in un unico prompt
3. Fyrx analizza l'intero batch in una volta e identifica pattern tra più errori

Questo approccio è particolarmente efficace durante fallimenti a cascata dei plugin, dove molti plugin generano errori simultaneamente a causa di un'unica causa principale.

## Cooldown

Per proteggere dai limiti di rate dei piani API gratuiti, viene applicato un cooldown globale tra le analisi. Il predefinito è **10 minuti**. Puoi modificarlo in `config.yml`:

```yaml
error-cooldown-minutes: 10  # Set to 0 to disable (not recommended)
```

## Errori di Avvio Precoci

Un sistema separato gestisce gli errori che si verificano *prima* che AbsoluteSolver finisca di caricarsi. Vedi [Rilevamento Errori di Avvio Precoce](/it/solver/crash-analysis#rilevamento-errori-di-avvio-precoce) per i dettagli.
