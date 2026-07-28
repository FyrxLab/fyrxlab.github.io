# Comandos

O AbsoluteSolver fornece um único comando raiz com subcomandos agrupados em quatro áreas: diagnóstico, o Sistema de Sanções, o Sistema de Denúncias de Staff e o Staff Mode Toolkit.

## `/solver`

**Aliases:** `/as`
**Permissão:** `solver.admin` (padrão: OP) concede tudo abaixo; veja [Permissões](#permissões) para os nós granulares.

A maioria dos subcomandos também está disponível como seu próprio comando independente (ex.: `/vanish` em vez de `/solver vanish`) — veja [Comandos Independentes](#comandos-independentes).

---

### Diagnóstico

| Subcomando | Descrição | Permissão |
|------------|-------------|---------|
| `help` | Mostra a lista de comandos no jogo. | — |
| `reload` | Recarrega o `config.yml` e reinicia a IA sem reiniciar o servidor. | `solver.diagnostics.reload` |
| `analyze-last` | Reanalisa manualmente o relatório de crash mais recente em `crash-reports/`. | `solver.diagnostics.analyzelast` |
| `crashme <exception\|deadlock\|oom>` | Aciona um crash de teste **real** do tipo indicado. | `solver.diagnostics.crashme` |
| `crashme dry-run` | Envia um relatório de crash sintético ao Fyrx para diagnóstico sem realmente afetar o servidor. | `solver.diagnostics.crashme` |
| `moderation status` | Mostra o status da moderação de chat: tamanho do buffer, jogadores rastreados, último veredicto, confiança média, contagem regressiva para a próxima varredura. | `solver.diagnostics.moderation` |
| `moderation test <mensagem>` | Simula uma análise de moderação em uma mensagem arbitrária. | `solver.diagnostics.moderation` |

### Sistema de Sanções

::: warning Beta
:::

| Subcomando | Descrição | Permissão |
|------------|-------------|---------|
| `warn \| mute \| tempmute \| kick \| ban \| tempban <jogador> [duração] <motivo>` | Aplica a sanção correspondente. `duração` é obrigatória para as variantes temp- (ex.: `30s`, `10m`, `1d`). O motivo também pode ser `#nome`, que se expande em um [modelo de motivo](/pt/solver/configuration#modelos-de-motivo-e-escalonamento-de-avisos) configurado em `config.yml`. | `solver.sanctions.<tipo>` |
| `unban \| unmute \| unwarn <jogador>` | Reverte uma sanção ativa daquele tipo. | `solver.sanctions.<tipo>` |
| `history <jogador>` | Mostra o histórico completo de sanções de um jogador. | `solver.sanctions.history` |
| `check <id>` | Mostra o detalhe de uma sanção pelo seu ID. | `solver.sanctions.check` |
| `note <jogador> <texto>` | Salva uma nota interna sobre um jogador — nunca mostrada a ele. | `solver.sanctions.note` |
| `checkuser <jogador>` | Cruza o histórico de IP: mostra cada conta alternativa conhecida de um jogador e qualquer sanção ativa ligada a toda aquela rede, não só ao nome exato da conta. | `solver.sanctions.checkuser` |
| `appeal <id> <motivo>` | Permite que um **jogador sancionado** recorra da própria sanção diretamente no jogo. Aberto a todos por padrão. | `solver.sanctions.appeal` (padrão: **true**) |
| `appeal list \| accept \| reject <id>` | O staff analisa recursos pendentes; `accept` reverte a sanção, `reject` a mantém. | `solver.sanctions.appeal.manage` |
| `sanctions <jogador>` | Abre uma GUI navegando pelo histórico completo de sanções de um jogador; clique em uma ativa para o comando exato de revogá-la. | `solver.sanctions.gui` |

Cada sanção recebe um ID real, persiste em `sanctions.db` (ou em um banco de dados MySQL — veja [Configuração](/pt/solver/configuration#armazenamento-de-sancoes)), e é aplicada mesmo que o servidor reinicie. Banimentos rejeitam o login diretamente e expulsam instantaneamente qualquer outra conta online que já tenha compartilhado um IP com a banida; mutes e durações ativas são restaurados ao entrar.

### Denúncias de Staff

Novidade da 0.8.0. Permite que qualquer jogador sinalize algo para a atenção do staff, completamente separado do Sistema de Sanções — uma denúncia não é uma punição.

| Subcomando | Descrição | Permissão |
|------------|-------------|---------|
| `report <jogador> <motivo>` | Registra uma denúncia contra um jogador, capturando sua localização atual como contexto. Aberto a todos por padrão. | `solver.report` (padrão: **true**) |
| `reports` | Lista todas as denúncias abertas. | `solver.reports.manage` |
| `reports claim \| close \| reopen <id> [motivo]` | Gerencia a fila. Quem denunciou recebe uma mensagem direta no jogo quando sua denúncia é assumida ou fechada. | `solver.reports.manage` |
| `reports gui` | Abre uma GUI de denúncias abertas — clique esquerdo assume, clique direito fecha. | `solver.reports.gui` |

### Staff Mode Toolkit

::: warning Beta
:::

| Subcomando | Descrição | Permissão |
|------------|-------------|---------|
| `vanish [strict]` | Alterna seu próprio modo vanish. `strict` é um segundo nível, invisível até para a maioria do staff, que exige uma permissão separada para enxergar através dele. Oculto de outros jogadores, subtraído da contagem da lista de servidores, mobs param de te mirar, e seu nome não vaza mais pelo autocompletar. | `solver.staffmode.vanish` (`.vanish.see-strict` para enxergar através do strict) |
| `freeze <jogador>` | Alterna o congelamento de um jogador: bloqueia seu movimento, a maioria dos comandos, e combate. O próprio comando de alternar o congelamento sempre funciona em um jogador já congelado, mesmo sem outro staff online para descongelá-lo. | `solver.staffmode.freeze` |
| `freeze <jogador> <mensagem>` | Envia uma mensagem no canal de chat privado de congelamento daquele jogador em vez de alternar — permite conversar de verdade com alguém durante um screenshare em vez de só silenciá-lo. | `solver.staffmode.freeze` |
| `staffchat [mensagem]` | Sem mensagem, alterna um modo em que tudo que você digita vai só para o staff. Com uma mensagem, envia uma mensagem avulsa só para o staff sem alternar o modo. | `solver.staffmode.staffchat` |
| `commandspy` | Alterna um repasse **ao vivo** de cada comando executado por outros jogadores direto no seu chat — não só um registro retrospectivo. | `solver.staffmode.commandspy` |
| `staffmode <perfil>` | Alterna um perfil combinado com nome que você define em `config.yml` (vanish + imunidade a congelamento + voo + modo deus + esvaziamento de inventário). Seu inventário é sempre salvo e restaurado automaticamente. | `solver.staffmode.profiles` |
| `fly` | Alterna o voo, independente de qualquer perfil. | `solver.staffmode.fly` |
| `god` | Alterna a invulnerabilidade, incluindo dano de PvP. | `solver.staffmode.god` |
| `rtp` | Te teleporta para um jogador não-staff aleatório online, para rondas de supervisão. | `solver.staffmode.rtp` |
| `inspect <jogador>` | Abre uma visão do inventário principal, armadura e mão secundária de um jogador sem abri-lo fisicamente. Clique em um item para confiscá-lo diretamente do inventário real dele. | `solver.staffmode.inspect` |
| `enderchest <jogador>` | O mesmo tratamento de visualizar/confiscar para o ender chest de um jogador — permanece como comando próprio porque uma janela de inventário do Bukkit tem um teto de 54 slots, e a visão do `inspect` já usa 41. | `solver.staffmode.enderchest` |

Um jogador com `solver.staffmode.silentjoin` entra já em vanish, sem nenhuma mensagem de entrada.

---

## Comandos Independentes

Os grupos de comandos de Sanções, Staff Mode, Denúncias e Moderação também são registrados diretamente, sem o prefixo `/solver` — `/solver <comando>` continua funcionando exatamente como antes de qualquer forma:

- **Staff Mode:** `/vanish`, `/freeze`, `/staffchat`, `/commandspy`, `/staffmode`, `/fly`, `/god`, `/inspect`, `/enderchest` (desativado automaticamente se o EssentialsX estiver instalado — seu próprio `/enderchest` significa "mostrar o meu", um significado diferente do nosso)
- **Sanções:** `/warn`, `/mute`, `/tempmute`, `/kick`, `/ban`, `/tempban`, `/unban`, `/unmute`, `/unwarn`, `/history`, `/check`, `/note`, `/checkuser`, `/appeal`, `/sanctions`
- **Moderação:** `/moderation`
- **Denúncias:** `/report`

`rtp` não tem forma independente de propósito — esse nome já é um comando muito comum de "teleporte aleatório dentro da borda do mundo" no resto do ecossistema de plugins, e significa algo diferente do nosso.

Cada categoria pode ser desativada independentemente no `config.yml` se outro plugin instalado já usar um desses nomes:

```yaml
standalone-commands:
  staff-mode: true  # /vanish, /freeze, /staffchat, /commandspy, /enderchest (a menos que o EssentialsX esteja instalado)
  sanctions: true   # /warn, /mute, /tempmute, /kick, /ban, /tempban, /unban, /unmute, /unwarn, /history, /check, /note, /checkuser, /appeal, /sanctions
  moderation: true  # /moderation
  reports: true     # /report
```

## Exemplos de Uso

**Acionar uma análise de crash manual:**
```
/solver analyze-last
```

**Testar o diagnóstico sem um crash real:**
```
/solver crashme dry-run
```

**Avisar, e depois silenciar temporariamente, um jogador:**
```
/solver warn Steve Spam no chat
/solver tempmute Steve 10m Spam continuado após o aviso
```

**Verificar o histórico de sanções de um jogador:**
```
/solver history Steve
```

**Procurar contas alternativas antes de decidir banir:**
```
/solver checkuser Steve
```

**Recorrer da própria sanção:**
```
/solver appeal 42 Eu estava me defendendo
```

**Denunciar um jogador ao staff:**
```
/solver report Steve Fazendo grief na minha base
```

**Alternar seu próprio vanish (ou a forma independente):**
```
/solver vanish
/vanish
```

::: warning Os Testes de Crash São Perigosos
Os subcomandos `crashme exception|deadlock|oom` são destinados **apenas para testes** em um ambiente de desenvolvimento. **Não** execute `crashme oom` em um servidor de produção — isso causará um OutOfMemoryError real. Use `crashme dry-run` se só quiser ver a saída de diagnóstico do Fyrx com segurança.
:::

---

## Permissões

As permissões são agrupadas para que você possa conceder uma categoria inteira de uma vez (ex.: via LuckPerms) sem dar acesso total de administrador.

| Permissão | Padrão | Descrição |
|------------|---------|-------------|
| `solver.admin` | OP | Acesso completo a tudo abaixo. |
| `solver.notify` | OP | Recebe notificações no jogo de erros e alertas de moderação de chat. |
| `solver.moderation.bypass` | false | Isenta este jogador específico da moderação de chat, OP ou não. |
| `solver.diagnostics.*` | false | Todos os comandos de diagnóstico (`reload`/`analyze-last`/`crashme`/`moderation`). |
| `solver.sanctions.*` | false | Todos os comandos de sanções, incluindo `checkuser`, `appeal.manage` e a GUI `sanctions`. |
| `solver.staffmode.*` | false | Todos os comandos do Staff Mode Toolkit. |
| `solver.reports.*` | false | Todos os comandos de denúncias. |
| `solver.report` | **true** | Registrar uma denúncia (`/solver report`). Aberto a todos por padrão. |
| `solver.sanctions.appeal` | **true** | Recorrer da própria sanção (`/solver appeal <id> <motivo>`). Aberto a todos por padrão. |

Cada subcomando também tem sua própria permissão individual (ex.: `solver.sanctions.warn`, `solver.staffmode.vanish`, `solver.staffmode.commandspy`, `solver.staffmode.inspect`, `solver.staffmode.enderchest`, `solver.staffmode.vanish.see-strict`, `solver.reports.manage`, `solver.reports.gui`) caso precise de um controle mais fino que os grupos coringa acima.

Você pode conceder essas permissões usando qualquer plugin de permissões (ex.: LuckPerms):

```
/lp user <jogador> permission set solver.sanctions.* true
```
