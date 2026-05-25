<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#169ee7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Soumaya">
<link rel="manifest" href="manifest.json">

<!-- FONTS -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Bungee+Shade&family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=Caveat:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<!-- LEAFLET -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">

<title>Soumaya</title>
<style>
/* ── DESIGN TOKENS ── */
:root {
  --paper:        #F5EFE2;
  --paper-soft:   #EAE2D0;
  --paper-dark:   #D9CEB8;
  --ink:          #0A0A0A;
  --ink-soft:     #1a1a1a;
  --ink-muted:    #666;
  --hero-blue:    #169ee7;
  --hero-blue-deep: #0072D6;
  --hero-blue-dark: #003E7A;
  --pulse-red:    #E63946;
  --pulse-red-deep: #B00020;
  --power-yellow: #FFE600;
  --power-yellow-deep: #F5C400;
  --in-range:     #2DD881;
  --in-range-dark: #1a8a4a;
  --high:         #FF8A00;
  --low:          #E63946;
  --white:        #FFFFFF;

  --font-burst:   'Bungee', 'Anton', Impact, sans-serif;
  --font-shade:   'Bungee Shade', 'Bungee', sans-serif;
  --font-display: 'Anton', Impact, sans-serif;
  --font-ui:      'Space Grotesk', system-ui, sans-serif;
  --font-script:  'Caveat', cursive;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;

  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Komikbok-linjer */
  --border: 2px solid var(--ink);
  --border-thick: 3px solid var(--ink);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html, body { height: 100%; overscroll-behavior: none; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-ui);
  min-height: 100vh;
  padding-bottom: calc(68px + var(--safe-bottom));
  /* Halvtons-prickmönster */
  background-image: radial-gradient(circle, rgba(10,10,10,0.06) 1px, transparent 1px);
  background-size: 8px 8px;
}

/* ── HEADER ── */
.app-header {
  position: sticky; top: 0; z-index: 100;
  background: var(--hero-blue);
  border-bottom: var(--border-thick);
  padding: calc(var(--safe-top) + 10px) 16px 10px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 3px 0 var(--hero-blue-dark);
}
.app-title {
  font-family: var(--font-burst);
  font-size: 26px;
  letter-spacing: 2px;
  color: var(--power-yellow);
  text-shadow: 2px 2px 0 var(--ink);
  line-height: 1;
}
.app-tagline { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.8); letter-spacing: 1px; text-transform: uppercase; }
.header-right { text-align: right; }
.header-time { font-family: var(--font-mono); font-size: 14px; font-weight: 700; color: white; }
.header-date { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 0.5px; }

/* ── BOTTOM NAV ── */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  background: var(--ink);
  border-top: var(--border-thick);
  display: flex;
  padding-bottom: var(--safe-bottom);
}
.nav-btn {
  flex: 1; background: none; border: none;
  color: rgba(255,255,255,0.4);
  padding: 10px 4px 8px;
  cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  font-family: var(--font-ui);
  transition: color 0.15s;
  border-right: 1px solid #222;
}
.nav-btn:last-child { border-right: none; }
.nav-btn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.nav-btn span { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
.nav-btn.active { color: var(--power-yellow); }

/* ── PAGES ── */
.page { display: none; padding: 14px; animation: fadeUp 0.2s ease; }
.page.active { display: block; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* ── CARDS (komikbok-stil) ── */
.card {
  background: var(--white);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 4px 4px 0 var(--ink);
  position: relative;
  overflow: hidden;
}
.card.blue   { background: #EBF6FD; border-color: var(--hero-blue); box-shadow: 4px 4px 0 var(--hero-blue-dark); }
.card.yellow { background: #FFFBE0; border-color: var(--power-yellow-deep); box-shadow: 4px 4px 0 var(--ink); }
.card.green  { background: #E8FBF0; border-color: var(--in-range-dark); box-shadow: 4px 4px 0 var(--in-range-dark); }
.card.red    { background: #FDECEA; border-color: var(--pulse-red-deep); box-shadow: 4px 4px 0 var(--pulse-red-deep); }
.card.paper  { background: var(--paper-soft); }

.card-label {
  font-family: var(--font-burst);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 8px;
  display: flex; align-items: center; gap: 6px;
}
.card-label::after { content: ''; flex: 1; height: 1.5px; background: var(--paper-dark); }

/* ── BURST-RUBRIKER ── */
.burst {
  font-family: var(--font-burst);
  letter-spacing: 1px;
  line-height: 1;
}
.burst-xl { font-size: 48px; }
.burst-lg { font-size: 32px; }
.burst-md { font-size: 22px; }
.burst-sm { font-size: 16px; }

.script { font-family: var(--font-script); }
.mono   { font-family: var(--font-mono); }

/* ── PILL-BADGE ── */
.pill {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1.5px solid var(--ink);
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  background: var(--white);
}
.pill.blue   { background: var(--hero-blue);    color: white; border-color: var(--hero-blue-dark); }
.pill.yellow { background: var(--power-yellow); color: var(--ink); border-color: var(--ink); }
.pill.green  { background: var(--in-range);     color: var(--ink); border-color: var(--in-range-dark); }
.pill.red    { background: var(--pulse-red);    color: white; border-color: var(--pulse-red-deep); }
.pill.orange { background: var(--high);         color: white; border-color: var(--ink); }

/* ── GLUCOSE BIG NUMBER ── */
.glucose-hero {
  font-family: var(--font-mono);
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -2px;
  color: var(--in-range-dark);
  transition: color 0.5s;
}
.glucose-hero.warn   { color: var(--high); }
.glucose-hero.danger { color: var(--pulse-red-deep); }
.glucose-trend { font-size: 32px; margin-left: 4px; }

/* ── RANGE BAR ── */
.range-bar {
  height: 12px;
  border-radius: 6px;
  border: var(--border);
  background: linear-gradient(90deg,
    var(--pulse-red) 0%, var(--pulse-red) 22%,
    var(--in-range) 22%, var(--in-range) 72%,
    var(--high) 72%, var(--high) 87%,
    var(--pulse-red) 87%);
  position: relative; overflow: visible; margin: 8px 0 4px;
}
.range-needle {
  position: absolute; top: 50%;
  transform: translate(-50%,-50%);
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  border: 2.5px solid var(--ink);
  box-shadow: 2px 2px 0 var(--ink);
  transition: left 0.8s cubic-bezier(.34,1.56,.64,1);
}
.range-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: var(--ink-muted); }

/* ── STREAK DAYS ── */
.streak-row { display: flex; gap: 5px; margin-bottom: 10px; }
.streak-day {
  flex: 1; aspect-ratio: 1;
  border: var(--border);
  border-radius: var(--radius-sm);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700;
  text-transform: uppercase;
  background: var(--paper);
  color: var(--ink-muted);
}
.streak-day.done   { background: var(--power-yellow); border-color: var(--ink); color: var(--ink); }
.streak-day.today  { border-color: var(--hero-blue); color: var(--hero-blue); border-width: 2.5px; }
.streak-day .day-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-muted); margin-top: 3px; }
.streak-day.done .day-dot { background: var(--ink); }

/* ── PROGRESS RINGS ── */
.rings-row { display: flex; gap: 14px; justify-content: center; }
.ring-wrap { text-align: center; }
.ring-svg { width: 72px; height: 72px; transform: rotate(-90deg); }
.ring-track { fill: none; stroke: var(--paper-dark); stroke-width: 7; }
.ring-fill  { fill: none; stroke-width: 7; stroke-linecap: round; transition: stroke-dashoffset 0.8s cubic-bezier(.34,1.56,.64,1); }
.ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-val { font-family: var(--font-burst); font-size: 16px; line-height: 1; }
.ring-unit { font-size: 8px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); }
.ring-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; color: var(--ink-muted); }

/* ── COMPANION ── */
.companion-row { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 12px; }
.companion-img { flex-shrink: 0; filter: drop-shadow(3px 3px 0 rgba(0,0,0,0.2)); }
.companion-img img { display: block; }
.speech-bubble {
  background: var(--white);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  border-bottom-left-radius: 4px;
  padding: 10px 14px;
  font-size: 14px; font-weight: 600; line-height: 1.5;
  flex: 1;
  box-shadow: 3px 3px 0 var(--ink);
  position: relative;
}
.speech-bubble::before {
  content: '';
  position: absolute; left: -12px; bottom: 12px;
  border: 6px solid transparent;
  border-right-color: var(--ink);
}
.speech-bubble::after {
  content: '';
  position: absolute; left: -8px; bottom: 13px;
  border: 5px solid transparent;
  border-right-color: var(--white);
}
.companion-name { font-family: var(--font-burst); font-size: 12px; letter-spacing: 1px; margin-bottom: 3px; }

/* ── KNAPPAR ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 20px;
  border: var(--border-thick);
  border-radius: var(--radius-md);
  font-family: var(--font-burst);
  font-size: 18px; letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  width: 100%;
  text-transform: uppercase;
}
.btn:active { transform: translate(2px,2px); box-shadow: none !important; }
.btn-primary { background: var(--power-yellow); color: var(--ink); box-shadow: 4px 4px 0 var(--ink); }
.btn-blue    { background: var(--hero-blue);    color: white;       box-shadow: 4px 4px 0 var(--hero-blue-dark); }
.btn-green   { background: var(--in-range);     color: var(--ink);  box-shadow: 4px 4px 0 var(--in-range-dark); }
.btn-red     { background: var(--pulse-red);    color: white;       box-shadow: 4px 4px 0 var(--pulse-red-deep); }
.btn-ghost   { background: transparent; color: var(--ink); box-shadow: 3px 3px 0 var(--ink); }
.btn-sm { font-size: 14px; padding: 9px 14px; }
.btn-inline { width: auto; }

/* ── INPUTS ── */
.input-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-muted); margin-bottom: 5px; display: block; }
.input-field {
  width: 100%;
  background: var(--paper);
  border: var(--border-thick);
  border-radius: var(--radius-md);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 16px; font-weight: 600;
  padding: 11px 13px;
  outline: none;
  box-shadow: 3px 3px 0 var(--paper-dark);
  transition: box-shadow 0.15s;
}
.input-field:focus { border-color: var(--hero-blue); box-shadow: 3px 3px 0 var(--hero-blue); }
.input-big {
  font-family: var(--font-mono);
  font-size: 40px; font-weight: 700;
  text-align: center; letter-spacing: -1px;
}
.input-group { margin-bottom: 12px; }

