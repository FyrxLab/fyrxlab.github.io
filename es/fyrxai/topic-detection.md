# Detección de Temas

Cuando llega un mensaje, FyrxAI decide *si* responder y *sobre cuál* tema documentado (wiki) trata, en tres capas — la más barata y segura primero.

## 1. Coincidencia exacta

Si el nombre de una wiki aparece literalmente en el mensaje, ese es el tema. Sin gastar ninguna llamada de IA.

## 2. Coincidencia difusa

Comparación por distancia de edición (Levenshtein), tolerante a diferencias de espaciado y pluralización ("conditional event" sigue coincidiendo con una wiki llamada `conditionalevents`) y a errores de tipeo en el *nombre mismo*. Esto es comparación de texto plano, no IA — los modelos de embeddings no están hechos para tolerar errores de tipeo, así que esta capa existe específicamente para cubrir lo que ellos no captan.

## 3. Modelo semántico local

Para mensajes que describen un problema sin nombrar la wiki en absoluto, FyrxAI recurre a un modelo de embeddings local offline pequeño (`Xenova/paraphrase-MiniLM-L3-v2`, sin necesidad de API key ni llamada de red). Los vectores de referencia vienen del nombre y descripción de la wiki, más cada keyword extraída del rastreo — tanto el pase automático por regex (encabezados, código inline, `/comandos`, `%variables%`, siempre disponible) como el pase generado por IA (si hay un proveedor configurado). Una coincidencia necesita tanto superar un umbral de similitud como ganarle por margen al tema en segundo lugar, para reducir adivinanzas confiadas pero equivocadas.

## Servidores con un solo tema

Si solo hay una wiki configurada, no hay nada que desambiguar — cualquier mensaje razonablemente parecido a una pregunta en el canal de soporte se trata como si fuera sobre ella, sin necesidad de nombrarla. Los saludos y la charla trivial ("hola qué tal") se filtran aparte para que no disparen una respuesta.

## Respuestas garantizadas

Mencionar (@) al bot se salta las tres capas y responde directamente (aún sujeto al cooldown por usuario) — ver [Configuración](/es/fyrxai/configuration#obtener-una-respuesta-directamente).

## Límite de uso

Responder cuesta "atención", que se regenera con el tiempo por usuario — una ráfaga de preguntas se limita progresivamente en vez de que todos compartan un cooldown fijo. Exenta usuarios o roles específicos (ej. moderadores) con `/fyrxai exempt`.
