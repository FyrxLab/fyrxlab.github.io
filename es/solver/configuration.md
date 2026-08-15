# Configuración

AbsoluteSolver se configura mediante `plugins/Solver/config.yml`. Las opciones nuevas que agrega una actualización se combinan automáticamente al iniciar — lo que ya hayas personalizado no se toca.

## Referencia de Diagnóstico

```yaml
# Idioma (en_US, es_ES, pt_BR, ru_RU, de_DE, fr_FR, ja_JP, ko_KR, eo_EO)
localization: es_ES

# Analizar reportes de crash automáticamente cuando el servidor inicia
check-crash-on-startup: true

# Monitorear la consola en busca de errores
monitor-console: true
# Tiempo de espera entre análisis en minutos (evita enviar spam a la IA)
error-cooldown-minutes: 10

# Mostrar el banner ASCII al iniciar
show-banner: true

# Configuración del Proveedor IA
ai-provider:
  # Proveedor: 'anthropic', 'google' u 'other'
  provider: "anthropic"

  # Modelo a utilizar
  # Anthropic: Sonnet, Haiku, Opus
  # Google: Pro, Flash
  # Other: Nombre del modelo (ej: gpt-4o, mistral-large)
  model: "Sonnet"

  # Claves API
  anthropic-key: ""
  google-key: ""

  # Configuración del proveedor 'other' (compatible con OpenAI)
  other-key: ""
  other-url: "https://api.openai.com/v1/chat/completions"

# Configuración de análisis
analysis:
  auto-analyze: true
  timeout: 60
  save-to-file: true
  reports-directory: "crash-reports"
  # Días que se conservan los análisis guardados antes de borrarlos. 0 = para siempre.
  reports-retention-days: 0

# Notificaciones
notifications:
  notify-admins: true
  send-to-chat: false
```

::: tip El proveedor por defecto cambió a Anthropic
Desde esta versión, el valor por defecto es **Anthropic Claude** (`provider: "anthropic"`, modelo `Sonnet`), no Google Gemini. Gemini y cualquier endpoint compatible con OpenAI siguen totalmente soportados — consulta [Fyrx — Tu Asistente de IA](/es/solver/fyrx-ai) para cambiar.
:::

### Tabla de Opciones — Diagnóstico

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `localization` | String | `en_US` | Idioma para las respuestas de IA de Fyrx y los mensajes en el juego. |
| `check-crash-on-startup` | Boolean | `true` | Escanear `crash-reports/` al iniciar. |
| `monitor-console` | Boolean | `true` | Interceptar errores de consola vía Log4j. |
| `error-cooldown-minutes` | Integer | `10` | Minutos entre análisis consecutivos. |
| `show-banner` | Boolean | `true` | Mostrar banner ASCII al iniciar. |
| `ai-provider.provider` | String | `anthropic` | Proveedor de IA a usar: `anthropic`, `google`, u `other`. |
| `ai-provider.model` | String | `Sonnet` | Nombre específico del modelo para el proveedor elegido. |
| `analysis.reports-retention-days` | Integer | `0` | Días que se conservan los archivos en `reports-directory` antes de autoborrarse. `0` = para siempre. |

## Moderación de Chat

Fyrx puede leer el chat y evaluar el *contexto* de una conversación en vez de comparar contra una lista de palabras. Activar esto envía el contenido del chat al proveedor de IA configurado arriba. **Desactivado por defecto por privacidad.**

```yaml
chat-moderation:
  enabled: false
  exempt-ops: true
  buffer-size: 50
  context-window-minutes: 5
  analysis-interval-seconds: 45
  scan-mode: "bulk"          # "bulk" o "individual"
  llm-analysis-level: 2      # 0-3, ver abajo

  pre-filter:
    trigger-on-repeated-target: true
    trigger-on-caps-ratio: 0.6
    min-messages-before-trigger: 3
    urgent-score-threshold: 0.65

  action:
    mode: "alert-only"       # "alert-only", "warn-player", o "auto-action"
    severity-threshold-mute: 4
    severity-threshold-kick: 5
    mute-duration-minutes: 10
    min-confidence-to-act-alone: 85
    min-severity-to-act-alone: 4

  log-incidents-to-file: true
  log-test-results-to-console: true
  reports-retention-days: 0
```

### `llm-analysis-level` — con qué frecuencia se llama realmente a la IA

`scan-mode` decide *cómo* se llama a la IA (una llamada para toda la conversación, o una por jugador activo); `llm-analysis-level` decide *cuándo*:

