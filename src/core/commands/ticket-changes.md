---
name: ticket-changes
trigger: "/scrum-ticket-changes"
requires_status: any
sets_status: none
pattern: observability
model_recommendation: "haiku"
---

## Purpose

Generate a **follow-along coding tutorial** for a ticket (or a set of tickets) so a reader can re-implement the change step by step by reading the document and typing the code into their own editor.

The output is **prose**, not an annotated diff. The agent reorganises the raw git changes into a numbered sequence of *steps*, where each step:

- introduces a goal in plain language,
- tells the reader **which file to open** and **where in the file** to make the change (function name, class, region near a recognisable line),
- presents the **new code** as small, retypeable snippets with imperative instructions ("Add the following…", "Replace the body of `handleLogin` with…", "Delete the legacy block at the top of the file"),
- explains, between snippets, **what the code does** and **why it is needed** in everyday language,
- finishes with a **Verify** checkpoint so the reader can confirm they implemented the step correctly.

The reader should be able to clone an empty repository, follow the steps in order, and end up with a working version of the same change. Pure lifecycle metadata (status transitions, refinement perspectives, review rounds) is **not** the focus of this command — those belong to `/scrum-audit-trail`.

## Agentic Pattern

**Pattern:** [Plan-Then-Execute] + [Observability]

**Key Principles:**
- **Code-first:** The unit of explanation is a file change (or a hunk), not a status transition.
- **Reuse, don't reinvent:** Pull diffs from git, rationale from `plan.md` / commit messages, intent from `story.md` description and acceptance criteria.
- **Read-mostly:** Only writes happen inside `_scrum-output/tutorials/` — never modify source artifacts or the working tree.
- **Idempotent:** Re-running the command on the same ticket overwrites the previous tutorial deterministically.

## Workflow Reference

workflows/ticket-changes.md

## Input

```
/scrum-ticket-changes SW-XXX
/scrum-ticket-changes SW-001 SW-002 SW-003
/scrum-ticket-changes --epic 8
/scrum-ticket-changes --all
```

- **Ticket number(s)**: One or more `SW-XXX` IDs (zero-padded, three digits).
- **`--epic N`**: Generate a tutorial for every story tagged with `epic: N` in `story.md` frontmatter.
- **`--all`**: Generate tutorials for every story directory under `_scrum-output/sprints/`.
- **Prerequisite**: At least one of `_scrum-output/sprints/SW-XXX/story.md` or commits referencing the ticket ID must exist. If neither is present the ticket is skipped with a notice.

## Options

| Option | Description |
|--------|-------------|
| `--format markdown` | Render as Markdown tutorial (default). |
| `--format json` | Emit structured JSON of the file-change model for downstream tooling. |
| `--split` | Multi-file mode: write one file per changed source file under `_scrum-output/tutorials/SW-XXX/files/`, plus a `README.md` landing page that links them all. Auxiliary assets (full raw diffs) live under `assets/diffs/`. |
| `--context-lines <N>` | Number of unchanged lines to include around each hunk in the Before/After blocks. Default: `5`. |
| `--max-hunk-lines <N>` | Hunks longer than this are summarised and the full diff moved to `assets/diffs/<short-sha>.diff` (or inlined behind a `<details>` block in single-file mode). Default: `60`. |
| `--include <glob>` | Only include files matching the glob (repeatable). |
| `--exclude <glob>` | Exclude files matching the glob (repeatable). Defaults: lock files, `dist/`, `build/`, binary assets. |
| `--no-diagrams` | Disable the auto-generated Mermaid diagrams per step. By default the renderer emits one Mermaid block per step that fits a small whitelist (flowchart for routing/control flow, sequence for cross-service calls, stateDiagram for status/lifecycle code, classDiagram for OOP structure). Steps that don't fit any category get no diagram. |
| `--no-diff-appendix` | Disable the per-file *Before / After / Why* appendix at the end of the tutorial. By default every tutorial ends with `## Appendix — Full diff per file`, where each touched file is rendered as a collapsible `<details>` block containing its full Before snippet, full After snippet, and a one-paragraph rationale, so the reader has a complete reference of what changed without re-walking the steps. |
| `--bundle <name>` | When multiple tickets are requested, write a single combined file `_scrum-output/tutorials/<name>-tutorial.md` instead of one file per ticket. Mutually exclusive with `--split`. |
| `--since <ISO-date>` | Only include commits authored on or after the given ISO 8601 timestamp. |

