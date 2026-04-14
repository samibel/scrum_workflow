# Implementation Patterns

**← Back to [Index](00-index.md)** | **← Previous: [Anti-Patterns](11-anti-patterns.md)** | **Next → [Error Recovery](13-error-recovery.md)**

**Note:** This document contains 16 implementation patterns with code examples.

---

## Pattern 1: Guard Condition Enforcement

```python
def require_status(story: Story, expected: Status) -> None:
    """Enforce state machine guard condition."""
    if story.status != expected:
        raise GuardConditionError(
            f"Story {story.id} is {story.status}, "
            f"but requires {expected}"
        )
```

---

## Pattern 2: Atomic File Write

```python
def write_atomic(path: str, content: str) -> None:
    """Write file atomically (NFR1 compliance)."""
    import tempfile
    import os

    tmp_path = f"{path}.tmp"
    with open(tmp_path, 'w') as f:
        f.write(content)

    os.rename(tmp_path, path)  # Single syscall
```

---

## Pattern 3: Write Boundary Validation

```python
class WriteBoundaryValidator:
    """Validate file write permissions."""

    def __init__(self, phase: str):
        self.phase = phase
        self.allowed = self._allowed_files()
        self.prohibited = self._prohibited_files()

    def validate_write(self, path: str) -> bool:
        """Check if write is allowed."""
        if path in self.prohibited:
            raise WriteBoundaryError(
                f"Phase {self.phase} cannot write {path}"
            )
        return True
```

---

## Pattern 4: Incremental File Numbering

```python
def get_next_increment(sprint_folder: str, pattern: str) -> int:
    """Get next number for incremental files."""
    import re
    import os

    highest = 0
    for filename in os.listdir(sprint_folder):
        match = re.match(f"{pattern}-(\\d+)\\.md", filename)
        if match:
            num = int(match.group(1))
            highest = max(highest, num)

    return highest + 1
```

---

## Pattern 5: Context Loading

```python
def load_context(story: Story, project_root: str) -> dict:
    """Load domain context based on story keywords."""
    import os
    import re

    context = {}
    context_dir = f"{project_root}/scrum_workflow/context"
    keywords = extract_keywords(story.description + story.acceptance_criteria)

    for keyword in keywords:
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        for filename in os.listdir(context_dir):
            if filename.endswith('.md') and pattern.search(filename):
                filepath = os.path.join(context_dir, filename)
                context[filename] = read_file(filepath)

    return context
```

---

## Pattern 6: Status Transition with Rollback

```python
def update_status_safe(story_path: str, new_status: Status) -> bool:
    """Update story status with rollback on failure."""
    import os
    import yaml

    try:
        content = read_file(story_path)
        # Parse, update, write atomically
        write_atomic(story_path, new_content)

        # Verify
        if verify_status(story_path, new_status):
            return True
        else:
            write_atomic(story_path, content)  # Rollback
            raise StatusUpdateError("Verification failed")
    except Exception as e:
        write_atomic(story_path, content)  # Rollback
        raise StatusUpdateError(f"Status update failed: {e}")
```

---

## Pattern 7: Sprint Status Sync

```python
def sync_sprint_status(sprint_file: str, story_key: str, new_status: str):
    """Update sprint status tracking."""
    import yaml
    from datetime import datetime

    with open(sprint_file, 'r') as f:
        sprint_data = yaml.safe_load(f)

    sprint_data['development_status'][story_key] = new_status
    sprint_data['last_updated'] = datetime.now().strftime("%Y-%m-%d")

    write_atomic(sprint_file, yaml.dump(sprint_data))
```

---

## Pattern 8: Review Findings Generation

```python
def generate_review_finding(
    finding_id: int,
    issue: str,
    severity: str,
    ac_reference: str,
    suggested_fix: str
) -> dict:
    """Generate a structured review finding."""
    return {
        '#': finding_id,
        'Finding': issue,
        'Severity': severity,
        'AC Reference': ac_reference,
        'Suggested Fix': suggested_fix
    }

def categorize_severity(issue: str) -> str:
    """Categorize issue severity."""
    critical_keywords = ['security', 'vulnerability', 'critical']
    major_keywords = ['architecture', 'missing', 'performance']

    issue_lower = issue.lower()

    if any(kw in issue_lower for kw in critical_keywords):
        return 'Critical'
    elif any(kw in issue_lower for kw in major_keywords):
        return 'Major'
    else:
        return 'Minor'
```

