# ⚡ Workflow Quick Reference

Visual quick reference for all 20 Scrum Workflow commands.

---

## Story Lifecycle Commands

### Phase 1️⃣: Create Story

```mermaid
graph LR
    CMD["<b>/scrum-create-ticket</b><br/>SW-XXX 'Description'"]
    
    ACTION["Creates story.md<br/>with YAML frontmatter<br/>and acceptance criteria"]
    
    OUTPUT["📄 _scrum-output/<br/>sprints/SW-XXX/<br/>story.md<br/><br/>status: draft"]
    
    CMD --> ACTION --> OUTPUT
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-create-ticket SW-001 "Add OAuth2 login with Google and GitHub"
```

---

### Phase 2️⃣: Refine Story

```mermaid
graph TD
    CMD["<b>/scrum-refine-ticket</b><br/>SW-XXX"]
    
    AGENTS["3 Agents Analyze<br/>━━━━━━<br/>🏗️ Architect<br/>💻 Developer<br/>🧪 QA"]
    
    CROSSTALK["💬 Cross-Talk<br/>━━━━━━<br/>Up to 3 rounds<br/>Debate & Consensus"]
    
    ESTIMATION["📊 Estimation<br/>━━━━━━<br/>Independent votes<br/>Variance check"]
    
    REVIEW["👤 Human Review<br/>━━━━━━<br/>Accept/Reject<br/>Each perspective"]
    
    MERGE["🔀 Merge Results<br/>━━━━━━<br/>Update story<br/>Audit trail"]
    
    OUTPUT["📄 Output:<br/>story.md (updated)<br/>refinement.md<br/><br/>status: refined"]
    
    CMD --> AGENTS
    AGENTS --> CROSSTALK
    CROSSTALK --> ESTIMATION
    ESTIMATION --> REVIEW
    REVIEW --> MERGE
    MERGE --> OUTPUT
    
    style CMD fill:#e3f2fd
    style AGENTS fill:#f3e5f5
    style CROSSTALK fill:#d1c4e9
    style ESTIMATION fill:#c5cae9
    style REVIEW fill:#b3e5fc
    style MERGE fill:#b2dfdb
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-refine-ticket SW-001
```

**What gets generated:**
- `story.md` — Updated with findings
- `refinement.md` — Full audit trail (findings from all agents)

---

### Phase 2b️⃣: Validate Story

```mermaid
graph TD
    CMD["<b>/scrum-refine-story</b><br/>SW-XXX"]
    
    CHECKS["✓ 5-Criterion Validation<br/>━━━━━━━━━━<br/>1. Acceptance Criteria testable?<br/>2. Tasks defined & actionable?<br/>3. Dev notes sufficient?<br/>4. No placeholders?<br/>5. Dependencies documented?"]
    
    DECISION{All 5<br/>Pass?}
    
    PASS["✓ PASS<br/>━━━━━<br/>Generate plan.md<br/>Status: ready-for-dev"]
    
    FAIL["✗ FAIL<br/>━━━━━<br/>Log failure reasons<br/>Status: stays refined<br/>Author fixes & retries"]
    
    CMD --> CHECKS
    CHECKS --> DECISION
    DECISION -->|"YES"| PASS
    DECISION -->|"NO"| FAIL
    
    style CMD fill:#e3f2fd
    style CHECKS fill:#fce4ec
    style PASS fill:#c8e6c9
    style FAIL fill:#ffcdd2
```

**Example:**
```bash
/scrum-refine-story SW-001
```

**What gets generated (on PASS):**
- `plan.md` — Execution plan with ordered tasks
- `story.md` — Status updated to `ready-for-dev`

---

### Phase 3️⃣: Develop Story

