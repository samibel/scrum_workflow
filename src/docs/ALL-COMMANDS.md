# 🎯 All 20 Scrum Workflow Commands

Complete visual overview of all commands organized by category.

---

## Story Lifecycle (6 Commands)

```mermaid
graph LR
    A["/scrum-create-ticket<br/>SW-XXX 'description'<br/>━━━━━━<br/>Create story<br/>status: draft"]
    
    B["/scrum-refine-ticket<br/>SW-XXX<br/>━━━━━━<br/>Multi-agent refinement<br/>status: refined"]
    
    C["/scrum-refine-story<br/>SW-XXX<br/>━━━━━━<br/>Validate spec<br/>status: ready-for-dev"]
    
    D["/scrum-dev-story<br/>SW-XXX<br/>━━━━━━<br/>Implement code<br/>status: in-progress"]
    
    E["/scrum-dev-story<br/>SW-XXX review<br/>━━━━━━<br/>Submit for review<br/>status: review"]
    
    F["/scrum-review-story<br/>SW-XXX<br/>━━━━━━<br/>Code review<br/>approved/changes-needed"]
    
    G["/scrum-approve<br/>SW-XXX<br/>━━━━━━<br/>Human approval<br/>status: done"]
    
    A --> B --> C --> D --> E --> F --> G
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fce4ec
    style D fill:#e8f5e9
    style E fill:#e8f5e9
    style F fill:#fff3e0
    style G fill:#fff9c4
```

---

## Documentation Commands (2)

```mermaid
graph TD
    A["🎯 /scrum-create-project-context<br/>━━━━━━━━━━━━━━━━━━<br/>Analyze codebase<br/>Generate project context<br/>Create domain-specific skills"]
    
    B["📚 /scrum-create-project-docs<br/>━━━━━━━━━━━━━━━━━<br/>Generate business logic documentation<br/>Auto-document features<br/>Create usage guides"]
    
    C["🏗️ /scrum-create-architecture-docs<br/>━━━━━━━━━━━━━━━━<br/>Generate architecture documentation<br/>Tech stack overview<br/>Design decisions"]
    
    A --> Output1["_scrum-output/context/<br/>project-context.md<br/>domain-skills.md"]
    B --> Output2["_scrum-output/docs/<br/>business-logic.md"]
    C --> Output3["_scrum-output/docs/<br/>architecture.md"]
    
    style A fill:#bbdefb
    style B fill:#bbdefb
    style C fill:#bbdefb
    style Output1 fill:#c8e6c9
    style Output2 fill:#c8e6c9
    style Output3 fill:#c8e6c9
```

---

## Research Commands (2)

```mermaid
graph LR
    A["/scrum-research technical<br/>'topic'<br/>━━━━━━<br/>Web search<br/>Best practices<br/>Implementation patterns"]
    
    B["/scrum-research general<br/>'topic'<br/>━━━━━━<br/>Market analysis<br/>Competitor research<br/>Industry trends"]
    
    C["📄 Research Report<br/>_scrum-output/docs/"]
    
    A --> C
    B --> C
    
    style A fill:#c3e9ff
    style B fill:#c3e9ff
    style C fill:#c8e6c9
```

---

## Status & Validation Commands (3)

```mermaid
graph TD
    A["/scrum-sprint-status<br/>[SW-XXX]<br/>━━━━━━<br/>Show sprint progress<br/>Stories completed/pending<br/>Sprint metrics"]
    
    B["/scrum-delivery-health<br/>━━━━━━<br/>Overall delivery health<br/>Team velocity<br/>Risk assessment"]
    
    C["/scrum-policy-check<br/>SW-XXX<br/>━━━━━━<br/>GDPR, Security, Compliance<br/>Industry standards<br/>Best practices"]
    
    Output["📊 Status Report<br/>📋 Compliance Report<br/>⚠️ Risk Alert"]
    
    A --> Output
    B --> Output
    C --> Output
    
    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#fff9c4
    style Output fill:#c8e6c9
```

---

## Audit & Session Commands (2)

```mermaid
graph LR
    A["/scrum-audit-trail<br/>━━━━━━<br/>Show complete audit trail<br/>All decisions recorded<br/>WHO, WHAT, WHEN, WHY"]
    
    B["/scrum-wrap-up<br/>━━━━━━<br/>Session summary<br/>Work completed<br/>Next steps"]
    
    Output["📝 Audit Log<br/>📋 Session Summary"]
    
    A --> Output
    B --> Output
    
    style A fill:#f8bbd0
    style B fill:#f8bbd0
    style Output fill:#c8e6c9
```

---

## Installation & Maintenance (4)

