# Per Iniziare

**SolverMOTD** è un plugin MOTD leggero e multipiattaforma. Poiché è compilato in modo universale, lo stesso identico file `.jar` può essere inserito nella cartella `plugins/` di qualsiasi server Bukkit, Spigot, BungeeCord o Velocity!

## Installazione
1. Scarica l'ultimo `SolverMOTD.jar` da Modrinth.
2. Metti il `.jar` nella cartella `plugins/` del tuo server.
3. Riavvia il server.

## Configurazione
Una volta avviato il server, verrà generato un `config.yml` nella cartella `plugins/SolverMOTD/`.

Puoi modificare il testo del tuo MOTD nella sezione `motd:`:

```yaml
motd:
  line1: "      <white><obf>!</obf> <bold><yellow>Solver</yellow><red>Motd</red> <aqua>Plugin</aqua></bold>"
  line2: "         <green>Setup your <yellow>Config.yml</yellow> file!</green>"
```

### Formattazione
Consigliamo vivamente di usare il formato **MiniMessage** (es. `<red>Testo</red>`) invece dei codici legacy con la e commerciale (`&cTesto`). MiniMessage è molto più robusto per i client moderni e supporta gradienti e colori esadecimali senza sforzo.

> [!NOTE]
> Se hai **PlaceholderAPI** installato sul tuo server, SolverMOTD analizzerà automaticamente i placeholder nel tuo MOTD!

## Ricaricamento
Dopo aver modificato la tua configurazione, non è necessario riavviare il server. Esegui semplicemente il comando `/smotd reload` per applicare istantaneamente il tuo nuovo MOTD!
