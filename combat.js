// ═══════════════════════════════════════════════════════════════
// SOUMAYA RPG — KOMPLETT STRIDSSYSTEM v2
// ═══════════════════════════════════════════════════════════════

const LEVEL_TABLE = [
  { level:1,  xpReq:0,      title:'Nykomling',    avatar:'grogu_avatar',       statPts:0 },
  { level:2,  xpReq:500,    title:'Lärling',      avatar:'grogu_avatar',       statPts:2 },
  { level:3,  xpReq:1200,   title:'Väktare',      avatar:'allen_avatar',       statPts:2 },
  { level:4,  xpReq:2500,   title:'Försvarare',   avatar:'allen_avatar',       statPts:2 },
  { level:5,  xpReq:4500,   title:'Krigare',      avatar:'omni_avatar',        statPts:3 },
  { level:6,  xpReq:7500,   title:'Veteran',      avatar:'omni_avatar',        statPts:3 },
  { level:7,  xpReq:12000,  title:'Hjälte',       avatar:'invincible_avatar',  statPts:3 },
  { level:8,  xpReq:18000,  title:'Mästare',      avatar:'invincible_avatar',  statPts:4 },
  { level:9,  xpReq:26000,  title:'Champion',     avatar:'invincible_badge',   statPts:4 },
  { level:10, xpReq:36000,  title:'Legend',       avatar:'invincible_badge',   statPts:4 },
  { level:11, xpReq:50000,  title:'Övermänniska', avatar:'omni_badge',         statPts:5 },
  { level:12, xpReq:68000,  title:'INVINCIBLE',   avatar:'omni_badge',         statPts:5 },
  { level:13, xpReq:90000,  title:'Mytisk',       avatar:'omni_badge',         statPts:5 },
  { level:14, xpReq:120000, title:'Kosmisk',      avatar:'invincible_badge',   statPts:6 },
  { level:15, xpReq:160000, title:'Gudinna',      avatar:'invincible_badge',   statPts:6 },
];

function getLevelData(xp) {
  let current = LEVEL_TABLE[0];
  for (const l of LEVEL_TABLE) { if (xp >= l.xpReq) current = l; else break; }
  const nextIdx = LEVEL_TABLE.indexOf(current) + 1;
  const next = LEVEL_TABLE[nextIdx] || null;
  return { current, next, progress: next ? (xp - current.xpReq) / (next.xpReq - current.xpReq) : 1 };
}

function getBaseStats(level) {
  return {
    STY: 3 + Math.floor(level * 0.9),
    SMI: 3 + Math.floor(level * 0.8),
    KON: 3 + Math.floor(level * 1.0),
    INT: 2 + Math.floor(level * 0.7),
  };
}
function getMaxHp(kon, level) { return 20 + kon * 4 + level * 6; }
function getHeroAC(equipment) {
  let ac = 10;
  if (equipment) Object.values(equipment).forEach(id => {
    if (!id) return;
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (item && item.acBonus) ac += item.acBonus;
  });
  return ac;
}

