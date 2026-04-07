---
stepsCompleted: [step-01-extraction, step-02-epic-design, step-03-story-generation, step-04-final-validation]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - docs/index.md
---

# scrum_workflow - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for scrum_workflow, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Story Lifecycle Management (FR-1 to FR-7)**
- FR-1: Developer can create a structured story from natural language input via `/scrum-create-ticket`
- FR-2: System generates story artifact with YAML frontmatter including ticket ID, status, type, risk level, and domain tags
- FR-3: Developer can specify workflow depth at creation time via `--depth light/standard` (Phase 1: manual, Phase 4: automatic)
- FR-4: System enforces a 9-state story lifecycle with guarded transitions: `draft → refined → ready-for-dev → in-progress → review → approved → done` with branch states `changes-needed` and `cancelled`
- FR-5: Developer can approve a completed story via `/scrum-approve`, creating an approval artifact as mandatory gate before `done`
- FR-6: System supports rejection flow: `review → changes-needed → in-progress` with review findings loaded as context for re-implementation
- FR-7: System tracks all status transitions in an append-only `status_history` array with timestamp, trigger command, and actor identity

**State Machine & Guards (FR-8 to FR-11)**
- FR-8: System blocks any command that would cause an invalid state transition, producing an actionable error message indicating required current status and next valid step
- FR-9: System enforces write boundaries per command: implementation agent cannot modify `story.md`, review agent cannot modify source code, no command writes outside its defined write boundary
- FR-10: System detects manual status field edits by recording trigger identity; `status_history` entries with `trigger: manual-edit` are visible to all participants
- FR-11: System never leaves inconsistent state silently; every error produces an actionable error message

**Multi-Agent Refinement (FR-12 to FR-17)**
- FR-12: System spawns 3 parallel refinement agents (Architect, Developer, QA) with isolated context during `/scrum-refine-ticket`
- FR-13: Refinement agents produce independent perspectives covering architecture risks, implementation feasibility, and testability concerns
- FR-14: System facilitates cross-talk rounds between agents (up to 3 rounds) with blocker classification and early-exit-on-consensus
- FR-15: System synthesizes accepted agent perspectives into a unified refinement artifact, deduplicating overlapping findings
- FR-16: Developer can accept or reject each agent perspective individually, with decisions tracked in refinement artifact
- FR-17: System produces story point estimation using Wideband Delphi method (Fibonacci scale, variance threshold, re-estimation on high variance, median calculation, confidence level)

**Validation & Readiness (FR-18 to FR-21)**
- FR-18: System validates story completeness via `/scrum-refine-story` against 5 immutable criteria (Feature List as Immutable Contract pattern)
- FR-19: System generates `plan.md` artifact as mandatory output of readiness validation
- FR-20: System enforces `plan.md` existence check before allowing `/scrum-dev-story` to proceed
- FR-21: System produces verification report via `/scrum-verify` with automated checks (tests, lint, build) as mandatory step before review (Phase 3)

**Review & Quality (FR-22 to FR-25)**
- FR-22: System provides independent code review via `/scrum-review-story` using a separate model/agent from the implementer (Self-Critique Evaluator Loop)
- FR-23: Review produces findings classified by severity (critical, major, minor) with structured recommendations
- FR-24: Review verdict is either `approved` or `changes-needed`; both outcomes produce a persistent review artifact
- FR-25: Multiple review rounds are tracked with incremental artifact numbering (`review-1.md`, `review-2.md`)

**Memory & Session Continuity (FR-26 to FR-31)**
- FR-26: System captures decisions as standalone artifacts (`decision_record`) auto-extracted from refinement feedback and approval reasoning (Phase 2)
- FR-27: System provides session continuity via `/session-start` command that loads open work units, last decisions, active risks, and next steps (Phase 2)
- FR-28: System provides session wrap-up via `/wrap-up` command that creates session summary artifact (Phase 2)
- FR-29: System extracts risk notes from Architect agent perspectives as persistent `risk_note` artifacts (Phase 2)
- FR-30: System loads active risk notes as context during `/scrum-review-story` automatically (Phase 2)
- FR-31: Research Reports are standalone persistent artifacts searchable by tag and topic; refinement agents automatically load relevant Research Reports as context based on domain and tag matching (Phase 2)

**Adaptive Workflow (FR-32 to FR-36) — Phase 4**
- FR-32: System classifies stories by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical) (Phase 4)
- FR-33: System selects workflow depth (Light, Standard, Heavy) based on story risk classification (Phase 4)
- FR-34: System dynamically dispatches agent set based on story type, risk, and domain tags (Phase 4)
- FR-35: System provides extended agent types: Security Reviewer, UX Reviewer, Contract Validator (Phase 4)
- FR-36: Workflow depth thresholds are configurable in `config.yaml` (Phase 4)

**Audit & Governance (FR-37 to FR-40) — Phase 3**
- FR-37: System detects and blocks policy violations (no plan, no verification, invalid transition) with actionable error messages (Phase 3)
- FR-38: System maintains central audit trail per story in `_scrum-output/audit/` with all transitions, agent actions, and artifact creation events (Phase 3)
- FR-39: System provides sprint observability via `/sprint-status` listing all stories with current status, age, and pending actions (Phase 3)
- FR-40: System provides delivery health monitoring via `/delivery-health` showing policy violations, open risks, and pending approvals (Phase 3)

**Developer Experience & Installation (FR-41 to FR-44)**
- FR-41: Developer can install the framework via `npx create-scrum-workflow@latest` in under 5 minutes
- FR-42: Developer can create a first structured, refined ticket within 30 minutes of installation (SC-9)
- FR-43: CLI update command detects version, lists breaking changes, migrates YAML frontmatter automatically, and validates post-migration (FR-Migration)
- FR-44: Framework extends through files: a new `SKILL.md` in the skills directory is a new capability, a new agent definition is a new agent, a new workflow definition is a new workflow

**Research & Pre-Intake (FR-45)**
- FR-45: Developer can conduct technical or general research via `/scrum-research-technical` and `/scrum-research-general` before ticket creation. Research produces a persistent Research Report artifact (`RR-XXX.md`) in `_scrum-output/memory/research/`

**Artifact Contract (FR-46)**
- FR-46: Every slash-command that produces an artifact must generate it in a predictable location with consistent naming convention:
  - `/scrum-create-ticket` → `story.md` in `_scrum-output/sprints/SW-XXX/`
  - `/scrum-refine-ticket` → `refinement.md` in `_scrum-output/sprints/SW-XXX/`
  - `/scrum-refine-story` → `plan.md` + status change in `_scrum-output/sprints/SW-XXX/`
  - `/scrum-dev-story` → Source code changes in Project source tree
  - `/scrum-review-story` → `review-N.md` in `_scrum-output/sprints/SW-XXX/`
  - `/scrum-approve` → `approval-N.md` in `_scrum-output/sprints/SW-XXX/`
  - `/scrum-research-*` → `RR-XXX.md` in `_scrum-output/memory/research/`
  - `/wrap-up` → `session-summary.md` in `_scrum-output/memory/sessions/`

### NonFunctional Requirements

**Performance & Efficiency**
- NFR-1: Token efficiency — Coordination max 4000, sub-agent max 2000 tokens per platform (configured in `config.yaml`)
- NFR-6: Platform response time — Simple commands <30s, Medium <90s, Heavy <180s

**Resilience & Safety**
- NFR-2: No external service dependency — Framework core requires zero network calls
- NFR-3: Offline capability — All framework commands work without internet (only research commands require network)
- NFR-4: Atomic file operations — No corrupt state on session abort
- NFR-10: Worst-case safety — Framework degrades gracefully under AI misexecution; all artifacts remain human-readable Markdown in Git
- NFR-14: Error recovery rate — 100% of framework errors leave system in recoverable state
- NFR-15: Skill execution reliability — 95%+ pass rate across skill execution regression suite per model version

**Governance & Traceability**
- NFR-5: Schema versioning — All YAML frontmatter includes `schema_version` field
- NFR-7: Artifact traceability — Every generated artifact references its source story via `ticket` field
- NFR-9: Artifact inspectability — Every artifact is human-readable, diffable, Git-versionable

