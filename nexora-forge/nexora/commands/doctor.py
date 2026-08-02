"""
Doctor diagnostic command module for NEXORA Forge.
"""

import json
from pathlib import Path
import typer
from nexora.services.doctor_service import DoctorService
from nexora.utils.formatter import console, render_doctor_table, print_header, print_success, print_warning, print_error

app = typer.Typer(help="Run system diagnostics and environment health checks", invoke_without_command=True)


@app.callback(invoke_without_command=True)
def doctor_command(
    path: Path = typer.Option(Path("."), "--path", "-p", help="Target workspace path to inspect"),
    json_output: bool = typer.Option(False, "--json", "-j", help="Output diagnostic report in JSON format"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Display verbose diagnostic details")
) -> None:
    """Executes environment, tooling, and workspace health diagnostics."""
    doctor_service = DoctorService()
    report = doctor_service.run_diagnostics(path)

    if json_output:
        console.print_json(json.dumps(report))
        return

    print_header("NEXORA Doctor Diagnostics", f"Inspecting workspace at '{report['target_path']}'")
    
    # Render table
    table = render_doctor_table(report["checks"])
    console.print(table)
    console.print("")

    # Print summary status badge
    status = report["overall_status"]
    summary = report["summary"]

    if status == "HEALTHY":
        print_success(f"System environment is HEALTHY. All {summary['total']} checks passed.")
    elif status == "WARNING":
        print_warning(f"System environment is READY WITH WARNINGS ({summary['warn']} warnings).")
    else:
        print_error(f"System environment checks CRITICAL ({summary['fail']} failed, {summary['warn']} warnings).")
        raise typer.Exit(code=1)
