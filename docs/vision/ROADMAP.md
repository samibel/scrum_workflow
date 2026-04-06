# ROADMAP.md

# Dynamic Scrum Intelligence Framework — Roadmap

**Von MVP zu Delivery Operating System**

---

## Lesehinweis

Diese Roadmap verbindet den aktuellen Stand (v1.2.0) mit der langfristigen Vision.
Sie definiert konkrete Phasen mit messbaren Ergebnissen.

**Wichtig:** Dieses Framework nutzt **Markdown-as-Code** — Skills, Workflows und Agents sind Markdown-Spezifikationen, die Claude als Runtime liest und ausführt. Eine „implementierte Skill" ist eine SKILL.md, die von Workflows referenziert und von Claude befolgt wird. Es gibt keinen separaten Code-Layer.

Referenzen:
- Vision: `docs/vision/vision.md`
- Operational Reference: `docs/vision/project_reference.md`

---

# Aktueller Stand (v1.2.0) — Was heute funktioniert

## Fertig (produktiv nutzbar)

| Bereich | Details |
|---------|---------|
| **CLI Installer** | install/update/status/validate für 6 Plattformen (JS) |
| **10 Slash-Commands** | create-ticket, refine-ticket, refine-story, dev-story, review-story, create-project-context, create-project-docs, create-architecture-docs, research-general, research-technical |
| **3 Refinement-Agents** | Architect, Developer, QA — mit isoliertem Kontext (read-bounded) |
| **14 Workflows** | Vollständige Prozess-Spezifikationen inkl. Skill-Referenzen |
| **7 Skills** | status-guard-validation, prerequisite-validation, story-validation, readiness-check, guided-mode, synthesis, feedback-collection |
| **Write Boundary Rules** | Jede Phase hat definierte Read/Write-Grenzen pro Agent |
| **Wideband Delphi Estimation** | Fibonacci-Skala, Varianz-Threshold (2), Re-Estimation-Runden, Median-Berechnung, Confidence-Level |
| **Domain Detection** | Keywords → Domain-Mapping (backend, frontend, testing, devops, architecture) → kontextuelle Anreicherung |
| **Project Context Generation** | Analysiert Codebase, generiert context/ und skills/ Dateien |
| **Research Commands** | Technical + General Research mit Plan-Then-Execute Pattern |
| **Documentation Generation** | Business Logic Docs + Architecture Docs |
| **Refinement Cross-Talk** | Bis zu 3 Diskussionsrunden mit Blocker-Klassifikation und early-exit-on-consensus |
| **Config-System** | Platform, active_agents, token_budgets, refinement_max_rounds, estimation_variance_threshold, security_auto_blocker |

## Implementiert, aber mit Lücken zur Vision

| Bereich | Was funktioniert | Was fehlt (Vision-Gap) |
|---------|-----------------|----------------------|
| **State Machine (9 States)** | `status-guard-validation` Skill prüft Status vor jedem Command. Klare Fehlermeldungen bei ungültigen Transitions. | Kein zentrales Transitions-Log. Manuelle Datei-Edits können Guards umgehen. Kein Rollback. |
| **Human Approval Gate** | Approval-Workflow spezifiziert. Template für Approval-Artifact vorhanden (`approval-N.md`). Status `approved → done` nur manuell. | Kein `/scrum-approve` Command. Approval-Entscheidung passiert außerhalb des Systems. Kein strukturierter Rejection-Flow. |
| **Plan Enforcement** | `readiness-check` Skill validiert 4 Kriterien und erstellt `plan.md`. `dev-story` Workflow prüft Status `ready-for-dev`. | Keine explizite Prüfung ob `plan.md` existiert vor Implementierung. Write Boundary für Implementer spezifiziert aber nicht automatisch enforced. |
| **Review als separater Schritt** | `/scrum-review-story` nutzt separates Modell. 5 Review-Kriterien. Ergebnis: `approved` oder `changes-needed`. | Review-Findings werden nicht aggregiert. Keine Verknüpfung zu vorherigen Reviews derselben Komponente. |
| **Feedback Tracking** | Refinement erfasst User-Entscheidungen (accept/reject) pro Agent mit Timestamps, Kommentaren und Acceptance-Rate. | Feedback nur in `refinement.md` — nicht als eigenständiges, durchsuchbares Artifact. |
| **Agent Bounded Authority** | Agents erhalten isolierten Kontext (kein Agent sieht andere Rollen-Definitionen). Write Boundaries pro Phase dokumentiert. | Keine technische Durchsetzung der Write Boundaries — Verlässt sich auf Workflow-Instruktionen. |
| **Verification** | `/scrum-refine-story` als Validation-Gate mit 5 immutablen Kriterien (Feature List as Immutable Contract). | Kein separater `/scrum-verify` Command für Post-Implementation-Verification. Kein automatischer Test/Lint/Build-Check. |

