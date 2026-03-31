---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
lastStep: 'step-03-test-strategy'
lastSaved: '2026-03-31T03:00:00Z'
inputDocuments:
  - _bmad-output/implementation-artifacts/9-8-incremental-update-mode-for-research.md
  - scrum_workflow/workflows/research-technical.md
  - scrum_workflow/commands/research-technical.md
  - _bmad/tea/config.yaml
---

# ATDD Checklist for Story 9-8: Incremental Update Mode for Research

## Story Information

- **Story ID**: 9-8
- **Title**: Incremental Update Mode for Research
- **Status**: ready-for-dev

## Acceptance Criteria

| AC# | Description | Priority | Test Coverage |
|-----|-------------|----------|---------------|
| AC1 | Update mode triggered by --update flag | P0 | 15 tests |
| AC2 | Targeted web research for new information | P0 | 10 tests |
| AC3 | Diff comparison | P0 | 8 tests |
| AC4 | Diff summary presentation | P0 | 6 tests |
| AC5 | User confirmation required | P0 | 5 tests |
| AC6 | Incremental document updates | P0 | 10 tests |
| AC7 | Research state update | P0 | 8 tests |
| AC8 | No new findings handling | P0 | 5 tests |

## Test Strategy

- **Test Level**: File System Validation (Infrastructure/Framework)
- **Test Framework**: Jest with TypeScript
- **TDD Phase**: RED (tests will fail because files do not exist yet)
- **Detected Stack**: backend (workflow/command file validation, no browser testing)

## Key Implementation Areas

1. **Command File Updates** (`scrum_workflow/commands/research-technical.md`)
   - Add `--update` flag documentation
   - Document fallback behavior

2. **Workflow File Updates** (`scrum_workflow/workflows/research-technical.md`)
   - Add Update Mode branch in Step 0
   - Add steps for research state reading
   - Add steps for date-filtered WebSearch
   - Add steps for diff comparison
   - Add steps for user confirmation
   - Add steps for incremental updates
   - Add steps for state file update

3. **State File Format** (`docs/research/.research-state.json`)
   - JSON structure with research_sessions array
   - Topic-based lookup
   - Last updated timestamps

## Mode Selection

**Chosen Mode**: AI Generation

**Rationale**:
- Acceptance criteria are clear and well-defined
- Scenarios are standard (flag detection, file updates, workflow branching)
- Detected stack is backend (workflow/command file validation)
- No browser recording needed

## Test Coverage Summary

- **Total Tests**: 67
- **P0 (Critical)**: 42 tests
- **P1 (High)**: 20 tests
- **P2 (Medium)**: 5 tests

## Step 3: Test Strategy

### AC1: Update mode triggered by --update flag (15 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 1.1 | P0 | Command file documents --update flag in Input section |
| 1.2 | P0 | Workflow Step 0.2 detects --update flag |
| 1.3 | P0 | Workflow has Update Mode routing logic |
| 1.4 | P0 | Update mode reads .research-state.json |
| 1.5 | P0 | Fallback to full research when state file missing |
| 1.6 | P0 | Fallback warning message format |
| 1.7 | P1 | Update mode reads existing research document |
| 1.8 | P1 | Topic lookup in research_sessions array |
| 1.9 | P1 | Fallback when topic not in state file |
| 1.10 | P1 | Update mode branches to update steps |
| 1.11 | P1 | Full research mode branches to existing steps |
| 1.12 | P2 | State file path is configurable |
| 1.13 | P2 | Command file shows --update usage example |
| 1.14 | P2 | Workflow documents both modes clearly |
| 1.15 | P2 | Error handling for malformed state file |

### AC2: Targeted web research for new information (10 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 2.1 | P0 | Workflow has date-filtered WebSearch step |
| 2.2 | P0 | Search query includes after:{last_date} filter |
| 2.3 | P0 | Workflow focuses on updates and changes |
| 2.4 | P0 | Workflow identifies deprecated information |
| 2.5 | P1 | Multiple search queries for different aspects |
| 2.6 | P1 | Search targets official docs, changelogs, releases |
| 2.7 | P1 | Confidence levels for new findings |
| 2.8 | P1 | Error handling for WebSearch failures |
| 2.9 | P2 | Configurable date range for updates |
| 2.10 | P2 | Search query templates documented |

