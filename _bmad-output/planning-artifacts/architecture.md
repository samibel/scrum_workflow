---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
---

## Project Context Analysis


---

## Project Context Analysis


inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - docs/vision/vision.md
  - docs/vision/ROADMAP.md
  - scrum_workflow/workflows/project-context.md
  - docs/vision/architecture-agent-patterns/index.md
  - docs/vision/architecture-agent-patterns/pattern-catalog.md
  - docs/vision/architecture-agent-patterns/vision-principle-mapping.md
  - docs/vision/architecture-agent-patterns/architecture-layer-mapping.md
  - docs/vision/architecture-agent-patterns/anti-patterns.md
workflowType: 'architecture'
project_name: 'scrum_workflow'
user_name: 'Sami'
date: '2026-04-06'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 8 areas where AI agents could make different choices

### 1. Naming Patterns

**Story ID Format:**
- Pattern: `SW-XXX` (3-digit, zero-padded)
- Examples: `SW-001`, `SW-042`, `SW-999`
- Rationale: Short, sortable, zero-padded for consistent ordering

**Artifact Naming:**
- Refinement: `refinement.md` (single per story)
- Plan: `plan.md` (single per story)
- Review: `review-{N}.md` (sequential per round)
- Approval: `approval-{N}.md` (sequential)
- Research: `RR-XXX.md` (research reports)
- Decision: `DR-XXX.md` (decision records)
- Risk: `RN-XXX.md` (risk notes)
- Session: `session-{YYYY-MM-DD}.md`

**Code Naming:**
- Skills: `SKILL.md` (uppercase, no extension in name)
- Workflows: `workflow.md`
- Agents: `agent.md` or role-based naming (e.g., `architect-agent.md`)
- Commands: `command.md`

### 2. Structure Patterns

**Output Directory Structure:**
```
_scrum-output/
├── sprints/
│   └── SW-XXX/
│       ├── story.md
│       ├── refinement.md
│       ├── plan.md
│       ├── review-1.md
│       └── approval-1.md
├── memory/
│   ├── decisions/
│   │   └── DR-XXX.md
│   ├── sessions/
│   │   └── session-YYYY-MM-DD.md
│   ├── risks/
│   │   └── RN-XXX.md
│   └── research/
│       └── RR-XXX.md
```

**Framework Directory Structure:**
```
scrum_workflow/
├── commands/
│   └── {command-name}/
│       └── command.md
├── workflows/
│   └── {workflow-name}/
│       └── workflow.md
├── skills/
│   └── {skill-name}/
│       └── SKILL.md
└── agents/
    └── {agent-name}/
        └── agent.md
```

### 3. Format Patterns

**YAML Frontmatter Standard:**
```yaml
---
schema_version: 1.0.0
ticket: SW-XXX
status: draft
created: 2026-04-06T10:00:00Z
updated: 2026-04-06T10:00:00Z
status_history:
  - from: null
    to: draft
    timestamp: 2026-04-06T10:00:00Z
    trigger: /scrum-create-ticket
    actor: human
---
```

**Status Value Format:**
- Pattern: lowercase with hyphens
- Valid values: `draft`, `refined`, `ready-for-dev`, `in-progress`, `review`, `approved`, `done`, `changes-needed`, `cancelled`
- Invalid values: `Draft`, `DRAFT`, `In Progress`, `in_progress`

### 4. Write Boundary Patterns (CRITICAL - FR-9, SC-18)

| Phase/Command | May Write | May NOT Write |
|----------------|----------|------------------|
| `/scrum-create-ticket` | `story.md`, `status: draft` | All other files |
| `/scrum-refine-ticket` | `refinement.md` | `story.md`, source code, `plan.md` |
| `/scrum-refine-story` | `plan.md`, status in `story.md` | `refinement.md`, source code |
| `/scrum-dev-story` | Source code, test files | `story.md`, `plan.md`, `refinement.md` |
| `/scrum-review-story` | `review-N.md` | Source code, `story.md` |
| `/scrum-approve` | `approval-N.md`, status in `story.md` | Source code, `refinement.md` |
| `/scrum-verify` | `verification-report.md` | Source code, `story.md` |

**Anti-Patterns:**
- Implementation agent modifies `story.md` → Spec Drift
- Review agent modifies source code → Self-Fix instead of Feedback
- Agent writes outside defined boundary → Bounded Authority Violation

### 5. Actor Identity Patterns (FR-7)

| Actor Type | Format | Example |
|------------|--------|---------|
| Human | `human` | `actor: human` |
| Agent | `{name}-agent` | `actor: architect-agent` |
| Skill | `{name}-skill` | `actor: readiness-check-skill` |
| System/CLI | `system` | `actor: system` (migration) |

**Enforcement:** Every `status_history` entry MUST include `actor` field

### 6. Timestamp & ID Patterns