## Nicht implementiert

| Bereich | Status |
|---------|--------|
| Decision Records (eigenständiges Artifact) | Nicht vorhanden |
| Risk Notes (eigenständiges Artifact) | Nicht vorhanden |
| Session Memory (start/wrap-up) | Nicht vorhanden |
| Zentraler Audit Trail | Nicht vorhanden |
| Story Classifier (Typ/Risiko) | Nicht vorhanden |
| Adaptive Workflow Depth | Nicht vorhanden — alle Stories durchlaufen identischen 6-Phasen-Workflow |
| Dispatcher als Routing-Engine | Statisch — immer 3 Agents, keine Variation |
| Capability System | Nicht vorhanden — kein `backend.spring-boot` Gating |
| Delivery Vault mit Verlinkung | Nicht vorhanden |
| Memory Consolidation | Nicht vorhanden |

---

# Phase 1 — Foundation Hardening (Lücken schließen)

**Ziel:** Die bestehenden Features so absichern, dass der Story-Lifecycle End-to-End zuverlässig funktioniert. Kein neues Feature — bestehende Features robust machen.

**Zeitrahmen:** 3-4 Wochen

## 1.1 Human Approval Gate formalisieren

Approval-Workflow und Template existieren, aber es fehlt der Command-Einstiegspunkt.

- [ ] `/scrum-approve` Command erstellen (command.md + Workflow-Integration)
- [ ] Approval-Workflow in den Slash-Command-Katalog aufnehmen
- [ ] Rejection-Flow: `review → changes-needed` mit strukturierter Begründung
- [ ] Approval-Artifact wird Pflicht-Prüfung für `approved → done` Transition

**Delta:** Workflow + Template existieren. Es fehlt nur der Command-Trigger und die Transition-Prüfung.

## 1.2 Plan Enforcement absichern

- [ ] `prerequisite-validation` Skill um explizite `plan.md`-Existenzprüfung vor `/scrum-dev-story` erweitern
- [ ] Write Boundary Violation Detection: Warnung wenn Implementer story.md ändert
- [ ] `readiness-check` → `plan.md` Erstellung als atomaren Schritt dokumentieren

**Delta:** Readiness-Check erstellt plan.md. Es fehlt die Rückwärts-Prüfung in dev-story.

## 1.3 State Machine Härtung

- [ ] Status-History-Feld in Story Frontmatter: Array mit `[{from, to, timestamp, trigger}]`
- [ ] `status-guard-validation` Skill um History-Logging erweitern
- [ ] Warnung bei manueller Frontmatter-Änderung (Hash-Check des Status-Felds)

**Delta:** Guards funktionieren. Es fehlt History-Tracking und Tamper-Detection.

## 1.4 End-to-End Validation

- [ ] Mindestens 3 Stories komplett durchlaufen: `draft → done`
- [ ] Jeden Workflow-Schritt auf Konsistenz mit Skills prüfen
- [ ] Fehlende Skill-Referenzen in Workflows identifizieren und beheben
- [ ] Edge Cases testen: Was passiert bei `changes-needed` → Re-Implementation → Re-Review?

### Phase 1 — Definition of Done

- [x] 7 Skills spezifiziert und von Workflows referenziert
- [x] State Machine Guards aktiv bei jedem Command
- [ ] `/scrum-approve` Command existiert und ist nutzbar
- [ ] Status-History wird bei jeder Transition geloggt
- [ ] plan.md wird vor `/scrum-dev-story` geprüft
- [ ] 3 Stories erfolgreich End-to-End durchgelaufen
- [ ] `changes-needed` Cycle getestet

---

# Phase 2 — Memory und Continuity

**Ziel:** Projekt-Wissen überlebt Sessions. Entscheidungen gehen nicht verloren.

**Zeitrahmen:** 4-6 Wochen nach Phase 1

## 2.1 Decision Memory

Aktuell werden Entscheidungen nur als Teil von `refinement.md` (Feedback Record) erfasst — nicht als eigenständiges, durchsuchbares Artifact.

- [ ] `decision_record` Artifact-Type definieren (Template + YAML Frontmatter)
- [ ] `/capture-decision` Command erstellen
- [ ] Automatische Extraktion: Entscheidungen aus Refinement-Feedback in Decision Records überführen
- [ ] Entscheidungen sind per Ticket-ID und Tag durchsuchbar

## 2.2 Session Memory

- [ ] `/session-start` Command: Lädt aktiven Kontext (offene Work Units, letzte Session)
- [ ] `/wrap-up` Command: Erstellt Session-Summary als Artifact
- [ ] Session-Summary enthält: was wurde gemacht, was ist offen, nächste Schritte
- [ ] Nächste Session kann vorherige Summary laden

