---
stepsCompleted:
  - 'step-01-init'
  - 'step-02-discovery'
  - 'step-02b-vision'
  - 'step-02c-executive-summary'
  - 'step-03-success'
  - 'step-04-journeys'
  - 'step-05-domain'
  - 'step-06-innovation'
  - 'step-07-project-type'
  - 'step-08-scoping'
  - 'step-09-functional'
  - 'step-10-nonfunctional'
  - 'step-11-polish'
  - 'step-12-complete'
inputDocuments:
  - 'user-provided-workflow-specification'
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: developer_tool
  domain: general
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - scrum_workflow

**Author:** Sami
**Date:** 2026-03-24

## Glossary

| Term | Definition |
|---|---|
| **Agent Perspective** | Output from a single AI agent role (Architect, Dev, QA) analyzing a story during refinement |
| **Refinement** | Parallel multi-agent analysis of a story, producing perspectives on risks, dependencies, acceptance criteria, and feasibility |
| **Story File** | The formal specification for a ticket — a Markdown file with YAML frontmatter containing description, estimation, acceptance criteria, and subtasks |
| **Sprint Folder** | Directory structure (`sprints/SW-XXX/`) containing all artifacts for a single ticket |
| **Readiness Check** | Plan-then-execute gate that validates story completeness before implementation begins |
| **Reflection Loop** | Dev → Review → Fix cycle that repeats until findings = 0 or max iterations reached (Phase 2) |
| **Follow-up Ticket** | Auto-generated ticket when a reflection loop exhausts max iterations, containing failure context from the original ticket (Phase 2) |
| **Failure Context** | Structured documentation of what was attempted, findings per iteration, and why the approach failed — stored in follow-up tickets |
| **Guided Mode** | System behavior when user input is too vague — asks clarifying questions instead of generating a low-quality story |
| **Approval Gate** | Human-in-the-loop checkpoint where the user explicitly signs off before a story is marked DONE |
| **Platform Abstraction Layer** | Documented interface contracts that decouple the workflow from the underlying AI coding tool (GitHub Copilot, Windsurf, OpenCode) |
| **Context Window Budget** | Maximum token capacity of the target platform, tracked in config to prevent agent output from exceeding limits |

## Executive Summary

Scrum Workflow is an agentic Scrum team simulator that replaces manual Scrum ceremonies with AI-driven, multi-agent collaboration. Instead of a single code assistant responding to prompts, it provides a complete virtual Scrum team — Architect, Developer, QA Engineer (MVP), with UX Designer added in Phase 2 — that collaborates on every ticket from ideation through deployment approval.

The system follows a spec-first philosophy: no code is written before a specification passes readiness checks. Users describe an idea in natural language; the agent team handles context gathering, refinement, planning, implementation, and review autonomously. Zero prompt-engineering required — the system knows what context it needs, just like an experienced Scrum Master.

The workflow is platform-agnostic by design. MVP targets GitHub Copilot, expanding to Windsurf and OpenCode in later phases. The team stays the same; only the underlying platform changes.

## What Makes This Special

- **Team, not tool** — A full agile agent team where Architect warns about risks, Dev flags dependencies, and QA defines testable acceptance criteria — all in parallel, like a real refinement session.
- **Zero prompt-engineering** — The system autonomously gathers the context it needs. Users bring ideas, not carefully crafted prompts.
- **Spec-first discipline** — Every story is a formal specification. No implementation begins until the plan is fixed and passes a readiness check.
- **Platform-dynamic** — Companies restrict which AI tools are allowed. This workflow decouples the Scrum process from the platform, so teams keep their process regardless of tool constraints.
- **Bounded automation** — A reflection loop (Dev → Review → Fix) with human-in-the-loop approval gates ensures no story ships without explicit sign-off.

## Project Classification

- **Project Type:** Developer Tool — CLI/IDE-integrated workflow automation
- **Domain:** Software Engineering Process Automation
- **Complexity:** Medium — Multi-agent coordination and workflow orchestration without regulatory constraints
- **Project Context:** Greenfield — New product built from scratch

## Success Criteria

### User Success

