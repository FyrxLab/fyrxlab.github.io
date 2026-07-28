# Primeros Pasos

**SolverMOTD** es un plugin MOTD ligero y multiplataforma. Como está compilado universalmente, ¡el mismo archivo `.jar` puede colocarse en la carpeta `plugins/` de cualquier servidor Bukkit, Spigot, BungeeCord o Velocity!

## Instalación
1. Descarga el último `SolverMOTD.jar` desde Modrinth.
2. Coloca el `.jar` dentro de la carpeta `plugins/` de tu servidor.
3. Reinicia tu servidor.

## Configuración
Una vez que el servidor inicie, generará un archivo `config.yml` en la carpeta `plugins/SolverMOTD/`.

Puedes editar el texto de tu MOTD en la sección `motd:`:

```yaml
motd:
  line1: "      <white><obf>!</obf> <bold><yellow>Solver</yellow><red>Motd</red> <aqua>Plugin</aqua></bold>"
  line2: "         <green>¡Configura tu archivo <yellow>Config.yml</yellow>!</green>"
```

### Formato
Recomendamos altamente utilizar el formato **MiniMessage** (por ejemplo, `<red>Texto</red>`) en lugar de los códigos legacy con ampersand (`&cTexto`). MiniMessage es mucho más robusto para los clientes modernos y soporta gradientes y colores hexadecimales sin esfuerzo.

> [!NOTE]
> Si tienes **PlaceholderAPI** instalado en tu servidor, ¡SolverMOTD procesará automáticamente los placeholders en tu MOTD!

## Recargar (Reload)
Después de hacer cambios en tu configuración, no necesitas reiniciar tu servidor. Simplemente ejecuta el comando `/smotd reload` para aplicar tu nuevo MOTD al instante.
