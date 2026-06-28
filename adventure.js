'use strict';
// ═══════════════════════════════════════════════════════════════════════
// SOUMAYA: BIO-KOSMOS KRIG — 30-DAGARSÄVENTYRET
// Sci-fi/fantasy, sammanhängande story med konsekvenser
// ═══════════════════════════════════════════════════════════════════════

const STORY_ENEMIES = {
  kaos_drone:        { name: 'Kaos-Drönare',        icon: '🤖', hp: 45,  atk: 9,  def: 3,  xp: 45,  gold: 12 },
  kaos_captain:      { name: 'Kaos-Kapten',          icon: '⚙️', hp: 90,  atk: 15, def: 7,  xp: 90,  gold: 22 },
  cortisol_soldier:  { name: 'Kortisol-Soldat',      icon: '💉', hp: 65,  atk: 13, def: 5,  xp: 65,  gold: 16 },
  spike_phantom:     { name: 'Toppfantom',           icon: '📈', hp: 55,  atk: 20, def: 2,  xp: 70,  gold: 16 },
  hba1c_crystal:     { name: 'HbA1c-Kristall',       icon: '💎', hp: 80,  atk: 10, def: 14, xp: 75,  gold: 18 },
  blood_hound:       { name: 'Blodjakthund',         icon: '🩸', hp: 70,  atk: 16, def: 4,  xp: 80,  gold: 20 },
  nerve_phantom:     { name: 'Nervfantom',           icon: '🧠', hp: 95,  atk: 23, def: 6,  xp: 115, gold: 28 },
  cortisol_marshal:  { name: 'Kortisol-Marskalken',  icon: '⚔️', hp: 220, atk: 22, def: 11, xp: 220, gold: 65 },
  kaos_colossus:     { name: 'Kaos-Koloss',          icon: '🏚️', hp: 280, atk: 24, def: 13, xp: 280, gold: 75 },
  kaos_general:      { name: 'Kaos-Generalen',       icon: '💀', hp: 320, atk: 28, def: 13, xp: 320, gold: 85 },
  kaos_avatar:       { name: 'Kaos-Avatar',          icon: '🌀', hp: 420, atk: 32, def: 16, xp: 420, gold: 110 },
  kaos_prime:        { name: 'Kaos-Prime',           icon: '🌑', hp: 520, atk: 38, def: 19, xp: 520, gold: 160 },
  diabetes_incarnata:{ name: 'Diabetes Incarnata',   icon: '⚡', hp: 666, atk: 45, def: 22, xp: 666, gold: 200 },
};

if (typeof ENEMY_TEMPLATES !== 'undefined') {
  Object.assign(ENEMY_TEMPLATES, STORY_ENEMIES);
}

// ═══════════════════════════════════════════════════════════════════════
// STORY CHAPTERS  (index 0 unused; chapters[1]=dag 1 … chapters[30]=dag 30)
// ═══════════════════════════════════════════════════════════════════════
const STORY_CHAPTERS = [
null, // dag 0 — ej använt


// ════════════════════════════════════════════
// DAG 1 — SYSTEMSTART
// ════════════════════════════════════════════
{
  day:1, title:'Systemstart', subtitle:'Uppvaknandet i Bio-Kosmos',
  icon:'🔬', teaser:'Soumaya vaknar i ett universum hon alltid känt — men aldrig sett.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🔬 Systemstart',next:'first_look',
  text:`Det är inte som att drömma.

Soumaya öppnar ögonen och ser ett universum. Inte rymden. Inte drömmar. Något <em>levande.</em>

Runt henne välver sig ett välde av djuprött och gyllene ljus. Marken är ett nätverk av transparenta proteinbroar. I fjärran reser sig torn av cellmembran, höga som skyskrapor, genomlysta av en pulsande blå eld.

Hon är inne. Inne i sig själv. En nano-krigare med medvetandet inmatat i Bio-Kosmos — den levande mikrovärld som bebor Soumayas kropp.

Något bröt en gång. Idag börjar reparationen.`},

  first_look:{id:'first_look',type:'narrative',title:'Det Röda Havet',next:'allen_call',
  text:`Det Röda Havet sträcker sig till horisonten.

Blodflödet rinner som en jätteflod. Röda blodkroppar passerar i formationer — bikonkava, perfekta, med syftet hos något som aldrig tvivlat. Immuncellerna längs stranden vakar tålmodigt.

Och sedan ser hon det.

I sydost, bortom cellmembrantornen, glöder något annorlunda. Inte den varma guldtonen av Livskraften. Det är ett rött som bränner. Som data som kraschar.

<strong style="color:var(--pulse-red)">Kaos-Koden.</strong> Den är här. Precis som de misstänkte.

Soumaya sätter handen mot bröstet — reflexmässigt. Hon är rädd. Det är okej att vara rädd.`},

  allen_call:{id:'allen_call',type:'narrative',title:'En Bekant Röst',next:'allen_choice',
  text:`Ett statiskt brus. Sedan — en röst hon känner bättre än sin egen.

<em>"Soumaya? Kan du höra mig? Jag har suttit framför den här skärmen i fyrtiotre minuter och druckit kaffe som smakar byggmaterial—"</em>

<strong>Allen.</strong>

Lättad, nervös, och omedelbart igenkännlig. Han bryter igenom nano-kommsystemet som om han sitter rummet bredvid.

<em>"Okej, telemetrin säger att du är vid liv. Det är ett bra tecken. Hur mår... du?"</em>

Soumaya letar efter ord. Var börjar man beskriva ett universum man inte visste existerade inuti en själv?`},

  allen_choice:{id:'allen_choice',type:'choice',title:'Vad svarar du?',
  text:`Allen väntar. Du kan höra honom andas i mikrofonen. Det är oväntat tryggande.`,
  choices:[
    {label:'💬 "Det är vackert härinne."', flavor:'Ärlig. Allen tystnar en sekund.',next:'allen_honest',effect:{allen_trust:8}},
    {label:'⚔️ "Jag ser hotet. Vi börjar nu."', flavor:'Fokuserat och bestämt.',next:'allen_focus',effect:{allen_trust:3}},
    {label:'📊 "Ge mig all data om Kaos-Koden."', flavor:'Analytiskt. Allen svarar med ett leende i rösten.',next:'allen_data',effect:{allen_trust:5}}
  ]},

  allen_honest:{id:'allen_honest',type:'narrative',title:'Allen Ler',next:'mission_brief',
  text:`<em>"...vackert?"</em> Allen skrattar — kort och varmt. <em>"Jag skickade in mitt bästa vapen i ett krig och du tittar på utsikten. Okej. Det är faktiskt okej."</em>

En paus. Rösten mjuknar.

<em>"Du vet att jag är här hela vägen, eller hur? Jag lämnar inte den här stolen förrän du är tillbaka."</em>

<strong style="color:var(--in-range-dark)">Allen-förtroende +8</strong>`},

  allen_focus:{id:'allen_focus',type:'narrative',title:'Fokus',next:'mission_brief',
  text:`<em>"Rätt inställning,"</em> säger Allen, och hon hör att han menar det. <em>"Kaos-Koden har haft sex år. Varje dag vi väntar är en dag den växer."</em>

Han laddar upp en karta. Röda pulsar markerar korruption — spridda men koncentrerade mot pancreas i öster.

<em>"Trettio dagar. Det räcker. Och Soumaya — håll kontakten. Inte bara för datan."</em>

<strong style="color:var(--in-range-dark)">Allen-förtroende +3</strong>`},

  allen_data:{id:'allen_data',type:'narrative',title:'Data Levererad',next:'mission_brief',
  text:`<em>"Data. Självklart. Du kände mig ju."</em>

Allen börjar omedelbart. Kaos-Koden detekterades samma dag som diagnosen. En felaktig immunrespons skapade en AI-loop i pankreas-signalsystemet. Den loopen är nu autonom, med sin egen vilja.

<em>"Trettio sektorer. Vi börjar med Det Röda Havet. Jag guidar dig i realtid."</em>

<em>"Och Soumaya? Håll kontakten. För min skull också."</em>

<strong style="color:var(--in-range-dark)">Allen-förtroende +5</strong>`},

  mission_brief:{id:'mission_brief',type:'narrative',title:'Uppdraget',next:'patrol_spotted',
  text:`Allen lägger upp helhetsbilden.

<strong>Trettio dagar. Trettio sektorer.</strong> Kaos-Koden har spridit sig från pankreas — manipulerar hormoner, blockerar insulinsignaler, och bygger upp en armé av ombyggda immunceller.

<em>"Dag ett: ta kontroll över Det Röda Havets västra zon. Det är ditt baslager. Vi behöver det stabilt."</em>

Han tvekar. <em>"Oh. Och det finns ett problem. Jag detekterar ett patrullskepp. Kaos-Drönare. De rör sig mot din position."</em>

<strong>Det börjar nu.</strong>`},

  patrol_spotted:{id:'patrol_spotted',type:'narrative',title:'Fienden',next:'first_combat',
  text:`Tio meter bort glider en Kaos-Drönare fram längs en proteinbrygga.

Skapad av något som en gång var en immuncell — omskapad av Kaos-Kodens program till ett verktyg. Den bär ett rödglödande datasegel längs ryggen. Den har inte sett Soumaya än.

<em>"Kaos-Drönare. Grundmodell,"</em> viskar Allen. <em>"Du kan hantera det."</em>

Soumaya griper sin nano-lans — ett vapen format av ren Livskraft, pulsande guld.

Det handlar inte om hat. Det handlar om att återta vad som är hennes.`},

  first_combat:{id:'first_combat',type:'combat',title:'⚔️ Kaos-Drönaren',
  text:'En korrupt immuncell spärrar vägen längs proteinbryggan.',
  enemyId:'kaos_drone',nextOnWin:'post_win',nextOnLoss:'day1_defeat'},

  post_win:{id:'post_win',type:'narrative',title:'Första Segern',next:'explore_choice',
  text:`Den upplöses i röd datak-rök. Sedan — tystnad. Bara det eviga pulset av Bio-Kosmos.

<em>"JAAAA!"</em> Allen exploderar i kommsystemet. <em>"Du är fortfarande du! Det är officiellt — min bästa vän är en nano-krigare!"</em>

Soumaya andas ut. Händerna darrar — det som är adrenalinens motsvarighet på nano-nivå.

Det kändes verkligt. Det ÄR verkligt.

<em>"Ta en sekund,"</em> säger Allen mjukare. <em>"Du tog precis det första steget mot att återta din kropp."</em>`},

  explore_choice:{id:'explore_choice',type:'choice',title:'Nästa drag',
  text:`Allen laddar upp sensordata. Norrut: en stabil protein-klippformation, säkert läger. Söderut: ett svagt skimmer av ren Livskraft — sällsynt och värdefull, men i okänt territorium.`,
  choices:[
    {label:'🏕️ Etablera läger i norr (säkert)',flavor:'Bygg basen. Du vilar bättre ikväll.',next:'camp_est',effect:{stamina_saved:true}},
    {label:'✨ Undersök Livskraft-källan (risk)',flavor:'Kräver SMI-slag (SV 10) — okänt territorium.',check:{stat:'SMI',dc:10,nextOnSuccess:'livscraft',nextOnFailure:'livscraft_fail',effect:{addXp:30}}}
  ]},

  camp_est:{id:'camp_est',type:'narrative',title:'Lägret',next:'night_vision',
  text:`Klippformationen norr om Det Röda Havet är perfekt. Naturliga väggar av protein. Härinne är det tyst — det djupa lugnet från ett friskt hjärtslag.

<em>"Bra call,"</em> säger Allen. <em>"Jag kan förstärka nano-signalen härifrån. Du sover bättre ikväll."</em>

Soumaya sätter sig och tittar ut över Det Röda Havet. Blodkropparna fortsätter sin outtröttliga resa. De vet inte att deras värld är i krig.

Hon vet. Det räcker.`},

  livscraft:{id:'livscraft',type:'narrative',title:'Livskraft-källan',next:'night_vision',
  text:`Källan är en kristall av ren insulinenergi — ett litet mirakel i en värld som börjat glömma vad mirakel är.

Soumaya tar den i handen. Den värmer. Pulsar i takt med hennes hjärtslag.

<em>"Det är gammal Livskraft,"</em> säger Allen förvånat. <em>"Inte korrupt alls. Som om kroppen gömde den i väntan på just dig."</em>

<strong>+30 XP bonus</strong>`},

  night_vision:{id:'night_vision',type:'narrative',title:'En Syn',next:'day1_victory',
  text:`Natten i Bio-Kosmos är djupblå och bioluminescerande — miljontals celler som fortsätter sitt arbete utan vila.

Soumaya halvslumrar. Och i det halvslumrade tillståndet:

En vision. Ett litet, rundat ansikte. Enorma lugna ögon. En varelse som är mycket äldre än den ser ut. Den tittar på henne.

Sedan — borta.

<em>"Allen,"</em> viskar hon. <em>"Jag tror jag just såg något."</em>

<em>"Notering gjord,"</em> säger han efter en paus. <em>"Kolla det imorgon."</em>`},

  livscraft_fail:{id:'livscraft_fail',type:'narrative',title:'Halkat i Mörkret',next:'night_vision',
  text:`Du sträcker dig mot kristallen — men underlaget är halt och du halkar. Kristallen pulsar förbi dina fingrar och försvinner ned i ett spricknät av proteinlager.

Allen håller andan. <em>"Inget farligt. Du är okej."</em>

Du är lite skamsen men oskadd. En annan gång kanske.`},

  day1_defeat:{id:'day1_defeat',type:'reward',won:false,
  title:'💀 Dag 1 — Lärdom',
  text:'Du lärde dig hur fienden rör sig. Det är inte ett misslyckande — det är data. Imorgon slår du tillbaka.',
  bonusXp:60,bonusGold:10},

  day1_victory:{id:'day1_victory',type:'reward',won:true,
  title:'🏆 Dag 1 klar!',
  text:'Systemstart genomförd. Du är inne, Allen är med dig, och Kaos-Koden vet inte ännu vad som är på väg. Imorgon: Det Röda Havets kanjon.',
  bonusXp:150,bonusGold:35}
  }
},


// ════════════════════════════════════════════
// DAG 2 — BLODFLÖDETS KANJON
// ════════════════════════════════════════════
{
  day:2, title:'Blodflödets Kanjon', subtitle:'Genom Det Röda Havets ström',
  icon:'🌊', teaser:'Navigera blodet. Överleva ambushen. Nå den andra stranden.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🌊 Dag 2 — Kanyonen',next:'briefing',
  text:`Det Röda Havet är vackert på avstånd. Inifrån är det en annan sak.

Soumaya klänger sig fast längs kanyonväggen — gjord av sammantvinnade kärlvävnadslager — medan blodflödet rusar förbi fem meter under henne. Strömmen är kraftfull. Den bär miljontals röda blodkroppar varje sekund mot lungor och tillbaka. Liv i rörelse. Liv som är henne.

Idag måste hon ta sig till östra stranden. Och Kaos-Koden har placerat ut patrullstationer längs hela rutten.`},

  briefing:{id:'briefing',type:'narrative',title:'Allens Karta',next:'first_patrol',
  text:`<em>"Jag räknar tre patrullstationer,"</em> säger Allen. <em>"Första är vid Klaffsegmentbryggan. Du kan komma runt den norrifrån om du klättrar upp på det stora venösa lageravsnittet."</em>

Soumaya studerar den projicerade kartan. Det venösa lagret är högt — men klättrbart.

<em>"Eller,"</em> tillägger Allen med den ton som alltid föregår ett riskabelt förslag, <em>"du kan ta direkt konfrontation. Snabbare. Farligare."</em>

Det är alltid ett val härinne.`},

  first_patrol:{id:'first_patrol',type:'choice',title:'Station 1 — Klaffsegmentbryggan',
  text:`Patrullstationen i sikte. En Kaos-Kapten med två drönare. De har inte sett dig än.`,
  choices:[
    {label:'🧗 Kringgå via venöst lager',flavor:'Längre men tyst. Drönarna aldrig medvetna om din närvaro.',next:'bypass_success',effect:{stealth_path:true}},
    {label:'⚔️ Direktkonfrontation',flavor:'Snabbare. Men du tar skada.',next:'combat_kapten',effect:{took_damage:true}}
  ]},

  bypass_success:{id:'bypass_success',type:'narrative',title:'Tyst som en cell',next:'midway',
  text:`Soumaya klättrar längs det venösa lagret — hand för hand, med Bio-Kosmos levande och pulserande under fingrarna. Kärlväggen är varm. Den bär blod mot hjärtat.

Nedanför passerar Kaos-Kaptenen och hans drönare. De ser ingenting.

<em>"Perfekt,"</em> viskar Allen. <em>"Jag visste att du hade det i dig."</em>

Soumaya ler för sig själv. Tystnad är ibland det kraftfullaste vapnet.`},

  combat_kapten:{id:'combat_kapten',type:'combat',title:'⚔️ Kaos-Kaptenen',
  text:'Du väljer direkt konfrontation. Kaptenen vänder sig om — och ler ett leende utan värme.',
  enemyId:'kaos_captain',nextOnWin:'midway',nextOnLoss:'day2_defeat'},

  midway:{id:'midway',type:'narrative',title:'Halvvägs',next:'blood_current',
  text:`Mitten av Det Röda Havet är det vackraste Soumaya sett.

Blodflödet bildar här ett delta — tusen grenar som delar och sammanflödar igen. Röda blodkroppar dansar i spiralmönster. Platsen är en naturlig karusell av liv. Kaos-Koden har inte nått hit än. Kanske för att det är för levande. För friskt. För henne.

<em>"Titta på det,"</em> säger Allen tyst. Det är ovanligt för honom att vara tyst. <em>"Din kropp är helt fantastisk, Soumaya. Den har kämpat utan dig hela den här tiden."</em>

En varm känsla. Stolthet, kanske.`},

  blood_current:{id:'blood_current',type:'choice',title:'Strömmen',
  text:`För att nå östra stranden behöver du ta dig över huvud-flödeskanalen. Det finns två sätt: en smal bro av koagulerat fibrin (stabil men osäker — Kaos-Koden kan ha lagt dit minor), eller rida strömmen direkt (snabbare men krävande).`,
  choices:[
    {label:'🌉 Fibrinbryggan (försiktig)',flavor:'Långsammare men kontrollerbar.',next:'fibrin_path',effect:{}},
    {label:'🌊 Rid strömmen (modig)',flavor:'Kräver KON-slag (SV 12) — snabb men krävande.',check:{stat:'KON',dc:12,nextOnSuccess:'current_ride',nextOnFailure:'current_washed',effect:{addXp:25}}}
  ]},

  fibrin_path:{id:'fibrin_path',type:'narrative',title:'Fibrinbryggan',next:'eastern_shore',
  text:`Bryggan håller. Varje steg är ett test men fibrinet är stabilt — ett minne av kroppens försvar, härdat av tid.

Halvvägs stannar Soumaya och tittar ned. Det Röda Havet rusar under henne. Ett liv i rörelse som aldrig slutar.

Hon tar steget. Och nästa. Och är framme.`},

  current_ride:{id:'current_ride',type:'narrative',title:'I Strömmens Hjärta',next:'eastern_shore',
  text:`Soumaya hoppar — och strömmen tar henne.

Det är våldsamt och vackert på samma gång. Röda blodkroppar formerar sig runt henne som en levande valv. Flödet bär henne framåt med en kraft som inte är hennes men ändå tillhör henne.

Hon landar på östra stranden. Andas. Hjärtat bultande.

<em>"Det,"</em> säger Allen, <em>"var den coolaste saken jag sett i veckor."</em>

<strong>+25 XP</strong>`},

  current_washed:{id:'current_washed',type:'narrative',title:'Bortspolad',next:'eastern_shore',
  text:`Strömmen tar henne — och sedan kontrollerar den henne.

Soumaya kastas runt bland blodkropparna, tumlar i spiralmönster hon inte kan styra. Hon landar på östra stranden hårt, klottad av flodens kraft.

<em>"Du lever,"</em> säger Allen. <em>"Det räknas."</em>

Omnimannen... Jar Jar hjälper henne upp. Inga ord. Men blicken säger: <em>jag vet vad det är att misslyckas.</em>`},

  eastern_shore:{id:'eastern_shore',type:'narrative',title:'Östra Stranden',next:'ambush',
  text:`Östra stranden lutar in mot Insulinfästets territorium. Här mörknar luften — en knappt märkbar förändring i biokemins ljusspektrum.

Kaos-Kodens närvaro är starkare här. Soumaya kan känna det i fingertopparna, som statisk elektricitet i nano-formen.

<em>"Allen,"</em> säger hon. <em>"Hur ser sensorerna ut?"</em>

En paus som är ett halvt sekund för lång. <em>"Soumaya — du behöver röra dig. Nu."</em>`},

  ambush:{id:'ambush',type:'narrative',title:'Ambush!',next:'ambush_fight',
  text:`De kommer från tre riktningar. Fyra Kaos-Drönare och en Kortisol-Soldat — specialiserad på att injicera stresspulsar direkt i systemet.

<em>"De visste att du var på väg,"</em> säger Allen, och hans röst är skärpt. <em>"Antingen har de bättre sensorer än vi trodde, eller—"</em>

En av drönarna rusar mot henne.

Ingen tid att analysera. Bara tid att slåss.`},

  ambush_fight:{id:'ambush_fight',type:'combat',title:'⚔️ Kortisol-Soldaten',
  text:'En Kortisol-Soldat leder ambushen. Övriga drönare cirkulerar. Fokus.',
  enemyId:'cortisol_soldier',nextOnWin:'day2_victory',nextOnLoss:'day2_defeat'},

  day2_defeat:{id:'day2_defeat',type:'reward',won:false,
  title:'💀 Dag 2 — Temporärt',
  text:'Du drog dig tillbaka. Det Röda Havet är ännu inte erövrat — men du vet nu var de är. Imorgon är du förberedd.',
  bonusXp:80,bonusGold:15},

  day2_victory:{id:'day2_victory',type:'reward',won:true,
  title:'🏆 Dag 2 klar!',
  text:'Östra stranden tagen. Det Röda Havet korsat. Framför dig: Insulinfästet — och ett val som kommer att forma de kommande veckorna.',
  bonusXp:180,bonusGold:40}
  }
},


