# Relay de Proxy

::: warning Novo na 0.9.2 — só relay de chat/logs, não suporte completo a proxy
O Solver só roda em servers individuais da família Bukkit (Paper, Purpur, Spigot, CraftBukkit, Folia). Um proxy não tem mundos, inventários ou jogadores com estado de jogo, então sanções, vanish e GUIs não rodam ali — o relay só retransmite texto de alertas e staffchat pela sua rede. O Sponge não tem relação com esse recurso e continua sem suporte.
:::

Se você roda uma rede BungeeCord, Waterfall ou Velocity com mais de um backend potencializado pelo Solver, o relay de proxy faz com que as mensagens de staffchat e os alertas de moderação/integridade cheguem à staff conectada em *qualquer* backend, não só naquele onde o alerta aconteceu.

## O que é retransmitido

- Mensagens de `/solver staffchat` (e o modo staffchat ativado)
- Alertas de moderação de chat (Fyrx IA)
- Alertas de integridade — hash do jar não corresponde, correspondência de malware, agente Java detectado

Nada mais. Nenhuma sanção, estado de vanish ou dado de GUI atravessa a rede — veja o aviso acima para o porquê.

## Configuração

### 1. Ative o relay em cada backend

No `plugins/Solver/config.yml` de cada backend:

```yaml
proxy-relay:
  enabled: false   # mudar para true
```

Desativado por padrão — um relay em toda a rede é uma mudança real de comportamento, então é opt-in.

### 2. Instale o plugin correspondente no proxy

O lado do proxy é um **plugin separado e pequeno** — não faz parte do `Solver.jar` que você instala nos backends. Escolha o que corresponde ao seu software de proxy:

- **BungeeCord ou Waterfall** (compartilham a mesma API de plugins) → `solver-proxy-bungee.jar`
- **Velocity** → `solver-proxy-velocity.jar`

Coloque o jar correspondente na pasta `plugins/` do próprio proxy e reinicie o proxy. Não tem arquivo de configuração próprio — ativa assim que um backend conectado tiver `proxy-relay.enabled: true` e enviar sua primeira mensagem.

### 3. Confirme que está rodando

Ao iniciar o proxy, o console imprime uma linha:

```
SolverProxy (Bungee/Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Quem recebe as mensagens retransmitidas

O relay só chega a jogadores com `solver.notify` (para alertas) ou `solver.staffmode.staffchat` (para staffchat) — as mesmas permissões usadas localmente em cada backend. Como o proxy verifica essa permissão depende do que está instalado:

- **LuckPerms instalado no proxy** — usado diretamente. Se sua instalação do LuckPerms compartilha storage em toda a rede, isso já corresponde ao que cada backend concede, sem mais nada para configurar.
- **Sem LuckPerms no proxy** — cada backend avisa periodicamente ao proxy quais jogadores conectados atualmente têm `solver.notify`, e o proxy retransmite para a união de todos os reportados por qualquer backend. Esse é o padrão se você não instalou o LuckPerms do lado do proxy.

## Compatibilidade

| Proxy | Plugin | Notas |
|-------|--------|-------|
| Velocity | `solver-proxy-velocity.jar` | Requer Java 11+ no proxy. |
| Waterfall | `solver-proxy-bungee.jar` | O Waterfall chegou ao fim de vida upstream — a PaperMC recomenda migrar para o Velocity. O plugin ainda funciona hoje nele. |
| BungeeCord | `solver-proxy-bungee.jar` | Mesmo plugin do Waterfall. |
