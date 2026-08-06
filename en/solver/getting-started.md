# Getting Started

## Requirements

Before installing AbsoluteSolver, make sure your server meets the following requirements:

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Java** | Java 8 | Java 21 |
| **Server Software** | Spigot / CraftBukkit | Paper / Purpur |
| **Minecraft Version** | 1.8.8 | 1.20.x+ |
| **API Key** | Anthropic, Google, or an OpenAI-compatible provider | — |

::: tip Any AI Provider Works
AbsoluteSolver ships configured for **Anthropic Claude** by default, but Google Gemini and any OpenAI-compatible endpoint (including local models via Ollama or LM Studio) work just as well — see [Fyrx — Your AI Assistant](/en/solver/fyrx-ai) for the full list.
:::

## Installation

**1. Download the plugin**

Download the latest `Solver-<version>.jar` from [Modrinth](https://modrinth.com/plugin/solver) or the [GitHub Releases](https://github.com/FyrxLab/AbsoluteSolver) page.

**2. Drop it in your `plugins` folder**

```bash
your-server/
└── plugins/
    └── Solver-< version >.jar  # ← here
```

**3. Start the server once**

Start the server normally. AbsoluteSolver will generate its default configuration file and then shut down (or you can continue running it without a key — it will log a warning).

**4. Add your API Key**

Open `plugins/Solver/config.yml` and paste your Anthropic API key (or switch providers, see the tip above):

```yaml
ai-provider:
  provider: "anthropic"
  model: "Sonnet"
  anthropic-key: "YOUR_API_KEY_HERE" # [!code highlight]
```

**5. Restart the server**

Restart your server. You should see the AbsoluteSolver ASCII banner in the console and the message:

```yaml

==========================================================================================================
                                                Solver by FyrxLab
==========================================================================================================
                             +                                           
                           +++++                                                                                
                         +++++++++                                                                              
                       ++++++++++++                 **************        **** ********     ****       ***      
                     ++++++++++++++++               *********** ****     ****  ************  ****    ****       
                     +++++++  +++++++++             ***          ****   ****   ***      ****   ***  ****        
                 +++   +++       ++++++++           ***           ***  ****    ***      ****       ****         
               *++++++            +++++++++         **********        ****     ***     ****      *****          
                ++++++++          ++++++++          **********       ***       ***********      *******         
                  ++++++++      ++++++++            ***              ***       ***    ****    ****  ****        
                    +++++++   ++++++++              ***              ***       ***     ****  ****    *****      
                      ++++++++++++++                ***              ***       ***      ********       ****     
                        ++++++++++                                                                                                
                          +++++++                                                                                                 
                            ++                                                                                                    
==========================================================================================================

==========================================================================================================

[Solver] Asistente: Fyrx - Monitoreando errores...
[Solver] TickMonitor iniciado. Vigilando el rendimiento del servidor...
```

Fyrx is now active and monitoring your server. ✅

## Testing it Works

You can trigger a safe test error using the built-in crash test command (requires OP):

```bash
/solver crashme exception
```

Or, without affecting the server at all:

```bash
/solver crashme dry-run
```

Within a few seconds, Fyrx will analyze the exception and print a full diagnostic report in your console.

::: warning Console-only command
The `/solver` command requires `solver.admin` permission (or the specific subcommand's permission — see [Commands](/en/solver/commands#permissions)). By default, only server operators have this permission.
:::