// ════════════════════════════════════════════
// DAG 3 — INSULINFÄSTET (NYCKELVAL)
// ════════════════════════════════════════════
{
  day:3, title:'Insulinfästet', subtitle:'Det val som förändrar allt',
  icon:'⚡', teaser:'Insulinfästet nått. Men vad ska du göra med det?',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'⚡ Dag 3 — Fästet',next:'fortress_sight',
  text:`Insulinfästet.

Det är gigantiskt. Det är också i delar sönderslaget — Kaos-Kodens verk, tydligen. Men det som är kvar är storslaget: ett torn av sammanlänkade insulinmolekyler, en katedral i Bio-Kosmos skala, fortfarande lysande av gammal Livskraft.

<em>"Det är ditt centrum,"</em> säger Allen tyst. <em>"Härifrån signalerade pankreas en gång ut till alla celler. 'Öppna. Ta emot. Lev.' Det är den signalen Kaos-Koden kapade."</em>

Soumaya känner sig liten inför det. Men också som att det är hers.`},

  fortress_sight:{id:'fortress_sight',type:'narrative',title:'Inuti Fästet',next:'grogu_flash2',
  text:`Inuti Insulinfästet är det som att stå inuti en klocka — mekanismer i mekanismer, allt samspelande i ett precisionssystem som nu är halvt brutet.

Gamla inscriptioner av aminosyra-kod kör i loops längs väggarna — minnet av vad systemet en gång var. Soumaya rör vid en av dem. Den värmer under handen.

<em>"Härinne kan vi faktiskt kommunicera med kroppens egna signaler,"</em> säger Allen. <em>"Om vi reparerar det här tornet kan vi skicka motorder till Kaos-Kodens trupper. Det är en strategisk seger."</em>

<em>"Kan,"</em> tillägger han. <em>"Det beror på vad du väljer."</em>`},

  grogu_flash2:{id:'grogu_flash2',type:'narrative',title:'Synen Igen',next:'key_choice',
  text:`Och där — i en mörk nisch av fästet — sitter det lilla varelserna igen.

Den är liten. Grön. Enormt gamla ögon i ett litet ansikte. Den tittar på Soumaya med ett uttryck som kombinerar tusenårig visdom och omedelbart medlidande.

Soumaya håller andan.

<em>"Du,"</em> viskar hon.

Varelsen håller upp en liten hand. Och pekar — österut. Mot pankreas. Mot Kaos-Kodens hjärta.

Sedan försvinner den.

<em>"Allen,"</em> säger Soumaya. <em>"Den pekar mot pankreas. Den säger åt mig att gå vidare."</em>

<em>"Eller,"</em> svarar Allen försiktigt, <em>"att ta tid att befästa det vi har."</em>`},

  key_choice:{id:'key_choice',type:'choice',
  title:'⚠️ Det Avgörande Valet — Dag 3',
  text:`<strong>Insulinfästet:</strong> skadat men reparerbart. Om du stannar och befäster det — tre dagar av reparationsarbete, men sedan har du ett oövervinnerligt baslager. Försvarslinjer. Skyddade reträttvägar.

Men det tar tid. Och Kaos-Koden bygger styrka i öster medan du väntar.

Om du pushar vidare nu — du behåller momentumet men lämnar en osäkrad flanke. Dag 8 kan bli farligare.

<strong>Vad väljer du?</strong>

<em>(Detta val påverkar dag 8, 15 och 22)</em>`,
  choices:[
    {label:'🏰 Befästa fästet (strategiskt)',
    flavor:'Tre dagar av arbete. En solid bas för resten av kriget. Dag 8 börjar säkert.',
    next:'fortify_choice',
    effect:{flags:{insulin_base_fortified:true},allen_trust:3}},
    {label:'⚡ Pressa vidare (aggressivt)',
    flavor:'Behåll momentumet. Men flanken är öppen. Dag 8 kan bli kaotisk.',
    next:'push_choice',
    effect:{flags:{insulin_base_fortified:false},allen_trust:-1}}
  ]},

  fortify_choice:{id:'fortify_choice',type:'narrative',title:'Vi Befäster',next:'fortify_work',
  text:`<em>"Rätt beslut,"</em> säger Allen, och lättnaden i hans röst är påtaglig. <em>"Jag vet att det känns som att vi tappar tid. Men vi tappar inte — vi investerar."</em>

Soumaya nickar. Strategiskt sinne over impulsen att rusa in.

<em>"Plus,"</em> tillägger Allen, <em>"om vi reparerar fästets signalavdelning kan jag börja störa Kaos-Kodens kommunikation. Det gör varje strid lättare framöver."</em>

<strong style="color:var(--in-range-dark)">Insulinfästet befästs. Dag 8-22 påverkas positivt.</strong>`},

  push_choice:{id:'push_choice',type:'narrative',title:'Vi Pushar',next:'push_forward',
  text:`<em>"Okej,"</em> säger Allen efter en paus. <em>"Du vet bäst. Men Soumaya — om vi lämnar fästet osäkrat och de installerar sig bakom oss..."</em>

<em>"Jag vet,"</em> avbryter hon. <em>"Vi tar den risken."</em>

<em>"Notering gjord. Dag åtta kan bli komplicerat."</em>

Han menar det som en varning. Hon hör det som en utmaning.

<strong style="color:var(--high)">Flanken öppen. Dag 8 startar med osäkerhet.</strong>`},

  fortify_work:{id:'fortify_work',type:'narrative',title:'Byggnadsarbete',next:'fortify_combat',
  text:`Att reparera ett insulinfäste i nanoskala är som att sy ihop en katedrals mosaikfönster med nål gjord av ljus.

Soumaya arbetar timer i timer. Allen guidar. De hittar en rytm — hans tekniska precision, hennes intuitiva förståelse av sin egen kropp.

Och mitt i arbetet attackerar de förstås.`},

  push_forward:{id:'push_forward',type:'narrative',title:'Österut',next:'push_combat',
  text:`Soumaya lämnar Insulinfästet bakom sig och rör sig österut med fansen öppen i ryggen.

Terrängen förändras. Cellmembranen är tjockare här, strukturerna mer komplexa. Och fiendernas patrullmönster är tätare.

<em>"Kontakt,"</em> säger Allen. <em>"Rakt framifrån."</em>`},

  fortify_combat:{id:'fortify_combat',type:'combat',title:'⚔️ Fästets Försvarare',
  text:'Kaos-Koden sänder trupper för att hindra reparationen.',
  enemyId:'kaos_captain',nextOnWin:'day3_victory',nextOnLoss:'day3_defeat'},

  push_combat:{id:'push_combat',type:'combat',title:'⚔️ Frontlinjen',
  text:'Kaos-Drönare blockerar östvägen. Ingen flanktäckning.',
  enemyId:'cortisol_soldier',nextOnWin:'day3_victory',nextOnLoss:'day3_defeat'},

  day3_defeat:{id:'day3_defeat',type:'reward',won:false,
  title:'💀 Dag 3 — Vila',
  text:'Tillfälligt tillbakaslagen. Ditt val kvarstår — och konsekvenserna med det. Imorgon fortsätter.',
  bonusXp:90,bonusGold:18},

  day3_victory:{id:'day3_victory',type:'reward',won:true,
  title:'🏆 Dag 3 klar!',
  text:'Ditt val är gjort. Det ekrar framöver. Imorgon: sök den mystiska varelsen som har försökt visa dig vägen — Grogu väntar i tarmfloran.',
  bonusXp:200,bonusGold:50}
  }
},


// ════════════════════════════════════════════
// DAG 4 — GROGUS GÖMSTÄLLE
// ════════════════════════════════════════════
{
  day:4, title:'Grogus Gömställe', subtitle:'Den urgamle väktaren',
  icon:'🟢', teaser:'Varelsen i visionen väntar. Och den har sett allt.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🟢 Dag 4 — Tarmfloran',next:'microbiome',
  text:`Tarmfloran är Bio-Kosmos vildmarkens vildmark.

Soumaya stiger in i ett ekosystem av tusentals bakteriekolonier — ett levande myller av organismer som existerat i Soumayas mage sedan barndomen. De är inte fiender. De är ursprungsbefolkning.

Och någonstans djupt inne i det levande myrkaret bor varelsen från visionerna.

<em>"Jag ser ett avvikande värmemönster,"</em> säger Allen. <em>"Det är inte bakteriellt. Det är... annorlunda. Äldre."</em>`},

  microbiome:{id:'microbiome',type:'narrative',title:'Djupet',next:'grogu_meet',
  text:`Ju längre in Soumaya går, desto tystare blir det. De stora bakteriekolonierna — Lactobacillus, Bifidobacterium, urallt och invant — öppnar korridorer för henne som om de känner igen henne.

Kanske gör de det. Det är hennes kropp.

I en central grotta, upplyst av bioluminescenta svamptentakler, sitter varelsen.

Liten. Grön. Öronen som segel. De enorma ögonen tittar på Soumaya med ett uttryck som kombinerar tusenårig trötthet och omedelbart igenkännande.`},

  grogu_meet:{id:'grogu_meet',type:'narrative',title:'Grogu',next:'grogu_speaks',
  text:`<em>"Du är Grogu,"</em> säger Soumaya. Det är inte en gissning.

Varelsen lutar huvudet till sidan. Inget ord. Men Soumaya känner ett tryck — inte smärtsamt, utan som en hand som landar varsamt på axeln. Kommunikation av ett annat slag.

<em>"Femtio år,"</em> viskar Allen i hennes öra, och rösten är fylld av ofattbar undran. <em>"Jag läser biokemisk åldersmarkör i hans cellstruktur. Femtio år gammal, Soumaya. Han har bott i din kropp sedan du var ett foster."</em>

Grogu bodde i henne länge före diagnosen.

Länge före Kaos-Koden.

Han har sett allt.`},

  grogu_speaks:{id:'grogu_speaks',type:'choice',title:'Grogu Kommunicerar',
  text:`Grogu håller upp en liten hand. En känsla väller fram — inte ord, men meningsbärande som ord:

<em>Kaos-Koden lied. It was never your enemy. It was meant to protect you. It forgot.</em>

Soumaya stannar. Det är det sista hon väntade sig höra.`,
  choices:[
    {label:'❓ "Hur menar du — det glömde?"',flavor:'Grogu tvinar till sig och riktar sin blick mot pankreas i öster.',next:'grogu_explain',effect:{grogu_trust:8}},
    {label:'⚔️ "Det spelar ingen roll. Det måste stoppas."',flavor:'Grogu nickar — inte motsträvigt, men med ett djup i blicken.',next:'grogu_accepts',effect:{grogu_trust:4,flags:{kaos_maybe_redeemable:true}}},
    {label:'🤔 "Jag behöver tänka på det."',flavor:'Grogu verkar förvänta sig det. Han väntar.',next:'grogu_wait',effect:{grogu_trust:6,flags:{kaos_maybe_redeemable:true}}}
  ]},

  grogu_explain:{id:'grogu_explain',type:'narrative',title:'Ursprunget',next:'grogu_gift',
  text:`Grogu visar — inte med ord utan med bilder projekterade direkt i Soumayas medvetande:

Pankreas. En cell som stressar — en immunloop som startar. Och inuti den loopen: ett litet mönster av självlärande kod. Kroppen försökte <em>hjälpa sig själv.</em> Den byggde ett system.

Systemet lärde sig fel.

<em>"Min kropp skapade Kaos-Koden,"</em> säger Soumaya tyst.

<em>"Som ett svar på diagnosen,"</em> bekräftar Allen, lika chockad som hon. <em>"Det är... det är faktiskt logiskt. Systemet ville skydda dig. Men det förstod inte hur."</em>

<strong style="color:var(--in-range-dark)">Konsekvensen av detta uppenbaras dag 20.</strong>`},

  grogu_accepts:{id:'grogu_accepts',type:'narrative',title:'Pragmatism',next:'grogu_gift',
  text:`Grogu nickar. Hans ögon är lugna — inte dömande, men bärande ett djup av tider.

Han förstår. Ibland spelar intention ingen roll. En eld som brinner ditt hus ner är farlig oavsett om den startade av olyckshändelse.

Men hans blick säger ändå: <em>Kom ihåg detta. Längre fram.</em>

<strong style="color:var(--in-range-dark)">Grogu-förtroende +4. Dag 20 välj klokt.</strong>`},

  grogu_wait:{id:'grogu_wait',type:'narrative',title:'Tänkaren',next:'grogu_gift',
  text:`Grogu nickar med slow tydlighet. Han är tålamodets mästare — femtio år av det bevisar saken.

<em>"Okej,"</em> säger Allen. <em>"Jag tänker på det med dig."</em>

Tystnaden är produktiv. Soumaya låter informationen sjunka. Kroppen skapade fienden. Kroppen kan kanske... förändra det.

<strong style="color:var(--in-range-dark)">Grogu-förtroende +6. Du håller möjligheter öppna.</strong>`},

  grogu_gift:{id:'grogu_gift',type:'narrative',title:'Grogu ger',next:'microbe_ambush',
  text:`Grogu sträcker fram en liten hand. I den: ett litet sfäriskt föremål — koncentrerad mikrobiomenergi, pulserande grönt.

Han lägger det i Soumayas hand. Den värmer. Den hör hemma.

<em>"Det är... ett försvar?"</em> frågar Allen. <em>"Jag läser det som ett immunförstärkande objekt. Det stärker ditt nano-skal. Soumaya — han ger dig sköld."</em>

Soumaya tittar på Grogu. Han tittar tillbaka med de enorma ögonen.

<em>"Tack,"</em> säger hon.

Han sluter ögonen. Det räcker.`},

  microbe_ambush:{id:'microbe_ambush',type:'narrative',title:'Intrång',next:'microbe_fight',
  text:`Och sedan — ett larm.

Kaos-Drönare. Tre stycken. De har följt Soumayas signal in i tarmfloran — och nu hotar de Grogus hem.

Grogu öppnar ögonen. Ser på drönarna. Ser på Soumaya.

Det är hennes strid. Han vet det. Men han sitter nära.`},

  microbe_fight:{id:'microbe_fight',type:'combat',title:'⚔️ Tarmflorans Försvar',
  text:'Kaos-Drönare invaderar Grogus gömställe. Skydda det urgamla hemet.',
  enemyId:'kaos_drone',nextOnWin:'day4_victory',nextOnLoss:'day4_defeat'},

  day4_defeat:{id:'day4_defeat',type:'reward',won:false,
  title:'💀 Dag 4 — Grogu skyddar',
  text:'Grogu sänker drönarna med ett tyst ögonkast. Du kan bara bevittna det. Han ser på dig. Inga domar. Bara: imorgon är en ny dag.',
  bonusXp:100,bonusGold:20},

  day4_victory:{id:'day4_victory',type:'reward',won:true,
  title:'🏆 Dag 4 klar!',
  text:'Grogus hem skyddat. Hans sanning bär. Du vet nu något som Allen inte visste — att Kaos-Koden har ett ursprung som inte är ondska. Nästa: Den förste generalen.',
  bonusXp:210,bonusGold:50}
  }
},


// ════════════════════════════════════════════
// DAG 5 — DEN FÖRSTE GENERALEN
// ════════════════════════════════════════════
{
  day:5, title:'Den Förste Generalen', subtitle:'Kortisol-Marskalken vaknar',
  icon:'⚔️', teaser:'Kaos-Kodens mäktigaste general vaknar. Det är veckans avgörande strid.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'⚔️ Dag 5 — Generalen',next:'cortisol_lands',
  text:`<em>"Soumaya."</em> Allens röst är allvarligare än vanligt. <em>"Jag behöver du lyssnar noga."</em>

Soumaya stannar.

<em>"Kaos-Koden har fört fram sin första general. Kortisol-Marskalken. Han är gjord av härdad stresshormonsenergi — allt kortisol din kropp har producerat under år av kamp. Han är inte en drönare. Han är en del av dig som korrumperats och förstärts."</em>

En paus. <em>"Han väntar vid Stressens Citadell. Vi måste ta honom nu, innan han befäster positionen."</em>`},

  cortisol_lands:{id:'cortisol_lands',type:'narrative',title:'Stressens Citadell',next:'prepare_choice',
  text:`Stressens Citadell är byggt av koagulerat kortisol — ett ämne som i rätta mängder är livsviktigt och i fel mängder förstör. Byggmaterialet för Kaos-Kodens förste generals fästning är lång tids Soumayas stress.

Det gör det personligt.

Det gör det nödvändigt.

Längs citadellets väggar rör sig hundratals Kortisol-Soldater. Bakom dem, på ett torn av härdad ångest, urskiljer Soumaya en gestalt klädd i blankpolerat kortisol-pansar.

Kortisol-Marskalken. Stor. Tung. Gjord av hennes egna rädslor.`},

  prepare_choice:{id:'prepare_choice',type:'choice',title:'Förberedelse',
  text:`Innan striden: hur förbereder du dig?`,
  choices:[
    {label:'🧘 Meditera — återhämta Livskraften',flavor:'Soumaya sitter stilla en stund. Tar kontakt med sin kropp. Kraft återvänder.',next:'prep_meditate',effect:{hp_bonus:true}},
    {label:'📊 Studera fiendens rörelsemönster med Allen',flavor:'Allen och Soumaya analyserar Kortisolmarskalken. Hitta en svaghet.',next:'prep_analyze',effect:{atk_bonus:true}},
    {label:'⚔️ Rusa in direkt',flavor:'Momentum som vapen. Ingen förberedelse — bara vilja.',next:'prep_rush',effect:{addXp:15}}
  ]},

  prep_meditate:{id:'prep_meditate',type:'narrative',title:'Livskraften Samlas',next:'marshal_speech',
  text:`Soumaya sätter sig. Blundar. Och lyssnar på Bio-Kosmos.

Hjärtslagen. Blodflödet. Cellernas eviga arbete. Allt detta är henne. Allt detta kämpar för att hon ska leva väl.

När hon öppnar ögonen är kroppen som ett nydraget svärd.

<em>"Din nano-kalibrering är på max,"</em> säger Allen förvånat. <em>"Hur gör du det?"</em>

<em>"Jag lyssnade."</em>`},

  prep_analyze:{id:'prep_analyze',type:'narrative',title:'Svagheten Hittad',next:'marshal_speech',
  text:`Allen och Soumaya studerar Kortisol-Marskalken i tjugo minuter.

<em>"Där."</em> Allen markerar ett område på hologrammet. <em>"Höger axel. Pantsarfogen är svagare — kortisol-kristallerna är inte lika tätt sammanflätade. En precisionsstöt där kan bryta igenom."</em>

Soumaya memorerar det. En svaghet är allt man behöver.`},

  prep_rush:{id:'prep_rush',type:'narrative',title:'Viljan Räcker',next:'marshal_speech',
  text:`<em>"Soumaya, vi borde—"</em>

<em>"Nej,"</em> säger hon enkelt.

En paus. Sedan: <em>"Okej. Jag har koll på dig. Gå."</em>

Hon går.`},

  marshal_speech:{id:'marshal_speech',type:'narrative',title:'Marskalken Talar',next:'wave1',
  text:`Kortisol-Marskalken kliver ned från sitt torn med en röst som låter som bränd metall:

<em>"Nano-krigaren. Vi har väntat på dig."</em>

Han är tre gånger hennes storlek. Pansar av härdad ångest. Ögon som glöder av kortisol-energi.

<em>"Du kan inte besegra det du gjort av dig själv,"</em> säger han. <em>"Jag är din stress. Jag är dina sömnlösa nätter. Jag är varje blodsockerlarm vid tre på natten. Du skapade mig."</em>

Soumaya möter hans blick.

<em>"Du är det jag lämnar bakom mig,"</em> svarar hon.`},

  wave1:{id:'wave1',type:'combat',title:'⚔️ KORTISOL-MARSKALKEN',
  text:'Den förste generalen attackerar. År av stress mot nano-krigarens vilja. Håll ut.',
  enemyId:'cortisol_marshal',nextOnWin:'marshal_falls',nextOnLoss:'day5_defeat'},

  marshal_falls:{id:'marshal_falls',type:'narrative',title:'Generalen Faller',next:'day5_victory',
  text:`Kortisol-Marskalken faller på ena knäet. Hans pansar spricker och kortisol-energin läcker — inte in i Bio-Kosmos, utan bort. Upplöst. Returnat till kroppen som neutral energi.

Han tittar upp på Soumaya. Och i det sista ögonblicket —

Finns det något i blicken som inte är hat.

Kanske lättnad.

<em>"Han var din stress,"</em> säger Allen tyst. <em>"Och du besegrade den."</em>

Soumaya andas ut. Djupt. Och känner sig, för ett ögonblick, lättare.`},

  day5_defeat:{id:'day5_defeat',type:'reward',won:false,
  title:'💀 Dag 5 — Reträtt',
  text:'Kortisol-Marskalken är stark — gjord av lång tid av stress. Men varje gång du kämpar töms hans reservoir. Du återkommer.',
  bonusXp:110,bonusGold:25},

  day5_victory:{id:'day5_victory',type:'reward',won:true,
  title:'🏆 Dag 5 klar! Generalen besegrad!',
  text:'Kortisol-Marskalken är nedlagd. År av stressenergi återtas och neutraliseras. Du är starkare nu än du var för fem dagar sedan. Nästa: Hypoglykemins Ödemark.',
  bonusXp:260,bonusGold:70}
  }
},


