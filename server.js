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
// Gratis nyckel: https://www.trafiklab.se/api/our-apis/resrobot-v21/
// Sätts som miljövariabel på Railway — annars funkar allt utom
// hållplatssökningen i Tavlan-sidan.
const RESROBOT_API_KEY = process.env.RESROBOT_API_KEY || '';

// Google Calendar — enanvändar-upplägg (ingen inloggningsflöde i appen).
// Skapa OAuth-klient (typ "Desktop app") i Google Cloud Console, hämta
// EN refresh token en gång manuellt (se README), spara som miljövariabler.
const { google } = require('googleapis');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}
const PORT           = process.env.PORT || 3000;
// Var datan sparas. På Railway nollställs appens egna filer vid VARJE ny
// version — därför används en Railway Volume (beständig disk) när en sådan
// är kopplad: Railway sätter då RAILWAY_VOLUME_MOUNT_PATH själv
// (https://docs.railway.com/volumes). DATA_DIR/UPLOADS_DIR går före om de satts.
const VOLUME_DIR     = process.env.RAILWAY_VOLUME_MOUNT_PATH || '';
const DATA_DIR       = process.env.DATA_DIR || (VOLUME_DIR ? path.join(VOLUME_DIR, 'data') : path.join(__dirname, 'data'));
const UPLOADS_DIR    = process.env.UPLOADS_DIR || (VOLUME_DIR ? path.join(VOLUME_DIR, 'uploads/meals') : path.join(__dirname, 'uploads/meals'));
const STORAGE_PERSISTENT = !!(VOLUME_DIR || process.env.DATA_DIR);

// Skapa mappar om de saknas
[DATA_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
// Första starten med en ny, tom volym: flytta över det som finns i appens
// egen datamapp (finns bara kvar om servern inte startats om sedan dess).
if (VOLUME_DIR) {
  const oldData = path.join(__dirname, 'data');
  try {
    if (oldData !== DATA_DIR && fs.existsSync(oldData) && !fs.readdirSync(DATA_DIR).length) {
      for (const f of fs.readdirSync(oldData)) fs.copyFileSync(path.join(oldData, f), path.join(DATA_DIR, f));
      console.log(`[lagring] Flyttade ${fs.readdirSync(DATA_DIR).length} filer till volymen`);
    }
  } catch (e) { console.log('[lagring] Kunde inte flytta gamla data:', e.message); }
}
console.log(`[lagring] Data sparas i ${DATA_DIR} — ${STORAGE_PERSISTENT ? 'beständig (överlever nya versioner)' : 'INTE beständig: koppla en Volume i Railway'}`);

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
const JOURNAL_FILE   = path.join(DATA_DIR, 'journal.json');
const BOARD_FILE     = path.join(DATA_DIR, 'board.json');

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
  extraFights: 0,   // Bonus-strider från promenader
  unlockedAchievements: [],
  appOpens: 0,
  settings: { lowTarget: 4.0, highTarget: 8.0 },
};
let player  = readJSON(PLAYER_FILE, DEFAULT_PLAYER);
let journal = readJSON(JOURNAL_FILE, []);

// ── TAVLAN (e-ink dashboard) ────────────────────────────────────
const DEFAULT_BOARD = {
  showGlucose: true,
  showWeather: true,
  showBus: true,
  showSpotify: false,
  // Fri lista, valfritt antal rutter. Lokaltrafik-knappen på macropaden
  // visar ALLA här. Hemskärmen visar bara den som pekas ut av
  // homeStopIndex (default 0 = första i listan) som en snabb koll.
  busDestinations: [
    { label: 'Stockholm C', stopId: '', directionFilter: '' },
  ],
  homeStopIndex: 0,
  refreshMinutes: 15,
  spotifyDevice: 'Vardagsrum',
  googlePhotosAlbumUrl: '',    // gammalt enkel-fält, kvar för bakåtkompatibilitet
  googlePhotosAlbumUrls: [],   // nytt: flera album samtidigt
  activeImageId: null,   // null = visa dashboarden, annars visas denna bild istället
  images: [],            // [{ id, name, data (base64), addedAt }]
};
// Senast Pi:n faktiskt hörde av sig (uppdateras av /api/board/command/poll,
// som bara den fysiska/simulerade Pi-processen anropar — ALDRIG webbläsaren).
// Används för att visa en RIKTIG anslutningsstatus i appen istället för att
// bara anta "Ansluten" varje gång sidan öppnas och GET /api/board lyckas.
let lastPiSeenAt = null;
// Senaste bilden som faktiskt visades på den fysiska/simulerade tavlan
// (skickas av display.py::push_to_display efter varje riktig uppdatering).
// Ren in-memory — byts ut hela tiden, ingen anledning att spara till disk
// eller committa till boardState/BOARD_FILE.
let currentViewData = { mode: null, image: null, updatedAt: null };
let boardState = readJSON(BOARD_FILE, DEFAULT_BOARD);
let pendingCommand = null; // fjärrkommando från appens simulerade macropad, konsumeras av Pi:n


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
app.use(express.json({ limit: '100mb' }));
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


// ── PERIOD-HJÄLPARE ───────────────────────────────────────────
function weekStart() {
  const d = new Date();
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - d.getDay() + (d.getDay()===0?-6:1)); // Måndag
  return d.getTime();
}

function getWalksForPeriod(type) {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  const weekMs = weekStart();
  return walks.filter(w => {
    if (w.active || !w.endTime) return false;
    if (type === 'daily') return new Date(w.endTime).toISOString().split('T')[0] === today;
    if (type === 'weekly') return w.endTime >= weekMs;
    return false;
  });
}

function getGlucoseForPeriod(type) {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  const weekMs = weekStart();
  return glucoseLog.filter(g => {
    if (type === 'daily') return new Date(g.time).toISOString().split('T')[0] === today;
    if (type === 'weekly') return g.time >= weekMs;
    return false;
  });
}

function calcTIR(glucoseEntries) {
  const LOW = 4.0, HIGH = 8.0;
  let mins = 0;
  const sorted = [...glucoseEntries].sort((a,b) => a.time - b.time);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i-1], curr = sorted[i];
    const gap = (curr.time - prev.time) / 60000;
    if (gap < 120 && prev.val >= LOW && prev.val <= HIGH) mins += gap;
  }
  return mins;
}

function calcKm(walkList) { return walkList.reduce((a,w) => a+(w.distance||0), 0); }
function calcMin(walkList) { return walkList.reduce((a,w) => a+(w.duration||0), 0); }

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
  const { walkId, minutes, type } = req.body;
  const walk = walks.find(w => w.id === walkId);
  if (walk) {
    walk.active   = false;
    walk.endTime  = Date.now();
    walk.duration = minutes || Math.round((walk.endTime - walk.startTime) / 60000);
    // Använd distans från appen (mer korrekt — GPS räknat i realtid)
    // Faller tillbaka på calcDistance från coords om ej skickat
    const clientDistance = parseFloat(req.body.distance);
    walk.distance = (!isNaN(clientDistance) && clientDistance > 0)
      ? Math.round(clientDistance * 100) / 100
      : calcDistance(walk.coords);
    if (type) walk.type = type;
    writeJSON(WALKS_FILE, walks);

    // Ladda merge-spawner: 3 per km (minst 1 om > 0.1km)
    const kmCharge = Math.max(walk.distance >= 0.1 ? 1 : 0, Math.floor(walk.distance));
    if (kmCharge > 0) chargeSpawner('walk', kmCharge * 3);

    // Extra strider: +1 per km promenerad
    const fightBonus = Math.floor(walk.distance);
    if (fightBonus > 0) {
      player.extraFights = (player.extraFights || 0) + fightBonus;
      writeJSON(PLAYER_FILE, player);
      console.log('Extra strider:', fightBonus, '→ totalt:', player.extraFights);
    }

    // Auto-komplettera distance/minuter-uppgifter (daily och weekly)
    const today = new Date().toISOString().split('T')[0];
    let autoCompleted = [];
    tasks.forEach(task => {
      if (!task.active) return;
      // Kolla rätt period för uppgiften
      const period = task.type === 'weekly' ? 'weekly' : 'daily';
      const periodKey = period === 'weekly' ? 'week-' + weekStart() : today;
      if (task.completions && task.completions[periodKey]) return;
      const periodWalks = getWalksForPeriod(period);
      const totalKm  = calcKm(periodWalks);
      const totalMin = calcMin(periodWalks);
      if (task.completionType === 'distance' && task.targetDistance > 0 && totalKm >= task.targetDistance) {
        if (!task.completions) task.completions = {};
        task.completions[periodKey] = { status: 'approved', auto: true };
        autoCompleted.push({ taskId: task.id, xpReward: task.xpReward||0, goldReward: task.goldReward||0, title: task.title });
      }
      if (task.completionType === 'minutes' && task.targetMinutes > 0 && totalMin >= task.targetMinutes) {
        if (!task.completions) task.completions = {};
        task.completions[periodKey] = { status: 'approved', auto: true };
        autoCompleted.push({ taskId: task.id, xpReward: task.xpReward||0, goldReward: task.goldReward||0, title: task.title });
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
  // glucoseLog är sorterad äldst→nyast (se sort() vid POST), men riktiga
  // Nightscout-API:er (och vår egen Pi-kod) förväntar sig nyast FÖRST —
  // reverse() här, annars visar dashboarden ett gammalt värde som "senaste".
  const recent = glucoseLog.filter(g => g.source === 'xdrip').slice(-count).reverse();
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

    // Komprimera: behåll senaste 3h fullt, äldre = bara tid+värde+status
    const cutoff3h = Date.now() - 3 * 60 * 60 * 1000;
    glucoseLog = glucoseLog.map(g => {
      if (g.time >= cutoff3h) return g; // senaste 3h — orörd
      const low = 4.0, high = 8.0;
      return {
        time: g.time,
        val: Math.round(g.val * 10) / 10,
        status: g.val < low ? 'low' : g.val > high ? 'high' : 'in',
        source: g.source || 'xdrip',
      };
    });

    // Max 2000 mätningar totalt
    if (glucoseLog.length > 2000) glucoseLog = glucoseLog.slice(-2000);
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

// xDrip laddar upp behandlingar hit om "Ladda upp behandlingar" är på i
// dess Nightscout-inställningar. Bara SENSORSTARTEN sparas (för tavlans
// påminnelse om sensorbyte) — resten tas emot och slängs. De senaste
// typerna sparas också, så man kan se vad xDrip faktiskt skickar:
// GET /api/board/sensor.
app.post(['/api/v1/treatments', '/api/v1/treatments.json'], xdripAuth, (req, res) => {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) {} }
  const list = Array.isArray(body) ? body : [body];
  if (!Array.isArray(boardState.treatmentTypesSeen)) boardState.treatmentTypesSeen = [];
  let changed = false;
  for (const t of list) {
    if (!t || typeof t !== 'object') continue;
    const type = String(t.eventType || '').slice(0, 40);
    const ms = Number(t.mills) || Date.parse(t.created_at || t.timestamp || '') || Number(t.date) || Date.now();
    boardState.treatmentTypesSeen.unshift({ type, at: ms, receivedAt: Date.now() });
    if (/sensor\s*(start|change)/i.test(type) && ms > Date.now() - 60 * 86400000 && ms < Date.now() + 3600000) {
      if (!boardState.sensor || ms > boardState.sensor.startedAt) {
        boardState.sensor = { startedAt: ms, source: 'xdrip' };
        changed = true;
        console.log(`[sensor] Sensorstart från xDrip: ${new Date(ms).toISOString()}`);
      }
    }
  }
  boardState.treatmentTypesSeen = boardState.treatmentTypesSeen.slice(0, 20);
  if (changed) bumpConfig(); else writeJSON(BOARD_FILE, boardState);
  res.status(200).json(list);
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
  // Progress beräknas per period (daily/weekly) för varje uppgift
  const enriched = tasks.map(t => {
    const period = t.type === 'weekly' ? 'weekly' : 'daily';
    const today  = new Date().toISOString().split('T')[0];
    const periodWalks   = getWalksForPeriod(period);
    const periodGlucose = getGlucoseForPeriod(period);
    const periodRuns    = walks.filter(w => {
      if (w.active || !w.endTime || w.type !== 'run') return false;
      if (period === 'daily') return new Date(w.endTime).toISOString().split('T')[0] === today;
      return w.endTime >= weekStart();
    });
    return {
      ...t,
      progress: {
        km:         calcKm(periodWalks),
        minutes:    calcMin(periodWalks),
        tirMinutes: Math.round(calcTIR(periodGlucose)),
        runCount:    periodRuns.length,
        runKm:       periodRuns.reduce((a,w)=>a+(w.distance||0),0),
        period,
      }
    };
  });
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

    // Uppdatera meal och rensa bilder oavsett beslut
    if (approval.mealId) {
      const meal = meals.find(m => m.id === approval.mealId);
      if (meal) {
        meal.approvalStatus = action;
        meal.photoRemoved = true;
        ['before','after','beforeImage','afterImage'].forEach(k => delete meal[k]);
        writeJSON(MEALS_FILE, meals);
      }
    }
    // Rensa foton från task-submissions direkt vid beslut
    if (approval.taskId) {
      const task = tasks.find(t => t.id === approval.taskId);
      if (task && task.photoSubmissions) {
        // Ta bort alla bilddata men behåll submission-strukturen
        Object.keys(task.photoSubmissions).forEach(day => {
          task.photoSubmissions[day] = (task.photoSubmissions[day]||[]).map(p => ({
            uploadedAt: p.uploadedAt,
            url: null,  // bilddata raderad
          }));
        });
        writeJSON(TASKS_FILE, tasks);
      }
    }
  } else {
    // Avvisad — rensa completion och bilder så hon kan försöka igen
    if (approval.taskId) {
      const task = tasks.find(t => t.id === approval.taskId);
      if (task) {
        if (task.completions) delete task.completions[approval.date];
        // Ta bort inskickade foton för denna dag
        if (task.photoSubmissions && task.photoSubmissions[approval.date]) {
          delete task.photoSubmissions[approval.date];
        }
        writeJSON(TASKS_FILE, tasks);
      }
    }
    if (approval.mealId) {
      const meal = meals.find(m => m.id === approval.mealId);
      if (meal) {
        meal.approvalStatus = 'rejected';
        delete meal.before; delete meal.after;
        delete meal.beforeImage; delete meal.afterImage;
        writeJSON(MEALS_FILE, meals);
      }
    }
  }

  // Ta bort bilderna från approval-objektet (de är nu onödiga)
  approval.photoUrls = [];

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
  const allowed = ['totalXP','gold','inventory','equipped','combatLog','lastFightDate','extraFights','unlockedAchievements','appOpens','settings'];
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


// ── DAGBOK / MÅENDE ───────────────────────────────────────────
app.get('/api/journal', (req, res) => {
  res.json(journal.slice(-90)); // senaste 90 dagarna
});

app.post('/api/journal', (req, res) => {
  const { date, mood, note, energy, stress } = req.body;
  if (!date || !mood) return res.status(400).json({ error: 'Saknar date/mood' });
  // Ta bort eventuell gammal post för samma dag
  const idx = journal.findIndex(j => j.date === date);
  const entry = {
    date, mood: parseInt(mood), note: note||'',
    energy: parseInt(energy)||mood,
    stress: parseInt(stress)||3,
    createdAt: Date.now(),
  };
  if (idx >= 0) journal[idx] = entry;
  else journal.push(entry);
  journal.sort((a,b) => a.date.localeCompare(b.date));
  writeJSON(JOURNAL_FILE, journal);
  res.json({ ok: true, entry });
});

// Journal i export
// ── TAVLAN (e-ink dashboard) ───────────────────────────────────
// Publikt (samma app Soumaya redan är inloggad i, ingen adminAuth)

// Hämta inställningar + bildlista (UTAN base64-data, bara metadata —
// annars blir svaret enormt varje gång appen öppnar sidan)
// Visar om datan överlever nya versioner (Railway Volume kopplad?)
app.get('/api/storage', (req, res) => res.json({ persistent: STORAGE_PERSISTENT, dataDir: DATA_DIR }));

app.get('/api/board', (req, res) => {
  const { images, pin, alarmTest, music: _music, calendarIcs, radioStats: _rs, playlistStats: _ps, podStats: _pds, spotifyAuth: _sa, photoListing: _pl, ...settings } = boardState;
  res.json({
    ...settings,
    timers: activeTimers(),
    calendarSet: !!calendarIcs,             // själva länken är hemlig och lämnar aldrig servern
    hasPin: !!pin,
    images: images.map(({ id, name, addedAt }) => ({ id, name, addedAt })),
    lastPiSeenAt, // null om Pi:n aldrig hörts av — appen använder detta för statusen
    piStatus, piStatusAt,
  });
});

// Spara inställningar (toggles, bussdestinationer, intervall, Spotify-enhet)
app.post('/api/board', requirePin, (req, res) => {
  const allowed = ['showGlucose', 'showWeather', 'showBus', 'showSpotify', 'busDestinations', 'homeStopIndex', 'refreshMinutes', 'spotifyDevice', 'googlePhotosAlbumUrl', 'googlePhotosAlbumUrls'];
  allowed.forEach(key => {
    if (req.body[key] !== undefined) boardState[key] = req.body[key];
  });
  touchBoard();
  res.json({ ok: true });
});

// Sök hållplats via ResRobot — så Soumaya kan välja rätt hållplats
// direkt i appen istället för att Mikael manuellt letar upp stop-id.
app.get('/api/board/bus-stops/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Saknar sökterm (?q=...)' });
  if (!RESROBOT_API_KEY) return res.status(400).json({ error: 'RESROBOT_API_KEY är inte konfigurerad på servern' });

  try {
    const url = `https://api.resrobot.se/v2.1/location.name?input=${encodeURIComponent(query)}&format=json&accessId=${RESROBOT_API_KEY}`;
    const resrobotRes = await fetch(url);
    if (!resrobotRes.ok) return res.status(502).json({ error: 'ResRobot svarade med fel' });
    const data = await resrobotRes.json();
    const stops = (data.stopLocationOrCoordLocation || [])
      .filter(s => s.StopLocation)
      .map(s => ({ name: s.StopLocation.name, id: s.StopLocation.extId }));
    res.json({ stops });
  } catch (e) {
    res.status(502).json({ error: 'Kunde inte nå ResRobot: ' + e.message });
  }
});

