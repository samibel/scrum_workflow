---
schema_version: "1.0.0"
brief_id: "PB-001"
title: "scrum_workflow Hardening — From Workflow Set to Spec-to-PR Governance Layer"
status: captured
idea: "Härte scrum_workflow von einem dokumentationslastigen Workflow-Set zu einem Spec-to-PR Governance Layer mit ausführbaren Gates, maschinenlesbaren Artefakten und ehrlichen Plattform-Adaptern."
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: captured
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
personas:
  - "Tech Lead — will AI Coding ohne Vertrauensverlust einführen"
  - "Platform Engineer — pflegt und erweitert das Framework"
  - "Compliance / Audit — braucht nachweisbare Gates für AI-generated code"
goals:
  - "Golden Path: keine Bypass-Möglichkeit zwischen in-progress und review ohne /scrum-verify"
  - "Artifacts schema-validiert: story.md, plan.md, review-N.md, approval-N.md, verification-report.md, refinement.md"
  - "Source-to-Spec Traceability: jede AC verlinkt auf Code, Test, Findings"
  - "Plattform-Adapter-Claims ehrlich pro Plattform (Claude Code ≠ Cursor ≠ Copilot ≠ Codex)"
  - "Story-Template hart: Non-goals, Edge Cases, Rollback, Observability, Security, Migration, Test Matrix als Pflicht"
non_goals:
  - "Kein Jira-Ersatz und kein vollständiges ALM-System"
  - "Kein Agent-Runtime-Ersatz für Claude Code / Cursor / Copilot"
  - "Kein Code-Linter, kein Test-Generator, kein Auto-Deployment"
  - "Kein Symbol-Search / Call-Graph / Repo-Intelligence (Aufgabe von IDEs)"
  - "Kein Review reiner Deployment-Konfigurationen ohne Spec-Bezug"
open_questions: []
assumptions:
  - "pnpm ist der einzige Package Manager (npm-Lockfile wird entfernt)"
  - "state-machine.yaml wird als Single Source of Truth eingeführt; standards.md-Tabelle wird daraus generiert"
  - "verification-report.md folgt der Markdown+YAML-Frontmatter-Konvention analog zu review-N.md"
  - "Bestehende epic.md / story.md / review-N.md Konventionen werden wiederverwendet, nicht ersetzt"
risks:
  - "Schema-Migration für bestehende _scrum-output/sprints/*/story.md könnte legacy-Stories invalidieren"
  - "pnpm-Migration kann CI-Pipelines brechen (npm-zentriert)"
  - "Strikter Golden Path mit Verify-Gate kann Adoption verlangsamen, wenn Tests im Stack unzuverlässig sind"
  - "Multiple Always-On Reviewer (Clean Code + Karpathy + Security + UX) erhöhen Token-Kosten pro Review"
interview_rounds: 0
---

# scrum_workflow Hardening — From Workflow Set to Spec-to-PR Governance Layer

## Raw Idea

Zwei strategische Reviews — ein Chat-Review (intern, kritisch) und ein Word-Doc-Review (`4d97ef8d-SpecDriven_AI_Review_Agent…docx`) — attestieren `scrum_workflow` konzeptionelle Stärke, aber ungenügende Runtime-Härtung. Zu viele Regeln leben als Markdown, der Golden Path bypasst `/scrum-verify`, Plattform-Adapter-Claims sind unscharf, Story-Templates fehlen Pflicht-Sektionen, Source-to-Spec-Traceability ist nicht maschinenlesbar. Beide Reviews enden mit derselben Empfehlung: vom „Workflow-Set" zum „Spec-to-PR Governance Layer for AI Coding Agents".

## Problem Statement

AI Coding Agents produzieren heute Code, ohne dass ein Team objektiv prüfen kann, ob Spec, Implementation, Verification, Review und Human Approval lückenlos durchlaufen wurden. `scrum_workflow` adressiert dieses Problem konzeptionell — aber die Gates sind Markdown-Regeln, keine ausführbaren Guards. Ein Agent kann eine Story als "fertig" markieren, bevor Tests, Lint, Build oder Review tatsächlich gelaufen sind. Genau diese Lücke untergräbt Vertrauen in Status, Audit Trail und Definition of Done.

