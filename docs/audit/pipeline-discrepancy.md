# Pipeline Discrepancy Audit

Datum: 2026-05-16

Zweck: Dieser Audit ist die Referenz für Folge-Stories, die Pipeline-, Command- und Template-Mirror-Dateien wieder auf eine einheitliche Story-Status-State-Machine bringen. Die authoritative Quelle ist `src/core/context/standards.md`, Abschnitt **Story Status State Machine**; Abweichungen in Routing, Command-Frontmatter oder Mirror-Dateien müssen gegen diesen Audit behoben oder bewusst als Design-Ausnahme dokumentiert werden.

## Scope und geprüfte Quellen

| Bereich | Primärdatei | Mirror-Datei | Prüfumfang |
|---|---|---|---|
| Pipeline Routing | `src/core/data/pipeline-routing.yaml` | `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` | `routing_matrix` mit `current_status`, `next_command`, `target_status`, `action`, `command_args` |
| State Machine | `src/core/context/standards.md` | `src/cli/templates/scrum_workflow/context/standards.md` | Abschnitt `Story Status State Machine`, insbesondere `Valid Transitions` |
| Commands | `src/core/commands/*.md` | `src/cli/templates/scrum_workflow/commands/*.md` | Frontmatter-Felder `trigger`, `requires_status`, `sets_status` |

## 1. Pipeline-Routing: Core

Quelle: `src/core/data/pipeline-routing.yaml`.

| current_status | next_command | target_status | action | command_args |
|---|---|---|---|---|
| `_not_found` | `/scrum-create-ticket` | `draft` | `route` | — |
| `draft` | `/scrum-refine-ticket` | `refined` | `route` | — |
| `refinement` | — | — | `skip` | — |
| `refined` | `/scrum-refine-story` | `ready-for-dev` | `route` | — |
| `ready-for-dev` | `/scrum-dev-story` | `in-progress` | `route` | — |
| `in-progress` | `/scrum-dev-story` | `review` | `route` | `review` |
| `review` | `/scrum-review-story` | `approved` | `route` | — |
| `changes-needed` | `/scrum-dev-story` | `review` | `route` | — |
| `approved` | — | — | `stop` | — |
| `done` | — | — | `skip` | — |
| `cancelled` | — | — | `skip` | — |

## 2. Pipeline-Routing: Mirror

Quelle: `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml`.

Die Mirror-Datei ist inhaltlich identisch zur Core-Datei. Damit sind alle Core-Routing-Abweichungen auch im Template-Mirror vorhanden.

| current_status | next_command | target_status | action | command_args |
|---|---|---|---|---|
| `_not_found` | `/scrum-create-ticket` | `draft` | `route` | — |
| `draft` | `/scrum-refine-ticket` | `refined` | `route` | — |
| `refinement` | — | — | `skip` | — |
| `refined` | `/scrum-refine-story` | `ready-for-dev` | `route` | — |
| `ready-for-dev` | `/scrum-dev-story` | `in-progress` | `route` | — |
| `in-progress` | `/scrum-dev-story` | `review` | `route` | `review` |
| `review` | `/scrum-review-story` | `approved` | `route` | — |
| `changes-needed` | `/scrum-dev-story` | `review` | `route` | — |
| `approved` | — | — | `stop` | — |
| `done` | — | — | `skip` | — |
| `cancelled` | — | — | `skip` | — |

## 3. Gültige Transitions aus `Story Status State Machine`

Quelle: `src/core/context/standards.md`, Abschnitt `Story Status State Machine`. Die Mirror-Datei `src/cli/templates/scrum_workflow/context/standards.md` enthält dieselben Transitions.

