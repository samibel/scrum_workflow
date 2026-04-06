# Vision Principle to Pattern Mapping

# Dynamic Scrum Intelligence Framework

> Back to [Index](./index.md)

---

# 2.1 Spec-First

> "No implementation without clear specification: scope, acceptance criteria, impacted systems, known risks, expected artifacts." — vision.md 4.1

**Core Constraint:** No agent may begin implementation without a validated specification artifact.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Specification-Driven Agent Development | Formal spec document is the canonical source of truth. Agents parse specs into task graphs and scaffold from definitions. | DC |
| Feature List as Immutable Contract | Acceptance criteria are locked before implementation. Agents can only mark `passes: true`, never modify criteria. | DC, DCL |
| Spec-As-Test Feedback Loop | Executable tests auto-generated from specs detect drift between implementation and specification. | DC, DCL |

**Anti-Pattern:** *Premature Implementation* — Starting code before spec and plan are approved. Agent produces code that doesn't match requirements, acceptance criteria are invented retroactively.

---

# 2.2 Plan-First

> "No implementation without an explicit plan: affected components, approach, test strategy, risks, non-goals, rollback idea." — vision.md 4.2

**Core Constraint:** No agent may execute implementation steps without an approved plan artifact (`plan.md`).

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Plan-Then-Execute | Two distinct phases: LLM generates plan, controller executes it. Planning increases task completion by 40-70%. | DCL, DD |
| Discrete Phase Separation | Research, planning, and implementation run in isolated conversations with dedicated focus. Only distilled conclusions shared between phases. | DD, RAL |

**Anti-Pattern:** *Simultaneous Plan-Execute* — Agent researches, plans, and implements in one context window. Competing priorities contaminate reasoning; quality degrades across all activities.

---

# 2.3 Separation of Concerns

> "One agent should not do everything. Different perspectives (architecture, QA, security, UX, DevOps) must be separated into specialized agents." — vision.md 4.3

**Core Constraint:** No single agent may combine research, planning, implementation, verification, and review.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Sub-Agent Spawning | Primary agent spawns focused sub-agents with isolated context and constrained toolsets. 2-4 parallel agents optimal. | CAS, DD |
| Iterative Multi-Agent Brainstorming | Multiple independent agents tackle the same problem from distinct perspectives. Coordinator synthesizes outputs. | DD, CAS |
| Tool Capability Compartmentalization | Tools decomposed into reader/processor/writer micro-tools. Explicit composition required across capability boundaries. | CAS, DCL |
| Self-Critique Evaluator Loop | Separate evaluator judges output quality. Evaluation and generation use different prompts to prevent self-bias. | DCL |

**Anti-Pattern:** *Unbounded Agent Scope* — One agent doing research, planning, implementation, and review. Agent becomes overloaded, quality degrades, and no independent verification occurs.

---

# 2.4 Human Gate

> "Critical transitions require human control. No AI agent may mark critical work as done, silently accept risk, approve release-critical work, or override governance rules." — vision.md 4.4

**Core Constraint:** No agent may autonomously approve, release, accept risk, or bypass governance without explicit human authorization.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Human-in-the-Loop Approval Framework | Gated execution with mandatory human checkpoints at critical junctures (schema modifications, deployments, external writes). | DCL, DC |
| Inversion of Control (Policy Layer) | Three-layer governance: humans define objectives and constraints at policy level. Agent never overrides policy. | DCL, DD |
| Versioned Constitution Governance | Governance rules stored as signed, version-controlled files. Agents may propose changes but only human gatekeepers merge. | DCL |

**Anti-Pattern:** *Silent Risk Acceptance* — Agent encounters a risk or uncertainty and proceeds without flagging it to the human. Decisions are made invisibly, trust is eroded.

---

# 2.5 Bounded Authority

> "Every agent operates within explicit read/write boundaries and may only act inside its phase and policy constraints." — vision.md 4.5

**Core Constraint:** No agent may read context or write artifacts outside its explicitly assigned boundaries.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Inversion of Control (Control Layer) | Automated guardrail enforcement and boundary protection between policy and execution layers. | DCL |
| Tool Capability Compartmentalization | Tools isolated by capability class (reader, processor, writer). Scoped credentials and file permissions per class. | CAS, DCL |
| Hierarchical Delegation | Sub-agents remain subject to approval gates and operate within parent-defined boundaries. | DD, DCL |
| Minimal Viable Information (MVI) | Context files stay under 200 lines, lazy loading reduces token overhead ~80%. Agents receive only what they need. | RAL, DM |

**Anti-Pattern:** *Context Stuffing* — Loading entire project context into every agent invocation. Wastes tokens, introduces noise, and creates attack surface for prompt injection.

---

# 2.6 Persistent Project Memory

> "The system must remember decisions, risks, review patterns, architecture knowledge, delivery lessons, and active context across sessions." — vision.md 4.6

**Core Constraint:** No decision, risk, or lesson may exist only in chat history. All must be externalized as persistent artifacts.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Filesystem-Based Agent State | Agents externalize progress by writing intermediate results to files. Enables resumable execution with deterministic failure recovery. | DM, DV |
| Memory Synthesis from Execution Logs | Two-tier architecture: task diaries capture raw logs, synthesis agents extract generalizable patterns. Prevents knowledge loss. | DM, DV |
| Context-Minimization | Staged pipeline: ingest, transform, purge original, execute on trusted artifacts. Prevents context pollution while preserving essential information. | DM, RAL |
| Episodic Memory Retrieval | Past experiences retrieved and injected based on relevance to current task. Supports session continuity. | DM |
| Layered Memory Architecture | Persistent storage (files) + working memory (session) + long-term knowledge. Different layers activated at different phases. | DM |

**Anti-Pattern:** *Chat History as Source of Truth* — Relying on conversation context instead of persistent artifacts. Knowledge is lost between sessions. Decisions cannot be audited or searched.

---

# 2.7 Adaptive Workflow Depth

> "Not every task goes through the same process weight. A UI text fix should not receive the same treatment as auth changes or schema migrations. The workflow adapts to task type, complexity, and risk." — vision.md 4.7

**Core Constraint:** The system must not apply uniform process weight to all tasks regardless of complexity and risk.

| Pattern | How It Serves This Principle | Layer(s) |
|---------|------------------------------|----------|
| Agent-Friendly Workflow Design | Clear high-level goals rather than prescriptive step-by-step instructions. Planning-execution separation. Appropriate autonomy based on task. | DD, RAL |
| Discrete Phase Separation | Phases can be skipped or shortened for low-risk tasks. Full separation (Research → Plan → Execute) for high-risk tasks. | DD, RAL |
| Signal-Based Coordination | Agents signal dispatcher via structured output sections. Dispatcher uses signals to determine next appropriate phase. | DD |

**Anti-Pattern:** *Monolithic Workflow* — Every task goes through identical 6-phase process. Trivial changes are over-processed, team loses trust in the system's efficiency.