// ── SHOP ITEMS ───────────────────────────────────────────────────
const SHOP_ITEMS = [
  // VAPEN T1
  { id:'stick',          tier:1, minLevel:1,  name:'Käpp',               type:'weapon', slot:'weapon',    cost:20,   icon:'🪵', desc:'En enkel käpp. Bättre än ingenting.', dmgBonus:0 },
  { id:'rusty_dagger',   tier:1, minLevel:1,  name:'Rostig dolk',        type:'weapon', slot:'weapon',    cost:40,   icon:'🗡️', desc:'Smutsig men vass. +1 skada.',        dmgBonus:1, special:'fastDraw' },
  { id:'short_sword',    tier:1, minLevel:2,  name:'Kortsvärd',          type:'weapon', slot:'weapon',    cost:80,   icon:'⚔️', desc:'Pålitlig och snabb. +2 skada.',      dmgBonus:2, strBonus:1 },
  { id:'war_hammer',     tier:1, minLevel:2,  name:'Stridsklubba',       type:'weapon', slot:'weapon',    cost:90,   icon:'🔨', desc:'Trubbig kraft. Kraftslag +2.',        dmgBonus:2, strBonus:1, special:'powerBonus' },
  // VAPEN T2
  { id:'battle_axe',     tier:2, minLevel:3,  name:'Stridsyxa',          type:'weapon', slot:'weapon',    cost:160,  icon:'🪓', desc:'Tung och dödlig. Kraftslag +4.',     dmgBonus:3, strBonus:2, special:'powerBonus' },
  { id:'rapier',         tier:2, minLevel:3,  name:'Värja',              type:'weapon', slot:'weapon',    cost:150,  icon:'🤺', desc:'Elegant precision. Krit 18-20.',     dmgBonus:2, agiBonus:2, special:'sharpCrit' },
  { id:'staff',          tier:2, minLevel:4,  name:'Magisk stav',        type:'weapon', slot:'weapon',    cost:200,  icon:'🪄', desc:'Kanar INT till skada.',              dmgBonus:2, intBonus:3, special:'intAttack' },
  { id:'dual_blades',    tier:2, minLevel:4,  name:'Dubbla dolkar',      type:'weapon', slot:'weapon',    cost:220,  icon:'🔪', desc:'Dubbel +3 skada per slag.',         dmgBonus:1, agiBonus:2, special:'dualBonus' },
  // VAPEN T3
  { id:'greatsword',     tier:3, minLevel:6,  name:'Tvåhandssvärd',      type:'weapon', slot:'weapon',    cost:380,  icon:'🗡️', desc:'Massiv skada. d12 bashugg.',        dmgBonus:4, strBonus:3, special:'greatSword' },
  { id:'shadow_blades',  tier:3, minLevel:6,  name:'Skuggdolkar',        type:'weapon', slot:'weapon',    cost:420,  icon:'🌑', desc:'Tre snabba slag med SMI.',          dmgBonus:2, agiBonus:4, special:'tripleStrike' },
  { id:'warlock_tome',   tier:3, minLevel:7,  name:'Häxmästarboken',     type:'weapon', slot:'weapon',    cost:460,  icon:'📕', desc:'INT×2 skada vid Special. Läker 20%.', dmgBonus:2, intBonus:5, special:'lifeDrain' },
  { id:'titan_maul',     tier:3, minLevel:8,  name:'Titanklubba',        type:'weapon', slot:'weapon',    cost:500,  icon:'🔱', desc:'STY +5. Avrättar under 10 HP.',     dmgBonus:5, strBonus:5, special:'executioner' },
  // VAPEN T4
  { id:'solar_blade',    tier:4, minLevel:10, name:'Solsvärd',           type:'weapon', slot:'weapon',    cost:900,  icon:'☀️', desc:'+2d6 eldskada vid varje hugg.',     dmgBonus:5, strBonus:3, special:'fireDmg' },
  { id:'void_sickle',    tier:4, minLevel:10, name:'Tomrumsskäran',      type:'weapon', slot:'weapon',    cost:950,  icon:'🌀', desc:'Stjäl 25% av fiendeskada som HP.',  dmgBonus:4, intBonus:4, special:'voidSteal' },
  { id:'invincible_fists',tier:4,minLevel:12, name:'Invincible-nävar',   type:'weapon', slot:'weapon',    cost:1500, icon:'💥', desc:'Alla attacker träffar. Krit 15-20.', dmgBonus:6, strBonus:6, special:'alwaysHit' },

  // RUSTNING T1
  { id:'cloth',          tier:1, minLevel:1,  name:'Tygdräkt',           type:'armor',  slot:'armor',     cost:30,   icon:'👕', desc:'Bättre än ingenting. AC +1.',        acBonus:1 },
  { id:'leather',        tier:1, minLevel:1,  name:'Läderrustning',      type:'armor',  slot:'armor',     cost:70,   icon:'🧥', desc:'Lätt och smidig. AC +2.',            acBonus:2 },
  { id:'hide',           tier:1, minLevel:2,  name:'Djurskinsrustning',  type:'armor',  slot:'armor',     cost:110,  icon:'🦺', desc:'Tjock hud. AC +3, KON +1.',         acBonus:3, konBonus:1 },
  // RUSTNING T2
  { id:'chainmail',      tier:2, minLevel:3,  name:'Ringbrynja',         type:'armor',  slot:'armor',     cost:200,  icon:'🛡️', desc:'Klassiskt skydd. AC +4, KON +1.',   acBonus:4, konBonus:1 },
  { id:'scale',          tier:2, minLevel:4,  name:'Fjällrustning',      type:'armor',  slot:'armor',     cost:280,  icon:'🐲', desc:'Dragskalor. AC +5. Eldsmotstång.',  acBonus:5, konBonus:1, special:'fireRes' },
  { id:'splint',         tier:2, minLevel:5,  name:'Splintpansar',       type:'armor',  slot:'armor',     cost:350,  icon:'⚙️', desc:'Mekanisk. AC +5, STY +1.',         acBonus:5, strBonus:1 },
  // RUSTNING T3
  { id:'plate',          tier:3, minLevel:6,  name:'Plattrustning',      type:'armor',  slot:'armor',     cost:500,  icon:'🛡️', desc:'Tung men ogenomtränglig. AC +6.',   acBonus:6, konBonus:2 },
  { id:'mithril',        tier:3, minLevel:8,  name:'Mitrilsarken',       type:'armor',  slot:'armor',     cost:750,  icon:'💎', desc:'Lätt som fjäder. AC +7, SMI +1.',   acBonus:7, agiBonus:1 },
  { id:'shadow_weave',   tier:3, minLevel:8,  name:'Skuggväv',           type:'armor',  slot:'armor',     cost:700,  icon:'🌑', desc:'Dodge +15%, AC +5.',                acBonus:5, special:'shadowDodge' },
  // RUSTNING T4
  { id:'dragonplate',    tier:4, minLevel:10, name:'Drakplåtrustning',   type:'armor',  slot:'armor',     cost:1200, icon:'🐉', desc:'Smidd av drakskal. AC +8, KON +3.', acBonus:8, konBonus:3 },
  { id:'void_armor',     tier:4, minLevel:12, name:'Tomrumsrustning',    type:'armor',  slot:'armor',     cost:1600, icon:'🌀', desc:'Absorberar 20% av all skada. AC +7.', acBonus:7, special:'dmgAbsorb' },

  // ACCESSOARER T1
  { id:'lucky_coin',     tier:1, minLevel:1,  name:'Lyckömynt',          type:'accessory', slot:'accessory', cost:35,  icon:'🪙', desc:'Omslå en miss om dagen.',            special:'reroll' },
  { id:'iron_ring',      tier:1, minLevel:1,  name:'Järnring',           type:'accessory', slot:'accessory', cost:50,  icon:'💍', desc:'STY +2.',                            strBonus:2 },
  { id:'swift_boots',    tier:1, minLevel:2,  name:'Snabbhetsstövlar',   type:'accessory', slot:'accessory', cost:90,  icon:'👢', desc:'SMI +2.',                            agiBonus:2 },
  // ACCESSOARER T2
  { id:'lucky_charm',    tier:2, minLevel:3,  name:'Lyckobringare',      type:'accessory', slot:'accessory', cost:130, icon:'🍀', desc:'Kritisk träff på 18-20.',           special:'sharpCrit' },
  { id:'power_ring',     tier:2, minLevel:3,  name:'Kraftring',          type:'accessory', slot:'accessory', cost:170, icon:'💍', desc:'STY +3.',                            strBonus:3 },
  { id:'mana_pendant',   tier:2, minLevel:4,  name:'Manahalsband',       type:'accessory', slot:'accessory', cost:190, icon:'📿', desc:'INT +3.',                            intBonus:3 },
  { id:'thorn_bracers',  tier:2, minLevel:4,  name:'Törnarmband',        type:'accessory', slot:'accessory', cost:210, icon:'🌹', desc:'Returnerar 3 skada vid varje träff.', special:'thorns' },
  // ACCESSOARER T3
  { id:'vampiric_ring',  tier:3, minLevel:6,  name:'Vampyrring',         type:'accessory', slot:'accessory', cost:380, icon:'🩸', desc:'Läker 15% av utdelad skada.',       special:'vampiric' },
  { id:'berserker_helm', tier:3, minLevel:6,  name:'Bärsärkarhjälm',    type:'accessory', slot:'accessory', cost:420, icon:'🪖', desc:'Under 25% HP: dubbel STY.',          special:'berserk' },
  { id:'evasion_cloak',  tier:3, minLevel:7,  name:'Undvikelsekappa',    type:'accessory', slot:'accessory', cost:450, icon:'🧣', desc:'25% chans att dodga helt.',          special:'evasion' },
  { id:'arcane_focus',   tier:3, minLevel:8,  name:'Arkanfokus',         type:'accessory', slot:'accessory', cost:480, icon:'🔮', desc:'INT +5. Special +2d6 extra.',       intBonus:5, special:'arcaneFocus' },
  // ACCESSOARER T4
  { id:'ring_of_power',  tier:4, minLevel:10, name:'Kraftens Ring',      type:'accessory', slot:'accessory', cost:1000,icon:'💎', desc:'STY+6, SMI+3, INT+3.',              strBonus:6, agiBonus:3, intBonus:3 },
  { id:'phoenix_feather',tier:4, minLevel:11, name:'Fenixfjäder',        type:'accessory', slot:'accessory', cost:1200,icon:'🔥', desc:'Återuppstå en gång med 30% HP.',    special:'phoenix' },
  { id:'void_eye',       tier:4, minLevel:12, name:'Tomrumsögat',        type:'accessory', slot:'accessory', cost:1400,icon:'👁️', desc:'Alla anfall är kritiska.',          special:'allCrit' },

  // DRYCKER
  { id:'health_potion',  tier:1, minLevel:1,  name:'Hälsodryck',         type:'potion', slot:'potion',    cost:25,   icon:'🧪', desc:'Läker 30 HP under strid.',           healAmt:30 },
  { id:'great_potion',   tier:2, minLevel:4,  name:'Stor hälsodryck',    type:'potion', slot:'potion',    cost:80,   icon:'💚', desc:'Läker 75 HP under strid.',           healAmt:75 },
  { id:'elixir',         tier:3, minLevel:7,  name:'Eliksir',            type:'potion', slot:'potion',    cost:200,  icon:'✨', desc:'Läker fullt HP + STY +3 i 3 rundor.', healAmt:999, special:'elixirBuff' },
  { id:'rage_potion',    tier:2, minLevel:3,  name:'Raseri-dryck',       type:'potion', slot:'potion',    cost:90,   icon:'🔴', desc:'+5 STY, -3 AC i 3 rundor.',          special:'rageBuff' },
  { id:'shadow_potion',  tier:3, minLevel:6,  name:'Skuggelixir',        type:'potion', slot:'potion',    cost:160,  icon:'🌑', desc:'Nästa attack = automatisk krit.',   special:'critBuff' },

  // RUNOR
  { id:'rune_stone',     tier:2, minLevel:3,  name:'Runsten',            type:'rune',   slot:'rune',      cost:120,  icon:'🪨', desc:'+2 till alla slag.',                 special:'demonSlayer' },
  { id:'rune_blood',     tier:3, minLevel:6,  name:'Blodruna',           type:'rune',   slot:'rune',      cost:350,  icon:'🩸', desc:'Strid börjar med +20 HP.',           special:'bloodRune' },
  { id:'rune_storm',     tier:3, minLevel:7,  name:'Åskoruna',           type:'rune',   slot:'rune',      cost:400,  icon:'⚡', desc:'10% chans: blixta 2d10.',           special:'lightning' },
  { id:'rune_void',      tier:4, minLevel:10, name:'Tomrumsruna',        type:'rune',   slot:'rune',      cost:800,  icon:'🌀', desc:'Kraftslag missar aldrig.',           special:'voidPower' },
];

