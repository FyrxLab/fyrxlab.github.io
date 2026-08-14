---
layout: home

hero:
  name: "FyrxAI"
  text: "Agente di Supporto IA per Bot Discord"
  tagline: "Aggiungi un agente di supporto basato su IA al tuo bot discord.js in pochi minuti — configurato interamente da Discord, senza modificare codice, senza variabili d'ambiente."
  actions:
    - theme: brand
      text: Inizia
      link: /it/fyrxai/configuration
    - theme: alt
      text: Vedi su GitHub
      link: https://github.com/FyrxLab/fyrx-ai
    - theme: alt
      text: English
      link: /en/fyrxai/

---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-robot"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Perché FyrxAI</span>
    <h3>Puntalo alla tua documentazione, non al tuo codice</h3>
    <p>FyrxAI è una piccola libreria, non un servizio ospitato — la installi nel tuo bot. Dagli uno o più siti di documentazione con <code>/fyrxai wiki add</code> e li esegue in scansione, estrae parole chiave, e inizia a rispondere alle domande nei tuoi canali di supporto automaticamente. Nessun dataset da preparare a mano.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">Cosa Ottieni</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-spider"></i>
    <div><b>Scansione dell'Intero Sito</b><p>Punta <code>/fyrxai wiki add</code> a una singola pagina e scopre il resto tramite <code>llms.txt</code>, <code>sitemap.xml</code>, o seguendo link dello stesso dominio.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-layer-group"></i>
    <div><b>Rilevamento Argomenti a Tre Livelli</b><p>Corrispondenza esatta, poi fuzzy (tollerante ai refusi), poi un modello di embedding locale offline — senza spendere chiamate IA per capire di cosa parla una domanda.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-plug"></i>
    <div><b>Porta il Tuo Provider</b><p>WaveSpeed, OpenRouter, Google AI Studio, o Claude Platform — scegline uno per server, configurato con una risposta effimera di uno slash command.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-shield-halved"></i>
    <div><b>Niente di Fisso nel Codice</b><p>Ogni canale, wiki, provider e permesso si imposta dalla chat di Discord. Installa il pacchetto e non serve alcun file di configurazione.</p></div>
  </div>
</div>

</div>

## Installazione

```bash
npm install github:FyrxLab/fyrx-ai
```

```js
// CommonJS
const setupFyrxAI = require('fyrxai');
setupFyrxAI(client);
```

```js
// ES modules
import setupFyrxAI from 'fyrxai';
setupFyrxAI(client);
```

Continua con [Configurazione](/it/fyrxai/configuration) per la configurazione lato Discord.
