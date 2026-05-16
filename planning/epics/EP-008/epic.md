---
schema_version: "1.0.0"
epic_id: "EP-008"
parent_brief: "PB-001"
title: "Repo-Hygiene & Test-Infrastruktur (pnpm-only)"
status: planned
epic_index: "8/11"
story_count_estimate: 5
domain_tags: ["ci", "dx", "pnpm"]
created: "2026-05-16T10:45:02Z"
updated: "2026-05-16T10:45:02Z"
status_history:
  - from: null
    to: planned
    timestamp: "2026-05-16T10:45:02Z"
    trigger: manual-decomposition
    actor: human
priority: "P1"
review_source: "Review A — Medium #7 'Repo-Hygiene problematisch' + Test-Fail-Liste"
---

# Repo-Hygiene & Test-Infrastruktur (pnpm-only)

## Purpose

Review A führt eine konkrete Liste fehlschlagender Tests: Root `npm test` fehlt komplett, Root vitest-Bin nicht installiert, `src/cli` vitest nicht gefunden trotz devDep. Das Repo hat parallel `package-lock.json` (npm) UND `pnpm-lock.yaml` (pnpm) — der Nutzer hat entschieden: **pnpm wird alleiniger Package Manager**. Zusätzlich enthält das Repo node_modules-Reste in mehreren Bereichen und eine uncommitted `pnpm-lock.yaml`-Änderung in `src/cli/`.

Für ein Framework-Projekt, das Vertrauen aufbauen will, ist saubere Installierbarkeit und reproduzierbarer Test-Lauf nicht-verhandelbar. Dieses Epic räumt auf: pnpm-only, alle Tests laufen grün, CI-Matrix pro Workspace, und Sync-Checks zwischen `src/core/` und `src/cli/templates/scrum_workflow/` werden Teil des CI-Standards.

## User Value

- **Tech Lead, der das Repo klont**: bekommt nach `pnpm install` ein vollständiges, lauffähiges Setup — keine versteckten npm-Befehle, keine fehlenden Binaries.
- **Platform Engineer**: hat eindeutige Build- und Test-Befehle pro Workspace und CI-Matrix die jeden Bereich getrennt prüft.
- **Contributor**: PRs scheitern nicht an Repo-internen Inkonsistenzen, sondern nur an echten Code-Problemen.

## Scope

### In-Scope

- pnpm als alleiniger Package Manager (User-Entscheidung): `package-lock.json` entfernen, alle npm-zentrischen Skripte umstellen
- node_modules-Hygiene: `.gitignore`-Audit, `git rm -r --cached` für versehentlich getrackte node_modules
- `src/cli/pnpm-lock.yaml` Status klären (laut Review A uncommitted): committen oder löschen
- Root-Test-Runner reparieren: `pnpm -r test` oder `pnpm run --recursive test` als Standard
- `src/cli` vitest installieren / verfügbar machen
- `src/core` vitest läuft bereits (273 Tests grün laut Review A) — Status erhalten
- CI-Matrix in `.github/workflows/`: separate Jobs `core`, `cli`, `contracts`
- Sync-Check als CI-Step: `diff src/core/{agents,commands,workflows,skills,data,templates}` gegen `src/cli/templates/scrum_workflow/` (Templates-Mirror, wie heute manuell gepflegt)
- `.scrum-workflow-lock.json` (28 KB im Root) bewerten: gehört das ins Repo oder in `_scrum-output/`?

### Out-of-Scope

- Migration externer CI/CD-Pipelines (Aufgabe der konsumierenden Projekte)
- Performance-Optimierung der Tests (nur Lauffähigkeit)
- Eigene CI/CD-Plattform (GitHub Actions reicht)
- Coverage-Reports (kommt evtl. mit EP-010)

## Acceptance Criteria (Epic-Level)

