# Compatibilidad

## Software de Servidor

| Loader | Compatible | Notas |
|--------|-----------|-------|
| **Paper** | ✅ Recomendado | Totalmente compatible. Mejor integración con Log4j. |
| **Purpur** | ✅ Recomendado | Totalmente compatible y probado. |
| **Spigot** | ✅ Compatible (1.8.8+) | Totalmente compatible, incluyendo la [Moderación de Chat con IA](/es/solver/fyrx-ai) — no hace falta Paper. |
| **CraftBukkit** | ✅ Compatible (1.8.8+) | Mismo nivel de soporte que Spigot. |
| **Folia** | ✅ Compatible | El TickMonitor se desactiva automáticamente (Folia tiene su propio watchdog). El resto de funciones funcionan con normalidad. |
| **Velocity** | ⚠️ Parcial (solo relay) | No es un destino de instalación de Solver — un plugin chico y separado retransmite staffchat/alertas entre tus backends. Ver [Relay de Proxy](/es/solver/proxy-relay). |
| **BungeeCord** | ⚠️ Parcial (solo relay) | Mismo plugin de relay que Waterfall. Ver [Relay de Proxy](/es/solver/proxy-relay). |
| **Waterfall** | ⚠️ Parcial (solo relay) | Mismo plugin de relay que BungeeCord. Ver [Relay de Proxy](/es/solver/proxy-relay). |
| **Forge / Fabric** | ❌ No soportado | Cargadores de mods; no usan la API de Bukkit. |
| **Sponge** | ❌ No soportado | Usa la SpongeAPI, no Bukkit. |

::: tip Soporte para Folia
AbsoluteSolver es **Folia-Aware** (consciente de Folia). Al ejecutarse en un servidor Folia, el plugin detecta automáticamente el entorno multihilo y desactiva el TickMonitor para evitar conflictos, ya que Folia tiene su propio sistema de Watchdog regional. Todas las demás funciones de diagnóstico (monitoreo de consola, análisis de crashes, post-mortem) siguen funcionando perfectamente.
:::

## Versiones de Minecraft

| Versión | Estado | Notas |
|---------|--------|-------|
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
