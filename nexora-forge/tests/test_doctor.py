"""
Tests for doctor service and nexora doctor command.
"""

from pathlib import Path
from typer.testing import CliRunner
from nexora.cli import app
from nexora.services.doctor_service import DoctorService


def test_doctor_service_run_diagnostics(valid_workspace_dir: Path) -> None:
    """Test DoctorService logic on a valid workspace directory."""
    service = DoctorService()
    report = service.run_diagnostics(target_path=valid_workspace_dir)

    assert "overall_status" in report
    assert report["overall_status"] in ["HEALTHY", "WARNING", "CRITICAL"]
    assert len(report["checks"]) >= 5
    assert report["summary"]["total"] >= 5


def test_doctor_command_json(cli_runner: CliRunner, valid_workspace_dir: Path) -> None:
    """Test nexora doctor --json output."""
    result = cli_runner.invoke(app, ["doctor", "--path", str(valid_workspace_dir), "--json"])
    assert result.exit_code == 0
    assert '"overall_status"' in result.stdout
    assert '"checks"' in result.stdout


def test_doctor_command_table(cli_runner: CliRunner, valid_workspace_dir: Path) -> None:
    """Test nexora doctor table rendering."""
    result = cli_runner.invoke(app, ["doctor", "--path", str(valid_workspace_dir)])
    assert "NEXORA Doctor Diagnostic Report" in result.stdout
    assert "Python Version" in result.stdout
    assert "Operating System" in result.stdout
