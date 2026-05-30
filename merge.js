// ═══════════════════════════════════════════════════════════════
// TRAVEL TOWN MERGE-SPEL — Touch & Mouse version
// ═══════════════════════════════════════════════════════════════

const MERGE_COLS = 7;
const MERGE_ROWS = 9;

const MERGE_CHAINS = {
  food:    { name:'Mat',        items:['🥦','🥗','🍱','🍜','🍣','🎂','👑'], color:'#2DD881' },
  walk:    { name:'Rörelse',    items:['👟','🏃','⚡','🌟','🏅','🏆','💎'], color:'#169ee7' },
  glucose: { name:'Blodsocker', items:['💧','🩸','💚','✨','🌈','🔮','🪄'], color:'#FF8A00' },
  bird:    { name:'Fåglar',     items:['🪺','🐣','🐤','🐦','🦜','🦅','🦉'], color:'#b8860b' },
};

const MERGE_XP = [5, 10, 20, 35, 50, 75, 150];

let mergeBoard = [];
let mergeSpawnerCharges = { food: 0, walk: 0, glucose: 0, bird: 0 };
let mergeLoaded = false;

// Drag state
let mergeDrag = {
  active: false,
  srcIdx: null,
  el: null,       // floating clone element
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
};

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
    setupMergeDrag();
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

  const spawnerTypes = ['food','walk','glucose','bird'];
  let spawnersHtml = '<div class="merge-spawners">';
  spawnerTypes.forEach(type => {
    const chain = MERGE_CHAINS[type];
    const charges = mergeSpawnerCharges[type] || 0;
    spawnersHtml +=
      `<div class="merge-spawner ${charges > 0 ? 'charged' : 'empty'}"
           style="border-color:${chain.color};"
           data-spawn="${type}">
        <div class="merge-spawner-icon">${chain.items[0]}</div>
        <div class="merge-spawner-label" style="color:${chain.color};">${chain.name}</div>
        <div class="merge-spawner-charges" style="background:${charges>0?chain.color:'#555'}">
          ${charges > 0 ? charges : '—'}
        </div>
      </div>`;
  });
  spawnersHtml += '</div>';

  // Info-knapp
  const infoBtn = `<button onclick="showMergeInfo()" class="merge-info-btn">?</button>`;

  // Bräde — 7×8 spelbara celler (hoppa över spawner-rad 0–6)
  const PLAY_SIZE = MERGE_COLS * (MERGE_ROWS - 1);
  let boardHtml = '<div class="merge-board" id="mergeBoardEl">';
  for (let i = 0; i < PLAY_SIZE; i++) {
    const idx = MERGE_COLS + i;
    const cell = mergeBoard[idx];
    if (cell) {
      const emoji = MERGE_CHAINS[cell.type]?.items[cell.level] || '?';
      const color = MERGE_CHAINS[cell.type]?.color || '#fff';
      boardHtml +=
        `<div class="merge-cell has-item" data-idx="${idx}">
          <div class="merge-item" data-idx="${idx}"
               style="border-color:${color}30;background:${color}18;">
            <span class="merge-emoji">${emoji}</span>
            ${cell.level > 0 ? `<span class="merge-level">Niv${cell.level+1}</span>` : ''}
          </div>
        </div>`;
    } else {
      boardHtml += `<div class="merge-cell empty" data-idx="${idx}"></div>`;
    }
  }
  boardHtml += '</div>';

  el.innerHTML = infoBtn + spawnersHtml + boardHtml;

  // Spawner-lyssnare
  el.querySelectorAll('[data-spawn]').forEach(btn => {
    btn.addEventListener('click', () => mergeSpawn(btn.dataset.spawn));
  });

  setupMergeDrag();
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
      // Hitta vilken cell som fylldes (senast ändrad)
      const newIdx = mergeBoard.findIndex((c,i) => i >= MERGE_COLS && c && c.type === type && !mergeBoard.slice(0,i).some(old => old && old === c));
      renderMergeGame();
      // Animera spawnen
      const spawnedIdx = data.spawnedIdx;
      if (spawnedIdx !== undefined) animateSpawn(spawnedIdx);
    } else {
      showToast(data.error || 'Brädet är fullt!');
    }
  } catch(e) { showToast('Fel vid spawning'); }
}

function animateSpawn(idx) {
  const cell = document.querySelector(`[data-idx="${idx}"] .merge-item`);
  if (!cell) return;
  cell.style.transform = 'scale(0)';
  cell.style.transition = 'transform 0.3s cubic-bezier(.34,1.56,.64,1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cell.style.transform = 'scale(1)';
    });
  });
}

// ── TOUCH/MOUSE DRAG ──────────────────────────────────────────
function setupMergeDrag() {
  const board = document.getElementById('mergeBoardEl');
  if (!board) return;

  board.addEventListener('mousedown', mergePointerDown);
  board.addEventListener('touchstart', mergePointerDown, { passive: false });
}

