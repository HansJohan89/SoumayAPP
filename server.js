/**
 * Soumaya App — Server
 * Kör med vanlig HTTP (Railway sköter HTTPS externt)
 */

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const webpush  = require('web-push');
// Bilder sparas som base64 i JSON (Railway har ephemeral filsystem)
// const multer = require('multer'); // Inte längre använt

// ── VAPID ────────────────────────────────────────────────────
const VAPID_PUBLIC  = 'BN0ejLf_fZYlrgPZgnM-uMbwCLIsobrjrC_Zn98MJYnZXoXHQv2k9bsTc3hDzSF_ZD8xOYlN7wUrB9VJEj-6aZQ';
const VAPID_PRIVATE = 'J9zJ8etgMgEdnGG9deT1NZA94LjO9e_NDfKyDBJa5aI';
webpush.setVapidDetails('mailto:admin@soumaya.local', VAPID_PUBLIC, VAPID_PRIVATE);

// ── KONFIGURATION ─────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'invincible2024';
const PORT           = process.env.PORT || 3000;
const DATA_DIR       = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOADS_DIR    = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads/meals');

// Skapa mappar om de saknas
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── DATA-FILER ───────────────────────────────────────────────
const SUBS_FILE      = path.join(DATA_DIR, 'subscriptions.json');
const MEALS_FILE     = path.join(DATA_DIR, 'meals.json');
const WALKS_FILE     = path.join(DATA_DIR, 'walks.json');
const TASKS_FILE     = path.join(DATA_DIR, 'tasks.json');
const GLUCOSE_FILE   = path.join(DATA_DIR, 'glucose.json');
const APPROVALS_FILE = path.join(DATA_DIR, 'approvals.json');
const REWARDS_FILE   = path.join(DATA_DIR, 'rewards.json');
const SETTINGS_FILE  = path.join(DATA_DIR, 'notif_settings.json');
const SCHEDULED_FILE = path.join(DATA_DIR, 'scheduled_push.json');
const PLAYER_FILE    = path.join(DATA_DIR, 'player.json');
const MERGE_FILE     = path.join(DATA_DIR, 'merge.json');

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch(e) { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let subscriptions   = readJSON(SUBS_FILE, []);
let meals           = readJSON(MEALS_FILE, []);
let walks           = readJSON(WALKS_FILE, []);
let tasks           = readJSON(TASKS_FILE, []);
let glucoseLog      = readJSON(GLUCOSE_FILE, []);
let pendingApprovals = readJSON(APPROVALS_FILE, []);
let pendingRewards  = readJSON(REWARDS_FILE, []);

const DEFAULT_NOTIF_SETTINGS = {
  mealTimes: ['07:30','12:00','18:00'],   // Tider för matpåminnelse
  walkTime: '10:00',                       // Tid för promenadpåminnelse
  mealGraceMins: 60,    // Skicka inte om hon ätit inom X min
  walkGraceMins: 30,    // Skicka inte matnotis om hon promenerat inom X min
  skipWalkIfDoneToday: true,
  mealEnabled: true,
  walkEnabled: true,
};
const DEFAULT_PLAYER = {
  totalXP: 0,
  gold: 0,
  inventory: [],
  equipped: { weapon: null, armor: null, accessory: null, potion: null, rune: null },
  combatLog: [],
  lastFightDate: null,
  unlockedAchievements: [],
  appOpens: 0,
  settings: { lowTarget: 4.0, highTarget: 8.0 },
};
let player = readJSON(PLAYER_FILE, DEFAULT_PLAYER);

const BOARD_COLS = 7;
const BOARD_ROWS = 9;
const BOARD_SIZE = BOARD_COLS * BOARD_ROWS; // 63

// Merge-kedjor
const MERGE_CHAINS = {
  food:    ['🥦','🥗','🍱','🍜','🍣','🎂','👑'],
  walk:    ['👟','🏃','⚡','🌟','🏅','🏆','💎'],
  glucose: ['💧','🩸','💚','✨','🌈','🔮','🪄'],
  bird:    ['🪺','🐣','🐤','🐦','🦜','🦅','🦉'],
  basic:   ['🪨','🪵','🧱','⚗️','🌱','🌿','🍀','⭐'],
};
// Grundföremål som basic-maxen slumpas till
const BASIC_REWARDS = ['food','walk','glucose','bird'];

// Starta med en av varje grundvariant på brädet
function createDefaultBoard() {
  const board = Array(BOARD_SIZE).fill(null);
  // Spawner-raden (index 0-6) är alltid reserved för spawners i UI
  // Faktiska brädet börjar på rad 1 (index 7+)
  board[7]  = { type:'food',    level:0 };
  board[8]  = { type:'walk',    level:0 };
  board[9]  = { type:'glucose', level:0 };
  board[10] = { type:'bird',    level:0 };
  return board;
}

const DEFAULT_MERGE = {
  board: createDefaultBoard(),
  spawnerCharges: { food: 3, walk: 3, glucose: 3, bird: 3, basic: 50 },
  lastBasicRefill: 0,
  xpEarned: 0,
};
let mergeState = readJSON(MERGE_FILE, DEFAULT_MERGE);
// Migrera om board är gammal storlek
if (!mergeState.board || mergeState.board.length !== BOARD_SIZE) {
  mergeState = { ...DEFAULT_MERGE, board: createDefaultBoard() };
  writeJSON(MERGE_FILE, mergeState);
}

let notifSettings = readJSON(SETTINGS_FILE, DEFAULT_NOTIF_SETTINGS);
let scheduledPush = readJSON(SCHEDULED_FILE, []);

// ── MULTER ───────────────────────────────────────────────────
// Bildhjälpare — spara base64 data URLs direkt i meals/tasks JSON

// ── EXPRESS ──────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: 'text/plain', limit: '10mb' })); // xDrip text/plain
app.use(express.static(path.join(__dirname), {
  setHeaders(res, fp) {
    // Aldrig cacha HTML-filer
    if (fp.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    if (fp.endsWith('sw.js')) {
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Service-Worker-Allowed', '/');
    }
    if (fp.endsWith('manifest.json'))
      res.setHeader('Content-Type', 'application/manifest+json');
  }
}));
// /uploads middleware borttagen — bilder sparas som base64

// ── EXPLICIT HTML-ROUTES (ingen cache) ───────────────────────
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/admin', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ── AUTH ─────────────────────────────────────────────────────
// Stateless token: base64(timestamp) + "." + hmac
// Överlever server-restart utan att användaren behöver logga in igen
// Auth: token = HMAC(password, salt) — verifieras mot lösenordet, ingen server-state
const ADMIN_SALT = 'soumaya-admin-2024';
function makeToken() {
  return crypto.createHmac('sha256', ADMIN_SALT).update(ADMIN_PASSWORD).digest('hex');
}
function validToken(token) {
  if (!token) return false;
  return token === makeToken();
}

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (validToken(token)) return next();
  res.status(401).json({ error: 'Ej autentiserad' });
}

app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ ok: true, token: makeToken() });
  } else {
    res.status(401).json({ error: 'Fel lösenord' });
  }
});

