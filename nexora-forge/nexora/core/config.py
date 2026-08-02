"""
Global configuration specifications and workspace constants.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

WORKSPACE_MARKERS = [
    "nexora.yaml",
    "nexora.yml",
    ".nexora/config.json",
    "nexora.json"
]

REQUIRED_WORKSPACE_DIRS = [
    "src",
    "tests",
    "docs"
]

DEFAULT_PYTHON_MIN_VERSION = (3, 12)


@dataclass
class WorkspaceMetadata:
    """Represents data loaded from a workspace configuration file."""
    name: str
    version: str
    description: str
    environment: str = "development"
    author: str = "Unknown"
    components: List[str] = field(default_factory=list)
    manifest_path: Optional[Path] = None


@dataclass
class NexoraConfig:
    """Global NEXORA CLI runtime configuration."""
    verbose: bool = False
    json_output: bool = False
    log_level: str = "INFO"
    workspace_root: Path = field(default_factory=lambda: Path.cwd())
