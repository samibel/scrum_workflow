# 🏗️ Scrum Workflow Architecture — Visual Guide

Visuelle Erklärung wie Scrum Workflow intern funktioniert.

---

## System Overview

```mermaid
graph TB
    subgraph Team["🎯 Scrum Team"]
        PO["Product Owner<br/>Writes Stories"]
        Dev["Developer<br/>Implements"]
        SM["Scrum Master<br/>Quality & Blockers"]
    end
    
    subgraph Workflow["⚙️ Workflow Phases"]
        Ph1["<b>1. Create</b><br/>/scrum-create-ticket<br/>status: draft"]
        Ph2["<b>2. Refine</b><br/>/scrum-refine-ticket<br/>status: refined"]
        Ph3["<b>3. Validate</b><br/>/scrum-refine-story<br/>status: ready-dev"]
        Ph4["<b>4. Develop</b><br/>/scrum-dev-story<br/>status: in-progress"]
        Ph5["<b>5. Review</b><br/>/scrum-review-story<br/>status: approved"]
        Ph6["<b>6. Approve</b><br/>/scrum-approve<br/>status: done"]
    end
    
    subgraph AI["🤖 AI Agents"]
        Arch["Architect Agent<br/>Security, Scalability<br/>Architecture risks"]
        D["Developer Agent<br/>Feasibility, Libraries<br/>Implementation"]
        Q["QA Agent<br/>Testability, Edge cases<br/>Acceptance criteria"]
    end
    
    subgraph Output["📁 Generated Artifacts"]
        Story["story.md<br/>Specifications"]
        Plan["plan.md<br/>Execution Plan"]
        Code["💻 Code<br/>Implementation"]
        Review["review-N.md<br/>Code Review"]
        Approval["approval.md<br/>Audit Trail"]
    end
    
    Team --> Workflow
    AI --> Ph2
    AI --> Ph4
    AI --> Ph5
    
    Ph1 --> Ph2
    Ph2 --> Ph3
    Ph3 --> Ph4
    Ph4 --> Ph5
    Ph5 --> Ph6
    
    Ph1 -.-> Story
    Ph2 -.-> Story
    Ph3 -.-> Plan
    Ph4 -.-> Code
    Ph5 -.-> Review
    Ph6 -.-> Approval
    
    style Team fill:#e3f2fd
    style Workflow fill:#fff3e0
    style AI fill:#f3e5f5
    style Output fill:#e8f5e9
    style Ph1 fill:#e3f2fd
    style Ph2 fill:#f3e5f5
    style Ph3 fill:#fce4ec
    style Ph4 fill:#e8f5e9
    style Ph5 fill:#fff3e0
    style Ph6 fill:#fff9c4
```

**Key Features:** Phase isolation • Write boundaries • Human gates • Complete audit trail

---

## Story Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> draft: /scrum-create-ticket
    
    draft --> refinement: /scrum-refine-ticket
    
    refinement --> refined: Agents complete<br/>Cross-talk done<br/>Estimation ready
    
    refined --> refined: /scrum-refine-story<br/>Criteria FAIL<br/>Fix & Retry
    
    refined --> ready-for-dev: /scrum-refine-story<br/>All 5 Criteria PASS
    
    ready-for-dev --> in-progress: /scrum-dev-story<br/>Start implementation
    
    in-progress --> in-progress: Fix code<br/>Run tests
    
    in-progress --> review: /scrum-dev-story review<br/>Ready for code review
    
    review --> approved: /scrum-review-story<br/>No critical issues
    
    review --> changes-needed: /scrum-review-story<br/>Critical/Major issues found
    
    changes-needed --> in-progress: /scrum-dev-story<br/>Fix findings
    
    approved --> done: /scrum-approve<br/>Human sign-off
    
    done --> [*]
    
    note right of draft
        Story created, not yet refined
    end note
    
    note right of refined
        Refinement done, awaiting validation
    end note
    
    note right of ready-for-dev
        Spec validated, OK to implement
    end note
    
    note right of changes-needed
        Code review found issues
        Developer fixes and re-submits
    end note
    
    note right of done
        Human approved, story complete
    end note
