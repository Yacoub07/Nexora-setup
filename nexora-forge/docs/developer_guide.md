# NEXORA Forge Developer Guide

Welcome to the NEXORA Forge developer guide! This document explains the codebase design, Clean Architecture conventions, error handling protocols, and how to add new commands or services.

---

## Code Base Organization

```text
nexora-forge/
├── nexora/                 # Core Python Package
│   ├── __init__.py         # Package entry point
│   ├── __main__.py        # Executable entry point (`python -m nexora`)
│   ├── cli.py             # Main Typer app and exception handler setup
│   ├── core/              # Constants, Exceptions, Logging, Config
│   ├── commands/          # Typer commands (UI / Argument Parsing only)
│   ├── services/          # Pure Business Logic Services
│   └── utils/             # Formatting, File system helpers
├── tests/                 # Comprehensive Pytest suite
└── docs/                  # Project documentation
```

---

## Core Development Rules

### Rule 1: Clean Architecture Layer Isolation
1. **Commands** (`nexora/commands/*.py`):
   - Responsible **ONLY** for receiving input arguments from Typer.
   - Must delegation all computation to **Services**.
   - Must use `nexora.utils.formatter` to present Rich output.
   - **MUST NOT** perform raw filesystem I/O, network requests, or complex logic.

2. **Services** (`nexora/services/*.py`):
   - Pure Python business logic classes (e.g., `DoctorService`, `WorkspaceService`).
   - Throw custom `NexoraException` subclasses on errors.
   - Return structured data objects or domain models.
   - Independent of Typer or presentation layer details.

3. **Core** (`nexora/core/*.py`):
   - Contains version specifications (`version.py`), base exceptions (`exceptions.py`), configuration management (`config.py`), and logger factories (`logging.py`).

---

## How to Add a New Command

Example: Adding a new `nexora build` command.

1. **Create the Service**:
   Add `nexora/services/build_service.py`:
   ```python
   from pathlib import Path
   from nexora.core.exceptions import NexoraException

   class BuildService:
       def execute_build(self, workspace_path: Path) -> dict:
           # Pure build logic here
           return {"status": "success", "artifacts": ["dist/bundle.tar.gz"]}
   ```

2. **Create the Command**:
   Add `nexora/commands/build.py`:
   ```python
   import typer
   from pathlib import Path
   from nexora.services.build_service import BuildService
   from nexora.utils.formatter import print_success

   app = typer.Typer(help="Build NEXORA artifacts")

   @app.callback(invoke_without_command=True)
   def build_command(
       path: Path = typer.Option(Path("."), "--path", "-p", help="Target path")
   ) -> None:
       service = BuildService()
       result = service.execute_build(path)
       print_success(f"Build completed: {result['artifacts']}")
   ```

3. **Register in `cli.py`**:
   In `nexora/cli.py`:
   ```python
   from nexora.commands.build import app as build_app
   app.add_typer(build_app, name="build")
   ```

4. **Write Tests**:
   Add `tests/test_build.py` with full Pytest coverage.

---

## Error Handling Standards

Always raise domain-specific exceptions inheriting from `NexoraException`:

```python
class WorkspaceNotFoundError(NexoraException):
    """Raised when a workspace manifest cannot be located."""
    pass
```

The global CLI exception handler in `cli.py` catches `NexoraException` automatically and prints a formatted Rich error panel before exiting with code 1.

---

## Testing Standards

- Use `CliRunner` from `typer.testing` for CLI testing.
- Use `tmp_path` pytest fixture for directory operations.
- Maintain >90% code coverage.