app.post('/api/admin/logout', (req, res) => { res.json({ ok: true }); });

// ── VAPID ────────────────────────────────────────────────────
app.get('/api/vapid-public-key', (req, res) => res.json({ key: VAPID_PUBLIC }));

// ── PUSH-SUBSCRIPTIONS ───────────────────────────────────────
app.post('/api/subscribe', (req, res) => {
  const sub = req.body;
  if (!sub?.endpoint) return res.status(400).json({ error: 'Ogiltig' });
  if (!subscriptions.some(s => s.endpoint === sub.endpoint)) {
    subscriptions.push(sub);
    writeJSON(SUBS_FILE, subscriptions);
  }
  res.json({ ok: true });
});

app.post('/api/unsubscribe', (req, res) => {
  subscriptions = subscriptions.filter(s => s.endpoint !== req.body.endpoint);
  writeJSON(SUBS_FILE, subscriptions);
  res.json({ ok: true });
});

async function pushToAll(title, body, tag = 'general') {
  const payload = JSON.stringify({ title, body, tag });
  const dead = [];
  await Promise.allSettled(subscriptions.map(async sub => {
    try { await webpush.sendNotification(sub, payload); }
    catch(e) { if ([404,410].includes(e.statusCode)) dead.push(sub.endpoint); }
  }));
  if (dead.length) {
    subscriptions = subscriptions.filter(s => !dead.includes(s.endpoint));
    writeJSON(SUBS_FILE, subscriptions);
  }
}

app.post('/api/admin/push', adminAuth, async (req, res) => {
  const { title, body, tag } = req.body;
  await pushToAll(title, body, tag);
  res.json({ ok: true, to: subscriptions.length });
});

// ── MÅLTIDER ─────────────────────────────────────────────────
app.post('/api/meals/upload', express.json({ limit: '20mb' }), (req, res) => {
  const { mealId, phase, imageData } = req.body;
  if (!mealId || !['before','after'].includes(phase))
    return res.status(400).json({ error: 'Saknar mealId/phase' });
  if (!imageData) return res.status(400).json({ error: 'Ingen bildata' });

  // imageData är en base64 data URL
  let meal = meals.find(m => m.id === mealId);
  if (!meal) {
    meal = { id: mealId, createdAt: Date.now(), before: null, after: null, name: '', carbs: 0, mealType: '' };
    meals.unshift(meal);
  }
  meal[phase] = imageData;
  meal[phase + 'Time'] = Date.now();
  if (meal.before && meal.after) meal.complete = true;
  writeJSON(MEALS_FILE, meals);
  res.json({ ok: true, url: imageData.substring(0, 50) + '...', meal });
});

app.post('/api/meals', (req, res) => {
  const { id, name, carbs, mealType } = req.body;
  let meal = meals.find(m => m.id === id);
  if (!meal) {
    meal = { id: id || crypto.randomUUID(), createdAt: Date.now(), before: null, after: null, complete: false };
    meals.unshift(meal);
  }
  if (name)     meal.name     = name;
  if (carbs)    meal.carbs    = carbs;
  if (mealType) meal.mealType = mealType;
  writeJSON(MEALS_FILE, meals);
  res.json({ ok: true, meal });
});

// Publik — appen läser måltider
app.get('/api/meals', (req, res) => {
  const admin = req.headers['x-admin-token'];
  const isAdmin = admin && admin === require('crypto').createHmac('sha256','soumaya-admin-2024').update(process.env.ADMIN_PASSWORD||'invincible2024').digest('hex');
  // Admin får alla, appen får senaste 100
  res.json(isAdmin ? meals : meals.slice(-100));
});

// ── PROMENADER ───────────────────────────────────────────────
app.post('/api/walks/track', (req, res) => {
  const { walkId, coords } = req.body;
  if (!walkId) return res.status(400).json({ error: 'Saknar walkId' });
  let walk = walks.find(w => w.id === walkId);
  if (!walk) {
    walk = { id: walkId, startTime: Date.now(), coords: [], active: true, distance: 0, duration: 0 };
    walks.unshift(walk);
  }
  if (coords?.length) walk.coords.push(...coords);
  walk.distance = calcDistance(walk.coords);
  writeJSON(WALKS_FILE, walks);
  res.json({ ok: true });
});