---

## Pattern 9: Template Variable Substitution

```python
def substitute_template(template: str, variables: dict, defaults: dict) -> str:
    """Substitute template variables with fallback to defaults."""
    import re

    result = template
    pattern = re.compile(r'\{\{(\w+)(?:\|([^}]*))?\}\}')

    for match in pattern.finditer(template):
        var_name = match.group(1)
        default_val = match.group(2) if match.group(2) else None

        if var_name in variables and variables[var_name]:
            value = variables[var_name]
        elif default_val is not None:
            value = default_val
        else:
            value = f"{{{var_name}}}"

        result = result.replace(match.group(0), str(value))

    return result
```

---

## Pattern 10: Audit Trail Logging

```python
import logging
from datetime import datetime
import json

class AuditTrail:
    """Manage audit trail logging for workflow events."""

    def __init__(self, sprint_folder: str):
        self.sprint_folder = sprint_folder
        self.log_file = f"{sprint_folder}/audit.log"
        self._setup_logger()

    def log_status_transition(
        self,
        story_id: str,
        from_status: str,
        to_status: str,
        actor: str,
        reason: str = ""
    ):
        """Log status transition."""
        event = {
            'event': 'status_transition',
            'story_id': story_id,
            'from': from_status,
            'to': to_status,
            'actor': actor,
            'reason': reason,
            'timestamp': datetime.now().isoformat()
        }
        self.logger.info(json.dumps(event))
```

---

## Pattern 11: Story File Parsing

```python
import yaml

def parse_story_file(story_path: str) -> dict:
    """Parse story.md and extract frontmatter and content."""
    with open(story_path, 'r') as f:
        content = f.read()

    # Split frontmatter and body
    if content.startswith('---'):
        end_idx = content.index('\n---\n', 4)
        frontmatter_text = content[4:end_idx]
        body_text = content[end_idx+4:]
    else:
        raise ValueError("No YAML frontmatter found")

    # Parse YAML frontmatter
    frontmatter = yaml.safe_load(frontmatter_text)

    # Validate required fields
    required_fields = ['schema_version', 'ticket', 'title', 'status']
    for field in required_fields:
        if field not in frontmatter:
            raise ValueError(f"Missing required field: {field}")

    return {
        'frontmatter': frontmatter,
        'body': body_text,
        'content': content
    }
```

---

## Pattern 12: Concurrent Access Prevention

```python
import fcntl
from contextlib import contextmanager

@contextmanager
def file_lock(lock_path: str, timeout: float = 5.0):
    """Context manager for file locking (Unix only)."""
    lock_file = None
    try:
        lock_file = open(lock_path, 'w')
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        yield lock_file
    finally:
        if lock_file:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)
            lock_file.close()

# Usage
def update_story_with_lock(story_path: str, updates: dict):
    """Update story file with concurrent access protection."""
    lock_path = f"{story_path}.lock"

    with file_lock(lock_path):
        story = parse_story_file(story_path)
        for key, value in updates.items():
            story['frontmatter'][key] = value
        write_story_file(story_path, story)
```

---

## Pattern 13: Human Input Validation

```python
import re
from typing import Optional, Tuple

class HumanInputValidator:
    """Validate human input for approval decisions."""

    @staticmethod
    def validate_approval_decision(input_str: str) -> Tuple[bool, Optional[str]]:
        """Validate approval/reject decision."""
        if not input_str:
            return False, "Input cannot be empty"

        input_clean = input_str.strip().lower()

        approve_patterns = ['1', 'approve', 'approved', 'yes', 'y']
        reject_patterns = ['2', 'reject', 'rejected', 'no', 'n']

        if input_clean in approve_patterns:
            return True, 'APPROVED'
        elif input_clean in reject_patterns:
            return False, 'REJECTED'
        else:
            return False, None
```

---

## Pattern 14: Sprint Folder Creation

