# Error Recovery

**← Back to [Index](00-index.md)** | **← Previous: [Implementation Patterns](12-implementation-patterns.md)** | **Next → [Extension Points](14-extension-points.md)**

---

## Recovery 1: Corrupted story.md

**Detection:** YAML parsing fails

**Recovery:**
```bash
# Option 1: Restore from git history
git log --follow -- sprints/SW-XXX/story.md
git show <commit>:sprints/SW-XXX/story.md > story.md

# Option 2: Re-run refinement
/refine-ticket SW-XXX  # Regenerates story.md
```

---

## Recovery 2: Lost plan.md

**Detection:** plan.md missing

**Recovery:**
```bash
# Re-run readiness check
/refine-ticket SW-XXX  # Regenerates plan.md
```

---

## Recovery 3: Inconsistent review-N.md

**Detection:** Review has malformed findings

**Recovery:**
```bash
# Trigger new review
/dev-story SW-XXX review  # Creates review-(N+1).md
```

---

## Recovery 4: Approval File Missing

**Detection:** approval.md lost

**Recovery:**
```bash
# Check approval history
ls sprints/SW-XXX/approval-*.md

# If no approvals exist, re-run approval from review-N.md
```

---

## Recovery 5: Status Stuck in Wrong State

**Detection:** Story not transitioning despite meeting criteria

**Recovery:**
```bash
# Manual status correction (last resort)
vim sprints/SW-XXX/story.md
# Update status field manually
# Use atomic write!
```

---

## See also

- [Troubleshooting](16-troubleshooting.md) - Error solutions
- [Implementation Patterns](12-implementation-patterns.md) - Pattern 16: Error Recovery

---

**← Back to [Index](00-index.md)** | **← Previous: [Implementation Patterns](12-implementation-patterns.md)** | **Next → [Extension Points](14-extension-points.md)**
