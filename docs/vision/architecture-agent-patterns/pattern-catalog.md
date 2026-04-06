# Pattern Catalog

# Dynamic Scrum Intelligence Framework

> Back to [Index](./index.md)

---

# 4.1 Orchestration & Control

### 4.1.1 Plan-Then-Execute

**Category:** Orchestration & Control
**Source(s):** OpenAgentsControl, GSD | agentic-patterns.com: Plan-Then-Execute Pattern
**Principle(s):** Plan-First
**Layer(s):** DCL, DD

**Definition:** Divide reasoning into two distinct phases. Planning phase: LLM generates a predetermined sequence of steps before encountering untrusted data. Execution phase: controller strictly executes the sequence. Tool outputs may modify parameters but cannot alter which tools execute. Planning before execution increases task completion by 40-70%.

**In This Project:** `readiness-check` skill creates `plan.md` during planning phase. `/scrum-dev-story` executes against the approved plan. `/scrum-research` uses Plan-Then-Execute pattern explicitly.

**Key Rule:** Never begin execution without a reviewed and approved plan artifact.

---

### 4.1.2 Inversion of Control

**Category:** Orchestration & Control
**Source(s):** OpenAgentsControl | agentic-patterns.com: Inversion of Control
**Principle(s):** Human Gate, Bounded Authority
**Layer(s):** DCL, DD

**Definition:** Three-layer governance model. Policy Layer: humans define objectives, boundaries, success criteria. Control Layer: automated systems enforce guardrails. Execution Layer: agents independently manage task decomposition and tool selection. "Human sets policy, agent performs."

**In This Project:** `/scrum-dev-story` uses Inversion of Control: implementation agents execute plans without self-validation or self-review. Write boundary rules define the Control Layer. Human approval defines the Policy Layer.

**Key Rule:** Agents execute within boundaries; they never define or modify those boundaries.

---

### 4.1.3 Discrete Phase Separation

**Category:** Orchestration & Control
**Source(s):** GSD | agentic-patterns.com: Discrete Phase Separation
**Principle(s):** Plan-First, Adaptive Workflow Depth
**Layer(s):** DD, RAL

**Definition:** Separate complex workflows into distinct phases, each running in isolated conversations with dedicated focus. Share only distilled conclusions between phases, not full conversation histories. Prevents context contamination while preserving essential information. Tool use accuracy increases from 72% to 94% through deliberation.

**In This Project:** Story lifecycle enforces phase separation: Intake → Refinement → Validation → Implementation → Review → Approval. Each slash-command operates in its own phase with dedicated context.

**Key Rule:** Share distilled conclusions between phases, never raw conversation history.

---

### 4.1.4 Sub-Agent Spawning

**Category:** Orchestration & Control
**Source(s):** Hermes, My-Brain-Is-Full-Crew | agentic-patterns.com: Sub-Agent Spawning
**Principle(s):** Separation of Concerns
**Layer(s):** CAS, DD

**Definition:** Primary agent spawns focused sub-agents, each with its own fresh context, to tackle parallelizable subtasks simultaneously. Each spawned agent requires a clear, specific task description. Optimal range: 2-4 simultaneous sub-agents.

**In This Project:** `/scrum-refine-ticket` spawns 3 sub-agents (Architect, Developer, QA) with isolated context. Each receives role-specific system prompt and bounded read access.

**Key Rule:** Every sub-agent must have an explicit task description, scoped tool access, and isolated context.

---

### 4.1.5 Feature List as Immutable Contract

**Category:** Orchestration & Control
**Source(s):** agentic-patterns.com: Feature List as Immutable Contract
**Principle(s):** Spec-First
**Layer(s):** DC, DCL

**Definition:** Establish an upfront, structured, unchangeable feature specification. Agents may only set `passes: true` after verification — they cannot delete features, modify acceptance criteria, or mark items as inapplicable. Prevents premature completion claims, scope creep via test deletion, and hallucinated completeness.

**In This Project:** `/scrum-refine-story` validates against 5 immutable criteria. The Feature List from the story spec cannot be weakened during validation. This is the `story-validation` skill.

**Key Rule:** Acceptance criteria can only be marked as passing, never modified or deleted.

---

### 4.1.6 Specification-Driven Agent Development

**Category:** Orchestration & Control
**Source(s):** agentic-patterns.com: Specification-Driven Agent Development
**Principle(s):** Spec-First
**Layer(s):** DC

