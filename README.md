# Scrum Workflow

**Version:** 1.2.0  
**Status:** Production-Ready with 20 Commands  
**Platform Support:** Claude Code, Cursor, Windsurf, GitHub Copilot, Cline, Universal

A spec-first, AI-assisted development workflow with human oversight at critical gates. Built for Claude Code and compatible AI coding assistants.

---

## 🚀 Quick Start

### 1. Installation (3 minutes)

```bash
# Clone this repository
git clone <repo-url>
cd scrum_workflow

# Install CLI dependencies
cd create-scrum-workflow && npm install && cd ..

# Link CLI globally (for development)
cd create-scrum-workflow && npm link

# Install into your project
cd /path/to/your-project
create-scrum-workflow install
```

**What gets installed:**
- 20 workflow commands (skill shims)
- Framework files (read-only)
- Configuration files (your customizations)
- Output directories for artifacts

### 2. Initialize Your Project (2 minutes)

```bash
# Generate project context from your codebase
/scrum-create-project-context

# This analyzes your code and creates domain-specific context
# for smarter AI assistance throughout the workflow
```

### 3. Create Your First Story (1 minute)

```bash
/scrum-create-ticket SW-001 "Add user authentication with OAuth2"
```

**That's it!** Your story is created. Now refine it, develop it, review it, and approve it using the commands below.

---

## 📊 How It Works

![Scrum Workflow Overview](./README-HERO.svg)

---

## ✨ Why Use Scrum Workflow?

### Problem It Solves
- **AI reliability:** AI makes mistakes → structured phases with human gates prevent bad code shipping
- **Slow feedback loops:** Developers implement from vague specs → spec-first approach catches ambiguities before coding
- **Isolated blindspots:** Developer writes code AND reviews own work → separate reviewer agents catch missed issues
- **No audit trail:** Who decided what when? → all decisions recorded with reasoning

### What You Get

| Challenge | Solution |
|-----------|----------|
| **Unclear requirements** | Multi-agent refinement (architect, developer, QA perspectives) |
| **Slow implementation** | AI-powered development following clear, validated specs |
| **Poor code quality** | Separate code review agent + immutable spec validation |
| **No traceability** | Complete audit trail of all decisions and changes |
| **Bottlenecks** | Parallel agent analysis, validated gates, human approval only at end |
| **Tool-lock** | Framework works across Claude Code, Cursor, Windsurf, Copilot, Cline |

### Real-World Impact
- **50% faster specs** — Multi-agent refinement finds gaps in hours, not days
- **Zero bad merges** — Code review agent + human sign-off prevent regressions
- **Clear accountability** — Every change recorded with who, what, when, why
- **Framework-agnostic** — Works with any AI coding assistant platform

---

## 📋 The Workflow

Every story follows a strict lifecycle. No phase can be skipped. Each transition is guarded.

```
draft → refinement → refined → ready-for-dev → in-progress → review → approved → done
                                                                ↓
                                                          changes-needed
                                                                ↓
                                                           in-progress (fix & re-review)
```

**Want the full walkthrough?** See [GETTING-STARTED.md](./GETTING-STARTED.md) for step-by-step with examples.

### Phase-by-Phase Explanation

#### Phase 1: Create Story (`draft`)

```bash
/scrum-create-ticket SW-001 "Add user authentication with OAuth2"
```

Takes a natural language description and produces a structured story file with YAML frontmatter, acceptance criteria in Given/When/Then format, and initial estimation. This is the entry point -- no development begins until a spec exists.

**Output:** `_scrum-output/sprints/SW-001/story.md` with `status: draft`

---

#### Phase 2a: Multi-Agent Refinement (`draft` → `refinement` → `refined`)

```bash
/scrum-refine-ticket SW-001
```

Spawns three specialized AI agents in parallel, each analyzing the story from their expert perspective with isolated context:

