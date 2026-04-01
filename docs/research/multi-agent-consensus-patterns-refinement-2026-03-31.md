---
type: technical_research
topic: Multi-Agent Consensus Patterns for Refinement Workflow
date: 2026-03-31
sources:
  - https://www.agentic-patterns.com/patterns
  - https://github.com/bmad-code-org/BMAD-METHOD/blob/1f99eb0496cac6207dea35240a24dc1bde717bc7/src/core-skills/bmad-party-mode/SKILL.md
research_for: refine-ticket command improvement
ai_optimized: true
version: 1.0
---

# Multi-Agent Consensus Patterns for Refinement Workflow

## Executive Summary

This research identifies optimal patterns for implementing multi-agent discussion and consensus loops in the `refine-ticket` workflow. The goal is to transform the current isolated agent perspective model into a collaborative discussion model where Architect, Developer, and QA agents reach consensus before synthesis.

**Key Findings:**
- **Opponent Processor / Multi-Agent Debate Pattern** surfaces blind spots through structured conflict
- **BMAD Cross-Talk Pattern** enables agents to react to each other's perspectives dynamically
- **Uncorrelated Context Windows** produce genuinely independent perspectives that improve debate quality
- **Max Rounds with Deadlock Detection** prevents infinite loops while ensuring thorough discussion

**Recommended Implementation:**
1. Add explicit **Doc-Discovery Phase** before agent spawning
2. Implement **Cross-Talk Rounds** with progressive truncation (400→300→200 words)
3. Use **Binary Blocker Resolution** instead of complex weighting (blocker vs non-blocker)
4. Add **Security Auto-Blocker** rule for forced escalation of security issues
5. Add **Estimation Phase** using Wideband Delphi with confidence aggregation (min rule)
6. Configure **Max Rounds (3)** with human-in-the-loop deadlock resolution
7. Use **Temp Files** in `sprints/SW-XXX/temp/` for state preservation and audit

**Refined in Party Mode (2026-03-31):**
- Binary blocker classification replaces P1/P2/P3 weighting matrix
- Progressive truncation forces convergence across rounds
- Security issues are auto-blockers (cannot be marked non-blocker)
- Early consensus exit when only non-blockers remain
- Conservative confidence aggregation (lowest wins)

---

## Table of Contents

1. Current State Analysis
2. Recommended Patterns
3. Proposed Workflow Design
4. Implementation Details
5. Configuration Options

---

## 1. Current State Analysis

### Current refine-ticket Flow
```
Story (draft) → Spawn Agents (isolated) → Collect Perspectives → User Accept/Reject → Synthesis → Readiness Check
```

### Identified Gaps
| Gap | Impact |
|-----|--------|
| No explicit doc-discovery | Missing project context, architecture docs, rules |
| No estimation phase | No story points or time estimates |
| Isolated agents | No discussion, no consensus building |
| Binary accept/reject | No iterative refinement of perspectives |

---

## 2. Recommended Patterns

### 2.1 Multi-Agent Debate Pattern (Opponent Processor)

**Source:** agentic-patterns.com

**Concept:**
> "Spawn opposing agents with different goals or perspectives to debate each other's positions. The conflict between agents surfaces blind spots, biases, and unconsidered alternatives."

**Key Insight:**
- Agents with **uncorrelated context windows** produce better debate outcomes
- Each agent should have genuinely independent perspective, not just role-play

**Application to refine-ticket:**
```
Round 1: Architect proposes → Developer critiques → QA validates
Round 2: Architect responds → Developer counter-proposes → QA confirms/rejects
Round 3: Consensus attempt or escalate to user
```

### 2.2 BMAD Cross-Talk Pattern

**Source:** BMAD Party-Mode SKILL.md

**Concept:**
> "The whole point of party mode is that each agent produces a genuinely independent perspective. By spawning each agent as its own subagent process, you get real diversity of thought."

**Cross-Talk Implementation:**
```
After initial perspectives:
1. Spawn Architect with Developer's response as context
2. Ask: "Winston, what do you think about what Amelia said?"
3. Collect cross-commentary
4. Repeat for each agent pair
```

**Context Budget:**
- Keep discussion context under **400 words** per agent spawn
- Truncate previous responses to key points only

### 2.3 Iterative Multi-Agent Brainstorming

**Source:** agentic-patterns.com

**Guidelines:**
- Limit to **2-4 agents** for manageable coordination
- More than **6 agents** adds exponential overhead
- Use synthesis phase after each iteration