/* ── TAGS ── */
.tag-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
.tag {
  padding: 6px 12px;
  border: var(--border);
  border-radius: 20px;
  font-size: 12px; font-weight: 700;
  cursor: pointer; background: var(--paper);
  font-family: var(--font-ui);
  transition: all 0.12s;
}
.tag.selected { background: var(--ink); color: white; border-color: var(--ink); }

/* ── LOG ITEMS ── */
.log-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0;
  border-bottom: 1.5px solid var(--paper-soft);
}
.log-item:last-child { border-bottom: none; }
.log-icon {
  width: 38px; height: 38px; border-radius: var(--radius-sm);
  border: var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
  background: var(--paper);
  box-shadow: 2px 2px 0 var(--ink);
}
.log-main { flex: 1; }
.log-title { font-size: 14px; font-weight: 700; }
.log-meta  { font-size: 11px; color: var(--ink-muted); font-weight: 600; }
.log-val   { font-family: var(--font-mono); font-size: 16px; font-weight: 700; }
.log-val.ok  { color: var(--in-range-dark); }
.log-val.warn{ color: var(--high); }
.log-val.bad { color: var(--pulse-red-deep); }

/* ── FOTO-BOXES ── */
.photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.photo-box {
  aspect-ratio: 1;
  border: var(--border-thick);
  border-radius: var(--radius-md);
  background: var(--paper-soft);
  box-shadow: 3px 3px 0 var(--ink);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  position: relative;
}
.photo-box img { width: 100%; height: 100%; object-fit: cover; }
.photo-box-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--ink-muted); margin-bottom: 6px;
  position: absolute; top: 8px; left: 10px;
}
.photo-box-icon { font-size: 30px; }
.photo-status {
  font-size: 12px; font-weight: 700; text-align: center;
  margin-bottom: 12px; padding: 8px;
  border: 1.5px dashed var(--paper-dark);
  border-radius: var(--radius-sm);
  font-family: var(--font-script); font-size: 16px;
}

/* ── MAP ── */
#walkMap {
  width: 100%; height: 220px;
  border: var(--border-thick); border-radius: var(--radius-md);
  box-shadow: 4px 4px 0 var(--ink);
  overflow: hidden; margin-bottom: 12px;
  background: var(--paper-soft);
  display: flex; align-items: center; justify-content: center;
}
.walk-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
.walk-stat {
  background: var(--white);
  border: var(--border-thick);
  border-radius: var(--radius-md);
  padding: 10px;
  text-align: center;
  box-shadow: 3px 3px 0 var(--ink);
}
.walk-stat-val { font-family: var(--font-burst); font-size: 22px; color: var(--hero-blue); letter-spacing: 1px; }
.walk-stat-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ink-muted); margin-top: 2px; }

/* ── ACHIEVEMENT CARDS ── */
.ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ach-card {
  background: var(--white);
  border: var(--border-thick);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  position: relative; overflow: hidden;
  box-shadow: 3px 3px 0 var(--ink);
  transition: transform 0.1s;
}
.ach-card.unlocked { background: var(--paper-soft); }
.ach-card.locked   { opacity: 0.5; filter: grayscale(0.5); }
.ach-icon  { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
.ach-title { font-family: var(--font-burst); font-size: 13px; letter-spacing: 0.5px; line-height: 1.2; margin-bottom: 3px; }
.ach-desc  { font-size: 10px; color: var(--ink-muted); font-weight: 600; line-height: 1.3; margin-bottom: 6px; }
.ach-xp    { font-family: var(--font-mono); font-size: 12px; font-weight: 700; }
.ach-check { position: absolute; top: 6px; left: 6px; font-size: 14px; }
.ach-tier-badge {
  position: absolute; top: 6px; right: 6px;
  font-size: 8px; font-weight: 900; letter-spacing: 0.5px;
  padding: 2px 5px; border-radius: 3px;
  text-transform: uppercase; border: 1px solid currentColor;
}
.tier-bronze   { color: #b87333; }
.tier-silver   { color: #666; }
.tier-gold     { color: var(--power-yellow-deep); background: var(--ink); }
.tier-platinum { color: #555; }
.tier-invincible { color: var(--hero-blue); background: var(--ink); animation: pulse-badge 2s infinite; }
@keyframes pulse-badge { 0%,100%{ opacity:1; } 50%{ opacity:0.5; } }
.ach-char-dot { width: 6px; height: 6px; border-radius: 50%; position: absolute; bottom: 8px; left: 8px; border: 1px solid var(--ink); }

/* ── XP BAR ── */
.xp-bar-wrap {
  background: var(--paper-soft);
  border: var(--border-thick);
  border-radius: var(--radius-xl);
  padding: 3px;
  box-shadow: 3px 3px 0 var(--ink);
  margin-bottom: 6px;
}
.xp-bar-fill {
  height: 20px; border-radius: 20px;
  background: linear-gradient(90deg, var(--hero-blue), var(--power-yellow));
  transition: width 0.8s cubic-bezier(.34,1.56,.64,1);
  display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;
  min-width: 30px;
}
.xp-bar-text { font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--ink); }

/* ── SECTION HEADER ── */
.section-head {
  font-family: var(--font-burst);
  font-size: 13px; letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-muted);
  display: flex; align-items: center; gap: 8px;
  margin: 16px 0 10px;
}
.section-head::after { content: ''; flex: 1; height: 2px; background: var(--paper-dark); }

/* ── TOAST / ACHIEVEMENT MODAL ── */
.toast {
  position: fixed; top: 80px; left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: var(--ink); color: var(--power-yellow);
  font-family: var(--font-burst); font-size: 15px; letter-spacing: 1px;
  padding: 10px 20px;
  border: var(--border-thick);
  border-radius: var(--radius-md);
  box-shadow: 4px 4px 0 var(--hero-blue);
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  z-index: 500; pointer-events: none; white-space: nowrap;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

#achModal {
  position: fixed; inset: 0; z-index: 400;
  pointer-events: none;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
#achModalInner {
  background: var(--paper);
  border: 3px solid var(--ink);
  border-radius: var(--radius-xl);
  padding: 28px 24px;
  text-align: center;
  max-width: 300px; width: 100%;
  box-shadow: 6px 6px 0 var(--ink);
  transform: scale(0.5) translateY(40px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
  pointer-events: none;
}

/* ── CGM SETUP BOX ── */
.setup-box {
  border: 2px dashed var(--paper-dark);
  border-radius: var(--radius-md);
  padding: 20px;
  text-align: center;
  background: var(--paper-soft);
  margin-bottom: 12px;
}

/* ── SETTINGS ── */
.setting-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 0;
  border-bottom: 1.5px solid var(--paper-soft);
}
.setting-row:last-child { border-bottom: none; }
.setting-label { font-size: 14px; font-weight: 700; }
.setting-sub   { font-size: 11px; color: var(--ink-muted); margin-top: 2px; }
.toggle { position: relative; width: 46px; height: 24px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0;
  background: var(--paper-dark);
  border: var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  left: 2px; top: 1px;
  background: white;
  border: 1.5px solid var(--ink);
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle input:checked + .toggle-slider { background: var(--hero-blue); }
.toggle input:checked + .toggle-slider::before { transform: translateX(22px); }

/* ── MINI CHART ── */
.chart-wrap { height: 90px; }

/* ── GRID ── */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
.stat-mini {
  background: var(--white);
  border: var(--border-thick);
  border-radius: var(--radius-md);
  padding: 12px;
  text-align: center;
  box-shadow: 3px 3px 0 var(--ink);
}
.stat-mini-val   { font-family: var(--font-burst); font-size: 26px; letter-spacing: 1px; line-height: 1; }
.stat-mini-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 3px; }

/* ── MORNING GREETING ── */
.morning-hero {
  background: var(--hero-blue);
  border: var(--border-thick);
  border-radius: var(--radius-xl);
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 5px 5px 0 var(--hero-blue-dark);
  position: relative; overflow: hidden;
}
.morning-hero::before {
  content: '';
  position: absolute; top: -20px; right: -20px;
  width: 100px; height: 100px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
}
.morning-greeting { font-family: var(--font-script); font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
.morning-name     { font-family: var(--font-burst); font-size: 34px; color: var(--power-yellow); letter-spacing: 2px; text-shadow: 2px 2px 0 var(--ink); line-height: 1; }
.morning-sub      { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; margin-top: 6px; }

/* ── FILTER TABS ── */
.filter-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 14px; scrollbar-width: none; }
.filter-tabs::-webkit-scrollbar { display: none; }
.filter-tab {
  padding: 6px 14px;
  border: var(--border);
  border-radius: 20px;
  font-size: 12px; font-weight: 700;
  cursor: pointer; background: var(--paper);
  font-family: var(--font-ui);
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.12s;
}
.filter-tab.active { background: var(--ink); color: white; }

/* ── MINI CHART ── */
.mini-chart { height: 80px; }
.mini-chart canvas { width: 100% !important; height: 80px !important; }
</style>
</head>
<body>

<!-- HEADER -->
<header class="app-header">
  <div>
    <div class="app-title">SOUMAYA</div>
    <div class="app-tagline">Din styrka, varje dag</div>
  </div>
  <div class="header-right">
    <div class="header-time" id="headerTime"></div>
    <div class="header-date" id="headerDate"></div>
  </div>
</header>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<!-- ══════════════════════════════════
     SIDA: HEM
══════════════════════════════════ -->
<div class="page active" id="page-home">

  <!-- Morgonhälsning -->
  <div class="morning-hero">
    <div class="morning-greeting">Hej igen,</div>
    <div class="morning-name">SOUMAYA!</div>
    <div class="morning-sub" id="morningStatus">Laddar dagens status…</div>
  </div>

  <!-- Blodsockerkort -->
  <div class="card blue">
    <div class="card-label">Blodsocker just nu</div>
    <div style="display:flex;align-items:flex-start;gap:12px;">
      <div style="flex:1;">
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px;">
          <div class="glucose-hero" id="glucoseValue">--</div>
          <div style="font-size:14px;font-weight:700;color:var(--ink-muted);">mmol/L <span id="glucoseTrend"></span></div>
        </div>
        <div class="range-bar">
          <div class="range-needle" id="rangeNeedle" style="left:50%"></div>
        </div>
        <div class="range-labels"><span>Lågt &lt;4</span><span>Mål 4–8</span><span>Högt &gt;10</span></div>
        <div id="glucoseTime" style="font-size:11px;color:var(--ink-muted);font-weight:600;margin-top:6px;"></div>
      </div>
      <div class="companion-img" style="width:70px;">
        <img id="butcherAvatarImg" style="width:70px;height:auto;" alt="Omni-Man">
      </div>
    </div>
    <div id="butcherSpeech" style="margin-top:10px;"></div>
  </div>

  <!-- Ringmål -->
  <div class="card yellow">
    <div class="card-label">Dagens mål</div>
    <div class="rings-row" id="ringsRow"></div>
  </div>

  <!-- Streak -->
  <div class="card green">
    <div class="card-label">Veckostreak</div>
    <div class="streak-row" id="streakRow"></div>
    <div style="display:flex;align-items:center;gap:8px;">
      <span class="burst burst-lg" id="streakCount" style="color:var(--in-range-dark);">0</span>
      <span id="streakText" style="font-size:13px;font-weight:600;color:var(--ink-muted);"></span>
    </div>
  </div>

  <!-- Grogu -->
  <div class="card">
    <div class="card-label">Grogu säger</div>
    <div class="companion-row">
      <div class="companion-img" style="width:80px;">
        <img id="groguAvatarImg" style="width:80px;height:auto;" alt="Grogu">
      </div>
      <div style="flex:1;">
        <div class="companion-name" style="color:var(--in-range-dark);">GROGU</div>
        <div class="speech-bubble" id="groguSpeech">Laddar…</div>
      </div>
    </div>
  </div>

</div>

<!-- ══════════════════════════════════
     SIDA: MAT
══════════════════════════════════ -->
<div class="page" id="page-food">

  <div class="card">
    <div class="card-label">Logga måltid</div>
    <div class="companion-row" style="margin-bottom:14px;">
      <div class="companion-img" style="width:70px;">
        <img id="groguAvatarFoodImg" style="width:70px;height:auto;" alt="Grogu">
      </div>
      <div style="flex:1;">
        <div class="companion-name" style="color:var(--in-range-dark);">GROGU</div>
        <div class="speech-bubble" id="groguFoodSpeech">Vad ska vi äta?</div>
      </div>
    </div>

    <div class="input-group">
      <label class="input-label">Måltid</label>
      <input type="text" class="input-field" id="foodName" placeholder="T.ex. havregrynsgröt med bär…">
    </div>

    <div class="input-group">
      <label class="input-label">Kolhydrater (gram)</label>
      <input type="number" class="input-field input-big" id="foodCarbs" placeholder="0" min="0" max="300" style="color:var(--hero-blue);">
    </div>

    <div class="input-group">
      <label class="input-label">Typ av måltid</label>
      <div class="tag-row" id="mealTypeTags">
        <button class="tag selected" data-val="frukost">🌅 Frukost</button>
        <button class="tag" data-val="lunch">☀️ Lunch</button>
        <button class="tag" data-val="middag">🌙 Middag</button>
        <button class="tag" data-val="mellis">🍎 Mellis</button>
      </div>
    </div>

    <!-- BILDER -->
    <div class="input-label" style="margin-bottom:8px;">📸 Bilder (båda krävs!)</div>
    <div class="photo-grid">
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink-muted);margin-bottom:5px;">Innan du äter</div>
        <div class="photo-box" id="beforePreview" onclick="triggerCamera('before')">
          <div class="photo-box-icon">📷</div>
          <div style="font-size:10px;font-weight:700;color:var(--ink-muted);margin-top:4px;">TRYCK HÄR</div>
        </div>
        <input type="file" id="beforeInput" accept="image/*" capture="environment" style="display:none" onchange="handlePhoto('before',this)">
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink-muted);margin-bottom:5px;">Efter du ätit</div>
        <div class="photo-box" id="afterPreview" onclick="triggerCamera('after')">
          <div class="photo-box-icon">📷</div>
          <div style="font-size:10px;font-weight:700;color:var(--ink-muted);margin-top:4px;">TRYCK HÄR</div>
        </div>
        <input type="file" id="afterInput" accept="image/*" capture="environment" style="display:none" onchange="handlePhoto('after',this)">
      </div>
    </div>
    <div class="photo-status" id="photoStatus">Ta en bild innan du äter för att starta</div>

    <button class="btn btn-primary" onclick="logFood()" id="logFoodBtn">LOGGA MAT · POW!</button>
  </div>

  <div class="section-head">Senaste måltider</div>
  <div class="card">
    <div id="foodLog"><div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga måltider än</div></div>
  </div>

