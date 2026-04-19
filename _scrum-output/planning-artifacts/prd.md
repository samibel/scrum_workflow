---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - docs/index.md
  - docs/project-overview.md
  - docs/source-tree-analysis.md
  - docs/architecture-cli-installer.md
  - docs/architecture-framework.md
  - docs/development-guide.md
  - docs/integration-architecture.md
  - docs/vision/vision.md
  - docs/vision/PRD.md
  - docs/vision/ROADMAP.md
  - docs/vision/quelle.md
  - docs/vision/project_reference.md
  - docs/vision/architecture-agent-patterns/index.md
  - docs/vision/architecture-agent-patterns/vision-principle-mapping.md
  - docs/vision/architecture-agent-patterns/architecture-layer-mapping.md
  - docs/vision/architecture-agent-patterns/pattern-catalog.md
  - docs/vision/architecture-agent-patterns/anti-patterns.md
  - docs/vision/architecture-agent-patterns/source-attribution.md
  - docs/vision/architecture-agent-patterns/cross-reference-index.md
  - scrum_workflow/workflows/project-context.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 20
classification:
  projectType: AI-Governed Delivery Operating System (Developer Tool / Framework)
  domain: Software Development / AI Agent Orchestration
  complexity: High — Self-Evolving (7-Layer Architecture, agents grow from 3 to 8+)
  projectContext: brownfield
  coreDimensions:
    - Delivery OS — structures the entire delivery lifecycle end-to-end
    - Governance — bounded authority, human gates, policy enforcement, audit trails
    - Multi-Agent Orchestration — dynamic dispatching, isolated agent contexts, cross-talk
    - Persistent Memory — decisions, risks, sessions, consolidation across sessions
  dualPerspective:
    - Developer as End-User (uses slash-commands)
    - System as Orchestrator (controls agents, memory, workflows)
  positioning: AI-Governed Delivery OS — governance layer for AI-assisted software delivery
  paradigm: Markdown-as-Code — skills/workflows/agents are SKILL.md files, Claude is runtime
workflowType: 'prd'
---

# Product Requirements Document - scrum_workflow

**Author:** Sami
**Date:** 2026-04-06

## Executive Summary

**"The framework that makes AI-assisted software delivery trustworthy."**

### The Real Problem

AI writes good code. But without structure, you can't verify whether it was produced at the right time, from the right context, with the right review. Decisions vanish between sessions. No audit trail exists. No one approved anything. Trust erodes — not because the code is bad, but because the process is opaque. The accumulation of untraceable AI actions creates a fundamental question: **Can I trust the delivery process in which AI writes code?** Without structure, the answer is no.

### The Turn

Most tools try to solve this by giving AI more power. This framework takes the opposite approach: **giving AI more discipline**.

### What Makes This Special

The market trend is "make AI more autonomous." This system takes the philosophical counter-position: make AI more reliable, inspectable, reusable, disciplined, and team-safe inside real engineering delivery. Every AI action produces a human-readable, auditable artifact — because trust requires transparency, not promises.

### Current State (v1.2.0)

10 slash-commands, 3 refinement agents, 7 skills, 14 workflows, 9-state story lifecycle with guards. All implemented as Markdown-as-Code — Claude reads and executes SKILL.md specifications at runtime. Distributed via npm CLI installer supporting 6 AI coding platforms.

## Project Classification

| Dimension | Value |
|-----------|-------|
| **Project Type** | AI-Governed Delivery Operating System (Developer Tool / Framework) |
| **Domain** | Software Development / AI Agent Orchestration |
| **Complexity** | High — Self-Evolving (7-Layer Architecture, agents grow from 3 to 8+) |
| **Project Context** | Brownfield (v1.2.0) |
| **Paradigm** | Markdown-as-Code — no backend, no database, AI assistant is runtime |
| **Core Dimensions** | Delivery OS · Governance · Multi-Agent Orchestration · Persistent Memory |

**Today:** Your AI assistant gets structure, memory, and discipline.
**Tomorrow:** Your team can trust AI-assisted delivery.

## Success Criteria

### System Correctness

| ID | Criterion | Measurement | Phase |
|----|-----------|-------------|-------|
| SC-1 | Story lifecycle runs end-to-end | 3 stories complete `draft → done` with all artifacts generated | Phase 1 |
| SC-2 | Zero invalid state transitions | No story reaches an invalid state when using slash-commands | Phase 1 |
| SC-3 | Human approval is mandatory for completion | No story reaches `done` without explicit `/scrum-approve` | Phase 1 |
| SC-6 | Policy violations detected and blocked | System blocks at least 3 violation types (no plan, no verification, invalid transition) | Phase 3 |
| SC-15 | No silent failures | Every error produces an actionable error message. No command may leave inconsistent state silently. | Ongoing |
| SC-18 | Write boundary enforcement | No slash-command writes to files outside its defined write boundary. Implementation agent cannot modify story.md. Review agent cannot modify source code. | Phase 1 |

### Governance & Trust

