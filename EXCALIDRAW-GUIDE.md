# 🎨 Excalidraw Visualizations — Edit Guide

Anleitung wie du die Excalidraw SVG-Dateien bearbeiten und aktualisieren kannst.

---

## 📋 SVG Dateien im Projekt

| Datei | Ort | Nutze |
|-------|-----|-------|
| **README-HERO.svg** | `README.md` | System overview, Scrum Team flow |
| **BENEFITS-BEFORE-AFTER.svg** | `BENEFITS.md` | Before/After comparison |
| **ARCHITECTURE-SYSTEM.svg** | `ARCHITECTURE-VISUAL.md` | System architecture |

---

## 🔧 Wie man SVGs bearbeitet

### Option 1: Online Editor (Recommended)

```
1. Gehe zu → https://excalidraw.com
2. Datei → "Open"
3. Wähle README-HERO.svg von deinem Computer
4. Bearbeite die Diagramme
5. Speichern → Download als SVG
6. Ersetze die alte Datei im Repository
```

**Vorteile:**
- ✅ WYSIWYG Editor
- ✅ Keine Installation nötig
- ✅ Alle Features verfügbar
- ✅ Exportiert saubere SVGs

---

### Option 2: Lokal mit VS Code

Falls du den VS Code Excalidraw Plugin nutzen möchtest:

```bash
# VS Code Extension installieren
# Extension: "Excalidraw"

# Dann einfach .svg Datei öffnen und bearbeiten
```

---

## ✏️ Was du bearbeiten kannst

### README-HERO.svg
```
Scrum Team Illustration (links):
├─ Product Owner (Farbe: Blau)
├─ Developer (Farbe: Grün)
├─ Scrum Master (Farbe: Orange)
└─ Text/Labels anpassen

Workflow Flow (Center):
├─ Phase Boxes
├─ Arrows
├─ Phase Labels
└─ Status Labels

Benefits (Bottom):
└─ Messungen anpassen
```

### BENEFITS-BEFORE-AFTER.svg
```
Left (Before):
├─ Rote Boxen (Chaotisch)
├─ Red arrows (Probleme)
└─ Fehler/Risiken Illustrationen

Right (After):
├─ Grüne Boxen (Sauber)
├─ Green arrows (Erfolg)
└─ Benefits Illustrationen
```

### ARCHITECTURE-SYSTEM.svg
```
Top: Scrum Team Rollen
├─ PO, Developer, SM, AI

Middle: Workflow Phases (1-6)
├─ Phase Boxes
├─ Status Übergänge
└─ Phase Beschreibungen

Bottom: Supporting Systems
├─ AI Agents
├─ Documentation
├─ Artifacts
└─ Output folder
```

---

## 🎨 Style Guide (für Konsistenz)

### Farben
```
Blau      #bbdefb, #1976d2  (PO, Input)
Grün      #c8e6c9, #388e3c  (Dev, Success)
Orange    #ffe0b2, #f57c00  (SM, Review)
Pink      #f8bbd0, #c2185b  (AI, Special)
Purple    #f3e5f5, #7b1fa2  (Refine, Analysis)
Yellow    #fff9c4, #f9a825  (Approval, Output)
```

### Schriftart
- Titel: Bold, 14-18pt
- Labels: Bold, 11-13pt
- Details: Regular, 9-11pt
- **Alle Labels auf English!**

### Shapes
- Team/Role Boxes: 220x80 (rounded rect)
- Phase Boxes: 150x100 (rounded rect)
- Support Boxes: 180-200x70 (rounded rect)
- Arrows: 2-3pt Stroke, mit Arrowheads

---

## 🔄 Workflow: Datei bearbeiten

### Schritt 1: Datei öffnen
```
excalidraw.com → Open → README-HERO.svg
```

### Schritt 2: Bearbeiten
- Boxen verschieben, resizen, Farbe ändern
- Text editieren
- Arrows anpassen
- Neue Elemente hinzufügen (aber Konsistenz bewahren!)

### Schritt 3: Speichern & Exportieren
```
File → Export as SVG → Download
```

### Schritt 4: Repository aktualisieren
```bash
# Alte Datei ersetzen
mv ~/Downloads/README-HERO.svg ./README-HERO.svg

# Committen
git add README-HERO.svg
git commit -m "docs: Update README hero diagram"
git push
```

---

## ⚠️ Wichtige Regeln (nicht brechen!)

