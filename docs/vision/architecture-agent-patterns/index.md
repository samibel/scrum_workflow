# Architecture & Agent Patterns Reference

# Dynamic Scrum Intelligence Framework

**Version:** 1.0
**Date:** 2026-04-06
**Status:** Active Reference
**Audience:** AI Agents, Developers, Contributors, Integrators

---

# 0. Purpose & How to Use This Document

This is the single source of truth for architecture and agent patterns used in the Dynamic Scrum Intelligence Framework. It maps patterns from 7 inspiration repositories and the [Awesome Agentic Patterns](https://github.com/nibzard/awesome-agentic-patterns) catalog to the project's 7 Vision Principles and 7 Architecture Layers.

**Use cases:**
- An agent needs to know which pattern applies to its current task
- A developer wants to understand why a pattern was chosen
- Someone needs to check what NOT to do

**Navigation:**
- [Vision Principle Mapping](./vision-principle-mapping.md) — Given a principle, which patterns apply?
- [Architecture Layer Mapping](./architecture-layer-mapping.md) — Given a layer, which patterns apply?
- [Pattern Catalog](./pattern-catalog.md) — Detailed definition of each pattern
- [Anti-Patterns](./anti-patterns.md) — What NOT to do
- [Source Attribution](./source-attribution.md) — Repo links and external pattern references
- [Cross-Reference Index](./cross-reference-index.md) — Alphabetical lookup

---

# 1. Quick-Reference Matrix

## Legend

**Vision Principles:** SF=Spec-First | PF=Plan-First | SoC=Separation of Concerns | HG=Human Gate | BA=Bounded Authority | PM=Persistent Memory | AWD=Adaptive Workflow Depth

**Architecture Layers:** DC=Delivery Core | CAS=Capability & Agent System | DD=Delivery Dispatcher | DCL=Delivery Control Layer | DM=Delivery Memory | DV=Delivery Vault | RAL=Runtime Adapter Layer

**Status:** `active` = used in v1.2.0 | `planned` = on roadmap | `reference` = documented, not yet scheduled

## Orchestration & Control

| Pattern | Principle(s) | Layer(s) | Source: Repo | Source: agentic-patterns.com | Status |
|---------|-------------|----------|-------------|------------------------------|--------|
| Plan-Then-Execute | PF | DCL, DD | OpenAgentsControl, GSD | Plan-Then-Execute Pattern | active |
| Inversion of Control | HG, BA | DCL, DD | OpenAgentsControl | Inversion of Control | active |
| Discrete Phase Separation | PF, AWD | DD, RAL | GSD | Discrete Phase Separation | active |
| Sub-Agent Spawning | SoC | CAS, DD | Hermes, My-Brain-Is-Full-Crew | Sub-Agent Spawning | active |
| Feature List as Immutable Contract | SF | DC, DCL | -- | Feature List as Immutable Contract | active |
| Specification-Driven Agent Development | SF | DC | -- | Specification-Driven Agent Development | active |
| Iterative Multi-Agent Brainstorming | SoC | DD, CAS | My-Brain-Is-Full-Crew | Iterative Multi-Agent Brainstorming | active |
| Hierarchical Delegation | BA, SoC | DD, DCL | OpenAgentsControl | -- | planned |
| Signal-Based Coordination | SoC, AWD | DD | My-Brain-Is-Full-Crew | -- | planned |

## Context & Memory

| Pattern | Principle(s) | Layer(s) | Source: Repo | Source: agentic-patterns.com | Status |
|---------|-------------|----------|-------------|------------------------------|--------|
| Filesystem-Based Agent State | PM | DM, DV | MemoryCore, GSD | Filesystem-Based Agent State | active |
| Context-Minimization | PM, AWD | DM, RAL | GSD, OpenAgentsControl | Context-Minimization Pattern | active |
| Layered Memory Architecture | PM | DM | MemoryCore | -- | planned |
| Memory Synthesis from Execution Logs | PM | DM, DV | MemoryCore | Memory Synthesis from Execution Logs | planned |
| Episodic Memory Retrieval | PM | DM | MemoryCore, Obsidian Mind | -- | planned |

## Feedback Loops

| Pattern | Principle(s) | Layer(s) | Source: Repo | Source: agentic-patterns.com | Status |
|---------|-------------|----------|-------------|------------------------------|--------|
| Spec-As-Test Feedback Loop | SF, PF | DC, DCL | -- | Spec-As-Test Feedback Loop | planned |
| Self-Critique Evaluator Loop | SoC, HG | DCL | -- | Self-Critique Evaluator Loop | active |
| AI-Assisted Code Review | SoC, HG | DCL | -- | AI-Assisted Code Review / Verification | active |

## Security & Safety

| Pattern | Principle(s) | Layer(s) | Source: Repo | Source: agentic-patterns.com | Status |
|---------|-------------|----------|-------------|------------------------------|--------|
| Tool Capability Compartmentalization | BA, SoC | CAS, DCL | -- | Tool Capability Compartmentalization | reference |
| Versioned Constitution Governance | HG, BA | DCL | OpenAgentsControl | Versioned Constitution Governance | reference |
| Policy Enforcement Layer | HG, BA | DCL | OpenAgentsControl | -- | planned |

## UX & Collaboration

| Pattern | Principle(s) | Layer(s) | Source: Repo | Source: agentic-patterns.com | Status |
|---------|-------------|----------|-------------|------------------------------|--------|
| Human-in-the-Loop Approval Framework | HG | DCL, DC | OpenAgentsControl | Human-in-the-Loop Approval Framework | active |
| Agent-Friendly Workflow Design | AWD | DD, RAL | GSD | Agent-Friendly Workflow Design | active |
| Minimal Viable Information (MVI) | AWD, BA | RAL, DM | OpenAgentsControl | -- | active |

---

> For detailed pattern definitions, see [Pattern Catalog](./pattern-catalog.md).
> For what NOT to do, see [Anti-Patterns](./anti-patterns.md).