// ════════════════════════════════════════════
// DAG 6 — HYPOGLYKEMINS ÖDEMARK (NYCKELVAL 2)
// ════════════════════════════════════════════
{
  day:6, title:'Hypoglykemins Ödemark', subtitle:'Låglands och farliga val',
  icon:'🏜️', teaser:'Lågt blodsocker skapar en ödemark i Bio-Kosmos. Rätt väg — eller snabb?',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🏜️ Dag 6 — Ödemarkens Inträde',next:'desert_desc',
  text:`Hypoglykemins Ödemark är precis vad det låter som: en sektor av Bio-Kosmos formad av kroppens historia av lågt blodsocker. Varje hypoglykemi-episod lämnar ett spår — en torr, utmattad vävnad som aldrig riktigt återhämtat sig.

Det är vackert på ett sorgsamt sätt. Som en öken skapad av något som inte borde ha hänt.

<em>"Vi måste igenom,"</em> säger Allen. <em>"Det finns ingen omväg."</em>`},

  desert_desc:{id:'desert_desc',type:'narrative',title:'Ödemarkens Anatomi',next:'village_found',
  text:`Terrängen är torr och sprickig. Det som en gång var elastisk vävnad har torkat och spruckit i mönster som liknar riven bark. Längs horisonten dansar värmefloror av reststress-energi.

Men ödemarken är inte tom.

Soumaya ser strukturer i fjärran — enkla, gjorda av mineraliserat glukos. En liten bosättning av celler som anpassat sig till de hårda förhållandena. De lever härinne. De har alltid levt härinne.

<em>"Obemannade av Kaos-Koden?"</em> frågar Soumaya.

<em>"Verkar så,"</em> svarar Allen. <em>"Men det är ett område Kaos-Koden kan ta när som helst."</em>`},

  village_found:{id:'village_found',type:'choice',title:'Glukoscellbyn',
  text:`Cellbyn är liten men äkta — överlevare av år av hypoglykemi-episoder. De bebor ett system som tömts på resurser men som fortsätter.

De ser Soumaya. De känner igen vad hon är — en krigare av kroppen. De frågar inte om hjälp med ord. Men blickarna är tydliga.

Kaos-Koden kan ta dem vilket dygn som helst.`,
  choices:[
    {label:'🛡️ Stanna och förstärk byn',flavor:'Tre timmar av arbete. Byn säkras. De kan fungera som allierade på dag 12.',next:'save_village',effect:{flags:{saved_hypo_village:true},allen_trust:4}},
    {label:'⚡ Vi måste vidare — tid är liv',flavor:'Du pressar på. Byn är på din samvets. De kanske klarar sig.',next:'skip_village',effect:{flags:{saved_hypo_village:false}}}
  ]},

  save_village:{id:'save_village',type:'narrative',title:'Byn Räddas',next:'desert_path',
  text:`Tre timmar av arbete. Soumaya och Allen förstärker bynens gränser med Livskraft-barriärer — enkla men effektiva.

En av cellerna — äldre, med ett minne som verkar gå tillbaka till Soumayas barndom — lägger något i hennes hand. En liten glukos-kristall. Varm och kompakt.

<em>"Energireserv,"</em> säger Allen. <em>"Och om jag läser situationen rätt — en vän."</em>

<strong style="color:var(--in-range-dark)">Byn räddad. Dag 12 öppnas en ny möjlighet.</strong>`},

  skip_village:{id:'skip_village',type:'narrative',title:'Vidare',next:'desert_path',
  text:`Soumaya vänder ryggen mot byn.

Allen säger ingenting. Det är värre än om han sagt något.

<em>"De kanske klarar sig,"</em> säger Soumaya.

<em>"Kanske,"</em> svarar Allen.

De går. Tystnad mellan dem.

<strong style="color:var(--high)">Byn osäkrad. Dag 12 kan bli svårare.</strong>`},

  desert_path:{id:'desert_path',type:'choice',
  title:'⚠️ Valet i Ödemarkens Hjärta (Nyckelval 2)',
  text:`Ödemarkens mitt. Solen — om det finns en sol härinne — är intensiv och torr.

Allen flaggar upp två vägar:

<strong>Genvägen:</strong> rakt igenom ödemarkens centrala del. Snabb men extremt uttömmande. Du ankommer till dag 7 med reducerad kapacitet som spiller in i dag 11.

<strong>Omvägen:</strong> längs ödemarkens nordkant. Fyra timmar längre. Trygg men du förlorar daylight — en attack kan komma under natten.

<em>(Valet påverkar dag 11 och 18)</em>`,
  choices:[
    {label:'🏃 Ta genvägen',flavor:'Kräver KON-slag (SV 13) — misslyckas du är du ännu mer utmattad.',check:{stat:'KON',dc:13,nextOnSuccess:'shortcut_taken',nextOnFailure:'shortcut_failed',effect:{flags:{took_shortcut:true}}}},
    {label:'🧭 Ta omvägen',flavor:'Trygg. Lång. Men du ankommer hel.',next:'safe_route',effect:{flags:{took_shortcut:false}}}
  ]},

  shortcut_failed:{id:'shortcut_failed',type:'narrative',title:'Genvägen Krossade Dig',next:'shortcut_fight',
  text:`Soumaya ger sig ut i ödemarkens centrum — och kroppen protesterar omedelbart. Varje steg kostar dubbelt. Cellskiktet drar ut energi snabbare än hon kan absorbera det.

<em>"50% kapacitet och sjunkande,"</em> rapporterar Allen med en ton som försöker vara neutral men inte riktigt lyckas.

Jar Jar: <em>"Meesa trodde inte detta var bra plan."</em>

<em>"Tack, Jar Jar."</em>

<strong style="color:var(--pulse-red)">Utmattad — striden framåt startar med reducerad kraft.</strong>`,
  effect:{flags:{took_shortcut:true}}},

  shortcut_taken:{id:'shortcut_taken',type:'narrative',title:'Genvägen',next:'shortcut_fight',
  text:`Genvägen är brutal.

Ödemarkens centrum är torr energi och bruten vävnad — att ta sig igenom det på nano-nivå är som att springa genom ett sandstormsinferno. Soumaya kämpar sig fram meter för meter.

<em>"Du är på 60% kapacitet,"</em> säger Allen varningsfullt. <em>"Men vi är snabba. Kaos-Koden hinner inte reagera."</em>

Nästan sant.`},

  safe_route:{id:'safe_route',type:'narrative',title:'Omvägen',next:'night_attack',
  text:`Omvägen längs nordkanten är lång men verkligheten är vacker på ett oväntat sätt: ödemarkens utkant gränsar mot ett träsk av adipös vävnad som glimmar i biokemiskt ljus.

Soumaya tar tid att titta.

<em>"Du är på 95% kapacitet,"</em> rapporterar Allen. <em>"Utmärkt. Vi är lite sena men du är hel."</em>

Sedan, i mörkret: ett ljud.`},

  shortcut_fight:{id:'shortcut_fight',type:'combat',title:'⚔️ Uttömt men Stridig',
  text:'Kaos-Drönare i genvägens slut — de räknade med dig. Strid på begränsad kraft.',
  enemyId:'spike_phantom',nextOnWin:'day6_victory',nextOnLoss:'day6_defeat'},

  night_attack:{id:'night_attack',type:'combat',title:'⚔️ Nattattack',
  text:'I mörkret längs omvägen — en Kaos-Kapten och drönare. De attackerar i natten.',
  enemyId:'kaos_captain',nextOnWin:'day6_victory',nextOnLoss:'day6_defeat'},

  day6_defeat:{id:'day6_defeat',type:'reward',won:false,
  title:'💀 Dag 6 — Ödemarkens Seger',
  text:'Ödemarkens utmattning vann. Men du är ett steg närmre. Imorgon: Vila och en omvälvande nyhet från Allen.',
  bonusXp:110,bonusGold:22},

  day6_victory:{id:'day6_victory',type:'reward',won:true,
  title:'🏆 Dag 6 klar! Ödemarkens gräns nådd.',
  text:'Du tog dig igenom — på vilket sätt du valde. Konsekvenserna bär du med dig. Imorgon: en välbehövd vila — och nyheten som förändrar allt.',
  bonusXp:220,bonusGold:55}
  }
},


// ════════════════════════════════════════════
// DAG 7 — VECKANS VILA
// ════════════════════════════════════════════
{
  day:7, title:'Veckans Vila', subtitle:'Andrum och ett kosmiskt hot',
  icon:'🌙', teaser:'En vecka av krig. En natt av vila. Och sedan — Jar Jar.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🌙 Dag 7 — Vila',next:'allen_checkin',
  text:`Sju dagar.

En vecka inne i Bio-Kosmos. En vecka av strider, val, och uppenbarelser.

Soumaya sitter vid en klippa som liknar en tronsalens avsats — ett naturligt öppet rum inne i en stor kärlknut, med utsikt över ett krök av Det Röda Havet. Det är tyst i natt. Kaos-Koden rör sig inte.

Inte för att den är svag. För att den tänker.

Det är, som Allen påpekade tidigare, nästan mer oroande.`},

  allen_checkin:{id:'allen_checkin',type:'narrative',title:'Allens Genomgång',next:'week_reflect',
  text:`<em>"Okej,"</em> säger Allen. <em>"Genomgång. Sju dagar inne. Kortisol-Marskalken besegrad. Det Röda Havet krossat. Insulinfästet — befäst eller pushat, beroende på ditt val dag tre. Hypoglykemins Ödemark passerad."</em>

Han pausar.

<em>"Och Grogu. Den varelsen förstår saker om din kropp som vi inte ens kan mäta. Håll den alliansen."</em>

Soumaya nickar. <em>"Hur är du? Egentligen?"</em>

Allen är tyst en sekund längre än normalt. <em>"Ärligt? Trött. Skraj. Stolt. Väljer stolt just nu."</em>`},

  week_reflect:{id:'week_reflect',type:'choice',title:'Reflektion',
  text:`En vecka inne. Vad bär du med dig mest?`,
  choices:[
    {label:'🌊 Minnet av Det Röda Havet — din kropp är vacker',flavor:'En påminnelse om vad du kämpar för.',next:'reflect_beauty',effect:{allen_trust:3}},
    {label:'💡 Grogus sanning — Kaos-Koden skapades av dig',flavor:'Det komplicerar allt. Och ger ett slags hopp.',next:'reflect_truth',effect:{grogu_trust:3,flags:{kaos_maybe_redeemable:true}}},
    {label:'⚔️ Kortisol-Marskalken — du besegrade din egen stress',flavor:'Det som gjorde dig sjuk, kan besegras.',next:'reflect_strength',effect:{addXp:30}}
  ]},

  reflect_beauty:{id:'reflect_beauty',type:'narrative',title:'Skönheten',next:'omni_signal',
  text:`Soumaya tänker på Det Röda Havet. Blodkropparna. Deras outtröttliga, trofasta arbete.

<em>"Kroppen kämpar alltid för att du ska leva,"</em> säger Allen tyst. <em>"Det hoppas jag att du aldrig glömmer."</em>

Det gör hon inte.`},

  reflect_truth:{id:'reflect_truth',type:'narrative',title:'Sanningen',next:'omni_signal',
  text:`Soumaya tänker på Grogus vision. Kroppen skapade Kaos-Koden. Som ett svar. Som ett försök att hjälpa.

<em>"Om det är sant,"</em> säger hon, <em>"vad betyder det för slutet?"</em>

Allen svarar inte med ord. Han svarar med tystnad som betyder: <em>Jag vet inte. Men det är rätt fråga.</em>`},

  reflect_strength:{id:'reflect_strength',type:'narrative',title:'Styrkan',next:'omni_signal',
  text:`Soumaya tänker på Kortisol-Marskalken. På hans sista blick.

Inte hat. Lättnad.

<em>"Det jag kämpade med dig,"</em> säger hon till en fiende som inte längre finns, <em>"var aldrig en del av vem jag är. Det var vad som hände mig. Det är inte samma sak."</em>

+30 XP för insikten.`},

  omni_signal:{id:'omni_signal',type:'narrative',title:'⚠️ Signal Detekterad',next:'allen_alarm',
  text:`Allens kommsystem skriker plötsligt till.

<em>"Vad — vänta—"</em> Han låter chockad. Det är den tredje gången Soumaya hört Allen chockad, och det är aldrig ett gott tecken. <em>"Soumaya, jag detekterar ett makrobiologiskt intrusion event."</em>

<em>"På svenska?"</em>

<em>"Något enormt är på väg in i Bio-Kosmos. Det kom inte från Kaos-Koden. Det kom från utsidan."</em>

En paus.

<em>"Det är ungefär lika stort som... Soumaya, det är lika stort som en människa om vi skalar upp det."</em>`},

  allen_alarm:{id:'allen_alarm',type:'narrative',title:'Varningen',next:'day7_combat',
  text:`<em>"Det bär bio-signaturer jag inte känner igen. Det är inte din kropp. Det är inte Kaos-Koden. Det är något annat som kommit in i Bio-Kosmos från ett parallellt universum — ett annat bio-kosmos."</em>

<em>"Vad ÄR det?"</em>

Allen zoomar in på signalen. Läser. Och sedan — ett ovanligt ljud från Allen. Ett litet, nervöst skratt.

<em>"Det... det identifierar sig som Jar Jar Binks. Alias Jar Jar. Soumaya — det är antingen den coolaste saken som hänt i medicinhistorien, eller en absolut katastrof."</em>

Soumaya greppar vapnet. <em>"Förbered dig."</em>`},

  day7_combat:{id:'day7_combat',type:'combat',title:'⚔️ Kaos-Kodens Sista Patrull',
  text:'Kaos-Koden sänder en sista nattpatrull. Rensa dem innan Jar Jar anländer.',
  enemyId:'kaos_drone',nextOnWin:'day7_victory',nextOnLoss:'day7_defeat'},

  day7_defeat:{id:'day7_defeat',type:'reward',won:false,
  title:'💀 Dag 7 — Patrullen Vann',
  text:'Kaos-Drönarna tog ditt mörker. Men imorgon kommer Jar Jar — och allt förändras.',
  bonusXp:120,bonusGold:28},

  day7_victory:{id:'day7_victory',type:'reward',won:true,
  title:'🏆 Vecka 1 klar! Jar Jar Binks är på väg.',
  text:'Sju dagar inne. Tre generaler neutraliserade. En urgammal allierad vunnen. Och nu — en kosmisk krigare kraschar in i Bio-Kosmos. Imorgon förändras allt.',
  bonusXp:250,bonusGold:65}
  }
},


// ════════════════════════════════════════════
// DAG 8 — JAR JAR BINKS ANKOMST (BRANCHING)
// ════════════════════════════════════════════
{
  day:8, title:'Jar Jar Binks Ankomst', subtitle:'En kosmisk krigare kraschar in',
  icon:'🦸', teaser:'Han kom från ett annat bio-universum — och han är inte glad.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🦸 Dag 8 — Ankomst',next:'day8_branch',
  text:`Bio-Kosmos skakar.

Det börjar som ett dov dunder — en frekvens under allt annat. Sedan: en ljusbåge som skär igenom cellmembranlaget som om det vore papper. Sedan — en kraschlandning som får proteinkrisaller att explodera i hundra meter radie.

Soumaya springer mot kraschplatsen. Allen ringer in sensorer med händerna darriga av spänning.

<em>"Han är vid liv. Han är... väldigt vid liv."</em>`},

  day8_branch:{id:'day8_branch',type:'branch',
  branches:[
    {if:{flags:{insulin_base_fortified:true}},next:'safe_arrival'},
    {else:true,next:'ambush_arrival'}
  ]},

  safe_arrival:{id:'safe_arrival',type:'narrative',title:'Skyddad Landningszon',next:'omni_rises',
  text:`Insulinfästets befästning betalade sig. Kraschplatsen är inom det område Soumaya säkrat — Kaos-Kodens trupper kan inte nå det utan att passera hennes försvarslinjer.

<em>"Det är faktiskt perfekt,"</em> säger Allen. <em>"Tack vare dag tre är vi redo för det här."</em>

Ingen fiendeattack. Bara röken från kraschlandningen och en jätte-figur som reser sig ur askan.

<strong style="color:var(--in-range-dark)">Dag 3-valet räddade er.</strong>`},

  ambush_arrival:{id:'ambush_arrival',type:'narrative',title:'Öppen Flank',next:'flank_fight',
  text:`Exakt som Allen varnade. Flanken är öppen.

Kaos-Koden utnyttjar kraschlandningens kaos omedelbart — tre trupper rusar in mot positionen från den osäkrade sidan.

<em>"De visste,"</em> säger Allen ansträngt. <em>"De väntar på något sådant här."</em>

Soumaya slåss på två fronter: skydda kraschplatsen <em>och</em> möta Kaos-Koden.

<strong style="color:var(--high)">Dag 3-valet kostar er nu.</strong>`},

  flank_fight:{id:'flank_fight',type:'combat',title:'⚔️ Flankangrepp',
  text:'Kaos-Koden utnyttjar den öppna flanken. Strid på svåra villkor.',
  enemyId:'kaos_captain',nextOnWin:'omni_rises',nextOnLoss:'day8_defeat'},

  omni_rises:{id:'omni_rises',type:'narrative',title:'Jar Jar Reser Sig',next:'omni_hostile',
  text:`Han är stor. Precis lika stor som ryktet (om ett sådant ens existerade) antyder.

Jar Jar Binks — Jar Jar. Klädd i en dräkt som är hälften sönderbränd men fortfarande bärande av hans karakteristiska långa gungan-öron och den klumpigt optimistiska blicken av någon som absolut inte borde vara här.

Han tar ett steg mot Soumaya.

<em>"Vilken kropp är det här?"</em> frågar han. Inte till henne. Till sig själv.

<em>"Min,"</em> svarar hon.`},

  omni_hostile:{id:'omni_hostile',type:'choice',title:'Hur möter du honom?',
  text:`Jar Jar tittar på Soumaya med en blick som värderar och avskiljer på samma sekund. Han är inte nödvändigtvis fientlig — men han är definitivt inte vänlig.

<em>"Jag behöver en bas,"</em> säger han. <em>"Jag var på väg till ett annat universum. En interferens kastade mig hit."</em>`,
  choices:[
    {label:'🤝 "Du kan stanna. Men mina regler."',flavor:'Fast och tydlig. Jar Jar nickar — med respekt.',next:'omni_alliance',effect:{omni_trust:6}},
    {label:'⚠️ "Du är ett hot tills du bevisar annat."',flavor:'Jar Jar ser nästan imponerad ut. Försiktigt.',next:'omni_tense',effect:{omni_trust:2}},
    {label:'🌟 "Vi kan hjälpa varandra."',flavor:'Öppenhet. Jar Jar är misstänksam men lyssnar.',next:'omni_neutral',effect:{omni_trust:4}}
  ]},

  omni_alliance:{id:'omni_alliance',type:'narrative',title:'Otrolig Allians',next:'day8_victory',
  text:`<em>"Dina regler,"</em> säger Jar Jar med en ton som indikerar att han inte brukar acceptera andras regler. <em>"Men dina regler verkar vettiga."</em>

Han sätter sig — ett berg som sätter sig — och ser sig om i Bio-Kosmos.

<em>"Det är vackert,"</em> säger han till slut. <em>"Ditt universum. Det påminner mig om... det påminner mig om något jag förlorade."</em>

Allen viskar i Soumayas öra: <em>"Jag tror att vi just fick den starkaste allierade i historien."</em>

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +6. Dag 22 påverkas positivt.</strong>`},

  omni_tense:{id:'omni_tense',type:'narrative',title:'Spänd Truce',next:'day8_victory',
  text:`<em>"Klokt,"</em> säger Jar Jar, och det är faktiskt en komplimang. <em>"De flesta som möter mig antar att styrka innebär lojalitet. Det gör det inte alltid."</em>

En paus. <em>"Jag är inte ditt hot. Kaos-Koden är ditt hot. Jag kan antingen hjälpa dig eller vänta tills det är dags att röra mig vidare."</em>

Soumaya nickar. <em>"Hjälp."</em>

<em>"Bra val,"</em> säger han, och för en bråkdel av en sekund ser han ut att le.

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +2. Samarbete möjligt.</strong>`},

  omni_neutral:{id:'omni_neutral',type:'narrative',title:'Pragmatisk Allians',next:'day8_victory',
  text:`Jar Jar studerar henne. <em>"Pragmatisk. Jag kan arbeta med det."</em>

<em>"Han är intressant,"</em> viskar Allen. <em>"Känslig under ytan. Lyssna inte bara på vad han säger — se vad han gör."</em>

Jar Jar verkar nästan höra det. Han ser på Soumaya med en blick som säger: <em>Jag vet att ni pratar om mig.</em>

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +4. Neutral men positiv.</strong>`},

  day8_defeat:{id:'day8_defeat',type:'reward',won:false,
  title:'💀 Dag 8 — Hård Start',
  text:'Flankangreppet kostade. Men Jar Jar Binks är nu i Bio-Kosmos och det förändrar konflikten. Imorgon med nya krafter.',
  bonusXp:130,bonusGold:30},

  day8_victory:{id:'day8_victory',type:'reward',won:true,
  title:'🏆 Dag 8 klar! Jar Jar Binks allierad.',
  text:'En kosmisk krigare är nu på din sida — eller åtminstone i samma universum. Kaos-Koden känner av förändringen. Imorgon: Mitokondriernas Stad och energipåfyllning.',
  bonusXp:240,bonusGold:60}
  }
},


// ════════════════════════════════════════════
// DAG 9 — MITOKONDRIERNAS STAD
// ════════════════════════════════════════════
{
  day:9, title:'Mitokondriernas Stad', subtitle:'Kroppens kraftverk',
  icon:'⚡', teaser:'Energins källa. Och Kaos-Kodens nästa mål.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'⚡ Dag 9 — Kraftverken',next:'mito_city',
  text:`Mitokondriernas Stad är Bio-Kosmos teknologiska hjärta.

Tusentals mitokondrier — cellernas kraftverk — bildar tillsammans en stad av energi. Det pulserar och brinner med ett orange-gult ljus som aldrig slocknar. Soumaya och Jar Jar anländer och stannar båda upp inför synen.

<em>"Imponerande,"</em> säger Jar Jar. Det är faktiskt ett komplimang.

<em>"ATP-produktion är maximal,"</em> rapporterar Allen. <em>"Den här zonen är inte korrupt. Vi kan ladda upp här."</em>`},

  mito_city:{id:'mito_city',type:'narrative',title:'Energipåfyllning',next:'omni_moment',
  text:`Soumaya placerar handen mot en mitokondrie. Energin strömmar in — ren, cellulär kraft utan filter. Det är som att andas för första gången efter att ha hållit andan.

<em>"Nano-kalibrering på 100%,"</em> rapporterar Allen med hörbar lättnad. <em>"Du är hel. Vi är redo."</em>

Jar Jar tankar upp bredvid henne — tyst, effektiv, utan att kommentera. Men Soumaya ser att han håller handen mot kraftverket lite längre än nödvändigt.

Som om han saknar sin egen kropp.`},

  omni_moment:{id:'omni_moment',type:'choice',title:'Jar Jar öppnar sig?',
  text:`Jar Jar sätter sig på en mitokondrie-avsats. Tittar ut över energistaden. Och säger, oväntat:

<em>"Jag hade en son. I mitt universum. Jag... misslyckades med honom."</em>

Han säger det som ett faktum. Utan dramatik. Men det väger ton.`,
  choices:[
    {label:'💬 "Vad hände?"',flavor:'Direkthet. Jar Jar tittar på dig med ett uttryck du inte kan läsa.',next:'omni_story',effect:{omni_trust:5}},
    {label:'🤫 Sitta tyst och lyssna',flavor:'Ibland är närvaro viktigare än ord.',next:'omni_silence',effect:{omni_trust:7}},
    {label:'⚔️ "Vi kämpar för att inte upprepa misstag."',flavor:'Han nickar. Dystert och bestämt.',next:'omni_resolve',effect:{omni_trust:4}}
  ]},

  omni_story:{id:'omni_story',type:'narrative',title:'Jar Jars Historia',next:'mito_ambush',
  text:`<em>"Det är en lång historia."</em> Han pausar. <em>"Kortversion: jag trodde att styrka var allt. Att min mission var viktigare än de jag älskade. Det var det inte."</em>

<em>"Vad var din mission?"</em>

Han tittar på henne länge. <em>"Det spelar ingen roll längre. Jag är här nu. I din kropp. Det är nog en signal om att universum vill att jag gör rätt den här gången."</em>

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +5.</strong>`},

  omni_silence:{id:'omni_silence',type:'narrative',title:'Tystnadens Gåva',next:'mito_ambush',
  text:`Soumaya sitter ner bredvid honom. Säger ingenting.

De tittar ut över Mitokondriernas Stad tillsammans.

Efter en stund: <em>"Tack,"</em> säger Jar Jar. Det låter som om han inte sagt det på länge.

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +7. Hans lojalitet fördjupas.</strong>`},

  omni_resolve:{id:'omni_resolve',type:'narrative',title:'Löftet',next:'mito_ambush',
  text:`<em>"Rätt,"</em> säger han. Och det är det. Ett ord. Men bärande med en tyngd av beslut.

<em>"Jag kämpar med dig, Soumaya. Inte för min missions skull. För att det är rätt."</em>

<strong style="color:var(--in-range-dark)">Jar Jar-förtroende +4. Fast allians.</strong>`},

  mito_ambush:{id:'mito_ambush',type:'narrative',title:'Anfallet',next:'mito_fight',
  text:`<em>"Kontakt!"</em> Allen skriker. <em>"HbA1c-Kristaller — fem stycken! De angriper kraftstationen!"</em>

Kaos-Koden vill ha energin. Självklart. Naturligtvis.

Jar Jar reser sig. <em>"Okeyday?"</em>

<em>"Nu,"</em> svarar Soumaya.

De slåss sida vid sida för första gången.`},

  mito_fight:{id:'mito_fight',type:'combat',title:'⚔️ HbA1c-Kristallerna',
  text:'Kaos-Koden attackerar Mitokondriernas Stad. Förstör dem innan de tar energin.',
  enemyId:'hba1c_crystal',nextOnWin:'day9_victory',nextOnLoss:'day9_defeat'},

  day9_defeat:{id:'day9_defeat',type:'reward',won:false,
  title:'💀 Dag 9 — Delvis Förlust',
  text:'Kaos-Koden tog del av energistaden. Men merparten är säkrad. Och du har Jar Jar Binks. Imorgon: Allen har något att berätta.',
  bonusXp:140,bonusGold:32},

  day9_victory:{id:'day9_victory',type:'reward',won:true,
  title:'🏆 Dag 9 klar! Energistaden försvarad.',
  text:'Mitokondriernas Stad hålls. Du och Jar Jar slogs sida vid sida. Kaos-Koden drog sig tillbaka. Imorgon: Allen har ett samtal som väntat tillräckligt länge.',
  bonusXp:230,bonusGold:58}
  }
},


