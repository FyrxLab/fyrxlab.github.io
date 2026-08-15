# Compatibilidade

## Software de Servidor

| Loader | Suportado | Notas |
|--------|-----------|-------|
| **Paper** | ✅ Recomendado | Totalmente suportado. Melhor integração com Log4j. |
| **Purpur** | ✅ Recomendado | Totalmente suportado e testado. |
| **Spigot** | ✅ Suportado (1.8.8+) | Totalmente suportado, incluindo a [Moderação de Chat com IA](/pt/solver/fyrx-ai) — sem exigir o Paper. |
| **CraftBukkit** | ✅ Suportado (1.8.8+) | Mesmo nível de suporte que o Spigot. |
| **Folia** | ✅ Suportado | O TickMonitor é desativado automaticamente (o Folia gerencia seu próprio watchdog). Todos os outros recursos funcionam. |
| **Velocity** | ⚠️ Parcial (só relay) | Não é um alvo de instalação do Solver — um plugin pequeno e separado retransmite staffchat/alertas entre seus backends. Veja [Relay de Proxy](/pt/solver/proxy-relay). |
| **BungeeCord** | ⚠️ Parcial (só relay) | Mesmo plugin de relay do Waterfall. Veja [Relay de Proxy](/pt/solver/proxy-relay). |
| **Waterfall** | ⚠️ Parcial (só relay) | Mesmo plugin de relay do BungeeCord. Veja [Relay de Proxy](/pt/solver/proxy-relay). |
| **Forge / Fabric** | ❌ Não suportado | Loaders de mod; não usam a API Bukkit. |
| **Sponge** | ❌ Não suportado | Usa a SpongeAPI, não o Bukkit. |

::: tip Suporte ao Folia
O AbsoluteSolver é **compatível com Folia**. Ao rodar em um servidor Folia, o plugin detecta automaticamente o ambiente multithread e desativa o TickMonitor para evitar conflitos — já que o Folia tem seu próprio sistema de Watchdog regional. Todos os outros diagnósticos (monitoramento de console, análise de crash, post-mortem) continuam totalmente funcionais.
:::

## Versões do Minecraft

| Versão | Status | Notas |
|---------|--------|-------|
| 1.21.x | ✅ Suportado | Roda em Java 21, totalmente compatível. |
| 1.20.x | ✅ Suportado | Alvo de desenvolvimento principal. Totalmente testado. |
| 1.13.x – 1.19.x | ✅ Suportado | |
| 1.8.8 – 1.12.x | ✅ Suportado | Versão mínima suportada. Algumas conveniências exclusivas do Paper (ex. esconder um jogador em vanish da contagem na lista de servidores) não estão disponíveis aqui — não há equivalente vanilla — mas todo o resto funciona da mesma forma. |
| 1.7.10 e anteriores | ❌ Ainda não suportado | Planejado, mas ainda não compilável/disponível. |

## Versão do Java

O Solver é compilado visando **Java 8**. Ele vai rodar em qualquer JVM versão 8 ou superior (incluindo Java 17/21).

::: tip Java 8 ou Superior
O Solver funciona a partir do Java 8 — não é preciso atualizar o runtime Java do seu servidor para usá-lo.
:::
