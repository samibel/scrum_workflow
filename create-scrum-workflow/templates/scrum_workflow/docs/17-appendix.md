# Appendix

**← Back to [Index](00-index.md)** | **← Previous: [Troubleshooting](16-troubleshooting.md)**

---

## File Format Reference

### Story File (story.md)

```yaml
---
schema_version: 1
ticket: "SW-XXX"
title: "Story Title"
status: "draft|refinement|ready|in-dev|in-review|done"
created: "2026-03-25T10:00:00Z"
updated: "2026-03-25T10:00:00Z"
---
```

### Review File (review-N.md)

```yaml
---
schema_version: 1
ticket: "SW-XXX"
review_date: "2026-03-25"
review_number: "1"
---
```

### Approval File (approval-N.md)

```yaml
---
schema_version: 1
ticket: "SW-XXX"
decision: "APPROVED|REJECTED"
approval_date: "2026-03-25"
---
```

---

## Glossary

| Term | Definition |
|------|------------|
| **Guard Condition** | Precondition before state transition |
| **Write Boundary Rules** | File write restrictions per phase |
| **Atomic Write** | File write that completes entirely or not at all |
| **NFR1** | Non-Functional Requirement 1: Atomic file writes |
| **FR17** | Guard condition before implementation |
| **FR28** | No DONE without human approval |

---

## Related Documentation

- **Epic Specifications:** `_scrum-output/docs/epics.md`
- **Architecture Decisions:** `_scrum-output/docs/architecture.md`
- **Product Requirements:** `_scrum-output/docs/prd.md`
- **Sprint Status:** `_scrum-output/context/sprint-status.yaml`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.1 | 2026-03-25 | Added Installation guide, split into sub-files |
| 3.0 | 2026-03-25 | Extended Implementation Patterns to 16 patterns |
| 2.1 | 2026-03-25 | Added Pattern Summary table |
| 2.0 | 2026-03-25 | Complete Overhaul with examples and patterns |
| 1.0 | 2026-03-25 | Initial workflow documentation |

---

**Document Version:** 3.1 (Split Documentation)
**Last Updated:** 2026-03-25
**Maintained By:** Scrum Workflow Team
**Contributors:** Paige (Tech Writer), Bob (Scrum Master), Winston (Architect)