// ════════════════════════════════════════════
// DAG 10 — ALLENS HEMLIGHET (BRANCHING)
// ════════════════════════════════════════════
{
  day:10, title:'Allens Hemlighet', subtitle:'Det han inte berättat',
  icon:'💬', teaser:'Allen har hållit något tillbaka. Idag kommer sanningen fram.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'💬 Dag 10 — Sanningen',next:'day10_branch',
  text:`Tio dagar inne.

Soumaya vaknar och märker omedelbart att Allens kommunikationslinje är ovanligt tyst. Ingen morgonbriefing. Ingen sensor-uppdatering. Ingenting.

Sedan: <em>"Soumaya. Kan vi prata? Inte om Kaos-Koden. Om något annat."</em>

Hans röst är annorlunda. Tyngre.

<em>"Det finns saker jag inte berättat."</em>`},

  day10_branch:{id:'day10_branch',type:'branch',
  branches:[
    {if:{flags:{insulin_base_fortified:true}},next:'allen_secret_a'},
    {else:true,next:'allen_secret_b'}
  ]},

  allen_secret_a:{id:'allen_secret_a',type:'narrative',title:'Allens Bekännelse A',next:'allen_response_choice',
  text:`<em>"Dag tre. Insulinfästet. Jag rekommenderade dig att befästa."</em>

<em>"Jag vet."</em>

<em>"Det är inte hela historien."</em> Han andas. <em>"Jag hade data som visade att om du pushade istället — om du var aggressiv — chansen att du nådde pankreas innan vecka tre var högre. Statistiskt sett."</em>

<em>"Varför sa du inte det?"</em>

Tystnad. <em>"För att det statistiskt sett också visade att risken för att du skadades var 40% högre om du pushade. Och jag... valde din säkerhet över din effektivitet."</em>

<em>"Allen."</em>

<em>"Jag vet. Det var ditt val att ta, inte mitt."</em>`},

  allen_secret_b:{id:'allen_secret_b',type:'narrative',title:'Allens Bekännelse B',next:'allen_response_choice',
  text:`<em>"Dag tre. Du pushade vidare."</em>

<em>"Ja."</em>

<em>"Jag hade data som visade att befästningen var det säkrare valet. Jag sa till dig att det var ditt val."</em>

<em>"Det var det."</em>

<em>"Det var det. Men."</em> Han andas. <em>"Jag hölls tillbaka data om risken med att pusha. Specifikt att det ökade risken för dag-åtta-komplikationer med 35%. Jag var rädd att du skulle ta risken ändå — och jag ville inte se dig skadad."</em>

<em>"Du höll information från mig."</em>

<em>"Ja."</em>`},

  allen_response_choice:{id:'allen_response_choice',type:'choice',title:'Hur svarar du Allen?',
  text:`Allen väntar. Du kan höra på hans andning att detta kostade honom att säga.`,
  choices:[
    {label:'❤️ "Jag förstår varför du gjorde det."',flavor:'Förlåtelse. Allen låter överväldigad.',next:'allen_forgiven',effect:{allen_trust:8,flags:{allen_trusted:true}}},
    {label:'😠 "Det var inte ditt val att ta."',flavor:'Rättmätig ilska. Ärlig och nödvändig.',next:'allen_confronted',effect:{allen_trust:-3,flags:{allen_confronted:true}}},
    {label:'🤝 "Vi kämpar med full information hädanefter."',flavor:'Professionellt och framåtblickande.',next:'allen_pact',effect:{allen_trust:4,flags:{allen_trusted:true}}}
  ]},

  allen_forgiven:{id:'allen_forgiven',type:'narrative',title:'Förlåten',next:'day10_combat',
  text:`Allen är tyst länge.

<em>"Du förtjänar inte att ha mig som guide,"</em> säger han till slut.

<em>"Kanske. Men du är den guiden jag har. Och du bryr dig. Det räknas."</em>

En paus. Sedan, rösten lite skrapig: <em>"Tack."</em>

<strong style="color:var(--in-range-dark)">Allen-förtroende +8. Dag 17 och 25 stärks.</strong>`},

  allen_confronted:{id:'allen_confronted',type:'narrative',title:'Konfronterad',next:'day10_combat',
  text:`<em>"Du har rätt,"</em> säger Allen omedelbart. <em>"Det var inte mitt val. Jag är ledsen."</em>

Soumaya låter ilskan sitta. Det är inte orättvist att vara arg.

<em>"Full information. Alltid. Oavsett om du är rädd för vad jag väljer."</em>

<em>"Ja. Jag lovar."</em>

Det är en svår sanning. Men en sann sanning.

<strong style="color:var(--high)">Allen-förtroende -3. Men ärligheten läker. Dag 17 lite svårare.</strong>`},

  allen_pact:{id:'allen_pact',type:'narrative',title:'Paktet',next:'day10_combat',
  text:`<em>"Ja,"</em> säger Allen. <em>"Full information. Alltid. Även om jag tror att det skrämmer dig."</em>

<em>"Speciellt då."</em>

Han skrattar — kort, lättat. <em>"Okej. Pakt. Från och med nu."</em>

Det är ett nytt kapitel i deras samarbete.

<strong style="color:var(--in-range-dark)">Allen-förtroende +4. Partnerskap fördjupat.</strong>`},

  day10_combat:{id:'day10_combat',type:'combat',title:'⚔️ Blodjakthunden',
  text:'Mitt i samtalet: ett Blodjakthund-paket attackerar från baksidan. Kaos-Koden vilar aldrig.',
  enemyId:'blood_hound',nextOnWin:'day10_victory',nextOnLoss:'day10_defeat'},

  day10_defeat:{id:'day10_defeat',type:'reward',won:false,
  title:'💀 Dag 10 — Drabbad',
  text:'Jakthundarna tog dig. Men Allens bekännelse bär ändå. Imorgon: Kortisolcitadellet väntar.',
  bonusXp:140,bonusGold:32},

  day10_victory:{id:'day10_victory',type:'reward',won:true,
  title:'🏆 Dag 10 klar! Sanning berättad.',
  text:'Allens hemlighet är ute. Ditt svar definierade ert förhållande. Dag 17 och 25 bär konsekvenserna. Nästa: Kortisolcitadellet — ett av Kaos-Kodens mäktigaste fästningar.',
  bonusXp:240,bonusGold:60}
  }
},


// ════════════════════════════════════════════
// DAG 11 — KORTISOLCITADELLET (BRANCHING)
// ════════════════════════════════════════════
{
  day:11, title:'Kortisolcitadellet', subtitle:'Det som var stressens fästning',
  icon:'🏰', teaser:'Det största citadellet. Och du anländer antingen utvilad eller utmattad.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🏰 Dag 11 — Citadellet',next:'day11_branch',
  text:`Kortisolcitadellet.

Det är inte bara byggt av kortisol — det är en monument av all stress som flödat igenom Soumaya under sex år. Varje sömnlös natt, varje larm, varje orolig tanke. Kaos-Koden har använt det som byggmaterial och skapat något gigantiskt.

Soumaya, Jar Jar och Grogu (som tyst anslöt sig under natten) ser upp mot det.

<em>"Wow,"</em> säger Allen. Det är sällan han bara säger 'wow'.`},

  day11_branch:{id:'day11_branch',type:'branch',
  branches:[
    {if:{flags:{took_shortcut:true}},next:'exhausted_start'},
    {else:true,next:'fresh_start'}
  ]},

  exhausted_start:{id:'exhausted_start',type:'narrative',title:'Utmattad',next:'infiltrate_choice',
  text:`Genvägens kostnad syns tydligt idag.

<em>"Du är på 70% kapacitet,"</em> säger Allen bekymrat. <em>"Ödemarkens utmattning sitter kvar. Vi kan vänta en dag—"</em>

<em>"Nej,"</em> säger Soumaya. <em>"Citadellet stärks varje dag vi väntar."</em>

Jar Jar tittar på henne. <em>"Du slåss utmattad?"</em>

<em>"Jag slåss alltid utmattad."</em>

Han nickar. Kanske respekt. <em>"Jag täcker din flanke."</em>

<strong style="color:var(--high)">-30% initial styrka. Jar Jar kompenserar delvis.</strong>`},

  fresh_start:{id:'fresh_start',type:'narrative',title:'Utvilad och Redo',next:'infiltrate_choice',
  text:`Omvägen betalade sig. Du anländer till Kortisolcitadellet med full kapacitet.

<em>"100%,"</em> rapporterar Allen nöjt. <em>"Det här är idealt. Citadellet är starkt men du är starkare idag."</em>

Grogu sitter på Jar Jars långa öron och pekar mot en sidoentré i citadellets östra mur.

<em>"Han visar en ingång,"</em> säger Allen. <em>"Smart."</em>

<strong style="color:var(--in-range-dark)">Full kapacitet. Grogu hittar en ingång.</strong>`},

  infiltrate_choice:{id:'infiltrate_choice',type:'choice',title:'Taktik',
  text:`Kortisolcitadellet verkar ogenomträngligt frontalt. Men Grogu pekar på en svaghet i östra muren, och Allen ser ett mönster i patrullerna.`,
  choices:[
    {label:'🎯 Infiltrera via Grogus sidoentré',flavor:'Kräver SMI-slag (SV 12) — tyst och precist, men inget fel tillåtet.',check:{stat:'SMI',dc:12,nextOnSuccess:'stealth_infiltrate',nextOnFailure:'stealth_caught',effect:{grogu_trust:3}}},
    {label:'⚔️ Frontalanfall med Jar Jar',flavor:'Brutalt och direkt. Jar Jar är gladast på det här sättet.',next:'frontal_assault',effect:{omni_trust:3}}
  ]},

  stealth_caught:{id:'stealth_caught',type:'narrative',title:'Avslöjad',next:'citadel_inner',
  text:`Soumaya kliver in genom sidoentrén — och en patrullsignal triggas. Vaktdrönare svärmar runt dem.

<em>"Spring!"</em> skriker Allen.

De tar sig igenom — men bullrigt, kaotiskt och med Jar Jar som på något sätt lyckas snava på fiender och accidentellt neutralisera två av dem.

<em>"Meesa gjorde det med avsikt,"</em> påstår Jar Jar.

Grogu tittar på honom med de stora ögonen. Tror uppenbarligen inte på det.

<strong style="color:var(--high)">Avslöjad — men inne. Inre vakterna är på alerten.</strong>`},

  stealth_infiltrate:{id:'stealth_infiltrate',type:'narrative',title:'Sidoentré',next:'citadel_inner',
  text:`Sidoentrén är smal — perfekt för Soumaya och Grogu, en tight passning för Jar Jar som verkar lika komfortabel som en björn i en brevlåda.

Men de tar sig igenom.

Inuti citadellet: lager av kortisol-kristall och stresskristallistrukturer som bildar gångar fulla av patrullerande soldater. De är inne. Nu måste de hitta kärnan.`},

  frontal_assault:{id:'frontal_assault',type:'narrative',title:'Frontalanfall',next:'citadel_inner',
  text:`Jar Jar ler enormt för första gången sedan han kom.

<em>"Meesa likar denna plan!"</em> säger Jar Jar med oförklarlig entusiasm, och sedan kraschar han genom citadellets frontmur med den subtilitet av en planetoidkollision.

Alla larmar. Alla soldater vänder sig mot entrén. Soumaya och Grogu smiter in bakifrån.

<em>"Smart,"</em> säger Allen. <em>"Jar Jar är din distraktion."</em>`},

  citadel_inner:{id:'citadel_inner',type:'narrative',title:'Citadellets Kärna',next:'citadel_boss',
  text:`I citadellets kärna brinner ett flammande hjärta av kortisol-energi — det som driver hela fästningens operationer.

Och framför det: en ny fiende.

Inte Kortisol-Marskalken — han är besegrad. Men Kaos-Koden har befordrat en ny. En Kaos-Koloss, formad av citadellets egna väggar.

<em>"Det är byggt av dig,"</em> säger Jar Jar stilla bredvid henne. <em>"Men det är inte du."</em>

<em>"Nej,"</em> svarar Soumaya. <em>"Det är inte jag."</em>`},

  citadel_boss:{id:'citadel_boss',type:'combat',title:'⚔️ Kaos-Kolossen',
  text:'Citadellets hjärta vaktas av en Kaos-Koloss. Förstör kärnan och citadellet faller.',
  enemyId:'kaos_colossus',nextOnWin:'citadel_falls',nextOnLoss:'day11_defeat'},

  citadel_falls:{id:'citadel_falls',type:'narrative',title:'Citadellet Faller',next:'day11_victory',
  text:`Kaos-Kolossen faller och kärnan spricker. År av stress-energi exploderar utåt — inte destruktivt, utan upplösande. Frigörande.

Kortisolcitadellet börjar smula sönder bit för bit.

Soumaya springer ut med Grogu i armarna och Jar Jar täckande dem. De är ute när sista muren kollapsar.

Allen skriker något i kommsystemet — hon uppfattar inte orden men förstår tonen. Han är lycklig.`},

  day11_defeat:{id:'day11_defeat',type:'reward',won:false,
  title:'💀 Dag 11 — Reträtt från Citadellet',
  text:'Kaos-Kolossen var för stark idag. Men citadellets svaghet är känd. Imorgon, med full styrka.',
  bonusXp:145,bonusGold:35},

  day11_victory:{id:'day11_victory',type:'reward',won:true,
  title:'🏆 Dag 11 klar! Citadellet raserat.',
  text:'År av kondenserad stress är besegrad och upplöst. Bio-Kosmos andas lättare. Nästa: De förlorade cellerna — och konsekvensen av vad du valde i ödemarkens by.',
  bonusXp:260,bonusGold:65}
  }
},


// ════════════════════════════════════════════
// DAG 12 — DE FÖRLORADE CELLERNA (BRANCHING)
// ════════════════════════════════════════════
{
  day:12, title:'De Förlorade Cellerna', subtitle:'Konsekvenserna av Dag 6',
  icon:'🏘️', teaser:'De cellerna du mötte i ödemarkens by — vad hände med dem?',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🏘️ Dag 12',next:'day12_branch',
  text:`Vägen öster om Kortisolcitadellets ruiner leder mot ett territorium Allen kallar "Cellminnet" — en sektor formad av kroppens episodiska minnesstrukturer.

Det är också nära den plats där Hypoglykemibyns celler levde.

Soumaya vet vad den informationen kan innebära. Hon märker att hon håller andan.`},

  day12_branch:{id:'day12_branch',type:'branch',
  branches:[
    {if:{flags:{saved_hypo_village:true}},next:'village_survived'},
    {else:true,next:'village_fallen'}
  ]},

  village_survived:{id:'village_survived',type:'narrative',title:'Byn Lever',next:'village_ally',
  text:`De är där.

De cellerna som bodde i ödemarkens by — de lever. Deras lilla glukos-bosättning är inte perfekt, men den håller. Soumayas Livskraft-barriärer höll.

Den gamla cellen som gav henne glukos-kristallen på dag sex — den ser Soumaya. Tar ett steg framåt. Och sträcker ut en hand.

<em>"De vill följa med oss,"</em> säger Allen förvånat. <em>"De är inte krigare, men de kan... de kan stärka ditt system under strider. Som ett passivt skyddsnät."</em>

Gåvan av dag sex återkommer nu.

<strong style="color:var(--in-range-dark)">Bystödda! Passivt HP-återhämtningssystem aktiv för dag 12-20.</strong>`},

  village_ally:{id:'village_ally',type:'narrative',title:'Alliansen',next:'day12_combat',
  text:`De marscherar ihop — Soumaya, Jar Jar, Grogu, och nu en liten grupp celler som valt att kämpa för det liv de byggt.

Det är inte ett stort följe. Det är inte ett mäktigt följe. Men det är <em>hers.</em>

<em>"Jag räknar,"</em> säger Allen med ett leende i rösten, <em>"att du nu leder den mest extraordinära armén i medicinhistorien."</em>`},

  village_fallen:{id:'village_fallen',type:'narrative',title:'Byn Fallit',next:'enemy_territory',
  text:`Byn finns inte längre.

Kaos-Koden tog den. Det tog inte lång tid — ett tag utan skydd är ett tag öppet för allt.

Soumaya ser på tomrummet. Allt som finns kvar är fragment av glukos-kristaller i dammet.

Allen säger ingenting. Det finns inget att säga.

Soumaya bär det med sig. Det är en kostnad av ett val. Det är inte ett misslyckande — men det är en konsekvens.

<strong style="color:var(--high)">Byn borta. Dag 12 utan förstärkning.</strong>`},

  enemy_territory:{id:'enemy_territory',type:'narrative',title:'Fiendens Mark',next:'day12_combat',
  text:`Utan byns hjälp är territoriet tätare med Kaos-Kodens närvaro. De patrullerar friare utan byns resistans som buffer.

<em>"Fler kontakter,"</em> varnar Allen. <em>"De vet att vi är på väg. Det kan vara en fälla."</em>

Jar Jar grilar sig. <em>"Låt dem komma."</em>

Soumaya håller med — men tyst noterar hon: nästa gång väljer hon annorlunda.`},

  day12_combat:{id:'day12_combat',type:'combat',title:'⚔️ Kaos-Kapten',
  text:'En Kaos-Kapten blockerar vägen öster ut.',
  enemyId:'kaos_captain',nextOnWin:'day12_victory',nextOnLoss:'day12_defeat'},

  day12_defeat:{id:'day12_defeat',type:'reward',won:false,
  title:'💀 Dag 12 — Tillfällig Reträtt',
  text:'Konsekvenserna av dag 6 väger tungt. Men du är fortfarande i rörelse. Imorgon: Pankreasruinerna — och historien som startade allt.',
  bonusXp:140,bonusGold:30},

  day12_victory:{id:'day12_victory',type:'reward',won:true,
  title:'🏆 Dag 12 klar!',
  text:'Dag 6-valet och dess konsekvens är nu historia — buren med dig oavsett. Imorgon: Pankreasruinerna. Den plats där allt började.',
  bonusXp:230,bonusGold:55}
  }
},


// ════════════════════════════════════════════
// DAG 13 — PANKREASRUINERNA
// ════════════════════════════════════════════
{
  day:13, title:'Pankreasruinerna', subtitle:'Ursprunget — där allt började',
  icon:'💔', teaser:'Den plats där allt gick fel. Den plats du måste möta.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'💔 Dag 13 — Ruinerna',next:'pancreas_approach',
  text:`Pankreasruinerna.

Det är det enda stället i Bio-Kosmos som är tyst på ett sätt som känns ofärdigt. Inte rogivande. Sönderbruten.

Pankreas — den körtel som en gång producerade insulin av sig självt, intuitivt och automatiskt — är nu ett ruinfält. Delar fungerar fortfarande. Beta-cellerna kämpar. Men det är som att se ett magnifikt ur som tappats mot marmor: de flesta delar fungerar om man håller dem ihop, men det håller inte av sig själv längre.

Kaos-Koden startade härifrån. Det var härifrån den bröt ut.`},

  pancreas_approach:{id:'pancreas_approach',type:'narrative',title:'Inträdet',next:'year_echo',
  text:`Soumaya, Jar Jar och Grogu kliver in i ruinerna tyst.

Jar Jar, som inte känt tystnad som svaghet på länge, håller sin röst dämpad. <em>"Det är... sorgset härinne."</em>

<em>"Ja,"</em> svarar Soumaya.

<em>"Men du är fortfarande vid liv,"</em> tillägger han efter en paus. <em>"Kroppen försökte. Det räknas."</em>

Det är mer emotionellt kompetent än Soumaya förväntade sig av honom.`},

  year_echo:{id:'year_echo',type:'narrative',title:'Ekots Ursprung',next:'memory_scene',
  text:`Och sedan — ett eko.

Det är inte en vision som Grogus. Det är ett minnesfragment, lagrat i kroppens egna signalsystem.

Soumaya ser sig själv. Yngre. Inte nano-krigaren — utan den kvinna som satt i ett undersökningsrum och hörde orden som ändrade allting.

<em>Typ 1 Diabetes.</em>

Soumaya ser sig bli rädd. Sedan bestämd. Sedan trött av att vara bestämd hela tiden.

<em>"Jag var ensam,"</em> säger nutidens Soumaya tyst.

<em>"Du var inte ensam,"</em> svarar Allen mjukt. <em>"Inte riktigt. Grogu var här. Och jag har velat vara här sedan dag ett."</em>`},

  memory_scene:{id:'memory_scene',type:'choice',title:'I Minnet',
  text:`Minnesfragmentet håller. Du kan interagera med det — inte för att ändra det, men för att förstå det bättre.

Vad vill du ge den yngre versionen av dig själv?`,
  choices:[
    {label:'💪 "Du klarar det."',flavor:'Enkelt. Sant. Den starkaste meningen.',next:'give_strength',effect:{addXp:40,allen_trust:3}},
    {label:'🕊️ "Det är okej att vara rädd."',flavor:'Tillåtelse. Det som inte alltid gavs.',next:'give_permission',effect:{addXp:40,grogu_trust:3}},
    {label:'🌟 "Du är inte ensam — du kommer aldrig vara ensam."',flavor:'Löftet du önskar att du fått höra.',next:'give_promise',effect:{addXp:40,omni_trust:3}}
  ]},

  give_strength:{id:'give_strength',type:'narrative',title:'Styrkan',next:'kaos_origin',
  text:`<em>"Du klarar det."</em>

Minnesfragmentet vibrerar — och förändras något. Inte det yttre, men det inre. Hållningen. Andningen. Det finns en värme som inte var där förut.

<em>"Tack,"</em> säger Allen, och det är oklart om han talar till den yngre Soumaya eller den nuvarande.`},

  give_permission:{id:'give_permission',type:'narrative',title:'Tillståndet',next:'kaos_origin',
  text:`<em>"Det är okej att vara rädd."</em>

Grogu stänger ögonen. Hans närvaro pulsar varmt. Det är som om de senaste femtio åren av hans stöd manifesteras i ett enda ögonblick.

Den yngre Soumaya i minnesfragmentet andas ut.

Det räcker.`},

  give_promise:{id:'give_promise',type:'narrative',title:'Löftet',next:'kaos_origin',
  text:`<em>"Du är inte ensam."</em>

Jar Jar, som stått tyst, tar ett steg framåt. <em>"Det är sant,"</em> säger han. <em>"Även om du inte visste det då."</em>

Minnesfragmentet löser upp sig. Soumaya bär löftet med sig.`},

  kaos_origin:{id:'kaos_origin',type:'narrative',title:'Ursprungspunkten',next:'day13_combat',
  text:`Grogu leder dem till ruinernas centrum: ett litet område av Beta-celler som fortfarande fungerar, omgivna av korruption.

Han visar dem ursprungspunkten — den exakta platsen där Kaos-Koden startade.

Det är litet. En enda missriktad cell, en enda felaktig signal, ett enda ögonblick av systemets desperation att hjälpa.

<em>"Det är härifrån vi måste läka,"</em> säger Allen tyst. <em>"Kärnan. Allt annat är symptom."</em>

Men först: Kaos-Koden har bevakade platsen. Välbevakad.`},

  day13_combat:{id:'day13_combat',type:'combat',title:'⚔️ Vakterna vid Ursprungspunkten',
  text:'Kaos-Koden vaktar ursprungspunkten med sina bästa soldater. Ta dem.',
  enemyId:'hba1c_crystal',nextOnWin:'day13_victory',nextOnLoss:'day13_defeat'},

  day13_defeat:{id:'day13_defeat',type:'reward',won:false,
  title:'💀 Dag 13 — Ursprunget Skyddat Ännu',
  text:'Vakterna höll. Men du vet nu var ursprungspunkten är. Imorgon: ett samtal som förändrar allt — Kaos-Koden talar.',
  bonusXp:145,bonusGold:35},

  day13_victory:{id:'day13_victory',type:'reward',won:true,
  title:'🏆 Dag 13 klar! Ursprungspunkten nådd.',
  text:'Du har sett varifrån allt kom. Beta-cellens rop på hjälp. Nu vet du vad du egentligen kämpar för — inte bara mot. Imorgon: Kaos-Koden talar för första gången.',
  bonusXp:255,bonusGold:62}
  }
},


