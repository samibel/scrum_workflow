# Ticket Code-Change Tutorial Workflow

**Purpose:** Define the deterministic transformation that turns the *code changes* belonging to a ticket into a follow-along, step-by-step coding tutorial written in second-person prose, stored under `_scrum-output/sprints/SW-XXX/tutorials/`. The reader should be able to re-implement the change by reading the tutorial and typing the snippets into their editor.

**Referenced by:** `/scrum-ticket-changes` (`commands/ticket-changes.md`).

---

## Inputs

| Input | Required? | Source |
|-------|-----------|--------|
| `ticketId` | yes (or `--all` / `--epic`) | CLI argument, validated against `^SW-\d{3}$`. |
| `options.format` | no, default `markdown` | CLI flag `--format`. |
| `options.split` | no, default `false` | CLI flag `--split`. |
| `options.contextLines` | no, default `5` | CLI flag `--context-lines`. |
| `options.maxHunkLines` | no, default `60` | CLI flag `--max-hunk-lines`. |
| `options.include[]` | no | Repeatable `--include <glob>`. |
| `options.exclude[]` | no | Repeatable `--exclude <glob>`. Defaults: `package-lock.json`, `pnpm-lock.yaml`, `dist/**`, `build/**`, `**/*.{png,jpg,jpeg,gif,pdf,zip}`. |
| `options.diagrams` | no, default `true` | CLI flag `--no-diagrams` flips this to `false`. When `true`, the renderer infers an optional Mermaid diagram per step from the whitelist below. |
| `options.diffAppendix` | no, default `true` | CLI flag `--no-diff-appendix` flips this to `false`. When `true`, the renderer emits a `## Appendix — Full diff per file` section at the end of the tutorial (single-file mode) or a `100-appendix-diffs.md` file (split mode). |
| `options.since` | no | ISO 8601 date string from `--since`. |
| `options.bundleName` | no | String from `--bundle`. |

---

## Resolution Rules

When the user passes `--all` or `--epic N`, expand the input list before generation:

1. `--all` → list every directory matching `_scrum-output/sprints/SW-???/`.
2. `--epic N` → for each story directory, parse `story.md` frontmatter and keep only those with `epic: N`.
3. Multiple positional `SW-XXX` arguments → use as-is, after validation.

If, after resolution, the list is empty, halt with:

```
ℹ️ No tickets matched the requested filter.
```

If both `--split` and `--bundle` are passed, halt before any file access:

```
❌ --split and --bundle are mutually exclusive.
```

---

## Per-Ticket Pipeline

For each resolved ticket the workflow runs the following deterministic steps. Steps 1–4 are reads; step 5 builds the model; step 6 renders; step 7 is the only write.

### Step 1 — Discover Commits

Run a git query to find every commit that belongs to the ticket. Match on:

1. The ticket ID anywhere in the **subject line** (e.g., `feat(SW-042): …`).
2. The ticket ID in a **trailer** (`Refs: SW-042`, `Ticket: SW-042`).
3. The ticket ID as a standalone token in the commit body.

```bash
git log --pretty=format:"%H%x00%h%x00%aI%x00%an%x00%s%x00%b%x1e" \
        --grep="\\bSW-XXX\\b" --extended-regexp \
        ${since:+--since="$since"}
```

Parse the `\x1e`-separated stream into commit records:

```ts
{ sha, shortSha, authorDate, author, subject, body }
```

If the resulting list is empty *and* `_scrum-output/sprints/SW-XXX/story.md` is also missing, skip the ticket with the `Nothing to tutor` notice. If only `story.md` is missing, continue — commits still produce a valid tutorial.

### Step 2 — Load Story Snapshot

Read `_scrum-output/sprints/SW-XXX/story.md` (best-effort):

- Parse YAML frontmatter (title, status, type, risk_level, domain_tags, epic).
- Extract description and acceptance criteria sections.

If the file is missing, set `snapshot = null` — the *Why* paragraph then falls back to commit subjects only.

### Step 3 — Load Plan Snapshot

