# Fyrx — Seu Assistente de IA

O Fyrx é o cérebro com IA do AbsoluteSolver. Ele age como um administrador de servidor sempre ativo, que monitora seu servidor Minecraft, intercepta erros e fornece diagnósticos claros e legíveis automaticamente.

## O que é o Fyrx?

Quando seu servidor encontra um problema — seja uma exceção de plugin, um crash ou um pico de lag — o Fyrx:

1. **Captura** o contexto completo do erro (stack trace, estado da thread, histórico de log)
2. **Envia** para o Google Gemini (ou o provedor de IA que você configurou)
3. **Retorna** um relatório diagnóstico estruturado e formatado diretamente no seu console

Você recebe uma explicação em linguagem simples do que aconteceu, qual plugin causou o problema e o que você deve fazer a seguir — sem precisar ler uma única linha de Java.

## Provedores de IA Suportados

O Fyrx é agnóstico quanto ao provedor. Você pode usar qualquer um dos seguintes:

| Provedor | Modelos | Notas |
|----------|--------|-------|
| **Anthropic** | Sonnet, Haiku, Opus | Provedor padrão a partir desta versão. Raciocínio de alta qualidade. |
| **Google Gemini** | Pro, Flash | Nível gratuito disponível. |
| **OpenAI / Compatíveis** | `gpt-4o`, `gpt-4-turbo`, etc. | Funciona com qualquer endpoint compatível com OpenAI, incluindo modelos locais (Ollama, LM Studio): coloque o endpoint local em `other-url` e deixe `other-key` vazia. |

## Formato da Resposta

O Fyrx formata suas respostas usando códigos de cor nativos do Minecraft diretamente no console do seu servidor:

```
╔══════════════════════════════════════════════════════════╗
║       ANALYSIS REPORT — FYRX                            ║
╚══════════════════════════════════════════════════════════╝

### 1. Root Cause
The error is a NullPointerException thrown in PluginX's
PlayerJoinEvent handler at PlayerListener.java:47.

### 2. Most Likely Cause
PluginX is trying to access player data before it has been
loaded from the database.

### 3. Recommended Action
Update PluginX to version 2.3.1+ which fixes this race condition.
If no update is available, disable PluginX temporarily.
════════════════════════════════════════════════════════════
```

## Prompt de Sistema e Regras

O Fyrx opera sob um prompt de sistema rígido que garante que:

- **Nunca** sugere remover o próprio AbsoluteSolver
- Fornece soluções **acionáveis**, não conselhos vagos
- Sempre identifica a **causa raiz** antes de dar recomendações
- Considera **múltiplos plugins** como possíveis causas

## Impacto no Desempenho

O Fyrx foi projetado para ter **zero impacto no TPS do servidor**. Todas as requisições de IA são feitas em threads em segundo plano usando `CompletableFuture`. Seu servidor nunca vai pausar, travar ou ficar mais lento enquanto o Fyrx está analisando um erro.
