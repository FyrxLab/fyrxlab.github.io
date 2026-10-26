// All translated UI copy for Landing.vue, keyed by locale. Kept separate from
// the component because there's a lot of it — inlining would bury the markup.
//
// Note on the flagship terminal scenarios: the fake server-console `lines`
// (the [HH:MM:SS INFO] log format) stay in English in every locale — that's
// what a real Minecraft/Log4j console actually looks like, localizing it
// would be less authentic, not more. Only Fyrx's own spoken `diagnosis` and
// the confidence/severity `meta` line are translated — that mirrors Solver's
// real config, where `localization` only ever covers "Fyrx's AI responses
// and in-game messages", never the raw console output.

export const LANDING_COPY = {
  en: {
    heroSearching: 'Resolving FyrxLab status...',
    bootLines: [
      'Solver — TickMonitor nominal, Fyrx AI standing by',
      'SolverMOTD, Absolute Furnace, Phosphophyllite — online',
      'Noteblock, LazyMod — online'
    ],
    heroFinal: (n) => `${n} products · 1 developer · built with patience`,
    heroSub: "A one-developer lab building serious tooling for Minecraft servers — and a few mods purely because they're fun.",
    ctaPrimary: 'View Solver →',
    ctaGhost: 'Explore the portfolio',
    scrollAria: 'Scroll to the flagship section',
    flagshipPrefix: 'The flagship — ',
    flagshipParagraph: "Solver isn't just another entry in the catalog — it's a server-operations plugin with an AI assistant that reads your crashes, your ticks, and your chat, and explains what happened in plain language instead of a stack trace.",
    flagshipBullets: [
      { b: 'AI crash analysis', t: 'catches plugin incompatibilities before the server even finishes booting.' },
      { b: 'TickMonitor', t: 'if the main thread freezes, Fyrx reads the thread dump and tells you which plugin is choking it.' },
      { b: 'Context-aware chat moderation', t: 'not a word blacklist, the whole conversation evaluated by AI.' },
      { b: 'Sanctions system', t: 'IDs, full history, in-game appeals, alt-account cross-referencing by IP.' }
    ],
    spinnerText: 'Fyrx AI analyzing crash…',
    portfolioEyebrow: '~/fyrxlab',
    portfolioTitle: 'The full portfolio',
    portfolioSub: 'Serious tooling and mods with personality, in one lab. Each one lives in its own color.',
    aboutLabel: 'The studio',
    aboutLead: 'FyrxLab is a one-developer studio',
    aboutRest: ' — no marketing team, no funding round, just someone building the tools their own server needed that turned out to be useful for more people.',
    factDeveloper: 'developer',
    factActiveProducts: 'active products',
    factLanguages: 'languages in the docs',
    factSolver: 'Solver:',
    factSolverLicense: 'All Rights Reserved',
    factMods: 'Mods:',
    factModsLicense: 'MIT'
  },
  es: {
    heroSearching: 'Resolviendo el estado de FyrxLab...',
    bootLines: [
      'Solver — TickMonitor nominal, Fyrx AI en espera',
      'SolverMOTD, Absolute Furnace, Phosphophyllite — en línea',
      'Noteblock, LazyMod — en línea'
    ],
    heroFinal: (n) => `${n} productos · 1 desarrollador · construido con paciencia`,
    heroSub: 'Un laboratorio de un solo desarrollador construyendo herramientas serias para servidores de Minecraft — y algunos mods solo porque son divertidos.',
    ctaPrimary: 'Ver Solver →',
    ctaGhost: 'Explorar el portafolio',
    scrollAria: 'Ir a la sección principal',
    flagshipPrefix: 'El buque insignia — ',
    flagshipParagraph: 'Solver no es solo otra entrada del catálogo — es un plugin de operaciones de servidor con un asistente de IA que lee tus crashes, tus ticks y tu chat, y explica qué pasó en lenguaje claro en vez de un stack trace.',
    flagshipBullets: [
      { b: 'Análisis de crashes con IA', t: 'detecta incompatibilidades entre plugins antes de que el servidor termine de arrancar.' },
      { b: 'TickMonitor', t: 'si el hilo principal se congela, Fyrx lee el thread dump y te dice qué plugin lo está ahorcando.' },
      { b: 'Moderación de chat por contexto', t: 'no es una lista de palabras prohibidas, es la conversación completa evaluada por IA.' },
      { b: 'Sistema de sanciones', t: 'IDs, historial completo, apelaciones dentro del juego, cruce de cuentas alternativas por IP.' }
    ],
    spinnerText: 'Fyrx AI analizando el crash…',
    portfolioEyebrow: '~/fyrxlab',
    portfolioTitle: 'El portafolio completo',
    portfolioSub: 'Herramientas serias y mods con personalidad, en un mismo laboratorio. Cada uno vive en su propio color.',
    aboutLabel: 'El estudio',
    aboutLead: 'FyrxLab es un estudio de un solo desarrollador',
    aboutRest: ' — sin equipo de marketing, sin ronda de inversión, solo alguien construyendo las herramientas que su propio servidor necesitaba y que terminaron siendo útiles para más gente.',
    factDeveloper: 'desarrollador',
    factActiveProducts: 'productos activos',
    factLanguages: 'idiomas en la documentación',
    factSolver: 'Solver:',
    factSolverLicense: 'Todos los derechos reservados',
    factMods: 'Mods:',
    factModsLicense: 'MIT'
  },
  it: {
    heroSearching: 'Verifica dello stato di FyrxLab...',
    bootLines: [
      'Solver — TickMonitor nominale, Fyrx AI in attesa',
      'SolverMOTD, Absolute Furnace, Phosphophyllite — online',
      'Noteblock, LazyMod — online'
    ],
    heroFinal: (n) => `${n} prodotti · 1 sviluppatore · costruito con pazienza`,
    heroSub: 'Un laboratorio di un solo sviluppatore che costruisce strumenti seri per server Minecraft — e qualche mod solo perché sono divertenti.',
    ctaPrimary: 'Vedi Solver →',
    ctaGhost: 'Esplora il portfolio',
    scrollAria: 'Vai alla sezione principale',
    flagshipPrefix: 'Il prodotto di punta — ',
    flagshipParagraph: "Solver non è solo un'altra voce nel catalogo — è un plugin di gestione del server con un assistente IA che legge i tuoi crash, i tuoi tick e la tua chat, e spiega cosa è successo in linguaggio semplice invece di uno stack trace.",
    flagshipBullets: [
      { b: 'Analisi dei crash con IA', t: 'rileva le incompatibilità tra plugin prima ancora che il server finisca di avviarsi.' },
      { b: 'TickMonitor', t: 'se il thread principale si blocca, Fyrx legge il thread dump e ti dice quale plugin lo sta soffocando.' },
      { b: 'Moderazione della chat contestuale', t: "non una lista di parole vietate, l'intera conversazione valutata dall'IA." },
      { b: 'Sistema di sanzioni', t: 'ID, cronologia completa, appelli in-game, incrocio degli account alternativi tramite IP.' }
    ],
    spinnerText: 'Fyrx AI sta analizzando il crash…',
    portfolioEyebrow: '~/fyrxlab',
    portfolioTitle: 'Il portfolio completo',
    portfolioSub: 'Strumenti seri e mod con personalità, in un solo laboratorio. Ognuno vive nel proprio colore.',
    aboutLabel: 'Lo studio',
    aboutLead: 'FyrxLab è uno studio di un solo sviluppatore',
    aboutRest: ' — nessun team di marketing, nessun round di finanziamento, solo qualcuno che costruisce gli strumenti di cui il proprio server aveva bisogno e che si sono rivelati utili anche per altri.',
    factDeveloper: 'sviluppatore',
    factActiveProducts: 'prodotti attivi',
    factLanguages: 'lingue nella documentazione',
    factSolver: 'Solver:',
    factSolverLicense: 'Tutti i diritti riservati',
    factMods: 'Mod:',
    factModsLicense: 'MIT'
  },
  pt: {
    heroSearching: 'Verificando o status da FyrxLab...',
    bootLines: [
      'Solver — TickMonitor nominal, Fyrx AI em espera',
      'SolverMOTD, Absolute Furnace, Phosphophyllite — online',
      'Noteblock, LazyMod — online'
    ],
    heroFinal: (n) => `${n} produtos · 1 desenvolvedor · construído com paciência`,
    heroSub: 'Um laboratório de um único desenvolvedor construindo ferramentas sérias para servidores de Minecraft — e alguns mods só porque são divertidos.',
    ctaPrimary: 'Ver Solver →',
    ctaGhost: 'Explorar o portfólio',
    scrollAria: 'Ir para a seção principal',
    flagshipPrefix: 'O carro-chefe — ',
    flagshipParagraph: 'Solver não é só mais um item no catálogo — é um plugin de operações de servidor com um assistente de IA que lê seus crashes, seus ticks e seu chat, e explica o que aconteceu em linguagem simples em vez de um stack trace.',
    flagshipBullets: [
      { b: 'Análise de crashes com IA', t: 'detecta incompatibilidades de plugins antes mesmo do servidor terminar de iniciar.' },
      { b: 'TickMonitor', t: 'se a thread principal travar, Fyrx lê o thread dump e diz qual plugin está sufocando ela.' },
      { b: 'Moderação de chat por contexto', t: 'não é uma lista de palavras proibidas, é a conversa inteira avaliada por IA.' },
      { b: 'Sistema de sanções', t: 'IDs, histórico completo, apelações dentro do jogo, cruzamento de contas alternativas por IP.' }
    ],
    spinnerText: 'Fyrx AI analisando o crash…',
    portfolioEyebrow: '~/fyrxlab',
    portfolioTitle: 'O portfólio completo',
    portfolioSub: 'Ferramentas sérias e mods com personalidade, em um só laboratório. Cada um vive na sua própria cor.',
    aboutLabel: 'O estúdio',
    aboutLead: 'FyrxLab é um estúdio de um único desenvolvedor',
    aboutRest: ' — sem equipe de marketing, sem rodada de investimento, só alguém construindo as ferramentas que o próprio servidor precisava e que acabaram sendo úteis para mais gente.',
    factDeveloper: 'desenvolvedor',
    factActiveProducts: 'produtos ativos',
    factLanguages: 'idiomas na documentação',
    factSolver: 'Solver:',
    factSolverLicense: 'Todos os direitos reservados',
    factMods: 'Mods:',
    factModsLicense: 'MIT'
  }
}

