/**
 * SOUMAYA — Achievement System
 * Exporterar ACHIEVEMENTS (definitioner) och checkAchievements(state) → nylåsta
 */

// Karaktärskoppling per kategori
const CHAR = {
  food:    { name: 'GROGU',   color: '#4aff6a' },
  walk:    { name: 'ALLEN',   color: '#1a6bff' },
  glucose: { name: 'BUTCHER', color: '#ff3a2a' },
  streak:  { name: 'INVINCIBLE', color: '#FFD700' },
  special: { name: 'ALLA',    color: '#FFD700' },
};

// ── ACHIEVEMENT-DEFINITIONER ─────────────────────────────────
// type: daily | streak | milestone | special
// tier: bronze | silver | gold | platinum | invincible
// check(state) → boolean  (kallas varje gång något loggas)
const ACHIEVEMENTS = [

  // ════════════════════════════════════
  // MAT — DAGLIGA
  // ════════════════════════════════════
  {
    id: 'food_first',
    title: 'Första tuggan',
    desc: 'Logga din allra första måltid',
    flavor: '*koar triumferande* Du loggade mat! Universum jublar.',
    char: 'food', tier: 'bronze', type: 'milestone',
    icon: '🍽️',
    check: s => s.foodLog.length >= 1,
    xp: 50,
  },
  {
    id: 'food_photo_complete',
    title: 'Fore & After',
    desc: 'Logga en komplett måltid med både före- och efterbild',
    flavor: '*nickar allvarligt* Dokumentation. Bra. Force-approved.',
    char: 'food', tier: 'bronze', type: 'milestone',
    icon: '📸',
    check: s => s.foodLog.some(f => f.complete),
    xp: 75,
  },
  {
    id: 'food_3_today',
    title: 'Tre mål om dagen',
    desc: 'Logga 3 måltider under en dag',
    flavor: '*äter en groda i tankarna* Tre gånger. Perfekt balans.',
    char: 'food', tier: 'bronze', type: 'daily',
    icon: '🌅',
    check: s => mealsToday(s) >= 3,
    xp: 100,
  },
  {
    id: 'food_4_today',
    title: 'Fyra i fyra',
    desc: 'Logga 4 måltider inkl. mellanmål under en dag',
    flavor: '*fnyser godkännande* Mellismästare.',
    char: 'food', tier: 'silver', type: 'daily',
    icon: '🍎',
    check: s => mealsToday(s) >= 4,
    xp: 150,
  },
  {
    id: 'food_breakfast',
    title: 'Morgonhjälte',
    desc: 'Logga frukost före kl 09:00',
    flavor: '*vaknar sakta* Mmm. Frukost. Tidigt. Imponerad.',
    char: 'food', tier: 'bronze', type: 'daily',
    icon: '🌄',
    check: s => s.foodLog.some(f => {
      const d = new Date(f.time);
      return d.toDateString() === new Date().toDateString() &&
             f.mealType === 'frukost' && d.getHours() < 9;
    }),
    xp: 100,
  },
  {
    id: 'food_low_carb',
    title: 'Lågkolhydrare',
    desc: 'Logga en måltid med under 20g kolhydrater',
    flavor: '*stirrar tyst* Blodsockret tackar dig.',
    char: 'food', tier: 'bronze', type: 'milestone',
    icon: '🥗',
    check: s => s.foodLog.some(f => f.carbs > 0 && f.carbs < 20),
    xp: 75,
  },
  {
    id: 'food_10_total',
    title: 'Tio måltider',
    desc: 'Logga totalt 10 måltider',
    flavor: '*koar mjukt* Tio. Bra vana formas.',
    char: 'food', tier: 'bronze', type: 'milestone',
    icon: '🔢',
    check: s => s.foodLog.length >= 10,
    xp: 150,
  },
  {
    id: 'food_50_total',
    title: 'Femtio måltider',
    desc: 'Logga totalt 50 måltider',
    flavor: '*mediterar nöjt* Femtio. Du är en mästare på rutin.',
    char: 'food', tier: 'silver', type: 'milestone',
    icon: '💯',
    check: s => s.foodLog.length >= 50,
    xp: 400,
  },
  {
    id: 'food_100_total',
    title: 'Hundra måltider',
    desc: 'Logga totalt 100 måltider',
    flavor: '*sträcker armarna triumferande* ETT HUNDRA. Legendarisk.',
    char: 'food', tier: 'gold', type: 'milestone',
    icon: '🏆',
    check: s => s.foodLog.length >= 100,
    xp: 1000,
  },
  {
    id: 'food_all_photos',
    title: 'Fotografen',
    desc: 'Logga 10 kompletta måltider med båda bilderna',
    flavor: '*blinkar långsamt* Bildbevis. Äkta engagemang.',
    char: 'food', tier: 'silver', type: 'milestone',
    icon: '📷',
    check: s => s.foodLog.filter(f => f.complete).length >= 10,
    xp: 300,
  },

  // ════════════════════════════════════
  // MAT — STREAKS
  // ════════════════════════════════════
  {
    id: 'food_streak_3',
    title: 'Tre dagar i rad',
    desc: 'Logga mat 3 dagar i följd',
    flavor: '*nickar lugnt* Tre dagar. Vanan börjar.',
    char: 'food', tier: 'bronze', type: 'streak',
    icon: '🔥',
    check: s => foodStreak(s) >= 3,
    xp: 200,
  },
  {
    id: 'food_streak_7',
    title: 'En hel vecka',
    desc: 'Logga mat 7 dagar i följd',
    flavor: '*lyfter handen* En vecka utan avbrott. Grogu är stolt.',
    char: 'food', tier: 'silver', type: 'streak',
    icon: '⭐',
    check: s => foodStreak(s) >= 7,
    xp: 500,
  },
  {
    id: 'food_streak_14',
    title: 'Två veckor stark',
    desc: 'Logga mat 14 dagar i följd',
    flavor: '*mediterar djupt* Fjorton dagar. Kraften flödar.',
    char: 'food', tier: 'silver', type: 'streak',
    icon: '💫',
    check: s => foodStreak(s) >= 14,
    xp: 800,
  },
  {
    id: 'food_streak_30',
    title: 'En månad',
    desc: 'Logga mat 30 dagar i följd',
    flavor: '*faller inte sönder ens när saker är svåra* Trettio dagar. Du är mäktig.',
    char: 'food', tier: 'gold', type: 'streak',
    icon: '🌟',
    check: s => foodStreak(s) >= 30,
    xp: 2000,
  },
  {
    id: 'food_streak_100',
    title: 'Hundra dagars disciplin',
    desc: 'Logga mat 100 dagar i följd',
    flavor: '*bugar djupt* Hundra dagar. Du är Grogu-nivå.',
    char: 'food', tier: 'platinum', type: 'streak',
    icon: '👑',
    check: s => foodStreak(s) >= 100,
    xp: 5000,
  },

  // ════════════════════════════════════
  // RÖRELSE — DAGLIGA
  // ════════════════════════════════════
  {
    id: 'walk_first',
    title: 'Första steget',
    desc: 'Logga din första promenad',
    flavor: 'Earth! Promenader! Utmärkt träningsform! — Allen',
    char: 'walk', tier: 'bronze', type: 'milestone',
    icon: '👟',
    check: s => s.walkLog.length >= 1,
    xp: 50,
  },
  {
    id: 'walk_30_today',
    title: '30 minuter',
    desc: 'Promenera minst 30 minuter på en dag',
    flavor: 'Trettio minuter! Det är typ 0.0001% av vad jag springer, men imponerande för en människa! — Allen',
    char: 'walk', tier: 'bronze', type: 'daily',
    icon: '⏱️',
    check: s => walkMinsToday(s) >= 30,
    xp: 150,
  },
  {
    id: 'walk_60_today',
    title: 'En hel timme',
    desc: 'Promenera minst 60 minuter på en dag',
    flavor: 'En timme! Du är hälften så uthållig som en genomsnittlig Unopan! — Allen',
    char: 'walk', tier: 'silver', type: 'daily',
    icon: '⌚',
    check: s => walkMinsToday(s) >= 60,
    xp: 300,
  },
  {
    id: 'walk_5km',
    title: '5 kilometer',
    desc: 'Gå 5 km under en enda promenad',
    flavor: 'FEM KILOMETER! Jag är genuint imponerad. Genuint! — Allen',
    char: 'walk', tier: 'silver', type: 'milestone',
    icon: '📍',
    check: s => s.walkLog.some(w => (w.distance || 0) >= 5),
    xp: 400,
  },
  {
    id: 'walk_10km',
    title: '10 kilometer',
    desc: 'Gå 10 km under en enda promenad',
    flavor: 'TIO KILOMETER! Om du fortsätter så måste jag anstränga mig för att hålla jämna steg! — Allen',
    char: 'walk', tier: 'gold', type: 'milestone',
    icon: '🏅',
    check: s => s.walkLog.some(w => (w.distance || 0) >= 10),
    xp: 1000,
  },
  {
    id: 'walk_early',
    title: 'Morgonvandrare',
    desc: 'Gå en promenad innan kl 08:00',
    flavor: 'Tidig promenad! Solen är knappt uppe! Du är oövervinnerlig! — Allen',
    char: 'walk', tier: 'bronze', type: 'daily',
    icon: '🌅',
    check: s => s.walkLog.some(w => {
      const d = new Date(w.time);
      return d.toDateString() === new Date().toDateString() && d.getHours() < 8;
    }),
    xp: 200,
  },
  {
    id: 'walk_rain',
    title: 'Regnets hjälte',
    desc: 'Logga en promenad en dag i november–februari',
    flavor: 'Promenad i mörker och kyla! Det är vad hjältar är gjorda av! — Allen',
    char: 'walk', tier: 'silver', type: 'milestone',
    icon: '🌧️',
    check: s => s.walkLog.some(w => {
      const m = new Date(w.time).getMonth();
      return [10,11,0,1].includes(m);
    }),
    xp: 300,
  },
  {
    id: 'walk_total_50km',
    title: '50 km totalt',
    desc: 'Gå totalt 50 km',
    flavor: 'Femtio kilometer! Du har nästan gått till närmaste stad! — Allen',
    char: 'walk', tier: 'silver', type: 'milestone',
    icon: '🗺️',
    check: s => s.walkLog.reduce((a,w) => a+(w.distance||0), 0) >= 50,
    xp: 600,
  },
  {
    id: 'walk_total_100km',
    title: '100 km totalt',
    desc: 'Gå totalt 100 km',
    flavor: 'ETT HUNDRA KILOMETER! Du har promenerat Stockholm–Västerås! — Allen',
    char: 'walk', tier: 'gold', type: 'milestone',
    icon: '🌍',
    check: s => s.walkLog.reduce((a,w) => a+(w.distance||0), 0) >= 100,
    xp: 1500,
  },
  {
    id: 'walk_total_500km',
    title: '500 km totalt',
    desc: 'Gå totalt 500 km',
    flavor: 'FEMHUNDRA KILOMETER! Du är mer uthållig än de flesta varelser jag mött i universum! — Allen',
    char: 'walk', tier: 'platinum', type: 'milestone',
    icon: '🚀',
    check: s => s.walkLog.reduce((a,w) => a+(w.distance||0), 0) >= 500,
    xp: 5000,
  },

  // ════════════════════════════════════
  // RÖRELSE — STREAKS
  // ════════════════════════════════════
  {
    id: 'walk_streak_3',
    title: 'Tre dagars löpare',
    desc: 'Promenera 3 dagar i rad',
    flavor: 'Tre dagar! Momentum bygger! — Allen',
    char: 'walk', tier: 'bronze', type: 'streak',
    icon: '🔥',
    check: s => walkStreak(s) >= 3,
    xp: 200,
  },
  {
    id: 'walk_streak_7',
    title: 'Veckovandring',
    desc: 'Promenera 7 dagar i rad',
    flavor: 'En vecka av promenader! Sju planeter har inget på dig! — Allen',
    char: 'walk', tier: 'silver', type: 'streak',
    icon: '⭐',
    check: s => walkStreak(s) >= 7,
    xp: 500,
  },
  {
    id: 'walk_streak_30',
    title: 'Månadens vandrare',
    desc: 'Promenera 30 dagar i rad',
    flavor: 'TRETTIO DAGAR! Du är fysiskt överlägsen hälften av Gurdians of the Globe! — Allen',
    char: 'walk', tier: 'gold', type: 'streak',
    icon: '🌟',
    check: s => walkStreak(s) >= 30,
    xp: 2500,
  },
  {
    id: 'walk_streak_100',
    title: '100 dagars vandrare',
    desc: 'Promenera 100 dagar i rad',
    flavor: 'HUNDRA DAGAR! Jag rapporterar detta till Galactic Coalition som ett mänskligt underverk! — Allen',
    char: 'walk', tier: 'platinum', type: 'streak',
    icon: '👑',
    check: s => walkStreak(s) >= 100,
    xp: 8000,
  },

  // ════════════════════════════════════
  // BLODSOCKER
  // ════════════════════════════════════
  {
    id: 'glucose_first',
    title: 'Första mätningen',
    desc: 'Logga ditt första blodsocker',
    flavor: 'Oi, nu vet vi vad vi jobbar med. — Butcher',
    char: 'glucose', tier: 'bronze', type: 'milestone',
    icon: '🩸',
    check: s => s.glucoseHistory.length >= 1,
    xp: 50,
  },
  {
    id: 'glucose_in_range',
    title: 'I målzonen',
    desc: 'Håll blodsockret i målzonen hela dagen',
    flavor: 'Stabilt socker hela dagen. Det är vad jag kallar professionellt. — Butcher',
    char: 'glucose', tier: 'silver', type: 'daily',
    icon: '🎯',
    check: s => glucoseInRangeAllDay(s),
    xp: 300,
  },
  {
    id: 'glucose_6_readings',
    title: 'Sex mätningar',
    desc: 'Logga 6 blodsockermätningar på en dag',
    flavor: 'Sex mätningar. Du vet vad som händer i kroppen. Bra. — Butcher',
    char: 'glucose', tier: 'bronze', type: 'daily',
    icon: '📊',
    check: s => glucoseToday(s) >= 6,
    xp: 150,
  },
  {
    id: 'glucose_streak_7',
    title: 'Veckas koll',
    desc: 'Mät blodsockret minst en gång om dagen i 7 dagar',
    flavor: 'Sju dagars koll. Du tar det på allvar. Respekt. — Butcher',
    char: 'glucose', tier: 'silver', type: 'streak',
    icon: '📅',
    check: s => glucoseDailyStreak(s) >= 7,
    xp: 500,
  },
  {
    id: 'glucose_streak_30',
    title: 'Månads koll',
    desc: 'Mät blodsockret varje dag i 30 dagar',
    flavor: 'Trettio dagar utan att missa en mätning. Det är vad jag kallar disciplin. — Butcher',
    char: 'glucose', tier: 'gold', type: 'streak',
    icon: '🏅',
    check: s => glucoseDailyStreak(s) >= 30,
    xp: 2000,
  },
  {
    id: 'glucose_morning',
    title: 'Morgonkollen',
    desc: 'Mät blodsockret inom 30 min efter att du vaknat (före 09:00)',
    flavor: 'Morgonmätning. Perfekt rutin. Det gillar jag. — Butcher',
    char: 'glucose', tier: 'bronze', type: 'daily',
    icon: '⏰',
    check: s => s.glucoseHistory.some(g => {
      const d = new Date(g.time);
      return d.toDateString() === new Date().toDateString() && d.getHours() < 9;
    }),
    xp: 100,
  },
  {
    id: 'glucose_100_readings',
    title: 'Hundra mätningar',
    desc: 'Logga totalt 100 blodsockermätningar',
    flavor: 'Hundra mätningar. Du vet mer om din kropp än de flesta läkare. — Butcher',
    char: 'glucose', tier: 'gold', type: 'milestone',
    icon: '💯',
    check: s => s.glucoseHistory.length >= 100,
    xp: 1000,
  },

  // ════════════════════════════════════
  // KOMBINERADE / STREAK-ÖVERGRIPANDE
  // ════════════════════════════════════
  {
    id: 'combo_perfect_day',
    title: 'Perfekt dag',
    desc: 'Mat + promenad + blodsockermätning — allt på en dag',
    flavor: 'Mat. Rörelse. Koll på sockret. Det är en Invincible-dag. — Alla tre',
    char: 'special', tier: 'silver', type: 'daily',
    icon: '⚡',
    check: s => mealsToday(s) >= 1 && walkMinsToday(s) >= 20 && glucoseToday(s) >= 1,
    xp: 300,
  },
  {
    id: 'combo_perfect_week',
    title: 'Perfekt vecka',
    desc: '7 dagar i rad med mat + promenad + mätning varje dag',
    flavor: '*alla tre nickar i tystnad* En vecka utan kompromiss. Det är legendariskt.',
    char: 'special', tier: 'gold', type: 'streak',
    icon: '🌟',
    check: s => perfectDayStreak(s) >= 7,
    xp: 3000,
  },
  {
    id: 'combo_perfect_month',
    title: 'Perfekt månad',
    desc: '30 dagar i rad med allt',
    flavor: '*universum märker det* Trettio perfekta dagar. Du är Invincible.',
    char: 'special', tier: 'platinum', type: 'streak',
    icon: '🦸',
    check: s => perfectDayStreak(s) >= 30,
    xp: 10000,
  },
  {
    id: 'combo_perfect_100',
    title: 'OÖVERVINNERLIG',
    desc: '100 dagar i rad med allt — du är Invincible',
    flavor: '*Nolan ringer* Du är vad vi hoppades att Invincible skulle bli.',
    char: 'special', tier: 'invincible', type: 'streak',
    icon: '🦸‍♀️',
    check: s => perfectDayStreak(s) >= 100,
    xp: 50000,
  },

  // ════════════════════════════════════
  // SPECIAL / HEJ OCH HÅ
  // ════════════════════════════════════
  {
    id: 'special_birthday',
    title: 'Födelsedag!',
    desc: 'Öppna appen på din födelsedag',
    flavor: 'GRATTIS PÅ FÖDELSEDAGEN! *Grogu, Allen och Butcher dansar* (mest Allen)',
    char: 'special', tier: 'gold', type: 'special',
    icon: '🎂',
    check: s => {
      const now = new Date();
      return now.getMonth() === 2 && now.getDate() === 15; // Byt till rätt datum
    },
    xp: 500,
  },
  {
    id: 'special_night_owl',
    title: 'Nattugglans måltid',
    desc: 'Logga en måltid efter kl 22:00',
    flavor: '*Butcher höjer ögonbrynet* Sent snack. Jag säger inget. Den här gången.',
    char: 'special', tier: 'bronze', type: 'milestone',
    icon: '🦉',
    check: s => s.foodLog.some(f => new Date(f.time).getHours() >= 22),
    xp: 50,
  },
  {
    id: 'special_early_bird',
    title: 'Morgonfågeln',
    desc: 'Öppna appen innan kl 07:00',
    flavor: '*Grogu gäspar men är glad* Tidigt uppe. Bra. Respekt.',
    char: 'special', tier: 'bronze', type: 'milestone',
    icon: '🐦',
    check: s => {
      const h = new Date().getHours();
      return h >= 4 && h < 7 && s.appOpens > 0;
    },
    xp: 100,
  },
  {
    id: 'special_xdrip_connected',
    title: 'CGM-proffset',
    desc: 'Anslut xDrip+ till appen',
    flavor: 'Realtidsdata! Nu kan Butcher hålla koll utan att du behöver göra något. Nästan.',
    char: 'glucose', tier: 'silver', type: 'milestone',
    icon: '📡',
    check: s => s.cgmConnected,
    xp: 200,
  },
  {
    id: 'special_comeback',
    title: 'Comeback kid',
    desc: 'Logga aktivitet efter 3+ dagars uppehåll',
    flavor: 'Du är tillbaka. Vi frågade inte varför. Vi är bara glada. — Alla tre',
    char: 'special', tier: 'silver', type: 'special',
    icon: '💪',
    check: s => {
      if (s.foodLog.length < 2) return false;
      const sorted = [...s.foodLog].sort((a,b) => b.time - a.time);
      if (sorted.length < 2) return false;
      const gap = sorted[0].time - sorted[1].time;
      return gap > 3 * 24 * 3600 * 1000;
    },
    xp: 300,
  },
  {
    id: 'special_weekend_warrior',
    title: 'Helgkrigaren',
    desc: 'Logga aktivitet både lördag och söndag',
    flavor: 'Helgen är INTE en vilodagar för hjältar! — Allen',
    char: 'walk', tier: 'bronze', type: 'milestone',
    icon: '🏄',
    check: s => {
      const days = new Set(s.foodLog.map(f => new Date(f.time).getDay()));
      return days.has(6) && days.has(0);
    },
    xp: 150,
  },
  {
    id: 'special_grogu_approved',
    title: 'Grogu-godkänd',
    desc: 'Logga 5 kompletta måltider med bilder',
    flavor: '*mediterar och öppnar ögonen* Godkänd. Du matchar Grogu-standarden.',
    char: 'food', tier: 'silver', type: 'milestone',
    icon: '🐸',
    check: s => s.foodLog.filter(f => f.complete).length >= 5,
    xp: 250,
  },
  {
    id: 'special_allen_approved',
    title: 'Allen-godkänd',
    desc: 'Promenera totalt 20 km',
    flavor: 'Tjugo kilometer! Du är officiellt starkare än en genomsnittlig Martian! — Allen',
    char: 'walk', tier: 'silver', type: 'milestone',
    icon: '💪',
    check: s => s.walkLog.reduce((a,w) => a+(w.distance||0), 0) >= 20,
    xp: 400,
  },
  {
    id: 'special_butcher_approved',
    title: 'Butcher-godkänd',
    desc: 'Håll blodsockret i målzon tre dagar i rad',
    flavor: '...Okej. Du gör det bra. Säg inte att jag sa det. — Butcher',
    char: 'glucose', tier: 'gold', type: 'streak',
    icon: '🔪',
    check: s => inRangeStreak(s) >= 3,
    xp: 800,
  },
];

