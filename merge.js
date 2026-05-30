// ═══════════════════════════════════════════════════════════════
// TRAVEL TOWN MERGE-SPEL
// ═══════════════════════════════════════════════════════════════

const MERGE_COLS = 7;
const MERGE_ROWS = 9;

const MERGE_CHAINS = {
  food:    { name:'Mat',        items:['🥦','🥗','🍱','🍜','🍣','🎂','👑'], color:'#2DD881' },
  walk:    { name:'Rörelse',    items:['👟','🏃','⚡','🌟','🏅','🏆','💎'], color:'#169ee7' },
  glucose: { name:'Blodsocker', items:['💧','🩸','💚','✨','🌈','🔮','🪄'], color:'#FF8A00' },
  bird:    { name:'Fåglar',     items:['🪺','🐣','🐤','🐦','🦜','🦅','🦉'], color:'#b8860b' },
};

const MERGE_XP = [5, 10, 20, 35, 50, 75, 150]; // XP per merge-nivå

function showMergeInfo() {
  const el = document.getElementById('mergeInfoModal');
  if (el) el.classList.add('open');
}
function closeMergeInfo() {
  const el = document.getElementById('mergeInfoModal');
  if (el) el.classList.remove('open');
}

// State
let mergeBoard = [];
let mergeSpawnerCharges = { food: 0, walk: 0, glucose: 0, bird: 0 };
let mergeDragSrc = null;
let mergeLoaded = false;

// ── INIT ─────────────────────────────────────────────────────
async function loadMergeGame() {
  try {
    const res = await fetch('/api/merge');
    if (!res.ok) return;
    const data = await res.json();
    mergeBoard = data.board || Array(MERGE_COLS * MERGE_ROWS).fill(null);
    mergeSpawnerCharges = data.spawnerCharges || { food:0, walk:0, glucose:0, bird:0 };
    mergeLoaded = true;
    renderMergeGame();
  } catch(e) { console.warn('loadMerge:', e.message); }
}

async function saveMergeBoard() {
  try {
    await fetch('/api/merge/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: mergeBoard }),
    });
  } catch(e) {}
}

