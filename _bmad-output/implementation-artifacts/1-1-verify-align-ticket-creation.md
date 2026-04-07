# Story 1.1: Verify & Align Ticket Creation

Status: ready-for-dev

## Story

As a developer,
I want `/scrum-create-ticket` to produce story artifacts that match the current PRD specification,
so that I can trust that ticket creation follows the latest requirements.

## Acceptance Criteria

1. **Given** the existing implementation of `/scrum-create-ticket` **When** compared against the current PRD specification for FR-1 and FR-2 **Then** a delta analysis documents: what matches, what diverges, and what is missing **And** all identified deltas are resolved to match the current PRD spec

2. **Given** FR-1 specifies structured story creation from natural language input **When** a developer runs `/scrum-create-ticket` with a natural language description **Then** the generated `story.md` contains a structured breakdown derived from the input

3. **Given** FR-2 specifies YAML frontmatter with ticket ID, status, type, risk level, and domain tags **When** a story is created **Then** `story.md` contains all required frontmatter fields: `ticket` (SW-XXX format), `status: draft`, `type`, `risk_level`, `domain_tags` **And** Architecture-mandated fields are present: `schema_version`, `created`, `updated`, `status_history` **And** `status_history` contains the initial entry with `from: null`, `to: draft`, `trigger: /scrum-create-ticket`, `actor: human`

4. **Given** all deltas have been resolved **When** the story is reviewed **Then** the implementation fully matches the current PRD and Architecture specifications for FR-1 and FR-2

## Tasks / Subtasks

