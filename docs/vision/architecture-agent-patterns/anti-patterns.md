# Anti-Pattern Catalog

# Dynamic Scrum Intelligence Framework

> Back to [Index](./index.md)

---

# 5. What NOT to Do

These anti-patterns violate the framework's core principles. Every agent and contributor must avoid them.

| # | Anti-Pattern | Violates | Description | What To Do Instead |
|---|-------------|----------|-------------|-------------------|
| 1 | **Unbounded Agent Scope** | SoC, BA | One agent performs research, planning, implementation, and review in one session. Context contamination degrades all outputs. | Spawn specialized sub-agents with isolated context and scoped tool access. Use Discrete Phase Separation. |
| 2 | **Chat History as Source of Truth** | PM | Decisions, risks, and architectural knowledge exist only in conversation history. Knowledge is lost between sessions, cannot be searched or audited. | Externalize all decisions as persistent artifacts (decision_record, risk_note). Use Filesystem-Based Agent State. |
| 3 | **Premature Implementation** | SF, PF | Starting code before specification and plan are validated and approved. Acceptance criteria invented retroactively. Requirements interpreted on the fly. | Enforce Spec-First: complete story.md with acceptance criteria. Enforce Plan-First: approved plan.md before any code. |
| 4 | **Self-Validation** | SoC, HG | The implementation agent reviews its own work. No independent perspective. Confirmation bias produces false confidence. | Use a separate model or agent instance for review. Self-Critique Evaluator Loop with decoupled evaluation. |
| 5 | **Context Stuffing** | AWD, BA | Loading entire project context into every agent invocation. Wastes tokens, introduces noise, creates prompt injection surface, slows response. | Apply Minimal Viable Information (MVI). Load context just-in-time. Token budgets per platform. Lazy loading. |
| 6 | **Silent Risk Acceptance** | HG | Agent encounters uncertainty or risk and proceeds without flagging to human. Risk is absorbed invisibly. Trust erodes when problems surface later. | Every risk must be surfaced as a risk_note artifact. Human decides whether to accept, mitigate, or block. |
| 7 | **Monolithic Workflow** | AWD | Every task goes through identical full process (6 phases, 3 agents, full review). Trivial changes are over-processed. Team loses trust in system efficiency. | Classify stories by type and risk. Apply Adaptive Workflow Depth: Light/Standard/Heavy based on risk level. |
| 8 | **Mutable Contracts** | SF | Weakening acceptance criteria during validation. Agent modifies the spec to make its output pass. Tests deleted rather than code fixed. | Feature List as Immutable Contract. Agents can only set `passes: true`, never modify criteria, delete features, or mark items N/A. |
| 9 | **Orphaned Decisions** | PM | Architectural or design decisions made during refinement or implementation but never recorded. Same discussions repeat across sessions. | Capture every decision as a `decision_record` artifact with alternatives, rationale, and impact. Auto-extract from refinement feedback. |
| 10 | **Platform-Coupled Logic** | RAL | Workflow definitions that only work on one AI runtime. Framework features hardcoded to Claude Code specifics. No adapter abstraction. | Runtime Neutrality: core framework must not depend on a single AI runtime. Platform-specific logic in adapter layer only. |
| 11 | **Uncontrolled State Transitions** | DC | Manual edits bypass status guard. Story jumps from `draft` to `in-progress` without refinement or planning. No transition log, no tamper detection. | State Machine with guards. `status-guard-validation` skill on every command. Status history with hash-check for tamper detection. |
| 12 | **Invisible Delegation** | HG, BA | Sub-agent spawned without clear authority boundaries, tool restrictions, or task scope. Parent agent cannot trace what sub-agent did or why. | Every sub-agent must have explicit task description, scoped tool access, and isolated context. Results must be traceable. |

---

## Quick Decision Guide

**Before any agent action, ask:**

1. **Do I have a spec?** → If no: STOP. Spec-First violation.
2. **Do I have a plan?** → If no: STOP. Plan-First violation.
3. **Am I working within my boundaries?** → If unsure: CHECK. Bounded Authority risk.
4. **Am I recording my decisions?** → If no: RECORD. Persistent Memory violation.
5. **Does a human need to approve this?** → If unsure: ASK. Human Gate applies.
6. **Is the process weight appropriate?** → If one-liner getting full review: ADAPT. Adaptive Workflow Depth.