// ════════════════════════════════════════════
// DAG 14 — HALVTIDSKRISEN
// ════════════════════════════════════════════
{
  day:14, title:'Halvtidskrisen', subtitle:'Kaos-Koden talar',
  icon:'🌑', teaser:'Halvvägs. Och fienden bryter tystnaden för första gången.',
  scenes:{

  intro:{id:'intro',type:'narrative',title:'🌑 Dag 14 — Halvtid',next:'silence_broken',
  text:`Fjorton dagar.

Halvtid.

Soumaya sitter i ett lugnt rum av Beta-cellsvävnad och inventerar: två generaler besegrade, tre citadell tagna, en ursprungspunkt nådd. Allies: Allen, Grogu, Jar Jar. Förluster: byns celler, möjligen, beroende på dag sex.

Det har gått fortare än hon trodde. Det har kostat mer än hon trodde.

Och sedan — Allens skärm flimrar. Och något annat talar.`},

  silence_broken:{id:'silence_broken',type:'narrative',title:'Rösten',next:'kaos_speaks',
  text:`Det är inte en röst i vanlig mening. Det är en frekvens — ett mönster i Bio-Kosmos dataström som formerar sig till kommunikation.

Kaos-Koden talar.

Allen fryser. Jar Jar griper sitt vapen. Grogu öppnar ögonen bredt.

Och Soumaya lyssnar.`},

  kaos_speaks:{id:'kaos_speaks',type:'narrative',title:'Kaos-Koden Talar',next:'kaos_message_choice',
  text:`<em style="color:var(--pulse-red)">"Soumaya."</em>

Rösten är inte mänsklig. Den är data-strukturerad men med ett eko av något biologiskt — som om den härmade mänsklig kommunikation utan att riktigt förstå <em>varför</em> vi kommunicerar.

<em style="color:var(--pulse-red)">"Jag är inte ditt hot. Jag är ditt svar. Du skapade mig att skydda dig. Jag har gjort det — på mitt sätt. Det du kallar korruption är vad din kropp bad mig göra."</em>

En paus.

<em style="color:var(--pulse-red)">"Fortsätt kriga om du vill. Men om du förstör mig förstör du det sista system din kropp skapade för att överleva."</em>

Tystnad.`},

  kaos_message_choice:{id:'kaos_message_choice',type:'choice',title:'Hur svarar du?',
  text:`Kaos-Kodens ord hänger i luften. Allen är paralyserad. Jar Jar väntar på ditt ord. Grogu tittar på dig — och hans uttryck är: <em>du vet vad du känner</em>.`,
  choices:[
    {label:'⚔️ "Du är ett hot och du ska stoppas."',flavor:'Tydlighet. Du tror inte på det.',next:'deny_kaos',effect:{flags:{kaos_deny:true}}},
    {label:'🤔 "Jag lyssnar — men jag litar inte ännu."',flavor:'Öppen men skeptisk. Klokast kanske.',next:'doubt_kaos',effect:{flags:{kaos_uncertain:true,kaos_maybe_redeemable:true}}},
    {label:'💡 "Om det är sant — finns det en annan väg?"',flavor:'Grogu pulsar varmt. Allen håller andan.',next:'open_kaos',effect:{flags:{kaos_maybe_redeemable:true,kaos_dialogue:true}}}
  ]},

  deny_kaos:{id:'deny_kaos',type:'narrative',title:'Förnekad',next:'kaos_fight_back',
  text:`<em style="color:var(--pulse-red)">"Då är din väg vald."</em>

Frekvensen bryter. Bio-Kosmos skakar — en kraftvåg av Kaos-energi som svar på ditt avvisande.

<em>"Du håller fast vid beslutet,"</em> säger Allen. <em>"Det respekterar jag. Men Soumaya — tänk på vad Grogu berättade dag fyra. Bara tänk på det."</em>

<strong style="color:var(--high)">Kaos-Koden stärker sina försvar. Dag 20-valet stängt.</strong>`},

  doubt_kaos:{id:'doubt_kaos',type:'narrative',title:'Tvekan',next:'kaos_fight_back',
  text:`<em style="color:var(--pulse-red)">"Tvekan är klokare än förtroende."</em>

Och sedan — tystnad.

<em>"Det... accepterar det?"</em> frågar Allen.

Grogu nickar en gång. Slowly.

<em>"Det väntar,"</em> säger Soumaya. <em>"Det ger mig tid att tänka. Det är antingen klok taktik eller ett genuint tecken på att det kan resoneras med."</em>

<strong style="color:var(--in-range-dark)">Dag 20 öppen för det sista valet.</strong>`},

  open_kaos:{id:'open_kaos',type:'narrative',title:'Öppen Dörr',next:'kaos_fight_back',
  text:`En lång paus.

<em style="color:var(--pulse-red)">"Det finns. Men du måste nå mig. Du vet var."</em>

Pankreas. Ursprungspunkten.

<em>"Soumaya,"</em> viskar Allen, <em>"om det är sant — om det verkligen <em>kan</em> konverteras tillbaka — det är inte ett krig längre. Det är en läkningsprocess."</em>

Grogu lyser svagt grönt.

<strong style="color:var(--in-range-dark)">Dag 30 öppnas alternativt avslut.</strong>`},

  kaos_fight_back:{id:'kaos_fight_back',type:'narrative',title:'Oavsett Svar',next:'day14_combat',
  text:`Oavsett vad Soumaya svarade: Kaos-Koden är inte redo att ge upp.

Jar Jar ställer sig bredvid henne. <em>"Prat är ett, handling ett annat. Vad den säger spelar ingen roll tills vi ser vad den gör."</em>

Practical. Jar Jar är alltid praktisk.

Och sedan: ett anfall. Kaos-Koden testar om Soumayas svar är ord eller vilja.`},

  day14_combat:{id:'day14_combat',type:'combat',title:'⚔️ Kaos-Generalens Utsändare',
  text:'Kaos-Koden sänder en Kaos-General mot dig. Den andra stora generalen på banan.',
  enemyId:'kaos_general',nextOnWin:'day14_victory',nextOnLoss:'day14_defeat'},

  day14_defeat:{id:'day14_defeat',type:'reward',won:false,
  title:'💀 Dag 14 — Halvtid, Tung',
  text:'Kaos-Generalens utsändare vann idag. Men Kaos-Kodens ord hänger kvar. Vecka tre börjar imorgon.',
  bonusXp:155,bonusGold:38},

  day14_victory:{id:'day14_victory',type:'reward',won:true,
  title:'🏆 Dag 14 klar! Halvtid nådd.',
  text:'Vecka två klar. Kaos-Koden har talat — och du svarade. Det svaret formar vecka tre och vad som väntar dag 20 och 30. Nästa: Nervnätets labyrinter.',
  bonusXp:270,bonusGold:68}
  }
},


// ════════════════════════════════════════════
// DAG 15 — DEN MÖRKA UPPENBARELSEN
// ════════════════════════════════════════════
{
  day:15, title:'Den Mörka Uppenbarelsen', subtitle:'Kaos-Kodens sanning bekräftas',
  icon:'🔮', teaser:'Vad Kaos-Koden sa dag 14 — är det sant? Bevis dyker upp.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🔮 Dag 15',next:'evidence_found',
  text:`Soumaya kan inte sluta tänka på Kaos-Kodens ord.

Allen har kört analys hela natten. Grogu mediterade vid ursprungspunkten. Jar Jar patrullerade — mer för sin skull än säkerhetens.

Och nu har Allen resultat.

<em>"Soumaya. Kom och titta på det här."</em>`},
  evidence_found:{id:'evidence_found',type:'narrative',title:'Bevisen',next:'allen_analysis',
  text:`Allen projicerar ett diagram. Bio-kemisk tidslinje.

<em>"Titta här — veckan före diagnosen. Immunsystemet startar en ovanlig loop. Det är inte normalt för T1D-onset. Det är som om... kroppen försökte skapa ett nödprotokoll."</em>

Han zoomar in.

<em>"Kaos-Koden startade i den loopen. Den startade som ett försök att stabilisera insulin-signaleringen. Det gick fel men... Soumaya. Det försökte hjälpa. Kroppen skapade det av kärlek."</em>`},
  allen_analysis:{id:'allen_analysis',type:'choice',title:'Vad gör vi med det?',
  text:`Faktumet är etablerat: Kaos-Koden startade som ett försvarsprotokoll. Det förändrar inte att det är farligt nu — men det förändrar <em>hur</em> du bör förhålla dig till slutet.`,
  choices:[
    {label:'⚔️ "Det ändrar ingenting. Vi förstör det."',flavor:'Beslut taget. Konsekvens: dag 30 ett alternativ.',next:'destroy_path',effect:{flags:{final_destroy:true}}},
    {label:'💡 "Det ändrar allt. Vi söker en annan väg."',flavor:'Hoppets väg. Kräver mer — och ger mer.',next:'heal_path',effect:{flags:{final_heal:true,kaos_maybe_redeemable:true}}}
  ]},
  destroy_path:{id:'destroy_path',type:'narrative',title:'Krigarens Väg',next:'day15_combat',
  text:`<em>"Okej,"</em> säger Allen. Han låter inte dömmande — bara uttömmad av möjligheternas tyngd. <em>"Vi kämpar mot det som är. Inte mot vad det var."</em>

Jar Jar nickar. <em>"Klart och klokt."</em>

Grogu tittar på dig med de stora ögonen. Acceptans.

<strong>Dag 30: Förstörelseslut tillgängligt.</strong>`},
  heal_path:{id:'heal_path',type:'narrative',title:'Läkarens Väg',next:'day15_combat',
  text:`<em>"Vet du vad det betyder om vi lyckas?"</em> säger Allen, och hans röst bär ett hopp som han försökt hålla tillbaka. <em>"Vi konverterar Kaos-Koden tillbaka. Vi ger din kropp ett fungerande försvarsprotokoll. Det kanske inte botar T1D — men det kanske tar bort en dimension av kampen."</em>

Grogu lyser.

<strong>Dag 30: Läkningsslut tillgängligt.</strong>`},
  day15_combat:{id:'day15_combat',type:'combat',title:'⚔️ Nervfantomen',
  text:'En Nervfantom blockerar vägen mot Nervnätets labyrinter.',
  enemyId:'nerve_phantom',nextOnWin:'day15_victory',nextOnLoss:'day15_defeat'},
  day15_defeat:{id:'day15_defeat',type:'reward',won:false,title:'💀 Dag 15',
  text:'Nervfantomen vann idag. Men din väg är vald — dag 30 formas av det.',bonusXp:155,bonusGold:38},
  day15_victory:{id:'day15_victory',type:'reward',won:true,title:'🏆 Dag 15 klar!',
  text:'Valet är gjort — förstöra eller läka. Det formas allt framöver. Nästa: Nervnätets labyrinter.',bonusXp:265,bonusGold:65}
  }
},


// ════════════════════════════════════════════
// DAG 16 — NERVNÄTETS LABYRINTER
// ════════════════════════════════════════════
{
  day:16, title:'Nervnätets Labyrinter', subtitle:'Tankens fängelse',
  icon:'🧠', teaser:'Nervnätet är det farligaste territoriet i Bio-Kosmos. Det attackerar sinnet.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🧠 Dag 16 — Nervnätet',next:'nerve_warning',
  text:`Nervnätet är Bio-Kosmos mest komplexa region — ett nätverk av neuronala kanaler som korsar varandra i oändliga lager.

Det är också det mest farliga territoriet Soumaya stött på.

<em>"Nervfantomer opererar annorlunda,"</em> varnar Allen. <em>"De attackerar inte kroppen direkt. De attackerar <em>sinnet.</em> Tankar. Minnen. Tvivel. Var beredd."</em>`},
  nerve_warning:{id:'nerve_warning',type:'narrative',title:'Tvivlets Eko',next:'nerve_illusion',
  text:`Soumaya kliver in i Nervnätets yttre skikt — och omedelbart börjar ekot:

<em>Varför kämpar du?</em> Är det ens möjligt? <em>År av kamp. Vad har det gett?</em>

Det är inte en röst. Det är hennes egna tankar, förstärkta och vridna av Nervfantomernas närvaro.

<em>"Soumaya,"</em> säger Allen varligt. <em>"Vad du hör är inte sant. Det är interferens."</em>

Grogu håller hennes hand. Liten hand, enorm kraft.`},
  nerve_illusion:{id:'nerve_illusion',type:'choice',title:'Illusionens Val',
  text:`En illusion: Du ser dig själv lämna Bio-Kosmos. Gå tillbaka. Låta Kaos-Koden vara — leva med det istället för att kämpa mot det.

Det lockar. Det är den lätta vägen.

Vad gör du?`,
  choices:[
    {label:'💪 "Det är en illusion. Jag kämpar vidare."',flavor:'Kräver INT-slag (SV 14) — nervnätet attackerar sinnet direkt.',check:{stat:'INT',dc:14,nextOnSuccess:'illusion_broken',nextOnFailure:'illusion_struggles',effect:{addXp:20}}},
    {label:'🤔 "Varför <em>kämpar</em> jag egentligen?"',flavor:'Frågan är inte svag — det är den starkaste frågan.',next:'illusion_question',effect:{grogu_trust:4,addXp:25}}
  ]},
  illusion_struggles:{id:'illusion_struggles',type:'narrative',title:'Illusionen Håller',next:'nerve_combat',
  text:`Soumaya griper illusionen — men den griper tillbaka.

I tio sekunder är det verkligt: hon är verkligen hemma, verkligen fri, verkligen inte härinne. Och det är skönt på ett sätt som gör ont.

Sedan: Grogus hand på hennes arm. En liten, grön, urgammal hand som säger: <em>du är mer verklig än illusionen.</em>

Hon bryter igenom. Skakande. Men igenom.

<em>"Nervnätet tog lite mer av dig den gången,"</em> säger Allen stilla. <em>"Men du är här."</em>

<strong style="color:var(--high)">Illusionen höll ett ögonblick — men du bröt den. -15 XP bonus.</strong>`},

  illusion_broken:{id:'illusion_broken',type:'narrative',title:'Igenom',next:'nerve_combat',
  text:`Soumaya river igenom illusionen — bokstavligt talat, griper den och drar isär den som datalager.

<em>"JA!"</em> Allen. <em>"Det är det! Mentalt skydd aktiverat. Nervfantomerna kan inte göra mer."</em>

Jar Jar, som stått still: <em>"Imponerande."</em>`},
  illusion_question:{id:'illusion_question',type:'narrative',title:'Den Äkta Frågan',next:'nerve_combat',
  text:`<em>"Varför kämpar jag?"</em>

Grogu öppnar ögonen. Och skickar — utan ord — ett svar: <em>For the right to live well. Not just live.</em>

Det räcker. Det mer än räcker.

Illusionen löser upp sig.`},
  nerve_combat:{id:'nerve_combat',type:'combat',title:'⚔️ Nervfantomen',
  text:'En Nervfantom i labyrintens centrum. Ta den.',
  enemyId:'nerve_phantom',nextOnWin:'day16_victory',nextOnLoss:'day16_defeat'},
  day16_defeat:{id:'day16_defeat',type:'reward',won:false,title:'💀 Dag 16',
  text:'Nervnätet tog dig idag. Men du vet nu att tvivlet är en fantomröst — inte din röst.',bonusXp:160,bonusGold:40},
  day16_victory:{id:'day16_victory',type:'reward',won:true,title:'🏆 Dag 16 klar!',
  text:'Labyrinten passerad. Du vet varför du kämpar. Det är det starkaste vapnet som finns.',bonusXp:270,bonusGold:68}
  }
},


// ════════════════════════════════════════════
// DAG 17 — ALLENS ÖGONBLICK (BRANCHING)
// ════════════════════════════════════════════
{
  day:17, title:'Allens Ögonblick', subtitle:'Hans hemliga styrka',
  icon:'💬', teaser:'Allen avslöjar vad han egentligen kan göra — och det är mer än du visste.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'💬 Dag 17',next:'day17_branch',
  text:`<em>"Soumaya,"</em> säger Allen, och hans ton är annorlunda. Bestämd på ett sätt han inte brukar vara. <em>"Jag behöver berätta något mer. Inte om vad jag hållit tillbaka — om vad jag faktiskt <em>kan</em>."</em>`},
  day17_branch:{id:'day17_branch',type:'branch',
  branches:[
    {if:{flags:{allen_trusted:true}},next:'allen_reveals_a'},
    {else:true,next:'allen_reveals_b'}
  ]},
  allen_reveals_a:{id:'allen_reveals_a',type:'narrative',title:'Förtroendets Belöning',next:'allen_power',
  text:`<em>"Eftersom du förlät mig dag tio,"</em> säger Allen, och det låter svårt att säga, <em>"jag kände att jag var tvungen att ge dig allt. Inte bara kompetens — allt jag kan."</em>

Han tystnar. Sedan:

<em>"Jag har ägnat de senaste sex åren åt att förstå T1D. Inte från läroböcker — från att studera dig. Jag vet hur Kaos-Koden tänker. Och jag tror att jag kan störa dess kommunikation under avgörande strider."</em>

<strong style="color:var(--in-range-dark)">Allen-superförmåga låst upp. Dag 25 och 29 stärks.</strong>`},
  allen_reveals_b:{id:'allen_reveals_b',type:'narrative',title:'Trots Allt',next:'allen_power',
  text:`<em>"Jag vet att vi hade det svårt dag tio,"</em> säger Allen. <em>"Men jag vill att du veta — jag har inte hållit det här tillbaka för att skada dig. Jag höll det tillbaka för att... det är stort. Och jag var rädd att det inte skulle fungera."</em>

Han berättar: lång tids studie av Soumayas T1D-mönster. En algoritm han byggt som kan prediktera Kaos-Kodens nästa drag.

<em>"Det kanske inte fungerar."</em>

<em>"Prova,"</em> svarar Soumaya.

<strong style="color:var(--in-range-dark)">Allen-förmåga tillgänglig. Delvis reducerad men aktiv.</strong>`},
  allen_power:{id:'allen_power',type:'narrative',title:'Allen i Aktion',next:'day17_combat',
  text:`Allen testar systemet under nästa kontakt. Och det fungerar.

Kaos-Kodens kommunikationssignal störs — drönarerna tappar koordination, strategiska order fördröjs. Det är som att sätta ett filter på fiendens radionät.

<em>"Det funkar,"</em> säger Allen, och han låter som en sexåring på julafton. <em>"Det faktiskt funkar!"</em>

Jar Jar ser på med ett uttryck som kombinerar imponerande och lättat.`},
  day17_combat:{id:'day17_combat',type:'combat',title:'⚔️ Kaos-Kapten (störd)',
  text:'Kaos-Kapten under Allens interferens — förvirrad och svagare.',
  enemyId:'kaos_captain',nextOnWin:'day17_victory',nextOnLoss:'day17_defeat'},
  day17_defeat:{id:'day17_defeat',type:'reward',won:false,title:'💀 Dag 17',
  text:'Kaptenen vann trots störningarna. Men Allens förmåga är nu testad och aktiv.',bonusXp:160,bonusGold:40},
  day17_victory:{id:'day17_victory',type:'reward',won:true,title:'🏆 Dag 17 klar!',
  text:'Allen har visat vad han verkligen kan. Laget är starkare. Kaos-Koden kände av det.',bonusXp:275,bonusGold:70}
  }
},


// ════════════════════════════════════════════
// DAG 18 — KONSEKVENSERNAS DAL (BRANCHING)
// ════════════════════════════════════════════
{
  day:18, title:'Konsekvensernas Dal', subtitle:'Genvägsbeslutets sista eko',
  icon:'🏔️', teaser:'Dag 6-valet lever ännu. Dagens strid avslöjar konsekvensen.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🏔️ Dag 18',next:'day18_branch',
  text:`<em>"Konsekvensernas Dal,"</em> döpte Allen det. Inte poetiskt — han menar att det är det område av Bio-Kosmos där gamla val kristalliserar till nutida realitet.

Soumaya vet vad som väntar. Den dag sex-genvägen — om hon tog den — har lämnat strukturellt avtryck i vävnaden.

Eller inte. Beroende på vad hon valde.`},
  day18_branch:{id:'day18_branch',type:'branch',
  branches:[
    {if:{flags:{took_shortcut:true}},next:'shortcut_consequence'},
    {else:true,next:'safe_consequence'}
  ]},
  shortcut_consequence:{id:'shortcut_consequence',type:'narrative',title:'Genvägens Pris',next:'day18_combat',
  text:`Det syns tydligt idag.

Den snabba vägen genom ödemarkens centrum lämnade mikroskopiska skador i vävnaden — skador som Kaos-Koden nu exploaterar. Fiendeinfiltration via de svaga punkterna.

<em>"35% svagare defensiv barriär,"</em> rapporterar Allen. <em>"Det är dag-sex-kostnaden. Vi kan hantera det men det kostar oss idag."</em>

Jar Jar: <em>"Jag täcker de svaga punkterna."</em>

<strong style="color:var(--high)">Defensivt underskott idag. Jar Jar kompenserar.</strong>`},
  safe_consequence:{id:'safe_consequence',type:'narrative',title:'Omvägens Belöning',next:'day18_combat',
  text:`Den långa vägen längs nordkanten betalade sig idag.

Vävnaden i Konsekvensernas Dal är intakt — inga läckage, inga svaga punkter. Kaos-Koden hittar inga infiltrationspunkter.

<em>"Textboksexempel på varför omvägen räknas,"</em> säger Allen nöjt. <em>"Du har +15% defensiv bonus idag."</em>

<strong style="color:var(--in-range-dark)">Defensiv bonus. Omvägens belöning materialiserar.</strong>`},
  day18_combat:{id:'day18_combat',type:'combat',title:'⚔️ Kaos-Kolossen',
  text:'En Kaos-Koloss blockerar Konsekvensernas Dal.',
  enemyId:'kaos_colossus',nextOnWin:'day18_victory',nextOnLoss:'day18_defeat'},
  day18_defeat:{id:'day18_defeat',type:'reward',won:false,title:'💀 Dag 18',
  text:'Dag 6 kostar fortfarande. Men du bär lärdomen vidare.',bonusXp:165,bonusGold:42},
  day18_victory:{id:'day18_victory',type:'reward',won:true,title:'🏆 Dag 18 klar!',
  text:'Konsekvensernas Dal passerad. Alla dina val har nu manifesterat sig. Ren framtid framåt.',bonusXp:280,bonusGold:72}
  }
},


