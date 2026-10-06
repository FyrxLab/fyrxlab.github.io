# Relay Proxy

::: tip Aggiornato nella 0.10.0 — un solo jar per tutto
Solver gira sui server della famiglia Bukkit. Su un proxy, lo stesso jar esegue solo un piccolo relay: un proxy non ha mondi, inventari o giocatori con stato di gioco, quindi sanzioni, vanish e GUI restano sui backend.
:::

Se gestisci una rete BungeeCord, Waterfall o Velocity con più di un backend con Solver, il relay fa arrivare i messaggi di staffchat e gli avvisi di moderazione/integrità/VPN allo staff connesso a *qualsiasi* backend, non solo a quello in cui sono nati.

## Cosa viene inoltrato

- Messaggi di `/solver staffchat` (e la modalità staffchat attiva)
- Avvisi di moderazione della chat (IA Fyrx)
- Avvisi di integrità — jar non corrispondente, malware rilevato, Java agent rilevato
- Avvisi di [AntiVPN](/it/solver/antivpn)

Lo staff del server in cui è nato il messaggio lo vede già localmente, quindi il relay non gli invia una seconda copia. Un avviso generato mentre un backend non ha nessuno online (tipico di AntiVPN, che scatta prima che il giocatore entri) viene trattenuto e consegnato appena qualcuno entra in quel backend.

## Configurazione

### 1. Attiva il relay su ogni backend

Nel `plugins/Solver/config.yml` di ogni backend:

```yaml
proxy-relay:
  enabled: true
```

Disattivato di default — un relay su tutta la rete è un vero cambio di comportamento, quindi è opzionale.

### 2. Installa lo stesso jar sul proxy

Metti **lo stesso `Solver.jar`** dei tuoi backend nella cartella `plugins/` del proxy e riavvia il proxy — non esiste un plugin proxy separato. BungeeCord/Waterfall leggono il suo `bungee.yml` e Velocity il suo `velocity-plugin.json`; nessuno dei due carica codice Bukkit. Nessun file di configurazione proprio.

### 3. Verifica che sia attivo

All'avvio del proxy, la console stampa una riga:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Chi riceve i messaggi

Il relay raggiunge solo i giocatori con `solver.notify` (avvisi) o `solver.staffmode.staffchat` (staffchat) — gli stessi permessi usati localmente su ogni backend. Come il proxy li verifica dipende da cosa è installato:

- **LuckPerms installato sul proxy** — usato direttamente. Se il tuo LuckPerms condivide lo storage su tutta la rete, corrisponde già a ciò che concede ogni backend.
- **Senza LuckPerms sul proxy** — ogni backend comunica al proxy quali giocatori connessi hanno `solver.notify`, e il proxy inoltra a tutti quelli segnalati da qualsiasi backend. È il comportamento predefinito.

## Compatibilità

| Proxy | Note |
|-------|-------|
| Velocity 3.x / 4.x | Richiede Java 11+ sul proxy. |
| Waterfall | Fine vita upstream — PaperMC consiglia Velocity. Oggi funziona ancora. |
| BungeeCord | Come Waterfall. |