```mermaid
graph TD
    CMD["<b>/scrum-dev-story</b><br/>SW-XXX"]
    
    ACTION["Dev Agent<br/>━━━━━━<br/>Follows plan.md<br/>NO self-review<br/>Direct code output"]
    
    OUTPUT1["💻 Code Files<br/>📝 Tests<br/>Output to project"]
    
    SUBMIT["<b>/scrum-dev-story</b><br/>SW-XXX review<br/>━━━━━━<br/>Submit for review"]
    
    OUTPUT2["story.md<br/>status: review"]
    
    CMD --> ACTION
    ACTION --> OUTPUT1
    OUTPUT1 --> SUBMIT
    SUBMIT --> OUTPUT2
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT1 fill:#fff9c4
    style SUBMIT fill:#e3f2fd
    style OUTPUT2 fill:#fff9c4
```

**Example:**
```bash
# Start development
/scrum-dev-story SW-001

# ... tests pass locally ...

# Submit for review
/scrum-dev-story SW-001 review
```

---

### Phase 4️⃣: Review Story

```mermaid
graph TD
    CMD["<b>/scrum-review-story</b><br/>SW-XXX"]
    
    REVIEWER["Review Agent<br/>━━━━━━<br/>Different from dev<br/>Fresh perspective"]
    
    CHECKS["✓ 5 Review Criteria<br/>━━━━━━━━━━<br/>1. Spec alignment?<br/>2. Acceptance met?<br/>3. Test coverage?<br/>4. Code standards?<br/>5. Architecture?"]
    
    FINDINGS["📋 Findings<br/>━━━━━━<br/>Severity assigned<br/>Suggested fixes"]
    
    DECISION{Critical or<br/>Major?}
    
    APPROVED["✓ APPROVED<br/>━━━━━━<br/>status: approved<br/>Ready for human gate"]
    
    CHANGES["✗ CHANGES-NEEDED<br/>━━━━━━<br/>status: changes-needed<br/>Developer re-implements"]
    
    CMD --> REVIEWER
    REVIEWER --> CHECKS
    CHECKS --> FINDINGS
    FINDINGS --> DECISION
    DECISION -->|"NO"| APPROVED
    DECISION -->|"YES"| CHANGES
    
    style CMD fill:#e3f2fd
    style REVIEWER fill:#ffe0b2
    style CHECKS fill:#f8bbd0
    style FINDINGS fill:#f48fb1
    style APPROVED fill:#c8e6c9
    style CHANGES fill:#ffcdd2
```

**Example:**
```bash
/scrum-review-story SW-001
```

**What gets generated:**
- `review-1.md` — Review findings with severity
- `story.md` — Status updated to `approved` or `changes-needed`

---

### Phase 5️⃣: Human Approval

```mermaid
graph TD
    CMD["<b>/scrum-approve</b><br/>SW-XXX"]
    
    GATE["👤 Human Gate<br/>━━━━━━<br/>Tech Lead / PM<br/>Final decision"]
    
    DECISION{APPROVE or<br/>REJECT?}
    
    APPROVE["✓ APPROVE<br/>━━━━━━<br/>Rationale<br/>Timestamp<br/>Signature"]
    
    REJECT["✗ REJECT<br/>━━━━━━<br/>Reason<br/>Timestamp<br/>Signature"]
    
    OUTPUT["📄 approval.md<br/>Audit trail<br/><br/>status: done<br/>🎉 SHIPPED"]
    
    CMD --> GATE
    GATE --> DECISION
    DECISION -->|"YES"| APPROVE
    DECISION -->|"NO"| REJECT
    APPROVE --> OUTPUT
    REJECT --> OUTPUT
    
    style CMD fill:#e3f2fd
    style GATE fill:#fff9c4
    style APPROVE fill:#c8e6c9
    style REJECT fill:#ffcdd2
    style OUTPUT fill:#c8e6c9
```

**Example:**
```bash
/scrum-approve SW-001
```

**What gets generated:**
- `approval.md` — Human approval record with full audit trail
- `story.md` — Status updated to `done`

---

## Documentation Commands

### Generate Project Context

