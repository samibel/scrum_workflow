---
domain: index
generated: "2026-04-03"
project: "scrum_workflow"
---

# Project Context Index

## Domains

- architecture
- testing
- backend

## Agent Loading Map

| Agent | Loads |
|---|---|
| Orchestrator | index.md only |
| Architect | index.md, architecture.md, backend.md |
| Developer | index.md, {story-relevant-domain}.md |
| QA | index.md, testing.md, {story-relevant-domain}.md |

## Project Summary

Scrum Workflow is a Markdown-driven, multi-agent scrum framework for AI coding assistants. The framework defines commands, workflows, agent roles (architect, developer, QA), and templates as structured Markdown files interpreted by platforms like Claude Code. It is distributed via a Node.js CLI installer (`create-scrum-workflow`). The core architecture follows a pipeline pattern: commands trigger workflows, which orchestrate agents and fill templates to produce structured output in `_scrum-output/`.

## Generated

- **Date**: 2026-04-03
- **Source**: `/scrum-create-project-context`
