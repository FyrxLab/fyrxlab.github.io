# Primeros Pasos

## Requisitos

Antes de instalar AbsoluteSolver, asegúrate de que tu servidor cumple con los siguientes requisitos:

| Requisito | Mínimo | Recomendado |
|-----------|--------|-------------|
| **Java** | Java 17 | Java 21 |
| **Software de Servidor** | Spigot | Paper / Purpur |
| **Versión de Minecraft** | 1.18.x | 1.20.x+ |
| **API Key** | Anthropic, Google, o un proveedor compatible con OpenAI | — |

::: tip Cualquier Proveedor de IA Funciona
AbsoluteSolver viene configurado con **Anthropic Claude** por defecto, pero Google Gemini y cualquier endpoint compatible con OpenAI (incluyendo modelos locales vía Ollama o LM Studio) funcionan igual de bien — consulta [Fyrx — Tu Asistente de IA](/es/solver/fyrx-ai) para ver la lista completa.
:::

## Instalación

**1. Descarga el plugin**

Descarga el `Solver-<versión>.jar` más reciente desde [Modrinth](https://modrinth.com/plugin/solver) o la página de [GitHub Releases](https://github.com/FyrxLab/AbsoluteSolver).

**2. Colócalo en la carpeta `plugins`**

```
tu-servidor/
└── plugins/
    └── Solver-<versión>.jar  ← aquí
```

**3. Inicia el servidor una vez**

Inicia el servidor normalmente. AbsoluteSolver generará su archivo de configuración predeterminado y luego se detendrá (o puedes seguir ejecutándolo sin una clave — registrará una advertencia).

**4. Añade tu Clave API**

Abre `plugins/Solver/config.yml` y pega tu clave API de Anthropic (o cambia de proveedor, ver el consejo de arriba):

```yaml
ai-provider:
  provider: "anthropic"
  model: "Sonnet"
  anthropic-key: "TU_CLAVE_API_AQUI" # [!code highlight]
```

**5. Reinicia el servidor**

Reinicia tu servidor. Deberías ver el banner ASCII de AbsoluteSolver en la consola y el mensaje:

```
[Solver] Asistente: Fyrx - Monitoreando errores...
[Solver] TickMonitor iniciado. Vigilando el rendimiento del servidor...
```

Fyrx ya está activo y monitoreando tu servidor. ✅

## Prueba de Funcionamiento

Puedes activar un error de prueba seguro usando el comando integrado de crash test (requiere OP):

```
/solver crashme exception
```

O, sin afectar al servidor en absoluto:

```
/solver crashme dry-run
```

En pocos segundos, Fyrx analizará la excepción e imprimirá un informe de diagnóstico completo en tu consola.

::: warning Comando solo de consola
El comando `/solver` requiere el permiso `solver.admin` (o el permiso específico del subcomando — ver [Comandos](/es/solver/commands#permisos)). Por defecto, solo los operadores del servidor tienen este permiso.
:::
