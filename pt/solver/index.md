---
layout: home

hero:
  name: "AbsoluteSolver"
  text: "Diagnóstico de Servidor com IA"
  tagline: "Conheça o Fyrx — seu assistente de IA integrado que analisa automaticamente erros de console, relatórios de crash e lag do servidor em linguagem simples."
  image:
    src: /solver.svg
    alt: AbsoluteSolver
  actions:
    - theme: brand
      text: Primeiros Passos
      link: /pt/solver/getting-started
    - theme: alt
      text: Ver no Modrinth
      link: https://modrinth.com/plugin/solver
    - theme: alt
      text: English
      link: /en/solver/getting-started
---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-brain"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Por que AbsoluteSolver</span>
    <h3>O Fyrx lê seu servidor para que você não precise</h3>
    <p>Vem com Anthropic Claude por padrão — Google Gemini e qualquer endpoint compatível com OpenAI também são totalmente suportados. O Fyrx transforma stack traces crípticos de Java, spam de console e picos de lag em uma explicação em linguagem simples do que realmente aconteceu.</p>
    <p class="spotlight-note">Cada chamada de IA roda em uma thread em segundo plano — análise, I/O de arquivos e requisições de rede nunca tocam sua thread principal. Seu TPS nem percebe que o Fyrx está ali.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">Diagnóstico</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><b>Monitor de Console ao Vivo</b><p>Injetado diretamente no mecanismo Log4j do servidor. Os erros são interceptados no instante em que acontecem — sem precisar vasculhar logs manualmente.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-explosion"></i>
    <div><b>Análise de Crashes</b><p>Verifica automaticamente crash-reports e erros fatais da JVM na inicialização. O Fyrx diz exatamente o que derrubou seu servidor antes mesmo de você perguntar.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-stopwatch"></i>
    <div><b>Monitor de Ticks</b><p>Uma thread leve em segundo plano observa seu TPS. Se a thread principal travar por mais de 5 segundos, o Fyrx identifica o plugin culpado.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-clock-rotate-left"></i>
    <div><b>Erros Iniciais de Inicialização</b><p>Lê o logs/latest.log na inicialização para detectar conflitos de dependência e erros de versão ocorridos antes do AbsoluteSolver carregar.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Moderação e Segurança</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-gavel"></i>
    <div><b>Moderação de Chat com IA</b><p>O Fyrx lê o contexto real da conversa, não uma lista de palavras, e respalda cada veredicto com uma pontuação de confiança antes de agir.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-scale-balanced"></i>
    <div><b>Sistema de Sanções</b><p>Sistema completo de warn/mute/kick/ban com detecção de contas alternativas por IP, recursos dentro do jogo, suporte a MySQL e uma GUI.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Ferramentas de Staff</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-user-secret"></i>
    <div><b>Staff Mode Toolkit</b><p>Vanish (dois níveis), congelamento com canal de chat privado, chat exclusivo para staff, CommandSpy, e inspect/enderchest com confisco em um clique.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-flag"></i>
    <div><b>Denúncias de Staff</b><p>Qualquer jogador pode sinalizar algo para a staff com /solver report — com fila e GUI próprias, totalmente separado das sanções.</p></div>
  </div>
</div>

</div>