// Ladda upp en ny bild (base64 data URL, samma mönster som måltidsfoton)
app.post('/api/board/image', requirePin, (req, res) => {
  const { name, imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'Ingen bilddata' });
  const image = {
    id: crypto.randomUUID(),
    name: name || 'Namnlös bild',
    data: imageData,
    addedAt: Date.now(),
  };
  boardState.images.unshift(image);
  touchBoard();
  res.json({ ok: true, image: { id: image.id, name: image.name, addedAt: image.addedAt } });
});

// Hämta EN bild i fullstorlek (Pi:n hämtar bara den aktiva, inte alla)
app.get('/api/board/image/:id', (req, res) => {
  const image = boardState.images.find(i => i.id === req.params.id);
  if (!image) return res.status(404).json({ error: 'Bilden finns inte' });
  res.json(image);
});

// Samma bild, men som RÅ bilddata (rätt Content-Type) istället för
// JSON — för <img src="..."> i appens galleri. Separat endpoint så vi
// INTE ändrar formatet på endpointen ovan, som Pi:n redan förlitar sig
// på (fetchers/board.py::fetch_board_image förväntar sig JSON).
app.get('/api/board/image/:id/raw', (req, res) => {
  const image = boardState.images.find(i => i.id === req.params.id);
  if (!image) return res.status(404).send('Bilden finns inte');
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(image.data || '');
  if (!match) return res.status(500).send('Kunde inte tolka bilddata');
  const [, mimeType, base64] = match;
  res.set('Content-Type', mimeType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(base64, 'base64'));
});

// Ta bort en bild
app.delete('/api/board/image/:id', requirePin, (req, res) => {
  boardState.images = boardState.images.filter(i => i.id !== req.params.id);
  if (boardState.activeImageId === req.params.id) boardState.activeImageId = null;
  touchBoard();
  res.json({ ok: true });
});

// Välj vilken bild som ska visas på tavlan (eller null = tillbaka till dashboarden)
app.post('/api/board/select', requirePin, (req, res) => {
  const { imageId } = req.body;
  if (imageId !== null && !boardState.images.some(i => i.id === imageId))
    return res.status(400).json({ error: 'Okänd bild' });
  boardState.activeImageId = imageId;
  touchBoard();
  res.json({ ok: true, activeImageId: boardState.activeImageId });
});

// Simulerad macropad i appen — lägger en knapptryckning i kö
app.post('/api/board/command', (req, res) => {
  const { action, view, destination, direction, button, params } = req.body;
  if (!action) return res.status(400).json({ error: 'Saknar action' });
  const btn = Number.isInteger(button) && button >= 1 && button <= 5 ? button : null;
  // params: Musik-fliken (radio, spellista, volym …) — tavlan kontrollerar själv
  const p = params && typeof params === 'object' && !Array.isArray(params) && JSON.stringify(params).length < 6000 ? params : null;
  pendingCommand = { action, view: view || null, destination: destination || null, direction: direction || null, button: btn, params: p, ts: Date.now() };
  res.json({ ok: true });
});

// Pi:n pollar den här och plockar (och tömmer) kön — POST för att signalera
// att det är en side-effect (konsumerar kommandot), inte en ren hämtning.
// Detta är den ENDA endpointen bara den fysiska Pi-processen anropar
// (webbläsaren/appen anropar den aldrig), så den är rätt plats att
// registrera "Pi:n är faktiskt igång och pratar med servern" på.
app.post('/api/board/command/poll', (req, res) => {
  lastPiSeenAt = Date.now();
  const cmd = pendingCommand;
  pendingCommand = null;
  res.json({ command: cmd });
});

// Pi:n rapporterar hit efter varje RIKTIG skärmuppdatering (se
// display.py::push_to_display) — så /tavla-sidan kan visa en live-
// förhandsvisning utan att man behöver stå framför den fysiska skärmen.
// Räknas INTE som ett Pi-livstecken separat — command/poll (var 3:e sek
// när igång) är redan ett mycket tätare heartbeat än detta (bara vid
// faktiska skärmuppdateringar, kan vara minuter mellan).
app.post('/api/board/current-view', (req, res) => {
  const { mode, image } = req.body;
  if (!image) return res.status(400).json({ error: 'Ingen bild skickades' });
  currentViewData = { mode: mode || null, image, updatedAt: Date.now() };
  res.json({ ok: true });
});

app.get('/api/board/current-view', (req, res) => {
  res.json(currentViewData);
});

// ═══════════════════════════════════════════════════════════════
// TAVLAN: PIN, INSTÄLLNINGAR, ALARM, SYNK MED TAVLAN
// ═══════════════════════════════════════════════════════════════
// Allt som ÄNDRAR tavlan kräver en fyrsiffrig PIN (header X-Tavla-Pin).
// Läsning, den simulerade macropaden och tavlans egna anrop gör det inte.
//
// Inställningarna: tavlan (settings.py) skickar sitt schema hit — vilka
// inställningar som finns, standardvärden och tillåtna intervall — och
// appen bygger sin sida av det. Här sparas bara det Soumaya ÄNDRAT
// (boardState.settings); tavlan lägger det ovanpå sina standardvärden
// och kontrollerar varje värde igen innan det används.
//
// Tavlan frågar /api/board/pi-sync var 5:e sekund med sin version —
// ändrats något (configVersion) får den allt nytt i svaret.

if (typeof boardState.configVersion !== 'number') boardState.configVersion = 1;
if (!boardState.settings) boardState.settings = {};
if (!Array.isArray(boardState.alarms)) boardState.alarms = [];
if (!Array.isArray(boardState.timers)) boardState.timers = [];
if (!Array.isArray(boardState.radioFavs)) boardState.radioFavs = [];
if (!boardState.radioStats || typeof boardState.radioStats !== 'object') boardState.radioStats = {};
if (!boardState.playlistStats || typeof boardState.playlistStats !== 'object') boardState.playlistStats = {};
if (!boardState.podStats || typeof boardState.podStats !== 'object') boardState.podStats = {};
if (!boardState.photoEdits || typeof boardState.photoEdits !== 'object') boardState.photoEdits = {};   // nyckel -> { z, fx, fy, fit, hidden, pair }
if (!boardState.photoDims || typeof boardState.photoDims !== 'object') boardState.photoDims = {};     // nyckel -> [bredd, höjd]
if (typeof boardState.photoAutoPair !== 'boolean') boardState.photoAutoPair = true;
// Ny fotobehandling (2026-10-24): fotonas reglage börjar om på de rekommenderade
// värdena (tavlans standard: ljushet 0, kontrast 0 %, mättnad 15 %, Mjukt) — en gång
if (!boardState.photoTuneReset4) {          // (4: ny grundbehandling, reglagen utgår från 0)
  boardState.settings = boardState.settings || {};
  for (const k of ['photoBrightness', 'photoContrast', 'photoSaturation', 'photoDither']) delete boardState.settings[k];
  if (boardState.settingTitles) for (const k of ['photoBrightness', 'photoContrast', 'photoSaturation', 'photoDither']) delete boardState.settingTitles[k];
  boardState.photoTuneReset4 = true;
  boardState.configVersion = (boardState.configVersion || 0) + 1;
  writeJSON(BOARD_FILE, boardState);
}
let piStatus = null, piStatusAt = null;

function bumpConfig() {
  boardState.configVersion += 1;
  writeJSON(BOARD_FILE, boardState);
}
function touchBoard() {          // bussar, bilder, visningsval — tavlan ritar om
  boardState.boardChangedAt = Date.now();
  bumpConfig();
}

// ── PIN ──
const PIN_MAX_TRIES = 5, PIN_LOCK_MS = 10 * 60 * 1000;
const pinFails = new Map();      // ip -> { count, until }
function pinHash(pin, salt) { return crypto.createHash('sha256').update(`${salt}:${pin}`).digest('hex'); }
function clientIp(req) { return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?'; }
function pinMatches(pin) {
  if (!boardState.pin || !/^\d{4}$/.test(pin)) return false;
  const a = Buffer.from(pinHash(pin, boardState.pin.salt)), b = Buffer.from(boardState.pin.hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function requirePin(req, res, next) {
  if (!boardState.pin) return res.status(428).json({ error: 'Välj en PIN-kod först', needPinSetup: true });
  const ip = clientIp(req), now = Date.now();
  const f = pinFails.get(ip);
  if (f && f.until > now) {
    return res.status(429).json({ error: `För många fel — försök igen om ${Math.ceil((f.until - now) / 60000)} min`, lockedUntil: f.until });
  }
  if (pinMatches(String(req.headers['x-tavla-pin'] || ''))) { pinFails.delete(ip); return next(); }
  const count = (f && f.until && f.until <= now) ? 1 : ((f ? f.count : 0) + 1);
  pinFails.set(ip, { count, until: count >= PIN_MAX_TRIES ? now + PIN_LOCK_MS : 0 });
  const left = Math.max(0, PIN_MAX_TRIES - count);
  res.status(401).json({ error: left ? `Fel PIN (${left} försök kvar)` : 'Fel PIN — spärrad i 10 minuter', wrongPin: true, triesLeft: left });
}
function setPin(pin) {
  const salt = crypto.randomBytes(16).toString('hex');
  boardState.pin = { salt, hash: pinHash(pin, salt), setAt: Date.now() };
  writeJSON(BOARD_FILE, boardState);
}

app.get('/api/board/pin', (req, res) => res.json({ hasPin: !!boardState.pin }));

app.post('/api/board/pin/setup', (req, res) => {
  if (boardState.pin) return res.status(409).json({ error: 'Det finns redan en PIN' });
  const pin = String(req.body.pin || '');
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'PIN ska vara fyra siffror' });
  setPin(pin);
  res.json({ ok: true });
});

app.post('/api/board/pin/check', requirePin, (req, res) => res.json({ ok: true }));

app.post('/api/board/pin/change', requirePin, (req, res) => {
  const pin = String(req.body.newPin || '');
  if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'PIN ska vara fyra siffror' });
  setPin(pin);
  res.json({ ok: true });
});

// Glömd PIN: kräver adminlösenordet (appen loggar in via /api/admin/login)
app.post('/api/board/pin/reset', adminAuth, (req, res) => {
  delete boardState.pin;
  pinFails.clear();
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true });
});

