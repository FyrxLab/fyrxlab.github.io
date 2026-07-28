# Per Iniziare

## Requisiti

Prima di installare AbsoluteSolver, assicurati che il tuo server soddisfi i seguenti requisiti:

| Requisito | Minimo | Consigliato |
|-------------|---------|-------------|
| **Java** | Java 17 | Java 21 |
| **Software del Server** | Spigot | Paper / Purpur |
| **Versione Minecraft** | 1.18.x | 1.20.x+ |
| **Chiave API** | Anthropic, Google, o un provider compatibile con OpenAI | — |

::: tip Qualsiasi Provider IA Funziona
AbsoluteSolver viene configurato con **Anthropic Claude** di default, ma Google Gemini e qualsiasi endpoint compatibile con OpenAI (inclusi i modelli locali via Ollama o LM Studio) funzionano altrettanto bene — vedi [Fyrx — Il Tuo Assistente IA](/it/solver/fyrx-ai) per l'elenco completo.
:::

## Installazione

**1. Scarica il plugin**

Scarica l'ultimo `Solver-<versione>.jar` da [Modrinth](https://modrinth.com/plugin/solver) o dalla pagina [GitHub Releases](https://github.com/FyrxLab/AbsoluteSolver).

**2. Inseriscilo nella cartella `plugins`**

```
your-server/
└── plugins/
    └── Solver-<versione>.jar  ← qui
```

**3. Avvia il server una volta**

Avvia normalmente il server. AbsoluteSolver genererà il suo file di configurazione predefinito e poi si arresterà (oppure puoi continuare a farlo funzionare senza una chiave — registrerà un avviso).

**4. Aggiungi la tua Chiave API**

Apri `plugins/Solver/config.yml` e incolla la tua chiave API di Anthropic (oppure cambia provider, vedi il consiglio sopra):

```yaml
ai-provider:
  provider: "anthropic"
  model: "Sonnet"
  anthropic-key: "YOUR_API_KEY_HERE" # [!code highlight]
```

**5. Riavvia il server**

Riavvia il tuo server. Dovresti vedere il banner ASCII di AbsoluteSolver in console e il messaggio:

```
[Solver] Asistente: Fyrx - Monitoreando errores...
[Solver] TickMonitor iniciado. Vigilando el rendimiento del servidor...
```

Fyrx è ora attivo e sta monitorando il tuo server. ✅

## Verifica che funzioni

Puoi attivare un errore di test sicuro usando il comando di test crash integrato (richiede OP):

```
/solver crashme exception
```

Oppure, senza influire affatto sul server:

```
/solver crashme dry-run
```

Nel giro di pochi secondi, Fyrx analizzerà l'eccezione e stamperà un report diagnostico completo nella console.

::: warning Comando riservato alla console
Il comando `/solver` richiede il permesso `solver.admin` (o il permesso specifico del sottocomando — vedi [Comandi](/it/solver/commands#permessi)). Per impostazione predefinita, solo gli operatori del server hanno questo permesso.
:::