app.post('/api/walks/finish', (req, res) => {
  const { walkId, minutes } = req.body;
  const walk = walks.find(w => w.id === walkId);
  if (walk) {
    walk.active   = false;
    walk.endTime  = Date.now();
    walk.duration = minutes || Math.round((walk.endTime - walk.startTime) / 60000);
    walk.distance = calcDistance(walk.coords);
    writeJSON(WALKS_FILE, walks);

    // Ladda merge-spawner: 3 per km (minst 1 om > 0.1km)
    const kmCharge = Math.max(walk.distance >= 0.1 ? 1 : 0, Math.floor(walk.distance));
    if (kmCharge > 0) chargeSpawner('walk', kmCharge * 3);

    // Auto-komplettera distance/minuter-uppgifter
    const today = new Date().toISOString().split('T')[0];
    const todayWalks = walks.filter(w =>
      !w.active && w.endTime && new Date(w.endTime).toISOString().split('T')[0] === today
    );
    const totalKmToday  = todayWalks.reduce((a,w) => a + (w.distance||0), 0);
    const totalMinToday = todayWalks.reduce((a,w) => a + (w.duration||0), 0);

    let autoCompleted = [];
    tasks.forEach(task => {
      if (!task.active) return;
      if (task.completions && task.completions[today]) return;
      if (task.completionType === 'distance' && task.targetDistance > 0) {
        if (totalKmToday >= task.targetDistance) {
          if (!task.completions) task.completions = {};
          task.completions[today] = { status: 'approved', auto: true };
          autoCompleted.push({ taskId: task.id, xpReward: task.xpReward||0, goldReward: task.goldReward||0, title: task.title });
        }
      }
      if (task.completionType === 'minutes' && task.targetMinutes > 0) {
        if (totalMinToday >= task.targetMinutes) {
          if (!task.completions) task.completions = {};
          task.completions[today] = { status: 'approved', auto: true };
          autoCompleted.push({ taskId: task.id, xpReward: task.xpReward||0, goldReward: task.goldReward||0, title: task.title });
        }
      }
    });

    if (autoCompleted.length > 0) {
      autoCompleted.forEach(ac => {
        pendingRewards.push({
          id: crypto.randomUUID(),
          type: 'task_auto',
          sourceId: ac.taskId,
          xpReward: ac.xpReward,
          goldReward: ac.goldReward,
          message: '🎉 ' + ac.title + ' klar!',
          createdAt: Date.now(),
          claimed: false,
        });
      });
      writeJSON(TASKS_FILE, tasks);
      writeJSON(REWARDS_FILE, pendingRewards);
    }
  }
  res.json({ ok: true, walk });
});

// Publik — appen läser promenader
app.get('/api/walks', (req, res) => {
  res.json(walks.filter(w => !w.active).slice(-50));
});
app.get('/api/walks/:id', (req, res) => {
  const w = walks.find(w => w.id === req.params.id);
  w ? res.json(w) : res.status(404).json({ error: 'Hittades ej' });
});

function calcDistance(coords) {
  if (!coords || coords.length < 2) return 0;
  let d = 0;
  for (let i = 1; i < coords.length; i++)
    d += haversine(coords[i-1].lat, coords[i-1].lng, coords[i].lat, coords[i].lng);
  return Math.round(d * 100) / 100;
}
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = rad(lat2-lat1), dLon = rad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function rad(d) { return d * Math.PI / 180; }

// ── GLUKOS ───────────────────────────────────────────────────

// ── xDRIP+ REST API UPLOAD ────────────────────────────────────
// Rotadress i xDrip: https://invincible2024@soumayapp-production.up.railway.app/api/v1/
// xDrip skickar api-secret som SHA1-hash av lösenordet i headern

function xdripAuth(req, res, next) {
  // xDrip skickar api-secret = SHA1(lösenord) som header
  const secret = req.headers['api-secret'];
  if (secret) {
    const expected = crypto.createHash('sha1').update(ADMIN_PASSWORD).digest('hex');
    if (secret.toLowerCase() === expected.toLowerCase()) return next();
  }
  // Tillåt även utan auth (för enkel testning och bakåtkompatibilitet)
  // entries-data är inte känslig
  return next();
}

// xDrip GET entries (behövs för att xDrip ska verifiera anslutningen)
// Stöd både med och utan .json (xDrip använder .json, GlucoDataHandler utan)
app.get(['/api/v1/entries', '/api/v1/entries.json'], xdripAuth, (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const recent = glucoseLog.filter(g => g.source === 'xdrip').slice(-count);
  // Returnera i Nightscout-format
  res.json(recent.map(g => ({
    sgv: Math.round(g.val * 18),
    date: g.time,
    dateString: new Date(g.time).toISOString(),
    direction: g.direction || 'Flat',
    type: 'sgv',
  })));
});