| Element | Format | Example |
|---------|--------|---------|
| Timestamps | ISO 8601 UTC | `2026-04-06T10:00:00Z` |
| Story IDs | `SW-{NNN}` (3-digit, zero-padded) | `SW-001`, `SW-042` |
| Decision Records | `DR-{NNN}` | `DR-001` |
| Risk Notes | `RN-{NNN}` | `RN-003` |
| Research Reports | `RR-{NNN}` | `RR-004` |
| Review Artifacts | `review-{N}` (sequential) | `review-1.md` |
| Approval Artifacts | `approval-{N}` (sequential) | `approval-1.md` |
| Session Summaries | `session-{YYYY-MM-DD}.md` | `session-2026-04-06.md` |

### 7. Error Message Patterns

**Standard Error Format:**
```
❌ {Error Type}: {Brief description}

**Details:** {More context about what went wrong}

**Next Step:** {Actionable guidance for resolution}
```

**Error Categories:**
- `Status Guard Violation` - Invalid state transition attempted
- `Prerequisite Missing` - Required artifact not found
- `Write Boundary Violation` - Agent attempted to write outside allowed zone
- `Validation Failed` - Artifact failed validation criteria

### 8. Cross-Agent Communication Patterns

**Context Isolation:**
- Architect agent receives: story.md + domain context (no other agent definitions)
- Developer agent receives: story.md + plan.md + relevant code context
- QA agent receives: story.md + plan.md + testing context
- Review agent receives: story.md + plan.md + implementation + previous reviews

**Feedback Collection:**
- Pattern: Structured accept/reject per perspective
- Format: `feedback-{agent-name}.md` with `accepted: true/false` and `rationale` fields

### Enforcement Guidelines

**All AI Agents MUST:**
1. Respect write boundaries defined per command/phase
2. Use lowercase-with-hyphens for status values
3. Include `actor` field in every `status_history` entry
4. Use ISO 8601 UTC for all timestamps
5. Follow ID format conventions (SW-XXX, DR-XXX, RN-XXX, RR-XXX)
6. Produce actionable error messages with "Next step" guidance
7. Never modify artifacts outside their defined write boundary

**Pattern Verification:**
- Skills validate artifact formats before processing
- Status guards check state consistency before transitions
- Write boundary checks enforced by workflow specifications

### Pattern Examples

**Good Examples:**
```yaml
# Correct status_history entry
status_history:
  - from: draft
    to: refined
    timestamp: 2026-04-06T14:30:00Z
    trigger: /scrum-refine-ticket
    actor: synthesis-skill
```

**Anti-Patterns:**
```yaml
# WRONG - Wrong status format
status: In-Progress  # Should be: in-progress

# WRONG - Missing actor field
status_history:
  - from: draft
    to: refined
    timestamp: 2026-04-06T14:30:00Z
    trigger: /scrum-refine-ticket
    # Missing: actor field!

# WRONG - Wrong ID format
ticket: scrum-001  # Should be: SW-001
```

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
- ✅ Markdown-as-Code paradigm consistent across all 7 layers
- ✅ 7-Layer Architecture supports all Vision Principles
- ✅ 9-State Lifecycle compatible with Write Boundaries
- ✅ Token Budgets aligned with Context Isolation

**Pattern Consistency:**
- ✅ Naming Patterns (SW-XXX, DR-XXX, RN-XXX, RR-XXX) standardized
- ✅ Format Patterns (YAML frontmatter) consistent
- ✅ Write Boundary Patterns cover all commands

**Structure Alignment:**
- ✅ Framework Structure (`scrum_workflow/`) supports all layers
- ✅ Output Structure (`_scrum-output/`) separates Sprint from Memory
- ✅ Template Structure covers all artifact types

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR-Area | Covered by | Status |
|------------|-----------------|--------|
| FR-1 bis FR-7 (Story Lifecycle) | commands/scrum-*.md, 9-State Machine | ✅ |
| FR-8 bis FR-11 (State Machine & Guards) | skills/status-guard-validation, skills/prerequisite-validation | ✅ |
| FR-12 bis FR-17 (Multi-Agent Refinement) | agents/, skills/synthesis | ✅ |
| FR-18 bis FR-21 (Validation & Readiness) | skills/readiness-check, skills/story-validation | ✅ |
| FR-22 bis FR-25 (Review & Quality) | commands/scrum-review-story, workflows/review.md | ✅ |
| FR-26 bis FR-31 (Memory & Session) | commands/session-start, commands/wrap-up, templates/ | ✅ |
| FR-32 bis FR-36 (Adaptive Workflow) | Phase 4 - Planned | 📋 Phase 4 |
| FR-37 bis FR-40 (Audit & Governance) | Phase 3 - Planned | 📋 Phase 3 |
| FR-41 bis FR-45 (Developer Experience) | CLI Installer, commands/ | ✅ |
| FR-46 (Artifact Contract) | templates/, Directory Structure | ✅ |

