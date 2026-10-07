import { defineConfig } from 'vitepress'
import fyrxCodeTheme from './theme/fyrx-code-theme.json' with { type: 'json' }

// NOTE: Solver's pages live flat under solver/ (no guide/ or features/ subfolders,
// unlike Furnace/SolverMOTD/Phos) — links below must match that or they 404.
const enAbsoluteSolverSidebar = [
  {
    text: 'AbsoluteSolver',
    items: [
      { text: 'Home', link: '/en/solver/' },
    ]
  },
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/en/solver/getting-started' },
      { text: 'Configuration', link: '/en/solver/configuration' },
      { text: 'Compatibility', link: '/en/solver/compatibility' },
    ]
  },
  {
    text: 'Features',
    items: [
      { text: 'Fyrx AI Assistant', link: '/en/solver/fyrx-ai' },
      { text: 'Console Monitor', link: '/en/solver/console-monitor' },
      { text: 'Crash Analysis', link: '/en/solver/crash-analysis' },
      { text: 'Tick Monitor', link: '/en/solver/tick-monitor' },
      { text: 'Proxy Networks', link: '/en/solver/proxy-relay' },
      { text: 'AntiVPN', link: '/en/solver/antivpn' },
    ]
  },
  { text: 'Commands', link: '/en/solver/commands' },
  { text: 'Changelog', link: '/en/solver/changelog' },
]

const esAbsoluteSolverSidebar = [
  {
    text: 'AbsoluteSolver',
    items: [
      { text: 'Inicio', link: '/es/solver/' },
    ]
  },
  {
    text: 'Guía',
    items: [
      { text: 'Primeros Pasos', link: '/es/solver/getting-started' },
      { text: 'Configuración', link: '/es/solver/configuration' },
      { text: 'Compatibilidad', link: '/es/solver/compatibility' },
    ]
  },
  {
    text: 'Funcionalidades',
    items: [
      { text: 'Asistente IA Fyrx', link: '/es/solver/fyrx-ai' },
      { text: 'Monitor de Consola', link: '/es/solver/console-monitor' },
      { text: 'Análisis de Crashes', link: '/es/solver/crash-analysis' },
      { text: 'Monitor de Ticks', link: '/es/solver/tick-monitor' },
      { text: 'Redes con Proxy', link: '/es/solver/proxy-relay' },
      { text: 'AntiVPN', link: '/es/solver/antivpn' },
    ]
  },
  { text: 'Comandos', link: '/es/solver/commands' },
  { text: 'Changelog', link: '/es/solver/changelog' },
]

const itAbsoluteSolverSidebar = [
  {
    text: 'AbsoluteSolver',
    items: [
      { text: 'Home', link: '/it/solver/' },
    ]
  },
  {
    text: 'Guida',
    items: [
      { text: 'Per Iniziare', link: '/it/solver/getting-started' },
      { text: 'Configurazione', link: '/it/solver/configuration' },
      { text: 'Compatibilità', link: '/it/solver/compatibility' },
    ]
  },
  {
    text: 'Funzionalità',
    items: [
      { text: 'Assistente IA Fyrx', link: '/it/solver/fyrx-ai' },
      { text: 'Monitor Console', link: '/it/solver/console-monitor' },
      { text: 'Analisi dei Crash', link: '/it/solver/crash-analysis' },
      { text: 'Monitor dei Tick', link: '/it/solver/tick-monitor' },
      { text: 'Reti con Proxy', link: '/it/solver/proxy-relay' },
      { text: 'AntiVPN', link: '/it/solver/antivpn' },
    ]
  },
  { text: 'Comandi', link: '/it/solver/commands' },
  { text: 'Changelog', link: '/it/solver/changelog' },
]