app.post(['/api/v1/entries', '/api/v1/entries.json'], xdripAuth, (req, res) => {
  try {
    // Logga för debug
    console.log('xDrip POST /api/v1/entries.json headers:', JSON.stringify(req.headers));
    console.log('xDrip body type:', typeof req.body, 'body:', JSON.stringify(req.body)?.slice(0, 200));

    // xDrip kan skicka JSON-sträng istället för parsed JSON
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) {}
    }
    // xDrip skickar antingen en array eller ett objekt
    const entries = Array.isArray(body) ? body : [body];
    let added = 0;

    entries.forEach(entry => {
      // sgv = blood glucose i mg/dL
      const sgv = entry.sgv || entry.glucose;
      if (!sgv) return;

      const mmol = Math.round(sgv / 18 * 10) / 10;  // mg/dL → mmol/L
      const ts   = entry.date || entry.dateString ? new Date(entry.dateString || entry.date).getTime() : Date.now();
      const dir  = entry.direction || entry.trend || '';

      // Kolla om vi redan har detta värde (undvik dubletter)
      const exists = glucoseLog.some(g => Math.abs(g.time - ts) < 30000);
      if (exists) return;

      const newEntry = {
        val: mmol,
        source: 'xdrip',
        time: ts,
        direction: dir,
        raw: sgv,
      };
      glucoseLog.push(newEntry);
      added++;
    });

    if (added > 0) {
      // Sortera och trimma
      glucoseLog.sort((a, b) => a.time - b.time);
      if (glucoseLog.length > 500) glucoseLog = glucoseLog.slice(-500);
      writeJSON(GLUCOSE_FILE, glucoseLog);

      // Auto-komplettera TIR-uppgifter
      const LOW = 4.0, HIGH = 8.0;
      const today = new Date().toISOString().split('T')[0];
      const todayStart = new Date(today).getTime();
      const todayGlucose = glucoseLog.filter(g => g.time >= todayStart);
      let tirMinutes = 0;
      for (let i = 1; i < todayGlucose.length; i++) {
        const prev = todayGlucose[i-1], curr = todayGlucose[i];
        const mins = (curr.time - prev.time) / 60000;
        if (mins < 120 && prev.val >= LOW && prev.val <= HIGH) tirMinutes += mins;
      }
      tasks.forEach(task => {
        if (!task.active) return;
        if (task.completions && task.completions[today]) return;
        if (task.completionType === 'glucose_tir' && task.targetTIR > 0 && tirMinutes >= task.targetTIR) {
          if (!task.completions) task.completions = {};
          task.completions[today] = { status: 'approved', auto: true, tirMinutes: Math.round(tirMinutes) };
          pendingRewards.push({
            id: crypto.randomUUID(), type: 'task_auto', sourceId: task.id,
            xpReward: task.xpReward||0, goldReward: task.goldReward||0,
            message: '🩸 ' + task.title + ' klar! ' + Math.round(tirMinutes) + ' min i målzonen.',
            createdAt: Date.now(), claimed: false,
          });
          writeJSON(TASKS_FILE, tasks);
          writeJSON(REWARDS_FILE, pendingRewards);
        }
      });

      // Kolla varningar för lågt/högt
      const latest = glucoseLog[glucoseLog.length - 1];
      if (latest && latest.source === 'xdrip') {
        const s = notifSettings;
        const low  = s.glucoseLow  || 4.0;
        const high = s.glucoseHigh || 10.0;
        if (latest.val < low) {
          pushToAll('⚠️ LÅGT BLODSOCKER!', latest.val.toFixed(1) + ' mmol/L — ät något NU!', 'glucose-low');
        } else if (latest.val > high) {
          pushToAll('⚠️ Högt blodsocker', latest.val.toFixed(1) + ' mmol/L', 'glucose-high');
        }
      }

      console.log('xDrip: ' + added + ' nya värden, senaste: ' + (glucoseLog[glucoseLog.length-1]?.val || '?') + ' mmol/L');
    }

    // xDrip förväntar sig 200 OK med entries tillbaka
    res.status(200).json(entries);
  } catch(e) {
    console.error('xDrip upload error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Nightscout-kompatibel status-endpoint (xDrip kollar denna)

// GlucoDataHandler hämtar treatments (måltider/insulin) — returnera tom array
app.get(['/api/v1/treatments', '/api/v1/treatments.json'], (req, res) => {
  res.json([]);
});

app.get(['/api/v1/status', '/api/v1/status.json'], (req, res) => {
  console.log('xDrip GET /api/v1/status.json headers:', JSON.stringify(req.headers));
  res.json({
    status: 'ok',
    name: 'Soumaya',
    version: '14.2.1', // Nightscout-kompatibel version
    apiEnabled: true,
    careportalEnabled: false,
    settings: {
      units: 'mmol',
      timeFormat: 24,
      nightMode: false,
      showRawbg: 'never',
      customTitle: 'Soumaya',
      theme: 'default',
      alarmUrgentHigh: true,
      alarmHigh: true,
      alarmLow: true,
      alarmUrgentLow: true,
      alarmUrgentHighMins: [30,60,90,120],
      alarmHighMins: [30,60,90,120],
      alarmLowMins: [15,30,45,60],
      alarmUrgentLowMins: [15,30,45],
      alarmTimeagoWarn: true,
      alarmTimeagoWarnMins: 15,
      alarmTimeagoUrgent: true,
      alarmTimeagoUrgentMins: 30,
      enable: ['careportal'],
      alarmTypes: ['predict'],
    },
    extendedSettings: {},
    authorized: null,
  });
});

app.post('/api/glucose', (req, res) => {
  const { val, source, time } = req.body;
  if (!val) return res.status(400).json({ error: 'Saknar val' });
  const entry = { val, source: source || 'manual', time: time || Date.now() };
  glucoseLog.push(entry);
  if (glucoseLog.length > 500) glucoseLog.shift();
  writeJSON(GLUCOSE_FILE, glucoseLog);

  // Auto-komplettera TIR (Time In Range) uppgifter
  const LOW = 4.0; const HIGH = 8.0;
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today).getTime();
  const todayGlucose = glucoseLog.filter(g => g.time >= todayStart);

  // Beräkna minuter i målzonen idag
  let tirMinutes = 0;
  for (let i = 1; i < todayGlucose.length; i++) {
    const prev = todayGlucose[i-1], curr = todayGlucose[i];
    const mins = (curr.time - prev.time) / 60000;
    if (mins < 120 && prev.val >= LOW && prev.val <= HIGH) tirMinutes += mins;
  }

  tasks.forEach(task => {
    if (!task.active) return;
    if (task.completions && task.completions[today]) return;
    if (task.completionType === 'glucose_tir' && task.targetTIR > 0) {
      if (tirMinutes >= task.targetTIR) {
        if (!task.completions) task.completions = {};
        task.completions[today] = { status: 'approved', auto: true, tirMinutes: Math.round(tirMinutes) };
        pendingRewards.push({
          id: crypto.randomUUID(),
          type: 'task_auto',
          sourceId: task.id,
          xpReward: task.xpReward || 0,
          goldReward: task.goldReward || 0,
          message: '🩸 ' + task.title + ' klar! ' + Math.round(tirMinutes) + ' min i målzonen.',
          createdAt: Date.now(),
          claimed: false,
        });
        writeJSON(TASKS_FILE, tasks);
        writeJSON(REWARDS_FILE, pendingRewards);
      }
    }
  });

  res.json({ ok: true });
});

// Publik endpoint för appen — returnerar senaste mätningar
app.get('/api/glucose/latest', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 48, 288); // max 24h à 5min
  const data = glucoseLog.slice(-count);
  res.setHeader('Cache-Control', 'no-store');
  res.json(data);
});