Read `_scrum-output/sprints/SW-XXX/plan.md` (best-effort):

- Extract numbered plan steps.
- For each step, capture the step text, the bullet list of files it mentions, and any acceptance-criterion ID it references.

This snapshot becomes the lookup table for the *Why* paragraph: when a hunk's file path matches a plan step's file list, that step's text is injected as rationale.

### Step 4 — Extract Hunks Per File

For every commit from step 1, run:

```bash
git show --no-color --unified=<contextLines> --first-parent <sha>
```

Parse the unified-diff output into a list of `FileChange` records:

```ts
type Hunk = {
  oldStart: number; oldLines: number;
  newStart: number; newLines: number;
  before: string;   // joined "-" + " " context lines
  after:  string;   // joined "+" + " " context lines
  raw:    string;   // full hunk text including the @@ header
};

type FileChange = {
  path: string;
  changeType: "added" | "modified" | "deleted" | "renamed";
  oldPath?: string;
  language: string;       // inferred from file extension
  isBinary: boolean;
  additions: number;
  deletions: number;
  hunks: Hunk[];
  commits: string[];      // short SHAs that touched this file
};
```

Apply filters:

1. Drop any path matching `options.exclude[]` (defaults plus user-supplied).
2. Keep only paths matching `options.include[]` if any were supplied.
3. Mark binaries (`Binary files differ` line) — they keep an entry but no hunks.
4. Hunks longer than `options.maxHunkLines` are flagged `oversized = true`.

Aggregate `FileChange` records across all commits, keyed by path. Sort by path ascending for stable output.

### Step 5 — Build the Tutorial Model

Group the file changes into ordered **tutorial steps** and combine them with the snapshots:

```ts
type FileEdit = {
  file: FileChange;
  hunk: Hunk;
  action: "add" | "remove" | "replace" | "rename" | "create";
  // "create" when the whole file is new; "remove" when whole file is deleted
  locate: string | null;     // enclosing function/class/section parsed from "@@ … @@"
                             // null when changeType === "added"
  snippetBlocks: Array<{     // the new code split into typeable chunks
    code: string;
    leadIn: string | null;   // optional connector prose ("…and right below, paste:")
  }>;
  whatThisDoes: string;      // 1–3 sentences in plain language
};

type TutorialStep = {
  index: number;             // 1-based
  title: string;             // derived from plan step or commit subject (no "feat:" prefix)
  goal: string;              // one sentence
  edits: FileEdit[];         // stable order: by path then newStart ascending
  diagram: {                 // null when options.diagrams === false or no whitelist match
    type: "flowchart" | "sequence" | "stateDiagram" | "classDiagram";
    body: string;            // raw Mermaid source, no fence
    rationale: string;       // which whitelist rule fired (for debugging / determinism)
  } | null;
  verify: string;            // concrete check derived from the step
  commits: string[];         // short SHAs that contributed to the step
};

type TutorialModel = {
  ticket: "SW-XXX";
  title: string;
  finalStatus: string;
  generated: string;             // ISO timestamp
  intro: {
    whatYoullBuild: string;      // from story.md description, rephrased in 2nd person
    whyItMatters: string;        // from plan.md rationale or first acceptance criterion
    prerequisites: string[];     // inferred from touched-file extensions / known frameworks
    whatYoullLearn: string[];    // 2–4 bullets
  };
  steps: TutorialStep[];
  recap: {
    puttingItAllTogether: string;
    whatYouLearned: string[];    // 3–6 bullets
  };
  reference: {
    files: Array<{ path: string; additions: number; deletions: number; steps: number[] }>;
    commits: Array<{ shortSha: string; subject: string }>;
    totals: { filesChanged: number; additions: number; deletions: number; commitCount: number };
  };
  appendix: AppendixEntry[] | null;   // null when options.diffAppendix === false
};

type AppendixEntry = {
  path: string;
  oldPath?: string;                   // for renames
  changeType: "added" | "modified" | "deleted" | "renamed";
  language: string;                   // inferred from extension
  isBinary: boolean;
  before: string;                     // full pre-change snippet, hunks joined by "\n// ...\n"
                                      // "" for added files; the renderer prints "_(new file)_"
  after: string;                      // full post-change snippet, hunks joined by "\n// ...\n"
                                      // "" for deleted files; the renderer prints "_(file deleted)_"
  why: string;                        // per-file rationale paragraph (plan step + commit subjects + matching AC)
  totals: { additions: number; deletions: number };
};
```

