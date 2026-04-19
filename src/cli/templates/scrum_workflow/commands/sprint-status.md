# Sprint Status Command

Command for displaying sprint-level story status with current state, age, and pending actions.

## Usage

```
/scrum-sprint-status
/scrum-sprint-status --epic N
```

## Description

Scans all story directories in `_scrum-output/sprints/` and displays a summary table with:
- Story ID (SW-XXX)
- Title
- Current status
- Age (days since creation)
- Pending action (next required command)

Stories are sorted by status priority (changes-needed > in-progress > others) and stories requiring action are highlighted.

## Arguments

This command has no required arguments.

## Options

| Option | Description |
|--------|-------------|
| `--epic N` | Filter to show only stories from epic N |
| `--dashboard` | Force ASCII Kanban board output (overrides config) |
| `--table` | Force markdown table output (overrides config) |

## Display Mode

Determine display mode in this priority order:
1. `--dashboard` flag → dashboard mode
2. `--table` flag → table mode
3. `sprint_status.display_mode` in `scrum_workflow/config.yaml` → use that value
4. Default → `table`

## Output

### Table Mode (Stories Found):

```
# Sprint Status

| Story ID | Title | Status | Age | Pending Action |
|----------|-------|--------|-----|----------------|
| SW-001 | User authentication | changes-needed | 3d | /scrum-dev-story |
| SW-002 | API integration | in-progress | 1d | /scrum-verify |
| SW-003 | Dashboard UI | ready-for-dev | 5d | /scrum-dev-story |
...

**Total Stories:** 12
**Action Required:** 2
```

### Dashboard Mode (Stories Found):

Call `formatDashboard(stories)` from `scrum_workflow/utils/sprint-status.js`.

Before calling, attach subtask counts to each story object:
- For each story, call `parseSubtasks(story.content)` to get `{ done, total }`
- Attach as `story.subtasks = { done, total }`

The dashboard groups stories into 4 Kanban columns:

| Column | Statuses |
|--------|---------|
| 📝 BACKLOG | `draft`, `refined`, `ready-for-dev` |
| 🔧 IN PROGRESS | `in-progress`, `changes-needed` ⚠️, `blocked` 🔴 |
| 👀 REVIEW | `review`, `approved` |
| ✅ DONE | `done`, `cancelled` |

Each story card shows (4 lines):
1. Ticket ID + age + status badge (`⚠️` for changes-needed, `🔴` for blocked)
2. Title (truncated to column width)
3. Task progress: `Tasks: [██░░] 2/4` via `formatTaskProgress(done, total)`
4. Pending action command

Example output:
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SPRINT BOARD                                                         2026-04-19 │
├────────────────────┬────────────────────┬────────────────────┬──────────────────┤
│ 📝 BACKLOG         │ 🔧 IN PROGRESS     │ 👀 REVIEW          │ ✅ DONE          │
│   draft/refined... │   in-prog/blocked  │   review/approved  │   done/cancelled │
├────────────────────┼────────────────────┼────────────────────┼──────────────────┤
│ SW-006  2d         │ ⚠️ SW-001  5d      │ SW-003  3d         │ SW-005           │
│ New feature        │ Auth login flow    │ Dashboard UI       │ Initial setup    │
│ Tasks: no tasks    │ Tasks: [██░░] 2/4  │ Tasks: [████] 4/4  │ Tasks: ✓ done    │
│ /scrum-refine-tick │ /scrum-verify      │ /scrum-approve     │                  │
└────────────────────┴────────────────────┴────────────────────┴──────────────────┘
 Total: 4  |  ⚠️ Action Needed: 2  |  🔴 Blocked: 0  |  ✅ Done: 1
```

### On Success (No Stories Found):

```
ℹ️ No stories found. Start with /scrum-create-ticket
```

### Error (Invalid Epic Filter):

```
❌ Invalid epic filter: Expected a number (e.g., --epic 8)
```

## Status Priority Order

Stories are sorted by priority (highest to lowest):

1. changes-needed (requires immediate attention)
2. blocked
3. in-progress (actively being worked)
4. review (awaiting review)
5. approved (awaiting approval)
6. refined
7. ready-for-dev
8. draft
9. done (completed)
10. cancelled

## Pending Action Mapping

| Status | Next Command |
|--------|-------------|
| draft | /scrum-refine-ticket |
| refined | /scrum-refine-story |
| ready-for-dev | /scrum-dev-story |
| in-progress | /scrum-verify |
| review | /scrum-approve |
| approved | /scrum-approve (final) |
| changes-needed | /scrum-dev-story (retry) |
| blocked | /scrum-refine-ticket |
| done | N/A |
| cancelled | N/A |

## Color Coding

Story status is color-coded in terminal output:

| Status | Color |
|--------|-------|
| changes-needed | Red |
| blocked | Red |
| in-progress | Yellow |
| review | Cyan |
| approved | Green |
| done | Green |
| All others | Default |

## Write Boundary Rules

This command is READ ONLY:
- May read `_scrum-output/sprints/SW-XXX/story.md` for each story
- May read `_scrum-output/sprints/` directory structure
- May NOT write any files

## Integration Points

This command works with all story lifecycle commands:
- `/scrum-create-ticket` - Creates stories
- `/scrum-refine-ticket` - Refines stories
- `/scrum-dev-story` - Implements stories
- `/scrum-verify` - Verifies implementation
- `/scrum-approve` - Approves stories