### AC3: Diff comparison (8 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 3.1 | P0 | Workflow has diff comparison step |
| 3.2 | P0 | Identifies new information not in existing document |
| 3.3 | P0 | Identifies changed information |
| 3.4 | P0 | Identifies deprecated information |
| 3.5 | P1 | Diff categories: new, modified, deprecated |
| 3.6 | P1 | Comparison against existing document sections |
| 3.7 | P1 | Version change detection |
| 3.8 | P2 | Diff algorithm documented in workflow |

### AC4: Diff summary presentation (6 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 4.1 | P0 | Diff summary format matches specification |
| 4.2 | P0 | Summary shows +N sources count |
| 4.3 | P0 | Summary shows ~M sections updated count |
| 4.4 | P0 | Summary shows -O sections removed count |
| 4.5 | P1 | Summary presented BEFORE file modification |
| 4.6 | P1 | Clear section-by-section change list |

### AC5: User confirmation required (5 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 5.1 | P0 | Confirmation prompt "Apply these changes? [y/N]" |
| 5.2 | P0 | Only y/Y proceeds with update |
| 5.3 | P0 | Any other input exits without modification |
| 5.4 | P1 | Prompt appears after diff summary |
| 5.5 | P1 | Clean exit message on rejection |

### AC6: Incremental document updates (10 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 6.1 | P0 | Updates sources array in frontmatter |
| 6.2 | P0 | Updates date field in frontmatter |
| 6.3 | P0 | Preserves unchanged sections |
| 6.4 | P0 | Updates changed sections with new findings |
| 6.5 | P0 | Marks or removes deprecated information |
| 6.6 | P1 | Appends new sources to existing list |
| 6.7 | P1 | Deduplicates source URLs |
| 6.8 | P1 | Updates research_confidence if changed |
| 6.9 | P1 | Atomic write pattern documented |
| 6.10 | P2 | Backup of previous version optional |

### AC7: Research state update (8 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 7.1 | P0 | Updates .research-state.json after document update |
| 7.2 | P0 | Updates last_updated timestamp |
| 7.3 | P0 | Appends new sources to sources list |
| 7.4 | P0 | Updates research_confidence if changed |
| 7.5 | P1 | State file format matches specification |
| 7.6 | P1 | Topic-based lookup structure |
| 7.7 | P1 | ISO 8601 timestamp format |
| 7.8 | P2 | State file atomic write |

### AC8: No new findings handling (5 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| 8.1 | P0 | Reports "No new information found" message |
| 8.2 | P0 | No documents modified on no findings |
| 8.3 | P0 | Research state NOT updated on no findings |
| 8.4 | P1 | Clean exit without error |
| 8.5 | P1 | Includes last research date in message |

## Cross-Cutting Tests

### Workflow Structure Compliance (10 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| CC1 | P0 | Update mode steps are numbered sequentially |
| CC2 | P0 | Update mode integrates with existing workflow phases |
| CC3 | P1 | Step references are consistent |
| CC4 | P1 | Write boundaries include .research-state.json |
| CC5 | P1 | Prerequisites section mentions state file |
| CC6 | P1 | Error handling for each update step |
| CC7 | P2 | Workflow maintains readability with update mode |
| CC8 | P2 | Update mode steps follow existing conventions |
| CC9 | P2 | Clear separation between full and update modes |
| CC10 | P2 | Progress tracking format consistent |

### State File Structure Validation (5 tests)

| Test ID | Priority | Description |
|---------|----------|-------------|
| SF1 | P0 | State file has research_sessions array |
| SF2 | P0 | Session has topic, topic_slug, type fields |
| SF3 | P1 | Session has output_file, date, sources fields |
| SF4 | P1 | Session has research_confidence, last_updated fields |
| SF5 | P2 | State file has last_updated at root level |

## Next Step

Proceed to Step 4: Generate Failing Tests
