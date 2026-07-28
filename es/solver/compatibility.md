# Compatibilidad

## Software de Servidor

| Loader | Compatible | Notas |
|--------|-----------|-------|
| **Paper** | ✅ Recomendado | Totalmente compatible. Mejor integración con Log4j. |
| **Purpur** | ✅ Recomendado | Totalmente compatible y probado. |
| **Spigot** | ⚠️ Solo diagnóstico | El análisis de crashes, el monitor de consola y el Monitor de Ticks funcionan. La [Moderación de Chat con IA](/es/solver/fyrx-ai) requiere `AsyncChatEvent` de Paper y **no está disponible en Spigot puro** — está en el roadmap. |
| **Bukkit** | ⚠️ Parcial | Funcionalidad básica únicamente; no soportado oficialmente. |
| **Folia** | ✅ Compatible | El TickMonitor se desactiva automáticamente (Folia tiene su propio watchdog). El resto de funciones funcionan con normalidad. |
| **Velocity** | ❌ No soportado | Software proxy; usa una API completamente diferente. |
| **BungeeCord** | ❌ No soportado | Software proxy; usa una API completamente diferente. |
| **Waterfall** | ❌ No soportado | Software proxy; usa una API completamente diferente. |
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
| 1.19.x | ✅ Compatible | |
| 1.18.x | ✅ Compatible | Versión mínima soportada (primera versión que requiere Java 17). |
| 1.17.x e inferior | ❌ No soportado | Estas versiones usan Java 8/11; AbsoluteSolver requiere Java 17+. |

## Versión de Java

AbsoluteSolver está compilado para **Java 17**. Funcionará en cualquier JVM versión 17 o superior (incluyendo Java 21+).

::: danger Java 17 Requerido
Si tu servidor usa Java 8 o Java 11, intentar cargar AbsoluteSolver producirá un `UnsupportedClassVersionError`. Debes actualizar tu entorno de Java primero.
:::
