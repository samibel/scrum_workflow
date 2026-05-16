---
schema_version: "1.0.0"
epic_id: "EP-007"
parent_brief: "PB-001"
title: "Modular Skills & Token-Disziplin"
status: planned
epic_index: "7/11"
story_count_estimate: 4
domain_tags: ["skills", "performance"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P2"
review_source: "Review B — 'Monolith-Prompt-Problem' + Review A — 'Adaptive Depth aggressiver einsetzen'"
---

# Modular Skills & Token-Disziplin

## Purpose

Review B kritisiert monolithische Prompts: „Token-Kosten — jeder Review lädt alle 7 Phasen in den Kontext, auch wenn nur Phase 2 benötigt wird." Review A ergänzt: „Refinement ist token- und prozessintensiv; für reale Teams muss Adaptive Depth aggressiver eingesetzt werden, sonst wird jede mittelgroße Story zu einem Ritual." Mit den heute hinzugefügten Reviewer-Sub-Agents (Clean Code + Karpathy) verschärft sich das Problem zusätzlich — drei always-on Critics × jede Review erhöht Token-Kosten signifikant.

Dieses Epic reduziert die Token-Last: Skill-Größen-Audit, Lazy-Loading via `SKILL.md` + `phases/*.md`-Splitting, `context: fork` für Critic-Sub-Agents zur Context-Isolation, und aggressivere Default-Tiefe (`light` für kleine Stories, `medium`/`full` nur bei Bedarf).

## User Value

- **Tech Lead**: niedrigere Token-Kosten pro Story → niedrigere Betriebskosten, kürzere Review-Zeiten.
- **Entwickler**: kleine Bug-Fix-Stories durchlaufen die Pipeline schnell, große Feature-Stories bekommen weiter die volle Tiefe.
- **Reviewer-Agents**: isolierter Kontext pro Critic verhindert Context-Bleeding zwischen primärem Reviewer und adversariellen Critics.

## Scope

### In-Scope

- Token-Count-Skript über alle `SKILL.md` in `src/core/skills/` und `src/cli/scrum_workflow/skills/`
- Identifikation aller Skills > 2000 Token; Splitting in `SKILL.md` (Trigger + Verweise) + `phases/*.md` (Detail, lazy geladen)
- Frontmatter `context: fork` für adversariale Sub-Agents (`clean-code-reviewer`, `karpathy-guidelines-reviewer`, `security-reviewer`, `ux-reviewer`) — sofern Claude-Code-Skill-Convention das stützt; sonst als Doku-Konvention
- Refactor `adaptive-depth-selector`-Skill: kombiniert Story-Size + `risk_level` für aggressivere `light`-Defaults
- Neues `/scrum-quick-review`-Command: nur Primary + Clean Code Reviewer (skipped: Karpathy, UX) für Bugfix/Low-Risk-Stories
- Dokumentation Token-Budget pro Depth in `docs/token-budgets.md`
- Mirror in `src/cli/templates/scrum_workflow/`

### Out-of-Scope

- Echte Streaming-Token-Reduktion (das ist Claude-Code-Plattform-Feature, nicht unseres)
- Skill-Inhalts-Verschlankung (Skill-Splitting ja, aber kein inhaltliches Trimmen)
- Caching von Sub-Agent-Outputs (außerhalb scrum_workflow-Scope)
- Eigene Token-Zähl-Bibliothek (nutze bestehende, z. B. `gpt-tokenizer` als Approximation)

## Acceptance Criteria (Epic-Level)

- **Given** das Token-Audit-Skript, **when** es über `src/core/skills/` läuft, **then** produziert es eine Liste aller Skills mit Token-Count und markiert die > 2000 Token rot.
- **Given** ein gesplitteter Skill (`SKILL.md` + `phases/*.md`), **when** Claude Code den Skill triggert, **then** wird nur `SKILL.md` initial geladen; `phases/*.md` werden erst bei Bedarf gelesen.
- **Given** ein adversarialer Sub-Agent mit `context: fork`, **when** er aufgerufen wird, **then** sieht er nicht den Kontext vorheriger Reviewer und produziert eine echt-unabhängige Bewertung.
- **Given** eine Bugfix-Story mit `risk_level: low` und < 5 ACs, **when** `/scrum-refine-ticket` läuft, **then** wird automatisch `depth: light` gewählt und der Pipeline-Pfad nutzt nur `developer` (kein `architect`, kein `qa`).
- **Given** `/scrum-quick-review SW-XXX` auf einer Low-Risk-Story, **when** der Review läuft, **then** werden nur `primary` und `clean-code-reviewer` invoked, nicht `karpathy-guidelines-reviewer` und nicht `ux-reviewer`.

## Capability Breakdown

### C1 — Skill-Größen-Audit *(S, ~1 Story)*

- C1.1 Skript `src/cli/scripts/token-audit.js` (nutzt `gpt-tokenizer` o. ä.)
- C1.2 Output: Tabelle mit Skill-Pfad, Token-Count, Status (`ok` / `warn > 1000` / `error > 2000`)
- C1.3 Aufnahme in CI als Warning (nicht Fail)
- C1.4 Dokumentation der Schwellwerte in `docs/token-budgets.md`

### C2 — Lazy-Loading via SKILL.md + phases/ *(M, ~1 Story)*

- C2.1 Für jeden Skill > 2000 Token: `SKILL.md` enthält nur Trigger, Beschreibung, Phase-Index; Detail wandert in `phases/01-*.md`, `phases/02-*.md`, …
- C2.2 Konvention dokumentieren: wann splitten, wie referenzieren
- C2.3 Heutige Anwärter: `adaptive-depth-selector`, `agent-dispatcher`, `synthesis`, `wrap-up` (laut Skill-Liste)
- C2.4 Mirror in `src/cli/templates/scrum_workflow/skills/`
- C2.5 Re-Audit nach Splitting; Ziel: kein Skill > 2000 Token im `SKILL.md`-File

### C3 — Context-Isolation für Critic-Sub-Agents *(S, ~1 Story)*

- C3.1 Frontmatter-Feld `context: fork` (oder äquivalente Convention) für `clean-code-reviewer`, `karpathy-guidelines-reviewer`, `security-reviewer`, `ux-reviewer`
- C3.2 Validieren ob Claude-Code-Skill-Convention das nativ unterstützt; sonst als Doku-Konvention führen und im `agent-dispatcher`-Skill manuell isolieren
- C3.3 Test: zwei Reviewer hintereinander aufrufen, der zweite darf nicht Kontext des ersten sehen
- C3.4 Mirror in `src/cli/templates/scrum_workflow/agents/`

### C4 — Aggressivere Adaptive Depth + Quick-Review *(M, ~1 Story)*

- C4.1 `src/core/skills/adaptive-depth-selector/SKILL.md` Logik: kombiniert Story-Size (AC-Count) + `risk_level` + `type`
- C4.2 Default `light` für: `type=bugfix` ODER (`risk_level=low` UND AC-Count < 5)
- C4.3 Default `medium` für mittelgroße Stories
- C4.4 Default `full` nur für `risk_level=high|critical` ODER `type=feature` mit AC-Count > 8
- C4.5 Neues Command `src/core/commands/quick-review.md` (`/scrum-quick-review`): wie `/scrum-review-story`, aber dispatched nur `primary + clean-code-reviewer`
- C4.6 Mirror in `src/cli/templates/scrum_workflow/`

## Dependencies

- **Vorgelagert:** keine harten Dependencies; ergänzt EP-004 (Reviewer-Authority)
- **Nachgelagert:** EP-010 (Quality Scoring konsumiert Depth-Info), EP-006 (Adapter profitieren von kleineren Skills)
- **Querbezug:** heute committe Karpathy-Reviewer + Clean Code Reviewer profitieren direkt von `context: fork`

## Success Metrics

- **0 Skills > 2000 Token in `SKILL.md`** nach Splitting (Lazy-Load-Anteil zählt nicht)
- **Median Token-Verbrauch pro `/scrum-review-story` -30 %** nach Adaptive-Depth-Aggressivierung
- **`/scrum-quick-review` Adoption ≥ 50 %** für `type=bugfix`-Stories
- **0 Context-Bleeding zwischen Critics**: in einem A/B-Test produziert Reviewer N mit `context: fork` Findings, die Reviewer N+1 *nicht* implizit voraussetzt