function mergePointerDown(e) {
  const item = e.target.closest('.merge-item');
  if (!item) return;
  if (e.cancelable) e.preventDefault();

  const idx = parseInt(item.dataset.idx);
  const touch = e.touches ? e.touches[0] : e;
  const rect = item.getBoundingClientRect();

  mergeDrag.active = true;
  mergeDrag.srcIdx = idx;
  mergeDrag.startX = touch.clientX;
  mergeDrag.startY = touch.clientY;
  mergeDrag.offsetX = touch.clientX - rect.left - rect.width / 2;
  mergeDrag.offsetY = touch.clientY - rect.top - rect.height / 2;

  // Skapa floating clone
  const cell = mergeBoard[idx];
  const emoji = MERGE_CHAINS[cell.type]?.items[cell.level] || '?';
  const color = MERGE_CHAINS[cell.type]?.color || '#fff';

  const clone = document.createElement('div');
  clone.className = 'merge-drag-clone';
  clone.innerHTML = `<span style="font-size:32px">${emoji}</span>`;
  clone.style.cssText = `
    position:fixed;z-index:9999;pointer-events:none;
    width:52px;height:52px;border-radius:12px;
    background:${color}30;border:2.5px solid ${color};
    display:flex;align-items:center;justify-content:center;
    transform:scale(1.2);
    transition:transform .1s;
    left:${touch.clientX - 26}px;
    top:${touch.clientY - 26}px;
  `;
  document.body.appendChild(clone);
  mergeDrag.el = clone;

  // Dimma ursprungscell
  item.style.opacity = '0.3';
  item.dataset.dragging = '1';

  document.addEventListener('mousemove', mergePointerMove, { passive: false });
  document.addEventListener('touchmove', mergePointerMove, { passive: false });
  document.addEventListener('mouseup', mergePointerUp);
  document.addEventListener('touchend', mergePointerUp);
}

function mergePointerMove(e) {
  if (!mergeDrag.active) return;
  if (e.cancelable) e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;

  if (mergeDrag.el) {
    mergeDrag.el.style.left = (touch.clientX - 26) + 'px';
    mergeDrag.el.style.top  = (touch.clientY - 26) + 'px';
  }

  // Highlight cell under finger
  document.querySelectorAll('.merge-cell.drag-over').forEach(c => c.classList.remove('drag-over'));
  const target = getCellUnderPoint(touch.clientX, touch.clientY);
  if (target && parseInt(target.dataset.idx) !== mergeDrag.srcIdx) {
    target.classList.add('drag-over');
  }
}

function mergePointerUp(e) {
  if (!mergeDrag.active) return;
  const touch = e.changedTouches ? e.changedTouches[0] : e;

  document.removeEventListener('mousemove', mergePointerMove);
  document.removeEventListener('touchmove', mergePointerMove);
  document.removeEventListener('mouseup', mergePointerUp);
  document.removeEventListener('touchend', mergePointerUp);

  // Ta bort clone
  if (mergeDrag.el) { mergeDrag.el.remove(); mergeDrag.el = null; }
  document.querySelectorAll('.merge-cell.drag-over').forEach(c => c.classList.remove('drag-over'));

  // Återställ opacity
  const srcItem = document.querySelector(`.merge-item[data-idx="${mergeDrag.srcIdx}"]`);
  if (srcItem) { srcItem.style.opacity = '1'; delete srcItem.dataset.dragging; }

  const target = getCellUnderPoint(touch.clientX, touch.clientY);
  const targetIdx = target ? parseInt(target.dataset.idx) : null;

  mergeDrag.active = false;

  if (targetIdx !== null && targetIdx !== mergeDrag.srcIdx) {
    mergeDoAction(mergeDrag.srcIdx, targetIdx);
  }

  mergeDrag.srcIdx = null;
}

function getCellUnderPoint(x, y) {
  const board = document.getElementById('mergeBoardEl');
  if (!board) return null;
  const cells = board.querySelectorAll('.merge-cell');
  for (const cell of cells) {
    const r = cell.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return cell;
  }
  return null;
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
    animateSpawn(dstIdx);
    saveMergeBoard();
    return;
  }

  if (src.type !== dst.type || src.level !== dst.level) {
    showToast('Kan bara merga lika föremål av samma nivå!');
    // Skaka mål-cellen
    const dstEl = document.querySelector(`[data-idx="${dstIdx}"] .merge-item`);
    if (dstEl) {
      dstEl.style.animation = 'mergeShake .4s ease';
      setTimeout(() => { if(dstEl) dstEl.style.animation = ''; }, 400);
    }
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

  const xpGain = MERGE_XP[src.level] || 10;
  const gold   = Math.floor(xpGain / 10);
  state.totalXP = (state.totalXP || 0) + xpGain;
  state.gold    = (state.gold || 0) + gold;
  updateGoldDisplay();
  runAchievementCheck();

  try {
    await fetch('/api/merge/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: xpGain }),
    });
  } catch(e) {}

  const newEmoji = chain.items[newLevel];
  const isMax = newLevel === chain.items.length - 1;

  renderMergeGame();

  // Merge-animation på målcellen
  setTimeout(() => {
    const dstEl = document.querySelector(`[data-idx="${dstIdx}"] .merge-item`);
    if (dstEl) {
      dstEl.style.animation = 'none';
      dstEl.style.transform = 'scale(0)';
      dstEl.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        dstEl.style.transform = 'scale(1)';
      }));
    }
  }, 10);

  if (isMax) {
    showToast('🏆 MAX NIVÅ! ' + newEmoji + ' +' + xpGain + ' XP!');
    setTimeout(() => mergeCelebrate(dstIdx), 100);
  } else {
    showToast(newEmoji + ' skapad! +' + xpGain + ' XP' + (gold ? ' 🪙+' + gold : ''));
  }

  saveMergeBoard();
}

function mergeCelebrate(idx) {
  const el = document.querySelector(`[data-idx="${idx}"] .merge-emoji`);
  if (!el) return;
  el.style.animation = 'mergeBounce .6s ease';
  setTimeout(() => { if(el) el.style.animation = ''; }, 700);
}

function showMergeInfo() {
  const el = document.getElementById('mergeInfoModal');
  if (el) el.classList.add('open');
}
function closeMergeInfo() {
  const el = document.getElementById('mergeInfoModal');
  if (el) el.classList.remove('open');
}