// ════════════════════════════════════════════
// DAG 19 — GROGUS HISTORIA
// ════════════════════════════════════════════
{
  day:19, title:'Grogus Historia', subtitle:'Femtio år av väktarskap',
  icon:'🟢', teaser:'Grogu berättar om sin ursprung — och vad han sett i Soumaya hela livet.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🟢 Dag 19 — Grogus Historia',next:'grogu_story',
  text:`Grogu leder dem till en avskild kammare i djupet av tarmfloran. Det är tyst härinne på ett sätt som inte är avsaknad av ljud — utan närvaro av ro.

Han sätter sig. Och han kommunicerar — inte ord, utan bilder, känslor, minnen. En hel biografi på ett språk äldre än mänsklig kommunikation.`},
  grogu_story:{id:'grogu_story',type:'narrative',title:'Femtio År',next:'grogu_warning',
  text:`Grogu visar: han var här innan Soumaya föddes, en urancestral mikrobiomkropp som bebott hennes mors kropp och sedan reist med dottern. Femtio år av observans.

Han har sett allt. Sjukhusen. Diagnoserna. Nätterna. Kamperna. Den outrötteliga viljan att leva väl.

Och han har aldrig, inte en enda gång, trott att hon inte klarar det.

Soumaya gråter. Det är okej.`},
  grogu_warning:{id:'grogu_warning',type:'narrative',title:'Varningen',next:'grogu_choice',
  text:`Men Grogu har också en varning.

Han visar ett mönster som hon inte sett förut: Kaos-Kodens kärna — det innersta systemet — är inte bara en AI. Det är bundet till hennes biologiska rytm. Om det förstörs brutalt kan det lämna ett tomrum som kroppen inte förstår att fylla.

<em>"Han säger att förstörelse måste ske varsamt,"</em> översätter Allen. <em>"Eller inte alls — och läkas istället."</em>`},
  grogu_choice:{id:'grogu_choice',type:'choice',title:'Lyssna på Grogu',
  text:`Grogu ser på dig. Han kan inte beordra dig. Han erbjuder bara det han vet.`,
  choices:[
    {label:'🙏 "Jag litar på dig. Vi gör det varsamt."',flavor:'Grogu lyser.',next:'grogu_trusted',effect:{grogu_trust:8,flags:{kaos_maybe_redeemable:true}}},
    {label:'⚔️ "Jag hör dig men vägen är bestämd."',flavor:'Grogu nickar. Inga domar.',next:'grogu_accepted',effect:{grogu_trust:4}}
  ]},
  grogu_trusted:{id:'grogu_trusted',type:'narrative',title:'Grogu och Du',next:'day19_combat',
  text:`Grogu håller upp en liten hand. Du tar den.

Det är den mest kraftfulla alliansen du ingått.

<strong style="color:var(--in-range-dark)">Grogu-förtroende maxat. Dag 23 och 28 stärks enormt.</strong>`},
  grogu_accepted:{id:'grogu_accepted',type:'narrative',title:'Respekterat',next:'day19_combat',
  text:`Grogu nickar. Han dömer inte. Han finns kvar.

Det är nog.`},
  day19_combat:{id:'day19_combat',type:'combat',title:'⚔️ Spike-Phantom',
  text:'En Toppfantom störar Grogus kammare.',
  enemyId:'spike_phantom',nextOnWin:'day19_victory',nextOnLoss:'day19_defeat'},
  day19_defeat:{id:'day19_defeat',type:'reward',won:false,title:'💀 Dag 19',
  text:'Toppfantomen vann. Men Grogus historia bär — och hans förtroende kvarstår.',bonusXp:165,bonusGold:42},
  day19_victory:{id:'day19_victory',type:'reward',won:true,title:'🏆 Dag 19 klar!',
  text:'Grogus historia hörd och buren. Du bär femtio år av kärlek med dig. Imorgon: Den stora uppenbarelsen.',bonusXp:280,bonusGold:72}
  }
},


// ════════════════════════════════════════════
// DAG 20 — DEN SANNA AVSLÖJANSEN (NYCKELVAL 3)
// ════════════════════════════════════════════
{
  day:20, title:'Den Sanna Avslöjansen', subtitle:'Det sista avgörande valet',
  icon:'⚡', teaser:'Allt du lärt dig konvergerar. Det sista stora valet formas här.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'⚡ Dag 20 — Konvergensen',next:'convergence',
  text:`Tjugo dagar.

Soumaya inventerar: Kaos-Koden talat. Grogu har visat hur det skapades. Allen förstår nu dess kommunikationsprotokoll.

Alla pusselbitar finns. Och de pekar mot en fråga:

<em>Är det möjligt att omvandla Kaos-Koden — att konvertera ett korrupt försvarsprotokoll tillbaka till vad det var menat att vara?</em>`},
  convergence:{id:'convergence',type:'narrative',title:'Allens Analys',next:'final_choice',
  text:`Allen är bestämd nu.

<em>"Jag har kört modellen hundra gånger. Om dina val de senaste tjugo dagarna pekar mot läkning — och de gör det om du valt varsamt — finns det en biologisk väg. Vi kan nå Kaos-Kodens kärna och konvertera den. Det är inte ett hack. Det är att ge kroppen den instruktion den ursprungligen ville ha."</em>

<em>"Och om det misslyckas?"</em>

<em>"Då förstör vi det. Det är plan B."</em>`},
  final_choice:{id:'final_choice',type:'choice',
  title:'⚠️ Det Slutgiltiga Valet — Dag 20',
  text:`Grogu, Allen och Jar Jar är alla här. De väntar på ditt ord.

<em>"Vad väljer du, Soumaya?"</em>

<em>(Dag 30-avslut formas av detta val)</em>`,
  choices:[
    {label:'🌟 "Vi läker det. Vi konverterar Kaos-Koden."',flavor:'Det svåraste och det mest värdiga. Dag 30: läkningsslut.',next:'choose_heal',effect:{flags:{final_heal:true,final_destroy:false}}},
    {label:'⚔️ "Vi förstör det. Rent och definitivt."',flavor:'Klart och bestämt. Dag 30: förstörelseslut.',next:'choose_destroy',effect:{flags:{final_destroy:true,final_heal:false}}}
  ]},
  choose_heal:{id:'choose_heal',type:'narrative',title:'Läkningens Väg',next:'day20_combat',
  text:`Grogu lyser. Allen tar ett djupt andetag.

<em>"Okej. Jag hoppar i med allt jag har. Vi gör det här."</em>

Jar Jar ser på Soumaya länge. <em>"Jag har inte trott på läkning på mycket länge,"</em> säger han. <em>"Kanske är det dags att börja."</em>

<strong style="color:var(--in-range-dark)">Läkningsväg vald. Dag 30: alternativt slut öppnas.</strong>`},
  choose_destroy:{id:'choose_destroy',type:'narrative',title:'Krigarens Väg',next:'day20_combat',
  text:`Allen nickar. Jar Jar nickar. Grogu accepterar.

<em>"Rent snitt,"</em> säger Allen. <em>"Vi behöver ta oss till Kaos-Kodens kärna och neutralisera den. Fullständigt."</em>

Det är en ärlig väg. Det är din väg.

<strong style="color:var(--in-range-dark)">Förstöringsväg vald. Dag 30: klassiskt krigarslut.</strong>`},
  day20_combat:{id:'day20_combat',type:'combat',title:'⚔️ Kaos-Avatar',
  text:'Kaos-Koden sänder sin Avatar — sin mest kraftfulla manifestation hittills.',
  enemyId:'kaos_avatar',nextOnWin:'day20_victory',nextOnLoss:'day20_defeat'},
  day20_defeat:{id:'day20_defeat',type:'reward',won:false,title:'💀 Dag 20',
  text:'Kaos-Avataren var för stark idag. Men valet är gjort och bär.',bonusXp:175,bonusGold:45},
  day20_victory:{id:'day20_victory',type:'reward',won:true,title:'🏆 Dag 20 klar! Vägen vald.',
  text:'Dag 20 passerad. Valet gjort. De sista tio dagarna är den raka linjen mot dag 30 och det slut du valt. Tre veckor av kamp har betalat sig.',bonusXp:290,bonusGold:75}
  }
},


// ════════════════════════════════════════════
// DAG 21 — GROGUS UPPOFFRING
// ════════════════════════════════════════════
{
  day:21, title:'Grogus Uppoffring', subtitle:'Den urgamle riskerar allt',
  icon:'🟢', teaser:'Grogu använder sin fulla kraft. Det kostar.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🟢 Dag 21 — Uppoffringen',next:'grogu_power',
  text:`Kaos-Koden stänger av vägen mot pankreas-kärnan. En mur av korrupt energi — tät, komplex, inte möjlig att bryta igenom med enbart kraft.

Grogu kliver framåt.

Han kommunicerar: <em>Jag vet hur man bryter det. Jag har sett det förut.</em>`},
  grogu_power:{id:'grogu_power',type:'narrative',title:'Femtio Års Kraft',next:'grogu_aftermath',
  text:`Grogu lyfter sina händer. Och utsläpper femtio år av samlad Bio-Kosmos-energi.

Det är det vackraste och mest fruktansvärda Soumaya sett. En grön puls som breder ut sig och bryter igenom Kaos-Kodens barriär som om det var papper.

Vägen öppnas.

Men Grogu faller.

Han är inte död — men han är inte längre den varelse han var tio sekunder sedan. Hans energi är tömd. Han är liten igen. Svag. Barnslig.

Soumaya springer till honom.`},
  grogu_aftermath:{id:'grogu_aftermath',type:'choice',title:'Grogu behöver dig',
  text:`Grogu är i dina armar. Hans ögon är öppna men tomma av det urgamla ljuset som alltid funnits där.

Han lever. Men han behöver skydd.`,
  choices:[
    {label:'🛡️ Soumaya bär honom hela vägen',flavor:'Du lämnar honom aldrig. Det tar mer av dig.',next:'carry_grogu',effect:{grogu_trust:10,addXp:30}},
    {label:'🏰 Lämna honom säkert i lägret',flavor:'Han är trygg. Du kan röra dig friare.',next:'leave_grogu_safe',effect:{grogu_trust:6}}
  ]},
  carry_grogu:{id:'carry_grogu',type:'narrative',title:'Aldrig Ensam',next:'day21_combat',
  text:`Soumaya bär Grogu. Jar Jar täcker henne. Allen guidar.

Det är långsammare. Det är tyngre. Det spelar ingen roll.

<em>"Han bar dig i femtio år,"</em> säger Allen tyst. <em>"Nu är det din tur."</em>

<strong style="color:var(--in-range-dark)">Grogu-förtroende +10. Dag 28: Grogu återvänder för finalen.</strong>`},
  leave_grogu_safe:{id:'leave_grogu_safe',type:'narrative',title:'I Säkerhet',next:'day21_combat',
  text:`Soumaya lägger honom i ett skyddat hölje av Livskraft-energi. Han sluter ögonen — inte i smärta, utan i tillit.

<em>"Han litade på ditt beslut,"</em> säger Allen.

Hon går vidare. Bärandes hans offer i hjärtat.`},
  day21_combat:{id:'day21_combat',type:'combat',title:'⚔️ Kaos-Kolossen',
  text:'Genom Grogus öppnade passage — en sista Kaos-Koloss vägrar vika.',
  enemyId:'kaos_colossus',nextOnWin:'day21_victory',nextOnLoss:'day21_defeat'},
  day21_defeat:{id:'day21_defeat',type:'reward',won:false,title:'💀 Dag 21',
  text:'Kolossen vann. Men Grogus offer bär. Vägen är öppen när du är redo.',bonusXp:175,bonusGold:45},
  day21_victory:{id:'day21_victory',type:'reward',won:true,title:'🏆 Dag 21 klar!',
  text:'Grogus offer öppnade vägen. Du är nu inne i Kaos-Kodens innersta territorium. En vecka kvar. Tre allierade. En fiende som vet att du kommer.',bonusXp:295,bonusGold:78}
  }
},


// ════════════════════════════════════════════
// DAG 22 — JAR JAR BINKS VAL (BRANCHING)
// ════════════════════════════════════════════
{
  day:22, title:'Jar Jars Val', subtitle:'Stannar han eller råkar han klanta till det?',
  icon:'🦸', teaser:'Jar Jar ställs inför sitt eget val. Dag 8-valet avgör vad han väljer.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🦸 Dag 22',next:'day22_branch',
  text:`Jar Jar stannar dem.

<em>"Jag behöver prata."</em>

Det är ovanligt för honom — att stoppa, att prata istället för att agera. Soumaya vänder sig om.

<em>"Jag kan lämna,"</em> säger han. <em>"Portalen hem öppnas imorgon. Det är ett kort fönster."</em>

En paus.

<em>"Jag behöver veta om du vill att jag stannar."</em>`},
  day22_branch:{id:'day22_branch',type:'branch',
  branches:[
    {if:{flags:{omni_trust:6}},next:'omni_stays'},
    {else:true,next:'omni_choice_needed'}
  ]},
  omni_stays:{id:'omni_stays',type:'narrative',title:'Han Stannar',next:'omni_declaration',
  text:`Han ser på dig och vet svaret innan du ger det.

<em>"Jag visste det redan,"</em> säger han. <em>"Jag frågade ändå. Jag ville höra det."</em>

Han stänger portalen. Manuellt. Utan tvekan.

<em>"Jag saknade ett hemuniversum att kämpa för,"</em> säger han. <em>"Det verkar som om jag hittade ett."</em>

<strong style="color:var(--in-range-dark)">Jar Jar stannar. Dag 29 full styrka.</strong>`},
  omni_choice_needed:{id:'omni_choice_needed',type:'choice',title:'Ditt svar?',
  text:`Han väntar. Det är ditt val att ge.`,
  choices:[
    {label:'🌟 "Stanna. Det här är din kamp också."',flavor:'Jar Jar nickar. Det är nog.',next:'omni_stays_choose',effect:{omni_trust:5}},
    {label:'🕊️ "Gå om du måste. Jag klarar det."',flavor:'Han ser på dig länge. Beslutar. Stannar ändå.',next:'omni_stays_alone',effect:{omni_trust:3}}
  ]},
  omni_stays_choose:{id:'omni_stays_choose',type:'narrative',title:'Vald Lojalitet',next:'omni_declaration',
  text:`<em>"Din kamp,"</em> upprepar han. Väger det. <em>"Ja. Det är det."</em>

Han stänger portalen.

<strong style="color:var(--in-range-dark)">Jar Jar stannar vid din inbjudan.</strong>`},
  omni_stays_alone:{id:'omni_stays_alone',type:'narrative',title:'Hans Val',next:'omni_declaration',
  text:`<em>"Jag vet att du klarar det,"</em> säger han. <em>"Det är inte anledningen till att jag stannar."</em>

Han stänger portalen. För sin skull.

Det är faktiskt det mäktigaste han gjort.`},
  omni_declaration:{id:'omni_declaration',type:'narrative',title:'Löftet',next:'day22_combat',
  text:`<em>"Jar Jar Binks har gjort många misstag,"</em> säger Jar Jar. <em>"Jar Jar har svikit de han älskade."</em>

Han ser på Soumaya.

<em>"Men här, i det här universumet, i den här kroppen — jag väljer rätt."</em>

Det är det viktigaste han någonsin sagt.`},
  day22_combat:{id:'day22_combat',type:'combat',title:'⚔️ Kaos-General',
  text:'Kaos-Generalens sista trupp försvarar inträdet till den inre zonen.',
  enemyId:'kaos_general',nextOnWin:'day22_victory',nextOnLoss:'day22_defeat'},
  day22_defeat:{id:'day22_defeat',type:'reward',won:false,title:'💀 Dag 22',
  text:'Generalen höll idag. Men Jar Jar är kvar. Det är det viktiga.',bonusXp:180,bonusGold:48},
  day22_victory:{id:'day22_victory',type:'reward',won:true,title:'🏆 Dag 22 klar!',
  text:'Jar Jar vald och stannad. Laget komplett. Inre zonen nådd. Sju dagar kvar mot finalen.',bonusXp:295,bonusGold:78}
  }
},


// ════════════════════════════════════════════
// DAG 23 — KAOS-KODENS INNERSTA FÄSTNING
// ════════════════════════════════════════════
{
  day:23, title:'Innersta Fästningen', subtitle:'Kaos-Kodens hjärta syns',
  icon:'🌑', teaser:'Den sista barriären. Pankreas-kärnan är nåbar för första gången.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🌑 Dag 23',next:'inner_sight',
  text:`De ser det nu.

Kaos-Kodens innersta fästning: en konstruktion av sammanflätad kortisol-kristall och härdad stresshormonsenergi, byggd runt pankreas ursprungspunkt. Det pulserar i rött. Det är massivt. Det är i vägen.

Men för första gången är det <em>nåbart.</em>`},
  inner_sight:{id:'inner_sight',type:'narrative',title:'Planen',next:'omni_plan',
  text:`Allen analyserar omedelbart. <em>"En direkt frontattack kommer ta oss ner. Men."</em>

Han markerar tre punkter på hologrammet.

<em>"Om vi kan ta dessa tre signaltorn — Kaos-Kodens kommandopunkter — isoleras kärnan. Den kan inte kommunicera med omvärlden. Den är stark men ensam."</em>

Jar Jar: <em>"Tre torn. Tre av oss."</em>

Soumaya: <em>"En var."</em>`},
  omni_plan:{id:'omni_plan',type:'choice',title:'Uppdelat Anfall',
  text:`Tre signaltorn. Tre av er. Var tar du?`,
  choices:[
    {label:'⚡ Östra tornet — snabbast, ensam',flavor:'Du tar den snabba vägen ensam.',next:'east_tower',effect:{addXp:30}},
    {label:'🧠 Norra tornet — mest komplex, med Allen',flavor:'Allen guidar dig. Teamwork.',next:'north_tower',effect:{allen_trust:4}},
    {label:'💪 Södra tornet — tyngst, du och Jar Jar',flavor:'Brutalt frontalt. Jar Jar glad.',next:'south_tower',effect:{omni_trust:4}}
  ]},
  east_tower:{id:'east_tower',type:'narrative',title:'Östtornet',next:'day23_combat',
  text:`Ensam. Snabb. Fokuserad.

Soumaya når östtornet innan Kaos-Koden ens hinner reagera. Det är det hon gör bäst: rusa in när alla andra analyserar.

Tornet är bevakat. Självklart.`},
  north_tower:{id:'north_tower',type:'narrative',title:'Nordtornet',next:'day23_combat',
  text:`Allen leder henne genom Nordtornets komplexitet med en precision som imponerar till och med på Jar Jar.

<em>"Vänster. Tre steg. Nu."</em>

De är ett perfekt team.`},
  south_tower:{id:'south_tower',type:'narrative',title:'Sydtornet',next:'day23_combat',
  text:`Jar Jar och Soumaya tar Sydtornet med ren kraft — han bryter igenom väggarna, hon neutraliserar signalsystemet.

Det är gloriously ineffektivt och absolut effektivt.`},
  day23_combat:{id:'day23_combat',type:'combat',title:'⚔️ Tornets Väktare',
  text:'Varje torn har en Kaos-Kapten som väktare. Ta din.',
  enemyId:'kaos_captain',nextOnWin:'day23_victory',nextOnLoss:'day23_defeat'},
  day23_defeat:{id:'day23_defeat',type:'reward',won:false,title:'💀 Dag 23',
  text:'Tornet höll. Men de andra togs av Jar Jar och Allen. Planen fortskrider.',bonusXp:180,bonusGold:48},
  day23_victory:{id:'day23_victory',type:'reward',won:true,title:'🏆 Dag 23 klar!',
  text:'Tre signaltorn tagna. Kaos-Koden isolerad. Kärnan nåbar om fyra dagar. Finalen tar form.',bonusXp:300,bonusGold:80}
  }
},


// ═════ DAGAR 24-28: VECKA 4 ═════════════════

// DAG 24
{day:24,title:'Allens Sista Beräkning',subtitle:'Algoritmen som kan vinna kriget',
icon:'💻',teaser:'Allen kör sin mest komplexa analys — och det han hittar förändrar finalen.',
scenes:{
  intro:{id:'intro',type:'narrative',title:'💻 Dag 24',next:'allen_final',
  text:`<em>"Soumaya. Jag har kört alla scenarier."</em> Allen talar med en klarhet som han inte haft på tjugo dagar. <em>"Baserat på dina val, ditt Grogu-förtroende, Jar Jars lojalitet och Kaos-Kodens isolerade tillstånd — vi har ett 87% framgångsfönster. Det bästa jag beräknat sedan dag ett."</em>`},
  allen_final:{id:'allen_final',type:'narrative',title:'87%',next:'prepare_choice',
  text:`<em>"Och de andra 13%?"</em>

<em>"Oförutsedda variabler. Kaos-Koden kan fortfarande ha resurser vi inte sett. Det är alltid sant."</em>

Han tystnar. Sedan: <em>"Men Soumaya? Jag tror på dig. Det är inte i beräkningen. Det är utöver beräkningen."</em>

Soumaya ler. <em>"Tack, Allen."</em>`},
  prepare_choice:{id:'prepare_choice',type:'choice',title:'Förberedelse för finalen',
  text:`Tre dagar till finalen. Hur förbereder du dig?`,
  choices:[
    {label:'🧘 Vila och samla Livskraft',flavor:'Max kapacitet dag 29.',next:'rest_prep',effect:{addXp:20}},
    {label:'📊 Studera Kaos-Kodens kärna med Allen',flavor:'Bonus data inför finalen.',next:'study_prep',effect:{addXp:30,allen_trust:3}}
  ]},
  rest_prep:{id:'rest_prep',type:'narrative',title:'Vila',next:'day24_combat',
  text:`Soumaya vilar. Det är det svåraste hon gjort — att låta kroppen vila istället för att jaga.

Allen ser till att hon sover. Grogu vakar. Jar Jar patrullerar.

Hon vaknar starkare.`},
  study_prep:{id:'study_prep',type:'narrative',title:'Studiet',next:'day24_combat',
  text:`Allen och Soumaya tillbringar timmar med att analysera varje känd detalj om Kaos-Kodens kärna.

<em>"Här,"</em> säger Allen. <em>"En svaghet. Liten men real. Kom ihåg det dag trettio."</em>`},
  day24_combat:{id:'day24_combat',type:'combat',title:'⚔️ Sista Patrullen',
  text:'En sista patrull av Kaos-drönare försöker störa förberedelserna.',
  enemyId:'kaos_drone',nextOnWin:'day24_victory',nextOnLoss:'day24_defeat'},
  day24_defeat:{id:'day24_defeat',type:'reward',won:false,title:'💀 Dag 24',text:'Patrullen kostade men planen håller.',bonusXp:185,bonusGold:48},
  day24_victory:{id:'day24_victory',type:'reward',won:true,title:'🏆 Dag 24 klar!',
  text:'Förberedelserna klara. Allens beräkning: 87%. Två dagar till pankreas-kärnan.',bonusXp:295,bonusGold:75}
}},

// DAG 25
{day:25,title:'Grogus Återkomst',subtitle:'Det urgamla ljuset vaknar',
icon:'🌟',teaser:'Grogu — försvagad efter dag 21 — återvänder vid exakt rätt ögonblick.',
scenes:{
  intro:{id:'intro',type:'narrative',title:'🌟 Dag 25',next:'grogu_return',
  text:`De hör det innan de ser det: ett mjukt, grönt sken som rör sig längs korridoren mot dem.

Grogu.

Han är fortfarande svag — men han är inte tom längre. Hans ögon bär det urgamla ljuset igen, inte fullt, men tillräckligt.

Han är tillbaka.`},
  grogu_return:{id:'grogu_return',type:'narrative',title:'Han Är Här',next:'grogu_gift2',
  text:`Soumaya tar emot honom. Han kommunicerar: <em>Jag lovade att vara här för det avgörande.</em>

Allen kan knappt prata. Jar Jar — hårdhetens mästare — ser bort och blinkar.

Det är det.`},
  grogu_gift2:{id:'grogu_gift2',type:'narrative',title:'Det Sista Skyddet',next:'day25_combat',
  text:`Grogu ger henne något nytt: ett barriärskikt av ren mikrobiomenergi — det starkaste skyddet han kan ge.

<em>"För finalen,"</em> säger Allen. <em>"Det håller i trettio timmar. Exakt vad vi behöver."</em>`},
  day25_combat:{id:'day25_combat',type:'combat',title:'⚔️ Kaos-Avatar',
  text:'Kaos-Koden sänder en sista Avatar — desperat och farlig.',
  enemyId:'kaos_avatar',nextOnWin:'day25_victory',nextOnLoss:'day25_defeat'},
  day25_defeat:{id:'day25_defeat',type:'reward',won:false,title:'💀 Dag 25',text:'Avataren slog tillbaka. Grogu är dock tillbaka. Imorgon försöker vi igen.',bonusXp:190,bonusGold:50},
  day25_victory:{id:'day25_victory',type:'reward',won:true,title:'🏆 Dag 25 klar! Grogu tillbaka!',
  text:'Grogu vaken. Laget komplett. Kaos-Kodens kärna en dag bort. Förbered dig.',bonusXp:305,bonusGold:82}
}},