#### Step grouping rules

1. **One commit → one step** is the default mapping.
2. **Plan step alignment**: when `plan.md` is available and a plan step's referenced files match the files touched by a single commit, use the plan step's title and text as the step title and as the seed for `whatThisDoes`.
3. **Squash trivial commits**: commits whose subject matches the regex `^(chore|style|fix)\s*[:(]\s*(typo|lint|format|whitespace|comment)` are merged into the previous step rather than producing their own.
4. **Action verb selection** per hunk:
   - `oldLines === 0` → `"add"` if file already existed; `"create"` if the whole file is new (changeType === `"added"`).
   - `newLines === 0` → `"remove"` if file still exists; `"delete"` is rendered as the same `"remove"` action with whole-file note when the entire file was removed.
   - `oldLines > 0 && newLines > 0` → `"replace"`.
   - `changeType === "renamed"` with no content change → `"rename"`.
5. **Locate string** is parsed from the unified-diff hunk header: the `@@ -… +… @@ <context>` tail is the enclosing scope. Fallbacks when no context is present:
   - `newStart <= 5` → `"near the top of the file"`.
   - hunk touches the last 5 lines of the file → `"at the bottom of the file"`.
   - otherwise → `"around line {{newStart}}"`.
6. **Snippet splitting**: a hunk longer than 30 lines is split into multiple `snippetBlocks` of ≤ 30 lines each on the nearest blank line, joined by short connector prose so the reader doesn't face one wall of code.

#### Diagram inference

Only runs when `options.diagrams === true`. Pick at most **one** diagram per step from the whitelist below by walking the rules in priority order — the first rule that matches wins. If no rule matches, the step's `diagram` field is `null` and no Mermaid block is rendered.

| # | Rule | Diagram type | Body content |
|---|------|--------------|--------------|
| 1 | Step touches **≥ 2 files** in `**/services/**`, `**/clients/**`, `**/api/**`, or any pair of files where one calls the other across a network boundary (heuristic: `fetch(`, `axios.`, `http.request`, gRPC stubs in After snippets) | `sequence` | One participant per service; one arrow per call detected in the hunks (caller → callee, label is the function/endpoint name). |
| 2 | Step's combined snippet content matches **two or more** of the regex set: `\bstate\b`, `\bstatus\b`, `\btransition\b`, `\b(from\|to)\s*[:=]\s*['"]?[a-z][\w-]+`, OR the step touches a path with one of `state`, `status`, `lifecycle`, `state-machine` in its name | `stateDiagram` | Each `from → to` pair detected in the snippets becomes a transition; states without a detected entry get a `[*] --> <state>` initial marker. |
| 3 | Step's snippets contain **at least one** `class\s+[A-Z]\w*\s+(extends\|implements)\s+`, OR add/modify a path matching `**/{models,entities,domain}/**/*.{ts,js,py,rb,kt,java,cs}` | `classDiagram` | One class per touched declaration; arrows for `extends` (`<|--`) and `implements` (`<|..`). Fields/methods limited to what the hunk touched, max 5 each, to keep the diagram readable. |
| 4 | Step touches a path matching `**/{routes,controllers,handlers,middleware}/**`, OR the snippets contain control-flow keywords `\b(if\|switch\|case\|return)\b` AND no rule above fired | `flowchart` | `flowchart TD` with one node per branch / early return / function call detected in the hunk; default to LR direction when more than 6 nodes are produced. |

Determinism rules for diagram bodies:

- Node and participant identifiers MUST be derived deterministically from the source: function names, file basenames, or status string literals — never random or LLM-generated.
- The body MUST be ≤ 25 lines. If the inferred graph would be larger, keep only the top-level nodes / first-class transitions and append a single `note over <node>: …more…` placeholder.
- The body MUST NOT include styling (`style`, `classDef`, theme directives) — the renderer keeps it plain so it remains diff-friendly.
- The body MUST be syntactically valid Mermaid for the chosen `type`. The agent SHOULD mentally validate against the Mermaid syntax for that diagram type before emitting; if validation fails, set `diagram = null` rather than emitting a broken block.
- The `rationale` field records which rule (`"rule-1-sequence"`, `"rule-2-state"`, …) fired, so re-runs over an unchanged tree pick the same diagram type.

#### Intro derivation

- `whatYoullBuild`: rephrase `story.md` description in second person using a deterministic rewrite (e.g., "Implement X" → "you'll implement X"). When `story.md` is missing, fall back to the first commit subject.
- `whyItMatters`: take the first plan step's rationale paragraph. When `plan.md` is missing, fall back to the first acceptance criterion of `story.md`. When neither exists, emit `*Rationale not recorded for this ticket.*`.
- `prerequisites`: derive deterministically from the set of file extensions and well-known config files touched (e.g., `.ts` → `Node.js + a TypeScript toolchain`, `package.json` → `npm or pnpm`, `vitest.config.*` → `Vitest`, `Dockerfile` → `Docker`, `.py` → `Python 3.x`). When the inference is uncertain, append `*(adapt to your stack)*`.
- `whatYoullLearn`: take the unique plan step titles in order; when fewer than 2 exist, pad with the unique commit subjects (without `feat:`/`fix:` prefix).

#### Verify checkpoint derivation

Per step, derive a concrete check in this order of preference:

1. If any edit in the step touches a test file (path matches `**/*.{test,spec}.{ts,tsx,js,jsx,py,rb}` or `__tests__/**`), emit: `Run \`<runner-hint> <test-path>\` — it should now pass.` Pick the runner from `package.json` scripts when available; otherwise emit `\`<test-path>\``.
2. Else, if the step touches a CLI command file (entry under `bin/` or a path matching `**/cli/**`), emit: `Try \`<inferred command>\` and confirm <observable behaviour>.`
3. Else, if `story.md` has acceptance criteria, pick the first AC whose text mentions any path touched by the step and emit: `Reload the app and confirm: <AC text>.`
4. Otherwise emit a generic prompt: `Re-run your build / dev server and confirm the change is reflected.`

#### Appendix derivation

Only runs when `options.diffAppendix === true`. Walk the aggregated `FileChange` records from step 4 (sorted by path) and produce one `AppendixEntry` per file:

- `before` is built by concatenating the `hunk.before` strings of every hunk in the file in `oldStart` order, joined by `\n// ...\n` (use `# ...` for languages where `//` is not a comment, e.g., `.py`, `.rb`, `.sh`, `.yaml`). For added files set `before = ""` — the renderer substitutes `_(new file)_`.
- `after` is built the same way from `hunk.after` strings in `newStart` order. For deleted files set `after = ""` — the renderer substitutes `_(file deleted)_`.
- `why` is one paragraph synthesised per file:
  1. If exactly one plan step references the path, take that step's text as the seed.
  2. Else, concatenate the unique commit subjects (without conventional-commit prefixes) that touched the file.
  3. If any acceptance criterion text contains the file's basename or any function/class name appearing in the hunks, append `Satisfies AC: "<AC text>".`
  4. If none of the above produces content, emit `*Rationale not recorded for this file.*`.
- `isBinary === true` files set `before = after = ""` and the renderer substitutes the binary placeholder.
- Hunks oversized in step 4 (`oversized === true`) are still included in full in the appendix — the appendix is the complete reference, so the per-step truncation rule does **not** apply here. The renderer still wraps the section in `<details>` so the file size is not visually overwhelming.

### Step 6 — Render

#### 6a. Markdown (default)

