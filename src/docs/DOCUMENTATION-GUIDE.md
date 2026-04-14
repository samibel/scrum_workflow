# 📚 Dokumentation Guide

Übersicht aller Dokumente im Scrum Workflow Project und was sie enthalten.

---

## Wo fang ich an?

| Situation | Dokument | Zeit |
|-----------|----------|------|
| **Neu im Project** | [GETTING-STARTED.md](./GETTING-STARTED.md) | 15 min |
| **Vorteile verstehen** | [BENEFITS.md](./BENEFITS.md) | 10 min |
| **Commands schnell lernen** | [WORKFLOW-QUICK-REFERENCE.md](./WORKFLOW-QUICK-REFERENCE.md) | 5 min |
| **Architecture verstehen** | [ARCHITECTURE-VISUAL.md](./ARCHITECTURE-VISUAL.md) | 20 min |
| **Vollständige Referenz** | [README.md](../../README.md) | 30 min |
| **Alle Dokumente finden** | [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md) | 10 min |
| **Entwickler/Contributer** | [docs/development-guide.md](./development-guide.md) | 45 min |

---

## 📖 Dokumenten-Struktur

### Wurzel-Ebene (root `/`)

Für schnellen Überblick und Erste Schritte:

| Datei | Zielgruppe | Inhalt |
|-------|-----------|--------|
| **README.md** | Alle | Feature-Übersicht, Installation, Commands, Design Principles |
| **GETTING-STARTED.md** (NEU) | Product Owner, Entwickler | Schritt-für-Schritt Anleitung (15 min) |
| **DOCUMENTATION-GUIDE.md** (NEU) | Alle | Dieses Dokument — Deine Dokumentations-Map |
| **PACKAGE.json** | Entwickler | Dependencies, Scripts, Versions |
| **.gitignore** | Alle | Git Ignorieren-Regeln |

---

### Framework-Dokumentation (`/docs`)

Technische Deep-Dives für Entwickler und Architekten:

| Datei | Zielgruppe | Inhalt |
|-------|-----------|--------|
| **index.md** | Alle | Master-Index aller Dokumetation |
| **project-overview.md** | Tech Lead, Architect | Executive Summary, Tech Stack, Architektur-Überblick |
| **source-tree-analysis.md** | Developer, Architect | Annotierte Verzeichnis-Struktur, File-by-File Erklärung |
| **development-guide.md** | Developer | Lokale Setup, Dev-Workflow, Testing, Debugging |
| **architecture-framework.md** | Architect, Developer | Workflow Engine, State Machine, Extension Points |
| **architecture-cli-installer.md** | Developer | CLI Design, Installation Flow, Plattform-Support |
| **integration-architecture.md** | Architect, Developer | Wie CLI ↔ Framework kommunizieren, Lock Files |

---

### Workflow-Definition (`/scrum_workflow`)

Die tatsächliche Implementation (read-only during execution):

#### Agents (`/agents`)

Definition der 3 spezialisierte AI Agents:

| Agent | Datei | Rolle |
|-------|-------|-------|
| **Architect** | `architect.md` | Prüft Architektur, Security, Skalierung |
| **Developer** | `developer.md` | Prüft Machbarkeit, Dependencies, Komplexität |
| **QA** | `qa.md` | Prüft Testbarkeit, Akzeptanzkriterien |

**Wo nutzen:** Automatisch in `/scrum-refine-ticket`

#### Commands (`/commands`)

20 Workflow-Befehle (jede Datei = ein Befehl):

```
create-ticket.md         — /scrum-create-ticket
refine-ticket.md         — /scrum-refine-ticket
refine-story.md          — /scrum-refine-story
dev-story.md             — /scrum-dev-story
review-story.md          — /scrum-review-story
approve.md               — /scrum-approve
...15 weitere Commands
```

[Alle Commands ansehen](../../src/core/commands/README.md)

#### Templates (`/templates`)

Output-Templates für Story-Dateien:

| Template | Zweck |
|----------|-------|
| **story.md** | Story-Struktur (Frontmatter + Akzeptanzkriterien) |
| **plan.md** | Execution Plan (Subtasks, Dependencies) |
| **approval.md** | Human Approval Record |
| **context-*.md** | Context Templates für verschiedene Rollen |