// ── Spotify-länkar ──
// Godtar open.spotify.com-länkar, spotify:-URI:er och korta delningslänkar
// (spotify.link), som följs hit. Sparas alltid som
// https://open.spotify.com/<typ>/<id> — det formatet tavlan spelar.
const SPOTIFY_RE = /^https?:\/\/(?:open|play)\.spotify\.com\/(?:intl-[a-z]{2}(?:-[a-z]{2})?\/)?(track|playlist|album)\/([A-Za-z0-9]{10,40})/;
async function resolveSpotify(input, kinds) {
  let v = String(input || '').trim();
  if (!v) return { url: '' };
  const uri = /^spotify:(track|playlist|album):([A-Za-z0-9]{10,40})$/.exec(v);
  if (uri) v = `https://open.spotify.com/${uri[1]}/${uri[2]}`;
  for (let hop = 0; hop < 4 && !SPOTIFY_RE.test(v); hop++) {
    let host;
    try { host = new URL(v).hostname; } catch (e) { break; }
    if (!/(^|\.)spotify\.link$|(^|\.)app\.link$/.test(host)) break;
    try {
      const r = await fetch(v, { redirect: 'manual', signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'Mozilla/5.0' } });
      const loc = r.headers.get('location');
      if (loc) { v = new URL(loc, v).toString(); continue; }
      const m = /https:\/\/open\.spotify\.com\/(track|playlist|album)\/[A-Za-z0-9]{10,40}/.exec(await r.text());
      if (m) v = m[0]; else break;
    } catch (e) { break; }
  }
  const m = SPOTIFY_RE.exec(v);
  if (!m) return { error: 'Det ser inte ut som en Spotify-länk. I Spotify: Dela -> Kopiera länk.' };
  if (!kinds.includes(m[1])) return { error: `Länken måste vara till en ${kinds.map(k => ({ track: 'låt', playlist: 'spellista', album: 'skiva' }[k])).join('/')}` };
  const url = `https://open.spotify.com/${m[1]}/${m[2]}`;
  let title = '';
  try {
    const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(4000) });
    if (r.ok) title = String((await r.json()).title || '').slice(0, 80);
  } catch (e) { /* namnet är bara en bonus */ }
  return { url, kind: m[1], title };
}

// ── Inställningar ──
function schemaItems() {
  const out = {};
  ((boardState.settingsSchema || {}).groups || []).forEach(g => (g.items || []).forEach(it => { out[it.key] = it; }));
  return out;
}
async function cleanSetting(item, value) {
  if (!item) return { error: 'Okänd inställning' };
  switch (item.type) {
    case 'bool': return typeof value === 'boolean' ? { value } : { error: 'Ska vara på/av' };
    case 'int': case 'float': {
      const n = Number(value);
      if (typeof value === 'boolean' || value === '' || !Number.isFinite(n)) return { error: 'Ska vara ett tal' };
      let v = Math.min(item.max, Math.max(item.min, n));
      if (item.type === 'int') v = Math.round(v);
      return { value: v };
    }
    case 'select': return (item.options || []).some(o => o.value === value) ? { value } : { error: 'Ogiltigt val' };
    case 'spotify': {
      const r = await resolveSpotify(value, item.kinds || ['track', 'playlist', 'album']);
      return r.error ? r : { value: r.url, title: r.title };
    }
    case 'str': return typeof value === 'string' ? { value: value.slice(0, 300) } : { error: 'Ska vara text' };
  }
  return { error: 'Okänd typ' };
}

// { key: värde } sparar, { key: null } återställer till tavlans standard
app.put('/api/board/settings', requirePin, async (req, res) => {
  const items = schemaItems();
  const changes = req.body || {};
  const errors = {};
  const titles = boardState.settingTitles || {};
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) { delete boardState.settings[key]; delete titles[key]; continue; }
    const r = await cleanSetting(items[key], value);
    if (r.error) { errors[key] = r.error; continue; }
    boardState.settings[key] = r.value;
    if (r.title !== undefined) titles[key] = r.title;
  }
  boardState.settingTitles = titles;
  bumpConfig();
  res.status(Object.keys(errors).length ? 400 : 200).json({ ok: !Object.keys(errors).length, errors, settings: boardState.settings, settingTitles: titles });
});

app.delete('/api/board/settings', requirePin, (req, res) => {
  boardState.settings = {};
  boardState.settingTitles = {};
  bumpConfig();
  res.json({ ok: true, settings: {} });
});

// ── Musikbibliotek (offentliga Spotify-spellistor) ──
// Soumaya lägger till offentliga spellistor (länk, en gång). Servern läser
// Spotifys öppna inbäddningssida (namn, omslag, låtlista) och oEmbed
// (låtomslag, artistbilder) — ingen inloggning eller utvecklarapp behövs
// (Spotifys Web API med tavlans klient-id gav 429, och egna appar kräver
// Premium + kan bara läsa spellistor man äger, se chatten 2026-10-09).
// Låtarna indexeras från spellistorna; favoriter (hjärta) för båda.
// Läses om en gång per dygn så att nya låtar kommer med.
const MUSIC_MAX_PLAYLISTS = 40;
const PLAYLIST_TRACK_MAX = 150;
const SPOTIFY_ID = /^[A-Za-z0-9]{22}$/;
function musicLib() {
  if (!boardState.music || typeof boardState.music !== 'object') boardState.music = {};
  const M = boardState.music;
  if (!M.playlists) M.playlists = {};
  if (!M.tracks) M.tracks = {};
  if (!M.artists) M.artists = {};
  return M;
}
let musicSaveTimer = null;
function saveMusicSoon() {                 // samlar många små ändringar (bildhämtning) till en skrivning
  clearTimeout(musicSaveTimer);
  musicSaveTimer = setTimeout(() => writeJSON(BOARD_FILE, boardState), 1500);
}
async function spotifyEmbedEntity(kind, id) {
  const r = await fetch(`https://open.spotify.com/embed/${kind}/${id}`, {
    signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'sv,en' } });
  if (!r.ok) throw new Error(`Spotify svarade ${r.status}`);
  const m = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(await r.text());
  if (!m) throw new Error('Spotify-sidan såg inte ut som väntat');
  const e = (((((JSON.parse(m[1]) || {}).props || {}).pageProps || {}).state || {}).data || {}).entity;
  if (!e) throw new Error('Hittade inget innehåll — är spellistan offentlig?');
  return e;
}
async function spotifyThumb(kind, id) {
  try {
    const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/${kind}/${id}`)}`,
      { signal: AbortSignal.timeout(6000) });
    return r.ok ? String((await r.json()).thumbnail_url || '') : '';
  } catch (e) { return ''; }
}
async function inPool(items, n, fn) {
  const queue = items.slice();
  await Promise.all(Array.from({ length: Math.min(n, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}
async function indexPlaylist(id) {
  const e = await spotifyEmbedEntity('playlist', id);
  const M = musicLib();
  const old = M.playlists[id] || {};
  const trackIds = [];
  for (const t of (Array.isArray(e.trackList) ? e.trackList : []).slice(0, PLAYLIST_TRACK_MAX)) {
    const tm = /^spotify:track:([A-Za-z0-9]{22})$/.exec(String(t.uri || ''));
    if (!tm || trackIds.includes(tm[1])) continue;
    trackIds.push(tm[1]);
    const prev = M.tracks[tm[1]] || {};
    M.tracks[tm[1]] = { ...prev, id: tm[1], title: String(t.title || '').slice(0, 120), artist: String(t.subtitle || '').slice(0, 120), fav: !!prev.fav };
  }
  if (!trackIds.length) throw new Error('Spellistan är tom eller inte offentlig');
  M.playlists[id] = {
    id, fav: !!old.fav, addedAt: old.addedAt || Date.now(), indexedAt: Date.now(),
    title: String(e.name || e.title || 'Spellista').slice(0, 120),
    cover: ((((e.coverArt || {}).sources || [])[0]) || {}).url || old.cover || '',
    artistImages: old.artistImages || [], trackIds,
  };
  saveMusicSoon();
  fillMusicImages(id).catch(err => console.log('[musik] bilder:', err.message));
  return M.playlists[id];
}
// Låtomslag + "samlad bild av artisterna" (fyra olika artister) — i bakgrunden.
async function fillMusicImages(id) {
  const M = musicLib();
  const pl = M.playlists[id];
  if (!pl) return;
  await inPool(pl.trackIds.filter(t => !(M.tracks[t] || {}).cover), 4, async tid => {
    const c = await spotifyThumb('track', tid);
    if (c && M.tracks[tid]) { M.tracks[tid].cover = c; saveMusicSoon(); }
  });
  const artistIds = [];
  for (const tid of pl.trackIds) {
    if (artistIds.length >= 4) break;
    const t = M.tracks[tid];
    if (!t) continue;
    if (!t.artistId) {
      try {
        const te = await spotifyEmbedEntity('track', tid);
        const a = ((te.artists || [])[0] || {}).uri || '';
        t.artistId = (/^spotify:artist:([A-Za-z0-9]{22})$/.exec(a) || [])[1] || '';
      } catch (e) { t.artistId = ''; }
    }
    if (t.artistId && !artistIds.includes(t.artistId)) artistIds.push(t.artistId);
  }
  const imgs = [];
  for (const aid of artistIds) {
    if (!M.artists[aid]) M.artists[aid] = await spotifyThumb('artist', aid);
    if (M.artists[aid]) imgs.push(M.artists[aid]);
  }
  if (M.playlists[id]) { M.playlists[id].artistImages = imgs; saveMusicSoon(); }
}
function musicPayload() {
  const M = musicLib();
  const used = new Set();
  Object.values(M.playlists).forEach(p => p.trackIds.forEach(t => used.add(t)));
  ((M.liked || {}).trackIds || []).forEach(t => used.add(t));
  const tracks = {};
  for (const [tid, t] of Object.entries(M.tracks)) if (used.has(tid) || t.fav) tracks[tid] = t;
  return { playlists: Object.values(M.playlists), tracks, liked: M.liked || null };
}
function dropUnusedTracks() {
  const M = musicLib();
  const used = new Set();
  Object.values(M.playlists).forEach(p => p.trackIds.forEach(t => used.add(t)));
  ((M.liked || {}).trackIds || []).forEach(t => used.add(t));
  for (const tid of Object.keys(M.tracks)) if (!used.has(tid) && !M.tracks[tid].fav) delete M.tracks[tid];
}

app.get('/api/board/music', (req, res) => res.json(musicPayload()));

app.post('/api/board/music/playlists', requirePin, async (req, res) => {
  const sp = await resolveSpotify(req.body.url, ['playlist']);
  if (sp.error) return res.status(400).json({ error: sp.error });
  if (!sp.url) return res.status(400).json({ error: 'Klistra in en länk till en spellista' });
  const id = sp.url.split('/').pop();
  const M = musicLib();
  if (!M.playlists[id] && Object.keys(M.playlists).length >= MUSIC_MAX_PLAYLISTS) {
    return res.status(400).json({ error: `Högst ${MUSIC_MAX_PLAYLISTS} spellistor` });
  }
  try {
    const pl = await indexPlaylist(id);
    res.json({ ok: true, playlist: pl, ...musicPayload() });
  } catch (e) {
    res.status(400).json({ error: `Kunde inte läsa spellistan: ${e.message}` });
  }
});

app.delete('/api/board/music/playlists/:id', requirePin, (req, res) => {
  const M = musicLib();
  delete M.playlists[req.params.id];
  dropUnusedTracks();
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true, ...musicPayload() });
});

app.post('/api/board/music/fav', requirePin, (req, res) => {
  const { kind, id, fav } = req.body || {};
  const M = musicLib();
  const item = kind === 'playlist' ? M.playlists[id] : kind === 'track' ? M.tracks[id] : null;
  if (!item) return res.status(404).json({ error: 'Finns inte i biblioteket' });
  item.fav = !!fav;
  if (!item.fav && kind === 'track') dropUnusedTracks();
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true });
});

// Läs om spellistorna en gång per dygn (nya låtar, ändrade namn).
setInterval(async () => {
  const M = musicLib();
  for (const pl of Object.values(M.playlists)) {
    if (Date.now() - (pl.indexedAt || 0) < 24 * 3600 * 1000) continue;
    if (pl.source === 'spotify' && pl.owned) continue;      // hennes egna: läses via Spotify-kopplingen (spotifySync)
    try { await indexPlaylist(pl.id); dropUnusedTracks(); }
    catch (e) { pl.error = e.message; pl.indexedAt = Date.now(); saveMusicSoon(); console.log(`[musik] ${pl.id}: ${e.message}`); }
  }
}, 60 * 60 * 1000);

// Vad ett alarm ska spela, när det valts ur biblioteket:
//   spellista -> spellistan i shuffle
//   låt       -> låten, sedan resten av dess spellista i slumpad ordning
function alarmMusic(music) {
  if (!music || typeof music !== 'object') return null;
  const M = musicLib();
  if (music.kind === 'playlist') {
    const pl = SPOTIFY_ID.test(String(music.id)) && M.playlists[music.id];
    if (!pl) return { error: 'Spellistan finns inte i biblioteket längre' };
    return { music: { kind: 'playlist', id: pl.id }, url: `https://open.spotify.com/playlist/${pl.id}`,
             urlTitle: pl.title, shuffle: true, tracks: [] };
  }
  if (music.kind === 'track') {
    const t = SPOTIFY_ID.test(String(music.id)) && M.tracks[music.id];
    if (!t) return { error: 'Låten finns inte i biblioteket längre' };
    const pl = (music.playlistId && M.playlists[music.playlistId] && M.playlists[music.playlistId].trackIds.includes(t.id))
      ? M.playlists[music.playlistId]
      : Object.values(M.playlists).find(p => p.trackIds.includes(t.id));
    const rest = pl ? pl.trackIds.filter(x => x !== t.id).slice(0, 99) : [];
    return { music: { kind: 'track', id: t.id, playlistId: pl ? pl.id : null },
             url: `https://open.spotify.com/track/${t.id}`, urlTitle: `${t.title} – ${t.artist}`.slice(0, 80),
             shuffle: false, tracks: [`spotify:track:${t.id}`, ...rest.map(x => `spotify:track:${x}`)], shuffleRest: true };
  }
  if (music.kind === 'liked') {
    const ids = ((M.liked || {}).trackIds || []).slice();
    if (!ids.length) return { error: 'Inga gillade låtar hämtade från Spotify än' };
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return { music: { kind: 'liked' }, url: '', urlTitle: '♥ Gillade låtar', shuffle: false,
             tracks: ids.slice(0, 100).map(x => `spotify:track:${x}`), shuffleRest: true };
  }
  return { error: 'Okänt musikval' };
}

