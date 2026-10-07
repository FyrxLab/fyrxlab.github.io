# Reti con Proxy

::: tip Aggiornato nella 0.10.2 — AntiVPN e integrità sul proxy
Il proxy ora può controllare ogni connessione una sola volta per tutta la rete e verificare il proprio jar. Lo stesso `Solver.jar` di sempre.
:::

Metti lo **stesso `Solver.jar`** che usi sui backend nel tuo proxy BungeeCord, Waterfall o Velocity. Non esiste un plugin separato per il proxy: BungeeCord/Waterfall leggono il suo `bungee.yml`, Velocity il suo `velocity-plugin.json`, e nessuno dei due carica il codice Bukkit. Sul proxy fa tre cose:

1. **Inoltra** lo staffchat e gli avvisi di moderazione/integrità/VPN allo staff di *qualsiasi* backend.
2. **AntiVPN** — controlla ogni connessione prima che raggiunga un server.
3. **Integrità** — verifica il proprio jar e scansiona gli altri plugin del proxy.

Sanzioni, vanish e GUI restano sui backend: un proxy non ha mondi, inventari né giocatori con stato di gioco.

## Configurazione

1. Metti `Solver.jar` nella cartella `plugins/` del proxy e riavvia il proxy.
2. All'avvio crea la propria config: `plugins/SolverProxy/config.yml` (BungeeCord/Waterfall) o `plugins/solverproxy/config.yml` (Velocity). Le sue chiavi significano esattamente lo stesso che nel `config.yml` di un backend.
3. La console conferma che è attivo:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Relay

Attivalo nel `plugins/Solver/config.yml` di **ogni backend**:

```yaml
proxy-relay:
  enabled: true
```

Disattivato di default — un relay per tutta la rete è un vero cambiamento di comportamento, quindi è opzionale. Cosa viene inoltrato:

- I messaggi di `/solver staffchat` (e la modalità staffchat attivata)
- Gli avvisi di moderazione della chat (Fyrx AI)
- Gli avvisi di integrità — jar non corrispondente, malware rilevato, Java agent rilevato
- Gli avvisi di [AntiVPN](/it/solver/antivpn)

Lo staff del server dove è partito il messaggio lo vede già in locale, quindi il relay non gli invia una seconda copia. Un avviso generato mentre un backend non ha nessuno online (tipico di AntiVPN, che scatta prima che il giocatore entri) viene trattenuto e consegnato appena qualcuno entra in quel backend.

### Chi riceve i messaggi

I giocatori con `solver.notify` (avvisi) o `solver.staffmode.staffchat` (staffchat) — gli stessi permessi usati su ogni backend. Come lo verifica il proxy:

- **LuckPerms installato sul proxy** — usato direttamente. Se il tuo LuckPerms condivide lo storage su tutta la rete, corrisponde già a quanto concede ogni backend.
- **Nessun LuckPerms sul proxy** — ogni backend comunica al proxy quali giocatori connessi hanno `solver.notify`, e il proxy usa tutti quelli segnalati da qualsiasi backend. È il comportamento predefinito.

## AntiVPN sul proxy

Attivo di default nella config del proxy. Ogni connessione viene controllata prima di raggiungere qualsiasi server, con lo stesso motore di un backend — fonti, [profili](/it/solver/antivpn), finestra di calibrazione, whitelist — con le stesse chiavi (`antivpn.*`, `reasoning.*`).

::: warning Disattivalo sui backend
Se il proxy usa AntiVPN, imposta questo nel `config.yml` di ogni backend, altrimenti ogni connessione viene controllata e segnalata due volte:

```yaml
antivpn:
  own_engine:
    enabled: false
```

Il proxy te lo ricorda nella sua console all'avvio. Un backend non può rilevarlo da solo in modo sicuro: un giocatore potrebbe falsificare un messaggio che dice "il proxy controlla già".
:::

- **Avvisi**: arrivano a tutto lo staff connesso alla rete, con l'etichetta `[proxy]`.
- **Blocco**: con `antivpn.action.mode: auto-action` (e la finestra di calibrazione completata), il giocatore viene rifiutato sul proxy e non raggiunge mai un server. Il messaggio che vede è `antivpn.kick-message` nella config del proxy (MiniMessage).
- **FoxGate** sul proxy funziona come su un backend: Solver non blocca mai nessuno, e `antivpn.foxgate-mode` sceglie `addon` (continua ad avvisare) o `off`.
- I verdetti vengono salvati in `antivpn.db` accanto alla config del proxy, quindi un riavvio del proxy non riconsulta tutti i giocatori.

Sul proxy non ci sono comandi `/solver vpn`: modifica la whitelist in `antivpn.whitelist` nella config del proxy e riavvialo.

## Integrità sul proxy

Gli stessi controlli di un backend, configurati in `integrity.*` nella config del proxy:

- **Verifica del build** — il jar di Solver del proxy viene confrontato con la release ufficiale su Modrinth. Un build di sviluppo viene solo segnalato, mai marcato.
- **Scansione malware** — ogni altro `.jar` nella cartella `plugins/` del proxy viene confrontato con la lista firmata di hash di malware noti (Java 15+).
- **Rilevamento Java agent** — un avviso se un agent è stato collegato alla JVM del proxy all'avvio.

Gli avvisi vanno alla console del proxy e allo staff della rete, con l'etichetta `[proxy]`.

## Compatibilità

| Proxy | Note |
|-------|------|
| Velocity 3.x / 4.x | Richiede Java 11+ sul proxy. |
| Waterfall | Fine vita upstream — PaperMC consiglia Velocity. Funziona ancora oggi. |
| BungeeCord | Come Waterfall. |
