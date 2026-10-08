// Single source of truth for per-product branding: color, current version, and
// copy shared between the nav version badge, the per-route theme CSS, and the
// homepage's product highlights. Update the `version`/`changelog` fields here
// when a product ships a new release - nothing else needs to change.
// `install` feeds the install card on each product home (InstallCard.vue);
// Minecraft ranges and platforms mirror the project's Modrinth listing.
export const PRODUCTS = {
  solver: {
    name: 'AbsoluteSolver',
    kind: 'plugin',
    color: '#f1c40f',
    icon: 'fa-server',
    version: '0.10.2',
    changelog: '/solver/changelog',
    home: '/solver/',
    install: { url: 'https://modrinth.com/plugin/solver', mc: '1.8.8 – 26.3', platforms: ['Paper', 'Purpur', 'Spigot', 'Folia', 'Velocity', 'BungeeCord', 'Waterfall'] },
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
    install: { url: 'https://modrinth.com/plugin/solvermotd', mc: '1.8 – 1.21.6', platforms: ['Paper', 'Purpur', 'Spigot', 'Folia', 'Velocity', 'BungeeCord', 'Waterfall'] },
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
    install: { url: 'https://modrinth.com/mod/phos', mc: '1.12.2 · 1.20.1 – 1.20.6', platforms: ['Fabric', 'Forge', 'NeoForge'] },
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
    install: { url: 'https://modrinth.com/mod/furnace', mc: '1.20.1 · 1.21.1 · 26.2', platforms: ['Forge', 'NeoForge'] },
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
    version: '1.2.0',
    changelog: '/noteblock/changelog',
    home: '/noteblock/',
    install: { url: 'https://modrinth.com/mod/noteblock', mc: '1.12.2 · 1.18 – 26.3', platforms: ['Fabric', 'Forge', 'NeoForge'] },
    tagline: {
      en: '11 new music discs, each song arranged entirely with note blocks. One jar for Fabric, Forge and NeoForge.',
      es: '11 discos de música nuevos, cada canción arreglada con bloques de nota. Un solo jar para Fabric, Forge y NeoForge.',
      it: '11 nuovi dischi musicali, ogni brano arrangiato con blocchi nota. Un solo jar per Fabric, Forge e NeoForge.',
      pt: '11 novos discos de música, cada faixa arranjada com note blocks. Um único jar para Fabric, Forge e NeoForge.'
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
    install: { url: 'https://modrinth.com/mod/lazymod', mc: '1.12.2 · 1.20.1 · 1.21.1', platforms: ['Fabric', 'Forge', 'NeoForge'] },
    font: 'Dokdo',
    tagline: {
      en: 'Spawn already equipped with absurdly overpowered gear. Skip the grind.',
      es: 'Aparece ya equipado con equipo absurdamente poderoso. Sáltate el grindeo.',
      it: 'Appari già equipaggiato con equipaggiamento assurdamente potente. Salta la macinata.',
      pt: 'Apareça já equipado com equipamento absurdamente poderoso. Pule a repetição.'
    }
  },
  fyrxai: {
    name: 'FyrxAI',
    kind: 'library',
    color: '#5865f2',
    icon: 'fa-robot',
    version: '1.2.1',
    changelog: '/fyrxai/changelog',
    home: '/fyrxai/',
    install: { url: 'https://github.com/FyrxLab/fyrx-ai', command: 'npm install github:FyrxLab/fyrx-ai', platforms: ['Node.js', 'discord.js'] },
    tagline: {
      en: 'Drop-in AI support agent for your own discord.js bot — configured entirely from Discord.',
      es: 'Agente de soporte con IA para tu propio bot de discord.js — configurado enteramente desde Discord.',
      it: 'Agente di supporto IA da integrare nel tuo bot discord.js — configurato interamente da Discord.',
      pt: 'Agente de suporte com IA para seu próprio bot discord.js — configurado inteiramente pelo Discord.'
    }
  }
}

export const PRODUCT_ORDER = ['solver', 'solvermotd', 'phos', 'furnace', 'noteblock', 'lazymod', 'fyrxai']