**Developer Experience**
- NFR-8: Framework installability — `npx create-scrum-workflow@latest` completes in under 30 seconds
- NFR-11: Zero-config extensibility — New `.md` file = new capability, no build step, no registration
- NFR-13: Zero-knowledge onboarding — Developer creates first structured ticket without reading documentation
- NFR-16: Update safety — Framework updates preserve all user modifications; lock file tracks user-modified files

### Additional Requirements (from Architecture)

**Naming Patterns**
- Story ID Format: `SW-XXX` (3-digit, zero-padded)
- Artifact Naming: `refinement.md`, `plan.md`, `review-{N}.md`, `approval-{N}.md`, `RR-XXX.md`, `DR-XXX.md`, `RN-XXX.md`, `session-{YYYY-MM-DD}.md`
- Code Naming: `SKILL.md` (uppercase), `workflow.md`, `agent.md`, `command.md`

**Structure Patterns**
- Output Directory: `_scrum-output/sprints/SW-XXX/` for story artifacts
- Memory Directory: `_scrum-output/memory/` with subdirectories (`decisions/`, `sessions/`, `risks/`, `research/`)
- Framework Directory: `scrum_workflow/commands/`, `scrum_workflow/workflows/`, `scrum_workflow/skills/`, `scrum_workflow/agents/`

**Format Patterns**
- YAML Frontmatter Standard with `schema_version`, `ticket`, `status`, `created`, `updated`, `status_history`
- Status Value Format: lowercase with hyphens (`draft`, `refined`, `ready-for-dev`, `in-progress`, `review`, `approved`, `done`, `changes-needed`, `cancelled`)

**Write Boundary Patterns (CRITICAL)**
- `/scrum-create-ticket`: May write `story.md`, `status: draft` only
- `/scrum-refine-ticket`: May write `refinement.md` only
- `/scrum-refine-story`: May write `plan.md`, status in `story.md` only
- `/scrum-dev-story`: May write source code, test files only
- `/scrum-review-story`: May write `review-N.md` only
- `/scrum-approve`: May write `approval-N.md`, status in `story.md` only
- `/scrum-verify`: May write `verification-report.md` only

**Actor Identity Patterns**
- Human: `human`
- Agent: `{name}-agent` (e.g., `architect-agent`)
- Skill: `{name}-skill` (e.g., `readiness-check-skill`)
- System/CLI: `system`

**Timestamp & ID Patterns**
- Timestamps: ISO 8601 UTC (`2026-04-06T10:00:00Z`)
- Story IDs: `SW-{NNN}` (3-digit, zero-padded)
- Decision Records: `DR-{NNN}`
- Risk Notes: `RN-{NNN}`
- Research Reports: `RR-{NNN}`

**Error Message Patterns**
- Standard Format: `❌ {Error Type}: {Brief description}` with `**Details:**` and `**Next Step:**`
- Error Categories: `Status Guard Violation`, `Prerequisite Missing`, `Write Boundary Violation`, `Validation Failed`

**Cross-Agent Communication Patterns**
- Context Isolation: Each agent receives only relevant context
- Feedback Collection: Structured accept/reject per perspective with `feedback-{agent-name}.md`

**Phase 3-4 Gaps (Deferred)**
- `/scrum-verify` Command (Phase 3)
- Policy Violation Detection (Phase 3)
- Central Audit Trail (Phase 3)
- Story Classifier (Phase 4)
- Adaptive Workflow Depth (Phase 4)
- Extended Agent Types (Phase 4)

### UX Design Requirements

**Core Experience**
- UX-DR1: Zero-Config Default — `npx create-scrum-workflow` without flags = complete installation
- UX-DR2: One-Line Success — After installation, a single clear success message with the first command
- UX-DR3: Progressive Disclosure — Advanced options (`--platform`, `--depth`) only for power users
- UX-DR4: Auto-Detection — Platform detection (Claude Code, Cursor, Windsurf, etc.) without user input
- UX-DR5: Default Directory — Current Working Directory as default, no prompts

**CLI Output Patterns**
- UX-DR6: Color System Implementation — Success=Green, Warning=Yellow, Error=Red, Info=Cyan
- UX-DR7: Emoji Prefixes — ✓ for success, ⚠ for warning, ❌ for error, ℹ for info
- UX-DR8: Progress Indicators — Spinner for running, Checkmark for complete, X mark for failed
- UX-DR9: Single Line Per Message — Each message on one line, prefix + emoji first

**Interaction Patterns**
- UX-DR10: Confirmation Dialogs — Destructive actions require `? Continue? (y/N)` confirmation
- UX-DR11: Prompt Pattern — Missing info prompts with default values in parentheses
- UX-DR12: Selection Pattern — Multiple options numbered `(1) Option, (2) Option`

**Consistency Rules**
- UX-DR13: Color Coding — Semantic colors consistently applied across all outputs
- UX-DR14: Actionable Next Step — Success messages include what to do next
- UX-DR15: Consistent Emoji Prefixes — Status indicator first, then message

**Accessibility**
- UX-DR16: Color Contrast — 4.5:1 minimum contrast ratio (terminal default themes support high contrast)
- UX-DR17: Keyboard Navigation — Tab completion and arrow keys supported
- UX-DR18: Screen Reader Compatibility — Text-based output is screen reader compatible

**Typography & Layout**
- UX-DR19: Monospace Font — Uses terminal's native font, no custom fonts
- UX-DR20: Single Column Layout — Full terminal width, minimal padding, logical grouping

### FR Coverage Map

- FR-1: Epic 1 — Story creation from natural language
- FR-2: Epic 1 — Story artifact with YAML frontmatter
- FR-3: Epic 5 — Manual workflow depth override
- FR-4: Epic 3 — 9-state lifecycle with guarded transitions
- FR-5: Epic 2 — Approve story via `/scrum-approve`
- FR-6: Epic 2 — Rejection flow (changes-needed cycle)
- FR-7: Epic 2 — Append-only status_history tracking
- FR-8: Epic 3 — Block invalid state transitions
- FR-9: Epic 3 — Write boundary enforcement per command
- FR-10: Epic 3 (Story 3.2) — Manual status edit detection and visibility
- FR-11: Epic 3 — No silent inconsistent state
- FR-12: Epic 1 — 3 parallel refinement agents with isolated context
- FR-13: Epic 1 — Independent agent perspectives
- FR-14: Epic 1 — Cross-talk rounds with blocker classification
- FR-15: Epic 1 — Synthesis of accepted perspectives
- FR-16: Epic 1 — Accept/reject per perspective
- FR-17: Epic 1 — Wideband Delphi estimation
- FR-18: Epic 4 — Story completeness validation (5 criteria)
- FR-19: Epic 4 — plan.md as mandatory readiness output
- FR-20: Epic 4 — plan.md existence check before dev
- FR-21: Epic 8 — Verification report via `/scrum-verify`
- FR-22: Epic 1 — Independent code review via separate agent
- FR-23: Epic 1 — Severity-classified review findings
- FR-24: Epic 2 — Review verdict: approved or changes-needed
- FR-25: Epic 2 — Incremental review artifact numbering
- FR-26: Epic 7 — Decision records as standalone artifacts
- FR-27: Epic 7 — Session continuity via `/session-start`
- FR-28: Epic 7 — Session wrap-up via `/wrap-up`
- FR-29: Epic 7 — Risk notes from Architect perspectives
- FR-30: Epic 7 — Auto-load risk notes during review
- FR-31: Epic 7 — Research Reports as persistent artifacts
- FR-32: Epic 9 — Story classification by type and risk
- FR-33: Epic 9 — Workflow depth selection by risk
- FR-34: Epic 9 — Dynamic agent dispatch
- FR-35: Epic 9 — Extended agent types (Security, UX, Contract)
- FR-36: Epic 9 — Configurable risk thresholds
- FR-37: Epic 8 — Policy violation detection and blocking
- FR-38: Epic 8 — Central audit trail per story
- FR-39: Epic 8 — Sprint observability via `/sprint-status`
- FR-40: Epic 8 — Delivery health monitoring
- FR-41: Epic 1 — Framework installation via npx
- FR-42: Epic 1 — First ticket within 30 minutes
- FR-43: Epic 5 — CLI update/migration command
- FR-44: Epic 1 — Runtime file-based extension model
- FR-45: Epic 1 — Research commands with persistent artifacts
- FR-46: Epic 1 — Artifact contract (predictable locations)
- UX-DR1 to UX-DR20: Epic 6 — CLI UX & Installation Experience

## Epic List

