# Changelog

## v0.9.1 — Suporte a Spigot/CraftBukkit, até 1.8.8

> Lançado: 2026

O Solver agora roda em Spigot/CraftBukkit puro, não só em Paper/Folia — até a versão 1.8.8. Todo recurso funciona da mesma forma em todo lugar, com um fallback apropriado onde uma API exclusiva do Paper não existe.

### Novidades

- **Suporte a Spigot/CraftBukkit, a partir de 1.8.8** — o Solver não exige mais o Paper. Moderação de chat, sanções, o Staff Mode Toolkit e todas as GUIs funcionam da mesma forma no Spigot puro.
- **Requisito de Java mais baixo: Java 8 ou superior** (antes Java 17).

### Correções

- Corrigido: o armazenamento de sanções (SQLite) podia falhar ao inicializar em algumas instalações, por um problema de registro do driver específico de como o Bukkit carrega os jars de plugins.

### Compatibilidade

- Paper, Purpur, Spigot, CraftBukkit, Folia
- Minecraft 1.8.8 — 1.21.x (o suporte a 1.7.10 está planejado mas ainda não disponível)
- Java 8+

## v0.9.0 — Backend da FyrxLab, parte 1: Verificação de Integridade e Escaneamento de Malware

> Lançado: Julho de 2026

O Solver agora pode verificar seu próprio jar e escanear plugins com malware conhecido. Ambos estáticos, assinados e em cache — ainda sem backend dinâmico.

### Novidades

- **Verificação de integridade do build** — o Solver checa seu próprio jar contra um hash assinado publicado pela FyrxLab. Consulte a qualquer momento com `/solver integrity`, ou force uma checagem imediata com `/solver integrity rescan`.
- **Escaneamento de malware** — cada outro `.jar` em `plugins/` é checado contra uma lista assinada de hashes de malware conhecido.
- **Cruzamento opcional com o Modrinth** para plugins não sinalizados — puramente informativo, nunca um alerta por si só.
- **Detecção de Java agent** — avisa na inicialização se um Java agent foi anexado à JVM do servidor, já que um agent pode alterar classes em memória sem nunca tocar no arquivo jar em disco.

### Correções

- `/solver rtp` podia ocasionalmente teletransportar quem executou o comando para si mesmo em vez de outro jogador.

## v0.8.0 — A Alternativa Completa de Moderação/Staff

> Lançado: Julho de 2026

O Solver se torna uma alternativa completa de moderação/staff, não só moderação de chat com IA — detecção de contas alternativas, suporte a MySQL, recursos dentro do jogo, um sistema completo de denúncias de staff, e um Staff Mode Toolkit muito mais profundo.

### Novidades

- **Detecção real de contas alternativas** — `/solver checkuser <jogador>` cruza o histórico de IP entre todas as contas; um banimento agora expulsa instantaneamente um alt já online, não só bloqueia futuros logins.
- **Recursos de sanção dentro do jogo** — `/solver appeal <id> <motivo>`, sem precisar de Discord; o staff é notificado e analisa com `/solver appeal list|accept|reject`.
- **GUI `/solver sanctions <jogador>`** — navegue pelo histórico de um jogador, clique em uma sanção ativa para o comando exato de revogá-la.
- **Modelos de motivo e escalonamento automático de avisos** — atalhos tipo `#griefing` e auto-kick/tempban após o N-ésimo aviso de um jogador.
- **Backend de armazenamento MySQL opcional** para instalações multi-servidor, junto ao SQLite padrão sem configuração.
- **Um sistema completo de Denúncias de Staff** — `/solver report`/`reports`, com sua própria GUI, totalmente separado das sanções.
- **CommandSpy** — um repasse ao vivo dos comandos de outros jogadores, não só um registro retrospectivo.
- **Perfis combinados de Staff Mode** — `/solver staffmode <perfil>` agrupa vanish/imunidade-a-congelamento/voo/modo-deus/esvaziamento-de-inventário.
- **Vanish em dois níveis + invulnerabilidade opcional**, entrada silenciosa, e um canal de chat privado para conversar com um jogador congelado durante um screenshare.
- **`/solver inspect`/`enderchest`** — veja *e confisque* o inventário/ender chest de um jogador sem abri-lo.
- **`/solver fly`/`god`/`rtp`** para voo, invulnerabilidade e teleportes de supervisão independentes.
- **As categorias de moderação de chat agora você define** (`tags.yml`), e `chat-moderation.action.tag-overrides` mapeia qualquer tag direto para um tipo de sanção — a única forma de chegar a um banimento automático a partir da moderação de chat.

