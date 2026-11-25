// Генератор шапки профиля: лунная таверна.
// node tools/banner.mjs  ->  assets/banner.svg
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "..", "assets", "banner.svg");

const W = 1200;
const H = 400;

// детерминированный "рандом", чтобы звёзды не прыгали между сборками
let seed = 20261125;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const between = (a, b) => a + rnd() * (b - a);

const stars = [];
for (let i = 0; i < 150; i++) {
  const x = between(40, W - 40).toFixed(1);
  const y = between(30, H - 30).toFixed(1);
  const r = between(0.5, 1.7).toFixed(2);
  const o = between(0.12, 0.62).toFixed(2);
  stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#e6e6fa" opacity="${o}"/>`);
}

const sparkles = [
  [188, 92, 9],
  [905, 300, 7],
  [795, 78, 6],
  [432, 318, 5],
  [1112, 250, 5],
]
  .map(
    ([x, y, s]) =>
      `<path d="M${x} ${y - s} Q${x + s * 0.16} ${y - s * 0.16} ${x + s} ${y} Q${x + s * 0.16} ${y + s * 0.16} ${x} ${y + s} Q${x - s * 0.16} ${y + s * 0.16} ${x - s} ${y} Q${x - s * 0.16} ${y - s * 0.16} ${x} ${y - s}Z" fill="#e8c396" opacity="0.55"/>`
  )
  .join("\n  ");

// филигранный угол: двойная линия + завиток
const corner = (tx, ty, sx, sy) => `
  <g transform="translate(${tx} ${ty}) scale(${sx} ${sy})" fill="none" stroke="#e8c396" stroke-linecap="round">
    <path d="M0 46 L0 12 Q0 0 12 0 L46 0" stroke-opacity="0.55" stroke-width="1.2"/>
    <path d="M9 44 L9 20 Q9 9 20 9 L44 9" stroke-opacity="0.2" stroke-width="1"/>
    <path d="M14 22 q7 -8 15 -2 q6 5 0 10 q-6 4 -8 -2" stroke-opacity="0.5" stroke-width="1.1"/>
    <circle cx="40" cy="40" r="1.6" fill="#e8c396" stroke="none" opacity="0.6"/>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Selena — Moonlit Tavern">
  <defs>
    <radialGradient id="sky" cx="0.78" cy="0.16" r="1.15">
      <stop offset="0" stop-color="#2a1f47"/>
      <stop offset="0.38" stop-color="#171029"/>
      <stop offset="0.75" stop-color="#0e0a16"/>
      <stop offset="1" stop-color="#09060f"/>
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#d4d4ff" stop-opacity="0.55"/>
      <stop offset="0.30" stop-color="#b8b8ff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#b8b8ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d4d4ff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#d4d4ff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#f4f3ff"/>
      <stop offset="0.62" stop-color="#d4d4ff"/>
      <stop offset="1" stop-color="#e8c396"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e8c396" stop-opacity="0.85"/>
      <stop offset="0.7" stop-color="#b8b8ff" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#b8b8ff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.78">
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.62"/>
    </radialGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="26"/>
    </filter>
    <mask id="crescent">
      <rect width="${W}" height="${H}" fill="#000"/>
      <circle cx="1000" cy="120" r="58" fill="#fff"/>
      <circle cx="1024" cy="101" r="52" fill="#000"/>
    </mask>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>

  <!-- звёздное небо -->
  <g>
  ${stars.join("\n  ")}
  </g>
  ${sparkles}

  <!-- луна и её свет -->
  <circle cx="1000" cy="120" r="190" fill="url(#halo)"/>
  <g filter="url(#soft)" opacity="0.5">
    <polygon points="968,150 1032,150 1220,400 640,400" fill="url(#beam)"/>
  </g>
  <circle cx="1000" cy="120" r="58" fill="#f2f1ff" mask="url(#crescent)" opacity="0.96"/>

  <!-- рамка -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="20" fill="none" stroke="#e8c396" stroke-opacity="0.30" stroke-width="1.1"/>
  <rect x="33" y="33" width="${W - 66}" height="${H - 66}" rx="14" fill="none" stroke="#b8b8ff" stroke-opacity="0.10" stroke-width="1"/>
  ${corner(34, 34, 1, 1)}
  ${corner(W - 34, 34, -1, 1)}
  ${corner(34, H - 34, 1, -1)}
  ${corner(W - 34, H - 34, -1, -1)}

  <!-- текст -->
  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="92" y="158" font-size="15" letter-spacing="7.5" fill="#8f88c8" opacity="0.9">SILLYTAVERN · REAPER · LOREBOOKS</text>
    <text x="86" y="248" font-size="96" letter-spacing="11" fill="url(#title)">Selena</text>
    <rect x="92" y="272" width="330" height="1" fill="url(#rule)"/>
    <text x="92" y="306" font-size="19" letter-spacing="9" fill="#e8c396" opacity="0.92">MOONLIT TAVERN</text>
    <text x="92" y="340" font-size="14.5" letter-spacing="1.6" fill="#a9a2d8" opacity="0.85">Тёмные темы, сцены и лорбуки для тех, кто живёт по ночам</text>
  </g>

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>
`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg, "utf8");
console.log(`ok -> ${out} (${(svg.length / 1024).toFixed(1)} KB)`);