### Epic 1: Establish Reliable Foundation
Developer kann sich darauf verlassen, dass alle bestehenden Features der aktuellen PRD-Spezifikation entsprechen. Das Framework verlässlich und auf aktuellem Stand — Vertrauen durch Verifikation gegen aktuelle Spec.
**FRs covered:** FR-1, FR-2, FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-22, FR-23, FR-41, FR-42, FR-44, FR-45, FR-46

### Epic 2: Story Approval & Lifecycle Completion
Developer kann Stories genehmigen, Ablehnungen verarbeiten und den vollen draft→done Lifecycle abschließen. Approval ist ein mandatory Human Gate vor `done`.
**FRs covered:** FR-5, FR-6, FR-7, FR-24, FR-25

### Epic 3: Lifecycle Guards & Write Boundaries
Developer ist vor ungültigen Zustandsübergängen geschützt. Agents schreiben nur in ihrem definierten Bereich. Keine stillen Fehler.
**FRs covered:** FR-4, FR-8, FR-9, FR-10, FR-11

### Epic 4: Plan Enforcement & Readiness Validation
Developer bekommt einen validierten Execution Plan bevor die Implementierung beginnt. Kein `/scrum-dev-story` ohne `plan.md`.
**FRs covered:** FR-18, FR-19, FR-20

### Epic 5: Workflow Depth & CLI Migration
Developer kann leichtgewichtigen Prozess für einfache Tasks wählen (`--depth light/standard`) und sicher von v1.2.0 upgraden.
**FRs covered:** FR-3, FR-43

### Epic 6: CLI UX & Installation Experience
Developer bekommt ein konsistentes, professionelles CLI-Erlebnis mit semantischen Farben, Progress-Indikatoren, Accessibility und Zero-Config Installation.
**FRs covered:** UX-DR1 to UX-DR20

### Epic 7: Session Memory & Decision Persistence
Developer nimmt die Arbeit sessionübergreifend wieder auf. Entscheidungen, Risiken und Kontext bleiben als persistente Artifacts erhalten.
**FRs covered:** FR-26, FR-27, FR-28, FR-29, FR-30, FR-31

### Epic 8: Governance & Sprint Observability
Developer hat Policy-Enforcement, Audit Trails und Sprint-Level Sichtbarkeit. Verification als Pflichtschritt vor Review.
**FRs covered:** FR-21, FR-37, FR-38, FR-39, FR-40

### Epic 9: Adaptive Workflows & Intelligence
System passt Prozesstiefe automatisch an Story-Risiko an und wählt passende Agent-Sets basierend auf Typ, Risiko und Domain Tags.
**FRs covered:** FR-32, FR-33, FR-34, FR-35, FR-36

---

## Epic 1: Establish Reliable Foundation

Developer kann sich darauf verlassen, dass alle bestehenden Features der aktuellen PRD-Spezifikation entsprechen. Das Framework verlässlich und auf aktuellem Stand — Vertrauen durch Verifikation gegen aktuelle Spec.

**NFRs as Definition of Done:** NFR-5 (Schema Versioning), NFR-7 (Artifact Traceability), NFR-9 (Inspectability), NFR-11 (Zero-config extensibility), NFR-14 (Error recovery)

### Story 1.1: Verify & Align Ticket Creation

As a developer,
I want `/scrum-create-ticket` to produce story artifacts that match the current PRD specification,
So that I can trust that ticket creation follows the latest requirements.

**Acceptance Criteria:**

**Given** the existing implementation of `/scrum-create-ticket`
**When** compared against the current PRD specification for FR-1 and FR-2
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-1 specifies structured story creation from natural language input
**When** a developer runs `/scrum-create-ticket` with a natural language description
**Then** the generated `story.md` contains a structured breakdown derived from the input

**Given** FR-2 specifies YAML frontmatter with ticket ID, status, type, risk level, and domain tags
**When** a story is created
**Then** `story.md` contains all required frontmatter fields: `ticket` (SW-XXX format), `status: draft`, `type`, `risk_level`, `domain_tags`
**And** Architecture-mandated fields are present: `schema_version`, `created`, `updated`, `status_history`
**And** `status_history` contains the initial entry with `from: null`, `to: draft`, `trigger: /scrum-create-ticket`, `actor: human`

**Given** all deltas have been resolved
**When** the story is reviewed
**Then** the implementation fully matches the current PRD and Architecture specifications for FR-1 and FR-2

### Story 1.2: Verify & Align Agent Spawning & Perspectives

As a developer,
I want `/scrum-refine-ticket` to spawn 3 parallel agents with isolated context matching the current PRD spec,
So that refinement produces independent, high-quality perspectives.

**Acceptance Criteria:**

**Given** the existing implementation of agent spawning in `/scrum-refine-ticket`
**When** compared against the current PRD specification for FR-12 and FR-13
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-12 specifies 3 parallel refinement agents (Architect, Developer, QA) with isolated context
**When** a developer runs `/scrum-refine-ticket SW-XXX`
**Then** exactly 3 agents are spawned: Architect, Developer, and QA
**And** each agent receives only its relevant context per Architecture context isolation rules

**Given** FR-13 specifies independent perspectives covering architecture risks, implementation feasibility, and testability concerns
**When** agents complete their analysis
**Then** each agent produces an independent perspective covering its specific domain

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** agent spawning and perspective generation fully match the current PRD and Architecture specifications

### Story 1.3: Verify & Align Cross-Talk & Synthesis

As a developer,
I want cross-talk and synthesis during refinement to match the current PRD spec,
So that agent perspectives are properly debated, merged, and my accept/reject decisions are tracked.

**Acceptance Criteria:**

**Given** the existing implementation of cross-talk and synthesis
**When** compared against the current PRD specification for FR-14, FR-15, and FR-16
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-14 specifies cross-talk rounds (up to 3) with blocker classification and early-exit-on-consensus
**When** agents have produced their perspectives
**Then** the system facilitates cross-talk rounds where agents respond to each other's findings
**And** blockers are classified and tracked
**And** cross-talk exits early if consensus is reached before 3 rounds

**Given** FR-16 specifies developer accept/reject per perspective
**When** perspectives are presented to the developer
**Then** the developer can accept or reject each agent perspective individually
**And** decisions are tracked in the refinement artifact

**Given** FR-15 specifies synthesis of accepted perspectives with deduplication
**When** the developer has made accept/reject decisions
**Then** accepted perspectives are synthesized into a unified refinement artifact with overlapping findings deduplicated

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** cross-talk, accept/reject, and synthesis fully match the current PRD specifications

### Story 1.4: Verify & Align Wideband Delphi Estimation

As a developer,
I want story point estimation to follow the Wideband Delphi method as specified in the current PRD,
So that estimates are reliable and transparent.

**Acceptance Criteria:**

**Given** the existing implementation of estimation
**When** compared against the current PRD specification for FR-17
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-17 specifies Wideband Delphi with Fibonacci scale, variance threshold, re-estimation on high variance, median calculation, and confidence level
**When** refinement is complete and estimation is triggered
**Then** each agent provides an independent estimate on the Fibonacci scale
**And** the system calculates the median estimate
**And** variance is computed and compared against the threshold

**Given** high variance between agent estimates
**When** the variance exceeds the threshold
**Then** the system triggers a re-estimation round with variance highlighted

**Given** the estimation is complete
**When** the refinement artifact is written
**Then** the estimation section contains: individual agent estimates, median, variance, confidence level, and re-estimation rounds (if any)

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** estimation fully matches the current PRD specification for FR-17

### Story 1.5: Verify & Align Code Review

As a developer,
I want `/scrum-review-story` to produce severity-classified findings using a separate agent as specified in the current PRD,
So that reviews are independent, structured, and actionable.

**Acceptance Criteria:**

**Given** the existing implementation of `/scrum-review-story`
**When** compared against the current PRD specification for FR-22 and FR-23
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-22 specifies independent review using a separate model/agent from the implementer
**When** a developer runs `/scrum-review-story SW-XXX`
**Then** the review is performed by an agent/model separate from the implementer
**And** the review agent receives `story.md` + `plan.md` + implementation + previous reviews per Architecture context isolation

**Given** FR-23 specifies severity-classified findings with structured recommendations
**When** the review produces findings
**Then** each finding is classified as critical, major, or minor
**And** each finding includes a structured recommendation
**And** the review artifact follows the `review-N.md` naming convention

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** code review fully matches the current PRD and Architecture specifications