// Admin-endpoint med full historik
app.get('/api/glucose', adminAuth, (req, res) => {
  res.json(glucoseLog.slice(-(parseInt(req.query.count) || 200)));
});

// ── UPPGIFTER ─────────────────────────────────────────────────
app.get('/api/tasks', (req, res) => {
  // Beräkna progress för data-kopplade uppgifter
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today).getTime();
  const todayWalks = walks.filter(w =>
    !w.active && w.endTime && new Date(w.endTime).toISOString().split('T')[0] === today
  );
  const totalKmToday  = todayWalks.reduce((a,w) => a + (w.distance||0), 0);
  const totalMinToday = todayWalks.reduce((a,w) => a + (w.duration||0), 0);

  // TIR idag
  const todayGlucose = glucoseLog.filter(g => g.time >= todayStart);
  let tirMinutes = 0;
  const LOW = 4.0, HIGH = 8.0;
  for (let i = 1; i < todayGlucose.length; i++) {
    const prev = todayGlucose[i-1], curr = todayGlucose[i];
    const mins = (curr.time - prev.time) / 60000;
    if (mins < 120 && prev.val >= LOW && prev.val <= HIGH) tirMinutes += mins;
  }

  const enriched = tasks.map(t => ({
    ...t,
    progress: {
      km: totalKmToday,
      minutes: totalMinToday,
      tirMinutes: Math.round(tirMinutes),
    }
  }));
  res.json(enriched);
});

app.post('/api/tasks', adminAuth, (req, res) => {
  const b = req.body;
  const task = {
    id: crypto.randomUUID(),
    title: b.title,
    description: b.description || '',
    type: b.type || 'daily',            // daily | weekly | once
    reward: b.reward || '',
    xpReward: parseInt(b.xpReward) || 0,
    goldReward: parseInt(b.goldReward) || 0,
    requirePhotos: b.requirePhotos === true || b.requirePhotos === 'true',
    photoCount: parseInt(b.photoCount) || 1,
    icon: b.icon || '⭐',
    difficulty: b.difficulty || 'normal',
    // Koppling till data
    completionType: b.completionType || 'manual', // manual | distance | glucose_tir | combo
    targetDistance: parseFloat(b.targetDistance) || 0,  // km
    targetMinutes:  parseInt(b.targetMinutes)  || 0,    // promenadminuter
    targetTIR:      parseInt(b.targetTIR)      || 0,    // minuter i målzonen
    targetMeals:    parseInt(b.targetMeals)    || 0,    // antal måltider
    active: true,
    completions: {},   // { 'YYYY-MM-DD': { status, approvalId } }
    createdAt: Date.now()
  };
  tasks.push(task);
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true, task });
});

app.put('/api/tasks/:id', adminAuth, (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Hittades ej' });
  Object.assign(task, req.body);
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true, task });
});

// Markera uppgift som slutförd — om foton krävs → pending approval
app.post('/api/tasks/:id/complete', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Hittades ej' });
  const today = new Date().toISOString().split('T')[0];
  if (!task.completions) task.completions = {};

  // Kräver foto-godkännande?
  if (task.requirePhotos) {
    const approvalId = crypto.randomUUID();
    pendingApprovals.push({
      id: approvalId,
      type: 'task',
      taskId: task.id,
      taskTitle: task.title,
      taskIcon: task.icon || '⭐',
      xpReward: task.xpReward || 0,
      goldReward: task.goldReward || 0,
      photoUrls: req.body.photoUrls || [],
      submittedAt: Date.now(),
      status: 'pending',
      date: today,
    });
    task.completions[today] = { status: 'pending', approvalId };
    writeJSON(TASKS_FILE, tasks);
    writeJSON(APPROVALS_FILE, pendingApprovals);
    return res.json({ ok: true, status: 'pending', approvalId, message: 'Väntar på admin-godkännande' });
  }

  // Direkt komplettering
  task.completions[today] = { status: 'approved' };
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true, status: 'approved', xpReward: task.xpReward || 0, goldReward: task.goldReward || 0 });
});

// Hämta pending rewards för spelaren
app.get('/api/rewards', (req, res) => {
  res.json(pendingRewards);
});

// Hämta pending approvals (admin)
app.get('/api/admin/approvals', adminAuth, (req, res) => {
  res.json(pendingApprovals.filter(a => a.status === 'pending'));
});