const ptAbsoluteSolverSidebar = [
  {
    text: 'AbsoluteSolver',
    items: [
      { text: 'Início', link: '/pt/solver/' },
    ]
  },
  {
    text: 'Guia',
    items: [
      { text: 'Primeiros Passos', link: '/pt/solver/getting-started' },
      { text: 'Configuração', link: '/pt/solver/configuration' },
      { text: 'Compatibilidade', link: '/pt/solver/compatibility' },
    ]
  },
  {
    text: 'Funcionalidades',
    items: [
      { text: 'Assistente de IA Fyrx', link: '/pt/solver/fyrx-ai' },
      { text: 'Monitor de Console', link: '/pt/solver/console-monitor' },
      { text: 'Análise de Crashes', link: '/pt/solver/crash-analysis' },
      { text: 'Monitor de Ticks', link: '/pt/solver/tick-monitor' },
      { text: 'Redes com Proxy', link: '/pt/solver/proxy-relay' },
      { text: 'AntiVPN', link: '/pt/solver/antivpn' },
    ]
  },
  { text: 'Comandos', link: '/pt/solver/commands' },
  { text: 'Changelog', link: '/pt/solver/changelog' },
]

const enFurnaceSidebar = [
  {
    text: 'Absolute Furnace',
    items: [
      { text: 'Home', link: '/en/furnace/' },
    ]
  },
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/en/furnace/guide/getting-started' },
      { text: 'Automation & Slots', link: '/en/furnace/guide/automation' },
    ]
  },
  {
    text: 'Features',
    items: [
      { text: 'Absolute Energy', link: '/en/furnace/features/energy' },
    ]
  },
  { text: 'Changelog', link: '/en/furnace/changelog' },
]

const esFurnaceSidebar = [
  {
    text: 'Absolute Furnace',
    items: [
      { text: 'Inicio', link: '/es/furnace/' },
    ]
  },
  {
    text: 'Guía',
    items: [
      { text: 'Primeros Pasos', link: '/es/furnace/guide/getting-started' },
      { text: 'Automatización y Slots', link: '/es/furnace/guide/automation' },
    ]
  },
  {
    text: 'Funcionalidades',
    items: [
      { text: 'Sistema Absolute Energy', link: '/es/furnace/features/energy' },
    ]
  },
  { text: 'Changelog', link: '/es/furnace/changelog' }
]

const itFurnaceSidebar = [
  {
    text: 'Absolute Furnace',
    items: [
      { text: 'Home', link: '/it/furnace/' },
    ]
  },
  {
    text: 'Guida',
    items: [
      { text: 'Per Iniziare', link: '/it/furnace/guide/getting-started' },
      { text: 'Automazione e Slot', link: '/it/furnace/guide/automation' },
    ]
  },
  {
    text: 'Funzionalità',
    items: [
      { text: 'Sistema Absolute Energy', link: '/it/furnace/features/energy' },
    ]
  },
  { text: 'Changelog', link: '/it/furnace/changelog' }
]

const ptFurnaceSidebar = [
  {
    text: 'Absolute Furnace',
    items: [
      { text: 'Início', link: '/pt/furnace/' },
    ]
  },
  {
    text: 'Guia',
    items: [
      { text: 'Primeiros Passos', link: '/pt/furnace/guide/getting-started' },
      { text: 'Automação e Slots', link: '/pt/furnace/guide/automation' },
    ]
  },
  {
    text: 'Funcionalidades',
    items: [
      { text: 'Sistema Absolute Energy', link: '/pt/furnace/features/energy' },
    ]
  },
  { text: 'Changelog', link: '/pt/furnace/changelog' }
]

const enSolverMOTDSidebar = [
  {
    text: 'SolverMOTD',
    items: [
      { text: 'Home', link: '/en/solvermotd/' },
    ]
  },
  {
    text: 'Guide',
    items: [
      { text: 'Getting Started', link: '/en/solvermotd/guide/getting-started' },
      { text: 'Image Banners', link: '/en/solvermotd/features/banner' },
      { text: 'Commands', link: '/en/solvermotd/commands' },
    ]
  }
]

const esSolverMOTDSidebar = [
  {
    text: 'SolverMOTD',
    items: [
      { text: 'Inicio', link: '/es/solvermotd/' },
    ]
  },
  {
    text: 'Guía',
    items: [
      { text: 'Primeros Pasos', link: '/es/solvermotd/guide/getting-started' },
      { text: 'Banners de Imagen', link: '/es/solvermotd/features/banner' },
      { text: 'Comandos', link: '/es/solvermotd/commands' },
    ]
  }
]

