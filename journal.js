// ═══════════════════════════════════════════════════════════════
// DAGBOK & MÅENDE
// ═══════════════════════════════════════════════════════════════

let journalData = [];
let journalLoaded = false;

const MOOD_ICONS  = ['😔','😕','😐','😊','😄'];
const MOOD_LABELS = ['Dålig','Inte bra','Ok','Bra','Toppen'];
const MOOD_COLORS = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#27ae60'];

async function loadJournal() {
  try {
    const r = await fetch('/api/journal');
    if (r.ok) journalData = await r.json();
    journalLoaded = true;
  } catch(e) { console.warn('loadJournal:', e.message); }
}

// ── DAGBOK-MODAL (kvällspåminnelse) ───────────────────────────
function showJournalModal(date) {
  const today = date || new Date().toISOString().split('T')[0];
  const existing = journalData.find(j => j.date === today);

  const modal = document.getElementById('journalModal');
  if (!modal) return;

  // Sammanfatta dagen automatiskt
  const todayMeals   = (state.foodLog||[]).filter(f => todayStr(f.createdAt||f.time||0) === today);
  const todayWalks   = (state.walkLog||[]).filter(w => !w.active && todayStr(w.endTime||w.startTime||0) === today);
  const todayGlucose = (state.glucoseHistory||[]).filter(g => todayStr(g.time) === today);
  const todayRuns    = todayWalks.filter(w => w.type === 'run');
  const km           = todayWalks.reduce((a,w) => a+(w.distance||0), 0).toFixed(1);
  const LOW=state.settings?.lowTarget||4, HIGH=state.settings?.highTarget||8;
  const inRange      = todayGlucose.filter(g => g.val>=LOW && g.val<=HIGH).length;
  const tirPct       = todayGlucose.length ? Math.round(100*inRange/todayGlucose.length) : 0;

  let daySummary = '';
  if (todayMeals.length)  daySummary += `${todayMeals.length} måltid${todayMeals.length>1?'er':''}`;
  if (km > 0)             daySummary += ` · ${km} km${todayRuns.length?' (löpning)':''}`;
  if (todayGlucose.length) daySummary += ` · TIR ${tirPct}%`;

  const curMood = existing?.mood || 3;

  modal.innerHTML = `
    <div class="journal-backdrop" onclick="closeJournalModal()"></div>
    <div class="journal-box card">
      <div class="burst burst-sm" style="margin-bottom:12px;">📖 Hur var din dag?</div>
      <div style="font-size:12px;color:var(--ink-muted);margin-bottom:14px;text-align:center;font-style:italic;">
        ${daySummary || 'Ingen aktivitet loggad idag'}
      </div>

      <div class="journal-mood-row" id="journalMoodRow">
        ${MOOD_ICONS.map((icon,i) => `
          <div class="journal-mood-btn ${curMood===i+1?'active':''}"
               data-mood="${i+1}" onclick="selectMood(${i+1})"
               style="border-color:${MOOD_COLORS[i]}${curMood===i+1?'':'33'};">
            <div style="font-size:28px;">${icon}</div>
            <div style="font-size:9px;font-weight:700;color:${MOOD_COLORS[i]};margin-top:2px;">${MOOD_LABELS[i]}</div>
          </div>`).join('')}
      </div>

      <div style="margin:14px 0 8px;font-size:12px;font-weight:700;color:var(--ink-soft);">Energi</div>
      <input type="range" id="journalEnergy" min="1" max="5" value="${existing?.energy||3}"
        style="width:100%;accent-color:var(--hero-blue);">

      <div style="margin:10px 0 8px;font-size:12px;font-weight:700;color:var(--ink-soft);">Stress</div>
      <input type="range" id="journalStress" min="1" max="5" value="${existing?.stress||3}"
        style="width:100%;accent-color:var(--high);">

      <textarea id="journalNote" placeholder="Skriv något om din dag... (valfritt)"
        style="width:100%;height:64px;margin-top:12px;padding:10px;
               border:var(--border-thick);border-radius:10px;font-family:var(--font-script);
               font-size:14px;background:var(--paper-soft);resize:none;">${existing?.note||''}</textarea>

      <button class="btn btn-primary" style="width:100%;margin-top:12px;"
              onclick="saveJournalEntry('${today}')">
        ✅ Spara dagbokspost
      </button>
      <button onclick="closeJournalModal()"
        style="width:100%;background:none;border:none;color:var(--ink-muted);
               font-size:13px;margin-top:8px;cursor:pointer;font-weight:600;">
        Inte nu
      </button>
    </div>`;

  modal.style.display = 'flex';
}

function selectMood(val) {
  document.querySelectorAll('.journal-mood-btn').forEach((btn,i) => {
    const active = parseInt(btn.dataset.mood) === val;
    btn.classList.toggle('active', active);
    btn.style.borderColor = active ? MOOD_COLORS[i] : MOOD_COLORS[i]+'33';
    btn.style.background  = active ? MOOD_COLORS[i]+'22' : '';
  });
}