The renderer is **prose-first**. It walks the `TutorialModel` and emits the layout documented in `commands/ticket-changes.md` (Frontmatter → Introduction → Steps → Putting it all together → What you learned → Reference). The voice is second person, the tone is friendly and explanatory.

For every `TutorialStep`, render the following template:

````
## Step {{index}} — {{title}}

**Goal:** {{goal}}

{{#each edits}}
{{actionHeader}}                                  ← e.g. "### Open `src/auth/login.ts`"
                                                       or "### Create a new file at `src/auth/session.ts`"

{{#unless action === "create"}}
**Locate:** {{locate}}.
{{/unless}}

{{actionSentence}}                                ← imperative line ending with a colon, e.g.
                                                       "Add the following near the imports:"
                                                       "Replace the body of `handleLogin` with:"
                                                       "Delete this block:"

{{#each snippetBlocks}}
{{#if leadIn}}{{leadIn}}{{/if}}

```{{language}}
{{code}}
```

{{/each}}

**What this does:** {{whatThisDoes}}

{{/each}}

{{#if diagram}}
**Diagram:**

```mermaid
{{diagram.body}}
```

{{/if}}

**Verify:** {{verify}}
````

Rules for the renderer:

- `actionHeader` uses `### Open` for existing files, `### Create a new file at` for new files, `### Remove` for whole-file deletions, and `### Rename` for renames.
- `actionSentence` MUST be an imperative sentence chosen from `action`:
  - `add` → `"Add the following:"` (or `"Add the following near the imports:"` / `"…at the top of the file:"` / `"…at the bottom of the file:"` based on `locate`).
  - `replace` → `"Replace it with:"` when `locate` already named the target, otherwise `"Replace the surrounding block with:"`.
  - `remove` → `"Delete this block:"` followed by the *removed* code in the snippet block (so the reader can recognise what to remove). This is the only case where the code shown is the *Before* content rather than the *After* content.
  - `rename` → no snippet block; render `Rename \`<oldPath>\` to \`<newPath>\`.` and skip the code block.
  - `create` → `"Create the file with the following contents:"`.
- `whatThisDoes` MUST be derived from the plan step text + commit subject + matching acceptance criterion. The renderer concatenates them into a flowing paragraph and runs a simple deduplication pass; it MUST NOT just paste raw commit metadata or include a sha.
- For oversized hunks (`hunk.oversized === true`):
  - **Single-file mode:** wrap the snippet block in `<details><summary>Show the full snippet</summary> … </details>` and append a sentence: `If you'd rather copy the diff verbatim, see [assets/diffs/<short-sha>.diff](./assets/diffs/<short-sha>.diff).`
  - **Split mode:** always emit `assets/diffs/<short-sha>.diff` and replace the inline snippet with `_(snippet truncated — see [assets/diffs/<short-sha>.diff](../assets/diffs/<short-sha>.diff))_`.
- For binary files, replace the snippet block with `_(binary file — open it in your editor and replace it with the version from commit \`<short-sha>\`.)_`.

The Reference section at the end of the document is rendered as:

````
## Reference

### Files touched

| File | + | − | Step(s) |
|------|---|---|---------|
| `<path>` | <additions> | <deletions> | <comma-separated step indices> |

### Commits

- `<short-sha>` — <subject>

**Total:** <filesChanged> files, +<additions> / -<deletions> across <commitCount> commits.
````

When `model.appendix` is non-null, render the appendix immediately after the Reference section as:

````
## Appendix — Full diff per file

<details>
<summary>Full diff per file ({{appendix.length}} files)</summary>

{{#each appendix}}
### `{{path}}`{{#if oldPath}} (renamed from `{{oldPath}}`){{/if}}

`+{{totals.additions}} / -{{totals.deletions}}`

**Before**

{{#if isBinary}}
_(binary file — see assets/diffs/<sha>.diff)_
{{else if before === ""}}
_(new file)_
{{else}}
```{{language}}
{{before}}
```
{{/if}}

**After**

{{#if isBinary}}
_(binary file — see assets/diffs/<sha>.diff)_
{{else if after === ""}}
_(file deleted)_
{{else}}
```{{language}}
{{after}}
```
{{/if}}

**Why:** {{why}}

---

{{/each}}

</details>
````

The outer `<details>` block keeps the appendix collapsed by default in GitHub and most Markdown viewers — the prose tutorial above stays scannable while the complete reference remains one click away. The `---` separators between entries are dropped after the last entry.

#### 6b. JSON (`--format json`)

Skip the rendering loop and emit the `TutorialModel` from step 5 directly. With `--split`, write one `steps/NN-<slug>.json` per step plus a top-level `metadata.json` (same `tutorials/` subdirectory as the Markdown variant). Without `--split`, write a single `_scrum-output/sprints/SW-XXX/tutorials/tutorial.json`.

### Step 7 — Write Output

The agent MAY write multiple files per run. Per-ticket output stays inside the ticket's own directory: **`_scrum-output/sprints/SW-XXX/tutorials/`**. The cross-ticket bundle and the multi-ticket index are the only writes that fall outside any individual ticket directory. Use an atomic write pattern (`temp file → rename`) for every file to avoid partial writes.

`mkdir -p` the per-ticket `tutorials/` subdirectory on demand — the installer does **not** pre-create it because each ticket's directory is itself created lazily by `/scrum-create-ticket`.

#### 7a. Single-file mode (default)

- Single ticket: `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md` (overwrite).
- Multiple tickets without `--bundle`: write each ticket's tutorial under its own `_scrum-output/sprints/SW-XXX/tutorials/tutorial.md`.
- `--bundle <name>`: concatenate per-ticket outputs into `_scrum-output/tutorials/<name>-tutorial.md`, separated by `\n---\n` rules. Bundles are the only artifact written outside `_scrum-output/sprints/`.

After every per-ticket write (single- or multi-ticket runs, no bundle), regenerate the index file `_scrum-output/sprints/tutorials-index.md` by **scanning** `_scrum-output/sprints/` for all directories that contain a `tutorials/tutorial.md` (single-file mode) or a `tutorials/README.md` (split mode) and listing them sorted by ticket ID. This keeps the index accurate even when the command was invoked for a single ticket — previously generated tutorials remain listed.

#### 7b. Split mode (`--split`)

In split mode the unit of splitting is a **tutorial step**, not a file. For each ticket, materialise the model into the ticket's `tutorials/` subdirectory:

```
_scrum-output/sprints/SW-XXX/tutorials/
├── README.md               # landing page; introduction summary + ordered links to every step
├── 00-introduction.md      # What you'll build / Why / Prerequisites / What you'll learn
├── steps/
│   ├── 01-<slug>.md        # one self-contained mini-tutorial per TutorialStep
│   └── ...
├── 98-recap.md             # Putting it all together + What you learned
├── 99-reference.md         # Files touched table + commit list + totals
├── 100-appendix-diffs.md   # default-on; one collapsible <details> per file (Before / After / Why)
                            # — omitted entirely when --no-diff-appendix is passed
└── assets/                 # only created if at least one asset is needed
    └── diffs/<short-sha>.diff
```

Rules:

1. Before writing, the agent MAY remove the existing `_scrum-output/sprints/SW-XXX/tutorials/` directory contents to ensure a clean, deterministic re-run. It MUST NOT touch any other file inside `sprints/SW-XXX/` (story.md, plan.md, etc.) and MUST NOT touch sibling tickets.
2. `<slug>` is `step.title` lowercased, with non-alphanumerics replaced by `-`, collapsed runs of `-`, trimmed, and truncated to 60 characters. The step index prefix (`01-`, `02-`, …) preserves ordering.
3. Each `steps/NN-<slug>.md` opens with a back-link to `../README.md` and a one-line breadcrumb `Step N of M`, then renders the same Goal / Open / Locate / Action / What this does / Verify layout as in single-file mode. The reader should be able to complete a single step without scrolling through unrelated content.
4. The `README.md` landing page lists every chapter in order (`00-introduction.md`, every `steps/NN-*.md`, `98-recap.md`, `99-reference.md`, and `100-appendix-diffs.md` when present) and shows a short summary line per step (the step `goal`).
5. Per-commit raw diffs are written under `assets/diffs/<short-sha>.diff` whenever any hunk in that commit was flagged oversized; the step files link to them with relative paths (`../assets/diffs/<short-sha>.diff`).
6. If a step has zero edits (e.g., merged-in trivial commits with no remaining hunks), it MUST be dropped from the output entirely — never emit an empty step file.
7. When `options.diffAppendix === true`, write `100-appendix-diffs.md` containing the same appendix block produced for single-file mode (outer `<details>` wrapper, one `### \`<path>\`` entry per file with Before / After / Why). When `options.diffAppendix === false`, the file MUST NOT be created and any stale copy from a previous run MUST be removed during the per-ticket clean-up.

For multi-ticket runs in split mode, also write `_scrum-output/sprints/tutorials-index.md` linking to each per-ticket `tutorials/README.md`.

---

## Index File Format

When multiple tickets are generated and `--bundle` is **not** used, also emit `_scrum-output/sprints/tutorials-index.md`:

```markdown
---
generated: "<ISO timestamp>"
count: <N>
---

# Code-Change Tutorials

| Ticket | Title | Files | + | − | Commits | Tutorial |
|--------|-------|-------|---|---|---------|----------|
| SW-001 | … | 7 | 218 | 42 | 4 | [SW-001/tutorials/tutorial.md](./SW-001/tutorials/tutorial.md) |
| SW-002 | … | 2 |  31 |  5 | 1 | [SW-002/tutorials/tutorial.md](./SW-002/tutorials/tutorial.md) |
```

Links are relative to `_scrum-output/sprints/`. In split mode the link target is `./SW-XXX/tutorials/README.md` instead.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid ticket ID format | Halt before any file access; print the formatted error from `commands/ticket-changes.md`. |
| Both `--split` and `--bundle` passed | Halt before any file access with: `❌ --split and --bundle are mutually exclusive.` |
| Ticket has neither commits nor `story.md` | Skip the ticket and emit the `Nothing to tutor` notice. In multi-ticket mode the run continues for the remaining IDs. |
| `_scrum-output/sprints/SW-XXX/` missing | The ticket directory is created by `/scrum-create-ticket`. If it does not exist, skip the ticket with the `Nothing to tutor` notice — do not create it from this command. |
| `_scrum-output/sprints/SW-XXX/tutorials/` missing | `mkdir -p` it on demand (it is not pre-created by the installer). In split mode also `mkdir -p` `tutorials/files/` and `tutorials/assets/diffs/` on demand. |
| `_scrum-output/tutorials/` missing (bundle mode only) | `mkdir -p` it on demand. |
| Concurrent write conflict | Retry up to 3 times with backoff 1s/2s/4s. After that, halt. |
| `git log` / `git show` fails on a single rev | Emit a warning, drop that commit from the model, and continue. Never abort the tutorial because of git issues. |
| Repository is not a git working tree | Halt with: `❌ Not a git repository — /scrum-ticket-changes needs git history to extract code changes.` |

---

## Determinism Rules

1. Tutorial steps MUST be ordered by the author date of their first contributing commit, ascending.
2. Within a step, edits MUST be sorted by file path ascending and then by `newStart` ascending.
3. Commits MUST be listed in author-date ascending order in the Reference section.
4. Step slugs MUST be derived deterministically from the step title (see split-mode rule 2). When two steps would collide on the same slug, append `-2`, `-3`, … in step-index order.
5. The renderer MUST NOT reorder acceptance criteria or plan steps relative to their source files.
6. Re-running the command with identical inputs and an unchanged repository MUST produce a byte-for-byte identical Markdown output, except for the `generated` timestamp in the frontmatter.

---

*This workflow is referenced by the `/scrum-ticket-changes` command.*