```mermaid
graph TD
    A["create-scrum-workflow install<br/>━━━━━━━━━━━━━━━━<br/>Interactive installation<br/>Detect platform<br/>Install 20 commands"]
    
    B["create-scrum-workflow install -y<br/>━━━━━━━━━━━━━━<br/>Non-interactive<br/>Default answers"]
    
    C["create-scrum-workflow install<br/>--dry-run<br/>━━━━━━━━━━<br/>Preview only<br/>No changes"]
    
    D["create-scrum-workflow update<br/>━━━━━━━━━━━<br/>Update framework<br/>Keep customizations<br/>Preserve settings"]
    
    E["create-scrum-workflow status<br/>━━━━━━━━━━<br/>Check integrity<br/>File status<br/>Unchanged/Modified/Missing"]
    
    F["create-scrum-workflow validate<br/>━━━━━━━━━━━<br/>Full verification<br/>6-point checklist<br/>Installation OK?"]
    
    A --> Output1["✅ 20 commands installed"]
    B --> Output1
    C --> Output1
    D --> Output2["✅ Framework updated"]
    E --> Output3["📊 Status report"]
    F --> Output4["✅ Validation results"]
    
    style A fill:#b2dfdb
    style B fill:#b2dfdb
    style C fill:#b2dfdb
    style D fill:#b2dfdb
    style E fill:#b2dfdb
    style F fill:#b2dfdb
    style Output1 fill:#c8e6c9
    style Output2 fill:#c8e6c9
    style Output3 fill:#c8e6c9
    style Output4 fill:#c8e6c9
```

---

## All 20 Commands Summary

```mermaid
graph TB
    subgraph Lifecycle["📋 Story Lifecycle (6)"]
        L1["/scrum-create-ticket"]
        L2["/scrum-refine-ticket"]
        L3["/scrum-refine-story"]
        L4["/scrum-dev-story"]
        L5["/scrum-review-story"]
        L6["/scrum-approve"]
    end
    
    subgraph Documentation["📚 Documentation (2)"]
        D1["/scrum-create-project-context"]
        D2["/scrum-create-project-docs"]
        D3["/scrum-create-architecture-docs"]
    end
    
    subgraph Research["🔍 Research (2)"]
        R1["/scrum-research technical"]
        R2["/scrum-research general"]
    end
    
    subgraph Status["📊 Status & Validation (3)"]
        S1["/scrum-sprint-status"]
        S2["/scrum-delivery-health"]
        S3["/scrum-policy-check"]
    end
    
    subgraph Audit["📝 Audit (2)"]
        A1["/scrum-audit-trail"]
        A2["/scrum-wrap-up"]
    end
    
    subgraph Install["⚙️ Installation (4)"]
        I1["create-scrum-workflow install"]
        I2["create-scrum-workflow update"]
        I3["create-scrum-workflow status"]
        I4["create-scrum-workflow validate"]
    end
    
    subgraph Other["🔧 Other (1)"]
        O1["/scrum-session-start"]
    end
    
    style L1 fill:#e3f2fd
    style L2 fill:#f3e5f5
    style L3 fill:#fce4ec
    style L4 fill:#e8f5e9
    style L5 fill:#fff3e0
    style L6 fill:#fff9c4
    
    style D1 fill:#bbdefb
    style D2 fill:#bbdefb
    style D3 fill:#bbdefb
    
    style R1 fill:#c3e9ff
    style R2 fill:#c3e9ff
    
    style S1 fill:#fff9c4
    style S2 fill:#fff9c4
    style S3 fill:#fff9c4
    
    style A1 fill:#f8bbd0
    style A2 fill:#f8bbd0
    
    style I1 fill:#b2dfdb
    style I2 fill:#b2dfdb
    style I3 fill:#b2dfdb
    style I4 fill:#b2dfdb
    
    style O1 fill:#d1c4e9
```

---

## Quick Reference: Command Categories

| Category | Count | Commands |
|----------|-------|----------|
| **Story Lifecycle** | 6 | create, refine, validate, dev, review, approve |
| **Documentation** | 3 | project-context, project-docs, architecture-docs |
| **Research** | 2 | research (technical), research (general) |
| **Status & Validation** | 3 | sprint-status, delivery-health, policy-check |
| **Audit & Session** | 2 | audit-trail, wrap-up |
| **Installation** | 4 | install, update, status, validate |
| **Other** | 1 | session-start |
| **TOTAL** | **20** | All commands |

---

## Command Usage Frequency

```
Most Used (Daily):
  /scrum-dev-story SW-XXX          — Implementation
  /scrum-review-story SW-XXX       — Code review

Regular Use (Per Story):
  /scrum-create-ticket SW-XXX      — Create
  /scrum-refine-ticket SW-XXX      — Refinement
  /scrum-refine-story SW-XXX       — Validation
  /scrum-approve SW-XXX            — Approval

Periodic Use (Weekly/Monthly):
  /scrum-sprint-status             — Status check
  /scrum-delivery-health           — Health check
  /scrum-policy-check              — Compliance
  /scrum-audit-trail               — Audit

One-time Setup:
  create-scrum-workflow install    — Initial setup
  /scrum-create-project-context    — Project init

Maintenance:
  create-scrum-workflow update     — Framework updates
  create-scrum-workflow validate   — Integrity check
```

---

## See Also

- [WORKFLOW-QUICK-REFERENCE.md](./WORKFLOW-QUICK-REFERENCE.md) — Detailed command examples
- [README.md](../../README.md) — Complete command reference
- [GETTING-STARTED.md](./GETTING-STARTED.md) — Workflow walkthrough
- [scrum_workflow/commands/README.md](../../src/core/commands/README.md) — All command definitions

---

**Version:** 1.2.0  
**Last Updated:** 2026-04-09
