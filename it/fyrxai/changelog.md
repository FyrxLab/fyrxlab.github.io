# Changelog

## v1.2.1
- Formalizzata la compatibilità con gli ES modules tramite una mappa `exports` esplicita in `package.json` — `import setupFyrxAI from 'fyrxai'` ora funziona insieme a `require()`.

## v1.2.0
- Aggiunto `/fyrxai exempt` — utenti e ruoli configurabili per server (es. moderatori) che saltano il cooldown di attenzione.
- Rilevamento argomenti più permissivo sui server con una sola wiki: un unico argomento configurato ora risponde a domande ragionevoli senza richiedere che il nome venga menzionato, filtrando comunque saluti e chiacchiere.
- Rilevamento del "problema" ampliato per catturare più espressioni quotidiane (es. espressioni regionali di "non funziona", coniugazioni verbali spagnole).
- Menzionare (@) il bot ora garantisce una risposta in qualsiasi canale, saltando tutti i filtri euristici. Menzionarlo mentre rispondi a un altro messaggio lo fa rispondere su quel messaggio invece che sul tuo testo di menzione.

## v1.0.0
- Rilascio pubblico iniziale: scansione della documentazione dell'intero sito (`llms.txt`/`sitemap.xml`/seguimento link), estrazione di parole chiave automatica + assistita da IA, rilevamento argomenti a tre livelli, configurazione tramite slash command `/fyrxai`, e supporto per WaveSpeed, OpenRouter, Google AI Studio, e Claude Platform.
