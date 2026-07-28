# Monitor de Ticks

O Monitor de Ticks é uma thread leve em segundo plano que observa continuamente a saúde da **thread principal** do seu servidor. Se o servidor travar, entrar em deadlock ou sofrer um pico severo de lag, o Fyrx vai detectar automaticamente, capturar o estado da thread e gerar um relatório de diagnóstico.

## Como Funciona

O Monitor de Ticks opera usando dois componentes:

**1. Tarefa de Heartbeat (Thread Principal)**
Uma tarefa síncrona do Bukkit roda uma vez por tick (20 vezes por segundo) na thread principal do servidor. A cada execução, ela atualiza um timestamp `lastTickTime`.

**2. Thread Watchdog (Segundo Plano)**
Uma thread Java separada verifica o `lastTickTime` a cada segundo. Se o timestamp não for atualizado por mais de **15 segundos**, ela conclui que a thread principal está travada.

## Detecção de Travamento

Quando um travamento é detectado:

1. O monitor captura o **StackTrace completo** da thread principal (até 30 frames)
2. Captura o **estado da thread** (BLOCKED, WAITING, etc.)
3. Esses dados são enviados ao Fyrx de forma assíncrona
4. O Fyrx identifica qual plugin, manipulador de evento ou código está bloqueando a thread principal

**Exemplo de saída do Fyrx em um deadlock:**

```
╔══════════════════════════════════════════════════════════╗
║       FREEZE DIAGNOSTIC — FYRX                          ║
╚══════════════════════════════════════════════════════════╝

### Root Cause
The main thread is TIMED_WAITING inside CommandManager.onCommand()
at net.example.myplugin.CommandManager.java:52

### Analysis
The plugin is calling Thread.sleep(20000) directly on the main server
thread. This is a critical programming error — Thread.sleep() blocks
the entire server for the specified duration.

### Recommended Action
Contact the plugin author. The sleep() call must be moved to an
asynchronous thread using Bukkit.getScheduler().runTaskAsynchronously()
════════════════════════════════════════════════════════════
```

## Compatibilidade com Folia

::: warning Folia
O Monitor de Ticks é **desativado automaticamente** em servidores Folia. O Folia usa uma arquitetura regional multithread onde não existe uma única "thread principal", tornando impossível o monitoramento de TPS por esse método. O Folia tem seu próprio Watchdog regional embutido que trata da detecção de travamentos.

Quando o AbsoluteSolver detecta o Folia, você verá esta mensagem:
```
[AbsoluteSolver] Servidor Folia detectado: TickMonitor deshabilitado.
```
:::

## Limite de Travamento

O limite de travamento padrão é de **15 segundos**. Isso é intencionalmente maior que o Watchdog padrão do Paper (10 segundos) para evitar falsos positivos durante salvamentos pesados do mundo ou picos de geração de chunks.

## Testando

Você pode testar o Monitor de Ticks com segurança usando o comando de teste de crash embutido (somente OP):

```
/absolutesolver crashme deadlock
```

Esse comando chama `Thread.sleep(20000)` na thread principal, simulando um travamento de 20 segundos. O Fyrx vai detectar isso após 15 segundos e gerar um relatório de diagnóstico.

::: danger Aviso
O teste de crash `deadlock` vai deixar seu servidor sem resposta por 20 segundos. O próprio Watchdog do Paper/Purpur também será acionado e vai imprimir um thread dump. Esse é o comportamento esperado.
:::
