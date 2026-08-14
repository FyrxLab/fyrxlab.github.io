---
layout: home

hero:
  name: "FyrxAI"
  text: "Agente de Suporte com IA para Bots do Discord"
  tagline: "Adicione um agente de suporte com IA ao seu próprio bot discord.js em minutos — configurado inteiramente pelo Discord, sem editar código, sem variáveis de ambiente."
  actions:
    - theme: brand
      text: Começar
      link: /pt/fyrxai/configuration
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/FyrxLab/fyrx-ai
    - theme: alt
      text: English
      link: /en/fyrxai/

---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-robot"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Por que FyrxAI</span>
    <h3>Aponte para sua documentação, não para seu código</h3>
    <p>FyrxAI é uma pequena biblioteca, não um serviço hospedado — você a instala no seu próprio bot. Dê a ela um ou mais sites de documentação com <code>/fyrxai wiki add</code> e ela os rastreia, extrai palavras-chave, e começa a responder perguntas nos seus canais de suporte automaticamente. Sem preparar um dataset manualmente.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">O Que Você Ganha</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-spider"></i>
    <div><b>Rastreamento do Site Inteiro</b><p>Aponte <code>/fyrxai wiki add</code> para uma única página e ela descobre o resto via <code>llms.txt</code>, <code>sitemap.xml</code>, ou seguindo links do mesmo domínio.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-layer-group"></i>
    <div><b>Detecção de Tópicos em Três Camadas</b><p>Correspondência exata, depois difusa (tolerante a erros de digitação), depois um modelo de embeddings local offline — sem gastar uma chamada de IA para descobrir do que se trata uma pergunta.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-plug"></i>
    <div><b>Traga Seu Próprio Provedor</b><p>WaveSpeed, OpenRouter, Google AI Studio, ou Claude Platform — escolha um por servidor, configurado com uma resposta efêmera de slash command.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-shield-halved"></i>
    <div><b>Nada Fixo no Código</b><p>Cada canal, wiki, provedor e permissão é configurado pelo chat do Discord. Instale o pacote e ele vem sem nenhum arquivo de configuração.</p></div>
  </div>
</div>

</div>

## Instalação

```bash
npm install github:FyrxLab/fyrx-ai
```

```js
// CommonJS
const setupFyrxAI = require('fyrxai');
setupFyrxAI(client);
```

```js
// ES modules
import setupFyrxAI from 'fyrxai';
setupFyrxAI(client);
```

Continue para [Configuração](/pt/fyrxai/configuration) para a configuração do lado do Discord.