**Definition:** Formal specification document serves as canonical source of truth. Agents parse specifications into explicit task graphs, scaffold from definitions, and ensure all outputs trace back to specific requirements. Specifications stored in version control alongside implementation.

**In This Project:** The entire framework is Markdown-as-Code. Skills are SKILL.md files, workflows are workflow.md files, agents are agent.md files. Claude reads and executes specifications at runtime. `story.md` with YAML frontmatter is the work unit specification.

**Key Rule:** Update features exclusively through spec edits, not ad-hoc re-prompting.

---

### 4.1.7 Iterative Multi-Agent Brainstorming

**Category:** Orchestration & Control
**Source(s):** My-Brain-Is-Full-Crew | agentic-patterns.com: Iterative Multi-Agent Brainstorming
**Principle(s):** Separation of Concerns
**Layer(s):** DD, CAS

**Definition:** Deploy multiple independent agent instances in parallel on the same task. Each agent tackles the problem from distinct perspectives. A coordinator synthesizes outputs to identify themes and select promising concepts. Heterogeneous agents achieve higher creativity scores.

**In This Project:** Refinement cross-talk: up to 3 discussion rounds between Architect, Developer, and QA agents. Blocker classification and early-exit-on-consensus. `synthesis` skill merges accepted perspectives. `feedback-collection` skill tracks accept/reject per agent.

**Key Rule:** Each agent must have a distinct role and perspective; never duplicate the same viewpoint.

---

### 4.1.8 Hierarchical Delegation

**Category:** Orchestration & Control
**Source(s):** OpenAgentsControl
**Principle(s):** Bounded Authority, Separation of Concerns
**Layer(s):** DD, DCL

**Definition:** Specialized sub-agents (CodeReviewer, TestEngineer, BuildAgent) for specific concerns. Sub-agents remain subject to approval gates. Delegation follows the principle that authority flows downward but accountability flows upward.

**In This Project:** Planned for Phase 4. Security Reviewer, UX Reviewer, and Contract Validator agents will be delegated specialized review tasks by the dispatcher.

**Key Rule:** Every delegated agent inherits the approval gates of its parent scope.

---

### 4.1.9 Signal-Based Coordination

**Category:** Orchestration & Control
**Source(s):** My-Brain-Is-Full-Crew
**Principle(s):** Separation of Concerns, Adaptive Workflow Depth
**Layer(s):** DD

**Definition:** Agents communicate intent to dispatcher through structured output sections (e.g., `### Suggested next agent`). Dispatcher chains agents when one detects work for another. Enables automatic agent chaining without hardcoded sequences.

**In This Project:** Planned for Phase 4. Dispatcher will use signals from agent outputs to determine next phase and agent selection based on story type, risk, and domain.

**Key Rule:** Agents signal, dispatcher decides. No agent may directly invoke another agent.

---

# 4.2 Context & Memory

### 4.2.1 Filesystem-Based Agent State

**Category:** Context & Memory
**Source(s):** MemoryCore, GSD | agentic-patterns.com: Filesystem-Based Agent State
**Principle(s):** Persistent Memory
**Layer(s):** DM, DV

**Definition:** Agents externalize progress by writing intermediate results to files, creating durable checkpoints. Enables resumable execution with deterministic failure recovery. Humans can examine checkpoints, compare outputs, and pinpoint divergence. Core implementation: check for existing checkpoint before each step.

**In This Project:** All framework state is file-based: story YAML frontmatter tracks status, `_scrum-output/` contains all generated artifacts, `config.yaml` stores configuration. No database. No external service dependency.

**Key Rule:** Every significant state change must be persisted to a file before proceeding.

---

### 4.2.2 Context-Minimization

**Category:** Context & Memory
**Source(s):** GSD, OpenAgentsControl | agentic-patterns.com: Context-Minimization Pattern
**Principle(s):** Persistent Memory, Adaptive Workflow Depth
**Layer(s):** DM, RAL

**Definition:** Staged pipeline: ingest untrusted input, transform into safe intermediate form, purge original tainted material, execute using only trusted artifacts. Reduces context window consumption and prevents delayed injection vulnerabilities.

**In This Project:** Token budgets configured per platform in `config.yaml` (coordination max 4000, sub-agent max 2000). Agents receive isolated context — no agent sees other role definitions. Write boundary rules limit scope.

**Key Rule:** Treat context as a staged pipeline: ingest, transform, purge, execute.

---

### 4.2.3 Layered Memory Architecture

