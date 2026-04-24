---
name: scrum-create-concept
description: "Scrum Workflow: Analyze an existing project problem and create a technical solution concept document. Use when the user says 'create concept', 'analyze how to', 'technical concept', or '/scrum-create-concept'. This command researches the codebase, identifies relevant files and patterns, compares solution options with trade-off analysis, and writes a structured concept file. It does NOT implement code and does NOT create a Scrum ticket."
---

Load and execute the framework command at `{{framework_path}}/commands/create-concept.md`.

The command file contains the full workflow orchestration including:
- Problem statement parsing and slug derivation
- Project context loading and codebase research
- Analysis graph construction (problem → files → patterns → options → recommendation)
- Solution option generation with trade-off analysis
- Implementation plan and test strategy creation
- Concept file output to `_scrum-output/concepts/<slug>/concept.md`