const itSolverMOTDSidebar = [
  {
    text: 'SolverMOTD',
    items: [
      { text: 'Home', link: '/it/solvermotd/' },
    ]
  },
  {
    text: 'Guida',
    items: [
      { text: 'Per Iniziare', link: '/it/solvermotd/guide/getting-started' },
      { text: 'Banner Immagine', link: '/it/solvermotd/features/banner' },
      { text: 'Comandi', link: '/it/solvermotd/commands' },
    ]
  }
]

const ptSolverMOTDSidebar = [
  {
    text: 'SolverMOTD',
    items: [
      { text: 'Início', link: '/pt/solvermotd/' },
    ]
  },
  {
    text: 'Guia',
    items: [
      { text: 'Primeiros Passos', link: '/pt/solvermotd/guide/getting-started' },
      { text: 'Banners de Imagem', link: '/pt/solvermotd/features/banner' },
      { text: 'Comandos', link: '/pt/solvermotd/commands' },
    ]
  }
]

const enPhosSidebar = [
  {
    text: 'Phosphophyllite',
    items: [
      { text: 'Home', link: '/en/phos/' },
    ]
  },
  {
    text: 'Features',
    items: [
      { text: 'Items & Blocks', link: '/en/phos/features/items' },
      { text: 'Mechanics', link: '/en/phos/features/mechanics' },
      { text: 'Enchantments', link: '/en/phos/features/enchantments' },
      { text: 'Advancements', link: '/en/phos/features/advancements' },
      { text: 'Emissive Textures', link: '/en/phos/features/emissive-textures' },
    ]
  }
]

const esPhosSidebar = [
  {
    text: 'Phosphophyllite',
    items: [
      { text: 'Inicio', link: '/es/phos/' },
    ]
  },
  {
    text: 'Características',
    items: [
      { text: 'Ítems y Bloques', link: '/es/phos/features/items' },
      { text: 'Mecánicas', link: '/es/phos/features/mechanics' },
      { text: 'Encantamientos', link: '/es/phos/features/enchantments' },
      { text: 'Logros', link: '/es/phos/features/advancements' },
      { text: 'Texturas Emisivas', link: '/es/phos/features/emissive-textures' },
    ]
  }
]

const itPhosSidebar = [
  {
    text: 'Phosphophyllite',
    items: [
      { text: 'Home', link: '/it/phos/' },
    ]
  },
  {
    text: 'Funzionalità',
    items: [
      { text: 'Oggetti e Blocchi', link: '/it/phos/features/items' },
      { text: 'Meccaniche', link: '/it/phos/features/mechanics' },
      { text: 'Incantesimi', link: '/it/phos/features/enchantments' },
      { text: 'Progressi', link: '/it/phos/features/advancements' },
      { text: 'Texture Emissive', link: '/it/phos/features/emissive-textures' },
    ]
  }
]

const ptPhosSidebar = [
  {
    text: 'Phosphophyllite',
    items: [
      { text: 'Início', link: '/pt/phos/' },
    ]
  },
  {
    text: 'Funcionalidades',
    items: [
      { text: 'Itens e Blocos', link: '/pt/phos/features/items' },
      { text: 'Mecânicas', link: '/pt/phos/features/mechanics' },
      { text: 'Encantamentos', link: '/pt/phos/features/enchantments' },
      { text: 'Conquistas', link: '/pt/phos/features/advancements' },
      { text: 'Texturas Emissivas', link: '/pt/phos/features/emissive-textures' },
    ]
  }
]

const enFyrxAISidebar = [
  {
    text: 'FyrxAI',
    items: [
      { text: 'Home', link: '/en/fyrxai/' },
    ]
  },
  {
    text: 'Guide',
    items: [
      { text: 'Configuration', link: '/en/fyrxai/configuration' },
      { text: 'AI Providers', link: '/en/fyrxai/providers' },
      { text: 'Topic Detection', link: '/en/fyrxai/topic-detection' },
    ]
  },
  { text: 'Changelog', link: '/en/fyrxai/changelog' },
]

