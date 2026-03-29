# Troubleshooting

**← Back to [Index](00-index.md)** | **← Previous: [Best Practices](15-best-practices.md)** | **Next → [Appendix](17-appendix.md)**

---

## Common Errors

### "Story must be in 'ready' status"

**Error:**
```
Error: Story SW-XXX is in status 'draft', but '/scrum-dev-story' requires 'ready'
```

**Cause:** Story hasn't passed readiness check

**Fix:** Run `/scrum-refine-ticket SW-XXX` and address failures

---

### "Readiness check failed"

**Error:**
```
Readiness check FAILED for SW-XXX
- Description: incomplete
```

**Cause:** Story doesn't meet 4 readiness criteria

**Fix:** Update story.md with missing information

---

### "Write boundary violation"

**Error:**
```
Error: Write boundary violation - cannot modify 'plan.md'
```

**Cause:** Attempting to write read-only file in current phase

**Fix:** Only write files allowed in current phase

---

## Status Issues

### Story stuck in `refinement`

**Cause:** Readiness check keeps failing

**Solution:** Review failure reasons, update story

### Story stuck in `in-review`

**Cause:** No human approval provided

**Solution:** Review review-N.md, provide approval/rejection

---

## See also

- [Error Recovery](13-error-recovery.md) - Recovery strategies
- [State Machine](05-state-machine.md) - Status transitions

---

**← Back to [Index](00-index.md)** | **← Previous: [Best Practices](15-best-practices.md)** | **Next → [Appendix](17-appendix.md)**
