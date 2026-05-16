---
schema_version: "1.0.0"
epic_id: "EP-010"
parent_brief: "PB-001"
title: "Quality Scoring & Observability"
status: planned
epic_index: "10/11"
story_count_estimate: 3
domain_tags: ["metrics", "dashboard"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P2"
review_source: "Review A — Mid-Term Roadmap 'Quality Score als Gate' + 'Delivery-Health-Dashboard'"
---

# Quality Scoring & Observability

## Purpose

Nachdem Pipeline (EP-001), Schemas (EP-002), Reviewer-Authority (EP-004) und Traceability (EP-005) maschinenlesbare Artefakte produzieren, fehlt die Aggregations-Schicht: numerische Quality-Scores als Gates und ein Delivery-Health-Dashboard, das Trends und Anti-Patterns über mehrere Stories sichtbar macht. Review A formuliert es als Mid-Term-Roadmap-Punkt: „Quality Score als Gate — Story Readiness Score, Review Risk Score, Verification Confidence Score" sowie „Delivery-Health-Dashboard mit Anti-Pattern-Detection (Stories die zu lange in `review` hängen)".

Dieses Epic ist absichtlich später priorisiert (P2), weil es auf den maschinenlesbaren Artefakten aus EP-002, EP-004, EP-005 aufbaut. Ohne stabile Schemas wäre Scoring sinnlos.

## User Value

- **Tech Lead**: sieht auf einen Blick im Delivery-Health-Dashboard, welche Stories Risiko haben, wo die Pipeline klemmt, ob die Iteration funktioniert.
- **Reviewer/Approver**: bekommt automatische Eskalation („Risk-Score 85, zweiter Approver erforderlich") statt das selbst einschätzen zu müssen.
- **Compliance / Audit**: hat Verification-Confidence-Score pro Story als zusätzlichen Audit-Datenpunkt.

## Scope

### In-Scope

- **Verification Confidence Score**: `/scrum-verify` produziert 0–100 % Wert (Test-Coverage + Lint-Score + Type-Coverage + Build-Success)
- Score in `verification-report.md` Frontmatter (`confidence: 0.87`)
- Schwellwert (konfigurierbar, Default ≥ 75 %) als Gate für `review`-Übergang (Erweiterung EP-001 C3)
- **Review Risk Score**: Score = f(`story.risk_level`, `modified_file_count`, `findings_count`, `code_complexity_delta`)
- Score in `review-N.md` Frontmatter (`risk_score: 0.62`)
- Score > X → `/scrum-approve` fordert zweiten Approver (`required_approvers: 2` in Frontmatter)
- **Delivery-Health-Dashboard**: Erweiterung von `/scrum-delivery-health` Command
- Trend-Metriken: Cycle Time pro Status, Iterationen pro Story, Anteil grüne vs. rote Verifications
- Anti-Pattern-Detection: Stories > 7 Tage in `review`, Stories mit > 3 Review-Iterationen, häufig wieder-auftauchende Findings
- Output: HTML/MD-Tabelle in `_scrum-output/dashboards/`

### Out-of-Scope

- Echtzeit-Dashboard (Pull-basiert, kein Server)
- Externe Metrik-Systeme (Grafana, Datadog) — nur lokale Artefakte
- ML-basiertes Scoring (deterministische Formeln reichen)
- Score-Tuning-UI (Schwellwerte werden via Config-File gesetzt)

## Acceptance Criteria (Epic-Level)

- **Given** ein `/scrum-verify`-Lauf, **when** er fertig ist, **then** enthält `verification-report.md` Frontmatter `confidence: <float 0..1>` mit Begründung im Body.
- **Given** ein konfigurierter Schwellwert von 0.75, **when** eine Verification mit `confidence: 0.60` läuft, **then** verweigert der Status-Guard den Übergang nach `review` mit Verweis auf den Score.
- **Given** ein `/scrum-review-story`-Lauf, **when** der Review abgeschlossen ist, **then** enthält `review-N.md` Frontmatter `risk_score: <float 0..1>` und ggf. `required_approvers: 2`.
- **Given** ein Sprint mit 10 Stories, **when** `/scrum-delivery-health` läuft, **then** produziert es eine Tabelle mit Cycle-Time-Median, Iterationen-Verteilung, und Anti-Pattern-Liste (z. B. „SW-007 ist seit 14 Tagen in `review` — Eskalation").

## Capability Breakdown

### C1 — Verification Confidence Score *(M, ~1 Story)*

- C1.1 `/scrum-verify`-Workflow erweitert: am Ende Score berechnen
- C1.2 Score-Formel: gewichteter Durchschnitt aus Test-Pass-Rate (0.4), Lint-Score (0.2), Type-Coverage (0.2), Build-Success (0.2)
- C1.3 Score in `verification-report.md` Frontmatter + Begründung im Body
- C1.4 Schwellwert in `src/core/data/quality-thresholds.yaml` (neue Datei), Default `verification_min: 0.75`
- C1.5 Status-Guard-Erweiterung: Score < Schwellwert → `review`-Übergang verweigert
- C1.6 Mirror in `src/cli/templates/scrum_workflow/`

### C2 — Review Risk Score *(M, ~1 Story)*

- C2.1 Score-Formel: gewichtet aus `risk_level` (Enum → Zahl), `modified_file_count`, `findings_count` (gewichtet nach Severity), `code_complexity_delta` (optional, falls Tool verfügbar)
- C2.2 Score in `review-N.md` Frontmatter
- C2.3 Bei Score > 0.7 → `required_approvers: 2` in Frontmatter setzen
- C2.4 `/scrum-approve` Pre-Check: prüft `required_approvers` und blockiert wenn nicht erfüllt
- C2.5 Schwellwerte in `quality-thresholds.yaml`

### C3 — Delivery-Health-Dashboard *(L, ~1 Story)*

- C3.1 `/scrum-delivery-health` Command erweitern: neue Sektionen
- C3.2 Metriken: Cycle-Time pro Status (Median, P90), Iterationen pro Story (Histogramm), Verification-Pass-Rate
- C3.3 Anti-Pattern-Detection-Regeln:
  - Story > 7 Tage in `review` → Flag
  - Story mit > 3 Review-Iterationen → Flag
  - Finding tritt in > 3 Stories auf (Cross-Story-Pattern) → Flag
  - Verification-Confidence-Score-Trend fallend über letzte 5 Stories → Flag
- C3.4 Output: Markdown-Tabelle in `_scrum-output/dashboards/health-YYYY-MM-DD.md`, optional HTML-Variante
- C3.5 Mirror in `src/cli/templates/scrum_workflow/commands/`

## Dependencies

- **Vorgelagert:** EP-001 (Verify-Gate stabil), EP-002 (Schemas für Score-Frontmatter), EP-004 (Findings für Risk-Score), EP-005 (Traceability für Cross-Story-Patterns)
- **Nachgelagert:** keine direkten; Quality Scoring ist eine Endschicht
- **Querbezug:** EP-007 (Adaptive Depth profitiert von Risk-Score-Input)

## Success Metrics

- **100 % Stories mit Verification-Score** nach Aktivierung
- **100 % Reviews mit Risk-Score** nach Aktivierung
- **< 10 % False-Positive-Eskalationen**: zweiter Approver wird nur bei tatsächlich riskanten Stories gefordert
- **Dashboard-Adoption**: Tech Lead konsultiert Dashboard mindestens 1× pro Sprint (qualitative Metrik)
- **Anti-Pattern-Detection-Hit-Rate ≥ 80 %**: bekannte langlaufende Stories werden vom Dashboard markiert