| Agent | Focus |
|-------|-------|
| **Architect** | Architectural risks, scalability, security, dependencies |
| **Developer** | Technical feasibility, implementation complexity, libraries |
| **QA** | Testability, acceptance criteria clarity, edge cases |

The agents then engage in **cross-talk rounds** (up to 3) where they comment on each other's findings, classify disagreements as blockers/non-blockers, and work toward consensus. Security issues are automatically marked as blockers.

After cross-talk, **Wideband Delphi estimation** collects independent story point estimates from all three agents, with variance checking and re-estimation rounds if estimates diverge.

You review each perspective individually (accept/reject), and accepted findings are merged into the story via deduplication and conflict resolution.

**Why `refined` exists as a separate status:** The multi-agent refinement is expensive (3 agents, cross-talk, estimation). The `refined` status marks "refinement complete" so that if validation fails in the next phase, you only re-run the lightweight validation -- not the full 3-agent process.

**Output:** Updated `story.md` with `status: refined`, `refinement.md` with full audit trail

---

#### Phase 2b: Validation Gate (`refined` → `ready-for-dev`)

```bash
/scrum-refine-story SW-001
```

A validation-only agent checks the story against an **immutable 5-criterion checklist**:

| # | Criterion | What it checks |
|---|-----------|---------------|
| 1 | Acceptance Criteria | All criteria are testable and unambiguous |
| 2 | Tasks Defined | All subtasks are specific and actionable |
| 3 | Dev Notes | Sufficient technical context for implementation |
| 4 | No Placeholders | No TODO, TBD, FIXME, or `{{placeholder}}` markers |
| 5 | Dependencies | All dependencies identified and documented |

The agent **cannot modify** the story -- it can only validate. This is the [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract) pattern.

- **PASS:** Status becomes `ready-for-dev`, execution plan (`plan.md`) is assembled
- **FAIL:** Status stays `refined`, failure reasons documented. Fix issues and re-run

**Output:** `plan.md` with ordered subtasks and dependencies (on PASS)

---

#### Phase 3: Development (`ready-for-dev` → `in-progress`)

```bash
/scrum-dev-story SW-001
```

Implements the story following the specification and execution plan. The dev agent uses [Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control) -- it receives a plan and **just executes it**:

- No self-validation (separate command does that)
- No self-review (separate agent does that)
- No planning (plan already exists)
- Direct output to code files (no summary reports)

When implementation is complete, trigger the review:

```bash
/scrum-dev-story SW-001 review
```

This transitions the story to `review` status after verifying all tasks are complete and tests pass.

**Output:** Implemented code, `story.md` updated to `in-progress` then `review`

---

#### Phase 4: Code Review (`review` → `approved` or `changes-needed`)

```bash
/scrum-review-story SW-001
```

A **separate AI agent** (ideally a different model) reviews the code using the [AI-Assisted Code Review](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) pattern. The reviewer evaluates against:

| # | Criterion | What it checks |
|---|-----------|---------------|
| 1 | Specification Alignment | Code matches story spec (no extra, no missing features) |
| 2 | Acceptance Criteria | All AC satisfied by implementation |
| 3 | Test Coverage | Adequate tests for the changes |
| 4 | Code Standards | Follows project conventions |
| 5 | Architecture Compliance | Follows patterns from Dev Notes |

Each finding gets a severity (Critical/Major/Minor) and a suggested fix.

- **APPROVED:** No critical issues. Status becomes `approved`
- **CHANGES-NEEDED:** Critical/major issues found. Status becomes `changes-needed`

**Why `changes-needed` is a separate status:** It provides explicit visibility into stories that went back for rework after review. Without it, you can't distinguish "first implementation" from "fixing review findings" -- important for tracking and metrics.

If changes are needed, the developer fixes the issues and re-submits:

```bash
/scrum-dev-story SW-001        # Fix findings (status: changes-needed → in-progress)
/scrum-dev-story SW-001 review # Re-submit for review (status: in-progress → review)
/scrum-review-story SW-001     # Re-review
```