```

---

## Phase 1: Multi-Agent Refinement

```mermaid
graph TD
    Input["📝 Story Input<br/>Title + Description"]
    
    Input --> Spawn["🔄 Spawn 3 Agents<br/>Isolated Context"]
    
    Spawn --> Arch["🏗️ Architect Agent"]
    Spawn --> Dev["💻 Developer Agent"]
    Spawn --> QA["🧪 QA Agent"]
    
    Arch -->|"Analysis"| Findings1["Security Issues<br/>Architecture Risks<br/>Scalability Notes"]
    
    Dev -->|"Analysis"| Findings2["Implementation Notes<br/>Library Requirements<br/>Complexity Estimate"]
    
    QA -->|"Analysis"| Findings3["Testability Issues<br/>Edge Cases<br/>Acceptance Clarity"]
    
    Findings1 --> CrossTalk["💬 Cross-Talk Rounds<br/>Up to 3 rounds<br/>Agents discuss findings<br/>Classify as Blocker/Non-Blocker"]
    
    Findings2 --> CrossTalk
    Findings3 --> CrossTalk
    
    CrossTalk --> Consensus["✓ Consensus Reached<br/>All findings merged<br/>Blockers identified"]
    
    Consensus --> Estimation["📊 Wideband Delphi<br/>Each agent votes on story points<br/>Independent estimation<br/>Variance check"]
    
    Estimation --> Review["👤 Human Review<br/>Accept/Reject each perspective<br/>Ask clarifications"]
    
    Review --> Merge["🔀 Merge Accepted<br/>Update story.md<br/>Deduplication<br/>Conflict resolution"]
    
    Merge --> Output["📄 Output<br/>story.md (updated)<br/>refinement.md (audit trail)"]
    
    style Input fill:#e3f2fd
    style Spawn fill:#c8e6c9
    style Arch fill:#f3e5f5
    style Dev fill:#f3e5f5
    style QA fill:#f3e5f5
    style Findings1 fill:#e1bee7
    style Findings2 fill:#e1bee7
    style Findings3 fill:#e1bee7
    style CrossTalk fill:#d1c4e9
    style Consensus fill:#c5cae9
    style Estimation fill:#bbdefb
    style Review fill:#b3e5fc
    style Merge fill:#b2dfdb
    style Output fill:#c8e6c9
```

---

## Phase 2: Immutable Validation

```mermaid
graph TD
    Input["📄 Story.md<br/>status: refined"]
    
    Check1["<b>Criterion 1</b><br/>Acceptance Criteria<br/>━━━━━━<br/>Are all criteria<br/>testable &<br/>unambiguous?"]
    
    Check2["<b>Criterion 2</b><br/>Tasks Defined<br/>━━━━━━<br/>Are all subtasks<br/>specific &<br/>actionable?"]
    
    Check3["<b>Criterion 3</b><br/>Dev Notes<br/>━━━━━━<br/>Is technical<br/>context<br/>sufficient?"]
    
    Check4["<b>Criterion 4</b><br/>No Placeholders<br/>━━━━━━<br/>No TODO, TBD,<br/>FIXME,<br/>{{placeholder}}?"]
    
    Check5["<b>Criterion 5</b><br/>Dependencies<br/>━━━━━━<br/>Are all<br/>dependencies<br/>documented?"]
    
    Input --> Check1
    Input --> Check2
    Input --> Check3
    Input --> Check4
    Input --> Check5
    
    Check1 -->|"PASS"| AllPass["✓ All 5 Pass"]
    Check2 -->|"PASS"| AllPass
    Check3 -->|"PASS"| AllPass
    Check4 -->|"PASS"| AllPass
    Check5 -->|"PASS"| AllPass
    
    Check1 -->|"FAIL"| AnyFail["✗ Any Fail"]
    Check2 -->|"FAIL"| AnyFail
    Check3 -->|"FAIL"| AnyFail
    Check4 -->|"FAIL"| AnyFail
    Check5 -->|"FAIL"| AnyFail
    
    AllPass --> Plan["📋 Generate Plan<br/>Ordered subtasks<br/>Dependencies<br/>Execution order"]
    
    Plan --> Ready["✓ Status: ready-for-dev<br/>Output: plan.md"]
    
    AnyFail --> Fail["✗ Status: refined<br/>Failure reasons documented<br/>Return to author"]
    
    style Check1 fill:#fce4ec
    style Check2 fill:#fce4ec
    style Check3 fill:#fce4ec
    style Check4 fill:#fce4ec
    style Check5 fill:#fce4ec
    style AllPass fill:#c8e6c9
    style AnyFail fill:#ffcdd2
    style Plan fill:#fff9c4
    style Ready fill:#c8e6c9
    style Fail fill:#ffcdd2
