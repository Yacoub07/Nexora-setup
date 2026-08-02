#!/usr/bin/env bash

# NEXORA Forge Developer Setup Script
set -e

echo "=== Setting up NEXORA Forge Development Environment ==="

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] python3 could not be found."
    exit 1
fi

PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Detected Python version: $PY_VER"

# Create virtual environment if not exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment in .venv..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip and build tools
echo "Upgrading pip and wheel..."
pip install --upgrade pip setuptools wheel

# Install dependencies in editable mode
echo "Installing nexora-forge package in editable mode with [dev] dependencies..."
pip install -e ".[dev]"

# Run tests to verify installation
echo "Running pytest test suite..."
pytest

echo ""
echo "=== NEXORA Forge environment setup complete! ==="
echo "Run 'source .venv/bin/activate' and try 'nexora --help'"
