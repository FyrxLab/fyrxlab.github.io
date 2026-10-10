# Configuração

O AbsoluteSolver é configurado através do `plugins/Solver/config.yml`. As opções novas adicionadas por uma atualização são aplicadas sozinhas — o que você já personalizou não é tocado. No 1.18.1+ elas são adicionadas ao seu `config.yml` com a explicação; no 1.8–1.17 o arquivo não é reescrito (salvá-lo ali apagaria todos os comentários): as opções novas rodam com o valor padrão, o console as lista e um `config-reference.yml` totalmente documentado é escrito ao lado da sua config.

## Explorador interativo

<ConfigExplorer />

## Verifique seu config

<ConfigChecker />

## Referência de Diagnóstico

```yaml
# Idioma (en_US, es_ES, pt_BR, ru_RU, de_DE, fr_FR, ja_JP, ko_KR, eo_EO)
localization: en_US

# Analisar automaticamente se houve um crash quando o servidor inicia
check-crash-on-startup: true

# Monitorar todo o console em busca de erros (texto vermelho)
monitor-console: true
# Evita analisar o mesmo erro várias vezes (minutos de espera)
error-cooldown-minutes: 10

# Mostrar o banner ASCII gigante no console na inicialização?
show-banner: true

# Configuração do Provedor de IA
ai-provider:
  # Provedor: 'anthropic', 'google' ou 'other'
  provider: "anthropic"

  # Modelo a ser usado
  # Anthropic: Sonnet, Haiku, Opus
  # Google: Pro, Flash
  # Other: Nome do modelo (ex: gpt-4o, mistral-large)
  model: "Sonnet"

  # Chaves de API
  anthropic-key: ""
  google-key: ""

  # Configuração para o provedor 'other' (compatível com OpenAI)
  other-key: ""
  other-url: "https://api.openai.com/v1/chat/completions"

# Configuração de análise
analysis:
  auto-analyze: true
  timeout: 60
  save-to-file: true
  reports-directory: "crash-reports"
  # Quantos dias manter as análises salvas antes de excluí-las. 0 = para sempre.
  reports-retention-days: 0

# Notificações
notifications:
  notify-admins: true
  send-to-chat: false
```

::: tip O provedor padrão mudou para Anthropic
A partir desta versão, o padrão de fábrica é **Anthropic Claude** (`provider: "anthropic"`, modelo `Sonnet`), não o Google Gemini. Gemini e qualquer endpoint compatível com OpenAI continuam totalmente suportados — veja [Fyrx — Seu Assistente de IA](/pt/solver/fyrx-ai) para trocar.
:::

### Tabela de Referência — Diagnóstico

| Chave | Tipo | Padrão | Descrição |
|-----|------|---------|-------------|
| `localization` | String | `en_US` | Idioma das respostas de IA do Fyrx e das mensagens no jogo. |
| `check-crash-on-startup` | Booleano | `true` | Verifica `crash-reports/` na inicialização. |
| `monitor-console` | Booleano | `true` | Intercepta erros de console via Log4j. |
| `error-cooldown-minutes` | Inteiro | `10` | Minutos entre análises consecutivas. |
| `show-banner` | Booleano | `true` | Mostra o banner ASCII na inicialização. |
| `ai-provider.provider` | String | `anthropic` | Qual backend de IA usar: `anthropic`, `google`, ou `other`. |
| `ai-provider.model` | String | `Sonnet` | O nome específico do modelo para o provedor escolhido. |
| `analysis.reports-retention-days` | Inteiro | `0` | Dias para manter os arquivos em `reports-directory` antes de excluir automaticamente. `0` = para sempre. |

## Moderação de Chat

O Fyrx pode ler o chat e avaliar o *contexto* de uma conversa em vez de comparar com uma lista de palavras proibidas. Ativar isso envia o conteúdo do chat ao provedor de IA configurado acima. **Desativado por padrão por privacidade.**

```yaml
chat-moderation:
  enabled: false
  exempt-ops: true
  buffer-size: 50
  context-window-minutes: 5
  analysis-interval-seconds: 45
  scan-mode: "bulk"          # "bulk" ou "individual"
  llm-analysis-level: 2      # 0-3, veja abaixo

  pre-filter:
    trigger-on-repeated-target: true
    trigger-on-caps-ratio: 0.6
    min-messages-before-trigger: 3
    urgent-score-threshold: 0.65

  action:
    mode: "alert-only"       # "alert-only", "warn-player", ou "auto-action"
    severity-threshold-mute: 4
    severity-threshold-kick: 5
    mute-duration-minutes: 10
    min-confidence-to-act-alone: 85
    min-severity-to-act-alone: 4

  log-incidents-to-file: true
  log-test-results-to-console: true
  reports-retention-days: 0
```