// Godkänn eller avvisa (admin)
app.post('/api/admin/approvals/:id', adminAuth, (req, res) => {
  const approval = pendingApprovals.find(a => a.id === req.params.id);
  if (!approval) return res.status(404).json({ error: 'Hittades ej' });

  const { action } = req.body; // 'approve' | 'reject'
  approval.status = action === 'approve' ? 'approved' : 'rejected';
  approval.decidedAt = Date.now();
  approval.adminNote = req.body.note || '';

  if (action === 'approve') {
    // Kolla om det är fågeluppgiften → ladda bird-spawner
    if (approval.taskTitle && approval.taskTitle.toLowerCase().includes('fågel')) {
      chargeSpawner('bird', 3);
    }
    // Lägg belöning i pending rewards för appen att hämta
    pendingRewards.push({
      id: crypto.randomUUID(),
      type: approval.type,
      sourceId: approval.taskId || approval.mealId,
      xpReward: approval.xpReward || 0,
      goldReward: approval.goldReward || 0,
      message: approval.adminNote || approval.taskTitle || 'Godkänt! 🎉',
      createdAt: Date.now(),
      claimed: false,
    });

    // Uppdatera task-completion till approved
    if (approval.taskId) {
      const task = tasks.find(t => t.id === approval.taskId);
      if (task && task.completions && task.completions[approval.date]) {
        task.completions[approval.date] = { status: 'approved' };
        writeJSON(TASKS_FILE, tasks);
      }
    }

    // Uppdatera meal till approved
    if (approval.mealId) {
      const meal = meals.find(m => m.id === approval.mealId);
      if (meal) {
        meal.approvalStatus = 'approved';
        writeJSON(MEALS_FILE, meals);
      }
    }
  } else {
    // Avvisad — rensa completion så hon kan försöka igen
    if (approval.taskId) {
      const task = tasks.find(t => t.id === approval.taskId);
      if (task && task.completions) {
        delete task.completions[approval.date];
        writeJSON(TASKS_FILE, tasks);
      }
    }
  }

  writeJSON(APPROVALS_FILE, pendingApprovals);
  writeJSON(REWARDS_FILE, pendingRewards);
  res.json({ ok: true, status: approval.status });
});

// Hämta och rensa claimed rewards
app.post('/api/rewards/claim', (req, res) => {
  const unclaimed = pendingRewards.filter(r => !r.claimed);
  pendingRewards.forEach(r => r.claimed = true);
  writeJSON(REWARDS_FILE, pendingRewards);
  res.json({ rewards: unclaimed });
});

app.delete('/api/tasks/:id', adminAuth, (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true });
});



// ── SPELARPROFIL ──────────────────────────────────────────────
app.get('/api/player', (req, res) => {
  res.json(player);
});

app.post('/api/player', (req, res) => {
  const allowed = ['totalXP','gold','inventory','equipped','combatLog','lastFightDate','unlockedAchievements','appOpens','settings'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) player[key] = req.body[key];
  });
  writeJSON(PLAYER_FILE, player);
  res.json({ ok: true });
});


// ── MERGE-SPEL ────────────────────────────────────────────────

// Hämta merge-state
app.get('/api/merge', (req, res) => {
  res.json({ ...mergeState, chains: MERGE_CHAINS, boardCols: BOARD_COLS, boardRows: BOARD_ROWS });
});

// Spara hela brädet (efter drag/merge i UI)
app.post('/api/merge/board', (req, res) => {
  if (Array.isArray(req.body.board)) {
    mergeState.board = req.body.board;
    writeJSON(MERGE_FILE, mergeState);
  }
  res.json({ ok: true });
});

// Spawna ett föremål
app.post('/api/merge/spawn', (req, res) => {
  const { type } = req.body;
  if (!MERGE_CHAINS[type]) return res.status(400).json({ error: 'Okänd typ' });
  if ((mergeState.spawnerCharges[type] || 0) < 1)
    return res.status(400).json({ error: 'Inga laddningar kvar' });

  // Hitta ALLA lediga celler (hoppa över rad 0 = spawner-rad) och välj en slumpmässigt
  const freeCells = [];
  for (let i = BOARD_COLS; i < mergeState.board.length; i++) {
    if (!mergeState.board[i]) freeCells.push(i);
  }
  if (freeCells.length === 0) return res.status(400).json({ error: 'Brädet är fullt' });

  const spawnedIdx = freeCells[Math.floor(Math.random() * freeCells.length)];
  mergeState.board[spawnedIdx] = { type, level: 0 };
  mergeState.spawnerCharges[type]--;
  writeJSON(MERGE_FILE, mergeState);
  res.json({ ok: true, board: mergeState.board, spawnerCharges: mergeState.spawnerCharges, spawnedIdx });
});

// Merge-endpoint: hantera basic max-nivå → slumpa grundföremål
app.post('/api/merge/convert', (req, res) => {
  const { idx } = req.body;
  const cell = mergeState.board[idx];
  if (!cell || cell.type !== 'basic' || cell.level !== MERGE_CHAINS.basic.length - 1)
    return res.status(400).json({ error: 'Inte ett max basic-föremål' });
  // Slumpa ett av fyra grundföremål
  const rewardType = BASIC_REWARDS[Math.floor(Math.random() * BASIC_REWARDS.length)];
  mergeState.board[idx] = { type: rewardType, level: 0 };
  writeJSON(MERGE_FILE, mergeState);
  res.json({ ok: true, board: mergeState.board, rewardType, emoji: MERGE_CHAINS[rewardType][0] });
});

// Ge XP för merge (anropas från klienten efter lyckad merge)
app.post('/api/merge/xp', (req, res) => {
  const { xp } = req.body;
  if (xp > 0) {
    player.totalXP = (player.totalXP || 0) + xp;
    player.gold    = (player.gold || 0) + Math.floor(xp / 10);
    writeJSON(PLAYER_FILE, player);
    mergeState.xpEarned = (mergeState.xpEarned || 0) + xp;
    writeJSON(MERGE_FILE, mergeState);
  }
  res.json({ ok: true, totalXP: player.totalXP, gold: player.gold });
});

// Ladda spawner (anropas internt från servern — men även manuellt för test)
function chargeSpawner(type, amount) {
  mergeState.spawnerCharges[type] = (mergeState.spawnerCharges[type] || 0) + amount;
  writeJSON(MERGE_FILE, mergeState);
  console.log('Merge spawner:', type, '+' + amount, '→', mergeState.spawnerCharges[type]);
}

// ── EXPORT / IMPORT ──────────────────────────────────────────
app.get('/api/admin/export', adminAuth, (req, res) => {
  const exportData = {
    version: 4,
    exportedAt: new Date().toISOString(),
    meals,
    walks,
    tasks,
    glucoseLog,
    pendingApprovals,
    pendingRewards,
    subscriptions,
    notifSettings,
    scheduledPush,
    player,
    mergeState,
  };
  res.setHeader('Content-Disposition', 'attachment; filename="soumaya-backup-' + new Date().toISOString().split('T')[0] + '.json"');
  res.setHeader('Content-Type', 'application/json');
  res.json(exportData);
});