---

## 3. Proposed Workflow Design

### Enhanced Refinement Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: DOC-DISCOVERY                       │
├─────────────────────────────────────────────────────────────────┤
│  Prompt: "Are there additional documents I should consider?"    │
│  - Project docs (architecture, guidelines, standards)           │
│  - External references (API docs, specifications)               │
│  - Rules and constraints                                         │
│  User can specify paths or skip                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2: INITIAL PERSPECTIVES                │
├─────────────────────────────────────────────────────────────────┤
│  Spawn 3 agents IN PARALLEL with ISOLATED context:              │
│  - Architect: Architecture risks, patterns, dependencies        │
│  - Developer: Technical feasibility, implementation approach    │
│  - QA: Testability, edge cases, acceptance criteria             │
│  Each agent sees: Story + User-provided docs ONLY               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 3: CROSS-TALK ROUNDS                   │
├─────────────────────────────────────────────────────────────────┤
│  Round 1: Each agent sees others' perspectives                  │
│    - Architect comments on Developer/QA findings                │
│    - Developer comments on Architect/QA findings                │
│    - QA comments on Architect/Developer findings                │
│                                                                  │
│  Round 2 (if needed): Focus on disagreements                    │
│    - Identify conflicts and blind spots                         │
│    - Propose resolutions                                        │
│                                                                  │
│  Round 3 (max): Final consensus attempt                         │
│    - Each agent provides final position                         │
│    - Agreement areas documented                                 │
│    - Disagreements escalated to user                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 4: ESTIMATION                          │
├─────────────────────────────────────────────────────────────────┤
│  Wideband Delphi / Planning Poker approach:                     │
│  1. Each agent independently estimates story points              │
│  2. Estimates revealed simultaneously                            │
│  3. If variance > threshold, discuss and re-estimate            │
│  4. Final estimate: median or consensus                         │
│                                                                  │
│  Output: story_points: X, confidence: high/medium/low           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 5: SYNTHESIS                           │
├─────────────────────────────────────────────────────────────────┤
│  Merge agreed perspectives into story.md                         │
│  Document disagreements in refinement.md with resolution         │
│  Include estimation with confidence level                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 6: READINESS CHECK                     │
├─────────────────────────────────────────────────────────────────┤
│  Validate story completeness                                     │
│  PASS → status: ready, create plan.md                           │
│  FAIL → status: draft, document failure reasons                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Details

### 4.1 Doc-Discovery Prompt

```markdown
## Document Discovery

Before starting refinement, I need to gather all relevant context.

**I will automatically load from:**
- `_scrum-output/context/` (project context files)

**Do you have additional documents I should consider?**

Examples:
- Architecture documentation: `docs/architecture.md`
- API specifications: `docs/api-spec.yaml`
- Technical standards: `docs/coding-standards.md`
- External dependencies: URLs to external docs

Please provide paths or URLs, or type **skip** to proceed with default context.
```

### 4.2 Cross-Talk Agent Spawn Pattern

```javascript
// Round 1: Cross-commentary
const crossTalkPrompts = {
  architect: `You are the Architect reviewing the refinement discussion.

**Your original findings:** [truncated to 200 words]

**Developer's perspective:** [truncated to 150 words]
**QA's perspective:** [truncated to 150 words]

**Task:** Comment on:
1. Where you AGREE with their findings
2. Where you DISAGREE and why
3. Any blind spots they identified that you missed

Keep response under 300 words.`,

  developer: `...similar structure...`,
  qa: `...similar structure...`
};
```

### 4.3 Estimation Phase

```markdown
## Estimation (Wideband Delphi)

Each agent provides independent estimate:

| Agent | Story Points | Confidence | Reasoning |
|-------|--------------|------------|-----------|
| Architect | ? | ? | [hidden until all submitted] |
| Developer | ? | ? | [hidden until all submitted] |
| QA | ? | ? | [hidden until all submitted] |

**After all estimates collected:**
- If variance ≤ 2 points → Use median
- If variance > 2 points → Discuss differences, re-estimate once
- Final estimate documented with confidence level
```

### 4.4 Consensus Detection

```javascript
function detectConsensus(agentResponses) {
  const agreements = [];
  const disagreements = [];

  for (const topic of allTopics) {
    const positions = agentResponses.map(r => r.position[topic]);
    if (positions.every(p => p === positions[0])) {
      agreements.push(topic);
    } else {
      disagreements.push({
        topic,
        positions: positions.map((p, i) => ({
          agent: agents[i],
          position: p
        }))
      });
    }
  }

  return { agreements, disagreements };
}
```

