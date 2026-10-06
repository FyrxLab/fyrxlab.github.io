# AntiVPN

::: tip Novità della 0.10.0
:::

Solver controlla ogni giocatore che si connette contro reti VPN e proxy note prima che entri, combina ciò che trova in un punteggio spiegabile e — solo quando lo consenti — rifiuta la connessione.

## Come rileva

Le fonti vengono provate dalla più economica alla più costosa, e una successiva parte solo se le precedenti non hanno trovato nulla:

| Fonte | Cos'è | Chiamata di rete per login? |
|-------|-------|-----------------------------|
| `x4bnet-vpn` | Lista statica di range VPN noti ([X4BNet](https://github.com/X4BNet/lists_vpn), MIT), scaricata una volta al giorno e confrontata in memoria. | No |
| `x4bnet-datacenter` | La lista più ampia dello stesso progetto (VPN + hosting). Spenta di default — segnala anche giocatori sul proprio VPS. | No |
| `ipquery` | Ricerca in tempo reale su [IPQuery.io](https://ipquery.io), solo per indirizzi non coperti dalla lista. | Sì |
| `ipapiis` | [ipapi.is](https://ipapi.is), ultima risorsa. Senza key restituisce solo la rete (ASN); con una key gratuita aggiunge i flag VPN/proxy/Tor. | Sì |
| `bad-asn-list` | Reti note di VPN consumer (NordVPN, Mullvad, ExpressVPN...), confrontate con l'ASN risolto dalle ricerche — intercetta un range nuovo prima di qualsiasi lista. | No |

Gli indirizzi locali e LAN non vengono mai cercati. Ogni verdetto viene messo in cache per IP (`cache-ttl-hours`, predefinito 24); se tutte le ricerche in tempo reale falliscono, non si mette nulla in cache e l'indirizzo viene ricontrollato al login successivo.

## Il punteggio

Ogni fonte che scatta diventa un segnale con la propria confidenza. I segnali si combinano in un unico punteggio da 0 a 100, e il verdetto mostra sempre il dettaglio:

```
185.220.101.1 is flagged: VPN (source: x4bnet-vpn)
score 90.0 <- x4bnet-vpn (SOLVER_OWN) +90.0
```

Cosa succede a un dato punteggio dipende dal profilo:

| Profilo | Avviso | Espulsione |
|---------|--------|------------|
| `conservative` (predefinito) | 50 | 80 |
| `balanced` | 40 | 70 |
| `strict` | 30 | 55 |
| `custom` | i tuoi numeri in `reasoning.custom` | |

## Finestra di calibrazione

La prima volta che AntiVPN viene attivato si limita ad avvisare — anche con `action.mode: auto-action` — finché non ha visto `reasoning.bootstrap.min-flags` rilevamenti reali (predefinito 20) o finché non passano `max-days` (predefinito 7). `/solver vpn status` mostra l'avanzamento. Le ricerche manuali con `/solver vpn check` non contano.

## Azioni

```yaml
antivpn:
  action:
    mode: "alert-only"          # alert-only | auto-action
    persist-as-sanction: true   # registra i login bloccati in /solver history come KICK
```

Con `auto-action`, una connessione viene rifiutata quando il punteggio raggiunge la soglia di espulsione del profilo. Gli avvisi arrivano a chiunque abbia `solver.notify`, e anche agli altri backend se il [Relay Proxy](/it/solver/proxy-relay) è attivo.

## FoxGate

Se [FoxGate](https://modrinth.com/plugin/foxgate) è installato, Solver **non** espelle né banna **mai** per motivi di VPN — non è configurabile. Scegli solo come Solver si fa da parte:

```yaml
antivpn:
  foxgate-mode: "addon"   # addon: continua a controllare e avvisare | off: non gira affatto
```

## Whitelist

```
/solver vpn whitelist add 203.0.113.7
/solver vpn whitelist add 198.51.100.0/24
```

Effetto immediato, senza riavvio. Modificabile anche in `antivpn.whitelist` dentro `config.yml`.

## Privacy

`ipquery` e `ipapiis` inviano l'IP del giocatore che si connette a quel servizio esterno — solo per indirizzi che le liste statiche e la cache non hanno già risolto. Le liste statiche non inviano mai nulla. Disattiva qualsiasi fonte in `antivpn.own_engine.sources`, o AntiVPN per intero con `antivpn.own_engine.enabled: false`.

## Comandi

| Comando | Permesso |
|---------|----------|
| `/solver vpn status` | `solver.vpn.check` |
| `/solver vpn check <giocatore\|ip>` | `solver.vpn.check` |
| `/solver vpn whitelist add\|remove\|list <ip\|cidr>` | `solver.vpn.whitelist` |
| `/solver vpn clearcache` | `solver.vpn.clearcache` |
