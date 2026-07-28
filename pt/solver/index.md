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

features:
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-brain"></i>'
    title: Integração com IA Gemini
    details: Desenvolvido com o modelo Gemini do Google. O Fyrx traduz stack traces Java crípticos em soluções claras e acionáveis que você realmente entende.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-triangle-exclamation"></i>'
    title: Monitor de Console ao Vivo
    details: Injetado diretamente no mecanismo de log Log4j do servidor. Os erros são interceptados no instante em que acontecem — sem precisar vasculhar logs manualmente.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-explosion"></i>'
    title: Análise de Crashes
    details: Verifica automaticamente relatórios de crash e logs de erro fatal da JVM na inicialização. O Fyrx vai te dizer exatamente o que derrubou seu servidor antes mesmo de você perguntar.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-stopwatch"></i>'
    title: Monitor de Ticks
    details: Uma thread leve em segundo plano observa o TPS do seu servidor. Se a thread principal travar por mais de 5 segundos, o Fyrx identifica o plugin culpado.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-clock-rotate-left"></i>'
    title: Erros Iniciais de Inicialização
    details: Lê o logs/latest.log na inicialização para detectar conflitos de dependência e erros de versão ocorridos antes mesmo do AbsoluteSolver carregar.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-bolt"></i>'
    title: Arquitetura Sem Lag
    details: Todo o processamento de IA, I/O de arquivos e chamadas de rede rodam em threads em segundo plano. O TPS do seu servidor nunca é afetado enquanto o Fyrx está pensando.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-gavel"></i>'
    title: Moderação de Chat com IA e Sanções
    details: O Fyrx lê o contexto do chat (não uma lista de palavras proibidas) e respalda cada veredicto com uma pontuação de confiança. Um sistema completo de warn/mute/kick/ban com detecção de contas alternativas, recursos dentro do jogo, suporte a MySQL e uma GUI.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-user-secret"></i>'
    title: Staff Mode Toolkit
    details: Vanish (dois níveis), congelamento com canal de chat privado, chat exclusivo para staff, CommandSpy, perfis combinados com nome, e inspect/enderchest com confisco em um clique — tudo via /solver ou como comandos independentes.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-flag"></i>'
    title: Denúncias de Staff
    details: Qualquer jogador pode sinalizar algo para a atenção do staff com /solver report, gerenciado com fila e GUI próprias — totalmente separado das sanções.
---