</div>

<!-- ══════════════════════════════════
     SIDA: RÖRELSE
══════════════════════════════════ -->
<div class="page" id="page-walk">

  <div class="card blue">
    <div class="card-label">Promenad med Allen</div>
    <div class="companion-row" style="margin-bottom:14px;">
      <div class="companion-img" style="width:80px;">
        <img id="allenAvatarImg" style="width:80px;height:auto;" alt="Allen">
      </div>
      <div style="flex:1;">
        <div class="companion-name" style="color:var(--hero-blue-deep);">ALLEN THE ALIEN</div>
        <div class="speech-bubble" id="allenSpeech">Dags att röra på sig!</div>
      </div>
    </div>

    <!-- Live stats -->
    <div class="walk-stats-row">
      <div class="walk-stat">
        <div class="walk-stat-val" id="walkTimerDisplay">00:00</div>
        <div class="walk-stat-label">Tid</div>
      </div>
      <div class="walk-stat">
        <div class="walk-stat-val" id="walkDistDisplay">0.00</div>
        <div class="walk-stat-label">km</div>
      </div>
      <div class="walk-stat">
        <div class="walk-stat-val" id="walkPaceDisplay">--</div>
        <div class="walk-stat-label">min/km</div>
      </div>
    </div>

    <!-- Karta -->
    <div id="walkMap">
      <div style="text-align:center;color:var(--ink-muted);">
        <div style="font-size:28px;margin-bottom:6px;">🗺️</div>
        <div style="font-size:12px;font-weight:700;">Kartan visas när du startar GPS</div>
      </div>
    </div>

    <!-- Knappar -->
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      <button class="btn btn-blue btn-sm" id="walkStartBtn" onclick="toggleWalk()" style="flex:2;">STARTA GPS</button>
      <button class="btn btn-ghost btn-sm" onclick="resetWalk()" style="flex:1;font-size:12px;">NOLLST.</button>
    </div>
    <button class="btn btn-green" onclick="finishWalk()" id="finishWalkBtn" style="display:none;">AVSLUTA &amp; SPARA · BAM!</button>
  </div>

  <div class="grid-2">
    <div class="stat-mini">
      <div class="stat-mini-val" id="walkTotal" style="color:var(--hero-blue);">0</div>
      <div class="stat-mini-label">Minuter idag</div>
    </div>
    <div class="stat-mini">
      <div class="stat-mini-val" id="walkDistToday" style="color:var(--hero-blue);">0.0</div>
      <div class="stat-mini-label">km idag</div>
    </div>
  </div>

  <div class="section-head">Senaste promenader</div>
  <div class="card">
    <div id="walkLog"><div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga promenader än</div></div>
  </div>

</div>

<!-- ══════════════════════════════════
     SIDA: BLODSOCKER
══════════════════════════════════ -->
<div class="page" id="page-glucose">

  <div class="card blue">
    <div class="card-label">xDrip+ Anslutning</div>
    <div id="cgmStatus">
      <div class="setup-box">
        <div style="font-size:36px;margin-bottom:8px;">📡</div>
        <div class="burst burst-sm" style="color:var(--hero-blue);margin-bottom:6px;">ANSLUT XDRIP+</div>
        <div style="font-size:12px;color:var(--ink-muted);font-weight:600;margin-bottom:12px;">Aktivera "xDrip Web Service" i xDrip+ → ange adressen</div>
        <div class="input-group">
          <label class="input-label">xDrip URL</label>
          <input type="text" class="input-field" id="xdripUrl" placeholder="http://127.0.0.1:17580" value="http://127.0.0.1:17580">
        </div>
        <button class="btn btn-blue btn-sm" onclick="connectXDrip()">ANSLUT</button>
      </div>
    </div>
    <div id="cgmConnected" style="display:none;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--in-range);border:1.5px solid var(--in-range-dark);"></div>
        <span style="font-weight:700;font-size:13px;">Ansluten till xDrip+</span>
        <button onclick="disconnectXDrip()" style="margin-left:auto;background:none;border:none;color:var(--ink-muted);font-size:12px;cursor:pointer;">Koppla bort</button>
      </div>
      <div class="mini-chart"><canvas id="glucoseChart"></canvas></div>
    </div>
  </div>

  <div class="card">
    <div class="card-label">Manuell loggning</div>
    <div class="companion-row" style="margin-bottom:10px;">
      <div class="companion-img" style="width:60px;">
        <img id="omniAvatarGlucose" style="width:60px;height:auto;" alt="Omni-Man">
      </div>
      <div style="flex:1;">
        <div class="companion-name" style="color:var(--pulse-red-deep);">OMNI-MAN</div>
        <div class="speech-bubble" style="font-size:13px;">Mät. Logga. Kontrollera. Varje gång.</div>
      </div>
    </div>
    <div class="input-group">
      <label class="input-label">Blodsocker (mmol/L)</label>
      <input type="number" class="input-field input-big" id="manualGlucose" placeholder="6.4" min="1" max="30" step="0.1" style="color:var(--in-range-dark);">
    </div>
    <button class="btn btn-primary btn-sm" onclick="logManualGlucose()">LOGGA BLODSOCKER</button>
  </div>

  <div class="section-head">Senaste mätningar</div>
  <div class="card">
    <div id="glucoseLog"><div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga mätningar än</div></div>
  </div>

</div>

<!-- ══════════════════════════════════
     SIDA: ACHIEVEMENTS / HJÄLTE
══════════════════════════════════ -->
<div class="page" id="page-achievements">

  <!-- Hjälte-profil-kort -->
  <div class="card blue" style="text-align:center;padding:20px;">
    <div class="pill blue" style="margin-bottom:10px;font-size:10px;" id="heroLevel">NIVÅ 1 · NYKOMLING</div>
    <div class="burst burst-xl" style="color:var(--power-yellow);text-shadow:2px 2px 0 var(--ink);margin-bottom:4px;" id="achTotalXP">0</div>
    <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:14px;">TOTAL XP</div>
    <div class="xp-bar-wrap">
      <div class="xp-bar-fill" id="achProgressBar" style="width:0%;">
        <span class="xp-bar-text" id="achProgressText"></span>
      </div>
    </div>
    <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);" id="achUnlockedCount">0 / 0 upplåsta</div>
  </div>

  <!-- Filter -->
  <div class="filter-tabs">
    <div class="filter-tab active" data-filter="all" onclick="filterAch('all',this)">Alla</div>
    <div class="filter-tab" data-filter="unlocked" onclick="filterAch('unlocked',this)">Upplåsta ✅</div>
    <div class="filter-tab" data-filter="daily" onclick="filterAch('daily',this)">⚡ Dagliga</div>
    <div class="filter-tab" data-filter="streak" onclick="filterAch('streak',this)">🔥 Streaks</div>
    <div class="filter-tab" data-filter="milestone" onclick="filterAch('milestone',this)">🏆 Milstolpar</div>
    <div class="filter-tab" data-filter="special" onclick="filterAch('special',this)">✨ Special</div>
  </div>

  <div id="achGrid"></div>

