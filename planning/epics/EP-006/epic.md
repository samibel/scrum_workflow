---
schema_version: "1.0.0"
epic_id: "EP-006"
parent_brief: "PB-001"
title: "Platform Adapter Hardening"
status: planned
epic_index: "6/11"
story_count_estimate: 3
domain_tags: ["platform", "cli"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — High #4 'Plattform-Kompatibilität spekulativ' + Review B — Skill-Modell-Vergleich"
---

# Platform Adapter Hardening

## Purpose

Die aktuelle Plattform-Registry behandelt z. B. `.github/skills` als „GitHub Copilot Skill Target". GitHub Copilot unterstützt aber `repository custom instructions`, **nicht** das Claude-Code-Skill-Modell. Review A formuliert die Schwachstelle hart: „Cross-platform skills klingt gut, aber Claude Code Skills, Cursor rules, GitHub Copilot instructions und Codex AGENTS.md sind nicht austauschbar. Nutzer erwarten gleiche Funktion, bekommen aber inkonsistentes Verhalten."

Dieses Epic schafft Ehrlichkeit: pro Plattform ein eigener Adapter mit explizit dokumentierter Capability-Matrix, plattformspezifische Generatoren statt naiver `target_dir`-Copy-Operation, und entfernte irreführende Claims im README.

## User Value

- **Tech Lead, der scrum_workflow für sein Team evaluiert**: erfährt vor der Installation ehrlich, welche Features auf welcher Plattform funktionieren — keine Überraschungen.
- **Platform Engineer**: kann Adapter pro Plattform pflegen ohne im selben Generator-Code Sonderfälle anhäufen zu müssen.
- **Nicht-Claude-Code-Nutzer**: bekommen ein für ihre Plattform sinnvolles Output (z. B. komprimierte Cursor-Rule statt fehlplatziertem Claude-Skill-Folder).

## Scope

### In-Scope

- Capability-Audit pro Plattform: Claude Code, Cursor, Windsurf, GitHub Copilot, Codex
- Capability-Matrix-Dokument `docs/platforms/capability-matrix.md`
- Plattformspezifische Generatoren in `src/cli/scripts/adapters/` (statt einheitlicher Copy-Logik)
  - Claude Code → Skills + Slash Commands + Subagents nativ
  - Cursor → komprimierte Rules (single file, kein Lifecycle)
  - Copilot → `repository custom instructions` (kein Skill-Modell, kein Lifecycle)
  - Codex → `AGENTS.md`
  - Windsurf → Rules + Memories
- Ehrliche Claims im Root-`README.md`: Plattform-Feature-Matrix
- Install-Zeit-Warnings: bei Installation auf Plattform X Warnung über fehlende Features
- Entfernen irreführender Pfade (`.github/skills` als „Copilot Skill" → relabeln oder entfernen)

### Out-of-Scope

- Implementation eines Skill-Lifecycle-Backports für Plattformen ohne native Unterstützung (z. B. Cursor: Lifecycle aus Skill simulieren)
- Auto-Detection der Zielplattform (Nutzer wählt explizit)
- Plattform-spezifische Test-Suites pro Adapter (kommt mit EP-008 generell)
- Cross-Plattform-Sync (Skill X muss in allen Plattformen identisch sein) — Out-of-Scope by Design

## Acceptance Criteria (Epic-Level)

- **Given** eine Capability-Matrix für 5 Plattformen, **when** ein Nutzer `npx create-scrum-workflow --platform=copilot` ausführt, **then** zeigt der Installer eine Liste der NICHT unterstützten Features (z. B. „kein Skill-Lifecycle, keine Subagents, keine Hooks").
- **Given** der neue plattformspezifische Generator, **when** auf Cursor installiert wird, **then** entsteht eine konsolidierte `.cursorrules`-Datei statt eines Skill-Folder-Trees.
- **Given** das aktualisierte README, **when** ein neuer Nutzer es liest, **then** findet er eine Plattform-Feature-Tabelle und keinen unrealistischen „Cross-Platform"-Claim ohne Einschränkungen.
- **Given** der bestehende Pfad `.github/skills`, **when** das Repo nach Diese-Epic-Auslieferung gescannt wird, **then** entweder ist der Pfad umgelabelt zu klarem GitHub-Adapter-Output oder entfernt mit Migrations-Hinweis.

## Capability Breakdown

### C1 — Capability-Matrix *(S, ~1 Story)*

- C1.1 Pro Plattform Audit: was wird wirklich unterstützt?
  - Claude Code: Skills, Slash Commands, Subagents, Hooks, MCP, settings.json-Permissions
  - Cursor: `.cursorrules`, Memories, Workspace-Settings
  - Windsurf: Rules-System, Memories
  - GitHub Copilot: `repository custom instructions`, `.github/copilot-instructions.md` (kein Lifecycle, keine Subagents)
  - Codex: `AGENTS.md`-Konvention
- C1.2 Output: `docs/platforms/capability-matrix.md` mit Feature-Tabelle (Skill-Lifecycle, Subagents, Hooks, Permissions, Slash Commands, MCP)
- C1.3 Pro Plattform: Liste der scrum_workflow-Features die NICHT funktionieren

### C2 — Plattformspezifische Generatoren *(L, ~1 Story)*

- C2.1 Refactor: `src/cli/scripts/adapters/` Ordner mit einem Generator pro Plattform
- C2.2 Adapter-Interface: `generate(sourceSkill, targetDir, options) → AdapterOutput`
- C2.3 Claude-Code-Adapter (existiert sinngemäß heute, nur explizit machen)
- C2.4 Cursor-Adapter: konsolidiert Skill-Inhalte zu einer `.cursorrules`-Datei (mit `# {{skill_name}}`-Sektionen)
- C2.5 Copilot-Adapter: schreibt `.github/copilot-instructions.md` als komprimierten Single-File-Dump (kein Skill-Folder)
- C2.6 Codex-Adapter: schreibt `AGENTS.md` im Root
- C2.7 Windsurf-Adapter: Skills + Memories in Windsurf-Konvention

### C3 — Ehrliche Claims & Warnings *(M, ~1 Story)*

- C3.1 README-Update: Plattform-Feature-Matrix prominent oben, kein „Cross-Platform"-Claim ohne Einschränkungs-Liste
- C3.2 Installer-Output: bei `--platform=X` eine Warnung mit Liste der NICHT verfügbaren Features
- C3.3 `.github/skills` Pfad-Bewertung: entweder umlabeln zu klarem GitHub-Adapter-Output oder mit Deprecation-Warning entfernen
- C3.4 Per-Plattform-Doku in `docs/platforms/{platform}.md` mit konkretem Setup, Limitations, Beispielen
- C3.5 Mirror in `src/cli/templates/` falls Templates plattformbezogenes Verhalten haben

## Dependencies

- **Vorgelagert:** EP-002 (optional — Schemas erleichtern Adapter-Tests, aber nicht harte Voraussetzung)
- **Nachgelagert:** keine direkten; Adapter-Hardening ist parallel zu allen anderen Epics machbar
- **Querbezug:** EP-007 (Modular Skills + Token-Disziplin) reduziert Skill-Größe — vereinfacht Cursor/Copilot-Adapter (weniger Content komprimieren)

## Success Metrics

- **5 Plattformen explizit dokumentiert**: Claude Code, Cursor, Windsurf, Copilot, Codex haben jeweils eigene Adapter und Doku-Seite
- **0 irreführende Claims im README**: ein externer Reviewer findet keine Feature-Behauptung ohne Plattform-Einschränkung
- **100 % Installer-Warning-Coverage**: bei Installation auf nicht-vollständig-unterstützter Plattform erscheint eine Warning mit den fehlenden Features
- **< 10 KB Cursor-Output**: konsolidierte `.cursorrules` pro Skill bleibt unter 10 KB (Cursor-Limit-Heuristik)
