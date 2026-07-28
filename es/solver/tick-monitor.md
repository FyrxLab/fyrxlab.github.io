# Monitor de Ticks

El Monitor de Ticks es un hilo ligero de fondo que vigila continuamente la salud del **hilo principal** de tu servidor. Si el servidor se congela, entra en deadlock o sufre un pico severo de lag, Fyrx lo detectará automáticamente.

## Cómo Funciona

**1. Tarea de Latido (Hilo Principal)**
Una tarea síncrona de Bukkit se ejecuta una vez por tick (20 veces por segundo) en el hilo principal. Cada vez que se ejecuta, actualiza un timestamp `lastTickTime`.

**2. Hilo Vigilante (Segundo plano)**
Un hilo Java separado comprueba el `lastTickTime` cada segundo. Si el timestamp no ha sido actualizado durante más de **15 segundos**, concluye que el hilo principal está congelado.

## Detección de Congelamiento

Cuando se detecta un congelamiento:

1. El monitor captura el **StackTrace completo** del hilo principal (hasta 30 frames)
2. Captura el **estado del hilo** (BLOCKED, WAITING, etc.)
3. Estos datos se envían a Fyrx de forma asíncrona
4. Fyrx identifica qué plugin, manejador de eventos o código está bloqueando el hilo principal

## Compatibilidad con Folia

::: warning Folia
El Monitor de Ticks es **desactivado automáticamente** en servidores Folia. Folia usa una arquitectura regional multihilo donde no existe un único "hilo principal", haciendo imposible el monitoreo de TPS con este método. Folia tiene su propio Watchdog regional integrado.

Cuando AbsoluteSolver detecta Folia, verás este mensaje:
```
[AbsoluteSolver] Servidor Folia detectado: TickMonitor deshabilitado.
```
:::

## Prueba

Puedes probar el Monitor de Ticks de forma segura usando el comando de crash test integrado (solo OP):

```
/absolutesolver crashme deadlock
```

Este comando llama a `Thread.sleep(20000)` en el hilo principal, simulando un congelamiento de 20 segundos. Fyrx lo detectará a los 15 segundos y generará un informe diagnóstico.

::: danger Advertencia
El crash test `deadlock` dejará tu servidor sin respuesta por 20 segundos. El Watchdog propio de Paper/Purpur también se activará e imprimirá un dump de hilos. Esto es comportamiento esperado.
:::
