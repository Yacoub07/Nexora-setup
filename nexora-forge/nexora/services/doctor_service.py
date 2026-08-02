"""
Service for gathering system and environment diagnostic checks for `nexora doctor`.
"""

from pathlib import Path
from typing import Any, Dict, List
from nexora.core.version import VERSION
from nexora.services.system_service import SystemService
from nexora.services.workspace_service import WorkspaceService


class DoctorService:
    """Executes a suite of diagnostic tests to verify system readiness."""

    def __init__(
        self,
        system_service: SystemService | None = None,
        workspace_service: WorkspaceService | None = None
    ) -> None:
        self.system_service = system_service or SystemService()
        self.workspace_service = workspace_service or WorkspaceService()

    def run_diagnostics(self, target_path: Path | None = None) -> Dict[str, Any]:
        """Runs all diagnostic checks and compiles a comprehensive report."""
        path = (target_path or Path.cwd()).resolve()
        checks: List[Dict[str, Any]] = []

        # 1. Python Version Check
        py_str = self.system_service.get_python_version_string()
        is_py_ok = self.system_service.is_python_compatible(min_major=3, min_minor=12)
        checks.append({
            "category": "Environment",
            "name": "Python Version",
            "status": "PASS" if is_py_ok else "WARN",
            "message": f"Python {py_str} detected",
            "recommendation": None if is_py_ok else "Python 3.12+ recommended for optimal NEXORA features."
        })

        # 2. Operating System Check
        os_info = self.system_service.get_os_info()
        checks.append({
            "category": "Environment",
            "name": "Operating System",
            "status": "PASS",
            "message": f"{os_info['system']} {os_info['release']} ({os_info['architecture']})",
            "recommendation": None
        })

        # 3. Git Tooling Check
        git_info = self.system_service.check_git_installed()
        if git_info["installed"]:
            checks.append({
                "category": "Tooling",
                "name": "Git Integration",
                "status": "PASS",
                "message": f"{git_info['version']}",
                "recommendation": None
            })
        else:
            checks.append({
                "category": "Tooling",
                "name": "Git Integration",
                "status": "WARN",
                "message": "Git executable not found in PATH",
                "recommendation": "Install Git (https://git-scm.com/) for repository tracking."
            })

        # 4. Workspace Detection Check
        manifest = self.workspace_service.find_workspace_manifest(path)
        if manifest:
            checks.append({
                "category": "Workspace",
                "name": "Workspace Detection",
                "status": "PASS",
                "message": f"Detected NEXORA workspace manifest ({manifest.name})",
                "recommendation": None
            })
        else:
            checks.append({
                "category": "Workspace",
                "name": "Workspace Detection",
                "status": "WARN",
                "message": f"No NEXORA workspace manifest found in '{path.name}'",
                "recommendation": "Create a 'nexora.yaml' manifest or run workspace init."
            })

        # 5. Project Structure Check
        validation = self.workspace_service.validate_workspace(path)
        if validation["valid"]:
            checks.append({
                "category": "Workspace",
                "name": "Project Structure",
                "status": "PASS",
                "message": f"Structure valid (Score: {validation['score']}%)",
                "recommendation": None
            })
        elif validation["score"] > 0:
            checks.append({
                "category": "Workspace",
                "name": "Project Structure",
                "status": "WARN",
                "message": f"Structure has warnings ({len(validation['warnings'])} warnings)",
                "recommendation": "Run 'nexora workspace validate' for details."
            })
        else:
            checks.append({
                "category": "Workspace",
                "name": "Project Structure",
                "status": "FAIL",
                "message": "Uninitialized or invalid workspace directory",
                "recommendation": "Ensure workspace contains src/, tests/, docs/ folders."
            })

        # 6. Environment Readiness
        checks.append({
            "category": "Environment",
            "name": "CLI Version",
            "status": "PASS",
            "message": f"NEXORA Forge v{VERSION}",
            "recommendation": None
        })

        # Overall Status Computation
        has_fail = any(c["status"] == "FAIL" for c in checks)
        has_warn = any(c["status"] == "WARN" for c in checks)
        
        if has_fail:
            overall_status = "CRITICAL"
        elif has_warn:
            overall_status = "WARNING"
        else:
            overall_status = "HEALTHY"

        return {
            "overall_status": overall_status,
            "target_path": str(path),
            "checks": checks,
            "summary": {
                "total": len(checks),
                "pass": sum(1 for c in checks if c["status"] == "PASS"),
                "warn": sum(1 for c in checks if c["status"] == "WARN"),
                "fail": sum(1 for c in checks if c["status"] == "FAIL"),
            }
        }
