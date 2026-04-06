# Product Requirements Document

# Dynamic Scrum Intelligence Framework

**Version:** 1.0
**Date:** 2026-04-06
**Status:** Draft

---

## 1. Executive Summary

**Product:** Dynamic Scrum Intelligence Framework — a spec-first, multi-agent delivery system for AI-assisted software development.

**One-Liner:** Structured, traceable, memory-driven AI delivery workflows with human governance.

**Target Users:** Solo developers and small teams using AI coding assistants (Claude Code, Cursor, Windsurf, GitHub Copilot) for real engineering work.

**Differentiator:** Most AI tools help generate code. This framework governs the entire delivery process — from intake through refinement, planning, implementation, verification, review, to human approval — with persistent memory, bounded agent authority, and explicit artifacts as source of truth.

**Current State (v1.2.0):** 10 slash-commands, 3 refinement agents, 7 skills, 14 workflows, 9-state story lifecycle with guards, Wideband Delphi estimation, domain detection, write boundary rules. All implemented as Markdown-as-Code (Claude reads and executes SKILL.md specifications at runtime).

**References:**
- Vision: [`docs/vision/vision.md`](./vision.md)
- Roadmap: [`docs/vision/ROADMAP.md`](./ROADMAP.md)
- Operational Reference: [`docs/vision/project_reference.md`](./project_reference.md)

---

## 2. Success Criteria

| ID | Criterion | Measurement | Target Phase |
|----|-----------|-------------|-------------|
| SC-1 | Story lifecycle runs end-to-end without manual workarounds | 3 stories complete `draft → done` with all artifacts generated | Phase 1 |
| SC-2 | Zero ungültige State Transitions | No story reaches an invalid state when using slash-commands | Phase 1 |
| SC-3 | Human approval is mandatory for completion | No story reaches `done` without explicit `/scrum-approve` | Phase 1 |
| SC-4 | Decisions persist across sessions | Decision records created during approval are retrievable in next session | Phase 2 |
| SC-5 | Session continuity | `/session-start` loads context of last session within 1 command | Phase 2 |
| SC-6 | Policy violations detected | System blocks at least 3 violation types (no plan, no verification, invalid transition) | Phase 3 |
| SC-7 | Audit trail complete | Every story has traceable transition history from draft to done | Phase 3 |
| SC-8 | Workflow adapts to risk | High-risk stories trigger extended refinement + security review automatically | Phase 4 |

---

## 3. Product Scope

### 3.1 MVP (v1.2.0 — Current)

Delivered and operational:

- **Ticket Creation:** `/scrum-create-ticket` — natural language → structured story YAML with frontmatter
- **Multi-Agent Refinement:** `/scrum-refine-ticket` — 3 parallel agents (Architect, Developer, QA) with isolated context, cross-talk rounds, blocker classification, Wideband Delphi estimation
- **Story Validation:** `/scrum-refine-story` — 5 immutable criteria gate (Feature List as Immutable Contract)
- **Implementation:** `/scrum-dev-story` — code execution following plan, Inversion of Control pattern
- **Code Review:** `/scrum-review-story` — separate model, 5 review criteria, produces `approved` or `changes-needed`
- **Research:** `/scrum-research technical|general` — Plan-Then-Execute pattern
- **Documentation:** `/scrum-create-project-context`, `/scrum-create-project-docs`, `/scrum-create-architecture-docs`
- **7 Skills:** status-guard-validation, prerequisite-validation, story-validation, readiness-check, guided-mode, synthesis, feedback-collection
- **Config System:** Platform selection, active agents, token budgets, refinement settings
- **CLI Installer:** `create-scrum-workflow` (Node.js) — install/update/status/validate for 6 platforms

### 3.2 v2.0 (Phase 1-2: Foundation + Memory)

Close existing gaps, add persistence:

- Human approval command and rejection flow
- Plan enforcement before implementation
- Status history tracking with tamper detection
- Decision records as standalone artifacts
- Session start/wrap-up with memory
- Risk notes with auto-extraction from refinement

