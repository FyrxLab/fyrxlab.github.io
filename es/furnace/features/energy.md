# Sistema Absolute Energy

A diferencia de un horno normal que rastrea el tiempo de quemado de forma incremental, **Absolute Furnace** funciona con un sistema de energía unificado llamado **Absolute Energy**.

## Generación de Energía
Cada vez que colocas un ítem quemable válido de Minecraft (como Carbón, Carbón Vegetal o Madera) en cualquiera de los 6 slots de Entrada de Energía, el horno verifica instantáneamente si hay espacio para almacenar la energía resultante.

Si hay espacio, el combustible se consume y se convierte en ítems de **Absolute Energy**, que se almacenan directamente en los slots de energía.

## Tasa de Consumo
El proceso de fundición está completamente estandarizado:
* **Costo:** Exactamente `2 Absolute Energy` por ítem fundido.
* **Velocidad:** Instantánea por tick, limitada solo por la disponibilidad de combustible y materiales de entrada.

> [!NOTE]
> Debido a que convierte el combustible en ítems tangibles de Absolute Energy, verás que Absolute Energy se apila hasta 64 en los slots de energía. Esto permite que el horno almacene una cantidad masiva de poder de fundición potencial, listo para desatarse en el momento en que se insertan los minerales.
