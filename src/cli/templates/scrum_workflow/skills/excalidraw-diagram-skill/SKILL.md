---
name: excalidraw-diagram-skill
role: "optional-visual-draft"
description: "Accepts, validates, and records an Excalidraw URL for a story draft or a project-doc diagram. Used as an opt-in visual companion to Mermaid in the refinement and project-doc workflows."
actor: excalidraw-diagram-skill
version: 0.1.0
---

# Identity

The `excalidraw-diagram-skill` is a lightweight, opt-in skill that lets a user attach an Excalidraw diagram as a **visual companion** to a refinement story or to a project-doc artifact. Mermaid remains the default diagram format across the workflow; Excalidraw is used only when a story or command explicitly opts in.

This skill is a stub: it handles URL capture, validation, and structured recording. Programmatic generation of Excalidraw scenes (via an external Excalidraw MCP server) is out of scope for this version and is listed under **Future Work**.

# Instructions

## Invocation

This skill is invoked from:

1. **`/scrum-refine-ticket`** — only when the story frontmatter sets `draft_format: excalidraw`. The skill is called by the `ux-draft-agent` as a helper to populate the `excalidraw_url` slot in the draft.
2. **`/scrum-create-project-docs`** — only when the command runs with `--with-excalidraw` (or the user confirms the interactive prompt). The skill supplements Mermaid diagrams with an Excalidraw link per generated doc.

The skill must **never block** the calling workflow when Excalidraw is unavailable.

## Algorithm

### Step 1: Check Opt-In

Read the caller's opt-in signal:

- For `refine-ticket`: `draft_format: excalidraw` in story frontmatter
- For `create-project-docs`: `--with-excalidraw` flag or confirmed interactive prompt

If the opt-in is absent, return `{ status: "skipped", reason: "not opted in" }` and exit.

### Step 2: Acquire URL

Prefer, in order:

1. A URL already provided in the story frontmatter or command input (`excalidraw_url: ...`).
2. An interactive prompt asking the user to paste an Excalidraw URL. The prompt **must accept** `"skip"` or empty input and fall back without error.
3. If an Excalidraw MCP server is configured (future work), call the server to generate a new scene. Not required for v0.1.

### Step 3: Validate

Validate the URL shape:

- Must start with `https://`.
- Host must match `excalidraw.com` or a self-hosted variant explicitly allow-listed in `config.yaml` under `excalidraw.allowed_hosts`.
- Reject anything else with a structured error; do not exfiltrate arbitrary URLs to the workflow artifact.

### Step 4: Record

Write the captured entry as a structured block into the calling context:

```yaml
excalidraw:
  url: "https://excalidraw.com/#json=..."
  title: "{{short description}}"
  related_story_id: "SW-XXX"      # for refine-ticket
  related_doc: "workflows.md"     # for create-project-docs
  recorded_at: "{{ISO_8601}}"
```

### Step 5: Graceful Fallback

If any step fails (no URL, invalid URL, MCP unavailable):

- Return `{ status: "fallback", reason: "<short reason>" }`.
- The calling workflow records `"Excalidraw: none provided (fallback: Mermaid only)"` in its artifact.
- **Never halt** the refinement or project-doc generation because of a missing Excalidraw link.

## Future Work

- Two-way MCP integration to **generate** Excalidraw scenes from a Mermaid source or from a natural-language description.
- Rendering Excalidraw exports (PNG/SVG) inline next to Mermaid, for readers who need a static preview.
- Multi-scene linking for project-doc artifacts with many diagrams.

# Output Format

The skill returns a structured result to the caller:

```yaml
status: "recorded" | "skipped" | "fallback"
reason: "<human-readable explanation>"
entry:
  url: "<https://... or null>"
  title: "<short description or null>"
  related_story_id: "<SW-XXX or null>"
  related_doc: "<doc name or null>"
  recorded_at: "<ISO 8601 or null>"
```

# Context Rules

## Reads

- Story frontmatter `draft_format` and `excalidraw_url` (refine-ticket path)
- Command flag `--with-excalidraw` and any command-scope `excalidraw_url` (create-project-docs path)
- `config.yaml` optional key `excalidraw.allowed_hosts`
- Standard interactive input channel (user prompt)

## Writes

This skill does not write to source files directly. It returns a structured result that the calling workflow embeds into:

- `_scrum-output/sprints/SW-XXX/refinement.md` (via `ux-draft-agent` output)
- `_scrum-output/docs/*.md` (via the `/scrum-create-project-docs` workflow, under a "Visual Diagrams (Optional)" section)

No file I/O happens inside this skill; all persistence goes through the caller.
