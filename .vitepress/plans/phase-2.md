# FyrxDocs — propuesta de fase 2

Estado: fase 2A implementada para revisión local; fase 2B pendiente. La propuesta original se conserva debajo como contexto de diseño, basada en la fase 1, commit `bd49914`.

La entrega 2A añade Mi servidor, revisión e historial de Config Studio, proyectos de preferencias sin credenciales, edición visual de MOTD y continuidad en memoria entre páginas. También conecta 104 tarjetas, añade directorios a las 28 portadas de producto y rutas de regreso desde sus subpáginas. La validación automatizada cubre los enlaces y anclas internos de los cuatro idiomas. No se ha hecho merge ni publicado.

Restricción vigente: trabajar en `codex/fyrxdocs-lab-major`, revisar en local y no hacer merge, push, despliegue ni ejecutar el workflow de publicación.

## La apuesta

Convertir el laboratorio en un recorrido que el usuario pueda terminar: elegir su entorno, preparar una configuración, revisar qué cambió y llevarse instrucciones concretas para instalarla.

La promesa sería: **«Prepara tu servidor y entiende cada decisión antes de instalar».** El atractivo visual debe mostrar resultados reales: una configuración revisable, un MOTD personalizado y una ruta de instalación coherente.

## Lo que ya existe y conviene aprovechar

- Perfil local compartido de Minecraft, plataforma y objetivo.
- Consulta de versiones estables y dependencias en Modrinth.
- Lector YAML, revisión de tipos y algunas reglas, edición y descarga de Solver.
- Vista previa de MOTD y validación de banners.
- Tres escenarios didácticos de Solver.
- Buscador local, cuatro idiomas, matriz de compatibilidad, reproductor de Noteblock y filtro de changelog por versión instalada.

La fase 2 ampliaría estas piezas; no duplicaría el buscador, el reproductor ni el changelog.

## Hallazgos que determinan las prioridades

| Hallazgo en el código | Consecuencia para el usuario | Respuesta propuesta |
| --- | --- | --- |
| [profile.js](C:/FyrxLab/FyrxDocs/.vitepress/theme/lab/profile.js:5) conserva solo Minecraft, plataforma y objetivo. | La versión del producto elegida y el avance no acompañan al usuario entre herramientas. | Un estado común de preparación con producto y versión objetivo. |
| [ConfigStudio.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/lab/ConfigStudio.vue:11) y [MotdStudio.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/lab/MotdStudio.vue:9) mantienen el trabajo dentro del componente. | Salir de la herramienta puede descartar la edición. | Conservar en memoria durante la sesión de navegación y permitir guardar un proyecto explícitamente. |
| [ConfigStudio.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/lab/ConfigStudio.vue:54) desactiva «Aplicar» ante cualquier error. | Un valor inválido que tiene un control visual también puede obligar a corregir el YAML a mano. | Separar errores de sintaxis de errores de valores y permitir reparar los campos compatibles. |
| [MotdStudio.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/lab/MotdStudio.vue:15) contiene tres plantillas con textos en inglés. | La interfaz está traducida, pero los diseños iniciales no; todavía hay que conocer etiquetas para personalizarlos. | Plantillas localizadas y edición visual de formato. |
| [CompatMatrix.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/CompatMatrix.vue:42) agrupa versiones y presenta loaders por proyecto. | Un punto en la matriz no demuestra que exista un archivo para la combinación exacta del usuario. | Conectar la matriz con el verificador de versión y plataforma de instalación. |
| [ChangesSince.vue](C:/FyrxLab/FyrxDocs/.vitepress/theme/ChangesSince.vue:22) filtra entradas del changelog. | Permite leer novedades, pero no produce un plan de actualización ni verifica migraciones. | Añadir una ruta de actualización basada en reglas documentadas, sin inferir renombres. |

Estos son hallazgos de inspección del código. No se realizó una nueva ronda de pruebas de navegador durante esta planificación.

## Fase 2A — recorrido completo y una mejora visual clara

### 1. Mi servidor

Un panel inicial muestra el entorno elegido, el producto y la versión objetivo, las dependencias y el siguiente paso. La portada ofrece «Continuar preparación» cuando ya existe un recorrido.