## 2.3 Risk Memory

Risiken tauchen in Refinement-Perspektiven auf (Architect-Agent identifiziert Risiken), werden aber nicht persistent gespeichert.

- [ ] `risk_note` Artifact-Type definieren (Template + YAML Frontmatter)
- [ ] Automatische Extraktion: Risiken aus Architect-Perspektive in Risk Notes überführen
- [ ] `/risk-check` Command: Zeigt aktive Risiken für aktuelle Story/Komponente
- [ ] Risiken werden bei Review automatisch als Kontext geladen

## 2.4 Memory Storage

- **Format:** Markdown-Files mit YAML Frontmatter (konsistent mit Framework)
- **Speicherort:** `_scrum-output/memory/` mit Unterordnern: `decisions/`, `sessions/`, `risks/`
- **Retrieval:** Dateiname-basiert + YAML-Frontmatter-Tags für einfache Suche
- **Kein Embedding/Vector-Store im MVP** — zu komplex, File-basiert reicht

### Phase 2 — Definition of Done

- [ ] Decision Records werden bei Approval automatisch aus Refinement extrahiert
- [ ] Sessions haben Start/End mit Summary
- [ ] Risiken werden aus Architect-Perspektive extrahiert
- [ ] Nächste Session kann Kontext der letzten laden
- [ ] Mindestens 5 Decision Records aus echten Stories vorhanden

---

# Phase 3 — Delivery Control und Observability

**Ziel:** Das System erkennt und verhindert Policy-Verletzungen. Delivery wird auditierbar.

**Zeitrahmen:** 4-6 Wochen nach Phase 2

## 3.1 Control Layer (Basis)

Aktuell prüft `status-guard-validation` nur den Status. Die Vision sieht einen breiteren Control Layer vor.

- [ ] Policy-Checks als eigene Skill-Kategorie definieren
- [ ] Erkennung: Implementierung ohne Plan (prerequisite-validation erweitern)
- [ ] Erkennung: Review ohne vorherige Verification
- [ ] Erkennung: Fehlende Artifacts bei Transition (über required_artifacts in Frontmatter)
- [ ] Erkennung: Write Boundary Violation (Agent schreibt außerhalb seiner Zone)

## 3.2 Zentraler Audit Trail

Aktuell: Timestamps in einzelnen Artifacts verteilt. Kein zentrales Log.

- [ ] `_scrum-output/audit/` Verzeichnis mit einem Log pro Story
- [ ] Log enthält: Work Unit, von-State, nach-State, Agent, Timestamp, Artifacts
- [ ] Automatische Einträge bei jeder Status-Transition
- [ ] `/delivery-audit SW-XXX` Command: Zeigt Audit-Trail für eine Story

## 3.3 Post-Implementation Verification

Aktuell: `/scrum-refine-story` validiert Pre-Dev (Readiness). Post-Dev Verification fehlt.

- [ ] `/scrum-verify` Command erstellen
- [ ] Verification-Report als Pflicht-Artifact vor Review
- [ ] Automatische Checks: Tests laufen, Lint sauber, Build grün
- [ ] Manuelle Checks: Checkliste aus Plan abgleichen

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

Aktuell: Alle Stories durchlaufen identischen 6-Phasen-Workflow mit 3 festen Agents. Domain Detection existiert (kontextuelle Anreicherung), aber keine Workflow-Variation.

## 4.1 Story Classifier

- [ ] Automatische Klassifikation: Typ (Feature, Bugfix, Refactor, Infrastructure)
- [ ] Automatische Risiko-Bewertung: Low / Medium / High / Critical
- [ ] Klassifikation bestimmt Workflow-Tiefe
- [ ] Classifier als eigener Workflow-Schritt vor Refinement

## 4.2 Adaptive Workflow Depth

- [ ] **Light** (Low Risk): Refinement (1 Runde) → Plan → Execute → Quick Review → Done
- [ ] **Standard** (Medium Risk): Full Lifecycle wie heute
- [ ] **Heavy** (High Risk): Extended Refinement + Security Review + Architecture Review + Full Verification
- [ ] Risiko-Schwellen konfigurierbar in `config.yaml`

## 4.3 Dispatcher (dynamisch)

Aktuell: Statische Konfiguration (immer Architect + Developer + QA). Kein Runtime-Routing.

- [ ] Zentrale Routing-Logik: Story-Typ + Risiko + Domain → Workflow-Auswahl + Agent-Set
- [ ] Capability-Matching: Welche Agents werden aktiviert? (erweitert Domain Detection)
- [ ] Context-Loading: Welcher Kontext wird für welchen Agent geladen? (erweitert bestehende Isolation)
- [ ] Implementierung als erweitertes Workflow-Routing in Markdown

