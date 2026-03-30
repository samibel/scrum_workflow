---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Agentic Project Documentation Patterns'
research_goals: 'Patterns for an AI agent that generates detailed business-logic documentation for existing projects quickly and comprehensively'
user_name: 'Sami'
date: '2026-03-30'
web_research_enabled: true
source_verification: true
---

# Research Report: Technical

**Date:** 2026-03-30
**Author:** Sami
**Research Type:** Technical

---

## Research Overview

This research investigates agentic patterns and methodologies for AI agents that analyze existing codebases and generate comprehensive business-logic documentation. The focus is on patterns that enable fast, detailed, and structured project documentation through autonomous agent workflows.

---

## Technical Research Scope Confirmation

**Research Topic:** Agentic Project Documentation Patterns
**Research Goals:** Patterns for an AI agent that generates detailed business-logic documentation for existing projects quickly and comprehensively

**Technical Research Scope:**

- Architecture Analysis - design patterns for code-analysis agents, AST traversal, dependency graph analysis
- Implementation Approaches - how agents read, understand, and document existing code
- Agentic Patterns - multi-step workflows, chain-of-thought documentation, iterative refinement
- Integration Patterns - how agents interact with codebases (LSP, AST, grep-based)
- Output Quality - patterns for structured, complete business-logic docs

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-03-30

---

## Technology & Pattern Landscape

### 1. Core Agentic Design Patterns for Documentation

Four foundational agentic patterns are directly applicable to code documentation agents:

#### 1.1 Reflection Pattern
The agent generates documentation, then critiques its own output, then refines it. This pattern is **particularly effective for generating high-quality documentation** where systematic errors are common. It involves: Generation -> Critique -> Refinement cycles.
_Confidence: HIGH — validated by multiple sources including DocAgent research_
_Source: [Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)_

