# Configuración

FyrxAI no tiene archivo de configuración ni variables de entorno — todo se configura desde Discord con el comando slash `/fyrxai`. Discord lo oculta por defecto a cualquiera sin el permiso **Gestionar Servidor**.

## 1. Configuración en el Discord Developer Portal

Antes de instalar, tu bot necesita:

- El intent privilegiado **Message Content** habilitado (Bot → Privileged Gateway Intents), y `GatewayIntentBits.MessageContent` + `GatewayIntentBits.GuildMessages` en el constructor de tu `Client`.
- El scope de OAuth2 `applications.commands` en tu enlace de invitación (junto a `bot`), para que Discord le permita registrar `/fyrxai`.

## 2. Elige un canal de soporte

```
/fyrxai channel add #soporte
```

FyrxAI responde automáticamente en este canal — sin necesidad de mencionarlo. Usa `channel remove` o `channel list` para gestionar el conjunto.

## 3. Añade documentación

```
/fyrxai wiki add name:conditionalevents url:https://tu-sitio-de-docs.example.com description:"plugin para condiciones y acciones personalizadas"
```

Esto rastrea todo el sitio empezando desde esa URL (intentando `llms.txt`, luego `sitemap.xml`, luego enlaces del mismo dominio), y extrae hasta 100 keywords automáticamente — sin necesitar proveedor de IA para este paso. Vuelve a ejecutarlo con `wiki refresh` cuando la documentación fuente cambie.

## 4. Elige un proveedor de IA

```
/fyrxai provider set provider:claude model:claude-3-5-haiku-20241022 apikey:sk-ant-...
```

Consulta [Proveedores de IA](/es/fyrxai/providers) para la lista completa y notas por proveedor. La respuesta es efímera — solo tú ves la confirmación, y la clave nunca se publica como texto plano.

## Otros comandos

| Comando | Qué hace |
|---|---|
| `/fyrxai persona set <texto>` | Instrucciones extra para el system prompt, ej. "Eres el bot de soporte de Acme Corp." |
| `/fyrxai exempt adduser <usuario>` | Exenta a un usuario específico del cooldown por usuario |
| `/fyrxai exempt addrole <rol>` | Exenta a un rol (ej. moderadores) del cooldown |
| `/fyrxai status` | Muestra la configuración actual de este servidor |
| `/fyrxai help` | Lista completa de comandos, dentro de Discord |

## Obtener una respuesta directamente

Dos formas de saltarte por completo la vigilancia pasiva del canal:

- **Menciona al bot (@)** en cualquier parte — no solo en canales de soporte configurados — para una respuesta garantizada (aún sujeta al límite de uso).
- **Menciónalo mientras respondes** (reply) a otro mensaje, y responderá sobre *ese* mensaje en vez de tu propio texto. Útil para "oye @FyrxAI, ¿puedes explicar esto?" sobre un mensaje confuso de otra persona.

## Dónde viven los datos

La configuración del servidor y la clave de cifrado AES-256-GCM para las API keys guardadas viven en una carpeta `fyrxai-data/` creada en el directorio de trabajo de tu propio bot — no dentro de `node_modules`, así que sobrevive a `npm ci`/redeploys. Añade `fyrxai-data/` a tu `.gitignore`.