// ── Alarm ──
const ALARM_MAX = 20;
function intIn(v, min, max, def) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def;
}
async function cleanAlarm(a) {
  if (!a || typeof a !== 'object') return { error: 'Inget alarm' };
  const time = String(a.time || '');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: 'Ogiltig tid' };
  const days = [...new Set((Array.isArray(a.days) ? a.days : []).map(Number).filter(d => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
  const date = days.length ? null : String(a.date || '');
  if (!days.length && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'Välj dagar, eller ett datum för ett engångsalarm' };
  let play;
  if (a.music) {
    play = alarmMusic(a.music);
    if (play.error) return { error: play.error };
  } else {
    const sp = await resolveSpotify(a.url, ['track', 'playlist', 'album']);
    if (sp.error) return { error: sp.error };
    play = { music: null, url: sp.url, urlTitle: sp.url ? (sp.title || '') : '', shuffle: false, tracks: [] };
  }
  return {
    alarm: {
      id: typeof a.id === 'string' && /^[\w-]{1,60}$/.test(a.id) ? a.id : crypto.randomUUID(),
      enabled: a.enabled !== false,
      time, days, date,
      label: String(a.label || '').slice(0, 40),
      url: play.url, urlTitle: play.urlTitle,
      music: play.music, shuffle: !!play.shuffle, tracks: play.tracks, shuffleRest: !!play.shuffleRest,
      volume: intIn(a.volume, 1, 100, 80),
      rampMinutes: intIn(a.rampMinutes, 0, 30, 3),
      autoStopMinutes: intIn(a.autoStopMinutes, 5, 180, 30),
      news: a.news === true,      // Ekots senaste nytt efter att hon stängt av (tavlans news.py)
      ...alarmSound(a),           // music / news / radio / signal (tavlans alarms.py)
      skipDates: cleanSkipDates(a.skipDates),
    },
  };
}

// Vad alarmet/timern ringer med. Radio: kanalen som den valdes i appen
// (namn + strömadress ur radiokatalogen). Går det inte att spela ringer
// tavlan med signalen Morgonljus i stället.
const SOUNDS = ['music', 'news', 'radio', 'signal'];
function cleanStation(r) {
  if (!r || typeof r !== 'object') return null;
  const url = String(r.url || '');
  if (!/^https?:\/\/[^\s]{4,500}$/.test(url)) return null;
  return { id: String(r.id || '').slice(0, 80), name: String(r.name || 'Radio').slice(0, 80), url,
           favicon: /^https:\/\/[^\s]{4,400}$/.test(String(r.favicon || '')) ? String(r.favicon) : '',
           country: String(r.country || '').slice(0, 40) };
}
function alarmSound(a) {
  const sound = SOUNDS.includes(a.sound) ? a.sound : 'music';
  const radio = sound === 'radio' ? cleanStation(a.radio) : null;
  return radio || sound !== 'radio' ? { sound, radio } : { sound: 'signal', radio: null };
}
function stockholmDate(d = new Date()) {           // "YYYY-MM-DD" i Sverige (servern går på UTC)
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
function cleanSkipDates(list) {
  const today = stockholmDate();
  return [...new Set((Array.isArray(list) ? list : []).map(String).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= today))].sort().slice(0, 10);
}

// "Hoppa över nästa gång": datumet (räknat i appen) läggs till/tas bort
app.post('/api/board/alarms/:id/skip', requirePin, (req, res) => {
  const a = boardState.alarms.find(x => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Alarmet finns inte' });
  const date = String(req.body.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Ogiltigt datum' });
  const set = new Set(cleanSkipDates(a.skipDates));
  if (req.body.skip === false) set.delete(date); else set.add(date);
  a.skipDates = cleanSkipDates([...set]);
  bumpConfig();
  res.json({ ok: true, alarm: a, alarms: boardState.alarms });
});

// ── Timer (Alarm -> Timer): ringer från tavlan på sekunden ──
const TIMER_MAX = 5;
function activeTimers() {
  const now = Date.now();
  const before = (boardState.timers || []).length;
  boardState.timers = (boardState.timers || []).filter(t => t.endsAt > now - 15 * 60000);   // kvar en stund (tavlan kan ringa sent)
  if (boardState.timers.length !== before) writeJSON(BOARD_FILE, boardState);
  return boardState.timers;
}
app.post('/api/board/timers', requirePin, (req, res) => {
  const minutes = Number(req.body.minutes);
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 600) return res.status(400).json({ error: 'Välj 1–600 minuter' });
  const live = activeTimers().filter(t => t.endsAt > Date.now());
  if (live.length >= TIMER_MAX) return res.status(400).json({ error: `Högst ${TIMER_MAX} timrar samtidigt` });
  const { sound, radio } = alarmSound(req.body);
  const t = { id: crypto.randomUUID(), startedAt: Date.now(), endsAt: Date.now() + Math.round(minutes * 60000),
              minutes: Math.round(minutes), label: String(req.body.label || '').slice(0, 40), sound: sound === 'music' ? 'music' : sound,
              radio, volume: intIn(req.body.volume, 1, 100, 80) };
  boardState.timers.push(t);
  boardState.lastTimerChoice = { sound: t.sound, radio: t.radio || null, volume: t.volume, minutes: t.minutes };
  bumpConfig();
  res.json({ ok: true, timer: t, timers: activeTimers() });
});
app.post('/api/board/timers/:id/extend', requirePin, (req, res) => {
  const t = activeTimers().find(x => x.id === req.params.id && x.endsAt > Date.now());
  if (!t) return res.status(404).json({ error: 'Timern är redan klar' });
  t.endsAt += intIn(req.body.minutes, 1, 60, 5) * 60000;
  t.id = crypto.randomUUID();                       // ny nyckel: tavlan ringer på den nya tiden
  bumpConfig();
  res.json({ ok: true, timers: activeTimers() });
});
app.delete('/api/board/timers/:id', requirePin, (req, res) => {
  boardState.timers = activeTimers().filter(t => t.id !== req.params.id);
  bumpConfig();
  res.json({ ok: true, timers: boardState.timers });
});

app.post('/api/board/alarms', requirePin, async (req, res) => {
  const r = await cleanAlarm(req.body.alarm);
  if (r.error) return res.status(400).json({ error: r.error });
  const i = boardState.alarms.findIndex(x => x.id === r.alarm.id);
  if (i >= 0) boardState.alarms[i] = r.alarm;
  else if (boardState.alarms.length >= ALARM_MAX) return res.status(400).json({ error: `Högst ${ALARM_MAX} alarm` });
  else boardState.alarms.push(r.alarm);
  // Nästa nya alarm börjar med samma val (ljud, volym, mjuk start …)
  const A = r.alarm;
  boardState.lastAlarmChoice = { sound: A.sound, music: A.music || null, radio: A.radio || null, url: A.url || '', urlTitle: A.urlTitle || '',
                                 volume: A.volume, rampMinutes: A.rampMinutes, autoStopMinutes: A.autoStopMinutes, news: !!A.news };
  bumpConfig();
  res.json({ ok: true, alarm: r.alarm, alarms: boardState.alarms });
});

app.delete('/api/board/alarms/:id', requirePin, (req, res) => {
  boardState.alarms = boardState.alarms.filter(a => a.id !== req.params.id);
  bumpConfig();
  res.json({ ok: true, alarms: boardState.alarms });
});

// Testa ett alarm nu (kort mjuk start, stoppar efter 2 min — se alarms.py)
app.post('/api/board/alarms/test', requirePin, async (req, res) => {
  const r = await cleanAlarm({ ...req.body.alarm, enabled: true });
  if (r.error) return res.status(400).json({ error: r.error });
  boardState.alarmTest = { id: crypto.randomUUID(), at: Date.now(), alarm: r.alarm };
  bumpConfig();
  res.json({ ok: true });
});

// ── Tavlans egna anrop (ingen PIN — tavlan kontrollerar allt själv) ──
// ── Albumbilderna i appen (2026-10-24) ───────────────────────────
// Tavlan läser de delade Google Foto-albumen och skickar hit listan
// (nyckel = kort hash av bildens adress, samma på tavlan). Appen visar
// bilderna och sparar val per bild: utsnitt (zoom + fokuspunkt, eller
// hela bilden), dold, ihopparad med en annan stående bild. Tavlan läser
// valen ur /api/board (photoEdits, photoDims, photoAutoPair, photoNow).
const PHOTO_KEY = /^[0-9a-f]{12}$/;
const listedKeys = () => new Set(((boardState.photoListing || {}).items || []).map(i => i.k));
app.post('/api/board/photos/listing', (req, res) => {          // från tavlan
  const items = (Array.isArray(req.body.items) ? req.body.items : []).slice(0, 2000)
    .filter(i => i && PHOTO_KEY.test(String(i.k)) && /^https:\/\/lh3\.googleusercontent\.com\/pw\//.test(String(i.u)) && String(i.u).length < 2000)
    .map(i => ({ k: i.k, u: i.u }));
  boardState.photoListing = { items, at: Date.now() };
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true, count: items.length });
});
app.get('/api/board/photos', (req, res) => {
  const L = boardState.photoListing || {};
  res.json({ items: L.items || [], listedAt: L.at || null, edits: boardState.photoEdits, dims: boardState.photoDims,
             autoPair: boardState.photoAutoPair, tavla: (piStatus || {}).tavla || null,
             albums: (boardState.googlePhotosAlbumUrls || []).length, rotateMinutes: ((boardState.settings || {}).tavlaRotateMinutes) || 30 });
});
function cleanEdit(e) {
  const out = {};
  if (e.fit === 'contain') out.fit = 'contain';
  else {
    const z = Number(e.z), fx = Number(e.fx), fy = Number(e.fy);
    if (Number.isFinite(z) && z > 1.001) out.z = Math.round(Math.min(4, z) * 100) / 100;
    if (Number.isFinite(fx) && Math.abs(fx - 0.5) > 0.001) out.fx = Math.round(Math.min(1, Math.max(0, fx)) * 1000) / 1000;
    if (Number.isFinite(fy) && Math.abs(fy - 0.5) > 0.001) out.fy = Math.round(Math.min(1, Math.max(0, fy)) * 1000) / 1000;
  }
  if (e.hidden) out.hidden = true;
  return out;
}
function setEdit(k, e) {
  if (e && Object.keys(e).length) boardState.photoEdits[k] = e; else delete boardState.photoEdits[k];
}
app.post('/api/board/photos/edit', requirePin, (req, res) => {
  const k = String(req.body.k || '');
  if (!PHOTO_KEY.test(k)) return res.status(400).json({ error: 'Okänd bild' });
  const before = JSON.stringify(boardState.photoEdits);
  const pair = (boardState.photoEdits[k] || {}).pair;
  const e = cleanEdit(req.body || {});
  if (pair && !e.hidden) e.pair = pair;
  if (e.hidden) unpair(k);
  setEdit(k, e);
  // Tavlan ritar bara om när något faktiskt ändrats — och inte alls med
  // quiet (Visa nu sparar först och ritar sedan själv, en gång)
  if (JSON.stringify(boardState.photoEdits) !== before) { if (req.body.quiet) bumpConfig(); else touchBoard(); }
  res.json({ ok: true, edit: boardState.photoEdits[k] || {} });
});
function unpair(k) {
  for (const [key, e] of Object.entries(boardState.photoEdits)) {
    if (key === k || e.pair === k) { const { pair, ...rest } = e; setEdit(key, rest); }
  }
}
app.post('/api/board/photos/pair', requirePin, (req, res) => {
  const a = String(req.body.a || ''), b = req.body.b ? String(req.body.b) : null;
  if (!PHOTO_KEY.test(a) || (b && (!PHOTO_KEY.test(b) || b === a))) return res.status(400).json({ error: 'Välj två olika bilder' });
  const before = JSON.stringify(boardState.photoEdits);
  unpair(a);
  if (b) {
    unpair(b);
    // utsnitten för båda halvorna kan skickas med — då en enda omritning
    const eb = req.body.eb ? cleanEdit(req.body.eb) : { ...(boardState.photoEdits[b] || {}) }; delete eb.hidden; setEdit(b, eb);
    const ea = req.body.ea ? cleanEdit(req.body.ea) : { ...(boardState.photoEdits[a] || {}) }; delete ea.hidden; ea.pair = b; setEdit(a, ea);
  }
  // quiet: "Visa nu" i par-redigeraren sparar först och ritar sedan själv, en gång
  if (JSON.stringify(boardState.photoEdits) !== before) { if (req.body.quiet) bumpConfig(); else touchBoard(); }
  res.json({ ok: true, edits: boardState.photoEdits });
});
app.post('/api/board/photos/autopair', requirePin, (req, res) => {
  boardState.photoAutoPair = !!req.body.on;
  touchBoard();
  res.json({ ok: true, autoPair: boardState.photoAutoPair });
});
app.post('/api/board/photos/dims', requirePin, (req, res) => {   // appen mäter bilderna när de laddas
  const known = listedKeys();
  let n = 0;
  for (const [k, d] of Object.entries((req.body || {}).dims || {})) {
    if (!known.has(k) || !Array.isArray(d)) continue;
    const w = Math.round(Number(d[0])), h = Math.round(Number(d[1]));
    if (!(w > 0 && h > 0 && w < 100000 && h < 100000)) continue;
    const old = boardState.photoDims[k];
    if (!old || Math.abs(old[0] / old[1] - w / h) > 0.01) { boardState.photoDims[k] = [w, h]; n++; }
  }
  for (const k of Object.keys(boardState.photoDims)) if (known.size && !known.has(k)) delete boardState.photoDims[k];
  if (n) touchBoard();
  res.json({ ok: true, updated: n });
});
app.post('/api/board/photos/show', requirePin, (req, res) => {
  const k = String(req.body.k || '');
  if (!listedKeys().has(k)) return res.status(400).json({ error: 'Bilden finns inte i albumet' });
  boardState.photoNow = { k, at: Date.now() };
  writeJSON(BOARD_FILE, boardState);
  pendingCommand = { action: 'photo_show', view: null, destination: null, direction: null, button: null, params: { k }, ts: Date.now() };
  res.json({ ok: true });
});

app.post('/api/board/pi-sync', (req, res) => {
  lastPiSeenAt = Date.now();
  const body = req.body || {};
  if (body.status && typeof body.status === 'object') {
    countListening(body.status, piStatusAt);
    try { countPodcast(body.status); } catch (e) { console.log('[poddar] status:', e.message); }
    piStatus = body.status;
    piStatusAt = Date.now();
  }
  const out = {
    version: boardState.configVersion,
    needSchema: body.schemaHash !== (boardState.settingsSchema || {}).hash,
  };
  if (body.version !== boardState.configVersion) {
    out.settings = boardState.settings;
    out.alarms = boardState.alarms;
    out.boardChangedAt = boardState.boardChangedAt || null;
    out.alarmTest = boardState.alarmTest || null;
    out.sensor = boardState.sensor || null;
    out.timers = activeTimers();
  }
  res.json(out);
});

// Om serverns data skulle ha försvunnit (t.ex. ny server utan sparad
// data) har tavlan kvar sin egen kopia av alarm och inställningar och
// lämnar tillbaka dem hit — men BARA om servern verkligen är tom.
// Tavlan ber om en notis till telefonen (kontrollen före alarmet). Bara
// färdiga meddelanden — tavlan skickar bara vilken sort och klockslaget —
// och högst en per sort var 20:e minut, så ingen kan skicka vad som helst.
const PI_NOTIFY = {
  speaker: t => ['⏰ Högtalaren är inte ansluten', `Alarmet kl ${t} kanske inte hörs. Slå på högtalaren.`],
  spotify: t => ['⏰ Tavlans Spotify svarar inte', `Alarmet kl ${t} kanske inte spelar. Starta om tavlan om det inte rättar sig.`],
};
const piNotifiedAt = {};
app.post('/api/board/pi-notify', async (req, res) => {
  const { kind, alarmTime } = req.body || {};
  const make = PI_NOTIFY[kind];
  const t = String(alarmTime || '');
  if (!make || !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) return res.status(400).json({ error: 'Okänd notis' });
  if (Date.now() - (piNotifiedAt[kind] || 0) < 20 * 60000) return res.json({ ok: true, skipped: true });
  piNotifiedAt[kind] = Date.now();
  const [title, body] = make(t);
  await pushToAll(title, body, 'tavlan-' + kind);
  console.log(`[tavlan] Notis: ${title} (${t})`);
  res.json({ ok: true, to: subscriptions.length });
});

// Sensorstart: se vad som finns (felsökning) / "Ny sensor idag" i appen
app.get('/api/board/sensor', (req, res) => {
  res.json({ sensor: boardState.sensor || null, treatmentsFromXdrip: boardState.treatmentTypesSeen || [] });
});
app.post('/api/board/sensor', requirePin, (req, res) => {
  const ms = Number(req.body && req.body.startedAt) || Date.now();
  if (ms < Date.now() - 60 * 86400000 || ms > Date.now() + 3600000) return res.status(400).json({ error: 'Orimligt datum' });
  boardState.sensor = { startedAt: ms, source: 'manual' };
  bumpConfig();
  res.json({ ok: true, sensor: boardState.sensor });
});

app.post('/api/board/pi-restore', (req, res) => {
  const body = req.body || {};
  const serverEmpty = !boardState.alarms.length && !Object.keys(boardState.settings).length;
  if (!serverEmpty || !(Number(body.version) > boardState.configVersion)) return res.status(409).json({ error: 'Servern har redan data' });
  Promise.all((Array.isArray(body.alarms) ? body.alarms : []).slice(0, ALARM_MAX).map(cleanAlarm)).then(results => {
    boardState.alarms = results.filter(r => r.alarm).map(r => r.alarm);
    boardState.settings = (body.settings && typeof body.settings === 'object') ? body.settings : {};
    boardState.configVersion = Number(body.version) + 1;
    writeJSON(BOARD_FILE, boardState);
    console.log(`[tavlan] Återställde ${boardState.alarms.length} alarm och ${Object.keys(boardState.settings).length} inställningar från tavlan`);
    res.json({ ok: true });
  });
});

app.post('/api/board/pi-schema', (req, res) => {
  const body = req.body || {};
  if (!Array.isArray(body.groups) || typeof body.hash !== 'string' || JSON.stringify(body).length > 100000) {
    return res.status(400).json({ error: 'Ogiltigt schema' });
  }
  boardState.settingsSchema = { groups: body.groups, hash: body.hash, at: Date.now() };
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true });
});



