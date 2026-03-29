# Installation

**← Back to [Index](00-index.md)** | **Next → [Quick Start](02-quick-start.md)**

---

## Setup for New Projects

This section provides copy-paste instructions for installing the scrum_workflow framework in a new project.

### Prerequisites

- **Claude Code** (or compatible AI coding assistant)
- Git repository (recommended but not required)
- Terminal access with basic shell commands

### Installation Methods

**Choose one method:**

1. **Manual Copy (Recommended)** - Full control over what you copy
2. **Git Submodule** - Keep framework synced with upstream
3. **Scripted Install** - Automated setup

---

## Method 1: Manual Copy (Recommended)

### Step 1: Copy the Framework Directory

```bash
# Navigate to your new project directory
cd /path/to/your/new-project

# Create the scrum_workflow directory
mkdir -p scrum_workflow

# Copy framework files from source project
cp -r /path/to/scrum_workflow/scrum_workflow/* scrum_workflow/

# Verify the structure
ls -la scrum_workflow/
```

Expected structure after copy:
```
scrum_workflow/
├── agents/          # Agent definitions
├── commands/        # CLI command workflows
├── config.yaml      # Framework configuration
├── context/         # Context templates
├── data/            # Data and schemas
├── docs/            # Documentation
├── skills/          # Reusable skill components
├── templates/       # Output templates
└── workflows/       # Phase workflows
```

### Step 2: Copy Claude Skills

```bash
# Create .claude directory structure
mkdir -p .claude/skills

# Copy skills (required for workflow commands)
cp /path/to/scrum_workflow/.claude/skills/*.md .claude/skills/

# Verify skills are copied
ls .claude/skills/scrum-create-ticket.md
ls .claude/skills/scrum-dev-story.md
ls .claude/skills/scrum-refine-ticket.md
ls .claude/skills/scrum-create-project-context.md
```

### Step 3: Create Required Directories

```bash
# Create Scrum Workflow output directory
mkdir -p _scrum-output/planning-artifacts
mkdir -p _scrum-output/implementation-artifacts

# Create sprints directory
mkdir -p sprints

# Verify structure
tree -L 2 . || find . -maxdepth 2 -type d
```

Expected project structure:
```
your-project/
├── .claude/
│   └── skills/
│       ├── create-ticket.md
│       ├── dev-story.md
│       ├── refine-ticket.md
│       └── create-project-context.md
├── _scrum-output/
│   ├── planning-artifacts/    # Epics, PRD, Architecture
│   └── implementation-artifacts/  # Story files
├── scrum_workflow/
│   ├── agents/
│   ├── commands/
│   ├── workflows/
│   └── ...
└── sprints/                   # Sprint folders (SW-101, SW-102, etc.)
```

### Step 4: Configure Claude Code Settings

Create or update `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "scrum-workflow-local": {
      "source": {
        "source": "local",
        "path": ".claude/skills"
      }
    }
  },
  "skipDangerousModePermissionPrompt": false,
  "effortLevel": "high"
}
```

**Settings explained:**
- `extraKnownMarketplaces`: Register local skills directory
- `skipDangerousModePermissionPrompt`: Set to `true` for automated workflows
- `effortLevel`: Set to `high` for better code quality

### Step 5: Create Initial Configuration

Create `config.yaml` in project root (optional, overrides scrum_workflow/config.yaml):

```yaml
# Project-specific configuration
platform: claude-code

project_name: "Your Project Name"
project_key: "YPREFIX"  # e.g., PROJ, for story IDs like PROJ-101

active_agents:
  - architect
  - developer
  - qa

# Output locations
story_location: "{project-root}/_scrum-output/implementation-artifacts"
sprint_location: "{project-root}/sprints"
```

### Step 6: Verify Installation

```bash
# Test that framework is accessible
ls scrum_workflow/workflows/
ls scrum_workflow/commands/
ls .claude/skills/scrum-create-ticket.md

# Check config is valid
cat scrum_workflow/config.yaml
```

---

## Method 2: Git Submodule

For keeping the framework synced with upstream updates:

```bash
# Navigate to your new project
cd /path/to/your/new-project

# Add scrum_workflow as a submodule
git submodule add https://github.com/your-org/scrum_workflow.git scrum_workflow

# Initialize and clone the submodule
git submodule update --init --recursive

# Copy skills to .claude directory (submodule skills don't auto-load)
cp scrum_workflow/.claude/skills/*.md .claude/skills/

# Create required directories
mkdir -p _scrum-output/{planning-artifacts,implementation-artifacts}
mkdir -p sprints
```

