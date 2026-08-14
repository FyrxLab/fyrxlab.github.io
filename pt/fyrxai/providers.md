# Provedores de IA

O FyrxAI não roda seu próprio modelo — você traz uma API key de um dos quatro provedores suportados, configurada por servidor com `/fyrxai provider set`.

| Provedor | Valor de `provider` | Notas |
|---|---|---|
| WaveSpeed | `wavespeed` | Endpoint compatível com OpenAI, com roteamento de modelos, ex. `anthropic/claude-3-haiku` |
| OpenRouter | `openrouter` | Compatível com OpenAI, qualquer modelo suportado pela OpenRouter |
| Google AI Studio | `googleai` | SDK oficial, ex. `gemini-2.0-flash` |
| Claude Platform | `claude` | Anthropic Messages API diretamente, ex. `claude-3-5-haiku-20241022` |

```
/fyrxai provider set provider:<nome> model:<modelo> apikey:<chave>
```

A chave é armazenada criptografada com AES-256-GCM em disco, com uma chave gerada automaticamente na primeira execução dentro da pasta `fyrxai-data/` do seu bot. Se esse arquivo for perdido (ex. a pasta for apagada), a chave salva fica ilegível e você precisará rodar `provider set` novamente.

## Trocando de provedor

Rodar `provider set` novamente com um valor de `provider` diferente substitui o ativo imediatamente — não precisa fazer `provider remove` antes.

## Removendo um provedor

```
/fyrxai provider remove
```

Sem provedor configurado, o FyrxAI ainda rastreia documentação e extrai palavras-chave com `/fyrxai wiki add` (essa parte não precisa de IA), mas não responderá perguntas até que um provedor seja configurado.
