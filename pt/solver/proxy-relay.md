# Redes com Proxy

::: tip Atualizado na 0.10.2 — AntiVPN e integridade no proxy
O proxy agora pode verificar cada conexão uma única vez para toda a rede e verificar o próprio jar. O mesmo `Solver.jar` de sempre.
:::

Coloque o **mesmo `Solver.jar`** que você usa nos backends no seu proxy BungeeCord, Waterfall ou Velocity. Não existe um plugin de proxy separado: BungeeCord/Waterfall leem o `bungee.yml` dele, o Velocity o `velocity-plugin.json`, e nenhum carrega o código do Bukkit. No proxy ele faz três coisas:

1. **Retransmite** o staffchat e os alertas de moderação/integridade/VPN para que cheguem à staff de *qualquer* backend.
2. **AntiVPN** — verifica cada conexão antes que ela chegue a um servidor.
3. **Integridade** — verifica o próprio jar e escaneia os outros plugins do proxy.

Sanções, vanish e GUIs ficam nos backends: um proxy não tem mundos, inventários nem jogadores com estado de jogo.

## Instalação

1. Coloque o `Solver.jar` na pasta `plugins/` do proxy e reinicie o proxy.
2. Ao iniciar, ele cria a própria config: `plugins/SolverProxy/config.yml` (BungeeCord/Waterfall) ou `plugins/solverproxy/config.yml` (Velocity). As chaves significam exatamente o mesmo que no `config.yml` de um backend.
3. O console confirma que está rodando:

```
SolverProxy (Velocity) enabled - staff permission source: LuckPerms | per-server roster fallback
```

## Relay

Ative no `plugins/Solver/config.yml` de **cada backend**:

```yaml
proxy-relay:
  enabled: true
```

Desligado por padrão — um relay para a rede inteira é uma mudança real de comportamento, então é opcional. O que é retransmitido:

- As mensagens do `/solver staffchat` (e o modo staffchat ativado)
- Os alertas de moderação de chat (Fyrx AI)
- Os alertas de integridade — jar que não corresponde, malware detectado, Java agent detectado
- Os alertas do [AntiVPN](/pt/solver/antivpn)

A staff do servidor onde a mensagem começou já a vê localmente, então o relay não envia uma segunda cópia. Um alerta gerado enquanto um backend não tem ninguém online (comum no AntiVPN, que dispara antes de o jogador entrar) fica guardado e é entregue assim que alguém entra nesse backend.

### Quem recebe as mensagens

Jogadores com `solver.notify` (alertas) ou `solver.staffmode.staffchat` (staffchat) — as mesmas permissões usadas em cada backend. Como o proxy verifica isso:

- **LuckPerms instalado no proxy** — usado diretamente. Se o seu LuckPerms compartilha o armazenamento na rede toda, isso já corresponde ao que cada backend concede.
- **Sem LuckPerms no proxy** — cada backend informa ao proxy quais jogadores conectados têm `solver.notify`, e o proxy usa todos os informados por qualquer backend. É o padrão.

## AntiVPN no proxy

Ligado por padrão na config do proxy. Cada conexão é verificada antes de chegar a qualquer servidor, com o mesmo motor de um backend — fontes, [perfis](/pt/solver/antivpn), janela de calibração, whitelist — sob as mesmas chaves (`antivpn.*`, `reasoning.*`).

::: warning Desligue nos backends
Se o proxy usa o AntiVPN, coloque isto no `config.yml` de cada backend, ou cada conexão é verificada e alertada duas vezes:

```yaml
antivpn:
  own_engine:
    enabled: false
```

O proxy lembra você disso no console ao iniciar. Um backend não consegue detectar isso sozinho com segurança: um jogador poderia falsificar uma mensagem dizendo "o proxy já verifica".
:::

- **Alertas**: chegam a toda a staff conectada à rede, com a etiqueta `[proxy]`.
- **Bloqueio**: com `antivpn.action.mode: auto-action` (e a janela de calibração concluída), o jogador é recusado no proxy e nunca chega a um servidor. A mensagem que ele vê é `antivpn.kick-message` na config do proxy (MiniMessage).
- O **FoxGate** no proxy funciona igual a um backend: o Solver nunca bloqueia ninguém, e `antivpn.foxgate-mode` escolhe `addon` (continuar alertando) ou `off`.
- Os veredictos ficam salvos em `antivpn.db` ao lado da config do proxy, então reiniciar o proxy não consulta todos os jogadores de novo.

Não há comandos `/solver vpn` no proxy: edite a whitelist em `antivpn.whitelist` na config do proxy e reinicie-o.

## Integridade no proxy

As mesmas verificações de um backend, configuradas em `integrity.*` na config do proxy:

- **Verificação do build** — o jar do Solver do proxy é comparado com a versão oficial no Modrinth. Um build de desenvolvimento só é informado, nunca marcado.
- **Varredura de malware** — cada outro `.jar` na pasta `plugins/` do proxy é comparado com a lista assinada de hashes de malware conhecido (Java 15+).
- **Detecção de Java agents** — um aviso se um agent foi anexado à JVM do proxy na inicialização.

Os alertas vão para o console do proxy e para a staff da rede, com a etiqueta `[proxy]`.

## Compatibilidade

| Proxy | Notas |
|-------|-------|
| Velocity 3.x / 4.x | Requer Java 11+ no proxy. |
| Waterfall | Fim de vida upstream — a PaperMC recomenda o Velocity. Ainda funciona hoje. |
| BungeeCord | Igual ao Waterfall. |
