"""
File system helper functions.
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional
import yaml


def safe_read_file(path: Path) -> Optional[str]:
    """Safely reads content from a file if it exists."""
    try:
        if path.exists() and path.is_file():
            return path.read_text(encoding="utf-8")
    except Exception:
        pass
    return None


def parse_manifest_file(path: Path) -> Dict[str, Any]:
    """Parses JSON or YAML manifest file into a dictionary."""
    content = safe_read_file(path)
    if not content:
        return {}

    if path.suffix in [".json"]:
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON syntax in '{path.name}': {e}") from e
    elif path.suffix in [".yaml", ".yml"]:
        try:
            parsed = yaml.safe_load(content)
            return parsed if isinstance(parsed, dict) else {}
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML syntax in '{path.name}': {e}") from e
    
    return {}


def ensure_dir(path: Path) -> Path:
    """Ensures that a directory path exists."""
    path.mkdir(parents=True, exist_ok=True)
    return path