function closeJournalModal() {
  const modal = document.getElementById('journalModal');
  if (modal) modal.style.display = 'none';
}

async function saveJournalEntry(date) {
  const mood   = parseInt(document.querySelector('.journal-mood-btn.active')?.dataset.mood || 3);
  const energy = parseInt(document.getElementById('journalEnergy')?.value || 3);
  const stress = parseInt(document.getElementById('journalStress')?.value || 3);
  const note   = document.getElementById('journalNote')?.value || '';

  try {
    const r = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, mood, energy, stress, note }),
    });
    const d = await r.json();
    if (d.ok) {
      // Uppdatera lokal data
      const idx = journalData.findIndex(j => j.date === date);
      if (idx >= 0) journalData[idx] = d.entry;
      else journalData.push(d.entry);
      closeJournalModal();
      showToast('📖 Dagbokspost sparad! +10 XP');
      state.totalXP = (state.totalXP||0) + 10;
      updateGoldDisplay();
      save();
    }
  } catch(e) { showToast('❌ Kunde inte spara dagbok'); }
}

// ── KVÄLLSPÅMINNELSE ─────────────────────────────────────────
function checkJournalReminder() {
  const now    = new Date();
  const hour   = now.getHours();
  const today  = now.toISOString().split('T')[0];
  const alreadyFilled = journalData.some(j => j.date === today);
  // Visa kl 20-22 om inte redan fyllt i
  if (hour >= 20 && hour < 22 && !alreadyFilled) {
    const key = 'journalPrompted_' + today;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      setTimeout(() => showJournalModal(today), 2000);
    }
  }
}