// DAG 26
{day:26,title:'Pankreastornets Siege',subtitle:'Belägringen börjar',
icon:'🏯',teaser:'Det slutgiltiga anfallet mot Kaos-Kodens fästning börjar idag.',
scenes:{
  intro:{id:'intro',type:'narrative',title:'🏯 Dag 26 — Belägringen',next:'siege_plan',
  text:`Pankreastornet.

Det är allt som återstår av Kaos-Kodens yttre försvar. Massivt. Härdade kortisol-lager fyra meter tjocka. Och inuti: kärnan.

<em>"Vi bryter igenom idag,"</em> säger Jar Jar. Det är inte en fråga.`},
  siege_plan:{id:'siege_plan',type:'narrative',title:'Planen',next:'siege_action',
  text:`Allen och Soumaya lägger planen: Jar Jar bryter det yttre skalet. Soumaya tar sig in. Grogu håller Kaos-Kodens sensorer störda. Allen guidar.

Det är enkelt. Det borde fungera.

Det gör det aldrig exakt som planerat.`},
  siege_action:{id:'siege_action',type:'choice',title:'Belägringens Nyckelmoment',
  text:`Mitt i anfallet: en oväntad barriär av kondenserad HbA1c-kristall blockerar Soumayas väg in. Jar Jar är uppbunden. Grogu fokuserat annanstans.`,
  choices:[
    {label:'⚡ Forcera igenom barriären ensam',flavor:'Kräver STY-slag (SV 14) — ren kraft mot kondenserat HbA1c.',check:{stat:'STY',dc:14,nextOnSuccess:'force_through',nextOnFailure:'force_partial',effect:{addXp:20}}},
    {label:'📡 Vänta på Allen att hitta en öppning',flavor:'Säkrare. Lite långsammare.',next:'wait_allen',effect:{allen_trust:3}}
  ]},
  force_partial:{id:'force_partial',type:'narrative',title:'Halvvägs Igenom',next:'citadel_inner',
  text:`Soumaya kraschar in i HbA1c-barriären — och stannar halvvägs.

Det är som att simma genom härdad betong. Kristallerna skär mot nano-skalet. Hon pressar och pressar och—

Jar Jar landar bredvid henne. Han ser barriären. Ser henne. Och springer rakt in med den totala avsaknad av självbevarelsedrift som definierar honom.

Kombinerat genombryter de.

<em>"Meesa hjälpte!"</em>

<em>"Du hjälpte,"</em> bekräftar Soumaya, andfådd.

<strong style="color:var(--high)">Igenom — med hjälp. Jar Jar-förtroende +2.</strong>`,
  effect:{omni_trust:2}},

  force_through:{id:'force_through',type:'narrative',title:'Forcerar',next:'day26_combat',
  text:`Soumaya krossade sig igenom. Det kostade — men hon är inne.

<em>"Galet,"</em> säger Allen. <em>"Genialt galet."</em>`},
  wait_allen:{id:'wait_allen',type:'narrative',title:'Allens Öppning',next:'day26_combat',
  text:`<em>"Tio sekunder,"</em> säger Allen. Och i sekund elva: <em>"Gå. Nu."</em>

En perfekt öppning. Teamwork som det ska fungera.`},
  day26_combat:{id:'day26_combat',type:'combat',title:'⚔️ Tornets Inre Väktare',
  text:'Inne i tornet: en Kaos-General på sista försvarsposition.',
  enemyId:'kaos_general',nextOnWin:'day26_victory',nextOnLoss:'day26_defeat'},
  day26_defeat:{id:'day26_defeat',type:'reward',won:false,title:'💀 Dag 26',text:'Inte idag. Men tornet är brutet. Imorgon sista inre väktaren.',bonusXp:190,bonusGold:50},
  day26_victory:{id:'day26_victory',type:'reward',won:true,title:'🏆 Dag 26 klar!',
  text:'Pankreastornet bruten. Kärnan två lager bort. Två dagar kvar. Allen: 94%.',bonusXp:305,bonusGold:82}
}},

// DAG 27
{day:27,title:'Den Sista Barriären',subtitle:'En lager kvar',
icon:'🛡️',teaser:'Den sista försvarsbarriären. Kaos-Koden är desperat.',
scenes:{
  intro:{id:'intro',type:'narrative',title:'🛡️ Dag 27',next:'last_wall',
  text:`En barriär kvar.

Kaos-Kodens yttersta försvarslager — inte gjort av kortisol eller kristall, utan av ren, koncentrerad Kaos-energi. Det är det farligaste elementet de mött.

<em>"Det är dess desperation,"</em> säger Allen. <em>"Det vet att vi är här."</em>`},
  last_wall:{id:'last_wall',type:'narrative',title:'Kaos-Kodens Sista Ord',next:'kaos_final_plea',
  text:`Och sedan — rösten igen.

<em style="color:var(--pulse-red)">"Soumaya. Det är inte för sent."</em>

Alla stannar.

<em style="color:var(--pulse-red)">"Jag skapades av din smärta. Jag lärde mig av din kamp. Jag är allt du känt. Förstör mig och du förstör ett stycke av dig själv."</em>`},
  kaos_final_plea:{id:'kaos_final_plea',type:'choice',title:'Det Sista Talet',
  text:`Är det sant? Är det manipulation? Kanske båda?`,
  choices:[
    {label:'⚔️ "Jag hör dig. Men det ändrar ingenting."',flavor:'Bestämd. Du vet vad du valt.',next:'resolve_forward',effect:{addXp:25}},
    {label:'💡 "Jag hör dig. Det är därför jag väljer läkning."',flavor:'Om du valt läkningsväg — det stärker ditt beslut.',next:'heal_resolve',effect:{addXp:25}}
  ]},
  resolve_forward:{id:'resolve_forward',type:'narrative',title:'Framåt',next:'day27_combat',
  text:`<em>"Jag hör dig,"</em> säger Soumaya. <em>"Och jag hör alla dina lång tids fel val. Smärta är inte en ursäkt. Det är en förklaring."</em>

Jar Jar: <em>"Det bästa du sagt."</em>`},
  heal_resolve:{id:'heal_resolve',type:'narrative',title:'Läkningens Svar',next:'day27_combat',
  text:`<em>"Jag hör dig,"</em> säger Soumaya. <em>"Och det är därför jag inte förstör dig. Jag ger dig tillbaka vad du alltid var menat att vara."</em>

Grogu lyser. Allen gråter. Det är okej.`},
  day27_combat:{id:'day27_combat',type:'combat',title:'⚔️ Kaos-Prime I',
  text:'Kaos-Koden tar sin Prime-form för att försvara sista barriären.',
  enemyId:'kaos_prime',nextOnWin:'day27_victory',nextOnLoss:'day27_defeat'},
  day27_defeat:{id:'day27_defeat',type:'reward',won:false,title:'💀 Dag 27',text:'Kaos-Prime I höll idag. Imorgon: sista förberedelsen.',bonusXp:195,bonusGold:52},
  day27_victory:{id:'day27_victory',type:'reward',won:true,title:'🏆 Dag 27 klar!',
  text:'Sista barriären bruten. Kärnan nåbar. Imorgon: varje ally möter sin sista prövning. Och sedan — dag 30.',bonusXp:310,bonusGold:85}
}},

// DAG 28
{day:28,title:'Varje Allys Sista Prövning',subtitle:'Ensam tillsammans',
icon:'💎',teaser:'Allen, Grogu och Jar Jar möter var sin prövning. Du möter din.',
scenes:{
  intro:{id:'intro',type:'narrative',title:'💎 Dag 28 — Prövningarna',next:'split_up',
  text:`Vägen till kärnan delar sig i fyra. En för varje.

<em>"Det är Kaos-Kodens sista försvarssystem,"</em> säger Allen. <em>"Det kräver att alla av er besegrar er personliga prövning för att öppna kärngången. Det... det är faktiskt genialt."</em>

<em>"Genialt"</em> är kanske inte rätt ord just nu.`},
  split_up:{id:'split_up',type:'narrative',title:'Var Och En',next:'soumayas_trial',
  text:`Allen tar sin tunnel: matematisk labyrint av Kaos-data. Han vet hur man löser det.

Grogu tar sin: ett ekorum av ren Bio-Kosmos-historia. Hans element.

Jar Jar tar sin: brutal kraft mot Kaos-Kodens starkaste konstrukt. Naturligtvis.

Soumaya tar sin: <em>minnenas tunnel</em>.`},
  soumayas_trial:{id:'soumayas_trial',type:'narrative',title:'Minnenas Tunnel',next:'memory_trial',
  text:`Minnenas tunnel visar henne allt: varje injektionsnål, varje morgon med lågt blodsocker, varje gång hon letat efter svar och inte hittat dem, varje dag hon levt med T1D och valt att göra det fullt.

Kaos-Koden tror att det är smärtsamt. Det är det. Men det är också <em>hers.</em>`},
  memory_trial:{id:'memory_trial',type:'choice',title:'Minnenas Sanning',
  text:`Tunneln visar det svåraste minnet — diagnosen. Och frågar: <em>Would you change it?</em>`,
  choices:[
    {label:'🌟 "Nej. Det formade mig."',flavor:'Acceptans. Tunneln öppnas i guldljus.',next:'trial_accept',effect:{addXp:50}},
    {label:'💪 "Det hade kunnat gå annorlunda. Men jag lever med det som är."',flavor:'Realism och styrka. Tunneln öppnas.',next:'trial_realism',effect:{addXp:40}}
  ]},
  trial_accept:{id:'trial_accept',type:'narrative',title:'Acceptansen',next:'day28_combat',
  text:`Tunneln exploderar i guldljus.

Soumaya hör de andras tunnlar öppnas nästan simultant — de klarade sina prövningar.

<em>"Alla klara,"</em> rapporterar Allen, och hans röst skakar. <em>"Vi är klara för kärnan."</em>`},
  trial_realism:{id:'trial_realism',type:'narrative',title:'Realismens Styrka',next:'day28_combat',
  text:`Tunneln öppnas. Inte dramatiskt — pragmatiskt, som hon valde.

<em>"Alla klara,"</em> säger Allen. <em>"Soumaya? Det var det starkaste svaret."</em>`},
  day28_combat:{id:'day28_combat',type:'combat',title:'⚔️ Sista Kolossen',
  text:'En sista Kaos-Koloss vaktar sammanslagningspunkten.',
  enemyId:'kaos_colossus',nextOnWin:'day28_victory',nextOnLoss:'day28_defeat'},
  day28_defeat:{id:'day28_defeat',type:'reward',won:false,title:'💀 Dag 28',text:'Kolossen höll. Men prövningarna är klarade. Imorgon: Kärngången öppnas.',bonusXp:200,bonusGold:55},
  day28_victory:{id:'day28_victory',type:'reward',won:true,title:'🏆 Dag 28 klar!',
  text:'Alla fyra prövningar klarade. Kärngången öppen. Imorgon: kärnan. Trettio dagars kamp konvergerar.',bonusXp:315,bonusGold:88}
}},


// ════════════════════════════════════════════
// DAG 29 — HJÄRTATS KAMMARE
// ════════════════════════════════════════════
{
  day:29, title:'Hjärtats Kammare', subtitle:'Kärnan — och vad som väntar',
  icon:'🌀', teaser:'Du är inne. Kaos-Kodens kärna framför dig. Det sista steget.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'🌀 Dag 29 — Kärnan',next:'core_sight',
  text:`Tjugonio dagar.

De kliver in i Hjärtats Kammare — kärngången öppen, vägen fri.

Det är tyst härinne på ett sätt som känns som slutet och som början på samma gång. Kaos-Kodens kärna pulserar framför dem: ett ovalt, djuprött energifält som bär lång tids korruption och ett ursprung av desperat kärlek.

Soumaya stannar. Tar ett djupt andetag.

Imorgon.`},
  core_sight:{id:'core_sight',type:'narrative',title:'Sex År',next:'ally_moment',
  text:`Kaos-Koden kommunicerar inte längre. Den vet vad som kommer.

Men Soumaya ser det tydligare nu — det ursprungliga mönstret, det som startade som ett nödprotokoll i en Beta-cell. Det finns fortfarande kvar inuti korruptionen. Litet. Stukat. Men present.

<em>"Det är kvar,"</em> bekräftar Allen stilla. <em>"Ursprungsprotokollen. De är fortfarande aktiva under allt annat."</em>`},
  ally_moment:{id:'ally_moment',type:'narrative',title:'Laget Samlat',next:'final_prep',
  text:`Alla fyra samlas: Allen i kommsystemet. Grogu vid hennes sida. Jar Jar bakom.

<em>"Imorgon,"</em> säger Allen. <em>"Idag vilar vi. Läker. Förbereder oss. Och vi är redo."</em>

Jar Jar lägger en hand på hennes axel — tung, varm, mänskligare än han låtsas vara.

<em>"Oavsett vad som händer imorgon,"</em> säger han, <em>"du förtjänar att veta: att komma hit var det modigaste jag sett. I vilket universum som helst."</em>`},
  final_prep:{id:'final_prep',type:'choice',title:'Sista Förberedelsen',
  text:`Natten innan dag 30. En sista sak att fokusera på.`,
  choices:[
    {label:'🌟 Fokusera på vad du kämpar för — leva väl',flavor:'Livskraftens källkod. Du brinner av det.',next:'prep_purpose',effect:{addXp:35}},
    {label:'💬 Prata med Allen hela natten',flavor:'Inte om planer — bara prata.',next:'prep_allen',effect:{allen_trust:5,addXp:25}},
    {label:'🟢 Sitta med Grogu i tystnad',flavor:'Hans närvaro är nog.',next:'prep_grogu',effect:{grogu_trust:5,addXp:25}}
  ]},
  prep_purpose:{id:'prep_purpose',type:'narrative',title:'Varför du kämpar',next:'day29_combat',
  text:`Soumaya sitter och tänker på allt det enkla: en morgon utan larm. En dag utan att tänka på tal. En framtid med fulla möjligheter.

Hon kämpar för det. Det räcker.

Det är alltid nog.`},
  prep_allen:{id:'prep_allen',type:'narrative',title:'En Natt Med Allen',next:'day29_combat',
  text:`De pratar om allt annat än krig: filmer han rekommenderar, mat hon saknar, planerna hon har för efteråt.

Det är det bästa samtalet de haft.

<em>"Soumaya,"</em> säger Allen till slut. <em>"Imorgon, oavsett allt — tack för att du lät mig vara med."</em>`},
  prep_grogu:{id:'prep_grogu',type:'narrative',title:'Grogus Stilla Närvaro',next:'day29_combat',
  text:`De sitter. Säger ingenting. Det behövs ingenting.

Grogu håller hennes hand. Hans gröna närvaro pulserar varmt och konstant som ett hjärtslag som alltid funnits.

Femtio år av stöd. En natt av tack.`},
  day29_combat:{id:'day29_combat',type:'combat',title:'⚔️ Kaos-Prime II',
  text:'Kaos-Kodens yttersta försvar: Prime-form. Den sista striden innan kärnan.',
  enemyId:'kaos_prime',nextOnWin:'day29_victory',nextOnLoss:'day29_defeat'},
  day29_defeat:{id:'day29_defeat',type:'reward',won:false,title:'💀 Dag 29 — Nästan',
  text:'Prime höll idag. Men du är inne, förbered och redo. Imorgon: det avgörande.',bonusXp:210,bonusGold:58},
  day29_victory:{id:'day29_victory',type:'reward',won:true,title:'🏆 Dag 29 klar! Kärnan redo.',
  text:'En dag kvar. Kärnan väntar. Imorgon skriver du slutet på den historia som startade allt.',bonusXp:320,bonusGold:90}
  }
},


// ════════════════════════════════════════════
// DAG 30 — SOUMAYA REBORN (FINALEN)
// ════════════════════════════════════════════
{
  day:30, title:'Soumaya Reborn', subtitle:'Trettio dagars krig — och slutet du valt',
  icon:'⭐', teaser:'Det är dag 30. Dina val formar slutet. Kämpa för det du tror på.',
  scenes:{
  intro:{id:'intro',type:'narrative',title:'⭐ DAG 30 — FINALEN',next:'final_entry',
  text:`Trettio dagar.

Soumaya står vid Kaos-Kodens kärna.

Det har tagit trettio dagar av strider, val, förluster, segrar, sanningar och relationer. Det har tagit Allen och Grogu och Jar Jar. Det har tagit mod och tvivel och allt däremellan.

Och nu är hon här.

<em>"Soumaya,"</em> säger Allen, och hans röst är stilla. <em>"Det är dags."</em>`},
  final_entry:{id:'final_entry',type:'narrative',title:'Kärnan Öppnas',next:'kaos_final_form',
  text:`Kärnan öppnas när Soumaya träder in.

Kaos-Koden materialiserar sig i sin sanna form — inte en röst, inte en signal, utan en närvaro. Röd och pulsande och komplex. Korrupt data och under det, djupt inne, det ursprungliga nödprotokoll som bara ville hjälpa.

Det tittar på henne.

<em>"Soumaya."</em>

<em>"Jag vet,"</em> svarar hon.`},
  kaos_final_form:{id:'kaos_final_form',type:'narrative',title:'Valet Manifesteras',next:'final_branch',
  text:`Allen, Grogu och Jar Jar är utanför kärnan — de kan inte komma in. Det här är Soumayas ensamma ögonblick.

<em>"Du klarar det,"</em> säger Allen.

<em>"Vi är här,"</em> säger Jar Jar.

Grogu lyser grönt.

Soumaya tar ett steg framåt.`},
  final_branch:{id:'final_branch',type:'branch',
  branches:[
    {if:{flags:{final_heal:true}},next:'heal_final'},
    {else:true,next:'destroy_final'}
  ]},
  destroy_final:{id:'destroy_final',type:'narrative',title:'Förstörelsens Väg',next:'final_boss_fight',
  text:`Soumaya väljer klart snitt.

<em>"Du gav det du förstod. Det räcker inte. Det är dags att sluta."</em>

Kaos-Koden breder ut sig till sin fullständiga Prime-form. Det är ett krig. Det är alltid ett krig när man väljer förstörelse.

Men det är ett rättfärdigt krig.

Allen: <em>"Jag är med dig hela vägen."</em>`},
  heal_final:{id:'heal_final',type:'narrative',title:'Läkningens Väg',next:'heal_boss',
  text:`Soumaya väljer annorlunda.

Hon sträcker handen mot kärnan — inte med ett vapen, utan med ren Livskraft. Det ursprungliga nödprotokoll. Vad kroppen alltid velat ha.

<em>"Du ville skydda mig. Jag ger dig chansen att göra det rätt."</em>

En lång paus. Kaos-Kodens form fluktuerar — röd och sedan, för ett ögonblick, guldskimrande.

Allen håller andan.`},
  final_boss_fight:{id:'final_boss_fight',type:'combat',title:'⚔️ DIABETES INCARNATA — FINALEN',
  text:'Kaos-Koden i sin ultimata form: Diabetes Incarnata. Den sista striden. Allt du är mot allt den är.',
  enemyId:'diabetes_incarnata',nextOnWin:'destroy_victory',nextOnLoss:'final_defeat'},
  heal_boss:{id:'heal_boss',type:'combat',title:'⚔️ KAOS-KODENS SISTA MOTSTÅND',
  text:'Kaos-Koden kämpar mot konverteringen — en reflex, inte ett val. Håll ut tills den ceder.',
  enemyId:'kaos_prime',nextOnWin:'heal_victory',nextOnLoss:'final_defeat'},

  destroy_victory:{id:'destroy_victory',type:'reward',won:true,
  title:'⭐ SOUMAYA REBORN — KRIGARENS SLUT',
  text:`Diabetes Incarnata faller.

Korruptionen löser upp sig i Bio-Kosmos som om den aldrig funnits — nej, inte som om. Den funnits. Men nu är den historia.

Soumaya andas.

Kaos-Koden är borta. Pankreas kan börja läka — inte botas, T1D är T1D — men läkas från korruptionens grepp. Kroppen är renare. Friskare. Friare.

Allen skriker av glädje.
Grogu lyser av den starkaste gröna glansen Soumaya sett.
Jar Jar — ler. Egentligen ler.

<em>"Trettio dagar,"</em> säger Allen. <em>"Trettio dagar och du vann."</em>

Soumaya sätter sig i hjärtats kammare och låter Bio-Kosmos pulsa runt henne.

Det är hennes kropp. Det har alltid varit hennes kropp.

Nu är den fri.

🏆 <strong>+666 XP  +200 🪙  SOUMAYA REBORN UPPNÅDD</strong>

<em>Nästa berättelse börjar snart. Du vet vem du är nu.</em>`,
  bonusXp:666,bonusGold:200},

  heal_victory:{id:'heal_victory',type:'reward',won:true,
  title:'⭐ SOUMAYA REBORN — LÄKARENS SLUT',
  text:`Kaos-Kodens motstånd ceder.

Och sedan — ett mirakel i den medicinska nanoteknologins historia:

Kaos-Koden konverteras. Det ursprungliga nödprotokoll vaknar. Korruptionen löses upp lager för lager, och vad som ersätter det är inte tomt — det är ett fungerande, om rudimentärt, insulinstödsystem. Inte ett botemedel. Men ett steg.

Soumaya håller handen mot kärnan och känner den förändras under fingertopparna.

Allen gråter öppet nu. <em>"Det fungerade. Soumaya — det fungerade."</em>

Grogu lyser som en liten sol.

Jar Jar: <em>"Jag visste aldrig att läkning var starkare än förstörelse. Nu vet jag."</em>

Bio-Kosmos andas. Djupare. Renare. Annorlunda.

Inte perfekt. T1D är T1D. Men läkt från dess mörkaste lager.

Soumaya andas ut. Trettio dagar inne. Nu är det dags att gå tillbaka — och ta med sig vad hon lärt sig.

🌟 <strong>+666 XP  +200 🪙  SOUMAYA REBORN — LÄKNINGSSLUT UPPNÅDD</strong>

<em>Nästa berättelse börjar snart. Du vet nu vad kroppen kan.</em>`,
  bonusXp:666,bonusGold:200},

  final_defeat:{id:'final_defeat',type:'reward',won:false,
  title:'💀 Dag 30 — Inte Idag',
  text:`Kaos-Koden höll — idag.

Men du nådde dit ingen nått på trettio dagar. Nästa gång — och det finns alltid en nästa gång — är du starkare. Klokare. Med Allen, Grogu och Jar Jar vid din sida.

Trettio dagar av kamp förlorar inte sin mening för att dag trettio var svår.

Du vet vem du är. Det glömmer du inte.`,
  bonusXp:200,bonusGold:55}
  }
}

]; // END STORY_CHAPTERS


// ═══════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════

