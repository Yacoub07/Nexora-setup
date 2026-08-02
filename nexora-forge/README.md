# NEXORA Forge (v0.1.0 – Sprint 1)

[![Python 3.12+](https://img.shields.io/badge/python-3.12%2B-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Architecture: Clean](https://img.shields.io/badge/Architecture-Clean%20Architecture-emerald.svg)](#architecture)

**NEXORA Forge** is the official development CLI and developer toolchain for the NEXORA ecosystem. Built with Python 3.12+, Typer, and Rich, NEXORA Forge enforces Clean Architecture principles, enterprise-grade diagnostics, and automated workspace validation.

---

## ⚡ Key Features

- **Clean Architecture Engine**: Strict separation between CLI presentation, application services, core domain models, and infrastructure utilities.
- **Enterprise Diagnostics (`nexora doctor`)**: Thorough health check of Python runtime, OS environment, Git binary integration, workspace markers, and directory structure integrity.
- **Workspace Inspector (`nexora workspace info`)**: Instant detection, metadata extraction, component mapping, and dependency inspection for NEXORA workspaces.
- **Automated Validation (`nexora workspace validate`)**: Schema compliance, required directory checks, file permission checks, and structural linting.
- **Semantic Versioning (`nexora --version`)**: Standardized version management and codename output.
- **Structured Rich Terminal UI**: High-contrast tables, status indicators, panels, and ANSI color formatting.

---

## 🚀 Installation

### Prerequisites
- Python **3.12+**
- Git 2.30+

### Install via pip (Development Mode)

```bash
# Clone repository
git clone https://github.com/nexora-ecosystem/nexora-forge.git
cd nexora-forge

# Create and activate virtual environment
python3.12 -m venv .venv
source .venv/bin/activate

# Install package in editable mode with development dependencies
pip install -e ".[dev]"
```

---

## 📖 CLI Usage Reference

### Global Help & Version

```bash
# Display CLI help menu
nexora --help

# Display version information
nexora --version
# Output: NEXORA Forge v0.1.0 (Sprint-1 Genesis)
```

### System Diagnostics

```bash
# Run full environment and workspace health checks
nexora doctor

# Run doctor in verbose mode with detailed system specs
nexora doctor --verbose

# Output JSON report for CI/CD integration
nexora doctor --json
```

### Workspace Inspection & Validation

```bash
# Inspect current working directory workspace
nexora workspace info

# Inspect a specific workspace path
nexora workspace info --path /path/to/project

# Validate workspace structure and nexora.yaml schema
nexora workspace validate

# Run strict validation (fails on warnings)
nexora workspace validate --strict

# Output validation report in JSON format
nexora workspace validate --json
```

---

## 🏗️ Architecture Overview

NEXORA Forge strictly follows **Clean Architecture**:

```text
       ┌──────────────────────────────────────┐
       │         CLI Layer (cli.py)           │
       └──────────────────┬───────────────────┘
                          │
       ┌──────────────────▼───────────────────┐
       │       Commands (doctor, workspace)   │
       └──────────────────┬───────────────────┘
                          │
       ┌──────────────────▼───────────────────┐
       │      Services (DoctorService, etc.)   │
       └─────────┬──────────────────┬─────────┘
                 │                  │
  ┌──────────────▼──────────┐ ┌─────▼───────────────┐
  │ Core Domain & Config    │ │ Utilities (fs, fmt) │
  └─────────────────────────┘ └─────────────────────┘
```

> **Rule**: Commands *never* contain business logic. Commands only parse CLI input, call services, and render output using Rich formatters.

---

## 🧪 Testing

Run unit tests using Pytest:

```bash
# Run all tests with coverage report
pytest

# Run specific test module
pytest tests/test_doctor.py
```

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
