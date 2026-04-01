---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['https://github.com/A-EVO-Lab/a-evolve', 'https://arxiv.org/abs/2602.00359']
workflowType: 'research'
lastStep: 5
research_type: 'technical'
research_topic: 'A-Evolve Framework - Universal Agent Evolution Infrastructure'
research_goals: 'Complete project description for an AI agent with no prior knowledge'
user_name: 'Sami'
date: '2026-03-31'
web_research_enabled: true
source_verification: true
---

# Research Report: A-Evolve — Universal Agent Evolution Infrastructure

**Date:** 2026-03-31
**Author:** Sami
**Research Type:** Technical

---

## Research Overview

This report provides a comprehensive description of the **A-Evolve** framework (GitHub: `A-EVO-Lab/a-evolve`) — an open-source infrastructure for automatically evolving autonomous AI agents. The goal is to produce a document that gives an AI agent with zero prior knowledge a full understanding of the project's purpose, architecture, concepts, and usage.

**Methodology:** Web research of the GitHub repository, the associated arXiv paper (2602.00359), and third-party technical coverage. All claims verified against primary sources.

---

## 1. What Is A-Evolve?

A-Evolve is an open-source Python framework that enables **automatic evolution of AI agents** — without manual engineering. It is described as "The PyTorch for Agentic AI."

**Core thesis:** Static LLM training is insufficient for real-world deployment. Instead of relying on fixed pipelines, agents should **actively diagnose their own failures and generate durable improvements** through continuous, automated evolution of their state.

**Origin:** Released March 25, 2026, as the official implementation of the research paper:
> "Position: Agentic Evolution is the Path to Evolving LLMs" (Lin, Lu, Shi et al., arXiv:2602.00359, submitted January 30, 2026)

**License:** MIT
**Language:** Python (requires ≥3.11)
**Package name:** `agent-evolve` (import as `agent_evolve`)

---

## 2. The Filesystem Contract — How Agent State Is Structured

### 2.1 The Core Principle

> **All evolvable agent state resides in a filesystem directory structure.**

This is the single most important design decision in A-Evolve. The evolution engine mutates agents by performing **file operations** — editing prompts, adding skills, modifying config, appending memory — without needing to understand the agent's internal architecture. Any agent that follows this filesystem contract can be evolved.

### 2.2 The Agent Workspace Structure

```
my_agent/
├── manifest.yaml           # Agent identity, config, evolution control
├── prompts/
│   ├── system.md           # Primary system instructions
│   └── [fragments/]        # Reusable prompt fragments
├── skills/
│   ├── skill_name/
│   │   └── SKILL.md        # Skill definition with YAML frontmatter
│   └── _drafts/            # Candidate skills not yet promoted
├── tools/
│   ├── registry.yaml       # Tool registry (YAML)
│   └── [tool_name.py]      # Individual tool implementations
├── memory/
│   └── [category].jsonl    # Episodic memories as JSON lines
└── evolution/
    ├── observations/       # Timestamped JSONL batch files
    ├── history.jsonl        # Per-cycle evolution records
    └── metrics.json         # Aggregated evolution stats
```

### 2.3 The Manifest — Agent Identity and Evolution Control

The `manifest.yaml` is the agent's self-description and evolution configuration. Its schema (from `contract/manifest.py`):

```python
@dataclass
class Manifest:
    name: str                                    # Agent identifier
    version: str = "0.1.0"                       # Semantic version
    contract_version: str = "1.0"                # FS contract version
    entrypoint: str | None = None                # Python dotted path to BaseAgent subclass
    agent_type: str = "reference"                # "reference" | "custom"
    evolvable_layers: list[str] = ["prompts", "skills", "memory"]  # What CAN be mutated
    reload_strategy: str = "hot"                 # "hot" (in-process) | "cold" (restart)
```

**Critical field: `evolvable_layers`** — This is the permission system for evolution. By default, only `prompts`, `skills`, and `memory` are evolvable. Tools are NOT in the default set. An agent can restrict or expand what the evolution engine is allowed to touch.

### 2.4 The Four Evolvable Layers — Deep Dive

#### Layer 1: Prompts (`prompts/`)

**What it contains:**
- `system.md` — The agent's primary system prompt (required)
- Fragment files — Reusable prompt sections that can be composed

**How the workspace API works:**
```python
workspace.read_prompt()                    # → str: reads system.md
workspace.write_prompt(content)            # Overwrites system.md
workspace.read_fragment("error_handling")  # Reads a named fragment
workspace.write_fragment("retry", content) # Writes/creates a fragment
workspace.list_fragments()                 # Lists all fragment names
```

**What evolution does to prompts:**
- Rewrites the system prompt to fix failure patterns (e.g., adding explicit instructions for edge cases)
- Adds new fragments for specific task types
- Enforces length constraints (default max: 4000 chars) — truncation preserves seed content
- Restores identity paragraphs if the evolver accidentally removes them

**Evolution intensity is graduated by performance:**

| Pass Rate | Prompt Mutations Allowed? |
|-----------|--------------------------|
| ≥90% + stable | No changes |
| ≥90% | No prompt changes (skills only) |
| ≥85% | Conditional |
| ≥70% | Yes, targeted |
| <70% | Yes, comprehensive rewrite |

#### Layer 2: Skills (`skills/`)