## Target Personas

- **Tech Lead**: will AI Coding einführen, ohne dass das Team in „der Agent hat's schon geprüft"-Theater abrutscht. Braucht harte Gates, keine Marketing-Begriffe.
- **Platform Engineer**: pflegt das Framework, integriert es in CI/CD, muss Sync-Probleme zwischen Markdown-Quellen und Runtime-Verhalten beheben können.
- **Compliance / Audit**: braucht maschinenlesbaren Audit Trail (welcher Commit erfüllt welche AC? Wer hat wann approved? Welche Findings wurden geschlossen?) für regulierte Umgebungen.

## Goals

1. **Golden Path ist nicht umgehbar** — keine Pipeline-Edge führt von `in-progress` zu `review` ohne `/scrum-verify` mit pass-Status.
2. **Alle Artefakte sind schema-validiert** — `story.md`, `plan.md`, `review-N.md`, `approval-N.md`, `verification-report.md`, `refinement.md` haben JSON-Schemas in `contracts/schemas/` und werden per CLI + CI validiert.
3. **State Machine hat eine Single Source of Truth** — `state-machine.yaml`; `standards.md`-Tabelle, `pipeline-routing.yaml`, und Command-Frontmatter werden daraus generiert oder geprüft.
4. **Reviewer-Findings sind maschinenlesbar** — `findings.json`-Sidecar zu jedem Review, mit `id`, `severity`, `ac_ref`, `file:line`, `source` (primary / clean-code / karpathy / ux / security).
5. **AC → Code → Test → Finding ist verfolgbar** — `traceability.yaml` pro Sprint, generierter PR-Body mit AC×Status-Tabelle.
6. **Plattform-Adapter sind ehrlich** — Claude Code ≠ Cursor ≠ Copilot ≠ Codex; jede Plattform bekommt einen eigenen Generator mit dokumentierter Capability-Matrix.
7. **Story-Template ist hart** — Non-goals, Edge Cases, Out-of-Scope, Rollback, Observability, Security/Privacy, Migration, Test Matrix als Pflichtsektionen mit AC-IDs.

## Non-Goals

- Kein Jira-Ersatz, kein vollständiges ALM-System
- Kein Agent-Runtime-Ersatz für Claude Code, Cursor, Copilot, Codex
- Kein Code-Linter, kein Test-Generator, kein Auto-Deployment
- Kein Symbol-Search / Call-Graph / semantischer Repo-Index (Aufgabe von IDEs und SCA-Tools)
- Kein Review reiner Deployment-Konfigurationen ohne Spec-Bezug

## Key Capabilities

Diese Capabilities werden in 11 Epics dekomponiert (`planning/epics/EP-001` … `EP-011`):

1. **Pipeline Integrity** — Golden-Path-Fix, Bypass-Schutz im Status-Guard
2. **Runtime Enforcement Layer** — Artifact-Schemas, Validator-CLI, Write-Boundary-Enforcer, Status-Transition-Enforcer, CI-Gates
3. **Story-Template-Härtung** — Pflichtsektionen, AC-Typisierung, Readiness-Score
4. **Reviewer Authority** — maschinenlesbare Findings, Resolution-Tracking, Critical-Findings-Hard-Gate
5. **Source-to-Spec Traceability** — AC↔Code↔Test↔Findings, PR-Body-Generator
6. **Platform Adapter Hardening** — Capability-Matrix, plattformspezifische Generatoren, ehrliche Claims
7. **Modular Skills & Token-Disziplin** — Lazy-Loading, context-fork für Critics, aggressivere Adaptive Depth
8. **Repo-Hygiene & Test-Infrastruktur** — pnpm-only, Root-Tests, CI-Matrix
9. **Non-Goals & Positionierung** — Non-Goals-Dokument, Tagline, ADRs
10. **Quality Scoring & Observability** — Verification Confidence Score, Review Risk Score, Delivery-Health-Dashboard
11. **Self-Reference** — scrum_workflow wendet seine Disziplin auf sich selbst an

