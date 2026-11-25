// Накладывает SMIL-анимацию на assets/banner.svg, экспортированный из FigCraft.
// Запуск: node tools/animate-banner.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "..", "assets", "banner.svg");

let svg = readFileSync(file, "utf8");

if (svg.includes('id="moonglow"')) {
  console.log("уже анимирован — пропускаю");
  process.exit(0);
}

// ── 1. золотой перелив по имени
// Градиент заголовка — единственный линейный с x2, не равным 0.
const titleGrad = /<linearGradient id="(paint\d+)" x1="0" y1="0" x2="(\d+)" y2="0" gradientUnits="userSpaceOnUse">[\s\S]*?<\/linearGradient>/;
const m = svg.match(titleGrad);
if (!m) throw new Error("не нашёл градиент заголовка");
const [whole, gradId, x2] = m;
const shimmer = `<linearGradient id="${gradId}" x1="0" y1="0" x2="${x2}" y2="0" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#C9A063"/><stop offset="0.34" stop-color="#E8C396"/><stop offset="0.5" stop-color="#FFF7E6"/><stop offset="0.66" stop-color="#E8C396"/><stop offset="1" stop-color="#C9A063"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-${x2} 0; ${x2} 0" dur="7s" repeatCount="indefinite"/>
</linearGradient>`;
svg = svg.replace(whole, shimmer);

// ── 2. дыхание луны
const moon = svg.match(/<path transform="matrix\(1 0 0 1 (\d+) (\d+)\)" d="M55\.836[^"]*"[^/]*\/>/);
let glow = "";
if (moon) {
  const cx = Number(moon[1]) + 28, cy = Number(moon[2]) + 28;
  // сама луна дышит чуть-чуть
  svg = svg.replace(moon[0], moon[0].replace(/\/>$/, `><animate attributeName="opacity" values="0.88;1;0.88" dur="7s" repeatCount="indefinite"/></path>`));
  glow = `<defs><radialGradient id="moonglow"><stop offset="0" stop-color="#E6E2FF" stop-opacity="0.34"/><stop offset="0.45" stop-color="#B8B8FF" stop-opacity="0.10"/><stop offset="1" stop-color="#B8B8FF" stop-opacity="0"/></radialGradient></defs>
<circle cx="${cx}" cy="${cy}" r="58" fill="url(#moonglow)"><animate attributeName="r" values="54;64;54" dur="7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.45;0.85;0.45" dur="7s" repeatCount="indefinite"/></circle>`;
}

// ── 3. мерцающие звёзды в верхнем поле
let seed = 991177;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const stars = [];
for (let i = 0; i < 22; i++) {
  const x = (60 + rnd() * 760).toFixed(1);
  const y = (18 + rnd() * 120).toFixed(1);
  const r = (0.5 + rnd() * 0.8).toFixed(2);
  const dur = (3.2 + rnd() * 4).toFixed(1);
  const begin = (rnd() * 5).toFixed(1);
  const peak = (0.35 + rnd() * 0.45).toFixed(2);
  stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#E6E6FA" opacity="0.12"><animate attributeName="opacity" values="0.08;${peak};0.08" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`);
}

// вставляем после фона, чтобы свет и звёзды легли под остальные слои
const bg = svg.indexOf('fill="url(#paint1)"');
if (bg < 0) throw new Error("не нашёл фон");
const insertAt = svg.indexOf("/>", bg) + 2;
svg = svg.slice(0, insertAt) + "\n" + glow + "\n" + stars.join("\n") + "\n" + svg.slice(insertAt);

writeFileSync(file, svg, "utf8");
console.log(`анимация добавлена -> ${file} (${(svg.length / 1024).toFixed(1)} KB)`);