### Story 1.6: Verify & Align Installation & Onboarding

As a developer,
I want `npx create-scrum-workflow@latest` to install in under 5 minutes and enable first ticket within 30 minutes,
So that the onboarding experience matches the zero-knowledge promise.

**Acceptance Criteria:**

**Given** the existing CLI installer implementation
**When** compared against the current PRD specification for FR-41 and FR-42
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-41 specifies installation via npx in under 5 minutes
**When** a developer runs `npx create-scrum-workflow@latest` in a fresh project
**Then** installation completes successfully in under 5 minutes
**And** the CLI auto-detects the AI platform
**And** all framework files are copied to the correct locations

**Given** FR-42 specifies first ticket within 30 minutes without documentation (SC-9, SC-10)
**When** installation is complete
**Then** the success message includes an actionable next-step command
**And** a developer can run `/scrum-create-ticket` and `/scrum-refine-ticket` without reading documentation

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** installation and onboarding fully match the current PRD specifications

### Story 1.7: Verify & Align Runtime Extension Model

As a developer,
I want the framework to discover new skills, agents, and workflows at runtime through files,
So that extensibility works without registration, build steps, or restarts.

**Acceptance Criteria:**

**Given** the existing runtime discovery implementation
**When** compared against the current PRD specification for FR-44
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-44 specifies file-based extension: new SKILL.md = new capability
**When** a new `.md` file is added to `scrum_workflow/skills/`, `scrum_workflow/agents/`, or `scrum_workflow/workflows/`
**Then** the framework discovers and can utilize the new specification at runtime
**And** no configuration change, build step, or restart is required

**Given** the Architecture specifies framework directory structure
**When** the extension model is verified
**Then** the directory structure matches: `scrum_workflow/{commands,workflows,skills,agents}/{name}/`

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** the runtime extension model fully matches the current PRD and Architecture specifications

### Story 1.8: Verify & Align Research Commands

As a developer,
I want `/scrum-research-technical` and `/scrum-research-general` to produce persistent Research Report artifacts,
So that research survives sessions and can be found reliably.

**Acceptance Criteria:**

**Given** the existing research command implementation
**When** compared against the current PRD specification for FR-45 (Phase 1 scope only)
**Then** a delta analysis documents: what matches, what diverges, and what is missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-45 specifies research commands producing persistent RR-XXX.md artifacts
**When** a developer runs `/scrum-research-technical` or `/scrum-research-general`
**Then** a Research Report artifact is created in `_scrum-output/memory/research/`
**And** the artifact follows the `RR-XXX.md` naming convention
**And** YAML frontmatter includes: topic, tags, date

**Given** all deltas have been resolved
**When** the implementation is reviewed
**Then** research commands fully match the current PRD specification (Phase 1 scope)

**Note (Phased Scope):** Memory integration features (referenced-by field, automatic loading by refinement agents, ticket referencing) are deferred to Epic 7 (Phase 2). This Story 1.8 implements Phase 1 scope only — persistent artifacts with basic metadata. Cross-story linking and auto-discovery will be implemented in Epic 7 as part of the session memory system.

### Story 1.9: Verify & Align Artifact Contract

As a developer,
I want every slash-command to produce artifacts in predictable locations with consistent naming,
So that I can trust the output structure and find any artifact reliably.

**Acceptance Criteria:**

**Given** the existing artifact output behavior across all commands
**When** compared against the FR-46 artifact contract specification
**Then** a delta analysis documents: which commands produce artifacts at correct locations, which diverge, and which are missing
**And** all identified deltas are resolved to match the current PRD spec

**Given** FR-46 specifies exact artifact locations for all commands
**When** all commands have been executed
**Then** every command's output artifact exists at its specified path with correct naming:
  - `story.md` in `_scrum-output/sprints/SW-XXX/`
  - `refinement.md` in `_scrum-output/sprints/SW-XXX/`
  - `plan.md` in `_scrum-output/sprints/SW-XXX/`
  - `review-N.md` in `_scrum-output/sprints/SW-XXX/`
  - `approval-N.md` in `_scrum-output/sprints/SW-XXX/`
  - `RR-XXX.md` in `_scrum-output/memory/research/`
  - `session-summary.md` in `_scrum-output/memory/sessions/`

**Given** the Architecture specifies naming conventions (SW-XXX, review-{N}, approval-{N}, RR-XXX, DR-XXX, RN-XXX)
**When** artifacts are verified
**Then** all artifacts follow the standardized naming patterns

**Given** all deltas have been resolved
**When** the comprehensive verification is complete
**Then** a delta report documents all discrepancies found, all fixes applied, and confirms full FR-46 compliance

---

## Epic 2: Story Approval & Lifecycle Completion

Developer kann Stories genehmigen, Ablehnungen verarbeiten und den vollen draft→done Lifecycle abschließen. Approval ist ein mandatory Human Gate vor `done`.

**NFRs as Definition of Done:** NFR-4 (Atomic file operations), NFR-5 (Schema Versioning), NFR-7 (Artifact Traceability), NFR-9 (Inspectability), NFR-14 (Error recovery)

### Story 2.1: Implement Status History Tracking

As a developer,
I want every status transition to be tracked in an append-only `status_history` array,
So that I have a complete, tamper-visible audit trail for every story.

**Acceptance Criteria:**

**Given** FR-7 specifies append-only `status_history` with timestamp, trigger command, and actor identity
**When** any slash-command changes a story's status
**Then** a new entry is appended to `status_history` with fields: `from`, `to`, `timestamp` (ISO 8601 UTC), `trigger` (the command that caused the transition), `actor` (human, {name}-agent, {name}-skill, or system)
**And** existing entries are never modified or deleted

**Given** the Architecture specifies actor identity patterns
**When** a status transition occurs
**Then** the `actor` field follows the correct format: `human` for user actions, `{name}-agent` for agent actions, `{name}-skill` for skill actions, `system` for CLI/migration actions

**Given** existing stories from v1.2.0 that lack `status_history`
**When** the status history mechanism is activated
**Then** existing stories are handled gracefully (missing `status_history` does not cause errors)
**And** the first transition after upgrade creates the `status_history` array with the new entry

**Given** FR-10 specifies detection of manual status field edits
**When** a status field is changed outside of a slash-command
**Then** the discrepancy between `status` field and last `status_history` entry is detectable
**And** manual edits are visible to all participants via `trigger: manual-edit` convention

### Story 2.2: Implement `/scrum-approve` Command

As a developer,
I want to approve a completed story via `/scrum-approve`, creating an approval artifact as a mandatory human gate before `done`,
So that no story reaches `done` without explicit human approval.

**Acceptance Criteria:**

**Given** FR-5 specifies `/scrum-approve` as mandatory gate before `done`
**When** a developer runs `/scrum-approve SW-XXX` on a story with status `approved` (post-review)
**Then** an `approval-N.md` artifact is created in `_scrum-output/sprints/SW-XXX/`
**And** the artifact contains: approval timestamp, approver identity, approval reasoning/notes
**And** the story status transitions to `done`
**And** a `status_history` entry is appended with `trigger: /scrum-approve`, `actor: human`

**Given** the story is not in a valid status for approval
**When** a developer runs `/scrum-approve SW-XXX`
**Then** the system produces an actionable error message indicating the current status and required status
**And** the story status remains unchanged

**Given** SC-3 specifies no story reaches `done` without explicit `/scrum-approve`
**When** any other command attempts to transition a story to `done`
**Then** the transition is blocked
**And** only `/scrum-approve` can set status to `done`

**Given** the Architecture specifies write boundaries
**When** `/scrum-approve` executes
**Then** it only writes `approval-N.md` and status in `story.md`
**And** no other files are modified

### Story 2.3: Implement Rejection Flow

As a developer,
I want the system to support a rejection cycle where review findings are loaded as context for re-implementation,
So that issues are caught, tracked, and addressed before delivery.

**Acceptance Criteria:**

**Given** FR-6 specifies rejection flow: `review → changes-needed → in-progress`
**When** a review verdict is `changes-needed` (FR-24)
**Then** the story status transitions to `changes-needed`
**And** a `status_history` entry is appended with the review agent as actor

