# Redes con Proxy

::: tip Actualizado en 0.10.2 — AntiVPN e integridad en el proxy
El proxy ahora puede revisar cada conexión una sola vez para toda la red y verificar su propio jar. El mismo `Solver.jar` de siempre.
:::

Pon el **mismo `Solver.jar`** que usas en tus backends en tu proxy BungeeCord, Waterfall o Velocity. No hay un plugin de proxy aparte: BungeeCord/Waterfall leen su `bungee.yml`, Velocity su `velocity-plugin.json`, y ninguno carga el código de Bukkit. En el proxy hace tres cosas:

1. **Retransmite** el staffchat y las alertas de moderación/integridad/VPN para que lleguen al staff de *cualquier* backend.
2. **AntiVPN** — revisa cada conexión antes de que llegue a un servidor.
3. **Integridad** — verifica su propio jar y escanea los demás plugins del proxy.

Las sanciones, el vanish y las GUIs se quedan en los backends: un proxy no tiene mundos, inventarios ni jugadores con estado de juego.

## Instalación

1. Pon `Solver.jar` en la carpeta `plugins/` del proxy y reinicia el proxy.
2. Al arrancar crea su propia config: `plugins/SolverProxy/config.yml` (BungeeCord/Waterfall) o `plugins/solverproxy/config.yml` (Velocity). Sus claves significan exactamente lo mismo que en el `config.yml` de un backend.
3. La consola confirma que está corriendo:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Relay

Actívalo en el `plugins/Solver/config.yml` de **cada backend**:

```yaml
proxy-relay:
  enabled: true
```

Apagado por defecto — un relay para toda la red es un cambio de comportamiento real, así que es opcional. Qué se retransmite:

- Los mensajes de `/solver staffchat` (y el modo staffchat activado)
- Las alertas de moderación de chat (Fyrx AI)
- Las alertas de integridad — jar que no coincide, malware detectado, Java agent detectado
- Las alertas de [AntiVPN](/es/solver/antivpn)

El staff del servidor donde se originó el mensaje ya lo ve localmente, así que el relay no le manda una segunda copia. Una alerta generada mientras un backend no tiene a nadie conectado (lo normal en AntiVPN, que salta antes de que el jugador entre) se guarda y se entrega en cuanto alguien entra a ese backend.

### Quién recibe los mensajes

Los jugadores con `solver.notify` (alertas) o `solver.staffmode.staffchat` (staffchat) — los mismos permisos que en cada backend. Cómo lo comprueba el proxy:

- **LuckPerms instalado en el proxy** — se usa directamente. Si tu LuckPerms comparte almacenamiento en toda la red, ya coincide con lo que da cada backend.
- **Sin LuckPerms en el proxy** — cada backend le dice al proxy qué jugadores conectados tienen `solver.notify`, y el proxy usa a todos los que reporte cualquier backend. Es el comportamiento por defecto.

## AntiVPN en el proxy

Encendido por defecto en la config del proxy. Cada conexión se revisa antes de llegar a cualquier servidor, con el mismo motor que un backend — fuentes, [perfiles](/es/solver/antivpn), ventana de calibración, lista blanca — bajo las mismas claves (`antivpn.*`, `reasoning.*`).

::: warning Apágalo en los backends
Si el proxy usa AntiVPN, pon esto en el `config.yml` de cada backend, o cada conexión se revisa y se alerta dos veces:

```yaml
antivpn:
  own_engine:
    enabled: false
```

El proxy te lo recuerda en su consola al arrancar. Un backend no puede detectarlo solo de forma segura: un jugador podría falsificar un mensaje que diga "el proxy ya revisa".
:::

- **Alertas**: le llegan a todo el staff conectado a la red, con la etiqueta `[proxy]`.
- **Bloqueo**: con `antivpn.action.mode: auto-action` (y la ventana de calibración completa), el jugador se rechaza en el proxy y nunca llega a un servidor. El mensaje que ve es `antivpn.kick-message` en la config del proxy (MiniMessage).
- **FoxGate** en el proxy funciona igual que en un backend: Solver nunca bloquea a nadie, y `antivpn.foxgate-mode` elige `addon` (seguir alertando) u `off`.
- Los veredictos se guardan en `antivpn.db` junto a la config del proxy, así que reiniciar el proxy no vuelve a consultar a todos los jugadores.

No hay comandos `/solver vpn` en el proxy: edita la lista blanca en `antivpn.whitelist` de la config del proxy y reinícialo.

## Integridad en el proxy

Los mismos chequeos que en un backend, configurados en `integrity.*` de la config del proxy:

- **Verificación del build** — el jar de Solver del proxy se compara con la versión oficial en Modrinth. Un build de desarrollo solo se informa, nunca se marca.
- **Escaneo de malware** — cada `.jar` de la carpeta `plugins/` del proxy se compara con la lista firmada de hashes de malware conocido (Java 15+).
- **Detección de Java agents** — un aviso si se adjuntó un agent a la JVM del proxy al arrancar.

Las alertas van a la consola del proxy y al staff de la red, con la etiqueta `[proxy]`.

## Compatibilidad

| Proxy | Notas |
|-------|-------|
| Velocity 3.x / 4.x | Requiere Java 11+ en el proxy. |
| Waterfall | Fin de vida upstream — PaperMC recomienda Velocity. Sigue funcionando hoy. |
| BungeeCord | Igual que Waterfall. |
