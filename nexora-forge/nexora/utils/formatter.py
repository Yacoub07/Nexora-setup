"""
Rich formatting utilities for NEXORA Forge CLI output.
"""

from typing import Any, Dict, List, Optional
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.tree import Tree

console = Console()
error_console = Console(stderr=True)


def print_banner() -> None:
    """Prints the official NEXORA Forge banner."""
    title = Text("NEXORA FORGE", style="bold cyan")
    subtitle = Text("Official Ecosystem Development CLI v0.1.0", style="dim white")
    banner_text = Text.assemble(title, "\n", subtitle)
    console.print(Panel(banner_text, border_style="cyan", padding=(0, 2)))


def print_header(title: str, subtitle: Optional[str] = None) -> None:
    """Prints a styled section header."""
    text = f"[bold cyan]=== {title} ===[/bold cyan]"
    if subtitle:
        text += f"\n[dim]{subtitle}[/dim]"
    console.print(text)


def print_success(message: str) -> None:
    """Prints a green success message."""
    console.print(f"[bold green]✔[/bold green] {message}")


def print_warning(message: str) -> None:
    """Prints a yellow warning message."""
    console.print(f"[bold yellow]⚠[/bold yellow] {message}")


def print_error(message: str, details: Optional[str] = None) -> None:
    """Prints a red error message or panel."""
    content = f"[bold red]✖ {message}[/bold red]"
    if details:
        content += f"\n\n[dim white]{details}[/dim white]"
    error_console.print(Panel(content, title="[bold red]Error[/bold red]", border_style="red"))


def render_doctor_table(checks: List[Dict[str, Any]]) -> Table:
    """Renders a Rich Table for doctor diagnostics."""
    table = Table(
        title="[bold cyan]NEXORA Doctor Diagnostic Report[/bold cyan]",
        show_header=True,
        header_style="bold blue",
        expand=True
    )
    table.add_column("Category", style="cyan", width=18)
    table.add_column("Check Name", style="white", width=25)
    table.add_column("Status", width=12, justify="center")
    table.add_column("Message / Recommendation", style="dim")

    for check in checks:
        status_str = check.get("status", "FAIL")
        if status_str == "OK" or status_str == "PASS":
            status_badge = "[bold green]✔ PASS[/bold green]"
        elif status_str == "WARN":
            status_badge = "[bold yellow]⚠ WARN[/bold yellow]"
        else:
            status_badge = "[bold red]✖ FAIL[/bold red]"

        message = check.get("message", "")
        if check.get("recommendation") and status_str != "PASS":
            message += f" ([italic yellow]Fix: {check['recommendation']}[/italic yellow])"

        table.add_row(
            check.get("category", "General"),
            check.get("name", "Unknown Check"),
            status_badge,
            message
        )

    return table


def render_workspace_info_panel(info: Dict[str, Any]) -> Panel:
    """Renders workspace metadata as a clean Rich panel."""
    tree = Tree(f"[bold cyan]📁 Workspace: {info.get('name', 'N/A')}[/bold cyan]")
    tree.add(f"[bold]Version:[/bold] {info.get('version', '0.0.0')}")
    tree.add(f"[bold]Environment:[/bold] [green]{info.get('environment', 'dev')}[/green]")
    tree.add(f"[bold]Manifest Path:[/bold] [dim]{info.get('manifest_path', 'N/A')}[/dim]")
    tree.add(f"[bold]Description:[/bold] {info.get('description', 'No description')}")
    
    comp_branch = tree.add("[bold]Components / Packages:[/bold]")
    components = info.get("components", [])
    if components:
        for c in components:
            comp_branch.add(f"[cyan]• {c}[/cyan]")
    else:
        comp_branch.add("[dim](None registered)[/dim]")

    dirs_branch = tree.add("[bold]Directory Structure:[/bold]")
    for d, exists in info.get("directory_status", {}).items():
        icon = "[green]✔[/green]" if exists else "[red]✖[/red]"
        dirs_branch.add(f"{icon} {d}/")

    return Panel(tree, title="[bold white]NEXORA Workspace Diagnostic Info[/bold white]", border_style="cyan")