```

**Key Point:** Agent can ONLY validate, CANNOT modify story. This ensures the spec is immutable.

---

## Phase 3: Development

```mermaid
graph LR
    Plan["📋 plan.md<br/>Execution plan<br/>Ordered tasks<br/>Dependencies"]
    
    Dev["💻 Dev Agent<br/>━━━━━━━━━━━<br/>Executes plan<br/>NO self-validation<br/>NO self-review<br/>Direct code output"]
    
    Code["📝 Code Files<br/>Implementation<br/>Unit tests<br/>Integration tests"]
    
    TestRun["🧪 Test Execution<br/>All tests pass?<br/>Coverage adequate?"]
    
    Review["📋 Submit for Review<br/>/scrum-dev-story review<br/>Status: review"]
    
    Plan --> Dev
    Dev --> Code
    Code --> TestRun
    TestRun -->|"✓ PASS"| Review
    TestRun -->|"✗ FAIL"| Dev
    
    style Plan fill:#b3e5fc
    style Dev fill:#c8e6c9
    style Code fill:#fff9c4
    style TestRun fill:#ffe0b2
    style Review fill:#f8bbd0
```

**Principle:** Inversion of Control — Agent receives plan and just executes it. No creativity, no second-guessing, no self-review.

---

## Phase 4: Code Review

```mermaid
graph TD
    Code["💻 Code + Tests<br/>Implementation<br/>Unit tests"]
    
    Reviewer["🔍 Review Agent<br/>(Different from Dev)<br/>Fresh perspective<br/>Automated review"]
    
    Reviewer -->|"Check"| Spec["✓ Specification<br/>Alignment<br/>Code matches spec<br/>No extra/missing"]
    
    Reviewer -->|"Check"| AC["✓ Acceptance<br/>Criteria<br/>All AC met<br/>by code"]
    
    Reviewer -->|"Check"| Tests["✓ Test Coverage<br/>Adequate tests<br/>for changes"]
    
    Reviewer -->|"Check"| Standards["✓ Code Standards<br/>Follows project<br/>conventions"]
    
    Reviewer -->|"Check"| Arch["✓ Architecture<br/>Compliance<br/>Matches dev notes"]
    
    Spec --> Findings["📋 Review Findings<br/>Each finding:<br/>• Severity<br/>• Description<br/>• Suggested fix"]
    
    AC --> Findings
    Tests --> Findings
    Standards --> Findings
    Arch --> Findings
    
    Findings --> Decision{"Critical or Major<br/>Issues?"}
    
    Decision -->|"NO"| Approved["✓ APPROVED<br/>Status: approved<br/>Ready for human gate"]
    
    Decision -->|"YES"| Changes["✗ CHANGES-NEEDED<br/>Status: changes-needed<br/>Return to dev"]
    
    Code --> Reviewer
    
    style Code fill:#fff9c4
    style Reviewer fill:#ffe0b2
    style Spec fill:#f8bbd0
    style AC fill:#f8bbd0
    style Tests fill:#f8bbd0
    style Standards fill:#f8bbd0
    style Arch fill:#f8bbd0
    style Findings fill:#f48fb1
    style Approved fill:#c8e6c9
    style Changes fill:#ffcdd2
```

---

## Phase 5: Human Approval

```mermaid
graph LR
    Approved["✓ APPROVED<br/>Status: approved"]
    
    HumanGate["👤 Human Review<br/>━━━━━━━━━━<br/>Tech Lead / PM<br/>Final decision"]
    
    HumanGate -->|"APPROVE"| Decision1["✓ Rationale<br/>Timestamp<br/>Signature"]
    
    HumanGate -->|"REJECT"| Decision2["✗ Reason<br/>Timestamp<br/>Signature"]
    
    Decision1 --> Approval["📄 approval.md<br/>Complete audit trail<br/>WHO, WHAT, WHEN, WHY"]
    
    Decision2 --> Approval
    
    Approval -->|"APPROVED"| Done["✓ Status: done<br/>🎉 Story shipped<br/>Audit trail complete"]
    
    Approved --> HumanGate
    
    style Approved fill:#b3e5fc
    style HumanGate fill:#fff9c4
    style Decision1 fill:#c8e6c9
    style Decision2 fill:#ffcdd2
    style Approval fill:#e1bee7
    style Done fill:#c8e6c9