// ── FIENDER — 5 ZONER ────────────────────────────────────────────
const ENEMY_TEMPLATES = [

  // ZON 1 (lvl 1-4)
  { id:'sugar_slime',   name:'Sockerblobben',     icon:'🟢', zone:1, minLevel:1, maxLevel:4,
    flavor:'En klibbig klump socker som rullar mot dig.',
    lore:'Uppstod ur ett övergett godispaket på parkeringshuset.',
    stats:{STY:5,SMI:2,KON:5,INT:0}, hp:28, ac:11,
    attacks:['Sockerblobben klibbsmachar!','Sockerblobben försöker omfamna dig med sina kladdiga tentakler!','Sockerblobben kastar en klibbboll rakt mot ansiktet!'],
    deathLine:'"...söttttt..." SPLAT. Sockerblobben exploderar i karamellrök.',
    winLine:'"Du smakar gott." Blobben absorberar dig sakta.',
    xpReward:55, goldReward:14 },

  { id:'sugar_goblin',  name:'Sockergoblinen',    icon:'👺', zone:1, minLevel:1, maxLevel:4,
    flavor:'En liten grön varelse som skriker om glykosindex.',
    lore:'Lever i källaren och äter bara korvbröd och läsk.',
    stats:{STY:6,SMI:7,KON:4,INT:3}, hp:32, ac:13,
    attacks:['Goblinen kastar en godispåse med kirurgisk precision!','Goblinen nafsar med vassa sockertänder!','Goblinen hyperventilerar och ruschar med full fart!'],
    deathLine:'"Inga fler snacks..." Goblinen kraschar i tomma godispåsar.',
    winLine:'Goblinen stoppar en kola i fickan. "Du var tråkig." Sen springer den.',
    xpReward:65, goldReward:18 },

  { id:'calorie_rat',   name:'Kalorieråttan',     icon:'🐀', zone:1, minLevel:1, maxLevel:4,
    flavor:'En onaturligt stor råtta med en miniräknare.',
    lore:'Muterade efter år i sjukhusmatsalens magasin.',
    stats:{STY:4,SMI:9,KON:4,INT:5}, hp:30, ac:14,
    attacks:['Råttan nafsar med blixthastighet!','Råttan springer cirklar tills du tappar balansen!','Råttan kastar miniräknaren med dödlig precision!'],
    deathLine:'"Den... totala kalorimängden..." Råttan kollapsar.',
    winLine:'"Din insulindos är FEL!" Råttan springer iväg med ditt snacks.',
    xpReward:60, goldReward:16 },

  { id:'lazy_golem',    name:'Latmasksgolemen',   icon:'🪨', zone:1, minLevel:2, maxLevel:5,
    flavor:'En golem gjord av soffkuddar. Rör sig i slow motion — men varje slag är fruktansvärt.',
    lore:'Skapades av ackumulerad couch-potato-energi. Tung som ett berg.',
    stats:{STY:10,SMI:1,KON:14,INT:0}, hp:65, ac:13,
    attacks:['Golemen faller mot dig med hela sin vikt!','Golemen kastar fjärrkontrollen som ett projektil!','Golemen sätter sig på dig — 60kg tyngd!'],
    deathLine:'"...hade kunnat se på film..." Golemen löses upp i sofffjädrar.',
    winLine:'"Orkar inte..." Golemen kollar Netflix. Du är fortfarande under den.',
    xpReward:90, goldReward:28 },

  // ZON 2 (lvl 3-7)
  { id:'burnout_wraith',name:'Utmattningsanden',  icon:'👻', zone:2, minLevel:3, maxLevel:7,
    flavor:'En ande gjord av missade deadlines och kall kaffe.',
    lore:'Spöket av en produktivitetsguru som gick in i väggen.',
    stats:{STY:3,SMI:7,KON:3,INT:6}, hp:35, ac:13,
    attacks:['Anden dränerar din energi!','Anden skickar paniknotiser!','Anden visar din att-göra-lista!'],
    deathLine:'"Vila... äntligen..." Anden löses upp i ett mjukt ljus.',
    winLine:'Anden visar dig 47 olästa mail. Du svimmar.',
    xpReward:100, goldReward:30 },

  { id:'cortisol_knight',name:'Kortisolriddaren', icon:'⚔️', zone:2, minLevel:4, maxLevel:8,
    flavor:'En riddare i stresshormonernas rustning.',
    lore:'Har aldrig semester. Aldrig.',
    stats:{STY:8,SMI:5,KON:8,INT:3}, hp:55, ac:15,
    attacks:['Riddaren lansar!','Riddaren skrämmer med deadlines!','Riddaren kör en stressad svängning!'],
    deathLine:'"Utan stress... finns inget liv..." Riddaren tar av hjälmen. Under finns ett leende.',
    winLine:'Riddaren lägger 47 möten i din kalender och rider iväg.',
    xpReward:120, goldReward:38 },

  { id:'insulin_troll', name:'Insulintrollet',    icon:'🧌', zone:2, minLevel:4, maxLevel:8,
    flavor:'Trollet vaktar insulinförrådet med religiös hängivenhet.',
    lore:'Har aldrig låtit någon ta mer än sin dos.',
    stats:{STY:9,SMI:2,KON:10,INT:1}, hp:65, ac:14,
    attacks:['Trollet svänger den gigantiska sprutan!','Trollet klämmer dig!','Trollet ryter och skakar marken!'],
    deathLine:'"Rutiiiiner..." Trollet sjunker ihop och somnar omedelbart.',
    winLine:'Trollet sprutar insulin på dig. "Nästa gång tar du ordning på värdena."',
    xpReward:130, goldReward:42 },

  { id:'anxiety_mimic', name:'Ångesthärmen',      icon:'🎭', zone:2, minLevel:5, maxLevel:9,
    flavor:'Kopierar dina rörelser och attackerar med dina egna svagheter.',
    lore:'Kanske från djupet av ditt eget sinne.',
    stats:{STY:7,SMI:9,KON:6,INT:8}, hp:60, ac:16,
    attacks:['Ångesthärmen speglar ditt hugg!','Ångesthärmen anfaller med din tvekan!','Ångesthärmen kopierar din bästa attack!'],
    deathLine:'"Du vinner... den här gången..." Mimiken löses upp och lämnar en spegel.',
    winLine:'"Du kan inte slå dig själv. Du är redan besegrad inifrån."',
    xpReward:160, goldReward:50 },

  // ZON 3 (lvl 6-10)
  { id:'hypo_demon',    name:'Hypodemon',          icon:'😈', zone:3, minLevel:6, maxLevel:10,
    flavor:'En demon av lågt blodsocker. Vaknar alltid i 3-snåret.',
    lore:'Äldst av stridsdemonerna.',
    stats:{STY:10,SMI:9,KON:8,INT:6}, hp:80, ac:16,
    attacks:['Demonen utlöser blodsockerchock!','Demonen virvlar fram yrselstorm!','Demonen viskar om glömt kvällsmål!'],
    deathLine:'"Nästa gång... 3 på natten..." Demonen exploderar i rött moln.',
    winLine:'"Du glömde mellismålet." Och så är det för sent.',
    xpReward:200, goldReward:65 },

  { id:'hba1c_dragon',  name:'HbA1c-Draken',      icon:'🐉', zone:3, minLevel:7, maxLevel:11,
    flavor:'En drake vars fjäll är gjorda av tre månaders genomsnittsvärden.',
    lore:'Gammal som diabetes själv.',
    stats:{STY:12,SMI:7,KON:14,INT:10}, hp:110, ac:17,
    attacks:['Draken sprutar labbrapporter i eld!','Draken sveper med genomsnittskurvornas klor!','Draken öser medicinsk terminologi!'],
    deathLine:'"Ditt HbA1c... är faktiskt... rätt bra..." Draken kraschar i ett regn av guldmynt.',
    winLine:'"Ditt HbA1c behöver lite arbete," säger draken och sväljer dig.',
    xpReward:250, goldReward:80 },

  { id:'spike_elemental',name:'Toppelementalen',  icon:'📈', zone:3, minLevel:7, maxLevel:11,
    flavor:'Gjord av blodsockertoppar. Lever i gränslandet mellan hyper och hypo.',
    lore:'Ingen vet om den är ond eller bara kaotisk.',
    stats:{STY:11,SMI:8,KON:9,INT:9}, hp:95, ac:15,
    attacks:['Elementalen skjuter en sockerpik!','Elementalen utlöser insulinras!','Elementalen skapar kaotisk glykoskurva!'],
    deathLine:'"...stabiliserat..." Elementalen löses upp och lämnar en kurva som faktiskt ser bra ut.',
    winLine:'"Instabilt. Alltid instabilt." Elementalen försvinner i en nedåtgående graf.',
    xpReward:240, goldReward:78 },

  // ZON 4 (lvl 9-13)
  { id:'cortisol_lord', name:'Kortisolherren',     icon:'💀', zone:4, minLevel:9,  maxLevel:13,
    flavor:'Herren över alla stresshormoner. Har aldrig sovit.',
    lore:'Uppstod ur ackumulerade år av kronisk stress.',
    stats:{STY:14,SMI:10,KON:14,INT:8}, hp:140, ac:18,
    attacks:['Kortisolherren brinner av stresshormoneld!','Kortisolherren utlöser katastroftänkande!','Kortisolherren kastar adrenalinbultar!'],
    deathLine:'"...första gången på 20 år... att jag är trött..." Herren kollapsar i ett moln av lugn.',
    winLine:'"Du kan inte vinna mot stress. Stress är livet."',
    xpReward:350, goldReward:110 },

  { id:'omni_shadow',   name:'Omni-Mans Skugga',  icon:'🦸', zone:4, minLevel:9,  maxLevel:13,
    flavor:'En mörk spegelbild av Omni-Man. Lika stark. Utan medkänsla.',
    lore:'Uppstod när Omni-Man frågade sig om han bryr sig.',
    stats:{STY:16,SMI:13,KON:14,INT:9}, hp:160, ac:19,
    attacks:['Skuggan slår med supersonisk knytnäve!','Skuggan krossar med gravitationsvåg!','Skuggan swepar med ögonlasrar!'],
    deathLine:'"Du är starkare än jag trodde." Skuggan ler för första gången.',
    winLine:'"Du är inte redo." Och sedan träffar du marken.',
    xpReward:400, goldReward:130 },

  { id:'neuropathy_lich',name:'Neuropatilichen',  icon:'💀', zone:4, minLevel:10, maxLevel:14,
    flavor:'En odöd varelse av neuropatisk smärta.',
    lore:'Skapad av år av obehandlad neuropati. Har väntat länge.',
    stats:{STY:13,SMI:8,KON:18,INT:14}, hp:170, ac:17,
    attacks:['Lichen sänder nervsmärtsvågor!','Lichen suger livskraft!','Lichen kallar på odöda nervceller!'],
    deathLine:'"Smärtan... tar slut... äntligen..." Lichen faller isär.',
    winLine:'"Smärtan följer dig hem." Lichen är borta. Men du vet att den har rätt.',
    xpReward:420, goldReward:140 },

  // ZON 5 (lvl 12+)
  { id:'insulin_god',   name:'Insulinguden',       icon:'⚡', zone:5, minLevel:12, maxLevel:99,
    flavor:'Guden över blodsocker. Bestämmer om du lever eller dör sedan 2019.',
    lore:'Urgammal. Allsmäktig.',
    stats:{STY:18,SMI:15,KON:20,INT:18}, hp:220, ac:21,
    attacks:['Guden utlöser gudomlig blodsockerdom!','Guden sänder insulinblixtar!','Guden kallar på alla hormoner!'],
    deathLine:'"...du förtjänar detta..." Guden kraschar i gudomligt ljus. Alla sensorer visar grönt.',
    winLine:'"Ingen människa kan besegra mig." Guden tar dig till Olympen. Permanent.',
    xpReward:600, goldReward:200 },

  { id:'allen_dark',    name:'Den Mörke Allen',    icon:'👾', zone:5, minLevel:12, maxLevel:99,
    flavor:'Vad händer om Allen the Alien väljer fel sida.',
    lore:'Från en dimension där Allen aldrig fick sin uppgift.',
    stats:{STY:17,SMI:18,KON:16,INT:15}, hp:200, ac:20,
    attacks:['Den Mörke Allen slår med alienisk precision!','Den Mörke Allen teleporterar bakom dig!','Den Mörke Allen aktiverar kosmisk kraft!'],
    deathLine:'"...i en annan dimension var jag hjälten..." Den Mörke Allen försvinner med ett leende.',
    winLine:'"Du är värdig. Men nästa gång vinner jag."',
    xpReward:580, goldReward:190 },

  { id:'diabetes_itself',name:'Diabetes Incarnata',icon:'🌑', zone:5, minLevel:14, maxLevel:99,
    flavor:'Sjukdomen personifierad. Den som startade allt 2019.',
    lore:'Inte ett monster. Bara sanningen om vad kroppen kan göra.',
    stats:{STY:20,SMI:18,KON:22,INT:20}, hp:280, ac:22,
    attacks:['Diabetes Incarnata angriper med kronisk förödelse!','Diabetes Incarnata utlöser komplikationsörveln!','Diabetes Incarnata: "Du vet att jag aldrig försvinner."'],
    deathLine:'"...du hanterar mig bättre och bättre..." Diabetes Incarnata drar sig tillbaka. Men försvinner inte.',
    winLine:'"Jag är alltid här." Och det är sant.',
    xpReward:800, goldReward:250 },
];

