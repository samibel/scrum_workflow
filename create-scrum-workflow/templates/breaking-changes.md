# Breaking Changes: v1.2.0 to v1.3.0

**Migration Path:** v1.2.0 -> v1.3.0

This document lists all breaking changes introduced in the v1.3.0 release of the Scrum Workflow framework.

## Breaking Change #1: New Mandatory `status_history` Field

### What Changed

All story files (`story.md`) now require a `status_history` array in the YAML frontmatter. This field tracks the history of status transitions for each story.

### Migration Required

Existing `story.md` files without `status_history` will receive a retroactive entry during migration:

```yaml
status_history:
  - from: null
    to: {current_status}
    timestamp: "{migration_timestamp}"
    trigger: "migrated-from-v1.2.0"
    actor: system
```

### How to Check

Verify your story files have the `status_history` field:

```bash
grep -l "status_history" _scrum-output/sprints/*/story.md
```

### When This Applies

- All existing story files must be migrated
- The migration is automatic during `npx create-scrum-workflow@latest update`
- A backup is created before any modifications

---

## Breaking Change #2: New Mandatory `plan.md` Check Before `/scrum-dev-story`

### What Changed

Stories at `ready-for-dev` status now require a corresponding `plan.md` file before the `/scrum-dev-story` command can be executed.

### Why This Is Required

The plan.md file ensures stories are properly refined and have a clear implementation plan before development begins.

### How to Check

Verify stories have plan.md files:

```bash
# Stories at ready-for-dev should have plan.md
ls _scrum-output/sprints/*/plan.md
```

### What Happens During Migration

- Stories at `ready-for-dev` without `plan.md` will be flagged with a warning
- The warning will suggest: `Run /scrum-refine-story SW-XXX to generate plan.md`
- This is a **warning only** - migration will not be blocked
- You should address these warnings after migration completes

### Example Warning

```
Warning: Story SW-XXX is at ready-for-dev but missing plan.md
Suggestion: Run /scrum-refine-story SW-XXX to generate plan.md
```

---

## What Is Preserved During Migration (NFR-16)

The following user modifications are NEVER overwritten during migration:

- Custom skills in `.claude/skills/`
- Custom agents in `.claude/agents/`
- Custom workflows in `.claude/workflows/`
- Any user-modified framework files (detected via lock file hash comparison)

A lock file (`.scrum-workflow-lock.json`) tracks all installed files and their hashes. During update:

1. Files with matching hashes are overwritten with new versions
2. Files with different hashes (user-modified) are preserved
3. New files in the templates are added

---

## Dry Run Mode

Before running the migration, you can preview what would happen:

```bash
npx create-scrum-workflow@latest update --dry-run
```

This shows:
- Files that would be updated
- Files that would be preserved
- New files that would be added
- Any stories missing plan.md

---

## After Migration

After a successful migration:

1. Review the update report for any warnings
2. Address any stories flagged for missing plan.md
3. Verify your story files have valid YAML frontmatter
4. Run validation to confirm everything is working

---

## Rollback

If something goes wrong, the migration creates backups. To rollback:

1. Find the backup directory (created in your system temp folder)
2. Restore files from the backup
3. Contact support if needed
