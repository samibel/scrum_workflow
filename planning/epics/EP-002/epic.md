---
schema_version: "1.0.0"
epic_id: "EP-002"
parent_brief: "PB-001"
title: "Runtime Enforcement Layer (Schemas + Validators)"
status: planned
epic_index: "2/11"
story_count_estimate: 5
domain_tags: ["contracts", "cli", "ci"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P0"
review_source: "Review A — High #2 'Markdown ist Runtime' + Review B — kritische Folge 'Markdown ohne Enforcement'"
---

# Runtime Enforcement Layer (Schemas + Validators)

## Purpose

Beide Reviews diagnostizieren dieselbe Schwäche: Zu viele Workflow- und Sicherheitsregeln leben nur als Markdown-Text und werden vom Agent „verstanden", aber nicht vom System enforced. AI Agents folgen Regeln probabilistisch — ein „MUST NOT" in Markdown ist schwächer als ein Validator, Hook, CLI Guard oder CI Check. Dieses Epic baut die ausführbare Schicht: JSON Schemas für jedes Artefakt, eine `scrum-validate`-CLI, Write-Boundary-Enforcer als Hook, einen Status-Transition-Enforcer mit `state-machine.yaml` als Single Source of Truth und CI-Gates die das Ganze nicht-umgehbar machen.

Dies ist der größte Brocken der Roadmap und das Fundament für EP-004 (Reviewer Authority), EP-005 (Traceability), EP-010 (Quality Scoring) und EP-011 (Self-Reference).

## User Value

- **Tech Lead**: kann sich auf Statusübergänge verlassen, weil sie nicht mehr „aus Höflichkeit gegenüber der Markdown-Regel" passieren, sondern vom Validator erzwungen werden.
- **Platform Engineer**: hat eine deklarative Quelle pro Artefakt (Schema in `contracts/schemas/`); Erweiterungen werden Schema-Änderungen mit klarer Migrationsstrategie statt Markdown-Diffs.
- **Compliance / Audit**: jedes Artefakt ist gegen ein veröffentlichtes Schema validiert; ein PR ohne valide Artefakte kommt nicht in Main.

## Scope

### In-Scope

- JSON-Schema-Definitionen für alle workflow-relevanten Artefakte (`story`, `plan`, `review`, `approval`, `verification-report`, `refinement`, `epic`)
- `scrum-validate <artifact-path>` CLI im `src/cli/bin/` (nutzt bereits vorhandenes `ajv`)
- Pre-Check-Hook in `/scrum-dev-story`, `/scrum-review-story`, `/scrum-approve`, `/scrum-verify` (verweigert Start bei Schema-Fehlern)
- Write-Boundary-Enforcer: maschinenlesbare `write_allow`/`write_deny`-Felder in Command-Frontmatter + Pre-Write-Check-Hook
- Status-Transition-Enforcer: `state-machine.yaml` als Single Source of Truth, `scrum-transition`-CLI
- Refactor: `standards.md` State-Machine-Tabelle und `pipeline-routing.yaml` werden aus `state-machine.yaml` generiert (oder gegen sie geprüft)
- CI-Gates in `.github/workflows/`: Schema-Validation, Verify-Report-Existenz vor Review, Approval-Artifact-Link in PR
- Mirror in `src/cli/templates/scrum_workflow/`

### Out-of-Scope

- Story-Template-Inhalt selbst (Pflichtsektionen) → EP-003 (geht Schema-Definition voraus oder läuft parallel)
- Findings-JSON-Sidecar → EP-004
- Traceability-YAML → EP-005
- Plattform-Adapter-Schemas → EP-006
- Quality-Score-Berechnung → EP-010

## Acceptance Criteria (Epic-Level)

- **Given** ein Artefakt mit ungültigem Frontmatter, **when** `/scrum-dev-story`, `/scrum-review-story` oder `/scrum-approve` startet, **then** das Kommando halts mit Schema-Validation-Error inkl. exakter Pfadangabe (z. B. `/acceptance_criteria/0/id: missing required field`).
- **Given** `state-machine.yaml` als Single Source of Truth, **when** `standards.md` State-Machine-Tabelle gerendert wird, **then** sie wird daraus generiert (oder ein CI-Check schlägt an, wenn sie abweicht).
- **Given** ein Command versucht ausserhalb seines `write_allow` zu schreiben, **when** der Write-Boundary-Hook läuft, **then** der Write wird verweigert mit exit 1 und Boundary-Violation-Error.
- **Given** ein PR mit `_scrum-output/sprints/*/story.md`-Änderungen, **when** die CI läuft, **then** alle modifizierten Artefakte werden gegen ihr Schema validiert; ungültige Artefakte blockieren den Merge.
- **Given** ein Versuch eine ungültige Status-Transition zu schreiben (z. B. `ready-for-dev → approved`), **when** `scrum-transition` aufgerufen wird, **then** wird verweigert und kein `status_history`-Eintrag geschrieben.

## Capability Breakdown

### C1 — Artifact-Schemas in `contracts/schemas/` *(L, ~1 Story)*

- C1.1 `story.schema.json` (Frontmatter + Pflichtsektionen, koordiniert mit EP-003)
- C1.2 `plan.schema.json`
- C1.3 `review.schema.json` (Frontmatter + Findings-Tabelle als Array)
- C1.4 `approval.schema.json`
- C1.5 `verification-report.schema.json` (Markdown+YAML-Konvention aus EP-001 C3.2)
- C1.6 `refinement.schema.json`
- C1.7 `epic.schema.json` und `epic-index.schema.json` (für Self-Validation der heute erstellten Epics)
- C1.8 `state-machine.schema.json` (für `state-machine.yaml` selbst)

### C2 — Validator-CLI `scrum-validate` *(M, ~1 Story)*

- C2.1 Neues Binary in `src/cli/bin/scrum-validate.js`, nutzt `ajv` (existiert bereits in `devDependencies`)
- C2.2 Auto-Detection des Schema basierend auf Artefakt-Pfad (`story.md` → `story.schema.json`)
- C2.3 Pre-Check-Hook in Commands `/scrum-dev-story`, `/scrum-review-story`, `/scrum-approve`, `/scrum-verify`
- C2.4 Helpful Error Output: Pfad zum Problem, Schema-Path, erwarteter Typ, Beispielwert
- C2.5 `--all` Flag: validiert alle Artefakte in `_scrum-output/`

### C3 — Single Source of Truth: `state-machine.yaml` *(M, ~1 Story)* — **User-Entscheidung**

- C3.1 Neue Datei `src/core/data/state-machine.yaml` mit allen Zuständen, validen Transitions, Trigger pro Transition, Pflicht-Artefakten pro Transition
- C3.2 `standards.md` State-Machine-Tabelle wird daraus generiert (Build-Step) oder per Sync-Check verifiziert
- C3.3 `pipeline-routing.yaml` wird gegen `state-machine.yaml` validiert (CI-Check)
- C3.4 Command-Frontmatter (`requires_status`, `sets_status`) wird gegen `state-machine.yaml` validiert
- C3.5 Migration der bestehenden State-Definitionen ohne Verhalten zu ändern

### C4 — Write-Boundary-Enforcer *(L, ~1 Story)*

- C4.1 Erweiterung jedes Command-Frontmatters in `src/core/commands/`: neue Felder `write_allow: []`, `write_deny: []` (Glob-Patterns)
- C4.2 Neuer Skill `write-boundary-enforcer` in `src/core/skills/`: Pre-Write-Hook prüft Target-Pfad gegen aktuellen Command-Kontext
- C4.3 Verstoß → exit 1 mit lokalisierter Error-Message (de/en)
- C4.4 Status-Transition-Enforcer `scrum-transition` CLI: lädt valide Edges aus `state-machine.yaml`, schreibt `status_history` atomar
- C4.5 Refactor bestehender Status-Update-Code-Pfade auf `scrum-transition`

### C5 — CI-Gates *(M, ~1 Story)*

- C5.1 GitHub Action `validate-artifacts.yml`: validiert alle `_scrum-output/sprints/*/*.md` + `planning/epics/*/*.md` gegen Schemas bei PR
- C5.2 GitHub Action `verify-gate.yml`: prüft dass jede Story mit Status ≥ `review` eine `verification-report.md` mit `status: passed` hat
- C5.3 GitHub Action `approval-link-check.yml`: prüft dass jede Story mit Status ≥ `approved` ein `approval-N.md` referenziert
- C5.4 PR-Template (`.github/PULL_REQUEST_TEMPLATE.md`) fordert Approval-Artifact-Link
- C5.5 Mirror Workflows nicht nötig (CI lebt nur im Root-Repo)

## Dependencies

- **Vorgelagert:** EP-001 (Golden Path muss stabil sein, sonst validieren wir falsche Konvention), EP-008 (CI-Infrastruktur), EP-003 (Story-Template-Pflichtsektionen müssen vor Schema-Definition feststehen), EP-009 (strategische Positionierung + ADRs dokumentieren die Schema-Entscheidungen, die EP-002 implementiert)
- **Nachgelagert:** EP-004 (Findings-Schema), EP-005 (Traceability-Schema), EP-010 (Quality Scoring konsumiert Schemas), EP-011 (Self-Validation der Workflow-Files)

## Success Metrics

- **100 % Artifact-Coverage**: jeder Artefakt-Typ im Workflow hat ein veröffentlichtes JSON Schema in `contracts/schemas/`
- **0 Sync-Drift**: CI-Check `state-machine ↔ standards.md ↔ pipeline-routing.yaml ↔ Command-Frontmatter` bleibt dauerhaft grün
- **< 100 ms Validation-Overhead**: `scrum-validate` läuft pro Artefakt in < 100 ms (für gute DX im Pre-Check-Hook)
- **0 Bypass-Merges**: kein PR mit invalidem Artefakt erreicht Main nach Aktivierung der CI-Gates
