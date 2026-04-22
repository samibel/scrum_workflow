/**
 * Kernel Pattern runtime contract, not the generic design-pattern concept.
 *
 * This module defines the canonical `Pattern` contract type and its companion sub-types.
 * The Pattern contract codifies the manifest shape used by the kernel's pattern runtime,
 * establishing the type foundation every downstream EP-001 story depends on.
 *
 * **Layering invariant:** This package has zero runtime code and zero I/O.
 * Only pure type declarations ship from this package.
 *
 * @module contracts/src/pattern
 */

/**
 * Unique symbol brand for nominal type distinction between `Pattern` and `Module`.
 *
 * **Rationale (DR-001):** TypeScript structural typing alone cannot enforce `Pattern !== Module`.
 * A `readonly __brand` unique-symbol tag is required. The brand is zero-runtime and idiomatic.
 */
declare const PatternBrand: unique symbol;

/**
 * Unique symbol brand for SemVer string nominal typing.
 *
 * **Rationale (DR-004):** Ensures SemVerString values are nominally distinct from
 * plain string, preventing accidental assignment of unvalidated version strings.
 */
declare const SemVerBrand: unique symbol;

/**
 * SemVer 2.0.0 string type.
 *
 * **Rationale (DR-004):** Pins version format to canonical SemVer 2.0.0.
 * ASCII-only, forecloses homograph/confusable attacks on hot-swap pinning.
 *
 * @example "1.0.0"
 * @example "2.1.3-rc.1"
 * @example "0.0.0-experimental.123"
 */
export type SemVerString = string & {
  readonly [SemVerBrand]: typeof SemVerBrand;
};

/**
 * Hook name union.
 *
 * Closed union of 7 deterministic hook names invoked by the pattern runtime.
 * Each hook value is a kebab/camelCase export-name string resolved by the loader.
 *
 * **Composition-violation defense:** By using string values instead of functions,
 * the manifest structurally forecloses imperative composition inside the manifest.
 *
 * **Invocation order (deterministic):**
 * 1. `onLoad` - When pattern is first loaded into memory
 * 2. `beforePlan` - Before planning phase execution
 * 3. `afterPlan` - After planning phase execution
 * 4. `beforeExecute` - Before execution phase
 * 5. `afterExecute` - After execution phase
 * 6. `beforePublish` - Before publishing results (hot-swap boundary)
 * 7. `afterPublish` - After publishing results (hot-swap boundary)
 *
 * **Rationale (DR-005):** Fixed-property object with closed union ensures
 * deterministic ordering and prevents arbitrary hook injection.
 */
export type HookName =
  | "onLoad"
  | "beforePlan"
  | "afterPlan"
  | "beforeExecute"
  | "afterExecute"
  | "beforePublish"
  | "afterPublish";

/**
 * Hook declaration mapping.
 *
 * Maps each hook name to its export-name string.
 * Values are resolved by the loader from the pattern's exports.
 *
 * @example
 * ```ts
 * const hooks: PatternHooks = {
 *   onLoad: "onLoad",
 *   beforeExecute: "beforeExecute",
 *   afterPublish: "afterPublish"
 * };
 * ```
 */
export interface PatternHooks {
  /** Invoked when pattern is loaded. Optional. */
  readonly onLoad?: string;
  /** Invoked before planning phase. Optional. */
  readonly beforePlan?: string;
  /** Invoked after planning phase. Optional. */
  readonly afterPlan?: string;
  /** Invoked before execution. Optional. */
  readonly beforeExecute?: string;
  /** Invoked after execution. Optional. */
  readonly afterExecute?: string;
  /** Invoked before publishing (hot-swap boundary). Optional. */
  readonly beforePublish?: string;
  /** Invoked after publishing (hot-swap boundary). Optional. */
  readonly afterPublish?: string;
}

/**
 * Bind declaration shape.
 *
 * **Rationale (DR-006):** Satisfies EP-001's bind-collision contract.
 * The `override` array enables patterns to explicitly override conflicting binds.
 *
 * **Bind name constraint:** All bind names must follow kebab-case convention,
 * matching the `name` field pattern: `^[a-z0-9][a-z0-9-]{0,63}$`.
 */
export interface PatternBinds {
  /** Bind names declared by this pattern. */
  readonly declares: readonly string[];
  /** Optional: Bind names to override from dependencies. */
  readonly override?: readonly string[];
}

/**
 * Migration strategy enum.
 *
 * **Rationale (DR-007):** `migrations` carries no executable references.
 * The `strategy` field is an enum with conditional required fields.
 * Executable migration code lives outside the contracts layer.
 */
export type MigrationStrategy = "noop" | "script" | "manual";

/**
 * Migration declaration.
 *
 * Conditional required fields based on `strategy`:
 * - `noop`: no additional fields required
 * - `script`: `path` is required
 * - `manual`: `instructions` is required
 */