## Output

The agent MAY create multiple files per run when the chosen mode requires it (split mode, large-diff extraction). Per-ticket tutorials always live **inside the ticket's own directory** (`_scrum-output/sprints/SW-XXX/tutorials/`), next to `story.md`, `plan.md`, etc. Cross-ticket bundles are the only exception — they aggregate multiple tickets and live under `_scrum-output/tutorials/`.

### Single Ticket — Single File (default)

```
_scrum-output/sprints/SW-XXX/tutorials/tutorial.md
```

### Single Ticket — Split (`--split`)

One file per **tutorial step** (not per file change), plus a `README.md` landing page. Raw diffs are written under `assets/`:

```
_scrum-output/sprints/SW-XXX/tutorials/
├── README.md              # landing page; introduction + ordered links to every step
├── 00-introduction.md     # What you'll build / Why / Prerequisites / What you'll learn
├── steps/
│   ├── 01-wire-up-login-route.md
│   ├── 02-store-session-token.md
│   └── 03-cover-with-tests.md
├── 98-recap.md            # Putting it all together + What you learned
├── 99-reference.md        # Files touched table + commit list + totals
├── 100-appendix-diffs.md  # default-on; one <details> block per touched file (Before / After / Why)
                           # — omitted entirely when --no-diff-appendix is passed
└── assets/
    └── diffs/
        └── <short-sha>.diff   # full raw diffs for hunks that exceeded --max-hunk-lines
```

Each `steps/NN-<slug>.md` is a self-contained mini-tutorial with the same Open / Locate / Action / What this does / Verify layout described above, so a reader can complete a single step in one sitting and come back later for the next one. The `100-appendix-diffs.md` file mirrors the appendix described in the Tutorial Structure section above and is linked from `README.md` underneath the step list.

### Multiple Tickets (default)

Each ticket gets its own tutorial inside its own ticket directory — there is no shared output folder. A combined index is written at `_scrum-output/sprints/tutorials-index.md` linking to every per-ticket tutorial:

```
_scrum-output/sprints/tutorials-index.md
_scrum-output/sprints/SW-001/tutorials/tutorial.md
_scrum-output/sprints/SW-002/tutorials/tutorial.md
```

In `--split` mode, each ticket's directory uses the layout shown above and the index links to every per-ticket `README.md`.

### Bundled (`--bundle release-1`)

A bundle aggregates several tickets into one document and therefore cannot live under a single ticket directory. Bundles are the only artifact this command writes outside `sprints/`:

```
_scrum-output/tutorials/release-1-tutorial.md
```

`--bundle` is mutually exclusive with `--split` — passing both halts with an error.

## Tutorial Structure (Markdown)

Every generated tutorial follows the layout below. The voice is second person ("you'll add", "open the file"), the tone is friendly and explanatory, and code snippets are kept small enough to type. Steps are organised by **logical change**, not by file — one step may touch several files when the change requires it.

1. **Frontmatter** — `ticket`, `title`, `final_status`, `generated`, `commit_count`, `files_changed`, `additions`, `deletions`.

2. **Introduction** (`## Introduction`)
   - **What you'll build**: one paragraph derived from `story.md` description, rephrased in second person.
   - **Why it matters**: one paragraph derived from `plan.md` rationale or the first acceptance criterion.
   - **Prerequisites**: bullet list inferred from the touched files (language/runtime, frameworks, test runners, CLI tools). When unsure, add `*(adapt to your stack)*` rather than guessing.
   - **What you'll learn**: 2–4 bullets that summarise the takeaways.

