# ROADMAP.md

# Dynamic Scrum Intelligence Framework — Roadmap

**Von MVP zu Delivery Operating System**

---

## Lesehinweis

Diese Roadmap verbindet den aktuellen Stand (v1.2.0) mit der langfristigen Vision.
Sie definiert konkrete Phasen mit messbaren Ergebnissen.

Referenzen:
- Vision: `docs/vision/vision.md`
- Operational Reference: `docs/vision/project_reference.md`
- Architecture: `docs/vision/quelle.md`

---

# Aktueller Stand (v1.2.0) — Was heute funktioniert

| Bereich | Status |
|---------|--------|
| CLI Installer (install/update/status/validate) | Fertig |
| 10 Slash-Commands definiert | Fertig |
| 3 Refinement-Agents (Architect, Developer, QA) | Fertig |
| Story-Lifecycle (9 States, guarded transitions) | Definiert, nicht enforced |
| Multi-Platform Support (6 Plattformen) | Fertig |
| Wideband Delphi Estimation | Definiert |
| Write Boundaries per Command | Definiert |
| 14 Workflows spezifiziert | Definiert (Markdown) |
| 7 Skills spezifiziert | Definiert, nicht implementiert |
| Project Context Generation | Fertig |
| Research Commands (technical/general) | Fertig |
| Documentation Generation | Fertig |

**Kernlücke:** Skills sind spezifiziert aber nicht implementiert. State Machine ist designed aber nicht enforced. Human Approval Gate ist dokumentiert aber nicht ausführbar.

---

# Phase 1 — Foundation Hardening (MVP Completion)

**Ziel:** Den bestehenden Story-Lifecycle von Ende zu Ende zuverlässig ausführbar machen.

**Zeitrahmen:** 4-6 Wochen

## 1.1 Skill-Implementierung (Kern-Skills)

Priorität: Die Skills, die den Story-Lifecycle tragen.

| Skill | Zweck | Priorität |
|-------|-------|-----------|
| `status-guard-validation` | State Machine Enforcement — verhindert ungültige Transitions | Kritisch |
| `prerequisite-validation` | Prüft ob erforderliche Artifacts existieren | Kritisch |
| `story-validation` | Validiert YAML Frontmatter der Story | Kritisch |
| `readiness-check` | 4-Check Validation Gate vor Dev | Hoch |
| `guided-mode` | Erkennt vage Eingaben, stellt Rückfragen | Hoch |
| `synthesis` | Merged Agent-Perspektiven mit Deduplikation | Mittel |
| `feedback-collection` | Sammelt User-Feedback strukturiert | Mittel |

**Ergebnis:** Stories können nicht mehr in ungültige Zustände geraten. Fehlende Artifacts blockieren Transitions.

## 1.2 Human Approval Gate

Das wichtigste fehlende Stück im aktuellen Workflow.

- [ ] `/scrum-approve` Command erstellen
- [ ] Approval-Artifact mit Timestamp, Approver, Entscheidung
- [ ] Transition `review → approved` nur mit Approval-Artifact
- [ ] Transition `approved → done` nur mit explizitem Human-Gate
- [ ] Rejection-Flow: `review → changes-needed` mit Begründung

**Ergebnis:** Kein Work Item erreicht `done` ohne menschliche Entscheidung.

## 1.3 Plan Enforcement

- [ ] `/scrum-dev-story` validiert, dass `plan.md` existiert und approved ist
- [ ] Plan-Artifact wird Pflicht vor Implementierung
- [ ] Implementer darf Story-Spec nicht modifizieren (Write Boundary enforced)

**Ergebnis:** Spec-First und Plan-First sind nicht nur Prinzipien, sondern technisch erzwungen.

## 1.4 State Machine Runtime Enforcement

- [ ] `status-guard-validation` Skill aktiv bei jedem Status-Wechsel
- [ ] Ungültige Transitions werden blockiert mit klarer Fehlermeldung
- [ ] Audit-Trail: Jede Transition wird mit Timestamp und Auslöser geloggt

**Ergebnis:** Die 9-State State Machine ist nicht nur dokumentiert, sondern enforced.

### Phase 1 — Definition of Done

- [ ] Alle 7 Skills implementiert und testbar
- [ ] Story kann den kompletten Lifecycle durchlaufen: `draft → done`
- [ ] Human Approval ist Pflicht für `done`
- [ ] Plan ist Pflicht für `in-progress`
- [ ] Ungültige State Transitions werden blockiert
- [ ] Mindestens 3 Stories erfolgreich End-to-End durchgelaufen

