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

## Output

### On Success (Stories Found):

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
