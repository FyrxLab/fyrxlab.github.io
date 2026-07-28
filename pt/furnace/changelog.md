# Changelog

Todas as mudanças relevantes do mod **Absolute Furnace** serão documentadas aqui.

## v1.2.7 (NeoForge 26.2)
- Port do Absolute Furnace para o NeoForge 26.2.

## v1.2.6 (Forge 1.20.1)
*O Absolute Furnace 1.2.6 chegou, e dessa vez é uma atualização de correções: o forno estava fundindo bem menos do que deveria, então rastreamos o problema e consertamos.*

* **[Correção de Bug]** Corrigido um bug importante em que a GUI e sua fundição automática nunca liam de fato o inventário real do bloco. Carregar combustível e minério manualmente nunca fundia nada sozinho (antes só a automação com funil/tubo funcionava).
* **[Otimização]** Otimizada a lógica de tick do forno para resolver seu inventário uma vez por tick em vez de uma vez por acesso a cada slot.
* **[Limpeza]** Removido código morto remanescente da antiga GUI e do procedimento de tick gerados pelo MCreator.

*Com carinho, da jeamcube.*