```mermaid
graph LR
    CMD["<b>/scrum-create-project-context</b>"]
    
    SCAN["Analyze your codebase<br/>Language, Framework, Size"]
    
    OUTPUT["📄 _scrum-output/context/<br/>project-context.md<br/>domain-skills.md<br/>architecture.md"]
    
    CMD --> SCAN --> OUTPUT
    
    style CMD fill:#e3f2fd
    style SCAN fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-create-project-context
```

---

### Generate Documentation

```mermaid
graph LR
    CMD1["<b>/scrum-create-project-docs</b>"]
    CMD2["<b>/scrum-create-architecture-docs</b>"]
    
    OUTPUT1["📄 Business Logic<br/>documentation"]
    OUTPUT2["📄 Architecture<br/>documentation"]
    
    CMD1 --> OUTPUT1
    CMD2 --> OUTPUT2
    
    style CMD1 fill:#e3f2fd
    style CMD2 fill:#e3f2fd
    style OUTPUT1 fill:#fff9c4
    style OUTPUT2 fill:#fff9c4
```

**Examples:**
```bash
/scrum-create-project-docs
/scrum-create-architecture-docs
```

---

## Research Commands

### Technical Research

```mermaid
graph LR
    CMD["<b>/scrum-research technical</b><br/>'topic'"]
    
    ACTION["Web search + Analysis<br/>Current best practices<br/>Implementation patterns"]
    
    OUTPUT["📄 Research Report<br/>_scrum-output/docs/"]
    
    CMD --> ACTION --> OUTPUT
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-research technical "Redis performance tuning for caching"
```

---

### Business Research

```mermaid
graph LR
    CMD["<b>/scrum-research general</b><br/>'topic'"]
    
    ACTION["Market analysis<br/>Competitor research<br/>Industry trends"]
    
    OUTPUT["📄 Research Report<br/>_scrum-output/docs/"]
    
    CMD --> ACTION --> OUTPUT
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-research general "payment processing trends in Europe"
```

---

## Validation Commands

### Sprint Status

```mermaid
graph LR
    CMD["<b>/scrum-sprint-status</b><br/>[SW-XXX]"]
    
    ACTION["Summarize sprint<br/>Stories completed<br/>Stories pending"]
    
    OUTPUT["📊 Sprint status<br/>report"]
    
    CMD --> ACTION --> OUTPUT
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-sprint-status SW-001
```

---

### Policy Check

```mermaid
graph LR
    CMD["<b>/scrum-policy-check</b><br/>SW-XXX"]
    
    ACTION["Check compliance<br/>GDPR, Security,<br/>Industry standards"]
    
    OUTPUT["📋 Policy<br/>compliance report"]
    
    CMD --> ACTION --> OUTPUT
    
    style CMD fill:#e3f2fd
    style ACTION fill:#c8e6c9
    style OUTPUT fill:#fff9c4
```

**Example:**
```bash
/scrum-policy-check SW-001
```

---

## Installer Commands

```mermaid
graph TD
    A["<b>create-scrum-workflow install</b>"]
    B["<b>-y</b> Non-interactive"]
    C["<b>--dry-run</b> Preview only"]
    
    D["<b>create-scrum-workflow update</b>"]
    E["<b>--dry-run</b> Preview changes"]
    
    F["<b>create-scrum-workflow status</b>"]
    G["Check integrity"]
    
    H["<b>create-scrum-workflow validate</b>"]
    I["Full verification"]
    
    A -->|"Option"| B
    A -->|"Option"| C
    D -->|"Option"| E
    F --> G
    H --> I
    
    style A fill:#e3f2fd
    style D fill:#e3f2fd
    style F fill:#e3f2fd
    style H fill:#e3f2fd
    style B fill:#c8e6c9
    style C fill:#c8e6c9
    style E fill:#c8e6c9
    style G fill:#fff9c4
    style I fill:#fff9c4
```

