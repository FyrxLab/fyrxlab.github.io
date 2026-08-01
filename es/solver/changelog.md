# Changelog

## v0.9.1 — Soporte Spigot/CraftBukkit, hasta 1.8.8

> Publicado: 2026

Solver ahora corre en Spigot/CraftBukkit plano, no solo en Paper/Folia — hasta 1.8.8. Todas las features funcionan igual en todos lados, con un respaldo apropiado donde una API exclusiva de Paper no existe.

### Novedades

- **Soporte Spigot/CraftBukkit, desde 1.8.8** — Solver ya no requiere Paper. Moderación de chat, sanciones, el Staff Mode Toolkit y todas las GUIs funcionan igual en Spigot plano.
- **Requisito de Java más bajo: Java 8 o superior** (antes Java 17).

### Correcciones

- Corregido: el almacenamiento de sanciones (SQLite) podía fallar al inicializarse en algunas instalaciones, por un problema de registro del driver específico de cómo Bukkit carga los jars de plugins.

### Compatibilidad

- Paper, Purpur, Spigot, CraftBukkit, Folia
- Minecraft 1.8.8 — 1.21.x (1.7.10 está planeado pero todavía no disponible)
- Java 8+

## v0.9.0 — Backend de FyrxLab, parte 1: Verificación de Build y Escaneo de Malware

> Publicado: Julio 2026

Solver ahora puede verificar su propio jar y escanear plugins con malware conocido. Ambos estáticos, firmados y cacheados — todavía sin backend dinámico.

### Novedades

- **Verificación de integridad del build** — Solver chequea su propio jar contra un hash firmado publicado por FyrxLab. Consultalo en cualquier momento con `/solver integrity`, o forzá un chequeo inmediato con `/solver integrity rescan`.
- **Escaneo de malware** — cada otro `.jar` en `plugins/` se chequea contra una lista firmada de hashes de malware conocido.
- **Cruce opcional con Modrinth** para plugins no marcados — puramente informativo, nunca una alerta por sí solo.
- **Detección de Java agents** — avisa al arrancar si se adjuntó un Java agent a la JVM del servidor, ya que un agent puede parchear clases en memoria sin tocar el archivo jar en disco.

### Correcciones

- `/solver rtp` podía ocasionalmente teletransportar a quien corrió el comando a sí mismo en vez de a otro jugador.

## v0.8.0 — La Alternativa Completa de Moderación/Staff

> Publicado: Julio 2026

Solver pasa a ser una alternativa completa de moderación/staff, no solo moderación de chat con IA — detección de cuentas alternativas, soporte MySQL, apelaciones dentro del juego, un sistema completo de reportes de staff, y un Staff Mode Toolkit mucho más profundo.

### Novedades

- **Detección real de cuentas alternativas** — `/solver checkuser <jugador>` cruza el historial de IP entre todas las cuentas; un ban ahora expulsa al instante a un alt ya conectado, no solo bloquea futuros logins.
- **Apelaciones de sanción dentro del juego** — `/solver appeal <id> <razón>`, sin necesidad de Discord; el staff recibe una notificación y revisa con `/solver appeal list|accept|reject`.
- **GUI `/solver sanctions <jugador>`** — navegá el historial de un jugador, click en una sanción activa para el comando exacto de revocarla.
- **Plantillas de razón y escalado automático de warns** — atajos tipo `#griefing` y auto-kick/tempban tras la advertencia N de un jugador.
- **Backend de almacenamiento MySQL opcional** para instalaciones multi-servidor, junto al SQLite por defecto sin configuración.
- **Un sistema completo de Reportes de Staff** — `/solver report`/`reports`, con su propia GUI, totalmente separado de las sanciones.
- **CommandSpy** — un relevo en vivo de los comandos de otros jugadores, no solo un registro retrospectivo.
- **Perfiles combinados de Staff Mode** — `/solver staffmode <perfil>` agrupa vanish/inmunidad-al-freeze/vuelo/modo-dios/vaciado-de-inventario.
- **Vanish de dos niveles + invulnerabilidad opcional**, entrada silenciosa, y un canal de chat privado para hablar con un jugador congelado durante un screenshare.
- **`/solver inspect`/`enderchest`** — ver *y confiscar* el inventario/enderchest de un jugador sin abrirlo.
- **`/solver fly`/`god`/`rtp`** para vuelo, invulnerabilidad y teletransportes de supervisión independientes.
- **Las categorías de moderación de chat ahora las definís vos** (`tags.yml`), y `chat-moderation.action.tag-overrides` mapea cualquier tag directo a un tipo de sanción — la única forma de llegar a un ban automático desde la moderación de chat.