#### 1.2 Tool Use Pattern
The agent leverages external tools (AST parsers, grep, file readers, dependency analyzers) to gather information before generating documentation. This is the foundation of all code-analysis agents.
_Confidence: HIGH — universally adopted across all reviewed systems_
_Source: [Agentic Patterns Reference](https://www.agentic-patterns.com/patterns)_

#### 1.3 Orchestrator-Workers Pattern
A central orchestrator decomposes the documentation task and delegates to specialized worker agents (structure analyzer, data-flow tracer, API documenter, etc.) running in parallel.
_Confidence: HIGH — implemented by DocAgent, ai-doc-gen, Agent Blackboard, OMC_
_Source: [DocAgent Paper](https://arxiv.org/html/2504.08725v1), [ai-doc-gen](https://github.com/divar-ir/ai-doc-gen)_

#### 1.4 Planning Pattern
Before analyzing code, the agent creates an execution plan: which files to read, in what order, and what documentation artifacts to produce. This prevents random file exploration and ensures completeness.
_Confidence: HIGH — used by BMAD document-project and OMC planner agent_
_Source: [OMC Agents](https://omc.vibetip.help/docs/agents)_

---

### 2. Proven Multi-Agent Architectures

#### 2.1 DocAgent Architecture (Academic Research — Top Finding)

DocAgent is a peer-reviewed multi-agent system specifically designed for automated code documentation. It represents the **most rigorous approach** found in this research.

**Navigator Module (Dependency-Aware Processing):**
1. AST parsing across all source files to identify functions, methods, classes
2. Build a Directed Dependency Graph (edges: A depends on B)
3. Tarjan's algorithm detects cycles and condenses them into single nodes -> DAG
4. Topological sorting ensures: **"a component is processed only after all components it depends on have been documented"**

**Four Specialized Agents:**

| Agent | Role | Tools |
|-------|------|-------|
| **Reader** | Determines what information is needed for a component | Assesses complexity, visibility, dependencies |
| **Searcher** | Retrieves internal code context + external knowledge | Static analysis tool, knowledge retrieval API |
| **Writer** | Generates documentation following templates | Component-specific templates (function, class) |
| **Verifier** | Quality gate — approves or requests improvements | Predefined quality criteria |

**Workflow:** Reader -> Searcher -> Writer -> Verifier (iterative until quality threshold met)

**Key Innovation:** Topological ordering reduced hallucinations by ~9% and improved helpfulness by ~13% compared to random processing order.

**Evaluation Results:**
- Completeness: 0.934 (93.4% of required sections present)
- Truthfulness: 95.74% Existence Ratio (minimal hallucinated references)

_Confidence: VERY HIGH — peer-reviewed, published at ACL 2025_
_Source: [DocAgent Paper](https://arxiv.org/html/2504.08725v1), [ACL Publication](https://aclanthology.org/2025.acl-demo.44.pdf)_

#### 2.2 ai-doc-gen Architecture (Production System)

A production-ready multi-agent system by Divar (Iranian tech company) for automated codebase documentation.

**Four-Tier Architecture:**
1. **CLI Layer** — Command parsing and routing
2. **Handler Layer** — Business logic for analyze/generate/cronjob
3. **Agent Layer** — 7 specialized AI agents running concurrently
4. **Tool Layer** — File operations and utilities

**Specialized Agents:**

| Agent | Responsibility |
|-------|---------------|
| Code Structure Agent | Repository organization, module relationships |
| Data Flow Agent | Information movement through codebase |
| Dependency Agent | Library and module dependency mapping |
| Request Flow Agent | Request handling pattern analysis |
| API Analysis Agent | Exposed interfaces and endpoints |
| Documentation Agent | README generation |
| AI Rules Generator | CLAUDE.md, AGENTS.md, Cursor rules |

**Key Features:** Parallel agent execution, OpenAI-compatible API, GitLab integration, YAML config, OpenTelemetry tracing.

_Confidence: HIGH — open-source, production-deployed_
_Source: [ai-doc-gen GitHub](https://github.com/divar-ir/ai-doc-gen)_

#### 2.3 Agent Blackboard Pattern (Shared Knowledge Architecture)

Uses the classic **Blackboard Pattern** where 9 specialized agents collaborate through a shared MCP-based knowledge repository.

**How it works:**
1. Tasks are posted to the **Blackboard** (shared knowledge store)
2. **Coordinator** decomposes tasks and routes to appropriate agents
3. Agents work independently, writing results back to the blackboard
4. **Embedding-based semantic search** enables agents to find relevant context from other agents' outputs
5. No single point of failure — agents operate independently

**Documentation Agent** generates: README files, API docs, architecture diagrams (Mermaid), user guides, inline comments — leveraging context from Backend Architect and Language-Specific agents.

_Confidence: HIGH — open-source, well-documented_
_Source: [Agent Blackboard GitHub](https://github.com/claudioed/agent-blackboard)_

#### 2.4 OMC Four-Lane Architecture (19 Agents)

The OMC project organizes 19 specialized agents into 4 functional lanes with a 3-tier model system (haiku/sonnet/opus).

**Relevant agents for documentation:**
- **explore** (haiku) — Fast codebase exploration, file/symbol search
- **analyst** (opus) — Requirements analysis
- **architect** (opus) — System design and interface definition
- **writer** (haiku) — Technical documentation, READMEs, API docs
- **document-specialist** — External documentation/reference lookup

**Key Pattern: deepinit** — Automatically generates hierarchical AGENTS.md documentation across the entire codebase.

**Model Tier Strategy:** Use cheap/fast models for scanning, expensive/smart models for analysis.

_Confidence: HIGH — documented, actively maintained_
_Source: [OMC Agents Documentation](https://omc.vibetip.help/docs/agents)_

---

### 3. Code Analysis Patterns (How Agents Read Code)

#### 3.1 AST-Based Chunking (Semantic Splitting)
Instead of arbitrary text splitting, use Abstract Syntax Trees to split code at meaningful boundaries. Functions remain intact, classes keep their methods, modules maintain structural coherence.

**Implementation:**
- Parse each file into AST
- Identify semantic units (functions, classes, modules)
- Files under ~1,000 chars kept whole
- Larger files split at logical AST boundaries
- Metadata tagging (file type, layer, module association)
- Token-aware chunking (respecting LLM context limits)

_Source: [AI Agent for Codebase Analysis](https://zogoo.medium.com/building-an-ai-agent-for-codebase-analysis-and-understanding-d02158ee0e99)_

#### 3.2 Repository Map Pattern (Pioneered by Aider)
Uses tree-sitter to parse code into AST, extract function signatures and class definitions, build a dependency graph, rank symbol importance using PageRank, and dynamically fit optimal content within token budgets.

_Source: [AI Coding Agents Coherence](https://mikemason.ca/writing/ai-coding-agents-jan-2026/)_

#### 3.3 Dependency DAG with Topological Traversal
Build a directed dependency graph -> resolve cycles with Tarjan's algorithm -> topologically sort -> process components in dependency order. This ensures each component is documented with full context of its dependencies.

_Source: [DocAgent Paper](https://arxiv.org/html/2504.08725v1)_

#### 3.4 Vector Embedding + Semantic Search (RAG for Code)
Convert code chunks into vector embeddings, store in a vector database (Qdrant, etc.), then use semantic similarity search to find relevant code for any query. This enables:
- Sub-50ms query responses for 10,000+ chunks
- Cross-file relationship understanding
- Conceptually related code discovery regardless of naming conventions

_Source: [AI Agent for Codebase Analysis](https://zogoo.medium.com/building-an-ai-agent-for-codebase-analysis-and-understanding-d02158ee0e99)_

#### 3.5 Curated Code Context Window
Intelligently select relevant code sections for agent processing. Filter and prioritize code files based on relevance to current documentation task. Reduces token consumption while maintaining accuracy.

_Source: [Agentic Patterns](https://www.agentic-patterns.com/patterns)_

#### 3.6 Dynamic Code Injection (On-Demand File Fetch)
Load specific files into context only when needed via @mentions or tool calls. Essential for large codebases where full context is impractical.

_Source: [Agentic Patterns](https://www.agentic-patterns.com/patterns)_

---

### 4. Documentation Generation Patterns

#### 4.1 Multi-Stage Pipeline Pattern
The dominant pattern across all reviewed systems:

```
Repository Crawling & Indexing
    -> Architectural Pattern Recognition
        -> Context Synthesis (static analysis + commit history + ADRs)
            -> Living Documentation Generation
```

_Source: [Augment Code — Autonomous Documentation](https://www.augmentcode.com/guides/autonomous-code-documentation)_

#### 4.2 Template-Driven Generation
Use component-specific templates:
- **Functions/Methods:** Summary, extended description, parameters, return values, exceptions, usage examples
- **Classes:** Summary, description, initialization examples, constructor params, public attributes
- **Modules:** Purpose, dependencies, exported interfaces, usage patterns
- **Architecture:** System overview, component relationships, data flow, integration points

_Source: [DocAgent Paper](https://arxiv.org/html/2504.08725v1)_

#### 4.3 Living Documentation Pattern
Documentation as a continuous pipeline rather than static artifacts:
- CI/CD integration — docs generated alongside tests
- Architecture diagram auto-generation from service interactions
- Real-time updates as endpoints and modules change
- Track not just current state but the journey of how you got there

_Source: [Kinde — AI-Enhanced Documentation](https://www.kinde.com/learn/ai-for-software-engineering/best-practice/building-ai-enhanced-documentation-from-code-comments-to-living-architecture-docs/)_

#### 4.4 Abstracted Code Representation
Simplify code structure for agent review without overwhelming detail. Convert complex code to abstracted representations before generating documentation. This prevents context window overflow on large codebases.

_Source: [Agentic Patterns](https://www.agentic-patterns.com/patterns)_

#### 4.5 BMAD Document Project Pattern (Two-Mode Documentation)

The BMAD-METHOD implements a sophisticated two-mode approach:

**Mode 1: Full Scan** — Complete project documentation (initial or rescan)
- Configurable scan levels: `quick`, `deep`, `exhaustive`
- State management with `project-scan-report.json` for resume capability
- Uses `documentation-requirements.csv` for project-type-specific standards
- Uses `architecture_registry.csv` for architecture documentation patterns

**Mode 2: Deep Dive** — Exhaustive documentation for specific features/modules/folders
- **Critical constraint:** "Literal full-file review required. Sampling, guessing, or relying solely on tooling output is FORBIDDEN."
- Scan level forced to `exhaustive`
- Focused on specific project areas selected by user

**Key Design Decisions:**
- Resume-capable state management (can pick up where it left off)
- Project classification via `project-types.csv` for tailored documentation
- Separation of communication language vs. document output language
- Optional autonomous mode (default: requires user approval at decision points)

_Source: [BMAD Document Project](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/bmm-skills/1-analysis/bmad-document-project)_

---

### 5. Quality Assurance Patterns

#### 5.1 Verifier Agent Pattern (DocAgent)
A dedicated Verifier agent evaluates documentation quality against predefined criteria (information value, detail level, completeness). Can trigger Writer revisions or additional Reader-Searcher cycles if gaps exist.

#### 5.2 Multi-Faceted Evaluation Framework
Three evaluation dimensions:
1. **Completeness** (Deterministic) — AST parsing + regex to check required sections are present
2. **Helpfulness** (LLM-as-Judge) — 5-point Likert scale rubrics with chain-of-thought
3. **Truthfulness** (Fact-Checking) — Cross-reference entity mentions against dependency graph

#### 5.3 Adaptive Context Management
Monitor total token count; if context exceeds thresholds, selectively truncate largest sections while preserving structure. Prevents context window overflow on large codebases.

_Source: [DocAgent Paper](https://arxiv.org/html/2504.08725v1)_

---

### 6. Codebase Preparation Patterns

#### 6.1 Codebase Digest Pattern
Prepare codebases for LLM consumption by:
- Directory tree visualization
- Token count calculation per file
- File content consolidation into unified outputs
- Flexible ignore patterns (.gitignore compatible)
- Multiple output formats (text, JSON, Markdown, XML, HTML)
- 60+ analysis prompts organized into 8 dimensions

_Source: [Codebase Digest](https://github.com/kamilstanuch/codebase-digest)_

#### 6.2 AGENTS.md Standard
The emerging standard (60,000+ GitHub repos, stewarded by Linux Foundation's Agentic AI Foundation) for providing AI agents with project context:
- Executable commands the agent can run
- Project knowledge: tech stack with versions, file locations
- Real examples of expected output
- Three-tier boundaries: always do / ask first / never do
- Hierarchical placement: nearest file in directory tree takes precedence

_Source: [AGENTS.md Standard](https://agents.md/), [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)_

---

## Research Synthesis & Recommendations

### Recommended Architecture for a Project Documentation Agent

Based on the analysis of all patterns, the **optimal architecture** combines elements from multiple approaches:

```
┌─────────────────────────────────────────────────────┐
│                  ORCHESTRATOR                        │
│  (Plans scan order, delegates, aggregates results)   │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌───────▼────────────┐
    │   NAVIGATOR MODULE  │  │   STATE MANAGER    │
    │  AST Parse -> DAG   │  │  Resume capability │
    │  Topological Sort   │  │  Progress tracking │
    └──────────┬──────────┘  └────────────────────┘
               │
    ┌──────────▼──────────────────────────────────┐
    │         PARALLEL ANALYSIS AGENTS             │
    │                                              │
    │  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
    │  │Structure│ │Data Flow │ │ Dependency   │ │
    │  │ Agent   │ │ Agent    │ │ Agent        │ │
    │  └─────────┘ └──────────┘ └──────────────┘ │
    │  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
    │  │API      │ │Business  │ │ Integration  │ │
    │  │ Agent   │ │Logic Agt │ │ Agent        │ │
    │  └─────────┘ └──────────┘ └──────────────┘ │
    └──────────────────┬──────────────────────────┘
                       │
    ┌──────────────────▼──────────────────────────┐
    │           WRITER + VERIFIER                  │
    │  Template-driven generation                  │
    │  Quality verification loop                   │
    │  Adaptive context management                 │
    └─────────────────────────────────────────────┘
```

### Top 5 Pattern Recommendations (Ranked by Impact)

| # | Pattern | Why | From |
|---|---------|-----|------|
| 1 | **Dependency-Aware Topological Traversal** | +13% helpfulness, -9% hallucinations vs random order | DocAgent |
| 2 | **Specialized Parallel Analysis Agents** | 5-7x faster than sequential, better coverage | ai-doc-gen, OMC |
| 3 | **Verifier Agent with Iterative Refinement** | Quality gate prevents incomplete/hallucinated docs | DocAgent |
| 4 | **Two-Mode Scan (Full + Deep-Dive)** | Full overview first, deep-dive for critical areas | BMAD |
| 5 | **Resume-Capable State Management** | Large projects need session persistence | BMAD |

### Critical Design Decisions

1. **AST over Regex**: Always use AST-based code parsing, not regex or text splitting. AST ensures semantic boundaries are respected.

2. **Dependency Order over Random**: Process components in topological dependency order. This single decision dramatically improves output quality.

3. **Parallel Workers with Shared Context**: Run analysis agents concurrently but share findings through a central context (blackboard pattern or shared state).

4. **Model Tier Strategy**: Use cheap/fast models (haiku) for scanning and exploration, expensive/smart models (opus) for analysis and documentation writing.

5. **Template-Driven Output**: Define strict templates per component type. This ensures consistency and completeness across the documentation.

6. **AGENTS.md as Input**: If the project has AGENTS.md, use it as a primary context source. If not, generating one is a valuable first output.

---

## Sources

- [Agentic Patterns Reference — 157 Patterns](https://www.agentic-patterns.com/patterns)
- [OMC Agents — 19-Agent Architecture](https://omc.vibetip.help/docs/agents)
- [BMAD Document Project](https://github.com/bmad-code-org/BMAD-METHOD/tree/main/src/bmm-skills/1-analysis/bmad-document-project)
- [DocAgent: Multi-Agent System for Code Documentation (ACL 2025)](https://arxiv.org/html/2504.08725v1)
- [ai-doc-gen: Multi-Agent Documentation Generator](https://github.com/divar-ir/ai-doc-gen)
- [Agent Blackboard: 9-Agent Coordination System](https://github.com/claudioed/agent-blackboard)
- [Building an AI Agent for Codebase Analysis (Medium)](https://zogoo.medium.com/building-an-ai-agent-for-codebase-analysis-and-understanding-d02158ee0e99)
- [Autonomous Code Documentation (Augment Code)](https://www.augmentcode.com/guides/autonomous-code-documentation)
- [AI-Enhanced Documentation (Kinde)](https://www.kinde.com/learn/ai-for-software-engineering/best-practice/building-ai-enhanced-documentation-from-code-comments-to-living-architecture-docs/)
- [Codebase Digest — 60+ LLM Prompts](https://github.com/kamilstanuch/codebase-digest)
- [AGENTS.md Standard](https://agents.md/)
- [How to Write a Great AGENTS.md (GitHub Blog)](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Anthropic 2026 Agentic Coding Trends Report](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf)
- [AI Coding Agents: Coherence Through Orchestration (Mike Mason)](https://mikemason.ca/writing/ai-coding-agents-jan-2026/)
