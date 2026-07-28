---
layout: home

hero:
  name: "AbsoluteSolver"
  text: "Diagnósticos de Servidor con IA"
  tagline: "Conoce a Fyrx — tu asistente IA integrado que analiza automáticamente errores de consola, reportes de crasheos y lag en el servidor, en lenguaje claro."
  image:
    src: /solver.svg
    alt: AbsoluteSolver
  actions:
    - theme: brand
      text: Empezar
      link: /es/solver/getting-started
    - theme: alt
      text: Ver en Modrinth
      link: https://modrinth.com/plugin/solver
    - theme: alt
      text: English
      link: /en/solver/getting-started

features:
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-brain"></i>'
    title: Integración de IA Gemini
    details: Potenciado por el modelo Gemini de Google. Fyrx traduce los crípticos stack traces de Java en soluciones claras y comprensibles.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-triangle-exclamation"></i>'
    title: Monitor de Consola en Vivo
    details: Inyectado directamente en el motor Log4j del servidor. Los errores son interceptados al instante — no hay que buscar en los logs manualmente.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-explosion"></i>'
    title: Análisis de Crashes
    details: Escanea automáticamente crash-reports y errores fatales JVM al inicio. Fyrx te dirá exactamente qué mató a tu servidor antes de que te des cuenta.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-stopwatch"></i>'
    title: Monitor de Ticks
    details: Un hilo ligero vigila los TPS. Si el hilo principal se cuelga por más de 5 segundos, Fyrx identifica al plugin culpable.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-clock-rotate-left"></i>'
    title: Errores Tempranos de Inicio
    details: Lee logs/latest.log al arrancar para detectar conflictos de dependencias que ocurrieron antes de que AbsoluteSolver haya cargado.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-bolt"></i>'
    title: Arquitectura Cero-Lag
    details: Todo el procesamiento de IA, lectura de archivos y peticiones de red ocurren en segundo plano. Los TPS no se ven afectados mientras Fyrx piensa.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-gavel"></i>'
    title: Moderación de Chat con IA y Sanciones
    details: Fyrx lee el contexto del chat (no una lista de palabras) y respalda cada veredicto con un puntaje de confianza. Un sistema completo de warn/mute/kick/ban con detección de alts, apelaciones dentro del juego, soporte MySQL y una GUI.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-user-secret"></i>'
    title: Staff Mode Toolkit
    details: Vanish (dos niveles), congelamiento con canal de chat privado, chat exclusivo de staff, CommandSpy, perfiles combinados con nombre, e inspect/enderchest con confiscar-con-un-click — todo bajo /solver o como comandos independientes.
  - icon: '<svg style="display: none;"></svg><i class="fa-solid fa-flag"></i>'
    title: Reportes de Staff
    details: Cualquier jugador puede marcar algo para la atención del staff con /solver report, gestionado con su propia cola y GUI — totalmente separado de las sanciones.
---
