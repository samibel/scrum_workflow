---
name: review-story
trigger: "/scrum-review-story"
requires_status: review
sets_status: "approved | changes-needed"
pattern: ai-assisted-code-review
model_recommendation: "Use a different model than the implementation agent (e.g., if implementation used Claude Sonnet, use Claude Opus or a different model family for review)"
---

## Purpose

Perform unbiased code review using the "AI-Assisted Code Review / Verification" pattern. This review-only agent evaluates implemented code against the story specification, acceptance criteria, and project standards. The agent uses a separate perspective from the implementation agent to catch blind spots and ensure quality.

## Agentic Pattern

**Pattern:** [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification)

**Key Principles:**
- **Separate Agent for Critique:** The reviewer is NOT the implementer — ensures unbiased perspective
- **Multi-Agent Approach:** One generates, another verifies — catches blind spots
- **Focus on Alignment:** Verify implementation matches specification, not just "looks good"
- **Quality Verification:** Check for completeness, correctness, and adherence to standards

## Workflow Reference

workflows/review-story.md

## Input

Ticket number in the format: `/scrum-review-story SW-XXX`

- **Ticket number**: `SW-XXX` format where XXX is a zero-padded 3-digit number (e.g., `SW-001`, `SW-042`, `SW-103`)
- **Prerequisite**: The story file `_scrum-output/sprints/SW-XXX/story.md` must exist with `status: review`

## Output

### On APPROVED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: approved` (atomic write)
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review report with APPROVED verdict

### On CHANGES-NEEDED:
- `_scrum-output/sprints/SW-XXX/story.md` -- Updated with `status: changes-needed` (atomic write)
- `_scrum-output/sprints/SW-XXX/review-N.md` -- Review report with CHANGES-NEEDED verdict and findings

## Review Criteria

The agent evaluates the implementation against these criteria:

| # | Criterion | What to Check |
|---|----------|---------|
| 1 | Specification Alignment | Code matches story specification (no extra features, no missing features) |
| 2 | Acceptance Criteria | All acceptance criteria are satisfied by implementation |
| 3 | Test Coverage | Adequate test coverage for the changes |
| 4 | Code Standards | Code follows project standards from `context/standards.md` |
| 5 | Architecture Compliance | Implementation follows architecture patterns from Dev Notes |
| 6 | Clean Code & Simplification | Code is readable, simple, free of duplication, dead code, and unnecessary complexity (KISS, DRY, YAGNI) |

### Mandatory Clean Code Supplementary Review (Adversarial Critic)

Every `/scrum-review-story` invocation **always** dispatches the `clean-code-reviewer` agent at the end of the evaluation phase, regardless of story `type`, `risk_level`, or `domain_tags`. This guarantees that Clean Code and Simplification concerns — which the primary reviewer routinely overlooks while focused on spec alignment, ACs, tests, and architecture — are evaluated on every story.

**Pattern composition** — the agent is built on three composable agentic patterns:

