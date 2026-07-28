# Monitor de Console

O Monitor de Console é um interceptador de erros em tempo real, injetado diretamente no mecanismo de log **Log4j** do servidor. Ele captura os erros no instante em que são escritos no console — antes mesmo de aparecerem no arquivo de log.

## Como Funciona

O AbsoluteSolver registra um `Log4j Appender` personalizado na inicialização. Esse appender escuta cada evento de log e filtra:

- Linhas de nível `ERROR` ou `FATAL`
- Linhas de nível `WARN` com uma exceção Java anexada (`Throwable`)

Quando um erro é detectado, ele é adicionado a um buffer interno. Após uma **janela de lote** configurável (padrão: 10 segundos), os erros armazenados são enviados juntos ao Fyrx para análise. Isso evita sobrecarregar a IA com erros individuais durante uma falha em cascata.

## Configuração

```yaml
monitor-console: true           # Enable/disable the monitor
error-cooldown-minutes: 10      # Minimum minutes between analyses
```

## Filtragem

O monitor ignora de forma inteligente:
- Mensagens `INFO` e `DEBUG` (apenas erros são capturados)
- Erros do próprio AbsoluteSolver (para evitar loops de feedback)
- Erros durante a janela inicial de inicialização (tratados separadamente pela Detecção de Erros Iniciais)

## Análise em Lote

Em vez de enviar cada erro individualmente (o que esgotaria rapidamente sua cota de API), o Monitor de Console usa um **sistema de lotes**:

1. Os erros se acumulam em uma fila (máximo de 100 entradas)
2. Após 10 segundos de inatividade, os últimos 50 erros são agrupados em um único prompt
3. O Fyrx analisa o lote inteiro de uma vez e identifica padrões entre múltiplos erros

Essa abordagem é especialmente eficaz durante falhas em cascata de plugins, onde muitos plugins lançam erros simultaneamente devido a uma única causa raiz.

## Cooldown

Para proteger contra limites de taxa em níveis de API gratuitos, um cooldown global é aplicado entre análises. O padrão é **10 minutos**. Você pode ajustar isso no `config.yml`:

```yaml
error-cooldown-minutes: 10  # Set to 0 to disable (not recommended)
```

## Erros Iniciais de Inicialização

Um sistema separado trata erros que ocorrem *antes* do AbsoluteSolver terminar de carregar. Veja [Detecção de Erros Iniciais](/pt/solver/crash-analysis#deteccao-de-erros-iniciais-de-inicializacao) para detalhes.