## 4.4 Erweiterte Agent-Typen

- [ ] Security Reviewer Agent (aktiviert bei auth/security-Tags)
- [ ] UX Reviewer Agent (aktiviert bei frontend/UI-Tags)
- [ ] Contract Validator Agent (prüft Spec-Einhaltung post-implementation)

### Phase 4 — Definition of Done

- [ ] Stories werden automatisch klassifiziert (Typ + Risiko)
- [ ] Workflow-Tiefe passt sich dem Risiko an
- [ ] Dispatcher routet korrekt zu den richtigen Agents
- [ ] Mindestens 2 neue Agent-Typen aktiv
- [ ] Config-Driven: Schwellen und Routing sind konfigurierbar

---

# Phase 5 — Delivery Vault und Knowledge Surface

**Ziel:** Menschen können das Projektwissen navigieren, inspizieren und weiterführen.

**Zeitrahmen:** 4-6 Wochen nach Phase 4

Aktuell: Artifacts liegen in `_scrum-output/sprints/SW-XXX/` — aber ohne Verlinkung, Index oder Navigation.

## 5.1 Delivery Vault Struktur

- [ ] Verlinkte Markdown-Struktur: Stories → Plans → Reviews → Decisions
- [ ] Jedes Artifact hat Backlinks zu verwandten Artifacts
- [ ] Navigation: Von Story zu allen zugehörigen Artifacts
- [ ] Obsidian-kompatibel (aber nicht Obsidian-abhängig)

## 5.2 Knowledge Navigation

- [ ] Index-Seiten: Alle Stories, alle Decisions, alle Risks
- [ ] Timeline-View: Chronologische Delivery-Geschichte
- [ ] Component-View: Welche Stories betreffen welche Komponenten?

## 5.3 Review und Session Surfaces

- [ ] Review-Findings aggregiert pro Komponente
- [ ] Recurring Issues sichtbar (aus Review-History)
- [ ] Session-Summaries als navigierbare Dokumente

## 5.4 Architecture Knowledge Base

- [ ] Architecture Decision Records (ADRs) als Artifact-Typ
- [ ] Architecture Notes aus Architect-Agent-Perspektiven automatisch extrahiert
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
| R-005 | Lücken schließen vor neuen Features | Bestehende Skills und Workflows absichern bevor Memory/Dispatcher gebaut werden |
| R-006 | Adaptive Workflow erst in Phase 4 | Zuerst den Standard-Flow zuverlässig machen, dann optimieren |
| R-007 | Markdown-as-Code ist die Implementierung | Skills sind SKILL.md Dateien — Claude als Runtime führt sie aus. Kein separater Code-Layer nötig. |

---

# Risiken

| Risiko | Schwere | Mitigation |
|--------|---------|------------|
| Guard-Bypass durch manuelle Datei-Edits | Hoch | Phase 1.3: Hash-Check des Status-Felds |
| Memory-Persistenz über AI-Sessions | Hoch | File-basiert starten, Komplexität schrittweise erhöhen |
| Platform-Divergenz (Adapter-Chaos) | Mittel | Claude Code als einzige Priorität bis Phase 6 abgeschlossen |
| Workflow-Komplexität zu hoch für kleine Tasks | Mittel | Adaptive Depth in Phase 4 adressiert das explizit |
| Markdown-as-Code skaliert nicht für Memory | Mittel | Evaluierung nach Phase 2 ob Upgrade nötig |
| End-to-End-Flow nie real getestet | Hoch | Phase 1.4: Pflicht-Validierung mit 3 echten Stories |

---

# Zusammenfassung

```text
Phase 1: Foundation Hardening     → Lücken schließen: Approve-Command, Plan-Check, State-History, E2E-Test
Phase 2: Memory und Continuity    → Decisions, Sessions, Risks als eigenständige Artifacts
Phase 3: Control und Observability → Policy Checks, Audit Trail, Post-Dev Verification, Sprint Status
Phase 4: Dispatcher und Adaptive  → Classification, Routing, Workflow Depth, neue Agents
Phase 5: Vault und Knowledge      → Navigation, Linking, ADRs, aggregierte Findings
Phase 6: Advanced Memory          → Consolidation, Active Retrieval, Pattern Detection
Phase 7: Multi-Runtime            → Platform Validation, Extended Work Units, Plugins
```

**Prinzip:** Jede Phase macht das System zuverlässiger. Keine Phase fügt Komplexität hinzu, ohne dass die vorherige Phase stabil ist.

**North Star:** Ein Delivery Operating System, bei dem AI strukturiert, nachvollziehbar und team-safe arbeitet.
