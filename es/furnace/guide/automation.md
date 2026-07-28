# Automatización y Slots

Una de las características más poderosas de **Absolute Furnace** es su capacidad para integrarse sin problemas en sistemas automatizados usando tolvas, tuberías o cualquier otro sistema de logística de mods.

## Disposición de Slots y Lados de Acceso
El horno expone slots específicos dependiendo de con qué cara del bloque interactúes. Esto hace que la automatización con tolvas sea directa:

* **Cara Superior (Slots 0-5):** Solo acepta ítems en los slots de **Entrada de Materiales**. Usa esto para introducir menas o comida.
* **Caras Laterales (Norte, Sur, Este, Oeste) (Slots 6-11):** Solo acepta ítems en los slots de **Entrada de Energía**. Usa estas caras para introducir carbón, madera u otros combustibles.
* **Cara Inferior (Slots 12-17):** Solo extrae ítems de los slots de **Salida de Materiales**. Usa esto para sacar tus lingotes recién fundidos.

> [!TIP]
> Debido a que hay 6 slots para cada categoría, puedes conectar múltiples tolvas o tuberías de alto nivel para insertar y extraer ítems rápidamente sin crear un cuello de botella.

## Enrutamiento Interno
Absolute Furnace buscará automáticamente el primer slot disponible cuando se inserten ítems y apilará de manera inteligente las salidas idénticas para maximizar sus 6 slots de salida.