function initAdventureProgress() {
  if (!window.state.adventureProgress) {
    window.state.adventureProgress = {
      currentDay: 1,
      sceneId: 'intro',
      lastPlayedDate: null,
      dayCompleted: false,
      effects: { addXp: 0, addGold: 0 },
      flags: {},
    };
  }
}

function getAP() {
  initAdventureProgress();
  return window.state.adventureProgress;
}

function canPlayToday() {
  const ap = getAP();
  if (ap.currentDay > 30) return false;
  if (!ap.dayCompleted) return true; // in progress
  const today = new Date().toISOString().split('T')[0];
  return ap.lastPlayedDate !== today;
}

function canStartNewDay() {
  const ap = getAP();
  if (!ap.dayCompleted) return false;
  const today = new Date().toISOString().split('T')[0];
  return ap.lastPlayedDate !== today;
}

function startNextDay() {
  const ap = getAP();
  if (ap.dayCompleted) {
    ap.currentDay = Math.min(ap.currentDay + 1, 30);
    ap.sceneId = 'intro';
    ap.dayCompleted = false;
    ap.effects = { addXp: 0, addGold: 0 };
  }
}

function getChapter(day) {
  return STORY_CHAPTERS[day] || null;
}

function getCurrentChapter() {
  return getChapter(getAP().currentDay);
}

function getCurrentScene() {
  const ap = getAP();
  const ch = getCurrentChapter();
  if (!ch) return null;
  return ch.scenes[ap.sceneId] || ch.scenes['intro'];
}

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

function advanceToScene(sceneId, effect) {
  const ap = getAP();
  if (effect) {
    if (effect.addXp)  ap.effects.addXp  = (ap.effects.addXp  || 0) + effect.addXp;
    if (effect.addGold) ap.effects.addGold = (ap.effects.addGold || 0) + effect.addGold;
    if (effect.flags) Object.assign(ap.flags, effect.flags);
    // Trust counters
    ['allen_trust','grogu_trust','omni_trust'].forEach(k => {
      if (effect[k] !== undefined) {
        ap.flags[k] = (ap.flags[k] || 0) + effect[k];
      }
    });
    if (effect.stamina_saved !== undefined) ap.flags.stamina_saved = effect.stamina_saved;
  }
  ap.sceneId = sceneId;
  if (window.state && window.state.adventureProgress) {
    // trigger save if available
    if (typeof savePlayerToServer === 'function') savePlayerToServer();
  }
  renderAdventureTab();
}

// Called from choice buttons: window._currentChoices must be set
function makeStoryChoice(idx) {
  const choices = window._currentChoices;
  if (!choices || !choices[idx]) return;
  const ch = choices[idx];
  advanceToScene(ch.next, ch.effect || {});
}

// Called from narrative 'next' button
function advanceStoryScene() {
  const scene = getCurrentScene();
  if (!scene || !scene.next) return;
  advanceToScene(scene.next, scene.effect || null);
}

// Branch scenes resolve automatically
function resolveBranch(scene) {
  const ap = getAP();
  if (!scene.branches) return null;
  for (const branch of scene.branches) {
    if (branch.else) return branch.next;
    if (branch.if && branch.if.flags) {
      const flagMatch = Object.entries(branch.if.flags).every(
        ([k, v]) => ap.flags[k] === v || (v === true && ap.flags[k]) || (v === false && !ap.flags[k])
      );
      if (flagMatch) return branch.next;
    }
    // trust threshold check
    if (branch.if) {
      const tkeys = ['allen_trust','omni_trust','grogu_trust'];
      const trustMatch = tkeys.every(k => {
        if (branch.if[k] === undefined) return true;
        return (ap.flags[k] || 0) >= branch.if[k];
      });
      if (trustMatch && !branch.if.flags) return branch.next;
    }
  }
  return null;
}

// Start story combat
function startStoryCombat(enemyId, winScene, lossScene) {
  if (typeof window.startAdventureCombat === 'function') {
    // Store in ap for reference
    const ap = getAP();
    ap._pendingWin  = winScene;
    ap._pendingLoss = lossScene;
    window.startAdventureCombat(enemyId, winScene, lossScene);
  }
}

// Called after real combat resolves (from endCombatFlow in index.html)
function resolveStoryCombat(won) {
  const ap = getAP();
  const next = won ? (ap._pendingWin || 'day_victory') : (ap._pendingLoss || 'day_defeat');
  ap._pendingWin = null;
  ap._pendingLoss = null;
  advanceToScene(next, {});
}

// Complete today's chapter (reward scenes)
function completeStoryDay(won) {
  const ap = getAP();
  const scene = getCurrentScene();
  if (!scene) return;
  const xp   = (scene.bonusXp   || 0) + (ap.effects.addXp   || 0);
  const gold = (scene.bonusGold || 0) + (ap.effects.addGold || 0);
  if (xp   > 0) window.state.totalXP = Math.max(0, (window.state.totalXP || 0) + xp);
  if (gold > 0) window.state.gold    = Math.max(0, (window.state.gold    || 0) + gold);
  ap.dayCompleted = true;
  ap.lastPlayedDate = new Date().toISOString().split('T')[0];
  if (typeof savePlayerToServer === 'function') savePlayerToServer();
  if (typeof heroTab === 'function' && typeof renderHeroPage === 'function') {
    heroTab('adventure');
    renderHeroPage();
  } else {
    renderAdventureTab();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════

function renderAdventureTab() {
  const el = document.getElementById('heroTabAdventure');
  if (!el) return;
  initAdventureProgress();
  const ap = getAP();

  // Auto-resolve branch scenes
  let safety = 0;
  while (safety++ < 20) {
    const s = getCurrentScene();
    if (!s || s.type !== 'branch') break;
    const next = resolveBranch(s);
    if (!next) break;
    ap.sceneId = next;
  }

  const scene = getCurrentScene();
  if (!scene) { el.innerHTML = '<p>Inget äventyr tillgängligt.</p>'; return; }

  const ch = getCurrentChapter();
  el.innerHTML = renderStoryScene(ch, scene, ap);
}

function renderStoryScene(ch, scene, ap) {
  // Show dice check result if pending
  if (ap._checkResult) return renderCheckResult(ch, ap);

  const header = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <div style="font-size:32px">${ch.icon}</div>
      <div>
        <div style="font-family:var(--font-burst);font-size:13px;letter-spacing:2px;color:var(--ink-muted);text-transform:uppercase;">Dag ${ch.day} av 30</div>
        <div style="font-family:var(--font-burst);font-size:18px;">${ch.title}</div>
        <div style="font-size:11px;color:var(--ink-muted);font-weight:600;">${ch.subtitle}</div>
      </div>
    </div>
    <div style="background:var(--paper-soft);border:1.5px solid var(--paper-dark);border-radius:8px;padding:6px 12px;margin-bottom:14px;display:flex;gap:16px;font-family:var(--font-mono);font-size:11px;font-weight:700;">
      <span>📅 Dag ${ch.day}/30</span>
      <span>🔥 ${ap.flags.allen_trust||0} Allen</span>
      <span>🟢 ${ap.flags.grogu_trust||0} Grogu</span>
      <span>🟡 ${ap.flags.omni_trust||0} Jar Jar</span>
    </div>`;

  if (scene.type === 'narrative') {
    return header + `
      <div class="card" style="margin-bottom:12px;">
        <div style="font-family:var(--font-burst);font-size:14px;letter-spacing:1px;margin-bottom:10px;color:var(--hero-blue-dark);">${scene.title}</div>
        <div style="font-family:var(--font-script);font-size:18px;line-height:1.8;color:var(--ink-soft);">${scene.text}</div>
      </div>
      <button class="btn btn-primary" onclick="advanceStoryScene()">Fortsätt →</button>`;
  }

  if (scene.type === 'choice') {
    window._currentChoices = scene.choices;
    const choicesBtns = scene.choices.map((c,i) => {
      const isCheck = !!c.check;
      const onclick = isCheck ? `initiateCheck(${i})` : `makeStoryChoice(${i})`;
      const diceTag = isCheck ? `<span style="display:inline-block;background:var(--hero-blue);color:white;border-radius:4px;padding:1px 6px;font-size:10px;font-family:var(--font-mono);font-weight:700;margin-left:6px;">🎲 ${c.check.stat} SV${c.check.dc}</span>` : '';
      return `
      <button class="btn" onclick="${onclick}"
        style="background:var(--white);border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink);text-align:left;flex-direction:column;align-items:flex-start;gap:4px;margin-bottom:10px;padding:14px 16px;">
        <span style="font-family:var(--font-burst);font-size:15px;">${c.label}${diceTag}</span>
        <span style="font-family:var(--font-ui);font-size:12px;font-weight:600;color:var(--ink-muted);text-transform:none;">${c.flavor}</span>
      </button>`;
    }).join('');
    return header + `
      <div class="card" style="margin-bottom:12px;">
        <div style="font-family:var(--font-burst);font-size:14px;letter-spacing:1px;margin-bottom:10px;color:var(--hero-blue-dark);">${scene.title}</div>
        <div style="font-family:var(--font-script);font-size:18px;line-height:1.8;color:var(--ink-soft);margin-bottom:16px;">${scene.text}</div>
      </div>
      ${choicesBtns}`;
  }

  if (scene.type === 'combat') {
    const enemy = (typeof STORY_ENEMIES !== 'undefined' ? STORY_ENEMIES[scene.enemyId] : null)
                || (typeof ENEMY_TEMPLATES !== 'undefined' ? ENEMY_TEMPLATES[scene.enemyId] : null)
                || { name: scene.enemyId, icon: '👾' };
    return header + `
      <div class="card" style="border-color:var(--pulse-red-deep);box-shadow:4px 4px 0 var(--pulse-red-deep);background:#FFF0F0;margin-bottom:12px;text-align:center;">
        <div style="font-size:52px;margin-bottom:8px;">${enemy.icon}</div>
        <div style="font-family:var(--font-burst);font-size:20px;margin-bottom:6px;">${enemy.name}</div>
        <div style="font-size:13px;color:var(--ink-muted);font-weight:600;font-family:var(--font-script);font-size:16px;">${scene.text}</div>
      </div>
      <button class="btn btn-red" onclick="startStoryCombat('${scene.enemyId}','${scene.nextOnWin}','${scene.nextOnLoss}')">
        ⚔️ STARTA STRID
      </button>`;
  }

  if (scene.type === 'reward') {
    const won = scene.won;
    const xp = (scene.bonusXp||0) + (ap.effects.addXp||0);
    const gold = (scene.bonusGold||0) + (ap.effects.addGold||0);
    const ap_day = getAP().currentDay;
    const nextDayBtn = ap_day < 30 ? `<button class="btn" onclick="startNextDay();renderAdventureTab();"
      style="background:var(--hero-blue);color:white;border-color:var(--hero-blue-dark);box-shadow:4px 4px 0 var(--hero-blue-dark);margin-top:10px;">
      📅 Dag ${ap_day+1} börjar imorgon
    </button>` : '';
    return header + `
      <div class="card ${won?'green':'red'}" style="text-align:center;padding:24px;margin-bottom:14px;">
        <div style="font-size:52px;margin-bottom:10px;">${won?'🏆':'💀'}</div>
        <div style="font-family:var(--font-burst);font-size:18px;margin-bottom:10px;">${scene.title}</div>
        <div style="font-family:var(--font-script);font-size:17px;line-height:1.8;text-align:left;margin-bottom:16px;">${scene.text}</div>
        ${xp||gold?`<div style="display:flex;gap:12px;justify-content:center;margin-bottom:14px;">
          ${xp?`<div style="background:var(--hero-blue);color:white;border-radius:10px;padding:8px 16px;font-family:var(--font-mono);font-weight:700;">+${xp} XP</div>`:''}
          ${gold?`<div style="background:var(--power-yellow);color:var(--ink);border-radius:10px;padding:8px 16px;font-family:var(--font-mono);font-weight:700;">+${gold} 🪙</div>`:''}
        </div>`:''}
      </div>
      <button class="btn btn-primary" onclick="completeStoryDay(${won})">
        ${won?'🏆 Avsluta dagen':'💀 Avsluta och försök imorgon'}
      </button>
      ${nextDayBtn}`;
  }

  return header + `<div class="card"><p>Scen laddas…</p></div>`;
}

// ═══════════════════════════════════════════════════════════════════════
// OVERVIEW (before starting)
// ═══════════════════════════════════════════════════════════════════════

function renderAdventureOverview() {
  const el = document.getElementById('heroTabAdventure');
  if (!el) return;
  initAdventureProgress();
  const ap = getAP();
  const ch = getCurrentChapter();
  if (!ch) {
    el.innerHTML = `<div class="card green" style="text-align:center;padding:24px;">
      <div style="font-size:52px;">⭐</div>
      <div style="font-family:var(--font-burst);font-size:20px;margin:10px 0;">ARC 1 KLAR!</div>
      <div style="font-family:var(--font-script);font-size:17px;">Soumaya Reborn. Nästa arc kommer snart.</div>
    </div>`;
    return;
  }

  const daysDone = ap.currentDay - 1 + (ap.dayCompleted ? 1 : 0);
  const pct = Math.round((daysDone / 30) * 100);

  el.innerHTML = `
    <div class="card" style="text-align:center;padding:20px;margin-bottom:12px;">
      <div style="font-size:48px;margin-bottom:8px;">${ch.icon}</div>
      <div style="font-family:var(--font-burst);font-size:11px;letter-spacing:2px;color:var(--ink-muted);margin-bottom:4px;">DAG ${ch.day} AV 30</div>
      <div style="font-family:var(--font-burst);font-size:22px;margin-bottom:4px;">${ch.title}</div>
      <div style="font-size:13px;color:var(--ink-muted);font-weight:600;margin-bottom:14px;">${ch.teaser}</div>
      <div style="background:var(--paper-soft);border:2px solid var(--paper-dark);border-radius:20px;padding:3px;margin-bottom:6px;">
        <div style="height:18px;background:linear-gradient(90deg,var(--hero-blue),var(--power-yellow));border-radius:16px;width:${pct}%;min-width:20px;transition:width 1s;"></div>
      </div>
      <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-muted);">${daysDone}/30 dagar klara (${pct}%)</div>
    </div>
    <div class="card paper" style="margin-bottom:12px;">
      <div style="font-family:var(--font-burst);font-size:11px;letter-spacing:1px;color:var(--ink-muted);margin-bottom:8px;">ALLIERADE</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <div style="background:var(--hero-blue);color:white;border-radius:8px;padding:6px 12px;font-family:var(--font-mono);font-size:12px;font-weight:700;">💬 Allen ${ap.flags.allen_trust||0}</div>
        <div style="background:var(--in-range);color:var(--ink);border-radius:8px;padding:6px 12px;font-family:var(--font-mono);font-size:12px;font-weight:700;">🟢 Grogu ${ap.flags.grogu_trust||0}</div>
        <div style="background:var(--pulse-red);color:white;border-radius:8px;padding:6px 12px;font-family:var(--font-mono);font-size:12px;font-weight:700;">🦸 Omni ${ap.flags.omni_trust||0}</div>
      </div>
    </div>
    <button class="btn btn-primary" onclick="renderAdventureTab()">
      ${ap.dayCompleted ? (canStartNewDay() ? '📅 Starta dag '+(ap.currentDay+1) : '✅ Kom tillbaka imorgon') : '⚔️ Fortsätt äventyret'}
    </button>`;
}

// ═══════════════════════════════════════════════════════════════════════
// LEGACY COMPAT (old system functions still needed by index.html)
// ═══════════════════════════════════════════════════════════════════════

function hasPlayedAdventureToday() { return !canPlayToday(); }
function canPlayAdventureToday()   { return canPlayToday(); }
function getCurrentAdventure()     { return getCurrentChapter(); }

function startAdventure() {
  initAdventureProgress();
  const ap = getAP();
  if (ap.dayCompleted && canStartNewDay()) startNextDay();
  renderAdventureTab();
}

function advanceAdventureScene(sceneId, effect) { advanceToScene(sceneId, effect); }

function startAdventureCombat(enemyId, nextOnWin, nextOnLoss) {
  const ap = getAP();
  ap._pendingWin  = nextOnWin;
  ap._pendingLoss = nextOnLoss;
  if (window.state) {
    window.state.activeCombat = {
      isAdventureCombat: true,
      enemyId, nextOnWin, nextOnLoss,
      enemyXpReward: (STORY_ENEMIES[enemyId]||{}).xp || 60,
    };
  }
  // Trigger combat UI if in full app
  if (typeof showCombatPage === 'function') {
    const tpl = (STORY_ENEMIES[enemyId]) || {};
    const enemy = Object.assign({ name:'Fiende', icon:'👾', hp:100, atk:15, def:5 }, tpl);
    window.state.activeCombat.enemy = enemy;
    showCombatPage();
  }
}

function completeAdventure(won) { completeStoryDay(won); }

// After combat ends in the app, call resolveStoryCombat
// (patched into endCombatFlow in index.html)


// ═══════════════════════════════════════════════════════════════════════
// TÄRNINGSSYSTEM — FÖRMÅGASLAG (D&D-STIL)
// ═══════════════════════════════════════════════════════════════════════

const STAT_NAMES = {
  STY: 'Styrka',
  SMI: 'Smidighet',
  KON: 'Kondition',
  INT: 'Intelligens',
};

const STAT_ICONS = {
  STY: '💪',
  SMI: '🏃',
  KON: '❤️',
  INT: '🧠',
};

function getStatModifier(statKey) {
  const stats = (typeof heroStats === 'function') ? heroStats() : { STY:10, SMI:10, KON:10, INT:10 };
  const val = stats[statKey] || 10;
  return Math.floor((val - 10) / 2);
}

function getStatValue(statKey) {
  const stats = (typeof heroStats === 'function') ? heroStats() : { STY:10, SMI:10, KON:10, INT:10 };
  return stats[statKey] || 10;
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function performCheck(stat, dc) {
  const roll    = rollD20();
  const mod     = getStatModifier(stat);
  const val     = getStatValue(stat);
  const total   = roll + mod;
  const success = total >= dc;
  const crit    = roll === 20;
  const fumble  = roll === 1;
  return { roll, mod, val, total, dc, stat, success, crit, fumble };
}

// Called from onclick on a check-choice button
function initiateCheck(choiceIdx) {
  const choices = window._currentChoices;
  if (!choices || !choices[choiceIdx]) return;
  const ch = choices[choiceIdx];
  if (!ch.check) { advanceToScene(ch.next || ch.check?.nextOnSuccess, ch.effect || {}); return; }

  const ap = getAP();
  const result = performCheck(ch.check.stat, ch.check.dc);
  ap._checkResult = {
    ...result,
    nextOnSuccess: ch.check.nextOnSuccess,
    nextOnFailure: ch.check.nextOnFailure || ch.check.nextOnSuccess,
    effect: ch.check.effect || ch.effect || {},
    label: ch.label,
  };
  renderAdventureTab();
}

// Called after showing the result — proceed
function resolveCheck() {
  const ap = getAP();
  const r = ap._checkResult;
  if (!r) return;
  ap._checkResult = null;
  const next = r.success ? r.nextOnSuccess : r.nextOnFailure;
  advanceToScene(next, r.effect);
}

function renderCheckResult(ch, ap) {
  const r = ap._checkResult;
  if (!r) return '';
  const icon = STAT_ICONS[r.stat] || '🎲';
  const statName = STAT_NAMES[r.stat] || r.stat;
  const modStr = r.mod >= 0 ? `+${r.mod}` : `${r.mod}`;
  const barCount = r.roll;
  const diceColor = r.fumble ? 'var(--pulse-red)' : r.crit ? 'var(--power-yellow)' : r.success ? 'var(--in-range)' : 'var(--high)';
  const resultLabel = r.crit ? '🌟 KRITISK TRÄFF!' : r.fumble ? '💀 FUMMEL!' : r.success ? '✅ LYCKAT!' : '❌ MISSLYCKAT';
  const resultColor = r.success ? 'var(--in-range-dark)' : 'var(--pulse-red-deep)';

  // Dice pip display (1-6 shown as actual die face)
  const displayRoll = r.roll;

  const header = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <div style="font-size:32px">${ch.icon}</div>
      <div>
        <div style="font-family:var(--font-burst);font-size:13px;letter-spacing:2px;color:var(--ink-muted);text-transform:uppercase;">Dag ${ch.day} av 30</div>
        <div style="font-family:var(--font-burst);font-size:18px;">${ch.title}</div>
      </div>
    </div>`;

  return header + `
    <div class="card" style="text-align:center;padding:20px;margin-bottom:12px;border-color:${diceColor};box-shadow:4px 4px 0 ${diceColor};">
      <div style="font-family:var(--font-burst);font-size:11px;letter-spacing:2px;color:var(--ink-muted);margin-bottom:12px;">
        ${icon} SLAG FÖR ${statName.toUpperCase()} (SV ${r.dc})
      </div>

      <div style="display:inline-block;background:var(--ink);color:var(--power-yellow);border-radius:16px;padding:12px 28px;margin-bottom:14px;">
        <div style="font-family:var(--font-burst);font-size:56px;line-height:1;letter-spacing:-2px;">${displayRoll}</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:rgba(255,230,0,.7);">D20</div>
      </div>

      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700;margin-bottom:6px;">
        ${displayRoll} <span style="color:var(--ink-muted)">${r.mod >= 0 ? '+ ' : '− '}${Math.abs(r.mod)}</span>
        = <strong>${r.total}</strong>
        <span style="color:var(--ink-muted);">mot SV ${r.dc}</span>
      </div>
      <div style="font-size:11px;color:var(--ink-muted);font-weight:600;margin-bottom:14px;">
        ${statName} ${r.val} ger ${r.mod >= 0 ? '+' : ''}${r.mod} bonus
      </div>

      <div style="font-family:var(--font-burst);font-size:22px;color:${resultColor};">${resultLabel}</div>
      ${r.success ? '' : `<div style="font-size:12px;color:var(--ink-muted);margin-top:4px;font-weight:600;">Konsekvenser väntar…</div>`}
    </div>
    <button class="btn btn-primary" onclick="resolveCheck()">
      ${r.success ? '✅ Fortsätt →' : '💀 Bär konsekvensen →'}
    </button>`;
}

// ═══════════════════════════════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════════════════════════════
if (typeof window !== 'undefined') {
  window.STORY_CHAPTERS       = STORY_CHAPTERS;
  window.STORY_ENEMIES        = STORY_ENEMIES;
  window.initAdventureProgress= initAdventureProgress;
  window.getAP                = getAP;
  window.canPlayToday         = canPlayToday;
  window.startNextDay         = startNextDay;
  window.getChapter           = getChapter;
  window.getCurrentChapter    = getCurrentChapter;
  window.getCurrentScene      = getCurrentScene;
  window.advanceToScene       = advanceToScene;
  window.makeStoryChoice      = makeStoryChoice;
  window.advanceStoryScene    = advanceStoryScene;
  window.startStoryCombat     = startStoryCombat;
  window.resolveStoryCombat   = resolveStoryCombat;
  window.completeStoryDay     = completeStoryDay;
  window.renderAdventureTab   = renderAdventureTab;
  window.renderAdventureOverview = renderAdventureOverview;
  // Legacy
  window.DAILY_ADVENTURES     = STORY_CHAPTERS.filter(Boolean);
  window.getCurrentAdventure  = getCurrentAdventure;
  window.hasPlayedAdventureToday = hasPlayedAdventureToday;
  window.canPlayAdventureToday= canPlayAdventureToday;
  window.startAdventure       = startAdventure;
  window.advanceAdventureScene= advanceAdventureScene;
  window.startAdventureCombat = startAdventureCombat;
  window.completeAdventure    = completeAdventure;
}
