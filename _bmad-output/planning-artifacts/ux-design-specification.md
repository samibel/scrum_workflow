---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
status: complete
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - docs/architecture-cli-installer.md
  - docs/vision/ROADMAP.md
  - docs/project-overview.md
  - docs/development-guide.md
  - scrum_workflow/workflows/project-context.md
focusArea: Installation Flow
completedAt: 2026-04-06
---

# UX Design Specification scrum_workflow

**Author:** Sami
**Date:** 2026-04-06

---

## Executive Summary

### Project Vision
**Ein npx-Befehl. Fertig.**
Der Installation Flow für scrum_workflow folgt dem Prinzip maximaler Einfachheit: Ein Developer führt einen Befehl aus, und das Framework funktioniert sofort. Keine Konfigurationsdialoge, keine Entscheidungen, keine Dokumentation nötig.

### Target Users
**Solo Developers** mit AI-Assistenten:
- Wollen sofort produktiv sein, nicht Tools konfigurieren
- Haben keine Geduld für komplexe Setups
- Erwarten "Just Works"-Erlebnis (wie `create-next-app`)
- Nutzen CLI täglich — Standards sind bekannt

### Key Design Challenges
1. **Reduktion auf das Minimum** — Jede Entscheidung, die der User treffen muss, ist ein Friction Point
2. **Automatische Plattform-Erkennung** — Keine manuelle Auswahl, das System weiß wo es ist
3. **Sofortiger Value** — Nach Installation: "Was kann ich jetzt tun?" muss offensichtlich sein

### Design Opportunities
1. **Zero-Config Default** — `npx create-scrum-workflow` ohne Flags = komplette Installation
2. **One-Line Success** — Nach der Installation eine einzige, klare Success-Message mit dem ersten Command
3. **Progressive Disclosure** — Advanced Options (`--platform`, `--depth`) nur für Power User

## Core User Experience

### Defining Experience
**Ein Befehl. Null Fragen. Sofort einsatzbereit.**
Die Core Experience ist die Ausführung von `npx create-scrum-workflow` — danach ist das Framework nutzbar.

### Platform Strategy
- **Primary:** CLI / Terminal
- **Input:** Keyboard only
- **Output:** Text mit farbiger Status-Anzeige
- **Modes:** Interactive (Default) + Non-Interactive (`--yes`)

### Effortless Interactions
1. Auto-Detection der AI-Plattform (Claude Code, Cursor, Windsurf, etc.)
2. Default-Verzeichnis = Current Working Directory
3. Skill-Registrierung passiert transparent
4. Success-Message enthält ersten nutzbaren Command

### Critical Success Moments
| Moment | User Reaction |
|--------|---------------|
| Command ausgeführt | "Läuft." |
| "Done" message | "Hat funktioniert." |
| First Command Hint | "Probier ich aus." |

### Experience Principles
1. **One Command, Zero Questions** — Keine Entscheidungen im Default-Flow
2. **Visible Progress** — Jeder Schritt ist kommuniziert
3. **Instant Next Step** — Success = Call-to-Action
4. **Fail Fast, Fail Clear** — Fehler mit Lösung, nicht nur Error-Code

## Design System Foundation

### Design System Choice
**CLI-Native** — Terminal only, colors, formatting, icons

### Rationale
- **Zero UI overhead** — Terminal-only, kein visueller Overhead
- **No separate build step** — npm pack läuft direkt
- **Terminal aesthetic** — Farben, Spinner, Emojis fühlen sich nativ an
- **Familiar patterns** — Grün=Success, Rot=Error, Gelb=Warning Konventionen

### Implementation Approach
- Pure CLI using npm package (`create-scrum-workflow`)
- Templates copied to `.claude/skills/` directory
- Skill shims registered with path substitution (`{{framework_path}}`)
- Lock file created (`.scrum-workflow-lock.json`)

### Customization Strategy
- **Manual override**: `--depth light/standard` available immediately
- **Automatic classification** (Phase 4): Adaptive workflow depth based on story risk
- **Configuration**: Risk thresholds, agent types, configurable in `config.yaml`
- **Progressive disclosure**: Advanced options hidden by default

## Visual Design Foundation

### Color System
| Type | Color | Example |
|------|-------|---------|
| **Success** | Green | `✓ Installation complete!` |
| **Warning** | Yellow | `⚠ Node.js 18+ required` |
| **Error** | Red | `❌ Permission denied` |
| **Info** | Cyan | `ℹ Auto-detected platform: claude-code` |

### Typography System
- **Primary font:** Monospace (terminal default)
- **No custom fonts** — uses terminal's native font
- **Emphasis:** Colors, not font weights
- **Layout:** Single column, left-aligned

### Layout Foundation
- **Single column** — full terminal width
- **Minimal padding** — compact output
- **Logical grouping** — sections separated by blank lines
- **No responsive design** — terminal width is fixed by user

## Component Strategy

### Terminal Components
- **Output messages** — success/error/warning/info
- **Progress indicators** — spinners, checkmarks
- **Interactive prompts** — confirmation dialogs, input requests

### Implementation Strategy
- Use picocolors for terminal colors
- ASCII art for visual interest (minimal)
- Clear, concise messaging
- Immediate actionable feedback

## User Journey Flows

### Installation Flow
```
User types command → npm pack → Platform Detection → Templates copied → 
Skill Shims registered → Lock File created → Success message displayed → 
User sees next step
```

### Journey Pattern
**Linear Success Flow** — Single command, immediate feedback, clear next step

## UX Consistency Patterns

### Output Patterns
| Type | Color | Emoji | Example |
|------|------|-------|---------|
| **Success** | Green | ✓ | `✓ Installation complete!` |
| **Warning** | Yellow | ⚠ | `⚠ Node.js 18+ required` |
| **Error** | Red | ❌ | `❌ Permission denied` |
| **Info** | Cyan | ℹ | `ℹ Auto-detected platform: claude-code` |

### Progress Patterns
| Stage | Pattern | Example |
|-------|---------|---------|
| **Running** | Spinner | `◐ Installing dependencies...` |
| **Complete** | Checkmark | `✓ Dependencies installed` |
| **Failed** | X mark | `✗ Installation failed` |

### Interaction Patterns
| Pattern | When | Example |
|---------|------|---------|
| **Confirmation** | Destructive actions | `? This will overwrite existing files. Continue? (y/N)` |
| **Prompt** | Missing info | `? Project name: (my-project)` |
| **Selection** | Multiple options | `? Select platform: (1) Claude Code, (2) Cursor` |

### Consistency Rules
- **Single line per message** — Each message on one line
- **Prefix + emoji** — Status indicator first, then message
- **Color coding** — Semantic colors consistently applied
- **Actionable next step** — Success messages include what to do next

## Responsive Design & Accessibility

### Responsive Strategy
**Terminal-Only** — No responsive design needed. CLI output uses full terminal width.

### Accessibility Strategy
| Focus Area | Requirement |
|------------|-------------|
| **Color Contrast** | 4.5:1 minimum — Terminal default themes support high contrast |
| **Keyboard Navigation** | ✓ Tab completion, ✓ Arrow keys |
| **Screen Readers** | ✓ Compatible — text-based output |
| **Touch Targets** | N/A — CLI interface |

### Testing Strategy
- Manual testing in terminal
- Color blindness testing with different terminal themes
- Keyboard-only navigation verification
- Real device testing across terminal emulators

### Implementation Guidelines
- Use picocolors for semantic colors
- ASCII art for visual elements
- Clear, concise messaging
- Consistent emoji prefixes