app.post('/api/admin/import', adminAuth, (req, res) => {
  try {
    const d = req.body;
    if (!d || !d.version) return res.status(400).json({ error: 'Ogiltig backup-fil' });
    if (d.meals)            { meals = d.meals;                       writeJSON(MEALS_FILE, meals); }
    if (d.walks)            { walks = d.walks;                       writeJSON(WALKS_FILE, walks); }
    if (d.tasks)            { tasks = d.tasks;                       writeJSON(TASKS_FILE, tasks); }
    if (d.glucoseLog)       { glucoseLog = d.glucoseLog;             writeJSON(GLUCOSE_FILE, glucoseLog); }
    if (d.pendingApprovals) { pendingApprovals = d.pendingApprovals; writeJSON(APPROVALS_FILE, pendingApprovals); }
    if (d.pendingRewards)   { pendingRewards = d.pendingRewards;     writeJSON(REWARDS_FILE, pendingRewards); }
    if (d.notifSettings)    { notifSettings = d.notifSettings;       writeJSON(SETTINGS_FILE, notifSettings); }
    if (d.scheduledPush)    { scheduledPush = d.scheduledPush;       writeJSON(SCHEDULED_FILE, scheduledPush); }
    if (d.player)           { player = { ...DEFAULT_PLAYER, ...d.player }; writeJSON(PLAYER_FILE, player); }
    if (d.mergeState)       { mergeState = { ...DEFAULT_MERGE, ...d.mergeState }; writeJSON(MERGE_FILE, mergeState); }
    res.json({ ok: true, message: 'Import klar', counts: {
      meals: meals.length, walks: walks.length, tasks: tasks.length,
      glucose: glucoseLog.length, approvals: pendingApprovals.length,
    }});
  } catch(e) {
    res.status(500).json({ error: 'Import misslyckades: ' + e.message });
  }
});


// ── UPPGIFTSFOTON ────────────────────────────────────────────
// Ladda upp ett foto till en specifik uppgift
app.post('/api/tasks/:id/photos', express.json({ limit: '20mb' }), (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Uppgift hittades ej' });

  const today = new Date().toISOString().split('T')[0];
  if (!task.photoSubmissions) task.photoSubmissions = {};
  if (!task.photoSubmissions[today]) task.photoSubmissions[today] = [];

  const imageData = req.body.imageData || req.body.url;
  if (!imageData) return res.status(400).json({ error: 'Ingen bildata' });

  task.photoSubmissions[today].push({
    url: imageData,
    uploadedAt: Date.now(),
  });

  const submitted = task.photoSubmissions[today].length;
  const required = task.photoCount || 1;

  // Om alla foton är uppladdade → skapa pending approval automatiskt
  if (submitted >= required) {
    // Kolla om det redan finns en pending approval för idag
    const existing = pendingApprovals.find(a =>
      a.taskId === task.id && a.date === today && a.status === 'pending'
    );
    if (!existing) {
      const approvalId = crypto.randomUUID();
      pendingApprovals.push({
        id: approvalId,
        type: 'task',
        taskId: task.id,
        taskTitle: task.title,
        taskIcon: task.icon || '⭐',
        xpReward: task.xpReward || 0,
        goldReward: task.goldReward || 0,
        photoUrls: task.photoSubmissions[today].map(p => p.url),
        submittedAt: Date.now(),
        status: 'pending',
        date: today,
      });
      if (!task.completions) task.completions = {};
      task.completions[today] = { status: 'pending', approvalId };
      writeJSON(APPROVALS_FILE, pendingApprovals);
    }
  }

  writeJSON(TASKS_FILE, tasks);
  res.json({
    ok: true,
    submitted,
    required,
    complete: submitted >= required,
    photos: task.photoSubmissions[today],
  });
});

// Hämta foton för en uppgift idag
app.get('/api/tasks/:id/photos', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Uppgift hittades ej' });
  const today = new Date().toISOString().split('T')[0];
  const photos = (task.photoSubmissions && task.photoSubmissions[today]) || [];
  const required = task.photoCount || 1;
  const comp = task.completions && task.completions[today];
  res.json({
    photos,
    submitted: photos.length,
    required,
    complete: photos.length >= required,
    status: comp ? (comp.status || 'approved') : 'none',
  });
});

// ── ADMIN DASHBOARD ──────────────────────────────────────────
app.get('/api/admin/dashboard', adminAuth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => new Date(m.createdAt).toISOString().split('T')[0] === today);
  const todayWalks = walks.filter(w => new Date(w.startTime).toISOString().split('T')[0] === today);
  const lastGlucose = glucoseLog[glucoseLog.length - 1] || null;

  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const s = d.toISOString().split('T')[0];
    const hm = meals.some(m => new Date(m.createdAt).toISOString().split('T')[0] === s && m.complete);
    const hw = walks.some(w => new Date(w.startTime).toISOString().split('T')[0] === s);
    if (hm && hw) { streak++; d.setDate(d.getDate()-1); } else break;
  }

  res.json({
    // Totaler för stat-korten
    meals:       meals.length,
    walks:       walks.length,
    glucose:     glucoseLog.length,
    subscribers: subscriptions.length,
    // Dagens statistik
    today: {
      meals:    todayMeals.length,
      mealsOk:  todayMeals.filter(m => m.complete).length,
      walkMins: todayWalks.reduce((a,w) => a+(w.duration||0), 0),
      walkKm:   todayWalks.reduce((a,w) => a+(w.distance||0), 0).toFixed(1),
    },
    streak,
    lastGlucose,
    glucoseHistory: glucoseLog.slice(-24),
    recentMeals:    meals.slice(0, 5),
    recentWalks:    walks.slice(0, 5),
    tasks,
    achievements:   player.unlockedAchievements || [],
  });
});