export type PatternMigration =
  | {
      readonly version: SemVerString;
      readonly strategy: "noop";
      readonly description?: string;
    }
  | {
      readonly version: SemVerString;
      readonly strategy: "script";
      readonly path: string;
      readonly description?: string;
    }
  | {
      readonly version: SemVerString;
      readonly strategy: "manual";
      readonly instructions: string;
      readonly description?: string;
    };

/**
 * Phase declaration.
 *
 * Defines a single execution phase within the pattern's lifecycle.
 */
export interface PatternPhase {
  /** Phase name (kebab-case). */
  readonly name: string;
  /** Optional description. */
  readonly description?: string;
}

/**
 * Gate declaration.
 *
 * Defines a validation gate that must pass before phase execution.
 */
export interface PatternGate {
  /** Gate name (kebab-case). */
  readonly name: string;
  /** Optional description. */
  readonly description?: string;
}

/**
 * Artifact declaration.
 *
 * Defines an output artifact produced by the pattern.
 */
export interface PatternArtifact {
  /** Artifact name (kebab-case). */
  readonly name: string;
  /** Artifact path (relative, no traversal). */
  readonly path: string;
  /** Optional description. */
  readonly description?: string;
}

/**
 * Test declaration.
 *
 * Defines a test suite for the pattern.
 */
export interface PatternTest {
  /** Test name (kebab-case). */
  readonly name: string;
  /** Path to test file (relative, no traversal). */
  readonly path: string;
  /** Optional description. */
  readonly description?: string;
}

/**
 * Pattern manifest contract type.
 *
 * **Canonical manifest shape:**
 * 1. `schemaVersion` - Meta-versioning for manifest schema itself
 * 2. `name` - Pattern name (kebab-case)
 * 3. `version` - Pattern version (SemVer 2.0.0)
 * 4. `inputs` - Input parameter declarations
 * 5. `phases` - Execution phases
 * 6. `gates` - Validation gates
 * 7. `artifacts` - Output artifacts
 * 8. `hooks` - Lifecycle hooks (HookName union)
 * 9. `binds` - Bind declarations (EP-001 AC #2)
 * 10. `config_schema` - JSON Schema for user config
 * 11. `migrations` - Migration declarations
 * 12. `tests` - Test declarations
 *
 * **Nominal distinctness:** The `__brand` field ensures `Pattern !== Module`
 * at compile-time, despite structural typing.
 *
 * **Security invariants:** All path-bearing fields reject:
 * - Absolute paths
 * - `../` traversal sequences
 * - Windows backslashes
 *
 * @see {@link HookName} for hook invocation order
 * @see {@link PatternBinds} for bind-collision contract
 * @see {@link SemVerString} for version format
 */
export interface Pattern {
  /**
   * Schema version (meta-versioning).
   * Bumped when manifest shape changes incompatibly.
   * Initial value: "1.0.0"
   */
  readonly schemaVersion: SemVerString;

  /**
   * Pattern name.
   * Must match kebab-case pattern: `^[a-z0-9][a-z0-9-]{0,63}$`
   */
  readonly name: string;

  /**
   * Pattern version.
   * Must be valid SemVer 2.0.0 (ASCII-only).
   */
  readonly version: SemVerString;

  /**
   * Input parameter declarations.
   * Each entry is a documentation-only descriptor object; runtime
   * validation is not enforced at the schema layer.
   * Optional.
   */
  readonly inputs?: readonly { readonly [key: string]: unknown }[];

  /**
   * Execution phases.
   * Required for executable patterns.
   */
  readonly phases: readonly PatternPhase[];

  /**
   * Validation gates.
   * Optional.
   */
  readonly gates?: readonly PatternGate[];

  /**
   * Output artifacts.
   * Optional.
   */
  readonly artifacts?: readonly PatternArtifact[];

  /**
   * Lifecycle hooks.
   * Fixed-property object with closed HookName union.
   */
  readonly hooks: PatternHooks;

  /**
   * Bind declarations.
   * Satisfies EP-001's bind-collision contract.
   */
  readonly binds: PatternBinds;

  /**
   * JSON Schema for user configuration.
   * Shape is an open object (`additionalProperties: true`) — contents are
   * validated by the loader against the consumer's own schema, not here.
   * Optional.
   */
  readonly config_schema?: { readonly [key: string]: unknown };

  /**
   * Migration declarations.
   * Optional.
   */
  readonly migrations?: readonly PatternMigration[];

  /**
   * Test declarations.
   * Optional.
   */
  readonly tests?: readonly PatternTest[];

  /**
   * Nominal brand tag.
   * Ensures `Pattern !== Module` at compile-time.
   *
   * @internal
   */
  readonly [PatternBrand]: typeof PatternBrand;
}
