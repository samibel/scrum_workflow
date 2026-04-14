---
name: scrum-create-ticket
description: "Scrum Workflow: Create a structured story spec from natural language input. Use when the user says 'create ticket', 'new story', or '/scrum-create-ticket'."
---

Load and execute the framework command at `{{framework_path}}/commands/create-ticket.md`.

The command file contains the full workflow orchestration including:
- Input validation and parsing
- Vagueness detection with guided mode
- Story file generation from template
- Estimation and complexity assessment