### 3.3 v3.0 (Phase 3-4: Control + Adaptive)

Governance and intelligence:

- Policy violation detection and enforcement
- Central audit trail per story
- Post-implementation verification command
- Sprint observability (status, health)
- Story classification (type + risk level)
- Adaptive workflow depth (Light/Standard/Heavy)
- Dynamic dispatcher with capability matching
- Extended agent types (Security, UX, Contract Validator)

### 3.4 North Star (Phase 5-7)

Full delivery operating system:

- Delivery vault with linked knowledge navigation
- Architecture Decision Records
- Memory consolidation and active retrieval
- Pattern detection across projects
- Multi-runtime validation (Cursor, Windsurf, Copilot)
- Plugin system for custom agents and workflows

---

## 4. User Journeys

### UJ-1: Solo Developer Creates and Delivers a Story

**Trigger:** Developer has a feature to implement.

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

**Success:** Complete story with all artifacts (story.md, refinement.md, plan.md, review-N.md, approval-N.md).

### UJ-2: System Blocks Invalid Action

**Trigger:** Developer tries to skip a step.

1. Developer runs `/scrum-dev-story SW-XXX` on a story with status `draft`
2. `status-guard-validation` skill detects: status is `draft`, command requires `ready-for-dev`
3. System outputs error: "Story SW-XXX is in status 'draft', but '/scrum-dev-story' requires 'ready-for-dev'"
4. Developer follows the correct sequence

**Success:** No story enters an invalid state through slash-commands.

### UJ-3: Developer Resumes Work Next Session (Phase 2)

**Trigger:** Developer starts a new Claude Code session.

1. Developer runs `/session-start`
2. System loads last session summary: open stories, pending approvals, last actions
3. Developer sees: "SW-042 is in status `review`, waiting for your approval"
4. Developer continues where they left off

**Success:** Zero context loss between sessions.

### UJ-4: Review Finds Issues, Story Cycles Back (Phase 1)

**Trigger:** Review identifies problems.

1. `/scrum-review-story SW-XXX` produces verdict: `changes-needed`
2. Review report details findings with severity (critical/major/minor)
3. Status transitions to `changes-needed`
4. Developer runs `/scrum-dev-story SW-XXX` — re-implementation addressing findings
5. Developer triggers review again
6. On APPROVED: proceeds to human approval

**Success:** Issues caught before delivery, full cycle tracked in artifacts.

### UJ-5: High-Risk Story Gets Extended Treatment (Phase 4)

**Trigger:** Developer creates a story involving auth changes.

1. `/scrum-create-ticket` — story mentions authentication, JWT, permissions
2. Story Classifier detects: type=Feature, risk=High, domain=security
3. Dispatcher selects Heavy workflow: extended refinement + Security Reviewer Agent
4. Refinement includes security-focused perspectives
5. Post-implementation verification includes security checks
6. Review includes Security Reviewer findings

**Success:** High-risk work receives proportionally deeper analysis.

---

## 5. Functional Requirements

### Phase 1 — Foundation Hardening

| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-1.1 | Users can approve or reject a completed story via `/scrum-approve SW-XXX` | Command creates `approval-N.md` artifact with decision, rationale, timestamp. Status transitions to `done` on APPROVE, `changes-needed` on REJECT. |
| FR-1.2 | System validates `plan.md` existence before allowing implementation | `/scrum-dev-story` fails with actionable error if `plan.md` does not exist in sprint directory. |
| FR-1.3 | Every status transition is logged in story frontmatter | Story YAML contains `status_history` array with entries: `{from, to, timestamp, trigger}`. |
| FR-1.4 | System detects manual frontmatter tampering | Hash of status field is stored; mismatch triggers warning on next command. |
| FR-1.5 | Rejection flow cycles story back to implementation | `changes-needed` status allows `/scrum-dev-story` to re-enter implementation. Review findings are loaded as context. |