**Category:** Context & Memory
**Source(s):** MemoryCore
**Principle(s):** Persistent Memory
**Layer(s):** DM

**Definition:** Three memory tiers: Persistent storage (Markdown files with YAML frontmatter), Working memory (session-level RAM), Long-term knowledge (consolidated facts). Different layers activate at different phases. Session-based resets for working memory while maintaining format consistency.

**In This Project:** Planned for Phase 2. `_scrum-output/memory/` with subdirectories: `decisions/`, `sessions/`, `risks/`. File-based retrieval via filename and YAML frontmatter tags. No vector store in MVP.

**Key Rule:** Memory must support continuity, not replace governance.

---

### 4.2.4 Memory Synthesis from Execution Logs

**Category:** Context & Memory
**Source(s):** MemoryCore | agentic-patterns.com: Memory Synthesis from Execution Logs
**Principle(s):** Persistent Memory
**Layer(s):** DM, DV

**Definition:** Two-tier memory: Task diaries capture structured logs (attempts, failures, successes). Synthesis agents periodically analyze logs to extract generalizable patterns appearing 3+ times. Reflexion (NeurIPS 2023) validates this approach.

**In This Project:** Planned for Phase 6. Memory Librarian Agent will consolidate raw notes into approved facts. Distinction between temporary findings, proposed facts, and stable knowledge. Pattern detection across projects.

**Key Rule:** Individual logs stay raw; only synthesized patterns become stable knowledge.

---

### 4.2.5 Episodic Memory Retrieval

**Category:** Context & Memory
**Source(s):** MemoryCore, Obsidian Mind
**Principle(s):** Persistent Memory
**Layer(s):** DM

**Definition:** Past experiences retrieved and injected based on relevance to current task. Keyword-based search with multi-level fallback prevents hallucination when memory is incomplete. Graceful degradation when memory is partial.

**In This Project:** Planned for Phase 2-6. Decision records retrievable by ticket-ID and tag. Risk notes loaded as context during review. Session summaries loaded via `/session-start`.

**Key Rule:** Retrieve with fallback; never hallucinate missing memory.

---

# 4.3 Feedback Loops

### 4.3.1 Spec-As-Test Feedback Loop

**Category:** Feedback Loops
**Source(s):** agentic-patterns.com: Spec-As-Test Feedback Loop
**Principle(s):** Spec-First, Plan-First
**Layer(s):** DC, DCL

**Definition:** Generate executable tests directly from specifications. Automated synchronization cycle: watch for spec/code commits, auto-regenerate test suite, route failures to fixes or escalation. Four-phase architecture: Specification Layer → Test Generation → Execution → Feedback.

**In This Project:** Planned for Phase 3. `/scrum-verify` command will run automated checks (tests, lint, build) and generate `verification_report`. Verification becomes mandatory before review.

**Key Rule:** Spec changes must trigger test regeneration; test failures must trace back to spec.

---

### 4.3.2 Self-Critique Evaluator Loop

**Category:** Feedback Loops
**Source(s):** agentic-patterns.com: Self-Critique Evaluator Loop
**Principle(s):** Separation of Concerns, Human Gate
**Layer(s):** DCL

**Definition:** Separate evaluator judges output quality using synthetic data bootstrapping. Dual-model variant uses a separate critic. Safeguards: decouple evaluation and generation prompts, introduce adversarial examples, maintain human-labeled benchmark set.

**In This Project:** `/scrum-review-story` uses a separate model from the implementer. 5 review criteria produce `approved` or `changes-needed`. The review is a genuine independent evaluation, not self-assessment.

**Key Rule:** The evaluator must never be the same agent or model instance that produced the output.

---

### 4.3.3 AI-Assisted Code Review

**Category:** Feedback Loops
**Source(s):** agentic-patterns.com: AI-Assisted Code Review / Verification
**Principle(s):** Separation of Concerns, Human Gate
**Layer(s):** DCL

**Definition:** Automated review feedback mechanisms where a dedicated review agent evaluates code against structured criteria. Findings categorized by severity. Review is an independent verification step, not a rubber stamp.

**In This Project:** `/scrum-review-story` produces review artifacts (`review-N.md`) with findings categorized as critical/major/minor. `changes-needed` triggers re-implementation cycle. Multiple review rounds tracked.

**Key Rule:** Review findings must be structured, severity-classified, and trigger actionable workflow transitions.

---

# 4.4 Security & Safety

### 4.4.1 Tool Capability Compartmentalization

