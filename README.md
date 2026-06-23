# Gästehaus Am Hafen – Website

Statische Website für das **Gästehaus Am Hafen**, Spitalgasse 3-4, 88709 Meersburg am Bodensee.

## Seiten

| Datei | Seite |
|---|---|
| `index.html` | Startseite (Willkommen) |
| `zimmer.html` | Zimmerübersicht (alle 3 Kategorien) |
| `hafenschaenke.html` | Die Hafenschänke (Geschichte & Galerie) |
| `buchen.html` | Buchungsanfrage-Formular |
| `kontakt.html` | Kontakt, Anfahrt & Karte |
| `impressum.html` | Impressum, Datenschutz, Stornierung |

## Technischer Stack

- **Reines HTML/CSS/JS** – kein Build-Schritt, keine Abhängigkeiten
- **Fonts**: Google Fonts (Spectral + Figtree) – werden vom Browser geladen
- **Fotos**: liegen im übergeordneten Ordner `../Fotos/` – relativ verlinkt

## Lokale Vorschau

```bash
# Python (überall verfügbar)
cd website/
python3 -m http.server 3000
# → http://localhost:3000

# Node.js (falls installiert)
npx serve .
```

## Deployment

### Netlify (empfohlen)

1. Diesen `website/`-Ordner **zusammen mit dem `Fotos/`-Ordner** auf Netlify hochladen
   - Oder: beide Ordner in ein gemeinsames Verzeichnis packen und als ZIP hochladen
2. Build-Befehl: *(leer lassen)*
3. Publish directory: `website/`

**Wichtig für Netlify Forms**: Das Buchungsformular (`buchen.html`) nutzt aktuell `mailto:`. Für echtes Netlify-Formular-Handling, `<form>` ersetzen durch:
```html
<form name="buchungsanfrage" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="buchungsanfrage">
  <!-- ... restliche Felder gleich ... -->
</form>
```

### Vercel

Gleiche Vorgehensweise wie Netlify. Framework Preset: **Other / Static**.

### IONOS / Strato (klassisches FTP-Hosting)

1. Den Inhalt des `website/`-Ordners per FTP in den Webroot hochladen (z.B. `/htdocs/` oder `/public_html/`)
2. Den `Fotos/`-Ordner **eine Ebene höher** hochladen, sodass er auf dem Server unter `../Fotos/` erreichbar ist

   **Empfehlung**: Beim FTP-Hosting den `Fotos/`-Ordner stattdessen direkt in `website/` kopieren und alle `../Fotos/`-Pfade in den HTML-Dateien auf `Fotos/` ändern.

   Schnell erledigt mit:
   ```bash
   # Fotos-Ordner in website/ kopieren (einmalig)
   cp -r "../Fotos" ./fotos
   
   # Pfade in allen HTML-Dateien anpassen
   sed -i '' 's|\.\./Fotos/|fotos/|g' *.html
   ```

### Kontaktformular konfigurieren

Das Formular nutzt derzeit `action="mailto:amhafen@freenet.de"` als einfachen Fallback.

**Für Netlify**: Netlify Forms (siehe oben) – kostenlos bis 100 Einreichungen/Monat.

**Für alle anderen Hosts**: Formspree.io (kostenloser Plan verfügbar):
1. Account bei [formspree.io](https://formspree.io) anlegen
2. Form-Endpoint erhalten (z.B. `https://formspree.io/f/xabc1234`)
3. In `buchen.html` und `kontakt.html` ersetzen:
   ```html
   <!-- alt -->
   <form action="mailto:amhafen@freenet.de" method="POST" enctype="text/plain">
   
   <!-- neu -->
   <form action="https://formspree.io/f/IHRE-ID" method="POST">
   ```

## Fotos

Die Fotos liegen im Ordner `../Fotos/` (eine Ebene über dem `website/`-Ordner).

Für den produktiven Einsatz empfehlen wir:
- **Maximale Breite**: 1920px
- **JPEG-Qualität**: 80–85%
- **HEIC-Konvertierung** (macOS): `sips -s format jpeg bild.HEIC --out bild.jpg`

## Kontakt / Anpassungen

- **Preise ändern**: In `zimmer.html` und `buchen.html` direkt im HTML anpassen
- **Saison ändern**: Suche nach "April bis" in allen HTML-Dateien
- **Telefon/E-Mail ändern**: Suche nach "amhafen@freenet.de" und "07532" in allen HTML-Dateien