**What it contains:**
Each skill is a directory with a `SKILL.md` file containing YAML frontmatter (name, description) and the skill content. Skills are reusable code functions the agent can invoke during task solving.

**How the workspace API works:**
```python
workspace.list_skills()                    # → list[SkillMeta] from SKILL.md frontmatter
workspace.read_skill("multi_req_handler")  # → str: full skill content
workspace.write_skill("new_skill", content)# Creates/overwrites a skill
workspace.delete_skill("bad_skill")        # Removes entire skill directory
workspace.list_drafts()                    # Draft skills in _drafts/
workspace.write_draft("candidate", content)# Write candidate skill
workspace.clear_drafts()                   # Remove all drafts
```

**What evolution does to skills:**
- **Auto-seeding:** When failure patterns cross thresholds (e.g., ≥3 multi-requirement misses), the engine injects targeted skills automatically:
  - `build_multi_req_skill()` — Teaches extraction→planning→execution→verification for multi-step tasks
  - `build_entity_verification_skill()` — Ensures correct entity identification before proceeding
  - `build_claim_type_skill()` — Generates type-specific guidance for weak claim types (calculate, compare, aggregate, identify_entity, etc.)
- **LLM-generated skills:** The evolver LLM can create entirely new skills via bash tool access to the workspace directory
- **Quality enforcement:**
  - Skills <20 characters are removed (empty/broken)
  - Duplicate skills detected via Jaccard word overlap >0.6
  - Maximum skill count enforced (default: 15)
  - Batch-specific overfitting patterns stripped

**SkillForge algorithm** — dedicated skill evolution:
- Captures `skills_before` and `skills_after` each cycle
- Tracks skill additions and removals separately
- Uses holdout-based gating to accept/reject skill mutations
- Config flags: `evolve_skills`, `max_skills`, `protect_skills` (prevent deletion of specific skills)

#### Layer 3: Memory (`memory/`)

**What it contains:**
Episodic memories stored as JSONL files, organized by category. Each line is a JSON object with a timestamp and content.

**How the workspace API works:**
```python
workspace.add_memory(entry, category="general")  # Appends to category.jsonl
workspace.read_memories("errors", limit=10)       # Last N entries from category
workspace.read_all_memories(limit=50)             # Aggregated, with _category metadata
```

**What evolution does to memory:**
- **Pruning:** Memory files are capped (default: 15 entries) to prevent context bloat
- **Memory-first evolution (guided_synth):** The `guided_synth` algorithm prioritizes building up episodic memory as its primary evolution vector — the agent learns from accumulated experience rather than prompt/skill changes
- **Selective enrichment:** The evolver can append diagnostic entries based on failure analysis

#### Layer 4: Tools (`tools/`)

**What it contains:**
- `registry.yaml` — YAML file listing available tools and their configurations
- Individual tool implementations as Python files

**How the workspace API works:**
```python
workspace.read_tool_registry()              # → dict from YAML
workspace.write_tool_registry(registry)     # Overwrites registry YAML
workspace.read_tool("search")               # → str: Python tool code
workspace.write_tool("search", code)        # Creates/overwrites tool file
```

**What evolution does to tools:**
- **NOT evolvable by default** — `evolvable_layers` defaults to `["prompts", "skills", "memory"]`
- Tools are only mutated if explicitly enabled in `manifest.yaml`
- The `adaptive_evolve` engine does auto-correct hallucinated tool names in prompts/skills via `McpAutoCorrector`
- SkillForge config flag: `evolve_tools` (boolean, off by default)

### 2.5 Workspace Validation

The `schema.py` module validates workspace conformance:

```python
def validate_workspace(root: Path) -> list[str]:
    # Required: manifest.yaml must exist with "name" field
    # Required: prompts/system.md must exist
    # Required: contract_version must match CURRENT_CONTRACT_VERSION ("1.0")
    # Auto-created: skills/, tools/, memory/ directories (created if missing)
```

---

## 3. The Evolution Loop — How Agent Layers Get Mutated

### 3.1 Overview

The `EvolutionLoop` class (in `engine/loop.py`, ~191 lines) orchestrates the full cycle. It is **engine-agnostic** — it provides infrastructure while a pluggable `EvolutionEngine` subclass determines *how* mutations are generated.

### 3.2 Data Flow Through the Loop

```
┌─────────────────────────────────────────────────────────────┐
│                    EVOLUTION CYCLE N                         │
│                                                             │
│  ┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐
│  │SOLVE │───▶│ OBSERVE  │───▶│ EVOLVE │───▶│ GATE │───▶│  RELOAD  │
│  │      │    │          │    │        │    │      │    │          │
│  │Agent │    │Collect   │    │LLM     │    │Hold- │    │Agent     │
│  │solves│    │trajecto- │    │mutates │    │out   │    │reloads   │
│  │tasks │    │ries &    │    │work-   │    │vali- │    │from FS   │
│  │      │    │feedback  │    │space   │    │dation│    │          │
│  └──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘
│      │            │              │             │            │
│      ▼            ▼              ▼             ▼            ▼
│  Trajectory   Observation    Git tag       Accept/      Hot or
│  + Feedback   JSONL batch    pre-evo-N     Reject       Cold
│               files          + evo-N       mutation     reload
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Phase 1: SOLVE — Agent Attempts Tasks

```python
tasks = self.benchmark.get_tasks(split="train", limit=self.config.batch_size)
for task in tasks:
    trajectory = self.agent.solve(task)           # Agent works on the task
    feedback = self.benchmark.evaluate(task, trajectory)  # Benchmark scores it
    observations.append(Observation(task=task, trajectory=trajectory, feedback=feedback))
