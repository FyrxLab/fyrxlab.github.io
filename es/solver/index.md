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
---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-brain"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Por qué AbsoluteSolver</span>
    <h3>Fyrx lee tu servidor para que tú no tengas que hacerlo</h3>
    <p>Viene con Anthropic Claude por defecto — Google Gemini y cualquier endpoint compatible con OpenAI también son totalmente compatibles. Fyrx convierte stack traces crípticos de Java, spam de consola y picos de lag en una explicación en lenguaje claro de lo que realmente pasó.</p>
    <p class="spotlight-note">Cada llamada a la IA corre en un hilo en segundo plano — el análisis, la lectura de archivos y las peticiones de red nunca tocan tu hilo principal. Tus TPS ni se enteran de que Fyrx está ahí.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">Diagnóstico</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><b>Monitor de Consola en Vivo</b><p>Inyectado directamente en el motor Log4j del servidor. Los errores se interceptan al instante — sin buscar en los logs manualmente.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-explosion"></i>
    <div><b>Análisis de Crashes</b><p>Escanea automáticamente crash-reports y errores fatales de la JVM al inicio. Fyrx te dice exactamente qué mató tu servidor antes de que preguntes.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-stopwatch"></i>
    <div><b>Monitor de Ticks</b><p>Un hilo ligero en segundo plano vigila tus TPS. Si el hilo principal se cuelga por más de 5 segundos, Fyrx identifica al plugin culpable.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-clock-rotate-left"></i>
    <div><b>Errores Tempranos de Inicio</b><p>Lee logs/latest.log al arrancar para detectar conflictos de dependencias y errores de versión ocurridos antes de que AbsoluteSolver cargara.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Moderación y Seguridad</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-gavel"></i>
    <div><b>Moderación de Chat con IA</b><p>Fyrx lee el contexto real de la conversación, no una lista de palabras, y respalda cada veredicto con un puntaje de confianza antes de actuar.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-scale-balanced"></i>
    <div><b>Sistema de Sanciones</b><p>Sistema completo de warn/mute/kick/ban con detección de cuentas alternativas por IP, apelaciones dentro del juego, soporte MySQL y una GUI.</p></div>
  </div>
</div>

</div>

<div class="feature-group">
<div class="feature-group-title">Herramientas de Staff</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-user-secret"></i>
    <div><b>Staff Mode Toolkit</b><p>Vanish (dos niveles), congelamiento con canal de chat privado, chat exclusivo de staff, CommandSpy, e inspect/enderchest con confiscar de un click.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-flag"></i>
    <div><b>Reportes de Staff</b><p>Cualquier jugador puede marcar algo para el staff con /solver report — con su propia cola y GUI, totalmente separado de las sanciones.</p></div>
  </div>
</div>

</div>