| ID | Criterion | Measurement | Phase |
|----|-----------|-------------|-------|
| SC-7 | Audit trail complete | Every story has traceable transition history from draft to done | Phase 3 |
| SC-8 | Workflow adapts to risk | High-risk stories trigger extended refinement + security review automatically | Phase 4 |
| SC-11 | Artifact inspectability | Every generated artifact is human-readable Markdown, diffable, and Git-versionable. No binary formats, no opaque state. | Ongoing |
| SC-17 | Discipline pays off | Stories via `--depth light` that still get `changes-needed` trigger recommendation: "Consider standard depth for similar stories." System learns when Light is insufficient. | Phase 4+ |

### Memory & Continuity

| ID | Criterion | Measurement | Phase |
|----|-----------|-------------|-------|
| SC-4 | Decisions persist across sessions | Decision records created during approval are retrievable in next session | Phase 2 |
| SC-5 | Session continuity within 1 command | `/session-start` loads context of last session | Phase 2 |
| SC-13 | Retrieval performance at scale | File-based artifact search completes in under 10 seconds with 100+ artifacts in `_scrum-output/` | Phase 2 |
| SC-14 | "Exactly where I left off" | `/session-start` delivers: open work units + last decisions + active risks + next steps. Developer resumes in under 60 seconds. | Phase 2 |

### Adoption & Experience

| ID | Criterion | Measurement | Phase |
|----|-----------|-------------|-------|
| SC-9 | Time-to-first-value | Developer has a structured, refined ticket within 30 minutes of installation | Phase 1 |
| SC-10 | Zero-knowledge onboarding | `npx create-scrum-workflow@latest` + first `/scrum-create-ticket` without reading documentation | Phase 1 |
| SC-12 | Process bypass rate = 0 | No developer needs to bypass the framework to be productive (Adaptive Workflow Depth works) | Phase 4 |
| SC-12a | Manual depth override available | Developer can choose `--depth light` for low-risk tasks, `--depth standard` for default. No classifier needed. | Phase 1 (MVP) |
| SC-16 | Repeat usage | Developer completes 2+ stories using the framework within the first 2 weeks of adoption | Ongoing |
| SC-19 | Cross-platform parity | Framework features validated on Claude Code are also validated on at least 2 secondary platforms (Cursor, Windsurf) | Phase 7 |

## Product Scope

### MVP (v1.3.0 + v2.0.0, Phases 1-2)

Foundation hardening and memory. Phase 1 delivers standalone value as v1.3.0. Phase 2 adds persistence for the complete value proposition as v2.0.0.

**Phase 1 — Foundation Hardening (v1.3.0):**
- `/scrum-approve` command with approval artifacts
- Plan enforcement before implementation (`plan.md` existence check)
- Status history tracking with tamper detection
- Rejection flow (`changes-needed` cycle)
- Write boundary enforcement per command
- Manual depth override (`--depth light/standard`)
- 3 stories complete full `draft → done` lifecycle end-to-end
- End-to-end onboarding validation: install → first ticket → first refinement without documentation (SC-10)

**Phase 2 — Memory & Continuity (v2.0.0):**
- Decision records as standalone artifacts (auto-extracted from refinement feedback)
- Session start/wrap-up with memory (`/session-start`, `/wrap-up`)
- Risk notes with auto-extraction from Architect agent perspectives
- Memory storage: `_scrum-output/memory/` with subdirectories (`decisions/`, `sessions/`, `risks/`)
- Retrieval performance validation with 100+ test artifacts
- Minimum 5 decision records from real stories

### Growth (v3.0, Phases 3-4)

Governance and intelligence. The system enforces policy and adapts to risk.

**Phase 3 — Control & Observability:**
- Policy violation detection and enforcement
- Central audit trail per story
- Post-implementation verification (`/scrum-verify`)
- Sprint observability (`/sprint-status`, `/delivery-health`)
- At least 2 policy violations correctly detected and blocked

**Phase 4 — Adaptive Workflows:**
- Automatic story classification (type + risk level)
- Adaptive workflow depth: Light / Standard / Heavy (automated)
- Dynamic dispatcher with capability matching
- Extended agent types: Security Reviewer, UX Reviewer, Contract Validator
- Configurable risk thresholds in `config.yaml`

### Vision (Phases 5-7)

Full delivery operating system. Knowledge navigation, active memory, multi-platform, extensible.

- Delivery vault with linked knowledge navigation (Obsidian-compatible)
- Architecture Decision Records (ADRs) as artifact type
- Memory consolidation and active retrieval
- Pattern detection across projects
- Multi-runtime validation (Cursor, Windsurf, Copilot)
- Plugin system for custom agents and workflows
- Extended work units: epic, debug-investigation, architecture, release-check

## User Journeys

### UJ-1: Solo Developer Creates and Delivers a Story (Happy Path)

It's Monday morning. Alex has a feature in mind — a notification system for his app. Last time he just opened Claude and typed "build me notifications." Three hours later he had code that compiled, but half the edge cases were missing and there was no record of why he chose push over polling. This time he starts differently.

