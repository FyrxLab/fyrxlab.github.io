# Relay de Proxy

::: tip Atualizado na 0.10.0 — um só jar para tudo
O Solver roda em servidores da família Bukkit. Em um proxy, o mesmo jar só roda um relay pequeno: um proxy não tem mundos, inventários nem jogadores com estado de jogo, então sanções, vanish e GUIs ficam nos backends.
:::

Se você tem uma rede BungeeCord, Waterfall ou Velocity com mais de um backend com Solver, o relay faz as mensagens de staffchat e os alertas de moderação/integridade/VPN chegarem à staff conectada em *qualquer* backend, não só naquele em que surgiram.

## O que é retransmitido

- Mensagens de `/solver staffchat` (e o modo staffchat ativado)
- Alertas de moderação de chat (IA Fyrx)
- Alertas de integridade — jar que não confere, malware detectado, Java agent detectado
- Alertas do [AntiVPN](/pt/solver/antivpn)

A staff do servidor onde a mensagem nasceu já a vê localmente, então o relay não manda uma segunda cópia. Um alerta gerado enquanto um backend não tem ninguém online (típico do AntiVPN, que dispara antes de o jogador entrar) fica guardado e é entregue assim que alguém entra nesse backend.

## Instalação

### 1. Ative o relay em cada backend

No `plugins/Solver/config.yml` de cada backend:

```yaml
proxy-relay:
  enabled: true
```

Desativado por padrão — um relay em toda a rede é uma mudança real de comportamento, então é opcional.

### 2. Instale o mesmo jar no proxy

Coloque **o mesmo `Solver.jar`** dos seus backends na pasta `plugins/` do proxy e reinicie o proxy — não existe um plugin de proxy separado. BungeeCord/Waterfall leem o `bungee.yml` dele e o Velocity o `velocity-plugin.json`; nenhum carrega código do Bukkit. Sem arquivo de configuração próprio.

### 3. Confirme que está rodando

Ao iniciar o proxy, o console mostra uma linha:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Quem recebe as mensagens

O relay só chega a jogadores com `solver.notify` (alertas) ou `solver.staffmode.staffchat` (staffchat) — as mesmas permissões usadas localmente em cada backend. Como o proxy verifica isso depende do que está instalado:

- **LuckPerms instalado no proxy** — usado diretamente. Se o seu LuckPerms compartilha o armazenamento na rede toda, já corresponde ao que cada backend concede.
- **Sem LuckPerms no proxy** — cada backend informa ao proxy quais jogadores conectados têm `solver.notify`, e o proxy retransmite para todos os informados por qualquer backend. É o comportamento padrão.

## Compatibilidade

| Proxy | Notas |
|-------|-------|
| Velocity 3.x / 4.x | Requer Java 11+ no proxy. |
| Waterfall | Fim de vida upstream — a PaperMC recomenda o Velocity. Ainda funciona hoje. |
| BungeeCord | Igual ao Waterfall. |