**Category:** Security & Safety
**Source(s):** agentic-patterns.com: Tool Capability Compartmentalization
**Principle(s):** Bounded Authority, Separation of Concerns
**Layer(s):** CAS, DCL

**Definition:** Decompose monolithic tools into isolated micro-tools organized by capability class: readers, processors, writers. Require explicit consent when chaining across boundaries. Run each class in subprocess sandboxes with scoped credentials. Prevents the "lethal trifecta" (private-data reader + web fetcher + system writer).

**In This Project:** Write boundary rules define per-phase read/write zones. Agents receive isolated context (no agent sees other role definitions). Tool access is scoped per agent role in config.

**Key Rule:** Never combine private-data reading, untrusted input processing, and external writing in one agent.

---

### 4.4.2 Versioned Constitution Governance

**Category:** Security & Safety
**Source(s):** OpenAgentsControl | agentic-patterns.com: Versioned Constitution Governance
**Principle(s):** Human Gate, Bounded Authority
**Layer(s):** DCL

**Definition:** Governance rules stored in version-controlled files (YAML/TOML/Markdown in Git). Cryptographically signed commits. Agents may propose modifications but only designated gatekeepers merge. Semantic versioning: MAJOR for safety shifts, MINOR for new rules, PATCH for wording.

**In This Project:** All skills, workflows, and agent definitions are version-controlled Markdown. `schema_version` field in YAML frontmatter. CLI installer validates integrity via lock file. Framework updates go through install/update/validate cycle.

**Key Rule:** Governance rules are code — they must be versioned, reviewed, and never modified at runtime by agents.

---

### 4.4.3 Policy Enforcement Layer

**Category:** Security & Safety
**Source(s):** OpenAgentsControl
**Principle(s):** Human Gate, Bounded Authority
**Layer(s):** DCL

**Definition:** Editable governance rules in Markdown (not hardcoded). Organizations encode quality standards, security rules, and architecture constraints as human-readable, editable files. Policy checks fire before critical operations.

**In This Project:** `status-guard-validation` skill checks status before every command. `prerequisite-validation` skill checks artifact existence. Write boundary rules documented per phase. All rules are in SKILL.md files that Claude reads and enforces at runtime.

**Key Rule:** Policy rules must be human-readable, editable, and enforced before execution — never after.

---

# 4.5 UX & Collaboration

### 4.5.1 Human-in-the-Loop Approval Framework

**Category:** UX & Collaboration
**Source(s):** OpenAgentsControl | agentic-patterns.com: Human-in-the-Loop Approval Framework
**Principle(s):** Human Gate
**Layer(s):** DCL, DC

**Definition:** Gated execution with mandatory human checkpoints at critical junctures. Insert checkpoints at schema modifications, deployment actions, external writes. Track autonomy success rate and intervention frequency.

**In This Project:** Approval workflow and template exist. Status `approved → done` only via human action. `/scrum-approve` command planned for Phase 1. Rejection flow cycles story back to `changes-needed`.

**Key Rule:** No story reaches `done` without explicit human approval.

---

### 4.5.2 Agent-Friendly Workflow Design

**Category:** UX & Collaboration
**Source(s):** GSD | agentic-patterns.com: Agent-Friendly Workflow Design
**Principle(s):** Adaptive Workflow Depth
**Layer(s):** DD, RAL

**Definition:** Provide clear, high-level goals rather than prescriptive step-by-step instructions. Allow agents latitude in implementation choices. Separate planning from execution. Establish explicit interaction contracts for approvals and escalations.

**In This Project:** 14 workflows define high-level orchestration, not implementation details. Agents receive role definitions and constraints, not line-by-line instructions. `guided-mode` skill activates only for vague inputs.

**Key Rule:** Define what to achieve and what boundaries to respect; let the agent determine how.

---

### 4.5.3 Minimal Viable Information (MVI)

**Category:** UX & Collaboration
**Source(s):** OpenAgentsControl
**Principle(s):** Adaptive Workflow Depth, Bounded Authority
**Layer(s):** RAL, DM

**Definition:** Context files stay under 200 lines. Lazy loading reduces token overhead ~80%. Agents receive only the information they need for their current task. Prevents context pollution and token waste.

**In This Project:** Token budgets configured in `config.yaml`: coordination max 4000 tokens, sub-agent max 2000 per platform. Agent context is isolated — Architect agent doesn't see Developer agent's role definition. Domain detection loads only relevant domain context.

**Key Rule:** Load context just-in-time; never pre-load everything "just in case."