```

**Core data types:**
```python
@dataclass
class Task:
    id: str
    input: str                          # The task description
    metadata: dict[str, Any] = {}

@dataclass
class Trajectory:
    task_id: str
    output: str                         # Agent's final output
    steps: list[dict[str, Any]] = []    # Step-by-step execution trace
    conversation: list[dict[str, Any]] = []  # Full LLM conversation

@dataclass
class Feedback:
    success: bool
    score: float                        # 0.0 ~ 1.0
    detail: str                         # Rich diagnostic text for the evolver
    raw: dict[str, Any] = {}            # Benchmark-specific raw data

@dataclass
class Observation:
    task: Task
    trajectory: Trajectory
    feedback: Feedback
```

The `Feedback.detail` field is critical — it contains **rich diagnostic text** that the evolution engine's LLM will use to decide what to mutate. This is how the benchmark communicates *why* something failed, not just *that* it failed.

### 3.4 Phase 2: OBSERVE — Collect and Persist Data

```python
self.agent.export_to_fs()                          # Agent exports state to workspace
batch_path = self.observer.collect(observations)   # Persisted as JSONL
cycle_score = sum(o.feedback.score...) / len(observations)
```

The `Observer` writes each observation as a JSONL record containing:
- **Flat fields:** task_id, agent_output, steps, success, score, feedback_detail, timestamp
- **Nested structures:** task (id, input, metadata), trajectory (output, steps), feedback (success, score, detail, claims array, raw data)

Observations are stored in timestamped batch files: `evolution/observations/batch-001.jsonl`, `batch-002.jsonl`, etc.

**Analytics methods:**
- `observer.get_recent_logs(n_batches=3)` — Returns the N most recent batch files for analysis
- `observer.get_summary_stats()` — Computes total observations, success rates, average scores across all history

### 3.5 Phase 3: EVOLVE — LLM-Driven Mutation of Agent Layers

This is where the agent layer actually gets modified. The loop creates a **pre-evolution snapshot**, then delegates to the pluggable engine:

```python
# Pre-evolution snapshot
self.versioning.commit(
    message=f"pre-evo-{cycle_num}: score={cycle_score:.3f}",
    tag=f"pre-evo-{cycle_num}"
)

# Engine decides and applies mutations
step_result = self.engine.step(
    workspace=self.agent.workspace,     # AgentWorkspace object
    observations=observations,          # This cycle's observations
    history=self.history,               # Full evolution history
    trial=self.trial                    # Trial runner for holdout testing
)
```

**How the AdaptiveEvolveEngine mutates layers (8-phase pipeline):**

**Phases 1-3: Multi-Layer Analysis**
1. Base analysis: hallucination detection, pass rates per task
2. Code execution analysis: patterns in tool usage and errors
3. Adaptive analysis: claim-type breakdown, task-type performance, judge feedback mining, systematic failure pattern detection

**Phase 4: Deterministic Auto-Corrections**
- Hallucinated tool names fixed via `McpAutoCorrector` (scans prompts and skills for tool references that don't exist)
- Memory pruned to cap (default: 15 entries per category)

**Phase 5: Pattern-Triggered Skill Injection**
When failure patterns cross thresholds, skills are auto-seeded without LLM involvement:
- ≥3 multi-requirement misses → inject `multi_req_handler` skill
- Entity identification failures → inject `entity_verification` skill
- Specific claim type weak → inject `claim_type_[type]` skill

**Phase 6: LLM-Driven Mutation**
The evolver LLM receives:
- System prompt with meta-learning guidance
- Detailed analysis (claim-type failures, task-type performance, judge feedback patterns, failure patterns with suggested fixes, code execution analysis, tool/strategy error counts)
- Evolution history of last 10 cycles (what worked, what didn't)
- Current workspace state and permission constraints
- **Bash tool access** to directly read/write files in the workspace

The LLM is explicitly instructed: *"IF pass rate > 85%: Make 0-1 changes maximum"* and *"Quality over quantity. One targeted fix beats five generic changes."*

**Phase 7: Deterministic Sanity Checks (Post-Mutation)**
- Prompts exceeding max chars are truncated (preserving seed content)
- Empty skills (<20 chars) are removed
- Duplicate skills detected (Jaccard word overlap >0.6) and deduplicated
- Batch-specific overfitting patterns stripped
- Skill count limits enforced
- Identity paragraphs restored if accidentally deleted

**Phase 8: Stagnation Detection and Rollback**
- Tracks improvement threshold (default: 2% pass rate increase required)
- After N cycles (default: 5) without meeting threshold, calculates degradation
- Rolls back to best git-tagged state if degradation >5% OR best pass rate <90%

### 3.6 Phase 4: GATE — Holdout Validation

The `GatingStrategy` (from `skillforge/gating.py`) prevents regressions:

```python
class GatingStrategy:
    def __init__(self, holdout_ratio=0.2, min_score_threshold=0.0):
        ...

    def validate(self, agent, benchmark, n_holdout=3) -> bool:
        holdout_tasks = benchmark.get_tasks(split="holdout", limit=n_holdout)
        scores = []
        for task in holdout_tasks:
            trajectory = agent.solve(task)
            feedback = benchmark.evaluate(task, trajectory)
            scores.append(feedback.score)
        avg_score = sum(scores) / len(scores)
        return avg_score >= self.min_score_threshold