```

**Critical Point:** No AI can mark a story as DONE. Only humans can approve. This is the ultimate safeguard.

---

## File Write Boundaries

```mermaid
graph LR
    CT["<b>/scrum-<br/>create-ticket</b>"]
    RT["<b>/scrum-<br/>refine-ticket</b>"]
    RS["<b>/scrum-<br/>refine-story</b>"]
    DS["<b>/scrum-<br/>dev-story</b>"]
    RV["<b>/scrum-<br/>review-story</b>"]
    AP["<b>Human<br/>Approval</b>"]
    
    CT -->|"✓ story.md"| S["📄 story.md"]
    
    RT -->|"✓ refinement.md"| R["📄 refinement.md"]
    RT -->|"✓ story.md<br/>update"| S
    RT -->|"✗ plan.md<br/>FORBIDDEN"| P["📄 plan.md"]
    
    RS -->|"✓ plan.md"| P
    RS -->|"✓ story.md<br/>status only"| S
    RS -->|"✗ refinement.md<br/>FORBIDDEN"| R
    
    DS -->|"✓ Code files<br/>Tests"| C["📝 Code<br/>📝 Tests"]
    DS -->|"✓ story.md<br/>status only"| S
    DS -->|"✗ plan.md<br/>FORBIDDEN"| P
    
    RV -->|"✓ review-N.md"| RW["📄 review-N.md"]
    RV -->|"✓ story.md<br/>status only"| S
    RV -->|"✗ Code files<br/>FORBIDDEN"| C
    
    AP -->|"✓ approval.md"| APP["📄 approval.md"]
    AP -->|"✓ story.md<br/>status only"| S
    AP -->|"✗ Everything else<br/>FORBIDDEN"| FB["❌ Restricted"]
    
    style CT fill:#e3f2fd
    style RT fill:#f3e5f5
    style RS fill:#fce4ec
    style DS fill:#e8f5e9
    style RV fill:#fff3e0
    style AP fill:#fff9c4
    
    style S fill:#c8e6c9
    style R fill:#c8e6c9
    style P fill:#c8e6c9
    style C fill:#c8e6c9
    style RW fill:#c8e6c9
    style APP fill:#c8e6c9
    style FB fill:#ffcdd2
```

**Purpose:** Phase isolation. Each command can ONLY modify its own files, preventing interference between phases.

---

## Data Flow: From Story to Shipped

```mermaid
graph LR
    A["📝 Story<br/>Input"] -->|"Refined"| B["📄 story.md<br/>status: refined"]
    
    B -->|"Validated"| C["📋 plan.md<br/>Execution plan"]
    
    C -->|"Implemented"| D["💻 Code Files<br/>+ Tests"]
    
    D -->|"Reviewed"| E["📄 review-N.md<br/>Findings"]
    
    E -->|"Approved by Human"| F["✓ Done<br/>📄 approval.md"]
    
    A -.->|"refinement.md"| G["📁 Audit Trail"]
    B -.->|"story.md history"| G
    C -.->|"plan.md"| G
    E -.->|"review findings"| G
    F -.->|"approval record"| G
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fce4ec
    style D fill:#e8f5e9
    style E fill:#fff3e0
    style F fill:#fff9c4
    style G fill:#f8bbd0
