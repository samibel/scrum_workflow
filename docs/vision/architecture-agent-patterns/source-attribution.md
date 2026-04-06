# Source Attribution

# Dynamic Scrum Intelligence Framework

> Back to [Index](./index.md)

---

# 6.1 Inspiration Repositories

| # | Repo | GitHub Link | Primary Contribution to DSIF |
|---|------|------------|------------------------------|
| 1 | **Hermes** | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | Capability-based modularity, Skill Registry, Agent Packs, Provider Abstraction, Sub-Agent Spawning |
| 2 | **Chiron** | [FahadAlothman-fsd/chiron-desk](https://github.com/FahadAlothman-fsd/chiron-desk/tree/feat/effect-migration) | Work Unit Layer, Contract-Based Design, State Machine, Artifact Slots, Bounded Authority, Workflow Backbone |
| 3 | **MemoryCore** | [Kiyoraka/Project-AI-MemoryCore](https://github.com/Kiyoraka/Project-AI-MemoryCore) | Layered Memory Architecture, Decision Log, Memory Consolidation, Echo Memory Recall, Session Memory |
| 4 | **Obsidian Mind** | [breferrari/obsidian-mind](https://github.com/breferrari/obsidian-mind) | Vault-First Knowledge, Multi-Layer Discovery, Session Lifecycle Hooks, Linked Artifact Graph, Evidence Accumulation |
| 5 | **My-Brain-Is-Full-Crew** | [gnekt/My-Brain-Is-Full-Crew](https://github.com/gnekt/My-Brain-Is-Full-Crew) | Dispatcher Pattern, 8-Agent Specialization, Skill vs Agent Separation, Signal-Based Coordination, Chat as Intake Surface |
| 6 | **OpenAgentsControl** | [darrenhinde/OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl) | Plan-First Execution, Approval Gate, Policy Enforcement Layer, MVI, Hierarchical Delegation, Context Discipline |
| 7 | **GSD** | [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) | Context Engineering, Atomic Execution, Wave-Based Parallelization, Verification as First-Class, Runtime Neutrality, Diagnostic Agent Spawning |

### What We Do NOT Take

| Source | Excluded Aspect | Reason |
|--------|----------------|--------|
| Hermes | Autonomous skill self-generation | Conflicts with Human Gate principle — no hidden behavior |
| MemoryCore | Personality persistence | DSIF focuses on domain knowledge, not agent personality |
| Obsidian Mind | Personal competency notes | DSIF adapts to architectural/delivery competencies, not personal development |
| My-Brain-Is-Full-Crew | Email/calendar/transcription focus | Domain-specific to personal productivity, not software delivery |

---

# 6.2 Agentic Patterns Catalog

**Source:** [Awesome Agentic Patterns](https://github.com/nibzard/awesome-agentic-patterns) | Website: [agentic-patterns.com](https://www.agentic-patterns.com)
**License:** Apache 2.0
**Total Patterns in Catalog:** 157+ across 8 categories
**Patterns Selected for DSIF:** 15

| External Pattern Name | Category on Site | Our Canonical Name | Adaptation for DSIF |
|-----------------------|-----------------|-------------------|---------------------|
| Plan-Then-Execute Pattern | Orchestration & Control | Plan-Then-Execute | Applied via `readiness-check` skill and `/scrum-dev-story` workflow |
| Inversion of Control | Orchestration & Control | Inversion of Control | Three-layer model mapped to human approval, skill enforcement, agent execution |
| Discrete Phase Separation | Orchestration & Control | Discrete Phase Separation | Story lifecycle phases as isolated slash-command invocations |
| Sub-Agent Spawning | Orchestration & Control | Sub-Agent Spawning | 3-agent refinement with role-specific system prompts and bounded context |
| Feature List as Immutable Contract | Orchestration & Control | Feature List as Immutable Contract | `story-validation` skill with 5 immutable criteria gate |
| Specification-Driven Agent Development | Orchestration & Control | Specification-Driven Agent Development | Entire framework is Markdown-as-Code: SKILL.md files as runtime specs |
| Iterative Multi-Agent Brainstorming | Orchestration & Control | Iterative Multi-Agent Brainstorming | Refinement cross-talk with up to 3 discussion rounds |
| Context-Minimization Pattern | Context & Memory | Context-Minimization | Token budgets, isolated agent context, write boundary rules |
| Filesystem-Based Agent State | Context & Memory | Filesystem-Based Agent State | All state in Markdown files with YAML frontmatter, no database |
| Memory Synthesis from Execution Logs | Context & Memory | Memory Synthesis from Execution Logs | Planned Phase 6: Memory Librarian Agent for consolidation |
| Spec-As-Test Feedback Loop | Feedback Loops | Spec-As-Test Feedback Loop | Planned Phase 3: `/scrum-verify` command |
| Self-Critique Evaluator Loop | Feedback Loops | Self-Critique Evaluator Loop | Separate review model in `/scrum-review-story` |
| AI-Assisted Code Review / Verification | Feedback Loops | AI-Assisted Code Review | `/scrum-review-story` with 5 criteria and severity classification |
| Tool Capability Compartmentalization | Security & Safety | Tool Capability Compartmentalization | Write boundary rules, scoped agent tool access |
| Versioned Constitution Governance | Security & Safety | Versioned Constitution Governance | `schema_version` in frontmatter, CLI installer integrity validation |
| Human-in-the-Loop Approval Framework | UX & Collaboration | Human-in-the-Loop Approval Framework | Approval workflow, `/scrum-approve` command (planned Phase 1) |
| Agent-Friendly Workflow Design | UX & Collaboration | Agent-Friendly Workflow Design | 14 workflows define goals and boundaries, not step-by-step instructions |
