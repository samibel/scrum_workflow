# Delivery Health Command

Command for displaying delivery health status showing policy violations, open risks, and pending approvals.

## Usage

```
/delivery-health
/delivery-health --format table
/delivery-health --format json
```

## Description

Aggregates data from multiple governance sources to provide a comprehensive delivery health report:

- **Policy Violations**: From audit trail (Stories 8.2 and 8.3)
- **Open Risks**: From risk notes in `_scrum-output/memory/risks/`
- **Pending Approvals**: Stories in `approved` status awaiting final `/scrum-approve`

## Arguments

This command has no required arguments.

## Options

| Option | Description |
|--------|-------------|
| `--format table` | Display health report as formatted table (default) |
| `--format json` | Display health report as JSON for machine parsing |

## Output

### On Success (Health Issues Found):

```
# Delivery Health Report

## Summary
| Category | Count |
|----------|-------|
| Policy Violations | 2 |
| Open Risks | 1 |
| Pending Approvals | 3 |

## Policy Violations
| Severity | Story | Recommended Action |
|----------|-------|-------------------|
| critical | SW-001 | Create plan.md before proceeding |
| major | SW-002 | Run /scrum-verify to generate report |

## Open Risks
| Severity | Affected Area | Mitigation Status |
|----------|--------------|-------------------|
| major | Database performance | Add indexing |
| minor | API latency | Add caching |

## Pending Approvals
| Story ID | Title |
|----------|-------|
| SW-003 | User authentication |
| SW-004 | API integration |
| SW-005 | Dashboard UI |

**Next Step:** Address policy violations and risks, then run /scrum-approve for pending stories.
```

### On Success (Healthy State):

```
# Delivery Health Report

## Summary
| Category | Count |
|----------|-------|
| Policy Violations | 0 |
| Open Risks | 0 |
| Pending Approvals | 0 |

✓ All systems healthy - no governance issues detected.
```

## Color Coding

Health report categories are color-coded:

| Category | Color | Emoji |
|----------|-------|-------|
| Policy Violations | Red | ❌ |
| Open Risks | Yellow | ⚠ |
| Pending Approvals | Cyan | ℹ |
| Healthy State | Green | ✓ |

## Severity Levels

| Level | Color | Meaning |
|-------|-------|---------|
| critical | Red | Immediate action required |
| major | Yellow | Should be addressed soon |
| minor | Cyan | Low priority, can address later |

## Write Boundary Rules

This command is READ ONLY:
- May read `_scrum-output/audit/*.json` for policy violation records
- May read `_scrum-output/memory/risks/*.md` for risk notes
- May read `_scrum-output/sprints/SW-XXX/story.md` for story status
- May NOT write any files

## Integration Points

This command aggregates data from:
- `/scrum-policy-check` - Policy violation detection (Story 8.2)
- `/scrum-audit-trail` - Central audit trail (Story 8.3)
- `/scrum-sprint-status` - Story status scanning (Story 8.4)

## Status Guard

This command works from any story status (read-only, no story state required).