# Banner Immagine 1.21.9+

A partire da Minecraft 1.21.9, la lista server multigiocatore supporta la visualizzazione di grafiche personalizzate di grandi dimensioni invece della sola icona standard del server e due righe di testo.

**SolverMOTD** supporta pienamente questa funzionalità tramite un sistema automatico di conversione da immagine a skin.

## Come Funziona

Quando fornisci un'immagine PNG `264x16`, SolverMOTD la affetterà automaticamente in 66 skin di giocatore separate. Poi le carica su [MineSkin](https://mineskin.org/) in background.

Una volta caricate, il plugin mette in cache i dati delle texture in un file `banner_cache.json`. Quando un giocatore con Minecraft 1.21.9 o successivo pinga il tuo server, il plugin costruisce dinamicamente il banner usando quelle texture delle skin.

> [!WARNING]
> Il processo di caricamento iniziale può richiedere diversi minuti a causa dei limiti di rate dell'API MineSkin. Questo avviene solo **una volta** quando abiliti per la prima volta il banner o cambi l'immagine.

## Istruzioni di Configurazione

1. Crea un'immagine PNG larga esattamente **264 pixel e alta 16 pixel**.
2. Metti l'immagine (es. `banner.png`) nella cartella `plugins/SolverMOTD/`.
3. Apri `config.yml` e abilita la funzionalità banner:

```yaml
banner:
  enabled: true
  file: "banner.png"
  # Fallback shown to players on versions older than 1.21.9.
  fallback-line1: "      &o! &lSolverMotd &o!"
  fallback-line2: "         &aCheck out our new server!"
```

4. Riavvia il tuo server o esegui `/smotd reload`.
5. Attendi che il plugin elabori e carichi i tile. Vedrai i progressi nella console del tuo server.
6. Una volta completato, il tuo server mostrerà l'enorme banner a tutti i client aggiornati!
