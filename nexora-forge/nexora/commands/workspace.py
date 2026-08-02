"""
Workspace subcommand group for NEXORA Forge.
"""

import json
from pathlib import Path
import typer
from nexora.core.exceptions import WorkspaceNotFoundError, WorkspaceInvalidError
from nexora.services.workspace_service import WorkspaceService
from nexora.utils.formatter import (
    console,
    render_workspace_info_panel,
    print_header,
    print_success,
    print_warning,
    print_error,
)

app = typer.Typer(help="Inspect, detect, and validate NEXORA workspaces")


@app.command("info")
def info_command(
    path: Path = typer.Option(Path("."), "--path", "-p", help="Target workspace path"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Output workspace info as JSON")
) -> None:
    """Detects whether current directory is a valid NEXORA workspace and displays diagnostic info."""
    service = WorkspaceService()
    try:
        info = service.get_workspace_info(path)
        if json_output:
            console.print_json(json.dumps(info))
            return

        panel = render_workspace_info_panel(info)
        console.print(panel)
    except WorkspaceNotFoundError as e:
        if json_output:
            console.print_json(json.dumps({"is_valid_workspace": False, "error": str(e)}))
        else:
            print_error(str(e), details="Run 'nexora workspace validate' or ensure a 'nexora.yaml' manifest exists.")
        raise typer.Exit(code=1)


@app.command("validate")
def validate_command(
    path: Path = typer.Option(Path("."), "--path", "-p", help="Target workspace path"),
    strict: bool = typer.Option(False, "--strict", "-s", help="Fail on warnings as well as errors"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Output validation report as JSON")
) -> None:
    """Validates NEXORA workspace directory structure, manifest configuration, and schema."""
    service = WorkspaceService()
    report = service.validate_workspace(path, strict=strict)

    if json_output:
        console.print_json(json.dumps(report))
        if not report["valid"]:
            raise typer.Exit(code=1)
        return

    print_header("NEXORA Workspace Validation", f"Manifest: {report.get('manifest_path', 'None')}")

    if report["checks_passed"]:
        console.print("[bold green]Passed Checks:[/bold green]")
        for check in report["checks_passed"]:
            console.print(f"  [green]✔[/green] {check}")

    if report["warnings"]:
        console.print("\n[bold yellow]Warnings:[/bold yellow]")
        for warn in report["warnings"]:
            console.print(f"  [yellow]⚠[/yellow] {warn}")

    if report["errors"]:
        console.print("\n[bold red]Errors:[/bold red]")
        for err in report["errors"]:
            console.print(f"  [red]✖[/red] {err}")

    console.print("")
    score_color = "green" if report["score"] >= 80 else ("yellow" if report["score"] >= 50 else "red")
    console.print(f"[bold]Validation Score:[/bold] [{score_color}]{report['score']}%[/{score_color}]")

    if report["valid"]:
        print_success("Workspace structure is VALID.")
    else:
        print_error("Workspace validation FAILED.", details="Fix the errors listed above.")
        raise typer.Exit(code=1)
