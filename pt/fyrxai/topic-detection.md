# Detecção de Tópicos

Quando uma mensagem chega, o FyrxAI decide *se* deve responder e *sobre qual* tópico documentado (wiki) ela trata, em três camadas — a mais barata e certa primeiro.

## 1. Correspondência exata

Se o nome de uma wiki aparece literalmente na mensagem, esse é o tópico. Nenhuma chamada de IA gasta aqui.

## 2. Correspondência difusa

Comparação por distância de edição (Levenshtein), tolerante a diferenças de espaçamento e pluralização ("conditional event" ainda corresponde a uma wiki chamada `conditionalevents`) e a erros de digitação no *próprio nome*. Isso é comparação de texto simples, não IA — modelos de embeddings não são feitos para tolerar erros de digitação, então essa camada existe especificamente para cobrir o que eles não captam.

## 3. Modelo semântico local

Para mensagens que descrevem um problema sem nomear a wiki de forma alguma, o FyrxAI recorre a um pequeno modelo de embeddings local offline (`Xenova/paraphrase-MiniLM-L3-v2`, sem precisar de API key ou chamada de rede). Os vetores de referência vêm do nome e da descrição da wiki, mais cada palavra-chave extraída do rastreamento — tanto o passo automático baseado em regex (cabeçalhos, código inline, `/comandos`, `%variáveis%`, sempre disponível) quanto o passo gerado por IA (se um provedor estiver configurado). Uma correspondência precisa tanto superar um limiar de similaridade quanto vencer por margem o tópico em segundo lugar, reduzindo palpites confiantes mas errados.

## Servidores com um único tópico

Se apenas uma wiki está configurada, não há nada para desambiguar — qualquer mensagem razoavelmente parecida com uma pergunta no canal de suporte é tratada como sendo sobre ela, sem precisar nomeá-la. Saudações e conversa fiada ("oi tudo bem") são filtradas separadamente para não disparar uma resposta.

## Respostas garantidas

Mencionar (@) o bot pula as três camadas e responde diretamente (ainda sujeito ao cooldown por usuário) — veja [Configuração](/pt/fyrxai/configuration#obtendo-uma-resposta-diretamente).

## Limite de uso

Responder custa "atenção", que se regenera com o tempo por usuário — uma rajada de perguntas é limitada progressivamente em vez de todos compartilharem um cooldown fixo. Isente usuários ou cargos específicos (ex. moderadores) com `/fyrxai exempt`.