---

# Phase 2 — Memory und Continuity

**Ziel:** Projekt-Wissen überlebt Sessions. Entscheidungen gehen nicht verloren.

**Zeitrahmen:** 4-6 Wochen nach Phase 1

## 2.1 Decision Memory

- [ ] `decision_record` Artifact-Type implementieren
- [ ] `/capture-decision` Command erstellen
- [ ] Entscheidungen werden automatisch bei Story-Approval erfasst
- [ ] Entscheidungen sind durchsuchbar und referenzierbar

## 2.2 Session Memory

- [ ] `/session-start` Command: Lädt aktiven Kontext (offene Work Units, letzte Session)
- [ ] `/wrap-up` Command: Erstellt Session-Summary als Artifact
- [ ] Session-Summary enthält: was wurde gemacht, was ist offen, was sind nächste Schritte
- [ ] Nächste Session kann vorherige Summary laden

## 2.3 Risk Memory

- [ ] `risk_note` Artifact-Type implementieren
- [ ] Risiken aus Refinement werden automatisch extrahiert und gespeichert
- [ ] `/risk-check` Command: Zeigt aktive Risiken für aktuelle Story/Komponente
- [ ] Risiken werden bei Review geprüft

## 2.4 Memory Storage

Technische Entscheidung für Phase 2:

- **Format:** Markdown-Files mit YAML Frontmatter (konsistent mit Framework)
- **Speicherort:** `_scrum-output/memory/` mit Unterordnern: `decisions/`, `sessions/`, `risks/`
- **Retrieval:** Dateiname-basiert + YAML-Frontmatter-Tags für einfache Suche
- **Kein Embedding/Vector-Store im MVP** — zu komplex, File-basiert reicht

### Phase 2 — Definition of Done

- [ ] Entscheidungen werden erfasst und sind auffindbar
- [ ] Sessions haben Start/End mit Summary
- [ ] Risiken werden aus Refinement extrahiert
- [ ] Nächste Session kann Kontext der letzten laden
- [ ] Mindestens 5 Decision Records aus echten Stories vorhanden

---

# Phase 3 — Delivery Control und Observability

**Ziel:** Das System erkennt und verhindert Policy-Verletzungen. Delivery wird auditierbar.

**Zeitrahmen:** 4-6 Wochen nach Phase 2

## 3.1 Control Layer (Basis)

- [ ] Policy-Checks als Pre-Hooks bei kritischen Commands
- [ ] Erkennung: Implementierung ohne Plan
- [ ] Erkennung: Review ohne Verification
- [ ] Erkennung: Fehlende Artifacts bei Transition
- [ ] Erkennung: Write Boundary Violation (Agent schreibt außerhalb seiner Zone)

## 3.2 Audit Trail

- [ ] Jede Transition wird geloggt: `_scrum-output/audit/`
- [ ] Log enthält: Work Unit, von-State, nach-State, Agent, Timestamp, Artifacts
- [ ] `/delivery-audit` Command: Zeigt Audit-Trail für eine Story

## 3.3 Verification als First-Class Step

- [ ] `/scrum-verify` Command formalisieren
- [ ] Verification-Report als Pflicht-Artifact vor Review
- [ ] Automatische Checks: Tests laufen, Lint sauber, Build grün
- [ ] Manuelle Checks: Checkliste aus Plan

## 3.4 Sprint Observability

- [ ] `/sprint-status` Command: Zeigt alle offenen Work Units mit Status
- [ ] `/delivery-health` Command: Zeigt Policy-Violations, offene Risiken, ausstehende Approvals
- [ ] Einfache Metriken: Cycle Time, durchschnittliche Refinement-Runden

### Phase 3 — Definition of Done

- [ ] Policy-Verletzungen werden erkannt und gemeldet
- [ ] Audit-Trail existiert für jede Story
- [ ] Verification ist Pflicht vor Review
- [ ] Sprint-Status ist jederzeit abrufbar
- [ ] Mindestens 2 Policy-Violations wurden korrekt erkannt und blockiert

---

# Phase 4 — Dispatcher und Adaptive Workflows

**Ziel:** Das System routet Arbeit intelligent. Nicht jede Story durchläuft den gleichen Prozess.