```python
import os

def create_sprint_folder(project_root: str, story_id: str) -> str:
    """Create sprint folder with proper structure."""
    sprint_id = story_id.replace('_', '-')
    sprint_folder = os.path.join(project_root, 'sprints', sprint_id)

    os.makedirs(sprint_folder, exist_ok=True)
    return sprint_folder

def initialize_story_files(sprint_folder: str, story_id: str, title: str):
    """Initialize empty story files in sprint folder."""
    story_path = os.path.join(sprint_folder, 'story.md')

    if not os.path.exists(story_path):
        template = f"""---
schema_version: 1
ticket: "{story_id}"
title: "{title}"
status: "draft"
---

## Story

## Acceptance Criteria

## Tasks / Subtasks
"""
        write_atomic(story_path, template)

    return story_path
```

---

## Pattern 15: Diff Generation

```python
import subprocess

class DiffGenerator:
    """Generate code diffs for review."""

    def __init__(self, base_branch: str = 'main'):
        self.base_branch = base_branch

    def get_git_diff(self, files: list = None) -> str:
        """Get git diff for specified files."""
        cmd = ['git', 'diff', self.base_branch]

        if files:
            cmd.extend(['--'] + files)

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        return result.stdout

    def detect_changed_files(self) -> list:
        """Detect list of changed files."""
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True,
            check=False
        )

        files = []
        for line in result.stdout.split('\n'):
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 2:
                if parts[0] in ('M', 'A', 'R'):
                    files.append(parts[1])

        return files
```

---

## Pattern 16: Error Recovery with Graceful Degradation

```python
import logging
from typing import Optional, Callable, Any
from functools import wraps

def recoverable_error(
    fallback_value: Any = None,
    log_error: bool = True
):
    """Decorator for recoverable errors with fallback."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if log_error:
                    logging.error(f"Error in {func.__name__}: {e}")

                if fallback_value is not None:
                    logging.info(f"Using fallback for {func.__name__}")
                    return fallback_value

                raise
        return wrapper
    return decorator

class ErrorRecovery:
    """Centralized error recovery strategies."""

    @staticmethod
    def recover_file_operation(
        operation: Callable,
        file_path: str,
        max_retries: int = 3
    ) -> bool:
        """Recover from file operation failures with retries."""
        last_error = None

        for attempt in range(max_retries):
            try:
                operation()
                return True
            except (IOError, OSError) as e:
                last_error = e
                if attempt < max_retries - 1:
                    import time
                    time.sleep(0.5 * (attempt + 1))

        return False
```

---

## Pattern Summary

| Pattern | Purpose | Complexity |
|---------|---------|------------|
| **Guard Condition** | Enforce state machine | ⭐ Simple |
| **Atomic Write** | NFR1 compliance | ⭐⭐ Medium |
| **Write Boundary** | Phase isolation | ⭐⭐ Medium |
| **Incremental Numbering** | File versioning | ⭐ Simple |
| **Context Loading** | Domain-specific loading | ⭐⭐⭐ Complex |
| **Status Transition** | Safe status updates | ⭐⭐⭐⭐ Advanced |
| **Sprint Status Sync** | Status tracking | ⭐⭐ Medium |
| **Review Findings** | Structured findings | ⭐⭐⭐ Complex |
| **Template Substitution** | Template filling | ⭐⭐ Medium |
| **Audit Trail** | Compliance logging | ⭐⭐⭐ Complex |
| **Story File Parsing** | YAML frontmatter extraction | ⭐⭐ Medium |
| **Concurrent Access** | Race condition prevention | ⭐⭐⭐⭐ Advanced |
| **Input Validation** | Human input sanitization | ⭐⭐ Medium |
| **Folder Creation** | Sprint initialization | ⭐⭐ Medium |
| **Diff Generation** | Change detection | ⭐⭐⭐ Complex |
| **Error Recovery** | Graceful degradation | ⭐⭐⭐⭐ Advanced |

---

## See also

- [Error Recovery](13-error-recovery.md) - Recovery strategies
- [Extension Points](14-extension-points.md) - Customization
- [Write Boundary Rules](07-write-boundary-rules.md) - File permissions

---

**← Back to [Index](00-index.md)** | **← Previous: [Anti-Patterns](11-anti-patterns.md)** | **Next → [Error Recovery](13-error-recovery.md)**
