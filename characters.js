// Karaktärs-SVGs — stiliserade, igenkännbara

const GROGU_SVG = `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  <!-- Kropp/mantel -->
  <ellipse cx="60" cy="115" rx="34" ry="22" fill="#2a2a1a"/>
  <rect x="26" y="95" width="68" height="25" rx="8" fill="#3a3a22"/>
  <!-- Huvud -->
  <ellipse cx="60" cy="72" rx="46" ry="42" fill="#7a9e6e"/>
  <!-- Öron -->
  <ellipse cx="14" cy="68" rx="13" ry="22" fill="#7a9e6e"/>
  <ellipse cx="106" cy="68" rx="13" ry="22" fill="#7a9e6e"/>
  <ellipse cx="14" cy="68" rx="8" ry="15" fill="#c8847a" opacity="0.6"/>
  <ellipse cx="106" cy="68" rx="8" ry="15" fill="#c8847a" opacity="0.6"/>
  <!-- Ansikte -->
  <ellipse cx="60" cy="78" rx="34" ry="30" fill="#8ab07c"/>
  <!-- Ögon -->
  <ellipse cx="46" cy="68" rx="11" ry="12" fill="#1a1a0a"/>
  <ellipse cx="74" cy="68" rx="11" ry="12" fill="#1a1a0a"/>
  <circle cx="46" cy="68" r="7" fill="#2a3a1a"/>
  <circle cx="74" cy="68" r="7" fill="#2a3a1a"/>
  <circle cx="46" cy="67" r="4" fill="#0a1a05"/>
  <circle cx="74" cy="67" r="4" fill="#0a1a05"/>
  <circle cx="48" cy="65" r="2" fill="white" opacity="0.9"/>
  <circle cx="76" cy="65" r="2" fill="white" opacity="0.9"/>
  <!-- Näsa -->
  <ellipse cx="60" cy="80" rx="5" ry="3" fill="#5a7a52"/>
  <circle cx="58" cy="79" r="2" fill="#3a5a32" opacity="0.7"/>
  <circle cx="62" cy="79" r="2" fill="#3a5a32" opacity="0.7"/>
  <!-- Mun — glad -->
  <path d="M50 90 Q60 97 70 90" stroke="#3a5a32" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Händer -->
  <ellipse cx="30" cy="108" rx="9" ry="7" fill="#7a9e6e"/>
  <ellipse cx="90" cy="108" rx="9" ry="7" fill="#7a9e6e"/>
  <!-- Kraft-glöd effect -->
  <circle cx="60" cy="72" r="50" fill="none" stroke="#4aff6a" stroke-width="1.5" opacity="0.15"/>
</svg>`;

const ALLEN_SVG = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
  <!-- Kropp - muskulös alien -->
  <ellipse cx="60" cy="118" rx="32" ry="28" fill="#1a3a5a"/>
  <rect x="28" y="95" width="64" height="30" rx="10" fill="#1e4472"/>
  <!-- Nacke -->
  <rect x="48" y="85" width="24" height="18" rx="5" fill="#2a5a8a"/>
  <!-- Huvud - stort runt -->
  <ellipse cx="60" cy="65" rx="42" ry="44" fill="#2a6aaa"/>
  <!-- Ansiktsdrag -->
  <ellipse cx="60" cy="70" rx="34" ry="36" fill="#3278be"/>
  <!-- Stora mandelformade ögon -->
  <ellipse cx="44" cy="60" rx="14" ry="10" fill="#fff8e0"/>
  <ellipse cx="76" cy="60" rx="14" ry="10" fill="#fff8e0"/>
  <ellipse cx="44" cy="60" rx="9" ry="7" fill="#ff6b00"/>
  <ellipse cx="76" cy="60" rx="9" ry="7" fill="#ff6b00"/>
  <circle cx="44" cy="60" r="5" fill="#1a0a00"/>
  <circle cx="76" cy="60" r="5" fill="#1a0a00"/>
  <circle cx="46" cy="58" r="2" fill="white" opacity="0.9"/>
  <circle cx="78" cy="58" r="2" fill="white" opacity="0.9"/>
  <!-- Näsa — liten -->
  <ellipse cx="60" cy="74" rx="4" ry="3" fill="#1a5a9a"/>
  <!-- Mun — bred leende -->
  <path d="M44 84 Q60 94 76 84" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M44 84 Q60 94 76 84" stroke="#1a3a5a" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.3"/>
  <!-- Armar muskulösa -->
  <ellipse cx="22" cy="108" rx="12" ry="20" fill="#1e4472"/>
  <ellipse cx="98" cy="108" rx="12" ry="20" fill="#1e4472"/>
  <!-- Händer stora -->
  <ellipse cx="22" cy="128" rx="11" ry="9" fill="#2a6aaa"/>
  <ellipse cx="98" cy="128" rx="11" ry="9" fill="#2a6aaa"/>
  <!-- Detaljer på kläder -->
  <path d="M40 98 L40 118 M80 98 L80 118" stroke="#2a5aaa" stroke-width="2" opacity="0.5"/>
  <!-- Glöd/energi runt kroppen -->
  <ellipse cx="60" cy="65" rx="46" ry="48" fill="none" stroke="#ff9030" stroke-width="2" opacity="0.2"/>
