"""
Tests for version command and version service constants.
"""

from typer.testing import CliRunner
from nexora.cli import app
from nexora.core.version import VERSION, CODENAME, APP_NAME


def test_version_command_default(cli_runner: CliRunner) -> None:
    """Test standard version command output."""
    result = cli_runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert VERSION in result.stdout
    assert CODENAME in result.stdout
    assert APP_NAME in result.stdout


def test_version_command_json(cli_runner: CliRunner) -> None:
    """Test version command with --json flag."""
    result = cli_runner.invoke(app, ["version", "--json"])
    assert result.exit_code == 0
    assert f'"version": "{VERSION}"' in result.stdout
    assert f'"codename": "{CODENAME}"' in result.stdout