### Correcciones

- Corregido: la moderación de chat podía marcar un mensaje completamente normal como tóxico/spam — un mensaje ya juzgado inofensivo nunca se sacaba del buffer de contexto, así que recibía un veredicto nuevo e independiente en cada ciclo. El texto ya revisado ahora es solo contexto de fondo, nunca se vuelve a juzgar desde cero.
- Corregido: las entradas agregadas a mano en `reason-templates`/`warn-escalation`/`staff-mode.profiles` podían borrarse silenciosamente de `config.yml` en un reload o reinicio.
- Corregido: `/solver god` no bloqueaba de forma confiable el daño de PvP.
- Corregido: una razón de sanción larga se salía de la pantalla de desconexión de kick/ban y del tooltip de la GUI de sanciones — ahora se ajusta en párrafo.
- Corregido: un `KICK` aparecía como "activo" en `/solver history`/`check` — es una expulsión instantánea, ahora se muestra como "ejecutado".

## v0.7.2 — Staff Mode Toolkit y Moderación más Inteligente

> Publicado: 2026

La moderación de chat deja de confiar en una sola llamada a la IA, los comandos de staff se escriben más rápido, y una primera pieza del próximo hito se lanza como experimental.

### Novedades

- **Staff Mode Toolkit (Experimental)** — `/solver vanish`, `/solver freeze <jugador>`, y `/solver staffchat`, todos también disponibles como comandos independientes (`/vanish`, `/freeze`, `/staffchat`).
- **Permisos granulares, compatibles con LuckPerms** — cada subcomando de `/solver` ahora tiene su propio nodo de permiso, agrupados bajo `solver.diagnostics.*`, `solver.sanctions.*`, y `solver.staffmode.*`. `solver.admin` sigue otorgando todo.
- **Comandos independientes** — `/vanish`, `/mute`, `/ban`, `/moderation`, y más ahora funcionan directamente sin el prefijo `/solver`. Desactiva una categoría entera en `config.yml` si otro plugin ya usa esos nombres.
- **Corroboración de múltiples señales para la moderación de chat** — una sanción automática ahora necesita que el veredicto de la IA sea a la vez suficientemente confiable y severo, *o* que esté respaldado por una señal local independiente. De lo contrario, se queda como una alerta solo para staff.
- **4 niveles configurables de `llm-analysis-level`** — desde `0` (nunca llamar a la IA, solo filtro local) hasta `3` (tiempo real, cada mensaje).

### Correcciones

- Corregido: reconectarse estando congelado usaba un teletransporte síncrono que el modelo de hilos regionales de Folia rechaza — se cambió a la API de teletransporte asíncrona.
- Corregido: al reporte de incidente de moderación guardado le faltaba el valor de confianza de la IA.
- Corregido: la moderación de chat volvía a sancionar el mismo mensaje ya juzgado durante un escaneo en bulk muy activo.
- Corregido: el estado de mute vivía solo en memoria — un reinicio ya no levanta silenciosamente un mute activo antes de tiempo; ahora se restaura desde `sanctions.db` al conectarse, igual que los bans.
- Se limpiaron comentarios de `config.yml` que se habían filtrado con lenguaje de desarrollo interno.

## v0.7.1 — Parche de Corrección de Errores

> Publicado: 2026

Sin funciones nuevas — cinco errores reales encontrados mediante auditoría de código justo después del lanzamiento de 0.7.0, todos corregidos aquí.