### Correções

- Corrigido: a moderação de chat podia marcar uma mensagem completamente normal como tóxica/spam — uma mensagem já julgada inofensiva nunca era removida do buffer de contexto, então recebia um julgamento novo e independente a cada ciclo. O texto já revisado agora é só contexto de fundo, nunca rejulgado do zero.
- Corrigido: entradas adicionadas manualmente em `reason-templates`/`warn-escalation`/`staff-mode.profiles` podiam ser apagadas silenciosamente do `config.yml` em um reload ou reinício.
- Corrigido: `/solver god` não bloqueava de forma confiável o dano de PvP.
- Corrigido: um motivo de sanção longo saía da tela na tela de desconexão de kick/ban e no tooltip da GUI de sanções — agora quebra em parágrafo.
- Corrigido: um `KICK` aparecia como "ativo" em `/solver history`/`check` — é uma expulsão instantânea, agora mostrado como "executado".

## v0.7.2 — Staff Mode Toolkit e Moderação mais Inteligente

> Lançado: 2026

A moderação de chat deixa de confiar em uma única chamada de IA, os comandos de staff ficam mais rápidos de digitar, e uma primeira peça do próximo marco é lançada como experimental.

### Novidades

- **Staff Mode Toolkit (Experimental)** — `/solver vanish`, `/solver freeze <jogador>`, e `/solver staffchat`, todos também disponíveis como comandos independentes (`/vanish`, `/freeze`, `/staffchat`).
- **Permissões granulares, compatíveis com LuckPerms** — cada subcomando de `/solver` agora tem seu próprio nó de permissão, agrupados sob `solver.diagnostics.*`, `solver.sanctions.*`, e `solver.staffmode.*`. `solver.admin` continua concedendo tudo.
- **Comandos independentes** — `/vanish`, `/mute`, `/ban`, `/moderation`, e mais agora funcionam diretamente sem o prefixo `/solver`. Desative uma categoria inteira no `config.yml` se outro plugin já usar um desses nomes.
- **Corroboração de múltiplos sinais para moderação de chat** — uma sanção automática agora exige que o veredicto da IA seja ao mesmo tempo confiante e severo o suficiente, *ou* respaldado por um sinal local independente. Caso contrário, permanece como um alerta apenas para o staff.
- **4 níveis configuráveis de `llm-analysis-level`** — de `0` (nunca chamar a IA, apenas filtro local) a `3` (tempo real, cada mensagem).

### Correções

- Corrigido: reconectar enquanto congelado usava um teletransporte síncrono que o modelo de threading regional do Folia rejeita — mudado para a API de teletransporte assíncrona.
- Corrigido: faltava o valor de confiança da IA no relatório de incidente de moderação salvo.
- Corrigido: a moderação de chat voltava a punir a mesma mensagem já julgada durante uma varredura em lote muito ativa.
- Corrigido: o estado de mute vivia só na memória — um reinício não levanta mais silenciosamente um mute ativo antes da hora; agora é restaurado do `sanctions.db` ao entrar, assim como já acontecia com banimentos.
- Limpeza de comentários do `config.yml` que tinham vazado linguagem de desenvolvimento interno.

## v0.7.1 — Patch de Correção de Bugs

> Lançado: 2026

Sem novos recursos — cinco bugs reais encontrados por auditoria de código logo após o lançamento da 0.7.0, todos corrigidos aqui.

- Corrigido: o `config.yml` perdia seus comentários explicativos a cada reinício, mesmo quando nada precisava ser atualizado.
- Corrigido: `/solver tempmute` com uma duração menor que um minuto (ex.: `30s`) não fazia nada silenciosamente.
- Corrigido: um bug de limite de taxa que podia fazer recursos baseados em IA se bloquearem brevemente entre si ao compartilhar a mesma chave de API.
- Corrigido: algumas chamadas internas da API do Bukkit na moderação de chat e nos comandos de sanções aconteciam fora da thread correta — reforçado para segurança no Folia, e os comandos de sanções não bloqueiam mais por I/O de banco de dados.

