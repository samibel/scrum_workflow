# Architecture Layer to Pattern Mapping

# Dynamic Scrum Intelligence Framework

> Back to [Index](./index.md)

---

# 3.1 Delivery Core

**Purpose:** Work units, states, transitions, contracts, required artifacts, approval rules.
**Primary Inspiration:** Chiron (FahadAlothman-fsd/chiron-desk)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Contract-Based Design | Explicit type definitions for work unit structure: facts, states, artifact slots. Story YAML frontmatter is the contract. | Chiron |
| State Machine | Named lifecycle states (9 states: draft → done) with guarded transitions. `status-guard-validation` skill enforces guards. | Chiron |
| Artifact Slot Pattern | Typed containers for durable deliverables (story.md, plan.md, review-N.md, approval-N.md). Each slot has defined provenance. | Chiron |
| Work Unit Layer | Methodology-driven units (story, implementation-plan, review, decision, risk) as first-class entities. | Chiron |
| Feature List as Immutable Contract | Acceptance criteria locked at validation. `/scrum-refine-story` enforces 5 immutable criteria. | agentic-patterns.com |
| Specification-Driven Agent Development | Formal spec (story.md) is canonical source. All implementation traces back to spec. | agentic-patterns.com |

**Integration Points:** Receives routing from Delivery Dispatcher (DD). Enforced by Delivery Control Layer (DCL). Artifacts stored in Delivery Vault (DV).

---

# 3.2 Capability & Agent System

**Purpose:** Capabilities (e.g. `backend.spring-boot`, `security.auth`), agent packs, role definitions, tool eligibility by phase.
**Primary Inspiration:** Hermes (NousResearch/hermes-agent)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Skill Registry | Capabilities organized as autonomous, self-contained procedural memory units. 7 Skills currently defined. | Hermes |
| Agent Packs | Extensible agent role definitions. Currently 3 agents (Architect, Developer, QA), extensible to Security, UX, Contract Validator. | Hermes |
| Sub-Agent Spawning | Parallel workstreams through agent forking. `/scrum-refine-ticket` spawns 3 agents in parallel with isolated context. | Hermes, agentic-patterns.com |
| Tool Capability Compartmentalization | Tools decomposed by capability class. Each agent gets scoped tool access based on role and phase. | agentic-patterns.com |
| Provider Abstraction | Unified interface supporting multiple AI models. Enables model selection per agent (e.g. separate model for review). | Hermes |

**Integration Points:** Agents activated by Delivery Dispatcher (DD). Boundaries enforced by Delivery Control Layer (DCL). Agent outputs stored in Delivery Memory (DM).

---

# 3.3 Delivery Dispatcher

**Purpose:** Orchestration: which agents, in which order, with which context, under which conditions.
**Primary Inspiration:** My-Brain-Is-Full-Crew (gnekt/My-Brain-Is-Full-Crew)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Dispatcher Pattern | Central orchestration hub routing work to agents/skills based on story type, risk, and domain. | My-Brain-Is-Full-Crew |
| Signal-Based Coordination | Agents signal dispatcher via `### Suggested next agent` structured output. Enables dynamic routing. | My-Brain-Is-Full-Crew |
| Skill vs Agent Separation | Skills handle multi-turn validation (with clarifying questions), agents handle single-shot reactive tasks. | My-Brain-Is-Full-Crew |
| Iterative Multi-Agent Brainstorming | 2-4 parallel agents with cross-talk rounds. Refinement uses 3 agents with up to 3 discussion rounds. | My-Brain-Is-Full-Crew, agentic-patterns.com |
| Discrete Phase Separation | Workflows separated into isolated phases (Research → Plan → Execute). Only distilled conclusions shared. | GSD, agentic-patterns.com |
| Agent-Friendly Workflow Design | High-level goals, not prescriptive instructions. Planning-execution separation. | agentic-patterns.com |

**Integration Points:** Routes agents from Capability System (CAS). Respects rules from Delivery Control Layer (DCL). Writes decisions to Delivery Memory (DM).

---

# 3.4 Delivery Control Layer

**Purpose:** Enforcement: no implementation without plan, no transition without approval, no writing outside boundaries.
**Primary Inspiration:** OpenAgentsControl (darrenhinde/OpenAgentsControl)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Plan-First Execution | Sequential progression (Propose → Approve → Execute). `readiness-check` creates plan.md. `dev-story` requires `ready-for-dev` status. | OpenAgentsControl |
| Approval Gate Pattern | Mandatory human authorization before critical transitions. Approval-Workflow + Template exist. `/scrum-approve` planned. | OpenAgentsControl |
| Policy Enforcement Layer | Editable governance rules in Markdown (not hardcoded). `status-guard-validation` and `prerequisite-validation` skills enforce rules. | OpenAgentsControl |
| Inversion of Control | Three-layer governance: Human sets policy, automated system enforces guardrails, agent executes within boundaries. | OpenAgentsControl, agentic-patterns.com |
| Hierarchical Delegation | Sub-agents remain subject to approval gates. Write boundaries per phase documented. | OpenAgentsControl |
| Minimal Viable Information (MVI) | Context files stay under limits. Token budgets configured per platform in `config.yaml`. Lazy loading reduces overhead ~80%. | OpenAgentsControl |
| Self-Critique Evaluator Loop | `/scrum-review-story` uses separate model with 5 review criteria. Evaluation decoupled from generation. | agentic-patterns.com |
| AI-Assisted Code Review | Automated review feedback via `/scrum-review-story`. Produces `approved` or `changes-needed` with structured findings. | agentic-patterns.com |
| Versioned Constitution Governance | Governance rules version-controlled in Git. Changes require review. Skills validate `schema_version` compatibility. | agentic-patterns.com |