### Phase 2 — Memory and Continuity

| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-2.1 | Decisions are captured as standalone artifacts | `decision_record` files in `_scrum-output/memory/decisions/` with YAML frontmatter (ticket, decision, alternatives, rationale, date). |
| FR-2.2 | Decisions are auto-extracted from refinement feedback | On story approval, accepted/rejected perspectives from refinement.md are converted to decision records. |
| FR-2.3 | Users can start a session with prior context via `/session-start` | Command loads last session summary, lists open work units, shows pending approvals. |
| FR-2.4 | Users can end a session with summary via `/wrap-up` | Command creates session summary artifact: completed work, open items, next steps. |
| FR-2.5 | Risks from refinement are persisted as risk notes | `risk_note` files in `_scrum-output/memory/risks/` extracted from Architect agent perspectives. |
| FR-2.6 | Risk notes are loaded as context during review | `/scrum-review-story` automatically includes active risk notes for affected components. |

### Phase 3 — Control and Observability

| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-3.1 | System detects implementation without plan | Policy check fires before `/scrum-dev-story`; blocks if `plan.md` missing or status incorrect. |
| FR-3.2 | System detects review without prior verification | Policy check fires before `/scrum-review-story`; warns if no verification step was executed. |
| FR-3.3 | Central audit trail exists per story | `_scrum-output/audit/SW-XXX.md` contains all transitions, agent actions, and artifact creation events. |
| FR-3.4 | Users can inspect audit trail via `/delivery-audit SW-XXX` | Command outputs chronological event log for the specified story. |
| FR-3.5 | Post-implementation verification via `/scrum-verify SW-XXX` | Runs automated checks (tests, lint, build) and generates `verification_report`. Required before review. |
| FR-3.6 | Users can view sprint status via `/sprint-status` | Lists all stories with current status, age, and pending actions. |

### Phase 4 — Adaptive Workflows

| ID | Requirement | Acceptance Criteria |
|----|------------|-------------------|
| FR-4.1 | Stories are auto-classified by type and risk | After `/scrum-create-ticket`, story frontmatter contains `type` (feature/bugfix/refactor/infrastructure) and `risk` (low/medium/high/critical). |
| FR-4.2 | Workflow depth adapts to risk level | Low-risk: 1 refinement round, quick review. Medium: standard flow. High: extended refinement + additional reviewer agents. |
| FR-4.3 | Dispatcher dynamically selects agents | Agent set varies based on story type, risk, and domain tags. Security stories activate Security Reviewer. Frontend stories activate UX Reviewer. |
| FR-4.4 | Workflow depth thresholds are configurable | `config.yaml` contains `workflow_depth` section with risk-to-depth mapping, overridable per project. |
| FR-4.5 | Security Reviewer agent is available | Activated for stories tagged `security`, `auth`, `permissions`. Produces security-focused review findings. |
| FR-4.6 | Contract Validator agent is available | Post-implementation agent that validates code against original spec. Detects spec drift. |

---

## 6. Non-Functional Requirements

| ID | Requirement | Metric | Measurement |
|----|------------|--------|-------------|
| NFR-1 | Token efficiency | Coordination budget max 4000 tokens, sub-agent budget max 2000 tokens per platform | Configured in `config.yaml`, enforced by workflow instructions |
| NFR-2 | No external service dependency | Framework core requires zero network calls | All data file-based in `_scrum-output/`, no API calls for workflow execution |
| NFR-3 | Offline capability | All framework commands work without internet | Only `/scrum-research` commands require network; all others are local |
| NFR-4 | Atomic file operations | No corrupt state on session abort | All status updates use single-write pattern; partial writes do not leave inconsistent frontmatter |
| NFR-5 | Schema versioning | All YAML frontmatter includes `schema_version` field | Breaking changes increment version; skills validate version compatibility |
| NFR-6 | Platform response time | Single-command workflows complete within 60 seconds | Measured on Claude Code with standard token budget |
| NFR-7 | Artifact traceability | Every generated artifact references its source story | All artifacts in `_scrum-output/sprints/SW-XXX/` contain `ticket` field in frontmatter |
| NFR-8 | Framework installability | `npx create-scrum-workflow@latest` completes in under 30 seconds | CLI installer validates and reports success/failure with actionable messages |