// ── HJÄLPFUNKTIONER ──────────────────────────────────────────
function todayStr(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.toISOString().split('T')[0];
}

function mealsToday(s) {
  const today = todayStr();
  return s.foodLog.filter(f => todayStr(f.time) === today).length;
}

function walkMinsToday(s) {
  const today = todayStr();
  return s.walkLog.filter(w => todayStr(w.time) === today).reduce((a,w) => a + w.minutes, 0);
}

function glucoseToday(s) {
  const today = todayStr();
  return s.glucoseHistory.filter(g => todayStr(g.time) === today).length;
}

function glucoseInRangeAllDay(s) {
  const today = todayStr();
  const readings = s.glucoseHistory.filter(g => todayStr(g.time) === today);
  if (readings.length < 3) return false;
  const low = s.settings?.lowTarget || 4;
  const high = s.settings?.highTarget || 8;
  return readings.every(g => g.val >= low && g.val <= high);
}

function glucoseInRange(g, s) {
  const low = s.settings?.lowTarget || 4;
  const high = s.settings?.highTarget || 8;
  return g.val >= low && g.val <= high;
}

function foodStreak(s) {
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const str = d.toISOString().split('T')[0];
    if (s.foodLog.some(f => todayStr(f.time) === str)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function walkStreak(s) {
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const str = d.toISOString().split('T')[0];
    if (s.walkLog.some(w => todayStr(w.time) === str)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function glucoseDailyStreak(s) {
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const str = d.toISOString().split('T')[0];
    if (s.glucoseHistory.some(g => todayStr(g.time) === str)) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function perfectDayStreak(s) {
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const str = d.toISOString().split('T')[0];
    const hm = s.foodLog.some(f => todayStr(f.time) === str);
    const hw = s.walkLog.some(w => todayStr(w.time) === str);
    const hg = s.glucoseHistory.some(g => todayStr(g.time) === str);
    if (hm && hw && hg) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function inRangeStreak(s) {
  const low = s.settings?.lowTarget || 4;
  const high = s.settings?.highTarget || 8;
  let streak = 0;
  const d = new Date();
  while (streak < 365) {
    const str = d.toISOString().split('T')[0];
    const readings = s.glucoseHistory.filter(g => todayStr(g.time) === str);
    if (readings.length > 0 && readings.every(g => g.val >= low && g.val <= high)) {
      streak++; d.setDate(d.getDate()-1);
    } else break;
  }
  return streak;
}

// ── HUVUD-KOLL ───────────────────────────────────────────────
/**
 * Kör igenom alla achievements, returnerar array av nylåsta IDs.
 * @param {Object} state - App-state
 * @param {Array} alreadyUnlocked - Tidigare upplåsta IDs
 * @returns {Array} - Nylåsta achievements
 */
function checkAchievements(state, alreadyUnlocked = []) {
  const newlyUnlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (alreadyUnlocked.includes(a.id)) continue;
    try {
      if (a.check(state)) newlyUnlocked.push(a);
    } catch(e) {}
  }
  return newlyUnlocked;
}

// Achievement-bilder (om CHAR_IMGS finns)
function getAchIcon(a) {
  if (typeof CHAR_IMGS === 'undefined') return { type: 'emoji', val: a.icon };
  const imgMap = {
    'food_first':          { type: 'img', src: 'grogu_flat', label: a.icon },
    'food_photo_complete': { type: 'img', src: 'grogu_flat', label: a.icon },
    'food_streak_7':       { type: 'img', src: 'grogu_avatar', label: a.icon },
    'food_streak_30':      { type: 'img', src: 'grogu_speech', label: a.icon },
    'food_100_total':      { type: 'img', src: 'grogu_avatar', label: a.icon },
    'walk_first':          { type: 'img', src: 'allen_badge', label: a.icon },
    'walk_streak_7':       { type: 'img', src: 'allen_avatar', label: a.icon },
    'walk_streak_30':      { type: 'img', src: 'allen_avatar', label: a.icon },
    'walk_total_100km':    { type: 'img', src: 'allen_speech', label: a.icon },
    'walk_total_500km':    { type: 'img', src: 'allen_speech', label: a.icon },
    'glucose_first':       { type: 'img', src: 'omni_badge', label: a.icon },
    'glucose_in_range':    { type: 'img', src: 'omni_avatar', label: a.icon },
    'special_butcher_approved': { type: 'img', src: 'omni_speech', label: a.icon },
    'combo_perfect_day':   { type: 'img', src: 'invincible_badge', label: a.icon },
    'combo_perfect_week':  { type: 'img', src: 'invincible_avatar', label: a.icon },
    'combo_perfect_month': { type: 'img', src: 'invincible_avatar', label: a.icon },
    'combo_perfect_100':   { type: 'img', src: 'invincible_avatar', label: a.icon },
    'special_night_owl':   { type: 'img', src: 'vader_badge', label: a.icon },
    'special_early_bird':  { type: 'img', src: 'stormtrooper_badge', label: a.icon },
    'special_grogu_approved': { type: 'img', src: 'grogu_speech', label: a.icon },
    'special_allen_approved': { type: 'img', src: 'allen_speech', label: a.icon },
    'food_streak_100':     { type: 'img', src: 'grogu_avatar', label: a.icon },
    'walk_streak_100':     { type: 'img', src: 'allen_avatar', label: a.icon },
  };
  return imgMap[a.id] || { type: 'emoji', val: a.icon };
}

// Export för Node.js (server) och browser (global)
if (typeof module !== 'undefined') {
  module.exports = { ACHIEVEMENTS, checkAchievements };
} else {
  window.ACHIEVEMENTS = ACHIEVEMENTS;
  window.checkAchievements = checkAchievements;
  window.getAchIcon = getAchIcon;
}