**Integration Points:** Enforces rules for Delivery Core (DC) state transitions. Guards agent boundaries from Capability System (CAS). Reports violations to Delivery Vault (DV).

---

# 3.5 Delivery Memory

**Purpose:** Persistent intelligence: decisions, risks, review findings, lessons learned, session summaries.
**Primary Inspiration:** MemoryCore (Kiyoraka/Project-AI-MemoryCore)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Layered Memory Architecture | Persistent storage (Markdown files) + working memory (session RAM) + long-term knowledge. Different layers per phase. | MemoryCore |
| Decision Log Pattern | Append-only history for auditable decision tracking. `decision_record` artifacts planned in `_scrum-output/memory/decisions/`. | MemoryCore |
| Memory Consolidation | Merging raw notes into approved facts. Threshold-based reset prevents unbounded growth. | MemoryCore |
| Echo Memory Recall | Keyword-based search with multi-level fallback. Prevents hallucination when memory is incomplete. | MemoryCore |
| Filesystem-Based Agent State | All memory, artifacts, and audit data stored as Markdown with YAML frontmatter. No database. Resumable execution. | MemoryCore, GSD, agentic-patterns.com |
| Memory Synthesis from Execution Logs | Task diaries feed synthesis agents that extract generalizable patterns. Patterns surface after 3+ occurrences. | agentic-patterns.com |
| Context-Minimization | Staged pipeline: ingest → transform → purge original → execute on trusted artifacts. Prevents context pollution. | GSD, agentic-patterns.com |

**Integration Points:** Stores artifacts from Delivery Core (DC). Feeds context to Delivery Dispatcher (DD). Surfaced through Delivery Vault (DV).

---

# 3.6 Delivery Vault / Human Surface

**Purpose:** Human-readable linked artifacts: work unit context, decision records, review reports, audit surfaces.
**Primary Inspiration:** Obsidian Mind (breferrari/obsidian-mind)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Vault-First Knowledge | Durable knowledge lives in git-tracked Markdown, not ephemeral chat history. `_scrum-output/` is the vault. | Obsidian Mind |
| Multi-Layer Discovery | Bases (database views) + MOCs (indexes) + Backlinks (relationship accumulation). Navigation via index pages. | Obsidian Mind |
| Session Lifecycle Hooks | Five entry points (SessionStart, UserPromptSubmit, PostToolUse, PreCompact, Stop). Supports `/session-start` and `/wrap-up`. | Obsidian Mind |
| Linked Artifact Graph | Notes connected across meaning boundaries via annotated Related sections. Stories → Plans → Reviews → Decisions. | Obsidian Mind |
| Evidence Accumulation | Backlinks auto-collect without manual curation. Natural knowledge graph builds over time. | Obsidian Mind |

**Integration Points:** Renders artifacts from Delivery Memory (DM). Navigable by humans. Audit surfaces from Delivery Control Layer (DCL).

---

# 3.7 Runtime Adapter Layer

**Purpose:** Environment integration: Claude Code, Cursor, GitHub Copilot, Windsurf, OpenCode.
**Primary Inspiration:** GSD (gsd-build/get-shit-done)

| Pattern | Role in This Layer | Source |
|---------|--------------------|--------|
| Context Engineering | Persistent documentation (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md) for cross-session continuity. | GSD |
| Atomic Execution | XML-structured tasks with precise specs (name, files, action, verify, done). Each task gets its own clean commit. | GSD |
| Wave-Based Parallelization | Independent tasks run in parallel, dependent tasks sequence based on dependencies. | GSD |
| Verification as First-Class | Built-in quality gates: plan verification, post-execution verification, diagnostic agents on failure. | GSD |
| Runtime Neutrality | Multi-platform installation. CLI installer (`create-scrum-workflow`) supports 6 platforms. Adapter contract per platform. | GSD |
| Diagnostic Agent Spawning | Automatic root-cause analysis when verification fails. Fix plan generation from diagnostic output. | GSD |

**Integration Points:** Adapts all layers to specific AI runtime. Token budgets from Delivery Control Layer (DCL). Platform config in `config.yaml`.