#### Context (`/context`)

Standards, Richtlinien, Best Practices:

| File | Inhalt |
|------|--------|
| **index.md** | Domain Context Discovery Index |
| **standards.md** | Code Standards, Naming Conventions |
| **architecture-guidelines.md** | Architecture Patterns, Design Principles |
| **platform-adapter-contract.md** | Platform Integration Contract |

#### Skills (`/skills`)

Spezielle Fähigkeiten für Agents:

| Skill | Zweck |
|-------|-------|
| **readiness-check/** | Validiert Story gegen 5 Kriterien |
| **synthesis/** | Kombiniert Multi-Agent Perspektiven |
| **feedback-collection/** | Sammelt Feedback von Agents |

#### Data (`/data`)

Referenzdaten:

| File | Inhalt |
|------|--------|
| **estimation-scale.yaml** | Story Point Scale (1-21) |
| **severity-levels.yaml** | Bug/Issue Severity Levels |

#### Config (`config.yaml`)

Framework-Konfiguration (global):

```yaml
platform: claude-code          # Deine Plattform
active_agents: [architect, developer, qa]
token_budgets:                 # Token limits pro Agent
refinement_max_rounds: 3       # Max Cross-Talk Runden
estimation_variance_threshold: 2
security_auto_blocker: true    # Security = Blocker
```

---

### Generated Output (`/_scrum-output`)

Automatisch generierte Artifacts (während Workflow):

```
_scrum-output/
├── context/                    # Projektkontext
│   ├── project-context.md      # (von /scrum-create-project-context)
│   └── domain-skills.md
│
├── docs/                       # Auto-generierte Dokumentation
│   ├── architecture.md         # (von /scrum-create-architecture-docs)
│   └── business-logic.md       # (von /scrum-create-project-docs)
│
├── skills/                     # Domain-spezifische Skills
│   ├── skill-1.md             # (auto-generiert für dein Project)
│   └── skill-2.md
│
└── sprints/                    # Story-Artifacts
    ├── SW-001/
    │   ├── story.md           # Deine Story-Spezifikation
    │   ├── refinement.md      # Multi-Agent Analyse
    │   ├── plan.md            # Execution Plan
    │   ├── review-1.md        # Code Review Findings
    │   └── approval.md        # Human Approval
    │
    ├── SW-002/
    │   └── (gleiche Struktur)
    │
    └── SW-003/
```

---

### CLI Installer (`/create-scrum-workflow`)

Dokumentation für den Installer:

| Datei | Inhalt |
|-------|--------|
| **README.md** | CLI Usage und Options |
| **PLATFORM-VALIDATION.md** | Plattform-Detection und Validation |
| **breaking-changes.md** | Migration Guide (wenn vorhanden) |

**Wo nutzen:** Zum Installieren und Updaten des Frameworks

---

## 🗺️ Dokumenten Navigation by Use Case

### Use Case: "Ich bin neu — wie fang ich an?"

```
GETTING-STARTED.md          ← Start hier (15 min)
├── Phase 1: Installation
├── Phase 2: Projekt initialisieren
├── Phase 3: Erste Story
├── ...
└── Links zu weiterer Dokumentation
```

### Use Case: "Ich brauche Command Referenz"

```
README.md (Commands Section)
├── /scrum-create-ticket
├── /scrum-refine-ticket
├── /scrum-refine-story
└── ...20 Commands total
```

Oder detailliert:
```
scrum_workflow/commands/README.md
└── Alle 20 Commands mit Beispielen
```

### Use Case: "Ich muss einen Bug fixen in der Framework"

```
docs/development-guide.md         ← Setup & Workflow
├── Local Setup
├── Running Tests
├── Debugging
└── Pull Request Process

+

docs/source-tree-analysis.md      ← Wo sind die Dateien?
├── /create-scrum-workflow Struktur
└── /scrum_workflow Struktur

+

docs/architecture-*.md            ← Wie funktioniert es?
├── architecture-cli-installer.md
├── architecture-framework.md
└── integration-architecture.md
```

### Use Case: "Ich muss einen Agent anpassen"

```
scrum_workflow/agents/
├── architect.md           ← Agent Definition
├── developer.md
└── qa.md

+

docs/architecture-framework.md     ← Agent Pattern Erklärung
```

### Use Case: "Ich möchte einen neuen Command hinzufügen"

```
docs/architecture-framework.md     ← Workflow Engine Erklärung
├── Command Pattern
├── State Machine
└── Extension Points

+

scrum_workflow/commands/README.md  ← Existing Commands als Template

+

scrum_workflow/commands/create-ticket.md  ← Command Example
```

---

## 📊 Dokumenten Statistik

| Kategorie | Anzahl | Details |
|-----------|--------|---------|
| **Quick Start** | 2 | README.md, GETTING-STARTED.md |
| **Framework Docs** | 7 | In `/docs/` |
| **CLI Docs** | 3 | In `/create-scrum-workflow/` |
| **Command Definitions** | 20 | In `/scrum_workflow/commands/` |
| **Agent Definitions** | 3 | In `/scrum_workflow/agents/` |
| **Context/Standards** | 4 | In `/scrum_workflow/context/` |
| **Skills** | 3 | In `/scrum_workflow/skills/` |
| **Output Templates** | 7 | In `/scrum_workflow/templates/` |
| **Total** | **49** | Vollständige Dokumentation |

---

## 🔄 Dokumenten Maintenance

### Wer aktualisiert welche Docs?

| Dokumentation | Maintainer | Häufigkeit |
|---|---|---|
| README.md | Tech Lead | Bei Major Release |
| GETTING-STARTED.md | Tech Writer | Bei UI/UX Change |
| /docs/* | Architect | Bei Feature Add |
| /scrum_workflow/commands/* | Developer | Bei Command Change |
| /scrum_workflow/agents/* | Developer | Bei Agent Logic Change |
| /_scrum-output/* | Auto-generated | Bei Story Execution |

### Versionierung

- **Framework Version:** `scrum_workflow/package.json` → `version` field
- **CLI Version:** `create-scrum-workflow/package.json` → `version` field
- **Documentation:** `README.md` → "**Last Updated:**" at bottom

---

## 💡 Tips für beste Dokumenten-Nutzung

1. **Bookmarks setzen:**
   - [README.md](../../README.md) — Overall Reference
   - [GETTING-STARTED.md](./GETTING-STARTED.md) — New Onboarding
   - [docs/index.md](./index.md) — Master Index

2. **Search-Shortcuts:**
   - `Ctrl+F` (oder `Cmd+F`) in Markdown Viewer
   - Suche nach Command-Namen (z.B., `scrum-dev-story`)

3. **Offline Access:**
   - Alle Docs sind Markdown (kein Internet nötig)
   - Git clone für lokale Referenz

4. **PDF Export:**
   ```bash
   # Wenn du PDFs brauchst
   pandoc README.md -o README.pdf
   ```

---

## ❓ FAQ zur Dokumentation

### F: Welches Dokument sollte ich zuerst lesen?
**A:** 
- **Neu?** → `GETTING-STARTED.md` (15 min)
- **Vollständige Referenz?** → `README.md`
- **Entwicklung?** → `docs/development-guide.md`

### F: Sind die Docs up-to-date?
**A:** Ja! Check "Last Updated" am Ende jedes Docs. Wenn älter als 2 Wochen, könnte es veraltet sein.

### F: Kann ich Docs editieren?
**A:** Ja! Pull Request erstellen mit Verbesserungen. Format: Markdown + GitFlavor.

### F: Wo sind Beispiele?
**A:** 
- Quick Start: `README.md`, `GETTING-STARTED.md`
- Command Examples: `/scrum_workflow/commands/*.md`
- Agent Examples: `/scrum_workflow/agents/*.md`

---

## 🚀 Next Steps

1. ✓ Dieses Guide durchlesen (5 min)
2. ✓ [GETTING-STARTED.md](./GETTING-STARTED.md) für Erste Schritte (15 min)
3. ✓ [README.md](../../README.md) für Vollständige Referenz (10 min)
4. ✓ Projekt initialisieren: `/scrum-create-project-context`

---

**Version:** 1.2.0  
**Last Updated:** 2026-04-09  
**Master Index:** [docs/index.md](./index.md)
