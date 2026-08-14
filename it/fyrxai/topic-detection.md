# Rilevamento Argomenti

Quando arriva un messaggio, FyrxAI decide *se* rispondere e *a quale* argomento documentato (wiki) si riferisce, in tre livelli — il più economico e certo per primo.

## 1. Corrispondenza esatta

Se il nome di una wiki appare letteralmente nel messaggio, quello è l'argomento. Nessuna chiamata IA spesa qui.

## 2. Corrispondenza fuzzy

Corrispondenza per distanza di edit (Levenshtein), tollerante a differenze di spaziatura e pluralizzazione ("conditional event" corrisponde comunque a una wiki chiamata `conditionalevents`) e a refusi nel *nome stesso*. Questo è semplice confronto di stringhe, non IA — i modelli di embedding non sono fatti per tollerare i refusi, quindi questo livello esiste specificamente per coprire ciò che loro non colgono.

## 3. Modello semantico locale

Per messaggi che descrivono un problema senza nominare affatto la wiki, FyrxAI ricorre a un piccolo modello di embedding locale offline (`Xenova/paraphrase-MiniLM-L3-v2`, senza bisogno di API key o chiamate di rete). I vettori di riferimento provengono dal nome e dalla descrizione della wiki, più ogni parola chiave estratta dalla scansione — sia il passaggio automatico basato su regex (intestazioni, codice inline, `/comandi`, `%variabili%`, sempre disponibile) sia il passaggio generato dall'IA (se un provider è configurato). Una corrispondenza deve sia superare una soglia di similarità sia battere per margine l'argomento secondo classificato, riducendo le ipotesi sicure ma sbagliate.

## Server con un solo argomento

Se è configurata una sola wiki, non c'è nulla da disambiguare — qualsiasi messaggio ragionevolmente somigliante a una domanda nel canale di supporto viene trattato come riguardante quella wiki, senza bisogno di nominarla. Saluti e chiacchiere ("ciao come va") vengono filtrati a parte così da non innescare una risposta.

## Risposte garantite

Menzionare (@) il bot salta tutti e tre i livelli e risponde direttamente (ancora soggetto al cooldown per utente) — vedi [Configurazione](/it/fyrxai/configuration#ottenere-una-risposta-direttamente).

## Limite d'uso

Rispondere costa "attenzione", che si rigenera nel tempo per utente — una raffica di domande viene limitata progressivamente invece che tutti condividano un cooldown fisso. Esenta utenti o ruoli specifici (es. moderatori) con `/fyrxai exempt`.
