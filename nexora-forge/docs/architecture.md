# NEXORA Forge Architecture Overview

This document describes the architectural principles, component structure, and design decisions powering **NEXORA Forge**.

---

## Architectural Philosophy: Clean Architecture

NEXORA Forge is designed to serve as the core developer tool for the NEXORA ecosystem. As the ecosystem expands, NEXORA Forge must remain decoupled, easily testable, and robust against external framework changes.

```text
+-------------------------------------------------------------+
|                      PRESENTATION LAYER                     |
|  - Typer CLI App (nexora/cli.py)                            |
|  - Subcommands (nexora/commands/doctor.py, workspace.py)    |
|  - Rich Formatting Output (nexora/utils/formatter.py)       |
+------------------------------+------------------------------+
                               | Calls
                               v
+-------------------------------------------------------------+
|                      APPLICATION LAYER                      |
|  - DoctorService (nexora/services/doctor_service.py)       |
|  - WorkspaceService (nexora/services/workspace_service.py)  |
|  - SystemService (nexora/services/system_service.py)       |
+------------------------------+------------------------------+
                               | Uses
                               v
+-------------------------------------------------------------+
|                     CORE DOMAIN LAYER                       |
|  - NexoraConfig (nexora/core/config.py)                     |
|  - NexoraException Hierarchy (nexora/core/exceptions.py)    |
|  - Version Specs (nexora/core/version.py)                   |
|  - Logging Engine (nexora/core/logging.py)                  |
+-------------------------------------------------------------+
```

---

## Layer Responsibilities

### 1. Presentation Layer (`nexora.commands` & `nexora.cli`)
- Defines CLI subcommands, parameters, options, help flags, and argument validation.
- Transforms CLI input into service method calls.
- Never executes direct file modifications, system inspections, or validation algorithms.
- Receives rich domain response objects from services and passes them to `nexora.utils.formatter`.

### 2. Service Layer (`nexora.services`)
- Encapsulates all application use cases.
- `DoctorService`: Executes diagnostic checks sequentially (Python, OS, Git, Workspace, Schema), compiles `DoctorReport`.
- `WorkspaceService`: Detects workspace markers (`nexora.yaml`, `.nexora/config.json`), extracts workspace info, validates workspace directories and schema.
- `SystemService`: Interfaces with standard library `sys`, `platform`, `subprocess`, and `shutil` to query system state safely.

### 3. Core Domain Layer (`nexora.core`)
- Completely independent of external CLI tools.
- Defines data models, domain schemas, error types, constants, and logging specifications.

---

## Error Handling Flow

```text
[System/IO Error] ---> Service raises NexoraException ---> Command lets exception bubble up ---> cli.py Exception Handler catches it ---> Rich Red Error Panel rendered ---> sys.exit(1)
```

This guarantees uniform error output, clean stack traces in verbose mode, and consistent non-zero exit codes for CI/CD automation.
