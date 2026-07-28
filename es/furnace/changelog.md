# Historial de Cambios (Changelog)

Todos los cambios notables en el mod **Absolute Furnace** se documentarán aquí.

## v1.2.7 (NeoForge 26.2)
- Port de Absolute Furnace a NeoForge 26.2.

## v1.2.6 (Forge 1.20.1)
*Absolute Furnace 1.2.6 está aquí, y esta vez es una actualización de correcciones: el horno estaba fundiendo mucho menos de lo que debería, así que lo rastreamos y lo arreglamos.*

* **[Corrección de Error]** Se corrigió un error importante donde la GUI y su fundición automática nunca leían el inventario real del bloque. Cargar combustible y menas manualmente nunca fundía nada por sí solo (antes solo funcionaba la automatización con tolvas/tuberías).
* **[Optimización]** Se optimizó la lógica de ticks del horno para resolver su inventario una vez por tick en lugar de una vez por acceso a cada slot.
* **[Limpieza]** Se eliminó código muerto sobrante de la antigua GUI y el procedimiento de tick generados por MCreator.

*Con amor, de jeamcube.*
