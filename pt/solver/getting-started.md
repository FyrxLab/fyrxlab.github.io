# Primeiros Passos

## Requisitos

Antes de instalar o AbsoluteSolver, certifique-se de que seu servidor atende aos seguintes requisitos:

| Requisito | Mínimo | Recomendado |
|-------------|---------|-------------|
| **Java** | Java 8 | Java 21 |
| **Software do Servidor** | Spigot / CraftBukkit | Paper / Purpur |
| **Versão do Minecraft** | 1.8.8 | 1.20.x+ |
| **Chave de API** | Anthropic, Google, ou um provedor compatível com OpenAI | — |

::: tip Qualquer Provedor de IA Funciona
O AbsoluteSolver vem configurado com **Anthropic Claude** por padrão, mas o Google Gemini e qualquer endpoint compatível com OpenAI (incluindo modelos locais via Ollama ou LM Studio) funcionam igualmente bem — veja [Fyrx — Seu Assistente de IA](/pt/solver/fyrx-ai) para a lista completa.
:::

## Instalação

**1. Baixe o plugin**

Baixe o `Solver-<versão>.jar` mais recente no [Modrinth](https://modrinth.com/plugin/solver) ou na página de [GitHub Releases](https://github.com/FyrxLab/AbsoluteSolver).

**2. Coloque-o na pasta `plugins`**

```
your-server/
└── plugins/
    └── Solver-<versão>.jar  ← aqui
```

**3. Inicie o servidor uma vez**

Inicie o servidor normalmente. O AbsoluteSolver vai gerar seu arquivo de configuração padrão e então desligar (ou você pode continuar rodando sem uma chave — ele vai registrar um aviso).

**4. Adicione sua Chave de API**

Abra `plugins/Solver/config.yml` e cole sua chave de API da Anthropic (ou troque de provedor, veja a dica acima):

```yaml
ai-provider:
  provider: "anthropic"
  model: "Sonnet"
  anthropic-key: "YOUR_API_KEY_HERE" # [!code highlight]
```

**5. Reinicie o servidor**

Reinicie seu servidor. Você deve ver o banner ASCII do AbsoluteSolver no console e a mensagem:

```
[Solver] Asistente: Fyrx - Monitoreando errores...
[Solver] TickMonitor iniciado. Vigilando el rendimiento del servidor...
```

O Fyrx agora está ativo e monitorando seu servidor. ✅

## Testando se Funciona

Você pode disparar um erro de teste seguro usando o comando de teste de crash embutido (requer OP):

```
/solver crashme exception
```

Ou, sem afetar o servidor de forma alguma:

```
/solver crashme dry-run
```

Em poucos segundos, o Fyrx vai analisar a exceção e imprimir um relatório de diagnóstico completo no seu console.

::: warning Comando restrito ao console
O comando `/solver` requer a permissão `solver.admin` (ou a permissão específica do subcomando — veja [Comandos](/pt/solver/commands#permissões)). Por padrão, apenas operadores do servidor têm essa permissão.
:::
