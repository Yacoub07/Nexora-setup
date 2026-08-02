"""
Service for inspecting underlying operating system environment and binary tool dependencies.
"""

import os
import platform
import shutil
import subprocess
import sys
from typing import Any, Dict


class SystemService:
    """Provides platform details, Python specs, and Git binary inspection."""

    def get_python_version(self) -> tuple[int, int, int]:
        """Returns python version as a tuple (major, minor, micro)."""
        v = sys.version_info
        return (v.major, v.minor, v.micro)

    def get_python_version_string(self) -> str:
        """Returns formatted Python version string."""
        v = self.get_python_version()
        return f"{v[0]}.{v[1]}.{v[2]}"

    def is_python_compatible(self, min_major: int = 3, min_minor: int = 12) -> bool:
        """Verifies if current Python version meets requirement (>=3.12)."""
        v = self.get_python_version()
        return (v[0] > min_major) or (v[0] == min_major and v[1] >= min_minor)

    def get_os_info(self) -> Dict[str, str]:
        """Returns operating system specification details."""
        return {
            "system": platform.system(),
            "release": platform.release(),
            "architecture": platform.machine(),
            "python_executable": sys.executable,
        }

    def check_git_installed(self) -> Dict[str, Any]:
        """Verifies if git executable is present in PATH and retrieves its version."""
        git_path = shutil.which("git")
        if not git_path:
            return {"installed": False, "version": None, "path": None}

        try:
            res = subprocess.run(
                ["git", "--version"],
                capture_output=True,
                text=True,
                check=True,
                timeout=3
            )
            version_str = res.stdout.strip()
            return {"installed": True, "version": version_str, "path": git_path}
        except Exception as e:
            return {"installed": True, "version": f"Git found at {git_path} (error running --version: {e})", "path": git_path}

    def get_env_variable(self, name: str, default: str = "") -> str:
        """Reads environment variable with fallback."""
        return os.getenv(name, default)