### 4.5 Max Rounds Configuration

```yaml
refinement:
  max_discussion_rounds: 3           # Max cross-talk rounds before escalation
  keep_agent_temp_files: false       # Auto-cleanup temp files after synthesis
  estimation_variance_threshold: 2   # Points variance triggering re-estimation
  early_exit_on_consensus: true      # Exit early if only non-blockers remain
  security_auto_blocker: true        # Force security issues as blockers
```

### 4.6 Temp File Pattern

```bash
sprints/SW-101/
├── temp/                           # Ephemeral temp directory
│   ├── architect-round-0.md        # Full initial analysis
│   ├── developer-round-0.md
│   ├── qa-round-0.md
│   └── discussion-round-1.md       # Cross-talk summaries
├── refinement.md                   # Final output
└── story.md
```

**Benefits:**
- Information preservation across rounds
- Token optimization via file references
- Error recovery from last known state
- Audit trail when `keep_agent_temp_files: true`

### 4.7 Binary Blocker Resolution (Simplified)

Instead of complex P1/P2/P3 weighting matrices:

```
For each disagreement:
  Ask agent: "Does this BLOCK implementation? (Yes/No)"

Blockers = [All Yes responses]
Non-Blockers = [All No responses]

If Blockers.length == 0:
  Proceed to synthesis (early exit)
Else if rounds < max:
  Continue discussion (focus on Blockers only)
Else:
  Escalate to user with Deadlock UX
```

**Security Auto-Blocker Rule:**
Any agent-identified security risk is forced as blocker regardless of classification.

### 4.8 Deadlock UX Pattern

When max rounds reached with unresolved blockers:

```markdown
⚠️ REFINEMENT DEADLOCK nach 3 Runden

Blockierende Punkte:
1. [Architect] API Versioning Strategy
   → Architect: "GraphQL für Flexibilität"
   → Developer: "REST für Einfachheit"

[1] Architect's Vorschlag übernehmen
[2] Developer's Vorschlag übernehmen
[3] Beides ablehnen und User-Entscheidung eingeben
[4] Abbrechen und Story zurück zu Draft
```

### 4.9 Confidence Aggregation Rule

For final estimation confidence:
```
Final Confidence = min(agent_1_confidence, agent_2_confidence, agent_3_confidence)
```

Conservative approach: The lowest confidence determines the final confidence.

---

## 5. Configuration Options

### Command Frontmatter Update

```yaml
---
name: refine-ticket
trigger: "/scrum-refine-ticket"
requires_status: draft
sets_status: refinement
spawns_agents:
  - architect
  - developer
  - qa
features:
  doc_discovery: true       # NEW: Ask for additional docs
  discussion_rounds: 3      # NEW: Cross-talk rounds
  estimation: true          # NEW: Story point estimation
  consensus_required: true  # NEW: Require agent consensus
---
```

### Output Files

**refinement.md structure:**
```markdown
## Document Discovery
- Auto-loaded: [files from _scrum-output/context/]
- User-provided: [additional docs]

## Initial Perspectives
[Architect, Developer, QA isolated views]

## Discussion Rounds
### Round 1
[Cross-commentary]

### Round 2 (if needed)
[Focus on disagreements]

## Consensus Summary
- Agreed: [list]
- Disagreed: [list with user resolution]

## Estimation
| Agent | Points | Confidence |
|-------|--------|------------|
| ... | ... | ... |
| **Final** | X | medium |

## Synthesis
[Merged content for story.md]
```

---

## Sources

- [Agentic Patterns Catalog](https://www.agentic-patterns.com/patterns) - Multi-Agent Debate, Iterative Brainstorming
- [BMAD Party-Mode SKILL.md](https://github.com/bmad-code-org/BMAD-METHOD/blob/1f99eb0496cac6207dea35240a24dc1bde717bc7/src/core-skills/bmad-party-mode/SKILL.md) - Cross-Talk Pattern, Uncorrelated Context Windows
- BMAD Agent Manifest - Agent personas (Winston/Architect, Amelia/Developer, Quinn/QA)

---

**Research Completion Date:** 2026-03-31
**Document Version:** 1.0
**Confidence Level:** High - based on production-validated patterns
