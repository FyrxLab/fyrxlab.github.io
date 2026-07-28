# Automação e Slots

Um dos recursos mais poderosos do **Absolute Furnace** é sua capacidade de se integrar perfeitamente a sistemas automatizados usando funis, tubos, ou qualquer outro sistema de logística com mods.

## Layout dos Slots e Faces de Acesso
O forno expõe slots específicos dependendo de qual face do bloco você interage. Isso torna a automação com funil simples:

* **Face Superior (Slots 0-5):** Aceita itens apenas nos slots de **Entrada de Materiais**. Use para alimentar minérios ou comida.
* **Faces Laterais (Norte, Sul, Leste, Oeste) (Slots 6-11):** Aceita itens apenas nos slots de **Entrada de Energia**. Use essas faces para alimentar carvão, madeira, ou outros combustíveis.
* **Face Inferior (Slots 12-17):** Extrai itens apenas dos slots de **Saída de Materiais**. Use para retirar seus lingotes recém-fundidos.

::: tip
Como existem 6 slots para cada categoria, você pode conectar múltiplos funis ou tubos de nível avançado para inserir e extrair itens rapidamente sem criar um gargalo.
:::

## Roteamento Interno
O Absolute Furnace vai automaticamente procurar o primeiro slot disponível quando itens forem inseridos, e vai empilhar de forma inteligente saídas idênticas para maximizar seus 6 slots de saída.
