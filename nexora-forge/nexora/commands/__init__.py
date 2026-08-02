"""
Commands package initialization.
"""

from nexora.commands.doctor import app as doctor_app
from nexora.commands.version import app as version_app
from nexora.commands.workspace import app as workspace_app

__all__ = [
    "doctor_app",
    "version_app",
    "workspace_app",
]
