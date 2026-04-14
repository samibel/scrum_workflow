# Examples

**← Back to [Index](00-index.md)** | **← Previous: [Framework Architecture](08-framework-architecture.md)** | **Next → [Checklist](10-checklist.md)**

---

## Example 1: Complete story.md

```yaml
---
schema_version: 1
ticket: "SW-001"
title: "User Authentication"
status: "ready"
created: "2026-03-25T10:00:00Z"
updated: "2026-03-25T10:00:00Z"
points: 5
priority: high
---

## Story

As a **user**,
I want to **log in with email and password**,
So that **I can access my personalized dashboard**.

## Acceptance Criteria

**Given** a user is on the login page
**When** they enter valid email and password
**Then** they are redirected to their dashboard
**And** a session is established

**Given** a user enters invalid credentials
**When** they submit the login form
**Then** an error message is displayed
**And** they remain on the login page

## Tasks / Subtasks

- [x] Task 1: Design login UI
  - [x] Subtask 1.1: Create login form component
  - [x] Subtask 1.2: Add validation
- [x] Task 2: Implement authentication API
  - [x] Subtask 2.1: POST /auth/login endpoint
  - [x] Subtask 2.2: Password hashing
  - [x] Subtask 2.3: Session management

## Dev Notes

### Architecture Patterns
- Use JWT for session management
- Password hashing with bcrypt
- Rate limiting on login endpoint

### Constraints
- Must comply with OWASP security guidelines
- Session timeout: 24 hours
- Max login attempts: 5 per hour
```

---

## Example 2: Complete review-N.md

```yaml
---
schema_version: 1
ticket: "SW-001"
title: "User Authentication"
review_date: "2026-03-25T15:30:00Z"
review_number: "1"
reviewer: "AI Code Reviewer"
---

# Code Review: User Authentication

## Summary

| Total | Critical | Major | Minor |
|-------|----------|-------|-------|
| 12    | 2        | 7     | 3     |

## Findings

| # | Finding | Severity | AC Reference | Suggested Fix |
|---|---------|----------|--------------|--------------|
| 1 | No rate limiting on login endpoint | Critical | AC 3 | Add rate limiting (5/hour) |
| 2 | JWT secret hardcoded | Critical | Security | Move to env variable |
| 3 | Password not validated | Major | AC 2 | Add complexity validation |
```

---

## Example 3: Complete approval-N.md

```yaml
---
schema_version: 1
ticket: "SW-001"
title: "User Authentication"
approval_date: "2026-03-25T16:45:00Z"
approver: "Sami"
decision: "APPROVED"
review_reference: "review-2.md"
---

# Approval Record for User Authentication

**Decision:** APPROVED

**Rationale:** All Critical findings addressed. Rate limiting implemented, JWT secret properly configured.

## Next Steps

Story marked as DONE. Deployment to staging recommended.
```

---

## File Naming Conventions

### Story Files
```
_scrum-output/sprints/SW-XXX/story.md
```

### Review Files
```
_scrum-output/sprints/SW-XXX/review-1.md    # First review
_scrum-output/sprints/SW-XXX/review-2.md    # Second review (after fixes)
```

### Approval Files
```
_scrum-output/sprints/SW-XXX/approval-1.md  # First approval attempt
_scrum-output/sprints/SW-XXX/approval-2.md  # Second approval (after re-review)
```

---

## Status Field Examples

```yaml
# Draft story
status: draft

# After refinement
status: refinement

# After readiness check PASS
status: ready

# During development
status: in-dev

# After code review
status: in-review

# After human approval
status: done
```

---

## Related Documentation

- [State Machine](05-state-machine.md) - Status transitions
- [Phase Details](06-phase-details.md) - Phase-by-phase guide
- [File Format Reference](17-appendix.md) - Complete schema reference

---

**← Back to [Index](00-index.md)** | **← Previous: [Framework Architecture](08-framework-architecture.md)** | **Next → [Checklist](10-checklist.md)**