| From | To | Trigger | Guard Condition |
|---|---|---|---|
| `draft` | `refinement` | `/scrum-refine-ticket` | `status == draft` |
| `refinement` | `refined` | `/scrum-refine-ticket` | refinement agents complete |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | all 5 validation criteria PASS |
| `refined` | `refined` | `/scrum-refine-story` | any validation criterion FAIL; status unchanged |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | `status == ready-for-dev`; initial implementation |
| `in-progress` | `review` | `/scrum-dev-story review` | `status == in-progress` |
| `review` | `approved` | `/scrum-review-story` | verdict `APPROVED` |
| `review` | `changes-needed` | `/scrum-review-story` | verdict `CHANGES-NEEDED` |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | `status == changes-needed`; re-implementation with findings loaded |
| `approved` | `done` | `/scrum-approve` | explicit user sign-off |
| `any` | `cancelled` | Manual decision | explicit user cancellation from any non-terminal state |

> Audit-Hinweis: Obwohl die aktuelle State-Machine noch `in-progress → review` über `/scrum-dev-story review` aufführt, existiert mit `/scrum-verify` bereits ein Command-Frontmatter-Vertrag für `in-progress → review`. Für Folge-Stories gilt der Zielzustand: `in-progress → review` darf nicht mehr über `/scrum-dev-story review` laufen, sondern über `/scrum-verify`.

## 4. Command-Frontmatter: Core

Quelle: alle Markdown-Dateien in `src/core/commands/`.

| Command-Datei | trigger | requires_status | sets_status | Audit-Notiz |
|---|---|---|---|---|
| `approve.md` | `/scrum-approve` | `approved` | `done` | Story-Lifecycle-Command |
| `audit-trail.md` | `/scrum-audit-trail` | `any` | `none` | Observability; keine Story-Transition |
| `create-architecture-docs.md` | `/scrum-create-architecture-docs` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-brief.md` | `/scrum-create-brief` | `null` | `complete` | Projekt-/Brief-Status, nicht Story-Lifecycle |
| `create-concept.md` | `/scrum-create-concept` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-project-context.md` | `/scrum-create-project-context` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-project-docs.md` | `/scrum-create-project-docs` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-ticket.md` | `/scrum-create-ticket` | `null` | `draft` | Story-Erzeugung; Pipeline nutzt `_not_found → draft` |
| `decompose-epics.md` | `/scrum-decompose-epics` | `complete` | `decomposed` | Epic-/Planungsstatus, nicht Story-Lifecycle |
| `dev-story.md` | `/scrum-dev-story` | `ready-for-dev \| changes-needed` | `in-progress` | Story-Lifecycle-Command; kein `review`-Setzen im Frontmatter |
| `draft-stories.md` | `/scrum-draft-stories` | `planned` | `drafted` | Epic-/Planungsstatus, nicht Story-Lifecycle |
| `pipeline.md` | `/scrum-pipeline` | `*` | `varies per story` | Orchestrator; muss Routing-Matrix folgen |
| `refine-story.md` | `/scrum-refine-story` | `refined` | `ready-for-dev` | Story-Lifecycle-Command |
| `refine-ticket.md` | `/scrum-refine-ticket` | `draft` | `refinement → refined` | Story-Lifecycle-Command mit Zwischenstatus |
| `research-general.md` | `/research-general` | `null` | `null` | Kein Story-Status-Vertrag |
| `research-technical.md` | `/research-technical` | `null` | `null` | Kein Story-Status-Vertrag |
| `review-story.md` | `/scrum-review-story` | `review` | `approved \| changes-needed` | Story-Lifecycle-Command mit zwei Ausgängen |
| `session-start.md` | `/session-start` | `N/A` | `N/A` | Read-only Session-Command |
| `ticket-changes.md` | `/scrum-ticket-changes` | `any` | `none` | Observability; keine Story-Transition |
| `verify.md` | `/scrum-verify` | `in-progress` | `review` | Story-Lifecycle-Command; Ziel für Review-Submission |
| `README.md` | — | — | — | Kein Frontmatter gefunden |
| `delivery-health.md` | — | — | — | Kein Frontmatter gefunden |
| `policy-check.md` | — | — | — | Kein Frontmatter gefunden; enthält nur textuellen Status Guard |
| `sprint-status.md` | — | — | — | Kein Frontmatter gefunden |
| `wrap-up.md` | — | — | — | Kein Frontmatter gefunden |