| Nivel | Comportamiento |
|-------|--------|
| `0` | Nunca llama a la IA — el pre-filtro local decide por su cuenta. Funciona sin ningún proveedor de IA configurado. |
| `1` | Solo llama a la IA cuando el pre-filtro ya marcó algo sospechoso. |
| `2` (por defecto) | La IA revisa todo el chat nuevo en cada ciclo, sin importar el pre-filtro. |
| `3` | Tiempo real: cada mensaje se envía a la IA de inmediato, en vez de esperar `analysis-interval-seconds`. |

### Corroboración de múltiples señales

Un veredicto de la IA por sí solo únicamente puede disparar una sanción automática (`action.mode: "auto-action"`) cuando es **a la vez** al menos tan confiable como `min-confidence-to-act-alone` **y** al menos tan severo como `min-severity-to-act-alone`. Por debajo de ese umbral, una sanción automática también requiere al menos una señal local corroborante del pre-filtro (gritos, una palabra insultante, insistencia sobre el mismo objetivo, una ráfaga de mensajes) — de lo contrario el veredicto queda como una alerta solo para staff, para revisión manual vía `/solver moderation status` o `/solver check`.

### Tabla de Opciones — Moderación de Chat

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `chat-moderation.enabled` | Boolean | `false` | Interruptor principal. Envía el chat a tu proveedor de IA configurado cuando está activo. |
| `chat-moderation.exempt-ops` | Boolean | `true` | Los OP quedan exentos automáticamente. `solver.moderation.bypass` exime a un jugador específico sin importar este valor. |
| `chat-moderation.buffer-size` | Integer | `50` | Máximo de mensajes recientes recordados por jugador/globalmente. |
| `chat-moderation.context-window-minutes` | Integer | `5` | Ventana de tiempo del contexto enviado a la IA. |
| `chat-moderation.analysis-interval-seconds` | Integer | `45` | Cada cuánto revisa el barrido incondicional si hay chat nuevo que analizar. |
| `chat-moderation.scan-mode` | String | `bulk` | `bulk` = una llamada a la IA para toda la conversación (más barato, puede confundir quién dijo qué). `individual` = una llamada por jugador activo (sin confusión, el costo escala con los jugadores activos). |
| `chat-moderation.action.mode` | String | `alert-only` | `alert-only` solo notifica al staff. `warn-player` además avisa en privado al jugador marcado. `auto-action` además silencia/expulsa automáticamente según la severidad. |
| `chat-moderation.action.severity-threshold-mute` | Integer | `4` | Severidad (1-5) a partir de la cual `auto-action` silencia automáticamente. |
| `chat-moderation.action.severity-threshold-kick` | Integer | `5` | Severidad a partir de la cual `auto-action` expulsa en vez de silenciar. |
| `chat-moderation.action.min-confidence-to-act-alone` | Integer | `85` | Confianza (0-100) requerida para que el veredicto de la IA sancione solo, sin corroboración del pre-filtro. |
| `chat-moderation.action.min-severity-to-act-alone` | Integer | `4` | Severidad (1-5) requerida para que el veredicto de la IA sancione solo, sin corroboración del pre-filtro. |

### Tag Overrides — mapear una "situación" a una sanción específica

`severity-threshold-mute`/`severity-threshold-kick` solo llegan hasta un kick — `auto-action` nunca banea por su cuenta. `chat-moderation.action.tag-overrides` te deja forzar un tipo de sanción específico para un tag de la IA en particular, sin importar la severidad. Es la única forma de llegar a un ban/tempban automático desde la moderación de chat:

```yaml
chat-moderation:
  action:
    tag-overrides:
      THREAT:
        type: tempban
        duration: 7d
      HATE_SPEECH:
        type: tempban
        duration: 3d
      SCAM:
        type: ban
```

- Tipos válidos: `warn`, `mute`, `tempmute`, `kick`, `ban`, `tempban` (`duration` obligatoria para las variantes temp-).
- Solo se usa cuando `action.mode` es `auto-action`.
- Si un veredicto coincide con más de un tag configurado, gana el tipo configurado más severo.

### `tags.yml` — definí tus propias categorías de moderación

Las categorías que puede usar la IA (`TOXIC`, `HARASSMENT`, `THREAT`, `HATE_SPEECH`, `SCAM`, `SPAM` por defecto) viven en `plugins/Solver/tags.yml`, no hardcodeadas en el plugin. Agregá, editá o quitá un tag ahí y el prompt que se le manda a la IA se actualiza solo — sin recompilar, sin tocar código:

