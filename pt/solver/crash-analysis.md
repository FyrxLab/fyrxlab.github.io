# Análise de Crashes

O AbsoluteSolver oferece três sistemas distintos de análise de crash que trabalham juntos para garantir que, não importa *como* seu servidor morreu, o Fyrx estará lá para explicar.

## Análise Post-Mortem (Verificação na Inicialização)

Quando seu servidor inicia, o AbsoluteSolver verifica se há novos relatórios de crash que não estavam presentes na sessão anterior.

**Como funciona:**
1. No `onEnable`, o plugin verifica a pasta `crash-reports/`
2. Compara a lista de arquivos com um registro `data.yml` de relatórios já analisados
3. Se um relatório **novo** for encontrado, ele lê o arquivo e envia ao Fyrx junto com as últimas 100 linhas do `latest.log`
4. A análise do Fyrx é impressa no console antes do servidor terminar de inicializar

**Tipos de relatório de crash suportados:**

| Tipo | Origem | Descrição |
|------|--------|-------------|
| Relatório de Crash do Minecraft | `crash-reports/*.txt` | Dumps de crash padrão do Minecraft/Paper |
| Crash Nativo da JVM | `hs_err_pid*.log` | Erros fatais da JVM (SIGSEGV, falhas de JNI, corrupção de memória) |

::: info Crashes Nativos da JVM
Um arquivo `hs_err_pid` é gerado quando o próprio Java trava — não só o Minecraft. Esses crashes normalmente são causados por uma biblioteca nativa quebrada (como um driver de GPU), corrupção de memória, ou uma chamada JNI ruim de um mod. O Fyrx analisa as primeiras 200 linhas, que contêm as informações mais críticas.
:::

## Detecção de Erros Iniciais de Inicialização

Esse sistema captura erros que ocorrem *depois* que a JVM inicia mas *antes* do `onEnable` do AbsoluteSolver rodar. Esses erros costumam ser causados por:

- Incompatibilidades de versão de plugin
- Dependências ausentes
- Conflitos de carregamento de classe (dois plugins usando versões diferentes da mesma biblioteca)

**Como funciona:**
1. O AbsoluteSolver lê o `logs/latest.log` de forma assíncrona na inicialização
2. Ele verifica linhas contendo `ERROR]:` ou `WARN]:` até a linha `[AbsoluteSolver] Enabling`
3. Se algum erro for encontrado, é enviado ao Fyrx para análise
4. A análise completa é impressa imediatamente no console

**Exemplo do que isso detecta:**

```
[ServerMain/ERROR]: Could not load 'plugins/MyPlugin.jar' in folder 'plugins'
org.bukkit.plugin.InvalidPluginException: Unsupported API version 1.21
```

## Análise Manual

Você pode acionar uma análise manual do relatório de crash mais recente a qualquer momento:

```
/absolutesolver analyze-last
```

Isso é útil se o AbsoluteSolver não capturou o crash automaticamente (por exemplo, o plugin não estava carregado durante a sessão do crash).

## Configuração

```yaml
check-crash-on-startup: true    # Enable post-mortem scanning on boot
monitor-console: true           # Enable early startup error detection
```
