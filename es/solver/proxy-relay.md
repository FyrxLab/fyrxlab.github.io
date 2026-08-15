# Relay de Proxy

::: warning Nuevo en 0.9.2 — solo relay de chat/logs, no soporte de proxy completo
Solver solo corre en servers individuales de la familia Bukkit (Paper, Purpur, Spigot, CraftBukkit, Folia). Un proxy no tiene mundos, inventarios ni jugadores con estado de juego, así que sanciones, vanish y GUIs no corren ahí — el relay solo retransmite texto de alertas y staffchat a través de tu red. Sponge no tiene relación con esta feature y sigue sin estar soportado.
:::

Si corrés una red BungeeCord, Waterfall o Velocity con más de un backend potenciado por Solver, el relay de proxy hace que los mensajes de staffchat y las alertas de moderación/integridad le lleguen al staff conectado en *cualquier* backend, no solo al que originó la alerta.

## Qué se retransmite

- Mensajes de `/solver staffchat` (y el modo staffchat activado)
- Alertas de moderación de chat (Fyrx IA)
- Alertas de integridad — hash del jar no coincide, coincidencia de malware, agente Java detectado

Nada más. Ninguna sanción, estado de vanish, ni datos de GUI cruzan la red — ver la advertencia de arriba para el porqué.

## Configuración

### 1. Activá el relay en cada backend

En el `plugins/Solver/config.yml` de cada backend:

```yaml
proxy-relay:
  enabled: false   # cambiar a true
```

Desactivado por defecto — un relay de toda la red es un cambio de comportamiento real, así que es opt-in.

### 2. Instalá el plugin correspondiente en el proxy

El lado del proxy es un **plugin separado y chico** — no forma parte del `Solver.jar` que instalás en los backends. Elegí el que corresponda a tu software de proxy:

- **BungeeCord o Waterfall** (comparten la misma API de plugins) → `solver-proxy-bungee.jar`
- **Velocity** → `solver-proxy-velocity.jar`

Poné el jar correspondiente en la carpeta `plugins/` propia del proxy y reiniciá el proxy. No tiene archivo de configuración propio — se activa apenas un backend conectado tenga `proxy-relay.enabled: true` y mande su primer mensaje.

### 3. Confirmá que está corriendo

Al arrancar el proxy, la consola imprime una línea:

```
SolverProxy (Bungee/Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Quién recibe los mensajes retransmitidos

El relay solo le llega a jugadores con `solver.notify` (para alertas) o `solver.staffmode.staffchat` (para staffchat) — los mismos permisos que se usan localmente en cada backend. Cómo el proxy chequea ese permiso depende de qué esté instalado:

- **LuckPerms instalado en el proxy** — se usa directamente. Si tu instalación de LuckPerms comparte storage en toda la red, esto ya coincide con lo que cada backend otorga, sin nada más que configurar.
- **Sin LuckPerms en el proxy** — cada backend le avisa periódicamente al proxy qué jugadores conectados tienen actualmente `solver.notify`, y el proxy retransmite a la unión de todos los reportados por cualquier backend. Este es el default si no instalaste LuckPerms del lado del proxy.

## Compatibilidad

| Proxy | Plugin | Notas |
|-------|--------|-------|
| Velocity | `solver-proxy-velocity.jar` | Requiere Java 11+ en el proxy. |
| Waterfall | `solver-proxy-bungee.jar` | Waterfall llegó a su fin de vida upstream — PaperMC recomienda migrar a Velocity. El plugin todavía funciona hoy en él. |
| BungeeCord | `solver-proxy-bungee.jar` | Mismo plugin que Waterfall. |
