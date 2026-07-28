# Banners de Imagen 1.21.9+

A partir de Minecraft 1.21.9, la lista de servidores multijugador soporta la visualización de gráficos personalizados grandes en lugar de solo el icono estándar del servidor y dos líneas de texto.

**SolverMOTD** es totalmente compatible con esta función a través de un sistema automatizado de conversión de imágenes a skins.

## Cómo funciona

Cuando proporcionas una imagen PNG de `264x16`, SolverMOTD la corta automáticamente en 66 skins de jugador separadas. Luego, sube estas skins a [MineSkin](https://mineskin.org/) en segundo plano.

Una vez subidas, el plugin almacena los datos de las texturas en un archivo `banner_cache.json`. Cuando un jugador con Minecraft 1.21.9 o superior hace ping a tu servidor, el plugin construye dinámicamente el banner utilizando esas texturas de skin.

> [!WARNING]
> El proceso inicial de subida puede tardar varios minutos debido a los límites de la API de MineSkin. Esto solo ocurre **una vez** cuando habilitas el banner por primera vez o cambias la imagen.

## Instrucciones de Configuración

1. Crea una imagen PNG que tenga exactamente **264 píxeles de ancho por 16 píxeles de alto**.
2. Coloca la imagen (por ejemplo, `banner.png`) dentro de tu carpeta `plugins/SolverMOTD/`.
3. Abre `config.yml` y habilita la función del banner:

```yaml
banner:
  enabled: true
  file: "banner.png"
  # Fallback que se muestra a los jugadores en versiones anteriores a la 1.21.9.
  fallback-line1: "      &o! &lSolverMotd &o!"
  fallback-line2: "         &a¡Echa un vistazo a nuestro nuevo servidor!"
```

4. Reinicia tu servidor o ejecuta `/smotd reload`.
5. Espera a que el plugin procese y suba los mosaicos (tiles). Verás el progreso en la consola de tu servidor.
6. Una vez completado, tu servidor mostrará el banner masivo a todos los clientes actualizados.
