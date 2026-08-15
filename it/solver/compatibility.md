# Compatibilità

## Software del Server

| Loader | Supportato | Note |
|--------|-----------|-------|
| **Paper** | ✅ Consigliato | Pienamente supportato. Migliore integrazione Log4j. |
| **Purpur** | ✅ Consigliato | Pienamente supportato e testato. |
| **Spigot** | ✅ Supportato (1.8.8+) | Pienamente supportato, inclusa la [Moderazione Chat con IA](/it/solver/fyrx-ai) — Paper non è richiesto. |
| **CraftBukkit** | ✅ Supportato (1.8.8+) | Stesso livello di supporto di Spigot. |
| **Folia** | ✅ Supportato | Il TickMonitor viene disabilitato automaticamente (Folia gestisce il proprio watchdog). Tutte le altre funzionalità funzionano. |
| **Velocity** | ⚠️ Parziale (solo relay) | Non è una destinazione d'installazione di Solver — un plugin piccolo e separato inoltra staffchat/avvisi tra i tuoi backend. Vedi [Relay Proxy](/it/solver/proxy-relay). |
| **BungeeCord** | ⚠️ Parziale (solo relay) | Stesso plugin di relay di Waterfall. Vedi [Relay Proxy](/it/solver/proxy-relay). |
| **Waterfall** | ⚠️ Parziale (solo relay) | Stesso plugin di relay di BungeeCord. Vedi [Relay Proxy](/it/solver/proxy-relay). |
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
| 1.13.x – 1.19.x | ✅ Supportato | |
| 1.8.8 – 1.12.x | ✅ Supportato | Versione minima supportata. Alcune comodità esclusive di Paper (es. nascondere un giocatore in vanish dal conteggio nella lista server) non sono disponibili qui — non esiste un equivalente vanilla — ma tutte le altre funzionalità sono identiche. |
| 1.7.10 e precedenti | ❌ Non ancora supportato | Pianificato, ma non ancora compilabile/disponibile. |

## Versione Java

Solver è compilato per **Java 8**. Funzionerà su qualsiasi JVM versione 8 o superiore (incluso Java 17/21).

::: tip Java 8 o Superiore
Solver funziona da Java 8 in su — non serve aggiornare il runtime Java del tuo server per usarlo.
:::
