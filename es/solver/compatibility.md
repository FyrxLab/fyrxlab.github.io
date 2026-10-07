# Compatibilidad

## Software de Servidor

| Loader | Compatible | Notas |
|--------|-----------|-------|
| **Paper** | ✅ Recomendado | Totalmente compatible. Mejor integración con Log4j. |
| **Purpur** | ✅ Recomendado | Totalmente compatible y probado. |
| **Spigot** | ✅ Compatible (1.8.8+) | Totalmente compatible, incluyendo la [Moderación de Chat con IA](/es/solver/fyrx-ai) — no hace falta Paper. |
| **CraftBukkit** | ✅ Compatible (1.8.8+) | Mismo nivel de soporte que Spigot. |
| **Folia** | ✅ Compatible | El TickMonitor se desactiva automáticamente (Folia tiene su propio watchdog). El resto de funciones funcionan con normalidad. |
| **Velocity** | ✅ Funciones de proxy | El mismo `Solver.jar`: relay, AntiVPN para toda la red y verificación de integridad. Ver [Redes con Proxy](/es/solver/proxy-relay). |
| **BungeeCord** | ✅ Funciones de proxy | Mismo jar, mismas funciones de proxy. Ver [Redes con Proxy](/es/solver/proxy-relay). |
| **Waterfall** | ✅ Funciones de proxy | Mismo jar, mismas funciones de proxy. Ver [Redes con Proxy](/es/solver/proxy-relay). |
| **Forge / Fabric** | ❌ No soportado | Cargadores de mods; no usan la API de Bukkit. |
| **Sponge** | ❌ No soportado | Usa la SpongeAPI, no Bukkit. |

::: tip Soporte para Folia
AbsoluteSolver es **Folia-Aware** (consciente de Folia). Al ejecutarse en un servidor Folia, el plugin detecta automáticamente el entorno multihilo y desactiva el TickMonitor para evitar conflictos, ya que Folia tiene su propio sistema de Watchdog regional. Todas las demás funciones de diagnóstico (monitoreo de consola, análisis de crashes, post-mortem) siguen funcionando perfectamente.
:::

## Versiones de Minecraft

| Versión | Estado | Notas |
|---------|--------|-------|
| 26.1 – 26.3 | ✅ Compatible | La nueva numeración de versiones de Mojang. Probado en Paper 26.3 (Java 25). |
| 1.21.x | ✅ Compatible | Funciona en Java 21, totalmente compatible. |
| 1.20.x | ✅ Compatible | Objetivo principal de desarrollo. Totalmente probado. |
| 1.13.x – 1.19.x | ✅ Compatible | |
| 1.8.8 – 1.12.x | ✅ Compatible | Versión mínima soportada. Algunas comodidades exclusivas de Paper (ej. ocultar a un jugador vanish del conteo en la lista de servidores) no están disponibles acá — no hay equivalente vanilla — pero el resto de las funciones son idénticas. |
| 1.7.10 e inferior | ❌ Todavía no soportado | Planeado, pero todavía no compilable/disponible. |

## Versión de Java

Solver está compilado para **Java 8**. Funcionará en cualquier JVM versión 8 o superior (incluyendo Java 17/21).

::: tip Java 8 o Superior
Solver funciona desde Java 8 en adelante — no hace falta actualizar el entorno de Java de tu servidor para usarlo.
:::