```

The mutated agent must perform at or above the minimum threshold on held-out tasks. If it fails, the mutation is rejected.

### 3.7 Phase 5: RELOAD — Agent Reinitializes

```python
if step_result.mutated:
    self.versioning.commit(
        message=f"evo-{cycle_num}: {step_result.summary}...",
        tag=f"evo-{cycle_num}"
    )
self.agent.reload_from_fs()   # Agent reads its updated workspace
```

The reload strategy is defined in `manifest.yaml`:
- **`hot`** — Agent reloads in-process (reads updated files, reinitializes state)
- **`cold`** — Agent process restarts entirely

### 3.8 Git-Based Version Control

Every mutation is tracked via the `VersionControl` class wrapping Git:

```python
class VersionControl:
    def commit(self, message, tag=None)        # Stage all, commit, optionally tag
    def rollback(self, ref="HEAD~1")           # Restore as NEW commit (history preserved)
    def rollback_to_tag(self, tag)             # Restore to specific evo-N state
    def get_diff(from_ref, to_ref)             # Compare any two points
    def show_file_at(ref, filepath)            # Read file at historical point
    def checkout_copy(ref, dest)               # Create git worktree for parallel testing
```

**Key design choice:** Rollbacks create a **new commit** rather than `git reset --hard`. The rejected mutation is preserved in history for later inspection.

**Tag naming:** `evo-0` (initial state), `pre-evo-1` (before cycle 1 mutations), `evo-1` (after cycle 1 mutations), `pre-evo-2`, `evo-2`, etc.

### 3.9 Convergence Detection

The loop terminates early when scores plateau:

```python
def _is_score_converged(scores, window=3, epsilon=0.01) -> bool:
    """Score hasn't improved by more than epsilon in `window` cycles."""
    if len(scores) < window + 1:
        return False
    baseline = scores[-(window + 1)]
    return all(abs(s - baseline) < epsilon for s in recent)
```

### 3.10 Cycle Record and Metrics

Each cycle produces a `CycleRecord`:
```python
@dataclass
class CycleRecord:
    cycle: int
    score: float
    mutated: bool
    engine_name: str
    summary: str               # What the engine changed
    observation_batch: str     # Reference to JSONL batch
    metadata: dict[str, Any]   # Engine-specific details
```

Two persistent files track evolution progress:
- **`evolution/history.jsonl`** — One record per cycle (append-only)
- **`evolution/metrics.json`** — Aggregated stats (best score, averages, completion count)

Final result after all cycles:
```python
@dataclass
class EvolutionResult:
    cycles_completed: int
    final_score: float
    score_history: list[float]
    converged: bool
    details: dict[str, Any]
```

---

## 4. Architecture and Codebase Structure

### Package Structure

```
agent_evolve/
├── agents/             # Agent implementations (BaseAgent interface)
├── algorithms/         # Evolution algorithm implementations
│   ├── adaptive_evolve/    # Feedback-driven mutations
│   ├── adaptive_skill/     # Workspace mutation with bash tool access
│   ├── guided_synth/       # Memory-first evolution
│   └── skillforge/         # LLM-driven mutation with gating
├── benchmarks/         # Benchmark adapter implementations
├── contract/           # Filesystem contract definitions
│   ├── manifest.py         # Agent manifest schema
│   ├── schema.py           # Data structure schemas
│   └── workspace.py        # Workspace configuration
├── engine/             # Core evolution engine
│   ├── base.py             # Base classes
│   ├── history.py          # Historical tracking
│   ├── loop.py             # Main evolution loop orchestration
│   ├── observer.py         # Observation and monitoring
│   ├── trial.py            # Trial execution management
│   └── versioning.py       # Git-based version control
├── llm/                # LLM provider integrations
├── protocol/           # Protocol definitions
├── utils/              # Utility functions
├── api.py              # Primary public API (ae.Evolver)
├── config.py           # Configuration management
└── types.py            # Type definitions
```

### Pluggable "Bring Your Own" Design

The framework is built around three interchangeable axes:

| Axis | Description | Interface |
|------|-------------|-----------|
| **BYOA** (Agent) | Any agent architecture — from simple ReAct loops to complex multi-agent systems | Implement `BaseAgent.solve()` |
| **BYOE** (Environment) | Any benchmark or environment — SWE-bench sandboxes, CLI-based systems, custom tasks | Implement `BenchmarkAdapter` |
| **BYO-Algo** (Algorithm) | Any evolution strategy — LLM-driven mutation, reinforcement learning, hybrid approaches | Extend `EvolutionEngine.step()` |

### LLM Provider Support

- **Anthropic** (Claude models)
- **OpenAI**
- **AWS Bedrock**
- **LiteLLM** (universal adapter)

---

## 5. Reference Evolution Algorithms

Four evolution algorithms ship as reference implementations:

### adaptive_evolve
- **Strategy:** Feedback-driven mutations
- **Used on:** MCP-Atlas benchmark
- **How it works:** Analyzes observation data and generates targeted prompt/config mutations based on failure patterns

### adaptive_skill
- **Strategy:** Workspace mutation with bash tool access
- **Used on:** Terminal-Bench 2.0
- **How it works:** The evolution engine has access to bash tools and can create/modify skill files and tool configurations

### skillforge
- **Strategy:** LLM-driven mutation with quality gating
- **Used on:** SkillsBench
- **How it works:** Generates candidate skill mutations, then applies strict gating to filter out regressions

### guided_synth
- **Strategy:** Memory-first evolution
- **Used on:** SWE-bench Verified
- **How it works:** Prioritizes building up the agent's episodic memory as the primary evolution vector

---

## 6. Built-In Benchmarks and Results

Four benchmark adapters ship with reference implementations. Results achieved with **Claude Opus 4.6 as base model**, zero manual harness engineering:

| Benchmark | Domain | Score | Rank | Improvement |
|-----------|--------|-------|------|-------------|
| **SWE-bench Verified** | Real-world GitHub issues | 76.8% | ~#5 | +2.6pp |
| **MCP-Atlas** | Multi-tool coordination | 79.4% | #1 | +3.4pp |
| **Terminal-Bench 2.0** | CLI operations in containers | 76.5% | ~#7 | +13.0pp |
| **SkillsBench** | Agentic skill discovery | 34.9% | #2 | +15.2pp |

**Notable result:** On MCP-Atlas, the evolution process took a generic 20-line prompt and evolved it into an agent with **five newly-authored skills** — entirely automatically.

---

## 7. Installation and Basic Usage

### Installation

```bash
git clone https://github.com/A-EVO-Lab/a-evolve.git && cd a-evolve
pip install -e ".[all,dev]"
```

### Dependencies

**Core:** matplotlib, pyyaml, swebench
**Optional groups:** anthropic, openai, bedrock, litellm, swe, mcp, skillbench, dev

### Basic Usage

```python
import agent_evolve as ae