**Given** a story in `changes-needed` status
**When** a developer runs `/scrum-dev-story SW-XXX`
**Then** the status transitions to `in-progress`
**And** previous review findings (`review-N.md`) are loaded as context for the implementation agent
**And** the implementation agent can see what specific issues were flagged

**Given** FR-24 specifies review verdict as `approved` or `changes-needed`
**When** a review is completed
**Then** the review artifact contains a clear verdict field: `approved` or `changes-needed`
**And** both outcomes produce a persistent `review-N.md` artifact

**Given** a story has been re-implemented after `changes-needed`
**When** the developer triggers a new review
**Then** the previous review findings are available for comparison
**And** the new review can verify whether previous findings were addressed

### Story 2.4: Implement Multi-Round Review Tracking

As a developer,
I want multiple review rounds to be tracked with incremental artifact numbering,
So that the full review history is preserved and each round is distinguishable.

**Acceptance Criteria:**

**Given** FR-25 specifies incremental review artifact numbering
**When** a story goes through multiple review rounds
**Then** review artifacts are numbered sequentially: `review-1.md`, `review-2.md`, `review-3.md`, etc.
**And** each artifact is a separate file in `_scrum-output/sprints/SW-XXX/`

**Given** a story has completed the cycle: review → changes-needed → in-progress → review
**When** the second review is triggered
**Then** `review-2.md` is created (not overwriting `review-1.md`)
**And** the review agent has access to `review-1.md` findings for comparison

**Given** approval follows a successful review round
**When** `/scrum-approve` creates an approval artifact
**Then** the approval artifact is also numbered sequentially: `approval-1.md`
**And** the approval artifact references the review round that led to approval

**Given** multiple review-rejection cycles have occurred
**When** the story artifacts are inspected
**Then** the complete review history is visible: `review-1.md`, `review-2.md`, ..., `approval-1.md`
**And** each artifact is human-readable, diffable, and Git-versionable (NFR-9)

---

## Epic 3: Lifecycle Guards & Write Boundaries

Developer ist vor ungültigen Zustandsübergängen geschützt. Agents schreiben nur in ihrem definierten Bereich. Keine stillen Fehler.

**NFRs as Definition of Done:** NFR-4 (Atomic file operations), NFR-5 (Schema Versioning), NFR-9 (Inspectability), NFR-14 (Error recovery)

### Story 3.1: Consolidate 9-State Lifecycle Definition

As a developer,
I want a single source of truth for the 9-state story lifecycle including all valid transitions,
So that every command and agent operates against the same state machine definition.

**Acceptance Criteria:**

**Given** FR-4 specifies a 9-state lifecycle: draft, refined, ready-for-dev, in-progress, review, approved, done, changes-needed, cancelled
**When** the existing state machine implementation is compared against the current PRD
**Then** a delta analysis documents: which states exist, which transitions are defined, and what is missing
**And** all identified deltas are resolved

**Given** Epic 2 introduced new transitions (review → changes-needed, changes-needed → in-progress, approved → done via /scrum-approve)
**When** the lifecycle definition is consolidated
**Then** all 9 states are defined in a single, authoritative location
**And** all valid transitions are explicitly enumerated including: draft → refined, refined → ready-for-dev, ready-for-dev → in-progress, in-progress → review, review → approved, review → changes-needed, changes-needed → in-progress, approved → done, any → cancelled
**And** invalid transitions are implicitly defined (anything not listed is invalid)

**Given** the consolidated lifecycle definition
**When** any command or skill references state transitions
**Then** it references this single source of truth
**And** no command defines its own transition rules independently

### Story 3.2: Implement Status Guard Validation

As a developer,
I want the system to block invalid state transitions with actionable error messages and detect manual status edits,
So that I am protected from mistakes and the state machine integrity is maintained.

**Acceptance Criteria:**

**Given** FR-8 specifies blocking invalid state transitions with actionable error messages
**When** a developer runs a command that would cause an invalid transition (e.g., `/scrum-dev-story` on a `draft` story)
**Then** the command is blocked before any file writes occur
**And** the error message includes: current status, required status, and the next valid command to run
**And** the error follows the Architecture error format: `❌ Status Guard Violation: {description}` with `**Details:**` and `**Next Step:**`

**Given** FR-10 specifies detection of manual status field edits
**When** a guard validates a story's status
**Then** it compares the `status` field against the last `status_history` entry
**And** if a discrepancy is detected, a warning is surfaced indicating the status was manually edited
**And** entries with `trigger: manual-edit` are visible to all agents and commands that read the story

**Given** FR-11 specifies no silent inconsistent state
**When** any error occurs during status validation
**Then** an actionable error message is produced with: what was attempted, what failed, and the suggested next step
**And** no command leaves the story in an inconsistent state (status field and status_history always agree after command execution)

**Given** the 9-state lifecycle from Story 3.1
**When** the guard validates a transition
**Then** it checks the requested transition against the authoritative valid transitions list
**And** only transitions explicitly defined as valid are permitted

### Story 3.3: Implement Write Boundary Enforcement

As a developer,
I want each command to be constrained to writing only its defined artifacts,
So that agents cannot accidentally modify files outside their scope.

**Acceptance Criteria:**

**Given** FR-9 specifies write boundaries per command as defined in the Architecture
**When** each command's workflow specification is reviewed
**Then** every command explicitly declares its write boundary:
  - `/scrum-create-ticket`: may write `story.md` only
  - `/scrum-refine-ticket`: may write `refinement.md` only
  - `/scrum-refine-story`: may write `plan.md` and status in `story.md` only
  - `/scrum-dev-story`: may write source code and test files only
  - `/scrum-review-story`: may write `review-N.md` only
  - `/scrum-approve`: may write `approval-N.md` and status in `story.md` only
  - `/scrum-verify`: may write `verification-report.md` only

**Given** the Markdown-as-Code paradigm where specifications are the enforcement mechanism
**When** a command workflow is executed by an AI agent
**Then** the workflow specification explicitly instructs the agent what it may and may not write
**And** anti-patterns are documented in the specification: "implementation agent MUST NOT modify story.md", "review agent MUST NOT modify source code"

**Given** the Architecture specifies write boundary anti-patterns (Spec Drift, Self-Fix, Bounded Authority Violation)
**When** write boundaries are enforced
**Then** each command workflow includes explicit anti-pattern warnings
**And** the agent is instructed to halt and report if it detects a write boundary would be violated

---

## Epic 4: Plan Enforcement & Readiness Validation

Developer bekommt einen validierten Execution Plan bevor die Implementierung beginnt. Kein `/scrum-dev-story` ohne `plan.md`.

**NFRs as Definition of Done:** NFR-4 (Atomic file operations), NFR-5 (Schema Versioning), NFR-7 (Artifact Traceability), NFR-9 (Inspectability), NFR-14 (Error recovery)

### Story 4.1: Implement Story Readiness Validation & Plan Generation

As a developer,
I want `/scrum-refine-story` to validate my story against 5 immutable criteria and generate a plan.md on success,
So that I have a verified, complete execution plan before implementation begins.

**Acceptance Criteria:**

**Given** FR-18 specifies story completeness validation via `/scrum-refine-story` against 5 immutable criteria (Feature List as Immutable Contract pattern)
**When** a developer runs `/scrum-refine-story SW-XXX` on a story with status `refined`
**Then** the system validates the story against all 5 readiness criteria
**And** the criteria are explicitly defined in the validation skill (sourced from the existing `/scrum-refine-story` workflow)
**And** each criterion produces a PASS or FAIL result with explanation

**Given** all 5 criteria pass validation
**When** the validation is complete
**Then** a `plan.md` artifact is generated in `_scrum-output/sprints/SW-XXX/` (FR-19)
**And** the plan contains an actionable execution plan derived from the story and refinement artifacts
**And** the story status transitions to `ready-for-dev`
**And** a `status_history` entry is appended with `trigger: /scrum-refine-story`

**Given** one or more criteria fail validation
**When** the validation is complete
**Then** no `plan.md` is generated
**And** the story status remains `refined`
**And** the system reports which criteria failed with actionable guidance for resolution

**Given** the Architecture write boundary for `/scrum-refine-story`
**When** the command executes
**Then** it only writes `plan.md` and status in `story.md`
**And** no other files are modified

### Story 4.2: Implement Plan Existence Check Before Dev

As a developer,
I want `/scrum-dev-story` to verify that a current plan.md exists before allowing implementation,
So that no implementation starts without a validated execution plan.

