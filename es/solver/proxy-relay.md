# Relay de Proxy

::: tip Actualizado en 0.10.0 — un solo jar para todo
Solver corre en servers de la familia Bukkit. En un proxy, el mismo jar solo corre un relay chico: un proxy no tiene mundos, inventarios ni jugadores con estado de juego, así que sanciones, vanish y GUIs se quedan en los backends.
:::

Si tienes una red BungeeCord, Waterfall o Velocity con más de un backend con Solver, el relay hace que los mensajes de staffchat y las alertas de moderación/integridad/VPN le lleguen al staff conectado en *cualquier* backend, no solo en el que se originaron.

## Qué se retransmite

- Mensajes de `/solver staffchat` (y el modo staffchat activado)
- Alertas de moderación de chat (IA Fyrx)
- Alertas de integridad — jar que no coincide, malware detectado, Java agent detectado
- Alertas de [AntiVPN](/es/solver/antivpn)

El staff del server donde nació el mensaje ya lo ve localmente, así que el relay no le manda una segunda copia. Una alerta generada mientras un backend no tiene a nadie conectado (lo típico en AntiVPN, que dispara antes de que el jugador entre) se guarda y se entrega en cuanto alguien entra a ese backend.

## Instalación

### 1. Activa el relay en cada backend

En el `plugins/Solver/config.yml` de cada backend:

```yaml
proxy-relay:
  enabled: true
```

Desactivado por defecto — un relay en toda la red es un cambio de comportamiento real, así que es opcional.

### 2. Instala el mismo jar en el proxy

Pon **el mismo `Solver.jar`** que usas en tus backends en la carpeta `plugins/` del proxy y reinicia el proxy — no hay un plugin de proxy aparte. BungeeCord/Waterfall leen su `bungee.yml` y Velocity su `velocity-plugin.json`; ninguno carga código de Bukkit. No tiene archivo de configuración propio.

### 3. Confirma que está corriendo

Al arrancar el proxy, la consola muestra una línea:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Quién recibe los mensajes

El relay solo le llega a jugadores con `solver.notify` (alertas) o `solver.staffmode.staffchat` (staffchat) — los mismos permisos que se usan localmente en cada backend. Cómo los verifica el proxy depende de lo que tengas instalado:

- **LuckPerms instalado en el proxy** — se usa directamente. Si tu LuckPerms comparte almacenamiento en toda la red, ya coincide con lo que otorga cada backend.
- **Sin LuckPerms en el proxy** — cada backend le informa al proxy qué jugadores conectados tienen `solver.notify`, y el proxy retransmite a todos los reportados por cualquier backend. Es el comportamiento por defecto.

## Compatibilidad

| Proxy | Notas |
|-------|-------|
| Velocity 3.x / 4.x | Requiere Java 11+ en el proxy. |
| Waterfall | Sin soporte upstream — PaperMC recomienda Velocity. Hoy sigue funcionando. |
| BungeeCord | Igual que Waterfall. |