**Examples:**
```bash
# Interactive installation
create-scrum-workflow install

# Non-interactive
create-scrum-workflow install -y

# Preview
create-scrum-workflow install --dry-run

# Update framework
create-scrum-workflow update

# Check status
create-scrum-workflow status

# Validate installation
create-scrum-workflow validate
```

---

## All 20 Commands Summary

```mermaid
graph TB
    subgraph Lifecycle["📋 Story Lifecycle (6)"]
        A["Create"]
        B["Refine"]
        C["Validate"]
        D["Develop"]
        E["Review"]
        F["Approve"]
    end
    
    subgraph Docs["📚 Documentation (2)"]
        G["Project Context"]
        H["Architecture Docs"]
    end
    
    subgraph Research["🔍 Research (2)"]
        I["Technical"]
        J["Business"]
    end
    
    subgraph Status["📊 Status & Validation (3)"]
        K["Sprint Status"]
        L["Delivery Health"]
        M["Policy Check"]
    end
    
    subgraph Audit["📝 Audit (2)"]
        N["Audit Trail"]
        O["Session Summary"]
    end
    
    subgraph Install["⚙️ Installation (4)"]
        P["Install"]
        Q["Update"]
        R["Status"]
        S["Validate"]
    end
    
    subgraph Other["🔧 Other (1)"]
        T["Wrap-up"]
    end
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fce4ec
    style D fill:#e8f5e9
    style E fill:#fff3e0
    style F fill:#fff9c4
    
    style G fill:#c8e6c9
    style H fill:#c8e6c9
    
    style I fill:#b3e5fc
    style J fill:#b3e5fc
    
    style K fill:#ffe0b2
    style L fill:#ffe0b2
    style M fill:#ffe0b2
    
    style N fill:#f8bbd0
    style O fill:#f8bbd0
    
    style P fill:#b2dfdb
    style Q fill:#b2dfdb
    style R fill:#b2dfdb
    style S fill:#b2dfdb
    
    style T fill:#d1c4e9
```

**Total: 20 Commands**
- 6 Story Lifecycle (required in order)
- 2 Documentation Generation
- 2 Research
- 3 Status & Validation
- 2 Audit
- 4 Installation
- 1 Wrap-up

---

## Command Cheatsheet

| Command | Phase | Status In | Status Out |
|---------|-------|-----------|------------|
| `/scrum-create-ticket` | 1 | — | `draft` |
| `/scrum-refine-ticket` | 2 | `draft` | `refined` |
| `/scrum-refine-story` | 2b | `refined` | `ready-for-dev` \|  `refined` |
| `/scrum-dev-story` | 3 | `ready-for-dev` | `in-progress` |
| `/scrum-dev-story review` | 3b | `in-progress` | `review` |
| `/scrum-review-story` | 4 | `review` | `approved` \| `changes-needed` |
| `/scrum-approve` | 5 | `approved` | `done` |

---

## Typical Story Timeline

```mermaid
gantt
    title "Typical Story (13 story points)"
    dateFormat YYYY-MM-DD HH:mm
    
    Create :create, 2026-04-09 09:00, 5m
    Refine :refine, after create, 5m
    Validate :validate, after refine, 2m
    Develop :develop, after validate, 1h 30m
    Review :review, after develop, 5m
    Approve :approve, after review, 2m
    
    section Legend
    Phase 1-2b :phase1, 0m, 12m
    Phase 3 :phase3, 0m, 90m
    Phase 4-5 :phase4, 0m, 7m
```

**Total time from story creation to shipped: ~30-60 minutes** (typical)

---

## Next Steps

1. **Quick Reference:** Save this page (Cmd+D)
2. **Deep Dive:** [GETTING-STARTED.md](./GETTING-STARTED.md) for step-by-step walkthrough
3. **Full Details:** [README.md](../../README.md) for complete reference
4. **Architecture:** [ARCHITECTURE-VISUAL.md](./ARCHITECTURE-VISUAL.md) for system design

---

**Version:** 1.2.0  
**Last Updated:** 2026-04-09