// ── ADMIN HTML ───────────────────────────────────────────────
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));


// ── NOTIS-INSTÄLLNINGAR ───────────────────────────────────────
app.get('/api/admin/notif-settings', adminAuth, (req, res) => {
  res.json(notifSettings);
});

app.post('/api/admin/notif-settings', adminAuth, (req, res) => {
  notifSettings = { ...DEFAULT_NOTIF_SETTINGS, ...req.body };
  writeJSON(SETTINGS_FILE, notifSettings);
  res.json({ ok: true, notifSettings });
});

// ── SCHEMALAGDA CUSTOM-NOTISER ────────────────────────────────
app.get('/api/admin/scheduled-push', adminAuth, (req, res) => {
  res.json(scheduledPush);
});

app.post('/api/admin/scheduled-push', adminAuth, (req, res) => {
  const { title, body, time, repeat, date } = req.body;
  if (!title || !body || !time) return res.status(400).json({ error: 'Saknar title/body/time' });
  const item = {
    id: crypto.randomUUID(),
    title,
    body,
    time,           // "HH:MM"
    repeat,         // 'daily' | 'once'
    date: date || null,  // för once: 'YYYY-MM-DD'
    active: true,
    lastSent: null,
    createdAt: Date.now(),
  };
  scheduledPush.push(item);
  writeJSON(SCHEDULED_FILE, scheduledPush);
  res.json({ ok: true, item });
});

app.delete('/api/admin/scheduled-push/:id', adminAuth, (req, res) => {
  scheduledPush = scheduledPush.filter(s => s.id !== req.params.id);
  writeJSON(SCHEDULED_FILE, scheduledPush);
  res.json({ ok: true });
});

app.put('/api/admin/scheduled-push/:id', adminAuth, (req, res) => {
  const item = scheduledPush.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Hittades ej' });
  Object.assign(item, req.body);
  writeJSON(SCHEDULED_FILE, scheduledPush);
  res.json({ ok: true, item });
});

// ── SCHEMALAGDA PÅMINNELSER ──────────────────────────────────
function nowHHMM() {
  const d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function todayStr2() { return new Date().toISOString().split('T')[0]; }
function minsSince(ts) { return ts ? (Date.now() - ts) / 60000 : Infinity; }

// Kör varje minut
setInterval(async () => {
  const hm = nowHHMM();
  const today = todayStr2();
  const now = Date.now();

  // ── Senaste aktivitet ──────────────────────────────────────
  const todayMeals = meals.filter(m => {
    const d = new Date(m.createdAt || 0).toISOString().split('T')[0];
    return d === today;
  });
  const lastMealTs = todayMeals.length
    ? Math.max(...todayMeals.map(m => m.createdAt || 0)) : 0;

  const todayWalks = walks.filter(w => {
    const d = new Date(w.startTime || 0).toISOString().split('T')[0];
    return d === today && !w.active;
  });
  const lastWalkTs = todayWalks.length
    ? Math.max(...todayWalks.map(w => w.endTime || 0)) : 0;
  const walkedToday = todayWalks.length > 0;

  const s = notifSettings;

  // ── Matpåminnelse ──────────────────────────────────────────
  if (s.mealEnabled && (s.mealTimes || []).includes(hm)) {
    const minsSinceMeal = minsSince(lastMealTs);
    const minsSinceWalk = minsSince(lastWalkTs);
    let skip = false;
    if (minsSinceMeal < (s.mealGraceMins || 60)) skip = true;
    if (!skip && s.walkGraceMins > 0 && minsSinceWalk < s.walkGraceMins) skip = true;
    if (!skip) {
      await pushToAll('Dags att äta! 🐸', '*stirrar intensivt* ...mat?', 'food');
      console.log('Push: matpåminnelse', hm);
    } else {
      console.log('Skip matpåminnelse', hm, '— ätit:', Math.round(minsSinceMeal), 'min sedan, promenad:', Math.round(minsSinceWalk), 'min sedan');
    }
  }

  // ── Promenadpåminnelse ─────────────────────────────────────
  if (s.walkEnabled && hm === (s.walkTime || '10:00')) {
    if (s.skipWalkIfDoneToday && walkedToday) {
      console.log('Skip promenadpåminnelse — redan promenerat idag');
    } else {
      await pushToAll('Dags för promenad! 💪', 'Allen väntar på dig!', 'walk');
      console.log('Push: promenadpåminnelse', hm);
    }
  }

  // ── Schemalagda custom-notiser ─────────────────────────────
  for (const item of scheduledPush) {
    if (!item.active) continue;
    if (item.time !== hm) continue;
    if (item.repeat === 'once') {
      const targetDate = item.date || today;
      if (targetDate !== today) continue;
      if (item.lastSent) continue; // redan skickad
    }
    if (item.repeat === 'daily' && item.lastSent) {
      const lastSentDay = new Date(item.lastSent).toISOString().split('T')[0];
      if (lastSentDay === today) continue; // redan skickad idag
    }
    await pushToAll(item.title, item.body, 'custom');
    item.lastSent = now;
    console.log('Push: schemalagd', item.title, hm);
  }
  writeJSON(SCHEDULED_FILE, scheduledPush);

}, 60*1000); // var 60:e sekund

// Basic-spawner: fyll på 50 var timme
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  if (now - (mergeState.lastBasicRefill || 0) >= oneHour) {
    mergeState.spawnerCharges.basic = 50;
    mergeState.lastBasicRefill = now;
    writeJSON(MERGE_FILE, mergeState);
    console.log('Basic-spawner fylld på: 50 laddningar');
  }
}, 60 * 1000);

// ── STARTA ───────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Soumaya kör på port ${PORT}`);
  console.log(`🔐 Admin: /admin\n`);
});
