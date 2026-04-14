---
name: scrum-review-story
description: "Scrum Workflow: Perform AI-assisted code review using a separate agent from the implementer. Use when the user says 'review story', 'code review', or '/scrum-review-story'."
---

Load and execute the framework command at `{{framework_path}}/commands/review-story.md`.

The command file contains the full workflow orchestration including:
- Separate review agent (different model from implementation)
- Evaluation against specification alignment and acceptance criteria
- Structured findings with severity levels and suggested fixes
- Story status transition to approved or changes-needed
