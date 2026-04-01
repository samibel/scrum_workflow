# Story 9.8: Incremental Update Mode for Research

Status: done

## Story

As a developer,
I want to update existing research documents with new findings without regenerating from scratch,
so that my research stays current as new information becomes available.

## Acceptance Criteria

1. **Update mode triggered by --update flag**: When the user runs `/scrum-research technical <existing-topic> --update` or `/scrum-research general <existing-topic> --update`, the workflow enters update mode (not full-research mode):
   - The agent reads `.research-state.json` to determine when the research was last conducted (FR85)
   - The agent identifies existing research document for the topic
   - If `.research-state.json` does not exist or topic not found, the agent falls back to full-research mode with a warning: "No previous research state found for topic '{topic}'. Running full research."

2. **Targeted web research for new information**: The agent performs targeted WebSearch queries for new information since the last research date:
   - Uses date filters in search queries (e.g., "after:YYYY-MM-DD")
   - Focuses on updates, changes, and new developments since last research
   - Identifies deprecated information or changed recommendations

3. **Diff comparison**: The agent compares new findings against existing document content:
   - Identifies new information not in existing document
   - Identifies changed information (updated recommendations, version changes)
   - Identifies deprecated or obsolete information

4. **Diff summary presentation**: The agent presents a diff summary to the user before writing:
   - Format: "New findings: +N sources, ~M sections updated, -O sections removed"
   - Summary must be clear and actionable, showing what will change
   - Summary must be presented BEFORE any files are modified

5. **User confirmation required**: The user must confirm the update before any docs are modified:
   - Prompt: "Apply these changes? [y/N]"
   - Only if user confirms (y/Y) does the agent write the changes
   - If user rejects (n/N or anything else), no docs are modified and workflow exits cleanly

6. **Incremental document updates**: If confirmed, the agent updates relevant sections while preserving unchanged content:
   - Update `sources` array in frontmatter with new source URLs
   - Update `date` field in frontmatter to current date
   - Update sections with new findings while preserving unchanged sections
   - Mark deprecated information as outdated or remove if no longer relevant

7. **Research state update**: After successful update, the agent updates `.research-state.json` with new timestamps and sources:
   - Update `last_updated` timestamp for the topic
   - Append new sources to the sources list
   - Update research confidence if changed

8. **No new findings handling**: If no new findings are detected, the agent reports: "No new information found since last research."
   - No documents are modified
   - Research state is NOT updated (no need)
   - Workflow exits cleanly

## Tasks / Subtasks

