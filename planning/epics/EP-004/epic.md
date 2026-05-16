---
schema_version: "1.0.0"
epic_id: "EP-004"
parent_brief: "PB-001"
title: "Reviewer Authority (maschinenlesbare Findings)"
status: planned
epic_index: "4/11"
story_count_estimate: 4
domain_tags: ["review", "contracts"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — Medium #6 'Reviewer Authority nicht wasserdicht'"
---

# Reviewer Authority (maschinenlesbare Findings)

## Purpose

Der aktuelle `/scrum-review-story`-Workflow produziert hochwertige Review-Reports, aber die Findings sind primär Markdown-Tabellen — schwer maschinenlesbar, schwer trackbar über Review-Iterationen hinweg. Review A formuliert das als Medium-Issue: „Ein Review-Agent braucht echte Autorität: blockierende Findings müssen maschinenlesbar sein und Statusübergänge automatisch verhindern."

Heute existieren bereits zwei adversariale Sub-Agents (`clean-code-reviewer` und der neu hinzugefügte `karpathy-guidelines-reviewer`), die Findings strukturiert produzieren. Dieses Epic baut die Schicht darunter: ein `findings.json`-Sidecar pro Review, Resolution-Tracking über Iterationen, und ein Hard-Gate in `/scrum-approve` der offene Critical-Findings nicht durchwinkt.

## User Value

- **Tech Lead**: kann ein Dashboard bauen das offene Findings pro Sprint zeigt — ohne Markdown zu parsen.
- **Reviewer-Agent**: bekommt strukturierte Vergleichsdaten („was war in Review N-1 offen?") für Resolution-Tracking, ohne den Review-Text neu zu parsen.
- **Compliance / Audit**: jedes Critical-Finding hat eine maschinenlesbare Lebenslinie von Erstellung über Resolution bis Audit-Trail.

## Scope

### In-Scope

- `findings.json`-Sidecar zu jedem `review-N.md` (gleicher Sprint-Ordner)
- Schema für `findings.json` (in EP-002 C1.3 koordiniert): Felder `id`, `severity`, `dimension`, `ac_ref`, `file`, `line`, `excerpt`, `fix`, `source` (`primary | clean-code | karpathy | ux | security`)
- Generator-Script: parst Review-Markdown-Tabelle → `findings.json` (oder Reviewer-Agent schreibt direkt strukturiert)
- Neuer Skill `findings-resolution-tracker`: vergleicht `findings.json` von Review N und N-1, klassifiziert jedes Finding als `resolved | persistent | new | regression`
- Pflicht-Tabelle „Previous Findings Resolution" in `review-(N+1).md` (Schema-validiert)
- `/scrum-approve` Hard-Gate: verweigert Approval bei offenen `Critical`-Findings (Lookup in `findings.json`)
- CI-Check: kein Merge ohne `approval-N.md` mit allen Findings resolved
- Sicherstellung dass `findings.json` `source` die Werte `clean-code` und `karpathy` enthält (Mapping aus heutigem Reviewer-Pattern)

### Out-of-Scope

- UI / Dashboard zum Anzeigen offener Findings → EP-010
- Auto-Fix von Findings (Findings bleiben deskriptiv, keine ausführbaren Patches)
- Findings-Aggregation über mehrere Sprints (`findings.json` ist Sprint-lokal)
- Cross-Story-Pattern-Detection (z. B. „dieselbe Critical-Finding tritt in 5 Stories auf")

## Acceptance Criteria (Epic-Level)

- **Given** ein `/scrum-review-story`-Lauf, **when** der Review abgeschlossen ist, **then** existiert `_scrum-output/sprints/SW-XXX/findings-N.json` mit allen Findings strukturiert, schema-validiert, und jedes Finding hat einen `source`-Wert.
- **Given** ein Re-Review (N+1) nach `changes-needed`, **when** `/scrum-review-story` läuft, **then** liest der Resolution-Tracker `findings-N.json`, klassifiziert jedes vorherige Finding, und schreibt eine Pflicht-Tabelle in `review-(N+1).md`.
- **Given** offene `Critical`-Findings in `findings-N.json`, **when** `/scrum-approve` versucht zu approven, **then** wird verweigert mit Liste der offenen Critical-Findings und Verweis auf den jeweiligen Review.
- **Given** ein PR mit Story-Änderungen, **when** die CI läuft, **then** prüft sie dass alle Findings in `findings-N.json` als `resolved` markiert sind, sonst blockiert sie den Merge.

## Capability Breakdown

### C1 — Maschinenlesbare Findings *(M, ~1 Story)*

- C1.1 `findings.json` Sidecar-Format definieren (Schema-Arbeit in EP-002 C1.3)
- C1.2 Generator-Skill `review-to-findings`: parst Review-Markdown-Tabellen → `findings.json`
- C1.3 Alternativ / komplementär: Reviewer-Agents schreiben direkt strukturiert (`clean-code-reviewer` und `karpathy-guidelines-reviewer` outputten zusätzlich JSON-Block)
- C1.4 `source`-Mapping: `primary`, `clean-code`, `karpathy`, `ux`, `security`
- C1.5 `dimension`-Erweiterung im Schema: `D1-D8` (Clean Code) und `K1-K4` (Karpathy)

### C2 — Findings-Resolution-Tracking *(M, ~1 Story)*

- C2.1 Neuer Skill `src/core/skills/findings-resolution-tracker/SKILL.md`
- C2.2 Vor `/scrum-review-story` (N+1): liest `findings-(N-1).json` aus Sprint-Ordner
- C2.3 Klassifikation: `resolved | persistent | new | regression`
- C2.4 Pflicht-Tabelle in `review-N.md`: jedes vorherige Finding → Status + Begründung
- C2.5 Schema-Validierung der Resolution-Tabelle (EP-002 C1.3)
- C2.6 Mirror in `src/cli/templates/scrum_workflow/skills/`

### C3 — Hard-Gate in `/scrum-approve` *(S, ~1 Story)*

- C3.1 `/scrum-approve` Pre-Check: liest letzte `findings-N.json`, filtert auf `severity: Critical` und `status != resolved`
- C3.2 Bei offenen Critical-Findings → Halt mit Error-Block + Liste der Findings + Verweis auf Review-File
- C3.3 CI-Check: kein Merge ohne `approval-N.md` UND alle Findings resolved (Schema-Check)
- C3.4 Dokumentation: wann darf manuell überschrieben werden (Anti-Pattern-Warning)

### C4 — Reviewer-Agent-Output strukturieren *(S, ~1 Story)*

- C4.1 `clean-code-reviewer`-Agent: zusätzlich zur Markdown-Tabelle JSON-Block am Ende des Outputs ausgeben
- C4.2 `karpathy-guidelines-reviewer`-Agent: dito
- C4.3 `review-story`-Workflow: konsolidiert Reviewer-JSON-Outputs zu `findings-N.json`
- C4.4 Test: jeder Reviewer produziert valide JSON-Output, der gegen Schema validiert
- C4.5 Mirror in `src/cli/templates/scrum_workflow/agents/`

## Dependencies

- **Vorgelagert:** EP-002 (Schema-Infrastruktur), EP-001 (stabiler Review-Workflow)
- **Nachgelagert:** EP-005 (Traceability verlinkt Findings auf ACs), EP-010 (Risk Score berechnet aus Findings-Verteilung), EP-011 (Self-Reference validiert eigene Reviewer)
- **Querbezug zu heute committeten Arbeit:** `clean-code-reviewer` und `karpathy-guidelines-reviewer` (Commit `13910c7`) werden hier mit strukturiertem Output erweitert

## Success Metrics

- **100 % Findings strukturiert**: jedes Finding in jedem Review hat einen `findings.json`-Eintrag mit allen Pflichtfeldern
- **0 verlorene Findings über Iterationen**: Resolution-Tracker erfasst 100 % der Vorgänger-Findings (keine Drop-outs zwischen Review N-1 und N)
- **0 Critical-Bypasses**: keine Approval mit offenen Critical-Findings nach Gate-Aktivierung
- **< 5 % False-Positive-Regressionen**: Resolution-Tracker klassifiziert höchstens 5 % der wieder-aufgetauchten Findings fälschlicherweise als „Regression" (vs. „dasselbe Finding wurde nie geschlossen")
