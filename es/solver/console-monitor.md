# Monitor de Consola

El Monitor de Consola es un interceptor de errores en tiempo real inyectado directamente en el motor de logging **Log4j** del servidor. Captura los errores en el instante en que son escritos en la consola.

## Cómo Funciona

AbsoluteSolver registra un `Appender de Log4j` personalizado al arrancar. Este appender escucha cada evento de log y filtra por:

- Líneas en nivel `ERROR` o `FATAL`
- Líneas en nivel `WARN` que tengan una excepción Java adjunta (`Throwable`)

Cuando se detecta un error, se añade a un buffer interno. Tras una **ventana de lote** configurable (por defecto: 10 segundos), los errores acumulados se envían juntos a Fyrx para su análisis.

## Configuración

```yaml
monitor-console: true           # Activar/desactivar el monitor
error-cooldown-minutes: 10      # Minutos mínimos entre análisis
```

## Sistema de Lotes

En lugar de enviar cada error individualmente, el Monitor de Consola usa un **sistema de lotes**:

1. Los errores se acumulan en una cola (máximo 100 entradas)
2. Tras 10 segundos, los últimos 50 errores se agrupan en un único prompt
3. Fyrx analiza el lote completo e identifica patrones entre múltiples errores

Este enfoque es especialmente efectivo durante fallos en cascada de plugins, donde muchos plugins lanzan errores simultáneamente debido a una única causa raíz.

## Tiempo de Espera (Cooldown)

Para proteger contra los límites de velocidad de las capas gratuitas de API, se aplica un cooldown global entre análisis. El valor por defecto es **10 minutos** y es configurable en `config.yml`.

## Errores de Inicio Temprano

Un sistema separado maneja los errores que ocurren *antes* de que AbsoluteSolver termine de cargarse. Consulta [Detección de Errores de Inicio Temprano](/es/solver/crash-analysis#deteccion-de-errores-de-inicio-temprano) para más detalles.