// ── FIENDEZONSVAL ────────────────────────────────────────────────
function getEnemiesForLevel(heroLevel) {
  return ENEMY_TEMPLATES
    .filter(e => heroLevel >= e.minLevel)
    .map(e => {
      const lvlDiff = Math.max(0, heroLevel - e.minLevel);
      const scale = 1 + lvlDiff * 0.18;
      return {
        ...e,
        scaledStats: {
          STY: Math.round(e.stats.STY * scale),
          SMI: Math.round(e.stats.SMI * scale),
          KON: Math.round(e.stats.KON * scale),
          INT: Math.round(e.stats.INT * scale),
        },
        scaledHp:   Math.round(e.hp * scale),
        scaledAc:   Math.min(24, e.ac + Math.floor(lvlDiff * 0.2)),
        scaledXp:   Math.round((e.xpReward  || 100) * (1 + heroLevel * 0.05)),
        scaledGold: Math.round((e.goldReward ||  30) * (1 + heroLevel * 0.05)),
      };
    });
}

// ── TÄRNINGSSLAG ────────────────────────────────────────────────
function roll(sides) { return Math.floor(Math.random() * sides) + 1; }
function roll2(n, sides) {
  const rolls = Array.from({length:n}, () => roll(sides));
  return { total: rolls.reduce((a,b)=>a+b,0), rolls };
}