// ── RENDER ────────────────────────────────────────────────────
function renderMergeGame() {
  const el = document.getElementById('mergeGame');
  if (!el) return;

  // Spawner-rad
  const spawnerTypes = ['food','walk','glucose','bird'];
  let spawnersHtml = '<div class="merge-spawners">';
  spawnerTypes.forEach(type => {
    const chain = MERGE_CHAINS[type];
    const charges = mergeSpawnerCharges[type] || 0;
    spawnersHtml += `
      <div class="merge-spawner ${charges > 0 ? 'charged' : 'empty'}"
           style="border-color:${chain.color};"
           onclick="mergeSpawn('${type}')">
        <div class="merge-spawner-icon">${chain.items[0]}</div>
        <div class="merge-spawner-label" style="color:${chain.color};">${chain.name}</div>
        <div class="merge-spawner-charges" style="background:${charges>0?chain.color:'#444'}">
          ${charges > 0 ? charges : '—'}
        </div>
      </div>`;
  });
  spawnersHtml += '</div>';

  // Bräde (7×8 = 56 celler, spawner-raden är separat)
  const PLAY_SIZE = MERGE_COLS * (MERGE_ROWS - 1); // 56 spelbara celler
  let boardHtml = '<div class="merge-board" id="mergeBoardEl">';
  for (let i = 0; i < PLAY_SIZE; i++) {
    const cell = mergeBoard[MERGE_COLS + i]; // hoppa över spawner-rad index 0-6
    const isEmpty = !cell;
    boardHtml += `<div class="merge-cell ${isEmpty ? 'empty' : 'has-item'}"
      data-idx="${MERGE_COLS + i}"
      ondragover="mergeDragOver(event)"
      ondrop="mergeDrop(event, ${MERGE_COLS + i})"
      onclick="mergeCellClick(${MERGE_COLS + i})">`;
    if (cell) {
      const emoji = MERGE_CHAINS[cell.type]?.items[cell.level] || '?';
      const color = MERGE_CHAINS[cell.type]?.color || '#fff';
      boardHtml += `<div class="merge-item"
        draggable="true"
        data-idx="${MERGE_COLS + i}"
        style="border-color:${color}20;background:${color}15;"
        ondragstart="mergeDragStart(event, ${MERGE_COLS + i})"
        ondragend="mergeDragEnd(event)">
        <span class="merge-emoji">${emoji}</span>
        ${cell.level > 0 ? `<span class="merge-level">Niv${cell.level + 1}</span>` : ''}
      </div>`;
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';

  // XP-info
  const infoHtml = '<div class="merge-info">Dra lika föremål på varandra för att merga! Spawners laddas automatiskt.</div>';

  el.innerHTML = '<div style="position:relative;">' +
    '<button onclick="showMergeInfo()" style="position:absolute;top:0;right:0;z-index:10;background:var(--paper-soft);border:2px solid var(--ink-muted);border-radius:50%;width:30px;height:30px;font-size:15px;cursor:pointer;color:var(--ink-soft);font-weight:700;display:flex;align-items:center;justify-content:center;">?</button>' +
    '</div>' +
    spawnersHtml + boardHtml + infoHtml;
}

// ── SPAWNA ────────────────────────────────────────────────────
async function mergeSpawn(type) {
  if ((mergeSpawnerCharges[type] || 0) < 1) {
    showToast('Inga laddningar kvar för ' + MERGE_CHAINS[type].name);
    return;
  }
  try {
    const res = await fetch('/api/merge/spawn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.ok) {
      mergeBoard = data.board;
      mergeSpawnerCharges = data.spawnerCharges;
      renderMergeGame();
    } else {
      showToast(data.error || 'Kunde inte spawna');
    }
  } catch(e) { showToast('Fel vid spawning'); }
}

// ── DRAG & DROP ───────────────────────────────────────────────
function mergeDragStart(e, idx) {
  mergeDragSrc = idx;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', idx);
  const el = e.currentTarget;
  el.style.opacity = '0.4';
}

function mergeDragEnd(e) {
  e.currentTarget.style.opacity = '1';
  mergeDragSrc = null;
}

function mergeDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
  // Ta bort highlight från andra celler
  document.querySelectorAll('.merge-cell.drag-over').forEach(c => {
    if (c !== e.currentTarget) c.classList.remove('drag-over');
  });
}

function mergeDrop(e, targetIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const srcIdx = parseInt(e.dataTransfer.getData('text/plain'));
  if (isNaN(srcIdx) || srcIdx === targetIdx) return;
  mergeDoAction(srcIdx, targetIdx);
}

// Klick-alternativ (tryck src, tryck dst)
let mergeClickSrc = null;
function mergeCellClick(idx) {
  const cell = mergeBoard[idx];
  if (!cell) {
    // Klick på tom cell — avmarkera
    mergeClickSrc = null;
    document.querySelectorAll('.merge-cell.selected').forEach(c => c.classList.remove('selected'));
    return;
  }
  if (mergeClickSrc === null) {
    // Välj cell
    mergeClickSrc = idx;
    const el = document.querySelector(`[data-idx="${idx}"]`);
    if (el) el.classList.add('selected');
  } else if (mergeClickSrc === idx) {
    // Avmarkera
    mergeClickSrc = null;
    document.querySelectorAll('.merge-cell.selected').forEach(c => c.classList.remove('selected'));
  } else {
    // Försök merga
    mergeDoAction(mergeClickSrc, idx);
    mergeClickSrc = null;
    document.querySelectorAll('.merge-cell.selected').forEach(c => c.classList.remove('selected'));
  }
}

// ── MERGE-LOGIK ───────────────────────────────────────────────
async function mergeDoAction(srcIdx, dstIdx) {
  const src = mergeBoard[srcIdx];
  const dst = mergeBoard[dstIdx];

  if (!src) return;

  if (!dst) {
    // Flytta till tom cell
    mergeBoard[dstIdx] = src;
    mergeBoard[srcIdx] = null;
    renderMergeGame();
    saveMergeBoard();
    return;
  }

  // Kolla om merge är möjlig
  if (src.type !== dst.type || src.level !== dst.level) {
    showToast('Kan bara merga lika föremål av samma typ och nivå!');
    return;
  }

  const chain = MERGE_CHAINS[src.type];
  if (!chain) return;

  if (src.level >= chain.items.length - 1) {
    showToast('Redan max-nivå! 🏆');
    return;
  }

  // MERGE!
  const newLevel = src.level + 1;
  mergeBoard[dstIdx] = { type: src.type, level: newLevel };
  mergeBoard[srcIdx] = null;

  // XP
  const xpGain = MERGE_XP[src.level] || 10;
  const gold = Math.floor(xpGain / 10);

  // Uppdatera lokal state
  state.totalXP = (state.totalXP || 0) + xpGain;
  state.gold = (state.gold || 0) + gold;
  updateGoldDisplay();
  runAchievementCheck();

  // Skicka XP till server
  try {
    await fetch('/api/merge/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: xpGain }),
    });
  } catch(e) {}

  const newEmoji = chain.items[newLevel];
  const isMax = newLevel === chain.items.length - 1;

  if (isMax) {
    showToast('🏆 MAX! ' + newEmoji + ' upplåst! +' + xpGain + ' XP');
    // Liten konfetti-animation
    mergeCelebrate(dstIdx);
  } else {
    showToast(newEmoji + ' skapad! +' + xpGain + ' XP 🪙+' + gold);
  }

  renderMergeGame();
  saveMergeBoard();
}

function mergeCelebrate(idx) {
  const el = document.querySelector(`[data-idx="${idx}"] .merge-emoji`);
  if (!el) return;
  el.style.transition = 'transform .3s';
  el.style.transform = 'scale(1.8)';
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 400);
}

