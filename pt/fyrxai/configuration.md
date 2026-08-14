# Configuração

FyrxAI não tem arquivo de configuração nem variáveis de ambiente — tudo é configurado pelo Discord com o slash command `/fyrxai`. O Discord o esconde por padrão de quem não tem a permissão **Gerenciar Servidor**.

## 1. Configuração no Discord Developer Portal

Antes de instalar, seu bot precisa de:

- O intent privilegiado **Message Content** habilitado (Bot → Privileged Gateway Intents), e `GatewayIntentBits.MessageContent` + `GatewayIntentBits.GuildMessages` no construtor do seu `Client`.
- O escopo OAuth2 `applications.commands` no seu link de convite (junto com `bot`), para que o Discord permita registrar `/fyrxai`.

## 2. Escolha um canal de suporte

```
/fyrxai channel add #suporte
```

O FyrxAI responde automaticamente nesse canal — sem precisar mencioná-lo. Use `channel remove` ou `channel list` para gerenciar o conjunto.

## 3. Adicione documentação

```
/fyrxai wiki add name:conditionalevents url:https://seu-site-de-docs.example.com description:"plugin para condições e ações personalizadas"
```

Isso rastreia o site inteiro a partir dessa URL (tentando `llms.txt`, depois `sitemap.xml`, depois links do mesmo domínio), e extrai automaticamente até 100 palavras-chave — sem precisar de provedor de IA para essa etapa. Rode novamente com `wiki refresh` depois que a documentação de origem mudar.

## 4. Escolha um provedor de IA

```
/fyrxai provider set provider:claude model:claude-3-5-haiku-20241022 apikey:sk-ant-...
```

Veja [Provedores de IA](/pt/fyrxai/providers) para a lista completa e notas por provedor. A resposta é efêmera — só você vê a confirmação, e a chave nunca é postada como texto simples.

## Outros comandos

| Comando | O que faz |
|---|---|
| `/fyrxai persona set <texto>` | Instruções extras para o system prompt, ex. "Você é o bot de suporte da Acme Corp." |
| `/fyrxai exempt adduser <usuário>` | Isenta um usuário específico do cooldown por usuário |
| `/fyrxai exempt addrole <cargo>` | Isenta um cargo (ex. moderadores) do cooldown |
| `/fyrxai status` | Mostra a configuração atual deste servidor |
| `/fyrxai help` | Lista completa de comandos, dentro do Discord |

## Obtendo uma resposta diretamente

Duas formas de pular completamente a vigilância passiva do canal:

- **Mencione (@) o bot** em qualquer lugar — não só nos canais de suporte configurados — para uma resposta garantida (ainda sujeita ao limite de uso).
- **Mencione-o enquanto responde** (reply) a outra mensagem, e ele responderá sobre *aquela* mensagem em vez do seu próprio texto. Útil para "ei @FyrxAI, pode explicar isso?" em uma mensagem confusa de outra pessoa.

## Onde os dados vivem

A configuração do servidor e a chave de criptografia AES-256-GCM para as API keys salvas vivem em uma pasta `fyrxai-data/` criada no diretório de trabalho do seu próprio bot — não dentro de `node_modules`, então sobrevive a `npm ci`/redeploys. Adicione `fyrxai-data/` ao seu `.gitignore`.
