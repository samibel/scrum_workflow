# Common Anti-Patterns

**← Back to [Index](00-index.md)** | **← Previous: [Checklist](10-checklist.md)** | **Next → [Implementation Patterns](12-implementation-patterns.md)**

---

## ❌ DON'T: Bypass Readiness Check

```python
# Wrong: Try to skip to development
/dev-story SW-XXX  # Will fail if not ready

# Right: Complete refinement first
/refine-ticket SW-XXX  # Then /dev-story
```

---

## ❌ DON'T: Approve Without Reviewing

```bash
# Wrong: Auto-approve story
# Never bypass human gate!

# Right: Review findings first
cat review-1.md  # Then make informed decision
```

---

## ❌ DON'T: Modify plan.md During Dev

```python
# Wrong: Change plan during implementation
vim plan.md  # VIOLATION

# Right: plan.md is read-only during dev
# If changes needed, restart refinement
```

---

## ❌ DON'T: Skip Code Review

```bash
# Wrong: Mark done without review
# This bypasses quality gate

# Right: Always run review
/dev-story SW-XXX review  # Then approve
```

---

## ❌ DON'T: Use Non-Atomic Writes

```bash
# Wrong: Multiple write operations
echo "status: done" >> story.md

# Right: Atomic write (NFR1 compliance)
write_atomic("story.md", content)
```

---

## See also

- [Write Boundary Rules](07-write-boundary-rules.md) - File write restrictions
- [Implementation Patterns](12-implementation-patterns.md) - Correct patterns
- [State Machine](05-state-machine.md) - Status transitions

---

**← Back to [Index](00-index.md)** | **← Previous: [Checklist](10-checklist.md)** | **Next → [Implementation Patterns](12-implementation-patterns.md)**
