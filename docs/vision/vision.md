# VISION.md

# Dynamic Scrum Intelligence Framework

**Spec-First • Multi-Agent • Memory-Driven • Human-Governed**

---

# 1. Vision

Dynamic Scrum Intelligence Framework is an **AI-governed delivery system for software teams**.

Its purpose is to make **AI-assisted software delivery structured, traceable, context-aware, and safe enough for real engineering workflows**.

> In one sentence: A spec-first, memory-driven, multi-agent delivery system that helps teams use AI in software development without losing control, context, traceability, or engineering discipline.

---

# 2. The Problem We Are Solving

Modern AI coding tools are powerful, but in real projects they create delivery chaos:

- implementation starts too early, requirements are vague
- architecture context is missing
- security, QA, UX, and DevOps are considered too late
- AI works outside of intended boundaries
- decisions disappear between sessions
- reviews are inconsistent
- long AI sessions degrade in quality
- teams lose trust because work is not inspectable

**We optimize for:** controlled delivery, explicit artifacts, phase-based execution, context preservation, reviewable outputs, human trust, sustainable AI collaboration.

**We do NOT optimize for:** maximum autonomy, "vibe-coding", one giant super-agent, hidden AI behavior, chat history as source of truth.

---

# 3. What This Project Is — and Is Not

**Is:**
- an AI-governed delivery framework
- a spec-first software workflow system
- a multi-agent orchestration layer for engineering work
- a delivery memory system with human-readable knowledge surfaces

**Is NOT:**
- a generic chatbot or personal AI companion
- an autonomous "do everything" agent
- a simple prompt collection or scrum board with AI labels
- a markdown vault pretending to be a workflow engine

**Clarification:** Chat is an intake surface. The vault is a knowledge surface. The core system is the execution and governance authority. Humans remain responsible for approvals and critical delivery decisions.

---

# 4. Core Philosophy

Seven non-negotiable principles.

## 4.1 Spec-First

No implementation without clear specification: scope, acceptance criteria, impacted systems, known risks, expected artifacts.

## 4.2 Plan-First

No implementation without an explicit plan: affected components, approach, test strategy, risks, non-goals, rollback idea.

## 4.3 Separation of Concerns

One agent should not do everything. Different perspectives (architecture, QA, security, UX, DevOps) must be separated into specialized agents.

## 4.4 Human Gate

Critical transitions require human control. No AI agent may mark critical work as done, silently accept risk, approve release-critical work, or override governance rules.

## 4.5 Bounded Authority

Every agent operates within explicit read/write boundaries and may only act inside its phase and policy constraints.

## 4.6 Persistent Project Memory

The system must remember decisions, risks, review patterns, architecture knowledge, delivery lessons, and active context across sessions.

## 4.7 Adaptive Workflow Depth

Not every task goes through the same process weight. A UI text fix should not receive the same treatment as auth changes or schema migrations. The workflow adapts to task type, complexity, and risk.

---

# 5. Product Promise

> Make AI-assisted software delivery team-safe.

- Reduce chaos between idea, refinement, implementation, and review
- Prevent AI from working without context or discipline
- Preserve decisions and delivery knowledge
- Activate the right expertise at the right time
- Keep humans in control without killing productivity

---

# 6. The Unique Value

Many AI tools help generate code. Very few help teams **govern delivery**.

This framework combines: formal workflow control, dynamic expert routing, persistent project memory, bounded AI authority, human-readable knowledge surfaces, human approval gates, execution discipline, and verification as a first-class step.

**The real differentiator:** This system does not try to make AI more free. It tries to make AI more reliable, inspectable, reusable, disciplined, and team-safe inside real engineering delivery.

---

# 7. System Architecture (Overview)

The system is built as **seven cooperating layers**:

| Layer | Purpose |
|-------|---------|
| **Delivery Core** | Work units, states, transitions, contracts, required artifacts, approval rules |
| **Capability & Agent System** | Capabilities (e.g. `backend.spring-boot`, `security.auth`), agent packs, role definitions, tool eligibility by phase |
| **Delivery Dispatcher** | Orchestration: which agents, in which order, with which context, under which conditions |
| **Delivery Control Layer** | Enforcement: no implementation without plan, no transition without approval, no writing outside boundaries |
| **Delivery Memory** | Persistent intelligence: decisions, risks, review findings, lessons learned, session summaries |
| **Delivery Vault / Human Surface** | Human-readable linked artifacts: work unit context, decision records, review reports, audit surfaces |
| **Runtime Adapter Layer** | Environment integration: Claude Code, Cursor, GitHub Copilot, Windsurf, OpenCode |

> For detailed specifications of work units, artifacts, agents, memory model, and dispatcher logic, see [PROJECT_REFERENCE.md](./project_reference.md).

---

# 8. Design Influences

| Source | What We Take |
|--------|-------------|
| **Hermes** | Capability-based modularity, agent packs, skill-oriented structure, extensibility |
| **Chiron** | Formal work units, contracts, artifact slots, bounded authority, workflow-to-transition thinking |
| **MemoryCore** | Decision memory, session memory, consolidation, retrieval, project knowledge library |
| **Obsidian Mind** | Delivery vault thinking, session lifecycle, natural input → structured routing, linked knowledge surfaces |
| **My-Brain-Is-Full-Crew** | Dispatcher/crew orchestration, guided setup, agents vs skills separation, agent scratch memory |
| **OpenAgentsControl** | Plan-first execution, approval-based execution, just-in-time context loading, delegation rules |
| **GSD** | Context-rot awareness, fresh context windows, atomic work execution, verification as first-class step, host-neutral runtime |

---

# 9. Final Statement

> Dynamic Scrum Intelligence Framework is a spec-first, memory-driven, human-governed delivery intelligence system that coordinates specialized AI agents, preserves engineering context, enforces disciplined execution, and helps software teams deliver work with more structure, continuity, trust, and control.