// ── COMBAT ACTIONS ───────────────────────────────────────────────
const COMBAT_ACTIONS = [
  { id:'slash',   name:'Hugg',      icon:'⚔️', desc:'d8+STY skada',        hitRoll:'d20+STY',
    dialog:{ attempt:['Soumaya sveper svärdet!','Med ett krigsrop hugger Soumaya!','Soumaya kastar sig fram!'], hit:['Klingan biter djupt!','Perfekt träff!','Svärdet skär igenom!'], miss:['Motståndaren duckar!','Svärdet sveper förbi!'], crit:['⚡ KRITISK! Förödande slag!'] } },
  { id:'double',  name:'Dubbel',    icon:'🌪️', desc:'2×d6+SMI (-2 träff)', hitRoll:'d20+SMI-2',
    dialog:{ attempt:['Blixtsnabb dubbel!','Två slag i rad!'], hit:['Båda slagen landar!'], miss:['Ingen träff!'], crit:['⚡ DUBBEL KRITISK!'] } },
  { id:'power',   name:'Kraftslag', icon:'💥', desc:'d12+STY×2 (-3 träff)', hitRoll:'d20+STY-3',
    dialog:{ attempt:['Soumaya laddar allt!','Full kraft!'], hit:['BOOM! Full träff!'], miss:['Kraftslaget missar!'], crit:['⚡⚡ KATASTROFALT!'] } },
  { id:'defend',  name:'Försvar',   icon:'🛡️', desc:'+4 AC, d4+STY kontring', hitRoll:'d20+STY',
    dialog:{ attempt:['Soumaya tar defensivt läge!'], hit:['Kontring!'], miss:['Defensivt läge kvar.'] } },
  { id:'special', name:'Special',   icon:'✨', desc:'Beror på vapen',       hitRoll:'varierar',
    dialog:{ attempt:['Specialförmåga aktiverad!'], hit:['Specialattacken träffar!'], miss:['Specialattacken missar...'], crit:['⚡ SPECIAL KRITISK!'] } },
];