</div>

<!-- ══════════════════════════════════
     SIDA: INSTÄLLNINGAR
══════════════════════════════════ -->
<div class="page" id="page-settings">

  <!-- Profil -->
  <div class="card yellow">
    <div class="card-label">Din profil</div>
    <div style="font-family:var(--font-script);font-size:28px;margin-bottom:2px;">Soumaya</div>
    <div style="font-size:12px;font-weight:700;color:var(--ink-muted);">Typ 1 Diabetes · Diagnos 2019</div>
  </div>

  <div class="card">
    <div class="card-label">Blodsockermål</div>
    <div class="setting-row">
      <div><div class="setting-label">Låg gräns (mmol/L)</div></div>
      <input type="number" class="input-field" id="lowTarget" value="4.0" min="2" max="6" step="0.1" style="width:80px;text-align:center;padding:8px;" onchange="saveSettings()">
    </div>
    <div class="setting-row">
      <div><div class="setting-label">Hög gräns (mmol/L)</div></div>
      <input type="number" class="input-field" id="highTarget" value="8.0" min="6" max="15" step="0.1" style="width:80px;text-align:center;padding:8px;" onchange="saveSettings()">
    </div>
  </div>

  <div class="card">
    <div class="card-label">Påminnelser</div>
    <div class="setting-row">
      <div>
        <div class="setting-label">Matpåminnelse</div>
        <div class="setting-sub" id="foodReminderSub">Var 4:e timme</div>
      </div>
      <label class="toggle"><input type="checkbox" id="toggleFoodReminder" checked onchange="saveSettings()"><span class="toggle-slider"></span></label>
    </div>
    <div class="setting-row">
      <div>
        <div class="setting-label">Blodsockerpåminnelse</div>
        <div class="setting-sub">Var 3:e timme</div>
      </div>
      <label class="toggle"><input type="checkbox" id="toggleGlucoseReminder" checked onchange="saveSettings()"><span class="toggle-slider"></span></label>
    </div>
    <div class="setting-row">
      <div>
        <div class="setting-label">Promenadpåminnelse</div>
        <div class="setting-sub">Daglig kl 10:00</div>
      </div>
      <label class="toggle"><input type="checkbox" id="toggleWalkReminder" checked onchange="saveSettings()"><span class="toggle-slider"></span></label>
    </div>
    <div class="setting-row">
      <div><div class="setting-label">Timmar mellan matpåminnelser</div></div>
      <select class="input-field" id="foodInterval" style="width:70px;" onchange="saveSettings()">
        <option value="3">3h</option>
        <option value="4" selected>4h</option>
        <option value="5">5h</option>
        <option value="6">6h</option>
      </select>
    </div>
  </div>

  <div class="card paper">
    <div class="card-label">Om appen</div>
    <div style="font-family:var(--font-script);font-size:18px;line-height:1.6;color:var(--ink-soft);">
      Byggd med kärlek.<br>Grogu, Allen &amp; Omni-Man hejar alltid på dig. 💪
    </div>
  </div>

</div>

<!-- ACHIEVEMENT UNLOCK MODAL -->
<div id="achModal">
  <div id="achModalInner">
    <div class="burst burst-sm" style="letter-spacing:2px;color:var(--ink-muted);margin-bottom:10px;">ACHIEVEMENT UNLOCKED</div>
    <div id="achModalIcon" style="font-size:52px;margin-bottom:10px;min-height:60px;display:flex;align-items:center;justify-content:center;"></div>
    <div class="burst burst-md" id="achModalTitle" style="margin-bottom:6px;"></div>
    <div id="achModalDesc" style="font-size:13px;color:var(--ink-muted);margin-bottom:10px;line-height:1.5;font-weight:600;"></div>
    <div id="achModalFlavor" style="font-family:var(--font-script);font-size:16px;border-top:1.5px solid var(--paper-dark);padding-top:10px;margin-bottom:12px;line-height:1.5;"></div>
    <div class="burst burst-lg" id="achModalXP" style="color:var(--in-range-dark);"></div>
  </div>
</div>

<!-- BOTTOM NAV -->
<nav class="bottom-nav">
  <button class="nav-btn active" onclick="goTo('home',this)">
    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Hem</span>
  </button>
  <button class="nav-btn" onclick="goTo('food',this)">
    <svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
    <span>Mat</span>
  </button>
  <button class="nav-btn" onclick="goTo('walk',this)">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M16 17l-4-4-4 4"/><path d="M8 10l4-5 4 5"/><path d="M8 17v4"/><path d="M16 17v4"/></svg>
    <span>Rörelse</span>
  </button>
  <button class="nav-btn" onclick="goTo('glucose',this)">
    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    <span>Socker</span>
  </button>
  <button class="nav-btn" id="nav-achievements" onclick="goTo('achievements',this)">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
    <span>Trophies</span>
  </button>
  <button class="nav-btn" onclick="goTo('settings',this)">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    <span>Inställn.</span>
  </button>
</nav>

<!-- SCRIPTS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script src="char_imgs.js"></script>
<script src="achievements.js"></script>
<script>
  const unlocked = state.unlockedAchievements || [];
  const newOnes  = checkAchievements(state, unlocked);
  if (newOnes.length) {
    state.unlockedAchievements = [...unlocked, ...newOnes.map(a => a.id)];
    // Räkna XP
    let xpGain = 0;
    newOnes.forEach(a => { xpGain += a.xp; achQueue.push(a); });
    state.totalXP = (state.totalXP || 0) + xpGain;
    save();
    if (achQueue.length === 1) showNextAchModal();
    updateAchBadge();
  }
}

function showNextAchModal() {
  if (!achQueue.length) return;
  const a = achQueue.shift();
  const modal = document.getElementById('achModal');
  const inner = document.getElementById('achModalInner');
  const iconInfo2 = typeof getAchIcon !== 'undefined' ? getAchIcon(a) : null;
  const modalIconEl = document.getElementById('achModalIcon');
  if (iconInfo2 && iconInfo2.type === 'img' && typeof CHAR_IMGS !== 'undefined' && CHAR_IMGS[iconInfo2.src]) {
    modalIconEl.innerHTML = '<img src="' + CHAR_IMGS[iconInfo2.src] + '" style="width:80px;height:80px;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(255,215,0,0.5));" alt="' + a.title + '">';
  } else {
    modalIconEl.textContent = a.icon;
  }
  document.getElementById('achModalTitle').textContent = a.title;
  document.getElementById('achModalDesc').textContent  = a.desc;
  document.getElementById('achModalFlavor').textContent= a.flavor;
  document.getElementById('achModalXP').textContent    = '+' + a.xp + ' XP';
  inner.style.borderColor = TIER_COLORS[a.tier] || '#FFD700';
  inner.style.boxShadow = `0 0 60px ${TIER_COLORS[a.tier]}44`;
  modal.style.pointerEvents = 'all';
  // Animate in
  requestAnimationFrame(() => {
    inner.style.transform = 'scale(1) translateY(0)';
    inner.style.opacity   = '1';
    inner.style.pointerEvents = 'all';
  });
  // Auto-dismiss
  setTimeout(() => dismissAchModal(), a.tier === 'invincible' ? 8000 : 5000);
}

function dismissAchModal() {
  const modal = document.getElementById('achModal');
  const inner = document.getElementById('achModalInner');
  inner.style.transform = 'scale(0.8) translateY(-20px)';
  inner.style.opacity   = '0';
  inner.style.pointerEvents = 'none';
  modal.style.pointerEvents = 'none';
  setTimeout(() => {
    if (achQueue.length) showNextAchModal();
  }, 500);
}

document.getElementById('achModal').addEventListener('click', dismissAchModal);

function updateAchBadge() {
  const unlocked = (state.unlockedAchievements || []).length;
  const total    = ACHIEVEMENTS.length;
  const navBtn   = document.getElementById('nav-achievements');
  if (navBtn && unlocked > 0) {
    // Visa liten dot om ej på sidan
    navBtn.style.color = 'var(--primary)';
  }
}

function renderAchievementsPage() {
  const unlocked = new Set(state.unlockedAchievements || []);
  const totalXP  = state.totalXP || 0;
  const maxXP    = ACHIEVEMENTS.reduce((a,b) => a + b.xp, 0);

  document.getElementById('achTotalXP').textContent     = totalXP.toLocaleString('sv-SE');
  document.getElementById('achUnlockedCount').textContent = `${unlocked.size} / ${ACHIEVEMENTS.length} upplåsta`;
  document.getElementById('achProgressBar').style.width  = Math.min(100, (unlocked.size / ACHIEVEMENTS.length * 100)).toFixed(1) + '%';

  // Filtrera
  let list = ACHIEVEMENTS;
  if (achFilter === 'unlocked')  list = list.filter(a => unlocked.has(a.id));
  if (achFilter === 'daily')     list = list.filter(a => a.type === 'daily');
  if (achFilter === 'streak')    list = list.filter(a => a.type === 'streak');
  if (achFilter === 'milestone') list = list.filter(a => a.type === 'milestone');
  if (achFilter === 'special')   list = list.filter(a => a.type === 'special');

  // Sortera: upplåsta först
  list = [...list].sort((a,b) => {
    const ua = unlocked.has(a.id) ? 0 : 1;
    const ub = unlocked.has(b.id) ? 0 : 1;
    return ua - ub;
  });

  const grid = document.getElementById('achGrid');

  // Gruppera om "alla" eller "milestone/streak"
  if (['all','unlocked'].includes(achFilter)) {
    const groups = [
      { label: '⚡ Dagliga', items: list.filter(a => a.type === 'daily') },
      { label: '🔥 Streaks', items: list.filter(a => a.type === 'streak') },
      { label: '🏆 Milstolpar', items: list.filter(a => a.type === 'milestone') },
      { label: '✨ Special', items: list.filter(a => a.type === 'special') },
    ].filter(g => g.items.length > 0);

    grid.innerHTML = groups.map(g => `
      <div class="section-divider">${g.label}</div>
      <div class="ach-grid">${g.items.map(a => achCard(a, unlocked)).join('')}</div>
    `).join('');
  } else {
    grid.innerHTML = `<div class="ach-grid">${list.map(a => achCard(a, unlocked)).join('')}</div>`;
  }
}

