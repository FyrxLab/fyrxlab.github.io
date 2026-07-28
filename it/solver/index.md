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

features:
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-brain"></i>'
    title: Integrazione IA Gemini
    details: Basato sul modello Gemini di Google. Fyrx traduce criptici stack trace Java in soluzioni chiare e concrete, davvero comprensibili.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-triangle-exclamation"></i>'
    title: Monitor Console in Tempo Reale
    details: Iniettato direttamente nel motore Log4j del server. Gli errori vengono intercettati nell'istante in cui si verificano — senza dover scavare manualmente nei log.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-explosion"></i>'
    title: Analisi dei Crash
    details: Scansiona automaticamente i crash-report e i log di errore fatale della JVM all'avvio. Fyrx ti dirà esattamente cosa ha ucciso il tuo server prima ancora che tu lo chieda.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-stopwatch"></i>'
    title: Monitor dei Tick
    details: Un leggero thread in background sorveglia i TPS del tuo server. Se il thread principale si blocca per più di 5 secondi, Fyrx identifica il plugin colpevole.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-clock-rotate-left"></i>'
    title: Errori di Avvio Precoci
    details: Legge logs/latest.log all'avvio per rilevare conflitti di dipendenze ed errori di versione avvenuti prima ancora che AbsoluteSolver si caricasse.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-bolt"></i>'
    title: Architettura a Zero Lag
    details: Tutta l'elaborazione IA, l'I/O su file e le chiamate di rete vengono eseguite su thread in background. I TPS del tuo server non vengono mai influenzati mentre Fyrx sta pensando.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-gavel"></i>'
    title: Moderazione Chat con IA e Sanzioni
    details: Fyrx legge il contesto del chat (non una lista di parole vietate) e supporta ogni verdetto con un punteggio di confidenza. Un sistema completo di warn/mute/kick/ban con rilevamento alt, ricorsi in gioco, supporto MySQL e una GUI.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-user-secret"></i>'
    title: Staff Mode Toolkit
    details: Vanish (due livelli), congelamento con canale di chat privato, chat esclusiva per lo staff, CommandSpy, profili combinati con nome, e inspect/enderchest con confisca in un click — tutto sotto /solver o come comandi indipendenti.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-flag"></i>'
    title: Segnalazioni Staff
    details: Qualsiasi giocatore può segnalare qualcosa all'attenzione dello staff con /solver report, gestito con una coda e una GUI proprie — completamente separato dalle sanzioni.
---