### ✅ Darf man tun
- Text ändern/übersetzen (English behalten!)
- Farben anpassen (aber Farbschema konsistent halten)
- Shapes resizen/verschieben
- Arrows hinzufügen/löschen
- Details ergänzen
- Labels updaten

### ❌ Sollte man nicht tun
- **Nicht zu viel Text hinzufügen** (Überlastung)
- **Nicht Mermaid-style verwenden** (bleibt SVG/Hand-drawn)
- **Nicht zu viele neue Shapes** (Komplexität)
- **Nicht auf Deutsch** (English ist Standard)
- **Nicht Farben mischen** (Konsistenz halten)

---

## 🎯 Best Practices

### Design-Prinzipien
1. **Einfachheit** — Nicht zu viel auf einmal
2. **Konsistenz** — Farben, Schriftarten, Shapes
3. **Klarheit** — Beschriftungen sind deutlich
4. **English** — Alle Labels auf English
5. **Weiße Raum** — Nicht überladen

### Checklist vor Commit
- [ ] Alle Text auf English?
- [ ] Farben konsistent?
- [ ] Lesbar in GitHub Preview?
- [ ] SVG ist klein (<100KB)?
- [ ] Keine Syntax-Fehler?
- [ ] Funktioniert auf Mobile?

---

## 📊 Größen-Richtlinien

| Element | Größe | Beispiel |
|---------|-------|---------|
| SVG Canvas | 1200-1400 x 500-800 | Skaliert auf Bildschirm |
| Titel Text | 28-32pt | "Scrum Workflow..." |
| Section Header | 18pt | "Phase X" |
| Box Label | 12-13pt | Phase Namen |
| Detail Text | 10-11pt | Beschreibungen |
| Min Box | 140x60 | Klein aber lesbar |
| Max Box | 220x100 | Groß aber nicht zu viel |

---

## 🆘 Probleme & Lösungen

### Problem: SVG wird nicht geladen
**Lösung:** Check Dateigröße. Falls >200KB → vereinfachen und neuen Export machen.

### Problem: Text ist zu klein
**Lösung:** Fontsize erhöhen (mindestens 9pt) oder Box größer machen.

### Problem: Farben sehen merkwürdig aus
**Lösung:** Verwende die Standard-Farben aus "Style Guide" oben.

### Problem: GitHub rendert SVG komisch
**Lösung:** 
1. Datei herunterladen & neu als SVG exportieren
2. Oder: Einfach Refresh im Browser (F5)

---

## 📚 External Resources

- **Excalidraw Editor:** https://excalidraw.com
- **Excalidraw Library:** https://libraries.excalidraw.com
- **SVG Best Practices:** https://www.smashingmagazine.com/2014/11/styling-and-animating-svgs-with-css/
- **Farben-Palette:** Use the colors from "Style Guide" section above

---

## 🔗 Verlinkte Dateien

Diese SVGs sind embedded in:
- `README.md` — Line with image tag
- `BENEFITS.md` — Line with image tag  
- `ARCHITECTURE-VISUAL.md` — Line with image tag

Falls du Dateinamen änderst, musst du auch die Links in den Markdown-Dateien updaten!

```markdown
# Alt
![Scrum Workflow Overview](./README-HERO.svg)

# Neu
![Scrum Workflow Overview](./NEW-FILENAME.svg)
```

---

## 🎓 Tutorial: Kleine Änderung durchführen

**Beispiel: Text in README-HERO.svg ändern**

```
1. Gehe zu https://excalidraw.com
2. Open → README-HERO.svg
3. Klicke auf den Text "Scrum Workflow: Spec-First AI Development"
4. Edit → Ändere zu "Mein neuer Text"
5. File → Export as SVG
6. Download und speichern als README-HERO.svg
7. git commit -m "docs: Update README hero title"
8. git push
9. GitHub zeigt neue Version (evtl. Cache clearen)
```

---

## ✅ Checkliste: Nach jeder Änderung

- [ ] GitHub Preview zeigt SVG korrekt?
- [ ] Alle Labels auf English?
- [ ] Dateigröße unter 100KB?
- [ ] SVG hat keine Syntax-Fehler?
- [ ] Links in Markdown passen noch?
- [ ] Responsive auf Mobile?
- [ ] Commit Message beschreibt Änderung?

---

**Viel Spaß beim Bearbeiten!** 🎨

Fragen? Siehe [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md)

---

**Version:** 1.2.0  
**Last Updated:** 2026-04-09