1. Developer runs `/scrum-create-ticket` with natural language description
2. System creates `story.md` with YAML frontmatter (status: `draft`)
3. Developer runs `/scrum-refine-ticket SW-XXX`
4. System spawns 3 agents in parallel with isolated context
5. Agents produce perspectives; cross-talk resolves blockers
6. Developer accepts/rejects each perspective; synthesis merges accepted items
7. Wideband Delphi produces estimation with confidence level
8. Developer runs `/scrum-refine-story SW-XXX` — 5-criterion validation gate
9. On PASS: `plan.md` generated, status → `ready-for-dev`
10. Developer runs `/scrum-dev-story SW-XXX` — implementation follows plan
11. Developer runs `/scrum-review-story SW-XXX` — separate model reviews against 5 criteria
12. On APPROVED: Developer runs `/scrum-approve SW-XXX` — creates approval artifact, status → `done`

**Success:** Complete story with all artifacts (story.md, refinement.md, plan.md, review-N.md, approval-N.md). Every decision traceable. Every artifact human-readable.

**Pain Points addressed:** #3 (no spec), #5 (everything at once)

### UJ-2: System Blocks Invalid Action (Guard Enforcement)

Alex is eager to start coding. He has a ticket in `draft` status and runs `/scrum-dev-story SW-XXX` — skipping refinement, skipping planning. The system doesn't let him.

1. Developer runs `/scrum-dev-story SW-XXX` on a story with status `draft`
2. `status-guard-validation` skill detects: status is `draft`, command requires `ready-for-dev`
3. System outputs error: "Story SW-XXX is in status 'draft', but '/scrum-dev-story' requires 'ready-for-dev'. Next step: run /scrum-refine-ticket SW-XXX."
4. Developer follows the correct sequence

**Success:** No story enters an invalid state through slash-commands. Error messages are actionable, not cryptic.

**Pain Points addressed:** #2 (no governance)

### UJ-3: Developer Resumes Work Next Session (Memory)

It's Wednesday morning. Alex opens a new Claude Code session. Last session he was deep in the auth system — JWT with refresh token rotation, three risk notes flagged, one decision pending review. But this is a fresh session. Claude doesn't remember anything. Or does it?

1. Developer runs `/session-start`
2. System loads last session summary: open stories, pending approvals, last actions
3. Developer sees: "SW-042 is in status `review`, waiting for your approval. Last decision: JWT with refresh-token rotation (DR-007). Open risk: rate-limiting not specified (RN-003)."
4. Developer continues exactly where they left off

**Success:** Zero context loss between sessions. Developer resumes in under 60 seconds (SC-14).

**Pain Points addressed:** #1 (decisions vanish between sessions)

### UJ-4: Review Finds Issues, Story Cycles Back (Rejection Flow)

Alex finishes implementing the Notifications feature and runs review. He feels confident — the code compiles, tests pass. But the review agent sees things he missed.

1. `/scrum-review-story SW-XXX` produces verdict: `changes-needed`
2. Review report details findings with severity (critical/major/minor): "Critical: No rate limiting on notification dispatch. Major: Missing error handling for FCM token expiration."
3. Status transitions to `changes-needed`
4. Developer runs `/scrum-dev-story SW-XXX` — re-implementation addressing findings. Previous review findings loaded as context.
5. Developer triggers review again
6. On APPROVED: proceeds to human approval

**Success:** Issues caught before delivery, full cycle tracked in artifacts. Review findings are specific, severity-classified, and connected to the next implementation cycle.

**Pain Points addressed:** #5 (no independent review)

### UJ-5: High-Risk Story Gets Extended Treatment (Adaptive Depth)

Alex creates a ticket involving authentication changes — JWT permissions, role-based access control, token refresh logic. This isn't a CSS fix. The system recognizes that.

1. `/scrum-create-ticket` — story mentions authentication, JWT, permissions
2. Story Classifier detects: type=Feature, risk=High, domain=security
3. Dispatcher selects Heavy workflow: extended refinement + Security Reviewer Agent
4. Refinement includes security-focused perspectives
5. Post-implementation verification includes security checks
6. Review includes Security Reviewer findings

**Success:** High-risk work receives proportionally deeper analysis. Low-risk bugfixes don't go through the same heavyweight process.

**Pain Points addressed:** #6 (same effort for bugfix as for auth changes)

**MVP note:** In MVP (Phase 1-2), adaptive depth is manual via `--depth light/standard`. Automatic classification comes in Phase 4.

### UJ-6: Developer's First Week (Adoption Gradient)

Alex heard about the Dynamic Scrum Intelligence Framework from a colleague. "It structures your AI coding workflow," they said. Alex is skeptical — he's productive with plain Claude. Why add process?

**Day 0: Installation (5 minutes)**
- `npx create-scrum-workflow@latest` — CLI detects Claude Code, installs framework
- Alex sees the installed commands. Doesn't read documentation.

**Day 1: First Ticket (30 minutes)**
- Alex runs `/scrum-create-ticket "Add user notification preferences to settings page"`
- System creates a structured story with acceptance criteria, impacted components, technical considerations
- Alex thinks: "Okay, that's actually better than my 3-sentence prompt."
- He runs `/scrum-refine-ticket SW-001`. Three agents give him architecture, implementation, and QA perspectives.
- Alex realizes: "The QA agent found an edge case I never would have thought of."

**Day 3: First Complete Cycle**
- Alex completes his first full story: create → refine → validate → implement → review → approve
- He has 5 artifacts for one feature. Every decision documented.
- He thinks: "This is more disciplined, but I actually trust what I built more."