# Evolve an agent against a benchmark
evolver = ae.Evolver(
    agent="swe-verified",       # Agent name or path to workspace directory
    benchmark="swe-verified"    # Benchmark adapter name
)
results = evolver.run(cycles=10)  # Run 10 evolution cycles
```

### Custom Agent

```python
# Point to your own agent workspace directory
evolver = ae.Evolver(
    agent="./my_agent",          # Path to custom workspace
    benchmark="swe-verified"
)
results = evolver.run(cycles=10)
```

---

## 8. Key Concepts Summary for Agent Context

If you are an AI agent reading this for the first time, here are the critical mental models:

1. **A-Evolve is NOT about training/fine-tuning LLMs.** It evolves the *agent layer* — prompts, skills, tools, memory, config — while the underlying LLM stays frozen.

2. **The filesystem IS the interface.** Everything the evolution engine needs to modify lives as files in a standard directory structure. This is what makes it universal — any agent that follows the workspace contract can be evolved.

3. **Evolution is autonomous and iterative.** The system runs Solve→Observe→Evolve→Gate→Reload cycles without human intervention. Each cycle produces measurable improvement.

4. **Git provides the safety net.** Every mutation is tagged. If a mutation regresses performance, the system can roll back. Full history is preserved.

5. **It's modular by design.** You can swap the agent, the benchmark, the algorithm, and the LLM provider independently. The framework doesn't prescribe any of these — it provides the orchestration.

6. **The "evolution-scaling hypothesis"** is the paper's core theoretical claim: adaptation capacity scales with compute allocated to evolution — analogous to how training performance scales with training compute.

---

## 10. Implementation in Claude Code — Mapping A-Evolve Concepts to Claude Code Primitives

This section maps A-Evolve's evolution concepts onto Claude Code's native extension points (Skills, Hooks, Memory, CLAUDE.md, Subagents) and identifies matching **Agentic Patterns** from [agentic-patterns.com](https://www.agentic-patterns.com/patterns).

### 10.1 The Natural Mapping: A-Evolve Workspace → Claude Code Project

A-Evolve's filesystem contract maps almost 1:1 to Claude Code's project structure:

| A-Evolve Layer | Claude Code Equivalent | Location |
|----------------|----------------------|----------|
| `manifest.yaml` | `CLAUDE.md` + skill frontmatter | `CLAUDE.md`, `.claude/skills/*/SKILL.md` |
| `prompts/system.md` | `CLAUDE.md` + skill `workflow.md` | Project root + `.claude/skills/` |
| `skills/` | Skills directory | `.claude/skills/` |
| `tools/` | MCP servers + tool configs | `.claude/settings.json` → `mcpServers` |
| `memory/` | Auto-memory system | `~/.claude/projects/<path>/memory/MEMORY.md` |
| `evolution/` | Git history + execution logs | `.git/` + custom log directory |

**Key insight:** Claude Code **already has** a filesystem-based agent state contract. The `.claude/` directory IS the workspace. Skills are files. Memory is files. CLAUDE.md is the system prompt. Evolution = modifying these files across sessions.

### 10.2 Implementing Each Evolution Phase in Claude Code

#### Phase 1: SOLVE → Normal Claude Code Execution

Claude Code already does this — every time you invoke a skill or give Claude a task, it "solves" it. No special implementation needed.

#### Phase 2: OBSERVE → Hooks + Execution Logs

**Claude Code mechanism:** PostToolUse hooks capture execution outcomes.

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": { "tool_name": "*" },
        "command": "bash .claude/hooks/observe.sh"
      }
    ]
  }
}
```

The hook script appends structured JSONL entries to an observation log:
```bash
#!/bin/bash
# .claude/hooks/observe.sh
echo "{\"tool\":\"$TOOL_NAME\",\"success\":$EXIT_CODE,\"timestamp\":\"$(date -u +%FT%TZ)\"}" \
  >> .claude/evolution/observations.jsonl
```

**Matching Agentic Pattern:** [Memory Synthesis from Execution Logs](https://www.agentic-patterns.com/patterns/memory-synthesis-from-execution-logs) — A two-tier system where (1) task diaries record structured logs per execution, and (2) synthesis agents periodically analyze entries to extract reusable patterns.

#### Phase 3: EVOLVE → Self-Improving Skills + Meta-Prompt Loop

This is the core innovation. Three approaches, from simple to sophisticated:

**Approach A: Manual Review Cycle (Human-in-the-Loop)**
Use a dedicated `/evolve-review` skill that:
1. Reads observation logs from Phase 2
2. Analyzes failure patterns across recent executions
3. Proposes specific mutations to skills/prompts/memory
4. Presents changes for user approval before applying

**Approach B: Auto-Research Evolution (Karpathy Method)**
Based on [Andrej Karpathy's Auto Research approach](https://medium.com/@shubhjain191/how-to-make-your-claude-code-skills-self-improving-using-auto-research-803ff97d5483):
1. Define an **eval set** — 4-6 binary yes/no criteria per skill
2. Run the skill N times, evaluate outputs against criteria
3. If pass rate < threshold, an evolver agent rewrites the skill's `workflow.md`
4. Re-run and compare — keep the better version
5. The variable being optimized is the **prompt inside the skill file itself**

**Approach C: Self-Improving Agent Plugin**
The [self-improving-agent](https://github.com/alirezarezvani/claude-skills/tree/main/engineering-team/self-improving-agent) skill implements a full evolution pipeline:
- `/si:review` — Analyzes auto-memory for promotion candidates
- `/si:promote` — Graduates patterns from MEMORY.md → CLAUDE.md (equivalent to A-Evolve's skill promotion)
- `/si:extract` — Converts recurring patterns into standalone reusable skills
- Key insight: Moving a pattern from MEMORY.md to CLAUDE.md **changes its priority** — CLAUDE.md is always loaded, MEMORY.md is truncated at 200 lines

**Matching Agentic Patterns:**
- [Self-Rewriting Meta-Prompt Loop](https://www.agentic-patterns.com/patterns/self-rewriting-meta-prompt-loop) — Agent reflects on episodes, proposes prompt modifications, validates changes, and persists updated prompts
- [Iterative Prompt & Skill Refinement](https://www.agentic-patterns.com/patterns/iterative-prompt-skill-refinement) — Four-mechanism improvement: responsive feedback, owner-led refinement, Claude-enhanced refinement, dashboard tracking
- [Compounding Engineering](https://www.agentic-patterns.com/patterns/compounding-engineering-pattern) — Document insights from each development cycle and embed them into reusable agent instructions (system prompts, slash commands, hooks, subagents)

#### Phase 4: GATE → Eval Sets + CI Feedback

**Claude Code mechanism:** Run evaluations before accepting mutations.

```
# Pseudocode for a gating skill
1. Git tag current state: `pre-evo-N`
2. Apply proposed mutations to skill files
3. Run eval set (binary criteria against test outputs)
4. If pass_rate >= threshold → accept, git tag `evo-N`
5. If pass_rate < threshold → git checkout pre-evo-N, reject mutation
```

For CI-integrated gating, use Claude Code's background agents:
- Push mutations to a feature branch
- CI runs automated tests
- Background agent polls for results
- Accept/reject based on CI outcome

**Matching Agentic Patterns:**
- [Canary Rollout and Automatic Rollback](https://www.agentic-patterns.com/patterns/canary-rollout-and-automatic-rollback-for-agent-policy-changes) — Stage rollouts to restricted scope, track quality metrics, trigger automatic rollback when safeguards fail. Apply semantic versioning to policy changes.
- [Coding Agent CI Feedback Loop](https://www.agentic-patterns.com/patterns/coding-agent-ci-feedback-loop) — Asynchronous CI integration with partial feedback ingestion and autonomous iteration

#### Phase 5: RELOAD → Claude Code Session Restart / Hot Reload

**Claude Code mechanism:** Skills modified in `.claude/skills/` activate immediately without session restart (since January 2026). Memory changes in `MEMORY.md` are loaded at conversation start.

- **Hot reload:** Skill file changes take effect immediately within the session
- **Cold reload:** Start a new Claude Code session to pick up CLAUDE.md changes

### 10.3 Implementing the Four Evolvable Layers

#### Prompts Layer → CLAUDE.md + Skill workflow.md

```
project/
├── CLAUDE.md                          # Global system prompt (always loaded)
├── .claude/
│   └── skills/
│       └── my-skill/
│           ├── SKILL.md               # Skill identity + trigger
│           └── workflow.md            # Skill-specific prompt (evolvable)
```

**Evolution strategy:**
- Low performers: Rewrite `workflow.md` with improved instructions
- High performers: Only append edge-case handling to CLAUDE.md
- Use `Versioned Constitution Governance` pattern — all CLAUDE.md changes go through git with semantic versioning

**Matching Pattern:** [Versioned Constitution Governance](https://www.agentic-patterns.com/patterns/versioned-constitution-governance) — Version-controlled rules in Git, agents can propose changes but gatekeepers retain merge authority, semantic versioning (MAJOR for safety changes)

#### Skills Layer → .claude/skills/

```
.claude/skills/
├── analyze-code/
│   ├── SKILL.md          # Frontmatter: name, description, trigger
│   └── workflow.md       # Implementation prompt
├── create-tests/
│   ├── SKILL.md
│   └── workflow.md
└── _drafts/              # Candidate skills not yet promoted
    └── new-pattern/
        ├── SKILL.md
        └── workflow.md
```

**Evolution strategy:**
- Auto-seed skills when failure patterns are detected (like A-Evolve's `build_multi_req_skill()`)
- Use `_drafts/` directory for candidate skills before promotion
- Track skill additions/removals in evolution log
- Enforce quality: remove skills that don't improve eval scores

**Matching Pattern:** [Skill Library Evolution](https://www.agentic-patterns.com/patterns/skill-library-evolution) — Skills progress: ad-hoc → saved → reusable → documented → agent capability. Progressive disclosure via lazy loading reduces context consumption by ~91%.

#### Memory Layer → Auto-Memory System

```
~/.claude/projects/<project-path>/memory/
├── MEMORY.md             # Index file (max 200 lines, always loaded)
├── user_preferences.md   # Individual memory files
├── feedback_patterns.md
└── project_context.md
```

**Evolution strategy:**
- PostToolUse hooks capture error patterns → write to memory
- `/si:review` skill periodically analyzes memory for patterns
- Proven patterns graduate: MEMORY.md → CLAUDE.md (priority upgrade)
- Stale memories pruned to stay under 200-line cap
- Equivalent to A-Evolve's memory pruning (default: 15 entries)

**Matching Pattern:** [Episodic Memory Retrieval & Injection](https://www.agentic-patterns.com/patterns/episodic-memory-retrieval-injection) — Vector-indexed episodic memory with record, retrieve (top-k similar), and prune (TTL/decay) operations

#### Tools Layer → MCP Servers

```json
// .claude/settings.json
{
  "mcpServers": {
    "github": { "command": "gh-mcp", "args": [...] },
    "database": { "command": "db-mcp", "args": [...] }
  }
}
```

**Evolution strategy:**
- Like A-Evolve, tools are NOT evolved by default — too risky
- Auto-correct hallucinated tool names in prompts/skills (equivalent to `McpAutoCorrector`)
- Use `includeTools` for lazy loading to reduce context (Skill Library Evolution pattern)

### 10.4 Safety and Guard Rails

**Matching Pattern:** [Hook-Based Safety Guard Rails](https://www.agentic-patterns.com/patterns/hook-based-safety-guard-rails-for-autonomous-code-agents) — Four essential hooks for autonomous agents:

1. **Dangerous Command Blocker** (PreToolUse: Bash) — Block `rm -rf`, `git reset --hard`, etc.
2. **Syntax Checker** (PostToolUse: Edit/Write) — Run linters after file modifications
3. **Context Window Monitor** (PostToolUse: All) — Warn when approaching context limits
4. **Autonomous Decision Enforcer** (PreToolUse: AskUserQuestion) — Force explicit decisions in unattended mode

For evolution-specific safety:
- **Pre-evolution git tags** before any mutation (exactly like A-Evolve's `pre-evo-N` tags)
- **Rollback as new commit** — never destructive `git reset --hard`
- **Stagnation detection** — if N cycles produce no improvement, stop evolving and alert the user

### 10.5 Complete Architecture: A-Evolve-Style Evolution Loop in Claude Code

```
┌──────────────────────────────────────────────────────────────────┐
│                  CLAUDE CODE EVOLUTION CYCLE                      │
│                                                                  │
│  ┌───────────┐   ┌──────────────┐   ┌────────────┐   ┌────────┐│
│  │  EXECUTE   │──▶│   OBSERVE    │──▶│   EVOLVE   │──▶│  GATE  ││
│  │            │   │              │   │            │   │        ││
│  │ Run skill  │   │ PostToolUse  │   │ Evolver    │   │ Eval   ││
│  │ or task    │   │ hooks write  │   │ skill      │   │ set    ││
│  │ normally   │   │ JSONL logs   │   │ analyzes + │   │ checks ││
│  │            │   │              │   │ mutates    │   │        ││
│  └───────────┘   └──────────────┘   └────────────┘   └────────┘│
│       │                │                  │               │      │
│       ▼                ▼                  ▼               ▼      │
│  Agent output    observations.jsonl  Modified files   Accept/   │
│                                      in .claude/     Reject +  │
│                                                      git tag   │
│                                                                  │
│  Files that get evolved:                                         │
│  ├── CLAUDE.md              (system prompt)                      │
│  ├── .claude/skills/*/      (skill prompts)                      │
│  ├── memory/MEMORY.md       (episodic memory)                    │
│  └── .claude/settings.json  (tool config — opt-in only)          │
└──────────────────────────────────────────────────────────────────┘
```

### 10.6 Summary: All Matching Agentic Patterns

| A-Evolve Concept | Agentic Pattern | Category |
|-------------------|----------------|----------|
| Filesystem workspace contract | [Filesystem-Based Agent State](https://www.agentic-patterns.com/patterns/filesystem-based-agent-state) | Context & Memory |
| Skill creation and evolution | [Skill Library Evolution](https://www.agentic-patterns.com/patterns/skill-library-evolution) | Learning & Adaptation |
| Self-rewriting prompts | [Self-Rewriting Meta-Prompt Loop](https://www.agentic-patterns.com/patterns/self-rewriting-meta-prompt-loop) | Orchestration |
| Multi-mechanism refinement | [Iterative Prompt & Skill Refinement](https://www.agentic-patterns.com/patterns/iterative-prompt-skill-refinement) | Feedback Loops |
| Learning from execution history | [Memory Synthesis from Execution Logs](https://www.agentic-patterns.com/patterns/memory-synthesis-from-execution-logs) | Context & Memory |
| Cumulative improvement | [Compounding Engineering](https://www.agentic-patterns.com/patterns/compounding-engineering-pattern) | Feedback Loops |
| Episodic memory with retrieval | [Episodic Memory Retrieval & Injection](https://www.agentic-patterns.com/patterns/episodic-memory-retrieval-injection) | Context & Memory |
| Holdout validation / gating | [Canary Rollout and Automatic Rollback](https://www.agentic-patterns.com/patterns/canary-rollout-and-automatic-rollback-for-agent-policy-changes) | Reliability & Eval |
| CI-based feedback | [Coding Agent CI Feedback Loop](https://www.agentic-patterns.com/patterns/coding-agent-ci-feedback-loop) | Feedback Loops |
| Git-versioned governance | [Versioned Constitution Governance](https://www.agentic-patterns.com/patterns/versioned-constitution-governance) | Security & Safety |
| Safety hooks | [Hook-Based Safety Guard Rails](https://www.agentic-patterns.com/patterns/hook-based-safety-guard-rails-for-autonomous-code-agents) | Security & Safety |
| Reflection and self-critique | [Reflection Loop](https://www.agentic-patterns.com/patterns/reflection-loop) | Feedback Loops |

---

## 11. Sources

### A-Evolve Primary Sources
- [GitHub Repository: A-EVO-Lab/a-evolve](https://github.com/A-EVO-Lab/a-evolve)
- [arXiv Paper: Position: Agentic Evolution is the Path to Evolving LLMs (2602.00359)](https://arxiv.org/abs/2602.00359)
- [MarkTechPost: Meet A-Evolve — The PyTorch Moment For Agentic AI Systems](https://www.marktechpost.com/2026/03/29/meet-a-evolve-the-pytorch-moment-for-agentic-ai-systems-replacing-manual-tuning-with-automated-state-mutation-and-self-correction/?amp=)
- [MarkTechPost: How to Build and Evolve a Custom OpenAI Agent with A-Evolve](https://www.marktechpost.com/2026/03/31/how-to-build-and-evolve-a-custom-openai-agent-with-a-evolve-using-benchmarks-skills-memory-and-workspace-mutations/)
- [Dev|Journal: Amazon Researchers Release A-Evolve](https://earezki.com/ai-news/2026-03-29-meet-a-evolve-the-pytorch-moment-for-agentic-ai-systems-replacing-manual-tuning-with-automated-state-mutation-and-self-correction/)

### Agentic Patterns (agentic-patterns.com)
- [Skill Library Evolution](https://www.agentic-patterns.com/patterns/skill-library-evolution)
- [Filesystem-Based Agent State](https://www.agentic-patterns.com/patterns/filesystem-based-agent-state)
- [Self-Rewriting Meta-Prompt Loop](https://www.agentic-patterns.com/patterns/self-rewriting-meta-prompt-loop)
- [Iterative Prompt & Skill Refinement](https://www.agentic-patterns.com/patterns/iterative-prompt-skill-refinement)
- [Memory Synthesis from Execution Logs](https://www.agentic-patterns.com/patterns/memory-synthesis-from-execution-logs)
- [Compounding Engineering](https://www.agentic-patterns.com/patterns/compounding-engineering-pattern)
- [Episodic Memory Retrieval & Injection](https://www.agentic-patterns.com/patterns/episodic-memory-retrieval-injection)
- [Canary Rollout and Automatic Rollback](https://www.agentic-patterns.com/patterns/canary-rollout-and-automatic-rollback-for-agent-policy-changes)
- [Coding Agent CI Feedback Loop](https://www.agentic-patterns.com/patterns/coding-agent-ci-feedback-loop)
- [Versioned Constitution Governance](https://www.agentic-patterns.com/patterns/versioned-constitution-governance)
- [Hook-Based Safety Guard Rails](https://www.agentic-patterns.com/patterns/hook-based-safety-guard-rails-for-autonomous-code-agents)

### Claude Code Implementation References
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Self-Improving Agent Skill for Claude Code](https://github.com/alirezarezvani/claude-skills/tree/main/engineering-team/self-improving-agent)
- [How to Make Claude Code Skills Self-Improving Using Auto Research](https://medium.com/@shubhjain191/how-to-make-your-claude-code-skills-self-improving-using-auto-research-803ff97d5483)
- [Everything Claude Code — Agent Harness Performance Optimization](https://github.com/affaan-m/everything-claude-code)
- [Awesome Claude Code — Curated Skills, Hooks, and Orchestrators](https://github.com/hesreallyhim/awesome-claude-code)
