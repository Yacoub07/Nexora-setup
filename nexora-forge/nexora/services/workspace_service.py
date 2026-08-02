"""
Service for inspecting, discovering, and validating NEXORA workspaces.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional
from nexora.core.config import WORKSPACE_MARKERS, REQUIRED_WORKSPACE_DIRS, WorkspaceMetadata
from nexora.core.exceptions import WorkspaceNotFoundError, WorkspaceInvalidError
from nexora.utils.fs import parse_manifest_file, safe_read_file


class WorkspaceService:
    """Encapsulates business logic for NEXORA workspace operations."""

    def find_workspace_manifest(self, root_path: Path) -> Optional[Path]:
        """Locates the NEXORA workspace configuration manifest in target root or parent paths."""
        current = root_path.resolve()
        
        # Check current directory first
        for marker in WORKSPACE_MARKERS:
            candidate = current / marker
            if candidate.exists() and candidate.is_file():
                return candidate

        # Walk up to 3 parent levels to detect parent workspace
        for _ in range(3):
            if current.parent == current:
                break
            current = current.parent
            for marker in WORKSPACE_MARKERS:
                candidate = current / marker
                if candidate.exists() and candidate.is_file():
                    return candidate

        return None

    def get_workspace_info(self, path: Path) -> Dict[str, Any]:
        """Reads workspace metadata and checks directory structure health."""
        path = path.resolve()
        manifest_path = self.find_workspace_manifest(path)
        
        if not manifest_path:
            raise WorkspaceNotFoundError(str(path))

        raw_data = parse_manifest_file(manifest_path)
        workspace_dir = manifest_path.parent

        # Map directory health
        directory_status = {}
        for d in REQUIRED_WORKSPACE_DIRS:
            target_dir = workspace_dir / d
            directory_status[d] = target_dir.exists() and target_dir.is_dir()

        name = raw_data.get("name") or raw_data.get("project_name") or workspace_dir.name
        version = raw_data.get("version", "0.1.0")
        description = raw_data.get("description", "NEXORA Workspace")
        environment = raw_data.get("environment", "development")
        components = raw_data.get("components", ["core", "api"])

        return {
            "is_valid_workspace": True,
            "name": name,
            "version": version,
            "description": description,
            "environment": environment,
            "components": components,
            "manifest_path": str(manifest_path),
            "workspace_dir": str(workspace_dir),
            "directory_status": directory_status,
            "raw_manifest": raw_data
        }

    def validate_workspace(self, path: Path, strict: bool = False) -> Dict[str, Any]:
        """Performs comprehensive validation checks on a NEXORA workspace."""
        path = path.resolve()
        manifest_path = self.find_workspace_manifest(path)
        
        errors: List[str] = []
        warnings: List[str] = []
        checks_passed: List[str] = []

        if not manifest_path:
            errors.append(f"Workspace manifest missing. Expected one of: {', '.join(WORKSPACE_MARKERS)}")
            return {
                "valid": False,
                "errors": errors,
                "warnings": warnings,
                "checks_passed": checks_passed,
                "score": 0.0
            }

        checks_passed.append(f"Manifest detected at {manifest_path.name}")
        
        # Parse manifest content
        try:
            raw_data = parse_manifest_file(manifest_path)
        except ValueError as e:
            errors.append(f"Manifest syntax error: {e}")
            return {
                "valid": False,
                "errors": errors,
                "warnings": warnings,
                "checks_passed": checks_passed,
                "score": 20.0
            }

        # Check required fields
        if not raw_data.get("name") and not raw_data.get("project_name"):
            errors.append("Manifest missing required field: 'name'")
        else:
            checks_passed.append("Manifest contains valid project 'name'")

        if not raw_data.get("version"):
            warnings.append("Manifest missing explicit 'version' field (defaulting to 0.1.0)")
        else:
            checks_passed.append("Manifest contains valid 'version'")

        # Check required directories
        workspace_dir = manifest_path.parent
        for req_dir in REQUIRED_WORKSPACE_DIRS:
            target = workspace_dir / req_dir
            if not target.exists() or not target.is_dir():
                msg = f"Missing standard directory '{req_dir}/'"
                if strict:
                    errors.append(msg)
                else:
                    warnings.append(msg)
            else:
                checks_passed.append(f"Directory '{req_dir}/' exists")

        # Determine overall validity
        is_valid = len(errors) == 0
        if strict and len(warnings) > 0:
            is_valid = False

        total_checks = len(errors) + len(warnings) + len(checks_passed)
        score = round((len(checks_passed) / total_checks) * 100, 1) if total_checks > 0 else 0.0

        return {
            "valid": is_valid,
            "errors": errors,
            "warnings": warnings,
            "checks_passed": checks_passed,
            "score": score,
            "manifest_path": str(manifest_path)
        }