</svg>`;

const BUTCHER_SVG = `<svg viewBox="0 0 120 155" xmlns="http://www.w3.org/2000/svg">
  <!-- Ben/byxor -->
  <rect x="32" y="118" width="24" height="34" rx="4" fill="#1a1a2a"/>
  <rect x="64" y="118" width="24" height="34" rx="4" fill="#1a1a2a"/>
  <!-- Kropp — läderjacka -->
  <rect x="22" y="78" width="76" height="50" rx="8" fill="#0a0a0a"/>
  <!-- Jacka detaljer -->
  <path d="M60 78 L60 128" stroke="#1a1a1a" stroke-width="3"/>
  <rect x="28" y="85" width="14" height="18" rx="2" fill="#1a1a1a"/>
  <rect x="78" y="85" width="14" height="18" rx="2" fill="#1a1a1a"/>
  <!-- Axlar breda -->
  <ellipse cx="22" cy="82" rx="10" ry="8" fill="#0a0a0a"/>
  <ellipse cx="98" cy="82" rx="10" ry="8" fill="#0a0a0a"/>
  <!-- Nacke -->
  <rect x="50" y="66" width="20" height="18" rx="4" fill="#c8956a"/>
  <!-- Huvud -->
  <rect x="28" y="28" width="64" height="52" rx="14" fill="#c8956a"/>
  <!-- Hår — kort mörkt -->
  <rect x="28" y="28" width="64" height="18" rx="14" fill="#1a0a05"/>
  <rect x="28" y="38" width="64" height="8" fill="#1a0a05"/>
  <!-- Skägg -->
  <rect x="34" y="58" width="52" height="24" rx="6" fill="#2a1a0a"/>
  <rect x="34" y="70" width="52" height="14" rx="4" fill="#1a0a05"/>
  <!-- Ögon — hård blick -->
  <ellipse cx="46" cy="50" rx="9" ry="7" fill="#fff"/>
  <ellipse cx="74" cy="50" rx="9" ry="7" fill="#fff"/>
  <ellipse cx="46" cy="51" rx="6" ry="6" fill="#1a3a1a"/>
  <ellipse cx="74" cy="51" rx="6" ry="6" fill="#1a3a1a"/>
  <circle cx="46" cy="51" r="3.5" fill="#0a0a0a"/>
  <circle cx="74" cy="51" r="3.5" fill="#0a0a0a"/>
  <circle cx="47.5" cy="49.5" r="1.5" fill="white" opacity="0.8"/>
  <circle cx="75.5" cy="49.5" r="1.5" fill="white" opacity="0.8"/>
  <!-- Ögonbryn sammanbiten -->
  <path d="M38 43 L54 46" stroke="#1a0a05" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M66 46 L82 43" stroke="#1a0a05" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Mun — rakt -->
  <path d="M46 72 L74 72" stroke="#8a5a3a" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Armar -->
  <rect x="10" y="78" width="18" height="44" rx="8" fill="#0a0a0a"/>
  <rect x="92" y="78" width="18" height="44" rx="8" fill="#0a0a0a"/>
  <!-- Händer -->
  <ellipse cx="19" cy="128" rx="10" ry="9" fill="#c8956a"/>
  <ellipse cx="101" cy="128" rx="10" ry="9" fill="#c8956a"/>
  <!-- Knogjärn -->
  <rect x="12" y="124" width="14" height="6" rx="2" fill="#8a8a7a"/>
</svg>`;

module.exports = { GROGU_SVG, ALLEN_SVG, BUTCHER_SVG };