function enemyAttackDialog(enemy, hit, dmg) {
  const atk = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];
  return hit ? atk + ' ' + dmg + ' skada! 💢' : atk.replace('!','') + ' — men missar!';
}

function calcCombatReward(enemy, heroLevel, won) {
  const base = enemy.scaledXp   || enemy.xpReward  || 100;
  const gold = enemy.scaledGold || enemy.goldReward || 30;
  return won ? { xp: base, gold } : { xp: -Math.round(base * 0.25), gold: 0 };
}

function goldFromAchievement(a) {
  return { bronze:10, silver:25, gold:60, platinum:120, invincible:300 }[a.tier] || 10;
}

function initHero(level) {
  const stats = getBaseStats(level);
  return { stats, maxHp: getMaxHp(stats.KON, level), equipment:{weapon:null,armor:null,accessory:null,potion:null,rune:null} };
}

if (typeof module !== 'undefined') {
  module.exports = { LEVEL_TABLE, SHOP_ITEMS, ENEMY_TEMPLATES, COMBAT_ACTIONS, getLevelData, getBaseStats, getMaxHp, getHeroAC, getEnemiesForLevel, roll, roll2, calcCombatReward, goldFromAchievement, initHero };
} else {
  window.LEVEL_TABLE = LEVEL_TABLE; window.SHOP_ITEMS = SHOP_ITEMS;
  window.ENEMY_TEMPLATES = ENEMY_TEMPLATES; window.COMBAT_ACTIONS = COMBAT_ACTIONS;
  window.getLevelData = getLevelData; window.getBaseStats = getBaseStats;
  window.getMaxHp = getMaxHp; window.getHeroAC = getHeroAC;
  window.getEnemiesForLevel = getEnemiesForLevel;
  window.roll = roll; window.roll2 = roll2;
  window.calcCombatReward = calcCombatReward;
  window.goldFromAchievement = goldFromAchievement;
  window.initHero = initHero;
}

