"""
Tests for workspace service, nexora workspace info, and nexora workspace validate commands.
"""

from pathlib import Path
from typer.testing import CliRunner
from nexora.cli import app
from nexora.services.workspace_service import WorkspaceService


def test_workspace_service_detection(valid_workspace_dir: Path) -> None:
    """Test workspace discovery and metadata extraction."""
    service = WorkspaceService()
    info = service.get_workspace_info(valid_workspace_dir)

    assert info["is_valid_workspace"] is True
    assert info["name"] == "core-service"
    assert info["version"] == "0.1.0"
    assert "auth" in info["components"]
    assert info["directory_status"]["src"] is True
    assert info["directory_status"]["tests"] is True


def test_workspace_info_command_valid(cli_runner: CliRunner, valid_workspace_dir: Path) -> None:
    """Test nexora workspace info on valid directory."""
    result = cli_runner.invoke(app, ["workspace", "info", "--path", str(valid_workspace_dir)])
    assert result.exit_code == 0
    assert "core-service" in result.stdout
    assert "NEXORA Workspace Diagnostic Info" in result.stdout


def test_workspace_info_command_invalid(cli_runner: CliRunner, invalid_workspace_dir: Path) -> None:
    """Test nexora workspace info on missing manifest directory."""
    result = cli_runner.invoke(app, ["workspace", "info", "--path", str(invalid_workspace_dir)])
    assert result.exit_code == 1
    assert "No valid NEXORA workspace detected" in result.stdout


def test_workspace_validate_command_success(cli_runner: CliRunner, valid_workspace_dir: Path) -> None:
    """Test nexora workspace validate on valid workspace."""
    result = cli_runner.invoke(app, ["workspace", "validate", "--path", str(valid_workspace_dir)])
    assert result.exit_code == 0
    assert "Workspace structure is VALID" in result.stdout
    assert "Score:" in result.stdout


def test_workspace_validate_command_json(cli_runner: CliRunner, valid_workspace_dir: Path) -> None:
    """Test nexora workspace validate --json."""
    result = cli_runner.invoke(app, ["workspace", "validate", "--path", str(valid_workspace_dir), "--json"])
    assert result.exit_code == 0
    assert '"valid": true' in result.stdout
    assert '"score":' in result.stdout
