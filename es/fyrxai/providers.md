# Proveedores de IA

FyrxAI no corre su propio modelo — tú traes una API key de uno de cuatro proveedores soportados, configurada por servidor con `/fyrxai provider set`.

| Proveedor | Valor de `provider` | Notas |
|---|---|---|
| WaveSpeed | `wavespeed` | Endpoint compatible con OpenAI, con enrutamiento de modelos, ej. `anthropic/claude-3-haiku` |
| OpenRouter | `openrouter` | Compatible con OpenAI, cualquier modelo que soporte OpenRouter |
| Google AI Studio | `googleai` | SDK oficial, ej. `gemini-2.0-flash` |
| Claude Platform | `claude` | Anthropic Messages API directamente, ej. `claude-3-5-haiku-20241022` |

```
/fyrxai provider set provider:<nombre> model:<modelo> apikey:<clave>
```

La clave se guarda cifrada con AES-256-GCM en disco, con una clave generada automáticamente en el primer arranque dentro de la carpeta `fyrxai-data/` de tu bot. Si ese archivo se pierde alguna vez (ej. la carpeta se borra), la clave guardada queda ilegible y tendrás que volver a correr `provider set`.

## Cambiar de proveedor

Volver a correr `provider set` con un valor de `provider` distinto reemplaza el activo de inmediato — no hace falta hacer `provider remove` primero.

## Quitar un proveedor

```
/fyrxai provider remove
```

Sin proveedor configurado, FyrxAI igual rastrea documentación y extrae keywords con `/fyrxai wiki add` (esa parte no necesita IA), pero no responderá preguntas hasta que configures uno.
