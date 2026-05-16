---
schema_version: "1.0.0"
epic_id: "EP-005"
parent_brief: "PB-001"
title: "Source-to-Spec Traceability"
status: planned
epic_index: "5/11"
story_count_estimate: 4
domain_tags: ["traceability", "pr"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — Mid-Term Roadmap + Brutal-Truth-Differenzierungs-Argument"
---

# Source-to-Spec Traceability

## Purpose

Review A nennt es den eigentlichen Differenzierungs-Hebel: „Source-to-Spec Traceability — AC mit Code, Tests und Commits verbinden". Heute ist „Code geändert" nicht automatisch mit „welcher Commit erfüllt welche AC?" verbunden. Genau diese Verknüpfung — Acceptance Criterion → modifizierte Code-Stellen → verifizierende Tests → adressierte Findings → Approval — ist der konkrete Audit-Trail, den Compliance, regulierte Umgebungen und „erwachsene" AI-Governance brauchen.

Dieses Epic baut eine `traceability.yaml` pro Sprint, in die `/scrum-dev-story` automatisch Code-Mappings einträgt, der Validator AC↔Test-Coverage erzwingt, Findings auf AC-IDs zurück verlinken, und ein generierter PR-Body die AC×Status-Tabelle als Single-Source-of-Truth für Reviewer/Approver liefert.

## User Value

- **Tech Lead**: kann auf einen Blick sehen, welche ACs vom PR adressiert sind, welche getestet, welche noch offen — ohne Code-Search.
- **Reviewer**: muss nicht mehr raten, welche Datei zu welcher AC gehört; die Mapping ist im Artefakt.
- **Compliance / Audit**: hat einen lückenlosen Pfad AC → Commit → Test-Run → Review-Verdict → Approval; das ist der Kernunterschied zwischen „der Agent hat das gemacht" und „wir haben einen Audit-Trail".

## Scope

### In-Scope

- Neue Datei `_scrum-output/sprints/SW-XXX/traceability.yaml` pro Sprint
- AC → Code Mapping: pro AC `files: [{path, symbol, lines, commit_sha}]` (befüllt von `/scrum-dev-story`)
- AC → Test Mapping: pro AC `tests: [{path, test_name}]` (befüllt durch Code-Annotationen oder Konvention)
- AC → Findings Mapping: `findings.json` (EP-004) verlinkt auf AC-IDs (EP-003)
- Aggregierter Per-AC-Status: `uncovered | implemented | verified | reviewed | approved`
- Validator: jede AC ohne `verification_type: manual` muss ≥1 Test in `tests:` haben
- Neuer Skill `pr-body-generator`: liest `story.md` + `traceability.yaml` + `review-N.md` + `approval-N.md` → strukturierter PR-Body mit AC×Status-Tabelle
- Schema-Validierung von `traceability.yaml` (Erweiterung EP-002)

### Out-of-Scope

- Statische Code-Analyse zum Auto-Befüllen von `files:` (vorerst: Developer-Agent trägt explizit ein)
- Cross-Story-Traceability (welche ACs aus anderen Stories berührt derselbe Code?)
- Semantische Test-Coverage-Berechnung (Line-Coverage-Mapping ist Aufgabe von Coverage-Tools)
- Integration mit externen Issue-Trackern (Jira-Issue-Verlinkung)

## Acceptance Criteria (Epic-Level)

- **Given** eine implementierte Story, **when** `/scrum-dev-story` abschließt, **then** existiert `_scrum-output/sprints/SW-XXX/traceability.yaml` mit AC→Code-Mapping für alle ACs.
- **Given** eine Story mit `acceptance_criteria` deren `verification_type != manual`, **when** der Validator läuft, **then** schlägt er fehl, wenn eine AC keinen Test referenziert.
- **Given** eine Story die durch Review, Approval und PR-Erstellung gegangen ist, **when** der PR-Body-Generator läuft, **then** erzeugt er Markdown mit einer AC×Status-Tabelle (AC-ID, Code-Files, Tests, Findings-Count, Verdict, Approval-Link).
- **Given** ein offenes Finding mit `ac_ref: AC-003`, **when** der Per-AC-Status für AC-003 aggregiert wird, **then** zeigt er `reviewed` mit `open_findings: 1` (nicht `approved`).

## Capability Breakdown

### C1 — AC → Code Mapping *(L, ~1 Story)*

- C1.1 Neue Datei `_scrum-output/sprints/SW-XXX/traceability.yaml` Schema definieren
- C1.2 Format: `acceptance_criteria: [{id, files: [{path, symbol, lines, commit_sha}], tests: [], findings: [], status}]`
- C1.3 `/scrum-dev-story`-Workflow erweitert: am Ende der Implementation Mapping schreiben (Developer-Agent trägt explizit ein, basierend auf Diff)
- C1.4 Mirror in `src/cli/templates/scrum_workflow/workflows/dev-story.md`
- C1.5 Bestehender Pre-Check: Verifizieren dass `files:` nicht leer ist bei `verification_type != manual`

### C2 — AC → Test Mapping *(M, ~1 Story)*

- C2.1 Traceability erweitert um `tests: [{path, test_name}]` pro AC
- C2.2 Test-Annotationen-Konvention dokumentieren (z. B. JSDoc `@ac AC-003` oder Test-Namens-Konvention `it("AC-003: …")`)
- C2.3 Auto-Discovery durch Skill `test-coverage-mapper`: parst Test-Files und extrahiert AC-Referenzen
- C2.4 Validator: jede AC ohne `verification_type: manual` muss ≥1 Test referenzieren
- C2.5 Validator-Integration in `/scrum-verify` Pre-Check

### C3 — AC → Findings Mapping + Aggregierter Status *(S, ~1 Story)*

- C3.1 `findings.json` (EP-004) `ac_ref`-Feld wird in `traceability.yaml` zurückverlinkt
- C3.2 Aggregations-Logik für `status` pro AC:
  - `uncovered` = keine `files:` und keine `tests:`
  - `implemented` = `files:` non-empty, `tests:` empty oder manual
  - `verified` = `tests:` non-empty und `/scrum-verify` passed
  - `reviewed` = Review existiert ohne offene Critical-Findings für diese AC
  - `approved` = Approval existiert und alle Findings für diese AC resolved
- C3.3 Schema-Validierung Status-Enum

### C4 — PR-Body-Generator *(M, ~1 Story)*

- C4.1 Neuer Skill `src/core/skills/pr-body-generator/SKILL.md`
- C4.2 Inputs: `story.md`, `traceability.yaml`, letzte `review-N.md`, `approval-N.md`
- C4.3 Output: strukturierter Markdown-PR-Body mit Sections: Story-Summary, AC×Status-Tabelle, Findings-Summary, Approval-Link, Test-Results-Link
- C4.4 Optional: CLI `scrum-pr-body SW-XXX` druckt den Body auf stdout (für gh CLI-Pipe)
- C4.5 Mirror in `src/cli/templates/scrum_workflow/skills/`

## Dependencies

- **Vorgelagert:** EP-002 (Schemas), EP-003 (AC-IDs als Voraussetzung für Mapping), EP-004 (Findings mit `ac_ref`)
- **Nachgelagert:** EP-010 (Quality Scoring kann pro-AC-Status aggregieren), EP-011 (Self-Reference validiert eigene Traceability)

## Success Metrics

- **100 % AC-Coverage**: jede AC in jeder Story mit Status ≥ `in-progress` hat `files:` non-empty (oder `verification_type: manual`)
- **100 % Test-Coverage für non-manual ACs**: jede AC ohne `verification_type: manual` hat ≥1 Test
- **PR-Body-Adoption**: ≥80 % der PRs aus `scrum_workflow`-managed Stories verwenden den generierten Body (manuelle Bodies bleiben erlaubt aber selten)
- **Time-to-Audit < 5 Min**: ein Compliance-Mitarbeiter kann für eine beliebige Story den vollständigen Audit-Pfad in unter 5 Minuten aus `traceability.yaml` rekonstruieren