---

## 7. Constraints and Assumptions

### Constraints

| Constraint | Implication |
|-----------|------------|
| **Markdown-as-Code paradigm** | Skills are SKILL.md files. Claude is the runtime. No separate backend, no compiled code for workflow logic. |
| **File-based persistence** | All memory, artifacts, and audit data stored as Markdown with YAML frontmatter. No database. |
| **Claude Code as primary runtime** | All features first-class on Claude Code. Other platforms are best-effort via adapters. |
| **Solo-developer focus (MVP)** | No concurrent editing, no merge conflict handling, no multi-user state management until Phase 4+. |
| **No vector store in MVP** | Memory retrieval is file-name and frontmatter-tag based. No semantic search until Phase 6+. |

### Assumptions

| Assumption | Risk if Wrong |
|-----------|--------------|
| Claude reliably follows SKILL.md instructions | Skills fail silently; guard conditions are bypassed. Mitigation: E2E testing in Phase 1.4. |
| File-based memory scales for single projects | Memory retrieval becomes slow with 100+ artifacts. Mitigation: evaluate after Phase 2. |
| YAML frontmatter is sufficient for state tracking | Complex state requires structured database. Mitigation: schema versioning allows migration. |
| Token budgets are sufficient for multi-agent refinement | Agents produce shallow perspectives. Mitigation: configurable per platform in config.yaml. |

---

## 8. Out of Scope

Explicitly excluded from all phases:

| Area | Reason |
|------|--------|
| Team/multi-user collaboration | Requires concurrent state management; Solo-developer validated first |
| CI/CD pipeline integration | Framework is AI-runtime-level, not DevOps-level |
| GUI or web interface | Delivery surface is the AI coding assistant terminal |
| Real-time collaboration | No shared state protocol needed for solo developer |
| Backend service or API server | Contradicts Markdown-as-Code constraint |
| Billing, analytics, or telemetry | Not a SaaS product |
| Natural language processing of codebase | Handled by the AI runtime (Claude), not by the framework |

---

## 9. Traceability Matrix

### Vision Principles → Functional Requirements

| Vision Principle | Implemented (v1.2.0) | Planned FRs |
|-----------------|---------------------|-------------|
| **4.1 Spec-First** | `/scrum-create-ticket` creates structured spec | — |
| **4.2 Plan-First** | `readiness-check` creates plan.md | FR-1.2 (plan existence validation) |
| **4.3 Separation of Concerns** | 3 agents with isolated context | FR-4.3 (dynamic agent selection), FR-4.5, FR-4.6 (new agent types) |
| **4.4 Human Gate** | Approval workflow + template exist | FR-1.1 (`/scrum-approve` command) |
| **4.5 Bounded Authority** | Read-bounded agent context, write boundary rules | FR-3.2 (violation detection) |
| **4.6 Persistent Memory** | Feedback tracked in refinement.md | FR-2.1–FR-2.6 (decisions, sessions, risks) |
| **4.7 Adaptive Workflow Depth** | All stories use identical workflow | FR-4.1–FR-4.4 (classifier, adaptive depth, dispatcher) |

### Roadmap Phases → Functional Requirements

| Phase | FRs | Success Criteria |
|-------|-----|-----------------|
| Phase 1: Foundation | FR-1.1 – FR-1.5 | SC-1, SC-2, SC-3 |
| Phase 2: Memory | FR-2.1 – FR-2.6 | SC-4, SC-5 |
| Phase 3: Control | FR-3.1 – FR-3.6 | SC-6, SC-7 |
| Phase 4: Adaptive | FR-4.1 – FR-4.6 | SC-8 |
