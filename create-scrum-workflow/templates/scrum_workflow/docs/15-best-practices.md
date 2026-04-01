# Best Practices

**← Back to [Index](00-index.md)** | **← Previous: [Extension Points](14-extension-points.md)** | **Next → [Troubleshooting](16-troubleshooting.md)**

---

## For Scrum Masters

### Story Preparation
- Ensure epic requirements are clear
- Break down epics into story-sized chunks
- Include acceptance criteria in BDD format

### Quality Gates
- Don't bypass readiness check
- Review refinement.md before approving
- Ensure all tasks have estimates

### Sprint Management
- Keep stories in `ready` status as buffer
- Monitor `in-review` stories for bottlenecks

---

## For Developers

### Following the Workflow
- Always use `/scrum-dev-story` - never bypass guard condition
- Follow red-green-refactor cycle
- Load project context before implementing

### Code Quality
- Write tests first (TDD)
- Follow domain patterns from context files
- Keep write boundary rules in mind

---

## For Code Reviewers

### Review Process
- Use fresh context (new LLM session)
- Review against specification, not preference
- Provide actionable suggested fixes

### Findings Quality
- Reference specific acceptance criteria
- Include severity justification
- Suggest concrete fixes with examples

---

## For Human Approvers

### Before Approving
- Review all Critical findings
- Review Major findings
- Verify Minor findings are noted

### Approval Decision
- Only approve if you've reviewed findings
- Provide rationale for approval
- If rejecting, provide clear reasons

---

**← Back to [Index](00-index.md)** | **← Previous: [Extension Points](14-extension-points.md)** | **Next → [Troubleshooting](16-troubleshooting.md)**
