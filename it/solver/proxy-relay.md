# Relay Proxy

::: warning Novità nella 0.9.2 — solo relay di chat/log, non supporto proxy completo
Solver gira solo su singoli server della famiglia Bukkit (Paper, Purpur, Spigot, CraftBukkit, Folia). Un proxy non ha mondi, inventari o giocatori con stato di gioco, quindi sanzioni, vanish e GUI non girano lì — il relay inoltra solo testo di avvisi e staffchat attraverso la tua rete. Sponge non ha alcuna relazione con questa funzionalità e resta non supportato.
:::

Se gestisci una rete BungeeCord, Waterfall o Velocity con più di un backend potenziato da Solver, il relay proxy fa sì che i messaggi di staffchat e gli avvisi di moderazione/integrità raggiungano lo staff connesso a *qualsiasi* backend, non solo a quello dove è avvenuto l'avviso.

## Cosa viene inoltrato

- Messaggi di `/solver staffchat` (e la modalità staffchat attivata)
- Avvisi di moderazione chat (Fyrx IA)
- Avvisi di integrità — hash del jar non corrispondente, corrispondenza malware, agente Java rilevato

Nient'altro. Nessuna sanzione, stato vanish o dato di GUI attraversa la rete — vedi l'avviso sopra per il perché.

## Configurazione

### 1. Attiva il relay su ogni backend

Nel `plugins/Solver/config.yml` di ogni backend:

```yaml
proxy-relay:
  enabled: false   # cambia in true
```

Disattivato di default — un relay a livello di rete è un vero cambiamento di comportamento, quindi è opt-in.

### 2. Installa il plugin corrispondente sul proxy

Il lato proxy è un **plugin separato e piccolo** — non fa parte del `Solver.jar` che installi sui backend. Scegli quello corrispondente al tuo software proxy:

- **BungeeCord o Waterfall** (condividono la stessa API dei plugin) → `solver-proxy-bungee.jar`
- **Velocity** → `solver-proxy-velocity.jar`

Metti il jar corrispondente nella cartella `plugins/` del proxy stesso e riavvia il proxy. Non ha un proprio file di configurazione — si attiva non appena un backend connesso ha `proxy-relay.enabled: true` e invia il suo primo messaggio.

### 3. Conferma che sia in esecuzione

All'avvio del proxy, la console stampa una riga:

```
SolverProxy (Bungee/Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Chi riceve i messaggi inoltrati

Il relay raggiunge solo i giocatori con `solver.notify` (per gli avvisi) o `solver.staffmode.staffchat` (per la staffchat) — gli stessi permessi usati localmente su ogni backend. Come il proxy verifica quel permesso dipende da cosa è installato:

- **LuckPerms installato sul proxy** — usato direttamente. Se la tua configurazione LuckPerms condivide lo storage su tutta la rete, questo corrisponde già a ciò che ogni backend concede, senz'altro da configurare.
- **Nessun LuckPerms sul proxy** — ogni backend informa periodicamente il proxy su quali giocatori connessi hanno attualmente `solver.notify`, e il proxy inoltra all'unione di tutti quelli segnalati da qualsiasi backend. Questo è il default se non hai installato LuckPerms lato proxy.

## Compatibilità

| Proxy | Plugin | Note |
|-------|--------|------|
| Velocity | `solver-proxy-velocity.jar` | Richiede Java 11+ sul proxy. |
| Waterfall | `solver-proxy-bungee.jar` | Waterfall ha raggiunto il fine vita a monte — PaperMC consiglia di migrare a Velocity. Il plugin funziona ancora oggi su di esso. |
| BungeeCord | `solver-proxy-bungee.jar` | Stesso plugin di Waterfall. |