Flujo: **entorno → archivo compatible → configurar → revisar → instrucciones de instalación**.

El progreso representa pasos marcados por el usuario o artefactos preparados; no afirma que el servidor remoto ya esté instalado o funcionando. Cambiar Minecraft, plataforma o versión invalida los resultados derivados y pide verificarlos de nuevo.

La matriz y las páginas de producto abren este mismo recorrido con el contexto adecuado. Una consulta fallida de Modrinth se diferencia de una combinación sin archivo disponible.

**Se considera terminado cuando:** el usuario puede empezar desde un producto o desde el laboratorio, seleccionar una combinación, continuar a la herramienta apropiada y volver sin repetir sus elecciones. Una selección incompatible no presenta una configuración como lista para ese entorno.

Esfuerzo relativo: medio. Dependencia principal: definir el estado compartido y las reglas que invalidan selecciones previas.

### 2. Config Studio con revisión y recuperación

- Modos «Guiado» y «YAML» que trabajan sobre el mismo documento.
- Plantillas explicadas: diagnóstico básico, moderación solo con avisos y configuración personalizada. Toda plantilla parte de los valores de una versión concreta.
- Revisión de cambios con valor anterior, valor nuevo y motivo; claves sensibles ocultas en resúmenes.
- Errores enlazados con su campo o línea y una indicación para corregirlos. Evitar anunciar de nuevo toda la validación por cada pulsación.
- Historial acotado de cambios y recuperación al navegar dentro del sitio.
- Configuración cruda con claves únicamente en memoria, salvo descarga explícita. No guardar secretos automáticamente en almacenamiento del navegador, URL ni telemetría. Al cerrar o recargar, ofrecer guardar el trabajo cuando corresponda.
- Un proyecto exportable sin credenciales para retomar preferencias. La descarga de `config.yml` conserva los valores que el usuario decida incluir.

La revisión no convierte una configuración antigua en una migración verificada. El cambio de nombres o eliminación de opciones necesita reglas respaldadas por las versiones reales del plugin.

**Se considera terminado cuando:** una persona puede reparar un valor desde el formulario, entender el cambio antes de aplicarlo, deshacerlo, visitar la guía y regresar sin perder la edición. Los resúmenes y proyectos compartibles no contienen claves de prueba.

Esfuerzo relativo: medio–alto. Se integra después del estado de «Mi servidor».

