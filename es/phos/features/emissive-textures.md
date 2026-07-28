# Texturas Emisivas

## Visión General
Las menas de Fosfofilita soportan texturas emisivas (que brillan en la oscuridad) cuando se usan junto a OptiFine o paquetes de shaders.

## Archivos
- **Texturas Base**: Texturas completas de la mena con los cristales.
  - `0011.png` - Mena de Fosfofilita
  - `0111.png` - Mena de Fosfofilita en Pizarra Profunda (Deepslate)

- **Capas Emisivas**: Solo las porciones de cristal brillante.
  - `phosphophyllite_ore_e.png` - Capa emisiva para la mena normal.
  - `deepslate_phosphophyllite_ore_e.png` - Capa emisiva para la mena en deepslate.

## Cómo Usarlo

### Con OptiFine/Shaders
Las texturas emisivas harán que automáticamente solo las porciones de cristal brillen al máximo, mientras que la piedra a su alrededor permanecerá oscura, de acuerdo a la iluminación ambiental.

### Sin OptiFine/Shaders
Las menas emiten un nivel de luz de 10 (redstone + 1) en el juego por defecto, haciendo que el bloque entero brille ligeramente.