- [AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification) — separate critic, never the implementer
- [Adversarial Code Review (ASDLC)](https://asdlc.io/patterns/adversarial-code-review/) — fresh session, **adversarial framing**, structured `PASS` / `FAIL` / `FAIL-WITH-CRITICAL` verdict, two-phase protocol (independent read first, primary-reviewer cross-check after)
- [Inference-Healed Code Review Reward](https://agentic-patterns.com/patterns/inference-healed-code-review-reward/) — quality decomposed into **eight weighted sub-scores** (Naming, Function Size, DRY, KISS, YAGNI, Comments, Error Handling, Side Effects) with chain-of-thought justification per dimension

The `clean-code-reviewer` produces a `## Clean Code Reviewer Perspective` section in `review-N.md` containing:

- A strict **verdict** — `PASS`, `FAIL`, or `FAIL-WITH-CRITICAL`
- An **overall Clean Code score** (0–10, weighted average of the eight dimensions)
- A **sub-score table** with per-dimension score and a one-sentence chain-of-thought citing `file:line`
- A **findings table** with severity, dimension, `file:line`, and concrete fix
- A **dissent paragraph** when its verdict disagrees with the primary reviewer's

**Verdict influence — additive, no independent veto.** AC verification (criterion #2 above) remains the **primary gate**. Clean Code findings are added to the master findings list and evaluated by the **same** severity rules in `workflows/review-story.md` Step 5.1 as any other finding:

- Each `Critical` Clean Code finding counts as one Critical finding for the standard "any Critical finding → CHANGES-NEEDED" rule
- Each `Major` Clean Code finding counts toward the "multiple Major findings → CHANGES-NEEDED" threshold
- Each `Minor` Clean Code finding is reported but does not block approval on its own
- The agent's `PASS` / `FAIL` / `FAIL-WITH-CRITICAL` label is recorded for visibility but does NOT bypass the standard verdict logic

Clean Code is an **extension/optimization** of the existing review — it does not have independent veto power over an AC-satisfying implementation. When the agent's verdict disagrees with the primary verdict, its Dissent paragraph is preserved verbatim in `review-N.md` so the human approver can weigh it at `/scrum-approve`.

Dispatch is handled by the `agent-dispatcher` skill via the `always_in_review_story` section of `data/dispatch-rules.yaml` — see `scrum_workflow/skills/agent-dispatcher/SKILL.md`. The agent's `active_in` list includes `review-story`, so it loads automatically.

### Mandatory Karpathy Guidelines Supplementary Review (Adversarial Critic)

Every `/scrum-review-story` invocation **always** dispatches the `karpathy-guidelines-reviewer` agent at the end of the evaluation phase, regardless of story `type`, `risk_level`, or `domain_tags`. This guarantees that coding-discipline concerns — which the primary reviewer (spec/AC focus) and the Clean Code Reviewer (artifact focus) both routinely under-evaluate — are checked on every story. Where Clean Code asks *is the code well-written?*, Karpathy asks *was the change well-conducted?*.

**Pattern composition** — the agent reuses the same three composable patterns as `clean-code-reviewer` ([AI-Assisted Code Review / Verification](https://www.agentic-patterns.com/patterns/ai-assisted-code-review-verification), [Adversarial Code Review (ASDLC)](https://asdlc.io/patterns/adversarial-code-review/), [Inference-Healed Code Review Reward](https://agentic-patterns.com/patterns/inference-healed-code-review-reward/)) but evaluates four Karpathy dimensions:

- **K1 — Think Before Coding** (assumptions stated and validated before writing code; rationale recorded in `plan.md` / Dev Notes)
- **K2 — Simplicity First** (simplest solution that satisfies the AC; no premature abstraction introduced by *this* story)
- **K3 — Surgical Changes** (diff touches only AC-relevant files; no drive-by refactors or whitespace churn; no mixed feature+refactor)
- **K4 — Goal-Driven Execution** (every modified line traces to an AC, Task, or Dev Note; no gold-plating)

The `karpathy-guidelines-reviewer` produces a `## Karpathy Guidelines Reviewer Perspective` section in `review-N.md` containing:

- A strict **verdict** — `PASS`, `FAIL`, or `FAIL-WITH-CRITICAL`
- An **overall Karpathy score** (0–10, weighted average of the four dimensions)
- A **sub-score table** with per-dimension score and a one-sentence chain-of-thought citing `file:line` (or `file` + diff hunk)
- A **findings table** with severity, dimension, `file:line`, and concrete fix
- A **dissent paragraph** when its verdict disagrees with the primary reviewer's

**Verdict influence — additive, no independent veto.** AC verification (criterion #2 above) remains the **primary gate**. Karpathy findings are added to the master findings list and evaluated by the **same** severity rules in `workflows/review-story.md` Step 5.1 as any other finding:

- Each `Critical` Karpathy finding counts as one Critical finding for the standard "any Critical finding → CHANGES-NEEDED" rule
- Each `Major` Karpathy finding counts toward the "multiple Major findings → CHANGES-NEEDED" threshold
- Each `Minor` Karpathy finding is reported but does not block approval on its own
- The agent's `PASS` / `FAIL` / `FAIL-WITH-CRITICAL` label is recorded for visibility but does NOT bypass the standard verdict logic

**Boundary with the Clean Code Reviewer.** The Karpathy Reviewer runs *after* the Clean Code Reviewer so it can deduplicate against Clean Code findings in its Phase 5 cross-check. K2 (Simplicity First) overlaps with Clean Code D4 (KISS) and D5 (YAGNI); the Karpathy agent marks duplicates `[DUP]` and keeps a K2 finding only if it adds the *process* angle (this should not have been introduced in *this* story) on top of the artifact-level Clean Code finding. K3 (Surgical Changes — diff shape) and K1 (assumption discipline) are unique to this agent.

Dispatch is handled by the same `agent-dispatcher` skill via the `always_in_review_story` section of `data/dispatch-rules.yaml`. The agent's `active_in` list includes `review-story`, so it loads automatically.

### Optional UX Supplementary Review

When the story's `domain_tags` contain `ui`, `ux`, or `ox`, the review command additionally invokes the `ux-reviewer` agent to produce a supplementary UX perspective against the implemented artifact (flows, states, a11y). This is in addition to — not a replacement for — the primary review criteria above. The UX perspective is recorded as a separate section in `review-N.md` and does not block the primary verdict; it contributes findings only.

If the story frontmatter also sets `needs_draft: true`, the `ux-draft-agent` runs **before** `ux-reviewer` in a post-implementation Reflection Loop: it produces a Mermaid flow reconstructed from the implemented behavior (default) or an Excalidraw link (`draft_format: excalidraw`), and `ux-reviewer` critiques that draft against the same rubric it uses in refinement. This catches UX drift between the original refinement draft and what actually shipped.

Dispatch reuses the `agent-dispatcher` skill — see `scrum_workflow/skills/agent-dispatcher/SKILL.md`. Both agents' `active_in` lists include `review-story`, so they load automatically when tags match. If no UI/UX/OX tag is present, neither agent is spawned and review proceeds with the primary reviewer only.

## Status Transitions

```
review → approved         (via /scrum-review-story, verdict: APPROVED)
review → changes-needed   (via /scrum-review-story, verdict: CHANGES-NEEDED)
```

## Error Handling

### Story File Not Found

If the story file does not exist:

```
❌ Status Guard Violation: Story file '_scrum-output/sprints/SW-XXX/story.md' not found

**Details:** The /scrum-review-story command requires an existing story file to process. No file was found at the expected path.

**Next Step:** Ensure the story exists before triggering review. Run '/scrum-create-ticket SW-XXX' to create the story, then complete the development pipeline before running '/scrum-review-story SW-XXX'.
```

### Status Guard Violation

If story is not in `review` status:

```
❌ Status Guard Violation: Story SW-XXX requires 'review' but is currently '{current_status}'

**Details:** The /scrum-review-story command can only execute on stories in 'review' status. The story must first complete implementation.

**Next Step:** Complete implementation first. Run '/scrum-dev-story SW-XXX' to implement the story and submit it for review. The status will automatically move to 'review' when implementation is complete.
```

## Severity Levels

| Severity | Definition | Examples |
|----------|------------|----------|
| **Critical** | Blocks story completion, severe defect | Security vulnerability, data corruption risk, core feature missing |
| **Major** | Impacts quality, not blocking | Architecture violation, missing error handling, incomplete feature |
| **Minor** | Style, optimization, non-essential | Naming convention violation, minor optimization, edge case |

## Relationship to Other Epic 3 Commands

**Important:** This is a review-only command that runs AFTER implementation.

| Command | Purpose | Status Transition | Pattern |
|---------|---------|-------------------|---------|
| `/scrum-refine-ticket` | Multi-agent refinement | `draft` → `refinement` → `refined` | Sub-Agent Spawning |
| `/scrum-refine-story` | Validation-only agent | `refined` → `ready-for-dev` | Feature List as Immutable Contract |
| `/scrum-dev-story` | Implementation-only agent | `ready-for-dev` → `in-progress` → `review` | Inversion of Control |
| `/scrum-review-story` | Review-only agent | `review` → `approved` or `changes-needed` | AI-Assisted Code Review |

**Typical Workflow:**
1. User runs `/scrum-dev-story SW-XXX` to implement (one agent/model)
2. Status moves from `ready-for-dev` → `in-progress` → `review`
3. User runs `/scrum-review-story SW-XXX` to review (different agent/model)
4. Status moves from `review` → `approved` or `changes-needed`
5. If `changes-needed`, developer addresses findings and re-runs `/scrum-dev-story`, then `/scrum-review-story`

## Model Selection Recommendation

**Important:** For best results, use a DIFFERENT model than the one that implemented the story.

**Rationale:**
- Different models have different blind spots
- Reduces groupthink and confirmation bias
- Fresh perspective catches issues the implementer missed
- Example: If implementation used Claude Sonnet, review could use Claude Opus or a different model family

## Write Boundary Rules

This workflow may write:
- `_scrum-output/sprints/SW-XXX/review-N.md` - Review report (NEW file)
- `_scrum-output/sprints/SW-XXX/story.md` - Status field only (`status: approved` or `status: changes-needed`)

This workflow may NOT write:
- `_scrum-output/sprints/SW-XXX/plan.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/refinement.md` - Read-only during review
- `_scrum-output/sprints/SW-XXX/approval-N.md` - Managed by `/scrum-approve`
- Code files in project directory - Review is read-only for code; MUST NOT modify source code
- `scrum_workflow/` - Framework files are read-only during execution

### Anti-Pattern Warning

**Self-Fix:** The review agent MUST NOT modify source code. Review is read-only for code. Modifying source code during review bypasses the separation of implementation and verification — halt and report to the user.

If a write boundary would be violated, halt with:
```
❌ Write Boundary Violation: /scrum-review-story attempted to write '{file_path}'

**Details:** The /scrum-review-story command may only write review-N.md and story.md status updates. Code files and all other artifacts are read-only during review.

**Next Step:** Halt immediately. Do not write the file. Report this boundary violation to the user.
```