- Refinement returns **context-aware questions** — not generic, showing agents understood the problem
- Each agent's perspective is **visibly distinct** — user sees what Architect said vs. QA said
- Story output is **simple and structured**: description, estimation, clean subtasks
- Execution plan is **transparent** — clean plan visible before any code
- **Onboarding: A new developer completes their first full workflow (create → refine → plan → dev → done) within 30 minutes without reading documentation**
- Developers adopt voluntarily because it reduces cognitive load

### Business Success

- Internal tool — measured by team adoption with concrete targets:
  - **3-month:** Core workflow functional, used by Sami on **10+ real stories**
  - **6-month:** **3+ developers** process **at least 50% of their stories** through the workflow
  - **12-month:** **>80% of all team stories** run through the workflow — it's the default
- Key metric: Percentage of team stories processed through the workflow

### Technical Success

- **Quality of plan and estimation over speed** — but with guardrails: refinement completes within a reasonable upper bound (no 45-minute waits)
- Accurate story estimations matching actual implementation effort
- **Platform abstraction layer designed from Day 1** — MVP runs on one platform, but the architecture supports switching without rewrite
- Platform-agnostic execution works on Windsurf Copilot and OpenCode without workflow changes

### Measurable Outcomes

- >80% of refinement perspectives accepted — **measured via lightweight user feedback after each refinement** (accept/reject per agent perspective)
- Stories have clear subtasks a developer can pick up without additional clarification
- **(Phase 2)** Review loop resolves within 3 iterations for >90% of stories — **tracked by findings-per-iteration** (findings must decrease each iteration, otherwise loop is broken)
- **(Phase 2)** Follow-up ticket rate <30% — if more than 30% of stories need follow-up tickets, the refinement process needs improvement
- **(Phase 2)** Failed 3rd review → auto follow-up ticket re-enters full Scrum cycle (refine → discuss → plan → implement)

## Product Scope

