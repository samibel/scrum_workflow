# BMAD Scrum Workflow - Complete Guide

**Version:** 3.1 (Complete Overhaul + Installation Guide)
**Last Updated:** 2026-03-25
**Project:** scrum_workflow
**Contributors:** Paige (Tech Writer), Bob (Scrum Master), Winston (Architect)

---

## Table of Contents

1. [Installation](01-installation.md) - Setup for new projects with copy-paste instructions
2. [Quick Start](02-quick-start.md) - The workflow in 5 minutes
3. [Workflow Overview](03-workflow-overview.md) - End-to-end flow and phase summary
4. [Command Reference](04-command-reference.md) - All workflow commands documented
5. [State Machine](05-state-machine.md) - Status values and guard conditions
6. [Phase-by-Phase Details](06-phase-details.md) - Detailed phase documentation
7. [Write Boundary Rules](07-write-boundary-rules.md) - File write permissions matrix
8. [Framework Architecture](08-framework-architecture.md) - Three-layer separation
9. [Examples](09-examples.md) - Complete file examples
10. [Story Completion Checklist](10-checklist.md) - Pre/post validation checklists
11. [Common Anti-Patterns](11-anti-patterns.md) - What NOT to do
12. [Implementation Patterns](12-implementation-patterns.md) - 16 patterns with code
13. [Error Recovery](13-error-recovery.md) - Recovery strategies
14. [Extension Points](14-extension-points.md) - Customization guide
15. [Best Practices](15-best-practices.md) - Role-specific recommendations
16. [Troubleshooting](16-troubleshooting.md) - Common errors and solutions
17. [Appendix](17-appendix.md) - File formats and glossary

---

## Quick Navigation

**For New Users:**
- Start with [Installation](01-installation.md)
- Then read [Quick Start](02-quick-start.md)

**For Daily Workflow:**
- [Command Reference](04-command-reference.md) - Command syntax
- [State Machine](05-state-machine.md) - Status transitions
- [Examples](09-examples.md) - File format reference

**For Framework Developers:**
- [Framework Architecture](08-framework-architecture.md) - System design
- [Implementation Patterns](12-implementation-patterns.md) - Code patterns
- [Extension Points](14-extension-points.md) - Customization

**For Troubleshooting:**
- [Troubleshooting](16-troubleshooting.md) - Error solutions
- [Error Recovery](13-error-recovery.md) - Recovery strategies
- [Common Anti-Patterns](11-anti-patterns.md) - Avoid mistakes

---

## Document Structure

This guide is split into multiple files for easier navigation and maintenance:

```
scrum_workflow/docs/
├── 00-index.md              # This file - Table of Contents
├── 01-installation.md       # Setup instructions
├── 02-quick-start.md        # 5-minute overview
├── 03-workflow-overview.md  # End-to-end flow
├── 04-command-reference.md  # Command documentation
├── 05-state-machine.md      # Status transitions
├── 06-phase-details.md      # Phase-by-phase guide
├── 07-write-boundary-rules.md   # Write permissions
├── 08-framework-architecture.md # System design
├── 09-examples.md           # Complete file examples
├── 10-checklist.md          # Completion checklists
├── 11-anti-patterns.md      # What NOT to do
├── 12-implementation-patterns.md # 16 code patterns
├── 13-error-recovery.md     # Recovery strategies
├── 14-extension-points.md   # Customization
├── 15-best-practices.md     # Role-specific guides
├── 16-troubleshooting.md    # Error solutions
└── 17-appendix.md           # Reference material
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.1 | 2026-03-25 | Added Installation guide, split into sub-files |
| 3.0 | 2026-03-25 | Extended Implementation Patterns to 16 patterns |
| 2.1 | 2026-03-25 | Added Pattern Summary table |
| 2.0 | 2026-03-25 | Complete Overhaul with examples and patterns |
| 1.0 | 2026-03-25 | Initial workflow documentation |

---

**Document Version:** 3.1 (Split Documentation)
**Last Updated:** 2026-03-25
**Maintained By:** Scrum Workflow Team