3. **Steps** (`## Step N — <title>`) — one step per logical change. Map commits to steps in this order of preference:
   - When `plan.md` exists and its plan steps reference the same files as a single commit, use the plan step text as the step title.
   - Otherwise, use the commit subject (without the `feat:`/`fix:` prefix) as the step title.
   - Squash trivial follow-up commits ("typo", "lint", "format") into the previous step.

   Each step contains:

   - **Goal** — one sentence ("In this step you'll wire up the login route so the form posts to the new endpoint.").
   - For every file change in the step, in stable path order:
     - **Open `<relative path>`** — short header. When `changeType === "added"` say *Create a new file at* instead.
     - **Locate** — one sentence telling the reader where in the file to make the change. Derived from the unified-diff context: enclosing function/class/section name (parsed from hunk headers `@@ … @@`), or "near the top of the file" / "below the existing imports" when no enclosing scope is present. Skip this for newly-created files.
     - **Action** — imperative sentence with a verb chosen from the hunk shape:
       - pure addition (`oldLines === 0`) → "Add the following:"
       - pure deletion (`newLines === 0`) → "Delete this block:" (show the removed code so the reader recognises what to delete)
       - modification → "Replace it with:"
       - rename only → "Rename `<old>` to `<new>`."
     - **Code block** — the *new* code (or the deleted code for pure deletions), fenced with the language tag inferred from the file extension. When the hunk is too large to type comfortably, split it into multiple back-to-back code blocks separated by short prose ("…and right below, paste:").
     - **What this does** — one to three sentences in plain language explaining the snippet. Combine the plan step text, commit subject, and any matching acceptance criterion into a flowing paragraph; do **not** simply paste raw commit metadata.
   - **Diagram** *(default on; suppressed by `--no-diagrams`)* — at most one Mermaid block per step, placed once after all edits in the step and before the Verify line. Picked from a small deterministic whitelist (flowchart / sequence / stateDiagram / classDiagram) based on the step's touched paths and snippet content. Steps that don't match any whitelist signal emit no diagram — never invent one to fill the slot.
   - **Verify** — checkpoint with a concrete check derived from the step:
     - if a test file was touched in the step → `Run \`<test runner> <test path>\` — it should now pass.`
     - if the step touches a CLI command → `Try \`<command>\` and confirm <expected output>.`
     - otherwise → `Reload the app / re-run the build and confirm <observable behaviour from the AC>.`

4. **Putting it all together** (`## Putting it all together`) — one paragraph that explains how the steps fit together end-to-end and points to the affected acceptance criteria.

5. **What you learned** (`## What you learned`) — 3–6 bullets with the takeaways (patterns, APIs, idioms used).

6. **Reference** (`## Reference`)
   - **Files touched** — table `File | + | − | Step(s)`.
   - **Commits** — bullet list `<short-sha> — <subject>`.
   - **Total** — single line `Total: N files, +X / -Y lines across M commits`.

7. **Appendix — Full diff per file** (`## Appendix — Full diff per file`) — *default on; suppressed by `--no-diff-appendix`*. After the prose tutorial, every touched file is rendered once more as a complete reference rather than a teachable step. The whole section is wrapped in a single `<details><summary>Full diff per file (N files)</summary> … </details>` block so it stays collapsed in GitHub and most Markdown viewers; readers can expand it on demand. For each file, in stable path order:
   - **Header** — `### \`<path>\`` for added / modified / deleted files; `### \`<oldPath>\` → \`<path>\`` for renames.
   - **Diff size** — single inline code line `+<additions> / -<deletions>` directly under the header.
   - **Before** — the full pre-change snippet of every hunk in the file, concatenated with a language-appropriate single-line separator between non-adjacent hunks (e.g. `// ...` for C-style, `# ...` for hash-comment languages, `<!-- ... -->` for markup, `... (omitted lines) ...` for unknown extensions). For newly-added files this section reads `_(new file)_`. For binary files it reads `_(binary file — see [assets/diffs/<short-sha>.diff](./assets/diffs/<short-sha>.diff))_` where `<short-sha>` is the latest commit that touched the file.
   - **After** — the full post-change snippet, formatted the same way. For deleted files this section reads `_(file deleted)_`. For binary files, the same binary placeholder as in **Before**.
   - **Why** — one paragraph synthesised from the matching plan step, the commit subject(s) that touched the file, and any acceptance criterion whose text references the path. This is a per-file rationale, distinct from the per-step *What this does* paragraphs. When no source produces content, the literal string `*Rationale not recorded for this file.*` is emitted instead.

   Entries are separated by a `---` horizontal rule **between** entries; no rule is emitted after the last entry. Hunks that were truncated in the per-step body are shown in **full** in the appendix — the appendix is the complete reference, the per-step truncation rule does not apply here.

