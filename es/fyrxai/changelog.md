# Changelog

## v1.2.1
- Formalizada la compatibilidad con ES modules mediante un mapa `exports` explícito en `package.json` — `import setupFyrxAI from 'fyrxai'` ahora funciona junto a `require()`.

## v1.2.0
- Añadido `/fyrxai exempt` — usuarios y roles configurables por servidor (ej. moderadores) que se saltan el cooldown de atención.
- Detección de temas más permisiva en servidores de una sola wiki: un tema único configurado ahora responde preguntas razonables sin exigir que se mencione su nombre, filtrando igualmente saludos y charla trivial.
- Detección de "problema" ampliada para capturar más frases cotidianas (ej. expresiones regionales de "no funciona", conjugaciones verbales en español).
- Mencionar (@) al bot ahora garantiza una respuesta en cualquier canal, saltándose todos los filtros heurísticos. Mencionarlo mientras respondes a otro mensaje hace que responda sobre ese mensaje en vez de tu texto de mención.

## v1.0.0
- Lanzamiento público inicial: rastreo de documentación de sitio completo (`llms.txt`/`sitemap.xml`/seguimiento de enlaces), extracción de keywords automática + asistida por IA, detección de temas en tres capas, configuración por comando slash `/fyrxai`, y soporte para WaveSpeed, OpenRouter, Google AI Studio, y Claude Platform.