**Acceptance Criteria:**

**Given** FR-20 specifies `plan.md` existence check before `/scrum-dev-story`
**When** a developer runs `/scrum-dev-story SW-XXX`
**Then** the system checks for the existence of `plan.md` in `_scrum-output/sprints/SW-XXX/`

**Given** `plan.md` does not exist
**When** the existence check fails
**Then** the command is blocked before any implementation begins
**And** an actionable error message is produced: `❌ Prerequisite Missing: plan.md not found for SW-XXX. Next Step: run /scrum-refine-story SW-XXX`

**Given** `plan.md` exists but the story has been through a `changes-needed` cycle since the plan was generated
**When** the existence check runs
**Then** the system warns the developer that the plan may be outdated
**And** suggests re-running `/scrum-refine-story` to regenerate the plan based on review findings

**Given** `plan.md` exists and is current
**When** the existence check passes
**Then** `/scrum-dev-story` proceeds with implementation
**And** the plan is loaded as context for the implementation agent

---

## Epic 5: Workflow Depth & CLI Migration

Developer kann leichtgewichtigen Prozess für einfache Tasks wählen (`--depth light/standard`) und sicher von v1.2.0 upgraden.

**NFRs as Definition of Done:** NFR-8 (Installability), NFR-14 (Error recovery), NFR-16 (Update safety)

### Story 5.1: Implement Manual Workflow Depth Override

As a developer,
I want to specify `--depth light` or `--depth standard` when creating a ticket,
So that I can choose an appropriate level of process rigor for simple vs. complex tasks.

**Acceptance Criteria:**

**Given** FR-3 specifies manual workflow depth override via `--depth light/standard`
**When** a developer runs `/scrum-create-ticket` with `--depth light` or `--depth standard`
**Then** the depth value is stored in the `story.md` YAML frontmatter as a `depth` field
**And** if no `--depth` flag is provided, the default is `standard`

**Given** a story with `depth: light`
**When** `/scrum-refine-ticket` is executed
**Then** the refinement workflow uses a reduced process:
  - 1 agent (Developer perspective only) instead of 3
  - No cross-talk rounds
  - No synthesis step (single perspective = final output)
  - Single-agent estimate instead of Wideband Delphi
**And** the readiness validation (5 criteria) remains unchanged regardless of depth

**Given** a story with `depth: standard`
**When** `/scrum-refine-ticket` is executed
**Then** the full refinement workflow runs: 3 agents, cross-talk, synthesis, Wideband Delphi estimation

**Given** SC-12a specifies manual depth override availability
**When** the depth mechanism is implemented
**Then** both `light` and `standard` values are accepted
**And** any other value produces an actionable error message

### Story 5.2: Implement CLI Update & Migration Command

As a developer,
I want `npx create-scrum-workflow@latest update` to safely migrate my project from v1.2.0 to v1.3.0,
So that I get new features without losing existing work or breaking existing stories.

**Acceptance Criteria:**

**Given** FR-43 specifies CLI update with version detection, breaking change listing, YAML migration, and post-validation
**When** a developer runs `npx create-scrum-workflow@latest update`
**Then** the CLI detects the current installed version
**And** lists all breaking changes between the installed version and the target version

**Given** the PRD specifies two breaking changes for v1.2.0 → v1.3.0: new `status_history` field and mandatory `plan.md` check
**When** migration runs
**Then** existing `story.md` files without `status_history` receive a retroactive entry: `from: null, to: {current_status}, trigger: "migrated-from-v1.2.0", actor: system`
**And** stories at `ready-for-dev` without `plan.md` are flagged with a warning and suggested action

**Given** NFR-16 specifies update safety: user modifications are never overwritten
**When** migration updates framework files
**Then** custom skills, agents, and workflows are preserved
**And** the lock file tracks user-modified files and skips them during update
**And** an update report lists all preserved files, migrated files, and any manual actions required

**Given** the migration is complete
**When** post-migration validation runs
**Then** all YAML frontmatter is parseable
**And** all `status_history` arrays are consistent
**And** the validation report confirms success or lists remaining issues with actionable guidance

---

## Epic 6: CLI UX & Installation Experience

Developer bekommt ein konsistentes, professionelles CLI-Erlebnis mit semantischen Farben, Progress-Indikatoren, Accessibility und Zero-Config Installation.

**NFRs as Definition of Done:** NFR-8 (Installability), NFR-13 (Zero-knowledge onboarding), NFR-14 (Error recovery)

### Story 6.1: Implement CLI Output Color & Emoji System

As a developer,
I want all CLI output to use a consistent color and emoji system,
So that I can instantly recognize success, warning, error, and info messages.

**Acceptance Criteria:**

**Given** UX-DR6 specifies semantic colors: Success=Green, Warning=Yellow, Error=Red, Info=Cyan
**When** any CLI command produces output
**Then** the output uses the correct semantic color for its message type
**And** colors are applied using picocolors (as specified in UX Design)

**Given** UX-DR7 specifies emoji prefixes: ✓ for success, ⚠ for warning, ❌ for error, ℹ for info
**When** a message is displayed
**Then** it is prefixed with the correct emoji for its type

**Given** UX-DR13 and UX-DR15 specify consistent color coding and emoji prefixes across all outputs
**When** multiple commands are run in sequence
**Then** the same color and emoji conventions are applied consistently
**And** no command uses custom or inconsistent status indicators

**Given** UX-DR9 specifies single line per message
**When** a status message is displayed
**Then** it appears on a single line: emoji prefix + colored message

### Story 6.2: Implement Progress Indicators

As a developer,
I want to see spinners during long operations and checkmarks when steps complete,
So that I know the CLI is working and can track progress.

**Acceptance Criteria:**

**Given** UX-DR8 specifies progress indicators: spinner for running, checkmark for complete, X mark for failed
**When** a long-running operation starts (e.g., template copying, platform detection)
**Then** a spinner is displayed with a descriptive message (e.g., `◐ Installing dependencies...`)

**Given** an operation completes successfully
**When** the spinner resolves
**Then** it is replaced by a checkmark: `✓ {operation} complete`

**Given** an operation fails
**When** the spinner resolves
**Then** it is replaced by an X mark: `✗ {operation} failed`
**And** an actionable error message follows

### Story 6.3: Implement Interactive Prompt Patterns

As a developer,
I want consistent prompt patterns for confirmations, inputs, and selections,
So that CLI interactions are predictable and intuitive.

**Acceptance Criteria:**

**Given** UX-DR10 specifies confirmation dialogs for destructive actions
**When** a destructive action is about to occur (e.g., overwriting existing files)
**Then** a confirmation prompt is displayed: `? This will overwrite existing files. Continue? (y/N)`
**And** the default is No (safe default)

**Given** UX-DR11 specifies input prompts with defaults
**When** information is missing and needs user input
**Then** a prompt is displayed with the default value in parentheses: `? Project name: (my-project)`

**Given** UX-DR12 specifies selection prompts for multiple options
**When** multiple options are available (e.g., platform selection in non-auto-detect mode)
**Then** options are numbered: `? Select platform: (1) Claude Code, (2) Cursor, (3) Windsurf`

### Story 6.4: Implement Zero-Config Installation Flow

As a developer,
I want `npx create-scrum-workflow` without any flags to complete a full installation,
So that I don't need to make any decisions during setup.

**Acceptance Criteria:**

**Given** UX-DR1 specifies zero-config default: no flags = complete installation
**When** a developer runs `npx create-scrum-workflow` without any flags
**Then** the installation completes without any prompts or decisions required

**Given** UX-DR4 specifies auto-detection of AI platform
**When** the CLI runs in a project directory
**Then** the AI platform is automatically detected (Claude Code, Cursor, Windsurf, etc.)
**And** the detection result is displayed as info: `ℹ Auto-detected platform: claude-code`

**Given** UX-DR5 specifies current working directory as default
**When** no target directory is specified
**Then** the framework is installed in the current working directory
**And** no directory prompt is shown

### Story 6.5: Implement Success Messages & Next-Step Guidance

As a developer,
I want every successful operation to end with a clear next-step call-to-action,
So that I always know what to do next.

**Acceptance Criteria:**

**Given** UX-DR2 specifies one-line success with first command hint after installation
**When** installation completes successfully
**Then** a success message is displayed with the first actionable command: e.g., `✓ Installation complete! Try: /scrum-create-ticket "your feature description"`

