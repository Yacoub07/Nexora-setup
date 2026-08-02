"""
Tests for main CLI entry point, help flag, and error handling.
"""

from typer.testing import CliRunner
from nexora.cli import app


def test_cli_help(cli_runner: CliRunner) -> None:
    """Test that nexora --help displays top-level help menu and available subcommands."""
    result = cli_runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "NEXORA Ecosystem Development CLI" in result.stdout
    assert "doctor" in result.stdout
    assert "workspace" in result.stdout
    assert "version" in result.stdout


def test_cli_version_flag(cli_runner: CliRunner) -> None:
    """Test that nexora --version outputs version string and exits 0."""
    result = cli_runner.invoke(app, ["--version"])
    assert result.exit_code == 0
    assert "0.1.0" in result.stdout
    assert "NEXORA Forge" in result.stdout


def test_cli_no_args_shows_help(cli_runner: CliRunner) -> None:
    """Test that invoking nexora without arguments shows help menu."""
    result = cli_runner.invoke(app, [])
    assert "NEXORA Ecosystem Development CLI" in result.stdout