**Update workflow** (when upstream changes):
```bash
git submodule update --remote scrum_workflow
```

---

## Method 3: Scripted Install

Save this script as `install-scrum-workflow.sh`:

```bash
#!/bin/bash
set -e

# Configuration
SOURCE_PROJECT="${1:-/path/to/scrum_workflow}"
TARGET_DIR="${2:-.}"

echo "Installing scrum_workflow to: $TARGET_DIR"

# Create directories
mkdir -p "$TARGET_DIR/scrum_workflow"
mkdir -p "$TARGET_DIR/.claude/skills"
mkdir -p "$TARGET_DIR/_scrum-output/planning-artifacts"
mkdir -p "$TARGET_DIR/_scrum-output/implementation-artifacts"
mkdir -p "$TARGET_DIR/sprints"

# Copy framework
echo "Copying framework files..."
cp -r "$SOURCE_PROJECT/scrum_workflow/"* "$TARGET_DIR/scrum_workflow/"

# Copy skills
echo "Copying Claude skills..."
cp "$SOURCE_PROJECT/.claude/skills/"*.md "$TARGET_DIR/.claude/skills/"

# Create settings.json if not exists
if [ ! -f "$TARGET_DIR/.claude/settings.json" ]; then
    echo "Creating .claude/settings.json..."
    cat > "$TARGET_DIR/.claude/settings.json" << 'EOF'
{
  "extraKnownMarketplaces": {
    "scrum-workflow-local": {
      "source": {
        "source": "local",
        "path": ".claude/skills"
      }
    }
  },
  "skipDangerousModePermissionPrompt": false,
  "effortLevel": "high"
}
EOF
fi

echo "Installation complete!"
echo "Next steps:"
echo "  1. Review scrum_workflow/config.yaml"
echo "  2. Create config.yaml in project root (optional)"
echo "  3. Start Claude Code in project directory"
```

**Usage:**
```bash
chmod +x install-scrum-workflow.sh
./install-scrum-workflow.sh /path/to/source/project /path/to/new/project
```

---

## Platform-Specific Setup

### GitHub Copilot

```yaml
# config.yaml
platform: github-copilot
```

No additional setup required beyond framework copy.

### Windsurf

```yaml
# config.yaml
platform: windsurf
```

Skills load automatically from `.claude/skills/` directory.

### OpenCode

```yaml
# config.yaml
platform: opencode
```

Use Method 1 (Manual Copy) with these adjustments:
- Copy skills to project-specific skills directory
- Configure skills path in platform settings

---

## Post-Installation Checklist

- [ ] Framework directory copied: `scrum_workflow/`
- [ ] Skills installed: `.claude/skills/*.md`
- [ ] Output directories created: `_scrum-output/`, `sprints/`
- [ ] Settings configured: `.claude/settings.json`
- [ ] Config reviewed: `scrum_workflow/config.yaml`
- [ ] Commands accessible in Claude Code

---

## Verification Test

Run this test to verify installation:

```bash
# In Claude Code, run:
/scrum-create-ticket

# Expected behavior: System prompts for epic and story details
# If error: Check .claude/settings.json and skills directory
```

---

## Troubleshooting Installation

**Problem**: Skills not loading
- **Solution**: Check `.claude/settings.json` has correct `path` to skills directory
- **Solution**: Restart Claude Code after adding skills

**Problem**: Commands not recognized
- **Solution**: Verify `.claude/skills/scrum-create-ticket.md` exists
- **Solution**: Check skill file has proper frontmatter

**Problem**: Cannot write to sprints directory
- **Solution**: Check directory permissions: `ls -la sprints/`
- **Solution**: Create directory if missing: `mkdir -p sprints`

---

## Next Steps After Installation

1. **Create planning artifacts**: Generate epics, PRD, architecture
2. **Run sprint planning**: Create sprint status from epics
3. **Create first story**: `/scrum-create-ticket` to start workflow
4. **Customize agents**: Edit `scrum_workflow/agents/*.md` for your project
5. **Adjust workflows**: Modify `scrum_workflow/workflows/*.md` as needed

For detailed workflow instructions, see [Quick Start](02-quick-start.md).

---

**← Back to [Index](00-index.md)** | **Next → [Quick Start](02-quick-start.md)**
