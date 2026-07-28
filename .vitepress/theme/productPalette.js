// Single source of truth for per-product branding: color, current version, and
// copy shared between the nav version badge, the per-route theme CSS, and the
// homepage's product highlights. Update the `version`/`changelog` fields here
// when a product ships a new release - nothing else needs to change.
export const PRODUCTS = {
  solver: {
    name: 'AbsoluteSolver',
    kind: 'plugin',
    color: '#f1c40f',
    icon: 'fa-server',
    version: '0.8.0',
    changelog: '/solver/changelog',
    home: '/solver/',
    tagline: {
      en: 'AI-powered crash analysis, chat moderation, and a full sanctions system.',
      es: 'Análisis de crashes con IA, moderación de chat, y un sistema completo de sanciones.',
      it: 'Analisi dei crash con IA, moderazione del chat, e un sistema completo di sanzioni.',
      pt: 'Análise de crashes com IA, moderação de chat, e um sistema completo de sanções.'
    }
  },
  solvermotd: {
    name: 'SolverMOTD',
    kind: 'plugin',
    color: '#d17a3d',
    icon: 'fa-image',
    version: '1.2.2',
    changelog: null,
    home: '/solvermotd/',
    tagline: {
      en: 'Cross-platform MOTD plugin with MiniMessage and 1.21.9+ Image Banners.',
      es: 'Plugin MOTD multiplataforma con MiniMessage y Banners de Imagen 1.21.9+.',
      it: 'Plugin MOTD multipiattaforma con MiniMessage e Banner Immagine 1.21.9+.',
      pt: 'Plugin de MOTD multiplataforma com MiniMessage e Banners de Imagem 1.21.9+.'
    }
  },
  phos: {
    name: 'Phosphophyllite',
    kind: 'mod',
    color: '#49a37b',
    icon: 'fa-gem',
    version: '1.2.2',
    changelog: null,
    home: '/phos/',
    tagline: {
      en: 'A gem-inspired mineral with fragile weaponry and crystallization mechanics.',
      es: 'Un mineral inspirado en gemas, con armas frágiles y mecánicas de cristalización.',
      it: 'Un minerale ispirato alle gemme, con armi fragili e meccaniche di cristallizzazione.',
      pt: 'Um mineral inspirado em gemas, com armas frágeis e mecânicas de cristalização.'
    }
  },
  furnace: {
    name: 'Absolute Furnace',
    kind: 'mod',
    color: '#c9982b',
    icon: 'fa-fire-burner',
    version: '1.2.7',
    changelog: '/furnace/changelog',
    home: '/furnace/',
    tagline: {
      en: 'An 18-slot furnace with hopper automation and the Absolute Energy system.',
      es: 'Un horno de 18 slots con automatización por tolvas y el sistema Absolute Energy.',
      it: 'Un forno a 18 slot con automazione tramite tramogge e il sistema Absolute Energy.',
      pt: 'Um forno de 18 slots com automação por funil e o sistema Absolute Energy.'
    }
  },
  noteblock: {
    name: 'Noteblock',
    kind: 'mod',
    color: '#8b5cf6',
    icon: 'fa-music',
    version: null,
    changelog: null,
    home: '/noteblock/',
    tagline: {
      en: 'A collection of new, handcrafted music discs composed with note blocks.',
      es: 'Una colección de discos musicales originales compuestos con bloques de nota.',
      it: 'Una collezione di dischi musicali originali composti con blocchi nota.',
      pt: 'Uma coleção de discos musicais originais compostos com note blocks.'
    }
  },
  lazymod: {
    name: 'LazyMod',
    kind: 'mod',
    color: '#ff6a00',
    icon: 'fa-dragon',
    version: null,
    changelog: null,
    home: '/lazymod/',
    font: 'Dokdo',
    tagline: {
      en: 'Spawn already equipped with absurdly overpowered gear. Skip the grind.',
      es: 'Aparece ya equipado con equipo absurdamente poderoso. Sáltate el grindeo.',
      it: 'Appari già equipaggiato con equipaggiamento assurdamente potente. Salta la macinata.',
      pt: 'Apareça já equipado com equipamento absurdamente poderoso. Pule a repetição.'
    }
  }
}

export const PRODUCT_ORDER = ['solver', 'solvermotd', 'phos', 'furnace', 'noteblock', 'lazymod']