For binary or oversized hunks **inside the steps**, replace the code block with `_(binary file — open it in your editor)_` or `_(snippet truncated — see [assets/diffs/<sha>.diff](./assets/diffs/<sha>.diff) for the full hunk)_`. Always keep the surrounding prose (Open / Locate / Action / What this does / Verify) so the step still reads as a tutorial.

### On Success

```
✓ Tutorial generated for SW-XXX

  File:    _scrum-output/sprints/SW-XXX/tutorials/tutorial.md
  Commits: 4
  Files:   7  (+218 / -42)

Next Step: Open the file or share it with stakeholders.
```

### On Error (Invalid Ticket ID)

```
❌ Invalid Ticket ID: <input>

**Format:** Ticket ID must match SW-XXX (e.g., SW-001, SW-042).

**Next Step:** Provide a valid ticket ID, or use --epic N / --all.
```

### On Error (No Code Changes Found)

```
ℹ️ Nothing to tutor for SW-XXX

No commits referencing this ticket were found and no story.md description
is available to derive a tutorial from.

**Next Step:** Make sure commit messages reference SW-XXX (subject or
trailer), then re-run this command.
```

## Data Sources

The command reads (read-only) from:

| Source | Used For |
|--------|----------|
| `git log --grep=SW-XXX` (subject + trailer) | Discover the commits that belong to the ticket. |
| `git show <sha>` / `git diff <base>..<head>` | Extract the actual hunks (Before / After). |
| `_scrum-output/sprints/SW-XXX/story.md` | Title, description, acceptance criteria for the *Why* paragraph. |
| `_scrum-output/sprints/SW-XXX/plan.md` | Per-step rationale, mapped to files via path or commit message references. |
| Commit messages (subject + body) | Per-hunk *Why* paragraph. |

If `plan.md` or `story.md` is missing, the *Why* paragraph falls back to the commit message subject only.

## Write Boundary Rules

This command MAY write multiple files per run. Per-ticket output is confined to **`_scrum-output/sprints/SW-XXX/tutorials/`** (one subdirectory per ticket, next to `story.md`/`plan.md`/etc.). The cross-ticket bundle and the multi-ticket index are the only writes that fall outside any individual ticket directory.

Allowed writes:

- `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md` — overwrite per run (default single-file mode).
- `_scrum-output/sprints/SW-XXX/tutorials/**` — overwrite per run (split mode); the agent creates the `tutorials/` subdirectory plus per-file chapter files, the `README.md` landing page, the `00-overview.md`, the `99-summary.md`, and any required `assets/diffs/<sha>.diff`. Stale files from a previous run inside this `tutorials/` subdirectory MAY be removed before writing so the output is deterministic.
- `_scrum-output/sprints/tutorials-index.md` — overwrite per run when multiple tickets are requested without `--bundle`.
- `_scrum-output/tutorials/<bundle-name>-tutorial.md` — overwrite per run when `--bundle` is used (bundles aggregate tickets, so they don't fit under a single ticket directory).

This command MUST NOT:
- Write inside `_scrum-output/sprints/SW-XXX/` outside the `tutorials/` subdirectory — `story.md`, `plan.md`, `refinement.md`, `verification-report.md`, `review-*.md`, and `approval-*.md` are off-limits.
- Modify or delete any file inside `_scrum-output/audit/` or the working tree.
- Mutate `status_history` or any story frontmatter.
- Run any git command that mutates state (`commit`, `checkout`, `reset`, etc.).

## Integration Points

- **`/scrum-audit-trail`** is the lifecycle counterpart — it explains *when* status changes happened. `/scrum-ticket-changes` explains *what* changed in code and *why*.
- **`/scrum-dev-story`** is the upstream producer of the commits this command consumes; commits SHOULD reference `SW-XXX` in the subject or as a trailer for clean discovery.
- **`/scrum-refine-story`** produces the `plan.md` that supplies the *Why* paragraph.

## Error Handling

### Status Guard Violation

N/A — the command works for stories in any status.

### No Commits Reference the Ticket

Not an error in multi-ticket mode — skip the ticket and emit the `Nothing to tutor` notice. Continue with the remaining IDs.

### Git Command Failure

If a git command fails (corrupt repo, missing rev), emit a warning, omit the affected hunk or commit, and continue. Never abort the tutorial because of git issues.

### Concurrent Writes

If the target tutorial file is locked, retry up to 3 times with exponential backoff (1s, 2s, 4s). After that, halt with a clear error.
