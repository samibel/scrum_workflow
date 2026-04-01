---
name: scrum-review-story
trigger: /scrum-review-story
description: Perform AI-assisted code review using a separate agent from the implementer. Use when the user says 'review story', 'code review', or '/scrum-review-story'.
framework_command: "{framework_commands}/review-story.md"
---

# Review Story (Code Review Agent)

This skill registers the `review-story` command from the Scrum framework.

**Framework Command File:** `{framework_commands}/review-story.md`

**Note:** `{framework_commands}` resolves to `{framework_path}/commands/` where `framework_path` is set in `config.yaml`.

Load the framework command file to execute this command.