## Assumptions

- **pnpm-only**: `npm`-Lockfile (`package-lock.json` in `src/cli/`) wird entfernt, pnpm-workspace bleibt. (User-Entscheidung)
- **`state-machine.yaml` als SoT**: Neue Datei in `src/core/data/`; alle anderen Status-Quellen werden daraus generiert oder synchronisiert. (User-Entscheidung)
- **verification-report Format**: Markdown mit YAML-Frontmatter, analog zu `review-N.md` (nicht reines JSON/YAML). (User-Entscheidung)
- **Additive Reviewer-Pattern bleibt**: Clean Code Reviewer und Karpathy Guidelines Reviewer (heute committed) bleiben additive, ohne Veto.
- **Bestehende Conventions wiederverwendet**: epic.md / story.md / review.md / approval.md Templates aus `src/core/templates/` werden nicht neu erfunden, nur erweitert.

## Risks

- **R1 (Major):** Schema-Migration für bestehende `_scrum-output/sprints/*/story.md` könnte Legacy-Stories invalidieren. *Mitigation:* `schema_version`-Feld respektieren, alte Stories als `schema_version: "0.x"` markieren, Migration-Skript.
- **R2 (Major):** pnpm-Migration kann CI-Pipelines brechen, falls externe Workflows `npm`-zentriert sind. *Mitigation:* CI-Pipelines vor Lockfile-Löschung migrieren (EP-008 vor EP-002 Tests).
- **R3 (Major):** Strikter Golden Path mit Verify-Gate verlangsamt Adoption, wenn der Verify-Schritt im Zielprojekt unzuverlässig ist (flaky tests, fehlende Lint-Config). *Mitigation:* `/scrum-verify` muss gut konfigurierbar sein und klare Fehler-Meldungen liefern.
- **R4 (Medium):** Drei adversariale Reviewer (Clean Code + Karpathy + Security/UX nach Tags) erhöhen Token-Kosten und Review-Dauer signifikant. *Mitigation:* Aggressive Adaptive Depth (EP-007), `light`-Default für Bugfix/Low-Risk-Stories.
- **R5 (Medium):** `state-machine.yaml` als SoT erfordert Refactor mehrerer bestehender Stellen (`standards.md`, `pipeline-routing.yaml`, Command-Frontmatter, Tests). Hoher Aufwand bei wenig sichtbarem Outcome. *Mitigation:* Schrittweise, mit Snapshot-Tests die alte und neue Quelle parallel prüfen.

## Open Questions

Keine offenen Fragen aktuell. Alle vier strategischen Entscheidungen wurden geklärt (pnpm, state-machine.yaml, Markdown+YAML, Epic-Split in `planning/epics/`).

## Interview Transcript

### Runde 1 — 2026-05-16 (manuell, ohne `/scrum-create-brief` Interview)

Dieser Brief wurde nicht via `/scrum-create-brief` Interview erstellt, sondern manuell aus zwei vorhandenen Reviews abgeleitet:

- **Review A**: Chat-Review (intern), kritisch zum aktuellen `scrum_workflow`-Repo-Zustand, Scorecard 3.2/5
- **Review B**: Word-Dokument `4d97ef8d-SpecDriven_AI_Review_Agent___RepositoryDesign__vollsta_ndige_Review.docx`, Scorecard 26/50 (52 %)

Die strategische Synthese beider Reviews ergab den Nordstern „Spec-to-PR Governance Layer for AI Coding Agents" und die 11-Epic-Roadmap. Vier strategische Entscheidungen wurden vom Nutzer bestätigt:

1. pnpm (nicht npm) als Package Manager
2. `state-machine.yaml` als Single Source of Truth
3. Markdown + YAML-Frontmatter für `verification-report`
4. Epic-Split in `planning/epics/EP-001` … `EP-011`

Beide Reviews liegen als Quelldokumente vor (`docx` im Upload-Verzeichnis; Chat-Review in Konversationshistorie).