**Zeitrahmen:** 6-8 Wochen nach Phase 3

## 4.1 Story Classifier

- [ ] Automatische Klassifikation: Typ (Feature, Bugfix, Refactor, Infrastructure)
- [ ] Automatische Risiko-Bewertung: Low / Medium / High / Critical
- [ ] Klassifikation bestimmt Workflow-Tiefe

## 4.2 Adaptive Workflow Depth

- [ ] **Light** (Low Risk): Refinement → Plan → Execute → Quick Review → Done
- [ ] **Standard** (Medium Risk): Full Lifecycle wie heute
- [ ] **Heavy** (High Risk): Extended Refinement + Security Review + Architecture Review + Full Verification
- [ ] Risiko-Schwellen konfigurierbar in `config.yaml`

## 4.3 Dispatcher (Basis)

- [ ] Zentrale Routing-Logik: Story-Typ + Risiko → Workflow-Auswahl
- [ ] Capability-Matching: Welche Agents werden aktiviert?
- [ ] Context-Loading: Welcher Kontext wird für welchen Agent geladen?
- [ ] Implementierung als Workflow-Definition (nicht als Backend-Service)

## 4.4 Erweiterte Agent-Typen

- [ ] Security Reviewer Agent (aktiviert bei auth/security-Tags)
- [ ] UX Reviewer Agent (aktiviert bei frontend/UI-Tags)
- [ ] Contract Validator Agent (prüft Spec-Einhaltung post-implementation)

### Phase 4 — Definition of Done

- [ ] Stories werden automatisch klassifiziert
- [ ] Workflow-Tiefe passt sich dem Risiko an
- [ ] Dispatcher routet korrekt zu den richtigen Agents
- [ ] Mindestens 2 neue Agent-Typen aktiv
- [ ] Config-Driven: Schwellen und Routing sind konfigurierbar

---

# Phase 5 — Delivery Vault und Knowledge Surface

**Ziel:** Menschen können das Projektwissen navigieren, inspizieren und weiterführen.

**Zeitrahmen:** 4-6 Wochen nach Phase 4

## 5.1 Delivery Vault Struktur

- [ ] Verlinkte Markdown-Struktur: Stories → Plans → Reviews → Decisions
- [ ] Jedes Artifact hat Backlinks zu verwandten Artifacts
- [ ] Navigation: Von Story zu allen zugehörigen Artifacts
- [ ] Obsidian-kompatibel (aber nicht Obsidian-abhängig)

## 5.2 Knowledge Navigation

- [ ] Index-Seiten: Alle Stories, alle Decisions, alle Risks
- [ ] Timeline-View: Chronologische Delivery-Geschichte
- [ ] Component-View: Welche Stories betreffen welche Komponenten?

## 5.3 Session und Review Surfaces

- [ ] Session-Summaries als navigierbare Dokumente
- [ ] Review-Findings aggregiert pro Komponente
- [ ] Recurring Issues sichtbar

## 5.4 Architecture Knowledge Base

- [ ] Architecture Decision Records (ADRs) als Artifact-Typ
- [ ] Architecture Notes aus Refinement automatisch extrahiert
- [ ] Architektur-Constraints als durchsuchbare Wissensbasis

### Phase 5 — Definition of Done

- [ ] Vault-Struktur existiert mit Verlinkung
- [ ] Ein Mensch kann von einer Story alle verwandten Artifacts finden
- [ ] Mindestens 10 verlinkte Stories im Vault
- [ ] ADRs werden bei Architektur-Entscheidungen erstellt

---

# Phase 6 — Advanced Memory und Consolidation

**Ziel:** Das System lernt aus vergangener Arbeit. Memory wird aktiv genutzt, nicht nur gespeichert.

**Zeitrahmen:** 6-8 Wochen nach Phase 5

## 6.1 Memory Consolidation

- [ ] Regelmäßige Zusammenfassung: Raw Notes → Approved Facts
- [ ] Unterscheidung: temporary findings vs. proposed facts vs. stable knowledge
- [ ] Memory Librarian Agent: Konsolidiert und bereinigt Memory

## 6.2 Active Memory Retrieval

- [ ] Bei Refinement: Automatisch relevante Decisions und Risks laden
- [ ] Bei Review: Automatisch ähnliche vergangene Review-Findings laden
- [ ] Bei Planning: Automatisch Lessons Learned aus ähnlichen Stories laden