La presentación de errores seguiría el patrón de mensajes claros, asociados al campo y con instrucciones para resolverlos de [W3C WAI](https://www.w3.org/WAI/tutorials/forms/notifications/).

### 3. MOTD Studio visual

Seleccionar texto y aplicar colores, gradientes y formato mediante controles. Añadir una galería pequeña de diseños cuidados y localizados, personalización del nombre y una comparación entre variantes.

Mostrar juntos el resultado moderno y la alternativa para clientes anteriores. Detectar etiquetas que la vista previa no reproduce y explicar ese límite. Los placeholders continúan siendo ejemplos hasta evaluarlos en el servidor.

Separar claramente el nombre local mostrado en la lista de servidores del texto que realmente se exporta como MOTD. Importar un fragmento de configuración y permitir guardar un proyecto del diseño. Usar primero el banner que ya aporta el usuario; un editor de imágenes completo queda fuera de este bloque.

**Se considera terminado cuando:** se puede producir un diseño propio sin escribir etiquetas, cambiar de herramienta y regresar, exportarlo, reimportarlo y obtener los mismos campos. La vista previa mantiene su etiqueta de aproximación.

Esfuerzo relativo: medio–alto. Dependencia principal: representación del formato compatible con el renderizador existente.

## Fase 2B — diagnóstico y actualización

### 4. Diagnóstico local de logs

Ampliar el espacio de Solver con una segunda entrada: analizar un log propio en el navegador. Los escenarios actuales seguirían disponibles para aprender.

La primera versión buscaría un catálogo pequeño de patrones comprobados: dependencia ausente, incompatibilidad de Java, conflicto de puerto y memoria agotada. Cada resultado enlaza evidencia concreta, una explicación limitada y pasos de verificación. «No se encontró un patrón conocido» es un resultado válido.

El analizador sería determinista, con límites de tamaño y trabajo fuera del hilo de interfaz cuando haga falta. No se presentaría como el motor real de Solver ni como una causa raíz demostrada. El contenido no se enviaría a una IA o servicio externo.

Un informe para soporte se descarga después de revisarlo. El ocultado de datos se presenta como una ayuda, nunca como anonimización garantizada. Este bloque necesita ejemplos representativos y contrastados antes de prometer cobertura.

**Se considera terminado cuando:** cada regla tiene casos positivos, negativos y ambiguos; los resultados señalan las líneas que los originan; los casos desconocidos no reciben diagnósticos inventados; un archivo grande se rechaza o procesa sin bloquear la interfaz.

Esfuerzo relativo: alto. No debe retrasar el cierre de 2A.

### 5. Plan de actualización por versión

Conectar «tengo instalada esta versión» con la versión objetivo, las novedades, las dependencias y una lista de comprobaciones. Reutilizar el filtro de changelog existente y añadir fuentes para cualquier requisito de migración.

Un manifiesto versionado relacionaría versión del producto, configuración incluida, plataforma y documentación. Los requisitos sin evidencia se muestran como pendientes de verificar. No llamar «compatible» a la unión de todos los Minecraft y loaders de un proyecto.

VitePress 1.6.4 permite preparar metadatos desde archivos locales durante la compilación; esto puede servir para el catálogo documental sin un backend. No requiere convertir esta fase en una migración del framework. Referencia: [carga de datos de VitePress 1.6.4](https://vuejs.github.io/vitepress/v1/guide/data-loading).

**Se considera terminado cuando:** cada instrucción de migración tiene una fuente y una versión aplicable, y los casos sin regla conocida se distinguen de una actualización verificada.

Esfuerzo relativo: alto y dependiente de disponer de configuraciones y notas históricas fiables.

## Cómo se percibirá la mejora

El nuevo centro del laboratorio presenta el proyecto en curso, sus pasos y su resultado, manteniendo acceso directo a todas las herramientas. La portada muestra una vista real de configuración y un MOTD antes/después, además de la demostración de terminal que ya existe.

Mantener el lenguaje Neo-Aero y dar más espacio al contenido útil: controles claros, muestras grandes y transiciones discretas. Las animaciones no bloquean acciones y respetan movimiento reducido. Noteblock conserva su reproductor; no añadir otra demo del mismo tipo solo para aumentar el número de módulos.

## Orden y criterios de entrega

1. Resolver continuidad de sesión, identidad del producto/versión y estados incompatibles.
2. Terminar «Mi servidor» y la revisión de cambios de Config Studio como un recorrido completo.
3. Añadir el editor visual y las plantillas de MOTD; integrar sus vistas en la portada.
4. Revisar 2A en local. Decidir 2B según la utilidad observada y la disponibilidad de evidencia.

Validación de 2A: cuatro idiomas; teclado y móvil; navegación sin pérdida de edición; errores recuperables; proveedor de descargas inaccesible; exportación/importación consistente; ausencia de secretos en datos persistidos o enlaces. Mantener las pruebas de YAML, selección de versiones, renderizado y búsqueda ya existentes.

Medidas iniciales: tiempo y errores al completar un recorrido, necesidad de abrir documentación externa, capacidad de retomar una edición y comprensión del archivo exportado. Se pueden observar en pruebas locales; no requieren añadir analítica de visitantes.

Los esfuerzos anteriores son comparativos, no estimaciones de calendario. La revisión de dependencias heredadas continúa como una tarea separada antes de publicar.

## Fuera de esta propuesta inicial

Cuentas, sincronización en nube, acceso remoto al servidor, ejecución de comandos, chat con IA alojado, una galería pública de archivos aportados por usuarios y migraciones automáticas sin reglas verificadas. Añaden costes y responsabilidades que no son necesarios para completar el recorrido propuesto.

La siguiente propuesta es **2B**, pendiente de revisión y priorización. Este documento no autoriza publicar la major.
