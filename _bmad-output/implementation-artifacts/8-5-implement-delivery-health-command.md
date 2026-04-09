# Story 8.5: Implement Delivery Health Command

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want `/delivery-health` to show policy violations, open risks, and pending approvals,
so that I can assess overall delivery quality and address governance issues.

## Acceptance Criteria

1. **Given** FR-40 specifies `/delivery-health` showing policy violations, open risks, and pending approvals
   **When** a developer runs `/delivery-health`
   **Then** the system aggregates data from:
   - Audit trails (policy violations from Story 8.2)
   - Risk notes (open risks from `_scrum-output/memory/risks/`)
   - Story statuses (pending approvals = stories in `approved` status awaiting `/scrum-approve`)

2. **Given** policy violations exist
   **When** the health report is displayed
   **Then** violations are listed with severity, affected story, and recommended action

3. **Given** open risks exist
   **When** the health report is displayed
   **Then** active risk notes are summarized with affected areas and mitigation status

4. **Given** the delivery is healthy (no violations, no risks, no pending approvals)
   **When** `/delivery-health` is run
   **Then** a positive health status is displayed confirming governance compliance

## Tasks / Subtasks

- [x] Task 1: Create delivery-health command definition (AC: #1, #2, #3, #4)
  - [x] 1.1 Create `scrum_workflow/commands/delivery-health.md` defining the `/delivery-health` slash-command
  - [x] 1.2 Define command interface: no required arguments, optional `--format` flag (table/json)
  - [x] 1.3 Define status guard: command works from any story status

- [x] Task 2: Implement health data aggregation (AC: #1)
  - [x] 2.1 Scan `_scrum-output/audit/` for policy violation records
  - [x] 2.2 Scan `_scrum-output/memory/risks/` for open risk notes (RN-XXX.md)
  - [x] 2.3 Scan `_scrum-output/sprints/` for stories in `approved` status
  - [x] 2.4 Aggregate and deduplicate findings

- [x] Task 3: Implement policy violation detection integration (AC: #2)
  - [x] 3.1 Read audit trail entries for policy violations (from Story 8.2)
  - [x] 3.2 Extract violation severity, affected story, and recommended action
  - [x] 3.3 Format violations for display

- [x] Task 4: Implement risk notes aggregation (AC: #3)
  - [x] 4.1 Read all risk note files from `_scrum-output/memory/risks/`
  - [x] 4.2 Filter for open/unresolved risks only
  - [x] 4.3 Extract affected areas and mitigation status
  - [x] 4.4 Format risk summary for display

- [x] Task 5: Implement pending approvals detection (AC: #1)
  - [x] 5.1 Scan `_scrum-output/sprints/SW-XXX/story.md` for `approved` status
  - [x] 5.2 Count stories awaiting final approval
  - [x] 5.3 List pending approvals if any

- [x] Task 6: Implement output formatting (AC: #2, #3, #4)
  - [x] 6.1 Format health report with sections: Policy Violations, Open Risks, Pending Approvals
  - [x] 6.2 Apply color coding: violations=red, risks=yellow, pending=cyan, healthy=green
  - [x] 6.3 Support `--format json` for machine-readable output
  - [x] 6.4 Show summary header with counts per category
  - [x] 6.5 Show positive message when all categories are empty

- [x] Task 7: Validation and Tests (AC: #1, #2, #3, #4)
  - [x] 7.1 Create ATDD tests in `tests/unit/delivery-health/`
  - [x] 7.2 Verify health data aggregation across all sources
  - [x] 7.3 Verify policy violation display
  - [x] 7.4 Verify open risks display
  - [x] 7.5 Verify pending approvals display
  - [x] 7.6 Verify healthy state message

## Dev Notes

### Critical Context: Delivery Health Command (FR-40)

This story implements `/delivery-health` for delivery quality assessment. It aggregates data from audit trails, risk notes, and story statuses to provide a comprehensive health report.

**Key Technical Details:**
- **Command**: `/delivery-health` (no required arguments)
- **Optional Flag**: `--format table|json` (default: table)
- **Data Sources**:
  - `_scrum-output/audit/` - policy violations from Story 8.2
  - `_scrum-output/memory/risks/` - open risk notes (RN-XXX.md)
  - `_scrum-output/sprints/SW-XXX/story.md` - stories in `approved` status
- **Output Sections**: Policy Violations | Open Risks | Pending Approvals | Summary
- **Color Coding**: violations=red, risks=yellow, pending=cyan, healthy=green
- **Write Boundary**: `/delivery-health` is read-only - only reads and aggregates, no writes

**Health Categories:**
| Category | Source | Display |
|----------|--------|---------|
| Policy Violations | Audit trail entries | Severity + story + action |
| Open Risks | Risk notes (RN-XXX.md) | Severity + affected area + mitigation |
| Pending Approvals | Stories with `approved` status | Count + story list |

**Severity Levels:**
| Level | Color | Meaning |
|-------|-------|---------|
| critical | red | Immediate action required |
| major | yellow | Should be addressed soon |
| minor | cyan | Low priority, can address later |

**Healthy State Criteria:**
- No policy violations
- No open risks
- No pending approvals (or all approved)

### Architecture Compliance

- **FR-40**: Delivery health monitoring via `/delivery-health` showing policy violations, open risks, and pending approvals
- **FR-37**: Policy violation detection (Story 8.2) - delivery-health reuses audit trail data
- **FR-29**: Risk note extraction - delivery-health aggregates open risks from `_scrum-output/memory/risks/`
- **NFR-9**: All output is human-readable (terminal table format)
- **UX-DR6**: Semantic color system - violations=red, risks=yellow, pending=cyan, healthy=green
- **UX-DR7**: Emoji prefixes - ✓ for success, ⚠ for warning, ❌ for error, ℹ for info
- **UX-DR9**: Single line per message
- **Write Boundary**: `/delivery-health` is read-only - only reads and aggregates, no writes

### Project Structure Notes

- **Command**: `scrum_workflow/commands/delivery-health.md`
- **Utility**: `scrum_workflow/utils/delivery-health.js` for aggregation logic
- **Tests**: `tests/unit/delivery-health/` or `scrum_workflow/__tests__/delivery-health.test.ts`
- **Reference Sources**:
  - `scrum_workflow/utils/sprint-status.js` - for story scanning patterns
  - `scrum_workflow/utils/policy.js` - for policy violation patterns
  - `scrum_workflow/utils/audit.js` - for audit trail reading patterns
  - `scrum_workflow/utils/verify.js` - for verification report patterns
- **Output Directory**: `_scrum-output/` (NOT `_bmad-output`)

### Previous Story Intelligence (from Story 8.4)

**Learnings from Story 8.4 (Sprint Status Command):**

1. **Pre-existing files**: Check for existing files before creating new ones - many files are pre-created.

2. **Path resolution**: Use `fileURLToPath(import.meta.url)` for reliable test location tracking instead of `process.cwd()`.

3. **Template injection**: Escape `{{` and `}}` in replacement values to prevent template injection attacks.

4. **Atomic file writes**: Write to temp file then rename to prevent corrupt state on abort (if implementing any file output).

5. **Path traversal**: Sanitize ticket ID with format validation `/^SW-\d{3}$/` before using in file paths.

6. **Output format**: Markdown tables are human-readable but consider terminal table formatting with colors for command output.

7. **Status integration**: Story 8.4 integrates with story metadata for age calculation - can reuse `parseStoryMetadata` pattern.

8. **Scan pattern**: Use `readdirSync` with filter for `SW-\d{3}` pattern to find story directories.

**Learnings from Story 8.3 (Central Audit Trail):**

1. **Audit directory**: Uses `_scrum-output/audit/` - same root directory as sprints (`_scrum-output/`)

2. **Read-only pattern**: Story 8.3 creates audit entries, Story 8.5 reads them - no write conflict.

**Learnings from Story 8.2 (Policy Violation Detection):**

1. **Policy violations stored**: Policy violations are recorded in audit trail with severity classification.

2. **Timeout handling**: `execSync` has no timeout - add explicit timeout (300s suggested) to prevent indefinite hangs.

### Risk Note Format Reference

Risk notes (RN-XXX.md) should have YAML frontmatter with:
```yaml
---
severity: critical|major|minor
affected_area: <description>
mitigation: <suggested action>
status: open|resolved
ticket: SW-XXX
---
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 8.5]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-40]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 1. Naming Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 5. Actor Identity Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Pattern 6. Timestamp & ID Patterns]
- [Source: _bmad-output/implementation-artifacts/8-4-implement-sprint-status-command.md]
- [Source: scrum_workflow/utils/sprint-status.js] (reference for story scanning)
- [Source: scrum_workflow/utils/policy.js] (reference for policy patterns)
- [Source: scrum_workflow/utils/audit.js] (reference for audit trail reading)
- [Source: scrum_workflow/commands/sprint-status.md] (reference for command structure)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-20250514

### Debug Log References

- Policy violation scanning: Files matching SW-XXX-policy-violations.md or SW-XXX-audit.md with policy-violation content
- Risk note parsing: YAML frontmatter with severity, affected_area, mitigation, status, ticket fields
- Story status parsing: YAML frontmatter with status field for approved filtering
- Pattern reference: Reused scanSprintStories pattern from sprint-status.js

### Completion Notes List

1. **Created command definition**: `scrum_workflow/commands/delivery-health.md` - defines /delivery-health slash command with --format flag (table/json)
2. **Created utility module**: `scrum_workflow/utils/delivery-health.js` - aggregation logic for all three data sources
3. **Created workflow documentation**: `scrum_workflow/workflows/delivery-health.md` - step-by-step execution workflow
4. **Implemented data aggregation**:
   - Scans `_scrum-output/audit/` for policy violation files (SW-XXX-policy-violations.md and SW-XXX-audit.md)
   - Scans `_scrum-output/memory/risks/` for open risk notes (RN-XXX.md with status: open)
   - Scans `_scrum-output/sprints/SW-XXX/story.md` for stories with status: approved
5. **Implemented output formatting**:
   - Table format with Summary, Policy Violations, Open Risks, Pending Approvals sections
   - JSON format for machine-readable output
   - Color coding per UX-DR6: critical=red, major=yellow, minor=cyan, healthy=green
   - Emoji prefixes per UX-DR7: ❌ for violations, ⚠ for risks, ℹ for pending, ✓ for healthy
6. **Tested all scenarios**: Empty state (healthy), mixed data (violations + risks + pending), all three categories working

### File List

- scrum_workflow/commands/delivery-health.md (NEW)
- scrum_workflow/utils/delivery-health.js (NEW)
- scrum_workflow/workflows/delivery-health.md (NEW)
