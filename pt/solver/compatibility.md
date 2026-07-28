# Compatibilidade

## Software de Servidor

| Loader | Suportado | Notas |
|--------|-----------|-------|
| **Paper** | ✅ Recomendado | Totalmente suportado. Melhor integração com Log4j. |
| **Purpur** | ✅ Recomendado | Totalmente suportado e testado. |
| **Spigot** | ⚠️ Somente diagnóstico | Análise de crash, monitor de console e Monitor de Ticks funcionam. A [Moderação de Chat com IA](/pt/solver/fyrx-ai) exige o `AsyncChatEvent` do Paper e **não está disponível no Spigot puro** — está no roadmap. |
| **Bukkit** | ⚠️ Parcial | Apenas funcionalidade básica; não suportado oficialmente. |
| **Folia** | ✅ Suportado | O TickMonitor é desativado automaticamente (o Folia gerencia seu próprio watchdog). Todos os outros recursos funcionam. |
| **Velocity** | ❌ Não suportado | Software proxy; usa uma API completamente diferente. |
| **BungeeCord** | ❌ Não suportado | Software proxy; usa uma API completamente diferente. |
| **Waterfall** | ❌ Não suportado | Software proxy; usa uma API completamente diferente. |
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
| 1.19.x | ✅ Suportado | |
| 1.18.x | ✅ Suportado | Versão mínima suportada (primeira versão que exige Java 17). |
| 1.17.x e anteriores | ❌ Não suportado | Essas versões rodam em Java 8/11; o AbsoluteSolver exige Java 17+. |

## Versão do Java

O AbsoluteSolver é compilado visando **Java 17**. Ele vai rodar em qualquer JVM versão 17 ou superior (incluindo Java 21+).

::: danger Java 17 Necessário
Se o seu servidor estiver rodando em Java 8 ou Java 11, tentar carregar o AbsoluteSolver resultará em um `UnsupportedClassVersionError`. Você precisa atualizar seu runtime Java primeiro.
:::
