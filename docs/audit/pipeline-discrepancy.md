# Pipeline Discrepancy Audit

Date: 2026-05-16

Purpose: This audit tracks the alignment between pipeline routing, command
frontmatter, and the canonical story status state machine. The authoritative
source is `src/core/context/standards.md`, section **Story Status State
Machine**. Template mirror files under `src/cli/templates/scrum_workflow/`
must stay synchronized with the corresponding `src/core/` files.

## Scope and audited sources

| Area | Primary file | Mirror file | Audit scope |
|---|---|---|---|
| Pipeline Routing | `src/core/data/pipeline-routing.yaml` | `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` | `routing_matrix` entries |
| State Machine | `src/core/context/standards.md` | `src/cli/templates/scrum_workflow/context/standards.md` | `Story Status State Machine` |
| Commands | `src/core/commands/*.md` | `src/cli/templates/scrum_workflow/commands/*.md` | Frontmatter `trigger`, `requires_status`, `sets_status` and status-transition text |

## Current pipeline routing

The core and template routing files are expected to be identical for the
following lifecycle-relevant entries.

| current_status | next_command | target_status | action | command_args | Audit result |
|---|---|---|---|---|---|
| `_not_found` | `/scrum-create-ticket` | `draft` | `route` | — | Pipeline sentinel outside the story state machine |
| `draft` | `/scrum-refine-ticket` | `refined` | `route` | — | Accepted command end state |
| `refinement` | — | — | `skip` | — | Ephemeral refinement sub-state |
| `refined` | `/scrum-refine-story` | `ready-for-dev` | `route` | — | PASS path; FAIL remains `refined` |
| `ready-for-dev` | `/scrum-dev-story` | `in-progress` | `route` | — | Aligned |
| `in-progress` | `/scrum-verify` | `review` | `route` | — | Aligned; mandatory verification gate before review |
| `review` | `/scrum-review-story` | `approved` | `route` | — | PASS path; review may also return `changes-needed` |
| `changes-needed` | `/scrum-dev-story` | `in-progress` | `route` | — | Aligned; no direct bypass to `review` |
| `approved` | — | — | `stop` | — | Intentional human gate before `/scrum-approve` |
| `done` | — | — | `skip` | — | Terminal state |
| `cancelled` | — | — | `skip` | — | Terminal state |

## Current story status state machine

The canonical target for review submission is now the automated verification
gate:

| From | To | Trigger | Guard Condition |
|---|---|---|---|
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | `status == ready-for-dev` |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | `status == changes-needed` |
| `in-progress` | `review` | `/scrum-verify` | `status == in-progress` and automated verification PASS |
| `review` | `approved` | `/scrum-review-story` | verdict `APPROVED` |
| `review` | `changes-needed` | `/scrum-review-story` | verdict `CHANGES-NEEDED` |
| `approved` | `done` | `/scrum-approve` | explicit user sign-off |

## Resolved discrepancies

| ID | Area | Previous discrepancy | Resolution |
|---|---|---|---|
| PD-001 | Core + Mirror Pipeline | `in-progress` routed to `/scrum-dev-story` with `command_args: review`. | `in-progress` now routes to `/scrum-verify`; `command_args: review` is removed. |
| PD-002 | Core + Mirror Pipeline | `changes-needed` routed directly to target `review`. | `changes-needed` now routes to `/scrum-dev-story` with target `in-progress`, then the next pipeline step must pass `/scrum-verify`. |
| PD-003 | Core + Mirror Standards | The state machine listed `/scrum-dev-story review` for `in-progress → review`. | The state machine now lists `/scrum-verify` with automated verification PASS as the guard. |
| PD-007 | Core + Mirror Commands/Docs | `dev-story.md` text implied `/scrum-dev-story` could transition to `review`. | `dev-story.md` now states that `/scrum-dev-story` remains `in-progress` and `/scrum-verify` sets `review`. |

## Remaining follow-up items

| ID | Area | Remaining gap | Recommended follow-up |
|---|---|---|---|
| PD-004 | Core + Mirror Pipeline | `draft` routes to command end state `refined`, while the state machine explicitly includes the intermediate `refinement` sub-state. | Document pipeline `target_status` semantics as command end state, or model multi-step command outcomes explicitly. |
| PD-005 | Core + Mirror Pipeline | `review` lists `target_status: approved`, although `/scrum-review-story` can also return `changes-needed`. | Model dynamic outcomes (`approved | changes-needed`) or document `target_status` as the expected happy path with review-loop handling. |
| PD-006 | Core + Mirror Pipeline | `refined` lists `target_status: ready-for-dev`, although validation failure keeps status `refined`. | Model dynamic outcomes (`ready-for-dev | refined`) or document FAIL as an intentional unchanged-status outcome. |
| PD-008 | Core + Mirror Pipeline | `_not_found → draft` is a pipeline sentinel transition, not a story state-machine transition. | Keep the sentinel and document it as outside the story status lifecycle. |
| PD-009 | Core + Mirror Pipeline | `approved` stops instead of routing to `/scrum-approve`. | Keep this as an intentional human gate if `/scrum-pipeline` must stop before human sign-off. |

## Mirror comparison result

- `src/cli/templates/scrum_workflow/data/pipeline-routing.yaml` must remain in sync with `src/core/data/pipeline-routing.yaml`.
- `src/cli/templates/scrum_workflow/context/standards.md` must remain in sync with `src/core/context/standards.md`.
- The audited `commands/*.md` mirror files must preserve the same status contracts and transition language as the core files.

## Conflict-resolution note

This document is intentionally retained as the main-branch audit record and is
updated to reflect the resolved `/scrum-verify` gate. The PR branch should no
longer add a competing version of `docs/audit/pipeline-discrepancy.md`; future
changes should modify this file in place.
