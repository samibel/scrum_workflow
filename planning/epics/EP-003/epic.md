---
schema_version: "1.0.0"
epic_id: "EP-003"
parent_brief: "PB-001"
title: "Story-Template-Härtung"
status: planned
epic_index: "3/11"
story_count_estimate: 3
domain_tags: ["templates", "story"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — High #5 'Spec-Templates zu generisch' + Review B — Scorecard 'Non-goals 2/5, ACs 2/5, Edge Cases 3/5'"
---

# Story-Template-Härtung

## Purpose

Spec-Driven Development scheitert nicht daran, dass keine Story existiert, sondern daran, dass Stories zu schwach sind. `story.md` enthält heute Acceptance Criteria, aber keine Pflichtsektionen für Non-goals, Edge Cases, Rollback, Observability, Migration, Security/Privacy oder eine explizite Test-Matrix. Review A wertet das als High-Issue („Agents bekommen scheinbar 'ready' Stories, obwohl wichtige Boundary Conditions fehlen"); Review B gibt der Acceptance-Criteria-Qualität nur 2/5, Non-Goals nur 2/5.

Dieses Epic härtet das Story-Template um die fehlenden Pflichtsektionen, typisiert ACs maschinenlesbar (IDs, `verification_type`, `covered_by`-Pointer) und führt einen Story-Readiness-Score ein, der `/scrum-refine-story` als Gate nutzt.

## User Value

- **Tech Lead**: kann sicher sein, dass „ready-for-dev" mehr bedeutet als „ein Agent hat AC-Bullets erfunden" — alle Boundary Conditions sind explizit.
- **Platform Engineer**: kann ACs maschinenlesbar verarbeiten (Coverage-Reports, Traceability), weil sie typisiert sind und IDs haben.
- **Compliance / Audit**: Pflichtsektionen Security/Privacy und Migration sind kein Optional-Add-on mehr; jede Story dokumentiert sie oder begründet ihr Fehlen.

## Scope

### In-Scope

- Erweiterung `src/core/templates/story.md` um 8 Pflichtsektionen: Non-goals, Out-of-Scope, Edge Cases, Rollback Strategy, Observability, Security/Privacy Impact, Migration/Compatibility, Test Matrix
- Erweiterung des Frontmatters um getypte AC-Struktur (Array statt freier Markdown-Liste): `id`, `verification_type` (`unit|integration|e2e|manual`), `given_when_then`, `covered_by` (Liste Test-Pfade, nach Implementation gefüllt)
- Neuer Skill `story-readiness-scoring` in `src/core/skills/`: Score 0–100 % basierend auf Sektionen-Vollständigkeit, AC-Qualität, Edge-Case-Count
- `/scrum-refine-story` integriert den Score: < 80 % blockiert Übergang nach `ready-for-dev`
- Mirror in `src/cli/templates/scrum_workflow/templates/` und `src/cli/templates/scrum_workflow/skills/`
- Migrationsstrategie für bestehende Stories (Frontmatter `schema_version: "0.x"`)

### Out-of-Scope

- JSON-Schema-Datei `story.schema.json` selbst → EP-002 C1.1 (basiert auf dem hier definierten Template)
- Automatische AC↔Test-Verknüpfung (`covered_by` automatisch befüllen) → EP-005
- Story-Quality-Verbesserung in bestehenden `_scrum-output/sprints/*/story.md` (Datenmigration ist separate Aufgabe)
- Domain-spezifische Custom-Sektionen pro Story-Type (vorerst einheitliches Template)

## Acceptance Criteria (Epic-Level)

- **Given** das neue Story-Template, **when** eine neue Story über `/scrum-create-ticket` erstellt wird, **then** enthält sie alle 8 Pflichtsektionen mit Platzhaltern und alle ACs haben IDs + `verification_type`.
- **Given** eine unvollständige Story (z. B. fehlende Rollback-Sektion), **when** `/scrum-refine-story` läuft, **then** der Readiness-Score ist < 80 % und der Übergang nach `ready-for-dev` wird mit einer Liste der fehlenden Sektionen blockiert.
- **Given** eine vollständige Story mit hochwertigen ACs (Given/When/Then strukturiert, `verification_type` gesetzt), **when** der Score berechnet wird, **then** liegt er ≥ 80 % und der Übergang wird erlaubt.
- **Given** eine Legacy-Story (`schema_version: "0.x"`), **when** sie geöffnet wird, **then** wird sie nicht hart abgelehnt, sondern mit einer Migration-Warnung versehen.

## Capability Breakdown

### C1 — Pflichtsektionen im Story-Template *(M, ~1 Story)*

- C1.1 Section: **Non-goals** (was die Story ausdrücklich NICHT tut)
- C1.2 Section: **Out of scope** (Abgrenzung zu Nachbar-Stories im selben Epic)
- C1.3 Section: **Edge Cases** (mit Verknüpfung zu AC-IDs)
- C1.4 Section: **Rollback Strategy** (wie wird die Änderung rückgängig gemacht, falls etwas schiefgeht)
- C1.5 Section: **Observability** (Logs, Metrics, Traces, die ergänzt werden)
- C1.6 Section: **Security / Privacy Impact** (neue PII-Felder, Auth-Änderungen, Secret-Handling)
- C1.7 Section: **Migration / Compatibility** (DB-Migrationen, API-Versionierung, Breaking Changes)
- C1.8 Section: **Test Matrix** (Tabelle AC-ID × verification_type × test_path)

### C2 — AC-Typisierung *(M, ~1 Story)*

- C2.1 Frontmatter-Schema: `acceptance_criteria` als Array von Objekten `{id, verification_type, given, when, then, covered_by}`
- C2.2 ID-Konvention: `AC-001`, `AC-002` pro Story, stabil über Re-Reviews hinweg
- C2.3 `verification_type` Enum: `unit | integration | e2e | manual`
- C2.4 `covered_by`: Liste Test-Pfade, vom Developer-Agent am Ende von `/scrum-dev-story` gefüllt
- C2.5 Markdown-Body rendert AC-IDs sichtbar in der Tabelle/Liste
- C2.6 Migrationsstrategie: alte `acceptance_criteria`-Markdown-Listen werden weiter geduldet bei `schema_version: "0.x"`

### C3 — Story-Readiness-Score *(M, ~1 Story)*

- C3.1 Neuer Skill `src/core/skills/story-readiness-scoring/SKILL.md`
- C3.2 Score-Komponenten: Sektionen-Vollständigkeit (50 %), AC-Qualität (30 %, hat jede AC GWT + verification_type?), Edge-Case-Count (10 %, ≥1 Edge Case pro AC), Frontmatter-Vollständigkeit (10 %)
- C3.3 `/scrum-refine-story` ruft Skill auf, bricht ab wenn Score < 80 % und gibt detaillierten Bericht
- C3.4 Score wird in `story.md` Frontmatter geschrieben: `readiness_score: 0.85`
- C3.5 Mirror in `src/cli/templates/scrum_workflow/skills/story-readiness-scoring/`

## Dependencies

- **Vorgelagert:** keine harten Dependencies; kann parallel zu EP-001 laufen
- **Nachgelagert:** EP-002 C1.1 (`story.schema.json` formalisiert das hier definierte Template), EP-005 (Traceability baut auf AC-IDs auf), EP-004 (Findings-`ac_ref` referenziert AC-IDs)

## Success Metrics

- **8/8 Pflichtsektionen**: jede neue Story enthält alle 8 Sektionen (verifiziert per Schema in EP-002)
- **100 % typisierte ACs**: jede AC in neuen Stories hat ID + `verification_type` + GWT-Struktur
- **Median Readiness-Score ≥ 85 %** für Stories die `/scrum-refine-story` durchlaufen haben
- **0 Bypass-Stories**: keine Story erreicht `ready-for-dev` mit Score < 80 % (post-Aktivierung)