- [ ] Task 1: Delta Analysis — Compare existing implementation against PRD spec (AC: #1)
  - [ ] 1.1 Read and document current YAML frontmatter fields in `scrum_workflow/templates/story.md`
  - [ ] 1.2 Read and document current ticket-creation workflow in `scrum_workflow/workflows/ticket-creation.md`
  - [ ] 1.3 Read and document current command definition in `scrum_workflow/commands/create-ticket.md`
  - [ ] 1.4 Compare current frontmatter against FR-2 required fields: `ticket`, `status`, `type`, `risk_level`, `domain_tags`, `schema_version`, `created`, `updated`, `status_history`
  - [ ] 1.5 Document all deltas in a structured report section within this story file (Dev Notes)
- [ ] Task 2: Add missing frontmatter fields to story template (AC: #3)
  - [ ] 2.1 Add `type` field to `scrum_workflow/templates/story.md` frontmatter
  - [ ] 2.2 Add `risk_level` field to `scrum_workflow/templates/story.md` frontmatter
  - [ ] 2.3 Add `domain_tags` field to `scrum_workflow/templates/story.md` frontmatter
  - [ ] 2.4 Add `status_history` array to `scrum_workflow/templates/story.md` frontmatter with initial entry structure
- [ ] Task 3: Update ticket-creation workflow to populate new fields (AC: #2, #3)
  - [ ] 3.1 Update `scrum_workflow/workflows/ticket-creation.md` Step 7.2 to include `type`, `risk_level`, `domain_tags` population logic
  - [ ] 3.2 Add logic to infer `type` from description keywords (feature, bugfix, refactor, infrastructure)
  - [ ] 3.3 Add logic to assign initial `risk_level` (low/medium/high/critical) — default `medium` for Phase 1
  - [ ] 3.4 Add logic to populate `domain_tags` from context loading results (Step 3)
  - [ ] 3.5 Add `status_history` initial entry generation: `from: null`, `to: draft`, `timestamp: <ISO 8601 UTC>`, `trigger: /scrum-create-ticket`, `actor: human`
- [ ] Task 4: Update command definition to reflect new output fields (AC: #3)
  - [ ] 4.1 Update `scrum_workflow/commands/create-ticket.md` Output section to list all FR-2 frontmatter fields
- [ ] Task 5: Update validation rules (AC: #3, #4)
  - [ ] 5.1 Update validation rules in `scrum_workflow/workflows/ticket-creation.md` to include new required fields
  - [ ] 5.2 Ensure field order in frontmatter matches Architecture spec: `schema_version`, `ticket`, `title`, `status`, `type`, `risk_level`, `domain_tags`, `estimation`, `created`, `updated`, `status_history`
- [ ] Task 6: Verify structured story generation from natural language (AC: #2)
  - [ ] 6.1 Verify Step 4 (Story Generation) produces structured breakdown: title, description, acceptance criteria (Given/When/Then), subtasks
  - [ ] 6.2 Confirm guided mode (Step 2) enriches vague input before generation
- [ ] Task 7: Final compliance check (AC: #4)
  - [ ] 7.1 Review all modified files against FR-1, FR-2, and Architecture patterns
  - [ ] 7.2 Verify timestamp format is ISO 8601 UTC in status_history
  - [ ] 7.3 Verify actor identity follows Architecture pattern: `human` for user-triggered actions
  - [ ] 7.4 Verify status value format: lowercase with hyphens (`draft`)

## Dev Notes

### Delta Analysis Summary (to be completed during implementation)

**Files to analyze:**
- `scrum_workflow/templates/story.md` — The story artifact template
- `scrum_workflow/workflows/ticket-creation.md` — The ticket creation workflow (8 steps)
- `scrum_workflow/commands/create-ticket.md` — The command definition

**Known Gaps (pre-analysis from PRD vs. current template):**

The current `scrum_workflow/templates/story.md` frontmatter contains:
```yaml
schema_version: 1
ticket: "{{ticket_id}}"
title: "{{story_title}}"
status: draft
estimation: null
created: "{{created_date}}"
updated: "{{updated_date}}"
```

FR-2 requires these **missing fields**:
- `type` — Story type classification (feature, bugfix, refactor, infrastructure)
- `risk_level` — Risk classification (low, medium, high, critical)
- `domain_tags` — Domain tags array for context matching
- `status_history` — Append-only array with initial entry

The Architecture document (Section 3: Format Patterns) mandates this exact frontmatter structure:
```yaml
schema_version: 1.0.0
ticket: SW-XXX
status: draft
created: 2026-04-06T10:00:00Z
updated: 2026-04-06T10:00:00Z
status_history:
  - from: null
    to: draft
    timestamp: 2026-04-06T10:00:00Z
    trigger: /scrum-create-ticket
    actor: human
```

**Note on `schema_version`:** Current template uses `1` (integer). Architecture example uses `1.0.0` (semver string). This discrepancy must be resolved during implementation — align to whichever is the canonical version.

### Architecture Compliance Requirements

- **Write Boundaries:** `/scrum-create-ticket` may ONLY write `story.md` with `status: draft`. No other files.
- **Naming Pattern:** Story ID format `SW-XXX` (3-digit, zero-padded). Validated in workflow Step 1.2.
- **Status Values:** Must be lowercase-with-hyphens. Only valid initial status: `draft`.
- **Actor Identity:** `status_history` entries must include `actor: human` for user-triggered ticket creation.
- **Timestamp Format:** ISO 8601 UTC (e.g., `2026-04-06T10:00:00Z`). Note: current template uses `YYYY-MM-DD` for `created`/`updated` — verify if Architecture requires full ISO 8601 UTC timestamps here too.
- **Error Message Format:** `{Error Type}: {Brief description}` with `**Details:**` and `**Next Step:**`.
- **Artifact Location:** Output must be `_scrum-output/sprints/SW-XXX/story.md`.

### Technical Requirements

- **Language/Paradigm:** Markdown-as-Code. No backend, no database. Claude reads and executes SKILL.md at runtime.
- **Framework:** All changes are to `.md` files (templates, workflows, commands). No JavaScript/TypeScript code changes.
- **Approach:** This is a brownfield verification story. The implementation already exists (v1.2.0). The task is to identify gaps and align, not build from scratch.

### Critical Anti-Patterns to Avoid

- **DO NOT** modify `refinement.md`, `plan.md`, or any other artifact files — this story only touches ticket creation files.
- **DO NOT** add Phase 4 adaptive workflow logic (story classification with automatic depth selection is FR-32/FR-33, deferred to Epic 9).
- **DO NOT** implement full status_history tracking logic across all commands — that is Story 2.1. This story only adds the initial entry at creation time.
- **DO NOT** change the guided-mode skill or estimation logic unless a direct FR-1/FR-2 delta requires it.

### Relevant File Paths

| File | Purpose | Action |
|------|---------|--------|
| `scrum_workflow/templates/story.md` | Story artifact template | MODIFY — add missing frontmatter fields |
| `scrum_workflow/workflows/ticket-creation.md` | Ticket creation workflow | MODIFY — add field population logic, update validation rules |
| `scrum_workflow/commands/create-ticket.md` | Command definition | MODIFY — update output section |
| `scrum_workflow/skills/guided-mode/SKILL.md` | Vagueness detection skill | READ-ONLY — verify structured output |
| `scrum_workflow/skills/prerequisite-validation/SKILL.md` | Prerequisite checks | READ-ONLY — verify guard conditions |
| `scrum_workflow/skills/status-guard-validation/SKILL.md` | Status guard skill | READ-ONLY — verify guard conditions |
| `scrum_workflow/data/estimation-reference.yaml` | Estimation scale reference | READ-ONLY — verify estimation approach |

### Cross-Story Dependencies

- **Story 2.1 (Status History Tracking):** Builds on the `status_history` array introduced here. This story adds the initial creation entry only. Story 2.1 will implement append-only tracking across ALL commands.
- **Story 1.9 (Artifact Contract):** Verifies artifact locations. This story must ensure `story.md` is written to the correct path per FR-46.
- **Epic 9 (Adaptive Workflows):** `type` and `risk_level` fields added here will later be used by the story classifier (FR-32). For Phase 1, these are populated with basic inference/defaults.

### Project Structure Notes

- Framework files live in `scrum_workflow/` — commands, workflows, skills, agents, templates, data
- Output artifacts live in `_scrum-output/sprints/SW-XXX/`
- Memory artifacts live in `_scrum-output/memory/`
- Planning artifacts live in `_bmad-output/planning-artifacts/`

### References

- [Source: _bmad-output/planning-artifacts/prd.md — FR-1, FR-2 (lines 605-606)]
- [Source: _bmad-output/planning-artifacts/architecture.md — Section 3: Format Patterns, Section 4: Write Boundary Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.1 (lines 305-330)]
- [Source: scrum_workflow/workflows/ticket-creation.md — Full workflow (Steps 0-8)]
- [Source: scrum_workflow/templates/story.md — Current template with known gaps]
- [Source: scrum_workflow/commands/create-ticket.md — Current command definition]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