### `llm-analysis-level` — com que frequência a IA é realmente chamada

`scan-mode` decide *como* a IA é chamada (uma chamada para a conversa inteira, ou uma por jogador ativo); `llm-analysis-level` decide *quando*:

| Nível | Comportamento |
|-------|--------|
| `0` | Nunca chama a IA — o pré-filtro local decide inteiramente por conta própria. Funciona sem nenhum provedor de IA configurado. |
| `1` | Só chama a IA quando o pré-filtro já sinalizou algo suspeito. |
| `2` (padrão) | A IA revisa todo o chat novo a cada ciclo, independente do pré-filtro. |
| `3` | Tempo real: cada mensagem é enviada à IA imediatamente, em vez de esperar `analysis-interval-seconds`. |

### Corroboração de múltiplos sinais

Um veredicto da IA sozinho só pode disparar uma sanção automática (`action.mode: "auto-action"`) quando é **ao mesmo tempo** tão confiante quanto `min-confidence-to-act-alone` **e** tão severo quanto `min-severity-to-act-alone`. Abaixo desse limite, uma sanção automática também exige pelo menos um sinal local corroborante do pré-filtro (gritos, uma palavra ofensiva, insistência no mesmo alvo, uma rajada de mensagens) — caso contrário, o veredicto permanece como um alerta apenas para o staff, para revisão manual via `/solver moderation status` ou `/solver check`.

### Tabela de Referência — Moderação de Chat

| Chave | Tipo | Padrão | Descrição |
|-----|------|---------|-------------|
| `chat-moderation.enabled` | Booleano | `false` | Chave geral. Envia o chat ao seu provedor de IA configurado quando ativado. |
| `chat-moderation.exempt-ops` | Booleano | `true` | OPs são automaticamente isentos. `solver.moderation.bypass` isenta um jogador específico independentemente deste valor. |
| `chat-moderation.buffer-size` | Inteiro | `50` | Máximo de mensagens recentes lembradas por jogador/globalmente. |
| `chat-moderation.context-window-minutes` | Inteiro | `5` | Janela de tempo do contexto enviado à IA. |
| `chat-moderation.analysis-interval-seconds` | Inteiro | `45` | Com que frequência a varredura incondicional verifica se há chat novo para analisar. |
| `chat-moderation.scan-mode` | String | `bulk` | `bulk` = uma chamada de IA para a conversa inteira (mais barato, pode confundir quem disse o quê). `individual` = uma chamada por jogador ativo (sem confusão, o custo escala com jogadores ativos). |
| `chat-moderation.action.mode` | String | `alert-only` | `alert-only` notifica apenas o staff. `warn-player` também avisa em privado o jogador sinalizado. `auto-action` além disso silencia/expulsa automaticamente conforme a severidade. |
| `chat-moderation.action.severity-threshold-mute` | Inteiro | `4` | Severidade (1-5) a partir da qual `auto-action` silencia automaticamente. |
| `chat-moderation.action.severity-threshold-kick` | Inteiro | `5` | Severidade a partir da qual `auto-action` expulsa em vez de silenciar. |
| `chat-moderation.action.min-confidence-to-act-alone` | Inteiro | `85` | Confiança (0-100) exigida para que o veredicto da IA sozinho sancione, sem corroboração do pré-filtro. |
| `chat-moderation.action.min-severity-to-act-alone` | Inteiro | `4` | Severidade (1-5) exigida para que o veredicto da IA sozinho sancione, sem corroboração do pré-filtro. |

### Tag Overrides — mapeando uma "situação" para uma sanção específica

`severity-threshold-mute`/`severity-threshold-kick` só chegam até um kick — `auto-action` nunca bane sozinha. `chat-moderation.action.tag-overrides` permite forçar um tipo de sanção específico para uma tag de IA específica, independente da severidade. É a única forma de chegar a um banimento/tempban automático a partir da moderação de chat:

```yaml
chat-moderation:
  action:
    tag-overrides:
      THREAT:
        type: tempban
        duration: 7d
      HATE_SPEECH:
        type: tempban
        duration: 3d
      SCAM:
        type: ban
```

- Tipos válidos: `warn`, `mute`, `tempmute`, `kick`, `ban`, `tempban` (`duration` obrigatória para as variantes temp-).
- Usado apenas quando `action.mode` é `auto-action`.
- Se um veredicto corresponder a mais de uma tag configurada, vence o tipo configurado mais severo.

### `tags.yml` — defina suas próprias categorias de moderação

As categorias que a IA pode usar (`TOXIC`, `HARASSMENT`, `THREAT`, `HATE_SPEECH`, `SCAM`, `SPAM` por padrão) ficam em `plugins/Solver/tags.yml`, não mais fixas no código do plugin. Adicione, edite ou remova uma tag ali e o prompt enviado à IA se atualiza sozinho — sem recompilar, sem mexer em código:

```yaml
tags:
  TOXIC: "Rude, insulting, or demeaning language with real malicious intent (not friendly banter between people who are fine with it)."
  HARASSMENT: "Insistent, repeated targeting of the same player, especially after they show discomfort or ask to stop."
  THREAT: "Threats of violence, real-world harm, or encouraging self-harm directed at someone."
  HATE_SPEECH: "Attacks based on race, religion, gender, sexual orientation, nationality, or similar."
  SCAM: "Attempts to defraud or phish another player (fake giveaways, asking for passwords/account info/real money)."
  SPAM: "Repetitive, advertising, or flooding messages with no other issue."
```

::: tip As descrições ficam em inglês
Elas viajam dentro do prompt interno que a IA recebe, então permanecem em inglês como o resto desse prompt — só o texto final visto pelo staff é traduzido para o idioma do servidor.
:::

O nome de cada tag que você define aqui é exatamente o que depois você usa em `chat-moderation.action.tag-overrides` acima. Reaplicado automaticamente a cada `/solver reload` — sem precisar reiniciar para adicionar uma categoria nova.

## Comandos Independentes

Permite que cada grupo de comandos (veja [Comandos](/pt/solver/commands#comandos-independentes)) também se registre sem o prefixo `/solver` — desative uma categoria se outro plugin instalado já usa um desses nomes:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (a menos que o EssentialsX esteja instalado)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## CommandSpy

Repasse ao vivo de cada comando executado no servidor para qualquer staff que o tenha ativado com `/solver commandspy` — ao contrário de um registro retrospectivo, isso aparece conforme acontece.

```yaml
commandspy:
  enabled: true
  watch-patterns: ["*"]
  exempt-players: []
  exempt-permissions: []
```

| Chave | Tipo | Padrão | Descrição |
|-----|------|---------|-------------|
| `commandspy.enabled` | Booleano | `true` | Chave geral. |
| `commandspy.watch-patterns` | Lista | `["*"]` | `"*"` observa todos os comandos. Caso contrário, liste nomes de comandos específicos (sem a `/` inicial) para repassar só esses, ex.: `["op", "gamemode", "give"]`. |
| `commandspy.exempt-players` | Lista | `[]` | Nomes de jogadores (sem diferenciar maiúsculas/minúsculas) nunca repassados, não importa quem esteja observando. |
| `commandspy.exempt-permissions` | Lista | `[]` | Qualquer um com uma dessas permissões também nunca é repassado. |

## `/solver inspect` e `/solver enderchest`

```yaml
inspect:
  live-refresh: false
  live-refresh-interval-ticks: 10
```

| Chave | Tipo | Padrão | Descrição |
|-----|------|---------|-------------|
| `inspect.live-refresh` | Booleano | `false` | Continua recapturando o inventário aberto a cada poucos ticks em vez de uma captura única. Isso é polling, não uma atualização real por evento — o Bukkit não tem um evento de "inventário mudou". Compartilhado entre `/solver inspect` e `/solver enderchest`. |
| `inspect.live-refresh-interval-ticks` | Inteiro | `10` | A cada quantos ticks atualizar, quando a opção acima está ativa. |

## Staff Mode Toolkit

```yaml
staff-mode:
  profiles: {}
  #  moderator:
  #    vanish: true
  #    freeze-immunity: true
  #    flight: true
  #    god-mode: true
  #    clear-inventory: true
  #  builder:
  #    flight: true
  vanish:
    invulnerable-while-vanished: false
    hide-from-server-list: true
  freeze:
    allowed-commands: ["msg", "tell", "r", "helpop"]
```

| Chave | Tipo | Padrão | Descrição |
|-----|------|---------|-------------|
| `staff-mode.profiles.<nome>` | Seção | *(vazio)* | Perfil combinado com nome para `/solver staffmode <nome>` — alterna um conjunto de ferramentas de staff de uma vez. Cada campo é opcional e por padrão desligado (`vanish`, `freeze-immunity`, `flight`, `god-mode`, `clear-inventory`). `clear-inventory` sempre salva seus itens antes e os restaura ao sair do perfil. |
| `staff-mode.vanish.hide-from-server-list` | Booleano | `true` | Também subtrai jogadores em vanish da contagem de jogadores da lista de servidores. |
| `staff-mode.vanish.invulnerable-while-vanished` | Booleano | `false` | Torna um jogador imune a dano enquanto está em vanish. |
| `staff-mode.freeze.allowed-commands` | Lista | `["msg", "tell", "r", "helpop"]` | Comandos (sem a `/` inicial) que um jogador congelado ainda pode usar. O próprio comando de alternar o congelamento sempre funciona independente dessa lista, então um staff congelado nunca fica preso para sempre. |

`/solver vanish strict` e `solver.staffmode.vanish.see-strict` (uma permissão separada, não herdada do vanish normal) adicionam um segundo nível invisível até para a maioria do staff. Um staff com `solver.staffmode.silentjoin` entra já em vanish, sem mensagem de entrada.

## Sistema de Sanções

### Backend de armazenamento

```yaml
punishments:
  storage: sqlite
  mysql:
    host: localhost
    port: 3306
    database: solver
    user: solver
    password: ""
```

`sqlite` (padrão, sem configuração, `sanctions.db`) ou `mysql` para instalações multi-servidor que compartilham um único banco de sanções — mesmos comandos, mesmos dados em qualquer caso. O histórico de sanções e mutes/banimentos ativos são restaurados automaticamente ao entrar ou reiniciar o servidor, independente do backend usado.

### Modelos de motivo e escalonamento de avisos

```yaml
punishments:
  reason-templates: {}
  #  griefing:
  #    text: "Grief / destruição de construções de outros jogadores"
  #    duration: "1d"
  warn-escalation: {}
  #  "3":
  #    action: sanction
  #    type: kick
  #    reason: "Auto: 3 avisos"
  #  "5":
  #    action: sanction
  #    type: tempban
  #    duration: "1d"
  #    reason: "Auto: 5 avisos"
```

- **`reason-templates`** — `/solver ban Jogador #griefing` expande `#griefing` para o `text` configurado (e a `duration`, se o tipo de sanção precisar e nenhuma tiver sido dada explicitamente). Um `#nome` sem modelo correspondente é mantido como motivo literal, então isso nunca quebra um motivo que legitimamente comece com `#`.
- **`warn-escalation`** — depois que um `WARN` é registrado, se a contagem total de avisos do jogador corresponder a uma chave aqui, a ação configurada dispara automaticamente: `action: sanction` aplica outra sanção (mesmos campos `type`/`reason`/`duration` de uma manual), `action: command` executa um comando de console em vez disso (`{player}` é substituído pelo nome do jogador).

### Recursos (Appeals)

```yaml
punishments:
  appeals:
    show-in-sanction-message: true
```

Mostra uma linha apontando para `/solver appeal <id> <motivo>` nas mensagens de warn/mute/kick/ban, inteiramente no jogo — sem webhook do Discord. O staff é notificado imediatamente quando chega um novo recurso, da mesma forma que já acontece com uma nova denúncia.

## Estatísticas de Uso

```yaml
metrics:
  enabled: true
```

Estatísticas de uso anônimas via [bStats](https://bstats.org/plugin/bukkit/Solver/33362) — quantidade de servers, qual provedor de IA está configurado, quais recursos estão ativos. Nada identificável por jogador. Defina `metrics.enabled: false` para desativar, independente do interruptor global do bStats em `plugins/bStats/config.yml` (que também sempre se aplica).

## Relay de Proxy

::: tip O mesmo jar no proxy
Esta seção só ativa o relay neste backend. O proxy também precisa do mesmo `Solver.jar` instalado — veja [Redes com Proxy](/pt/solver/proxy-relay), que também cobre o AntiVPN e a integridade no proxy.
:::

```yaml
proxy-relay:
  enabled: false
```

Desativado por padrão. Quando ativado, retransmite mensagens de staffchat e alertas de moderação/integridade para a staff conectada em qualquer backend da mesma rede BungeeCord/Waterfall/Velocity, não só naquele onde o alerta aconteceu.

## Idiomas Suportados

| Código | Idioma |
|------|----------|
| `en_US` | Inglês (Estados Unidos) |
| `es_ES` | Espanhol (Espanha) |
| `pt_BR` | Português (Brasil) |
| `de_DE` | Alemão |
| `fr_FR` | Francês |
| `ru_RU` | Russo |
| `ja_JP` | Japonês |
| `ko_KR` | Coreano |
| `eo_EO` | Esperanto |

Cada mensagem visível para jogadores/staff (ajuda, erros, sanções, alertas de moderação) fica em `plugins/Solver/lang/<idioma>/messages.yml` com suporte completo a [MiniMessage](https://docs.papermc.io/adventure/minimessage/format), e é seguro de editar — suas personalizações são preservadas entre atualizações.

## Usando Provedores de IA Alternativos

### Google Gemini

```yaml
ai-provider:
  provider: "google"
  model: "Flash"
  google-key: "AIza..."
```

### OpenAI ou Qualquer API Compatível

```yaml
ai-provider:
  provider: "other"
  model: "gpt-4o"
  other-key: "sk-..."
  other-url: "https://api.openai.com/v1/chat/completions"
```

Isso também funciona com modelos locais via **Ollama** ou **LM Studio**, apontando `other-url` para o endpoint local deles.