## v0.7.0 — Sanções, Mensagens Personalizadas e Moderação mais Inteligente

> Lançado: 2026

Um sistema real de warn/mute/kick/ban, cada mensagem visível ao jogador agora personalizável, e os veredictos de moderação do Fyrx vêm com uma pontuação de confiança em vez de um simples sim/não.

### Novidades

- **Novo `messages.yml`** — cada mensagem visível para jogadores/staff agora é configurável com suporte completo a MiniMessage, na sua própria pasta de idioma (`lang/<idioma>/messages.yml`).
- **Novo Sistema de Sanções (BETA)** — `/solver warn|mute|tempmute|kick|ban|tempban <jogador> [duração] <motivo>`, além de `unban|unmute|unwarn`, `history <jogador>`, `check <id>`, e `note <jogador> <texto>`. Cada sanção recebe um ID real e persiste em `sanctions.db`.
- **Banimentos agora são realmente aplicados** — reconectar enquanto banido é rejeitado no login, não apenas com uma expulsão pontual.
- **Mutes sempre funcionam** — mesmo com a moderação de chat por IA desativada, `/solver mute` bloqueia o chat de verdade.
- **Medidor de Confiança** — cada veredicto de moderação mostra o quão *seguro* o Fyrx está (0-100%), separado da severidade. Visível nos alertas de staff e em `/solver moderation test`/`status`.
- **`/solver moderation status` mostra uma contagem regressiva** para a próxima varredura automática de chat.
- **Suporte a PlaceholderAPI (BETA)** — `%solver_muted%`, `%solver_warns%`, `%solver_active_sanctions%`, e mais.
- **`config.yml`/`messages.yml` não ficam mais desatualizados** — novas opções são mescladas automaticamente.
- **Moderação de Chat com IA, fora da beta** — staff/administradores podem ser isentos, localização completa em todos os 9 idiomas, e veredictos por categoria e por infrator em vez de uma única palavra adivinhada.
- **`/solver crashme dry-run`** — executa todo o pipeline de diagnóstico de crash com um relatório sintético, sem uma exceção/travamento/OOM real.

### Compatibilidade

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

## v0.5.0 — Lançamento Inicial

> Lançado: Julho de 2026

Esta é a primeira versão pública estável do **AbsoluteSolver**. Ela introduz o **Fyrx**, seu administrador de servidor com IA.

### Novos Recursos

- **Integração com IA Gemini** — Totalmente integrado com o modelo `gemini-3-flash-preview` do Google.
- **Monitor de Console ao Vivo** — Injeta-se diretamente no Log4j para interceptar exceções `ERROR` e `WARN` em tempo real.
- **Análise de Crash Post-Mortem** — Verifica automaticamente `crash-reports/` na inicialização.
- **Suporte a Crashes Nativos da JVM** — Detecta e analisa arquivos de crash fatal da JVM `hs_err_pid.log`.
- **Detecção de Erros Iniciais de Inicialização** — Lê o `logs/latest.log` na inicialização para capturar erros de dependência pré-carregamento.
- **Monitor de Ticks** — Thread leve em segundo plano que detecta travamentos e deadlocks do servidor.
- **Suporte ao Folia** — O plugin detecta o Folia automaticamente e desativa o TickMonitor de forma elegante.
- **Interface de Console Bonita** — Banner ASCII de inicialização e respostas de IA formatadas usando códigos de cor do Minecraft.
- **Suporte a Múltiplos Provedores** — Compatível com Google Gemini, Anthropic Claude e qualquer API compatível com OpenAI.
- **Ferramentas de Diagnóstico** — `/absolutesolver crashme <exception|deadlock|oom>` para testes seguros.
- **100% Assíncrono** — Zero impacto no TPS do servidor.

### Compatibilidade

- Paper, Purpur, Spigot, Folia
- Minecraft 1.18.x — 1.21.x
- Java 17+

---

*Feito com ❤️ pela FyrxLab*
