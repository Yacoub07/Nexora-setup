"""
Version command module for NEXORA Forge.
"""

import json
import typer
from nexora.core.version import VERSION, CODENAME, APP_NAME, RELEASE_DATE
from nexora.utils.formatter import console

app = typer.Typer(help="Display NEXORA Forge version information", invoke_without_command=True)


@app.callback(invoke_without_command=True)
def version_command(
    json_output: bool = typer.Option(False, "--json", "-j", help="Output version as JSON")
) -> None:
    """Displays version details for NEXORA Forge."""
    if json_output:
        data = {
            "app_name": APP_NAME,
            "version": VERSION,
            "codename": CODENAME,
            "release_date": RELEASE_DATE
        }
        console.print_json(json.dumps(data))
    else:
        console.print(f"[bold cyan]{APP_NAME}[/bold cyan] v[bold green]{VERSION}[/bold green] ([dim]{CODENAME}[/dim])")