// ── KORRELATIONSGRAF ─────────────────────────────────────────
function renderWellbeingPage() {
  const el = document.getElementById('page-wellbeing');
  if (!el) return;

  if (!journalLoaded || journalData.length === 0) {
    el.innerHTML = `
      <div class="section-head">📊 MÅENDE & AKTIVITET</div>
      <div class="card" style="text-align:center;padding:30px;">
        <div style="font-size:40px;margin-bottom:12px;">📖</div>
        <div class="burst burst-sm" style="margin-bottom:8px;">Inga data ännu</div>
        <div style="font-size:13px;color:var(--ink-muted);">Fyll i din dagbok varje kväll för att se korrelationer över tid.</div>
        <button class="btn btn-primary" style="margin-top:16px;" onclick="showJournalModal()">
          Fyll i idag
        </button>
      </div>`;
    return;
  }

  // Senaste 30 dagarna
  const last30 = journalData.slice(-30);

  // Sammanfatta aktivitet per dag
  const dayStats = last30.map(j => {
    const dayWalks   = (state.walkLog||[]).filter(w => !w.active && todayStr(w.endTime||w.startTime||0) === j.date);
    const dayGlucose = (state.glucoseHistory||[]).filter(g => todayStr(g.time) === j.date);
    const dayMeals   = (state.foodLog||[]).filter(f => todayStr(f.createdAt||f.time||0) === j.date);
    const km         = dayWalks.reduce((a,w) => a+(w.distance||0), 0);
    const LOW=state.settings?.lowTarget||4, HIGH=state.settings?.highTarget||8;
    const inRange    = dayGlucose.filter(g => g.val>=LOW && g.val<=HIGH).length;
    const tirPct     = dayGlucose.length ? Math.round(100*inRange/dayGlucose.length) : null;
    return { ...j, km, tirPct, meals: dayMeals.length };
  });

  // SVG-graf
  const W = 320, H = 120, pad = { t:10, r:10, b:24, l:28 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const n = dayStats.length;

  const xPos = i => pad.l + (i / Math.max(n-1,1)) * iW;
  const moodY = v => pad.t + iH - ((v-1)/4) * iH;
  const kmY   = v => pad.t + iH - (Math.min(v,8)/8) * iH;
  const tirY  = v => pad.t + iH - (v/100) * iH;

  const moodPath = dayStats.map((d,i) => `${i===0?'M':'L'}${xPos(i).toFixed(1)},${moodY(d.mood).toFixed(1)}`).join(' ');
  const kmPath   = dayStats.filter(d=>d.km>0).map((d,i) => {
    const xi = dayStats.indexOf(d);
    return `${xi===0||dayStats[xi-1]?.km===0?'M':'L'}${xPos(xi).toFixed(1)},${kmY(d.km).toFixed(1)}`;
  }).join(' ');
  const tirPath  = dayStats.filter(d=>d.tirPct!==null).map((d,i) => {
    const xi = dayStats.indexOf(d);
    return `${i===0?'M':'L'}${xPos(xi).toFixed(1)},${tirY(d.tirPct).toFixed(1)}`;
  }).join(' ');

  // Genomsnitt
  const avgMood = (dayStats.reduce((a,d)=>a+d.mood,0)/dayStats.length).toFixed(1);
  const avgTir  = dayStats.filter(d=>d.tirPct!==null).length
    ? (dayStats.filter(d=>d.tirPct!==null).reduce((a,d)=>a+d.tirPct,0)/dayStats.filter(d=>d.tirPct!==null).length).toFixed(0)
    : '–';

  // Senaste 7 dagar som kalusor
  const last7 = dayStats.slice(-7);

  el.innerHTML = `
    <div class="section-head">📊 MÅENDE & AKTIVITET</div>

    <div class="card" style="margin-bottom:12px;">
      <div class="card-label" style="margin-bottom:10px;">Senaste ${n} dagarna</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:#e74c3c;">
          <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="#e74c3c" stroke-width="2.5"/></svg>Mående (snitt ${avgMood}/5)
        </div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--hero-blue);">
          <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--hero-blue)" stroke-width="2.5" stroke-dasharray="4,2"/></svg>Aktivitet (km)
        </div>
        <div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--in-range-dark);">
          <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--in-range-dark)" stroke-width="2.5" stroke-dasharray="2,2"/></svg>TIR% (snitt ${avgTir}%)
        </div>
      </div>

      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible;">
        <!-- Rutnät -->
        ${[1,2,3,4,5].map(v=>`<line x1="${pad.l}" y1="${moodY(v).toFixed(1)}" x2="${W-pad.r}" y2="${moodY(v).toFixed(1)}" stroke="#eee" stroke-width="1"/>`).join('')}
        <!-- Y-axel labels -->
        ${[1,3,5].map(v=>`<text x="${pad.l-4}" y="${(moodY(v)+4).toFixed(1)}" font-size="9" fill="#aaa" text-anchor="end">${v}</text>`).join('')}
        <!-- X-axel datum -->
        ${dayStats.filter((_,i)=>i===0||i===Math.floor(n/2)||i===n-1).map(d=>{
          const xi = dayStats.indexOf(d);
          const label = d.date.slice(5);
          return `<text x="${xPos(xi).toFixed(1)}" y="${H-4}" font-size="8" fill="#aaa" text-anchor="middle">${label}</text>`;
        }).join('')}
        <!-- TIR linje -->
        ${tirPath ? `<path d="${tirPath}" fill="none" stroke="var(--in-range-dark)" stroke-width="1.5" stroke-dasharray="2,2" opacity=".7"/>` : ''}
        <!-- KM linje -->
        ${kmPath ? `<path d="${kmPath}" fill="none" stroke="var(--hero-blue)" stroke-width="2" stroke-dasharray="5,3" opacity=".8"/>` : ''}
        <!-- Mående linje -->
        <path d="${moodPath}" fill="none" stroke="#e74c3c" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Mående punkter -->
        ${dayStats.map((d,i)=>`
          <circle cx="${xPos(i).toFixed(1)}" cy="${moodY(d.mood).toFixed(1)}" r="3.5"
            fill="${MOOD_COLORS[d.mood-1]}" stroke="white" stroke-width="1.5"/>
        `).join('')}
      </svg>
    </div>

    <!-- Senaste 7 dagar detaljkort -->
    <div class="card-label" style="margin-bottom:8px;">Senaste 7 dagarna</div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${last7.reverse().map(d => `
        <div class="card" style="padding:10px 14px;margin-bottom:0;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="font-size:26px;">${MOOD_ICONS[d.mood-1]}</div>
            <div style="flex:1;">
              <div style="font-size:13px;font-weight:700;">${formatDateSv(d.date)}</div>
              <div style="font-size:11px;color:var(--ink-muted);margin-top:1px;">
                ${[
                  d.km>0 ? d.km.toFixed(1)+' km' : '',
                  d.meals>0 ? d.meals+' måltider' : '',
                  d.tirPct!==null ? 'TIR '+d.tirPct+'%' : '',
                ].filter(Boolean).join(' · ') || 'Ingen aktivitet loggad'}
              </div>
              ${d.note ? `<div style="font-size:12px;font-style:italic;color:var(--ink-soft);margin-top:4px;">"${d.note}"</div>` : ''}
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px;font-weight:700;color:${MOOD_COLORS[d.mood-1]};">${MOOD_LABELS[d.mood-1]}</div>
              <div style="font-size:10px;color:var(--ink-muted);">Energi ${d.energy||'–'}/5</div>
              <div style="font-size:10px;color:var(--ink-muted);">Stress ${d.stress||'–'}/5</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <button class="btn btn-primary" style="width:100%;margin-top:16px;" onclick="showJournalModal()">
      📖 Fyll i dagens dagbok
    </button>`;
}

function formatDateSv(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('sv-SE', { weekday:'short', day:'numeric', month:'short' });
}