**Non-Functional Requirements Coverage:**

| NFR | Abgedeckt durch | Status |
|-----|-----------------|--------|
| NFR-1 (Token Efficiency) | config.yaml token budgets | ✅ |
| NFR-2 (No External Dependency) | File-based state | ✅ |
| NFR-3 (Offline Capability) | Local Markdown files | ✅ |
| NFR-4 (Atomic File Operations) | Single-write pattern | ✅ |
| NFR-5 (Schema Versioning) | schema_version field | ✅ |
| NFR-6 (Response Time) | Platform-specific timeouts | ✅ |
| NFR-7 (Artifact Traceability) | ticket field in frontmatter | ✅ |
| NFR-8 (Installability) | npx CLI installer | ✅ |
| NFR-9 (Inspectability) | Human-readable Markdown | ✅ |
| NFR-10 (Worst-Case Safety) | Git-versioned artifacts | ✅ |
| NFR-11 (Zero-Config Extensibility) | Runtime discovery | ✅ |
| NFR-13 (Zero-Knowledge Onboarding) | SC-10 validation | ✅ |
| NFR-14 (Error Recovery) | Actionable error messages | ✅ |
| NFR-15 (Skill Execution Reliability) | 95%+ pass rate target | ✅ |
| NFR-16 (Update Safety) | Lock file tracking | ✅ |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- ✅ 16 Architecture Decisions documented (AD-001 to AD-016)
  - 12 Decided (AD-001 to AD-012)
  - 4 Deferred (AD-013 to AD-016 - Phase 3+ features)

**Structure Completeness:**
- ✅ Framework Directory Structure complete
- ✅ Output Directory Structure defined
- ✅ Requirements Mapping created

**Pattern Completeness:**
- ✅ 8 Pattern categories defined
- ✅ Enforcement Guidelines documented
- ✅ Anti-Patterns identified

### Gap Analysis Results

**Critical Gaps:** None 🎉

**Important Gaps (Phase 3-4):**
- 📋 `/scrum-verify` Command (Phase 3)
- 📋 Policy Violation Detection (Phase 3)
- 📋 Central Audit Trail (Phase 3)
- 📋 Story Classifier (Phase 4)
- 📋 Adaptive Workflow Depth (Phase 4)
- 📋 Extended Agent Types (Phase 4)

**Nice-to-Have (Phase 5-7):**
- 📋 Delivery Vault Navigation (Phase 5)
- 📋 Memory Consolidation (Phase 6)
- 📋 Multi-Platform Validation (Phase 7)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (High - 7-Layer, Self-Evolving)
- [x] Technical constraints identified (No database, Markdown-as-Code)
- [x] Cross-cutting concerns mapped (Governance, Memory, Multi-Agent)

**✅ Architectural Decisions**
- [x] 16 Decisions documented (12 decided + 4 deferred)
- [x] Technology stack fully specified (Markdown + YAML + JavaScript CLI)
- [x] Integration patterns defined (7-Layer Architecture)
- [x] Performance considerations addressed (Token budgets, Context isolation)

**✅ Implementation Patterns**
- [x] 8 Naming convention categories established
- [x] Structure patterns defined (Framework vs Output directories)
- [x] Communication patterns specified (Cross-agent context isolation)
- [x] Process patterns documented (Error format, Write boundaries)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** HIGH

**Key Strengths:**
- Clear paradigm definition (Markdown-as-Code)
- Complete 7-Layer Architecture with Pattern mapping
- Detailed Write Boundary Rules for all commands
- Consistent ID and Naming conventions
- Comprehensive Requirements coverage (46 FRs, 15 NFRs)

**Areas for Future Enhancement:**
- Phase 3-4 Features (Verification, Adaptive Workflows)
- Phase 5-7 Features (Vault Navigation, Multi-Platform)

### Implementation Handoff

**AI Agent Guidelines:**
1. Follow all 12 Architecture Decisions (AD-001 to AD-012)
2. Use Implementation Patterns consistently (8 pattern categories)
3. Respect Write Boundaries per command/phase
4. Use standardized ID formats (SW-XXX, DR-XXX, RN-XXX, RR-XXX)
5. Reference this document for all architectural questions

**First Implementation Priority:**
- Phase 1: `/scrum-approve` Command + Status History + Plan Enforcement

---

## Source References

| Document | Path | Purpose |
|----------|------|---------|
| PRD | `_bmad-output/planning-artifacts/prd.md` | Requirements source |
| Vision | `docs/vision/vision.md` | Vision Principles |
| Roadmap | `docs/vision/ROADMAP.md` | Phased implementation |
| Architecture Patterns | `docs/vision/architecture-agent-patterns/` | Pattern catalog |
| Project Context | `scrum_workflow/workflows/project-context.md` | Context workflow |

---

**Architecture Workflow Completed:** 2026-04-06
