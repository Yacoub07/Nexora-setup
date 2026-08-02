# NEXORA Forge Installation Guide

This document provides complete instructions for installing, configuring, and updating **NEXORA Forge CLI** across platforms.

---

## Requirements

| Requirement | Supported Version | Notes |
|---|---|---|
| **Python** | 3.12 or higher | Native `venv` and type annotations required |
| **Git** | 2.30+ | Required for workspace versioning checks |
| **Operating System** | Linux, macOS, Windows (WSL2 / PowerShell) | Cross-platform compatibility guaranteed |

---

## 1. Quick Installation (Development Editable Mode)

```bash
# 1. Clone the repository
git clone https://github.com/nexora-ecosystem/nexora-forge.git
cd nexora-forge

# 2. Setup environment
python3.12 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install in editable mode
pip install -e ".[dev]"
```

Verify installation:
```bash
nexora --version
```

---

## 2. Production Package Installation

Once published to PyPI or internal package index:

```bash
pip install nexora-forge
```

Or using `pipx` for isolated global CLI installation:

```bash
pipx install nexora-forge
```

---

## 3. Environment Configuration

NEXORA Forge supports optional environment variables defined in `.env` or system environment:

```env
# Optional log level overrides: DEBUG, INFO, WARNING, ERROR
NEXORA_LOG_LEVEL=INFO

# Custom default workspace root override
NEXORA_WORKSPACE_ROOT=.

# Disable rich color formatting if needed
NO_COLOR=0
```

---

## 4. Verification & Health Check

Always run `nexora doctor` right after installation to ensure all system dependencies, Git binaries, Python version compatibility, and workspace structures are ready:

```bash
nexora doctor
```
