---
schema_version: "1.0.0"
epic_id: "EP-001"
parent_brief: "PB-001"
title: "Pipeline Integrity (Golden-Path-Fix)"
status: planned
epic_index: "1/11"
story_count_estimate: 4
domain_tags: ["workflow", "state-machine"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P0"
review_source: "Review A (Chat) — Critical Finding #1"
---

# Pipeline Integrity (Golden-Path-Fix)

## Purpose

`/scrum-verify` beschreibt sich als *mandatory automated verification gate* vor `review`, aber `pipeline-routing.yaml` routet `in-progress` direkt über `/scrum-dev-story` nach `review`. Damit existiert im Hauptpfad ein Bypass der Verification — ein Agent kann eine Story als „fertig" markieren, bevor Tests, Lint und Build objektiv gelaufen sind. Das ist der einzige Critical-Issue aus Review A und blockiert alle weiteren Härtungs-Schritte, weil ohne stabilen Golden Path keine sinnvolle Schema-Validierung greifen kann.

Dieses Epic schließt die Lücke: `verification-report.md` wird ein verpflichtendes Artefakt vor jedem `review`-Übergang, der Status-Guard verweigert den Übergang ohne pass-Status, und Tests stellen sicher, dass keine Edge in der Pipeline diesen Gate umgehen kann.

## User Value

- **Tech Lead**: kann der Statusanzeige `review` wieder trauen — sie bedeutet objektiv gelaufene Verification, nicht nur agent-eigene Behauptung.
- **Platform Engineer**: hat eine konsistente Pipeline ohne stille Bypass-Pfade; State Machine, Routing-YAML und Command-Frontmatter sagen dasselbe.
- **Compliance / Audit**: jeder `review`-Übergang im `status_history` hat einen verlinkten Verify-Report-Artifact als Beleg.

## Scope

### In-Scope

- Audit aller Pipeline-Edges (`pipeline-routing.yaml`, `standards.md` State Machine, Command-Frontmatter)
- Reparatur des Golden Paths: `in-progress → /scrum-verify → review` (statt `in-progress → /scrum-dev-story → review`)
- Frontmatter-Update von `/scrum-dev-story` (`sets_status: in-progress`) und `/scrum-verify` (`requires_status: in-progress`, `sets_status: review`)
- Erweiterung des `status-guard-validation` Skills: Übergang nach `review` nur bei existierendem `verification-report.md` mit Frontmatter-Status `passed`
- Format-Definition `verification-report.md` als Markdown mit YAML-Frontmatter (Konvention analog `review-N.md`)
- Konsistenz-Tests (state-machine ↔ routing ↔ Commands)
- Mirror in `src/cli/templates/scrum_workflow/`

### Out-of-Scope

- Schema-Definition für `verification-report.md` als JSON Schema → EP-002
- Implementation eines neuen Verification-Workflows (`/scrum-verify` existiert bereits, nur Reorientierung)
- Verification Confidence Score als Gate → EP-010
- Generation der State-Machine aus `state-machine.yaml` → EP-002

## Acceptance Criteria (Epic-Level)

- **Given** eine Story in Status `in-progress` ohne `verification-report.md`, **when** ein Agent versucht den Status auf `review` zu setzen, **then** der Übergang scheitert mit Status-Guard-Violation und klarem Next-Step-Hinweis.
- **Given** die aktuellen Pipeline-Definitionen, **when** ein Konsistenz-Test läuft, **then** jede Edge in `standards.md` ist auch in `pipeline-routing.yaml` und in den Command-Frontmatter-Feldern abgebildet — und umgekehrt.
- **Given** ein erfolgreicher `/scrum-verify`-Lauf, **when** das Resultat geschrieben wird, **then** entsteht ein `_scrum-output/sprints/SW-XXX/verification-report.md` mit YAML-Frontmatter `status: passed` (oder `failed`) plus narrativen Sektionen, analog zur Konvention von `review-N.md`.
- **Given** ein `review-N.md` wird erstellt, **when** das `status_history` der Story geprüft wird, **then** existiert ein vorangegangener `in-progress → review`-Übergang mit Trigger `/scrum-verify` und einem `verification-report.md`-Artefakt im Sprint-Ordner.

## Capability Breakdown

Diese Capabilities werden bei `/scrum-draft-stories EP-001` zu jeweils ≥1 Story:

### C1 — Pipeline-Discrepancy-Audit *(S, ~1 Story)*

- C1.1 Mappen aller Transitions in `src/core/data/pipeline-routing.yaml` → Tabelle
- C1.2 Abgleich mit State Machine in `src/core/context/standards.md`
- C1.3 Abgleich mit Frontmatter `requires_status` / `sets_status` aller Commands in `src/core/commands/`
- C1.4 Discrepancy-Report committen unter `docs/audit/pipeline-discrepancy.md`

### C2 — Golden-Path-Reparatur *(M, ~1 Story)*

- C2.1 `pipeline-routing.yaml`: Edge `in-progress → /scrum-dev-story → review` durch `in-progress → /scrum-verify → review` ersetzen
- C2.2 `src/core/commands/dev-story.md` Frontmatter: `sets_status: in-progress` (nicht mehr `review`)
- C2.3 `src/core/commands/verify.md` Frontmatter: `requires_status: in-progress`, `sets_status: review`
- C2.4 `standards.md` State-Machine-Tabelle und Diagramm syncen
- C2.5 Mirror in `src/cli/templates/scrum_workflow/commands/` und `src/cli/templates/scrum_workflow/data/`

### C3 — Bypass-Schutz im Status-Guard *(M, ~1 Story)*

- C3.1 `src/core/skills/status-guard-validation/SKILL.md` erweitern: Übergang nach `review` erfordert `verification-report.md` im Sprint-Ordner
- C3.2 `verification-report.md` Konvention dokumentieren: Markdown mit YAML-Frontmatter (`schema_version`, `ticket`, `status: passed|failed`, `verified_at`, `tools: [{name, command, exit_code, summary}]`)
- C3.3 Verstoß → Hard Halt mit standardisiertem Error-Block (analog zu bestehenden Status-Guard-Errors)
- C3.4 Mirror in `src/cli/templates/scrum_workflow/skills/status-guard-validation/`

### C4 — Konsistenz-Tests *(M, ~1 Story)*

- C4.1 Neuer Unit-Test in `tests/unit/pipeline-consistency/`: jede Edge in `standards.md` ist in `pipeline-routing.yaml` und umgekehrt
- C4.2 Neuer Integration-Test: Versuch `in-progress → review` ohne `verification-report.md` scheitert
- C4.3 Audit-Trail-Test: `status_history` enthält Verify-Schritt mit Trigger `/scrum-verify`
- C4.4 Snapshot-Test: alle Command-Frontmatter `requires_status`/`sets_status` stimmen mit `pipeline-routing.yaml` überein

## Dependencies

- **Vorgelagert:** EP-008 (Test-Infrastruktur muss funktionieren, damit C4 grün läuft)
- **Nachgelagert (blockiert von diesem Epic):** EP-002 (Schema-Definition für `verification-report.md` baut auf der hier festgelegten Konvention auf), EP-005 (Traceability braucht stabilen `review`-Gate)

## Success Metrics

- **0 Bypass-Pfade**: kein Edge in `pipeline-routing.yaml` führt von `in-progress` direkt nach `review` ohne `/scrum-verify`
- **100 % Konsistenz**: Snapshot-Test `pipeline-consistency` ist grün — `standards.md` ↔ `pipeline-routing.yaml` ↔ Command-Frontmatter sind synchron
- **100 % Verify-Coverage**: jede Story in `_scrum-output/sprints/*/` mit Status ≥ `review` hat eine `verification-report.md` im Ordner
- **Mean-Time-to-Detect-Bypass < 1 CI-Run**: ein versehentlich eingeführter Bypass-Pfad wird vom Consistency-Test im PR sofort gefangen
