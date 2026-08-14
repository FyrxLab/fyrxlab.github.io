# Changelog

## v1.2.1
- Compatibilidade com ES modules formalizada com um mapa `exports` explícito no `package.json` — `import setupFyrxAI from 'fyrxai'` agora funciona junto com `require()`.

## v1.2.0
- Adicionado `/fyrxai exempt` — usuários e cargos configuráveis por servidor (ex. moderadores) que pulam o cooldown de atenção.
- Detecção de tópicos mais permissiva em servidores com uma única wiki: um único tópico configurado agora responde perguntas razoáveis sem exigir que seu nome seja mencionado, ainda filtrando saudações e conversa fiada.
- Detecção de "problema" ampliada para capturar mais frases do dia a dia (ex. expressões regionais de "não funciona", conjugações verbais em espanhol).
- Mencionar (@) o bot agora garante uma resposta em qualquer canal, pulando todos os filtros heurísticos. Mencioná-lo enquanto responde a outra mensagem faz com que ele responda sobre aquela mensagem em vez do seu texto de menção.

## v1.0.0
- Lançamento público inicial: rastreamento de documentação do site inteiro (`llms.txt`/`sitemap.xml`/seguimento de links), extração de palavras-chave automática + assistida por IA, detecção de tópicos em três camadas, configuração por slash command `/fyrxai`, e suporte para WaveSpeed, OpenRouter, Google AI Studio, e Claude Platform.
