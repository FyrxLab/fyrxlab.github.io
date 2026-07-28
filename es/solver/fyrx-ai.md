# Fyrx — Tu Asistente de IA

Fyrx es el cerebro de inteligencia artificial de AbsoluteSolver. Actúa como un administrador de servidor siempre activo que monitorea tu servidor de Minecraft, intercepta errores y proporciona diagnósticos claros y legibles automáticamente.

## ¿Qué es Fyrx?

Cuando tu servidor encuentra un problema — ya sea una excepción de plugin, un crash o un pico de lag — Fyrx:

1. **Captura** el contexto completo del error (stack trace, estado del hilo, historial de logs)
2. **Envía** los datos a Google Gemini (o tu proveedor de IA configurado)
3. **Retorna** un informe de diagnóstico estructurado y formateado directamente en tu consola

Obtienes una explicación en español de qué ocurrió, qué plugin lo causó y qué debes hacer a continuación — sin tener que leer ni una línea de Java.

## Proveedores de IA Soportados

Fyrx es compatible con múltiples proveedores. Puedes usar cualquiera de los siguientes:

| Proveedor | Modelos | Notas |
|-----------|---------|-------|
| **Anthropic** | Sonnet, Haiku, Opus | Proveedor por defecto desde esta versión. Razonamiento de alta calidad. |
| **Google Gemini** | Pro, Flash | Nivel gratuito disponible. |
| **OpenAI / Compatible** | `gpt-4o`, `gpt-4-turbo`, etc. | Funciona con cualquier endpoint compatible con OpenAI, incluyendo modelos locales. |

## Formato de Respuesta

Fyrx formatea sus respuestas usando códigos de color nativos de Minecraft directamente en tu consola:

```
╔══════════════════════════════════════════════════════════╗
║       ANÁLISIS DE ERROR - FYRX                          ║
╚══════════════════════════════════════════════════════════╝

### 1. Causa Raíz
El error es una NullPointerException lanzada en el
manejador PlayerJoinEvent del PluginX en PlayerListener.java:47.

### 2. Causa más probable
PluginX intenta acceder a datos del jugador antes de que
hayan sido cargados desde la base de datos.

### 3. Acción recomendada
Actualiza PluginX a la versión 2.3.1+ que corrige este problema.
════════════════════════════════════════════════════════════
```

## Rendimiento

Fyrx está diseñado para tener **cero impacto en los TPS del servidor**. Todas las solicitudes de IA se realizan en hilos secundarios usando `CompletableFuture`. Tu servidor nunca se pausará ni ralentizará mientras Fyrx analiza un error.