**Given** UX-DR14 specifies actionable next step in all success messages
**When** any command completes successfully
**Then** the success message includes what to do next

**Given** UX-DR9 specifies progressive disclosure for advanced options
**When** the default flow completes
**Then** advanced options (`--platform`, `--depth`) are not mentioned in the primary output
**And** they are only documented in help text (`--help`)

### Story 6.6: Implement Accessibility & Layout Standards

As a developer,
I want CLI output to be accessible and consistently formatted,
So that the tool works well across terminals, with screen readers, and with different visual needs.

**Acceptance Criteria:**

**Given** UX-DR16 specifies 4.5:1 minimum color contrast ratio
**When** colors are applied to terminal output
**Then** all color combinations meet the 4.5:1 contrast requirement against standard terminal backgrounds (dark and light themes)

**Given** UX-DR17 specifies keyboard navigation with Tab completion and arrow keys
**When** interactive prompts are displayed
**Then** Tab completion and arrow key navigation are supported

**Given** UX-DR18 specifies screen reader compatibility
**When** output is produced
**Then** all information is conveyed through text (not color alone)
**And** emoji prefixes provide redundant status indication alongside colors

**Given** UX-DR19 and UX-DR20 specify monospace font and single column layout
**When** output is formatted
**Then** the layout uses full terminal width in a single column
**And** sections are separated by blank lines for logical grouping
**And** no custom fonts are required — terminal default is used

---

## Epic 7: Session Memory & Decision Persistence

Developer nimmt die Arbeit sessionübergreifend wieder auf. Entscheidungen, Risiken und Kontext bleiben als persistente Artifacts erhalten.

**NFRs as Definition of Done:** NFR-2 (No external dependency), NFR-3 (Offline capability), NFR-4 (Atomic file operations), NFR-7 (Artifact Traceability), NFR-9 (Inspectability)

### Story 7.1: Implement Decision Record Extraction

As a developer,
I want decisions to be automatically extracted from refinement feedback and approval reasoning as standalone artifacts,
So that key decisions persist across sessions and inform future work.

**Acceptance Criteria:**

**Given** FR-26 specifies decision records auto-extracted from refinement feedback and approval reasoning
**When** a refinement produces decisions (e.g., technology choice, architecture pattern selection)
**Then** a `DR-XXX.md` decision record is created in `_scrum-output/memory/decisions/`
**And** the artifact follows the standardized naming convention (DR-001, DR-002, etc.)

**Given** an approval via `/scrum-approve` includes reasoning
**When** the approval reasoning contains a decision (e.g., "Approved because WebSockets chosen over SSE")
**Then** a decision record is extracted and stored

**Given** the decision record artifact
**When** it is created
**Then** it contains YAML frontmatter with: ticket reference, decision summary, date, context, alternatives considered
**And** the artifact is human-readable, diffable, and Git-versionable

### Story 7.2: Implement Risk Note Extraction & Auto-Loading

As a developer,
I want risk notes to be automatically extracted from Architect agent perspectives and loaded during reviews,
So that identified risks are tracked and inform quality checks.

**Acceptance Criteria:**

**Given** FR-29 specifies risk notes extracted from Architect agent perspectives
**When** the Architect agent produces a perspective during `/scrum-refine-ticket`
**Then** identified risks are extracted as standalone `RN-XXX.md` artifacts in `_scrum-output/memory/risks/`
**And** each risk note contains: risk description, severity, affected area, mitigation suggestion, source ticket

**Given** FR-30 specifies auto-loading of active risk notes during `/scrum-review-story`
**When** a developer runs `/scrum-review-story SW-XXX`
**Then** the review agent receives active risk notes relevant to the story's domain as additional context
**And** relevance is determined by matching domain tags and affected areas

**Given** risk notes accumulate over time
**When** risk notes are loaded
**Then** only active (unresolved) risk notes are included
**And** resolved risks are not loaded as context

### Story 7.3: Implement Session Start & Context Loading

As a developer,
I want `/session-start` to load my previous session context including open work, decisions, and risks,
So that I can resume exactly where I left off without context loss.

**Acceptance Criteria:**

**Given** FR-27 specifies `/session-start` loads open work units, last decisions, active risks, and next steps
**When** a developer runs `/session-start`
**Then** the system loads and presents:
  - Open stories with current status and pending actions
  - Recent decision records (from `_scrum-output/memory/decisions/`)
  - Active risk notes (from `_scrum-output/memory/risks/`)
  - Suggested next steps based on story statuses

**Given** SC-14 specifies "exactly where I left off" in under 60 seconds
**When** session context is loaded
**Then** the developer can identify the next action within the presented summary
**And** no prior session knowledge is required

**Given** SC-13 specifies retrieval performance with 100+ artifacts
**When** session start searches for context across a large `_scrum-output/` directory
**Then** the search completes in under 10 seconds

### Story 7.4: Implement Session Wrap-Up

As a developer,
I want `/wrap-up` to create a session summary capturing what was accomplished and what's pending,
So that the next session can pick up seamlessly.

**Acceptance Criteria:**

**Given** FR-28 specifies `/wrap-up` creates a session summary artifact
**When** a developer runs `/wrap-up`
**Then** a `session-{YYYY-MM-DD}.md` artifact is created in `_scrum-output/memory/sessions/`
**And** the summary contains: stories worked on, status changes made, decisions taken, risks identified, pending actions

**Given** the session summary artifact
**When** it is created
**Then** it contains YAML frontmatter with: date, stories touched, session duration context
**And** the content is structured for easy scanning by `/session-start`

**Given** multiple sessions on the same day
**When** `/wrap-up` is run again
**Then** the existing session file is updated (not overwritten) with additional entries
**Or** a new file with a sequence suffix is created to prevent data loss

### Story 7.5: Implement Research Memory Integration

As a developer,
I want refinement agents to automatically load relevant Research Reports based on domain and tag matching,
So that prior research informs ticket refinement without manual lookup.

**Acceptance Criteria:**

**Given** FR-31 specifies Research Reports searchable by tag and topic with auto-loading during refinement
**When** a developer runs `/scrum-refine-ticket SW-XXX`
**Then** the system searches `_scrum-output/memory/research/` for Research Reports matching the story's domain tags
**And** matching Research Reports are loaded as additional context for refinement agents

**Given** a Research Report `RR-XXX.md` exists with tags matching the current story
**When** the Architect agent produces its perspective
**Then** the perspective references the Research Report findings where relevant
**And** the agent builds upon existing research rather than re-investigating

**Given** no matching Research Reports exist
**When** refinement proceeds
**Then** the refinement workflow operates normally without research context
**And** no error or warning is produced (research is optional enrichment)

---

## Epic 8: Governance & Sprint Observability

Developer hat Policy-Enforcement, Audit Trails und Sprint-Level Sichtbarkeit. Verification als Pflichtschritt vor Review.

**NFRs as Definition of Done:** NFR-5 (Schema Versioning), NFR-7 (Artifact Traceability), NFR-9 (Inspectability), NFR-14 (Error recovery)

### Story 8.1: Implement Post-Implementation Verification

As a developer,
I want `/scrum-verify` to run automated checks (tests, lint, build) after implementation,
So that code quality is validated before review begins.

**Acceptance Criteria:**

**Given** FR-21 specifies `/scrum-verify` with automated checks as mandatory step before review
**When** a developer runs `/scrum-verify SW-XXX` on a story with status `in-progress`
**Then** the system runs automated checks: test suite, linter, and build
**And** a `verification-report.md` is created in `_scrum-output/sprints/SW-XXX/`

**Given** all automated checks pass
**When** the verification report is written
**Then** the report contains: check results (pass/fail per check), timestamp, coverage summary
**And** the story status transitions to `review`

**Given** one or more checks fail
**When** the verification report is written
**Then** the report details which checks failed with actionable guidance
**And** the story status remains `in-progress`
**And** the developer is guided to fix issues before re-running verification

**Given** the Architecture write boundary for `/scrum-verify`
**When** the command executes
**Then** it only writes `verification-report.md`
**And** no source code or other artifacts are modified

### Story 8.2: Implement Policy Violation Detection

As a developer,
I want the system to detect and block policy violations with actionable error messages,
So that governance rules are enforced across the entire story lifecycle.

**Acceptance Criteria:**

