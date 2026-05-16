# Pipeline Discrepancy Audit
Date: 2026-05-16
Purpose: This audit is the reference for follow-up stories that bring the pipeline, command, and template mirror files back to a consistent story status state machine. The authoritative source is `src/core/context/standards.md`, section **Story Status State Machine**; discrepancies in routing, command frontmatter, or mirror files must be remediated against this audit or explicitly documented as intentional design exceptions.
## Scope and audited sources
| Area | Primary file | Mirror file | Audit scope |
|---|---|---|---|
| Pipeline Routing | `src/core/data/pipeline-routing.yaml` | `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` | `routing_matrix` with `current_status`, `next_command`, `target_status`, `action`, `command_args` |
| State Machine | `src/core/context/standards.md` | `src/cli/templates/scrum_workflow/context/standards.md` | `Story Status State Machine` section, especially `Valid Transitions` |
| Commands | `src/core/commands/*.md` | `src/cli/templates/scrum_workflow/commands/*.md` | Frontmatter fields `trigger`, `requires_status`, `sets_status` |
## 1. Pipeline routing: Core
Source: `src/core/data/pipeline-routing.yaml`.
| current_status | next_command | target_status | action | command_args |
|---|---|---|---|---|
| `_not_found` | `/scrum-create-ticket` | `draft` | `route` | — |
| `draft` | `/scrum-refine-ticket` | `refined` | `route` | — |
| `refinement` | — | — | `skip` | — |
| `refined` | `/scrum-refine-story` | `ready-for-dev` | `route` | — |
| `ready-for-dev` | `/scrum-dev-story` | `in-progress` | `route` | — |
| in-progress | /scrum-verify | review | route | — |
| review | /scrum-review-story | approved | route | — |
| changes-needed | /scrum-dev-story | in-progress | route | — |
| `approved` | — | — | `stop` | — |
| `done` | — | — | `skip` | — |
| `cancelled` | — | — | `skip` | — |
## 2. Pipeline routing: Mirror
Source: `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml`. The mirror file is content-identical to the core file. Therefore, every core routing discrepancy is also present in the template mirror.
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
## 3. Valid transitions from `Story Status State Machine`
Source: `src/core/context/standards.md`, section `Story Status State Machine`. The mirror file `src/cli/templates/scrum_workflow/context/standards.md` contains the same transitions.
| From | To | Trigger | Guard Condition |
|---|---|---|---|
| `draft` | `refinement` | `/scrum-refine-ticket` | `status == draft` |
| `refinement` | `refined` | `/scrum-refine-ticket` | refinement agents complete |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | all 5 validation criteria PASS |
| `refined` | `refined` | `/scrum-refine-story` | any validation criterion FAIL; status unchanged |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | `status == ready-for-dev`; initial implementation |
| in-progress | review | /scrum-verify | status == in-progress and automated verification PASS |
| `review` | `approved` | `/scrum-review-story` | verdict `APPROVED` |
| `review` | `changes-needed` | `/scrum-review-story` | verdict `CHANGES-NEEDED` |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | `status == changes-needed`; re-implementation with findings loaded |
| `approved` | `done` | `/scrum-approve` | explicit user sign-off |
| `any` | `cancelled` | Manual decision | explicit user cancellation from any non-terminal state |
> Audit note: Although the current state machine still lists `in-progress → review` via `/scrum-dev-story review`, the `/scrum-verify` command frontmatter already defines the contract for `in-progress → review`. For follow-up stories, the target state is: `in-progress → review` must no longer run through `/scrum-dev-story review`; it must run through `/scrum-verify`.
## 4. Command frontmatter: Core
Source: all Markdown files in `src/core/commands/`.
| Command file | trigger | requires_status | sets_status | Audit note |
|---|---|---|---|---|
| `approve.md` | `/scrum-approve` | `approved` | `done` | Story lifecycle command |
| `audit-trail.md` | `/scrum-audit-trail` | `any` | `none` | Observability; no story transition |
| `create-architecture-docs.md` | `/scrum-create-architecture-docs` | `null` | `null` | No story status contract |
| `create-brief.md` | `/scrum-create-brief` | `null` | `complete` | Project/brief status, not story lifecycle |
| `create-concept.md` | `/scrum-create-concept` | `null` | `null` | No story status contract |
| `create-project-context.md` | `/scrum-create-project-context` | `null` | `null` | No story status contract |
| `create-project-docs.md` | `/scrum-create-project-docs` | `null` | `null` | No story status contract |
| `create-ticket.md` | `/scrum-create-ticket` | `null` | `draft` | Story creation; pipeline uses `_not_found → draft` |
| `decompose-epics.md` | `/scrum-decompose-epics` | `complete` | `decomposed` | Epic/planning status, not story lifecycle |
| `dev-story.md` | `/scrum-dev-story` | `ready-for-dev \| changes-needed` | `in-progress` | Story lifecycle command; does not set `review` in frontmatter |
| `draft-stories.md` | `/scrum-draft-stories` | `planned` | `drafted` | Epic/planning status, not story lifecycle |
| `pipeline.md` | `/scrum-pipeline` | `*` | `varies per story` | Orchestrator; must follow the routing matrix |
| `refine-story.md` | `/scrum-refine-story` | `refined` | `ready-for-dev` | Story lifecycle command |
| `refine-ticket.md` | `/scrum-refine-ticket` | `draft` | `refinement → refined` | Story lifecycle command with intermediate status |
| `research-general.md` | `/research-general` | `null` | `null` | No story status contract |
| `research-technical.md` | `/research-technical` | `null` | `null` | No story status contract |
| `review-story.md` | `/scrum-review-story` | `review` | `approved \| changes-needed` | Story lifecycle command with two outcomes |
| `session-start.md` | `/session-start` | `N/A` | `N/A` | Read-only session command |
| `ticket-changes.md` | `/scrum-ticket-changes` | `any` | `none` | Observability; no story transition |
| `verify.md` | `/scrum-verify` | `in-progress` | `review` | Story lifecycle command; target for review submission |
| `README.md` | — | — | — | No frontmatter found |
| `delivery-health.md` | — | — | — | No frontmatter found |
| `policy-check.md` | — | — | — | No frontmatter found; contains only textual status guard |
| `sprint-status.md` | — | — | — | No frontmatter found |
| `wrap-up.md` | — | — | — | No frontmatter found |
## 5. Command frontmatter: Mirror
Source: all Markdown files in `src/cli/templates/scrum_workflow/commands/`. The mirror command files are identical to the core command files for the audited frontmatter fields. Therefore, they have the same status contracts and the same discrepancies.
| Command file | trigger | requires_status | sets_status | Audit note |
|---|---|---|---|---|
| `approve.md` | `/scrum-approve` | `approved` | `done` | Story lifecycle command |
| `audit-trail.md` | `/scrum-audit-trail` | `any` | `none` | Observability; no story transition |
| `create-architecture-docs.md` | `/scrum-create-architecture-docs` | `null` | `null` | No story status contract |
| `create-brief.md` | `/scrum-create-brief` | `null` | `complete` | Project/brief status, not story lifecycle |
| `create-concept.md` | `/scrum-create-concept` | `null` | `null` | No story status contract |
| `create-project-context.md` | `/scrum-create-project-context` | `null` | `null` | No story status contract |
| `create-project-docs.md` | `/scrum-create-project-docs` | `null` | `null` | No story status contract |
| `create-ticket.md` | `/scrum-create-ticket` | `null` | `draft` | Story creation; pipeline uses `_not_found → draft` |
| `decompose-epics.md` | `/scrum-decompose-epics` | `complete` | `decomposed` | Epic/planning status, not story lifecycle |
| `dev-story.md` | `/scrum-dev-story` | `ready-for-dev \| changes-needed` | `in-progress` | Story lifecycle command; does not set `review` in frontmatter |
| `draft-stories.md` | `/scrum-draft-stories` | `planned` | `drafted` | Epic/planning status, not story lifecycle |
| `pipeline.md` | `/scrum-pipeline` | `*` | `varies per story` | Orchestrator; must follow the routing matrix |
| `refine-story.md` | `/scrum-refine-story` | `refined` | `ready-for-dev` | Story lifecycle command |
| `refine-ticket.md` | `/scrum-refine-ticket` | `draft` | `refinement → refined` | Story lifecycle command with intermediate status |
| `research-general.md` | `/research-general` | `null` | `null` | No story status contract |
| `research-technical.md` | `/research-technical` | `null` | `null` | No story status contract |
| `review-story.md` | `/scrum-review-story` | `review` | `approved \| changes-needed` | Story lifecycle command with two outcomes |
| `session-start.md` | `/session-start` | `N/A` | `N/A` | Read-only session command |
| `ticket-changes.md` | `/scrum-ticket-changes` | `any` | `none` | Observability; no story transition |
| `verify.md` | `/scrum-verify` | `in-progress` | `review` | Story lifecycle command; target for review submission |
| `README.md` | — | — | — | No frontmatter found |
| `delivery-health.md` | — | — | — | No frontmatter found |
| `policy-check.md` | — | — | — | No frontmatter found; contains only textual status guard |
| `sprint-status.md` | — | — | — | No frontmatter found |
| `wrap-up.md` | — | — | — | No frontmatter found |
## 6. Discrepancies by severity and target state
Severities:
- **Critical**: Causes an incorrect command invocation or bypasses a required lifecycle gate.
- **Major**: Represents the lifecycle incompletely or loses allowed outcomes, but does not necessarily invoke the wrong command on the happy path.
- **Minor**: Documentation/metadata drift without immediate incorrect pipeline execution.
- **Info**: Intentional extension or human-gate behavior outside the automated state machine.
| ID | Area | Current state | Discrepancy | Severity | Target state / follow-up story reference |
|---|---|---|---|---|---|
| PD-001 | Core + Mirror Pipeline | `in-progress` routes to `/scrum-dev-story` with `command_args: review` and `target_status: review`. | Review submission must no longer run through `/scrum-dev-story review`. The `/scrum-verify` command frontmatter already defines `requires_status: in-progress` and `sets_status: review`. | **Critical** | Change pipeline and standards to `in-progress → review` via `/scrum-verify`; remove `command_args: review`. |
| PD-002 | Core + Mirror Pipeline | `changes-needed` routes to `/scrum-dev-story` with `target_status: review`. | `/scrum-dev-story` only sets `in-progress` according to frontmatter; the state machine defines `changes-needed → in-progress`. The pipeline therefore bypasses the separate verify gate. | **Critical** | Change pipeline to `changes-needed → in-progress` via `/scrum-dev-story`; then use a separate pipeline step `in-progress → review` via `/scrum-verify`. |
| PD-003 | Core + Mirror Standards | The state machine still lists `/scrum-dev-story review` for `in-progress → review`. | Standards conflict with the target state and the existing `/scrum-verify` command contract. | **Critical** | Change standards and mirror standards to `/scrum-verify` as the trigger for `in-progress → review`; update diagram and status value table accordingly. |
| PD-004 | Core + Mirror Pipeline | `draft` routes directly to `target_status: refined`; `refinement` is only `skip`. | The state machine and `refine-ticket.md` model `draft → refinement → refined`. The pipeline describes only the command end state and loses the explicit intermediate status. | **Major** | Either document the routing target as a multi-step transition (`refinement → refined`) or clearly define orchestrator/pipeline semantics as command end state. |
| PD-005 | Core + Mirror Pipeline | `review` routes to `/scrum-review-story` with `target_status: approved`. | `/scrum-review-story` can set `approved` or `changes-needed` according to standards and frontmatter. The pipeline models only the happy path, although `changes-needed` is part of the review loop. | **Major** | Model `target_status` as `approved | changes-needed` or as a dynamic outcome; explicitly couple the review loop to that outcome. |
| PD-006 | Core + Mirror Pipeline | `refined` routes to `/scrum-refine-story` with `target_status: ready-for-dev`. | The state machine also allows `refined → refined` on validation failure. The pipeline models only PASS. | **Major** | Model `target_status` as `ready-for-dev | refined` or as a dynamic outcome; FAIL must be shown as an intentional repeat/blocking outcome. |
| PD-007 | Core + Mirror Commands/Docs | `dev-story.md` frontmatter only sets `in-progress`, but command and review documentation still contain text that describes `/scrum-dev-story` as the path to `review`. | Documentation drift increases the risk that follow-up changes preserve the old `/scrum-dev-story review` semantics. | **Minor** | Clean up text in core and mirror files: `/scrum-dev-story` implements/re-implements to `in-progress`; `/scrum-verify` submits to `review`. |
| PD-008 | Core + Mirror Pipeline | `_not_found → draft` via `/scrum-create-ticket` is not listed as a transition in the state machine. | `_not_found` is a pipeline sentinel, not a story status. | **Info** | Keep it, but document it as a sentinel outside the state machine. |
| PD-009 | Core + Mirror Pipeline | `approved` has `action: stop` instead of routing to `/scrum-approve`. | This differs from the automated transition `approved → done`, but is documented as a human gate. | **Info** | Keep it as long as `/scrum-pipeline` intentionally stops before human sign-off; UX should clearly point to `/scrum-approve` as the next manual step. |
## 7. Target state machine for follow-up stories
This target matrix is intended as a reference for implementation follow-up stories. It does not automatically replace the current files, but describes the consistent state that should be reached.
| From | To | Trigger | Source / rationale |
|---|---|---|---|
| `_not_found` | `draft` | `/scrum-create-ticket` | Pipeline sentinel, story creation |
| `draft` | `refinement` | `/scrum-refine-ticket` | Standards + `refine-ticket.md` |
| `refinement` | `refined` | `/scrum-refine-ticket` | Standards + `refine-ticket.md` |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | PASS |
| `refined` | `refined` | `/scrum-refine-story` | FAIL, status unchanged |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | Initial implementation |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | Re-implementation after review findings |
| `in-progress` | `review` | `/scrum-verify` | Automated verification gate; replaces `/scrum-dev-story review` |
| `review` | `approved` | `/scrum-review-story` | Review verdict `APPROVED` |
| `review` | `changes-needed` | `/scrum-review-story` | Review verdict `CHANGES-NEEDED` |
| `approved` | `done` | `/scrum-approve` | Human approval gate |
| `any` | `cancelled` | Manual decision | Terminal manual decision |
## 8. Mirror comparison result
- `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` is identical to `src/core/data/pipeline-routing.yaml`; every pipeline discrepancy must therefore be fixed in both places.
- `src/cli/templates/scrum_workflow/context/standards.md` contains the same state-machine transitions as `src/core/context/standards.md`; every standards discrepancy must therefore be fixed in both places.
- The audited `commands/*.md` mirror files have the same `requires_status`/`sets_status` values as the core files; every command text or frontmatter correction must therefore be mirrored.
## 9. Recommended order for follow-up stories
1. **Correct standards**: Change `in-progress → review` to `/scrum-verify`; update the diagram, status table, and examples.
2. **Correct pipeline**: Adjust core and mirror routing for `in-progress` and `changes-needed`; review dynamic target states for `review` and `refined`.
3. **Clean up command documentation**: Remove old `/scrum-dev-story review` references in core and mirror files or redirect them to `/scrum-verify`.
4. **Add tests/policy**: Add a machine check that validates core/mirror synchronization and allowed triggers against the state machine.