// Index-matched to the `scenarios` array in Landing.vue — only the spoken
// diagnosis + meta line, never the raw console `lines` (see note above).
export const SCENARIO_TEXT = {
  en: [
    { diagnosis: "This isn't a corrupted install. Two plugins are hooking the same event before the server finishes loading — reorder the load entries in paper-plugins.yml and it's fixed in one restart.", meta: '● 94% confidence · severity: medium' },
    { diagnosis: "The main thread is blocked inside EconomyPluginX#onPlayerJoin — it's making a synchronous database call on every join. Move it to an async task and the freeze goes away.", meta: '● 91% confidence · severity: high' },
    { diagnosis: "This isn't a memory leak in Solver. ChunkGeneratorX caches every generated chunk in memory and never releases it — cap its cache size, or raise -Xmx until it's patched.", meta: '● 88% confidence · severity: high' },
    { diagnosis: "Flagged THREAT, not banter — direct, repeated intent language, corroborated by the target's prior reports. Auto-muted pending staff review: confidence is high, but severity alone doesn't clear the bar for an automatic ban.", meta: '● 96% confidence · severity: critical' },
    { diagnosis: 'xXDestroyerXx shares an IP with Sn1per_09, already banned. This ban kicks the alt immediately instead of waiting for its next login.', meta: '● 99% confidence · severity: medium' }
  ],
  es: [
    { diagnosis: 'Esto no es una instalación corrupta. Dos plugins están enganchando el mismo evento antes de que el servidor termine de cargar — reordena las entradas de carga en paper-plugins.yml y se arregla en un reinicio.', meta: '● 94% de confianza · severidad: media' },
    { diagnosis: 'El hilo principal está bloqueado dentro de EconomyPluginX#onPlayerJoin — está haciendo una consulta síncrona a la base de datos en cada conexión. Muévela a una tarea asíncrona y el congelamiento desaparece.', meta: '● 91% de confianza · severidad: alta' },
    { diagnosis: 'Esto no es una fuga de memoria en Solver. ChunkGeneratorX guarda en caché cada chunk generado y nunca lo libera — limita el tamaño de su caché, o sube el -Xmx hasta que lo arreglen.', meta: '● 88% de confianza · severidad: alta' },
    { diagnosis: 'Marcado como AMENAZA, no como broma — lenguaje de intención directo y repetido, respaldado por reportes previos del objetivo. Silenciado automáticamente pendiente de revisión de staff: la confianza es alta, pero la severidad sola no alcanza el umbral para un ban automático.', meta: '● 96% de confianza · severidad: crítica' },
    { diagnosis: 'xXDestroyerXx comparte IP con Sn1per_09, que ya está baneado. Este ban expulsa a la cuenta alterna de inmediato en vez de esperar su próximo inicio de sesión.', meta: '● 99% de confianza · severidad: media' }
  ],
  it: [
    { diagnosis: "Non è un'installazione corrotta. Due plugin stanno agganciando lo stesso evento prima che il server finisca di caricarsi — riordina le voci di caricamento in paper-plugins.yml e si risolve con un riavvio.", meta: '● 94% di sicurezza · gravità: media' },
    { diagnosis: 'Il thread principale è bloccato dentro EconomyPluginX#onPlayerJoin — sta eseguendo una chiamata sincrona al database a ogni accesso. Spostala in un task asincrono e il blocco sparisce.', meta: '● 91% di sicurezza · gravità: alta' },
    { diagnosis: 'Non è una perdita di memoria di Solver. ChunkGeneratorX mette in cache ogni chunk generato senza mai rilasciarlo — limita la dimensione della sua cache, oppure aumenta -Xmx finché non viene corretto.', meta: '● 88% di sicurezza · gravità: alta' },
    { diagnosis: 'Segnalato come MINACCIA, non scherzo — linguaggio di intento diretto e ripetuto, confermato da segnalazioni precedenti contro il bersaglio. Silenziato automaticamente in attesa di revisione dello staff: la sicurezza è alta, ma la gravità da sola non basta per un ban automatico.', meta: '● 96% di sicurezza · gravità: critica' },
    { diagnosis: "xXDestroyerXx condivide l'IP con Sn1per_09, già bannato. Questo ban espelle l'account alternativo immediatamente invece di aspettare il prossimo accesso.", meta: '● 99% di sicurezza · gravità: media' }
  ],
  pt: [
    { diagnosis: 'Isso não é uma instalação corrompida. Dois plugins estão interceptando o mesmo evento antes do servidor terminar de carregar — reordene as entradas de carregamento em paper-plugins.yml e resolve em um reinício.', meta: '● 94% de confiança · severidade: média' },
    { diagnosis: 'A thread principal está bloqueada dentro de EconomyPluginX#onPlayerJoin — ela está fazendo uma chamada síncrona ao banco de dados a cada entrada. Mova para uma tarefa assíncrona e o travamento desaparece.', meta: '● 91% de confiança · severidade: alta' },
    { diagnosis: 'Isso não é um vazamento de memória do Solver. O ChunkGeneratorX armazena em cache cada chunk gerado e nunca libera — limite o tamanho do cache dele, ou aumente o -Xmx até ser corrigido.', meta: '● 88% de confiança · severidade: alta' },
    { diagnosis: 'Marcado como AMEAÇA, não brincadeira — linguagem de intenção direta e repetida, corroborada por denúncias anteriores contra o alvo. Silenciado automaticamente aguardando revisão da staff: a confiança é alta, mas a severidade sozinha não atinge o limite para um banimento automático.', meta: '● 96% de confiança · severidade: crítica' },
    { diagnosis: 'xXDestroyerXx compartilha o IP com Sn1per_09, que já está banido. Este banimento expulsa a conta alternativa imediatamente em vez de esperar o próximo login.', meta: '● 99% de confiança · severidade: média' }
  ]
}
