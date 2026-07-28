# Análisis de Crashes

AbsoluteSolver proporciona tres sistemas distintos de análisis de crashes que trabajan juntos para asegurar que, sin importar *cómo* murió tu servidor, Fyrx estará ahí para explicarlo.

## Análisis Post-Mortem (Escaneo al Inicio)

Cuando tu servidor inicia, AbsoluteSolver escanea la carpeta `crash-reports/` en busca de nuevos reportes.

**Tipos de reportes soportados:**

| Tipo | Origen | Descripción |
|------|--------|-------------|
| Reporte de Crash de Minecraft | `crash-reports/*.txt` | Crashes estándar de Minecraft/Paper |
| Crash Nativo de JVM | `hs_err_pid*.log` | Errores fatales de la JVM (SIGSEGV, fallos JNI, corrupción de memoria) |

::: info Crashes Nativos de JVM
Un archivo `hs_err_pid` se genera cuando Java mismo colapsa — no solo Minecraft. Estos crashes suelen ser causados por una librería nativa rota (como un driver de GPU), corrupción de memoria, o una llamada JNI defectuosa.
:::

## Detección de Errores de Inicio Temprano {#deteccion-de-errores-de-inicio-temprano}

Este sistema captura errores que ocurren *después* de que la JVM arranca pero *antes* de que el `onEnable` de AbsoluteSolver se ejecute. Causas comunes:

- Incompatibilidades de versión entre plugins
- Dependencias faltantes
- Conflictos de carga de clases

**Ejemplo de lo que puede detectar:**

```
[ServerMain/ERROR]: Could not load 'plugins/MiPlugin.jar' in folder 'plugins'
org.bukkit.plugin.InvalidPluginException: Unsupported API version 1.21
```

## Análisis Manual

Puedes activar un análisis manual del reporte de crash más reciente en cualquier momento:

```
/absolutesolver analyze-last
```

## Configuración

```yaml
check-crash-on-startup: true    # Activar escaneo post-mortem al iniciar
monitor-console: true           # Activar detección de errores de inicio temprano
```