// ── STRID-EVENTS ─────────────────────────────────────────────
// Triggas vid ~50% HP på fienden, max 1 per strid
// Returnerar { text, effect } eller null
const COMBAT_EVENTS = [
  // Fienden stärks
  {
    id:'slime_doubles', enemyId:'sugar_slime',
    text:'Sockerblobben suger upp en pöl sirap från golvet — och DUBBLAS i storlek! Den fylls av socker-energi.',
    effect: (c) => { c.enemyHp = Math.min(c.enemyMaxHp, c.enemyHp + 15); c.enemyStats.STY += 3; },
    effectDesc: 'Blobben får +15 HP och +3 STY!'
  },
  {
    id:'goblin_sugar_rush', enemyId:'sugar_goblin',
    text:'Goblinen stoppar HELA godispåsen i munnen på en gång. En galning! Hans ögon glöder rött.',
    effect: (c) => { c.enemyStats.STY += 4; c.enemyAc += 1; },
    effectDesc: 'Sockerkick! Goblinen får +4 STY och +1 AC!'
  },
  {
    id:'rat_calls_friends', enemyId:'calorie_rat',
    text:'Kalorieråttan piper desperat — och tre mini-råttor störtar ut ur väggarna och biter dig!',
    effect: (c) => { c.heroHp = Math.max(1, c.heroHp - 12); },
    effectDesc: 'Mini-råttorna biter! Du förlorar 12 HP!'
  },
  {
    id:'golem_second_wind', enemyId:'lazy_golem',
    text:'Latmasksgolemen hittar fjärrkontrollen och ZAPPAR sig med 10 000 volt för att vakna upp. Han reser sig.',
    effect: (c) => { c.enemyHp = Math.min(c.enemyMaxHp, c.enemyHp + 20); c.enemyStats.STY += 2; },
    effectDesc: 'Golemen återhämtar 20 HP och +2 STY!'
  },
  // Hjälten får hjälp
  {
    id:'allen_assists', enemyId:null, // alla fiender
    text:'Allen the Alien landar från skyn med ett BRAK. "Jag hade lite ledig tid." Han slår till fienden med en kosmisk knytnäve.',
    effect: (c) => { c.enemyHp = Math.max(0, c.enemyHp - 18); },
    effectDesc: 'Allen gör 18 skada på fienden!'
  },
  {
    id:'grogu_snack', enemyId:null,
    text:'Grogu trycker sig fram och räcker upp ett litet snacks. *blip bloop* Han verkar orolig.',
    effect: (c) => { c.heroHp = Math.min(c.heroMaxHp, c.heroHp + 14); },
    effectDesc: 'Grogu läker 14 HP!'
  },
  {
    id:'blood_sugar_dip', enemyId:null,
    text:'Blodsockret sjunker plötsligt. En svimningskänsla. Allt suddas ut i kanten. Men du håller stånd.',
    effect: (c) => { c.heroHp = Math.max(1, c.heroHp - 8); c.heroAc -= 1; },
    effectDesc: 'Du tappar 8 HP och -1 AC en runda.'
  },
  {
    id:'cortisol_surge', enemyId:null,
    text:'En kortisolvåg sköljer igenom kroppen. Adrenalin. Du ser allt klarare. Din nästa attack är starkare.',
    effect: (c) => { c.heroStats.STY += 3; c._cortisolRounds = 2; },
    effectDesc: '+3 STY i 2 rundor!'
  },
  {
    id:'enemy_stumbles', enemyId:null,
    text:'Fienden halkar på ett golvet och faller klumpigt. Ett ögonblicks sårbarhet — ta chansen!',
    effect: (c) => { c._enemyStunned = true; },
    effectDesc: 'Fienden missar nästa attack!'
  },
  {
    id:'jarjar_distraction', enemyId:null,
    text:'Jar Jar Binks störtar in genom en dörr. "MEESA SO SORRY!" Han snubblar rakt in i fienden och orsakar kaos.',
    effect: (c) => { c.enemyHp = Math.max(0, c.enemyHp - 10); c._enemyStunned = true; },
    effectDesc: 'Jar Jar gör 10 skada och fienden missar nästa slag!'
  },
  {
    id:'hba1c_vision', enemyId:'hba1c_dragon',
    text:'Draken visar ditt senaste HbA1c i ett flammande moln. Siffrorna bränner sig in i ögonen. Du fryser.',
    effect: (c) => { c.heroAc -= 2; c.heroHp = Math.max(1, c.heroHp - 10); },
    effectDesc: 'Draken skrämmer dig: -10 HP och -2 AC!'
  },
  {
    id:'hypo_midnight', enemyId:'hypo_demon',
    text:'Hypodemon viskar: "Klockan är tre om natten och du är ensam med ditt blodsocker." Du ryser till.',
    effect: (c) => { c.heroStats.STY -= 2; c.heroStats.SMI -= 1; },
    effectDesc: 'Rädslan tar kraft: -2 STY, -1 SMI!'
  },
];

function getCombatEvent(c) {
  if (c._eventFired) return null;
  if (c.enemyHp > c.enemyMaxHp * 0.55) return null; // triggar vid 55% HP

  // Fiende-specifika events
  const specific = COMBAT_EVENTS.filter(e => e.enemyId === c.enemyId);
  const generic  = COMBAT_EVENTS.filter(e => e.enemyId === null);
  const pool = [...specific, ...generic];

  if (!pool.length || Math.random() > 0.7) return null; // 70% chans att ett event triggas
  return pool[Math.floor(Math.random() * pool.length)];
}