const esFyrxAISidebar = [
  {
    text: 'FyrxAI',
    items: [
      { text: 'Inicio', link: '/es/fyrxai/' },
    ]
  },
  {
    text: 'Guía',
    items: [
      { text: 'Configuración', link: '/es/fyrxai/configuration' },
      { text: 'Proveedores de IA', link: '/es/fyrxai/providers' },
      { text: 'Detección de Temas', link: '/es/fyrxai/topic-detection' },
    ]
  },
  { text: 'Changelog', link: '/es/fyrxai/changelog' },
]

const itFyrxAISidebar = [
  {
    text: 'FyrxAI',
    items: [
      { text: 'Home', link: '/it/fyrxai/' },
    ]
  },
  {
    text: 'Guida',
    items: [
      { text: 'Configurazione', link: '/it/fyrxai/configuration' },
      { text: 'Provider IA', link: '/it/fyrxai/providers' },
      { text: 'Rilevamento Argomenti', link: '/it/fyrxai/topic-detection' },
    ]
  },
  { text: 'Changelog', link: '/it/fyrxai/changelog' },
]

const ptFyrxAISidebar = [
  {
    text: 'FyrxAI',
    items: [
      { text: 'Início', link: '/pt/fyrxai/' },
    ]
  },
  {
    text: 'Guia',
    items: [
      { text: 'Configuração', link: '/pt/fyrxai/configuration' },
      { text: 'Provedores de IA', link: '/pt/fyrxai/providers' },
      { text: 'Detecção de Tópicos', link: '/pt/fyrxai/topic-detection' },
    ]
  },
  { text: 'Changelog', link: '/pt/fyrxai/changelog' },
]

