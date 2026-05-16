---
schema_version: "1.0.0"
epic_id: "EP-011"
parent_brief: "PB-001"
title: "Self-Reference (scrum_workflow reviewt sich selbst)"
status: planned
epic_index: "11/11"
story_count_estimate: 3
domain_tags: ["ci", "self-test"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P3"
review_source: "Review B — 'Eat your own dog food: ein Agent der Spec-Qualität reviewt muss selbst saubere Spec-Qualität vorweisen'"
---

# Self-Reference (scrum_workflow reviewt sich selbst)

## Purpose

Review B kritisiert pointiert: „Ein Agent, der Spec-Qualität bei anderen reviewt, muss selbst saubere Spec-Qualität vorweisen: Metadaten, klare Boundaries, kein redundanter Content." Das Argument greift auf das gesamte Repo: `scrum_workflow` propagiert Spec-Driven Discipline mit Schemas, Validators, Adversarial Reviewers, Audit-Trails — wendet diese Disziplin aber bisher nicht systematisch auf sich selbst an.

Dieses Epic schließt den Kreis: `schema_version` auf allen Artefakten, Test-Szenarien für den Workflow selbst (weak-spec, strong-spec, missing-AC), ein `/scrum-self-review` Command der Karpathy + Clean Code Checks auf eine Skill-/Command-Datei anwendet, und CI-Self-Review bei jedem PR. Priorität P3 weil es auf allen anderen Epics aufbaut.

## User Value

- **Maintainer**: weiß bei jedem Refactor, ob die eigenen Skill-/Command-Files noch konsistent sind.
- **Contributor**: bekommt automatischen Karpathy/Clean-Code-Feedback auf Workflow-File-PRs — gleiches Niveau wie Anwender-Code.
- **Externer Evaluator**: kann das Repo als Beispiel zitieren („sie wenden ihre eigenen Standards an") — Glaubwürdigkeit als „erwachsenes" Framework.

## Scope

### In-Scope

- `schema_version` in jedem Artefakt-Frontmatter (heute teilweise schon vorhanden; vollständig durchziehen)
- Migration-Skript für Schema-Versions-Upgrades (`schema_version: "1.0.0"` → `"1.1.0"`)
- Test-Szenarien in `tests/scenarios/` als ausführbare Pipeline-Tests:
  - `tests/scenarios/weak-spec/` — schlechte Story → `/scrum-refine-story` muss blockieren
  - `tests/scenarios/strong-spec/` — gute Story → Pipeline läuft komplett durch
  - `tests/scenarios/missing-ac/` — leere AC → Validator schlägt an
  - `tests/scenarios/bypass-attempt/` — Versuch `in-progress → review` ohne Verify → muss scheitern
- `/scrum-self-review` Command: wendet Karpathy + Clean Code + Schema-Validation auf eine Skill-/Command-Datei an
- CI-Step `self-review-on-pr`: bei jedem PR der `src/core/agents/`, `src/core/commands/`, `src/core/skills/` ändert → automatischer Self-Review

### Out-of-Scope

- Self-Heal (automatische Reparatur von Skill-Files); Self-Review ist read-only
- Performance-Self-Profile (Skill-Token-Audit kommt aus EP-007)
- Public-Showcase / Demo-Repository (separate Aufgabe)
- Cross-Repo-Self-Review (nur dieses Repo)

## Acceptance Criteria (Epic-Level)

- **Given** ein beliebiges Workflow-Artefakt (story, plan, review, approval, verification, epic), **when** das Schema gegen `schema_version` matched wird, **then** ist jedes Artefakt mit gültiger Version annotiert und ein Migration-Path zu höheren Versionen ist dokumentiert.
- **Given** `tests/scenarios/weak-spec/`, **when** der Szenario-Test läuft, **then** simuliert er `/scrum-refine-story` auf einer schwachen Story und erwartet einen Block-Status mit Readiness-Score < 80 %.
- **Given** `tests/scenarios/bypass-attempt/`, **when** der Szenario-Test läuft, **then** simuliert er einen Versuch `in-progress → review` ohne Verify-Report und erwartet Status-Guard-Violation.
- **Given** ein PR der `src/core/agents/clean-code-reviewer.md` ändert, **when** die CI läuft, **then** läuft `/scrum-self-review` darauf und postet ggf. Findings als PR-Kommentar.

## Capability Breakdown

### C1 — `schema_version` Vollständigkeit *(S, ~1 Story)*

- C1.1 Audit aller Artefakt-Templates in `src/core/templates/`: jedes hat `schema_version` im Frontmatter (heute teilweise da)
- C1.2 Audit bestehender `_scrum-output/sprints/*/`-Artefakte: legacy ohne `schema_version` → `schema_version: "0.x"` annotieren
- C1.3 Migration-Skript-Konvention dokumentieren: `src/cli/scripts/migrations/v0-to-v1.js` als Beispiel
- C1.4 Schema-Validatoren (EP-002) respektieren `schema_version`-Field und wählen passendes Schema

### C2 — Test-Szenarien für den Workflow *(M, ~1 Story)*

- C2.1 `tests/scenarios/weak-spec/`: Story-Fixture mit fehlenden Pflichtsektionen + erwartetes Block-Verhalten
- C2.2 `tests/scenarios/strong-spec/`: Story-Fixture mit allen Sektionen + erwarteter Pipeline-Durchlauf
- C2.3 `tests/scenarios/missing-ac/`: Story-Fixture mit leeren ACs + erwarteter Validator-Fehler
- C2.4 `tests/scenarios/bypass-attempt/`: Versuch `in-progress → review` ohne Verify → erwartet Status-Guard-Violation
- C2.5 Test-Runner-Integration: scenarios laufen als Teil von `pnpm -r test`
- C2.6 Pro Szenario eine kurze README, was getestet wird und warum

### C3 — `/scrum-self-review` Command + CI *(M, ~1 Story)*

- C3.1 Neuer Command `src/core/commands/self-review.md` (`/scrum-self-review`)
- C3.2 Inputs: Pfad zu Skill-/Command-/Agent-Datei
- C3.3 Wendet `karpathy-guidelines-reviewer` + `clean-code-reviewer` + Schema-Validation auf die Datei an (skill-of-skill)
- C3.4 Output: `_scrum-output/self-review/{file-name}-{date}.md` mit Findings
- C3.5 CI-Step `.github/workflows/self-review.yml`: triggered on PRs touching `src/core/{agents,commands,skills}/`
- C3.6 PR-Kommentar mit gefundenen Findings (gh CLI via MCP)
- C3.7 Mirror in `src/cli/templates/scrum_workflow/commands/`

## Dependencies

- **Vorgelagert:** EP-002 (Schemas + Validators), EP-004 (Karpathy + Clean Code Reviewer mit strukturiertem Output), EP-007 (optional, kleinere Skills sind leichter self-reviewable)
- **Nachgelagert:** keine; dies ist das closing Epic der Roadmap
- **Querbezug:** Re-Use der heute committeten Reviewer-Agents (`clean-code-reviewer`, `karpathy-guidelines-reviewer`)

## Success Metrics

- **100 % Artefakte mit `schema_version`** nach Audit + Migration
- **4 Test-Szenarien grün**: weak-spec, strong-spec, missing-ac, bypass-attempt laufen in CI
- **Self-Review aktiv auf PRs**: jeder PR der Workflow-Files ändert bekommt automatisch Self-Review-Findings als Kommentar
- **0 Self-Review-Critical-Findings auf Main**: nach Aktivierung bleibt die Main-Branch frei von Critical-Findings auf den eigenen Workflow-Files (Beleg dass das Framework seinen eigenen Standards genügt)