## 5. Command-Frontmatter: Mirror

Quelle: alle Markdown-Dateien in `src/cli/templates/scrum_workflow/commands/`.

Die Mirror-Command-Dateien sind für die geprüften Frontmatter-Felder identisch zu den Core-Command-Dateien. Damit gelten dieselben Status-Verträge und dieselben Abweichungen.

| Command-Datei | trigger | requires_status | sets_status | Audit-Notiz |
|---|---|---|---|---|
| `approve.md` | `/scrum-approve` | `approved` | `done` | Story-Lifecycle-Command |
| `audit-trail.md` | `/scrum-audit-trail` | `any` | `none` | Observability; keine Story-Transition |
| `create-architecture-docs.md` | `/scrum-create-architecture-docs` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-brief.md` | `/scrum-create-brief` | `null` | `complete` | Projekt-/Brief-Status, nicht Story-Lifecycle |
| `create-concept.md` | `/scrum-create-concept` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-project-context.md` | `/scrum-create-project-context` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-project-docs.md` | `/scrum-create-project-docs` | `null` | `null` | Kein Story-Status-Vertrag |
| `create-ticket.md` | `/scrum-create-ticket` | `null` | `draft` | Story-Erzeugung; Pipeline nutzt `_not_found → draft` |
| `decompose-epics.md` | `/scrum-decompose-epics` | `complete` | `decomposed` | Epic-/Planungsstatus, nicht Story-Lifecycle |
| `dev-story.md` | `/scrum-dev-story` | `ready-for-dev \| changes-needed` | `in-progress` | Story-Lifecycle-Command; kein `review`-Setzen im Frontmatter |
| `draft-stories.md` | `/scrum-draft-stories` | `planned` | `drafted` | Epic-/Planungsstatus, nicht Story-Lifecycle |
| `pipeline.md` | `/scrum-pipeline` | `*` | `varies per story` | Orchestrator; muss Routing-Matrix folgen |
| `refine-story.md` | `/scrum-refine-story` | `refined` | `ready-for-dev` | Story-Lifecycle-Command |
| `refine-ticket.md` | `/scrum-refine-ticket` | `draft` | `refinement → refined` | Story-Lifecycle-Command mit Zwischenstatus |
| `research-general.md` | `/research-general` | `null` | `null` | Kein Story-Status-Vertrag |
| `research-technical.md` | `/research-technical` | `null` | `null` | Kein Story-Status-Vertrag |
| `review-story.md` | `/scrum-review-story` | `review` | `approved \| changes-needed` | Story-Lifecycle-Command mit zwei Ausgängen |
| `session-start.md` | `/session-start` | `N/A` | `N/A` | Read-only Session-Command |
| `ticket-changes.md` | `/scrum-ticket-changes` | `any` | `none` | Observability; keine Story-Transition |
| `verify.md` | `/scrum-verify` | `in-progress` | `review` | Story-Lifecycle-Command; Ziel für Review-Submission |
| `README.md` | — | — | — | Kein Frontmatter gefunden |
| `delivery-health.md` | — | — | — | Kein Frontmatter gefunden |
| `policy-check.md` | — | — | — | Kein Frontmatter gefunden; enthält nur textuellen Status Guard |
| `sprint-status.md` | — | — | — | Kein Frontmatter gefunden |
| `wrap-up.md` | — | — | — | Kein Frontmatter gefunden |

## 6. Abweichungen mit Schweregrad und Zielzustand

Schweregrade:

- **Critical**: Führt zu falschem Command-Aufruf oder überspringt einen verpflichtenden Lifecycle-Gate.
- **Major**: Repräsentiert den Lifecycle unvollständig oder verliert erlaubte Ausgänge, ist aber nicht zwingend ein falscher Command-Aufruf im Happy Path.
- **Minor**: Dokumentations-/Metadaten-Drift ohne unmittelbare falsche Pipeline-Ausführung.
- **Info**: Bewusste Ergänzung oder Human-Gate-Verhalten, das außerhalb der automatischen State-Machine liegt.

| ID | Bereich | Ist-Zustand | Abweichung | Schweregrad | Zielzustand / Folge-Story-Referenz |
|---|---|---|---|---|---|
| PD-001 | Core + Mirror Pipeline | `in-progress` routet zu `/scrum-dev-story` mit `command_args: review` und `target_status: review`. | Review-Submission darf nicht mehr über `/scrum-dev-story review` laufen. Das Command-Frontmatter von `/scrum-verify` definiert bereits `requires_status: in-progress` und `sets_status: review`. | **Critical** | Pipeline und Standards auf `in-progress → review` via `/scrum-verify` umstellen; `command_args: review` entfernen. |
| PD-002 | Core + Mirror Pipeline | `changes-needed` routet zu `/scrum-dev-story` mit `target_status: review`. | `/scrum-dev-story` setzt laut Frontmatter nur `in-progress`; die State-Machine definiert `changes-needed → in-progress`. Die Pipeline überspringt dadurch den separaten Verify-Gate. | **Critical** | Pipeline auf `changes-needed → in-progress` via `/scrum-dev-story` ändern; danach eigener Pipeline-Schritt `in-progress → review` via `/scrum-verify`. |
| PD-003 | Core + Mirror Standards | State-Machine nennt für `in-progress → review` noch `/scrum-dev-story review`. | Standards widersprechen dem Zielzustand und dem vorhandenen `/scrum-verify`-Command-Vertrag. | **Critical** | Standards und Mirror-Standards auf `/scrum-verify` als Trigger für `in-progress → review` ändern; Diagramm und Status-Wert-Tabelle mitziehen. |
| PD-004 | Core + Mirror Pipeline | `draft` routet direkt zu `target_status: refined`; `refinement` ist nur `skip`. | Die State-Machine und `refine-ticket.md` modellieren `draft → refinement → refined`. Die Pipeline beschreibt nur den Endzustand des Commands und verliert den expliziten Zwischenstatus. | **Major** | Entweder Routing-Ziel als mehrstufige Transition dokumentieren (`refinement → refined`) oder Orchestrator-/Pipeline-Semantik klar als Command-Endzustand definieren. |
| PD-005 | Core + Mirror Pipeline | `review` routet zu `/scrum-review-story` mit `target_status: approved`. | `/scrum-review-story` kann laut Standards und Frontmatter `approved` oder `changes-needed` setzen. Die Pipeline bildet nur den Happy Path ab, obwohl `changes-needed` Teil des Review-Loops ist. | **Major** | `target_status` als `approved | changes-needed` oder als dynamisches Ergebnis modellieren; Review-Loop explizit daran koppeln. |
| PD-006 | Core + Mirror Pipeline | `refined` routet zu `/scrum-refine-story` mit `target_status: ready-for-dev`. | Die State-Machine erlaubt auch `refined → refined` bei Validierungsfehlern. Die Pipeline bildet nur PASS ab. | **Major** | `target_status` als `ready-for-dev | refined` oder dynamisches Ergebnis modellieren; FAIL muss als bewusstes Wiederholen/Blockieren ausgewiesen sein. |
| PD-007 | Core + Mirror Commands/Docs | `dev-story.md` Frontmatter setzt nur `in-progress`, aber Command- und Review-Dokumentation enthalten weiterhin Stellen, die `/scrum-dev-story` als Weg bis `review` beschreiben. | Dokumentations-Drift erhöht das Risiko, dass Folgeänderungen die alte `/scrum-dev-story review`-Semantik beibehalten. | **Minor** | Textstellen in Core und Mirror bereinigen: `/scrum-dev-story` implementiert/re-implementiert bis `in-progress`; `/scrum-verify` submitted nach `review`. |
| PD-008 | Core + Mirror Pipeline | `_not_found → draft` via `/scrum-create-ticket` ist in der State-Machine nicht als Transition enthalten. | `_not_found` ist ein Pipeline-Sentinel, kein Story-Status. | **Info** | Beibehalten, aber als Sentinel außerhalb der State-Machine dokumentieren. |
| PD-009 | Core + Mirror Pipeline | `approved` hat `action: stop` statt Route zu `/scrum-approve`. | Dies weicht von der automatischen Transition `approved → done` ab, ist aber als Human Gate dokumentiert. | **Info** | Beibehalten, solange `/scrum-pipeline` bewusst vor menschlicher Freigabe stoppt; UX sollte klar auf `/scrum-approve` als nächsten manuellen Schritt verweisen. |

## 7. Ziel-State-Machine für Folge-Stories

Diese Zielmatrix soll für Implementierungs-Folge-Stories als Referenz dienen. Sie ersetzt nicht automatisch die aktuellen Dateien, beschreibt aber den zu erreichenden konsistenten Zustand.

| From | To | Trigger | Quelle / Begründung |
|---|---|---|---|
| `_not_found` | `draft` | `/scrum-create-ticket` | Pipeline-Sentinel, Story-Erzeugung |
| `draft` | `refinement` | `/scrum-refine-ticket` | Standards + `refine-ticket.md` |
| `refinement` | `refined` | `/scrum-refine-ticket` | Standards + `refine-ticket.md` |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | PASS |
| `refined` | `refined` | `/scrum-refine-story` | FAIL, Status unverändert |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | initiale Implementierung |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | Re-Implementierung nach Review-Findings |
| `in-progress` | `review` | `/scrum-verify` | automatisierter Verification-Gate; ersetzt `/scrum-dev-story review` |
| `review` | `approved` | `/scrum-review-story` | Review verdict `APPROVED` |
| `review` | `changes-needed` | `/scrum-review-story` | Review verdict `CHANGES-NEEDED` |
| `approved` | `done` | `/scrum-approve` | Human approval gate |
| `any` | `cancelled` | Manual decision | Terminale manuelle Entscheidung |

## 8. Mirror-Abgleich-Ergebnis

- `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` ist identisch zu `src/core/data/pipeline-routing.yaml`; jede Pipeline-Abweichung ist daher doppelt zu beheben.
- `src/cli/templates/scrum_workflow/context/standards.md` enthält dieselben State-Machine-Transitions wie `src/core/context/standards.md`; jede Standards-Abweichung ist daher doppelt zu beheben.
- Die geprüften `commands/*.md` Mirror-Dateien haben dieselben `requires_status`-/`sets_status`-Werte wie die Core-Dateien; jede Command-Text- oder Frontmatter-Korrektur ist daher doppelt zu spiegeln.

## 9. Empfohlene Reihenfolge für Folge-Stories

1. **Standards korrigieren**: `in-progress → review` auf `/scrum-verify` ändern; Diagramm, Status-Tabelle und Beispiele aktualisieren.
2. **Pipeline korrigieren**: Core und Mirror Routing für `in-progress` und `changes-needed` anpassen; dynamische Zielzustände für `review` und `refined` prüfen.
3. **Command-Dokumentation bereinigen**: Alte `/scrum-dev-story review`-Hinweise in Core und Mirror entfernen oder auf `/scrum-verify` umbiegen.
4. **Tests/Policy ergänzen**: Eine maschinelle Prüfung ergänzen, die Core/Mirror-Synchronität und erlaubte Trigger gegen die State-Machine validiert.