**Given** FR-37 specifies detection of at least 3 policy violation types
**When** a policy check runs (retrospective, not real-time guard)
**Then** the following violation types are detected:
  - No plan: story reached `in-progress` without `plan.md`
  - No verification: story reached `review` without `verification-report.md`
  - Skipped phase: status_history shows transitions that skip required intermediate states

**Given** a policy violation is detected
**When** the violation is reported
**Then** an actionable error message is produced following the Architecture error format
**And** the violation is logged for audit trail purposes (Story 8.3)

**Given** SC-6 specifies at least 3 violation types correctly detected and blocked
**When** policy detection is validated
**Then** all 3 violation types are demonstrated to be correctly detected

**Note:** Real-time transition guards (Epic 3) and policy violation detection (this story) are complementary. Guards prevent violations in the moment; policy detection catches violations that occurred through manual edits or bypasses.

### Story 8.3: Implement Central Audit Trail

As a developer,
I want a central audit trail per story that records all transitions, agent actions, and artifact creation events,
So that I have complete traceability for every story from draft to done.

**Acceptance Criteria:**

**Given** FR-38 specifies central audit trail per story in `_scrum-output/audit/`
**When** any status transition, agent action, or artifact creation occurs for a story
**Then** an entry is appended to the story's audit trail

**Given** the audit trail artifact
**When** entries are recorded
**Then** each entry contains: timestamp (ISO 8601 UTC), event type (transition/action/artifact), actor, details
**And** the trail is append-only (entries never modified or deleted)
**And** the trail is stored in `_scrum-output/audit/SW-XXX-audit.md`

**Given** SC-7 specifies every story has traceable transition history from draft to done
**When** a story completes the full lifecycle
**Then** the audit trail contains a complete, chronological record of every event
**And** the trail is human-readable and Git-versionable

### Story 8.4: Implement Sprint Status Command

As a developer,
I want `/sprint-status` to show all stories with their current status, age, and pending actions,
So that I have sprint-level visibility at a glance.

**Acceptance Criteria:**

**Given** FR-39 specifies `/sprint-status` listing all stories with current status, age, and pending actions
**When** a developer runs `/sprint-status`
**Then** the system scans `_scrum-output/sprints/` for all story directories
**And** displays a summary table with: story ID, title, current status, age (days since creation), pending action (next required command)

**Given** stories in various states
**When** the summary is displayed
**Then** stories are sorted by status priority (blocked/changes-needed first, then in-progress, then others)
**And** stories requiring action are highlighted

**Given** no stories exist
**When** `/sprint-status` is run
**Then** a helpful message is displayed: "No stories found. Start with /scrum-create-ticket"

### Story 8.5: Implement Delivery Health Command

As a developer,
I want `/delivery-health` to show policy violations, open risks, and pending approvals,
So that I can assess overall delivery quality and address governance issues.

**Acceptance Criteria:**

**Given** FR-40 specifies `/delivery-health` showing policy violations, open risks, and pending approvals
**When** a developer runs `/delivery-health`
**Then** the system aggregates data from:
  - Audit trails (policy violations from Story 8.2)
  - Risk notes (open risks from `_scrum-output/memory/risks/`)
  - Story statuses (pending approvals = stories in `approved` status awaiting `/scrum-approve`)

**Given** policy violations exist
**When** the health report is displayed
**Then** violations are listed with severity, affected story, and recommended action

**Given** open risks exist
**When** the health report is displayed
**Then** active risk notes are summarized with affected areas and mitigation status

**Given** the delivery is healthy (no violations, no risks, no pending approvals)
**When** `/delivery-health` is run
**Then** a positive health status is displayed confirming governance compliance

---

## Epic 9: Adaptive Workflows & Intelligence

System passt Prozesstiefe automatisch an Story-Risiko an und wählt passende Agent-Sets basierend auf Typ, Risiko und Domain Tags.

**NFRs as Definition of Done:** NFR-1 (Token efficiency), NFR-6 (Response time), NFR-11 (Zero-config extensibility), NFR-14 (Error recovery)

### Story 9.1: Implement Story Classifier

As a developer,
I want the system to automatically classify stories by type and risk level at creation time,
So that the workflow depth adapts to the nature of the work.

**Acceptance Criteria:**

**Given** FR-32 specifies classification by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical)
**When** a developer runs `/scrum-create-ticket`
**Then** the system analyzes the story description and assigns a `type` and `risk_level` in the YAML frontmatter
**And** classification is based on keywords, domain tags, and content analysis

**Given** the classification is automatic
**When** the developer reviews the created story
**Then** the assigned type and risk_level are visible in the frontmatter
**And** the developer can override the classification manually if the system's assessment is incorrect

**Given** edge cases where classification is ambiguous
**When** the classifier cannot determine a clear type or risk level
**Then** it defaults to `type: feature` and `risk_level: medium` (safe defaults)
**And** a note is added suggesting the developer review the classification

### Story 9.2: Implement Adaptive Workflow Depth Selection

As a developer,
I want the system to automatically select workflow depth (Light/Standard/Heavy) based on story risk classification,
So that low-risk work moves fast and high-risk work gets thorough treatment.

**Acceptance Criteria:**

**Given** FR-33 specifies automatic workflow depth selection based on risk classification
**When** a story has been classified (Story 9.1)
**Then** the system selects workflow depth:
  - `light`: risk_level = low
  - `standard`: risk_level = medium
  - `heavy`: risk_level = high or critical

**Given** FR-36 specifies configurable risk thresholds in `config.yaml`
**When** the depth selection runs
**Then** the thresholds for Light/Standard/Heavy are read from `config.yaml`
**And** the thresholds can be customized by the developer

**Given** SC-12 specifies process bypass rate = 0 (adaptive workflow depth works)
**When** depth is automatically selected
**Then** the developer is informed of the selected depth and can override it
**And** the selected depth is stored in `story.md` frontmatter

**Given** the developer wants to override the automatic classification
**When** the developer provides a `--depth` flag explicitly (via manual override mechanism)
**Then** the manual override takes precedence over automatic classification
**And** a note is added to frontmatter indicating manual override
**And** the override mechanism allows choice of: `--depth light`, `--depth standard`, or `--depth heavy`

### Story 9.3: Implement Dynamic Agent Dispatcher

As a developer,
I want the system to dynamically dispatch the appropriate set of agents based on story type, risk, and domain tags,
So that each story gets the most relevant expert perspectives.

**Acceptance Criteria:**

**Given** FR-34 specifies dynamic agent dispatch based on story type, risk, and domain tags
**When** `/scrum-refine-ticket` is triggered for a story
**Then** the dispatcher selects agents based on:
  - Story type (e.g., infrastructure stories get Architect + Developer, skip QA)
  - Risk level (e.g., high-risk adds Security Reviewer)
  - Domain tags (e.g., frontend-tagged adds UX Reviewer)

**Given** the selected agent set
**When** refinement begins
**Then** only the selected agents are spawned with their relevant context
**And** the agent selection rationale is logged in the refinement artifact

**Given** the dispatcher cannot determine an appropriate agent set
**When** classification is ambiguous
**Then** the default agent set is used (Architect, Developer, QA — standard workflow)

### Story 9.4: Implement Extended Agent Types

As a developer,
I want Security Reviewer, UX Reviewer, and Contract Validator agents available for specialized stories,
So that domain-specific expertise is applied where needed.

**Acceptance Criteria:**

**Given** FR-35 specifies extended agent types: Security Reviewer, UX Reviewer, Contract Validator
**When** the agent definitions are created
**Then** three new agent specifications exist:
  - `security-reviewer/agent.md` — reviews security-tagged stories for vulnerabilities, auth issues, data exposure
  - `ux-reviewer/agent.md` — reviews frontend-tagged stories for usability, accessibility, design consistency
  - `contract-validator/agent.md` — post-implementation validation that code matches story spec

**Given** the agents follow the Markdown-as-Code paradigm
**When** agent files are placed in `scrum_workflow/agents/`
**Then** the framework discovers them at runtime (FR-44)
**And** the dynamic dispatcher (Story 9.3) can select them based on story attributes

**Given** the context isolation rules from Architecture
**When** extended agents are spawned
**Then** each agent receives only its relevant context:
  - Security Reviewer: story + code + security-related risk notes
  - UX Reviewer: story + code + UX design requirements
  - Contract Validator: story + plan + implementation code
**And** no agent receives other agent definitions