**Day 7: Memory Kicks In**
- New session. Alex runs `/session-start`.
- System shows: "SW-001 is done. SW-002 is in status ready-for-dev. Decision DR-001: WebSockets chosen over SSE for real-time notifications."
- Alex thinks: "It remembers. That's the moment."

**Success:** Progressive value delivery. No Big Bang adoption. Each day delivers more value than the last. SC-9 (30-minute time-to-first-value) and SC-10 (zero-knowledge onboarding) validated.

### UJ-7: Research Survives and Informs Future Decisions

Alex wants to build a real-time Notifications system, but he's unsure about the technology. WebSockets? Server-Sent Events? Firebase Cloud Messaging? He doesn't want to make an uninformed decision that he'll regret in three months. So before creating any ticket, he researches.

**Phase 1: Research Before Ticket**
1. Alex runs `/scrum-research-technical "Push Notifications: WebSockets vs SSE vs Firebase Cloud Messaging"`
2. Research agent uses Plan-Then-Execute: creates research plan, then systematically investigates each option
3. Output: Research Report `RR-004` as persistent artifact in `_scrum-output/research/technical/`
4. Report contains: trade-offs, scalability comparison, cost analysis, complexity assessment, recommendation

**Phase 2: Research Informs Ticket**
5. Alex runs `/scrum-create-ticket "Real-time notification system using WebSockets"` — references RR-004
6. The ticket has well-founded acceptance criteria because the technical foundation was already researched
7. During `/scrum-refine-ticket`, the Architect agent loads RR-004 automatically and builds on the existing analysis

**Phase 3: Research Reused Across Stories (2 weeks later)**
8. Alex creates a new ticket: "Payment event streaming for order status updates"
9. During refinement, the Architect agent finds RR-004 and says: "WebSockets infrastructure was already evaluated for notifications (RR-004). Same infrastructure applicable for payment events? Consider shared WebSocket gateway."
10. Alex doesn't re-research. The system connected the dots.

**Success:** Research produces searchable, persistent artifacts. Memory links research to future stories. Knowledge compounds over time instead of being lost.

**Pain Points addressed:** #1 (decisions vanish), #4 (context rot — research context preserved across sessions)

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| UJ-1 | Ticket creation, Multi-Agent Refinement, Validation Gate, Implementation, Review, Approval |
| UJ-2 | Status Guards, Actionable Errors, State Machine Enforcement |
| UJ-3 | Session Memory, Context Loading, Work Unit Status Display |
| UJ-4 | Rejection Flow, Re-Implementation, Review Cycle Tracking, Artifact Versioning |
| UJ-5 | Story Classifier, Dispatcher, Security Agent, Workflow Depth Selection |
| UJ-6 | CLI Installer, Zero-Knowledge Onboarding, Quick Win Path, Progressive Value |
| UJ-7 | Research Commands, Research Artifacts, Memory Retrieval, Cross-Story Linking |

### Updated Lifecycle

```
[RESEARCH] → INTAKE → REFINEMENT → PLAN → EXECUTION → VERIFICATION → REVIEW → APPROVAL → MEMORY UPDATE
     ↑                                                                                          │
     └──────────────────────── Research artifacts feed into Memory ──────────────────────────────┘
```

Research is optional but when it happens, the output is a first-class artifact that persists, links, and informs future work.

### New Functional Requirement (from UJ-7)

**FR-Research:** Research Reports are standalone artifacts stored in `_scrum-output/research/` with YAML frontmatter (topic, tags, date, referenced-by). They are searchable by tag and topic. `/scrum-create-ticket` can reference a Research Report. Refinement agents automatically load relevant Research Reports as context based on domain and tag matching. Phase: Phase 2 (Memory).

## Innovation & Novel Patterns

### Core Innovation: Governance Without Infrastructure

A complete delivery governance system — state machines, approval gates, audit trails, policy enforcement — running entirely on Markdown specifications executed by an AI runtime. No server, no database, no SaaS. Governance scales with files, not with infrastructure.

### Paradigm Shift

| Traditional | This Framework |
|------------|---------------|
| Governance requires infrastructure | Governance requires only specifications |
| Rules compiled into code | Rules read by AI at runtime |
| State lives in databases | State lives in YAML frontmatter |
| Agents require orchestration servers | Agents orchestrated by AI itself |
| More governance = more complexity | More governance = more Markdown files |
| System-down = governance-down | Governance survives any system failure (Git-isolated) |

### Innovation Areas

1. **Markdown-as-Code as Runtime Paradigm** — The specification IS the implementation. Claude reads SKILL.md files and executes them. No compilation, no deployment, no build step.

2. **Philosophical Counter-Position** — "Make AI more disciplined, not more autonomous." Every other tool optimizes for AI freedom. This system optimizes for AI trustworthiness.

3. **Governance-First for AI Coding** — Governance is not a feature bolted on. Governance IS the product.

4. **Multi-Agent Orchestration Without Backend** — Three agents with isolated context, cross-talk, Wideband Delphi estimation — all in Markdown files, orchestrated by an AI assistant. No Temporal, no message queue, no server.

### Validation Approach

1. **"Markdown-as-Code Governance works reliably"** — Claude follows SKILL.md instructions consistently enough for real governance. Validated via E2E testing (Phase 1.4).

