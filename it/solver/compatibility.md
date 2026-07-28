# Compatibilità

## Software del Server

| Loader | Supportato | Note |
|--------|-----------|-------|
| **Paper** | ✅ Consigliato | Pienamente supportato. Migliore integrazione Log4j. |
| **Purpur** | ✅ Consigliato | Pienamente supportato e testato. |
| **Spigot** | ⚠️ Solo diagnostica | Analisi dei crash, monitor console e Monitor dei Tick funzionano tutti. La [Moderazione Chat con IA](/it/solver/fyrx-ai) richiede `AsyncChatEvent` di Paper e **non è disponibile su Spigot puro** — è nella roadmap. |
| **Bukkit** | ⚠️ Parziale | Solo funzionalità di base; non supportato ufficialmente. |
| **Folia** | ✅ Supportato | Il TickMonitor viene disabilitato automaticamente (Folia gestisce il proprio watchdog). Tutte le altre funzionalità funzionano. |
| **Velocity** | ❌ Non supportato | Software proxy; usa un'API completamente diversa. |
| **BungeeCord** | ❌ Non supportato | Software proxy; usa un'API completamente diversa. |
| **Waterfall** | ❌ Non supportato | Software proxy; usa un'API completamente diversa. |
| **Forge / Fabric** | ❌ Non supportato | Mod loader; non usano l'API Bukkit. |
| **Sponge** | ❌ Non supportato | Usa SpongeAPI, non Bukkit. |

::: tip Supporto Folia
AbsoluteSolver è **Folia-Aware**. Quando gira su un server Folia, il plugin rileva automaticamente l'ambiente multithread e disabilita il TickMonitor per evitare conflitti — dato che Folia ha il proprio sistema di Watchdog regionale. Tutte le altre diagnostiche (monitoraggio console, analisi dei crash, post-mortem) restano pienamente funzionanti.
:::

## Versioni Minecraft

| Versione | Stato | Note |
|---------|--------|-------|
| 1.21.x | ✅ Supportato | Gira su Java 21, pienamente compatibile. |
| 1.20.x | ✅ Supportato | Target di sviluppo primario. Testato a fondo. |
| 1.19.x | ✅ Supportato | |
| 1.18.x | ✅ Supportato | Versione minima supportata (prima versione che richiede Java 17). |
| 1.17.x e precedenti | ❌ Non supportato | Queste versioni girano su Java 8/11; AbsoluteSolver richiede Java 17+. |

## Versione Java

AbsoluteSolver è compilato per **Java 17**. Funzionerà su qualsiasi JVM versione 17 o superiore (incluso Java 21+).

::: danger Java 17 Richiesto
Se il tuo server gira su Java 8 o Java 11, il tentativo di caricare AbsoluteSolver produrrà un `UnsupportedClassVersionError`. Devi prima aggiornare il tuo runtime Java.
:::