```

**Complete Traceability:** Every step is recorded, making the workflow auditable and compliant.

---

## Multi-Platform Support

```mermaid
graph TB
    User["👤 User"]
    
    User -->|"Creates story with"| Platform["AI Platform"]
    
    Platform -->|"Claude Code"| CC["✓ .claude/skills/"]
    Platform -->|"Cursor"| Cursor["✓ .cursor/skills/<br/>fallback: .claude/"]
    Platform -->|"Windsurf"| WS["✓ .windsurf/skills/<br/>fallback: .claude/"]
    Platform -->|"Copilot"| GH["✓ .github/skills/"]
    Platform -->|"Cline"| Cline["✓ .cline/skills/<br/>fallback: .claude/"]
    Platform -->|"Universal"| Univ["✓ .agents/skills/"]
    
    CC --> Install["📦 Installer"]
    Cursor --> Install
    WS --> Install
    GH --> Install
    Cline --> Install
    Univ --> Install
    
    Install -->|"generates shims"| Shims["Skill Shims<br/>Platform-specific"]
    
    Shims --> Framework["⚙️ Framework<br/>Unified for all"]
    
    Framework -->|"Executes same workflow<br/>on all platforms"| Output["📁 Output<br/>Unified artifacts"]
    
    style User fill:#e3f2fd
    style Platform fill:#c8e6c9
    style CC fill:#b3e5fc
    style Cursor fill:#b3e5fc
    style WS fill:#b3e5fc
    style GH fill:#b3e5fc
    style Cline fill:#b3e5fc
    style Univ fill:#b3e5fc
    style Install fill:#fff9c4
    style Shims fill:#ffe0b2
    style Framework fill:#f8bbd0
    style Output fill:#c8e6c9
```

**Platform Independence:** Install once, run on any AI platform. No lock-in.

---

## Performance & Resource Usage

```mermaid
xychart-beta
    title "Token Usage by Phase"
    x-axis [Create, Refine, Validate, Develop, Review, Approve]
    y-axis "Tokens (estimated)" 0 --> 10000
    line [100, 5000, 1000, 8000, 2000, 200]
    
    note "Phase 1 (Refine) uses most tokens<br/>Phase 3 (Develop) variable based on story size<br/>Phases 2,4,6 are lightweight"
```

**Resource Distribution:**
- **Create:** ~100 tokens (trivial)
- **Refine:** ~5,000 tokens (3 agents analyzing)
- **Validate:** ~1,000 tokens (rule checking)
- **Develop:** ~8,000 tokens (code implementation, variable)
- **Review:** ~2,000 tokens (separate agent reviewing)
- **Approve:** ~200 tokens (human decision, trivial)

**Total per story:** ~16,300 tokens (typical)

---

## Extension Points

```mermaid
graph TD
    Framework["⚙️ Framework Core"]
    
    Framework -->|"Extend"| Skills["🎯 Custom Skills<br/>scrum_workflow/skills/"]
    Framework -->|"Extend"| Agents["🤖 Custom Agents<br/>scrum_workflow/agents/"]
    Framework -->|"Extend"| Templates["📋 Custom Templates<br/>scrum_workflow/templates/"]
    Framework -->|"Extend"| Context["📚 Custom Context<br/>scrum_workflow/context/"]
    Framework -->|"Extend"| Commands["⚡ Custom Commands<br/>scrum_workflow/commands/"]
    
    Skills -->|"Add domain-specific logic"| Example1["feedback-collection/<br/>synthesis/<br/>readiness-check/"]
    
    Agents -->|"Add specialist perspectives"| Example2["architect.md<br/>developer.md<br/>qa.md"]
    
    Templates -->|"Customize output format"| Example3["story.md<br/>plan.md<br/>approval.md"]
    
    Context -->|"Add domain guidelines"| Example4["standards.md<br/>architecture-guidelines.md<br/>your-domain.md"]
    
    Commands -->|"Add workflow steps"| Example5["20 existing<br/>+ your custom"]
    
    style Framework fill:#fff9c4
    style Skills fill:#b3e5fc
    style Agents fill:#b3e5fc
    style Templates fill:#b3e5fc
    style Context fill:#b3e5fc
    style Commands fill:#b3e5fc
```

---

## Next Steps

- 📖 Read [GETTING-STARTED.md](./GETTING-STARTED.md) for practical walkthrough
- 🎯 Read [BENEFITS.md](./BENEFITS.md) for why this works
- 📚 Read [README.md](./README.md) for complete reference
- 🏗️ Read [docs/architecture-framework.md](./docs/architecture-framework.md) for deep dive

---

**Version:** 1.2.0  
**Last Updated:** 2026-04-09