```yaml
tags:
  TOXIC: "Rude, insulting, or demeaning language with real malicious intent (not friendly banter between people who are fine with it)."
  HARASSMENT: "Insistent, repeated targeting of the same player, especially after they show discomfort or ask to stop."
  THREAT: "Threats of violence, real-world harm, or encouraging self-harm directed at someone."
  HATE_SPEECH: "Attacks based on race, religion, gender, sexual orientation, nationality, or similar."
  SCAM: "Attempts to defraud or phish another player (fake giveaways, asking for passwords/account info/real money)."
  SPAM: "Repetitive, advertising, or flooding messages with no other issue."
```

::: tip Las descripciones van en inglés
Viajan dentro del prompt interno que recibe la IA, así que quedan en inglés igual que el resto de ese prompt — solo el texto final que ve el staff se traduce al idioma del servidor.
:::

El nombre de cada tag que definas acá es justo lo que después usás en `chat-moderation.action.tag-overrides` de arriba. Se vuelve a aplicar automáticamente en cada `/solver reload` — no hace falta reiniciar para agregar una categoría nueva.

## Comandos Independientes

Permite que cada grupo de comandos (ver [Comandos](/es/solver/commands#comandos-independientes)) también se registre sin el prefijo `/solver` — desactiva una categoría si otro plugin instalado ya usa uno de esos nombres:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (salvo que EssentialsX esté instalado)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## CommandSpy

Relevo en vivo de cada comando ejecutado en el servidor hacia el staff que lo haya activado con `/solver commandspy` — a diferencia de un registro retrospectivo, esto se ve a medida que pasa.

```yaml
commandspy:
  enabled: true
  watch-patterns: ["*"]
  exempt-players: []
  exempt-permissions: []
```

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `commandspy.enabled` | Boolean | `true` | Interruptor principal. |
| `commandspy.watch-patterns` | Lista | `["*"]` | `"*"` vigila todos los comandos. Si no, lista nombres de comandos específicos (sin la `/` inicial) para relevar solo esos, ej. `["op", "gamemode", "give"]`. |
| `commandspy.exempt-players` | Lista | `[]` | Nombres de jugadores (sin distinguir mayúsculas) que nunca se relevan, sin importar quién esté mirando. |
| `commandspy.exempt-permissions` | Lista | `[]` | Cualquiera con uno de estos permisos tampoco se releva. |

## `/solver inspect` y `/solver enderchest`

```yaml
inspect:
  live-refresh: false
  live-refresh-interval-ticks: 10
```

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `inspect.live-refresh` | Boolean | `false` | Sigue re-capturando el inventario abierto cada pocos ticks en vez de una captura única. Esto es polling, no una actualización real por evento — Bukkit no tiene un evento de "el inventario cambió". Compartido entre `/solver inspect` y `/solver enderchest`. |
| `inspect.live-refresh-interval-ticks` | Integer | `10` | Cada cuántos ticks se refresca, cuando la opción de arriba está activa. |

## Staff Mode Toolkit

::: warning Beta
:::

```yaml
staff-mode:
  profiles: {}
  #  moderator:
  #    vanish: true
  #    freeze-immunity: true
  #    flight: true
  #    god-mode: true
  #    clear-inventory: true
  #  builder:
  #    flight: true
  vanish:
    invulnerable-while-vanished: false
    hide-from-server-list: true
  freeze:
    allowed-commands: ["msg", "tell", "r", "helpop"]
```

| Clave | Tipo | Por defecto | Descripción |
|-------|------|-------------|-------------|
| `staff-mode.profiles.<nombre>` | Sección | *(vacío)* | Perfil combinado con nombre para `/solver staffmode <nombre>` — alterna un conjunto de herramientas de staff a la vez. Cada campo es opcional y por defecto está apagado (`vanish`, `freeze-immunity`, `flight`, `god-mode`, `clear-inventory`). `clear-inventory` siempre guarda tus ítems primero y los restaura al salir del perfil. |
| `staff-mode.vanish.hide-from-server-list` | Boolean | `true` | También resta a los jugadores en vanish del contador de jugadores en la lista de servidores. |
| `staff-mode.vanish.invulnerable-while-vanished` | Boolean | `false` | Hace inmune al daño a un jugador mientras está en vanish. |
| `staff-mode.freeze.allowed-commands` | Lista | `["msg", "tell", "r", "helpop"]` | Comandos (sin la `/` inicial) que un jugador congelado puede seguir usando. El propio comando para alternar el congelamiento siempre funciona sin importar esta lista, así un staff congelado nunca queda atascado para siempre. |

`/solver vanish strict` y `solver.staffmode.vanish.see-strict` (un permiso aparte, no heredado del vanish normal) agregan un segundo nivel invisible incluso para la mayoría del staff. Un staff con `solver.staffmode.silentjoin` se conecta ya en vanish, sin mensaje de conexión.

## Sistema de Sanciones

::: warning Beta
:::

### Backend de almacenamiento

```yaml
punishments:
  storage: sqlite
  mysql:
    host: localhost
    port: 3306
    database: solver
    user: solver
    password: ""
```

`sqlite` (por defecto, sin configuración, `sanctions.db`) o `mysql` para instalaciones multi-servidor que comparten una misma base de datos de sanciones — mismos comandos, mismos datos en cualquier caso. El historial de sanciones y los mutes/bans activos se restauran automáticamente al conectarse o al reiniciar el servidor sin importar qué backend uses.

### Plantillas de razón y escalado de warns

```yaml
punishments:
  reason-templates: {}
  #  griefing:
  #    text: "Griefing / destruir construcciones de otros jugadores"
  #    duration: "1d"
  warn-escalation: {}
  #  "3":
  #    action: sanction
  #    type: kick
  #    reason: "Auto: 3 advertencias"
  #  "5":
  #    action: sanction
  #    type: tempban
  #    duration: "1d"
  #    reason: "Auto: 5 advertencias"
```

- **`reason-templates`** — `/solver ban Jugador #griefing` expande `#griefing` al `text` configurado (y a la `duration`, si el tipo de sanción la necesita y no se dio una explícita). Un `#nombre` sin plantilla que coincida se deja como razón literal, así que esto nunca rompe una razón que legítimamente empiece con `#`.
- **`warn-escalation`** — tras registrar un `WARN`, si el conteo total de warns del jugador coincide con una clave de acá, se dispara automáticamente la acción configurada: `action: sanction` aplica otra sanción (mismos campos `type`/`reason`/`duration` que una manual), `action: command` corre un comando de consola en su lugar (`{player}` se reemplaza por el nombre del jugador).

### Apelaciones

```yaml
punishments:
  appeals:
    show-in-sanction-message: true
```

Muestra una línea que apunta a `/solver appeal <id> <razón>` en los mensajes de warn/mute/kick/ban, completamente dentro del juego — sin webhook de Discord. El staff recibe una notificación inmediata cuando llega una apelación nueva, igual que ya pasa con un reporte nuevo.

## Estadísticas de Uso

```yaml
metrics:
  enabled: true
```

Estadísticas de uso anónimas vía [bStats](https://bstats.org/plugin/bukkit/Solver/33362) — cantidad de servers, qué proveedor de IA está configurado, qué features están activas. Nada identificable por jugador. Poné `metrics.enabled: false` para desactivarlo, independiente del interruptor global de bStats en `plugins/bStats/config.yml` (que también aplica siempre).

## Relay de Proxy

::: warning Requiere un plugin separado en el proxy
Esta sección solo configura el lado de Bukkit. No hace nada a menos que también esté instalado el plugin de proxy correspondiente — ver [Relay de Proxy](/es/solver/proxy-relay) para la configuración completa.
:::

```yaml
proxy-relay:
  enabled: false
```

Desactivado por defecto. Cuando está activo, retransmite mensajes de staffchat y alertas de moderación/integridad al staff conectado en cualquier backend de la misma red BungeeCord/Waterfall/Velocity, no solo al que originó la alerta.

## Idiomas Soportados

| Código | Idioma |
|--------|--------|
| `en_US` | Inglés (Estados Unidos) |
| `es_ES` | Español (España) |
| `pt_BR` | Portugués (Brasil) |
| `de_DE` | Alemán |
| `fr_FR` | Francés |
| `ru_RU` | Ruso |
| `ja_JP` | Japonés |
| `ko_KR` | Coreano |
| `eo_EO` | Esperanto |

Cada mensaje visible para jugadores/staff (ayuda, errores, sanciones, alertas de moderación) vive en `plugins/Solver/lang/<idioma>/messages.yml` con soporte completo de [MiniMessage](https://docs.papermc.io/adventure/minimessage/format), y es seguro de editar — tus personalizaciones se conservan entre actualizaciones.

## Usando Otros Proveedores de IA

### Google Gemini

```yaml
ai-provider:
  provider: "google"
  model: "Flash"
  google-key: "AIza..."
```

### OpenAI o cualquier API Compatible

```yaml
ai-provider:
  provider: "other"
  model: "gpt-4o"
  other-key: "sk-..."
  other-url: "https://api.openai.com/v1/chat/completions"
```

Esto también funciona con modelos locales como **Ollama** o **LM Studio**, apuntando `other-url` a su endpoint local.