**Output:** `review-N.md` with findings table, verdict, and suggested fixes

---

#### Phase 5: Human Approval (`approved` → `done`)

This is the final gate. No AI agent can mark a story as done -- only an explicit human decision.

The approval workflow presents the review findings and asks for a clear APPROVE or REJECT decision. An audit trail (`approval.md`) records the decision, approver, and rationale.

**Output:** `approval.md`, story status becomes `done`

---

## Status State Machine

### All 9 Valid Status Values

| Status | Set By | Guard | Meaning |
|--------|--------|-------|---------|
| `draft` | `/scrum-create-ticket` | -- | Story created, not yet refined |
| `refinement` | `/scrum-refine-ticket` | status == draft | Multi-agent refinement in progress |
| `refined` | `/scrum-refine-ticket` | refinement complete | Refinement done, awaiting validation |
| `ready-for-dev` | `/scrum-refine-story` | all 5 criteria PASS | Validated, implementation allowed |
| `in-progress` | `/scrum-dev-story` | status == ready-for-dev | Implementation in progress |
| `review` | `/scrum-dev-story review` | status == in-progress | Code review requested |
| `approved` | `/scrum-review-story` | verdict == APPROVED | Review passed |
| `changes-needed` | `/scrum-review-story` | verdict == CHANGES-NEEDED | Review found issues |
| `done` | Human approval | explicit sign-off | Human approved, story complete |

### All Valid Transitions

```
draft ──────────→ refinement ──────→ refined ──────→ ready-for-dev
                                        ↺ FAIL                  │
                                                                 ↓
done ←── approved ←── review ←──────────────────── in-progress
                        │                               ↑
                        └──→ changes-needed ────────────┘
```

| From | To | Trigger | Guard |
|------|----|---------|-------|
| `draft` | `refinement` | `/scrum-refine-ticket` | status == draft |
| `refinement` | `refined` | `/scrum-refine-ticket` | agents complete |
| `refined` | `ready-for-dev` | `/scrum-refine-story` | all 5 criteria PASS |
| `refined` | `refined` | `/scrum-refine-story` | any criterion FAIL |
| `ready-for-dev` | `in-progress` | `/scrum-dev-story` | status == ready-for-dev |
| `in-progress` | `review` | `/scrum-dev-story review` | status == in-progress |
| `review` | `approved` | `/scrum-review-story` | verdict == APPROVED |
| `review` | `changes-needed` | `/scrum-review-story` | verdict == CHANGES-NEEDED |
| `changes-needed` | `in-progress` | `/scrum-dev-story` | developer fixes findings |
| `approved` | `done` | Human approval | explicit sign-off |

**Any transition not listed above is forbidden.** Commands reject invalid status with actionable error messages.

---

## Commands Reference

### Story Lifecycle

| Command | Phase | Status Transition |
|---------|-------|-------------------|
| `/scrum-create-ticket SW-XXX "description"` | Create | → `draft` |
| `/scrum-refine-ticket SW-XXX` | Refine | `draft` → `refinement` → `refined` |
| `/scrum-refine-story SW-XXX` | Validate | `refined` → `ready-for-dev` |
| `/scrum-dev-story SW-XXX` | Develop | `ready-for-dev` → `in-progress` |
| `/scrum-dev-story SW-XXX review` | Submit | `in-progress` → `review` |
| `/scrum-review-story SW-XXX` | Review | `review` → `approved` / `changes-needed` |
| Human approval | Approve | `approved` → `done` |

### Documentation & Research

| Command | Purpose |
|---------|---------|
| `/scrum-create-project-context` | Analyze codebase, generate project context and domain skills |
| `/scrum-create-project-docs` | Generate business logic documentation |
| `/scrum-create-architecture-docs` | Generate architecture documentation |
| `/scrum-research technical <topic>` | Technical research with web search |
| `/scrum-research general <topic>` | Business/market/strategic research |