- **Given** ein frisch geklontes Repo, **when** `pnpm install` ausgeführt wird, **then** sind alle Workspaces installiert und alle Binaries verfügbar.
- **Given** das installierte Repo, **when** `pnpm -r test` läuft, **then** sind `core`, `cli` und `contracts` Tests alle grün.
- **Given** der CI-Workflow auf einem PR, **when** er läuft, **then** existieren separate Jobs für `core`, `cli`, `contracts` und ein Sync-Check der Templates-Mirror; alle müssen grün sein für Merge.
- **Given** ein Versuch, ein File in `src/core/agents/` zu ändern ohne korrespondierende Änderung in `src/cli/templates/scrum_workflow/agents/`, **when** der Sync-Check-CI-Job läuft, **then** scheitert er mit klarem Diff-Output.
- **Given** kein `package-lock.json` mehr im Repo, **when** ein Nutzer `npm install` ausführt, **then** schlägt das mit klarer Fehlermeldung fehl (`pnpm` ist verpflichtend) oder die `package.json` redirected explizit.

## Capability Breakdown

### C1 — pnpm-only-Migration *(M, ~1 Story)* — **User-Entscheidung**

- C1.1 Audit: alle `package-lock.json` Vorkommen im Repo
- C1.2 `git rm` für alle `package-lock.json`-Dateien
- C1.3 `pnpm-workspace.yaml` existiert bereits — verifizieren dass alle Workspaces dort referenziert sind
- C1.4 `engines.pnpm` in Root-`package.json` setzen; optional `engines.npm: "use pnpm"` (oder via `preinstall`-Hook abfangen)
- C1.5 README-Update: nur pnpm-Befehle, keine npm-Beispiele mehr

### C2 — node_modules / Lockfile-Hygiene *(S, ~1 Story)*

- C2.1 `.gitignore`-Audit für alle Workspaces: jedes hat `node_modules` ignoriert
- C2.2 `git rm -r --cached` für versehentlich getrackte node_modules-Ordner
- C2.3 `src/cli/pnpm-lock.yaml` Status klären und auflösen (entweder committen oder zurücksetzen)
- C2.4 `.scrum-workflow-lock.json` Position bewerten: gehört in `_scrum-output/` (Runtime-Artifact) oder Root (Workspace-Lock)?

### C3 — Test-Runner-Reparatur *(M, ~1 Story)*

- C3.1 Root `package.json` script `"test": "pnpm -r test"` (oder äquivalent)
- C3.2 `src/cli/package.json`: `vitest` als devDependency installiert + erreichbar
- C3.3 Verifizieren: `pnpm --filter @scrum/cli test` läuft grün
- C3.4 Verifizieren: `pnpm --filter @scrum/core test` weiterhin grün (Regressions-Check)
- C3.5 Test-Output-Formatting konsistent

### C4 — CI-Matrix *(M, ~1 Story)*

- C4.1 GitHub Action `.github/workflows/test.yml`: Matrix-Jobs für `core`, `cli`, `contracts`
- C4.2 Jeder Job läuft `pnpm install` + workspace-spezifischen Test
- C4.3 Caching von `~/.pnpm-store` für schnellere Runs
- C4.4 Status-Check-Required-Setup im Repo (alle drei Jobs müssen grün für Merge)

### C5 — Templates-Sync-Check *(M, ~1 Story)*

- C5.1 Skript `src/cli/scripts/check-templates-sync.js`: diff zwischen `src/core/{agents,commands,workflows,skills,data,templates}/` und `src/cli/templates/scrum_workflow/{...}`/
- C5.2 CI-Job ruft Skript; Diff != 0 → fail mit Output „Templates out of sync"
- C5.3 Lokale Convenience: `pnpm run check-sync` (existiert bereits laut Review A; verifizieren / erweitern)
- C5.4 Optional: `pnpm run sync-templates` als Helper, der die fehlenden Dateien kopiert (mit Confirmation-Prompt)

## Dependencies

- **Vorgelagert:** keine; foundational
- **Nachgelagert:** EP-001 (Konsistenz-Tests brauchen funktionierende Test-Infra), EP-002 (CI-Gates für Schema-Validation), EP-004 (CI-Check für Findings)
- **Querbezug:** alle Epics profitieren von stabiler Test-Infrastruktur

## Success Metrics

- **0 npm-Lockfiles** im Repo nach Auslieferung
- **3/3 Workspaces grün**: `pnpm -r test` läuft mit Exit-Code 0
- **CI-Time < 5 Min** für Standard-PR (kein flaky-Test, kein Hänger)
- **Templates-Sync-Drift = 0**: Sync-Check ist dauerhaft grün; jede Core-Änderung führt zu Templates-Mirror im selben PR