*See [Project Scoping & Phased Development](#project-scoping--phased-development) for detailed phase breakdown, MVP capabilities table, and risk mitigation strategy.*

**Summary:** End-to-end simplified workflow on GitHub Copilot (MVP) → full workflow with review loop (Phase 2) → Windsurf + OpenCode (Phase 3) → platform-dynamic with team dashboard (Phase 4).

## User Journeys

### Journey 1: Sami — Solo Developer with an Agent Team (Happy Path)

**Who:** Sami, a developer working on a feature. No Scrum Master, no separate QA team — just him and his agentic workflow.

**Opening Scene:** Sami has an idea for a new feature. Normally, he'd open his editor, start coding, realize halfway through he missed edge cases, rewrite, then discover during review that the architecture doesn't fit. Instead, he types `/create-ticket "User authentication with OAuth2 support"`.

**Rising Action:**
1. The system generates a structured story file — description, acceptance criteria, initial estimation. Sami reviews it: the spec captures what he meant, no prompt-engineering needed.
2. He runs `/refine-ticket story-1.1`. Four agent perspectives come back in parallel:
   - Architect warns: "OAuth2 requires token refresh handling — consider session management impact"
   - UX asks: "What happens when a token expires mid-session? Redirect or silent refresh?"
   - Dev flags: "Dependency on auth library v3 — check compatibility with current stack"
   - QA proposes: "Testable acceptance criteria: valid login, expired token, invalid credentials, rate limiting"
3. Sami sees each perspective clearly separated. He accepts 3 of 4 suggestions, adjusts one. The story file updates with a clean plan, estimation, and subtasks.
4. He checks progress with `/status story-1.1` — shows: `Refinement ✓ → Readiness Check: PASS → Ready for Dev`
5. Readiness check: PASS. The plan is fixed.
6. He runs `/dev-story story-1.1 1` — implementation begins on subtask 1.

**Climax:** After implementation, he runs `/dev-story story-1.1 review`. The review finds 2 findings. Dev fixes them. Second review: 0 findings. `/status story-1.1` shows: `Review ✓ → Awaiting Approval`. Story DONE.

**Resolution:** Sami approves the story at the human approval gate. He never wrote a prompt longer than one sentence. He never lost context between planning and coding. It felt like working with a team that already understood the codebase.

### Journey 2: Sami — Review Loop Failure (Edge Case)

**Opening Scene:** Sami runs `/dev-story story-2.3 review` after the third fix iteration. The reviewer still finds findings — the implementation approach has a fundamental flaw.

**Rising Action:**
1. Iteration 3 review: 2 findings remain. The system halts: "Max iterations reached. Creating follow-up ticket."
2. A follow-up ticket is auto-generated with **full failure context**: the attempted approach, findings from each iteration (10 → 5 → 2), and the reason the loop couldn't converge — not just "2 findings remain" but "token refresh architecture conflicts with stateless session design, attempted 3 different middleware configurations."
3. The original story is marked as blocked. Sami runs `/refine-ticket story-2.3-followup`. The agent team now discusses the root problem — armed with the failure context, they don't repeat the same approach.

**Climax:** The follow-up ticket produces a fundamentally different plan. Architect identifies the design flaw immediately because the failure context documented what was already tried. Dev proposes a stateful session approach instead. QA adjusts acceptance criteria.

**Resolution:** Sami implements the follow-up story. Review passes on iteration 1. The 3-iteration cap saved him from an endless fix loop, and the failure context ensured the team didn't walk in circles.

### Journey 3: Sami — First Time Setup (Onboarding)

**Opening Scene:** Sami has heard about the agentic workflow and wants to try it. His company uses OpenCode.

**Rising Action:**
1. He installs the workflow configuration for OpenCode.
2. He types `/create-ticket "dark mode"` — too vague. The system enters **guided mode**: "Can you tell me more? Who is this for? What problem does it solve? Where in the app should this appear?" Like a good Scrum Master that asks follow-up questions instead of accepting a half-baked story.
3. Sami elaborates: "Add dark mode toggle to settings page for users who work at night." The story file appears: clean, structured, with estimation. He thinks: "That's what I meant."
4. He runs `/refine-ticket`. Four perspectives come back. He's surprised — QA already thought about accessibility contrast ratios. Architect notes it should use the existing theme system.
5. Readiness check passes. He runs `/dev-story` and watches the implementation + review loop.

**Climax:** Within 30 minutes of first use, he has a fully refined, implemented, and reviewed feature — the guided mode ensured quality from the very first interaction.

**Resolution:** Sami switches to this workflow for his next real story. The onboarding was the product itself — no separate learning curve. The system taught him how to write good tickets by asking the right questions.

### Journey 4: Sami — Refinement Rejection (Context Mismatch)

**Opening Scene:** Sami creates a ticket for a domain-specific feature — integrating a proprietary internal API that the agents have no knowledge about.

**Rising Action:**
1. He runs `/refine-ticket story-3.1`. The agent perspectives come back, but they're generic — the Architect suggests REST best practices that don't apply, QA proposes standard API tests that miss the proprietary protocol.
2. Sami rejects the refinement: "None of this applies — this is our internal binary protocol, not REST."
3. The system recognizes the rejection and prompts: "It seems I'm missing context about your internal API. Can you provide documentation, constraints, or key details so I can re-refine with the right context?"
4. Sami pastes a brief description of the protocol and its constraints. He runs `/refine-ticket story-3.1` again.
5. Second refinement: Architect now warns about binary serialization overhead, Dev flags the custom client dependency, QA proposes protocol-specific test scenarios.

**Climax:** The re-refinement is accurate because Sami provided the missing domain context. The agents adapted instead of repeating generic advice.

**Resolution:** Sami learns that for domain-specific work, providing context upfront yields better results — but the system handled the rejection gracefully instead of forcing him through a broken refinement.

### Journey Requirements Summary

| Capability | Revealed By |
|---|---|
| Spec-first ticket creation from natural language | Journey 1, 3 |
| **Guided mode for vague input** — system asks follow-up questions | Journey 3 |
| Parallel multi-agent refinement with distinct perspectives | Journey 1, 2, 3, 4 |
| Visible per-agent output (not merged) | Journey 1, 4 |
| Lightweight feedback (accept/reject per perspective) | Journey 1 |
| **Refinement rejection + re-refine with added context** | Journey 4 |
| Readiness check gate | Journey 1, 3 |
| **`/status` command — real-time story status tracking** | Journey 1, 2 |
| Dev → Review → Fix reflection loop | Journey 1, 2 |
| Max 3 iteration cap with auto follow-up ticket | Journey 2 |
| **Follow-up ticket includes failure context** (attempted approach, findings per iteration, root cause) | Journey 2 |
| Human approval gate | Journey 1 |
| Platform configuration (Windsurf / OpenCode) | Journey 3 |
| Zero-documentation onboarding | Journey 3 |

## Innovation & Novel Patterns

### Detected Innovation Areas

1. **Agentic Scrum Team Simulation** — No tool on the market simulates a complete Scrum team with parallel agent perspectives. GitHub Copilot Workspace, Cursor, Windsurf — all are single-agent assistants. This product creates a multi-agent team that collaborates like real Scrum team members.

2. **Role Displacement: Automating the Scrum Master** — The deeper disruption is not "better developer tool" but a role shift. The system automates what Scrum Masters do: moderate refinements, prepare stories, ensure readiness, track progress. This is a paradigm shift that may drive rapid adoption — or resistance.

3. **Spec-First with Agent Refinement** — The combination of Specification-Driven Development and Multi-Agent Brainstorming before implementation. Other tools help with coding — this helps with thinking before coding.

4. **Platform-Agnostic Agent Orchestration** — Every agent system today is built for ONE platform. This builds an agent coordination layer that sits ABOVE the tool. The workflow stays the same; the platform is interchangeable. The innovation is not "4 agents talk to each other" — it's "4 agents talk to each other regardless of platform."

5. **Emergent Institutional Learning** — The follow-up ticket mechanism with failure context (attempted approach, findings per iteration, root cause) creates an automatic knowledge base of what doesn't work in the codebase and why. This is a byproduct of the follow-up mechanism, not an actively built feature. After 50 stories, the team has institutional memory about failed approaches — agent memory emerges from the workflow itself, before any explicit memory feature is built.

### Validation Approach

Two innovation hypotheses require validation at different stages:

| Hypothesis | Validation Point | Success Signal |
|---|---|---|
| **Agent-quality replaces Scrum Master for refinement** | MVP — first 10 stories | Sami says "I don't need a Scrum Master for refinement anymore" — refinement perspectives are actionable without manual rework |
| **Platform abstraction works across tools** | Growth — second platform onboarded | Switching from Windsurf to OpenCode (or vice versa) requires zero workflow changes, only a config swap |

### Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Agent perspectives are too generic / not actionable | Users reject refinement, tool feels useless | Guided mode for context input; re-refine with added context; lightweight feedback loop to measure acceptance rate |
| Role displacement resistance (Scrum Masters feel threatened) | Organizational pushback against adoption | Position as "Scrum Master augmentation for solo devs", not replacement. Target teams without dedicated Scrum Masters first |
| Platform abstraction adds complexity without value in MVP | Over-engineering delays launch | MVP runs on one platform only; abstraction layer is architectural (clean interfaces), not feature work. Validate with second platform in Growth phase |
| Failure context in follow-up tickets is too noisy | Developers ignore follow-up context, refinement repeats mistakes | Structure failure context as: (1) what was tried, (2) why it failed, (3) suggested alternative direction — not raw finding dumps |

## Developer Tool Specific Requirements

### Project-Type Overview

Scrum Workflow is a file-based, configuration-driven developer tool that integrates into AI-powered coding environments via slash commands. The entire system is built on formats natively supported by the target platforms: YAML (configuration), CSV (data), and Markdown (specs, stories, agent instructions). No compiled code, no runtime dependencies — just files that the AI coding assistant interprets.

### Technical Architecture Considerations

**Language & Format Matrix:**

| Format | Purpose | Examples |
|---|---|---|
| YAML | Configuration, story frontmatter, agent config, sprint index | `config.yaml`, story metadata, platform settings, `index.yaml` |
| CSV | Structured data, lookup tables | Agent roles, estimation references, review criteria |
| Markdown | Agent instructions, story specs, workflow steps, documentation | Story files, skill definitions, refinement output, review reports |

**No compiled code.** The system is interpreted by the AI coding assistant at runtime. This means:
- Zero build step
- Instant changes — edit a markdown file, the workflow changes
- Platform compatibility by design — YAML/CSV/Markdown work everywhere

### Installation Method

**Copy-based installation** — files are copied directly into the project directory:
- Copy workflow configuration folder into project root
- No package manager, no dependency resolution, no build tools
- Version control via git — the workflow is part of the repo
- Updates: copy new version over existing files

### File Structure

```
project-root/
├── .scrum-workflow/              # Workflow configuration
│   ├── config.yaml               # Main config + platform settings
│   ├── agents/                   # Agent role definitions (Architect, UX, Dev, QA)
│   ├── templates/                # Story templates, review checklists
│   ├── data/                     # CSV lookup tables
│   └── workflows/                # Workflow step definitions
├── sprints/                      # All stories, historized
│   ├── index.yaml                # Central index: ticket status, sprint assignment
│   ├── SW-101/
│   │   ├── story.md              # The spec (source of truth)
│   │   ├── refinement.md         # Agent perspectives from refinement
│   │   ├── plan.md               # Execution plan after readiness check
│   │   ├── review-1.md           # Review iteration 1 findings
│   │   ├── review-2.md           # Review iteration 2 findings
│   │   ├── approval.md           # Final approval record
│   │   └── followup.md           # Failure context (if review loop failed)
│   ├── SW-102/
│   │   └── ...
│   └── SW-103/
│       └── ...
└── ...project code...
```

**Sprint Index (`sprints/index.yaml`):**
```yaml
tickets:
  SW-101:
    sprint: 1
    status: done
    created: 2026-03-24
  SW-102:
    sprint: 1
    status: in-review
    iteration: 2
  SW-103:
    sprint: 2
    status: refinement
    followup_from: SW-099
```

Central index enables `/status` without folder scanning and provides sprint-level traceability.

### Context Management

Each `story.md` frontmatter defines which files the agent reads per phase via a `context_files` array:

```yaml
---
ticket: SW-101
title: "OAuth2 Login"
status: in-dev
estimation: 5
context_files:
  refinement: [story.md]
  planning: [story.md, refinement.md]
  development: [story.md, refinement.md, plan.md]
  review: [story.md, plan.md]
---
```

This prevents context fragmentation — each phase loads exactly the files it needs, no more, no less.

### Follow-up Ticket Traceability

When a review loop fails after 3 iterations:
- **Original ticket** (`SW-103/followup.md`): Documents what failed and why — attempted approach, findings per iteration, root cause analysis
- **New ticket** (`SW-104/story.md`): References `SW-103` and includes the failure context as input for the new refinement
- Both tickets are cross-linked in `index.yaml` via `followup_from` / `followup_to` fields

### Command Interface

| Command | Input | Output | Description |
|---|---|---|---|
| `/create-ticket SW-103 "idea"` | Ticket number + natural language | `sprints/SW-103/story.md` | Spec-first ticket creation with guided mode |
| `/refine-ticket SW-103` | Ticket number | `sprints/SW-103/refinement.md` | Parallel multi-agent refinement |
| `/dev-story SW-103 [subtask\|review]` | Ticket number + mode | Code or `review-N.md` | Development and reflection loop |
| `/status SW-103` | Ticket number (optional) | Status display | Story status or sprint overview |
| `/cancel SW-103` | Ticket number | Status → cancelled | Abort a story in progress |

### Documentation & Tutorials

Shipped with the tool:
- **Quick Start Guide** — From install to first completed story in 30 minutes
- **Command Reference** — All slash commands with examples
- **Story File Format** — YAML frontmatter schema + Markdown structure
- **Configuration Guide** — How to configure for Windsurf / OpenCode
- **Tutorial: First Story** — Step-by-step walkthrough with a real example

### Implementation Considerations

- **No migration needed** — copy-based install, no schema migrations
- **Platform switching** — Change `platform` field in `config.yaml`, all commands work the same
- **Extensibility** — Add new agent roles by adding a Markdown file to `agents/`
- **Story files are portable** — Standard Markdown, readable without the tool
- **Index is auto-maintained** — Every command updates `index.yaml` automatically

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** End-to-End Simplified — the complete workflow from ticket creation to approval, but with reduced complexity at each step. The user must experience the full value of "working with a team", not just a fragment.

**Rationale:** A refinement-only MVP would produce great stories nobody can execute through the system. The story file is the central artifact — it must work across all phases. End-to-end validates the interfaces between phases, not just individual features.

**Resource Requirements:** Solo developer (Sami), file-based architecture (no infrastructure), one platform.

**Platform Sequence:** GitHub Copilot → Windsurf → OpenCode

### Agentic Pattern Architecture

Each workflow phase maps to a validated agentic pattern from agentic-patterns.com:

| Workflow Phase | Pattern | Status | Key Principle |
|---|---|---|---|
| **Overall Architecture** | [**Discrete Phase Separation**](https://www.agentic-patterns.com/patterns/discrete-phase-separation) | emerging | Each phase runs in isolated context. Only synthesized results (story.md, refinement.md, etc.) pass between phases. Prevents context contamination |
| **Overall Architecture** | [**Filesystem-Based Agent State**](https://www.agentic-patterns.com/patterns/filesystem-based-agent-state) | established | Sprint folder = agent state. Checkpoints after each phase. Enables resumption after interruption |
| **Overall Architecture** | [**Agent-Friendly Workflow Design**](https://www.agentic-patterns.com/patterns/agent-friendly-workflow-design) | best practice | Clear handoff protocols between phases. Planning-execution separation. Structured interfaces. Iterative feedback |
| **Phase 1: /create-ticket** | [**Specification-Driven Agent Development**](https://www.agentic-patterns.com/patterns/specification-driven-agent-development) | proposed | Story file = spec = source of truth. No code before spec PASS. Every artifact traces back to spec clause |
| **Phase 2: /refine-ticket** | [**Iterative Multi-Agent Brainstorming**](https://www.agentic-patterns.com/patterns/iterative-multi-agent-brainstorming) | experimental | 2-4 parallel agents with distinct perspectives. Coordinator synthesizes. Max 4 agents due to exponential overhead |
| **Phase 2: /refine-ticket** | [**Sub-Agent Spawning**](https://www.agentic-patterns.com/patterns/sub-agent-spawning) | validated | Architect, Dev, QA as sub-agents with isolated context. Subject hygiene: each agent receives only relevant files |
| **Phase 3: Readiness Check** | [**Plan-Then-Execute**](https://www.agentic-patterns.com/patterns/plan-then-execute-pattern) | established | Plan phase generates fixed sequence. Execution follows exactly. +40-70% task completion, -60% hallucinations |
| **Phase 4: /dev-story review** | [**Reflection Loop**](https://www.agentic-patterns.com/patterns/reflection) | established | Generate → Evaluate → Critique → Revise → Repeat. Max 2-3 iterations optimal. Stable scoring rubrics |
| **Phase 5: Approval** | [**Human-in-the-Loop Approval**](https://www.agentic-patterns.com/patterns/human-in-loop-approval-framework) | validated | Risk classification + approval workflow. Timeout = default deny. Audit trail for all decisions |
| **Context Management** | [**Curated File Context Window**](https://www.agentic-patterns.com/patterns/curated-file-context-window) | best practice | `context_files` array = curated context. Only relevant files per phase. Prevents token bloat and hallucinations |

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Journey 1 (Happy Path) — simplified
- Journey 3 (Onboarding) — simplified

**Must-Have Capabilities:**

| # | Capability | Simplification vs. Full Vision |
|---|---|---|
| 1 | **Story file format** — YAML frontmatter + Markdown template | Full — this is the foundation, no shortcuts |
| 2 | `/create-ticket SW-XXX "idea"` — spec-first ticket creation | Full — with **guided mode** for vague input |
| 3 | `/refine-ticket SW-XXX` — multi-agent refinement | **Simplified: 3 agents (Architect, Dev, QA)** via sub-agent spawning — no UX agent in MVP |
| 4 | Readiness check — plan-then-execute gate | Simple pass/fail on story file completeness |
| 5 | `/dev-story SW-XXX` — implementation | Full — agent implements based on plan |
| 6 | Review — **single pass, no loop** | One review, findings listed. User fixes manually. No automatic loop |
| 7 | Approval gate — human sign-off | Manual — user marks story as done |
| 8 | Sprint folder structure — `sprints/SW-XXX/**` | Basic — story.md + refinement.md + review.md per ticket |
| 9 | **Lightweight feedback** — accept/reject per agent perspective | Simple prompt after refinement |
| 10 | Platform abstraction — clean interfaces | Architectural only — runs on **GitHub Copilot** only |

**Explicitly NOT in MVP:**
- `/status` command, `/cancel` command
- `index.yaml` sprint index
- UX agent perspective
- Review loop (max 3 iterations), follow-up ticket creation
- Refinement rejection + re-refine
- `context_files` array in frontmatter

### Post-MVP Features (Phase 2 — after 10 validated stories)

- Review loop (Dev → Review → Fix, max 3 iterations) — **Reflection Loop pattern**
- Follow-up ticket creation with failure context on loop exhaustion
- `/status` and `/cancel` commands
- `index.yaml` sprint index (auto-maintained)
- Guided mode improvements + refinement rejection + re-refine with added context
- `context_files` array per phase — **Curated File Context Window pattern**
- 4th agent: UX perspective in refinement

### Phase 3 — Multi-Platform (after 3+ devs using it)

- **Windsurf** platform support (leveraging abstraction layer)
- **OpenCode** platform support
- Sprint planning and velocity tracking
- Historical learning — estimations improve from actuals vs. estimates
- DevOps agent perspective in refinement
- Findings-per-iteration dashboard

### Phase 4 — Vision (after team-wide adoption)

- Fully platform-dynamic — any agentic coding tool
- Team-wide dashboard with workflow metrics and adoption tracking
- Cross-story dependency detection during refinement
- Agent memory across stories — **Episodic Memory Retrieval pattern**
- Institutional learning aggregation from follow-up tickets

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Mitigation |
|---|---|
| Story file format doesn't work across all phases | Build end-to-end first, validate format with real stories. Discrete Phase Separation ensures clean handoffs |
| 3 agents produce low-quality refinement | Start with Architect + Dev + QA. Sub-Agent Spawning with isolated context ensures focused perspectives |
| Single-platform code becomes entangled | Clean interfaces from Day 1 (Agent-Friendly Workflow Design), even though MVP only runs on GitHub Copilot |
| Context contamination between phases | Discrete Phase Separation — only pass synthesized files between phases, never full conversation history |

**Market Risks:**

| Risk | Mitigation |
|---|---|
| Solo dev can't validate team adoption | MVP validates personal productivity first (10 stories). Team adoption is Phase 3 goal |
| Agents don't reduce cognitive load vs. manual work | Measure: time-to-first-code after ticket creation, story rework rate |

**Resource Risks:**

| Risk | Mitigation |
|---|---|
| MVP scope creep | Hard rule: no `/status`, no loop, no guided mode improvements in MVP. Phase 2 only after 10 stories |
| Burnout from building everything solo | Phase 1 is minimal. Ship, validate, then decide what's next |

## Functional Requirements

### Ticket Creation

- **FR1:** User can create a new ticket by providing a ticket number and a natural language idea
- **FR2:** System generates a structured story file (YAML frontmatter + Markdown) from the user's input
- **FR3:** System detects vague or incomplete input and enters guided mode, asking follow-up questions to clarify the ticket
- **FR4:** System generates an initial story estimation based on the ticket description
- **FR5:** System creates the story file in the sprint folder structure (`sprints/SW-XXX/story.md`)

### Multi-Agent Refinement

- **FR6:** User can trigger refinement for a specific ticket
- **FR7:** System spawns multiple agent perspectives (Architect, Dev, QA) that analyze the story in parallel
- **FR8:** Each agent perspective is displayed separately and visibly attributed to its role
- **FR9:** Architect agent identifies architectural risks, affected decisions, and dependencies
- **FR10:** Dev agent identifies technical dependencies, implementation concerns, and feasibility issues
- **FR11:** QA agent proposes testable acceptance criteria and identifies edge cases
- **FR12:** System provides a coordination mechanism that merges accepted agent perspectives into a coherent updated story file with refined description, acceptance criteria, estimation, and subtasks
- **FR13:** User can accept or reject each agent perspective individually via lightweight feedback
- **FR14:** System records which perspectives were accepted/rejected for quality tracking

### Readiness Check

- **FR15:** System validates story completeness before implementation begins (plan-then-execute gate)
- **FR16:** Readiness check produces a clear PASS/FAIL result with reasons for failure
- **FR17:** No implementation can begin on a story that has not passed the readiness check

### Development & Implementation

- **FR18:** User can trigger implementation of a specific ticket
- **FR19:** System implements code based on the approved plan and story specification
- **FR20:** System generates a review report documenting findings after implementation

### Review

- **FR21:** User can trigger a review for an implemented ticket
- **FR22:** Review agent can read and analyze the implemented code changes in the context of the story specification
- **FR23:** Review agent evaluates implementation against the story specification and acceptance criteria
- **FR24:** Review findings are documented in a separate review file (`review-N.md`) within the ticket folder
- **FR25:** Review findings include specific issues, their severity, and suggested fixes
- **FR26:** Each review finding references the specific acceptance criterion or subtask it relates to

### Approval & Completion

- **FR27:** User can approve a reviewed story as DONE via a human approval gate
- **FR28:** No story can be marked as DONE without explicit human approval
- **FR29:** Approval is recorded in a separate approval file within the ticket folder

### Story File Management

- **FR30:** Each ticket has its own folder containing all related artifacts (story, refinement, plan, reviews, approval)
- **FR31:** Story files use YAML frontmatter for metadata (ticket number, title, status, estimation)
- **FR32:** Story status is tracked in the frontmatter and updated at each phase transition
- **FR33:** All story artifacts are standard Markdown, readable without the tool

### Error Handling & Recovery

- **FR34:** System can detect and resume an interrupted workflow from the last completed phase
- **FR35:** System validates story file integrity before processing

### Platform Abstraction

- **FR36:** System provides a documented platform abstraction layer with defined interface contracts
- **FR37:** Workflow configuration specifies the target platform (GitHub Copilot, Windsurf, OpenCode)
- **FR38:** Changing the target platform requires only a configuration change, not workflow changes

### Configuration & Installation

- **FR39:** System is installed by copying files into the project directory
- **FR40:** System configuration is stored in a single YAML file
- **FR41:** Agent roles are defined in separate Markdown files and are extensible by adding new files

### Deferred Capabilities (Phase 2)

- **FR42 (Phase 2):** Follow-up tickets reference the original ticket and include failure context from previous review iterations
- **FR43 (Phase 2):** User can check the status of any ticket or get a sprint overview
- **FR44 (Phase 2):** System automatically creates a follow-up ticket when review loop exhausts max iterations
- **FR45 (Phase 2):** User can cancel a ticket in progress
- **FR46 (Phase 2):** User can reject a refinement and provide additional context for re-refinement
- **FR47 (Phase 2):** UX agent provides user flow and edge case perspectives during refinement
- **FR48 (Phase 2):** Review loop repeats up to 3 iterations (Dev → Review → Fix) with exit condition: findings = 0

## Non-Functional Requirements

### Reliability & Recovery

- **NFR1:** Story file writes must be atomic — no partial writes that corrupt the YAML frontmatter or Markdown content
- **NFR2:** System resumes from the last completed phase after interruption, without data loss or duplicate processing
- **NFR3:** All workflow state is persisted to filesystem — no in-memory-only state that would be lost on crash

### Maintainability & Extensibility

- **NFR4:** Adding a new agent role requires only creating a new Markdown file in the `agents/` directory — no code changes
- **NFR5:** Switching target platform requires changing only `config.yaml` — no workflow file modifications
- **NFR6:** Workflow updates (new version of the tool) must not break existing story files in `sprints/`
- **NFR7:** All configuration follows convention-over-configuration — all required fields have documented default values, minimal required config

### Portability

- **NFR8:** All artifacts (stories, refinements, reviews, approvals) are standard Markdown readable by any text editor or renderer
- **NFR9:** No runtime dependencies — the tool is pure configuration files interpreted by the AI coding assistant
- **NFR10:** Sprint folder structure is a standard git-friendly directory layout

### Context Efficiency

- **NFR11:** Each agent perspective in refinement must produce output within a single LLM context window of the target platform
- **NFR12:** The coordination mechanism must synthesize agent perspectives without exceeding the target platform's context limits
- **NFR13:** Story files remain concise enough that the dev agent can load story + plan within context limits for implementation
- **NFR14:** System documents the context window budget per platform in `config.yaml` and warns when a story file or refinement output approaches 80% of the platform's limit

### Schema Compatibility

- **NFR15:** Story file schema must be backwards-compatible — new fields are always optional with sensible defaults. Old story files must work with new workflow versions without migration

### Data Integrity

- **NFR16:** Feedback data (accepted/rejected perspectives) is stored in a dedicated section of the refinement file, separate from user-editable content
