"""
Main Typer CLI app entry point for NEXORA Forge.
"""

from typing import Optional
import typer

from nexora.core.version import VERSION, APP_NAME, CODENAME
from nexora.core.exceptions import NexoraException
from nexora.utils.formatter import console, print_error
from nexora.commands.doctor import app as doctor_app
from nexora.commands.version import app as version_app
from nexora.commands.workspace import app as workspace_app

app = typer.Typer(
    name="nexora",
    help="NEXORA Ecosystem Development CLI (NEXORA Forge)",
    add_completion=False,
    no_args_is_help=True
)

# Register command modules
app.add_typer(doctor_app, name="doctor", help="Run system diagnostics and environment health checks")
app.add_typer(workspace_app, name="workspace", help="Inspect, detect, and validate NEXORA workspaces")
app.add_typer(version_app, name="version", help="Display version details")


def version_callback(value: bool) -> None:
    """Callback for global --version flag."""
    if value:
        console.print(f"[bold cyan]{APP_NAME}[/bold cyan] v[bold green]{VERSION}[/bold green] ([dim]{CODENAME}[/dim])")
        raise typer.Exit()


@app.callback()
def main(
    version: Optional[bool] = typer.Option(
        None,
        "--version",
        "-v",
        help="Display NEXORA Forge version and exit",
        callback=version_callback,
        is_eager=True,
    )
) -> None:
    """NEXORA Forge CLI - Enterprise developer toolchain for the NEXORA Ecosystem."""
    pass


def cli_entrypoint() -> None:
    """Entry point wrapper with exception handling."""
    try:
        app()
    except NexoraException as e:
        print_error(e.message, details=e.details)
        raise typer.Exit(code=e.exit_code)
    except Exception as e:
        print_error(f"Unexpected CLI Error: {e}")
        raise typer.Exit(code=1)


if __name__ == "__main__":
    cli_entrypoint()