- [x] Task 1: Implement update mode detection (AC: #1)
  - [x] 1.1: Update `scrum_workflow/commands/research-technical.md` to document `--update` flag
  - [x] 1.2: Update `scrum_workflow/workflows/research-technical.md` Step 0 to detect `--update` flag
  - [x] 1.3: Add mode routing: if `--update` flag present, route to Update Mode steps; otherwise proceed with full research

- [x] Task 2: Implement research state reading (AC: #1)
  - [x] 2.1: Add Step for loading `.research-state.json` from `docs/research/`
  - [x] 2.2: Parse state file to find topic entry with last research date
  - [x] 2.3: Implement fallback to full-research mode if state file missing or topic not found

- [x] Task 3: Implement targeted web research (AC: #2)
  - [x] 3.1: Add step for date-filtered WebSearch queries
  - [x] 3.2: Generate search queries with date filters: "{topic} updates after:{last_date}"
  - [x] 3.3: Focus research on changes, updates, and new developments

- [x] Task 4: Implement diff comparison (AC: #3)
  - [x] 4.1: Load existing research document content
  - [x] 4.2: Compare new findings against existing sections
  - [x] 4.3: Categorize changes: new, modified, deprecated

- [x] Task 5: Implement diff summary and confirmation (AC: #4, #5)
  - [x] 5.1: Generate diff summary in format: "New findings: +N sources, ~M sections updated"
  - [x] 5.2: Present summary to user with clear formatting
  - [x] 5.3: Implement user confirmation prompt "Apply these changes? [y/N]"
  - [x] 5.4: Handle user responses: y/Y proceeds, anything else exits cleanly

- [x] Task 6: Implement incremental updates (AC: #6)
  - [x] 6.1: Update frontmatter `sources` array with new URLs
  - [x] 6.2: Update frontmatter `date` field to current date
  - [x] 6.3: Update changed sections while preserving unchanged content
  - [x] 6.4: Handle deprecated information (mark as outdated or remove)

- [x] Task 7: Implement research state update (AC: #7, #8)
  - [x] 7.1: Update `.research-state.json` after successful document update
  - [x] 7.2: Update `last_updated` timestamp for the topic
  - [x] 7.3: Append new sources to the sources list
  - [x] 7.4: Handle "no new findings" case with clean exit

- [x] Task 8: Apply same pattern to general research (AC: all)
  - [x] 8.1: Ensure update mode works for both technical and general research
  - [x] 8.2: Both modes share the same `.research-state.json` file
  - [x] 8.3: Verify general research update flow mirrors technical research

## Dev Notes

### Architecture Compliance

- **Three-Layer Separation**: This story modifies workflow files in Framework Layer (`scrum_workflow/workflows/`). Research state file goes in State Layer (`docs/research/.research-state.json`).
- **Filesystem-Based Agent State**: The research state file enables incremental updates by persisting last research date and sources.
- **Atomic Writes (NFR1)**: Document updates should use atomic writes to prevent corruption.
- **Shared State File**: Technical and general research share the same `.research-state.json` file.

### Critical Context from Previous Stories

**Story 9-1 (researcher agent) key learnings:**
- Researcher agent uses WebSearch for external research (NOT Glob/Grep)
- Dual `active_in` values: `[research-technical, research-general]`
- Output Format defines two schemas: `technical_research` and `general_research`
- Frontmatter schema: `type`, `topic`, `date`, `sources`, `ai_optimized`, `version`, `research_confidence`
- [Source: scrum_workflow/agents/researcher.md]
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md]

**Story 9-2 (command/workflow skeleton) key learnings:**
- Command at `scrum_workflow/commands/research-technical.md` with trigger `/research-technical`
- Workflow at `scrum_workflow/workflows/research-technical.md` with Steps 0-9
- Output directory is `docs/research/`
- Filename pattern: `technical-research-{topic-slug}-{date}.md`
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md]

**Story 9-4 (web research integration) key learnings:**
- WebSearch tool integration with error handling
- Swarm Migration pattern for parallel subagent research
- Progress tracking format for user visibility
- Source verification with confidence levels
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md]

### Incremental Update Pattern from Epic 6 and Epic 7

**Story 6-6 (Business Logic Update Mode) and Story 7-8 (Architecture Update Mode) establish the pattern:**

1. **Mode Detection**: Check for `--update` flag in command invocation
2. **State File Reading**: Load existing state file to get last scan/research metadata
3. **Change Detection**: Identify what has changed since last run
4. **Diff Summary**: Present changes to user in clear format (+new, ~modified, -removed)
5. **User Confirmation**: Prompt "Apply these changes? [y/N]" before writing
6. **Incremental Update**: Update only changed sections, preserve unchanged content
7. **State Update**: Update state file after successful update
8. **No Changes Handling**: Clean exit if no changes detected

[Source: _bmad-output/implementation-artifacts/6-6-incremental-update-mode.md]
[Source: _bmad-output/implementation-artifacts/7-8-incremental-update-mode.md]

### Research State File Format

The `.research-state.json` file should follow this structure (based on Epic 6/7 scan state pattern):

```json
{
  "research_sessions": [
    {
      "topic": "agentic patterns for documentation",
      "topic_slug": "agentic-patterns-for-documentation",
      "type": "technical_research",
      "output_file": "docs/research/technical-research-agentic-patterns-for-documentation-2026-03-30.md",
      "date": "2026-03-30",
      "sources": [
        "https://www.agentic-patterns.com/patterns",
        "https://omc.vibetip.help/docs/agents"
      ],
      "research_confidence": "high",
      "last_updated": "2026-03-30T12:34:56Z"
    }
  ],
  "last_updated": "2026-03-30T12:34:56Z"
}
```

### Key Differences from Documentation Update Mode

Research update mode differs from documentation update mode (Epic 6/7) in important ways:

1. **External Sources**: Research uses WebSearch for external information (not local code scanning)
2. **Date-Based Filtering**: Research updates use date filters to find new information since last research
3. **Source URLs**: Research tracks source URLs (not file hashes)
4. **Topic-Based Lookup**: Research state is indexed by topic (not file paths)
5. **Single Document**: Research typically produces one document per topic (not multiple doc types)

### Diff Summary Format

The diff summary must be clear and actionable:

```
Research Update Available for: {topic}
========================================
Last researched: {last_date}
Time elapsed: {days} days

New Findings Detected:
  +{N} new sources since last research
  ~{M} sections with updated information
  -{O} deprecated/outdated sections

Changed Areas:
  - {section_1}: {brief description of change}
  - {section_2}: {brief description of change}

Review the changes above. You will be asked to confirm before any files are modified.
Apply these changes? [y/N]
```

### User Confirmation Flow

The confirmation prompt is the human-in-the-loop gate for update mode:
- Default is NO (safe default -- only y/Y proceeds)
- Clear prompt: "Apply these changes? [y/N]"
- User sees diff summary BEFORE being asked to confirm
- If user rejects: clean exit, no files modified, no error
- If user confirms: proceed with incremental updates

### Fallback to Full Research

If `.research-state.json` does not exist or topic not found:
- Print warning: "No previous research state found for topic '{topic}'. Running full research."
- Execute full-research mode (existing Steps 3-9)
- This handles first run or new topic research
- User gets complete research instead of error

### No New Findings Handling

If WebSearch with date filters returns no significant new information:
- Print: "No new information found since last research on {date}."
- Exit cleanly (no documents modified, research state unchanged)
- This is a success case -- no new developments since last research
- No need to update research state if nothing changed

### Project Structure Notes

- **Files to modify**:
  - `scrum_workflow/commands/research-technical.md` (add --update flag documentation)
  - `scrum_workflow/workflows/research-technical.md` (add update mode steps)
- **State file location**: `docs/research/.research-state.json` (created at runtime, not in Framework Layer)
- **Output directory**: `docs/research/` (existing)
- **No new agent files needed** (researcher agent already exists)
- **No new template files needed** (reuse existing templates)

### Scope Boundaries

**IN scope for this story**:
- Implement update mode detection with `--update` flag
- Implement research state file reading and writing
- Implement date-filtered WebSearch for new information
- Implement diff comparison between new findings and existing document
- Implement diff summary presentation
- Implement user confirmation prompt
- Implement incremental document updates
- Apply same pattern to both technical and general research

**OUT of scope (other stories)**:
- Researcher agent definition -- Story 9-1 (complete)
- Command/workflow skeleton -- Story 9-2 (complete)
- Output template -- Story 9-3 (complete)
- Web research integration -- Story 9-4 (complete)
- Reflection loop -- Story 9-5
- Filesystem-based state management -- Story 9-6 (prerequisite for this story)
- General research command -- Story 9-7

### Dependencies

**This story depends on**:
- Story 9-2: Base workflow must exist to add update mode branch
- Story 9-6: Filesystem-based state management defines `.research-state.json` format

**Stories that depend on this**:
- Story 9-9: Installer integration needs both full and update modes working
- Story 9-10: Integration tests need update mode functionality

### Testing Standards

- **ATDD Required**: Create test checklist mapping AC to validation scenarios
- **Workflow Validation**: Verify update mode steps exist and are correctly ordered
- **State File Validation**: Verify state file structure and atomic write pattern
- **User Interaction Validation**: Verify confirmation prompts and error handling
- **Fallback Validation**: Verify fallback to full-research mode when state missing

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9, Story 9.8] -- Story requirements and acceptance criteria
- [Source: scrum_workflow/workflows/research-technical.md] -- Workflow file to modify (add update mode steps)
- [Source: scrum_workflow/commands/research-technical.md] -- Command file to modify (add --update flag)
- [Source: scrum_workflow/agents/researcher.md] -- Researcher agent definition
- [Source: docs/research/technical-research-agent-patterns-2026-03-30.md] -- Agentic patterns reference
- [Source: _bmad-output/implementation-artifacts/9-1-researcher-agent-definition.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/9-2-research-technical-command-and-workflow-skeleton.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/9-4-web-research-integration-and-swarm-migration-pattern.md] -- Previous story intelligence
- [Source: _bmad-output/implementation-artifacts/6-6-incremental-update-mode.md] -- Update mode pattern reference (business logic)
- [Source: _bmad-output/implementation-artifacts/7-8-incremental-update-mode.md] -- Update mode pattern reference (architecture)
- [Source: _bmad-output/planning-artifacts/architecture.md] -- SKILL.md format, three-layer separation

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Implemented update mode detection with `--update` flag in both technical and general research commands
- Added Step 0.4 for update mode detection and routing in both workflows
- Added Update Mode section (Steps U1-U8) to technical research workflow
- Added Update Mode section (Steps U1-U8) to general research workflow
- Update mode includes: state file loading, date-filtered WebSearch, diff comparison, user confirmation, incremental updates
- Fallback to full research when state file missing or topic not found
- Clean exit when no new findings detected

### File List

- scrum_workflow/commands/research-technical.md
- scrum_workflow/workflows/research-technical.md
- scrum_workflow/commands/research-general.md
- scrum_workflow/workflows/research-general.md

