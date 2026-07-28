# Sistema Absolute Energy

Diferente de um forno normal que rastreia o tempo de queima de forma incremental, o **Absolute Furnace** opera com um sistema de energia unificado chamado **Absolute Energy**.

## Gerando Energia
Sempre que você coloca um item queimável válido do Minecraft (como Carvão, Carvão Vegetal, ou Madeira) em um dos 6 slots de Entrada de Energia, o forno verifica instantaneamente se há espaço para armazenar a energia resultante.

Se houver espaço, o combustível é consumido e convertido em itens de **Absolute Energy**, que são armazenados diretamente nos slots de energia.

## Taxa de Consumo
O processo de fundição é completamente padronizado:
* **Custo:** Exatamente `2 Absolute Energy` por item fundido.
* **Velocidade:** Instantânea por tick, limitada apenas pela disponibilidade de combustível e materiais de entrada.

> [!NOTE]
> Como ele converte combustível em itens tangíveis de Absolute Energy, você verá Absolute Energy se acumulando até 64 nos slots de energia. Isso permite que o forno armazene uma quantidade enorme de poder de fundição em potencial, pronto para ser liberado no momento em que os minérios forem inseridos.
