# AntiVPN

::: tip Nuevo en 0.10.0
:::

Solver revisa a cada jugador que se conecta contra redes conocidas de VPN y proxies antes de que entre, combina lo que encuentra en un score explicable y — solo cuando tú lo permitas — rechaza la conexión.

## Cómo detecta

Las fuentes se prueban de la más barata a la más cara, y una posterior solo corre si las anteriores no encontraron nada:

| Fuente | Qué es | ¿Llamada de red por login? |
|--------|--------|---------------------------|
| `x4bnet-vpn` | Lista estática de rangos de VPN conocidos ([X4BNet](https://github.com/X4BNet/lists_vpn), MIT), descargada una vez por día y comparada en memoria. | No |
| `x4bnet-datacenter` | La lista más amplia del mismo proyecto (VPN + hosting). Apagada por defecto — también marca a jugadores en su propio VPS. | No |
| `ipquery` | Consulta en tiempo real a [IPQuery.io](https://ipquery.io), solo para direcciones que la lista no cubrió. | Sí |
| `ipapiis` | [ipapi.is](https://ipapi.is), último recurso. Sin key solo devuelve la red (ASN); con una key gratuita suma flags de VPN/proxy/Tor. | Sí |
| `bad-asn-list` | Redes conocidas de VPN de consumo (NordVPN, Mullvad, ExpressVPN, Proton, Surfshark...), incluidas empresas de VPN cuyo nombre de red no dice "VPN", cruzadas contra el ASN que resolvieron las consultas — atrapa un rango nuevo antes que cualquier lista. | No |

Las direcciones locales y de LAN nunca se consultan. Cada veredicto se guarda en cache por IP (`cache-ttl-hours`, por defecto 24); si fallan todas las consultas en tiempo real, no se cachea nada y la dirección se reintenta en el siguiente login.

## El score

Cada fuente que dispara se convierte en una señal con su propia confianza. Las señales se combinan en un único score de 0 a 100, y el veredicto siempre muestra el desglose:

```
185.220.101.1 is flagged: VPN (source: x4bnet-vpn)
score 90.0 <- x4bnet-vpn (SOLVER_OWN) +90.0
```

Qué pasa con cada score depende del perfil:

| Perfil | Aviso | Expulsión |
|--------|-------|-----------|
| `conservative` (por defecto) | 50 | 80 |
| `balanced` | 40 | 70 |
| `strict` | 30 | 55 |
| `custom` | tus números en `reasoning.custom` | |

## Ventana de calibración

La primera vez que se activa AntiVPN, solo alerta — incluso con `action.mode: auto-action` — hasta haber visto `reasoning.bootstrap.min-flags` detecciones reales (por defecto 20) o hasta que pasen `max-days` (por defecto 7). `/solver vpn status` muestra el progreso. Las consultas manuales con `/solver vpn check` no cuentan.

## Acciones

```yaml
antivpn:
  action:
    mode: "alert-only"          # alert-only | auto-action
    persist-as-sanction: true   # registra los logins bloqueados en /solver history como KICK
```

Con `auto-action`, una conexión se rechaza cuando su score alcanza el umbral de expulsión del perfil. Las alertas le llegan a todos los que tengan `solver.notify`, y también a otros backends si el [Redes con Proxy](/es/solver/proxy-relay) está activo.

::: tip ¿Tienes una red con proxy?
El mismo jar puede correr el AntiVPN una sola vez en el proxy para toda la red — ver [Redes con Proxy](/es/solver/proxy-relay#antivpn-en-el-proxy). Si lo haces, apágalo en los backends.
:::

## FoxGate

Si [FoxGate](https://modrinth.com/plugin/foxgate) está instalado, Solver **nunca** expulsa ni banea por VPN — eso no es configurable. Solo eliges cómo se hace a un lado Solver:

```yaml
antivpn:
  foxgate-mode: "addon"   # addon: sigue revisando y alertando | off: no corre en absoluto
```

## Whitelist

```
/solver vpn whitelist add 203.0.113.7
/solver vpn whitelist add 198.51.100.0/24
```

Vale al instante, sin reiniciar. También se edita en `antivpn.whitelist` dentro de `config.yml`.

## Privacidad

`ipquery` e `ipapiis` envían la IP del jugador que se conecta a ese servicio externo — solo para direcciones que las listas estáticas y el cache no resolvieron. Las listas estáticas nunca envían nada. Apaga cualquier fuente en `antivpn.own_engine.sources`, o AntiVPN entero con `antivpn.own_engine.enabled: false`.

## Comandos

| Comando | Permiso |
|---------|---------|
| `/solver vpn status` | `solver.vpn.check` |
| `/solver vpn check <jugador\|ip>` | `solver.vpn.check` |
| `/solver vpn whitelist add\|remove\|list <ip\|cidr>` | `solver.vpn.whitelist` |
| `/solver vpn clearcache` | `solver.vpn.clearcache` |
