---
layout: home

hero:
  name: "FyrxAI"
  text: "Agente de Soporte con IA para Bots de Discord"
  tagline: "Añade un agente de soporte con IA a tu propio bot de discord.js en minutos — configurado enteramente desde Discord, sin editar código, sin variables de entorno."
  actions:
    - theme: brand
      text: Empezar
      link: /es/fyrxai/configuration
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/FyrxLab/fyrx-ai
    - theme: alt
      text: English
      link: /en/fyrxai/

---

<div class="spotlight">
  <div class="spotlight-icon"><i class="fa-solid fa-robot"></i></div>
  <div class="spotlight-body">
    <span class="spotlight-eyebrow">Por qué FyrxAI</span>
    <h3>Apúntalo a tu documentación, no a tu código</h3>
    <p>FyrxAI es una librería pequeña, no un servicio alojado — la instalas en tu propio bot. Dale uno o más sitios de documentación con <code>/fyrxai wiki add</code> y los rastrea, extrae keywords, y empieza a responder preguntas en tus canales de soporte automáticamente. Sin preparar un dataset a mano.</p>
  </div>
</div>

<div class="feature-group">
<div class="feature-group-title">Qué Obtienes</div>

<div class="feature-mini-grid">
  <div class="feature-mini">
    <i class="fa-solid fa-spider"></i>
    <div><b>Rastreo de Sitio Completo</b><p>Apunta <code>/fyrxai wiki add</code> a una sola página y descubre el resto vía <code>llms.txt</code>, <code>sitemap.xml</code>, o siguiendo enlaces del mismo dominio.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-layer-group"></i>
    <div><b>Detección de Temas en Tres Capas</b><p>Coincidencia exacta, luego difusa (tolerante a errores de tipeo), luego un modelo de embeddings local offline — sin gastar una llamada de IA para saber de qué trata una pregunta.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-plug"></i>
    <div><b>Trae tu Propio Proveedor</b><p>WaveSpeed, OpenRouter, Google AI Studio, o Claude Platform — elige uno por servidor, configurado con una respuesta efímera de comando slash.</p></div>
  </div>
  <div class="feature-mini">
    <i class="fa-solid fa-shield-halved"></i>
    <div><b>Nada Hardcodeado</b><p>Cada canal, wiki, proveedor y permiso se configura desde el chat de Discord. Instala el paquete y viene sin ningún archivo de configuración.</p></div>
  </div>
</div>

</div>

## Instalación

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

Continúa con [Configuración](/es/fyrxai/configuration) para la configuración del lado de Discord.