// ── SPOTIFY-KOPPLING (Web API, 2026-10-17) ───────────────────────
// Hennes egen Spotify-app (developer.spotify.com, Development mode —
// ägaren behöver Premium). Hon loggar in en gång i appen; servern hämtar
// sedan själv var 6:e timme: hennes spellistor (egna: med alla låtar,
// även privata; följda: namn/omslag + låtarna om listan är offentlig)
// och Gillade låtar. Inloggningen gäller 180 dagar (Spotifys gräns för
// nya appar) — appen påminner innan den går ut.
// Hemligheterna (SPOTIFY_CLIENT_ID/SECRET) ligger bara i Railways
// miljövariabler; inloggningen (refresh token) bara här på servern.
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_SCOPES = 'playlist-read-private playlist-read-collaborative user-library-read user-library-modify user-read-recently-played user-top-read '
  + 'user-read-playback-position user-read-playback-state user-modify-playback-state';     // poddar: var hon slutade; spelaren: spola/föregående/avsnitt
const SPOTIFY_LOGIN_DAYS = 180;
const SPOTIFY_SYNC_MS = 6 * 3600e3;
const LIKED_MAX = 500;
const spotifyStates = new Map();               // state -> skapad (inloggningen pågår)
let spotifySyncing = null;
function spotifyRedirect(req) {
  const host = req.get('x-forwarded-host') || req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol;
  return `${proto.split(',')[0]}://${host}/api/spotify/callback`;
}
async function spotifyToken(params) {
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST', signal: AbortSignal.timeout(10000),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
               Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64') },
    body: new URLSearchParams(params).toString(),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error_description || d.error || `Spotify svarade ${r.status}`); e.code = d.error; throw e; }
  return d;
}
async function spotifyAccess() {
  const A = boardState.spotifyAuth;
  if (!A || !A.refresh) throw new Error('Spotify är inte kopplat');
  if (A.access && A.accessUntil > Date.now() + 60000) return A.access;
  try {
    const d = await spotifyToken({ grant_type: 'refresh_token', refresh_token: A.refresh });
    A.access = d.access_token; A.accessUntil = Date.now() + (d.expires_in || 3600) * 1000;
    if (d.refresh_token) A.refresh = d.refresh_token;          // Spotify kan byta ut den
    writeJSON(BOARD_FILE, boardState);
    return A.access;
  } catch (e) {
    if (e.code === 'invalid_grant') { A.expired = true; A.refresh = null; A.access = null; writeJSON(BOARD_FILE, boardState); throw new Error('Inloggningen har gått ut — koppla Spotify igen'); }
    throw e;
  }
}
async function spotifyGet(pathOrUrl) {
  const url = pathOrUrl.startsWith('https://') ? pathOrUrl : 'https://api.spotify.com/v1' + pathOrUrl;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { Authorization: 'Bearer ' + await spotifyAccess() } });
    if (r.status === 429) { await new Promise(ok => setTimeout(ok, Math.min(30, Number(r.headers.get('retry-after')) || 5) * 1000)); continue; }
    if (r.status === 401 && attempt === 0) { boardState.spotifyAuth.access = null; continue; }
    if (!r.ok) { const e = new Error(`Spotify ${r.status} på ${url.replace('https://api.spotify.com/v1', '').split('?')[0]}`); e.status = r.status; throw e; }
    return r.json();
  }
  throw new Error('Spotify har för mycket att göra just nu — försöker igen senare');
}
async function spotifyAll(path, max) {
  const out = [];
  let next = path;
  while (next && out.length < max) {
    const d = await spotifyGet(next);
    out.push(...(d.items || []));
    next = d.next;
  }
  return out.slice(0, max);
}
function trackFromApi(t) {
  // Februari 2026: raderna i en spellista har låten under "item" ("track" är bara true)
  if (!t || typeof t !== 'object' || t.type === 'episode') return null;
  const id = /^[A-Za-z0-9]{22}$/.test(String(t.id || '')) ? t.id : null;
  if (!id) return null;
  const imgs = ((t.album || {}).images || []);
  const img = (imgs.find(i => i.width && i.width <= 320) || imgs[imgs.length - 1] || imgs[0] || {}).url || '';
  return { id, title: String(t.name || '').slice(0, 120), artist: (t.artists || []).map(a => a.name).join(', ').slice(0, 120),
           cover: img, artistId: (((t.artists || [])[0] || {}).id) || '' };
}
function rowTrack(row) {
  const t = (row && typeof row.item === 'object' && row.item) || (row && typeof row.track === 'object' && row.track) || null;
  return trackFromApi(t);
}
function storeTrack(M, t) {
  const prev = M.tracks[t.id] || {};
  M.tracks[t.id] = { ...prev, ...t, cover: t.cover || prev.cover || '', fav: !!prev.fav };
}
async function spotifySync(reason) {
  if (spotifySyncing) return spotifySyncing;
  spotifySyncing = (async () => {
    const A = boardState.spotifyAuth;
    const M = musicLib();
    const me = await spotifyGet('/me');
    A.user = { id: me.id, name: me.display_name || me.id };
    // 1) Spellistorna
    const lists = await spotifyAll('/me/playlists?limit=50', 200);
    const seen = new Set();
    const notes = [];
    for (const p of lists) {
      if (!p || !SPOTIFY_ID.test(String(p.id || ''))) continue;
      const owned = (p.owner || {}).id === me.id || !!p.collaborative;
      seen.add(p.id);
      const old = M.playlists[p.id] || {};
      if (!M.playlists[p.id] && Object.keys(M.playlists).length >= MUSIC_MAX_PLAYLISTS + 60) continue;
      const cover = ((p.images || [])[0] || {}).url || old.cover || '';
      const base = { ...old, id: p.id, title: String(p.name || 'Spellista').slice(0, 120), cover, source: 'spotify', owned,
                     fav: !!old.fav, addedAt: old.addedAt || Date.now(), artistImages: old.artistImages || [], trackIds: old.trackIds || [] };
      if (owned) {
        if (old.snapshot === p.snapshot_id && old.trackIds && old.trackIds.length && Date.now() - (old.indexedAt || 0) < 7 * 86400e3) { M.playlists[p.id] = base; continue; }
        let rows;
        try { rows = await spotifyAll(`/playlists/${p.id}/items?limit=100`, PLAYLIST_TRACK_MAX); }
        catch (e) { if (e.status === 404) rows = await spotifyAll(`/playlists/${p.id}/tracks?limit=100`, PLAYLIST_TRACK_MAX); else throw e; }
        const ids = [];
        for (const row of rows) { const t = rowTrack(row); if (t && !ids.includes(t.id)) { storeTrack(M, t); ids.push(t.id); } }
        M.playlists[p.id] = { ...base, trackIds: ids, snapshot: p.snapshot_id, indexedAt: Date.now(), error: ids.length ? undefined : 'Tom spellista' };
      } else {
        M.playlists[p.id] = base;
        if (!old.trackIds || !old.trackIds.length) {
          try { await indexPlaylist(p.id); M.playlists[p.id].source = 'spotify'; M.playlists[p.id].owned = false; }
          catch (e) { M.playlists[p.id].error = 'Låtarna kunde inte läsas (inte offentlig)'; notes.push(p.name); }
        }
      }
    }
    // Spellistor hon inte har kvar i Spotify tas bort — bara de som kom härifrån
    for (const [id, pl] of Object.entries(M.playlists)) if (pl.source === 'spotify' && !seen.has(id)) delete M.playlists[id];
    // Tomma (lästes inte) syns inte i biblioteket
    // 2) Gillade låtar
    const liked = await spotifyAll('/me/tracks?limit=50', LIKED_MAX);
    const likedIds = [];
    for (const row of liked) { const t = rowTrack(row); if (t && !likedIds.includes(t.id)) { storeTrack(M, t); likedIds.push(t.id); } }
    M.liked = { title: 'Gillade låtar', trackIds: likedIds, syncedAt: Date.now() };
    // 3) Poddar hon följer och deras senaste avsnitt
    try { A.shows = await syncPodcasts(); A.podError = null; }
    catch (e) { A.podError = e.message; console.log('[poddar] synk:', e.message); }
    // 4) Mest spelat (om Spotify fortfarande ger det till appar i Development mode)
    try {
      const top = await spotifyGet('/me/top/tracks?limit=30&time_range=short_term');
      M.top = (top.items || []).map(trackFromApi).filter(Boolean).map(t => { storeTrack(M, t); return t.id; });
    } catch (e) { M.top = null; A.topError = e.message; }
    dropUnusedTracks();
    A.lastSync = Date.now(); A.error = null; A.notReadable = notes;
    writeJSON(BOARD_FILE, boardState);
    console.log(`[spotify] Synkat (${reason}): ${seen.size} spellistor, ${likedIds.length} gillade låtar`);
    return { playlists: seen.size, liked: likedIds.length };
  })();
  try { return await spotifySyncing; }
  catch (e) { if (boardState.spotifyAuth) { boardState.spotifyAuth.error = e.message; writeJSON(BOARD_FILE, boardState); } console.log('[spotify] Synk misslyckades:', e.message); throw e; }
  finally { spotifySyncing = null; }
}
function spotifyStatus() {
  const A = boardState.spotifyAuth || {};
  const connected = !!A.refresh;
  return { configured: !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET), connected, expired: !!A.expired,
           user: A.user ? A.user.name : null, lastSync: A.lastSync || null, error: A.error || null,
           loginUntil: A.connectedAt ? A.connectedAt + SPOTIFY_LOGIN_DAYS * 86400e3 : null,
           liked: ((musicLib().liked || {}).trackIds || []).length, notReadable: A.notReadable || [], syncing: !!spotifySyncing,
           shows: A.shows || 0, podError: A.podError || null,
           needsRelogin: connected && !String(A.scope || '').includes('user-modify-playback-state') };
}
app.get('/api/board/spotify', (req, res) => res.json(spotifyStatus()));
app.post('/api/board/spotify/login', requirePin, (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return res.status(400).json({ error: 'SPOTIFY_CLIENT_ID/SECRET saknas på servern' });
  const state = crypto.randomBytes(16).toString('hex');
  for (const [k, t] of spotifyStates) if (Date.now() - t > 15 * 60000) spotifyStates.delete(k);
  spotifyStates.set(state, Date.now());
  const q = new URLSearchParams({ client_id: SPOTIFY_CLIENT_ID, response_type: 'code', redirect_uri: spotifyRedirect(req),
                                  scope: SPOTIFY_SCOPES, state, show_dialog: 'true' });
  res.json({ url: 'https://accounts.spotify.com/authorize?' + q });
});
app.get('/api/spotify/callback', async (req, res) => {
  const back = msg => res.redirect('/tavla?spotify=' + encodeURIComponent(msg));
  const state = String(req.query.state || '');
  if (!spotifyStates.has(state)) return back('fel:Inloggningen var för gammal — försök igen');
  spotifyStates.delete(state);
  if (req.query.error) return back('fel:' + (req.query.error === 'access_denied' ? 'Du avbröt inloggningen' : String(req.query.error)));
  try {
    const d = await spotifyToken({ grant_type: 'authorization_code', code: String(req.query.code || ''), redirect_uri: spotifyRedirect(req) });
    boardState.spotifyAuth = { refresh: d.refresh_token, access: d.access_token, accessUntil: Date.now() + (d.expires_in || 3600) * 1000,
                               connectedAt: Date.now(), scope: d.scope || '' };
    writeJSON(BOARD_FILE, boardState);
    spotifySync('ny koppling').catch(() => {});
    back('ok');
  } catch (e) { back('fel:' + e.message); }
});
app.post('/api/board/spotify/sync', requirePin, async (req, res) => {
  try { res.json({ ok: true, ...(await spotifySync('appen')), status: spotifyStatus() }); }
  catch (e) { res.status(502).json({ error: e.message, status: spotifyStatus() }); }
});
app.post('/api/board/spotify/disconnect', requirePin, (req, res) => {
  const M = musicLib();
  for (const [id, pl] of Object.entries(M.playlists)) if (pl.source === 'spotify') delete M.playlists[id];
  M.liked = null; M.top = null; M.shows = {}; M.episodes = {};
  dropUnusedTracks();
  delete boardState.spotifyAuth;
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true, status: spotifyStatus() });
});
let spotifyReminded = 0;
setInterval(() => {
  const A = boardState.spotifyAuth;
  if (!A || !A.refresh) return;
  if (Date.now() - (A.lastSync || 0) > SPOTIFY_SYNC_MS) spotifySync('var 6:e timme').catch(() => {});
  const left = A.connectedAt + SPOTIFY_LOGIN_DAYS * 86400e3 - Date.now();
  if (left < 7 * 86400e3 && Date.now() - spotifyReminded > 2 * 86400e3 && typeof pushToAll === 'function') {
    spotifyReminded = Date.now();
    pushToAll('🎵 Koppla Spotify igen', `Tavlans koppling till Spotify går ut om ${Math.max(0, Math.ceil(left / 86400e3))} dagar. Inställningar → Musik & ljud → Koppla Spotify.`, 'spotify').catch(() => {});
  }
}, 10 * 60 * 1000);

