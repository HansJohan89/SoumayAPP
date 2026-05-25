# Soumaya — Hälsoapp med Grogu, Allen & Butcher

## Snabbstart (lokalt, t.ex. på din dator i hemmet)

```bash
# 1. Installera beroenden
npm install

# 2. Starta servern
node server.js

# 3. Öppna i webbläsare
#    https://localhost:3443
#    (Godkänn self-signed cert: Avancerat → Fortsätt ändå)
```

Första gången genereras ett self-signed certifikat automatiskt av `https-localhost`.  
HTTPS krävs för att Service Worker och Web Push ska fungera.

---

## Installera som app på telefon

**Android (Chrome):**
1. Öppna `https://din-server:3443` i Chrome
2. Tryck på menyn (⋮) → "Lägg till på startskärmen"
3. Klicka "Installera"

**iPhone (Safari):**
1. Öppna `https://din-server:3443` i Safari
2. Tryck på dela-ikonen (fyrkant med pil upp)
3. Välj "Lägg till på hemskärmen"

---

## xDrip+ anslutning

1. Öppna xDrip+ på Soumayas telefon
2. Gå till: Inställningar → Mellankommunikation → Aktivera webbtjänst
3. Notera IP-adressen som visas (t.ex. `http://192.168.1.x:17580`)
4. I appen: tryck på "Socker"-fliken → ange URL → "Anslut"

---

## På riktig server med domän (för push-notiser utanför hemnätet)

```bash
# Installera certbot
sudo apt install certbot
sudo certbot certonly --standalone -d dindomän.se

# Redigera server.js — se kommentaren längst ner i filen
# Byt ut https-localhost-blocket mot Let's Encrypt-certifikat

# Kör med PM2 för auto-restart
npm install -g pm2
pm2 start server.js --name soumaya
pm2 startup && pm2 save
```

---

## Filer

| Fil | Beskrivning |
|-----|-------------|
| `index.html` | Hela appen (PWA, all logik) |
| `server.js` | HTTPS-server + Web Push API |
| `sw.js` | Service Worker (offline + push) |
| `manifest.json` | PWA-manifest |
| `subscriptions.json` | Push-subscriptions (skapas automatiskt) |

---

## Testa push-notiser manuellt

```bash
curl -X POST https://localhost:3443/api/push \
  -H "Content-Type: application/json" \
  -d '{"title":"Test från Butcher","body":"Oi, det funkar!","tag":"test"}'
```