2. **"Zero-infra governance is team-safe enough"** — File-based state + YAML frontmatter + Git versioning provides sufficient audit trail and tamper detection.

3. **"The paradigm transfers to other runtimes"** — If Cursor/Windsurf/Copilot can execute the same Markdown specs, it's a real paradigm, not a Claude-specific feature.

### Worst-Case Safety

Even in the event of complete AI misexecution, all artifacts remain human-readable in Git. A developer can inspect state at any time, recognize errors, and manually correct. The framework degrades to "transparent Markdown files in Git", not to "opaque broken state in a database." Governance-by-Transparency as fallback for Governance-by-Execution. No other governance system offers this degradation path.

### Risk Mitigation

| Risk | If It Happens | Fallback |
|------|--------------|----------|
| Claude doesn't follow Skills reliably | Governance is porous, guards bypassed | E2E testing Phase 1.4, hash-based tamper detection (SC-2, SC-18) |
| Model Drift | Claude 5.0 interprets skills differently than 4.6 | `schema_version` field + validation skills that detect breaking changes + regression tests per model update |
| File-based state doesn't scale | Retrieval slow at 100+ artifacts | Evaluate after Phase 2 (Roadmap Decision R-001) |
| Paradigm is Claude-specific | No transfer to other runtimes | Runtime Adapter Layer validated Phase 7 (SC-19) |

## Developer Tool / Framework Requirements

### Language Matrix

| Language | Role | Format |
|----------|------|--------|
| Markdown | Skills, Workflows, Agents, Docs | `.md` files |
| YAML | State, Configuration, Frontmatter | Embedded in `.md` or `config.yaml` |
| JavaScript | CLI Installer only | `create-scrum-workflow` npm package |

Markdown is the language. Human-readable AND machine-readable. This is the entire trust argument (Winston: "Inspectability ohne Spezialtools"). No JSON specs, no YAML-only variants. If a platform can't read Markdown, it's not compatible — the framework doesn't adapt to platforms that can't read its specifications.

### API Surface — Command Naming Convention

**Three-tier command architecture:**

| Tier | Pattern | Example | Has Ticket Arg |
|------|---------|---------|---------------|
| Story-level | `/scrum-{verb}-{noun} SW-XXX` | `/scrum-refine-ticket SW-042` | Yes |
| Session-level | `/{verb}` | `/session-start`, `/wrap-up` | No |
| Sprint/System-level | `/{domain}-{noun}` | `/sprint-status`, `/delivery-audit` | No |

A developer knows immediately whether a command needs a ticket argument — by the prefix alone.

**Verb table:**

| Verb | Meaning | Examples |
|------|---------|----------|
| create | Generate new artifact | `/scrum-create-ticket`, `/scrum-create-project-context` |
| refine | Improve/validate existing | `/scrum-refine-ticket`, `/scrum-refine-story` |
| dev | Implement | `/scrum-dev-story` |
| review | Independent evaluation | `/scrum-review-story` |
| approve | Human gate | `/scrum-approve` (Phase 1) |
| verify | Post-implementation check | `/scrum-verify` (Phase 3) |
| research | Knowledge generation | `/scrum-research-technical`, `/scrum-research-general` |

### Command → Output Artifact Mapping

> See **FR-46** for the complete artifact contract with location specifications.

| Command | Output Artifact | Location |
|---------|----------------|----------|
| `/scrum-create-ticket` | `story.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-refine-ticket` | `refinement.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-refine-story` | `plan.md` + status change | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-dev-story` | Source code changes | Project source tree |
| `/scrum-review-story` | `review-N.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-approve` | `approval-N.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-research-*` | `RR-XXX.md` | `_scrum-output/memory/research/` |
| `/session-start` | Loads context | (no artifact created) |
| `/wrap-up` | `session-summary.md` | `_scrum-output/memory/sessions/` |

### Extension Model

The framework extends through files, not through registration. A new `SKILL.md` in the skills directory is a new capability. A new `agent.md` is a new agent. A new `workflow.md` is a new workflow. No configuration change, no build step, no service restart. Claude discovers new specifications at runtime.

This is one of the strongest consequences of Markdown-as-Code — the extension mechanism is the same as the implementation mechanism: write a file, and it exists.

### Status History Format

```yaml
status_history:
  - from: null
    to: draft
    timestamp: 2026-04-06T10:00:00Z
    trigger: /scrum-create-ticket
    actor: human
  - from: draft
    to: refined
    timestamp: 2026-04-06T11:30:00Z
    trigger: /scrum-refine-ticket
    actor: synthesis-skill
  - from: refined
    to: ready-for-dev
    timestamp: 2026-04-06T12:00:00Z
    trigger: /scrum-refine-story
    actor: readiness-check-skill
