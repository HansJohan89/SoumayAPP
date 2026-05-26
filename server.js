/**
 * Soumaya App — Server
 * Kör med vanlig HTTP (Railway sköter HTTPS externt)
 */

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const webpush  = require('web-push');
const multer   = require('multer');

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
const SUBS_FILE    = path.join(DATA_DIR, 'subscriptions.json');
const MEALS_FILE   = path.join(DATA_DIR, 'meals.json');
const WALKS_FILE   = path.join(DATA_DIR, 'walks.json');
const TASKS_FILE   = path.join(DATA_DIR, 'tasks.json');
const GLUCOSE_FILE = path.join(DATA_DIR, 'glucose.json');

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch(e) { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let subscriptions = readJSON(SUBS_FILE, []);
let meals         = readJSON(MEALS_FILE, []);
let walks         = readJSON(WALKS_FILE, []);
let tasks         = readJSON(TASKS_FILE, []);
let glucoseLog    = readJSON(GLUCOSE_FILE, []);

// ── MULTER ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── EXPRESS ──────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname), {
  setHeaders(res, fp) {
    if (fp.endsWith('sw.js')) {
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Service-Worker-Allowed', '/');
    }
    if (fp.endsWith('manifest.json'))
      res.setHeader('Content-Type', 'application/manifest+json');
  }
}));
app.use('/uploads', express.static(UPLOADS_DIR));

// ── AUTH ─────────────────────────────────────────────────────
const adminSessions = new Set();

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token && adminSessions.has(token)) return next();
  res.status(401).json({ error: 'Ej autentiserad' });
}

app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    adminSessions.add(token);
    res.json({ ok: true, token });
  } else {
    res.status(401).json({ error: 'Fel lösenord' });
  }
});

app.post('/api/admin/logout', adminAuth, (req, res) => {
  adminSessions.delete(req.headers['x-admin-token']);
  res.json({ ok: true });
});

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
app.post('/api/meals/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Ingen fil' });
  const { mealId, phase } = req.body;
  if (!mealId || !['before','after'].includes(phase))
    return res.status(400).json({ error: 'Saknar mealId/phase' });

  const url = `/uploads/${req.file.filename}`;
  let meal = meals.find(m => m.id === mealId);
  if (!meal) {
    meal = { id: mealId, createdAt: Date.now(), before: null, after: null, name: '', carbs: 0, mealType: '' };
    meals.unshift(meal);
  }
  meal[phase] = url;
  meal[phase + 'Time'] = Date.now();
  if (meal.before && meal.after) meal.complete = true;
  writeJSON(MEALS_FILE, meals);
  res.json({ ok: true, url, meal });
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

app.get('/api/meals', adminAuth, (req, res) => res.json(meals.slice(0, 100)));

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
  }
  res.json({ ok: true, walk });
});

app.get('/api/walks', adminAuth, (req, res) => res.json(walks.slice(0, 50)));
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
app.post('/api/glucose', (req, res) => {
  const { val, source, time } = req.body;
  if (!val) return res.status(400).json({ error: 'Saknar val' });
  const entry = { val, source: source || 'manual', time: time || Date.now() };
  glucoseLog.push(entry);
  if (glucoseLog.length > 500) glucoseLog.shift();
  writeJSON(GLUCOSE_FILE, glucoseLog);
  res.json({ ok: true });
});

app.get('/api/glucose', adminAuth, (req, res) => {
  res.json(glucoseLog.slice(-(parseInt(req.query.count) || 48)));
});

// ── UPPGIFTER ─────────────────────────────────────────────────
app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', adminAuth, (req, res) => {
  const task = {
    id: crypto.randomUUID(),
    title: req.body.title,
    description: req.body.description || '',
    type: req.body.type || 'daily',
    reward: req.body.reward || '',
    xpReward: parseInt(req.body.xpReward) || 0,
    goldReward: parseInt(req.body.goldReward) || 0,
    requirePhotos: req.body.requirePhotos === true || req.body.requirePhotos === 'true',
    photoCount: parseInt(req.body.photoCount) || 1,
    icon: req.body.icon || '⭐',
    difficulty: req.body.difficulty || 'normal',
    active: true,
    completions: {},   // { 'YYYY-MM-DD': true } för dagliga
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

// Markera uppgift som slutförd (från appen, ej admin)
app.post('/api/tasks/:id/complete', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Hittades ej' });
  const today = new Date().toISOString().split('T')[0];
  if (!task.completions) task.completions = {};
  task.completions[today] = true;
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true, xpReward: task.xpReward || 0, goldReward: task.goldReward || 0 });
});

app.delete('/api/tasks/:id', adminAuth, (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  writeJSON(TASKS_FILE, tasks);
  res.json({ ok: true });
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
    today: {
      meals:    todayMeals.length,
      mealsOk:  todayMeals.filter(m => m.complete).length,
      walkMins: todayWalks.reduce((a,w) => a+w.duration, 0),
      walkKm:   todayWalks.reduce((a,w) => a+(w.distance||0), 0).toFixed(1),
    },
    streak,
    lastGlucose,
    glucoseHistory: glucoseLog.slice(-24),
    recentMeals:    meals.slice(0, 5),
    recentWalks:    walks.slice(0, 5),
    tasks,
    subscriptions:  subscriptions.length
  });
});

// ── ADMIN HTML ───────────────────────────────────────────────
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// ── SCHEMALAGDA PÅMINNELSER ──────────────────────────────────
let lastFood = 0, lastWalk = 0, lastGluc = 0;
setInterval(async () => {
  const now = Date.now(), h = new Date().getHours();
  if (h < 7 || h >= 22) return;
  if (now - lastFood > 4*3600000) {
    await pushToAll('Dags att äta! 🐸', '*stirrar intensivt* ...mat?', 'food');
    lastFood = now;
  }
  if (h === 10 && now - lastWalk > 20*3600000) {
    await pushToAll('Dags för promenad! 💪', 'Allen väntar på dig!', 'walk');
    lastWalk = now;
  }
  if (now - lastGluc > 3*3600000) {
    await pushToAll('Mät blodsockret!', 'Håller koll. — Omni-Man', 'glucose');
    lastGluc = now;
  }
}, 30*60*1000);

// ── STARTA ───────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Soumaya kör på port ${PORT}`);
  console.log(`🔐 Admin: /admin\n`);
});