function achIconHTML(a, size, isUnlocked) {
  const iconInfo = typeof getAchIcon !== 'undefined' ? getAchIcon(a) : { type: 'emoji', val: a.icon };
  if (iconInfo.type === 'img' && typeof CHAR_IMGS !== 'undefined' && CHAR_IMGS[iconInfo.src]) {
    const filter = isUnlocked ? 'drop-shadow(0 2px 6px rgba(255,215,0,0.4))' : 'grayscale(1) opacity(0.3)';
    return `<img src="${CHAR_IMGS[iconInfo.src]}" style="width:${size}px;height:${size}px;object-fit:contain;filter:${filter};" alt="${a.title}">`;
  }
  return `<span style="font-size:${Math.round(size*0.6)}px;line-height:1;">${a.icon}</span>`;
}

function achCard(a, unlocked) {
  const isUnlocked = unlocked.has(a.id);
  const charColor  = CHAR_COLORS[a.char] || '#FFD700';
  const tierLabel  = a.tier.toUpperCase();
  return `<div class="ach-card ${isUnlocked ? 'unlocked' : 'locked'}" style="${isUnlocked ? 'border-color:'+charColor+'33;box-shadow:0 0 16px '+charColor+'15;' : ''}">
    <span class="ach-tier-badge tier-${a.tier}">${tierLabel}</span>
    ${isUnlocked ? '<span class="ach-check">✅</span>' : ''}
    <div class="ach-icon ${isUnlocked ? '' : 'locked-icon'}" style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;">
      ${achIconHTML(a, 52, isUnlocked)}
    </div>
    <div class="ach-title" style="color:${isUnlocked ? charColor : 'var(--muted)'};">${a.title}</div>
    <div class="ach-desc">${isUnlocked ? a.desc : '???'}</div>
    <div class="ach-xp" style="color:${isUnlocked ? 'var(--green)' : '#333'};">+${a.xp} XP</div>
    <div class="ach-char-dot" style="background:${charColor};"></div>
  </div>`;
}

function filterAch(filter, btn) {
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  achFilter = filter;
  renderAchievementsPage();
}

// Kör achievement-check efter varje loggning
const _origLogFood = logFood;
// Koppla till save() — kör check varje gång state sparas
const _origSave = save;
window.save = function() {
  _origSave();
  runAchievementCheck();
};

// Kör en gång vid start
setTimeout(runAchievementCheck, 500);

// goTo-patch för achievements-sida
const _origGoTo = goTo;
window.goTo = function(page, btn) {
  _origGoTo(page, btn);
  if (page === 'achievements') renderAchievementsPage();
};
</script>
</body>
</html>

// ══════════════════════════════════════════
// KARAKTÄRS-SVGs (behålls för fallback)
// ══════════════════════════════════════════
const GROGU_SVG = '';
const ALLEN_SVG = '';
const BUTCHER_SVG = '';

// ══════════════════════════════════════════
// STATE & STORAGE
// ══════════════════════════════════════════
let state = {
  glucoseHistory: [], foodLog: [], walkLog: [],
  settings: { lowTarget:4.0, highTarget:8.0, foodInterval:4,
    glucoseReminder:true, foodReminder:true, walkReminder:true },
  streak: { days:[], walkDays:[], foodDays:[] },
  cgmConnected: false, xdripUrl: 'http://127.0.0.1:17580',
  walkActive: false, walkStart: null, walkElapsed: 0,
  selectedMealType: 'frukost',
  unlockedAchievements: [], totalXP: 0, appOpens: 0
};
function save() { localStorage.setItem('soumaya_state', JSON.stringify(state)); runAchievementCheck(); }
function load() { try { const s=localStorage.getItem('soumaya_state'); if(s) state={...state,...JSON.parse(s)}; } catch(e){} }

// ══════════════════════════════════════════
// REPLIKER
// ══════════════════════════════════════════
const GROGU_LINES = {
  hungry: ["*stirrar intensivt* ...mat?","*koar oroligt* Det är dags att äta nu.","*lyfter handen* Hungrig. Mycket hungrig."],
  eating: ["*sluter ögonen nöjt* Mmmmm.","*koar glatt* Bra mat. Bra Soumaya.","*nickar* Ja. Precis såhär."],
  great:  ["*mediterar lugnt* Allt är i balans.","*koar stilla* Kraften flödar. Du gör bra."],
  default:["*tittar nyfiket* Vad händer idag?","*koar mjukt* Jag är här."]
};
const ALLEN_LINES = {
  noWalk: ["Oi, vi har inte gått idag! Kom igen!","Earth-standard promenad? Enkelt för dig!","Jag har flugit parsec. Du kan gå 30 min."],
  walked: ["Excellent! Imponerande — för en människa!","*tummen upp* Varje steg räknas!","Brilliant! Din kropp tackar dig."],
  great:  ["Du är starkare än du tror, Soumaya!"]
};
const BUTCHER_LINES = {
  high:    ["Oi, sockret är ute och spelar. Ta hand om det.","Högt socker? Fixa det, yeah?"],
  low:     ["Lågt socker — det är farligt. Ät nåt NU.","LÅGT. Ät. Direkt. Jag menar allvar."],
  good:    ["Bra. Sockret sitter som det ska. Fortsätt.","Stabilt. Precis som jag gillar det."],
  default: ["Håller koll på dig.","Förbered dig, mät, agera. Enkelt."]
};
function getGroguLine(ctx)  { const l=GROGU_LINES[ctx]||GROGU_LINES.default;  return l[Math.floor(Math.random()*l.length)]; }
function getAllenLine(ctx)   { const l=ALLEN_LINES[ctx]||ALLEN_LINES.great;    return l[Math.floor(Math.random()*l.length)]; }
function getButcherLine(ctx){ const l=BUTCHER_LINES[ctx]||BUTCHER_LINES.default; return l[Math.floor(Math.random()*l.length)]; }

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
function goTo(page, btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  btn.classList.add('active');
  if(page==='home')         renderHome();
  if(page==='food')         renderFoodPage();
  if(page==='walk')         renderWalkPage();
  if(page==='glucose')      renderGlucosePage();
  if(page==='achievements') renderAchievementsPage();
}

// ══════════════════════════════════════════
// GLUKOS
// ══════════════════════════════════════════
function getGlucoseClass(val) {
  if(!val) return '';
  if(val < state.settings.lowTarget) return 'danger';
  if(val > state.settings.highTarget*1.3) return 'danger';
  if(val > state.settings.highTarget) return 'warn';
  return '';
}
function getGlucosePos(val) { return Math.min(95,Math.max(5,((val-2)/(14-2))*100)); }
function glucoseTrend(history) {
  if(history.length<2) return '';
  const diff=history[history.length-1].val - history[history.length-2].val;
  if(diff>1.5) return '↑↑'; if(diff>0.5) return '↑';
  if(diff<-1.5) return '↓↓'; if(diff<-0.5) return '↓'; return '→';
}

function renderGlucoseCard(val) {
  const cls=getGlucoseClass(val);
  const el=document.getElementById('glucoseValue');
  if(el){ el.textContent=val?val.toFixed(1):'--'; el.className='glucose-hero'+(cls?' '+cls:''); }
  const tr=document.getElementById('glucoseTrend');
  if(tr) tr.textContent=glucoseTrend(state.glucoseHistory);
  const needle=document.getElementById('rangeNeedle');
  if(needle) needle.style.left=(val?getGlucosePos(val):50)+'%';

  // Omni-Man replik
  let ctx='default';
  if(val){ if(val<state.settings.lowTarget) ctx='low'; else if(val>state.settings.highTarget) ctx='high'; else ctx='good'; }
  const omniSrc=(typeof CHAR_IMGS!=='undefined')?CHAR_IMGS.omni_speech:'';
  const sp=document.getElementById('butcherSpeech');
  if(sp) sp.innerHTML=`<div class="companion-row" style="margin:0;"><div class="companion-img" style="width:60px;"><img src="${omniSrc}" style="width:60px;height:auto;" alt="Omni-Man"></div><div style="flex:1;"><div class="companion-name" style="color:var(--pulse-red-deep);">OMNI-MAN</div><div class="speech-bubble" style="font-size:13px;">${getButcherLine(ctx)}</div></div></div>`;
}