```

**Actor types:** `human` | `{agent-name}-agent` | `{skill-name}-skill`

**Tamper detection:** No `status_hash` field — it's security theater (same file edit = hash editable). Instead: `status_history` is append-only (entries added, never deleted) + Git diff shows every manual manipulation. If the last `status_history` entry has `trigger: manual-edit`, everyone knows it wasn't workflow-initiated.

### Installation Methods

| Method | Command | Use Case |
|--------|---------|----------|
| npx (recommended) | `npx create-scrum-workflow@latest` | Zero-install, one-command setup |
| npm global | `npm install -g create-scrum-workflow` | Repeated use across projects |
| Manual clone | Git clone + copy | Offline or customized installations |

**Time-to-first-value target:** 30 minutes (SC-9).

### Migration Strategy (v1.2.0 → v1.3.0)

**Breaking Changes:**

1. **New YAML field: `status_history`** — Existing stories without this field receive `trigger: "migrated-from-v1.2.0"` via CLI update.
2. **New mandatory check: `plan.md` before `/scrum-dev-story`** — Stories at `ready-for-dev` without `plan.md` must re-run readiness-check or create manual plan.

**Migration Command:** `npx create-scrum-workflow@latest update`

The update command: detects version → lists breaking changes → migrates YAML frontmatter automatically → warns on missing `plan.md` files → validates post-migration.

**FR-Migration:** CLI update command detects version, lists breaking changes, migrates YAML frontmatter automatically, and validates post-migration. No manual migration steps required for standard upgrades.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — validate that structured AI delivery governance works before building intelligence layers.

**Core Hypothesis:** "If Claude follows SKILL.md specifications reliably enough, file-based governance is sufficient for solo developers. If not, we need infrastructure." Phase 1 exists to test this hypothesis.

**Resource Requirements:** Solo developer + Claude Code. No team, no server, no budget.

### MVP Feature Set (Phase 1-2)

**Core User Journeys Supported:** UJ-1 (Happy Path), UJ-2 (Guard Enforcement), UJ-4 (Rejection Flow), UJ-6 (Adoption Gradient — Days 0-3), UJ-7 (Research → Ticket).

**Must-Have Capabilities:**

| Capability | Phase | SC Covered |
|-----------|-------|------------|
| `/scrum-approve` with approval artifacts | 1 | SC-3 |
| Plan enforcement before implementation | 1 | SC-1, SC-18 |
| Status history tracking (append-only) | 1 | SC-2 |
| Rejection flow (`changes-needed` cycle) | 1 | UJ-4 |
| Write boundary enforcement per command | 1 | SC-18 |
| Manual depth override (`--depth light/standard`) | 1 | SC-12a |
| CLI migration (v1.2.0 → v1.3.0) | 1 | FR-Migration |
| 3 stories complete full lifecycle E2E | 1 | SC-1 |
| End-to-end onboarding validation | 1 | SC-9, SC-10 |
| Decision records as standalone artifacts | 2 | SC-4 |
| Session start/wrap-up with memory | 2 | SC-5, SC-14 |
| Risk notes with auto-extraction | 2 | UJ-3 |
| Research artifacts + cross-story linking | 2 | UJ-7 |
| Retrieval performance validation (100+ artifacts) | 2 | SC-13 |

**MVP Success = 11 of 19 SC validated** (SC-1, SC-2, SC-3, SC-4, SC-5, SC-9, SC-10, SC-12a, SC-13, SC-14, SC-18)

### Post-MVP Features

**Phase 3 — Control & Observability (Growth):**

| Capability | SC Covered |
|-----------|------------|
| Policy violation detection + enforcement | SC-6, SC-15 |
| Central audit trail per story | SC-7 |
| Post-implementation verification (`/scrum-verify`) | UJ-4 extended |
| Sprint observability (`/sprint-status`, `/delivery-health`) | UJ-5 session-level |
| At least 2 policy violations correctly blocked | SC-6 |

**Phase 4 — Adaptive Workflows (Growth):**

| Capability | SC Covered |
|-----------|------------|
| Automatic story classification (type + risk) | SC-8 |
| Adaptive workflow depth (Light/Standard/Heavy) | SC-12 |
| Dynamic dispatcher with capability matching | UJ-5 |
| Extended agents: Security, UX, Contract Validator | Innovation Signal |
| Discipline-pays-off tracking (SC-17) | SC-17 |

### Vision Features (Phases 5-7)

| Capability | Phase | SC Covered |
|-----------|-------|------------|
| Delivery vault with linked navigation | 5 | Innovation |
| Architecture Decision Records | 5 | UJ-7 extended |
| Memory consolidation + active retrieval | 6 | SC-17 |
| Pattern detection across projects | 6 | Innovation |
| Multi-runtime validation (Cursor, Windsurf, Copilot) | 7 | SC-19 |
| Plugin system for custom agents/workflows | 7 | Extension Model |
| Extended work units (epic, debug, architecture, release-check) | 7 | Vision |

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Claude doesn't follow skills reliably | Medium | Critical (paradigm fails) | E2E testing Phase 1, SC-2 as smoke test, regression suite per model update |
| Model drift breaks skill interpretation | Low | High (silent governance failure) | `schema_version` + validation skills + regression tests per model update |
| File-based state doesn't scale | Medium | Medium (slow retrieval) | SC-13 benchmark at 100+ artifacts, evaluate after Phase 2 (Decision R-001) |

**Adoption Risks:**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Process too rigid for simple tasks | High | High (bypass → abandonment) | Manual `--depth light` in Phase 1, automatic in Phase 4, SC-12a |
| 30-minute onboarding fails | Low | Medium (lost users) | SC-10 validation task in Phase 1 |
| Developer reverts to vibe-coding | Medium | Medium (no repeat usage) | SC-16 tracks 2+ stories in 2 weeks, UJ-6 shows value gradient |

**Resource Risks:**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Solo developer bandwidth | High | Medium (slow delivery) | Phase 1 is hardening, not greenfield. Leverages existing codebase. |
| Claude API costs | Low | Low | Framework is local files. Only AI sessions cost tokens. No infra cost. |

## Functional Requirements

### Story Lifecycle Management

- FR-1: Developer can create a structured story from natural language input via `/scrum-create-ticket`
- FR-2: System generates story artifact with YAML frontmatter including ticket ID, status, type, risk level, and domain tags
- FR-3: Developer can specify workflow depth at creation time via `--depth light/standard` (Phase 1: manual, Phase 4: automatic)
- FR-4: System enforces a 9-state story lifecycle with guarded transitions: `draft → refined → ready-for-dev → in-progress → review → approved → done` with branch states `changes-needed` and `cancelled` (9 states total including branches)
- FR-5: Developer can approve a completed story via `/scrum-approve`, creating an approval artifact as mandatory gate before `done`
- FR-6: System supports rejection flow: `review → changes-needed → in-progress` with review findings loaded as context for re-implementation
- FR-7: System tracks all status transitions in an append-only `status_history` array with timestamp, trigger command, and actor identity

### State Machine & Guards

- FR-8: System blocks any command that would cause an invalid state transition, producing an actionable error message indicating required current status and next valid step
- FR-9: System enforces write boundaries per command: implementation agent cannot modify `story.md`, review agent cannot modify source code, no command writes outside its defined write boundary
- FR-10: System detects manual status field edits by recording trigger identity; `status_history` entries with `trigger: manual-edit` are visible to all participants
- FR-11: System never leaves inconsistent state silently; every error produces an actionable error message

### Multi-Agent Refinement

- FR-12: System spawns 3 parallel refinement agents (Architect, Developer, QA) with isolated context during `/scrum-refine-ticket`
- FR-13: Refinement agents produce independent perspectives covering architecture risks, implementation feasibility, and testability concerns
- FR-14: System facilitates cross-talk rounds between agents (up to 3 rounds) with blocker classification and early-exit-on-consensus
- FR-15: System synthesizes accepted agent perspectives into a unified refinement artifact, deduplicating overlapping findings
- FR-16: Developer can accept or reject each agent perspective individually, with decisions tracked in refinement artifact
- FR-17: System produces story point estimation using Wideband Delphi method (Fibonacci scale, variance threshold, re-estimation on high variance, median calculation, confidence level)

### Validation & Readiness

- FR-18: System validates story completeness via `/scrum-refine-story` against 5 immutable criteria (Feature List as Immutable Contract pattern)
- FR-19: System generates `plan.md` artifact as mandatory output of readiness validation
- FR-20: System enforces `plan.md` existence check before allowing `/scrum-dev-story` to proceed
- FR-21: System produces verification report via `/scrum-verify` with automated checks (tests, lint, build) as mandatory step before review (Phase 3)

### Review & Quality

- FR-22: System provides independent code review via `/scrum-review-story` using a separate model/agent from the implementer (Self-Critique Evaluator Loop)
- FR-23: Review produces findings classified by severity (critical, major, minor) with structured recommendations
- FR-24: Review verdict is either `approved` or `changes-needed`; both outcomes produce a persistent review artifact
- FR-25: Multiple review rounds are tracked with incremental artifact numbering (`review-1.md`, `review-2.md`)

### Memory & Session Continuity

- FR-26: System captures decisions as standalone artifacts (`decision_record`) auto-extracted from refinement feedback and approval reasoning (Phase 2)
- FR-27: System provides session continuity via `/session-start` command that loads open work units, last decisions, active risks, and next steps (Phase 2)
- FR-28: System provides session wrap-up via `/wrap-up` command that creates session summary artifact (Phase 2)
- FR-29: System extracts risk notes from Architect agent perspectives as persistent `risk_note` artifacts (Phase 2)
- FR-30: System loads active risk notes as context during `/scrum-review-story` automatically (Phase 2)
- FR-31: Research Reports are standalone persistent artifacts searchable by tag and topic; refinement agents automatically load relevant Research Reports as context based on domain and tag matching (Phase 2)

### Adaptive Workflow (Phase 3-4)

- FR-32: System classifies stories by type (feature, bugfix, refactor, infrastructure) and risk level (low, medium, high, critical) (Phase 4)
- FR-33: System selects workflow depth (Light, Standard, Heavy) based on story risk classification (Phase 4)
- FR-34: System dynamically dispatches agent set based on story type, risk, and domain tags (Phase 4)
- FR-35: System provides extended agent types: Security Reviewer (security-tagged stories), UX Reviewer (frontend-tagged stories), Contract Validator (post-implementation spec validation) (Phase 4)
- FR-36: Workflow depth thresholds are configurable in `config.yaml` (Phase 4)

### Audit & Governance (Phase 3+)

- FR-37: System detects and blocks policy violations (no plan, no verification, invalid transition) with actionable error messages (Phase 3)
- FR-38: System maintains central audit trail per story in `_scrum-output/audit/` with all transitions, agent actions, and artifact creation events (Phase 3)
- FR-39: System provides sprint observability via `/sprint-status` listing all stories with current status, age, and pending actions (Phase 3)
- FR-40: System provides delivery health monitoring via `/delivery-health` showing policy violations, open risks, and pending approvals (Phase 3)

### Developer Experience & Installation

- FR-41: Developer can install the framework via `npx create-scrum-workflow@latest` in under 5 minutes
- FR-42: Developer can create a first structured, refined ticket within 30 minutes of installation (SC-9)
- FR-43: CLI update command detects version, lists breaking changes, migrates YAML frontmatter automatically, and validates post-migration (FR-Migration)
- FR-44: Framework extends through files: a new `SKILL.md` in the skills directory is a new capability, a new agent definition is a new agent, a new workflow definition is a new workflow. No configuration change, build step, or service restart required. The framework discovers new specifications at runtime — no registration, no build, no restart.

### Research & Pre-Intake

- FR-45: Developer can conduct technical or general research via `/scrum-research-technical` and `/scrum-research-general` before ticket creation. Research produces a persistent Research Report artifact (`RR-XXX.md`) in `_scrum-output/memory/research/` with YAML frontmatter (topic, tags, date, referenced-by). `/scrum-create-ticket` can reference a Research Report. Refinement agents automatically load relevant Research Reports as context based on domain and tag matching. (Commands exist in v1.2.0; memory integration in Phase 2)

### Artifact Contract

- FR-46: Every slash-command that produces an artifact must generate it in a predictable location with consistent naming convention:

| Command | Artifact | Location |
|---------|----------|----------|
| `/scrum-create-ticket` | `story.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-refine-ticket` | `refinement.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-refine-story` | `plan.md` + status change | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-dev-story` | Source code changes | Project source tree |
| `/scrum-review-story` | `review-N.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-approve` | `approval-N.md` | `_scrum-output/sprints/SW-XXX/` |
| `/scrum-research-*` | `RR-XXX.md` | `_scrum-output/memory/research/` |
| `/wrap-up` | `session-summary.md` | `_scrum-output/memory/sessions/` |
| `/session-start` | Context loaded | (no artifact created) |

