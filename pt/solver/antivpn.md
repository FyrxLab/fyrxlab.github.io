# AntiVPN

::: tip Novo na 0.10.0
:::

O Solver verifica cada jogador que se conecta contra redes conhecidas de VPN e proxy antes de ele entrar, combina o que encontra em uma pontuação explicável e — só quando você permite — recusa a conexão.

## Como detecta

As fontes são tentadas da mais barata à mais cara, e uma posterior só roda se as anteriores não encontraram nada:

| Fonte | O que é | Chamada de rede por login? |
|-------|---------|----------------------------|
| `x4bnet-vpn` | Lista estática de faixas de VPN conhecidas ([X4BNet](https://github.com/X4BNet/lists_vpn), MIT), baixada uma vez por dia e comparada em memória. | Não |
| `x4bnet-datacenter` | A lista mais ampla do mesmo projeto (VPN + hospedagem). Desligada por padrão — também marca jogadores no próprio VPS. | Não |
| `ipquery` | Consulta em tempo real ao [IPQuery.io](https://ipquery.io), só para endereços que a lista não cobriu. | Sim |
| `ipapiis` | [ipapi.is](https://ipapi.is), último recurso. Sem key só devolve a rede (ASN); com uma key gratuita adiciona flags de VPN/proxy/Tor. | Sim |
| `bad-asn-list` | Redes conhecidas de VPN de consumo (NordVPN, Mullvad, ExpressVPN, Proton, Surfshark...), incluindo empresas de VPN cujo nome de rede não diz "VPN", cruzadas com o ASN que as consultas resolveram — pega uma faixa nova antes de qualquer lista. | Não |

Endereços locais e de LAN nunca são consultados. Cada veredito fica em cache por IP (`cache-ttl-hours`, padrão 24); se todas as consultas em tempo real falharem, nada vai para o cache e o endereço é verificado de novo no próximo login.

## A pontuação

Cada fonte que dispara vira um sinal com sua própria confiança. Os sinais se combinam em uma única pontuação de 0 a 100, e o veredito sempre mostra o detalhamento:

```
185.220.101.1 is flagged: VPN (source: x4bnet-vpn)
score 90.0 <- x4bnet-vpn (SOLVER_OWN) +90.0
```

O que acontece com cada pontuação depende do perfil:

| Perfil | Aviso | Expulsão |
|--------|-------|----------|
| `conservative` (padrão) | 50 | 80 |
| `balanced` | 40 | 70 |
| `strict` | 30 | 55 |
| `custom` | seus números em `reasoning.custom` | |

## Janela de calibração

Na primeira vez que o AntiVPN é ativado, ele só alerta — mesmo com `action.mode: auto-action` — até ter visto `reasoning.bootstrap.min-flags` detecções reais (padrão 20) ou até passarem `max-days` (padrão 7). `/solver vpn status` mostra o progresso. Consultas manuais com `/solver vpn check` não contam.

## Ações

```yaml
antivpn:
  action:
    mode: "alert-only"          # alert-only | auto-action
    persist-as-sanction: true   # registra os logins bloqueados em /solver history como KICK
```

Com `auto-action`, uma conexão é recusada quando a pontuação atinge o limite de expulsão do perfil. Os alertas chegam a todos com `solver.notify`, e também a outros backends se o [Relay de Proxy](/pt/solver/proxy-relay) estiver ativo.

## FoxGate

Se o [FoxGate](https://modrinth.com/plugin/foxgate) estiver instalado, o Solver **nunca** expulsa nem bane por VPN — isso não é configurável. Você só escolhe como o Solver sai do caminho:

```yaml
antivpn:
  foxgate-mode: "addon"   # addon: continua verificando e alertando | off: não roda de jeito nenhum
```

## Whitelist

```
/solver vpn whitelist add 203.0.113.7
/solver vpn whitelist add 198.51.100.0/24
```

Vale na hora, sem reiniciar. Também editável em `antivpn.whitelist` no `config.yml`.

## Privacidade

`ipquery` e `ipapiis` enviam o IP do jogador que se conecta para esse serviço externo — só para endereços que as listas estáticas e o cache não resolveram. As listas estáticas nunca enviam nada. Desligue qualquer fonte em `antivpn.own_engine.sources`, ou o AntiVPN inteiro com `antivpn.own_engine.enabled: false`.

## Comandos

| Comando | Permissão |
|---------|-----------|
| `/solver vpn status` | `solver.vpn.check` |
| `/solver vpn check <jogador\|ip>` | `solver.vpn.check` |
| `/solver vpn whitelist add\|remove\|list <ip\|cidr>` | `solver.vpn.whitelist` |
| `/solver vpn clearcache` | `solver.vpn.clearcache` |