function logManualGlucose() {
  const val=parseFloat(document.getElementById('manualGlucose').value);
  if(isNaN(val)||val<1||val>30){ showToast('Ange ett giltigt värde (1–30)'); return; }
  const entry={val,source:'manual',time:Date.now()};
  state.glucoseHistory.push(entry);
  if(state.glucoseHistory.length>200) state.glucoseHistory.shift();
  document.getElementById('manualGlucose').value='';
  // Synka till server
  fetch('/api/glucose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry)}).catch(()=>{});
  save();
  renderGlucoseCard(val);
  renderGlucoseLog();
  renderHome();
  showToast('Blodsocker loggat!');
  checkAlerts(val);
}

function checkAlerts(val) {
  if(val<state.settings.lowTarget) showToast('⚠️ LÅGT BLODSOCKER — ät något!');
  else if(val>state.settings.highTarget*1.4) showToast('⚠️ HÖGT BLODSOCKER');
}

async function connectXDrip() {
  const url=document.getElementById('xdripUrl').value.trim();
  state.xdripUrl=url; save();
  try {
    const res=await fetch(url+'/sgv.json?count=1',{mode:'cors'});
    if(!res.ok) throw new Error();
    state.cgmConnected=true; save();
    document.getElementById('cgmStatus').style.display='none';
    document.getElementById('cgmConnected').style.display='block';
    showToast('Ansluten till xDrip+!'); pollXDrip();
  } catch(e){ showToast('Kunde inte ansluta — kolla xDrip-inställningar'); }
}
function disconnectXDrip() {
  state.cgmConnected=false; save();
  document.getElementById('cgmStatus').style.display='block';
  document.getElementById('cgmConnected').style.display='none';
}
async function pollXDrip() {
  if(!state.cgmConnected) return;
  try {
    const res=await fetch(state.xdripUrl+'/sgv.json?count=48',{mode:'cors'});
    const data=await res.json();
    if(data&&data.length){
      const entries=data.map(d=>({val:d.sgv?Math.round(d.sgv/18*10)/10:null,time:d.date||d.dateString,source:'cgm'})).filter(d=>d.val);
      const existing=new Set(state.glucoseHistory.map(g=>g.time));
      entries.forEach(e=>{ if(!existing.has(e.time)) state.glucoseHistory.push(e); });
      state.glucoseHistory.sort((a,b)=>a.time-b.time);
      if(state.glucoseHistory.length>200) state.glucoseHistory=state.glucoseHistory.slice(-200);
      const latest=entries[0];
      const t=new Date(latest.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
      const tEl=document.getElementById('glucoseTime');
      if(tEl) tEl.textContent='xDrip · '+t;
      renderGlucoseCard(latest.val); save(); drawGlucoseChart();
    }
  } catch(e){}
  setTimeout(pollXDrip,60000);
}

function renderGlucosePage() {
  if(state.cgmConnected){
    document.getElementById('cgmStatus').style.display='none';
    document.getElementById('cgmConnected').style.display='block';
  }
  renderGlucoseLog();
}
function renderGlucoseLog() {
  const el=document.getElementById('glucoseLog');
  if(!el) return;
  const history=[...state.glucoseHistory].reverse().slice(0,15);
  if(!history.length){ el.innerHTML='<div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga mätningar än</div>'; return; }
  el.innerHTML=history.map(e=>{
    const cls=getGlucoseClass(e.val);
    const logCls=cls==='danger'?'bad':cls==='warn'?'warn':'ok';
    const t=new Date(e.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
    const d=new Date(e.time).toLocaleDateString('sv-SE',{day:'numeric',month:'short'});
    return `<div class="log-item"><div class="log-icon">🩸</div><div class="log-main"><div class="log-title">${e.source==='cgm'?'CGM':'Manuell'}</div><div class="log-meta">${d} ${t}</div></div><div class="log-val ${logCls}">${e.val.toFixed(1)}</div></div>`;
  }).join('');
}
function drawGlucoseChart() {
  const canvas=document.getElementById('glucoseChart'); if(!canvas) return;
  const recent=state.glucoseHistory.slice(-24);
  if(recent.length<2) return;
  if(window._glucoseChart) window._glucoseChart.destroy();
  window._glucoseChart=new Chart(canvas,{type:'line',data:{labels:recent.map(e=>new Date(e.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'})),datasets:[{data:recent.map(e=>e.val),borderColor:state.settings?'#2DD881':'#2DD881',backgroundColor:'rgba(45,216,129,0.1)',borderWidth:2,pointRadius:2,tension:0.4,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{display:false},y:{min:2,max:14,grid:{color:'#eee'},ticks:{color:'#999',font:{size:10}}}}}});
}

// ══════════════════════════════════════════
// MAT + FOTO
// ══════════════════════════════════════════
let currentMealId=null, mealPhotos={before:false,after:false};
function triggerCamera(phase){ document.getElementById(phase+'Input').click(); }

async function handlePhoto(phase,input) {
  const file=input.files[0]; if(!file) return;
  const preview=document.getElementById(phase+'Preview');
  const reader=new FileReader();
  reader.onload=e=>{ preview.innerHTML=`<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`; };
  reader.readAsDataURL(file);
  mealPhotos[phase]=true;
  if(!currentMealId) currentMealId='meal-'+Date.now();
  updatePhotoStatus();
  try {
    const fd=new FormData();
    fd.append('image',file); fd.append('mealId',currentMealId); fd.append('phase',phase);
    await fetch('/api/meals/upload',{method:'POST',body:fd});
  } catch(e){ showToast('Bilduppladdning misslyckades'); }
  updatePhotoStatus();
}

function updatePhotoStatus() {
  const el=document.getElementById('photoStatus'); if(!el) return;
  if(mealPhotos.before&&mealPhotos.after){ el.textContent='✅ Båda bilder tagna — redo att logga!'; el.style.color='var(--in-range-dark)'; }
  else if(mealPhotos.before){ el.textContent='📷 Kom ihåg att ta en bild EFTER du ätit!'; el.style.color='var(--hero-blue-deep)'; }
  else { el.textContent='Ta en bild INNAN du äter för att starta'; el.style.color='var(--ink-muted)'; }
}

async function logFood() {
  const name=document.getElementById('foodName').value.trim();
  const carbs=parseFloat(document.getElementById('foodCarbs').value);
  if(!name){ showToast('Ange en måltid!'); return; }
  if(!mealPhotos.before){ showToast('📷 Ta en bild innan du äter!'); return; }
  const mealId=currentMealId||('meal-'+Date.now());
  const entry={id:mealId,name,carbs:isNaN(carbs)?0:carbs,type:state.selectedMealType,time:Date.now(),complete:mealPhotos.before&&mealPhotos.after};
  state.foodLog.unshift(entry);
  if(state.foodLog.length>100) state.foodLog.pop();
  try { await fetch('/api/meals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:mealId,name,carbs:entry.carbs,mealType:entry.type})}); } catch(e){}
  const today=todayStr();
  if(!state.streak.foodDays.includes(today)) state.streak.foodDays.push(today);
  document.getElementById('foodName').value='';
  document.getElementById('foodCarbs').value='';
  document.getElementById('beforePreview').innerHTML='<div class="photo-box-icon">📷</div><div style="font-size:10px;font-weight:700;color:var(--ink-muted);margin-top:4px;">TRYCK HÄR</div>';
  document.getElementById('afterPreview').innerHTML='<div class="photo-box-icon">📷</div><div style="font-size:10px;font-weight:700;color:var(--ink-muted);margin-top:4px;">TRYCK HÄR</div>';
  currentMealId=null; mealPhotos={before:false,after:false}; updatePhotoStatus();
  save(); renderFoodPage(); showToast('Grogu är nöjd! 🐸');
}

function renderFoodPage() {
  const lastFood=state.foodLog[0];
  let ctx='default';
  if(!lastFood||Date.now()-lastFood.time>4*3600000) ctx='hungry';
  else if(Date.now()-lastFood.time<2*3600000) ctx='eating';
  const sp=document.getElementById('groguFoodSpeech');
  if(sp) sp.textContent=getGroguLine(ctx);
  const el=document.getElementById('foodLog'); if(!el) return;
  if(!state.foodLog.length){ el.innerHTML='<div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga måltider än</div>'; return; }
  el.innerHTML=state.foodLog.slice(0,12).map(e=>{
    const t=new Date(e.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
    const d=new Date(e.time).toLocaleDateString('sv-SE',{day:'numeric',month:'short'});
    const badge=e.complete?'<span class="pill green" style="font-size:10px;">✅ Komplett</span>':'<span class="pill" style="font-size:10px;">📷 Saknar bild</span>';
    return `<div class="log-item"><div class="log-icon">🍽️</div><div class="log-main"><div class="log-title">${e.name}</div><div class="log-meta">${e.type} · ${d} ${t}</div>${badge}</div><div style="font-size:12px;font-weight:700;color:var(--ink-muted);">${e.carbs}g kh</div></div>`;
  }).join('');
}
document.querySelectorAll('#mealTypeTags .tag').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#mealTypeTags .tag').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected'); state.selectedMealType=btn.dataset.val;
  });
});

// ══════════════════════════════════════════
// GPS-PROMENAD
// ══════════════════════════════════════════
let walkInterval=null,gpsWatchId=null,walkMap=null,walkPolyline=null,walkMarker=null;
let currentWalkId=null,currentWalkCoords=[],pendingCoords=[],walkStartTime=null,walkTotalDist=0;

function haversine(lat1,lon1,lat2,lon2){const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

function initWalkMap(lat,lng){
  const container=document.getElementById('walkMap');
  container.innerHTML='';
  if(walkMap){walkMap.remove();walkMap=null;}
  walkMap=L.map('walkMap',{zoomControl:true,attributionControl:false}).setView([lat,lng],16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(walkMap);
  walkPolyline=L.polyline([],{color:'#169ee7',weight:4,opacity:0.9}).addTo(walkMap);
  walkMarker=L.circleMarker([lat,lng],{radius:10,color:'#0A0A0A',fillColor:'#FFE600',fillOpacity:1,weight:2.5}).addTo(walkMap);
}

async function toggleWalk(){
  const btn=document.getElementById('walkStartBtn');
  const finBtn=document.getElementById('finishWalkBtn');
  if(!state.walkActive){
    if(!navigator.geolocation){showToast('GPS saknas');return;}
    state.walkActive=true; walkStartTime=Date.now(); currentWalkId='walk-'+walkStartTime;
    currentWalkCoords=[]; pendingCoords=[]; walkTotalDist=0;
    btn.textContent='PAUSA GPS'; btn.className='btn btn-primary btn-sm';
    finBtn.style.display='block';
    navigator.geolocation.getCurrentPosition(pos=>initWalkMap(pos.coords.latitude,pos.coords.longitude),()=>showToast('GPS-position saknas'));
    gpsWatchId=navigator.geolocation.watchPosition(pos=>onGPSUpdate(pos),err=>console.warn(err),{enableHighAccuracy:true,maximumAge:3000,timeout:10000});
    walkInterval=setInterval(updateWalkDisplay,1000);
  } else {
    state.walkActive=false; clearInterval(walkInterval);
    if(gpsWatchId!==null){navigator.geolocation.clearWatch(gpsWatchId);gpsWatchId=null;}
    btn.textContent='FORTSÄTT GPS'; btn.className='btn btn-blue btn-sm';
  }
}

function onGPSUpdate(pos){
  const {latitude:lat,longitude:lng,accuracy}=pos.coords;
  if(accuracy>50) return;
  const point={lat,lng,ts:Date.now()};
  const prev=currentWalkCoords[currentWalkCoords.length-1];
  if(prev){const d=haversine(prev.lat,prev.lng,lat,lng);if(d<0.005)return;walkTotalDist+=d;}
  currentWalkCoords.push(point); pendingCoords.push(point);
  if(walkMap){walkPolyline.setLatLngs(currentWalkCoords.map(c=>[c.lat,c.lng]));walkMarker.setLatLng([lat,lng]);walkMap.panTo([lat,lng],{animate:true,duration:0.5});}
  if(pendingCoords.length>=10) flushCoordsToServer();
}
async function flushCoordsToServer(){
  if(!pendingCoords.length||!currentWalkId) return;
  const batch=[...pendingCoords]; pendingCoords=[];
  try{await fetch('/api/walks/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({walkId:currentWalkId,coords:batch})});}
  catch(e){pendingCoords=[...batch,...pendingCoords];}
}
function updateWalkDisplay(){
  if(!walkStartTime) return;
  const elapsed=Math.floor((Date.now()-walkStartTime)/1000);
  const m=Math.floor(elapsed/60),s=elapsed%60;
  const td=document.getElementById('walkTimerDisplay'); if(td) td.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  const dd=document.getElementById('walkDistDisplay'); if(dd) dd.textContent=walkTotalDist.toFixed(2);
  if(walkTotalDist>0.1){const pace=(elapsed/60)/walkTotalDist;const pm=Math.floor(pace),ps=Math.round((pace-pm)*60);const pd=document.getElementById('walkPaceDisplay');if(pd)pd.textContent=pm+':'+String(ps).padStart(2,'0');}
}
async function finishWalk(){
  if(!currentWalkId) return;
  clearInterval(walkInterval);
  if(gpsWatchId!==null){navigator.geolocation.clearWatch(gpsWatchId);gpsWatchId=null;}
  state.walkActive=false;
  await flushCoordsToServer();
  const elapsed=walkStartTime?Math.round((Date.now()-walkStartTime)/60000):0;
  try{await fetch('/api/walks/finish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({walkId:currentWalkId,minutes:elapsed})});}catch(e){}
  const entry={id:currentWalkId,minutes:elapsed,distance:walkTotalDist,time:Date.now()};
  state.walkLog.unshift(entry); if(state.walkLog.length>100) state.walkLog.pop();
  const today=todayStr();
  if(!state.streak.walkDays.includes(today)) state.streak.walkDays.push(today);
  save();
  const sb=document.getElementById('walkStartBtn'); if(sb){sb.textContent='STARTA GPS';sb.className='btn btn-blue btn-sm';}
  const fb=document.getElementById('finishWalkBtn'); if(fb) fb.style.display='none';
  const td=document.getElementById('walkTimerDisplay'); if(td) td.textContent='00:00';
  const dd=document.getElementById('walkDistDisplay'); if(dd) dd.textContent='0.00';
  const pd=document.getElementById('walkPaceDisplay'); if(pd) pd.textContent='--';
  currentWalkId=null; walkStartTime=null; walkTotalDist=0;
  renderWalkPage(); showToast(`Allen är imponerad! ${elapsed} min · ${entry.distance.toFixed(1)} km 💪`);
}
function resetWalk(){
  if(state.walkActive){clearInterval(walkInterval);if(gpsWatchId!==null){navigator.geolocation.clearWatch(gpsWatchId);gpsWatchId=null;}state.walkActive=false;}
  currentWalkId=null;walkStartTime=null;walkTotalDist=0;currentWalkCoords=[];pendingCoords=[];
  const sb=document.getElementById('walkStartBtn');if(sb){sb.textContent='STARTA GPS';sb.className='btn btn-blue btn-sm';}
  const fb=document.getElementById('finishWalkBtn');if(fb) fb.style.display='none';
  ['walkTimerDisplay','walkDistDisplay'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='0'==='0'?'00:00':'0.00';});
  document.getElementById('walkTimerDisplay').textContent='00:00';
  document.getElementById('walkDistDisplay').textContent='0.00';
  document.getElementById('walkPaceDisplay').textContent='--';
  const container=document.getElementById('walkMap');
  if(container) container.innerHTML='<div style="text-align:center;color:var(--ink-muted);padding:20px;"><div style="font-size:28px;margin-bottom:6px;">🗺️</div><div style="font-size:12px;font-weight:700;">Kartan visas när du startar GPS</div></div>';
  if(walkMap){walkMap.remove();walkMap=null;}
}
function renderWalkPage(){
  const today=todayStr();
  const walkedToday=state.walkLog.some(w=>todayStr(w.time)===today);
  const sp=document.getElementById('allenSpeech');if(sp) sp.textContent=getAllenLine(walkedToday?'walked':'noWalk');
  const todayMins=state.walkLog.filter(w=>todayStr(w.time)===today).reduce((a,w)=>a+w.minutes,0);
  const todayKm=state.walkLog.filter(w=>todayStr(w.time)===today).reduce((a,w)=>a+(w.distance||0),0);
  const wt=document.getElementById('walkTotal');if(wt) wt.textContent=todayMins;
  const wd=document.getElementById('walkDistToday');if(wd) wd.textContent=todayKm.toFixed(1);
  const el=document.getElementById('walkLog');if(!el) return;
  if(!state.walkLog.length){el.innerHTML='<div style="color:var(--ink-muted);text-align:center;padding:16px 0;font-weight:600;">Inga promenader än</div>';return;}
  el.innerHTML=state.walkLog.slice(0,10).map(e=>{
    const t=new Date(e.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
    const d=new Date(e.time).toLocaleDateString('sv-SE',{day:'numeric',month:'short'});
    const dist=e.distance?` · ${e.distance.toFixed(1)} km`:'';
    return `<div class="log-item"><div class="log-icon">🚶</div><div class="log-main"><div class="log-title">Promenad${dist}</div><div class="log-meta">${d} ${t}</div></div><div class="log-val ok">${e.minutes} min</div></div>`;
  }).join('');
}

// ══════════════════════════════════════════
// HEM
// ══════════════════════════════════════════
function todayStr(ts){const d=ts?new Date(ts):new Date();return d.toISOString().split('T')[0];}

function renderStreak(){
  const days=['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];
  const today=new Date();
  const row=document.getElementById('streakRow');if(!row) return;
  row.innerHTML='';
  for(let i=6;i>=0;i--){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const str=d.toISOString().split('T')[0];
    const isToday=i===0;
    const hasFood=state.foodLog.some(f=>todayStr(f.time)===str);
    const hasWalk=state.walkLog.some(w=>todayStr(w.time)===str);
    const done=hasFood&&hasWalk;
    const div=document.createElement('div');
    div.className='streak-day'+(done?' done':isToday?' today':'');
    div.innerHTML=`<span>${days[(d.getDay()+6)%7]}</span><div class="day-dot"></div>`;
    row.appendChild(div);
  }
  let streak=0;const d=new Date();
  while(streak<365){const s=d.toISOString().split('T')[0];const hf=state.foodLog.some(f=>todayStr(f.time)===s);const hw=state.walkLog.some(w=>todayStr(w.time)===s);if(hf&&hw){streak++;d.setDate(d.getDate()-1);}else break;}
  const sc=document.getElementById('streakCount');if(sc) sc.textContent=streak;
  const st=document.getElementById('streakText');if(st) st.textContent=streak>0?'dagar streak 🔥':'– starta idag!';
}

function renderRings(){
  const today=todayStr();
  const foodToday=state.foodLog.filter(f=>todayStr(f.time)===today).length;
  const walkToday=state.walkLog.filter(w=>todayStr(w.time)===today).reduce((a,w)=>a+w.minutes,0);
  const glucoseToday=state.glucoseHistory.filter(g=>todayStr(g.time)===today).length;
  const rings=[
    {label:'Måltider',val:foodToday,max:4,color:'#2DD881',unit:'/4'},
    {label:'Promenad',val:walkToday,max:30,color:'#169ee7',unit:'min'},
    {label:'Mätningar',val:glucoseToday,max:6,color:'#E63946',unit:'/6'},
  ];
  const C=2*Math.PI*30;
  const row=document.getElementById('ringsRow');if(!row) return;
  row.innerHTML=rings.map(r=>{
    const pct=Math.min(1,r.val/r.max);
    const offset=C*(1-pct);
    return `<div class="ring-wrap"><div style="position:relative;width:72px;height:72px;"><svg class="ring-svg" viewBox="0 0 72 72"><circle class="ring-track" cx="36" cy="36" r="30"/><circle class="ring-fill" cx="36" cy="36" r="30" stroke="${r.color}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"/></svg><div class="ring-center"><div class="ring-val" style="color:${r.color}">${r.val}</div><div class="ring-unit">${r.unit}</div></div></div><div class="ring-label">${r.label}</div></div>`;
  }).join('');
}

function renderHome(){
  setAvatars();
  const last=state.glucoseHistory[state.glucoseHistory.length-1];
  if(last){
    renderGlucoseCard(last.val);
    const t=new Date(last.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
    const gt=document.getElementById('glucoseTime');if(gt) gt.textContent=(state.cgmConnected?'xDrip · ':'Manuell · ')+t;
  } else {
    renderGlucoseCard(null);
  }
  const gsp=document.getElementById('groguSpeech');
  const lastFood=state.foodLog[0];
  let gCtx='default';
  if(!lastFood||Date.now()-lastFood.time>4*3600000) gCtx='hungry';
  else if(Date.now()-lastFood.time<2*3600000) gCtx='eating';
  if(gsp) gsp.textContent=getGroguLine(gCtx);
  renderStreak();
  renderRings();

  // Morgonstatus
  const ms=document.getElementById('morningStatus');
  if(ms){
    const today=todayStr();
    const meals=state.foodLog.filter(f=>todayStr(f.time)===today).length;
    const walked=state.walkLog.some(w=>todayStr(w.time)===today);
    if(meals===0&&!walked) ms.textContent='Inget loggat än idag — dags att börja! 💪';
    else if(meals>0&&walked) ms.textContent=`${meals} måltid${meals>1?'er':''} · Promenad klar · Bra jobbat! ⚡`;
    else if(meals>0) ms.textContent=`${meals} måltid${meals>1?'er':''} loggad · Glöm inte promenaden!`;
    else ms.textContent='Promenad klar! Glöm inte att logga mat 🍽️';
  }
}

// ══════════════════════════════════════════
// WEB PUSH
// ══════════════════════════════════════════
function urlBase64ToUint8Array(b){const p='='.repeat((4-b.length%4)%4);const base64=(b+p).replace(/-/g,'+').replace(/_/g,'/');const raw=atob(base64);return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));}
async function setupPush(){
  if(!('serviceWorker'in navigator)||!('PushManager'in window)) return;
  try{
    const perm=await Notification.requestPermission();if(perm!=='granted') return;
    const reg=await navigator.serviceWorker.ready;
    const res=await fetch('/api/vapid-public-key');const{key}=await res.json();
    let sub=await reg.pushManager.getSubscription();
    if(!sub) sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(key)});
    await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub.toJSON())});
  }catch(e){console.warn('Push:',e.message);}
}
function startReminders(){
  setInterval(()=>{
    const now=Date.now(),h=new Date().getHours();
    if(h<7||h>=22) return;
    const last=state.glucoseHistory[state.glucoseHistory.length-1];
    if(last&&state.settings.glucoseReminder){
      if(last.val<state.settings.lowTarget) showToast('⚠️ LÅGT BLODSOCKER!');
      else if(last.val>state.settings.highTarget*1.5) showToast('⚠️ HÖGT BLODSOCKER!');
    }
  },5*60*1000);
}

// ══════════════════════════════════════════
// INSTÄLLNINGAR
// ══════════════════════════════════════════
function saveSettings(){
  state.settings={
    lowTarget:parseFloat(document.getElementById('lowTarget').value)||4,
    highTarget:parseFloat(document.getElementById('highTarget').value)||8,
    foodInterval:parseInt(document.getElementById('foodInterval').value)||4,
    glucoseReminder:document.getElementById('toggleGlucoseReminder').checked,
    foodReminder:document.getElementById('toggleFoodReminder').checked,
    walkReminder:document.getElementById('toggleWalkReminder').checked,
  };
  save(); showToast('Inställningar sparade!');
}
function loadSettings(){
  const s=state.settings;
  document.getElementById('lowTarget').value=s.lowTarget;
  document.getElementById('highTarget').value=s.highTarget;
  document.getElementById('foodInterval').value=s.foodInterval;
  document.getElementById('toggleGlucoseReminder').checked=s.glucoseReminder;
  document.getElementById('toggleFoodReminder').checked=s.foodReminder;
  document.getElementById('toggleWalkReminder').checked=s.walkReminder;
}

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
let toastTimeout;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>t.classList.remove('show'),2800);
}

// ══════════════════════════════════════════
// KLOCKA
// ══════════════════════════════════════════
function updateClock(){
  const now=new Date();
  const ht=document.getElementById('headerTime');if(ht) ht.textContent=now.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'});
  const hd=document.getElementById('headerDate');if(hd) hd.textContent=now.toLocaleDateString('sv-SE',{weekday:'short',day:'numeric',month:'short'});
}

// ══════════════════════════════════════════
// ACHIEVEMENTS
// ══════════════════════════════════════════
const TIER_COLORS={bronze:'#b87333',silver:'#666',gold:'#F5C400',platinum:'#555',invincible:'#169ee7'};
const CHAR_COLORS={food:'#2DD881',walk:'#169ee7',glucose:'#E63946',special:'#F5C400'};
let achFilter='all', achQueue=[];

function runAchievementCheck(){
  if(typeof ACHIEVEMENTS==='undefined') return;
  const unlocked=state.unlockedAchievements||[];
  const newOnes=checkAchievements(state,unlocked);
  if(newOnes.length){
    state.unlockedAchievements=[...unlocked,...newOnes.map(a=>a.id)];
    let xpGain=0;
    newOnes.forEach(a=>{xpGain+=a.xp;achQueue.push(a);});
    state.totalXP=(state.totalXP||0)+xpGain;
    localStorage.setItem('soumaya_state',JSON.stringify(state));
    if(achQueue.length===1) showNextAchModal();
  }
}

function showNextAchModal(){
  if(!achQueue.length) return;
  const a=achQueue.shift();
  const modal=document.getElementById('achModal');
  const inner=document.getElementById('achModalInner');
  const iconInfo=typeof getAchIcon!=='undefined'?getAchIcon(a):null;
  const iconEl=document.getElementById('achModalIcon');
  if(iconInfo&&iconInfo.type==='img'&&typeof CHAR_IMGS!=='undefined'&&CHAR_IMGS[iconInfo.src]){
    iconEl.innerHTML=`<img src="${CHAR_IMGS[iconInfo.src]}" style="width:80px;height:80px;object-fit:contain;" alt="${a.title}">`;
  } else { iconEl.textContent=a.icon; }
  document.getElementById('achModalTitle').textContent=a.title;
  document.getElementById('achModalDesc').textContent=a.desc;
  document.getElementById('achModalFlavor').textContent=a.flavor;
  document.getElementById('achModalXP').textContent='+'+a.xp+' XP';
  inner.style.borderColor=TIER_COLORS[a.tier]||'#0A0A0A';
  inner.style.boxShadow=`6px 6px 0 ${TIER_COLORS[a.tier]||'#0A0A0A'}`;
  modal.style.pointerEvents='all';
  requestAnimationFrame(()=>{inner.style.transform='scale(1) translateY(0)';inner.style.opacity='1';inner.style.pointerEvents='all';});
  setTimeout(()=>dismissAchModal(),a.tier==='invincible'?8000:5000);
}
function dismissAchModal(){
  const modal=document.getElementById('achModal');
  const inner=document.getElementById('achModalInner');
  inner.style.transform='scale(0.8) translateY(-20px)';inner.style.opacity='0';inner.style.pointerEvents='none';
  modal.style.pointerEvents='none';
  setTimeout(()=>{if(achQueue.length) showNextAchModal();},500);
}
document.getElementById('achModal').addEventListener('click',dismissAchModal);

function getHeroLevel(xp){
  const levels=[
    {min:0,    label:'NYKOMLING',    num:1},
    {min:500,  label:'VÄKTARE',      num:2},
    {min:1500, label:'FÖRSVARARE',   num:3},
    {min:3000, label:'HJÄLTE',       num:4},
    {min:6000, label:'MÄSTARE',      num:5},
    {min:10000,label:'CHAMPION',     num:6},
    {min:20000,label:'ÖVERMÄNNISKA', num:7},
    {min:50000,label:'INVINCIBLE',   num:8},
  ];
  return levels.filter(l=>xp>=l.min).pop();
}

function renderAchievementsPage(){
  if(typeof ACHIEVEMENTS==='undefined') return;
  const unlocked=new Set(state.unlockedAchievements||[]);
  const xp=state.totalXP||0;
  const level=getHeroLevel(xp);
  const nextLevel=getHeroLevel(xp+1);

  const lvlEl=document.getElementById('heroLevel');if(lvlEl) lvlEl.textContent=`NIVÅ ${level.num} · ${level.label}`;
  const xpEl=document.getElementById('achTotalXP');if(xpEl) xpEl.textContent=xp.toLocaleString('sv-SE');
  const ucEl=document.getElementById('achUnlockedCount');if(ucEl) ucEl.textContent=`${unlocked.size} / ${ACHIEVEMENTS.length} upplåsta`;
  const pct=Math.min(100,unlocked.size/ACHIEVEMENTS.length*100);
  const pb=document.getElementById('achProgressBar');if(pb) pb.style.width=pct.toFixed(1)+'%';
  const pt=document.getElementById('achProgressText');if(pt) pt.textContent=pct.toFixed(0)+'%';

  let list=ACHIEVEMENTS;
  if(achFilter==='unlocked') list=list.filter(a=>unlocked.has(a.id));
  else if(achFilter!=='all')  list=list.filter(a=>a.type===achFilter);
  list=[...list].sort((a,b)=>(unlocked.has(a.id)?0:1)-(unlocked.has(b.id)?0:1));

  const grid=document.getElementById('achGrid');if(!grid) return;
  if(['all','unlocked'].includes(achFilter)){
    const groups=[
      {label:'⚡ Dagliga',   items:list.filter(a=>a.type==='daily')},
      {label:'🔥 Streaks',   items:list.filter(a=>a.type==='streak')},
      {label:'🏆 Milstolpar',items:list.filter(a=>a.type==='milestone')},
      {label:'✨ Special',   items:list.filter(a=>a.type==='special')},
    ].filter(g=>g.items.length>0);
    grid.innerHTML=groups.map(g=>`<div class="section-head">${g.label}</div><div class="ach-grid">${g.items.map(a=>achCard(a,unlocked)).join('')}</div>`).join('');
  } else {
    grid.innerHTML=`<div class="ach-grid">${list.map(a=>achCard(a,unlocked)).join('')}</div>`;
  }
}

function achIconHTML(a,size,isUnlocked){
  const iconInfo=typeof getAchIcon!=='undefined'?getAchIcon(a):{type:'emoji',val:a.icon};
  if(iconInfo.type==='img'&&typeof CHAR_IMGS!=='undefined'&&CHAR_IMGS[iconInfo.src]){
    return `<img src="${CHAR_IMGS[iconInfo.src]}" style="width:${size}px;height:${size}px;object-fit:contain;${isUnlocked?'':'filter:grayscale(1) opacity(0.4);'}" alt="${a.title}">`;
  }
  return `<span style="font-size:${Math.round(size*0.6)}px;line-height:1;">${a.icon}</span>`;
}

function achCard(a,unlocked){
  const isUnlocked=unlocked.has(a.id);
  const cc=CHAR_COLORS[a.char]||'#F5C400';
  const tc=TIER_COLORS[a.tier]||'#666';
  return `<div class="ach-card ${isUnlocked?'unlocked':'locked'}">
    <span class="ach-tier-badge tier-${a.tier}" style="border-color:${tc};color:${tc};">${a.tier.toUpperCase()}</span>
    ${isUnlocked?'<span class="ach-check">✅</span>':''}
    <div class="ach-icon">${achIconHTML(a,52,isUnlocked)}</div>
    <div class="ach-title" style="color:${isUnlocked?cc:'var(--ink-muted)'};">${a.title}</div>
    <div class="ach-desc">${isUnlocked?a.desc:'???'}</div>
    <div class="ach-xp" style="color:${isUnlocked?'var(--in-range-dark)':'var(--paper-dark)'};">+${a.xp} XP</div>
    <div class="ach-char-dot" style="background:${cc};"></div>
  </div>`;
}

function filterAch(filter,el){
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active'); achFilter=filter; renderAchievementsPage();
}

// ══════════════════════════════════════════
// AVATARS
// ══════════════════════════════════════════
function setAvatars(){
  if(typeof CHAR_IMGS==='undefined'){setTimeout(setAvatars,100);return;}
  ['groguAvatarImg','groguAvatarFoodImg'].forEach(id=>{const el=document.getElementById(id);if(el) el.src=CHAR_IMGS.grogu_avatar;});
  const allen=document.getElementById('allenAvatarImg');if(allen) allen.src=CHAR_IMGS.allen_avatar;
  const butcher=document.getElementById('butcherAvatarImg');if(butcher) butcher.src=CHAR_IMGS.omni_avatar;
  const omniGluc=document.getElementById('omniAvatarGlucose');if(omniGluc) omniGluc.src=CHAR_IMGS.omni_avatar;
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
load();
state.appOpens=(state.appOpens||0)+1;
loadSettings();
updateClock();
setInterval(updateClock,10000);
setAvatars();
if(state.cgmConnected){ document.getElementById('xdripUrl').value=state.xdripUrl; pollXDrip(); }
renderHome();
if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js').catch(e=>console.log('SW:',e));}
setupPush();
startReminders();
setTimeout(runAchievementCheck,600);
</script>
</body>
</html>
