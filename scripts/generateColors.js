import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from '../.vitepress/theme/productPalette.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_CSS = path.join(ROOT_DIR, '.vitepress', 'theme', 'dynamic-colors.css');

// Curated brand colors (see theme/productPalette.js) - deliberately chosen per
// product, not auto-extracted from a logo image.
// percent > 0 blends the channel toward white (lighten); percent < 0 scales
// it toward black (darken) - blending toward white with a negative percent
// underflows for low channel values, so these need two different formulas.
function shade(hex, percent) {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(h => parseInt(h, 16));

  const blended = channels.map(c => {
    const value = percent >= 0 ? c + (255 - c) * percent : c * (1 + percent);
    return Math.min(255, Math.max(0, Math.round(value)));
  });

  return `#${blended.map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

function run() {
  const cssLines = [];

  for (const [key, product] of Object.entries(PRODUCTS)) {
    const brand1 = product.color;
    const brand2 = shade(brand1, 0.2);
    const brand3 = shade(brand1, -0.2);

    cssLines.push(`html.theme-${key} {`);
    cssLines.push(`  --vp-c-brand-1: ${brand1};`);
    cssLines.push(`  --vp-c-brand-2: ${brand2};`);
    cssLines.push(`  --vp-c-brand-3: ${brand3};`);
    if (product.font) {
      cssLines.push(`  --vp-heading-font: '${product.font}', cursive;`);
    }
    cssLines.push(`}`);
  }

  fs.writeFileSync(OUT_CSS, cssLines.join('\n') + '\n', 'utf8');
  console.log(`Generated dynamic-colors.css with curated palettes for ${Object.keys(PRODUCTS).length} products.`);
}

run();