## 6.3 Pattern Detection

- [ ] Wiederkehrende Review-Issues erkennen
- [ ] Häufige Risiko-Muster identifizieren
- [ ] Estimation-Accuracy über Zeit tracken

### Phase 6 — Definition of Done

- [ ] Memory wird aktiv bei Refinement, Planning und Review geladen
- [ ] Consolidation läuft regelmäßig
- [ ] Mindestens 3 Patterns automatisch erkannt

---

# Phase 7 — Multi-Runtime und Ecosystem

**Ziel:** Das Framework funktioniert zuverlässig auf mehreren Plattformen.

**Zeitrahmen:** Ongoing nach Phase 6

## 7.1 Primary Platform: Claude Code

- [ ] Claude Code ist Feature-Complete für alle Phasen
- [ ] Alle Skills, Agents und Workflows getestet
- [ ] Performance-Optimierung (Token-Budgets)

## 7.2 Secondary Platforms

- [ ] Cursor: Adapter validiert und getestet
- [ ] Windsurf: Adapter validiert und getestet
- [ ] GitHub Copilot: Adapter validiert und getestet

## 7.3 Extended Work Units

- [ ] `epic` Work Unit mit Story-Decomposition
- [ ] `debug-investigation` Work Unit
- [ ] `architecture` Work Unit mit ADR-Flow
- [ ] `release-check` Work Unit

## 7.4 Plugin-Fähigkeit

- [ ] Custom Agent Packs ladbar
- [ ] Custom Capability Definitions
- [ ] Custom Workflow-Varianten

---

# Entscheidungsregister (Roadmap-Level)

| ID | Entscheidung | Begründung |
|----|-------------|------------|
| R-001 | File-basiertes Memory (kein Vector Store im MVP) | Einfachheit, Konsistenz mit Markdown-as-Code, keine externe Abhängigkeit |
| R-002 | Claude Code als Primary Platform | Größte Kontrolle über Agent-Invocation, beste Sub-Agent-Unterstützung |
| R-003 | Dispatcher als Workflow-Definition, nicht als Backend | Vermeidet Overengineering, bleibt im Markdown-as-Code-Paradigma |
| R-004 | Keine Team-Szenarien im MVP | Solo-Developer-Workflow zuerst validieren, Team-Features nach Phase 4 evaluieren |
| R-005 | Skills vor Memory | Ohne enforced State Machine und Validation ist Memory wertlos |
| R-006 | Adaptive Workflow erst in Phase 4 | Zuerst den Standard-Flow zuverlässig machen, dann optimieren |

---

# Risiken

| Risiko | Schwere | Mitigation |
|--------|---------|------------|
| Overengineering in frühen Phasen | Hoch | Strikt an Phase 1-3 halten, keine Phase überspringen |
| Memory-Persistenz über AI-Sessions | Hoch | File-basiert starten, Komplexität schrittweise erhöhen |
| Platform-Divergenz (Adapter-Chaos) | Mittel | Claude Code als einzige Priorität bis Phase 6 abgeschlossen |
| Skill-Implementierung komplexer als erwartet | Mittel | Mit den 3 kritischen Skills starten, Feedback-Loop einbauen |
| Akzeptanz: Workflow zu schwer für kleine Tasks | Mittel | Adaptive Depth in Phase 4 adressiert das explizit |
| Markdown-as-Code skaliert nicht für Memory | Mittel | Evaluierung nach Phase 2 ob Upgrade nötig |

---

# Zusammenfassung

```text
Phase 1: Foundation Hardening     → Skills, Human Gate, State Enforcement
Phase 2: Memory und Continuity    → Decisions, Sessions, Risks
Phase 3: Control und Observability → Policy Checks, Audit, Verification
Phase 4: Dispatcher und Adaptive  → Classification, Routing, Workflow Depth
Phase 5: Vault und Knowledge      → Navigation, Linking, ADRs
Phase 6: Advanced Memory          → Consolidation, Retrieval, Patterns
Phase 7: Multi-Runtime            → Platform Validation, Extended Work Units
```

**Prinzip:** Jede Phase macht das System zuverlässiger. Keine Phase fügt Komplexität hinzu, ohne dass die vorherige Phase stabil ist.

**North Star:** Ein Delivery Operating System, bei dem AI strukturiert, nachvollziehbar und team-safe arbeitet.
