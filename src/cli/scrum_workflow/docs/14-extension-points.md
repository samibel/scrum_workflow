# Extension Points

**← Back to [Index](00-index.md)** | **← Previous: [Error Recovery](13-error-recovery.md)** | **Next → [Best Practices](15-best-practices.md)**

---

## Adding a New Command

### Step 1: Create command file
```bash
scrum_workflow/commands/my-command.md
```

### Step 2: Follow SKILL.md format
```yaml
---
trigger: /my-command
requires_status: ready
sets_status: in-progress
---

# My Command

Does something useful...
```

### Step 3: Create workflow
```bash
scrum_workflow/workflows/my-workflow.md
```

### Step 4: Reference workflow in command

---

## Adding a New Phase

1. Define phase in state machine
2. Create workflow file
3. Add write boundary rules
4. Update documentation

---

## Custom Rules

Define in story.md Dev Notes:
```yaml
## Custom Rules
- Must use TDD
- Must have 100% test coverage
- Must include performance benchmark
```

---

## Customizing Agents

Edit agent definitions in `scrum_workflow/agents/`:
- `architect.md` - Architecture agent behavior
- `developer.md` - Developer agent behavior
- `qa.md` - QA agent behavior

---

## See also

- [Framework Architecture](08-framework-architecture.md) - System design
- [Implementation Patterns](12-implementation-patterns.md) - Code patterns

---

**← Back to [Index](00-index.md)** | **← Previous: [Error Recovery](13-error-recovery.md)** | **Next → [Best Practices](15-best-practices.md)**