// ── Poddar + spelaren via Spotify (2026-10-17) ───────────────────
// Poddarna hon följer i Spotify (GET /me/shows) och deras senaste
// avsnitt med var hon slutade (resume_point — kräver behörigheten
// user-read-playback-position). Ett avsnitt spelas på tavlan i första
// hand via Spotify (Web API: spela på enheten "Tavlan" — då följer var
// hon slutade med till telefonen). Kan tavlan inte spela det via Spotify
// tar servern poddens öppna flöde (hittas via Apples poddkatalog) och
// tavlan spelar ljudfilen själv (audio.py); var hon slutade sparas då här.
const SHOWS_MAX = 40, EPISODES_PER_SHOW = 20, NEW_DAYS = 14;
function podLib() {
  const M = musicLib();
  if (!M.shows) M.shows = {};
  if (!M.episodes) M.episodes = {};
  if (!M.progress) M.progress = {};          // avsnitt -> { pos (s), at, done } från tavlan
  return M;
}
function epFromApi(e, showId) {
  if (!e || !/^[A-Za-z0-9]{22}$/.test(String(e.id || ''))) return null;
  const rp = e.resume_point || {};
  const imgs = e.images || [];
  return { id: e.id, show: showId, name: String(e.name || '').slice(0, 200), date: String(e.release_date || '').slice(0, 10),
           durationMs: Number(e.duration_ms) || 0, resumeMs: Number(rp.resume_position_ms) || 0, fullyPlayed: !!rp.fully_played,
           cover: ((imgs.find(i => i.width && i.width <= 320) || imgs[imgs.length - 1] || {}).url) || '',
           desc: String(e.description || '').slice(0, 300), syncedAt: Date.now() };
}
async function syncPodcasts() {
  const M = podLib();
  const shows = await spotifyAll('/me/shows?limit=50', SHOWS_MAX);
  const seen = new Set();
  for (const row of shows) {
    const sh = row.show || row;
    if (!sh || !/^[A-Za-z0-9]{22}$/.test(String(sh.id || ''))) continue;
    seen.add(sh.id);
    const imgs = sh.images || [];
    M.shows[sh.id] = { id: sh.id, name: String(sh.name || 'Podd').slice(0, 120), cover: ((imgs.find(i => i.width && i.width <= 320) || imgs[0] || {}).url) || '',
                       total: Number(sh.total_episodes) || 0, addedAt: row.added_at || null, feed: (M.shows[sh.id] || {}).feed || null };
    try {
      const eps = await spotifyGet(`/shows/${sh.id}/episodes?limit=${EPISODES_PER_SHOW}`);
      const keep = new Set();
      for (const e of (eps.items || [])) { const ep = epFromApi(e, sh.id); if (ep) { M.episodes[ep.id] = ep; keep.add(ep.id); } }
      for (const [id, ep] of Object.entries(M.episodes)) if (ep.show === sh.id && !keep.has(id)) delete M.episodes[id];
    } catch (e) { console.log(`[poddar] ${sh.name}: ${e.message}`); }
  }
  for (const id of Object.keys(M.shows)) if (!seen.has(id)) delete M.shows[id];
  for (const [id, ep] of Object.entries(M.episodes)) if (!M.shows[ep.show]) delete M.episodes[id];
  return seen.size;
}
// Var hon slutade: det senaste av Spotifys resume_point och tavlans egen
function epState(ep) {
  const P = (podLib().progress || {})[ep.id];
  let resumeMs = ep.resumeMs, done = ep.fullyPlayed;
  if (P && P.at > (ep.syncedAt || 0)) { resumeMs = Math.round(P.pos * 1000); done = !!P.done; }
  const isNew = !done && !resumeMs && ep.date && (Date.now() - new Date(ep.date + 'T12:00:00Z')) < NEW_DAYS * 86400e3;
  return { ...ep, resumeMs, fullyPlayed: done, isNew };
}
// Hur mycket hon lyssnar på en podd: minuter på tavlan + avsnitt hon
// påbörjat eller lyssnat klart (Spotifys resume_point, så det fungerar direkt)
function podScore(showId, eps) {
  const started = eps.filter(e => e.show === showId && (e.resumeMs || e.fullyPlayed)).length;
  return (boardState.podStats[showId] || 0) / 60 + 10 * started;
}
app.get('/api/board/podcasts', (req, res) => {
  const M = podLib();
  const eps = Object.values(M.episodes).map(epState);
  const shows = Object.values(M.shows).map(sh => ({ ...sh, feed: undefined,
    newCount: eps.filter(e => e.show === sh.id && e.isNew).length,
    latest: (eps.filter(e => e.show === sh.id).sort((a, b) => b.date.localeCompare(a.date))[0] || {}).date || '' }))
    .map(sh => ({ ...sh, score: podScore(sh.id, eps) }))
    .sort((a, b) => (b.score - a.score) || b.latest.localeCompare(a.latest));
  const recent = eps.filter(e => !e.fullyPlayed).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
    .map(e => ({ ...e, showName: (M.shows[e.show] || {}).name || '' }));
  // Tre olyssnade avsnitt, från de poddar hon lyssnar mest på (ett per podd först)
  const cand = eps.filter(e => !e.fullyPlayed && (e.isNew || e.resumeMs));
  const top = [];
  for (const sh of shows) { const e = cand.filter(x => x.show === sh.id).sort((a, b) => b.date.localeCompare(a.date))[0]; if (e) top.push(e); if (top.length >= 3) break; }
  if (top.length < 3) for (const e of cand.sort((a, b) => b.date.localeCompare(a.date))) { if (top.length >= 3) break; if (!top.includes(e)) top.push(e); }
  res.json({ connected: !!(boardState.spotifyAuth || {}).refresh, shows, recent, newCount: eps.filter(e => e.isNew).length,
             top: top.map(e => ({ ...e, showName: (M.shows[e.show] || {}).name || '' })) });
});
app.get('/api/board/podcasts/:id', (req, res) => {
  const M = podLib();
  const sh = M.shows[req.params.id];
  if (!sh) return res.status(404).json({ error: 'Podden finns inte' });
  res.json({ show: { ...sh, feed: undefined },
             episodes: Object.values(M.episodes).filter(e => e.show === sh.id).map(epState).sort((a, b) => b.date.localeCompare(a.date)) });
});
// Tavlans status: var hon är i avsnittet (öppna flödet) eller i Spotify
function countPodcast(st) {
  const m = st && st.music;
  if (!m) return;
  const M = podLib();
  let changed = false;
  const save = (uri, pos, done) => {
    const id = (/^spotify:episode:([A-Za-z0-9]{22})$/.exec(String(uri || '')) || [])[1];
    if (!id || !M.episodes[id]) return;
    M.progress[id] = { pos: Math.max(0, Number(pos) || 0), at: Date.now(), done: !!done };
    changed = true;
  };
  if (m.podcast && m.podcast.id) save(m.podcast.id, m.podcast.pos, false);
  else if (m.spotify === 'playing' && m.now && m.now.type === 'episode' && typeof m.now.pos === 'number') save(m.now.uri, m.now.pos / 1000, false);
  const fin = m.podcastFinished;
  if (fin && fin.id && fin.at && fin.at !== podLib()._lastFin) { podLib()._lastFin = fin.at; save(fin.id, 0, true); }
  if (changed && Date.now() - (countPodcast.saved || 0) > 60000) { countPodcast.saved = Date.now(); writeJSON(BOARD_FILE, boardState); }
}