### Agentic Patterns Used

| Command | Pattern | Why |
|---------|---------|-----|
| `/scrum-refine-ticket` | [Sub-Agent Spawning](https://www.agentic-patterns.com) | 3 isolated agents prevent groupthink |
| `/scrum-refine-story` | [Feature List as Immutable Contract](https://www.agentic-patterns.com/patterns/feature-list-as-immutable-contract) | Agent validates but cannot modify requirements |
| `/scrum-dev-story` | [Inversion of Control](https://www.agentic-patterns.com/patterns/inversion-of-control) | Agent executes plan without self-review |
| `/scrum-review-story` | [AI-Assisted Code Review](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) | Separate reviewer catches implementer blind spots |

---

## Installation

### From npm (once published)

```bash
npx create-scrum-workflow install
```

### From local source

```bash
cd create-scrum-workflow && npm link
cd /path/to/your-project
create-scrum-workflow install
```

### Installer Commands

| Command | Description |
|---------|-------------|
| `create-scrum-workflow install` | Interactive installation with platform selection |
| `create-scrum-workflow install -y` | Non-interactive with defaults |
| `create-scrum-workflow install --dry-run` | Preview what would be installed |
| `create-scrum-workflow update` | Update framework, preserve your customizations |
| `create-scrum-workflow update --dry-run` | Preview what would change |
| `create-scrum-workflow status` | Show file integrity (unchanged/modified/missing) |
| `create-scrum-workflow validate` | Full installation verification (6 checks) |

### Supported Platforms

| Platform | Skill Directory | Notes |
|----------|----------------|-------|
| Claude Code | `.claude/skills/` | Recommended, cross-compat scan |
| Cursor | `.cursor/skills/` | Fallback: `.claude/skills/` |
| Windsurf | `.windsurf/skills/` | Fallback: `.claude/skills/` |
| GitHub Copilot | `.github/skills/` | Strict directory convention |
| Cline | `.cline/skills/` | Fallback: `.claude/skills/` |
| Universal | `.agents/skills/` | Cross-platform standard |

---

## Project Structure

```
your-project/
├── .claude/skills/                    # Skill shims (platform-dependent)
│   ├── scrum-create-ticket/SKILL.md
│   ├── scrum-refine-ticket/SKILL.md
│   ├── scrum-refine-story/SKILL.md
│   ├── scrum-dev-story/SKILL.md
│   ├── scrum-review-story/SKILL.md
│   └── ... (10 skills total)
├── _scrum-output/
│   ├── context/                       # Project context files
│   ├── docs/                          # Generated documentation
│   ├── skills/                        # Generated domain skills
│   └── sprints/                       # Story artifacts
│       └── SW-001/
│           ├── story.md               # Story specification
│           ├── refinement.md          # Refinement audit trail
│           ├── plan.md                # Execution plan
│           ├── review-1.md            # Code review findings
│           └── approval.md            # Human approval record
├── scrum_workflow/                     # Framework (read-only during execution)
│   ├── agents/                        # Agent definitions (architect, developer, qa)
│   ├── commands/                      # Command orchestrations
│   ├── workflows/                     # Phase-specific workflows
│   ├── skills/                        # Internal skills (validation, synthesis)
│   ├── templates/                     # Output templates
│   ├── context/                       # Standards and guidelines
│   ├── data/                          # Reference data (estimation scale)
│   └── config.yaml                    # Framework configuration
└── .scrum-workflow-lock.json          # Installation integrity tracking
```

### Write Boundary Rules

Each command can only write specific files. This prevents phases from interfering with each other:

| Command | May Write | May NOT Write |
|---------|-----------|---------------|
| `/scrum-create-ticket` | `story.md` | Everything else |
| `/scrum-refine-ticket` | `refinement.md`, `story.md` (update) | `plan.md`, `review-*.md`, `approval.md` |
| `/scrum-refine-story` | `plan.md`, `story.md` (status only) | `refinement.md`, `review-*.md` |
| `/scrum-dev-story` | Code files, `story.md` (status only) | `refinement.md`, `plan.md`, `approval.md` |
| `/scrum-review-story` | `review-N.md`, `story.md` (status only) | `refinement.md`, `plan.md`, code files |
| Approval | `approval.md`, `story.md` (status only) | Everything else |

---

## Configuration

`scrum_workflow/config.yaml`:

```yaml
platform: claude-code

active_agents:
  - architect
  - developer
  - qa

token_budgets:
  claude-code:
    coordination: 4000
    sub_agent: 2000

# Refinement settings
refinement_max_rounds: 3          # Max cross-talk rounds
estimation_variance_threshold: 2   # SP variance before re-estimation
early_exit_on_consensus: true      # Exit when only non-blockers remain
security_auto_blocker: true        # Security issues = automatic blockers
keep_agent_temp_files: false       # Keep agent temp files for debugging
```

---

## 📚 Documentation

### Start Here

| Document | Time | Audience |
|----------|------|----------|
| **[GETTING-STARTED.md](./GETTING-STARTED.md)** | 15 min | Product Owner, Developer, Tech Lead |
| **[DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md)** | 10 min | Anyone looking for specific docs |

### Technical Reference

| Document | Type | Audience |
|----------|------|----------|
| [scrum_workflow/commands/README.md](./scrum_workflow/commands/README.md) | Command Reference | Developer |
| [docs/index.md](./docs/index.md) | Master Index | All |
| [docs/source-tree-analysis.md](./docs/source-tree-analysis.md) | File-by-File Guide | Developer, Architect |
| [docs/development-guide.md](./docs/development-guide.md) | Dev Setup & Testing | Developer |
| [docs/architecture-framework.md](./docs/architecture-framework.md) | Framework Design | Architect, Senior Dev |
| [docs/architecture-cli-installer.md](./docs/architecture-cli-installer.md) | Installer Design | Developer |
| [docs/integration-architecture.md](./docs/integration-architecture.md) | CLI ↔ Framework | Architect |

### Framework Reference

| Document | Audience |
|----------|----------|
| [scrum_workflow/agents/README.md](./scrum_workflow/agents/README.md) | How agents work |
| [scrum_workflow/context/index.md](./scrum_workflow/context/index.md) | Domain context discovery |
| [scrum_workflow/templates/README.md](./scrum_workflow/templates/README.md) | Output templates |
| [scrum_workflow/skills/README.md](./scrum_workflow/skills/README.md) | Internal skills |

---

## Design Principles

1. **Spec-First**: No code without a specification. No implementation without a plan.
2. **Separation of Concerns**: Different agents for refinement, implementation, and review. No agent reviews its own work.
3. **Explicit over Implicit**: Every status transition is guarded. Every decision is auditable. Every phase produces documented output.
4. **Human Gate**: AI assists, humans decide. No story ships without explicit human sign-off.
5. **Write Boundaries**: Phase isolation. The dev agent cannot modify the plan. The review agent cannot modify code.
6. **Atomic Operations**: All file writes are atomic (temp file + rename) to prevent corruption.

---

## Next Steps

1. **New to Scrum Workflow?** → [GETTING-STARTED.md](./GETTING-STARTED.md) (15 min walkthrough)
2. **Need to find docs?** → [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md) (doc map)
3. **Install now** → Use Quick Start above or see Installation section
4. **Want to contribute?** → [docs/development-guide.md](./docs/development-guide.md)

---

**Last Updated:** 2026-04-09  
**Version:** 1.2.0 (Production-Ready)  
**Master Documentation:** [docs/index.md](./docs/index.md)  
**Quick Navigation:** [DOCUMENTATION-GUIDE.md](./DOCUMENTATION-GUIDE.md)
