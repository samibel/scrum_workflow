---
schema_version: "1.0.0"
epic_id: "EP-009"
parent_brief: "PB-001"
title: "Non-Goals & Produkt-Positionierung"
status: planned
epic_index: "9/11"
story_count_estimate: 3
domain_tags: ["docs", "adr"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — High #3 'Produktumfang zu breit' + Review B — 'Non-Goals fehlen' + 'Brutal Truth: Workflow-Set vs. Governance-System'"
---

# Non-Goals & Produkt-Positionierung

## Purpose

Beide Reviews überschneiden sich präzise: das Repo versucht zu viel gleichzeitig (Scrum, Skills, Slash Commands, Installer, Multi-Agent-Refinement, UX-Review, Excalidraw, Research-Memory, Policy-Checks, Delivery-Health, Audit Trail, Plattform-Adapter). Review A: „Breite ohne harte Kernqualität macht das Produkt schwer erklärbar und schwer zu vertrauen." Review B: „Keine Non-Goals-Sektion — was der Agent nicht tut ist unklar → führt zu falschen Erwartungen." Brutal-Truth: „Du musst entscheiden — willst du ein Workflow-Set für dich selbst oder ein hartes Governance-System?"

Dieses Epic schärft die Positionierung: ein klares Non-Goals-Dokument, eine prägnante Tagline („Spec-to-PR Governance Layer for AI Coding Agents"), explizite Personas und Anti-Personas, und Architecture Decision Records (ADRs) die strategische Entscheidungen dokumentieren statt sie in Markdown-Prosa zu verstecken.

## User Value

- **Tech Lead, der evaluiert**: weiß nach 60 Sekunden, ob `scrum_workflow` für ihn relevant ist oder nicht.
- **Platform Engineer**: kann auf ADRs verweisen statt Entscheidungen pro Konversation neu zu rechtfertigen.
- **Contributor**: sieht Non-Goals und weiß, welche Feature-Vorschläge sinnvoll sind und welche off-topic.
- **Compliance / Audit**: hat ein dokumentiertes Set strategischer Entscheidungen statt impliziter Annahmen.

## Scope

### In-Scope

- Non-Goals-Dokument `docs/non-goals.md`: kein Jira-Ersatz, kein vollständiges ALM, kein Agent-Runtime, kein Code-Linter, kein Test-Generator, kein Auto-Deploy, kein Symbol-Search / Call-Graph (Aufgabe von IDEs)
- Positionierung schärfen: Tagline „Spec-to-PR Governance Layer for AI Coding Agents"
- Personas-Dokument `docs/personas.md`: Tech Lead, Platform Engineer, Compliance/Audit
- Anti-Personas explizit: Solo-Dev der nur Slash Commands will, Team das BMAD/Spec-Kit bevorzugt
- ADRs in `docs/adr/`:
  - `0001-spec-first-not-prompt-first.md`
  - `0002-pipeline-as-data-yaml.md`
  - `0003-markdown-vs-code-enforcement.md`
  - `0004-platform-adapter-strategy.md`
  - `0005-multi-reviewer-additive-no-veto.md` (dokumentiert das Pattern für Clean Code + Karpathy)
- Verlinkung aus README + jeder Command-Datei (Header-Section)

### Out-of-Scope

- Marketing-Website (das hier ist Repo-interne Doku)
- Detail-Vergleich vs. BMAD / Spec Kit / Cursor (nur kurzer „Wie wir uns abgrenzen"-Block)
- Roadmap als Marketing-Material (Roadmap ist die 11-Epic-Struktur selbst)
- Pricing / Lizenz-Diskussion (separate strategische Frage)

## Acceptance Criteria (Epic-Level)

- **Given** ein neuer Nutzer öffnet das Repo, **when** er README + `docs/non-goals.md` liest, **then** weiß er in unter 5 Minuten: „dieses Repo ist für Tech-Leads/Platform-Engineers, die AI Coding mit Gates orchestrieren wollen — nicht für Solo-Devs die schnell Slash Commands wollen".
- **Given** eine strategische Entscheidung (z. B. pnpm-only, state-machine.yaml als SoT), **when** sie getroffen wird, **then** existiert ein ADR im Repo der sie dokumentiert.
- **Given** ein Feature-Request der gegen Non-Goals verstößt (z. B. „bitte ein Test-Generator integrieren"), **when** ein Maintainer reagiert, **then** kann er auf `docs/non-goals.md` Punkt X verweisen statt die Diskussion erneut zu führen.
- **Given** die Tagline „Spec-to-PR Governance Layer for AI Coding Agents", **when** sie im README prominent steht, **then** spiegelt sie die strategische Nordstern-Aussage beider Reviews wider.

## Capability Breakdown

### C1 — Non-Goals-Dokument *(S, ~1 Story)*

- C1.1 `docs/non-goals.md` mit strukturierter Liste pro Kategorie:
  - **Was wir nicht sind:** Jira-Ersatz, ALM-System, Agent-Runtime
  - **Was wir nicht tun:** Code-Linting, Test-Generation, Deployment, Code-Generation-out-of-process
  - **Was wir nicht abdecken:** Symbol-Search, Call-Graph, semantischer Repo-Index
  - **Welche Use-Cases sind off-topic:** Solo-Dev-Workflows, reine Prompt-Sammlungen, IDE-Replacement
- C1.2 Verlinkung aus `README.md` (oben, vor Features) und aus jeder Command-Datei (Header-Section)
- C1.3 Begründung pro Non-Goal (warum lehnen wir das ab) für späteres Verweisen bei Feature-Requests

### C2 — Positionierung & Personas *(S, ~1 Story)*

- C2.1 Tagline „Spec-to-PR Governance Layer for AI Coding Agents" als ersten H1-Untertitel im README
- C2.2 `docs/personas.md`:
  - **Tech Lead**: will AI Coding einführen mit Gates, kein blindes Vertrauen
  - **Platform Engineer**: pflegt das Framework, integriert in CI/CD
  - **Compliance / Audit**: braucht maschinenlesbaren Audit-Trail
- C2.3 Anti-Personas explizit:
  - **Solo-Dev**: will schnelle Slash Commands, kein Gating-System
  - **Prompt-Engineer**: will lose Prompt-Sammlung
  - **BMAD-Power-User**: will Multi-Agent Story-Erstellung (BMAD ist besser dafür)
- C2.4 Kurzer „Wie wir uns abgrenzen"-Block: BMAD (creation-focused), Spec Kit (toolkit), Cursor Rules (IDE-side) — wir sind Spec-to-PR Governance dazwischen

### C3 — ADRs (Architecture Decision Records) *(M, ~1 Story)*

- C3.1 `docs/adr/0001-spec-first-not-prompt-first.md`: warum SDD-Disziplin statt loser Prompts
- C3.2 `docs/adr/0002-pipeline-as-data-yaml.md`: warum `pipeline-routing.yaml` und `state-machine.yaml` statt hartcoded
- C3.3 `docs/adr/0003-markdown-vs-code-enforcement.md`: dokumentiert den Shift von „MUST in Markdown" zu „Schemas + Validators + CI-Gates"
- C3.4 `docs/adr/0004-platform-adapter-strategy.md`: warum plattformspezifische Adapter statt naiver Copy-Logik
- C3.5 `docs/adr/0005-multi-reviewer-additive-no-veto.md`: dokumentiert Clean Code + Karpathy + UX/Security Pattern (heute committed); jeder Reviewer ist additiv, AC-Gate bleibt primär
- C3.6 ADR-Template `docs/adr/_template.md` für künftige Entscheidungen

## Dependencies

- **Vorgelagert:** keine; foundational
- **Nachgelagert:** EP-002 (`state-machine.yaml`-Entscheidung wird in ADR-0002 verewigt), EP-006 (Platform-Adapter-Strategie wird in ADR-0004 verewigt)
- **Querbezug:** heute committe Karpathy + Clean Code Reviewer werden in ADR-0005 dokumentiert

## Success Metrics

- **5 Minuten Time-to-Position**: ein neuer Nutzer kann nach 5 Min entscheiden, ob das Repo für ihn ist (verifiziert mit 2–3 Test-Lesern)
- **5+ ADRs vorhanden**: jede strategische Entscheidung ist als ADR dokumentiert
- **0 wiederkehrende Off-Topic-Issues**: Feature-Requests die gegen Non-Goals verstoßen werden mit ADR/Non-Goals-Verweis schnell geschlossen
- **Positionierung in README sichtbar**: Tagline ist erster prominenter Text nach H1
