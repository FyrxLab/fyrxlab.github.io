# Comandos

AbsoluteSolver proporciona un único comando raíz con subcomandos agrupados en cuatro áreas: diagnóstico, el Sistema de Sanciones, el Sistema de Reportes de Staff y el Staff Mode Toolkit.

## `/solver`

**Alias:** `/as`
**Permiso:** `solver.admin` (por defecto: OP) otorga todo lo de abajo; consulta [Permisos](#permisos) para los nodos granulares.

La mayoría de los subcomandos también están disponibles como su propio comando independiente (ej. `/vanish` en vez de `/solver vanish`) — ver [Comandos Independientes](#comandos-independientes).

---

### Diagnóstico

| Subcomando | Descripción | Permiso |
|------------|-------------|---------|
| `help` | Muestra la lista de comandos en el juego. | — |
| `reload` | Recarga `config.yml` y reinicia la IA sin reiniciar el servidor. | `solver.diagnostics.reload` |
| `analyze-last` | Vuelve a analizar manualmente el reporte de crash más reciente en `crash-reports/`. | `solver.diagnostics.analyzelast` |
| `crashme <exception\|deadlock\|oom>` | Activa un crash de prueba **real** del tipo indicado. | `solver.diagnostics.crashme` |
| `crashme dry-run` | Envía un crash report sintético a Fyrx para diagnóstico sin afectar realmente al servidor. | `solver.diagnostics.crashme` |
| `moderation status` | Muestra el estado de la moderación de chat: tamaño del buffer, jugadores rastreados, último veredicto, confianza promedio, cuenta regresiva al próximo escaneo. | `solver.diagnostics.moderation` |
| `moderation test <mensaje>` | Simula un análisis de moderación sobre un mensaje arbitrario. | `solver.diagnostics.moderation` |
| `integrity [rescan]` | Muestra el estado de la verificación del build y del escaneo de malware; `rescan` fuerza un chequeo inmediato. | `solver.diagnostics.integrity` |

### AntiVPN

Ver [AntiVPN](/es/solver/antivpn) para cómo funciona la detección.

| Subcomando | Descripción | Permiso |
|------------|-------------|---------|
| `vpn status` | Fuentes activas, antigüedad de las listas, veredictos en cache y progreso de calibración. | `solver.vpn.check` |
| `vpn check <jugador\|ip>` | Revisa una dirección y muestra el desglose del score. No cuenta para la calibración. | `solver.vpn.check` |
| `vpn whitelist add\|remove\|list <ip\|cidr>` | Direcciones que se saltan todos los chequeos. Vale al instante. | `solver.vpn.whitelist` |
| `vpn clearcache` | Vacía el cache de veredictos y vuelve a descargar las listas. | `solver.vpn.clearcache` |

### Sistema de Sanciones

| Subcomando | Descripción | Permiso |
|------------|-------------|---------|
| `warn \| mute \| tempmute \| kick \| ban \| tempban <jugador> [duración] <razón>` | Aplica la sanción correspondiente. `duración` es obligatoria para las variantes temp- (ej. `30s`, `10m`, `1d`) y opcional para `ban`/`mute`, que entonces pasan a ser `tempban`/`tempmute`. La razón también puede ser `#nombre`, que se expande a una [plantilla de razón](/es/solver/configuration#plantillas-de-razon-y-escalado-de-warns) configurada en `config.yml`. | `solver.sanctions.<tipo>` |
| `unban \| unmute \| unwarn <jugador>` | Revierte una sanción activa de ese tipo. | `solver.sanctions.<tipo>` |
| `history <jugador>` | Muestra el historial completo de sanciones de un jugador. | `solver.sanctions.history` |
| `check <id>` | Muestra el detalle de una sanción por su ID. | `solver.sanctions.check` |
| `note <jugador> <texto>` | Guarda una nota interna sobre un jugador — nunca se le muestra a él. | `solver.sanctions.note` |
| `checkuser <jugador>` | Cruza el historial de IP: muestra cada cuenta alternativa conocida de un jugador y cualquier sanción activa atada a toda esa red, no solo al nombre exacto de la cuenta. | `solver.sanctions.checkuser` |
| `appeal <id> <razón>` | Deja que un **jugador sancionado** apele su propia sanción directamente en el juego. Abierto a todos por defecto. | `solver.sanctions.appeal` (por defecto: **true**) |
| `appeal list \| accept \| reject <id>` | El staff revisa las apelaciones pendientes; `accept` revierte la sanción, `reject` la deja tal cual. | `solver.sanctions.appeal.manage` |
| `sanctions <jugador>` | Abre una GUI que navega el historial completo de sanciones de un jugador; click en una activa muestra el comando exacto para revocarla. | `solver.sanctions.gui` |

Cada sanción recibe un ID real, persiste en `sanctions.db` (o una base de datos MySQL — ver [Configuración](/es/solver/configuration#almacenamiento-de-sanciones)), y se aplica incluso si el servidor se reinicia. Los bans rechazan el login directamente y expulsan al instante a cualquier otra cuenta conectada que haya compartido alguna vez una IP con la cuenta baneada; los mutes y duraciones activas se restauran al conectarse.

### Reportes de Staff

Nuevo en 0.8.0. Deja que cualquier jugador marque algo para la atención del staff, completamente separado del Sistema de Sanciones — un reporte no es una sanción.

| Subcomando | Descripción | Permiso |
|------------|-------------|---------|
| `report <jugador> <razón>` | Presenta un reporte contra un jugador, capturando tu ubicación actual como contexto. Abierto a todos por defecto. | `solver.report` (por defecto: **true**) |
| `reports` | Lista todos los reportes abiertos. | `solver.reports.manage` |
| `reports claim \| close \| reopen <id> [razón]` | Gestiona la cola. El que reportó recibe un mensaje directo en el juego cuando su reporte se reclama o se cierra. | `solver.reports.manage` |
| `reports gui` | Abre una GUI de reportes abiertos — click izquierdo reclama, click derecho cierra. | `solver.reports.gui` |

### Staff Mode Toolkit

| Subcomando | Descripción | Permiso |
|------------|-------------|---------|
| `vanish [strict]` | Alterna tu propio modo vanish. `strict` es un segundo nivel, invisible incluso para la mayoría del staff, que necesita un permiso aparte para verlo. Oculto para otros jugadores, restado del contador de jugadores en la lista de servidores, los mobs dejan de apuntarte, y tu nombre ya no se filtra por el autocompletado. | `solver.staffmode.vanish` (`.vanish.see-strict` para ver a través del strict) |
| `freeze <jugador>` | Alterna el congelamiento de un jugador: bloquea su movimiento, la mayoría de comandos, y el combate. El propio comando de congelar siempre funciona sobre un jugador ya congelado, incluso sin otro staff conectado para descongelarlo. | `solver.staffmode.freeze` |
| `freeze <jugador> <mensaje>` | Manda un mensaje al canal privado de congelamiento de ese jugador en vez de alternar — te deja hablar de verdad con alguien durante un screenshare en vez de solo silenciarlo. | `solver.staffmode.freeze` |
| `staffchat [mensaje]` | Sin mensaje, alterna un modo donde todo lo que escribes solo va al staff. Con un mensaje, envía un mensaje puntual solo para staff sin alternar el modo. | `solver.staffmode.staffchat` |
| `commandspy` | Alterna un relevo **en vivo** de cada comando que ejecutan otros jugadores directo a tu chat, no solo un registro retrospectivo. | `solver.staffmode.commandspy` |
| `staffmode <perfil>` | Alterna un perfil combinado que definís en `config.yml` (vanish + inmunidad al freeze + vuelo + modo dios + vaciado de inventario). Tu inventario siempre se guarda y se restaura automáticamente. | `solver.staffmode.profiles` |
| `fly` | Alterna el vuelo, independiente de cualquier perfil. | `solver.staffmode.fly` |
| `god` | Alterna la invulnerabilidad, incluyendo el daño de PvP. | `solver.staffmode.god` |
| `rtp` | Te teletransporta a un jugador no-staff al azar, para rondas de supervisión. | `solver.staffmode.rtp` |
| `inspect <jugador>` | Abre una vista del inventario principal, armadura y offhand de un jugador sin abrirlo físicamente. Click en un ítem para confiscarlo directamente de su inventario real. | `solver.staffmode.inspect` |
| `enderchest <jugador>` | El mismo tratamiento de ver/confiscar para el enderchest de un jugador — queda como comando propio porque una ventana de inventario de Bukkit tiene un techo de 54 slots, y la vista de `inspect` ya usa 41. | `solver.staffmode.enderchest` |

Un jugador con `solver.staffmode.silentjoin` se conecta ya en vanish, sin ningún mensaje de conexión.

---

## Comandos Independientes

Los grupos de comandos de Sanciones, Staff Mode, Reportes y Moderación también se registran directamente, sin el prefijo `/solver` — `/solver <comando>` sigue funcionando exactamente igual que antes en cualquier caso:

- **Staff Mode:** `/vanish`, `/freeze`, `/staffchat`, `/commandspy`, `/staffmode`, `/fly`, `/god`, `/inspect`, `/enderchest` (se desactiva solo si EssentialsX está instalado — su propio `/enderchest` significa "mostrar el mío", un significado distinto al nuestro)
- **Sanciones:** `/warn`, `/mute`, `/tempmute`, `/kick`, `/ban`, `/tempban`, `/unban`, `/unmute`, `/unwarn`, `/history`, `/check`, `/note`, `/checkuser`, `/appeal`, `/sanctions`
- **Moderación:** `/moderation`
- **Reportes:** `/report`

`rtp` no tiene forma independiente a propósito — ese nombre ya es un comando muy común de "teletransporte aleatorio dentro del borde del mundo" en el resto del ecosistema de plugins, y significa algo distinto al nuestro.

Cada categoría se puede desactivar de forma independiente en `config.yml` si otro plugin instalado ya usa uno de esos nombres:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (salvo que EssentialsX esté instalado)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## Ejemplos de Uso

**Activar un análisis manual de crash:**
```
/solver analyze-last
```

**Probar el diagnóstico sin un crash real:**
```
/solver crashme dry-run
```

**Advertir, y luego silenciar temporalmente, a un jugador:**
```
/solver warn Steve Spam en el chat
/solver tempmute Steve 10m Spam continuo tras la advertencia
```

**Consultar el historial de sanciones de un jugador:**
```
/solver history Steve
```

**Buscar cuentas alternativas antes de decidir si banear:**
```
/solver checkuser Steve
```

**Apelar tu propia sanción:**
```
/solver appeal 42 Me estaba defendiendo
```

**Reportar a un jugador al staff:**
```
/solver report Steve Griefeando mi base
```

**Alternar tu propio vanish (o la forma independiente):**
```
/solver vanish
/vanish
```

::: warning Los Crash Tests son Peligrosos
Los subcomandos `crashme exception|deadlock|oom` están pensados **solo para pruebas** en un entorno de desarrollo. **No** ejecutes `crashme oom` en un servidor de producción — causará un OutOfMemoryError real. Usa `crashme dry-run` si solo quieres ver el diagnóstico de Fyrx de forma segura.
:::

---

## Permisos

Los permisos están agrupados para que puedas otorgar una categoría completa a la vez (ej. con LuckPerms) sin dar acceso de administrador total.

| Permiso | Por defecto | Descripción |
|---------|-------------|-------------|
| `solver.admin` | OP | Acceso completo a todo lo de abajo. |
| `solver.notify` | OP | Recibe notificaciones en el juego de errores y alertas de moderación de chat. |
| `solver.moderation.bypass` | false | Exime a este jugador puntual de la moderación de chat, sea OP o no. |
| `solver.diagnostics.*` | false | Todos los comandos de diagnóstico (`reload`/`analyze-last`/`crashme`/`moderation`). |
| `solver.sanctions.*` | false | Todos los comandos de sanciones, incluyendo `checkuser`, `appeal.manage` y la GUI `sanctions`. |
| `solver.staffmode.*` | false | Todos los comandos del Staff Mode Toolkit. |
| `solver.vpn.*` | false | Todos los comandos de AntiVPN (`vpn status`/`check`/`whitelist`/`clearcache`). |
| `solver.reports.*` | false | Todos los comandos de reportes. |
| `solver.report` | **true** | Presentar un reporte (`/solver report`). Abierto a todos por defecto. |
| `solver.sanctions.appeal` | **true** | Apelar tu propia sanción (`/solver appeal <id> <razón>`). Abierto a todos por defecto. |

Cada subcomando también tiene su propio permiso individual (ej. `solver.sanctions.warn`, `solver.staffmode.vanish`, `solver.staffmode.commandspy`, `solver.staffmode.inspect`, `solver.staffmode.enderchest`, `solver.staffmode.vanish.see-strict`, `solver.reports.manage`, `solver.reports.gui`) si necesitas un control más fino que los grupos comodín de arriba.

Puedes otorgar estos permisos con cualquier plugin de permisos (ej. LuckPerms):

```
/lp user <jugador> permission set solver.sanctions.* true
```