// ── Spelaren via Spotify Web API (spola, föregående, avsnitt, ♡) ──
function tavlanDeviceName() { return ((piStatus || {}).system || {}).spotifyDevice || 'Tavlan'; }
async function tavlanDevice() {
  const d = await spotifyGet('/me/player/devices');
  const want = tavlanDeviceName().toLowerCase();
  return (d.devices || []).find(x => String(x.name || '').toLowerCase() === want) || null;
}
async function spotifySend(method, path, body) {
  const r = await fetch('https://api.spotify.com/v1' + path, {
    method, signal: AbortSignal.timeout(15000),
    headers: { Authorization: 'Bearer ' + await spotifyAccess(), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined });
  if (r.status === 204 || r.status === 200 || r.status === 202) return true;
  const d = await r.json().catch(() => ({}));
  const e = new Error(((d.error || {}).message) || `Spotify svarade ${r.status}`); e.status = r.status; throw e;
}
// Poddens öppna flöde (reserv): Apples poddkatalog -> RSS -> avsnittets ljudfil
async function feedFor(show) {
  const M = podLib();
  const sh = M.shows[show];
  if (!sh) throw new Error('Podden finns inte');
  if (sh.feed && Date.now() - (sh.feed.at || 0) < 7 * 86400e3) {
    if (!sh.feed.url) throw new Error('Podden har inget öppet flöde (finns bara på Spotify)');
    return sh.feed.url;
  }
  const r = await fetch(`https://itunes.apple.com/search?media=podcast&entity=podcast&limit=5&term=${encodeURIComponent(sh.name)}`, { signal: AbortSignal.timeout(10000) });
  const d = r.ok ? await r.json() : {};
  const n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const hit = (d.results || []).find(x => n(x.collectionName) === n(sh.name)) || (d.results || []).find(x => n(x.collectionName).includes(n(sh.name)));
  sh.feed = { url: hit && hit.feedUrl ? hit.feedUrl : null, at: Date.now() };
  if (!sh.feed.url) throw new Error('Podden har inget öppet flöde (finns bara på Spotify)');
  return sh.feed.url;
}
function rssItems(xml) {
  const out = [];
  const tag = (s, t) => { const m = new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i').exec(s); return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : ''; };
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const it = m[0];
    const enc = /<enclosure[^>]*url=["']([^"']+)["']/i.exec(it);
    if (!enc) continue;
    out.push({ title: tag(it, 'title').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"'), url: enc[1].replace(/&amp;/g, '&'), date: new Date(tag(it, 'pubDate') || 0) });
  }
  return out;
}
async function feedAudio(ep) {
  const url = await feedFor(ep.show);
  const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Tavlan/1.0' } });
  if (!r.ok) throw new Error(`Poddens flöde svarade ${r.status}`);
  const items = rssItems(await r.text());
  const n = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const want = n(ep.name);
  const day = ep.date ? new Date(ep.date + 'T12:00:00Z').getTime() : 0;
  const hit = items.find(i => n(i.title) === want) || items.find(i => want && (n(i.title).includes(want) || want.includes(n(i.title))))
    || items.find(i => day && Math.abs(i.date.getTime() - day) < 36 * 3600e3);
  if (!hit) throw new Error('Hittade inte avsnittet i poddens flöde');
  return hit.url;
}
async function playEpisode(id, fromStart, sleepMin) {
  const M = podLib();
  const ep = M.episodes[id] ? epState(M.episodes[id]) : null;
  if (!ep) throw new Error('Avsnittet finns inte');
  const startMs = fromStart || ep.fullyPlayed ? 0 : ep.resumeMs;
  const show = M.shows[ep.show] || {};
  // 1) Via Spotify på tavlan
  let why = '';
  try {
    const dev = await tavlanDevice();
    if (!dev) throw new Error(`hittar inte enheten "${tavlanDeviceName()}" i Spotify`);
    await spotifySend('PUT', `/me/player/play?device_id=${encodeURIComponent(dev.id)}`, { uris: [`spotify:episode:${id}`], position_ms: startMs });
    await new Promise(ok => setTimeout(ok, 5000));
    const p = await spotifyGet('/me/player?additional_types=episode');
    if (p && p.item && p.item.id === id && p.device && p.device.id === dev.id) {
      if (sleepMin) pendingCommand = { action: 'sleep_set', ts: Date.now(), params: { minutes: sleepMin } };
      return { via: 'spotify' };
    }
    why = 'Spotify på tavlan startade inte avsnittet';
  } catch (e) { why = e.message; }
  // 2) Poddens öppna flöde, ljudfilen spelas av tavlan
  console.log(`[poddar] Spotify kunde inte (${why}) — provar poddens flöde`);
  const audioUrl = await feedAudio(ep);
  pendingCommand = { action: 'podcast_play', view: null, destination: null, direction: null, button: null, ts: Date.now(),
                     params: { id: `spotify:episode:${id}`, name: ep.name, show: show.name || '', url: audioUrl, start: startMs / 1000,
                               duration: ep.durationMs / 1000, cover: ep.cover || show.cover || '', ...(sleepMin ? { sleep: sleepMin } : {}) } };
  return { via: 'feed', why };
}
app.post('/api/board/player', async (req, res) => {
  const { action } = req.body || {};
  try {
    if (action === 'episode') return res.json({ ok: true, ...(await playEpisode(String(req.body.id || ''), !!req.body.fromStart)) });
    const m = ((piStatus || {}).music) || {};
    if (action === 'seek') {
      const delta = Math.max(-600, Math.min(600, Number(req.body.delta) || 0));
      if (m.podcast) {                                    // avsnitt från öppna flödet: tavlan spolar själv
        pendingCommand = { action: 'audio_seek', ts: Date.now(), params: { delta } };
        return res.json({ ok: true, via: 'tavlan' });
      }
      const p = await spotifyGet('/me/player');
      if (!p || !p.device) throw new Error('Inget spelar i Spotify');
      const to = Math.max(0, (p.progress_ms || 0) + delta * 1000);
      await spotifySend('PUT', `/me/player/seek?position_ms=${Math.round(to)}&device_id=${encodeURIComponent(p.device.id)}`);
      return res.json({ ok: true, via: 'spotify', positionMs: to });
    }
    if (action === 'prev') {
      const p = await spotifyGet('/me/player');
      if (!p || !p.device) throw new Error('Inget spelar i Spotify');
      await spotifySend('POST', `/me/player/previous?device_id=${encodeURIComponent(p.device.id)}`);
      return res.json({ ok: true });
    }
    if (action === 'like') {
      const uri = String(req.body.uri || '');
      if (!/^spotify:(track|episode|show):[A-Za-z0-9]{22}$/.test(uri)) return res.status(400).json({ error: 'Okänt objekt' });
      const on = req.body.on !== false;
      await spotifySend(on ? 'PUT' : 'DELETE', `/me/library?uris=${encodeURIComponent(uri)}`);
      const M = musicLib();
      if (uri.startsWith('spotify:track:')) {
        const id = uri.slice(14);
        if (!M.liked) M.liked = { title: 'Gillade låtar', trackIds: [] };
        M.liked.trackIds = M.liked.trackIds.filter(x => x !== id);
        if (on) M.liked.trackIds.unshift(id);
        writeJSON(BOARD_FILE, boardState);
      }
      return res.json({ ok: true, liked: on });
    }
    res.status(400).json({ error: 'Okänd åtgärd' });
  } catch (e) {
    res.status(e.status === 401 || /inte kopplat/.test(e.message) ? 400 : 502).json({ error: e.message.includes('inte kopplat') ? 'Koppla Spotify först (Inställningar → Musik & ljud)' : e.message });
  }
});

// ── RADIO (Musik-fliken, 2026-10-17) ────────────────────────────
// Kanallistan kommer från Radio Browser (öppen, gemenskapsdriven katalog
// med tiotusentals stationer: https://www.radio-browser.info) och
// Sveriges Radios öppna API (deras egna strömadresser). Tavlan spelar
// strömmen själv (audio.py); fungerar en kanal inte syns det i appen.
const RB_FALLBACK = ['de1.api.radio-browser.info', 'fi1.api.radio-browser.info', 'nl1.api.radio-browser.info'];
let rbHosts = null;
async function rb(pathq) {
  if (!rbHosts) {
    try {
      const r = await fetch('https://all.api.radio-browser.info/json/servers', { signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'Tavlan/1.0' } });
      const list = r.ok ? (await r.json()).map(x => String(x.name || '')).filter(n => /^[a-z0-9.-]+\.api\.radio-browser\.info$/.test(n)) : [];
      rbHosts = [...new Set([...list, ...RB_FALLBACK])];
    } catch (e) { rbHosts = RB_FALLBACK.slice(); }
  }
  let last;
  for (const h of rbHosts) {
    try {
      const r = await fetch(`https://${h}${pathq}`, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Tavlan/1.0' } });
      if (r.ok) return await r.json();
      last = new Error(`Radio Browser svarade ${r.status}`);
    } catch (e) { last = e; }
  }
  throw last || new Error('Radio Browser svarar inte');
}
function rbStation(x) {
  return cleanStation({ id: 'rb:' + x.stationuuid, name: String(x.name || '').trim(), url: x.url_resolved || x.url,
                        favicon: x.favicon, country: x.countrycode || x.country });
}
async function rbList(pathq) {
  const list = await rb(pathq);
  const seen = new Set();
  return (Array.isArray(list) ? list : []).filter(x => x.lastcheckok !== 0)
    .map(x => ({ st: rbStation(x), codec: x.codec, bitrate: x.bitrate }))
    .filter(x => x.st && !seen.has(x.st.name.toLowerCase()) && seen.add(x.st.name.toLowerCase()))
    .map(x => ({ ...x.st, codec: String(x.codec || '').slice(0, 10), bitrate: Number(x.bitrate) || 0 }));
}
// Utvalda (på begäran: lite av allt, och tyska kanaler — hon är tyska)
const RADIO_CURATED = [
  ['Tyskland', [['1LIVE', 'DE'], ['SWR3', 'DE'], ['Bayern 3', 'DE'], ['Antenne Bayern', 'DE'], ['NDR 2', 'DE'], ['WDR 2', 'DE'],
                ['hr3', 'DE'], ['Hit Radio FFH', 'DE'], ['bigFM', 'DE'], ['Radio Bob', 'DE'], ['Deutschlandfunk', 'DE'],
                ['Klassik Radio', 'DE'], ['sunshine live', 'DE']]],
  ['Sverige', [['sr:P1'], ['sr:P2'], ['sr:P3'], ['sr:P4 Stockholm'], ['Mix Megapol', 'SE'], ['Rix FM', 'SE'], ['NRJ', 'SE'], ['Lugna Favoriter', 'SE']]],
  ['Världen', [['BBC World Service', 'GB'], ['FIP', 'FR'], ['KEXP', 'US']]],
  ['Internetradio', [['Radio Paradise Main Mix', ''], ['Groove Salad', 'US'], ['Drone Zone', 'US'], ['Jazz24', 'US']]],
];
const radioCache = {};
async function cached(key, ms, fn) {
  const c = radioCache[key];
  if (c && Date.now() - c.at < ms) return c.data;
  const data = await fn();
  radioCache[key] = { at: Date.now(), data };
  return data;
}
async function srChannels() {
  return cached('sr', 24 * 3600e3, async () => {
    const r = await fetch('https://api.sr.se/api/v2/channels?format=json&pagination=false', { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`Sveriges Radio svarade ${r.status}`);
    return ((await r.json()).channels || []).map(c => cleanStation({ id: 'sr:' + c.id, name: c.name, url: (c.liveaudio || {}).url,
                                                                       favicon: c.image, country: 'SE' })).filter(Boolean);
  });
}
async function curatedRadio() {
  return cached('curated', 24 * 3600e3, async () => {
    const groups = [];
    for (const [group, wanted] of RADIO_CURATED) {
      const out = [];
      await inPool(wanted.map((w, i) => [w, i]), 4, async ([[q, cc], i]) => {
        try {
          let st = null;
          if (q.startsWith('sr:')) st = (await srChannels()).find(c => c.name.toLowerCase() === q.slice(3).toLowerCase()) || null;
          else {
            const hits = await rbList(`/json/stations/search?name=${encodeURIComponent(q)}${cc ? '&countrycode=' + cc : ''}&hidebroken=true&order=clickcount&reverse=true&limit=5`);
            st = hits.find(h => h.name.toLowerCase().startsWith(q.toLowerCase())) || hits[0] || null;
          }
          if (st) out[i] = st;
        } catch (e) { console.log(`[radio] ${q}: ${e.message}`); }
      });
      groups.push({ group, stations: out.filter(Boolean) });
    }
    return groups;
  });
}
app.get('/api/board/radio', async (req, res) => {
  try {
    const list = String(req.query.list || 'curated');
    if (list === 'curated') return res.json({ groups: await curatedRadio(), favs: boardState.radioFavs });
    const cc = String(req.query.cc || '').toUpperCase();
    if (list === 'top') {
      const path = /^[A-Z]{2}$/.test(cc)
        ? `/json/stations/bycountrycodeexact/${cc}?order=clickcount&reverse=true&hidebroken=true&limit=40`
        : '/json/stations/topclick/40?hidebroken=true';
      return res.json({ stations: await cached('top:' + cc, 6 * 3600e3, () => rbList(path)) });
    }
    res.status(400).json({ error: 'Okänd lista' });
  } catch (e) { res.status(502).json({ error: 'Radiokatalogen svarar inte just nu: ' + e.message }); }
});
app.get('/api/board/radio/search', async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 60);
  if (q.length < 2) return res.json({ stations: [] });
  try {
    res.json({ stations: await rbList(`/json/stations/search?name=${encodeURIComponent(q)}&hidebroken=true&order=clickcount&reverse=true&limit=30`) });
  } catch (e) { res.status(502).json({ error: 'Radiokatalogen svarar inte just nu: ' + e.message }); }
});
app.post('/api/board/radio/fav', requirePin, (req, res) => {
  const st = cleanStation(req.body.station);
  if (!st) return res.status(400).json({ error: 'Okänd kanal' });
  boardState.radioFavs = boardState.radioFavs.filter(f => f.id !== st.id);
  if (req.body.fav !== false) boardState.radioFavs.unshift(st);
  boardState.radioFavs = boardState.radioFavs.slice(0, 50);
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true, favs: boardState.radioFavs });
});

// ── Lyssningsstatistik: vad hon spelar mest (för "Spela nu") ──
// Räknas från tavlans status var 5:e sekund: radiokanalen, eller vilken
// spellista i musikbiblioteket låten som spelas finns i.
let statsSaveAt = 0;
function countListening(st, prevAt) {
  const m = st && st.music;
  if (!m || !prevAt) return;
  const dt = Math.min(15, (Date.now() - prevAt) / 1000);
  if (dt <= 0) return;
  let changed = false;
  if (m.radio && m.radio.id) {
    const id = String(m.radio.id).slice(0, 80);
    const fav = boardState.radioFavs.find(f => f.id === id);
    const known = fav || cleanStation(m.radio) || (boardState.radioStats[id] || {}).station || null;
    boardState.radioStats[id] = { secs: ((boardState.radioStats[id] || {}).secs || 0) + dt, station: known };
    changed = true;
  } else if (m.spotify === 'playing' && m.now && /^spotify:track:[A-Za-z0-9]{22}$/.test(String(m.now.uri || ''))) {
    const tid = m.now.uri.slice(14);
    const pl = Object.values(musicLib().playlists).find(p => (p.trackIds || []).includes(tid));
    if (pl) { boardState.playlistStats[pl.id] = (boardState.playlistStats[pl.id] || 0) + dt; changed = true; }
  }
  // Poddar: vilken podd avsnittet hör till (öppna flödet eller via Spotify)
  const epUri = m.podcast && m.podcast.id ? m.podcast.id : (m.spotify === 'playing' && m.now && m.now.type === 'episode' ? m.now.uri : '');
  const epId = (/^spotify:episode:([A-Za-z0-9]{22})$/.exec(String(epUri || '')) || [])[1];
  const ep = epId && (musicLib().episodes || {})[epId];
  if (ep && ep.show) { boardState.podStats[ep.show] = (boardState.podStats[ep.show] || 0) + dt; changed = true; }
  if (changed && Date.now() - statsSaveAt > 120000) { statsSaveAt = Date.now(); writeJSON(BOARD_FILE, boardState); }
}
function topOf(obj, val) {
  let best = null;
  for (const [k, v] of Object.entries(obj || {})) if (!best || val(v) > val(best[1])) best = [k, v];
  return best;
}
app.get('/api/board/listen', (req, res) => {
  const M = musicLib();
  const tp = topOf(Object.fromEntries(Object.entries(boardState.playlistStats).filter(([id]) => M.playlists[id])), v => v);
  const tr = topOf(Object.fromEntries(Object.entries(boardState.radioStats).filter(([, v]) => v && v.station)), v => v.secs);
  const pl = id => id && M.playlists[id] ? { id, title: M.playlists[id].title, cover: M.playlists[id].cover || '' } : null;
  // Inget lyssnat än: favoritspellistan, annars den första i biblioteket
  const fallbackPl = Object.values(M.playlists).find(p => p.fav) || Object.values(M.playlists)[0];
  const g = boardState.godnatt || {};
  // Populära spellistor: hennes lyssningstid på tavlan + hur många av
  // hennes mest spelade låtar i Spotify (senaste veckorna) listan har
  const topIds = new Set(M.top || []);
  const plScore = p => (boardState.playlistStats[p.id] || 0) / 60 + 3 * (p.trackIds || []).filter(id => topIds.has(id)).length
                     + (p.fav ? 5 : 0) + (p.source === 'spotify' && p.owned ? 1 : 0);
  const topPlaylists = Object.values(M.playlists).map(p => [p, plScore(p)]).sort((a, b) => b[1] - a[1]).slice(0, 9)
    .map(([p]) => ({ id: p.id, title: p.title, cover: p.cover || (p.artistImages || [])[0] || '' }));
  res.json({
    topPlaylists,
    topPlaylist: pl(tp ? tp[0] : fallbackPl && fallbackPl.id), topPlaylistCounted: !!tp,
    topRadio: tr ? tr[1].station : (boardState.radioFavs[0] || null), topRadioCounted: !!tr,
    favs: boardState.radioFavs,
    godnatt: { kind: g.kind === 'podcast' ? 'podcast' : 'playlist', playlist: pl(g.playlistId), minutes: g.minutes || 30,
               show: g.showId && (M.shows || {})[g.showId] ? { id: g.showId, name: M.shows[g.showId].name, cover: M.shows[g.showId].cover || '' } : null },
  });
});
// Godnatt: spellistan och längden väljer hon själv
app.post('/api/board/godnatt', requirePin, (req, res) => {
  const kind = req.body.kind === 'podcast' ? 'podcast' : 'playlist';
  const id = String(req.body.playlistId || ''), showId = String(req.body.showId || '');
  if (kind === 'playlist' && id && !musicLib().playlists[id]) return res.status(400).json({ error: 'Spellistan finns inte i biblioteket' });
  if (kind === 'podcast' && !(podLib().shows || {})[showId]) return res.status(400).json({ error: 'Podden finns inte' });
  const g = boardState.godnatt || {};
  // -1 = spela hela avsnittet (bara för podd)
  const minutes = Number(req.body.minutes) === -1 ? (kind === 'podcast' ? -1 : 30) : intIn(req.body.minutes, 5, 120, 30);
  boardState.godnatt = { kind, playlistId: kind === 'playlist' ? (id || null) : (g.playlistId || null),
                         showId: kind === 'podcast' ? showId : (g.showId || null), minutes };
  writeJSON(BOARD_FILE, boardState);
  res.json({ ok: true, godnatt: boardState.godnatt });
});
// Godnatt med podd: senaste avsnittet (fortsätter där hon var) + sov-timer
app.post('/api/board/godnatt/start', async (req, res) => {
  const g = boardState.godnatt || {};
  if (g.kind !== 'podcast') return res.status(400).json({ error: 'Godnatt är inte en podd' });
  const eps = Object.values(podLib().episodes || {}).filter(e => e.show === g.showId).sort((a, b) => b.date.localeCompare(a.date));
  if (!eps.length) return res.status(404).json({ error: 'Hittar inga avsnitt i podden' });
  try { res.json({ ok: true, episode: eps[0].name, ...(await playEpisode(eps[0].id, false, g.minutes || 30)) }); }
  catch (e) { res.status(502).json({ error: e.message }); }
});

