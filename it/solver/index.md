---
layout: home

hero:
  name: "AbsoluteSolver"
  text: "Diagnostica del Server basata su IA"
  tagline: "Scopri Fyrx — il tuo assistente IA integrato che analizza automaticamente errori di console, crash report e lag del server in un linguaggio semplice."
  image:
    src: /solver.svg
    alt: AbsoluteSolver
  actions:
    - theme: brand
      text: Per Iniziare
      link: /it/solver/getting-started
    - theme: alt
      text: Vedi su Modrinth
      link: https://modrinth.com/plugin/solver
    - theme: alt
      text: English
      link: /en/solver/getting-started
---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-brain"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Perché AbsoluteSolver</span>
    <h3>Fyrx legge il tuo server al posto tuo</h3>
    <p>Include Anthropic Claude come impostazione predefinita — Google Gemini e qualsiasi endpoint compatibile con OpenAI sono comunque pienamente supportati. Fyrx trasforma stack trace Java criptici, spam di console e picchi di lag in una spiegazione chiara di cosa è successo davvero.</p>
    <p class="spotlight-note">Ogni chiamata IA gira su un thread in background — analisi, I/O su file e richieste di rete non toccano mai il thread principale. I tuoi TPS non si accorgono nemmeno che Fyrx è lì.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">Diagnostica</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><b>Monitor Console in Tempo Reale</b><p>Iniettato direttamente nel motore Log4j del server. Gli errori vengono intercettati nell'istante in cui accadono — senza scavare nei log a mano.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-explosion"></i>
    <div><b>Analisi dei Crash</b><p>Scansiona automaticamente i crash-report e gli errori fatali della JVM all'avvio. Fyrx ti dice esattamente cosa ha ucciso il tuo server prima ancora che tu lo chieda.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-stopwatch"></i>
    <div><b>Monitor dei Tick</b><p>Un thread leggero in background sorveglia i tuoi TPS. Se il thread principale si blocca per più di 5 secondi, Fyrx identifica il plugin colpevole.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-clock-rotate-left"></i>
    <div><b>Errori di Avvio Precoci</b><p>Legge logs/latest.log all'avvio per rilevare conflitti di dipendenze ed errori di versione avvenuti prima che AbsoluteSolver si caricasse.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Moderazione e Sicurezza</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-gavel"></i>
    <div><b>Moderazione Chat con IA</b><p>Fyrx legge il vero contesto della conversazione, non una lista di parole vietate, e supporta ogni verdetto con un punteggio di confidenza prima di agire.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-scale-balanced"></i>
    <div><b>Sistema di Sanzioni</b><p>Sistema completo di warn/mute/kick/ban con rilevamento di account alternativi via IP, ricorsi in gioco, supporto MySQL e una GUI.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Strumenti per lo Staff</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-user-secret"></i>
    <div><b>Staff Mode Toolkit</b><p>Vanish (due livelli), congelamento con canale di chat privato, chat esclusiva staff, CommandSpy, e inspect/enderchest con confisca in un click.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-flag"></i>
    <div><b>Segnalazioni Staff</b><p>Qualsiasi giocatore può segnalare qualcosa allo staff con /solver report — coda e GUI proprie, del tutto separate dalle sanzioni.</p></div>
  </div>
</div>

</div>