## Non-Functional Requirements

### Performance & Efficiency

| ID | Requirement | Metric | Measurement |
|----|------------|--------|-------------|
| NFR-1 | Token efficiency | Coordination max 4000, sub-agent max 2000 tokens per platform | Configured in `config.yaml`, validated via manual token counting during E2E testing |
| NFR-6 | Platform response time | Simple commands <30s, Medium <90s, Heavy <180s | Simple: create-ticket, approve, session-start. Medium: refine-story, review-story, verify. Heavy: refine-ticket (3 agents + cross-talk) |

### Resilience & Safety

| ID | Requirement | Metric | Measurement |
|----|------------|--------|-------------|
| NFR-2 | No external service dependency | Framework core requires zero network calls | Only `/scrum-research` commands need internet; all others are local |
| NFR-3 | Offline capability | All framework commands work without internet | Only research commands require network |
| NFR-4 | Atomic file operations | No corrupt state on session abort | All status updates use single-write pattern. Validated via abort-and-recover test: abort session mid-write, verify YAML frontmatter remains parseable and status_history is consistent |
| NFR-10 | Worst-case safety | Framework degrades gracefully under AI misexecution | All artifacts remain human-readable Markdown in Git. Developer can inspect state and manually correct. Governance-by-Transparency as fallback |
| NFR-14 | Error recovery rate | 100% of framework errors leave system in recoverable state | No command may produce an unrecoverable or silent failure state. Every error includes: what was attempted, what failed, suggested next step |
| NFR-15 | Skill execution reliability | Claude follows SKILL.md instructions with sufficient consistency for governance | 95%+ pass rate across skill execution regression suite per model version. Regression suite runs on every model update |

### Governance & Traceability

| ID | Requirement | Metric | Measurement |
|----|------------|--------|-------------|
| NFR-5 | Schema versioning | All YAML frontmatter includes `schema_version` field | Breaking changes increment version; skills validate compatibility |
| NFR-7 | Artifact traceability | Every generated artifact references its source story | All artifacts contain `ticket` field in YAML frontmatter |
| NFR-9 | Artifact inspectability | Every artifact is human-readable, diffable, Git-versionable | No binary formats, no opaque state, no external service dependency for artifact retrieval |

### Developer Experience

| ID | Requirement | Metric | Measurement |
|----|------------|--------|-------------|
| NFR-8 | Framework installability | `npx create-scrum-workflow@latest` completes in under 30 seconds | CLI installer validates and reports success/failure with actionable messages |
| NFR-11 | Zero-config extensibility | New `.md` file = new capability, no build step, no registration | Framework discovers new specifications at runtime |
| NFR-13 | Zero-knowledge onboarding | Developer creates first structured ticket without reading documentation | SC-10 validated in Phase 1 |
| NFR-16 | Update safety | Framework updates preserve all user modifications | Custom skills, agents, and workflows never overwritten. Lock file tracks user-modified files and skips them during update. Update report lists preserved files |