// ── Kalender via Googles hemliga iCal-adress ──
// (Google Kalender -> Inställningar -> kalendern -> "Hemlig adress i
// iCal-format"). Händelser vars titel börjar med 🔔 eller ! blir en
// lapp på tavlans övriga vyer samma dag (render.py). Länken lämnar
// aldrig servern (GET /api/board visar bara calendarSet).
const ical = require('node-ical');
const ICS_RE = /^https:\/\/calendar\.google\.com\/calendar\/ical\/[^\s]{5,300}\.ics$/;
let icsCache = null;
function stockholmIso(d) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(d).map(p => [p.type, p.value]));
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
  const off = Math.round((local - d.getTime()) / 60000);
  const sign = off >= 0 ? '+' : '-', a = Math.abs(off);
  return `${parts.year}-${parts.month}-${parts.day}T${String(parts.hour % 24).padStart(2, '0')}:${parts.minute}:${parts.second}${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}
function dateOnlyStr(d) {                           // heldag: node-ical ger midnatt i serverns tidszon
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function noteTitle(title) {
  const m = /^\s*(🔔|!)\s*(.*)$/u.exec(title || '');
  return m ? { note: true, title: m[2].trim() || '(Ingen titel)' } : { note: false, title: title || '(Ingen titel)' };
}
// Händelser för idag och (days > 1) de närmaste dagarna. Varje händelse
// får "day" (YYYY-MM-DD) = dagen den visas på; en heldagshändelse över
// flera dagar kommer med en gång per dag.
async function icsEventsToday(url, days = 1) {
  if (!icsCache || icsCache.url !== url || Date.now() - icsCache.at > 5 * 60000) {
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error(`Google svarade ${r.status} — stämmer länken?`);
    const text = await r.text();
    if (!/BEGIN:VCALENDAR/.test(text)) throw new Error('Länken gav ingen kalender');
    icsCache = { url, at: Date.now(), data: ical.sync.parseICS(text) };
  }
  const out = [];
  const t0 = stockholmDate();
  for (let k = 0; k < Math.max(1, Math.min(7, days)); k++) {
    const noon = new Date(Date.parse(t0 + 'T12:00:00Z') + k * 86400e3);
    const today = noon.toISOString().slice(0, 10);
    const dayStart = new Date(today + 'T00:00:00' + stockholmIso(noon).slice(19));
    const dayEnd = new Date(dayStart.getTime() + 24 * 3600e3);
    const add = (ev, start, end) => {
      if (!ev || ev.status === 'CANCELLED') return;
      const allDay = !!(ev.start && ev.start.dateOnly) || ev.datetype === 'date';
      const dur = (ev.end && ev.start) ? ev.end - ev.start : 0;
      end = end || new Date(start.getTime() + dur);
      if (allDay) {
        const sd = dateOnlyStr(start), ed = dateOnlyStr(end);
        if (!(sd <= today && (ed > today || ed === sd))) return;
        out.push({ ...noteTitle(String(ev.summary || '')), start: sd, end: ed, allDay: true, location: String(ev.location || ''), day: today });
      } else {
        if (!(start < dayEnd && end > dayStart)) return;
        out.push({ ...noteTitle(String(ev.summary || '')), start: stockholmIso(start), end: stockholmIso(end), allDay: false, location: String(ev.location || ''), day: today });
      }
    };
    for (const ev of Object.values(icsCache.data)) {
      if (!ev || ev.type !== 'VEVENT') continue;
      if (ev.rrule) {
        const dur = ev.end - ev.start;
        for (const occ of ev.rrule.between(new Date(dayStart.getTime() - Math.max(dur, 0) - 36 * 3600e3), new Date(dayEnd.getTime() + 36 * 3600e3), true)) {
          const key = occ.toISOString().slice(0, 10);
          if (ev.exdate && Object.keys(ev.exdate).some(k => k.slice(0, 10) === key && Math.abs(new Date(ev.exdate[k]) - occ) < 60000)) continue;
          const ov = ev.recurrences && Object.entries(ev.recurrences).find(([k]) => k.slice(0, 10) === key);
          if (ov) add(ov[1], ov[1].start, ov[1].end);
          else add(ev, occ, new Date(occ.getTime() + dur));
        }
      } else if (!ev.recurrenceid) add(ev, ev.start, ev.end);
    }
  }
  const seen = new Set();
  return out.filter(e => { const k = e.day + e.title + e.start; return !seen.has(k) && seen.add(k); })
            .sort((a, b) => a.day.localeCompare(b.day) || (a.allDay === b.allDay ? a.start.localeCompare(b.start) : a.allDay ? -1 : 1));
}
app.post('/api/board/calendar', requirePin, async (req, res) => {
  const url = String(req.body.url || '').trim();
  if (!url) { delete boardState.calendarIcs; icsCache = null; touchBoard(); return res.json({ ok: true, calendarSet: false }); }
  if (!ICS_RE.test(url)) return res.status(400).json({ error: 'Klistra in den hemliga adressen i iCal-format från Google Kalender (slutar på .ics)' });
  try {
    const events = await icsEventsToday(url);
    boardState.calendarIcs = url;
    touchBoard();
    res.json({ ok: true, calendarSet: true, today: events.length });
  } catch (e) { icsCache = null; res.status(400).json({ error: 'Kunde inte läsa kalendern: ' + e.message }); }
});

// ── KALENDER (Google Calendar) ──────────────────────────────────
app.get('/api/calendar/today', async (req, res) => {
  if (boardState.calendarIcs) {
    const days = Math.max(1, Math.min(7, parseInt(req.query.days, 10) || 1));
    try { return res.json({ events: await icsEventsToday(boardState.calendarIcs, days), days, source: 'ical' }); }
    catch (e) { return res.status(502).json({ error: 'Kunde inte hämta kalendern: ' + e.message }); }
  }
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    return res.status(400).json({ error: 'Google Calendar är inte konfigurerat (saknar GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN)' });
  }

  try {
    const calendar = getCalendarClient();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Math.max(1, Math.min(7, parseInt(req.query.days, 10) || 1)));

    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (result.data.items || []).map(e => ({
      ...noteTitle(e.summary || ''),
      start: e.start.dateTime || e.start.date,
      end: e.end.dateTime || e.end.date,
      allDay: !e.start.dateTime,
      location: e.location || '',
      day: String(e.start.dateTime || e.start.date || '').slice(0, 10),
    }));

    res.json({ events });
  } catch (e) {
    res.status(502).json({ error: 'Kunde inte hämta kalendern: ' + e.message });
  }
});

// ── EXPORT / IMPORT ──────────────────────────────────────────
app.get('/api/admin/export', adminAuth, (req, res) => {
  // Rensa bilder INNAN export — de ska aldrig lagras i backup
  const cleanMeals = meals.map(m => {
    const c = {...m};
    ['before','after','beforeImage','afterImage'].forEach(k => delete c[k]);
    return c;
  });
  const cleanTasks = tasks.map(t => {
    const c = {...t};
    if (c.photoSubmissions) {
      c.photoSubmissions = Object.fromEntries(
        Object.entries(c.photoSubmissions).map(([day, photos]) => [
          day,
          (photos||[]).map(p => ({ uploadedAt: p.uploadedAt, url: null }))
        ])
      );
    }
    return c;
  });

  const cleanBoard = {
    ...boardState,
    images: boardState.images.map(({ id, name, addedAt }) => ({ id, name, addedAt, data: null })),
  };

  const exportData = {
    version: 5,
    exportedAt: new Date().toISOString(),
    meals: cleanMeals,
    walks,
    tasks: cleanTasks,
    journal,
    glucoseLog,
    pendingApprovals,
    pendingRewards,
    subscriptions,
    notifSettings,
    scheduledPush,
    player,
    mergeState,
    board: cleanBoard,
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
    if (d.journal)          { journal = d.journal; writeJSON(JOURNAL_FILE, journal); }
    if (d.board)            { boardState = { ...DEFAULT_BOARD, ...d.board, images: boardState.images }; writeJSON(BOARD_FILE, boardState); }
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
// Separat, fristående sida (inte del av huvudappens klientrouting) —
// live-förhandsvisning av tavlan + en stor simulerad macropad. Inställningar
// ligger kvar i huvudappen (index.html, Tavlan-kortet); länken dit går via
// /#tavla-installningar.
app.get('/tavla', (req, res) => res.sendFile(path.join(__dirname, 'tavla.html')));
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

// Veckorensning av glukosdata — behåll bara 7 dagar
setInterval(() => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const before = glucoseLog.length;
  glucoseLog = glucoseLog.filter(g => g.time >= sevenDaysAgo);
  if (glucoseLog.length < before) {
    writeJSON(GLUCOSE_FILE, glucoseLog);
    console.log('Veckorensning: tog bort', before - glucoseLog.length, 'gamla glukosmätningar');
  }
}, 24 * 60 * 60 * 1000); // En gång per dygn

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
// ── STEG (Health Connect -> appen HC Webhook -> hit -> Tavlan) ─────────
// Telefonen (Samsung Hälsa / Pixel) skriver steg till Health Connect.
// Appen "HC Webhook" skickar dem hit med jämna mellanrum. Sedan v1.9.19
// skickar den bara stegen SEDAN FÖRRA SYNKEN (dagens post är en bit av
// dagen), så bitarna läggs ihop per dag här — utan dubbelräkning:
//  - samma tidsintervall igen  -> ersätts (inte adderas)
//  - ett intervall som täcker tidigare bitar (t.ex. en hel dag) -> ersätter dem
//  - en bit inuti ett redan mottaget större intervall -> ignoreras
// Skyddas med STEPS_TOKEN (Railway-variabel) i headern X-Steps-Token.
const STEPS_FILE  = path.join(DATA_DIR, 'steps.json');
const STEPS_TOKEN = process.env.STEPS_TOKEN || '';
let stepsState = readJSON(STEPS_FILE, { days: {}, lastPayload: null, lastAt: null });

function stockholmDate(d) {
  // sv-SE ger ÅÅÅÅ-MM-DD
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm',
    year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

function stepRecords(body) {
  // Tolerant mot fältnamn: count/steps/value, start_time/startTime/date
  const list = (body && (body.steps || (body.data && body.data.steps))) || [];
  const out = [];
  for (const r of Array.isArray(list) ? list : []) {
    const count = Number(r.count ?? r.steps ?? r.value);
    let start = r.start_time ?? r.startTime ?? r.start;
    let end   = r.end_time ?? r.endTime ?? r.end;
    if (!start && r.date) {                       // dagspost utan klockslag
      start = r.date + 'T00:00:00';
      end   = r.date + 'T23:59:59';
    }
    const s = Date.parse(start), e = Date.parse(end || start);
    if (!Number.isFinite(count) || !Number.isFinite(s)) continue;
    out.push({ s, e: Number.isFinite(e) ? e : s, c: Math.round(count) });
  }
  return out;
}

function mergeStepRecord(rec) {
  const day = stockholmDate(new Date(rec.s));
  const parts = stepsState.days[day] || (stepsState.days[day] = []);
  const same = parts.find(p => p.s === rec.s && p.e === rec.e);
  if (same) { same.c = rec.c; return; }
  if (parts.some(p => p.s <= rec.s && p.e >= rec.e)) return;           // redan täckt
  stepsState.days[day] = parts.filter(p => !(p.s >= rec.s && p.e <= rec.e)).concat([rec]);
}

app.post('/api/steps', (req, res) => {
  if (!STEPS_TOKEN) return res.status(503).json({ ok: false, error: 'STEPS_TOKEN är inte satt i Railway' });
  const token = req.headers['x-steps-token'] || (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  if (token !== STEPS_TOKEN) return res.status(401).json({ ok: false, error: 'Fel stegnyckel' });

  // Appens "Test Webhook" skickar påhittad exempeldata med "test": true —
  // spara den för kontroll, men räkna den aldrig som riktiga steg.
  if (req.body && req.body.test === true) {
    stepsState.lastPayload = JSON.stringify(req.body).slice(0, 4000);
    stepsState.lastAt = new Date().toISOString();
    writeJSON(STEPS_FILE, stepsState);
    return res.json({ ok: true, test: true, message: 'Testanrop mottaget — inga steg sparade' });
  }

  const records = stepRecords(req.body);
  records.forEach(mergeStepRecord);
  const keep = Object.keys(stepsState.days).sort().slice(-7);          // en vecka räcker
  stepsState.days = Object.fromEntries(keep.map(k => [k, stepsState.days[k]]));
  stepsState.lastPayload = JSON.stringify(req.body).slice(0, 4000);    // för att kontrollera formatet
  stepsState.lastAt = new Date().toISOString();
  writeJSON(STEPS_FILE, stepsState);

  const today = stockholmDate(new Date());
  const total = (stepsState.days[today] || []).reduce((a, p) => a + p.c, 0);
  console.log(`[steg] tog emot ${records.length} poster, idag: ${total}`);
  res.json({ ok: true, records: records.length, today: total });
});

app.get('/api/steps', (req, res) => {
  const today = stockholmDate(new Date());
  const parts = stepsState.days[today] || [];
  res.json({ ok: true, date: today, steps: parts.reduce((a, p) => a + p.c, 0),
             has_data: parts.length > 0, updated: stepsState.lastAt });
});

app.get('/api/steps/debug', (req, res) => {
  if (!STEPS_TOKEN || req.query.token !== STEPS_TOKEN) return res.status(401).json({ ok: false });
  res.json({ lastAt: stepsState.lastAt, lastPayload: stepsState.lastPayload, days: stepsState.days });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Soumaya kör på port ${PORT}`);
  console.log(`🔐 Admin: /admin\n`);
});
