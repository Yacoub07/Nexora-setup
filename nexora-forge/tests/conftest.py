"""
Pytest fixtures for NEXORA Forge tests.
"""

from pathlib import Path
import pytest
from typer.testing import CliRunner


@pytest.fixture
def cli_runner() -> CliRunner:
    """Fixture providing Typer CLI test runner."""
    return CliRunner()


@pytest.fixture
def valid_workspace_dir(tmp_path: Path) -> Path:
    """Fixture creating a temporary valid NEXORA workspace directory."""
    ws_dir = tmp_path / "my_nexora_project"
    ws_dir.mkdir()
    
    # Create required subdirectories
    (ws_dir / "src").mkdir()
    (ws_dir / "tests").mkdir()
    (ws_dir / "docs").mkdir()

    # Create manifest file
    manifest = ws_dir / "nexora.yaml"
    manifest.write_text(
        "name: core-service\n"
        "version: 0.1.0\n"
        "description: Primary backend core service for NEXORA ecosystem.\n"
        "environment: development\n"
        "components:\n"
        "  - auth\n"
        "  - database\n"
        "  - api-gateway\n",
        encoding="utf-8"
    )

    return ws_dir


@pytest.fixture
def invalid_workspace_dir(tmp_path: Path) -> Path:
    """Fixture creating an invalid workspace directory missing manifest and required folders."""
    ws_dir = tmp_path / "empty_dir"
    ws_dir.mkdir()
    return ws_dir


@pytest.fixture
def broken_manifest_dir(tmp_path: Path) -> Path:
    """Fixture creating a workspace with broken manifest syntax."""
    ws_dir = tmp_path / "broken_project"
    ws_dir.mkdir()
    manifest = ws_dir / "nexora.yaml"
    manifest.write_text("name: [broken syntax yaml:", encoding="utf-8")
    return ws_dir