- Corregido: `config.yml` perdía sus comentarios explicativos en cada reinicio, incluso cuando no había nada que actualizar.
- Corregido: `/solver tempmute` con una duración menor a un minuto (ej. `30s`) no hacía nada silenciosamente.
- Corregido: un error de límite de velocidad que podía hacer que las funciones con IA se bloquearan brevemente entre sí al compartir la misma clave API.
- Corregido: algunas llamadas internas a la API de Bukkit en la moderación de chat y los comandos de sanciones se ejecutaban fuera del hilo correcto — reforzado para seguridad en Folia, y los comandos de sanciones ya no se bloquean por E/S de base de datos.

## v0.7.0 — Sanciones, Mensajes Personalizados y Moderación más Inteligente

> Publicado: 2026

Un sistema real de warn/mute/kick/ban, cada mensaje visible para el jugador ahora personalizable, y los veredictos de moderación de Fyrx vienen con un puntaje de confianza en vez de un simple sí/no.

### Novedades

- **Nuevo `messages.yml`** — cada mensaje visible para jugadores/staff ahora es configurable con soporte completo de MiniMessage, en tu propia carpeta de idioma (`lang/<idioma>/messages.yml`).
- **Nuevo Sistema de Sanciones (BETA)** — `/solver warn|mute|tempmute|kick|ban|tempban <jugador> [duración] <razón>`, además de `unban|unmute|unwarn`, `history <jugador>`, `check <id>`, y `note <jugador> <texto>`. Cada sanción recibe un ID real y persiste en `sanctions.db`.
- **Los bans ahora se aplican de verdad** — reconectarse estando baneado se rechaza en el login, no solo con una expulsión puntual.
- **Los mutes siempre funcionan** — incluso con la moderación de chat de IA desactivada, `/solver mute` bloquea el chat de verdad.
- **Medidor de Confianza** — cada veredicto de moderación muestra qué tan *seguro* está Fyrx (0-100%), separado de la severidad. Visible en las alertas de staff y en `/solver moderation test`/`status`.
- **`/solver moderation status` muestra una cuenta regresiva** al próximo escaneo automático de chat.
- **Soporte de PlaceholderAPI (BETA)** — `%solver_muted%`, `%solver_warns%`, `%solver_active_sanctions%`, y más.
- **`config.yml`/`messages.yml` ya no quedan desactualizados** — las opciones nuevas se combinan automáticamente.
- **Moderación de Chat con IA, fuera de beta** — el staff/administradores pueden quedar exentos, localización completa en los 9 idiomas, y veredictos por categoría y por infractor en vez de una sola palabra adivinada.
- **`/solver crashme dry-run`** — ejecuta todo el pipeline de diagnóstico de crashes con un reporte sintético, sin una excepción/cuelgue/OOM real.

### Compatibilidad

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

## v0.5.0 — Lanzamiento Inicial

> Publicado: Julio 2026

Esta es la primera versión pública estable de **AbsoluteSolver**. Presenta a **Fyrx**, tu administrador de servidor potenciado por IA.

### Novedades

- **Integración con Gemini AI** — Totalmente integrado con el modelo `gemini-3-flash-preview` de Google.
- **Monitor de Consola en Vivo** — Inyectado directamente en Log4j para interceptar excepciones `ERROR` y `WARN` en tiempo real.
- **Análisis Post-Mortem** — Escanea automáticamente `crash-reports/` al iniciar.
- **Soporte para Crashes Nativos de JVM** — Detecta y analiza archivos `hs_err_pid.log` de crasheos fatales de JVM.
- **Detección de Errores de Inicio Temprano** — Lee `logs/latest.log` al arrancar para capturar errores de dependencias antes de cargar.
- **Monitor de Ticks** — Hilo de fondo ligero que detecta congelamientos y deadlocks del servidor.
- **Soporte para Folia** — El plugin detecta Folia automáticamente y desactiva el TickMonitor de forma elegante.
- **Interfaz de Consola Hermosa** — Banner ASCII al inicio y respuestas de IA formateadas con códigos de color de Minecraft.
- **Soporte Multi-Proveedor** — Compatible con Google Gemini, Anthropic Claude y cualquier API compatible con OpenAI.
- **Herramientas de Diagnóstico** — `/absolutesolver crashme <exception|deadlock|oom>` para pruebas seguras.
- **100% Asíncrono** — Cero impacto en los TPS del servidor.

### Compatibilidad

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

---

*Hecho con ❤️ por FyrxLab*