export default defineConfig({
  title: 'FyrxLab Documentation',
  description: 'Official documentation for FyrxLab products',
  cleanUrls: true,
  markdown: {
    // Code blocks are always rendered on the dark terminal-window background
    // (see custom.css --vp-code-block-bg) regardless of the site's light/dark
    // toggle. Shiki's stock 'github-light' theme assumes a white background,
    // so on our dark one its string color was 1.38:1 contrast — barely
    // visible. fyrx-code-theme.json is github-dark with brand colors patched
    // onto comment/tag/string/constant, used for both slots so the syntax
    // colors never depend on the site theme, only on the (always-dark) code
    // background.
    theme: { light: fyrxCodeTheme, dark: fyrxCodeTheme }
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'FyrxLab Documentation' }],
    ['meta', { name: 'og:description', content: 'Official documentation for FyrxLab products' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Dokdo&family=Istok+Web:wght@400;700&display=swap' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [
          {
            text: 'Productos',
            items: [
              {
                text: 'Plugins',
                items: [
                  { text: 'Absolute Solver', link: '/es/solver/' },
                  { text: 'SolverMOTD', link: '/es/solvermotd/' }
                ]
              },
              {
                text: 'Mods',
                items: [
                  { text: 'Phosphophyllite', link: '/es/phos/' },
                  { text: 'Noteblock', link: '/es/noteblock/' },
                  { text: 'LazyMod', link: '/es/lazymod/' },
                  { text: 'Absolute Furnace', link: '/es/furnace/' }
                ]
              }
            ]
          },
          { text: 'Developer Tools', link: '/es/fyrxai/' },
          { text: 'Modrinth', link: 'https://modrinth.com/user/jeamcube' }
        ],
        sidebar: {
          '/es/solver/': esAbsoluteSolverSidebar,
          '/es/furnace/': esFurnaceSidebar,
          '/es/solvermotd/': esSolverMOTDSidebar,
          '/es/phos/': esPhosSidebar,
          '/es/fyrxai/': esFyrxAISidebar
        },
        footer: {
          message: 'Solver y Noteblock: Todos los derechos reservados · Otros productos: Licencia MIT.',
          copyright: 'Copyright © 2026 FyrxLab'
        }
      }
    },
    it: {
      label: 'Italiano',
      lang: 'it',
      link: '/it/',
      themeConfig: {
        nav: [
          {
            text: 'Prodotti',
            items: [
              {
                text: 'Plugin',
                items: [
                  { text: 'Absolute Solver', link: '/it/solver/' },
                  { text: 'SolverMOTD', link: '/it/solvermotd/' }
                ]
              },
              {
                text: 'Mod',
                items: [
                  { text: 'Phosphophyllite', link: '/it/phos/' },
                  { text: 'Noteblock', link: '/it/noteblock/' },
                  { text: 'LazyMod', link: '/it/lazymod/' },
                  { text: 'Absolute Furnace', link: '/it/furnace/' }
                ]
              }
            ]
          },
          { text: 'Developer Tools', link: '/it/fyrxai/' },
          { text: 'Modrinth', link: 'https://modrinth.com/user/jeamcube' }
        ],
        sidebar: {
          '/it/solver/': itAbsoluteSolverSidebar,
          '/it/furnace/': itFurnaceSidebar,
          '/it/solvermotd/': itSolverMOTDSidebar,
          '/it/phos/': itPhosSidebar,
          '/it/fyrxai/': itFyrxAISidebar
        },
        footer: {
          message: 'Solver e Noteblock: Tutti i diritti riservati · Altri prodotti: Licenza MIT.',
          copyright: 'Copyright © 2026 FyrxLab'
        }
      }
    },
    pt: {
      label: 'Português',
      lang: 'pt',
      link: '/pt/',
      themeConfig: {
        nav: [
          {
            text: 'Produtos',
            items: [
              {
                text: 'Plugins',
                items: [
                  { text: 'Absolute Solver', link: '/pt/solver/' },
                  { text: 'SolverMOTD', link: '/pt/solvermotd/' }
                ]
              },
              {
                text: 'Mods',
                items: [
                  { text: 'Phosphophyllite', link: '/pt/phos/' },
                  { text: 'Noteblock', link: '/pt/noteblock/' },
                  { text: 'LazyMod', link: '/pt/lazymod/' },
                  { text: 'Absolute Furnace', link: '/pt/furnace/' }
                ]
              }
            ]
          },
          { text: 'Developer Tools', link: '/pt/fyrxai/' },
          { text: 'Modrinth', link: 'https://modrinth.com/user/jeamcube' }
        ],
        sidebar: {
          '/pt/solver/': ptAbsoluteSolverSidebar,
          '/pt/furnace/': ptFurnaceSidebar,
          '/pt/solvermotd/': ptSolverMOTDSidebar,
          '/pt/phos/': ptPhosSidebar,
          '/pt/fyrxai/': ptFyrxAISidebar
        },
        footer: {
          message: 'Solver e Noteblock: Todos os direitos reservados · Outros produtos: Licença MIT.',
          copyright: 'Copyright © 2026 FyrxLab'
        }
      }
    }
  },

  themeConfig: {
    logo: { light: '/fyrx-logo-light.svg', dark: '/fyrx-logo-dark.svg' },
    siteTitle: false,

    nav: [
      {
        text: 'Products',
        items: [
          {
            text: 'Plugins',
            items: [
              { text: 'Absolute Solver', link: '/en/solver/' },
              { text: 'SolverMOTD', link: '/en/solvermotd/' }
            ]
          },
          {
            text: 'Mods',
            items: [
              { text: 'Phosphophyllite', link: '/en/phos/' },
              { text: 'Noteblock', link: '/en/noteblock/' },
              { text: 'LazyMod', link: '/en/lazymod/' },
              { text: 'Absolute Furnace', link: '/en/furnace/' }
            ]
          }
        ]
      },
      { text: 'Developer Tools', link: '/en/fyrxai/' },
      { text: 'Modrinth', link: 'https://modrinth.com/user/jeamcube' }
    ],

    sidebar: {
      '/en/solver/': enAbsoluteSolverSidebar,
      '/en/furnace/': enFurnaceSidebar,
      '/en/solvermotd/': enSolverMOTDSidebar,
      '/en/phos/': enPhosSidebar,
      '/en/fyrxai/': enFyrxAISidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FyrxLab' },
      { icon: 'discord', link: 'https://discord.gg/EdcYuBAdFB' },
    ],

    footer: {
      message: 'Solver and Noteblock: All Rights Reserved · Other products: MIT License.',
      copyright: 'Copyright © 2026 FyrxLab'
    },

    search: {
      provider: 'local'
    }
  }
})
